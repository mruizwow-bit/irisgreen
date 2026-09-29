#!/usr/bin/env python3
"""R51 A2 · Home v4 canonical age filter browser QA."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r51-home-age')
def need(v,m):
 if not v: raise AssertionError(m)
STAGES={
 'GENERAL':{'research':1,'data':1,'support':1},
 'AGE_0_12':{'research':0,'data':0,'support':0},
 'AGE_13_17':{'research':1,'data':1,'support':0},
 'AGE_18_PLUS':{'research':1,'data':1,'support':1},
 'ALL_AGES':{'research':0,'data':0,'support':0},
}
async def verify(page,path,frags):
 await page.goto(BASE+path,wait_until='networkidle');await page.wait_for_function('window.IGAudience !== undefined')
 need(await page.locator('[data-ig-home-version="v4"]').count()==1,'Home v4 missing '+path)
 need(await page.locator('.ig-home-v4-card').count()==13,'Home v4 card count changed '+path)
 for band,expected in STAGES.items():
  if band=='GENERAL': await page.evaluate('IGAudience.clear()')
  else: await page.evaluate('(b)=>IGAudience.set(b)',band)
  await page.wait_for_timeout(80)
  need(await page.locator('html').get_attribute('data-ig-audience')==band,'canonical band not emitted '+band)
  for key,want in expected.items():
   n=page.locator(f'.ig-home-v4-card[href*="{frags[key]}"]')
   need(await n.count()==1,f'Home classified card missing {path} {key}');need(await n.is_visible()==bool(want),f'Home visibility wrong {path} {band} {key}')
  # Unclassified v4 product spaces remain available until their own canonical matrices exist.
  need(await page.locator(f'.ig-home-v4-card[href*="{frags["games"]}"]').count()==1,'Games vanished '+band)
  need(await page.locator(f'.ig-home-v4-card[href*="{frags["workshop"]}"]').count()==1,'Workshop vanished '+band)
async def main():
 OUT.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  await verify(page,'/',{'research':'/es/investigacion/','data':'/es/datos/','support':'/es/tramites/directorio/','games':'/es/recursos/juegos/','workshop':'/es/taller/'})
  await verify(page,'/en/',{'research':'/es/investigacion/','data':'/en/data/','support':'/es/tramites/directorio/','games':'/en/resources/games/','workshop':'/en/workshop/'})
  await b.close()
 report={'home_v4_es':'PASS','home_v4_en':'PASS','GENERAL':'PASS','AGE_0_12':'PASS','AGE_13_17':'PASS','AGE_18_PLUS':'PASS','ALL_AGES':'PASS','matrix':'R51 965'}
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__': asyncio.run(main())
