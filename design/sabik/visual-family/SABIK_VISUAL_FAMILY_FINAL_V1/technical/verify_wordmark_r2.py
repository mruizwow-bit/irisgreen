#!/usr/bin/env python3
from pathlib import Path
import argparse, tempfile, hashlib, json, re
import cairosvg

SIZES=((365,70),(730,140),(1460,280),(2920,560))

def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''):
            h.update(c)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default=None); a=ap.parse_args()
    root=Path(a.root).resolve() if a.root else Path(__file__).resolve().parents[1]
    svg=root/'masters'/'SABIK_WORDMARK_T1_MASTER_R2.svg'
    text=svg.read_text(encoding='utf-8')
    integrity={
        'embedded_raster': '<image' in text.lower(),
        'path_count': len(re.findall(r'<path\b',text)),
        'node_count': sum(1 for d in re.findall(r'\sd="([^"]+)"',text) for c in re.findall(r'[MmLlHhVvCcSsQqTtAaZz]',d) if c.lower()!='z'),
    }
    mismatches=[]
    with tempfile.TemporaryDirectory(prefix='sabik-wordmark-r2-') as td:
        td=Path(td)
        for w,h in SIZES:
            gen=td/f'SABIK_T1_R2_{w}x{h}.png'
            cairosvg.svg2png(url=str(svg),write_to=str(gen),output_width=w,output_height=h)
            dist=root/'brand'/'raster_tests'/gen.name
            if not dist.exists() or sha(gen)!=sha(dist):
                mismatches.append(gen.name)
        p365=root/'brand'/'raster_tests'/'SABIK_T1_R2_365x70.png'
        for preview in ('sabik_wordmark_T1_preview.png','sabik_wordmark_T1_vector_preview.png'):
            q=root/'brand'/preview
            if not q.exists() or sha(q)!=sha(p365): mismatches.append(preview)

    lock=json.loads((root/'tests'/'ACCEPTED_R1_ASSET_LOCK.json').read_text(encoding='utf-8'))
    lock_mismatches=[]
    for item in lock['files']:
        q=root/item['path']
        if not q.exists() or q.stat().st_size!=item['bytes'] or sha(q)!=item['sha256']:
            lock_mismatches.append(item['path'])

    ok=(not mismatches and not lock_mismatches and not integrity['embedded_raster'] and integrity['path_count']==5 and integrity['node_count']<100)
    report={
        'status':'REPRODUCIBILITY_PASS' if ok else 'REPRODUCIBILITY_FAIL',
        'wordmark_raster_mismatches':mismatches,
        'accepted_R1_lock_mismatches':lock_mismatches,
        'accepted_R1_locked_files':lock['locked_file_count'],
        'svg_integrity':integrity,
    }
    (root/'tests'/'WORDMARK_T1_REPRODUCIBILITY_R2.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(report['status'])
    if not ok: raise SystemExit(1)

if __name__=='__main__':
    main()
