#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageOps
from pathlib import Path
import json, zipfile, hashlib, math, os

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"artifacts"/"construction-r02"
OUT.mkdir(parents=True,exist_ok=True)
REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def F(sz,b=False):
    p=BOLD if b else REG
    return ImageFont.truetype(p,sz) if Path(p).exists() else ImageFont.load_default()

NAVY=(6,39,66,255); TEXT=(245,249,253,255); MUTED=(194,213,226,255)
W1=(58,190,225,255); W2=(18,126,181,255); ROCK=(137,130,111,255); ROCKD=(87,84,73,255)
SAND=(228,200,147,255); GRASS=(101,149,74,255); WOOD=(176,108,49,255); WOODD=(111,69,38,255)
STONE=(151,153,148,255); BLUE=(31,113,166,255); GREEN=(42,171,94,255); RED=(214,59,68,255); PURPLE=(120,77,182,255)

def rr(d,b,r=12,fill=(7,35,60,235),outline=(170,205,225,150),width=1):
    d.rounded_rectangle(b,radius=r,fill=fill,outline=outline,width=width)

def wrap(d,text,font,maxw):
    words=text.split(); lines=[]; cur=""
    for word in words:
        t=(cur+" "+word).strip()
        if d.textbbox((0,0),t,font=font)[2] <= maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=word
    if cur: lines.append(cur)
    return lines

def poly(d,pts,fill,outline=None,width=1):
    d.polygon(pts,fill=fill)
    if outline: d.line(pts+[pts[0]],fill=outline,width=width,joint="curve")

