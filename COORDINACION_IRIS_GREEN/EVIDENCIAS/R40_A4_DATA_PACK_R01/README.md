# R40-A4 · Data Pack R01 · handoff a P0 / Taller / Intereses

Estado: **R40_A4_DATA_PACK_READY**  
Fecha: 26/09/2026  
Issue: #257  
Base editorial: #250  
Arquitectura consumidora: #249

Este paquete transforma la preparación editorial/procedencia de A4 en datos estables para A3/P0. **No modifica producto** y no supone freeze de la rama A2.

## Archivos

### `r40-data-pack.schema.json`
Contrato machine-readable del paquete completo.

### `r40-data-pack.json`
Fuente integral de integración:

- 11 grupos de Intereses;
- 72 intereses;
- 43 `READY`;
- 29 `HOLD`;
- 6 áreas del Taller;
- 25 estudios;
- 8 `EXISTING`;
- 17 `PLANNED`;
- Cuaderno de Campo con su gate;
- 56 conexiones tipadas;
- procedencia `source/license/date/status` en **cada registro**.

### `r40-public-ready.json`
Payload filtrado para que una capa de producto no consuma accidentalmente un `HOLD`.

Contiene:

- 43 intereses READY;
- 25 estudios READY como definición editorial;
- 38 conexiones READY publicables;
- 0 estados HOLD;
- 0 conexiones hacia intereses HOLD;
- Cuaderno de Campo excluido mientras su gate global siga HOLD.

Solo aparecen 10 grupos en este payload porque el grupo **Seres vivos** no tiene todavía ningún interés READY con la procedencia actual. El catálogo integral conserva los 11 grupos.

### `r40-holds.json`
Los **29 HOLD exactos**, con:

- ID canónico;
- título ES/EN;
- fuente/autoridad;
- causa exacta;
- evidencia disponible;
- acción concreta necesaria para desbloquearlo.

No se elimina un HOLD editando el payload. Debe cerrarse la acción de procedencia y regenerarse el paquete.

### `r40-connections.json`
Export separado de las conexiones Intereses ↔ Taller ↔ Cuaderno.

Las relaciones tienen:

- endpoint origen/destino por ID;
- tipo de relación;
- clase de contenido;
- estado;
- flag `publicable`;
- procedencia propia.

A3 puede invertir una relación `study → interest` para presentar “Crear en el Taller” desde Intereses sin duplicar datos.

### `VALIDATION.json`
Validación determinista sobre los bytes comprometidos.

Resultado R01:

- **33 PASS**
- **0 FAIL**

Incluye integridad de IDs, referencias, conteos, endpoints, procedencia, set de HOLD y filtro publicable.

## Clases de contenido

El contrato usa únicamente cuatro clases:

- `REAL_DATA`: dato que se presenta como procedente del mundo real y exige fuente/procedencia.
- `SIMULATION`: cálculo, visualización o modelo. No equivale a una observación real.
- `USER_CREATED`: contenido creado por la persona o herramienta local.
- `FICTIONAL`: mundo, criatura, lengua o contenido inventado.

Estas clases pueden coexistir en capas de una misma experiencia, pero **nunca se convierten unas en otras**.

Ejemplo: un interés puede tener conocimiento `REAL_DATA` y una experiencia `SIMULATION`. La simulación no convierte su resultado en observación.

## Reglas de integración para A3

1. Usar IDs canónicos; no unir entidades comparando títulos traducidos.
2. Para catálogo/editorial, consumir `r40-data-pack.json`.
3. Para contenido que pueda entrar en una superficie pública sin resolver nuevas licencias, consumir `r40-public-ready.json`.
4. No cargar un interés `HOLD` desde otra fuente lateral para “completar” una vista.
5. No promocionar una conexión si el endpoint real que necesita está HOLD.
6. `EXISTING` / `PLANNED` del Taller describe disponibilidad de producto; no sustituye `READY/HOLD` de procedencia.
7. El Cuaderno de Campo permanece fuera del payload publicable mientras su gate de datos reales siga abierto.
8. No deducir rutas para los 17 estudios planificados ni para intereses aún no publicados; las rutas se fijan después del freeze/handoff de A2.
9. Si cambia una fuente/licencia/estado, regenerar el paquete y repetir `VALIDATION.json`; no parchear solo el JSON publicable.
10. No presentar `SIMULATION`, `USER_CREATED` o `FICTIONAL` como `REAL_DATA`.

## Qué significa READY aquí

- Interés READY: la ruta de datos/procedencia definida en #250 tiene una base reutilizable documentada.
- Estudio READY: su definición editorial/herramienta es original y puede formar parte del diseño P3.
- Conexión READY: la relación puede consumirse sin elevar un endpoint HOLD.
- READY **no significa** que la entidad ya esté implementada, montada, desplegada o aceptada visualmente.

## Qué no hace este paquete

- no toca HTML/CSS/JS;
- no añade assets;
- no publica ni descarga multimedia;
- no cambia la rama de A2;
- no crea rutas;
- no habilita Cuaderno de Campo;
- no toca voz/TTS;
- no hace deploy;
- no mergea a main.

## Handoff

A3 puede consumir este paquete ya para contratos P0 y preparación P3/P4.

La implementación sobre producto sigue esperando el freeze/handoff exacto de A2 indicado en #247/#249.
