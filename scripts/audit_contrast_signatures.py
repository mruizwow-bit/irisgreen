#!/usr/bin/env python3
"""Reduce y mide los incomplete de color-contrast de axe sobre fondos complejos.

Primero agrupa miles de nodos por firma de estilo. Después calcula un límite
conservador a partir de los colores declarados en fondos y gradientes. Solo para
las firmas que no pueden aprobarse así, toma muestras de los píxeles realmente
renderizados detrás del texto en varios ejemplos representativos.

La medida por píxeles es evidencia diagnóstica; no sustituye una revisión humana
completa de contraste en todos los estados y posiciones posibles.
"""
from __future__ import annotations

import argparse
import functools
import io
import json
import math
import re
import threading
from collections import Counter, defaultdict
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROUTES = [
    '/', '/es/situaciones/', '/es/situaciones/la-ropa-me-molesta/',
    '/en/situations/clothes-feel-unbearable/', '/es/neurodiversidad/condiciones/',
    '/es/neurodiversidad/condiciones/autismo/', '/en/neurodiversity/conditions/autism/',
    '/es/biblioteca/', '/es/investigacion/', '/es/datos/',
    '/es/datos/autismo-en-la-poblacion/', '/en/data/autism-in-the-population/',
    '/es/tramites/directorio/', '/es/libros/', '/es/videos/', '/es/recursos/juegos/',
    '/es/recursos/juegos/', '/es/intereses/', '/es/taller/',
    '/es/sitio-tranquilo/'
]

RGB_RE = re.compile(r'rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)')

JS_STYLE = r'''(selector) => {
  let el = null;
  try { el = document.querySelector(selector); } catch (_) {}
  if (!el) return null;
  const own = getComputedStyle(el);
  const layers = [];
  let node = el;
  let depth = 0;
  while (node && node.nodeType === 1 && depth < 10) {
    const cs = getComputedStyle(node);
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none') {
      layers.push({
        tag: node.tagName,
        id: node.id || '',
        cls: String(node.className || '').slice(0,120),
        backgroundColor: cs.backgroundColor,
        backgroundImage: cs.backgroundImage
      });
    }
    node = node.parentElement;
    depth++;
  }
  const r = el.getBoundingClientRect();
  return {
    color: own.color,
    fontSize: own.fontSize,
    fontWeight: own.fontWeight,
    opacity: own.opacity,
    textShadow: own.textShadow,
    box: [r.x,r.y,r.width,r.height],
    layers
  };
}'''

JS_TEXT_RECTS = r'''(selector) => {
  let el=null; try {el=document.querySelector(selector);} catch(_) {}
  if(!el) return null;
  el.scrollIntoView({block:'center',inline:'nearest'});
  const rects=[];
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{acceptNode(n){return (n.textContent||'').trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  while(walker.nextNode()){
    const range=document.createRange();range.selectNodeContents(walker.currentNode);
    for(const r of range.getClientRects()){
      if(r.width>1&&r.height>1)rects.push([r.x,r.y,r.width,r.height]);
    }
  }
  el.setAttribute('data-ig-contrast-probe','');
  return rects.slice(0,40);
}'''

PROBE_CSS = '''
[data-ig-contrast-probe],[data-ig-contrast-probe] *{
  color:transparent!important;
  -webkit-text-fill-color:transparent!important;
  text-shadow:none!important;
}
'''


class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def parse_color(value: str):
    match = RGB_RE.fullmatch(value.strip())
    if not match:
        return None
    return tuple(float(x) for x in match.group(1,2,3)) + (float(match.group(4) or 1),)


def composite(fg, bg):
    r,g,b,a=fg;br,bg2,bb=bg
    return (r*a+br*(1-a),g*a+bg2*(1-a),b*a+bb*(1-a))


def luminance(rgb):
    vals=[]
    for value in rgb:
        c=value/255
        vals.append(c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4)
    return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]


def contrast(a,b):
    x,y=sorted((luminance(a),luminance(b)),reverse=True)
    return (x+.05)/(y+.05)


