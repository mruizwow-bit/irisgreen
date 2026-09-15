#!/usr/bin/env python3
"""Guardarraíl de Tarjetas Iris v2 y apoyos Mulberry editoriales.

Revisión del 15 de septiembre de 2026:

- El total ya no es 420. Se cuenta lo que hay y se comprueba por qué falta cada
  tarjeta: solo puede faltar donde la ficha todavía no dice qué ayuda.
- El estado BORRADOR es una marca interna: no cambia nada aquí.
- «Necesito» no puede repetir «Me ayuda» en ninguna tarjeta publicada.
- Ningún bloque puede llevar dos textos pegados sin puntuación.
- La variante se publica como número de apoyos (0, 1 o 2), no como letra.
- El crédito Mulberry se valida en la herramienta canónica de Recursos; la ruta
  antigua de Tarjeta Iris es solo un puente y no contiene la herramienta.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

DETAIL_SETS = (
    ("situaciones", "es/situaciones/*/index.html", 187),
    ("vida", "es/biblioteca/*/index.html", 48),
    ("condiciones", "es/neurodiversidad/condiciones/*/index.html", 185),
)
EXPECTED_SVGS = {"hablar.svg", "escribir.svg", "esperar.svg", "preguntar.svg", "carpeta.svg"}
ASSIGNED = "es/situaciones/necesito-que-me-repitan-las-instrucciones/index.html"
TOOL = "es/recursos/tarjeta-iris/index.html"
LICENSE_HREF = 'href="/assets/mulberry/LICENSE-MULBERRY.txt"'
CREDIT_TEXT = "Pictogramas: Mulberry Symbols"

PLACEHOLDER_HELPS = "todavía no dice qué ayuda"
BLOCK_RE = re.compile(
    r'<section class="iris-mini-block(?: [^"]*)?">\s*<h3>(?P<head>[^<]+)</h3>\s*(?P<body>.*?)</section>',
    re.I | re.S,
)
GLUED_RE = re.compile(r"\b[a-záéíóúüñ]{3,}\b ([A-ZÁÉÍÓÚÑ][a-záéíóúüñ]{2,})")
PROPER_NOUNS = {
    "Iris", "España", "Espana", "Madrid", "Europa", "Europea", "Internet",
    "Seguridad", "Social", "Real", "Decreto", "Ley", "Estado", "Salud",
    "Down", "Braille", "Mulberry", "Steve", "Lee", "Google", "Youtube",
    "Asperger", "Tourette", "Sanidad", "Educación", "Educacion", "Hacienda",
    "Ministerio", "Policía", "Policia", "Guardia", "Civil", "Fundación",
    "Fundacion", "Inserta",
}


def glued(text: str) -> str | None:
    for match in GLUED_RE.finditer(text):
        if match.group(1) not in PROPER_NOUNS:
            return match.group(0)
    return None


def plain(fragment: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment)).strip()


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()

    supports = {"0": 0, "1": 0, "2": 0}
    total = 0
    without_card: dict[str, list[str]] = {"sin contenido": [], "sin motivo": []}
    for section, pattern, expected in DETAIL_SETS:
        pages = sorted(p for p in root.glob(pattern) if p.is_file())
        if len(pages) != expected:
            raise AssertionError(f"{section}: esperadas {expected}; encontradas {len(pages)}")
        for path in pages:
            rel = path.relative_to(root).as_posix()
            text = path.read_text(encoding="utf-8")
            cards = re.findall(r'<aside\b[^>]*\biris-mini-card-static\b[^>]*>.*?</aside>', text, re.I | re.S)

            if not cards:
                if PLACEHOLDER_HELPS in text:
                    without_card["sin contenido"].append(rel)
                else:
                    without_card["sin motivo"].append(rel)
                continue
            if len(cards) != 1:
                raise AssertionError(f"Tarjeta v2 duplicada: {rel}")

            card = cards[0]
            if len(re.findall(r'<button\b[^>]*\bclass=["\'][^"\']*\biris-mini-action\b', card, re.I)) != 2:
                raise AssertionError(f"Acciones v2 incorrectas: {rel}")
            if not re.search(r'data-iris-card-status[^>]*role=["\']status["\'][^>]*aria-live=["\']polite["\']', card, re.I):
                raise AssertionError(f"Estado accesible ausente: {rel}")
            sm = re.search(r'data-iris-apoyos=["\']([012])["\']', card, re.I)
            if not sm:
                raise AssertionError(f"Número de apoyos ausente: {rel}")
            supports[sm.group(1)] += 1

            blocks = {m.group("head").strip(): plain(m.group("body")) for m in BLOCK_RE.finditer(card)}
            if len(blocks) != 3:
                raise AssertionError(f"La tarjeta no tiene tres bloques con título: {rel}")
            ayuda = blocks.get("Me ayuda", "").casefold()
            necesito = blocks.get("Necesito", "").casefold()
            if not ayuda or not necesito:
                raise AssertionError(f"Bloques «Me ayuda»/«Necesito» ausentes: {rel}")
            if ayuda in necesito or necesito in ayuda:
                raise AssertionError(f"«Necesito» repite «Me ayuda»: {rel}")
            for head, body in blocks.items():
                stuck = glued(body)
                if stuck:
                    raise AssertionError(
                        f"Texto pegado sin puntuación en «{head}» de {rel}: …{stuck}… "
                        "Si es un nombre propio, añádelo a PROPER_NOUNS."
                    )
            total += 1

    if total == 0:
        raise AssertionError("No hay ninguna Tarjeta Iris publicada")
    if sum(supports.values()) != total:
        raise AssertionError(f"Recuento de apoyos inconsistente: {supports}")
    if without_card["sin motivo"]:
        raise AssertionError(
            "Fichas sin Tarjeta Iris y sin motivo declarado: "
            + ", ".join(without_card["sin motivo"][:10])
        )

    mulberry = root / "assets/mulberry"
    svgs = {p.name for p in mulberry.glob("*.svg")}
    if svgs != EXPECTED_SVGS:
        raise AssertionError(f"Pictogramas publicados inesperados: {sorted(svgs)}")
    if not (mulberry / "LICENSE-MULBERRY.txt").is_file():
        raise AssertionError("Falta LICENSE-MULBERRY.txt")
    if (root / "assets/pictos").exists():
        raise AssertionError("No debe existir el antiguo directorio assets/pictos")
    if any("queue" in p.name or "correct" in p.name for p in mulberry.iterdir()):
        raise AssertionError("Se han publicado candidatos descartados")

    assigned_path = root / ASSIGNED
    assigned = assigned_path.read_text(encoding="utf-8")
    assignment_applied = 'data-iris-apoyos="2"' in assigned
    if assignment_applied:
        for picto in ("hablar", "escribir"):
            if f'data-mulberry-picto="{picto}"' not in assigned:
                raise AssertionError(f"Falta pictograma editorial {picto}")
            if f'src="/assets/mulberry/{picto}.svg"' not in assigned:
                raise AssertionError(f"Ruta pública incorrecta para {picto}")
        if assigned.count('alt="" aria-hidden="true"') < 2:
            raise AssertionError("Los pictogramas deben ser decorativos para tecnologías de apoyo")
        if "Esto me cuesta" not in assigned or "Me ayuda" not in assigned:
            raise AssertionError("El texto visible no puede ser sustituido por pictogramas")
    elif 'iris-mini-card-static' in assigned:
        raise AssertionError("La ficha con asignación editorial no publica sus dos apoyos")

    tool_path = root / TOOL
    if not tool_path.is_file():
        raise FileNotFoundError(tool_path)
    tool = tool_path.read_text(encoding="utf-8")
    if tool.count(CREDIT_TEXT) != 1 or tool.count(LICENSE_HREF) != 1:
        raise AssertionError("La atribución Mulberry aprobada debe aparecer una sola vez en la Tarjeta Iris canónica")
    all_html = "".join(p.read_text(encoding="utf-8", errors="ignore") for p in root.rglob("*.html"))
    if all_html.count(CREDIT_TEXT) != 1:
        raise AssertionError("La atribución Mulberry de la herramienta debe existir en una sola página")

    css = (root / "assets/mulberry-pictograms.css").read_text(encoding="utf-8")
    if 'data-mulberry-picto="escribir"' not in css or "48px" not in css:
        raise AssertionError("Falta la excepción de 48 px solo para escribir con dos apoyos")

    print(json.dumps({
        "tarjetas_v2": total,
        "supports": supports,
        "pages_without_card": {k: len(v) for k, v in without_card.items()},
        "editorial_draft_state": "marca interna; no decide la tarjeta",
        "glued_text_blocks": 0,
        "necesito_equals_ayuda": 0,
        "mulberry_svgs": sorted(svgs),
        "editorial_assignment": ASSIGNED,
        "editorial_assignment_applied": assignment_applied,
        "discarded_candidates_published": 0,
        "credit_pages": 1,
        "credit_route": TOOL,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
