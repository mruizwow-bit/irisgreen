#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-visual-routines')
def need(v,m):
 if not v:raise AssertionError(m)
async def set_stage(page,stage):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined');await page.evaluate(f"IGAudience.set('{stage}')")
async def open_r(page,path):
 await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('#rv-builder-steps');await page.wait_for_timeout(150)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  await set_stage(page,'children');await open_r(page,'/es/recursos/rutinas-visuales/?rutina=limpiar-la-casa')
  need(await page.locator('.ig-r49-global-header').count()==1,'Visual routines R50 header missing')
  need(await page.locator('#rv-builder-steps li').count()==0,'Adult routine preloaded in child view')
  need('no se muestra' in (await page.locator('#rv-builder-status').inner_text()).lower(),'Blocked routine status missing')
  await open_r(page,'/es/recursos/rutinas-visuales/?rutina=ir-al-bano');need(await page.locator('#rv-builder-steps li').count()>0,'Child routine did not preload')
  await set_stage(page,'adults');await open_r(page,'/es/recursos/rutinas-visuales/?rutina=limpiar-la-casa');need(await page.locator('#rv-builder-steps li').count()>0,'Adult routine did not preload in adult view')
  await set_stage(page,'any');await open_r(page,'/es/recursos/rutinas-visuales/?rutina=ir-al-bano');need(await page.locator('#rv-builder-steps li').count()==0,'Child-only routine loaded in any-age view')
  await open_r(page,'/es/recursos/rutinas-visuales/?rutina=manana-para-salir');need(await page.locator('#rv-builder-steps li').count()>0,'Transversal routine missing in any-age view')
  await set_stage(page,'children');await open_r(page,'/en/resources/visual-routines/');need(await page.locator('html').get_attribute('lang')=='en','EN visual routines language mismatch')
  for w,h in [(1440,900),(390,844)]:
   await page.set_viewport_size({'width':w,'height':h});await open_r(page,'/en/resources/visual-routines/');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'Visual routines overflow {w}');await page.screenshot(path=str(OUT/f'visual-routines-en-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'visual-routines-en-{w}x{h}.png')
  await b.close()
 report['checks']=['r50-header','child-block-adult-query','child-allowed-query','adult-allowed-query','any-age-transversal-only','es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
