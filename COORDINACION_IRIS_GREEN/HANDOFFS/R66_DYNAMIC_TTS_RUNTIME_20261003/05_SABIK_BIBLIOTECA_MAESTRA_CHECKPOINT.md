# SABIK · Biblioteca maestra de conocimiento · Checkpoint vivo

**Proyecto:** Iris Green / Sabik / Nexo  
**Fecha de inicio:** 2026-10-03  
**Estado:** EN CONSTRUCCIÓN — archivo de continuidad incremental  
**Idiomas obligatorios:** Español (ES) + English (EN)

---

## 0. Regla de trabajo para no perder avances

Este archivo se actualiza de forma incremental. No se espera al final para escribirlo.

Ciclo obligatorio de trabajo:

1. Analizar un bloque pequeño.
2. Registrar aquí inmediatamente lo aprendido.
3. Guardar checkpoint.
4. Continuar con el siguiente bloque.
5. Al finalizar, generar el paquete de producción y un informe final desde este archivo vivo.

La biblioteca no se reconstruirá desde memoria si una sesión se interrumpe: este MD es el registro de continuidad.

---

# 1. Objetivo global

Construir para **Sabik** una biblioteca de conocimiento **muy grande, estructurada, bilingüe y ampliable**, que incluya:

- todo el contenido publicable de Iris Green;
- la estructura temática completa de la web;
- condiciones, experiencias, situaciones y vida diaria;
- recursos, herramientas, juegos, taller, intereses y datos;
- lenguaje conversacional y continuidad multi-turno;
- sinónimos, equivalencias lingüísticas y reformulaciones;
- definiciones y relaciones conceptuales;
- apoyos y acciones prácticas;
- preguntas discriminantes cuando sean realmente necesarias;
- seguridad, riesgo, privacidad y adecuación por edad;
- metadatos editoriales, procedencia y fecha de revisión;
- conocimiento general estable de apoyo conversacional;
- una capa separada para datos dinámicos que deben consultarse en tiempo real.

Sabik no debe limitarse a autismo, TOC o ansiedad. Debe poder conversar de forma general y extensible, usando Iris Green como corpus propio prioritario y ampliándose de forma segura hacia conocimiento general.

---

# 2. Fuentes ya analizadas

## 2.1. Material aportado en esta conversación

Se han revisado dos archivos equivalentes de investigación conversacional aportados por la usuaria:

- `Texto pegado(20261003-153229).txt`
- `deep-research-report (8).md`

Contenido útil identificado:

- inventario de intents;
- slots/variables conversacionales;
- continuidad de contexto;
- correcciones del usuario;
- fallbacks;
- turnos sociales;
- stop / repeat / continue;
- bilingüismo ES/EN;
- ejemplos multi-turno;
- propuesta de JSON de diálogo;
- batería de tests;
- seguridad y escalado;
- logging y métricas.

Puntos que deben conservarse, pero no copiarse ciegamente:

- una vez establecido el tema, Sabik no debe volver a preguntar por él sin motivo;
- las correcciones del usuario tienen prioridad;
- debe existir manejo explícito de `no era eso`, `repite`, `para`, `sigue`, `gracias`, `¿me oyes?`;
- el sistema debe poder cambiar de idioma sin perder el contexto;
- el diseño conversacional debe tener memoria de sesión y continuidad real;
- el contenido de salud o riesgo requiere tratamiento diferenciado.

## 2.2. Repositorio canónico de Iris Green

Repositorio localizado:

`mruizwow-bit/irisgreen`

Rama canónica actual:

`main`

Inventario observado:

- **3382 blobs/archivos** en el árbol consultado;
- **1050 páginas `index.html`**;
- **532 páginas ES** bajo `/es/`;
- **518 páginas EN** bajo `/en/`.

Distribución principal de páginas:

- `es/neurodiversidad`: 188
- `en/neurodiversity`: 186
- `es/situaciones`: 188
- `en/situations`: 188
- `es/datos`: 50
- `en/data`: 50
- `es/biblioteca`: 49
- `en/everyday-life`: 49
- `es/taller`: 29
- `en/workshop`: 29
- `es/intereses`: 8
- `en/interests`: 7
- `es/recursos`: 7
- `en/resources`: 7

Además existen páginas específicas de:

- metodología;
- investigación;
- privacidad;
- lectura accesible;
- libros;
- cuestionarios;
- vídeos;
- vivir fuera;
- tarjetas Iris;
- sitio tranquilo / quiet space;
- sobre Iris Green.

## 2.3. Repositorio NEA / Sabik previo

Repositorio localizado:

`mruizwow-bit/nea-web-irisgreen`

No debe reconstruirse desde cero.

Documentos existentes especialmente relevantes:

- `ESQUEMA_DATOS_NEA_WEB_V1.md`
- `INDICE_IRIS_GREEN_NEA_WEB_V1.md`
- `CONTRATO_CONTINUIDAD_NEA_WEB_SABIK.md`
- `AUDITORIA_CAPACIDADES_NEA_ORIGINAL_PARA_SABIK.md`
- `AUDITORIA_CAPA_LINGUISTICA_NEA_ORIGINAL.md`
- `NEA_CORE_COGNITIVO.md`
- `BANCO_PRUEBAS_NEA_WEB_V1.md`
- `docs/NEA - Base de conocimiento.md`
- `docs/NEA - Mapa de conocimiento consultable.md`
- `docs/NEA - Sistema multidioma.md`
- `docs/NEA - Normas base de respuesta memoria y lenguaje.md`

Módulos de Core ya existentes:

- `nea-core/state.js`
- `nea-core/session.js`
- `nea-core/corrections.js`
- `nea-core/risk.js`
- `nea-core/language.js`
- `nea-core/knowledge.js`
- `nea-core/retrieval.js`
- `nea-core/response.js`
- `nea-core/sabik-state.js`
- `nea-core/decision.js`
- `nea-core/intent.js`

Regla arquitectónica ya fijada:

> Iris Green entra como base de conocimiento de NEA/Sabik; no debe convertirse en un segundo cerebro separado.

---

# 3. Corpus ya existente y reutilizable

## 3.1. Índice Iris generado previamente

Archivo:

`assets/NEA/generated/iris-fragments-index.es.json`

Estado observado:

- **1267 fragmentos publicables ES**;
- procedentes de **458 URLs ES**;
- 4 elementos saltados por reglas del índice;
- aproximadamente 818.496 caracteres de JSON;
- aproximadamente 317.077 caracteres de texto factual recuperable.

Tipos de fuente en ese índice:

