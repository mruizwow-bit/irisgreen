# NEXO · SABIK DIALOGUE LIBRARY / ALEXA RESEARCH · 2026-10-03

Estado: `DIALOGUE_LIBRARY_R01_IN_PROGRESS`

Rama de trabajo:
`nexo/sabik-voice-runtime-recovery-20261002`

## 1. Motivo

HUMAN QA de María ha demostrado que voz + STT + retrieval no bastan para producir una conversación natural.

Fallos observados:
- frases dirigidas al asistente terminaban como búsquedas;
- frases amplias como “Necesito buscar autismo” se enviaban literalmente al índice;
- un turno podía perder el tema anterior;
- STT imperfecto del nombre de Sabik podía desviar la consulta;
- una respuesta de retrieval podía convertirse en lectura de fragmentos;
- el usuario tenía que volver a activar la conversación en algunos estados;
- el sistema no distinguía de forma robusta entre intención, tema, aspecto y acción.

Conclusión:
`RETRIEVAL_IS_NOT_DIALOGUE_MANAGER`

## 2. Investigación Alexa

El patrón público documentado de Alexa Skills / Alexa Voice Service separa:
1. ASR;
2. NLU;
3. Intent;
4. slots/variables;
5. dialog manager;
6. respuesta/reprompt;
7. TTS.

Una skill recibe un `IntentRequest` con intención y slots.
El gestor de diálogo puede obtener slots faltantes antes de ejecutar una acción.
Las variables de sesión mantienen contexto entre turnos.
La respuesta decide además si la sesión continúa o termina.
Los prompts pueden tener formulaciones alternativas para evitar una experiencia mecánica.

Traducción funcional a Sabik:

`STT → INTENT → SLOTS → DIALOG STATE → RETRIEVAL/ACTION → RESPONSE → TTS`

No:

`STT → SEARCH STRING → SNIPPET → TTS`

## 3. Canon Sabik recuperado

La documentación histórica de NEA/Sabik ya definía:
- una sola pregunta útil;
- preguntar solo si la respuesta cambia materialmente;
- memoria de sesión;
- conceptos activos;
- correcciones/negaciones;
- preguntas discriminantes;
- plan de respuesta;
- respuesta por intención;
- capa lingüística;
- recuperación de conocimiento Iris Green separada de la conversación.

También prohíbe sustituir la escucha por:
`pregunta X → respuesta enlatada X`

Permite:
- plantillas con variables;
- respuestas editoriales fijas donde no se debe improvisar;
- selección de versión breve aprobada;
- puntos principales;
- ordenación/reducción de contenido sin inventar afirmaciones nuevas.

## 4. Datasets históricos encontrados

En baseline histórico `efa4ed9b71d9e766f7b32830793f6b711aa5574a` existen:

- `sabik/assets/NEA/data/discriminating-questions.es.json`
  - SHA `4e3bb18d29c150ffdad2863d929374047ebc7339`
  - estado reconciliación: KEEP_FROM_PREVIEW.

- `sabik/assets/NEA/data/language-corpora.json`
  - SHA `c2ef85b798eeb333fe6c132bf73e0fe280797d8d`
  - contiene metadatos de corpus; necesita actualizar rutas antes de promoción.

- `sabik/assets/NEA/data/relations.es.json`
  - SHA `00199dda845cb7cac9ab88088b0a76159360564c`
  - estado reconciliación: KEEP_FROM_PREVIEW.

- `sabik/assets/NEA/data/procedures.es.json`
  - SHA `2c7b1a786885ac047d444c4854e75b0c0f0ecf82`
  - contiene demo PUBLICABLE de procedencia no cerrada; NO promover sin revisión.

- `sabik/assets/NEA/data/actions.es.json`
  - SHA `c0e4822f64fb3c7292f82b4930ca19d319d98343`
  - contiene semántica de riesgo heredada; NO promover por arrastre.

- `sabik/assets/NEA/data/concepts.es.json`
  - SHA `c14b84d3ebe3f981c639915ab081a20f5fdfc648`
  - contiene riesgo heredado; NO promover por arrastre.

En la rama R66 actual esos seis datasets no estaban presentes.

## 5. Componentes históricos a preservar/reconciliar

Control Maestro:
- `intent.js` → KEEP_FROM_PREVIEW;
- `knowledge.js` → KEEP_FROM_PREVIEW;
- `language.js` → KEEP_FROM_PREVIEW;
- `session.js` → KEEP_FROM_PREVIEW;
- `response.js` → REAPPLY_MINIMAL_DELTA;
- `decision.js` → REAPPLY_MINIMAL_DELTA;
- `retrieval.js` → REAPPLY_MINIMAL_DELTA.

No restaurar automáticamente `risk.js` ni rutas de crisis heredadas sin el gate Safety actual.

## 6. Biblioteca de diálogo R01

Separar datos de diálogo del motor.

Ruta propuesta:
`sabik/assets/dialogue-r01/`

