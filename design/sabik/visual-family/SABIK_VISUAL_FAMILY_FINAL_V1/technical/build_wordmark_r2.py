#!/usr/bin/env python3
from pathlib import Path
import argparse
import cairosvg

SIZES=((365,70),(730,140),(1460,280),(2920,560))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--root', default=None)
    ap.add_argument('--output', default='brand/raster_tests')
    a=ap.parse_args()
    root=Path(a.root).resolve() if a.root else Path(__file__).resolve().parents[1]
    svg=root/'masters'/'SABIK_WORDMARK_T1_MASTER_R2.svg'
    out=root/a.output
    out.mkdir(parents=True,exist_ok=True)
    for w,h in SIZES:
        dest=out/f'SABIK_T1_R2_{w}x{h}.png'
        cairosvg.svg2png(url=str(svg),write_to=str(dest),output_width=w,output_height=h)
    preview=out/'SABIK_T1_R2_365x70.png'
    (root/'brand'/'sabik_wordmark_T1_preview.png').write_bytes(preview.read_bytes())
    (root/'brand'/'sabik_wordmark_T1_vector_preview.png').write_bytes(preview.read_bytes())
    print('WORDMARK_R2_BUILD_PASS')

if __name__=='__main__':
    main()
