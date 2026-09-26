#!/usr/bin/env python3
import json, re, subprocess
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
BASE="52e5f9f02184581a1bfb1878c388ede3d1068c47"

def parse_data(text):
    return json.loads(text.split("var G=",1)[1].split(";G.pictos=",1)[0])

now=parse_data((ROOT/"assets/data/juegos-iris-data.js").read_text(encoding="utf-8"))
base_text=subprocess.check_output(["git","show",f"{BASE}:assets/data/juegos-iris-data.js"],cwd=ROOT,text=True)
old=parse_data(base_text)

assert len(old["juegos"])==252
assert len(now["juegos"])==297
assert now["juegos"][:252]==old["juegos"], "baseline 252 games changed"

new=[j for j in now["juegos"] if j.get("r40",{}).get("batch")=="R40-A1-45"]
assert len(new)==45
contexts=[c["id"] for c in now["cats"] if c["id"]!="todos"]
types=[t["id"] for t in now["tipos"]]
assert len(contexts)==9 and len(types)==5
assert {(j["r40"]["context"],j["r40"]["type"]) for j in new}=={(c,t) for c in contexts for t in types}
assert len({j["s"] for j in now["juegos"]})==297

def group(j):
    t=j["f"][0]["tipo"]
    if re.search(r"orden|siguiente|falta|primero",t): return "ordenar"
    if re.search(r"meter|elegir",t): return "elegir"
    if re.search(r"repartir|parejas|intruso|busca",t):
        return "planificar" if t=="repartir" and j["f"][0].get("libre") else "clasificar"
    if t=="memoria": return "memoria"
    return "planificar"

for j in new:
    assert j["e"]==["todas"]
    assert group(j)==j["r40"]["type"]
    assert j["t"].get("es") and j["t"].get("en") and j["d"].get("es") and j["d"].get("en")
    assert all(f.get("tipo")!="reloj" for f in j["f"])
    text=(j["t"]["es"]+" "+j["t"]["en"]+" "+j["d"]["es"]+" "+j["d"]["en"]).lower()
    assert "diagnóst" not in text and "diagnos" not in text
    assert "ranking" not in text and "streak" not in text

pic=(ROOT/"assets/data/pictogramas-iris.js").read_text(encoding="utf-8")
pic_keys=set(re.findall(r'(?:^|[,;{])\s*["\']?([A-Za-z0-9_]+)["\']?\s*:\s*\[',pic))
def refs(frame):
    out=[]
    for key in ("pasos","sec","banco","items","ops","destinos"):
        value=frame.get(key,[])
        if not isinstance(value,list): continue
        for x in value:
            if isinstance(x,str): out.append(x)
            elif isinstance(x,list) and x and isinstance(x[0],str): out.append(x[0])
    for key in ("ctx","destino","intruso"):
        if isinstance(frame.get(key),str): out.append(frame[key])
    return out
missing=sorted({k for j in new for frame in j["f"] for k in refs(frame) if k not in pic_keys})
assert not missing, missing

for rel in ("es/recursos/index.html","en/resources/index.html"):
    s=(ROOT/rel).read_text(encoding="utf-8")
    assert s.count("data-r40-resource")==5
    assert s.count('class="ri-card ri-card-compact"')==3
    assert "297" in s

for rel in ("es/recursos/juegos/index.html","en/resources/games/index.html"):
    s=(ROOT/rel).read_text(encoding="utf-8")
    block=s.split('<div class="jg-nojs">',1)[1].split('</ul></div>',1)[0]
    assert block.count("<li><strong>")==297

runtime=(ROOT/"assets/juegos-iris.js").read_text(encoding="utf-8")
for needle in ("¿Qué quieres practicar?","What do you want to practise?",'aria-controls="jg-advanced"', "D.cats.filter(function(c){return c.id!=='todos';})"):
    assert needle in runtime
assert "tipo:null,q:'',adv:false" in runtime

en_card=(ROOT/"en/resources/iris-card/index.html").read_text(encoding="utf-8")
assert '<html lang="en">' in en_card
assert 'canonical" href="https://irisgreen.eu/en/resources/iris-card/' in en_card
for bad in ("Escribe lo tuyo","Recursos gratuitos · apoyo visual","Empezar de nuevo","La tarjeta en texto"):
    assert bad not in en_card
es_card=(ROOT/"es/recursos/tarjeta-iris/index.html").read_text(encoding="utf-8")
assert 'hreflang="en" href="https://irisgreen.eu/en/resources/iris-card/' in es_card
card_js=(ROOT/"assets/tarjeta-iris.js").read_text(encoding="utf-8")
assert "document.documentElement.lang" in card_js
assert "irisgreen.eu/en/resources/iris-card/" in card_js

print(json.dumps({
    "status":"PASS",
    "baseline_games":252,
    "new_games":45,
    "total_games":297,
    "contexts":contexts,
    "types":types,
    "matrix_cells":45,
    "resources_primary":5,
    "resources_explore":3,
    "english_iris_card":True
},ensure_ascii=False,indent=2))
