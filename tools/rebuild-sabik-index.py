#!/usr/bin/env python3
"""Regenera el índice local de Iris que consume Sabik desde el artefacto público.

Extrae texto de ``dist`` pero decide la publicabilidad leyendo la fuente
editorial correspondiente en ``es/...``. Esto evita que el índice acepte como
publicable una página cuyo marcador de borrador fue retirado por el build
antes de publicar. Excluye Datos y páginas noindex, y añade los 120 registros
de Investigación como fragmentos con fuente pública /es/investigacion/.
No escribe fuera del archivo de salida indicado.
"""
from __future__ import annotations

import argparse
import json
import re
import unicodedata
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

BASE_URL = "https://irisgreen.eu"
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
SKIP_TAGS = {"script", "style", "noscript", "svg", "dialog", "nav", "footer", "header", "form", "button"}
CONCEPT_TERMS = {
    "sobrecarga_sensorial": ["sobrecarga sensorial", "demasiado ruido", "demasiada luz", "me saturo", "todo es demasiado", "sobrecarga"],
    "carga_atencional": ["carga atencional", "estar pendiente de muchas cosas", "tener que atender a todo", "muchas cosas a la vez"],
    "decisiones": ["decisiones", "decidir demasiadas cosas", "elegir", "tomar decisiones", "no se que escoger"],
    "ruido": ["ruido", "sonido", "ruidos", "barullo", "mucho ruido"],
    "baja_demanda": ["baja demanda", "no puedo pensar", "menos texto"],
    "riesgo_suicida": ["riesgo suicida", "pensamientos suicidas", "hacerme dano", "quiero hacerme dano", "no quiero seguir viviendo"],
}


def compact_text(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value or "")).strip()


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFD", value or "")
    value = "".join(ch for ch in value if unicodedata.category(ch) != "Mn").lower()
    value = re.sub(r"[^a-z0-9ñ\s]", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def concepts_for(text: str) -> list[str]:
    normalized = f" {normalize(text)} "
    out: list[str] = []
    for concept_id, terms in CONCEPT_TERMS.items():
        if any(f" {normalize(term)} " in normalized for term in terms):
            out.append(concept_id)
    return out


def fragment_id(url: str, suffix: str) -> str:
    path = urlparse(url).path.strip("/") or "home"
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", path).strip("-") or "home"
    return f"{slug}.{suffix}"


def file_for_url(root: Path, url: str) -> Path:
    path = urlparse(url).path
    rel = path.lstrip("/")
    if not rel:
        return root / "index.html"
    if path.endswith("/"):
        return root / rel / "index.html"
    return root / rel


def source_file_for_url(source_root: Path, url: str) -> Path:
    return file_for_url(source_root, url)


def has_explicit_draft_marker(raw: str) -> bool:
    return any(
        marker in raw
        for marker in (
            '<span class="chip lil">BORRADOR</span>',
            "Página en borrador",
            "<li><strong>Estado:</strong> borrador</li>",
        )
    )


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.meta_description = ""
        self.robots = ""
        self.title_parts: list[str] = []
        self.h1_parts: list[str] = []
        self.in_title = False
        self.in_h1 = 0
        self.main_depth = 0
        self.section_depth = 0
        self.current_section: dict[str, object] | None = None
        self.sections: list[dict[str, str]] = []
        self.heading_depth = 0
        self.skip_depth = 0

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs_list)
        lower = tag.lower()
        if lower == "meta":
            name = (attrs.get("name") or "").lower()
            if name == "description":
                self.meta_description = attrs.get("content") or ""
            elif name == "robots":
                self.robots = attrs.get("content") or ""
        if lower == "title":
            self.in_title = True
        if lower == "h1":
            self.in_h1 += 1
        if lower == "main":
            self.main_depth += 1
        if self.main_depth and lower in SKIP_TAGS:
            self.skip_depth += 1
        if self.main_depth and lower == "section":
            if self.section_depth == 0:
                self.current_section = {"heading": [], "text": []}
            self.section_depth += 1
        if self.current_section is not None and lower in {"h2", "h3"} and self.heading_depth == 0:
            self.heading_depth = 1

    def handle_endtag(self, tag: str) -> None:
        lower = tag.lower()
        if lower == "title":
            self.in_title = False
        if lower == "h1" and self.in_h1:
            self.in_h1 -= 1
        if self.current_section is not None and lower in {"h2", "h3"} and self.heading_depth:
            self.heading_depth = 0
        if self.main_depth and lower == "section" and self.section_depth:
            self.section_depth -= 1
            if self.section_depth == 0 and self.current_section is not None:
                heading = compact_text(" ".join(self.current_section["heading"]))
                text = compact_text(" ".join(self.current_section["text"]))
                if len(text) >= 40:
                    self.sections.append({"heading": heading, "text": text})
                self.current_section = None
        if self.main_depth and lower in SKIP_TAGS and self.skip_depth:
            self.skip_depth -= 1
        if lower == "main" and self.main_depth:
            self.main_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.in_title:
            self.title_parts.append(data)
        if self.in_h1:
            self.h1_parts.append(data)
        if self.current_section is not None and not self.skip_depth:
            self.current_section["text"].append(data)
            if self.heading_depth:
                self.current_section["heading"].append(data)

    @property
    def title(self) -> str:
        h1 = compact_text(" ".join(self.h1_parts))
        if h1:
            return h1.strip("«»“”")
        title = compact_text(" ".join(self.title_parts))
        return re.sub(r"\s*[·|]\s*Iris Green.*$", "", title).strip()


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser


