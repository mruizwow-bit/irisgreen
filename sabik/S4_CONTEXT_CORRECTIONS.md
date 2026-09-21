# S4: context, corrections and optional-data degradation

Delivery: `SABIK_S4_CONTEXT_CORRECTIONS_READY` (implementation for review, not release approval).
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
Corrections remove rejected concepts from active context. Asking an informational
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
| No es esto | Rejects the shown hypothesis, removes it from active context, waits for correction |
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

Local results and exact commit/tree are recorded in the draft PR. Windows build
success is not a Linux/Netlify certification. Screen-reader hardware/manual gates
from S1 remain manual; automated passes do not claim to replace them. Existing QA
tests are not modified. External failure/resource tests are simulated, not calls
to public emergency services or third-party audio services.

## Rollback

Revert the single S4 commit on this branch/target after review. No migration,
storage cleanup, editorial change or external service rollback is needed.
