#!/usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageCms
from pathlib import Path
import runpy, json, zipfile, hashlib, math, shutil

ROOT = Path(__file__).resolve().parents[1]
BASE_SCRIPT = ROOT / "scripts" / "build_prisma_construction_r02_storyboard.py"
ctx = runpy.run_path(str(BASE_SCRIPT))
scene = ctx["scene"]
F = ctx["F"]
wrap = ctx["wrap"]
rr = ctx["rr"]
NAVY = ctx["NAVY"]
TEXT = ctx["TEXT"]
SAND = ctx["SAND"]
WOOD = ctx["WOOD"]
WOODD = ctx["WOODD"]
STONE = ctx["STONE"]
ROCKD = ctx["ROCKD"]
BLUE = ctx["BLUE"]
GREEN = ctx["GREEN"]
RED = ctx["RED"]
PURPLE = ctx["PURPLE"]

OUT = ROOT / "artifacts" / "construction-r02-patch-p06"
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True, exist_ok=True)

PATCH_ZIP = ROOT / "PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06.zip"
PATCH_SHA = ROOT / "PRISMA_CONSTRUCTION_R01_STORYBOARD_R02_PATCH_P06.sha256"
SRGB = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()

DARK = (18,45,62,255)
CARD = (239,247,251,255)
SOFT = (221,237,247,255)
FOCUS = (20,20,20,255)
SELECT = (20,84,126,255)
WARN = (125,34,43,255)

def save_png(im, path):
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    im.save(path, format="PNG", optimize=True, icc_profile=SRGB)

def luminance(rgb):
    out=[]
    for c in rgb[:3]:
        x=c/255.0
        out.append(x/12.92 if x <= 0.04045 else ((x+0.055)/1.055)**2.4)
    return .2126*out[0] + .7152*out[1] + .0722*out[2]

def contrast_ratio(a,b):
    la,lb=luminance(a),luminance(b)
    return (max(la,lb)+.05)/(min(la,lb)+.05)

CONTRAST = {
    "white_on_navy": round(contrast_ratio((245,249,253), (6,39,66)),2),
    "dark_on_sand": round(contrast_ratio((18,45,62), (228,200,147)),2),
    "white_on_route_badge": round(contrast_ratio((245,249,253), (20,53,74)),2),
    "dark_on_light_control": round(contrast_ratio((18,50,72), (221,237,247)),2),
    "plus12_stone_text_on_badge": round(contrast_ratio((245,249,253), (20,53,74)),2),
}
assert min(CONTRAST.values()) >= 4.5, CONTRAST

def dims(vp):
    return {320:(320,720),390:(390,844),1440:(1440,900)}[vp]

def toolbar_h(vp):
    return 316 if vp in (320,390) else 210

def badge(d, box, text, font, fg=(245,249,253,255), bg=(20,53,74,245), outline=(245,249,253,130)):
    d.rounded_rectangle(box, radius=max(4,int((box[3]-box[1])*.2)), fill=bg, outline=outline, width=1)
    tb=d.textbbox((0,0),text,font=font)
    x=box[0]+(box[2]-box[0]-(tb[2]-tb[0]))/2
    y=box[1]+(box[3]-box[1]-(tb[3]-tb[1]))/2-1
    d.text((x,y),text,font=font,fill=fg)

def _badge_size(d,text,font,pad_x=8,height=24):
    tb=d.textbbox((0,0),text,font=font)
    return (tb[2]-tb[0])+2*pad_x, height

def _clamp_box(box,min_x,max_x):
    x1,y1,x2,y2=box
    width=x2-x1
    if x1 < min_x:
        x1=min_x; x2=x1+width
    if x2 > max_x:
        x2=max_x; x1=x2-width
    return (x1,y1,x2,y2)

def _boxes_overlap(a,b):
    return max(0,min(a[2],b[2])-max(a[0],b[0])) * max(0,min(a[3],b[3])-max(a[1],b[1]))

def _material_badge_boxes(d,w,h,font):
    mx,my=w*.18,h*.64
    sx=w*.26
    mw,mh=_badge_size(d,"Madera",font,pad_x=8,height=24)
    sw,sh=_badge_size(d,"Piedra",font,pad_x=8,height=24)
    gap=max(6,int(w*.018))
    center=(mx+sx)/2
    total=mw+gap+sw
    left=max(8,min(center-total/2,w-8-total))
    y=my+17
    return (left,y,left+mw,y+mh),(left+mw+gap,y,left+mw+gap+sw,y+sh)

