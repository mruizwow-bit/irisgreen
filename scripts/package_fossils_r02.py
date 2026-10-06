#!/usr/bin/env python3
from pathlib import Path
import hashlib,json,shutil,sys,zipfile
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'prototypes'/'fossils-r02-pilot-3'
OUT=ROOT/'artifacts'/'PRISMA_FOSILES_R02_PILOTO_3'
ZIP=ROOT/'PRISMA_FOSILES_R02_PILOTO_3.zip'
SHA=ROOT/'PRISMA_FOSILES_R02_PILOTO_3.sha256'
EXPECTED={
'f-antecessor.webp':'3312e9a4e08cb45586db2ec5241c2acfa4a7e8bb2212cefc3e37386daa93722c','f-archaeopteryx.webp':'80109420531348e5550a63e47b5271ecf510cee9a4fae6edd43b7161c049e9e9','f-concavenator.webp':'8d0b42ad4201fd4b76b9c521292b5cc8fb79af16a75be80f8197cd36721da42d','f-dimetrodon.webp':'73b4581dcafce6eac23bd602e4fe5fef2744d39fc6eba2add8def03425c25a18','f-dunkleosteus.webp':'d0defefb4c2f23b95f76d1ac063b3ce3b4ad1143993f101cf45dd239ba550645','f-eoraptor.webp':'468f99439072ea01b75d6d5941db37d2f2006ea1b4096834728d17728e71ff44','f-iguanodon.webp':'b9813c1f40ed2eae0757891db9f9317f53ee49e0300655f9f54aeddf1eb9f6a8','f-mamut.webp':'dd4e5eeac9bed8c08f3ec1068a83c9f22977b0fa64044374080444d6cafb024d','f-meganeura.webp':'f71be3076399273d2ffd433b935f997ccc93dc55922bd73d92046ddc10c68c62','f-pelecanimimus.webp':'ad6c3f41f06a36b8250caa16fa9b2f5a29b44b1807929d16b30ff410dbf290d4','f-plateosaurus.webp':'808975647694886271f99648ae8c24ea6a932eb31c62aaa833f809b8c3b10a2c','f-trex.webp':'8d482a602e34cc404227fd12f4ca5d2f91a7f94f5dbd5363f43709eaf29a1a79','f-trilobites.webp':'3dd61dd5ad2b1aeffab574187e28d8fd2e242772951af8b4467eda0211663d44','f-turiasaurus.webp':'339affcae6591c88961f8901256a088d588806d65725bdd8292825068d1a1137'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def verify_assets():
  arte=SRC/'assets'/'arte'
  for name,want in EXPECTED.items():
    p=arte/name
    if not p.is_file() or sha(p)!=want:raise SystemExit(f'asset mismatch {name}')
  if sha(arte/'sedimento.webp')!='8ac408d1b08011b0eed5cdb5fc77bb1bdd9ca533539e6542e0ea49465b4f4aef':raise SystemExit('sedimento changed')
  if sha(SRC/'assets'/'base-data-r01.js')!='bc71d8ed0124933abf60ea19d06ef67a7a1314c278d22c66112e60213d9e9be5':raise SystemExit('base data changed')
  if sha(SRC/'assets'/'fonts.css')!='10a7a2a921c272762cdc631edc6e4a9acdfc7abdf90fb8d3da0631c5315be826':raise SystemExit('fonts.css changed')
def prepare():
  verify_assets()
  if OUT.exists():shutil.rmtree(OUT)
  shutil.copytree(SRC,OUT)
  print('PREPARED',OUT)
def finalize():
  verify_assets()
  if not (OUT/'QA_BROWSER.json').is_file():raise SystemExit('QA_BROWSER.json missing: run browser QA first')
  qa=json.loads((OUT/'QA_BROWSER.json').read_text(encoding='utf-8'))
  if qa.get('result')!='PASS':raise SystemExit('browser QA not PASS')
  manifest={'schema':'iris-green.prisma.fossils-r02-pilot-3.v1','date':'2026-10-06','entry':'index.html','base_zip_sha256':'21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c','pilot_encounters':['trilobites','dimetrodon','meganeura'],'preserved_fossil_assets':14,'files':[]}
  for p in sorted(x for x in OUT.rglob('*') if x.is_file() and x.name!='manifest.json'):
    manifest['files'].append({'path':p.relative_to(OUT).as_posix(),'bytes':p.stat().st_size,'sha256':sha(p)})
  (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
  if ZIP.exists():ZIP.unlink()
  with zipfile.ZipFile(ZIP,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(x for x in OUT.rglob('*') if x.is_file()):z.write(p,p.relative_to(OUT))
  with zipfile.ZipFile(ZIP) as z:
    bad=z.testzip()
    if bad:raise SystemExit('bad zip member '+bad)
  digest=sha(ZIP);SHA.write_text(f'{digest}  {ZIP.name}\n',encoding='utf-8')
  print('ZIP',ZIP);print('SHA256',digest);print('FILES',len([p for p in OUT.rglob('*') if p.is_file()]));print('PACKAGE_QA=PASS')
if __name__=='__main__':
  mode=sys.argv[1] if len(sys.argv)>1 else 'prepare'
  {'prepare':prepare,'finalize':finalize}[mode]()