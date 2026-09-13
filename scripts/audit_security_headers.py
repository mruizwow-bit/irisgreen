#!/usr/bin/env python3
"""Comprueba que las cabeceras globales de seguridad publicadas no se debiliten.

La comprobación lee ``dist/_headers`` (el archivo que Netlify publicará), valida el
bloque global ``/*`` y genera un informe reproducible. No intenta certificar la
seguridad del sitio ni sustituye la auditoría CSP; su función es impedir que
protecciones ya revisadas desaparezcan o se relajen sin una revisión explícita.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


REQUIRED_PERMISSIONS = {"camera", "microphone", "geolocation", "payment"}
REFERRER_POLICIES_NO_WEAKER = {
    "no-referrer",
    "same-origin",
    "strict-origin",
    "strict-origin-when-cross-origin",
}


def parse_headers_file(path: Path) -> dict[str, list[tuple[str, str]]]:
    """Devuelve los bloques de Netlify conservando duplicados para poder detectarlos."""
    blocks: dict[str, list[tuple[str, str]]] = {}
    current: str | None = None
    for lineno, raw in enumerate(path.read_text(encoding="utf-8", errors="strict").splitlines(), 1):
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        if raw[:1].isspace():
            if current is None:
                raise AssertionError(f"Cabecera fuera de un bloque en {path}:{lineno}")
            line = raw.strip()
            if ":" not in line:
                raise AssertionError(f"Cabecera inválida en {path}:{lineno}: {line!r}")
            name, value = line.split(":", 1)
            blocks[current].append((name.strip().lower(), value.strip()))
            continue
        current = raw.strip()
        blocks.setdefault(current, [])
    return blocks


def one_header(rows: list[tuple[str, str]], name: str) -> str:
    values = [value for key, value in rows if key == name]
    if not values:
        raise AssertionError(f"Falta la cabecera global {name}")
    if len(values) != 1:
        raise AssertionError(f"La cabecera global {name} aparece {len(values)} veces")
    return values[0]


def check_hsts(value: str) -> dict[str, object]:
    directives: dict[str, str | bool] = {}
    for chunk in value.split(";"):
        part = chunk.strip()
        if not part:
            continue
        if "=" in part:
            key, raw_value = part.split("=", 1)
            directives[key.strip().lower()] = raw_value.strip()
        else:
            directives[part.lower()] = True
    raw_max_age = directives.get("max-age")
    if raw_max_age is None or not str(raw_max_age).isdigit():
        raise AssertionError(f"HSTS no declara un max-age válido: {value!r}")
    max_age = int(str(raw_max_age))
    if max_age < 31_536_000:
        raise AssertionError(f"HSTS se ha debilitado: max-age={max_age} < 31536000")
    return {
        "max_age": max_age,
        "include_subdomains": "includesubdomains" in directives,
        "preload": "preload" in directives,
    }


def check_permissions_policy(value: str) -> dict[str, str]:
    directives: dict[str, str] = {}
    for chunk in value.split(","):
        part = chunk.strip()
        if not part:
            continue
        if "=" not in part:
            raise AssertionError(f"Permissions-Policy contiene una directiva inválida: {part!r}")
        name, allowlist = part.split("=", 1)
        directives[name.strip().lower()] = re.sub(r"\s+", "", allowlist)
    missing = sorted(REQUIRED_PERMISSIONS - directives.keys())
    if missing:
        raise AssertionError(
            "Permissions-Policy ha perdido restricciones revisadas: " + ", ".join(missing)
        )
    weakened = sorted(name for name in REQUIRED_PERMISSIONS if directives[name] != "()")
    if weakened:
        raise AssertionError(
            "Permissions-Policy permite capacidades que estaban desactivadas: "
            + ", ".join(f"{name}={directives[name]}" for name in weakened)
        )
    return directives


def audit(root: Path) -> dict[str, object]:
    headers_path = root / "_headers"
    if not headers_path.is_file():
        raise AssertionError(f"No existe _headers en la salida pública: {headers_path}")

    blocks = parse_headers_file(headers_path)
    if "/*" not in blocks:
        raise AssertionError("No existe el bloque global /* en _headers")
    rows = blocks["/*"]

    hsts = one_header(rows, "strict-transport-security")
    xcto = one_header(rows, "x-content-type-options")
    referrer = one_header(rows, "referrer-policy")
    xfo = one_header(rows, "x-frame-options")
    permissions = one_header(rows, "permissions-policy")
    coop = one_header(rows, "cross-origin-opener-policy")
    csp = one_header(rows, "content-security-policy")

    hsts_report = check_hsts(hsts)
    if xcto.lower() != "nosniff":
        raise AssertionError(f"X-Content-Type-Options se ha debilitado: {xcto!r}")
    if referrer.lower() not in REFERRER_POLICIES_NO_WEAKER:
        raise AssertionError(
            "Referrer-Policy se ha debilitado respecto a strict-origin-when-cross-origin: "
            + repr(referrer)
        )
    if xfo.upper() not in {"SAMEORIGIN", "DENY"}:
        raise AssertionError(f"X-Frame-Options permite framing no revisado: {xfo!r}")
    permissions_report = check_permissions_policy(permissions)
    if coop.lower() != "same-origin":
        raise AssertionError(f"Cross-Origin-Opener-Policy se ha debilitado: {coop!r}")
    if not csp.strip():
        raise AssertionError("Content-Security-Policy global está vacía")

    all_global: dict[str, list[str]] = {}
    for name, value in rows:
        all_global.setdefault(name, []).append(value)
    if any(value == "*" for value in all_global.get("access-control-allow-origin", [])):
        raise AssertionError("No se permite Access-Control-Allow-Origin: * en el bloque global")
    if any(value.lower() == "true" for value in all_global.get("access-control-allow-credentials", [])):
        raise AssertionError("No se permite Access-Control-Allow-Credentials: true en el bloque global")

    return {
        "archivo": "_headers",
        "bloque": "/*",
        "strict_transport_security": {"valor": hsts, **hsts_report},
        "x_content_type_options": xcto,
        "referrer_policy": referrer,
        "x_frame_options": xfo,
        "permissions_policy": permissions_report,
        "cross_origin_opener_policy": coop,
        "content_security_policy_presente": True,
        "cors_global_abierto": False,
        "limites": (
            "Guardarraíl de no regresión sobre cabeceras ya revisadas. No certifica seguridad, "
            "no comprueba la configuración administrativa de Netlify y delega el contenido "
            "detallado de CSP en audit_csp_dependencies.py."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path("dist"))
    args = parser.parse_args()
    root = args.root.resolve()
    report = audit(root)

    out = root / "reports/publicacion"
    out.mkdir(parents=True, exist_ok=True)
    (out / "security-headers.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(report, ensure_ascii=False))


if __name__ == "__main__":
    main()
