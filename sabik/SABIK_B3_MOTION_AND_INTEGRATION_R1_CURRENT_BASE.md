# SABIK_B3_MOTION_AND_INTEGRATION_R1_CURRENT_BASE

**Estado:** `SABIK_B3_MOTION_AND_INTEGRATION_R1_CURRENT_BASE_READY`  
**Base exacta:** `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`  
**Issue:** #196  
**NO MERGE · NO DEPLOY**

## Fuentes congeladas

- #181 → `742e502802cdc9e3e7b154ddbb8493493c903898`
- #182/H1 → `e5f70cba76a4414527c10b0fbecfd549a7390e66`
- #163 → `851e6c17185e76ffbb4f4b5ab34fe5eb9fd9dd68`

## R1

R1 reubica B3 sobre el **Sabik S4 vigente**, en lugar de usar el preview anterior a S4.

Incluye:
- ID-14 Motion B3;
- ID-15 integración real;
- BR-04 guía de marca;
- ACC-06 controles cognitivos;
- ACC-07 tres niveles de movimiento;
- ACC-08 UI/contrato de voz sin motor;
- ACC-09 lectura ajustable;
- ACC-10 densidad.

## Assets

15 derivados runtime 64×64, uno por presencia/estado.  
`web_confirmar.webp` queda normalizado a 64×64.  
`ASSET_MANIFEST.json` es la evidencia de hashes/dimensiones.

## Preservación S4

`S4_PRESERVATION_LOCK_R1.json` congela 20 blobs de S0/S1/S4/QA0/storage respecto de la base.

B3 no escribe en Core ni altera la semántica de S0.

## QA requerido

El workflow R1 ejecuta:
- S0;
- S1;
- S4 unit;
- S4 browser + storage;
- QA0 S4;
- B3 Motion;
- B3 integración;
- accesibilidad cognitiva;
- B3 browser;
- build Linux;
- las comprobaciones fuente y dist donde aplica.

H1 sigue pendiente y no se fabrican resultados humanos.

**NO MERGE · NO DEPLOY.**
