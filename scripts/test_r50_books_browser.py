#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-books')
def need(v,m):
 if not v:raise AssertionError(m)
async def check(page,path,lang,access,music):
 await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('.ig-book-card',timeout=10000)
 need(await page.locator('html').get_attribute('lang')==lang,'language '+path);need(await page.locator('body').get_attribute('data-ig-profile')=='browse','browse '+path)
 h=page.locator('.ig-r49-global-header');need(await h.count()==1,'R50 header '+path);need(await h.get_by_role('button',name=access,exact=True).count()==1,'a11y '+path);need(await h.get_by_role('button',name=music,exact=True).count()==1,'music '+path)
 need(await page.locator('.ig-book-card').count()>=2,'Book cards missing '+path)
 need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'overflow '+path)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  for path,lang,a,m,name in [('/es/libros/?lang=es','es','Accesibilidad','Música','es'),('/es/libros/?lang=en','en','Accessibility','Music','en')]:
   await check(page,path,lang,a,m)
   for w,h in [(1440,900),(390,844)]:
    await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('.ig-book-card',timeout=10000);need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {path} {w}');await page.screenshot(path=str(OUT/f'books-{name}-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'books-{name}-{w}x{h}.png')
  await b.close()
 report['checks']=['r50-header','browse-width','book-cards','query-es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
