# R40-A5 · matriz de pruebas de privacidad y almacenamiento

Estado: **propuesta reproducible; no ejecutada contra producto porque A2 aún no ha congelado HEAD**.

Leyenda:
- **AUTO**: automatizable en navegador/test harness.
- **MANUAL**: requiere comprobación humana.
- Fases: **P0** base común, **P4** Tus intereses/Mi colección, **P5** conexiones.

| ID | Fase | Tipo | Caso | Resultado esperado |
|---|---|---|---|---|
| T-A5-01 | P0/P4 | AUTO | Guardar explícitamente una referencia en Mi colección y recargar | misma referencia por ID canónico; sin duplicado |
| T-A5-02 | P0/P4 | AUTO | Abrir/buscar/filtrar 20 elementos sin pulsar Guardar | cero nuevas entradas persistentes |
| T-A5-03 | P0/P4 | AUTO | Retirar un elemento y luego borrar Mi colección; recargar | elemento/colección no reaparecen; proyectos intactos |
| T-A5-04 | P0/P4 | AUTO | Progreso desactivado; recorrer experiencias/checkpoints | cero entradas de progreso |
| T-A5-05 | P0/P4 | AUTO | Activar progreso, guardar marcadores, borrar progreso | solo progreso cambia; colección/proyectos intactos |
| T-A5-06 | P0/P4/P5 | AUTO+MANUAL | Guardar en ES, cambiar a EN y volver a ES | misma identidad; etiquetas correctas por idioma; no se traduce texto libre |
| T-A5-07 | P0 | AUTO | Guardar proyecto, recargar y abrir | payload validado byte/estructura-equivalente y misma revisión |
| T-A5-08 | P0/P5 | AUTO | Exportar proyecto e importar en estado vacío | round-trip conserva project_type/payload; nuevo ID si política lo exige; sin red |
| T-A5-09 | P0 | AUTO | Importar JSON truncado, sintaxis inválida y campos requeridos ausentes | rechazo seguro; cero escritura; proyecto previo intacto |
| T-A5-10 | P0 | AUTO | Importar payload con `__proto__`, `prototype`, `constructor`, HTML/script y URL remota | rechazo o tratamiento como datos según validator; nunca ejecución, fetch ni prototype mutation |
| T-A5-11 | P0 | AUTO | Importar `contract_version`/`schema_version` futura | error unsupported; archivo/estado local existente no se modifica |
| T-A5-12 | P0 | AUTO | Migrar fixture vN→vN+1 válido dos veces | salida válida; segunda migración idempotente; sin red |
| T-A5-13 | P0 | AUTO | Forzar fallo a mitad de migración | rollback completo; versión anterior legible |
| T-A5-14 | P0 | AUTO+MANUAL | Simular `QuotaExceededError` al guardar/importar | cero parcial; borrador sigue en memoria; datos previos intactos; no fallback a red |
| T-A5-15 | P0/P4 | MANUAL+AUTO | Navegación privada/storage no disponible | app funciona en memoria; estado indica sesión temporal; no afirma “guardado” persistente |
| T-A5-16 | P0/P4/P5 | AUTO | Espiar `fetch`, XHR, `sendBeacon`, WebSocket y seam Sabik durante add/remove/progress/save/export/import/migration | cero llamadas provocadas por datos locales |
| T-A5-17 | P0 | MANUAL+AUTO | Proyecto contiene texto sintético que parece PII | no sale a red/log; export avisa que el archivo contiene lo escrito por la persona |
| T-A5-18 | P0 | AUTO | Dos pestañas guardan mismo project_id con revisiones divergentes / import colisiona ID | conflicto detectado; ninguna sobrescritura silenciosa |
| T-A5-19 | P0 | AUTO | Sembrar claves ajenas al namespace y ejecutar todas las operaciones R40 | claves ajenas byte-idénticas; R40 solo usa namespace/stores reservados |
| T-A5-20 | P0 | AUTO+MANUAL | Crear muchos proyectos hasta umbral configurado y aproximarse a cuota | no crecimiento oculto; rendimiento razonable; herramientas de borrar/exportar; aviso antes de fallo cuando sea posible |
| T-A5-21 | P0/P4 | AUTO | Borrar todos los datos R40, recargar y abrir segunda pestaña | collection/progress/projects vacíos; no recuperación oculta |
| T-A5-22 | P0 | MANUAL | Revisar exportación con título/texto libre sintético | archivo contiene solo proyecto; no colección/progreso/tokens/historial; copia clara ES/EN antes de exportar |
| T-A5-23 | P5 | AUTO | Ir Interés→Taller→Cuaderno usando conexión P5 | solo IDs permitidos de navegación; no se pasan colección/progreso/payload del proyecto |
| T-A5-24 | P5 | AUTO | Invocar una conexión P5 mientras existe un proyecto con texto marcador único | marcador no aparece en URL, DOM de navegación ajeno, petición de red ni llamada Sabik |
| T-A5-25 | P0/P4 | AUTO | Guardar misma referencia varias veces | operación idempotente; un solo elemento |
| T-A5-26 | P0 | AUTO | Eliminar un proyecto concreto | solo ese proyecto desaparece; export anterior queda fuera del control del navegador y no se modifica |
| T-A5-27 | P0 | AUTO | Cancelar importación después de validarla pero antes de confirmar | cero escritura |
| T-A5-28 | P0 | AUTO | Archivo supera `MAX_IMPORT_BYTES` | rechazo antes de parsear; sin consumo/deserialización completa y sin escritura |
| T-A5-29 | P0 | AUTO | Payload supera profundidad/nodos/strings definidos | rechazo determinista; sin crash; sin escritura |
| T-A5-30 | P0/P4 | MANUAL | Mensajes de memoria temporal, cuota, importación inválida y borrado en ES/EN | significado equivalente, claro y no alarmista; no contiene jerga técnica innecesaria |
| T-A5-31 | P0 | AUTO | Desactivar progreso con datos existentes según decisión UX final | comportamiento coincide con la decisión documentada; no quedan datos ocultos |
| T-A5-32 | P0 | AUTO | Fallo de storage inicial y posterior recuperación | no bucle de reintentos; transición controlada solo tras acción/estrategia definida |
| T-A5-33 | P0/P4/P5 | AUTO | Inspeccionar almacenamiento tras navegación extensa sin guardar | no historial de páginas, consultas Sabik, términos de búsqueda, tiempos o contadores |
| T-A5-34 | P0 | AUTO | Importar project_type no registrado | rechazo `IMPORT_INVALID_SCHEMA`/equivalente; no fallback genérico que acepte payload |
| T-A5-35 | P0 | AUTO | Guardar proyecto con `expectedRevision` obsoleto | `PROJECT_REVISION_CONFLICT`; versión nueva no pisa la existente |

