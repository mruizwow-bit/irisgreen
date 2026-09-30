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
  need(await page.locator('[data-ig-r49-search],[data-ig-r49-stage],[data-ig-r49-more]').count()==0,'Home header has extra controls')
  need(await page.locator('[data-ig-music]').count()==1 and await page.locator('[data-ig-r49-settings]').count()==1 and await page.locator('.ig-r49-lang').count()==1,'Home compact header missing')
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
  need(185<=sabik_geom['width']<=255,'Sabik visual is not large enough inside compact Home block '+repr(sabik_geom))
  need(len([x for x in sabik_geom['columns'].split(' ') if x])>=2,'Sabik desktop donor must render as two columns '+repr(sabik_geom))
  need(await page.locator('#sabik-settings-toggle').count()==0,'Sabik controls must not be hidden behind settings')
  voice_ctl=page.get_by_role('button',name='Voz de Sabik: Desactivada',exact=False)
  need(await voice_ctl.count()==1 and await voice_ctl.is_visible(),'Sabik voice control must be visible')
  need(await page.locator('#sabik-reset').is_visible(),'Sabik reset control must be visible')
  need(await page.locator('#sabik-motion-level').is_visible(),'Sabik motion selector must be visible')
  need(await page.locator('#sabik-motion-level option').evaluate_all("els=>els.map(e=>e.value)")==['NORMAL','REDUCIDO','SIN_MOVIMIENTO'],'Sabik motion levels missing')
  voice_requests=[]
  page.on('request',lambda r,arr=voice_requests:arr.append(r.url))
  await page.wait_for_timeout(120)
  need(not any('/sabik/assets/audio-r01/' in u and u.endswith('.wav') for u in voice_requests),'Sabik WAV requested before explicit voice activation')
  await page.locator('#sabik-voice').click()
  await page.wait_for_timeout(650)
  need(any('/sabik/assets/audio-r01/es/sabik__welcome.wav' in u for u in voice_requests),'Sabik welcome WAV not requested after explicit voice activation')
  need(await page.locator('#sabik-voice').get_attribute('aria-pressed')=='true','Sabik voice did not remain enabled after successful playback start')
  await page.locator('#sabik-voice').click()
  await page.wait_for_timeout(80)
  need(await page.locator('#sabik-voice').get_attribute('aria-pressed')=='false','Sabik voice did not turn off')
  report['network']['sabik_welcome_requests']=sum('/sabik/assets/audio-r01/es/sabik__welcome.wav' in u for u in voice_requests)
  # Theme alternative lives inside Accessibility and persists globally.
  await page.get_by_role('button',name='Accesibilidad',exact=True).click()
  await page.get_by_role('button',name='Claro',exact=True).click();need(await page.locator('html').get_attribute('data-ig-theme')=='light','LIGHT alternative did not apply')
  await page.get_by_role('button',name='Navy oscuro',exact=True).click();need(await page.locator('html').get_attribute('data-ig-theme')=='dark','DARK NAVY did not restore')
  await page.keyboard.press('Escape')
  # Canonical age remains session-only and is not a permanent header control.
  await page.evaluate("IGAudience.set('AGE_0_12')");need(await page.locator('html').get_attribute('data-ig-audience')=='AGE_0_12','canonical AGE_0_12 not emitted')
  await page.evaluate("IGAudience.clear()");need(await page.locator('html').get_attribute('data-ig-audience')=='GENERAL','GENERAL not restored')
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
 report['checks']=['v4-structure','sabik-donor-proportion','sabik-voice-live-request','css-render-integrity','dark-navy-default','light-alternative','canonical-age-runtime','ES-EN-1440-390','autocomplete-safe','intentional-safe-search','deep-link-safe','adult-explicit-full-only']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__': asyncio.run(main())
