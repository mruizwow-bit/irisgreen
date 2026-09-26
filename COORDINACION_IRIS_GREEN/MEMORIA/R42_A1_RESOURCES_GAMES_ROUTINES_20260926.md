# Memoria · R42 A1 · Recursos, Juegos y Rutinas · 26/09/2026

## Orden vigente

- Parent: #283 · R42.
- Agente 1: #286.
- Gate obligatorio publicado: `R42_NORMATIVA_EMBEBIDA_LEIDA`.
- Estado de entrega: `R42_A1_RESOURCES_GAMES_ROUTINES_READY_FOR_A2`.
- A2 sigue siendo la única puerta de integración/subida a la web.

R40 #261 y R41 #279 se conservan únicamente como historia/base funcional. R42 es la orden vigente.

## Base y handoff de producto

Base A2 congelada:

```text
52e5f9f02184581a1bfb1878c388ede3d1068c47
tree a341d2053fee62d3f7cd3522c74618b1a090a0dc
ref freeze/r40-a2-web-baseline-20260926
```

Handoff único A1 R42:

```text
branch agent1/r42-resources-games-routines-ready
HEAD   c88ede84d8f4f88e3a93390d7502e226ba5f4e0d
tree   c8806e6a62ead7c8fa869a2793768d8d7a388f7d
parent 52e5f9f02184581a1bfb1878c388ede3d1068c47
commits sobre freeze: 1
```

A1 no desplegó ni modificó main.

## Recursos

La portada de Recursos se mantiene dentro de Iris Green y se transforma en hub visual:
- Juegos como acceso principal;
- Rutinas visuales;
- Rutinas imprimibles;
- Tarjeta Iris;
- Descargas visuales;
- Tus intereses / Taller / Rincón quedan como exploración secundaria.

No se introduce una shell autónoma ni se sustituye la navegación global.

## Juegos

### Inventario

- baseline público A2 preservado: **252 juegos**;
- tanda nueva: **45 juegos**;
- total: **297 juegos**;
- IDs únicos: 297;
- matriz nueva: **9 contextos × 5 tipos = 45 celdas**;
- no se usa como fuente de rediseño el lote de 130 juegos legacy retirados.

Los 252 primeros objetos del dataset R42 son byte/semánticamente iguales a los 252 del freeze A2.

### Experiencia R42

- entrada por nueve contextos visuales;
- el catálogo completo no se muestra de golpe;
- resultados se abren por contexto/búsqueda;
- superficie de juego primero;
- acciones secundarias en Popover;
- workspace central + inspector secundario;
- modo móvil con controles flotantes/sheet, no simple escritorio apilado;
- Container Queries;
- reduced motion;
- forced colors;
- keyboard + click;
- drag solo como mejora adicional, nunca único método.

Familias visuales/interactivas diferenciadas:
- ordenar/secuenciar;
- elegir;
- clasificar;
- planificar/board;
- memoria visual.

### Filtros

Se exponen:
- etapa;
- contexto;
- tipo;
- habilidad/necesidad;
- duración.

Habilidades prácticas no clínicas:
- secuenciación;
- elección y decisión;
- clasificación;
- planificación/organización;
- memoria visual.

Duración:
- hasta 2 min aprox.;
- 3–5 min aprox.;
- sin duración fija.

No se exige diagnóstico.

### Metadatos versionados

`assets/data/r42-games-metadata.json`
- 297 registros;
- ES/EN;
- contexto;
- etapas;
- tipo;
- habilidad;
- duración;
- linaje del juego.

## Rutinas

El estado público válido ya contiene **109 rutinas**, por lo que R42 no reduce el catálogo al mínimo histórico de 92.

Cada una de las 109 dispone ahora de:
- preview;
- pasos;
- contexto;
- etapa;
- impresión;
- guardado como PDF mediante impresión;
- **descarga SVG A4 real**;
- watermark `IRIS GREEN · irisgreen.eu`;
- atribución de pictogramas separada;
- ES/EN.

La descarga SVG A4:
- se genera en navegador;
- embebe los pictogramas SVG usados;
- contiene título y descripción textual;
- incluye contexto/etapa;
- incluye atribución;
- incluye watermark.

Manifest:
`assets/data/r42-routine-download-manifest.json`

Registros:
- 109 descargas declaradas;
- 79 rutinas con ID editorial `src` existente;
- 30 rutinas legacy sin ese ID: `LEGACY_NO_ROUTINE_SOURCE_ID`.

