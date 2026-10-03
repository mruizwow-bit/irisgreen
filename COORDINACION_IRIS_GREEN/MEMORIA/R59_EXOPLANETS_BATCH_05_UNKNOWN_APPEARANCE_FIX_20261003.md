# R59 · EXOPLANETAS · BATCH 05 · UNKNOWN APPEARANCE FIX

Fecha: 03/10/2026  
Owner: Senda · R59  
Gate: `EXOPLANETS_BATCH_05_PASS_AFTER_UNKNOWN_APPEARANCE_FIX`

## Cambios

Rework SOLO:
- 41 · 61 Vir c
- 42 · 61 Vir d

KEEP byte-identical:
- 43 · 7 CMa b
- 44 · 7 CMa c
- 45 · 70 Vir b
- 46 · 75 Cet b
- 47 · 75 Cet c
- 48 · 8 UMi b
- 49 · 81 Cet b
- 50 · 91 Aqr b

## Contrato 41 / 42

Ambos siguen:
`UNKNOWN_APPEARANCE_REPRESENTATION`

La imagen comunica únicamente:
“planeta confirmado cuya apariencia no conocemos”.

No afirma:
- atmósfera;
- nubes;
- océanos;
- superficie rocosa;
- hielo;
- lava;
- anillos.

Diferencias visuales limitadas a:
- orientación de iluminación;
- contraste;
- gradiente tonal gris/azulado.

## Datos

Snapshot:
NASA Exoplanet Archive PSCompPars local · 24/09/2026.

Radio y Teq:
- `source` explícito;
- `status=composite`;
- en 61 Vir c/d la UI muestra `—` para no tratarlos como mediciones que fijen apariencia.

Regla:
`ASSIGN_BY_PHYSICS_NOT_AESTHETIC_SIMILARITY`

## QA

- 43–50 byte-identical: PASS
- 10/10 técnica: PASS
- 10/10 datos: PASS
- 41/42 unknown-appearance contract: PASS

Marcador:
`EXOPLANETS_BATCH_05_PASS_AFTER_UNKNOWN_APPEARANCE_FIX`
