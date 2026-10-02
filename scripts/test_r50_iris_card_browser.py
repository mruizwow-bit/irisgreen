#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-iris-card')
def need(v,m):
 if not v:raise AssertionError(m)
async def check(page,path,lang,access,music,value):
 req=[];page.on('request',lambda r:req.append(r.url));await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('#ti-cuesta')
 need(await page.locator('html').get_attribute('lang')==lang,'language '+path);need(await page.locator('body').get_attribute('data-ig-profile')=='workspace','workspace '+path)
 h=page.locator('.ig-r49-global-header');need(await h.count()==1,'R50 header '+path);need(await h.get_by_role('button',name=access,exact=True).count()==1,'a11y '+path);need(await h.get_by_role('button',name=music,exact=True).count()==1,'music '+path)
 await page.locator('#ti-cuesta').fill(value);await page.wait_for_timeout(120);need(value in await page.locator('#ti-plain').inner_text(),'live preview/text did not update '+path)
 need(await page.evaluate("()=>Object.keys(localStorage).filter(k=>k.toLowerCase().includes('tarjeta')||k.toLowerCase().includes('iris-card')).length")==0,'Iris Card leaked to localStorage '+path)
 m=h.get_by_role('button',name=music,exact=True);await m.click();await page.wait_for_timeout(80);need(not any('/audio/' in u for u in req),'audio autoplay '+path);await page.keyboard.press('Escape')
 need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'overflow '+path)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();ctx=await b.new_context();page=await ctx.new_page()
  cases=[('/es/recursos/tarjeta-iris/','es','Accesibilidad','Música','Necesito más tiempo','es'),('/en/resources/iris-card/','en','Accessibility','Music','I need more time','en')]
  for path,lang,a,m,val,name in cases:
   await check(page,path,lang,a,m,val)
   for w,h in [(1440,900),(390,844)]:
    await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('#ti-cuesta');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {path} {w}');await page.screenshot(path=str(OUT/f'iris-card-{name}-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'iris-card-{name}-{w}x{h}.png')
  await b.close()
 report['checks']=['r50-header','workspace-width','live-preview','session-only','music-no-autoplay','es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
