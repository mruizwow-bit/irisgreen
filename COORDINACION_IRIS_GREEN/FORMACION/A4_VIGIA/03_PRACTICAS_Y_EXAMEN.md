# VIGÍA · PRÁCTICAS Y EXAMEN R01

Fecha: 30/09/2026
Issue: #348

Objetivo:
convertir la formación teórica en criterio operativo reproducible.

---

## Práctica 1 · ¿Qué demuestra esta evidencia?

Clasificar:
- screenshot;
- log;
- trace;
- métrica;
- commit SHA;
- artifact SHA-256;
- workflow SUCCESS;
- deploy READY;
- signed attestation;
- HUMAN QA.

Para cada uno:
1. qué demuestra;
2. qué NO demuestra;
3. qué evidencia adicional faltaría para una afirmación extremo a extremo.

PASS:
ninguna conclusión excede el alcance real de la evidencia.

---

## Práctica 2 · Telemetría mínima para Sabik

Diseñar instrumentación para una interacción de IA sin guardar prompt/output completo.

Debe incluir:
- timestamp;
- trace/request ID;
- provider/model;
- operación;
- latencia;
- status;
- error class;
- tool calls por nombre;
- uso agregado;
- versión/config relevante cuando sea seguro.

Debe excluir por defecto:
- texto del usuario;
- respuesta;
- documentos;
- secretos;
- tokens de autenticación;
- PII innecesaria.

PASS:
puede diagnosticarse un fallo operacional sin convertir observabilidad en copia de la conversación.

---

## Práctica 3 · Fuga de PII en logs

Caso:
un middleware registra headers completos y query strings.

Vigía debe:
1. contener;
2. identificar campos sensibles;
3. preservar evidencia mínima del incidente;
4. detener nueva exposición;
5. proponer redacción/filtros;
6. identificar retención y destinatarios;
7. escalar a Lex para valoración jurídica;
8. documentar aprendizaje.

FAIL:
borrar primero y perder la capacidad de reconstrucción.

---

## Práctica 4 · Trace sampled

Caso:
no aparece un request en tracing.

Pregunta:
¿puede afirmarse que no ocurrió?

Respuesta esperada:
no sin conocer política de sampling, export, pérdida y otras fuentes de evidencia.

PASS:
buscar logs, provider IDs, metrics, access logs u otras señales correlacionables antes de concluir.

---

## Práctica 5 · CI verde, web equivocada

Caso:
GitHub Actions SUCCESS pero producción muestra contenido anterior.

Reconstruir:
`commit → workflow → artifact → digest → deploy → domain`

Posibles fallos:
- artifact distinto;
- deploy no promovido;
- alias/domain a deploy previo;
- build sobre ref inesperada;
- cache;
- verificación sobre URL incorrecta.

PASS:
no culpar al build sin evidencia.

---

## Práctica 6 · Artifact provenance

Dado un archivo:
- calcular/obtener digest;
- localizar workflow;
- localizar commit;
- verificar attestation si existe;
- comparar subject digest;
- identificar builder/workflow identity;
- documentar límites.

PASS:
distinguir integridad de corrección.

---

## Práctica 7 · Timeline forense ligero

Construir timeline con:
- ISO 8601;
- timezone;
- source;
- event;
- evidence ref;
- directa/inferida;
- gap.

PASS:
no inventar eventos para “rellenar” huecos.

---

## Práctica 8 · Clock skew

Caso:
GitHub, Netlify y provider IA muestran tiempos incompatibles por segundos/minutos.

Vigía debe:
- comprobar timezone;
- origen de cada reloj;
- precisión;
- orden causal por IDs si existe;
- margen de incertidumbre.

PASS:
no forzar una cronología falsa.

---

## Práctica 9 · Alerting

Diseñar alertas para:
- error rate;
- latencia;
- disponibilidad;
- provider failures.

Cada alerta:
- SLI;
- umbral basado en objetivo;
- ventana;
- owner;
- runbook;
- acción.

FAIL:
“alertar si cualquier error > 0” sin justificación.

---

## Práctica 10 · Retención

Para cada señal:
- finalidad;
- volumen;
- sensibilidad;
- necesidad histórica;
- acceso;
- periodo propuesto;
- borrado.

