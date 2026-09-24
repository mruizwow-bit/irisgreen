# Sabik S0 state machine

Issue: #146

Branch: `sabik/s0-state-machine`

Target PR: draft #161 into `sabik-preview`

Normative consolidated QA SHA: `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b` from PR #164.

## Scope

S0 defines the pure state machine for Sabik. It does not connect the machine to the page controller, CSS, speech synthesis, animations, retrieval, risk detection, or editorial data.

The pure module is `sabik/nea-core/sabik-machine.js`. It exports CommonJS functions directly and does not read from or write to `window`, the DOM, storage, network, clocks, or random sources.

`state.js` deliberately does not duplicate the S0 contract catalogue. The S0 machine module is the contract source for the machine.

## Public State Contract

The public state uses the QA scalar fields. Metadata objects are allowed but optional:

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
  revision
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

Speech, motion, and technical error details may be stored in metadata, but metadata omission is valid at the public boundary and is normalized internally:

```js
speech_meta: { energy, boundary_count, end_reason }
motion_meta: { reduced }
error_meta: { origin_operation, layer, code, message }
```

Absent or partial `speech_meta` is completed with `{ energy: 0, boundary_count: 0, end_reason: null }`. Only omitted fields receive defaults. Explicit energy and counter values are validated before cloning or normalization: invalid types, non-finite numbers, out-of-range energy and negative or fractional counters are rejected. Inactive speech still requires zero energy. Valid counters and end reasons survive normalization; events update only their existing responsibilities.

Validation, presentation derivation and transitions accept valid partial metadata without mutating the state or event, including frozen inputs. Completing speech metadata does not create `motion_meta` or authorize motion.

## B06/B07 Semantics

- Ordinary `awaiting_clarification + SUBMIT` returns to retrieval with dialogue `clarification` and safety `normal`.
- Safety `uncertain` is not cleared by `SUBMIT` or `RESET_SESSION`.
- During `booting`, ordinary events are rejected; only `BOOT_OK` may move `booting` to `ready`.
- A technical error from `booting` records `error_meta.origin_operation: "booting"`; `RETRY` returns to `booting`, not `ready`.
- Technical and speech errors preserve contractual metadata: `origin_operation`, `layer`, `code`, and `message` when present.
- `RETRY` preserves `error_meta` for ordinary, uncertain, risk, and human handoff errors. Boot errors are the only retry path that drops `error_meta`.
- When `motion_meta` is absent and the current state has `motion: "off"`, motion stays `off` until an explicit `SET_REDUCED_MOTION { enabled: false }` re-enables ordinary motion.
- `RISK_CLEARED` is accepted only from active clarification: `operation: "awaiting_clarification"`, `dialogue: "clarification"`, `safety: "uncertain"`.
- `RISK_CLEARED` from safety `uncertain` returns to `operation: "retrieving"`, `dialogue: "clarification"`, `speech: "silent"`, and `motion: "processing"`.
- `RISK_CLEARED` from `normal`, `risk`, `human_handoff`, or paused `uncertain` is rejected without changing the previous state or incrementing `revision`.
- `PAUSE_ASSISTANT` preserves `motion: "protection_static"` during `uncertain`, `risk`, and `human_handoff`.
- A technical error during `uncertain` preserves `dialogue: "clarification"`, `safety: "uncertain"`, and `motion: "protection_static"`.
- `SPEECH_REQUEST` sets `speech: "starting"` and energy `0`.
- `SPEECH_START` means audible start and is only valid from `starting`.
- `SPEECH_BOUNDARY` is only valid while `speaking` and updates metadata/energy.
- `SPEECH_PAUSE` sets `speech: "paused"` and `motion: "off"`.
- Ordinary `SPEECH_ERROR` sets `speech: "error"` and `motion: "off"`.
- `SPEECH_ERROR` during `risk` or `human_handoff` preserves `motion: "protection_static"`.
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

## Seventh-Cycle Validation

Parent implementation: `5b0220612404d400cbf9de35240a3dacf98868a5`.

