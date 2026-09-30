# MOTOR · A5 · ESTUDIO PROFUNDO R09 · ESTADO, SERIALIZACIÓN, MIGRACIONES Y UNDO

Fecha: 30/09/2026
Amplía: R01–R08
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Estado de runtime vs estado persistible

Motor debe separar:

### Ephemeral runtime state
- pointer activo;
- hover;
- objeto Canvas context;
- AudioNode;
- Worker;
- timers;
- DOM references;
- GPU handles.

### Persistable domain state
- proyecto;
- celdas;
- trazos;
- herramientas;
- parámetros;
- títulos;
- revisión;
- schema version.

Regla:
**no guardar objetos de runtime dentro del modelo persistente.**

## 2 · Structured clone

Fuentes:
- MDN · structuredClone()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
- MDN · Structured clone algorithm
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm

`structuredClone()`:
- widely available desde 2022;
- soporta ciclos;
- soporta más tipos que JSON;
- puede transferir ownership de transferables.

No clona:
- Functions;
- DOM nodes;
- ciertos metadatos/property descriptors.

Regla:
si un estado necesita funciones/DOM para “funcionar”, probablemente el boundary de estado está mal diseñado.

## 3 · JSON vs structured clone

JSON aporta:
- formato portable;
- interoperabilidad;
- legibilidad;
- exportación estable.

Limitaciones:
- Date/Map/Set/etc requieren convención;
- undefined desaparece;
- NaN/Infinity cambian;
- ciclos fallan.

Structured clone:
mejor para:
- snapshots internos;
- Workers;
- IndexedDB;
- undo si el tipo lo permite.

Regla:
**export format y in-memory clone no tienen por qué ser la misma tecnología.**

## 4 · Transferables

Fuente:
- MDN · Transferable objects
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects

Mover un ArrayBuffer/ImageBitmap/OffscreenCanvas puede ser más barato que copiarlo.

Pero transfer:
- cambia ownership;
- deja el original inutilizable/detached.

Regla:
solo transferir cuando el ownership quede explícito.

No transferir por optimización prematura.

## 5 · Auditoría estado local Iris Green

Archivo:
`assets/ig-taller-local-data.js`.

Observado:
- DB_NAME;
- DB_VERSION;
- CONTRACT;
- SCHEMA;
- project_schema_version;
- revision;
- project_type;
- payload;
- tamaño máximo de import;
- depth/node/string limits;
- rechazo de keys peligrosas;
- validación de IDs/types;
- formato de export explícito.

Patrón profesional positivo:
**el formato persistido tiene contrato propio.**

## 6 · Revision control local

`saveProject(project, expectedRevision)`:
- lee existente;
- compara revisión;
- si no coincide → `PROJECT_REVISION_CONFLICT`;
- incrementa revision.

Esto evita una clase de lost update.

Regla:
una pestaña vieja no debe sobrescribir silenciosamente un proyecto guardado por otra.

## 7 · IndexedDB transactions

Fuentes:
- MDN · Using IndexedDB
  https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
- MDN · IDBTransaction.mode
  https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction/mode

Modos:
- readonly;
- readwrite;
- versionchange.

Schema:
solo se modifica en versionchange/upgradeneeded.

Regla:
una migración DB debe:
- ser atómica;
- poder abortar;
- dejar DB en versión anterior si falla cuando la plataforma lo permite;
- no mezclar migración de estructura y UI arbitraria.

## 8 · DB version ≠ project schema version

Separar:

### DB_VERSION
estructura IndexedDB:
- stores;
- indexes.

### project_schema_version
estructura del proyecto guardado.

### engineVersion
versión semántica del motor/editor.

Cambiar una no implica necesariamente cambiar las otras.

Ejemplo:
añadir un índice a IndexedDB puede subir DB_VERSION sin cambiar proyectos.

## 9 · Auditoría R43

PR histórico #299:
estado de motores avanzados usa:
`version:43`.

Al abrir:
si `d.state.version === 43` → usa estado.
Si no → crea estado nuevo.

Durante una reconstrucción puede ser una protección temporal.

En producto estable, riesgo:
**pérdida silenciosa de contenido antiguo.**

Nueva regla:
unsupported version debe producir:
- migración;
- import read-only;
- mensaje;
- export/recovery;
- rechazo no destructivo.

No:
reset silencioso.

## 10 · Migration chain

Patrón:

```text
v1 --migrate1to2--> v2 --migrate2to3--> v3
```

Cada migración:
- pura si es posible;
- testeable;
- determinista;
- no muta input;
- valida output.

No escribir:
`if version < current: guess fields`
en muchas zonas distintas.

