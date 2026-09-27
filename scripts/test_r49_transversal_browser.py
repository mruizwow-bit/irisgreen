#!/usr/bin/env python3
"""Browser, wide-layout, accessibility and performance QA for R49."""
from __future__ import annotations
import argparse, asyncio, json
from pathlib import Path
from playwright.async_api import async_playwright

BASE='http://127.0.0.1:4173'
OUT=Path('reports/r49-transversal')

SAMPLES={
'content':[
 ('condition','/es/neurodiversidad/condiciones/autismo/'),
 ('situation','/es/situaciones/la-ropa-me-molesta/'),
 ('everyday','/es/biblioteca/cocinar-y-seguridad-domestica/'),
 ('data','/es/datos/autismo/'),
 ('research','/es/investigacion/'),
 ('editorial','/es/sobre-iris-green/'),
 ('privacy','/es/privacidad/'),
],
'browse':[
 ('conditions-hub','/es/neurodiversidad/condiciones/'),
 ('situations-hub','/es/situaciones/'),
 ('everyday-hub','/es/biblioteca/'),
 ('data-hub','/es/datos/'),
 ('videos','/es/videos/'),
 ('resources','/es/recursos/'),
 ('games','/es/recursos/juegos/'),
 ('support-directory','/es/tramites/directorio/'),
],
'workspace':[
 ('workshop','/es/taller/dibujo/'),
 ('interests','/es/intereses/cielo/'),
 ('quiet','/es/sitio-tranquilo/'),
 ('iris-card','/es/recursos/tarjeta-iris/'),
 ('workshop-hub','/es/taller/'),
]}
BASE_SIZES=[(1440,900),(1920,1080),(390,844),(320,800)]
WIDE=[(1366,768),(1600,900),(2560,1440)]
WIDE_ROUTES=[('content','/es/neurodiversidad/condiciones/autismo/'),('browse','/es/neurodiversidad/condiciones/'),('workspace','/es/taller/dibujo/')]

def need(c,msg):
    if not c: raise AssertionError(msg)

async def go(page,path,w,h):
    await page.set_viewport_size({'width':w,'height':h})
    await page.goto(BASE+path,wait_until='domcontentloaded')
    await page.wait_for_timeout(350)
    need(await page.locator('.ig-r49-header-inner').count()==1,'common header missing '+path)
    need(await page.locator('.ig-r49-footer-inner').count()==1,'common footer missing '+path)
    legacy=await page.evaluate("""() => {
      const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
      const h=document.querySelector('.ig-r49-global-header'),f=document.querySelector('.ig-r49-global-footer');
      return {header:h?Array.from(h.children).filter(e=>!e.classList.contains('ig-r49-header-inner')&&visible(e)).length:99,footer:f?Array.from(f.children).filter(e=>!e.classList.contains('ig-r49-footer-inner')&&visible(e)).length:99};
    }""")
    need(legacy['header']==0 and legacy['footer']==0,'legacy common chrome still visible '+path)
    sw=await page.evaluate('document.documentElement.scrollWidth')
    iw=await page.evaluate('innerWidth')
    need(sw<=iw+1,f'horizontal scroll {path} {w}: {sw}>{iw}')
    return await page.evaluate("""() => {
      const main=document.querySelector('main');
      const article=main&&main.querySelector(':scope > article.ficha');
      const card=main&&main.querySelector(':scope > .iris-mini-card');
      const finder=main&&main.querySelector(':scope > #ig-page-finder');
      const shell=document.querySelector('.ig-r42-shell,#igt-app,#jg-app,#r40Workspace,.r40-workspace,.ig-afondo');
      const rect=n=>n?n.getBoundingClientRect():null;
      return {viewport:innerWidth,main:rect(main),article:rect(article),card:rect(card),finder:rect(finder),shell:rect(shell),profile:document.body.dataset.igProfile};
    }""")

async def shot(page,path,name,w,h):
    metrics=await go(page,path,w,h)
    await page.screenshot(path=str(OUT/f'{name}-{w}x{h}.png'),full_page=False)
    return metrics

