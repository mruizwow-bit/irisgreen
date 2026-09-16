# Sabik S0 state machine

Issue: #146

Branch: `sabik/s0-state-machine`

Target PR: draft #161 into `sabik-preview`

Normative QA addendum SHA: `e69929b4b88128c4c935435987f35532f37d2df0` from PR #164.

## Scope

S0 defines the pure state machine for Sabik. It does not connect the machine to the page controller, CSS, speech synthesis, animations, retrieval, risk detection, or editorial data.

The pure module is `sabik/nea-core/sabik-machine.js`. It exports CommonJS functions directly and does not read from or write to `window`, the DOM, storage, network, clocks, or random sources.

`state.js` deliberately does not duplicate the S0 contract catalogue. The S0 machine module is the contract source for the machine.

## Public State Contract

The public state uses the QA scalar fields plus the two allowed metadata objects:

```js
{
  operation,
  dialogue,
  adaptation,
  safety,
  visibility,
  speech,
  motion,
  language,
  revision,
  speech_meta,
  motion_meta
}
```

Canonical scalar values:

- `operation`: `booting`, `ready`, `retrieving`, `composing`, `presenting`, `awaiting_clarification`, `paused`, `error`
- `dialogue`: `none`, `information`, `practical`, `clarification`, `accompaniment`, `correction`, `insufficient`, `human_handoff`
- `safety`: `normal`, `uncertain`, `risk`, `human_handoff`
- `visibility`: `expanded`, `collapsed`, `hidden`
- `speech`: `silent`, `starting`, `speaking`, `paused`, `ended`, `error`
- `motion`: `off`, `ambient`, `processing`, `voice_reactive`, `protection_static`
- `language`: `es`, `en`

Speech and motion details are stored only in metadata:

```js
speech_meta: { energy, boundary_count, end_reason }
motion_meta: { reduced }
```

## B06/B07 Semantics

- Ordinary `awaiting_clarification + SUBMIT` returns to retrieval with dialogue `clarification` and safety `normal`.
- Safety `uncertain` is not cleared by `SUBMIT` or `RESET_SESSION`.
- `RISK_CLEARED` is the explicit event that returns safety to `normal`.
- `SPEECH_REQUEST` sets `speech: "starting"` and energy `0`.
- `SPEECH_START` means audible start and is only valid from `starting`.
- `SPEECH_BOUNDARY` is only valid while `speaking` and updates metadata/energy.
- Pause, stop, end and error all leave speech energy `0`.
- Reduced motion can turn motion `off` without blocking speech or text.
- Confirmed risk interrupts ordinary operation, stops speech, sets `dialogue: "human_handoff"`, and uses `motion: "protection_static"`.

## Invariants

- Collapse, hide and show only affect visibility.
- Pause does not erase the session.
- Resume does not create a new session.
- `RESET_SESSION` resets ordinary session layers but preserves safety `uncertain`, `risk`, or `human_handoff`.
- Voice and motion are independent layers.
- Reduced motion does not block voice or text.
- Motion cannot declare that Sabik is speaking.
- Inactive speech states have zero energy.
- Confirmed risk takes presentation priority.
- Technical errors preserve active safety state.
- NEA preferences remain adaptation, not diagnosis.
- Invalid or impossible events throw instead of creating partial state.
- Equal state plus equal event returns equal next state.

## Commands

```bash
node tools/test-sabik-machine-s0.js
node tools/test-sabik-page-v7.js
node tests/specs/sabik/run-s0-contract.mjs --module sabik/nea-core/sabik-machine.js
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module sabik/nea-core/sabik-machine.js
python3 scripts/build_site.py
```

Current local results in this Windows environment:

```text
node tools/test-sabik-machine-s0.js  -> 23/23
node tools/test-sabik-page-v7.js     -> 28/28
```

The canonical PR #164 runners are not present in this branch checkout, so they were not run locally here. They are expected to run in QA against the pushed SHA.

On this Windows environment, `python3` is not on PATH. The equivalent local command used was:

```powershell
& 'C:\Users\mruiz\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\build_site.py
```

The build reaches the final staging cleanup and fails on a Windows file lock:

```text
PermissionError: [WinError 5] Acceso denegado:
dist\assets\books\samples\luma-es\sprite.part1.txt
```

B05 must be resolved by the Linux QA build on the exact pushed SHA; this local Windows run is not marked as a clean build.
