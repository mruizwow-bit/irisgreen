#!/usr/bin/env python3
from __future__ import annotations
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
panel = (ROOT / "sabik/iris-panel.html").read_text(encoding="utf-8")
css = (ROOT / "sabik/iris-mount.css").read_text(encoding="utf-8")
js = (ROOT / "sabik/sabik-web-r01.js").read_text(encoding="utf-8")
mount = (ROOT / "sabik/iris-mount.mjs").read_text(encoding="utf-8")
publisher = (ROOT / "scripts/apply_iris_brief_r08.py").read_text(encoding="utf-8")
asset = ROOT / "sabik/assets/sabik-base-640.webp"

def require(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)

require(asset.exists(), "R52 donor base asset is missing")
data = asset.read_bytes()
git_blob = hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()
require(git_blob == "003a7642840d060a4c53ce6f2776c59ff6e672e7",
        f"R52 donor base asset changed: {git_blob}")

for marker in (
    'sabik-layered-avatar', 'class="sabik-back"', 'class="sabik-avatar-base"',
    'class="sabik-front"', '/sabik/assets/sabik-base-640.webp',
):
    require(marker in panel, f"Missing layered visual marker: {marker}")
require('<img id="sabik-web-master"' in panel, "Compatibility image id is missing")
require(panel.count('<svg class="sabik-back"') == 1, "Back visual layer count changed")
require(panel.count('<svg class="sabik-front"') == 1, "Front visual layer count changed")
require('data-cognitive-state' not in panel, "Obsolete cognitive-state semantic returned")

for obsolete in ("Hiperfoco", "Sobrecarga", "Vinculo", "Vínculo", "VozInterior", "Creatividad"):
    require(obsolete not in panel + css + js, f"Obsolete cognitive inference returned: {obsolete}")

for animation in (
    "sabikMeasuredPrecession", "sabikAvatarBreath", "sabikVoiceRipple",
    "sabikPresenceWave", "sabikOrbitClock", "sabikImageBreath",
):
    require(f"@keyframes {animation}" in css, f"Missing donor animation: {animation}")
require("sabikCoreBreath" in css, "Donor historical sabikCoreBreath discrepancy must remain documented")
require("@keyframes sabikCoreBreath" not in css, "R52 must not invent missing donor sabikCoreBreath keyframes")

compact = css.replace(" ", "")
for selector in (
    'data-motion-level="REDUCIDO"', 'data-motion-level="SIN_MOVIMIENTO"',
    'data-render-active="false"', 'data-voice-active="true"',
    'data-operation="processing"', "prefers-reduced-motion:reduce",
):
    require(selector in compact, f"Missing R52 motion selector: {selector}")

for hook in ("voice-start","voice-end","voice-cancel","voice-error","visibilitychange","aria-busy","SabikWebPresentation"):
    require(hook in js, f"Missing R52 presentation hook: {hook}")
require("web_" not in js, "R52 presentation must not swap web_* PNG masters")
require("new Image()" not in js, "R52 presentation must not preload static state masters")
require("Movimiento breve cuando cambia el estado." in panel + mount, "Approved R02 ES motion copy changed")
require("Brief motion when the state changes." in mount, "Approved R02 EN motion copy changed")
require("'.webp'" in publisher, "R08 publisher must include R52 donor WebP")

print("R52_A3_SABIK_PRESENCE_STATIC_TESTS_PASS")
