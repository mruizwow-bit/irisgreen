#!/usr/bin/env python3
"""R69 · browser gate for the single Iris Green interface."""
from __future__ import annotations
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright

BASE=os.environ.get("IG_BASE_URL","http://127.0.0.1:4173").rstrip("/")
OUT=Path("reports/r69-unified-interface")

def need(v,m):
    if not v: raise AssertionError(m)

async def shell_ready(page,path):
    await page.goto(BASE+path,wait_until="networkidle")
    await page.wait_for_function(
        "document.querySelector('.ig-r49-global-header')?.dataset.igR49Upgraded==='true'"
    )
    need(await page.locator(".ig-r49-global-header").count()==1,"global header count !=1 "+path)
    need(await page.locator(".ig-r49-global-footer").count()==1,"global footer count !=1 "+path)
    need(await page.locator(".ig-r49-global-header.hd,.ig-r49-global-header.ig-home-header,.ig-r49-global-header.ig-uh").count()==0,
         "legacy header class still owns canonical shell "+path)
    need(await page.locator(".ig-r49-global-footer.ft,.ig-r49-global-footer.ig-home-footer").count()==0,
         "legacy footer class still owns canonical shell "+path)
    need(await page.locator("[data-ig-r49-search],[data-ig-r49-stage],[data-ig-r49-more]").count()==0,
         "extra controls remain in global header "+path)
    need(await page.locator("[data-ig-music]").count()==1 and await page.locator("[data-ig-r49-settings]").count()==1 and await page.locator(".ig-r49-lang").count()==1,
         "compact global header controls missing "+path)
    need(await page.locator("[data-ig-audience-picker]").count()==0 and await page.locator("[data-ig-audience-stage]").count()==0,
         "local age picker exists outside runtime "+path)
    need(await page.locator("#ig-page-finder").count()==0,"legacy page finder visible "+path)
    need(await page.locator(".ig42-stage-choice").count()==0,"Workshop duplicate age UI "+path)
    need(await page.locator(".igk-para").count()==0,"Workshop hub local «Para ti» age UI "+path)
    need(await page.locator(".ri-stage-section").count()==0,"Resources duplicate age UI "+path)
    need(await page.locator(".jg-stage-entry").count()==0,"Games duplicate age UI "+path)
    need(await page.locator(".im-stage-entry").count()==0,"Printable routines duplicate age UI "+path)
    need(await page.evaluate("Boolean(window.IGR49&&window.IGAudience&&window.IGPreferences&&window.IGTheme)"),
         "global runtime dependency missing "+path)
    visual=await page.evaluate("""() => {
      const body=getComputedStyle(document.body),h=document.querySelector('main h1'),hs=h?getComputedStyle(h):null;
      return {theme:document.documentElement.dataset.igTheme||'',bg:body.backgroundColor,
              bodyFont:body.fontFamily,h1Font:hs?hs.fontFamily:''};
    }""")
    need(visual["theme"]=="dark","route did not start in canonical dark theme "+path)
    need(visual["bg"]=="rgb(11, 26, 43)","route canvas is not canonical DARK NAVY "+path+" "+repr(visual))
    need("Atkinson" in visual["bodyFont"],"route body is not Atkinson "+path+" "+repr(visual))
    if visual["h1Font"]:
        need("Newsreader" in visual["h1Font"],"route heading is not Newsreader "+path+" "+repr(visual))
    large_white=await page.evaluate("""() => {
      const limit=innerWidth*innerHeight*.18, out=[];
      for(const e of document.querySelectorAll('body *')){
        if(e.matches('img,svg,canvas,.im-sheet,.rv-sheet,.rv-print-document,[hidden]')) continue;
        const r=e.getBoundingClientRect(),c=getComputedStyle(e);
        if(r.width*r.height<limit || r.bottom<=0 || r.top>=innerHeight) continue;
        if(c.display==='none'||c.visibility==='hidden'||Number(c.opacity)===0) continue;
        if(c.backgroundColor==='rgb(255, 255, 255)') out.push({tag:e.tagName,cls:e.className||'',w:Math.round(r.width),h:Math.round(r.height)});
      }
      return out.slice(0,8);
    }""")
    need(not large_white,"large pure-white surface in dark mode "+path+" "+repr(large_white))
    await page.locator("[data-ig-r49-settings]").click()
    need(await page.locator("#ig-r49-settings[open]").count()==1,"accessibility/settings did not open "+path)
    await page.keyboard.press("Escape")
    await page.locator("[data-ig-music]").click()
    need(await page.locator("#ig-music-panel").count()==1 and not await page.locator("#ig-music-panel").is_hidden(),
         "music control did not open "+path)
    await page.keyboard.press("Escape")
    # No external Google Fonts requests in the built product.
    urls=await page.evaluate("performance.getEntriesByType('resource').map(x=>x.name)")
    need(not any("fonts.googleapis.com" in u or "fonts.gstatic.com" in u for u in urls),
         "external Google Fonts request "+path)

