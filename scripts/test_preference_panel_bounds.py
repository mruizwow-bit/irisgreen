#!/usr/bin/env python3
"""Verify the contents of the reading panel, not just the panel's outer box."""
import functools,json,re,threading
from pathlib import Path
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'reports/preferences';OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
report={'cases':[],'failures':[],'note':'Combined presentation preferences at 150%; external services blocked. Each control must fit horizontally and be reachable by scrolling vertically.'}
settings={'version':2,'scale':1.5,'spacing':True,'controls':True,'contrast':True,'guide':True,'motion':True}
with sync_playwright() as pw:
    browser=pw.chromium.launch()
    for width in [1440,390,320]:
        for path in ['/','/es/neurodiversidad/condiciones/','/es/intereses/']:
            context=browser.new_context(viewport={'width':width,'height':900})
            context.add_init_script('localStorage.setItem("ig-a11y",'+json.dumps(json.dumps(settings))+');')
            context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
            page=context.new_page();page.set_default_timeout(10000);row={'path':path,'width':width}
            try:
                page.goto(BASE+path,wait_until='domcontentloaded');page.locator('main h1').first.wait_for()
                page.locator('#a11yBtn:visible,.ig-uh-reading:visible').first.click()
                panel=page.locator('[data-ig-reading-panel]');panel.wait_for(state='visible')
                row['panel_geometry']=panel.evaluate('(p)=>({width:p.clientWidth,scrollWidth:p.scrollWidth,height:p.clientHeight,scrollHeight:p.scrollHeight})')
                assert row['panel_geometry']['scrollWidth']<=row['panel_geometry']['width']+1,'Horizontal scrolling inside the panel'
                row['page_overflow']=page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')
                assert row['page_overflow']<=2,'Enlarged content overflows'
                controls=panel.locator('button:visible,a:visible');row['controls']=[]
                for n in range(controls.count()):
                    control=controls.nth(n);control.scroll_into_view_if_needed()
                    metrics=control.evaluate('(e)=>{const p=e.closest("[data-ig-reading-panel]").getBoundingClientRect(),r=e.getBoundingClientRect();return {label:e.textContent.trim(),left:r.left,right:r.right,top:r.top,bottom:r.bottom,panelLeft:p.left,panelRight:p.right,panelTop:p.top,panelBottom:p.bottom,client:e.clientWidth,scroll:e.scrollWidth}}')
                    assert metrics['left']>=metrics['panelLeft'] and metrics['right']<=metrics['panelRight']+1,metrics
                    assert metrics['top']>=metrics['panelTop'] and metrics['bottom']<=metrics['panelBottom']+1,metrics
                    assert metrics['scroll']<=metrics['client']+1,metrics
                    row['controls'].append(metrics)
                note=panel.locator('.ig-preference-note');assert note.count()==1
                note.scroll_into_view_if_needed();note_box=note.bounding_box();panel_box=panel.bounding_box()
                assert note_box['x']>=panel_box['x'] and note_box['x']+note_box['width']<=panel_box['x']+panel_box['width']+1
                panel.evaluate('(e)=>e.scrollTop=0')
                page.screenshot(path=str(OUT/f'panel-{path.strip("/").replace("/","-") or "home"}-{width}.png'))
                page.keyboard.press('Escape');assert not panel.is_visible()
                if path=='/es/intereses/' and width==320:
                    page.locator('main .cromo').first.scroll_into_view_if_needed()
                    page.screenshot(path=str(OUT/'cromos-ampliados-320.png'))
                row['passed']=True
            except Exception as error:
                row['passed']=False;row['error']=str(error);report['failures'].append(row.copy())
            report['cases'].append(row);context.close()
    browser.close()
server.shutdown();report['passed']=not report['failures']
report['summary']={'tested':len(report['cases']),'passed':sum(c['passed'] for c in report['cases'])}
(OUT/'panel-bounds.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
if not report['passed']:raise SystemExit(1)
