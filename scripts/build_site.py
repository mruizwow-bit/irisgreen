#!/usr/bin/env python3
"""Publica solo los recursos del sitio; no copia informes, scripts o instrucciones.
El directorio dist se crea de cero. No se elimina ni cambia la biblioteca fuente.
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
    # Este publicador ya no decide robots: la indexación vive en la fuente de cada ficha.
    subprocess.run([sys.executable,str(ROOT/'scripts/publish_biblioteca.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_initial_data.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/repair_routes.py')],cwd=ROOT,check=True)
    # Segunda pasada idempotente: conserva las correcciones editoriales de Biblioteca
    # si una reparación intermedia reescribe alguna de sus páginas.
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
    # Publish only the homepage and instructions-entry presentation approved by the author.
    subprocess.run([sys.executable,str(ROOT/'scripts/build_approved_navigation.py')],cwd=ROOT,check=True)
    # Verify the author's approved wording; never regenerate or rewrite it.
    subprocess.run([sys.executable,str(ROOT/'scripts/sentidos_author.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/sueno_author.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Aplicar literalmente la copia de accesibilidad aprobada para la parte 1 de Situaciones.
    # El integrador preserva títulos ingleses, rutas, fuentes, controles y secciones clínicas.
    subprocess.run([sys.executable,str(ROOT/'scripts/run_accessibility_descriptions_part1.py'),'--root',str(dst),'--apply'],cwd=ROOT,check=True)
    # Normalizar únicamente el atributo técnico de estado de las fichas de Situaciones.
    subprocess.run([sys.executable,str(ROOT/'scripts/normalize_situation_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Los estados editoriales se retiran DESPUÉS de comprobar los textos protegidos.
    # Esta tarea no modifica descripciones, fuentes ni grados A/B/C.
    subprocess.run([sys.executable,str(ROOT/'scripts/validate_publication_statuses.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Investigación ya está publicada en es/investigacion y se copia a dist con el resto del sitio.
    # No reconstruirla aquí desde un segundo payload: evitar dos fuentes para la misma página.
    # Cerrar los rótulos antiguos de revisión que sobreviven en plantillas históricas.
    subprocess.run([sys.executable,str(ROOT/'scripts/finalize_validation_labels.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Vida diaria no muestra estados editoriales al público. Esta última pasada
    # elimina de la salida pública cualquier rótulo que un publicador antiguo reintroduzca.
    subprocess.run([sys.executable,str(ROOT/'scripts/strip_daily_public_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Tarjetas Iris se conecta desde sus contextos, nunca desde la portada.
    subprocess.run([sys.executable,str(ROOT/'scripts/connect_tarjetas_iris.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Fuentes locales, impresión común y retirada definitiva de Google Fonts.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_accessibility_release.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Contrato permanente: ningún estado editorial puede reaparecer en la salida pública.
    subprocess.run([sys.executable,str(ROOT/'scripts/audit_sin_estados_publicos.py'),'--root',str(dst)],cwd=ROOT,check=True)
    files=sorted(p.relative_to(dst).as_posix() for p in dst.rglob('*') if p.is_file())
    assert not any(p.startswith(('scripts/','reports/','editorial/','pt-br/','.github/','_audit/')) for p in files)
    out=ROOT/'reports/routes';out.mkdir(parents=True,exist_ok=True)
    (out/'build.json').write_text(json.dumps({'publish':'dist','files':len(files),'html':sum(p.endswith('.html') for p in files),'excluded_directories':['scripts','reports','editorial','pt-br','.github/','_audit/'],'roots':sorted(p.name for p in dst.iterdir())},ensure_ascii=False,indent=2)+'\n')
    print('Directorio público:',len(files),'archivos; fuentes e informes permanecen fuera de dist.')
    return dst

if __name__=='__main__':build()
