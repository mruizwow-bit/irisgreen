#!/usr/bin/env python3
import asyncio, json, math, os, re
from pathlib import Path
from playwright.async_api import async_playwright

BASE="http://127.0.0.1:8765"
OUT=Path("reports/r44-suite5-runtime")
OUT.mkdir(parents=True, exist_ok=True)

STUDIES=[
 {"id":"pixelart","es":"/es/taller/pixel-art/","en":"/en/workshop/pixel-art/","engine":"pixelart"},
 {"id":"writing","es":"/es/taller/escritura-restricciones/","en":"/en/workshop/constraint-writing/","engine":"escritura"},
 {"id":"board","es":"/es/taller/juegos-de-mesa/","en":"/en/workshop/board-games/","engine":"juegosmesa"},
 {"id":"rhythm","es":"/es/taller/ritmo/","en":"/en/workshop/rhythm-sequencer/","engine":"musica"},
 {"id":"videogames","es":"/es/taller/videojuegos/","en":"/en/workshop/video-game-design/","engine":"videojuegos"},
]
WIDTHS=[320,390,1440]
THEMES=["light","dark"]

LIGHT={
 "--ig-ink":"#17395C","--ig-ink-muted":"#435268","--ig-separator":"#D5E1EC",
 "--ig-control-border":"#7A869D","--ig-state-hover":"#E8F1F8","--ig-state-selected":"#17395C",
 "--ig-focus":"#5A49A8","--ig-surface-content":"#F4F7FA","--ig-surface-content-soft":"#EEF2F6",
}
DARK={
 "--ig-ink":"#EEF4F8","--ig-ink-muted":"#C9D5DD","--ig-separator":"#2A4460",
 "--ig-control-border":"#8494A8","--ig-state-hover":"#1D3D5C","--ig-state-selected":"#DCE8F2",
 "--ig-focus":"#C3B8FF","--ig-surface-content":"#15304A","--ig-surface-content-soft":"#1D3D5C",
}

def rgb_lum(s):
    m=re.match(r"rgba?\((\d+)[ ,]+(\d+)[ ,]+(\d+)", s or "")
    if not m: return None
    vals=[int(x)/255 for x in m.groups()]
    def lin(v): return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
    return .2126*lin(vals[0])+.7152*lin(vals[1])+.0722*lin(vals[2])

async def apply_theme(page, theme):
    vals=LIGHT if theme=="light" else DARK
    await page.evaluate("""vals => {
      const root=document.documentElement;
      for (const [k,v] of Object.entries(vals)) root.style.setProperty(k,v);
      root.dataset.igQaTheme = vals['--ig-ink']==='#EEF4F8' ? 'dark' : 'light';
    }""", vals)

async def theme_check(page, theme):
    sels=[".igs-toolbar",".igs-structure",".igs-sec"]
    info=await page.evaluate("""sels => sels.map(sel=>{
      const e=document.querySelector(sel); if(!e) return {sel,missing:true};
      const cs=getComputedStyle(e); return {sel,bg:cs.backgroundColor,fg:cs.color};
    })""", sels)
    bad=[]
    for x in info:
      if x.get("missing"): bad.append(f"missing {x['sel']}"); continue
      bl=rgb_lum(x["bg"]); fl=rgb_lum(x["fg"])
      if theme=="dark":
        if bl is None or bl>0.35: bad.append(f"{x['sel']} background not dark: {x['bg']}")
        if fl is None or fl<0.55: bad.append(f"{x['sel']} text not light: {x['fg']}")
      else:
        if bl is None or bl<0.65: bad.append(f"{x['sel']} background not light: {x['bg']}")
        if fl is None or fl>0.45: bad.append(f"{x['sel']} text not dark: {x['fg']}")
    return info,bad

