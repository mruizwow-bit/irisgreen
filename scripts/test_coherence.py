import traceback
#!/usr/bin/env python3
"""Prueba controles reales e integridad de los listados; no valida fuentes clínicas."""
import functools,json,re,threading,unicodedata
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'reports/coherence';OUT.mkdir(parents=True,exist_ok=True)
DATA=json.loads((ROOT/'buscador.json').read_text())
REPORT={'catalogues':[],'other_sections':[],'recovery':[],'styles':[],'failures':[],'expectativas_antiguas':[],'notes':['Controles reales con servicios externos bloqueados.','Se comprueban destinos de reproductores, no la reproducción remota.','La validación de contenido y referencias tiene un informe separado.']}
# Expectativas antiguas: fallan por una expectativa vieja y no por un fallo del sitio.
# Estrictas a proposito: el dia que se reescriban y pasen, la comprobacion falla hasta
# que se retire la marca, para que el recordatorio no dependa de la memoria de nadie.
ESPERADO_FALLA={'/':'describe la portada anterior, con su seccion #escuchar de videos y sus chips de tema. La portada aprobada no lleva videos: es una expectativa vieja, no un fallo del sitio. Informe 2026-09-11, pregunta 4.'}
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if not unicodedata.combining(c))
def ctx_page(browser,width):
 c=browser.new_context(viewport={'width':width,'height':900});p=c.new_page();p.set_default_timeout(10000)
 p.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort());return c,p

def style(p,selector,name):
 x=p.locator(selector).first;assert x.count(),name+' sin controles'
 v=x.evaluate('(e)=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {font:s.fontFamily,size:s.fontSize,radius:s.borderRadius,padding:s.padding,border:s.borderWidth,bg:s.backgroundColor,color:s.color,height:r.height,width:r.width}}')
 assert v['height']>=43.9,v
 assert v['size']=='16px' and v['radius']=='999px' and v['bg']=='rgb(23, 57, 92)',v
 REPORT['styles'].append({'section':name,**v});return v

def bounds(p,selector):
 bad=p.locator(selector+':visible').evaluate_all('(els)=>els.filter(e=>{const r=e.getBoundingClientRect();return r.left< -1||r.right>innerWidth+1||r.width<43.9||r.height<43.9}).map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON()}))')
 assert not bad,bad[:3]
 assert p.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')<=2

def visible_paths(p):return p.locator('main .cards>a.card:visible').evaluate_all('(els)=>els.map(e=>new URL(e.href).pathname)')
def check_counter(p,selector,count):
 text=p.locator(selector).inner_text();assert int(re.match(r'\d+',text)[0])==count,text

def catalogue(p,kind,width):
 situations=kind=='Situación';url='/es/situaciones/' if situations else '/es/neurodiversidad/condiciones/'
 row={'section':kind,'width':width};subset=[x for x in DATA if x['s']==kind];q='#situationsSearch' if situations else '#q';group='.situations-filter-row' if situations else '#filtros';counter='#situationsCount' if situations else '#cuenta'
 p.goto(BASE+url,wait_until='domcontentloaded');p.wait_for_function('document.querySelector("[data-ig-catalog]").getAttribute("aria-busy")==="false" && !document.querySelector("[data-ig-catalog] input[type=search]").disabled')
 assert len(visible_paths(p))==len(subset);check_counter(p,counter,len(subset));assert not p.locator('[data-ig-catalog-reset]').is_visible()
 style(p,group+' button[aria-pressed=true]',kind);bounds(p,group+' button')
 for b in p.locator(group+' button').all():
  value=b.get_attribute('data-filter' if situations else 'data-type');value='' if value=='*' else value
  b.focus();b.press('Enter');expected=[r['u'] for r in subset if not value or r.get('a' if situations else 'tipo')==value]
  assert visible_paths(p)==expected,(kind,value)
  assert b.get_attribute('aria-pressed')=='true';check_counter(p,counter,len(expected))
 p.locator(group+' button').first.click()
 if not situations:
  letters=p.locator('#az button').all_text_contents();assert 'X' in letters and 'J' not in letters,letters
  for b in p.locator('#az button').all():
   value=b.get_attribute('data-letter') or '';b.click();expected=[r['u'] for r in subset if not value or norm(r.get('indexKey') or r['t'])[0].upper()==value]
   assert visible_paths(p)==expected,value
  p.locator('#az button').first.click();bounds(p,'#az button')
 for term in ['ruido','sueño','hipoglucemia','zzzinexistentexxx']:
  p.locator(q).fill(term)
  expected=p.evaluate('([term,kind])=>IGSearch.load().then(data=>IGSearch.rank(data.filter(x=>x.kind===kind),term).map(x=>IGSearch.path(x.url)+"/"))',[term,kind])
  assert visible_paths(p)==expected,(term,kind);check_counter(p,counter,len(expected))
  if term=='zzzinexistentexxx':
   empty=p.locator('#situationsEmpty' if situations else '#ig-search-empty');assert empty.is_visible();assert empty.locator('a[href]').count()
 p.locator('[data-ig-catalog-reset]').click();assert len(visible_paths(p))==len(subset);assert '?' not in p.url
 p.locator(q).fill('ruido');urls=visible_paths(p);p.reload();p.wait_for_function('!document.querySelector("[data-ig-catalog] input[type=search]").disabled');assert visible_paths(p)==urls
 p.locator('[data-ig-catalog-reset]').click();assert p.locator(q).evaluate('(e)=>getComputedStyle(e).outlineColor')=='rgb(90, 73, 168)';p.screenshot(path=str(OUT/f'{"situaciones" if situations else "condiciones"}-{width}.png'))
 row.update({'records':len(subset),'all_filters_tested':p.locator(group+' button').count(),'query_parity':True,'reset':True,'url_restore':True,'passed':True});return row

