#!/usr/bin/env python3
"""Miniaturas de los IDs existentes, sin cambiar títulos, selección ni enlaces.
--refresh descarga las imágenes de YouTube. --apply-only usa la copia comprobada.
Que exista una miniatura no demuestra que el vídeo permita reproducción embebida.
"""
from __future__ import annotations
import argparse, hashlib, io, json, re, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ASSETS=ROOT/'assets/video-thumbnails'
MANIFEST=ASSETS/'manifest.json'
PAGES=['index.html','es/videos/index.html']
ID=re.compile(r'^[A-Za-z0-9_-]{11}$')


def video_ids():
    found=set()
    data=json.loads((ROOT/'videoteca-listado.json').read_text())
    for v in data['videos']:
        if v.get('plataforma')=='YouTube' and ID.fullmatch(str(v.get('ref',''))):found.add(v['ref'])
    for name in PAGES:
        text=(ROOT/name).read_text()
        for match in re.finditer(r'\by\(\s*"(?:[^"\\]|\\.)*"\s*,\s*"(?:[^"\\]|\\.)*"\s*,\s*"([A-Za-z0-9_-]{11})"',text):found.add(match[1])
    if not found or len(found)>200:raise ValueError('Número de vídeos no previsto; revisar sin modificar.')
    return sorted(found)


