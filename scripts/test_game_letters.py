#!/usr/bin/env python3
"""Additional tests on uninstrumented production HTML: native canvas exports,
long input, hash changes, Escape, tab containment and return to the opener.
"""
import functools,json,threading
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image
ROOT=Path.cwd();OUT=ROOT/'reports/games';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
report={'cases':[],'failures':[],'notes':['Uses unmodified production HTML, not the selector-instrumented test server.','The canvas spy records native fillText calls and still draws the real PNG.']}
SPY='''window.igCanvasText=[];const original=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t,x,y){window.igCanvasText.push({text:String(t),x,y,width:this.measureText(String(t)).width});return original.apply(this,arguments)};'''
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width in [1440,390,320]:
        for lang in ['es','en']:
            row={'width':width,'language':lang};context=browser.new_context(viewport={'width':width,'height':900},accept_downloads=True);page=context.new_page();page.set_default_timeout(10000)
            page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) or r.request.url.startswith(('blob:','data:')) else r.abort())
            page.add_init_script(SPY)
            try:
                page.goto(BASE+'/es/recursos/juegos/?lang='+lang+'#carta-la-consulta',wait_until='domcontentloaded')
                dialog=page.locator('#ig-game-letter');dialog.wait_for(state='visible')
                fields=dialog.locator('textarea');assert fields.count()==3
                values=['áéíóú ñ Texto de prueba','Segunda respuesta con espacios','Z'*120]
                for field,value in zip(fields.all(),values):field.fill(value)
                name='Descargar mi carta' if lang=='es' else 'Download my card'
                with page.expect_download() as event:dialog.get_by_role('button',name=name,exact=True).click()
                dest=OUT/f'letter-long-{width}-{lang}.png';event.value.save_as(dest)
                with Image.open(dest) as im:assert im.size==(900,1200)
                calls=page.evaluate('window.igCanvasText');joined=''.join(c['text'] for c in calls)
                for value in values:assert value in joined,'Export loses text: '+value[:25]
                assert all(c['x']+c['width']<=852 and c['y']<=1140 for c in calls),'Canvas text outside the safe area'
                row['all_input_preserved']=True
                assert dialog.evaluate('(e)=>e.contains(document.activeElement)')
                for _ in range(10):
                    page.keyboard.press('Tab');assert dialog.evaluate('(e)=>e.contains(document.activeElement)')
                for _ in range(10):
                    page.keyboard.press('Shift+Tab');assert dialog.evaluate('(e)=>e.contains(document.activeElement)')
                page.evaluate('location.hash="#carta-las-cinco-cosas"')
                page.wait_for_function('document.querySelectorAll("#ig-game-letter textarea").length===2')
                row['hash_changes_form']=True
                page.keyboard.press('Escape');assert not dialog.count()
                assert not page.locator('main').evaluate('(e)=>e.inert')
                name='Rellenar mi carta' if lang=='es' else 'Fill in my card'
                opener=page.get_by_role('button',name=name,exact=True).first
                opener.focus();opener.press('Enter');dialog.wait_for(state='visible')
                page.keyboard.press('Escape');assert opener.evaluate('(e)=>document.activeElement===e'),'Focus did not return to opener'
                row['keyboard_and_focus_pass']=True
                page.screenshot(path=str(OUT/f'letter-return-{width}-{lang}.png'))
                row['passed']=True
            except Exception as e:
                row['passed']=False;row['error']=str(e);report['failures'].append(row.copy())
            report['cases'].append(row);context.close()
    browser.close()
server.shutdown();report['passed']=not report['failures']
(OUT/'letter-edge-tests.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
if not report['passed']:raise SystemExit(1)
