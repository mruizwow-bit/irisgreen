# AXIOMA · ECLIPSES R02 · FINAL A11Y RETEST PASS · 04/10/2026

Gate:
`AXIOMA_ECLIPSE_R02_A11Y_PASS`

Producto auditado:
- main product snapshot: `ca2f444f45dc3f08e9974996220eaae067275ec9`
- último commit funcional: `Motor: gate eclipse arbitrary map point keyboard parity`

Ejecución Axioma aislada:
- branch QA: `axioma/a11y-retest-eclipse-final-20261004`
- QA commit: `8438326e5222bf5e8e5641f03d80c75bbdce7846`
- workflow run: `37183723530` · SUCCESS
- artifact: `axioma-eclipse-r02-final`
- artifact ID: `11296535346`
- digest: `sha256:fd70644b45fd4b4a736513b9189291ddf037880656b5f736cb488ca9edfd4a86`

## PASS

- ES/EN.
- 320 / 390 / 1440.
- DARK / LIGHT contrast computed >= 4.5 for explorer title/copy.
- Figcaption contrast >= 4.5.
- Text 200% without horizontal overflow or explorer clipping.
- Forced-colors.
- 6 canonical types.
- 2 didactic sequences.
- Canonical alt localized.
- Sequence alt exposes phase order.
- REDUCED/OFF use discrete phase steps rather than continuous playback.
- Map arbitrary-point selection has keyboard parity:
  - SVG focusable;
  - ArrowUp/Down/Left/Right;
  - Home / End;
  - Enter applies selected point;
  - aria-keyshortcuts and localized instructions.
- EXPLORE → LOCATE → REVEAL preserved.
- 0 external requests.
- 0 HTTP errors.
- 0 JS errors.

Manual artifact review:
- `eclipse-r02-types-390.png` contrast/readability corrected.
- `eclipse-r02-types-1440.png` contrast/readability corrected.
- No visual rerender of canonical assets required.

## Scope

This gate is the Axioma accessibility QA gate for this approved integration surface.
It is not a claim of full-site WCAG conformance, legal compliance, or external certification.

Next:
`ASTRA_INTEGRATED_GATE → HUMAN_QA_MARÍA`.