def filters(p,key):return p.locator('main [data-ig-filter="'+key+'"]:visible')
def bylabel(p,key,label):return filters(p,key).filter(has_text=re.compile('^'+re.escape(label)+'$'))
def choose(p,key,label):
 b=bylabel(p,key,label);b.click();assert b.get_attribute('aria-pressed')=='true',label

def other(p,path,width):
 row={'path':path,'width':width};p.goto(BASE+path,wait_until='domcontentloaded');p.locator('main h1').first.wait_for();p.wait_for_timeout(300)
 if path=='/es/taller/':
  d=json.loads((ROOT/'es/taller/taller-retos.json').read_text());cards=p.locator('main article:visible');assert cards.count()==len(d)
  choose(p,'timeChips','Diez minutos');assert cards.count()==sum(x['dur']==0 for x in d)
  choose(p,'mesaChips','Dibujar');assert cards.count()==sum(x['dur']==0 and x['mesa']==0 for x in d)
  filters(p,'timeChips').first.click();filters(p,'mesaChips').first.click();assert cards.count()==len(d);key='timeChips';row['records']=len(d)
 elif path=='/es/investigacion/':
  d=json.loads((ROOT/'es/investigacion/estudios-textos.json').read_text());cards=p.locator('main article:visible');assert cards.count()==len(d)
  bylabel(p,'topicChips','Autismo').click();assert cards.count()==sum(x['topic']=='Autismo' for x in d)
  filters(p,'topicChips').first.click();p.locator('main input[type=search]').fill('zzzinexistentexxx');assert cards.count()==0
  p.locator('main input[type=search]').fill('');assert cards.count()==len(d);key='topicChips';row['records']=len(d)
 elif path=='/es/tramites/directorio/':
  cards=p.locator('main article:visible');assert cards.count()==12;old=cards.first.inner_text()
  choose(p,'countryChips','Reino Unido');assert cards.count()==12 and cards.first.inner_text()!=old
  choose(p,'countryChips','España');p.get_by_role('button',name=re.compile('^Ver más fichas')).click();assert cards.count()==24
  p.locator('main input[type=search]').fill('zzzinexistentexxx');assert cards.count()==0
  p.locator('main input[type=search]').fill('');assert cards.count()>=12;key='countryChips';row['expanded_records']=24
 elif path=='/es/vivir-fuera/':
  cards=p.locator('main article:visible');start=cards.count();assert start==9
  choose(p,'chips','Oceanía');assert cards.count()==2
  filters(p,'chips').first.click();assert cards.count()==start;key='chips';row['records']=start
 elif path=='/es/videos/':
  p.wait_for_function('document.querySelectorAll("[data-ig-filter=temaChips]").length>11')
  topics=filters(p,'temaChips').all_text_contents();assert 'Misofonía' in topics and 'CAA' in topics and 'TDL' in topics
  assert filters(p,'platChips').all_text_contents()==['Todos','YouTube','Vimeo']
  choose(p,'platChips','Vimeo');assert p.locator('main button.ig-video-poster:visible').count()==1
  assert 'vimeo.com' in p.locator('main button.ig-video-poster:visible').get_attribute('data-ig-video')
  filters(p,'platChips').first.click();choose(p,'temaChips','Misofonía');assert p.locator('main button.ig-video-poster:visible').count()==1
  assert 'youtube' in p.locator('main button.ig-video-poster:visible').get_attribute('data-ig-video')
  assert p.locator('main button.ig-video-poster:visible').get_attribute('aria-label').startswith('Reproducir vídeo:')
  p.locator('main input[type=search]').fill('zzzinexistentexxx');assert p.locator('main button.ig-video-poster:visible').count()==0
  p.locator('main input[type=search]').fill('');filters(p,'temaChips').first.click();key='temaChips';row['actual_topics']=topics
 elif path=='/':
  p.wait_for_function('document.querySelectorAll("#escuchar [data-ig-filter=temaChips]").length===15')
  choose(p,'temaChips','CAA');assert p.locator('#escuchar button.ig-video-title').count()==1
  choose(p,'temaChips','ARFID');assert p.locator('#escuchar button.ig-video-title').count()==2
  p.locator('#escuchar button.ig-video-title').first.click();frame=p.locator('#escuchar iframe').first;frame.wait_for(state='attached');assert urlsplit(frame.get_attribute('src')).hostname=='www.instagram.com'
  choose(p,'temaChips','Autismo');p.locator('#escuchar button.ig-video-title').filter(has_text='Jules').click();frame=p.locator('#escuchar iframe').first;frame.wait_for(state='attached');assert urlsplit(frame.get_attribute('src')).hostname=='player.vimeo.com'
  filters(p,'temaChips').first.click();key='temaChips';row['provider_mapping']=True
 elif path=='/es/biblioteca/':
  all_cards=p.locator('main .vd-card');cards=p.locator('main .vd-card:visible');assert cards.count()==48
  for b in p.locator('.catbuttons button').all():
   value=b.get_attribute('data-cat');n=all_cards.evaluate_all('(els,v)=>els.filter(e=>!v||e.dataset.cat===v).length',value);b.click();assert cards.count()==n
  p.locator('.catbuttons button').first.click();p.locator('#vd-search').fill('zzzinexistentexxx');assert cards.count()==0
  p.locator('#vd-search').fill('');assert cards.count()==48
  style(p,'.catbuttons button[aria-pressed=true]',path);bounds(p,'.catbuttons button');row['records']=48;key=None
 elif path=='/es/intereses/':
  d=json.loads((ROOT/'es/intereses/cromos.json').read_text());n=sum(not c.get('pendiente') for t in d['temas'] for c in t.get('cromos',[]));cards=p.locator('#album article:visible');assert cards.count()==n
  p.locator('#temaFilters [data-tema=minerales]').click();assert cards.count()==sum(not c.get('pendiente') for t in d['temas'] if t['id']=='minerales' for c in t['cromos'])
  p.locator('#q').fill('zzzinexistentexxx');assert cards.count()==0
  p.locator('#q').fill('');p.locator('#temaFilters button').first.click();assert cards.count()==n
  style(p,'#temaFilters button[aria-pressed=true]',path);bounds(p,'#temaFilters button');row['records']=n;key=None
 else:raise AssertionError(path)
 if key:style(p,'[data-ig-filter="'+key+'"][aria-pressed=true]',path);bounds(p,'main .ig-filter-button')
 row['passed']=True;p.screenshot(path=str(OUT/('seccion-'+(path.strip('/').replace('/','-') or 'home')+'-'+str(width)+'.png')));return row

