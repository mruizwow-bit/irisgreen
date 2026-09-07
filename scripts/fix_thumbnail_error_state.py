#!/usr/bin/env python3
"""Complete the local-thumbnail implementation already in this branch.
Keep the existing generator, sources and tests; do not add a second renderer.
"""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
old='onThumbError: () => this.setState({ thumbnailErrors: Object.assign({}, st.thumbnailErrors, { [v.embed]: true }) })'
new='onThumbError: () => this.setState((current) => ({ thumbnailErrors: Object.assign({}, current.thumbnailErrors, { [v.embed]: true }) }))'
for rel in ['index.html','es/videos/index.html','scripts/prepare_video_thumbnails.py']:
    p=ROOT/rel;s=p.read_text()
    if old in s:
        assert s.count(old)==1,rel
        p.write_text(s.replace(old,new,1))
    else:assert new in s,rel
p=ROOT/'scripts/test_video_thumbnails.py';s=p.read_text()
old="}',('#escuchar ' if path=='/' else 'main ')+'img.ig-video-thumbnail')"
new="}',arg=('#escuchar ' if path=='/' else 'main ')+'img.ig-video-thumbnail')"
if old in s:
    assert s.count(old)==1;s=s.replace(old,new,1)
else:assert new in s
old="                first.click();frame=area.locator('iframe[src]').first;frame.wait_for(state='attached')"
new="                expected_src=first.get_attribute('data-ig-video')\n                first.focus();first.press('Enter');frame=area.locator('iframe[src]').first;frame.wait_for(state='attached')\n                assert frame.get_attribute('src')==expected_src,'El reproductor no corresponde a la miniatura pulsada'"
if old in s:
    assert s.count(old)==1;s=s.replace(old,new,1)
else:assert new in s
p.write_text(s)
print('Corregidos: acumulación de fallos de imagen, parámetro de Playwright y comprobación del vídeo exacto con Enter.')
