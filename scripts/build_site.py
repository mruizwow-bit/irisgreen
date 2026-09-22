#!/usr/bin/env python3
"""Publica solo los recursos del sitio; no copia informes, scripts o instrucciones.
El directorio dist se crea de cero. La construcción normal se ejecuta dentro de
una copia temporal del repositorio para que ningún script de publicación pueda
modificar la fuente real.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from repair_routes import ROOT,PUBLIC_DIRS,PUBLIC_ROOT

STAGING_ENV='IRISGREEN_BUILD_STAGING'


# W07-R1 · elementos necesarios en source/QA pero no en el artefacto público.
# La lista está congelada por el QA de build hygiene; no elimina ni modifica
# estas fuentes, únicamente impide que la copia pública las introduzca en dist.
PUBLIC_EXCLUDE_PATHS=frozenset({
    'es/investigacion/_import/parte-01.xz.b64',
    'es/investigacion/_import/parte-02.xz.b64',
    'es/investigacion/_import/parte-03.xz.b64',
    'es/investigacion/_import/parte-04.xz.b64',
    'es/investigacion/_import/parte-05.xz.b64',
    'assets/muestras/luma/p01.jpg.b64',
    'assets/books/samples/luma-es/sprite.part1.txt',
    'assets/books/samples/luma-es/sprite.part2.txt',
    'assets/books/samples/luma-es/sprite.part3.txt',
    'es/intereses/catalogo.json',
    'en/interests/catalogue.json',
    'es/intereses/estrellas-constelaciones.json',
    'es/intereses/estrellas-tanda2.json',
    'es/intereses/videos-intereses.json',
    'assets/video-thumbnails/manifest.json',
    'img/juegos-coleccion/manifest.json',
    'assets/mulberry-rutinas/sources.csv',
})


def _public_copy_ignore(src: str, names: list[str]) -> set[str]:
    """Excluye de la copia pública solo los paths W07-R1 congelados."""
    src_path=Path(src)
    ignored=set()
    for name in names:
        candidate=src_path/name
        try:
            rel=candidate.relative_to(ROOT).as_posix()
        except ValueError:
            continue
        if rel in PUBLIC_EXCLUDE_PATHS:
            ignored.add(name)
    # Mantener también las exclusiones genéricas históricas del build.
    ignored.update(
        name for name in names
        if name=='__pycache__' or name.endswith(('.py','.md','.dc.html'))
    )
    return ignored


def _copy_repo_to_staging(stage: Path) -> None:
    """Copia los insumos del repositorio a una raíz temporal desechable."""
    ignore=shutil.ignore_patterns('.git','dist','.baseline','__pycache__','*.pyc')
    shutil.copytree(ROOT,stage,ignore=ignore)


def _git_state(root: Path) -> bytes:
    """Estado exacto del árbol real para demostrar que el build no lo altera."""
    return subprocess.check_output(
        ['git','status','--porcelain=v1','--untracked-files=all'],cwd=root
    )


def _build_in_staging():
    """Ejecuta este mismo build sobre una copia temporal y devuelve solo dist."""
    before=_git_state(ROOT)
    with tempfile.TemporaryDirectory(prefix='irisgreen-build-') as tmp:
        stage=Path(tmp)/'repo'
        _copy_repo_to_staging(stage)
        env=os.environ.copy();env[STAGING_ENV]='1'
        subprocess.run([sys.executable,str(stage/'scripts/build_site.py')],cwd=stage,env=env,check=True)
        staged_dist=stage/'dist'
        if not staged_dist.is_dir():raise FileNotFoundError(staged_dist)
        dst=ROOT/'dist'
        if dst.is_symlink():raise ValueError('dist no puede ser un enlace simbólico')
        if dst.exists():shutil.rmtree(dst)
        shutil.copytree(staged_dist,dst)
    after=_git_state(ROOT)
    if after!=before:
        raise AssertionError('El build ha modificado la fuente real:\n'+after.decode('utf-8',errors='replace'))
    return ROOT/'dist'


def build():
    if os.environ.get(STAGING_ENV)!='1':
        return _build_in_staging()

    # A partir de aquí cualquier escritura ocurre únicamente dentro de staging.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_reviewed_entries.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_video_thumbnails.py'),'--apply-only'],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_language_updates.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_pending_support_english.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_home_support_english.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/publish_biblioteca.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/prepare_initial_data.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/repair_routes.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/publish_biblioteca.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_auditoria_420_relaciones.py'),'--root',str(ROOT)],cwd=ROOT,check=True)
    # España ya va incrustada en la pantalla inicial del Directorio. Los otros países
    # se solicitan únicamente cuando la persona los elige.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_directorio_lazy.py')],cwd=ROOT,check=True)

    dst=ROOT/'dist'
    if dst.is_symlink():raise ValueError('dist no puede ser un enlace simbólico')
    if dst.exists():shutil.rmtree(dst)
    dst.mkdir()
    for name in PUBLIC_DIRS:
        p=ROOT/name
        if not p.is_dir():raise FileNotFoundError(p)
        shutil.copytree(p,dst/name,ignore=_public_copy_ignore)
    for name in PUBLIC_ROOT:
        p=ROOT/name
        if not p.is_file():raise FileNotFoundError(p)
        shutil.copy2(p,dst/name)

    # Los SVG se publican limpios en dist. La fuente permanece intacta y el propio
    # saneador falla si cambia fill/stroke, reaparece C2PA/metadata o no es idempotente.
    subprocess.run([sys.executable,str(ROOT/'scripts/strip_svg_metadata.py'),'--source',str(ROOT/'assets'),'--dest',str(dst/'assets')],cwd=ROOT,check=True)

    subprocess.run([sys.executable,str(ROOT/'scripts/build_approved_navigation.py')],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_resources_navigation.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/sentidos_author.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/sueno_author.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/run_accessibility_descriptions_part1.py'),'--root',str(dst),'--apply'],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/normalize_situation_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/validate_publication_statuses.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/finalize_validation_labels.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/strip_daily_public_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/connect_tarjetas_iris.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/connect_tarjetas_iris_en.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Tarjetas Iris afirma públicamente que lo escrito no se guarda. El conector
    # histórico añadía persistencia local; se retira del artefacto antes de publicar.
    subprocess.run([sys.executable,str(ROOT/'scripts/remove_tarjetas_storage.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Copiar texto mantiene una etiqueta estable y anuncia éxito/error mediante role=status.
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_tarjetas_copy_status.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Las 420 tarjetas que viven dentro de fichas son resúmenes de esa ficha, no
    # formularios: quedan rellenas y sin edición. La herramienta personal sigue editable.
    subprocess.run([sys.executable,str(ROOT/'scripts/finalize_tarjetas_iris_static.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_accessibility_release.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Correcciones funcionales sin cambios de presentación.
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_search_accessible_names.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_video_external_links.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Contenedores con aria-label deben exponer un rol que soporte ese nombre.
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_named_group_roles.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Lighthouse detectó contraste insuficiente en las dos etiquetas de filtro de
    # Investigación; esta corrección acotada actúa sobre el artefacto final.
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_investigacion_contrast.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Investigación conserva el fallback completo sin JavaScript, pero la interfaz
    # activa carga los 120 registros desde el JSON canónico tras montar el shell.
    subprocess.run([sys.executable,str(ROOT/'scripts/defer_investigacion_data.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Las utilidades de impresión son noindex, pero conservan metadatos y semántica propios.
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_interests_print_page.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_taller_print_page.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Libros y Directorio conservan sus plantillas interactivas, pero publican además
 # una versión legible sin JavaScript construida desde sus propios datos.
    subprocess.run([sys.executable,str(ROOT/'scripts/prerender_remaining_nojs.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Las parejas ES/EN de Situaciones ya están declaradas en buscador.json.
    # Publicar hreflang desde esa relación explícita; nunca deducir parejas por título.
    subprocess.run([sys.executable,str(ROOT/'scripts/apply_hreflang_pairs.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Siete Condiciones ya tienen pareja ES/EN explícita y se publican de forma recíproca.
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_condition_hreflang.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # SEO técnico: solo metadatos; no modifica el contenido visible.
    subprocess.run([sys.executable,str(ROOT/'scripts/fix_seo_metadata.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/audit_sin_estados_publicos.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/audit_420_relaciones.py'),'--root',str(dst)],cwd=ROOT,check=True)
    # Último paso: cerrar la deuda de las 24 plantillas sin cambiar sus interfaces.
    subprocess.run([sys.executable,str(ROOT/'scripts/finalize_dc_runtime_csp.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/audit_template_runtime_scope.py'),'--root',str(dst)],cwd=ROOT,check=True)
    subprocess.run([sys.executable,str(ROOT/'scripts/check_csp_eval_scope.py'),'--root',str(dst)],cwd=ROOT,check=True)

    files=sorted(p.relative_to(dst).as_posix() for p in dst.rglob('*') if p.is_file())
    leaked=sorted(PUBLIC_EXCLUDE_PATHS.intersection(files))
    if leaked:
        raise AssertionError('W07-R1 paths publicados por error: '+repr(leaked))
    assert not any(p.startswith(('scripts/','reports/','editorial/','pt-br/','.github/','_audit/')) for p in files)
    out=ROOT/'reports/routes';out.mkdir(parents=True,exist_ok=True)
    (out/'build.json').write_text(json.dumps({'publish':'dist','files':len(files),'html':sum(p.endswith('.html') for p in files),'excluded_directories':['scripts','reports','editorial','pt-br','.github/','_audit/'],'roots':sorted(p.name for p in dst.iterdir())},ensure_ascii=False,indent=2)+'\n')
    print('Directorio público:',len(files),'archivos; fuentes e informes permanecen fuera de dist.')
    return dst

if __name__=='__main__':build()
