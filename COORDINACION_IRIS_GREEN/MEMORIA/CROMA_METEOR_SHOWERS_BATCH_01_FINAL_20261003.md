# CROMA · METEOR SHOWERS · BATCH 01 FINAL 10 · 2026-10-03

Estado: `METEOR_SHOWERS_BATCH_01_FINAL_10_PASS_READY_FOR_REVIEW`

## Alcance ejecutado

Croma cerró técnicamente la colección de 10 escenas de lluvias de meteoros después del HUMAN visual gate de María.

En este cierre:
- NO se rediseñó ni regeneró ningún master;
- se conservaron las 9 escenas KEEP + la nueva Eta Acuáridas costera subtropical aprobada;
- se normalizaron los 10 masters a `1536×1536 · PNG RGB · sRGB embebido`;
- se generó una contact sheet visual 5×2 sin texto;
- se generó una contact sheet factual 5×2 desde JSON separado del arte;
- se generaron manifest, QA y SHA-256.

## Resume Gate

Punto de partida reconciliado antes de escribir:
- `main`: `7d82a9c60b3e3a7fb82a7bd0f0ae67eb6c06c269`;
- coordinación canónica: `150c0275cee610cd916a86b37b23e7bb6b18dfce`.

Durante la ejecución la coordinación avanzó desde `d2b24d83f5e2ff27124e26e1bfb32fc9b8711e20` a `150c0275cee610cd916a86b37b23e7bb6b18dfce` por un cierre R59 de Exoplanetas. Se reconcilió antes de abrir esta rama; no existía conflicto de paths.

## Masters finales

| # | Archivo | Lluvia | SHA-256 |
|---|---|---|---|
| 01 | `meteor_01_cuadrantidas.png` | Cuadrántidas | `b586baab4d924bce7582c3db721fc14d521df1b3954be14835a0f7d53125622d` |
| 02 | `meteor_02_liridas.png` | Líridas | `809bbd82f6bbb49684e4af91ad3a4416812bdf4ea1892a5b52505de5c0379997` |
| 03 | `meteor_03_eta-acuaridas.png` | Eta Acuáridas | `81c1222159dabc22c0fde83611f6ef6def086e7926fb483659f51bd2ce071d20` |
| 04 | `meteor_04_delta-acuaridas-sur.png` | Delta Acuáridas del Sur | `25e1482b2fe224bef735725332f0c299622e69c25f3c2a913866e9368fa16fa0` |
| 05 | `meteor_05_perseidas.png` | Perseidas | `68e57578ac9c0b372bdf07ef05bae7b53b2f413bd16034e3e8c0a9d688f0e3ef` |
| 06 | `meteor_06_orionidas.png` | Oriónidas | `f3186e94e3ef611aebe89a95c53eae95e125ad83908f914de3e5cba9417eef5f` |
| 07 | `meteor_07_tauridas.png` | Táuridas | `98edf1089808667460d4a09d50819202fadc272d42ac815334cf118d9c974857` |
| 08 | `meteor_08_leonidas.png` | Leónidas | `9e9ef40719157b4f7047f7067a0e15d552638544cd75d8b509380496e4c9bce7` |
| 09 | `meteor_09_geminidas.png` | Gemínidas | `24cabce8d7fdadc001cf01e0617f6ea0a09460dbc4a0dd6ad866eb583de3592a` |
| 10 | `meteor_10_ursidas.png` | Úrsidas | `644a8a54380880a0c4bbb2ad222b9603efe4910f5b333b4f3d2e6a59f453bcd0` |

Todos:
- 1536×1536;
- PNG RGB;
- perfil ICC `sRGB built-in` embebido (588 bytes);
- sin texto, UI, logos ni datos científicos horneados;
- hash único.

## Dirección visual cerrada

HUMAN QA previo de María:
- 10 paisajes distintos;
- 10 composiciones distintas;
- radiantes visualmente coherentes;
- alta actividad: Cuadrántidas / Perseidas / Gemínidas;
- media: Eta Acuáridas / Oriónidas / Leónidas;
- baja/moderada: Líridas / Delta Acuáridas del Sur / Táuridas / Úrsidas;
- Táuridas especialmente escasa;
- Leónidas anual moderada, NO tormenta histórica;
- Eta Acuáridas = costa subtropical pre-amanecer, radiante bajo.

La clasificación visual es una jerarquía de producto y NO una representación literal del ZHR simultáneo.

## Factual 2026

La hoja factual usa como tabla numérica principal:
- American Meteor Society · `2026 Meteor Shower List`;
- la propia tabla acredita la información/plantilla a International Meteor Organization y Masahiro Koseki.

Progenitores contrastados con:
- NASA/JPL Solar System Dynamics · `Meteor Streams`;
- NASA Science · páginas de lluvias/cometas.

Cautela mantenida:
- `Southern Delta Aquariids`: no se presenta el progenitor como cerrado. AMS/NASA señalan `96P/Machholz` como sospechado; JPL SSD lista `P/2008 Y12 (SOHO)`.
- `Táuridas`: como Iris Green usa una única pieza agrupada, la fila cuantitativa toma Southern Taurids como base única y lo declara para no mezclar dos radiantes/picos en una sola ficha.

## Artefactos locales del paquete

- `METEOR_SHOWERS_BATCH_01_CONTACT_SHEET_5x2_VISUAL.png`
  - SHA-256 `109c9090826abe586994815f7bad5df0359a1f0179cf2a91a543b02a824c7acb`
  - 2800×1120
- `METEOR_SHOWERS_BATCH_01_CONTACT_SHEET_5x2_FACTUAL.png`
  - SHA-256 `63cdbee8ee36097db470e68201af5273a7d8d0348a71e78b7d95fc73fb822bbc`
  - 3500×1740
- `meteor_showers_2026_verified.json`
  - SHA-256 `c2ce45d93d5b692d9423ff0c73c43da482943fb00f08bc4ab021daf8c0944a8c`
- `CROMA_METEOR_SHOWERS_BATCH_01_FINAL.zip`
  - SHA-256 `3397e8bb41fa5209861f0652c5e95ea888ade5be708bfc83e4b9f013fb60efa4`
  - ZIP integrity: PASS, 17 entries.

## Límites

- no `main`;
- no runtime;
- no integración web;
- no sustitución de datos por arte;
- el marcador significa `READY_FOR_REVIEW`, no HUMAN QA integrado final.
