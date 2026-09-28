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

require('<img id="sabik-web-master" src="/sabik/assets/web-r01/web_presente.png"' in panel,
        "Current Sabik PRESENTE master is not mounted")
for forbidden in (
    "sabik-layered-avatar", 'class="sabik-back"', 'class="sabik-front"',
    "sabik-base-640.webp", "rings-back", "rings-front"
):
    require(forbidden not in panel + css + js, f"Old Sabik donor leaked back in: {forbidden}")
require(not (ROOT / "sabik/assets/sabik-base-640.webp").exists(),
        "Old donor WebP must not remain in the correction branch")

# R37 is the motion system that must be preserved.
for marker in (
    "SabikMotionR37", "TOKENS", "iterations: 1", "duration: 0",
    "controller.setSabikState('presente', {force: true, static: true})",
    "new Image()", "web_' + state + '.png"
):
    require(marker in motion + js, f"Missing R37/current-master marker: {marker}")
require("requestAnimationFrame" not in motion + js, "R37 must not become continuous RAF motion")
require("setInterval" not in motion + js, "R37 must not become loop motion")
require("sabikMeasuredPrecession" not in css, "Old donor orbit motion returned")
require("sabikPresenceWave" not in css, "Old donor presence wave returned")
require("sabikVoiceRipple" not in css, "Old donor voice ripple returned")
require("'.webp'" not in publisher, "R08 publisher still carries the old donor WebP")

# Voice integration may signal activity, but it must not replace the current visual identity.
require("setVoiceActive" in js, "A2 voice compatibility hook is missing")
require("dataset.voiceActive" in js, "Voice hook must stay presentation-neutral")
require("setVoiceActive(playing)" in mount, "A2 voice runtime is no longer wired to the presentation hook")

# R37 copy/semantics remain finite, state-change motion.
require("Movimiento breve cuando cambia el estado." in panel + mount,
        "Approved ES R37 motion copy changed")
require("Brief motion when the state changes." in mount,
        "Approved EN R37 motion copy changed")

print("R52_A3_NEW_SABIK_R37_STATIC_PASS")