async def interact(page, study, lang, audio=False):
    app=page.locator("#igt-app")
    if study=="pixelart":
        vp=page.locator(".igs-viewport")
        await vp.focus()
        await page.keyboard.press("Enter")
        await page.wait_for_timeout(100)
        dirty=await app.get_attribute("data-igs-dirty")
        return {"action":"keyboard paint pixel","dirty":dirty,"ok":dirty=="true"}
    if study=="writing":
        ta=page.locator("#igw-text")
        old=await ta.input_value()
        await ta.fill(old + (" prueba QA" if lang=="es" else " QA test"))
        await ta.blur()
        await page.wait_for_timeout(100)
        dirty=await app.get_attribute("data-igs-dirty")
        return {"action":"edit draft text","dirty":dirty,"ok":dirty=="true"}
    if study=="board":
        name="Jugar" if lang=="es" else "Play"
        await page.get_by_role("button", name=name, exact=True).click()
        tb=page.locator(".igj-turnbar")
        await tb.wait_for(state="visible")
        before=await tb.inner_text()
        roll="Tirar dados" if lang=="es" else "Roll dice"
        await page.get_by_role("button", name=roll, exact=True).click()
        await page.wait_for_timeout(80)
        after=await tb.inner_text()
        return {"action":"enter play mode + roll dice","before":before,"after":after,"ok":bool(after and after!=before)}
    if study=="rhythm":
        if audio:
            name="Reproducir" if lang=="es" else "Play"
            await page.get_by_role("button", name=name, exact=True).click()
            await page.wait_for_function("document.querySelector('#igt-app')?.dataset.igsPlaying === 'true'")
            await page.wait_for_timeout(500)
            playing=await app.get_attribute("data-igs-playing")
            stop="Parar" if lang=="es" else "Stop"
            await page.get_by_role("button", name=stop, exact=True).click()
            return {"action":"user-gesture audio play/stop","playing":playing,"ok":playing=="true"}
        # Real state change without starting audio in every matrix cell.
        num=page.locator(".igs-inspector input[type=number]").first
        old=float(await num.input_value())
        nv=old+1 if old<219 else old-1
        await num.fill(str(nv)); await num.blur(); await page.wait_for_timeout(80)
        dirty=await app.get_attribute("data-igs-dirty")
        return {"action":"change tempo/state","dirty":dirty,"ok":dirty=="true"}
    if study=="videogames":
        name="Jugar" if lang=="es" else "Play"
        await page.get_by_role("button", name=name, exact=True).click()
        cv=page.locator(".igs-game-canvas")
        await cv.wait_for(state="visible")
        await cv.focus(); await page.keyboard.press("ArrowRight"); await page.wait_for_timeout(100)
        pressed=await page.locator(".igs-toolbar .igs-primary").get_attribute("aria-pressed")
        return {"action":"enter playable game + input","pressed":pressed,"canvas":await cv.count(),"ok":pressed=="true"}
    return {"action":"none","ok":False}

