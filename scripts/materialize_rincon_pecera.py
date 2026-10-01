"""Reassemble the original R61 media, verifying every part and final file."""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def materialize():
    source = ROOT / 'tools/rincon-pecera'
    target = ROOT / 'assets/rincon-pecera'
    target.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((source / 'manifest.json').read_text())
    for item in manifest['files']:
        assert Path(item['name']).name == item['name']
        digest = hashlib.sha256()
        size = 0
        with (target / item['name']).open('wb') as out:
            for part in item['parts']:
                assert Path(part['name']).name == part['name']
                raw = (source / part['name']).read_bytes()
                assert hashlib.sha256(raw).hexdigest() == part['sha256']
                out.write(raw)
                digest.update(raw)
                size += len(raw)
        assert size == item['bytes'] and digest.hexdigest() == item['sha256']
    print('Pecera R61: six original media files verified and assembled.')

if __name__ == '__main__':
    materialize()
