#!/usr/bin/env python3
from pathlib import Path
from PIL import Image
import argparse
import numpy as np

def largest_component(mask):
    h,w=mask.shape; seen=np.zeros_like(mask,dtype=bool); best=[]
    for y in range(h):
        for x in range(w):
            if not mask[y,x] or seen[y,x]: continue
            stack=[(y,x)]; seen[y,x]=True; comp=[]
            while stack:
                yy,xx=stack.pop(); comp.append((yy,xx))
                for dy in (-1,0,1):
                    for dx in (-1,0,1):
                        if not(dx or dy): continue
                        ny,nx=yy+dy,xx+dx
                        if 0<=ny<h and 0<=nx<w and mask[ny,nx] and not seen[ny,nx]:
                            seen[ny,nx]=True; stack.append((ny,nx))
            if len(comp)>len(best): best=comp
    out=np.zeros_like(mask,dtype=bool)
    for y,x in best: out[y,x]=True
    return out

def save_png(im,p):
    p.parent.mkdir(parents=True,exist_ok=True); im.save(p,'PNG',compress_level=9,optimize=False)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default=None); a=ap.parse_args()
    root=Path(a.root).resolve() if a.root else Path(__file__).resolve().parents[1]
    src=root/'audit'/'original_extracted_masters'; dst=root/'masters'; dst.mkdir(exist_ok=True)
    for name in ('matriz','web','ia','educa'):
        im=Image.open(src/f'{name}_extracted_v1.png').convert('RGBA'); arr=np.array(im); alpha=arr[:,:,3]
        keep=largest_component(alpha>0); arr[~keep]=0
        save_png(Image.fromarray(arr,'RGBA'),dst/f'{name}_master_raster.png')
    print('CLEAN_MASTERS_PASS')
if __name__=='__main__': main()
