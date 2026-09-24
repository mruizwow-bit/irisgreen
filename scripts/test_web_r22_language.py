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
  b=await p.chromium.launch(executable_path=os.environ['IRIS_AUDIT_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage']);page=await b.new_page();await page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort());await page.goto(base+'/');await page.get_by_role('button',name='English',exact=True).click();await page.wait_for_timeout(300);await page.locator('#ig-page-finder>summary').click()
  result={'lang':await page.locator('html').get_attribute('lang'),'finder':await page.locator('#ig-page-finder>summary').inner_text(),'links':await page.locator('#ig-section-list a').all_inner_texts()};print(result);assert result['lang']=='en';assert result['finder']=='Find a section on this page';assert 'Explore Iris Green' in result['links'];assert all(result['links']);(root/'reports/web-r22/home-language.json').write_text(json.dumps(result,indent=2));await b.close()
asyncio.run(main())