- `meta_description`: 454
- `html_main_section`: 813

Ejemplos de fragmentos presentes:

- Accesibilidad / opciones disponibles;
- Accesibilidad / color y daltonismo;
- secciones extraídas del `<main>` real de Iris Green.

Conclusión:

**No se debe perder ni reemplazar este corpus.** La nueva biblioteca debe reutilizarlo y ampliarlo a ES/EN.

## 3.2. Catálogo bilingüe real de la web

Archivo canónico:

`buscador.json`

Estado observado:

- **372 entradas**;
- **187 Situaciones**;
- **185 Condiciones**;
- las 372 contienen correspondencia ES + EN.

Campos actuales detectados:

- `s` — superficie / tipo visible ES;
- `t` — título ES;
- `u` — URL ES;
- `d` — descripción ES;
- `a` — área ES;
- `tipo` — clasificación de condición (cuando aplica);
- `indexKey`;
- `k` — keywords;
- `en.s`;
- `en.t`;
- `en.u`;
- `en.d`;
- `en.a`.

Este archivo ya resuelve una parte esencial de la equivalencia temática bilingüe.

## 3.3. Ejemplos reales de pares bilingües detectados

### Situación

ES: `No aguanto las etiquetas ni las costuras de la ropa`  
EN: `I can't stand clothing tags or seams`

### Situación

ES: `Salgo del supermercado sin energía y no sé por qué`  
EN: `I leave the supermarket exhausted and I don't know why`

### Situación

ES: `Me despierto de madrugada y ya no vuelvo a dormirme`  
EN: `I wake in the early hours and can't get back to sleep`

### Condición / tema

ES: `TDAH`  
EN: `ADHD`

### Condición / tema

ES: `TOC`  
EN: `OCD`

### Condición / tema

ES: `Sobrecarga sensorial`  
EN: `Sensory overload`

### Condición / tema

ES: `Interocepción`  
EN: `Interoception`

### Condición / tema

ES: `LGTBI+ y neurodiversidad`  
EN: `LGBTQIA+ and neurodiversity`

---

# 4. Cobertura temática observada en Iris Green

La web cubre mucho más que diagnósticos. Entre las categorías y páginas localizadas están:

## Neurodesarrollo y aprendizaje

- autismo / autism;
- TDAH / ADHD;
- AuDHD;
- dislexia / dyslexia;
- discalculia / dyscalculia;
- disgrafía / dysgraphia;
- TDL / DLD;
- dispraxia / DCD;
- apraxia del habla infantil;
- discapacidad intelectual;
- discapacidades del desarrollo;
- síndrome de Tourette;
- trastornos de tics;
- síndrome X frágil;
- TEAF / FASD;
- altas capacidades / giftedness;
- doble excepcionalidad / twice exceptionality.

## Procesamiento sensorial y corporal

- diferencias sensoriales;
- sobrecarga sensorial;
- hiperacusia;
- misofonía;
- interocepción;
- propiocepción;
- sistema vestibular;
- dolor persistente;
- reconocimiento y comunicación del dolor;
- salud gastrointestinal;
- menstruación;
- menopausia;
- sueño;
- insomnio.

## Comunicación

- CAA / AAC;
- comunicación sin habla oral;
- no hablar;
- ecolalia;
- mutismo selectivo;
- tartamudez;
- trastornos de los sonidos del habla;
- instrucciones;
- latencia de respuesta;
- comunicación en pareja.

## Salud mental y experiencias emocionales

- ansiedad;
- TAG / GAD;
- ansiedad social;
- ansiedad por separación;
- ataque de pánico;
- trastorno de pánico;
- depresión;
- TOC / OCD;
- TEPT / PTSD;
- TEPT complejo / complex PTSD;
- disociación;
- TID / DID;
- amnesia disociativa;
- despersonalización / desrealización;
- duelo;
- duelo prolongado;
- soledad;
- culpa;
- vergüenza;
- frustración;
- enfado / ira;
- regulación emocional;
- rumiación;
- rechazo y sensibilidad al rechazo;
- perfeccionismo.

## Alimentación

- selectividad alimentaria;
- ARFID;
- anorexia nerviosa;
- bulimia nerviosa;
- trastorno por atracón;
- OSFED;
- TCA;
- pica;
- comer fuera;
- restaurantes;
- señales de hambre y sed.

## Identidad, género y sexualidad

- identidad de género;
- expresión de género;
- trans;
- no binario;
- género fluido;
- agénero;
- bigénero;
- cisgénero;
- disforia de género;
- nombre elegido;
- deadnaming;
- pronombres;
- orientación sexual;
- orientación romántica;
- bisexualidad;
- pansexualidad;
- homosexualidad / gay / lesbiana;
- asexualidad;
- aromanticismo;
- queer;
- questioning / exploración;
- intersexualidad;
- salir del armario;
- outing;
- sexualidad;
- educación sexual;
- LGTBI+ y neurodiversidad.

## Vida diaria

- cocinar;
- compras;
- higiene y autocuidado;
- dinero;
- vivienda;
- conducción;
- transporte público;
- viajes;
- restaurantes;
- ocio;
- naturaleza;
- animales;
- música;
- deporte;
- actividad física;
- descanso y recuperación;
- planificación diaria;
- funciones ejecutivas;
- procrastinación;
- toma de decisiones;
- autonomía;
- dependencia y necesidades de apoyo.

## Educación, empleo y entorno social

- escuela;
- universidad;
- asistencia escolar;
- bullying / acoso escolar;
- empleo y neurodiversidad;
- adaptaciones y ajustes;
- discriminación;
- racismo;
- pobreza y precariedad;
- acceso a apoyos;
- hospital;
- citas médicas;
- dentista.

## Relaciones y contexto

- amistad;
- relaciones de pareja;
- relaciones seguras;
- límites personales;
- consentimiento;
- pertenencia;
- presión social;
- fatiga social;
- hermanos;
- cambios familiares;
- maternidad y paternidad neurodivergente;
- privacidad;
- seguridad online;
- ciberacoso;
- abuso y explotación.

## Experiencia neurodivergente

- masking / camuflaje;
- burnout autista;
- inercia autista;
- monotropismo;
- hiperfoco;
- intereses intensos;
- alexitimia;
- carga cognitiva;
- motivación;
- creatividad;
- fortalezas;
- autoaceptación;
- autoconcepto;
- autoestima;
- autoconfianza;
- autocompasión;
- self-advocacy / autodefensa;
- diagnóstico tardío;
- niñas y mujeres autistas;
- envejecimiento neurodivergente.

---

# 5. Arquitectura de datos que debe conservarse

