# S4: context, corrections and optional-data degradation

R0: `S4_GATE_BLOCKED_R0`, reviewed at `e5cc71c5f34554d1c1c88dc825c57ec5829698d9`.
R1 is ready for independent review only after the exact-head Linux job succeeds.
The PR records that SHA and its evidence; this document does not authorize release.
Issue: #153. Branch: `sabik/s4-conversation-corrections`. Target: `sabik-preview`.
Starting commit: `96ebf38a535fa287f32fee8c7957ede39933365c`.

## Scope

The existing Core facade and browser controller retain their entry points. S0,
the browser adapter, risk detector, CSS, hologram, editorial datasets and index
are unchanged. HTML changes only add the three requested response controls and
an optional-data notice/retry button inside the existing Sabik panel. The home,
its source order and `noindex` remain unchanged.

IGW-17 was delivered first in issue #191. This implements S4 only. It does not
open S3 (editorial safety approval required), S5 or S6, or authorize deployment.

## Session continuity

`session.js` owns the in-memory current need, topic query, active concepts, last
renderable plan, explicit vetoes, rejected fragments/types and asked questions.
Followups such as "y eso", "y que hago despues", "dime mas" and "puedes explicarlo"
reuse only the current topic and non-rejected concepts from this session.
An explicit topic change or a new non-referential query replaces the active topic.
Explicit concept negations remove vetoed concepts from active context. Asking an informational
question does not silently reopen a veto. A followup without a referent asks for
the topic, or reports insufficiency if the person disabled questions.

These are deterministic, bounded phrase rules, not general language understanding.
They do not resolve arbitrary multi-person pronouns, irony or safety negation;
those cannot be certified by this delivery. No new concepts or index scores are
added to compensate for S6's missing functional metadata.

There is no conversation persistence, remote inference or background message
submission. Reload creates a new session. Pause/collapse/resume and explicit reset
retain their S1 semantics; generation guards discard canceled results. Session and
plan inputs are copied, never mutated. Optional-data caches contain only site data.

## Distinct operations

| Request | Effect |
| --- | --- |
| First negative statement | Ordinary query with scoped explicit concept veto; no invented previous answer |
| Explicit correction | Retires the named route and, if supported, includes evidence for the replacement |
| No es esto | Records the shown response ID and evidence, preserves active concepts/topic, waits for correction or another route |
| Rejection of a clarification | Rejects the response type, not either concept |
| Buscar por otra via | Rejects shown fragments; keeps the topic/concepts and looks for another supported fragment |
| Explicamelo de otra forma | Selects a different relevant verbatim sentence from the same source, or explicitly says none is available |
| No me preguntes | Suppresses ordinary clarification decisions; does not reject concepts or shorten text |
| Dame una opcion | Caps the existing answer/evidence at one; for a pending clarification obtains one supported option |
| Mas corto | Reuses the last plan and sources without retrieval; removes the situational preamble, never changes intensity or max options |

Controls are also recognized as standalone text, including accented input after
normalization. `applyResponseControl(session, plan, control, data)` returns a new
`{session, plan}`. `registerPlanRejection` keeps its legacy call signature, with
explicit `fragment` and `response_type` reasons. Explicit concept negation is
recorded separately with `last_rejection.scope = "concept"`.

R1 uses deterministic session-local response IDs. Rejected answers are recorded
in `rejected_response_ids`/`rejected_responses`, never in `rejected_concepts`.
Retrieval excludes their shown fragments, not their concepts. This deliberately
conservative exclusion can exhaust sources sooner than a sentence-level rejection;
then Sabik reports insufficiency instead of repeating the same evidence. A rendered
answer comparison also blocks duplicates stored under different fragment IDs. Followups
after rejection retain their referent. Prepositional followups also retain their
context modifier, for example `trabajo` in `Y en el trabajo`.

Shortening does not invent an editorial summary; an already minimal direct
excerpt may remain the same length. Another explanation is an alternate excerpt,
not generated prose. When alternatives are exhausted, the result is insufficiency,
not the rejected answer again. Ordinary controls cannot rewrite existing risk
or ambiguous-risk content; full safety handling remains S3's gate.

Question decisions honor the session policy, max-options cap, previously asked
question IDs and response-type rejection. A high question threshold uses a narrower
ambiguity gap (10 instead of 25). The legacy risk/response modules otherwise keep
their semantics; no general retrieval ranking change is included.