Archivos:
- `dialogue-model.es.json`
- `dialogue-model.en.json`
- `dialogue-variables.json`
- `dialogue-tests.es.json`
- `dialogue-tests.en.json`
- `README.md`

### Intents iniciales

- `social.greeting`
- `social.attention`
- `social.thanks`
- `search.topic`
- `information.definition`
- `information.aspect`
- `conversation.repeat`
- `conversation.stop`

Ampliación posterior:
- correction/rejection;
- change_topic;
- compare;
- practical_request;
- source_request;
- shorter/longer;
- explain_again;
- navigation;
- accessibility/preferences.

### Slots iniciales

- `topic`
- `aspect`
- `audience`
- `language`
- `input_mode`
- `response_length`
- `last_intent`
- `pending_slot`

Aspectos iniciales:
- definition;
- signals;
- supports;
- assessment;
- causes;
- sensory;
- communication;
- daily_life;
- education_work;
- research.

## 7. Ejemplo objetivo

Usuario:
`Necesito buscar autismo`

Interpretación:
`intent=search.topic`
`topic=autismo`
`aspect=MISSING`

No retrieval todavía.

Prompt:
una variante de `search.ask_aspect`, por ejemplo:
- “Claro. ¿Qué necesitas saber sobre autismo?”
- “Sí. ¿Buscas algo en concreto sobre autismo?”
- “¿Qué parte de autismo quieres consultar?”

Siguiente turno:
`Señales`

Interpretación:
`intent=information.aspect`
`topic=autismo` heredado;
`aspect=signals`.

Solo ahora:
`retrieve("autismo señales")`.

## 8. Reglas R01

- una pregunta cada vez;
- no retrieval con slots requeridos incompletos;
- mantener topic entre turnos;
- social turns nunca hacen retrieval;
- prompts y reprompts salen de datos, no de JS;
- variantes de prompts rotan dentro de la sesión;
- ningún prompt debe usar snippets como texto de conversación;
- no afirmar “no existe información” cuando puede haber error de comprensión;
- no usar meta description automáticamente como respuesta corta si existe una unidad más adecuada;
- fuentes visibles separadas de la frase hablada;
- session-only, sin persistencia por defecto;
- no inferir emociones por voz;
- no convertir datasets históricos de riesgo en producción por arrastre.

## 9. HUMAN QA

No cerrar HUMAN QA por tests automáticos.

Probar:
1. una sola activación de voz;
2. saludo;
3. búsqueda amplia;
4. repregunta;
5. follow-up corto;
6. corrección;
7. cambio de tema;
8. repeat;
9. stop;
10. STT imperfecto del nombre;
11. ES;
12. EN;
13. fuentes;
14. conversación continua;
15. no retrieval en turnos sociales.

## 10. Estado

`DIALOGUE_LIBRARY_R01_IN_PROGRESS`

No main.
No producción.
La identidad de voz aprobada permanece:
- ES → `SABIK_ES_MASTER_V1_ICL`
- EN → `SABIK_EN_MASTER_V2_ICL`.


## 11. Implementación R01 completada en rama

Biblioteca declarativa creada:

- `sabik/assets/dialogue-r01/dialogue-model.es.json`
- `sabik/assets/dialogue-r01/dialogue-model.en.json`
- `sabik/assets/dialogue-r01/dialogue-variables.json`
- `sabik/assets/dialogue-r01/dialogue-tests.es.json`
- `sabik/assets/dialogue-r01/dialogue-tests.en.json`
- `sabik/assets/dialogue-r01/README.md`
- `sabik/dialogue-library.mjs`

El Core R66 ya consume esta biblioteca mediante:
`getDialogue(locale)`.

### QA declarativo

- ES: `25/25 PASS`
- EN: `18/18 PASS`

Casos cubiertos:
- saludo;
- atención;
- agradecimiento;
- búsqueda de tema;
- definición;
- señales;
- apoyos;
- valoración;
- sensorial;
- comunicación;
- cambio de aspecto;
- cambio de tema;
- repeat;
- stop;
- alias/mala transcripción de Sabik;
- continuidad de topic;
- pending slot;
- búsqueda contextualizada.

### QA público

Secuencia validada contra el preview público:

`Necesito buscar autismo.`
→ `intent=search.topic`
→ `topic=autismo`
→ `pending_slot=aspect`
→ respuesta: `Claro. ¿Qué necesitas saber sobre autismo?`
→ `0 fuentes`.

Segundo turno:
`señales`
→ `intent=information.aspect`
→ `topic=autismo`
→ `aspect=signals`
→ query: `autismo señales`
→ respuesta desde Iris Green;
→ fuente principal: `Autismo`;
→ `0 errores browser`.

## 12. Datos históricos restaurados de forma segura

Restaurados desde baseline histórico, siguiendo Control Maestro KEEP_FROM_PREVIEW:

- `sabik/assets/NEA/data/discriminating-questions.es.json`
- `sabik/assets/NEA/data/relations.es.json`
- `sabik/assets/NEA/data/human-resources.es.json` (vacío deliberadamente)

