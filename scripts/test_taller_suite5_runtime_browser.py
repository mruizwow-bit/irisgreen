#!/usr/bin/env python3
import asyncio, json, re
from pathlib import Path
from playwright.async_api import async_playwright

BASE="http://127.0.0.1:8765"
OUT=Path("reports/r44-suite5-token-qa")
OUT.mkdir(parents=True,exist_ok=True)

STUDIES=[
 {"id":"pixelart","es":"/es/taller/pixel-art/","en":"/en/workshop/pixel-art/","engine":"pixelart"},
 {"id":"writing","es":"/es/taller/escritura-restricciones/","en":"/en/workshop/constraint-writing/","engine":"escritura"},
 {"id":"board","es":"/es/taller/juegos-de-mesa/","en":"/en/workshop/board-games/","engine":"juegosmesa"},
 {"id":"rhythm","es":"/es/taller/ritmo/","en":"/en/workshop/rhythm-sequencer/","engine":"musica"},
 {"id":"videogames","es":"/es/taller/videojuegos/","en":"/en/workshop/video-game-design/","engine":"videojuegos"},
]
WIDTHS=[320,390,1440]
PALETTES={
 "light":{
  "--ig-bg-page":"#F6F8FB","--ig-bg-surface":"#F4F7FA","--ig-bg-surface-soft":"#EEF2F6",
  "--ig-text":"#17395C","--ig-text-muted":"#435268",
  "--ig-button-primary-bg":"#17395C","--ig-button-primary-fg":"#EEF4F8",
  "--ig-button-secondary-bg":"#E6F1F8","--ig-button-secondary-fg":"#17395C",
  "--ig-link":"#1F5F8B","--ig-accent":"#5A49A8","--ig-accent-secondary":"#197991",
  "--ig-border-control":"#7A869D","--ig-separator":"#D5E1EC","--ig-focus-global":"#5A49A8",
  "--ig-error":"#8A2942","--ig-success":"#1D6B3A",
  "--ig-ink":"#17395C","--ig-ink-muted":"#435268","--ig-control-border":"#7A869D",
  "--ig-state-hover":"#EEF2F6","--ig-state-selected":"#17395C","--ig-state-selected-ink":"#EEF4F8",
  "--ig-state-selected-soft":"#E6F1F8","--ig-focus":"#5A49A8",
  "--ig-surface-content":"#F4F7FA","--ig-surface-content-soft":"#EEF2F6"
 },
 "navy":{
  "--ig-bg-page":"#0B1A2B","--ig-bg-surface":"#15304A","--ig-bg-surface-soft":"#1D3D5C",
  "--ig-text":"#EEF4F8","--ig-text-muted":"#C9D5DD",
  "--ig-button-primary-bg":"#315774","--ig-button-primary-fg":"#EEF4F8",
  "--ig-button-secondary-bg":"#15304A","--ig-button-secondary-fg":"#EEF4F8",
  "--ig-link":"#9FDCEA","--ig-accent":"#C3B8FF","--ig-accent-secondary":"#9FDCEA",
  "--ig-border-control":"#8494A8","--ig-separator":"#2A4460","--ig-focus-global":"#C3B8FF",
  "--ig-error":"#FFB3C1","--ig-success":"#9BE0B4",
  "--ig-ink":"#EEF4F8","--ig-ink-muted":"#C9D5DD","--ig-control-border":"#8494A8",
  "--ig-state-hover":"#1D3D5C","--ig-state-selected":"#DCE8F2","--ig-state-selected-ink":"#0B1A2B",
  "--ig-state-selected-soft":"#15304A","--ig-focus":"#C3B8FF",
  "--ig-surface-content":"#15304A","--ig-surface-content-soft":"#1D3D5C"
 }
}

def rgb_tuple(s):
    m=re.match(r"rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)",s or "")
    return tuple(map(int,m.groups())) if m else None

def lum(rgb):
    vals=[v/255 for v in rgb]
    vals=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in vals]
    return .2126*vals[0]+.7152*vals[1]+.0722*vals[2]

def contrast(a,b):
    la,lb=lum(a),lum(b)
    hi,lo=max(la,lb),min(la,lb)
    return (hi+.05)/(lo+.05)

async def apply_palette(page,name):
    vals=PALETTES[name]
    await page.evaluate("""vals=>{
      let freeze=document.getElementById('ig-qa-freeze-motion');
      if(!freeze){
        freeze=document.createElement('style');
        freeze.id='ig-qa-freeze-motion';
        freeze.textContent='*,*::before,*::after{transition:none!important;animation:none!important}';
        document.head.appendChild(freeze);
      }
      const b=document.body;
      for(const [k,v] of Object.entries(vals)) b.style.setProperty(k,v,'important');
      b.dataset.igQaPalette=vals['--ig-ink']==='#EEF4F8'?'navy':'light';
    }""",vals)
    await page.wait_for_timeout(10)

