# W05_R1_QA_FREEZE_READY

Authorization: DEC-035 / DEC-034 / DEC-033 / DEC-014.

Mode: QA-only contractual freeze. Product/runtime changed files: 0.

Baseline product SHA:
`e48b51814afed825a92e83a2f6e51ee8a1c85e45`

Branch:
`qa/w05-r1-music-freeze-20260922`

## Frozen contract

The authoritative machine-readable contract is:
- `tests/specs/music/w05-r1-contract-v1.json`
- `tests/specs/music/w05-r1-fixture-v1.json`

It freezes F01-F20 from Astra's order.

Core acceptance target:
- 24 logical tracks for canPlayType probe `""`, `"maybe"`, and `"probably"`;
- all 24 original files preserved;
- source/dist retain byte identity of originals;
- no autoplay;
- opening the panel does not start playback;
- play/pause/stop-or-approved-equivalent/Escape/keyboard/focus;
- responsive 320/390/768/1440;
- accessible names and manual screen-reader gate;
- one source failure never deletes a logical track;
- no silent build transcode;
- codec is measured or literal UNKNOWN;
- provenance/evidence is recorded per track;
- local playback makes no third-party audio request;
- originals are never deleted.

## Provenance gate

The freeze does **not** require, create or authorize derived audio.

Current ledger status:
- VERIFIED_EXACT: 10
- PROBABLE_MATCH: 8
- VERIFIED_BY_AUTHOR_DURATION: 2
- URL_ORIGINAL_UNKNOWN: 4

Therefore:
`FREEZE_ALLOWED_DERIVATIVE_NOT_AUTHORIZED`

Tracks with unresolved original URL:
- Ambiente I
- Ambiente II
- Ambiente III
- Ambiente 4

A future implementation that wants to create a local derivative/fallback for a track without sufficient documentary provenance must STOP for provenance. This freeze does not upgrade probable/unknown evidence and gives no legal conclusion.

## Baseline behavior to reproduce

Current `assets/musica.js` executes the actual TRACKS filter:
- AAC probe `""` -> 15 visible logical tracks -> EXPECTED_BASELINE_FAIL against target 24.
- AAC probe `"maybe"` -> 24 -> EXPECTED_BASELINE_PASS.
- AAC probe `"probably"` -> 24 -> EXPECTED_BASELINE_PASS.

Current baseline has no explicit Stop control:
- baseline: EXPECTED_BASELINE_FAIL for the Stop part of F06.
- target: Stop or an explicitly approved equivalent.

## Re-run

Source:
```bash
node tests/specs/music/run-w05-r1-freeze.mjs --out=/tmp/w05-source.json
```

Build + dist:
```bash
python3 scripts/build_site.py
node tests/specs/music/run-w05-r1-freeze.mjs --dist --out=/tmp/w05-dist.json
git diff --check
```

The runner:
- executes the product's current ALL_TRACKS/AAC filter snippet in-memory;
- validates 24 logical source entries, 9 M4A + 15 MP3;
- validates all 24 baseline Git blob hashes and sizes;
- validates source originals are unchanged at QA HEAD;
- after build, validates dist copies hash-identically to originals;
- verifies QA branch changed paths are QA-only.

## Freeze discipline

The future Agent 4 candidate must be tested with the same F01-F20 contract.
No PASS is inherited from this baseline.
Any candidate HEAD/tree change requires a fresh exact-head run.

NO AUDIO EDITS.
NO TRANSCODE.
NO MP3 CREATION.
NO TRACK DOWNLOAD.
NO musica.js EDIT.
NO HTML/CSS EDIT.
NO MERGE.
NO DEPLOY.
