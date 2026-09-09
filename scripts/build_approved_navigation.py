#!/usr/bin/env python3
"""Render only the approved homepage and instructions entry, after the legacy build.

Editable presentation sources: editorial/navigation/*.html and the two navigation
assets. Legacy source pages remain intact for existing build-time transformations.
The article body fingerprints prevent publishing a stale adaptation after a source
edit. No other route, translation, media file or preference store is replaced.
"""
from __future__ import annotations
import argparse
import hashlib
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'editorial/navigation'
ASSETS = ('assets/navigation-approved.css', 'assets/navigation-approved.js')


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def article_fingerprint(text: str) -> str:
    match = re.search(r'<article\b[^>]*>(.*?)</article>', text, flags=re.S)
    if not match:
        raise ValueError('Original article is missing')
    plain = html.unescape(re.sub(r'<[^>]*>', ' ', match[1]))
    return digest(' '.join(plain.split()).encode('utf-8'))


def build(check: bool = False) -> dict:
    manifest = json.loads((SOURCE / 'manifest.json').read_text(encoding='utf-8'))
    for path, expected in manifest['source_articles'].items():
        if article_fingerprint((ROOT/path).read_text(encoding='utf-8')) != expected:
            raise ValueError('Article text changed: ' + path +
                             '. Review the approved adaptation in editorial/navigation before publishing.')
    output = ROOT/'dist'
    if not output.is_dir() or output.is_symlink():
        raise ValueError('Build the regular public dist directory first')
    versions = {p: digest((ROOT/p).read_bytes())[:16] for p in ASSETS}
    rendered = []
    for target, template in manifest['pages'].items():
        path = output/target
        if not path.is_file():
            raise ValueError('Refusing to create an unexpected route: ' + target)
        text = (SOURCE/template).read_text(encoding='utf-8')
        if 'noindex,nofollow,noarchive' in text or 'iris-review-route' in text:
            raise ValueError('A review wrapper must not be published')
        for asset, version in versions.items():
            text = text.replace('"/'+asset+'"', '"/'+asset+'?v='+version+'"')
        version = digest(text.encode('utf-8'))[:16]
        text = text.replace('</head>', '<meta name="ig-navigation-build" content="'+version+'"/></head>', 1)
        raw = (text.rstrip()+'\n').encode('utf-8')
        if check:
            if path.read_bytes() != raw:
                raise ValueError('Approved output is out of date: ' + target)
        else:
            path.write_bytes(raw)
        rendered.append({'path': target, 'template': template, 'sha256': digest(raw), 'bytes': len(raw)})
    report = {'pages':rendered, 'assets':versions, 'original_article_text_preserved':True,
              'scope':'Homepage and one entry in Spanish and English; all other routes unchanged',
              'clinical_review_added':False}
    if not check:
        (ROOT/'reports').mkdir(exist_ok=True)
        (ROOT/'reports/approved-navigation-build.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False))
    return report


if __name__ == '__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--check',action='store_true')
    build(parser.parse_args().check)
