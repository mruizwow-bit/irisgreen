#!/usr/bin/env python3
from pathlib import Path
import argparse,re
ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,default=Path('.'));a=ap.parse_args();r=a.root.resolve()
required=['assets/ig-suite-core.js','assets/ig-suite-physics.js','assets/ig-suite-codigo.js','assets/ig-suite-modelado3d.js','assets/ig-suite-videomapping.js','assets/vendor/taller/planck.js','assets/vendor/taller/rapier2d.js','assets/vendor/taller/rapier2d.wasm','assets/vendor/taller/three.js','assets/vendor/taller/pixi.js','assets/vendor/taller/blockly.js','assets/vendor/taller/codemirror.js','assets/vendor/taller/tone.js','assets/ig-taller-material-r43.css']
miss=[p for p in required if not (r/p).is_file()];assert not miss,miss
pages=[]
for base in (r/'es/taller',r/'en/workshop'):
    if (base/'index.html').is_file():pages.append(base/'index.html')
    pages+=sorted(base.glob('*/index.html'))
assert len(pages)>=54,len(pages)
for p in pages:
    s=p.read_text(encoding='utf-8')
    assert 'data-ig-materials="r42"' in s,p
    assert '/assets/ig-r42-materials.css?v=r42-design-1' in s,p
    assert '/assets/ig-taller-material-r43.css?v=r43-integration-1' in s,p
for lang,base in [('es','es/taller'),('en','en/workshop')]:
    hub=(r/base/'index.html').read_text(encoding='utf-8');prefix='/es/taller/' if lang=='es' else '/en/workshop/'
    for h in set(re.findall(r'href="('+re.escape(prefix)+r'[^"?#]+/)"',hub)):
        p=r/(h.strip('/')+'/index.html');assert p.is_file(),(h,'missing')
        assert 'data-ig-materials="r42"' in p.read_text(encoding='utf-8'),(h,'uncovered')
s=(r/'assets/ig-taller-r42.js').read_text(encoding='utf-8')
assert not re.search(r'sessionStorage[^\n]*ig42-stage|ig42-stage[^\n]*sessionStorage',s,re.I)
phys=(r/'assets/ig-suite-physics.js').read_text(encoding='utf-8').lower();assert 'planck' in phys and 'rapier' in phys
print({'status':'PASS','workshop_pages':len(pages),'visible_routes_checked':True})