Centralizar.

## 11 · Future version

Caso:
usuario abre v5 con motor v4.

Motor NO puede “migrar hacia atrás” inventando.

Opciones:
- READ_ONLY_UNSUPPORTED_NEWER;
- export;
- actualizar aplicación;
- preservar archivo.

Nunca:
sobrescribir con v4.

## 12 · Práctica ejecutada

Práctica aislada de migración:

```text
PASS stepwise migration v1→v3
PASS source not mutated
PASS target version idempotent
PASS future version rejected without destructive fallback
RESULT 4/4 migration checks passed
```

## 13 · Import validation

El Taller actual ya valida:
- bytes;
- JSON;
- depth;
- node count;
- string size;
- plain objects;
- dangerous keys;
- contract/schema;
- expected studio.

Esto protege:
- memoria;
- prototype pollution;
- formatos arbitrarios;
- cruces de estudio.

Lección:
importar un archivo local sigue siendo una frontera no confiable.

## 14 · File System Access

Fuentes:
- MDN · showOpenFilePicker
  https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker
- MDN · showSaveFilePicker
  https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker
- MDN · FileSystemFileHandle
  https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle

Estado:
pickers siguen **Limited availability / no Baseline** en 2026.

Además:
- requieren secure context;
- requieren user activation;
- permisos pueden no persistir.

Regla:
si se usan, mantener fallback:
`<input type=file>` + download Blob.

## 15 · Undo/redo

Modelos:

### Snapshot
guardar copia completa por operación.

Pros:
simple.

Contras:
memoria alta para Canvas/proyectos grandes.

### Command log
guardar operación + inverse.

Pros:
eficiente.

Contras:
más complejo; necesita invariantes.

### Hybrid
checkpoints + commands.

Motor elige por:
- tamaño;
- frecuencia;
- reversibilidad;
- complejidad.

## 16 · Undo transaction boundary

No crear un undo por cada `pointermove`.

Para un trazo:
```text
pointerdown → begin transaction
pointermove* → mutate preview
pointerup → commit one undo entry
pointercancel → revert/cancel
```

A5 R43 ya hace algo parecido:
captura `before` en pointerdown y commit al finalizar.

Patrón positivo.

## 17 · Memory cost del undo

Snapshot por stroke puede crecer rápido.

Prueba:
- 1;
- 10;
- 100;
- 1000 operaciones.

Medir:
- heap;
- serialized bytes;
- latency undo/redo.

Definir cap:
- número;
- memoria;
- checkpoints.

No permitir crecimiento ilimitado invisible.

## 18 · Autosave

Autosave no significa guardar en cada input sin control.

Requisitos:
- debounce/coalesce;
- revision;
- abort/supersede;
- failure status;
- no bloquear input;
- no fingir success.

Para datos críticos:
guardar transaccionalmente.

## 19 · Dirty state

El proyecto actual usa `beforeunload` para cambios sin guardar.

Cuidado:
- beforeunload no es garantía de ejecución;
- puede afectar bfcache en algunos navegadores/escenarios históricos;
- usarlo como safety net, no mecanismo principal de persistencia.

Regla:
estado durable debe guardarse por flujo explícito/autosave autorizado, no “al cerrar”.

## 20 · Determinismo

Para simulaciones:
si queremos reproducibilidad:
- seed explícita;
- timestep controlado;
- orden estable.

Random sin seed:
válido para experiencias efímeras.
No válido si se promete reproducir el mismo proyecto/resultado.

## 21 · Project format contract

Formato profesional:

```json
{
  "kind": "...",
  "contract_version": "...",
  "schema_version": 2,
  "project": {
    "project_id": "...",
    "project_type": "...",
    "project_schema_version": 3,
    "revision": 12,
    "payload": {}
  }
}
```

Cada capa tiene propósito distinto.

No usar un único `version` ambiguo para todo.

## 22 · Compatibility test matrix

Cada motor con persistencia:
- create current;
- save/open current;
- export/import current;
- old supported version;
- old migratable version;
- future unsupported;
- malformed;
- oversized;
- wrong studio;
- revision conflict;
- quota;
- interrupted write.

## 23 · Estado R09

Práctica:
- migration chain: **4/4 PASS**.

Auditoría read-only:
- local data contract: completada;
- revision conflict: revisado;
- R43 version fallback: analizado;
- File System Access support: estudiado.

Marcador:
`MOTOR_STATE_SERIALIZATION_MIGRATION_UNDO_STUDIED_R09`

No:
- cambio de schema;
- migration real;
- modificación de proyectos;
- build;
- merge;
- deploy;
- main/producción.
