#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageOps
import argparse

def save_png(im,p):
    p.parent.mkdir(parents=True,exist_ok=True); im.save(p,'PNG',compress_level=9,optimize=False)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default=None); ap.add_argument('--output',default='assets'); a=ap.parse_args()
    root=Path(a.root).resolve() if a.root else Path(__file__).resolve().parents[1]
    masters=root/'masters'; out=root/a.output
    for name in ('matriz','web','ia','educa'):
        im=Image.open(masters/f'{name}_master_raster.png').convert('RGBA'); d=out/name; d.mkdir(parents=True,exist_ok=True)
        save_png(im,d/f'{name}_master_color.png')
        alpha=im.getchannel('A')
        gray=ImageOps.grayscale(im.convert('RGB'))
        save_png(Image.merge('RGBA',(gray,gray,gray,alpha)),d/f'{name}_monochrome_light.png')
        gd=gray.point(lambda v: 28 + int(v*0.30))
        save_png(Image.merge('RGBA',(gd,gd,gd,alpha)),d/f'{name}_monochrome_dark.png')
        sil=Image.new('RGBA',im.size,(41,50,67,0)); sil.putalpha(alpha)
        save_png(sil,d/f'{name}_silhouette.png')
        for s in (64,40,32,24):
            save_png(im.resize((s,s),Image.Resampling.LANCZOS),d/f'{name}_{s}px.png')
        for lab,bg in (('white',(255,255,255)),('lightgray',(245,247,249)),('dark',(14,29,53))):
            c=Image.new('RGB',(640,420),bg); icon=im.resize((320,320),Image.Resampling.LANCZOS)
            c.paste(icon,(160,40),icon); save_png(c,d/f'{name}_on_{lab}.png')
    print('BUILD_ASSETS_PASS')
if __name__=='__main__': main()