def add_research_fragments(root: Path, fragments: list[dict[str, object]]) -> None:
    source = root / "es" / "investigacion" / "estudios-textos.json"
    if not source.is_file():
        return
    records = json.loads(source.read_text(encoding="utf-8"))
    if not isinstance(records, list):
        return
    url = BASE_URL + "/es/investigacion/"
    for record in records:
        if not isinstance(record, dict):
            continue
        heading = compact_text(str(record.get("heading") or record.get("titleEs") or ""))
        parts: list[str] = []
        raw_text = record.get("text")
        if isinstance(raw_text, list):
            parts.extend(str(item) for item in raw_text if item)
        for key in ("means", "notProven"):
            if record.get(key):
                parts.append(str(record[key]))
        text = compact_text(" ".join(parts))
        if not heading or not text:
            continue
        rid = str(record.get("id") or record.get("n") or len(fragments) + 1)
        fragments.append({
            "id": f"es-investigacion-registro-{rid}.research",
            "url": url,
            "title": heading,
            "heading": heading,
            "text": text[:3000],
            "concepts": concepts_for(f"{heading} {text}"),
            "editorial_status": "PUBLICABLE",
            "source_type": "research_record",
        })


def build_index(root: Path, output: Path, source_root: Path) -> dict[str, object]:
    sitemap = root / "sitemap.xml"
    tree = ET.parse(sitemap)
    urls = [node.text for node in tree.findall(f".//{{{SITEMAP_NS}}}loc") if node.text]
    urls = [url for url in urls if "/es/" in url and "/es/datos/" not in url]
    fragments: list[dict[str, object]] = []
    skipped: list[dict[str, str]] = []
    included_urls: set[str] = set()

    for url in urls:
        path = file_for_url(root, url)
        if not path.is_file():
            skipped.append({"url": url, "reason": "missing_file"})
            continue
        source_path = source_file_for_url(source_root, url)
        if source_path.is_file():
            source_raw = source_path.read_text(encoding="utf-8", errors="replace")
            source_page = PageParser()
            source_page.feed(source_raw)
            if "noindex" in source_page.robots.lower():
                skipped.append({"url": url, "reason": "source_noindex"})
                continue
            if has_explicit_draft_marker(source_raw):
                skipped.append({"url": url, "reason": "source_draft_marker"})
                continue
        raw = path.read_text(encoding="utf-8", errors="replace")
        if re.search(r"\bBORRADOR\b", raw, flags=re.I):
            skipped.append({"url": url, "reason": "draft_marker"})
            continue
        page = parse_page(path)
        if "noindex" in page.robots.lower():
            skipped.append({"url": url, "reason": "noindex"})
            continue
        title = page.title
        source_url = url.rstrip("/")
        added = 0
        description = compact_text(page.meta_description)
        if description:
            fragments.append({
                "id": fragment_id(url, "meta"),
                "url": source_url,
                "title": title or description[:80],
                "heading": title or description[:80],
                "text": description,
                "concepts": concepts_for(f"{title} {description}"),
                "editorial_status": "PUBLICABLE",
                "source_type": "meta_description",
            })
            added += 1
        for index, section in enumerate(page.sections, start=1):
            text = compact_text(section["text"])
            heading = compact_text(section["heading"]) or title
            if len(text) > 3000:
                text = text[:3000].rsplit(" ", 1)[0] + "…"
            fragments.append({
                "id": fragment_id(url, f"sec{index}"),
                "url": source_url,
                "title": title or heading,
                "heading": heading,
                "text": text,
                "concepts": concepts_for(f"{title} {heading} {text}"),
                "editorial_status": "PUBLICABLE",
                "source_type": "html_main_section",
            })
            added += 1
        if added:
            included_urls.add(source_url)
        else:
            skipped.append({"url": url, "reason": "no_extractable_content"})

    add_research_fragments(root, fragments)
    if any(item.get("source_type") == "research_record" for item in fragments):
        included_urls.add(BASE_URL + "/es/investigacion")

    payload: dict[str, object] = {
        "generated_at": None,
        "source_label": "irisgreen-main-dist-with-source-editorial-state",
        "language": "es",
        "base_url": BASE_URL,
        "url_count": len(included_urls),
        "fragment_count": len(fragments),
        "skipped_count": len(skipped),
        "fragments": fragments,
    }

    previous = None
    if output.is_file():
        try:
            previous = json.loads(output.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            previous = None
    if isinstance(previous, dict):
        old_compare = {k: v for k, v in previous.items() if k != "generated_at"}
        new_compare = {k: v for k, v in payload.items() if k != "generated_at"}
        if old_compare == new_compare and previous.get("generated_at"):
            payload["generated_at"] = previous["generated_at"]
    if not payload["generated_at"]:
        payload["generated_at"] = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    return {"url_count": payload["url_count"], "fragment_count": payload["fragment_count"], "skipped_count": payload["skipped_count"]}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=Path("dist"))
    parser.add_argument("--source-root", type=Path, default=Path("."))
    parser.add_argument("--output", type=Path, default=Path("sabik/assets/NEA/generated/iris-fragments-index.es.json"))
    args = parser.parse_args()
    result = build_index(args.root.resolve(), args.output.resolve(), args.source_root.resolve())
    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    main()
