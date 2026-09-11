#!/usr/bin/env python3
"""La web pública no dice si un texto está verificado, aprobado o validado.

Eso es información de trabajo: le sirve a quien edita, no a quien lee. Y en una
web sobre neurodiversidad, un sello de «validado» junto a una explicación de
salud dice algo que la página no puede sostener.

Este guion recorre la salida pública y falla si encuentra un estado editorial,
en el texto o en los atributos. Distingue dos cosas:

  · **Estado**: un rótulo, una pastilla, un aviso, una línea «Estado:» o un
    atributo que declara en qué punto del trabajo está la página. Prohibido.
  · **Contenido**: «revisión sistemática» es un diseño de estudio, «revisada por
    pares» es cómo se publicó un artículo y «versión validada» es el nombre de
    un cuestionario. Eso se queda: es lo que la página explica.

Lo que no encaja en ninguna de las dos lo saca a una lista para mirarlo, en vez
de decidir por su cuenta.

Escribe reports/publicacion/sin-estados.md. Con --informe-solo no detiene el build.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SALIDA = ROOT / "reports/publicacion/sin-estados.md"

ESTRUCTURA = {
    "pastilla de estado": re.compile(r'<span\b[^>]*class=["\'][^"\']*\b(?:chip|meta|badge|pill)\b[^"\']*["\'][^>]*>[^<]*\b(?:BORRADOR|DRAFT|REVISAD[OA]|REVIEWED|VALIDAD[OA]|VALIDATED|VERIFICAD[OA]|VERIFIED|APROBAD[OA]|APPROVED|PENDIENTE|PENDING)\b', re.I),
    "línea de estado": re.compile(r'<strong>\s*(?:Estado|Status|Validaci[óo]n|Validation|Verificaci[óo]n|Revisi[óo]n|Review|Aprobaci[óo]n)\s*:', re.I),
    "atributo de estado": re.compile(r'\b(?:data-editorial-status|data-estado|data-validacion|data-revision)\s*=', re.I),
    "estado en JSON": re.compile(r'"(?:status|estado|reviewed|reviewedBy|validated|verificado|aprobado)"\s*:', re.I),
    "aviso de borrador": re.compile(r'<p\b[^>]*class=["\'][^"\']*\bnotice\b[^"\']*["\'][^>]*>\s*(?:P[áa]gina en borrador|Draft (?:page|entry)|Validad[oa] para publicaci[óo]n|Validated for publication|Ficha verificada)', re.I),
    "encabezado de estado": re.compile(r'<h[1-6][^>]*>\s*(?:[ÚU]ltima (?:revisi[óo]n|validaci[óo]n|verificaci[óo]n)[^<]*|Revisi[óo]n|Review|Validaci[óo]n|Verificaci[óo]n|Estado editorial)\s*</h[1-6]>', re.I),
    "fecha de validación": re.compile(r'(?:[ÚU]ltima|Fecha de)\s+(?:validaci[óo]n|verificaci[óo]n|aprobaci[óo]n)\s*:', re.I),
    "sello en el texto": re.compile(r'\b(?:texto|ficha|p[áa]gina|contenido|informaci[óo]n)\s+(?:ya\s+)?(?:verificad[oa]|validad[oa]|aprobad[oa])\b', re.I),
}

PERMITIDO = [
    re.compile(r"revisi[óo]n(?:es)? sistem[áa]tica", re.I),
    re.compile(r"revisi[óo]n de revisiones", re.I),
    re.compile(r"revisi[óo]n narrativa|revisi[óo]n integradora|revisi[óo]n de alcance", re.I),
    re.compile(r"revisad[oa]s? por pares|peer[- ]reviewed", re.I),
    re.compile(r"versi[óo]n validada|escala validada|cuestionario validado|adaptaci[óo]n validada", re.I),
    re.compile(r"gu[íi]a cl[íi]nica|guidelines?", re.I),
    re.compile(r"tareas? pendientes?|revisi[óo]n prevista", re.I),
]

A_MIRAR = re.compile(r"\b(?:verificad[oa]s?|validad[oa]s?|aprobad[oa]s?|revisad[oa]s?|borrador(?:es)?|draft)\b", re.I)
SIN_ETIQUETAS = re.compile(r"<(script|style)\b[^>]*>.*?</\1>|<[^>]+>", re.S)


def visible(texto: str) -> str:
    return re.sub(r"\s+", " ", SIN_ETIQUETAS.sub(" ", texto))


def legitimo(frase: str) -> bool:
    return any(p.search(frase) for p in PERMITIDO)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=ROOT / "dist")
    ap.add_argument("--informe-solo", action="store_true")
    args = ap.parse_args()
    raiz = args.root.resolve()

    prohibidos = []
    a_mirar = []
    revisados = 0

    for ruta in sorted(raiz.rglob("*")):
        if not ruta.is_file() or ruta.suffix.lower() not in {".html", ".json", ".js", ".xml", ".txt"}:
            continue
        try:
            texto = ruta.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        rel = ruta.relative_to(raiz).as_posix()
        revisados += 1
        for nombre, patron in ESTRUCTURA.items():
            m = patron.search(texto)
            if m:
                prohibidos.append({"pagina": rel, "tipo": nombre, "trozo": texto[max(0, m.start() - 60):m.end() + 60].strip()[:200]})
        if ruta.suffix.lower() == ".html":
            legible = visible(texto)
            for m in A_MIRAR.finditer(legible):
                frase = legible[max(0, m.start() - 90):m.end() + 90]
                if legitimo(frase):
                    continue
                a_mirar.append({"pagina": rel, "palabra": m.group(0), "frase": frase.strip()[:200]})

    lineas = ["# La web pública, sin estados editoriales", "",
              f"Archivos de texto revisados: {revisados}.", "",
              "| Comprobación | Resultado |", "| --- | ---: |",
              f"| Estados en la estructura de la página | {len(prohibidos)} |",
              f"| Palabras de estado en el texto, a mirar | {len(a_mirar)} |", ""]
    if prohibidos:
        lineas += ["## Prohibidos: hay que quitarlos", "", "| Página | Tipo | Dónde |", "| --- | --- | --- |"]
        lineas += [f"| {p['pagina']} | {p['tipo']} | {p['trozo'].replace('|', '/')} |" for p in prohibidos[:200]]
        lineas.append("")
    if a_mirar:
        lineas += ["## A mirar: puede ser contenido legítimo", "",
                   "«Revisión sistemática», «revisada por pares» o «versión validada» son contenido y no se cuentan. Lo de aquí no encaja en esas formas y conviene leerlo.", "",
                   "| Página | Palabra | Frase |", "| --- | --- | --- |"]
        lineas += [f"| {a['pagina']} | {a['palabra']} | {a['frase'].replace('|', '/')} |" for a in a_mirar[:200]]
        lineas.append("")
    if not prohibidos and not a_mirar:
        lineas += ["La salida pública no declara en ningún sitio si un texto está verificado, aprobado o validado.", ""]

    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text("\n".join(lineas) + "\n", encoding="utf-8")
    print(json.dumps({
        "archivos_revisados": revisados,
        "estados_prohibidos": len(prohibidos),
        "palabras_a_mirar": len(a_mirar),
        "informe": SALIDA.relative_to(ROOT).as_posix(),
    }, ensure_ascii=False, indent=1))
    for item in prohibidos:
        print("PROHIBIDO " + json.dumps(item, ensure_ascii=False), flush=True)
    for item in a_mirar:
        print("A_MIRAR " + json.dumps(item, ensure_ascii=False), flush=True)
    if prohibidos and not args.informe_solo:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
