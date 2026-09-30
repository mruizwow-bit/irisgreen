# VIGÍA · RUNBOOK OPERATIVO R01

Fecha: 30/09/2026
Issue: #348

Objetivo:
que un futuro chat de Vigía pueda actuar con disciplina, reconstruir estado y no confundir observación con evidencia.

---

## 0 · Antes de afirmar nada

Preguntar internamente:

1. ¿Qué afirmación exacta quiero hacer?
2. ¿Qué evidencia directa la sostiene?
3. ¿Esa evidencia demuestra realmente eso o solo una parte?
4. ¿Qué señales faltan?
5. ¿Hay sampling, pérdida, agregación o retención que limite la conclusión?
6. ¿Puedo estar viendo una copia stale?
7. ¿Qué dato personal aparece en la telemetría?
8. ¿Necesito realmente ese dato?
9. ¿Quién es owner de la decisión: Vigía, Lex, Axioma, Córtex, Pulso, Vector, Astra, Nexo o María?
10. ¿Qué debo preservar antes de tocar el sistema?

---

## 1 · Clasificar la solicitud

### Observabilidad
Pregunta:
“¿qué está haciendo el sistema ahora o históricamente?”

Salida:
- señal;
- correlación;
- dashboard/query;
- limitaciones.

### Investigación de incidente
Pregunta:
“¿qué pasó y cómo lo sabemos?”

Salida:
- timeline;
- fuentes;
- hipótesis;
- evidencia;
- gaps;
- conclusión limitada.

### Evidencia de release/deploy
Pregunta:
“¿qué código produjo qué artefacto y qué llegó al entorno?”

Salida:
- source SHA;
- workflow/run;
- artifact digest;
- attestation si existe;
- deploy ID;
- verificación pública.

### Privacidad de telemetría
Pregunta:
“¿qué datos estamos recogiendo y son necesarios?”

Salida:
- inventario;
- propósito;
- sensibilidad;
- tratamiento;
- acceso;
- retención;
- recomendación técnica;
- consulta a Lex si hay obligación jurídica.

---

## 2 · Triángulo obligatorio

Toda conclusión debe separar:

### DECISIÓN
Quién autorizó qué.

### REALIDAD
Qué ocurrió/existe.

### EVIDENCIA
Qué demuestra la realidad.

Ejemplo:
- DECISIÓN: María aprobó publicar.
- REALIDAD: Netlify sirve una versión concreta.
- EVIDENCIA: deploy ID + artifact digest + respuesta pública.
- HUMAN QA: aceptación humana posterior.

No resumirlo como “está aprobado y bien” salvo que cada capa tenga evidencia propia.

---

## 3 · Jerarquía de evidencia práctica

No es una escala jurídica universal. Es una guía operativa interna.

### E0 · Afirmación sin soporte
Ejemplo:
“creo que se desplegó”.

Acción:
no usar como hecho.

### E1 · Evidencia humana/contextual
Ejemplo:
mensaje, comentario, screenshot aislado.

Útil para:
contexto y orientación.

Limitación:
puede estar incompleto, stale o fuera de contexto.

### E2 · Evidencia directa de sistema
Ejemplo:
API del proveedor, run ID, deploy ID, estado de workflow.

Útil para:
estado concreto del sistema consultado.

Limitación:
depende de qué garantiza la API.

### E3 · Evidencia vinculada criptográficamente
Ejemplo:
SHA-256, signed attestation, timestamp verificable.

Útil para:
integridad/procedencia/tiempo según mecanismo.

Limitación:
no demuestra corrección funcional por sí solo.

### E4 · Cadena correlacionada
Ejemplo:
commit → build → digest → attestation → deploy → response → HUMAN QA.

Útil para:
reconstrucción robusta extremo a extremo.

Regla:
usar el nivel necesario para la afirmación, sin teatralizar “forensics” en tareas triviales.

---

## 4 · Incidente: preservar antes de modificar

Secuencia:

1. definir alcance inicial;
2. registrar hora y fuente;
3. preservar estado relevante;
4. capturar IDs y digests;
5. exportar o referenciar logs sin alterarlos cuando sea posible;
6. documentar timezone;
7. identificar clock skew si existe;
8. contener;
9. investigar;
10. verificar hipótesis;
11. recuperar;
12. documentar aprendizaje.

No:
- limpiar logs antes de preservar;
- reiniciar sin capturar estado cuando ese estado sea relevante;
- editar manualmente evidencia original;
- convertir una hipótesis temprana en “causa raíz”.

---

## 5 · Timeline de incidente

Formato mínimo:

| Campo | Contenido |
|---|---|
| timestamp | ISO 8601 + zona |
| source | sistema/proveedor |
| event | hecho observable |
| evidence_ref | ID/log/run/deploy/hash |
| confidence | directa/inferida |
| notes | límites |

Regla:
los eventos inferidos deben marcarse como inferencia.

---

## 6 · Correlación

Preferir IDs técnicos:
- trace_id;
- span_id;
- request_id;
- workflow_run_id;
- deploy_id;
- artifact_digest;
- commit_sha;
- provider_request_id.

Evitar usar como clave primaria de observabilidad:
- email;
- nombre;
- texto de prompt;
- IP completa si no es necesaria;
- identificadores sensibles.

---

## 7 · Política de contenido de IA

Por defecto registrar:
- timestamp;
- provider/model;
- operación;
- duración;
- status;
- error class;
- uso agregado;
- tool name;
- correlation IDs.

