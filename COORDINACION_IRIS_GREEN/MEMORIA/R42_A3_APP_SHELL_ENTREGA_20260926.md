# Memoria · R42 A3 · App shell interactivo · entrega final · 26/09/2026

## Estado
`R42_A3_APP_SHELL_BUILD_READY_FOR_A2`

A3 ha completado su carril técnico conforme a #284 y al bloque normativo R42. La integración web y la HUMAN QA final siguen deliberadamente en #289/A2, única puerta a la web.

## Orden y base
- Parent: #283
- A3: #284
- Acuse obligatorio: `R42_NORMATIVA_EMBEBIDA_LEIDA`
- Base A2 exacta: `574356cba3b73dc8477a625d2c6311008260a2d6`
- A2 seguía en esa misma base al cierre A3; no hubo drift.
- Rama: `agent3/r42-app-shell-20260926`
- HEAD final: `c9e5c002d65a9efc872e56b18230a6cf08701c31`
- tree final: `bbc44f1dbf7682eb2ea17b9c85d3f79a27869f69`
- PR: #290 · Ready for review · mergeable
- Diferencia frente a A2: 26 commits, 7 archivos, 0 archivos propios de A1/A4/A5/A7 modificados.

## Archivos
- `.github/workflows/r42-a3-app-shell-browser.yml`
- `assets/ig-r42-shell.css`
- `assets/ig-r42-shell.js`
- `scripts/apply_r42_app_shell.py`
- `scripts/build_site.py` — solo añade el paso piloto R42 tardío
- `scripts/test_r42_app_shell.py`
- `scripts/test_r42_app_shell_browser.py`

## Producto construido
Capa común R42 sobre la web canónica, sin SPA global ni framework nuevo:
- topbar compacta;
- workspace central;
- tool rail con roving tabindex y navegación por flechas/Home/End;
- inspector contextual;
- command/actions con búsqueda;
- ayuda en `dialog`;
- estado discreto;
- mobile dock + inspector en sheet/dialog;
- Popover de Archivo con fallback;
- API `window.IGR42Shell` para extensión de módulos;
- coordinación de overlays con Lectura/Música;
- Escape resuelto antes de handlers legacy cuando existe un diálogo R42 abierto.

### Dibujo
Sin recrear listeners del runtime:
- Retos y propiedades pasan al inspector;
- el lienzo queda primero;
- Deshacer/Rehacer permanecen en contexto;
- Nuevo/Abrir/Guardar/PNG/Imprimir quedan en Archivo;
- se eliminó la columna vacía heredada;
- puente de cascada estrictamente acotado al piloto Taller para vencer CSS legacy unlayered sin usar `!important`;
- el test exige que el stage interior ocupe ≥82 % del stage exterior y que Retos no tenga overflow horizontal.

## Tecnología 2026 aplicada con criterio
- CSS `@layer`;
- Container Queries;
- Grid;
- Popover API y `dialog`;
- View Transitions solo como enhancement y con reduced motion;
- CSS anchor positioning solo con fallback;
- `prefers-contrast`, forced-colors y reduced-motion;
- base opaca; `prefers-reduced-transparency` solo enhancement;
- sin React/Vue/Svelte;
- sin red;
- sin persistencia implícita;
- sin `innerHTML` / `insertAdjacentHTML` en el shell.

La investigación previa queda vigente: tecnología nueva solo entra cuando mejora una necesidad observable y mantiene fallback, accesibilidad y rendimiento.

## Piloto ES/EN
La inyección sigue deliberadamente limitada a:
- `/es/taller/dibujo/`
- `/en/workshop/drawing/`
- `/es/recursos/juegos/`
- `/en/resources/games/`
- `/es/intereses/`
- `/en/interests/`
- `/es/sitio-tranquilo/`
- `/en/quiet-space/`

No se ha propagado a portada ni a toda la web antes de HUMAN QA.

## Etapas de vida
Leído el addendum `R42_LIFE_STAGE_SEPARATION_ADOPTED`. El shell A3 permanece transversal, sobrio y no infantilizante; no obliga a elegir diagnóstico ni etapa. La orientación Infancia/Adolescencia/Adultez/Transversal se incorpora en los módulos donde cambia la experiencia de forma útil, no como gate global del shell.

## QA estático/build
El contrato R42 valida:
- 8/8 rutas;
- inyección idempotente;
- no propagación accidental;
- no nueva deuda `!important` en la capa principal;
- primitives Web Platform esperadas;
- no red/persistencia/framework;
- sintaxis JS mediante `node --check` cuando Node está disponible.

Build final: 2.195 archivos.

## QA de navegador final
Workflow: `36243762051` · **SUCCESS** sobre el HEAD final.

Resultado:
- 26/26 casos PASS;
- 8 rutas × 3 viewports = 24 capturas;
- 1440×900;
- 390×844;
- reflow 320×800;
- overflow horizontal de documento = 0 en todos los casos;
- workspace/stage dentro del primer viewport;
- desktop mantiene rail vertical;
- móvil/reflow usa dock horizontal;
- inspector cerrado no comprime el workspace;
- Dibujo: Retos/propiedades dentro del inspector, canvas visible, Archivo agrupado, sin clipping;
- diálogos: Escape y restauración de foco;
- toolbar: un único tab stop y navegación interna APG;
- ES/EN equivalentes en el modelo del shell.

Artefacto de QA: `r42-a3-browser-qa` · ID `10906127952`.

A3 inspeccionó las capturas finales representativas de Dibujo desktop/mobile, Juegos mobile, Intereses desktop y Rincón desktop/mobile. Esta inspección técnica **no sustituye la HUMAN QA de María**.

## Límites / gate restante
No se afirma:
- conformidad WCAG/EN/ISO global;
- validación con lector de pantalla real o móvil físico;
- aceptación perceptiva final;
- aceptación de los contenidos propios de A1/A4/A5/A7.

A2 debe integrar #290 junto con los demás handoffs R42, publicar la preview única y devolver HEAD/tree/deploy/URL. María realiza la HUMAN QA en esa web. Solo tras esa aceptación se decide la propagación global.

## Deploy
A3: **0 deploy · 0 main · 0 producción**.
