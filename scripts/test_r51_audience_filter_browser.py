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
  node=page.locator('.ig-home-area').filter(has=page.get_by_text(label,exact=True))
  need(await node.count()==1,'Home area not found '+label)
  need(await node.is_visible()==want,'Home visibility wrong for '+button+' / '+label)
async def set_stage(page,stage):
 await page.goto(BASE+'/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined')
 if stage=='default':await page.evaluate('IGAudience.clear()')
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
async def sabik_gate(page):
 await set_stage(page,'children')
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
  await home_stage(page,'Infancia',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':False,'Investigación':False,'Ayudas y trámites':False})
  await home_stage(page,'Adolescencia',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':True,'Investigación':True,'Ayudas y trámites':False})
  await home_stage(page,'Adultez',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':True,'Investigación':True,'Ayudas y trámites':True})
  await home_stage(page,'Cualquier edad',{'Condiciones':True,'Situaciones':True,'Vida diaria':True,'Datos':False,'Investigación':False,'Ayudas y trámites':False})
  report['checks'].append('home-canonical-surface-gates')
  adult_path='/es/datos/empleo-y-discapacidad-en-espana/'
  await gate(page,adult_path,False,'default')
  await gate(page,adult_path,True,'children')
  await gate(page,adult_path,True,'teenagers')
  await gate(page,adult_path,False,'adults')
  await gate(page,adult_path,True,'any')
  await gate(page,'/es/tramites/directorio/',True,'teenagers')
  await gate(page,'/es/tramites/directorio/',False,'adults')
  report['checks'].append('deep-link-pre-render-gates')
  menopause='/es/neurodiversidad/condiciones/menopausia'
  need(not await search_has(page,'children',menopause),'child search leaked adult-only condition')
  need(not await search_has(page,'teenagers',menopause),'teen search leaked adult-only condition')
  need(await search_has(page,'adults',menopause),'adult search lost adult-only condition')
  need(not await search_has(page,'any',menopause),'ALL_AGES search leaked adult-only condition')
  report['checks'].append('search-autocomplete-catalogue-age-filter')
  await page.goto(BASE+'/es/neurodiversidad/condiciones/',wait_until='domcontentloaded');await page.wait_for_function('window.IGAudience !== undefined')
  await page.evaluate("IGAudience.set('children')");await page.wait_for_timeout(500)
  need(await page.get_by_text('Menopausia',exact=True).count()==0,'catalogue leaked adult-only card to child view')
  await page.evaluate("IGAudience.set('adults')");await page.wait_for_timeout(500)
  need(await page.get_by_text('Menopausia',exact=True).count()>0,'adult catalogue missing Menopausia')
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
