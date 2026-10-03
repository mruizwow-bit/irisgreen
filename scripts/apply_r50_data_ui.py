#!/usr/bin/env python3
"""R50 A2 · apply R42/R02 transversal UI to Data and #369 P30-P33 hub."""
from __future__ import annotations
import argparse,json,re,unicodedata
from html import escape
from pathlib import Path

BODY_RE=re.compile(r"<body\b([^>]*)>",re.I)
MAIN_RE=re.compile(r"<main\b([^>]*)>",re.I)
CARD_RE=re.compile(r'<a class="card"([^>]*)>(.*?)</a>',re.I|re.S)
CHIP_RE=re.compile(r'<span class="chip">(.*?)</span>',re.I|re.S)
TITLE_RE=re.compile(r'<strong>(.*?)</strong>',re.I|re.S)
ASSETS=(
 ('css','/assets/ig-r42-materials.css?v=r50-data-1'),
 ('css','/assets/ig-audience.css?v=r50-data-1'),
 ('css','/assets/ig-r49-transversal.css?v=r50-data-1'),
 ('css','/assets/ig-data-hub-r50.css?v=369-p30-p33-1'),
 ('js','/assets/ig-r49-lang-bootstrap.js?v=r50-data-1'),
 ('js','/assets/ig-audience.js?v=r50-data-1'),
 ('js','/assets/ig-child-safe.js?v=r50-data-1'),
 ('js','/assets/interfaz-comun.js?v=r50-data-1'),
 ('js','/assets/musica.js?v=r50-data-1'),
 ('js','/assets/ig-r49-transversal.js?v=r50-data-1'),
 ('js','/assets/ig-data-hub-r50.js?v=369-p30-p33-1'),
)
PREFIXES=('/es/datos/','/en/data/')
INDEXES=set(PREFIXES)

TOPIC_LABELS={
 'autism':('Autismo','Autism'),
 'adhd_learning':('TDAH y aprendizaje','ADHD and learning'),
 'mental_health':('Salud mental','Mental health'),
 'disability':('Discapacidad','Disability'),
 'education':('Educación','Education'),
 'work_income':('Empleo e ingresos','Work and income'),
 'support_technology':('Apoyos y tecnología','Support and technology'),
 'other':('Otros datos','Other data'),
}
TOPIC_KEYWORDS={
 'autism':('autismo','autism','autista','autistic'),
 'adhd_learning':('tdah','adhd','dislexia','dyslexia','discalcul','dyscalcul','disgraf','dysgraph','tourette','lenguaje','language disorder','coordinacion','coordination disorder'),
 'mental_health':('ansiedad','anxiety','toc','ocd','salud mental','mental health'),
 'education':('educacion','education','school','escuela','graduad','higher education','formacion','training','learning'),
 'work_income':('empleo','employment','laboral','labour','pay gap','brecha salarial','salario','income','participacion laboral','labour-force','work'),
 'support_technology':('tecnologia','technology','producto de apoyo','assistive','support need','necesidad de apoyo','ajuste','adjustment'),
 'disability':('discapacidad','disability','disabled','pobreza','poverty','discriminacion','discrimination','violencia','violence','wellbeing','bienestar'),
}

def route_for(path,root):
 rel=path.relative_to(root).as_posix()
 return '/'+(rel[:-10] if rel.endswith('/index.html') else rel)

def set_attr(attrs,name,value):
 pat=re.compile(r'(\s'+re.escape(name)+r'=)(["\']).*?\2',re.I|re.S)
 return pat.sub(lambda m:m.group(1)+'"'+value+'"',attrs,count=1) if pat.search(attrs) else attrs.rstrip()+f' {name}="{value}"'

def plain(s):
 return re.sub(r'<[^>]+>',' ',s).replace('&amp;','&').replace('&nbsp;',' ').strip()

def norm(s):
 s=unicodedata.normalize('NFKD',plain(s)).encode('ascii','ignore').decode().lower()
 return re.sub(r'\s+',' ',s).strip()

def topic_for(text):
 n=norm(text)
 for topic,words in TOPIC_KEYWORDS.items():
  if any(norm(w) in n for w in words):
   return topic
 return 'other'

