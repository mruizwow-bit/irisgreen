# CIELO NOCTURNO · CONSTELACIONES · PIPELINE R02 · 03/10/2026

Autoridad de producto: María  
QA posterior: Axioma  
Programa: #370

Estado:
`NIGHT_SKY_CONSTELLATION_PIPELINE_R02_COMPLETE_88`

## Decisión preservada

Tandas 01–02:
- 20/20 KEEP de dirección visual y geometría;
- no redibujadas desde cero;
- reconstruida únicamente la salida R02.

Tandas 03–09:
- completan las constelaciones 21–88 con el pipeline R02.

## Correcciones R02 aplicadas

1. Separación de salidas:
   - SVG master limpio;
   - PNG review;
   - JSON por constelación.

2. Datos preservados:
   - nombre ES;
   - nombre EN;
   - abreviatura IAU;
   - HIP;
   - RA/Dec;
   - magnitud;
   - B−V cuando está disponible;
   - coordenadas proyectadas;
   - edges;
   - nombres propios disponibles en la fuente de review.

3. Terminología corregida:
   - NO usar “patrón IAU” para la figura de líneas;
   - wording:
     `Región IAU · figura de líneas Stellarium Modern`.

4. Etiquetas:
   - collision avoidance;
   - offsets dinámicos;
   - leader line corta cuando hace falta;
   - no se hornea visibilidad/temporada como verdad universal.

5. Color:
   - PNG review RGB;
   - perfil ICC sRGB embebido.

6. Reproducibilidad:
   - `manifest.json`;
   - `provenance.json`;
   - JSON por constelación;
   - JSON maestro por tanda;
   - `SHA256SUMS.txt`;
   - contact sheet;
   - listado de archivos.

## Conteo final

- 88 SVG masters.
- 88 PNG review.
- 88 JSON de constelación.
- 9 contact sheets.
- 9 manifests.
- 9 provenance.
- 9 SHA256SUMS por tanda.
- 1 MASTER_MANIFEST_88.json.
- 1 SHA256SUMS_MASTER.txt.
- 1 QA_RESUMEN_R02.txt.

QA estructural:
- `88/88 SVG`;
- `88/88 PNG`;
- `88/88 JSON`;
- `88/88 PNG con ICC sRGB`;
- índices 21–88 sin huecos.

## Rangos

- T01 → 01–10
- T02 → 11–20
- T03 → 21–30
- T04 → 31–40
- T05 → 41–50
- T06 → 51–60
- T07 → 61–70
- T08 → 71–80
- T09 → 81–88

## Fuentes / atribución metodológica

- IAU: identidad/región de las 88 constelaciones; no se atribuye a IAU una figura gráfica oficial de líneas.
- Stellarium Modern: figuras de líneas.
- Hipparcos: posiciones/magnitudes y B−V cuando disponible en el dataset empleado.
- Stellarium star names: nombres propios utilizados en review cuando estaban disponibles.

## Visibilidad

No se hornea “visible en invierno/verano” en el master.

Policy:
`VISIBILITY_IS_CONTEXTUAL_METADATA`

Debe calcularse/localizarse posteriormente por:
- latitud;
- hemisferio;
- fecha;
- hora.

## Hashes de paquetes entregados

- T01 R02: `6d4460ca23dddef8e260ea9eda6055f029efd3de78a05b55c4daa53699a543ae`
- T02 R02: `6c14790d15356fba01e83f2a60c78b82e6399b9b0232a5123f88a93ca729f6db`
- T03 R02: `0a3143fa0cd98dfe4333eb3300868660d80accd4bf3e8c26bcc2b46ec92824c5`
- T04 R02: `358499eff738bdf022a46f390c90e14cf49a9e2cb76ca5b82ae0db8c14f2e6ce`
- T05 R02: `4593afa6fc2ceaf0120394ecb3c8b5a1851e29938ae474832a0664a5198faf14`
- T06 R02: `076ca26590b617f0036c32ac56f658472fbd447650888a8fcda5959413642a05`
- T07 R02: `22326aee8e5585beb46753116a963ccae60b4a65eff1a2db642359731550ee1b`
- T08 R02: `41f4e72bf65d76d405ba00e2627b9138c04181fad5953cd67fdfc06067ae5776`
- T09 R02: `58caee1c0c36894845449886e9367ad3911be9f458faf417d3fe34843d294617`
- MASTER 01–88: `e3bcb07d452f83a4b3b02f05cc3328713a1d16e1b95ebdd0aa3e598368845f2a`

## Gate

`NIGHT_SKY_CONSTELLATION_PIPELINE_R02_READY_FOR_PRODUCT_QA`

Axioma entra después de las tandas aprobadas, según orden vigente:
- accesibilidad;
- contraste;
- reduced/no-motion si la integración añade movimiento;
- equivalentes textuales;
- ninguna información depende solo de la imagen.

No se declara integración web ni main.
