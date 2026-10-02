#!/usr/bin/env python3
from __future__ import annotations
import hashlib,json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
panel=(ROOT/"sabik/iris-panel.html").read_text(encoding="utf-8")
css=(ROOT/"sabik/iris-mount.css").read_text(encoding="utf-8")
js=(ROOT/"sabik/sabik-web-r01.js").read_text(encoding="utf-8")
mount=(ROOT/"sabik/iris-mount.mjs").read_text(encoding="utf-8")

def blob(path:Path)->str:
    data=path.read_bytes()
    return hashlib.sha1(b"blob "+str(len(data)).encode()+b"\0"+data).hexdigest()

assert blob(ROOT/"sabik/assets/web-r01/web_presente.png")=="c18d8f2aae53c281e02baeeac0ccd832acca4ecb"
expected={
 "03_orbits_back.svg":"f9fa4b161d5476800804e82ce50e9fdd0e55e778",
 "04_core_rings.svg":"783963177b5b5a23cd4c6e1b6965598fc2897184",
 "05_core_light.svg":"9aaf39f8c15f572a47e7176d48fb4d4cf24e03ba",
 "06_particles_front.svg":"ddb2ac706b80e7987aac936ad93b777f39bef951",
}
for name,sha in expected.items():
    assert blob(ROOT/"sabik/definitive-r01"/name)==sha,(name,blob(ROOT/"sabik/definitive-r01"/name))

manifest=json.loads((ROOT/"sabik/definitive-r01/layer-manifest.json").read_text(encoding="utf-8"))
assert manifest["canvas"]["transform_origin"]=={"x":530,"y":359}
assert manifest["body_mount"]["target_bbox"]=={"x":176,"y":8,"width":690,"height":642}
assert [x["z"] for x in manifest["layers"]]==[10,20,30,40,50,60]

for marker in (
 'class="layer orbits orbits-back"',
 'class="layer core core-rings"',
 'class="layer core core-light"',
 'class="layer particles particles-front"',
 'data-state="idle"',
 'data-motion="normal"',
 'web_presente.png?v=sabik-definitive-r01',
):
    assert marker in panel,marker

for forbidden in ("sabik-presence-motion","sabikR69SelfMotion","sabikR69SelfMotionReduced"):
    assert forbidden not in panel+css+js,forbidden

for marker in ("sabikDefBreathe","sabikDefOrbit",'data-state="processing"','data-state="speaking"','data-motion="reduced"','data-motion="none"'):
    assert marker in css,marker

for marker in ("setSemanticState","setVoiceActive","semanticState","layers:{orbits","BODY='/sabik/assets/web-r01/web_presente.png?v=sabik-definitive-r01'"):
    assert marker in js.replace(" ",""),marker

assert "meta.inputMode==='voice'" in mount
assert "meta.phase==='retrieval'" in mount
assert "meta.phase==='error'" in mount
assert "semantic='processing'" in mount
assert "semantic='degraded'" in mount

# Voice state is driven by actual playback state from createSabikVoice.
assert "setVoiceActive(playing)" in mount
# No mic/listening is faked for text input.
assert "next==='ORIENTAR'&&meta.inputMode==='voice'" in mount

print("SABIK_DEFINITIVE_LAYERED_STATIC_PASS")
