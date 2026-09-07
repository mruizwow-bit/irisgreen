#!/usr/bin/env python3
"""Only thumbnail rendering and the description of its network behaviour change.
No video IDs, titles, explanations, filters, player URLs or media are replaced.
"""
import hashlib,json,re
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'reports/video-thumbnails';OUT.mkdir(parents=True,exist_ok=True)
report={'pages':[],'notes':[]}
source=ROOT/'videoteca-listado.json'
catalog_hash=hashlib.sha256(source.read_bytes()).hexdigest()
for rel in ['index.html','es/videos/index.html']:
    path=ROOT/rel;original=path.read_text();s=original
    # The original declarations are one line each. Replace the disabled helper,
    # not the selected video or its source data.
    s,n=re.subn(r'^const ytThumb = .*?;$','const ytThumb = (u) => window.IGVideoThumbs.src(u);',s,flags=re.M)
    assert n==1,(rel,'ytThumb',n)
    s,n=re.subn(r'^const thumbImg = .*?;$','const thumbImg = (u) => window.IGVideoThumbs.image(u);',s,flags=re.M)
    assert n==1,(rel,'thumbImg',n)
    script='<script defer src="/assets/video-miniaturas.js"></script>'
    if script not in s:
        marker='<script defer src="/assets/runtime/d949f1c3687aedad.js"></script>'
        assert s.count(marker)==1,rel
        s=s.replace(marker,script+'\n'+marker,1)
    old='<span style="position: absolute; inset: 0; background: rgba(255,255,255,0.5);"></span>'
    overlay_count=s.count(old)
    assert overlay_count<=1,rel
    s=s.replace(old,'')
    marker='<div style="position: relative; aspect-ratio: {{ v.ratio }};'
    if 'class="ig-video-preview"' not in s:
        assert s.count(marker)==1,rel
        s=s.replace(marker,'<div class="ig-video-preview" data-video-source="{{ v.src }}" style="position: relative; aspect-ratio: {{ v.ratio }};',1)
    if 'playLabel:' not in s:
        marker='thumbImg: thumbImg(ytThumb(v.embed)),'
        assert s.count(marker)==1,rel
        s=s.replace(marker,'playLabel: (L === "en" ? "Play video: " : L === "pt" ? "Reproduzir vídeo: " : "Reproducir vídeo: ") + v.name, '+marker,1)
    if '{{ v.playLabel }}' not in s:
        label='Reproducir aquí' if rel=='index.html' else '{{ tPlay }}'
        marker='sc-camel-on-click="{{ v.play }}" aria-label="'+label+'"'
        assert s.count(marker)==1,rel
        s=s.replace(marker,'sc-camel-on-click="{{ v.play }}" aria-label="{{ v.playLabel }}"',1)
    if rel=='es/videos/index.html':
        s=s.replace('sin cargar nada hasta que pulsas','con miniaturas de YouTube y el reproductor bajo demanda')
        s=s.replace('Nada se carga hasta que pulsas: la página no pone cookies de YouTube, Instagram ni Vimeo antes de eso.', 'Las miniaturas se cargan desde YouTube; el reproductor solo se carga cuando pulsas.')
        s=s.replace('Nothing loads until you press play: the page sets no YouTube, Instagram or Vimeo cookies before that.', 'Thumbnails load from YouTube; the player only loads when you press play.')
    # Verify all literal video source entries remain byte-for-byte identical.
    refs=lambda text:re.findall(r'^\s*[ygvi]\(.*$',text,re.M)
    assert refs(original)==refs(s),'Video entries changed: '+rel
    path.write_text(s)
    report['pages'].append({'path':rel,'before_sha256':hashlib.sha256(original.encode()).hexdigest(),'after_sha256':hashlib.sha256(s.encode()).hexdigest(),'white_overlay_removed':bool(overlay_count),'literal_video_entries_preserved':True})
# This existing paragraph must not promise no request to YouTube before a click
# now that the user explicitly wants the real preview images.
p=ROOT/'es/privacidad/index.html';s=p.read_text();old=s
pattern=r'<p>Los vídeos de la videoteca <strong>no se cargan hasta que pulsas el botón de reproducir</strong>.*?</p>'
replacement='<p>Las miniaturas de YouTube se solicitan a sus servidores al acercarte a los vídeos. Esa petición transmite información técnica, como la dirección IP desde la que se pide la imagen. El reproductor del vídeo <strong>no se carga hasta que pulsas el botón de reproducir</strong>; se abre dentro de la web desde <code>youtube-nocookie.com</code>. Cargar una miniatura no inicia la reproducción.</p>'
if replacement not in s:
    s,n=re.subn(pattern,replacement,s,flags=re.S);assert n==1,'Revisar el párrafo de privacidad';p.write_text(s)
report['privacy_paragraph_updated']=s!=old
assert hashlib.sha256(source.read_bytes()).hexdigest()==catalog_hash
report['catalogue_sha256_unchanged']=catalog_hash
report['notes']=['The YouTube image uses the actual existing video ID. No generated placeholder replaces the thumbnail.','The heavy player is still created only after a user action.','A failed high-resolution image falls back once to the medium thumbnail; if both fail, a plain unavailable message appears instead of a broken image.','Thumbnail visibility does not establish that embedding or playback is available.','No changes were merged or deployed by this script.']
(OUT/'changes.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
