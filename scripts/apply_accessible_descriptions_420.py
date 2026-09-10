#!/usr/bin/env python3
"""Apply the author-approved 10-09-2026 ES/EN summaries and final condition grades.

The compressed payload lives under editorial/integration/2026-09-10 and is never
published. This script does not rewrite titles or article bodies. It changes only:
- the short/lead description of the 420 approved entries;
- matching SEO/OG/JSON-LD descriptions;
- collection-card and global-search descriptions;
- the final A/B/C/BP/SG classification for the 185 Conditions.

Every mapping is one-to-one. If a page cannot be identified unambiguously, the
build stops instead of guessing.
"""
from __future__ import annotations

import argparse
import base64
import bz2
import html
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "editorial" / "integration" / "2026-09-10"

COLLECTIONS = {
    "situations": {
        "es_glob": "es/situaciones/*/index.html",
        "en_prefix": "en/situations/",
        "es_index": "es/situaciones/index.html",
        "en_index": "en/situations/index.html",
        "expected": 187,
    },
    "conditions": {
        "es_glob": "es/neurodiversidad/condiciones/*/index.html",
        "en_prefix": "en/neurodiversity/conditions/",
        "es_index": "es/neurodiversidad/condiciones/index.html",
        "en_index": "en/neurodiversity/conditions/index.html",
        "expected": 185,
    },
    "daily": {
        "es_glob": "es/biblioteca/*/index.html",
        "en_prefix": "en/everyday-life/",
        "es_index": "es/biblioteca/index.html",
        "en_index": "en/everyday-life/index.html",
        "expected": 48,
    },
}

GRADE_ALIASES = {
    "acoso escolar": "acoso escolar bullying",
    "caa": "caa comunicacion aumentativa y alternativa",
    "dcd dispraxia": "trastorno del desarrollo de la coordinacion dcd dispraxia",
    "dolor persistente cronico": "dolor persistente dolor cronico",
    "dolor reconocerlo y comunicarlo": "dolor",
    "osfed": "otros trastornos alimentarios especificados osfed",
    "pda evitacion persistente de demandas": "evitacion persistente de demandas perfil pda",
    "tept": "tept trastorno por estres postraumatico",
}


def normalize(value: str) -> str:
    value = html.unescape(re.sub(r"<[^>]+>", " ", value))
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = value.lower().replace("&", " y ")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return " ".join(value.split())


def load_payload() -> dict:
    parts = sorted(DATA_DIR.glob("payload.b64.part*"))
    if not parts:
        raise FileNotFoundError(f"No integration payload parts in {DATA_DIR}")
    encoded = "".join(p.read_text(encoding="ascii").strip() for p in parts)
    raw = bz2.decompress(base64.b64decode(encoded))
    payload = json.loads(raw.decode("utf-8"))
    if payload.get("version") != "2026-09-10":
        raise AssertionError("Unexpected integration payload version")
    return payload


def extract_h1(text: str) -> str:
    m = re.search(r"<h1\b[^>]*>(.*?)</h1>", text, re.I | re.S)
    if not m:
        raise AssertionError("Page has no h1")
    return html.unescape(re.sub(r"<[^>]+>", "", m.group(1))).strip()


def route_for(path: Path, root: Path) -> str:
    rel = path.relative_to(root).as_posix()
    if not rel.endswith("index.html"):
        raise AssertionError(rel)
    return "/" + rel[: -len("index.html")]


def english_page(es_path: Path, text: str, root: Path, prefix: str) -> Path:
    candidates = []
    for tag in re.findall(r"<(?:a|link)\b[^>]*>", text, re.I):
        if not re.search(r"\b(?:lang|hreflang)=[\"']en[\"']", tag, re.I):
            continue
        hm = re.search(r"\bhref=[\"']([^\"']+)[\"']", tag, re.I)
        if hm:
            candidates.append(hm.group(1))
    for href in candidates:
        parsed = urlparse(href)
        if parsed.scheme:
            target = root / parsed.path.lstrip("/")
        elif href.startswith("/"):
            target = root / href.lstrip("/")
        else:
            target = (es_path.parent / href).resolve()
        if str(target).endswith("/") or target.suffix == "":
            target = target / "index.html"
        try:
            rel = target.resolve().relative_to(root.resolve()).as_posix()
        except ValueError:
            continue
        if rel.startswith(prefix) and target.is_file():
            return target
    raise AssertionError(f"English equivalent not found for {es_path.relative_to(root)}")


