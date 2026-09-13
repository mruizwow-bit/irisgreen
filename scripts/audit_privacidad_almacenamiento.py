#!/usr/bin/env python3
"""Bloquea regresiones de almacenamiento que contradigan la política de privacidad.

La comprobación se ejecuta sobre ``dist``: revisa el JavaScript y los scripts
incluidos en HTML que realmente se publican. No pretende certificar cumplimiento
jurídico. Su objetivo es mantener acotados los usos conocidos de Web Storage y
frenar la introducción accidental de cookies, IndexedDB o claves nuevas sin una
revisión explícita de privacidad.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

# Contrato técnico actual. Si una función necesita guardar una clave nueva, debe
# revisarse a la vez la página pública de Privacidad y actualizar este inventario
# de forma consciente; no se amplía la lista solo para hacer pasar CI.
ALLOWED_STORAGE = {
    "localStorage": {
        "ig-a11y": {"getItem", "setItem", "removeItem"},
        # Compatibilidad defensiva: en páginas ES se elimina una preferencia de
        # idioma antigua. No se permite volver a escribirla.
        "ig_lang": {"removeItem"},
    },
    "sessionStorage": {
        # Conserva temporalmente la vuelta al listado de Condiciones durante la
        # sesión del navegador; no persiste entre sesiones.
        "ig-conditions-url": {"getItem", "setItem", "removeItem"},
    },
}

LITERAL_CALL_RE = re.compile(
    r"\b(?:window\s*\.\s*)?"
    r"(?P<storage>localStorage|sessionStorage)\s*\.\s*"
    r"(?P<action>getItem|setItem|removeItem)\s*\(\s*"
    r"(?P<quote>['\"])(?P<key>[^'\"]+)(?P=quote)",
    re.I,
)
ANY_CALL_RE = re.compile(
    r"\b(?:window\s*\.\s*)?"
    r"(?P<storage>localStorage|sessionStorage)\s*\.\s*"
    r"(?P<action>getItem|setItem|removeItem)\s*\(",
    re.I,
)
CLEAR_RE = re.compile(
    r"\b(?:window\s*\.\s*)?(?P<storage>localStorage|sessionStorage)\s*\.\s*clear\s*\(",
    re.I,
)
DANGEROUS_PATTERNS = {
    "escritura document.cookie": re.compile(r"\bdocument\s*\.\s*cookie\s*=", re.I),
    "Cookie Store API": re.compile(r"\bcookieStore\s*\.\s*(?:set|delete)\s*\(", re.I),
    "IndexedDB": re.compile(r"\bindexedDB\s*\.\s*(?:open|deleteDatabase)\s*\(", re.I),
}


def line_number(text: str, pos: int) -> int:
    return text.count("\n", 0, pos) + 1


def public_text_files(root: Path) -> list[Path]:
    return sorted(
        p for p in root.rglob("*")
        if p.is_file() and p.suffix.lower() in {".html", ".js"}
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        raise SystemExit(f"No existe el directorio público: {root}")

    calls: list[dict[str, object]] = []
    dynamic_calls: list[dict[str, object]] = []
    broad_clear: list[dict[str, object]] = []
    forbidden_apis: list[dict[str, object]] = []
    errors: list[str] = []

    files = public_text_files(root)
    for path in files:
        text = path.read_text(encoding="utf-8", errors="ignore")
        rel = path.relative_to(root).as_posix()

        literal_starts: set[int] = set()
        for match in LITERAL_CALL_RE.finditer(text):
            literal_starts.add(match.start())
            storage = match.group("storage")
            action = match.group("action")
            key = match.group("key")
            item = {
                "file": rel,
                "line": line_number(text, match.start()),
                "storage": storage,
                "action": action,
                "key": key,
            }
            calls.append(item)
            allowed_actions = ALLOWED_STORAGE.get(storage, {}).get(key)
            if not allowed_actions or action not in allowed_actions:
                errors.append(
                    f"{rel}:{item['line']}: uso no aprobado de {storage}.{action}({key!r})"
                )

        for match in ANY_CALL_RE.finditer(text):
            if match.start() in literal_starts:
                continue
            item = {
                "file": rel,
                "line": line_number(text, match.start()),
                "storage": match.group("storage"),
                "action": match.group("action"),
            }
            dynamic_calls.append(item)
            errors.append(
                f"{rel}:{item['line']}: llamada a {item['storage']}.{item['action']} "
                "con clave no literal; no puede auditarse de forma reproducible"
            )

        for match in CLEAR_RE.finditer(text):
            item = {
                "file": rel,
                "line": line_number(text, match.start()),
                "storage": match.group("storage"),
            }
            broad_clear.append(item)
            errors.append(
                f"{rel}:{item['line']}: {item['storage']}.clear() podría borrar datos ajenos a Iris Green"
            )

        for label, pattern in DANGEROUS_PATTERNS.items():
            for match in pattern.finditer(text):
                item = {
                    "file": rel,
                    "line": line_number(text, match.start()),
                    "api": label,
                }
                forbidden_apis.append(item)
                errors.append(f"{rel}:{item['line']}: almacenamiento no aprobado: {label}")

    report = {
        "archivos_revisados": len(files),
        "contrato": {
            storage: {key: sorted(actions) for key, actions in keys.items()}
            for storage, keys in ALLOWED_STORAGE.items()
        },
        "llamadas_web_storage": calls,
        "llamadas_con_clave_dinamica": dynamic_calls,
        "borrados_globales": broad_clear,
        "apis_persistentes_no_aprobadas": forbidden_apis,
        "alcance": [
            "Revisa HTML y JavaScript de dist; no certifica cumplimiento jurídico.",
            "Solo reconoce llamadas directas a localStorage/sessionStorage con getItem, setItem o removeItem.",
            "Las claves nuevas requieren revisar expresamente el texto público de Privacidad antes de ampliar el contrato.",
        ],
        "errores": errors,
    }
    output = root / "reports/publicacion/privacidad-almacenamiento.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "report": str(output),
        "archivos": len(files),
        "llamadas": len(calls),
        "errores": len(errors),
    }, ensure_ascii=False))
    if errors:
        raise SystemExit("Auditoría de almacenamiento fallida:\n- " + "\n- ".join(errors))


if __name__ == "__main__":
    main()
