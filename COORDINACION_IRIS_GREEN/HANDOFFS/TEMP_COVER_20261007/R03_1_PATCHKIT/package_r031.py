from pathlib import Path
import hashlib, zipfile, sys, json
if len(sys.argv)<3: raise SystemExit('uso: python package_r031.py <dir_R03_1> <zip_salida>')
root=Path(sys.argv[1]).resolve(); out=Path(sys.argv[2]).resolve()
manifest=root/'MANIFEST_R03_1_SHA256.txt'
rows=[]
for p in sorted(x for x in root.rglob('*') if x.is_file() and x.name!='MANIFEST_R03_1_SHA256.txt'):
    rows.append(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(root).as_posix()}")
manifest.write_text('\n'.join(rows)+'\n',encoding='ascii')
if out.exists(): out.unlink()
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(x for x in root.rglob('*') if x.is_file()): z.write(p,p.relative_to(root).as_posix())
sha=hashlib.sha256(out.read_bytes()).hexdigest()
side=out.with_suffix(out.suffix+'.sha256.txt');side.write_text(f'{sha}  {out.name}\n',encoding='ascii')
print(json.dumps({'files':len(rows)+1,'sha256':sha,'zip':str(out),'sidecar':str(side)},ensure_ascii=False))
