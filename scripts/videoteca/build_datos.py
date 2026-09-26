#!/usr/bin/env python3
"""Genera assets/videoteca/videoteca-datos.js desde la lista editorial.

La página /es/videos/ ya no lleva los vídeos escritos dentro. Los lee de este fichero,
con la misma forma de objeto que tenía antes, así que la página no cambia en nada.

Para publicar o retirar un vídeo se edita editorial/videoteca/publicados.es.json y se
vuelve a ejecutar este script. Nada más.

El script se niega a escribir una lista vacía o mucho más corta que la anterior: ese
fue el error que dejó la página sin vídeos, y no debe poder repetirse por descuido.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[2]
FUENTE = RAIZ / "editorial/videoteca/publicados.es.json"
SALIDA = RAIZ / "assets/videoteca/videoteca-datos.js"

CAMPOS = ["id", "name", "tema", "source", "embed", "href", "tipo", "nota", "name_en", "nota_en"]
OBLIGATORIOS = ["id", "name", "tema", "source", "embed", "href"]
FUENTES_VALIDAS = {"YouTube", "Vimeo", "Instagram"}
# Solo dominios que ya usaba la página. Nada nuevo entra sin decidirlo.
DOMINIOS = ("https://www.youtube-nocookie.com/", "https://player.vimeo.com/",
            "https://www.instagram.com/")

CABECERA = """/* Generado por scripts/videoteca/build_datos.py · no editar a mano.
   Fuente: editorial/videoteca/publicados.es.json
   Estos son los vídeos publicados. La página los lee de aquí y no cambia por ello. */
"""


def comprobar(videos: list[dict]) -> list[str]:
    problemas: list[str] = []
    vistos: set[str] = set()
    ids: set[str] = set()
    for i, v in enumerate(videos):
        donde = f"[{i}] {v.get('name', '(sin nombre)')[:60]}"
        for c in OBLIGATORIOS:
            if not v.get(c):
                problemas.append(f"{donde}: falta {c}")
        if not v.get("name_en"):
            problemas.append(f"{donde}: falta el nombre en inglés (la web es bilingüe)")
        if v.get("nota") and not v.get("nota_en"):
            problemas.append(f"{donde}: tiene nota en español pero no en inglés")
        if v.get("source") and v["source"] not in FUENTES_VALIDAS:
            problemas.append(f"{donde}: fuente desconocida {v['source']!r}")
        if v.get("id") in ids:
            problemas.append(f"{donde}: identificador repetido")
        ids.add(v.get("id"))
        emb = v.get("embed", "")
        if emb and not emb.startswith(DOMINIOS):
            problemas.append(f"{donde}: el reproductor no es de un dominio previsto: {emb[:60]}")
        if emb in vistos:
            problemas.append(f"{donde}: reproductor repetido")
        vistos.add(emb)
    return problemas


def anterior(ruta: Path) -> int:
    """Cuántos vídeos tenía el fichero que ya estaba, para no reducir sin querer."""
    if not ruta.exists():
        return 0
    m = re.search(r'"total":(\d+)', ruta.read_text(encoding="utf-8"))
    return int(m.group(1)) if m else 0


def main() -> int:
    forzar = "--forzar" in sys.argv
    datos = json.loads(FUENTE.read_text(encoding="utf-8"))
    videos = [{c: v[c] for c in CAMPOS if c in v and v[c] not in (None, "")}
              for v in datos["videos"]]

    temas_usados = {v["tema"] for v in videos if v.get("tema")}
    etiquetas = datos.get("temas", {})
    sin_en = sorted(t for t in temas_usados if t not in (etiquetas.get("en") or {}))
    problemas = comprobar(videos)
    primero = datos.get("orden_editorial", {}).get("primero_id")
    if primero and (not videos or videos[0].get("id") != primero):
        problemas.append("Debe mantenerse Dan Wilkins primero, según el orden editorial acordado.")
    if sin_en:
        problemas.append("temas sin etiqueta en inglés: " + ", ".join(sin_en))
    if problemas:
        print("No se escribe nada. Problemas en la lista editorial:", file=sys.stderr)
        for p in problemas:
            print(" -", p, file=sys.stderr)
        return 1

    antes = anterior(SALIDA)
    if not videos:
        print("No se escribe nada: la lista está vacía y la página se quedaría sin vídeos.",
              file=sys.stderr)
        return 1
    if antes and len(videos) < antes * 0.9 and not forzar:
        print(f"No se escribe nada: pasarías de {antes} vídeos a {len(videos)}. "
              f"Si la retirada es intencionada, vuelve a ejecutarlo con --forzar.", file=sys.stderr)
        return 1

    payload = {"version": 1, "total": len(videos), "videos": videos,
               "temas": datos.get("temas", {"es": {}, "en": {}})}
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    SALIDA.write_text(
        CABECERA + "window.IG_VIDEOTECA = "
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8")
    print(f"{SALIDA.relative_to(RAIZ)} · {len(videos)} vídeos · "
          f"{SALIDA.stat().st_size / 1024:.1f} KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