No se inventaron esos 30 IDs.

## Pictogramas y licencia

Se reutiliza la auditoría existente, no se repite investigación:

- `assets/pictogramas/MANIFIESTO_PICTOGRAMAS.csv`
- `assets/pictogramas/NOTICE.txt`
- `assets/pictogramas/LICENSE-MULBERRY.txt`

El manifest central conserva:
- proveedor;
- ID fuente;
- URL fuente;
- licencia;
- atribución;
- clase de imagen;
- alternativa;
- usos.

R42 declara:
- Mulberry como fuente principal conforme al expediente;
- `ARASAAC_USED=false`;
- licencia declarada actual: CC BY-SA 4.0;
- pin exacto definitivo: `PENDING_PROJECT_RECONCILIATION_PER_R42_BRIEF`.

La watermark Iris Green identifica la composición, no la propiedad de pictogramas de terceros.

## ES/EN

Afectadas y preparadas ambas rutas:
- `/es/recursos/` / `/en/resources/`;
- `/es/recursos/juegos/` / `/en/resources/games/`;
- `/es/recursos/rutinas-imprimibles/` / `/en/resources/printable-routines/`;
- Tarjeta Iris conserva pareja ES/EN.

No se delegó la traducción.

## QA automática

Workflow independiente A1:

```text
R42 A1 Resources Games Routines QA
run 36241371415
job 108402384115
conclusion SUCCESS
```

Resultado del test:
- games_total 297;
- games_preserved_from_a2 252;
- games_new 45;
- game_contexts 9;
- game_types 5;
- routines_total 109;
- minimum_routines_required 92;
- routines_with_svg_download 109;
- watermark IRIS GREEN · irisgreen.eu;
- arasaac_used false;
- languages es/en.

También:
- JS syntax PASS;
- `git diff --check` PASS;
- handoff HEAD/tree verificados antes del test.

Test versionado:
`scripts/test_r42_recursos_juegos_rutinas.py`.

## Archivos del handoff R42

1. `assets/data/juegos-iris-data.js`
2. `assets/data/r42-games-metadata.json`
3. `assets/data/r42-routine-download-manifest.json`
4. `assets/juegos-iris.css`
5. `assets/juegos-iris.js`
6. `assets/recursos-iris.css`
7. `assets/rutinas-imprimibles.js`
8. `assets/tarjeta-iris.js`
9. `en/resources/games/index.html`
10. `en/resources/index.html`
11. `en/resources/iris-card/index.html`
12. `en/resources/printable-routines/index.html`
13. `es/recursos/index.html`
14. `es/recursos/juegos/index.html`
15. `es/recursos/rutinas-imprimibles/index.html`
16. `es/recursos/tarjeta-iris/index.html`
17. `scripts/test_r40_recursos_juegos.py`
18. `scripts/test_r41_recursos_juegos.py`
19. `scripts/test_r42_recursos_juegos_rutinas.py`

## Requisitos del bloque embebido aplicados

- bilingüismo ES/EN;
- lenguaje claro/no infantilizante;
- no diagnóstico como requisito;
- adolescencia/adultez/transversal;
- HTML existente preservado;
- keyboard y alternativas a drag;
- reduced motion;
- forced colors;
- imágenes acompañadas de texto;
- trazabilidad/licencia;
- minimización: sin cuentas ni envío de conducta;
- watermark en descargables Iris;
- no ARASAAC;
- no lenguaje público B0/B1/piloto/QA;
- play-first;
- no inventario técnico como UX.

No se declara conformidad WCAG/EN/ISO.

## Pendientes manuales / integración

A2 debe:
1. integrar el commit exacto sobre su HEAD vigente;
2. resolver conflictos sin degradar a listas/formularios;
3. build/CI sobre la web integrada;
4. publicar una única Deploy Preview;
5. revisar 1440×900 y 390×844;
6. probar teclado/foco/zoom/reflow/reduced motion/forced colors;
7. probar descarga SVG real en ES y EN;
8. realizar HUMAN QA de María.

Pendientes explícitos:
- revisión humana/perceptiva de play-first;
- móvil físico;
- lector de pantalla real;
- comprobación de impresión física;
- reconciliación final del pin exacto de licencia Mulberry.

Esto no bloquea el handoff técnico a A2, pero impide declarar producto final aceptado.
