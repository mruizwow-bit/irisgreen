#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r50-count-pay')
def need(v,m):
 if not v:raise AssertionError(m)
async def check(page,path,lang,access,music,change,calculator):
 req=[];page.on('request',lambda r:req.append(r.url));await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('#wallet .cp-money-button')
 need(await page.locator('html').get_attribute('lang')==lang,'language '+path);need(await page.locator('.ig-r49-global-header').count()==1,'R50 header '+path);need(await page.locator('body').get_attribute('data-ig-profile')=='workspace','workspace profile '+path)
 h=page.locator('.ig-r49-global-header');need(await h.get_by_role('button',name=access,exact=True).count()==1,'accessibility '+path);need(await h.get_by_role('button',name=music,exact=True).count()==1,'music '+path)
 for n in ['Condiciones','Conditions','Situaciones','Situations','Vida diaria','Everyday life','Investigación','Research','Recursos','Resources','Buscar','Search','Contenido','Content','Explorar','Explore']:need(await h.get_by_text(n,exact=True).count()==0,'forbidden '+n+' '+path)
 await page.get_by_role('tab',name=change,exact=True).click();need(await page.locator('#panel-cambio').is_visible(),'change panel failed '+path)
 await page.get_by_role('button',name=calculator,exact=True).click();need(await page.locator('#calc-wrap').is_visible(),'calculator failed '+path)
 m=h.get_by_role('button',name=music,exact=True);await m.click();await page.wait_for_timeout(80);need(not any('/audio/' in u for u in req),'audio autoplay '+path);await page.keyboard.press('Escape')
 need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),'overflow '+path)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[],'screenshots':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  cases=[('/es/recursos/contar-y-pagar/','es','Accesibilidad','Música','El cambio','Usar la calculadora','es'),('/en/resources/count-and-pay/','en','Accessibility','Music','Change','Use the calculator','en')]
  for path,lang,a,m,ch,calc,name in cases:
   await check(page,path,lang,a,m,ch,calc)
   for w,h in [(1440,900),(390,844)]:
    await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_selector('#wallet .cp-money-button');need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'overflow {path} {w}');await page.screenshot(path=str(OUT/f'count-pay-{name}-{w}x{h}.png'),full_page=True);report['screenshots'].append(f'count-pay-{name}-{w}x{h}.png')
  await b.close()
 report['checks']=['r50-header','workspace-width','tabs-functional','calculator-functional','music-no-autoplay','es-en','1440-390']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
