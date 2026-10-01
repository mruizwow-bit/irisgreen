# MOTOR · A5 · ESTUDIO PROFUNDO R38 · FILE I/O, DRAG & DROP Y CLIPBOARD

Fecha: 01/10/2026
Amplía: R01–R37
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Archivo local = input no confiable aunque venga del propio dispositivo de la persona.

Motor debe validar:
- tamaño;
- estructura;
- versión;
- tipo esperado;
- ownership;
- error de lectura;
- cancelación;
- compatibilidad;
- impacto de memoria.

El atributo `accept` ayuda al selector, pero **no valida** el archivo.

## 2 · File API

Fuentes:
- MDN · File
  https://developer.mozilla.org/en-US/docs/Web/API/File
- MDN · Blob
  https://developer.mozilla.org/en-US/docs/Web/API/Blob

`File` hereda de `Blob`.

Permite:
- texto;
- bytes;
- slices;
- stream;
- object URL;
- createImageBitmap.

Regla:
elegir lectura según tamaño y formato.

## 3 · Blob.text()

Fuente:
- MDN · Blob.text()
  https://developer.mozilla.org/en-US/docs/Web/API/Blob/text

Estado:
widely available desde 2021.

Ventaja:
Promise-based.

Adecuado:
archivos de texto pequeños/medios.

No:
archivo grande si cargar todo en memoria no es aceptable.

## 4 · FileReader.readAsText()

Fuente:
- MDN · FileReader.readAsText()
  https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText

Widely available.

Carga contenido completo en memoria.

Para archivos grandes:
preferir estrategias:
- stream;
- slice;
- ArrayBuffer;
- incremental parse

si el dominio lo requiere.

## 5 · accept no valida

Fuente:
- MDN · input type=file
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file

`accept`:
- guía UI del picker;
- puede ser anulable;
- no prueba MIME real;
- no prueba schema.

Iris Green:
un proyecto JSON debe validar:
- JSON parse;
- `formato`;
- `version`;
- `estudio`;
- `datos`;
- límites.

No confiar solo en:
`.json`;
`application/json`.

## 6 · File size limits

Antes de leer:
`file.size`.

Ventaja:
rechazar input demasiado grande antes de cargarlo completo.

Current Taller:
`IGT.openProject()` limita a 8 MB.

`IGR40LocalData.fileImport()` usa `MAX_IMPORT_BYTES`.

Patrón positivo:
**size guard antes de parse.**

## 7 · Object URLs

Fuentes:
- MDN · URL.createObjectURL()
  https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static
- MDN · blob URLs
  https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/blob

Cada `createObjectURL()` crea una referencia independiente.

Mientras siga activa:
el recurso subyacente puede no liberarse.

Regla:
revoke cuando recurso deja de ser accesible al usuario.

No revocar demasiado pronto:
si imagen/download sigue disponible, acciones del usuario pueden romperse.

## 8 · Current Taller download audit

`assets/ig-taller-estudio.js`:
- createObjectURL;
- link download;
- revoke tras 4 s.

`assets/ig-taller-local-data.js`:
- revoke tras 2 s.

Interpretación:
hay cleanup explícito.

Pendiente profesional:
comprobar en navegadores/dispositivos objetivo que esos tiempos no cortan una interacción tardía de descarga.

No se declara bug sin QA real.

## 9 · HTML Drag and Drop

Fuentes:
- MDN · HTML Drag and Drop API
  https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- MDN · File drag and drop
  https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop

Para aceptar archivos:
- dragenter;
- dragover;
- drop.

`preventDefault()` en dragover suele ser necesario para permitir drop.

No implementar una dropzone sin alternativa de selección de archivo.

## 10 · DataTransfer

Fuente:
- MDN · DataTransfer
  https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer

Widely available desde 2015.

Puede contener:
- strings;
- files.

`DataTransfer.files`:
solo es legible con contenido real en puntos concretos del drag data store, especialmente drop.

No asumir que durante cualquier evento intermedio ya se pueden leer los archivos.

## 11 · DataTransferItem.getAsFile()

Fuente:
- MDN · getAsFile()
  https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFile

Widely available.

Si item no es file:
devuelve null.

No castear a File sin comprobar.

## 12 · getAsFileSystemHandle()

Fuente:
- MDN · DataTransferItem.getAsFileSystemHandle()
  https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsFileSystemHandle

Estado 01/10/2026:
**Limited availability / experimental**.

Puede devolver:
- FileSystemFileHandle;
- FileSystemDirectoryHandle.

No baseline para Iris Green.

Si alguna vez se usa:
input file normal sigue como fallback.

## 13 · Dragging accessibility

Fuente:
- WCAG 2.2 · Understanding 2.5.7 Dragging Movements
  https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements

Toda funcionalidad que depende de drag debe ofrecer alternativa de single pointer sin drag, salvo casos esenciales/user-agent.

Importante:
tener teclado equivalente no garantiza por sí solo 2.5.7.

Para file drop:
la alternativa natural es:
**botón Abrir/Seleccionar archivo**.

## 14 · File drop is not same as internal drag

Arrastrar un archivo desde sistema operativo:
interacción del user agent + página.

Arrastrar cards dentro de la página:
interacción author-defined.

Los criterios y eventos se solapan, pero el contrato accesible no es idéntico.

## 15 · Clipboard API

Fuentes:
- MDN · Clipboard API
  https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
- MDN · Clipboard
  https://developer.mozilla.org/en-US/docs/Web/API/Clipboard

