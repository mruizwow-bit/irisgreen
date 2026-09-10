#!/usr/bin/env python3
"""Publica solo los recursos del sitio; no copia informes, scripts o instrucciones.
El directorio dist se crea de cero. No se elimina ni cambia la biblioteca fuente.

Rama de reparación forense: el build NO debe reescribir, reclasificar ni marcar como
validados contenidos editoriales mientras se reconstruye la fuente correcta de las
420 fichas y las 185 condiciones.
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path
from repair_routes import ROOT,PUBLIC_DIRS,PUBLIC_ROOT


def build():
    # Estas dos fichas se editan en editorial/reviews; el resto conserva su origen.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_reviewed_entries.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_video_thumbnails.py'),'--apply-only'],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_language_updates.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_pending_support_english.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_home_support_english.py')],cwd=ROOT,check=True)
    # Las 48 fichas españolas de Vida diaria fueron revisadas y contrastadas el 10-09-2026.
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

    # Presentaciones ya aprobadas: se conservan.
    subprocess.run([sys.executable,str(ROOT/'scripts/build_approved_navigation.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/sentidos_author.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/sueno_author.py'),'--root',str(dst)],cwd=ROOT,check=True)

    # IMPORTANTE: durante la reparación no se ejecutan aquí los antiguos procesos
    # run_accessibility_descriptions_part1.py, normalize_situation_status.py,
    # validate_publication_statuses.py ni finalize_validation_labels.py. Esos procesos
    # podían combinar texto nuevo con cuerpos/fuentes antiguos y después mostrar
    # VALIDADO sin haber integrado primero las correcciones editoriales completas.
    # La integración definitiva se aplicará desde una única fuente completa y auditada.

    # Vida diaria no muestra estados editoriales al público.
    subprocess.run([sys.executable,str(ROOT/'scripts/strip_daily_public_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Tarjetas Iris se conecta desde sus contextos, nunca desde la portada.
    subprocess.run([sys.executable,str(ROOT/'scripts/connect_tarjetas_iris.py'),'--root',str(dst)],cwd=ROOT,check=True)

    files=sorted(p.relative_to(dst).as_posix() for p in dst.rglob('*') if p.is_file())
    assert not any(p.startswith(('scripts/','reports/','editorial/','pt-br/','.github/','_audit/')) for p in files)
    out=ROOT/'reports/routes';out.mkdir(parents=True,exist_ok=True)
    (out/'build.json').write_text(json.dumps({'publish':'dist','files':len(files),'html':sum(p.endswith('.html') for p in files),'excluded_directories':['scripts','reports','editorial','pt-br','.github/','_audit/'],'roots':sorted(p.name for p in dst.iterdir())},ensure_ascii=False,indent=2)+'\n')
    print('Directorio público:',len(files),'archivos; fuentes e informes permanecen fuera de dist.')
    return dst

if __name__=='__main__':build()