The unchanged QA files come from `inputs/qa` in `EVIDENCIA_QA_S0_5B022061.zip`, SHA-256 `90c99e9976476702ee262f360171bc44a88e1589d4448b5b23a7caa786b0425b`. The archive hash and all seven QA file hashes were checked against its manifest. The normative commit remains `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`.

Before the correction, the original runner reproduced `EV-SPEECH-REQUEST-PARTIAL-META: permitido rechazado: Invalid Sabik state: invalid speech boundary_count` with exit code 1. After the correction, that row and `S0-C29` pass as part of the complete canonical run. The output is `speech: "starting"`, `motion: "off"`, revision 1 and complete default speech metadata.

Commands executed from `C:\Users\mruiz\Documents\NEAlabs-GitHub-Limpio\projects\irisgreen`:

```bash
node tools/test-sabik-machine-s0.js
node tools/test-sabik-page-v7.js
```

Commands executed from `C:\Users\mruiz\AppData\Local\Temp\sabik-s0-cycle7-qa\inputs\qa`, using the corrected module in the working clone (not `inputs/impl`):

```powershell
node tests/specs/sabik/validate-s0-contract-consistency.mjs
node tests/specs/sabik/run-s0-contract.mjs --module "C:\Users\mruiz\Documents\NEAlabs-GitHub-Limpio\projects\irisgreen\sabik\nea-core\sabik-machine.js"
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module "C:\Users\mruiz\Documents\NEAlabs-GitHub-Limpio\projects\irisgreen\sabik\nea-core\sabik-machine.js"
```

| Check | Result | Exit code |
| --- | --- | --- |
| Own S0 suite | 67/67 | 0 |
| V7 | 28/28 | 0 |
| Contract consistency | 0 contradictions, 0 impossible initial states, 0 broken references | 0 |
| Canonical runner | 84 rows, 32 scenarios, 3 invalid inputs; `ACEPTA_PUERTA_AUTOMATICA_S0` | 0 |
| B06/B07 subset | 28 rows, 12 scenarios; `ACEPTA_SUBCONJUNTO_B06_B07` | 0 |

The B06/B07 subset is contained in the consolidated matrix; it is not additional coverage. The original runners, matrix, scenarios and fixtures remain outside this branch and unchanged. Own regression tests additionally cover empty and partial metadata, preservation of valid fields, explicit invalid values, frozen inputs, determinism and motion staying off. Previous B14/B15 cases remain in the suite.

Separate stdout, stderr and command/exit-code records are in `C:\Users\mruiz\AppData\Local\Temp\sabik-s0-cycle7-evidence`: `00-before-contract.*` for the reproduction and `01-machine.*` through `05-addendum.*` for the final runs.

## Eighth-Cycle Validation

Parent implementation: `81b44a5b8bfdcb3f662b8d7de3385cbce8090f63`. The normative contract is still `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b`.

`validateSabikState()` now rejects arrays in `motion_meta` and `error_meta` before normalization, using the same non-null, non-array object check as `speech_meta`. Empty and populated arrays return `ok: false` with an identifiable metadata error. Transitions and presentation derivation reject those inputs through the same validation boundary without changing the input, event or revision.

Metadata omission, empty objects, valid partial objects and error profiles E0/E1/E2/E3 remain accepted. Defaults, `speech_meta.end_reason`, transition behavior and the conservative motion rule are unchanged. The runtime change is limited to the two array checks.

The seven intact QA inputs from the prior verified package were reused in `C:\Users\mruiz\AppData\Local\Temp\sabik-s0-cycle7-qa\inputs\qa`. All seven hashes were verified against the package manifest before and after execution. The newer `EVIDENCIA_QA_S0_81B44A5B.zip` was not available locally; no reconstruction or download was needed because these QA inputs already match the same normative SHA.

From the implementation root:

```bash
node tools/test-sabik-machine-s0.js
node tools/test-sabik-page-v7.js
```

From the QA root above, each command was executed separately:

