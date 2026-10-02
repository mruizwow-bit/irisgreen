#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-living-abroad')
def need(v,m):
 if not v:raise AssertionError(m)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  for path,lang,a,m,name in [('/es/vivir-fuera/?lang=es','es','Accesibilidad','Música','es'),('/es/vivir-fuera/?lang=en','en','Accessibility','Music','en')]:
   await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('h1',timeout=10000)
   need(await page.locator('html').get_attribute('lang')==lang,'language '+path);need(await page.locator('body').get_attribute('data-ig-profile')=='browse','BROWSE '+path)
   hd=page.locator('.ig-r49-global-header');need(await hd.count()==1,'header '+path);need(await hd.get_by_role('button',name=a,exact=True).count()==1,'a11y '+path);need(await hd.get_by_role('button',name=m,exact=True).count()==1,'music '+path)
   need(await page.locator('[data-ig-filter="chips"]').count()>0,'country filters missing '+path)
   need(await page.get_by_text('Portugal',exact=True).count()>0,'country cards missing '+path)
   for w,hh in [(1440,900),(390,844)]:
    await page.set_viewport_size({'width':w,'height':hh});await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('h1',timeout=10000);need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {path} {w}');await page.screenshot(path=str(OUT/f'living-abroad-{name}-{w}x{hh}.png'),full_page=True);report['screenshots'].append(f'living-abroad-{name}-{w}x{hh}.png')
  await b.close()
 report['checks']=['r50-header','browse-profile','country-filters','query-es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
