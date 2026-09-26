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
  b=await p.chromium.launch(executable_path=os.environ['IRIS_AUDIT_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']);results=[]
  for route in ['/es/intereses/sistema-solar/','/en/interests/solar-system/','/es/intereses/exoplanetas/','/en/interests/exoplanets/']:
   page=await b.new_page(viewport={'width':1280,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)));await page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort());await page.goto(base+route);await page.get_by_role('button',name='Abrir vista interactiva' if '/es/' in route else 'Open interactive view',exact=True).click();await page.wait_for_timeout(1200)
   live=await page.locator('.cn-live canvas').count();results.append({'route':route,'canvas':live,'errors':list(errors),'renderer':'software SwiftShader'})
   await page.screenshot(path=str(root/'reports/web-r22'/('webgl-'+route.strip('/').replace('/','-')+'.png')));await page.close()
  (root/'reports/web-r22/webgl.json').write_text(json.dumps(results,indent=2));print(json.dumps(results));await b.close()
asyncio.run(main())
