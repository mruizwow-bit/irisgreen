#!/usr/bin/env python3
"""Iris Green · browser QA for three public age choices + internal GENERAL."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

BASE='http://127.0.0.1:4173'
OUT=Path('reports/r51-home-age')

def need(v,m):
    if not v: raise AssertionError(m)

STAGES={
    'GENERAL':{'research':1,'data':1,'support':1,'interests':1,'books':1},
    'AGE_0_12':{'research':0,'data':0,'support':0,'interests':0,'books':0},
    'AGE_13_17':{'research':1,'data':1,'support':0,'interests':0,'books':0},
    'AGE_18_PLUS':{'research':1,'data':1,'support':1,'interests':1,'books':1},
}
ORDER=list(STAGES)

async def set_profile(page,band):
    if band=='GENERAL':
        await page.evaluate('IGAudience.clear()')
    else:
        ok=await page.evaluate('(b)=>IGAudience.set(b)',band)
        need(ok is True,'profile rejected '+band)
    await page.wait_for_timeout(60)
    need(await page.locator('html').get_attribute('data-ig-audience')==band,'canonical profile not emitted '+band)

async def snapshot(page,frags):
    out={}
    for key in ['research','data','support','interests','books','games','workshop']:
        n=page.locator(f'.ig-home-v4-card[href*="{frags[key]}"]')
        need(await n.count()==1,'Home classified card missing '+key)
        out[key]=await n.is_visible()
    return out

async def verify(page,path,frags):
    await page.goto(BASE+path,wait_until='networkidle')
    await page.wait_for_function('window.IGAudience !== undefined')
    need(await page.locator('[data-ig-home-version="v4"]').count()==1,'Home v4 missing '+path)

    # GENERAL is the clean/default internal state, not a visible age choice.
    # ALL_AGES remains content metadata only. Home exposes exactly 0–12 / 13–17 / 18+.
    picker=page.locator('[data-ig-audience-picker]')
    need(await picker.count()==1,'Home age picker missing '+path)
    need(await picker.locator('[data-ig-audience-stage]').count()==3,'public age button count != 3 '+path)
    need(await picker.locator('[data-ig-audience-stage="GENERAL"]').count()==0,'GENERAL exposed as a public age choice '+path)
    need(await picker.locator('[data-ig-audience-stage="ALL_AGES"]').count()==0,'ALL_AGES exposed as user profile '+path)

    # Clean-load expectations for each target profile.
    expected_snapshots={}
    for band,expected in STAGES.items():
        await set_profile(page,band)
        snap=await snapshot(page,frags)
        expected_snapshots[band]=snap
        for key,want in expected.items():
            need(snap[key]==bool(want),f'Home visibility wrong {path} {band} {key}: {snap[key]}')
        need(snap['games'],'Games vanished '+band)
        need(snap['workshop'],'Workshop vanished '+band)

    # Every A→B transition must equal a clean application of B.
    for source in ORDER:
        for target in ORDER:
            if source==target: continue
            await set_profile(page,source)
            await set_profile(page,target)
            snap=await snapshot(page,frags)
            need(snap==expected_snapshots[target],f'non-idempotent profile transition {path} {source}->{target}')

    # Reapplying X leaves the same state.
    for band in ORDER:
        await set_profile(page,band)
        before=await snapshot(page,frags)
        if band=='GENERAL':
            await page.evaluate('IGAudience.clear()')
        else:
            # set(X) when already X is allowed to be a no-op; refresh must preserve the same product state.
            await page.evaluate('(b)=>{ if(IGAudience.get()!==b) IGAudience.set(b); IGAudience.refresh(); }',band)
        await page.wait_for_timeout(40)
        after=await snapshot(page,frags)
        need(after==before,f'profile reapply changed state {path} {band}')

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        page=await browser.new_page()
        await verify(page,'/',{
            'research':'/es/investigacion/','data':'/es/datos/','support':'/es/tramites/directorio/',
            'interests':'/es/intereses/','books':'/es/libros/','games':'/es/recursos/juegos/','workshop':'/es/taller/'})
        await verify(page,'/en/',{
            'research':'/es/investigacion/','data':'/en/data/','support':'/es/tramites/directorio/',
            'interests':'/en/interests/','books':'/es/libros/','games':'/en/resources/games/','workshop':'/en/workshop/'})
        await browser.close()
    report={
        'home_v4_es':'PASS','home_v4_en':'PASS',
        'profiles':ORDER,'ALL_AGES':'CONTENT_METADATA_ONLY',
        'transition_matrix':'PASS','idempotence':'PASS','matrix':'R51 965'
    }
    (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':
    asyncio.run(main())