def _parcel_badge_box(d,w,h,font,label,state=None):
    fx,fy=w*.87,h*.59
    bw,bh=_badge_size(d,label,font,pad_x=9,height=25)
    # F05/F06 include +12 piedra at its original text position; place parcel status
    # one row lower so both labels remain fully readable.
    y=fy+(78 if state in (5,6) else 48)
    box=(fx-bw/2,y,fx+bw/2,y+bh)
    return _clamp_box(box,8,w-8)

def _plus12_badge_box(d,w,h,font):
    ex,ey=w*.69,h*.64
    bw,bh=_badge_size(d,"+12 piedra",font,pad_x=8,height=24)
    return _clamp_box((ex-5,ey+19,ex-5+bw,ey+19+bh),8,w-8)

def patched_scene(w,h,state):
    im=scene(w,h,state)
    d=ImageDraw.Draw(im,"RGBA")
    L,R=w*.33,w*.64
    ys={"R1":h*.39,"R2":h*.56}
    for rn,yy in ys.items():
        bh=max(22,int(w*.025))
        badge(d,(L-15,yy-59,L+40,yy-59+bh),rn,F(max(9,int(w*.0105)),True))
    small=F(max(8,int(w*.009)),True)
    wood_box,stone_box=_material_badge_boxes(d,w,h,small)
    assert _boxes_overlap(wood_box,stone_box)==0
    badge(d,wood_box,"Madera",small)
    badge(d,stone_box,"Piedra",small)
    bx,by=w*.77,h*.39
    badge(d,(bx-42,by+36,bx+43,by+60),"Caja",small)
    label="Parcela libre" if state==6 else "Parcela bloqueada"
    # Mask the legacy low-contrast parcel label drawn by the audited base before
    # placing the corrected P06 badge. This keeps the patch local and avoids duplicate copy.
    fx,fy=w*.87,h*.59
    legacy_font=F(max(9,int(w*.0105)),True)
    legacy_box=d.textbbox((fx-50,fy+51),label,font=legacy_font)
    d.rectangle((legacy_box[0]-2,legacy_box[1]-2,legacy_box[2]+2,legacy_box[3]+2),fill=SAND)
    parcel_box=_parcel_badge_box(d,w,h,small,label,state)
    assert parcel_box[0] >= 8 and parcel_box[2] <= w-8
    badge(d,parcel_box,label,small)
    if state in (5,6):
        plus_box=_plus12_badge_box(d,w,h,small)
        assert _boxes_overlap(plus_box,parcel_box)==0
        badge(d,plus_box,"+12 piedra",small)
    return im

def touch_button(d,box,symbol,caption="",selected=False,focused=False,disabled=False):
    x1,y1,x2,y2=box
    assert x2-x1 >= 44 and y2-y1 >= 44
    fill=(214,229,238,255) if not selected else (189,222,240,255)
    if disabled: fill=(226,229,232,255)
    outline=SELECT if selected else (125,156,175,255)
    d.rounded_rectangle(box,10,fill=fill,outline=outline,width=3 if selected else 1)
    if selected:
        d.text((x1+5,y1+3),"✓",font=F(10,True),fill=DARK)
    if focused:
        # P05: independent focus ring. It may surround a control that is NOT selected.
        d.rounded_rectangle((x1-3,y1-3,x2+3,y2+3),12,outline=FOCUS,width=3)
        d.text((x2-28,y1+3),"FOCO",font=F(6,True),fill=FOCUS)
    sym_font=F(15 if (x2-x1)<=48 else 13,True)
    tb=d.textbbox((0,0),symbol,font=sym_font)
    d.text((x1+(x2-x1-(tb[2]-tb[0]))/2,y1+10),symbol,font=sym_font,fill=DARK if not disabled else (105,110,114,255))
    if caption:
        cap=caption[:10]
        cf=F(6 if (x2-x1)<=48 else 7,True)
        tb=d.textbbox((0,0),cap,font=cf)
        d.text((x1+(x2-x1-(tb[2]-tb[0]))/2,y2-13),cap,font=cf,fill=DARK if not disabled else (105,110,114,255))

def piece_button(d,box,name,cost,selected=False,focused=False,disabled=False):
    x1,y1,x2,y2=box
    assert x2-x1>=44 and y2-y1>=44
    fill=(221,237,247,255) if not disabled else (228,230,232,255)
    d.rounded_rectangle(box,9,fill=fill,outline=SELECT if selected else (125,156,175,255),width=3 if selected else 1)
    if selected:
        d.text((x1+5,y1+4),"✓",font=F(10,True),fill=DARK)
    if focused:
        d.rounded_rectangle((x1-3,y1-3,x2+3,y2+3),11,outline=FOCUS,width=3)
        d.text((x2-28,y1+3),"FOCO",font=F(6,True),fill=FOCUS)
    label=("P" if name=="Plataforma" else "B" if name=="Bloque" else "E")+" · "+name
    d.text((x1+8,y1+14),label,font=F(8,True),fill=DARK)
    d.text((x1+8,y1+32),"Bloq." if disabled else cost,font=F(7),fill=(52,75,90,255))

