#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, subprocess, sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
OUT=Path('/tmp/iris-format-sleep')
BASE='f14ad41dc99e497abe3bc774373658fecbe8b2a0'
BACKUP='backup/20260910-0711-antes-formato-sentidos-sueno'
SOURCE='editorial/reviews/situaciones_sueno_ES_EN.md'
SOURCE_SHA='d8df5797d04c1c854a6dbb01c222ab51d8f88bc987037adb9bd1c05b13400a9e'
SENSES_SOURCE='editorial/reviews/situaciones_sentidos_ES_EN.md'
SENSES_SHA='aa3dfe924b5897c3686ac4a332267fbb034c47cb83eb1af47dbe4e6608d81b78'
MARKER='/* V24 · fichas finales: ancho y escala de lectura */'
CSS_BLOCK=r'''

/* V24 · fichas finales: ancho y escala de lectura */
/* Solo las páginas finales que usan article.ficha. Los listados, la portada,
   Metodología y la ficha nueva de instrucciones conservan su propio diseño. */
main:has(>article.ficha){
  width:min(calc((100vw - 2rem)/var(--ig-reading-scale,1)),70rem);
  max-width:70rem;
  padding:clamp(1.75rem,4vw,3rem) clamp(1.125rem,3vw,2rem) 4.5rem;
}
main:has(>article.ficha)>article.ficha{
  width:100%;
  max-width:none;
  font-size:1.125rem;
  line-height:1.72;
}
main:has(>article.ficha)>article.ficha>h1{
  font-size:clamp(2rem,1.45rem + 2vw,3rem);
  line-height:1.12;
  margin:.2em 0 .45em;
}
main:has(>article.ficha) .crumb{font-size:.95rem;line-height:1.55}
main:has(>article.ficha) .chip{font-size:.88rem}
main:has(>article.ficha) .notice{font-size:1.02rem;line-height:1.65;margin-bottom:2rem}
main:has(>article.ficha) .lede{font-size:1.1em;line-height:1.7}
main:has(>article.ficha) .sec{padding:1.45rem 0}
main:has(>article.ficha) .sec h2{font-size:1.42rem;line-height:1.32;margin-bottom:.65rem}
main:has(>article.ficha) .sec :is(p,li){line-height:1.72}
main:has(>article.ficha) .muted{font-size:1rem;line-height:1.65}
@media(max-width:43.99rem){
  main:has(>article.ficha){padding:1.5rem 1.125rem 3.5rem}
  main:has(>article.ficha)>article.ficha{font-size:1.0625rem}
  main:has(>article.ficha)>article.ficha>h1{font-size:clamp(1.9rem,9vw,2.45rem)}
  main:has(>article.ficha) .sec h2{font-size:1.32rem}
  main:has(>article.ficha) .notice{font-size:1rem}
}
'''
README='''# Sueño: texto aprobado de la autora

El original situaciones_sueno_ES_EN.md se conserva exactamente como fue enviado. Se importan sus 23 títulos españoles y 46 descripciones ES/EN, sin resumen adicional. Las descripciones se sincronizan en cada ficha, las tarjetas del listado, el índice buscador.json y los metadatos. Los títulos ingleses no figuran en el documento y se conservan los existentes. Las rutas no cambian.

El resto de los apartados, fuentes, fechas de revisión documental, avisos, robots, colores, tipografías y controles no se modifican. Esta importación no acredita una revisión completa de las fichas ni una nueva comprobación de las fuentes.

scripts/sueno_author.py --apply se utiliza una sola vez para incorporar el texto. Durante la construcción se ejecuta únicamente la comprobación de igualdad exacta. Si otra tarea altera las descripciones protegidas, la publicación se detiene: no se restaura ni reescribe contenido automáticamente. Una nueva corrección aprobada debe actualizar el documento, su huella y el manifiesto conjuntamente.
'''

def run(*args, capture=False):
    kw={'cwd':ROOT,'check':True,'text':True}
    if capture: kw['stdout']=subprocess.PIPE
    return subprocess.run(args,**kw)

def sha(path: Path): return hashlib.sha256(path.read_bytes()).hexdigest()
def hashes(root: Path): return {p.relative_to(root).as_posix():sha(p) for p in root.rglob('*') if p.is_file()}

def preflight():
    OUT.mkdir(parents=True,exist_ok=True)
    run('git','fetch','origin','main',BACKUP,'--quiet')
    assert run('git','rev-parse','origin/main',capture=True).stdout.strip()==BASE
    assert run('git','rev-parse','origin/'+BACKUP,capture=True).stdout.strip()==BASE
    assert sha(ROOT/SOURCE)==SOURCE_SHA
    assert sha(ROOT/SENSES_SOURCE)==SENSES_SHA
    (OUT/'preflight.json').write_text(json.dumps({'base':BASE,'backup':BACKUP,'source_sha256':SOURCE_SHA,'sentidos_source_sha256':SENSES_SHA},indent=2))

def build(log_name):
    with (OUT/log_name).open('w') as f:
        subprocess.run([sys.executable,'scripts/build_site.py'],cwd=ROOT,check=True,text=True,stdout=f,stderr=subprocess.STDOUT)

