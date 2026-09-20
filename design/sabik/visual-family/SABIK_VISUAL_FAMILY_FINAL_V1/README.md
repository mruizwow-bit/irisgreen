# SABIK_VISUAL_FAMILY_FINAL_V1 · R2

Fecha: 20/09/2026  
Coordinación: Astra  
Agente: n.º 3 · Prototipos

## Estado

**SABIK_WORDMARK_T1_VECTOR_R2_READY**

La corrección R1 permanece aceptada. R2 modifica exclusivamente el master vectorial del wordmark **SABIK T1 · REFINAMIENTO** y la evidencia técnica asociada.

**No se ha modificado Matriz, Web, IA ni Educa.**

## Sistema verbal congelado

**SABIK**  
**CLARIDAD INTELIGENTE.**  
**Una IA que adapta la información para que sea más fácil de entender y usar.**

Familia:

**UNA MISMA ESENCIA · CUATRO PRESENCIAS**

## Wordmark T1 R2

Master de producción:

`masters/SABIK_WORDMARK_T1_MASTER_R2.svg`

Características:

- vector real, sin raster incrustado;
- 5 paths / 59 nodos;
- líneas rectas y contornos Bézier normalizados;
- sin dependencia de archivo de fuente;
- no autotrace bruto;
- no reproducción del escalonado raster;
- no cambio de T1 ni exploración tipográfica.

La referencia visual de autoridad es el tablero aprobado de 1536×1024 disponible en Library. El paquete conserva solo el recorte del wordmark, sin reintroducir copy histórico.

## QA

La Biblioteca contiene:

- QA completo referencia/vector/overlay/×4/×8;
- overlay;
- SVG master;
- ZIP R2;
- informe de reproducibilidad.

Pruebas raster:

- 365×70;
- 730×140;
- 1460×280 (×4);
- 2920×560 (×8).

## Control geométrico

- viewBox: `0 0 198 38`
- drawing bbox: `x=0.0838 y=2.5000 w=197.9630 h=33.6645`
- R1: 1260 nodos en el trazado píxel-a-píxel.
- R2: 59 nodos en 5 paths.

## Reproducibilidad

**REPRODUCIBILITY_PASS**

- cuatro rasterizaciones R2 se regeneran y coinciden por SHA-256;
- 76 archivos aceptados de R1 se comparan contra lock: **0 diferencias**;
- SVG sin `<image>`;
- manifest R2 verificado.

## Paquete

`/SABIK/Agent3/SABIK_VISUAL_FAMILY_FINAL_V1_R2.zip`

SHA-256:

`0db11fb3a79959b5eb5a11a15550061a459e4584bb4b14cea02da83ac7dfa69a`

Tamaño: `7,485,902 bytes`.

**NO MERGE hasta revisión directa de Astra.**