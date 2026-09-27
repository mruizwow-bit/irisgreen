#!/usr/bin/env python3
from __future__ import annotations
import argparse,json
from pathlib import Path
from apply_normalized_legal_r02 import FILES,PATCH

def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 blobs=[]
 for rel in FILES:
  p=root/rel;assert p.is_file(),p
  blobs.append(p.read_bytes())
  data=json.loads(blobs[-1]);rows=data["es"];by={r["id"]:r for r in rows}
  for rid,fields in PATCH.items():
   assert rid in by,rid
   for k,v in fields.items():assert by[rid].get(k)==v,(rid,k,by[rid].get(k),v)
 assert blobs[0]==blobs[1]
 # Specific regressions that motivated R02.
 parking=json.loads(blobs[0])["es"]
 by={r["id"]:r for r in parking}
 assert by["es-tarjeta-europea-estacionamiento"]["cuantia"]!="Gratuita"
 assert "5 de junio de 2027" in by["es-tarjeta-europea-discapacidad"]["obs"]
 assert by["es-perro-de-asistencia-acceso"]["fuente"].startswith("https://www.boe.es/")
 assert "2 de enero de 2027" in by["es-accesibilidad-cognitiva-rd-707-2026"]["obs"]
 print("R02_NORMALIZED_LEGAL_DATA_PASS")
if __name__=="__main__":main()
