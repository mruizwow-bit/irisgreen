#!/usr/bin/env python3
"""Unifica controles sin reescribir fichas ni inventar referencias.
Migración idempotente. bs4 solo se utiliza en revisión, no en el build de Netlify.
"""
import json,re,hashlib,collections
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin,urlsplit
from bs4 import BeautifulSoup
ROOT=Path.cwd();OUT=ROOT/'reports/coherence';OUT.mkdir(parents=True,exist_ok=True)
CHIP_PAGES={'index.html','es/videos/index.html','es/investigacion/index.html','es/tramites/directorio/index.html','es/taller/index.html','es/vivir-fuera/index.html'}
CSS='<link rel="stylesheet" href="/assets/controles-comunes.css"/>'
REPORT={'annotated_filters':{},'index_descriptions_completed':[],'catalogues':{},'editorial_inventory':[]}

def add_class(tag,name):
 m=re.search(r'\bclass="([^"]*)"',tag)
 if m:
  if name in m[1].split():return tag
  return tag[:m.start(1)]+m[1]+' '+name+tag[m.end(1):]
 return tag.replace(' ', ' class="'+name+'" ',1)

class MarkRows(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=False);self.text=text;self.stack=[];self.edits={};self.lines=[0]
  for line in text.splitlines(keepends=True):self.lines.append(self.lines[-1]+len(line))
  self.feed(text)
 def mark(self,item,css):
  pos,tag,attrs=item;self.edits[pos]=add_class(self.edits.get(pos,tag),css)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);line,col=self.getpos();item=(self.lines[line-1]+col,self.get_starttag_text(),a)
  if tag=='input' and a.get('type')=='search' and self.stack:
   parent=self.stack[-1]
   if 'display: flex' in parent[2].get('style','') and 'border' in parent[2].get('style',''):self.mark(parent,'ig-search-shell')
  if tag=='sc-for' and re.search(r'\w+Chips|\{\{ chips \}\}',a.get('list','')) and self.stack:self.mark(self.stack[-1],'ig-filter-row')
  if tag not in {'input','img','meta','link','br','hr','source','area','embed','wbr'}:self.stack.append(item)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if re.match(r'<'+re.escape(tag)+r'(?:\s|>)',self.stack[i][1]):del self.stack[i:];break
 def output(self):
  text=self.text
  for pos,new in sorted(self.edits.items(),reverse=True):text=text[:pos]+new+text[self.text.find('>',pos)+1:]
  return text

def source_url(rel,value):return urlsplit(urljoin('https://irisgreen.eu/'+rel,value)).path

