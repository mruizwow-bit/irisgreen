# R59 · EXOPLANETAS · B07–B10 · FINAL PATCH CLOSURE

Fecha: 2026-10-04
Owner: Senda · R59
Source review: #370 comentario 5967716428

Gate:
`EXOPLANETS_B07_B10_FINAL_PASS`

## Scope
Aplicados únicamente tres parches quirúrgicos sobre B07–B09.
B10 no requería cambios.
No se regeneró ningún master visual.

## B07
Patch:
`B07_MANIFEST_SELF_HASH_FIX`

Cambio:
- se elimina el propio `EXOPLANETS_BATCH_07_MANIFEST.json` de su lista `files[]`;
- esquema detached;
- manifest y ZIP regenerados;
- 10/10 masters byte-identical.

## B08
Patch:
`B08_BD061339B_CONTROVERSIAL_METADATA_FIX`

Objeto:
`77 · BD-06 1339 b`

Metadata añadida:
- `controversial_status = true`;
- `catalog_status = Confirmed Planet`;
- ES: `Estado: confirmado en el catálogo · señal discutida en la literatura`;
- EN: `Status: confirmed in the catalog · signal disputed in the literature`.

Fuente oficial verificada 2026-10-04:
NASA Exoplanet Archive.
El Archive muestra:
- Disposition = Confirmed;
- Controversial;
- nota: planet flagged as controversial (Simpson et al. 2022).

Solo metadata/UI/contact sheet.
10/10 masters byte-identical.

## B09
Patch:
`B09_BEBOP4_MASS_LIMIT_FIX`

Objeto:
`90 · BEBOP-4 AB b`

Se retira `8359 M⊕` como masa exacta.

Representación canónica del dato:
- preferido UI: `m sin i = 6643 ± 413 M⊕`;
- equivalente: `20.9 ± 1.3 M♃`;
- upper bound preservado: `M < 8359 M⊕` / `M < 26.3 M♃`.

Fuente oficial verificada 2026-10-04:
NASA Exoplanet Archive · Triaud et al. 2025.

Master 090 no se modifica.
10/10 masters byte-identical.

## Final QA
- B07 ZIP test = PASS;
- B08 ZIP test = PASS;
- B09 ZIP test = PASS;
- 30/30 masters byte-identical frente a los ZIP originales;
- manifests corregidos sin self-hash;
- visual policy = NO_RERENDER;
- scientific policy = `ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY`.

Final:
`EXOPLANETS_B07_B10_FINAL_PASS`.