def feedback_data(state):
    return {
        1:("Objetivo","Recoge materiales, construye un cruce y abre la caja.",BLUE),
        2:("Inventario: 24 madera · 12 piedra","Materiales alcanzables desde Inicio.",GREEN),
        3:("Posición válida · R1-C1-z1","Previsualizar no consume. Confirmar coloca.",GREEN),
        4:("Falta apoyo · R1-C3","Máx. 2 plataformas desde banco. Bloque z0.",RED),
        5:("Ruta 1 completada · caja abierta","5 madera + 1 piedra. +12 piedra. Escalera desbloqueada.",GREEN),
        6:("Terraza alcanzada · construcción libre","2 escaleras = 4 madera. Parcela libre: materiales ilimitados.",GREEN),
    }[state]

def draw_feedback(d,box,state,mobile):
    title,body,status=feedback_data(state)
    bg=(226,247,234,255) if status != RED else (255,231,232,255)
    fg=(24,91,53,255) if status != RED else WARN
    d.rounded_rectangle(box,10,fill=bg,outline=status,width=2)
    y=box[1]+8
    title_font=F(9 if mobile else 14,True)
    body_font=F(7 if mobile else 10)
    maxw=box[2]-box[0]-18
    for line in wrap(d,title,title_font,maxw)[:2]:
        d.text((box[0]+9,y),line,font=title_font,fill=fg)
        y += 14 if mobile else 19
    y += 1
    for line in wrap(d,body,body_font,maxw)[:3]:
        d.text((box[0]+9,y),line,font=body_font,fill=fg)
        y += 12 if mobile else 15
    assert y <= box[3], (state,box,y)

def draw_header(d,w,state,mobile):
    hh=64 if mobile else 70
    d.rectangle((0,0,w,hh),fill=NAVY)
    short={1:"Reto 1",2:"Recoge",3:"Construye",4:"Apoyo",5:"Caja abierta",6:"Reto 2"}[state]
    full={1:"Reto 1 · Abre la caja",2:"Recoge materiales",3:"Construye un cruce",4:"Comprueba el apoyo",5:"Cruza y abre la caja",6:"Reto 2 · Terraza"}[state]
    title=short if mobile else full
    mode="Construir" if state in (3,4,6) else "Recorrer"
    boxw=94 if mobile else 126
    bx1=w-boxw-8
    d.text((10,20 if mobile else 18),title,font=F(15 if mobile else 24,True),fill=TEXT)
    # P04: 48 px high mode target.
    d.rounded_rectangle((bx1,8,w-8,56),11,fill=PURPLE if mode=="Construir" else BLUE,outline=(245,249,253,180),width=2)
    mf=F(9 if mobile else 14,True)
    tb=d.textbbox((0,0),mode,font=mf)
    d.text((bx1+(boxw-(tb[2]-tb[0]))/2,24 if mobile else 22),mode,font=mf,fill=TEXT)

