# R52 · A3 · Sabik moving presence restored

Base A2: `23108a893e93939305e1a382150c1b4034f69c82`  
Donor visual: `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`  
Donor base asset Git blob: `003a7642840d060a4c53ce6f2776c59ff6e672e7`

## Ported by A3

Layered back SVG + approved base WebP + layered front SVG are taken from the exact donor. The donor's continuous precession, base breathing, presence wave and voice ripple are restored. PRESENTE / ORIENTAR / TRANSICION / PAUSA / CONFIRMAR now modulate that living presence instead of swapping static masters. Current retrieval activity is read from `#sabik-results[aria-busy]`; the current panel, retrieval, Safety, audio runtime and approved R02 copy stay authoritative.

The historical donor references `sabikCoreBreath` but does not define `@keyframes sabikCoreBreath`. R52 records that discrepancy and does not invent a missing donor animation.

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
CI artifact: `reports/sabik-r52/temporal-evidence.json`.

Marker: `R52_A3_SABIK_MOVING_PRESENCE_RESTORED_READY_FOR_A2`
