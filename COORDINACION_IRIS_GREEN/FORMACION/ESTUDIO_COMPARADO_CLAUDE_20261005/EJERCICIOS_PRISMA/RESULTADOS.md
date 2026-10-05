# Prisma · ejercicios de transferencia · resultados

Fecha: 2026-10-05

Estos ejercicios no son producto y no modifican `main`. Su objetivo es demostrar transferencia del estudio del código Claude.

## Ejercicio 01 · representación espacial / proyección / picking

Ruta:
`01_ESPACIO_PROYECCION_PICKING/`

Implementa:
- dos alturas visibles;
- proyección isométrica `world(x,y,z) → screen(x,y)`;
- inversa en plano de z conocido;
- picking por polígonos proyectados, priorizando superficie visible de mayor z;
- preview de una rampa;
- orientación E/W;
- apoyo explícito;
- colocación;
- personaje que recorre bajo → rampa → alto.

Browser QA ejecutado en Chrome:

`projection_roundtrips = 3`  
`projection_error_max = 0`  
`rampPlaced = true`  
posición final del personaje:
`{x:4,y:0,z:1}`

Live status final:
`Personaje en alto 2: z1.`

La diferencia frente a Construcción es deliberada: z modifica la proyección real de superficie/pieza/personaje; no es sólo una etiqueta.

## Ejercicio 02 · frame → catálogo fluido

Ruta:
`02_CATALOGO_FLUIDO/`

Implementa:
- canon NAVY;
- Atkinson Hyperlegible y Newsreader desde assets locales;
- una sola fuente de catálogo: `catalogo-data.js`;
- grid fluido 1/2/3 columnas;
- una ruta disponible real a `cielo.html`;
- entradas no disponibles sin enlaces falsos;
- retorno real;
- filtro;
- estado vacío y recuperación.

### Primera ejecución

FAIL a 320 con texto al 200 %.

Causa observada:
- `h1` con palabra larga;
- `.toolbar label` conservaba un min-content/flex-basis mayor que viewport;
- el input heredaba ese ancho.

Corrección:
- `min-width:0`;
- `max-width:100%`;
- `overflow-wrap:anywhere`;
- input a `width:100%`;
- flex-basis limitado al ancho disponible.

### Segunda ejecución

Browser QA PASS:

- 320: `scrollWidth=320`;
- 390: `scrollWidth=390`;
- 1440: `scrollWidth=1440`;
- texto 200 %: PASS en los tres;
- navegación a Cielo: PASS;
- retorno: PASS;
- estado vacío: PASS;
- reset: PASS;
- enlaces `href="#"`: 0.

## Exportación limpia del ejercicio 02

`package.py` genera:
`PRISMA_EJERCICIO_CATALOGO_FLUIDO_R01.zip`

SHA-256 de la ejecución:
`4e458e495306ae2ece119f5cb2514f55fed04c3efe1f355048e519c1d20a8909`

9 archivos en portable, incluidas las fuentes locales copiadas desde el canon del repo.

ZIP extraído y abierto por `file://` en Chrome:
- fuentes Atkinson + Newsreader: cargadas;
- 320 px + texto 200 %: `scrollWidth=320`;
- 3 tarjetas renderizadas;
- 0 errores de consola/page.

Gate de aprendizaje:
`PRISMA_CLAUDE_STUDY_TRANSFER_EXERCISES_PASS`

No implica aprobación de producto ni cambios en `main`.
