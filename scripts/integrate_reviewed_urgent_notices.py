#!/usr/bin/env python3
"""Integra únicamente los cuatro avisos urgentes aprobados tras revisar 187 Situaciones.

No recrea una sección «Señales de alerta». Añade una frase al final de
«Cuándo pedir ayuda profesional» / «When to seek professional help».
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

CASES = {
    "es/situaciones/beber-agua-me-resulta-desagradable-por-la-sensacion/index.html": (
        "Cuándo pedir ayuda profesional",
        "Busca ayuda urgente si la falta de líquidos provoca deshidratación grave.",
    ),
    "en/situations/drinking-water-feels-unpleasant-because-of-the-sensation/index.html": (
        "When to seek professional help",
        "Seek urgent medical help if not drinking enough leads to severe dehydration.",
    ),
    "es/situaciones/puedo-pasar-horas-sin-acordarme-de-beber/index.html": (
        "Cuándo pedir ayuda profesional",
        "Busca ayuda urgente si la falta de líquidos provoca deshidratación grave.",
    ),
    "en/situations/i-can-go-for-hours-without-remembering-to-drink/index.html": (
        "When to seek professional help",
        "Seek urgent medical help if not drinking enough leads to severe dehydration.",
    ),
    "es/situaciones/se-me-olvida-comer/index.html": (
        "Cuándo pedir ayuda profesional",
        "Busca ayuda urgente si la ingesta insuficiente provoca malnutrición grave o deshidratación grave.",
    ),
    "en/situations/i-forget-to-eat/index.html": (
        "When to seek professional help",
        "Seek urgent medical help if inadequate intake leads to severe malnutrition or severe dehydration.",
    ),
    "es/situaciones/no-nota-hambre-o-sed/index.html": (
        "Cuándo pedir ayuda profesional",
        "Busca ayuda urgente si la falta de líquidos provoca deshidratación grave.",
    ),
    "en/situations/they-dont-notice-hunger-or-thirst/index.html": (
        "When to seek professional help",
        "Seek urgent medical help if not drinking enough leads to severe dehydration.",
    ),
}

FORBIDDEN_HEADINGS = ("Señales de alerta", "Warning signs", "Puede estar relacionado con", "May be related to")


def integrate(path: Path, heading: str, sentence: str) -> bool:
    text = path.read_text(encoding="utf-8")
    if sentence in text:
        return False
    # Localiza la sección por su h2 y añade un segundo párrafo antes de </section>.
    pattern = re.compile(
        r'(<section\b[^>]*>\s*<h2[^>]*>' + re.escape(heading) + r'</h2>)(.*?)(</section>)',
        re.I | re.S,
    )
    m = pattern.search(text)
    if not m:
        raise AssertionError(f"No se encontró {heading!r} en {path.relative_to(ROOT)}")
    body = m.group(2)
    body = body.rstrip() + f'<p>{sentence}</p>'
    text = text[:m.start()] + m.group(1) + body + m.group(3) + text[m.end():]
    path.write_text(text, encoding="utf-8")
    return True


def main():
    changed = []
    for rel, (heading, sentence) in CASES.items():
        p = ROOT / rel
        if not p.is_file():
            raise FileNotFoundError(p)
        if integrate(p, heading, sentence):
            changed.append(rel)

    # Aceptación exacta de los ocho pares ES/EN.
    for rel, (heading, sentence) in CASES.items():
        text = (ROOT / rel).read_text(encoding="utf-8")
        if text.count(sentence) != 1:
            raise AssertionError(f"Aviso aprobado ausente o duplicado: {rel}")
        if not re.search(r'<h2[^>]*>' + re.escape(heading) + r'</h2>.*?' + re.escape(sentence), text, re.I | re.S):
            raise AssertionError(f"Aviso fuera de la sección correcta: {rel}")
        for forbidden in FORBIDDEN_HEADINGS:
            if re.search(r'<h[23][^>]*>\s*' + re.escape(forbidden) + r'\s*</h[23]>', text, re.I):
                raise AssertionError(f"Se reintrodujo encabezado prohibido {forbidden}: {rel}")

    print({"reviewed_urgent_notices": len(CASES), "changed": changed})


if __name__ == "__main__":
    main()
