#!/usr/bin/env python3
"""Diagnóstico reproducible para WCAG 1.4.11 Non-text Contrast.

Mide campos de formulario visibles y su contenedor visual efectivo. Para cada uno
registra el contraste del borde contra blanco como caso conservador y, al darle
foco, el contraste del indicador de foco contra blanco. Un borde <3:1 se marca
para revisión porque puede seguir existiendo otra señal visual suficiente; no se
etiqueta automáticamente como incumplimiento.
"""
from __future__ import annotations

import functools,json,re,threading
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path.cwd();OUT=ROOT/'reports'/'wcag-nontext-contrast';OUT.mkdir(parents=True,exist_ok=True)
ROUTES=['/','/es/situaciones/','/es/neurodiversidad/condiciones/','/es/biblioteca/','/es/investigacion/','/es/datos/','/es/tramites/directorio/','/es/libros/','/es/videos/','/es/recursos/juegos/','/es/intereses/','/es/taller/','/es/sitio-tranquilo/']

JS_FIELDS=r'''() => {
 const all=Array.from(document.querySelectorAll('input:not([type=hidden]),select,textarea'));
 return all.map((el,domIndex)=>{
  const ec=getComputedStyle(el),er=el.getBoundingClientRect();
  if(el.disabled||ec.display==='none'||ec.visibility==='hidden'||er.width<=2||er.height<=2||el.closest('[hidden],[aria-hidden="true"]'))return null;
  const visual=el.closest('.ig-search-shell')||el,c=getComputedStyle(visual),r=visual.getBoundingClientRect();
  return {domIndex,tag:el.tagName,type:el.type||'',id:el.id||'',name:el.name||'',cls:String(el.className||'').slice(0,100),placeholder:el.placeholder||'',visualTag:visual.tagName,visualCls:String(visual.className||'').slice(0,100),borderTopColor:c.borderTopColor,borderTopWidth:c.borderTopWidth,borderTopStyle:c.borderTopStyle,backgroundColor:c.backgroundColor,rect:[r.x,r.y,r.width,r.height]};
 }).filter(Boolean);
}'''
JS_FOCUS=r'''(el) => {
 el.focus({preventScroll:false});
 let node=el,depth=0;
 while(node&&node!==document.body&&depth<6){
  const c=getComputedStyle(node),w=parseFloat(c.outlineWidth||'0');
  if((w>0&&c.outlineStyle!=='none')||(c.boxShadow&&c.boxShadow!=='none'))return {tag:node.tagName,id:node.id||'',cls:String(node.className||'').slice(0,100),outlineColor:c.outlineColor,outlineWidth:c.outlineWidth,outlineStyle:c.outlineStyle,boxShadow:c.boxShadow};
  node=node.parentElement;depth++;
 }
 return null;
}'''
RGB=re.compile(r'rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)')

def rgb(value):
 m=RGB.fullmatch((value or '').strip())
 if not m:return None
 a=float(m.group(4) or 1);base=tuple(float(x) for x in m.group(1,2,3));return tuple(x*a+255*(1-a) for x in base)
def lum(v):
 vals=[]
 for x in v:
  c=x/255;vals.append(c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4)
 return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]
def ratio(a,b=(255,255,255)):
 if a is None:return None
 x,y=sorted((lum(a),lum(b)),reverse=True);return (x+.05)/(y+.05)
def box_shadow_color(value):
 if not value or value=='none':return None
 colors=RGB.findall(value)
 if not colors:return None
 vals=colors[-1];a=float(vals[3] or 1);base=tuple(float(x) for x in vals[:3]);return tuple(x*a+255*(1-a) for x in base)

class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
report={'criterion':'WCAG 2.2 SC 1.4.11 Non-text Contrast','routes':[],'fields':[],'border_review':[],'focus_review':[],'page_errors':[],'limits':['A border below 3:1 is a review candidate, not automatically a failure if other visual information is sufficient to identify the control.','White is used as a conservative adjacent-color reference for the initial inventory.','Graphical objects beyond form controls are not covered by this first pass.']}
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for route in ROUTES:
  ctx=browser.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce');ctx.route('**/*',lambda req:req.continue_() if req.request.url.startswith(BASE) else req.abort())
  page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(300)
  fields=page.evaluate(JS_FIELDS);route_rows=[];locators=page.locator('input:not([type=hidden]),select,textarea')
  for item in fields:
   border=ratio(rgb(item['borderTopColor'])) if item['borderTopStyle']!='none' and float(item['borderTopWidth'].replace('px','') or 0)>0 else None
   item['border_contrast_white']=round(border,3) if border is not None else None
   el=locators.nth(item['domIndex'])
   try: focus=page.evaluate(JS_FOCUS,el.element_handle())
   except Exception: focus=None
   item['focus']=focus;fcontrast=None
   if focus:
    oc=ratio(rgb(focus.get('outlineColor')));sc=ratio(box_shadow_color(focus.get('boxShadow')));vals=[x for x in (oc,sc) if x is not None];fcontrast=max(vals) if vals else None
   item['focus_contrast_white']=round(fcontrast,3) if fcontrast is not None else None
   row={'route':route,**item};report['fields'].append(row);route_rows.append(row)
   if border is not None and border<3:report['border_review'].append(row)
   if fcontrast is None or fcontrast<3:report['focus_review'].append(row)
  if errors:report['page_errors'].append({'route':route,'errors':errors})
  report['routes'].append({'route':route,'visible_fields':len(route_rows)});ctx.close()
 browser.close()
server.shutdown()
report['summary']={'routes':len(ROUTES),'fields':len(report['fields']),'border_review':len(report['border_review']),'focus_review':len(report['focus_review']),'page_errors':len(report['page_errors'])}
(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(report['summary'],ensure_ascii=False))
if report['page_errors']:raise SystemExit(1)
