#!/usr/bin/env python3
"""Add missing toggle semantics, and strengthen the existing accessibility tests."""
from pathlib import Path
import re,json
root=Path.cwd();changes=[]
for p in [root/'index.html',*sorted((root/'es').rglob('*.html'))]:
 s=p.read_text();old=s
 if '<sc-if value="{{ a11yOpen }}"' not in s:continue
 a=s.index('<sc-for list="{{ a11yToggles }}"');b=s.index('</sc-for>',a)
 chunk=s[a:b]
 if 'aria-pressed=' not in chunk:
  chunk=chunk.replace('<button ', '<button aria-pressed="{{ t.pressed }}" ',1);s=s[:a]+chunk+s[b:]
 a=s.index('      a11yToggles:');b=s.index('      a11yReset:',a);chunk=s[a:b]
 if 'pressed:' not in chunk:
  assert '        return {' in chunk
  chunk=chunk.replace('        return {','        return {\n          pressed: on,',1);s=s[:a]+chunk+s[b:]
 if old!=s:p.write_text(s);changes.append(str(p.relative_to(root)))
p=root/'scripts/test_accessibility_batch.py';s=p.read_text()
old="      toggle=panel.locator('button[aria-pressed]').first"
new="      assert panel.locator('button[aria-pressed]').count()==6,'All six reading options must expose their state'\n"+old
if new not in s:s=s.replace(old,new,1)
s=s.replace("       target=p.locator('main .ig-picture-target');before=rects(target)","       p.wait_for_function('document.querySelector(\"main img\")?.naturalWidth>1')\n       target=p.locator('main .ig-picture-target');before=rects(target)")
old="      assert panel.get_attribute('role')=='region'"
new="      if width==320 and path in ['index.html',STATIC[0]]:p.screenshot(path=str(OUT/('reading-'+path.replace('/','-')+'.png')))\n"+old
if new not in s:s=s.replace(old,new,1)
p.write_text(s)
(root/'reports/accessibility/semantics.json').write_text(json.dumps({'toggle_pages_corrected':changes,'note':'Six existing settings are now exposed with aria-pressed where it was missing.'},indent=2)+'\n')
print(json.dumps({'toggle_pages_corrected':changes}))
