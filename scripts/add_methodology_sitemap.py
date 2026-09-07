#!/usr/bin/env python3
from pathlib import Path

url = 'https://irisgreen.eu/en/methodology/'
after = '''  <url>\n    <loc>https://irisgreen.eu/en/interests/</loc>\n  </url>'''
block = '''  <url>\n    <loc>https://irisgreen.eu/en/methodology/</loc>\n  </url>'''

for name in ('sitemap.xml', 'sitemap-1.xml'):
    p = Path(name)
    text = p.read_text(encoding='utf-8')
    if url not in text:
        if after not in text:
            raise SystemExit(f'{name}: no encuentro el punto de inserción esperado.')
        text = text.replace(after, after + '\n' + block, 1)
        p.write_text(text, encoding='utf-8')
    count = p.read_text(encoding='utf-8').count(url)
    if count != 1:
        raise SystemExit(f'{name}: Methodology EN aparece {count} veces; debe aparecer exactamente una.')
    print(f'{name}: Methodology EN presente una vez.')
