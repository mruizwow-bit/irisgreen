# PRISMA · Cielo y Espacio R04 · pre-hardware

Fecha: 2026-10-07

Orden: ORDEN_CIELO_Y_ESPACIO_R04_GPT.md

Rama:
`prisma/cielo-espacio-r04-20261007`

## Resultado no dependiente de hardware

Paquete autónomo R04 construido sobre la base R03/R03.1 disponible.

Comprobaciones ejecutadas:
- 27 unitarias · 0 fallos
- 13 estáticas R04 · 0 fallos
- sintaxis Node de js/, datos/ y pruebas/: PASS

Total no-hardware:
`40 PASA · 0 FALLA`

Cubren:
- 88/88 y evidencia angular heredada;
- offset de entrada movido a datos;
- seis achatamientos publicados;
- 21 fases orbitales medias;
- escena-first declarada;
- panel overlay;
- suelo perceptual;
- profundidad del aire;
- suelo nocturno 0,055;
- sombras mutuas declaradas;
- disclaimer de no-predicción;
- timer GPU opcional;
- test de memoria 10 min presente.

## Integración repo

Sistema Solar:
- controlador activo R04: `assets/ig-sistema-solar-r04.js`
- renderer activo R04: `assets/ig-sistema-solar-3d-r04.js`
- ES/EN actualizados para cargar solo controlador R04
- `noindex,nofollow` mientras no esté aprobado.

El renderer R04 incluye:
- achatamiento;
- fase orbital R04;
- sombras geométricas acotadas a vista de rodear;
- timer `EXT_disjoint_timer_query_webgl2`;
- sin shell atmosférico planetario.

## Artefacto local pre-hardware

`CIELO_Y_ESPACIO_R04_PREHARDWARE.zip`

SHA-256:
`6a8cdbcffb5df44d2cada1acda7a1da5712fb8a6b11c9fca3856c76761b5f976`

283 archivos. 0 entradas .git.
MANIFEST.json y SHA256SUMS.txt regenerados desde bytes reales.

## Pendiente exclusivamente de ejecución real

No se emite gate.

Pendiente:
- navegador final;
- capturas R04 1440/390/320;
- antes/después de 8 findings;
- GPU real si extensión disponible;
- serie memoria 10 min;
- teléfono físico;
- AT real;
- Nexo/Axioma/HUMAN QA.

NO MAIN · NO PUBLIC DEPLOY.
