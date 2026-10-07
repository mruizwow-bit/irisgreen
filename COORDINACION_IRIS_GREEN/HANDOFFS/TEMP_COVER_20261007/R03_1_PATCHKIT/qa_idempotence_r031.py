from pathlib import Path
import tempfile, shutil, hashlib, subprocess, sys, json

if len(sys.argv)<3:
    raise SystemExit('uso: python qa_idempotence_r031.py <dir_R03> <apply_r031_v2.py>')
src=Path(sys.argv[1]).resolve()
patch=Path(sys.argv[2]).resolve()
if not src.is_dir() or not patch.is_file(): raise SystemExit('entrada inválida')

def hashes(root):
    out={}
    for p in sorted(x for x in root.rglob('*') if x.is_file()):
        rel=p.relative_to(root).as_posix()
        # artefactos que deliberadamente pueden ser temporales no participan
        if '__pycache__/' in rel or rel.endswith('.pyc'): continue
        out[rel]=hashlib.sha256(p.read_bytes()).hexdigest()
    return out

with tempfile.TemporaryDirectory(prefix='r031-idem-') as td:
    work=Path(td)/'R03'
    shutil.copytree(src,work)
    subprocess.run([sys.executable,str(patch),str(work)],check=True)
    first=hashes(work)
    subprocess.run([sys.executable,str(patch),str(work)],check=True)
    second=hashes(work)
    added=sorted(set(second)-set(first)); removed=sorted(set(first)-set(second))
    changed=sorted(k for k in set(first)&set(second) if first[k]!=second[k])
    result={'added':added,'removed':removed,'changed':changed,'first_files':len(first),'second_files':len(second)}
    print(json.dumps(result,ensure_ascii=False,indent=2))
    if added or removed or changed:
        raise SystemExit('R03.1 PATCH NOT IDEMPOTENT')
    gen=work/'procedencia'/'gen_datos3d.py'
    if gen.exists():
        subprocess.run([sys.executable,str(gen),'--verificar'],check=True)
    print('R03.1 IDEMPOTENCE PASS')