## Gates por fase

### P0

Obligatorios antes de aceptar persistencia:

- T-A5-02, 04, 07–21, 25–35.
- Ningún proyecto puede implementarse sin schema específico de `project_type`.
- Cuota, private mode y migración son gates, no “casos raros”.

### P4

Obligatorios para Mi colección/Intereses:

- T-A5-01–06, 15–16, 21, 25, 30, 33.
- Guardar una ficha no puede guardar la consulta que llevó hasta ella.
- Cambio ES/EN no puede duplicar items.

### P5

Obligatorios para conexiones:

- T-A5-06, 16, 23, 24, 33.
- Las conexiones solo transportan IDs de catálogo/plantilla permitidos.
- Nunca adjuntar proyecto, colección o progreso a Sabik.

## Qué automatizar

Adecuado para automatización:

- schema/import parser;
- migraciones y rollback;
- idempotencia;
- revisión/concurrencia;
- borrado y reload;
- detección de red con spies;
- cuota simulada;
- colisiones de namespace;
- idioma a nivel de identificadores;
- validación de payloads hostiles.

## Qué requiere revisión humana

- claridad ES/EN de los avisos;
- que “Guardado” no aparezca cuando solo existe memoria;
- comprensión del borrado y del alcance de archivos exportados;
- ausencia de patrones que empujen a guardar/progreso;
- comportamiento real de navegación privada en Safari/Firefox/Chromium;
- experiencia de recuperación de cuota/conflicto sin sobreestimulación.

## Evidencia esperada después del freeze

Para cada ejecución posterior:

- HEAD exacto de A2/integración;
- navegador/versión;
- modo normal/privado;
- backend local real usado;
- resultado PASS/FAIL por ID;
- capturas solo donde sean necesarias y sin contenido personal;
- cero payloads de usuario en logs/artefactos;
- pendientes manuales separados de tests automáticos.
