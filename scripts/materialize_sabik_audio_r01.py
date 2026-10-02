#!/usr/bin/env python3
"""Materializa los 30 WAV canónicos de Sabik R01 dentro del staging de build."""
from __future__ import annotations
import base64,hashlib,io,json,re,tarfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
AUDIO=ROOT/'sabik/assets/audio-r01'
ARCHIVE=AUDIO/'archive'
PARTS=ARCHIVE/'parts.json'
EXPECTED_ARCHIVE='cc5490c01fead9627200025b069d2b11d964323a4f4a3e776561c59bfb699abb'
PATH_RE=re.compile(r'^(?:es|en)/sabik__[a-z0-9_]+\.wav$')

def sha_bytes(data:bytes)->str:return hashlib.sha256(data).hexdigest()
def sha_file(path:Path)->str:return hashlib.sha256(path.read_bytes()).hexdigest()
def need(v,msg):
    if not v: raise AssertionError(msg)

def materialize():
    meta=json.loads(PARTS.read_text(encoding='utf-8'))
    need(meta.get('schema')=='SABIK_AUDIO_R01_BASE64_ARCHIVE/1.0','schema archive Sabik inválido')
    need(meta.get('archive_sha256')==EXPECTED_ARCHIVE,'SHA archive declarado inválido')
    chunks=[]
    for part in meta.get('parts',[]):
        p=ARCHIVE/part['name']
        raw=p.read_bytes()
        need(len(raw)==part['chars'],f'tamaño chunk incorrecto: {p.name}')
        need(sha_bytes(raw)==part['sha256'],f'SHA chunk incorrecto: {p.name}')
        chunks.append(raw)
    encoded=b''.join(chunks)
    archive=base64.b64decode(encoded,validate=True)
    need(sha_bytes(archive)==EXPECTED_ARCHIVE,'SHA archive reconstruido incorrecto')

    with tarfile.open(fileobj=io.BytesIO(archive),mode='r:xz') as tf:
        members=[m for m in tf.getmembers() if m.isfile()]
        need(len(members)==30,f'archive Sabik debe contener 30 WAV, contiene {len(members)}')
        seen=set()
        for m in members:
            name=m.name.removeprefix('./')
            need(PATH_RE.fullmatch(name) is not None,f'ruta no permitida en archive: {m.name}')
            need(name not in seen,f'duplicado en archive: {name}');seen.add(name)
            src=tf.extractfile(m);need(src is not None,f'no se pudo leer {name}')
            data=src.read()
            out=AUDIO/name
            out.parent.mkdir(parents=True,exist_ok=True)
            out.write_bytes(data)

    manifest=json.loads((AUDIO/'manifest.runtime.json').read_text(encoding='utf-8'))
    entries=manifest.get('entries',[])
    need(len(entries)==30,'manifest runtime no contiene 30 entradas')
    for e in entries:
        p=ROOT/e['file'].lstrip('/')
        need(p.is_file(),f'WAV materializado ausente: {p}')
        need(sha_file(p)==e['audio_sha256'],f'hash WAV incorrecto: {p}')
    print(json.dumps({'status':'PASS','wav':30,'archive_sha256':EXPECTED_ARCHIVE},ensure_ascii=False))

if __name__=='__main__': materialize()
