# PRISMA · CIELO Y ESPACIO · FRONTEND SHELL R01

Fecha: 03/10/2026

Gate objetivo:
`SPACE_SECTION_FRONTEND_SHELL_READY_FOR_ASSET_INTAKE`

Branch:
`prisma/space-section-frontend-shell-r01-20261003`

Base funcional:
`PRISMA_INTEREST_ASSET_CARDS_FOUNDATION_R01_PASS`

Base main original:
`411f8eb9cfd7c0baf17a9e6b773fdafc222502ef`

## Orden

Preparar componente/card/scene shell para las 5 entradas sin esperar a que termine producción visual.

## Entradas

1. Cielo nocturno / Night sky — ruta ACTIVE
2. Planetas y sistema solar / Planets and the Solar System — ruta ACTIVE
3. Exoplanetas / Exoplanets — ruta ACTIVE
4. Eclipses / Eclipses — ruta ACTIVE
5. Meteoros / Meteors — ruta PENDING

La quinta entrada se identifica por la cola canónica:
`INTEREST_05_METEORS_PRODUCT_CONTENT_REUSE_AND_ASSET_BRIEF_PASS`.

Prisma NO inventa una ruta para Meteoros antes de su contrato de producto.
El slot existe, pero no es enlace.

## Visuales

Los cinco slots nacen:
`assetStatus = pending`

Consecuencia:
- 0 `<img>` de master;
- 0 `src` de master;
- 0 solicitudes de bytes de master.

Cuando un visual de Croma/otro productor pase revisión y packaging:
1. cambiar SOLO ese item a `assetStatus: approved`;
2. añadir path canónico `src`;
3. añadir dimensiones/alt si aplican;
4. el shell activa lazy loading;
5. los demás slots siguen pending.

## UX

- responsive desktop/tablet/mobile;
- mobile explícito 320/390;
- LIGHT / DARK local al componente;
- enlaces nativos para rutas activas;
- quinta entrada no clicable hasta contrato de ruta;
- focus visible;
- forced-colors;
- no overflow horizontal;
- noscript con las cuatro rutas activas y quinta como estado textual.

## Contenido

Las descripciones de las cuatro rutas existentes se preservan desde el `main` observado.
Prisma no reescribe contenido factual.

Meteoros no recibe descripción factual hasta brief de Senda.

## Archivos

- `assets/ig-space-section-shell.css`
- `assets/ig-space-section-shell.js`
- `assets/ig-space-section-init.js`
- `assets/data/space-section-shell.es.json`
- `assets/data/space-section-shell.en.json`
- `es/intereses/index.html`
- `en/interests/index.html`
- `scripts/test_prisma_space_section_shell.py`
- `.github/workflows/prisma-space-section-shell.yml`

No masters astronómicos creados.
No main.
