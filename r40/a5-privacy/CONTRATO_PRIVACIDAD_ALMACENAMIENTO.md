# R40-A5 · contrato de privacidad y almacenamiento local

Estado: **PREPARACIÓN / NO PRODUCTO**  
Autoridad: issues #247 y #251.  
Base documental de esta rama: `main@2e17ed3ae02e23a4fd734b00c10f843d14a19d4d`.

Este contrato prepara R40-P0, R40-P4 y R40-P5. No implementa HTML, CSS, JS de producto, transporte Sabik, Cloud, autenticación ni voz. La implementación solo puede comenzar después del freeze/handoff explícito de A2.

## 1. Invariantes de privacidad

1. **Local por defecto.** Mi colección, progreso opcional y proyectos pertenecen al dispositivo/navegador de la persona.
2. **Sin cuenta ni backend.** Guardar, abrir, exportar e importar proyectos no requiere cuenta ni servicio remoto.
3. **Sin conducta implícita.** Ver una ficha, abrir una página, buscar, filtrar, escuchar, navegar o consultar Sabik no crea por sí solo un registro persistente.
4. **Acción explícita para persistir.**
   - Mi colección persiste solo al usar una acción explícita de guardar.
   - Un proyecto persiste solo al usar una acción explícita de guardar.
   - El progreso persistente está desactivado por defecto y requiere activación explícita.
5. **No enviar a Sabik.** Colección, progreso y proyectos no forman parte de ninguna petición al asistente, de su historial ni de su transporte privado.
6. **No enviar a terceros.** Ninguna operación de almacenamiento, exportación/importación o migración puede emitir `fetch`, XHR, beacon, WebSocket, telemetría o subida.
7. **Borrado verificable.** Cada ámbito puede borrarse por separado y existe borrado total R40.
8. **ES/EN sin duplicación de datos.** Se persisten identificadores estables, no etiquetas traducidas de catálogo; cambiar de idioma no crea una segunda colección/progreso/proyecto.
9. **Sin promesa de persistencia.** Navegación privada, políticas del navegador y cuotas pueden impedir o eliminar almacenamiento. La interfaz debe degradar a memoria sin fingir que algo quedó guardado.

## 2. Clasificación de datos

| Clase | Ejemplos | Persistencia | Red | Riesgo |
|---|---|---:|---:|---|
| Estado efímero | búsqueda actual, filtros, foco, visor, borrador no guardado, error actual | memoria | prohibida | bajo |
| Mi colección | referencias estables elegidas explícitamente | local opcional | prohibida | preferencia personal |
| Progreso opcional | checkpoints técnicos sin tiempos ni historial de conducta | local solo si se activa | prohibida | dato de comportamiento |
| Proyecto guardado | título y contenido creado por la persona | local explícita | prohibida | puede contener datos personales accidentales |
| Importación en validación | bytes/JSON del archivo elegido | memoria hasta validar/confirmar | prohibida | entrada no confiable |
| Metadatos técnicos | versión de schema, revisión local | local | prohibida | bajo |
| Prohibido persistir | cookies, tokens, claves, Authorization, IP, historial Sabik, prompts/respuestas, navegación, tiempos de uso, audio/voz | nunca | n/a | alto |

## 3. Frontera de almacenamiento

El contrato es backend-neutral hasta el freeze de A2/A3. La implementación debe exponer un único adaptador local y ocultar el mecanismo elegido.

**Preferencia técnica:** IndexedDB o almacenamiento local transaccional equivalente para proyectos y estado R40. `localStorage` no debe ser el almacén canónico de proyectos. Si se usa para metadatos pequeños tras la revisión de A3, todas las claves deben respetar el namespace reservado.

Namespace lógico reservado:

```
irisgreen:r40:
```

Ámbitos lógicos:

- `meta`
- `collection`
- `progress`
- `projects`

Antes de implementar, el HEAD congelado de A2 debe volver a auditarse por colisiones. La búsqueda indexada actual no devolvió coincidencias de `localStorage`/IndexedDB y `support.js` en `main@2e17ed3` no contiene esos accesos, pero esa observación **no sustituye** la comprobación del HEAD de freeze.

## 4. Qué vive solo en memoria

Deben ser efímeros:

- texto de búsqueda y filtros;
- ordenación de la vista;
- página/posición de navegación;
- selección temporal no guardada;
- estado del visor;
- errores y avisos;
- borrador de proyecto antes de “Guardar”;
- archivo importado antes de validación y confirmación;
- consultas/respuestas de Sabik;
- cualquier token, cookie o credencial;
- estado de audio/volumen salvo que otro contrato de producto autorice una preferencia separada.

Cerrar/reiniciar sin guardar puede perder estos datos y debe ser una consecuencia explícita, no un fallo silencioso.

