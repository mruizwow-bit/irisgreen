#!/usr/bin/env python3
"""Auditoría global de accesibilidad estructural sobre la salida pública.

Comprueba, página a página y solo con la biblioteca estándar:
  · que hay un <main> y un único <h1> visible con texto;
  · que cada campo de formulario visible tiene nombre accesible;
  · que cada botón y cada enlace visibles tienen texto o nombre accesible;
  · que cada imagen visible declara alt.

La auditoría estructural representa la vista con JavaScript: no suma contenido de
<noscript>, <template>, diálogos cerrados ni subárboles hidden/aria-hidden=true.
La lectura sin JavaScript se comprueba por separado con audit_sin_js.py.

No corrige nada y no juzga contenido. No es una certificación WCAG: no mide
contraste, foco, teclado ni lectores de pantalla.
"""
from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
FIELDS = {"input", "select", "textarea"}
SKIP_INPUT_TYPES = {"hidden", "submit", "reset", "button", "image"}
IGNORED_CONTAINERS = {"noscript", "template"}


class Audit(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, dict, bool]] = []
        self.has_main = False
        self.h1_text: list[str] = []
        self.labels_for: set[str] = set()
        self.fields: list[dict] = []
        self.controls: list[tuple[str, dict, str]] = []
        self.images: list[dict] = []
        self.open_control: list[tuple[str, dict, list[str]]] = []
        self.feed(text)

    @property
    def ignored(self) -> bool:
        return bool(self.stack and self.stack[-1][2])

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        inherited = self.ignored
        hidden_here = (
            tag in IGNORED_CONTAINERS
            or (tag == "dialog" and "open" not in a)
            or "hidden" in a
            or a.get("aria-hidden", "").lower() == "true"
        )
        ignored = inherited or hidden_here

        if not ignored:
            if tag == "main" or a.get("role") == "main":
                self.has_main = True
            if tag == "label" and a.get("for"):
                self.labels_for.add(a["for"])
            if tag in FIELDS:
                if not (tag == "input" and a.get("type", "text").lower() in SKIP_INPUT_TYPES):
                    a["_inside_label"] = any(t == "label" and not skip for t, _, skip in self.stack)
                    self.fields.append(a)
            if tag == "img":
                self.images.append(a)
            if tag in {"button", "a", "h1"}:
                self.open_control.append((tag, a, []))

        if tag not in VOID:
            self.stack.append((tag, a, ignored))

    def handle_endtag(self, tag):
        while self.stack and self.stack[-1][0] != tag:
            self.stack.pop()
        if self.stack:
            self.stack.pop()
        if self.open_control and self.open_control[-1][0] == tag:
            name, attrs, chunks = self.open_control.pop()
            inner = "".join(chunks).strip()
            if name == "h1":
                self.h1_text.append(inner)
            else:
                self.controls.append((name, attrs, inner))

    def handle_data(self, data):
        if self.ignored or not data.strip():
            return
        for _, _, chunks in self.open_control:
            chunks.append(data)


def named(attrs: dict, inner: str = "") -> bool:
    if inner.strip():
        return True
    for key in ("aria-label", "title", "alt", "value"):
        if attrs.get(key, "").strip():
            return True
    return bool(attrs.get("aria-labelledby", "").strip())


def check(rel: str, text: str) -> list[str]:
    doc = Audit(text)
    problems: list[str] = []
    if not doc.has_main:
        problems.append("no hay <main>")
    if not doc.h1_text:
        problems.append("no hay <h1>")
    elif len([t for t in doc.h1_text if t]) == 0:
        problems.append("el <h1> está vacío")
    elif len(doc.h1_text) > 1:
        problems.append(f"hay {len(doc.h1_text)} <h1>")
    for field in doc.fields:
        if named(field) or field.get("id", "") in doc.labels_for or field.get("_inside_label"):
            continue
        kind = field.get("type", "text")
        problems.append(f"campo sin nombre accesible: {kind} {field.get('class','')[:40]}".strip())
    for tag, attrs, inner in doc.controls:
        if tag == "a" and not attrs.get("href"):
            continue
        if named(attrs, inner):
            continue
        problems.append(f"{'botón' if tag == 'button' else 'enlace'} sin nombre accesible: {attrs.get('class','') or attrs.get('href','')}"[:120])
    for img in doc.images:
        if "alt" not in img:
            problems.append("imagen sin alt: " + img.get("src", "")[:70])
    return problems


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    parser.add_argument("--informe-solo", action="store_true", help="escribe el informe y no detiene el build")
    args = parser.parse_args()
    root = args.root.resolve()

    findings: dict[str, list[str]] = {}
    scanned = 0
    for path in sorted(root.rglob("*.html")):
        rel = path.relative_to(root).as_posix()
        scanned += 1
        problems = check(rel, path.read_text(encoding="utf-8"))
        if problems:
            findings[rel] = problems

    out = root / "reports/publicacion"
    out.mkdir(parents=True, exist_ok=True)
    total = sum(len(v) for v in findings.values())
    resumen = {
        "html_revisados": scanned,
        "paginas_con_fallos": len(findings),
        "fallos": total,
        "limites": "Comprobación mecánica de estructura y nombres accesibles en la vista con JavaScript. No mide contraste, foco, teclado ni lectores de pantalla; la vista sin JavaScript se audita por separado.",
        "detalle": findings,
    }
    (out / "accesibilidad.json").write_text(json.dumps(resumen, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({"html_revisados": scanned, "paginas_con_fallos": len(findings), "fallos": total}, ensure_ascii=False))
    if findings and not args.informe_solo:
        muestra = {k: findings[k] for k in list(findings)[:20]}
        raise AssertionError("Accesibilidad estructural: " + json.dumps(muestra, ensure_ascii=False)[:3000])


if __name__ == "__main__":
    main()
