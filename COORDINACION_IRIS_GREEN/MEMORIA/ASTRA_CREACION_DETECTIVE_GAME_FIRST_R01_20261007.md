# ASTRA Â· CREACIÃ“N / TALLER + DETECTIVE Â· GAME_FIRST R01

Fecha: 2026-10-07
Autoridad de producto: MarÃ­a
Owner temporal: Astra
Estado de cobertura: `ASTRA_TEMP_COVER_CREACION_TALLER_AND_DETECTIVE_ACTIVE`

## DecisiÃ³n de arquitectura

Detective se trata dentro de la reestructuraciÃ³n `GAME_FIRST` de **CreaciÃ³n**, no como recuperaciÃ³n del juego legacy bajo Recursos.

Fuente vigente:
- `NEW_WEB_INFORMATION_ARCHITECTURE_R01_ACTIVE`
- CreaciÃ³n sustituye El taller como categorÃ­a principal.
- Ruta objetivo ES: `/es/creacion/`
- Ruta objetivo EN: `/en/creation/`
- `/es/recursos/juegos/` y `/es/taller/` quedan como legacy/donors hasta cutover.

Por tanto, el vertical slice nuevo vive aislado en:
- ES `/es/creacion/detective/`
- EN `/en/creation/detective/`

No se crea todavÃ­a una portada nueva de CreaciÃ³n sin contrato aprobado especÃ­fico. El botÃ³n Salir del slice vuelve a Inicio mientras esa portada no exista.

## Baseline recuperado

Baseline histÃ³rico de Detective:
`117a53a01bf254054f759e7e08eb06ba06f00d00`

El legacy clasificaba tarjetas sensoriales en cestas. Se conserva Ãºnicamente como donor conceptual/factual, no como soluciÃ³n de producto.

Contrato GAME_FIRST aplicado:

`VER â†’ PROBAR â†’ CAMBIAR â†’ OBSERVAR CONSECUENCIA â†’ RESOLVER`

## Vertical slice R01

Implementado sobre rama:
`astra/detective-game-first-r01-20261007`

Base exacta:
`origin/main@3db93944d631cf62c305d6a61d2f202148dddff2`

Archivos de producto:
- `assets/detective-game-first.css`
- `assets/detective-game-first.js`
- `es/creacion/detective/index.html`
- `en/creation/detective/index.html`

### Escena

- habitaciÃ³n 3D real con Three local first-party;
- Vera provisional construida en 3D dentro del runtime;
- lÃ¡mpara;
- altavoz;
- manta;
- cÃ¡mara navegable;
- selecciÃ³n por pointer/raycast;
- controles DOM equivalentes para teclado/touch.

### Sistema

Cada escena genera una configuraciÃ³n simulada interna distinta para Vera:
- luz;
- sonido;
- textura.

No existe una respuesta universal fija.

La persona:
1. observa;
2. selecciona un elemento;
3. cambia intensidad;
4. prueba;
5. observa tres seÃ±ales: cuerpo / respiraciÃ³n / atenciÃ³n;
6. cambia hipÃ³tesis;
7. resuelve cuando encuentra una configuraciÃ³n compatible con esa escena.

No puntuaciÃ³n.
No vidas.
No streak.
No perfil.
No almacenamiento.
No dato personal.

## 3D runtime

Se reutiliza:
`/assets/vendor/taller/three.js`

VersiÃ³n observada:
Three r186.

Hallazgo durante QA:
el bundle actual no expone `WebGLRenderer` como contrato de uso; la infraestructura del Taller usa `WebGPURenderer` con fallback WebGL 2.

Se corrigiÃ³ el slice para usar:
`new THREE.WebGPURenderer({ antialias: true, forceWebGL: true })`
+
`renderer.init()`.

El fallo inicial de canvas vacÃ­o quedÃ³ cerrado antes de commit.

## Accesibilidad / interacciÃ³n

- 3 objetos seleccionables desde el mundo 3D;
- los mismos 3 objetos seleccionables mediante botones DOM;
- Tab completo;
- botones >= 44 px;
- flechas rotan vista;
- +/- zoom;
- touch/pointer;
- estado con `aria-live`;
- seÃ±ales con `role=meter`;
- ES/EN;
- movimiento:
  - NORMAL;
  - REDUCED;
  - NONE;
- `prefers-reduced-motion: reduce` inicia en REDUCED.

## QA navegador real

Playwright + Chrome local contra servidor HTTP local.

Cobertura:
- ES 320Ã—760;
- ES 390Ã—844;
- ES 1440Ã—1000;
- EN 320Ã—760;
- EN 390Ã—844;
- EN 1440Ã—1000.

Resultado en los seis casos:
- canvas 3D presente;
- selecciÃ³n de Altavoz = PASS;
- `aria-pressed` = PASS;
- cambio de intensidad = PASS;
- `Probar cambio` modifica las tres seÃ±ales = PASS;
- ciclo NORMAL / REDUCED / NONE = PASS;
- overflow horizontal = false;
- botÃ³n mÃ­nimo = 44 px;
- errores JS = 0.

Test adicional:
- `prefers-reduced-motion: reduce` â†’ `Movimiento: reducido` = PASS.

Checks:
- `node --check assets/detective-game-first.js`
- `git diff --check`

## LÃ­mites

No main.
No deploy.
No cutover.
No reconstrucciÃ³n del legacy.
No escala a mÃ¡s escenas antes de HUMAN QA / siguiente gate.

## Gate

`DETECTIVE_GAME_FIRST_VERTICAL_SLICE_READY_FOR_NEXO`

Este gate significa **vertical slice tÃ©cnico listo para revisiÃ³n/integraciÃ³n de siguiente fase**, no HUMAN QA PASS ni producto final.