## 5. Qué puede persistir localmente

### 5.1 Mi colección

Persistir únicamente una lista ordenada de referencias estables:

```json
{"namespace":"interests","id":"stable-catalog-id"}
```

No persistir título ES/EN, descripción, URL derivable, fecha/hora de guardado, número de aperturas ni origen de navegación.

Operaciones mínimas del contrato:

- leer colección;
- añadir referencia de forma idempotente;
- retirar referencia;
- borrar colección;
- exportación de colección: **fuera de alcance de R40-A5** salvo orden posterior.

### 5.2 Progreso opcional

- Desactivado por defecto.
- No se crea un registro al consultar contenido.
- Solo guarda referencias + marcadores/checkpoints definidos por el producto; los marcadores no pueden contener texto libre del usuario.
- No guarda timestamps, duración, rachas, puntuaciones ni historial de visitas.
- Al desactivar el progreso, la UI debe preguntar/explicar si se borran los datos ya guardados; no conservarlos de forma oculta.
- Debe existir `clearProgress()` independiente.

### 5.3 Proyectos

Un proyecto guardado contiene:

- `project_id`: identificador opaco generado localmente; nunca derivado de nombre/email/título;
- `project_type`: tipo registrado por Taller/Cuaderno;
- `project_schema_version`;
- `revision`: entero monotónico local para evitar sobreescrituras accidentales;
- `title`: opcional, introducido por la persona;
- `payload`: datos estructurados validados por un schema específico del tipo.

No guardar automáticamente una nueva revisión por cada pulsación. La política de autosave, si algún estudio la necesitara, requerirá una decisión separada porque cambia la regla de persistencia explícita.

## 6. Contrato de adaptador local

La implementación futura debe poder expresar, como mínimo, estas operaciones sin exponer el backend:

```text
capabilities() -> { persistent: boolean, reason?: code }
loadCollection()
addToCollection(ref)
removeFromCollection(ref)
clearCollection()

isProgressEnabled()
setProgressEnabled(enabled)
loadProgress()
saveProgress(entry)
clearProgress()

listProjects()
getProject(projectId)
saveProject(project, expectedRevision?)
deleteProject(projectId)
clearProjects()

clearAllR40Data()
exportProject(projectId)
validateImport(bytes)
commitImport(validatedProject)
```

Reglas:

- ninguna función del adaptador recibe cliente HTTP, Sabik, URL remota o credencial;
- una importación se valida en memoria antes de cualquier escritura;
- escrituras que cambien más de un registro deben ser atómicas o tener rollback equivalente;
- un error de cuota no puede dejar estado parcial;
- `capabilities().persistent=false` activa modo memoria, no intentos repetidos silenciosos.

## 7. Exportar/importar proyectos

### Exportación

Formato: JSON de datos, no HTML ejecutable.

El archivo exportado contiene **un solo proyecto** y su envelope versionado. No incluye por defecto:

- Mi colección;
- progreso;
- historial;
- claves/tokens;
- URLs de sesión;
- datos de Sabik;
- otros proyectos.

La interfaz debe advertir de forma clara que un proyecto puede contener texto/datos que la propia persona haya introducido. Exportar crea un archivo local; no lo sube.

### Importación

Pipeline obligatorio:

1. comprobar tamaño contra `MAX_IMPORT_BYTES` **antes** de parsear;
2. parsear como JSON estricto;
3. rechazar tipos/versiones desconocidos o futuros no soportados;
4. validar envelope con el schema R40-A5;
5. validar `payload` con el schema registrado de `project_type`;
6. aplicar límites de profundidad, arrays, strings y recuento de nodos;
7. rechazar claves peligrosas/prototipo (`__proto__`, `prototype`, `constructor`) en cualquier nivel;
8. no usar valores importados como código, HTML, CSS, selector, ruta de archivo, URL a descargar ni nombre de clave de almacenamiento;
9. mostrar resumen saneado y pedir confirmación;
10. asignar nuevo `project_id` si el ID colisiona; nunca sobrescribir silenciosamente;
11. escribir de forma atómica;
12. informar éxito o error sin incluir el payload completo en logs.

`MAX_IMPORT_BYTES` y los presupuestos de profundidad/nodos son **parámetros pendientes**: deben fijarse cuando A3/P3 conozcan el tamaño real de los seis tipos de Taller. Este contrato exige que existan y se prueben, pero no inventa valores.

## 8. Versionado y migración

Tres niveles separados:

- `contract_version`: versión del contrato/envelope, inicial `1.0`;
- `schema_version`: versión del estado local R40, inicial `1`;
- `project_schema_version`: versión de cada tipo de proyecto.

Reglas de migración:

