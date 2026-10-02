#!/usr/bin/env python3
from __future__ import annotations
import json, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/"dist"
OUT=ROOT/"reports"/"sabik-voice-p0"
OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(PUBLIC),**kwargs)
    def log_message(self,*args): pass

INIT=r"""
(() => {
  window.__sabikSpeechMode='normal';
  window.__sabikSpoken=[];
  window.__sabikSynthCancelCount=0;
  window.__sabikAbortCount=0;
  window.__sabikRecognition=null;
  class FakeRecognition {
    constructor(){ window.__sabikRecognition=this; this.lang=''; this.continuous=false; this.interimResults=false; this.maxAlternatives=1; }
    start(){
      this.onstart?.();
      queueMicrotask(()=>{
        if(window.__sabikSpeechMode==='deny'){
          this.onerror?.({error:'not-allowed'}); this.onend?.(); return;
        }
        this.onaudiostart?.();
      });
    }
    stop(){}
    abort(){ window.__sabikAbortCount++; this.aborted=true; }
    final(text){
      const result=[{transcript:text}]; result.isFinal=true;
      this.onresult?.({results:[result],resultIndex:0});
      this.onaudioend?.(); this.onend?.();
    }
    silence(){ this.onaudioend?.(); this.onend?.(); }
  }
  class FakeUtterance {
    constructor(text){ this.text=text; this.lang=''; this.volume=1; this.rate=1; this.voice=null; }
  }
  const synth={
    current:null,
    getVoices(){return [{name:'Sabik ES test',lang:'es-ES'},{name:'Sabik EN test',lang:'en-GB'}];},
    speak(u){ this.current=u; window.__sabikSpoken.push({text:u.text,lang:u.lang,volume:u.volume,rate:u.rate,voice:u.voice?.lang||null}); queueMicrotask(()=>u.onstart?.()); },
    cancel(){ window.__sabikSynthCancelCount++; this.current=null; },
    pause(){}, resume(){},
  };
  window.__sabikEndSpeech=()=>{const u=synth.current;synth.current=null;u?.onend?.();};
  try{Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:FakeRecognition});}catch(_){window.SpeechRecognition=FakeRecognition;}
  try{Object.defineProperty(window,'webkitSpeechRecognition',{configurable:true,value:FakeRecognition});}catch(_){window.webkitSpeechRecognition=FakeRecognition;}
  try{Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:FakeUtterance});}catch(_){window.SpeechSynthesisUtterance=FakeUtterance;}
  try{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:synth});}catch(_){window.speechSynthesis=synth;}
  try{sessionStorage.setItem('ig-age-band-v2','AGE_0_12');}catch(_){}
})();
"""

def wait_ready(page):
    page.locator(".sabik-panel").wait_for(timeout=15000)
    page.locator("#sabik-hologram").wait_for(timeout=15000)
    page.wait_for_function("window.SabikWebPresentation && document.querySelector('#sabik-voice')")
    page.wait_for_function("window.IGAudience && window.IGSearch")
    page.evaluate("""()=>{
      window.__sabikStates=[document.querySelector('#sabik-hologram').dataset.state];
      new MutationObserver(()=>{
        const s=document.querySelector('#sabik-hologram').dataset.state;
        if(window.__sabikStates.at(-1)!==s)window.__sabikStates.push(s);
      }).observe(document.querySelector('#sabik-hologram'),{attributes:true,attributeFilter:['data-state']});
    }""")

def ordered(states, seq):
    pos=-1
    for value in seq:
        try: pos=states.index(value,pos+1)
        except ValueError: return False
    return True

