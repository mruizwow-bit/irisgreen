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
    # Las fichas con manifiesto documental se aplican sin reescribir el resto.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_reviewed_entries.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_video_thumbnails.py'),'--apply-only'],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_language_updates.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_pending_support_english.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_home_support_english.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_initial_data.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/repair_routes.py')],cwd=ROOT,check=True)
    # Estados documentales y referencias normativas: no reescribe el contenido de las fichas.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_validation_framework.py')],cwd=ROOT,check=True)
    # Conserva las letras fijadas y alinea solo los nombres del registro con los títulos reales del catálogo.
    subprocess.run([sys.executable,str(ROOT/'scripts/align_condition_classification_titles.py')],cwd=ROOT,check=True)
    # Distribución editorial final de las 185 fichas: 21 A, 40 B, 44 C, 54 BP y 26 SG.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_condition_classifications.py')],cwd=ROOT,check=True)
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
    files=sorted(p.relative_to(dst).as_posix() for p in dst.rglob('*') if p.is_file())
    assert not any(p.startswith(('scripts/','reports/','editorial/','pt-br/','.github/','_audit/')) for p in files)
    out=ROOT/'reports/routes';out.mkdir(parents=True,exist_ok=True)
    (out/'build.json').write_text(json.dumps({'publish':'dist','files':len(files),'html':sum(p.endswith('.html') for p in files),'excluded_directories':['scripts','reports','editorial','pt-br','.github','_audit'],'roots':sorted(p.name for p in dst.iterdir())},ensure_ascii=False,indent=2)+'\n')
    print('Directorio público:',len(files),'archivos; fuentes e informes permanecen fuera de dist.')
    return dst

if __name__=='__main__':build()
