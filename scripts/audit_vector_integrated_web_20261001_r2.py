#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json,os,re
from pathlib import Path
from playwright.async_api import async_playwright,TimeoutError as PlaywrightTimeoutError

BASE=os.environ.get("IG_BASE_URL","http://127.0.0.1:4173").rstrip("/")
OUT=Path("reports/vector-integrated-web-audit-r2-20261001");OUT.mkdir(parents=True,exist_ok=True)
ROUTES=[
("home_es","/"),("home_en","/en/"),
("conditions_es","/es/neurodiversidad/condiciones/"),("conditions_en","/en/neurodiversity/conditions/"),
("autism_es","/es/neurodiversidad/condiciones/autismo/"),("autism_en","/en/neurodiversity/conditions/autism/"),
("situations_es","/es/situaciones/"),("situations_en","/en/situations/"),
("everyday_es","/es/biblioteca/"),("everyday_en","/en/everyday-life/"),
("research_es","/es/investigacion/"),("research_en_query","/es/investigacion/?lang=en"),
("data_es","/es/datos/"),("data_en","/en/data/"),
("support_es","/es/tramites/directorio/"),("support_en_query","/es/tramites/directorio/?lang=en"),
("resources_es","/es/recursos/"),("resources_en","/en/resources/"),
("games_es","/es/recursos/juegos/"),("games_en","/en/resources/games/"),
("visual_routines_es","/es/recursos/rutinas-visuales/"),("visual_routines_en","/en/resources/visual-routines/"),
("printables_es","/es/recursos/rutinas-imprimibles/"),("printables_en","/en/resources/printable-routines/"),
("videos_es","/es/videos/"),("videos_en_query","/es/videos/?lang=en"),
("books_es","/es/libros/"),("books_en_query","/es/libros/?lang=en"),
("interests_es","/es/intereses/"),("interests_en","/en/interests/"),
("workshop_es","/es/taller/"),("workshop_en","/en/workshop/"),
("quiet_es","/es/sitio-tranquilo/"),("quiet_en","/en/quiet-space/"),
("privacy_es","/es/privacidad/"),("privacy_en","/en/privacy/"),
("about_es","/es/sobre-iris-green/"),("about_en_query","/es/sobre-iris-green/?lang=en"),
]
VIEWPORTS={"desktop":{"width":1440,"height":900},"mobile390":{"width":390,"height":844},"mobile320":{"width":320,"height":800}}