async def inspect(page,palette):
    required=[
      ".igs-toolbar",
      ".igs-structure",
      ".igs-sec",
      ".igs-btn:not(.igs-primary):not([aria-pressed=\"true\"])"
    ]
    optional=[
      ".igs-field input:not([type=color]),.igs-field select,.igs-inline-select select"
    ]
    info=await page.evaluate("""({required,optional})=>{
      const out=[];
      for(const sel of required){
        const e=document.querySelector(sel);
        if(!e){out.push({sel,missing:true,required:true});continue;}
        const c=getComputedStyle(e);
        out.push({sel,bg:c.backgroundColor,fg:c.color,border:c.borderColor,required:true});
      }
      for(const sel of optional){
        const e=document.querySelector(sel);
        if(!e) continue;
        const c=getComputedStyle(e);
        out.push({sel,bg:c.backgroundColor,fg:c.color,border:c.borderColor,required:false});
      }
      return out;
    }""",{"required":required,"optional":optional})
    errors=[]
    for x in info:
        if x.get("missing"):
            errors.append("missing "+x["sel"])
            continue
        bg,fg=rgb_tuple(x["bg"]),rgb_tuple(x["fg"])
        if not bg or not fg:
            errors.append(f"{x['sel']} unreadable colors {x['bg']} / {x['fg']}")
            continue
        if palette=="navy":
            if lum(bg)>.35: errors.append(f"{x['sel']} not NAVY surface: {x['bg']}")
            if lum(fg)<.55: errors.append(f"{x['sel']} not light text: {x['fg']}")
        else:
            if lum(bg)<.55: errors.append(f"{x['sel']} not LIGHT surface: {x['bg']}")
            if lum(fg)>.5: errors.append(f"{x['sel']} not dark text: {x['fg']}")
        if contrast(bg,fg)<4.5:
            errors.append(f"{x['sel']} contrast {contrast(bg,fg):.2f}")

    selected=await page.evaluate("""()=>{
      const e=document.querySelector('.igs-btn:not(.igs-primary):not([aria-pressed="true"])');
      if(!e) return null;
      const old=e.getAttribute('aria-pressed');
      e.setAttribute('aria-pressed','true');
      const c=getComputedStyle(e);
      const out={bg:c.backgroundColor,fg:c.color};
      if(old===null)e.removeAttribute('aria-pressed'); else e.setAttribute('aria-pressed',old);
      return out;
    }""")
    if not selected:
        errors.append("missing neutral selectable suite button")
    else:
        bg,fg=rgb_tuple(selected["bg"]),rgb_tuple(selected["fg"])
        if not bg or not fg or contrast(bg,fg)<4.5:
            errors.append("selected contrast invalid "+str(selected))

    focus=await page.evaluate("""()=>{
      const e=document.querySelector('.igs-btn:not(.igs-primary)');
      if(!e) return null;
      e.focus();
      const c=getComputedStyle(e);
      return {outline:c.outlineColor,style:c.outlineStyle,width:c.outlineWidth};
    }""")
    if not focus:
        errors.append("missing focus target")
    return info,selected,focus,errors

async def run_case(browser,s,lang,width,palette):
    ctx=await browser.new_context(viewport={"width":width,"height":900})
    page=await ctx.new_page()
    js=[]; bad=[]; failed=[]
    page.on("console",lambda m: js.append(m.text) if m.type=="error" else None)
    page.on("pageerror",lambda e: js.append(str(e)))
    page.on("response",lambda r: bad.append(r.url) if r.status==404 and r.url.startswith(BASE) else None)
    page.on("requestfailed",lambda r: failed.append(r.url) if r.url.startswith(BASE) else None)
    out={"study":s["id"],"lang":lang,"width":width,"palette":palette}
    try:
        await page.goto(BASE+s[lang],wait_until="domcontentloaded",timeout=30000)
        await page.locator("#igt-app[data-igs-mounted='true']").wait_for(timeout=15000)
        out["engine"]=await page.locator("#igt-app").get_attribute("data-igs-engine")
        await apply_palette(page,palette)
        info,sel,focus,errs=await inspect(page,palette)
        out.update({"surfaces":info,"selected":sel,"focus":focus,"theme_errors":errs,"js_errors":js,"404":bad,"request_failed":failed})
        out["overflow"]=not await page.evaluate("document.documentElement.scrollWidth > innerWidth + 2")
        out["ok"]=out["engine"]==s["engine"] and not errs and not js and not bad and not failed and out["overflow"]
        if not out["ok"]:
            shot=OUT/f"FAIL-{s['id']}-{lang}-{width}-{palette}.png"
            await page.screenshot(path=str(shot),full_page=True)
            out["screenshot"]=str(shot)
    except Exception as e:
        out["ok"]=False
        out["exception"]=repr(e)
    finally:
        await ctx.close()
    return out

async def main():
    results=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True)
        for s in STUDIES:
            for lang in ("es","en"):
                for width in WIDTHS:
                    for palette in ("light","navy"):
                        results.append(await run_case(browser,s,lang,width,palette))
        await browser.close()

    grouped={}
    for r in results:
        grouped.setdefault((r["study"],r["lang"],r["width"]),{})[r["palette"]]=r
    delta_errors=[]
    for k,v in grouped.items():
        if "light" not in v or "navy" not in v:
            delta_errors.append(f"missing palette {k}")
            continue
        la={x["sel"]:x.get("bg") for x in v["light"].get("surfaces",[])}
        na={x["sel"]:x.get("bg") for x in v["navy"].get("surfaces",[])}
        for sel in (".igs-toolbar",".igs-structure",".igs-sec",".igs-btn:not(.igs-primary):not([aria-pressed=\"true\"])"):
            if la.get(sel)==na.get(sel):
                delta_errors.append(f"{k} {sel} did not change: {la.get(sel)}")

    summary={
      "total":len(results),
      "pass":sum(1 for r in results if r.get("ok")),
      "fail":sum(1 for r in results if not r.get("ok")),
      "delta_errors":delta_errors
    }
    (OUT/"results.json").write_text(json.dumps({"summary":summary,"results":results},ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(summary,ensure_ascii=False))
    if summary["fail"] or delta_errors:
        for r in results:
            if not r.get("ok"):
                print("FAIL",r["study"],r["lang"],r["width"],r["palette"],r.get("theme_errors"),r.get("js_errors"),r.get("404"),r.get("exception"))
        for e in delta_errors:
            print("DELTA_FAIL",e)
        raise SystemExit(1)

if __name__=="__main__":
    asyncio.run(main())
