#!/usr/bin/env python3
"""Apply the four audited R02 legal-data corrections to the published datasets.

This is an exact field-level delta; it does not replace the 2.2 MB catalogue.
"""
from __future__ import annotations
import argparse,json
from pathlib import Path

PATCH={
 "es-tarjeta-europea-discapacidad":{
  "obs":"La Directiva (UE) 2024/2841 entró en vigor el 4 de diciembre de 2024. Los Estados miembros deben adoptar y publicar las normas de transposición a más tardar el 5 de junio de 2027 y aplicarlas a partir del 5 de junio de 2028. A fecha de septiembre de 2026 la tarjeta todavía depende de la implementación nacional y no está disponible de forma general en toda la UE.",
  "obs_en":"Directive (EU) 2024/2841 entered into force on 4 December 2024. Member States must adopt and publish the transposing rules by 5 June 2027 and apply them from 5 June 2028. As of September 2026, the card still depends on national implementation and is not yet generally available across the EU."
 },
 "es-tarjeta-europea-estacionamiento":{
  "cuantia":"Puede ser gratuita o llevar una tasa limitada a los costes administrativos de expedición o renovación, según el Estado miembro.",
  "obs":"La Directiva (UE) 2024/2841 debe transponerse a más tardar el 5 de junio de 2027 y aplicarse desde el 5 de junio de 2028. La nueva tarjeta sustituirá progresivamente a las tarjetas anteriores; los Estados miembros pueden mantener el mismo efecto para tarjetas previas durante la transición y la sustitución debe completarse, como máximo, el 5 de diciembre de 2029.",
  "cuantia_en":"It may be free of charge or subject to a fee limited to the administrative costs of issuing or renewing it, depending on the Member State.",
  "obs_en":"Directive (EU) 2024/2841 must be transposed by 5 June 2027 and applied from 5 June 2028. The new card will progressively replace previous parking cards; Member States may keep equivalent effect for earlier cards during the transition, and replacement must be completed by 5 December 2029 at the latest."
 },
 "es-perro-de-asistencia-acceso":{
  "quien":"Personas que utilicen un perro de asistencia reconocido y que, con carácter general en la norma estatal, tengan reconocido un grado de discapacidad igual o superior al 33 %. Las comunidades autónomas y Ceuta y Melilla pueden reconocer además a otras personas usuarias, incluidas personas que necesiten perros de alerta médica o perros para personas con trastorno del espectro autista.",
  "obs":"El reconocimiento como perro de asistencia tiene validez en todo el territorio nacional. El perro pierde esa condición al retirarse de la actividad al alcanzar los diez años, salvo que un informe veterinario anual acredite desde entonces que mantiene condiciones físicas adecuadas.",
  "fuente":"https://www.boe.es/eli/es/rd/2025/05/27/409",
  "quien_en":"People who use a recognised assistance dog and who, as a general rule under the state regulation, have a recognised disability degree of 33% or more. Autonomous communities and Ceuta and Melilla may also recognise other users, including people who need medical alert dogs or assistance dogs for autistic people.",
  "obs_en":"Recognition as an assistance dog is valid throughout Spain. The dog loses that status on retirement at ten years of age unless an annual veterinary report from that point confirms that it remains physically fit."
 },
 "es-accesibilidad-cognitiva-rd-707-2026":{
  "obs":"Publicado en el BOE núm. 218, de 3 de septiembre de 2026. Entra en vigor el 2 de enero de 2027. El reglamento define de forma amplia las dificultades cognitivas, pero algunas obligaciones concretas tienen requisitos propios; por ejemplo, determinadas medidas del artículo 14 sobre empleo se aplican cuando la persona trabajadora acredita al menos un 33 % de discapacidad y discapacidad intelectual.",
  "obs_en":"Published in the Official State Gazette no. 218 of 3 September 2026. It enters into force on 2 January 2027. The regulation defines cognitive difficulties broadly, but some specific duties have their own eligibility rules; for example, certain employment measures in Article 14 apply when the worker proves a disability degree of at least 33% and an intellectual disability."
 }
}
FILES=("es/tramites/tramites-datos.json","es/tramites/directorio/tramites-datos.json")

def apply_file(path:Path):
 data=json.loads(path.read_text(encoding="utf-8"))
 rows=data.get("es") if isinstance(data,dict) else None
 if not isinstance(rows,list):raise AssertionError(f"{path}: expected top-level es list")
 by_id={r.get("id"):r for r in rows if isinstance(r,dict)}
 for rid,fields in PATCH.items():
  if rid not in by_id:raise AssertionError(f"{path}: missing {rid}")
  by_id[rid].update(fields)
 path.write_text(json.dumps(data,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
 return len(rows)

def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);a=ap.parse_args();root=a.root.resolve()
 counts=[]
 for rel in FILES:
  p=root/rel
  if not p.is_file():raise FileNotFoundError(p)
  counts.append(apply_file(p))
 first=(root/FILES[0]).read_bytes();second=(root/FILES[1]).read_bytes()
 assert first==second,"The two published tramites datasets diverged"
 print({"status":"PASS","patched_records":len(PATCH),"rows":counts[0],"datasets":len(FILES)})
if __name__=="__main__":main()
