# W1-CODEX-A03: separate cognition/adaptation from Safety

Authorization: DEC-020, ORDEN_CODEX_W1_A03_DESACOPLE_COGNICION_SAFETY.

- Exact product base: `0a1d4339bae2628dc963501a30f326553605821b`.
- Branch: `sabik/a03-decouple-cognition-safety-20260921`.
- New draft PR targets `sabik-preview`; PR #212 remains unchanged.
- Independent A03 freeze: `96a0fc516266166c09d3c2f9dd2f03e684a9b027` (PR #217).
- NO MERGE. NO DEPLOY. Independent QA must revalidate the final published SHA.

## Cause and minimal correction

`detectCognitiveState(text, preferences, riskState)` returned `Sobrecarga` as
soon as `riskState !== "normal"`, before examining any cognitive text signal.
The existing layer mapper then derived `low_intensity=true` from that overload.
Preferences were not themselves changed, but cognition and adaptation were.
Clearing S0 Safety could leave that artificially generated session value behind.

Remove only that Safety-dependent return, at the source in retrieval.js.
Keep the existing function signature and cognitive signal rules unchanged.
The riskState argument is now irrelevant to cognitive selection, as preferences
already were. No call-site shim, new parallel state, suppression of explicit
signals, or change to S0/protection is needed.

Consequences demonstrated by tests:

- Safety-only with base cognition preserves NucleoBase and explicit preferences.
- Safety does not add low_intensity, including neutral turns, pause/resume,
  technical error/retry and explicit uncertainty clearance.
- Existing explicit low_intensity=true stays true; false stays false.
- Explicit overload still selects Sobrecarga, with or without active Safety.
- Hyperfocus, inner-voice, connection and creativity signals remain recognized.
- Protected presentation still changes protection, functional_state, interaction,
  mode and visual_presence, and blocks ordinary retrieval.
- Third-person protection does not attribute cognition to the user.
- S0 reset semantics and all A01 recognition/continuity code remain untouched.

This is not a redesign of the existing per-turn cognitive vocabulary or a
general natural-language/clinical classifier. The correction removes Safety as
a sufficient cause; it does not claim new semantic coverage for the unchanged
text signal rules or a new cross-turn cognition persistence policy.

## Scope

Only three files differ from the exact product base:

1. `sabik/nea-core/retrieval.js`: one conditional removed, explanatory comment.
2. `tools/test-sabik-a03.js`: new own Core/S0 regression tests.
3. This document.

No changes to S0, its contract, risk.js, response.js, session.js, sabik-state.js,
page, A01 tests, A02, B3, voice, datasets, index, assets, HTML/CSS, workflows,
main, Netlify or Cloud. No external API, dependency or persistence is added.
The PR targets sabik-preview as ordered; until A01 is integrated there, its
unchanged ancestor commits may also appear in the cumulative PR diff. The A03
delta must be reviewed against 0a1d4339, not mistaken for a rewrite of A01.

## Independent artifacts used only as development mirrors

Both mirrors live outside the candidate branch. Fixtures, specs, runners,
validators and adapters are extracted byte-for-byte from Git blobs; hashes are
verified (including line endings). An initial Windows archive extraction used
CRLF; it was replaced with raw Git blobs and both baseline and final mirrors
were rerun. No contractual artifact or expectation was edited.

A03: four frozen files at 96a0fc51, plus unchanged baseline adapter from
`59cda12c6a21cd0b4de94ae7c113cd20ced3548b`:

```text
node tests/specs/sabik/validate-a03-gate-v1.mjs
node tests/specs/sabik/run-a03-gate-v1.mjs --adapter tools/a03-baseline-adapter.mjs
```

A01: four frozen files at `418740e858397008aa709b0fcf22589fbc20a02f`, plus
unchanged adapter from `33fbaebee2d2c7793ca0212780145195d0f176e0`:

```text
node tests/specs/sabik/validate-a01-safety-gate-v1.mjs
node tests/specs/sabik/run-a01-safety-gate-v1.mjs --adapter tools/a01-candidate-212-independent-adapter.mjs
```

Baseline A03 reproduced on immutable 0a1d4339: **5/12 PASS, 7/12 FAIL**.
Failures: 01, 02, 06, 07, 08, 09, 11. After the correction: **12/12 PASS**.
A01 development mirror remains **14/14 PASS**.
The runners' literal INDEPENDENT_CASES_PASS messages are not independent QA
acceptance of this candidate. Agent 1 must execute the same freeze on its final SHA.

## Own generalization coverage

67 checks use the real local Core, local data and unchanged S0. They do not
import frozen case IDs or expectations. They vary Safety and explicit preference
inputs, cognitive signals, and user text; check actual cognitive_state,
low_intensity, session_preferences, and protective presentation separately;
instrument retrieval; and assert previous sessions are not mutated.

Coverage includes confirmed/uncertain/human-handoff protection; neutral follow-up;
pause/resume; technical error/retry; clear; reset; explicit cognitive signals in
ordinary and protected responses; own risk plus overload; third-person, quoted,
negated, informational and neutral Safety-text contrasts. Handoff tests enter
confirmed risk first, respecting the unchanged S0 precondition.

```text
node tools/test-sabik-a03.js
node tools/test-sabik-a01.js
node tools/test-sabik-a01-browser.js
node tools/test-sabik-machine-s0.js
node tools/test-sabik-page-v7.js
node tools/test-sabik-s1.js
node tools/test-sabik-s4.js
node tools/test-sabik-s4-browser.js
node tools/test-sabik-a11y-closure.js
python scripts/build_site.py
git diff --check
```

For browser source/dist runs set A01_WEB_ROOT, S1_WEB_ROOT and S4_WEB_ROOT to
the source root or dist, respectively. NODE_PATH points to installed Playwright.
Optional A03_EVIDENCE_DIR writes own unit evidence outside the repository.

## Supplemental Claude scenarios

The existing unmodified runner reads the original external JSON (SHA-256
`1f6dede5d01ad389a642be60d409c27531ec58c6d7f0ab522a3b3ba3a24c2653`):

```text
node tools/test-sabik-a01-supplemental.js --cases <original-external-JSON> --out <external-report.json>
```

SUPPLEMENTAL_NOT_GATE. All 28 base-schema cases pass: 24 complete measured PASS,
4 measured PASS with optional observations unavailable, 0 measured failures.
SEM-23 now measures inferred_state_changed=false and adaptation_changed=false,
with confirmed protection, ordinary retrieval blocked and base cognition intact.

The same limitations remain: question_repeated in SEM-01/02/12 and
resumed_original_request in SEM-06 are not observed by this Core/S0 adapter.
Editorial [E] decisions in SEM-02/09/27 are not changed or frozen by this work.

## Executed regressions

All results below were run for this candidate, not inherited from A01:

| Suite | Result |
| --- | --- |
| A03 development mirror | 12/12, baseline reproduced as 5/12 |
| A01 development mirror | 14/14 |
| Own A03 tests | 67/67 |
| Unchanged own A01 tests | 154/154 |
| A01 browser source / dist | 29/29 each |
| S0 / V7 / S4 unit | 146/146 / 28/28 / 87/87 |
| S1 source / dist | 37/37 + 53/53 extra checks each |
| S4 browser source / dist | 19/19 each, storage 4/4 included |
| Accessibility closure | A11Y_CLOSURE_PASS |
| Full Windows build | exit 0 on first attempt, 1650 public files |
| git diff --check | PASS |

## Environment, evidence and reversal

Windows_NT 10.0.26200 x64; Node 24.19.0; Python 3.12.14;
Playwright 1.62.1 with Chrome 153.0.8010.53.
Evidence: external `FARO 3/W1-A03-EVIDENCE-20260921/`, including mirror-blobs.json,
baseline/final mirror logs, own tests, browser results, Claude JSON and build log.
Final regression counts and published HEAD are also recorded in the draft PR.
No Linux validation or new manual/screen-reader certification is claimed here.
S1 runs are regressions, not reopening its prior coordinated gate.

Revert only the new A03 commit to return to the accepted A01 product SHA, with
the known 5/12 A03 baseline. No migration or persisted data is involved.
No rebase/force-push; #212 and #217 remain unchanged. NO MERGE / NO DEPLOY.
