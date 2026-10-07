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
 browser.close()
server.shutdown()
failed=[r for r in rows if not r['runtime_ready'] or r['errors'] or r.get('layout',{}).get('overflow')]
print(f'{len(rows)} initial views; {len(failed)} runtime/layout failures. Acceptance NOT_ASSESSED.')
raise SystemExit(bool(failed))