def prepare():
    preflight()
    build('baseline-build.log')
    before=hashes(ROOT/'dist'); (OUT/'baseline.json').write_text(json.dumps(before,indent=2))
    assert len(before)>1500
    run('git','restore','--worktree','.')
    # Restore committed work-branch files after resetting generated build changes.
    assert (ROOT/SOURCE).exists() and (ROOT/'scripts/sueno_author.py').exists()
    run(sys.executable,'scripts/sueno_author.py','--apply')
    css=ROOT/'assets/site-v23.css'; s=css.read_text()
    assert MARKER not in s
    css.write_text(s+CSS_BLOCK)
    buildfile=ROOT/'scripts/build_site.py'; s=buildfile.read_text()
    needle="    subprocess.run([sys.executable,str(ROOT/'scripts/sentidos_author.py'),'--root',str(dst)],cwd=ROOT,check=True)\n"
    assert s.count(needle)==1
    s=s.replace(needle,needle+"    subprocess.run([sys.executable,str(ROOT/'scripts/sueno_author.py'),'--root',str(dst)],cwd=ROOT,check=True)\n")
    buildfile.write_text(s)
    (ROOT/'editorial/reviews/SUENO-README.md').write_text(README)
    build('changed-build.log')
    with (OUT/'sentidos-check.json').open('w') as f: subprocess.run([sys.executable,'scripts/sentidos_author.py','--root','dist'],cwd=ROOT,check=True,text=True,stdout=f)
    with (OUT/'sueno-check.json').open('w') as f: subprocess.run([sys.executable,'scripts/sueno_author.py','--root','dist'],cwd=ROOT,check=True,text=True,stdout=f)
    after=hashes(ROOT/'dist')
    manifest=json.loads((ROOT/'editorial/reviews/situaciones-sueno-manifest.json').read_text())
    sleep_pages=sorted([e[k] for e in manifest['entries'] for k in ('es_path','en_path')])
    expected=sorted(sleep_pages+['es/situaciones/index.html','en/situations/index.html','buscador.json','assets/site-v23.css'])
    changed=sorted(p for p in before.keys()&after.keys() if before[p]!=after[p])
    added=sorted(after.keys()-before.keys()); removed=sorted(before.keys()-after.keys())
    assert changed==expected, {'unexpected':sorted(set(changed)-set(expected)),'missing':sorted(set(expected)-set(changed))}
    assert not added and not removed,(added,removed)
    protected=['es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html','en/situations/i-need-instructions-repeated/index.html']
    assert all(before[p]==after[p] for p in protected)
    senses=json.loads((ROOT/'editorial/reviews/situaciones-sentidos-manifest.json').read_text())
    for e in senses['entries']:
        assert before[e['es_path']]==after[e['es_path']]
        assert before[e['en_path']]==after[e['en_path']]
    groups={'conditions':0,'situations':0,'data':0,'daily':0};outside=[]
    for p in (ROOT/'dist').rglob('*.html'):
        rel=p.relative_to(ROOT/'dist').as_posix();text=p.read_text(errors='ignore')
        if '<article class="ficha">' not in text:continue
        if rel.startswith(('es/neurodiversidad/condiciones/','en/neurodiversity/conditions/')):groups['conditions']+=1
        elif rel.startswith(('es/situaciones/','en/situations/')):groups['situations']+=1
        elif rel.startswith(('es/datos/','en/data/')):groups['data']+=1
        elif rel.startswith(('es/biblioteca/','en/everyday-life/')):groups['daily']+=1
        else:outside.append(rel)
    assert not outside,outside
    assert groups=={'conditions':370,'situations':372,'data':98,'daily':96},groups
    report={'before_files':len(before),'after_files':len(after),'changed_public_files':len(changed),'changed':changed,'added':added,'removed':removed,'legacy_detail_pages_using_shared_format':sum(groups.values()),'groups':groups,'sentidos_unchanged_pages':48,'approved_instruction_unchanged_pages':2}
    (OUT/'public-diff.json').write_text(json.dumps(report,indent=2,ensure_ascii=False))
    final_files=['assets/site-v23.css','scripts/build_site.py','editorial/reviews/situaciones-sueno-manifest.json','editorial/reviews/SUENO-README.md','buscador.json','es/situaciones/index.html','en/situations/index.html']+sleep_pages
    (OUT/'final-files.json').write_text(json.dumps(sorted(final_files+['scripts/sueno_author.py',SOURCE]),indent=2))
    print(json.dumps(report,indent=2,ensure_ascii=False))

def commit():
    files=json.loads((OUT/'final-files.json').read_text())
    # Source and importer were committed earlier on this work branch; generated changes are staged now.
    generated=[p for p in files if subprocess.run(['git','diff','--quiet','HEAD','--',p],cwd=ROOT).returncode!=0]
    run('git','config','user.name','github-actions[bot]');run('git','config','user.email','41898282+github-actions[bot]@users.noreply.github.com')
    run('git','add','--',*generated)
    staged=run('git','diff','--cached','--name-only',capture=True).stdout.splitlines()
    assert set(staged)==set(generated),(set(staged)-set(generated),set(generated)-set(staged))
    run('git','commit','-m','Integrar Sueño ES EN y ampliar las fichas finales tras verificar [skip netlify]')
    commit=run('git','rev-parse','HEAD',capture=True).stdout.strip();(OUT/'validated-commit.txt').write_text(commit+'\n')
    run('git','push','origin','HEAD:mejora/formato-y-sueno-20260910')
    print(commit)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('mode',choices=['prepare','commit']);a=ap.parse_args()
    {'prepare':prepare,'commit':commit}[a.mode]()
