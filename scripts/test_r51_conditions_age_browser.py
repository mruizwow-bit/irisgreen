#!/usr/bin/env python3
"""R51 A2 · Conditions-only canonical age catalogue QA."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

BASE='http://127.0.0.1:4173'
OUT=Path('reports/r51-conditions-age')

def need(v,m):
    if not v: raise AssertionError(m)

async def set_stage(page,stage):
    if stage=='default':
        await page.evaluate('IGAudience.clear()')
    else:
        await page.evaluate('(s)=>IGAudience.set(s)',stage)
    await page.wait_for_timeout(650)

async def assert_catalogue(page,path,adult_title,all_title):
    await page.goto(BASE+path,wait_until='networkidle')
    await page.wait_for_function('window.IGAudience !== undefined && window.IGSearch !== undefined')

    stages={
        'default': None,
        'children': {'AGE_0_12','ALL_AGES'},
        'teenagers': {'AGE_13_17','ALL_AGES'},
        'adults': {'AGE_18_PLUS','ALL_AGES'},
        'any': {'ALL_AGES'},
    }

    for stage,allowed in stages.items():
        await set_stage(page,stage)
        cards=page.locator('[data-ig-catalog="conditions"] .cards a.card')
        need(await cards.count()>0,f'Conditions catalogue empty: {path} {stage}')

        adult=page.get_by_text(adult_title,exact=True)
        if stage in ('children','teenagers','any'):
            need(await adult.count()==0,f'adult-only condition still in DOM: {path} {stage} {adult_title}')
        elif stage=='adults':
            need(await adult.count()>0,f'adult-only condition missing for adults: {path} {adult_title}')

        allages=page.get_by_text(all_title,exact=True)
        need(await allages.count()>0,f'ALL_AGES condition missing: {path} {stage} {all_title}')

        if allowed is not None:
            rows=await cards.evaluate_all("""nodes => nodes.map(n => ({
              href:n.getAttribute('href'),
              bands:(n.getAttribute('data-ig-age-bands')||'').split(/\\s+/).filter(Boolean)
            }))""")
            bad=[r for r in rows if not set(r['bands']).intersection(allowed)]
            need(not bad,f'incompatible Conditions cards mounted: {path} {stage} {bad[:5]}')

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    report={'section':'conditions','checks':[]}
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        page=await browser.new_page()
        await assert_catalogue(page,'/es/neurodiversidad/condiciones/','Menopausia','Autismo')
        report['checks'].append('ES default + 0-12 + 13-17 + 18+ + all-ages')
        await assert_catalogue(page,'/en/neurodiversity/conditions/','Menopause','Autism')
        report['checks'].append('EN default + 0-12 + 13-17 + 18+ + all-ages')
        await browser.close()
    report['menopause_child_dom']=0
    report['menopause_teen_dom']=0
    report['menopause_all_ages_dom']=0
    report['adult_restore']='PASS'
    report['all_ages_preserved']='PASS'
    (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':
    asyncio.run(main())
