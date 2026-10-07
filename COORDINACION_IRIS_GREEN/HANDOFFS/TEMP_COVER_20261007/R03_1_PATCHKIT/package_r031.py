from pathlib import Path
import hashlib, zipfile, sys, json

if len(sys.argv)<3:
    raise SystemExit('uso: python package_r031.py <dir_R03_1> <zip_salida>')
root=Path(sys.argv[1]).resolve()
out=Path(sys.argv[2]).resolve()
manifest=root/'MANIFEST_R03_1_SHA256.txt'

rows=[]
for p in sorted(x for x in root.rglob('*') if x.is_file() and x.name!='MANIFEST_R03_1_SHA256.txt'):
    rows.append(f"{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.relative_to(root).as_posix()}")
manifest.write_text('\n'.join(rows)+'\n',encoding='ascii')

if out.exists():
    out.unlink()

# ZIP reproducible: orden fijo, timestamp fijo, permisos fijos y nombres POSIX.
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(x for x in root.rglob('*') if x.is_file()):
        rel=p.relative_to(root).as_posix()
        info=zipfile.ZipInfo(rel,date_time=(1980,1,1,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        info.create_system=3
        info.external_attr=(0o100644 << 16)
        info.flag_bits |= 0x800
        z.writestr(info,p.read_bytes(),compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)

sha=hashlib.sha256(out.read_bytes()).hexdigest()
side=out.with_suffix(out.suffix+'.sha256.txt')
side.write_text(f'{sha}  {out.name}\n',encoding='ascii')

# Verificación interna inmediata: cada entrada debe coincidir con el manifiesto.
expected={}
for line in manifest.read_text(encoding='ascii').splitlines():
    h,rel=line.split('  ',1); expected[rel]=h
with zipfile.ZipFile(out,'r') as z:
    names=z.namelist()
    if names != sorted(names):
        raise SystemExit('ZIP ORDER NOT DETERMINISTIC')
    for rel,h in expected.items():
        if rel not in names:
            raise SystemExit(f'ZIP MISSING {rel}')
        if hashlib.sha256(z.read(rel)).hexdigest()!=h:
            raise SystemExit(f'ZIP HASH MISMATCH {rel}')
    mrel='MANIFEST_R03_1_SHA256.txt'
    if mrel not in names:
        raise SystemExit('ZIP MISSING MANIFEST')

print(json.dumps({'files':len(rows)+1,'sha256':sha,'zip':str(out),'sidecar':str(side),
                  'deterministic_metadata':True,'internal_hash_check':'PASS'},ensure_ascii=False))
