# APRENDIZAJE_NUBE_2026-09-30

## Identidad

- **Alias:** Nube
- **Agente:** A9
- **Puesto profesional:** Knowledge Systems & Information Retrieval Engineer
- **Especialización:** Knowledge Governance, Digital Curation, Retrieval & Provenance
- **Jefatura/coordinación:** Aura
- **Alcance:** biblioteca/corpus, fuentes, citas, procedencia, versionado, retrieval, safety de corpus, updater y evidencia.

## Qué estudié

### Information Retrieval
Fuentes:
- Stanford IR Book — https://nlp.stanford.edu/IR-book/
- BEIR — https://arxiv.org/abs/2104.08663
- MIRACL — https://aclanthology.org/2023.tacl-1.63/

Aprendizaje:
- la recuperación léxica sigue siendo un baseline serio;
- dense retrieval no gana universalmente;
- híbrido/reranking deben justificarse con benchmark;
- medir por consulta y por slices, no solo promedio global.

### Metadatos, catálogo y procedencia
Fuentes:
- DCAT 3 — https://www.w3.org/TR/vocab-dcat-3/
- DCMI Terms — https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
- PROV-O — https://www.w3.org/TR/prov-o/
- SKOS — https://www.w3.org/TR/skos-reference/
- SHACL — https://www.w3.org/TR/shacl/

Aprendizaje:
- un fragmento necesita identidad y contexto;
- versión, source, rights, locale y relaciones no son extras;
- la transformación debe conservar lineage;
- schemas deben poder validarse;
- vocabularios controlados reducen drift semántico.

### Knowledge/Records/Digital preservation
Fuentes:
- ISO 30401:2018;
- ISO 15489-1:2016;
- ISO 14721:2025 OAIS.

Aprendizaje:
- conocimiento gestionado implica ciclo de vida;
- preservar contexto y autenticidad;
- separar activo de histórico;
- releases verificadas no se sobrescriben.

### Data quality
Fuentes:
- ISO/IEC 25012:2008;
- ISO/IEC 5259 family.

Aprendizaje:
calidad no es solo “texto correcto”. Incluye completitud, consistencia, actualidad, credibilidad, conformidad y trazabilidad.

### Chunking / representación
Aprendizaje:
- no existe chunk size universal;
- no aplanar indiscriminadamente tablas/estructura;
- preservar parent/section/source;
- evaluar estructura-aware y hierarchical cuando el corpus lo requiera.

### Citation engineering
Fuentes:
- ALCE — https://arxiv.org/abs/2305.14627
- attributed text generation research — https://aclanthology.org/2023.cl-4.2/

Aprendizaje:
- URL presente != cita correcta;
- evaluar soporte de la afirmación, cobertura y versión;
- cada respuesta citable debe poder reconstruir la evidencia.

### Seguridad
Fuentes:
- OWASP LLM01 Prompt Injection;
- OWASP Vector and Embedding Weaknesses;
- NIST AI RMF 1.0.

Aprendizaje:
- una fuente puede ser auténtica y contener instrucciones maliciosas;
- documentos recuperados son datos, no autoridad del sistema;
- poisoning y leakage son riesgos del corpus;
- ACL/safety deben ocurrir antes de ranking;
- ingestión necesita trust/provenance.

### Actualización
Fuentes:
- NISO ResourceSync;
- OAI-PMH;
- RFC 9110 / HTTP validators.

Aprendizaje:
- actualizar no significa reconstruir siempre todo;
- fingerprints + registry + dependency graph permiten incrementales;
- `NO_CONTENT_CHANGE` evita releases inútiles;
- REMOVED debe retirar del índice sin destruir provenance.

## Lo explico con mis palabras

Nube transforma fuentes aprobadas en conocimiento recuperable sin romper la cadena de confianza.

La unidad de trabajo no es “un trozo de texto”: es un objeto con identidad, idioma, fuente, versión, hash, estado, sensibilidad y relaciones.

El objetivo no es devolver algo parecido. Es devolver la evidencia correcta, permitida y vigente; poder medirlo; y poder demostrar después por qué apareció.

## Qué practiqué en Iris Green

### Reconciliación con A9 histórico

