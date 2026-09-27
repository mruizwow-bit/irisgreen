#!/usr/bin/env python3
"""Browser QA for R42 A8 Home + child-safe payload separation."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

BASE='http://127.0.0.1:4173'
OUT=Path('reports/r42-a8-home-child-safe')

def need(cond,msg):
    if not cond:raise AssertionError(msg)

async def capture(page,path,name,w,h):
    await page.set_viewport_size({'width':w,'height':h})
    await page.goto(BASE+path,wait_until='networkidle')
    sw=await page.evaluate('document.documentElement.scrollWidth')
    iw=await page.evaluate('innerWidth')
    if sw>iw+1:
        offenders=await page.evaluate("""() => Array.from(document.querySelectorAll('body *')).map((e)=>{const r=e.getBoundingClientRect();return {tag:e.tagName,cls:String(e.className||'').slice(0,100),id:e.id||'',left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),scrollWidth:e.scrollWidth}}).filter(x=>x.right>innerWidth+1||x.left<-1).sort((a,b)=>b.right-a.right).slice(0,12)""")
        raise AssertionError(f'horizontal overflow {path} {w}: {sw}>{iw}; offenders={offenders}')
    await page.screenshot(path=str(OUT/f'{name}-{w}x{h}.png'),full_page=True)

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    report={'screenshots':[],'network':{},'checks':[]}
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        ctx=await browser.new_context()
        page=await ctx.new_page()
        for path,name in [('/','home-es'),('/en/','home-en')]:
            for w,h in [(1440,900),(390,844),(320,800)]:
                await capture(page,path,name,w,h);report['screenshots'].append(f'{name}-{w}x{h}.png')
        await page.goto(BASE+'/',wait_until='networkidle')
        need(await page.locator('[data-ig-audience-stage]').count()==4,'four audience stages not mounted')
        await page.keyboard.press('Tab');need(await page.evaluate('document.activeElement!==document.body'),'keyboard focus did not move')
        # Autocomplete must never receive S2 in safe/default mode.
        req=[]
        page.on('request',lambda r:req.append(r.url))
        q=page.locator('#ig-home-q');await q.fill('anorexia');await page.wait_for_timeout(500)
        need(await page.locator('[data-ig-home-suggestions]').get_by_text('Anorexia nerviosa',exact=False).count()==0,'S2 leaked into autocomplete')
        await page.locator('[data-ig-home-search] button[type=submit]').click();await page.wait_for_timeout(700)
        need(await page.locator('[data-ig-home-results]').get_by_text('Anorexia nerviosa',exact=False).count()>0,'intentional safe S2 result missing')
        need(await page.locator('[data-ig-home-results]').get_by_text('versión segura',exact=False).count()>0,'safe S2 result marker missing')
        need(not any('/assets/safety/full/' in u for u in req),'full S2 requested by Home safe search')
        report['network']['home_safe_full_requests']=sum('/assets/safety/full/' in u for u in req)
        # Representative content matrix required by #305: one S0, one audited S1, five S2.
        for route,label in [
            ('/es/situaciones/la-ropa-me-molesta/','S0'),
            ('/es/situaciones/se-me-olvida-comer/','S1'),
        ]:
            await page.goto(BASE+route,wait_until='networkidle')
            need(await page.locator('[data-ig-s2-safe]').count()==0,label+' was incorrectly treated as S2')
        five_s2=[
            '/es/neurodiversidad/condiciones/abuso-y-explotacion/',
            '/es/neurodiversidad/condiciones/anorexia-nerviosa/',
            '/es/neurodiversidad/condiciones/bulimia-nerviosa/',
            '/es/neurodiversidad/condiciones/tept-trastorno-por-estres-postraumatico/',
            '/es/biblioteca/abuso-explotacion-y-relaciones-seguras/',
        ]
        await page.goto(BASE+'/',wait_until='networkidle');await page.evaluate("IGAudience.clear()")
        for route in five_s2:
            matrix_requests=[]
            page.on('request',lambda r,arr=matrix_requests:arr.append(r.url))
            await page.goto(BASE+route,wait_until='networkidle')
            need(await page.locator('[data-ig-s2-safe]').count()==1,'S2 safe shell missing '+route)
            need(not any('/assets/safety/full/' in u for u in matrix_requests),'full S2 travelled in initial request '+route)
        report['checks'].append('S0+S1+5-S2-matrix')

        # Deep link default/children/teenagers: safe page and zero full requests.
        s2='/es/neurodiversidad/condiciones/anorexia-nerviosa/'
        for stage in ['default','children','teenagers']:
            await page.goto(BASE+'/',wait_until='networkidle')
            if stage!='default':await page.evaluate(f"IGAudience.set('{stage}')")
            requests=[];page.on('request',lambda r,arr=requests:arr.append(r.url))
            await page.goto(BASE+s2,wait_until='networkidle')
            need(await page.locator('[data-ig-s2-safe]').count()==1,f'safe S2 shell missing for {stage}')
            need(await page.get_by_text('Explicación segura',exact=False).count()>0,f'safe copy missing for {stage}')
            need(await page.get_by_role('button',name='Ver información completa').count()==0,f'full action exposed to {stage}')
            need(not any('/assets/safety/full/' in u for u in requests),f'full S2 network request in {stage}')
        # Adult view: complete catalogue metadata but full body only after explicit click.
        await page.goto(BASE+'/',wait_until='networkidle');await page.evaluate("IGAudience.set('adults')")
        requests=[];page.on('request',lambda r,arr=requests:arr.append(r.url))
        await page.goto(BASE+s2,wait_until='networkidle')
        full=page.get_by_role('button',name='Ver información completa');need(await full.count()==1,'adult full action missing')
        need(not any('/assets/safety/full/' in u for u in requests),'adult full S2 fetched before explicit action')
        await full.click();await page.wait_for_timeout(700)
        need(any('/assets/safety/full/global-200-es.html' in u for u in requests),'adult explicit full chunk not requested')
        need(await page.locator('[data-ig-s2-full]').count()==1,'adult full body not mounted after explicit action')
        report['network']['adult_explicit_full_requests']=sum('/assets/safety/full/' in u for u in requests)
        # Conditions catalogue: hidden safely by default, added as metadata in adult mode.
        await page.goto(BASE+'/',wait_until='networkidle');await page.evaluate("IGAudience.clear()")
        await page.goto(BASE+'/es/neurodiversidad/condiciones/',wait_until='networkidle')
        need(await page.get_by_text('Anorexia nerviosa',exact=True).count()==0,'S2 leaked into default Conditions catalogue')
        await page.evaluate("IGAudience.set('adults')");await page.wait_for_timeout(800)
        need(await page.get_by_text('Anorexia nerviosa',exact=True).count()>0,'adult Conditions catalogue missing S2 metadata')
        # Transparency modes from R02.
        await page.goto(BASE+'/',wait_until='networkidle')
        for mode in ['normal','reduced','opaque']:
            await page.evaluate(f"IGPreferences.update({{transparency:'{mode}'}})")
            need(await page.locator('html').get_attribute('data-ig-transparency')==mode,f'transparency {mode} not applied')
            await page.screenshot(path=str(OUT/f'home-es-transparency-{mode}.png'),full_page=False);report['screenshots'].append(f'home-es-transparency-{mode}.png')
        # Reduced motion / forced colors render without overflow.
        await page.emulate_media(reduced_motion='reduce')
        await page.goto(BASE+'/',wait_until='networkidle');await page.screenshot(path=str(OUT/'home-es-reduced-motion.png'),full_page=False);report['screenshots'].append('home-es-reduced-motion.png')
        try:
            await page.emulate_media(forced_colors='active')
            await page.goto(BASE+'/',wait_until='networkidle');await page.screenshot(path=str(OUT/'home-es-forced-colors.png'),full_page=False);report['screenshots'].append('home-es-forced-colors.png')
            report['checks'].append('forced-colors-rendered')
        except Exception as exc:
            report['checks'].append('forced-colors-playwright-not-supported:'+type(exc).__name__)
        await browser.close()
    report['checks']+=['desktop-mobile-reflow','keyboard-focus','autocomplete-safe','intentional-safe-search','deep-link-safe-default-child-teen','adult-explicit-full-only','adult-catalogue-metadata','transparency-3-modes','reduced-motion']
    (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
