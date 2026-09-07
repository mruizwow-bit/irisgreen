#!/usr/bin/env python3
"""Only the user's enlarged-text mode reflows narrow columns. Default layout is unchanged."""
from pathlib import Path
import json
root=Path.cwd();out=root/'reports/accessibility';out.mkdir(parents=True,exist_ok=True);changed=[]
for p in [root/'index.html',*sorted((root/'es').rglob('*.html'))]:
 s=p.read_text();old='    if (readingMain) readingMain.style.zoom = (s.fs / 17).toFixed(3);'
 new=old+'\n    h.toggleAttribute("data-ig-text-enlarged", s.fs > 17);'
 if old in s and new not in s:
  assert s.count(old)==1;s=s.replace(old,new);p.write_text(s);changed.append(p.relative_to(root).as_posix())
p=root/'assets/lectura-accesible.js';s=p.read_text();old=" function apply(){";new=old+"\n  document.documentElement.toggleAttribute('data-ig-text-enlarged',(S.fs||0)>0);"
if new not in s:
 assert s.count(old)==1;s=s.replace(old,new);p.write_text(s)
p=root/'assets/ajustes-interfaz.css';s=p.read_text();marker='/* Enlarged reading: reflow content on narrow screens, not the fixed UI. */'
if marker not in s:
 s+='\n'+marker+'''
@media(max-width:700px){
 html[data-ig-text-enlarged] main :where(div,section,article,label,p,span,strong){min-width:0!important;max-width:100%}
 html[data-ig-text-enlarged] main :where(h1,h2,h3,p,li,a,span,strong,button,label){overflow-wrap:anywhere}
 html[data-ig-text-enlarged] main :where(button,input,select,textarea,img){max-width:100%!important}
 html[data-ig-text-enlarged] main :where(div,section,article,label)[style*="display: flex"]{flex-wrap:wrap!important}
 html[data-ig-text-enlarged] main :where(div,section,article)[style*="grid-template-columns"]{grid-template-columns:minmax(0,1fr)!important}
 html[data-ig-text-enlarged] .qchoice{grid-template-columns:minmax(44px,72px) minmax(0,1fr)}
 html[data-ig-text-enlarged] .qchoice img{width:72px}
}
''';p.write_text(s)
p=root/'scripts/test_accessibility_batch.py';s=p.read_text()
old="      row['enlarged_content_overflow_px']=p.evaluate('Math.max(0,document.documentElement.scrollWidth-innerWidth)')"
extra="\n      assert row['enlarged_content_overflow_px']<=2,'Content overflows when enlarged: '+str(row['enlarged_content_overflow_px'])"
if old+extra not in s:assert old in s;s=s.replace(old,old+extra,1)
old="      if toggle.count():\n       before=toggle.get_attribute('aria-pressed');toggle.click();assert toggle.get_attribute('aria-pressed')!=before"
new="      for toggle in panel.locator('button[aria-pressed]').all():\n       before=toggle.get_attribute('aria-pressed');toggle.click();assert toggle.get_attribute('aria-pressed')!=before\n       toggle.click();assert toggle.get_attribute('aria-pressed')==before\n      row['six_reading_options_toggle']=True"
if old in s:s=s.replace(old,new,1)
p.write_text(s)
(out/'enlarged-text-changes.json').write_text(json.dumps({'pages':changed,'scope':'Only enlarged-text mode below 700 px; default grids and game rules unchanged.','test':'Maximum built-in text enlargement checked for horizontal overflow.'},indent=2)+'\n')
