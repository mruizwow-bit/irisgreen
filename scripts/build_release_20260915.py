#!/usr/bin/env python3
"""Build de producción Iris Green · entrega 15-09-2026.

Aplica el paquete fuente revisado de esta entrega, ejecuta el build normal,
conecta Tarjeta Iris en inglés y valida los recuentos antes de publicar.
"""
from __future__ import annotations

import base64
import io
import json
import re
import subprocess
import sys
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
PAYLOAD = ROOT / "release" / "20260915"


def apply_payload() -> None:
    chunks = sorted(PAYLOAD.glob("*.b64"))
    if not chunks:
        raise AssertionError("Falta el paquete fuente de la entrega")
    encoded = "".join(p.read_text(encoding="ascii").strip() for p in chunks)
    raw = base64.b64decode(encoded, validate=True)
    with tarfile.open(fileobj=io.BytesIO(raw), mode="r:gz") as tf:
        root = ROOT.resolve()
        for member in tf.getmembers():
            target = (ROOT / member.name).resolve()
            if root != target and root not in target.parents:
                raise AssertionError(f"Ruta insegura en el paquete: {member.name}")
        tf.extractall(ROOT)

    for rel in (
        "assets/maintenance.html",
        "assets/muestras/luma/p01.avif",
        "MAINTENANCE_ACTIVE.txt",
    ):
        path = ROOT / rel
        if path.exists() and path.is_file():
            path.unlink()


def run(*parts: str) -> None:
    subprocess.run([sys.executable, *parts], cwd=ROOT, check=True)


def editorial_count() -> tuple[int, int]:
    total = 0
    bad = 0
    for name in (
        "tarjetas-necesito-vida-diaria.json",
        "tarjetas-necesito-condiciones.json",
        "tarjetas-necesito-situaciones.json",
    ):
        data = json.loads((ROOT / "editorial" / name).read_text(encoding="utf-8"))
        for key, value in data.items():
            if key.startswith("_"):
                continue
            total += 1
            es = (value or {}).get("es", "")
            en = (value or {}).get("en", "")
            if re.search(r"\bnecesito\b", es, flags=re.I) or re.search(r"\bI need\b", en, flags=re.I):
                bad += 1
    return total, bad


def validate_dist() -> dict[str, int]:
    es_cards = en_cards = es_empty = en_empty = 0
    for path in DIST.glob("es/**/*.html"):
        text = path.read_text(encoding="utf-8", errors="replace")
        if 'data-iris-card-static="true"' in text:
            es_cards += 1
        if 'iris-mini-empty' in text and 'data-iris-card-cta="true"' in text:
            es_empty += 1
    for path in DIST.glob("en/**/*.html"):
        text = path.read_text(encoding="utf-8", errors="replace")
        if 'class="iris-cta iris-mini-card' in text and 'data-iris-card-cta="true"' in text:
            en_cards += 1
        if 'iris-mini-empty' in text and 'data-iris-card-cta="true"' in text:
            en_empty += 1
    html = sum(1 for _ in DIST.rglob("*.html"))
    got = {"html": html, "es_cards": es_cards, "en_cards": en_cards, "es_empty": es_empty, "en_empty": en_empty}
    expected = {"html": 1003, "es_cards": 415, "en_cards": 415, "es_empty": 5, "en_empty": 5}
    if got != expected:
        raise AssertionError(f"Recuento final inesperado: {got} != {expected}")
    return got


def main() -> None:
    apply_payload()
    total, bad = editorial_count()
    if total != 415 or bad:
        raise AssertionError(f"Tarjeta Iris editorial inválida: total={total}, repeticiones={bad}")

    run(str(ROOT / "scripts" / "build_site.py"))
    run(str(ROOT / "scripts" / "connect_tarjetas_iris_en.py"), "--root", str(DIST))

    for rel in ("assets/maintenance.html", "assets/muestras/luma/p01.avif"):
        path = DIST / rel
        if path.exists():
            path.unlink()

    counts = validate_dist()
    counts.update({"editorial": total, "repeticiones": bad})
    print(json.dumps(counts, ensure_ascii=False))


if __name__ == "__main__":
    main()
