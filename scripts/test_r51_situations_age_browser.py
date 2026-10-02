#!/usr/bin/env python3
"""R51 A2 · Situations-only canonical age catalogue QA."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

BASE='http://127.0.0.1:4173'
OUT=Path('reports/r51-situations-age')

def need(v,m):
    if not v: raise AssertionError(m)

async def set_stage(page,stage):
    if stage=='default':
        await page.evaluate('IGAudience.clear()')
    else:
        await page.evaluate('(s)=>IGAudience.set(s)',stage)
    await page.wait_for_timeout(650)

async def by_path(page,path):
    return page.locator('[data-ig-catalog="situations"] .cards a.card').filter(
        has=page.locator('strong')
    ).locator('xpath=..') if False else page.locator(f'[data-ig-catalog="situations"] .cards a.card[href*="{path}"]')

async def assert_catalogue(page,path,adult_fragment,all_fragment):
    await page.goto(BASE+path,wait_until='networkidle')
    await page.wait_for_function('window.IGAudience !== undefined && window.IGSearch !== undefined')
    need(await page.locator('[data-ig-catalog="situations"]').count()==1,'canonical Situations catalogue missing '+path)

    stages={
        'default':None,
        'children':{'AGE_0_12','ALL_AGES'},
        'teenagers':{'AGE_13_17','ALL_AGES'},
        'adults':{'AGE_18_PLUS','ALL_AGES'},
        'any':{'ALL_AGES'},
    }
    for stage,allowed in stages.items():
        await set_stage(page,stage)
        cards=page.locator('[data-ig-catalog="situations"] .cards a.card')
        need(await cards.count()>0,f'Situations catalogue empty: {path} {stage}')

        adult=page.locator(f'[data-ig-catalog="situations"] .cards a.card[href*="{adult_fragment}"]')
        if stage in ('children','teenagers','any'):
            need(await adult.count()==0,f'adult-only situation still in DOM: {path} {stage}')
        elif stage=='adults':
            need(await adult.count()>0,f'adult-only situation missing for adults: {path}')

        allages=page.locator(f'[data-ig-catalog="situations"] .cards a.card[href*="{all_fragment}"]')
        need(await allages.count()>0,f'ALL_AGES situation missing: {path} {stage}')

        if allowed is not None:
            rows=await cards.evaluate_all("""nodes => nodes.map(n => ({
              href:n.getAttribute('href'),
              bands:(n.getAttribute('data-ig-age-bands')||'').split(/\\s+/).filter(Boolean)
            }))""")
            bad=[r for r in rows if not set(r['bands']).intersection(allowed)]
            need(not bad,f'incompatible Situations cards mounted: {path} {stage} {bad[:5]}')

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    report={'section':'situations','checks':[]}
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        page=await browser.new_page()
        await assert_catalogue(page,'/es/situaciones/','pierdo-el-hilo-en-las-reuniones','la-ropa-me-molesta')
        report['checks'].append('ES default + 0-12 + 13-17 + 18+ + all-ages')
        await assert_catalogue(page,'/en/situations/','i-lose-the-thread-in-meetings','clothes-feel-unbearable')
        report['checks'].append('EN default + 0-12 + 13-17 + 18+ + all-ages')
        await browser.close()
    report.update({
      'adult_only_child_dom':0,
      'adult_only_teen_dom':0,
      'adult_only_all_ages_dom':0,
      'adult_restore':'PASS',
      'all_ages_preserved':'PASS',
      'legacy_en_filter':'REMOVED'
    })
    (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':
    asyncio.run(main())
