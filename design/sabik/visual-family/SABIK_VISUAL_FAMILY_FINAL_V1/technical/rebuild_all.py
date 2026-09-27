#!/usr/bin/env python3
from pathlib import Path
import subprocess,sys
root=Path(__file__).resolve().parents[1]
for s in ('clean_masters.py','build_assets.py','build_proofs.py'):
    subprocess.run([sys.executable,str(root/'scripts'/s),'--root',str(root)],check=True)
subprocess.run([sys.executable,str(root/'scripts'/'verify_reproducibility.py')],check=True)
subprocess.run([sys.executable,str(root/'scripts'/'build_manifest.py')],check=True)
print('REBUILD_ALL_PASS')
