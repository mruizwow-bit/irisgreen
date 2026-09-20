# SABIK_AYUDAS_ES_IMPLEMENTATION_PLAN_V1_READY

**Agente:** n.º 4 · Ayudas  
**Fase:** C1-I1 · Preparación de incorporación segura  
**Fecha:** 20/09/2026  
**PR:** #185  
**Base:** `agent4/sabik-web-content-expansion-audit-v1` @ `4e03a9e41626ba7358ee862d89a8925b9a6299fb`  
**Estado:** **READY para revisión Astra**. Preparación documental y machine-readable completa. **0 cambios en producción. NO MERGE.**

---

## 1. Decisiones de migración · 258/258

Cada registro actual tiene exactamente una `migration_decision` en:

`SABIK_AYUDAS_ES_VERIFICATION_REGISTER_V1.csv`

| migration_decision | Registros |
|---|---:|
| READY | **206** |
| HOLD_MODELING | **28** |
| HOLD_VERIFY | **21** |
| HOLD_DUPLICATE | **2** |
| HOLD_HISTORICAL | **1** |
| NEW_RESOURCE_PROPOSAL | **0 dentro de las 258 actuales** |
| **TOTAL ACTUAL** | **258** |

Los cinco recursos nuevos se registran por separado como `NEW_RESOURCE_PROPOSAL`.

### Regla aplicada

No se calculó `READY` como “258 menos incidencias”.

Cada fila fue adjudicada según:
- estado temporal;
- suficiencia de la fuente;
- si mezcla programa y convocatoria;
- si representa portal/agregador y no una ayuda única;
- duplicidad;
- condición histórica;
- posibilidad de migrar sin cambiar el significado.

---

## 2. Los 47 POR VERIFICAR

Se conserva `status = POR VERIFICAR` en las **47** filas.

Distribución de decisión de migración:

- **26** → `HOLD_MODELING`
- **21** → `HOLD_VERIFY`

Reglas públicas:

- permanecen fuera de **Abiertas ahora**;
- no se presentan como vigentes;
- muestran **Por verificar** de forma textual;
- conservan la fuente oficial;
- conservan `reviewed_at` y `next_review_at`;
- no se transforman en `ABIERTO`, `CERRADO` o `PERMANENTE` por inferencia.

---

## 3. Las 60 filas señaladas

La adjudicación individual está en:

`SABIK_AYUDAS_ES_MODELING_REVIEW_V1.csv`

Contiene exactamente **60 filas**.

| Resultado de adjudicación | Filas |
|---|---:|
| mantener / READY | 8 |
| dividir / HOLD_MODELING | 28 |
| verificar / HOLD_VERIFY | 21 |
| fusionar / HOLD_DUPLICATE | 2 |
| histórico / HOLD_HISTORICAL | 1 |
| **TOTAL** | **60** |

Cada fila incluye:
- id;
- problema;
- estado actual;
- decisión propuesta;
- acción;
- IDs afectados;
- fuente;
- motivo;
- resultado final propuesto.

---

## 4. Duplicidades · propuesta explícita

### `mur-2500` + `mur-familias-especiales`

Ambas filas:
- apuntan al mismo procedimiento 2792;
- reflejan la misma convocatoria histórica 2025;
- hoy tienen `status = HISTÓRICO`.

**Propuesta de resolución antes de publicar la nueva estructura:**

- identidad canónica del programa: `mur-familias-especiales`;
- `mur-2500` deja de ser una oportunidad independiente;
- conservar `mur-2500` como alias/histórico trazable de la convocatoria 2025;
- propuesta de futuro `program_id = mur-familias-especiales`;
- propuesta de convocatoria histórica `call_id = mur-familias-especiales:2025`;
- no borrar ninguna referencia histórica.

Ambas filas permanecen `HOLD_DUPLICATE` hasta aprobación Astra.

### `mur-alquiler`

No es duplicado, pero la URL actual corresponde a una convocatoria antigua.

**Propuesta:**
- mantener `program_id = mur-alquiler` como identidad estable del programa;
- conservar la convocatoria antigua como `call_id = mur-alquiler:2021-2022`;
- estado de esa convocatoria: `HISTÓRICO`;
- una futura convocatoria nueva reutiliza el mismo `program_id`, no crea un programa nuevo.

Permanece `HOLD_HISTORICAL`.

---

## 5. Programas y convocatorias

### Regla

**PROGRAM**
- identidad estable;
- no se recrea cada año;
- describe qué es el programa y quién puede entrar en su ámbito.

**CALL**
- edición/convocatoria concreta;
- tiene apertura/cierre;
- puede ser ABIERTO, CERRADO, PRÓXIMA CONVOCATORIA o HISTÓRICO;
- referencia un `program_id`.

### Ejemplos propuestos