def enhance_index(text,lang):
 mm=re.search(r'(<main\b[^>]*>)(.*?)(</main>)',text,re.I|re.S)
 if not mm: raise AssertionError('Data index without main')
 inner=mm.group(2)
 cards=[]
 regions=[]
 topics=[]
 for m in CARD_RE.finditer(inner):
  attrs=m.group(1);body=m.group(2)
  chip=plain(CHIP_RE.search(body).group(1)) if CHIP_RE.search(body) else ('Sin región' if lang=='es' else 'No region')
  title=plain(TITLE_RE.search(body).group(1)) if TITLE_RE.search(body) else ''
  topic=topic_for(title+' '+body)
  if chip not in regions: regions.append(chip)
  if topic not in topics: topics.append(topic)
  enriched='<a class="card"'+attrs+f' data-region="{escape(chip,quote=True)}" data-topic="{topic}">'+body+'</a>'
  cards.append(enriched)
 if len(cards)<40: raise AssertionError(f'Data index card inventory too small: {len(cards)}')

 if lang=='es':
  title='Neurodiversidad y discapacidad en cifras'
  lede='Consulta datos por tema y lugar. Cada ficha explica qué se midió, en qué población, cuándo y con qué fuente.'
  qlabel='Buscar por tema o palabra'
  qph='Ej.: autismo, empleo, educación…'
  rlabel='Lugar'
  rall='Todos los lugares'
  tlabel='Tema'
  tall='Todos los temas'
  reset='Limpiar filtros'
  results=f'{len(cards)} resultados'
  method_title='Cómo interpretar estas cifras'
  method='Las cifras no siempre son comparables entre países o estudios. La edad, la definición, el acceso al diagnóstico, los registros y el método pueden cambiar el resultado. Abre cada ficha para ver población, fecha, fuente y límites antes de comparar.'
 else:
  title='Neurodiversity and disability in figures'
  lede='Find data by topic and place. Each entry explains what was measured, in which population, when and from which source.'
  qlabel='Search by topic or keyword'
  qph='E.g. autism, employment, education…'
  rlabel='Place'
  rall='All places'
  tlabel='Topic'
  tall='All topics'
  reset='Clear filters'
  results=f'{len(cards)} results'
  method_title='How to interpret these figures'
  method='Figures are not always comparable across countries or studies. Age, definitions, access to diagnosis, records and statistical methods can change the result. Open each entry to check the population, date, source and limits before comparing.'

 region_opts=''.join(f'<option value="{escape(x,quote=True)}">{escape(x)}</option>' for x in regions)
 topic_opts=''.join(f'<option value="{x}">{escape(TOPIC_LABELS[x][0 if lang=="es" else 1])}</option>' for x in TOPIC_LABELS if x in topics)
 hub=(
  f'<h1>{title}</h1>'
  f'<p class="lede">{lede}</p>'
  '<section class="ig-data-query" aria-labelledby="ig-data-query-title">'
  f'<h2 id="ig-data-query-title">{("Buscar datos" if lang=="es" else "Find data")}</h2>'
  '<div class="ig-data-filters">'
  f'<label><span>{qlabel}</span><input id="ig-data-search" type="search" autocomplete="off" placeholder="{qph}"></label>'
  f'<label><span>{rlabel}</span><select id="ig-data-region"><option value="">{rall}</option>{region_opts}</select></label>'
  f'<label><span>{tlabel}</span><select id="ig-data-topic"><option value="">{tall}</option>{topic_opts}</select></label>'
  f'<button type="button" id="ig-data-reset">{reset}</button>'
  '</div>'
  f'<p id="ig-data-count" class="ig-data-count" role="status" aria-live="polite">{results}</p>'
  '</section>'
  f'<div class="cards ig-data-results" id="ig-data-results">{"".join(cards)}</div>'
  f'<p class="ig-data-empty" id="ig-data-empty" hidden>{("No hay resultados con esos filtros." if lang=="es" else "No results match those filters.")}</p>'
  f'<details class="ig-data-method"><summary>{method_title}</summary><p>{method}</p></details>'
 )
 after=text[:mm.start()]+mm.group(1)+hub+mm.group(3)+text[mm.end():]
 return after

def one(path,root):
 before=path.read_text(encoding='utf-8')
 route=route_for(path,root)
 profile='browse' if route in INDEXES else 'content'
 m=BODY_RE.search(before)
 if not m:raise AssertionError('Data page without body '+route)
 attrs=m.group(1)
 for k,v in [('data-ig-r49','1'),('data-ig-profile',profile),('data-ig-materials','r42'),('data-ig-r49-owner','R50_DATA')]:
  attrs=set_attr(attrs,k,v)
 after=before[:m.start()]+'<body'+attrs+'>'+before[m.end():]
 mm=MAIN_RE.search(after)
 if mm and not re.search(r'\bid=["\']',mm.group(1),re.I):
  a=mm.group(1).rstrip()+' id="main"'
  after=after[:mm.start()]+'<main'+a+'>'+after[mm.end():]
 if route in INDEXES:
  after=enhance_index(after,'en' if route.startswith('/en/') else 'es')
 inject=[]
 if '/assets/preferencias-lectura.js' not in after:inject.append('<script src="/assets/preferencias-lectura.js"></script>')
 for kind,url in ASSETS:
  bare=url.split('?')[0]
  if bare in after:continue
  if kind=='css':inject.append(f'<link rel="stylesheet" href="{url}">')
  else:
   defer=' defer' if any(x in bare for x in ('ig-child-safe.js','interfaz-comun.js','musica.js','ig-r49-transversal.js','ig-data-hub-r50.js')) else ''
   inject.append(f'<script{defer} src="{url}"></script>')
 if 'name="ig-r50-section"' not in after:inject.insert(0,'<meta name="ig-r50-section" content="data">')
 if inject:after=re.sub(r'</head>',''.join(inject)+'</head>',after,count=1,flags=re.I)
 if after!=before:path.write_text(after,encoding='utf-8')
 return {'route':route,'file':path.relative_to(root).as_posix(),'profile':profile,'locale':'en' if route.startswith('/en/') else 'es'}

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True)
 root=ap.parse_args().root.resolve();pages=[]
 for prefix in PREFIXES:
  base=root/prefix.strip('/')
  if base.is_dir():pages.extend(p for p in base.rglob('*.html') if p.is_file())
 rows=[one(p,root) for p in sorted(set(pages))]
 if not rows:raise AssertionError('No Data pages')
 payload={'version':'R50-DATA-2','section':'data','issue_369_points':[30,31,32,33],'total_routes':len(rows),'profiles':{'browse':sum(x['profile']=='browse' for x in rows),'content':sum(x['profile']=='content' for x in rows)},'routes':rows}
 (root/'assets/r50-data-route-profiles.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
 print(json.dumps({'section':'data','routes':len(rows),'profiles':payload['profiles'],'issue_369':'P30_P33'},ensure_ascii=False))
if __name__=='__main__':main()
