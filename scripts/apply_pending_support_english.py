#!/usr/bin/env python3
"""Integra el paquete EN aprobado para UK, Brasil, EEUU y resto del mundo.

No traduce ni reescribe contenido: valida los originales exportados y añade solo
cat_en y los seis campos *_en entregados. Las 8 regiones se localizan únicamente
en la interfaz visible, conservando el valor estructural español del filtro.
El paquete aprobado contiene 2.167 fichas y 13.002 campos EN completos.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

ROOT = Path.cwd()
DATA = ROOT / 'es/tramites/directorio/tramites-datos.json'
PAGE = ROOT / 'es/tramites/directorio/index.html'
PATCH_FILE = ROOT / 'scripts/data/ayudas-support-pendientes-en.json'
EXPECTED_PATCH_SHA256 = '86179f5a78789bf6d9a803ccccef861b5c014facadeb2c2e03adc4b08ffc2252'
EXPECTED_SOURCE_SHA256 = '6ff8c493d951df0fe33aae9ed5c03d0606b3eab663d4b6855efdbc46f28395c8'
GROUP_COUNTS = {'uk': 234, 'br': 148, 'us': 362, 'mundo': 1423}
FIELDS = ('que', 'cuantia', 'quien', 'docs', 'obs', 'tags')
PROTECTED_FIELDS = ('id', 'name', 'terr', 'region', 'cat', 'country', 'nivel', 'ambito', 'pais', 'org', 'fuente', 'que', 'cuantia', 'quien', 'docs', 'obs', 'tags')


def load_patch():
    # JSON íntegro recuperado del archivo aprobado; nunca usar fragmentos dañados.
    raw = PATCH_FILE.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != EXPECTED_PATCH_SHA256:
        raise ValueError(f'Pending support translation package changed: {digest}')
    patch = json.loads(raw.decode('utf-8'))
    if patch.get('m', {}).get('counts') != GROUP_COUNTS:
        raise ValueError('Pending support group counts differ from the approved package')
    if patch.get('m', {}).get('fields') != list(FIELDS):
        raise ValueError('Pending support translated fields differ from the approved package')
    if patch.get('m', {}).get('source_sha256') != EXPECTED_SOURCE_SHA256:
        raise ValueError('Approved source fingerprint is inconsistent')
    if patch.get('m', {}).get('protected') != list(PROTECTED_FIELDS):
        raise ValueError('Protected source fields differ from the approved package')
    if set(patch.get('g', {})) != set(GROUP_COUNTS):
        raise ValueError('Pending support groups differ from the approved package')
    for group, expected in GROUP_COUNTS.items():
        items = patch['g'][group]
        if len(items) != expected:
            raise ValueError(f'{group}: translation row count changed')
        seen = set()
        for item in items:
            if not isinstance(item, list) or len(item) != len(FIELDS) + 2:
                raise ValueError(f'{group}: each translation must have an ID, category and six fields')
            if any(not isinstance(v, str) or not v.strip() for v in item):
                raise ValueError(f'{group}: empty or invalid translation value')
            if item[0] in seen:
                raise ValueError(f'{group}: duplicate translation ID: {item[0]}')
            seen.add(item[0])
    return patch


def original_fingerprint(data, protected):
    payload = {
        group: [[row.get(key) for key in protected] for row in data.get(group, [])]
        for group in GROUP_COUNTS
    }
    raw = json.dumps(payload, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
    return hashlib.sha256(raw).hexdigest()


def merge_data(patch):
    data = json.loads(DATA.read_text(encoding='utf-8'))
    protected = patch['m']['protected']
    for group, expected in GROUP_COUNTS.items():
        if len(data.get(group, [])) != expected:
            raise ValueError(f'{group}: expected {expected} records, found {len(data.get(group, []))}')
    digest = original_fingerprint(data, protected)
    if digest != EXPECTED_SOURCE_SHA256:
        raise ValueError(f'Pending support originals changed; expected {EXPECTED_SOURCE_SHA256}, found {digest}')

    translated = 0
    translated_fields = 0
    for group in GROUP_COUNTS:
        rows = data[group]
        additions = patch['g'][group]
        if len(additions) != len(rows):
            raise ValueError(f'{group}: translation row count changed')
        for row, item in zip(rows, additions):
            item_id, cat_en, *values = item
            if row.get('id') != item_id:
                raise ValueError(f'{group}: order/ID mismatch: {row.get("id")} != {item_id}')
            if not cat_en or any(not isinstance(v, str) or not v.strip() for v in values):
                raise ValueError(f'{item_id}: incomplete English translation')
            row['cat_en'] = cat_en
            for key, value in zip(FIELDS, values):
                row[key + '_en'] = value
                translated_fields += 1
            translated += 1

    if translated != 2167 or translated_fields != 13002:
        raise ValueError(f'Unexpected translation totals: {translated} records, {translated_fields} fields')
    if original_fingerprint(data, protected) != EXPECTED_SOURCE_SHA256:
        raise ValueError('A protected original field changed during English integration')
    total = sum(len(v) for v in data.values() if isinstance(v, list))
    if total != 2425:
        raise ValueError(f'Directory record count changed: {total}')
    DATA.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    return translated, translated_fields


def apply_regions(patch):
    text = PAGE.read_text(encoding='utf-8')
    regions = patch['r']
    if len(regions) != 8 or any(not es or not en for es, en in regions.items()):
        raise ValueError('The approved region map must contain 8 complete translations')
    mapping = json.dumps(regions, ensure_ascii=False, separators=(',', ':'))
    old = 'label: r === "all" ? T.allRegions : r,'
    new = 'label: r === "all" ? T.allRegions : (L === "en" ? ((' + mapping + ')[r] || r) : r),'
    if new not in text:
        if text.count(old) != 1:
            raise ValueError(f'Cannot locate region chip renderer; found {text.count(old)} occurrences')
        text = text.replace(old, new, 1)
    PAGE.write_text(text, encoding='utf-8')


def main():
    patch = load_patch()
    records, fields = merge_data(patch)
    apply_regions(patch)
    print(json.dumps({'records_en': records, 'fields_en': fields, 'categories_en': 146, 'regions_en': 8, 'source_originals_preserved': True}, ensure_ascii=False))


if __name__ == '__main__':
    main()