El esquema previo de NEA Web ya define estas colecciones:

```text
concepts
relations
fragments
actions
human_resources
discriminating_questions
procedures
language_corpora
```

Esto sigue siendo válido, pero la nueva biblioteca necesita ampliarse.

## 5.1. Colecciones base que se mantienen

### `concepts`

Conceptos reconocibles por Sabik.

Campos mínimos:

- `id`
- `label`
- `language`
- `aliases`
- `category`
- `risk_level`
- `editorial_status`
- `reviewed_at`
- `source_notes`

### `relations`

Relaciones editoriales entre conceptos.

Tipos ya previstos:

- `can_involve`
- `may_help_with`
- `related_to`
- `not_same_as`
- `requires_limit`
- `requires_human_help`

### `fragments`

Unidad de recuperación principal para contenido propio de Iris Green.

### `actions`

Acciones que Sabik puede proponer o preparar.

### `human_resources`

Recursos humanos y de ayuda, con territorio, fecha de verificación y estado.

### `discriminating_questions`

Preguntas para distinguir vías cuando realmente cambian la ayuda.

### `procedures`

Pasos únicamente cuando la fuente es verdaderamente procedimental.

### `language_corpora`

Declaración explícita de idiomas con corpus real.

---

# 6. Ampliación propuesta para la Biblioteca Maestra Sabik

La biblioteca final debe añadir colecciones nuevas para que Sabik pueda ser general y extensible.

## 6.1. `entities`

Entidades generales:

- lugares;
- organizaciones;
- instituciones;
- conceptos científicos;
- objetos cotidianos;
- profesiones;
- disciplinas;
- tecnologías;
- sistemas públicos;
- organismos internacionales.

No almacenar datos cambiantes como si fueran eternos.

## 6.2. `facts`

Hechos estables y verificables.

Cada hecho debe incluir:

- `id`;
- `subject`;
- `predicate`;
- `object`;
- `language`;
- `domain`;
- `source`;
- `source_type`;
- `verified_at`;
- `volatility`;
- `editorial_status`.

## 6.3. `definitions`

Definiciones ES/EN separadas de respuestas conversacionales.

Campos:

- `concept_id`;
- `definition_es`;
- `definition_en`;
- `plain_es`;
- `plain_en`;
- `technical_terms`;
- `sources`.

## 6.4. `aliases_and_equivalences`

Para:

- sinónimos;
- términos cotidianos;
- abreviaturas;
- acrónimos;
- errores ortográficos frecuentes;
- equivalencias ES ↔ EN;
- términos clínicos ↔ lenguaje claro;
- singular/plural;
- variantes regionales seguras.

Debe reutilizar `assets/buscador-equivalencias.json`.

## 6.5. `question_patterns`

Preguntas frecuentes y parafraseadas, sin encerrar el sistema en FAQ rígidas.

Tipos:

- `what_is`;
- `why`;
- `how`;
- `what_can_help`;
- `difference_between`;
- `is_it_common`;
- `examples`;
- `steps`;
- `where_to_find`;
- `how_to_explain`;
- `translate`;
- `summarize`;
- `compare`;
- `continue`;
- `correct`.

## 6.6. `conversation_patterns`

Microinteracciones:

- saludo;
- despedida;
- agradecimiento;
- confirmación;
- negación;
- corrección;
- “no era eso”;
- repetir;
- continuar;
- parar;
- cambiar de idioma;
- pedir respuesta más corta/larga;
- pedir ejemplo;
- reformular;
- pedir explicación fácil;
- pedir respuesta formal/informal.

Todo en ES + EN.

## 6.7. `dynamic_routes`

**Nueva colección esencial.**

No contiene el dato actual. Contiene cómo resolverlo.

Ejemplos de dominios dinámicos:

- hora;
- fecha;
- meteorología;
- noticias;
- deportes;
- precios;
- divisas;
- bolsa;
- disponibilidad;
- horarios comerciales;
- legislación vigente;
- normativa;
- elecciones;
- cargos públicos;
- emergencias y teléfonos oficiales;
- investigación científica reciente;
- versiones de software;
- estado de servicios.

Campos propuestos:

```json
{
  "id": "weather_current",
  "domain": "weather",
  "volatility": "real_time",
  "requires_live_source": true,
  "stale_after_seconds": 900,
  "answer_without_live_source": false,
  "clarification_fields": ["location"],
  "language": ["es", "en"]
}
```

## 6.8. `source_registry`

Registro de fuentes por dominio y autoridad.

Debe distinguir:

- fuente primaria;
- organismo oficial;
- revisión sistemática;
- guía clínica;
- dataset;
- estándar;
- fuente interna Iris Green;
- contenido editorial propio;
- fuente secundaria.

## 6.9. `safety_profiles`

Para no mezclar el contenido adulto, infantil o de alta sensibilidad.

Campos:

- `sensitivity`;
- `age_bands`;
- `discovery_mode`;
- `safe_variant_group`;
- `requires_explicit_intent`;
- `can_autocomplete`;
- `can_recommend`;
- `can_expand`.

---

# 7. Seguridad y clasificación ya existentes en la web

La web actual ya contiene una separación importante entre contenido seguro y contenido sensible.

Componentes localizados:

- `assets/content-safety/search-intentional-safe.json`
- `scripts/build_child_safety_search.py`
- `assets/safety/age-classification-r51-conditions.json`
- `assets/safety/age-classification-r51-data.json`
- `assets/safety/age-classification-r51-global.json`
- `assets/safety/age-classification-r51-library.json`
- `assets/safety/age-classification-r51-research.json`
- `assets/safety/age-classification-r51-situations.json`
- `assets/safety/age-classification-r51-support.json`
- `assets/safety/audience-surface-r51.json`

La búsqueda de Iris Green ya distingue:

- modo seguro por defecto;
- búsqueda intencional;
- contenido S2 de alta sensibilidad;
- catálogo adulto;
- restricciones por edad.

Regla de Sabik:

**la biblioteca no puede ignorar esta clasificación.** Cada registro sensible debe conservar metadatos de audiencia y descubrimiento.

---

# 8. Multidioma obligatorio

La usuaria ha indicado explícitamente que la biblioteca debe estar en:

- **Español**;
- **English**.

Reglas:

1. Todo registro nuevo debe tener ES/EN cuando el contenido sea estable y traducible.
2. La equivalencia no debe ser una traducción literal si suena artificial.
3. Se conserva intención y nivel de claridad.
4. Sabik responde en el idioma del usuario.
5. Sabik puede cambiar ES ↔ EN a mitad de conversación sin perder tema, intención ni referencias.
6. Alias, sinónimos, intents, prompts y ejemplos también deben ser bilingües.
7. Los datos legales, sanitarios o administrativos se adaptan al territorio, no solo al idioma.
8. No se debe presentar como equivalente territorial una fuente de otro país.

