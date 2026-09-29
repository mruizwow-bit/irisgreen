#!/usr/bin/env python3
from __future__ import annotations

import argparse
import contextlib
import functools
import io
import json
import math
import re
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

PROBE_CSS = """
[data-w02-probe]{
  color:transparent!important;
  -webkit-text-fill-color:transparent!important;
  text-shadow:none!important;
}
"""
TEXT_RECTS_JS = r"""(el) => {
  el.scrollIntoView({block:'center', inline:'nearest'});
  const rects=[];
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,{
    acceptNode(n){return (n.textContent||'').trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}
  });
  while(walker.nextNode()){
    const range=document.createRange();
    range.selectNodeContents(walker.currentNode);
    for(const r of range.getClientRects()){
      if(r.width>1&&r.height>1) rects.push([r.x,r.y,r.width,r.height]);
    }
  }
  return rects.slice(0,80);
}"""
STYLE_JS = r"""(el) => {
  const s=getComputedStyle(el);
  const r=el.getBoundingClientRect();
  return {
    color:s.color,
    fontSize:s.fontSize,
    fontWeight:s.fontWeight,
    opacity:s.opacity,
    backgroundColor:s.backgroundColor,
    textShadow:s.textShadow,
    box:[r.x,r.y,r.width,r.height],
    text:(el.textContent||'').trim().slice(0,240)
  };
}"""

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

@contextlib.contextmanager
def serve(root: Path):
    server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(root)))
    thread=threading.Thread(target=server.serve_forever,daemon=True)
    thread.start()
    try:
        yield f'http://127.0.0.1:{server.server_port}'
    finally:
        server.shutdown()
        server.server_close()

def rgb_parse(value: str):
    m=re.fullmatch(r'rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)',value.strip())
    if not m:
        raise ValueError(f'Unsupported computed color: {value!r}')
    return tuple(float(x) for x in m.group(1,2,3))

def hex_rgb(value: str):
    value=value.lstrip('#')
    if len(value)!=6:
        raise ValueError(value)
    return tuple(int(value[i:i+2],16) for i in (0,2,4))

def luminance(rgb):
    vals=[]
    for value in rgb:
        c=value/255
        vals.append(c/12.92 if c<=.04045 else ((c+.055)/1.055)**2.4)
    return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]

def contrast(a,b):
    x,y=sorted((luminance(a),luminance(b)),reverse=True)
    return (x+.05)/(y+.05)

def p01(values):
    values=sorted(values)
    return values[max(0,min(len(values)-1,int(len(values)*.01)))]

def gradient_rgb(contract, t):
    stops=contract['gradient']['stops']
    base=hex_rgb(contract['gradient']['base'])
    for left,right in zip(stops,stops[1:]):
        if t <= right['position']:
            span=right['position']-left['position']
            u=0 if span==0 else (t-left['position'])/span
            lc=left['rgba'];rc=right['rgba']
            rgba=[lc[i]*(1-u)+rc[i]*u for i in range(4)]
            a=rgba[3]
            return tuple(rgba[i]*a+base[i]*(1-a) for i in range(3))
    rgba=stops[-1]['rgba'];a=rgba[3]
    return tuple(rgba[i]*a+base[i]*(1-a) for i in range(3))

def analytic_min(contract, fg_hex):
    fg=hex_rgb(fg_hex)
    worst=(999.0,None,None)
    for i in range(10001):
        t=i/10000
        bg=gradient_rgb(contract,t)
        r=contrast(fg,bg)
        if r<worst[0]:
            worst=(r,t,bg)
    return {'ratio':round(worst[0],3),'position':worst[1],'background_rgb':[round(x,3) for x in worst[2]]}

def set_mode_script(mode):
    if mode == 'normal':
        return None
    if mode == 'site-high-contrast':
        return """try{localStorage.setItem('ig-a11y',JSON.stringify({version:2,scale:1,spacing:false,controls:false,contrast:true,guide:false,motion:false}));}catch(e){}"""
    raise ValueError(mode)

