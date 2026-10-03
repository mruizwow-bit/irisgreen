# PRISMA · INTEREST ASSET CARDS · FOUNDATION R01

Fecha: 03/10/2026

Estado objetivo:
`PRISMA_INTEREST_ASSET_CARDS_FOUNDATION_R01_PASS`

## Propósito

Preparar el montaje web reutilizable mientras los productores visuales siguen trabajando, sin conectar masters que todavía no hayan pasado su gate visual.

Incluye:
- cards;
- responsive;
- 320 / 390;
- LIGHT / DARK;
- interacción por botón/teclado;
- focus visible;
- forced-colors;
- lazy loading;
- bloqueo técnico de assets no aprobados.

## Contrato de asset

Un item solo recibe `src` si:

`assetStatus === "approved"`

Estados:
- `approved` → puede entrar en el lazy loader;
- `pending` → no crea `<img>` ni solicita bytes;
- `unavailable` → no crea `<img>`.

Por tanto, disponer de un filename o un master en Library NO basta para cargarlo en web.

Antes de marcar `approved`, el integrador debe tener:
- gate de Astra/María correspondiente;
- path canónico empaquetado;
- SHA/manifest/provenance cuando aplique;
- etiqueta pública necesaria;
- alt/semántica acordada.

## Lazy

Para assets aprobados:
- `loading="lazy"`;
- `decoding="async"`;
- `IntersectionObserver` con root margin 320 px;
- fallback sin IntersectionObserver: carga aprobados normalmente.

Los pending nunca entran en el observer.

## Temas

Componente:
- LIGHT;
- DARK.

No modifica el tema global del sitio.
El consumidor decide si sincroniza el componente con preferencias globales.

## Interacción

Cada card expone un botón nativo.
Activación:
`onActivate(id, item, article)`

Prisma NO fija aquí:
- navegación;
- algoritmo astronómico;
- selección factual;
- state model de Sistema Solar.

Esos contratos pertenecen al producto/runtime que consuma las cards.

## B01 Solar

Puede prepararse la configuración para:
- Sol;
- Mercurio;
- Venus;
- Tierra.

Pero NO conectar B01 completo hasta PASS global.

Estado observado al crear este foundation:
- Mercurio R04 = `KEEP_LOCKED`;
- Sol/Venus/Tierra = R05 REWORK;
- B01 global = NO PASS.

Por tanto esta foundation contiene infraestructura y QA, no masters solares.

## Archivos

- `assets/ig-interest-asset-cards.css`
- `assets/ig-interest-asset-cards.js`
- `tools/prisma/interest-asset-cards-fixture.html`
- `scripts/test_prisma_interest_asset_cards.py`
- `.github/workflows/prisma-interest-asset-cards.yml`

## Gate de QA

- 320 / 390 / 1440;
- sin overflow horizontal;
- targets >=44 px;
- LIGHT / DARK;
- interacción;
- solo approved solicita asset;
- pending = 0 requests;
- 0 HTTP errors;
- 0 JS errors;
- capturas 390 / 1440.

No main.
No master astronómico generado.


## QA ejecutado

Estado:
`PRISMA_INTEREST_ASSET_CARDS_FOUNDATION_R01_PASS`

GitHub Actions:
- run: `37098791715`
- job: `111134050499`
- conclusión: **SUCCESS**

Casos:
- 320 px: PASS;
- 390 px: PASS;
- 1440 px: PASS.

En cada caso:
- `forbidden_asset_requests = 0`;
- LIGHT / DARK = PASS;
- activación = PASS;
- pending no crea `<img>`;
- solo approved recibe `src`;
- 0 HTTP errors;
- 0 JS errors.

Artifact:
`prisma-interest-asset-cards`
ID:
`11265356952`

SHA-256 del ZIP de artifact:
`dad69b9f854e617b19f03930155a3b731f05daaa28a20bc581878a9f5a1ddf61`

## Cierre

Foundation web lista para conectar tandas cuando tengan PASS.
No implica aprobación de B01 Solar.
No masters solares conectados.
No main.
