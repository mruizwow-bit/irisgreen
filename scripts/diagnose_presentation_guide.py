#!/usr/bin/env python3
import functools,json,threading
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path.cwd()
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT/'dist')))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
rows=[]
def box(locator):
    b=locator.bounding_box();return None if not b else {k:round(v,2) for k,v in b.items()}
def overlap(a,b):
    return bool(a and b and a['x']<b['x']+b['width'] and a['x']+a['width']>b['x'] and a['y']<b['y']+b['height'] and a['y']+a['height']>b['y'])
with sync_playwright() as pw:
  browser=pw.chromium.launch()
  for width in [1440,390,320]:
    ctx=browser.new_context(viewport={'width':width,'height':900});page=ctx.new_page();page.set_default_timeout(12000)
    page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(BASE) else r.abort())
    page.goto(BASE+'/es/lectura-accesible/',wait_until='domcontentloaded');page.locator('main h1').first.wait_for()
    trig=page.locator('[data-ig-reading-trigger]:visible,.ig-uh-reading:visible,#a11yBtn:visible').first;trig.click()
    panel=page.locator('[data-ig-reading-panel]:visible').first;details=panel.locator('[data-ig-presentation-settings]');details.wait_for()
    if not details.get_attribute('open'):details.locator('summary').press('Enter')
    upper=details.locator('[data-ig-guide-position="upper"]');lower=details.locator('[data-ig-guide-position="lower"]');height=details.locator('[data-ig-guide-height]')
    upper.focus();upper.press('Enter');page.wait_for_timeout(100)
    guide=page.locator('#ig-guide,#rguide').filter(visible=True).first
    one={'width':width,'upper_pressed':upper.get_attribute('aria-pressed'),'upper_button':box(upper),'guide_upper':box(guide),'root_after_upper':page.evaluate('document.documentElement.dataset.igGuidePosition')}
    lower.focus();lower.press('Enter');page.wait_for_timeout(100)
    one.update(lower_pressed=lower.get_attribute('aria-pressed'),lower_button=box(lower),guide_lower=box(guide),root_after_lower=page.evaluate('document.documentElement.dataset.igGuidePosition'))
    height.select_option('tall');page.wait_for_timeout(100)
    one.update(height_value=height.input_value(),guide_tall=box(guide),root_height=page.evaluate('document.documentElement.dataset.igGuideHeight'))
    lower.focus();page.wait_for_timeout(150)
    gb,lb=box(guide),box(lower);one.update(guide_after_focus=gb,button_after_focus=lb,overlap_after_focus=overlap(gb,lb),scroll_y=page.evaluate('scrollY'))
    rows.append(one);ctx.close()
  browser.close()
server.shutdown()
print(json.dumps(rows,ensure_ascii=False,indent=2))
Path('reports/accessibility/guide-diagnostic.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
