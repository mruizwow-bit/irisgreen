#!/usr/bin/env python3
"""Compare local baseline-without-R49 vs final-R49 performance samples.

This is a regression gate, not a claim that owner-lane legacy metrics are good.
R49 must not materially worsen CLS/LCP/observed interaction duration.
"""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

FINAL='http://127.0.0.1:4173'
BASE='http://127.0.0.1:4174'
OUT=Path('reports/r49-transversal/performance-delta.json')
SAMPLES=[
 ('content','/es/neurodiversidad/condiciones/autismo/'),
 ('browse','/es/neurodiversidad/condiciones/'),
 ('workspace','/es/taller/dibujo/'),
]

def need(c,msg):
    if not c:raise AssertionError(msg)

async def sample(browser,origin,path):
    page=await browser.new_page(viewport={'width':1440,'height':900})
    await page.add_init_script("""(() => {
      window.__r49delta={lcp:0,cls:0,events:[]};
      try{new PerformanceObserver(l=>{for(const e of l.getEntries())window.__r49delta.lcp=Math.max(window.__r49delta.lcp,e.startTime||0)}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){}
      try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__r49delta.cls+=e.value||0}).observe({type:'layout-shift',buffered:true})}catch(e){}
      try{new PerformanceObserver(l=>{for(const e of l.getEntries())if(e.interactionId)window.__r49delta.events.push(e.duration||0)}).observe({type:'event',durationThreshold:16,buffered:true})}catch(e){}
    })()""")
    await page.goto(origin+path,wait_until='domcontentloaded');await page.wait_for_timeout(900)
    # Trigger a comparable native interaction. Baseline may not have R49 search.
    trigger=page.locator('[data-ig-r49-search]').first
    if await trigger.count():
        await trigger.click();await page.wait_for_timeout(120);await page.keyboard.press('Escape');await page.wait_for_timeout(120)
    else:
        link=page.locator('a,button').filter(visible=True).first if False else None
        await page.keyboard.press('Tab');await page.wait_for_timeout(80)
    data=await page.evaluate('window.__r49delta')
    need(isinstance(data,dict),'performance observer did not initialise '+origin+path)
    data['inp_observed_ms']=max(data.get('events') or [0]);data.pop('events',None)
    await page.close();return data

async def main():
    OUT.parent.mkdir(parents=True,exist_ok=True)
    report={'samples':[],'gate':'R49 regression only; owner-lane absolute debt remains separately reviewable'}
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        for name,path in SAMPLES:
            before=await sample(browser,BASE,path);after=await sample(browser,FINAL,path)
            delta={'lcp_ms':round(after['lcp']-before['lcp'],3),'cls':round(after['cls']-before['cls'],6),'inp_observed_ms':round(after['inp_observed_ms']-before['inp_observed_ms'],3)}
            # Local-server tolerance: R49 may add common chrome, but must not materially worsen stability.
            need(delta['cls']<=0.05,f'R49 materially worsened CLS {name}: {delta}')
            need(delta['lcp_ms']<=180,f'R49 materially worsened LCP {name}: {delta}')
            need(delta['inp_observed_ms']<=64,f'R49 materially worsened observed interaction {name}: {delta}')
            report['samples'].append({'name':name,'route':path,'baseline':before,'final':after,'delta':delta,'pass':True})
        await browser.close()
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
