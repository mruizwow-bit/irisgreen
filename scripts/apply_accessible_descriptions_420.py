#!/usr/bin/env python3
"""Integra de forma segura las 420 descripciones aprobadas (ES/EN).

Resuelve cada texto mediante un mapa explícito ruta→título aprobado. No cambia los
H1, no toca el cuerpo clínico ni las fuentes y no cambia grados de Condiciones: esa
clasificación se integra y audita en un paso independiente. Las 8 descripciones de
Vida diaria · Salir de casa usan la versión final posterior al paquete 420.

Sin --check aplica solo resúmenes/metadatos/tarjetas/buscador. Con --check no escribe
y falla si cualquiera de las 420 descripciones deja de coincidir.
"""
from __future__ import annotations

import argparse, base64, bz2, html, json, re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
import _legacy_apply_accessible_descriptions_420 as legacy

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "editorial" / "integration" / "2026-09-10"
ROUTE_MAP = DATA / "route-title-map.bz2.b64"
OVERRIDE = DATA / "vida_diaria_salir_de_casa_ES_EN.md"
ESTADO = DATA / "estado-integracion.json"

KEYS = {"situations":"situaciones", "conditions":"condiciones", "daily":"vida_diaria"}
EXPECTED = {"situations":187, "conditions":185, "daily":48}
BLOCK = re.compile(r"^##\s+\d+\.\s+([^\n]+)\n\n### ES\n([^\n]+)\n\n### EN\n([^\n]+)", re.M)
LEDE = re.compile(r'<p\b[^>]*class=["\'][^"\']*\blede\b', re.I)


def load_route_map():
    raw = bz2.decompress(base64.b64decode(ROUTE_MAP.read_text(encoding="ascii"))).decode("utf-8")
    data = json.loads(raw)
    for kind, key in KEYS.items():
        rows = data.get(key)
        if not isinstance(rows, dict) or len(rows) != EXPECTED[kind]:
            raise AssertionError(f"Mapa {key}: esperado {EXPECTED[kind]}, obtenido {0 if not isinstance(rows,dict) else len(rows)}")
        if len(set(rows.values())) != len(rows):
            raise AssertionError(f"Mapa {key}: títulos aprobados duplicados")
    return data


def load_override():
    rows = BLOCK.findall(OVERRIDE.read_text(encoding="utf-8"))
    if len(rows) != 8:
        raise AssertionError(f"Salir de casa: se esperaban 8 bloques, hay {len(rows)}")
    return {legacy.normalize(t): {"es": es.strip(), "en": en.strip()} for t, es, en in rows}


def h1(text):
    return legacy.extract_h1(text)


def first_chip(text):
    m = re.search(r'<p\b[^>]*class=["\'][^"\']*\bchips\b[^"\']*["\'][^>]*>.*?<span\b[^>]*class=["\'][^"\']*\bchip\b[^"\']*["\'][^>]*>(.*?)</span>', text, re.I|re.S)
    return html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else ""