**PUA Cataluña**
- programa: `program_id = cat-pua`
- convocatoria actual: `call_id = cat-pua:2026`

**Becas Equidad**
- programa estable propuesto: `program_id = cat-equitat`
- convocatoria: `call_id = cat-equitat:2026-2027`
- el ID actual `cat-equitat-2627` no se renombra en producción hasta autorización.

**Renta / títulos / servicios permanentes**
- normalmente son `RESOURCE` o `PROGRAM`;
- no necesitan un `call_id` si no dependen de una convocatoria.

### IDs nuevos

No se crean silenciosamente durante C1-I1.

Los `call_id` indicados aquí son **propuesta de convención** y requieren revisión Astra antes de alterar el dataset público.

---

## 6. Históricos

Los tres registros con `status = HISTÓRICO` siguen fuera de cualquier listado de oportunidad vigente:

- `mur-2500`
- `mur-familias-especiales`
- `mur-alquiler`

Regla pública:
- no aparecen en **Abiertas ahora**;
- pueden consultarse desde histórico si se decide ofrecer esa vista;
- deben indicar qué periodo/convocatoria representan;
- no se actualizan borrando su historia cuando aparezca una nueva convocatoria.

---

## 7. Ocho sustituciones de URL

Changeset exacto:

`SABIK_AYUDAS_ES_URL_CHANGESET_V1.csv`

Contiene exactamente **8** filas con:

- ID;
- old_url;
- new_url;
- motivo;
- fecha de comprobación;
- resultado HTTP/navegación disponible;
- autoridad oficial;
- rollback.

### Regla

- `previous_url` se conserva.
- El rollback es posible restaurando `old_url`.
- No se borra trazabilidad.
- Una URL nueva no se aplica si no pasa la revisión previa al batch.

### Excepción de seguridad

`mallorca-ayudas-discapacidad-2026`:
- la herramienta web no pudo abrir old/new durante C1-I1;
- la propuesta queda en changeset, pero requiere **recheck manual** antes de incorporación;
- no debe automatizarse ese cambio solo por estar listado en el CSV.

---

## 8. Cinco recursos nuevos

Artefacto:

`SABIK_AYUDAS_ES_NEW_RESOURCE_PROPOSALS_V1.csv`

Los cinco llevan:

`migration_decision = NEW_RESOURCE_PROPOSAL`

y **no forman parte de las 258 filas actuales**.

1. Castilla-La Mancha · Fomento de la Autonomía Personal (Centros de Día)
2. Melilla · Bono-Taxi para personas con movilidad reducida
3. Melilla · Ayudas técnicas
4. Melilla · Adaptación funcional y acondicionamiento de vivienda
5. Melilla · Ayudas para gastos de desplazamientos

Comprobación inicial:
- 0 coincidencias exactas de ID;
- 0 coincidencias exactas de nombre;
- 0 coincidencias exactas de URL.

Esto **no equivale** a descartar solapamiento semántico. Antes de incorporar cada uno debe revisarse que no duplique otra ficha con formulación diferente.

---

## 9. Schema público propuesto

Archivo machine-readable:

`SABIK_AYUDAS_ES_PUBLIC_SCHEMA_V1.json`

Campos mínimos incluidos:

- `id`
- `name`
- `jurisdiction`
- `category`
- `resource_type`
- `status`
- `program_id`
- `call_id`
- `opens_at`
- `closes_at`
- `official_url`
- `previous_url`
- `reviewed_at`
- `next_review_at`
- `source_authority`
- `summary`
- `eligibility_summary`
- `what_it_offers`
- `documents_summary`

Además se proponen:
- `record_kind` = PROGRAM / CALL / RESOURCE
- `source_is_primary` = boolean

No incluye datos personales del usuario.

### Condiciones del schema

- `status` solo admite los seis estados autorizados.
- Un `CALL` exige `program_id` y `call_id`.
- Un `ABIERTO` exige `closes_at` y `source_is_primary = true`.
- Las fechas públicas usan ISO 8601 en datos y se muestran como fecha absoluta en interfaz.

---

## 10. Orden visible de cada recurso

La presentación pública propuesta es exactamente:

1. **Estado actual**
2. **Hasta cuándo**
3. **Qué es**
4. **Quién puede pedirlo**
5. **Qué ofrece**
6. **Qué necesitas**
7. **Dónde se solicita**
8. **Fuente oficial**
9. **Revisado el**
10. **Próxima revisión**

Reglas:
- el estado siempre se expresa con texto;
- el color nunca es la única señal;
- `Hasta cuándo` muestra una fecha absoluta o “No depende de convocatoria ordinaria” cuando corresponda a PERMANENTE;
- `Quién puede pedirlo` no usa “te corresponde”;
- los requisitos esenciales no se ocultan en tooltips.

---

## 11. Filtro «Abiertas ahora»

