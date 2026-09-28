#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright

BASE='http://127.0.0.1:4173'
OUT=Path('reports/r51-home-age')

ES={
'default':{'Condiciones':1,'Situaciones':1,'Vida diaria':1,'Investigación':1,'Datos':1,'Ayudas y trámites':1,'Recursos y juegos':1,'Tus intereses':1,'El taller':1,'Rincón tranquilo':1},
'children':{'Condiciones':1,'Situaciones':1,'Vida diaria':1,'Investigación':0,'Datos':0,'Ayudas y trámites':0,'Recursos y juegos':1,'Tus intereses':1,'El taller':1,'Rincón tranquilo':1},
'teenagers':{'Condiciones':1,'Situaciones':1,'Vida diaria':1,'Investigación':1,'Datos':1,'Ayudas y trámites':0,'Recursos y juegos':1,'Tus intereses':1,'El taller':1,'Rincón tranquilo':1},
'adults':{'Condiciones':1,'Situaciones':1,'Vida diaria':1,'Investigación':1,'Datos':1,'Ayudas y trámites':1,'Recursos y juegos':1,'Tus intereses':1,'El taller':1,'Rincón tranquilo':1},
'any':{'Condiciones':1,'Situaciones':1,'Vida diaria':1,'Investigación':0,'Datos':0,'Ayudas y trámites':0,'Recursos y juegos':1,'Tus intereses':1,'El taller':1,'Rincón tranquilo':1}}
EN={
'default':{'Conditions':1,'Situations':1,'Everyday life':1,'Research':1,'Data':1,'Support and procedures':1,'Resources and games':1,'Your interests':1,'The workshop':1,'Quiet space':1},
'children':{'Conditions':1,'Situations':1,'Everyday life':1,'Research':0,'Data':0,'Support and procedures':0,'Resources and games':1,'Your interests':1,'The workshop':1,'Quiet space':1},
'teenagers':{'Conditions':1,'Situations':1,'Everyday life':1,'Research':1,'Data':1,'Support and procedures':0,'Resources and games':1,'Your interests':1,'The workshop':1,'Quiet space':1},
'adults':{'Conditions':1,'Situations':1,'Everyday life':1,'Research':1,'Data':1,'Support and procedures':1,'Resources and games':1,'Your interests':1,'The workshop':1,'Quiet space':1},
'any':{'Conditions':1,'Situations':1,'Everyday life':1,'Research':0,'Data':0,'Support and procedures':0,'Resources and games':1,'Your interests':1,'The workshop':1,'Quiet space':1}}
BANDS_ES={'Condiciones':'AGE_0_12 AGE_13_17 AGE_18_PLUS ALL_AGES','Situaciones':'AGE_0_12 AGE_13_17 AGE_18_PLUS ALL_AGES','Vida diaria':'AGE_0_12 AGE_13_17 AGE_18_PLUS ALL_AGES','Investigación':'AGE_13_17 AGE_18_PLUS','Datos':'AGE_13_17 AGE_18_PLUS','Ayudas y trámites':'AGE_18_PLUS'}
BANDS_EN={'Conditions':'AGE_0_12 AGE_13_17 AGE_18_PLUS ALL_AGES','Situations':'AGE_0_12 AGE_13_17 AGE_18_PLUS ALL_AGES','Everyday life':'AGE_0_12 AGE_13_17 AGE_18_PLUS ALL_AGES','Research':'AGE_13_17 AGE_18_PLUS','Data':'AGE_13_17 AGE_18_PLUS','Support and procedures':'AGE_18_PLUS'}

def need(v,m):
    if not v: raise AssertionError(m)

async def card(page,label):
    return page.locator('.ig-home-area').filter(has=page.get_by_text(label,exact=True))

async def verify(page,path,stages,bands):
    await page.goto(BASE+path,wait_until='networkidle')
    await page.wait_for_function('window.IGAudience !== undefined')
    need(await page.locator('link[href^="/assets/ig-age-gate-r51.css"]').count()==1,'pre-render age gate CSS missing '+path)
    need(await page.locator('.ig-home-area').count()==10,'Home card count changed '+path)
    for label,expected in bands.items():
        node=await card(page,label)
        need(await node.count()==1,'missing Home card '+label)
        need(await node.get_attribute('data-ig-age-bands')==expected,'wrong age bands '+label)
    for stage,expected in stages.items():
        if stage=='default': await page.evaluate('IGAudience.clear()')
        else: await page.evaluate('(s)=>IGAudience.set(s)',stage)
        await page.wait_for_timeout(30)
        need(await page.locator('html').get_attribute('data-ig-audience')==stage,'stage not applied '+stage)
        for label,want in expected.items():
            node=await card(page,label)
            need(await node.count()==1,'missing card '+label)
            need(await node.is_visible()==bool(want),f'visibility wrong {path} {stage} {label}')

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        page=await browser.new_page()
        await verify(page,'/',ES,BANDS_ES)
        await verify(page,'/en/',EN,BANDS_EN)
        await browser.close()
    report={'home_es':'PASS','home_en':'PASS','default':'PASS','children':'PASS','teenagers':'PASS','adults':'PASS','any':'PASS','matrix':'R51 965'}
    (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__': asyncio.run(main())
