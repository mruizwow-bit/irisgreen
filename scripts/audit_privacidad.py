#!/usr/bin/env python3
"""Audita afirmaciones técnicas de Privacidad sobre la salida pública.

No intenta certificar cumplimiento jurídico ni sustituye una revisión humana.
Comprueba únicamente hechos que el repositorio puede demostrar de forma
reproducible: ausencia de cargas iniciales de terceros, ausencia de rastreadores
conocidos, tipografías y música locales y uso de YouTube en modo de privacidad
mejorada cuando se declara un embed.
"""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

PRIVACY_PAGES = {
    "es/privacidad/index.html": {
        "analytics": "Iris Green no utiliza cuentas de usuario, publicidad ni herramientas de analítica para seguir lo que haces en la web.",
        "fonts": "Estas tipografías se sirven desde irisgreen.eu. El navegador no necesita conectarse con Google para descargarlas.",
        "music": "La función de música utiliza archivos de audio alojados en irisgreen.eu.",
        "youtube": "Iris Green utiliza el modo de privacidad mejorada de YouTube.",
    },
    "en/privacy/index.html": {
        "analytics": "Iris Green does not use user accounts, advertising or analytics tools to track what you do on the website.",
        "fonts": "These typefaces are served directly from irisgreen.eu. Your browser does not need to connect to Google to download the font files.",
        "music": "The music feature uses audio files hosted on irisgreen.eu.",
        "youtube": "Iris Green uses YouTube&#8217;s Privacy Enhanced Mode.",
    },
}

STALE_PRIVACY = (
    "Actualmente, estas tipografías se cargan desde Google Fonts.",
    "These typefaces are currently loaded from Google Fonts.",
    "<h2>Música de Spotify</h2>",
    "<h2>Spotify music</h2>",
)

TRACKER_PATTERNS = {
    "Google Tag Manager": re.compile(r"googletagmanager\.com|\bgtag\s*\(", re.I),
    "Google Analytics": re.compile(r"google-analytics\.com|analytics\.google\.com", re.I),
    "Meta Pixel": re.compile(r"connect\.facebook\.net|\bfbq\s*\(", re.I),
    "Hotjar": re.compile(r"(?:static|script)\.hotjar\.com", re.I),
    "Microsoft Clarity": re.compile(r"clarity\.ms/(?:tag|collect)", re.I),
    "Plausible": re.compile(r"plausible\.io/(?:js|api/event)", re.I),
    "Segment": re.compile(r"cdn\.segment\.com|api\.segment\.io", re.I),
    "Matomo": re.compile(r"\bmatomo\.js\b|\b_paq\.push\s*\(", re.I),
}

# Estas referencias sí contradicen que las tipografías se sirvan localmente.
# Spotify puede aparecer como enlace editorial saliente (por ejemplo, en Vídeos)
# sin que el reproductor de música del sitio cargue nada desde Spotify.
FORBIDDEN_RUNTIME_DOMAINS = {
    "fonts.googleapis.com",
    "fonts.gstatic.com",
}

LOAD_ATTRS = {
    "script": ("src",),
    "iframe": ("src",),
    "img": ("src", "srcset"),
    "source": ("src", "srcset"),
    "audio": ("src",),
    "video": ("src", "poster"),
    "embed": ("src",),
    "object": ("data",),
}

LOAD_LINK_RELS = {
    "stylesheet", "preload", "modulepreload", "prefetch", "preconnect",
    "dns-prefetch", "icon", "manifest",
}


class ResourceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.absolute_resources: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._collect(tag.lower(), attrs)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._collect(tag.lower(), attrs)

    def _collect(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {k.lower(): (v or "") for k, v in attrs}
        names: tuple[str, ...] = ()
        if tag == "link":
            rels = {part.lower() for part in values.get("rel", "").split()}
            if rels & LOAD_LINK_RELS:
                names = ("href",)
        else:
            names = LOAD_ATTRS.get(tag, ())
        for name in names:
            raw = values.get(name, "")
            if name == "srcset":
                candidates = [part.strip().split()[0] for part in raw.split(",") if part.strip()]
            else:
                candidates = [raw]
            for value in candidates:
                if value.startswith(("http://", "https://")):
                    self.absolute_resources.append((tag, value))


def host(url: str) -> str:
    return (urlparse(url).hostname or "").lower().rstrip(".")


def write_report(root: Path, report: dict) -> Path:
    out = root / "reports/publicacion/privacidad.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        raise SystemExit(f"No existe el directorio público: {root}")

    errors: list[str] = []
    privacy_checks: dict[str, dict[str, bool]] = {}
    for rel, expected in PRIVACY_PAGES.items():
        path = root / rel
        if not path.is_file():
            errors.append(f"Falta la página de privacidad: {rel}")
            continue
        text = path.read_text(encoding="utf-8", errors="strict")
        checks = {name: phrase in text for name, phrase in expected.items()}
        privacy_checks[rel] = checks
        for name, ok in checks.items():
            if not ok:
                errors.append(f"{rel}: no se puede respaldar la afirmación de privacidad {name!r}")
        for stale in STALE_PRIVACY:
            if stale in text:
                errors.append(f"{rel}: conserva una afirmación obsoleta: {stale}")

    html_files = sorted(root.rglob("*.html"))
    third_party_initial: list[dict[str, str]] = []
    for path in html_files:
        parser = ResourceParser()
        text = path.read_text(encoding="utf-8", errors="ignore")
        parser.feed(text)
        rel = path.relative_to(root).as_posix()
        for tag, url in parser.absolute_resources:
            h = host(url)
            if h == "irisgreen.eu" or h.endswith(".irisgreen.eu"):
                continue
            third_party_initial.append({"page": rel, "tag": tag, "url": url})

    # Las páginas afirman que los vídeos no se cargan hasta que la persona pulsa.
    # Una carga remota en el HTML inicial contradice esa afirmación, aunque no sea analítica.
    if third_party_initial:
        sample = ", ".join(f"{x['page']} -> {x['url']}" for x in third_party_initial[:12])
        errors.append("Hay recursos remotos cargados desde el HTML inicial: " + sample)

    tracker_hits: list[dict[str, str]] = []
    forbidden_runtime_hits: list[dict[str, str]] = []
    youtube_standard_embed_hits: list[dict[str, str]] = []
    youtube_nocookie_refs = 0
    text_files = [p for p in root.rglob("*") if p.is_file() and p.suffix.lower() in {".html", ".js", ".css"}]
    for path in sorted(text_files):
        text = path.read_text(encoding="utf-8", errors="ignore")
        rel = path.relative_to(root).as_posix()
        for label, pattern in TRACKER_PATTERNS.items():
            if pattern.search(text):
                tracker_hits.append({"file": rel, "tracker": label})
        for domain in FORBIDDEN_RUNTIME_DOMAINS:
            if domain in text.lower():
                forbidden_runtime_hits.append({"file": rel, "domain": domain})
        standard = re.findall(r"https?://(?:www\.)?youtube\.com/embed/[A-Za-z0-9_-]+", text, re.I)
        for url in standard:
            youtube_standard_embed_hits.append({"file": rel, "url": url})
        youtube_nocookie_refs += len(re.findall(r"https?://www\.youtube-nocookie\.com/embed/[A-Za-z0-9_-]+", text, re.I))

    music_script = root / "assets/musica.js"
    music_check = {
        "exists": music_script.is_file(),
        "local_audio_path": False,
        "absolute_http_urls": [],
    }
    if music_script.is_file():
        music_text = music_script.read_text(encoding="utf-8", errors="strict")
        music_check["local_audio_path"] = "new URL('/audio/'" in music_text
        music_check["absolute_http_urls"] = sorted(set(re.findall(r"https?://[^\s\"'<>]+", music_text, re.I)))
    if not music_check["exists"]:
        errors.append("Falta assets/musica.js en la salida pública")
    elif not music_check["local_audio_path"]:
        errors.append("El reproductor de música no construye sus pistas desde /audio/ en el origen propio")
    if music_check["absolute_http_urls"]:
        errors.append("El reproductor de música contiene URLs HTTP externas: " + ", ".join(music_check["absolute_http_urls"][:12]))

    if tracker_hits:
        errors.append("Se detectaron firmas de analítica/rastreo: " + ", ".join(f"{x['tracker']} en {x['file']}" for x in tracker_hits[:12]))
    if forbidden_runtime_hits:
        errors.append("Siguen presentes referencias de runtime incompatibles con Privacidad: " + ", ".join(f"{x['domain']} en {x['file']}" for x in forbidden_runtime_hits[:12]))
    if youtube_standard_embed_hits:
        errors.append("Hay embeds de YouTube fuera del modo de privacidad mejorada: " + ", ".join(x["file"] for x in youtube_standard_embed_hits[:12]))
    if youtube_nocookie_refs == 0:
        errors.append("No se encontró ninguna referencia youtube-nocookie.com/embed que respalde el modo de privacidad mejorada")

    report = {
        "html_revisados": len(html_files),
        "privacidad_paginas": privacy_checks,
        "recursos_terceros_en_html_inicial": third_party_initial,
        "firmas_analitica_rastreo": tracker_hits,
        "referencias_runtime_prohibidas": forbidden_runtime_hits,
        "reproductor_musica_local": music_check,
        "youtube_embeds_estandar": youtube_standard_embed_hits,
        "youtube_nocookie_embed_referencias": youtube_nocookie_refs,
        "alcance": [
            "Comprueba hechos técnicos observables en dist; no es una auditoría jurídica.",
            "Los enlaces editoriales salientes no cuentan como cargas de terceros hasta que la persona decide abrirlos.",
            "No determina qué hace internamente el navegador con las voces de lectura en voz alta.",
            "No sustituye la revisión de proveedores externos después de una interacción voluntaria.",
        ],
        "errores": errors,
    }
    report_path = write_report(root, report)
    print(json.dumps({"report": str(report_path), "errores": len(errors), "youtube_nocookie": youtube_nocookie_refs}, ensure_ascii=False))
    if errors:
        raise SystemExit("Auditoría de privacidad fallida:\n- " + "\n- ".join(errors))


if __name__ == "__main__":
    main()