def patched_toolbar(d,w,h,state):
    mobile=w<500
    bh=toolbar_h(w)
    y=h-bh
    d.rectangle((0,y,w,h),fill=(239,247,251,255))
    draw_header(d,w,state,mobile)
    mode="Construir" if state in (3,4,6) else "Recorrer"
    if mobile:
        pad=8
        if mode=="Construir":
            gap=5
            pw=(w-2*pad-2*gap)//3
            py=y+10
            selected="Plataforma" if state in (3,4) else "Escalera"
            focus="Bloque" if state==3 else selected
            pieces=[("Plataforma","1 madera",False),("Bloque","1 piedra",False),("Escalera","2 madera",state<5)]
            x=pad
            for name,cost,locked in pieces:
                piece_button(d,(x,py,x+pw,py+52),name,cost,selected=name==selected,focused=name==focus,disabled=locked)
                x += pw+gap
            btn=44 if w==320 else 48
            roww=5*btn+4*5
            x0=(w-roww)//2
            y1=py+62
            for i,(sym,cap) in enumerate([("←","izq"),("↑","arr"),("↓","abj"),("→","der"),("✓","colocar")]):
                touch_button(d,(x0+i*(btn+5),y1,x0+i*(btn+5)+btn,y1+48),sym,cap,focused=(state==4 and sym=="✓"))
            btn2=44 if w==320 else 48
            gap2=4
            roww=6*btn2+5*gap2
            x0=(w-roww)//2
            y2=y1+58
            acts=[("↻","girar"),("Z+","subir"),("Z−","bajar"),("⌫","retirar"),("↶","deshacer"),("✕","cancelar")]
            for i,(sym,cap) in enumerate(acts):
                touch_button(d,(x0+i*(btn2+gap2),y2,x0+i*(btn2+gap2)+btn2,y2+48),sym,cap)
            fb_top=y2+58
        else:
            btn=48 if w>=390 else 44
            gap=6
            roww=5*btn+4*gap
            x0=(w-roww)//2
            y1=y+20
            for i,(sym,cap) in enumerate([("←","izq"),("↑","arr"),("↓","abj"),("→","der"),("✓","acción")]):
                touch_button(d,(x0+i*(btn+gap),y1,x0+i*(btn+gap)+btn,y1+48),sym,cap)
            d.text((12,y1+58),"Sin salto · bloques = soporte · solo escalera cambia de nivel.",font=F(7,True),fill=DARK)
            fb_top=y1+82
        draw_feedback(d,(8,fb_top,w-8,h-8),state,True)
    else:
        py=y+12
        if mode=="Construir":
            selected="Plataforma" if state in (3,4) else "Escalera"
            focus="Bloque" if state==3 else selected
            x=18
            for name,cost,locked in [("Plataforma","1 madera",False),("Bloque","1 piedra",False),("Escalera","2 madera",state<5)]:
                piece_button(d,(x,py,x+190,py+56),name,cost,selected=name==selected,focused=name==focus,disabled=locked)
                x += 204
            d.text((650,py+8),"Teclado: flechas/WASD cursor · Enter/Espacio colocar · R girar",font=F(12,True),fill=DARK)
            d.text((650,py+31),"PgUp/PgDn altura · Supr retirar · Ctrl+Z deshacer · Esc cancelar",font=F(11),fill=DARK)
            fb_top=py+68
        else:
            d.rounded_rectangle((18,py,620,py+52),10,fill=SOFT,outline=(125,156,175,255),width=1)
            d.text((32,py+17),"WASD/flechas mover · Enter/Espacio acción · sin salto",font=F(13,True),fill=DARK)
            fb_top=py+64
        # P01: fixed safe feedback region; no clipping in F03/F04/F06 or any other frame.
        draw_feedback(d,(18,fb_top,w-18,h-12),state,False)

def frame(vp,state):
    w,h=dims(vp)
    bh=toolbar_h(vp)
    sc=patched_scene(w,h-bh,state)
    art=Image.new("RGBA",(w,h),(255,255,255,255))
    art.alpha_composite(sc,(0,0))
    patched_toolbar(ImageDraw.Draw(art,"RGBA"),w,h,state)
    return art

def verify_p06_geometry():
    result={"criterion":"P06 scoped retest","viewports":{}}
    all_overlap_zero=True
    all_parcel_inside=True
    for vp in (320,390,1440):
        w,h=dims(vp)
        scene_h=h-toolbar_h(vp)
        measure=ImageDraw.Draw(Image.new("RGBA",(w,scene_h),(0,0,0,0)),"RGBA")
        small=F(max(8,int(w*.009)),True)
        wood_box,stone_box=_material_badge_boxes(measure,w,scene_h,small)
        overlap=_boxes_overlap(wood_box,stone_box)
        parcel_blocked=_parcel_badge_box(measure,w,scene_h,small,"Parcela bloqueada",5)
        parcel_free=_parcel_badge_box(measure,w,scene_h,small,"Parcela libre",6)
        inside=lambda b: b[0] >= 8 and b[2] <= w-8 and b[1] >= 0 and b[3] <= scene_h
        plus_box=_plus12_badge_box(measure,w,scene_h,small)
        all_overlap_zero = all_overlap_zero and overlap == 0
        all_parcel_inside = all_parcel_inside and inside(parcel_blocked) and inside(parcel_free)
        result["viewports"][str(vp)]={
            "material_badges":{"madera":list(wood_box),"piedra":list(stone_box),"overlap_area":overlap},
            "parcel":{"blocked":list(parcel_blocked),"free":list(parcel_free),"blocked_inside":inside(parcel_blocked),"free_inside":inside(parcel_free)},
            "plus12_piedra":{"box":list(plus_box),"contrast":CONTRAST["plus12_stone_text_on_badge"],
                               "overlap_with_blocked_parcel":_boxes_overlap(plus_box,parcel_blocked),
                               "overlap_with_free_parcel":_boxes_overlap(plus_box,parcel_free)}
        }
    result["material_badges_overlap"]=0 if all_overlap_zero else 1
    result["parcel_badge_inside_bounds"]=bool(all_parcel_inside)
    result["plus12_piedra_contrast"]=CONTRAST["plus12_stone_text_on_badge"]
    assert result["material_badges_overlap"] == 0
    assert result["parcel_badge_inside_bounds"] is True
    assert result["plus12_piedra_contrast"] >= 4.5
    for v in result["viewports"].values():
        assert v["plus12_piedra"]["overlap_with_blocked_parcel"] == 0
        assert v["plus12_piedra"]["overlap_with_free_parcel"] == 0
    return result

