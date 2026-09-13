#!/usr/bin/env python3
"""Audita reproducción automática y movimiento persistente en rutas representativas.

Cubre de forma reproducible dos riesgos WCAG:
- 1.4.2 Audio Control: ningún audio/TTS debe empezar sin acción de la persona.
- 2.2.2 Pause, Stop, Hide: inventaría animaciones persistentes que empiezan solas
  para revisión; autoplay/marquee son errores objetivos en este sitio.

No decide automáticamente si una animación persistente es esencial. El baseline
actual debe quedar sin candidatos visibles persistentes tras estabilizar la página.
"""
from __future__ import annotations

import functools
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT=Path.cwd()
OUT=ROOT/'reports'/'wcag-autoplay-motion';OUT.mkdir(parents=True,exist_ok=True)
ROUTES=[
 '/', '/es/situaciones/', '/es/neurodiversidad/condiciones/', '/es/biblioteca/',
 '/es/investigacion/', '/es/datos/', '/es/tramites/directorio/', '/es/libros/',
 '/es/videos/', '/es/recursos/juegos/', '/es/recursos/juegos/las-cinco-cosas/',
 '/es/intereses/', '/es/taller/', '/es/sitio-tranquilo/'
]
SPY=r'''
window.__igAutoMedia={playCalls:[],speechCalls:[]};
try{
 const original=HTMLMediaElement.prototype.play;
 HTMLMediaElement.prototype.play=function(){
   window.__igAutoMedia.playCalls.push({tag:this.tagName,src:this.currentSrc||this.src||'',time:performance.now()});
   return original.call(this);
 };
}catch(_){}
try{
 if(window.speechSynthesis){
   const originalSpeak=window.speechSynthesis.speak.bind(window.speechSynthesis);
   window.speechSynthesis.speak=function(u){
     window.__igAutoMedia.speechCalls.push({text:(u&&u.text||'').slice(0,120),time:performance.now()});
     return originalSpeak(u);
   };
 }
}catch(_){}
'''
JS=r'''() => {
 const autoplay=Array.from(document.querySelectorAll('audio[autoplay],video[autoplay]')).filter(el=>{
   const r=el.getBoundingClientRect(),c=getComputedStyle(el);return c.display!=='none'&&c.visibility!=='hidden'&&r.width>=0;
 }).map(el=>({tag:el.tagName,src:el.currentSrc||el.src||'',autoplay:el.autoplay}));
 const marquees=Array.from(document.querySelectorAll('marquee,blink')).map(el=>({tag:el.tagName,text:(el.textContent||'').trim().slice(0,100)}));
 const persistent=[];
 for(const el of document.querySelectorAll('body *')){
   if(el.closest('[hidden],[aria-hidden="true"],template,noscript'))continue;
   const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
   if(cs.display==='none'||cs.visibility==='hidden'||r.width<2||r.height<2)continue;
   const names=cs.animationName.split(',').map(x=>x.trim());
   const durations=cs.animationDuration.split(',').map(x=>x.trim());
   const iterations=cs.animationIterationCount.split(',').map(x=>x.trim());
   for(let i=0;i<names.length;i++){
     const name=names[i]||'none'; if(name==='none')continue;
     const duration=durations[Math.min(i,durations.length-1)]||'0s';
     const iteration=iterations[Math.min(i,iterations.length-1)]||'1';
     const seconds=duration.endsWith('ms')?parseFloat(duration)/1000:parseFloat(duration)||0;
     if(iteration==='infinite' && seconds>0){
       persistent.push({tag:el.tagName,id:el.id,cls:String(el.className||'').slice(0,100),name,duration,iteration,text:(el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,100)});
       break;
     }
   }
 }
 return {autoplay,marquees,persistent,spy:window.__igAutoMedia||{}};
}'''

class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start();BASE=f'http://127.0.0.1:{server.server_port}'
report={'routes':[],'objective_errors':[],'manual_motion':[],'limits':['Persistent CSS animations are candidates for review; essential loading indicators may be valid exceptions.','The sample covers initial page load, not every state revealed by interaction.']}
with sync_playwright() as pw:
 browser=pw.chromium.launch()
 for route in ROUTES:
  ctx=browser.new_context(viewport={'width':1280,'height':900},reduced_motion='no-preference')
  ctx.add_init_script(SPY)
  ctx.route('**/*',lambda req:req.continue_() if req.request.url.startswith(BASE) else req.abort())
  page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE+route,wait_until='domcontentloaded');page.locator('main h1').first.wait_for(timeout=15000);page.wait_for_timeout(1200)
  result=page.evaluate(JS);row={'route':route,**result,'page_errors':errors};report['routes'].append(row)
  if result['autoplay'] or result['marquees'] or result.get('spy',{}).get('playCalls') or result.get('spy',{}).get('speechCalls') or errors:
   report['objective_errors'].append({'route':route,'autoplay':result['autoplay'],'marquees':result['marquees'],'playCalls':result.get('spy',{}).get('playCalls',[]),'speechCalls':result.get('spy',{}).get('speechCalls',[]),'page_errors':errors})
  for item in result['persistent']:
   report['manual_motion'].append({'route':route,**item})
  print(json.dumps({'route':route,'autoplay':len(result['autoplay']),'play_calls':len(result.get('spy',{}).get('playCalls',[])),'speech_calls':len(result.get('spy',{}).get('speechCalls',[])),'persistent':len(result['persistent'])},ensure_ascii=False),flush=True)
  ctx.close()
 browser.close()
server.shutdown()
report['summary']={'routes':len(report['routes']),'objective_errors':len(report['objective_errors']),'persistent_motion_candidates':len(report['manual_motion'])}
(OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report['summary'],ensure_ascii=False))
if report['objective_errors']:raise SystemExit(1)
