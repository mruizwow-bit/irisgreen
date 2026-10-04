#!/usr/bin/env python3
from __future__ import annotations
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
panel = (ROOT / "sabik/iris-panel.html").read_text(encoding="utf-8")
css = (ROOT / "sabik/iris-mount.css").read_text(encoding="utf-8")
js = (ROOT / "sabik/sabik-web-r01.js").read_text(encoding="utf-8")
motion = (ROOT / "sabik/sabik-motion-r37.js").read_text(encoding="utf-8")
mount = (ROOT / "sabik/iris-mount.mjs").read_text(encoding="utf-8")
publisher = (ROOT / "scripts/apply_iris_brief_r08.py").read_text(encoding="utf-8")

def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)

# The current/new Sabik identity is the five Web R01 masters. Keep them byte-exact.
expected = {
    "web_presente.png": "c18d8f2aae53c281e02baeeac0ccd832acca4ecb",
    "web_orientar.png": "093abfdb63888f76924f0d50e076bc48314d6b21",
    "web_transicion.png": "66209eee4efb61e71e4bedc8251b45cc93df3080",
    "web_pausa.png": "d2b83e4e5ee66832a26f649674de209b11039485",
    "web_confirmar.png": "7b4e1a22fc4ae00387b48cb5d372e7342af5ce6d",
}
for name, expected_blob in expected.items():
    data = (ROOT / "sabik/assets/web-r01" / name).read_bytes()
    blob = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()
    require(blob == expected_blob, f"Sabik current master changed: {name} -> {blob}")

require('id="sabik-web-master"' in panel and '/sabik/assets/web-r01/web_presente.png?v=sabik-definitive-r01' in panel,
        "Current Sabik PRESENTE master is not mounted with definitive cache-safe version")
for required_layer in (
    '/sabik/definitive-r01/03_orbits_back.svg',
    '/sabik/definitive-r01/04_core_rings.svg',
    '/sabik/definitive-r01/05_core_light.svg',
    '/sabik/definitive-r01/06_particles_front.svg',
):
    require(required_layer in panel, f"Definitive Sabik layer missing: {required_layer}")
for forbidden in ("sabik-base-640.webp","sabik-orbits-back.svg","sabik-orbits-front.svg","sabik-orbit-layer","sabik-layered-avatar","sabikR69OrbitBack","sabikR69OrbitFront"):
    require(forbidden not in panel + css + js, f"Legacy Sabik donor leaked back in: {forbidden}")
for required in ("sabik-current-presence","sabik-presence-motion","sabikR69SelfMotion","sabikR69SelfMotionReduced","dataset.renderActive"):
    require(required in css + js, f"Current Sabik self-motion marker missing: {required}")
require(not (ROOT / "sabik/assets/sabik-base-640.webp").exists(),
        "Old donor WebP must not remain in the correction branch")

# R37 is the motion system that must be preserved.
for marker in ("SabikMotionR37", "TOKENS", "iterations: 1", "duration: 0"):
    require(marker in motion + js, f"Missing R37 marker: {marker}")
for marker in ("controller.setSabikState('presente'", "force:true", "static:true", "newImage()", "/sabik/assets/web-r01/web_", "ASSET_VERSION","sabik-presence-motion"):
    require(marker in js.replace(" ", ""), f"Missing current-master runtime marker: {marker}")
require("requestAnimationFrame" not in motion + js, "R37 must not become continuous RAF motion")
require("setInterval" not in motion + js, "R37 must not become loop motion")
require("sabikMeasuredPrecession" not in css, "Historical donor keyframe name returned")
require("sabikPresenceWave" not in css, "Historical donor presence keyframe name returned")
require("sabikVoiceRipple" not in css, "Historical donor voice keyframe name returned")
require("'.webp'" not in publisher, "R08 publisher still carries the old donor WebP")

# Voice integration may signal activity, but it must not replace the current visual identity.
require("setVoiceActive" in js, "A2 voice compatibility hook is missing")
require("dataset.voiceActive" in js, "Voice hook must stay presentation-neutral")
require("setVoiceActive(playing)" in mount, "A2 voice runtime is no longer wired to the presentation hook")

# B3 transitions remain finite, while the measured orbit layers provide living presence.
require("Movimiento suave y continuo." in panel + mount,
        "ES continuous-motion copy missing")
require("Gentle continuous motion." in mount,
        "EN continuous-motion copy missing")

print("R52_A3_NEW_SABIK_SELF_MOTION_STATIC_PASS")