NAMES=["F01_OBJETIVO","F02_RECOGIDA","F03_PREVIEW","F04_PROBLEMA","F05_CORRECCION_CRUCE","F06_ESCALERAS_TERRAZA_LIBRE"]
for vp in (320,390,1440):
    for i,n in enumerate(NAMES,1):
        save_png(frame(vp,i),OUT/f"CONSTRUCTION_R02_PATCH_{n}_{vp}.png")

P06_ASSERTIONS=verify_p06_geometry()
(OUT/"P06_ASSERTIONS.json").write_text(json.dumps(P06_ASSERTIONS,indent=2,ensure_ascii=False),encoding="utf-8")

def solution_image(vp,key):
    w,h=dims(vp)
    im=Image.new("RGBA",(w,h),(239,247,251,255))
    d=ImageDraw.Draw(im,"RGBA")
    mobile=vp<500
    d.rectangle((0,0,w,64 if mobile else 76),fill=NAVY)
    route="R1" if key=="A" else "R2"
    cost="5 madera + 1 piedra" if key=="A" else "5 madera + 2 piedra"
    blocks=[3] if key=="A" else [2,4]
    d.text((12,18),f"Solución {key} · {route}",font=F(18 if mobile else 30,True),fill=TEXT)
    L=18 if mobile else 90; R=w-18 if mobile else w-90
    yy=230 if mobile else 330; cw=(R-L)/7
    d.text((L,92 if mobile else 120),f"Coste: {cost} · 0 escaleras",font=F(11 if mobile else 20,True),fill=DARK)
    d.text((L,120 if mobile else 160),"P C1–C5 = z1 · bloques = z0",font=F(9 if mobile else 15),fill=DARK)
    for c in [0,6]:
        x=L+c*cw
        d.rectangle((x-cw*.38,yy-30,x+cw*.38,yy+42),fill=(137,130,111,255),outline=ROCKD,width=2)
    for c in blocks:
        x=L+c*cw
        d.rectangle((x-cw*.25,yy+4,x+cw*.25,yy+44),fill=STONE,outline=ROCKD,width=2)
    for c in range(1,6):
        x=L+c*cw
        d.rounded_rectangle((x-cw*.43,yy-24,x+cw*.43,yy+2),5,fill=WOOD,outline=WOODD,width=2)
        badge(d,(x-22,yy-55,x+22,yy-31),f"C{c}",F(8,True))
    seq=("P1 → C1 → P2 → C2 → B3 → P3 → C3 → P4 → C4 → P5 → destino"
         if key=="A" else
         "B2 → P1 → C1 → P2 → C2 → B4 → P3 → C3 → P4 → C4 → P5 → destino")
    sy=yy+92
    d.text((L,sy),"Secuencia válida:",font=F(11 if mobile else 18,True),fill=DARK); sy+=27
    for line in wrap(d,seq,F(8 if mobile else 13),R-L):
        d.text((L,sy),line,font=F(8 if mobile else 13),fill=DARK); sy+=18 if mobile else 27
    for p in ["✓ apoyo ≤2","✓ cursor ≤2","✓ bloques no recorribles","✓ sin escalera antes de caja"]:
        d.text((L,sy),p,font=F(9 if mobile else 14,True),fill=(24,91,53,255)); sy+=25 if mobile else 34
    return im

for key in ("A","B"):
    for vp in (320,390,1440):
        save_png(solution_image(vp,key),OUT/f"CONSTRUCTION_R02_PATCH_SOLUTION_{key}_{vp}.png")