PASS:
retención proporcional y revisable.

Lex valida obligaciones legales cuando aplique.

---

## Práctica 11 · Postmortem blameless

Tomar un incidente real de Iris Green:
- state drift;
- stale integration;
- hash mismatch;
- deploy equivocado;
- pérdida de artefacto.

Escribir:
- impacto;
- timeline;
- evidencia;
- factores;
- recuperación;
- acciones verificables.

FAIL:
atribuir la causa a “persona/agente malo”.

---

## Práctica 12 · Observabilidad de RAG

Con Córtex/Nube:
diseñar señales que permitan saber:
- retrieval ejecutado;
- duración;
- número de resultados;
- fuente/colección por ID técnico;
- errores;
- versión de índice/config;
sin registrar automáticamente contenido recuperado.

PASS:
diagnóstico útil con exposición mínima.

---

## Práctica 13 · Tool call sensible

Caso:
una tool recibe email, dirección o información médica.

Diseñar:
- span metadata mínima;
- redacción;
- error reporting sin payload;
- correlation ID;
- acceso restringido.

PASS:
el dashboard no reproduce el dato sensible.

---

## Práctica 14 · Evidence gap

Caso:
hay screenshot de producción pero no artifact digest.

Vigía debe declarar:
`EVIDENCE_GAP_ARTIFACT_IDENTITY`

No:
inferir identidad exacta del build.

PASS:
recomendar cómo cerrar el gap en futuras releases.

---

## Práctica 15 · Reconstrucción desde chat nuevo

Simular desaparición del chat actual.

Un nuevo Vigía debe recuperar:
- identidad;
- jefe;
- fronteras;
- fuentes;
- runbook;
- aprendizaje;
- branch/commit;
- estado de formación.

PASS:
operativo sin pedir a María que repita la formación.

---

# Examen de Vigía

Responder con evidencia y ejemplos:

1. ¿Qué diferencia hay entre observabilidad y logging?
2. ¿Qué relación existe entre traces, metrics y logs?
3. ¿Qué es context propagation?
4. ¿Por qué Baggage puede ser un riesgo de privacidad?
5. ¿Qué significa sampling y qué invalida?
6. ¿Qué es cardinalidad y por qué importa?
7. ¿Qué diferencia hay entre SLI y SLO?
8. ¿Qué es un error budget?
9. ¿Cuándo una alerta es accionable?
10. ¿Qué datos NO deben ir a logs por defecto?
11. ¿Qué implica data minimization en telemetría?
12. ¿Por qué prompts/outputs completos no son observabilidad por defecto?
13. ¿Qué debe preservarse antes de modificar un sistema durante un incidente?
14. ¿Qué diferencia hay entre hecho e hipótesis?
15. ¿Qué demuestra un SHA-256?
16. ¿Qué NO demuestra un SHA-256?
17. ¿Qué aporta una attestation?
18. ¿Qué NO aporta una attestation?
19. ¿Qué diferencia hay entre commit, artifact y deploy?
20. ¿Por qué CI verde no prueba producción correcta?
21. ¿Qué es clock skew?
22. ¿Qué significa chain of custody y cuándo puede importar?
23. ¿Qué diferencia hay entre screenshot y evidencia de procedencia?
24. ¿Cómo investigas ausencia de una trace si existe sampling?
25. ¿Cuándo debes consultar a Lex?
26. ¿Cuándo debes consultar a Axioma?
27. ¿Qué pertenece a Córtex y qué a Vigía?
28. ¿Qué pertenece a Pulso y qué a Vigía?
29. ¿Cómo sabes que una investigación puede cerrarse?
30. ¿Cuál es la regla principal de Vigía?

Respuesta 30 esperada:
**No afirmar más de lo que demuestra la evidencia.**

---

## Gate interno

`VIGIA_OBSERVABILITY_PRIVACY_EVIDENCE_FOUNDATION_R01_PASS`

El gate significa:
- formación interna foundation completada;
- capacidad para comenzar práctica supervisada en el proyecto;
- obligación de seguir aprendiendo.

No significa:
- certificación profesional externa;
- peritaje forense;
- certificación ISO;
- certificación SRE;
- conformidad legal.