El sistema multidioma previo de NEA ya establece que idioma, avatar, memoria, permisos y límites son capas separadas.

---

# 9. Conversación: capacidades que deben entrar en la biblioteca

Del informe aportado y del Core actual se consolidan estos intents mínimos:

## Conversación básica

- greeting / saludo;
- farewell / despedida;
- thanks / agradecimiento;
- social_turn;
- continue;
- stop;
- repeat.

## Consulta

- topic_search;
- information_request;
- specific_question;
- definition;
- signs;
- supports;
- comparison;
- examples;
- practical_request;
- factual_query.

## Reparación

- correction;
- not_that / no_era_eso;
- reformulation;
- clarification;
- fallback.

## Continuidad

- follow_up;
- change_topic;
- change_language;
- response_length;
- previous_answer_reference;
- resume_previous_thread.

## Acompañamiento

- accompaniment;
- emotional_support;
- low_demand;
- overload;
- risk_ambiguous;
- risk_high.

---

# 10. Estado conversacional que debe preservarse

Variables ya propuestas y/o existentes:

- `topic`;
- `aspect`;
- `audience`;
- `language`;
- `response_length`;
- `pending_slot`;
- `last_intent`;
- `last_topic`;
- `correction`;
- `follow_up`;
- `state`;
- `confidence`;
- `timestamp`;
- `session_id`;
- `turn_count`;
- `locale`;
- `timezone`;
- `location` cuando sea necesaria;
- `device`;
- `asr_confidence`;
- `preferred_style`;
- `safety_flags`;
- `fallback_count`;
- `last_prompt`;
- `suggested_actions`.

Estado ya implementado en Core y que no debe perderse:

- `current_need`;
- `user_statements`;
- `user_negations`;
- `user_corrections`;
- `active_concepts`;
- `vetoed_concepts`;
- `rejected_fragments`;
- `rejected_concepts`;
- `rejected_response_types`;
- `shown_fragments`;
- `asked_questions`;
- `session_preferences`;
- `cognitive_state`;
- `sabik_state`;
- `privacy_state`.

Regla crítica:

**La corrección explícita de la persona pesa más que cualquier inferencia o recuperación automática.**

---

# 11. Principios de respuesta que deben mantenerse

Del trabajo previo NEA/Sabik:

- persona antes que categoría;
- no etiquetar a la persona;
- no convertir coincidencia léxica en diagnóstico;
- no inventar causa;
- no confundir relación editorial con hecho clínico;
- escuchar antes de actuar;
- investigar antes de afirmar cuando haga falta actualidad;
- lenguaje claro sin empobrecer;
- adaptar longitud y carga;
- máximo una pregunta útil cuando sea necesaria;
- no preguntar por costumbre;
- si hay suficiente información, responder;
- si el usuario corrige, reparar y seguir;
- no defender la respuesta anterior;
- no convertir conversación natural en checklist sin necesidad;
- no copiar material propio o externo de forma extensa;
- sintetizar y conservar autoría.

---

# 12. Política estático vs dinámico

## 12.1. Puede residir en la biblioteca

- definiciones estables;
- conceptos;
- relaciones editoriales;
- contenido publicado de Iris Green;
- explicaciones educativas;
- principios científicos estables;
- vocabulario;
- traducciones;
- equivalencias;
- tablas de conceptos;
- procedimientos revisados;
- reglas conversacionales;
- reglas de seguridad;
- formatos de respuesta;
- conocimiento general con baja volatilidad.

## 12.2. No debe congelarse como respuesta actual

- tiempo meteorológico;
- hora actual;
- fecha cuando dependa de zona horaria;
- noticias;
- deportes en curso;
- precios;
- tipos de cambio;
- bolsa;
- disponibilidad de reservas;
- horarios de comercios;
- legislación vigente sin verificación;
- normativa actual;
- cargos políticos actuales;
- resultados electorales recientes;
- teléfonos o recursos que puedan cambiar;
- versiones actuales de software;
- investigaciones recientes que puedan modificar recomendaciones.

Para estos temas se almacena **la ruta de consulta, la fuente preferida y la política de caducidad**, no un valor eterno.

---

# 13. Formato de salida propuesto

Paquete final previsto:

```text
sabik-library/
  README.md
  manifest.json
  source-registry.json
  language-corpora.json

  irisgreen/
    catalogue.es-en.json
    fragments.es.jsonl
    fragments.en.jsonl
    concepts.es-en.json
    relations.es-en.json
    situations.es-en.json
    conditions.es-en.json
    everyday-life.es-en.json
    data.es-en.json
    workshop.es-en.json
    interests.es-en.json
    resources.es-en.json

  conversation/
    intents.es-en.json
    utterances.es-en.jsonl
    prompts.es-en.json
    corrections.es-en.json
    continuity.es-en.json
    social-turns.es-en.json
    response-formats.es-en.json

  language/
    aliases.es-en.json
    equivalences.es-en.json
    abbreviations.es-en.json
    common-typos.es-en.json
    plain-language.es-en.json

  knowledge/
    definitions.es-en.jsonl
    facts.es-en.jsonl
    entities.es-en.jsonl
    relations.es-en.jsonl
    procedures.es-en.jsonl

  safety/
    age-profiles.json
    sensitivity-profiles.json
    discovery-policy.json
    risk-routing.es-en.json

  dynamic/
    routes.es-en.json
    freshness-policy.json
    source-preferences.json

  qa/
    coverage-report.json
    duplicate-report.json
    bilingual-parity-report.json
    source-report.json
    tests.es-en.jsonl
```

---

# 14. QA obligatorio

La biblioteca final deberá poder responder estas preguntas automáticamente:

- ¿Cuántos registros tiene?
- ¿Cuántos están en ES?
- ¿Cuántos están en EN?
- ¿Cuántos tienen par ES/EN?
- ¿Cuántos proceden de Iris Green?
- ¿Cuántos son de conocimiento general?
- ¿Cuántos son dinámicos?
- ¿Cuántos son sensibles?
- ¿Cuántos carecen de fuente?
- ¿Cuántos están caducados?
- ¿Cuántos tienen alias?
- ¿Cuántos tienen conflictos o duplicados?
- ¿Cuántos fragmentos apuntan a URLs inexistentes?
- ¿Cuántos conceptos no tienen traducción?
- ¿Cuántas preguntas conversacionales cubren cada intent?

