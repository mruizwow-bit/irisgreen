#!/usr/bin/env python3
"""Audita coherencia técnica de SEO e idiomas en la salida pública.

No modifica contenido ni decide si una traducción es correcta. Comprueba relaciones
estructurales verificables: lang de HTML, canonicals, hreflang, sitemap y duplicados
de títulos/descripciones en páginas indexables.
"""
from __future__ import annotations

import argparse
import json
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree

SITE_HOST = "irisgreen.eu"
SITE = "https://irisgreen.eu"
CANONICAL_MISSING_ALLOWED = {"/404.html", "/assets/maintenance.html"}


class HeadParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = ""
        self.canonical: list[str] = []
        self.alternates: list[tuple[str, str]] = []
        self.robots: list[str] = []
        self.descriptions: list[str] = []
        self.title_parts: list[str] = []
        self._in_title = False

    @property
    def title(self) -> str:
        return " ".join(" ".join(self.title_parts).split()).strip()

    def handle_starttag(self, tag: str, attrs) -> None:
        data = {str(k).lower(): str(v or "") for k, v in attrs}
        tag = tag.lower()
        if tag == "html":
            self.lang = data.get("lang", "").strip().lower()
        elif tag == "title":
            self._in_title = True
        elif tag == "link":
            rel = {x.lower() for x in data.get("rel", "").split()}
            href = data.get("href", "").strip()
            if "canonical" in rel and href:
                self.canonical.append(href)
            if "alternate" in rel and data.get("hreflang") and href:
                self.alternates.append((data["hreflang"].strip().lower(), href))
        elif tag == "meta":
            name = data.get("name", "").lower()
            if name == "robots":
                self.robots.append(data.get("content", "").strip().lower())
            elif name == "description":
                self.descriptions.append(" ".join(data.get("content", "").split()).strip())

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title and data.strip():
            self.title_parts.append(data.strip())


def public_path(root: Path, path: Path) -> str:
    rel = path.relative_to(root).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def to_file(root: Path, url: str) -> Path | None:
    parts = urlsplit(url)
    if parts.scheme and parts.scheme not in {"http", "https"}:
        return None
    if parts.netloc and parts.netloc.lower() != SITE_HOST:
        return None
    path = parts.path or "/"
    rel = path.lstrip("/")
    if path.endswith("/"):
        rel += "index.html"
    elif not Path(rel).suffix:
        rel += "/index.html"
    return root / rel


def parse(path: Path) -> HeadParser:
    parser = HeadParser()
    parser.feed(path.read_text(encoding="utf-8", errors="ignore"))
    return parser


