# IRIS GREEN · NUEVA ARQUITECTURA WEB R01 · REBUILD PARALELO

Fecha: 2026-10-04
Autoridad: María
Coordinación: Nexo
Fuente de producto/monetización: Cifra R01 + decisión de reestructuración de María

Estado:
`NEW_WEB_INFORMATION_ARCHITECTURE_R01_ACTIVE`

## 1 · Principio

La arquitectura antigua no se usa como molde para la reconstrucción.

Regla:
`LEGACY_INFORMATION_ARCHITECTURE != NEW_PRODUCT_ARCHITECTURE`

Las áreas nuevas son productos de primer nivel distintos.

Navegación objetivo:
`Inicio · Información · Recursos · Juegos · Descubrimiento · Creación · Espacio tranquilo`

Sabik:
`PERSISTENT_ASSISTANT_NOT_NAV_CATEGORY`

## 2 · Áreas

### Información
Agrupa conocimiento público:
- Condiciones
- Situaciones
- Vida diaria
- Ayudas y trámites
- Vivir fuera
- Datos
- Investigación
- Vídeos
- Cuestionarios

Regla:
`INFORMATION = FREE`

No paywall general.
No cuenta obligatoria para leer.

### Área de Recursos
Producto propio, NO padre de Juegos.

Incluye:
- Tarjeta Iris
- Rutinas visuales
- Rutinas imprimibles
- pictogramas
- herramientas prácticas de apoyo/autonomía

Frontera:
- core esencial/práctico = FREE
- biblioteca extensa, packs, organización/exportación avanzada = PLUS

### Área de Juegos
Producto propio de primer nivel.

No vive dentro de Recursos.

FREE:
- selección permanente de juegos completos
- Contar y pagar
- sin vidas/energía/temporizadores comerciales

PLUS:
- catálogo completo
- futuras tandas
- favoritos/colecciones/progreso si existen

### Área de Descubrimiento
Sustituye "Tus intereses".

Contrato de producto:
`EXPLORE → LOCATE → REVEAL`

FREE:
- factual
- fuentes
- galerías/listados básicos
- muestra interactiva útil

PLUS:
- experiencia interactiva completa
- mapas/3D/tiempo/simulaciones/capas/filtros/colecciones

### Área de Creación
Sustituye "El taller" como categoría principal.

Dentro puede seguir existiendo lenguaje "estudios"/"talleres".

FREE:
- conjunto real de estudios completos de muestra

PLUS:
- suite completa
- herramientas avanzadas
- proyectos/exportaciones avanzadas

### Espacio tranquilo
Sustituye "Rincón tranquilo" como nombre de navegación.

Regla:
`CALM_SPACE = FREE_ALWAYS`

No upsell dentro.
No paywall.
No mensajes comerciales en la experiencia de regulación.

## 3 · Libros

Libros mantiene modelo editorial propio.

No mezclar automáticamente con el paywall general.
Las páginas informativas/muestras permanecen accesibles según política editorial.

## 4 · Pagos

Payments R01 queda desacoplado de la IA.

Stripe gestiona:
- checkout
- billing
- customer portal
- webhooks

Iris Green gestiona entitlements:
`FREE / RESOURCES / GAMES / DISCOVERY / CREATION / FULL`

No codificar acceso por texto de producto/precio.

No cobros reales antes de:
`PAYMENTS_TEST_MODE_E2E_PASS`
y:
`PAYMENTS_LIVE_MODE_AUTHORIZED_BY_MARIA`

## 5 · Rebuild paralelo

Rincón/Espacio tranquilo:
`KEEP_CURRENT_WORKING_BASE`

Resto de zonas:
`BUILD_NEW_IN_PARALLEL`

No parchear la IA legacy para convertirla en nueva.

Secuencia:
`BASELINE → NEW SURFACE → TECH QA → HUMAN QA → FREEZE → RECONCILE LIVE MAIN → CUTOVER → POST-CUTOVER QA → RETIRE LEGACY`

