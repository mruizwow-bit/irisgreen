#!/usr/bin/env python3
"""Gate de preparación runtime · Mar 22. No requiere todavía los seis PNG finales."""
from __future__ import annotations
from pathlib import Path
import json,re,os
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent.parent
CONTRACT=ROOT/'assets/data/mar22-descent-contract.json'
RUNTIME=ROOT/'assets/ig-mar22-descent.js'
CSS=ROOT/'assets/ig-mar22-descent.css'
HARNESS=ROOT/'tools/mar22-descent-runtime-harness.html'
OUT=ROOT/'reports/mar22-descent-runtime';OUT.mkdir(parents=True,exist_ok=True)
EXPECTED=[
 '/img/intereses/temas/22-vida-marina/pez-hacha-luz.png',
 '/img/intereses/temas/22-vida-marina/pez-hacha-oscuro.png',
 '/img/intereses/temas/22-vida-marina/pez-linterna-luz.png',
 '/img/intereses/temas/22-vida-marina/pez-linterna-oscuro.png',
 '/img/intereses/temas/22-vida-marina/calamar-cristal-luz.png',
 '/img/intereses/temas/22-vida-marina/calamar-cristal-oscuro.png',
]

def static_gate():
 data=json.loads(CONTRACT.read_text(encoding='utf-8'))
 assert data['schema']=='iris-green/mar22-descent-contract/v1'
 assert len(data['zones'])==5
 paths=[]
 for s in data['species']:
  assert s['zone']=='mesopelagic'
  assert s['real_length_cm'] is None, 'No inventar tamaños biológicos en runtime prep'
  paths.extend([s['assets']['light'],s['assets']['dark']])
 assert paths==EXPECTED,(paths,EXPECTED)
 assert len(set(paths))==6
 assert all('/22-vida-marina/' in p and p.endswith('.png') for p in paths)
 txt=RUNTIME.read_text(encoding='utf-8')
 assert 'juegos-iris' not in txt and 'r48-m-depth' not in txt
 assert not re.search(r'https?://',txt), 'Runtime no debe pedir terceros'
 banned=['sprite','spritesheet','composite','lámina','lamina']
 assert not any(x in txt.lower() for x in banned)
 assert 'drawEnvironment' in txt and "new Image()" in txt
 assert 'MAR22_ASSET_MISSING' in txt
 return {'zones':5,'species':3,'asset_paths':paths,'third_party_literals':0,'real_size_values_invented':0}

