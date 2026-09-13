#!/usr/bin/env python3
"""Publica e integra apoyos Mulberry con selección editorial explícita.

La configuración vive en ``editorial/pictogramas.yml``. Es JSON válido y, por
ser JSON un subconjunto de YAML 1.2, puede leerse con la biblioteca estándar.
Solo los elementos con estado PUBLICABLE se copian a ``dist/assets/pictos``.
Los SVG se normalizan con ``mulberry_inline.py`` durante el build, reciben un
nombre con hash de contenido y nunca se eligen por coincidencias de palabras.
"""
from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
import tempfile
from pathlib import Path

from mulberry_inline import inline

REPO = Path(__file__).resolve().parents[1]
CONFIG = REPO / "editorial/pictogramas.yml"
SOURCE_DIR = REPO / "assets/mulberry"
CSS_LINK = '<link rel="stylesheet" href="/assets/mulberry-pictograms.css">'
CARD_MARKER = 'data-iris-card-cta="true"'
ALLOWED_STATES = {"PUBLICABLE", "CANDIDATO"}


def load_config() -> dict:
    data = json.loads(CONFIG.read_text(encoding="utf-8"))
    pictos = data.get("pictogramas")
    assignments = data.get("asignaciones")
    if not isinstance(pictos, dict) or not pictos:
        raise AssertionError("pictogramas.yml no contiene pictogramas")
    if not isinstance(assignments, dict):
        raise AssertionError("pictogramas.yml no contiene asignaciones")
    for picto_id, item in pictos.items():
        state = item.get("estado")
        filename = item.get("archivo")
        if state not in ALLOWED_STATES:
            raise AssertionError(f"Estado editorial no válido para {picto_id}: {state}")
        if not isinstance(filename, str) or not filename.endswith(".svg"):
            raise AssertionError(f"Archivo no válido para {picto_id}")
        if state == "PUBLICABLE" and not (SOURCE_DIR / filename).is_file():
            raise FileNotFoundError(SOURCE_DIR / filename)
    return data