def required_ratio(style):
    size=float(str(style['fontSize']).replace('px',''))
    try: weight=float(style['fontWeight'])
    except Exception: weight=400
    return 3.0 if size>=24 or (size>=18.666 and weight>=700) else 4.5


def split_top(value: str):
    out=[];cur=[];depth=0
    for char in value:
        if char=='(':depth+=1
        elif char==')':depth-=1
        if char==',' and depth==0:
            out.append(''.join(cur).strip());cur=[]
        else:cur.append(char)
    if cur:out.append(''.join(cur).strip())
    return out


def layer_candidates(layer, under):
    bgc=parse_color(layer['backgroundColor']) or (0,0,0,0)
    colors=[composite(bgc,u) for u in under]
    image=layer['backgroundImage']
    if image=='none':return colors
    for func in reversed(split_top(image)):
        if 'gradient(' not in func:continue
        tokens=[parse_color(x.group(0)) for x in RGB_RE.finditer(func)]
        choices=[(0,0,0,0)]+[x for x in tokens if x]
        next_colors=[]
        for under_color in colors:
            for choice in choices:
                next_colors.append(composite(choice,under_color))
        unique={tuple(round(v,2) for v in c):c for c in next_colors}
        colors=list(unique.values())[:1000]
    return colors


def conservative_min(style):
    parsed=parse_color(style['color'])
    if not parsed:return None
    alpha=float(style.get('opacity') or 1)*parsed[3]
    fg=(parsed[0]*alpha+255*(1-alpha),parsed[1]*alpha+255*(1-alpha),parsed[2]*alpha+255*(1-alpha))
    backgrounds=[(255,255,255)]
    for layer in reversed(style['layers']):
        backgrounds=layer_candidates(layer,backgrounds)
    return min(contrast(fg,bg) for bg in backgrounds) if backgrounds else None


