# APRENDIZAJE · ATLAS · 30/09/2026

Issue: #351  
Alias: Atlas  
Agente: A1  
Jefatura: Aura

Estado:
`FOUNDATION_STUDIED_PRACTICE_PENDING`

## 1 · Mi profesión

**Content Systems, Digital Assets & Publishing Engineer**

En español:
**Ingeniero de Sistemas de Contenido, Activos Digitales y Publicación**.

El nombre organizativo “Sistemas de Contenido y Recursos” sigue siendo válido, pero esta formulación profesional define mejor la disciplina.

## 2 · Qué estudié hoy

- arquitectura de contenido estructurado;
- single-source publishing;
- modelos/schema;
- DCMI/application profiles;
- metadata de recursos;
- digital asset metadata;
- rights/attribution;
- localización ES/EN;
- language tags/locale data;
- publicación HTML/PDF/EPUB/imágenes;
- accesibilidad de outputs;
- provenance;
- manifests/hashes;
- lifecycle;
- safe linking/discovery.

Fuentes exactas:
ver `04_FUENTES_Y_VERSIONES_R01.md`.

## 3 · Qué aprendí con mis palabras

### Un recurso no es un archivo
Un recurso es una entidad con identidad, estado, contenido, relaciones, assets, derechos, idiomas y salidas.

El archivo es una representación.

### Publicar no debe crear otra verdad
Si HTML, PDF y PNG se editan por separado, tarde o temprano divergen.

La fuente canónica debe gobernar los derivados.

### Metadata es parte del sistema
No es decoración.

Sirve para:
- encontrar;
- relacionar;
- proteger;
- atribuir;
- adaptar;
- traducir;
- publicar;
- retirar;
- auditar.

### Provenance importa
Un asset debe conservar de dónde viene y qué transformación sufrió.

Optimizar/reencodar no debe borrar su historia.

### Accesibilidad debe entrar antes del export
No basta arreglar el PDF o HTML al final.

La fuente debe tener suficiente semántica para generar una salida correcta.

### ES/EN son versiones coordinadas
No son dos archivos independientes que “se parecen”.

El sistema debe detectar drift.

### Un hash prueba identidad de bytes, no verdad semántica
Debo conocer:
- qué se esperaba;
- de qué source salió;
- qué pipeline lo generó.

## 4 · Qué aprendí de la historia real de A1

### #248 / #256
A1 desarrolló disciplina de QA y gates reproducibles.

Conservo:
- evidencia;
- casos negativos;
- no simular PASS;
- distinguir automatizable/manual.

No conservo como ownership:
ser QA global.

### #261
A1 construyó Recursos/Juegos y datos bilingües.

Lección:
el dominio ya exigía arquitectura de contenido, no solo HTML.

### #286
Rutinas, descargables y pictogramas enseñan el problema central de Atlas:

**una misma entidad produce múltiples formatos y consume assets con licencia.**

Esto exige source-of-truth + metadata + rights + outputs.

### #296
Child-safe linking demuestra que las relaciones también son datos gobernados.

No basta que cada página sea segura aislada.
El grafo de descubrimiento puede crear fugas.

## 5 · Riesgos de comportamiento que debo evitar

### Output-as-source bias
“Está en PDF, por tanto esa es la verdad.”

Corrección:
buscar source/version/owner.

### Filename identity bias
“final_v7_ok.pdf” como identidad.

Corrección:
stable ID + version + status.

### Watermark ownership bias
Confundir marca de composición con propiedad del asset.

Corrección:
rights/attribution separados.

### Translation-copy bias
Copiar ES a EN y mantener dos versiones a mano.

Corrección:
contrato de locale + source status + diff.

### Metadata-afterthought bias
Añadir metadata al final.

Corrección:
modelarla antes de publicar.

### QA takeover bias
Como A1 hizo QA históricamente, asumir autoridad global.

Corrección:
QA de mi pipeline sí; conformidad/quality governance → Axioma/Astra.

### Process inflation
Crear un schema enorme para cada microrecurso.

Corrección:
proporcionalidad.

## 6 · Mi contrato mental

Para un recurso material:

`SOURCE → MODEL → VALIDATE → LOCALIZE → RESOLVE ASSETS/RIGHTS → BUILD OUTPUTS → VERIFY → MANIFEST → HANDOFF`

Para una corrección:

`CHANGE SOURCE → INVALIDATE DERIVATIVES → REBUILD → VERIFY → SUPERSEDE`

## 7 · Fronteras que debo recordar

- Nube: corpus/fuentes/RAG.
- Vector: release/integración.
- Prisma: frontend platform.
- Motor: runtime.
- Axioma: standards/conformance.
- Lex: legal/licencias.
- Croma: visual.
- Senda: editorial.
- Aura: coordinación/knowledge operations.
- María: producto/HUMAN QA/decisiones de Dirección.

## 8 · Qué todavía debo practicar

- schema real contra dataset Iris;
- pipeline multi-output;
- locale drift test;
- manifest/hash validation;
- rights propagation;
- safe-linking tests;
- handoff real a Vector;
- examen R01.

## 9 · Qué estudiar después

Según trabajo futuro:
- media-specific metadata más allá de foto;
- preservation/package formats;
- content migrations;
- deterministic builds;
- semantic versioning aplicado a schemas/content;
- controlled vocabularies/taxonomy governance;
- provenance avanzada/C2PA solo si aporta;
- EPUB/PDF pipelines reales cuando entren en producto.

## 10 · Estado de proyecto relevante

Durante esta sesión:
- jornada de Formación activa;
- no se modifica producto;
- no build;
- no merge;
- no deploy.

Se crea documentación de Formación en rama:
`formacion/a1-atlas-content-systems-r01-20260930`.

## 11 · Evidencia de continuidad

Carpeta:
`COORDINACION_IRIS_GREEN/FORMACION/A1_ATLAS/`

Documentos:
- `00_IDENTIDAD_Y_PUESTO.md`
- `01_PLAN_FORMACION.md`
- `02_PRACTICAS_Y_EXAMEN.md`
- `03_RUNBOOK_CONTENIDO_RECURSOS.md`
- `04_FUENTES_Y_VERSIONES_R01.md`
- `APRENDIZAJE_ATLAS_2026-09-30.md`

Issue:
#351

## 12 · Primeros 15 minutos del siguiente Atlas

1. leer `FORMACION/00_EMPIEZA_AQUI.md`;
2. leer `DIRECTORIO_FORMACION_POR_ROL.md`;
3. leer `A1_ATLAS/00_IDENTIDAD_Y_PUESTO.md`;
4. leer este aprendizaje;
5. leer `03_RUNBOOK_CONTENIDO_RECURSOS.md`;
6. comprobar si hay aprendizaje R02/R03 más nuevo;
7. comprobar control CSV/JSON;
8. leer orden de trabajo nueva;
9. reconciliar estado real/HEAD/issue;
10. estudiar cualquier dominio nuevo antes de ejecutar.

## 13 · Regla final

**No dependo de recordar este chat.**

Si este chat desaparece, GitHub debe permitir reconstruir:
- quién soy;
- qué sé;
- qué no debo invadir;
- qué fuentes estudié;
- cómo trabajo;
- qué falta practicar.

GitHub = registro canónico.  
Slack = coordinación rápida.
