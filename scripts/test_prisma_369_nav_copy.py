#!/usr/bin/env python3
from pathlib import Path
import html,re,json

ROOT=Path(__file__).resolve().parent.parent
PUBLIC=ROOT/'dist' if (ROOT/'dist').is_dir() else ROOT
OUT=ROOT/'reports'/'prisma-369-nav-copy';OUT.mkdir(parents=True,exist_ok=True)

CRUMB=re.compile(r'<p\b(?=[^>]*class=["\'][^"\']*\bcrumb\b[^"\']*["\'])[^>]*>.*?</p>',re.I|re.S)
SITUATION_NOTICE=re.compile(
    r'<p\b(?=[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'])[^>]*>'
    r'(?:(?!</p>).)*(?:Esta página describe una situación del día a día|This page describes an everyday situation)'
    r'.*?</p>',re.I|re.S
)

def plain(s):
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]+>',' ',s))).strip()

def read(rel):
    return (PUBLIC/rel).read_text(encoding='utf-8')

def main():
    htmls=[]
    for base in (PUBLIC/'es',PUBLIC/'en'):
        if base.is_dir():htmls.extend(p for p in base.rglob('*.html') if p.is_file())
    for p in (PUBLIC/'index.html',PUBLIC/'en'/'index.html'):
        if p.is_file():htmls.append(p)

    bad_crumb=[]
    for p in sorted(set(htmls)):
        txt=p.read_text(encoding='utf-8')
        for m in CRUMB.finditer(txt):
            if re.search(r'(^|\s)(Inicio|Home)(\s|$|›|>)',plain(m.group(0)),re.I):
                bad_crumb.append(p.relative_to(PUBLIC).as_posix());break
    assert not bad_crumb,('Inicio/Home crumbs remain',bad_crumb[:20])

    situation_files=[]
    repeated=[]
    for pattern in ('es/situaciones/*/index.html','en/situations/*/index.html'):
        for p in PUBLIC.glob(pattern):
            if not p.is_file():continue
            situation_files.append(p)
            if SITUATION_NOTICE.search(p.read_text(encoding='utf-8')):
                repeated.append(p.relative_to(PUBLIC).as_posix())
    assert not repeated,('Repeated situation disclaimer remains',repeated[:20])

    checks={
      'conditions_es':read('es/neurodiversidad/condiciones/index.html'),
      'conditions_en':read('en/neurodiversity/conditions/index.html'),
      'situations_es':read('es/situaciones/index.html'),
      'situations_en':read('en/situations/index.html'),
      'data_es':read('es/datos/index.html'),
      'condition_inner':read('es/neurodiversidad/condiciones/autismo/index.html'),
      'situation_inner':read('es/situaciones/cambiar-de-una-tarea-a-otra-me-bloquea/index.html'),
      'everyday_inner':read('es/biblioteca/dinero-contratos-formularios-y-tramites/index.html')
    }
    assert '<p class="lede">Información clara sobre condiciones, experiencias e identidades.</p>' in checks['conditions_es']
    assert '<p class="lede">Clear information about conditions, experiences and identities.</p>' in checks['conditions_en']
    assert 'All 185 entries are mounted' not in checks['conditions_en']
    assert 'Cada una dice qué ayuda' not in checks['conditions_es']
    assert 'Each one says what helps' not in checks['conditions_en']

    assert '<p class="lede">Situaciones del día a día y apoyos prácticos para entenderlas y afrontarlas.</p>' in checks['situations_es']
    assert '<p class="lede">Everyday situations and practical support to understand and handle them.</p>' in checks['situations_en']
    assert 'Esta página describe una situación del día a día' not in checks['situations_es']
    assert 'This page describes an everyday situation' not in checks['situations_en']

    for key in ('data_es','condition_inner','situation_inner','everyday_inner'):
        for m in CRUMB.finditer(checks[key]):
            assert not re.search(r'(^|\s)(Inicio|Home)(\s|$|›|>)',plain(m.group(0)),re.I),(key,plain(m.group(0)))

    report={
      'gate':'ISSUE_369_P20_P21_P22_P24_P25_P34_NAV_COPY_PASS',
      'html_pages_checked':len(set(htmls)),
      'situation_inner_pages_checked':len(situation_files),
      'redundant_inicio_home_crumbs':0,
      'repeated_situation_disclaimers':0,
      'conditions_header':'PASS',
      'situations_header':'PASS',
      'data_inicio':'REMOVED',
      'passed':True
    }
    (OUT/'qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
