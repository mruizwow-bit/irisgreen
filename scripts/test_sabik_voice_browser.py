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

ES_ID="SABIK_ES_R01_FINAL"
ES_SHA="8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291"
EN_ID="SABIK_EN_R02_FINAL"
EN_SHA="3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df"

CAPABILITIES={
  "schema":"iris-green/sabik-voice-runtime/v1",
  "privacy":{"no_store":True,"persist_audio":False,"persist_transcript":False},
  "stt":{"self_hosted":True,"languages":["es","en"],"engine":"contract-stub"},
  "tts":{
    "es":{"self_hosted":True,"model_id":ES_ID,"model_sha256":ES_SHA},
    "en":{"self_hosted":True,"model_id":EN_ID,"model_sha256":EN_SHA},
  },
}

class Quiet(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(PUBLIC),**kwargs)
    def log_message(self,*args): pass

INIT=r"""
(() => {
  window.__sabikTrackStops=0;
  window.__sabikAudioInstances=[];
  class FakeTrack { stop(){ this.stopped=true; window.__sabikTrackStops++; } }
  class FakeRecorder {
    static isTypeSupported(){ return true; }
    constructor(stream,options={}){ this.stream=stream; this.mimeType=options.mimeType||'audio/webm'; this.state='inactive'; }
    start(){ this.state='recording'; queueMicrotask(()=>this.onstart?.()); }
    stop(){
      if(this.state==='inactive') return;
      this.state='inactive';
      queueMicrotask(()=>{
        this.ondataavailable?.({data:new Blob([new Uint8Array([1,2,3,4])],{type:this.mimeType})});
        this.onstop?.();
      });
    }
  }
  class FakeAudio {
    constructor(){
      this.src=''; this.preload=''; this.volume=1; this.playbackRate=1; this.paused=true;
      this.events=new Map(); window.__sabikAudioInstances.push(this);
    }
    addEventListener(type,fn){ this.events.set(type,fn); }
    removeAttribute(name){ if(name==='src')this.src=''; }
    load(){}
    pause(){ this.paused=true; }
    play(){ this.paused=false; queueMicrotask(()=>this.events.get('playing')?.()); return Promise.resolve(); }
    end(){ this.paused=true; this.events.get('ended')?.(); }
    fail(){ this.events.get('error')?.(); }
  }
  Object.defineProperty(window,'MediaRecorder',{configurable:true,value:FakeRecorder});
  Object.defineProperty(window.navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>({getTracks:()=>[new FakeTrack()]})}});
  Object.defineProperty(window,'Audio',{configurable:true,value:FakeAudio});

  // Browser/system TTS is explicitly forbidden for Sabik dynamic voice.
  try{Object.defineProperty(window,'speechSynthesis',{configurable:true,get(){throw new Error('BROWSER_TTS_FORBIDDEN');}});}catch(_){}
  try{Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,get(){throw new Error('BROWSER_TTS_FORBIDDEN');}});}catch(_){}

  window.__sabikAudioEnd=()=>window.__sabikAudioInstances.at(-1)?.end();
  try{sessionStorage.setItem('ig-age-band-v2','AGE_0_12');}catch(_){}
})();
"""

def wait_ready(page):
    page.locator(".sabik-panel").wait_for(timeout=15000)
    page.locator("#sabik-hologram").wait_for(timeout=15000)
    page.wait_for_function("window.SabikWebPresentation && document.querySelector('#sabik-voice')")
    page.wait_for_function("window.IGAudience && window.IGSearch")

