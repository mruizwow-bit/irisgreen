#!/usr/bin/env python3
from pathlib import Path
import re

p=Path('scripts/build_site.py'); s=p.read_text(encoding='utf-8')
marker="    # Contrato permanente: ningún estado editorial puede reaparecer en la salida pública.\n"
call="    # Fuentes locales, impresión común y retirada definitiva de Google Fonts.\n    subprocess.run([sys.executable,str(ROOT/'scripts/apply_accessibility_release.py'),'--root',str(dst)],cwd=ROOT,check=True)\n"
assert marker in s
if call not in s:s=s.replace(marker,call+marker,1)
p.write_text(s,encoding='utf-8')

p=Path('.github/workflows/comprobar-publicacion.yml'); s=p.read_text(encoding='utf-8')
s=s.replace('python3 scripts/audit_accesibilidad.py --root dist --informe-solo','python3 scripts/audit_accesibilidad.py --root dist')
p.write_text(s,encoding='utf-8')

p=Path('assets/site-v23.css'); s=p.read_text(encoding='utf-8')
rule='[style*="Atkinson"]{font-family:"IG Zero","Atkinson Hyperlegible",system-ui,sans-serif!important}'
if rule not in s:
    anchor='body{\n'; assert anchor in s
    s=s.replace(anchor,rule+'\n'+anchor,1)
p.write_text(s,encoding='utf-8')

p=Path('assets/ajustes-interfaz.css'); s=p.read_text(encoding='utf-8')
changes={
  '.ig-uh-reading{font-size:14px!important;width:auto!important;padding:0 10px!important}':'.ig-uh-reading{font-size:16px!important;width:auto!important;padding:0 10px!important}',
  '#ig-music-panel .ig-m-controls button{min-width:max-content;white-space:nowrap;font-size:14px;padding:6px 7px}':'#ig-music-panel .ig-m-controls button{min-width:max-content;white-space:nowrap;font-size:16px;padding:6px 7px}',
  '.ig-uh-music,.ig-uh-reading{padding-inline:8px!important;font-size:13px!important;gap:4px!important}':'.ig-uh-music,.ig-uh-reading{padding-inline:8px!important;font-size:16px!important;gap:4px!important}',
  '.ig-uh-langs button{min-width:44px!important;padding:0 6px!important;font-size:12px!important}':'.ig-uh-langs button{min-width:44px!important;padding:0 6px!important;font-size:14px!important}',
}
for old,new in changes.items():
    if old in s:s=s.replace(old,new,1)
    else:assert new in s, old
p.write_text(s,encoding='utf-8')

p=Path('es/intereses/imprimir/index.html'); s=p.read_text(encoding='utf-8')
if 'id="print-title"' not in s:
    s=s.replace('.barra{position:sticky;', '.print-page-title{width:194mm;max-width:calc(100% - 36px);margin:22px auto 0;font-family:\'Newsreader\',Georgia,serif;font-weight:600;font-size:28px;line-height:1.2}\n.barra{position:sticky;',1)
    s=s.replace(' .barra{display:none}', ' .print-page-title{display:none}\n .barra{display:none}',1)
    s=s.replace('</head><body>\n<div class="barra">','</head><body>\n<main id="main">\n<h1 class="print-page-title" id="print-title">Cromos para imprimir</h1>\n<div class="barra">',1)
    s=s.replace('<div class="hojas" id="hojas"></div>\n<script>','<div class="hojas" id="hojas"></div>\n</main>\n<script>',1)
    old='document.documentElement.lang="en";document.title="Print cards · Iris Green";document.getElementById("imprimir").textContent="Print or save as PDF";'
    new='document.documentElement.lang="en";document.title="Print cards · Iris Green";document.getElementById("print-title").textContent="Cards to print";document.getElementById("imprimir").textContent="Print or save as PDF";'
    assert old in s;s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

p=Path('es/recursos/juegos/index.html'); s=p.read_text(encoding='utf-8')
pat=re.compile(r'<a(?P<a>[^>]*(?:data-dc-tpl="112"|href="\{\{ g\.href \}\}")[^>]*)>\s*(?P<img><img[^>]*\balt=""[^>]*>)\s*</a>')
if pat.search(s):
    s,n=pat.subn(lambda m:m.group('img'),s)
    assert n>=1
else:
    assert 'data-dc-tpl="112"' not in s
p.write_text(s,encoding='utf-8')