Secure context.

Las implementaciones difieren:
- permisos;
- transient activation;
- prompts;
- iframe Permissions Policy.

Regla:
Clipboard API = progressive capability.

## 16 · Paste event

Para contenido pegado:
`ClipboardEvent.clipboardData`.

Puede contener:
- text/plain;
- text/html;
- files.

Si solo necesitamos texto:
preferir plain text.

Si aceptamos HTML:
sanitizar.

Si aceptamos file:
mismo pipeline de validación que picker/drop.

## 17 · Clipboard read/write

No leer clipboard automáticamente al cargar.

Debe existir intención clara.

Escribir:
puede requerir user activation.

Leer:
restricciones más fuertes y distintas entre Chromium/Firefox/Safari.

No diseñar una función crítica que solo existe vía `navigator.clipboard.read()`.

## 18 · File import pipeline

Patrón:

```
USER SELECTS / DROPS
→ classify item
→ size guard
→ read
→ parse
→ schema validation
→ version migration if authorized
→ domain validation
→ commit/import
→ feedback
```

Si falla antes de commit:
estado anterior intacto.

## 19 · Transaction boundary

No:
parsear medio documento e ir mutando el proyecto vivo.

Sí:
- construir candidate;
- validar completo;
- commit atómico.

Current `validateImportText() → commitImport()` encaja con este patrón.

## 20 · Filenames

`file.name` es input de usuario.

No usarlo como:
- HTML sin escape;
- path interno;
- key privilegiada;
- command.

Para download:
generar nombres propios/slug controlado.

Current Taller:
genera nombres propios mediante `IGT.slug()`.

## 21 · MIME

`file.type` puede ser:
- vacío;
- incorrecto;
- dependiente del OS.

No usar MIME como única prueba.

Para JSON:
contenido + schema es más importante.

Para imágenes/media:
puede necesitar decode real.

## 22 · Large structured files

JSON.parse exige string completa.

Si un futuro formato crece mucho:
considerar:
- NDJSON;
- streaming parser;
- binary format;
- chunked import.

No adoptar complejidad antes de que el tamaño real lo justifique.

## 23 · Cancellation

Picker cancel:
no es error.

Drag leaves:
no es error.

User abort:
estado neutral.

No anunciar “No se pudo abrir” cuando la persona simplemente canceló.

Current File System Access path:
ignora `AbortError`, patrón positivo.

## 24 · Multiple files

Si solo se admite uno:
- picker `multiple=false`;
- drop debe rechazar/explicar múltiples;
- no tomar silenciosamente el primero si puede confundir.

Si se admiten varios:
- orden;
- partial failures;
- atomic vs partial import;
deben estar definidos.

## 25 · Directory drop

Directory handles son capability avanzada.

No asumir:
- recursive access;
- consistent ordering;
- support.

No permitir import masivo de directorio sin:
- límites;
- depth;
- count;
- type allowlist;
- cancellation.

## 26 · Security

Archivos locales pueden contener:
- HTML/JS malicioso;
- oversized input;
- malformed data;
- nested pathological data;
- unexpected Unicode;
- incompatible version.

Motor valida antes de:
- DOM injection;
- execution;
- persistence.

No ejecutar código contenido en proyecto.

## 27 · Current repo audit

### `assets/ig-taller-estudio.js`
- hidden input file;
- accept JSON;
- size limit;
- FileReader;
- JSON parse;
- formato/studio checks;
- controlled feedback.

### `assets/ig-taller-local-data.js`
- hidden input;
- MAX_IMPORT_BYTES;
- validateImportText;
- commitImport.

### `assets/ig-taller-r42.js`
- File System Access progressive enhancement;
- `showOpenFilePicker`;
- AbortError treated as user cancel.

### Current drag/drop
No se encontraron handlers:
- dragover;
- drop;
- dataTransfer

en los archivos A5 auditados.

Conclusión:
no existe una dropzone de proyecto que mantener hoy.

No introducirla durante Formación.

## 28 · Testing

### Picker
- valid project;
- invalid JSON;
- wrong studio;
- wrong version;
- too large;
- cancel.

### Drop
- valid file;
- string item;
- multiple files;
- unsupported file;
- dragleave;
- keyboard/button alternative.

### Clipboard
- text;
- HTML;
- file;
- denied permission;
- no activation.

### Object URLs
- repeated download;
- revoke;
- long session.

## 29 · Failure labels

```
FILE_CANCELLED
FILE_TOO_LARGE
FILE_UNSUPPORTED
FILE_READ_FAILED
FILE_PARSE_FAILED
FILE_SCHEMA_INVALID
FILE_VERSION_UNSUPPORTED
FILE_WRONG_STUDIO
CLIPBOARD_DENIED
DROP_MULTIPLE_UNSUPPORTED
```

No:
`openBad`
como única clase interna, aunque UI pueda usar mensaje genérico.

## 30 · Estado R38

Estudiado:
- File/Blob;
- Blob.text vs FileReader;
- input accept semantics;
- object URL lifecycle;
- HTML Drag & Drop;
- DataTransfer;
- file system handle drag support limits;
- Clipboard;
- atomic import;
- accessibility alternative.

Auditoría read-only:
- import/export Taller;
- File System Access enhancement;
- current absence of file drop handlers.

Marcador:
`MOTOR_FILE_IO_DRAG_DROP_CLIPBOARD_STUDIED_R38`

No:
- dropzone;
- clipboard feature;
- file format change;
- build;
- merge;
- deploy;
- main/production.
