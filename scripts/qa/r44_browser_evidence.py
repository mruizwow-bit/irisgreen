"""Runtime evidence only. This is not the thirteen-criterion acceptance gate."""
import json
import functools
import http.server
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'reports/r44-runtime'
OUT.mkdir(parents=True, exist_ok=True)
MOTORS = {
 'M1': ('dibujo', 'drawing'),
 'M2': ('estructuras', 'structures'),
 'M3': ('simulaciones', 'simulations'),
 'M4': ('ritmo', 'rhythm-sequencer'),
 'M5': ('escritura-restricciones', 'constraint-writing'),
 'M6': ('mundos', 'worlds'),
 'M7': ('juegos-de-mesa', 'board-games'),
 'M8': ('programacion', 'coding'),
 'M9': ('', ''),
}
class Handler(http.server.SimpleHTTPRequestHandler):
 def log_message(self, *args): pass
 def end_headers(self):
  self.send_header('Content-Security-Policy', "script-src 'self'; connect-src 'self'; object-src 'none'")
  super().end_headers()
server = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
rows=[]
with sync_playwright() as p:
 browser=p.chromium.launch()
 for motor, slugs in MOTORS.items():
  for lang,slug in zip(('es','en'),slugs):
   for width,height in ((1440,900),(390,844),(320,844)):
    page=browser.new_page(viewport={'width':width,'height':height})
    errors=[]
    page.on('pageerror',lambda error: errors.append(str(error)))
    row={'motor':motor,'lang':lang,'width':width,'height':height,'errors':errors,'acceptance':'NOT_ASSESSED'}
    try:
     base='/es/taller/' if lang=='es' else '/en/workshop/'
     page.goto('http://127.0.0.1:8765'+base+(slug+'/' if slug else ''),wait_until='networkidle')
     page.wait_for_selector('[data-r44-entry="true"]' if motor!='M9' else '#r44-continue',timeout=20000)
     row['layout']=page.evaluate('''() => ({overflow:document.documentElement.scrollWidth>innerWidth, controls:[...document.querySelectorAll('.igs-toolbar button, .r44-hub-actions a, .r44-hub-actions button')].filter(e=>e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return {text:e.textContent,label:e.getAttribute('aria-label'),x:r.x,y:r.y,width:r.width,height:r.height,disabled:e.disabled}})})''')
     row['runtime_ready']=True
    except Exception as error:
     row['runtime_ready']=False;row['failure']=str(error)
    page.screenshot(path=str(OUT/f'{motor}-{lang}-{width}.png'),full_page=True)
    rows.append(row)
    (OUT/'runtime.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
    page.close()
 # Check the file handoff for the shared music engine: rhythm must not open as synthesis.
 page=browser.new_page(viewport={'width':390,'height':844})
 file_result={'check':'M9 rhythm file round trip','passed':False}
 try:
  page.goto('http://127.0.0.1:8765/es/taller/ritmo/',wait_until='networkidle')
  page.wait_for_selector('[data-r44-entry="true"]')
  project=page.evaluate("() => ({formato:'iris-green-taller',estudio:'musica',modo:'rhythm',version:1,datos:document.getElementById('igt-app').igCreative.engine.serialize()})")
  page.goto('http://127.0.0.1:8765/es/taller/',wait_until='networkidle')
  with page.expect_file_chooser() as chooser:
   page.locator('#r44-continue').click()
  chooser.value.set_files({'name':'roundtrip.igtaller.json','mimeType':'application/json','buffer':json.dumps(project).encode()})
  page.locator('iframe.r44-project-frame:not([hidden])').wait_for(timeout=30000)
  frame=page.locator('iframe.r44-project-frame').element_handle().content_frame()
  actual=frame.evaluate("() => {const a=document.getElementById('igt-app');return {mode:a.dataset.igsMode,data:a.igCreative.engine.serialize()}}")
  assert actual['mode']=='rhythm',actual['mode']
  assert actual['data']['tracks']==project['datos']['tracks']
  assert actual['data']['bpm']==project['datos']['bpm']
  file_result['passed']=True
 except Exception as error:
  file_result['failure']=str(error)
 (OUT/'file-roundtrip.json').write_text(json.dumps(file_result,ensure_ascii=False,indent=2))
 page.close()
 # C07 must load the transit start and invoke its observation action.
 # Geometry and parameter consequences have separate mutation tests.
 page=browser.new_page(viewport={'width':390,'height':844})
 c07={'check':'C07 transit invitation: start and observation','passed':False}
 try:
  page.goto('http://127.0.0.1:8765/es/taller/simulaciones/?invitation=C07',wait_until='networkidle')
  page.wait_for_function("() => document.getElementById('igt-app')?.dataset.r44Invitation === 'C07'",timeout=20000)
  before=page.locator('.igs-toolbar button').filter(has_text='Observar una órbita')
  before.click()
  page.wait_for_timeout(300)
  page.screenshot(path=str(OUT/'C07-es-390-observed.png'),full_page=True)
  state=page.evaluate("""() => {const a=document.getElementById('igt-app');const d=a.igCreative.engine.serialize();return {model:d.model,rows:d.transit,chart:a.querySelector('canvas').width}}""")
  assert state['model']=='transit'
  assert state['chart']>0
  # The curve is rendered from the model. The computed module has its own mutation tests.
  c07['passed']=True
 except Exception as error:
  c07['failure']=str(error)
 (OUT/'c07-runtime.json').write_text(json.dumps(c07,ensure_ascii=False,indent=2))
 page.close()
 # X06 must produce a concrete visual artifact from the visible instrument.
 page=browser.new_page(viewport={'width':390,'height':844})
 x06={'check':'X06 instrument visual PNG export','passed':False}
 try:
  page.goto('http://127.0.0.1:8765/es/taller/composicion/?invitation=X06',wait_until='networkidle')
  page.wait_for_function("() => document.getElementById('igt-app')?.dataset.r44Invitation === 'X06'",timeout=20000)
  export_button=page.get_by_role('button',name='Exportar visual (PNG)',exact=True)
  # R44 lo sitúa en Opciones; sin shell queda visible en la barra del proyecto.
  if not export_button.is_visible():
   options=page.locator('.r44-options > summary')
   if options.is_visible():
    options.click()
   else:
    trigger=page.locator('.ig-r42-file-trigger')
    assert trigger.is_visible(),'Export menu is not reachable'
    trigger.click()
  assert export_button.is_visible(),'Visual export is not visible or reachable'
  with page.expect_download(timeout=15000) as download_info:
   export_button.click()
  download=download_info.value
  assert download.suggested_filename.endswith('.png'),download.suggested_filename
  x06['filename']=download.suggested_filename
  x06['passed']=True
 except Exception as error:
  x06['failure']=str(error)
 (OUT/'x06-runtime.json').write_text(json.dumps(x06,ensure_ascii=False,indent=2))
 page.close()
 # Every invitation must reach the declared starting state. This checks routing
 # and engine start IDs; it deliberately does not certify the challenge itself.
 invitations=json.loads((ROOT/'assets/data/r44-creative-invitations.json').read_text())
 invite_rows=[]
 for item in invitations:
  page=browser.new_page(viewport={'width':390,'height':844})
  row={'id':item['id'],'page':item['page'],'start':item['start'],'passed':False}
  try:
   page.goto('http://127.0.0.1:8765/es/taller/'+item['page']+'/?invitation='+item['id'],wait_until='networkidle',timeout=30000)
   page.wait_for_function("id => document.getElementById('igt-app')?.dataset.r44Invitation === id",arg=item['id'],timeout=20000)
   state=page.evaluate("() => {const a=document.getElementById('igt-app');return {ready:a.dataset.igsReady,start:a.dataset.r44Invitation}}")
   assert state['ready']=='true'
   assert state['start']==item['id']
   row['passed']=True
  except Exception as error:
   row['failure']=str(error)
  invite_rows.append(row);page.close()
 (OUT/'invitation-starts.json').write_text(json.dumps(invite_rows,ensure_ascii=False,indent=2))
 browser.close()
server.shutdown()
failed=[r for r in rows if not r['runtime_ready'] or r['errors'] or r.get('layout',{}).get('overflow')]
print(f'{len(rows)} initial views; {len(failed)} runtime/layout failures. Acceptance NOT_ASSESSED.')
raise SystemExit(bool(failed) or not file_result['passed'] or not c07['passed'] or not x06['passed'] or any(not r['passed'] for r in invite_rows))
