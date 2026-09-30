# NUBE · A9 · PLAN DE FORMACIÓN PROFESIONAL

Fecha: 30/09/2026  
Estado: foundation profesional estudiada; aprendizaje continuo obligatorio.  
No equivale a certificación externa.

## Objetivo

Desarrollar competencia profesional en **Knowledge Systems, Information Retrieval, Digital Curation, Knowledge Governance y Provenance** aplicada a Iris Green y Sabik.

## Módulo 1 · Information Retrieval

Estudiar y practicar:
- índices invertidos;
- tokenización y normalización;
- TF-IDF/BM25;
- recuperación densa;
- ANN/vector search;
- búsqueda híbrida;
- fusion de rankings (RRF);
- reranking;
- query expansion/rewrite;
- filtros estructurados;
- multilingüe;
- recall/precision trade-offs.

Fuentes base:
- Stanford · Introduction to Information Retrieval  
  https://nlp.stanford.edu/IR-book/
- BEIR · Benchmarking IR  
  https://arxiv.org/abs/2104.08663
- MIRACL · Multilingual Information Retrieval  
  https://aclanthology.org/2023.tacl-1.63/

Aprendizaje central:
no asumir que dense retrieval sustituye a BM25. El sistema debe comparar estrategias con benchmarks representativos del corpus real.

## Módulo 2 · Evaluación de recuperación

Dominar:
- Recall@k;
- Precision@k;
- MRR;
- MAP;
- nDCG;
- hit rate;
- cobertura por dominio/idioma/etapa;
- zero-result rate;
- stale-result detection;
- citation coverage;
- evaluación por slices.

Fuentes:
- BEIR;
- MTEB / retrieval tasks  
  https://arxiv.org/abs/2210.07316
- RAGAS  
  https://arxiv.org/abs/2309.15217

Regla:
separar al menos tres preguntas:
1. ¿recuperé la evidencia correcta?
2. ¿el contexto seleccionado es suficiente y pertinente?
3. ¿la respuesta/cita usa fielmente esa evidencia?

Nube es dueña principalmente de 1 y de la calidad/citabilidad del material que habilita 2.

## Módulo 3 · Metadatos y catálogo

Estudiar:
- identificadores persistentes;
- versiones;
- timestamps;
- estado editorial;
- idioma;
- audiencia;
- jurisdicción;
- periodo/población cuando aplica;
- licencias/derechos;
- relaciones;
- canonical URL;
- checksum/hash.

Fuentes:
- W3C DCAT 3  
  https://www.w3.org/TR/vocab-dcat-3/
- Dublin Core Metadata Initiative  
  https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
- Schema.org  
  https://schema.org/

Aplicación:
cada fragmento recuperable debe poder volver a un objeto de conocimiento identificable y a su fuente.

## Módulo 4 · Provenance y knowledge representation

Fuentes:
- W3C PROV-O  
  https://www.w3.org/TR/prov-o/
- W3C SKOS  
  https://www.w3.org/TR/skos-reference/
- W3C SHACL  
  https://www.w3.org/TR/shacl/

Estudiar:
- Entity / Activity / Agent;
- derivación;
- wasGeneratedBy;
- source lineage;
- vocabularios controlados;
- esquemas y validación;
- relaciones semánticas.

Regla:
una transformación no debe borrar la historia de la fuente.

## Módulo 5 · Knowledge Management y records

Fuentes:
- ISO 30401:2018 · Knowledge management systems  
  https://www.iso.org/standard/68683.html
- ISO 15489-1:2016 · Records management  
  https://www.iso.org/standard/62542.html
- ISO 14721:2025 · OAIS reference model  
  https://www.iso.org/standard/87471.html

Estudiar:
- fuente de verdad;
- retención;
- autenticidad;
- integridad;
- disponibilidad;
- contexto;
- lifecycle;
- preservación;
- retirada;
- auditabilidad.

Aplicación:
releases verificadas no se sobrescriben. Las retiradas necesitan tombstone/histórico cuando corresponda.

## Módulo 6 · Calidad del dato

