#!/usr/bin/env python3
from __future__ import annotations
import argparse, array, json, math, tempfile, time, urllib.error, urllib.request, wave
from pathlib import Path

EXPECTED={
 "es":{"id":"SABIK_ES_R01_FINAL","sha":"8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291",
       "text":"Vamos a revisar primero la idea principal y después podemos abrir las fuentes si lo necesitas."},
 "en":{"id":"SABIK_EN_R02_FINAL","sha":"3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df",
       "text":"We can check the main point first, and then open the sources if you want more detail."},
}

def req(url,method="GET",body=None,headers=None,timeout=120):
    r=urllib.request.Request(url,data=body,method=method,headers=headers or {})
    start=time.perf_counter()
    try:
        response=urllib.request.urlopen(r,timeout=timeout)
    except urllib.error.HTTPError as e:
        return e, start
    return response,start

def no_store(headers):
    return "no-store" in (headers.get("Cache-Control","").lower())

def wav_metrics(blob:bytes):
    with tempfile.NamedTemporaryFile(suffix=".wav",delete=False) as f:
        f.write(blob); path=Path(f.name)
    try:
        with wave.open(str(path),"rb") as w:
            channels=w.getnchannels(); sr=w.getframerate(); width=w.getsampwidth(); frames=w.getnframes()
            raw=w.readframes(frames)
        if width!=2:
            raise AssertionError(f"Expected PCM16 WAV, got sample width {width}")
        samples=array.array("h"); samples.frombytes(raw)
        if not samples: raise AssertionError("empty WAV")
        peak=max(abs(x) for x in samples)/32768.0
        rms=math.sqrt(sum(float(x)*x for x in samples)/len(samples))/32768.0
        return {
          "sample_rate":sr,"channels":channels,"sample_width_bytes":width,
          "frames":frames,"duration_s":frames/sr,
          "peak_dbfs":20*math.log10(max(peak,1e-12)),
          "rms_dbfs":20*math.log10(max(rms,1e-12)),
          "bytes":len(blob)
        }
    finally:
        path.unlink(missing_ok=True)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--base-url",default="http://127.0.0.1:8765/sabik-voice")
    ap.add_argument("--out",default="reports/eco-r66-private-runtime/real-model-probe.json")
    args=ap.parse_args()
    base=args.base_url.rstrip("/")
    report={"gate":"ECO_R66_REAL_MODEL_PROBE","base_url":base,"passed":False,"checks":{}}

    # Capabilities must be real and exact.
    resp,t0=req(base+"/capabilities",headers={"Accept":"application/json"},timeout=15)
    cap_latency=(time.perf_counter()-t0)*1000
    if getattr(resp,"status",None)!=200:
        raise SystemExit(f"capabilities HTTP {getattr(resp,'status',0)}")
    caps=json.loads(resp.read())
    assert caps.get("schema")=="iris-green/sabik-voice-runtime/v1"
    assert no_store(resp.headers)
    privacy=caps.get("privacy") or {}
    assert privacy.get("no_store") is True
    assert privacy.get("persist_audio") is False
    assert privacy.get("persist_transcript") is False
    for lang in ("es","en"):
        row=(caps.get("tts") or {}).get(lang) or {}
        assert row.get("self_hosted") is True
        assert row.get("model_id")==EXPECTED[lang]["id"]
        assert row.get("model_sha256")==EXPECTED[lang]["sha"]
    report["checks"]["capabilities"]={"pass":True,"latency_ms":round(cap_latency,2),"privacy":privacy}

    # Fail-closed check: wrong model ID must not synthesize.
    bad=json.dumps({"text":"identity mismatch probe","locale":"en","model_id":"WRONG_MODEL"}).encode()
    r,_=req(base+"/synthesize","POST",bad,{"Content-Type":"application/json","Accept":"audio/wav"},timeout=15)
    assert getattr(r,"status",None)==409
    report["checks"]["identity_mismatch"]={"pass":True,"http_status":409}

    # Real unseen dynamic synthesis.
    synth={}
    for lang in ("es","en"):
        body=json.dumps({"text":EXPECTED[lang]["text"],"locale":lang,"model_id":EXPECTED[lang]["id"]},ensure_ascii=False).encode("utf-8")
        response,t0=req(base+"/synthesize","POST",body,{"Content-Type":"application/json","Accept":"audio/wav"},timeout=180)
        header_ms=(time.perf_counter()-t0)*1000
        assert getattr(response,"status",None)==200
        assert no_store(response.headers)
        ctype=response.headers.get("Content-Type","").lower()
        assert ctype.startswith("audio/wav")
        first_t0=time.perf_counter()
        first=response.read(4096)
        first_read_ms=(time.perf_counter()-first_t0)*1000
        rest=response.read()
        total_ms=(time.perf_counter()-t0)*1000
        blob=first+rest
        metrics=wav_metrics(blob)
        assert metrics["duration_s"]>0.2
        assert metrics["sample_rate"]>=16000
        assert metrics["channels"] in (1,2)
        synth[lang]={
          "pass":True,
          "model_id":EXPECTED[lang]["id"],
          "response_headers_ms":round(header_ms,2),
          "first_read_ms":round(first_read_ms,2),
          "total_request_ms":round(total_ms,2),
          "audio":{k:(round(v,3) if isinstance(v,float) else v) for k,v in metrics.items()}
        }
    report["checks"]["synthesize"]=synth

    report["passed"]=True
    out=Path(args.out);out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps({"gate":"ECO_R66_REAL_MODEL_TTS_PROBE_PASS","es":True,"en":True,"passed":True},ensure_ascii=False))

if __name__=="__main__":
    main()
