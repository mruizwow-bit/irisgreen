# R40-A5 · threat model de datos locales

Alcance: Mi colección, progreso opcional, proyectos y exportación/importación para R40-P0/P4/P5.  
Fuera de alcance: transporte HTTP de Sabik, Cloud/Netlify, autenticación, voz/TTS y archivos de producto antes del freeze A2.

## Activos a proteger

1. Contenido de proyectos creado por la persona.
2. Selecciones de Mi colección.
3. Progreso opcional.
4. Integridad de datos locales durante migraciones/importaciones.
5. Separación estricta entre datos locales y asistente/terceros.
6. Capacidad de borrar y de seguir usando la web cuando la persistencia falla.

## Fronteras de confianza

- **Memoria de la página:** confiable solo durante la ejecución; no equivale a persistencia.
- **Almacenamiento del navegador:** local pero no infalible; puede tener cuota, ser borrado o compartido entre pestañas del mismo origen.
- **Archivo importado:** completamente no confiable.
- **Archivo exportado:** sale del control de Iris Green al guardarse en el dispositivo.
- **Sabik/red:** frontera prohibida para colección/progreso/proyectos.
- **Cambio de versión:** frontera de integridad; una migración defectuosa puede causar pérdida.

## Amenazas y controles

| ID | Amenaza | Escenario | Impacto | Controles obligatorios | Verificación |
|---|---|---|---|---|---|
| TM-01 | Datos personales accidentales | La persona escribe nombre, dirección o información sensible dentro de un proyecto | exposición si se envía/loguea/exporta sin entenderlo | no solicitar PII; local-only; no telemetría; aviso antes de exportar; borrado por proyecto/total | T-A5-17, T-A5-22 |
| TM-02 | Archivo corrupto | JSON truncado/malformado o schema incompleto | pérdida, crash, sobrescritura | parseo estricto; schema; validación antes de escribir; error seguro; estado anterior intacto | T-A5-09 |
| TM-03 | Importación hostil | `__proto__`, objetos gigantes, profundidad extrema, strings/arrays enormes | prototype pollution, DoS, XSS indirecto | tamaño pre-parse; límites; reject dangerous keys; plain-data only; nunca eval/innerHTML; validator por project_type | T-A5-10, 11, 12 |
| TM-04 | Crecimiento de storage | muchos proyectos/grandes payloads | cuota agotada, lentitud, pérdida aparente | presupuestos configurables; uso bajo acción explícita; manejo QuotaExceeded; herramientas borrar/exportar; sin versiones ocultas ilimitadas | T-A5-14, 20 |
| TM-05 | Colisión de claves | R40 pisa preferencia o módulo existente | corrupción cruzada | namespace `irisgreen:r40:`; stores separados; auditoría en HEAD congelado | T-A5-19 |
| TM-06 | Persistencia no deseada | navegar/buscar crea historial local | rastreo de conducta | solo acciones explícitas; progreso off por defecto; sin timestamps/visitas | T-A5-02, 04 |
| TM-07 | Envío accidental a Sabik | colección/proyecto se adjunta a consulta | fuga a Function/asistente | tipos/boundaries separados; adaptador local sin cliente HTTP; test espía de red; bridge P5 pasa IDs de catálogo, no payloads | T-A5-16 |
| TM-08 | Envío a terceros | analytics/beacon recibe eventos de guardar/importar | fuga de comportamiento/contenido | cero fetch/XHR/beacon/WebSocket desde módulo; no telemetry hooks con payload | T-A5-16 |
| TM-09 | Fallo de migración | upgrade transforma parcialmente | pérdida/corrupción | transacción o copy-validate-commit; rollback; fixtures; no borrar versión anterior hasta validar | T-A5-12, 13 |
| TM-10 | Versión futura | archivo/db de versión no soportada | downgrade destructivo | fail closed; conservar; mensaje compatible; nunca auto-borrar | T-A5-11 |
| TM-11 | Colisión project_id | import pisa proyecto existente | pérdida | generar nuevo ID o pedir decisión; no overwrite silencioso | T-A5-18 |
| TM-12 | Concurrencia entre pestañas | dos pestañas guardan revisiones distintas | lost update | revision/expectedRevision; conflicto detectable; conservar/decidir | T-A5-18 |
| TM-13 | Navegación privada | API de storage no disponible/efímera | falsa sensación de guardado | capability detection; modo memoria; texto claro; no “guardado” hasta commit; export local si posible | T-A5-15 |
| TM-14 | Error de cuota | write falla a mitad | estado parcial/pérdida borrador | atomicidad; conservar borrador en memoria; no borrar previos; no fallback red | T-A5-14 |
| TM-15 | Cambio ES/EN | etiquetas traducidas se usan como claves | duplicados o pérdida | persistir IDs canónicos; UI resuelve idioma en runtime; user text no se traduce | T-A5-06 |
| TM-16 | Borrado incompleto | UI dice borrado pero reaparece tras reload/tab | pérdida de control | delete scope + verificación; invalidar cachés/tabs; prueba reload | T-A5-03, 21 |
| TM-17 | Import activa contenido | payload se usa como HTML/URL/código | XSS/red no deseada | import data-only; text rendering; whitelist project_type; valores no ejecutables; no descargas automáticas | T-A5-10 |
| TM-18 | Recuperación oculta | autosaves/backups invisibles sobreviven al borrado | incumplimiento expectativa | no copias ocultas R40; cualquier backup futuro requiere contrato y borrado conjunto | T-A5-21 |

## Suposiciones no permitidas

- “Está en el navegador” no significa que sea privado si luego se adjunta a una petición.
- “No tenemos cuentas” no elimina el riesgo de datos personales escritos en proyectos.
- “Navegación privada” no garantiza almacenamiento; tampoco garantiza que todas las APIs fallen igual.
- Un JSON válido no es un proyecto válido.
- Un ID traducido no es estable.
- Una migración que “parece funcionar” no es válida sin rollback probado.
- Un error de cuota no autoriza subir el proyecto a Cloud.

## Reglas de logging

El módulo de datos locales no debe registrar:

- payload de proyecto;
- título libre;
- colección completa;
- progreso;
- archivo importado;
- error/stack que incluya contenido del archivo.

Se permiten, si el producto necesita diagnóstico local y sin telemetría, códigos estáticos como:

- `STORAGE_UNAVAILABLE`
- `STORAGE_QUOTA`
- `IMPORT_INVALID_JSON`
- `IMPORT_UNSUPPORTED_VERSION`
- `IMPORT_INVALID_SCHEMA`
- `PROJECT_REVISION_CONFLICT`

No contienen datos de usuario.

## Riesgos residuales

1. Un archivo exportado puede compartirse fuera de Iris Green por decisión de la persona; Iris Green no controla su destino.
2. Extensiones del navegador/malware con acceso al origen quedan fuera del modelo de aplicación.
3. El navegador puede purgar almacenamiento local bajo presión; la interfaz no debe prometer durabilidad equivalente a una cuenta/cloud.
4. Los límites exactos de tamaño/profundidad todavía no están fijados; son requisito previo de implementación.
5. Los schemas específicos de cada proyecto del Taller aún dependen del inventario/arquitectura posteriores al freeze.

## Gate A5 para implementación

No iniciar persistencia de producto hasta que:

- A2 entregue HEAD estable;
- A3 confirme adaptador/contratos de P0;
- se auditen colisiones en ese HEAD;
- se fijen límites de importación/storage;
- cada `project_type` tenga validator;
- A1 incorpore los casos obligatorios del test matrix.
