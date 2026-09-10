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


def run(script,*args):
    subprocess.run([sys.executable,str(ROOT/'scripts'/script),*map(str,args)],cwd=ROOT,check=True)


def build():
    # Estas dos fichas se editan en editorial/reviews; el resto conserva su origen.
    run('apply_reviewed_entries.py')
    run('prepare_video_thumbnails.py','--apply-only')
    run('apply_language_updates.py')
    run('apply_pending_support_english.py')
    run('fix_home_support_english.py')

    # Las correcciones factuales de Vida diaria se aplican antes de la entrega
    # editorial de 420 descripciones para no sobrescribir los textos aprobados.
    run('publish_biblioteca.py')
    run('prepare_initial_data.py')
    run('repair_routes.py')
    run('publish_biblioteca.py')

    # Fuente única de los 420 resúmenes aprobados ES/EN y de las 185 letras finales.
    # El script falla si una ficha no encuentra una correspondencia uno-a-uno.
    run('apply_accessible_descriptions_420.py')

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

    # Navegación aprobada. Se vuelve a aplicar la fuente editorial después porque
    # este paso histórico también reconstruye una ficha de Situaciones.
    run('build_approved_navigation.py')
    run('apply_accessible_descriptions_420.py','--root',str(dst))

    # El normalizador antiguo conserva la indexabilidad, pero el estado editorial
    # ya no debe mostrarse al público. El último paso elimina esos rótulos/estados.
    run('normalize_situation_status.py','--root',str(dst))
    run('validate_publication_statuses.py','--root',str(dst))
    run('finalize_validation_labels.py','--root',str(dst))

    # Comprobación final literal: 420 ES + 420 EN, tarjetas, buscador y 185 grados.
    run('apply_accessible_descriptions_420.py','--root',str(dst),'--check')

    files=sorted(p.relative_to(dst).as_posix() for p in dst.rglob('*') if p.is_file())
    assert not any(p.startswith(('scripts/','reports/','editorial/','pt-br/','.github/','_audit/')) for p in files)
    out=ROOT/'reports/routes';out.mkdir(parents=True,exist_ok=True)
    (out/'build.json').write_text(json.dumps({'publish':'dist','files':len(files),'html':sum(p.endswith('.html') for p in files),'excluded_directories':['scripts','reports','editorial','pt-br','.github/','_audit/'],'roots':sorted(p.name for p in dst.iterdir())},ensure_ascii=False,indent=2)+'\n')
    print('Directorio público:',len(files),'archivos; fuentes e informes permanecen fuera de dist.')
    return dst

if __name__=='__main__':build()
