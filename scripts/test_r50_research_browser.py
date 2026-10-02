#!/usr/bin/env python3
"""R50 Research browser QA."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-research')
def need(v,m):
 if not v:raise AssertionError(m)
async def check(page,url,lang,access,music):
 requests=[];page.on('request',lambda r:requests.append(r.url))
 await page.goto(BASE+url,wait_until='networkidle')
 need(await page.locator('html').get_attribute('lang')==lang,'Research language mismatch '+url)
 need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'overflow '+url)
 h=page.locator('.ig-r49-global-header');need(await h.count()==1,'header missing '+url)
 need(await h.get_by_text('Iris Green',exact=True).count()==1,'brand missing '+url)
 need(await h.get_by_role('button',name=access,exact=True).count()==1,'accessibility missing '+url)
 need(await h.get_by_role('button',name=music,exact=True).count()==1,'music missing '+url)
 for name in ['Condiciones','Conditions','Situaciones','Situations','Vida diaria','Everyday life','Investigación','Research','Recursos','Resources','Buscar','Search','Contenido','Content','Explorar','Explore']:
  need(await h.get_by_text(name,exact=True).count()==0,'forbidden top-bar label '+name+' '+url)
 need(not any('/assets/safety/full/research-' in u for u in requests),'Research full S2 fetched on initial load '+url)
 m=h.get_by_role('button',name=music,exact=True);await m.click();await page.wait_for_timeout(100)
 need(await page.locator('#ig-music-panel').count()==1,'music panel missing '+url);need(not any('/audio/' in u for u in requests),'audio autoplay '+url)
 await page.keyboard.press('Escape');need(await m.evaluate('(e)=>document.activeElement===e'),'music focus return '+url)
 a=h.get_by_role('button',name=access,exact=True);await a.click();need(await page.locator('#ig-r49-settings[open]').count()==1,'a11y dialog missing '+url)
 await page.keyboard.press('Escape');need(await a.evaluate('(e)=>document.activeElement===e'),'a11y focus return '+url)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'screenshots':[],'checks':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  for url,lang,acc,mus,name in [('/es/investigacion/?lang=es','es','Accesibilidad','Música','research-es'),('/es/investigacion/?lang=en','en','Accessibility','Music','research-en')]:
   await check(page,url,lang,acc,mus)
   for w,h in [(1440,900),(1920,1080),(390,844),(320,800)]:
    await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+url,wait_until='networkidle')
    need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {url} {w}')
    await page.screenshot(path=str(OUT/f'{name}-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'{name}-{w}x{h}.png')
  await b.close()
 report['checks']=['header-contract','music-no-autoplay','keyboard-focus-return','query-lang-es-en','child-safe-initial-payload','1440-1920-390-320']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
