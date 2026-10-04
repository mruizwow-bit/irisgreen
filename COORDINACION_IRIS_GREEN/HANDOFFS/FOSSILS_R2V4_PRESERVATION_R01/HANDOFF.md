# ATLAS · FÓSILES R2v4 · PRESERVACIÓN Y SEPARACIÓN

Date: 2026-10-04
Owner: Atlas A1

Marker:
`ATLAS_FOSSILS_R2V4_PRESERVATION_SEPARATION_PASS`

Status:
`PRESERVED_KEEP_SOURCE__NOT_RUNTIME_READY_NOMINAL_QA_PENDING`

## Canonical source to preserve

Library source:
`FOSILES_PILOTO_R2v4_PARA_SUBIR_3.zip`

Bytes:
`2132654`

SHA-256:
`e321b32d4d2a9d16c4df6a99da7e956543ceba5b0666919e6b8e48adac7a4ff1`

Internal version manifest:
`fosiles-r2/MANIFEST.sha256`

Manifest SHA-256:
`26c2c621bf7be16135ca692a8c90eef9b05554ac3bbf1e5910ad5df744addfdc`

Manifest verification:
- 78 hash entries;
- 78/78 recomputed PASS;
- 0 missing hashed entries;
- 0 mismatches.

Companion evidence:
- `FOSILES_R2v4_CAPTURAS_3.zip`
  - SHA-256: `38e274848e0e8b3d75b5a2083b9ff1bdb90237071df9194fbe7dfbb45ea71688`
- `FOSILES_R2v4_GOBERNANZA_3.md`
  - SHA-256: `a2d135f02dc2cc278899a65b1c16f319e94316babb3ccdb5d245c350d0fe403c`
- `FOSILES_R2v4_INFORME_3.md`
  - SHA-256: `66b7515e75246c7a6150a6500a9f0610ceeefa3427a951ca4c2ca790311c673a`

## R2v3 separation

Historical source:
`FOSILES_PILOTO_R2v3_PARA_SUBIR_1.zip`

SHA-256:
`6339303a7ff36ee43d82aedcd4119539cc2daadf7e568183a98203ebfd529caf`

R2v3 is preserved as history only:
`HISTORICAL_SUPERSEDED_DO_NOT_INTEGRATE`

Atlas comparison:
- 73 file entries byte-identical between R2v3 and R2v4;
- R2v4 adds 6 governance/policy artifacts;
- 7 shared files change in R2v4, including report/provenance/contract QA outputs;
- R2v4 manifest has 78 hash entries versus 74 in R2v3.

R2v4-only files:
- `fosiles-r2/GOBERNANZA.md`
- `fosiles-r2/gobernanza/comprueba_politicas.py`
- `fosiles-r2/gobernanza/politicas.json`
- `fosiles-r2/gobernanza/prueba_de_politicas.py`
- `fosiles-r2/qa/POLITICAS.json`
- `fosiles-r2/qa/PRUEBA_POLITICAS.json`

Therefore R2v3 and R2v4 must never be merged by filename or treated as interchangeable packages.

## Expansion separation

The existing R2v4 product and the new F01–F05 expansion are separate lineages.

Rules:
- R2v4 = KEEP source/product lineage;
- R2v3 = historical only;
- F01+ = new expansion after its own factual brief + visual gate;
- no F01 assets/data are to be injected into this preserved R2v4 package;
- no historical R2v3 asset is to replace an R2v4 asset.

## Known integration gate

This preservation PASS is **not** a publication/runtime PASS.

The post-recovery audit already records a nominal QA defect around the T. rex finding capture/selection. That defect belongs to the repair/integration gate; Atlas does not rewrite runtime or art to hide it.

Therefore:
`FOSSILS_R2V4_RUNTIME_PACKAGE_READY = NOT_EMITTED`

Motor/Astra must consume the preserved R2v4 source and resolve the scoped nominal/integration issue without rebuilding the art/product.

## Atlas boundary

No pixel changes.
No runtime changes.
No main.
No deploy.
No R2v3 merge.
No F01 merge.
