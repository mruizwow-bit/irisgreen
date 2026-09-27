#!/usr/bin/env python3
from __future__ import annotations
import argparse,json
from pathlib import Path
from apply_normalized_legal_r02 import FILES,PATCH

def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 observed={}
 for rel in FILES:
  p=root/rel;assert p.is_file(),p
  data=json.loads(p.read_text(encoding="utf-8"))
  rows=data.get("es") if isinstance(data,dict) else None
  assert isinstance(rows,list),(rel,type(rows).__name__)
  by={r["id"]:r for r in rows if isinstance(r,dict) and r.get("id")}
  present=sorted(set(by)&set(PATCH));pending=sorted(set(PATCH)-set(by))
  observed[rel]={"present":present,"pending":pending}
  for rid in present:
   for k,v in PATCH[rid].items():
    assert by[rid].get(k)==v,(rel,rid,k,by[rid].get(k),v)
  assert len(present)+len(pending)==4,(rel,present,pending)

 status_path=root/"assets/content-safety/normalized-legal-r02-status.json"
 assert status_path.is_file(),status_path
 status=json.loads(status_path.read_text(encoding="utf-8"))
 for rel in FILES:
  sr=status["datasets"][rel]
  assert sorted(sr["applied"])==observed[rel]["present"],(rel,sr,observed[rel])
  assert sorted(sr["pending"])==observed[rel]["pending"],(rel,sr,observed[rel])

 # Once an individual dataset contains all four audited R02 records, exact legal
 # regressions become mandatory for that dataset.
 for rel,state in observed.items():
  if state["pending"]:continue
  data=json.loads((root/rel).read_text(encoding="utf-8"));by={r["id"]:r for r in data["es"]}
  assert by["es-tarjeta-europea-estacionamiento"]["cuantia"]!="Gratuita"
  assert "5 de junio de 2027" in by["es-tarjeta-europea-discapacidad"]["obs"]
  assert by["es-perro-de-asistencia-acceso"]["fuente"].startswith("https://www.boe.es/")
  assert "2 de enero de 2027" in by["es-accesibilidad-cognitiva-rd-707-2026"]["obs"]
 print("R02_NORMALIZED_LEGAL_DATA_PASS",observed)
if __name__=="__main__":main()