def micro_remove_undo(vp):
    w,h=dims(vp)
    im=Image.new("RGBA",(w,h),(239,247,251,255))
    d=ImageDraw.Draw(im,"RGBA")
    d.rectangle((0,0,w,68 if vp<500 else 78),fill=NAVY)
    d.text((12,18),"Retirar · dependencias · deshacer",font=F(15 if vp<500 else 27,True),fill=TEXT)
    steps=[
        ("1 · Retirar B3","BLOQUEADO","B3 sostiene P3/P4/P5. Piezas e inventario no cambian.","Foco/cursor: B3 · 19 madera · 23 piedra",RED),
        ("2 · Acción válida","COLOCAR P1","R2-C1-z1 se coloca. Coste: 1 madera.","Selected: Plataforma · foco: R2-C1 · 18 madera",GREEN),
        ("3 · Deshacer","RESTAURADO","Ctrl+Z / Deshacer retira P1 y devuelve 1 madera.","Foco vuelve a R2-C1 · 19 madera · 23 piedra",BLUE),
    ]
    if vp<500:
        top=82; gap=10; ph=(h-top-16-2*gap)//3
        boxes=[(8,top+i*(ph+gap),w-8,top+i*(ph+gap)+ph) for i in range(3)]
    else:
        top=105; gap=18; pw=(w-36-2*gap)//3
        boxes=[(18+i*(pw+gap),top,18+i*(pw+gap)+pw,h-24) for i in range(3)]
    for (title,status,body,foot,col),box in zip(steps,boxes):
        d.rounded_rectangle(box,14,fill=(255,255,255,255),outline=col,width=3)
        d.text((box[0]+12,box[1]+14),title,font=F(11 if vp<500 else 18,True),fill=DARK)
        badge(d,(box[0]+12,box[1]+43,box[0]+128 if vp<500 else box[0]+170,box[1]+72 if vp<500 else box[1]+80),status,F(8 if vp<500 else 12,True),bg=(20,53,74,255))
        yy=box[1]+82 if vp<500 else box[1]+102
        for line in wrap(d,body,F(8 if vp<500 else 13),box[2]-box[0]-24):
            d.text((box[0]+12,yy),line,font=F(8 if vp<500 else 13),fill=DARK); yy+=16 if vp<500 else 24
        yy += 8
        for line in wrap(d,foot,F(8 if vp<500 else 12,True),box[2]-box[0]-24):
            d.text((box[0]+12,yy),line,font=F(8 if vp<500 else 12,True),fill=DARK); yy+=16 if vp<500 else 22
    return im

for vp in (320,390,1440):
    save_png(micro_remove_undo(vp),OUT/f"CONSTRUCTION_R02_PATCH_MICRO_REMOVE_UNDO_{vp}.png")

matrix = """# P08 · Matriz de movimiento y forced-colors

| Acción/estado | NORMAL | REDUCED | NONE | Forced-colors |
|---|---|---|---|---|
| Recorrer | desplazamiento suave + feedback textual | transición breve, no flotante | cambio instantáneo | borde del sistema + texto de modo |
| Cambiar a Construir | transición corta | no espacial | instantánea | texto «Construir» + borde |
| Preview válido | transición visual + texto | aparición breve | instantánea | borde + texto «Posición válida» |
| Preview inválido | feedback + texto | sin sacudidas | instantáneo | borde + texto «Falta apoyo» |
| Selected | persistente hasta cambio explícito | igual | igual | ✓ + borde; no depende de color |
| Focus | outline independiente; puede estar sobre control no seleccionado | igual | igual | outline del sistema; nunca mueve foco al feedback |
| R1/R2 | badges textuales | igual | igual | R1/R2 siempre visibles como texto |
| Colocar | confirmación breve + inventario | breve/no espacial | instantánea | texto de resultado |
| Retirar bloque con dependientes | bloqueo + motivo | sin animación espacial | instantáneo | texto de motivo; estado no cambia |
| Deshacer | restaura estado/inventario | breve/no espacial | instantáneo | texto «Restaurado» |
| Recorrer/Construir | target >=44×44 | igual | igual | texto/símbolo + borde |

Regla: ninguna información, regla, éxito, error o acción depende de animación ni del color.
"""
(OUT/"MOTION_FORCED_COLORS_MATRIX.md").write_text(matrix,encoding="utf-8")

p06_result = """# PRISMA · CONSTRUCCIÓN R02 · PATCH P06

Alcance único: corregir las tres incidencias P06 del retest de Axioma. P01–P05 y P07–P08 se conservan sin reabrir.

| ID | Corrección | Evidencia |
|---|---|---|
| P06-A | Madera/Piedra separados por ancho real + gap explícito | F01–F06 320/390/1440; P06_ASSERTIONS.json: material_badges_overlap=0 |
| P06-B | Parcela bloqueada/libre clamped con margen interior | F01–F05 bloqueada + F06 libre, 320/390/1440; parcel_badge_inside_bounds=true |
| P06-C | +12 piedra sobre badge oscuro contrastante | F05/F06 320/390/1440; CONTRAST_MEASUREMENTS.json + P06_ASSERTIONS.json >=4.5:1 |

No cambia concepto, A/B, costes, apoyo/alcance, controles touch, focus/selected ni matriz de movimiento.
NO CODE · NO RUNTIME · NO MAIN.
"""
(OUT/"PATCH_P06_RESULT.md").write_text(p06_result,encoding="utf-8")


