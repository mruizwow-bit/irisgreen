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

# Contrato observado en la salida pública el 13-09-2026. Incluye preferencias de
# lectura, idioma, vídeos guardados y las URLs temporales de vuelta a catálogos.
# Una clave nueva obliga a revisar su finalidad y el texto público de Privacidad;
# no se amplía este inventario solo para hacer pasar CI.
ALLOWED_STORAGE = {
    "localStorage": {
        "ig-a11y": {"getItem", "setItem", "removeItem"},
        "ig_lang": {"getItem", "setItem", "removeItem"},
        "ig_saved_videos": {"getItem", "setItem", "removeItem"},
    },
    "sessionStorage": {
        "ig-conditions-url": {"getItem", "setItem", "removeItem"},
        "ig-situations-url": {"getItem", "setItem", "removeItem"},
    },
}

CALL_RE = re.compile(
    r"\b(?:window\s*\.\s*)?"
    r"(?P<storage>localStorage|sessionStorage)\s*\.\s*"
    r"(?P<action>getItem|setItem|removeItem)\s*\(\s*"
    r"(?P<arg>[^,\)\n]{1,240})",
    re.I,
)
CONST_RE = re.compile(
    r"\b(?:var|let|const)\s+(?P<name>[A-Za-z_$][\w$]*)\s*=\s*"
    r"(?P<quote>['\"])(?P<value>[^'\"]+)(?P=quote)",
)
STRING_RE = re.compile(r"(?P<quote>['\"])(?P<value>[^'\"]+)(?P=quote)")
IDENT_RE = re.compile(r"^[A-Za-z_$][\w$]*$")
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


def constants_in(text: str) -> dict[str, str]:
    return {m.group("name"): m.group("value") for m in CONST_RE.finditer(text)}


def resolve_keys(argument: str, constants: dict[str, str]) -> list[str]:
    """Resuelve claves literales, constantes simples y ternarios de literales."""
    arg = argument.strip()
    if IDENT_RE.fullmatch(arg) and arg in constants:
        return [constants[arg]]
    direct = STRING_RE.fullmatch(arg)
    if direct:
        return [direct.group("value")]
    # Los catálogos usan una elección ternaria entre dos claves fijas. Aceptamos
    # esa forma solo si el primer argumento contiene exclusivamente literales
    # identificables; cualquier expresión sin literales sigue quedando bloqueada.
    if "?" in arg:
        values = [m.group("value") for m in STRING_RE.finditer(arg)]
        return list(dict.fromkeys(values))
    return []


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        raise SystemExit(f"No existe el directorio público: {root}")

    calls: list[dict[str, object]] = []
    unresolved_calls: list[dict[str, object]] = []
    broad_clear: list[dict[str, object]] = []
    forbidden_apis: list[dict[str, object]] = []
    errors: list[str] = []

    files = public_text_files(root)
    for path in files:
        text = path.read_text(encoding="utf-8", errors="ignore")
        rel = path.relative_to(root).as_posix()
        constants = constants_in(text)

        for match in CALL_RE.finditer(text):
            storage = match.group("storage")
            action = match.group("action")
            argument = match.group("arg").strip()
            keys = resolve_keys(argument, constants)
            line = line_number(text, match.start())
            if not keys:
                item = {
                    "file": rel,
                    "line": line,
                    "storage": storage,
                    "action": action,
                    "argumento": argument[:160],
                }
                unresolved_calls.append(item)
                errors.append(
                    f"{rel}:{line}: llamada a {storage}.{action} con clave no resoluble: {argument[:80]!r}"
                )
                continue

            for key in keys:
                item = {
                    "file": rel,
                    "line": line,
                    "storage": storage,
                    "action": action,
                    "key": key,
                }
                calls.append(item)
                allowed_actions = ALLOWED_STORAGE.get(storage, {}).get(key)
                if not allowed_actions or action not in allowed_actions:
                    errors.append(
                        f"{rel}:{line}: uso no aprobado de {storage}.{action}({key!r})"
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

    observed = {
        storage: sorted({item["key"] for item in calls if item["storage"] == storage})
        for storage in ALLOWED_STORAGE
    }
    report = {
        "archivos_revisados": len(files),
        "contrato": {
            storage: {key: sorted(actions) for key, actions in keys.items()}
            for storage, keys in ALLOWED_STORAGE.items()
        },
        "claves_observadas": observed,
        "llamadas_web_storage": calls,
        "llamadas_no_resueltas": unresolved_calls,
        "borrados_globales": broad_clear,
        "apis_persistentes_no_aprobadas": forbidden_apis,
        "alcance": [
            "Revisa HTML y JavaScript de dist; no certifica cumplimiento jurídico.",
            "Reconoce claves literales, constantes simples y ternarios de literales en Web Storage.",
            "Las claves nuevas requieren revisar expresamente su finalidad y el texto público de Privacidad antes de ampliar el contrato.",
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
