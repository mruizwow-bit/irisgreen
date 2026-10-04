#!/usr/bin/env python3
"""R51 A2 canonical age filtering browser QA."""
from __future__ import annotations
import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
BASE='http://127.0.0.1:4173';OUT=Path('reports/r51-audience-filter')
def need(v,m):
 if not v:raise AssertionError(m)
async def home_stage(page,button,expect):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined')
 await page.get_by_role('button',name=button,exact=True).click();await page.wait_for_timeout(50)
 for label,want in expect.items():
  node=page.locator('.ig-home-v4-card').filter(has=page.get_by_text(label,exact=True))
  need(await node.count()==1,'Home area not found '+label)
  need(await node.is_visible()==want,'Home visibility wrong for '+button+' / '+label)
async def set_stage(page,stage):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined')
 if stage=='GENERAL':await page.evaluate('IGAudience.clear()')
 else:await page.evaluate("IGAudience.set("+json.dumps(stage)+")")
async def gate(page,path,blocked,stage):
 await set_stage(page,stage);requests=[];page.on('request',lambda r,arr=requests:arr.append(r.url))
 await page.goto(BASE+path,wait_until='domcontentloaded')
 need(await page.locator('html').get_attribute('data-ig-audience')==stage,'stage bootstrap mismatch '+stage)
 if blocked:
  await page.wait_for_selector('[data-ig-audience-blocked-message]',state='attached',timeout=5000)
  need(await page.locator('main').first.is_hidden(),'blocked main visible '+path+' '+stage)
 else:
  need(await page.locator('main').first.is_visible(),'allowed main hidden '+path+' '+stage)
 need(not any('/assets/safety/full/' in u for u in requests),'full S2 requested during age gate '+path)
async def search_has(page,stage,path):
 await set_stage(page,stage)
 return await page.evaluate("""async ([stage,path]) => {
   const rows=await IGSearch.load();
   return rows.some(x=>IGSearch.path(x.url)===path);
 }""",[stage,path])
async def visible_exact(page,text):
 return await page.get_by_text(text,exact=True).evaluate_all("els => els.filter(el => { const r=el.getClientRects(); const s=getComputedStyle(el); return r.length>0 && s.display!=='none' && s.visibility!=='hidden'; }).length")
async def sabik_gate(page):
 await set_stage(page,'AGE_0_12')
 return await page.evaluate("""async () => {
   const runtime=await IGAudience.loadAgeMatrix();
   const allKey=Object.keys(runtime.by_url).find(k=>k.startsWith('/es/neurodiversidad/condiciones/')&&runtime.by_url[k].includes('ALL_AGES'));
   const adultKey='/es/neurodiversidad/condiciones/menopausia';
   if(!allKey)throw new Error('No ALL_AGES condition found');
   const make=(id,url,title)=>({library_version:'qa',fragment_id:id,snippet:'qa',url:'https://irisgreen.eu'+url,title,heading:'',source_type:'page',concepts:[],score:1});
   const a=make('adult',adultKey,'Adult only'),b=make('all',allKey,'All ages');
   const envelope={library_version:'qa',source_language:'es',candidates:[a,b],groups:[{url:a.url,citations:[a]},{url:b.url,citations:[b]}]};
   const root=document.createElement('div');document.body.appendChild(root);
   const panel=SabikRetrievalPanel.createRetrievalPanel({root,query:async()=>envelope,language:'es'});
   const result=await panel.run({query:'qa'});
   const titles=Array.from(root.querySelectorAll('a')).map(x=>x.textContent);
   root.remove();
   return {result,titles};
 }""")
