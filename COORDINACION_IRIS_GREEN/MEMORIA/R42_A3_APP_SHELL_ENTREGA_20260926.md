# Memoria · R42 A3 · App shell interactivo · entrega · 26/09/2026

## Estado
`R42_A3_APP_SHELL_BUILD_READY_FOR_A2`

## Orden y base
- Parent: #283
- A3: #284
- Acuse obligatorio publicado: `R42_NORMATIVA_EMBEBIDA_LEIDA`
- Base A2 exacta: `574356cba3b73dc8477a625d2c6311008260a2d6`
- Base observada de A2 al cierre: la misma; no hubo drift.
- Rama A3: `agent3/r42-app-shell-20260926`
- HEAD: `85a972a1024de3ad009484463f46620346922b02`
- tree: `dc7163325e54937e99797f77842035ae4f1a80b7`
- PR: #290 (draft, contra rama A2)

## Entrega
A3 construyó una capa común de producto R42 sin convertir la web en SPA ni introducir un framework nuevo.

Archivos:
- `assets/ig-r42-shell.css`
- `assets/ig-r42-shell.js`
- `scripts/apply_r42_app_shell.py`
- `scripts/test_r42_app_shell.py`
- `scripts/build_site.py` (solo añade el paso R42)

### Componentes reales
- topbar compacta;
- workspace central;
- tool rail con patrón de teclado APG/roving tabindex;
- inspector contextual;
- command/actions con búsqueda;
- drawer de ayuda;
- project/status discreto;
- Popover de Archivo en Taller con fallback;
- dialog nativo con nombre accesible y restauración de foco;
- mobile con dock inferior e inspector como sheet/dialog;
- API `window.IGR42Shell` para que los módulos incorporen acciones, estado e inspector sin crear shells paralelos.

### Adaptación piloto de Dibujo
El adaptador no recrea botones ni listeners:
- mueve Retos al inspector;
- mueve el panel lateral de propiedades al inspector;
- deja el lienzo/workspace antes de instrucciones;
- mantiene Deshacer/Rehacer en contexto;
- agrupa Nuevo/Abrir/Guardar/PNG/Imprimir en Archivo mediante Popover/fallback;
- conserva el runtime de Dibujo y su semántica.

## Tecnología aplicada
Se conserva la investigación Web Platform 2026 como criterio:
- CSS `@layer`;
- Container Queries;
- Grid;
- Popover API / `dialog`;
- `inert`/focus patterns donde corresponda al shell;
- View Transitions solo como mejora y anulables con reduced motion;
- CSS anchor positioning solo como mejora con fallback;
- `prefers-contrast`, forced-colors, reduced-motion;
- base visual opaca; `prefers-reduced-transparency` solo enhancement;
- sin React/Vue/Svelte;
- sin red;
- sin persistencia implícita;
- sin `innerHTML` en el shell R42.

## Piloto, no propagación global
Se aplica únicamente a una superficie representativa de cada familia, en ES/EN:
- `/es/taller/dibujo/`
- `/en/workshop/drawing/`
- `/es/recursos/juegos/`
- `/en/resources/games/`
- `/es/intereses/`
- `/en/interests/`
- `/es/sitio-tranquilo/`
- `/en/quiet-space/`

Portada y otras páginas quedan sin inyección R42 hasta HUMAN QA.

## QA
Workflow: `36242268262` · **SUCCESS** sobre HEAD final.

Evidencia de log:
- `R42 A3 pilot: 8/8 routes present; 8 changed`
- `R42 A3 app-shell contract: PASS`
- `Directorio público: 2195 archivos`

El contrato incluye:
- inyección idempotente;
- alcance exacto 8 rutas;
- no propagación accidental;
- ausencia de nueva deuda `!important`;
- presencia de Container Queries / @layer / preferencias de accesibilidad;
- no red/persistencia/framework en shell;
- `node --check` del JS cuando Node está disponible.

## Gate restante
No hay aceptación visual final local. A2 integra PR #290 en preview y María revisa:
- 1440×900;
- móvil real/390×844 y reflow 320;
- workspace primero;
- jerarquía;
- teclado/foco;
- lector de pantalla;
- zoom;
- forced colors;
- reduced motion;
- ES/EN.

Solo tras esa HUMAN QA se autoriza propagar el patrón a más superficies.

## Deploy
A3: **0 deploy · 0 main · 0 producción**.