async def perf(browser,path,name):
    page=await browser.new_page(viewport={'width':1440,'height':900})
    await page.add_init_script("""() => {
      window.__r49perf={lcp:0,cls:0,events:[]};
      try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__r49perf.lcp=Math.max(window.__r49perf.lcp,e.startTime||0)}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){}
      try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__r49perf.cls+=e.value||0}).observe({type:'layout-shift',buffered:true})}catch(e){}
      try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(e.interactionId)window.__r49perf.events.push(e.duration||0)}).observe({type:'event',durationThreshold:16,buffered:true})}catch(e){}
    }""")
    await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_timeout(700)
    trigger=page.locator('[data-ig-r49-search]').first
    if await trigger.count():
        await trigger.click();await page.wait_for_timeout(120)
        await page.keyboard.press('Escape');await page.wait_for_timeout(120)
    nav=await page.evaluate("""() => {
      const n=performance.getEntriesByType('navigation')[0];
      return n?{domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd,transferSize:n.transferSize}:null;
    }""")
    p=await page.evaluate('window.__r49perf')
    p['inp_observed_ms']=max(p.get('events') or [0]);p.pop('events',None);p['navigation']=nav;p['route']=path;p['sample']=name
    await page.close();return p

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    report={'screenshots':[],'profiles':{},'wide':[],'accessibility':[],'performance':[],'notes':['Cuaderno is not present in the current A2 baseline; R48 owns that future workspace. R49 classification is prefix-ready and does not create a phantom route.']}
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        page=await browser.new_page()
        for profile,rows in SAMPLES.items():
            report['profiles'][profile]=[]
            for name,path in rows:
                for w,h in BASE_SIZES:
                    m=await shot(page,path,name,w,h);report['screenshots'].append(f'{name}-{w}x{h}.png')
                    need(m['profile']==profile,f'profile mismatch {path}: {m["profile"]} != {profile}')
                    if w>=1440 and profile=='browse':
                        need(m['main'] and m['main']['width']/w>=.82,f'browse product width too narrow {path} {w}')
                    if w>=1440 and profile=='workspace':
                        need(m['main'] and m['main']['width']/w>=.90,f'workspace product width too narrow {path} {w}')
                    if profile=='content' and m['article']:
                        if w>=1440:
                            need(m['article']['width']<=1050,f'reading measure too wide {path}')
                            need(m['article']['top']<520,f'CONTENT reading pushed below first viewport {path}: top={m["article"]["top"]}')
                            if m['card']:
                                need(m['card']['left']>=m['article']['right']-2,f'Tarjeta Iris is not a side tool on desktop {path}')
                        if w<=390 and m['card']:
                            need(m['article']['top']<m['card']['top'],f'Tarjeta Iris precedes reading on mobile {path}')
                report['profiles'][profile].append(path)
        for profile,path in WIDE_ROUTES:
            for w,h in WIDE:
                m=await shot(page,path,f'wide-{profile}',w,h);report['screenshots'].append(f'wide-{profile}-{w}x{h}.png')
                ratio=(m['main']['width']/w) if m['main'] else 0
                if profile=='browse':need(ratio>=.86,f'wide browse gutters too large {w}: {ratio:.3f}')
                if profile=='workspace':need(ratio>=.92,f'wide workspace gutters too large {w}: {ratio:.3f}')
                report['wide'].append({'profile':profile,'route':path,'width':w,'main_ratio':round(ratio,3),'article_width':round(m['article']['width'],1) if m['article'] else None,'shell_width':round(m['shell']['width'],1) if m['shell'] else None})
        # Global chrome: keyboard, focus restore, stage persistence, EN labels.
        await page.set_viewport_size({'width':1440,'height':900});await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_timeout(300)
        search=page.locator('[data-ig-r49-search]').first;await search.focus();await search.click();need(await page.locator('#ig-r49-search[open]').count()==1,'search dialog did not open');await page.keyboard.press('Escape');need(await search.evaluate('e=>document.activeElement===e'),'search focus not restored')
        stage=page.locator('[data-ig-r49-stage]').first;await stage.click();await page.locator('#ig-r49-audience [data-ig-audience-stage="children"]').click();await page.keyboard.press('Escape')
        await page.goto(BASE+'/es/datos/',wait_until='domcontentloaded');await page.wait_for_timeout(250);need(await page.locator('.ig-r49-stage-state').first.inner_text()=='Infancia','audience session state did not persist across areas')
        await page.goto(BASE+'/en/data/',wait_until='domcontentloaded');await page.wait_for_timeout(250);need(await page.locator('[data-ig-r49-search]').first.get_attribute('aria-label')=='Search','EN common chrome label wrong');need(await page.locator('.ig-r49-stage-state').first.inner_text()=='Children','EN audience label wrong')
        for route in ['/es/videos/?lang=en','/es/libros/?lang=en','/es/tramites/directorio/?lang=en','/es/investigacion/?lang=en']:
            await page.goto(BASE+route,wait_until='domcontentloaded');await page.wait_for_timeout(300)
            need(await page.locator('html').get_attribute('lang')=='en','single-route bilingual app did not bootstrap EN '+route)
            need(await page.locator('[data-ig-r49-search]').first.get_attribute('aria-label')=='Search','common chrome did not follow EN '+route)
            need(await page.evaluate("localStorage.getItem('ig_lang')")=='en','bilingual app language state not set before mount '+route)
        report['accessibility']+=['native-dialog-escape','focus-restore','session-audience-cross-area','EN-common-chrome','single-route-EN-bootstrap']

        # Landmarks, dialog names, current page, target size and text-spacing/reflow.
        await page.set_viewport_size({'width':390,'height':844})
        await page.goto(BASE+'/es/neurodiversidad/condiciones/',wait_until='domcontentloaded');await page.wait_for_timeout(250)
        need(await page.locator('main').count()==1,'main landmark missing')
        need(await page.locator('.ig-r49-global-header').count()==1,'header landmark missing')
        need(await page.locator('.ig-r49-global-footer').count()==1,'footer landmark missing')
        need(await page.locator('h1').count()>=1,'h1 missing')
        need(await page.locator('.ig-r49-header-inner a[aria-current="page"]').count()==1,'visible current-page state missing')
        need(await page.locator('a.skip,a.ig-r49-skip,a.ig-home-skip').count()>=1,'skip link missing')
        await page.locator('[data-ig-r49-settings]').first.click()
        need(await page.get_by_role('dialog',name='Lectura y accesibilidad').count()==1,'settings dialog has no accessible name')
        await page.keyboard.press('Escape')
        boxes=await page.locator('.ig-r49-tools > :is(button,a)').evaluate_all("els=>els.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height,visible:!!(e.offsetWidth||e.offsetHeight)}))")
        need(all((not b['visible']) or (b['w']>=43.5 and b['h']>=43.5) for b in boxes),'common chrome target below 44px')
        report['accessibility']+=['landmarks','heading-structure-sample','current-page','skip-link','dialog-accessible-name','target-size-44','legacy-common-chrome-hidden']

        # The transversal header search itself must remain safe before results are built.
        await page.goto(BASE+'/es/datos/',wait_until='domcontentloaded');await page.wait_for_timeout(250)
        common_requests=[]
        page.on('request',lambda r,arr=common_requests:arr.append(r.url))
        await page.locator('[data-ig-r49-search]').first.click()
        cq=page.locator('#ig-r49-q');await cq.fill('anorexia');await page.wait_for_timeout(450)
        need(await page.locator('#ig-r49-search .ig-r49-search-results').get_by_text('Anorexia nerviosa',exact=False).count()==0,'common autocomplete leaked S2')
        await page.locator('#ig-r49-search .ig-r49-search-form button[type=submit]').click();await page.wait_for_timeout(550)
        need(await page.locator('#ig-r49-search .ig-r49-search-results').get_by_text('Anorexia nerviosa',exact=False).count()>0,'common intentional S2 result missing')
        need(await page.locator('#ig-r49-search .ig-r49-search-results').get_by_text('Versión segura',exact=False).count()>0,'common S2 safe marker missing')
        need(not any('/assets/safety/full/' in u for u in common_requests),'common search requested full S2')
        await page.keyboard.press('Escape')
        report['accessibility']+=['transversal-autocomplete-safe','transversal-intentional-search-safe','transversal-search-zero-full-S2']

        for profile,path in WIDE_ROUTES:
            await page.set_viewport_size({'width':320,'height':800})
            await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_timeout(250)
            await page.evaluate("IGPreferences.update({text:{letter:.12,word:.16,line:1.5,paragraph:2}})")
            await page.wait_for_timeout(120)
            sw=await page.evaluate('document.documentElement.scrollWidth');iw=await page.evaluate('innerWidth')
            need(sw<=iw+1,'text spacing caused horizontal scroll '+profile)
            await page.evaluate("IGPreferences.reset()")
        report['accessibility']+=['text-spacing','reflow-320-equivalent-400percent-at-1280']

        # R02 transparency and system modes on three profiles.
        for profile,path in WIDE_ROUTES:
            await page.goto(BASE+path,wait_until='domcontentloaded');await page.wait_for_timeout(250)
            for mode in ('normal','reduced','opaque'):
                await page.evaluate(f"IGPreferences.update({{transparency:'{mode}'}})")
                need(await page.locator('html').get_attribute('data-ig-transparency')==mode,'transparency mode failed '+profile+' '+mode)
            await page.emulate_media(reduced_motion='reduce');await page.reload(wait_until='domcontentloaded');await page.screenshot(path=str(OUT/f'{profile}-reduced-motion.png'));report['screenshots'].append(f'{profile}-reduced-motion.png')
            try:
                await page.emulate_media(forced_colors='active',reduced_motion='no-preference');await page.reload(wait_until='domcontentloaded');await page.screenshot(path=str(OUT/f'{profile}-forced-colors.png'));report['screenshots'].append(f'{profile}-forced-colors.png')
            finally:
                await page.emulate_media(forced_colors='none',reduced_motion='no-preference')
        report['accessibility']+=['transparency-normal-reduced-opaque','reduced-motion','forced-colors']
        for profile,path in WIDE_ROUTES:
            report['performance'].append(await perf(browser,path,profile))
        await browser.close()
    (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'screenshots':len(report['screenshots']),'profiles':{k:len(v) for k,v in report['profiles'].items()},'wide_checks':len(report['wide']),'accessibility':report['accessibility'],'performance':report['performance']},ensure_ascii=False))

if __name__=='__main__':asyncio.run(main())
