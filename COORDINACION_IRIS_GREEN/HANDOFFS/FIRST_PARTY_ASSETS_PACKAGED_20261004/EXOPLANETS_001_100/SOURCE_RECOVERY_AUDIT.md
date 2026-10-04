# ATLAS · EXOPLANETAS 001–100 · AUDITORÍA DE RECUPERACIÓN DE FUENTE B01/B02

Classification: INTERNAL PROJECT EVIDENCE
Date: 2026-10-04
Owner: Atlas A1

Target gate:
`EXOPLANETS_001_100_PACKAGED_READY_FOR_RUNTIME`

Current gate:
`BLOCKED_B01_B02_CANONICAL_BINARY_SOURCE_REQUIRED`

Audit marker:
`ATLAS_EXOPLANETS_B01_B02_SOURCE_RECOVERY_AUDIT_CONFIRMED`

## 1. Conclusion

Atlas has completed a second source-recovery pass before accepting the B01/B02 blocker.

Result:

`B01_B02_CANONICAL_CLEAN_MASTER_BYTES_NOT_LOCATED_IN_ACCESSIBLE_AUTHORITATIVE_SURFACES`

The missing range remains:
- B01 → 001–010
- B02 → 011–020

This audit does **not** state that the masters never existed.
It states that the canonical clean-master bytes/package and an authoritative final mapping were not recoverable from the project surfaces currently accessible to Atlas.

The final 001–100 runtime gate must therefore remain blocked.

## 2. Authoritative requirements

The active production contract is:

`EXOPLANETS_100_MASTER_PIPELINE_LOCKED`

Required characteristics:
- one planet per master;
- no baked text/data/UI;
- transparent background;
- sRGB;
- representation, not observation;
- scientific assignment by physics rather than aesthetic similarity.

Therefore Atlas may not backfill 001–020 from an earlier infographic, contact sheet or unassigned generic visual.

## 3. Surfaces checked

### Library · canonical Exoplanets visual folder

Exact recursive listing:
`/Iris Green/First Party Visual/Exoplanets/`

Observed:
- `Visual Library Batch 10/`
- 10 generic normalized masters;
- its manifest, QA, alpha QA, contact sheet and ZIP.

Not observed:
- canonical assigned B01 package;
- canonical assigned B02 package;
- final B01/B02 assignment manifest;
- clean final planet-specific master set 001–020.

### Library · Atlas runtime handoff

Exact recursive listing:
`/Iris Green/Handoffs/Atlas/FIRST_PARTY_ASSETS_PACKAGED_READY_FOR_RUNTIME/EXOPLANETS_001_100/`

Observed:
- `EXOPLANETS_021_100_RUNTIME_PACKAGE_PARTIAL_R01.zip`
- `HANDOFF_BLOCKER.md`

No hidden B01/B02 runtime source package is present in that folder.

### Library · production chronology

A recursive date-bounded listing covering the active production window on 2026-10-03 found:
- B03 canonical ZIP;
- B04 canonical ZIP;
- B05 final corrected ZIP;
- B06 canonical ZIP;
- B07–B10 canonical/final packages;
- several early exoplanet compositions / infographic-style images;
- generic individual planet visuals.

It did not surface:
- `EXOPLANETS_BATCH_01*.zip`;
- `EXOPLANETS_BATCH_02*.zip`;
- equivalent canonical B01/B02 final package names or manifests.

### GitHub

Reviewed:
- canonical Intereses order in issue #323;
- asset/evidence tracking in issue #370;
- Exoplanets-related branches;
- Exoplanets-related commits/searchable project records;
- Atlas packaging branch.

The canonical order confirms that B01–B10 / 001–100 are considered closed by physics and requests one reproducible runtime package.

The R59 final control marks:
- B01 = `CLOSED_PRIOR`
- B02 = `CLOSED_PRIOR`

But no canonical B01/B02 binary package, final clean-master manifest, or authoritative 001–020 mapping was recovered from GitHub.

## 4. False substitutes explicitly rejected

The Library contains earlier images with titles such as:
- “Exoplanetas: Diez Mundos Lejanos”;
- “Infografía de diez exoplanetas reales”;
- “Biblioteca visual de exoplanetas”;
- other 10-world compositions/contact outputs.

Those are not sufficient provenance for runtime master assignment.

Atlas will not:
- crop or split a contact sheet;
- infer which generic world corresponds to which numbered exoplanet;
- rename an unassigned generic visual into an assigned master;
- regenerate B01/B02;
- alter approved pixels;
- treat an infographic as a clean transparent runtime master.

## 5. Partial package independent verification

Package:
`EXOPLANETS_021_100_RUNTIME_PACKAGE_PARTIAL_R01.zip`

Library:
`/Iris Green/Handoffs/Atlas/FIRST_PARTY_ASSETS_PACKAGED_READY_FOR_RUNTIME/EXOPLANETS_001_100/`

SHA-256:
`66155ef5c32ffb00b3b9af64cd1126e5a74596317a327933808d5baf2d6a74ae`

Independent recheck:
- ZIP entries: 115;
- `SHA256SUMS.txt`: 114 entries;
- 114/114 internal hashes recomputed = PASS;
- runtime PNG masters = 77;
- 77/77 = 1536×1536;
- 77/77 = PNG RGBA;
- 77/77 = embedded ICC/sRGB;
- 77/77 alpha extrema = 0–255;
- pixel edits/re-encode by Atlas = 0.

Coverage:
- `PACKAGED` = 77;
- `HOLD_NO_SAFE_VISUAL_ASSIGNMENT` = 3;
- `BLOCKED_MISSING_CANONICAL_B01_B02_BINARY_PACKAGE` = 20.

Scientific HOLD remains:
- 032 · 55 Cnc B b
- 033 · 55 Cnc B c
- 040 · 61 Vir b

These HOLD records are not packaging defects and must not be filled by visual guesswork.

## 6. Final-patch preservation

The partial package preserves the accepted final patches:
- B07 → manifest self-hash fix;
- B08 → BD-06 1339 b controversial-status metadata;
- B09 → BEBOP-4 AB b mass-limit semantics;
- B10 → final PASS unchanged.

The package also preserves:
`ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY`

## 7. Unblock condition

The final gate can be completed only when Atlas receives one of these authoritative inputs:

1. canonical final B01 and B02 packages containing the clean masters and assignment metadata; or
2. an exact authoritative location for those packages; or
3. clean original master bytes plus an authoritative final 001–020 assignment manifest sufficient to prove mapping without inference.

After that:
`COPY BYTE-IDENTICAL → VERIFY → HASH → APPEND CONSOLIDATED MANIFEST → FINAL PACKAGE → GATE`

## 8. Downstream state

Until the unblock condition is satisfied:

`EXOPLANETS_001_100_PACKAGED_READY_FOR_RUNTIME = NOT EMITTED`

Motor M6 remains blocked from consuming 001–100 as a complete asset package.

Allowed:
- preserve the verified partial package;
- continue unrelated workstreams.

Forbidden:
- runtime integration from guessed B01/B02 assets;
- main/deploy based on an incomplete 001–100 package;
- regeneration by Atlas;
- silent replacement of missing source bytes.

Marker:

`ATLAS_EXOPLANETS_B01_B02_SOURCE_RECOVERY_AUDIT_CONFIRMED`
