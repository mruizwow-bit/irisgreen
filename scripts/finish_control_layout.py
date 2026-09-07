#!/usr/bin/env python3
"""Último ajuste de disposición tras comparar las capturas de ambos catálogos."""
import re
from pathlib import Path
ROOT=Path.cwd()
p=ROOT/'assets/controles-comunes.css';s=p.read_text()
block='''/* El mismo foco y la misma separación en los buscadores de sección. */
:is(.secfind input[type=search],#situationsSearch,#vd-search,#q[type=search]):focus{outline:3px solid #5a49a8!important;outline-offset:3px!important}
:is(.secfind .chips,.secfind .azidx,.situations-filter-row){margin:0!important}
'''
if block not in s:s+='\n'+block;p.write_text(s)

def counter_class(tag):
 m=re.search(r'class="([^"]*)"',tag)
 if m:
  if 'ig-catalog-message' in m[1].split():return tag
  return tag[:m.start(1)]+m[1]+' ig-catalog-message'+tag[m.end(1):]
 return tag.replace('<p','<p class="ig-catalog-message"',1)

p=ROOT/'es/situaciones/index.html';s=p.read_text()
s=re.sub(r'<label class="situations-search"><span class="ig-catalog-label">([^<]+)</span>(<input\b[^>]*>)</label>',lambda m:'<label for="situationsSearch">'+m[1]+'</label>'+m[2],s)
match=re.search(r'<p\b[^>]*id="situationsCount"[^>]*>.*?</p>',s,re.S);assert match
counter=re.sub(r'<p\b[^>]*>',lambda m:counter_class(m[0]),match[0],count=1)
s=s[:match.start()]+s[match.end():]
pos=s.index('</section>',s.index('class="situations-filter"'));s=s[:pos]+counter+s[pos:];p.write_text(s)
p=ROOT/'es/neurodiversidad/condiciones/index.html';s=p.read_text()
s=re.sub(r'<p\b[^>]*id="cuenta"[^>]*>',lambda m:counter_class(m[0]),s);p.write_text(s)
# La comprobación exige también el foco común, no solo las pastillas.
p=ROOT/'scripts/test_coherence.py';s=p.read_text()
old="p.locator('[data-ig-catalog-reset]').click();p.screenshot(path=str(OUT/f'"
new="p.locator('[data-ig-catalog-reset]').click();assert p.locator(q).evaluate('(e)=>getComputedStyle(e).outlineColor')=='rgb(90, 73, 168)';p.screenshot(path=str(OUT/f'"
if old in s:s=s.replace(old,new,1);p.write_text(s)
print('Buscadores y contadores alineados; comprobación del foco añadida.')