Regla de build heredada y mantenida:

- `BORRADOR` no entra en producción;
- `RETIRADO` no entra como fuente;
- `CADUCADO` no se recomienda;
- recursos humanos deben llevar fecha de verificación;
- IDs no pueden duplicarse;
- toda entrada factual debe declarar fuente o procedencia;
- todo registro debe declarar idioma;
- toda entrada sensible debe declarar política de descubrimiento.

---

# 15. Diferencias detectadas respecto al diseño previo

El diseño anterior estaba centrado principalmente en ES y en recuperación local del contenido de Iris Green.

La nueva biblioteca debe ampliar cuatro cosas:

1. **Bilingüismo real ES/EN a nivel de datos**, no solo traducción de la interfaz.
2. **Cobertura general**, no solo neurodivergencia o salud mental.
3. **Enrutado de conocimiento dinámico**, para responder cosas que cambian sin congelarlas.
4. **Escala**, con miles de fragmentos/registros y QA automatizada.

---

# 16. Estado de ejecución actual

## Completado

- [x] Localizado repositorio canónico Iris Green.
- [x] Localizado repositorio NEA/Sabik previo.
- [x] Confirmada obligación ES + EN.
- [x] Revisada arquitectura previa de datos.
- [x] Revisado Core modular previo.
- [x] Inventariadas páginas principales de Iris Green.
- [x] Contado catálogo `buscador.json`: 372 entradas = 187 situaciones + 185 condiciones.
- [x] Verificado corpus previo: 1267 fragmentos ES de 458 URLs.
- [x] Identificada clasificación de seguridad y edad.
- [x] Definida separación conocimiento estático / datos dinámicos.
- [x] Definida estructura propuesta del paquete final.
- [x] Creado este MD vivo para no volver a perder avances.

## Siguiente bloque

- [ ] Construir extracción bilingüe de páginas ES/EN.
- [ ] Emparejar páginas ES ↔ EN por rutas/catálogo.
- [ ] Generar fragmentos EN equivalentes.
- [ ] Añadir alias y equivalencias.
- [ ] Generar intents, utterances y prompts ES/EN.
- [ ] Añadir biblioteca general estable por dominios.
- [ ] Añadir dynamic routes.
- [ ] Ejecutar QA de paridad, duplicados y fuentes.
- [ ] Empaquetar archivo final para Nexo/Sabik.

---

# 17. Registro de checkpoints

## Checkpoint 001 — 2026-10-03

Creado el archivo maestro vivo tras interrupción de sesión.

Contiene:

- inventario inicial de Iris Green;
- inventario de NEA/Sabik;
- arquitectura recuperada;
- corpus ya generado;
- catálogo bilingüe;
- política ES/EN;
- política estático/dinámico;
- estructura del paquete final;
- QA y próximos pasos.

**Regla desde este punto:** ningún bloque de investigación importante se considera terminado hasta estar escrito en este archivo.

---

# 18. ALCANCE DEFINITIVO — SABIK ES CONVERSACIONAL GENERAL, NO UN ASISTENTE SOLO DE IRIS GREEN

## 18.1 Regla de producto

**Iris Green es una fuente especializada de Sabik, no el límite de Sabik.**

Sabik debe poder mantener conversaciones largas, naturales y coherentes sobre una amplitud muy grande de temas. El corpus de Iris Green aporta conocimiento especializado, lenguaje, recursos, accesibilidad, neurodiversidad y situaciones de vida; fuera de ese dominio, Sabik debe seguir conversando y respondiendo con normalidad.

Arquitectura conceptual:

```text
SABIK
├── conversación general
├── conocimiento general estable
├── Iris Green / conocimiento especializado propio
├── utilidades
├── conocimiento dinámico consultable
├── creatividad y lenguaje
├── razonamiento y resolución de problemas
├── acompañamiento conversacional seguro
└── memoria/contexto de conversación según permisos y arquitectura vigente
```

Nunca debe ocurrir:

```text
pregunta fuera de Iris Green -> "ese tema está fuera de mi conocimiento"
```

por el mero hecho de no pertenecer a neurodiversidad.

La conducta correcta es:

```text
pregunta -> detectar intención y dominio -> usar conocimiento disponible ->
consultar fuente viva si el dato cambia -> responder -> mantener contexto
```

## 18.2 Fases de construcción de la biblioteca

### Fase A — Iris Green completo

Primero se termina la extracción y estructuración de toda la web porque constituye un corpus propio, verificable y prioritario.

Incluye ES + EN, entre otros:

- condiciones;
- situaciones;
- biblioteca / everyday life;
- datos;
- recursos;
- juegos;
- taller;
- intereses;
- accesibilidad;
- metodología;
- investigación;
- privacidad;
- lectura accesible;
- libros y contenidos propios publicables;
- herramientas y páginas transversales.

### Fase B — Biblioteca general de Sabik

Al terminar Iris Green, la biblioteca se expande mucho más allá de la web mediante módulos temáticos independientes, versionables y ampliables.

### Fase C — Conocimiento dinámico

Los datos que cambian no se congelan como hechos permanentes. Se guardan reglas, entidades, tipos de consulta y fuentes adecuadas para resolverlos en tiempo real.

---

# 19. MAPA DE GRANDES DOMINIOS PARA LA BIBLIOTECA GENERAL

Este mapa es deliberadamente amplio. No representa una lista cerrada: cada dominio se subdividirá en subdominios, conceptos, relaciones, vocabulario, preguntas y ejemplos ES/EN.

## 19.1 Conversación cotidiana y social

- saludos;
- despedidas;
- agradecimientos;
- bromas ligeras;
- charla cotidiana;
- cómo ha ido el día;
- opiniones no sensibles;
- continuar una historia;
- cambiar de tema;
- volver a un tema anterior;
- corregir a Sabik;
- pedir repetición;
- pedir versión corta o larga;
- conversación informal;
- conversación formal;
- silencios y pausas;
- mensajes ambiguos;
- turnos incompletos;
- referencias pronominales como «eso», «lo anterior», «él», «ella», «esa parte»;
- continuidad durante conversaciones largas.

Debe existir una biblioteca extensa de variaciones naturales ES/EN para que Sabik no responda con plantillas repetitivas.

## 19.2 Lengua, escritura y comunicación