def update_collection_json(path: Path, updates: dict[str,str], check: bool):
    data = json.loads(path.read_text(encoding="utf-8"))
    arr = data.get("fichas") or data.get("entries") or data.get("items")
    if not isinstance(arr, list):
        raise AssertionError(f"JSON de colección sin lista reconocible: {path}")
    by_title = {legacy.normalize(str(x.get("title",""))): x for x in arr}
    missing = []
    changed = 0
    for title, value in updates.items():
        rec = by_title.get(legacy.normalize(title))
        if rec is None:
            missing.append(title); continue
        if rec.get("lede") != value:
            rec["lede"] = value; changed += 1
    if missing:
        raise AssertionError(f"JSON {path}: faltan títulos {missing[:5]}")
    if check and changed:
        raise AssertionError(f"{path}: {changed} ledes todavía difieren")
    if not check and changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    return changed


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    route_map = load_route_map()
    payload = legacy.load_payload()
    descriptions = payload["descriptions"]
    counts = Counter(x["kind"] for x in descriptions)
    if counts != Counter(EXPECTED):
        raise AssertionError(f"Payload 420 incompleto: {counts}")

    by_kind = {kind: {legacy.normalize(x["title"]): dict(x) for x in descriptions if x["kind"] == kind} for kind in EXPECTED}
    for kind in EXPECTED:
        if len(by_kind[kind]) != EXPECTED[kind]:
            raise AssertionError(f"Payload {kind}: títulos duplicados")

    overrides = load_override()
    for key, values in overrides.items():
        if key not in by_kind["daily"]:
            raise AssertionError(f"Override sin ficha en payload: {key}")
        by_kind["daily"][key]["es"] = values["es"]
        by_kind["daily"][key]["en"] = values["en"]

    route_data = {}
    total_changes = Counter()
    daily_json = {"es": {}, "en": {}}

    for kind, cfg in legacy.COLLECTIONS.items():
        mapping = route_map[KEYS[kind]]
        pages = sorted(p for p in ROOT.glob(cfg["es_glob"]) if p.is_file())
        if len(pages) != EXPECTED[kind]:
            raise AssertionError(f"{kind}: esperadas {EXPECTED[kind]} páginas ES, hay {len(pages)}")
        if {legacy.route_for(p, ROOT) for p in pages} != set(mapping):
            raise AssertionError(f"{kind}: las rutas públicas ya no coinciden con el mapa aprobado")

        es_index_path = ROOT / cfg["es_index"]
        en_index_path = ROOT / cfg["en_index"]
        es_before_index = es_index_path.read_text(encoding="utf-8")
        en_before_index = en_index_path.read_text(encoding="utf-8")
        es_index, en_index = es_before_index, en_before_index
        used = set()

        for es_path in pages:
            es_route = legacy.route_for(es_path, ROOT)
            approved_title = mapping[es_route]
            k = legacy.normalize(approved_title)
            entry = by_kind[kind].get(k)
            if entry is None:
                raise AssertionError(f"{kind}: texto aprobado no encontrado para {es_route}: {approved_title}")
            if k in used:
                raise AssertionError(f"{kind}: texto aprobado usado dos veces: {approved_title}")
            used.add(k)

            es_text = es_path.read_text(encoding="utf-8")
            en_path = legacy.english_page(es_path, es_text, ROOT, cfg["en_prefix"])
            en_route = legacy.route_for(en_path, ROOT)
            en_text = en_path.read_text(encoding="utf-8")

            # Vida diaria tiene dos plantillas históricas: ES suele usar <section><p> y EN usa <p class="lede">.
            es_detail_kind = "conditions" if kind == "daily" and LEDE.search(es_text) else kind
            en_detail_kind = "conditions" if kind == "daily" and LEDE.search(en_text) else kind
            a = legacy.update_detail(es_path, es_detail_kind, entry["es"], None, args.check)
            b = legacy.update_detail(en_path, en_detail_kind, entry["en"], None, args.check)
            total_changes["detail_es"] += a["changed"]
            total_changes["detail_en"] += b["changed"]

            card_kind = "conditions" if kind == "situations" else kind
            es_index, _ = legacy.update_card(es_index, es_route, entry["es"], card_kind, None)
            en_index, _ = legacy.update_card(en_index, en_route, entry["en"], card_kind, None)

            add = None
            if kind == "daily":
                add = {"s":"Vida diaria","t":h1(es_text),"u":es_route,"d":entry["es"],"a":first_chip(es_text),
                       "en":{"s":"Everyday life","t":h1(en_text),"u":en_route,"d":entry["en"],"a":first_chip(en_text)}}
                daily_json["es"][h1(es_text)] = entry["es"]
                daily_json["en"][h1(en_text)] = entry["en"]
            route_data[es_route] = {"es":entry["es"],"en":entry["en"],"en_route":en_route,"kind":kind,"add":add}

        if used != set(by_kind[kind]):
            raise AssertionError(f"{kind}: no se han usado exactamente los {EXPECTED[kind]} textos aprobados")

        if args.check:
            if es_index != es_before_index or en_index != en_before_index:
                raise AssertionError(f"{kind}: las tarjetas del índice todavía difieren")
        else:
            if es_index != es_before_index:
                es_index_path.write_text(es_index, encoding="utf-8"); total_changes["index_files"] += 1
            if en_index != en_before_index:
                en_index_path.write_text(en_index, encoding="utf-8"); total_changes["index_files"] += 1

    sp = ROOT / "buscador.json"
    catalog = json.loads(sp.read_text(encoding="utf-8"))
    by_route = {x.get("u"): x for x in catalog}
    changed = 0; added = 0
    for route, d in route_data.items():
        rec = by_route.get(route)
        if rec is None:
            if d["kind"] != "daily":
                raise AssertionError(f"buscador.json no contiene {route}")
            rec = d["add"]; catalog.append(rec); by_route[route] = rec; added += 1
        if rec.get("d") != d["es"]:
            rec["d"] = d["es"]; changed += 1
        en = rec.get("en")
        if not isinstance(en, dict) or en.get("u") != d["en_route"]:
            raise AssertionError(f"buscador.json: pareja EN incorrecta para {route}")
        if en.get("d") != d["en"]:
            en["d"] = d["en"]; changed += 1
    if len({r for r in route_data if r in by_route}) != 420:
        raise AssertionError("buscador.json no cubre las 420 rutas")
    if args.check and (changed or added):
        raise AssertionError(f"buscador.json todavía difiere: {changed} campos, {added} altas")
    if not args.check and (changed or added):
        sp.write_text(json.dumps(catalog, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    total_changes["search_fields"] = changed
    total_changes["search_records_added"] = added

    total_changes["daily_json_es"] = update_collection_json(ROOT/"es/biblioteca/vida-diaria.json", daily_json["es"], args.check)
    total_changes["daily_json_en"] = update_collection_json(ROOT/"en/everyday-life/everyday-life.json", daily_json["en"], args.check)

    if args.check and (total_changes["detail_es"] or total_changes["detail_en"]):
        raise AssertionError(f"Las fichas todavía difieren: ES={total_changes['detail_es']} EN={total_changes['detail_en']}")

    if not args.check:
        estado = json.loads(ESTADO.read_text(encoding="utf-8")) if ESTADO.is_file() else {}
        estado["descripciones_420"] = {
            "aplicado": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "situaciones": 187,
            "condiciones": 185,
            "vida_diaria": 48,
            "idiomas": ["es", "en"],
        }
        ESTADO.write_text(json.dumps(estado, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")

    print(json.dumps({
        "mode":"check" if args.check else "apply",
        "approved_descriptions":420,
        "situations":187,
        "conditions":185,
        "daily":48,
        "routes":len(route_data),
        "daily_overrides":len(overrides),
        "changes":dict(total_changes),
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
