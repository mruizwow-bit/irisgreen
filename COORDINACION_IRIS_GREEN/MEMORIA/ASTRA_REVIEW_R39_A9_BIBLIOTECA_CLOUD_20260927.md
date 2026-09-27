# Astra review · A9 Biblioteca Cloud Sabik · 27/09/2026

Issue: #306

## Estado

`R39_A9_SABIK_CLOUD_LIBRARY_ASTRA_REVIEW_FIX_REQUIRED`

La arquitectura A9 se conserva. La entrega NO se cierra todavía.

## PASS confirmado

- R38 permanece inmutable: 4.332 fragmentos / SHA canónico.
- Biblioteca nueva versionada, bilingüe y sellada.
- 604 ES + 604 EN.
- Server-only.
- Filtrado S2 antes del ranking.
- Hash/version/duplicados fail-closed.
- Team Login exterior activo.
- Deploy privado `sabik-asistente`, `published_at=null`.
- Sin producción/DNS/voz/LLM/frontend/datos de usuario.
- 203/203 tests reportados PASS.

## Bloqueante 1 · safe variants

En `build-cloud-library-v2.mjs`, los S2 de catálogo usan `x.d` tanto para el fragmento S2 como para la safe variant. Por tanto puede existir texto idéntico con distinta etiqueta.

Vida diaria/Investigación también derivan safe variants automáticamente de lede/primer párrafo, sin acreditar revisión editorial específica.

Corrección:
- safe variants solo desde el paquete child-safe revisado #302;
- no autogeneración;
- si no existe variante revisada, fail-closed;
- nunca relabel de mismo texto.

## Bloqueante 2 · URLs exactas

El builder infiere rutas por `slug(title)`.

Auditoría:
- ES Datos: 0 rotas.
- ES Vida diaria: 0.
- EN Vida diaria: 0.
- EN Datos: 2 rotas.

Dos registros `Employment and autism` deben usar:
- `/en/data/employment-and-autism-united-kingdom/`
- `/en/data/employment-and-autism-australia/`

La fuente ya contiene `slug_en`.

Corrección:
- usar rutas/slugs canónicos;
- validar 100 % de URLs;
- 0 broken citation URLs.

## Bloqueante 3 · HTTP autenticado

Se ha comprobado HTTP real exterior:
Team Login -> 401.

No se ha demostrado todavía:
Team Login autenticado -> bridge A9 -> QA handler -> Blobs -> resultados/citas.

Requiere HUMAN QA con sesión legítima, sin exportar cookies.

## Cobertura

A9 R01 usa snapshot público anterior:
- 372 catálogo;
- 49 Datos;
- 48 Vida diaria;
- 120 Investigación.

No consume todavía el paquete #302 de 965 registros / 16 S2.

Se considera candidato técnico R01, no biblioteca final sincronizada con la nueva web.

## Próximo marcador

`R39_A9_SABIK_CLOUD_LIBRARY_FIX_READY_FOR_ASTRA`