No restaurados por conflicto pendiente:
- `actions.es.json`
- `concepts.es.json`
- `procedures.es.json`
- `language-corpora.json`

Razón:
riesgo, procedencia editorial o contrato de ruta requieren reconciliación explícita antes de promoción.

## 13. Estado actualizado

`DIALOGUE_LIBRARY_R01_PASS_LOCAL_AND_PUBLIC`

Todavía:
- no main;
- no producción;
- HUMAN QA global pendiente;
- esperar informe adicional de prompts/variaciones para ampliar R02 sin romper el modelo actual.


## 14. Cambio de alcance · Sabik asistente conversacional general y extensible

Decisión de producto de María:

Sabik no debe limitarse a ser un buscador hablado de Iris Green.

Arquitectura objetivo:

`SABIK = CONVERSATION CORE + CAPABILITY ROUTER + DOMAIN LIBRARIES + VOICE`

Capacidades objetivo:
- conversación general;
- Iris Green especialista;
- conocimiento abierto;
- hora;
- fecha;
- meteorología;
- calculadora/conversiones;
- acompañamiento conversacional seguro;
- capacidades futuras extensibles.

Regla:
`DIALOGUE_FIRST_CAPABILITY_SECOND`

El diálogo decide primero:
- intención;
- slots;
- pending slot;
- continuidad;
- corrección;
- acción/capability.

Solo después se ejecuta una herramienta o recuperación.

### SABIK_TODAY

Disponible/operativo hoy en la rama R66:
- STT Parakeet ES/EN;
- TTS Sabik HUMAN PASS ES/EN;
- conversación de voz continua tras activación explícita;
- dialogue library R01 conectada;
- Iris Green local retrieval;
- fuentes;
- sesión local;
- saludo/social turns básicos;
- topic/aspect carry-over;
- prompts/reprompts R01.

Parcial:
- Iris Green retrieval conversacional;
- correcciones;
- follow-up;
- comparación.

No conectado todavía:
- conocimiento general abierto;
- hora;
- fecha;
- meteorología;
- calculadora/conversiones;
- safe companion completo;
- capability router productivo.

### SABIK_TARGET_ARCHITECTURE

- diálogo general extensible;
- intents/slots data-driven;
- capability registry;
- capability routing;
- multi-domain;
- conversaciones largas;
- correcciones y cambios parciales de contexto;
- herramientas dinámicas;
- grounded knowledge por dominio;
- safety gate antes de acciones sensibles;
- no persistencia por defecto.

## 15. Dialogue Library R02

R02 se crea encima de R01; R01 permanece estable.

Ruta:
`sabik/assets/dialogue-r02/`

Incluye:
- `dialogue-model.es.json`
- `dialogue-model.en.json`
- `dialogue-variables.json`
- `dialogue-tests.es.json`
- `dialogue-tests.en.json`
- `capabilities-r01.json`
- `README.md`

### Intents añadidos R02

- `information.comparison`
- `conversation.not_that`
- `conversation.correction_topic`
- `conversation.continue`
- `conversation.new_topic`
- `conversation.response_length`
- `conversation.response_length_detailed`
- `information.supports_contextual`
- `utility.time`
- `utility.date`
- `utility.weather`
- `utility.calculate`
- `general.wh_question`
- `general.question`

### Variables R02

21 slots/variables declarados.

Añadidos:
- `last_topic`
- `correction`
- `follow_up`
- `turn_count`
- `fallback_count`
- `last_prompt`
- `asr_error_count`
- `asr_confidence`
- `capability`
- `compare_topic`
- `timezone`
- `location`
- `safety_flags`

### Privacy/Safety

No adoptar de los informes propuestas incompatibles con el canon.

Explícitamente prohibido por defecto:
- inferir `user_emotion` desde voz/rostro/tecleo/pausas;
- crear perfil oculto persistente;
- persistir ubicación precisa;
- persistir transcripciones de voz;
- usar logs de contenido como memoria del usuario.

`location` solo request-scoped y explícita/permisada.
`asr_confidence` solo por turno.
`topic/last_topic/last_intent` solo sesión por defecto.

## 16. QA Dialogue R02

Batería total:
- ES: `55/55 PASS`
- EN: `46/46 PASS`
- total: `101/101 PASS`

Cobertura:
- saludo;
- social/attention;
- thanks;
- búsqueda de tema;
- definición;
- señales/apoyos/valoración;
- comparación;
- corrección;
- “no era eso”;
- cambio de topic;
- cambio de aspect;
- continue;
- new topic;
- response length;
- repeat;
- stop;
- aliases ASR;
- pending slots;
- carry-over;
- time;
- date;
- weather;
- calculator;
- general knowledge routing;
- conflictos entre definition/calculator/general query.

R02 todavía NO está conectada al preview.

Estado:
`DIALOGUE_R02_101_OF_101_PASS_NOT_YET_WIRED`

R01 sigue siendo la versión activa en preview.

No main.
