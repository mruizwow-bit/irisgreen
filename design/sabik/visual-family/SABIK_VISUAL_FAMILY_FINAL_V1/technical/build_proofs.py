#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import argparse, base64

def font(size,bold=False):
    p='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    try: return ImageFont.truetype(p,size)
    except: return ImageFont.load_default()

def fit(im,box):
    x,y,w,h=box; c=im.copy(); c.thumbnail((w,h),Image.Resampling.LANCZOS)
    return c,(x+(w-c.width)//2,y+(h-c.height)//2)

def paste_fit(c,im,box):
    im,pos=fit(im,box); c.paste(im,pos,im if im.mode=='RGBA' else None)

def save_png(im,p):
    p.parent.mkdir(parents=True,exist_ok=True); im.save(p,'PNG',compress_level=9,optimize=False)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--root',default=None); a=ap.parse_args()
    root=Path(a.root).resolve() if a.root else Path(__file__).resolve().parents[1]
    names=['matriz','web','ia','educa']; titles=['PRESENCIA MATRIZ','SABIK WEB','SABIK IA','SABIK EDUCA']; out=root/'proofs'; out.mkdir(exist_ok=True)

    c=Image.new('RGB',(1600,900),'white'); d=ImageDraw.Draw(c)
    d.text((60,30),'MASTER CLEANUP · BEFORE / AFTER',font=font(38,1),fill=(11,36,80))
    for i,(n,t) in enumerate(zip(names,titles)):
        x=20+i*395; d.text((x+60,90),t,font=font(20,1),fill=(11,36,80))
        before=Image.open(root/'audit/original_extracted_masters'/f'{n}_extracted_v1.png').convert('RGBA')
        after=Image.open(root/'masters'/f'{n}_master_raster.png').convert('RGBA')
        paste_fit(c,before,(x+20,130,350,300)); paste_fit(c,after,(x+20,485,350,300))
        d.text((x+140,440),'ANTES',font=font(18,1),fill=(90,100,120)); d.text((x+135,800),'DESPUÉS',font=font(18,1),fill=(40,100,70))
    save_png(c,out/'master_cleanup_before_after.png')

    c=Image.new('RGB',(1400,500),'white'); d=ImageDraw.Draw(c)
    d.text((50,25),'SILUETAS FINALES · MISMA ALPHA MAESTRA · SIN MORFOLOGÍA',font=font(30,1),fill=(11,36,80))
    for i,(n,t) in enumerate(zip(names,titles)):
        x=20+i*345; im=Image.open(root/'assets'/n/f'{n}_silhouette.png').convert('RGBA')
        paste_fit(c,im,(x+25,100,290,290)); d.text((x+70,420),t,font=font(18,1),fill=(11,36,80))
    save_png(c,out/'silhouettes_final.png')

    c=Image.new('RGB',(1500,650),'white'); d=ImageDraw.Draw(c)
    d.text((50,25),'PRUEBA DE ESCALA · 64 / 40 / 32 / 24 px',font=font(30,1),fill=(11,36,80))
    for i,(n,t) in enumerate(zip(names,titles)):
        x=20+i*370; d.text((x+70,85),t,font=font(18,1),fill=(11,36,80)); y=145
        for s in (64,40,32,24):
            im=Image.open(root/'assets'/n/f'{n}_{s}px.png').convert('RGBA')
            c.paste(im,(x+120+(64-s)//2,y),im); d.text((x+205,y+18),f'{s} px',font=font(18),fill=(41,74,122)); y+=105
    save_png(c,out/'scale_final.png')

    c=Image.new('RGB',(1500,1000),'white'); d=ImageDraw.Draw(c)
    d.text((50,25),'PRUEBA DE FONDO · BLANCO / GRIS CLARO / NOCHE SUAVE',font=font(28,1),fill=(11,36,80))
    for r,(lab,lt) in enumerate(zip(['white','lightgray','dark'],['FONDO BLANCO','GRIS MUY CLARO','FONDO OSCURO'])):
        d.text((40,105+r*290),lt,font=font(18,1),fill=(11,36,80))
        for i,n in enumerate(names):
            im=Image.open(root/'assets'/n/f'{n}_on_{lab}.png').convert('RGB'); im.thumbnail((300,200))
            x=170+i*320; y=80+r*290; c.paste(im,(x,y)); d.text((x+75,y+215),titles[i],font=font(15,1),fill=(11,36,80))
    save_png(c,out/'backgrounds_final.png')

    c=Image.new('RGB',(1800,1250),'white'); d=ImageDraw.Draw(c)
    wm=Image.open(root/'brand/sabik_wordmark_T1_vector_preview.png').convert('RGBA'); paste_fit(c,wm,(50,30,330,80))
    d.text((450,28),'FAMILIA VISUAL · CIERRE TÉCNICO R1',font=font(38,1),fill=(11,36,80))
    d.text((455,78),'UNA MISMA ESENCIA · CUATRO PRESENCIAS',font=font(23,1),fill=(41,74,122))
    d.text((455,115),'CLARIDAD INTELIGENTE.',font=font(20,1),fill=(11,36,80))
    d.text((455,150),'Una IA que adapta la información para que sea más fácil de entender y usar.',font=font(17),fill=(41,74,122))
    for i,(n,t) in enumerate(zip(names,titles)):
        x=35+i*440; d.rounded_rectangle((x,210,x+415,880),20,fill=(249,251,253),outline=(220,228,238))
        d.text((x+40,235),t,font=font(21,1),fill=(11,36,80))
        paste_fit(c,Image.open(root/'masters'/f'{n}_master_raster.png').convert('RGBA'),(x+40,290,335,335))
        paste_fit(c,Image.open(root/'assets'/n/f'{n}_silhouette.png').convert('RGBA'),(x+35,655,150,150))
    d.text((60,1100),'Estado del paquete: SABIK_VISUAL_FAMILY_FINAL_V1_R1_READY · NO MERGE',font=font(22,1),fill=(40,100,70))
    save_png(c,out/'SABIK_VISUAL_FAMILY_FINAL_V1_R1.png')
    png=(out/'SABIK_VISUAL_FAMILY_FINAL_V1_R1.png').read_bytes(); b64=base64.b64encode(png).decode('ascii')
    (out/'SABIK_VISUAL_FAMILY_FINAL_V1_R1.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 1250"><title>SABIK R1 proof</title><image width="1800" height="1250" href="data:image/png;base64,{b64}"/></svg>\n',encoding='utf-8')
    print('BUILD_PROOFS_PASS')
if __name__=='__main__': main()
