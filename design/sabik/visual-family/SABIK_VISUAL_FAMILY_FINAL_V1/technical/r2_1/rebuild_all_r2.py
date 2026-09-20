#!/usr/bin/env python3
from pathlib import Path
import subprocess, sys
import cairosvg

root=Path(__file__).resolve().parents[1]
if getattr(cairosvg,'__version__',None)!='2.8.2':
    print(f'CAIROSVG_VERSION_FAIL expected=2.8.2 actual={getattr(cairosvg,"__version__",None)}')
    raise SystemExit(1)
print('CAIROSVG_VERSION_PASS 2.8.2', flush=True)

def run(name):
    subprocess.run([sys.executable,str(root/'scripts'/name),'--root',str(root)] if name in ('build_wordmark_r2.py','verify_wordmark_r2.py') else [sys.executable,str(root/'scripts'/name)],check=True)

run('verify_visual_locks.py')
run('build_wordmark_r2.py')
run('verify_wordmark_r2.py')
run('verify_visual_locks.py')
run('build_manifest_r2_1.py')
run('verify_manifest_r2_1.py')
print('REBUILD_ALL_R2_PASS', flush=True)