async def main():
    OUT.mkdir(parents=True,exist_ok=True)
    report={}
    async with async_playwright() as p:
        browser=await p.chromium.launch()
        ctx=await browser.new_context(viewport={"width":1440,"height":900})
        page=await ctx.new_page()

        routes=[
          "/","/en/","/es/recursos/","/es/recursos/juegos/",
          "/es/recursos/rutinas-imprimibles/","/es/taller/",
          "/es/taller/programacion/","/es/sitio-tranquilo/"
        ]
        for path in routes:
            await shell_ready(page,path)
        report["shell"]={"routes":len(routes),"single_header_footer":"PASS","single_age_ui":"PASS","legacy_page_finder":0,"google_fonts_requests":0}

        # Home must render its navigation as real cards, never as inline link text.
        await page.goto(BASE+"/",wait_until="networkidle")
        await page.wait_for_function("document.querySelector('.ig-home-v4-use-grid') && document.querySelector('.ig-home-v4-discover-grid')")
        home=await page.evaluate("""() => {
          const use=[...document.querySelectorAll('.ig-home-v4-use-card')];
          const discover=[...document.querySelectorAll('.ig-home-v4-discover-grid .ig-home-v4-card')];
          const media=[...document.querySelectorAll('.ig-home-v4-card .ig-home-v4-media')];
          const rect=e=>{const r=e.getBoundingClientRect();return {w:r.width,h:r.height};};
          const shown=e=>{const r=e.getBoundingClientRect(),c=getComputedStyle(e);return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden';};
          return {
            useCount:use.length,discoverCount:discover.length,mediaCount:media.length,
            useGrid:getComputedStyle(document.querySelector('.ig-home-v4-use-grid')).display,
            discoverGrid:getComputedStyle(document.querySelector('.ig-home-v4-discover-grid')).display,
            useDisplays:use.map(e=>getComputedStyle(e).display),
            discoverDisplays:discover.map(e=>getComputedStyle(e).display),
            useRects:use.map(rect),discoverRects:discover.map(rect),
            visibleMedia:media.filter(shown).length
          };
        }""")
        need(home["useCount"]==4,"Home use cards count !=4 "+repr(home))
        need(home["discoverCount"]==9,"Home discover cards count !=9 "+repr(home))
        need(home["mediaCount"]==13 and home["visibleMedia"]==13,"Home card media not rendered "+repr(home))
        need(home["useGrid"]=="grid" and home["discoverGrid"]=="grid","Home card containers are not grids "+repr(home))
        need(all(x=="grid" for x in home["useDisplays"]+home["discoverDisplays"]),"Home anchors collapsed to inline text "+repr(home))
        need(all(r["w"]>150 and r["h"]>110 for r in home["useRects"]),"Home use cards have collapsed boxes "+repr(home))
        need(all(r["w"]>150 and r["h"]>100 for r in home["discoverRects"]),"Home discover cards have collapsed boxes "+repr(home))
        await page.screenshot(path=str(OUT/"home-cards-1440.png"),full_page=False)
        report["home_cards"]={"use":4,"discover":9,"media":13,"layout":"GRID_PASS"}


        # Header has only Music, Accessibility and language. AGE is an internal session runtime.
        await page.goto(BASE+"/es/recursos/",wait_until="networkidle")
        await page.wait_for_function("window.IGR49 && window.IGAudience")
        need(await page.locator("[data-ig-r49-search],[data-ig-r49-stage],[data-ig-r49-more]").count()==0,"extra header controls returned")
        await page.locator("[data-ig-r49-settings]").click()
        need(await page.locator("#ig-r49-settings[open]").count()==1,"accessibility/settings did not open")
        await page.keyboard.press("Escape")
        await page.locator("[data-ig-music]").click()
        need(await page.locator("#ig-music-panel").count()==1 and not await page.locator("#ig-music-panel").is_hidden(),"music panel did not open")
        await page.keyboard.press("Escape")
        await page.evaluate("IGAudience.set('AGE_0_12')")
        need(await page.locator("html").get_attribute("data-ig-audience")=="AGE_0_12","AGE_0_12 runtime not emitted")
        await page.evaluate("IGAudience.clear()")
        report["controls"]={"accessibility":"PASS","music":"PASS","language":"PASS","age_runtime":"PASS"}

        # Workshop hub consumes the same global AGE state; there is no second selector.
        await page.goto(BASE+"/es/taller/",wait_until="networkidle")
        await page.wait_for_function("window.IGAudience && document.querySelector('.ig-r49-global-header')")
        await page.evaluate("IGAudience.set('AGE_0_12')")
        await page.wait_for_timeout(80)
        visible_stage=await page.locator(".igk-start:not([hidden])").get_attribute("data-para")
        need(visible_stage=="AGE_0_12","Workshop hub did not follow global AGE_0_12")
        hrefs=await page.locator(".igk-start:not([hidden]) a.igk-tile").evaluate_all("els=>els.map(e=>e.getAttribute('href'))")
        need(all("para=AGE_" not in h and "for=AGE_" not in h for h in hrefs),
             "Workshop still propagates a second local age query")
        await page.evaluate("IGAudience.clear()")
        await page.wait_for_timeout(80)
        general=page.locator(".igk-start:not([hidden])")
        need(await general.count()==1,"Workshop hub did not return to one general/all-ages start view")
        general_stage=(await general.get_attribute("data-para")) or "ALL_AGES"
        need(general_stage=="ALL_AGES","Workshop general start view is not the all-ages view")
        report["workshop_age"]={"source":"IGAudience","local_selector":0,"AGE_0_12":"PASS","GENERAL":"PASS"}

        # Dynamic hubs stay navigable while only their long legacy fallback is suppressed.
        for path,marker,fallback in [
            ("/es/recursos/juegos/","igGamesReady","#jg-app>.jg-nojs"),
            ("/es/recursos/rutinas-imprimibles/","igPrintablesReady","#im-app>.jg-nojs"),
            ("/es/taller/","igWorkshopHubReady","main.igk>.igk-all"),
        ]:
            await page.goto(BASE+path,wait_until="domcontentloaded")
            need(await page.locator("main").is_visible(),"main hidden during first paint "+path)
            ready=await page.evaluate("(m)=>document.body.dataset[m]==='1'",marker)
            if not ready and await page.locator(fallback).count():
                need(await page.locator(fallback).is_hidden(),"legacy fallback visible before enhancement "+path)
            await page.wait_for_function("(m)=>document.body.dataset[m]==='1'",arg=marker)
        report["first_paint"]={"games":"PASS","printables":"PASS","workshop_hub":"PASS","page_never_hidden":"PASS"}

        # Workshop must never expose the old full study before the R42 workspace.
        await page.goto(BASE+"/es/taller/programacion/",wait_until="domcontentloaded")
        await page.wait_for_function("document.querySelector('main#main')")
        first=await page.evaluate("""() => {
          const m=document.querySelector('main#main'),c=getComputedStyle(m);
          return {active:m.classList.contains('ig42-active'),opacity:c.opacity,visibility:c.visibility,
                  marker:document.body.dataset.igR69Workshop||'',fallback:document.body.dataset.igR69WorkshopFallback||''};
        }""")
        need(first["marker"]=="1","Workshop R69 marker missing in browser")
        need(first["active"] or (first["opacity"]=="0" and first["visibility"]=="hidden"),
             "legacy Workshop first paint can become visible")
        await page.wait_for_function("document.querySelector('main#main')?.classList.contains('ig42-active')")
        need(await page.locator("body").get_attribute("data-ig-r69-workshop-fallback") is None,
             "Workshop fell back instead of mounting enhanced workspace")
        need(await page.locator(".ig42-workspace").count()==1,"Workshop workspace count !=1")
        need(await page.locator(".ig42-topbar").count()==1,"Workshop topbar count !=1")
        need(await page.locator(".ig42-stage-choice").count()==0,"Workshop local age selector returned")
        await page.screenshot(path=str(OUT/"workshop-programming-1440.png"),full_page=False)
        report["workshop"]={"no_legacy_first_paint":"PASS","workspace_count":1,"age_ui":"GLOBAL_ONLY"}

        # Sabik: current masters + R37 must visibly change state and obey no-motion.
        await page.goto(BASE+"/",wait_until="networkidle")
        await page.wait_for_function("window.SabikWebPresentation && window.SabikMotionR37")
        snap0=await page.evaluate("SabikWebPresentation.snapshot()")
        need(snap0.get("state")=="presente","Sabik did not start in PRESENTE")
        await page.evaluate("void SabikWebPresentation.setSabikState('orientar',{force:true,hold:true})")
        await page.wait_for_timeout(80)
        state=await page.locator("#sabik-hologram").get_attribute("data-web-state")
        src=await page.locator("#sabik-web-master").get_attribute("src")
        active=await page.locator("#sabik-hologram").get_attribute("data-motion-active")
        need(state=="ORIENTAR","Sabik ORIENTAR state not visible in DOM")
        need("web_orientar.png" in (src or ""),"Sabik ORIENTAR master not applied")
        need(active=="true","Sabik R37 motion did not become active")
        await page.locator("#sabik-motion-level").select_option("SIN_MOVIMIENTO")
        await page.evaluate("void SabikWebPresentation.setSabikState('pausa',{force:true,hold:true})")
        await page.wait_for_timeout(80)
        need(await page.locator("#sabik-hologram").get_attribute("data-motion-level")=="SIN_MOVIMIENTO","Sabik no-motion level not applied")
        need(await page.locator("#sabik-hologram").get_attribute("data-motion-active")=="false","Sabik moved in SIN_MOVIMIENTO")
        await page.screenshot(path=str(OUT/"home-sabik-pausa-no-motion-1440.png"),full_page=False)
        report["sabik"]={"masters":"PASS","r37_state_change":"PASS","no_motion":"PASS","dynamic_tts":"NOT_CLAIMED"}

        # Theme tokens should drive the same shell on both themes.
        await page.evaluate("IGTheme.set('light')")
        light=await page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--ig-bg-page').trim()")
        await page.evaluate("IGTheme.set('dark')")
        dark=await page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--ig-bg-page').trim()")
        need(light.upper()=="#F6F8FB","light global page token wrong")
        need(dark.upper()=="#0B1A2B","dark global page token wrong")
        report["theme"]={"light":light,"dark":dark,"global":"PASS"}

        await browser.close()

    (OUT/"browser.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False))

if __name__=="__main__":
    asyncio.run(main())
