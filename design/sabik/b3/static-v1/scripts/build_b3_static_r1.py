#!/usr/bin/env python3
"""R1 transformation-core mirror.

The authoritative runnable package is the Library ZIP referenced by ASSET_INDEX.md.
This file mirrors the structural operations for review in PR #182.
"""
from PIL import Image
import numpy as np
import math

PARAMS = {
    "ORIENTAR": {"shift": (-7, 3, 28), "centers": (-1.05, 0, 1.05), "sigma": .75},
    "TRANSICION": {"rotation": (-18, 0, 18), "perp_shift": (-10, 0, 10), "centers": (-1.05, 0, 1.05), "sigma": .75},
    "PAUSA": {"scale": .94, "alpha_center": .88, "alpha_edge": .54, "radial_start": .15, "radial_span": .72},
    "CONFIRMAR": {"perp_shift": (24, 0, -24), "rotation": (7, 0, -7), "centers": (-1.05, 0, 1.05), "sigma": .75},
}

def base_for(master, canvas=544):
    out=Image.new("RGBA",(canvas,canvas),(0,0,0,0))
    out.alpha_composite(master,((canvas-master.width)//2,(canvas-master.height)//2))
    return out

def stats(im, axis):
    a=np.asarray(im.getchannel("A"),dtype=float)/255.0
    yy,xx=np.mgrid[:a.shape[0],:a.shape[1]]
    s=a.sum(); cx=(xx*a).sum()/s; cy=(yy*a).sum()/s
    v=np.asarray(axis,dtype=float); v/=np.linalg.norm(v); u=np.array([-v[1],v[0]])
    p=(xx-cx)*v[0]+(yy-cy)*v[1]; q=(xx-cx)*u[0]+(yy-cy)*u[1]
    sp=math.sqrt((a*p*p).sum()/s); sq=math.sqrt((a*q*q).sum()/s)
    return cx,cy,sp,sq,v,u,p,q

def soft3(coord, spread, centers, sigma):
    z=coord/(spread+1e-9)
    w=np.stack([np.exp(-.5*((z-c)/sigma)**2) for c in centers],axis=0)
    return w/(w.sum(0,keepdims=True)+1e-12)

def masked(im,m):
    ar=np.asarray(im).copy().astype(np.float32)
    ar[:,:,3]*=m
    return Image.fromarray(np.clip(ar,0,255).astype(np.uint8),"RGBA")

def shift(im,dx,dy):
    return im.transform(im.size,Image.AFFINE,(1,0,-dx,0,1,-dy),resample=Image.Resampling.BICUBIC)

def rotate(im,angle,center):
    return im.rotate(angle,resample=Image.Resampling.BICUBIC,center=center,expand=False)

def scale_center(im,scale):
    w,h=im.size; nw=int(round(w*scale)); nh=int(round(h*scale))
    rs=im.resize((nw,nh),Image.Resampling.LANCZOS)
    out=Image.new("RGBA",(w,h),(0,0,0,0))
    out.alpha_composite(rs,((w-nw)//2,(h-nh)//2))
    return out

def orientar(base, axis):
    cx,cy,sp,sq,v,u,p,q=stats(base,axis); cfg=PARAMS["ORIENTAR"]
    out=Image.new("RGBA",base.size,(0,0,0,0))
    for m,d in zip(soft3(p,sp,cfg["centers"],cfg["sigma"]),cfg["shift"]):
        out=Image.alpha_composite(out,shift(masked(base,m),v[0]*d,v[1]*d))
    return out

def transicion(base, axis):
    cx,cy,sp,sq,v,u,p,q=stats(base,axis); cfg=PARAMS["TRANSICION"]
    out=Image.new("RGBA",base.size,(0,0,0,0))
    for m,ang,d in zip(soft3(p,sp,cfg["centers"],cfg["sigma"]),cfg["rotation"],cfg["perp_shift"]):
        part=rotate(masked(base,m),ang,(cx,cy))
        out=Image.alpha_composite(out,shift(part,u[0]*d,u[1]*d))
    return out

def pausa(base):
    cfg=PARAMS["PAUSA"]; out=scale_center(base,cfg["scale"]); ar=np.asarray(out).copy().astype(np.float32)
    yy,xx=np.mgrid[:out.height,:out.width]
    r=np.sqrt((xx-out.width/2)**2+(yy-out.height/2)**2)/(out.width*.5)
    t=np.clip((r-cfg["radial_start"])/cfg["radial_span"],0,1)
    factor=cfg["alpha_center"]+(cfg["alpha_edge"]-cfg["alpha_center"])*t
    ar[:,:,3]=np.clip(ar[:,:,3]*factor,0,255)
    return Image.fromarray(ar.astype(np.uint8),"RGBA")

def confirmar(base, axis):
    cx,cy,sp,sq,v,u,p,q=stats(base,axis); cfg=PARAMS["CONFIRMAR"]
    out=Image.new("RGBA",base.size,(0,0,0,0))
    for m,d,ang in zip(soft3(q,sq,cfg["centers"],cfg["sigma"]),cfg["perp_shift"],cfg["rotation"]):
        part=rotate(masked(base,m),ang,(cx,cy))
        out=Image.alpha_composite(out,shift(part,u[0]*d,u[1]*d))
    return out

# PRESENTE = base_for(master) exactly; no state operation.
