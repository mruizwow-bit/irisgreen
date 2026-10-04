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
  need(await page.get_by_role('heading',name='Buscar',exact=True).count()==1,'v4 Search hero missing')
  hero_geom=await page.evaluate("""() => {const h=document.querySelector('.ig-home-v4-hero'),t=document.querySelector('#ig-home-v4-title'),s=document.querySelector('.ig-home-v4-search'),tc=getComputedStyle(t),tr=t.getBoundingClientRect(),sr=s.getBoundingClientRect();return {display:getComputedStyle(h).display,direction:getComputedStyle(h).flexDirection,h:tr.height,line:parseFloat(tc.lineHeight),titleBottom:tr.bottom,searchTop:sr.top,titleLeft:tr.left,searchLeft:sr.left};}""")
  need(hero_geom['display']=='flex' and hero_geom['direction']=='column' and hero_geom['h']<=hero_geom['line']*1.25 and hero_geom['searchTop']>=hero_geom['titleBottom'] and abs(hero_geom['titleLeft']-hero_geom['searchLeft'])<2,'desktop Home hero placement/wrap wrong '+repr(hero_geom))
  live=page.locator('#ig-home-q');await live.fill('ruido');await page.wait_for_timeout(350)
  need(await page.locator('[data-ig-home-suggestions] .ig-home-result').count()>0,'Home search suggestions do not work')
  await live.fill('')
  need(await page.get_by_role('heading',name='Explora',exact=True).count()==1,'v4 Explore section missing')
  need(await page.get_by_role('heading',name='Pregunta a Sabik',exact=True).count()==1,'v4 Sabik section missing')
  need(await page.get_by_role('heading',name='Información y recursos',exact=True).count()==1,'v4 Information and resources section missing')
  need(await page.locator('[data-ig-r49-stage]').count()==1,'Home safety profile control missing')
  need(await page.locator('[data-ig-music]').count()==1 and await page.locator('[data-ig-r49-settings]').count()==1 and await page.locator('.ig-r49-lang').count()==1,'Home compact header missing')
  need(await page.locator('html').get_attribute('data-ig-theme')=='dark','Home does not start DARK NAVY')
  need(await page.locator('body').get_attribute('data-ig-home-version')=='v4','v4 body marker missing')
  need(await page.locator('[data-ig-media-status="pending"]').count()==13,'unapproved media slots were invented/removed')
  visual=await page.evaluate("""() => {
    const pick=s=>{const e=document.querySelector(s),c=e&&getComputedStyle(e);return e?{display:c.display,bg:c.backgroundColor,cols:c.gridTemplateColumns,width:e.getBoundingClientRect().width}:null};
    return {body:getComputedStyle(document.body).backgroundColor,use:pick('.ig-home-v4-use-grid'),card:pick('.ig-home-v4-card'),sabik:pick('.ig-home-v4-sabik'),discover:pick('.ig-home-v4-discover-grid'),footer:pick('.ig-home-v4-footer')};
  }""")
  need(visual['body']=='rgb(11, 26, 43)','DARK NAVY body background not rendered '+repr(visual))
  need(visual['use'] and visual['use']['display']=='grid','Explore layout CSS not rendered '+repr(visual))
  need(visual['card'] and visual['card']['display']=='grid','Home card CSS not rendered '+repr(visual))
  need(visual['sabik'] and visual['sabik']['display']=='block' and visual['sabik']['bg']!='rgba(0, 0, 0, 0)','Sabik chassis CSS not rendered '+repr(visual))
  need(visual['discover'] and visual['discover']['display']=='grid','Information and resources layout CSS not rendered '+repr(visual))
  need(visual['footer'] and visual['footer']['display']=='flex','Home footer CSS not rendered '+repr(visual))
  await page.set_viewport_size({'width':1440,'height':900})
  await page.wait_for_timeout(50)
  sabik_geom=await page.evaluate("""() => {
    const visual=document.querySelector('#sabik-hologram');
    const widget=document.querySelector('.ig-home-v4-sabik-panel .sabik-widget');
    const r=visual.getBoundingClientRect(), c=getComputedStyle(widget);
    return {width:r.width,height:r.height,columns:c.gridTemplateColumns,widgetWidth:widget.getBoundingClientRect().width,
      layers:['.orbits-back','.core-rings','.core-light','.particles-front'].every(s=>Boolean(visual.querySelector(s)))};
  }""")
  need(300<=sabik_geom['width']<=560,'Definitive Sabik visual is outside the Home product range '+repr(sabik_geom))
  need(sabik_geom['layers'],'Definitive Sabik layered visual missing '+repr(sabik_geom))
  need(await page.locator('#sabik-settings-toggle').count()==0,'Sabik controls must not be hidden behind settings')
  need(await page.locator('#sabik-browse').count()==0,'Explore resources must not be inside Sabik')
  need(await page.locator('#sabik-submit').is_visible(),'Sabik primary send control missing')
  for ctl in ['#sabik-expand','#sabik-voice','#sabik-voice-stop','#sabik-voice-repeat','#sabik-reset','#sabik-motion-level','#sabik-toggle']:
   need(await page.locator(ctl).count()==1,'Sabik control missing: '+ctl)
  await page.locator('#sabik-toggle').click();await page.wait_for_timeout(60)
  need(await page.locator('#sabik-widget-body').is_hidden(),'Sabik body did not collapse')
  need(await page.locator('#sabik-toggle').is_visible(),'Sabik show control disappeared while collapsed')
  need(not await page.locator('#sabik-voice').is_visible(),'Secondary controls other than Show must collapse with Sabik')
  await page.locator('#sabik-toggle').click();await page.wait_for_timeout(60)
  need(await page.locator('#sabik-widget-body').is_visible(),'Sabik body did not reopen')
  voice_ctl=page.locator('#sabik-voice')
  need(await voice_ctl.count()==1 and await voice_ctl.is_visible(),'Sabik voice control must be visible')
  need(await page.locator('#sabik-reset').is_visible(),'Sabik reset control must be visible')
  need(await page.locator('#sabik-motion-level').is_visible(),'Sabik motion selector must be visible')
  need(await page.locator('#sabik-motion-level option').evaluate_all("els=>els.map(e=>e.value)")==['NORMAL','REDUCIDO','SIN_MOVIMIENTO'],'Sabik motion levels missing')
  voice_requests=[]
  page.on('request',lambda r,arr=voice_requests:arr.append(r.url))
  await page.wait_for_timeout(120)
  need(not any('/sabik-voice/' in u for u in voice_requests),'Voice service requested before explicit user activation')
  await voice_ctl.click()
  await page.wait_for_timeout(650)
  # Local QA has no private voice host: client must fail soft to text, never substitute browser TTS.
  need(any('/sabik-voice/capabilities' in u for u in voice_requests),'Voice capability check did not start after explicit activation')
  need(await page.locator('#sabik-input').is_enabled(),'Text input became unavailable after voice backend failure')
  need(await page.evaluate("()=>!('speechSynthesis' in window) || !document.documentElement.outerHTML.includes('SpeechSynthesisUtterance')"),
       'Sabik must not inject browser/system TTS as fallback')
  report['network']['sabik_voice_capability_requests']=sum('/sabik-voice/capabilities' in u for u in voice_requests)
  # Theme alternative lives inside Accessibility and persists globally.
  await page.get_by_role('button',name='Accesibilidad',exact=True).click()
  await page.get_by_role('button',name='Claro',exact=True).click();need(await page.locator('html').get_attribute('data-ig-theme')=='light','LIGHT alternative did not apply')
  await page.get_by_role('button',name='Navy oscuro',exact=True).click();need(await page.locator('html').get_attribute('data-ig-theme')=='dark','DARK NAVY did not restore')
  await page.keyboard.press('Escape')
  # Canonical age is visible on Home and remains session-only across the rest of the site.
  need(await page.locator('[data-ig-audience-picker]').count()==1,'Home age picker missing')
  need(await page.locator('[data-ig-audience-stage]').count()==3,'Home public age buttons must be exactly 3')
  need(await page.locator('[data-ig-audience-stage="GENERAL"]').count()==0,'GENERAL must not be a public age button')
  need(await page.locator('[data-ig-audience-stage="ALL_AGES"]').count()==0,'ALL_AGES must not be a user profile')
  await page.get_by_role('button',name='0–12 años',exact=True).click()
  need(await page.locator('html').get_attribute('data-ig-audience')=='AGE_0_12','canonical AGE_0_12 not emitted')
  need(await page.locator('[data-ig-home-safe]').count()==0 and await page.locator('[data-ig-home-adult]').count()==0,
       'Internal safety labels must not be exposed in Home')
  need(await page.get_by_text('Tus intereses',exact=True).is_hidden(),'Unclassified Interests must remain fail-closed for children')
  need(await page.get_by_text('Libros de Iris Green',exact=True).is_hidden(),'Unclassified Books must remain fail-closed for children')
  await page.get_by_role('button',name='18 años o más',exact=True).click()
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
 report['checks']=['v4-structure','hero-search-live','sabik-definitive-layered-visual','sabik-conversational-controls','sabik-collapse-reopen','sabik-voice-explicit-capability-check','css-render-integrity','dark-navy-default','light-alternative','three-public-age-buttons','canonical-age-internal-safety-no-label','ES-EN-1440-390','autocomplete-safe','intentional-safe-search','deep-link-safe','adult-explicit-full-only']
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__': asyncio.run(main())
