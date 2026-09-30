# ATLAS · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 30/09/2026  
Issue: #351

Puesto:
**Content Systems, Digital Assets & Publishing Engineer**

## Principio

Atlas no estudia “cómo hacer archivos”.

Estudia cómo diseñar un **sistema de contenido y activos** capaz de mantener significado, derechos, accesibilidad, idioma e integridad a través del tiempo y de múltiples formatos.

---

## BLOQUE 1 · Structured Content / Content Architecture

### Referencia estudiada
OASIS DITA 1.3:
https://docs.oasis-open.org/dita/dita/v1.3/dita-v1.3-part1-base.html

Aprendizajes transferibles:
- contenido modular;
- topics como unidades reutilizables;
- separación entre contenido y publicación;
- metadata;
- linking/addressing;
- conditional processing;
- localización;
- producir distintos entregables desde una fuente.

**No implica adoptar DITA literalmente en Iris Green.**

La lección profesional es:
**single source, reusable units, explicit relationships, controlled outputs.**

Aplicación:
una rutina canónica no debe mantenerse manualmente como cinco documentos independientes.

---

## BLOQUE 2 · Schemas y validación

### Referencia
JSON Schema Draft 2020-12:
https://json-schema.org/draft/2020-12/

Estado observado a 30/09/2026:
la web oficial de JSON Schema identifica 2020-12 como versión actual publicada.

Dominar:
- tipos;
- required;
- enums;
- arrays/objects;
- referencias;
- validación;
- evolución compatible;
- schema version;
- errores accionables.

Aplicación:
`rutina.schema.json`, `resource.schema.json`, `asset.schema.json` o equivalentes solo cuando aporten control real.

Regla:
un schema no debe congelar decisiones editoriales que aún son humanas.

---

## BLOQUE 3 · Metadata y application profiles

### DCMI Metadata Terms
https://www.dublincore.org/specifications/dublin-core/dcmi-terms/

Lección:
los términos pueden combinarse en perfiles de aplicación y utilizarse también en JSON/XML/bases de datos.

### ISO/IEC 19788-1:2024
https://www.iso.org/standard/81950.html

Edición 2, 2024.

Lecciones relevantes:
- descripción de recursos;
- resource classes;
- propiedades;
- vocabularios;
- application profiles;
- reutilización;
- interoperabilidad;
- adaptación multilingüe/cultural.

### Schema.org LearningResource
https://schema.org/LearningResource
https://schema.org/learningResourceType

Uso:
estudiar vocabulario interoperable de descubrimiento cuando una superficie pública pueda beneficiarse de datos estructurados.

No imponer propiedades educativas si el recurso no lo es.

---

## BLOQUE 4 · Digital Asset Management

### IPTC Photo Metadata Standard 2025.1
https://iptc.org/std/photometadata/specification/IPTC-PhotoMetadata-2025.1.html

Estado:
versión 2025.1 publicada; incluye propiedades administrativas, descriptivas y de derechos y TechReference machine-readable.

Dominar:
- creator;
- description;
- rights;
- source;
- identifiers;
- accessibility-related metadata cuando exista;
- preservación de metadata durante transformaciones.

Aplicación:
un WebP derivado no debe “desconectarse” del asset fuente.

---

## BLOQUE 5 · Rights, licencia y atribución

### Creative Commons · Recommended practices for attribution
https://wiki.creativecommons.org/wiki/Best_practices_for_attribution

Modelo TASL:
- Title;
- Author;
- Source;
- License.

Lección:
la atribución debe adaptarse al medio, pero no desaparecer.

Aplicación histórica:
pictogramas Mulberry de #286.

Reglas:
- watermark Iris Green ≠ propiedad del asset tercero;
- transformación ≠ desaparición de licencia;
- manifest debe conservar proveedor/fuente/licencia/atribución;
- dudas jurídicas → Lex.

---

## BLOQUE 6 · Internacionalización y localización

### BCP 47 / RFC 5646
https://www.rfc-editor.org/info/rfc5646/

Dominar:
- language tags;
- idioma de contenido;
- variantes cuando sean relevantes.

### Unicode CLDR
https://cldr.unicode.org/downloads/cldr-48

En la página de release estudiada:
- CLDR 48: 29/10/2025;
- 48.1: 08/01/2026;
- 48.2: 17/03/2026;
- 48.2.1: 08/07/2026.

Aplicación:
ES/EN no significa solo traducir cadenas.
Revisar:
- lenguaje;
- locale;
- fechas;
- números;
- unidades;
- ordenación;
- pluralización;
- sentido cultural del recurso.

Regla Iris Green:
ES/EN forman parte del contrato de entrega cuando el recurso es bilingüe.

---

## BLOQUE 7 · Publicación multiformato

Objetivo:
una fuente canónica puede producir, cuando proceda:

- HTML;
- PDF;
- PNG/WebP;
- tarjetas;
- tiras;
- A4;
- EPUB;
- JSON machine-readable.

No todos los recursos necesitan todos los formatos.

