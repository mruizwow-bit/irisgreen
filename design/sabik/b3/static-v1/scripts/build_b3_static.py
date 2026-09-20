#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import numpy as np
import argparse, json, hashlib, tempfile, shutil, sys

PRODUCTS=['web','ia','educa']
STATES=['presente','orientar','transicion','pausa','confirmar']
STATE_TITLES={'presente':'PRESENTE','orientar':'ORIENTAR','transicion':'TRANSICIÓN','pausa':'PAUSA','confirmar':'CONFIRMAR'}
PRODUCT_TITLES={'web':'SABIK WEB','ia':'SABIK IA','educa':'SABIK EDUCA'}

def sha256(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for c in iter(lambda:f.read(1024*1024),b''): h.update(c)
    return h.hexdigest()

def verify_master_lock(root):
    lock=json.loads((root/'tests'/'ACCEPTED_FAMILY_MASTER_LOCK.json').read_text(encoding='utf-8'))
    bad=[]
    for item in lock['files']:
        p=root/item['path']
        if not p.is_file() or p.stat().st_size!=item['bytes'] or sha256(p)!=item['sha256']:
            bad.append(item['path'])
    if bad:
        raise SystemExit('ACCEPTED_FAMILY_MASTER_LOCK_FAIL '+','.join(bad))
    print(f'ACCEPTED_FAMILY_MASTER_LOCK_PASS {len(lock["files"])} files')

def weighted_quantile(values, weights, qs):
    idx=np.argsort(values); v=values[idx]; w=weights[idx]
    cw=np.cumsum(w); total=cw[-1]
    return [v[np.searchsorted(cw,q*total)] for q in qs]

def smoothstep(edge0,edge1,x):
    t=np.clip((x-edge0)/(edge1-edge0),0,1)
    return t*t*(3-2*t)

def shift_rgba(im,dx,dy):
    out=Image.new('RGBA',im.size,(0,0,0,0))
    out.alpha_composite(im,(int(round(dx)),int(round(dy))))
    return out

def alpha_scale(im,factor):
    ar=np.array(im).copy()
    ar[:,:,3]=np.clip(ar[:,:,3].astype(float)*factor,0,255).astype(np.uint8)
    return Image.fromarray(ar,'RGBA')

def center_scale(im,scale):
    w,h=im.size; nw,nh=int(round(w*scale)),int(round(h*scale))
    rs=im.resize((nw,nh),Image.Resampling.LANCZOS)
    out=Image.new('RGBA',(w,h),(0,0,0,0))
    out.alpha_composite(rs,((w-nw)//2,(h-nh)//2))
    return out

def make_layers(base):
    arr=np.array(base).astype(np.uint8); alpha=arr[:,:,3].astype(float)/255
    yy,xx=np.mgrid[:alpha.shape[0],:alpha.shape[1]]
    s=alpha.sum(); cx=(xx*alpha).sum()/s; cy=(yy*alpha).sum()/s
    X=np.column_stack([(xx-cx).ravel(),(yy-cy).ravel()]); ww=alpha.ravel()
    C=(X*ww[:,None]).T@X/ww.sum(); vals,vecs=np.linalg.eigh(C)
    v=vecs[:,np.argmax(vals)]
    if v[0]<0:v=-v
    if v[1]>0:v[1]*=-1
    v=v/np.linalg.norm(v)
    p=(xx-cx)*v[0]+(yy-cy)*v[1]; valid=alpha>0.01
    t1,t2=weighted_quantile(p[valid],alpha[valid],[0.36,0.64])
    feather=max(8,(t2-t1)*0.14)
    m1=1-smoothstep(t1-feather,t1+feather,p)
    m3=smoothstep(t2-feather,t2+feather,p)
    m2=np.clip(1-m1-m3,0,1)
    layers=[]
    for m in (m1,m2,m3):
        ar=arr.copy()
        ar[:,:,3]=np.clip(alpha*m*255,0,255).astype(np.uint8)
        layers.append(Image.fromarray(ar,'RGBA'))
    return layers,v

def state_variant(master,state,params,canvas=544):
    base=Image.new('RGBA',(canvas,canvas),(0,0,0,0))
    base.alpha_composite(master,((canvas-master.width)//2,(canvas-master.height)//2))
    if state=='presente':
        return base
    layers,v=make_layers(base)
    cfg=params[state.upper() if state!='transicion' else 'TRANSICIÓN']
    shifts=cfg['band_shift_px']; op=cfg['band_alpha']
    out=Image.new('RGBA',base.size,(0,0,0,0))
    for lay,sh,opa in zip(layers,shifts,op):
        out=Image.alpha_composite(out,shift_rgba(alpha_scale(lay,opa),v[0]*sh,v[1]*sh))
    if cfg.get('global_scale',1.0)!=1.0:
        out=center_scale(out,float(cfg['global_scale']))
    return out

def fnt(size,bold=False):
    candidates=[
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    ]
    for p in candidates:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

def paste_fit(canvas,im,box):
    x,y,w,h=box; cp=im.copy(); cp.thumbnail((w,h),Image.Resampling.LANCZOS)
    canvas.alpha_composite(cp,(x+(w-cp.width)//2,y+(h-cp.height)//2))

def center_text(d,text,box,font,fill):
    x,y,w,h=box; bb=d.textbbox((0,0),text,font=font)
    d.text((x+(w-(bb[2]-bb[0]))/2,y+(h-(bb[3]-bb[1]))/2),text,font=font,fill=fill)

def build(root,outroot):
    grammar=json.loads((root/'docs'/'B3_STATE_GRAMMAR_V1.json').read_text(encoding='utf-8'))
    params=grammar['transform_parameters']
    assets=outroot/'assets'; proofs=outroot/'proofs'
    assets.mkdir(parents=True,exist_ok=True); proofs.mkdir(parents=True,exist_ok=True)
    for prod in PRODUCTS:
        (assets/prod).mkdir(exist_ok=True)
        master=Image.open(root/'source'/f'{prod}_master_raster_ACCEPTED.png').convert('RGBA')
        for st in STATES:
            im=state_variant(master,st,params)
            im.save(assets/prod/f'{prod}_{st}.png',optimize=False,compress_level=9)
            gray=ImageOps.grayscale(im.convert('RGB')); alpha=im.getchannel('A')
            g=gray.point(lambda v:int(35+v*0.45))
            Image.merge('RGBA',(g,g,g,alpha)).save(assets/prod/f'{prod}_{st}_mono.png',optimize=False,compress_level=9)
            for s in (64,32):
                im.resize((s,s),Image.Resampling.LANCZOS).save(assets/prod/f'{prod}_{st}_{s}px.png',optimize=False,compress_level=9)

    # A
    W,H=1800,1120; sheet=Image.new('RGBA',(W,H),'white'); d=ImageDraw.Draw(sheet)
    d.text((60,40),"SABIK · B3 · MATRIZ DE ESTADOS ESTÁTICOS",font=fnt(42,1),fill=(11,36,80))
    d.text((60,95),"UNA MISMA ESENCIA · TRES PRESENCIAS DE PRODUCTO · CINCO FUNCIONES",font=fnt(20,1),fill=(41,74,122))
    d.text((60,130),"PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR",font=fnt(17),fill=(41,74,122))
    left=210;top=190;cellw=305;cellh=280
    for j,st in enumerate(STATES): center_text(d,STATE_TITLES[st],(left+j*cellw,top-45,280,35),fnt(19,1),(11,36,80))
    for i,prod in enumerate(PRODUCTS):
        y=top+i*cellh; d.text((45,y+110),PRODUCT_TITLES[prod],font=fnt(19,1),fill=(11,36,80))
        for j,st in enumerate(STATES):
            x=left+j*cellw; d.rounded_rectangle((x,y,x+280,y+245),18,fill=(248,250,253),outline=(222,229,238))
            paste_fit(sheet,Image.open(assets/prod/f'{prod}_{st}.png').convert('RGBA'),(x+25,y+18,230,205))
    d.text((60,H-70),"B3 = función del sistema. Voz, Safety y estados operativos heredados no se convierten en estados B3.",font=fnt(17),fill=(41,74,122))
    sheet.convert('RGB').save(proofs/'LAMINA_A_MATRIZ_ESTADOS.png',quality=95)

    # B
    W,H=1500,1700; sheet=Image.new('RGBA',(W,H),'white'); d=ImageDraw.Draw(sheet)
    d.text((55,35),"SABIK · B3 · COMPARACIÓN POR ESTADO",font=fnt(38,1),fill=(11,36,80))
    d.text((55,85),"MISMA FUNCIÓN → MISMA LÓGICA → EXPRESIÓN MORFOLÓGICA PROPIA",font=fnt(18,1),fill=(41,74,122))
    top=140; rowh=300
    for r,st in enumerate(STATES):
        y=top+r*rowh; d.text((55,y+12),STATE_TITLES[st],font=fnt(23,1),fill=(11,36,80))
        for i,prod in enumerate(PRODUCTS):
            x=250+i*405; d.rounded_rectangle((x,y,x+370,y+250),18,fill=(248,250,253),outline=(222,229,238))
            paste_fit(sheet,Image.open(assets/prod/f'{prod}_{st}.png').convert('RGBA'),(x+40,y+18,290,190))
            center_text(d,PRODUCT_TITLES[prod],(x,y+210,370,35),fnt(16,1),(41,74,122))
    sheet.convert('RGB').save(proofs/'LAMINA_B_COMPARACION_POR_ESTADO.png',quality=95)

    # C
    W,H=1800,1120; sheet=Image.new('RGBA',(W,H),'white'); d=ImageDraw.Draw(sheet)
    d.text((60,40),"SABIK · B3 · MONOCROMO",font=fnt(42,1),fill=(11,36,80))
    d.text((60,95),"15 ESTADOS SIN COLOR · PRUEBA DE DIFERENCIACIÓN ESTRUCTURAL",font=fnt(20,1),fill=(41,74,122))
    left=210;top=170;cellw=305;cellh=285
    for j,st in enumerate(STATES): center_text(d,STATE_TITLES[st],(left+j*cellw,top-45,280,35),fnt(19,1),(11,36,80))
    for i,prod in enumerate(PRODUCTS):
        y=top+i*cellh; d.text((45,y+110),PRODUCT_TITLES[prod],font=fnt(19,1),fill=(11,36,80))
        for j,st in enumerate(STATES):
            x=left+j*cellw; d.rounded_rectangle((x,y,x+280,y+245),18,fill=(249,249,249),outline=(225,228,232))
            paste_fit(sheet,Image.open(assets/prod/f'{prod}_{st}_mono.png').convert('RGBA'),(x+25,y+18,230,205))
    d.text((60,H-65),"Color eliminado. La discriminación perceptiva final queda PENDING HUMAN TEST.",font=fnt(17),fill=(41,74,122))
    sheet.convert('RGB').save(proofs/'LAMINA_C_MONOCROMO.png',quality=95)

    # D
    W,H=1800,1700; sheet=Image.new('RGBA',(W,H),'white'); d=ImageDraw.Draw(sheet)
    d.text((60,35),"SABIK · B3 · PRUEBA DE ESCALA",font=fnt(40,1),fill=(11,36,80))
    d.text((60,88),"15 ESTADOS · 64 PX / 32 PX · PERCEPCIÓN A 32 PX PENDIENTE DE TEST HUMANO",font=fnt(18,1),fill=(41,74,122))
    top=150; rowh=300
    for r,st in enumerate(STATES):
        y=top+r*rowh; d.text((50,y+15),STATE_TITLES[st],font=fnt(21,1),fill=(11,36,80))
        for i,prod in enumerate(PRODUCTS):
            x=230+i*500; d.text((x,y+15),PRODUCT_TITLES[prod],font=fnt(17,1),fill=(41,74,122))
            im64=Image.open(assets/prod/f'{prod}_{st}_64px.png').convert('RGBA')
            im32=Image.open(assets/prod/f'{prod}_{st}_32px.png').convert('RGBA')
            d.text((x,y+55),"64 px",font=fnt(15),fill=(41,74,122)); sheet.alpha_composite(im64,(x+70,y+45))
            d.text((x,y+135),"32 px",font=fnt(15),fill=(41,74,122)); sheet.alpha_composite(im32,(x+70,y+130))
            sheet.alpha_composite(im64.resize((128,128),Image.Resampling.NEAREST),(x+180,y+45))
            sheet.alpha_composite(im32.resize((128,128),Image.Resampling.NEAREST),(x+330,y+45))
            d.text((x+185,y+178),"64×2 inspección",font=fnt(12),fill=(90,100,120))
            d.text((x+332,y+178),"32×4 inspección",font=fnt(12),fill=(90,100,120))
    d.text((60,H-55),"La existencia técnica del PNG no se usa como evidencia de percepción humana. 32 px = PENDING HUMAN TEST.",font=fnt(16),fill=(41,74,122))
    sheet.convert('RGB').save(proofs/'LAMINA_D_ESCALA_64_32.png',quality=95)

    # E
    W,H=1600,760; sheet=Image.new('RGBA',(W,H),'white'); d=ImageDraw.Draw(sheet)
    d.text((55,35),"SABIK · B3 · ORIGEN Y PRESENTE",font=fnt(38,1),fill=(11,36,80))
    d.text((55,85),"PRESENCIA MATRIZ = ORIGEN FAMILIAR · NO GENERA ESTADOS B3",font=fnt(18,1),fill=(41,74,122))
    names=[('matriz','PRESENCIA MATRIZ'),('web','SABIK WEB · PRESENTE'),('ia','SABIK IA · PRESENTE'),('educa','SABIK EDUCA · PRESENTE')]
    for i,(n,t) in enumerate(names):
        x=35+i*390; d.rounded_rectangle((x,145,x+360,650),18,fill=(248,250,253),outline=(222,229,238))
        if n=='matriz':
            im=Image.open(root/'source/matriz_master_raster_ACCEPTED.png').convert('RGBA')
            c=Image.new('RGBA',(544,544),(0,0,0,0)); c.alpha_composite(im,(16,16)); im=c
        else: im=Image.open(assets/n/f'{n}_presente.png').convert('RGBA')
        paste_fit(sheet,im,(x+35,190,290,330)); center_text(d,t,(x+10,540,340,60),fnt(17,1),(11,36,80))
        center_text(d,"Referencia · sin estados" if n=='matriz' else "Master aceptado · PRESENTE",(x+10,595,340,35),fnt(14),(41,74,122))
    sheet.convert('RGB').save(proofs/'LAMINA_E_MATRIZ_REFERENCIA.png',quality=95)
    print('B3_STATIC_BUILD_PASS')

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--root',default=None)
    ap.add_argument('--out-root',default=None)
    a=ap.parse_args()
    root=Path(a.root).resolve() if a.root else Path(__file__).resolve().parents[1]
    outroot=Path(a.out_root).resolve() if a.out_root else root
    verify_master_lock(root)
    build(root,outroot)

if __name__=='__main__':
    main()