## 6 · Rutas objetivo y rutas de trabajo

### Información
Ruta final propuesta:
- ES `/es/informacion/`
- EN `/en/information/`

Puede crearse ya como nueva superficie `noindex` mientras no esté aprobada.

### Juegos
Ruta final propuesta:
- ES `/es/juegos/`
- EN `/en/games/`

IMPORTANTE:
NO usar `/es/recursos/juegos/` como base nueva.
Esa ruta queda legacy hasta cutover.

Como `/es/juegos/` no existe hoy como ruta canónica de producto nuevo, puede construirse ya aislada y noindex, sin necesidad de una ruta "nueva-base" temporal.

### Descubrimiento
Ruta final propuesta:
- ES `/es/descubrimiento/`
- EN `/en/discovery/`

No construir nueva base bajo `/es/intereses/`.
`/es/intereses/` queda legacy hasta cutover.

### Creación
Ruta final propuesta:
- ES `/es/creacion/`
- EN `/en/creation/`

No construir nueva base bajo `/es/taller/`.
`/es/taller/` queda legacy hasta cutover.

### Recursos
Ruta final se mantiene:
- ES `/es/recursos/`
- EN `/en/resources/`

Como la ruta final ya está ocupada por legacy, el rebuild debe vivir temporalmente en:
- ES `/es/nueva-web/recursos/`
- EN `/en/new-web/resources/`

hasta cutover.

### Espacio tranquilo
La base actual se preserva.
No se rehace destructivamente.

## 7 · Reglas de aislamiento

Nuevas superficies:
- HTML propio
- CSS propio
- JS propio
- datos/adaptadores propios
- solo consumir globales estables y documentados

No reutilizar por defecto:
- `assets/juegos-iris.css/js`
- runtimes legacy de Taller/Intereses
- generadores legacy de hubs
- parches R40/R41/R42/R50 como base de producto

Pueden conservarse como donors/reference, no como arquitectura final.

## 8 · Main y Motor

Motor:
`BUSY_WITH_SABIK_WEB_ON_MAIN`

Regla:
`DO_NOT_INTERRUPT_MOTOR`

No tocar:
- Home
- Sabik
- assets Home/Sabik
- gates que Motor está moviendo

Las nuevas superficies deben evitar overlapping writes.

## 9 · Monetización y UX

Regla de empresa propuesta:
`KNOWLEDGE_RIGHTS_SAFETY_BASIC_SUPPORT = FREE`
`EXTENSIVE_CATALOGS_PLAY_ADVANCED_TOOLS_CREATION_INTERACTIVE_EXPERIENCES = PREMIUM`

Compra:
`ADULT_ZONE_ONLY`

No:
- paywall infantil dentro de juego
- compra impulsiva
- contador falso
- interrumpir actividad ya iniciada
- presión comercial en Espacio tranquilo

## 10 · Free/Plus no se incrusta todavía en cada prototipo

Primero:
- cerrar producto
- cerrar UX
- cerrar patrón

Después:
- marcar FREE/PLUS página por página y función por función
- conectar entitlements

No diseñar el producto alrededor del candado.

## 11 · Cutover

No borrar legacy antes.

Por zona:
1. new surface HUMAN QA PASS
2. fresh main drift check
3. reconcile shell/nav/global dependencies
4. build
5. Axioma
6. cutover at route/nav level
7. redirects from legacy when appropriate
8. production QA
9. rollback window
10. retire/delete legacy only after acceptance

Gate:
`ZONE_NEW_SURFACE_READY_FOR_ATOMIC_CUTOVER`

## 12 · Primera zona nueva

Primera candidata:
`AREA_DE_JUEGOS`

No empezar todavía el HTML hasta aprobar el contrato de página:
- purpose
- first viewport
- navigation
- free/plus framing
- prototype placement
- return/exit
- mobile
- ES/EN
- a11y

Siguiente documento:
`GAMES_AREA_NEW_PAGE_PRODUCT_CONTRACT_R01`
