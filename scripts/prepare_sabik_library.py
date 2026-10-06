"""Reconcile a private library export with the built, age-classified safe catalogue.

Private input and generated corpus must remain outside the public repository.
Only exact ES/EN matches already present in the safe web catalogue are activated.
"""
import argparse
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def prepare(source, output):
    if output.resolve().is_relative_to(ROOT.resolve()):
        raise ValueError('Private corpus output must be outside the public repository')
    safe_bytes = (ROOT / 'dist/assets/safety/search-safe-default.json').read_bytes()
    safe = {r['url_es']: r for r in json.loads(safe_bytes)}
    entities, held, provenance = [], [], []
    for name in ('conditions', 'situations'):
        path = source / (name + '.es-en.json')
        raw = path.read_bytes()
        data = json.loads(raw)
        assert data['schema'] == 'sabik-irisgreen-' + name + '/1.0'
        assert len(data['records']) == data['count']
        provenance.append({'file': path.name, 'sha256': hashlib.sha256(raw).hexdigest()})
        for record in data['records']:
            canonical = safe.get(record['path']['es'])
            reason = 'not_in_safe_catalogue'
            if canonical:
                reason = 'source_differs_from_current_web'
                match = all(record[field][lang] == canonical[key + '_' + lang]
                            for lang in ('es', 'en')
                            for field, key in (('title', 'title'), ('summary', 'summary'), ('path', 'url')))
                bands = canonical.get('age_bands', [])
                if (match and bands and set(bands) <= {'AGE_0_12', 'AGE_13_17', 'AGE_18_PLUS', 'ALL_AGES'}
                        and canonical.get('sensitivity') in ('S0_GENERAL', 'S1_SENSITIVE')
                        and canonical.get('discovery') == 'NORMAL'):
                    for lang in ('es', 'en'):
                        entities.append({'id': record['id'] + '-' + lang, 'locale': lang,
                            'title': record['title'][lang], 'text': record['summary'][lang],
                            'url': 'https://irisgreen.eu' + record['path'][lang],
                            'heading': canonical['area_or_type_' + lang], 'age_bands': bands,
                            'sensitivity': canonical['sensitivity'], 'active': True,
                            'review': 'EXACT_CURRENT_SAFE_WEB_PARITY', 'source_file': path.name})
                    continue
            held.append({'id': record['id'], 'reason': reason})
    assert entities and len({e['id'] for e in entities}) == len(entities)
    corpus = {'schema': 'SABIK_REVIEW_LIBRARY/1', 'source_files': provenance,
        'safe_catalogue_sha256': hashlib.sha256(safe_bytes).hexdigest(),
        'entities': entities, 'held': held}
    raw = (json.dumps(corpus, ensure_ascii=False, sort_keys=True, separators=(',', ':')) + '\n').encode()
    digest = hashlib.sha256(raw).hexdigest()
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes(raw)
    binding = {'schema': 'SABIK_REVIEW_LIBRARY_BINDING/1', 'sha256': digest,
        'key': 'versions/' + digest + '.json', 'version': 'safe-web-' + digest[:16],
        'active_records': len(entities), 'held_records': len(held)}
    (ROOT / 'sabik/library-binding.json').write_text(json.dumps(binding, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(binding))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', required=True, type=Path)
    parser.add_argument('--output', required=True, type=Path)
    args = parser.parse_args()
    prepare(args.source, args.output)
