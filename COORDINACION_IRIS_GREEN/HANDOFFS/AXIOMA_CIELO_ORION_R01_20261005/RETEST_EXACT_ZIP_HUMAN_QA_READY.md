# AXIOMA · CIELO ORIÓN INTERACTIVO R01 · RETEST EXACT ZIP

Fecha: 05/10/2026

Gate:
`AXIOMA_SKY_ORION_R01_READY_FOR_HUMAN_QA`

## Evidencia exacta

ZIP:
`CIELO_ORION_INTERACTIVO_R01(1).zip`

SHA-256 verificado:
`2e036ce4c3e3984be09d2c0ba630470f2129be49738960ec070bffa756d0026c`

Tamaño:
`6 874 681 bytes`

Library:
`libfile_d950b1c4f6bc8191a470f80a1e97f08b`

Integridad:
- ZIP test PASS;
- `MANIFEST_SHA256.txt`: **41/41 PASS**;
- estructura y assets exactos del paquete auditados.

## Browser retest independiente

Axioma ejecutó Chromium real sobre los bytes exactos del ZIP.

Limitación del harness:
- la política administrativa del navegador de este entorno bloquea navegación directa `file://` y localhost;
- por ello Axioma cargó el mismo HTML/CSS/JS/assets en Chromium mediante inyección local sin red;
- esto reproduce DOM, CSS, canvas, teclado, foco, cámara y lógica del prototipo;
- no se presenta como una nueva prueba independiente del origen `file://` en sí.

El package/portabilidad `file://` queda respaldado por la evidencia de recepción de Nexo y se comprobará además en HUMAN QA María al abrir el ejecutable.

### Banco T01–T16
**41/41 comportamientos PASS independientes.**

Reproducidos:
- entrada sin revelar Orión;
- fuentes neutrales antes del hallazgo;
- pan coherente;
- zoom coherente;
- límites de cámara;
- error neutral al examinar zona incorrecta;
- localización deliberada;
- identificar no recentra;
- reveal explícito;
- cámara conservada F03→F04→F05;
- profundidad sin sustituir el cielo;
- reposo sin autoplay;
- teclado real y orden de foco;
- foco tras identificar desde escena/botón;
- Escape y retorno de foco;
- vía descriptiva previa al nombre;
- 320 / 390 / 1440;
- targets >=44;
- texto al 200 % sin scroll horizontal;
- ES/EN conservando cámara;
- reset explícito;
- resize no identifica;
- horizonte ausente con fallback;
- NORMAL / REDUCED / NONE;
- prefers-reduced-motion;
- forced-colors.

## Cámara · casos adicionales Axioma

Nexo pidió ampliar T15a porque el banco del autor no cubría todas las combinaciones.

Axioma midió la cámara **exactamente en el evento click, antes del handler de la app**, y comparó:
- cámara visible en evento;
- cámara tras Examinar/Revelar;
- cámara 900 ms después;
- estado de animación.

### AX-CAM-1 · Examinar durante pan
PASS.

Evento:
`u=0.035832394129311815 · v=0.4639772494172494 · zoom=1.3`

Tras Examinar:
- cámara idéntica;
- animación cancelada;
- etapa = `localizada`.

900 ms después:
- cámara idéntica;
- sin salto al destino pendiente.

### AX-CAM-2 · Examinar durante zoom
PASS.

Evento:
`zoom=1.5643236084318386`

Tras Examinar y 900 ms después:
- zoom idéntico;
- animación cancelada;
- identificación correcta;
- etapa = `localizada`.

### AX-CAM-3 · Revelar durante pan
PASS.

Evento:
`u=0.03045661666036069`

Tras Revelar:
- cámara idéntica;
- animación cancelada;
- etapa = `revelada`.

900 ms después:
- sin salto.

### AX-CAM-4 · Revelar durante zoom
PASS.

Evento:
`zoom=1.5429882635541334`

Tras Revelar y 900 ms:
- zoom idéntico;
- animación cancelada;
- etapa = `revelada`.

Resultado:
`CAMERA_FREEZE_PAN_ZOOM_EXAMINE_REVEAL_4_OF_4_PASS`

## Foco

PASS.

Reproducido:
- identificar desde escena → foco permanece en `escenario`;
- identificar desde botón Examinar → foco avanza a `btn-revelar`;
- Ver Orión completa → foco en panel;
- Escape → cierra panel y devuelve foco;
- no cae al body.

## Responsive / 200 %

PASS.

### 320
- scroll horizontal = 0;
- targets <44 = 0;
- ruta de teclado localiza el patrón;
- 200 %: scroll horizontal = 0;
- controles recortados = 0.

### 390
PASS equivalente.

### 1440
PASS equivalente.

## HUMAN QA · Examinar a 320

Observación, no blocker.

En 320×568:
- el borde superior de `Examinar esta zona` aparece aproximadamente en y=550.5 px;
- el viewport mide 568 px;
- por tanto el control queda justo en el límite inferior y requiere un pequeño scroll para quedar completamente cómodo/visible.

Axioma no ordena otro rediseño.

María debe comprobar:
1. si descubre naturalmente que debe seguir bajando;
2. si llegar a `Examinar` resulta cómodo;
3. si el cielo conserva suficiente protagonismo frente al pie/controles.

Marcador:
`ORION_R01_320_EXAMINE_DISCOVERABILITY_HUMAN_CHECK`

## Resultado

No se detecta blocker Axioma en el patch.

Gate:
`AXIOMA_SKY_ORION_R01_READY_FOR_HUMAN_QA`

Siguiente:
`HUMAN QA MARÍA · ejecutable exacto`

No autoriza:
- segunda constelación;
- main;
- deploy público;
- declaración de conformidad global.

`NO MAIN · NO PUBLIC DEPLOY · NO SECOND CONSTELLATION`.
