#!/usr/bin/env python3
"""R50 Everyday life browser QA."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-everyday')
def need(v,m):
 if not v:raise AssertionError(m)
async def header_check(page,path,access,music):
 requests=[];page.on('request',lambda r:requests.append(r.url))
 await page.goto(BASE+path,wait_until='networkidle')
 need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'overflow '+path)
 h=page.locator('.ig-r49-global-header');need(await h.count()==1,'header missing '+path)
 need(await h.get_by_text('Iris Green',exact=True).count()==1,'brand missing '+path)
 need(await h.get_by_role('button',name=access,exact=True).count()==1,'accessibility missing '+path)
 need(await h.get_by_role('button',name=music,exact=True).count()==1,'music missing '+path)
 for name in ['Condiciones','Conditions','Situaciones','Situations','Vida diaria','Everyday life','Investigación','Research','Recursos','Resources','Buscar','Search','Contenido','Content','Explorar','Explore']:
  need(await h.get_by_text(name,exact=True).count()==0,'forbidden top-bar label '+name+' '+path)
 m=h.get_by_role('button',name=music,exact=True);await m.click();await page.wait_for_timeout(100)
 need(await page.locator('#ig-music-panel').count()==1,'music panel missing '+path);need(not any('/audio/' in u for u in requests),'audio autoplay '+path)
 await page.keyboard.press('Escape');need(await m.evaluate('(e)=>document.activeElement===e'),'music focus return '+path)
 a=h.get_by_role('button',name=access,exact=True);await a.click();need(await page.locator('#ig-r49-settings[open]').count()==1,'a11y dialog missing '+path)
 await page.keyboard.press('Escape');need(await a.evaluate('(e)=>document.activeElement===e'),'a11y focus return '+path)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'screenshots':[],'checks':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  cases=[('/es/biblioteca/','Accesibilidad','Música','life-es'),('/en/everyday-life/','Accessibility','Music','life-en'),('/es/biblioteca/cocinar-y-seguridad-domestica/','Accesibilidad','Música','cooking-es'),('/en/everyday-life/cooking-and-home-safety/','Accessibility','Music','cooking-en')]
  for path,acc,mus,name in cases:
   await header_check(page,path,acc,mus)
   for w,h in [(1440,900),(1920,1080),(390,844),(320,800)]:
    await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+path,wait_until='networkidle')
    need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {path} {w}')
    if path in ['/es/biblioteca/','/en/everyday-life/']:
     await page.screenshot(path=str(OUT/f'{name}-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'{name}-{w}x{h}.png')
  # Child-safe page remains a safe shell and does not fetch its full body on load.
  req=[];page.on('request',lambda r:req.append(r.url))
  await page.goto(BASE+'/es/biblioteca/abuso-explotacion-y-relaciones-seguras/',wait_until='networkidle')
  need(await page.locator('[data-ig-s2-safe]').count()==1,'child-safe shell lost in Everyday life')
  need(not any('/assets/safety/full/' in u for u in req),'full S2 fetched on Everyday-life load')
  await b.close()
 report['checks']=['header-contract','music-no-autoplay','keyboard-focus-return','es-en','browse-content','child-safe-preserved','1440-1920-390-320']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
