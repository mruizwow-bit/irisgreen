#!/usr/bin/env python3
"""Integra apoyos visuales Mulberry solo mediante asignaciones editoriales explícitas.

Los cinco SVG aprobados viven en assets/mulberry y se publican con su nombre
estable. El texto de la Tarjeta Iris permanece visible y los pictogramas son
decorativos para tecnologías de apoyo (alt=""). No existe selección automática
por palabras ni se publican candidatos descartados.

La variante B admite apoyo contextual junto a uno o varios bloques. La variante C
queda reservada a una secuencia real y ordenada y no se infiere por cantidad.
"""
from __future__ import annotations

import argparse
import html
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
CONFIG = REPO / "editorial/pictogramas.yml"
SOURCE_DIR = REPO / "assets/mulberry"
CSS_LINK = '<link rel="stylesheet" href="/assets/mulberry-pictograms.css">'
CARD_MARKER = 'data-iris-card-cta="true"'
LICENSE_NAME = "LICENSE-MULBERRY.txt"
EXPECTED = {
    "hablar": "hablar.svg",
    "escribir": "escribir.svg",
    "esperar": "esperar.svg",
    "preguntar": "preguntar.svg",
    "carpeta": "carpeta.svg",
}


def load_config() -> dict:
    data = json.loads(CONFIG.read_text(encoding="utf-8"))
    pictos = data.get("pictogramas")
    assignments = data.get("asignaciones")
    if not isinstance(pictos, dict) or pictos != {
        key: {"archivo": value, "estado": "PUBLICABLE"}
        for key, value in EXPECTED.items()
    }:
        raise AssertionError("pictogramas.yml debe contener exactamente los cinco pictogramas PUBLICABLE aprobados")
    if not isinstance(assignments, dict):
        raise AssertionError("pictogramas.yml no contiene asignaciones editoriales")
    return data


def validate_public_assets(root: Path) -> dict[str, str]:
    source_names = {p.name for p in SOURCE_DIR.glob("*.svg")}
    if source_names != set(EXPECTED.values()):
        raise AssertionError(f"SVG Mulberry de fuente inesperados: {sorted(source_names)}")
    if not (SOURCE_DIR / LICENSE_NAME).is_file():
        raise FileNotFoundError(SOURCE_DIR / LICENSE_NAME)

    public_dir = root / "assets/mulberry"
    if not public_dir.is_dir():
        raise FileNotFoundError(public_dir)
    public_svgs = {p.name for p in public_dir.glob("*.svg")}
    if public_svgs != set(EXPECTED.values()):
        raise AssertionError(f"SVG Mulberry publicados inesperados: {sorted(public_svgs)}")
    license_path = public_dir / LICENSE_NAME
    if not license_path.is_file() or license_path.stat().st_size == 0:
        raise AssertionError("Falta la licencia Mulberry pública")

    urls: dict[str, str] = {}
    for picto_id, filename in EXPECTED.items():
        path = public_dir / filename
        text = path.read_text(encoding="utf-8", errors="strict")
        if "<style" in text.lower():
            raise AssertionError(f"{filename} conserva un bloque <style>")
        if "fill=" not in text and "stroke=" not in text:
            raise AssertionError(f"{filename} no contiene atributos de presentación directos")
        urls[picto_id] = f"/assets/mulberry/{filename}"
    return urls


def add_css(text: str) -> str:
    if CSS_LINK in text:
        return text
    if "</head>" not in text:
        raise AssertionError("Página sin </head>")
    return text.replace("</head>", CSS_LINK + "\n</head>", 1)


def mark_variant(text: str, variant: str) -> str:
    if variant not in {"B", "C"}:
        raise AssertionError(f"Variante de pictogramas no válida: {variant}")
    pattern = re.compile(
        r'(<aside\b[^>]*\bclass=["\'][^"\']*\biris-mini-card\b[^"\']*["\'][^>]*)>',
        re.I,
    )
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise AssertionError(f"Se esperaba una Tarjeta Iris y se encontraron {len(matches)}")
    m = matches[0]
    attrs = m.group(1)
    if re.search(r'\bdata-iris-picto-variant=["\'][ABC]["\']', attrs, re.I):
        attrs = re.sub(
            r'\bdata-iris-picto-variant=["\'][ABC]["\']',
            f'data-iris-picto-variant="{variant}"',
            attrs,
            count=1,
            flags=re.I,
        )
    else:
        attrs += f' data-iris-picto-variant="{variant}"'
    return text[:m.start()] + attrs + ">" + text[m.end():]


