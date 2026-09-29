#!/usr/bin/env python3
"""Fail closed unless the exact Sabik Audio R01 public assets are present."""
from pathlib import Path
import hashlib,json,struct,sys

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'dist' if (ROOT/'dist/sabik/assets/audio-r01/manifest.runtime.json').is_file() else ROOT
MANIFEST=PUBLIC/'sabik/assets/audio-r01/manifest.runtime.json'
EXPECTED_SOURCE='96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c'

def sha256(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()

def check_wav(path):
    data=path.read_bytes()
    if len(data)<44 or data[:4]!=b'RIFF' or data[8:12]!=b'WAVE':
        raise AssertionError(f'WAV inválido: {path}')
    declared=struct.unpack('<I',data[4:8])[0]+8
    if declared!=len(data):
        raise AssertionError(f'RIFF truncado/sobrante: {path}')

def main():
    raw=json.loads(MANIFEST.read_text(encoding='utf-8'))
    assert raw.get('version')=='SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED'
    assert raw.get('source_zip_sha256')==EXPECTED_SOURCE
    entries=raw.get('entries')
    assert isinstance(entries,list) and len(entries)==30
    ids={(e['id'],e['language']) for e in entries}
    assert len(ids)==30 and {e['language'] for e in entries}=={'es','en'}
    assert len({e['id'] for e in entries})==15
    missing=[];bad=[]
    for e in entries:
        rel=e['file'].lstrip('/')
        path=PUBLIC/rel
        if not path.is_file():
            missing.append(rel);continue
        check_wav(path)
        actual=sha256(path)
        if actual!=e['audio_sha256']: bad.append((rel,e['audio_sha256'],actual))
    if missing or bad:
        print(json.dumps({'status':'FAIL','expected':30,'missing':missing,'hash_mismatch':bad},ensure_ascii=False,indent=2))
        raise SystemExit(1)
    print(json.dumps({'status':'PASS','wav':30,'languages':{'es':15,'en':15},'source_zip_sha256':EXPECTED_SOURCE},ensure_ascii=False))

if __name__=='__main__': main()
