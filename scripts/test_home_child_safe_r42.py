#!/usr/bin/env python3
"""Deterministic acceptance checks for canonical Home v4 + child safety."""
from __future__ import annotations
import argparse,json
from pathlib import Path
S2_ES=['/es/neurodiversidad/condiciones/abuso-y-explotacion/','/es/neurodiversidad/condiciones/anorexia-nerviosa/','/es/neurodiversidad/condiciones/trastorno-por-atracon/','/es/neurodiversidad/condiciones/bulimia-nerviosa/','/es/neurodiversidad/condiciones/trastornos-de-la-conducta-alimentaria-tca/','/es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/','/es/neurodiversidad/condiciones/tept-trastorno-por-estres-postraumatico/','/es/neurodiversidad/condiciones/tept-complejo/','/es/biblioteca/arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica/','/es/biblioteca/abuso-explotacion-y-relaciones-seguras/']
IDS=['global-188','global-200','global-212','global-224','global-237','global-320','global-360','global-395','library-022','library-057']

def need(v,m):
 if not v: raise AssertionError(m)
def page(root,url): return root/url.strip('/')/'index.html'
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--root',type=Path,required=True);root=ap.parse_args().root.resolve()
 es=(root/'index.html').read_text(encoding='utf-8');en=(root/'en/index.html').read_text(encoding='utf-8')
 for txt,labels in [(es,['Buscar','Explora','Pregunta a Sabik','Información y recursos']),(en,['Search','Explore','Ask Sabik','Information and resources'])]:
  need('data-ig-home-version="v4"' in txt,'Home v4 marker missing')
  need('data-ig-r49="1"' in txt,'Home is not enrolled in the global shell')
  need(txt.count('data-ig-audience-picker')==1,'Home canonical age picker count !=1')
  need(txt.count('data-ig-audience-stage=')==3,'Home public age button count !=3')
  need('data-ig-audience-stage="GENERAL"' not in txt,'GENERAL must not be a public age button')
  need('data-ig-audience-stage="ALL_AGES"' not in txt,'ALL_AGES must not be a public age button')
  need('ig-home-v4-safety-state' in txt,'Home child-safe status missing')
  for label in labels: need(label in txt,'Home v4 missing '+label)
  for asset in ['/assets/ig-global-ui-tokens-2026.css','/assets/ig-theme.js','/assets/ig-audience.js','/assets/buscador-comun.js','/assets/home-r42-child-safe.js','/assets/ig-r49-transversal.css','/assets/ig-r49-transversal.js','/sabik/sabik-motion-r37.js','/sabik/sabik-web-r01.js','/sabik/iris-mount.mjs']:
   need(txt.count(asset)==1,'Home v4 asset count !=1: '+asset)
  need('class="ig-uh"' not in txt,'Legacy ig-uh header leaked into built Home')
  for forbidden in ['Empieza por lo que necesitas.','Start with what you need.','Infancia','Adolescencia','Adultez','Cualquier edad','Children</button>','Teenagers</button>','Adults</button>','Any age</button>','image-slot.js','<image-slot']:
   need(forbidden not in txt,'Legacy/donor placeholder leaked: '+forbidden)
  for token in ['id="sabik-form"','id="sabik-voice"','id="sabik-motion-level"','id="sabik-reset"']:
   need(token in txt,'Real Sabik control missing '+token)
  need(txt.count('data-ig-media-status="pending"')==13,'Expected 13 donor media slots without invented imagery')
  need('data-ig-theme-choice="dark"' in txt and 'data-ig-theme-choice="light"' in txt,'Global theme alternatives missing')
 safe=json.loads((root/'assets/safety/search-safe-default.json').read_text());intent=json.loads((root/'assets/safety/search-intentional-safe.json').read_text());adult=json.loads((root/'assets/safety/search-adult-full-catalog.json').read_text())
 need(all(x['sensitivity']!='S2_HIGH_SENSITIVITY' for x in safe),'S2 leaked into safe autocomplete payload')
 need(all(x['sensitivity']=='S2_HIGH_SENSITIVITY' for x in intent),'Intentional S2 contract contains non-S2')
 need(len(adult)==len(safe)+len(intent),'Adult search metadata catalogue mismatch')
 protected=0
 for url,cid in zip(S2_ES,IDS):
  p=page(root,url)
  if not p.is_file():
   need(cid=='global-395','Unexpected missing S2 page '+url);continue
  protected+=1;txt=p.read_text(encoding='utf-8')
  need('data-ig-s2-safe' in txt,'Full S2 not replaced '+url)
  need('data-ig-s2-safe-page' in txt,'Safe S2 page marker missing '+url)
  need('prefetch' not in txt.lower() and 'preload' not in txt.lower(),'S2 prefetch/preload found '+url)
  full=root/'assets/safety/full'/f'{cid}-es.html';need(full.is_file(),'Missing full S2 chunk '+cid);need(full.read_text(encoding='utf-8') not in txt,'Full S2 body leaked '+cid)
 need(protected==9,'Expected 9 existing S2 page records')
 theme=(root/'assets/ig-global-ui-tokens-2026.css').read_text(encoding='utf-8')
 for token in ['--ig-bg-page:#0B1A2B','--ig-bg-surface:#15304A','--ig-bg-surface-soft:#1D3D5C','--ig-text:#EEF4F8','html[data-ig-theme="light"]']:
  need(token in theme,'Canonical theme token missing '+token)
 audience=(root/'assets/ig-audience.js').read_text(encoding='utf-8')
 for old in ["current='children'","current='teenagers'","current='adults'","current='any'"]:
  need(old not in audience,'Legacy age taxonomy emitted '+old)
 for canonical in ['AGE_0_12','AGE_13_17','AGE_18_PLUS','ALL_AGES','GENERAL']:
  need(canonical in audience,'Canonical age state missing '+canonical)
 print(json.dumps({'home_v4':'PASS','dark_navy_default':'PASS','light_alternative':'PASS','canonical_age':'PASS','safe_search':len(safe),'intentional_s2':len(intent),'adult_catalog':len(adult),'s2_pages':protected*2},ensure_ascii=False))
if __name__=='__main__': main()
