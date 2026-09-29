#!/usr/bin/env python3
"""Browser QA for Home v4 NAVY + child-safe payload separation."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r42-a8-home-child-safe')
def need(v,m):
 if not v: raise AssertionError(m)
async def capture(page,path,name,w,h):
 await page.set_viewport_size({'width':w,'height':h});await page.goto(BASE+path,wait_until='networkidle')
 need(await page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),f'horizontal overflow {path} {w}')
 await page.screenshot(path=str(OUT/f'{name}-{w}x{h}.png'),full_page=True)
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'screenshots':[],'network':{},'checks':[]}
 async with async_playwright() as p:
  browser=await p.chromium.launch();ctx=await browser.new_context();page=await ctx.new_page()
  await page.goto(BASE+'/',wait_until='networkidle');await page.evaluate("localStorage.removeItem('ig-theme-2026'); sessionStorage.clear()")
  for path,name in [('/','home-v4-es'),('/en/','home-v4-en')]:
   for w,h in [(1440,900),(390,844)]:
    await capture(page,path,name,w,h);report['screenshots'].append(f'{name}-{w}x{h}.png')
  await page.set_viewport_size({'width':1440,'height':900})
  await page.goto(BASE+'/',wait_until='networkidle')
  need(await page.get_by_role('heading',name='Empieza por tu parte',exact=True).count()==1,'v4 hero missing')
  need(await page.get_by_role('heading',name='Entra y úsalo',exact=True).count()==1,'v4 use section missing')
  need(await page.get_by_role('heading',name='Pregunta a Sabik',exact=True).count()==1,'v4 Sabik section missing')
  need(await page.get_by_role('heading',name='Entiende y encuentra',exact=True).count()==1,'v4 discover section missing')
  need(await page.locator('[data-ig-audience-stage]').count()==4,'four canonical age controls missing')
  for label in ['0–12 años','13–17 años','18 años o más','Todas las edades']:
   need(await page.get_by_role('button',name=label,exact=True).count()==1,'age control missing '+label)
  need(await page.locator('html').get_attribute('data-ig-theme')=='dark','Home does not start DARK NAVY')
  need(await page.locator('body').get_attribute('data-ig-home-version')=='v4','v4 body marker missing')
  need(await page.locator('[data-ig-media-status="pending"]').count()==13,'unapproved media slots were invented/removed')
  visual=await page.evaluate("""() => {
    const pick=s=>{const e=document.querySelector(s),c=e&&getComputedStyle(e);return e?{display:c.display,bg:c.backgroundColor,cols:c.gridTemplateColumns,width:e.getBoundingClientRect().width}:null};
    return {body:getComputedStyle(document.body).backgroundColor,use:pick('.ig-home-v4-use-grid'),card:pick('.ig-home-v4-card'),sabik:pick('.ig-home-v4-sabik'),discover:pick('.ig-home-v4-discover-grid'),footer:pick('.ig-home-v4-footer')};
  }""")
  need(visual['body']=='rgb(11, 26, 43)','DARK NAVY body background not rendered '+repr(visual))
  need(visual['use'] and visual['use']['display']=='grid','Entra y úsalo layout CSS not rendered '+repr(visual))
  need(visual['card'] and visual['card']['display']=='grid','Home card CSS not rendered '+repr(visual))
  need(visual['sabik'] and visual['sabik']['display']=='block' and visual['sabik']['bg']!='rgba(0, 0, 0, 0)','Sabik chassis CSS not rendered '+repr(visual))
  need(visual['discover'] and visual['discover']['display']=='grid','Entiende y encuentra layout CSS not rendered '+repr(visual))
  need(visual['footer'] and visual['footer']['display']=='flex','Home footer CSS not rendered '+repr(visual))
  await page.set_viewport_size({'width':1440,'height':900})
  await page.wait_for_timeout(50)
  sabik_geom=await page.evaluate("""() => {
    const img=document.querySelector('#sabik-web-master');
    const widget=document.querySelector('.ig-home-v4-sabik-panel .sabik-widget');
    const r=img.getBoundingClientRect(), c=getComputedStyle(widget);
    return {width:r.width,height:r.height,columns:c.gridTemplateColumns,widgetWidth:widget.getBoundingClientRect().width};
  }""")
  need(sabik_geom['width']<=151,'Sabik visual larger than approved donor cap '+repr(sabik_geom))
  need(len([x for x in sabik_geom['columns'].split(' ') if x])>=2,'Sabik desktop donor must render as two columns '+repr(sabik_geom))
  need(await page.get_by_role('button',name='Ajustes de Sabik',exact=True).count()==1,'real Sabik settings control missing')
  await page.get_by_role('button',name='Ajustes de Sabik',exact=True).click();need(await page.locator('#sabik-settings').is_visible(),'Sabik settings did not open')
  need(await page.get_by_role('button',name='Voz de Sabik: Desactivada',exact=False).count()==1,'Sabik voice control missing inside settings')
  # Theme alternative lives inside Accessibility and persists globally.
  await page.get_by_role('button',name='Accesibilidad',exact=True).click()
  await page.get_by_role('button',name='Claro',exact=True).click();need(await page.locator('html').get_attribute('data-ig-theme')=='light','LIGHT alternative did not apply')
  await page.get_by_role('button',name='Navy oscuro',exact=True).click();need(await page.locator('html').get_attribute('data-ig-theme')=='dark','DARK NAVY did not restore')
  await page.keyboard.press('Escape')
  # Canonical age state is emitted internally.
  await page.get_by_role('button',name='0–12 años',exact=True).click();need(await page.locator('html').get_attribute('data-ig-audience')=='AGE_0_12','canonical AGE_0_12 not emitted')
  await page.get_by_role('button',name='0–12 años',exact=True).click();need(await page.locator('html').get_attribute('data-ig-audience')=='GENERAL','same button must return to GENERAL')
  # Safe autocomplete never receives S2; intentional search may show its safe result.
  req=[];page.on('request',lambda r:req.append(r.url));q=page.locator('#ig-home-q');await q.fill('anorexia');await page.wait_for_timeout(500)
  need(await page.locator('[data-ig-home-suggestions]').get_by_text('Anorexia nerviosa',exact=False).count()==0,'S2 leaked into autocomplete')
  await page.locator('[data-ig-home-search] button[type=submit]').click();await page.wait_for_timeout(700)
  need(await page.locator('[data-ig-home-results]').get_by_text('Anorexia nerviosa',exact=False).count()>0,'intentional safe S2 result missing')
  need(not any('/assets/safety/full/' in u for u in req),'full S2 requested by Home search')
  # Deep link safety remains fail-closed for GENERAL and 0–12.
  s2='/es/neurodiversidad/condiciones/anorexia-nerviosa/'
  for band in ['GENERAL','AGE_0_12','AGE_13_17']:
   await page.goto(BASE+'/',wait_until='networkidle')
   if band=='GENERAL': await page.evaluate('IGAudience.clear()')
   else: await page.evaluate('(b)=>IGAudience.set(b)',band)
   requests=[];page.on('request',lambda r,arr=requests:arr.append(r.url));await page.goto(BASE+s2,wait_until='networkidle')
   need(await page.locator('[data-ig-s2-safe]').count()==1,'safe S2 shell missing '+band)
   need(await page.get_by_role('button',name='Ver información completa').count()==0,'full action exposed '+band)
   need(not any('/assets/safety/full/' in u for u in requests),'full S2 request '+band)
  # 18+ exposes full action but fetches body only after explicit click.
  await page.goto(BASE+'/',wait_until='networkidle');await page.evaluate("IGAudience.set('AGE_18_PLUS')")
  requests=[];page.on('request',lambda r,arr=requests:arr.append(r.url));await page.goto(BASE+s2,wait_until='networkidle')
  full=page.get_by_role('button',name='Ver información completa');need(await full.count()==1,'18+ full action missing');need(not any('/assets/safety/full/' in u for u in requests),'full S2 prefetched for 18+')
  await full.click();await page.wait_for_timeout(700);need(any('/assets/safety/full/global-200-es.html' in u for u in requests),'explicit full S2 chunk not requested')
  report['network']['adult_explicit_full_requests']=sum('/assets/safety/full/global-200-es.html' in u for u in requests)
  await browser.close()
 report['checks']=['v4-structure','sabik-donor-proportion','css-render-integrity','dark-navy-default','light-alternative','canonical-age-state','ES-EN-1440-390','autocomplete-safe','intentional-safe-search','deep-link-safe','adult-explicit-full-only']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__': asyncio.run(main())