1. solo hacia delante;
2. determinista y sin red;
3. nunca borra la versión antigua antes de validar la nueva;
4. migración en una transacción o estrategia copy-validate-commit;
5. si falla, rollback completo y datos anteriores siguen disponibles;
6. una versión futura desconocida se conserva sin modificar y se rechaza con error compatible, no se “arregla” borrándola;
7. cada migración tiene fixture de entrada/salida y prueba de idempotencia;
8. no convertir títulos/textos del usuario al cambiar de idioma;
9. identificadores canónicos de catálogo deben mantenerse o tener tabla explícita de alias/migración.

## 9. Borrado

Ámbitos independientes:

- “Borrar Mi colección” → solo colección.
- “Borrar progreso” → solo progreso.
- “Borrar proyectos” → solo proyectos, con confirmación proporcional.
- “Borrar todos los datos locales de R40” → colección + progreso + proyectos + meta no imprescindible.

Después del borrado:

- lectura del ámbito devuelve vacío;
- recarga no lo restaura;
- cambio ES↔EN no lo restaura;
- otra pestaña debe recibir/observar el estado nuevo antes de permitir una escritura que reviva datos antiguos;
- no queda copia de recuperación oculta creada por R40.

Los archivos que la persona ya exportó están fuera del control del navegador y deben explicarse por separado.

## 10. Aislamiento de red y Sabik

Regla absoluta para R40-P0/P4/P5:

```
collection/progress/projects -> LOCAL ONLY
collection/progress/projects -X-> Sabik
collection/progress/projects -X-> analytics
collection/progress/projects -X-> Netlify Functions
collection/progress/projects -X-> third-party services
```

Las conexiones P5 (Intereses ↔ Taller ↔ Cuaderno de Campo) transportan **identificadores de navegación**, no el contenido guardado del usuario. Abrir “Crear en Taller” puede pasar un ID de plantilla/interés permitido, nunca la colección completa, progreso, título o payload del proyecto.

## 11. Navegación privada, cuota y fallos

Si la persistencia no está disponible:

- la experiencia sigue funcionando en memoria;
- antes de afirmar “Guardado”, la UI debe conocer si la escritura se confirmó;
- se muestra un estado claro ES/EN de “solo durante esta sesión”;
- no se reintenta en bucle;
- exportar un proyecto debe seguir disponible cuando sea técnicamente posible;
- al cerrar la sesión/pestaña, se asume que el estado en memoria puede desaparecer.

Error de cuota:

- no elimina datos existentes;
- no deja escrituras parciales;
- conserva el borrador actual en memoria;
- ofrece borrar datos/exportar/reintentar después de una acción de la persona;
- no envía el proyecto a red como fallback.

## 12. Colisiones y concurrencia

- Namespace R40 reservado y comprobado de nuevo en el HEAD congelado.
- `project_id` no se deriva del título.
- `saveProject(project, expectedRevision)` debe detectar revisión obsoleta.
- Dos pestañas no pueden sobrescribirse silenciosamente.
- Si no puede resolverse automáticamente, conservar ambas versiones o pedir decisión; nunca perder una sin aviso.

## 13. Datos personales accidentales

R40 no solicita nombre, email, diagnóstico, edad, dirección ni perfil. Sin embargo, un campo libre dentro de un proyecto puede contenerlos porque la persona los escriba.

Controles:

- no pedir esos datos como parte del schema;
- no inferirlos ni clasificarlos;
- no indexar el texto de proyectos para Sabik;
- no incluirlo en telemetría;
- avisar antes de exportar que el archivo contiene lo que la persona haya escrito;
- borrado local real por proyecto/total;
- importación/exportación siempre iniciada por la persona.

## 14. Decisiones pendientes antes de implementación

Deben resolverse después del freeze, coordinadas con A3/A1:

1. backend local definitivo (IndexedDB recomendado vs equivalente);
2. `MAX_IMPORT_BYTES`;
3. profundidad/nodos/longitud máximos por tipo;
4. schemas concretos de los seis tipos de proyectos del Taller;
5. UX exacta de desactivar progreso con datos existentes;
6. estrategia de conflictos entre pestañas;
7. textos ES/EN de estados: memoria temporal, cuota, importación corrupta y borrado.

Estas decisiones no bloquean la validez del modelo de privacidad, pero sí el comienzo de la implementación.

## 15. Criterio de cierre A5

A5 se considera listo para handoff cuando:

- el schema adjunto valida los envelopes base;
- threat model cubre las amenazas exigidas por #251;
- matriz P0/P4/P5 contiene pruebas positivas/negativas y manuales;
- no hay cambios en producto;
- A1/A3 pueden consumir este contrato tras el freeze sin transportar datos a Sabik.
