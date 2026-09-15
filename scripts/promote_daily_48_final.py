#!/usr/bin/env python3
from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
changed=0
for p in sorted((ROOT/'es'/'biblioteca').glob('*/index.html')):
    s=p.read_text(encoding='utf-8')
    if '<span class="chip lil">BORRADOR</span>' not in s:
        continue
    s=s.replace('<span class="chip lil">BORRADOR</span>','')
    s=re.sub(r'<p class="notice">Página en borrador\. Las fuentes están nombradas y enlazadas; la comprobación final sigue pendiente\.</p>','',s)
    s=s.replace('<li><strong>Estado:</strong> borrador</li>','<li><strong>Estado:</strong> publicada</li><li><strong>Validación:</strong> 10 de septiembre de 2026</li>')
    p.write_text(s,encoding='utf-8')
    changed+=1
if changed!=48:
    raise SystemExit(f'Se esperaban 48 fichas promovidas y fueron {changed}')
print('promoted',changed)