## Loading and retry

`loadData(paths, previous?)` requires concepts and the fragment index. Relations,
actions, questions, resources, procedures and corpora degrade independently.
Each entry in `data.availability` has `required` and one of:

- `available`: valid data with publicable items;
- `editorial_absence`: valid data with no publicable items;
- `resource_unavailable`: missing path or HTTP 404;
- `technical_error`: failed request, invalid JSON or invalid collection shape.

An empty required index is editorial absence, not an exception. A valid index with
no supported answer yields `plan.outcome = "insufficient_information"` instead.
Required transport/schema failures throw an error with `code` and `dataset`;
the UI retains the entered text and offers retry. Failed loads never change the
conversation. Optional failure shows a separate support note while search works.

Retry reuses successfully loaded datasets and reloads only unavailable/failed
ones. It neither reloads successful empty editorial collections nor pretends they
contain information. A required-load retry uses the failed input, not an older
successful query. A canceled result cannot repaint notices or responses.

## Verification

Commands from the worktree root:

```text
node tools/test-sabik-s4.js
node tools/test-sabik-s4-browser.js
node /path/to/unchanged-qa0/tests/specs/sabik/run-s3-s4-qa0.mjs --phase S4 --adapter ./tools/sabik-s4-qa0-adapter.mjs
node tools/test-sabik-machine-s0.js
node tools/test-sabik-page-v7.js
node tools/test-sabik-a11y-closure.js
node tools/test-sabik-s1.js
python scripts/build_site.py
```

Browser tests require Playwright resolvable through `NODE_PATH` and installed
Chrome (`channel: chrome`). Set `S4_EVIDENCE_DIR` and `S1_EVIDENCE_DIR` outside the
repository for screenshots/results. `S4_WEB_ROOT`/`S1_WEB_ROOT` may point at `dist`.
Only local requests are allowed by the browser runners; the site's CSP is served.
The S4 unit fixture is synthetic and embedded in the runner, never in runtime/dist.

QA0 #187 is checked out separately at `96ace61de17108e31942d990cde79f3d1690c47a`.
Its runner, gates, fixtures and expected values are unchanged. The adapter only
reads session/input, replays the real Core with synthetic non-editorial evidence,
and projects runtime observations. Browser-backed storage/retry/reload observations
run the actual page, scripts and dataset loader. `S4_WEB_ROOT=dist` selects built
modules as well as the built page. S4-I01/I02 remain informational, without scores.

The browser probe starts with an empty context, submits a unique marker and several
turns, reads all local/session storage, cookies (including HttpOnly) and IndexedDB
databases/stores, then reloads and inspects again. It never clears storage. Separate
canaries deliberately write a marker to all four stores and verify that the same
inspection detects each leak. JSON evidence includes raw snapshots and the marker,
concepts, text, evidence and context keys searched. Retry is exercised through the
real button; an outstanding request released after reset must not repaint a result.

S1 was already integrated with its coordinated gate. This change checks only its
regression suite and the S4 controls' names, focus, keyboard activation, tab/reading
order, reflow, disabled and hidden states. New asynchronous S4 controls preserve
focus using `aria-disabled` while their existing handlers prevent reentry; pause
still uses native disabled. A successful retry returns focus to the input only if
its disappearing button had focus and no other action moved it. No S1 gate is
reopened or described as globally pending. No new custom widget needs a separate
manual interaction protocol; these tests do not claim a fresh screen-reader audit.

`.github/workflows/sabik-s4-r1.yml` tests the PR head (not a merge ref) on Linux,
with read-only permissions, two separate checkouts and no deployment steps. It
records OS, Node, Python, Chrome and exact HEAD, runs S4/unit/browser/storage/QA0,
S0, V7, S1 and the complete build, then repeats browser/QA0/S1 against dist. Reports
stay outside both checkouts; no test or fixture is shipped. The 49 MB guard is per
file and reports total package bytes separately. Windows results are supplementary.

Local results and exact commit/tree are recorded in the draft PR. Existing QA
tests are not modified. External failure/resource tests are simulated, not calls
to public emergency services or third-party audio services.

## Rollback

Revert the R1 commits after `e5cc71c5` in reverse chronological order to restore
the reviewed R0, or also revert R0 to remove S4. Both choices retain the previous
integrated S1/S0. No migration,
storage cleanup, editorial change or external service rollback is needed.
