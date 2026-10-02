#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-printable-routines')
def need(v,m):
 if not v:raise AssertionError(m)
async def set_stage(page,stage):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined');await page.evaluate(f"IGAudience.set('{stage}')")
async def open_p(page,path='/es/recursos/rutinas-imprimibles/'):
 await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('#im-app');await page.wait_for_timeout(200)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined');await page.evaluate("IGAudience.clear()");await open_p(page)
  need(await page.locator('.ig-r49-global-header').count()==1,'Printable routines R50 header missing');need(await page.locator('.im-stage-entry').count()==1,'Default printable stage chooser missing')
  await set_stage(page,'children');await open_p(page);need(await page.locator('.im-stage-entry').count()==0,'Child view still offers printable stage chooser');need(await page.locator('.im-stage-rail button[data-act^="stage:"]').count()==0,'Child view can switch printable stage')
  txt=await page.locator('.im-tabs').inner_text();need('87' in txt,'Child printable routine count not filtered: '+txt)
  await open_p(page,'/es/recursos/rutinas-imprimibles/#pack-limpiar-la-casa');need(await page.locator('.im-detail').count()==0,'Adult routine deep link opened in child view');need(await page.evaluate('location.hash')=='','Blocked printable hash remained')
  await open_p(page,'/es/recursos/rutinas-imprimibles/#pack-ir-al-bano');need(await page.locator('.im-detail').count()==1,'Child routine did not open')
  await set_stage(page,'teenagers');await open_p(page);txt=await page.locator('.im-tabs').inner_text();need('104' in txt,'Teen printable count not filtered: '+txt)
  await set_stage(page,'adults');await open_p(page);txt=await page.locator('.im-tabs').inner_text();need('105' in txt,'Adult printable count not filtered: '+txt);await open_p(page,'/es/recursos/rutinas-imprimibles/#pack-limpiar-la-casa');need(await page.locator('.im-detail').count()==1,'Adult routine did not open')
  await set_stage(page,'any');await open_p(page);txt=await page.locator('.im-tabs').inner_text();need('83' in txt,'Any-age printable count not transversal-only: '+txt);await open_p(page,'/es/recursos/rutinas-imprimibles/#pack-ir-al-bano');need(await page.locator('.im-detail').count()==0,'Child-only routine opened in any-age view')
  await set_stage(page,'children');await open_p(page,'/en/resources/printable-routines/');need(await page.locator('html').get_attribute('lang')=='en','EN printable language mismatch')
  for w,h in [(1440,900),(390,844)]:
   await page.set_viewport_size({'width':w,'height':h});await open_p(page,'/en/resources/printable-routines/');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'Printable routines overflow {w}');await page.screenshot(path=str(OUT/f'printable-routines-en-child-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'printable-routines-en-child-{w}x{h}.png')
  await b.close()
 report['checks']=['r50-header','default-stage-chooser','child-87','child-deep-link-block','teen-104','adult-105','any-age-83','es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
