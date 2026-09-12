#!/usr/bin/env python3
"""Audita coherencia técnica de SEO e idiomas en la salida pública.

No modifica contenido ni decide si una traducción es correcta. Comprueba únicamente
relaciones estructurales que pueden verificarse de forma automática: lang de HTML,
canonicals, hreflang y URLs incluidas en sitemap.xml.
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


class HeadParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.lang = ""
        self.canonical: list[str] = []
        self.alternates: list[tuple[str, str]] = []
        self.robots: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        data = {str(k).lower(): str(v or "") for k, v in attrs}
        tag = tag.lower()
        if tag == "html":
            self.lang = data.get("lang", "").strip().lower()
        elif tag == "link":
            rel = {x.lower() for x in data.get("rel", "").split()}
            href = data.get("href", "").strip()
            if "canonical" in rel and href:
                self.canonical.append(href)
            if "alternate" in rel and data.get("hreflang") and href:
                self.alternates.append((data["hreflang"].strip().lower(), href))
        elif tag == "meta" and data.get("name", "").lower() == "robots":
            self.robots.append(data.get("content", "").strip().lower())


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
    pages_with_hreflang = 0
    reciprocal_pairs = 0

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
        else:
            warnings.append({"type": "canonical_missing", "route": route})

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
            for lang, href in meta.alternates:
                target = to_file(root, href)
                if lang not in {"es", "en"} or lang == source_lang or not target or not target.is_file():
                    continue
                target_meta = parsed.get(target) or parse(target)
                back = {k: v for k, v in target_meta.alternates}.get(source_lang)
                if back == source_url:
                    reciprocal_pairs += 1
                else:
                    warnings.append({"type": "hreflang_not_reciprocal", "route": route, "target": href, "expected_back": source_url, "actual_back": back})

        xdefault = seen_lang.get("x-default")
        if xdefault and xdefault not in {href for lang, href in meta.alternates if lang != "x-default"}:
            warnings.append({"type": "x_default_not_language_alternate", "route": route, "href": xdefault})

    for canonical, owners in sorted(canonical_owners.items()):
        if len(owners) > 1:
            warnings.append({"type": "canonical_shared", "canonical": canonical, "routes": owners})

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
        "sitemap_urls": len(sitemap_urls),
        "failures": failures,
        "warnings": warnings,
        "limits": [
            "No evalúa la calidad de las traducciones ni modifica contenido editorial.",
            "La reciprocidad hreflang se informa como advertencia para poder revisar excepciones antes de convertirla en bloqueo.",
            "No sustituye una inspección en Search Console ni una prueba del índice real de un buscador.",
        ],
        "passed": not failures,
    }
    out = report_dir / "seo-idiomas.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ["html_pages", "pages_with_canonical", "pages_with_hreflang", "reciprocal_language_links", "sitemap_urls", "passed"]}, ensure_ascii=False))
    if warnings:
        print(json.dumps({"warnings": len(warnings), "sample": warnings[:8]}, ensure_ascii=False))
    if failures:
        print(json.dumps({"failures": len(failures), "sample": failures[:20]}, ensure_ascii=False))
        raise SystemExit(1)


if __name__ == "__main__":
    main()