def replace_attr_meta(text: str, key_attr: str, key_value: str, description: str) -> tuple[str, int]:
    escaped = html.escape(description, quote=True)
    tag_rx = re.compile(r'<meta\b[^>]*>', re.I)
    matches = []
    for m in tag_rx.finditer(text):
        tag = m.group(0)
        if not re.search(rf'\b{key_attr}=(?:"{re.escape(key_value)}"|\'{re.escape(key_value)}\')', tag, re.I):
            continue
        if not re.search(r'\bcontent=(?:"[^"]*"|\'[^\']*\')', tag, re.I | re.S):
            continue
        matches.append(m)
    if len(matches) != 1:
        return text, len(matches)
    m = matches[0]
    tag = m.group(0)
    tag2, n = re.subn(r'\bcontent=(?:"[^"]*"|\'[^\']*\')', f'content="{escaped}"', tag, count=1, flags=re.I | re.S)
    if n != 1:
        return text, 0
    return text[:m.start()] + tag2 + text[m.end():], 1


def replace_jsonld_description(text: str, description: str) -> tuple[str, int]:
    scripts = list(re.finditer(r'(<script\b[^>]*type=[\"\']application/ld\+json[\"\'][^>]*>)(.*?)(</script>)', text, re.I | re.S))
    if not scripts:
        return text, 0
    m = scripts[0]
    try:
        data = json.loads(html.unescape(m.group(2)))
    except json.JSONDecodeError:
        body, n = re.subn(r'("description"\s*:\s*)"(?:\\.|[^"\\])*"', lambda q: q.group(1) + json.dumps(description, ensure_ascii=False), m.group(2), count=1)
        if n != 1:
            return text, 0
    else:
        changed = False
        def walk(obj):
            nonlocal changed
            if isinstance(obj, dict):
                if not changed and obj.get("@type") in {"WebPage", "Article"} and "description" in obj:
                    obj["description"] = description
                    changed = True
                    return
                for value in obj.values():
                    walk(value)
            elif isinstance(obj, list):
                for value in obj:
                    walk(value)
        walk(data)
        if not changed:
            return text, 0
        body = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return text[:m.start(2)] + body + text[m.end(2):], 1


def replace_visible_summary(text: str, kind: str, description: str) -> tuple[str, int]:
    visible = html.escape(description, quote=False)
    if kind in {"situations", "conditions"}:
        rx = re.compile(r'(<p\b[^>]*class=[\"\'][^\"\']*\blede\b[^\"\']*[\"\'][^>]*>).*?(</p>)', re.I | re.S)
        return rx.subn(lambda m: m.group(1) + visible + m.group(2), text, count=1)
    h1 = re.search(r"</h1>", text, re.I)
    if not h1:
        return text, 0
    tail = text[h1.end():]
    rx = re.compile(r'(<section\b[^>]*class=[\"\'][^\"\']*\bsec\b[^\"\']*[\"\'][^>]*>\s*<p\b[^>]*>).*?(</p>)', re.I | re.S)
    tail2, n = rx.subn(lambda m: m.group(1) + visible + m.group(2), tail, count=1)
    return text[:h1.end()] + tail2, n


def update_detail(path: Path, kind: str, description: str, grade: str | None, check_only: bool) -> dict:
    before = path.read_text(encoding="utf-8")
    text, visible_n = replace_visible_summary(before, kind, description)
    text, meta_n = replace_attr_meta(text, "name", "description", description)
    text, og_n = replace_attr_meta(text, "property", "og:description", description)
    text, jsonld_n = replace_jsonld_description(text, description)
    grade_n = 0
    if grade is not None:
        chips_rx = re.compile(r'(<p\b[^>]*class=[\"\'][^\"\']*\bchips\b[^\"\']*[\"\'][^>]*>)(.*?)(</p>)', re.I | re.S)
        cm = chips_rx.search(text)
        if not cm:
            raise AssertionError(f"Condition chips row not found: {path}")
        open_tag, body, close_tag = cm.group(1), cm.group(2), cm.group(3)
        if re.search(r'\bdata-grado=[\"\'][^\"\']*[\"\']', open_tag, re.I):
            open_tag = re.sub(r'data-grado=[\"\'][^\"\']*[\"\']', f'data-grado="{grade}"', open_tag, count=1, flags=re.I)
        else:
            open_tag = open_tag[:-1] + f' data-grado="{grade}">'
        body = re.sub(
            r'<span\b[^>]*class=[\"\'][^\"\']*\bchip\b[^\"\']*\balt\b[^\"\']*[\"\'][^>]*>\s*(?:A/B|B/C|A|B|C|BP|SG|sin grado|no grade)\s*</span>',
            '', body, flags=re.I)
        body = body + f'<span class="chip alt">{grade}</span>'
        replacement = open_tag + body + close_tag
        text = text[:cm.start()] + replacement + text[cm.end():]
        grade_n = 1
    if visible_n != 1:
        raise AssertionError(f"Summary not found exactly once: {path}")
    if meta_n != 1 or og_n != 1:
        raise AssertionError(f"SEO description fields incomplete: {path} meta={meta_n} og={og_n}")
    if "application/ld+json" in before and jsonld_n != 1:
        raise AssertionError(f"JSON-LD description not updated: {path}")
    if grade is not None and grade_n != 1:
        raise AssertionError(f"Condition grade not updated: {path}")
    if not check_only and text != before:
        path.write_text(text, encoding="utf-8")
    return {"changed": int(text != before), "jsonld": jsonld_n}