async def inspect(browser,name,path,vp_name,vp):
 c=await browser.new_context(viewport=vp);p=await c.new_page()
 ce=[];pe=[];rf=[];bad=[];ext=[]
 p.on("console",lambda m:ce.append(m.text) if m.type=="error" else None)
 p.on("pageerror",lambda e:pe.append(str(e)))
 p.on("requestfailed",lambda r:rf.append({"url":r.url,"error":r.failure}))
 p.on("response",lambda r:bad.append({"url":r.url,"status":r.status}) if r.status>=400 else None)
 p.on("request",lambda r:ext.append(r.url) if r.url.startswith(("http://","https://")) and not r.url.startswith(BASE) else None)
 status=None;nav=None
 try:
  rr=await p.goto(BASE+path,wait_until="networkidle",timeout=20000);status=rr.status if rr else None
 except Exception as e: nav=repr(e)
 await p.wait_for_timeout(120)
 try:
  d=await p.evaluate("""() => {
   const R=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,top:r.top,bottom:r.bottom,left:r.left,right:r.right}};
   const vis=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0};
   const rgba=v=>{const m=String(v||'').match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);return m?[+m[1],+m[2],+m[3],m[4]===undefined?1:+m[4]]:null};
   const lum=x=>{const a=x.slice(0,3).map(c=>{c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
   const cr=(a,b)=>{const A=lum(a),B=lum(b),hi=Math.max(A,B),lo=Math.min(A,B);return (hi+.05)/(lo+.05)};
   const bgFor=e=>{let n=e;while(n&&n!==document.documentElement){const x=rgba(getComputedStyle(n).backgroundColor);if(x&&x[3]>=.92)return x;n=n.parentElement}return rgba(getComputedStyle(document.body).backgroundColor)};
   const root=getComputedStyle(document.documentElement),body=getComputedStyle(document.body);
   const tokens={page:root.getPropertyValue('--ig-bg-page').trim(),surface:root.getPropertyValue('--ig-bg-surface').trim(),soft:root.getPropertyValue('--ig-bg-surface-soft').trim(),text:root.getPropertyValue('--ig-text').trim(),muted:root.getPropertyValue('--ig-text-muted').trim()};
   const main=document.querySelector('main'),h1=main?.querySelector('h1')||document.querySelector('h1'),hs=h1?getComputedStyle(h1):null,hr=h1?R(h1):null;
   const lineH=hs?(parseFloat(hs.lineHeight)||parseFloat(hs.fontSize)*1.2):0;
   let box=h1?.parentElement||null;
   while(box&&box!==main&&box!==document.body){const r=box.getBoundingClientRect();if(r.width>innerWidth*.5&&r.height<700)break;box=box.parentElement}
   if(box===main||box===document.body)box=null;
   let overlaps=[];
   if(h1&&box){for(const e of box.children){if(e===h1||e.contains(h1)||h1.contains(e)||!vis(e))continue;const a=hr,b=R(e),ix=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)),iy=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));if(ix*iy>20)overlaps.push({tag:e.tagName,cls:String(e.className||'').slice(0,90),area:Math.round(ix*iy),rect:b});}}
   const allowed=new Set(['rgb(11, 26, 43)','rgb(21, 48, 74)','rgb(29, 61, 92)']);
   const off=[];const vpArea=innerWidth*innerHeight,limitY=innerHeight*1.8;
   const artSel='.im-sheet,.im-fit,.rv-sheet,.rv-print-document,.ri-art,.ri-paper,.ig-flip-page,.ig-flip-stage,img,svg,canvas,video,picture';
   for(const e of document.querySelectorAll('body *')){
    if(!vis(e)||e.matches(artSel)||e.closest(artSel))continue;
    const r=e.getBoundingClientRect();if(r.top>limitY||r.bottom<0||r.width*r.height<vpArea*.05)continue;
    const s=getComputedStyle(e),x=rgba(s.backgroundColor);if(!x||x[3]<.88)continue;
    if(allowed.has(s.backgroundColor)||s.backgroundColor===body.backgroundColor)continue;
    off.push({tag:e.tagName,id:e.id||'',cls:String(e.className||'').slice(0,100),bg:s.backgroundColor,rect:R(e),style:String(e.getAttribute('style')||'').slice(0,180)});
   }
   const low=[];
   for(const e of document.querySelectorAll('h1,h2,h3,h4,p,a,button,label,span,strong,small')){
    if(!vis(e)||!String(e.innerText||'').trim())continue;const r=e.getBoundingClientRect();if(r.top>innerHeight*1.45||r.bottom<0)continue;
    const s=getComputedStyle(e),fg=rgba(s.color),bg=bgFor(e);if(!fg||!bg)continue;const ratio=cr(fg,bg),fs=parseFloat(s.fontSize)||16;
    if(ratio<3.0)low.push({tag:e.tagName,cls:String(e.className||'').slice(0,80),text:String(e.innerText||'').trim().slice(0,100),fg:s.color,bg:'rgb('+bg.slice(0,3).join(', ')+')',ratio:Math.round(ratio*100)/100,fs});
   }
   const header=document.querySelector('.ig-r49-global-header'),footer=document.querySelector('.ig-r49-global-footer');
   return {lang:document.documentElement.lang||'',theme:document.documentElement.dataset.igTheme||'',profile:document.body?.dataset.igProfile||'',bodyBg:body.backgroundColor,tokens,
    shell:{header:document.querySelectorAll('.ig-r49-global-header').length,footer:document.querySelectorAll('.ig-r49-global-footer').length,headerRect:header?R(header):null},
    main:main?R(main):null,
    h1:h1?{text:String(h1.innerText||'').trim(),...hr,fontSize:hs.fontSize,lineHeight:lineH,lines:lineH?hr.h/lineH:0,clientWidth:h1.clientWidth,scrollWidth:h1.scrollWidth,whiteSpace:hs.whiteSpace,overflow:hs.overflow}:null,
    h1Box:box?{tag:box.tagName,cls:String(box.className||''),display:getComputedStyle(box).display,grid:getComputedStyle(box).gridTemplateColumns,rect:R(box)}:null,
    h1Overlaps:overlaps,offTheme:off.slice(0,20),lowContrast:low.slice(0,30),
    blocked:document.body?.hasAttribute('data-ig-audience-blocked')||false
   };
  }""")
 except Exception as e:d={"eval_error":repr(e)}
 try:await p.screenshot(path=str(OUT/f"{name}-{vp['width']}.png"),full_page=False)
 except:pass
 await c.close()
 flags=[]
 if status!=200:flags.append("HTTP_"+str(status))
 if nav:flags.append("NAV_ERROR")
 if pe:flags.append("PAGE_ERROR")
 if d.get("theme")!="dark":flags.append("NOT_DARK_DEFAULT")
 if d.get("bodyBg")!="rgb(11, 26, 43)":flags.append("NON_CANONICAL_CANVAS")
 if d.get("shell",{}).get("header")!=1:flags.append("HEADER_COUNT")
 if d.get("shell",{}).get("footer")!=1:flags.append("FOOTER_COUNT")
 h=d.get("h1")
 if h:
  if h.get("scrollWidth",0)>h.get("clientWidth",0)+3:flags.append("H1_TEXT_CLIPPED")
  if vp["width"]>=1200 and len(h.get("text",""))<=75 and h.get("lines",0)>1.45:flags.append("SHORT_H1_WRAPS_DESKTOP")
 if d.get("h1Overlaps"):flags.append("H1_OVERLAP")
 if d.get("offTheme"):flags.append("LARGE_OFF_THEME_SURFACE")
 if d.get("lowContrast"):flags.append("SEVERE_TEXT_CONTRAST")
 if name.endswith("_en_query") and not str(d.get("lang","")).lower().startswith("en"):flags.append("EN_QUERY_LANG_FAIL")
 return {"name":name,"path":path,"viewport_name":vp_name,"viewport":vp,"status":status,"nav_error":nav,"data":d,"flags":flags,"console_errors":ce[:15],"page_errors":pe[:15],"failed_requests":rf[:15],"bad_http":bad[:15],"external_requests":sorted(set(ext))[:30]}

