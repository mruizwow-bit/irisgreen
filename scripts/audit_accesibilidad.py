#!/usr/bin/env python3
"""Auditoría global de accesibilidad estructural sobre la salida pública.

Comprueba, página a página y solo con la biblioteca estándar:
  · que cada vista pública tiene un <main> y un único <h1> con texto;
  · que cada campo de formulario tiene nombre accesible (el marcador no cuenta);
  · que cada botón y cada enlace tienen texto o nombre accesible;
  · que cada imagen declara alt.

Las páginas que incluyen una instantánea <noscript> se auditan en dos modos
separados. El contenido oculto con ``hidden`` / ``aria-hidden=true`` no cuenta
como estructura visible. Así no se suman como dos encabezados la vista con
JavaScript y su alternativa sin JavaScript, que nunca aparecen a la vez.

No corrige nada y no juzga contenido. No es una certificación WCAG: no mide
contraste, ni foco, ni teclado, ni lectores de pantalla.
"""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
FIELDS = {"input", "select", "textarea"}
SKIP_INPUT_TYPES = {"hidden", "submit", "reset", "button", "image"}
NOSCRIPT = re.compile(r"<noscript\b[^>]*>(.*?)</noscript\s*>", re.I | re.S)


class Audit(HTMLParser):
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, dict, bool]] = []
        self.hidden_depth = 0
        self.has_main = False
        self.h1_text: list[str] = []
        self.labels_for: set[str] = set()
        self.fields: list[dict] = []
        self.controls: list[tuple[str, dict, str]] = []
        self.images: list[dict] = []
        self.open_control: list[tuple[str, dict, list[str]]] = []
        self.feed(text)

    def _hidden(self, attrs: dict) -> bool:
        return "hidden" in attrs or attrs.get("aria-hidden", "").lower() == "true"

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        starts_hidden = self._hidden(a)
        hidden = self.hidden_depth > 0 or starts_hidden
        if tag not in VOID:
            self.stack.append((tag, a, starts_hidden))
            if starts_hidden:
                self.hidden_depth += 1
        if hidden:
            return
        if tag == "main" or a.get("role") == "main":
            self.has_main = True
        if tag == "label" and a.get("for"):
            self.labels_for.add(a["for"])
        if tag in FIELDS:
            if not (tag == "input" and a.get("type", "text").lower() in SKIP_INPUT_TYPES):
                # Los elementos void (input) no se apilan, así que el <label>
                # padre sigue estando en self.stack. Select/textarea sí se han
                # apilado y deben ignorar su propia entrada al mirar ancestros.
                ancestors = self.stack if tag in VOID else self.stack[:-1]
                a["_inside_label"] = any(t == "label" for t, _, _ in ancestors)
                self.fields.append(a)
        if tag == "img":
            self.images.append(a)
        if tag in {"button", "a", "h1"}:
            self.open_control.append((tag, a, []))

    def handle_endtag(self, tag):
        if self.hidden_depth == 0 and self.open_control and self.open_control[-1][0] == tag:
            name, attrs, pieces = self.open_control.pop()
            inner = " ".join(" ".join(pieces).split())
            if name == "h1":
                self.h1_text.append(inner)
            else:
                self.controls.append((name, attrs, inner))
        while self.stack and self.stack[-1][0] != tag:
            _, _, hidden_start = self.stack.pop()
            if hidden_start:
                self.hidden_depth = max(0, self.hidden_depth - 1)
        if self.stack:
            _, _, hidden_start = self.stack.pop()
            if hidden_start:
                self.hidden_depth = max(0, self.hidden_depth - 1)

    def handle_data(self, data):
        if self.hidden_depth or not data.strip():
            return
        if self.open_control:
            for _, _, pieces in self.open_control:
                pieces.append(data)


def named(attrs: dict, inner: str = "") -> bool:
    if inner.strip():
        return True
    for key in ("aria-label", "title", "alt", "value"):
        if attrs.get(key, "").strip():
            return True
    return bool(attrs.get("aria-labelledby", "").strip())


def check_view(text: str) -> list[str]:
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


def check(rel: str, text: str) -> list[str]:
    problems: list[str] = []
    # Vista normal: la alternativa noscript no forma parte del árbol visible.
    normal = NOSCRIPT.sub("", text)
    problems.extend(check_view(normal))
    # Solo auditamos una vista sin JS separada cuando el noscript contiene su
    # propio contenido principal. Los mensajes noscript breves complementan la
    # misma página y no son documentos independientes.
    snapshots = [m.group(1) for m in NOSCRIPT.finditer(text) if re.search(r"<main\b", m.group(1), re.I)]
    for snapshot in snapshots:
        for item in check_view(snapshot):
            problems.append("sin JS: " + item)
    return list(dict.fromkeys(problems))


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
        problems = check(rel, path.read_text(encoding="utf-8", errors="replace"))
        if problems:
            findings[rel] = problems

    out = root / "reports/publicacion"
    out.mkdir(parents=True, exist_ok=True)
    total = sum(len(v) for v in findings.values())
    resumen = {
        "html_revisados": scanned,
        "paginas_con_fallos": len(findings),
        "fallos": total,
        "modos": "La vista normal y las instantáneas <noscript> con <main> se comprueban por separado; el contenido hidden no cuenta como visible.",
        "limites": "Comprobación mecánica de estructura y nombres accesibles. No mide contraste, foco, teclado ni lectores de pantalla.",
        "detalle": findings,
    }
    (out / "accesibilidad.json").write_text(json.dumps(resumen, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({"html_revisados": scanned, "paginas_con_fallos": len(findings), "fallos": total}, ensure_ascii=False))
    if findings and not args.informe_solo:
        muestra = {k: findings[k] for k in list(findings)[:20]}
        raise AssertionError("Accesibilidad estructural: " + json.dumps(muestra, ensure_ascii=False)[:3000])


if __name__ == "__main__":
    main()
