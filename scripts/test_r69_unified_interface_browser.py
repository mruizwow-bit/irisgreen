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
    need(await page.locator("[data-ig-r49-stage]").count()==1,"global age control count !=1 "+path)
    need(await page.locator("#ig-page-finder").count()==0,"legacy page finder visible "+path)
    need(await page.locator(".ig42-stage-choice").count()==0,"Workshop duplicate age UI "+path)
    need(await page.locator(".ri-stage-section").count()==0,"Resources duplicate age UI "+path)
    need(await page.locator(".jg-stage-entry").count()==0,"Games duplicate age UI "+path)
    need(await page.locator(".im-stage-entry").count()==0,"Printable routines duplicate age UI "+path)
    need(await page.evaluate("Boolean(window.IGR49&&window.IGAudience&&window.IGPreferences&&window.IGTheme)"),
         "global runtime dependency missing "+path)
    for trigger,dialog in [
        ("[data-ig-r49-search]","#ig-r49-search"),
        ("[data-ig-r49-settings]","#ig-r49-settings"),
        ("[data-ig-r49-stage]","#ig-r49-audience"),
    ]:
        await page.locator(trigger).click()
        need(await page.locator(dialog+"[open]").count()==1,"global control did not open "+trigger+" "+path)
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

        # Global controls must be real controls, not decoration.
        await page.goto(BASE+"/es/recursos/",wait_until="networkidle")
        await page.wait_for_function("window.IGR49 && window.IGAudience")
        await page.locator("[data-ig-r49-search]").click()
        need(await page.locator("#ig-r49-search[open]").count()==1,"global search did not open")
        await page.keyboard.press("Escape")
        await page.locator("[data-ig-r49-settings]").click()
        need(await page.locator("#ig-r49-settings[open]").count()==1,"accessibility/settings did not open")
        await page.keyboard.press("Escape")
        await page.locator("[data-ig-music]").click()
        need(await page.locator("#ig-music-panel").count()==1,"music panel was not created")
        need(not await page.locator("#ig-music-panel").is_hidden(),"music panel did not open")
        await page.keyboard.press("Escape")
        await page.locator("[data-ig-r49-stage]").click()
        age=page.get_by_role("button",name="0–12 años",exact=True)
        need(await age.count()==1,"canonical age option missing")
        await age.click()
        need(await page.locator("html").get_attribute("data-ig-audience")=="AGE_0_12","AGE_0_12 not emitted")
        await page.keyboard.press("Escape")
        report["controls"]={"search":"PASS","accessibility":"PASS","music":"PASS","age":"PASS"}

        # Workshop must never expose the old full study before the R42 workspace.
        await page.goto(BASE+"/es/taller/programacion/",wait_until="domcontentloaded")
        await page.wait_for_function("document.querySelector('main#main')")
        first=await page.evaluate("""() => {
          const m=document.querySelector('main#main');
          return {active:m.classList.contains('ig42-active'),opacity:getComputedStyle(m).opacity,
                  marker:document.body.dataset.igR69Workshop||''};
        }""")
        need(first["marker"]=="1","Workshop R69 marker missing in browser")
        need(first["active"] or first["opacity"]=="0","legacy Workshop first paint can become visible")
        await page.wait_for_function("document.querySelector('main#main')?.classList.contains('ig42-active')")
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