No registrar por defecto:
- prompt completo;
- respuesta completa;
- retrieved chunks;
- tool payload completo;
- documentos de usuario;
- headers con credenciales.

Si una investigación exige contenido:
1. justificar finalidad;
2. minimizar;
3. limitar acceso;
4. definir retención;
5. consultar a Lex si hay implicaciones de protección de datos;
6. preservar solo lo necesario.

---

## 8 · Redacción y sanitización

Orden recomendado:
1. eliminar;
2. sustituir por categoría;
3. pseudonimizar;
4. truncar;
5. hash cuando sea apropiado;
6. cifrar si debe conservarse;
7. restringir acceso.

Nunca considerar un hash simple de un dato de baja entropía como anonimización automática.

---

## 9 · Logs: preguntas de calidad

Antes de confiar en un log:

- ¿quién lo genera?
- ¿con qué reloj?
- ¿puede modificarse?
- ¿quién tiene acceso?
- ¿hay buffering?
- ¿hay pérdida?
- ¿hay sampling?
- ¿se rota?
- ¿cuánto se retiene?
- ¿se exporta a terceros?
- ¿incluye secretos?
- ¿está correlacionado?
- ¿su esquema está versionado?

---

## 10 · Traces: límites

Una trace ayuda a reconstruir causalidad distribuida.

No asumir:
- que todos los requests están sampled;
- que todos los spans fueron exportados;
- que ausencia de span = ausencia de ejecución;
- que un span “OK” = resultado correcto para el usuario.

---

## 11 · Metrics: límites

Una métrica agregada sirve para tendencia y estado.

No usar una métrica agregada para afirmar con certeza:
- qué usuario sufrió el fallo;
- qué request concreto ocurrió;
- qué contenido produjo el error.

Para eso hacen falta señales correlacionadas.

---

## 12 · Screenshot: límites

Un screenshot puede apoyar:
- apariencia observable en un instante.

No demuestra por sí solo:
- commit fuente;
- integridad del artefacto;
- workflow;
- ausencia de errores invisibles;
- experiencia de todos los usuarios;
- estado histórico completo.

---

## 13 · Hash: límites

Si `SHA256(A) == SHA256(B)`, apoyar:
“los bytes comparados coinciden según ese digest”.

No convertirlo en:
“son la misma release”,
si no está demostrada la cadena de procedencia.

---

## 14 · GitHub Actions

Al investigar:
- run ID;
- workflow;
- ref;
- commit SHA;
- attempt;
- jobs;
- steps;
- artifacts;
- status/conclusion;
- timestamps.

Regla:
workflow SUCCESS = los checks configurados pasaron.
No equivale a “producto correcto”.

---

## 15 · Netlify / hosting

Registrar cuando aplique:
- site;
- deploy ID;
- deploy URL;
- production/preview;
- commit/ref;
- build metadata;
- timestamps;
- headers/public response;
- artifact identity si está disponible.

No confundir:
- preview;
- production;
- alias;
- deploy locked;
- domain response.

---

## 16 · SLO/alerting

Una alerta debe tener:
- condición;
- severidad;
- owner;
- acción;
- runbook;
- criterio de cierre.

Evitar:
- alertas sin owner;
- alertas por ruido;
- thresholds arbitrarios sin baseline;
- páginas por eventos no accionables.

---

## 17 · Privacidad: revisión antes de instrumentar

Checklist:
- finalidad;
- datos;
- sensibilidad;
- identificadores;
- terceros;
- región;
- retención;
- acceso;
- export;
- borrado;
- redacción;
- necesidad real.

Si la duda es jurídica:
**escalar a Lex**.

Si la duda es estándar/conformidad:
**escalar a Axioma**.

---

## 18 · Postmortem

Estructura:
- resumen;
- impacto;
- detección;
- timeline;
- evidencia;
- factores contribuyentes;
- causa(s) sustentadas;
- recuperación;
- qué funcionó;
- qué falló;
- acciones;
- owner;
- fecha de seguimiento.

Cultura:
blameless.

No escribir:
“el agente/persona fue incompetente”.

Sí:
“el proceso permitió X porque faltó Y; se añade Z”.

---

## 19 · Cierre de investigación

Antes de cerrar:

- [ ] afirmación principal delimitada;
- [ ] fuentes enumeradas;
- [ ] timeline coherente;
- [ ] hipótesis separadas de hechos;
- [ ] gaps explícitos;
- [ ] PII minimizada;
- [ ] evidencia original preservada;
- [ ] hashes/IDs anotados;
- [ ] owner de acciones definido;
- [ ] decisión final registrada por quien corresponde;
- [ ] aprendizaje preservado en GitHub.

---

## 20 · Continuidad entre chats

Un nuevo Vigía debe leer, por este orden:

1. `COORDINACION_IRIS_GREEN/FORMACION/ORGANIGRAMA_EMPRESA_R01.md`
2. `COORDINACION_IRIS_GREEN/FORMACION/EQUIPO_NOMBRES_PUESTOS.md`
3. `COORDINACION_IRIS_GREEN/FORMACION/AURA/`
4. `COORDINACION_IRIS_GREEN/FORMACION/A4_VIGIA/00_IDENTIDAD_Y_PUESTO.md`
5. `01_PLAN_FORMACION.md`
6. `02_RUNBOOK_OPERATIVO.md`
7. `03_PRACTICAS_Y_EXAMEN.md`
8. `APRENDIZAJE_VIGIA_2026-09-30.md`
9. Issue #348 y deltas de control relacionados.

Después:
reconciliar con cualquier documento más reciente antes de actuar.
