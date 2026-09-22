# W07_R1_QA_FREEZE_READY

Authorization: DEC-035 / DEC-037 / DEC-033 / DEC-014.

Mode: QA-only pre-implementation freeze. Product/build changed files: **0**.

Baseline:
`main@e48b51814afed825a92e83a2f6e51ee8a1c85e45`
tree:
`f493a47b84945679e30a0a299d9327949f333945`

## Source continuity note

The exact W07 report, Memory V51 and transverse normative frame were read directly.
The standalone Control V57 file was not separately present in the accessible Library snapshot; the later Control V58 contains the embedded **ASTRA LIVE V57** block and explicitly records:
- Agent2 = ACTIVE W07 QA freeze;
- W07 = 17 paths / freeze first;
- Version = V57;
- Memory = V51.

V58 does not alter the W07 scope and preserves that V57 state. This is recorded rather than pretending a standalone V57 object was read.

## Frozen W07 evidence

Authoritative report:
`W07_BUILD_HYGIENE_AUDIT_READY.md`
SHA-256:
`05c443d7116d635e81bf8060c42041165a05eb19a449f6c44ffaaf7435de4886`

W06 report:
`W06_LEGACY_LINKS_AUDIT_READY(1).md`
SHA-256:
`32d26ebf7b9b7137e88b6c58883cc6372b1ed3c68724744a5d1ea11a46597ef3`

Historical exact public artifact:
- artifact ID: `10680715155`
- name: `web-release-gate-r0`
- ZIP SHA-256: `a9c2c85531acfafbc41fa044e6b2c1b096624fe64f382087c9f6e32a8c1b82de`
- `artifact-base.json` SHA-256: `5aed685e967773379d803221283e30d13f13cb9da2ae984a5c27ae04e91e8404`
- 1,619 files
- 439,959,506 bytes

## Exact 17 public-exclusion candidates

1. `es/investigacion/_import/parte-01.xz.b64` · 18,000
2. `es/investigacion/_import/parte-02.xz.b64` · 18,000
3. `es/investigacion/_import/parte-03.xz.b64` · 18,000
4. `es/investigacion/_import/parte-04.xz.b64` · 18,000
5. `es/investigacion/_import/parte-05.xz.b64` · 3,376
6. `assets/muestras/luma/p01.jpg.b64` · 18,870
7. `assets/books/samples/luma-es/sprite.part1.txt` · 7,000
8. `assets/books/samples/luma-es/sprite.part2.txt` · 7,000
9. `assets/books/samples/luma-es/sprite.part3.txt` · 7,000
10. `es/intereses/catalogo.json` · 33,815
11. `en/interests/catalogue.json` · 33,815
12. `es/intereses/estrellas-constelaciones.json` · 11,465
13. `es/intereses/estrellas-tanda2.json` · 13,508
14. `es/intereses/videos-intereses.json` · 30,907
15. `assets/video-thumbnails/manifest.json` · 19,688
16. `img/juegos-coleccion/manifest.json` · 22,671
17. `assets/mulberry-rutinas/sources.csv` · 7,845

Frozen total:
`17 files / 288,960 bytes`.

The fixture binds every row to the exact baseline Git blob SHA-1.

## F01-F20

Machine-readable authority:
- `tests/specs/build-hygiene/w07-r1-contract-v1.json`
- `tests/specs/build-hygiene/w07-r1-fixture-v1.json`

The contract freezes:
F01 baseline 17 present; F02 future 17 absent; F03 source preserved;
F04 public media/licenses preserved; F05 Investigación `_import/**` source-only;
F06 QA manifests remain available before/pre-prune or outside publish;
F07 runtime data preserved; F08 React duplicate false-positives preserved;
F09 reproducible Linux build; F10 SHA-bound artifact manifests;
F11 W06 route checker on the same dist; F12 W04 publication contract not worse;
F13 privacy/storage not worse; F14 CSP/security headers not worse;
F15 `netlify.toml` remains unpublished; F16 no sensitive material introduced;
F17 artifact diff only authorized removals; F18 no W11 media conversion;
F19 `git diff --check`; F20 rollback documented.

## W04 bound contract

Accepted W04 candidate:
- PR #220
- HEAD `8104a46e48d5112286d55532bea8c082f5c42049`
- tree `9261cf46695d9846828944de83660d805b879bf5`

Publication/indexation invariant:
`1003 / 986 / 4 / 13 / 999`
for:
HTML / index,follow / noindex,follow / other-or-none / sitemap URLs.

## Important scope protections

Preserve:
- `es/intereses/cromos.json`;
- `es/investigacion/estudios-textos.json`;
- `es/recursos/juegos/juegos-120.json`;
- current Luma/Autismo `flip-*` parts;
- public licenses;
- all public books/PDF/audio/images/originals outside the authorized 17.

Do not deduplicate these byte-identical React pairs:
- `assets/games/react.production.min.js` + `assets/runtime/d949f1c3687aedad.js`;
- `assets/games/react-dom.production.min.js` + `assets/runtime/35f4f974f4b2bcd4.js`.

## Baseline rerun

```bash
python3 tests/specs/build-hygiene/run-w07-r1-freeze.py --phase source --mode baseline --out /tmp/w07-source.json

python3 scripts/build_site.py
python3 tests/specs/build-hygiene/run-w07-r1-freeze.py \
  --phase dist --mode baseline \
  --manifest-out /tmp/w07-manifest-1.json \
  --out /tmp/w07-dist-1.json

python3 scripts/build_site.py
python3 tests/specs/build-hygiene/run-w07-r1-freeze.py \
  --phase dist --mode baseline \
  --manifest-out /tmp/w07-manifest-2.json \
  --compare-manifest /tmp/w07-manifest-1.json \
  --out /tmp/w07-dist-2.json

# Run with the prepared Playwright/BeautifulSoup environment:
python tests/specs/build-hygiene/run-w07-r1-freeze.py \
  --phase gates --mode baseline --out /tmp/w07-gates.json

git diff --check
```

A future W07-R1 candidate must use the **same contract**, with mode `candidate`
and the frozen baseline manifest. Candidate mode permits only removal of the exact
17 paths: no additions and no changes to any surviving artifact path.

## Rollback contract

Rollback is publish-policy rollback only:
restore the previous build copy policy or republish the exact previous artifact.
Do **not** delete source files to roll back W07.

NO product/build implementation.
NO source deletion.
NO W04/W06 reopening.
NO W05/W02 changes.
NO merge.
NO deploy.
