#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-accessible-reading')
def need(v,m):
 if not v:raise AssertionError(m)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page();await page.goto(BASE+'/es/lectura-accesible/',wait_until='domcontentloaded');await page.wait_for_selector('h1')
  need(await page.locator('html').get_attribute('lang')=='es','Accessible reading locale changed')
  need(await page.locator('body').get_attribute('data-ig-profile')=='content','Accessible reading not CONTENT')
  h=page.locator('.ig-r49-global-header');need(await h.count()==1,'R50 header missing')
  need(await h.get_by_role('button',name='Accesibilidad',exact=True).count()==1,'Accessibility button missing')
  need(await h.get_by_role('button',name='Música',exact=True).count()==1,'Music button missing')
  need(await page.get_by_role('heading',name='Lectura accesible',exact=True).count()>0,'Page heading missing')
  a=h.get_by_role('button',name='Accesibilidad',exact=True);await a.click();need(await page.locator('#ig-r49-settings[open]').count()==1,'Accessibility dialog did not open')
  contrast=page.get_by_role('button',name='Más contraste',exact=True);await contrast.click();need(await page.locator('html').get_attribute('data-ig-contrast')=='on','Contrast preference did not apply');await page.keyboard.press('Escape')
  for w,hh in [(1440,900),(390,844)]:
   await page.set_viewport_size({'width':w,'height':hh});await page.goto(BASE+'/es/lectura-accesible/',wait_until='domcontentloaded');await page.wait_for_selector('h1');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {w}');await page.screenshot(path=str(OUT/f'accessible-reading-{w}x{hh}.png'),full_page=True);report['screenshots'].append(f'accessible-reading-{w}x{hh}.png')
  await b.close()
 report['checks']=['r50-header','content-profile','accessibility-dialog','contrast-control','spanish-source-only','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
