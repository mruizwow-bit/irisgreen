# ATLAS · NIGHT SKY 88 · R03 · RUNTIME PACKAGING

Package gate: NIGHT_SKY_88_PACKAGED_READY_FOR_RUNTIME
General marker: FIRST_PARTY_ASSETS_PACKAGED_READY_FOR_RUNTIME

Source gate: NIGHT_SKY_CONSTELLATION_PIPELINE_R03_FINAL_PASS
Source ZIP SHA-256: 6606430fcc0cf732bb794d8d582bcb31b3e643ac76c96e241c74a8418264df47
Source commit: ca4250b3698ad764078eeab33427fa2dcb082a18

## Canonical runtime paths

- Masters: /img/intereses/cielo/constelaciones/r03/
- Data: /assets/data/cielo/constelaciones/r03/

Each constellation keeps a paired filename:
XX-Abbr.svg + XX-Abbr.json.

## Package contents

- 88 byte-identical SVG masters copied from the final approved ZIP;
- 88 byte-identical constellation JSON records;
- 9 byte-identical QA contact sheets;
- 9 byte-identical batch provenance records;
- consolidated runtime manifest;
- runtime SHA-256 list;
- preserved source QA / source master sums;
- license/provenance status.

## Immutability

Atlas did not modify geometry, labels, stars, edges, SVG bytes, JSON bytes or contact-sheet pixels.

## Integration handoff

Prisma/Motor may consume only the canonical runtime paths above.
QA contact sheets and provenance remain under COORDINACION_IRIS_GREEN/HANDOFFS and are not runtime artwork.

No runtime code was changed by Atlas.
No main/deploy.
