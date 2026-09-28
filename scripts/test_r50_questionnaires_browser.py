#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-questionnaires')
def need(v,m):
 if not v:raise AssertionError(m)
async def set_stage(page,stage):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined');await page.evaluate(f"IGAudience.set('{stage}')")
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  for stage in ['children','teenagers','any']:
   await set_stage(page,stage);await page.goto(BASE+'/es/cuestionarios/',wait_until='domcontentloaded')
   await page.wait_for_selector('[data-ig-audience-blocked-message]',timeout=5000)
   need(await page.locator('main').first.is_hidden(),stage+' can see adult questionnaires')
  await set_stage(page,'adults');await page.goto(BASE+'/es/cuestionarios/?lang=es',wait_until='domcontentloaded');await page.wait_for_selector('h1')
  need(await page.locator('body').get_attribute('data-ig-profile')=='workspace','Questionnaires not workspace')
  need(await page.locator('.ig-r49-global-header').count()==1,'R50 header missing')
  need(await page.get_by_text('Solo para mayores de 18 años',exact=True).count()>0,'adult validation notice missing')
  await page.goto(BASE+'/es/cuestionarios/?lang=en',wait_until='domcontentloaded');await page.wait_for_selector('h1')
  need(await page.locator('html').get_attribute('lang')=='en','EN query language missing')
  need(await page.get_by_text('Adults aged 18 and over only',exact=True).count()>0,'EN adult validation notice missing')
  for w,h in [(1440,900),(390,844)]:
   await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+'/es/cuestionarios/?lang=en',wait_until='domcontentloaded');await page.wait_for_selector('h1');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {w}');await page.screenshot(path=str(OUT/f'questionnaires-adult-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'questionnaires-adult-{w}x{h}.png')
  await b.close()
 report['checks']=['adult-only-gate','r50-header','workspace','query-es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
