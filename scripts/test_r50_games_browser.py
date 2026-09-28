#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-games')
def need(v,m):
 if not v:raise AssertionError(m)
async def set_stage(page,stage):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined');await page.evaluate(f"IGAudience.set('{stage}')")
async def open_games(page,path='/es/recursos/juegos/'):
 await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('#jg-app');await page.wait_for_timeout(250)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined');await page.evaluate("IGAudience.clear()")
  await open_games(page)
  need(await page.locator('.ig-r49-global-header').count()==1,'Games R50 header missing')
  need(await page.locator('.jg-stage-entry').count()==1,'Default Games stage chooser missing')
  await set_stage(page,'children');await open_games(page)
  need(await page.locator('.jg-stage-entry').count()==0,'Child view still offers stage chooser')
  need(await page.locator('.jg-stage-rail button[data-k^="stage-"]').count()==0,'Child view can switch stage inside Games')
  note=await page.locator('.jg-hub-note').inner_text();need('251' in note,'Child game count not filtered: '+note)
  await open_games(page,'/es/recursos/juegos/#juego-responder-un-correo')
  need(await page.locator('.jg-r41-game').count()==0,'Adult-only game opened in child view');need(await page.evaluate('location.hash')=='','Blocked child deep link hash remained')
  await open_games(page,'/es/recursos/juegos/#juego-que-falta-dientes')
  need(await page.locator('.jg-r41-game').count()==1,'Child-only game did not open in child view')
  await set_stage(page,'teenagers');await open_games(page);note=await page.locator('.jg-hub-note').inner_text();need('285' in note,'Teen game count not filtered: '+note)
  await open_games(page,'/es/recursos/juegos/#juego-cambiar-de-aula');need(await page.locator('.jg-r41-game').count()==1,'Teen-only game did not open')
  await set_stage(page,'adults');await open_games(page);note=await page.locator('.jg-hub-note').inner_text();need('284' in note,'Adult game count not filtered: '+note)
  await open_games(page,'/es/recursos/juegos/#juego-responder-un-correo');need(await page.locator('.jg-r41-game').count()==1,'Adult-only game did not open in adult view')
  await set_stage(page,'any');await open_games(page);note=await page.locator('.jg-hub-note').inner_text();need('240' in note,'Any-age game count not transversal-only: '+note)
  await open_games(page,'/es/recursos/juegos/#juego-que-falta-dientes');need(await page.locator('.jg-r41-game').count()==0,'Child-only game opened in any-age view')
  await set_stage(page,'children');await open_games(page,'/en/resources/games/');need(await page.locator('html').get_attribute('lang')=='en','EN Games language mismatch');need(await page.locator('.jg-stage-entry').count()==0,'EN child view not locked')
  for w,h in [(1440,900),(390,844)]:
   await page.set_viewport_size({'width':w,'height':h});await open_games(page,'/en/resources/games/');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'Games overflow {w}');await page.screenshot(path=str(OUT/f'games-en-child-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'games-en-child-{w}x{h}.png')
  await b.close()
 report['checks']=['r50-header','default-stage-chooser','child-lock-251','child-deep-link-block','teen-285','adult-284','any-age-240','es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