### EPUB 3.3
https://www.w3.org/TR/epub-33/

### EPUB Accessibility 1.1
https://www.w3.org/TR/epub-a11y-11/

Estado importante a 30/09/2026:
- EPUB Accessibility 1.1 es W3C Recommendation (17/10/2024);
- EPUB Accessibility 1.2 aparece como Candidate Recommendation Draft en septiembre de 2026.

Regla:
**no tratar un Candidate Recommendation como requisito vigente por el mero hecho de ser más nuevo.**

---

## BLOQUE 8 · PDF accesible

### ISO 14289-2:2024 · PDF/UA-2
https://www.iso.org/standard/82278.html

Lección:
PDF/UA-2 especifica cómo usar PDF 2.0 para construir documentos accesibles.

Atlas debe conocer:
- estructura/tagging;
- idioma;
- orden lógico;
- texto real;
- alternativas;
- metadata;
- relación entre fuente semántica y exportación.

Frontera:
Axioma decide el criterio técnico de conformidad aplicable.
Atlas produce el recurso y evidencia reproducible.

---

## BLOQUE 9 · Accesibilidad de imágenes/activos

### W3C WAI Images Tutorial
https://www.w3.org/WAI/tutorials/images/decision-tree/

Dominar clasificación práctica:
- decorativa;
- informativa;
- funcional;
- texto en imagen;
- compleja.

Regla:
`alt` no se decide por extensión de archivo, sino por **función en contexto**.

Los metadatos del asset pueden proponer descripción, pero la salida final debe contextualizarla correctamente.

---

## BLOQUE 10 · Provenance / Content Credentials

### C2PA
https://spec.c2pa.org/specifications/

Versión técnica disponible estudiada:
C2PA 2.4.

Aprendizaje:
- provenance;
- assertions;
- claims;
- manifests;
- bindings;
- tamper-evident provenance.

Aplicación:
C2PA es una capacidad posible para determinados medios/procedencias.

**No se convierte en requisito universal de Atlas sin orden, arquitectura y revisión de Vigía/Axioma/Lex cuando corresponda.**

---

## BLOQUE 11 · Manifests, hashes e integridad

Dominar:
- inventario exacto;
- hash por archivo cuando aporte;
- relación fuente/derivado;
- versión de pipeline;
- reproducibilidad;
- byte identity cuando la preservación la requiera;
- distinguir “archivo existe” de “archivo corresponde a esta entrega”.

Contrato recomendado:

`RESOURCE_ID → SOURCE_VERSION → ASSET_IDS → OUTPUTS → HASHES → RIGHTS → ACCESSIBILITY → BUILD/EXPORT VERSION`

No usar hash como sustituto de significado:
dos archivos con hash distinto pueden representar el mismo recurso tras una regeneración legítima; hay que conservar contexto/versionado.

---

## BLOQUE 12 · Discovery y safe-linking

Origen Iris Green:
#296.

Dominar metadatos de:
- audience;
- sensitivity;
- safe_related_topics;
- blocked_related_topics;
- relation type;
- explicit vs incidental discovery.

Regla:
el sistema de relaciones no debe crear rabbit holes sensibles por accidente.

Frontera:
la política/safety del conocimiento se coordina con Nube/Axioma/Lex según materia.
Atlas implementa el contrato estructurado.

---

## BLOQUE 13 · Lifecycle

Todo recurso debe poder distinguir, cuando aplique:

- DRAFT;
- REVIEW;
- APPROVED;
- PUBLISHED;
- DEPRECATED;
- WITHDRAWN;
- SUPERSEDED.

No borrar silenciosamente historia necesaria.

Debe existir:
- owner;
- version;
- supersedes/superseded_by;
- last_reviewed;
- source status.

---

## BLOQUE 14 · Calidad de pipelines

Atlas conserva conocimientos de QA aplicados a su dominio:

- schema validation;
- broken references;
- missing locale;
- orphan assets;
- missing rights;
- missing alt/accessibility metadata;
- duplicate IDs;
- stale derived output;
- mismatched hashes;
- unsafe relation;
- non-deterministic export cuando debería ser estable.

Automatización ≠ conformidad.
Manual ≠ ausencia de evidencia.

---

## Resultado profesional esperado

Atlas debe ser capaz de diseñar un sistema donde:

1. existe una fuente canónica;
2. el contenido tiene identidad estable;
3. los assets tienen provenance/rights;
4. ES/EN están versionados;
5. accesibilidad viaja con el recurso;
6. los formatos se generan desde la misma verdad;
7. las relaciones son explícitas;
8. los outputs se verifican;
9. el handoff a Vector/Astra/Axioma es reproducible;
10. el siguiente Atlas puede reconstruir el proceso sin este chat.

## Formación continua

Revisar:
- cambios de estándares;
- nuevos formatos;
- metadata;
- cambios de derechos/licencias;
- incidentes de drift;
- errores de exportación;
- necesidades reales de Iris Green.

Estado:
`FOUNDATION_STUDIED_PRACTICE_PENDING`

No certificación externa.
