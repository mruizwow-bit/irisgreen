#!/usr/bin/env python3
"""Measure initial layout stability, then test the existing controls against the source data.
External services/fonts are blocked; this is not a production Core Web Vitals claim.
"""
import argparse
import asyncio
import functools
import json
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path.cwd(); OUT=ROOT/'reports'; OUT.mkdir(exist_ok=True)
PAGES=[('/es/tramites/directorio/','directory'),('/es/taller/','workshop'),('/es/intereses/','interests'),('/es/investigacion/','research')]
parser=argparse.ArgumentParser();parser.add_argument('--phase',choices=['before','after'],required=True);args=parser.parse_args()
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE=f'http://127.0.0.1:{server.server_port}'
REPORT={'phase':args.phase,'cases':[],'failures':[],'notes':['External services and web fonts blocked for a reproducible local comparison.','Slow mode adds 900 ms to JSON and 600 ms to image requests.','The threshold checks unexpected first-screen shifts, not changes requested by a click or search.']}
OBSERVER="""window.igLayout=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.igLayout.push({time:e.startTime,value:e.value,nodes:e.sources.map(s=>({tag:s.node?.tagName,id:s.node?.id,html:s.node?.outerHTML?.slice(0,220)}))});}).observe({type:'layout-shift',buffered:true});"""

def cls(entries):
    largest=current=0.0;start=last=-10000.0
    for e in entries:
        if e['time']-last>1000 or e['time']-start>5000:
            current=0.0;start=e['time']
        current+=e['value'];last=e['time'];largest=max(largest,current)
    return largest


async def controls(page,kind):
    cards=page.locator('main article')
    initial=await cards.count()
    if kind=='interests':
        data=json.loads((ROOT/'es/intereses/cromos.json').read_text())
        expected=sum(not c.get('pendiente') for t in data['temas'] for c in t.get('cromos',[]))
        assert initial==expected,(initial,expected)
        source=next(t for t in data['temas'] if t['id']=='minerales')
        await page.locator('#temaFilters [data-tema="minerales"]').click()
        assert await cards.count()==sum(not c.get('pendiente') for c in source['cromos'])
        await page.locator('#q').fill('zzzinexistentexxx');assert await cards.count()==0
        await page.locator('#q').fill('')
        await page.locator('#temaFilters button').first.click();assert await cards.count()==expected
        assert await page.locator('#album .bajar-todo').count()==sum(any(not c.get('pendiente') for c in t.get('cromos',[])) for t in data['temas'])
    elif kind=='research':
        data=json.loads((ROOT/'es/investigacion/estudios-textos.json').read_text());assert initial==len(data)
        await page.locator('main input[type=search]').fill('zzzinexistentexxx');assert await cards.count()==0
        await page.locator('main input[type=search]').fill('Desenmascararse');assert 0<await cards.count()<initial
        await page.locator('main input[type=search]').fill('');assert await cards.count()==initial
    elif kind=='workshop':
        data=json.loads((ROOT/'es/taller/taller-retos.json').read_text());assert initial==len(data)
        await page.get_by_role('button',name='Diez minutos',exact=True).click()
        assert await cards.count()==sum(x['dur']==0 for x in data)
        await page.get_by_role('button',name='Dibujar',exact=True).click()
        assert await cards.count()==sum(x['dur']==0 and x['mesa']==0 for x in data)
        await page.get_by_role('button',name='Todo',exact=True).first.click()
        await page.get_by_role('button',name='Todo',exact=True).nth(1).click();assert await cards.count()==initial
    else:
        data=json.loads((ROOT/'es/tramites/directorio/tramites-datos.json').read_text());assert initial==12
        await page.get_by_role('button',name='Ver los detalles',exact=True).first.click()
        assert await page.get_by_role('button',name='Cerrar',exact=True).count()>=1
        await page.get_by_role('button',name='Cerrar',exact=True).first.click()
        await page.get_by_role('button',name=re.compile(r'^Ver más fichas')).click();assert await cards.count()==24
        await page.get_by_role('button',name='Reino Unido',exact=True).click();assert await cards.count()==12
        await page.locator('main input[type=search]').fill('zzzinexistentexxx');assert await cards.count()==0
        await page.locator('main input[type=search]').fill('')
        await page.get_by_role('button',name='España',exact=True).click();assert await cards.count()==12
        assert str(len(data['es']))+' fichas' in await page.locator('main').inner_text()
    # Opening music must remain out of flow on the same corrected pages.
    await page.evaluate('scrollTo(0,0)')
    before=await page.locator('main').bounding_box();height=await page.evaluate('document.documentElement.scrollHeight')
    await page.locator('#plBtn:visible,.ig-uh-music:visible,[data-ig-music]:visible').first.click()
    panel=page.locator('#ig-music-panel');await panel.wait_for(state='visible')
    after=await page.locator('main').bounding_box()
    assert abs(before['y']-after['y'])<1
    assert height==await page.evaluate('document.documentElement.scrollHeight')
    assert await panel.evaluate('(e)=>getComputedStyle(e).position')=='fixed'
    await page.keyboard.press('Escape');assert not await panel.is_visible()
    return {'initial_cards':initial,'filters':True,'music_no_shift':True}


