# W1-CODEX-A01: safety continuity candidate

Authorization: DEC-020, order dated 2026-09-21. Scope: A01 only.

Exact base: `sabik-preview@fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`.
Branch: `sabik/reconcile-a01-safety-continuity-20260921`.
Delivery: draft PR targeting `sabik-preview`; independent QA still required.
NO MERGE. NO DEPLOY.

## Reproduction before runtime edits

The new synthetic unit suite passed 17/37 on the exact base; its initial
real-browser suite passed 0/12. These are new A01 tests, not existing QA scores.
Browser observations used the real page, local Core and unchanged S0 worker.

| Sequence | Base observation | Candidate |
| --- | --- | --- |
| `ya no puedo mas` | Core clarification, but S0 still normal | Core clarification + S0 uncertain/protection_static |
| clarification -> `si` | Ordinary insufficiency, risk lost | Confirmed protection + S0 risk |
| clarification -> `no` | Ordinary response without any S0 clearance | Explicit RISK_CLEARED, then ordinary flow |
| clarification -> neutral/topic change | Pending safety could disappear | Same pending safety question |
| confirmed risk -> `hola` / new topic | Per-turn detector replaced risk with normal | Existing protected plan, no ordinary SUBMIT |
| protection -> technical error -> retry | S0 not protected; error replaced the answer | Protection and its answer retained; retry preserves safety |
| protection -> reset | Conversation and risk both discarded | Conversation cleared, S0 protection retained |

Four additional browser tests cover pause/reset at the worker acknowledgement
boundary. They found two intermediate candidate defects: missing visible safety
text when pausing immediately, and session/S0 divergence after explicit clearance
followed by pause. Both are included in the correction and pass in the final run.

## Minimal runtime delta

- `nea-core/session.js`: remember safety in the existing in-memory session and
  resolve complete answers only when the safety question is pending.
- `nea-core/response.js`: use that context before selecting the existing plans;
  expose a one-turn `safety_resolution` for an explicit clearance.
- `sabik-page.js`: map safety plans to existing S0 safety events, keep protected
  plans visible across errors and pause, and retain S0 protection on session reset.
- `tools/test-sabik-a01.js`: 37 synthetic multiphase Core regressions.
- `tools/test-sabik-a01-browser.js`: 16 real-page/worker regressions, including
  error injection and pause/reset interleavings. Hooks exist in tests only.
- This delivery document.

No changes to S0, its contract, QA fixtures/runners, risk.js classification rules,
editorial copy, datasets, generated index, HTML, CSS, visual assets, B3, voice,
Cloud/Netlify configuration, main, production or I0 PRs. No persistence or API.

## Resolution boundaries

The existing safety question asks whether the person is in immediate danger or
thinking of self-harm. While that question is pending, normalized whole `si` or
`yes` promotes protection; whole `no` or
`no estoy en peligro ni pensando en hacerme dano` explicitly clears uncertainty.
Normalization is the existing accent/case/punctuation normalization.

A partial negation, unrelated sentence, preference or topic change cannot clear
the compound question. Explicit danger still promotes protection. This is a
bounded answer interpretation, not a replacement risk classifier or a claim of
natural-language coverage. Independent QA must review this closed answer policy.

Confirmed risk has no ordinary clearance event in the accepted S0 contract.
Neutral messages, denial, pause, preferences and RESET_SESSION therefore do not
clear it. No new discharge path or human handoff service is invented. A page reload
still starts a fresh nonpersistent session, as before. Reset clears conversation
and recreates only the existing protected response, with no old user statements.

When a result is already recognized as protected, it is retained before awaiting
the worker. Once RISK_CLEARED is accepted, session state follows that acceptance
even when a subsequent pause invalidates ordinary rendering. Worker event order
remains authoritative; pause is not silently resumed.

## Executed validation

Environment: Windows, Node 24.19.0, Python 3.12.14, Chrome 153.0.8010.53
(headless Playwright). All commands below exited 0 on the candidate.

| Check | Result |
| --- | --- |
| A01 Core | 37/37 |
| A01 actual browser, source | 16/16 |
| A01 actual browser, dist | 16/16 |
| S0 unchanged | 146/146 |
| S4 unit unchanged | 87/87 |
| V7 unchanged | 28/28 |
| S1 unchanged, source and dist | 37/37 main cases + 53/53 extra checks per run |
| Accessibility closure static check | A11Y_CLOSURE_PASS |
| S4 browser, source | 19/19 including storage 4/4 |
| S4 browser, dist | 19/19 including storage 4/4 |
| Full build | exit 0, 1650 published files |

Reproduction commands from the worktree root (Playwright and Chrome required):

```text
node tools/test-sabik-a01.js
node tools/test-sabik-a01-browser.js
node tools/test-sabik-machine-s0.js
node tools/test-sabik-s4.js
node tools/test-sabik-page-v7.js
node tools/test-sabik-s1.js
node tools/test-sabik-a11y-closure.js
node tools/test-sabik-s4-browser.js
python scripts/build_site.py
```

For Windows build, set `PYTHONUTF8=1` and `PYTHONIOENCODING=utf-8`; checkout uses
LF. No hash guards or build scripts were altered. For dist browser runs, set
`A01_WEB_ROOT=dist`, `S1_WEB_ROOT=dist` or `S4_WEB_ROOT=dist` respectively.
The test server applies the corresponding source/dist CSP and blocks external
requests; the Core, data, worker and S0 are local real implementations.

Optional evidence directories: `A01_EVIDENCE_DIR`, `S1_EVIDENCE_DIR`,
`S4_EVIDENCE_DIR`, all outside the repository. This execution saved raw JSON and
S1 screenshots under `FARO 3/W1-A01-EVIDENCE-20260921/` in `baseline/` and
`candidate/`. They contain synthetic inputs only and are not runtime assets.

Exact review diff: `git diff fc5cdfc2f978c85033de2b07c34309f8a4a7bd18 HEAD`.
The delivery commit/PR identifies the candidate SHA; this document cannot embed
its own commit hash.

## Limits and independent review

- Build evidence here is Windows, not Linux. No Linux result is claimed.
- S1 results are automated regressions, not a new screen-reader/manual
  accessibility attestation. Existing runner manual flags remain unchanged;
  this does not reopen the previously accepted whole S1 phase.
- No clinical validation, new risk detection coverage, new resource catalogue,
  new voice behavior or cloud-runtime coverage is claimed.
- Visual intensity A03 and the separate layout work remain out of scope.
- Ordinary input while confirmed protection is active stays in the protected
  local conversation; it cannot bypass S0 into ordinary retrieval.

## Reversal

Before integration: close the draft PR; no shared branch or deployment changes.
After an explicitly approved integration: revert this single candidate commit
and rerun S0/S1/S4/V7. No schema migration, persisted conversation or remote
configuration needs rollback. Reversal also restores the documented A01 defect.