def update_card(index: str, route: str, description: str, kind: str, grade: str | None) -> tuple[str, int]:
    route_esc = re.escape(route)
    if kind == "situations":
        rx = re.compile(rf'<article\b[^>]*\bdata-card\b[^>]*>.*?href=[\"\'][^\"\']*{route_esc}[\"\'].*?</article>', re.I | re.S)
    else:
        rx = re.compile(rf'<a\b[^>]*class=[\"\'][^\"\']*\bcard\b[^\"\']*[\"\'][^>]*href=[\"\'][^\"\']*{route_esc}[\"\'][^>]*>.*?</a>', re.I | re.S)
    matches = list(rx.finditer(index))
    if len(matches) != 1:
        raise AssertionError(f"Expected one catalog card for {route}; found {len(matches)}")
    m = matches[0]
    block = m.group(0)
    visible = html.escape(description, quote=False)
    if kind == "situations":
        block2, n = re.subn(r'(</a>\s*<p\b[^>]*>).*?(</p>)', lambda q: q.group(1) + visible + q.group(2), block, count=1, flags=re.I | re.S)
    else:
        block2, n = re.subn(r'(</strong>\s*<span\b[^>]*>).*?(</span>)', lambda q: q.group(1) + visible + q.group(2), block, count=1, flags=re.I | re.S)
    if n != 1:
        raise AssertionError(f"Catalog description not found for {route}")
    if grade is not None:
        block2, gn = re.subn(r'data-grado=[\"\'][^\"\']*[\"\']', f'data-grado="{grade}"', block2, count=1, flags=re.I)
        if gn != 1:
            raise AssertionError(f"Catalog grade not found for {route}")
    return index[:m.start()] + block2 + index[m.end():], 1