for p in [ROOT/'index.html',*sorted((ROOT/'es').rglob('*.html')),*sorted((ROOT/'en').rglob('*.html'))]:
 s=p.read_text();old=s;rel=p.relative_to(ROOT).as_posix()
 if CSS not in s:s=s.replace('</head>',CSS+'\n</head>',1)
 if rel in CHIP_PAGES:
  pattern=r'(<sc-for\b[^>]*list="\{\{\s*(\w+Chips|chips)\s*\}\}"[^>]*as="(\w+)"[^>]*>)(.*?)(</sc-for>)'
  count=[0]
  def annotate(m):
   body=m[4]
   def btn(b):
    tag=add_class(b[0],'ig-filter-button')
    if 'data-ig-filter=' not in tag:tag=tag[:-1]+' data-ig-filter="'+m[2]+'">'
    if 'aria-pressed=' not in tag:tag=tag[:-1]+' aria-pressed="{{ '+m[3]+'.bg !== \'#fff\' }}">'
    count[0]+=1;return tag
   body=re.sub(r'<button\b[^>]*>',btn,body)
   return m[1]+body+m[5]
  s=re.sub(pattern,annotate,s,flags=re.S);REPORT['annotated_filters'][rel]=count[0]
  s=re.sub(r'<input\b(?=[^>]*type="search")[^>]*>',lambda m:add_class(m[0],'ig-search-input'),s)
  s=MarkRows(s).output()
 if rel=='es/videos/index.html':
  s=re.sub(r'const TEMA_KEYS = \[[^\n]+\];','const TEMA_KEYS = Array.from(new Set(VIDEOS.map((v) => v.tema)));',s)
  s=s.replace('label: T.temas[k]', 'label: T.temas[k] || k') if 'label: T.temas[k] || k' not in s else s
  s=s.replace('platChips: [{ key: "all", label: T.all }, { key: "YouTube", label: "YouTube" }]', 'platChips: [{ key: "all", label: T.all }].concat(Array.from(new Set(VIDEOS.map((v) => v.source))).map((key) => ({ key, label: key })))')
  for lang,labels in [('es',{'Misofonía':'Misofonía','CAA':'CAA','Discalculia':'Discalculia','TDL':'TDL'}),('en',{'Misofonía':'Misophonia','CAA':'AAC','Discalculia':'Dyscalculia','TDL':'DLD'})]:
   start=s.index('  '+lang+': {',s.index('const STR'));pos=s.index('    temas: {',start)+len('    temas: {')
   if '"Misofonía"' not in s[pos:s.index('}',pos)]:s=s[:pos]+' '+', '.join(json.dumps(k,ensure_ascii=False)+': '+json.dumps(v,ensure_ascii=False) for k,v in labels.items())+', '+s[pos:]
 if rel=='index.html':
  s=s.replace('temaChips: TEMAS.map((t) => ({','temaChips: ["Todos"].concat(Array.from(new Set(FUENTE.map((v) => v.tema)))).map((t) => ({')
  old_map='return y(v.name, v.tema, v.ref);'
  new_map='return v.plataforma === "Instagram" ? i(v.name, v.tema, v.ref) : v.plataforma === "Vimeo" ? { name: v.name, tema: v.tema, source: "Vimeo", href: v.url, embed: "https://player.vimeo.com/video/" + v.ref } : y(v.name, v.tema, v.ref);'
  s=s.replace(old_map,new_map)
 if rel=='es/situaciones/index.html':
  if 'data-ig-catalog="situations"' not in s:s=re.sub(r'(<body\b[^>]*)(>)',r'\1 data-ig-catalog="situations"\2',s,count=1)
  s=re.sub(r'<script>\s*\(function\(\)\{\s*const root=document.querySelector\(\'.situations-collection\'\);.*?</script>','',s,flags=re.S)
  s=s.replace('<span class="sr-only">Buscar una situación…</span>','<span class="ig-catalog-label">Buscar en las 187 situaciones</span>')
  if '/assets/buscador-comun.js' not in s:s=s.replace('</head>','<script defer src="/assets/buscador-comun.js"></script>\n</head>',1)
  if '/assets/catalogo-comun.js' not in s:s=s.replace('</body>','<script defer src="/assets/catalogo-comun.js"></script>\n</body>',1)
  s=s.replace('<p class="situations-empty" hidden="" id="situationsEmpty">No hay situaciones que coincidan con esta búsqueda.</p>', '<div class="ig-empty" hidden id="situationsEmpty"><p>No encontramos una situación con esas palabras.</p><p>Prueba otra forma de decirlo o <a href="/es/neurodiversidad/condiciones/">busca en Condiciones</a>.</p></div>')
  if 'data-ig-catalog-reset' not in s:
   idx=s.index('</section>',s.index('class="situations-filter"'));s=s[:idx]+'<button class="ig-filter-button ig-catalog-reset" type="button" data-ig-catalog-reset hidden>Quitar filtros</button>'+s[idx:]
 if rel=='es/neurodiversidad/condiciones/index.html':
  if 'data-ig-catalog="conditions"' not in s:s=re.sub(r'(<body\b[^>]*)(>)',r'\1 data-ig-catalog="conditions"\2',s,count=1)
  s=s.replace('id="ig-search-reset"','data-ig-catalog-reset id="ig-search-reset"') if 'data-ig-catalog-reset' not in s else s
  s=re.sub(r'<button\b[^>]*id="ig-search-reset"[^>]*>',lambda m:add_class(add_class(m[0],'ig-filter-button'),'ig-catalog-reset'),s)
  if '/assets/catalogo-comun.js' not in s:s=s.replace('</body>','<script defer src="/assets/catalogo-comun.js"></script>\n</body>',1)
 if rel in {'es/situaciones/index.html','es/neurodiversidad/condiciones/index.html'} and 'data-ig-catalog-error' not in s:
  pos=s.index('<div class="cards">');block='<div class="ig-catalog-error" data-ig-catalog-error hidden role="status"><p>No se ha podido cargar el buscador. Puedes recorrer las fichas o volver a intentarlo.</p><button class="ig-filter-button" data-ig-catalog-retry type="button">Reintentar búsqueda</button></div>\n';s=s[:pos]+block+s[pos:]
 if s!=old:p.write_text(s)

