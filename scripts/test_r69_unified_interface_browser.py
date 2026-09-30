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
    if path in ("/","/en/"):
        need(await page.locator("[data-ig-audience-picker]").count()==1 and await page.locator("[data-ig-audience-stage]").count()==4,
             "Home canonical age picker missing "+path)
    else:
        need(await page.locator("[data-ig-audience-picker]").count()==0 and await page.locator("[data-ig-audience-stage]").count()==0,
             "local age picker exists outside Home "+path)
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

        # HUMAN QA regressions reported by María: product width, theme and alignment.
        await page.set_viewport_size({"width":1920,"height":1080})
        await page.goto(BASE+"/",wait_until="networkidle")
        home_layout=await page.evaluate("""() => {
          const R=e=>{const r=e.getBoundingClientRect();return {l:r.left,r:r.right,w:r.width};};
          const sels=['.ig-home-v4-hero','.ig-home-v4-section[aria-labelledby="ig-home-use"]','.ig-home-v4-sabik','.ig-home-v4-section[aria-labelledby="ig-home-discover"]'];
          const nodes=sels.map(s=>document.querySelector(s));
          return {wrap:R(document.querySelector('.ig-home-v4-wrap')),rects:nodes.map(R)};
        }""")
        need(home_layout["wrap"]["w"]>=1500,"Home still uses reading-width/product-too-narrow layout "+repr(home_layout))
        need(max(abs(r["l"]-home_layout["rects"][0]["l"]) for r in home_layout["rects"])<3,"Home sections do not share left axis "+repr(home_layout))
        need(max(abs(r["r"]-home_layout["rects"][0]["r"]) for r in home_layout["rects"])<3,"Home sections do not share right axis "+repr(home_layout))
        hero=await page.evaluate("""() => {
          const h=document.querySelector('.ig-home-v4-hero'),t=document.querySelector('#ig-home-v4-title'),s=document.querySelector('.ig-home-v4-search'),hc=getComputedStyle(h),tc=getComputedStyle(t),tr=t.getBoundingClientRect(),sr=s.getBoundingClientRect();
          return {display:hc.display,cols:hc.gridTemplateColumns,titleH:tr.height,lineH:parseFloat(tc.lineHeight),titleRight:tr.right,searchLeft:sr.left};
        }""")
        need(hero["display"]=="grid" and hero["cols"]!="none","Home hero is not using desktop two-column layout "+repr(hero))
        need(hero["titleH"]<=hero["lineH"]*1.25,"Home title still wraps on desktop "+repr(hero))
        need(hero["titleRight"]<hero["searchLeft"],"Home title/search columns overlap "+repr(hero))
        # Search must actually return content.
        q=page.locator("#ig-home-q");await q.fill("ruido");await page.wait_for_timeout(350)
        need(await page.locator("[data-ig-home-suggestions] .ig-home-result").count()>0,"Home search suggestions do not work")
        await page.locator("[data-ig-home-search] button[type=submit]").click();await page.wait_for_timeout(450)
        need(await page.locator("[data-ig-home-results] .ig-home-result").count()>0,"Home search submit does not return results")
        await q.fill("")
        await page.locator("#sabik-input").focus()
        sabik_field=await page.locator("#sabik-input").evaluate("(e)=>({bg:getComputedStyle(e).backgroundColor,color:getComputedStyle(e).color})")
        need(sabik_field["bg"]!="rgb(255, 255, 255)","Sabik textarea becomes glare-white on focus "+repr(sabik_field))
        need((await page.locator("#ig-home-v4-title").inner_text()).strip()=="Encuentra lo que necesitas","Home heading is still abstract")
        need(await page.locator("[data-ig-audience-stage]").count()==4,"Home age buttons disappeared")
        need(await page.locator("html").get_attribute("data-ig-safety-mode")=="safe-by-default","Home did not start child-safe")
        need(await page.locator("[data-ig-home-safe]").is_visible(),"Home child-safe status is not visible")
        await page.locator('[data-ig-audience-stage="AGE_18_PLUS"]').click()
        need(await page.locator("html").get_attribute("data-ig-safety-mode")=="adult-explicit","Explicit adult choice did not change safety mode")
        need(await page.locator("[data-ig-home-adult]").is_visible(),"Explicit adult status is not visible")
        await page.evaluate("IGAudience.clear()")
        footer_box=await page.locator(".ig-r49-global-footer .ig-r49-footer-inner").bounding_box()
        need(footer_box is not None and abs(footer_box["x"]-home_layout["wrap"]["l"])<3,"Home footer is not aligned to product axis "+repr(footer_box))
        lang_origin=await page.locator(".ig-r49-lang").evaluate("(a)=>new URL(a.href,location.href).origin===location.origin")
        need(lang_origin,"Language link leaves the current preview origin")
        await page.locator(".ig-r49-lang").click()
        await page.wait_for_load_state("networkidle")
        need(await page.locator("html").get_attribute("lang")=="en","EN did not open English Home")
        need((await page.locator("#ig-home-v4-title").inner_text()).strip()=="Find what you need","English Home heading missing")
        await page.goto(BASE+"/",wait_until="networkidle")
        report["human_qa_layout"]={"home_width":round(home_layout["wrap"]["w"]),"shared_axis":"PASS","sabik_focus_low_glare":"PASS","age_picker":4,"child_safe":"PASS","language_same_origin":"PASS","footer_axis":"PASS","hero_two_column":"PASS","search_live":"PASS"}

        await page.goto(BASE+"/es/investigacion/",wait_until="networkidle")
        need(await page.locator("body").get_attribute("data-ig-profile")=="browse","Research still classified as content")
        research=await page.evaluate("""() => {
          const m=document.querySelector('main'),a=m&&m.querySelector('article'),p=a&&a.querySelector('p');
          const r=m.getBoundingClientRect(),ac=a?getComputedStyle(a):null,pc=p?getComputedStyle(p):null;
          return {w:r.width,bg:ac&&ac.backgroundColor,color:pc&&pc.color};
        }""")
        need(research["w"]>=1350,"Research still too narrow "+repr(research))
        need(research["bg"]!="rgb(255, 255, 255)","Research card still white "+repr(research))
        need(research["color"] in ("rgb(238, 244, 248)","rgb(201, 213, 221)"),"Research text still low-contrast legacy color "+repr(research))
        report["research_hqa"]={"profile":"browse","width":round(research["w"]),"dark_cards":"PASS","text":"PASS"}

        await page.goto(BASE+"/es/libros/",wait_until="networkidle")
        await page.wait_for_selector(".ig-book-card",timeout=10000)
        await page.wait_for_selector(".ig-flipbook",timeout=10000)
        books=await page.evaluate("""() => {
          const m=document.querySelector('main'),c=document.querySelector('.ig-book-card'),f=document.querySelector('.ig-flipbook'),h=document.querySelector('.ig-flipbook-head h3');
          return {w:m.getBoundingClientRect().width,card:getComputedStyle(c).backgroundColor,flip:getComputedStyle(f).backgroundColor,title:getComputedStyle(h).color};
        }""")
        need(books["w"]>=1500,"Books still too narrow "+repr(books))
        need(books["card"]!="rgb(255, 255, 255)" and books["flip"]!="rgb(255, 255, 255)","Books reader/card still glare-white "+repr(books))
        need(books["title"]=="rgb(238, 244, 248)","Books reader heading still legacy dark ink "+repr(books))
        report["books_hqa"]={"width":round(books["w"]),"cards":"PASS","reader":"PASS"}

        await page.goto(BASE+"/es/tramites/directorio/",wait_until="networkidle")
        support=await page.evaluate("""() => {
          const m=document.querySelector('main'),s=document.querySelector('.ig-search-shell'),i=document.querySelector('.ig-search-input');
          return {w:m.getBoundingClientRect().width,bg:s&&getComputedStyle(s).backgroundColor,input:i&&getComputedStyle(i).backgroundColor};
        }""")
        need(support["w"]>=1500,"Support/directorio still too narrow "+repr(support))
        need(support["bg"]!="rgb(255, 255, 255)","Support search shell still white "+repr(support))
        report["support_hqa"]={"width":round(support["w"]),"search_surface":"PASS"}

        await page.goto(BASE+"/es/intereses/exoplanetas/",wait_until="networkidle")
        exo=await page.evaluate("""() => {
          const b=document.body,m=document.querySelector('main.igx'),card=document.querySelector('.topic-card');
          return {profile:b.dataset.igProfile||'',w:m?m.getBoundingClientRect().width:0,bg:card?getComputedStyle(card).backgroundColor:''};
        }""")
        need(exo["profile"]=="workspace","Exoplanets still classified as content "+repr(exo))
        need(exo["w"]>=1750,"Exoplanets interior still reading-width "+repr(exo))
        if exo["bg"]: need(exo["bg"]!="rgb(255, 255, 255)","Exoplanets topic card still legacy white "+repr(exo))
        report["interests_hqa"]={"profile":"workspace","width":round(exo["w"]),"theme":"PASS"}


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
        need(max(r["w"] for r in home["discoverRects"])<450,"Home discover cards are too wide for a three-card row "+repr(home["discoverRects"]))
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

        need(await page.locator("#sabik-hologram .sabik-orbit-layer").count()==2,"Sabik measured front/back layers missing")
        need(await page.locator("#sabik-hologram").get_attribute("data-render-active")=="true","Sabik layered render not active")
        sabik_visible=await page.evaluate("""() => {
          const v=document.querySelector('#sabik-hologram'),m=document.querySelector('#sabik-web-master'),r=v.getBoundingClientRect(),mr=m.getBoundingClientRect(),c=getComputedStyle(m);
          const controls=[document.querySelector('#sabik-voice'),document.querySelector('#sabik-reset'),document.querySelector('#sabik-motion-level')].map(e=>{const x=e.getBoundingClientRect();return {top:x.top,bottom:x.bottom,left:x.left};});
          return {vw:r.width,vh:r.height,mw:mr.width,mh:mr.height,clip:c.clipPath,natural:m.naturalWidth,controls};
        }""")
        need(sabik_visible["vw"]>=220 and sabik_visible["vh"]>=220 and sabik_visible["mw"]>=220 and sabik_visible["mh"]>=220,"Sabik visual collapsed or invisible "+repr(sabik_visible))
        need(sabik_visible["clip"] in ("none",""),"Sabik current master is incorrectly clipped "+repr(sabik_visible))
        need(sabik_visible["natural"]>0,"Sabik current master did not load")
        need(max(x["top"] for x in sabik_visible["controls"])-min(x["top"] for x in sabik_visible["controls"])<40,"Sabik controls are scattered vertically "+repr(sabik_visible["controls"]))
        await page.locator("#sabik-motion-level").select_option("NORMAL")
        before_layer=await page.locator(".sabik-back-layer").evaluate("(e)=>getComputedStyle(e).transform")
        await page.wait_for_timeout(300)
        after_layer=await page.locator(".sabik-back-layer").evaluate("(e)=>getComputedStyle(e).transform")
        need(before_layer!=after_layer,"Sabik layers do not move continuously in NORMAL")
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

        still_before=await page.locator(".sabik-back-layer").evaluate("(e)=>getComputedStyle(e).transform")
        await page.wait_for_timeout(300)
        still_after=await page.locator(".sabik-back-layer").evaluate("(e)=>getComputedStyle(e).transform")
        need(still_before==still_after,"Sabik layered motion continues in SIN_MOVIMIENTO")
        await page.screenshot(path=str(OUT/"home-sabik-pausa-no-motion-1440.png"),full_page=False)
        report["sabik"]={"masters":"PASS","visible":"PASS","layers":2,"controls":"COMPACT_ROW","continuous_normal":"PASS","r37_state_change":"PASS","no_motion":"PASS","dynamic_tts":"NOT_CLAIMED"}

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