def run_language(browser,base,lang,path,query):
    context=browser.new_context(viewport={"width":390,"height":844})
    context.add_init_script(INIT)
    page=context.new_page()
    js_errors=[];bad=[];external=[]
    page.on("pageerror",lambda e: js_errors.append(str(e)))
    page.on("console",lambda m: js_errors.append(m.text) if m.type=="error" else None)
    page.on("response",lambda r: bad.append((r.status,r.url)) if r.status>=400 and r.url.startswith(base) else None)
    page.on("request",lambda r: external.append(r.url) if not r.url.startswith(base) and not r.url.startswith(("data:","blob:")) else None)
    page.goto(base+path,wait_until="networkidle")
    wait_ready(page)
    assert page.evaluate("IGAudience.get()")=="AGE_0_12"
    assert page.locator("#sabik-voice").get_attribute("aria-pressed")=="false"

    # Text baseline: same query and same child-safe profile before voice.
    page.fill("#sabik-input",query)
    page.click("#sabik-submit")
    page.locator(".sabik-conversation-answer").wait_for(timeout=10000)
    text_answer=page.locator(".sabik-conversation-answer").inner_text()
    assert text_answer
    page.click("#sabik-reset")
    assert page.locator("#sabik-results").inner_text()==""

    # Explicit opt-in never autoplays.
    page.click("#sabik-voice")
    page.wait_for_function("document.querySelector('#sabik-voice').getAttribute('aria-pressed')==='true'")
    assert page.evaluate("window.__sabikSpoken.length")==0
    assert not page.locator("#sabik-mic").is_disabled()

    # Real-event lifecycle: listening -> processing -> speaking.
    page.evaluate("window.__sabikStates=[]")
    page.click("#sabik-mic")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='listening'")
    expected_recognition="en-GB" if lang=="en" else "es-ES"
    assert page.evaluate("window.__sabikRecognition.lang")==expected_recognition
    page.evaluate("(q)=>window.__sabikRecognition.final(q)",query)
    page.locator(".sabik-conversation-answer").wait_for(timeout=10000)
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='speaking'")
    voice_answer=page.locator(".sabik-conversation-answer").inner_text()
    assert voice_answer==text_answer,(lang,text_answer,voice_answer)
    spoken=page.evaluate("window.__sabikSpoken.at(-1)")
    assert spoken["text"]==voice_answer
    assert spoken["lang"]==expected_recognition
    states=page.evaluate("window.__sabikStates")
    assert ordered(states,["listening","processing","speaking"]),states

    # TTS end -> idle; repeat uses same visible response.
    page.evaluate("window.__sabikEndSpeech()")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='idle'")
    before=page.evaluate("window.__sabikSpoken.length")
    page.click("#sabik-voice-repeat")
    page.wait_for_function(f"window.__sabikSpoken.length==={before+1}")
    assert page.evaluate("window.__sabikSpoken.at(-1).text")==voice_answer
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='speaking'")
    cancel_before=page.evaluate("window.__sabikSynthCancelCount")
    page.click("#sabik-voice-stop")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='idle'")
    assert page.evaluate("window.__sabikSynthCancelCount")>cancel_before

    # Permission denied => clear message + text remains fully functional.
    page.evaluate("window.__sabikSpeechMode='deny'")
    page.click("#sabik-mic")
    needle="microphone" if lang=="en" else "micrófono"
    page.wait_for_function("(n)=>document.querySelector('#sabik-announcement').textContent.toLowerCase().includes(n)",needle)
    assert page.locator("#sabik-input").is_enabled()
    page.fill("#sabik-input",query)
    page.click("#sabik-submit")
    page.locator(".sabik-conversation-answer").wait_for(timeout=10000)
    page.wait_for_function("window.__sabikSpoken.length>0")
    page.evaluate("window.__sabikEndSpeech()")

    # Closing while listening cancels capture.
    page.evaluate("window.__sabikSpeechMode='normal'")
    abort_before=page.evaluate("window.__sabikAbortCount")
    page.click("#sabik-mic")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='listening'")
    page.click("#sabik-toggle")
    assert page.locator("#sabik-widget-body").is_hidden()
    assert page.evaluate("window.__sabikAbortCount")>abort_before
    page.click("#sabik-toggle")

    # Closing while speaking cancels TTS.
    page.click("#sabik-voice-repeat")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='speaking'")
    cancel_before=page.evaluate("window.__sabikSynthCancelCount")
    page.click("#sabik-toggle")
    assert page.evaluate("window.__sabikSynthCancelCount")>cancel_before
    page.click("#sabik-toggle")

    # A new query cancels an existing TTS playback before processing.
    page.click("#sabik-voice-repeat")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='speaking'")
    cancel_before=page.evaluate("window.__sabikSynthCancelCount")
    page.fill("#sabik-input",query)
    page.click("#sabik-submit")
    page.wait_for_function("(n)=>window.__sabikSynthCancelCount>n",cancel_before)
    page.locator(".sabik-conversation-answer").wait_for(timeout=10000)
    if page.evaluate("window.__sabikSpoken.length"):
        page.evaluate("window.__sabikEndSpeech()")

    # Motion preference never removes semantic state.
    for mode,expected in (("REDUCIDO","reduced"),("SIN_MOVIMIENTO","none")):
        page.select_option("#sabik-motion-level",mode)
        page.dispatch_event("#sabik-motion-level","change")
        page.wait_for_function("(m)=>document.querySelector('#sabik-hologram').dataset.motion===m",expected)
        page.click("#sabik-mic")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='listening'")
        page.click("#sabik-voice-stop")

    # Safety-profile changes clear voice/text residual state. ALL_AGES is not a user profile.
    for profile in ("AGE_13_17","AGE_18_PLUS","AGE_0_12"):
        page.fill("#sabik-input","residual")
        page.click("#sabik-mic")
        page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='listening'")
        page.evaluate("(p)=>IGAudience.set(p)",profile)
        page.wait_for_function("(p)=>IGAudience.get()===p",profile)
        assert page.input_value("#sabik-input")==""
        assert page.locator("#sabik-results").inner_text()==""
        assert page.locator("#sabik-hologram").get_attribute("data-state")=="idle"
    assert page.evaluate("IGAudience.set('ALL_AGES')") is False

    # In-place locale switch invalidates old transcript/answer/voice and reselects language.
    other="es" if lang=="en" else "en"
    page.fill("#sabik-input","residual")
    page.evaluate("(l)=>document.documentElement.lang=l",other)
    page.wait_for_timeout(80)
    assert page.input_value("#sabik-input")==""
    expected_label="Activar voz" if other=="es" else "Enable voice"
    assert expected_label in page.locator("#sabik-voice").inner_text()
    page.evaluate("(l)=>document.documentElement.lang=l",lang)

    assert not js_errors,js_errors
    assert not bad,bad
    result={
      "lang":lang,"path":path,"query":query,"text_voice_same_answer":True,
      "recognition_language":expected_recognition,"state_sequence":states,
      "permission_denied_fallback":True,"repeat_stop":True,"close_cancel":True,
      "profiles":["AGE_0_12","AGE_13_17","AGE_18_PLUS"],"all_ages_rejected":True,
      "motion":["REDUCIDO","SIN_MOVIMIENTO"],"js_errors":0,"same_origin_http_errors":0,
      "external_requests":sorted(set(external))
    }
    context.close()
    return result

