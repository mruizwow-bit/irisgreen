#!/usr/bin/env python3
from __future__ import annotations
import asyncio, json, math, os, re
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

BASE=os.environ.get("IG_BASE_URL","http://127.0.0.1:4173").rstrip("/")
OUT=Path("reports/vector-integrated-web-audit-20261001")
OUT.mkdir(parents=True,exist_ok=True)

ROUTES=[
 ("home_es","/"),("home_en","/en/"),
 ("conditions_es","/es/neurodiversidad/condiciones/"),("conditions_en","/en/neurodiversity/conditions/"),
 ("condition_autism_es","/es/neurodiversidad/condiciones/autismo/"),("condition_autism_en","/en/neurodiversity/conditions/autism/"),
 ("situations_es","/es/situaciones/"),("situations_en","/en/situations/"),
 ("everyday_es","/es/biblioteca/"),("everyday_en","/en/everyday-life/"),
 ("research_es","/es/investigacion/"),("research_en","/en/research/"),
 ("data_es","/es/datos/"),("data_en","/en/data/"),
 ("support_es","/es/tramites/directorio/"),("support_en","/en/support-directory/"),
 ("resources_es","/es/recursos/"),("resources_en","/en/resources/"),
 ("games_es","/es/recursos/juegos/"),("games_en","/en/resources/games/"),
 ("visual_routines_es","/es/recursos/rutinas-visuales/"),("visual_routines_en","/en/resources/visual-routines/"),
 ("printables_es","/es/recursos/rutinas-imprimibles/"),("printables_en","/en/resources/printable-routines/"),
 ("videos_es","/es/videos/"),("videos_en","/en/videos/"),
 ("books_es","/es/libros/"),("books_en","/en/books/"),
 ("interests_es","/es/intereses/"),("interests_en","/en/interests/"),
 ("workshop_es","/es/taller/"),("workshop_en","/en/workshop/"),
 ("quiet_es","/es/sitio-tranquilo/"),("quiet_en","/en/quiet-space/"),
 ("privacy_es","/es/privacidad/"),("privacy_en","/en/privacy/"),
 ("about_es","/es/sobre-iris-green/"),("about_en","/en/about-iris-green/"),
]

VIEWPORTS={
 "desktop":{"width":1440,"height":900},
 "mobile390":{"width":390,"height":844},
 "mobile320":{"width":320,"height":800},
}

def rgb_tuple(v):
 m=re.match(r"rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)",v or "")
 if not m:return None
 return tuple(map(int,m.group(1,2,3)))+(float(m.group(4) or 1),)

def lum(rgb):
 vals=[]
 for c in rgb[:3]:
  x=c/255
  vals.append(x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4)
 return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]

def contrast(a,b):
 la,lb=lum(a),lum(b)
 hi,lo=max(la,lb),min(la,lb)
 return (hi+.05)/(lo+.05)