p=ROOT/'assets/interfaz-comun.js';s=p.read_text();start=s.find("    if (!document.body.hasAttribute('data-ig-conditions')")
if start>=0:
 end=s.index("  }\n  if (document.readyState",start);s=s[:start]+s[end:];p.write_text(s)

p=ROOT/'buscador.json';data=json.loads(p.read_text());by_url={r['u']:r for r in data}
for rel in ['es/neurodiversidad/condiciones/index.html','es/situaciones/index.html']:
 soup=BeautifulSoup((ROOT/rel).read_text(),'html.parser');cards=soup.select('main .cards>a.card');kinds=collections.Counter();seen=[];generic=[]
 for card in cards:
  url=source_url(rel,card['href']);seen.append(url);row=by_url[url]
  spans=card.find_all('span',recursive=False);desc=spans[-1].get_text(' ',strip=True)
  detail=ROOT/(url.strip('/')+'/index.html');d=BeautifulSoup(detail.read_text(),'html.parser');main=d.find('main')
  if row.get('d')!=desc:
   h=d.find('h2',string='En pocas palabras');actual=h.find_next_sibling('p').get_text(' ',strip=True) if h else ''
   assert actual==desc and desc.startswith(row.get('d','')),url
   REPORT['index_descriptions_completed'].append({'url':url,'before':row['d'],'after':desc});row['d']=desc
  kind=row.get('tipo') or row.get('a');kinds[kind]+=1;references=[]
  for h in main.find_all(['h2','h3']):
   if re.search('Base documental|Fuentes|Referencias',h.get_text(),re.I):references.append(h.parent.get_text(' ',strip=True))
  flags=[]
  if desc=='Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.':flags.append('descripcion_generica');generic.append(url)
  if not references:flags.append('referencia_no_identificada')
  REPORT['editorial_inventory'].append({'url':url,'title':row['t'],'type':kind,'description':desc,'headings':[h.get_text(' ',strip=True) for h in main.find_all(['h2','h3'])],'references':references,'flags':flags,'verification':'inventariada_no_validada'})
 assert len(seen)==len(set(seen));family='Condición' if 'condiciones' in rel else 'Situación'
 assert set(seen)=={r['u'] for r in data if r['s']==family}
 REPORT['catalogues'][rel]={'cards':len(seen),'types':dict(kinds),'generic_description_count':len(generic),'generic_descriptions':generic,'paths_unique':True}
if REPORT['index_descriptions_completed']:p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
video_index=json.loads((ROOT/'videoteca-listado.json').read_text());video_text=(ROOT/'es/videos/index.html').read_text().split('const VIDEOS = [',1)[1].split('].map(',1)[0];video_rows=[]
for line in video_text.splitlines():
 m=re.search(r'^\s*([yv])\(("(?:[^"\\]|\\.)*"),\s*("(?:[^"\\]|\\.)*"),\s*("(?:[^"\\]|\\.)*")',line)
 if m:video_rows.append({'provider':m[1],'name':json.loads(m[2]),'topic':json.loads(m[3]),'ref':json.loads(m[4])})
live_refs={v['ref'] for v in video_rows}
REPORT['video_inventory']={'home_source_count':len(video_index['videos']),'source_total_field':video_index.get('total'),'videoteca_count':len(video_rows),'only_in_home_source':[{'name':v['name'],'provider':v['plataforma'],'ref':v['ref']} for v in video_index['videos'] if v['ref'] not in live_refs],'note':'No se fusionan selecciones ni se reincorporan registros a la videoteca sin revisar el criterio editorial. La home conserva su fuente y se corrige el proveedor de sus embeds.'}
REPORT['notes']=['Solo se completa texto truncado cuando coincide con la descripción ya escrita en la ficha y el listado.','El inventario de referencias no equivale a validación documental.','Los tipos y áreas no se inventan ni se agrupan de nuevo.','No se cambian noindex, textos de las fichas ni fechas de revisión.']
if not (OUT/'changes.json').exists():(OUT/'changes.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in REPORT.items() if k not in ['editorial_inventory','index_descriptions_completed','catalogues']},ensure_ascii=False));print('DESCRIPCIONES COMPLETADAS',len(REPORT['index_descriptions_completed']));print('CATALOGOS',[(p,v['cards'],v['generic_description_count']) for p,v in REPORT['catalogues'].items()])
