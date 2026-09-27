#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-data')
def need(v,m):
 if not v:raise AssertionError(m)
async def check(page,path,access,music):
 req=[];page.on('request',lambda r:req.append(r.url));await page.goto(BASE+path,wait_until='networkidle');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'overflow '+path)
 h=page.locator('.ig-r49-global-header');need(await h.get_by_text('Iris Green',exact=True).count()==1,'brand '+path);need(await h.get_by_role('button',name=access,exact=True).count()==1,'a11y '+path);need(await h.get_by_role('button',name=music,exact=True).count()==1,'music '+path)
 for n in ['Condiciones','Conditions','Situaciones','Situations','Vida diaria','Everyday life','Investigación','Research','Recursos','Resources','Buscar','Search','Contenido','Content','Explorar','Explore']:need(await h.get_by_text(n,exact=True).count()==0,'forbidden '+n)
 m=h.get_by_role('button',name=music,exact=True);await m.click();await page.wait_for_timeout(100);need(not any('/audio/' in u for u in req),'audio autoplay');await page.keyboard.press('Escape');need(await m.evaluate('(e)=>document.activeElement===e'),'music focus')
 a=h.get_by_role('button',name=access,exact=True);await a.click();need(await page.locator('#ig-r49-settings[open]').count()==1,'a11y panel');await page.keyboard.press('Escape')
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  cases=[('/es/datos/','Accesibilidad','Música','data-es'),('/en/data/','Accessibility','Music','data-en'),('/es/datos/autismo-en-la-poblacion/','Accesibilidad','Música','datum-es'),('/en/data/autism-in-the-population/','Accessibility','Music','datum-en')]
  for path,a,m,name in cases:
   await check(page,path,a,m)
   for w,h in [(1440,900),(1920,1080),(390,844),(320,800)]:
    await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+path,wait_until='networkidle');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {path} {w}')
    if path in ['/es/datos/','/en/data/']:await page.screenshot(path=str(OUT/f'{name}-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'{name}-{w}x{h}.png')
  await b.close()
 report['checks']=['header-contract','music-no-autoplay','accessibility','es-en','browse-content','1440-1920-390-320'];(OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report))
if __name__=='__main__':asyncio.run(main())