def water(w,h):
    im=Image.new("RGBA",(w,h)); d=ImageDraw.Draw(im,"RGBA")
    for y in range(h):
        t=y/max(1,h-1); c=tuple(int(W1[i]*(1-t)+W2[i]*t) for i in range(3))+(255,)
        d.line((0,y,w,y),fill=c)
    for y in range(55,h,42):
        for x in range((y//42)%2*30,w,95):
            d.arc((x,y,x+52,y+18),185,355,fill=(235,252,255,65),width=2)
    return im

def tree(d,x,y,s):
    d.rectangle((x-4*s,y,x+4*s,y+27*s),fill=(91,59,30,255))
    for dx,dy,r in [(-14,0,17),(0,-12,20),(16,2,16),(2,8,18)]:
        d.ellipse((x+(dx-r)*s,y+(dy-r)*s,x+(dx+r)*s,y+(dy+r)*s),fill=(70,130,66,255))

def player(d,x,y,s):
    # Deliberately provisional proxy: final target is María's female 3D FBX.
    skin=(226,183,145,255); hair=(71,81,83,255); shirt=(204,169,105,255); pants=(117,126,104,255)
    d.ellipse((x-10*s,y-42*s,x+10*s,y-22*s),fill=skin,outline=(90,65,50,255))
    d.pieslice((x-12*s,y-45*s,x+12*s,y-21*s),180,360,fill=hair)
    d.rounded_rectangle((x-10*s,y-23*s,x+10*s,y+8*s),radius=5*s,fill=shirt,outline=(95,75,48,255))
    d.rectangle((x-8*s,y+7*s,x-1*s,y+30*s),fill=pants); d.rectangle((x+1*s,y+7*s,x+8*s,y+30*s),fill=pants)
    d.line((x-10*s,y-16*s,x-19*s,y+3*s),fill=skin,width=max(2,int(3*s)))
    d.line((x+10*s,y-16*s,x+19*s,y+3*s),fill=skin,width=max(2,int(3*s)))
    d.ellipse((x-11*s,y+27*s,x-1*s,y+34*s),fill=(92,65,42,255)); d.ellipse((x+1*s,y+27*s,x+11*s,y+34*s),fill=(92,65,42,255))

def scene(w,h,state,hide_legacy_material_labels=False):
    im=water(w,h); d=ImageDraw.Draw(im,"RGBA")
    left=[(12,h*.28),(w*.30,h*.20),(w*.34,h*.79),(w*.05,h*.89)]
    right=[(w*.66,h*.21),(w-12,h*.17),(w-22,h*.89),(w*.62,h*.80)]
    poly(d,left,ROCK,ROCKD,3); poly(d,right,ROCK,ROCKD,3)
    poly(d,[(28,h*.32),(w*.28,h*.25),(w*.30,h*.70),(w*.07,h*.81)],SAND)
    poly(d,[(w*.69,h*.26),(w-32,h*.23),(w-42,h*.76),(w*.65,h*.71)],SAND)
    d.line((40,h*.33,w*.28,h*.27),fill=GRASS,width=max(5,int(w*.005)))
    d.line((w*.70,h*.27,w-40,h*.25),fill=GRASS,width=max(5,int(w*.005)))
    bx,by=w*.77,h*.39
    rr(d,(bx-42,by-28,bx+43,by+33),8,(139,81,36,255),(77,49,27,255),2)
    d.text((bx-25,by-15),"X",font=F(max(18,int(w*.022)),True),fill=(30,33,33,255))
    d.text((bx-36,by+39),"Caja",font=F(max(10,int(w*.012)),True),fill=TEXT)
    mx,my=w*.18,h*.64
    for i in range(4): d.rounded_rectangle((mx+i*11,my-i*2,mx+42+i*11,my+13-i*2),4,fill=WOOD,outline=WOODD)
    sx=w*.26
    for i in range(4): d.rectangle((sx+i*12,my-5-(i%2)*7,sx+25+i*12,my+15-(i%2)*7),fill=STONE,outline=ROCKD)
    if not hide_legacy_material_labels:
        d.text((mx,my+22),"Madera",font=F(max(9,int(w*.0105)),True),fill=TEXT)
        d.text((sx,my+22),"Piedra",font=F(max(9,int(w*.0105)),True),fill=TEXT)
    tx,ty=w*.77,h*.13
    poly(d,[(tx-72,ty+20),(tx+110,ty),(tx+128,ty+78),(tx-58,ty+96)],(196,161,106,255),(94,69,43,255),2)
    d.text((tx-24,ty+32),"Terraza",font=F(max(10,int(w*.011)),True),fill=(14,71,61,255))
    d.line((w*.69,h*.31,w*.72,h*.49),fill=ROCKD,width=max(5,int(w*.005)))
    fx,fy=w*.87,h*.59
    d.rounded_rectangle((fx-62,fy-45,fx+70,fy+44),7,fill=(216,188,136,225),outline=(111,78,45,255),width=2)
    for k in range(1,4): d.line((fx-62+k*33,fy-45,fx-62+k*33,fy+44),fill=(255,245,215,110),width=1)
    for k in range(1,3): d.line((fx-62,fy-45+k*30,fx+70,fy-45+k*30),fill=(255,245,215,110),width=1)
    unlocked=state==6
    d.text((fx-50,fy+51),"Parcela libre" if unlocked else "Parcela bloqueada",font=F(max(9,int(w*.0105)),True),fill=TEXT)
    if unlocked: d.rectangle((fx-67,fy-50,fx+75,fy+49),outline=GREEN,width=4)
    for x,y in [(w*.08,h*.18),(w*.28,h*.16),(w*.91,h*.18),(w*.84,h*.29)]: tree(d,x,y,max(.65,w/1400))
    L,R=w*.33,w*.64; ys={"R1":h*.39,"R2":h*.56}; cw=(R-L)/7
    placed={"R1":{"P":set(),"B":set()},"R2":{"P":set(),"B":set()}}
    preview=None; invalid=False
    if state==3: preview=("R1",1)
    if state==4: placed["R1"]["P"]={1,2}; preview=("R1",3); invalid=True
    if state in (5,6): placed["R1"]["P"]={1,2,3,4,5}; placed["R1"]["B"]={3}
    for rn,yy in ys.items():
        d.rounded_rectangle((L-cw*.8,yy-22,L,yy+22),5,fill=(193,165,114,255),outline=ROCKD,width=2)
        d.rounded_rectangle((R,yy-22,R+cw*.8,yy+22),5,fill=(193,165,114,255),outline=ROCKD,width=2)
        d.text((L-6,yy-50),rn,font=F(max(9,int(w*.0105)),True),fill=(241,155,54,255) if rn=="R1" else (255,84,126,255))
        for c in range(1,6):
            x=L+c*cw
            if state in (3,4):
                d.rounded_rectangle((x-cw*.42,yy-20,x+cw*.42,yy+20),4,fill=(255,255,255,16),outline=(225,244,250,115),width=1)
                d.text((x-9,yy-7),f"C{c}",font=F(max(7,int(w*.0075)),True),fill=(232,244,250,175))
            if c in placed[rn]["B"]: d.rectangle((x-16,yy+2,x+16,yy+28),fill=STONE,outline=ROCKD,width=2)
            if c in placed[rn]["P"]: d.rounded_rectangle((x-cw*.43,yy-17,x+cw*.43,yy+2),4,fill=WOOD,outline=WOODD,width=2)
    if preview:
        rn,c=preview; yy=ys[rn]; x=L+c*cw; col=RED if invalid else GREEN
        d.rounded_rectangle((x-cw*.43,yy-20,x+cw*.43,yy+4),5,fill=(*col[:3],70),outline=col,width=3)
    if state in (5,6):
        d.line((L-cw*.5,ys["R1"]-27,R+cw*.5,ys["R1"]-27),fill=(95,239,151,210),width=4)
        ex,ey=w*.69,h*.64
        for i in range(5): d.rectangle((ex+i*10,ey-(i%2)*7,ex+22+i*10,ey+16-(i%2)*7),fill=STONE,outline=ROCKD)
        d.text((ex-2,ey+24),"+12 piedra",font=F(max(9,int(w*.010)),True),fill=TEXT)
    if state==6:
        start=(w*.69,h*.49); mid=(w*.72,h*.40); end=(w*.76,h*.29)
        for a,b in [(start,mid),(mid,end)]:
            for i in range(4):
                t=i/4; x=a[0]+(b[0]-a[0])*t; y=a[1]+(b[1]-a[1])*t
                d.rounded_rectangle((x-19,y-6,x+19,y+8),3,fill=WOOD,outline=WOODD)
    poses={1:(w*.14,h*.49),2:(w*.25,h*.63),3:(w*.35,h*.38),4:(w*.35,h*.38),5:(w*.49,h*.34),6:(w*.76,h*.21)}
    px,py=poses[state]; player(d,px,py,max(.65,w/1100))
    return im

def toolbar(d,w,h,state):
    mobile=w<500; bh=210 if mobile else 160; y=h-bh
    d.rectangle((0,y,w,h),fill=(237,246,251,250))
    mode="Construir" if state in (3,4,6) else "Recorrer"
    title={1:"Reto 1 · Abre la caja",2:"Recoge materiales",3:"Construye un cruce",4:"Comprueba el apoyo",5:"Cruza y abre la caja",6:"Reto 2 · Terraza"}[state]
    d.rectangle((0,0,w,56 if mobile else 64),fill=NAVY)
    d.text((12,15),title,font=F(13 if mobile else 24,True),fill=TEXT)
    mw=82 if mobile else 118; x=w-mw-10
    rr(d,(x,9,w-10,(56 if mobile else 64)-9),11,fill=BLUE if mode=="Recorrer" else PURPLE,outline=(220,238,250,150))
    d.text((x+10,19 if mobile else 18),mode,font=F(10 if mobile else 15,True),fill=TEXT)
    if mode=="Construir":
        pieces=[("Plataforma","1 madera",False),("Bloque","1 piedra",False),("Escalera","2 madera",state<5)]
        gap=5; cw=(w-24-gap*2)//3 if mobile else 180; xx=12
        for name,cost,locked in pieces:
            sel=(state in (3,4) and name=="Plataforma")
            rr(d,(xx,y+12,xx+cw,y+76),10,fill=(221,237,247,255) if not locked else (222,226,229,255),outline=BLUE if sel else (156,184,201,255),width=3 if sel else 1)
            d.text((xx+8,y+22),name,font=F(10 if mobile else 13,True),fill=(18,50,72,255))
            d.text((xx+8,y+47),"Bloq." if locked else cost,font=F(8 if mobile else 11),fill=(80,100,115,255)); xx+=cw+gap
        controls="← ↑ ↓ →  ✓ colocar  ↻ girar  ± altura  ⌫ retirar  ↶ deshacer  ✕ cancelar" if mobile else "WASD/flechas cursor · Enter/Espacio confirmar · R girar · PgUp/PgDn altura · Supr retirar · Ctrl+Z deshacer · Esc cancelar"
        rr(d,(12,y+84,w-12,y+126),9,fill=(226,238,245,255),outline=(167,194,209,255))
        yy=y+94
        for line in wrap(d,controls,F(8 if mobile else 11,True),w-36)[:2]:
            d.text((22,yy),line,font=F(8 if mobile else 11,True),fill=(43,72,91,255)); yy+=16
        ftop=y+134
    else:
        rr(d,(12,y+12,w-12,y+52),9,fill=(226,238,245,255),outline=(167,194,209,255))
        d.text((22,y+24),"← ↑ ↓ → mover  ✓ acción" if mobile else "WASD/flechas mover · Enter/Espacio acción",font=F(9 if mobile else 13,True),fill=(26,61,85,255))
        d.text((14,y+64),"Sin salto. Bloques = soporte; solo escalera cambia de nivel.",font=F(8 if mobile else 11),fill=(77,101,116,255))
        ftop=y+94
    fb={1:("Objetivo","Recoge materiales, construye un cruce y abre la caja.",BLUE),2:("Inventario: 24 madera · 12 piedra","Materiales alcanzables desde Inicio.",GREEN),3:("Posición válida · R1-C1-z1","Previsualizar no consume. Confirmar coloca.",GREEN),4:("Falta apoyo · R1-C3","Máx. 2 plataformas desde banco. Bloque z0.",RED),5:("Ruta 1 completada · caja abierta","5 madera + 1 piedra. +12 piedra. Escalera desbloqueada.",GREEN),6:("Terraza alcanzada · construcción libre","2 escaleras = 4 madera. Parcela libre: materiales ilimitados.",GREEN)}[state]
    box=(12,ftop,w-12,h-10)
    rr(d,box,10,fill=(226,247,234,255) if fb[2]!=RED else (255,231,232,255),outline=fb[2],width=2)
    yy=box[1]+9; col=(24,91,53,255) if fb[2]!=RED else (133,35,43,255)
    for line in wrap(d,fb[0],F(10 if mobile else 15,True),box[2]-box[0]-22)[:2]:
        d.text((box[0]+11,yy),line,font=F(10 if mobile else 15,True),fill=col); yy+=16 if mobile else 21
    yy+=2
    for line in wrap(d,fb[1],F(8 if mobile else 11),box[2]-box[0]-22)[:2]:
        d.text((box[0]+11,yy),line,font=F(8 if mobile else 11),fill=col); yy+=13 if mobile else 17

def frame(vp,state):
    w=vp; h=844 if vp==390 else 900; bh=210 if vp==390 else 160
    sc=scene(w,h-bh,state); art=Image.new("RGBA",(w,h),(255,255,255,255)); art.alpha_composite(sc,(0,0))
    toolbar(ImageDraw.Draw(art,"RGBA"),w,h,state)
    return art.convert("RGB")

names=["F01_OBJETIVO","F02_RECOGIDA","F03_PREVIEW","F04_PROBLEMA","F05_CORRECCION_CRUCE","F06_ESCALERAS_TERRAZA_LIBRE"]
for vp in (390,1440):
    for i,n in enumerate(names,1): frame(vp,i).save(OUT/f"CONSTRUCTION_R02_{n}_{vp}.png",optimize=True)

# Plan
im=Image.new("RGB",(1440,900),(238,247,251)); d=ImageDraw.Draw(im)
d.rectangle((0,0,1440,70),fill=(7,50,82)); d.text((28,17),"El taller de las islas · plano corregido R02",font=F(30,True),fill=(245,249,253))
im.paste(scene(1000,650,1).convert("RGB"),(20,92))
rr(d,(1040,92,1420,780),18,fill=(250,253,254,255),outline=(147,180,199,255),width=2)
d.text((1064,116),"Reglas cerradas con Nexo",font=F(21,True),fill=(15,63,92))
rules=["Dos cruces incompletos al inicio.","Inicio: 24 madera + 12 piedra.","+12 piedra tras primer canal/caja.","Plataforma=1 madera · bloque=1 piedra.","Escalera=2 madera; bloqueada hasta caja.","Bloque=soporte; no se trepa.","Solo escalera cambia de nivel.","Máx.2 plataformas desde apoyo sólido.","Cursor máx.2 casillas desde posición recorrible.","Una pieza por celda (ruta,columna,z).","Retirar devuelve coste.","Inválida no consume."]
y=160
for item in rules: d.text((1064,y),"• "+item,font=F(13),fill=(39,70,89)); y+=38
im.save(OUT/"CONSTRUCTION_R02_PLAN_ESCENARIO_1440.png",optimize=True)

# Two valid solutions, with explicit coordinates / costs / sequence.
solutions={"A":{"route":"R1","blocks":[3],"cost":"5 madera + 1 piedra","seq":"P1 → caminar C1 → P2 → caminar C2 → B3 → P3 → caminar C3 → P4 → caminar C4 → P5 → destino"},"B":{"route":"R2","blocks":[2,4],"cost":"5 madera + 2 piedra","seq":"B2 → P1 → caminar C1 → P2 → caminar C2 → B4 → P3 → caminar C3 → P4 → caminar C4 → P5 → destino"}}
for key,s in solutions.items():
    for vp in (390,1440):
        w=vp; h=844 if vp==390 else 900; mob=vp==390
        im=Image.new("RGB",(w,h),(239,247,251)); d=ImageDraw.Draw(im)
        d.rectangle((0,0,w,64 if mob else 76),fill=(7,50,82)); d.text((14,16),f"Solución {key} · {s['route']}",font=F(19 if mob else 30,True),fill=(245,249,253))
        L=20 if mob else 90; R=w-20 if mob else w-90; y=250 if mob else 330; cw=(R-L)/7
        d.text((L,92 if mob else 116),f"Coste: {s['cost']} · 0 escaleras",font=F(13 if mob else 20,True),fill=(15,64,93))
        d.text((L,124 if mob else 158),"Plataformas C1–C5 a z1 · bloques a z0",font=F(10 if mob else 15),fill=(50,80,98))
        for c in [0,6]:
            x=L+c*cw; d.rectangle((x-cw*.38,y-34,x+cw*.38,y+40),fill=ROCK,outline=ROCKD,width=2)
        d.rectangle((L+cw*.5,y-10,R-cw*.5,y+55),fill=(53,169,207,100))
        for c in s["blocks"]:
            x=L+c*cw; d.rectangle((x-cw*.25,y+6,x+cw*.25,y+46),fill=STONE,outline=ROCKD,width=2)
        for c in range(1,6):
            x=L+c*cw; d.rounded_rectangle((x-cw*.43,y-25,x+cw*.43,y+2),5,fill=WOOD,outline=WOODD,width=2); d.text((x-10,y-47),f"C{c}",font=F(10 if mob else 13,True),fill=(26,68,95))
        sy=y+100; d.text((L,sy),"Secuencia válida:",font=F(12 if mob else 18,True),fill=(15,64,93)); sy+=28
        for line in wrap(d,s["seq"],F(9 if mob else 13),R-L):
            d.text((L,sy),line,font=F(9 if mob else 13),fill=(47,75,94)); sy+=20 if mob else 28
        for p in ["✓ apoyo ≤2","✓ cursor ≤2","✓ bloques no se recorren","✓ sin escalera antes de caja"]:
            d.text((L,sy),p,font=F(10 if mob else 14),fill=(27,96,56)); sy+=28 if mob else 36
        im.save(OUT/f"CONSTRUCTION_R02_SOLUTION_{key}_{vp}.png",optimize=True)

# Contact sheets
for vp in (390,1440):
    ims=[Image.open(OUT/f"CONSTRUCTION_R02_{n}_{vp}.png").convert("RGB") for n in names]
    tw=250 if vp==390 else 430; thumbs=[ImageOps.contain(x,(tw,9999)) for x in ims]; gap=18; m=24; head=62
    W=m*2+3*tw+2*gap; H=head+m+2*thumbs[0].height+gap+m
    sh=Image.new("RGB",(W,H),(235,241,245)); sd=ImageDraw.Draw(sh)
    sd.text((m,16),f"El taller de las islas · R02 · {vp}",font=F(23,True),fill=(12,43,65))
    for i,x in enumerate(thumbs): sh.paste(x,(m+(i%3)*(tw+gap),head+m+(i//3)*(x.height+gap)))
    sh.save(OUT/f"CONTACT_SHEET_CONSTRUCTION_R02_{vp}.png",optimize=True)

(OUT/"README_R02.txt").write_text("PRISMA CONSTRUCTION R01 STORYBOARD R02\nGate: PRISMA_CONSTRUCTION_R01_STORYBOARD_READY_FOR_AXIOMA\nNO CODE · NO RUNTIME · NO MAIN\nPlayer visual here is a provisional proxy; final target is María's supplied female 3D FBX.\n",encoding="utf-8")
(OUT/"ASSET_INVENTORY.md").write_text("Final later: female 3D player, islands/water, toolbox, material piles, extra stone cache, platform/block/stair, terrace/free parcel, player animations, build cursor/focus/valid-invalid and touch/keyboard icons.\n",encoding="utf-8")
manifest={"version":"R02","gate":"PRISMA_CONSTRUCTION_R01_STORYBOARD_READY_FOR_AXIOMA","frames_390":[f"CONSTRUCTION_R02_{n}_390.png" for n in names],"frames_1440":[f"CONSTRUCTION_R02_{n}_1440.png" for n in names],"solutions":["A","B"],"main_modified":False,"runtime":False}
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")

zip_path=ROOT/"PRISMA_CONSTRUCTION_R01_STORYBOARD_R02.zip"
# deterministic archive timestamps
with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(OUT.iterdir()):
        zi=zipfile.ZipInfo(p.name,date_time=(2026,10,5,12,0,0)); zi.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(zi,p.read_bytes())
sha=hashlib.sha256(zip_path.read_bytes()).hexdigest()
(ROOT/"PRISMA_CONSTRUCTION_R01_STORYBOARD_R02.sha256").write_text(f"{sha}  PRISMA_CONSTRUCTION_R01_STORYBOARD_R02.zip\n")
print(f"PACKAGE={zip_path}")
print(f"SHA256={sha}")
print(f"FILES={len(list(OUT.iterdir()))}")
