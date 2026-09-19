# Workspace Claude · revisión de Sabik

Orden completa: issue #147.  
Epic: #145.  
Programa: PR #144.  
PR de esta rama: #162 (draft).

## Alcance de esta rama

Solo revisión independiente, documentación y fixtures no ejecutables. No modificar runtime durante S0.

Archivos permitidos:

- `docs/sabik/reviews/**`
- `tests/fixtures/sabik/**` (esta revisión usa `tests/fixtures/sabik/review/` para no colisionar con QA)

No tocar `main`, producción ni los archivos asignados a Codex en S0.

## Entregables

| Documento | Contenido |
|---|---|
| [`00-resumen-y-bloqueantes.md`](00-resumen-y-bloqueantes.md) | Leyenda de evidencia, bloqueantes P0, veredicto S0 e índice |
| [`01-inventario-estados.md`](01-inventario-estados.md) | Estados declarados, usados, libres, inalcanzables, duplicados y contradictorios; mapa estado → interfaz; adaptaciones que parecen inferencia |
| [`02-riesgos-migracion.md`](02-riesgos-migracion.md) | Riesgos por área (pausa, ocultar, intensidad, corto, correcciones, fuentes, riesgo, lectores, voz, lectura, móvil, idioma, pruebas) |
| [`03-corpus-conversacional.md`](03-corpus-conversacional.md) | Corpus conversacional y resultado actual |
| [`04-seguridad-conversacional.md`](04-seguridad-conversacional.md) | Corpus de seguridad, niveles y propuestas sin consejo clínico |
| [`05-recursos-humanos-esquema.md`](05-recursos-humanos-esquema.md) | Esquema editorial, huecos y datos que no pueden inventarse |
| [`06-revision-conocimiento.md`](06-revision-conocimiento.md) | Auditoría de concepts, relations, actions, questions, procedures, human-resources e índice |
| [`07-indice-funcional.md`](07-indice-funcional.md) | Intención funcional y unidad recuperable |
| [`08-revision-s0.md`](08-revision-s0.md) | Revisión de PR #161: **BLOQUEADO_S0** |
| [`evidencia/sondeo-runtime.md`](evidencia/sondeo-runtime.md) | Método y resultados de las ejecuciones |

Fixtures: [`tests/fixtures/sabik/review/`](../../../tests/fixtures/sabik/review/README.md).

## Marcas de evidencia

**[H]** hecho comprobado · **[I]** inferencia · **[P]** propuesta de diseño · **[E]** decisión editorial pendiente.