- español;
- inglés;
- gramática;
- ortografía;
- vocabulario;
- sinónimos;
- antónimos;
- definiciones;
- etimología básica;
- redacción;
- reescritura;
- resumen;
- traducción;
- adaptación de tono;
- lectura fácil y lenguaje claro;
- escritura académica;
- escritura profesional;
- correos;
- cartas;
- mensajes;
- CV y cartas de presentación;
- escritura creativa;
- narración;
- poesía;
- guiones;
- conversación bilingüe;
- aprendizaje de idiomas.

## 19.3 Matemáticas y razonamiento cuantitativo

- aritmética;
- porcentajes;
- fracciones;
- proporciones;
- álgebra;
- geometría;
- trigonometría;
- cálculo;
- probabilidad;
- estadística;
- lógica;
- estimaciones;
- interpretación de gráficos;
- finanzas matemáticas básicas;
- unidades y conversiones;
- resolución paso a paso.

Los cálculos dependientes de precisión deben resolverse mediante calculadora/herramienta cuando esté disponible, no mediante una tabla congelada.

## 19.4 Ciencias naturales

- física;
- química;
- biología;
- genética;
- evolución;
- ecología;
- geología;
- meteorología conceptual;
- oceanografía;
- paleontología;
- botánica;
- zoología;
- microbiología;
- anatomía y fisiología general;
- método científico;
- experimentos seguros;
- historia de la ciencia;
- conceptos y terminología científica.

## 19.5 Astronomía y espacio

- Sistema Solar;
- Sol;
- planetas;
- lunas;
- planetas enanos;
- asteroides;
- cometas;
- meteoros;
- estrellas;
- constelaciones;
- nebulosas;
- galaxias;
- agujeros negros;
- exoplanetas;
- cosmología;
- exploración espacial;
- telescopios;
- misiones espaciales;
- observación del cielo;
- conceptos orbitales.

Los descubrimientos, misiones activas y efemérides se tratan como contenido dinámico cuando corresponda.

## 19.6 Historia

- prehistoria;
- historia antigua;
- Edad Media;
- Edad Moderna;
- Edad Contemporánea;
- historia de España;
- historia de Europa;
- historia de América;
- historia de África;
- historia de Asia;
- Oceanía;
- civilizaciones;
- guerras y conflictos históricos;
- historia social;
- historia económica;
- historia cultural;
- historia de la tecnología;
- biografías históricas;
- cronologías.

Debe distinguir hechos consolidados, debates historiográficos y cuestiones controvertidas.

## 19.7 Geografía y mundo

- países;
- capitales;
- regiones;
- ciudades;
- continentes;
- océanos;
- ríos;
- montañas;
- clima;
- población;
- geografía física;
- geografía humana;
- husos horarios;
- mapas conceptuales;
- demografía;
- cultura geográfica básica.

Población actual, fronteras en disputa, gobiernos u otros datos cambiantes deben poder verificarse en fuentes actuales.

## 19.8 Tecnología e informática

- informática básica;
- internet;
- redes;
- hardware;
- sistemas operativos;
- ciberseguridad defensiva;
- privacidad digital;
- bases de datos;
- nube;
- IA;
- aprendizaje automático;
- desarrollo web;
- programación;
- algoritmos;
- APIs;
- Git;
- GitHub;
- depuración;
- testing;
- arquitectura de software;
- UX/UI;
- accesibilidad digital;
- estándares web.

## 19.9 Programación

Biblioteca conceptual y de ejemplos para, entre otros:

- Python;
- JavaScript;
- TypeScript;
- HTML;
- CSS;
- SQL;
- Java;
- C#;
- C/C++;
- shell;
- PowerShell;
- JSON;
- YAML;
- expresiones regulares;
- estructuras de datos;
- patrones de diseño;
- control de versiones;
- pruebas automatizadas.

Las versiones actuales de librerías, SDK, APIs y plataformas deben consultarse de forma dinámica cuando la versión importe.

## 19.10 Educación y aprendizaje

- técnicas de estudio;
- organización del aprendizaje;
- memoria;
- comprensión lectora;
- escritura;
- matemáticas;
- ciencias;
- idiomas;
- preparación de exámenes;
- explicación por niveles;
- ejercicios;
- cuestionarios;
- aprendizaje mediante ejemplos;
- enseñanza paso a paso;
- adaptación por edad y nivel sin infantilizar.

## 19.11 Trabajo y vida profesional

- búsqueda de empleo;
- CV;
- entrevistas;
- comunicación laboral;
- reuniones;
- productividad;
- gestión de proyectos;
- liderazgo;
- trabajo en equipo;
- negociación cotidiana;
- documentación;
- presentaciones;
- planificación;
- trabajo remoto;
- carrera profesional;
- emprendimiento conceptual.

Empleo disponible, salarios actuales, normativa y mercado laboral son dinámicos.

## 19.12 Empresa, economía y finanzas

- conceptos de economía;
- inflación;
- tipos de interés;
- oferta y demanda;
- empresa;
- contabilidad básica;
- presupuestos;
- flujo de caja;
- planificación financiera;
- ahorro;
- interés compuesto;
- deuda;
- impuestos como concepto;
- mercados financieros como concepto;
- emprendimiento;
- modelos de negocio.

Cotizaciones, tipos, legislación fiscal, productos financieros y condiciones actuales requieren información viva y cautelas apropiadas.

## 19.13 Hogar y vida diaria

- limpieza;
- organización del hogar;
- lavandería;
- cocina;
- compra;
- conservación de alimentos;
- pequeñas reparaciones seguras;
- planificación doméstica;
- rutinas;
- mudanzas;
- listas;
- gestión del tiempo;
- cuidado cotidiano de objetos;
- seguridad doméstica.

## 19.14 Cocina y alimentación

- técnicas culinarias;
- recetas;
- sustituciones de ingredientes;
- planificación de menús;
- conservación;
- temperaturas y tiempos generales;
- vocabulario culinario;
- cocina internacional;
- panadería;
- repostería;
- aprovechamiento de alimentos;
- adaptar recetas a preferencias y necesidades declaradas.

No convertir información general en prescripción médica o nutricional individual sin base adecuada.

## 19.15 Cultura, arte y humanidades

- literatura;
- arte;
- arquitectura;
- cine;
- teatro;
- música;
- fotografía;
- diseño;
- filosofía;
- mitología;
- folklore;
- movimientos artísticos;
- géneros y técnicas;
- análisis de obras;
- historia cultural.

Debe respetarse la autoría y las limitaciones de reproducción de obras protegidas.

## 19.16 Entretenimiento y aficiones

- videojuegos;
- juegos de mesa;
- puzles;
- manualidades;
- dibujo;
- pintura;
- escritura;
- jardinería;
- fotografía;
- coleccionismo;
- senderismo;
- observación del cielo;
- lectura;
- música;
- cine;
- hobbies creativos y técnicos.

