# NEXO · AUDITORÍA GAME_FIRST · 14 JUEGOS · R41 §2 / §6

Fecha: 2026-10-07
Autoridad: María
Coordinación: Nexo
Fuente medida: worktree local autorizado IrisGreen
Rama observada: `atlas/first-party-assets-packaged-runtime-20261003`
HEAD observado: `69199a98e75db50bfdd171b7b3538f2b546b13b7`

## Método

Medición directa en Chrome real instalado en IrisGreen mediante Playwright + servidor HTTP local.
Viewports:
- 1440×900
- 390×844

Se bloquearon dependencias externas de fuentes; runtime y assets locales se sirvieron desde el worktree.

Importante:
- **primer control visible != primera acción jugable útil**;
- se revisó el texto/orden del runtime para identificar la acción que inicia el loop real;
- esta auditoría mide arquitectura de entrada, no HUMAN QA final.

Inventario vigente:
- 13 partidas interactivas históricas;
- + `Contar y pagar`, reclasificado por #369 como juego;
- total: **14/14**.

## Regla auditada

R41 §2:
- workspace / objeto activo antes que configuración secundaria;
- acción útil en primer viewport;
- ayuda/tutorial/configuración secundarios;
- progressive disclosure.

R41 §6:
- móvil específico;
- dock/sheet/flujo adaptado;
- no simple apilado vertical de desktop.

Contrato de producto:
`VER → PROBAR → CAMBIAR → OBSERVAR CONSECUENCIA → CREAR/RESOLVER`

## Resultado 14/14

| Juego | Primera acción útil · 1440 | Primera acción útil · 390 | Workspace primer viewport | Móvil | Acción → consecuencia / decisión | Estado |
|---|---:|---:|---|---|---|---|
| Cada cerebro, su camino | elegir problema ~366 px; elegir método ~589 px | problema ~381 px; método ~1054 px | parcial | **apila tarjetas de método de ~525 px**; página ~3814 px | decisión real entre métodos; consecuencia conceptual, poco feedback vivo | **REWORK** |
| Contar y pagar | pestañas ~441 px; dinero ~742 px | pestañas ~536 px; dinero ~1003 px | parcial | dinero real queda debajo del primer viewport; página ~4882 px | decisión real: pagar justo / billete / tarjeta | **REWORK** |
| ¿Dónde se fue la energía? | días ~641–734 px; fichas ~1333 px | días ~677 px; fichas ~1209 px | **orden invertido** | destinos antes que objetos; scroll largo | colocar ficha cambia semana/energía; decisión existe | **REWORK** |
| El archivo de capacidades | cestas ~391 px; cartas ~563 px | cestas ~437/539; primera carta ~750 px | sí en 1440, límite móvil | **desktop apilado**: página ~6971 px; cartas ~499 px cada una | clasificar capacidad; consecuencia simple | **REBUILD** |
| El aula al revés | primera decisión ~1128 px | ~770 px | **NO en desktop** | móvil mejora por apilado, pero lista de 17 decisiones sigue larga | clasificar ayuda/estorba/depende; repetición alta | **REBUILD** |
| El detective de los sentidos | cestas ~360 px; **primera carta ~1003 px** | cestas 406/951/1495; **primera carta ~2148 px = 2,55 pantallas** | **NO para la acción fuente** | **fallo severo §6**: destinos gigantes antes de cartas; página ~3927 px | concepto bueno, interacción invertida: primero ves dónde soltar antes de poder coger | **REBUILD · PRIORIDAD 1** |
| El mapa del tesoro de casa | modo ~349 px; marcar ~472–599 px | modo ~338; marcar ~569–838 px | sí | adaptación bastante compacta; página ~1166 px | tocar habitaciones produce mapa propio; decisión real | **KEEP + PATCH** |
| Traductor de casa | primera decisión ~599 px | ~669 px | sí | repetición vertical; página ~4049 px | decisión + escritura, pero parece formulario repetido | **REWORK** |
| Traductor de instrucciones | escritura ~567 px | ~709 px | sí | repetición vertical; página ~2664 px | reescribir produce traducción; causalidad débil/explicativa | **REWORK** |
| La cena de los planes | salida/personas ~409–565; cartas ~695 px | salida/personas ~455–716; cartas ~846+ | parcial | **cards de ~530–550 px apiladas**, página ~5384 px | elección real de necesidades; producto se parece más a planificación/práctica | **REWORK** |
| La consulta | **Tirar el dado ~1353 px** | **~1026 px** | **NO** | primer acto real fuera del viewport | bucle de tablero existe, pero se llega tarde al juego | **REBUILD** |
| La máquina de empezar | pasos ~447 px | primera tarjeta ~463; siguientes cada ~504 px | sí | **apilado vertical enorme**, página ~3660 px | ordenar pasos propios; útil pero más ROUTINE_PRACTICE que GAME | **REWORK** |
| Las cinco cosas que agotan a Vera | buscar en imagen ~450–888 px | ~504–730 px | sí | escena compacta; algunos hotspots medidos de **13–28 px** | buscar → encontrar → explicación; bucle lúdico claro | **KEEP + PATCH A11Y** |
| Palabra misteriosa | respuestas ~574 px | **respuestas ~1167 px** | sí desktop / **NO móvil** | definición/estructura empuja respuestas fuera del primer viewport | elegir → feedback inmediato; puzle claro | **REWORK MOBILE** |

## Conteo

- KEEP + PATCH: 2
- REWORK: 9
- REBUILD: 3

REBUILD:
1. Detective
2. Aula al revés
3. La consulta

## Hallazgo transversal

El defecto dominante NO es ausencia de controles.

Es uno de estos patrones:
1. destino antes que objeto/acción;
2. reset/configuración antes que gameplay;
3. tarjetas desktop apiladas verticalmente en móvil;
4. explicación completa antes de la consecuencia;
5. interacción repetitiva tipo formulario;
6. primer acto real fuera del viewport.

Por tanto:
**mover botones hacia arriba no resuelve R41.**

## Detective · por qué prioridad 1

En 390×844:
- cesta 1: y≈406, h≈528;
- cesta 2: y≈951;
- cesta 3: y≈1495;
- reset: y≈2088;
- primera carta jugable: y≈2148.

La persona ve durante más de dos pantallas **los destinos vacíos antes de ver aquello que tiene que clasificar**.

La cifra histórica “9,6 pantallas” pertenece a otra medición/base y NO se usa como dato actual.
Para esta base exacta, el blocker reproducido es:
**primera carta ≈ 2,55 viewports desde el inicio**.

## Decisión

No reconstruir 14 de golpe.

Orden:
1. Detective vertical slice;
2. retest R41 §2/§6;
3. HUMAN QA;
4. extraer patrón válido;
5. aplicar por olas según KEEP / REWORK / REBUILD.

NO MAIN · NO PUBLIC DEPLOY.