def browser_gate():
 contract=json.loads(CONTRACT.read_text(encoding='utf-8'))
 runtime=RUNTIME.read_text(encoding='utf-8')
 css=CSS.read_text(encoding='utf-8')
 cases=[]
 with sync_playwright() as pw:
  exe=os.environ.get('MAR22_CHROMIUM')
  browser=pw.chromium.launch(executable_path=exe or None,args=['--no-sandbox'] if exe else [])
  for lang in ['es','en']:
   for motion in ['normal','reduced','none']:
    ctx=browser.new_context(viewport={'width':390,'height':844})
    page=ctx.new_page();req=[]
    def intercept(route):
     req.append(urlsplit(route.request.url).path)
     route.abort()
    page.route('**/*',intercept)
    html='<!doctype html><html lang="%s"><head><base href="https://irisgreen.test/"></head><body><div id="mar22" data-lang="%s"></div></body></html>'%(lang,lang)
    page.set_content(html)
    page.add_style_tag(content=css)
    page.add_script_tag(content=runtime)
    page.evaluate("([contract,lang,motion])=>{window.__MAR22_RUNTIME=new IGMar22Descent.Runtime(document.getElementById('mar22'),contract,{lang,motion});}",[contract,lang,motion])

    assert page.locator('.mar22-zone-nav button').count()==5
    assert page.locator('.mar22-species button').count()==3
    assert not any(p.endswith('.png') for p in req), 'Lazy load: no PNG before choosing a species'

    page.locator('[data-zone="mesopelagic"]').click()
    page.locator('[data-species="pez-hacha"]').click()
    page.wait_for_timeout(120)
    light='/img/intereses/temas/22-vida-marina/pez-hacha-luz.png'
    assert req.count(light)==1,req
    assert page.locator('.mar22-creature-fallback').is_visible()
    assert page.locator('.mar22-creature').count()==0

    page.locator('[data-action="dark"]').click()
    page.wait_for_timeout(120)
    dark='/img/intereses/temas/22-vida-marina/pez-hacha-oscuro.png'
    assert req.count(dark)==1,req
    assert not any(p in req for p in EXPECTED[2:]),req

    status=page.locator('.mar22-status').inner_text()
    assert (('Zona mesopelágica' in status) if lang=='es' else ('Mesopelagic zone' in status))
    assert motion in status
    assert page.locator('.mar22-status').is_visible()
    assert page.locator('.mar22-zone-nav').is_visible()
    assert all(p.startswith('/img/intereses/temas/22-vida-marina/') for p in req),req

    geometry=page.evaluate("""()=>{const r=window.__MAR22_RUNTIME;
r.setAssetGeometry('pez-hacha','light',{width:100,height:80,centerX:50,centerY:40});
const same=r.setAssetGeometry('pez-hacha','dark',{width:100,height:80,centerX:50,centerY:40});
r.setAssetGeometry('pez-hacha','dark',{width:100,height:80,centerX:51,centerY:40});
return {same,shifted:r.validatePairGeometry('pez-hacha')};}""")
    assert geometry=={'same':True,'shifted':False},geometry

    ratio=page.evaluate("""()=>{const r=window.__MAR22_RUNTIME;
r.setSpeciesMetadata({'pez-hacha':{lengthCm:10},'pez-linterna':{lengthCm:20},'calamar-cristal':{lengthCm:40}});
r.applyScale();return getComputedStyle(r.visual).getPropertyValue('--mar22-real-ratio').trim();}""")
    assert abs(float(ratio)-0.25)<1e-9,ratio

    raf=page.evaluate("()=>window.__MAR22_RUNTIME.raf")
    assert ((raf!=0) if motion=='normal' else (raf==0))
    page.locator('[data-action="flashlight"]').click()
    assert page.locator('[data-action="flashlight"]').get_attribute('aria-pressed')=='true'

    cases.append({'lang':lang,'motion':motion,'requests':req,'external':0,'fallback':True,'geometry_guard':geometry,'relative_scale_ratio':ratio,'raf_active':bool(raf)})
    ctx.close()

  ctx=browser.new_context(viewport={'width':800,'height':700});page=ctx.new_page();req=[]
  def intercept_all(route):
   req.append(urlsplit(route.request.url).path)
   route.abort()
  page.route('**/*',intercept_all)
  page.set_content('<!doctype html><html lang="es"><head><base href="https://irisgreen.test/"></head><body><div id="mar22"></div></body></html>')
  page.add_style_tag(content=css);page.add_script_tag(content=runtime)
  page.evaluate("contract=>{window.__MAR22_RUNTIME=new IGMar22Descent.Runtime(document.getElementById('mar22'),contract,{lang:'es',motion:'none'});}",contract)
  for sid in ['pez-hacha','pez-linterna','calamar-cristal']:
   before=len(req)
   page.locator(f'[data-species="{sid}"]').click();page.wait_for_timeout(80)
   new=req[before:]
   assert len(new)==1 and new[0].endswith(f'/{sid}-luz.png'),(sid,new)
  browser.close()
 return cases

def future_asset_gate():
 """When Atlas assets arrive, fail closed on partial packs and geometry/text metadata."""
 data=json.loads(CONTRACT.read_text(encoding='utf-8'))
 base=ROOT/'img/intereses/temas/22-vida-marina'
 present=[p for p in EXPECTED if (ROOT/p.lstrip('/')).is_file()]
 result={'present':len(present),'expected':6,'pair_geometry':'deferred','embedded_text':'deferred'}
 if not present:return result
 assert len(present)==6,'Partial Atlas pack: expected all six PNGs'
 from PIL import Image
 for s in data['species']:
  a=ROOT/s['assets']['light'].lstrip('/');b=ROOT/s['assets']['dark'].lstrip('/')
  with Image.open(a) as ia,Image.open(b) as ib:
   assert ia.size==ib.size,(s['id'],ia.size,ib.size)
   assert ia.mode in {'RGBA','LA'} and ib.mode in {'RGBA','LA'},(s['id'],ia.mode,ib.mode)
 result['pair_geometry']='canvas-size-pass'
 manifest=base/'manifest.json'
 if manifest.is_file():
  m=json.loads(manifest.read_text(encoding='utf-8'))
  by_id={x['id']:x for x in m.get('species',[])}
  for s in data['species']:
   x=by_id[s['id']]
   assert x.get('embedded_text') is False
   assert x.get('center_light')==x.get('center_dark')
  result['embedded_text']='manifest-pass';result['pair_geometry']='manifest-center-pass'
 return result

def main():
 report={
  'gate':'MAR_22_DESCENT_ENGINE_RUNTIME_READY_FOR_ASSETS',
  'static':static_gate(),
  'browser':browser_gate(),
  'future_assets':future_asset_gate(),
  'passed':True
 }
 (OUT/'runtime-prep.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