def choose_examples(items):
    if len(items)<=3:return items
    return [items[0],items[len(items)//2],items[-1]]


def pixel_probe(page, selector, fg_rgb, required):
    locator=page.locator(selector).first
    if locator.count()!=1:return {'error':'target_missing'}
    locator.scroll_into_view_if_needed();page.wait_for_timeout(60)
    rects=page.evaluate(JS_TEXT_RECTS,selector)
    if not rects:return {'error':'no_text_rects'}
    shot=Image.open(io.BytesIO(page.screenshot(full_page=False))).convert('RGB')
    page.evaluate("""(selector)=>{let e=null;try{e=document.querySelector(selector)}catch(_){};if(e)e.removeAttribute('data-ig-contrast-probe')}""",selector)
    ratios=[];w,h=shot.size
    for x,y,rw,rh in rects:
        left=max(0,int(math.floor(x))+1);top=max(0,int(math.floor(y))+1)
        right=min(w,int(math.ceil(x+rw))-1);bottom=min(h,int(math.ceil(y+rh))-1)
        for py in range(top,bottom,2):
            for px in range(left,right,2):
                ratios.append(contrast(fg_rgb,shot.getpixel((px,py))))
    if not ratios:return {'error':'no_pixels'}
    ratios.sort();p01=ratios[max(0,min(len(ratios)-1,int(len(ratios)*.01)))]
    return {'pixels':len(ratios),'min_ratio':round(ratios[0],3),'p01_ratio':round(p01,3),'median_ratio':round(ratios[len(ratios)//2],3),'required':required,'p01_pass':p01+1e-6>=required}


def main() -> None:
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root',type=Path,default=Path('dist'))
    ap.add_argument('--axe',type=Path,required=True)
    args=ap.parse_args();root=args.root.resolve();axe=args.axe.resolve().read_text(encoding='utf-8')
    out=root/'reports'/'wcag-contrast-signatures';out.mkdir(parents=True,exist_ok=True)
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
    threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'

    counts=Counter();examples=defaultdict(list);signature_data={};page_errors=[];axe_nodes=0
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        for route in ROUTES:
            ctx=browser.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce')
            ctx.route('**/*',lambda req:req.continue_() if req.request.url.startswith(base) else req.abort())
            page=ctx.new_page();errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
            page.goto(base+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(350);page.add_script_tag(content=axe)
            result=page.evaluate("""async()=>await axe.run(document,{runOnly:{type:'rule',values:['color-contrast']},resultTypes:['incomplete','violations']})""")
            for bucket in ('violations','incomplete'):
                for rule in result.get(bucket,[]):
                    for node in rule.get('nodes',[]):
                        target=node.get('target') or [];selector=target[0] if target and isinstance(target[0],str) else None
                        if not selector:continue
                        style=page.evaluate(JS_STYLE,selector)
                        if not style:continue
                        axe_nodes+=1
                        signature=json.dumps({'color':style['color'],'fontSize':style['fontSize'],'fontWeight':style['fontWeight'],'opacity':style['opacity'],'textShadow':style['textShadow'],'layers':[{'backgroundColor':x['backgroundColor'],'backgroundImage':x['backgroundImage']} for x in style['layers']]},sort_keys=True,ensure_ascii=False)
                        counts[signature]+=1;signature_data.setdefault(signature,json.loads(signature))
                        if len(examples[signature])<6:
                            examples[signature].append({'route':route,'target':target,'html':(node.get('html') or '')[:350],'failureSummary':node.get('failureSummary'),'box':style['box']})
            if errors:page_errors.append({'route':route,'errors':errors})
            ctx.close()

        rows=[]
        for sig,count in counts.most_common():
            style=signature_data[sig];required=required_ratio(style);bound=conservative_min(style)
            row={'count':count,'style':style,'required_ratio':required,'conservative_min_ratio':round(bound,3) if bound is not None else None,'conservative_pass':bound is not None and bound+1e-6>=required,'examples':examples[sig],'pixel_probes':[]}
            rows.append(row)

        # Solo se muestrean por píxeles las firmas que el límite conservador no puede aprobar.
        by_route=defaultdict(list)
        for index,row in enumerate(rows):
            if row['conservative_pass']:continue
            for example in choose_examples(row['examples']):
                by_route[example['route']].append((index,example))
        for route,probes in by_route.items():
            ctx=browser.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce')
            ctx.route('**/*',lambda req:req.continue_() if req.request.url.startswith(base) else req.abort())
            page=ctx.new_page();page.goto(base+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(350);page.add_style_tag(content=PROBE_CSS)
            for index,example in probes:
                style=rows[index]['style'];parsed=parse_color(style['color'])
                if not parsed:continue
                alpha=float(style.get('opacity') or 1)*parsed[3]
                fg=(parsed[0]*alpha+255*(1-alpha),parsed[1]*alpha+255*(1-alpha),parsed[2]*alpha+255*(1-alpha))
                result=pixel_probe(page,example['target'][0],fg,rows[index]['required_ratio'])
                rows[index]['pixel_probes'].append({'route':route,'target':example['target'],**result})
            ctx.close()
        browser.close()
    server.shutdown()

    ambiguous=sum(1 for row in rows if not row['conservative_pass'])
    sampled_fail=sum(1 for row in rows if row['pixel_probes'] and not all(p.get('p01_pass',False) for p in row['pixel_probes']))
    report={'routes':ROUTES,'axe_color_contrast_nodes':axe_nodes,'unique_style_signatures':len(rows),'conservative_pass_signatures':len(rows)-ambiguous,'pixel_probe_signatures':ambiguous,'pixel_probe_signatures_with_failures':sampled_fail,'page_errors':page_errors,'signatures':rows,'limits':['Conservative passes are based on declared color extremes in the background chain.','Pixel probes sample rendered backgrounds behind representative text-line rectangles; they do not prove every position/state of the site.','A human review remains necessary for sampled failures and final WCAG conformance.']}
    (out/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'routes':len(ROUTES),'axe_nodes':axe_nodes,'unique_signatures':len(rows),'conservative_pass':len(rows)-ambiguous,'pixel_probe_signatures':ambiguous,'pixel_probe_failures':sampled_fail,'page_errors':len(page_errors)},ensure_ascii=False))
    if page_errors:raise SystemExit(1)


if __name__=='__main__':main()
