#!/usr/bin/env python3
"""Publish Investigación safe-by-default.

Six S2 studies are removed from the public aggregate dataset and no-JS fallback.
Their full records are written as individual lazy chunks. Safe summaries live in
the controller and are shown only for intentional hash access or the adult lens.
"""
from __future__ import annotations
import argparse, html, json, re
from pathlib import Path

S2={5:"research-005",36:"research-036",37:"research-037",45:"research-045",46:"research-046",71:"research-071"}
NOSCRIPT=re.compile(r'<noscript\b[^>]*>.*?</noscript>',re.I|re.S)

def txt(row,lang,key,key_en=None):
    if lang=="en":
        return str(row.get(key_en or key+"_en") or row.get(key) or "")
    return str(row.get(key) or "")

def fallback(rows,lang):
    title="Investigación disponible sin JavaScript" if lang=="es" else "Research available without JavaScript"
    intro=("Esta versión segura muestra los estudios no clasificados como alta sensibilidad."
           if lang=="es" else
           "This safer version shows studies that are not classified as high sensitivity.")
    bits=[f'<noscript><main class="ig-research-nojs-safe"><h2>{html.escape(title)}</h2><p>{html.escape(intro)}</p>']
    for row in rows:
        heading=txt(row,lang,"heading","heading_en")
        paragraphs=row.get("text_en" if lang=="en" else "text") or []
        summary=paragraphs[0] if paragraphs else txt(row,lang,"means","means_en")
        bits.append(f'<article><h3>{html.escape(heading)}</h3><p>{html.escape(str(summary))}</p></article>')
    bits.append('</main></noscript>')
    return ''.join(bits)

def inject(text,needle,markup,where):
    return text if needle in text else text.replace(where,markup+where,1)

def main():
    ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
    data_path=root/"es/investigacion/estudios-textos.json"
    page_path=root/"es/investigacion/index.html"
    data=json.loads(data_path.read_text(encoding="utf-8"))
    if not isinstance(data,list) or not data:raise AssertionError("research dataset missing")
    by_n={int(r.get("n",0)):r for r in data}
    missing=sorted(set(S2)-set(by_n))
    if missing:raise AssertionError(f"S2 research records missing: {missing}")

    full_dir=root/"assets/content/full";full_dir.mkdir(parents=True,exist_ok=True)
    for n,cid in S2.items():
        row=by_n[n]
        for lang in ("es","en"):
            payload={"schema":"iris-green-s2-research-full-v1","content_id":cid,"study":n,"lang":lang,"record":row}
            (full_dir/f"{cid}.{lang}.json").write_text(json.dumps(payload,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")

    safe=[r for r in data if int(r.get("n",0)) not in S2]
    data_path.write_text(json.dumps(safe,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")

    text=page_path.read_text(encoding="utf-8")
    lang="en" if re.search(r'<html\b[^>]*lang=["\']en',text,re.I) else "es"
    # Current page is a shared ES route with dynamic language, so the no-JS fallback
    # is Spanish. JS switches card language dynamically.
    safe_nojs=fallback(safe,lang)
    if not NOSCRIPT.search(text):raise AssertionError("research noscript fallback missing")
    text=NOSCRIPT.sub(safe_nojs,text,count=1)
    text=inject(text,'/assets/ig-child-safety.css','<link rel="stylesheet" href="/assets/ig-child-safety.css">','</head>')
    text=inject(text,'/assets/ig-child-safety.js','<script defer src="/assets/ig-child-safety.js?v=r42-child-1"></script>','</body>')
    text=inject(text,'/assets/ig-child-safety-research.js','<script defer src="/assets/ig-child-safety-research.js?v=r42-child-1"></script>','</body>')
    page_path.write_text(text,encoding="utf-8")

    manifest={"schema":"iris-green-research-child-safe-split-v1","full_records":len(data),"safe_records":len(safe),"s2_records":len(S2),"s2_studies":sorted(S2)}
    out=root/"assets/content-safety/research-split.json";out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(json.dumps(manifest,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
    print({"status":"PASS",**manifest})

if __name__=="__main__":main()
