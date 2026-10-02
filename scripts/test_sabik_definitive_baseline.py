#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]

EXPECTED_BLOBS={
 "sabik/assets/web-r01/web_presente.png":"c18d8f2aae53c281e02baeeac0ccd832acca4ecb",
 "sabik/definitive-r01/README_CODEX.md":"c83719e6a137e17dbbdce0cd0d4bc7fe56314138",
 "sabik/definitive-r01/layer-manifest.json":"8c248f1a67cb3dac892cf61339498b83ea8d48f5",
 "sabik/definitive-r01/03_orbits_back.svg":"f9fa4b161d5476800804e82ce50e9fdd0e55e778",
 "sabik/definitive-r01/04_core_rings.svg":"783963177b5b5a23cd4c6e1b6965598fc2897184",
 "sabik/definitive-r01/05_core_light.svg":"9aaf39f8c15f572a47e7176d48fb4d4cf24e03ba",
 "sabik/definitive-r01/06_particles_front.svg":"ddb2ac706b80e7987aac936ad93b777f39bef951",
 "sabik/definitive-r01/sabik-layered.css":"c33816cec58990b3a256424b1205624e5cf16810",
 "sabik/definitive-r01/sabik-layered.js":"cc293d2b5ddf7920ef8a6c0cb3ab4ee7a5897f4e",
}

def git_blob(path: Path) -> str:
    data=path.read_bytes()
    return hashlib.sha1(b"blob "+str(len(data)).encode("ascii")+b"\0"+data).hexdigest()

for rel,expected in EXPECTED_BLOBS.items():
    path=ROOT/rel
    assert path.is_file(), f"missing definitive Sabik file: {rel}"
    actual=git_blob(path)
    assert actual==expected, f"{rel}: expected {expected}, got {actual}"

manifest=json.loads((ROOT/"sabik/definitive-r01/layer-manifest.json").read_text(encoding="utf-8"))
assert manifest["canvas"]=={
    "width":1065,"height":760,"origin":"top-left",
    "transform_origin":{"x":530,"y":359},
}
assert manifest["body_mount"]["file"]=="../assets/web-r01/web_presente.png"
assert manifest["body_mount"]["source_sha"]=="c18d8f2aae53c281e02baeeac0ccd832acca4ecb"
assert manifest["body_mount"]["target_bbox"]=={"x":176,"y":8,"width":690,"height":642}
assert set(manifest["states"])=={"idle","listening","processing","speaking","degraded"}
assert [x["z"] for x in manifest["layers"]]==[10,20,30,40,50,60]

mount=(ROOT/"sabik/iris-mount.mjs").read_text(encoding="utf-8")
web=(ROOT/"sabik/sabik-web-r01.js").read_text(encoding="utf-8")
motion=(ROOT/"sabik/sabik-motion-r37.js").read_text(encoding="utf-8")
audio=(ROOT/"sabik/audio-r01.mjs").read_text(encoding="utf-8")
panel=(ROOT/"sabik/iris-panel.html").read_text(encoding="utf-8")

for marker in ("NORMAL","REDUCIDO","SIN_MOVIMIENTO"):
    assert marker in panel+mount+web+motion, f"motion mode lost: {marker}"
for marker in ("setVoiceActive","createSabikVoice","createSabikConversation"):
    assert marker in mount+web+audio, f"Sabik runtime hook lost: {marker}"
assert "web_presente.png" in panel
assert "MOTION = SYSTEM_STATE_COMMUNICATION, NOT DECORATION" in (ROOT/"sabik/definitive-r01/README_CODEX.md").read_text(encoding="utf-8")

print("SABIK_DEFINITIVE_P0A_BASELINE_PASS")