Información sobre lanzamientos, disponibilidad y eventos recientes será dinámica.

## 19.17 Viajes y movilidad

- planificación de viajes;
- equipaje;
- transporte;
- aeropuertos;
- trenes;
- conducción conceptual;
- turismo;
- cultura local;
- adaptación sensorial;
- viajes accesibles;
- itinerarios;
- husos horarios;
- idiomas útiles.

Horarios, precios, requisitos fronterizos, visados, alertas y disponibilidad deben consultarse en tiempo real.

## 19.18 Salud y bienestar general

- anatomía y fisiología;
- síntomas como información general;
- hábitos saludables;
- sueño;
- estrés;
- actividad física;
- primeros auxilios básicos seguros;
- navegación del sistema sanitario;
- preparación de citas;
- comprensión de términos médicos;
- medicamentos como información general no prescriptiva;
- salud mental informativa;
- neurodiversidad.

Debe conservarse separación clara entre:

```text
información general
orientación prudente
diagnóstico
tratamiento individual
emergencia
```

Sabik no debe inventar diagnósticos ni sustituir atención profesional cuando sea necesaria.

## 19.19 Psicología, emociones y relaciones

- emociones;
- comunicación;
- amistad;
- pareja;
- familia;
- límites;
- conflictos;
- duelo;
- soledad;
- autoestima;
- motivación;
- hábitos;
- toma de decisiones;
- escucha;
- apoyo cotidiano;
- convivencia;
- comunicación difícil.

Debe evitar dependencia emocional y falsas certezas sobre la mente de otras personas.

## 19.20 Infancia, adolescencia y familia

- desarrollo general;
- estudio;
- convivencia;
- comunicación familiar;
- rutinas;
- juego;
- seguridad;
- colegio;
- adolescencia;
- autonomía progresiva;
- recursos para familias;
- contenido adaptado por edad.

Se mantendrán las políticas child-safe existentes del proyecto.

## 19.21 Sociedad, identidad y diversidad humana

- discapacidad;
- neurodiversidad;
- accesibilidad;
- diversidad cultural;
- sexo y género como conceptos;
- orientación sexual;
- identidad;
- discriminación;
- inclusión;
- religión y no creencia;
- convivencia social;
- derechos humanos como marco informativo.

Los temas sensibles se tratarán con precisión, contexto y respeto, sin convertir identidades en diagnósticos ni estereotipos.

## 19.22 Derecho, administración y trámites

- conceptos jurídicos generales;
- contratos;
- derechos;
- administración pública;
- documentación;
- formularios;
- procedimientos generales;
- consumo;
- vivienda;
- empleo;
- educación;
- discapacidad y apoyos.

La legislación vigente, plazos y procedimientos concretos son contenido dinámico y jurisdiccional: deben verificarse antes de responder como actuales.

## 19.23 Política, instituciones y asuntos públicos

- sistemas políticos;
- instituciones;
- separación de poderes;
- elecciones como proceso;
- legislación como proceso;
- organismos internacionales;
- historia política;
- terminología política;
- políticas públicas como información descriptiva.

Cargos actuales, elecciones, legislación vigente y noticias políticas requieren fuentes actuales. Las respuestas deben ser informativas y neutrales, sin decidir por la persona.

## 19.24 Noticias y actualidad

Sabik debe poder hablar de actualidad, pero **no mediante una enciclopedia congelada**.

Se almacena:

- clasificación de noticias;
- vocabulario;
- entidades;
- criterios de fuentes;
- métodos de contraste;
- plantillas de resumen;
- detección de fecha y actualidad.

Se consulta dinámicamente:

- noticias recientes;
- resultados;
- cambios regulatorios;
- acontecimientos en curso.

## 19.25 Deporte

Biblioteca estable:

- reglas;
- posiciones;
- historia;
- terminología;
- competiciones;
- entrenamiento general;
- funcionamiento de ligas y torneos.

Datos dinámicos:

- resultados;
- calendarios;
- clasificaciones;
- plantillas actuales;
- lesiones;
- fichajes;
- récords recién modificados.

## 19.26 Naturaleza, animales y medio ambiente

- animales;
- plantas;
- hábitats;
- ecosistemas;
- biodiversidad;
- conservación;
- clima como ciencia;
- sostenibilidad;
- reciclaje;
- jardinería;
- mascotas como cuidado general;
- comportamiento animal general.

Alertas, legislación ambiental o información local cambiante requieren fuente actual.

## 19.27 Creatividad y generación de ideas

Sabik debe poder:

- proponer ideas;
- desarrollar conceptos;
- hacer brainstorming;
- crear esquemas;
- escribir historias originales;
- diseñar juegos;
- proponer actividades;
- desarrollar personajes;
- crear nombres;
- ayudar con proyectos creativos;
- transformar una idea manteniendo autoría del usuario;
- iterar según correcciones.

## 19.28 Resolución de problemas

- dividir problemas complejos;
- identificar restricciones;
- comparar alternativas sin inventar datos;
- crear planes;
- generar checklists;
- detectar dependencias;
- resumir decisiones;
- revisar errores;
- continuar después de una interrupción;
- adaptar el nivel de detalle.

## 19.29 Utilidades

Sabik debe entender y enrutar consultas como:

- hora;
- fecha;
- calendario;
- temporizadores;
- conversiones de unidades;
- moneda;
- meteorología;
- cálculo;
- zonas horarias;
- distancias;
- planificación temporal.

Los valores actuales se obtienen mediante herramienta o fuente viva.

## 19.30 Conocimiento sobre Iris Green y Sabik

Además del corpus público, debe existir conocimiento estructural sobre:

- qué es Iris Green;
- qué ofrece;
- navegación;
- recursos;
- accesibilidad;
- contenidos disponibles;
- diferencias ES/EN;
- Sabik como asistente;
- capacidades visibles;
- límites;
- privacidad;
- fuentes;
- funcionamiento general explicado sin revelar mecánica interna sensible.

---

# 20. CAPAS DE CONOCIMIENTO DE SABIK

La biblioteca final no debe ser una sola masa de JSON.

## Capa 1 — `irisgreen`

Contenido propio publicado y versionado.

## Capa 2 — `general_knowledge`

Conocimiento general estable por dominios.

## Capa 3 — `language_and_conversation`

Intents, lenguaje, diálogo, pragmática, continuidad, correcciones y estilo.

## Capa 4 — `procedural_knowledge`

