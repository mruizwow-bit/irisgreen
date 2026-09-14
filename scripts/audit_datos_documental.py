#!/usr/bin/env python3
"""Audita estructura y trazabilidad documental de las fichas públicas de Datos.

No verifica que cada cifra coincida con la fuente externa. Comprueba dos capas:
1) la salida pública conserva fuente enlazada, población, año, método, publicación
   y un bloque explícito de límites de interpretación;
2) el catálogo fuente conserva un estado editorial trazable. Un registro que deje
   de ser borrador debe declarar quién lo revisó y cuándo se revisó.

El informe deja además una cola explícita de fichas pendientes de contraste externo,
para que un CI verde no se interprete como validación factual de las cifras.
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
DRAFT_STATUSES = {'borrador', 'draft'}
KNOWN_CATALOG_SOURCE_GAPS = {
    12: 'Discalculia y disgrafía: por qué no damos una cifra mundial única',
}


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


def load_catalog(path: Path) -> dict:
    try:
        data = json.loads(path.read_text(encoding='utf-8', errors='strict'))
    except FileNotFoundError as exc:
        raise AssertionError(f'Datos: no existe el catálogo documental {path}') from exc
    except json.JSONDecodeError as exc:
        raise AssertionError(f'Datos: catálogo JSON inválido {path}: {exc}') from exc
    if not isinstance(data, dict) or not isinstance(data.get('paginas'), list):
        raise AssertionError('Datos: el catálogo debe contener una lista paginas')
    return data


def audit_catalog(path: Path) -> tuple[dict, dict[str, list[str]], Counter[str]]:
    data = load_catalog(path)
    findings: dict[str, list[str]] = {}
    statuses: Counter[str] = Counter()
    pending = []
    reviewed = []
    source_urls = Counter()
    known_source_gaps = []

    for pos, entry in enumerate(data['paginas'], start=1):
        key = f'catalogo.paginas[{pos}]'
        if not isinstance(entry, dict):
            findings[key] = ['registro no es un objeto']
            continue

        number = entry.get('n', pos)
        title = str(entry.get('title', '')).strip()
        label = f'{number} · {title}' if title else str(number)
        problems: list[str] = []
        if not title:
            problems.append('sin title')

        for field in ('poblacion', 'anioDatos', 'metodo', 'publicacion'):
            if not str(entry.get(field, '')).strip():
                problems.append(f'sin {field}')

        evitar = entry.get('evitar')
        if not isinstance(evitar, list) or not evitar:
            problems.append('sin bloque evitar en catálogo')

        status = str(entry.get('status', '')).strip().casefold()
        if not status:
            problems.append('sin status editorial en catálogo')
            status = '(vacío)'
        statuses[status] += 1

        reviewer = str(entry.get('reviewedBy', '')).strip()
        reviewed_at = str(entry.get('reviewed', '')).strip()
        if bool(reviewer) != bool(reviewed_at):
            problems.append('metadatos de revisión incompletos: reviewedBy/reviewed deben ir juntos')
        if status not in DRAFT_STATUSES and (not reviewer or not reviewed_at):
            problems.append('estado no borrador sin reviewedBy y reviewed')

        sources = entry.get('sources')
        valid_sources = []
        if not isinstance(sources, list) or not sources:
            # Baseline documental conocido: esta ficha conserva dos fuentes HTTPS en
            # el HTML publicado, pero el catálogo histórico no las replica todavía.
            # No inventamos ni copiamos contenido editorial durante la auditoría. El
            # hueco queda visible y congelado: cualquier ficha nueva sin sources falla.
            if KNOWN_CATALOG_SOURCE_GAPS.get(number) == title:
                known_source_gaps.append({
                    'n': number,
                    'titulo': title,
                    'motivo': 'El HTML publicado sí enlaza fuentes; el catálogo fuente histórico no las replica.',
                })
            else:
                problems.append('sin sources en catálogo')
        else:
            seen_urls = set()
            for source_pos, source in enumerate(sources, start=1):
                if not isinstance(source, dict):
                    problems.append(f'source {source_pos} no es un objeto')
                    continue
                source_label = str(source.get('label', '')).strip()
                url = str(source.get('url', '')).strip()
                if not source_label:
                    problems.append(f'source {source_pos} sin label')
                if not url.startswith('https://') or not urlsplit(url).netloc:
                    problems.append(f'source {source_pos} sin URL https válida')
                elif url in seen_urls:
                    problems.append(f'source duplicada dentro de la ficha: {url}')
                else:
                    seen_urls.add(url)
                    source_urls[url] += 1
                    valid_sources.append({'texto': source_label, 'url': url, 'dominio': urlsplit(url).netloc.lower()})

        row = {
            'n': number,
            'titulo': title,
            'estado': status,
            'reviewedBy': reviewer,
            'reviewed': reviewed_at,
            'fuentes': valid_sources,
        }
        if status in DRAFT_STATUSES:
            pending.append(row)
        else:
            reviewed.append(row)

        if problems:
            findings[label] = problems

    summary = {
        'registros_catalogo': len(data['paginas']),
        'estados_editoriales': dict(statuses.most_common()),
        'pendientes_contraste_externo': pending,
        'registros_no_borrador': reviewed,
        'huecos_fuentes_catalogo_conocidos': known_source_gaps,
    }
    return summary, findings, source_urls


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=Path('dist'))
    ap.add_argument('--catalogo', type=Path, default=Path('es/datos/datos.json'))
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
    public_source_urls = Counter()
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
                public_source_urls[href] += 1
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

    catalog, catalog_findings, catalog_source_urls = audit_catalog(args.catalogo.resolve())
    global_findings = []
    if catalog['registros_catalogo'] != len(pages):
        global_findings.append(
            f"catálogo y publicación no tienen el mismo número de fichas: "
            f"{catalog['registros_catalogo']} frente a {len(pages)}"
        )

    # Esta comparación es informativa por ahora: detecta deriva entre el catálogo y el
    # HTML publicado sin declarar como error una diferencia histórica hasta revisarla.
    source_drift = {
        'solo_catalogo': sorted((catalog_source_urls - public_source_urls).elements()),
        'solo_publicacion': sorted((public_source_urls - catalog_source_urls).elements()),
    }

    all_findings = dict(findings)
    all_findings.update({f'catalogo: {k}': v for k, v in catalog_findings.items()})
    if global_findings:
        all_findings['catalogo/publicacion'] = global_findings

    report = {
        'fichas_revisadas': len(pages),
        'registros_catalogo': catalog['registros_catalogo'],
        'paginas_con_fallos_documentales': len(all_findings),
        'fallos': sum(len(v) for v in all_findings.values()),
        'detalle': all_findings,
        'dominios_fuente': dict(sources.most_common()),
        'inventario_fuentes': source_rows,
        'estados_editoriales_catalogo': catalog['estados_editoriales'],
        'fichas_pendientes_contraste_externo': catalog['pendientes_contraste_externo'],
        'fichas_no_borrador': catalog['registros_no_borrador'],
        'huecos_fuentes_catalogo_conocidos': catalog['huecos_fuentes_catalogo_conocidos'],
        'deriva_fuentes_catalogo_publicacion': source_drift,
        'limite_de_esta_auditoria': (
            'Comprueba estructura, trazabilidad del estado editorial y enlaces declarados; '
            'no confirma que cada cifra reproduzca fielmente la fuente externa. Las fichas '
            'en borrador permanecen en la cola de contraste externo.'
        ),
    }
    out = root / 'reports/publicacion'
    out.mkdir(parents=True, exist_ok=True)
    (out / 'datos-documental.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({
        'fichas_revisadas': len(pages),
        'registros_catalogo': catalog['registros_catalogo'],
        'paginas_con_fallos_documentales': len(all_findings),
        'fallos': report['fallos'],
        'dominios_fuente': len(sources),
        'pendientes_contraste_externo': len(catalog['pendientes_contraste_externo']),
        'no_borrador': len(catalog['registros_no_borrador']),
        'deriva_fuentes': len(source_drift['solo_catalogo']) + len(source_drift['solo_publicacion']),
        'huecos_fuentes_catalogo_conocidos': len(catalog['huecos_fuentes_catalogo_conocidos']),
    }, ensure_ascii=False))
    if all_findings and not args.informe_solo:
        sample = {k: all_findings[k] for k in list(all_findings)[:15]}
        raise AssertionError('Datos: estructura o trazabilidad documental incompleta: ' + json.dumps(sample, ensure_ascii=False)[:3000])


if __name__ == '__main__':
    main()