def download(ident):
    from PIL import Image
    errors=[]
    for size in ['maxresdefault','hqdefault']:
        url=f'https://i.ytimg.com/vi/{ident}/{size}.jpg'
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'IrisGreen-thumbnail-check/1.0'})
            with urllib.request.urlopen(req,timeout=12) as response:
                blob=response.read(2_000_001)
                if response.status!=200 or len(blob)>2_000_000:raise ValueError('Respuesta inesperada o demasiado grande.')
            with Image.open(io.BytesIO(blob)) as image:
                width,height=image.size
                if image.format!='JPEG' or width<320 or height<180:raise ValueError('No es una miniatura de tamaño suficiente.')
                image.verify()
            file=ASSETS/(ident+'.jpg');file.write_bytes(blob)
            return ident,{'path':'/assets/video-thumbnails/'+ident+'.jpg','source':url,'width':width,'height':height,'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest(),'checkedAt':datetime.now(timezone.utc).isoformat(),'status':'image_downloaded'},None
        except Exception as error:errors.append(size+': '+str(error))
    return ident,None,errors


def apply(manifest):
    mapping={key:value['path'] for key,value in manifest['images'].items() if (ROOT/value['path'].lstrip('/')).is_file()}
    encoded=json.dumps(mapping,ensure_ascii=False,separators=(',',':'))
    thumb_const='const IG_VIDEO_THUMBNAILS = '+encoded+';'
    thumb_function='const ytThumb = (u) => { const m = String(u || "").match(/youtube(?:-nocookie)?\\.com\\/embed\\/([A-Za-z0-9_-]{11})/); return m ? (IG_VIDEO_THUMBNAILS[m[1]] || "") : ""; };'
    rows=[]
    for name in PAGES:
        path=ROOT/name;text=path.read_text();before=text
        if 'const IG_VIDEO_THUMBNAILS =' in text:
            text,n=re.subn(r'const IG_VIDEO_THUMBNAILS = [^\n]+;',lambda _:thumb_const,text)
            assert n==1
        else:
            assert text.count('const ytThumb = ')==1
            text=text.replace('const ytThumb = ',thumb_const+'\nconst ytThumb = ',1)
        text,n=re.subn(r'const ytThumb = [^\n]+;',lambda _:thumb_function,text)
        assert n==1
        text=re.sub(r'^const thumbImg = [^\n]+;\n','',text,flags=re.M)
        old='thumbImg: thumbImg(ytThumb(v.embed)), hasThumb: !!ytThumb(v.embed), noThumb: !ytThumb(v.embed)'
        new='thumb: thumbURL(v), hasThumb: !!thumbURL(v), noThumb: !thumbURL(v), unavailableThumb: v.source === "YouTube" && !thumbURL(v), onThumbError: () => { this._igThumbFailures = Object.assign({}, this._igThumbFailures, { [v.embed]: true }); this.setState({ thumbnailErrors: this._igThumbFailures }); }, thumbMessage: L === "en" ? "Thumbnail unavailable" : "Miniatura no disponible", playLabel: (L === "en" ? "Play video: " : "Reproducir vídeo: ") + v.name'
        if old in text:
            assert text.count(old)==1;text=text.replace(old,new,1)
        else:assert new in text
        anchor='  renderVals() {\n    const st = this.state;'
        helper='\n    const thumbURL = (video) => st.thumbnailErrors && st.thumbnailErrors[video.embed] ? "" : ytThumb(video.embed);'
        if helper not in text:
            assert text.count(anchor)==1;text=text.replace(anchor,anchor+helper,1)
        picture='<sc-if value="{{ v.hasThumb }}" hint-placeholder-val="{{ false }}"><img class="ig-video-thumbnail" sc-camel-src="{{ v.thumb }}" sc-camel-on-error="{{ v.onThumbError }}" width="1280" height="720" loading="lazy" decoding="async" alt=""></sc-if><sc-if value="{{ v.unavailableThumb }}" hint-placeholder-val="{{ false }}"><span class="ig-thumbnail-unavailable">{{ v.thumbMessage }}</span></sc-if>'
        if '{{ v.thumbImg }}' in text:
            text,n=re.subn(r'<sc-if\b[^>]*value="\{\{ v\.hasThumb \}\}"[^>]*>\{\{ v\.thumbImg \}\}.*?</sc-if>',lambda _:picture,text,flags=re.S)
            assert n==1
        else:assert 'class="ig-video-thumbnail"' in text
        def poster(match):
            tag=match[0]
            if 'position: absolute' not in tag:return tag
            if 'class=' not in tag:tag=tag.replace('<button','<button class="ig-video-poster"',1)
            if 'data-ig-video=' not in tag:tag=tag[:-1]+' data-ig-video="{{ v.src }}">'
            tag=re.sub(r'aria-label="[^"]*"','aria-label="{{ v.playLabel }}"',tag)
            return tag
        text=re.sub(r'<button\b[^>]*sc-camel-on-click="\{\{ v\.play \}\}"[^>]*>',poster,text)
        css='<link rel="stylesheet" href="/assets/video-thumbnails.css">'
        if css not in text:text=text.replace('</head>',css+'\n</head>',1)
        if text!=before:path.write_text(text)
        rows.append({'page':name,'changed':text!=before,'mapped_images':len(mapping)})
    return rows


def main():
    parser=argparse.ArgumentParser();parser.add_argument('--refresh',action='store_true');parser.add_argument('--apply-only',action='store_true');args=parser.parse_args()
    ASSETS.mkdir(parents=True,exist_ok=True)
    manifest=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {'images':{},'failed':{},'note':'Copia de miniaturas; no certifica disponibilidad ni permisos de reproducción de los vídeos.'}
    ids=video_ids()
    if not args.apply_only:
        wanted=ids if args.refresh else [key for key in ids if key not in manifest['images'] or not (ROOT/manifest['images'][key]['path'].lstrip('/')).exists()]
        with ThreadPoolExecutor(max_workers=6) as pool:
            for future in as_completed([pool.submit(download,key) for key in wanted]):
                key,image,error=future.result()
                if image:manifest['images'][key]=image;manifest['failed'].pop(key,None)
                else:manifest['failed'][key]=error
        manifest['requested_ids']=ids
        MANIFEST.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    if not MANIFEST.exists():raise ValueError('No hay manifest de miniaturas comprobadas.')
    changes=apply(manifest)
    report={'requested':len(ids),'available':sum(key in manifest['images'] and (ROOT/manifest['images'][key]['path'].lstrip('/')).is_file() for key in ids),'failed':{key:manifest['failed'][key] for key in ids if key in manifest['failed']},'total_bytes':sum(image['bytes'] for key,image in manifest['images'].items() if key in ids),'pages':changes,'note':'Archivos JPEG originales sin reescalar. El navegador conserva el espacio 16:9 y no carga el reproductor hasta pulsar.'}
    out=ROOT/'reports/thumbnails';out.mkdir(parents=True,exist_ok=True);(out/'images.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False))

if __name__=='__main__':main()