Pasos, guías, métodos, checklists y resolución de tareas.

## Capa 5 — `entities_and_relations`

Conceptos, entidades, sinónimos, jerarquías y relaciones semánticas.

## Capa 6 — `dynamic_routes`

Información que necesita una fuente viva.

## Capa 7 — `safety_and_boundaries`

Riesgo, menores, salud, privacidad, contenido sensible y límites.

## Capa 8 — `quality_and_provenance`

Fuente, fecha, idioma, revisión, confianza editorial, caducidad y QA.

---

# 21. OBJETIVO DE ESCALA

La biblioteca debe diseñarse como **ampliable de forma prácticamente indefinida**.

No se considera terminada porque alcance un número concreto de registros.

El primer gran paquete debe aspirar a contener:

- miles de fragmentos de Iris Green ES/EN;
- miles de conceptos y alias;
- miles de pares pregunta/respuesta o ejemplos de recuperación;
- miles de utterances conversacionales;
- relaciones semánticas entre conceptos;
- plantillas y variantes naturales;
- rutas de herramientas y conocimiento dinámico;
- datasets de QA y pruebas adversariales;
- metadatos de procedencia y actualización.

Pero la calidad manda sobre inflar números artificialmente.

No se crearán miles de frases idénticas cambiando una palabra solo para aumentar volumen.

---

# 22. REGLA BILINGÜE GLOBAL

La obligación ES/EN no afecta únicamente a Iris Green.

Se aplicará también a la biblioteca general:

```text
concepto ES <-> concept EN
alias ES <-> aliases EN
pregunta ES <-> question EN
respuesta ES <-> answer EN
intent examples ES <-> intent examples EN
procedimiento ES <-> procedure EN
metadata labels ES <-> metadata labels EN
```

Las dos versiones deben ser naturales en su idioma.

No usar traducción literal automática cuando produzca inglés o español artificial.

Cada registro compartido debe tener un `concept_id` o equivalente neutral para enlazar las versiones lingüísticas sin depender del texto visible.

---

# 23. CONSECUENCIA PARA EL TRABAJO ACTUAL

Orden de ejecución actualizado y fijado:

```text
1. Terminar corpus completo Iris Green ES/EN.
2. QA y emparejamiento bilingüe.
3. Construir capa conversacional general ES/EN.
4. Construir taxonomía general de conocimiento.
5. Poblar dominios generales por tandas grandes.
6. Crear relaciones y alias entre dominios.
7. Crear rutas de conocimiento dinámico.
8. Crear preguntas, ejemplos y conversaciones multi-turno masivas.
9. QA factual, lingüístico, seguridad y duplicados.
10. Entregar paquete integrable a Nexo/Sabik.
```

**Decisión cerrada:** Sabik no será un bot especializado que deja de saber conversar fuera de Iris Green. Será un asistente conversacional general y extensible cuya biblioteca propia de Iris Green constituye una de sus fuentes especializadas principales.

---

# 24. FORMATO DE REGISTRO BILINGÜE VISIBLE — REGLA OBLIGATORIA

A partir de este punto, la biblioteca no se registrará con el español y el inglés separados en bloques lejanos ni únicamente enlazados mediante campos técnicos.

Cada término, concepto, pregunta, respuesta, ejemplo, alias o etiqueta debe quedar registrado **en pareja visible**, con la versión en español arriba y la versión en inglés inmediatamente debajo.

Formato base obligatorio:

```text
ES: Autismo
EN: Autism

ES: Ansiedad
EN: Anxiety

ES: ¿Qué es la sobrecarga sensorial?
EN: What is sensory overload?

ES: La sobrecarga sensorial ocurre cuando la cantidad o intensidad de estímulos supera lo que la persona puede procesar cómodamente en ese momento.
EN: Sensory overload happens when the amount or intensity of sensory input exceeds what a person can comfortably process at that moment.
```

Regla de registro:

```text
ES ARRIBA
EN ABAJO
```

Esto se aplicará a:

- nombres de conceptos;
- nombres de condiciones;
- situaciones;
- categorías;
- subcategorías;
- alias y sinónimos;
- preguntas;
- respuestas;
- definiciones;
- explicaciones;
- pasos y procedimientos;
- ejemplos;
- conversaciones multi-turno;
- mensajes sociales;
- prompts y reprompts;
- mensajes de error;
- mensajes de seguridad;
- etiquetas visibles;
- títulos;
- descripciones;
- metadatos destinados a revisión humana.

El identificador técnico puede ser neutral y único, por ejemplo:

```text
id: sensory_overload
ES: Sobrecarga sensorial
EN: Sensory overload
```

Pero nunca debe obligar a revisar dos archivos distintos para comprobar si existe la pareja lingüística.

## 24.1 Alias y sinónimos

Los alias se registrarán también por parejas visibles cuando exista equivalencia razonable:

```text
ID: sensory_overload

ES: sobrecarga sensorial
EN: sensory overload

ES: saturación sensorial
EN: sensory overwhelm

ES: demasiados estímulos
EN: too much sensory input
```

No se forzará una equivalencia literal cuando no exista. En esos casos se indicará expresamente que son variantes naturales del mismo concepto.

## 24.2 Preguntas y respuestas

Cada unidad conversacional se guardará así:

```text
ID: qa_autism_definition_001

ES PREGUNTA: ¿Qué es el autismo?
EN QUESTION: What is autism?

ES RESPUESTA: ...
EN ANSWER: ...
```

## 24.3 Conversaciones

Cada turno deberá mantenerse en paralelo:

```text
TURNO 1
ES USUARIO: Hola, Sabik.
EN USER: Hi, Sabik.

ES SABIK: Hola. ¿En qué puedo ayudarte?
EN SABIK: Hi. How can I help you?

TURNO 2
ES USUARIO: Quiero saber qué es el autismo.
EN USER: I want to know what autism is.

ES SABIK: ...
EN SABIK: ...
```

## 24.4 Regla de QA bilingüe

Un registro no se considerará completo si falta una de las dos versiones cuando deba existir en ambos idiomas.

Estados permitidos para control interno:

```text
BILINGUAL_COMPLETE
ES_PENDING_EN
EN_PENDING_ES
LANGUAGE_REVIEW_REQUIRED
NO_DIRECT_EQUIVALENT
```

Para producción general de Sabik, el objetivo será:

```text
BILINGUAL_COMPLETE
```

## 24.5 Regla final de formato

La biblioteca maestra debe permitir revisar visualmente cada pareja sin saltar entre archivos ni columnas.

**Regla cerrada:** misma unidad arriba en español y justo debajo en inglés.