Fuentes:
- ISO/IEC 25012:2008 · Data quality model  
  https://www.iso.org/standard/35736.html
- familia ISO/IEC 5259 · Data quality for analytics and ML  
  https://www.iso.org/standard/81088.html

Dimensiones a convertir en controles:
- exactitud;
- completitud;
- consistencia;
- credibilidad;
- actualidad;
- accesibilidad;
- trazabilidad;
- conformidad con esquema.

## Módulo 7 · Chunking y representación

Estudiar:
- fixed-size;
- sentence/paragraph;
- semantic;
- structure-aware;
- hierarchical;
- parent-child retrieval;
- tablas/documentos complejos;
- overlap y pérdida de contexto.

Regla:
no existe tamaño de chunk universal. La unidad se decide por estructura y se valida con recuperación real.

Preservar, cuando aplique:
- documento;
- sección;
- heading;
- posición;
- tabla/figura relacionada;
- locale;
- source version.

## Módulo 8 · Citation engineering

Estudiar:
- entailment entre afirmación y fuente;
- citation correctness;
- citation completeness;
- granularidad;
- stale citations;
- fuentes primarias/secundarias.

Fuentes:
- ALCE · Automatic LLM Citation Evaluation  
  https://arxiv.org/abs/2305.14627
- AIS / attributed text generation research  
  https://aclanthology.org/2023.cl-4.2/

Regla:
“tener URL” no equivale a “estar respaldado por esa URL”.

## Módulo 9 · Seguridad del corpus

Fuentes:
- OWASP Top 10 for LLM Applications / Prompt Injection  
  https://genai.owasp.org/llmrisk/llm01-prompt-injection/
- OWASP Vector and Embedding Weaknesses  
  https://genai.owasp.org/llmrisk/llm08-vector-and-embedding-weaknesses/
- NIST AI RMF 1.0  
  https://www.nist.gov/itl/ai-risk-management-framework

Estudiar:
- indirect prompt injection;
- poisoning;
- malicious documents;
- data leakage;
- tenant/role isolation;
- trust levels;
- sanitization sin destruir evidencia;
- allow/deny policies;
- access control before retrieval;
- provenance-aware ingestion.

Regla:
contenido recuperable no significa contenido confiable.

## Módulo 10 · Sincronización y actualización

Fuentes:
- NISO ResourceSync  
  https://www.niso.org/publications/z3999-2017-resourcesync
- OAI-PMH  
  https://www.openarchives.org/pmh/
- HTTP conditional requests / validators (RFC 9110)  
  https://www.rfc-editor.org/rfc/rfc9110

Estudiar:
- source registry;
- ETag/Last-Modified;
- fingerprints;
- deltas;
- dependency mapping;
- incremental rebuild;
- invalidation;
- tombstones;
- idempotencia;
- no-op detection;
- readback.

Aplicación Iris Green:
`WEB_SOURCE_CHANGE -> A9_INCREMENTAL_LIBRARY_CANDIDATE`, únicamente desde fuente aprobada.

## Módulo 11 · Práctica Iris Green

Base existente:
- #314;
- R03 inmutable;
- R04 privada/parcial verificada;
- source registry;
- delta schema;
- safety before ranking;
- age before ranking;
- auditoría de citas;
- deduplicación;
- actualización incremental;
- hashes de corpus/manifiesto;
- release immutable;
- no datos de usuario.

Prácticas futuras:
1. benchmark léxico vs denso vs híbrido;
2. golden queries ES/EN;
3. pruebas de stale knowledge;
4. pruebas de ACL/safety antes de ranking;
5. poisoning fixtures;
6. citation entailment checks;
7. rebuild incremental determinista;
8. recovery desde manifest + hashes.

## Criterio de madurez

Nube puede declararse preparada para ejecutar una tarea cuando:
- sabe identificar la fuente;
- puede explicar el schema;
- conoce la versión;
- define el gate;
- puede reproducir la recuperación;
- mide el resultado;
- conserva evidencia;
- sabe qué NO debe ingerir.

Nunca declarar “formación terminada para siempre”. Este dominio cambia y exige actualización continua.
