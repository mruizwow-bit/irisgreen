# SABIK_T1_VECTOR_QA_R2

**Estado:** `SABIK_WORDMARK_T1_VECTOR_R2_READY`

## Fuente de autoridad

Se ha utilizado el tablero T1 aprobado de **1536×1024 px** (`ChatGPT Image 19 sept 2026, 07_49_59.png`, Library `libfile_7e7cd6470c548191939aadbfdcfe68c7`), que es la referencia visual de mayor resolución disponible en el proyecto. El paquete conserva únicamente el recorte del wordmark para no reintroducir copy histórico. El preview R1 de 365×70 no se trata como autoridad geométrica.

## Método

Reconstrucción vectorial controlada. No se usa el trazado píxel-a-píxel R1 como master, no se incrusta raster y no se incluye archivo de fuente.

- Identidad: **T1 · REFINAMIENTO**
- Rediseño tipográfico: **NO**
- Raster embebido: **NO**
- Dependencia de fuente: **NO**
- Paths: **5**
- Nodos R1: **1260**
- Nodos R2: **59**
- Reducción: **95,3 %**

## Geometría

- viewBox: `0 0 198 38`
- bbox: `x=0.0838 y=2.5000 w=197.9630 h=33.6645`
- S: `0.0838 / 2.7357 / 22.6070 / 33.4288`
- A: `44.0000 / 2.5000 / 31.0000 / 33.0000`
- B: `97.0000 / 3.0000 / 25.5000 / 33.0000`
- I: `145.0000 / 3.0000 / 3.0000 / 33.0000`
- K: `172.0000 / 3.0000 / 26.0469 / 33.0000`

Gaps visuales:

- S→A: `21.309`
- A→B: `22.000`
- B→I: `22.500`
- I→K: `24.000`

## Raster QA

- 365×70
- 730×140
- 1460×280 (×4)
- 2920×560 (×8)

En ×4 y ×8 no aparece escalonado heredado del raster R1.

## Evidencia

- QA: Library `libfile_4995917ffa70819185c8672ea2934b50`
- overlay: Library `libfile_2c8e7dbe312c819191041ecadc41ce90`

La comparación no usa coincidencia píxel por píxel como criterio: el aliasing de la referencia no debe preservarse en el master vectorial.