def fallback_without_stt(browser,base):
    context=browser.new_context(viewport={"width":390,"height":844})
    context.add_init_script("""
      try{Object.defineProperty(window,'SpeechRecognition',{configurable:true,value:undefined});}catch(_){}
      try{Object.defineProperty(window,'webkitSpeechRecognition',{configurable:true,value:undefined});}catch(_){}
      try{sessionStorage.setItem('ig-age-band-v2','AGE_0_12');}catch(_){}
    """)
    page=context.new_page();page.goto(base+"/",wait_until="networkidle");wait_ready(page)
    page.click("#sabik-voice")
    page.wait_for_timeout(50)
    # If TTS exists the voice feature can be enabled, but mic remains unavailable.
    assert page.locator("#sabik-mic").is_disabled()
    page.fill("#sabik-input","ruido");page.click("#sabik-submit")
    page.locator(".sabik-conversation-answer").wait_for(timeout=10000)
    assert page.locator(".sabik-conversation-answer").inner_text()
    context.close()
    return True

def main():
    assert PUBLIC.is_dir(),"run canonical build first"
    assert (PUBLIC/"sabik/voice-runtime.mjs").is_file(),"voice runtime missing from dist/sabik"
    server=ThreadingHTTPServer(("127.0.0.1",0),Quiet)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f"http://127.0.0.1:{server.server_port}"
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch()
        es=run_language(browser,base,"es","/","ruido")
        en=run_language(browser,base,"en","/en/","noise")
        fallback=fallback_without_stt(browser,base)
        browser.close()
    finally:
      server.shutdown();server.server_close()
    report={"gate":"SABIK_ES_EN_VOICE_RUNTIME_QA_PASS","es":es,"en":en,"stt_unavailable_text_fallback":fallback,"passed":True}
    (OUT/"qa.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"gate":report["gate"],"es":True,"en":True,"fallback":fallback,"passed":True},ensure_ascii=False))

if __name__=="__main__":
    main()