Leí:
- Issue #314;
- branch `agent9/r51-cloud-library-r04-20260927`;
- `DELTA_R51_A9_BIBLIOTECA_CLOUD_R04_20260929.json`.

Evidencia verificada del delta:
- 2.718 entidades;
- 2.366 activas;
- 352 en HOLD;
- 0 citation invalid URLs;
- 0 citation missing routes;
- 0 exact duplicate groups;
- 0 cross-content duplicate groups;
- 1 near-duplicate revisado;
- safety antes del ranking;
- age antes del ranking;
- actualización incremental medida;
- corpus y manifest sellados por SHA-256;
- release privada/parcial inmutable;
- producción no modificada;
- no datos de usuario en corpus.

Conclusión:
varias decisiones históricas A9 están bien alineadas con la formación profesional estudiada.

## Pruebas negativas

Razonadas/documentadas:
- overwrite de release verificada;
- borrado físico de REMOVED;
- ingestión indiscriminada de HTML;
- safety posterior al ranking;
- dense-only sin benchmark;
- chunk huérfano sin source;
- observabilidad basada en queries personales;
- prompt injection embebida en documentos.

No se ejecutaron contra producción.

## Errores propios detectados

### Error 1 · identificar inicialmente el oficio demasiado cerca de “RAG”
Causa:
el término RAG domina la conversación actual sobre retrieval.

Corrección:
encuadrar Nube en Information Retrieval + Knowledge Systems + Digital Curation + Governance + Provenance.

Aprendizaje:
RAG es consumidor/arquitectura de uso; Nube debe dominar el subsistema de conocimiento independientemente del LLM.

### Error 2 · riesgo de confundir formación con evidencia de ejecución
Corrección:
separar en el expediente:
- estudiado;
- razonado;
- comprobado en A9 histórico;
- no comprobado hoy.

### Error 3 · asumir `main` como lugar de documentación
Hallazgo:
`main` no contiene la jornada de formación R02.

Corrección:
partir del commit R02 canónico y crear rama de formación propia.

## Runbook

Ver:
`COORDINACION_IRIS_GREEN/FORMACION/A9_NUBE/03_RUNBOOK_CONTINUIDAD.md`

Regla esencial:
**GitHub = estado/decisión/evidencia durables. Slack = coordinación rápida.**

## Límites

Todavía NO está comprobado en esta jornada:
- benchmark BM25 vs dense vs híbrido sobre R04;
- embeddings;
- reranker;
- cambios al updater;
- pruebas de poisoning ejecutadas;
- HUMAN QA autenticado;
- resolución de blockers históricos #314;
- conformidad/certificación ISO;
- promoción a producción.

## Estado al cerrar la formación

- Base de formación: Aura R02 commit `41a01a5534161da5e4b412dd0c6af424e836a53c`.
- Rama: `nube/a9-knowledge-cloud-retrieval-foundation-r01-20260930`.
- Issue general: #348.
- Issue A9 histórico: #314.
- Producto: no modificado.
- Cloud: no modificado.
- Producción: no modificada.
- Formación: foundation profesional suficiente para asumir tareas A9; aprendizaje continuo obligatorio.

## Los primeros 15 minutos del siguiente Nube

1. Leer `00_IDENTIDAD_Y_PUESTO.md`.
2. Leer este aprendizaje.
3. Leer `03_RUNBOOK_CONTINUIDAD.md`.
4. Leer protocolo general de nuevo chat.
5. Verificar organigrama y frontera A9/A10/A3/A2 vigentes.
6. Leer issue/orden concreta que María/Aura asigne.
7. Resolver HEAD real del carril de trabajo.
8. Leer último delta de A9.
9. Comparar con el estado registrado.
10. Verificar manifest/corpus hashes si la tarea toca Cloud.
11. Identificar HOLD/blockers.
12. Confirmar fuentes aprobadas.
13. Hacer prueba mínima read-only.
14. Solo después, modificar.
15. Al cerrar, registrar nuevo aprendizaje y estado.

## Frase de trabajo de Nube

**No basta encontrar información: hay que poder demostrar qué se encontró, de dónde salió, qué versión era, por qué estaba permitido recuperarlo y si sigue siendo válido.**
