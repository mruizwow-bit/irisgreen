#!/usr/bin/env python3
from pathlib import Path
import argparse, tempfile, hashlib, json, re
import cairosvg

SIZES=((365,70),(730,140),(1460,280),(2920,560))

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default=None); a=ap.parse_args()
    root=Path(a.root).resolve() if a.root else Path(__file__).resolve().parents[1]
    svg=root/'masters'/'SABIK_WORDMARK_T1_MASTER_R2.svg'
    text=svg.read_text(encoding='utf-8')
    paths=re.findall(r'<path\b[^>]*\sd="([^"]+)"',text)
    integrity={
        'embedded_raster':'<image' in text.lower(),
        'font_dependency': bool(re.search(r'<text\b|font-family|@font-face',text,re.I)),
        'path_count':len(paths),
        'node_count':sum(1 for d in paths for c in re.findall(r'[MmLlHhVvCcSsQqTtAaZz]',d) if c.lower()!='z'),
    }
    mismatches=[]
    with tempfile.TemporaryDirectory(prefix='sabik-wordmark-r2-') as td:
        td=Path(td)
        for w,h in SIZES:
            gen=td/f'SABIK_T1_R2_{w}x{h}.png'
            cairosvg.svg2png(url=str(svg),write_to=str(gen),output_width=w,output_height=h)
            dist=root/'brand'/'raster_tests'/gen.name
            if not dist.exists() or sha(gen)!=sha(dist): mismatches.append(gen.name)
        p365=root/'brand'/'raster_tests'/'SABIK_T1_R2_365x70.png'
        for preview in ('sabik_wordmark_T1_preview.png','sabik_wordmark_T1_vector_preview.png'):
            q=root/'brand'/preview
            if not q.exists() or sha(q)!=sha(p365): mismatches.append(preview)
    ok=(not mismatches and not integrity['embedded_raster'] and not integrity['font_dependency'] and integrity['path_count']==5 and integrity['node_count']==59)
    report={'status':'REPRODUCIBILITY_PASS' if ok else 'REPRODUCIBILITY_FAIL','wordmark_raster_mismatches':mismatches,'svg_integrity':integrity}
    (root/'tests'/'WORDMARK_T1_REPRODUCIBILITY_R2.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    if not ok:
        print('WORDMARK_R2_REPRODUCIBILITY_FAIL')
        raise SystemExit(1)
    print('WORDMARK_R2_REPRODUCIBILITY_PASS')

if __name__=='__main__': main()
