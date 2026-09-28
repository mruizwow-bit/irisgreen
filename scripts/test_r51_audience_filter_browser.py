#!/usr/bin/env python3
"""R51 audience filtering browser QA."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r51-audience-filter')
def need(v,m):
 if not v:raise AssertionError(m)
async def home_stage(page,button,research_visible,support_visible):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined')
 await page.get_by_role('button',name=button,exact=True).click()
 research=page.locator('.ig-home-area').filter(has_text='Investigación')
 support=page.locator('.ig-home-area').filter(has_text='Ayudas y trámites')
 conditions=page.locator('.ig-home-area').filter(has_text='Condiciones')
 need(await research.is_visible()==research_visible,f'Research visibility wrong for {button}')
 need(await support.is_visible()==support_visible,f'Support visibility wrong for {button}')
 need(await conditions.is_visible(),f'Transversal Conditions hidden for {button}')
async def set_stage(page,stage):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined');await page.evaluate(f"IGAudience.set('{stage}')")
async def gate(page,path,blocked,stage):
 requests=[];page.on('request',lambda r,arr=requests:arr.append(r.url));await page.goto(BASE+path,wait_until='domcontentloaded')
 need(await page.locator('html').get_attribute('data-ig-audience')==stage,'Audience bootstrap mismatch '+path+' '+stage)
 main=page.locator('main').first
 if blocked:
  await page.wait_for_selector('[data-ig-audience-blocked-message]',state='attached',timeout=5000)
  need(await main.is_hidden(),'Blocked main is visible '+path)
 else:
  need(await main.is_visible(),'Allowed main is hidden '+path)
 need(not any('/assets/safety/full/' in u for u in requests),'full S2 requested while audience gate active '+path)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  await home_stage(page,'Infancia',False,False)
  await home_stage(page,'Adolescencia',True,False)
  await home_stage(page,'Adultez',True,True)
  await home_stage(page,'Cualquier edad',False,False)
  await set_stage(page,'children');await gate(page,'/es/investigacion/',True,'children');await gate(page,'/es/tramites/directorio/',True,'children');await gate(page,'/es/cuestionarios/',True,'children')
  await set_stage(page,'teenagers');await gate(page,'/es/investigacion/',False,'teenagers');await gate(page,'/es/tramites/directorio/',True,'teenagers');await gate(page,'/es/cuestionarios/',True,'teenagers')
  await set_stage(page,'adults');await gate(page,'/es/investigacion/',False,'adults');await gate(page,'/es/tramites/directorio/',False,'adults');await gate(page,'/es/cuestionarios/',False,'adults')
  await set_stage(page,'any');await gate(page,'/es/investigacion/',True,'any');await gate(page,'/es/tramites/directorio/',True,'any');await gate(page,'/es/cuestionarios/',True,'any')
  await b.close()
 report['checks']=['home-infant-filter','home-teen-filter','home-adult-filter','home-any-age-transversal-only','research-direct-gate','support-direct-gate','zero-full-s2-gate-requests']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
