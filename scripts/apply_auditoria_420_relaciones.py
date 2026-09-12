#!/usr/bin/env python3
"""Aplica la auditoría editorial final de Señales/Relaciones a la fuente real.

Alcance deliberado:
- 187 Situaciones ES + 187 EN: retira bloques automáticos de señales/urgencias y relaciones diagnósticas.
- 185 Condiciones ES + 185 EN: no reescribe contenido; la auditoría posterior exige que no existan
  encabezados genéricos automáticos Señales/Signs o Relacionado/Related.
- 48 Vida diaria ES + 48 EN: retira la nube de relaciones de cada detalle y la taxonomía pública del índice.
- La ficha especial de instrucciones conserva su diseño aprobado, pero refleja la misma decisión editorial.

No toca Tarjeta Iris, robots, canónicos, fuentes documentales ni el texto de los demás bloques.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
from pathlib import Path

TAG_RE = re.compile(r"<[^>]+>")
H2_RE = re.compile(r"<h2\b[^>]*>(.*?)</h2>", re.I | re.S)
SECTION_TOKEN_RE = re.compile(r"<section\b[^>]*>|</section\s*>", re.I)
LEDE_RE = re.compile(r'(<p\b[^>]*class=["\'][^"\']*\blede\b[^"\']*["\'][^>]*>)(.*?)(</p>)', re.I | re.S)

SITUATION_HEADINGS_ES = {"Señales", "Señales de alerta", "Relacionado", "Puede estar relacionado con"}
SITUATION_HEADINGS_EN = {"Signs", "Warning signs", "Related", "May be related to"}
DAILY_HEADINGS_ES = {"Enlaza con", "Relacionado"}
DAILY_HEADINGS_EN = {"Links to", "Links with", "Related"}

LEDE_ES = "Cuarenta y ocho fichas prácticas. Cada una explica una situación real, qué se puede pedir y dónde consultar la fuente oficial."
LEDE_EN = "Forty-eight practical guides. Each one explains a real-life situation, what can be requested and where to check the official source."

NAV_SOURCE_PATHS = (
    "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html",
    "en/situations/i-need-instructions-repeated/index.html",
)


def plain(fragment: str) -> str:
    return " ".join(html.unescape(TAG_RE.sub(" ", fragment)).split())


def section_spans(text: str):
    stack: list[tuple[int, str]] = []
    out: list[tuple[int, int, str, str]] = []
    for m in SECTION_TOKEN_RE.finditer(text):
        token = m.group(0)
        if token.lower().startswith("<section"):
            stack.append((m.start(), token))
        elif stack:
            start, opening = stack.pop()
            out.append((start, m.end(), opening, text[start:m.end()]))
    if stack:
        raise AssertionError("HTML con <section> sin cierre")
    return sorted(out)


def remove_sections_by_heading(text: str, headings: set[str]) -> tuple[str, list[str]]:
    remove: list[tuple[int, int, str]] = []
    for start, end, _opening, block in section_spans(text):
        m = H2_RE.search(block)
        if not m:
            continue
        heading = plain(m.group(1))
        if heading in headings:
            remove.append((start, end, heading))
    selected: list[tuple[int, int, str]] = []
    for item in remove:
        if any(a <= item[0] and item[1] <= b for a, b, _ in remove if (a, b) != (item[0], item[1])):
            continue
        selected.append(item)
    for start, end, _heading in sorted(selected, reverse=True):
        text = text[:start] + text[end:]
    return text, [h for _, _, h in selected]


def remove_concepts_box(text: str) -> tuple[str, int]:
    matches: list[tuple[int, int]] = []
    for start, end, opening, _block in section_spans(text):
        m = re.search(r'class=["\']([^"\']*)["\']', opening, re.I)
        classes = set(m.group(1).split()) if m else set()
        if "concepts-box" in classes:
            matches.append((start, end))
    for start, end in sorted(matches, reverse=True):
        text = text[:start] + text[end:]
    return text, len(matches)


def set_index_lede(text: str, value: str, label: str) -> str:
    matches = list(LEDE_RE.finditer(text))
    if not matches:
        raise AssertionError(f"Sin introducción .lede en {label}")
    m = matches[0]
    return text[:m.start()] + m.group(1) + value + m.group(3) + text[m.end():]


def detail_files(base: Path) -> list[Path]:
    return sorted(p for p in base.glob("*/index.html") if p.is_file())


def apply_collection(base: Path, expected: int, headings: set[str], label: str) -> tuple[int, int]:
    files = detail_files(base)
    if len(files) != expected:
        raise AssertionError(f"{label}: esperadas {expected} fichas; encontradas {len(files)}")
    changed = removed = 0
    for p in files:
        original = p.read_text(encoding="utf-8")
        text, headings_removed = remove_sections_by_heading(original, headings)
        removed += len(headings_removed)
        if text != original:
            p.write_text(text, encoding="utf-8")
            changed += 1
    return changed, removed


def patch_navigation_template(path: Path, lang: str) -> bool:
    original = path.read_text(encoding="utf-8")
    text = original
    if lang == "es":
        text = text.replace("<h2 id=\"options-title\">Qué puedes probar</h2>", "<h2 id=\"options-title\">Qué puede ayudar ahora</h2>")
        text = text.replace("<summary>En qué conviene fijarse</summary>", "<summary>Qué conviene observar</summary>")
        text = text.replace("<summary>Cuándo pedir ayuda y señales de alerta</summary>", "<summary>Cuándo pedir ayuda profesional</summary>")
        text = re.sub(r'<section class="original-section"><h3>Señales de alerta</h3>.*?</section>', '', text, count=1, flags=re.S)
        text = re.sub(r'<section class="original-section"><h3>Puede estar relacionado con</h3>.*?</section>', '', text, count=1, flags=re.S)
        text = re.sub(r'<h3>Señales de alerta</h3><p>.*?</p>', '', text, count=1, flags=re.S)
        text = text.replace(
            '<p class="source-meta">Se conserva a continuación la redacción anterior de la ficha, incluidos sus rótulos y notas.</p>',
            '<p class="source-meta">Se conserva a continuación la redacción completa de la ficha.</p>'
        )
    else:
        text = text.replace("<h2 id=\"options-title\">What you can try</h2>", "<h2 id=\"options-title\">What may help now</h2>")
        text = text.replace("<summary>When to seek help and warning signs</summary>", "<summary>When to seek professional help</summary>")
        text = re.sub(r'<section class="original-section"><h3>Warning signs</h3>.*?</section>', '', text, count=1, flags=re.S)
        text = re.sub(r'<section class="original-section"><h3>May be related to</h3>.*?</section>', '', text, count=1, flags=re.S)
        text = re.sub(r'<h3>Warning signs</h3><p>.*?</p>', '', text, count=1, flags=re.S)
        text = text.replace(
            '<p class="source-meta">The previous wording of the entry is preserved below, including its headings and notes.</p>',
            '<p class="source-meta">The complete wording of the entry is preserved below.</p>'
        )
    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def article_fingerprint(text: str) -> str:
    match = re.search(r'<article\b[^>]*>(.*?)</article>', text, flags=re.S)
    if not match:
        raise ValueError("Original article is missing")
    article_plain = html.unescape(re.sub(r'<[^>]*>', ' ', match[1]))
    normalized = ' '.join(article_plain.split()).encode('utf-8')
    return hashlib.sha256(normalized).hexdigest()


def update_navigation_manifest(root: Path) -> bool:
    path = root / "editorial/navigation/manifest.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = False
    for rel in NAV_SOURCE_PATHS:
        current = article_fingerprint((root / rel).read_text(encoding="utf-8"))
        if data["source_articles"].get(rel) != current:
            data["source_articles"][rel] = current
            changed = True
    if changed:
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return changed


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    ap.add_argument("--update-navigation-manifest", action="store_true",
                    help="Actualizar una sola vez las huellas aprobadas tras esta auditoría deliberada.")
    args = ap.parse_args()
    root = args.root.resolve()

    results = {}
    results["situaciones_es"] = apply_collection(root / "es/situaciones", 187, SITUATION_HEADINGS_ES, "Situaciones ES")
    results["situaciones_en"] = apply_collection(root / "en/situations", 187, SITUATION_HEADINGS_EN, "Situations EN")
    results["vida_es"] = apply_collection(root / "es/biblioteca", 48, DAILY_HEADINGS_ES, "Vida diaria ES")
    results["vida_en"] = apply_collection(root / "en/everyday-life", 48, DAILY_HEADINGS_EN, "Everyday life EN")

    for rel, lede, lang in [
        ("es/biblioteca/index.html", LEDE_ES, "ES"),
        ("en/everyday-life/index.html", LEDE_EN, "EN"),
    ]:
        p = root / rel
        original = p.read_text(encoding="utf-8")
        text = set_index_lede(original, lede, rel)
        text, boxes = remove_concepts_box(text)
        if text != original:
            p.write_text(text, encoding="utf-8")
        results[f"indice_{lang.lower()}"] = {"concepts_box_removed": boxes, "changed": text != original}

    results["navigation_template_es"] = patch_navigation_template(root / "editorial/navigation/instructions-es.html", "es")
    results["navigation_template_en"] = patch_navigation_template(root / "editorial/navigation/instructions-en.html", "en")
    if args.update_navigation_manifest:
        results["navigation_manifest"] = update_navigation_manifest(root)

    print(results)


if __name__ == "__main__":
    main()
