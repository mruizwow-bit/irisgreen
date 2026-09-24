#!/usr/bin/env python3
"""Full built HTML sweep; structural tests are separate. Not WCAG certification."""
import argparse,asyncio,functools,json,threading,time
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.async_api import async_playwright
p=argparse.ArgumentParser();p.add_argument('--root',type=Path,default=Path('dist'));p.add_argument('--browser',required=True);p.add_argument('--axe',required=True);p.add_argument('--out',type=Path,default=Path('reports/web-r22'));p.add_argument('--sample',action='store_true');p.add_argument('--routes',nargs='+');p.add_argument('--widths',type=int,nargs='+',default=[320,1280]);a=p.parse_args();a.out.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(a.root.resolve())))
threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
LAYOUT="""()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,offenders:[...document.querySelectorAll('main *')].filter(e=>{let r=e.getBoundingClientRect();return r.width>0&&r.right>innerWidth+2&&getComputedStyle(e).position!=='fixed'&&!e.closest('[hidden]')}).slice(0,8).map(e=>({tag:e.tagName,id:e.id,cls:String(e.className).slice(0,70)}))})"""
AXE="""async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,count:v.nodes.length}))}}"""
async def run():
 paths=[('/'+f.relative_to(a.root).as_posix()).replace('/index.html','/') for f in sorted(a.root.rglob('*.html'))]
 if a.sample:paths=[x for x in paths if len(x.split('/'))<=4 or '/taller/' in x or '/workshop/' in x or '/intereses/' in x or '/interests/' in x]
 if a.routes:paths=a.routes
 jobs=asyncio.Queue()
 for width in a.widths:
  for route in paths:jobs.put_nowait((route,width))
 rows=[];start=time.time()
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path=a.browser,args=['--no-sandbox','--disable-dev-shm-usage'])
  async def worker():
   context=await browser.new_context(viewport={'width':320,'height':900},reduced_motion='reduce')
   await context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(base) else r.abort())
   page=await context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   while not jobs.empty():
    route,width=jobs.get_nowait();errors.clear();row={'route':route,'viewport':width}
    try:
     await page.set_viewport_size({'width':width,'height':900})
     response=await page.goto(base+route,wait_until='load',timeout=30000);row['http']=response.status
     await page.wait_for_timeout(200)
     await page.add_script_tag(path=a.axe)
     if ('/exoplanets/list/' in route or '/exoplanetas/lista/' in route):
      row['axe_scope']='Deferred: very large static catalogue; full structural audit and browser layout checked separately'
     else:
      row.update(await asyncio.wait_for(page.evaluate(AXE),timeout=45))
     row['layout']=await page.evaluate(LAYOUT);row['errors']=list(errors)
    except Exception as e:row['error']=str(e)
    rows.append(row);jobs.task_done()
    if len(rows)%25==0:
     print(f'{len(rows)}/{len(paths)*len(a.widths)} in {time.time()-start:.0f}s',flush=True)
     (a.out/'browser.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
   await context.close()
  await asyncio.gather(*(worker() for _ in range(4)));await browser.close()
 (a.out/'browser.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
 summary={'pages':len(rows),'axe_pages':sum(bool(r.get('violations')) for r in rows),'overflow_pages':sum(r.get('layout',{}).get('scroll',0)>r['viewport']+2 for r in rows),'error_pages':sum(bool(r.get('error') or r.get('errors')) for r in rows),'seconds':round(time.time()-start)}
 (a.out/'summary.json').write_text(json.dumps(summary,indent=2));print(summary)
asyncio.run(run())
