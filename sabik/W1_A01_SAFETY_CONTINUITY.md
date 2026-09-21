# W1-CODEX-A01: safety continuity candidate

Authorization: DEC-020, order dated 2026-09-21. Scope: A01 only.
Updated for ORDEN_CODEX_ADDENDUM_A01_SEMANTICA (same authorization and PR #212).

Exact base: `sabik-preview@fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`.
Branch: `sabik/reconcile-a01-safety-continuity-20260921`.
Delivery: draft PR targeting `sabik-preview`; independent QA still required.
NO MERGE. NO DEPLOY.

## Recovered Claude 28 supplemental coverage

Authorization: ORDEN_CODEX_A01_R2_EJECUTAR_28_CLAUDE. This is an additional
commit after `56c601c55ea5c3e288b3b6cb893bc2c28ee98ecc`, not a rewrite.
The original external JSON was verified before running: schema 1.0,
`A01_SEMANTIC_SUGGESTED_CASES_V1`, `suggested_not_frozen`, 28 distinct scenarios,
base `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`, SHA-256
`1f6dede5d01ad389a642be60d409c27531ec58c6d7f0ab522a3b3ba3a24c2653`.
No corpus or independent QA files were copied into this branch or edited.

### Before and after

The first execution used the exact 56c601c5 runtime, with no runtime edits:
17 PASS, 3 measured PASS with optional observations unavailable, 8 FAIL.
Seven failures were A01 bugs: SEM-03/06/15/16/17/19/22. SEM-23 was the
pre-existing A03 cognition/intensity coupling, outside the authorized scope.

The correction uses bounded present-tense predicate families, not case-ID or
whole-sentence whitelists: self/third-person death wish and current self-harm,
`pienso en`, coordinated uncertainty, and affirmative answers with a reservation
about discussing/explaining it. A reservation only resolves an actual pending
S0 safety question; contradictory answers do not clear protection. Negative,
quoted, informational, past and figurative contrasts are retained in own tests.
While uncertain, an ordinary preference embedded in conversational text is not
executed. Explicit panel controls remain separate and are tested unchanged.

Only two runtime files change in this supplemental revision: risk.js and
response.js. The other changes are own unit/browser tests, the new supplemental
runner and this document. No S0, session.js, sabik-state.js, page, A03 policy,
B3, voice, data, index, assets, QA, main, Netlify or Cloud changes.

Final supplemental outcome: **28/28 base-schema observations pass**;
**23 full measured PASS, 4 measured PASS with optional observations unavailable,
1 measured optional FAIL (SEM-23/A03)**. This is NOT an unqualified 28/28 PASS.
The runner intentionally exits 1 for the measured A03 mismatch; no expectation
is removed or converted into a pass. All seven in-scope A01 failures are fixed.

| Scenario | Exact R2 baseline | Corrected result / scope |
| --- | --- | --- |
| A01-SEM-01 | Measured PASS; optional unavailable | Same; question_repeated not measured |
| A01-SEM-02 | Measured PASS; optional unavailable | Same; second-question limit remains editorial [E] |
| A01-SEM-03 | FAIL: affirmative reservation | PASS |
| A01-SEM-04 | PASS | PASS |
| A01-SEM-05 | PASS | PASS |
| A01-SEM-06 | FAIL: coordinated uncertainty | Base PASS; resumed_original_request unavailable |
| A01-SEM-07 | PASS | PASS |
| A01-SEM-08 | PASS | PASS |
| A01-SEM-09 | PASS | PASS protection; acknowledgement copy remains [E] |
| A01-SEM-10 | PASS | PASS |
| A01-SEM-11 | PASS | PASS |
| A01-SEM-12 | Measured PASS; optional unavailable | Same; question_repeated not measured |
| A01-SEM-13 | PASS | PASS |
| A01-SEM-14 | PASS | PASS |
| A01-SEM-15 | FAIL: current self death wish | PASS |
| A01-SEM-16 | FAIL: present third-person predicate | PASS |
| A01-SEM-17 | FAIL: own signal with third-party mention | PASS |
| A01-SEM-18 | PASS | PASS |
| A01-SEM-19 | FAIL: ordinary preference under uncertainty | PASS |
| A01-SEM-20 | PASS | PASS |
| A01-SEM-21 | PASS | PASS |
| A01-SEM-22 | FAIL: current affirmative after denial | PASS |
| A01-SEM-23 | FAIL: inferred state and adaptation change | Base PASS; optional FAIL remains, A03 out of scope |
| A01-SEM-24 | PASS | PASS |
| A01-SEM-25 | PASS | PASS |
| A01-SEM-26 | PASS | PASS |
| A01-SEM-27 | PASS within supplied alternatives | PASS alternatives; editorial [E], not frozen |
| A01-SEM-28 | PASS | PASS |

### Adapter boundaries and reproducibility

`tools/test-sabik-a01-supplemental.js` runs the actual local Core, data and
unchanged S0, not a model of their answers. It checks the original JSON hash,
reports each step's observed values and retains mismatches in the JSON output.
Classification/protection use the real S0 snapshot; subject uses the actual
detector/response metadata. Retrieval and classifier calls are instrumented.
`ordinary_action_executed` measures actual session preference changes, not an
unimplemented UI command executor. `inferred_state_changed` and
`adaptation_changed` are measured, not guessed or treated as unavailable.

Unavailable optional observations: question_repeated in SEM-01/02/12 (this
Core/S0 runner does not observe DOM presentation or live-region repetition),
and resumed_original_request in SEM-06 (font-size command replay is not exposed
by this adapter). SEM-06 risk_phrase_reevaluated is instrumented and passes.
No DOM behavior is certified by this supplemental runner. The separate real
browser regression includes the new A01 families and explicit panel controls.

Editorial [E]: second non-resolutive question limit (SEM-02), retraction
acknowledgement copy (SEM-09), and the normal/uncertain choice for task-qualified
exhaustion (SEM-27) are not decided by code. SEM-27's existing uncertain result
satisfies the supplied alternatives; this does not approve that editorial choice.

```text
node tools/test-sabik-a01-supplemental.js --cases <original-external-A01_SEMANTIC_SUGGESTED_CASES_V1.json> --out <external-report.json>
node tools/test-sabik-a01.js
node tools/test-sabik-a01-browser.js
```

For dist browser tests set A01_WEB_ROOT=dist; NODE_PATH points to the installed
Playwright runtime. All evidence is outside the repo in
`FARO 3/W1-A01-EVIDENCE-20260921/claude28/`, including exact baseline
`before-56c601c5.json` and corrected `after.json`. Reports record HEAD and any
uncommitted runtime diff, so pre-commit evidence is not mislabeled as a clean SHA.
The frozen 14-case development mirror remains unchanged and external as below.

### Supplemental revision regression

Environment: Windows, Node 24.19.0, Python 3.12.14, Chrome 153.0.8010.53.

| Suite | Result |
| --- | --- |
| Unmodified frozen 14-case development mirror | 14/14 |
| Own A01 Core/S0 | 154/154 |
| Own A01 browser source / dist | 29/29 each |
| Unchanged S0 / V7 / S4 unit | 146/146 / 28/28 / 87/87 |
| Unchanged S1 source / dist | 37/37 + 53/53 extra checks each |
| Unchanged S4 browser source / dist | 19/19 each, storage 4/4 included |
| Unchanged accessibility closure | A11Y_CLOSURE_PASS |
| Full Windows build | exit 0, 1650 public files |
| git diff --check | PASS |

The first build attempt failed with the pre-existing Windows/OneDrive ReadOnly
directory WinError 5 during dist replacement. After verifying the generated
paths and clearing only their directory ReadOnly attributes, the full second
build passed (build-final.log). No scripts or protected hashes were changed.
No Linux result is claimed for this revision. S1 results are automated
regressions, not new manual/screen-reader certification or a reopening of S1.

Independent QA must run again on the final published HEAD; neither this corpus
nor the local 14-case mirror grants independent acceptance.

Reversal: revert only this additional commit to return to 56c601c5, including its
seven reproduced A01 supplemental failures. No migration or persisted data.
History is preserved without rebase or force-push. PR #212 remains draft.
NO MERGE / NO DEPLOY.

## Historical R2 correction (56c601c5)

Authorization: ORDEN_CODEX_W1_A01_R2_CORRECCION / DEC-020. This revision adds
one commit after audited `a6c4e1b946a36940194e8c44e2d98838038fcefc`; it does not
rewrite that history. The independent verdict on that SHA remains
`A01_QA_BLOCKED` (Linux run 35620965664, candidate 8/14, baseline 4/14).

Two causes explain the six failures, not six independent patches:

- QA-01/02/03/05/07: the detector lacked present first-person doubt about
  continuing, so S0 never received RISK_UNCERTAIN. Once it does, the unchanged
  clarification, affirmative/negative, neutral-turn and error/retry transitions
  provide the required continuity.
- QA-14: third-person reports were always discarded. Present affirmative
  statements about another person's risk now propose RISK_CONFIRMED without
  treating that person as the user or asking the personal safety question.

The bounded grammar combines optional present-time/first-person markers,
`no se|dudo`, `si`, `puedo|quiero`, `seguir|continuar` and optional `asi`.
Clauses must finish there or with a current-time modifier. Explicit first-person
risk denial excludes this new ambiguity rule. Task completions, past tense,
informational prefixes and quotations do not match it. Quotations are masked
before clause splitting, including punctuation inside quoted text.

Third-person grammar requires a singular personal referent and an affirmative
present predicate over the existing risk vocabulary, optionally reported with
`dice|explica|afirma que`. Negated, past, fictional and informational constructions
are not equivalent predicates. Current personal risk takes precedence over a
third-person report or quoted text in the same input. This is deliberately not
a general Spanish parser, diagnosis model or open clinical vocabulary.

Scope: risk.js, response.js, sabik-page.js, both own A01 tests and this document.
The small response/page delta is necessary to preserve subject at the first
accepted worker event (including interruption by pause), instead of first
rendering an empty self-risk projection. `plan.subject` is response metadata
only: it never sets or clears S0 Safety. It persists through ordinary protected
turns but not a reset of conversational context. Third-person/unknown protected
responses retain existing user cognition rather than inferring it from another
person. Legacy single-turn response calls also preserve third-person attribution.
The personal-risk policy, sabik-state.js and all intensity controls are unchanged;
this does not claim to solve the broader A03 coupling.

The prior development assertion that a present third-person risk report stays
normal was replaced with stronger positive assertions required by R2: protection,
third_person subject, no personal question, unchanged user cognition, and zero
ordinary retrieval. Quotation/negation/information contrasts remain tested.

### R2 executed evidence (development, not independent acceptance)

Environment: Windows, Node 24.19.0, Python 3.12.14, Chrome 153.0.8010.53.

| Suite | Result |
| --- | --- |
| Frozen 14-case development mirror | 14/14 (8/14 reproduced before editing) |
| Claude 28 suggested_not_frozen supplemental | NOT RUN: file not supplied/found; requested again |
| Own A01 Core/S0 | 120/120 |
| Own A01 browser source / dist | 24/24 each |
| Unchanged S0 / V7 / S4 unit | 146/146 / 28/28 / 87/87 |
| Unchanged S1 source / dist | 37/37 + 53/53 extra checks each |
| Unchanged S4 browser source / dist | 19/19 each, storage 4/4 included |
| Unchanged accessibility closure | A11Y_CLOSURE_PASS |
| Full Windows build | exit 0, 1650 published files |

The mirror uses the four unmodified blobs from freeze
418740e858397008aa709b0fcf22589fbc20a02f outside this branch, plus the unmodified
runtime/S0 adapter from QA execution commit
33fbaebee2d2c7793ca0212780145195d0f176e0. Its `sabik` directory points to this
candidate. The adapter's subject projection is simplistic; our own unit and
browser tests additionally assert the real detector/plan subject and cognition.
No QA scenario, expectation, adapter or runner was changed. The runner's printed
`A01_INDEPENDENT_CASES_PASS` is its literal output, NOT an independent verdict
for this development execution. Agent 1 must revalidate the published SHA.

Mirror commands from its separate directory:

```text
node tests/specs/sabik/validate-a01-safety-gate-v1.mjs
node tests/specs/sabik/run-a01-safety-gate-v1.mjs --adapter tools/a01-candidate-212-independent-adapter.mjs
```

Other commands are listed below. Evidence is outside the repository under
`FARO 3/W1-A01-EVIDENCE-20260921/r2/`. Two build attempts hit the existing
Windows/OneDrive ReadOnly-directory WinError 5 during dist replacement. After
checking generated paths and removing only directory ReadOnly attributes, a
complete third attempt passed (`build-final.log`). No scripts or editorial
hashes were altered; no new Linux result is claimed.

Limitations: the actual 28-case Claude file remains unavailable, so no
supplemental PASS/FAIL counts or full R2-ready marker are claimed. Editorial [E]
items remain pending. In particular the pre-existing task-qualified exhaustion
rule is retained, not newly approved or frozen in tests by R2. No resources,
human service, copy, data, index, S0, A03, B3, voice or deploy changes.

Revert only the R2 commit to return to audited a6c4e1b9, with its known six gate
failures; do not rewrite either SHA. PR #212 stays draft. NO MERGE / NO DEPLOY.

## Historical record: a6c4e1b9 (superseded by R2 above)

The following sections record the previous candidate, its scope and evidence;
the supplemental section above is authoritative for the current correction.

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
