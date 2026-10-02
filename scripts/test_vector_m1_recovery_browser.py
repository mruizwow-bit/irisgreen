#!/usr/bin/env python3
from __future__ import annotations
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright

BASE=os.environ.get("IG_BASE_URL","http://127.0.0.1:4173").rstrip("/")
OUT=Path("reports/vector-m1-recovery");OUT.mkdir(parents=True,exist_ok=True)

def need(v,m):
 if not v: raise AssertionError(m)

def rgb(v):
 import re
 m=re.match(r"rgba?\((\d+),\s*(\d+),\s*(\d+)",v or "")
 return tuple(map(int,m.groups())) if m else None

def lum(x):
 a=[]
 for c in x:
  n=c/255
  a.append(n/12.92 if n<=.04045 else ((n+.055)/1.055)**2.4)
 return .2126*a[0]+.7152*a[1]+.0722*a[2]

def ratio(a,b):
 A,B=lum(a),lum(b)
 return (max(A,B)+.05)/(min(A,B)+.05)

async def colours(page,sel):
 return await page.locator(sel).first.evaluate("""e=>{
   const s=getComputedStyle(e);return {color:s.color,bg:s.backgroundColor,border:s.borderColor}
 }""")

async def contrast_ok(page,sel,min_ratio=4.5):
 c=await colours(page,sel);fg=rgb(c["color"]);bg=rgb(c["bg"])
 if not bg or (bg==(0,0,0) and "rgba" in c["bg"]): 
  bg=rgb(await page.locator(sel).first.evaluate("e=>getComputedStyle(e.parentElement).backgroundColor"))
 return c,ratio(fg,bg) if fg and bg else None

