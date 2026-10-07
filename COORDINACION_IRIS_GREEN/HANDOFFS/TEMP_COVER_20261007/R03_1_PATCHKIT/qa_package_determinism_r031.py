from pathlib import Path
import tempfile, subprocess, sys, hashlib, json

if len(sys.argv)<3:
    raise SystemExit('uso: python qa_package_determinism_r031.py <dir_R03_1> <package_r031.py>')
root=Path(sys.argv[1]).resolve()
packer=Path(sys.argv[2]).resolve()
if not root.is_dir() or not packer.is_file():
    raise SystemExit('entrada inválida')

with tempfile.TemporaryDirectory(prefix='r031-pack-') as td:
    a=Path(td)/'a.zip'
    b=Path(td)/'b.zip'
    subprocess.run([sys.executable,str(packer),str(root),str(a)],check=True,stdout=subprocess.PIPE,text=True)
    subprocess.run([sys.executable,str(packer),str(root),str(b)],check=True,stdout=subprocess.PIPE,text=True)
    ha=hashlib.sha256(a.read_bytes()).hexdigest()
    hb=hashlib.sha256(b.read_bytes()).hexdigest()
    result={'sha_a':ha,'sha_b':hb,'bytes_equal':a.read_bytes()==b.read_bytes(),'size':a.stat().st_size}
    print(json.dumps(result,indent=2))
    if not result['bytes_equal'] or ha!=hb:
        raise SystemExit('R03.1 PACKAGE NOT DETERMINISTIC')
    print('R03.1 PACKAGE DETERMINISM PASS')