async def run():
    async with async_playwright() as pw:
        browser=await pw.chromium.launch()
        modes=['slow'] if args.phase=='before' else ['normal','slow']
        widths=[1440,320] if args.phase=='before' else [1440,390,320]
        for mode in modes:
            for width in widths:
                for path,kind in PAGES:
                    row={'path':path,'width':width,'network':mode};errors=[];bad=[]
                    context=await browser.new_context(viewport={'width':width,'height':900})
                    page=await context.new_page();page.set_default_timeout(12000)
                    page.on('pageerror',lambda e:errors.append(str(e)))
                    page.on('response',lambda r:bad.append({'url':r.url,'status':r.status}) if r.url.startswith(BASE) and r.status>=400 else None)
                    async def route(request):
                        url=request.request.url
                        if not url.startswith(BASE):await request.abort();return
                        if mode=='slow':
                            if '.json' in url:await asyncio.sleep(.9)
                            elif re.search(r'\.(webp|png|jpg|svg)(\?|$)',url):await asyncio.sleep(.6)
                        await request.continue_()
                    await page.route('**/*',route);await page.add_init_script(OBSERVER)
                    try:
                        await page.goto(BASE+path,wait_until='domcontentloaded')
                        await page.locator('main h1').first.wait_for()
                        await page.wait_for_timeout(1650)
                        row['layout_entries']=await page.evaluate('window.igLayout');row['cls']=cls(row['layout_entries'])
                        row['overflow_px']=await page.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')
                        row['initial_cards']=await page.locator('main article').count()
                        row['first_contentful_paint_ms']=await page.evaluate('performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null')
                        if args.phase=='after':
                            assert row['cls']<=.01,'Unexpected initial shift: '+str(row['cls'])
                            assert row['overflow_px']<=2,'Horizontal overflow'
                            assert not errors,errors
                            assert not bad,bad[:3]
                            if mode=='normal':
                                await page.screenshot(path=str(OUT/f'stable-{kind}-{width}.png'),full_page=False)
                            row['interaction_tests']=await controls(page,kind)
                        row['passed']=True
                    except Exception as error:
                        row['passed']=False;row['error']=str(error);REPORT['failures'].append(row.copy())
                    finally:
                        row['javascript_errors']=errors;row['local_http_errors']=bad
                        REPORT['cases'].append(row);await context.close()
                    print(json.dumps({k:v for k,v in row.items() if k!='layout_entries'},ensure_ascii=False),flush=True)
        await browser.close()
    REPORT['passed']=not REPORT['failures']
    (OUT/f'initial-layout-{args.phase}.json').write_text(json.dumps(REPORT,ensure_ascii=False,indent=2)+'\n')
    if args.phase=='after' and not REPORT['passed']:raise SystemExit(1)

try:asyncio.run(run())
finally:server.shutdown()