```powershell
node tests/specs/sabik/validate-s0-contract-consistency.mjs
node tests/specs/sabik/run-s0-contract.mjs
node tests/specs/sabik/run-s0-contract.mjs --module "C:\Users\mruiz\Documents\NEAlabs-GitHub-Limpio\projects\irisgreen\sabik\nea-core\sabik-machine.js"
node tests/specs/sabik/run-s0-addendum-b06-b07.mjs --module "C:\Users\mruiz\Documents\NEAlabs-GitHub-Limpio\projects\irisgreen\sabik\nea-core\sabik-machine.js"
```

| Check | Result | Exit code |
| --- | --- | --- |
| Own S0 suite | 117/117, including 50 new checks (S0-039 through S0-043) | 0 |
| V7 | 28/28 | 0 |
| Contract consistency | 84 rows / 32 scenarios; no contradictions, impossible initial states or broken references | 0 |
| Runner without implementation | 20 corpus cases validated structurally, not integrated conversations | 0 |
| Canonical runner with implementation | 84 rows / 32 scenarios / 3 invalid inputs; `ACEPTA_PUERTA_AUTOMATICA_S0` | 0 |
| B06/B07 subset | 28 rows / 12 scenarios; `ACEPTA_SUBCONJUNTO_B06_B07` | 0 |
| External array contrast | 12/12 agree with the unchanged contractual validator | 0 |

Own tests cover both `BOOT_OK` and `SPEECH_REQUEST` with frozen, otherwise valid states/events. They check empty/populated arrays, both arrays together, the existing speech-array rejection, all three public entry points and preservation of valid metadata. Before the fix, the external contrast reproduced 10 disagreements in motion/error metadata; only the two existing speech-array rejections agreed. After the fix all 12 agree. These are regression checks for the existing rule, not new normative rows; B06/B07 is also contained in the main matrix.

Full commands, stdout, stderr, exit codes and QA integrity records are outside the repository in `C:\Users\mruiz\AppData\Local\Temp\sabik-s0-cycle8-evidence`. The external `compare-array-metadata.mjs` uses the frozen QA validator without importing QA into runtime or changing the canonical runners.

## Build and Handoff

The accepted Linux build for `81b44a5b...` remains historical evidence. No build was executed in this eighth cycle; the known Windows `WinError 5` was not retried. A fresh Linux build and per-file dist size check belong to the subsequent review on the new published SHA. The prior build result must not be attributed to it.

This change remains limited to the machine, its own tests and this document. PR #161 stays draft into `sabik-preview`; independent QA retains the S0 verdict. S1/S2 remain closed. There is no merge or deploy.

Rollback: revert only the eighth-cycle correction commit to recover `81b44a5b...`; the QA contract and other branches do not need changes.

## Ninth Cycle: Boot Gate and Uncertain Speech Protection

- `BOOT_OK` remains the only transition out of bootstrap into ordinary flow. `RESET_SESSION` rejects both `booting` and an outstanding technical error originating in `booting`; `RETRY` returns that error to `booting`, where `SUBMIT` remains forbidden until `BOOT_OK`.
- Repeated `TECHNICAL_ERROR` events preserve a valid original `error_meta.origin_operation` instead of replacing it with `error`. An intervening `SPEECH_ERROR` also preserves the origin of an outstanding operational error, so it cannot erase the boot gate.
- `RISK_UNCERTAIN`, `RISK_CONFIRMED`, `HUMAN_HANDOFF` and `RISK_CLEARED` reject during bootstrap or an outstanding boot error. Safety events never substitute for `BOOT_OK`; rejection leaves the input state, event and revision unchanged.
- `SPEECH_ERROR` uses safety attention, including `uncertain`, to retain `motion: "protection_static"`. During uncertainty it preserves `dialogue: "clarification"` and `safety: "uncertain"`, sets `speech: "error"`, zero energy and `error_meta.layer: "speech"`. Normal safety still uses `motion: "off"`; risk and human handoff keep static protection.