def decorate_block(text: str, heading: str, picto_id: str, src: str) -> str:
    marker = f'data-mulberry-picto="{picto_id}"'
    if marker in text:
        return text
    pattern = re.compile(
        r'(<section class="iris-mini-block(?: [^"]*)?">\s*'
        r'<h3>' + re.escape(heading) + r'</h3>\s*)'
        r'(<p>.*?</p>)'
        r'(\s*</section>)',
        flags=re.S,
    )
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise AssertionError(f'Se esperaba un bloque «{heading}» y se encontraron {len(matches)}')
    image = (
        f'<img class="iris-mini-picto" src="{html.escape(src, quote=True)}" '
        'width="64" height="64" alt="" aria-hidden="true">'
    )
    replacement = (
        matches[0].group(1)
        + f'<div class="iris-mini-support" {marker}>'
        + image
        + matches[0].group(2)
        + "</div>"
        + matches[0].group(3)
    )
    return text[:matches[0].start()] + replacement + text[matches[0].end():]


def apply_page(root: Path, rel: str, assignment: dict, urls: dict[str, str]) -> bool:
    path = root / rel
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding="utf-8")
    if CARD_MARKER not in text:
        raise AssertionError(f"Tarjeta Iris no generada en {rel}")

    blocks = assignment.get("bloques")
    if not isinstance(blocks, dict) or not blocks:
        raise AssertionError(f"Asignación sin bloques: {rel}")
    variant = assignment.get("variante", "B")
    if variant != "B":
        raise AssertionError(
            f"{rel}: el apoyo junto a bloques corresponde a variante B; "
            "la variante C necesita una secuencia editorial explícita"
        )

    updated = add_css(text)
    updated = mark_variant(updated, variant)
    for heading, picto_id in blocks.items():
        if picto_id not in urls:
            raise AssertionError(f"{rel}: pictograma no aprobado: {picto_id}")
        updated = decorate_block(updated, heading, picto_id, urls[picto_id])

    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def add_credit(root: Path, data: dict) -> bool:
    path = root / "es/tarjetas-iris/index.html"
    text = path.read_text(encoding="utf-8")
    if "data-mulberry-credit" in text:
        return False
    collection = html.escape(str(data["coleccion"]))
    author = html.escape(str(data["autor"]))
    license_name = html.escape(str(data["licencia"]))
    credit = (
        '<p class="iris-privacy" data-mulberry-credit>'
        f'Créditos de pictogramas: {collection} · {author} · '
        f'<a href="/assets/mulberry/{LICENSE_NAME}">{license_name}</a>.'
        '</p>'
    )
    if "</main>" not in text:
        raise AssertionError("Tarjetas Iris sin </main> para créditos Mulberry")
    path.write_text(text.replace("</main>", credit + "</main>", 1), encoding="utf-8")
    return True


def validate_references(root: Path, urls: dict[str, str]) -> None:
    for picto_id, url in urls.items():
        target = root / url.lstrip("/")
        if not target.is_file() or target.stat().st_size == 0:
            raise AssertionError(f"Pictograma publicado ausente: {picto_id} -> {url}")
    for path in root.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        for url in re.findall(r'<img[^>]+src="(/assets/mulberry/[^"]+\.svg)"', text, re.I):
            if not (root / url.lstrip("/")).is_file():
                raise AssertionError(f"Referencia Mulberry rota: {path} -> {url}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    data = load_config()
    urls = validate_public_assets(root)
    changed: list[str] = []
    for rel, assignment in data["asignaciones"].items():
        if apply_page(root, rel, assignment, urls):
            changed.append(rel)
    credit_added = add_credit(root, data)
    validate_references(root, urls)

    print(json.dumps({
        "mulberry_publicables": len(EXPECTED),
        "mulberry_candidates_published": 0,
        "pages_with_editorial_pictograms": len(changed),
        "variant_b": sum(1 for a in data["asignaciones"].values() if a.get("variante", "B") == "B"),
        "variant_c": 0,
        "automatic_keyword_mapping": False,
        "single_credit_page": True,
        "credit_added": credit_added,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
