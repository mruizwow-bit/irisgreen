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
  b=await p.chromium.launch(executable_path=os.environ['IRIS_AUDIT_BROWSER'],args=['--no-sandbox','--disable-dev-shm-usage']);results=[]
  for width in [320,1280]:
   for route in ['/es/intereses/exoplanetas/lista/','/en/interests/exoplanets/list/']:
    page=await b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');await page.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort());await page.goto(base+route)
    await page.add_script_tag(path=os.environ['IRIS_AUDIT_AXE'])
    total=await page.evaluate("()=>{window.auditRows=[...document.querySelectorAll('tbody tr')];return auditRows.length}")
    for start in range(0,total,200):
     await page.evaluate("start=>document.querySelector('tbody').replaceChildren(...auditRows.slice(start,start+200))",start)
     violations=await page.evaluate("async()=>{let r=await axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))}")
     results.append({'route':route,'width':width,'first_row':start,'rows':min(200,total-start),'violations':violations})
    print(route,width,total,flush=True);await page.close()
  (root/'reports/web-r22/catalogue-batches.json').write_text(json.dumps(results,indent=2));print('Batches',len(results),'violations',sum(bool(r['violations']) for r in results));await b.close()
asyncio.run(main())