def build_grade_map(payload: dict, condition_descriptions: list[dict]) -> dict[str, str]:
    public = {normalize(e["title"]): e for e in condition_descriptions}
    out = {}
    for row in payload["classifications"]:
        key = normalize(row["title"])
        key = GRADE_ALIASES.get(key, key)
        if key not in public:
            raise AssertionError(f"Classification title has no approved condition description: {row['title']!r} -> {key!r}")
        if key in out:
            raise AssertionError(f"Duplicate classification mapping: {row['title']}")
        out[key] = row["final"]
    if len(out) != 185:
        raise AssertionError(f"Expected 185 final condition grades, got {len(out)}")
    counts = Counter(out.values())
    if counts != Counter({"A": 21, "B": 40, "C": 44, "BP": 54, "SG": 26}):
        raise AssertionError(f"Unexpected final classification distribution: {counts}")
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--check", action="store_true", help="Verify exact output; do not write")
    args = parser.parse_args()
    root = args.root.resolve()
    payload = load_payload()
    descriptions = payload["descriptions"]
    counts = Counter(e["kind"] for e in descriptions)
    expected_counts = Counter({"situations": 187, "conditions": 185, "daily": 48})
    if counts != expected_counts or len(descriptions) != 420:
        raise AssertionError(f"Unexpected description counts: {counts}")

    by_kind = {kind: {normalize(e["title"]): e for e in descriptions if e["kind"] == kind} for kind in COLLECTIONS}
    for kind, mapping in by_kind.items():
        if len(mapping) != COLLECTIONS[kind]["expected"]:
            raise AssertionError(f"Duplicate approved titles in {kind}")
    grade_map = build_grade_map(payload, list(by_kind["conditions"].values()))

    matched: dict[str, set[str]] = {k: set() for k in COLLECTIONS}
    route_data: dict[str, dict] = {}
    changes = Counter()

    for kind, cfg in COLLECTIONS.items():
        pages = sorted(p for p in root.glob(cfg["es_glob"]) if p.is_file())
        if len(pages) != cfg["expected"]:
            raise AssertionError(f"{kind}: expected {cfg['expected']} ES pages, found {len(pages)}")
        es_index_path = root / cfg["es_index"]
        en_index_path = root / cfg["en_index"]
        es_index = es_index_path.read_text(encoding="utf-8")
        en_index = en_index_path.read_text(encoding="utf-8")

        for es_path in pages:
            es_before = es_path.read_text(encoding="utf-8")
            title_key = normalize(extract_h1(es_before))
            entry = by_kind[kind].get(title_key)
            if entry is None:
                raise AssertionError(f"{kind}: approved title not found for public h1 {extract_h1(es_before)!r} ({es_path.relative_to(root)})")
            if title_key in matched[kind]:
                raise AssertionError(f"{kind}: approved title matched twice: {entry['title']}")
            matched[kind].add(title_key)
            grade = grade_map[title_key] if kind == "conditions" else None

            en_path = english_page(es_path, es_before, root, cfg["en_prefix"])
            es_route = route_for(es_path, root)
            en_route = route_for(en_path, root)
            s1 = update_detail(es_path, kind, entry["es"], grade, args.check)
            s2 = update_detail(en_path, kind, entry["en"], grade, args.check)
            changes["detail_es"] += s1["changed"]
            changes["detail_en"] += s2["changed"]

            es_index, _ = update_card(es_index, es_route, entry["es"], kind, grade)
            en_index, _ = update_card(en_index, en_route, entry["en"], kind, grade)
            route_data[es_route] = {"es": entry["es"], "en": entry["en"], "en_route": en_route, "kind": kind, "grade": grade}

        if matched[kind] != set(by_kind[kind]):
            missing = sorted(set(by_kind[kind]) - matched[kind])
            raise AssertionError(f"{kind}: approved entries not mapped: {missing[:20]}")
        if not args.check:
            es_index_path.write_text(es_index, encoding="utf-8")
            en_index_path.write_text(en_index, encoding="utf-8")

    search_path = root / "buscador.json"
    search = json.loads(search_path.read_text(encoding="utf-8"))
    found_routes = set()
    search_changed = 0
    for item in search:
        route = item.get("u")
        if route not in route_data:
            continue
        data = route_data[route]
        found_routes.add(route)
        if item.get("d") != data["es"]:
            item["d"] = data["es"]
            search_changed += 1
        en = item.get("en")
        if not isinstance(en, dict) or en.get("u") != data["en_route"]:
            raise AssertionError(f"Search EN route mismatch for {route}")
        if en.get("d") != data["en"]:
            en["d"] = data["en"]
            search_changed += 1
    if len(found_routes) != 420:
        missing = sorted(set(route_data) - found_routes)
        raise AssertionError(f"Global search maps {len(found_routes)}/420 approved entries; missing {missing[:20]}")
    new_search = json.dumps(search, ensure_ascii=False, indent=2) + "\n"
    old_search = search_path.read_text(encoding="utf-8")
    if not args.check and new_search != old_search:
        search_path.write_text(new_search, encoding="utf-8")
    changes["search_fields"] = search_changed

    if args.check:
        prospective_changes = sum(changes[k] for k in ("detail_es", "detail_en", "search_fields"))
        for kind, cfg in COLLECTIONS.items():
            for index_rel, lang in [(cfg["es_index"], "es"), (cfg["en_index"], "en")]:
                current = (root / index_rel).read_text(encoding="utf-8")
                for route, data in route_data.items():
                    if data["kind"] != kind:
                        continue
                    wanted_route = route if lang == "es" else data["en_route"]
                    wanted_desc = html.escape(data[lang], quote=False)
                    if wanted_route not in current and wanted_route.lstrip("/") not in current:
                        raise AssertionError(f"Catalog route missing in check: {wanted_route}")
                    if wanted_desc not in current:
                        raise AssertionError(f"Approved catalog description missing in {index_rel}: {wanted_route}")
        if prospective_changes:
            raise AssertionError(f"Approved integration is not exact; {prospective_changes} detail/search fields would still change")

    print(json.dumps({
        "approved_descriptions": 420,
        "situations": 187,
        "conditions": 185,
        "daily": 48,
        "languages": ["es", "en"],
        "final_condition_grades": dict(sorted(Counter(grade_map.values()).items())),
        "public_routes_mapped": len(route_data),
        "changes": dict(changes),
        "mode": "check" if args.check else "apply",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
