# AXIOMA · CIELO V2 + 88 CONSTELLATIONS · RETEST STATUS · 04/10/2026

States:
- `AXIOMA_CIELO_V2_A11Y_RETEST_FAIL`
- `AXIOMA_CONSTELLATIONS_88_A11Y_RETEST_FAIL`

Product baseline tested:
`main@9c4ecd77804bf6eabed4a92d8303be71d45643e7`

Current main after Eclipse-only changes:
`ca2f444f45dc3f08e9974996220eaae067275ec9`

Git compare `9c4ecd... → ca2f444...` changes ONLY:
- `assets/ig-eclipses.css`
- `assets/ig-eclipses.js`
- `scripts/test_eclipse_canonical_r02_integration.py`

Therefore the Cielo/88 failure remains applicable to current main.

## Canonical rerun

Workflow:
`37182793081`

Rerun result:
FAIL again.

Exact Cielo case:
- locale: ES;
- width: 320;
- phase: default-text;
- label: `Osa Mayor`;
- scene left/right: `16 / 289`;
- label left/right: `227.359375 / 290.796875`;
- assertion tolerance permits right <= 290;
- actual remains ~0.80 px outside even after tolerance.

Assertion:
`label clipped horizontally`.

## Independent Axioma QA

Branch:
`axioma/a11y-retest-cielo88-eclipse-20261004`

Commit:
`f80d873fa64fe3f81cfc8ef674ae796c610e0806`

Run:
`37183556596`

### Cielo V2
FAIL, same exact 320 condition.

### Full-sky 88
FAIL.

Exact 88 case:
- locale: ES;
- width: 320;
- phase: r03-default-text;
- label: `Osa Mayor`;
- scene left/right: `16 / 289`;
- label left/right: `229.53125 / 292.96875`.

Thus:
`CIELO_R03_88_LABEL_SAFE_ZONE_FAIL`

## What already remains PASS

- prior NONE/no-motion fix;
- textual LOCATE alt/azimuth/direction;
- keyboard/zoom/touch architecture;
- B00 KEEP;
- R03 masters KEEP;
- no R04.

## Required patch

Only label placement:
- clamp using the actual containing block used by `.skyv2-labels`;
- guarantee final measured bounding box is entirely within scene safe-zone at 320;
- preserve exclusion of intro/question;
- rerun default + 200% text on 320/390/1440;
- run base Cielo and full-sky 88 independently.

No redraw.
No constellation geometry changes.
No master changes.
No deploy.

After patch:
1. immediate Axioma Cielo retest;
2. immediate Axioma 88 retest;
3. only after closure, resume Axioma QA package-by-package, as ordered by María.
