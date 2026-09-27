#!/usr/bin/env python3
from __future__ import annotations
import argparse,json
from pathlib import Path
from apply_normalized_legal_r02 import FILES,PATCH

def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 blobs=[];observed=None
 for rel in FILES:
  p=root/rel;assert p.is_file(),p
  blobs.append(p.read_bytes())
  data=json.loads(blobs[-1]);rows=data["es"];by={r["id"]:r for r in rows}
  present=sorted(set(by)&set(PATCH));pending=sorted(set(PATCH)-set(by))
  now={"present":present,"pending":pending}
  if observed is None:observed=now
  else:assert observed==now,(observed,now)
  for rid in present:
   for k,v in PATCH[rid].items():assert by[rid].get(k)==v,(rid,k,by[rid].get(k),v)
 assert blobs[0]==blobs[1]
 status_path=root/"assets/content-safety/normalized-legal-r02-status.json"
 assert status_path.is_file(),status_path
 status=json.loads(status_path.read_text(encoding="utf-8"))
 assert sorted(status["applied"])==observed["present"]
 assert sorted(status["pending"])==observed["pending"]
 assert len(observed["present"])+len(observed["pending"])==4
 # As soon as R01/R02 general content is mounted, none may remain pending.
 if not observed["pending"]:
  by={r["id"]:r for r in json.loads(blobs[0])["es"]}
  assert by["es-tarjeta-europea-estacionamiento"]["cuantia"]!="Gratuita"
  assert "5 de junio de 2027" in by["es-tarjeta-europea-discapacidad"]["obs"]
  assert by["es-perro-de-asistencia-acceso"]["fuente"].startswith("https://www.boe.es/")
  assert "2 de enero de 2027" in by["es-accesibilidad-cognitiva-rd-707-2026"]["obs"]
 print("R02_NORMALIZED_LEGAL_DATA_PASS",observed)
if __name__=="__main__":main()