evidence = {
  "patch":"P06-only follow-up",
  "source_audited_zip_sha256":"5aa0705b2a186681f223ab50d019ae1c1d167b2f66464001c1d8b2b08c282c1e",
  "source_axioma_gate":"AXIOMA_CONSTRUCTION_R01_R02_REWORK_REQUIRED",
  "status":"PRISMA_CONSTRUCTION_R01_R02_P06_PATCH_READY_FOR_AXIOMA_RETEST",
  "targets":{"minimum_css_px":44,"mode_switch_height_px":48,"touch_buttons_min_px":44},
  "focus_selected":{
    "selected":"persistent; checkmark + selected border",
    "focus":"independent outline; F03 focuses Bloque while Plataforma remains selected",
    "after_place":"focus remains on acted cell/control",
    "after_error":"focus remains at attempted action; feedback does not steal focus",
    "after_undo":"focus returns to restored action location"
  },
  "contrast_ratios":CONTRAST,
  "p01":["CONSTRUCTION_R02_PATCH_F01_OBJETIVO_1440.png","CONSTRUCTION_R02_PATCH_F02_RECOGIDA_1440.png","CONSTRUCTION_R02_PATCH_F03_PREVIEW_1440.png","CONSTRUCTION_R02_PATCH_F04_PROBLEMA_1440.png","CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_1440.png","CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_1440.png"],
  "p02":[f"CONSTRUCTION_R02_PATCH_{n}_320.png" for n in NAMES],
  "p03":["CONSTRUCTION_R02_PATCH_F03_PREVIEW_320.png","CONSTRUCTION_R02_PATCH_F03_PREVIEW_390.png"],
  "p04":["CONSTRUCTION_R02_PATCH_F03_PREVIEW_320.png","CONSTRUCTION_R02_PATCH_F03_PREVIEW_390.png"],
  "p05":["CONSTRUCTION_R02_PATCH_F03_PREVIEW_320.png","CONSTRUCTION_R02_PATCH_F03_PREVIEW_390.png"],
  "p06":["P06_ASSERTIONS.json","CONTRAST_MEASUREMENTS.json","PATCH_P06_RESULT.md","CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_320.png","CONSTRUCTION_R02_PATCH_F05_CORRECCION_CRUCE_390.png","CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_320.png","CONSTRUCTION_R02_PATCH_F06_ESCALERAS_TERRAZA_LIBRE_390.png"],
  "p07":["CONSTRUCTION_R02_PATCH_MICRO_REMOVE_UNDO_320.png","CONSTRUCTION_R02_PATCH_MICRO_REMOVE_UNDO_390.png","CONSTRUCTION_R02_PATCH_MICRO_REMOVE_UNDO_1440.png"],
  "p08":["MOTION_FORCED_COLORS_MATRIX.md"]
}
(OUT/"PATCH_EVIDENCE_P01_P08.json").write_text(json.dumps(evidence,indent=2,ensure_ascii=False),encoding="utf-8")
(OUT/"CONTRAST_MEASUREMENTS.json").write_text(json.dumps({"criterion":"WCAG 2.x normal text >= 4.5:1 for Axioma retest","ratios":CONTRAST},indent=2),encoding="utf-8")

readme = """# PRISMA · CONSTRUCCIÓN R01 · R02 · PATCH P01–P08

Issue #369. Fuente: orden Nexo post-Axioma.
Base auditada: ZIP SHA-256 5aa0705b2a186681f223ab50d019ae1c1d167b2f66464001c1d8b2b08c282c1e.
No se reabre lógica A/B, materiales, apoyo, alcance ni costes ya validados por Axioma.

Estado Prisma:
PRISMA_CONSTRUCTION_R01_R02_PATCH_READY_FOR_AXIOMA_RETEST

P01: feedback 1440 reservado e íntegro en F01–F06.
P02: F01–F06 nuevos a 320.
P03: controles touch dibujados como targets: D-pad, colocar, girar, Z+/Z−, retirar, deshacer, cancelar.
P04: target mínimo interno 44×44; Recorrer/Construir = 48 px alto.
P05: selected = check + borde persistente; focus = outline independiente. F03 demuestra Plataforma selected con Bloque focused.
P06: R1/R2 y labels de arena usan badges/texto con contraste >=4.5:1; medición en CONTRAST_MEASUREMENTS.json.
P07: microsecuencia retirada/dependencias/deshacer en 320/390/1440.
P08: matriz NORMAL/REDUCED/NONE + forced-colors.

Focus:
- colocar: permanece en la acción/celda;
- error: permanece en intento; feedback no recibe foco;
- deshacer: vuelve a la ubicación restaurada.

Player: proxy 2D del storyboard. El FBX femenino aportado por María sigue pendiente de implementación; NO se simula integrado.

NO CODE · NO RUNTIME · NO MAIN.
Siguiente: AXIOMA RETEST → correcciones si proceden → HUMAN QA MARÍA.
No se declara gate de Axioma ni HUMAN QA PASS.
"""
(OUT/"README_PATCH_P01_P08.md").write_text(readme,encoding="utf-8")