def normalized(value: str) -> str:
    return " ".join(value.split()).casefold()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    report_dir = root / "reports" / "publicacion"
    report_dir.mkdir(parents=True, exist_ok=True)

    pages = [p for p in root.rglob("*.html") if "reports" not in p.parts]
    parsed = {p: parse(p) for p in pages}
    failures: list[dict] = []
    warnings: list[dict] = []
    canonical_owners: dict[str, list[str]] = defaultdict(list)
    title_owners: dict[str, list[str]] = defaultdict(list)
    description_owners: dict[str, list[str]] = defaultdict(list)
    pages_with_hreflang = 0
    reciprocal_pairs = 0
    hreflang_without_language_peer: list[dict] = []

    for path, meta in parsed.items():
        route = public_path(root, path)
        expected_lang = "en" if route.startswith("/en/") else "es" if route == "/" or route.startswith("/es/") else None
        actual_lang = meta.lang.split("-", 1)[0] if meta.lang else ""
        if expected_lang and actual_lang != expected_lang:
            failures.append({"type": "html_lang", "route": route, "expected": expected_lang, "actual": meta.lang or None})

        if len(meta.canonical) > 1:
            failures.append({"type": "canonical_duplicate", "route": route, "values": meta.canonical})
        if meta.canonical:
            canonical = meta.canonical[0]
            parts = urlsplit(canonical)
            if parts.scheme != "https" or parts.netloc.lower() != SITE_HOST:
                failures.append({"type": "canonical_external_or_non_https", "route": route, "canonical": canonical})
            else:
                target = to_file(root, canonical)
                if not target or not target.is_file():
                    failures.append({"type": "canonical_target_missing", "route": route, "canonical": canonical})
                canonical_owners[canonical].append(route)
        elif route in CANONICAL_MISSING_ALLOWED:
            warnings.append({"type": "canonical_missing_expected", "route": route})
        else:
            failures.append({"type": "canonical_missing", "route": route})

        indexable = not any("noindex" in value for value in meta.robots)
        if indexable:
            if meta.title:
                title_owners[normalized(meta.title)].append(route)
            if len(meta.descriptions) > 1:
                failures.append({"type": "meta_description_duplicate_tag", "route": route, "values": meta.descriptions})
            if meta.descriptions and meta.descriptions[0]:
                description_owners[normalized(meta.descriptions[0])].append(route)

        if meta.alternates:
            pages_with_hreflang += 1
        seen_lang: dict[str, str] = {}
        for lang, href in meta.alternates:
            if lang in seen_lang:
                failures.append({"type": "hreflang_duplicate", "route": route, "hreflang": lang, "first": seen_lang[lang], "second": href})
                continue
            seen_lang[lang] = href
            target = to_file(root, href)
            if target is None:
                failures.append({"type": "hreflang_external", "route": route, "hreflang": lang, "href": href})
            elif not target.is_file():
                failures.append({"type": "hreflang_target_missing", "route": route, "hreflang": lang, "href": href})

        source_lang = actual_lang if actual_lang in {"es", "en"} else None
        source_url = meta.canonical[0] if len(meta.canonical) == 1 else SITE + route
        if source_lang:
            other_lang = "en" if source_lang == "es" else "es"
            normalized_alt_langs = {lang.split("-", 1)[0] for lang in seen_lang if lang != "x-default"}
            if meta.alternates and other_lang not in normalized_alt_langs:
                hreflang_without_language_peer.append({
                    "route": route,
                    "lang": source_lang,
                    "alternates": dict(meta.alternates),
                })
            for lang, href in meta.alternates:
                lang_base = lang.split("-", 1)[0]
                target = to_file(root, href)
                if lang_base not in {"es", "en"} or lang_base == source_lang or not target or not target.is_file():
                    continue
                target_meta = parsed.get(target) or parse(target)
                back = None
                for back_lang, back_href in target_meta.alternates:
                    if back_lang.split("-", 1)[0] == source_lang:
                        back = back_href
                        break
                if back == source_url:
                    reciprocal_pairs += 1
                else:
                    failures.append({"type": "hreflang_not_reciprocal", "route": route, "target": href, "expected_back": source_url, "actual_back": back})

        xdefault = seen_lang.get("x-default")
        if xdefault and xdefault not in {href for lang, href in meta.alternates if lang != "x-default"}:
            warnings.append({"type": "x_default_not_language_alternate", "route": route, "href": xdefault})

    for canonical, owners in sorted(canonical_owners.items()):
        if len(owners) > 1:
            warnings.append({"type": "canonical_shared", "canonical": canonical, "routes": owners})

    duplicate_titles = [
        {"value": key, "routes": routes, "count": len(routes)}
        for key, routes in sorted(title_owners.items()) if len(routes) > 1
    ]
    duplicate_descriptions = [
        {"value": key, "routes": routes, "count": len(routes)}
        for key, routes in sorted(description_owners.items()) if len(routes) > 1
    ]

    if hreflang_without_language_peer:
        failures.append({
            "type": "hreflang_without_language_peer",
            "count": len(hreflang_without_language_peer),
            "pages": hreflang_without_language_peer,
        })
    if duplicate_titles:
        failures.append({
            "type": "duplicate_indexable_titles",
            "count": len(duplicate_titles),
            "groups": duplicate_titles,
        })
    if duplicate_descriptions:
        failures.append({
            "type": "duplicate_indexable_descriptions",
            "count": len(duplicate_descriptions),
            "groups": duplicate_descriptions,
        })

    sitemap_path = root / "sitemap.xml"
    sitemap_urls: list[str] = []
    if not sitemap_path.is_file():
        failures.append({"type": "sitemap_missing"})
    else:
        try:
            tree = ElementTree.parse(sitemap_path)
            sitemap_urls = [el.text.strip() for el in tree.getroot().iter() if el.tag.endswith("loc") and el.text and el.text.strip()]
        except Exception as exc:
            failures.append({"type": "sitemap_invalid_xml", "error": str(exc)})
        duplicates = sorted({u for u in sitemap_urls if sitemap_urls.count(u) > 1})
        if duplicates:
            failures.append({"type": "sitemap_duplicate_urls", "urls": duplicates[:50], "count": len(duplicates)})
        for url in sitemap_urls:
            target = to_file(root, url)
            if target is None:
                failures.append({"type": "sitemap_external_url", "url": url})
                continue
            if not target.is_file():
                failures.append({"type": "sitemap_target_missing", "url": url})
                continue
            target_meta = parsed.get(target) or parse(target)
            if any("noindex" in value for value in target_meta.robots):
                failures.append({"type": "sitemap_contains_noindex", "url": url})

    report = {
        "html_pages": len(pages),
        "pages_with_canonical": sum(bool(m.canonical) for m in parsed.values()),
        "pages_with_hreflang": pages_with_hreflang,
        "reciprocal_language_links": reciprocal_pairs,
        "hreflang_without_language_peer": hreflang_without_language_peer,
        "duplicate_indexable_titles": duplicate_titles,
        "duplicate_indexable_descriptions": duplicate_descriptions,
        "sitemap_urls": len(sitemap_urls),
        "canonical_missing_allowed": sorted(CANONICAL_MISSING_ALLOWED),
        "failures": failures,
        "warnings": warnings,
        "limits": [
            "No evalúa la calidad de las traducciones ni modifica contenido editorial.",
            "Las parejas ES/EN declaradas con hreflang deben ser recíprocas; una relación unilateral se trata como regresión.",
            "No se permite publicar hreflang solo a la propia lengua: si no existe pareja real, no se inventa y se omite hreflang.",
            "No se permiten títulos ni meta descriptions duplicados entre páginas indexables.",
            "La ausencia de canonical solo se tolera en 404.html y la pantalla técnica de mantenimiento.",
            "No sustituye una inspección en Search Console ni una prueba del índice real de un buscador.",
        ],
        "passed": not failures,
    }
    out = report_dir / "seo-idiomas.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "html_pages": report["html_pages"],
        "pages_with_canonical": report["pages_with_canonical"],
        "pages_with_hreflang": report["pages_with_hreflang"],
        "reciprocal_language_links": report["reciprocal_language_links"],
        "hreflang_without_language_peer": len(hreflang_without_language_peer),
        "duplicate_indexable_titles": len(duplicate_titles),
        "duplicate_indexable_descriptions": len(duplicate_descriptions),
        "sitemap_urls": report["sitemap_urls"],
        "passed": report["passed"],
    }, ensure_ascii=False))
    if warnings:
        print(json.dumps({"warnings": len(warnings), "sample": warnings[:8]}, ensure_ascii=False))
    if failures:
        print(json.dumps({"failures": len(failures), "sample": failures[:20]}, ensure_ascii=False))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