async def main():
 report={}
 async with async_playwright() as pw:
  b=await pw.chromium.launch()
  p=await b.new_page(viewport={"width":1440,"height":900})

  # Home: no hidden overflow/overlap in either language.
  for path,key in [("/","es"),("/en/","en")]:
   await p.goto(BASE+path,wait_until="networkidle")
   h=await p.locator("#ig-home-v4-title").evaluate("""e=>{const r=e.getBoundingClientRect();return {cw:e.clientWidth,sw:e.scrollWidth,left:r.left,right:r.right,text:e.innerText}}""")
   s=await p.locator(".ig-home-v4-search").evaluate("""e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right}}""")
   need(h["sw"]<=h["cw"]+2,f"Home {key} H1 clipped {h}")
   need(h["right"]<s["left"],f"Home {key} H1 overlaps search: {h} {s}")
   report["home_"+key]={"h1":h,"search":s}

  # Shared editorial ledes use canonical muted token.
  for path,key in [
   ("/es/neurodiversidad/condiciones/","conditions"),
   ("/es/situaciones/","situations"),("/es/datos/","data")
  ]:
   await p.goto(BASE+path,wait_until="networkidle")
   c=await p.locator("main .lede").first.evaluate("e=>getComputedStyle(e).color")
   need(c=="rgb(201, 213, 221)",f"{key} lede not canonical muted {c}")
   report[key]={"lede":c}

  # About cards: no translucent LIGHT cards in DARK.
  await p.goto(BASE+"/es/sobre-iris-green/",wait_until="networkidle")
  about=await colours(p,".about-block")
  need(about["bg"]=="rgb(21, 48, 74)",f"About block still LIGHT {about}")
  ap=await p.locator(".about-block p").first.evaluate("e=>getComputedStyle(e).color")
  need(ap=="rgb(201, 213, 221)",f"About copy not canonical muted {ap}")
  report["about"]={"block":about,"copy":ap}

  # Support: filter chassis + generated result card must be DARK surfaces.
  await p.goto(BASE+"/es/tramites/directorio/",wait_until="networkidle")
  support_filter=await p.locator("main>div:has(>.ig-search-shell)").first.evaluate("e=>getComputedStyle(e).backgroundColor")
  support_card=await p.locator("main article").first.evaluate("e=>({bg:getComputedStyle(e).backgroundColor,title:getComputedStyle(e.querySelector('h2')).color,copy:getComputedStyle(e.querySelector('p')).color})")
  need(support_filter=="rgb(21, 48, 74)",f"Support filter still LIGHT {support_filter}")
  need(support_card["bg"]=="rgb(21, 48, 74)",f"Support card still LIGHT {support_card}")
  need(support_card["title"]=="rgb(238, 244, 248)",f"Support title wrong {support_card}")
  report["support"]={"filter":support_filter,"card":support_card}

  # Research filter chassis.
  await p.goto(BASE+"/es/investigacion/",wait_until="networkidle")
  research_filter=await p.locator("main>div:has(>.ig-search-shell)").first.evaluate("e=>getComputedStyle(e).backgroundColor")
  need(research_filter=="rgb(21, 48, 74)",f"Research filter still LIGHT {research_filter}")
  report["research"]={"filter":research_filter}

  # Videos: chassis/cards DARK; thumbnail remains artwork.
  await p.goto(BASE+"/es/videos/",wait_until="networkidle")
  video_filter=await p.locator("main>div:has(>.ig-search-shell)").first.evaluate("e=>getComputedStyle(e).backgroundColor")
  video_card=await p.locator("main div:has(>div>.ig-video-poster)").first.evaluate("e=>getComputedStyle(e).backgroundColor")
  need(video_filter=="rgb(21, 48, 74)",f"Video filter still LIGHT {video_filter}")
  need(video_card=="rgb(21, 48, 74)",f"Video card still LIGHT {video_card}")
  report["videos"]={"filter":video_filter,"card":video_card}

  # Tarjeta Iris: one coherent DARK card.
  await p.goto(BASE+"/es/neurodiversidad/condiciones/autismo/",wait_until="networkidle")
  iris=await p.locator(".iris-mini-card").evaluate("""e=>({
   card:getComputedStyle(e).backgroundColor,
   need:getComputedStyle(e.querySelector('.iris-mini-need')).backgroundColor,
   needText:getComputedStyle(e.querySelector('.iris-mini-need p')).color,
   action:getComputedStyle(e.querySelector('.iris-mini-action')).backgroundColor,
   actionText:getComputedStyle(e.querySelector('.iris-mini-action')).color
  })""")
  need(iris["card"]=="rgb(21, 48, 74)" and iris["need"]=="rgb(29, 61, 92)",f"Iris card hybrid {iris}")
  need(iris["needText"]=="rgb(201, 213, 221)",f"Iris need text wrong {iris}")
  report["iris_card"]=iris

  # Intentional paper stays white with dark ink despite global DARK theme.
  await p.goto(BASE+"/es/recursos/rutinas-imprimibles/",wait_until="networkidle")
  sh=await p.locator(".im-sheet .sh-t").first.evaluate("e=>({color:getComputedStyle(e).color,bg:getComputedStyle(e.closest('.im-sheet')).backgroundColor})")
  need(sh["bg"]=="rgb(255, 255, 255)" and rgb(sh["color"]) is not None and ratio(rgb(sh["color"]),(255,255,255))>=4.5,f"Printable white-on-white {sh}")
  await p.goto(BASE+"/es/recursos/rutinas-visuales/",wait_until="networkidle")
  rv=await p.locator(".rv-sheet .rv-sheet-title").first.evaluate("e=>({color:getComputedStyle(e).color,bg:getComputedStyle(e.closest('.rv-sheet')).backgroundColor})")
  need(rv["bg"]=="rgb(255, 255, 255)" and rgb(rv["color"]) is not None and ratio(rgb(rv["color"]),(255,255,255))>=4.5,f"Visual routine white-on-white {rv}")
  report["paper"]={"printable":sh,"visual":rv}

  # Games and Interests legacy metadata now consume canonical tokens.
  await p.goto(BASE+"/es/recursos/juegos/",wait_until="networkidle")
  gc=await p.locator(".jg-context-copy span").first.evaluate("e=>getComputedStyle(e).color")
  ga=await p.locator(".jg-context-arrow").first.evaluate("e=>getComputedStyle(e).color")
  need(gc=="rgb(201, 213, 221)" and ga=="rgb(159, 220, 234)",f"Games legacy colors remain {gc} {ga}")
  await p.goto(BASE+"/es/intereses/",wait_until="networkidle")
  ic=await p.locator(".ig-afondo-txt>span").first.evaluate("e=>getComputedStyle(e).color")
  ia=await p.locator(".ig-afondo-go").first.evaluate("e=>getComputedStyle(e).color")
  need(ic=="rgb(201, 213, 221)" and ia=="rgb(159, 220, 234)",f"Interests legacy colors remain {ic} {ia}")
  report["games_interests"]={"games_copy":gc,"games_link":ga,"interests_copy":ic,"interests_link":ia}

  # Mobile smoke for Home after breakpoint change.
  await p.set_viewport_size({"width":390,"height":844})
  await p.goto(BASE+"/",wait_until="networkidle")
  mh=await p.locator("#ig-home-v4-title").evaluate("e=>({cw:e.clientWidth,sw:e.scrollWidth,white:getComputedStyle(e).whiteSpace})")
  need(mh["sw"]<=mh["cw"]+2 and mh["white"]!="nowrap",f"Home mobile title broken {mh}")
  report["home_mobile"]=mh

  # Child-safe deep links: age discovery may hide the route, but the direct URL
  # must keep the safe variant usable and must never request the full S2 body.
  full_requests=[]
  p.on("request",lambda req: full_requests.append(req.url) if "/assets/safety/full/" in req.url else None)
  await p.goto(BASE+"/",wait_until="networkidle")
  await p.evaluate("IGAudience.set('AGE_0_12')")
  await p.goto(BASE+"/es/neurodiversidad/condiciones/anorexia-nerviosa/",wait_until="networkidle")
  need(await p.locator("article[data-ig-s2-safe]").is_visible(),"AGE_0_12 direct S2 URL hid the safe variant")
  need(await p.locator("body").get_attribute("data-ig-audience-blocked") is None,"AGE_0_12 direct S2 URL was page-blocked")
  need(await p.locator("article[data-ig-s2-full]").count()==0,"Full S2 body leaked into AGE_0_12 direct URL")
  need(len(full_requests)==0,"Full S2 asset requested in AGE_0_12 direct URL")
  report["child_safe_deep_link"]={"safe_visible":True,"full_dom":0,"full_requests":0}

  await b.close()
 (OUT/"m1.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print(json.dumps({"vector_m1":"PASS","checks":len(report)},ensure_ascii=False))

if __name__=="__main__":
 asyncio.run(main())
