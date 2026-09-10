#!/usr/bin/env python3
"""Publica solo los recursos del sitio; no copia informes, scripts o instrucciones.
El directorio dist se crea de cero. No se elimina ni cambia la biblioteca fuente.

La salida pública no convierte estados de trabajo en «VALIDADO». Los textos completos
aprobados se aplican una sola vez fuera del build; durante la construcción solo se
comprueba su igualdad exacta cuando su integración está registrada.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path
from repair_routes import ROOT,PUBLIC_DIRS,PUBLIC_ROOT


def build():
    estado=ROOT/'editorial/integration/2026-09-10/estado-integracion.json'
    integrado=json.loads(estado.read_text(encoding='utf-8')) if estado.is_file() else {}

    # Las dos fichas históricamente gestionadas desde editorial/reviews se aplican
    # solo mientras no exista la integración completa de 420 descripciones. Una vez
    # integrada, volver a ejecutar ese publicador reintroduce los resúmenes antiguos.
    if 'descripciones_420' not in integrado:
        subprocess.run([sys.executable,str(ROOT/'scripts/apply_reviewed_entries.py')],cwd=ROOT,check=True)

    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_video_thumbnails.py'),'--apply-only'],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_language_updates.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_pending_support_english.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_home_support_english.py')],cwd=ROOT,check=True)

    # Las integraciones editoriales completas se aplican una sola vez. En cada build
    # posterior solo se comprueba que no hayan sido alteradas ni mezcladas de nuevo.
    if 'descripciones_420' in integrado:
        subprocess.run([sys.executable,str(ROOT/'scripts/apply_accessible_descriptions_420.py'),'--check'],cwd=ROOT,check=True)
    if 'condiciones_185' in integrado:
        subprocess.run([sys.executable,str(ROOT/'scripts/apply_condition_grades_185.py'),'--check'],cwd=ROOT,check=True)

    # Vida diaria conserva su publicador factual ya revisado.
    subprocess.run([sys.executable,str(ROOT/'scripts/publish_biblioteca.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_initial_data.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/repair_routes.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/publish_biblioteca.py')],cwd=ROOT,check=True)

    dst=ROOT/'dist'
    if dst.is_symlink():raise ValueError('dist no puede ser un enlace simbólico')
    if dst.exists():shutil.rmtree(dst)
    dst.mkdir()
    for name in PUBLIC_DIRS:
        p=ROOT/name
        if not p.is_dir():raise FileNotFoundError(p)
        shutil.copytree(p,dst/name,ignore=shutil.ignore_patterns('__pycache__','*.py','*.md','*.dc.html'))
    for name in PUBLIC_ROOT:
        p=ROOT/name
        if not p.is_file():raise FileNotFoundError(p)
        shutil.copy2(p,dst/name)

    # Presentaciones ya aprobadas: se conservan; estas tareas comprueban, no regeneran.
    subprocess.run([sys.executable,str(ROOT/'scripts/build_approved_navigation.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/sentidos_author.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/sueno_author.py'),'--root',str(dst)],cwd=ROOT,check=True)

    # Estados editoriales: retirar, nunca convertir en una afirmación de validación.
    subprocess.run([sys.executable,str(ROOT/'scripts/normalize_situation_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/validate_publication_statuses.py'),'--root',str(dst)],cwd=ROOT,check=True)

    # Vida diaria no muestra estados editoriales al público.
    subprocess.run([sys.executable,str(ROOT/'scripts/strip_daily_public_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Tarjetas Iris conserva la integración actual desde sus contextos, nunca desde portada.
    subprocess.run([sys.executable,str(ROOT/'scripts/connect_tarjetas_iris.py'),'--root',str(dst)],cwd=ROOT,check=True)

    # Última barrera: el build falla si cualquier estado provisional o grado retirado reaparece.
    subprocess.run([sys.executable,str(ROOT/'scripts/finalize_validation_labels.py'),'--root',str(dst)],cwd=ROOT,check=True)

    files=sorted(p.relative_to(dst).as_posix() for p in dst.rglob('*') if p.is_file())
    assert not any(p.startswith(('scripts/','reports/','editorial/','pt-br/','.github/','_audit/')) for p in files)
    out=ROOT/'reports/routes';out.mkdir(parents=True,exist_ok=True)
    (out/'build.json').write_text(json.dumps({'publish':'dist','files':len(files),'html':sum(p.endswith('.html') for p in files),'excluded_directories':['scripts','reports','editorial','pt-br','.github/','_audit/'],'roots':sorted(p.name for p in dst.iterdir())},ensure_ascii=False,indent=2)+'\n')
    print('Directorio público:',len(files),'archivos; fuentes e informes permanecen fuera de dist.')
    return dst

if __name__=='__main__':build()