async def safety(browser):
 out=[]
 routes=[("anorexia","/es/neurodiversidad/condiciones/anorexia-nerviosa/"),("abuse","/es/neurodiversidad/condiciones/abuso-y-explotacion/")]
 for key,path in routes:
  for mode in ("GENERAL","AGE_0_12","AGE_13_17","AGE_18_PLUS"):
   c=await browser.new_context(viewport={"width":1440,"height":900});p=await c.new_page();req=[]
   p.on("request",lambda r:req.append(r.url) if "/assets/safety/full/" in r.url else None)
   await p.goto(BASE+"/",wait_until="networkidle")
   if mode=="GENERAL":await p.evaluate("IGAudience.clear()")
   else:await p.evaluate("(m)=>IGAudience.set(m)",mode)
   await p.goto(BASE+path,wait_until="networkidle");await p.wait_for_timeout(120)
   pre={"safe":await p.locator("article[data-ig-s2-safe]").count(),"safe_visible":await p.locator("article[data-ig-s2-safe]").is_visible() if await p.locator("article[data-ig-s2-safe]").count() else False,
        "full":await p.locator("article[data-ig-s2-full]").count(),"button":await p.locator(".ig-s2-full-button").count(),
        "blocked":await p.locator("body").get_attribute("data-ig-audience-blocked") is not None,"main_inert":await p.locator("main").first.get_attribute("inert") is not None,"requests":len(req)}
   post=None
   if mode=="AGE_18_PLUS" and pre["button"]:
    await p.locator(".ig-s2-full-button").click();await p.wait_for_timeout(300)
    post={"full":await p.locator("article[data-ig-s2-full]").count(),"requests":len(req)}
   await p.screenshot(path=str(OUT/f"safety-{key}-{mode}.png"),full_page=False)
   out.append({"route":key,"mode":mode,"pre":pre,"post":post});await c.close()
 return out

async def sabik(browser):
 c=await browser.new_context(viewport={"width":1440,"height":900});p=await c.new_page();rf=[];resp=[]
 p.on("requestfailed",lambda r:rf.append({"url":r.url,"error":r.failure}))
 p.on("response",lambda r:resp.append({"url":r.url,"status":r.status}) if "sabik-asistente.netlify.app" in r.url else None)
 await p.goto(BASE+"/",wait_until="networkidle");await p.wait_for_function("window.SabikWebPresentation&&document.querySelector('#sabik-input')")
 asset=await p.locator("#sabik-web-master").get_attribute("src")
 await p.locator("#sabik-input").fill("El ruido me agota");await p.locator("#sabik-form").evaluate("(f)=>f.requestSubmit()")
 try:await p.wait_for_selector(".sabik-conversation-answer",timeout=7000)
 except PlaywrightTimeoutError:pass
 ans=await p.locator(".sabik-conversation-answer").all_inner_texts();srcs=await p.locator(".sabik-source-list a").count()
 await p.screenshot(path=str(OUT/"sabik-current-1440.png"),full_page=False)
 await c.close();return {"asset":asset,"answers":ans,"sources":srcs,"cloud_responses":resp,"failed_requests":rf[:20]}

async def main():
 report={"base":BASE,"routes":[]}
 async with async_playwright() as pw:
  b=await pw.chromium.launch()
  for n,path in ROUTES:
   for vn,vp in VIEWPORTS.items():report["routes"].append(await inspect(b,n,path,vn,vp))
  report["safety"]=await safety(b);report["sabik"]=await sabik(b);await b.close()
 flags={}
 for r in report["routes"]:
  for f in r["flags"]:flags[f]=flags.get(f,0)+1
 report["summary"]={"checks":len(report["routes"]),"flagged":sum(bool(r["flags"]) for r in report["routes"]),"flags":flags}
 (OUT/"report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print(json.dumps(report["summary"],ensure_ascii=False))
if __name__=="__main__":asyncio.run(main())