async def main():
 OUT.mkdir(parents=True,exist_ok=True);report={'checks':[]}
 async with async_playwright() as p:
  b=await p.chromium.launch();page=await b.new_page()
  await page.goto(BASE+'/',wait_until='networkidle')
  structure=await page.evaluate("""() => Object.fromEntries(['.ig-home-v4-use-grid','.ig-home-v4-card','.ig-home-v4-sabik','.ig-home-v4-discover-grid','.ig-home-v4-footer'].map(s=>{const e=document.querySelector(s);return [s,e?getComputedStyle(e).display:null]}))""")
  need(structure['.ig-home-v4-use-grid']=='grid','Home v4 use grid CSS missing')
  need(structure['.ig-home-v4-card']=='grid','Home v4 card CSS missing')
  need(structure['.ig-home-v4-sabik']=='block','Home v4 Sabik chassis CSS missing')
  need(structure['.ig-home-v4-discover-grid']=='grid','Home v4 discover CSS missing')
  need(structure['.ig-home-v4-footer']=='flex','Home v4 footer CSS missing')
  report['checks'].append('home-v4-css-render-integrity')
  await home_stage(page,'0–12 años',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':False,'Investigación':False,'Ayudas y trámites':False,'Tus intereses':False,'Libros de Iris Green':False,'Juegos':True,'El taller':True,'Rutinas visuales':True,'Rincón tranquilo':True,'Rutinas imprimibles':True})
  await home_stage(page,'13–17 años',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':True,'Investigación':True,'Ayudas y trámites':False,'Tus intereses':False,'Libros de Iris Green':False})
  await home_stage(page,'18 años o más',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':True,'Investigación':True,'Ayudas y trámites':True,'Tus intereses':True,'Libros de Iris Green':True})
  await home_stage(page,'Todas las edades',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':False,'Investigación':False,'Ayudas y trámites':False})
  await set_stage(page,'AGE_0_12')
  await page.goto(BASE+'/',wait_until='networkidle')
  need(await page.locator('[data-ig-home-safe]').count()==0 and await page.locator('[data-ig-home-adult]').count()==0,
       'Internal age-safety implementation must not be exposed as Home copy')
  await page.evaluate("IGAudience.set('AGE_18_PLUS')");await page.wait_for_timeout(50)
  report['checks'].append('home-safety-internal-not-labelled')
  report['checks'].append('home-canonical-surface-gates')
  adult_path='/es/neurodiversidad/condiciones/menopausia/'
  await gate(page,adult_path,False,'GENERAL')
  await gate(page,adult_path,True,'AGE_0_12')
  await gate(page,adult_path,True,'AGE_13_17')
  await gate(page,adult_path,False,'AGE_18_PLUS')
  await gate(page,adult_path,True,'ALL_AGES')
  await gate(page,'/es/tramites/directorio/',True,'AGE_13_17')
  await gate(page,'/es/tramites/directorio/',False,'AGE_18_PLUS')
  # Unclassified discovery/product pages are fail-closed in child/teen/all-ages views.
  await gate(page,'/es/intereses/',True,'AGE_0_12')
  await gate(page,'/es/libros/',True,'AGE_0_12')
  await gate(page,'/es/intereses/',True,'AGE_13_17')
  await gate(page,'/es/libros/',True,'ALL_AGES')
  # Explicit safe tool surfaces remain usable and apply their own internal age filters.
  await gate(page,'/es/recursos/juegos/',False,'AGE_0_12')
  await gate(page,'/es/taller/',False,'AGE_0_12')
  await gate(page,'/es/recursos/rutinas-visuales/',False,'AGE_0_12')
  report['checks'].append('deep-link-pre-render-gates')
  report['checks'].append('unclassified-direct-route-fail-closed')
  menopause='/es/neurodiversidad/condiciones/menopausia'
  need(not await search_has(page,'AGE_0_12',menopause),'child search leaked adult-only condition')
  need(not await search_has(page,'AGE_13_17',menopause),'teen search leaked adult-only condition')
  need(await search_has(page,'AGE_18_PLUS',menopause),'adult search lost adult-only condition')
  need(not await search_has(page,'ALL_AGES',menopause),'ALL_AGES search leaked adult-only condition')
  report['checks'].append('search-autocomplete-catalogue-age-filter')
  await page.goto(BASE+'/es/neurodiversidad/condiciones/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined')
  await page.evaluate("IGAudience.set('AGE_0_12')");await page.wait_for_timeout(500)
  need(await visible_exact(page,'Menopausia')==0,'catalogue visibly leaked adult-only card to child view')
  await page.evaluate("IGAudience.set('AGE_18_PLUS')");await page.wait_for_timeout(500)
  need(await visible_exact(page,'Menopausia')>0,'adult catalogue missing visible Menopausia')
  report['checks'].append('catalogue-before-card-render')
  await page.goto(BASE+'/es/situaciones/la-ropa-me-molesta/',wait_until='domcontentloaded')
  need(await page.locator('a[data-ig-age-bands]').count()>0,'related/internal classified links lack canonical age tags')
  report['checks'].append('related-links-tagged')
  sg=await sabik_gate(page)
  need(sg['result']['count']==1,'Sabik child result count wrong')
  need(sg['titles']==['All ages'],'Sabik rendered age-inappropriate result '+repr(sg['titles']))
  report['checks'].append('sabik-filter-before-render')
  await b.close()
 (OUT/'browser.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':asyncio.run(main())
