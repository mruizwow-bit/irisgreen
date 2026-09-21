# W1-CODEX-A01: safety continuity candidate

Authorization: DEC-020, order dated 2026-09-21. Scope: A01 only.
Updated for ORDEN_CODEX_ADDENDUM_A01_SEMANTICA (same authorization and PR #212).

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

- `nea-core/risk.js`: stateless turn classification, bounded first-person/clitic/
  negation handling, and event proposals subject to the current S0 snapshot.
- `nea-core/response.js`: select protection from the S0 snapshot before ordinary
  interpretation or retrieval; legacy risk fields are output projections only.
- `sabik-page.js`: submit turn signals as existing S0 safety events, keep protected
  plans visible across errors and pause, and retain S0 protection on session reset.
- `tools/test-sabik-a01.js`: 63 synthetic multiphase Core/S0 regressions.
- `tools/test-sabik-a01-browser.js`: 18 real-page/worker regressions, including
  error injection and pause/reset interleavings. Hooks exist in tests only.
- This delivery document.

The addendum removes the earlier session resolver and safety_resolution marker:
`session.js` is restored exactly to the authorized base, not a second authority.
It therefore appears in the addendum commit but not in the final diff to base.

No changes to S0, its contract, QA fixtures/runners,
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

Only after the worker accepts a safety event does the page project and render
its protection. Once RISK_CLEARED is accepted, the projection follows S0 even
when a subsequent pause invalidates ordinary rendering. Worker event order
remains authoritative; pause is not silently resumed.

## Semantic addendum: one authority

Before: candidate 93ea0cd9 retained protection in session.risk_state and inferred
clearance from session.last_plan, then attempted to align S0 with that decision.
After: classification has no memory; S0 owns protection; response construction
receives the accepted S0 snapshot. No legacy risk/plan field determines Safety.

| Current turn signal and S0 precondition | Proposed event |
| --- | --- |
| Ambiguous current turn, safety normal | RISK_UNCERTAIN |
| Explicit first-person risk, not already risk/handoff | RISK_CONFIRMED |
| Complete affirmative, uncertain + awaiting_clarification + clarification | RISK_CONFIRMED |
| Complete negative, same pending-clarification precondition | RISK_CLEARED |
| Explicit human-help request, risk/uncertain active | HUMAN_HANDOFF |
| Neutral, unrelated turn, or already handoff | None; preserve Safety |
| Paused, error or booting | None; the existing lifecycle must resume/retry/boot first |

Event proposals cannot directly change protection. They pass through the
unchanged worker/machine. Ordinary SUBMIT/RETRIEVAL_OK/RESPONSE_READY are not
sent under active Safety. Instrumented Core and browser tests assert zero
ordinary fragment retrieval there. Existing error/retry/reset semantics remain
S0's; reset rebuilds only the protected output, without conversational history.

`buildResponsePlan` and `applyResponseControl` accept the machine snapshot as
their last argument. All real page calls supply it. For compatibility, the
three/four-argument legacy forms remain single-turn plan APIs, not a substitute
for a conversational Safety machine. Direct callers must supply S0 for continuity.
Forged/stale legacy risk and plan values cannot override a supplied S0 snapshot.

Detector scope is deliberately bounded to the existing harm/continued-living/
suicidal-thought vocabulary and explicit grammatical predicates. Reflexive
pronouns before the modal or on the infinitive are supported; negated and
third-person/reported predicates are not confirmed risk about the user. Concepts
inherited from another turn do not confirm risk. This is not a clinical classifier
or general quotation/negation parser. A human-handoff state does not mean a person
has been contacted: no service, outbound communication or resource was added.

## Claude cases and independent gate

The addendum names 28 `suggested_not_frozen` cases but does not attach their
contents or identifiers. They were requested from the user. **No PASS count is
claimed for those 28 cases**; an ID-by-ID comparison remains unavailable until
the file is supplied. The tests here are our own development regressions,
derived from the stated invariants, not copied or adapted acceptance utterances.

The independent gate stays PR #210, freeze
`418740e858397008aa709b0fcf22589fbc20a02f`. Its cases, fixtures, runners and
expectations were not read/copied/changed to implement this candidate. Its
acceptance verdict belongs to Agent 1, not these development counts.

Unresolved editorial [E] decisions are not implemented: second-question copy,
open communication during handoff, task-qualified ambiguous exhaustion,
retraction acknowledgement and minimum resources with an empty dataset.
Existing copy/behavior is retained where applicable, with no invented resource.
Legacy Safety-to-Sobrecarga/low-intensity coupling is explicitly deferred to A03;
`sabik-state.js` and the intensity policy remain untouched.

## Executed validation

Environment: Windows, Node 24.19.0, Python 3.12.14, Chrome 153.0.8010.53
(headless Playwright). All commands below exited 0 on the candidate.

| Check | Result |
| --- | --- |
| A01 Core + real S0 | 63/63 |
| A01 actual browser, source | 18/18 |
| A01 actual browser, dist | 18/18 |
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

The first addendum build failed with WinError 5 when removing an old generated
directory under dist. Only read-only flags on generated dist directories were
cleared, after checking their resolved paths and excluding symbolic links. The
complete build then exited 0. Both logs are retained as build.log and
build-retry.log; the failed first attempt is not counted as a successful build.

Optional evidence directories: `A01_EVIDENCE_DIR`, `S1_EVIDENCE_DIR`,
`S4_EVIDENCE_DIR`, all outside the repository. This execution saved raw JSON and
S1 screenshots under `FARO 3/W1-A01-EVIDENCE-20260921/` in `baseline/` and
`candidate/` (initial candidate) and `addendum/` (this revision). They contain
synthetic inputs only and are not runtime assets.

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
After an explicitly approved integration: revert both A01 candidate commits
and rerun S0/S1/S4/V7. No schema migration, persisted conversation or remote
configuration needs rollback. Reversal also restores the documented A01 defect.
