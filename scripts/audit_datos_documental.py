#!/usr/bin/env python3
"""Audita la estructura documental de las fichas públicas de Datos.

No verifica que cada cifra coincida con la fuente externa. Comprueba que cada ficha
publicada declara lo necesario para poder verificarla: fuente enlazada, población,
año, método, publicación y un bloque explícito de límites de interpretación.
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from html import unescape
from pathlib import Path
from urllib.parse import urlsplit

TAG = re.compile(r'<[^>]+>')
H1 = re.compile(r'<h1\b[^>]*>(.*?)</h1>', re.I | re.S)
SECTION = re.compile(r'<section\b[^>]*>(.*?)</section>', re.I | re.S)
H2 = re.compile(r'<h2\b[^>]*>(.*?)</h2>', re.I | re.S)
LINK = re.compile(r'<a\b[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', re.I | re.S)
TECH_LABEL = re.compile(r'<strong>([^<]+):</strong>\s*(.*?)</li>', re.I | re.S)


def plain(fragment: str) -> str:
    return ' '.join(unescape(TAG.sub(' ', fragment)).split())


def section_map(text: str) -> dict[str, str]:
    out: dict[str, str] = {}
    for body in SECTION.findall(text):
        m = H2.search(body)
        if m:
            out[plain(m.group(1)).casefold()] = body
    return out


def section_content(body: str) -> str:
    """Devuelve el texto de una sección sin contar su propio encabezado."""
    return plain(H2.sub(' ', body, count=1))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    ap.add_argument('--informe-solo', action='store_true')
    args = ap.parse_args()
    root = args.root.resolve()

    base = root / 'es/datos'
    pages = []
    for path in sorted(base.glob('*/index.html')):
        text = path.read_text(encoding='utf-8', errors='strict')
        if '<article class="ficha"' in text or "<article class='ficha'" in text:
            pages.append(path)

    findings: dict[str, list[str]] = {}
    sources = Counter()
    source_rows = []
    for path in pages:
        rel = path.relative_to(root).as_posix()
        text = path.read_text(encoding='utf-8', errors='strict')
        problems: list[str] = []
        title = H1.search(text)
        if not title or not plain(title.group(1)):
            problems.append('falta h1')

        sections = section_map(text)
        for required in ('qué mide', 'qué evitar', 'fuentes', 'ficha técnica'):
            if required not in sections:
                problems.append(f'falta sección: {required}')

        # «Qué evitar» es el bloque editorial reservado a límites de interpretación.
        # Comprobamos que exista contenido real, sin intentar adivinarlo por palabras
        # clave: expresiones válidas como «separarla del contexto cambia su significado»
        # no deben convertirse en falsos positivos del auditor.
        avoid_body = sections.get('qué evitar', '')
        if avoid_body and not section_content(avoid_body):
            problems.append('sección Qué evitar vacía')

        source_links = []
        source_body = sections.get('fuentes', '')
        for href, label in LINK.findall(source_body):
            if href.startswith('https://'):
                host = urlsplit(href).netloc.lower()
                source_links.append((href, plain(label), host))
                sources[host] += 1
        if not source_links:
            problems.append('sin fuente https enlazada')
        else:
            source_rows.append({
                'pagina': rel,
                'titulo': plain(title.group(1)) if title else '',
                'fuentes': [{'url': u, 'texto': label, 'dominio': host} for u, label, host in source_links],
            })

        tech = sections.get('ficha técnica', '')
        labels = {plain(k).casefold(): plain(v) for k, v in TECH_LABEL.findall(tech)}
        expected_labels = ('población medida', 'año de los datos', 'método', 'publicación')
        for label in expected_labels:
            if not labels.get(label):
                problems.append(f'ficha técnica sin {label}')

        if problems:
            findings[rel] = problems

    report = {
        'fichas_revisadas': len(pages),
        'paginas_con_fallos_documentales': len(findings),
        'fallos': sum(len(v) for v in findings.values()),
        'detalle': findings,
        'dominios_fuente': dict(sources.most_common()),
        'inventario_fuentes': source_rows,
        'limite_de_esta_auditoria': 'Comprueba estructura documental y enlaces declarados; no confirma todavía que cada cifra reproduzca fielmente la fuente externa.',
    }
    out = root / 'reports/publicacion'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'datos-documental.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({
        'fichas_revisadas': len(pages),
        'paginas_con_fallos_documentales': len(findings),
        'fallos': report['fallos'],
        'dominios_fuente': len(sources),
    }, ensure_ascii=False))
    if findings and not args.informe_solo:
        sample = {k: findings[k] for k in list(findings)[:15]}
        raise AssertionError('Datos: estructura documental incompleta: ' + json.dumps(sample, ensure_ascii=False)[:3000])


if __name__ == '__main__':
    main()
