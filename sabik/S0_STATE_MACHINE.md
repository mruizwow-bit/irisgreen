# Sabik S0 state machine

Issue: #146

Branch: `sabik/s0-state-machine`

Target PR: draft #161 into `sabik-preview`

## Scope

S0 adds the definitive pure state machine for Sabik. It does not connect the machine to the page controller, CSS, speech synthesis, animations, retrieval, risk detection, or editorial data.

The pure module is `sabik/nea-core/sabik-machine.js`. It exports CommonJS functions directly and does not read from or write to `window`, the DOM, storage, network, clocks, or random sources.

The public state is layered:

- `operation`
- `dialogue`
- `adaptation`
- `safety`
- `visibility`
- `speech`
- `motion`
- `language`
- `revision`

The transition API is:

```js
const next = transitionSabikState(previous, event);
```

The machine also exposes:

```js
createInitialSabikState();
validateSabikState(state);
deriveSabikPresentation(state);
```

## Canonical changes after QA block

- `sabik-machine.js` is a pure Node-importable module and no longer depends on `window.NEACoreState` or `window.NEASabikMachine`.
- Public state uses canonical names: `operation`, `speech`, `motion`, and `revision`.
- `SPEECH_START` reaches `speech_starting` with energy `0`; `SPEECH_BOUNDARY` moves to `speaking`.
- `SPEECH_STOP` and `SPEECH_END` are distinct through `speech.end_reason`.
- `speech_paused`, `speech_ended`, `speech_error`, `silent`, and `speech_starting` all have energy `0`.
- `RESET_SESSION` does not clear `risk_confirmed` or `human_handoff`.
- `RISK_CONFIRMED` is preemptive from active ordinary states: it stops ordinary speech, switches dialogue to `human_handoff`, and puts motion in `protection`.
- Ordinary speech cannot start while protection is active.
- `SET_ADAPTATION`, payload-based `SET_LANGUAGE`, and payload-based `SET_REDUCED_MOTION` are supported.

## Invariants

- Collapse, hide and show only affect visibility.
- Pause does not erase the session.
- Resume does not create a new session.
- `RESET_SESSION` resets ordinary session layers but preserves active protection.
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
python3 scripts/build_site.py
```

On this Windows environment, `python3` is not on PATH. The equivalent local command used was:

```powershell
& 'C:\Users\mruiz\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\build_site.py
```

Current local results:

```text
node tools/test-sabik-machine-s0.js  -> 26/26
node tools/test-sabik-page-v7.js     -> 28/28
```

The build reaches the final staging cleanup and fails on a Windows file lock:

```text
PermissionError: [WinError 5] Acceso denegado:
dist\assets\books\samples\luma-es\sprite.part1.txt
```

That remains the only local build blocker observed here; it is outside the S0 state-machine files.