def run_language(browser,base,lang,path,query):
    context=browser.new_context(viewport={"width":390,"height":844})
    context.add_init_script(INIT)
    page=context.new_page()
    js_errors=[];bad=[];tts_requests=[];transcribe_requests=[];route_hits=[]

    def voice_route(route):
        req=route.request
        pathname=urlsplit(req.url).path
        route_hits.append(pathname)
        if pathname.endswith("/capabilities"):
            route.fulfill(status=200,content_type="application/json",body=json.dumps(CAPABILITIES))
            return
        if pathname.endswith("/transcribe"):
            transcribe_requests.append(req.url)
            route.fulfill(status=200,content_type="application/json",body=json.dumps({
                "text":query,"locale":lang,"engine":"contract-stub","model":"stt-contract"
            }))
            return
        if pathname.endswith("/synthesize"):
            body=req.post_data_json or {}
            tts_requests.append(body)
            route.fulfill(status=200,headers={"content-type":"audio/wav","cache-control":"no-store"},body=b"RIFF\x04\x00\x00\x00WAVE")
            return
        route.fulfill(status=404,body="not found")

    page.route("**/sabik-voice/**",voice_route)
    page.on("pageerror",lambda e: js_errors.append(str(e)))
    page.on("console",lambda m: js_errors.append(m.text) if m.type=="error" else None)
    page.on("response",lambda r: bad.append((r.status,r.url)) if r.status>=400 and r.url.startswith(base) and "/sabik-voice/" not in r.url else None)

    page.goto(base+path,wait_until="networkidle")
    wait_ready(page)
    assert page.evaluate("IGAudience.get()")=="AGE_0_12"
    assert page.locator("#sabik-voice").get_attribute("aria-pressed")=="false"

    # Enable voice: service identity handshake, no autoplay.
    page.click("#sabik-voice")
    page.wait_for_timeout(600)
    pressed=page.locator("#sabik-voice").get_attribute("aria-pressed")
    if pressed!="true":
        raise AssertionError({
          "voice_not_enabled":True,
          "aria_pressed":pressed,
          "announcement":page.locator("#sabik-announcement").inner_text(),
          "route_hits":route_hits,
          "js_errors":js_errors,
          "bad":bad,
        })
    assert page.evaluate("window.__sabikAudioInstances.length")==0
    assert not page.locator("#sabik-mic").is_disabled()

    # Spoken turn: mic -> listening -> STT service -> same Sabik turn -> dynamic TTS service.
    page.evaluate("window.__sabikStates=[]; new MutationObserver(()=>{const s=document.querySelector('#sabik-hologram').dataset.state;if(window.__sabikStates.at(-1)!==s)window.__sabikStates.push(s);}).observe(document.querySelector('#sabik-hologram'),{attributes:true,attributeFilter:['data-state']});")
    page.click("#sabik-mic")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='listening'")
    page.click("#sabik-voice-stop")
    page.locator(".sabik-conversation-answer").wait_for(timeout=10000)
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='speaking'")
    answer=page.locator(".sabik-conversation-answer").inner_text()
    assert answer
    assert len(transcribe_requests)==1
    assert len(tts_requests)>=1

    expected_id=EN_ID if lang=="en" else ES_ID
    expected_locale=lang
    req=tts_requests[-1]
    assert req["model_id"]==expected_id,(lang,req)
    assert req["locale"]==expected_locale,(lang,req)
    assert req["text"]==answer,(lang,req,answer)

    states=page.evaluate("window.__sabikStates")
    for expected in ("listening","processing","speaking"):
        assert expected in states,(lang,states)

    # Playback end -> idle. Repeat must call service again with same canonical model.
    page.evaluate("window.__sabikAudioEnd()")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='idle'")
    before=len(tts_requests)
    page.click("#sabik-voice-repeat")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='speaking'")
    assert len(tts_requests)==before+1
    assert tts_requests[-1]["model_id"]==expected_id
    assert tts_requests[-1]["text"]==answer
    page.evaluate("window.__sabikAudioEnd()")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='idle'")

    # Closing while listening must stop capture.
    stops_before=page.evaluate("window.__sabikTrackStops")
    page.click("#sabik-mic")
    page.wait_for_function("document.querySelector('#sabik-hologram').dataset.state==='listening'")
    page.click("#sabik-toggle")
    assert page.locator("#sabik-widget-body").is_hidden()
    assert page.evaluate("window.__sabikTrackStops")>stops_before
    page.click("#sabik-toggle")

    assert not js_errors,js_errors
    assert not bad,bad
    result={
      "lang":lang,
      "model_id":expected_id,
      "model_sha256":EN_SHA if lang=="en" else ES_SHA,
      "voice_turn_service_calls":{"transcribe":len(transcribe_requests),"synthesize":len(tts_requests)},
      "state_sequence":states,
      "browser_tts_forbidden_guard":True,
      "same_origin_http_errors":0,
      "js_errors":0,
    }
    context.close()
    return result

def service_unavailable_fails_closed(browser,base):
    context=browser.new_context(viewport={"width":390,"height":844})
    context.add_init_script(INIT)
    page=context.new_page()
    page.route("**/sabik-voice/**",lambda route: route.fulfill(status=503,content_type="application/json",body='{"error":"unavailable"}'))
    page.goto(base+"/",wait_until="networkidle")
    wait_ready(page)
    page.click("#sabik-voice")
    page.wait_for_timeout(100)
    assert page.locator("#sabik-voice").get_attribute("aria-pressed")=="false"
    assert page.locator("#sabik-input").is_enabled()
    context.close()
    return True

def main():
    assert PUBLIC.is_dir(),"run canonical build first"
    assert (PUBLIC/"sabik/voice-runtime.mjs").is_file(),"voice runtime missing from dist/sabik"
    source=(ROOT/"sabik/voice-runtime.mjs").read_text(encoding="utf-8")
    assert "speechSynthesis" not in source and "SpeechSynthesisUtterance" not in source
    assert ES_ID in source and EN_ID in source and ES_SHA in source and EN_SHA in source

    server=ThreadingHTTPServer(("127.0.0.1",0),Quiet)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    base=f"http://127.0.0.1:{server.server_port}"
    try:
      with sync_playwright() as p:
        browser=p.chromium.launch()
        es=run_language(browser,base,"es","/","ruido")
        en=run_language(browser,base,"en","/en/","noise")
        unavailable=service_unavailable_fails_closed(browser,base)
        browser.close()
    finally:
      server.shutdown();server.server_close()

    report={
      "gate":"SABIK_VOICE_CLIENT_CONTRACT_BROWSER_PASS",
      "real_voice_service_exercised":False,
      "runtime_artifact_required":True,
      "es":es,"en":en,
      "service_unavailable_text_fallback":unavailable,
      "passed":True
    }
    (OUT/"qa.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"gate":report["gate"],"es":True,"en":True,"runtime_artifact_required":True,"passed":True},ensure_ascii=False))

if __name__=="__main__":
    main()
