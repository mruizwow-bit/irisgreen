# R49 · Interfaz R42/R02 transversal · decisión de María · 27/09/2026

Issue operativo: #311  
Responsable: Agente 8  
Estado: `R49_A8_TRANSVERSAL_R42_R02_ORDERED`

## Decisión

La interfaz R42/R02 deja de ser un piloto de Home o cinco superficies y pasa a ser el **sistema transversal de interfaz de Iris Green**.

A8 #305 / PR #310 se conserva como entrega válida de Home + child-safe y como donante del sistema, pero no cierra la propagación global.

## Perfiles

R42/R02 se adapta por tipo de superficie:

1. CONTENT · lectura estable.
2. BROWSE · índices/catálogos/directorios.
3. WORKSPACE · Taller/Intereses/Rincón/Juegos.

Una identidad común no implica una plantilla única.

## Layout

Decisión expresa de María:
**no dejar toda la interfaz centrada en una banda estrecha con dos laterales enormes vacíos.**

Regla:
`READING_WIDTH != PRODUCT_WIDTH`.

- texto largo: medida aproximada 65–75ch;
- página/producto: grid fluido;
- visuales/tablas/hubs pueden ensancharse;
- workspace: max-width none por defecto y gutters fluidos;
- Rincón: stage grande/inmersivo, no tarjeta centrada;
- Taller: Estructura/Inspector usan los laterales;
- Intereses: atlas/mapa/timeline/galería pueden ser wide/full-bleed.

QA obligatorio 1366/1440/1600/1920/2560 + móvil.

Dos bandas laterales grandes sin función = FAIL.

## Global chrome

Unificar experiencia visual de:
- header;
- footer;
- navegación;
- idioma;
- búsqueda;
- settings;
- IGPreferences;
- audience;
- child-safe.

No se exige borrar selectores legacy de golpe si hay adaptadores, pero el resultado visible final no puede sentirse como múltiples webs.

## Cobertura

Árbol A2 observado al emitir: 1.053 HTML.

R49 industrializa por build/manifest/profile, no mediante edición manual página a página.

Gate:
0 rutas públicas sin clasificación.

## Coordinación

R49 no reescribe:
- R46 Rincón;
- R47 Taller;
- R48 Intereses.

Esas áreas deben consumir el common chrome/material/layout R49.

A2 sigue siendo única puerta de integración.

## Final

Marcador:
`R49_A8_TRANSVERSAL_R42_R02_READY_FOR_ASTRA`.

A8 → Astra → A2 → preview integrada → HUMAN QA María.

No main/producción.