with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for width in [1440,390,320]:
  for kind in ['Condición','Situación']:
   c,p=ctx_page(browser,width)
   try:REPORT['catalogues'].append(catalogue(p,kind,width))
   except Exception as e:REPORT['failures'].append({'section':kind,'width':width,'error':traceback.format_exc()})
   c.close()
 for width in [1440,320]:
  for path in ['/','/es/videos/','/es/investigacion/','/es/tramites/directorio/','/es/taller/','/es/vivir-fuera/','/es/biblioteca/','/es/intereses/']:
   c,p=ctx_page(browser,width)
   try:
    fila=other(p,path,width)
    if path in ESPERADO_FALLA:REPORT['failures'].append({'path':path,'width':width,'error':'Esta prueba ya pasa: retira su marca de ESPERADO_FALLA en scripts/test_coherence.py','motivo_marcado':ESPERADO_FALLA[path]})
    else:REPORT['other_sections'].append(fila)
   except Exception as e:
    fila={'path':path,'width':width,'error':traceback.format_exc()}
    if path in ESPERADO_FALLA:fila['expectativa_antigua']=ESPERADO_FALLA[path];REPORT['expectativas_antiguas'].append(fila)
    else:REPORT['failures'].append(fila)
   c.close()
 for path in ['/es/situaciones/','/es/neurodiversidad/condiciones/']:
  c,p=ctx_page(browser,390);failed={'on':True};attempts=[]
  def route(r):
   if not r.request.url.startswith(BASE):r.abort()
   elif r.request.url.endswith('/buscador.json') and failed['on']:attempts.append('failed');r.fulfill(status=503,content_type='application/json',body='{}')
   else:r.continue_()
  p.unroute('**/*');p.route('**/*',route)
  try:
   p.goto(BASE+path,wait_until='domcontentloaded');p.locator('[data-ig-catalog-error]').wait_for(state='visible')
   assert p.locator('[data-ig-catalog] input[type=search]').is_disabled();assert p.locator('main .cards>a.card:visible').count()>=185
   failed['on']=False;p.locator('[data-ig-catalog-retry]').click();p.wait_for_function('!document.querySelector("[data-ig-catalog] input[type=search]").disabled');assert not p.locator('[data-ig-catalog-error]').is_visible()
   REPORT['recovery'].append({'path':path,'readable_on_error':True,'retry_recovered':True,'failed_requests':len(attempts),'passed':True})
  except Exception as e:REPORT['failures'].append({'recovery':path,'error':traceback.format_exc()})
  c.close()
 browser.close()
server.shutdown();REPORT['passed']=not REPORT['failures']
(OUT/'tests.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'catalogues':len(REPORT['catalogues']),'other_sections':len(REPORT['other_sections']),'recovery':len(REPORT['recovery']),'expectativas_antiguas':len(REPORT['expectativas_antiguas']),'failures':REPORT['failures']},ensure_ascii=False))
if not REPORT['passed']:raise SystemExit(1)