Un registro solo puede entrar si se cumplen **todas** estas condiciones:

```text
status == "ABIERTO"
AND source_is_primary == true
AND official_url is present
AND closes_at is present
AND current_date <= closes_at
AND (opens_at is null OR current_date >= opens_at)
AND next_review_at is present
AND current_date <= next_review_at
```

### Exclusiones obligatorias

No entran:
- POR VERIFICAR
- CERRADO
- HISTÓRICO
- PRÓXIMA CONVOCATORIA
- PERMANENTE

Los recursos PERMANENTE pueden tener su propio filtro, pero **no** se etiquetan como “abiertos ahora”.

### Caducidad

Si `current_date > next_review_at`:
- el recurso sale de **Abiertas ahora**;
- requiere nueva revisión;
- no cambia automáticamente a otro estado.

Si `current_date > closes_at`:
- deja de ser elegible para **Abiertas ahora**;
- el cambio de estado a CERRADO debe quedar trazado por revisión/mantenimiento, no por reescritura silenciosa del historial.

---

## 12. Diff previsto · no ejecutado

### En PR #185 / C1-I1

Solo documentación y registros de preparación bajo:

`docs/audits/agent4/ayudas/`

No se modifica:
- directorio público;
- runtime;
- scripts;
- HTML de producción;
- almacenamiento;
- frontend.

### Tras autorización Astra

**Diff de contenido esperado:**

1. Fuente canónica de Ayudas España:
   - `es/tramites/directorio/tramites-datos.json`
   - normalizar campos aprobados;
   - aplicar únicamente las decisiones autorizadas;
   - conservar `previous_url`;
   - mantener los HOLD fuera del batch automático.

2. Resultado público:
   - debe generarse mediante el pipeline existente;
   - no editar manualmente el HTML generado para “hacer coincidir” estados.

3. Si el renderer actual no admite `program_id`, `call_id`, estados o fechas:
   - el cambio de frontend/runtime debe salir en **PR técnico independiente**;
   - Agente 4 entrega el contrato de contenido, no corrige esa capa en este PR.

### Batch inicial propuesto

- **206 READY**: candidatos a migración de contenido una vez aprobado el schema.
- **28 HOLD_MODELING**: no migrar como ficha única.
- **21 HOLD_VERIFY**: conservar sin afirmar vigencia y fuera de “Abiertas ahora”.
- **2 HOLD_DUPLICATE**: resolver identidad antes del batch.
- **1 HOLD_HISTORICAL**: conservar como histórico.
- **5 NEW_RESOURCE_PROPOSAL**: incorporar solo tras aprobación y comprobación semántica de duplicados.

---

## 13. Criterios previos al batch

Antes de modificar producción:

- [ ] Astra aprueba las 258 decisiones.
- [ ] Astra aprueba las 60 adjudicaciones.
- [ ] Se resuelve la identidad canónica Murcia 2792.
- [ ] Se valida la convención program_id/call_id.
- [ ] Se aprueban o rechazan las 8 URL changes.
- [ ] Se vuelve a comprobar manualmente la URL Mallorca pendiente.
- [ ] Se revisan los 5 candidatos por solapamiento semántico.
- [ ] Se decide qué HOLD pueden seguir visibles como “Por verificar”.
- [ ] Se valida el schema con el equipo técnico sin introducir captura de datos personales.

---

## 14. Validación final del Agente n.º 4

- Registro: 258/258 filas con una única `migration_decision` válida.
- READY: 206.
- POR VERIFICAR: 47; ninguna cambia de estado; 26 HOLD_MODELING + 21 HOLD_VERIFY.
- Modeling review: 60/60 filas, sin campos obligatorios vacíos y coherente con el registro.
- Históricos Murcia: 3/3 retenidos; duplicidad 2792 propuesta de forma explícita.
- URL changeset: 8/8 con old_url, new_url, motivo, comprobación, fuente y rollback. Recheck externo 20/09/2026: 7 nuevas rutas navegables; Mallorca permanece pendiente de recheck manual antes del batch.
- Nuevos recursos: 5/5 como NEW_RESOURCE_PROPOSAL, separados del corpus actual.
- Filtro «Abiertas ahora»: 16/16 fichas ABIERTO pasan simultáneamente plazo, fuente primaria y revisión vigente a 20/09/2026.
- Diff C1-I1: solo `docs/audits/agent4/ayudas/`; 0 cambios en directorio público/runtime/scripts/frontend.

## 15. Estado C1-I1

**258 decisiones de migración: completas.**  
**60 adjudicaciones: completas.**  
**8 URL changes: preparados.**  
**5 recursos nuevos: NEW_RESOURCE_PROPOSAL.**  
**Schema: propuesto y versionado.**  
**Filtro Abiertas ahora: definido.**  
**Producción modificada: 0 archivos.**

**NO MERGE.**
