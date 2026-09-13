#!/usr/bin/env python3
"""Añade a cada tarjeta de Vídeos un enlace explícito al proveedor original.

El componente ya conserva ``v.href`` y ``v.linkLabel``; esta corrección solo los
hace visibles en la plantilla. No carga recursos externos ni cambia la lógica de
reproducción diferida.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

NEEDLE = '''<div style="font-size: 14px; color: #6b6479; margin-top: 2px;">{{ v.meta }}</div>
 </div>
 <button sc-camel-on-click="{{ v.save }}"'''
REPLACEMENT = '''<div style="font-size: 14px; color: #6b6479; margin-top: 2px;">{{ v.meta }}</div>
 <a class="ig-video-external" href="{{ v.href }}" target="_blank" rel="noopener noreferrer" style="display: inline-block; margin-top: 7px; font-size: 14px; color: #1f5f8b; text-decoration: underline; text-underline-offset: 3px;">{{ v.linkLabel }}</a>
 </div>
 <button sc-camel-on-click="{{ v.save }}"'''


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    path = args.root.resolve() / "es/videos/index.html"
    if not path.is_file():
        raise FileNotFoundError(path)

    text = path.read_text(encoding="utf-8", errors="strict")
    if REPLACEMENT in text:
        changed = False
    else:
        count = text.count(NEEDLE)
        if count != 1:
            raise AssertionError(f"Esperaba 1 punto de inserción en Vídeos y encontré {count}")
        text = text.replace(NEEDLE, REPLACEMENT, 1)
        path.write_text(text, encoding="utf-8")
        changed = True

    final = path.read_text(encoding="utf-8", errors="strict")
    checks = {
        "usa_href_existente": 'href="{{ v.href }}"' in final,
        "usa_etiqueta_existente": "{{ v.linkLabel }}" in final,
        "nueva_clase": 'class="ig-video-external"' in final,
        "nueva_pestana_segura": 'target="_blank" rel="noopener noreferrer"' in final,
    }
    if not all(checks.values()):
        raise AssertionError(checks)

    print(json.dumps({
        "page": "es/videos/index.html",
        "changed": changed,
        "external_fallback_link": True,
        "remote_load_added": False,
        "checks": checks,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
