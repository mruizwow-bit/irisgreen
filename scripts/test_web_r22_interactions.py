import asyncio,json,threading,functools,os
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from playwright.async_api import async_playwright
root=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root/'dist')));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(executable_path=os.environ['IRIS_AUDIT_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage'])
  results=[]
  for width in [320,390,1280]:
   for lang,route in [('es','/es/sitio-tranquilo/'),('en','/en/quiet-space/')]:
    page=await b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');await page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
    await page.goto(base+route);await page.locator('#ig-page-finder>summary').focus();await page.keyboard.press('Enter');await page.locator('#ig-section-query').fill('Escuchar' if lang=='es' else 'Listen');link=page.locator('#ig-section-list li:not([hidden]) a');assert await link.count()==1;await link.focus();await page.keyboard.press('Enter');assert await page.locator('#listen').get_attribute('open') is not None;assert await page.locator('#ig-page-finder').get_attribute('open') is None
    await page.locator('[data-sound-filter]').last.click();assert await page.locator('#genList .qchoice:not([hidden])').count()==2;assert await page.locator('#genList .qgen-h:not([hidden])').inner_text() in ['Música','Music']
    await page.add_script_tag(path=os.environ['IRIS_AUDIT_AXE']);axe=await page.evaluate("async()=>{let r=await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))}")
    overflow=await page.evaluate('document.documentElement.scrollWidth>innerWidth+2');results.append({'route':route,'width':width,'axe':axe,'overflow':overflow,'keyboard':'PASS'})
    await page.screenshot(path=str(root/f'reports/web-r22/quiet-{lang}-{width}.png'),full_page=True)
    # Increased text and WCAG text spacing within the built page.
    await page.add_style_tag(content='html{font-size:200%!important} main *{line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} main p{margin-bottom:2em!important}')
    results.append({'route':route,'width':width,'large_text_overflow':await page.evaluate('document.documentElement.scrollWidth>innerWidth+2')})
    await page.close()
  for route in ['/es/intereses/cielo/','/en/interests/night-sky/','/es/intereses/sistema-solar/','/en/interests/solar-system/','/es/intereses/exoplanetas/','/en/interests/exoplanets/']:
   page=await b.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));await page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort());await page.goto(base+route);await page.wait_for_timeout(800)
   lazy=page.get_by_role('button',name='Abrir vista interactiva',exact=True).or_(page.get_by_role('button',name='Open interactive view',exact=True))
   if await lazy.count():
    assert await page.locator('script[src$="-3d.js"]').count()==0
    await lazy.click();await page.wait_for_timeout(600)
   results.append({'route':route,'errors':list(errors),'title':await page.title(),'overflow':await page.evaluate('document.documentElement.scrollWidth>innerWidth+2')})
   await page.screenshot(path=str(root/'reports/web-r22'/('interests-'+route.strip('/').replace('/','-')+'.png')))
   await page.close()
  context=await b.new_context(java_script_enabled=False,viewport={'width':320,'height':900});page=await context.new_page();await page.goto(base+'/es/sitio-tranquilo/');await page.locator('#listen>summary').click();assert await page.locator('#audio').is_visible();results.append({'nojs_quiet':'PASS'});await context.close()
  (root/'reports/web-r22/focused.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2));await b.close()
asyncio.run(main())
