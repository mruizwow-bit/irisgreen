# R52 · A3 · Sabik moving presence restored

## Final identity

Base A2 HEAD: `ebda48b00c4a323408bdf1471c311864635ed39d`  
Base A2 tree: `40828a7e6da73d09de7710c00a29408b525c7002`  
A3 HEAD before this documentation-only correction: `e5b31dc5aa6b871793269ea333860b69ade0b30c`  
A3 tree before this documentation-only correction: `b23856df81acfc5e18bce9b07b8d5f68a4477adb`  
Branch: `agent3/r52-sabik-moving-presence-20260927`  
Donor visual: `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`  
Donor base asset Git blob: `003a7642840d060a4c53ce6f2776c59ff6e672e7`

The earlier `23108a893e93939305e1a382150c1b4034f69c82` value was a stale pre-final base reference and is superseded by the final A2 base above.

## Ported by A3

Layered back SVG + approved base WebP + layered front SVG are taken from the exact donor. The donor's continuous precession, base breathing, presence wave and voice ripple are restored. PRESENTE / ORIENTAR / TRANSICION / PAUSA / CONFIRMAR now modulate that living presence instead of swapping static masters. Current retrieval activity is read from `#sabik-results[aria-busy]`; the current panel, retrieval, Safety, audio runtime and approved R02 copy stay authoritative.

The historical donor references `sabikCoreBreath` but does not define `@keyframes sabikCoreBreath`. R52 records that discrepancy and does not invent a missing donor animation.

### Exact A3 implementation surfaces

- `sabik/iris-panel.html`: layered Sabik markup replaces the static-only presentation while preserving the current panel.
- `sabik/iris-mount.css`: donor-derived orbit/precession, breathing, presence-wave, voice-ripple, B3 modulation, NORMAL/REDUCIDO/SIN_MOVIMIENTO, hidden/panel pause, reduced-motion and forced-colors behavior.
- `sabik/sabik-web-r01.js`: current-state adaptation, processing activity, render pause, and visual voice hooks.
- `sabik/assets/sabik-base-640.webp`: exact donor WebP blob `003a7642840d060a4c53ce6f2776c59ff6e672e7`.
- `scripts/apply_iris_brief_r08.py` + `scripts/test_iris_brief_r08.py`: publish and verify the donor WebP in the built output.
- `scripts/test_sabik_presence_r52.py` + `scripts/test_sabik_presence_r52_browser.py`: static/regression and temporal browser QA.
- `.github/workflows/r52-a3-sabik-presence.yml` + `.github/workflows/iris-sabik-r08.yml`: dedicated R52 gate and integration into the broader R08 checks.

## Deliberately not restored

Old NEA shell/navigation/copy/retrieval/storage/Safety and cognitive-inference semantics are not restored. No `data-cognitive-state`, Hiperfoco, Sobrecarga, Vinculo, VozInterior or Creatividad inference returns.

## A2 voice hook

A3 exposes both:

`SabikWebPresentation.handleVoiceEvent('voice-start'|'voice-end'|'voice-cancel'|'voice-error')`

and:

`SabikWebPresentation.setVoiceActive(boolean)`

The existing `createSabikVoice(..., { onState })` already exposes `playing`. A2 can connect the current audio runtime with:

```js
window.SabikWebPresentation?.setVoiceActive(Boolean(state.playing));
```

This branch does not claim final speech playback because the canonical 30 WAV assets remain A2's binary gate.

## Evidence

`scripts/test_sabik_presence_r52.py` gates structure, donor provenance and regressions.  
`scripts/test_sabik_presence_r52_browser.py` produces temporal browser evidence for resting motion, processing, voice ripple, reduced/no-motion, hidden panel, frame pacing and 1920/1440/390/320 widths.  
Dedicated R52 presence workflow run `36343836772`: SUCCESS.  
CI artifact: `r52-a3-sabik-temporal-evidence` / artifact id `10939593995`.  
The R08 publisher allowlist includes `.webp`, and the built donor asset is checked byte-for-byte against source.

The broad R08 job reaches the pre-existing `test_iris_corrections_r09.py` failure also present on the exact A2 base; A3 does not alter that unrelated scope.

Marker: `R52_A3_SABIK_MOVING_PRESENCE_RESTORED_READY_FOR_A2`