async def inspect_route(browser,name,path,vp):
 ctx=await browser.new_context(viewport=vp)
 page=await ctx.new_page()
 console_errors=[]; page_errors=[]; failed=[]; bad_http=[]; externals=[]
 page.on("console",lambda m: console_errors.append(m.text) if m.type=="error" else None)
 page.on("pageerror",lambda e: page_errors.append(str(e)))
 page.on("requestfailed",lambda req: failed.append({"url":req.url,"error":req.failure}))
 page.on("response",lambda res: bad_http.append({"url":res.url,"status":res.status}) if res.status>=400 else None)
 page.on("request",lambda req: externals.append(req.url) if not req.url.startswith(BASE) and req.url.startswith(("http://","https://")) else None)
 status=None;nav_error=None
 try:
  response=await page.goto(BASE+path,wait_until="networkidle",timeout=20000)
  status=response.status if response else None
 except Exception as e:
  nav_error=repr(e)
 try:
  await page.wait_for_timeout(150)
  data=await page.evaluate("""() => {
   const vp={w:innerWidth,h:innerHeight};
   const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0};
   const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,top:r.top,bottom:r.bottom,left:r.left,right:r.right}};
   const main=document.querySelector('main');
   const h1=main?.querySelector('h1')||document.querySelector('h1');
   const hs=h1?getComputedStyle(h1):null,hr=h1?rect(h1):null;
   const lineH=hs?parseFloat(hs.lineHeight)||parseFloat(hs.fontSize)*1.2:0;
   const h1Lines=hr&&lineH?hr.h/lineH:0;
   let hero=h1;
   for(let i=0;i<3&&hero?.parentElement;i++){
     const p=hero.parentElement,r=p.getBoundingClientRect();
     if(r.width>innerWidth*.55){hero=p;break;}
     hero=p;
   }
   const light=[];
   const textBad=[];
   const limitY=innerHeight*2.2, vpArea=innerWidth*innerHeight;
   for(const e of document.querySelectorAll('body *')){
     if(!vis(e)||e.matches('img,svg,canvas,video,picture,source,.im-sheet,.rv-sheet,.rv-print-document,[hidden]'))continue;
     const r=e.getBoundingClientRect();if(r.top>limitY||r.bottom<0)continue;
     const s=getComputedStyle(e),bg=s.backgroundColor,fg=s.color;
     const bm=bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
     if(bm){
       const rr=+bm[1],gg=+bm[2],bb=+bm[3],aa=bm[4]===undefined?1:+bm[4];
       if(aa>.75&&rr>=235&&gg>=235&&bb>=235&&r.width*r.height>vpArea*.012){
         light.push({tag:e.tagName,cls:String(e.className||'').slice(0,100),bg,w:Math.round(r.width),h:Math.round(r.height),top:Math.round(r.top)});
       }
     }
   }
   const blocks=main?[...main.children].filter(vis).map(e=>rect(e)).sort((a,b)=>a.top-b.top):[];
   let maxGap=0;
   for(let i=1;i<blocks.length;i++)maxGap=Math.max(maxGap,blocks[i].top-blocks[i-1].bottom);
   const header=document.querySelector('.ig-r49-global-header');
   return {
    lang:document.documentElement.lang||'',theme:document.documentElement.dataset.igTheme||'',
    profile:document.body?.dataset.igProfile||'',bodyBg:getComputedStyle(document.body).backgroundColor,
    main:main?rect(main):null,
    h1:h1?{text:(h1.innerText||'').trim(),...hr,font:hs.fontFamily,fontSize:hs.fontSize,lineHeight:lineH,lines:h1Lines,color:hs.color,maxWidth:hs.maxWidth}:null,
    hero:hero&&vis(hero)?rect(hero):null,
    lightSurfaces:light.slice(0,25),maxTopLevelGap:maxGap,
    shell:{header:document.querySelectorAll('.ig-r49-global-header').length,footer:document.querySelectorAll('.ig-r49-global-footer').length},
    sabik:Boolean(document.querySelector('.sabik-panel')),
    blocked:document.body?.hasAttribute('data-ig-audience-blocked')||false
   };
  }""")
 except Exception as e:
  data={"eval_error":repr(e)}
 screenshot=str(OUT/f"{name}-{vp['width']}.png")
 try: await page.screenshot(path=screenshot,full_page=False)
 except: pass
 await ctx.close()
 return {
  "name":name,"path":path,"viewport":vp,"status":status,"nav_error":nav_error,
  "data":data,"console_errors":console_errors[:20],"page_errors":page_errors[:20],
  "failed_requests":failed[:20],"bad_http":bad_http[:20],
  "external_requests":sorted(set(externals))[:40]
 }

def classify(row):
 d=row.get("data") or {};vp=row["viewport"];flags=[]
 if row.get("status") not in (200,None): flags.append("HTTP_"+str(row.get("status")))
 if row.get("nav_error"): flags.append("NAV_ERROR")
 if row.get("page_errors"): flags.append("PAGE_ERROR")
 if row.get("console_errors"): flags.append("CONSOLE_ERROR")
 if row.get("failed_requests"): flags.append("REQUEST_FAILED")
 if d.get("theme")!="dark": flags.append("NOT_DARK_DEFAULT")
 if d.get("bodyBg") and d.get("bodyBg")!="rgb(11, 26, 43)": flags.append("NON_CANONICAL_CANVAS")
 if d.get("shell",{}).get("header")!=1: flags.append("HEADER_COUNT")
 if d.get("shell",{}).get("footer")!=1: flags.append("FOOTER_COUNT")
 h=d.get("h1")
 if h:
  if vp["width"]>=1200 and len(h.get("text",""))<=70 and h.get("lines",0)>1.45: flags.append("SHORT_H1_WRAPS_DESKTOP")
  if vp["width"]>=1200 and d.get("main") and d["main"]["w"]>vp["width"]*.72 and h.get("w",9999)<vp["width"]*.40: flags.append("H1_TOO_NARROW_FOR_CANVAS")
  if h.get("top",0)>320: flags.append("H1_TOO_LOW")
 if d.get("hero") and vp["width"]>=1200:
  hero=d["hero"]
  if hero["h"]>360 and h and h["h"]<125 and len(h.get("text",""))<90: flags.append("SPARSE_OVERSIZED_HERO")
 if d.get("maxTopLevelGap",0)>220: flags.append("EXCESSIVE_VERTICAL_GAP")
 if d.get("lightSurfaces"): flags.append("LIGHT_SURFACE_IN_DARK")
 return flags