async def run_case(browser, study, lang, width, theme, reduced=False, audio=False):
    context=await browser.new_context(viewport={"width":width,"height":900}, reduced_motion="reduce" if reduced else "no-preference")
    page=await context.new_page()
    errors=[]; page_errors=[]; bad_responses=[]; failed=[]; worklet=[]
    page.on("console", lambda msg: errors.append(msg.text) if msg.type=="error" else None)
    page.on("pageerror", lambda exc: page_errors.append(str(exc)))
    async def response(resp):
        if "ig-suite-meter-worklet.js" in resp.url: worklet.append({"url":resp.url,"status":resp.status})
        if resp.status==404 and resp.url.startswith(BASE): bad_responses.append(resp.url)
    page.on("response", response)
    page.on("requestfailed", lambda req: failed.append({"url":req.url,"error":req.failure}) if req.url.startswith(BASE) else None)
    route=study[lang]
    result={"study":study["id"],"lang":lang,"route":route,"width":width,"theme":theme,"reduced":reduced,"audio":audio}
    try:
        await page.goto(BASE+route, wait_until="domcontentloaded", timeout=30000)
        await page.locator("#igt-app[data-igs-mounted='true']").wait_for(timeout=15000)
        await apply_theme(page,theme)
        await page.wait_for_timeout(80)
        engine=await page.locator("#igt-app").get_attribute("data-igs-engine")
        mounted=await page.locator("#igt-app").get_attribute("data-igs-mounted")
        result["mount"]={"engine":engine,"mounted":mounted,"ok":engine==study["engine"] and mounted=="true"}
        ti,tbad=await theme_check(page,theme)
        result["theme_surfaces"]=ti; result["theme_errors"]=tbad
        if reduced:
            rm=await page.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
            trans=await page.locator(".igs-btn").first.evaluate("e=>getComputedStyle(e).transitionDuration")
            result["reduced_motion"]={"media":rm,"transition":trans,"ok":rm and trans in ("0s","0ms")}
        inter=await interact(page,study["id"],lang,audio=audio)
        result["interaction"]=inter
        await page.wait_for_timeout(120)
        result["js_errors"]=errors+page_errors
        result["404"]=bad_responses
        result["request_failed"]=failed
        result["worklet"]=worklet
        if audio:
            result["audio_ok"]=bool(worklet and all(x["status"]==200 for x in worklet))
        overflow=await page.evaluate("document.documentElement.scrollWidth <= innerWidth + 2")
        result["no_horizontal_overflow"]=overflow
        result["ok"]=result["mount"]["ok"] and inter["ok"] and not tbad and not result["js_errors"] and not bad_responses and not failed and overflow
        if reduced: result["ok"]=result["ok"] and result["reduced_motion"]["ok"]
        if audio: result["ok"]=result["ok"] and result["audio_ok"]
        if not result["ok"]:
            shot=OUT/f"FAIL-{study['id']}-{lang}-{width}-{theme}-rm{int(reduced)}-audio{int(audio)}.png"
            await page.screenshot(path=str(shot), full_page=True)
            result["screenshot"]=str(shot)
    except Exception as e:
        result["exception"]=repr(e); result["ok"]=False
        try:
            shot=OUT/f"EXC-{study['id']}-{lang}-{width}-{theme}-rm{int(reduced)}-audio{int(audio)}.png"
            await page.screenshot(path=str(shot), full_page=True); result["screenshot"]=str(shot)
        except Exception: pass
    finally:
        await context.close()
    return result

async def main():
    results=[]
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True)
        # Full viewport/language/theme matrix with one real interaction per case.
        for s in STUDIES:
            for lang in ("es","en"):
                for width in WIDTHS:
                    for theme in THEMES:
                        results.append(await run_case(browser,s,lang,width,theme))
        # Reduced-motion coverage per study/language/theme at mobile 390.
        for s in STUDIES:
            for lang in ("es","en"):
                for theme in THEMES:
                    results.append(await run_case(browser,s,lang,390,theme,reduced=True))
        # Audio/worklet: explicit user gesture in both languages and themes.
        rhythm=next(x for x in STUDIES if x["id"]=="rhythm")
        for lang in ("es","en"):
            for theme in THEMES:
                results.append(await run_case(browser,rhythm,lang,390,theme,audio=True))
        await browser.close()
    summary={
      "total":len(results),
      "pass":sum(1 for r in results if r.get("ok")),
      "fail":sum(1 for r in results if not r.get("ok")),
      "by_study":{},
    }
    for s in STUDIES:
        rs=[r for r in results if r["study"]==s["id"]]
        summary["by_study"][s["id"]]={"pass":sum(1 for r in rs if r.get("ok")),"fail":sum(1 for r in rs if not r.get("ok"))}
    (OUT/"results.json").write_text(json.dumps({"summary":summary,"results":results},ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(summary,ensure_ascii=False))
    if summary["fail"]:
        # concise failure reasons
        for r in results:
            if not r.get("ok"):
                print("FAIL",r["study"],r["lang"],r["width"],r["theme"],"rm",r["reduced"],"audio",r["audio"],
                      "theme=",r.get("theme_errors"),"js=",r.get("js_errors"),"404=",r.get("404"),
                      "interaction=",r.get("interaction"),"exc=",r.get("exception"))
        raise SystemExit(1)

if __name__=="__main__":
    asyncio.run(main())
