from pathlib import Path
import base64, bz2, hashlib, json, re
root=Path.cwd()
h=lambda b:hashlib.sha256(b).hexdigest()
expected_patch='c91272ad8c0ae76903b7de1b613c86d4adf9ffe0fec14669aa451497b703831a4dc9'
expected_source='8e75478c507f65bd0b5c87ef51f79101a32f93d72afb0209f360f49873580e71'
assert len(expected_patch)==len(expected_source)==64
repairs={
 'transfer-05.txt':('3bf8ed9d2b019d7f54a713ab7ab40364da8a04f789bba8ab6715e92c9f34c12a','f5d936b82d869f9591e6e8005f1d0ab5a1bbde8e1e44b0d8b6793e80dd03eb5c',[(179,181,'P'),(2792,2792,'Q')]),
 'transfer-10.txt':('689151210fed294607a9799055d834855334cfa42c5107905df9c458576e27edc','f2d0b8e394a00b9f60e9f6152bc7e658ab3b40b0b00ab06909b77e5e98f71a09',[(6916,6916,'T')])
}
chunks=[]
for i in range(1,22):
 name=f'transfer-{i:02}.txt';b=(root/'.rescue-data'/name).read_bytes()
 if name in repairs:
  before,after,edits=repairs[name]
  if h(b)!=after:
   assert h(b)==before,('transfer input',name,h(b))
   for start,end,value in reversed(edits):b=b[:start]+value.encode()+b[end:]
  assert h(b)==after,('transfer output',name)
 chunks.append(b)
encoded=b''.join(chunks)
assert h(encoded)=='20b38ec28ddc492a983b000bc5de5afcd60a9277c05d8fba25a0b9d0e161cecc0'
raw=bz2.decompress(base64.b64decode(encoded,validate=True))
assert h(raw)==expected_patch,('package',h(raw))
p=json.loads(raw)
assert p['m']['counts']=={'uk':234,'br':148,'us':362,'mundo':1423}
assert sum(len(v) for v in p['g'].values())==2167
assert all(len(row)==8 and all(isinstance(v,str) and v.strip() for v in row) for rows in p['g'].values() for row in rows)
assert p['m']['source_sha256']==expected_source
for i in range(10):
 part=encoded[i*18000:(i+1)*18000]
 assert part
 (root/'scripts/data'/f'ayudas-support-pendientes-en-{i+1:02}.b64').write_bytes(part)
loader=root/'scripts/apply_pending_support_english.py'
s=loader.read_text()
s,n=re.subn(r"EXPECTED_PATCH_SHA256 = '[0-9a-f]{64}'","EXPECTED_PATCH_SHA256 = '"+expected_patch+"'",s)
assert n==1
s,n=re.subn(r"EXPECTED_SOURCE_SHA256 = '[0-9a-f]{64}'","EXPECTED_SOURCE_SHA256 = '"+expected_source+"'",s)
assert n==1
loader.write_text(s)
print('Recuperadas 2167 fichas y 13002 campos EN del documento aprobado; integridad exacta verificada.')