async def safety_matrix(browser):
 results=[]
 s2="/es/neurodiversidad/condiciones/anorexia-nerviosa/"
 for mode in ("GENERAL","AGE_0_12","AGE_13_17","AGE_18_PLUS"):
  ctx=await browser.new_context(viewport={"width":1440,"height":900})
  page=await ctx.new_page();full_requests=[]
  page.on("request",lambda req: full_requests.append(req.url) if "/assets/safety/full/" in req.url else None)
  await page.goto(BASE+"/",wait_until="networkidle")
  if mode=="GENERAL": await page.evaluate("IGAudience.clear()")
  else: await page.evaluate("(m)=>IGAudience.set(m)",mode)
  await page.goto(BASE+s2,wait_until="networkidle")
  await page.wait_for_timeout(120)
  pre={
   "safe":await page.locator("article[data-ig-s2-safe]").count(),
   "full":await page.locator("article[data-ig-s2-full]").count(),
   "button":await page.locator(".ig-s2-full-button").count(),
   "blocked":await page.locator("body").get_attribute("data-ig-audience-blocked") is not None,
   "main_inert":await page.locator("main").first.get_attribute("inert") is not None,
   "full_requests":len(full_requests)
  }
  post=None
  if mode=="AGE_18_PLUS" and pre["button"]:
   await page.locator(".ig-s2-full-button").click();await page.wait_for_timeout(300)
   post={"full":await page.locator("article[data-ig-s2-full]").count(),"full_requests":len(full_requests)}
  results.append({"mode":mode,"pre":pre,"post":post})
  await ctx.close()
 return results

async def sabik_check(browser):
 ctx=await browser.new_context(viewport={"width":1440,"height":900})
 page=await ctx.new_page();errors=[];failed=[]
 page.on("pageerror",lambda e:errors.append(str(e)))
 page.on("requestfailed",lambda r:failed.append({"url":r.url,"error":r.failure}))
 await page.goto(BASE+"/",wait_until="networkidle")
 await page.wait_for_function("window.SabikWebPresentation && document.querySelector('#sabik-input')")
 visual=await page.evaluate("""() => {
   const v=document.querySelector('#sabik-hologram'),m=document.querySelector('#sabik-web-master');
   const vr=v.getBoundingClientRect(),mr=m.getBoundingClientRect();
   return {state:v.dataset.webState||'',visual:{w:vr.width,h:vr.height},master:{w:mr.width,h:mr.height,natural:m.naturalWidth,src:m.getAttribute('src')||''}};
 }""")
 await page.locator("#sabik-input").fill("El ruido me agota")
 await page.locator("#sabik-form").evaluate("(f)=>f.requestSubmit()")
 try:
  await page.wait_for_selector(".sabik-conversation-answer",timeout=6000)
 except PlaywrightTimeoutError:
  pass
 answer=await page.locator(".sabik-conversation-answer").all_inner_texts()
 sources=await page.locator(".sabik-source-list a").count()
 await ctx.close()
 return {"visual":visual,"answer":answer,"sources":sources,"page_errors":errors,"failed_requests":failed[:20]}

async def main():
 report={"base":BASE,"routes":[],"safety":[],"sabik":{}}
 async with async_playwright() as p:
  browser=await p.chromium.launch()
  for key,path in ROUTES:
   for vp_name,vp in VIEWPORTS.items():
    row=await inspect_route(browser,key,path,vp)
    row["viewport_name"]=vp_name;row["flags"]=classify(row)
    report["routes"].append(row)
  report["safety"]=await safety_matrix(browser)
  report["sabik"]=await sabik_check(browser)
  await browser.close()
 report["summary"]={
  "pages_checked":len(report["routes"]),
  "flagged":sum(1 for x in report["routes"] if x["flags"]),
  "flags":{}
 }
 for row in report["routes"]:
  for f in row["flags"]:report["summary"]["flags"][f]=report["summary"]["flags"].get(f,0)+1
 (OUT/"report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 md=["# Vector integrated web audit 2026-10-01","",f"Base: {BASE}","",
     f"Checks: {report['summary']['pages_checked']} · flagged: {report['summary']['flagged']}","",
     "## Flag counts",""]
 for k,v in sorted(report["summary"]["flags"].items(),key=lambda x:(-x[1],x[0])):md.append(f"- {k}: {v}")
 md+=["","## Route findings",""]
 for row in report["routes"]:
  if row["flags"]:md.append(f"- {row['viewport_name']} {row['path']} → {', '.join(row['flags'])}")
 md+=["","## Safety matrix","",f"\`\`\`json\n{json.dumps(report['safety'],ensure_ascii=False,indent=2)}\n\`\`\`",
      "","## Sabik","",f"\`\`\`json\n{json.dumps(report['sabik'],ensure_ascii=False,indent=2)}\n\`\`\`"]
 (OUT/"report.md").write_text("\n".join(md)+"\n",encoding="utf-8")
 print(json.dumps(report["summary"],ensure_ascii=False))

if __name__=="__main__":
 asyncio.run(main())