def make_context(browser, base, viewport_width, mode):
    ctx=browser.new_context(viewport={'width':viewport_width,'height':900},reduced_motion='reduce')
    ctx.route('**/*',lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
    script=set_mode_script(mode)
    if script:
        ctx.add_init_script(script=script)
    return ctx

def wait_ready(page):
    page.wait_for_load_state('domcontentloaded')
    page.locator('main h1').first.wait_for(timeout=15000)
    page.evaluate("""async()=>{if(document.fonts&&document.fonts.ready)await document.fonts.ready;}""")
    page.wait_for_timeout(120)

def measure(page, locator, required, state, plan):
    locator.scroll_into_view_if_needed()
    try:
        page.mouse.move(0,0)
        page.evaluate("()=>{if(document.activeElement&&document.activeElement.blur)document.activeElement.blur()}")
    except Exception:
        pass
    if state == 'hover':
        locator.hover()
    elif state == 'focus':
        locator.focus()
    elif state != 'default':
        raise ValueError(state)
    page.wait_for_timeout(40)
    style=locator.evaluate(STYLE_JS)
    fg=rgb_parse(style['color'])
    rects=locator.evaluate(TEXT_RECTS_JS)
    if not rects:
        raise RuntimeError('No text rectangles')
    expected_scale=float(plan.get('page_scale_factor',1))
    old_style=locator.get_attribute('style')
    locator.evaluate("""(el)=>{
      el.style.setProperty('color','transparent','important');
      el.style.setProperty('-webkit-text-fill-color','transparent','important');
      el.style.setProperty('text-shadow','none','important');
    }""")
    page.wait_for_timeout(20)
    viewport=page.evaluate("""()=>{
      const v=window.visualViewport;
      return {
        scale:v?v.scale:1,
        offsetLeft:v?v.offsetLeft:0,
        offsetTop:v?v.offsetTop:0,
        width:v?v.width:window.innerWidth,
        height:v?v.height:window.innerHeight,
        dpr:window.devicePixelRatio||1
      };
    }""")
    try:
        shot=Image.open(io.BytesIO(page.screenshot(full_page=False))).convert('RGB')
    finally:
        if old_style is None:
            locator.evaluate("(el)=>el.removeAttribute('style')")
        else:
            locator.evaluate("(el,old)=>el.setAttribute('style',old)",old_style)
    w,h=shot.size
    scale=float(viewport['scale'])
    offx=float(viewport['offsetLeft'])
    offy=float(viewport['offsetTop'])
    dpr=float(viewport['dpr'])
    expected_w=float(viewport['width'])*scale*dpr
    expected_h=float(viewport['height'])*scale*dpr
    scale_ok=abs(scale-expected_scale)<=0.02
    dimensions_ok=abs(w-expected_w)<=2.1 and abs(h-expected_h)<=2.1
    transformed_rects=[]
    vals=[]
    worst={'ratio':999.0,'x':None,'y':None,'background_rgb':None,'css_x':None,'css_y':None}
    for x,y,rw,rh in rects:
        tx=(float(x)-offx)*scale*dpr
        ty=(float(y)-offy)*scale*dpr
        tw=float(rw)*scale*dpr
        th=float(rh)*scale*dpr
        transformed_rects.append({
            'css':[x,y,rw,rh],
            'png':[tx,ty,tw,th],
        })
        left=int(math.floor(x))+1
        top=int(math.floor(y))+1
        right=int(math.ceil(x+rw))-1
        bottom=int(math.ceil(y+rh))-1
        for cy in range(top,bottom,2):
            for cx in range(left,right,2):
                pxf=(cx-offx)*scale*dpr
                pyf=(cy-offy)*scale*dpr
                px=int(round(pxf))
                py=int(round(pyf))
                if px<0 or py<0 or px>=w or py>=h:
                    continue
                bg=shot.getpixel((px,py))
                r=contrast(fg,bg)
                vals.append(r)
                if r<worst['ratio']:
                    worst={
                        'ratio':r,'x':px,'y':py,
                        'background_rgb':list(bg),
                        'css_x':cx,'css_y':cy,
                    }
    if not vals:
        raise RuntimeError(
            f'No mapped background pixels sampled: scale={scale} offsets=({offx},{offy}) '
            f'dpr={dpr} screenshot={w}x{h}'
        )
    vals.sort()
    ratio01=p01(vals)
    legacy=None
    if worst['css_x'] is not None:
        lx=int(worst['css_x']);ly=int(worst['css_y'])
        if 0<=lx<w and 0<=ly<h:
            lbg=shot.getpixel((lx,ly))
            legacy={
                'png_point':[lx,ly],
                'background_rgb':list(lbg),
                'ratio':round(contrast(fg,lbg),3),
            }
    mapping_valid=bool(scale_ok and dimensions_ok and transformed_rects and vals)
    return {
        'state':state,
        'text':style['text'],
        'computed_color':style['color'],
        'font_size':style['fontSize'],
        'font_weight':style['fontWeight'],
        'box':style['box'],
        'range_rects':rects,
        'transformed_pixel_rects':transformed_rects,
        'visual_viewport':{
            'scale':scale,
            'offsetLeft':offx,
            'offsetTop':offy,
            'width':float(viewport['width']),
            'height':float(viewport['height']),
        },
        'device_pixel_ratio':dpr,
        'screenshot_dimensions':[w,h],
        'mapping_checks':{
            'expected_plan_scale':expected_scale,
            'scale_matches_plan':scale_ok,
            'expected_screenshot_dimensions':[expected_w,expected_h],
            'dimensions_match_visual_viewport':dimensions_ok,
            'mapping_valid':mapping_valid,
        },
        'raw_css_sample_point':[worst['css_x'],worst['css_y']],
        'transformed_png_sample_point':[worst['x'],worst['y']],
        'legacy_unmapped_sample':legacy,
        'sampled_rgb':worst['background_rgb'],
        'pixels':len(vals),
        'min_ratio':round(vals[0],3),
        'p01_ratio':round(ratio01,3),
        'median_ratio':round(vals[len(vals)//2],3),
        'required_ratio':required,
        'pass':ratio01+1e-6>=required,
        'worst':{
            'ratio':round(worst['ratio'],3),
            'x':worst['x'],'y':worst['y'],
            'css_x':worst['css_x'],'css_y':worst['css_y'],
            'background_rgb':worst['background_rgb'],
            'foreground_rgb':[round(x,3) for x in fg],
        },
    }

def route_path(route):
    return route.lstrip('/')+'index.html' if route!='/' else 'index.html'

def verify_source_files(root, contract):
    errors=[]
    for case in contract['cases']:
        for route in case['routes']:
            path=root/route_path(route)
            if not path.is_file():
                errors.append(f'{case["id"]}: missing source {path}')
                continue
            text=path.read_text(encoding='utf-8',errors='ignore')
            if case['source_needles'] and not any(n in text for n in case['source_needles']):
                errors.append(f'{case["id"]}: source declaration not found in {route}')
    return errors

def run_root(browser, root_name, root, contract, plans):
    rows=[]
    errors=[]
    with serve(root) as base:
        for plan in plans:
            mode=plan['mode'];width=plan['width'];states=plan['states'];tag=plan['tag']
            ctx=make_context(browser,base,width,mode)
            try:
                for case in contract['cases']:
                    for route in case['routes']:
                        page=ctx.new_page()
                        try:
                            page.goto(base+route,wait_until='domcontentloaded',timeout=30000)
                            wait_ready(page)
                            page.add_style_tag(content=PROBE_CSS)
                            if plan.get('page_scale_factor'):
                                cdp=ctx.new_cdp_session(page)
                                cdp.send('Emulation.setPageScaleFactor',{'pageScaleFactor':plan['page_scale_factor']})
                                page.wait_for_timeout(60)
                            loc=page.locator(case['selector'])
                            count=loc.count()
                            expected=case['expected_per_route'][route]
                            if count!=expected:
                                errors.append(f'{root_name}/{tag}/{case["id"]}/{route}: expected {expected} targets, got {count}')
                            for idx in range(count):
                                target=loc.nth(idx)
                                target_states=states if case['states'] else ['default']
                                if case['states']:
                                    target_states=[s for s in states if s in case['states']]
                                    if not target_states:
                                        target_states=['default']
                                for state in target_states:
                                    try:
                                        m=measure(page,target,contract['normal_text_ratio'],state,plan)
                                        rows.append({
                                            'root':root_name,'plan':tag,'mode':mode,'viewport_width':width,
                                            'page_scale_factor':plan.get('page_scale_factor',1),
                                            'case_id':case['id'],'route':route,'selector':case['selector'],
                                            'target_index':idx,**m
                                        })
                                    except Exception as exc:
                                        errors.append(f'{root_name}/{tag}/{case["id"]}/{route}[{idx}]/{state}: {exc}')
                        except Exception as exc:
                            errors.append(f'{root_name}/{tag}/{case["id"]}/{route}: page error {exc}')
                        finally:
                            page.close()
            finally:
                ctx.close()
    return rows,errors

def summarize(contract, rows):
    summary={}
    for case in contract['cases']:
        cid=case['id']
        core=[r for r in rows if r['case_id']==cid and r['root']=='dist' and r['plan']=='normal-1440' and r['state']=='default']
        coverage=[r for r in rows if r['case_id']==cid]
        summary[cid]={
            'baseline_core_instances':len(core),
            'baseline_core_worst_p01':min((r['p01_ratio'] for r in core),default=None),
            'baseline_core_pass':bool(core) and all(r['pass'] for r in core),
            'coverage_records':len(coverage),
            'coverage_pass':bool(coverage) and all(r['pass'] for r in coverage),
            'failing_records':sum(1 for r in coverage if not r['pass']),
        }
    return summary

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--contract',type=Path,required=True)
    ap.add_argument('--source-root',type=Path,required=True)
    ap.add_argument('--dist-root',type=Path,required=True)
    ap.add_argument('--output',type=Path,required=True)
    ap.add_argument('--phase',choices=['baseline','candidate'],required=True)
    args=ap.parse_args()
    contract=json.loads(args.contract.read_text(encoding='utf-8'))
    errors=verify_source_files(args.source_root,contract)
    analytics={c['id']:analytic_min(contract,c['baseline_foreground']) for c in contract['cases']}
    for c in contract['cases']:
        expected=c['baseline_analytic_min_ratio']
        got=analytics[c['id']]['ratio']
        if abs(got-expected)>0.015:
            errors.append(f'{c["id"]}: analytic sanity drift expected {expected}, got {got}')
    core_plans=[
        {'tag':'normal-1440','mode':'normal','width':1440,'states':['default','hover','focus']},
        {'tag':'high-contrast-1440','mode':'site-high-contrast','width':1440,'states':['default','hover','focus']},
    ]
    dist_extra=[
        {'tag':'normal-320','mode':'normal','width':320,'states':['default']},
        {'tag':'normal-390','mode':'normal','width':390,'states':['default']},
        {'tag':'normal-768','mode':'normal','width':768,'states':['default']},
        {'tag':'zoom-200','mode':'normal','width':1440,'states':['default'],'page_scale_factor':2},
        {'tag':'zoom-400','mode':'normal','width':1440,'states':['default'],'page_scale_factor':4},
    ]
    all_rows=[]
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        source_rows,source_errors=run_root(browser,'source',args.source_root,contract,core_plans)
        dist_rows,dist_errors=run_root(browser,'dist',args.dist_root,contract,core_plans+dist_extra)
        browser.close()
    all_rows.extend(source_rows);all_rows.extend(dist_rows)
    errors.extend(source_errors);errors.extend(dist_errors)
    summary=summarize(contract,all_rows)
    for case in contract['cases']:
        core=[r for r in all_rows if r['case_id']==case['id'] and r['plan']=='normal-1440' and r['state']=='default']
        for r in core:
            try:
                size=float(str(r['font_size']).replace('px',''))
            except Exception:
                errors.append(f"{case['id']}: cannot parse font size {r['font_size']}")
                continue
            if abs(size-case['baseline_font_size_px'])>0.08:
                errors.append(f"{case['id']}: font-size drift {size} vs {case['baseline_font_size_px']}")
            if str(r['font_weight'])!=str(case['baseline_font_weight']):
                errors.append(f"{case['id']}: font-weight drift {r['font_weight']} vs {case['baseline_font_weight']}")
            if args.phase=='baseline' and r['root']=='dist':
                expected=hex_rgb(case['baseline_foreground'])
                got=rgb_parse(r['computed_color'])
                if any(abs(a-b)>.5 for a,b in zip(expected,got)):
                    errors.append(f"{case['id']}: baseline foreground drift {r['computed_color']} vs {case['baseline_foreground']}")
    if args.phase=='baseline':
        for cid,item in summary.items():
            if item['baseline_core_pass']:
                errors.append(f'{cid}: baseline must reproduce FAIL, but core passed')
        if sum(1 for x in summary.values() if not x['baseline_core_pass']) != 4:
            errors.append('baseline must reproduce exactly 4/4 failing case families')
        for case in contract['cases']:
            worst=summary[case['id']]['baseline_core_worst_p01']
            floor=case['baseline_analytic_min_ratio']-0.12
            if worst is None or worst < floor:
                errors.append(f"{case['id']}: implausible baseline pixel ratio {worst}; expected >= {floor:.3f} from analytic sanity")
    else:
        for cid,item in summary.items():
            if not item['coverage_pass']:
                errors.append(f'{cid}: candidate does not pass full frozen coverage')
    zoom_rows=[r for r in all_rows if r['root']=='dist' and r['plan'] in ('zoom-200','zoom-400')]
    invalid_mapping=[r for r in zoom_rows if not r.get('mapping_checks',{}).get('mapping_valid')]
    page_errors=sum(1 for e in errors if 'page error' in e)
    diagnostics={
        'records_total':len(all_rows),
        'zoom_records':len(zoom_rows),
        'zoom_200_records':sum(1 for r in zoom_rows if r['plan']=='zoom-200'),
        'zoom_400_records':sum(1 for r in zoom_rows if r['plan']=='zoom-400'),
        'zoom_mapping_valid':len(zoom_rows)-len(invalid_mapping),
        'zoom_mapping_invalid':len(invalid_mapping),
        'page_errors':page_errors,
        'normal_text_ratio':contract['normal_text_ratio'],
        'mapping_formula':{
            'x_png':'(x_css - visualViewport.offsetLeft) * visualViewport.scale * devicePixelRatio',
            'y_png':'(y_css - visualViewport.offsetTop) * visualViewport.scale * devicePixelRatio',
        },
    }
    if len(zoom_rows)!=54:
        errors.append(f'R2 expects exactly 54 zoom records, got {len(zoom_rows)}')
    if invalid_mapping:
        errors.append(f'R2 mapping telemetry invalid in {len(invalid_mapping)} zoom records')
    if page_errors:
        errors.append(f'R2 requires 0 page errors, got {page_errors}')
    if abs(float(contract['normal_text_ratio'])-4.5)>1e-9:
        errors.append('R2 normal text threshold drifted from 4.5')
    report={
        'schema':'W02_R2_CONTRAST_GATE_REPORT/1.0',
        'phase':args.phase,
        'baseline_sha':contract['baseline_sha'],
        'contract_id':contract['contract_id'],
        'analytic_sanity':analytics,
        'summary':summary,
        'errors':errors,
        'diagnostics':diagnostics,
        'records':all_rows,
        'limitations':contract['limitations'],
    }
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'phase':args.phase,'summary':summary,'errors':errors},ensure_ascii=False,indent=2))
    raise SystemExit(1 if errors else 0)

if __name__=='__main__':
    main()