# Contact sheets per viewport.
for vp in (320,390,1440):
    ims=[Image.open(OUT/f"CONSTRUCTION_R02_PATCH_{n}_{vp}.png").convert("RGBA") for n in NAMES]
    tw=190 if vp==320 else 225 if vp==390 else 420
    thumbs=[ImageOps.contain(x,(tw,9999)) for x in ims]
    gap=14; margin=20; header=58
    W=margin*2+3*tw+2*gap
    H=header+margin+2*thumbs[0].height+gap+margin
    sh=Image.new("RGBA",(W,H),(235,241,245,255))
    sd=ImageDraw.Draw(sh,"RGBA")
    sd.text((margin,16),f"Construcción R02 · PATCH P06 · {vp}",font=F(20,True),fill=DARK)
    for i,x in enumerate(thumbs):
        sh.alpha_composite(x,(margin+(i%3)*(tw+gap),header+margin+(i//3)*(x.height+gap)))
    save_png(sh,OUT/f"CONTACT_SHEET_CONSTRUCTION_R02_PATCH_{vp}.png")

# QA: every frame size, ICC, RGB(A), and all requested viewports.
qa={"frames":{},"contrast":CONTRAST,"minimum_target_css_px":44}
for vp in (320,390,1440):
    expected=dims(vp)
    for n in NAMES:
        p=OUT/f"CONSTRUCTION_R02_PATCH_{n}_{vp}.png"
        with Image.open(p) as im:
            assert im.size==expected,(p,im.size,expected)
            assert im.mode in ("RGB","RGBA")
            assert "icc_profile" in im.info and im.info["icc_profile"], p
            qa["frames"][p.name]={"size":list(im.size),"mode":im.mode,"icc_srgb":True}
(OUT/"PATCH_QA.json").write_text(json.dumps(qa,indent=2),encoding="utf-8")

# Exhaustive inventory / per-file hash (manifest excludes its own self-hash).
files=[]
for p in sorted(OUT.iterdir()):
    if p.name=="manifest.json": continue
    files.append({"name":p.name,"bytes":p.stat().st_size,"sha256":hashlib.sha256(p.read_bytes()).hexdigest()})
manifest={
  "schema":"iris-green.prisma.construction-r02-patch-p06.v1",
  "issue":369,
  "source_audited_zip_sha256":"5aa0705b2a186681f223ab50d019ae1c1d167b2f66464001c1d8b2b08c282c1e",
  "source_axioma_review_commit":"09c652d54e1a82068cd6e134d0eda594be9b6ee3",
  "nexo_order_commit":"b2de0163116a6f9fd49eec7dde5d0dc3155d4339",
  "status":"PRISMA_CONSTRUCTION_R01_R02_P06_PATCH_READY_FOR_AXIOMA_RETEST",
  "viewports":[320,390,1440],
  "frames_per_viewport":6,
  "main_modified":False,
  "runtime":False,
  "files":files
}
(OUT/"manifest.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False),encoding="utf-8")

with zipfile.ZipFile(PATCH_ZIP,"w",zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(OUT.iterdir()):
        zi=zipfile.ZipInfo(p.name,date_time=(2026,10,5,13,30,0))
        zi.compress_type=zipfile.ZIP_DEFLATED
        z.writestr(zi,p.read_bytes())
with zipfile.ZipFile(PATCH_ZIP) as z:
    assert z.testzip() is None
sha=hashlib.sha256(PATCH_ZIP.read_bytes()).hexdigest()
PATCH_SHA.write_text(f"{sha}  {PATCH_ZIP.name}\n",encoding="utf-8")
print(f"PATCH_PACKAGE={PATCH_ZIP}")
print(f"SHA256={sha}")
print(f"FILES={len(list(OUT.iterdir()))}")
print("QA=PASS")
