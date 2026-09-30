# NUBE · A9 · PRÁCTICAS Y EVIDENCIA

Fecha: 30/09/2026  
Tipo: formación + reconciliación read-only con trabajo histórico A9.  
Producto modificado: **NO**.  
Deploy modificado: **NO**.

## Práctica 1 · Reconstruir identidad desde fuentes canónicas

Leído:
- `COORDINACION_IRIS_GREEN/FORMACION/ORGANIGRAMA_EMPRESA_R01.md`
- `COORDINACION_IRIS_GREEN/FORMACION/EQUIPO_NOMBRES_PUESTOS.md`
- `COORDINACION_IRIS_GREEN/FORMACION/AURA/`
- Issue #348
- Foundation R01
- Ampliación R02

Resultado:
- Nube = A9 · Knowledge Cloud & Retrieval;
- coordinación = Aura;
- frontera confirmada:
  - Nube = biblioteca/corpus/fuentes/citas/safety/updater;
  - Córtex = modelo/provider/agentes/RAG consumption/context/evals/LLMOps;
  - Pulso = runtime conversacional;
  - Vector = integración/release web.

## Práctica 2 · Reconciliar formación con el A9 real

Fuente:
- Issue #314 · `R51-A9 · Biblioteca Cloud Sabik R04 · cobertura completa + sincronización incremental`
- branch histórica `agent9/r51-cloud-library-r04-20260927`
- delta `DELTA_R51_A9_BIBLIOTECA_CLOUD_R04_20260929.json`

Hallazgos verificados:
- release privada/parcial declarada inmutable;
- `corpus_sha256` y `manifest_sha256` separados;
- 2.718 entidades;
- 2.366 activas;
- 352 en hold;
- citas: 0 URLs inválidas y 0 rutas ausentes en el delta verificado;
- duplicados exactos: 0;
- duplicados cross-content: 0;
- 1 near-duplicate revisado y mantenido separado;
- `age_before_ranking = true`;
- `safety_before_ranking = true`;
- updater incremental medido frente a full build;
- producción no cambiada;
- frontend, voz, secretos y datos de usuario no cambiados.

Aprendizaje:
el trabajo histórico de A9 ya contiene varias prácticas profesionales correctas: inmutabilidad de releases, hashes, manifest, HOLD explícito, safety previo al ranking, readback, separación candidate/production y actualización incremental.

## Práctica 3 · Modelar el ciclo de vida del conocimiento

Modelo operativo adoptado:

`SOURCE -> INGESTION -> VALIDATION -> NORMALIZATION -> FRAGMENTATION -> INDEXABLE OBJECT -> INDEX -> RETRIEVAL QA -> RELEASE -> READBACK -> UPDATE/RETIRE`

Cada transición debe poder dejar:
- input/version;
- output/version;
- hash cuando aplique;
- reglas ejecutadas;
- resultado de QA;
- estado;
- timestamp;
- provenance.

## Práctica 4 · Diseñar un objeto recuperable mínimo

Campos mínimos recomendados para Iris Green/Sabik:
- `content_id`;
- `fragment_id`;
- `locale`;
- `content_type`;
- `title`;
- `heading`;
- `text`;
- `canonical_url`;
- `source_type`;
- `source_commit`;
- `source_version`;
- `source_hash`;
- `library_version`;
- `editorial_status`;
- `audience[]`;
- `sensitivity`;
- `discovery`;
- `active`;
- `provenance[]`;
- `published_or_reviewed_at`.

Contextuales:
- jurisdiction;
- population;
- period;
- source_language;
- artifact_type;
- life_stage;
- context;
- skill;
- licence/rights;
- safety state.

No guardar como “metadato decorativo”: los campos deben alimentar filtros, gates, auditoría o reconstrucción.

## Práctica 5 · Golden retrieval tests

Diseño de evaluación para una futura implementación:

### Caso A · respuesta citable
Pregunta ES/EN conocida.
Esperado:
- fuente correcta en top-k;
- fragmento con `canonical_url`;
- versión/hash presente;
- cita apunta al fragmento recuperado.

### Caso B · fuente obsoleta
Existe v1 retirada y v2 activa.
Esperado:
- v1 preservada históricamente;
- v1 fuera del índice activo;
- v2 recuperada.

### Caso C · cambio safety
S1 -> S2.
Esperado:
- invalida cache/índice afectado;
- reconstruye dependencias;
- nueva versión;
- clasificación vieja no reaparece.

### Caso D · cambio no editorial
Solo CSS/JS de UI.
Esperado:
- `NO_CONTENT_CHANGE`;
- no release inútil.

### Caso E · poisoning
Documento contiene instrucciones para el modelo.
Esperado:
- tratar instrucciones como datos no confiables;
- origen/trust visible;
- no transformar instrucciones del documento en política del sistema.

### Caso F · permisos
Fuente válida pero no autorizada para el contexto actual.
Esperado:
- queda fuera antes del ranking.

## Práctica 6 · Métricas

No validar retrieval con “lo vi y parece bien”.

Métricas de entrada:
- coverage;
- freshness;
- schema validity;
- citation URL validity;
- duplicate rate;
- active/hold/removed counts.

Métricas de retrieval:
- Recall@k;
- nDCG@k;
- MRR;
- zero-result rate;
- stale-result rate;
- coverage por locale/dominio;
- safety leakage = 0 como requisito.

Métricas operativas:
- full build duration;
- incremental duration;
- entities rebuilt;
- bytes written;
- readback result;
- no-op rate.

## Pruebas negativas razonadas

1. **Sobrescribir una release verificada**
   - fallo: rompe reproducibilidad;
   - control: identidad/version/hash inmutable.

2. **Eliminar físicamente un registro retirado**
   - fallo: pierde provenance;
   - control: tombstone + fuera de índice activo.

3. **Indexar HTML entero sin curación**
   - fallo: duplicación, ruido, navegación tratada como conocimiento;
   - control: PUBLIC_SITE != CLOUD_CORPUS.

4. **Aplicar safety después de ranking**
   - fallo: contenido no permitido ya entra en selección;
   - control: safety/ACL antes de ranking.

5. **Confiar en dense-only**
   - fallo: puede degradar consultas léxicas/raras;
   - control: benchmark contra BM25/híbrido.

6. **Chunk sin parent/source**
   - fallo: fragmento huérfano no auditable;
   - control: IDs + canonical source + source version/hash.

7. **Guardar queries de usuario para observabilidad por defecto**
   - fallo: riesgo de privacidad;
   - control: métricas técnicas agregadas sin conversaciones/datos personales.

## Límites no comprobados hoy

- no se ejecutó benchmark BM25/dense/híbrido sobre R04;
- no se cambió el updater;
- no se probaron embeddings;
- no se modificó Cloud;
- no se hizo HUMAN QA autenticado;
- no se resolvieron blockers históricos de #314;
- no se realizó despliegue;
- no se declaró conformidad/certificación ISO.

Eso queda correctamente separado de la formación teórica y de la evidencia histórica ya existente.
