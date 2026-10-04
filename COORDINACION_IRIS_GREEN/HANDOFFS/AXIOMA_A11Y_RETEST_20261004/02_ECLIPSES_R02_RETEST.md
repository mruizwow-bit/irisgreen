# AXIOMA · RETEST A11Y · ECLIPSES R02 · 04/10/2026

Estado:
`AXIOMA_ECLIPSE_R02_A11Y_REWORK_REQUIRED`

Rama:
`motor/prisma-cover-eclipse-r02-20261003`

HEAD auditado:
`e4bcfa87ad056bd8caa3c0f349ef06f17ce02240`

CI:
`37111801550` · SUCCESS

Artifact:
`eclipse-canonical-r02-integration` · ID `11270078199`
Digest:
`sha256:11212d137a8b9d7ffec489df67d52d8b46fef5c59e069b2b4c2a60ca798780d5`

## Findings anteriores · RETEST

### REDUCED / OFF / no-motion
PASS sobre el finding anterior.

`start()` ya no inicia `setInterval` cuando el modo no es NORMAL:
- llama a `advanceDiscrete()`;
- avanza entre puntos de fase significativos;
- no mantiene reproducción continua.

Marcador:
`ECLIPSE_R02_MOTION_RETEST_PASS`

### Equivalentes de secuencias
PASS.

Los alt exponen ahora orden real de fases.

Solar ES:
antes del contacto → parcial de entrada → totalidad → parcial de salida → final.

Lunar ES:
penumbral → parcial → total → parcial de salida → penumbral final.

Marcador:
`ECLIPSE_R02_SEQUENCE_ALT_RETEST_PASS`

## Nuevo finding 1 · contraste real del explorador

FAIL / REWORK_REQUIRED.

Evidencia manual:
- `eclipse-r02-types-390.png`;
- `eclipse-r02-types-1440.png`.

El artifact renderizado muestra el título, texto introductorio y figcaption del explorador en tonos muy claros sobre una tarjeta casi blanca.

Muestreo del PNG 1440:
- fondo dominante aproximado: `rgb(236,238,241)`;
- texto claro de título aproximado: `rgb(238,244,248)` → contraste ≈ **1.05:1**;
- texto muted aproximado: `rgb(201,213,221)` → contraste ≈ **1.29:1**.

Esto está muy por debajo de 4.5:1 para texto normal y 3:1 para texto grande.

Causa:
el componente usa/infiere colores heredados/light-theme incompatibles con el fondo claro de `.ec-how`; el fallback CSS no garantiza el color computado real.

Corrección mínima:
- fijar color de texto del explorador/figcaption a token de texto oscuro contrastante en superficie clara;
- validar contraste computado, no solo tokens declarados;
- retestar LIGHT/DARK si ambos existen.

Marcador:
`ECLIPSE_R02_EXPLORER_CONTRAST_FAIL`

## Nuevo finding 2 · selección arbitraria del mapa solo con puntero

REWORK_REQUIRED.

El runtime añade `click` a los SVG de mapa para elegir cualquier punto geográfico, pero no existe evento de teclado ni control equivalente para introducir un punto arbitrario.

El select de ciudades y geolocalización NO son equivalentes completos a elegir cualquier coordenada del mapa.

Corrección mínima:
- añadir campos latitud/longitud accesibles y teclado-operables;
  o
- implementar interacción de mapa por teclado con semántica e instrucciones adecuadas.

No es necesario rediseñar mapas.

Marcador:
`ECLIPSE_R02_MAP_KEYBOARD_EQUIVALENT_REQUIRED`

## Cobertura pendiente 320 / texto ampliado

La suite exacta solo ejecuta 390 y 1440.
La orden Axioma exige 320/390/1440 y zoom de texto.

Por tanto:
`ECLIPSE_R02_320_TEXT_ZOOM_EVIDENCE_PENDING`

Añadir:
- 320×800/844;
- horizontal overflow = 0;
- controles completos;
- texto 200% / ajuste equivalente;
- foco visible y orden de foco en el explorador.

## PASS actuales

- 6 tipos canónicos;
- 2 secuencias KEEP;
- ES/EN;
- alt canónicos;
- alt de secuencia corregidos;
- aria-pressed;
- botones de tipo >=44px;
- forced-colors;
- facts principales en HTML;
- `EXPLORE → LOCATE → REVEAL`;
- 0 external / HTTP / JS errors.

## Gate

NO emitir todavía:
`AXIOMA_ECLIPSE_R02_A11Y_PASS`

Rework:
CSS contraste + equivalente teclado del mapa + evidencia 320/text zoom.

No redraw.
No rerender.
No modificar 6 SVG canónicos ni 2 secuencias.
No main.
No deploy.

No equivale a conformidad WCAG global ni certificación.
