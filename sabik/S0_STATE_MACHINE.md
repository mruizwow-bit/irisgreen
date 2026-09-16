# Sabik S0 state machine

Issue: #146

Branch: `sabik/s0-state-machine`

Target PR: draft #161 into `sabik-preview`

## Scope

S0 adds a pure state machine for Sabik. It does not connect the machine to the page controller, CSS, speech synthesis, animations, retrieval, risk detection, or editorial data.

The state is layered:

- operational cycle
- dialogue mode
- NEA adaptation
- safety
- visibility
- voice
- motion
- language

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

## Invariants

- Collapse, hide and show only affect visibility.
- Pause does not erase the session.
- Resume does not create a new session.
- `RESET_SESSION` is the only event that increments `session_epoch`.
- Voice and motion are independent layers.
- Reduced motion does not block voice or text.
- Motion cannot declare that Sabik is speaking.
- Silent voice has zero energy.
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

That build reached the final staging cleanup and failed on a Windows file lock:

```text
PermissionError: [WinError 5] Acceso denegado:
dist\assets\books\samples\luma-es\sprite.part1.txt
```

The S0 unit test and V7 integration test passed before that build cleanup failure.