def publish_assets(root: Path, data: dict) -> dict[str, str]:
    """Genera únicamente los SVG PUBLICABLE y devuelve id -> URL pública."""
    out = root / "assets/pictos"
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    manifest: dict[str, str] = {}
    with tempfile.TemporaryDirectory(prefix="mulberry-inline-") as tmp:
        temp_dir = Path(tmp)
        for picto_id, item in sorted(data["pictogramas"].items()):
            if item["estado"] != "PUBLICABLE":
                continue
            src = SOURCE_DIR / item["archivo"]
            normalized = temp_dir / item["archivo"]
            inline(src, normalized)
            payload = normalized.read_bytes()
            digest = hashlib.sha256(payload).hexdigest()[:12]
            public_name = f"{picto_id}.{digest}.svg"
            (out / public_name).write_bytes(payload)
            manifest[picto_id] = f"/assets/pictos/{public_name}"

    license_src = SOURCE_DIR / "NOTICE.txt"
    if not license_src.is_file():
        raise FileNotFoundError(license_src)
    shutil.copy2(license_src, out / "NOTICE.txt")
    # assets/mulberry es solo fuente de build: no deja SVG sin hash ni candidatos en dist.
    public_source = root / "assets/mulberry"
    if public_source.exists():
        shutil.rmtree(public_source)
    (out / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    candidates = {
        picto_id for picto_id, item in data["pictogramas"].items()
        if item["estado"] != "PUBLICABLE"
    }
    leaked = candidates.intersection(manifest)
    if leaked:
        raise AssertionError("Se publicaron candidatos: " + ", ".join(sorted(leaked)))
    return manifest


def add_css(text: str) -> str:
    if CSS_LINK in text:
        return text
    if "</head>" not in text:
        raise AssertionError("Página sin </head>")
    return text.replace("</head>", CSS_LINK + "\n</head>", 1)


def mark_variant(text: str, variant: str) -> str:
    if variant not in {"B", "C"}:
        raise AssertionError(f"Variante de pictogramas no válida: {variant}")
    if 'data-iris-picto-variant=' in text:
        return text
    pattern = re.compile(
        r'(<aside\b[^>]*\bclass=["\'][^"\']*\biris-mini-card\b[^"\']*["\'][^>]*)>',
        re.I,
    )
    matches = list(pattern.finditer(text))
    if len(matches) != 1:
        raise AssertionError(f"Se esperaba una Tarjeta Iris y se encontraron {len(matches)}")
    m = matches[0]
    replacement = m.group(1) + f' data-iris-picto-variant="{variant}">'
    return text[:m.start()] + replacement + text[m.end():]


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
        raise AssertionError(
            f'Se esperaba un bloque «{heading}» y se encontraron {len(matches)}'
        )
    image = (
        f'<img class="iris-mini-picto" src="{html.escape(src, quote=True)}" '
        f'width="64" height="64" alt="" aria-hidden="true">'
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


def add_credit(text: str, data: dict) -> str:
    if 'class="iris-mini-picto-credit"' in text:
        return text
    author = html.escape(str(data["autor"]))
    collection = html.escape(str(data["coleccion"]))
    license_name = html.escape(str(data["licencia"]))
    credit = (
        '<p class="iris-mini-picto-credit">'
        f'{collection} · {author} · {license_name} · '
        '<a href="/assets/pictos/NOTICE.txt">licencia</a>'
        '</p>'
    )
    footer = re.search(r'<footer\b[^>]*\bclass="iris-mini-foot"[^>]*>', text, re.I)
    if not footer:
        raise AssertionError("Tarjeta Iris sin pie para la atribución Mulberry")
    return text[:footer.start()] + credit + text[footer.start():]


def apply_page(root: Path, rel: str, assignment: dict, manifest: dict[str, str], data: dict) -> bool:
    path = root / rel
    if not path.is_file():
        raise FileNotFoundError(path)
    text = path.read_text(encoding="utf-8")
    if CARD_MARKER not in text:
        raise AssertionError(f"Tarjeta Iris no generada en {rel}")

    blocks = assignment.get("bloques")
    if not isinstance(blocks, dict) or not blocks:
        raise AssertionError(f"Asignación sin bloques: {rel}")
    variant = assignment.get("variante") or ("B" if len(blocks) == 1 else "C")
    expected_variant = "B" if len(blocks) == 1 else "C"
    if variant != expected_variant:
        raise AssertionError(
            f"{rel}: {len(blocks)} pictograma(s) exige variante {expected_variant}, no {variant}"
        )

    updated = add_css(text)
    updated = mark_variant(updated, variant)
    for heading, picto_id in blocks.items():
        if picto_id not in manifest:
            state = data["pictogramas"].get(picto_id, {}).get("estado", "DESCONOCIDO")
            raise AssertionError(
                f"{rel}: pictograma {picto_id} no publicable (estado {state})"
            )
        updated = decorate_block(updated, heading, picto_id, manifest[picto_id])
    updated = add_credit(updated, data)

    if updated == text:
        return False
    path.write_text(updated, encoding="utf-8")
    return True


def validate_public_references(root: Path, manifest: dict[str, str]) -> None:
    for picto_id, url in manifest.items():
        target = root / url.lstrip("/")
        if not target.is_file() or target.stat().st_size == 0:
            raise AssertionError(f"Pictograma publicado ausente o vacío: {picto_id} -> {url}")
    for path in root.rglob("*.html"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        for url in re.findall(r'<img[^>]+src="(/assets/pictos/[^"]+\.svg)"', text, re.I):
            if not (root / url.lstrip("/")).is_file():
                raise AssertionError(f"Referencia Mulberry rota: {path} -> {url}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()

    data = load_config()
    manifest = publish_assets(root, data)
    changed = []
    for rel, assignment in data["asignaciones"].items():
        if apply_page(root, rel, assignment, manifest, data):
            changed.append(rel)
    validate_public_references(root, manifest)

    publicable = sum(
        1 for item in data["pictogramas"].values() if item["estado"] == "PUBLICABLE"
    )
    candidates = len(data["pictogramas"]) - publicable
    print(json.dumps({
        "mulberry_publicables": publicable,
        "mulberry_candidates_not_published": candidates,
        "pages_with_editorial_pictograms": len(changed),
        "variant_b": sum(1 for a in data["asignaciones"].values() if a.get("variante") == "B"),
        "variant_c": sum(1 for a in data["asignaciones"].values() if a.get("variante") == "C"),
        "automatic_keyword_mapping": False,
        "result": "accepted",
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
