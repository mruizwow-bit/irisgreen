#!/usr/bin/env python3
"""R67 Aura · browser QA for global shell, Home child-safe AGE, and Sabik text conversation."""
from __future__ import annotations
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright

BASE=os.environ.get('IG_BASE_URL','http://127.0.0.1:4173').rstrip('/')
OUT=Path('reports/r67-aura-recovery')
def need(v,m):
 if not v: raise AssertionError(m)

async def main():
 OUT.mkdir(parents=True,exist_ok=True)
 report={'shell':{},'home':{},'sabik':{}}
 async with async_playwright() as p:
  browser=await p.chromium.launch()
  ctx=await browser.new_context()
  page=await ctx.new_page()

  samples=['/es/situaciones/','/es/neurodiversidad/condiciones/','/es/datos/','/es/recursos/','/es/taller/','/es/intereses/','/es/sitio-tranquilo/']
  for path in samples:
   await page.goto(BASE+path,wait_until='networkidle')
   await page.wait_for_function("document.querySelector('.ig-r49-global-header')?.dataset.igR49Upgraded==='true'")
   need(await page.locator('.ig-r49-global-header').is_visible(),'global shell not visible '+path)
   need(await page.get_by_role('button',name='Contenido',exact=False).count()==1,'Content control missing '+path)
   await page.get_by_role('button',name='Contenido',exact=False).click()
   b=page.get_by_role('button',name='0–12 años',exact=True)
   need(await b.count()==1,'canonical 0–12 label missing '+path)
   await b.click()
   need(await page.locator('html').get_attribute('data-ig-audience')=='AGE_0_12','AGE_0_12 not emitted '+path)
   await page.keyboard.press('Escape')
   await page.evaluate("IGAudience.clear()")
  report['shell']={'routes':len(samples),'canonical_age':'PASS','visible':'PASS'}
  # Visual evidence from the served artifact / Deploy Preview.
  await page.set_viewport_size({'width':1440,'height':900})
  await page.goto(BASE+'/es/neurodiversidad/condiciones/',wait_until='networkidle')
  await page.screenshot(path=str(OUT/'conditions-1440.png'),full_page=False)
  await page.goto(BASE+'/es/taller/',wait_until='networkidle')
  await page.screenshot(path=str(OUT/'workshop-1440.png'),full_page=False)
  await page.set_viewport_size({'width':390,'height':844})
  await page.goto(BASE+'/es/situaciones/',wait_until='networkidle')
  await page.screenshot(path=str(OUT/'situations-390.png'),full_page=False)
  await page.goto(BASE+'/es/taller/',wait_until='networkidle')
  await page.screenshot(path=str(OUT/'workshop-390.png'),full_page=False)

  await page.set_viewport_size({'width':1440,'height':900})
  await page.goto(BASE+'/',wait_until='networkidle')
  await page.wait_for_function("window.IGAudience && window.IGSearch")
  await page.evaluate("IGAudience.set('AGE_0_12')")
  q=page.locator('#ig-home-q')
  await q.fill('anorexia')
  await page.wait_for_timeout(350)
  need(await page.locator('[data-ig-home-suggestions]').get_by_text('Anorexia nerviosa',exact=False).count()==0,'S2 leaked in child autocomplete')
  await page.locator('[data-ig-home-search] button[type=submit]').click()
  await page.wait_for_timeout(450)
  need(await page.locator('[data-ig-home-results]').get_by_text('Anorexia nerviosa',exact=False).count()==0,'age-inappropriate S2 result leaked for AGE_0_12')
  await page.evaluate("IGAudience.set('AGE_13_17')")
  await q.fill('anorexia')
  await page.locator('[data-ig-home-search] button[type=submit]').click()
  await page.wait_for_timeout(450)
  need(await page.locator('[data-ig-home-results]').get_by_text('Anorexia nerviosa',exact=False).count()>0,'safe intentional S2 result missing for AGE_13_17')
  report['home']={'age_safe_search':'PASS','s2_payload':'SAFE_VARIANT_ONLY'}

  async def block_cloud(route):
   await route.abort()
  await page.route('**/*sabik-asistente.netlify.app/**',block_cloud)
  await page.evaluate("IGAudience.clear()")
  input_=page.locator('#sabik-input')
  await input_.fill('ruido')
  await page.locator('#sabik-submit').click()
  await page.wait_for_selector('.sabik-conversation-answer',timeout=7000)
  answer=(await page.locator('.sabik-conversation-answer').inner_text()).strip()
  need(bool(answer),'Sabik local fallback produced no answer')
  need(await page.locator('#sabik-results .sabik-retrieval-link').count()>0,'Sabik answer has no sources')
  need(await page.locator('#sabik-results').get_attribute('data-retrieval-state')=='results','Sabik result state missing')
  report['sabik']={'text_conversation':'PASS','cloud_unavailable_local_fallback':'PASS','sources':'PASS'}
  await page.screenshot(path=str(OUT/'home-sabik-answer-1440.png'),full_page=False)

  await browser.close()
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':
 asyncio.run(main())
