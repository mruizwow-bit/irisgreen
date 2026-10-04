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

# 25. CORPUS WEB · IRIS GREEN · BLOQUE 01

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-001

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: No aguanto las etiquetas ni las costuras de la ropa

EN TITLE: “I can't stand clothing tags or seams”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Una etiqueta, una costura o una tela me rozan la piel y la molestia continúa mientras llevo puesta la prenda. Me cuesta concentrarme en otra cosa hasta que me cambio de ropa o quito lo que me molesta.

EN SUMMARY: A clothing tag, a seam or a fabric rubs against my skin, and the discomfort continues for as long as I am wearing the garment. I find it hard to concentrate on anything else until I change clothes or remove what is bothering me.

ES RUTA: /es/situaciones/la-ropa-me-molesta/

EN PATH: /en/situations/clothes-feel-unbearable/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-002

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Salgo del supermercado sin energía y no sé por qué

EN TITLE: “I leave the supermarket exhausted and I don't know why”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: En el supermercado hay luces intensas, música, voces, carros y muchas personas alrededor. Tantos sonidos, luces y movimientos me cansan mucho. Al salir del supermercado necesito descansar en un lugar tranquilo.

EN SUMMARY: In the supermarket there are bright lights, music, voices, shopping carts and many people around me. So many sounds, lights and movements make me very tired. When I leave the supermarket, I need to rest somewhere quiet.

ES RUTA: /es/situaciones/la-luz-del-supermercado-me-agota/

EN PATH: /en/situations/supermarket-lights-drain-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-003

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me despierto de madrugada y ya no vuelvo a dormirme

EN TITLE: “I wake in the early hours and can't get back to sleep”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Me duermo con normalidad, pero me despierto de madrugada y no vuelvo a dormir. Paso varias horas en la cama sin dormir. Al día siguiente tengo sueño, me distraigo con facilidad y hago las tareas habituales más despacio.

EN SUMMARY: I fall asleep normally, but I wake up in the middle of the night and cannot get back to sleep. I spend several hours in bed awake. The next day I feel sleepy, get distracted easily and do my usual tasks more slowly.

ES RUTA: /es/situaciones/me-despierto-de-madrugada/

EN PATH: /en/situations/i-wake-up-at-3am/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-004

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me lo explican y a los dos minutos no sé qué tenía que hacer»

EN TITLE: “They explain it to me and two minutes later I don't know what I was meant to do”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Oír una instrucción y sostenerla mientras se hace otra cosa son dos tareas distintas. Lo hablado se va; lo escrito se queda.

EN SUMMARY: Hearing an instruction and holding it in mind while doing something else are two different tasks. Spoken information disappears; written information stays available.

ES RUTA: /es/situaciones/necesito-que-me-repitan-las-instrucciones/

EN PATH: /en/situations/i-need-instructions-repeated/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-005

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Se me olvida comer y luego me da un bajón»

EN TITLE: “I forget to eat and then I crash”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: La señal de hambre puede llegar tarde, quedar poco clara o quedar en segundo plano mientras la atención está en otra tarea. El cansancio, la irritabilidad, el dolor de cabeza o el mareo no demuestran por sí solos hipoglucemia: son señales para parar, revisar necesidades básicas y observar el patrón.

EN SUMMARY: Hunger signals may arrive late, feel unclear or fade into the background while attention is on another task. Tiredness, irritability, headache or dizziness do not by themselves prove hypoglycaemia: they are signs to stop, check basic needs and look at the pattern.

ES RUTA: /es/situaciones/se-me-olvida-comer/

EN PATH: /en/situations/i-forget-to-eat/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-006

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Al acostarme repaso todo lo que hice mal»

EN TITLE: “When I go to bed I replay everything I did wrong”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Se apaga la luz y llegan las escenas del día, una detrás de otra. El repaso no resuelve nada y roba el sueño.

EN SUMMARY: The light goes off and scenes from the day arrive one after another. Replaying them solves nothing and takes away sleep.

ES RUTA: /es/situaciones/repaso-en-la-cama-todo-lo-que-hice-mal/

EN PATH: /en/situations/i-replay-everything-i-did-wrong/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-007

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me agoto después de estar con gente, aunque lo haya pasado bien»

EN TITLE: “I feel exhausted after being with people, even when I enjoyed it”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: El rato sale bien y el cansancio puede llegar después: sueño, silencio y ganas de no hablar con nadie. Puede durar horas o el día entero.

EN SUMMARY: The time with other people can go well and the tiredness may arrive afterwards: sleepiness, silence and not wanting to talk to anyone. It may last for hours or for the rest of the day.

ES RUTA: /es/situaciones/me-agoto-despues-de-estar-con-gente/

EN PATH: /en/situations/drained-after-seeing-people/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-008

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «A media reunión desconecto y ya no sé por dónde van»

EN TITLE: “Halfway through a meeting I zone out and lose the thread”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: La atención se sostiene un rato y luego se va sola. Al volver, el tema ya ha cambiado y da apuro preguntar.

EN SUMMARY: Attention holds for a while and then drifts away. By the time you come back, the topic has moved on and asking can feel awkward.

ES RUTA: /es/situaciones/pierdo-el-hilo-en-las-reuniones/

EN PATH: /en/situations/i-lose-the-thread-in-meetings/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-009

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Se me acumula la ropa y no sé por dónde empezar»

EN TITLE: “The laundry piles up and I don't know where to start”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: La tarea no es difícil: es larga y sin bordes. Cuanto más crece el montón, más cuesta ver un primer paso.

EN SUMMARY: The task is not necessarily difficult; it is long and has no clear edges. The bigger the pile gets, the harder it can be to see a first step.

ES RUTA: /es/situaciones/se-me-acumula-la-ropa/

EN PATH: /en/situations/laundry-piles-up/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-010

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Pierdo las llaves y el móvil varias veces al día»

EN TITLE: “I lose my keys and phone several times a day”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: El objeto se deja en cualquier sitio mientras la cabeza va en otra cosa. No se olvida dónde está: nunca llegó a registrarse.

EN SUMMARY: The object gets put down somewhere while your attention is on something else. Sometimes the problem is not forgetting where it is; its location was never fully registered in the first place.

ES RUTA: /es/situaciones/pierdo-las-llaves-y-el-movil/

EN PATH: /en/situations/i-lose-my-keys-and-phone/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-011

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me acuesto después de un día agotador y no consigo dormir

EN TITLE: “I go to bed tired and sleep doesn't come”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Me meto en la cama con mucho cansancio, pero no consigo dormir. Pasa una hora o más y sigo sin dormirme, aunque llevo todo el día queriendo descansar.

EN SUMMARY: I go to bed feeling very tired, but I cannot fall asleep. An hour or more passes and I am still awake, even though I have wanted to rest all day.

ES RUTA: /es/situaciones/me-acuesto-y-el-sueno-no-llega/

EN PATH: /en/situations/sleep-doesnt-come/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-012

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me despierto varias veces cada noche

EN TITLE: “I wake up several times every night”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Me duermo, pero me despierto varias veces durante la noche. Después de cada despertar paso un rato sin dormir antes de volver a dormirme. Por la mañana tengo sueño y siento que no he descansado lo suficiente.

EN SUMMARY: I fall asleep, but I wake up several times during the night. After each awakening, I stay awake for a while before falling asleep again. In the morning I feel sleepy and feel that I have not rested enough.

ES RUTA: /es/situaciones/me-despierto-varias-veces-cada-noche/

EN PATH: /en/situations/i-wake-up-several-times-a-night/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-013

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Si cambia algo de mi rutina de noche, no me duermo

EN TITLE: “If anything changes in my night-time routine, I can't sleep”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Antes de acostarme hago las mismas cosas y en el mismo orden cada noche. Si cambia la hora, el lugar o uno de esos pasos, tardo mucho más en dormirme.

EN SUMMARY: Before going to bed, I do the same things in the same order every night. If the time, the place or one of those steps changes, it takes me much longer to fall asleep.

ES RUTA: /es/situaciones/si-cambia-mi-rutina-no-me-duermo/

EN PATH: /en/situations/any-change-to-my-night-routine/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-014

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Por la noche siento más ansiedad

EN TITLE: “At night my anxiety gets bigger”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Durante el día trabajo, estudio, hago tareas o hablo con otras personas. Al acostarme empiezo a pensar en problemas, tareas pendientes o cosas que me preocupan. Sigo pensando en esas cosas y pasa mucho tiempo antes de que me duerma.

EN SUMMARY: During the day I work, study, do tasks or talk to other people. When I go to bed, I start thinking about problems, things I still have to do or things that worry me. I keep thinking about them and it takes a long time before I fall asleep.

ES RUTA: /es/situaciones/por-la-noche-la-ansiedad-se-hace-mas-grande/

EN PATH: /en/situations/at-night-the-anxiety-gets-bigger/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-015

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: No me duermo si no sé cómo será mañana

EN TITLE: “I can't sleep if I don't know what tomorrow will be like”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Antes de acostarme quiero saber qué voy a hacer al día siguiente, a qué hora y con quién. Si hay algo importante que todavía no sé, sigo pensando en ello y no me duermo.

EN SUMMARY: Before going to bed, I want to know what I am going to do the next day, at what time and with whom. If there is something important I still do not know, I keep thinking about it and cannot fall asleep.

ES RUTA: /es/situaciones/no-me-duermo-si-no-se-como-sera-manana/

EN PATH: /en/situations/i-cant-sleep-until-i-know-about-tomorrow/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-016

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Hay sitios en los que no me sale hablar»

EN TITLE: “There are places where I can't get speech out”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: En algunos contextos el habla puede estar disponible y en otros no. La ausencia de habla en una situación no dice cuánto entiende la persona y no debe interpretarse como una decisión de no colaborar.

EN SUMMARY: Speech may be available in some settings and unavailable in others. Not speaking in a particular situation does not tell you how much a person understands and should not be interpreted as a decision not to cooperate.

ES RUTA: /es/situaciones/no-me-sale-hablar-en-algunos-sitios/

EN PATH: /en/situations/speech-doesnt-come-out/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-017

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Después de varias horas dejo de responder»

EN TITLE: “After several hours I stop responding”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: La capacidad para responder puede disminuir a medida que aumenta la carga del día. En ese momento puede seguir habiendo comprensión total o parcial, pero no debe darse por hecho: hay que comprobar qué forma de comunicación sigue disponible.

EN SUMMARY: The ability to respond may decrease as the day's load increases. At that point, understanding may still be full or partial, but this must not be assumed: check which form of communication is still available.

ES RUTA: /es/situaciones/dejo-de-responder-despues-de-varias-horas/

EN PATH: /en/situations/after-a-few-hours-i-stop-answering/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-018

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Tardo mucho en contestar y alguien contesta por mí»

EN TITLE: “I take a long time to answer and someone answers for me”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: La pregunta llega, la respuesta existe y tarda. En ese hueco casi siempre alguien repite, cambia de tema o contesta en tu lugar.

EN SUMMARY: The question arrives, the answer exists, and it takes time. In that gap, someone often repeats the question, changes the subject or answers on your behalf.

ES RUTA: /es/situaciones/tardo-mucho-en-contestar/

EN PATH: /en/situations/i-take-a-long-time-to-answer/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-019

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Repito palabras y frases»

EN TITLE: “I repeat words and phrases”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Repetir palabras o frases puede tener funciones distintas: comunicar, procesar lenguaje, mantener una interacción, recordar o regularse. La función se entiende mejor mirando el contexto que intentando eliminar la repetición.

EN SUMMARY: Repeating words or phrases can serve different functions: communicating, processing language, sustaining an interaction, remembering or regulating. Its function is understood better by looking at the context than by trying to eliminate the repetition.

ES RUTA: /es/situaciones/repito-palabras-y-frases/

EN PATH: /en/situations/i-repeat-words-and-phrases/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-020

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me dan una instrucción y no sé si la he entendido»

EN TITLE: “I'm given an instruction and I don't know whether I understood it”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Se escucha la instrucción y queda la duda: ¿era eso o era otra cosa? A veces se ha perdido un trozo por el camino; a veces está entendida y no arranca.

EN SUMMARY: You hear the instruction and the doubt remains: was that what they meant, or something else? Sometimes part of the information was lost along the way; sometimes it was understood but starting the task is the difficult part.

ES RUTA: /es/situaciones/no-se-si-he-entendido-la-instruccion/

EN PATH: /en/situations/i-dont-know-if-i-understood/

ESTADO: BILINGUAL_COMPLETE

---

## 25.1 CONTROL DE PROGRESO

ES: Primer bloque del corpus web incorporado: 20 situaciones bilingües completas de 372 entradas del catálogo principal.

EN: First web-corpus block incorporated: 20 complete bilingual situations out of 372 entries in the main catalogue.

SIGUIENTE BLOQUE: WEB-SITUATION-021 → WEB-SITUATION-040

# 26. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla de registro: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-021

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito una adaptación en clase»

EN TITLE: “I need an adjustment in class”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Hay algo del aula que impide hacer lo que se sabe hacer: el ruido, el tiempo, el formato del examen, copiar de la pizarra. El ajuste no cambia lo que se evalúa, cambia por dónde se llega.

EN SUMMARY: Something in the classroom is getting in the way of showing what you know: noise, time pressure, the exam format or copying from the board. An adjustment does not change what is being assessed; it changes the route by which you can show it.

ES RUTA: /es/situaciones/necesito-una-adaptacion-en-clase/

EN PATH: /en/situations/i-need-an-adjustment-in-class/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-022

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito ajustes en el trabajo»

EN TITLE: “I need adjustments at work”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: El trabajo sale, y sale a costa de algo: la oficina abierta, las reuniones seguidas, el teléfono, los cambios sin avisar. Pedir un ajuste no es pedir menos trabajo, es quitar lo que estorba para hacerlo.

EN SUMMARY: The work gets done, but at a cost: an open-plan office, back-to-back meetings, the phone, or changes with no warning. Asking for an adjustment is not asking to do less work; it is asking to remove a barrier to doing it.

ES RUTA: /es/situaciones/necesito-ajustes-en-el-trabajo/

EN PATH: /en/situations/i-need-adjustments-at-work/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-023

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito un ajuste en clase o en el trabajo, pero no sé cómo pedirlo»

EN TITLE: “I need an adjustment in class or at work, but I don't know how to ask for it”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Se sabe qué estorba y no se sabe a quién decírselo, con qué palabras ni si va a traer problemas. Y mientras no se sabe, no se pide, y el día sigue costando lo mismo.

EN SUMMARY: You know what is getting in the way but not who to tell, what words to use or whether asking will cause problems. While the process is unclear, the request may never get made and the same barrier remains.

ES RUTA: /es/situaciones/necesito-un-ajuste-y-no-se-como-pedirlo/

EN PATH: /en/situations/i-need-an-adjustment-and-dont-know-how-to-ask/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-024

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Quiero hacerlo, pero no consigo empezar»

EN TITLE: “I want to do it, but I can't get started”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: La tarea está decidida, el rato está reservado y el rato se va en mirarla, levantarse a por agua y volver a mirarla. Suele faltar un paso concreto: qué se toca primero, dónde, con qué a mano.

EN SUMMARY: The task is decided and time has been set aside, yet the time disappears while you look at it, get up for water and look at it again. Sometimes what is missing is one concrete first action: what to touch first, where to do it and what needs to be ready.

ES RUTA: /es/situaciones/quiero-hacerlo-pero-no-consigo-empezar/

EN PATH: /en/situations/i-want-to-do-it-but-i-cant-get-started/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-025

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Solo consigo arrancar cuando algo me interesa mucho»

EN TITLE: “I can only get started when something interests me a lot”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Con algo que interesa se pasan tres horas sin levantar la vista; con lo de al lado, igual de corto, no se pasa de la primera línea. El interés funciona como interruptor de arranque.

EN SUMMARY: With something interesting, three hours can pass without looking up; with the task beside it, even if it is just as short, you may not get past the first line. Interest can function as a strong trigger for engagement.

ES RUTA: /es/situaciones/solo-consigo-arrancar-cuando-algo-me-interesa-mucho/

EN PATH: /en/situations/i-can-only-get-started-when-something-interests-me-a-lot/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-026

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Una tarea grande me bloquea antes de empezar»

EN TITLE: “A large task blocks me before I even start”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: La tarea cabe en una frase, «hacer la mudanza», «entregar el trabajo», y ahí llega el bloqueo, antes de tocar nada. Dentro hay muchos pasos que nadie ha escrito y no aparece por dónde entrar.

EN SUMMARY: The task fits into one sentence — ‘move house’, ‘submit the assignment’ — and the block arrives before anything has been touched. Inside that one sentence are many steps that nobody has written down, and there is no obvious entry point.

ES RUTA: /es/situaciones/una-tarea-grande-me-bloquea-antes-de-empezar/

EN PATH: /en/situations/a-large-task-blocks-me-before-i-even-start/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-027

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Pospongo incluso cosas que sí quiero hacer»

EN TITLE: “I put off even things I genuinely want to do”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: El plan del sábado era el que se quería, llega el sábado y se aplaza otra vez. Se posponen también las cosas deseadas, y casi siempre el momento de empezar trae algo incómodo pegado: una llamada, una espera, una duda.

EN SUMMARY: Saturday's plan is something you wanted, Saturday arrives, and it gets postponed again. Desired activities can be put off too, especially when the moment of starting has something uncomfortable attached to it: a phone call, a wait, a doubt or an unfamiliar place.

ES RUTA: /es/situaciones/pospongo-incluso-cosas-que-si-quiero-hacer/

EN PATH: /en/situations/i-put-off-even-things-i-genuinely-want-to-do/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-028

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Un cambio pequeño altera todo el día»

EN TITLE: “A small change disrupts my whole day”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Cambian la hora de una cita, o el sitio, y lo que se cae no es esa hora: es la secuencia entera que ya estaba montada alrededor. Desde fuera el cambio es pequeño, y el trabajo de rehacerlo no lo es.

EN SUMMARY: The time or place of an appointment changes, and what falls apart is not only that hour but the sequence that had already been built around it. From the outside the change looks small; rebuilding the plan may not be.

ES RUTA: /es/situaciones/un-cambio-pequeno-altera-todo-el-dia/

EN PATH: /en/situations/a-small-change-disrupts-my-whole-day/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-029

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Cambiar de una tarea a otra me bloquea»

EN TITLE: “Switching from one task to another blocks me”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: La tarea que estaba en marcha no se suelta, y la siguiente no arranca. El rato de en medio se va en nada, y desde fuera parece que se está perdiendo el tiempo cuando lo que hay es un cambio de vía.

EN SUMMARY: The task that was in progress does not let go, and the next one does not start. The time in between disappears, and from the outside it can look like wasted time when what is actually difficult is the transition itself.

ES RUTA: /es/situaciones/cambiar-de-una-tarea-a-otra-me-bloquea/

EN PATH: /en/situations/switching-from-one-task-to-another-blocks-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-030

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito ayuda para una cita médica»

EN TITLE: “I need help with a medical appointment”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: La cita es el jueves y desde el lunes ocupa sitio: qué van a preguntar, cuánto se espera, quién habla. Casi todo eso se puede pedir antes, y casi nunca se pide porque nadie dice que se puede.

EN SUMMARY: The appointment is on Thursday and it has been taking up mental space since Monday: what they will ask, how long the wait will be, who will speak. Many practical supports can be requested in advance, but people are not always told that they can ask.

ES RUTA: /es/situaciones/necesito-ayuda-para-una-cita-medica/

EN PATH: /en/situations/i-need-help-with-a-medical-appointment/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-031

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «No consigo explicar mis síntomas al médico»

EN TITLE: “I can't explain my symptoms to the doctor”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: En la sala de espera estaba claro qué contar y dentro sale desordenado, o sale lo de menos y lo importante se queda sin decir. Hay que recordar, ordenar, resumir y decidir a la vez, en diez minutos.

EN SUMMARY: In the waiting room it was clear what you wanted to say, but inside the consultation it comes out in the wrong order, or the minor details come out and the important part stays unsaid. You are being asked to remember, organise, summarise and decide at the same time, often within a short appointment.

ES RUTA: /es/situaciones/no-consigo-explicar-mis-sintomas-al-medico/

EN PATH: /en/situations/i-cant-explain-my-symptoms-to-the-doctor/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-032

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «El hospital me sobrecarga»

EN TITLE: “The hospital overwhelms me”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Antes de hablar con nadie ya hay eco, luces que no se apagan, megafonía y una espera que no dice cuánto va a durar. La sobrecarga llega por la suma, y cuando llega el turno queda poca capacidad para explicar.

EN SUMMARY: Before you have spoken to anyone there may already be echo, bright lights, announcements and an open-ended wait. The load comes from the accumulation, and by the time your turn arrives there may be little capacity left for explaining.

ES RUTA: /es/situaciones/el-hospital-me-sobrecarga/

EN PATH: /en/situations/the-hospital-overwhelms-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-033

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Comer fuera de casa es muy difícil»

EN TITLE: “Eating away from home is very difficult”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: El problema está en el plato: la textura no es la de siempre, el olor llega antes que la comida y en la carta no hay nada que se pueda comer sin negociar. Se sale con hambre y con la sensación de haber dado la nota.

EN SUMMARY: The difficulty may be the food itself: the texture is different from usual, the smell arrives before the plate, and nothing on the menu feels manageable without negotiation. The person may leave hungry and self-conscious.

ES RUTA: /es/situaciones/comer-fuera-de-casa-es-muy-dificil/

EN PATH: /en/situations/eating-away-from-home-is-very-difficult/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-034

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Comer en un restaurante me resulta demasiado»

EN TITLE: “Eating in a restaurant is too much for me”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: La comida podría estar bien y el local no: música alta, mesas pegadas, alguien preguntando qué tal está justo con la boca llena y la sensación de comer mirado. Cansa el sitio, no el plato.

EN SUMMARY: The food itself may be fine and the venue may not be: loud music, closely packed tables, staff asking questions while you are eating, or feeling watched. The place, rather than the plate, can be what uses the energy.

ES RUTA: /es/situaciones/comer-en-un-restaurante-me-resulta-demasiado/

EN PATH: /en/situations/eating-in-a-restaurant-is-too-much-for-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-035

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Comer fuera es demasiado impredecible»

EN TITLE: “Eating out is too unpredictable”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Lo que pesa es lo que no se sabe todavía: cómo va a venir el plato, cuánto se va a tardar, si lo que ponga la carta será lo que llegue. Se puede comer bien y aun así haber gastado el día en anticiparlo.

EN SUMMARY: What weighs most is what is not yet known: how the dish will arrive, how long things will take, whether what is described on the menu will match what is served. You may eat adequately and still have spent much of the day anticipating the uncertainty.

ES RUTA: /es/situaciones/comer-fuera-es-demasiado-impredecible/

EN PATH: /en/situations/eating-out-is-too-unpredictable/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-036

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: No noto hambre ni sed

EN TITLE: “They don't notice hunger or thirst”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Paso varias horas sin sentir hambre ni sed. Me doy cuenta de que necesito comer o beber cuando ya tengo dolor de cabeza, mareo, cansancio o mal humor.

EN SUMMARY: I can go for several hours without feeling hungry or thirsty. I realise that I need to eat or drink when I already have a headache, feel dizzy or tired, or become irritable.

ES RUTA: /es/situaciones/no-nota-hambre-o-sed/

EN PATH: /en/situations/they-dont-notice-hunger-or-thirst/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-037

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: No sé si necesito descansar, comer o alejarme del ruido

EN TITLE: “I don't know whether I'm tired, overloaded or hungry”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: No me encuentro bien, pero no sé qué necesito. Me cuesta distinguir si tengo hambre, si necesito descansar o si el ruido, las luces o la cantidad de gente me están molestando demasiado.

EN SUMMARY: I do not feel well, but I do not know what I need. I find it hard to tell whether I am hungry, need to rest, or whether the noise, the lights or the number of people around me are bothering me too much.

ES RUTA: /es/situaciones/no-se-si-estoy-cansada-saturada-o-tengo-hambre/

EN PATH: /en/situations/i-dont-know-whether-im-tired-overloaded-or-hungry/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-038

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: El hambre aparece de golpe y ya me encuentro mal

EN TITLE: “Hunger hits suddenly and by then I feel awful”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Paso varias horas sin sentir hambre. Cuando por fin la noto, ya tengo mareo, temblor, dolor de cabeza o mucho mal humor y necesito comer cuanto antes.

EN SUMMARY: I go for several hours without feeling hungry. By the time I finally notice it, I already feel dizzy, shaky, have a headache or feel very irritable, and I need to eat as soon as possible.

ES RUTA: /es/situaciones/el-hambre-aparece-de-golpe-y-ya-estoy-fatal/

EN PATH: /en/situations/hunger-hits-suddenly-and-by-then-i-feel-awful/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-039

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Estoy explorando mi género»

EN TITLE: “I'm exploring my gender”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Probar un nombre, pedir otro trato, cambiar algo de la ropa y ver cómo se siente. Nada de eso obliga a nada después, y hacerlo en un sitio donde no haya que explicarse es lo que cambia la experiencia.

EN SUMMARY: Trying a name, asking to be addressed differently, changing something about clothing and noticing how it feels. None of these steps commits a person to anything later, and being able to explore somewhere without having to justify it can make a major difference.

ES RUTA: /es/situaciones/estoy-explorando-mi-genero/

EN PATH: /en/situations/im-exploring-my-gender/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-040

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Estoy explorando mi género y todavía no tengo una palabra»

EN TITLE: “I'm exploring my gender and I don't have a word for it yet”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Se sabe que algo no encaja y todavía no hay palabra que lo diga. Y alrededor hay gente pidiendo la palabra ya: «¿entonces qué eres?», como si sin etiqueta no se pudiera hablar del tema.

EN SUMMARY: You may know that something does not fit while still not having a word that describes it. People around you may ask for a label immediately — ‘so what are you?’ — as though respectful treatment depends on having one.

ES RUTA: /es/situaciones/estoy-explorando-mi-genero-y-todavia-no-tengo-una-palabra/

EN PATH: /en/situations/im-exploring-my-gender-without-a-word-yet/

ESTADO: BILINGUAL_COMPLETE

---

## 26.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 40 situaciones bilingües completas del catálogo principal. No se ha creado ningún archivo nuevo para esta tanda.

EN: The same master MD now contains 40 complete bilingual situations from the main catalogue. No new file was created for this batch.

SIGUIENTE REGISTRO: WEB-SITUATION-041

# 27. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-041

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Soy autista y también trans o no binario»

EN TITLE: “I'm autistic and I'm also trans or non-binary”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: En un sitio dicen que primero hay que mirar el autismo, y en el otro que primero hay que resolver el género. Se va y se vuelve, con la misma pregunta sin responder y un año perdido en el camino.

EN SUMMARY: One service says autism has to be dealt with first; another says gender has to be resolved first. The person is sent back and forth with the same question unanswered and time lost in the process.

ES RUTA: /es/situaciones/soy-autista-y-tambien-trans-o-no-binario/

EN PATH: /en/situations/im-autistic-and-im-also-trans-or-non-binary/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-042

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Mi forma de vestir no coincide con lo que esperan de mi género»

EN TITLE: “The way I dress doesn't match what people expect of my gender”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: La prenda que no aprieta, no pica y deja moverse resulta que además no es la que se espera. Y en algunos sitios eso trae comentarios, o pone en riesgo, aunque la decisión fuera solo poder pasar el día.

EN SUMMARY: The clothes that do not squeeze, itch or restrict movement may also be the clothes other people do not expect. In some settings that brings comments or even risk, although the original decision may simply have been about getting through the day comfortably.

ES RUTA: /es/situaciones/mi-forma-de-vestir-no-coincide-con-lo-que-esperan-de-mi/

EN PATH: /en/situations/the-way-i-dress-and-my-gender/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-043

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Mi experiencia de género cambia con el tiempo»

EN TITLE: “My experience of gender changes over time”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Lo que encajaba el año pasado hoy no encaja igual, y eso no anula lo de antes ni lo convierte en un error. Lo incómodo suele ser de fuera: los papeles y la gente esperan una respuesta fija.

EN SUMMARY: What fit last year may not fit in the same way today. That does not erase the earlier experience or make it a mistake. The difficulty is often external: paperwork and other people may expect one fixed answer.

ES RUTA: /es/situaciones/mi-experiencia-de-genero-cambia-con-el-tiempo/

EN PATH: /en/situations/my-experience-of-gender-changes-over-time/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-044

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Siguen usando un nombre que ya no utilizo»

EN TITLE: “People keep using a name I no longer use”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Se ha dicho ya varias veces y el nombre antiguo sigue apareciendo: en la lista de clase, en el correo del trabajo, cuando llaman en la sala de espera. No es solo que la gente se despiste, es que está escrito así en algún sitio.

EN SUMMARY: You have already said it several times and the old name still appears: on the class list, in work email or when you are called in a waiting room. Sometimes it is not only a person forgetting; the old name is still stored somewhere in a system.

ES RUTA: /es/situaciones/siguen-usando-un-nombre-que-ya-no-utilizo/

EN PATH: /en/situations/people-keep-using-a-name-i-no-longer-use/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-045

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «No quiero que mi nombre anterior aparezca delante de otras personas»

EN TITLE: “I don't want my previous name to appear in front of other people”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: El nombre puede estar corregido en la lista y seguir apareciendo en un correo antiguo, en un diploma o en la pantalla de la sala de espera. Y ahí no se corrige un dato: se está contando algo tuyo a gente que no lo tiene que saber.

EN SUMMARY: The name may be corrected on a current list and still appear in an old email, on a certificate or on a waiting-room screen. At that point this is not simply a data correction: private information may be being disclosed to people who do not need it.

ES RUTA: /es/situaciones/no-quiero-que-aparezca-mi-nombre-anterior/

EN PATH: /en/situations/i-dont-want-my-previous-name-shown/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-046

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «No sé qué pronombre usar para una persona»

EN TITLE: “I don't know which pronoun to use for someone”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Va a entrar en la reunión, o llega a clase, y no se sabe cómo referirse a ella sin meter la pata. Preguntar bien lleva cinco segundos, y equivocarse se arregla en tres palabras.

EN SUMMARY: Someone is about to join a meeting or arrive in class, and you do not know how to refer to them without getting it wrong. Asking respectfully can take only a few seconds, and a mistake can usually be corrected briefly and then left behind.

ES RUTA: /es/situaciones/no-se-que-pronombre-usar-para-una-persona/

EN PATH: /en/situations/i-dont-know-which-pronoun-to-use-for-someone/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-047

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Usar otro nombre me hace sentir más cómoda»

EN TITLE: “Using another name makes me feel more comfortable”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Con el nombre nuevo el día cuesta menos: se responde antes, se entra a los sitios de otra manera. Eso ya es motivo suficiente, y no hace falta que venga con una explicación detrás.

EN SUMMARY: With the new name, the day may take less effort: you respond more readily and enter situations differently. That experience is enough to matter; it does not need a further explanation to be valid.

ES RUTA: /es/situaciones/usar-otro-nombre-me-hace-sentir-mas-comoda/

EN PATH: /en/situations/using-another-name-makes-me-feel-more-comfortable/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-048

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Siento que tengo que parecer normal para encajar»

EN TITLE: “I feel I have to look normal to fit in”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Se mira cómo hablan los demás, cuánto miran, cuándo se ríen, y se copia. Funciona, y a la vez se está haciendo un trabajo que nadie más en la sala está haciendo.

EN SUMMARY: You watch how other people speak, how much eye contact they use, when they laugh, and you copy it. It may work socially, while also adding a layer of effort that other people in the room may not be doing.

ES RUTA: /es/situaciones/siento-que-tengo-que-parecer-normal-para-encajar/

EN PATH: /en/situations/i-feel-i-have-to-look-normal-to-fit-in/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-049

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Siento que actúo todo el día para parecer normal»

EN TITLE: “I feel as though I'm acting all day to look normal”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: No es un rato: es el día entero vigilando el tono, la cara, el movimiento y las ganas de irse. Por fuera parece que va bien, y el coste se ve al llegar a casa, cuando ya no queda nada.

EN SUMMARY: It is not a short performance: it can be a whole day of monitoring tone, facial expression, movement and the urge to leave. From the outside everything may appear to be going well; the cost may become visible only at home, when little energy remains.

ES RUTA: /es/situaciones/siento-que-actuo-todo-el-dia-para-parecer-normal/

EN PATH: /en/situations/i-feel-as-though-im-acting-all-day-to-look-normal/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-050

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Siento que tengo que ocultar partes de mí para encajar»

EN TITLE: “I feel I have to hide parts of myself to fit in”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: No es actuar en general: es guardar cosas concretas. El interés del que se podría hablar horas, el movimiento que calma, la necesidad de irse antes. Se esconde porque en algún sitio salió mal.

EN SUMMARY: This is not about performing in general but hiding specific things: an interest you could talk about for hours, a movement that helps you regulate, or the need to leave earlier. People often hide these things because showing them went badly somewhere before.

ES RUTA: /es/situaciones/siento-que-tengo-que-ocultar-partes-de-mi-para-encajar/

EN PATH: /en/situations/i-feel-i-have-to-hide-parts-of-myself-to-fit-in/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-051

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «En el trabajo gasto toda mi energía en parecer que estoy bien»

EN TITLE: “At work I use all my energy trying to look as though I'm fine”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: El trabajo sale, y sale bien. Lo que no queda es el resto: la compra, la llamada pendiente, la cena, ver a alguien. La jornada se cobra en las horas de después, y eso no aparece en ninguna evaluación.

EN SUMMARY: The work gets done, and it gets done well. What is left out is everything else: shopping, a phone call, dinner, seeing someone. The working day is paid for in the hours afterwards, and that cost may not show up in a performance review.

ES RUTA: /es/situaciones/en-el-trabajo-gasto-la-energia-en-parecer-que-estoy-bien/

EN PATH: /en/situations/at-work-i-spend-my-energy-looking-fine/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-052

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «No sé qué información es privada»

EN TITLE: “I don't know what information is private”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Se cuenta algo con normalidad y por la cara de quien escucha se ve que no tocaba. La privacidad no se aprende por intuición: es una clasificación, y nadie la enseña.

EN SUMMARY: You share something normally and realise from the other person's reaction that it may not have been information for that setting. Privacy is not always intuitive; it can help to treat it as a classification that can be learned explicitly.

ES RUTA: /es/situaciones/no-se-que-informacion-es-privada/

EN PATH: /en/situations/i-dont-know-what-information-is-private/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-053

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Comparto información y después pienso que era demasiado privada»

EN TITLE: “I share information and afterwards think it was too private”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Sales de la conversación y empieza el repaso: eso no tenía que haberlo dicho. A veces es verdad y a veces es la rumiación, y desde dentro las dos se parecen mucho.

EN SUMMARY: You leave the conversation and the replay begins: I shouldn't have said that. Sometimes there is a real privacy issue and sometimes the continuing problem is rumination; from the inside, the two can feel very similar.

ES RUTA: /es/situaciones/comparto-informacion-y-despues-me-arrepiento/

EN PATH: /en/situations/i-share-information-and-regret-it-afterwards/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-054

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: El ruido me resulta insoportable

EN TITLE: “Noise is unbearable for them”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Cuando hay muchos sonidos al mismo tiempo, llega un momento en que ya no los soporto. Me tapo los oídos o salgo del lugar para encontrar un sitio con menos ruido.

EN SUMMARY: When there are many sounds at the same time, I reach a point where I cannot stand them any longer. I cover my ears or leave the place to find somewhere with less noise.

ES RUTA: /es/situaciones/el-ruido-le-resulta-insoportable/

EN PATH: /en/situations/noise-is-unbearable-for-them/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-055

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Los exámenes en un aula ruidosa son insoportables

EN TITLE: “Exams in a noisy classroom are unbearable”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Durante el examen oigo cómo alguien mueve una silla, tose, hace clic con un bolígrafo o pasa una hoja. Esos sonidos me distraen y me cuesta concentrarme en las preguntas, aunque haya estudiado.

EN SUMMARY: During an exam, I hear someone moving a chair, coughing, clicking a pen or turning a page. Those sounds distract me and make it hard to concentrate on the questions, even when I have studied.

ES RUTA: /es/situaciones/los-examenes-en-un-aula-ruidosa-son-insoportables/

EN PATH: /en/situations/exams-in-a-noisy-classroom-are-unbearable/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-056

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Los sonidos normales me resultan dolorosos

EN TITLE: “Ordinary sounds are painful for me”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Un aplauso, una moto que pasa cerca o un plato al golpear el fregadero me hacen daño en los oídos. Cuando el sonido termina, el dolor tarda un rato en desaparecer.

EN SUMMARY: Clapping, a motorbike passing nearby or a plate hitting the sink hurts my ears. When the sound stops, the pain takes a while to go away.

ES RUTA: /es/situaciones/los-sonidos-normales-me-resultan-dolorosos/

EN PATH: /en/situations/ordinary-sounds-are-painful-for-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-057

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Hay sonidos concretos que me hacen reaccionar de inmediato

EN TITLE: “Specific sounds trigger an immediate reaction in me”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Oír a alguien masticar, respirar o hacer clic repetidamente con un bolígrafo me provoca rabia, angustia o mucha tensión. Necesito salir del lugar para dejar de oír ese sonido.

EN SUMMARY: Hearing someone chewing, breathing or repeatedly clicking a pen makes me feel angry, distressed or very tense. I need to leave the place so I no longer hear that sound.

ES RUTA: /es/situaciones/hay-sonidos-concretos-que-me-provocan-una-reaccion/

EN PATH: /en/situations/specific-sounds-trigger-an-immediate-reaction-in-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-058

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «El transporte público me sobrecarga»

EN TITLE: “Public transport overwhelms me”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Veinte minutos de pie, alguien hablando por teléfono al lado, el frenazo, el aviso por megafonía que no se entiende. Se llega habiendo gastado el viaje y lo que venía después.

EN SUMMARY: Twenty minutes standing, someone talking on the phone beside you, sudden braking, an announcement you cannot make out. You can arrive having already spent much of the energy needed for what comes next.

ES RUTA: /es/situaciones/el-transporte-publico-me-sobrecarga/

EN PATH: /en/situations/public-transport-overwhelms-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-059

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta el transporte o los espacios porque también tengo una discapacidad física»

EN TITLE: “Transport or public spaces are difficult because I also have a physical disability”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: El ascensor de la estación llevaba dos meses averiado, la rampa daba a un escalón y el asiento reservado estaba ocupado. No es que el viaje cansara: es que el viaje no se podía hacer.

EN SUMMARY: The station lift has been broken for weeks, the ramp leads to a step, or the designated seat is occupied. This is not simply about the journey being tiring; sometimes the journey is physically inaccessible.

ES RUTA: /es/situaciones/me-cuesta-el-transporte-por-discapacidad-fisica/

EN PATH: /en/situations/transport-is-difficult-with-a-physical-disability/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-060

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Las luces blancas me cansan muy rápido

EN TITLE: “White lights tire me out very quickly”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: La luz blanca o muy intensa me molesta en los ojos. Después de un rato tengo dolor de cabeza, necesito cerrar los ojos o ir a un lugar con menos luz.

EN SUMMARY: White or very bright light bothers my eyes. After a while, I get a headache, need to close my eyes or go somewhere with less light.

ES RUTA: /es/situaciones/las-luces-blancas-me-cansan-muy-rapido/

EN PATH: /en/situations/white-lights-tire-me-out-very-quickly/

ESTADO: BILINGUAL_COMPLETE

---

## 27.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 60 situaciones bilingües completas del catálogo principal.

EN: The same master MD now contains 60 complete bilingual situations from the main catalogue.

SIGUIENTE REGISTRO: WEB-SITUATION-061

# 28. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-061

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: El olor de algunas tiendas me obliga a salir

EN TITLE: “The smell in some shops makes me leave”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Los perfumes, los productos de limpieza y otros olores fuertes me provocan náuseas, dolor de cabeza o mucho malestar. Necesito salir de la tienda para dejar de olerlos.

EN SUMMARY: Perfume, cleaning products and other strong smells make me feel sick, give me a headache or make me feel very unwell. I need to leave the shop so I no longer smell them.

ES RUTA: /es/situaciones/el-olor-de-algunas-tiendas-me-obliga-a-salir/

EN PATH: /en/situations/the-smell-in-some-shops-makes-me-leave/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-062

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: No noto que tengo frío hasta que estoy temblando

EN TITLE: “I do not notice I am cold until I am shivering”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Tardo en darme cuenta de que tengo frío. Lo noto cuando ya estoy temblando o tengo las manos y los pies muy fríos.

EN SUMMARY: It takes me a while to realise that I am cold. I notice it when I am already shivering or when my hands and feet are very cold.

ES RUTA: /es/situaciones/no-noto-que-tengo-frio-hasta-que-estoy-temblando/

EN PATH: /en/situations/i-do-not-notice-i-am-cold-until-i-am-shivering/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-063

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: El calor me agota antes que a otras personas

EN TITLE: “Heat overwhelms me sooner than it seems to overwhelm other people”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Aunque otras personas estén bien con la temperatura, yo ya tengo demasiado calor. Me cuesta seguir con lo que estoy haciendo, siento mareo o necesito ir a un lugar más fresco y descansar.

EN SUMMARY: Even when other people are comfortable with the temperature, I already feel too hot. I find it hard to continue what I am doing, feel dizzy or need to go somewhere cooler and rest.

ES RUTA: /es/situaciones/el-calor-me-satura-antes-que-a-otras-personas/

EN PATH: /en/situations/heat-overwhelms-me-sooner-than-it-seems-to-overwhelm-other-people/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-064

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Necesito moverme para poder concentrarme

EN TITLE: “I need to move in order to concentrate”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Muevo las piernas, cambio de postura, me balanceo o camino mientras escucho o trabajo. Cuando me muevo, me resulta más fácil seguir escuchando y terminar lo que estoy haciendo.

EN SUMMARY: I move my legs, change position, rock or walk while I listen or work. When I move, it is easier for me to keep listening and finish what I am doing.

ES RUTA: /es/situaciones/necesito-moverme-para-poder-concentrarme/

EN PATH: /en/situations/i-need-to-move-in-order-to-concentrate/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-065

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me mareo con ciertos movimientos o escaleras mecánicas

EN TITLE: “Certain movements or escalators make me dizzy”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Las escaleras mecánicas, los ascensores, los vehículos y algunos movimientos rápidos me marean. Me cuesta mantener el equilibrio y necesito sujetarme o esperar unos segundos sin moverme.

EN SUMMARY: Escalators, lifts, vehicles and some fast movements make me feel dizzy. I find it hard to keep my balance and need to hold on to something or wait for a few seconds without moving.

ES RUTA: /es/situaciones/me-mareo-con-ciertos-movimientos-o-escaleras-mecanicas/

EN PATH: /en/situations/certain-movements-or-escalators-make-me-dizzy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-066

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Las multitudes me desorientan aunque no haya mucho ruido

EN TITLE: “Crowds disorient me even when they are not very noisy”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Cuando hay muchas personas a mi alrededor, tengo que mirar continuamente por dónde camino para no chocar con nadie. Me cuesta encontrar la salida o recordar hacia dónde iba y necesito ir a un lugar con menos gente.

EN SUMMARY: When there are many people around me, I have to keep watching where I am walking so I do not bump into anyone. I find it hard to find the exit or remember where I was going, and I need to move to a place with fewer people.

ES RUTA: /es/situaciones/las-multitudes-me-desorientan-aunque-no-haya-mucho-ruido/

EN PATH: /en/situations/crowds-disorient-me-even-when-they-are-not-very-noisy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-067

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: El contacto inesperado me sobresalta muchísimo

EN TITLE: “Unexpected touch startles me intensely”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Si alguien me toca sin avisar, doy un sobresalto y me aparto de esa persona. Necesito unos segundos para entender quién me ha tocado y qué ha pasado.

EN SUMMARY: If someone touches me without warning, I startle and move away from that person. I need a few seconds to understand who touched me and what happened.

ES RUTA: /es/situaciones/el-contacto-inesperado-me-sobresalta-muchisimo/

EN PATH: /en/situations/unexpected-touch-startles-me-intensely/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-068

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me cuesta saber cuánta fuerza estoy usando

EN TITLE: “I find it hard to judge how much force I am using”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: No noto si estoy haciendo demasiada fuerza o demasiado poca. Me ocurre al escribir, abrir un objeto, agarrar algo, abrazar a alguien o hacer tareas con las manos.

EN SUMMARY: I do not notice whether I am using too much force or too little. This happens when I write, open something, hold an object, hug someone or do tasks with my hands.

ES RUTA: /es/situaciones/me-cuesta-saber-cuanta-fuerza-estoy-usando/

EN PATH: /en/situations/i-find-it-hard-to-judge-how-much-force-i-am-using/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-069

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Necesito tocar o apretar cosas para calmarme

EN TITLE: “I need to touch or squeeze things to regulate myself”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Cuando siento nervios o mucha tensión, necesito tocar una textura, apretar un objeto o hacer fuerza con las manos. Hacerlo me ayuda a calmarme y a continuar con lo que estaba haciendo.

EN SUMMARY: When I feel nervous or very tense, I need to touch a texture, squeeze an object or press with my hands. Doing this helps me feel calmer and continue with what I was doing.

ES RUTA: /es/situaciones/necesito-tocar-o-apretar-cosas-para-regularme/

EN PATH: /en/situations/i-need-to-touch-or-squeeze-things-to-regulate-myself/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-070

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Algunos sabores me resultan demasiado intensos

EN TITLE: “Some flavours feel far too intense”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Hay sabores que noto tan fuertes que no consigo seguir comiendo. Me ocurre con determinados alimentos dulces, salados, amargos, ácidos o picantes.

EN SUMMARY: Some flavours taste so strong to me that I cannot keep eating. This happens with certain sweet, salty, bitter, sour or spicy foods.

ES RUTA: /es/situaciones/algunos-sabores-me-resultan-demasiado-intensos/

EN PATH: /en/situations/some-flavours-feel-far-too-intense/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-071

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: El agua de la ducha me molesta en la piel

EN TITLE: “Shower water feels uncomfortable on my skin”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: El agua al caer sobre mi piel me molesta o me duele. También me cuesta soportar la temperatura del agua, el ruido de la ducha o la sensación de tener el cuerpo mojado.

EN SUMMARY: The water hitting my skin in the shower bothers me or hurts. I also find it hard to tolerate the water temperature, the sound of the shower or the feeling of having my body wet.

ES RUTA: /es/situaciones/el-agua-de-la-ducha-me-molesta-en-la-piel/

EN PATH: /en/situations/shower-water-feels-uncomfortable-on-my-skin/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-072

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Los cambios de temperatura me dejan sin energía

EN TITLE: “Temperature changes leave me exhausted”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Pasar de un lugar frío a uno caliente, o de uno caliente a uno frío, me deja sin energía. Después necesito sentarme o tumbarme y descansar antes de seguir con lo que estaba haciendo.

EN SUMMARY: Moving from a cold place to a warm one, or from a warm place to a cold one, leaves me without energy. Afterwards, I need to sit or lie down and rest before continuing with what I was doing.

ES RUTA: /es/situaciones/los-cambios-de-temperatura-me-dejan-agotada/

EN PATH: /en/situations/temperature-changes-leave-me-exhausted/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-073

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me cuesta encontrar una postura que no me moleste

EN TITLE: “I struggle to find a comfortable sitting position”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Al poco tiempo de sentarme, la postura empieza a molestarme. Cambio la posición de las piernas, me siento de otra manera o me levanto hasta encontrar una postura en la que tenga menos molestias.

EN SUMMARY: Soon after I sit down, the position starts to bother me. I move my legs, sit differently or stand up until I find a position that causes less discomfort.

ES RUTA: /es/situaciones/me-cuesta-encontrar-una-postura-comoda-para-sentarme/

EN PATH: /en/situations/i-struggle-to-find-a-comfortable-sitting-position/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-074

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: La ropa que tolero un día me molesta otro

EN TITLE: “Clothes I can tolerate one day bother me another day”

ES CATEGORÍA: Sentidos

EN CATEGORY: Sensory experiences

ES RESUMEN: Una prenda que ayer llevaba sin problema hoy me molesta. En los días en que he dormido mal, tengo calor o llevo muchas horas fuera de casa, noto más la tela, las costuras y la presión de la ropa.

EN SUMMARY: A piece of clothing that did not bother me yesterday bothers me today. On days when I have slept badly, feel hot or have been away from home for many hours, I notice the fabric, seams and pressure of the clothing more.

ES RUTA: /es/situaciones/la-ropa-que-tolero-un-dia-me-molesta-otro/

EN PATH: /en/situations/clothes-i-can-tolerate-one-day-bother-me-another-day/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-075

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me entra sueño muy tarde aunque me levante temprano

EN TITLE: “I only feel sleepy very late even when I get up early”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Me levanto temprano por la mañana, pero por la noche no tengo sueño hasta muy tarde. Cuando consigo dormirme, ya es muy tarde y duermo pocas horas antes de que suene la alarma.

EN SUMMARY: I get up early in the morning, but at night I do not feel sleepy until very late. By the time I fall asleep, it is already very late and I only sleep for a few hours before the alarm goes off.

ES RUTA: /es/situaciones/me-entra-sueno-muy-tarde-aunque-me-levante-temprano/

EN PATH: /en/situations/i-only-feel-sleepy-very-late-even-when-i-get-up-early/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-076

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Aunque duerma muchas horas, tardo mucho en despertarme

EN TITLE: “I struggle to wake up even after many hours of sleep”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Cuando suena la alarma tardo en abrir los ojos y levantarme. Después sigo con sueño durante un buen rato y voy más despacio al vestirme, desayunar o prepararme para salir.

EN SUMMARY: When the alarm goes off, it takes me a while to open my eyes and get out of bed. I still feel sleepy for quite some time afterwards and I move more slowly when getting dressed, having breakfast or getting ready to go out.

ES RUTA: /es/situaciones/me-cuesta-despertarme-aunque-haya-dormido-muchas-horas/

EN PATH: /en/situations/i-struggle-to-wake-up-even-after-many-hours-of-sleep/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-077

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Los fines de semana mi horario de sueño cambia por completo

EN TITLE: “My sleep schedule shifts completely at weekends”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Durante la semana me levanto a una hora fija. El fin de semana me acuesto y me levanto mucho más tarde. El domingo por la noche no tengo sueño a la hora habitual y el lunes me levanto después de haber dormido pocas horas.

EN SUMMARY: During the week I get up at a fixed time. At the weekend I go to bed and get up much later. On Sunday night I am not sleepy at my usual bedtime, and on Monday I get up after only a few hours of sleep.

ES RUTA: /es/situaciones/los-fines-de-semana-se-me-cambia-todo-el-horario/

EN PATH: /en/situations/my-sleep-schedule-shifts-completely-at-weekends/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-078

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Hago la misma rutina antes de dormir

EN TITLE: “I need the same routine to be able to fall asleep”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Antes de acostarme hago las mismas actividades y las hago en el mismo orden. Esa rutina me ayuda a relajarme y a dormirme a la hora habitual.

EN SUMMARY: Before going to bed, I do the same activities in the same order. That routine helps me relax and fall asleep at my usual time.

ES RUTA: /es/situaciones/necesito-la-misma-rutina-para-poder-dormirme/

EN PATH: /en/situations/i-need-the-same-routine-to-be-able-to-fall-asleep/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-079

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Cualquier ruido me despierta, aunque sea bajo

EN TITLE: “Any small noise wakes me up”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Mientras duermo, el sonido de una puerta, una voz, un coche o unos pasos en el pasillo me despierta. Si los ruidos continúan, vuelvo a despertarme cada vez que me duermo.

EN SUMMARY: While I am asleep, the sound of a door, a voice, a car or footsteps in the hallway wakes me up. If the noises continue, I wake up again each time I fall asleep.

ES RUTA: /es/situaciones/cualquier-ruido-pequeno-me-despierta/

EN PATH: /en/situations/any-small-noise-wakes-me-up/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-080

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: La luz de la mañana me despierta demasiado pronto

EN TITLE: “Morning light wakes me too early”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Cuando entra la luz por la ventana me despierto, aunque todavía falten horas para levantarme. Si no vuelvo a dormirme, paso esas horas en la cama sin dormir.

EN SUMMARY: When light comes through the window, I wake up even though there are still hours before I need to get up. If I do not fall asleep again, I spend those hours in bed awake.

ES RUTA: /es/situaciones/la-luz-de-la-manana-me-despierta-demasiado-pronto/

EN PATH: /en/situations/morning-light-wakes-me-too-early/

ESTADO: BILINGUAL_COMPLETE

---

## 28.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 80 situaciones bilingües completas del catálogo principal.

EN: The same master MD now contains 80 complete bilingual situations from the main catalogue.

SIGUIENTE REGISTRO: WEB-SITUATION-081

# 29. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-081

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me duermo durante el día y luego no puedo dormir de noche

EN TITLE: “I fall asleep during the day and then cannot sleep at night”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Durante el día tengo tanto sueño que termino durmiendo una siesta. Si duermo una o varias horas por la tarde, por la noche no tengo sueño a la hora habitual y me duermo mucho más tarde.

EN SUMMARY: During the day I feel so sleepy that I end up taking a nap. If I sleep for one or several hours in the afternoon, I am not sleepy at my usual bedtime and I fall asleep much later.

ES RUTA: /es/situaciones/me-duermo-durante-el-dia-y-luego-no-puedo-dormir-de-noche/

EN PATH: /en/situations/i-fall-asleep-during-the-day-and-then-cannot-sleep-at-night/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-082

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Al acostarme sigo pensando en muchas cosas

EN TITLE: “My mind becomes active as soon as I go to bed”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Al meterme en la cama empiezo a recordar conversaciones, pensar en lo que tengo que hacer al día siguiente o repasar cosas que han pasado durante el día. Sigo pensando durante mucho tiempo y me duermo más tarde de lo que quería.

EN SUMMARY: When I get into bed, I start remembering conversations, thinking about what I have to do the next day or going over things that happened during the day. I keep thinking for a long time and fall asleep later than I wanted to.

ES RUTA: /es/situaciones/tengo-la-cabeza-activa-justo-cuando-me-acuesto/

EN PATH: /en/situations/my-mind-becomes-active-as-soon-as-i-go-to-bed/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-083

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me preocupa no dormir y tardo aún más en dormirme

EN TITLE: “Worrying about not sleeping keeps me awake”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Miro la hora y calculo cuántas horas quedan hasta que suene la alarma. Pienso que al día siguiente tendré sueño y vuelvo a mirar el reloj. Cuanto más miro la hora y pienso en dormir, más tiempo paso sin dormir.

EN SUMMARY: I look at the time and work out how many hours are left before the alarm goes off. I think about how sleepy I will feel the next day and look at the clock again. The more I check the time and think about sleeping, the longer I stay awake.

ES RUTA: /es/situaciones/me-preocupa-no-dormir-y-eso-me-mantiene-despierta/

EN PATH: /en/situations/worrying-about-not-sleeping-keeps-me-awake/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-084

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Después de un día intenso sigo con el cuerpo tenso al acostarme

EN TITLE: “After an intense day I am still wired at night”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Después de un día con muchas actividades, conversaciones, ruidos o desplazamientos, me acuesto y todavía noto el cuerpo tenso. Pasa bastante tiempo hasta que consigo relajarme y dormirme.

EN SUMMARY: After a day with many activities, conversations, noises or journeys, I go to bed and my body still feels tense. It takes quite a while before I relax and fall asleep.

ES RUTA: /es/situaciones/despues-de-un-dia-intenso-sigo-acelerada-por-la-noche/

EN PATH: /en/situations/after-an-intense-day-i-am-still-wired-at-night/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-085

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Si termino una actividad y me acuesto enseguida, no me duermo

EN TITLE: “I need a long time to wind down before sleep”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Cuando termino una actividad y me meto en la cama enseguida, sigo pensando en lo que estaba haciendo. Paso mucho rato sin dormir antes de que empiece a entrarme sueño.

EN SUMMARY: When I finish an activity and get into bed straight away, I keep thinking about what I was doing. I stay awake for a long time before I start to feel sleepy.

ES RUTA: /es/situaciones/necesito-mucho-tiempo-para-bajar-el-ritmo-antes-de-dormir/

EN PATH: /en/situations/i-need-a-long-time-to-wind-down-before-sleep/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-086

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Duermo mejor cuando no tengo que levantarme a una hora fija

EN TITLE: “I sleep better when I do not have to get up at a fixed time”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Cuando no pongo alarma, me acuesto cuando tengo sueño y me despierto sin alarma. Duermo más horas seguidas y por la mañana siento que he descansado mejor.

EN SUMMARY: When I do not set an alarm, I go to bed when I feel sleepy and wake up without an alarm. I sleep for more hours without waking and feel better rested in the morning.

ES RUTA: /es/situaciones/duermo-mejor-cuando-no-tengo-que-levantarme-a-una-hora-fija/

EN PATH: /en/situations/i-sleep-better-when-i-do-not-have-to-get-up-at-a-fixed-time/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-087

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me despierto con el cuerpo tenso

EN TITLE: “I wake up with my body tense”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Al despertarme noto los músculos rígidos, la mandíbula apretada o los hombros levantados. Empiezo el día con dolor o molestias aunque haya dormido varias horas.

EN SUMMARY: When I wake up, I notice that my muscles are stiff, my jaw is clenched or my shoulders are raised. I start the day with pain or discomfort even after sleeping for several hours.

ES RUTA: /es/situaciones/me-despierto-con-el-cuerpo-tenso/

EN PATH: /en/situations/i-wake-up-with-my-body-tense/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-088

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Tengo sueños muy intensos y después tardo en volver a dormirme

EN TITLE: “I have very intense dreams and struggle to fall asleep again”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Tengo sueños muy intensos y me despierto de golpe. Recuerdo muchos detalles de lo que he soñado y sigo pensando en ello. Paso bastante tiempo sin dormir antes de volver a dormirme.

EN SUMMARY: I have very intense dreams and wake up suddenly. I remember many details of what I dreamed and keep thinking about them. I stay awake for quite a while before falling asleep again.

ES RUTA: /es/situaciones/tengo-suenos-muy-intensos-y-me-cuesta-volver-a-dormir/

EN PATH: /en/situations/i-have-very-intense-dreams-and-struggle-to-fall-asleep-again/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-089

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: El cambio de hora altera mi sueño durante varios días

EN TITLE: “The clock change throws me off for days”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Cuando adelantan o atrasan la hora, durante varios días sigo teniendo sueño y despertándome según el horario anterior. Por la noche no tengo sueño a la nueva hora de acostarme o me despierto antes de la hora que ahora marca el reloj.

EN SUMMARY: When the clocks move forward or back, for several days I still feel sleepy and wake up according to the previous schedule. At night I am not sleepy at the new bedtime, or I wake up earlier than the new time on the clock.

ES RUTA: /es/situaciones/el-cambio-de-hora-me-descoloca-durante-dias/

EN PATH: /en/situations/the-clock-change-throws-me-off-for-days/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-090

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Cuando viajo, mi horario de sueño cambia por completo

EN TITLE: “Travel completely disrupts my sleep”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Al viajar cambian la cama, los horarios, los ruidos y las actividades del día. Durante el viaje me duermo más tarde, me despierto varias veces o termino durmiendo a horas distintas de las habituales.

EN SUMMARY: When I travel, the bed, schedules, noises and daily activities all change. During the trip I fall asleep later, wake up several times or end up sleeping at different times from usual.

ES RUTA: /es/situaciones/viajar-me-rompe-por-completo-el-sueno/

EN PATH: /en/situations/travel-completely-disrupts-my-sleep/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-091

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: Me tumbo para una siesta corta y termino durmiendo varias horas

EN TITLE: “A short nap turns into several hours”

ES CATEGORÍA: Sueño

EN CATEGORY: Sleep

ES RESUMEN: Me tumbo para dormir un rato y pongo una alarma. Cuando me despierto han pasado varias horas, o apago la alarma y vuelvo a dormir. Esa noche me duermo mucho más tarde de lo habitual.

EN SUMMARY: I lie down to sleep for a short while and set an alarm. When I wake up, several hours have passed, or I turn off the alarm and go back to sleep. That night I fall asleep much later than usual.

ES RUTA: /es/situaciones/una-siesta-corta-se-convierte-en-varias-horas/

EN PATH: /en/situations/a-short-nap-turns-into-several-hours/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-092

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Sé lo que quiero decir pero no encuentro las palabras»

EN TITLE: “I know what I want to say but cannot find the words”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I know what I want to say but cannot find the words”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/se-lo-que-quiero-decir-pero-no-encuentro-las-palabras/

EN PATH: /en/situations/i-know-what-i-want-to-say-but-cannot-find-the-words/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-093

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Entiendo las palabras pero no la intención»

EN TITLE: “I understand the words but not the intention”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I understand the words but not the intention”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/entiendo-las-palabras-pero-no-la-intencion/

EN PATH: /en/situations/i-understand-the-words-but-not-the-intention/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-094

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta saber cuándo me toca hablar»

EN TITLE: “I find it hard to know when it is my turn to speak”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to know when it is my turn to speak”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-saber-cuando-me-toca-hablar/

EN PATH: /en/situations/i-find-it-hard-to-know-when-it-is-my-turn-to-speak/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-095

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Interrumpo sin querer porque temo olvidar lo que iba a decir»

EN TITLE: “I interrupt without meaning to because I am afraid I will forget what I wanted to say”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I interrupt without meaning to because I am afraid I will forget what I wanted to say”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/interrumpo-sin-querer-porque-temo-olvidar-lo-que-iba-a-decir/

EN PATH: /en/situations/i-interrupt-without-meaning-to-because-i-am-afraid-i-will-forget-what-i-wanted-to-say/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-096

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito que me den las instrucciones por escrito»

EN TITLE: “I need instructions in writing”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need instructions in writing”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-que-me-den-las-instrucciones-por-escrito/

EN PATH: /en/situations/i-need-instructions-in-writing/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-097

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Las preguntas abiertas me bloquean»

EN TITLE: “Open-ended questions make me freeze”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Open-ended questions make me freeze”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/las-preguntas-abiertas-me-bloquean/

EN PATH: /en/situations/open-ended-questions-make-me-freeze/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-098

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Cuando me preguntan cómo estoy no sé qué responder»

EN TITLE: “When someone asks how I am, I do not know what to answer”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “When someone asks how I am, I do not know what to answer”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/cuando-me-preguntan-como-estoy-no-se-que-responder/

EN PATH: /en/situations/when-someone-asks-how-i-am-i-do-not-know-what-to-answer/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-099

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta explicar algo si me miran mientras hablo»

EN TITLE: “I struggle to explain something when people look at me while I speak”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to explain something when people look at me while I speak”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-explicar-algo-si-me-miran-mientras-hablo/

EN PATH: /en/situations/i-struggle-to-explain-something-when-people-look-at-me-while-i-speak/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-100

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «En grupos grandes no consigo entrar en la conversación»

EN TITLE: “In large groups I cannot get into the conversation”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “In large groups I cannot get into the conversation”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/en-grupos-grandes-no-consigo-entrar-en-la-conversacion/

EN PATH: /en/situations/in-large-groups-i-cannot-get-into-the-conversation/

ESTADO: BILINGUAL_COMPLETE

---

## 29.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 100 situaciones bilingües completas del catálogo principal.

EN: The same master MD now contains 100 complete bilingual situations from the main catalogue.

SIGUIENTE REGISTRO: WEB-SITUATION-101

# 30. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-101

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Hablo demasiado de un tema y luego me doy cuenta tarde»

EN TITLE: “I talk too much about one topic and only realise later”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I talk too much about one topic and only realise later”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/hablo-demasiado-de-un-tema-y-luego-me-doy-cuenta-tarde/

EN PATH: /en/situations/i-talk-too-much-about-one-topic-and-only-realise-later/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-102

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta detectar si alguien está bromeando»

EN TITLE: “I find it hard to tell when someone is joking”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to tell when someone is joking”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-detectar-si-alguien-esta-bromeando/

EN PATH: /en/situations/i-find-it-hard-to-tell-when-someone-is-joking/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-103

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito más tiempo para procesar una pregunta»

EN TITLE: “I need more time to process a question”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need more time to process a question”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-mas-tiempo-para-procesar-una-pregunta/

EN PATH: /en/situations/i-need-more-time-to-process-a-question/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-104

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Cambio de tema sin darme cuenta de que la otra persona seguía hablando de lo anterior»

EN TITLE: “I change topic without realising the other person was still on the previous one”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I change topic without realising the other person was still on the previous one”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/cambio-de-tema-sin-darme-cuenta-de-que-la-otra-persona-seguia-hablando-de-lo-anterior/

EN PATH: /en/situations/i-change-topic-without-realising-the-other-person-was-still-on-the-previous-one/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-105

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta pedir que repitan algo»

EN TITLE: “I find it hard to ask someone to repeat something”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to ask someone to repeat something”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-pedir-que-repitan-algo/

EN PATH: /en/situations/i-find-it-hard-to-ask-someone-to-repeat-something/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-106

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Una llamada telefónica me resulta mucho más difícil que escribir»

EN TITLE: “A phone call is much harder for me than writing”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “A phone call is much harder for me than writing”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/una-llamada-telefonica-me-resulta-mucho-mas-dificil-que-escribir/

EN PATH: /en/situations/a-phone-call-is-much-harder-for-me-than-writing/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-107

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Entiendo mejor si me enseñan un ejemplo»

EN TITLE: “I understand better when I am shown an example”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I understand better when I am shown an example”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/entiendo-mejor-si-me-ensenan-un-ejemplo/

EN PATH: /en/situations/i-understand-better-when-i-am-shown-an-example/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-108

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Cuando estoy saturada mi forma de hablar cambia»

EN TITLE: “When I am overloaded, the way I speak changes”

ES CATEGORÍA: Comunicación

EN CATEGORY: Communication

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “When I am overloaded, the way I speak changes”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/cuando-estoy-saturada-mi-forma-de-hablar-cambia/

EN PATH: /en/situations/when-i-am-overloaded-the-way-i-speak-changes/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-109

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Solo puedo comer unas pocas marcas o preparaciones»

EN TITLE: “I can only eat a few brands or preparations”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I can only eat a few brands or preparations”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/solo-puedo-comer-unas-pocas-marcas-o-preparaciones/

EN PATH: /en/situations/i-can-only-eat-a-few-brands-or-preparations/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-110

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Una comida que antes toleraba de repente ya no puedo comerla»

EN TITLE: “A food I used to tolerate suddenly becomes impossible to eat”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “A food I used to tolerate suddenly becomes impossible to eat”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/una-comida-que-antes-toleraba-de-repente-ya-no-puedo-comerla/

EN PATH: /en/situations/a-food-i-used-to-tolerate-suddenly-becomes-impossible-to-eat/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-111

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta comer si los alimentos se tocan en el plato»

EN TITLE: “I struggle to eat when foods touch on the plate”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to eat when foods touch on the plate”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-comer-si-los-alimentos-se-tocan-en-el-plato/

EN PATH: /en/situations/i-struggle-to-eat-when-foods-touch-on-the-plate/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-112

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito que la comida tenga siempre la misma textura»

EN TITLE: “I need food to have the same texture every time”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need food to have the same texture every time”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-que-la-comida-tenga-siempre-la-misma-textura/

EN PATH: /en/situations/i-need-food-to-have-the-same-texture-every-time/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-113

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Los olores de cocina me quitan el hambre»

EN TITLE: “Cooking smells take away my appetite”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Cooking smells take away my appetite”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/los-olores-de-cocina-me-quitan-el-hambre/

EN PATH: /en/situations/cooking-smells-take-away-my-appetite/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-114

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta saber si tengo hambre o ansiedad»

EN TITLE: “I find it hard to tell whether I am hungry or anxious”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to tell whether I am hungry or anxious”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-saber-si-tengo-hambre-o-ansiedad/

EN PATH: /en/situations/i-find-it-hard-to-tell-whether-i-am-hungry-or-anxious/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-115

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Puedo pasar horas sin acordarme de beber»

EN TITLE: “I can go for hours without remembering to drink”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I can go for hours without remembering to drink”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/puedo-pasar-horas-sin-acordarme-de-beber/

EN PATH: /en/situations/i-can-go-for-hours-without-remembering-to-drink/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-116

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Beber agua me resulta desagradable por la sensación»

EN TITLE: “Drinking water feels unpleasant because of the sensation”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Drinking water feels unpleasant because of the sensation”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/beber-agua-me-resulta-desagradable-por-la-sensacion/

EN PATH: /en/situations/drinking-water-feels-unpleasant-because-of-the-sensation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-117

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me agota decidir qué comer cada día»

EN TITLE: “Deciding what to eat every day exhausts me”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Deciding what to eat every day exhausts me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-agota-decidir-que-comer-cada-dia/

EN PATH: /en/situations/deciding-what-to-eat-every-day-exhausts-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-118

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Si no está la comida que esperaba prefiero no comer»

EN TITLE: “If the food I expected is not there, I would rather not eat”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “If the food I expected is not there, I would rather not eat”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/si-no-esta-la-comida-que-esperaba-prefiero-no-comer/

EN PATH: /en/situations/if-the-food-i-expected-is-not-there-i-would-rather-not-eat/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-119

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta comer delante de otras personas»

EN TITLE: “I find it hard to eat in front of other people”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to eat in front of other people”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-comer-delante-de-otras-personas/

EN PATH: /en/situations/i-find-it-hard-to-eat-in-front-of-other-people/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-120

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Tardo muchísimo en terminar una comida»

EN TITLE: “It takes me a very long time to finish a meal”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “It takes me a very long time to finish a meal”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/tardo-muchisimo-en-terminar-una-comida/

EN PATH: /en/situations/it-takes-me-a-very-long-time-to-finish-a-meal/

ESTADO: BILINGUAL_COMPLETE

---

## 30.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 120 situaciones bilingües completas del catálogo principal.

EN: The same master MD now contains 120 complete bilingual situations from the main catalogue.

SIGUIENTE REGISTRO: WEB-SITUATION-121

# 31. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-121

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Como muy deprisa y luego noto que estoy demasiado llena»

EN TITLE: “I eat very quickly and only afterwards notice I am too full”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I eat very quickly and only afterwards notice I am too full”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/como-muy-deprisa-y-luego-noto-que-estoy-demasiado-llena/

EN PATH: /en/situations/i-eat-very-quickly-and-only-afterwards-notice-i-am-too-full/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-122

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Algunas temperaturas de la comida me resultan insoportables»

EN TITLE: “Some food temperatures are unbearable for me”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Some food temperatures are unbearable for me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/algunas-temperaturas-de-la-comida-me-resultan-insoportables/

EN PATH: /en/situations/some-food-temperatures-are-unbearable-for-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-123

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta probar alimentos nuevos aunque quiera»

EN TITLE: “I struggle to try new foods even when I want to”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to try new foods even when I want to”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-probar-alimentos-nuevos-aunque-quiera/

EN PATH: /en/situations/i-struggle-to-try-new-foods-even-when-i-want-to/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-124

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito ver cómo está preparada la comida antes de comerla»

EN TITLE: “I need to see how food is prepared before I can eat it”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need to see how food is prepared before I can eat it”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-ver-como-esta-preparada-la-comida-antes-de-comerla/

EN PATH: /en/situations/i-need-to-see-how-food-is-prepared-before-i-can-eat-it/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-125

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Los cubiertos o platos cambian cómo siento la comida»

EN TITLE: “Cutlery or plates change how food feels to me”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Cutlery or plates change how food feels to me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/los-cubiertos-o-platos-cambian-como-siento-la-comida/

EN PATH: /en/situations/cutlery-or-plates-change-how-food-feels-to-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-126

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Después de un día difícil me cuesta todavía más comer»

EN TITLE: “After a difficult day, eating becomes even harder”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “After a difficult day, eating becomes even harder”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/despues-de-un-dia-dificil-me-cuesta-todavia-mas-comer/

EN PATH: /en/situations/after-a-difficult-day-eating-becomes-even-harder/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-127

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Organizar compra, cocinar y comer es demasiado en el mismo día»

EN TITLE: “Shopping, cooking and eating are too much to organise in one day”

ES CATEGORÍA: Alimentación

EN CATEGORY: Eating

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Shopping, cooking and eating are too much to organise in one day”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/organizar-compra-cocinar-y-comer-es-demasiado-en-el-mismo-dia/

EN PATH: /en/situations/shopping-cooking-and-eating-are-too-much-to-organise-in-one-day/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-128

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Reviso varias veces si he cerrado la puerta»

EN TITLE: “I check several times whether I locked the door”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I check several times whether I locked the door”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/reviso-varias-veces-si-he-cerrado-la-puerta/

EN PATH: /en/situations/i-check-several-times-whether-i-locked-the-door/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-129

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Vuelvo atrás para comprobar si he apagado algo»

EN TITLE: “I go back to check whether I switched something off”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I go back to check whether I switched something off”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/vuelvo-atras-para-comprobar-si-he-apagado-algo/

EN PATH: /en/situations/i-go-back-to-check-whether-i-switched-something-off/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-130

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito repetir una acción hasta que se siente bien»

EN TITLE: “I need to repeat an action until it feels right”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need to repeat an action until it feels right”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-repetir-una-accion-hasta-que-se-siente-bien/

EN PATH: /en/situations/i-need-to-repeat-an-action-until-it-feels-right/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-131

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Si aparece un pensamiento horrible temo que diga algo sobre mí»

EN TITLE: “When a horrible thought appears, I fear it says something about me”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “When a horrible thought appears, I fear it says something about me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/si-aparece-un-pensamiento-horrible-temo-que-diga-algo-sobre-mi/

EN PATH: /en/situations/when-a-horrible-thought-appears-i-fear-it-says-something-about-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-132

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta dejar una tarea si no siento que está perfecta»

EN TITLE: “I struggle to stop a task if it does not feel perfect”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to stop a task if it does not feel perfect”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-dejar-una-tarea-si-no-siento-que-esta-perfecta/

EN PATH: /en/situations/i-struggle-to-stop-a-task-if-it-does-not-feel-perfect/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-133

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Pregunto lo mismo varias veces para quedarme tranquila»

EN TITLE: “I ask the same thing several times to feel reassured”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I ask the same thing several times to feel reassured”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/pregunto-lo-mismo-varias-veces-para-quedarme-tranquila/

EN PATH: /en/situations/i-ask-the-same-thing-several-times-to-feel-reassured/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-134

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Busco en internet durante horas para asegurarme de que no pasa nada»

EN TITLE: “I search online for hours to make sure nothing is wrong”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I search online for hours to make sure nothing is wrong”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/busco-en-internet-durante-horas-para-asegurarme-de-que-no-pasa-nada/

EN PATH: /en/situations/i-search-online-for-hours-to-make-sure-nothing-is-wrong/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-135

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Repaso una conversación durante horas»

EN TITLE: “I replay a conversation for hours”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I replay a conversation for hours”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/repaso-una-conversacion-durante-horas/

EN PATH: /en/situations/i-replay-a-conversation-for-hours/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-136

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito saber con exactitud qué va a ocurrir»

EN TITLE: “I need to know exactly what is going to happen”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need to know exactly what is going to happen”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-saber-con-exactitud-que-va-a-ocurrir/

EN PATH: /en/situations/i-need-to-know-exactly-what-is-going-to-happen/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-137

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Si no puedo comprobar algo me cuesta pensar en otra cosa»

EN TITLE: “If I cannot check something, I struggle to think about anything else”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “If I cannot check something, I struggle to think about anything else”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/si-no-puedo-comprobar-algo-me-cuesta-pensar-en-otra-cosa/

EN PATH: /en/situations/if-i-cannot-check-something-i-struggle-to-think-about-anything-else/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-138

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me preocupa haber hecho daño sin darme cuenta»

EN TITLE: “I worry I may have harmed someone without realising”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I worry I may have harmed someone without realising”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-preocupa-haber-hecho-dano-sin-darme-cuenta/

EN PATH: /en/situations/i-worry-i-may-have-harmed-someone-without-realising/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-139

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Guardo capturas o mensajes por miedo a necesitar demostrar algo»

EN TITLE: “I keep screenshots or messages in case I need to prove something later”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I keep screenshots or messages in case I need to prove something later”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/guardo-capturas-o-mensajes-por-miedo-a-necesitar-demostrar-algo/

EN PATH: /en/situations/i-keep-screenshots-or-messages-in-case-i-need-to-prove-something-later/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-140

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta tirar objetos por si los necesito después»

EN TITLE: “I struggle to throw things away in case I need them later”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to throw things away in case I need them later”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-tirar-objetos-por-si-los-necesito-despues/

EN PATH: /en/situations/i-struggle-to-throw-things-away-in-case-i-need-them-later/

ESTADO: BILINGUAL_COMPLETE

---

## 31.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 140 situaciones bilingües completas del catálogo principal.

EN: The same master MD now contains 140 complete bilingual situations from the main catalogue.

SIGUIENTE REGISTRO: WEB-SITUATION-141

# 32. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-141

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Repito mentalmente palabras o frases para sentirme segura»

EN TITLE: “I repeat words or phrases in my head to feel safe”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I repeat words or phrases in my head to feel safe”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/repito-mentalmente-palabras-o-frases-para-sentirme-segura/

EN PATH: /en/situations/i-repeat-words-or-phrases-in-my-head-to-feel-safe/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-142

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Evito ciertos números, palabras o imágenes porque me generan miedo»

EN TITLE: “I avoid certain numbers, words or images because they frighten me”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I avoid certain numbers, words or images because they frighten me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/evito-ciertos-numeros-palabras-o-imagenes-porque-me-generan-miedo/

EN PATH: /en/situations/i-avoid-certain-numbers-words-or-images-because-they-frighten-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-143

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me preocupa contaminar algo o contaminarme»

EN TITLE: “I worry about contaminating something or becoming contaminated”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I worry about contaminating something or becoming contaminated”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-preocupa-contaminar-algo-o-contaminarme/

EN PATH: /en/situations/i-worry-about-contaminating-something-or-becoming-contaminated/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-144

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Lavarme o limpiar me lleva mucho más tiempo del que quiero»

EN TITLE: “Washing or cleaning takes much longer than I want it to”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Washing or cleaning takes much longer than I want it to”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/lavarme-o-limpiar-me-lleva-mucho-mas-tiempo-del-que-quiero/

EN PATH: /en/situations/washing-or-cleaning-takes-much-longer-than-i-want-it-to/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-145

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta distinguir una precaución razonable de una comprobación excesiva»

EN TITLE: “I find it hard to tell a reasonable precaution from excessive checking”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to tell a reasonable precaution from excessive checking”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-distinguir-una-precaucion-razonable-de-una-comprobacion-excesiva/

EN PATH: /en/situations/i-find-it-hard-to-tell-a-reasonable-precaution-from-excessive-checking/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-146

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Una duda pequeña crece hasta ocuparme todo el día»

EN TITLE: “A small doubt grows until it takes over my whole day”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “A small doubt grows until it takes over my whole day”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/una-duda-pequena-crece-hasta-ocuparme-todo-el-dia/

EN PATH: /en/situations/a-small-doubt-grows-until-it-takes-over-my-whole-day/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-147

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito que otra persona me confirme que no he hecho nada malo»

EN TITLE: “I need someone else to confirm that I have done nothing wrong”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need someone else to confirm that I have done nothing wrong”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-que-otra-persona-me-confirme-que-no-he-hecho-nada-malo/

EN PATH: /en/situations/i-need-someone-else-to-confirm-that-i-have-done-nothing-wrong/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-148

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Después de decidir algo vuelvo a empezar la decisión desde cero»

EN TITLE: “After making a decision, I start the decision all over again”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “After making a decision, I start the decision all over again”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/despues-de-decidir-algo-vuelvo-a-empezar-la-decision-desde-cero/

EN PATH: /en/situations/after-making-a-decision-i-start-the-decision-all-over-again/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-149

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta dejar una pregunta sin respuesta»

EN TITLE: “I struggle to leave a question unanswered”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to leave a question unanswered”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-dejar-una-pregunta-sin-respuesta/

EN PATH: /en/situations/i-struggle-to-leave-a-question-unanswered/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-150

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Si algo no está colocado como esperaba no puedo dejar de mirarlo»

EN TITLE: “If something is not placed as I expected, I cannot stop looking at it”

ES CATEGORÍA: Preocupación y comprobaciones

EN CATEGORY: Worry and checking

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “If something is not placed as I expected, I cannot stop looking at it”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/si-algo-no-esta-colocado-como-esperaba-no-puedo-dejar-de-mirarlo/

EN PATH: /en/situations/if-something-is-not-placed-as-i-expected-i-cannot-stop-looking-at-it/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-151

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito recuperarme después de una conversación difícil»

EN TITLE: “I need time to recover after a difficult conversation”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need time to recover after a difficult conversation”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-recuperarme-despues-de-una-conversacion-dificil/

EN PATH: /en/situations/i-need-time-to-recover-after-a-difficult-conversation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-152

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta saber si una amistad sigue estando bien»

EN TITLE: “I find it hard to know whether a friendship is still okay”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to know whether a friendship is still okay”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-saber-si-una-amistad-sigue-estando-bien/

EN PATH: /en/situations/i-find-it-hard-to-know-whether-a-friendship-is-still-okay/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-153

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «No sé cuándo alguien espera que le escriba»

EN TITLE: “I do not know when someone expects me to message them”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I do not know when someone expects me to message them”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/no-se-cuando-alguien-espera-que-le-escriba/

EN PATH: /en/situations/i-do-not-know-when-someone-expects-me-to-message-them/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-154

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta poner límites hasta que ya estoy agotada»

EN TITLE: “I struggle to set boundaries until I am already exhausted”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to set boundaries until I am already exhausted”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-poner-limites-hasta-que-ya-estoy-agotada/

EN PATH: /en/situations/i-struggle-to-set-boundaries-until-i-am-already-exhausted/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-155

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Digo que sí para evitar un conflicto y luego no puedo con ello»

EN TITLE: “I say yes to avoid conflict and then cannot cope with it”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I say yes to avoid conflict and then cannot cope with it”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/digo-que-si-para-evitar-un-conflicto-y-luego-no-puedo-con-ello/

EN PATH: /en/situations/i-say-yes-to-avoid-conflict-and-then-cannot-cope-with-it/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-156

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta saber si alguien está enfadado conmigo»

EN TITLE: “I find it hard to know whether someone is angry with me”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to know whether someone is angry with me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-saber-si-alguien-esta-enfadado-conmigo/

EN PATH: /en/situations/i-find-it-hard-to-know-whether-someone-is-angry-with-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-157

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito planes concretos para quedar con alguien»

EN TITLE: “I need concrete plans when meeting someone”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need concrete plans when meeting someone”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-planes-concretos-para-quedar-con-alguien/

EN PATH: /en/situations/i-need-concrete-plans-when-meeting-someone/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-158

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Las visitas inesperadas me descolocan»

EN TITLE: “Unexpected visits throw me off”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Unexpected visits throw me off”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/las-visitas-inesperadas-me-descolocan/

EN PATH: /en/situations/unexpected-visits-throw-me-off/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-159

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta mantener contacto con personas que no veo»

EN TITLE: “I struggle to stay in touch with people I do not see”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to stay in touch with people I do not see”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-mantener-contacto-con-personas-que-no-veo/

EN PATH: /en/situations/i-struggle-to-stay-in-touch-with-people-i-do-not-see/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-160

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Después de una discusión necesito mucho tiempo para volver a hablar»

EN TITLE: “After an argument I need a long time before I can talk again”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “After an argument I need a long time before I can talk again”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/despues-de-una-discusion-necesito-mucho-tiempo-para-volver-a-hablar/

EN PATH: /en/situations/after-an-argument-i-need-a-long-time-before-i-can-talk-again/

ESTADO: BILINGUAL_COMPLETE

---

## 32.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 160 situaciones bilingües completas del catálogo principal.

EN: The same master MD now contains 160 complete bilingual situations from the main catalogue.

SIGUIENTE REGISTRO: WEB-SITUATION-161

# 33. CORPUS WEB · IRIS GREEN · CONTINUACIÓN

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-161

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta saber qué información contar en una primera conversación»

EN TITLE: “I find it hard to know what information to share in a first conversation”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to know what information to share in a first conversation”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-saber-que-informacion-contar-en-una-primera-conversacion/

EN PATH: /en/situations/i-find-it-hard-to-know-what-information-to-share-in-a-first-conversation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-162

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito estar sola después de un evento social»

EN TITLE: “I need to be alone after a social event”

ES CATEGORÍA: Relaciones

EN CATEGORY: Relationships

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need to be alone after a social event”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-estar-sola-despues-de-un-evento-social/

EN PATH: /en/situations/i-need-to-be-alone-after-a-social-event/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-163

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Empiezo muchas tareas y no termino ninguna»

EN TITLE: “I start many tasks and finish none of them”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I start many tasks and finish none of them”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/empiezo-muchas-tareas-y-no-termino-ninguna/

EN PATH: /en/situations/i-start-many-tasks-and-finish-none-of-them/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-164

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta priorizar cuando todo parece urgente»

EN TITLE: “I struggle to prioritise when everything feels urgent”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to prioritise when everything feels urgent”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-priorizar-cuando-todo-parece-urgente/

EN PATH: /en/situations/i-struggle-to-prioritise-when-everything-feels-urgent/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-165

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Una interrupción me hace perder por completo el hilo»

EN TITLE: “An interruption makes me lose my train of thought completely”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “An interruption makes me lose my train of thought completely”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/una-interrupcion-me-hace-perder-por-completo-el-hilo/

EN PATH: /en/situations/an-interruption-makes-me-lose-my-train-of-thought-completely/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-166

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito más tiempo para cambiar de una reunión a otra»

EN TITLE: “I need more time to move from one meeting to another”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need more time to move from one meeting to another”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-mas-tiempo-para-cambiar-de-una-reunion-a-otra/

EN PATH: /en/situations/i-need-more-time-to-move-from-one-meeting-to-another/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-167

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Los correos se acumulan porque no sé cuál contestar primero»

EN TITLE: “Emails pile up because I do not know which one to answer first”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Emails pile up because I do not know which one to answer first”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/los-correos-se-acumulan-porque-no-se-cual-contestar-primero/

EN PATH: /en/situations/emails-pile-up-because-i-do-not-know-which-one-to-answer-first/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-168

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta empezar una tarea si las instrucciones son ambiguas»

EN TITLE: “I struggle to start a task when the instructions are ambiguous”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to start a task when the instructions are ambiguous”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-empezar-una-tarea-si-las-instrucciones-son-ambiguas/

EN PATH: /en/situations/i-struggle-to-start-a-task-when-the-instructions-are-ambiguous/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-169

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Trabajo bien con una fecha límite y me bloqueo sin ella»

EN TITLE: “I work well with a deadline and get stuck without one”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I work well with a deadline and get stuck without one”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/trabajo-bien-con-una-fecha-limite-y-me-bloqueo-sin-ella/

EN PATH: /en/situations/i-work-well-with-a-deadline-and-get-stuck-without-one/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-170

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta calcular cuánto tiempo me llevará una tarea»

EN TITLE: “I find it hard to estimate how long a task will take”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I find it hard to estimate how long a task will take”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-calcular-cuanto-tiempo-me-llevara-una-tarea/

EN PATH: /en/situations/i-find-it-hard-to-estimate-how-long-a-task-will-take/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-171

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Una oficina abierta me deja sin energía»

EN TITLE: “An open-plan office drains my energy”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “An open-plan office drains my energy”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/una-oficina-abierta-me-deja-sin-energia/

EN PATH: /en/situations/an-open-plan-office-drains-my-energy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-172

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Las reuniones sin agenda me resultan muy difíciles»

EN TITLE: “Meetings without an agenda are very difficult for me”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Meetings without an agenda are very difficult for me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/las-reuniones-sin-agenda-me-resultan-muy-dificiles/

EN PATH: /en/situations/meetings-without-an-agenda-are-very-difficult-for-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-173

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito preparar con antelación lo que voy a decir en una reunión»

EN TITLE: “I need to prepare in advance what I will say in a meeting”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need to prepare in advance what I will say in a meeting”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-preparar-con-antelacion-lo-que-voy-a-decir-en-una-reunion/

EN PATH: /en/situations/i-need-to-prepare-in-advance-what-i-will-say-in-a-meeting/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-174

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta pedir ayuda antes de estar al límite»

EN TITLE: “I struggle to ask for help before I am at my limit”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to ask for help before I am at my limit”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-pedir-ayuda-antes-de-estar-al-limite/

EN PATH: /en/situations/i-struggle-to-ask-for-help-before-i-am-at-my-limit/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-175

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Después de estudiar o trabajar necesito horas para recuperarme»

EN TITLE: “After studying or working, I need hours to recover”

ES CATEGORÍA: Estudios y trabajo

EN CATEGORY: Education and work

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “After studying or working, I need hours to recover”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/despues-de-estudiar-o-trabajar-necesito-horas-para-recuperarme/

EN PATH: /en/situations/after-studying-or-working-i-need-hours-to-recover/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-176

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Salir de casa me lleva mucho más tiempo de lo que calculo»

EN TITLE: “Leaving the house takes much longer than I expect”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Leaving the house takes much longer than I expect”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/salir-de-casa-me-lleva-mucho-mas-tiempo-de-lo-que-calculo/

EN PATH: /en/situations/leaving-the-house-takes-much-longer-than-i-expect/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-177

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Hacer una llamada para pedir una cita se me hace enorme»

EN TITLE: “Making a phone call to book an appointment feels enormous”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Making a phone call to book an appointment feels enormous”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/hacer-una-llamada-para-pedir-una-cita-se-me-hace-enorme/

EN PATH: /en/situations/making-a-phone-call-to-book-an-appointment-feels-enormous/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-178

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Se me acumulan tareas pequeñas hasta que parecen imposibles»

EN TITLE: “Small tasks pile up until they feel impossible”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Small tasks pile up until they feel impossible”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/se-me-acumulan-tareas-pequenas-hasta-que-parecen-imposibles/

EN PATH: /en/situations/small-tasks-pile-up-until-they-feel-impossible/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-179

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta mantener una rutina de higiene cuando estoy saturada»

EN TITLE: “I struggle to keep up a hygiene routine when I am overloaded”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to keep up a hygiene routine when I am overloaded”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-mantener-una-rutina-de-higiene-cuando-estoy-saturada/

EN PATH: /en/situations/i-struggle-to-keep-up-a-hygiene-routine-when-i-am-overloaded/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-180

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Ir a comprar me consume la energía del resto del día»

EN TITLE: “Going shopping uses up the energy I have for the rest of the day”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Going shopping uses up the energy I have for the rest of the day”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/ir-a-comprar-me-consume-la-energia-del-resto-del-dia/

EN PATH: /en/situations/going-shopping-uses-up-the-energy-i-have-for-the-rest-of-the-day/

ESTADO: BILINGUAL_COMPLETE

---

## 33.1 CONTROL DE PROGRESO

ES: El mismo MD maestro contiene ya 180 situaciones bilingües completas del catálogo principal.

EN: The same master MD now contains 180 complete bilingual situations from the main catalogue.

SIGUIENTE REGISTRO: WEB-SITUATION-181

# 34. CORPUS WEB · IRIS GREEN · CIERRE DE SITUACIONES Y COMIENZO DE CONDICIONES

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-SITUATION-181

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Una avería o trámite inesperado me bloquea»

EN TITLE: “An unexpected repair or admin task makes me freeze”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “An unexpected repair or admin task makes me freeze”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/una-averia-o-tramite-inesperado-me-bloquea/

EN PATH: /en/situations/an-unexpected-repair-or-admin-task-makes-me-freeze/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-182

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta organizar medicación, citas y documentos»

EN TITLE: “I struggle to organise medication, appointments and documents”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to organise medication, appointments and documents”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-organizar-medicacion-citas-y-documentos/

EN PATH: /en/situations/i-struggle-to-organise-medication-appointments-and-documents/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-183

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Necesito hacer las cosas de casa siempre en el mismo orden»

EN TITLE: “I need to do household tasks in the same order every time”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I need to do household tasks in the same order every time”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/necesito-hacer-las-cosas-de-casa-siempre-en-el-mismo-orden/

EN PATH: /en/situations/i-need-to-do-household-tasks-in-the-same-order-every-time/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-184

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Cambiar de ropa según el tiempo me resulta más difícil de lo que parece»

EN TITLE: “Changing clothes to match the weather is harder than it looks”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Changing clothes to match the weather is harder than it looks”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/cambiar-de-ropa-segun-el-tiempo-me-resulta-mas-dificil-de-lo-que-parece/

EN PATH: /en/situations/changing-clothes-to-match-the-weather-is-harder-than-it-looks/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-185

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Preparar una maleta me desborda»

EN TITLE: “Packing a suitcase overwhelms me”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “Packing a suitcase overwhelms me”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/preparar-una-maleta-me-desborda/

EN PATH: /en/situations/packing-a-suitcase-overwhelms-me/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-186

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Después de salir necesito un rato largo sin hablar con nadie»

EN TITLE: “After going out, I need a long time without talking to anyone”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “After going out, I need a long time without talking to anyone”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/despues-de-salir-necesito-un-rato-largo-sin-hablar-con-nadie/

EN PATH: /en/situations/after-going-out-i-need-a-long-time-without-talking-to-anyone/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-SITUATION-187

ES TIPO: Situación

EN TYPE: Situation

ES TÍTULO: «Me cuesta reconocer cuándo necesito descansar»

EN TITLE: “I struggle to recognise when I need to rest”

ES CATEGORÍA: Vida diaria

EN CATEGORY: Daily life

ES RESUMEN: Esta ficha parte de una situación cotidiana concreta y organiza qué observar, qué puede ayudar y cuándo conviene pedir apoyo.

EN SUMMARY: This page starts from the everyday situation “I struggle to recognise when I need to rest”. It helps separate what triggers it, what makes it harder, and which concrete changes may make it more manageable.

ES RUTA: /es/situaciones/me-cuesta-reconocer-cuando-necesito-descansar/

EN PATH: /en/situations/i-struggle-to-recognise-when-i-need-to-rest/

ESTADO: BILINGUAL_COMPLETE

---

## 34.1 CIERRE DE SITUACIONES

ES: Catálogo de situaciones completado: 187 de 187 registros bilingües.

EN: Situations catalogue completed: 187 of 187 bilingual records.

ESTADO: SECTION_COMPLETE

---

# 35. CORPUS WEB · IRIS GREEN · CONDICIONES

Estado: EN_PROGRESO

## WEB-CONDITION-001

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Abuso y explotación

EN TITLE: Abuse and exploitation

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Alguien se aprovecha de la confianza o de la dependencia. Qué señales mirar, cómo pedir ayuda y por qué la culpa nunca es de quien lo sufre.

EN SUMMARY: Someone takes advantage of another person’s trust or dependence. What signs to look for, how to ask for help and why responsibility never lies with the person being harmed.

ES RUTA: /es/neurodiversidad/condiciones/abuso-y-explotacion/

EN PATH: /en/neurodiversity/conditions/abuse-and-exploitation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-002

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Acceso a apoyos

EN TITLE: Access to support

ES CLASIFICACIÓN: apoyo

EN CLASSIFICATION: support

ES RESUMEN: Pedir un apoyo y perderse en el trámite. Qué hace falta para solicitarlo, qué acompañamiento existe y por qué no hay que demostrar sufrimiento para conseguirlo.

EN SUMMARY: Asking for support and getting lost in the process. What may be needed to apply, what help with the process may exist and why a person should not have to prove suffering in order to receive support.

ES RUTA: /es/neurodiversidad/condiciones/acceso-a-apoyos/

EN PATH: /en/neurodiversity/conditions/access-to-support/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-003

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Acoso escolar / bullying

EN TITLE: School bullying

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Cuando ir a clase se vuelve un problema de seguridad. Qué es acoso y qué no, qué tiene que hacer el centro y qué no funciona pese a lo que se repite.

EN SUMMARY: When going to school becomes a safety issue. What bullying is and is not, what the school is responsible for doing, and which commonly repeated responses do not solve the problem.

ES RUTA: /es/neurodiversidad/condiciones/acoso-escolar-bullying/

EN PATH: /en/neurodiversity/conditions/school-bullying/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-004

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Actividad física y movimiento

EN TITLE: Physical activity and movement

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Moverse cuando el cuerpo y la energía no acompañan igual cada día. Qué opciones hay, cómo elegir según salud y preferencias, y qué no promete el ejercicio.

EN SUMMARY: Moving when the body and energy do not feel the same every day. What options exist, how to choose according to health and preferences, and what exercise cannot promise.

ES RUTA: /es/neurodiversidad/condiciones/actividad-fisica-y-movimiento/

EN PATH: /en/neurodiversity/conditions/physical-activity-and-movement/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-005

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Agénero

EN TITLE: Agender

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: No tener género, o tener una relación distinta con él. Qué describe la palabra agénero y cómo se rellena un formulario o se saluda sin dar por hecho un género.

EN SUMMARY: Having no gender, or having a different relationship with gender. What the word agender describes and how forms or greetings can avoid assuming someone’s gender.

ES RUTA: /es/neurodiversidad/condiciones/agenero/

EN PATH: /en/neurodiversity/conditions/agender/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-006

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Agorafobia

EN TITLE: Agoraphobia

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Evitar salir, el metro, las colas, los sitios sin salida fácil. Qué es la agorafobia, cómo se reconoce y qué tratamiento ayuda, con la guía clínica citada.

EN SUMMARY: Avoiding going out, public transport, queues or places where leaving may feel difficult. What agoraphobia is, how it is recognised and what treatment can help, with the clinical guideline identified.

ES RUTA: /es/neurodiversidad/condiciones/agorafobia/

EN PATH: /en/neurodiversity/conditions/agoraphobia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-007

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Alexitimia

EN TITLE: Alexithymia

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: Notar algo en el cuerpo y no saber ponerle nombre. Qué describe la alexitimia, cómo preguntar de otra forma y qué se sabe hasta hoy sobre este proceso.

EN SUMMARY: Noticing something in the body but finding it difficult to name. What alexithymia describes, how questions can be asked differently and what is currently known about this process.

ES RUTA: /es/neurodiversidad/condiciones/alexitimia/

EN PATH: /en/neurodiversity/conditions/alexithymia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-008

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Alta sensibilidad / SPS

EN TITLE: Sensory processing sensitivity / SPS

ES CLASIFICACIÓN: emergente

EN CLASSIFICATION: emerging

ES RESUMEN: Notarlo todo antes y más fuerte que los demás. Qué describe la alta sensibilidad, por qué no es un diagnóstico y qué se sabe hasta hoy de este rasgo.

EN SUMMARY: Noticing everything sooner and more intensely than other people. What sensory processing sensitivity describes, why it is not a diagnosis, and what is known so far about this trait.

ES RUTA: /es/neurodiversidad/condiciones/alta-sensibilidad-sps/

EN PATH: /en/neurodiversity/conditions/sensory-processing-sensitivity-sps/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-009

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Altas capacidades

EN TITLE: Giftedness / high ability

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Aprender rápido y aburrirse el resto del tiempo. Qué son las altas capacidades, qué ajustes de currículo y ritmo ayudan, y qué necesita lo emocional.

EN SUMMARY: Learning quickly and being bored the rest of the time. What giftedness / high ability is, which curriculum and pace adjustments can help, and which emotional needs may require attention.

ES RUTA: /es/neurodiversidad/condiciones/altas-capacidades/

EN PATH: /en/neurodiversity/conditions/giftedness-high-ability/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-010

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Amistad

EN TITLE: Friendship

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Pocos amigos, contacto espaciado y la sensación de estar en deuda. Qué hace que una amistad funcione, qué acordar y cuándo pocos vínculos no son un problema.

EN SUMMARY: Having few friends, less frequent contact or a sense of owing people more contact than feels manageable. What helps a friendship work, what can be agreed explicitly and when having only a few relationships is not a problem.

ES RUTA: /es/neurodiversidad/condiciones/amistad/

EN PATH: /en/neurodiversity/conditions/friendship/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-011

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Amnesia disociativa

EN TITLE: Dissociative amnesia

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Lagunas de memoria que no encajan con un olvido normal. Qué es la amnesia disociativa, cómo se valora y por qué no se buscan recuerdos por sugestión.

EN SUMMARY: Memory gaps that go beyond ordinary forgetting. What dissociative amnesia is, how it is assessed and why memories should not be sought through suggestion.

ES RUTA: /es/neurodiversidad/condiciones/amnesia-disociativa/

EN PATH: /en/neurodiversity/conditions/dissociative-amnesia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-012

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Animales

EN TITLE: Animals

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Un animal en casa cambia el día entero. Qué planificar antes de decidir y por qué las intervenciones con animales no sustituyen un tratamiento.

EN SUMMARY: Living with an animal can change everyday routines. What to plan before deciding and why animal-assisted interventions do not replace established treatment.

ES RUTA: /es/neurodiversidad/condiciones/animales/

EN PATH: /en/neurodiversity/conditions/animals/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-013

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Anorexia nerviosa

EN TITLE: Anorexia nervosa

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Comer cada vez menos y no ver el peligro. Qué es la anorexia nerviosa, cómo se valora el riesgo y qué atención tiene respaldo, con la NICE NG69 citada.

EN SUMMARY: Eating less and less without seeing the danger. What anorexia nervosa is, how risk is assessed, and what care is evidence-based, with NICE NG69 cited.

ES RUTA: /es/neurodiversidad/condiciones/anorexia-nerviosa/

EN PATH: /en/neurodiversity/conditions/anorexia-nervosa/

ESTADO: BILINGUAL_COMPLETE

---

## 35.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 13/185.

EN: Situations complete: 187/187. Conditions added: 13/185.

SIGUIENTE REGISTRO: WEB-CONDITION-014

# 36. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-014

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Ansiedad

EN TITLE: Anxiety

ES CLASIFICACIÓN: salud mental

EN CLASSIFICATION: mental health

ES RESUMEN: El cuerpo en alerta sin peligro delante. Qué es la ansiedad, qué tratamientos psicológicos tienen eficacia demostrada y por qué evitar alivia y mantiene.

EN SUMMARY: The body on alert with no danger in front of you. What anxiety is, which psychological treatments have demonstrated effectiveness, and why avoidance brings relief and maintains the problem.

ES RUTA: /es/neurodiversidad/condiciones/ansiedad/

EN PATH: /en/neurodiversity/conditions/anxiety/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-015

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno de ansiedad generalizada (TAG)

EN TITLE: Generalised anxiety disorder (GAD)

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Preocupación que no se apaga y cuerpo en tensión todo el día. Qué es el TAG, cómo se reconoce y qué tratamientos ayudan, con la NICE CG113 citada.

EN SUMMARY: Worry that does not switch off and a body that stays tense all day. What GAD is, how it is recognised and which treatments help, with NICE CG113 cited.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-de-ansiedad-generalizada-tag/

EN PATH: /en/neurodiversity/conditions/generalised-anxiety-disorder-gad/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-016

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno de ansiedad por separación

EN TITLE: Separation anxiety disorder

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Angustia al separarse de quien da seguridad, más allá de lo esperable. Qué es la ansiedad por separación, cómo se reconoce y qué ayuda en casa y en el colegio.

EN SUMMARY: Distress when separated from the person who provides safety, beyond what would be expected. What separation anxiety is, how it is recognised and what helps at home and at school.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-de-ansiedad-por-separacion/

EN PATH: /en/neurodiversity/conditions/separation-anxiety-disorder/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-017

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno de ansiedad social

EN TITLE: Social anxiety disorder

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Miedo a que te miren, a hablar, a quedar en evidencia. Qué es la ansiedad social, en qué se distingue de la timidez y qué ayuda, con la NICE CG159.

EN SUMMARY: Fear of being watched, speaking or being embarrassed. What social anxiety is, how it differs from shyness and what helps, with NICE CG159 cited.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-de-ansiedad-social/

EN PATH: /en/neurodiversity/conditions/social-anxiety-disorder/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-018

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Apraxia del habla infantil

EN TITLE: Childhood apraxia of speech

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Sabe qué quiere decir y la boca no obedece. Qué es la apraxia del habla infantil, en qué se nota, cómo se valora y qué intervención ayuda, con ASHA citada.

EN SUMMARY: Knowing what you want to say, but your mouth does not cooperate. What childhood apraxia of speech is, how it can present, how it is assessed, and what intervention helps, with ASHA cited.

ES RUTA: /es/neurodiversidad/condiciones/apraxia-del-habla-infantil/

EN PATH: /en/neurodiversity/conditions/childhood-apraxia-of-speech/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-019

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: ARFID

EN TITLE: ARFID

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Comer muy poco o muy poca variedad, sin que sea por el peso. Qué es el ARFID, por qué la seguridad nutricional va primero y qué se sabe hasta hoy.

EN SUMMARY: Eating very little or having very little variety, without weight being the reason. What ARFID is, why nutritional safety comes first, and what is known so far.

ES RUTA: /es/neurodiversidad/condiciones/arfid/

EN PATH: /en/neurodiversity/conditions/arfid/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-020

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Aromanticismo

EN TITLE: Aromanticism

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: El enamoramiento no aparece, y no falta nada. Qué describe el aromanticismo y qué pasa cuando un trámite pide una pareja como contacto o beneficiario.

EN SUMMARY: Experiencing little or no romantic attraction does not mean anything is missing. What aromanticism describes and what happens when a form assumes that everyone has a partner as a contact or beneficiary.

ES RUTA: /es/neurodiversidad/condiciones/aromanticismo/

EN PATH: /en/neurodiversity/conditions/aromanticism/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-021

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Arte y creación

EN TITLE: Art and creativity

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Crear por gusto, sin que se convierta en terapia ni en rendimiento. Qué hace falta para poder crear y en qué se diferencia de una intervención profesional.

EN SUMMARY: Creating for enjoyment without turning it into therapy or a performance measure. What makes creativity accessible and how an everyday creative activity differs from a professional intervention.

ES RUTA: /es/neurodiversidad/condiciones/arte-y-creacion/

EN PATH: /en/neurodiversity/conditions/art-and-creativity/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-022

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Asexualidad

EN TITLE: Asexuality

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Poca o ninguna atracción sexual, y no es un problema por sí solo. Qué describe la asexualidad y por qué en consulta se parte de que es una orientación.

EN SUMMARY: Experiencing little or no sexual attraction is not, by itself, a problem. What asexuality describes and why healthcare should start from the understanding that it is an orientation, not a symptom.

ES RUTA: /es/neurodiversidad/condiciones/asexualidad/

EN PATH: /en/neurodiversity/conditions/asexuality/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-023

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Dificultades de asistencia escolar

EN TITLE: School attendance difficulties

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Cuando ir al colegio se hace imposible. Los tipos de problema de asistencia, por qué la distinción cambia la respuesta y qué tiene que hacer el centro.

EN SUMMARY: When getting to or staying in school becomes extremely difficult. The different forms attendance problems can take, why the distinction changes the response and what the school needs to do.

ES RUTA: /es/neurodiversidad/condiciones/dificultades-de-asistencia-escolar/

EN PATH: /en/neurodiversity/conditions/school-attendance-difficulties/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-024

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Ataque de pánico

EN TITLE: Panic attack

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: El corazón se desboca y el cuerpo se descontrola. Qué es un ataque de pánico, en qué se diferencia del trastorno y qué hacer, con la NICE CG113 citada.

EN SUMMARY: The heart races and the body feels out of control. What a panic attack is, how it differs from panic disorder, and what to do, with NICE CG113 cited.

ES RUTA: /es/neurodiversidad/condiciones/ataque-de-panico/

EN PATH: /en/neurodiversity/conditions/panic-attack/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-025

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno por atracón

EN TITLE: Binge-eating disorder

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Comer mucho, rápido y a solas, con la sensación de no poder parar. Qué es el trastorno por atracón y qué tiene respaldo, con la NICE NG69 citada.

EN SUMMARY: Eating a large amount, quickly and alone, with the feeling of being unable to stop. What binge-eating disorder is and what is supported by evidence, with NICE NG69 cited.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-por-atracon/

EN PATH: /en/neurodiversity/conditions/binge-eating-disorder/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-026

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: AuDHD

EN TITLE: AuDHD

ES CLASIFICACIÓN: emergente

EN CLASSIFICATION: emerging

ES RESUMEN: Autismo y TDAH a la vez, tirando en direcciones distintas. Qué se sabe de esa coexistencia y por qué todavía no hay base para un perfil AuDHD diferenciado.

EN SUMMARY: Autism and ADHD can coexist in the same person. What is known about that co-occurrence and why there is still not enough evidence to define a separate AuDHD profile.

ES RUTA: /es/neurodiversidad/condiciones/audhd/

EN PATH: /en/neurodiversity/conditions/audhd/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-027

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autismo

EN TITLE: Autism

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Diferencias en la comunicación, la interacción y la forma de percibir el entorno. Cómo se valora el autismo y cómo elegir apoyos según las necesidades de cada persona.

EN SUMMARY: Autism is a neurodevelopmental condition. It can involve differences in communication and social interaction, repeated movements or activities, a need for predictability and particular sensory responses. It is present from early development, even when recognised in adulthood. Abilities and support needs differ between people and can change over time.

ES RUTA: /es/neurodiversidad/condiciones/autismo/

EN PATH: /en/neurodiversity/conditions/autism/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-028

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autoaceptación

EN TITLE: Self-acceptance

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Dejar de pelearse con uno mismo sin renunciar a nada. Qué describe la autoaceptación y por qué no significa dejar los apoyos ni el tratamiento.

EN SUMMARY: Making peace with aspects of oneself without giving up support, treatment or desired change. What self-acceptance describes and what it does not mean.

ES RUTA: /es/neurodiversidad/condiciones/autoaceptacion/

EN PATH: /en/neurodiversity/conditions/self-acceptance/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-029

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autocompasión

EN TITLE: Self-compassion

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Tratarse con el trato que se le daría a otra persona. Qué describe la autocompasión, qué cambia en la práctica y por qué no es justificar el daño a nadie.

EN SUMMARY: Treating oneself with some of the care one would offer another person. What self-compassion describes, what it changes in practice and why it does not mean excusing harm.

ES RUTA: /es/neurodiversidad/condiciones/autocompasion/

EN PATH: /en/neurodiversity/conditions/self-compassion/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-030

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autoconcepto

EN TITLE: Self-concept

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: La idea que cada uno tiene de sí mismo, y de dónde salió. Qué la forma, qué entornos la sostienen y por qué ninguna puntuación resume quién es alguien.

EN SUMMARY: The picture a person has of themselves and how it developed. What shapes it, which environments can support it and why no score can summarise who someone is.

ES RUTA: /es/neurodiversidad/condiciones/autoconcepto/

EN PATH: /en/neurodiversity/conditions/self-concept/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-031

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autoconfianza

EN TITLE: Self-confidence

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Confiar en poder con algo, después de años de no poder. Qué la construye de verdad y por qué «cree más en ti» no corrige una barrera que existe.

EN SUMMARY: Confidence in being able to do something, especially after repeated difficulty or failure. What genuinely builds it and why «believe in yourself more» does not remove a real barrier.

ES RUTA: /es/neurodiversidad/condiciones/autoconfianza/

EN PATH: /en/neurodiversity/conditions/self-confidence/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-032

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autodefensa / self-advocacy

EN TITLE: Self-advocacy

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Pedir lo que se necesita sin tener que pelear cada vez. Qué información hace falta, cómo prepararse y por qué la accesibilidad no es carga de quien la necesita.

EN SUMMARY: Asking for what is needed without having to fight for it every time. What information helps, how to prepare and why accessibility should not become the sole responsibility of the person who needs it.

ES RUTA: /es/neurodiversidad/condiciones/autodefensa-self-advocacy/

EN PATH: /en/neurodiversity/conditions/self-advocacy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-033

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autoestima

EN TITLE: Self-esteem

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Valer poco a los propios ojos, sin motivo aparente. Qué influye en la autoestima, qué relaciones la sostienen y por qué los elogios generales no la levantan.

EN SUMMARY: How much value a person places on themselves. What can influence self-esteem, which relationships support it and why general praise alone does not repair low self-worth.

ES RUTA: /es/neurodiversidad/condiciones/autoestima/

EN PATH: /en/neurodiversity/conditions/self-esteem/

ESTADO: BILINGUAL_COMPLETE

---

## 36.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 33/185.

EN: Situations complete: 187/187. Conditions added: 33/185.

SIGUIENTE REGISTRO: WEB-CONDITION-034

# 37. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-034

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Autonomía

EN TITLE: Autonomy

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Decidir sobre la propia vida, con el apoyo que haga falta. Qué es la autonomía, cómo se gradúan los apoyos y por qué no es hacerlo todo sin ayuda.

EN SUMMARY: Making decisions about one’s own life, with whatever support is needed. What autonomy means, how support can be graded and why autonomy does not require doing everything without help.

ES RUTA: /es/neurodiversidad/condiciones/autonomia/

EN PATH: /en/neurodiversity/conditions/autonomy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-035

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Bigénero

EN TITLE: Bigender

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Vivirse en dos géneros, a la vez o alternando. Qué describe la palabra bigénero y qué falla cuando un sistema solo guarda un valor de género.

EN SUMMARY: Experiencing two genders, either at the same time or at different times. What bigender describes and what goes wrong when a system allows only one permanent gender value.

ES RUTA: /es/neurodiversidad/condiciones/bigenero/

EN PATH: /en/neurodiversity/conditions/bigender/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-036

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Bisexualidad

EN TITLE: Bisexuality

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Atracción hacia más de un género. Qué describe la bisexualidad y por qué el historial no debe reescribirse según la pareja que acompañe ese día.

EN SUMMARY: Attraction to more than one gender. What bisexuality describes and why a person’s records should not be rewritten according to the gender of the partner who happens to accompany them.

ES RUTA: /es/neurodiversidad/condiciones/bisexualidad/

EN PATH: /en/neurodiversity/conditions/bisexuality/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-037

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Bulimia nerviosa

EN TITLE: Bulimia nervosa

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Atracones y después la compensación, casi siempre en secreto. Qué es la bulimia nerviosa, cómo se reconoce y qué ayuda, con la NICE NG69 citada.

EN SUMMARY: Binge eating followed by compensatory behaviour, often in secret. What bulimia nervosa is, how it is recognised, and what helps, with NICE NG69 cited.

ES RUTA: /es/neurodiversidad/condiciones/bulimia-nerviosa/

EN PATH: /en/neurodiversity/conditions/bulimia-nervosa/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-038

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Burnout autista

EN TITLE: Autistic burnout

ES CLASIFICACIÓN: emergente

EN CLASSIFICATION: emerging

ES RESUMEN: Agotamiento que no se arregla durmiendo. Qué describen quienes lo viven, qué baja la carga de verdad y por qué aún no es una categoría diagnóstica validada.

EN SUMMARY: A form of severe exhaustion described by autistic people that is not simply resolved by sleep. What lived experience and research describe, what can reduce load and why it is not currently a validated diagnostic category.

ES RUTA: /es/neurodiversidad/condiciones/burnout-autista/

EN PATH: /en/neurodiversity/conditions/autistic-burnout/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-039

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: CAA / comunicación aumentativa y alternativa

EN TITLE: AAC / augmentative and alternative communication

ES CLASIFICACIÓN: apoyo

EN CLASSIFICATION: support

ES RESUMEN: Comunicar sin depender del habla. Qué es la CAA, qué sistemas existen y por qué darla no impide que el habla se desarrolle, al contrario de lo que se cree.

EN SUMMARY: Communicating without depending on speech. What AAC is, which systems exist and why providing AAC does not prevent speech from developing.

ES RUTA: /es/neurodiversidad/condiciones/caa-comunicacion-aumentativa-y-alternativa/

EN PATH: /en/neurodiversity/conditions/aac-augmentative-and-alternative-communication/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-040

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Cambios familiares

EN TITLE: Family changes

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Una separación, una mudanza, un nacimiento, una pérdida. Qué anticipar, cómo explicarlo con información clara y qué apoyos ayudan durante el cambio.

EN SUMMARY: A separation, move, birth, bereavement or other major change can alter routines and relationships at the same time. What to anticipate, how to explain change clearly and what can help during the transition.

ES RUTA: /es/neurodiversidad/condiciones/cambios-familiares/

EN PATH: /en/neurodiversity/conditions/family-changes/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-041

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Carga cognitiva

EN TITLE: Cognitive load

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Demasiada información a la vez y el rendimiento se cae. Qué es la carga cognitiva, qué se puede reducir o externalizar y qué no demuestra sobre la capacidad.

EN SUMMARY: When too much information has to be handled at once, performance can drop. What cognitive load is, what can be reduced or externalised and what difficulty under high load does not prove about ability.

ES RUTA: /es/neurodiversidad/condiciones/carga-cognitiva/

EN PATH: /en/neurodiversity/conditions/cognitive-load/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-042

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Ciberacoso (cyberbullying)

EN TITLE: Cyberbullying

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: El acoso sigue en el móvil cuando ya se salió de clase. Qué guardar como prueba, a quién acudir y por qué cerrar las cuentas no es la solución.

EN SUMMARY: Bullying can continue online after the school day ends. What to keep as evidence, who to involve and why making the victim close their accounts is not the solution.

ES RUTA: /es/neurodiversidad/condiciones/ciberacoso-cyberbullying/

EN PATH: /en/neurodiversity/conditions/cyberbullying/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-043

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Cisgénero

EN TITLE: Cisgender

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Cuando la identidad coincide con el sexo asignado al nacer. Qué describe la palabra cisgénero, para qué sirve nombrarla y por qué no pide nada de nadie.

EN SUMMARY: When a person’s gender identity corresponds with the sex they were assigned at birth. What cisgender means, why naming it can be useful and why it does not make one identity more «normal» than another.

ES RUTA: /es/neurodiversidad/condiciones/cisgenero/

EN PATH: /en/neurodiversity/conditions/cisgender/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-044

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Citas médicas

EN TITLE: Medical appointments

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: La consulta se va sin haber contado lo importante. Cómo prepararla, qué pedir por escrito y por qué no mirar a los ojos no significa que no haya dolor.

EN SUMMARY: Leaving an appointment without having communicated what mattered. How to prepare, what to request in writing and why lack of eye contact does not mean a person is not in pain.

ES RUTA: /es/neurodiversidad/condiciones/citas-medicas/

EN PATH: /en/neurodiversity/conditions/medical-appointments/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-045

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Cocinar

EN TITLE: Cooking

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Cocinar reúne pasos, tiempos, calor y texturas a la vez. Qué se puede partir en trozos, qué utensilios ayudan y por qué no saber cocinar no mide la autonomía.

EN SUMMARY: Cooking combines steps, timing, heat and textures. What can be broken into smaller parts, which tools may help and why being unable to cook independently is not a measure of overall autonomy.

ES RUTA: /es/neurodiversidad/condiciones/cocinar/

EN PATH: /en/neurodiversity/conditions/cooking/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-046

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Compras

EN TITLE: Shopping

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: La lista, el dinero, las luces, la cola y las decisiones, todo junto. Qué se puede preparar antes, qué ajustes ayudan y en qué momento conviene otra fórmula.

EN SUMMARY: The list, money, lights, queues and decisions can all arrive at once. What can be prepared beforehand, which adjustments may help and when another way of shopping may be better.

ES RUTA: /es/neurodiversidad/condiciones/compras/

EN PATH: /en/neurodiversity/conditions/shopping/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-047

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Comunicación en pareja

EN TITLE: Communication in a relationship

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Hablar sin entenderse, aunque haya buena intención. Qué hacer explícito, cómo pedir tiempo de procesamiento y por qué una diferencia no es falta de empatía.

EN SUMMARY: Talking without understanding each other even when both people have good intentions. What to make explicit, how to ask for processing time and why a communication difference is not the same as lack of empathy.

ES RUTA: /es/neurodiversidad/condiciones/comunicacion-en-pareja/

EN PATH: /en/neurodiversity/conditions/communication-in-a-relationship/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-048

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Comunicación sin habla oral

EN TITLE: Communication without spoken language

ES CLASIFICACIÓN: apoyo

EN CLASSIFICATION: support

ES RESUMEN: Entender todo y no poder decirlo con la voz. Qué vías de comunicación existen y por qué no hablar no significa comprender menos ni consentir menos.

EN SUMMARY: A person may understand but be unable or unwilling to communicate through speech at a particular time or in general. Which communication routes can be available and why speech must not be used as proof of understanding or consent.

ES RUTA: /es/neurodiversidad/condiciones/comunicacion-sin-habla-oral/

EN PATH: /en/neurodiversity/conditions/communication-without-spoken-language/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-049

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Conducir

EN TITLE: Driving

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Sacarse el carné o volver al volante con dudas. Qué se valora de verdad, qué adaptaciones existen y por qué un diagnóstico no decide por sí solo.

EN SUMMARY: Learning to drive or returning to driving can raise questions. What should actually be assessed, which adaptations exist and why a diagnosis alone does not decide whether someone can drive safely.

ES RUTA: /es/neurodiversidad/condiciones/conducir/

EN PATH: /en/neurodiversity/conditions/driving/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-050

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastornos de la conducta alimentaria (TCA)

EN TITLE: Eating disorders

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Cuando la comida ocupa el centro y el cuerpo avisa. Qué son los trastornos alimentarios, qué tipos hay y qué atención necesita cada uno, con la NG69.

EN SUMMARY: When food takes over and the body starts to show the effects. What eating disorders are, which types exist and what care each one needs, with NG69 cited.

ES RUTA: /es/neurodiversidad/condiciones/trastornos-de-la-conducta-alimentaria-tca/

EN PATH: /en/neurodiversity/conditions/eating-disorders/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-051

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Conflictos

EN TITLE: Conflict

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Discutir sin que se rompa nada. Cómo separar hechos, necesidades y límites, cuándo hacer una pausa y por qué evitar todo conflicto no da seguridad.

EN SUMMARY: Disagreement does not have to mean a relationship is unsafe or broken. How to separate facts, needs and boundaries, when to pause and why avoiding every conflict does not create safety.

ES RUTA: /es/neurodiversidad/condiciones/conflictos/

EN PATH: /en/neurodiversity/conditions/conflict/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-052

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Consentimiento

EN TITLE: Consent

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Decir sí de verdad, y poder decir no en cualquier momento. Qué hace válido un consentimiento y por qué el silencio o un sí anterior no cuentan como uno.

EN SUMMARY: A genuine yes includes the ability to say no and to change one’s mind. What makes consent valid and why silence, freezing or a previous yes do not amount to current consent.

ES RUTA: /es/neurodiversidad/condiciones/consentimiento/

EN PATH: /en/neurodiversity/conditions/consent/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-053

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Creatividad

EN TITLE: Creativity

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Ideas que llegan por caminos poco habituales. Qué hace falta para poder crear, qué entornos lo permiten y por qué no es un rasgo garantizado de nadie.

EN SUMMARY: Ideas can emerge in many different ways. What helps people create, which environments make exploration possible and why creativity is not a guaranteed feature of any neurodivergence.

ES RUTA: /es/neurodiversidad/condiciones/creatividad/

EN PATH: /en/neurodiversity/conditions/creativity/

ESTADO: BILINGUAL_COMPLETE

---

## 37.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 53/185.

EN: Situations complete: 187/187. Conditions added: 53/185.

SIGUIENTE REGISTRO: WEB-CONDITION-054

# 38. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-054

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Culpa

EN TITLE: Guilt

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Sentirse responsable de todo, también de lo ajeno. Qué distingue la responsabilidad real de la exagerada y por qué sentir culpa no demuestra haber hecho daño.

EN SUMMARY: Feeling responsible for everything, including things outside one’s control. What distinguishes realistic responsibility from exaggerated responsibility and why feeling guilty does not prove that harm was done.

ES RUTA: /es/neurodiversidad/condiciones/culpa/

EN PATH: /en/neurodiversity/conditions/guilt/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-055

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Deadnaming

EN TITLE: Deadnaming

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Llamar a alguien por el nombre que dejó atrás. Qué es el deadnaming, qué daño hace y cómo se corrige un error sin pedirle que explique su historia.

EN SUMMARY: Using a name that a person no longer uses. What deadnaming is, why it can cause harm and how to correct a mistake without asking the person to explain their history.

ES RUTA: /es/neurodiversidad/condiciones/deadnaming/

EN PATH: /en/neurodiversity/conditions/deadnaming/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-056

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Dentista

EN TITLE: Dental care

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: La boca, el ruido, la luz y no poder avisar. Qué pedir antes de la cita, qué ajustes son razonables y por qué el dolor no es el precio de ser atendido.

EN SUMMARY: Dental care can combine touch in the mouth, noise, bright light and difficulty signalling the need to stop. What can be requested in advance, which adjustments are reasonable and why pain is not the price of receiving care.

ES RUTA: /es/neurodiversidad/condiciones/dentista/

EN PATH: /en/neurodiversity/conditions/dental-care/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-057

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Dependencia y necesidades de apoyo

EN TITLE: Dependence and support needs

ES CLASIFICACIÓN: apoyo

EN CLASSIFICATION: support

ES RESUMEN: Cuánta ayuda hace falta, en qué tarea y en qué momento. Cómo se describe eso para un trámite y por qué necesitar apoyo no quita la capacidad de decidir.

EN SUMMARY: How much help is needed, with which task and at what time. How to describe support needs for an assessment or application and why needing support does not remove the ability to make decisions.

ES RUTA: /es/neurodiversidad/condiciones/dependencia-y-necesidades-de-apoyo/

EN PATH: /en/neurodiversity/conditions/dependence-and-support-needs/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-058

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Deporte

EN TITLE: Sport

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Jugar o entrenar sin que se convierta en una prueba de aguante. Cómo elegir modalidad y entorno, qué adaptar y por qué el deporte no se usa como castigo.

EN SUMMARY: Playing or training without turning it into a test of endurance. How to choose an activity and environment, what can be adapted and why sport should not be used as punishment.

ES RUTA: /es/neurodiversidad/condiciones/deporte/

EN PATH: /en/neurodiversity/conditions/sport/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-059

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Depresión

EN TITLE: Depression

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Días sin ganas de nada y un cansancio que no se va durmiendo. Qué es la depresión, cómo se valora y qué ayuda, con las guías NICE de adultos y de menores.

EN SUMMARY: Depression is more than having a bad day and can involve persistent low mood, loss of interest or pleasure and changes in energy and functioning. How it is assessed and what helps, with NICE guidance for adults and for children and young people.

ES RUTA: /es/neurodiversidad/condiciones/depresion/

EN PATH: /en/neurodiversity/conditions/depression/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-060

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Discapacidades del desarrollo

EN TITLE: Developmental disabilities

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Un grupo amplio de condiciones que empiezan en la infancia. Qué son las discapacidades del desarrollo, qué apoyos hay y por qué no existe un tratamiento único.

EN SUMMARY: A broad group of conditions that begin during development. What developmental disabilities are, which supports may be needed and why there is no single treatment for the group as a whole.

ES RUTA: /es/neurodiversidad/condiciones/discapacidades-del-desarrollo/

EN PATH: /en/neurodiversity/conditions/developmental-disabilities/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-061

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Descanso y recuperación

EN TITLE: Rest and recovery

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Parar y seguir igual de agotada. Qué descansa de verdad, por qué llenar la pausa con otra tarea no recupera y en qué se nota que el descanso no llega.

EN SUMMARY: Stopping without actually feeling restored. What genuine recovery may look like, why filling every break with another task can prevent rest and how to notice when recovery is not happening.

ES RUTA: /es/neurodiversidad/condiciones/descanso-y-recuperacion/

EN PATH: /en/neurodiversity/conditions/rest-and-recovery/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-062

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno de despersonalización-desrealización

EN TITLE: Depersonalisation-derealisation disorder

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Sentirse fuera del propio cuerpo o que todo parece irreal. Qué es la despersonalización, cómo se valora, qué ayuda y por qué no hay un fármaco específico.

EN SUMMARY: Feeling outside your own body or as if everything is unreal. What depersonalisation is, how it is assessed, what helps and why there is no specific medicine for it.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-de-despersonalizacion-desrealizacion/

EN PATH: /en/neurodiversity/conditions/depersonalisation-derealisation-disorder/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-063

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Diagnóstico tardío

EN TITLE: Late diagnosis

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Un nombre que llega a los treinta, a los cuarenta o después. Qué se remueve al revisar la propia historia, qué apoyos se actualizan y qué no cambia.

EN SUMMARY: A diagnosis or identification may arrive in the thirties, forties or later. What can change when a person revisits their history, which supports may need updating and what a later diagnosis does not rewrite.

ES RUTA: /es/neurodiversidad/condiciones/diagnostico-tardio/

EN PATH: /en/neurodiversity/conditions/late-diagnosis/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-064

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Diferencias sensoriales

EN TITLE: Sensory differences

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: El mundo llega más fuerte, más flojo o mezclado. Qué son las diferencias sensoriales, qué adaptaciones ayudan y por qué no existe una dieta sensorial universal.

EN SUMMARY: Sensory information can be experienced as stronger, weaker or harder to separate. What sensory differences are, which adaptations may help and why there is no universal «sensory diet».

ES RUTA: /es/neurodiversidad/condiciones/diferencias-sensoriales/

EN PATH: /en/neurodiversity/conditions/sensory-differences/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-065

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Dinero y vida diaria

EN TITLE: Money and everyday life

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Las facturas, los plazos y el gasto que se descontrola. Qué se puede automatizar, qué apoyos existen y por qué pedir ayuda no significa perder decisiones.

EN SUMMARY: Bills, deadlines and spending can combine into a demanding set of tasks. What can be automated, which supports may help and why asking for financial support does not mean losing decision-making rights.

ES RUTA: /es/neurodiversidad/condiciones/dinero-y-vida-diaria/

EN PATH: /en/neurodiversity/conditions/money-and-everyday-life/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-066

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Discalculia

EN TITLE: Dyscalculia

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Los números no se quedan y el cálculo no sale. Qué es la discalculia, qué enseñanza ayuda y por qué el entrenamiento cerebral no transfiere a la vida diaria.

EN SUMMARY: Dyscalculia involves persistent difficulty with number concepts or mathematical learning that is greater than expected from ordinary variation in learning. What teaching approaches help and why generic «brain training» has limited transfer to everyday mathematical functioning.

ES RUTA: /es/neurodiversidad/condiciones/discalculia/

EN PATH: /en/neurodiversity/conditions/dyscalculia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-067

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Discapacidad

EN TITLE: Disability

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Qué barreras hay delante, más allá del diagnóstico. Qué se elimina del entorno, qué apoyos existen y por qué la discapacidad no se explica solo por la persona.

EN SUMMARY: Looking at the barriers in front of a person, not only at a diagnosis. Which barriers can be removed, what support may be available and why disability cannot be explained solely by the individual.

ES RUTA: /es/neurodiversidad/condiciones/discapacidad/

EN PATH: /en/neurodiversity/conditions/disability/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-068

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Discapacidad intelectual

EN TITLE: Intellectual disability

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Aprender y resolver el día a día necesita más apoyo. Qué es la discapacidad intelectual, cómo se valoran los apoyos y por qué un CI aislado no dice nada.

EN SUMMARY: Learning and managing everyday life may require more support. What intellectual disability is, how support needs are considered and why an IQ score alone does not describe a person.

ES RUTA: /es/neurodiversidad/condiciones/discapacidad-intelectual/

EN PATH: /en/neurodiversity/conditions/intellectual-disability/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-069

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Discriminación

EN TITLE: Discrimination

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Un trato distinto que no se puede probar pero se nota. Qué registrar, qué vías de queja hay y por qué «adaptarse mejor» no corrige una barrera.

EN SUMMARY: Unequal treatment may be difficult to document even when its effects are real. What may be useful to record, which complaint or protection routes may exist and why asking the person to «adapt better» does not remove discrimination.

ES RUTA: /es/neurodiversidad/condiciones/discriminacion/

EN PATH: /en/neurodiversity/conditions/discrimination/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-070

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Disforia de género

EN TITLE: Gender dysphoria

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: El malestar de que el género asignado no encaje. Qué describe la disforia de género, cómo se atiende y dónde la sitúan hoy el DSM-5-TR y la CIE-11.

EN SUMMARY: Distress related to an incongruence between a person’s experienced gender and assigned sex or associated characteristics. What gender dysphoria describes, how care should respond to distress and how DSM-5-TR and ICD-11 currently classify related concepts.

ES RUTA: /es/neurodiversidad/condiciones/disforia-de-genero/

EN PATH: /en/neurodiversity/conditions/gender-dysphoria/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-071

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Disgrafía

EN TITLE: Dysgraphia

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Escribir a mano agota y lo escrito no se entiende. Qué es la disgrafía, qué ayuda de verdad y por qué una mala letra no basta para diagnosticar.

EN SUMMARY: Writing by hand can require disproportionate effort, and written output may be difficult to produce or read. What dysgraphia describes, what can help and why poor handwriting alone is not enough for diagnosis.

ES RUTA: /es/neurodiversidad/condiciones/disgrafia/

EN PATH: /en/neurodiversity/conditions/dysgraphia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-072

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Dislexia

EN TITLE: Dyslexia

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Leer cansa mucho más de lo que debería. Qué es la dislexia, qué enseñanza tiene respaldo y por qué las lentes y el entrenamiento cerebral no lo tienen.

EN SUMMARY: Reading can require far more effort than expected. What dyslexia is, which teaching approaches are supported and why lenses, eye exercises and generic brain-training claims are not.

ES RUTA: /es/neurodiversidad/condiciones/dislexia/

EN PATH: /en/neurodiversity/conditions/dyslexia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-073

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno dismórfico corporal (TDC)

EN TITLE: Body dysmorphic disorder (BDD)

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Mirarse al espejo y ver un defecto que ocupa horas del día. Qué es el trastorno dismórfico corporal, cómo se reconoce y qué ayuda, con la NICE CG31 citada.

EN SUMMARY: Looking in the mirror and seeing a flaw that takes up hours of the day. What body dysmorphic disorder is, how it is recognised and what helps, with NICE CG31 cited.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-dismorfico-corporal-tdc/

EN PATH: /en/neurodiversity/conditions/body-dysmorphic-disorder-bdd/

ESTADO: BILINGUAL_COMPLETE

---

## 38.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 73/185.

EN: Situations complete: 187/187. Conditions added: 73/185.

SIGUIENTE REGISTRO: WEB-CONDITION-074

# 39. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-074

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Disociación

EN TITLE: Dissociation

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: Irse mentalmente y volver sin saber cuánto pasó. Qué describe la disociación, en qué se distingue de un trastorno disociativo y qué ayuda en el momento.

EN SUMMARY: Dissociation can involve feeling disconnected from oneself, memory, emotions or surroundings. What the term describes, how it differs from a dissociative disorder and what may help in the moment.

ES RUTA: /es/neurodiversidad/condiciones/disociacion/

EN PATH: /en/neurodiversity/conditions/dissociation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-075

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno del desarrollo de la coordinación (DCD) / dispraxia

EN TITLE: Developmental coordination disorder (DCD) / dyspraxia

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Torpeza que no se va con la práctica normal. Qué es la dispraxia, qué práctica tiene respaldo y por qué los «reflejos primitivos» no lo tienen.

EN SUMMARY: Clumsiness that does not go away with ordinary practice. What dyspraxia is, which type of practice is supported by evidence and why “primitive reflex” programmes are not.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-del-desarrollo-de-la-coordinacion-dcd-dispraxia/

EN PATH: /en/neurodiversity/conditions/developmental-coordination-disorder-dcd-dyspraxia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-076

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Doble excepcionalidad

EN TITLE: Twice-exceptionality

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Altas capacidades y una dificultad, a la vez. Qué es la doble excepcionalidad, qué apoyos hacen falta y por qué una cosa no compensa ni excluye la otra.

EN SUMMARY: High ability and a disability, neurodevelopmental condition or learning difficulty can exist in the same person. What twice-exceptionality describes, which supports may be needed and why one does not cancel out the other.

ES RUTA: /es/neurodiversidad/condiciones/doble-excepcionalidad/

EN PATH: /en/neurodiversity/conditions/twice-exceptionality/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-077

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Dolor persistente (dolor crónico)

EN TITLE: Persistent pain / chronic pain

ES CLASIFICACIÓN: salud física

EN CLASSIFICATION: physical health

ES RESUMEN: Un dolor que sigue mucho después de la causa. Qué es el dolor crónico primario, qué tiene respaldo y qué desaconseja NICE, con la guía citada.

EN SUMMARY: Pain can continue after the original injury or cause would usually be expected to settle, and chronic primary pain may not be fully explained by another condition. What is supported and what NICE advises against.

ES RUTA: /es/neurodiversidad/condiciones/dolor-persistente-dolor-cronico/

EN PATH: /en/neurodiversity/conditions/persistent-pain-chronic-pain/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-078

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Dolor: reconocerlo y comunicarlo

EN TITLE: Pain: recognising and communicating it

ES CLASIFICACIÓN: salud física

EN CLASSIFICATION: physical health

ES RESUMEN: Doler y que nadie lo note. Cómo se pregunta y se mide el dolor de otra forma, y por qué una expresión distinta no demuestra que no haya dolor.

EN SUMMARY: Pain may be present even when it is expressed in an unexpected way. How pain can be asked about and measured differently, and why a different facial expression or communication style does not mean pain is absent.

ES RUTA: /es/neurodiversidad/condiciones/dolor-reconocerlo-y-comunicarlo/

EN PATH: /en/neurodiversity/conditions/pain-recognising-and-communicating-it/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-079

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Síndrome de Down

EN TITLE: Down syndrome

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Una condición genética con su propia salud y sus apoyos. Qué es el síndrome de Down, qué controles médicos toca y qué apoyos ayudan en cada etapa.

EN SUMMARY: A genetic condition with its own health needs and supports. What Down syndrome is, which health checks are needed and which supports help at each stage.

ES RUTA: /es/neurodiversidad/condiciones/sindrome-de-down/

EN PATH: /en/neurodiversity/conditions/down-syndrome/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-080

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Duelo

EN TITLE: Grief

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Cada persona lo pasa a su manera y a su ritmo. Qué ayuda cuando cuesta expresarlo, qué información necesitan los menores y cuándo conviene consultar.

EN SUMMARY: People grieve in different ways and at different paces. What can help when grief is difficult to express, what children and young people may need to be told, and when additional support may be appropriate.

ES RUTA: /es/neurodiversidad/condiciones/duelo/

EN PATH: /en/neurodiversity/conditions/grief/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-081

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno de duelo prolongado

EN TITLE: Prolonged grief disorder

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: El duelo que no cede con el tiempo y ocupa la vida entera. Qué es el duelo prolongado, en qué se distingue del duelo y qué tipo de ayuda se plantea.

EN SUMMARY: Grief that does not ease over time and takes over the whole of life. What prolonged grief is, how it differs from grief itself and what kind of help is considered.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-de-duelo-prolongado/

EN PATH: /en/neurodiversity/conditions/prolonged-grief-disorder/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-082

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Ecolalia

EN TITLE: Echolalia

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Repetir palabras o frases, propias o de otros. Qué es la ecolalia, qué función puede cumplir y por qué no se suprime ni indica ausencia de comprensión.

EN SUMMARY: Repeating words or phrases, one’s own or other people’s. What echolalia is, which functions it can serve and why it should not automatically be suppressed or interpreted as lack of understanding.

ES RUTA: /es/neurodiversidad/condiciones/ecolalia/

EN PATH: /en/neurodiversity/conditions/echolalia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-083

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Educación sexual

EN TITLE: Sexuality education

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Hablar de cuerpo, límites y relaciones con información clara. Qué toca a cada edad, cómo hacerla accesible y qué no provoca la educación sexual integral.

EN SUMMARY: Talking clearly about bodies, boundaries and relationships. What information is appropriate at different ages, how to make it accessible and what comprehensive sexuality education does not cause.

ES RUTA: /es/neurodiversidad/condiciones/educacion-sexual/

EN PATH: /en/neurodiversity/conditions/sexuality-education/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-084

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Empleo y neurodiversidad

EN TITLE: Employment and neurodiversity

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Buscar trabajo, entrar y aguantar dentro. Qué ajustes razonables se pueden pedir, cuándo conviene contarlo y por qué no hay un trabajo ideal para nadie.

EN SUMMARY: Finding a job, entering a workplace and being able to remain there. Which reasonable adjustments may help, when disclosure may or may not be useful and why there is no single «ideal job» for a diagnosis.

ES RUTA: /es/neurodiversidad/condiciones/empleo-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/employment-and-neurodiversity/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-085

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Enfado e ira

EN TITLE: Anger

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Un enfado que llega entero y arrasa. Qué reduce la demanda antes de que estalle, qué ayuda a reparar después y por qué sentir ira no es ser violento.

EN SUMMARY: Anger can arrive intensely and take time to settle. What can reduce demands before escalation, what can help repair afterwards and why feeling anger is not the same as being violent.

ES RUTA: /es/neurodiversidad/condiciones/enfado-e-ira/

EN PATH: /en/neurodiversity/conditions/anger/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-086

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Envejecimiento neurodivergente

EN TITLE: Neurodivergent ageing

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Envejecer sin perder los apoyos que sostenían el día. Qué anticipar en salud, vivienda y cuidados, y qué se sabe todavía poco sobre esta etapa.

EN SUMMARY: Growing older without losing the supports that make everyday life workable. What to anticipate in health, housing and care, and where evidence about neurodivergent ageing is still limited.

ES RUTA: /es/neurodiversidad/condiciones/envejecimiento-neurodivergente/

EN PATH: /en/neurodiversity/conditions/neurodivergent-ageing/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-087

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Epilepsia

EN TITLE: Epilepsy

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Crisis que llegan sin avisar y el miedo a la siguiente. Qué es la epilepsia, qué tipos de crisis hay y qué tratamiento se elige, con la NICE NG217 citada.

EN SUMMARY: Epilepsy involves recurrent seizures and may bring concern about when another seizure will happen. What epilepsy is, how seizure types differ and how treatment is selected, with NICE NG217 identified.

ES RUTA: /es/neurodiversidad/condiciones/epilepsia/

EN PATH: /en/neurodiversity/conditions/epilepsy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-088

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Espiritualidad, creencias y no creencia

EN TITLE: Spirituality, belief and non-belief

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Creer, dudar o no creer, y poder participar o no. Qué se puede adaptar en un entorno comunitario y por qué la neurodivergencia no determina nada de esto.

EN SUMMARY: Believing, doubting or not believing, and being able to participate—or not—in a community. What can be adapted in community settings and why neurodivergence does not determine a person’s beliefs.

ES RUTA: /es/neurodiversidad/condiciones/espiritualidad-creencias-y-no-creencia/

EN PATH: /en/neurodiversity/conditions/spirituality-belief-and-non-belief/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-089

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Evitación

EN TITLE: Avoidance

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Dejar de hacer algo para no pasarlo mal. Cuándo la evitación protege y cuándo mantiene el problema, y por qué retirarse no es conducta desafiante.

EN SUMMARY: Stopping or avoiding something in order not to experience distress or harm. When avoidance can be protective, when it can maintain anxiety and why withdrawal should not automatically be labelled challenging behaviour.

ES RUTA: /es/neurodiversidad/condiciones/evitacion/

EN PATH: /en/neurodiversity/conditions/avoidance/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-090

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Expresión de género

EN TITLE: Gender expression

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Cómo se viste, se habla y se mueve cada persona. Qué es la expresión de género, en qué se diferencia de la identidad y qué códigos de vestimenta sobran.

EN SUMMARY: How a person dresses, speaks, moves or otherwise presents themselves. What gender expression is, how it differs from gender identity and why dress codes should not assume gender.

ES RUTA: /es/neurodiversidad/condiciones/expresion-de-genero/

EN PATH: /en/neurodiversity/conditions/gender-expression/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-091

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Fatiga social

EN TITLE: Social fatigue

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Después de estar con gente, no queda nada. Qué es la fatiga social, cómo dosificar la interacción y por qué aparece igual con la gente que importa.

EN SUMMARY: Social interaction can use substantial energy, including with people a person cares about. What social fatigue describes, how interaction can be paced and why it does not mean lack of interest in others.

ES RUTA: /es/neurodiversidad/condiciones/fatiga-social/

EN PATH: /en/neurodiversity/conditions/social-fatigue/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-092

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Fobias específicas

EN TITLE: Specific phobias

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Un miedo concreto, intenso, que organiza la vida alrededor. Qué es una fobia específica, cómo se reconoce y qué ayuda de verdad, con los CDDR de la OMS.

EN SUMMARY: A specific, intense fear that life starts to revolve around. What a specific phobia is, how it is recognised, and what genuinely helps, with the WHO CDDR cited.

ES RUTA: /es/neurodiversidad/condiciones/fobias-especificas/

EN PATH: /en/neurodiversity/conditions/specific-phobias/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-093

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Fortalezas

EN TITLE: Strengths

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Lo que se hace bien, sin convertirlo en superpoder. Cómo identificar capacidades útiles para la propia persona y por qué no cancelan las necesidades de apoyo.

EN SUMMARY: What a person does well, without turning it into a «superpower». How to identify abilities that are genuinely useful to the person and why strengths do not cancel support needs.

ES RUTA: /es/neurodiversidad/condiciones/fortalezas/

EN PATH: /en/neurodiversity/conditions/strengths/

ESTADO: BILINGUAL_COMPLETE

---

## 39.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 93/185.

EN: Situations complete: 187/187. Conditions added: 93/185.

SIGUIENTE REGISTRO: WEB-CONDITION-094

# 40. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-094

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Frustración

EN TITLE: Frustration

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Algo no sale y todo se bloquea. Qué reduce los pasos y aclara la meta, y por qué aumentar la frustración a propósito no enseña a tolerarla mejor.

EN SUMMARY: When something does not work and the whole task becomes harder to continue. What can clarify the goal and reduce steps, and why deliberately increasing frustration does not teach tolerance by itself.

ES RUTA: /es/neurodiversidad/condiciones/frustracion/

EN PATH: /en/neurodiversity/conditions/frustration/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-095

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Funciones ejecutivas

EN TITLE: Executive functions

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: Empezar, ordenar y terminar cuesta más que la tarea. Qué son las funciones ejecutivas, qué apoyos externos ayudan y por qué el entrenamiento cerebral no sirve.

EN SUMMARY: Starting, organising and finishing can feel harder than the task itself. What executive functions are, which external supports help, and why brain training does not work.

ES RUTA: /es/neurodiversidad/condiciones/funciones-ejecutivas/

EN PATH: /en/neurodiversity/conditions/executive-functions/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-096

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Gay

EN TITLE: Gay

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Un hombre al que le atraen los hombres. Qué describe la palabra gay, quién la usa para sí y en qué se diferencia la orientación de la identidad de género.

EN SUMMARY: A man who is attracted to men. What the word gay describes, who uses it for themselves, and how sexual orientation differs from gender identity.

ES RUTA: /es/neurodiversidad/condiciones/gay/

EN PATH: /en/neurodiversity/conditions/gay/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-097

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Género fluido

EN TITLE: Gender-fluid

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: El género cambia con el tiempo, y no hace falta explicarlo. Qué describe género fluido y por qué el cambio tiene que llegar a las listas y a la nómina.

EN SUMMARY: A person’s experience of gender may change over time. What gender-fluid describes and why updates need to reach everyday systems such as class lists, payroll and email, not only a central record.

ES RUTA: /es/neurodiversidad/condiciones/genero-fluido/

EN PATH: /en/neurodiversity/conditions/gender-fluid/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-098

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Hermanos

EN TITLE: Siblings

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: El hermano que ayuda mucho y pregunta poco. Qué información necesita según su edad, qué tiempo propio le corresponde y qué no se le puede dar por hecho.

EN SUMMARY: A sibling may help a great deal while receiving little attention themselves. What information they may need at different ages, why they need time of their own and what responsibilities should never be assumed.

ES RUTA: /es/neurodiversidad/condiciones/hermanos/

EN PATH: /en/neurodiversity/conditions/siblings/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-099

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Higiene y autocuidado

EN TITLE: Hygiene and self-care

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: La ducha, los dientes y la ropa como una montaña diaria. Qué parte de la tarea es la que cuesta, qué se puede partir y qué productos o texturas cambiarla.

EN SUMMARY: Showering, brushing teeth or getting dressed can become a demanding daily task. Which part is difficult, what can be broken down and how products, textures or temperature can be changed.

ES RUTA: /es/neurodiversidad/condiciones/higiene-y-autocuidado/

EN PATH: /en/neurodiversity/conditions/hygiene-and-self-care/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-100

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Hiperacusia

EN TITLE: Hyperacusis

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Sonidos normales que se sienten demasiado fuertes o dolorosos. Qué es la hiperacusia, cómo se valora y por qué taparse siempre los oídos no ayuda.

EN SUMMARY: Everyday sounds can be experienced as excessively loud, uncomfortable or painful. What hyperacusis is, how it is assessed and why constant ear protection is not a universal solution.

ES RUTA: /es/neurodiversidad/condiciones/hiperacusia/

EN PATH: /en/neurodiversity/conditions/hyperacusis/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-101

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Hiperfoco

EN TITLE: Hyperfocus

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Horas dentro de algo, sin comer ni levantarse. Qué describe el hiperfoco, qué avisos externos ayudan y por qué no es un indicador diagnóstico por sí solo.

EN SUMMARY: Hours absorbed in something, without eating or getting up. What hyperfocus describes, which external reminders can help, and why it is not a diagnostic indicator on its own.

ES RUTA: /es/neurodiversidad/condiciones/hiperfoco/

EN PATH: /en/neurodiversity/conditions/hyperfocus/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-102

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Hospital y neurodiversidad

EN TITLE: Hospital care and neurodiversity

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Un ingreso o una urgencia sin poder explicar lo que pasa. Qué ajustes dejar por escrito, qué pedir al llegar y qué no debe retrasar la atención.

EN SUMMARY: A hospital admission or emergency can make it difficult to explain what is happening. Which adjustments can be written down in advance, what can be requested on arrival and what must never delay necessary care.

ES RUTA: /es/neurodiversidad/condiciones/hospital-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/hospital-care-and-neurodiversity/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-103

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Identidad de género

EN TITLE: Gender identity

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: El género que cada persona sabe que es. Qué significa identidad de género, en qué se distingue de la orientación y qué términos hay debajo del paraguas.

EN SUMMARY: A person’s own sense of their gender. What gender identity means, how it differs from sexual orientation and which terms may fall under the wider umbrella of gender diversity.

ES RUTA: /es/neurodiversidad/condiciones/identidad-de-genero/

EN PATH: /en/neurodiversity/conditions/gender-identity/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-104

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno de identidad disociativo (TID)

EN TITLE: Dissociative identity disorder (DID)

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Partes de uno mismo que funcionan por separado. Qué es el TID, cómo se valora con cautela, qué ayuda y por qué no se inducen identidades en consulta.

EN SUMMARY: Parts of the self that function separately. What DID is, how it is assessed cautiously, what helps and why identities are not induced in therapy.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-de-identidad-disociativo-tid/

EN PATH: /en/neurodiversity/conditions/dissociative-identity-disorder-did/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-105

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Identificar emociones

EN TITLE: Identifying emotions

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Saber que pasa algo y no saber qué. Qué combinaciones ayudan a nombrarlo, por qué no hay que forzar una etiqueta y qué no significa no encontrarla.

EN SUMMARY: Knowing that something is happening without being sure what to call it. Which combinations of information can help, why an emotional label should not be forced and what difficulty finding one does not mean.

ES RUTA: /es/neurodiversidad/condiciones/identificar-emociones/

EN PATH: /en/neurodiversity/conditions/identifying-emotions/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-106

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Imagen corporal

EN TITLE: Body image

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Mirarse y no soportar lo que se ve. Qué influye en la imagen corporal, qué reduce comparación y estigma, y por qué «quiérete» no resuelve nada.

EN SUMMARY: A person’s relationship with how their body looks and feels can become a major source of distress. What shapes body image, what may reduce comparison and stigma, and why simply telling someone to «love yourself» is not a treatment.

ES RUTA: /es/neurodiversidad/condiciones/imagen-corporal/

EN PATH: /en/neurodiversity/conditions/body-image/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-107

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Inercia autista

EN TITLE: Autistic inertia

ES CLASIFICACIÓN: emergente

EN CLASSIFICATION: emerging

ES RESUMEN: Saber qué hacer y no poder arrancar ni parar. Qué describe la inercia autista, qué ayuda en las transiciones y qué se sabe hasta hoy, que es poco.

EN SUMMARY: Autistic inertia is a term used for difficulty starting, stopping or switching activities even when a person knows what they want or need to do. What may help with transitions and how limited the evidence remains.

ES RUTA: /es/neurodiversidad/condiciones/inercia-autista/

EN PATH: /en/neurodiversity/conditions/autistic-inertia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-108

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Insomnio

EN TITLE: Insomnia

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Dar vueltas cada noche y arrastrar el día siguiente. Qué es el insomnio, cómo se valora y por qué la terapia va antes que la pastilla, con la AASM citada.

EN SUMMARY: Tossing and turning every night and dragging through the next day. What insomnia is, how it is assessed, and why therapy comes before medication, with the AASM cited.

ES RUTA: /es/neurodiversidad/condiciones/insomnio/

EN PATH: /en/neurodiversity/conditions/insomnia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-109

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Intereses intensos o especiales

EN TITLE: Intense or special interests

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Un tema que ocupa todo y del que se sabe muchísimo. Qué aporta ese interés, cuándo conviene acordar límites y por qué eliminarlo no es un objetivo.

EN SUMMARY: An interest can become a major source of knowledge, enjoyment, connection or focus. What that interest may contribute, when boundaries may be useful and why eliminating it is not a treatment goal by itself.

ES RUTA: /es/neurodiversidad/condiciones/intereses-intensos-o-especiales/

EN PATH: /en/neurodiversity/conditions/intense-or-special-interests/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-110

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Interocepción

EN TITLE: Interoception

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: No notar el hambre, la sed o el baño hasta que aprieta. Qué es la interocepción, qué señales externas ayudan y lo poco que se sabe todavía.

EN SUMMARY: Not noticing hunger, thirst or the need to use the toilet until it becomes urgent. What interoception is, which external cues help, and how little is still known.

ES RUTA: /es/neurodiversidad/condiciones/interocepcion/

EN PATH: /en/neurodiversity/conditions/interoception/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-111

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Intersexualidad

EN TITLE: Intersex

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Nacer con características sexuales que no encajan en dos casillas. Qué es la intersexualidad, por qué no es identidad y qué derechos están en juego.

EN SUMMARY: Being born with sex characteristics that do not fit neatly into two boxes. What intersex variations are, why intersex is not a gender identity, and which rights are at stake.

ES RUTA: /es/neurodiversidad/condiciones/intersexualidad/

EN PATH: /en/neurodiversity/conditions/intersex/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-112

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno del desarrollo del lenguaje (TDL)

EN TITLE: Developmental language disorder (DLD)

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Dificultades persistentes para comprender o utilizar el lenguaje que afectan a la vida cotidiana. Qué se valora, qué apoyos ayudan y por qué hablar varias lenguas no causa TDL.

EN SUMMARY: DLD makes it difficult to learn, understand or use language and affects everyday communication or learning. It is not defined simply by speaking little or by pronunciation alone. Consensus terminology distinguishes it from language disorders associated with a known biomedical cause.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-del-desarrollo-del-lenguaje-tdl/

EN PATH: /en/neurodiversity/conditions/developmental-language-disorder-dld/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-113

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Lesbiana

EN TITLE: Lesbian

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Una mujer a la que le atraen las mujeres. Qué describe la palabra lesbiana, por qué a veces se lee como amistad y quién decide usarla para sí.

EN SUMMARY: A woman who is attracted to women. What the word lesbian describes, why a relationship may sometimes be read as friendship, and who decides to use the term for themselves.

ES RUTA: /es/neurodiversidad/condiciones/lesbiana/

EN PATH: /en/neurodiversity/conditions/lesbian/

ESTADO: BILINGUAL_COMPLETE

---

## 40.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 113/185.

EN: Situations complete: 187/187. Conditions added: 113/185.

SIGUIENTE REGISTRO: WEB-CONDITION-114

# 41. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-114

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: LGTBI+ y neurodiversidad

EN TITLE: LGBTQIA+ and neurodiversity

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Ser LGTBI+ y neurodivergente a la vez, dos cosas distintas. Cómo se cruzan en la atención sanitaria, en el trato y en la búsqueda de apoyos.

EN SUMMARY: Being LGBTI+ and neurodivergent at the same time—two different things. How they intersect in healthcare, how a person is treated, and the search for support.

ES RUTA: /es/neurodiversidad/condiciones/lgtbi-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/lgbtqia-and-neurodiversity/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-115

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Límites personales

EN TITLE: Personal boundaries

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Decir hasta aquí sin dar explicaciones. Cómo nombrar un límite de forma concreta, qué señales acordar para parar y por qué no hace falta justificarlo.

EN SUMMARY: Being able to say «this is my limit» without having to justify it. How to state a boundary clearly, which signals can be agreed for stopping and why a diagnosis is not required to make a boundary valid.

ES RUTA: /es/neurodiversidad/condiciones/limites-personales/

EN PATH: /en/neurodiversity/conditions/personal-boundaries/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-116

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Masking / camuflaje autista

EN TITLE: Masking / autistic camouflaging

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Aparentar todo el día para encajar, y llegar a casa sin nada. Qué es el masking, qué entornos permiten dejarlo y por qué dejarlo no siempre es seguro.

EN SUMMARY: Keeping up an appearance all day to fit in, then getting home with nothing left. What masking is, which environments make it possible to do less of it and why unmasking is not always safe.

ES RUTA: /es/neurodiversidad/condiciones/masking-camuflaje-autista/

EN PATH: /en/neurodiversity/conditions/masking-autistic-camouflaging/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-117

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Maternidad y paternidad neurodivergente

EN TITLE: Neurodivergent motherhood and fatherhood

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Criar con las propias necesidades encima. Qué apoyo práctico cambia el día, cómo repartir tareas y por qué ser neurodivergente no mide la capacidad de criar.

EN SUMMARY: Raising children while carrying your own needs too. Which practical support changes daily life, how to divide tasks and why being neurodivergent does not measure parenting ability.

ES RUTA: /es/neurodiversidad/condiciones/maternidad-y-paternidad-neurodivergente/

EN PATH: /en/neurodiversity/conditions/neurodivergent-motherhood-and-fatherhood/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-118

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Menopausia

EN TITLE: Menopause

ES CLASIFICACIÓN: salud física

EN CLASSIFICATION: physical health

ES RESUMEN: El ciclo se acaba y el cuerpo cambia entero. Qué es la menopausia, qué tratamientos hay según riesgos y preferencias, con la NICE NG23 citada.

EN SUMMARY: The menstrual cycle ends and the whole body changes. What menopause is, which treatments are available according to risks and preferences, with NICE NG23 cited.

ES RUTA: /es/neurodiversidad/condiciones/menopausia/

EN PATH: /en/neurodiversity/conditions/menopause/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-119

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Menstruación

EN TITLE: Menstruation

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: El ciclo mezclado con dolor, sensorialidad y cansancio. Qué opciones de productos y analgesia hay, qué anotar y qué cambios necesitan valoración médica.

EN SUMMARY: The menstrual cycle mixed with pain, sensory needs and fatigue. Which product and pain-relief options exist, what may be useful to track and which changes need medical assessment.

ES RUTA: /es/neurodiversidad/condiciones/menstruacion/

EN PATH: /en/neurodiversity/conditions/menstruation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-120

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Misofonía

EN TITLE: Misophonia

ES CLASIFICACIÓN: emergente

EN CLASSIFICATION: emerging

ES RESUMEN: Un sonido concreto que provoca una reacción inmediata. Qué describe la misofonía, qué enfoques dan resultados prometedores y qué falta por establecer.

EN SUMMARY: A particular sound that triggers an immediate reaction. What misophonia describes, which approaches show promising results and what still has to be established.

ES RUTA: /es/neurodiversidad/condiciones/misofonia/

EN PATH: /en/neurodiversity/conditions/misophonia/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-121

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Monotropismo

EN TITLE: Monotropism

ES CLASIFICACIÓN: emergente

EN CLASSIFICATION: emerging

ES RESUMEN: La atención entra en un túnel y cuesta salir. Qué propone el monotropismo, para qué sirve al diseñar transiciones y por qué no es un criterio clínico.

EN SUMMARY: Attention goes into a tunnel and it is hard to come out. What monotropism proposes, how it can help when designing transitions and why it is not a clinical criterion.

ES RUTA: /es/neurodiversidad/condiciones/monotropismo/

EN PATH: /en/neurodiversity/conditions/monotropism/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-122

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Motivación

EN TITLE: Motivation

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Querer hacerlo y no arrancar. Qué hace visible el inicio, qué reduce la ambigüedad de la tarea y dónde está el atasco cuando el interés sí está.

EN SUMMARY: Wanting to do it and still not getting started. What makes the starting point visible, what reduces ambiguity in the task and where the block may be when the interest is there.

ES RUTA: /es/neurodiversidad/condiciones/motivacion/

EN PATH: /en/neurodiversity/conditions/motivation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-123

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Música

EN TITLE: Music

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: La misma canción cien veces, o el ruido insoportable. Qué elige cada persona y en qué se diferencia escuchar música de la musicoterapia, que es otra cosa.

EN SUMMARY: The same song a hundred times, or noise that is unbearable. What each person chooses and how listening to music differs from music therapy, which is something else.

ES RUTA: /es/neurodiversidad/condiciones/musica/

EN PATH: /en/neurodiversity/conditions/music/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-124

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Mutismo selectivo

EN TITLE: Selective mutism

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Hablar en casa y no poder en clase, sin quererlo. Qué es el mutismo selectivo, en qué se nota, qué ayuda a quitar presión y qué se sabe hasta hoy.

EN SUMMARY: Speaking at home and being unable to speak in class, without choosing it. What selective mutism is, how it shows up, what helps reduce pressure and what is known so far.

ES RUTA: /es/neurodiversidad/condiciones/mutismo-selectivo/

EN PATH: /en/neurodiversity/conditions/selective-mutism/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-125

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Naturaleza y espacios al aire libre

EN TITLE: Nature and outdoor spaces

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: El campo o la playa según accesibilidad, ruido y terreno. Qué mirar antes de ir, qué actividades se adaptan y por qué la naturaleza no calma a todo el mundo.

EN SUMMARY: The countryside or the beach depending on accessibility, noise and terrain. What to check before going, which activities can be adapted and why nature does not calm everyone.

ES RUTA: /es/neurodiversidad/condiciones/naturaleza-y-espacios-al-aire-libre/

EN PATH: /en/neurodiversity/conditions/nature-and-outdoor-spaces/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-126

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Niñas y mujeres autistas

EN TITLE: Autistic girls and women

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Años sin que nadie lo viera, y un diagnóstico que llega tarde. Cómo se valora en niñas y en mujeres adultas, y qué apoyos se basan en necesidades.

EN SUMMARY: Years without anyone noticing, and a diagnosis that comes late. How autism is assessed in girls and adult women, and which supports are based on needs.

ES RUTA: /es/neurodiversidad/condiciones/ninas-y-mujeres-autistas/

EN PATH: /en/neurodiversity/conditions/autistic-girls-and-women/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-127

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: No binario

EN TITLE: Non-binary

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Una identidad que no es solo hombre ni solo mujer. Qué significa no binario y qué pasa cuando un campo de género obligatorio bloquea un trámite.

EN SUMMARY: An identity that is not only man or only woman. What non-binary means and what happens when a compulsory gender field blocks a process.

ES RUTA: /es/neurodiversidad/condiciones/no-binario/

EN PATH: /en/neurodiversity/conditions/non-binary/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-128

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: No hablar

EN TITLE: Not speaking

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: No usar la voz, en general o en un momento. Qué vías de comunicación asegurar y por qué el habla no puede ser el requisito para demostrar que se entiende.

EN SUMMARY: Not using the voice, in general or at a particular time. Which communication routes must be ensured and why speech cannot be a requirement for showing understanding.

ES RUTA: /es/neurodiversidad/condiciones/no-hablar/

EN PATH: /en/neurodiversity/conditions/not-speaking/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-129

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Nombre elegido

EN TITLE: Chosen name

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: El nombre que una persona usa y pide que se use. Qué significa, dónde choca con listas y formularios y qué se puede cambiar sin esperar a los papeles.

EN SUMMARY: The name a person uses and asks others to use. What it means, where it clashes with lists and forms, and what can be changed without waiting for official documents.

ES RUTA: /es/neurodiversidad/condiciones/nombre-elegido/

EN PATH: /en/neurodiversity/conditions/chosen-name/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-130

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Ocio

EN TITLE: Leisure

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Tiempo libre que no hay que justificar ni aprovechar. Qué proteger de la agenda, qué opciones accesibles existen y por qué el ocio no tiene que ser social.

EN SUMMARY: Free time that does not have to be justified or made productive. What to protect in the schedule, which accessible options exist and why leisure does not have to be social.

ES RUTA: /es/neurodiversidad/condiciones/ocio/

EN PATH: /en/neurodiversity/conditions/leisure/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-131

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Orientación romántica

EN TITLE: Romantic orientation

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: El enamoramiento y la atracción sexual no siempre van juntos. Qué es la orientación romántica, en qué se distingue de la sexual y qué términos la nombran.

EN SUMMARY: Falling in love and sexual attraction do not always go together. What romantic orientation is, how it differs from sexual orientation and which terms describe it.

ES RUTA: /es/neurodiversidad/condiciones/orientacion-romantica/

EN PATH: /en/neurodiversity/conditions/romantic-orientation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-132

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Orientación sexual

EN TITLE: Sexual orientation

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Hacia quién va la atracción, y no siempre se deduce. Qué es la orientación sexual y por qué en un formulario o en consulta conviene preguntar por «pareja».

EN SUMMARY: Who a person is attracted to, and it cannot always be inferred. What sexual orientation is and why forms and consultations should ask about a “partner”.

ES RUTA: /es/neurodiversidad/condiciones/orientacion-sexual/

EN PATH: /en/neurodiversity/conditions/sexual-orientation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-133

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Otros trastornos alimentarios especificados (OSFED)

EN TITLE: Other specified feeding or eating disorder (OSFED)

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: No cumplir todos los criterios y que aun así sea un trastorno alimentario. Qué significa OSFED, qué tratamiento tiene y por qué no resta gravedad, con la NG69.

EN SUMMARY: Not meeting every criterion and still having an eating disorder. What OSFED means, how it is treated and why it is not less serious, with NG69 cited.

ES RUTA: /es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/

EN PATH: /en/neurodiversity/conditions/other-specified-feeding-or-eating-disorder-osfed/

ESTADO: BILINGUAL_COMPLETE

---

## 41.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 133/185.

EN: Situations complete: 187/187. Conditions added: 133/185.

SIGUIENTE REGISTRO: WEB-CONDITION-134

# 42. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-134

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Outing

EN TITLE: Outing

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Contar la identidad u orientación de alguien sin permiso. Qué es el outing, qué consecuencias tiene y por qué la persona decide cuándo, cómo y con quién.

EN SUMMARY: Disclosing someone’s identity or orientation without permission. What outing is, what consequences it can have and why the person decides when, how and with whom to share.

ES RUTA: /es/neurodiversidad/condiciones/outing/

EN PATH: /en/neurodiversity/conditions/outing/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-135

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno de pánico

EN TITLE: Panic disorder

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Ataques que vuelven y el miedo a que vuelvan. Qué es el trastorno de pánico, en qué se distingue del ataque suelto y qué ayuda, con la NICE CG113 citada.

EN SUMMARY: Repeated attacks and fear that they will happen again. What panic disorder is, how it differs from an isolated panic attack and what helps, with NICE CG113 cited.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-de-panico/

EN PATH: /en/neurodiversity/conditions/panic-disorder/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-136

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Pansexualidad

EN TITLE: Pansexuality

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Atracción sin que el género sea lo determinante. Qué describe la pansexualidad y por qué nadie tiene que justificar en qué se diferencia de la bisexualidad.

EN SUMMARY: Attraction where gender is not the determining factor. What pansexuality describes and why no one has to justify how it differs from bisexuality.

ES RUTA: /es/neurodiversidad/condiciones/pansexualidad/

EN PATH: /en/neurodiversity/conditions/pansexuality/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-137

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Parálisis cerebral

EN TITLE: Cerebral palsy

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Moverse cuesta y el cuerpo no responde igual. Qué es la parálisis cerebral, qué apoyos mejoran la participación y por qué no hay una cura que repare.

EN SUMMARY: Movement is difficult and the body does not respond in the same way. What cerebral palsy is, which supports improve participation and why there is no cure that repairs the underlying injury.

ES RUTA: /es/neurodiversidad/condiciones/paralisis-cerebral/

EN PATH: /en/neurodiversity/conditions/cerebral-palsy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-138

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Evitación persistente de demandas (perfil PDA)

EN TITLE: Persistent demand avoidance (PDA profile)

ES CLASIFICACIÓN: controvertido

EN CLASSIFICATION: contested

ES RESUMEN: Cualquier petición se vive como una amenaza. Qué describe el perfil PDA, qué ayuda en la práctica y por qué hoy no se sostiene como diagnóstico aparte.

EN SUMMARY: Any request feels like a threat. What the PDA profile describes, what may help in practice, and why it is not currently supported as a separate diagnosis.

ES RUTA: /es/neurodiversidad/condiciones/evitacion-persistente-de-demandas-perfil-pda/

EN PATH: /en/neurodiversity/conditions/persistent-demand-avoidance-pda-profile/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-139

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Perfeccionismo

EN TITLE: Perfectionism

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Que esté perfecto o no entregarlo. Qué hay detrás del perfeccionismo, qué estrategias eligen las propias personas y por qué no es un diagnóstico.

EN SUMMARY: Making it perfect or not handing it in. What can sit behind perfectionism, which strategies people themselves choose and why it is not a diagnosis.

ES RUTA: /es/neurodiversidad/condiciones/perfeccionismo/

EN PATH: /en/neurodiversity/conditions/perfectionism/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-140

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Pertenencia

EN TITLE: Belonging

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Estar en un grupo sin tener que disimular. Qué hace que un grupo acoja de verdad y por qué pertenecer no exige parecerse ni estar en contacto constante.

EN SUMMARY: Being in a group without having to hide who you are. What makes a group genuinely welcoming and why belonging does not require being alike or staying in constant contact.

ES RUTA: /es/neurodiversidad/condiciones/pertenencia/

EN PATH: /en/neurodiversity/conditions/belonging/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-141

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Pica

EN TITLE: Pica

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Comer cosas que no son alimento. Qué es la pica, qué riesgos hay que retirar primero, qué se trata antes y por qué no siempre viene de una falta de hierro.

EN SUMMARY: Eating things that are not food. What pica is, which risks need to be removed first, what should be treated first and why it is not always caused by iron deficiency.

ES RUTA: /es/neurodiversidad/condiciones/pica/

EN PATH: /en/neurodiversity/conditions/pica/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-142

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Planificación diaria

EN TITLE: Daily planning

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: El día se descoloca en cuanto algo cambia. Qué se puede externalizar en horarios y márgenes, y por qué un plan más detallado no siempre ayuda.

EN SUMMARY: The day falls apart as soon as something changes. What can be externalised into schedules and buffers, and why a more detailed plan does not always help.

ES RUTA: /es/neurodiversidad/condiciones/planificacion-diaria/

EN PATH: /en/neurodiversity/conditions/daily-planning/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-143

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Pobreza y precariedad

EN TITLE: Poverty and financial insecurity

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Llegar a final de mes decide qué apoyos se pueden pedir. Qué ayudas existen, qué trámites las bloquean y por qué esto no es un problema de mala gestión.

EN SUMMARY: Making it to the end of the month determines which supports can even be requested. Which forms of help exist, which procedures block access and why this is not a problem of poor management.

ES RUTA: /es/neurodiversidad/condiciones/pobreza-y-precariedad/

EN PATH: /en/neurodiversity/conditions/poverty-and-financial-insecurity/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-144

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Presión social

EN TITLE: Social pressure

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Hacer cosas para que no te dejen fuera. Qué expectativas son opcionales, cómo practicar límites y qué coste tiene adaptarse siempre para evitar el rechazo.

EN SUMMARY: Doing things so that you are not left out. Which expectations are optional, how to practise boundaries and what it costs to keep adapting in order to avoid rejection.

ES RUTA: /es/neurodiversidad/condiciones/presion-social/

EN PATH: /en/neurodiversity/conditions/social-pressure/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-145

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Privacidad

EN TITLE: Privacy

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Quién sabe qué y quién decidió contarlo. Qué se puede pedir antes de compartir información y por qué necesitar apoyo no quita el derecho a la privacidad.

EN SUMMARY: Who knows what, and who decided to tell them. What can be requested before information is shared and why needing support does not remove the right to privacy.

ES RUTA: /es/neurodiversidad/condiciones/privacidad/

EN PATH: /en/neurodiversity/conditions/privacy/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-146

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastorno del procesamiento auditivo (TPA)

EN TITLE: Auditory processing disorder (APD)

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Oír bien y aun así no entender lo que se dice. Qué es el TPA, en qué se distingue del TDAH, de la dislexia y de una pérdida auditiva, y qué ajustes ayudan.

EN SUMMARY: Hearing well and still not understanding what is being said. What APD is, how it differs from ADHD, dyslexia and hearing loss, and which adjustments help.

ES RUTA: /es/neurodiversidad/condiciones/trastorno-del-procesamiento-auditivo-tpa/

EN PATH: /en/neurodiversity/conditions/auditory-processing-disorder-apd/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-147

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Procrastinación

EN TITLE: Procrastination

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Dejarlo para luego sabiendo que es peor. Qué hace más pequeño el primer paso y por qué castigarse aumenta la evitación en lugar de reducirla.

EN SUMMARY: Putting it off even when you know that makes things worse. What makes the first step smaller and why punishing yourself increases avoidance instead of reducing it.

ES RUTA: /es/neurodiversidad/condiciones/procrastinacion/

EN PATH: /en/neurodiversity/conditions/procrastination/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-148

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Pronombres

EN TITLE: Pronouns

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Las palabras con las que alguien pide que se hable de ella. Qué son los pronombres, cómo se corrige un error de forma breve y quién no tiene que educar.

EN SUMMARY: The words a person asks others to use when referring to them. What pronouns are, how to correct a mistake briefly and who should not have to educate everyone.

ES RUTA: /es/neurodiversidad/condiciones/pronombres/

EN PATH: /en/neurodiversity/conditions/pronouns/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-149

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Propiocepción

EN TITLE: Proprioception

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: Calcular fuerza y distancia sin mirar. Qué es la propiocepción, qué referencias ayudan en las tareas físicas y qué se sabe hasta hoy sobre este proceso.

EN SUMMARY: Judging force and distance without looking. What proprioception is, which reference points help in physical tasks and what is known about this process so far.

ES RUTA: /es/neurodiversidad/condiciones/propiocepcion/

EN PATH: /en/neurodiversity/conditions/proprioception/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-150

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Queer

EN TITLE: Queer

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Una palabra reivindicada por unos y recibida como insulto por otros. Qué describe queer, de dónde viene su uso y por qué no se aplica a quien no la usa.

EN SUMMARY: A word reclaimed by some people and received as an insult by others. What queer describes, where its use comes from and why it should not be applied to someone who does not use it.

ES RUTA: /es/neurodiversidad/condiciones/queer/

EN PATH: /en/neurodiversity/conditions/queer/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-151

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Questioning / en exploración

EN TITLE: Questioning / exploring

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Estar averiguándolo, sin prisa y sin etiqueta final. Qué describe questioning, por qué no hay que cerrarlo y qué respeta de verdad esa exploración.

EN SUMMARY: Working it out, without rushing and without needing a final label. What questioning describes, why it should not be forced to a conclusion and what genuinely respects that exploration.

ES RUTA: /es/neurodiversidad/condiciones/questioning-en-exploracion/

EN PATH: /en/neurodiversity/conditions/questioning-exploring/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-152

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Racismo

EN TITLE: Racism

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Un trato desigual que se suma a todo lo demás. Qué barreras institucionales hay en evaluación y acceso, y por qué no son «malentendidos culturales».

EN SUMMARY: Unequal treatment added on top of everything else. Which institutional barriers affect assessment and access, and why they are not simply “cultural misunderstandings”.

ES RUTA: /es/neurodiversidad/condiciones/racismo/

EN PATH: /en/neurodiversity/conditions/racism/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-153

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Rechazo y sensibilidad al rechazo

EN TITLE: Rejection and rejection sensitivity

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Una crítica pequeña que duele horas. Qué describe la sensibilidad al rechazo, qué ayuda cuando ocurre y por qué no hay instrumento que la diagnostique.

EN SUMMARY: A small criticism that hurts for hours. What rejection sensitivity describes, what helps when it happens and why there is no instrument that diagnoses it.

ES RUTA: /es/neurodiversidad/condiciones/rechazo-y-sensibilidad-al-rechazo/

EN PATH: /en/neurodiversity/conditions/rejection-and-rejection-sensitivity/

ESTADO: BILINGUAL_COMPLETE

---

## 42.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 153/185.

EN: Situations complete: 187/187. Conditions added: 153/185.

SIGUIENTE REGISTRO: WEB-CONDITION-154

# 43. CORPUS WEB · IRIS GREEN · CONDICIONES · CONTINUACIÓN

Estado: EN_PROGRESO

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-154

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Regulación emocional

EN TITLE: Emotional regulation

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: La emoción llega entera y tarda en bajar. Qué señales tempranas se pueden reconocer, qué ayuda de verdad y por qué regular no es aparentar calma.

EN SUMMARY: The emotion arrives all at once and takes time to come down. Which early signs can be recognised, what genuinely helps and why regulation is not the same as looking calm.

ES RUTA: /es/neurodiversidad/condiciones/regulacion-emocional/

EN PATH: /en/neurodiversity/conditions/emotional-regulation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-155

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Relaciones de pareja

EN TITLE: Partner relationships

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Convivir con ritmos, silencios y necesidades distintas. Qué acuerdos conviene hacer explícitos y por qué ningún diagnóstico justifica un mal trato.

EN SUMMARY: Living together with different rhythms, silences and needs. Which agreements are worth making explicit and why no diagnosis justifies poor treatment.

ES RUTA: /es/neurodiversidad/condiciones/relaciones-de-pareja/

EN PATH: /en/neurodiversity/conditions/partner-relationships/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-156

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Relaciones seguras

EN TITLE: Safe relationships

ES CLASIFICACIÓN: apoyo

EN CLASSIFICATION: support

ES RESUMEN: Saber si una relación cuida o desgasta. Qué señales indican control, qué hace segura una relación y por qué los celos no son una prueba de amor.

EN SUMMARY: Knowing whether a relationship supports you or wears you down. Which signs point to control, what makes a relationship safe and why jealousy is not proof of love.

ES RUTA: /es/neurodiversidad/condiciones/relaciones-seguras/

EN PATH: /en/neurodiversity/conditions/safe-relationships/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-157

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Restaurantes y comer fuera

EN TITLE: Restaurants and eating out

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: El menú, el ruido, la espera y no saber qué va a llegar. Qué se puede mirar antes, qué se puede pedir y por qué comer fuera no es una prueba de flexibilidad.

EN SUMMARY: The menu, the noise, the wait and not knowing what will arrive. What can be checked beforehand, what can be requested and why eating out is not a test of flexibility.

ES RUTA: /es/neurodiversidad/condiciones/restaurantes-y-comer-fuera/

EN PATH: /en/neurodiversity/conditions/restaurants-and-eating-out/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-158

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Rumiación mental

EN TITLE: Rumination

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: El mismo pensamiento dando vueltas sin salida. Cuándo pensar deja de dar soluciones, qué corta la vuelta y por qué forzarse a no pensar la aumenta.

EN SUMMARY: The same thought going round and round without a way out. When thinking stops producing solutions, what interrupts the loop and why forcing yourself not to think can make it stronger.

ES RUTA: /es/neurodiversidad/condiciones/rumiacion-mental/

EN PATH: /en/neurodiversity/conditions/rumination/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-159

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Salir del armario

EN TITLE: Coming out

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Contarlo una vez, y otra, y otra. Qué implica salir del armario, por qué no ocurre una sola vez y qué hace que sea seguro hacerlo o no hacerlo.

EN SUMMARY: Telling people once, then again, and again. What coming out involves, why it does not happen only once and what makes it safe to do or not to do.

ES RUTA: /es/neurodiversidad/condiciones/salir-del-armario/

EN PATH: /en/neurodiversity/conditions/coming-out/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-160

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Salud gastrointestinal

EN TITLE: Gastrointestinal health

ES CLASIFICACIÓN: salud física

EN CLASSIFICATION: physical health

ES RESUMEN: Dolor de tripa, estreñimiento o reflujo que nadie mira. Qué se valora según el síntoma y por qué las dietas y los probióticos no tratan el autismo.

EN SUMMARY: Stomach pain, constipation or reflux that no one looks into. What is assessed according to the symptom and why diets and probiotics do not treat autism.

ES RUTA: /es/neurodiversidad/condiciones/salud-gastrointestinal/

EN PATH: /en/neurodiversity/conditions/gastrointestinal-health/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-161

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Seguridad online

EN TITLE: Online safety

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Estar en internet sin quedar expuesta. Qué proteger primero, cómo revisar contactos y privacidad, y por qué prohibir internet no es la respuesta.

EN SUMMARY: Being online without being left exposed. What to protect first, how to review contacts and privacy, and why banning the internet is not the answer.

ES RUTA: /es/neurodiversidad/condiciones/seguridad-online/

EN PATH: /en/neurodiversity/conditions/online-safety/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-162

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Selectividad alimentaria

EN TITLE: Selective eating

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Comer siempre lo mismo y muy poca variedad. Qué mantiene la seguridad nutricional, qué se prueba con calma y cuándo conviene una valoración clínica.

EN SUMMARY: Always eating the same foods and very little variety. What maintains nutritional safety, what can be tried gradually and when a clinical assessment is useful.

ES RUTA: /es/neurodiversidad/condiciones/selectividad-alimentaria/

EN PATH: /en/neurodiversity/conditions/selective-eating/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-163

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Sexualidad

EN TITLE: Sexuality

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Deseo, relaciones y atención sanitaria que respete. Qué información accesible hace falta, qué es una atención afirmativa y qué no determina el diagnóstico.

EN SUMMARY: Desire, relationships and healthcare that respects the person. Which accessible information is needed, what affirmative care is and what diagnosis does not determine.

ES RUTA: /es/neurodiversidad/condiciones/sexualidad/

EN PATH: /en/neurodiversity/conditions/sexuality/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-164

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Sistema vestibular

EN TITLE: Vestibular system

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: El movimiento, el mareo y buscar dar vueltas. Qué es el sistema vestibular, cuándo hay indicación clínica y por qué buscar movimiento no demuestra un trastorno.

EN SUMMARY: Movement, dizziness and seeking to spin. What the vestibular system is, when there is a clinical indication and why seeking movement does not prove a disorder.

ES RUTA: /es/neurodiversidad/condiciones/sistema-vestibular/

EN PATH: /en/neurodiversity/conditions/vestibular-system/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-165

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Sobrecarga sensorial

EN TITLE: Sensory overload

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Todo llega a la vez y el cuerpo se apaga. Qué previene la acumulación, qué señales avisan antes y por qué insistir en que se acostumbre no ayuda.

EN SUMMARY: Everything arrives at once and the body shuts down. What helps prevent build-up, which signs warn earlier and why insisting that someone gets used to it does not help.

ES RUTA: /es/neurodiversidad/condiciones/sobrecarga-sensorial/

EN PATH: /en/neurodiversity/conditions/sensory-overload/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-166

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Soledad

EN TITLE: Loneliness

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Estar rodeada de gente y sentirse sola igual. En qué se distingue estar solo de sentirse solo, y por qué obligar a socializar puede empeorarlo.

EN SUMMARY: Being surrounded by people and still feeling alone. How being alone differs from feeling lonely, and why forcing social contact can make it worse.

ES RUTA: /es/neurodiversidad/condiciones/soledad/

EN PATH: /en/neurodiversity/conditions/loneliness/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-167

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastornos de los sonidos del habla

EN TITLE: Speech sound disorders

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Cuesta entender lo que dice y ya no es por la edad. Qué son los trastornos de los sonidos del habla, cómo se valoran y qué ayuda, con ASHA citada.

EN SUMMARY: Other people struggle to understand what is being said and age no longer explains it. What speech sound disorders are, how they are assessed and what helps, with ASHA cited.

ES RUTA: /es/neurodiversidad/condiciones/trastornos-de-los-sonidos-del-habla/

EN PATH: /en/neurodiversity/conditions/speech-sound-disorders/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-168

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Stimming / autoestimulación

EN TITLE: Stimming / self-stimulation

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: Movimientos que calman, ordenan o descargan. Qué es el stimming, qué hacer si un movimiento hace daño y por qué suprimirlo agota sin mejorar nada.

EN SUMMARY: Movements that calm, organise or release tension. What stimming is, what to do if a movement causes harm and why suppressing it can be exhausting without improving anything.

ES RUTA: /es/neurodiversidad/condiciones/stimming-autoestimulacion/

EN PATH: /en/neurodiversity/conditions/stimming-self-stimulation/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-169

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Sueño

EN TITLE: Sleep

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: Dormir mal cada noche y arrastrarlo al día siguiente. Qué se puede cambiar, qué dice la evidencia sobre la melatonina y por qué la higiene del sueño no basta.

EN SUMMARY: Sleeping badly every night and carrying it into the next day. What can be changed, what the evidence says about melatonin and why sleep hygiene is not enough.

ES RUTA: /es/neurodiversidad/condiciones/sueno/

EN PATH: /en/neurodiversity/conditions/sleep/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-170

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Tartamudez

EN TITLE: Stuttering

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Sabe qué decir y la palabra se atasca. Qué es la tartamudez, qué intervención logopédica ayuda y por qué decir «habla despacio» no es tratamiento.

EN SUMMARY: Knowing what to say and the word gets stuck. What stuttering is, which speech and language intervention helps and why saying “speak slowly” is not treatment.

ES RUTA: /es/neurodiversidad/condiciones/tartamudez/

EN PATH: /en/neurodiversity/conditions/stuttering/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-171

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: TDAH

EN TITLE: ADHD

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Atención, impulso y organización que funcionan de otra manera. Qué es el TDAH, por qué se pasa por alto en niñas y mujeres, y qué apoyos ayudan.

EN SUMMARY: Attention, impulse control and organisation that work differently. What ADHD is, why it can be missed in girls and women, and which supports help.

ES RUTA: /es/neurodiversidad/condiciones/tdah/

EN PATH: /en/neurodiversity/conditions/adhd/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-172

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: TEAF / FASD

EN TITLE: FASD

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Dificultades que vienen de la exposición prenatal al alcohol. Qué es el TEAF, cómo se valora, qué apoyos ayudan y por qué no se explica por «mala conducta».

EN SUMMARY: Difficulties linked to prenatal alcohol exposure. What FASD is, how it is assessed, which supports help and why it is not explained by “bad behaviour”.

ES RUTA: /es/neurodiversidad/condiciones/teaf-fasd/

EN PATH: /en/neurodiversity/conditions/fasd/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-173

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: TEPT / trastorno por estrés postraumático

EN TITLE: PTSD / post-traumatic stress disorder

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Lo que pasó vuelve solo, en imágenes y sobresaltos. Qué es el estrés postraumático, cómo se reconoce y qué tratamientos ayudan, con la NICE NG116.

EN SUMMARY: What happened comes back on its own, in images and sudden startle responses. What PTSD is, how it is recognised and which treatments help, with NICE NG116 cited.

ES RUTA: /es/neurodiversidad/condiciones/tept-trastorno-por-estres-postraumatico/

EN PATH: /en/neurodiversity/conditions/ptsd-post-traumatic-stress-disorder/

ESTADO: BILINGUAL_COMPLETE

---

## 43.1 CONTROL DE PROGRESO

ES: Situaciones completas: 187/187. Condiciones incorporadas: 173/185.

EN: Situations complete: 187/187. Conditions added: 173/185.

SIGUIENTE REGISTRO: WEB-CONDITION-174

# 44. CORPUS WEB · IRIS GREEN · CONDICIONES · CIERRE

Estado: BILINGUAL_COMPLETE

Fuente canónica: `buscador.json` · rama `main` de Iris Green.

Regla aplicada: cada unidad aparece primero en español y justo debajo en inglés.

## WEB-CONDITION-174

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trastornos de tics

EN TITLE: Tic disorders

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Movimientos o sonidos que salen sin querer y cuesta frenar. Qué son los tics, cómo se valoran y qué ayuda cuando molestan, con las guías europeas.

EN SUMMARY: Movements or sounds that happen involuntarily and are hard to hold back. What tics are, how they are assessed and what helps when they are troublesome, with the European guidelines cited.

ES RUTA: /es/neurodiversidad/condiciones/trastornos-de-tics/

EN PATH: /en/neurodiversity/conditions/tic-disorders/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-175

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: TOC

EN TITLE: OCD

ES CLASIFICACIÓN: diagnóstico

EN CLASSIFICATION: diagnosis

ES RESUMEN: Dudas que vuelven y comprobaciones que no alivian. Qué es el TOC, cómo se reconoce y qué tratamiento tiene respaldo, con la guía clínica citada.

EN SUMMARY: Doubts that keep returning and checking that does not bring relief. What OCD is, how it is recognised and which treatment is supported, with the clinical guideline cited.

ES RUTA: /es/neurodiversidad/condiciones/toc/

EN PATH: /en/neurodiversity/conditions/ocd/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-176

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Toma de decisiones

EN TITLE: Decision-making

ES CLASIFICACIÓN: proceso

EN CLASSIFICATION: process

ES RESUMEN: Decidir con demasiadas opciones o demasiada prisa. Qué apoyo necesita cada decisión y por qué necesitar ayuda no autoriza a sustituir lo que la persona quiere.

EN SUMMARY: Making decisions with too many options or too much time pressure. What support each decision may need and why needing help does not authorise others to replace what the person wants.

ES RUTA: /es/neurodiversidad/condiciones/toma-de-decisiones/

EN PATH: /en/neurodiversity/conditions/decision-making/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-177

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Síndrome de Tourette

EN TITLE: Tourette syndrome

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: Movimientos y sonidos que salen sin querer. Qué es el Tourette, qué intervención conductual tiene respaldo y por qué pedir que pare no funciona.

EN SUMMARY: Movements and sounds that happen involuntarily. What Tourette syndrome is, which behavioural intervention is supported and why asking someone to stop does not work.

ES RUTA: /es/neurodiversidad/condiciones/sindrome-de-tourette/

EN PATH: /en/neurodiversity/conditions/tourette-syndrome/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-178

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Trans

EN TITLE: Trans

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: La identidad no coincide con el sexo asignado al nacer. Qué describe la palabra trans y por qué el cambio de nombre debe llegar a todos los servicios a la vez.

EN SUMMARY: Gender identity does not match the sex assigned at birth. What the word trans describes and why a name change should reach every service at the same time.

ES RUTA: /es/neurodiversidad/condiciones/trans/

EN PATH: /en/neurodiversity/conditions/trans/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-179

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Transición social

EN TITLE: Social transition

ES CLASIFICACIÓN: identidad

EN CLASSIFICATION: identity

ES RESUMEN: Cambiar nombre, trato y presentación en el día a día. Qué incluye una transición social, qué apoya la persona y qué revisar en familia, escuela o trabajo.

EN SUMMARY: Changing name, form of address and presentation in everyday life. What a social transition includes, what the person wants supported and what to review in family, school or work settings.

ES RUTA: /es/neurodiversidad/condiciones/transicion-social/

EN PATH: /en/neurodiversity/conditions/social-transition/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-180

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Transporte público y desplazamientos

EN TITLE: Public transport and travel

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: El metro, el bus y los cambios de última hora. Qué planificar, qué apoyos de orientación existen y por qué la accesibilidad es del sistema, no de la persona.

EN SUMMARY: The underground, the bus and last-minute changes. What to plan, which navigation supports exist and why accessibility belongs to the system, not the person.

ES RUTA: /es/neurodiversidad/condiciones/transporte-publico-y-desplazamientos/

EN PATH: /en/neurodiversity/conditions/public-transport-and-travel/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-181

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Universidad

EN TITLE: University

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Estudiar fuera de casa con toda la organización encima. Qué ajustes académicos se piden y dónde, y por qué usar adaptaciones no baja el nivel.

EN SUMMARY: Studying away from home with all the organisation that comes with it. Which academic adjustments can be requested and where, and why using accommodations does not lower the standard.

ES RUTA: /es/neurodiversidad/condiciones/universidad/

EN PATH: /en/neurodiversity/conditions/university/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-182

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Vergüenza

EN TITLE: Shame

ES CLASIFICACIÓN: experiencia

EN CLASSIFICATION: experience

ES RESUMEN: No haber hecho algo mal y sentirse el error. En qué se distingue de la culpa, qué ayuda a salir del aislamiento y por qué no se usa para educar.

EN SUMMARY: Not having done something wrong and still feeling like you are the mistake. How shame differs from guilt, what helps reduce isolation and why it should not be used to teach.

ES RUTA: /es/neurodiversidad/condiciones/verguenza/

EN PATH: /en/neurodiversity/conditions/shame/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-183

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Viajes

EN TITLE: Travel

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Un viaje que agota más de lo que descansa. Qué anticipar del itinerario, cuánto tiempo de recuperación reservar y por qué repetir rutinas no lo estropea.

EN SUMMARY: A trip that is more exhausting than restful. What to anticipate in the itinerary, how much recovery time to reserve and why repeating routines does not spoil the trip.

ES RUTA: /es/neurodiversidad/condiciones/viajes/

EN PATH: /en/neurodiversity/conditions/travel/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-184

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Vivienda

EN TITLE: Housing

ES CLASIFICACIÓN: contexto

EN CLASSIFICATION: context

ES RESUMEN: Dónde y con quién se vive cambia el descanso entero. Qué apoyos domiciliarios existen, qué mirar de un piso y por qué no es solo cuestión de habilidades.

EN SUMMARY: Where and with whom a person lives changes the whole pattern of rest. Which home supports exist, what to look at in a home and why this is not only a question of skills.

ES RUTA: /es/neurodiversidad/condiciones/vivienda/

EN PATH: /en/neurodiversity/conditions/housing/

ESTADO: BILINGUAL_COMPLETE

---

## WEB-CONDITION-185

ES TIPO: Condición

EN TYPE: Condition

ES TÍTULO: Síndrome X frágil

EN TITLE: Fragile X syndrome

ES CLASIFICACIÓN: desarrollo

EN CLASSIFICATION: development

ES RESUMEN: La causa hereditaria más frecuente de discapacidad intelectual. Qué es el síndrome X frágil, qué apoyos ayudan y qué se investiga hoy sobre la causa genética.

EN SUMMARY: The most common inherited cause of intellectual disability. What fragile X syndrome is, which supports help and what is currently being researched about the genetic cause.

ES RUTA: /es/neurodiversidad/condiciones/sindrome-x-fragil/

EN PATH: /en/neurodiversity/conditions/fragile-x-syndrome/

ESTADO: BILINGUAL_COMPLETE

---

## 44.1 CIERRE DEL CATÁLOGO PRINCIPAL

ES: Situaciones completas: 187/187. Condiciones completas: 185/185. Catálogo principal bilingüe total: 372/372.

EN: Situations complete: 187/187. Conditions complete: 185/185. Total bilingual main catalogue: 372/372.

ESTADO: SECTION_COMPLETE

SIGUIENTE FASE: ampliar el mismo MD con corpus web complementario, microcopy, herramientas, recursos, fragmentos y conocimiento conversacional general.

# 45. CORPUS WEB COMPLEMENTARIO · TARJETA IRIS · «NECESITO / I NEED»

FUENTE: `editorial/tarjetas-necesito-condiciones.json` · rama `main` de Iris Green.

ES NOTA DE FUENTE: Bloque «Necesito» de la Tarjeta Iris. Tanda 2 de 3: Condiciones. Pendiente en la fuente: Situaciones (187).

EN SOURCE NOTE: «I need» block of the Iris Card. Batch 2 of 3: Conditions. Pending in the source: Situations (187).

ES REGLA EDITORIAL: El título del apartado ya es «Necesito», así que no se repite en el texto. Máximo 2 frases y unas 14 palabras. Frases cortas, una idea por frase, verbos claros y palabras de todos los días. Todo en positivo: digo qué necesito. Sin etiquetas, defensas, abstracciones ni palabras vagas. Sin muletillas. La segunda frase no empieza por «Y». Evitar «a veces», «así», «luego», «cuando lo pida» y «un poco». No usar «Me ayuda».

EN EDITORIAL RULE: The section title is already «I need», so it is not repeated in the text. Maximum 2 sentences and about 14 words. Use short sentences, one idea per sentence, clear verbs and everyday words. State what is needed in positive terms. Avoid labels, defensive wording, abstract language, vague words and filler phrases. The second sentence does not start with «And». Do not use «It helps me».

ESTADO DE LA COLECCIÓN: BILINGUAL_COMPLETE

# 46. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-001

ES TEMA: Abuso y explotación

EN TOPIC: Abuse and exploitation

ES NECESITO: Estar en un sitio seguro. Ayúdame a contactar con una persona de confianza.

EN I NEED: A safe place. Help me contact someone I trust.

ES RUTA: /es/neurodiversidad/condiciones/abuso-y-explotacion/

EN PATH: /en/neurodiversity/conditions/abuse-and-exploitation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-002

ES TEMA: Acceso a apoyos

EN TOPIC: Access to support

ES NECESITO: Información clara sobre las ayudas. Acompáñame con los formularios.

EN I NEED: Clear information about available support. Help me with the forms.

ES RUTA: /es/neurodiversidad/condiciones/acceso-a-apoyos/

EN PATH: /en/neurodiversity/conditions/access-to-support/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-003

ES TEMA: Acoso escolar / bullying

EN TOPIC: School bullying

ES NECESITO: Que apuntes lo ocurrido con fechas. Activa el protocolo del centro.

EN I NEED: Write down what happened and the dates. Start the school's bullying procedure.

ES RUTA: /es/neurodiversidad/condiciones/acoso-escolar-bullying/

EN PATH: /en/neurodiversity/conditions/school-bullying/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-004

ES TEMA: Actividad física y movimiento

EN TOPIC: Physical activity and movement

ES NECESITO: Elegir el ejercicio que hago. Adaptarlo a la energía que tengo hoy.

EN I NEED: To choose the exercise I do. Adjust it to my energy today.

ES RUTA: /es/neurodiversidad/condiciones/actividad-fisica-y-movimiento/

EN PATH: /en/neurodiversity/conditions/physical-activity-and-movement/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-005

ES TEMA: Agénero

EN TOPIC: Agender

ES NECESITO: Dejar la casilla de género vacía. Escríbeme sin usar señor ni señora.

EN I NEED: To leave the gender box blank. Write to me without using Mr or Ms.

ES RUTA: /es/neurodiversidad/condiciones/agenero/

EN PATH: /en/neurodiversity/conditions/agender/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-006

ES TEMA: Agorafobia

EN TOPIC: Agoraphobia

ES NECESITO: Salir poco a poco y a mi ritmo. Acompáñame las primeras veces.

EN I NEED: To go out gradually and at my own pace. Come with me at first.

ES RUTA: /es/neurodiversidad/condiciones/agorafobia/

EN PATH: /en/neurodiversity/conditions/agoraphobia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-007

ES TEMA: Alexitimia

EN TOPIC: Alexithymia

ES NECESITO: Que me preguntes qué noto en el cuerpo. Dame varias opciones para responder.

EN I NEED: Ask what I notice in my body. Give me several options to answer.

ES RUTA: /es/neurodiversidad/condiciones/alexitimia/

EN PATH: /en/neurodiversity/conditions/alexithymia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-008

ES TEMA: Alta sensibilidad / SPS

EN TOPIC: Sensory processing sensitivity / SPS

ES NECESITO: Menos ruido y luz a mi alrededor. Pregúntame cómo estoy hoy.

EN I NEED: Less noise and light around me. Ask how I am today.

ES RUTA: /es/neurodiversidad/condiciones/alta-sensibilidad-sps/

EN PATH: /en/neurodiversity/conditions/sensory-processing-sensitivity-sps/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-009

ES TEMA: Altas capacidades

EN TOPIC: Giftedness / high ability

ES NECESITO: Aprender a mi ritmo y con retos. Ten en cuenta también cómo me siento.

EN I NEED: To learn at my own pace with challenges. Consider how I feel too.

ES RUTA: /es/neurodiversidad/condiciones/altas-capacidades/

EN PATH: /en/neurodiversity/conditions/giftedness-high-ability/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-010

ES TEMA: Amistad

EN TOPIC: Friendship

ES NECESITO: Acordar cuándo hablamos. Prefiero quedar para hacer algo que nos guste a los dos.

EN I NEED: To agree when we talk. I prefer short plans around something we both enjoy.

ES RUTA: /es/neurodiversidad/condiciones/amistad/

EN PATH: /en/neurodiversity/conditions/friendship/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-011

ES TEMA: Amnesia disociativa

EN TOPIC: Dissociative amnesia

ES NECESITO: Un lugar seguro y apoyo profesional. Ve despacio conmigo.

EN I NEED: A safe place and professional support. Take things slowly with me.

ES RUTA: /es/neurodiversidad/condiciones/amnesia-disociativa/

EN PATH: /en/neurodiversity/conditions/dissociative-amnesia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-012

ES TEMA: Animales

EN TOPIC: Animals

ES NECESITO: Tiempo con animales. Ayúdame a organizar su comida, paseos y cuidados.

EN I NEED: Time with animals. Help me organise their food, walks and care.

ES RUTA: /es/neurodiversidad/condiciones/animales/

EN PATH: /en/neurodiversity/conditions/animals/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-013

ES TEMA: Anorexia nerviosa

EN TOPIC: Anorexia nervosa

ES NECESITO: Atención de un equipo especializado. Comer en un ambiente tranquilo.

EN I NEED: Support from a specialist team. A calm environment at mealtimes.

ES RUTA: /es/neurodiversidad/condiciones/anorexia-nerviosa/

EN PATH: /en/neurodiversity/conditions/anorexia-nervosa/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-014

ES TEMA: Ansiedad

EN TOPIC: Anxiety

ES NECESITO: Apoyo profesional. Explícame cada paso antes de empezar.

EN I NEED: Professional support. Explain each step before we start.

ES RUTA: /es/neurodiversidad/condiciones/ansiedad/

EN PATH: /en/neurodiversity/conditions/anxiety/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-015

ES TEMA: Apraxia del habla infantil

EN TOPIC: Childhood apraxia of speech

ES NECESITO: Practicar el habla con logopedia. Dame tiempo para responder.

EN I NEED: Speech practice with a speech and language therapist. Give me time to respond.

ES RUTA: /es/neurodiversidad/condiciones/apraxia-del-habla-infantil/

EN PATH: /en/neurodiversity/conditions/childhood-apraxia-of-speech/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-016

ES TEMA: ARFID

EN TOPIC: ARFID

ES NECESITO: Comer suficiente con apoyo profesional. Mantener los alimentos que ya como.

EN I NEED: Enough food with professional support. Keep the foods I already eat.

ES RUTA: /es/neurodiversidad/condiciones/arfid/

EN PATH: /en/neurodiversity/conditions/arfid/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-017

ES TEMA: Aromanticismo

EN TOPIC: Aromanticism

ES NECESITO: Elegir quién será mi contacto de emergencia. También puede ser una amistad.

EN I NEED: To choose my emergency contact. It can also be a friend.

ES RUTA: /es/neurodiversidad/condiciones/aromanticismo/

EN PATH: /en/neurodiversity/conditions/aromanticism/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-018

ES TEMA: Arte y creación

EN TOPIC: Art and creativity

ES NECESITO: Materiales y tiempo para crear. Déjame hacerlo a mi manera.

EN I NEED: Materials and time to create. Let me do it my way.

ES RUTA: /es/neurodiversidad/condiciones/arte-y-creacion/

EN PATH: /en/neurodiversity/conditions/art-and-creativity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-019

ES TEMA: Asexualidad

EN TOPIC: Asexuality

ES NECESITO: Que respetes la orientación que yo indico. Pregúntame antes de hacer suposiciones.

EN I NEED: Respect the orientation I give you. Ask before making assumptions.

ES RUTA: /es/neurodiversidad/condiciones/asexualidad/

EN PATH: /en/neurodiversity/conditions/asexuality/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-020

ES TEMA: Ataque de pánico

EN TOPIC: Panic attack

ES NECESITO: Un sitio tranquilo hasta que pase. Quédate cerca y habla despacio.

EN I NEED: A quiet place until it passes. Stay nearby and speak slowly.

ES RUTA: /es/neurodiversidad/condiciones/ataque-de-panico/

EN PATH: /en/neurodiversity/conditions/panic-attack/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 001–020

ES: Microcopy bilingüe «Necesito» incorporado: 20 registros.

EN: Bilingual «I need» microcopy added: 20 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-021

# 47. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-021

ES TEMA: AuDHD

EN TOPIC: AuDHD

ES NECESITO: Apoyos para el autismo y el TDAH. Elegimos juntos cuáles me sirven.

EN I NEED: Support for both autism and ADHD. Let's choose together what works for me.

ES RUTA: /es/neurodiversidad/condiciones/audhd/

EN PATH: /en/neurodiversity/conditions/audhd/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-022

ES TEMA: Autismo

EN TOPIC: Autism

ES NECESITO: Elegir contigo mis apoyos. Cuida la luz, el ruido y los cambios.

EN I NEED: To choose my support with you. Consider light, noise and changes.

ES RUTA: /es/neurodiversidad/condiciones/autismo/

EN PATH: /en/neurodiversity/conditions/autism/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-023

ES TEMA: Autoaceptación

EN TOPIC: Self-acceptance

ES NECESITO: Tiempo para entenderme. Escúchame mientras explico cómo me siento.

EN I NEED: Time to understand myself. Listen while I explain how I feel.

ES RUTA: /es/neurodiversidad/condiciones/autoaceptacion/

EN PATH: /en/neurodiversity/conditions/self-acceptance/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-024

ES TEMA: Autocompasión

EN TOPIC: Self-compassion

ES NECESITO: Tratarme con más amabilidad. Recuérdame hablarme con calma después de un error.

EN I NEED: To be kinder to myself. Remind me to speak gently to myself after a mistake.

ES RUTA: /es/neurodiversidad/condiciones/autocompasion/

EN PATH: /en/neurodiversity/conditions/self-compassion/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-025

ES TEMA: Autoconcepto

EN TOPIC: Self-concept

ES NECESITO: Información clara sobre mis puntos fuertes y mis dificultades.

EN I NEED: Clear information about my strengths and difficulties.

ES RUTA: /es/neurodiversidad/condiciones/autoconcepto/

EN PATH: /en/neurodiversity/conditions/self-concept/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-026

ES TEMA: Autoconfianza

EN TOPIC: Self-confidence

ES NECESITO: Metas que pueda alcanzar. Dime exactamente qué he hecho bien.

EN I NEED: Goals I can reach. Tell me exactly what I did well.

ES RUTA: /es/neurodiversidad/condiciones/autoconfianza/

EN PATH: /en/neurodiversity/conditions/self-confidence/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-027

ES TEMA: Autodefensa / self-advocacy

EN TOPIC: Self-advocacy

ES NECESITO: Conocer mis derechos con palabras claras. Ensayemos cómo pedir un apoyo.

EN I NEED: To know my rights in clear words. Let's practise asking for support.

ES RUTA: /es/neurodiversidad/condiciones/autodefensa-self-advocacy/

EN PATH: /en/neurodiversity/conditions/self-advocacy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-028

ES TEMA: Autoestima

EN TOPIC: Self-esteem

ES NECESITO: Estar con personas que me traten bien. Dime qué valoras de mí.

EN I NEED: To be around people who treat me well. Tell me what you value about me.

ES RUTA: /es/neurodiversidad/condiciones/autoestima/

EN PATH: /en/neurodiversity/conditions/self-esteem/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-029

ES TEMA: Autonomía

EN TOPIC: Autonomy

ES NECESITO: Elegir entre opciones reales. Dame tiempo para decidir.

EN I NEED: Real choices. Give me time to decide.

ES RUTA: /es/neurodiversidad/condiciones/autonomia/

EN PATH: /en/neurodiversity/conditions/autonomy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-030

ES TEMA: Bigénero

EN TOPIC: Bigender

ES NECESITO: Que escribas mi género como yo lo indico. Pregúntame cómo quiero que aparezca.

EN I NEED: Write my gender as I describe it. Ask how I want it recorded.

ES RUTA: /es/neurodiversidad/condiciones/bigenero/

EN PATH: /en/neurodiversity/conditions/bigender/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-031

ES TEMA: Bisexualidad

EN TOPIC: Bisexuality

ES NECESITO: Que escribas mi orientación tal como yo la indico.

EN I NEED: Record my orientation exactly as I describe it.

ES RUTA: /es/neurodiversidad/condiciones/bisexualidad/

EN PATH: /en/neurodiversity/conditions/bisexuality/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-032

ES TEMA: Bulimia nerviosa

EN TOPIC: Bulimia nervosa

ES NECESITO: Tratamiento especializado. Apoyo para acudir a las citas.

EN I NEED: Specialist treatment. Support to attend appointments.

ES RUTA: /es/neurodiversidad/condiciones/bulimia-nerviosa/

EN PATH: /en/neurodiversity/conditions/bulimia-nervosa/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-033

ES TEMA: Burnout autista

EN TOPIC: Autistic burnout

ES NECESITO: Reducir mis actividades durante un tiempo. Reservar horas para descansar.

EN I NEED: Fewer activities for a while. Set aside time for rest.

ES RUTA: /es/neurodiversidad/condiciones/burnout-autista/

EN PATH: /en/neurodiversity/conditions/autistic-burnout/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-034

ES TEMA: CAA / comunicación aumentativa y alternativa

EN TOPIC: AAC / augmentative and alternative communication

ES NECESITO: Usar mi sistema de comunicación en cualquier lugar. Respóndeme por esa misma vía.

EN I NEED: To use my communication system everywhere. Reply through the same method.

ES RUTA: /es/neurodiversidad/condiciones/caa-comunicacion-aumentativa-y-alternativa/

EN PATH: /en/neurodiversity/conditions/aac-augmentative-and-alternative-communication/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-035

ES TEMA: Cambios familiares

EN TOPIC: Family changes

ES NECESITO: Saber qué va a cambiar y qué seguirá igual. Cuéntamelo con tiempo.

EN I NEED: To know what will change and what will stay the same. Tell me in advance.

ES RUTA: /es/neurodiversidad/condiciones/cambios-familiares/

EN PATH: /en/neurodiversity/conditions/family-changes/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-036

ES TEMA: Carga cognitiva

EN TOPIC: Cognitive load

ES NECESITO: Una tarea cada vez. Escribe lo importante para que pueda consultarlo.

EN I NEED: One task at a time. Write down important information so I can check it.

ES RUTA: /es/neurodiversidad/condiciones/carga-cognitiva/

EN PATH: /en/neurodiversity/conditions/cognitive-load/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-037

ES TEMA: Ciberacoso (cyberbullying)

EN TOPIC: Cyberbullying

ES NECESITO: Guardar las pruebas y bloquear la cuenta. Acompáñame a denunciarlo.

EN I NEED: Save the evidence and block the account. Come with me to report it.

ES RUTA: /es/neurodiversidad/condiciones/ciberacoso-cyberbullying/

EN PATH: /en/neurodiversity/conditions/cyberbullying/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-038

ES TEMA: Citas médicas

EN TOPIC: Medical appointments

ES NECESITO: Saber qué ocurrirá en la cita. Poder ir con una persona de apoyo.

EN I NEED: To know what will happen at the appointment. To bring someone for support.

ES RUTA: /es/neurodiversidad/condiciones/citas-medicas/

EN PATH: /en/neurodiversity/conditions/medical-appointments/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-039

ES TEMA: Cocinar

EN TOPIC: Cooking

ES NECESITO: La receta dividida en pasos. Preparar los ingredientes antes de encender el fuego.

EN I NEED: The recipe split into steps. Prepare the ingredients before turning on the cooker.

ES RUTA: /es/neurodiversidad/condiciones/cocinar/

EN PATH: /en/neurodiversity/conditions/cooking/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-040

ES TEMA: Compras

EN TOPIC: Shopping

ES NECESITO: Una lista preparada y una hora tranquila. Poder salir si me canso.

EN I NEED: A prepared list and a quiet time. To leave if I get tired.

ES RUTA: /es/neurodiversidad/condiciones/compras/

EN PATH: /en/neurodiversity/conditions/shopping/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 021–040

ES: Microcopy bilingüe «Necesito» incorporado: 40 registros.

EN: Bilingual «I need» microcopy added: 40 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-041

# 48. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-041

ES TEMA: Comunicación en pareja

EN TOPIC: Communication in a relationship

ES NECESITO: Decir claramente qué esperamos. Dame tiempo para pensar antes de responder.

EN I NEED: To say clearly what we expect. Give me time to think before I reply.

ES RUTA: /es/neurodiversidad/condiciones/comunicacion-en-pareja/

EN PATH: /en/neurodiversity/conditions/communication-in-a-relationship/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-042

ES TEMA: Comunicación sin habla oral

EN TOPIC: Communication without spoken language

ES NECESITO: Comunicarme con gestos, escritura o mi dispositivo. Espera mi respuesta.

EN I NEED: To communicate with gestures, writing or my device. Wait for my response.

ES RUTA: /es/neurodiversidad/condiciones/comunicacion-sin-habla-oral/

EN PATH: /en/neurodiversity/conditions/communication-without-spoken-language/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-043

ES TEMA: Conducir

EN TOPIC: Driving

ES NECESITO: Clases con instrucciones claras. Revisar mi cansancio antes de conducir.

EN I NEED: Lessons with clear instructions. Check my tiredness before I drive.

ES RUTA: /es/neurodiversidad/condiciones/conducir/

EN PATH: /en/neurodiversity/conditions/driving/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-044

ES TEMA: Conflictos

EN TOPIC: Conflict

ES NECESITO: Una pausa si empiezo a hablar muy alto. Retomar la conversación con calma.

EN I NEED: A pause if I start speaking very loudly. Continue the conversation calmly afterwards.

ES RUTA: /es/neurodiversidad/condiciones/conflictos/

EN PATH: /en/neurodiversity/conditions/conflict/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-045

ES TEMA: Consentimiento

EN TOPIC: Consent

ES NECESITO: Información clara antes de decidir. Que respetes tanto mi sí como mi no.

EN I NEED: Clear information before I decide. Respect both my yes and my no.

ES RUTA: /es/neurodiversidad/condiciones/consentimiento/

EN PATH: /en/neurodiversity/conditions/consent/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-046

ES TEMA: Creatividad

EN TOPIC: Creativity

ES NECESITO: Tiempo y materiales para probar ideas. Deja que elija cómo hacerlo.

EN I NEED: Time and materials to try ideas. Let me choose how to do it.

ES RUTA: /es/neurodiversidad/condiciones/creatividad/

EN PATH: /en/neurodiversity/conditions/creativity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-047

ES TEMA: Culpa

EN TOPIC: Guilt

ES NECESITO: Saber qué hice yo y qué hicieron los demás. Ayúdame a reparar mi parte.

EN I NEED: To know what I did and what others did. Help me repair my part.

ES RUTA: /es/neurodiversidad/condiciones/culpa/

EN PATH: /en/neurodiversity/conditions/guilt/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-048

ES TEMA: Deadnaming

EN TOPIC: Deadnaming

ES NECESITO: Que uses mi nombre actual. Si te equivocas, corrígelo y continúa.

EN I NEED: Use my current name. If you make a mistake, correct it and continue.

ES RUTA: /es/neurodiversidad/condiciones/deadnaming/

EN PATH: /en/neurodiversity/conditions/deadnaming/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-049

ES TEMA: Dentista

EN TOPIC: Dental care

ES NECESITO: Saber antes qué vas a hacer. Para si levanto la mano.

EN I NEED: To know what you will do beforehand. Stop if I raise my hand.

ES RUTA: /es/neurodiversidad/condiciones/dentista/

EN PATH: /en/neurodiversity/conditions/dental-care/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-050

ES TEMA: Dependencia y necesidades de apoyo

EN TOPIC: Dependence and support needs

ES NECESITO: Decir en qué tareas quiero ayuda. Pregúntame antes de hacerlas por mí.

EN I NEED: To say which tasks I want help with. Ask before doing them for me.

ES RUTA: /es/neurodiversidad/condiciones/dependencia-y-necesidades-de-apoyo/

EN PATH: /en/neurodiversity/conditions/dependence-and-support-needs/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-051

ES TEMA: Deporte

EN TOPIC: Sport

ES NECESITO: Elegir el deporte y el lugar. Adapta las reglas cuando lo pida.

EN I NEED: To choose the sport and the place. Adapt the rules when I ask.

ES RUTA: /es/neurodiversidad/condiciones/deporte/

EN PATH: /en/neurodiversity/conditions/sport/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-052

ES TEMA: Depresión

EN TOPIC: Depression

ES NECESITO: Apoyo profesional. Quédate conmigo aunque no tenga ganas de hablar.

EN I NEED: Professional support. Stay with me even if I do not feel like talking.

ES RUTA: /es/neurodiversidad/condiciones/depresion/

EN PATH: /en/neurodiversity/conditions/depression/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-053

ES TEMA: Descanso y recuperación

EN TOPIC: Rest and recovery

ES NECESITO: Ratos sin tareas ni planes. Reserva ese tiempo en mi agenda.

EN I NEED: Time with no tasks or plans. Keep that time free in my diary.

ES RUTA: /es/neurodiversidad/condiciones/descanso-y-recuperacion/

EN PATH: /en/neurodiversity/conditions/rest-and-recovery/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-054

ES TEMA: Diagnóstico tardío

EN TOPIC: Late diagnosis

ES NECESITO: Tiempo para revisar mi historia. Decidir a quién cuento mi diagnóstico.

EN I NEED: Time to review my history. To choose who I tell about my diagnosis.

ES RUTA: /es/neurodiversidad/condiciones/diagnostico-tardio/

EN PATH: /en/neurodiversity/conditions/late-diagnosis/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-055

ES TEMA: Diferencias sensoriales

EN TOPIC: Sensory differences

ES NECESITO: Ajustar la luz, el ruido y la ropa. Pregúntame qué me viene bien hoy.

EN I NEED: Adjustments to light, noise and clothing. Ask what suits me today.

ES RUTA: /es/neurodiversidad/condiciones/diferencias-sensoriales/

EN PATH: /en/neurodiversity/conditions/sensory-differences/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-056

ES TEMA: Dificultades de asistencia escolar

EN TOPIC: School attendance difficulties

ES NECESITO: Volver al colegio poco a poco. Coordinar un plan entre familia, centro y sanidad.

EN I NEED: To return to school gradually. A shared plan between family, school and healthcare.

ES RUTA: /es/neurodiversidad/condiciones/dificultades-de-asistencia-escolar/

EN PATH: /en/neurodiversity/conditions/school-attendance-difficulties/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-057

ES TEMA: Dinero y vida diaria

EN TOPIC: Money and everyday life

ES NECESITO: Pagos automáticos y avisos en el móvil. Revisar las cuentas contigo.

EN I NEED: Automatic payments and phone reminders. To review my accounts with you.

ES RUTA: /es/neurodiversidad/condiciones/dinero-y-vida-diaria/

EN PATH: /en/neurodiversity/conditions/money-and-everyday-life/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-058

ES TEMA: Discalculia

EN TOPIC: Dyscalculia

ES NECESITO: Calculadora y números a la vista. Explícame cada paso las veces necesarias.

EN I NEED: A calculator and numbers in view. Explain each step as many times as needed.

ES RUTA: /es/neurodiversidad/condiciones/discalculia/

EN PATH: /en/neurodiversity/conditions/dyscalculia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-059

ES TEMA: Discapacidad intelectual

EN TOPIC: Intellectual disability

ES NECESITO: Información en lectura fácil. Apoyo en las tareas que yo elija.

EN I NEED: Easy Read information. Support with the tasks I choose.

ES RUTA: /es/neurodiversidad/condiciones/discapacidad-intelectual/

EN PATH: /en/neurodiversity/conditions/intellectual-disability/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-060

ES TEMA: Discapacidad

EN TOPIC: Disability

ES NECESITO: Quitar las barreras del lugar. Pregúntame cuáles me dificultan participar.

EN I NEED: Remove barriers in the place. Ask which ones make it harder for me to take part.

ES RUTA: /es/neurodiversidad/condiciones/discapacidad/

EN PATH: /en/neurodiversity/conditions/disability/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 041–060

ES: Microcopy bilingüe «Necesito» incorporado: 60 registros.

EN: Bilingual «I need» microcopy added: 60 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-061

# 49. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-061

ES TEMA: Discapacidades del desarrollo

EN TOPIC: Developmental disabilities

ES NECESITO: Apoyos desde la infancia hasta la edad adulta. Revisarlos cuando cambien mis necesidades.

EN I NEED: Support from childhood into adulthood. Review it as my needs change.

ES RUTA: /es/neurodiversidad/condiciones/discapacidades-del-desarrollo/

EN PATH: /en/neurodiversity/conditions/developmental-disabilities/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-062

ES TEMA: Discriminación

EN TOPIC: Discrimination

ES NECESITO: Que apuntes lo ocurrido. Dime dónde puedo reclamar y cómo hacerlo.

EN I NEED: Write down what happened. Tell me where and how I can make a complaint.

ES RUTA: /es/neurodiversidad/condiciones/discriminacion/

EN PATH: /en/neurodiversity/conditions/discrimination/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-063

ES TEMA: Disforia de género

EN TOPIC: Gender dysphoria

ES NECESITO: Atención que respete mi identidad. Decidir el ritmo de cada paso.

EN I NEED: Care that respects my identity. To choose the pace of each step.

ES RUTA: /es/neurodiversidad/condiciones/disforia-de-genero/

EN PATH: /en/neurodiversity/conditions/gender-dysphoria/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-064

ES TEMA: Disgrafía

EN TOPIC: Dysgraphia

ES NECESITO: Escribir con ordenador. Más tiempo si tengo que escribir a mano.

EN I NEED: To type on a computer. More time if I have to write by hand.

ES RUTA: /es/neurodiversidad/condiciones/disgrafia/

EN PATH: /en/neurodiversity/conditions/dysgraphia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-065

ES TEMA: Dislexia

EN TOPIC: Dyslexia

ES NECESITO: Letra clara y más tiempo para leer. Dime también en voz alta lo importante.

EN I NEED: Clear print and more time to read. Tell me important information aloud too.

ES RUTA: /es/neurodiversidad/condiciones/dislexia/

EN PATH: /en/neurodiversity/conditions/dyslexia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-066

ES TEMA: Disociación

EN TOPIC: Dissociation

ES NECESITO: Ayuda para volver al presente con calma. Nombra objetos que haya en la habitación.

EN I NEED: Help to return to the present calmly. Name objects you can see in the room.

ES RUTA: /es/neurodiversidad/condiciones/disociacion/

EN PATH: /en/neurodiversity/conditions/dissociation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-067

ES TEMA: Doble excepcionalidad

EN TOPIC: Twice-exceptionality

ES NECESITO: Retos para aprender y apoyos para mis dificultades al mismo tiempo.

EN I NEED: Challenges for learning and support for my difficulties at the same time.

ES RUTA: /es/neurodiversidad/condiciones/doble-excepcionalidad/

EN PATH: /en/neurodiversity/conditions/twice-exceptionality/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-068

ES TEMA: Dolor persistente (dolor crónico)

EN TOPIC: Persistent pain / chronic pain

ES NECESITO: Moverme a mi ritmo. Pausas o cambios de actividad si el dolor aumenta.

EN I NEED: To move at my own pace. Breaks or activity changes if the pain increases.

ES RUTA: /es/neurodiversidad/condiciones/dolor-persistente-dolor-cronico/

EN PATH: /en/neurodiversity/conditions/persistent-pain-chronic-pain/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-069

ES TEMA: Dolor: reconocerlo y comunicarlo

EN TOPIC: Pain: recognising and communicating it

ES NECESITO: Preguntas concretas sobre el dolor. Poder señalar dónde me duele.

EN I NEED: Specific questions about pain. To point to where it hurts.

ES RUTA: /es/neurodiversidad/condiciones/dolor-reconocerlo-y-comunicarlo/

EN PATH: /en/neurodiversity/conditions/pain-recognising-and-communicating-it/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-070

ES TEMA: Duelo

EN TOPIC: Grief

ES NECESITO: Vivir el duelo a mi manera. Saber qué pasará en los próximos días.

EN I NEED: To grieve in my own way. To know what will happen in the next few days.

ES RUTA: /es/neurodiversidad/condiciones/duelo/

EN PATH: /en/neurodiversity/conditions/grief/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-071

ES TEMA: Ecolalia

EN TOPIC: Echolalia

ES NECESITO: Repetir palabras para entenderlas mejor. Dame tiempo antes de responder.

EN I NEED: To repeat words to understand them better. Give me time before I reply.

ES RUTA: /es/neurodiversidad/condiciones/ecolalia/

EN PATH: /en/neurodiversity/conditions/echolalia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-072

ES TEMA: Educación sexual

EN TOPIC: Sexuality education

ES NECESITO: Información clara sobre el cuerpo y el consentimiento. Usa los nombres correctos de cada parte.

EN I NEED: Clear information about the body and consent. Use the correct names for body parts.

ES RUTA: /es/neurodiversidad/condiciones/educacion-sexual/

EN PATH: /en/neurodiversity/conditions/sexuality-education/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-073

ES TEMA: Empleo y neurodiversidad

EN TOPIC: Employment and neurodiversity

ES NECESITO: Instrucciones claras en el trabajo. Saber qué ajustes puedo pedir.

EN I NEED: Clear instructions at work. To know what adjustments I can ask for.

ES RUTA: /es/neurodiversidad/condiciones/empleo-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/employment-and-neurodiversity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-074

ES TEMA: Enfado e ira

EN TOPIC: Anger

ES NECESITO: Una pausa si me enfado. Retomar la conversación después, con más calma.

EN I NEED: A pause if I get angry. Continue the conversation later, more calmly.

ES RUTA: /es/neurodiversidad/condiciones/enfado-e-ira/

EN PATH: /en/neurodiversity/conditions/anger/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-075

ES TEMA: Envejecimiento neurodivergente

EN TOPIC: Neurodivergent ageing

ES NECESITO: Mantener mis apoyos al hacerme mayor. Planificar con tiempo los cambios que pueda necesitar.

EN I NEED: To keep my support as I get older. Plan possible changes in advance.

ES RUTA: /es/neurodiversidad/condiciones/envejecimiento-neurodivergente/

EN PATH: /en/neurodiversity/conditions/neurodivergent-ageing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-076

ES TEMA: Epilepsia

EN TOPIC: Epilepsy

ES NECESITO: Que sepas qué hacer durante una crisis. Tener apuntada mi medicación de rescate.

EN I NEED: Know what to do during a seizure. Keep my rescue medication details written down.

ES RUTA: /es/neurodiversidad/condiciones/epilepsia/

EN PATH: /en/neurodiversity/conditions/epilepsy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-077

ES TEMA: Espiritualidad, creencias y no creencia

EN TOPIC: Spirituality, belief and non-belief

ES NECESITO: Que respetes mis creencias o mi falta de ellas. Adaptar el espacio si participo.

EN I NEED: Respect for my beliefs or lack of belief. Adapt the space if I take part.

ES RUTA: /es/neurodiversidad/condiciones/espiritualidad-creencias-y-no-creencia/

EN PATH: /en/neurodiversity/conditions/spirituality-belief-and-non-belief/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-078

ES TEMA: Evitación persistente de demandas (perfil PDA)

EN TOPIC: Persistent demand avoidance (PDA profile)

ES NECESITO: Que me ofrezcas opciones y margen para decidir. Deja que elija cómo hacerlo.

EN I NEED: Offer me choices and room to decide. Let me choose how to do it.

ES RUTA: /es/neurodiversidad/condiciones/evitacion-persistente-de-demandas-perfil-pda/

EN PATH: /en/neurodiversity/conditions/persistent-demand-avoidance-pda-profile/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-079

ES TEMA: Evitación

EN TOPIC: Avoidance

ES NECESITO: Acercarme poco a poco a la situación. Acompáñame en los primeros intentos.

EN I NEED: To approach the situation gradually. Come with me for the first attempts.

ES RUTA: /es/neurodiversidad/condiciones/evitacion/

EN PATH: /en/neurodiversity/conditions/avoidance/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-080

ES TEMA: Expresión de género

EN TOPIC: Gender expression

ES NECESITO: La misma norma de ropa para todos. Poder vestirme de la forma que prefiero.

EN I NEED: The same clothing rules for everyone. To dress in the way I prefer.

ES RUTA: /es/neurodiversidad/condiciones/expresion-de-genero/

EN PATH: /en/neurodiversity/conditions/gender-expression/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 061–080

ES: Microcopy bilingüe «Necesito» incorporado: 80 registros.

EN: Bilingual «I need» microcopy added: 80 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-081

# 50. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-081

ES TEMA: Fatiga social

EN TOPIC: Social fatigue

ES NECESITO: Ratos sin compañía. Poder cambiar el plan si hoy no tengo energía para quedar.

EN I NEED: Time without company. To change the plan if I have no energy to meet.

ES RUTA: /es/neurodiversidad/condiciones/fatiga-social/

EN PATH: /en/neurodiversity/conditions/social-fatigue/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-082

ES TEMA: Fobias específicas

EN TOPIC: Specific phobias

ES NECESITO: Acercarme por pasos con apoyo profesional. Avísame antes de cada paso.

EN I NEED: To approach it in steps with professional support. Tell me before each step.

ES RUTA: /es/neurodiversidad/condiciones/fobias-especificas/

EN PATH: /en/neurodiversity/conditions/specific-phobias/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-083

ES TEMA: Fortalezas

EN TOPIC: Strengths

ES NECESITO: Que cuentes conmigo para las tareas que se me dan bien.

EN I NEED: Include me in tasks that use my strengths.

ES RUTA: /es/neurodiversidad/condiciones/fortalezas/

EN PATH: /en/neurodiversity/conditions/strengths/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-084

ES TEMA: Frustración

EN TOPIC: Frustration

ES NECESITO: Saber la meta y los pasos. Un rato para calmarme si me bloqueo.

EN I NEED: To know the goal and the steps. Time to calm down if I get stuck.

ES RUTA: /es/neurodiversidad/condiciones/frustracion/

EN PATH: /en/neurodiversity/conditions/frustration/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-085

ES TEMA: Funciones ejecutivas

EN TOPIC: Executive functions

ES NECESITO: Listas, alarmas y calendarios. Recuérdame cuál es el siguiente paso.

EN I NEED: Lists, alarms and calendars. Remind me what the next step is.

ES RUTA: /es/neurodiversidad/condiciones/funciones-ejecutivas/

EN PATH: /en/neurodiversity/conditions/executive-functions/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-086

ES TEMA: Género fluido

EN TOPIC: Gender-fluid

ES NECESITO: Poder cambiar mi dato de género cuando lo pida.

EN I NEED: To change my gender information whenever I ask.

ES RUTA: /es/neurodiversidad/condiciones/genero-fluido/

EN PATH: /en/neurodiversity/conditions/gender-fluid/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-087

ES TEMA: Hermanos

EN TOPIC: Siblings

ES NECESITO: Tiempo a solas con mis padres. Explícame los cambios con palabras adecuadas a mi edad.

EN I NEED: Time alone with my parents. Explain changes in words that match my age.

ES RUTA: /es/neurodiversidad/condiciones/hermanos/

EN PATH: /en/neurodiversity/conditions/siblings/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-088

ES TEMA: Higiene y autocuidado

EN TOPIC: Hygiene and self-care

ES NECESITO: Probar otro champú o cepillo si este me molesta. Hacer cada paso con tiempo.

EN I NEED: To try another shampoo or brush if this one bothers me. Time for each step.

ES RUTA: /es/neurodiversidad/condiciones/higiene-y-autocuidado/

EN PATH: /en/neurodiversity/conditions/hygiene-and-self-care/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-089

ES TEMA: Hiperacusia

EN TOPIC: Hyperacusis

ES NECESITO: Bajar el volumen. Poder usar cascos si el ruido aumenta.

EN I NEED: Lower volume. To use headphones if the noise increases.

ES RUTA: /es/neurodiversidad/condiciones/hiperacusia/

EN PATH: /en/neurodiversity/conditions/hyperacusis/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-090

ES TEMA: Hiperfoco

EN TOPIC: Hyperfocus

ES NECESITO: Una alarma para parar. Avísame cuando llegue la hora de comer.

EN I NEED: An alarm to stop. Tell me when it is time to eat.

ES RUTA: /es/neurodiversidad/condiciones/hiperfoco/

EN PATH: /en/neurodiversity/conditions/hyperfocus/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-091

ES TEMA: Hospital y neurodiversidad

EN TOPIC: Hospital care and neurodiversity

ES NECESITO: Que mis ajustes estén escritos en la historia clínica. Reducir la espera cuando sea posible.

EN I NEED: My adjustments recorded in my medical notes. Shorter waiting times when possible.

ES RUTA: /es/neurodiversidad/condiciones/hospital-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/hospital-care-and-neurodiversity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-092

ES TEMA: Identificar emociones

EN TOPIC: Identifying emotions

ES NECESITO: Escalas o dibujos para explicar cómo estoy. Pregúntame también qué noto en el cuerpo.

EN I NEED: Scales or pictures to explain how I feel. Ask what I notice in my body too.

ES RUTA: /es/neurodiversidad/condiciones/identificar-emociones/

EN PATH: /en/neurodiversity/conditions/identifying-emotions/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-093

ES TEMA: Imagen corporal

EN TOPIC: Body image

ES NECESITO: Hablar de mi cuerpo con respeto. Usar datos concretos en lugar de comparaciones.

EN I NEED: To talk about my body respectfully. Use specific information rather than comparisons.

ES RUTA: /es/neurodiversidad/condiciones/imagen-corporal/

EN PATH: /en/neurodiversity/conditions/body-image/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-094

ES TEMA: Inercia autista

EN TOPIC: Autistic inertia

ES NECESITO: Aviso antes de cambiar de actividad. Empezar la siguiente tarea con un paso pequeño.

EN I NEED: Notice before changing activity. Start the next task with one small step.

ES RUTA: /es/neurodiversidad/condiciones/inercia-autista/

EN PATH: /en/neurodiversity/conditions/autistic-inertia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-095

ES TEMA: Insomnio

EN TOPIC: Insomnia

ES NECESITO: Apoyo profesional para dormir mejor. Mantener horarios que pueda seguir.

EN I NEED: Professional support to sleep better. Keep a schedule I can follow.

ES RUTA: /es/neurodiversidad/condiciones/insomnio/

EN PATH: /en/neurodiversity/conditions/insomnia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-096

ES TEMA: Intereses intensos o especiales

EN TOPIC: Intense or special interests

ES NECESITO: Tiempo para mi interés. Usarlo también para aprender si me apetece.

EN I NEED: Time for my interest. To use it for learning too if I want.

ES RUTA: /es/neurodiversidad/condiciones/intereses-intensos-o-especiales/

EN PATH: /en/neurodiversity/conditions/intense-or-special-interests/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-097

ES TEMA: Interocepción

EN TOPIC: Interoception

ES NECESITO: Recordatorios para beber y comer. Pregúntame si tengo hambre o sed.

EN I NEED: Reminders to eat and drink. Ask whether I am hungry or thirsty.

ES RUTA: /es/neurodiversidad/condiciones/interocepcion/

EN PATH: /en/neurodiversity/conditions/interoception/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-098

ES TEMA: Intersexualidad

EN TOPIC: Intersex

ES NECESITO: Acceso a mi historial médico completo. Información clara antes de decidir sobre mi cuerpo.

EN I NEED: Access to my full medical history. Clear information before I make decisions about my body.

ES RUTA: /es/neurodiversidad/condiciones/intersexualidad/

EN PATH: /en/neurodiversity/conditions/intersex/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-099

ES TEMA: LGTBI+ y neurodiversidad

EN TOPIC: LGBTQIA+ and neurodiversity

ES NECESITO: Un lugar donde pueda ser yo. Que respetes mi identidad y mi forma de comunicarme.

EN I NEED: A place where I can be myself. Respect my identity and how I communicate.

ES RUTA: /es/neurodiversidad/condiciones/lgtbi-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/lgbtqia-and-neurodiversity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-100

ES TEMA: Límites personales

EN TOPIC: Personal boundaries

ES NECESITO: Decir mis límites con claridad. Que aceptes mi no como respuesta.

EN I NEED: To state my boundaries clearly. Accept my no as an answer.

ES RUTA: /es/neurodiversidad/condiciones/limites-personales/

EN PATH: /en/neurodiversity/conditions/personal-boundaries/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 081–100

ES: Microcopy bilingüe «Necesito» incorporado: 100 registros.

EN: Bilingual «I need» microcopy added: 100 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-101

# 51. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-101

ES TEMA: Masking / camuflaje autista

EN TOPIC: Masking / autistic camouflaging

ES NECESITO: Lugares donde pueda relajarme y actuar con naturalidad. Tiempo para recuperarme después.

EN I NEED: Places where I can relax and act naturally. Time to recover afterwards.

ES RUTA: /es/neurodiversidad/condiciones/masking-camuflaje-autista/

EN PATH: /en/neurodiversity/conditions/masking-autistic-camouflaging/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-102

ES TEMA: Maternidad y paternidad neurodivergente

EN TOPIC: Neurodivergent motherhood and fatherhood

ES NECESITO: Ayuda práctica y descanso. Repartir las tareas por escrito.

EN I NEED: Practical help and rest. Divide the tasks in writing.

ES RUTA: /es/neurodiversidad/condiciones/maternidad-y-paternidad-neurodivergente/

EN PATH: /en/neurodiversity/conditions/neurodivergent-motherhood-and-fatherhood/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-103

ES TEMA: Menopausia

EN TOPIC: Menopause

ES NECESITO: Información clara sobre mis opciones de tratamiento. Escucha los síntomas que describo.

EN I NEED: Clear information about treatment options. Listen to the symptoms I describe.

ES RUTA: /es/neurodiversidad/condiciones/menopausia/

EN PATH: /en/neurodiversity/conditions/menopause/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-104

ES TEMA: Menstruación

EN TOPIC: Menstruation

ES NECESITO: Saber cuándo puede llegarme la regla. Tener productos preparados.

EN I NEED: To know when my period may start. To have period products ready.

ES RUTA: /es/neurodiversidad/condiciones/menstruacion/

EN PATH: /en/neurodiversity/conditions/menstruation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-105

ES TEMA: Misofonía

EN TOPIC: Misophonia

ES NECESITO: Alejarme de algunos sonidos. Poder sentarme lejos de la fuente del ruido.

EN I NEED: To move away from certain sounds. To sit far from the source of the noise.

ES RUTA: /es/neurodiversidad/condiciones/misofonia/

EN PATH: /en/neurodiversity/conditions/misophonia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-106

ES TEMA: Monotropismo

EN TOPIC: Monotropism

ES NECESITO: Aviso antes de cambiar de tarea. Tiempo para terminar lo que estoy haciendo.

EN I NEED: Notice before changing tasks. Time to finish what I am doing.

ES RUTA: /es/neurodiversidad/condiciones/monotropismo/

EN PATH: /en/neurodiversity/conditions/monotropism/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-107

ES TEMA: Motivación

EN TOPIC: Motivation

ES NECESITO: Saber por dónde empezar. Escribe la primera tarea en una frase.

EN I NEED: To know where to start. Write the first task in one sentence.

ES RUTA: /es/neurodiversidad/condiciones/motivacion/

EN PATH: /en/neurodiversity/conditions/motivation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-108

ES TEMA: Música

EN TOPIC: Music

ES NECESITO: Elegir la música y el volumen. Poder usar cascos.

EN I NEED: To choose the music and volume. To use headphones.

ES RUTA: /es/neurodiversidad/condiciones/musica/

EN PATH: /en/neurodiversity/conditions/music/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-109

ES TEMA: Mutismo selectivo

EN TOPIC: Selective mutism

ES NECESITO: Responder por escrito o señalando. Dame tiempo y habla con tranquilidad.

EN I NEED: To reply in writing or by pointing. Give me time and speak calmly.

ES RUTA: /es/neurodiversidad/condiciones/mutismo-selectivo/

EN PATH: /en/neurodiversity/conditions/selective-mutism/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-110

ES TEMA: Naturaleza y espacios al aire libre

EN TOPIC: Nature and outdoor spaces

ES NECESITO: Saber cómo es el camino y qué tiempo hará. Elegir lugares tranquilos.

EN I NEED: To know what the route is like and the weather forecast. To choose quiet places.

ES RUTA: /es/neurodiversidad/condiciones/naturaleza-y-espacios-al-aire-libre/

EN PATH: /en/neurodiversity/conditions/nature-and-outdoor-spaces/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-111

ES TEMA: Niñas y mujeres autistas

EN TOPIC: Autistic girls and women

ES NECESITO: Que me preguntes a mí directamente. Escucha lo que cuento sobre mis dificultades.

EN I NEED: Ask me directly. Listen to what I say about my difficulties.

ES RUTA: /es/neurodiversidad/condiciones/ninas-y-mujeres-autistas/

EN PATH: /en/neurodiversity/conditions/autistic-girls-and-women/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-112

ES TEMA: No binario

EN TOPIC: Non-binary

ES NECESITO: Una opción de género que me incluya. Pregúntame cómo quiero que aparezca.

EN I NEED: A gender option that includes me. Ask how I want it shown.

ES RUTA: /es/neurodiversidad/condiciones/no-binario/

EN PATH: /en/neurodiversity/conditions/non-binary/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-113

ES TEMA: No hablar

EN TOPIC: Not speaking

ES NECESITO: Otra forma de comunicarme. Hazme preguntas con opciones para responder.

EN I NEED: Another way to communicate. Ask questions with answer options.

ES RUTA: /es/neurodiversidad/condiciones/no-hablar/

EN PATH: /en/neurodiversity/conditions/not-speaking/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-114

ES TEMA: Nombre elegido

EN TOPIC: Chosen name

ES NECESITO: Mi nombre elegido en todos los documentos. Mantener el anterior en privado.

EN I NEED: My chosen name on all documents. Keep my previous name private.

ES RUTA: /es/neurodiversidad/condiciones/nombre-elegido/

EN PATH: /en/neurodiversity/conditions/chosen-name/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-115

ES TEMA: Ocio

EN TOPIC: Leisure

ES NECESITO: Tiempo libre sin tareas. Elegir qué quiero hacer.

EN I NEED: Free time without tasks. To choose what I want to do.

ES RUTA: /es/neurodiversidad/condiciones/ocio/

EN PATH: /en/neurodiversity/conditions/leisure/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-116

ES TEMA: Orientación sexual

EN TOPIC: Sexual orientation

ES NECESITO: Que me preguntes cómo nombro mi orientación. Usa la palabra que yo elija.

EN I NEED: Ask how I describe my orientation. Use the word I choose.

ES RUTA: /es/neurodiversidad/condiciones/orientacion-sexual/

EN PATH: /en/neurodiversity/conditions/sexual-orientation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-117

ES TEMA: Otros trastornos alimentarios especificados (OSFED)

EN TOPIC: Other specified feeding or eating disorder (OSFED)

ES NECESITO: Tratamiento especializado para mis dificultades con la comida.

EN I NEED: Specialist treatment for my difficulties with food.

ES RUTA: /es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/

EN PATH: /en/neurodiversity/conditions/other-specified-feeding-or-eating-disorder-osfed/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-118

ES TEMA: Outing

EN TOPIC: Outing

ES NECESITO: Decidir quién conoce esta información. Pídeme permiso antes de compartirla.

EN I NEED: To decide who knows this information. Ask before sharing it.

ES RUTA: /es/neurodiversidad/condiciones/outing/

EN PATH: /en/neurodiversity/conditions/outing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-119

ES TEMA: Pansexualidad

EN TOPIC: Pansexuality

ES NECESITO: Que uses la palabra que yo elijo para mi orientación.

EN I NEED: Use the word I choose for my orientation.

ES RUTA: /es/neurodiversidad/condiciones/pansexualidad/

EN PATH: /en/neurodiversity/conditions/pansexuality/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-120

ES TEMA: Parálisis cerebral

EN TOPIC: Cerebral palsy

ES NECESITO: Mis apoyos y mi tecnología conmigo. Pregúntame cómo prefiero recibir ayuda.

EN I NEED: My support and technology with me. Ask how I prefer to receive help.

ES RUTA: /es/neurodiversidad/condiciones/paralisis-cerebral/

EN PATH: /en/neurodiversity/conditions/cerebral-palsy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 101–120

ES: Microcopy bilingüe «Necesito» incorporado: 120 registros.

EN: Bilingual «I need» microcopy added: 120 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-121

# 52. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-061

ES TEMA: Discapacidades del desarrollo

EN TOPIC: Developmental disabilities

ES NECESITO: Apoyos desde la infancia hasta la edad adulta. Revisarlos cuando cambien mis necesidades.

EN I NEED: Support from childhood into adulthood. Review it as my needs change.

ES RUTA: /es/neurodiversidad/condiciones/discapacidades-del-desarrollo/

EN PATH: /en/neurodiversity/conditions/developmental-disabilities/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-062

ES TEMA: Discriminación

EN TOPIC: Discrimination

ES NECESITO: Que apuntes lo ocurrido. Dime dónde puedo reclamar y cómo hacerlo.

EN I NEED: Write down what happened. Tell me where and how I can make a complaint.

ES RUTA: /es/neurodiversidad/condiciones/discriminacion/

EN PATH: /en/neurodiversity/conditions/discrimination/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-063

ES TEMA: Disforia de género

EN TOPIC: Gender dysphoria

ES NECESITO: Atención que respete mi identidad. Decidir el ritmo de cada paso.

EN I NEED: Care that respects my identity. To choose the pace of each step.

ES RUTA: /es/neurodiversidad/condiciones/disforia-de-genero/

EN PATH: /en/neurodiversity/conditions/gender-dysphoria/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-064

ES TEMA: Disgrafía

EN TOPIC: Dysgraphia

ES NECESITO: Escribir con ordenador. Más tiempo si tengo que escribir a mano.

EN I NEED: To type on a computer. More time if I have to write by hand.

ES RUTA: /es/neurodiversidad/condiciones/disgrafia/

EN PATH: /en/neurodiversity/conditions/dysgraphia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-065

ES TEMA: Dislexia

EN TOPIC: Dyslexia

ES NECESITO: Letra clara y más tiempo para leer. Dime también en voz alta lo importante.

EN I NEED: Clear print and more time to read. Tell me important information aloud too.

ES RUTA: /es/neurodiversidad/condiciones/dislexia/

EN PATH: /en/neurodiversity/conditions/dyslexia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-066

ES TEMA: Disociación

EN TOPIC: Dissociation

ES NECESITO: Ayuda para volver al presente con calma. Nombra objetos que haya en la habitación.

EN I NEED: Help to return to the present calmly. Name objects you can see in the room.

ES RUTA: /es/neurodiversidad/condiciones/disociacion/

EN PATH: /en/neurodiversity/conditions/dissociation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-067

ES TEMA: Doble excepcionalidad

EN TOPIC: Twice-exceptionality

ES NECESITO: Retos para aprender y apoyos para mis dificultades al mismo tiempo.

EN I NEED: Challenges for learning and support for my difficulties at the same time.

ES RUTA: /es/neurodiversidad/condiciones/doble-excepcionalidad/

EN PATH: /en/neurodiversity/conditions/twice-exceptionality/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-068

ES TEMA: Dolor persistente (dolor crónico)

EN TOPIC: Persistent pain / chronic pain

ES NECESITO: Moverme a mi ritmo. Pausas o cambios de actividad si el dolor aumenta.

EN I NEED: To move at my own pace. Breaks or activity changes if the pain increases.

ES RUTA: /es/neurodiversidad/condiciones/dolor-persistente-dolor-cronico/

EN PATH: /en/neurodiversity/conditions/persistent-pain-chronic-pain/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-069

ES TEMA: Dolor: reconocerlo y comunicarlo

EN TOPIC: Pain: recognising and communicating it

ES NECESITO: Preguntas concretas sobre el dolor. Poder señalar dónde me duele.

EN I NEED: Specific questions about pain. To point to where it hurts.

ES RUTA: /es/neurodiversidad/condiciones/dolor-reconocerlo-y-comunicarlo/

EN PATH: /en/neurodiversity/conditions/pain-recognising-and-communicating-it/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-070

ES TEMA: Duelo

EN TOPIC: Grief

ES NECESITO: Vivir el duelo a mi manera. Saber qué pasará en los próximos días.

EN I NEED: To grieve in my own way. To know what will happen in the next few days.

ES RUTA: /es/neurodiversidad/condiciones/duelo/

EN PATH: /en/neurodiversity/conditions/grief/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-071

ES TEMA: Ecolalia

EN TOPIC: Echolalia

ES NECESITO: Repetir palabras para entenderlas mejor. Dame tiempo antes de responder.

EN I NEED: To repeat words to understand them better. Give me time before I reply.

ES RUTA: /es/neurodiversidad/condiciones/ecolalia/

EN PATH: /en/neurodiversity/conditions/echolalia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-072

ES TEMA: Educación sexual

EN TOPIC: Sexuality education

ES NECESITO: Información clara sobre el cuerpo y el consentimiento. Usa los nombres correctos de cada parte.

EN I NEED: Clear information about the body and consent. Use the correct names for body parts.

ES RUTA: /es/neurodiversidad/condiciones/educacion-sexual/

EN PATH: /en/neurodiversity/conditions/sexuality-education/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-073

ES TEMA: Empleo y neurodiversidad

EN TOPIC: Employment and neurodiversity

ES NECESITO: Instrucciones claras en el trabajo. Saber qué ajustes puedo pedir.

EN I NEED: Clear instructions at work. To know what adjustments I can ask for.

ES RUTA: /es/neurodiversidad/condiciones/empleo-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/employment-and-neurodiversity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-074

ES TEMA: Enfado e ira

EN TOPIC: Anger

ES NECESITO: Una pausa si me enfado. Retomar la conversación después, con más calma.

EN I NEED: A pause if I get angry. Continue the conversation later, more calmly.

ES RUTA: /es/neurodiversidad/condiciones/enfado-e-ira/

EN PATH: /en/neurodiversity/conditions/anger/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-075

ES TEMA: Envejecimiento neurodivergente

EN TOPIC: Neurodivergent ageing

ES NECESITO: Mantener mis apoyos al hacerme mayor. Planificar con tiempo los cambios que pueda necesitar.

EN I NEED: To keep my support as I get older. Plan possible changes in advance.

ES RUTA: /es/neurodiversidad/condiciones/envejecimiento-neurodivergente/

EN PATH: /en/neurodiversity/conditions/neurodivergent-ageing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-076

ES TEMA: Epilepsia

EN TOPIC: Epilepsy

ES NECESITO: Que sepas qué hacer durante una crisis. Tener apuntada mi medicación de rescate.

EN I NEED: Know what to do during a seizure. Keep my rescue medication details written down.

ES RUTA: /es/neurodiversidad/condiciones/epilepsia/

EN PATH: /en/neurodiversity/conditions/epilepsy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-077

ES TEMA: Espiritualidad, creencias y no creencia

EN TOPIC: Spirituality, belief and non-belief

ES NECESITO: Que respetes mis creencias o mi falta de ellas. Adaptar el espacio si participo.

EN I NEED: Respect for my beliefs or lack of belief. Adapt the space if I take part.

ES RUTA: /es/neurodiversidad/condiciones/espiritualidad-creencias-y-no-creencia/

EN PATH: /en/neurodiversity/conditions/spirituality-belief-and-non-belief/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-078

ES TEMA: Evitación persistente de demandas (perfil PDA)

EN TOPIC: Persistent demand avoidance (PDA profile)

ES NECESITO: Que me ofrezcas opciones y margen para decidir. Deja que elija cómo hacerlo.

EN I NEED: Offer me choices and room to decide. Let me choose how to do it.

ES RUTA: /es/neurodiversidad/condiciones/evitacion-persistente-de-demandas-perfil-pda/

EN PATH: /en/neurodiversity/conditions/persistent-demand-avoidance-pda-profile/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-079

ES TEMA: Evitación

EN TOPIC: Avoidance

ES NECESITO: Acercarme poco a poco a la situación. Acompáñame en los primeros intentos.

EN I NEED: To approach the situation gradually. Come with me for the first attempts.

ES RUTA: /es/neurodiversidad/condiciones/evitacion/

EN PATH: /en/neurodiversity/conditions/avoidance/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-080

ES TEMA: Expresión de género

EN TOPIC: Gender expression

ES NECESITO: La misma norma de ropa para todos. Poder vestirme de la forma que prefiero.

EN I NEED: The same clothing rules for everyone. To dress in the way I prefer.

ES RUTA: /es/neurodiversidad/condiciones/expresion-de-genero/

EN PATH: /en/neurodiversity/conditions/gender-expression/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 121–140

ES: Microcopy bilingüe «Necesito» incorporado: 140 registros.

EN: Bilingual «I need» microcopy added: 140 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-141

# 53. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-081

ES TEMA: Fatiga social

EN TOPIC: Social fatigue

ES NECESITO: Ratos sin compañía. Poder cambiar el plan si hoy no tengo energía para quedar.

EN I NEED: Time without company. To change the plan if I have no energy to meet.

ES RUTA: /es/neurodiversidad/condiciones/fatiga-social/

EN PATH: /en/neurodiversity/conditions/social-fatigue/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-082

ES TEMA: Fobias específicas

EN TOPIC: Specific phobias

ES NECESITO: Acercarme por pasos con apoyo profesional. Avísame antes de cada paso.

EN I NEED: To approach it in steps with professional support. Tell me before each step.

ES RUTA: /es/neurodiversidad/condiciones/fobias-especificas/

EN PATH: /en/neurodiversity/conditions/specific-phobias/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-083

ES TEMA: Fortalezas

EN TOPIC: Strengths

ES NECESITO: Que cuentes conmigo para las tareas que se me dan bien.

EN I NEED: Include me in tasks that use my strengths.

ES RUTA: /es/neurodiversidad/condiciones/fortalezas/

EN PATH: /en/neurodiversity/conditions/strengths/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-084

ES TEMA: Frustración

EN TOPIC: Frustration

ES NECESITO: Saber la meta y los pasos. Un rato para calmarme si me bloqueo.

EN I NEED: To know the goal and the steps. Time to calm down if I get stuck.

ES RUTA: /es/neurodiversidad/condiciones/frustracion/

EN PATH: /en/neurodiversity/conditions/frustration/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-085

ES TEMA: Funciones ejecutivas

EN TOPIC: Executive functions

ES NECESITO: Listas, alarmas y calendarios. Recuérdame cuál es el siguiente paso.

EN I NEED: Lists, alarms and calendars. Remind me what the next step is.

ES RUTA: /es/neurodiversidad/condiciones/funciones-ejecutivas/

EN PATH: /en/neurodiversity/conditions/executive-functions/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-086

ES TEMA: Género fluido

EN TOPIC: Gender-fluid

ES NECESITO: Poder cambiar mi dato de género cuando lo pida.

EN I NEED: To change my gender information whenever I ask.

ES RUTA: /es/neurodiversidad/condiciones/genero-fluido/

EN PATH: /en/neurodiversity/conditions/gender-fluid/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-087

ES TEMA: Hermanos

EN TOPIC: Siblings

ES NECESITO: Tiempo a solas con mis padres. Explícame los cambios con palabras adecuadas a mi edad.

EN I NEED: Time alone with my parents. Explain changes in words that match my age.

ES RUTA: /es/neurodiversidad/condiciones/hermanos/

EN PATH: /en/neurodiversity/conditions/siblings/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-088

ES TEMA: Higiene y autocuidado

EN TOPIC: Hygiene and self-care

ES NECESITO: Probar otro champú o cepillo si este me molesta. Hacer cada paso con tiempo.

EN I NEED: To try another shampoo or brush if this one bothers me. Time for each step.

ES RUTA: /es/neurodiversidad/condiciones/higiene-y-autocuidado/

EN PATH: /en/neurodiversity/conditions/hygiene-and-self-care/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-089

ES TEMA: Hiperacusia

EN TOPIC: Hyperacusis

ES NECESITO: Bajar el volumen. Poder usar cascos si el ruido aumenta.

EN I NEED: Lower volume. To use headphones if the noise increases.

ES RUTA: /es/neurodiversidad/condiciones/hiperacusia/

EN PATH: /en/neurodiversity/conditions/hyperacusis/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-090

ES TEMA: Hiperfoco

EN TOPIC: Hyperfocus

ES NECESITO: Una alarma para parar. Avísame cuando llegue la hora de comer.

EN I NEED: An alarm to stop. Tell me when it is time to eat.

ES RUTA: /es/neurodiversidad/condiciones/hiperfoco/

EN PATH: /en/neurodiversity/conditions/hyperfocus/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-091

ES TEMA: Hospital y neurodiversidad

EN TOPIC: Hospital care and neurodiversity

ES NECESITO: Que mis ajustes estén escritos en la historia clínica. Reducir la espera cuando sea posible.

EN I NEED: My adjustments recorded in my medical notes. Shorter waiting times when possible.

ES RUTA: /es/neurodiversidad/condiciones/hospital-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/hospital-care-and-neurodiversity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-092

ES TEMA: Identificar emociones

EN TOPIC: Identifying emotions

ES NECESITO: Escalas o dibujos para explicar cómo estoy. Pregúntame también qué noto en el cuerpo.

EN I NEED: Scales or pictures to explain how I feel. Ask what I notice in my body too.

ES RUTA: /es/neurodiversidad/condiciones/identificar-emociones/

EN PATH: /en/neurodiversity/conditions/identifying-emotions/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-093

ES TEMA: Imagen corporal

EN TOPIC: Body image

ES NECESITO: Hablar de mi cuerpo con respeto. Usar datos concretos en lugar de comparaciones.

EN I NEED: To talk about my body respectfully. Use specific information rather than comparisons.

ES RUTA: /es/neurodiversidad/condiciones/imagen-corporal/

EN PATH: /en/neurodiversity/conditions/body-image/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-094

ES TEMA: Inercia autista

EN TOPIC: Autistic inertia

ES NECESITO: Aviso antes de cambiar de actividad. Empezar la siguiente tarea con un paso pequeño.

EN I NEED: Notice before changing activity. Start the next task with one small step.

ES RUTA: /es/neurodiversidad/condiciones/inercia-autista/

EN PATH: /en/neurodiversity/conditions/autistic-inertia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-095

ES TEMA: Insomnio

EN TOPIC: Insomnia

ES NECESITO: Apoyo profesional para dormir mejor. Mantener horarios que pueda seguir.

EN I NEED: Professional support to sleep better. Keep a schedule I can follow.

ES RUTA: /es/neurodiversidad/condiciones/insomnio/

EN PATH: /en/neurodiversity/conditions/insomnia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-096

ES TEMA: Intereses intensos o especiales

EN TOPIC: Intense or special interests

ES NECESITO: Tiempo para mi interés. Usarlo también para aprender si me apetece.

EN I NEED: Time for my interest. To use it for learning too if I want.

ES RUTA: /es/neurodiversidad/condiciones/intereses-intensos-o-especiales/

EN PATH: /en/neurodiversity/conditions/intense-or-special-interests/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-097

ES TEMA: Interocepción

EN TOPIC: Interoception

ES NECESITO: Recordatorios para beber y comer. Pregúntame si tengo hambre o sed.

EN I NEED: Reminders to eat and drink. Ask whether I am hungry or thirsty.

ES RUTA: /es/neurodiversidad/condiciones/interocepcion/

EN PATH: /en/neurodiversity/conditions/interoception/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-098

ES TEMA: Intersexualidad

EN TOPIC: Intersex

ES NECESITO: Acceso a mi historial médico completo. Información clara antes de decidir sobre mi cuerpo.

EN I NEED: Access to my full medical history. Clear information before I make decisions about my body.

ES RUTA: /es/neurodiversidad/condiciones/intersexualidad/

EN PATH: /en/neurodiversity/conditions/intersex/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-099

ES TEMA: LGTBI+ y neurodiversidad

EN TOPIC: LGBTQIA+ and neurodiversity

ES NECESITO: Un lugar donde pueda ser yo. Que respetes mi identidad y mi forma de comunicarme.

EN I NEED: A place where I can be myself. Respect my identity and how I communicate.

ES RUTA: /es/neurodiversidad/condiciones/lgtbi-y-neurodiversidad/

EN PATH: /en/neurodiversity/conditions/lgbtqia-and-neurodiversity/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-100

ES TEMA: Límites personales

EN TOPIC: Personal boundaries

ES NECESITO: Decir mis límites con claridad. Que aceptes mi no como respuesta.

EN I NEED: To state my boundaries clearly. Accept my no as an answer.

ES RUTA: /es/neurodiversidad/condiciones/limites-personales/

EN PATH: /en/neurodiversity/conditions/personal-boundaries/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 141–160

ES: Microcopy bilingüe «Necesito» incorporado: 160 registros.

EN: Bilingual «I need» microcopy added: 160 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-161

# 54. TARJETA IRIS · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-NEED-101

ES TEMA: Masking / camuflaje autista

EN TOPIC: Masking / autistic camouflaging

ES NECESITO: Lugares donde pueda relajarme y actuar con naturalidad. Tiempo para recuperarme después.

EN I NEED: Places where I can relax and act naturally. Time to recover afterwards.

ES RUTA: /es/neurodiversidad/condiciones/masking-camuflaje-autista/

EN PATH: /en/neurodiversity/conditions/masking-autistic-camouflaging/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-102

ES TEMA: Maternidad y paternidad neurodivergente

EN TOPIC: Neurodivergent motherhood and fatherhood

ES NECESITO: Ayuda práctica y descanso. Repartir las tareas por escrito.

EN I NEED: Practical help and rest. Divide the tasks in writing.

ES RUTA: /es/neurodiversidad/condiciones/maternidad-y-paternidad-neurodivergente/

EN PATH: /en/neurodiversity/conditions/neurodivergent-motherhood-and-fatherhood/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-103

ES TEMA: Menopausia

EN TOPIC: Menopause

ES NECESITO: Información clara sobre mis opciones de tratamiento. Escucha los síntomas que describo.

EN I NEED: Clear information about treatment options. Listen to the symptoms I describe.

ES RUTA: /es/neurodiversidad/condiciones/menopausia/

EN PATH: /en/neurodiversity/conditions/menopause/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-104

ES TEMA: Menstruación

EN TOPIC: Menstruation

ES NECESITO: Saber cuándo puede llegarme la regla. Tener productos preparados.

EN I NEED: To know when my period may start. To have period products ready.

ES RUTA: /es/neurodiversidad/condiciones/menstruacion/

EN PATH: /en/neurodiversity/conditions/menstruation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-105

ES TEMA: Misofonía

EN TOPIC: Misophonia

ES NECESITO: Alejarme de algunos sonidos. Poder sentarme lejos de la fuente del ruido.

EN I NEED: To move away from certain sounds. To sit far from the source of the noise.

ES RUTA: /es/neurodiversidad/condiciones/misofonia/

EN PATH: /en/neurodiversity/conditions/misophonia/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-106

ES TEMA: Monotropismo

EN TOPIC: Monotropism

ES NECESITO: Aviso antes de cambiar de tarea. Tiempo para terminar lo que estoy haciendo.

EN I NEED: Notice before changing tasks. Time to finish what I am doing.

ES RUTA: /es/neurodiversidad/condiciones/monotropismo/

EN PATH: /en/neurodiversity/conditions/monotropism/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-107

ES TEMA: Motivación

EN TOPIC: Motivation

ES NECESITO: Saber por dónde empezar. Escribe la primera tarea en una frase.

EN I NEED: To know where to start. Write the first task in one sentence.

ES RUTA: /es/neurodiversidad/condiciones/motivacion/

EN PATH: /en/neurodiversity/conditions/motivation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-108

ES TEMA: Música

EN TOPIC: Music

ES NECESITO: Elegir la música y el volumen. Poder usar cascos.

EN I NEED: To choose the music and volume. To use headphones.

ES RUTA: /es/neurodiversidad/condiciones/musica/

EN PATH: /en/neurodiversity/conditions/music/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-109

ES TEMA: Mutismo selectivo

EN TOPIC: Selective mutism

ES NECESITO: Responder por escrito o señalando. Dame tiempo y habla con tranquilidad.

EN I NEED: To reply in writing or by pointing. Give me time and speak calmly.

ES RUTA: /es/neurodiversidad/condiciones/mutismo-selectivo/

EN PATH: /en/neurodiversity/conditions/selective-mutism/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-110

ES TEMA: Naturaleza y espacios al aire libre

EN TOPIC: Nature and outdoor spaces

ES NECESITO: Saber cómo es el camino y qué tiempo hará. Elegir lugares tranquilos.

EN I NEED: To know what the route is like and the weather forecast. To choose quiet places.

ES RUTA: /es/neurodiversidad/condiciones/naturaleza-y-espacios-al-aire-libre/

EN PATH: /en/neurodiversity/conditions/nature-and-outdoor-spaces/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-111

ES TEMA: Niñas y mujeres autistas

EN TOPIC: Autistic girls and women

ES NECESITO: Que me preguntes a mí directamente. Escucha lo que cuento sobre mis dificultades.

EN I NEED: Ask me directly. Listen to what I say about my difficulties.

ES RUTA: /es/neurodiversidad/condiciones/ninas-y-mujeres-autistas/

EN PATH: /en/neurodiversity/conditions/autistic-girls-and-women/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-112

ES TEMA: No binario

EN TOPIC: Non-binary

ES NECESITO: Una opción de género que me incluya. Pregúntame cómo quiero que aparezca.

EN I NEED: A gender option that includes me. Ask how I want it shown.

ES RUTA: /es/neurodiversidad/condiciones/no-binario/

EN PATH: /en/neurodiversity/conditions/non-binary/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-113

ES TEMA: No hablar

EN TOPIC: Not speaking

ES NECESITO: Otra forma de comunicarme. Hazme preguntas con opciones para responder.

EN I NEED: Another way to communicate. Ask questions with answer options.

ES RUTA: /es/neurodiversidad/condiciones/no-hablar/

EN PATH: /en/neurodiversity/conditions/not-speaking/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-114

ES TEMA: Nombre elegido

EN TOPIC: Chosen name

ES NECESITO: Mi nombre elegido en todos los documentos. Mantener el anterior en privado.

EN I NEED: My chosen name on all documents. Keep my previous name private.

ES RUTA: /es/neurodiversidad/condiciones/nombre-elegido/

EN PATH: /en/neurodiversity/conditions/chosen-name/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-115

ES TEMA: Ocio

EN TOPIC: Leisure

ES NECESITO: Tiempo libre sin tareas. Elegir qué quiero hacer.

EN I NEED: Free time without tasks. To choose what I want to do.

ES RUTA: /es/neurodiversidad/condiciones/ocio/

EN PATH: /en/neurodiversity/conditions/leisure/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-116

ES TEMA: Orientación sexual

EN TOPIC: Sexual orientation

ES NECESITO: Que me preguntes cómo nombro mi orientación. Usa la palabra que yo elija.

EN I NEED: Ask how I describe my orientation. Use the word I choose.

ES RUTA: /es/neurodiversidad/condiciones/orientacion-sexual/

EN PATH: /en/neurodiversity/conditions/sexual-orientation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-117

ES TEMA: Otros trastornos alimentarios especificados (OSFED)

EN TOPIC: Other specified feeding or eating disorder (OSFED)

ES NECESITO: Tratamiento especializado para mis dificultades con la comida.

EN I NEED: Specialist treatment for my difficulties with food.

ES RUTA: /es/neurodiversidad/condiciones/otros-trastornos-alimentarios-especificados-osfed/

EN PATH: /en/neurodiversity/conditions/other-specified-feeding-or-eating-disorder-osfed/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-118

ES TEMA: Outing

EN TOPIC: Outing

ES NECESITO: Decidir quién conoce esta información. Pídeme permiso antes de compartirla.

EN I NEED: To decide who knows this information. Ask before sharing it.

ES RUTA: /es/neurodiversidad/condiciones/outing/

EN PATH: /en/neurodiversity/conditions/outing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-119

ES TEMA: Pansexualidad

EN TOPIC: Pansexuality

ES NECESITO: Que uses la palabra que yo elijo para mi orientación.

EN I NEED: Use the word I choose for my orientation.

ES RUTA: /es/neurodiversidad/condiciones/pansexualidad/

EN PATH: /en/neurodiversity/conditions/pansexuality/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-NEED-120

ES TEMA: Parálisis cerebral

EN TOPIC: Cerebral palsy

ES NECESITO: Mis apoyos y mi tecnología conmigo. Pregúntame cómo prefiero recibir ayuda.

EN I NEED: My support and technology with me. Ask how I prefer to receive help.

ES RUTA: /es/neurodiversidad/condiciones/paralisis-cerebral/

EN PATH: /en/neurodiversity/conditions/cerebral-palsy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · MICROCOPY 161–180

ES: Microcopy bilingüe «Necesito» incorporado: 180 registros.

EN: Bilingual «I need» microcopy added: 180 records.

SIGUIENTE REGISTRO: WEB-IRIS-NEED-181

# 55. CIERRE DE MICROCOPY DE CONDICIONES · FUENTE REAL

ES: La fuente `editorial/tarjetas-necesito-condiciones.json` contiene 180 entradas bilingües, no 185. Se cierra esta colección exactamente en 180 para no inventar contenido ausente.

EN: The source `editorial/tarjetas-necesito-condiciones.json` contains 180 bilingual entries, not 185. This collection is closed exactly at 180 so that missing source content is not invented.

ES HUECOS DE FUENTE: Cisgénero · Gay · Identidad de género · Lesbiana · Orientación romántica.

EN SOURCE GAPS: Cisgender · Gay · Gender identity · Lesbian · Romantic orientation.

ES DECISIÓN: estos cinco registros no se generan por inferencia. Si aparecen en otra fuente canónica, se incorporarán desde esa fuente.

EN DECISION: these five records are not generated by inference. If they appear in another canonical source, they will be incorporated from that source.

ORIGEN: SOURCE_AUDIT

ESTADO: SOURCE_COMPLETE_WITH_GAPS

---

# 56. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED»

FUENTE: `editorial/tarjetas-necesito-situaciones.json` · rama `main` de Iris Green.

ES NOTA DE FUENTE: Bloque «Necesito» de la Tarjeta Iris. Tanda 3 de 3: Situaciones (187). Con esta quedan las 415.

EN SOURCE NOTE: «I need» block of the Iris Card. Batch 3 of 3: Situations (187). This completes all 415.

ES REGLA EDITORIAL: El título del apartado ya es «Necesito», así que no se repite en el texto. Máximo 2 frases y unas 14 palabras. Frases cortas, una idea por frase, verbos claros y palabras de todos los días. Todo en positivo: digo qué necesito. Sin etiquetas, defensas, abstracciones ni palabras vagas. Sin muletillas. La segunda frase no empieza por «Y». Evitar «a veces», «así», «luego», «cuando lo pida» y «un poco». No usar «Me ayuda».

EN EDITORIAL RULE: The section title is already «I need», so it is not repeated in the text. Maximum 2 sentences and about 14 words. Use short sentences, one idea per sentence, clear verbs and everyday words. State what is needed in positive terms. Avoid labels, defensive wording, abstract language, vague words and filler phrases. The second sentence does not start with «And». Do not use «It helps me».

ESTADO DE LA COLECCIÓN: EN_PROGRESO

## WEB-IRIS-SITUATION-NEED-001

ES SITUACIÓN: «Algunas temperaturas de la comida me resultan insoportables»

EN SITUATION: “Some food temperatures are unbearable for me”

ES NECESITO: La comida templada. Dime cuánto tiempo debe esperar antes de servirla.

EN I NEED: Lukewarm food. Tell me how long it should cool before serving.

ES RUTA: /es/situaciones/algunas-temperaturas-de-la-comida-me-resultan-insoportables/

EN PATH: /en/situations/some-food-temperatures-are-unbearable-for-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-002

ES SITUACIÓN: Algunos sabores me resultan demasiado intensos

EN SITUATION: “Some flavours feel far too intense”

ES NECESITO: Platos de sabor suave. Sirve la salsa aparte.

EN I NEED: Mild-tasting food. Serve the sauce separately.

ES RUTA: /es/situaciones/algunos-sabores-me-resultan-demasiado-intensos/

EN PATH: /en/situations/some-flavours-feel-far-too-intense/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-003

ES SITUACIÓN: «Beber agua me resulta desagradable por la sensación»

EN SITUATION: “Drinking water feels unpleasant because of the sensation”

ES NECESITO: Agua muy fría o con gas. También puedo beberla en una botella pequeña.

EN I NEED: Very cold or sparkling water. A small bottle works for me too.

ES RUTA: /es/situaciones/beber-agua-me-resulta-desagradable-por-la-sensacion/

EN PATH: /en/situations/drinking-water-feels-unpleasant-because-of-the-sensation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-004

ES SITUACIÓN: «Busco en internet durante horas para asegurarme de que no pasa nada»

EN SITUATION: “I search online for hours to make sure nothing is wrong”

ES NECESITO: Terminar la búsqueda y pasar a otra actividad. Ayúdame a fijar un tiempo.

EN I NEED: To stop searching and move to another activity. Help me set a time limit.

ES RUTA: /es/situaciones/busco-en-internet-durante-horas-para-asegurarme-de-que-no-pasa-nada/

EN PATH: /en/situations/i-search-online-for-hours-to-make-sure-nothing-is-wrong/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-005

ES SITUACIÓN: «Cambiar de ropa según el tiempo me resulta más difícil de lo que parece»

EN SITUATION: “Changing clothes to match the weather is harder than it looks”

ES NECESITO: Dejar la ropa preparada la noche anterior. Dime qué tiempo hará.

EN I NEED: Prepare my clothes the night before. Tell me what the weather will be.

ES RUTA: /es/situaciones/cambiar-de-ropa-segun-el-tiempo-me-resulta-mas-dificil-de-lo-que-parece/

EN PATH: /en/situations/changing-clothes-to-match-the-weather-is-harder-than-it-looks/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-006

ES SITUACIÓN: «Cambiar de una tarea a otra me bloquea»

EN SITUATION: “Switching from one task to another blocks me”

ES NECESITO: Un aviso antes de cambiar de tarea. Tiempo para terminar lo que estoy haciendo.

EN I NEED: Notice before changing tasks. Time to finish what I am doing.

ES RUTA: /es/situaciones/cambiar-de-una-tarea-a-otra-me-bloquea/

EN PATH: /en/situations/switching-from-one-task-to-another-blocks-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-007

ES SITUACIÓN: «Cambio de tema sin darme cuenta de que la otra persona seguía hablando de lo anterior»

EN SITUATION: “I change topic without realising the other person was still on the previous one”

ES NECESITO: Que me avises si cambio de tema demasiado pronto. Volvamos al tema anterior.

EN I NEED: Tell me if I change topic too soon. Let's return to the previous topic.

ES RUTA: /es/situaciones/cambio-de-tema-sin-darme-cuenta-de-que-la-otra-persona-seguia-hablando-de-lo-anterior/

EN PATH: /en/situations/i-change-topic-without-realising-the-other-person-was-still-on-the-previous-one/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-008

ES SITUACIÓN: «Comer en un restaurante me resulta demasiado»

EN SITUATION: “Eating in a restaurant is too much for me”

ES NECESITO: Una mesa alejada del ruido. Poder salir un rato si me canso.

EN I NEED: A table away from noise. To step outside if I get tired.

ES RUTA: /es/situaciones/comer-en-un-restaurante-me-resulta-demasiado/

EN PATH: /en/situations/eating-in-a-restaurant-is-too-much-for-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-009

ES SITUACIÓN: «Comer fuera de casa es muy difícil»

EN SITUATION: “Eating away from home is very difficult”

ES NECESITO: Saber qué habrá para comer antes de ir. Llevar una comida que ya conozco.

EN I NEED: Know what food will be available. Bring food I already know.

ES RUTA: /es/situaciones/comer-fuera-de-casa-es-muy-dificil/

EN PATH: /en/situations/eating-away-from-home-is-very-difficult/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-010

ES SITUACIÓN: «Comer fuera es demasiado impredecible»

EN SITUATION: “Eating out is too unpredictable”

ES NECESITO: Ver el menú antes de ir. Dime cómo sirven el plato.

EN I NEED: To see the menu beforehand. Tell me how the dish is served.

ES RUTA: /es/situaciones/comer-fuera-es-demasiado-impredecible/

EN PATH: /en/situations/eating-out-is-too-unpredictable/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-011

ES SITUACIÓN: «Como muy deprisa y luego noto que estoy demasiado llena»

EN SITUATION: “I eat very quickly and only afterwards notice I am too full”

ES NECESITO: Comer más despacio. Sirve el plato en dos partes.

EN I NEED: To eat more slowly. Serve the meal in two parts.

ES RUTA: /es/situaciones/como-muy-deprisa-y-luego-noto-que-estoy-demasiado-llena/

EN PATH: /en/situations/i-eat-very-quickly-and-only-afterwards-notice-i-am-too-full/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-012

ES SITUACIÓN: «Comparto información y después pienso que era demasiado privada»

EN SITUATION: “I share information and afterwards think it was too private”

ES NECESITO: Tiempo para pensar antes de contar información personal. Guarda en privado lo que comparto.

EN I NEED: Time to think before sharing personal information. Keep what I share private.

ES RUTA: /es/situaciones/comparto-informacion-y-despues-me-arrepiento/

EN PATH: /en/situations/i-share-information-and-regret-it-afterwards/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-013

ES SITUACIÓN: Cualquier ruido me despierta, aunque sea bajo

EN SITUATION: “Any small noise wakes me up”

ES NECESITO: Dormir con tapones o un sonido suave. Mantén bajo el volumen por la noche.

EN I NEED: To sleep with earplugs or soft background sound. Keep the volume low at night.

ES RUTA: /es/situaciones/cualquier-ruido-pequeno-me-despierta/

EN PATH: /en/situations/any-small-noise-wakes-me-up/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-014

ES SITUACIÓN: «Cuando estoy saturada mi forma de hablar cambia»

EN SITUATION: “When I am overloaded, the way I speak changes”

ES NECESITO: Hablar menos si llevo muchas horas saturada. Escríbeme si hablar me cuesta.

EN I NEED: To speak less after many overwhelming hours. Message me if speaking becomes difficult.

ES RUTA: /es/situaciones/cuando-estoy-saturada-mi-forma-de-hablar-cambia/

EN PATH: /en/situations/when-i-am-overloaded-the-way-i-speak-changes/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-015

ES SITUACIÓN: «Cuando me preguntan cómo estoy no sé qué responder»

EN SITUATION: “When someone asks how I am, I do not know what to answer”

ES NECESITO: Preguntas concretas. Dame dos o tres opciones para responder.

EN I NEED: Specific questions. Give me two or three options to answer.

ES RUTA: /es/situaciones/cuando-me-preguntan-como-estoy-no-se-que-responder/

EN PATH: /en/situations/when-someone-asks-how-i-am-i-do-not-know-what-to-answer/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-016

ES SITUACIÓN: «Después de varias horas dejo de responder»

EN SITUATION: “After several hours I stop responding”

ES NECESITO: Responder por escrito al final del día. Espera mi mensaje.

EN I NEED: To reply in writing at the end of the day. Wait for my message.

ES RUTA: /es/situaciones/dejo-de-responder-despues-de-varias-horas/

EN PATH: /en/situations/after-a-few-hours-i-stop-answering/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-017

ES SITUACIÓN: «Después de decidir algo vuelvo a empezar la decisión desde cero»

EN SITUATION: “After making a decision, I start the decision all over again”

ES NECESITO: Mantener la decisión que ya tomé. Recuérdame cuál elegí.

EN I NEED: To keep the decision I already made. Remind me what I chose.

ES RUTA: /es/situaciones/despues-de-decidir-algo-vuelvo-a-empezar-la-decision-desde-cero/

EN PATH: /en/situations/after-making-a-decision-i-start-the-decision-all-over-again/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-018

ES SITUACIÓN: «Después de estudiar o trabajar necesito horas para recuperarme»

EN SITUATION: “After studying or working, I need hours to recover”

ES NECESITO: Horas de descanso después de estudiar o trabajar. Dejemos otros planes para más tarde.

EN I NEED: Hours to rest after studying or working. Leave other plans until later.

ES RUTA: /es/situaciones/despues-de-estudiar-o-trabajar-necesito-horas-para-recuperarme/

EN PATH: /en/situations/after-studying-or-working-i-need-hours-to-recover/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-019

ES SITUACIÓN: «Después de salir necesito un rato largo sin hablar con nadie»

EN SITUATION: “After going out, I need a long time without talking to anyone”

ES NECESITO: Un rato largo en silencio al llegar a casa. Hablamos después de descansar.

EN I NEED: A long quiet period when I get home. We can talk after I rest.

ES RUTA: /es/situaciones/despues-de-salir-necesito-un-rato-largo-sin-hablar-con-nadie/

EN PATH: /en/situations/after-going-out-i-need-a-long-time-without-talking-to-anyone/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-020

ES SITUACIÓN: «Después de un día difícil me cuesta todavía más comer»

EN SITUATION: “After a difficult day, eating becomes even harder”

ES NECESITO: Comida sencilla después de un día difícil. Prepárame algo que ya conozco.

EN I NEED: Simple food after a difficult day. Prepare something I already know.

ES RUTA: /es/situaciones/despues-de-un-dia-dificil-me-cuesta-todavia-mas-comer/

EN PATH: /en/situations/after-a-difficult-day-eating-becomes-even-harder/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 001–020

ES: Situaciones «Necesito» incorporadas: 20/187.

EN: Situation «I need» entries added: 20/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-021

# 57. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-021

ES SITUACIÓN: Después de un día intenso sigo con el cuerpo tenso al acostarme

EN SITUATION: “After an intense day I am still wired at night”

ES NECESITO: Una hora tranquila antes de acostarme. Baja las luces.

EN I NEED: A quiet hour before bed. Lower the lights.

ES RUTA: /es/situaciones/despues-de-un-dia-intenso-sigo-acelerada-por-la-noche/

EN PATH: /en/situations/after-an-intense-day-i-am-still-wired-at-night/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-022

ES SITUACIÓN: «Después de una discusión necesito mucho tiempo para volver a hablar»

EN SITUATION: “After an argument I need a long time before I can talk again”

ES NECESITO: Tiempo antes de volver a hablar. Retomaré la conversación cuando esté preparada.

EN I NEED: Time before talking again. I will return to the conversation when I am ready.

ES RUTA: /es/situaciones/despues-de-una-discusion-necesito-mucho-tiempo-para-volver-a-hablar/

EN PATH: /en/situations/after-an-argument-i-need-a-long-time-before-i-can-talk-again/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-023

ES SITUACIÓN: «Digo que sí para evitar un conflicto y luego no puedo con ello»

EN SITUATION: “I say yes to avoid conflict and then cannot cope with it”

ES NECESITO: Pensar antes de comprometerme. Vuelve a preguntármelo mañana.

EN I NEED: Time to think before I commit. Ask me again tomorrow.

ES RUTA: /es/situaciones/digo-que-si-para-evitar-un-conflicto-y-luego-no-puedo-con-ello/

EN PATH: /en/situations/i-say-yes-to-avoid-conflict-and-then-cannot-cope-with-it/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-024

ES SITUACIÓN: Duermo mejor cuando no tengo que levantarme a una hora fija

EN SITUATION: “I sleep better when I do not have to get up at a fixed time”

ES NECESITO: Levantarme sin una hora fija cuando sea posible. Avisaré cuando esté preparada.

EN I NEED: To wake without a fixed time when possible. I will tell you when ready.

ES RUTA: /es/situaciones/duermo-mejor-cuando-no-tengo-que-levantarme-a-una-hora-fija/

EN PATH: /en/situations/i-sleep-better-when-i-do-not-have-to-get-up-at-a-fixed-time/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-025

ES SITUACIÓN: El agua de la ducha me molesta en la piel

EN SITUATION: “Shower water feels uncomfortable on my skin”

ES NECESITO: El agua a una temperatura cómoda. Déjame elegir la presión.

EN I NEED: Water at a comfortable temperature. Let me choose the pressure.

ES RUTA: /es/situaciones/el-agua-de-la-ducha-me-molesta-en-la-piel/

EN PATH: /en/situations/shower-water-feels-uncomfortable-on-my-skin/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-026

ES SITUACIÓN: El calor me agota antes que a otras personas

EN SITUATION: “Heat overwhelms me sooner than it seems to overwhelm other people”

ES NECESITO: Sombra y agua fresca. Quedemos a una hora con menos calor.

EN I NEED: Shade and cool water. Let's meet when it is less hot.

ES RUTA: /es/situaciones/el-calor-me-satura-antes-que-a-otras-personas/

EN PATH: /en/situations/heat-overwhelms-me-sooner-than-it-seems-to-overwhelm-other-people/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-027

ES SITUACIÓN: El cambio de hora altera mi sueño durante varios días

EN SITUATION: “The clock change throws me off for days”

ES NECESITO: Unos días para adaptarme al cambio de hora. Mantengamos esa semana más tranquila.

EN I NEED: A few days to adjust to the time change. Keep that week calmer.

ES RUTA: /es/situaciones/el-cambio-de-hora-me-descoloca-durante-dias/

EN PATH: /en/situations/the-clock-change-throws-me-off-for-days/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-028

ES SITUACIÓN: El contacto inesperado me sobresalta muchísimo

EN SITUATION: “Unexpected touch startles me intensely”

ES NECESITO: Que me avises antes de tocarme. Espera mi respuesta.

EN I NEED: Tell me before touching me. Wait for my response.

ES RUTA: /es/situaciones/el-contacto-inesperado-me-sobresalta-muchisimo/

EN PATH: /en/situations/unexpected-touch-startles-me-intensely/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-029

ES SITUACIÓN: El hambre aparece de golpe y ya me encuentro mal

EN SITUATION: “Hunger hits suddenly and by then I feel awful”

ES NECESITO: Comer a horas regulares. Ofréceme algo a media mañana.

EN I NEED: Regular meal times. Offer me something mid-morning.

ES RUTA: /es/situaciones/el-hambre-aparece-de-golpe-y-ya-estoy-fatal/

EN PATH: /en/situations/hunger-hits-suddenly-and-by-then-i-feel-awful/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-030

ES SITUACIÓN: «El hospital me sobrecarga»

EN SITUATION: “The hospital overwhelms me”

ES NECESITO: Saber qué ocurrirá en cada paso del hospital. Acompáñame si puedes.

EN I NEED: Know each hospital step beforehand. Come with me if you can.

ES RUTA: /es/situaciones/el-hospital-me-sobrecarga/

EN PATH: /en/situations/the-hospital-overwhelms-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-031

ES SITUACIÓN: El olor de algunas tiendas me obliga a salir

EN SITUATION: “The smell in some shops makes me leave”

ES NECESITO: Poder salir si el olor de la tienda es fuerte. Espérame fuera.

EN I NEED: To leave if the shop smell is strong. Wait for me outside.

ES RUTA: /es/situaciones/el-olor-de-algunas-tiendas-me-obliga-a-salir/

EN PATH: /en/situations/the-smell-in-some-shops-makes-me-leave/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-032

ES SITUACIÓN: El ruido me resulta insoportable

EN SITUATION: “Noise is unbearable for them”

ES NECESITO: Un lugar con menos sonidos al mismo tiempo. Llevar mis cascos.

EN I NEED: A place with fewer sounds at the same time. To carry my headphones.

ES RUTA: /es/situaciones/el-ruido-le-resulta-insoportable/

EN PATH: /en/situations/noise-is-unbearable-for-them/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-033

ES SITUACIÓN: «El transporte público me sobrecarga»

EN SITUATION: “Public transport overwhelms me”

ES NECESITO: Viajar en horas tranquilas. Elegir el vagón menos lleno.

EN I NEED: To travel at quieter times. To choose the least crowded carriage.

ES RUTA: /es/situaciones/el-transporte-publico-me-sobrecarga/

EN PATH: /en/situations/public-transport-overwhelms-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-034

ES SITUACIÓN: «Empiezo muchas tareas y no termino ninguna»

EN SITUATION: “I start many tasks and finish none of them”

ES NECESITO: Terminar una tarea antes de empezar otra. Ayúdame a elegir cuál va primero.

EN I NEED: To finish one task before starting another. Help me choose which comes first.

ES RUTA: /es/situaciones/empiezo-muchas-tareas-y-no-termino-ninguna/

EN PATH: /en/situations/i-start-many-tasks-and-finish-none-of-them/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-035

ES SITUACIÓN: «En el trabajo gasto toda mi energía en parecer que estoy bien»

EN SITUATION: “At work I use all my energy trying to look as though I'm fine”

ES NECESITO: Descansos cortos durante la jornada. Poder decir si estoy cansada o saturada.

EN I NEED: Short breaks during the workday. To say when I am tired or overwhelmed.

ES RUTA: /es/situaciones/en-el-trabajo-gasto-la-energia-en-parecer-que-estoy-bien/

EN PATH: /en/situations/at-work-i-spend-my-energy-looking-fine/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-036

ES SITUACIÓN: «En grupos grandes no consigo entrar en la conversación»

EN SITUATION: “In large groups I cannot get into the conversation”

ES NECESITO: Que me des paso para hablar. Reserva un turno para mí.

EN I NEED: Give me a clear chance to speak. Keep a turn for me.

ES RUTA: /es/situaciones/en-grupos-grandes-no-consigo-entrar-en-la-conversacion/

EN PATH: /en/situations/in-large-groups-i-cannot-get-into-the-conversation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-037

ES SITUACIÓN: «Entiendo las palabras pero no la intención»

EN SITUATION: “I understand the words but not the intention”

ES NECESITO: Que me digas directamente qué quieres decir. Usa palabras claras.

EN I NEED: Tell me directly what you mean. Use clear words.

ES RUTA: /es/situaciones/entiendo-las-palabras-pero-no-la-intencion/

EN PATH: /en/situations/i-understand-the-words-but-not-the-intention/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-038

ES SITUACIÓN: «Entiendo mejor si me enseñan un ejemplo»

EN SITUATION: “I understand better when I am shown an example”

ES NECESITO: Ver un ejemplo terminado. Enséñame cómo queda.

EN I NEED: To see a finished example. Show me what the result looks like.

ES RUTA: /es/situaciones/entiendo-mejor-si-me-ensenan-un-ejemplo/

EN PATH: /en/situations/i-understand-better-when-i-am-shown-an-example/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-039

ES SITUACIÓN: «Estoy explorando mi género y todavía no tengo una palabra»

EN SITUATION: “I'm exploring my gender and I don't have a word for it yet”

ES NECESITO: Tiempo para encontrar una palabra para mi género. Pregúntame cómo quiero que me llames.

EN I NEED: Time to find a word for my gender. Ask what name I want today.

ES RUTA: /es/situaciones/estoy-explorando-mi-genero-y-todavia-no-tengo-una-palabra/

EN PATH: /en/situations/im-exploring-my-gender-without-a-word-yet/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-040

ES SITUACIÓN: «Estoy explorando mi género»

EN SITUATION: “I'm exploring my gender”

ES NECESITO: Explorar mi género sin prisa. Mantén en privado lo que te cuento.

EN I NEED: To explore my gender without rushing. Keep what I tell you private.

ES RUTA: /es/situaciones/estoy-explorando-mi-genero/

EN PATH: /en/situations/im-exploring-my-gender/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 021–040

ES: Situaciones «Necesito» incorporadas: 40/187.

EN: Situation «I need» entries added: 40/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-041

# 58. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-041

ES SITUACIÓN: «Evito ciertos números, palabras o imágenes porque me generan miedo»

EN SITUATION: “I avoid certain numbers, words or images because they frighten me”

ES NECESITO: Hablar de estos miedos con calma. Ayúdame a volver a mi actividad.

EN I NEED: To talk about these fears calmly. Help me return to my activity.

ES RUTA: /es/situaciones/evito-ciertos-numeros-palabras-o-imagenes-porque-me-generan-miedo/

EN PATH: /en/situations/i-avoid-certain-numbers-words-or-images-because-they-frighten-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-042

ES SITUACIÓN: «Guardo capturas o mensajes por miedo a necesitar demostrar algo»

EN SITUATION: “I keep screenshots or messages in case I need to prove something later”

ES NECESITO: Guardar los mensajes importantes en una carpeta. Revisemos cuáles guardar.

EN I NEED: To keep important messages in one folder. Let's review which ones to keep.

ES RUTA: /es/situaciones/guardo-capturas-o-mensajes-por-miedo-a-necesitar-demostrar-algo/

EN PATH: /en/situations/i-keep-screenshots-or-messages-in-case-i-need-to-prove-something-later/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-043

ES SITUACIÓN: «Hablo demasiado de un tema y luego me doy cuenta tarde»

EN SITUATION: “I talk too much about one topic and only realise later”

ES NECESITO: Que me avises con una señal si hablo demasiado. Cambiaré de tema.

EN I NEED: Give me a signal if I talk too long. I will change topic.

ES RUTA: /es/situaciones/hablo-demasiado-de-un-tema-y-luego-me-doy-cuenta-tarde/

EN PATH: /en/situations/i-talk-too-much-about-one-topic-and-only-realise-later/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-044

ES SITUACIÓN: «Hacer una llamada para pedir una cita se me hace enorme»

EN SITUATION: “Making a phone call to book an appointment feels enormous”

ES NECESITO: Preparar la llamada antes. Escribe conmigo lo que voy a decir.

EN I NEED: To prepare the call beforehand. Write down what I will say with me.

ES RUTA: /es/situaciones/hacer-una-llamada-para-pedir-una-cita-se-me-hace-enorme/

EN PATH: /en/situations/making-a-phone-call-to-book-an-appointment-feels-enormous/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-045

ES SITUACIÓN: Hay sonidos concretos que me hacen reaccionar de inmediato

EN SITUATION: “Specific sounds trigger an immediate reaction in me”

ES NECESITO: Alejarme de ese sonido. Déjame sentarme en otro lugar.

EN I NEED: To move away from that sound. Let me sit somewhere else.

ES RUTA: /es/situaciones/hay-sonidos-concretos-que-me-provocan-una-reaccion/

EN PATH: /en/situations/specific-sounds-trigger-an-immediate-reaction-in-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-046

ES SITUACIÓN: «Interrumpo sin querer porque temo olvidar lo que iba a decir»

EN SITUATION: “I interrupt without meaning to because I am afraid I will forget what I wanted to say”

ES NECESITO: Apuntar mi idea mientras espero mi turno. Dame papel.

EN I NEED: To write down my idea while I wait my turn. Give me paper.

ES RUTA: /es/situaciones/interrumpo-sin-querer-porque-temo-olvidar-lo-que-iba-a-decir/

EN PATH: /en/situations/i-interrupt-without-meaning-to-because-i-am-afraid-i-will-forget-what-i-wanted-to-say/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-047

ES SITUACIÓN: «Ir a comprar me consume la energía del resto del día»

EN SITUATION: “Going shopping uses up the energy I have for the rest of the day”

ES NECESITO: Hacer la compra en dos veces. Acompáñame la primera.

EN I NEED: To split the shopping into two trips. Come with me the first time.

ES RUTA: /es/situaciones/ir-a-comprar-me-consume-la-energia-del-resto-del-dia/

EN PATH: /en/situations/going-shopping-uses-up-the-energy-i-have-for-the-rest-of-the-day/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-048

ES SITUACIÓN: La luz de la mañana me despierta demasiado pronto

EN SITUATION: “Morning light wakes me too early”

ES NECESITO: Una persiana que bloquee bien la luz. Mantén la habitación oscura.

EN I NEED: A blind that blocks the light well. Keep the room dark.

ES RUTA: /es/situaciones/la-luz-de-la-manana-me-despierta-demasiado-pronto/

EN PATH: /en/situations/morning-light-wakes-me-too-early/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-049

ES SITUACIÓN: Salgo del supermercado sin energía y no sé por qué

EN SITUATION: “I leave the supermarket exhausted and I don't know why”

ES NECESITO: Ir al supermercado a una hora tranquila. Llevar una lista corta.

EN I NEED: To visit the supermarket at a quiet time. Take a short list.

ES RUTA: /es/situaciones/la-luz-del-supermercado-me-agota/

EN PATH: /en/situations/supermarket-lights-drain-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-050

ES SITUACIÓN: No aguanto las etiquetas ni las costuras de la ropa

EN SITUATION: “I can't stand clothing tags or seams”

ES NECESITO: Ropa sin etiquetas molestas. Elegir prendas con costuras planas.

EN I NEED: Clothes without irritating labels. Choose items with flat seams.

ES RUTA: /es/situaciones/la-ropa-me-molesta/

EN PATH: /en/situations/clothes-feel-unbearable/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-051

ES SITUACIÓN: La ropa que tolero un día me molesta otro

EN SITUATION: “Clothes I can tolerate one day bother me another day”

ES NECESITO: Elegir la ropa cada día. Ten dos opciones preparadas.

EN I NEED: To choose my clothes each day. Have two options ready.

ES RUTA: /es/situaciones/la-ropa-que-tolero-un-dia-me-molesta-otro/

EN PATH: /en/situations/clothes-i-can-tolerate-one-day-bother-me-another-day/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-052

ES SITUACIÓN: Las luces blancas me cansan muy rápido

EN SITUATION: “White lights tire me out very quickly”

ES NECESITO: Luz cálida donde trabajo. Apaga el fluorescente si puedes.

EN I NEED: Warm light where I work. Turn off fluorescent lighting if possible.

ES RUTA: /es/situaciones/las-luces-blancas-me-cansan-muy-rapido/

EN PATH: /en/situations/white-lights-tire-me-out-very-quickly/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-053

ES SITUACIÓN: Las multitudes me desorientan aunque no haya mucho ruido

EN SITUATION: “Crowds disorient me even when they are not very noisy”

ES NECESITO: Un punto de encuentro fijo. Quedemos donde haya menos gente.

EN I NEED: A fixed meeting point. Let's meet where there are fewer people.

ES RUTA: /es/situaciones/las-multitudes-me-desorientan-aunque-no-haya-mucho-ruido/

EN PATH: /en/situations/crowds-disorient-me-even-when-they-are-not-very-noisy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-054

ES SITUACIÓN: «Las preguntas abiertas me bloquean»

EN SITUATION: “Open-ended questions make me freeze”

ES NECESITO: Preguntas con opciones. Dame dos para elegir.

EN I NEED: Questions with options. Give me two to choose from.

ES RUTA: /es/situaciones/las-preguntas-abiertas-me-bloquean/

EN PATH: /en/situations/open-ended-questions-make-me-freeze/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-055

ES SITUACIÓN: «Las reuniones sin agenda me resultan muy difíciles»

EN SITUATION: “Meetings without an agenda are very difficult for me”

ES NECESITO: El orden del día antes de la reunión. Envíamelo la tarde anterior.

EN I NEED: The agenda before the meeting. Send it the afternoon before.

ES RUTA: /es/situaciones/las-reuniones-sin-agenda-me-resultan-muy-dificiles/

EN PATH: /en/situations/meetings-without-an-agenda-are-very-difficult-for-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-056

ES SITUACIÓN: «Las visitas inesperadas me descolocan»

EN SITUATION: “Unexpected visits throw me off”

ES NECESITO: Saber con tiempo quién viene a casa. Avísame por mensaje.

EN I NEED: To know in advance who is coming to my home. Message me beforehand.

ES RUTA: /es/situaciones/las-visitas-inesperadas-me-descolocan/

EN PATH: /en/situations/unexpected-visits-throw-me-off/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-057

ES SITUACIÓN: «Lavarme o limpiar me lleva mucho más tiempo del que quiero»

EN SITUATION: “Washing or cleaning takes much longer than I want it to”

ES NECESITO: Hacer la higiene por pasos y con tiempo. Cuenta con que puedo tardar más.

EN I NEED: Hygiene tasks step by step, with time. Expect me to take longer.

ES RUTA: /es/situaciones/lavarme-o-limpiar-me-lleva-mucho-mas-tiempo-del-que-quiero/

EN PATH: /en/situations/washing-or-cleaning-takes-much-longer-than-i-want-it-to/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-058

ES SITUACIÓN: Los cambios de temperatura me dejan sin energía

EN SITUATION: “Temperature changes leave me exhausted”

ES NECESITO: Ropa por capas. Dame un rato al llegar para adaptarme a la temperatura.

EN I NEED: Layers of clothing. Give me time to adjust to the temperature when I arrive.

ES RUTA: /es/situaciones/los-cambios-de-temperatura-me-dejan-agotada/

EN PATH: /en/situations/temperature-changes-leave-me-exhausted/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-059

ES SITUACIÓN: «Los correos se acumulan porque no sé cuál contestar primero»

EN SITUATION: “Emails pile up because I do not know which one to answer first”

ES NECESITO: Saber qué correo responder primero. Marca el más urgente.

EN I NEED: To know which email to answer first. Mark the most urgent one.

ES RUTA: /es/situaciones/los-correos-se-acumulan-porque-no-se-cual-contestar-primero/

EN PATH: /en/situations/emails-pile-up-because-i-do-not-know-which-one-to-answer-first/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-060

ES SITUACIÓN: «Los cubiertos o platos cambian cómo siento la comida»

EN SITUATION: “Cutlery or plates change how food feels to me”

ES NECESITO: Mis cubiertos y mi plato habituales. Sirve la comida en ellos.

EN I NEED: My usual cutlery and plate. Serve my food on them.

ES RUTA: /es/situaciones/los-cubiertos-o-platos-cambian-como-siento-la-comida/

EN PATH: /en/situations/cutlery-or-plates-change-how-food-feels-to-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 041–060

ES: Situaciones «Necesito» incorporadas: 60/187.

EN: Situation «I need» entries added: 60/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-061

# 59. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-061

ES SITUACIÓN: Los exámenes en un aula ruidosa son insoportables

EN SITUATION: “Exams in a noisy classroom are unbearable”

ES NECESITO: Hacer el examen en un aula tranquila. Poder usar tapones durante el examen.

EN I NEED: To take the exam in a quiet room. To use earplugs during the exam.

ES RUTA: /es/situaciones/los-examenes-en-un-aula-ruidosa-son-insoportables/

EN PATH: /en/situations/exams-in-a-noisy-classroom-are-unbearable/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-062

ES SITUACIÓN: Los fines de semana mi horario de sueño cambia por completo

EN SITUATION: “My sleep schedule shifts completely at weekends”

ES NECESITO: Mantener horarios parecidos el fin de semana. Recuérdame la hora de acostarme.

EN I NEED: To keep similar weekend times. Remind me when it is time for bed.

ES RUTA: /es/situaciones/los-fines-de-semana-se-me-cambia-todo-el-horario/

EN PATH: /en/situations/my-sleep-schedule-shifts-completely-at-weekends/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-063

ES SITUACIÓN: «Los olores de cocina me quitan el hambre»

EN SITUATION: “Cooking smells take away my appetite”

ES NECESITO: Comer antes de que haya mucho olor a comida. Abre la ventana.

EN I NEED: To eat before the house fills with cooking smells. Open the window.

ES RUTA: /es/situaciones/los-olores-de-cocina-me-quitan-el-hambre/

EN PATH: /en/situations/cooking-smells-take-away-my-appetite/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-064

ES SITUACIÓN: Los sonidos normales me resultan dolorosos

EN SITUATION: “Ordinary sounds are painful for me”

ES NECESITO: Bajar el volumen. Poder usar cascos en lugares ruidosos.

EN I NEED: Lower volume. To use headphones in noisy places.

ES RUTA: /es/situaciones/los-sonidos-normales-me-resultan-dolorosos/

EN PATH: /en/situations/ordinary-sounds-are-painful-for-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-065

ES SITUACIÓN: Me acuesto después de un día agotador y no consigo dormir

EN SITUATION: “I go to bed tired and sleep doesn't come”

ES NECESITO: Un rato tranquilo antes de acostarme. Mantén la luz baja.

EN I NEED: Quiet time before bed. Keep the light low.

ES RUTA: /es/situaciones/me-acuesto-y-el-sueno-no-llega/

EN PATH: /en/situations/sleep-doesnt-come/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-066

ES SITUACIÓN: «Me agota decidir qué comer cada día»

EN SITUATION: “Deciding what to eat every day exhausts me”

ES NECESITO: Un menú fijo para la semana. Decidámoslo juntos un día concreto.

EN I NEED: A fixed weekly menu. Let's choose it together on a set day.

ES RUTA: /es/situaciones/me-agota-decidir-que-comer-cada-dia/

EN PATH: /en/situations/deciding-what-to-eat-every-day-exhausts-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-067

ES SITUACIÓN: «Me agoto después de estar con gente, aunque lo haya pasado bien»

EN SITUATION: “I feel exhausted after being with people, even when I enjoyed it”

ES NECESITO: Descansar después de estar con gente. Dejar tiempo libre después de los planes.

EN I NEED: To rest after being with people. Leave free time after social plans.

ES RUTA: /es/situaciones/me-agoto-despues-de-estar-con-gente/

EN PATH: /en/situations/drained-after-seeing-people/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-068

ES SITUACIÓN: «Me cuesta calcular cuánto tiempo me llevará una tarea»

EN SITUATION: “I find it hard to estimate how long a task will take”

ES NECESITO: Saber cuánto tiempo puede durar una tarea. Ayúdame a poner una alarma.

EN I NEED: To know how long a task may take. Help me set an alarm.

ES RUTA: /es/situaciones/me-cuesta-calcular-cuanto-tiempo-me-llevara-una-tarea/

EN PATH: /en/situations/i-find-it-hard-to-estimate-how-long-a-task-will-take/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-069

ES SITUACIÓN: «Me cuesta comer delante de otras personas»

EN SITUATION: “I find it hard to eat in front of other people”

ES NECESITO: Comer en un lugar tranquilo y pequeño.

EN I NEED: To eat somewhere quiet and small.

ES RUTA: /es/situaciones/me-cuesta-comer-delante-de-otras-personas/

EN PATH: /en/situations/i-find-it-hard-to-eat-in-front-of-other-people/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-070

ES SITUACIÓN: «Me cuesta comer si los alimentos se tocan en el plato»

EN SITUATION: “I struggle to eat when foods touch on the plate”

ES NECESITO: La comida separada en el plato. Sírvela sin mezclar.

EN I NEED: Food separated on the plate. Serve it without mixing.

ES RUTA: /es/situaciones/me-cuesta-comer-si-los-alimentos-se-tocan-en-el-plato/

EN PATH: /en/situations/i-struggle-to-eat-when-foods-touch-on-the-plate/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-071

ES SITUACIÓN: «Me cuesta dejar una pregunta sin respuesta»

EN SITUATION: “I struggle to leave a question unanswered”

ES NECESITO: Dejar la pregunta para otro momento. Ayúdame a pasar a otra actividad.

EN I NEED: To leave the question for another time. Help me move to another activity.

ES RUTA: /es/situaciones/me-cuesta-dejar-una-pregunta-sin-respuesta/

EN PATH: /en/situations/i-struggle-to-leave-a-question-unanswered/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-072

ES SITUACIÓN: «Me cuesta dejar una tarea si no siento que está perfecta»

EN SITUATION: “I struggle to stop a task if it does not feel perfect”

ES NECESITO: Saber cuándo una tarea está suficientemente bien. Dime cuándo puedo terminarla.

EN I NEED: To know when a task is good enough. Tell me when I can stop.

ES RUTA: /es/situaciones/me-cuesta-dejar-una-tarea-si-no-siento-que-esta-perfecta/

EN PATH: /en/situations/i-struggle-to-stop-a-task-if-it-does-not-feel-perfect/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-073

ES SITUACIÓN: Aunque duerma muchas horas, tardo mucho en despertarme

EN SITUATION: “I struggle to wake up even after many hours of sleep”

ES NECESITO: Tiempo para despertarme y empezar el día. Espera media hora antes de hablarme.

EN I NEED: Time to wake and start the day. Wait half an hour before talking.

ES RUTA: /es/situaciones/me-cuesta-despertarme-aunque-haya-dormido-muchas-horas/

EN PATH: /en/situations/i-struggle-to-wake-up-even-after-many-hours-of-sleep/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-074

ES SITUACIÓN: «Me cuesta detectar si alguien está bromeando»

EN SITUATION: “I find it hard to tell when someone is joking”

ES NECESITO: Que me digas cuándo estás bromeando. Avísame con una señal.

EN I NEED: Tell me when you are joking. Give me a signal.

ES RUTA: /es/situaciones/me-cuesta-detectar-si-alguien-esta-bromeando/

EN PATH: /en/situations/i-find-it-hard-to-tell-when-someone-is-joking/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-075

ES SITUACIÓN: «Me cuesta distinguir una precaución razonable de una comprobación excesiva»

EN SITUATION: “I find it hard to tell a reasonable precaution from excessive checking”

ES NECESITO: Ayuda para saber cuándo dejar de comprobar. Hablarlo con un profesional.

EN I NEED: Help to know when to stop checking. To discuss it with a professional.

ES RUTA: /es/situaciones/me-cuesta-distinguir-una-precaucion-razonable-de-una-comprobacion-excesiva/

EN PATH: /en/situations/i-find-it-hard-to-tell-a-reasonable-precaution-from-excessive-checking/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-076

ES SITUACIÓN: «Me cuesta el transporte o los espacios porque también tengo una discapacidad física»

EN SITUATION: “Transport or public spaces are difficult because I also have a physical disability”

ES NECESITO: Un transporte accesible. Comprueba antes que funciona el ascensor.

EN I NEED: Accessible transport. Check beforehand that the lift is working.

ES RUTA: /es/situaciones/me-cuesta-el-transporte-por-discapacidad-fisica/

EN PATH: /en/situations/transport-is-difficult-with-a-physical-disability/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-077

ES SITUACIÓN: «Me cuesta empezar una tarea si las instrucciones son ambiguas»

EN SITUATION: “I struggle to start a task when the instructions are ambiguous”

ES NECESITO: La tarea explicada en una frase clara. Dime cuál es el primer paso.

EN I NEED: The task explained in one clear sentence. Tell me the first step.

ES RUTA: /es/situaciones/me-cuesta-empezar-una-tarea-si-las-instrucciones-son-ambiguas/

EN PATH: /en/situations/i-struggle-to-start-a-task-when-the-instructions-are-ambiguous/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-078

ES SITUACIÓN: Me cuesta encontrar una postura que no me moleste

EN SITUATION: “I struggle to find a comfortable sitting position”

ES NECESITO: Espacio para levantarme y cambiar de postura.

EN I NEED: Space to stand up and change position.

ES RUTA: /es/situaciones/me-cuesta-encontrar-una-postura-comoda-para-sentarme/

EN PATH: /en/situations/i-struggle-to-find-a-comfortable-sitting-position/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-079

ES SITUACIÓN: «Me cuesta explicar algo si me miran mientras hablo»

EN SITUATION: “I struggle to explain something when people look at me while I speak”

ES NECESITO: Hablar sin que me mires directamente. Mira a otro lado mientras me explico.

EN I NEED: To speak without direct eye contact. Look elsewhere while I explain.

ES RUTA: /es/situaciones/me-cuesta-explicar-algo-si-me-miran-mientras-hablo/

EN PATH: /en/situations/i-struggle-to-explain-something-when-people-look-at-me-while-i-speak/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-080

ES SITUACIÓN: «Me cuesta mantener contacto con personas que no veo»

EN SITUATION: “I struggle to stay in touch with people I do not see”

ES NECESITO: Recordatorios para escribir a personas que no veo. Escríbeme tú también.

EN I NEED: Reminders to message people I do not see. Message me too.

ES RUTA: /es/situaciones/me-cuesta-mantener-contacto-con-personas-que-no-veo/

EN PATH: /en/situations/i-struggle-to-stay-in-touch-with-people-i-do-not-see/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 061–080

ES: Situaciones «Necesito» incorporadas: 80/187.

EN: Situation «I need» entries added: 80/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-081

# 60. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-081

ES SITUACIÓN: «Me cuesta mantener una rutina de higiene cuando estoy saturada»

EN SITUATION: “I struggle to keep up a hygiene routine when I am overloaded”

ES NECESITO: Una rutina de higiene más corta si estoy saturada. Empezar por cara y dientes.

EN I NEED: A shorter hygiene routine when I am overwhelmed. Start with my face and teeth.

ES RUTA: /es/situaciones/me-cuesta-mantener-una-rutina-de-higiene-cuando-estoy-saturada/

EN PATH: /en/situations/i-struggle-to-keep-up-a-hygiene-routine-when-i-am-overloaded/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-082

ES SITUACIÓN: «Me cuesta organizar medicación, citas y documentos»

EN SITUATION: “I struggle to organise medication, appointments and documents”

ES NECESITO: Un pastillero y una carpeta. Revisemos las citas una vez por semana.

EN I NEED: A pill organiser and one folder. Let's review appointments once a week.

ES RUTA: /es/situaciones/me-cuesta-organizar-medicacion-citas-y-documentos/

EN PATH: /en/situations/i-struggle-to-organise-medication-appointments-and-documents/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-083

ES SITUACIÓN: «Me cuesta pedir ayuda antes de estar al límite»

EN SITUATION: “I struggle to ask for help before I am at my limit”

ES NECESITO: Pedir ayuda antes de estar agotada. Pregúntame cómo estoy.

EN I NEED: To ask for help before I am exhausted. Ask how I am doing.

ES RUTA: /es/situaciones/me-cuesta-pedir-ayuda-antes-de-estar-al-limite/

EN PATH: /en/situations/i-struggle-to-ask-for-help-before-i-am-at-my-limit/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-084

ES SITUACIÓN: «Me cuesta pedir que repitan algo»

EN SITUATION: “I find it hard to ask someone to repeat something”

ES NECESITO: Que repitas la información. Dila otra vez con calma.

EN I NEED: Repeat the information for me. Say it again calmly.

ES RUTA: /es/situaciones/me-cuesta-pedir-que-repitan-algo/

EN PATH: /en/situations/i-find-it-hard-to-ask-someone-to-repeat-something/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-085

ES SITUACIÓN: «Me cuesta poner límites hasta que ya estoy agotada»

EN SITUATION: “I struggle to set boundaries until I am already exhausted”

ES NECESITO: Decir mis límites antes de agotarme. Acéptalos cuando los exprese.

EN I NEED: To state my limits before I am exhausted. Accept them when I express them.

ES RUTA: /es/situaciones/me-cuesta-poner-limites-hasta-que-ya-estoy-agotada/

EN PATH: /en/situations/i-struggle-to-set-boundaries-until-i-am-already-exhausted/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-086

ES SITUACIÓN: «Me cuesta priorizar cuando todo parece urgente»

EN SITUATION: “I struggle to prioritise when everything feels urgent”

ES NECESITO: Saber qué tarea va primero. Ordena la lista conmigo.

EN I NEED: To know which task comes first. Sort the list with me.

ES RUTA: /es/situaciones/me-cuesta-priorizar-cuando-todo-parece-urgente/

EN PATH: /en/situations/i-struggle-to-prioritise-when-everything-feels-urgent/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-087

ES SITUACIÓN: «Me cuesta probar alimentos nuevos aunque quiera»

EN SITUATION: “I struggle to try new foods even when I want to”

ES NECESITO: Probar alimentos nuevos poco a poco. Pon un trozo pequeño junto a mi comida.

EN I NEED: To try new foods gradually. Put a small piece beside my usual food.

ES RUTA: /es/situaciones/me-cuesta-probar-alimentos-nuevos-aunque-quiera/

EN PATH: /en/situations/i-struggle-to-try-new-foods-even-when-i-want-to/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-088

ES SITUACIÓN: «Me cuesta reconocer cuándo necesito descansar»

EN SITUATION: “I struggle to recognise when I need to rest”

ES NECESITO: Parar antes de agotarme. Recuérdame cuándo toca descansar.

EN I NEED: To stop before I am exhausted. Remind me when it is time to rest.

ES RUTA: /es/situaciones/me-cuesta-reconocer-cuando-necesito-descansar/

EN PATH: /en/situations/i-struggle-to-recognise-when-i-need-to-rest/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-089

ES SITUACIÓN: «Me cuesta saber cuándo me toca hablar»

EN SITUATION: “I find it hard to know when it is my turn to speak”

ES NECESITO: Que me des la palabra. Dime cuándo es mi turno.

EN I NEED: Give me the floor. Tell me when it is my turn.

ES RUTA: /es/situaciones/me-cuesta-saber-cuando-me-toca-hablar/

EN PATH: /en/situations/i-find-it-hard-to-know-when-it-is-my-turn-to-speak/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-090

ES SITUACIÓN: Me cuesta saber cuánta fuerza estoy usando

EN SITUATION: “I find it hard to judge how much force I am using”

ES NECESITO: Objetos resistentes. Dime si estoy usando demasiada fuerza.

EN I NEED: Strong objects. Tell me if I am using too much force.

ES RUTA: /es/situaciones/me-cuesta-saber-cuanta-fuerza-estoy-usando/

EN PATH: /en/situations/i-find-it-hard-to-judge-how-much-force-i-am-using/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-091

ES SITUACIÓN: «Me cuesta saber qué información contar en una primera conversación»

EN SITUATION: “I find it hard to know what information to share in a first conversation”

ES NECESITO: Un ejemplo de qué contar al conocer a alguien. Empieza tú.

EN I NEED: An example of what to share when meeting someone. You start.

ES RUTA: /es/situaciones/me-cuesta-saber-que-informacion-contar-en-una-primera-conversacion/

EN PATH: /en/situations/i-find-it-hard-to-know-what-information-to-share-in-a-first-conversation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-092

ES SITUACIÓN: «Me cuesta saber si alguien está enfadado conmigo»

EN SITUATION: “I find it hard to know whether someone is angry with me”

ES NECESITO: Que me digas si algo te ha molestado. Prefiero saberlo directamente.

EN I NEED: Tell me if something has upset you. I prefer to know directly.

ES RUTA: /es/situaciones/me-cuesta-saber-si-alguien-esta-enfadado-conmigo/

EN PATH: /en/situations/i-find-it-hard-to-know-whether-someone-is-angry-with-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-093

ES SITUACIÓN: «Me cuesta saber si tengo hambre o ansiedad»

EN SITUATION: “I find it hard to tell whether I am hungry or anxious”

ES NECESITO: Comer a horas regulares. Pregúntame cuándo comí por última vez.

EN I NEED: Regular meal times. Ask when I last ate.

ES RUTA: /es/situaciones/me-cuesta-saber-si-tengo-hambre-o-ansiedad/

EN PATH: /en/situations/i-find-it-hard-to-tell-whether-i-am-hungry-or-anxious/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-094

ES SITUACIÓN: «Me cuesta saber si una amistad sigue estando bien»

EN SITUATION: “I find it hard to know whether a friendship is still okay”

ES NECESITO: Que me digas cómo está nuestra amistad. Yo también te lo diré.

EN I NEED: Tell me how our friendship is going. I will tell you too.

ES RUTA: /es/situaciones/me-cuesta-saber-si-una-amistad-sigue-estando-bien/

EN PATH: /en/situations/i-find-it-hard-to-know-whether-a-friendship-is-still-okay/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-095

ES SITUACIÓN: «Me cuesta tirar objetos por si los necesito después»

EN SITUATION: “I struggle to throw things away in case I need them later”

ES NECESITO: Tiempo para decidir qué objetos guardar. Ayúdame a hacer una caja para decidir después.

EN I NEED: Time to decide which objects to keep. Help me make a box for later.

ES RUTA: /es/situaciones/me-cuesta-tirar-objetos-por-si-los-necesito-despues/

EN PATH: /en/situations/i-struggle-to-throw-things-away-in-case-i-need-them-later/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-096

ES SITUACIÓN: Me despierto con el cuerpo tenso

EN SITUATION: “I wake up with my body tense”

ES NECESITO: Estirarme al levantarme. Dame unos minutos antes de empezar el día.

EN I NEED: Stretching after I get up. Give me a few minutes before starting the day.

ES RUTA: /es/situaciones/me-despierto-con-el-cuerpo-tenso/

EN PATH: /en/situations/i-wake-up-with-my-body-tense/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-097

ES SITUACIÓN: Me despierto de madrugada y ya no vuelvo a dormirme

EN SITUATION: “I wake in the early hours and can't get back to sleep”

ES NECESITO: Levantarme un rato si no vuelvo a dormirme. Deja una luz baja.

EN I NEED: To get up briefly if I cannot sleep. Leave a low light on.

ES RUTA: /es/situaciones/me-despierto-de-madrugada/

EN PATH: /en/situations/i-wake-up-at-3am/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-098

ES SITUACIÓN: Me despierto varias veces cada noche

EN SITUATION: “I wake up several times every night”

ES NECESITO: Una habitación con poco ruido y poca luz. Anotar cuántas horas duermo.

EN I NEED: A room with little noise and light. Record how many hours I sleep.

ES RUTA: /es/situaciones/me-despierto-varias-veces-cada-noche/

EN PATH: /en/situations/i-wake-up-several-times-a-night/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-099

ES SITUACIÓN: Me duermo durante el día y luego no puedo dormir de noche

EN SITUATION: “I fall asleep during the day and then cannot sleep at night”

ES NECESITO: Una siesta corta con alarma. Despiértame a los veinte minutos.

EN I NEED: A short nap with an alarm. Wake me after twenty minutes.

ES RUTA: /es/situaciones/me-duermo-durante-el-dia-y-luego-no-puedo-dormir-de-noche/

EN PATH: /en/situations/i-fall-asleep-during-the-day-and-then-cannot-sleep-at-night/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-100

ES SITUACIÓN: Me entra sueño muy tarde aunque me levante temprano

EN SITUATION: “I only feel sleepy very late even when I get up early”

ES NECESITO: Acostarme cuando aparezca el sueño. Ajustar el horario poco a poco.

EN I NEED: To go to bed when I feel sleepy. Adjust the schedule gradually.

ES RUTA: /es/situaciones/me-entra-sueno-muy-tarde-aunque-me-levante-temprano/

EN PATH: /en/situations/i-only-feel-sleepy-very-late-even-when-i-get-up-early/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 081–100

ES: Situaciones «Necesito» incorporadas: 100/187.

EN: Situation «I need» entries added: 100/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-101

# 61. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-101

ES SITUACIÓN: Me mareo con ciertos movimientos o escaleras mecánicas

EN SITUATION: “Certain movements or escalators make me dizzy”

ES NECESITO: Usar el ascensor o moverme despacio. Dame el brazo en las escaleras.

EN I NEED: To use the lift or move slowly. Give me your arm on the stairs.

ES RUTA: /es/situaciones/me-mareo-con-ciertos-movimientos-o-escaleras-mecanicas/

EN PATH: /en/situations/certain-movements-or-escalators-make-me-dizzy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-102

ES SITUACIÓN: «Me preocupa contaminar algo o contaminarme»

EN SITUATION: “I worry about contaminating something or becoming contaminated”

ES NECESITO: Apoyo profesional para esta preocupación. Acompáñame a la consulta.

EN I NEED: Professional support for this worry. Come with me to the appointment.

ES RUTA: /es/situaciones/me-preocupa-contaminar-algo-o-contaminarme/

EN PATH: /en/situations/i-worry-about-contaminating-something-or-becoming-contaminated/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-103

ES SITUACIÓN: «Me preocupa haber hecho daño sin darme cuenta»

EN SITUATION: “I worry I may have harmed someone without realising”

ES NECESITO: Hablar de esta preocupación con un profesional. Escúchame una vez y cambiemos de actividad.

EN I NEED: To discuss this worry with a professional. Listen once, then let's change activity.

ES RUTA: /es/situaciones/me-preocupa-haber-hecho-dano-sin-darme-cuenta/

EN PATH: /en/situations/i-worry-i-may-have-harmed-someone-without-realising/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-104

ES SITUACIÓN: Me preocupa no dormir y tardo aún más en dormirme

EN SITUATION: “Worrying about not sleeping keeps me awake”

ES NECESITO: Quitar el reloj de la vista. Hablemos del sueño por la mañana.

EN I NEED: To keep the clock out of sight. Let's talk about sleep in the morning.

ES RUTA: /es/situaciones/me-preocupa-no-dormir-y-eso-me-mantiene-despierta/

EN PATH: /en/situations/worrying-about-not-sleeping-keeps-me-awake/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-105

ES SITUACIÓN: «Mi experiencia de género cambia con el tiempo»

EN SITUATION: “My experience of gender changes over time”

ES NECESITO: Que me preguntes qué nombre y pronombres uso hoy. Respeta los cambios.

EN I NEED: Ask which name and pronouns I use today. Respect any changes.

ES RUTA: /es/situaciones/mi-experiencia-de-genero-cambia-con-el-tiempo/

EN PATH: /en/situations/my-experience-of-gender-changes-over-time/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-106

ES SITUACIÓN: «Mi forma de vestir no coincide con lo que esperan de mi género»

EN SITUATION: “The way I dress doesn't match what people expect of my gender”

ES NECESITO: Vestirme con ropa cómoda para mí. Dime si hay una norma concreta.

EN I NEED: Comfortable clothes. Tell me if there is a specific rule.

ES RUTA: /es/situaciones/mi-forma-de-vestir-no-coincide-con-lo-que-esperan-de-mi/

EN PATH: /en/situations/the-way-i-dress-and-my-gender/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-107

ES SITUACIÓN: «Necesito ajustes en el trabajo»

EN SITUATION: “I need adjustments at work”

ES NECESITO: Ayuda para pedir ajustes en mi puesto. Dime a quién debo solicitarlos.

EN I NEED: Help to request adjustments at work. Tell me who to ask.

ES RUTA: /es/situaciones/necesito-ajustes-en-el-trabajo/

EN PATH: /en/situations/i-need-adjustments-at-work/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-108

ES SITUACIÓN: «Necesito ayuda para una cita médica»

EN SITUATION: “I need help with a medical appointment”

ES NECESITO: Preparar la cita médica antes. Acompáñame si puedes.

EN I NEED: To prepare for the medical appointment. Come with me if you can.

ES RUTA: /es/situaciones/necesito-ayuda-para-una-cita-medica/

EN PATH: /en/situations/i-need-help-with-a-medical-appointment/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-109

ES SITUACIÓN: «Necesito estar sola después de un evento social»

EN SITUATION: “I need to be alone after a social event”

ES NECESITO: Un rato a solas después del evento. Volveré a hablar cuando haya descansado.

EN I NEED: Time alone after the event. I will talk again after I have rested.

ES RUTA: /es/situaciones/necesito-estar-sola-despues-de-un-evento-social/

EN PATH: /en/situations/i-need-to-be-alone-after-a-social-event/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-110

ES SITUACIÓN: «Necesito hacer las cosas de casa siempre en el mismo orden»

EN SITUATION: “I need to do household tasks in the same order every time”

ES NECESITO: Hacer las tareas de casa en mi orden. Avísame antes de mover las cosas.

EN I NEED: To do household tasks in my own order. Tell me before moving things.

ES RUTA: /es/situaciones/necesito-hacer-las-cosas-de-casa-siempre-en-el-mismo-orden/

EN PATH: /en/situations/i-need-to-do-household-tasks-in-the-same-order-every-time/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-111

ES SITUACIÓN: Hago la misma rutina antes de dormir

EN SITUATION: “I need the same routine to be able to fall asleep”

ES NECESITO: Completar mi rutina antes de acostarme. Respeta ese tiempo.

EN I NEED: To complete my routine before bed. Respect that time.

ES RUTA: /es/situaciones/necesito-la-misma-rutina-para-poder-dormirme/

EN PATH: /en/situations/i-need-the-same-routine-to-be-able-to-fall-asleep/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-112

ES SITUACIÓN: «Necesito más tiempo para cambiar de una reunión a otra»

EN SITUATION: “I need more time to move from one meeting to another”

ES NECESITO: Diez minutos entre reuniones. Déjalos libres en el calendario.

EN I NEED: Ten minutes between meetings. Keep them free in the calendar.

ES RUTA: /es/situaciones/necesito-mas-tiempo-para-cambiar-de-una-reunion-a-otra/

EN PATH: /en/situations/i-need-more-time-to-move-from-one-meeting-to-another/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-113

ES SITUACIÓN: «Necesito más tiempo para procesar una pregunta»

EN SITUATION: “I need more time to process a question”

ES NECESITO: Unos segundos para pensar antes de responder. Espera mi respuesta.

EN I NEED: A few seconds to think before answering. Wait for my response.

ES RUTA: /es/situaciones/necesito-mas-tiempo-para-procesar-una-pregunta/

EN PATH: /en/situations/i-need-more-time-to-process-a-question/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-114

ES SITUACIÓN: Necesito moverme para poder concentrarme

EN SITUATION: “I need to move in order to concentrate”

ES NECESITO: Moverme mientras pienso. Poder levantarme durante la tarea.

EN I NEED: To move while I think. To stand up during the task.

ES RUTA: /es/situaciones/necesito-moverme-para-poder-concentrarme/

EN PATH: /en/situations/i-need-to-move-in-order-to-concentrate/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-115

ES SITUACIÓN: Si termino una actividad y me acuesto enseguida, no me duermo

EN SITUATION: “I need a long time to wind down before sleep”

ES NECESITO: Una hora tranquila antes de dormir. Terminar con las pantallas con tiempo.

EN I NEED: A quiet hour before sleep. Finish using screens well beforehand.

ES RUTA: /es/situaciones/necesito-mucho-tiempo-para-bajar-el-ritmo-antes-de-dormir/

EN PATH: /en/situations/i-need-a-long-time-to-wind-down-before-sleep/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-116

ES SITUACIÓN: «Necesito planes concretos para quedar con alguien»

EN SITUATION: “I need concrete plans when meeting someone”

ES NECESITO: Saber la hora, el lugar y el plan. Envíamelo por mensaje.

EN I NEED: To know the time, place and plan. Send it to me in a message.

ES RUTA: /es/situaciones/necesito-planes-concretos-para-quedar-con-alguien/

EN PATH: /en/situations/i-need-concrete-plans-when-meeting-someone/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-117

ES SITUACIÓN: «Necesito preparar con antelación lo que voy a decir en una reunión»

EN SITUATION: “I need to prepare in advance what I will say in a meeting”

ES NECESITO: Preparar antes lo que voy a decir. Envíame los puntos con tiempo.

EN I NEED: To prepare what I will say beforehand. Send me the meeting points in advance.

ES RUTA: /es/situaciones/necesito-preparar-con-antelacion-lo-que-voy-a-decir-en-una-reunion/

EN PATH: /en/situations/i-need-to-prepare-in-advance-what-i-will-say-in-a-meeting/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-118

ES SITUACIÓN: «Necesito que la comida tenga siempre la misma textura»

EN SITUATION: “I need food to have the same texture every time”

ES NECESITO: La comida con la textura habitual. Cocínala de la misma forma.

EN I NEED: Food with the usual texture. Cook it in the same way.

ES RUTA: /es/situaciones/necesito-que-la-comida-tenga-siempre-la-misma-textura/

EN PATH: /en/situations/i-need-food-to-have-the-same-texture-every-time/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-119

ES SITUACIÓN: «Necesito que me den las instrucciones por escrito»

EN SITUATION: “I need instructions in writing”

ES NECESITO: Las instrucciones por escrito. Envíamelas en un mensaje.

EN I NEED: Instructions in writing. Send them to me in a message.

ES RUTA: /es/situaciones/necesito-que-me-den-las-instrucciones-por-escrito/

EN PATH: /en/situations/i-need-instructions-in-writing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-120

ES SITUACIÓN: «Me lo explican y a los dos minutos no sé qué tenía que hacer»

EN SITUATION: “They explain it to me and two minutes later I don't know what I was meant to do”

ES NECESITO: Los pasos por escrito y de uno en uno.

EN I NEED: The steps in writing, one at a time.

ES RUTA: /es/situaciones/necesito-que-me-repitan-las-instrucciones/

EN PATH: /en/situations/i-need-instructions-repeated/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 101–120

ES: Situaciones «Necesito» incorporadas: 120/187.

EN: Situation «I need» entries added: 120/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-121

# 62. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-121

ES SITUACIÓN: «Necesito que otra persona me confirme que no he hecho nada malo»

EN SITUATION: “I need someone else to confirm that I have done nothing wrong”

ES NECESITO: Una respuesta clara. Después podemos cerrar el tema.

EN I NEED: One clear answer. Then we can close the topic.

ES RUTA: /es/situaciones/necesito-que-otra-persona-me-confirme-que-no-he-hecho-nada-malo/

EN PATH: /en/situations/i-need-someone-else-to-confirm-that-i-have-done-nothing-wrong/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-122

ES SITUACIÓN: «Necesito recuperarme después de una conversación difícil»

EN SITUATION: “I need time to recover after a difficult conversation”

ES NECESITO: Tiempo después de una conversación difícil. Dejemos el tema hasta otro día.

EN I NEED: Time after a difficult conversation. Leave the topic until another day.

ES RUTA: /es/situaciones/necesito-recuperarme-despues-de-una-conversacion-dificil/

EN PATH: /en/situations/i-need-time-to-recover-after-a-difficult-conversation/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-123

ES SITUACIÓN: «Necesito repetir una acción hasta que se siente bien»

EN SITUATION: “I need to repeat an action until it feels right”

ES NECESITO: Unos segundos para terminar el movimiento que estoy repitiendo.

EN I NEED: A few seconds to finish the movement I am repeating.

ES RUTA: /es/situaciones/necesito-repetir-una-accion-hasta-que-se-siente-bien/

EN PATH: /en/situations/i-need-to-repeat-an-action-until-it-feels-right/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-124

ES SITUACIÓN: «Necesito saber con exactitud qué va a ocurrir»

EN SITUATION: “I need to know exactly what is going to happen”

ES NECESITO: El plan con detalle. Dime también qué ocurrirá si cambia.

EN I NEED: A detailed plan. Tell me what will happen if it changes.

ES RUTA: /es/situaciones/necesito-saber-con-exactitud-que-va-a-ocurrir/

EN PATH: /en/situations/i-need-to-know-exactly-what-is-going-to-happen/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-125

ES SITUACIÓN: Necesito tocar o apretar cosas para calmarme

EN SITUATION: “I need to touch or squeeze things to regulate myself”

ES NECESITO: Un objeto para tocar o apretar. Poder llevarlo conmigo.

EN I NEED: An object to touch or squeeze. To carry it with me.

ES RUTA: /es/situaciones/necesito-tocar-o-apretar-cosas-para-regularme/

EN PATH: /en/situations/i-need-to-touch-or-squeeze-things-to-regulate-myself/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-126

ES SITUACIÓN: «Necesito un ajuste en clase o en el trabajo, pero no sé cómo pedirlo»

EN SITUATION: “I need an adjustment in class or at work, but I don't know how to ask for it”

ES NECESITO: Ayuda para pedir un ajuste. Escribamos juntos la petición.

EN I NEED: Help to ask for an adjustment. Let's write the request together.

ES RUTA: /es/situaciones/necesito-un-ajuste-y-no-se-como-pedirlo/

EN PATH: /en/situations/i-need-an-adjustment-and-dont-know-how-to-ask/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-127

ES SITUACIÓN: «Necesito una adaptación en clase»

EN SITUATION: “I need an adjustment in class”

ES NECESITO: Una adaptación en clase. Déjala por escrito.

EN I NEED: A classroom adjustment. Put it in writing.

ES RUTA: /es/situaciones/necesito-una-adaptacion-en-clase/

EN PATH: /en/situations/i-need-an-adjustment-in-class/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-128

ES SITUACIÓN: «Necesito ver cómo está preparada la comida antes de comerla»

EN SITUATION: “I need to see how food is prepared before I can eat it”

ES NECESITO: Ver cómo preparan la comida. Cocinemos juntos.

EN I NEED: To see how the food is prepared. Let's cook together.

ES RUTA: /es/situaciones/necesito-ver-como-esta-preparada-la-comida-antes-de-comerla/

EN PATH: /en/situations/i-need-to-see-how-food-is-prepared-before-i-can-eat-it/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-129

ES SITUACIÓN: «No consigo explicar mis síntomas al médico»

EN SITUATION: “I can't explain my symptoms to the doctor”

ES NECESITO: Llevar mis síntomas apuntados. Léelos conmigo durante la consulta.

EN I NEED: To bring my symptoms written down. Read them with me during the appointment.

ES RUTA: /es/situaciones/no-consigo-explicar-mis-sintomas-al-medico/

EN PATH: /en/situations/i-cant-explain-my-symptoms-to-the-doctor/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-130

ES SITUACIÓN: No me duermo si no sé cómo será mañana

EN SITUATION: “I can't sleep if I don't know what tomorrow will be like”

ES NECESITO: Saber el plan de mañana antes de acostarme. Déjamelo por escrito.

EN I NEED: To know tomorrow's plan before bed. Leave it in writing.

ES RUTA: /es/situaciones/no-me-duermo-si-no-se-como-sera-manana/

EN PATH: /en/situations/i-cant-sleep-until-i-know-about-tomorrow/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-131

ES SITUACIÓN: «Hay sitios en los que no me sale hablar»

EN SITUATION: “There are places where I can't get speech out”

ES NECESITO: Responder por escrito en los lugares donde hablar me cuesta. Acepta mi mensaje.

EN I NEED: To reply in writing where speaking is difficult. Accept my message.

ES RUTA: /es/situaciones/no-me-sale-hablar-en-algunos-sitios/

EN PATH: /en/situations/speech-doesnt-come-out/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-132

ES SITUACIÓN: No noto hambre ni sed

EN SITUATION: “They don't notice hunger or thirst”

ES NECESITO: Recordatorios para comer y beber. Deja el vaso a la vista.

EN I NEED: Reminders to eat and drink. Keep the glass where I can see it.

ES RUTA: /es/situaciones/no-nota-hambre-o-sed/

EN PATH: /en/situations/they-dont-notice-hunger-or-thirst/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-133

ES SITUACIÓN: No noto que tengo frío hasta que estoy temblando

EN SITUATION: “I do not notice I am cold until I am shivering”

ES NECESITO: Que me recuerdes llevar abrigo. Dime qué temperatura hará.

EN I NEED: Remind me to take a coat. Tell me what the temperature will be.

ES RUTA: /es/situaciones/no-noto-que-tengo-frio-hasta-que-estoy-temblando/

EN PATH: /en/situations/i-do-not-notice-i-am-cold-until-i-am-shivering/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-134

ES SITUACIÓN: «No quiero que mi nombre anterior aparezca delante de otras personas»

EN SITUATION: “I don't want my previous name to appear in front of other people”

ES NECESITO: Que uses solo mi nombre actual. Mantén el anterior en privado.

EN I NEED: Use only my current name. Keep my previous name private.

ES RUTA: /es/situaciones/no-quiero-que-aparezca-mi-nombre-anterior/

EN PATH: /en/situations/i-dont-want-my-previous-name-shown/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-135

ES SITUACIÓN: «No sé cuándo alguien espera que le escriba»

EN SITUATION: “I do not know when someone expects me to message them”

ES NECESITO: Que me digas si esperas una respuesta. Escríbeme cuando quieras hablar.

EN I NEED: Tell me if you expect a reply. Message me when you want to talk.

ES RUTA: /es/situaciones/no-se-cuando-alguien-espera-que-le-escriba/

EN PATH: /en/situations/i-do-not-know-when-someone-expects-me-to-message-them/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-136

ES SITUACIÓN: «No sé qué información es privada»

EN SITUATION: “I don't know what information is private”

ES NECESITO: Saber qué información es privada. Pregúntame antes de contarla a otra persona.

EN I NEED: To know what information is private. Ask before telling someone else.

ES RUTA: /es/situaciones/no-se-que-informacion-es-privada/

EN PATH: /en/situations/i-dont-know-what-information-is-private/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-137

ES SITUACIÓN: «No sé qué pronombre usar para una persona»

EN SITUATION: “I don't know which pronoun to use for someone”

ES NECESITO: Preguntarlo brevemente y en privado. Dime qué pronombres usas.

EN I NEED: To ask briefly and in private. Tell me which pronouns you use.

ES RUTA: /es/situaciones/no-se-que-pronombre-usar-para-una-persona/

EN PATH: /en/situations/i-dont-know-which-pronoun-to-use-for-someone/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-138

ES SITUACIÓN: No sé si necesito descansar, comer o alejarme del ruido

EN SITUATION: “I don't know whether I'm tired, overloaded or hungry”

ES NECESITO: Revisar si he comido, descansado y cuánto ruido hay.

EN I NEED: To check whether I have eaten, rested and how much noise there is.

ES RUTA: /es/situaciones/no-se-si-estoy-cansada-saturada-o-tengo-hambre/

EN PATH: /en/situations/i-dont-know-whether-im-tired-overloaded-or-hungry/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-139

ES SITUACIÓN: «Me dan una instrucción y no sé si la he entendido»

EN SITUATION: “I'm given an instruction and I don't know whether I understood it”

ES NECESITO: Repetir lo que he entendido. Corrígeme si falta información.

EN I NEED: To repeat what I understood. Correct me if information is missing.

ES RUTA: /es/situaciones/no-se-si-he-entendido-la-instruccion/

EN PATH: /en/situations/i-dont-know-if-i-understood/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-140

ES SITUACIÓN: «Organizar compra, cocinar y comer es demasiado en el mismo día»

EN SITUATION: “Shopping, cooking and eating are too much to organise in one day”

ES NECESITO: Repartir compra, cocina y comida en días distintos. Ayúdame con una tarea.

EN I NEED: To spread shopping, cooking and eating across different days. Help me with one task.

ES RUTA: /es/situaciones/organizar-compra-cocinar-y-comer-es-demasiado-en-el-mismo-dia/

EN PATH: /en/situations/shopping-cooking-and-eating-are-too-much-to-organise-in-one-day/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 121–140

ES: Situaciones «Necesito» incorporadas: 140/187.

EN: Situation «I need» entries added: 140/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-141

# 63. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-141

ES SITUACIÓN: «A media reunión desconecto y ya no sé por dónde van»

EN SITUATION: “Halfway through a meeting I zone out and lose the thread”

ES NECESITO: Un resumen durante la reunión. Dime en qué punto estamos.

EN I NEED: A summary during the meeting. Tell me where we are.

ES RUTA: /es/situaciones/pierdo-el-hilo-en-las-reuniones/

EN PATH: /en/situations/i-lose-the-thread-in-meetings/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-142

ES SITUACIÓN: «Pierdo las llaves y el móvil varias veces al día»

EN SITUATION: “I lose my keys and phone several times a day”

ES NECESITO: Un sitio fijo para las llaves y el móvil. Déjalos cerca de la puerta.

EN I NEED: A fixed place for my keys and phone. Keep them near the door.

ES RUTA: /es/situaciones/pierdo-las-llaves-y-el-movil/

EN PATH: /en/situations/i-lose-my-keys-and-phone/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-143

ES SITUACIÓN: Por la noche siento más ansiedad

EN SITUATION: “At night my anxiety gets bigger”

ES NECESITO: Compañía tranquila por la noche. Hablemos de otro tema un rato.

EN I NEED: Quiet company at night. Let's talk about something else for a while.

ES RUTA: /es/situaciones/por-la-noche-la-ansiedad-se-hace-mas-grande/

EN PATH: /en/situations/at-night-the-anxiety-gets-bigger/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-144

ES SITUACIÓN: «Pospongo incluso cosas que sí quiero hacer»

EN SITUATION: “I put off even things I genuinely want to do”

ES NECESITO: Empezar solo durante dos minutos. Quédate conmigo al principio.

EN I NEED: To start for just two minutes. Stay with me at the beginning.

ES RUTA: /es/situaciones/pospongo-incluso-cosas-que-si-quiero-hacer/

EN PATH: /en/situations/i-put-off-even-things-i-genuinely-want-to-do/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-145

ES SITUACIÓN: «Pregunto lo mismo varias veces para quedarme tranquila»

EN SITUATION: “I ask the same thing several times to feel reassured”

ES NECESITO: Una respuesta clara y corta. Dímela una vez para poder apuntarla.

EN I NEED: One clear, short answer. Tell me once so I can write it down.

ES RUTA: /es/situaciones/pregunto-lo-mismo-varias-veces-para-quedarme-tranquila/

EN PATH: /en/situations/i-ask-the-same-thing-several-times-to-feel-reassured/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-146

ES SITUACIÓN: «Preparar una maleta me desborda»

EN SITUATION: “Packing a suitcase overwhelms me”

ES NECESITO: Una lista para la maleta. Prepárala conmigo el día anterior.

EN I NEED: A packing list. Prepare it with me the day before.

ES RUTA: /es/situaciones/preparar-una-maleta-me-desborda/

EN PATH: /en/situations/packing-a-suitcase-overwhelms-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-147

ES SITUACIÓN: «Puedo pasar horas sin acordarme de beber»

EN SITUATION: “I can go for hours without remembering to drink”

ES NECESITO: La botella siempre a la vista. Recuérdame beber con regularidad.

EN I NEED: To keep my bottle in sight. Remind me to drink regularly.

ES RUTA: /es/situaciones/puedo-pasar-horas-sin-acordarme-de-beber/

EN PATH: /en/situations/i-can-go-for-hours-without-remembering-to-drink/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-148

ES SITUACIÓN: «Quiero hacerlo, pero no consigo empezar»

EN SITUATION: “I want to do it, but I can't get started”

ES NECESITO: Un primer paso muy pequeño. Empiézalo conmigo.

EN I NEED: One very small first step. Start it with me.

ES RUTA: /es/situaciones/quiero-hacerlo-pero-no-consigo-empezar/

EN PATH: /en/situations/i-want-to-do-it-but-i-cant-get-started/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-149

ES SITUACIÓN: «Al acostarme repaso todo lo que hice mal»

EN SITUATION: “When I go to bed I replay everything I did wrong”

ES NECESITO: Dejar para mañana el repaso de mis errores. Anotar lo importante en un papel.

EN I NEED: Leave reviewing my mistakes until tomorrow. Write down anything important.

ES RUTA: /es/situaciones/repaso-en-la-cama-todo-lo-que-hice-mal/

EN PATH: /en/situations/i-replay-everything-i-did-wrong/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-150

ES SITUACIÓN: «Repaso una conversación durante horas»

EN SITUATION: “I replay a conversation for hours”

ES NECESITO: Contar una vez la conversación. Escúchame cinco minutos y cambiemos de actividad.

EN I NEED: To talk through the conversation once. Listen for five minutes, then let's change activity.

ES RUTA: /es/situaciones/repaso-una-conversacion-durante-horas/

EN PATH: /en/situations/i-replay-a-conversation-for-hours/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-151

ES SITUACIÓN: «Repito mentalmente palabras o frases para sentirme segura»

EN SITUATION: “I repeat words or phrases in my head to feel safe”

ES NECESITO: Unos segundos para terminar la frase que estoy repitiendo mentalmente.

EN I NEED: A few seconds to finish the phrase I am repeating in my head.

ES RUTA: /es/situaciones/repito-mentalmente-palabras-o-frases-para-sentirme-segura/

EN PATH: /en/situations/i-repeat-words-or-phrases-in-my-head-to-feel-safe/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-152

ES SITUACIÓN: «Repito palabras y frases»

EN SITUATION: “I repeat words and phrases”

ES NECESITO: Repetir palabras o frases para entender mejor. Sigue hablando con normalidad.

EN I NEED: To repeat words or phrases to understand better. Keep speaking normally.

ES RUTA: /es/situaciones/repito-palabras-y-frases/

EN PATH: /en/situations/i-repeat-words-and-phrases/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-153

ES SITUACIÓN: «Reviso varias veces si he cerrado la puerta»

EN SITUATION: “I check several times whether I locked the door”

ES NECESITO: Comprobar una vez que la puerta está cerrada. Después podemos marcharnos.

EN I NEED: To check once that the door is locked. Then we can leave.

ES RUTA: /es/situaciones/reviso-varias-veces-si-he-cerrado-la-puerta/

EN PATH: /en/situations/i-check-several-times-whether-i-locked-the-door/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-154

ES SITUACIÓN: «Salir de casa me lleva mucho más tiempo de lo que calculo»

EN SITUATION: “Leaving the house takes much longer than I expect”

ES NECESITO: Empezar a prepararme con más tiempo. Avísame media hora antes de salir.

EN I NEED: To start getting ready earlier. Tell me half an hour before we leave.

ES RUTA: /es/situaciones/salir-de-casa-me-lleva-mucho-mas-tiempo-de-lo-que-calculo/

EN PATH: /en/situations/leaving-the-house-takes-much-longer-than-i-expect/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-155

ES SITUACIÓN: «Sé lo que quiero decir pero no encuentro las palabras»

EN SITUATION: “I know what I want to say but cannot find the words”

ES NECESITO: Un momento para encontrar la palabra. Espera antes de terminar mi frase.

EN I NEED: A moment to find the word. Wait before finishing my sentence.

ES RUTA: /es/situaciones/se-lo-que-quiero-decir-pero-no-encuentro-las-palabras/

EN PATH: /en/situations/i-know-what-i-want-to-say-but-cannot-find-the-words/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-156

ES SITUACIÓN: «Se me acumula la ropa y no sé por dónde empezar»

EN SITUATION: “The laundry piles up and I don't know where to start”

ES NECESITO: Empezar por una cesta de ropa. Hazlo conmigo la primera vez.

EN I NEED: To start with one basket of clothes. Do it with me the first time.

ES RUTA: /es/situaciones/se-me-acumula-la-ropa/

EN PATH: /en/situations/laundry-piles-up/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-157

ES SITUACIÓN: «Se me acumulan tareas pequeñas hasta que parecen imposibles»

EN SITUATION: “Small tasks pile up until they feel impossible”

ES NECESITO: Una lista con tres tareas. Ayúdame a elegir cuáles van primero.

EN I NEED: A list with three tasks. Help me choose which come first.

ES RUTA: /es/situaciones/se-me-acumulan-tareas-pequenas-hasta-que-parecen-imposibles/

EN PATH: /en/situations/small-tasks-pile-up-until-they-feel-impossible/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-158

ES SITUACIÓN: «Se me olvida comer y luego me da un bajón»

EN SITUATION: “I forget to eat and then I crash”

ES NECESITO: Alarmas para las comidas. Come conmigo cuando puedas.

EN I NEED: Alarms for meals. Eat with me when you can.

ES RUTA: /es/situaciones/se-me-olvida-comer/

EN PATH: /en/situations/i-forget-to-eat/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-159

ES SITUACIÓN: «Si algo no está colocado como esperaba no puedo dejar de mirarlo»

EN SITUATION: “If something is not placed as I expected, I cannot stop looking at it”

ES NECESITO: Colocarlo como esperaba antes de continuar. Dame un minuto.

EN I NEED: To put it where I expected before continuing. Give me a minute.

ES RUTA: /es/situaciones/si-algo-no-esta-colocado-como-esperaba-no-puedo-dejar-de-mirarlo/

EN PATH: /en/situations/if-something-is-not-placed-as-i-expected-i-cannot-stop-looking-at-it/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-160

ES SITUACIÓN: «Si aparece un pensamiento horrible temo que diga algo sobre mí»

EN SITUATION: “When a horrible thought appears, I fear it says something about me”

ES NECESITO: Hablar de este pensamiento con un profesional. Recuérdame que pensar algo no me define.

EN I NEED: Discuss this thought with a professional. Remind me that thoughts do not define me.

ES RUTA: /es/situaciones/si-aparece-un-pensamiento-horrible-temo-que-diga-algo-sobre-mi/

EN PATH: /en/situations/when-a-horrible-thought-appears-i-fear-it-says-something-about-me/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 141–160

ES: Situaciones «Necesito» incorporadas: 160/187.

EN: Situation «I need» entries added: 160/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-161

# 64. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CONTINUACIÓN

## WEB-IRIS-SITUATION-NEED-161

ES SITUACIÓN: Si cambia algo de mi rutina de noche, no me duermo

EN SITUATION: “If anything changes in my night-time routine, I can't sleep”

ES NECESITO: Mantener mi rutina de noche. Avísame con tiempo si habrá cambios.

EN I NEED: To keep my night routine. Tell me in advance if there will be changes.

ES RUTA: /es/situaciones/si-cambia-mi-rutina-no-me-duermo/

EN PATH: /en/situations/any-change-to-my-night-routine/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-162

ES SITUACIÓN: «Si no está la comida que esperaba prefiero no comer»

EN SITUATION: “If the food I expected is not there, I would rather not eat”

ES NECESITO: Saber qué habrá de comer. Guarda una comida que ya conozco.

EN I NEED: To know what food will be available. Keep a food I already know.

ES RUTA: /es/situaciones/si-no-esta-la-comida-que-esperaba-prefiero-no-comer/

EN PATH: /en/situations/if-the-food-i-expected-is-not-there-i-would-rather-not-eat/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-163

ES SITUACIÓN: «Si no puedo comprobar algo me cuesta pensar en otra cosa»

EN SITUATION: “If I cannot check something, I struggle to think about anything else”

ES NECESITO: Apoyo profesional para dejar de comprobar. Acompáñame mientras lo practico.

EN I NEED: Professional support to stop checking. Stay with me while I practise.

ES RUTA: /es/situaciones/si-no-puedo-comprobar-algo-me-cuesta-pensar-en-otra-cosa/

EN PATH: /en/situations/if-i-cannot-check-something-i-struggle-to-think-about-anything-else/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-164

ES SITUACIÓN: «Siento que actúo todo el día para parecer normal»

EN SITUATION: “I feel as though I'm acting all day to look normal”

ES NECESITO: Un lugar donde pueda hablar, moverme y descansar sin aparentar.

EN I NEED: A place where I can talk, move and rest without pretending.

ES RUTA: /es/situaciones/siento-que-actuo-todo-el-dia-para-parecer-normal/

EN PATH: /en/situations/i-feel-as-though-im-acting-all-day-to-look-normal/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-165

ES SITUACIÓN: «Siento que tengo que ocultar partes de mí para encajar»

EN SITUATION: “I feel I have to hide parts of myself to fit in”

ES NECESITO: Un lugar donde pueda hablar de mis gustos, identidad y necesidades. Escúchame.

EN I NEED: A place to talk about my interests, identity and needs. Listen to me.

ES RUTA: /es/situaciones/siento-que-tengo-que-ocultar-partes-de-mi-para-encajar/

EN PATH: /en/situations/i-feel-i-have-to-hide-parts-of-myself-to-fit-in/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-166

ES SITUACIÓN: «Siento que tengo que parecer normal para encajar»

EN SITUATION: “I feel I have to look normal to fit in”

ES NECESITO: Tiempo sin vigilar cómo hablo, me muevo o respondo. Trátame con naturalidad.

EN I NEED: Time without monitoring how I speak, move or respond. Treat me naturally.

ES RUTA: /es/situaciones/siento-que-tengo-que-parecer-normal-para-encajar/

EN PATH: /en/situations/i-feel-i-have-to-look-normal-to-fit-in/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-167

ES SITUACIÓN: «Siguen usando un nombre que ya no utilizo»

EN SITUATION: “People keep using a name I no longer use”

ES NECESITO: Que uses mi nombre actual. Si te equivocas, corrige y continúa.

EN I NEED: Use my current name. If you make a mistake, correct it and continue.

ES RUTA: /es/situaciones/siguen-usando-un-nombre-que-ya-no-utilizo/

EN PATH: /en/situations/people-keep-using-a-name-i-no-longer-use/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-168

ES SITUACIÓN: «Solo consigo arrancar cuando algo me interesa mucho»

EN SITUATION: “I can only get started when something interests me a lot”

ES NECESITO: Relacionar la tarea con algo que me interese. Ayúdame a encontrar esa relación.

EN I NEED: To connect the task with something that interests me. Help me find that connection.

ES RUTA: /es/situaciones/solo-consigo-arrancar-cuando-algo-me-interesa-mucho/

EN PATH: /en/situations/i-can-only-get-started-when-something-interests-me-a-lot/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-169

ES SITUACIÓN: «Solo puedo comer unas pocas marcas o preparaciones»

EN SITUATION: “I can only eat a few brands or preparations”

ES NECESITO: Esas marcas o preparaciones concretas. Apúntalas en la lista de la compra.

EN I NEED: Those specific brands or preparations. Add them to the shopping list.

ES RUTA: /es/situaciones/solo-puedo-comer-unas-pocas-marcas-o-preparaciones/

EN PATH: /en/situations/i-can-only-eat-a-few-brands-or-preparations/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-170

ES SITUACIÓN: «Soy autista y también trans o no binario»

EN SITUATION: “I'm autistic and I'm also trans or non-binary”

ES NECESITO: Que respetes mi autismo y mi identidad de género. Pregúntame antes de hacer suposiciones.

EN I NEED: Respect my autism and my gender identity. Ask before making assumptions.

ES RUTA: /es/situaciones/soy-autista-y-tambien-trans-o-no-binario/

EN PATH: /en/situations/im-autistic-and-im-also-trans-or-non-binary/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-171

ES SITUACIÓN: «Tardo muchísimo en terminar una comida»

EN SITUATION: “It takes me a very long time to finish a meal”

ES NECESITO: Comer a mi ritmo. Puedes empezar o terminar antes que yo.

EN I NEED: To eat at my own pace. You can start or finish before me.

ES RUTA: /es/situaciones/tardo-muchisimo-en-terminar-una-comida/

EN PATH: /en/situations/it-takes-me-a-very-long-time-to-finish-a-meal/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-172

ES SITUACIÓN: «Tardo mucho en contestar y alguien contesta por mí»

EN SITUATION: “I take a long time to answer and someone answers for me”

ES NECESITO: Responder por mí misma. Espera mi respuesta aunque tarde.

EN I NEED: To answer for myself. Wait for my reply even if it takes time.

ES RUTA: /es/situaciones/tardo-mucho-en-contestar/

EN PATH: /en/situations/i-take-a-long-time-to-answer/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-173

ES SITUACIÓN: Al acostarme sigo pensando en muchas cosas

EN SITUATION: “My mind becomes active as soon as I go to bed”

ES NECESITO: Escribir mis ideas antes de dormir. Deja papel y bolígrafo en la mesilla.

EN I NEED: Write down my ideas before sleep. Leave paper and a pen by the bed.

ES RUTA: /es/situaciones/tengo-la-cabeza-activa-justo-cuando-me-acuesto/

EN PATH: /en/situations/my-mind-becomes-active-as-soon-as-i-go-to-bed/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-174

ES SITUACIÓN: Tengo sueños muy intensos y después tardo en volver a dormirme

EN SITUATION: “I have very intense dreams and struggle to fall asleep again”

ES NECESITO: Levantarme un rato después de un sueño intenso. Deja una luz baja.

EN I NEED: Get up briefly after an intense dream. Leave a low light on.

ES RUTA: /es/situaciones/tengo-suenos-muy-intensos-y-me-cuesta-volver-a-dormir/

EN PATH: /en/situations/i-have-very-intense-dreams-and-struggle-to-fall-asleep-again/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-175

ES SITUACIÓN: «Trabajo bien con una fecha límite y me bloqueo sin ella»

EN SITUATION: “I work well with a deadline and get stuck without one”

ES NECESITO: Una fecha límite concreta. Pon una fecha aunque la tarea sea pequeña.

EN I NEED: A clear deadline. Set a date even for a small task.

ES RUTA: /es/situaciones/trabajo-bien-con-una-fecha-limite-y-me-bloqueo-sin-ella/

EN PATH: /en/situations/i-work-well-with-a-deadline-and-get-stuck-without-one/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-176

ES SITUACIÓN: «Un cambio pequeño altera todo el día»

EN SITUATION: “A small change disrupts my whole day”

ES NECESITO: Saber los cambios en cuanto los conozcas. Dame tiempo para adaptarme.

EN I NEED: To know about changes as soon as you do. Give me time to adjust.

ES RUTA: /es/situaciones/un-cambio-pequeno-altera-todo-el-dia/

EN PATH: /en/situations/a-small-change-disrupts-my-whole-day/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-177

ES SITUACIÓN: «Una avería o trámite inesperado me bloquea»

EN SITUATION: “An unexpected repair or admin task makes me freeze”

ES NECESITO: Los pasos por escrito ante una avería o trámite. Hagamos juntos la llamada.

EN I NEED: Written steps for an unexpected repair or form. Let's make the call together.

ES RUTA: /es/situaciones/una-averia-o-tramite-inesperado-me-bloquea/

EN PATH: /en/situations/an-unexpected-repair-or-admin-task-makes-me-freeze/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-178

ES SITUACIÓN: «Una comida que antes toleraba de repente ya no puedo comerla»

EN SITUATION: “A food I used to tolerate suddenly becomes impossible to eat”

ES NECESITO: Cambiar a otra comida que ya tolero. Mantén disponibles las que sí como.

EN I NEED: To switch to another food I already tolerate. Keep my usual foods available.

ES RUTA: /es/situaciones/una-comida-que-antes-toleraba-de-repente-ya-no-puedo-comerla/

EN PATH: /en/situations/a-food-i-used-to-tolerate-suddenly-becomes-impossible-to-eat/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-179

ES SITUACIÓN: «Una duda pequeña crece hasta ocuparme todo el día»

EN SITUATION: “A small doubt grows until it takes over my whole day”

ES NECESITO: Un tiempo concreto para pensar en la duda. Si vuelve, hablarlo con un profesional.

EN I NEED: A set time for the doubt. If it returns, discuss it with a professional.

ES RUTA: /es/situaciones/una-duda-pequena-crece-hasta-ocuparme-todo-el-dia/

EN PATH: /en/situations/a-small-doubt-grows-until-it-takes-over-my-whole-day/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-180

ES SITUACIÓN: «Una interrupción me hace perder por completo el hilo»

EN SITUATION: “An interruption makes me lose my train of thought completely”

ES NECESITO: Terminar lo que estoy haciendo antes de responder. Apunta tu pregunta para después.

EN I NEED: To finish what I am doing before replying. Write down your question for later.

ES RUTA: /es/situaciones/una-interrupcion-me-hace-perder-por-completo-el-hilo/

EN PATH: /en/situations/an-interruption-makes-me-lose-my-train-of-thought-completely/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CONTROL DE PROGRESO · SITUACIONES «NECESITO» 161–180

ES: Situaciones «Necesito» incorporadas: 180/187.

EN: Situation «I need» entries added: 180/187.

SIGUIENTE REGISTRO: WEB-IRIS-SITUATION-NEED-181

# 65. TARJETA IRIS · SITUACIONES · «NECESITO / I NEED» · CIERRE

## WEB-IRIS-SITUATION-NEED-181

ES SITUACIÓN: «Una llamada telefónica me resulta mucho más difícil que escribir»

EN SITUATION: “A phone call is much harder for me than writing”

ES NECESITO: Escribir en lugar de llamar. Envíame un mensaje.

EN I NEED: To write instead of calling. Send me a message.

ES RUTA: /es/situaciones/una-llamada-telefonica-me-resulta-mucho-mas-dificil-que-escribir/

EN PATH: /en/situations/a-phone-call-is-much-harder-for-me-than-writing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-182

ES SITUACIÓN: «Una oficina abierta me deja sin energía»

EN SITUATION: “An open-plan office drains my energy”

ES NECESITO: Trabajar en un lugar con menos gente. Dame una mesa apartada.

EN I NEED: To work somewhere with fewer people. Give me a desk away from others.

ES RUTA: /es/situaciones/una-oficina-abierta-me-deja-sin-energia/

EN PATH: /en/situations/an-open-plan-office-drains-my-energy/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-183

ES SITUACIÓN: Me tumbo para una siesta corta y termino durmiendo varias horas

EN SITUATION: “A short nap turns into several hours”

ES NECESITO: Una alarma para la siesta. Despiértame si sigo durmiendo.

EN I NEED: An alarm for my nap. Wake me if I am still sleeping.

ES RUTA: /es/situaciones/una-siesta-corta-se-convierte-en-varias-horas/

EN PATH: /en/situations/a-short-nap-turns-into-several-hours/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-184

ES SITUACIÓN: «Una tarea grande me bloquea antes de empezar»

EN SITUATION: “A large task blocks me before I even start”

ES NECESITO: Dividir una tarea grande en partes pequeñas. Dime cuál va primero.

EN I NEED: To split a large task into small parts. Tell me which comes first.

ES RUTA: /es/situaciones/una-tarea-grande-me-bloquea-antes-de-empezar/

EN PATH: /en/situations/a-large-task-blocks-me-before-i-even-start/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-185

ES SITUACIÓN: «Usar otro nombre me hace sentir más cómoda»

EN SITUATION: “Using another name makes me feel more comfortable”

ES NECESITO: Que uses ese nombre conmigo. Úsalo también delante de otras personas.

EN I NEED: Use that name for me. Use it in front of other people too.

ES RUTA: /es/situaciones/usar-otro-nombre-me-hace-sentir-mas-comoda/

EN PATH: /en/situations/using-another-name-makes-me-feel-more-comfortable/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-186

ES SITUACIÓN: Cuando viajo, mi horario de sueño cambia por completo

EN SITUATION: “Travel completely disrupts my sleep”

ES NECESITO: Unos días para recuperar mi horario de sueño. Mantén tranquilo el primer día.

EN I NEED: A few days to recover my sleep schedule. Keep the first day quiet.

ES RUTA: /es/situaciones/viajar-me-rompe-por-completo-el-sueno/

EN PATH: /en/situations/travel-completely-disrupts-my-sleep/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-SITUATION-NEED-187

ES SITUACIÓN: «Vuelvo atrás para comprobar si he apagado algo»

EN SITUATION: “I go back to check whether I switched something off”

ES NECESITO: Comprobar una vez que está apagado. Después podemos seguir con lo que hacíamos.

EN I NEED: Check once that it is switched off. Then continue what we were doing.

ES RUTA: /es/situaciones/vuelvo-atras-para-comprobar-si-he-apagado-algo/

EN PATH: /en/situations/i-go-back-to-check-whether-i-switched-something-off/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CIERRE · SITUACIONES «NECESITO / I NEED»

ES: Situaciones «Necesito» completas: 187/187.

EN: Situation «I need» entries complete: 187/187.

ESTADO: SECTION_COMPLETE

---

## CIERRE · TARJETA IRIS «NECESITO / I NEED»

ES: La fuente canónica indica que, con esta tercera tanda, quedan completas las 415 entradas «Necesito».

EN: The canonical source states that this third batch completes all 415 «I need» entries.

ESTADO: COLLECTION_COMPLETE

---

## QA · TARJETA IRIS · SITUACIONES «NECESITO»

- SOURCE_ENTRIES: 187
- BILINGUAL_COMPLETE: 187/187
- UNIQUE_ES_ROUTES: 187/187
- UNIQUE_EN_ROUTES: 187/187
- UNIQUE_IDS: 187/187
- SOURCE_MAPPING_TO_BUSCADOR: 187/187
- MISSING_ES: 0
- MISSING_EN: 0
- STATUS: PASS

SIGUIENTE FASE: continuar el mismo MD con el siguiente corpus complementario canónico, sin fragmentar la Biblioteca Maestra.

# 66. TARJETA IRIS · VIDA DIARIA · «NECESITO / I NEED» · TANDA 1 RECUPERADA

FUENTE: `editorial/tarjetas-necesito-vida-diaria.json` · rama `main` de Iris Green.

ES NOTA DE FUENTE: Bloque «Necesito» de la Tarjeta Iris. Tanda 1 de 3: Vida diaria (48). Pendientes: Condiciones (180) y Situaciones (187).

EN SOURCE NOTE: Iris Card «I need» block. Batch 1 of 3: Daily life (48). Pending: Conditions (180) and Situations (187).

ES REGLA EDITORIAL: El título del bloque ya es «Necesito», así que el texto no lo repite. Máximo 2 frases y unas 14 palabras. Lectura clara: frases cortas, una idea por frase, verbos directos y palabras de todos los días. Todo en positivo: digo qué necesito. Sin etiquetas, defensas, abstracciones ni palabras vagas. Sin muletillas. La segunda frase no empieza por «Y». Evitar «a veces», «así», «luego», «cuando lo pida» y «un poco». No usar «Me ayuda».

EN EDITORIAL RULE: The block title is already «I need», so the text does not repeat it. Maximum 2 sentences and about 14 words. Clear reading: short sentences, one idea per sentence, direct verbs and everyday words. State what is needed in positive terms. No labels, defences, abstract wording or vague words. No filler phrases. The second sentence does not start with «And». Avoid repeated stock phrases. Do not use «It helps me».

ESTADO DE LA COLECCIÓN: BILINGUAL_COMPLETE

## WEB-IRIS-DAILY-NEED-001

ES TEMA: Abuso, explotación y relaciones seguras

EN TOPIC: Abuse, exploitation and safe relationships

ES NECESITO: Hablar contigo a solas. Explícame a quién debes avisar y por qué.

EN I NEED: To talk to you in private. Tell me who you must inform and why.

ES RUTA: /es/biblioteca/abuso-explotacion-y-relaciones-seguras/

EN PATH: /en/everyday-life/abuse-exploitation-and-safe-relationships/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-002

ES TEMA: Acoso, discriminación, racismo y cómo actuar

EN TOPIC: Bullying, discrimination, racism and how to act

ES NECESITO: Que apuntes lo que ha pasado. Dime después qué vais a hacer.

EN I NEED: You to write down what happened. Tell me what you will do next.

ES RUTA: /es/biblioteca/acoso-discriminacion-racismo-y-como-actuar/

EN PATH: /en/everyday-life/bullying-discrimination-racism-and-how-to-act/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-003

ES TEMA: Actividad física, deporte y piscina

EN TOPIC: Physical activity, sport and swimming

ES NECESITO: Saber antes qué vamos a hacer. Poder salir del agua en cualquier momento.

EN I NEED: To know the plan in advance. To leave the water at any time.

ES RUTA: /es/biblioteca/actividad-fisica-deporte-y-piscina/

EN PATH: /en/everyday-life/physical-activity-sport-and-swimming/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-004

ES TEMA: Ajustes razonables en el trabajo

EN TOPIC: Reasonable adjustments at work

ES NECESITO: Pedir un cambio en mi puesto. Recibir la respuesta por escrito.

EN I NEED: To request a change at work. To receive the reply in writing.

ES RUTA: /es/biblioteca/ajustes-razonables-en-el-trabajo/

EN PATH: /en/everyday-life/reasonable-adjustments-at-work/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-005

ES TEMA: Amistad, soledad, pertenencia y fatiga social

EN TOPIC: Friendship, loneliness, belonging and social fatigue

ES NECESITO: Tiempo para contestar. Prefiero quedar contigo en planes cortos.

EN I NEED: Time to reply. I prefer spending time with you in short plans.

ES RUTA: /es/biblioteca/amistad-soledad-pertenencia-y-fatiga-social/

EN PATH: /en/everyday-life/friendship-loneliness-belonging-and-social-fatigue/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-006

ES TEMA: ARFID, TCA y pica: cuándo el apoyo cotidiano necesita atención clínica

EN TOPIC: ARFID, eating disorders and pica: when everyday support needs clinical care

ES NECESITO: Que un médico compruebe si como suficiente. Comer en un lugar tranquilo.

EN I NEED: A doctor to check whether I am eating enough. To eat somewhere quiet.

ES RUTA: /es/biblioteca/arfid-tca-y-pica-cuando-el-apoyo-cotidiano-necesita-atencion-clinica/

EN PATH: /en/everyday-life/arfid-eating-disorders-and-pica-when-everyday-support-needs-clinical-care/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-007

ES TEMA: Buscar trabajo siendo neurodivergente

EN TOPIC: Looking for work as a neurodivergent person

ES NECESITO: Ayuda para buscar trabajo. Yo decido qué información personal doy a cada empresa.

EN I NEED: Help to find work. I decide what personal information I share with each employer.

ES RUTA: /es/biblioteca/buscar-trabajo-siendo-neurodivergente/

EN PATH: /en/everyday-life/looking-for-work-as-a-neurodivergent-person/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-008

ES TEMA: Cine, teatro y museos con menos estímulos

EN TOPIC: Cinema, theatre and museums with fewer stimuli

ES NECESITO: Saber si hay sesiones con menos ruido y luz. Poder salir antes del final.

EN I NEED: To know about quieter, dimmer sessions. To leave before the end.

ES RUTA: /es/biblioteca/cine-teatro-y-museos-con-menos-estimulos/

EN PATH: /en/everyday-life/cinema-theatre-and-museums-with-fewer-stimuli/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-009

ES TEMA: Cocinar y seguridad doméstica

EN TOPIC: Cooking and home safety

ES NECESITO: Tener los pasos delante. Silencio mientras cocino.

EN I NEED: The steps in front of me. Quiet while I cook.

ES RUTA: /es/biblioteca/cocinar-y-seguridad-domestica/

EN PATH: /en/everyday-life/cooking-and-home-safety/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-010

ES TEMA: Colegio e instituto: apoyos, adaptaciones, asistencia y exámenes

EN TOPIC: School and secondary school: support, adaptations, attendance and exams

ES NECESITO: Mis apoyos por escrito. Poder usarlos también en los exámenes.

EN I NEED: My support arrangements in writing. To use them in exams too.

ES RUTA: /es/biblioteca/colegio-e-instituto-apoyos-adaptaciones-asistencia-y-examenes/

EN PATH: /en/everyday-life/school-and-secondary-school-support-adaptations-attendance-and-exams/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-011

ES TEMA: Compras, recados y esperas

EN TOPIC: Shopping, errands and waiting

ES NECESITO: Una lista corta. Poder salir de la tienda en cualquier momento.

EN I NEED: A short list. To leave the shop at any time.

ES RUTA: /es/biblioteca/compras-recados-y-esperas/

EN PATH: /en/everyday-life/shopping-errands-and-waiting/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-012

ES TEMA: Comunicación sin habla, mutismo, apraxia, tartamudez y habla difícil

EN TOPIC: Communication without speech, mutism, apraxia, stuttering and difficult speech

ES NECESITO: Escribir o señalar si me cuesta hablar. Espera a que termine.

EN I NEED: To write or point if speaking is hard. Wait until I finish.

ES RUTA: /es/biblioteca/comunicacion-sin-habla-mutismo-apraxia-tartamudez-y-habla-dificil/

EN PATH: /en/everyday-life/communication-without-speech-mutism-apraxia-stuttering-and-difficult-speech/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-013

ES TEMA: Crisis de ansiedad, pánico y salud mental: qué hacer y dónde pedir ayuda

EN TOPIC: Anxiety, panic and mental health crises: what to do and where to ask for help

ES NECESITO: Un sitio tranquilo y pocas preguntas. Hablar de lo ocurrido más tarde.

EN I NEED: A quiet place and few questions. To talk about what happened later.

ES RUTA: /es/biblioteca/crisis-de-ansiedad-panico-y-salud-mental-que-hacer-y-donde-pedir-ayuda/

EN PATH: /en/everyday-life/anxiety-panic-and-mental-health-crises-what-to-do-and-where-to-ask-for-help/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-014

ES TEMA: Descanso, fatiga, masking y recuperación

EN TOPIC: Rest, fatigue, masking and recovery

ES NECESITO: Un rato a solas después de un día largo. Volver cuando haya descansado.

EN I NEED: Time alone after a long day. To come back after resting.

ES RUTA: /es/biblioteca/descanso-fatiga-masking-y-recuperacion/

EN PATH: /en/everyday-life/rest-fatigue-masking-and-recovery/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-015

ES TEMA: Diagnóstico tardío, autoaceptación, autodefensa y cómo pedir apoyos

EN TOPIC: Late diagnosis, self-acceptance, self-advocacy and how to ask for support

ES NECESITO: Decidir a quién cuento mi diagnóstico. Pedir apoyo cuando lo necesite.

EN I NEED: To choose who I tell about my diagnosis. To ask for support when needed.

ES RUTA: /es/biblioteca/diagnostico-tardio-autoaceptacion-autodefensa-y-como-pedir-apoyos/

EN PATH: /en/everyday-life/late-diagnosis-self-acceptance-self-advocacy-and-how-to-ask-for-support/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-016

ES TEMA: Dinero, contratos, formularios y trámites

EN TOPIC: Money, contracts, forms and paperwork

ES NECESITO: Una copia de los documentos. Tiempo para hacer preguntas con calma.

EN I NEED: A copy of the documents. Time to ask questions calmly.

ES RUTA: /es/biblioteca/dinero-contratos-formularios-y-tramites/

EN PATH: /en/everyday-life/money-contracts-forms-and-paperwork/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-017

ES TEMA: Discapacidad, dependencia, pobreza y acceso a apoyos

EN TOPIC: Disability, dependency, poverty and access to support

ES NECESITO: Saber qué ayudas me corresponden. Explícame cómo pedirlas.

EN I NEED: To know what support I can get. Tell me how to apply.

ES RUTA: /es/biblioteca/discapacidad-dependencia-pobreza-y-acceso-a-apoyos/

EN PATH: /en/everyday-life/disability-dependency-poverty-and-access-to-support/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-018

ES TEMA: Dolor, salud gastrointestinal y señales corporales

EN TOPIC: Pain, gastrointestinal health and body signals

ES NECESITO: Que me preguntes si tengo dolor. Puedo hablar menos o enfadarme más.

EN I NEED: You to ask about pain. I may talk less or get upset.

ES RUTA: /es/biblioteca/dolor-salud-gastrointestinal-y-senales-corporales/

EN PATH: /en/everyday-life/pain-gastrointestinal-health-and-body-signals/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-019

ES TEMA: El respiro familiar: qué es y cómo se pide

EN TOPIC: Respite care: what it is and how to ask for it

ES NECESITO: Unas horas de descanso. Dime qué ayuda hay en mi zona.

EN I NEED: A few hours to rest. Tell me what support is available in my area.

ES RUTA: /es/biblioteca/el-respiro-familiar-que-es-y-como-se-pide/

EN PATH: /en/everyday-life/respite-care-what-it-is-and-how-to-ask-for-it/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-020

ES TEMA: El sueño: qué observar y por dónde empezar

EN TOPIC: Sleep: what to observe and where to start

ES NECESITO: Apuntar cómo duermo durante dos semanas. Probar un cambio en mi rutina.

EN I NEED: To record my sleep for two weeks. To try one routine change.

ES RUTA: /es/biblioteca/el-sueno-que-observar-y-por-donde-empezar/

EN PATH: /en/everyday-life/sleep-what-to-observe-and-where-to-start/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-021

ES TEMA: Encontrar una asociación por condición y comunidad

EN TOPIC: Finding an association by condition and community

ES NECESITO: Ayuda para encontrar una asociación cerca de mi casa.

EN I NEED: Help to find an organisation near my home.

ES RUTA: /es/biblioteca/encontrar-una-asociacion-por-condicion-y-comunidad/

EN PATH: /en/everyday-life/finding-an-association-by-condition-and-community/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-022

ES TEMA: Epilepsia y otras crisis recurrentes: qué preparar

EN TOPIC: Epilepsy and other recurrent seizures: what to prepare

ES NECESITO: Que sepas cómo empiezan mis crisis y qué hacer si ocurre una.

EN I NEED: You to know how my seizures start and what to do if one happens.

ES RUTA: /es/biblioteca/epilepsia-y-otras-crisis-recurrentes-que-preparar/

EN PATH: /en/everyday-life/epilepsy-and-other-recurrent-seizures-what-to-prepare/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-023

ES TEMA: Estudiar en la universidad con apoyos

EN TOPIC: Studying at university with support

ES NECESITO: Hablar con el servicio de apoyo de mi universidad antes de empezar el curso.

EN I NEED: To speak to my university support service before the course starts.

ES RUTA: /es/biblioteca/estudiar-en-la-universidad-con-apoyos/

EN PATH: /en/everyday-life/studying-at-university-with-support/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-024

ES TEMA: Familia: cambios, hermanos, maternidad/paternidad y conciliación

EN TOPIC: Family: changes, siblings, motherhood/fatherhood and work-life balance

ES NECESITO: Saber qué va a cambiar y cuándo. Que me avises con tiempo.

EN I NEED: To know what will change and when. You to tell me in advance.

ES RUTA: /es/biblioteca/familia-cambios-hermanos-maternidad-paternidad-y-conciliacion/

EN PATH: /en/everyday-life/family-changes-siblings-motherhood-fatherhood-and-work-life-balance/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-025

ES TEMA: Herramientas gratuitas de comunicación y pictogramas

EN TOPIC: Free communication tools and pictograms

ES NECESITO: Usar dibujos o el móvil para decir lo que quiero. Tiempo para usarlos.

EN I NEED: To use pictures or my mobile to communicate. Give me time to use them.

ES RUTA: /es/biblioteca/herramientas-gratuitas-de-comunicacion-y-pictogramas/

EN PATH: /en/everyday-life/free-communication-tools-and-pictograms/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-026

ES TEMA: Higiene y autocuidado

EN TOPIC: Hygiene and self-care

ES NECESITO: Ducharme paso a paso. Tiempo para completar cada paso.

EN I NEED: To shower step by step. Time to complete each step.

ES RUTA: /es/biblioteca/higiene-y-autocuidado/

EN PATH: /en/everyday-life/hygiene-and-self-care/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-027

ES TEMA: Hospitalización, pruebas y procedimientos médicos

EN TOPIC: Hospital stays, tests and medical procedures

ES NECESITO: Saber dónde voy, cuánto dura y qué me harán. Recibir esa información por escrito.

EN I NEED: To know where, how long and what will happen. To get that information in writing.

ES RUTA: /es/biblioteca/hospitalizacion-pruebas-y-procedimientos-medicos/

EN PATH: /en/everyday-life/hospital-stays-tests-and-medical-procedures/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-028

ES TEMA: Interocepción, propiocepción y sistema vestibular en la vida diaria

EN TOPIC: Interoception, proprioception and the vestibular system in everyday life

ES NECESITO: Recordatorios para beber, comer e ir al baño. Me cuesta notar hambre y sed.

EN I NEED: Reminders to drink, eat and use the toilet. I may notice hunger and thirst late.

ES RUTA: /es/biblioteca/interocepcion-propiocepcion-y-sistema-vestibular-en-la-vida-diaria/

EN PATH: /en/everyday-life/interoception-proprioception-and-the-vestibular-system-in-everyday-life/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-029

ES TEMA: Ir al médico, al dentista o a urgencias

EN TOPIC: Going to the doctor, the dentist or the emergency room

ES NECESITO: Que me avises antes de tocarme. Saber qué vas a hacer.

EN I NEED: You to tell me before touching me. To know what you are going to do.

ES RUTA: /es/biblioteca/ir-al-medico-al-dentista-o-a-urgencias/

EN PATH: /en/everyday-life/going-to-the-doctor-the-dentist-or-the-emergency-room/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-030

ES TEMA: La beca del Ministerio para apoyo educativo (NEAE)

EN TOPIC: The Ministry grant for educational support (NEAE)

ES NECESITO: Ayuda con la solicitud de la beca. Presentarla dentro del plazo.

EN I NEED: Help with the grant application. To submit it before the deadline.

ES RUTA: /es/biblioteca/la-beca-del-ministerio-para-apoyo-educativo-neae/

EN PATH: /en/everyday-life/the-ministry-grant-for-educational-support-neae/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-031

ES TEMA: La comida, explicada desde los sentidos

EN TOPIC: Food, explained through the senses

ES NECESITO: Mi comida habitual. Probar un alimento nuevo cada vez.

EN I NEED: My usual foods. To try one new food at a time.

ES RUTA: /es/biblioteca/la-comida-explicada-desde-los-sentidos/

EN PATH: /en/everyday-life/food-explained-through-the-senses/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-032

ES TEMA: LGTBI+ y neurodiversidad: nombre, pronombres, identidad y atención respetuosa

EN TOPIC: LGBTI+ and neurodiversity: name, pronouns, identity and respectful care

ES NECESITO: Que uses mi nombre y mis pronombres. Pregúntame antes de contárselo a otra persona.

EN I NEED: You to use my name and pronouns. Ask me before telling anyone else.

ES RUTA: /es/biblioteca/lgtbi-y-neurodiversidad-nombre-pronombres-identidad-y-atencion-respetuosa/

EN PATH: /en/everyday-life/lgbti-and-neurodiversity-name-pronouns-identity-and-respectful-care/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-033

ES TEMA: Los apoyos legales al cumplir 18 años

EN TOPIC: Legal support when turning 18

ES NECESITO: Saber qué apoyos tengo al cumplir 18 años y quién toma cada decisión.

EN I NEED: To know what support I have at 18 and who makes each decision.

ES RUTA: /es/biblioteca/los-apoyos-legales-al-cumplir-18-anos/

EN PATH: /en/everyday-life/legal-support-when-turning-18/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-034

ES TEMA: Menstruación, menopausia y salud sexual

EN TOPIC: Menstruation, menopause and sexual health

ES NECESITO: Compresas o tampones en varios sitios. Probar otros productos que me resulten cómodos.

EN I NEED: Pads or tampons in several places. To try other products that feel comfortable.

ES RUTA: /es/biblioteca/menstruacion-menopausia-y-salud-sexual/

EN PATH: /en/everyday-life/menstruation-menopause-and-sexual-health/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-035

ES TEMA: Ocio, arte, música, animales y naturaleza

EN TOPIC: Leisure, art, music, animals and nature

ES NECESITO: Tiempo para hacer las actividades que disfruto.

EN I NEED: Time for activities I enjoy.

ES RUTA: /es/biblioteca/ocio-arte-musica-animales-y-naturaleza/

EN PATH: /en/everyday-life/leisure-art-music-animals-and-nature/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-036

ES TEMA: Organización, planificación, funciones ejecutivas y tareas diarias

EN TOPIC: Organisation, planning, executive functions and daily tasks

ES NECESITO: Que dividas la tarea en pasos pequeños. Empezar por el primero.

EN I NEED: You to break the task into small steps. To start with the first one.

ES RUTA: /es/biblioteca/organizacion-planificacion-funciones-ejecutivas-y-tareas-diarias/

EN PATH: /en/everyday-life/organisation-planning-executive-functions-and-daily-tasks/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-037

ES TEMA: Pareja, conflictos, límites y consentimiento

EN TOPIC: Relationships, conflict, boundaries and consent

ES NECESITO: Hablar de mis límites y de mi tiempo a solas. Acordar cómo respetarlos.

EN I NEED: To talk about my boundaries and time alone. To agree how to respect them.

ES RUTA: /es/biblioteca/pareja-conflictos-limites-y-consentimiento/

EN PATH: /en/everyday-life/relationships-conflict-boundaries-and-consent/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-038

ES TEMA: Perros de asistencia: qué reconoce la ley

EN TOPIC: Assistance dogs: what the law recognises

ES NECESITO: Poder entrar con mi perro de asistencia. Que respeten mi derecho de acceso.

EN I NEED: To enter with my assistance dog. To have my right of access respected.

ES RUTA: /es/biblioteca/perros-de-asistencia-que-reconoce-la-ley/

EN PATH: /en/everyday-life/assistance-dogs-what-the-law-recognises/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-039

ES TEMA: Regulación emocional, rumiación, rechazo, culpa y perfeccionismo

EN TOPIC: Emotional regulation, rumination, rejection, guilt and perfectionism

ES NECESITO: Que me pidas menos cosas ahora. Más tarde hablamos de lo que ha pasado.

EN I NEED: You to ask less of me now. We can talk about what happened later.

ES RUTA: /es/biblioteca/regulacion-emocional-rumiacion-rechazo-culpa-y-perfeccionismo/

EN PATH: /en/everyday-life/emotional-regulation-rumination-rejection-guilt-and-perfectionism/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-040

ES TEMA: Restaurantes y comer fuera

EN TOPIC: Restaurants and eating out

ES NECESITO: Ver el menú antes. Poder preguntar qué lleva cada plato.

EN I NEED: To see the menu in advance. To ask what is in each dish.

ES RUTA: /es/biblioteca/restaurantes-y-comer-fuera/

EN PATH: /en/everyday-life/restaurants-and-eating-out/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-041

ES TEMA: Sacarse el carné siendo neurodivergente

EN TOPIC: Getting a driving licence as a neurodivergent person

ES NECESITO: Instrucciones claras en el examen. Más tiempo para responder.

EN I NEED: Clear instructions in the driving test. More time to answer.

ES RUTA: /es/biblioteca/sacarse-el-carne-siendo-neurodivergente/

EN PATH: /en/everyday-life/getting-a-driving-licence-as-a-neurodivergent-person/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-042

ES TEMA: Seguridad online, privacidad, outing y ciberacoso

EN TOPIC: Online safety, privacy, outing and cyberbullying

ES NECESITO: Ayuda para revisar quién puede ver mis publicaciones y datos en internet.

EN I NEED: Help to check who can see my posts and personal information online.

ES RUTA: /es/biblioteca/seguridad-online-privacidad-outing-y-ciberacoso/

EN PATH: /en/everyday-life/online-safety-privacy-outing-and-cyberbullying/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-043

ES TEMA: Sexualidad y educación sexual accesible

EN TOPIC: Sexuality and accessible sex education

ES NECESITO: Que me hables de sexo con palabras claras. Explícame cada palabra nueva.

EN I NEED: You to talk about sex using clear words. Explain every new word to me.

ES RUTA: /es/biblioteca/sexualidad-y-educacion-sexual-accesible/

EN PATH: /en/everyday-life/sexuality-and-accessible-sex-education/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-044

ES TEMA: Si una persona vulnerable desaparece: qué preparar y qué hacer

EN TOPIC: If a vulnerable person goes missing: what to prepare and what to do

ES NECESITO: Tener una foto reciente y los datos básicos de la persona por si desaparece.

EN I NEED: A recent photo and the person's basic details, ready in case they go missing.

ES RUTA: /es/biblioteca/si-una-persona-vulnerable-desaparece-que-preparar-y-que-hacer/

EN PATH: /en/everyday-life/if-a-vulnerable-person-goes-missing-what-to-prepare-and-what-to-do/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-045

ES TEMA: Sobrecarga sensorial, hiperacusia, misofonía y procesamiento auditivo

EN TOPIC: Sensory overload, hyperacusis, misophonia and auditory processing

ES NECESITO: Llevar cascos. Poder salir si el ruido es demasiado fuerte.

EN I NEED: To wear headphones. To leave if the noise becomes too loud.

ES RUTA: /es/biblioteca/sobrecarga-sensorial-hiperacusia-misofonia-y-procesamiento-auditivo/

EN PATH: /en/everyday-life/sensory-overload-hyperacusis-misophonia-and-auditory-processing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-046

ES TEMA: Transporte público y desplazamientos

EN TOPIC: Public transport and getting around

ES NECESITO: Preparar la ruta antes de salir. Saber qué hacer si cambia la ruta.

EN I NEED: To plan the route before leaving. To know what to do if it changes.

ES RUTA: /es/biblioteca/transporte-publico-y-desplazamientos/

EN PATH: /en/everyday-life/public-transport-and-getting-around/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-047

ES TEMA: Viajar en avión con una discapacidad no visible

EN TOPIC: Flying with a non-visible disability

ES NECESITO: Llevar mi cordón del girasol. Que el personal sepa que puedo necesitar apoyo.

EN I NEED: My sunflower lanyard. Staff to know that I may need support.

ES RUTA: /es/biblioteca/viajar-en-avion-con-una-discapacidad-no-visible/

EN PATH: /en/everyday-life/flying-with-a-non-visible-disability/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-IRIS-DAILY-NEED-048

ES TEMA: Vivienda, convivencia, autonomía y apoyos en casa

EN TOPIC: Housing, living together, autonomy and support at home

ES NECESITO: Un sitio en casa con poco ruido y poca luz.

EN I NEED: A place at home with low noise and low light.

ES RUTA: /es/biblioteca/vivienda-convivencia-autonomia-y-apoyos-en-casa/

EN PATH: /en/everyday-life/housing-living-together-autonomy-and-support-at-home/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## CIERRE · TARJETA IRIS «NECESITO / I NEED» · FUENTES CANÓNICAS

ES: Vida diaria completa: 48/48.

EN: Daily-life entries complete: 48/48.

ES: Condiciones presentes en la fuente: 180/180.

EN: Condition entries present in the source: 180/180.

ES: Situaciones completas: 187/187.

EN: Situation entries complete: 187/187.

ES TOTAL CANÓNICO: 415/415.

EN CANONICAL TOTAL: 415/415.

NOTA: La colección de condiciones sigue documentando cinco temas del catálogo sin microcopy «Necesito» en esa fuente; no se inventan.

ESTADO: COLLECTION_COMPLETE

---

## QA · TARJETA IRIS «NECESITO / I NEED» · TOTAL

- DAILY_LIFE_SOURCE: 48/48
- CONDITIONS_SOURCE: 180/180
- SITUATIONS_SOURCE: 187/187
- CANONICAL_SOURCE_TOTAL: 415/415
- DAILY_LIFE_ES_EN_MAPPING: 48/48
- DAILY_LIFE_UNIQUE_ES_ROUTES: 48/48
- DAILY_LIFE_UNIQUE_EN_ROUTES: 48/48
- STATUS: PASS

SIGUIENTE FASE: corpus complementario de herramientas, recursos, microcopy restante y fragmentos ES/EN.

# 67. CORPUS WEB · DATOS / DATA · FUENTE ESTRUCTURADA

FUENTE ES: `es/datos/datos.json` · rama `main`.

FUENTE EN: `en/data/data.json` · rama `main`.

ES REGLA: Se preserva el contenido factual de la fuente y su contexto temporal/metodológico. Los registros con `status=borrador` quedan capturados para la Biblioteca Maestra, pero no se promueven a producción.

EN RULE: Source facts and their temporal/methodological context are preserved. Records with `status=borrador` are captured for the Master Library but are not promoted to production.

ESTADO DE CAPTURA: EN_PROGRESO

## WEB-DATA-001

ES TÍTULO: Autismo

EN TITLE: Autism

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: En 2021 se estimó que 61,8 millones de personas —aproximadamente 1 de cada 127— eran autistas en el mundo. Es una estimación modelizada del Global Burden of Disease 2021, no un recuento de diagnósticos. La OMS utiliza actualmente esta cifra y advierte de que la prevalencia observada varía mucho entre estudios y sigue siendo desconocida en numerosos países de ingresos bajos y medios.

EN SUMMARY: In 2021, an estimated 61.8 million people —approximately 1 in every 127— were autistic worldwide. This is a modelled estimate from Global Burden of Disease 2021, not a count of diagnoses. WHO currently uses this figure and notes that observed prevalence varies widely between studies and remains unknown in many low- and middle-income countries.

ES REFERENCIA TEMPORAL: 2021 · 2025; OMS actualiza la ficha en 2025.

EN TIME REFERENCE: 2021 · 2025; WHO updates the fact sheet in 2025.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: personas autistas estimadas en 2021

EN POPULATION / SCOPE: autistic people estimated in 2021

ES FUENTES: OMS · Autism · actualización 17-09-2025 · https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders | OMS · Autismo, versión en español · https://www.who.int/es/news-room/fact-sheets/detail/autism-spectrum-disorders | PubMed · GBD 2021 autism · https://pubmed.ncbi.nlm.nih.gov/39709974/

EN SOURCES: WHO · Autism · update 17-09-2025 · https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders | WHO · Autism, Spanish version · https://www.who.int/es/news-room/fact-sheets/detail/autism-spectrum-disorders | PubMed · GBD 2021 autism · https://pubmed.ncbi.nlm.nih.gov/39709974/

ES RUTA: /es/datos/autismo/

EN PATH: /en/data/autism/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-002

ES TÍTULO: Autismo: diferencias por sexo en la estimación mundial

EN TITLE: Autism: sex differences in the global estimate

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: El modelo mundial GBD 2021 estimó 1.064,7 personas autistas por cada 100.000 varones y 508,1 por cada 100.000 mujeres. Son estimaciones epidemiológicas modelizadas y no equivalen a la proporción de diagnósticos registrada por los servicios sanitarios o educativos.

EN SUMMARY: The GBD 2021 global model estimated 1,064.7 autistic people per 100,000 males and 508.1 per 100,000 females. These are modelled epidemiological estimates and are not equivalent to the proportion of diagnoses recorded by health or education services.

ES REFERENCIA TEMPORAL: 2021 · GBD 2021 / publicación científica 2025.

EN TIME REFERENCE: 2021 · GBD 2021 / scientific publication 2025.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: prevalencia estandarizada por edad en varones

EN POPULATION / SCOPE: age-standardised prevalence in males

ES FUENTES: OMS · Autism · https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders | PubMed · GBD 2021 autism · https://pubmed.ncbi.nlm.nih.gov/39709974/ | Loomes, Hull & Mandy · systematic review/meta-analysis · https://pubmed.ncbi.nlm.nih.gov/28545751/

EN SOURCES: WHO · Autism · https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders | PubMed · GBD 2021 autism · https://pubmed.ncbi.nlm.nih.gov/39709974/ | Loomes, Hull & Mandy · systematic review/meta-analysis · https://pubmed.ncbi.nlm.nih.gov/28545751/

ES RUTA: /es/datos/autismo-diferencias-por-sexo-en-la-estimacion-mundial/

EN PATH: /en/data/autism-sex-differences-in-the-global-estimate/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-003

ES TÍTULO: Autismo: carga de salud poblacional

EN TITLE: Autism: population health burden

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: En 2021, el modelo Global Burden of Disease estimó 11,5 millones de DALYs asociados al autismo. Esta medida sirve para estudiar carga de salud a escala poblacional; no describe la experiencia, la calidad de vida ni las necesidades individuales de una persona autista.

EN SUMMARY: In 2021, the Global Burden of Disease model estimated 11.5 million DALYs associated with autism. This measure is used to study population-level health burden; it does not describe the experience, quality of life or individual needs of an autistic person.

ES REFERENCIA TEMPORAL: 2021 · GBD 2021 / publicación científica 2025.

EN TIME REFERENCE: 2021 · GBD 2021 / scientific publication 2025.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: Población del modelo GBD para 2021, no un recuento de personas

EN POPULATION / SCOPE: GBD model population for 2021, not a count of people

ES FUENTES: PubMed · GBD 2021 autism · https://pubmed.ncbi.nlm.nih.gov/39709974/

EN SOURCES: PubMed · GBD 2021 autism · https://pubmed.ncbi.nlm.nih.gov/39709974/

ES RUTA: /es/datos/autismo-carga-de-salud-poblacional/

EN PATH: /en/data/autism-population-health-burden/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-004

ES TÍTULO: Discapacidad del desarrollo en niños y jóvenes

EN TITLE: Developmental disability in children and young people

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: En 2019, aproximadamente 317 millones de niños y jóvenes en el mundo vivían con condiciones de salud que contribuyen a una discapacidad del desarrollo. El informe conjunto de OMS y UNICEF señala además barreras sanitarias, estigma, prejuicio y exclusión social.

EN SUMMARY: In 2019, approximately 317 million children and young people worldwide were living with health conditions that contribute to developmental disability. The joint WHO and UNICEF report also points to barriers in healthcare, stigma, prejudice and social exclusion.

ES REFERENCIA TEMPORAL: 2019 · OMS/UNICEF, 2023.

EN TIME REFERENCE: 2019 · WHO/UNICEF, 2023.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: niños, adolescentes y jóvenes afectados en 2019

EN POPULATION / SCOPE: children, adolescents and young people affected in 2019

ES FUENTES: OMS · 15-09-2023 · https://www.who.int/news/item/15-09-2023-new-reports-highlights-neglected-health-needs-of-children-with-developmental-disabilities

EN SOURCES: WHO · 15-09-2023 · https://www.who.int/news/item/15-09-2023-new-reports-highlights-neglected-health-needs-of-children-with-developmental-disabilities

ES RUTA: /es/datos/discapacidad-del-desarrollo-en-ninos-y-jovenes/

EN PATH: /en/data/developmental-disability-in-children-and-young-people/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-005

ES TÍTULO: Por qué faltan datos comparables sobre desarrollo

EN TITLE: Why comparable developmental data are missing

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: No todas las cifras llamadas «mundiales» representan de la misma forma a todas las regiones. Una revisión internacional de 2023 concluyó que, para varias discapacidades del desarrollo, la cobertura geográfica era insuficiente y los métodos demasiado heterogéneos para considerar las estimaciones plenamente representativas del planeta.

EN SUMMARY: Not all figures described as ‘global’ represent every region in the same way. A 2023 international review concluded that, for several developmental disabilities, geographical coverage was insufficient and methods were too heterogeneous for the estimates to be considered fully representative of the planet.

ES REFERENCIA TEMPORAL: revisiones incluidas hasta la publicación · revisión paraguas, 2023.

EN TIME REFERENCE: reviews included up to publication · umbrella review, 2023.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: Estudios de países de ingresos altos, con métodos distintos entre sí

EN POPULATION / SCOPE: Studies from high-income countries, using methods that differ from one another

ES FUENTES: PubMed · Global prevalence of developmental disabilities in children and adolescents · https://pubmed.ncbi.nlm.nih.gov/36891340/

EN SOURCES: PubMed · Global prevalence of developmental disabilities in children and adolescents · https://pubmed.ncbi.nlm.nih.gov/36891340/

ES RUTA: /es/datos/por-que-faltan-datos-comparables-sobre-desarrollo/

EN PATH: /en/data/why-comparable-developmental-data-are-missing/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-006

ES TÍTULO: TDAH en niños y adolescentes

EN TITLE: ADHD in children and adolescents

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Una revisión paraguas internacional que reunió 588 estudios y más de 3,27 millones de participantes estimó una prevalencia agrupada de TDAH del 8,0 % en niños y adolescentes. La cifra fue del 10 % en niños y del 5 % en niñas.

EN SUMMARY: An international umbrella review bringing together 588 studies and more than 3.27 million participants estimated a pooled ADHD prevalence of 8.0% in children and adolescents. The figure was 10% in boys and 5% in girls.

ES REFERENCIA TEMPORAL: estudios incluidos en la revisión publicada en 2023 · revisión paraguas, 2023.

EN TIME REFERENCE: studies included in the review published in 2023 · umbrella review, 2023.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: prevalencia agrupada en una revisión paraguas internacional

EN POPULATION / SCOPE: pooled prevalence in an international umbrella review

ES FUENTES: PubMed · PMID 37495084 · https://pubmed.ncbi.nlm.nih.gov/37495084/

EN SOURCES: PubMed · PMID 37495084 · https://pubmed.ncbi.nlm.nih.gov/37495084/

ES RUTA: /es/datos/tdah-en-ninos-y-adolescentes/

EN PATH: /en/data/adhd-in-children-and-adolescents/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-007

ES TÍTULO: TDAH en adultos

EN TITLE: ADHD in adults

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Un metaanálisis internacional estimó para 2020 una prevalencia del 2,58 % de TDAH adulto persistente desde la infancia, equivalente a unos 139,84 millones de adultos. Cuando se utilizó una definición de TDAH adulto sintomático sin exigir demostrar inicio infantil, la estimación fue del 6,76 %, unos 366,33 millones. Son definiciones diferentes y no deben presentarse como una sola cifra.

EN SUMMARY: An international meta-analysis estimated a 2020 prevalence of 2.58% for adult ADHD persisting from childhood, equivalent to about 139.84 million adults. When a definition of symptomatic adult ADHD was used without requiring proof of childhood onset, the estimate was 6.76%, about 366.33 million. These are different definitions and should not be presented as a single figure.

ES REFERENCIA TEMPORAL: estructura demográfica mundial de 2020 · metaanálisis, 2021.

EN TIME REFERENCE: global demographic structure in 2020 · meta-analysis, 2021.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: TDAH adulto persistente desde la infancia

EN POPULATION / SCOPE: adult ADHD persisting from childhood

ES FUENTES: PubMed · PMID 33692893 · https://pubmed.ncbi.nlm.nih.gov/33692893/

EN SOURCES: PubMed · PMID 33692893 · https://pubmed.ncbi.nlm.nih.gov/33692893/

ES RUTA: /es/datos/tdah-en-adultos/

EN PATH: /en/data/adhd-in-adults/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-008

ES TÍTULO: Dislexia del desarrollo

EN TITLE: Developmental dyslexia

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Un metaanálisis internacional estimó que la dislexia del desarrollo afecta aproximadamente al 7,1 % del alumnado de Primaria. En el conjunto analizado no se encontraron diferencias significativas entre sistemas de escritura alfabéticos y logográficos.

EN SUMMARY: An international meta-analysis estimated that developmental dyslexia affects approximately 7.1% of primary-school pupils. In the analysed body of evidence, no significant differences were found between alphabetic and logographic writing systems.

ES REFERENCIA TEMPORAL: estudios incluidos hasta 2021 · metaanálisis, 2022.

EN TIME REFERENCE: studies included up to 2021 · meta-analysis, 2022.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: prevalencia agrupada en alumnado de Primaria

EN POPULATION / SCOPE: pooled prevalence in primary-school pupils

ES FUENTES: PubMed · PMID 35204003 · https://pubmed.ncbi.nlm.nih.gov/35204003/

EN SOURCES: PubMed · PMID 35204003 · https://pubmed.ncbi.nlm.nih.gov/35204003/

ES RUTA: /es/datos/dislexia-del-desarrollo/

EN PATH: /en/data/developmental-dyslexia/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-009

ES TÍTULO: Trastorno del desarrollo de la coordinación

EN TITLE: Developmental coordination disorder

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Una revisión sistemática y metaanálisis publicada en 2024 estimó una prevalencia agrupada del 5 % de trastorno del desarrollo de la coordinación en población infantil general. La variación entre estudios fue elevada, por lo que la cifra debe leerse como síntesis científica y no como una tasa idéntica para todos los países.

EN SUMMARY: A systematic review and meta-analysis published in 2024 estimated a pooled prevalence of 5% for developmental coordination disorder in the general child population. Variation between studies was high, so the figure should be read as a scientific synthesis and not as an identical rate for all countries.

ES REFERENCIA TEMPORAL: estudios incluidos hasta 2023 · metaanálisis, 2024.

EN TIME REFERENCE: studies included up to 2023 · meta-analysis, 2024.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: prevalencia agrupada en niños

EN POPULATION / SCOPE: pooled prevalence in children

ES FUENTES: PubMed · PMID 39391054 · https://pubmed.ncbi.nlm.nih.gov/39391054/

EN SOURCES: PubMed · PMID 39391054 · https://pubmed.ncbi.nlm.nih.gov/39391054/

ES RUTA: /es/datos/trastorno-del-desarrollo-de-la-coordinacion/

EN PATH: /en/data/developmental-coordination-disorder/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-010

ES TÍTULO: Síndrome de Tourette: prevalencia estimada e identificación

EN TITLE: Tourette syndrome: estimated prevalence and identification

ES TERRITORIO: Mundo / EE. UU.

EN TERRITORY: World / U.S.

ES RESUMEN: El síndrome de Tourette muestra bien la diferencia entre prevalencia estimada e identificación registrada. El CDC resume estudios que sitúan la prevalencia en torno al 0,6 % infantil, mientras que el diagnóstico declarado por progenitores en Estados Unidos fue menor.

EN SUMMARY: Tourette syndrome clearly shows the difference between estimated prevalence and recorded identification. CDC summarises studies placing childhood prevalence at around 0.6%, while parent-reported diagnosis in the United States was lower.

ES REFERENCIA TEMPORAL: síntesis de estudios; diagnóstico declarado en EE. UU. 2016–2019 · CDC, actualización 27-03-2026.

EN TIME REFERENCE: synthesis of studies; parent-reported diagnosis in the U.S. 2016–2019 · CDC, update 27-03-2026.

ES MÉTODO: Estadística o vigilancia oficial de Estados Unidos

EN METHOD: Official United States statistics or surveillance

ES POBLACIÓN / ALCANCE: Las dos cifras no comparten denominador: la de diagnóstico declarado es de 3 a 17 años; la de estudios no acota edad

EN POPULATION / SCOPE: The two figures do not share a denominator: the parent-reported diagnosis figure is for ages 3 to 17; the studies figure does not restrict age

ES FUENTES: CDC · Data and Statistics on Tourette Syndrome · actualización 27-03-2026 · https://www.cdc.gov/tourette-syndrome/data/

EN SOURCES: CDC · Data and Statistics on Tourette Syndrome · update 27-03-2026 · https://www.cdc.gov/tourette-syndrome/data/

ES RUTA: /es/datos/sindrome-de-tourette-prevalencia-estimada-e-identificacion/

EN PATH: /en/data/tourette-syndrome-estimated-prevalence-and-identification/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-011

ES TÍTULO: Trastorno del desarrollo del lenguaje: un estudio poblacional de referencia

EN TITLE: Developmental language disorder: a reference population study

ES TERRITORIO: Reino Unido

EN TERRITORY: United Kingdom

ES RESUMEN: Para el trastorno del desarrollo del lenguaje no se ha seleccionado una prevalencia mundial única. Esta página utiliza un estudio poblacional británico de referencia para mostrar una cifra sólida con población y método definidos, sin convertirla en una estimación global.

EN SUMMARY: For developmental language disorder, no single global prevalence has been selected. This page uses a reference British population study to show a robust figure with defined population and method, without turning it into a global estimate.

ES REFERENCIA TEMPORAL: muestra de niños al entrar en la escuela · estudio poblacional británico, 2016.

EN TIME REFERENCE: sample of children entering school · British population study, 2016.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: Niños al entrar en la escuela, muestra poblacional británica, 2016

EN POPULATION / SCOPE: Children entering school, British population sample, 2016

ES FUENTES: Norbury et al., 2016 · https://doi.org/10.1111/jcpp.12573

EN SOURCES: Norbury et al., 2016 · https://doi.org/10.1111/jcpp.12573

ES RUTA: /es/datos/trastorno-del-desarrollo-del-lenguaje-un-estudio-poblacional-de-referencia/

EN PATH: /en/data/developmental-language-disorder-a-reference-population-study/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-012

ES TÍTULO: Discalculia y disgrafía: por qué no damos una cifra mundial única

EN TITLE: Dyscalculia and dysgraphia: why we do not give a single global figure

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: La literatura usa definiciones, pruebas, edades y umbrales diferentes. Existen rangos ampliamente repetidos, pero la búsqueda realizada para esta ampliación no encontró una estimación internacional reciente con una solidez comparable a las seleccionadas para TDAH, dislexia o trastorno del desarrollo de la coordinación.

EN SUMMARY: The literature uses different definitions, tests, ages and thresholds. Widely repeated ranges exist, but the search carried out for this expansion did not find a recent international estimate with robustness comparable to the sources selected for ADHD, dyslexia or developmental coordination disorder.

ES REFERENCIA TEMPORAL: sin año único: no existe una cifra mundial seleccionada · revisión editorial de fuentes, 2026.

EN TIME REFERENCE: no single year: no selected global figure exists · editorial review of sources, 2026.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: Sin cifra única

EN POPULATION / SCOPE: No single figure

ES FUENTES: —

EN SOURCES: —

ES RUTA: /es/datos/discalculia-y-disgrafia-por-que-no-damos-una-cifra-mundial-unica/

EN PATH: /en/data/dyscalculia-and-dysgraphia-why-we-do-not-give-a-single-global-figure/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-013

ES TÍTULO: Trastornos de ansiedad

EN TITLE: Anxiety disorders

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Los trastornos de ansiedad son los trastornos mentales más comunes del mundo. La OMS estima que en 2021 afectaban a 359 millones de personas, incluidas 72 millones de personas menores de edad, y que alrededor del 27,6 % de quienes necesitan tratamiento lo reciben.

EN SUMMARY: Anxiety disorders are the most common mental disorders worldwide. WHO estimates that in 2021 they affected 359 million people, including 72 million minors, and that around 27.6% of those who need treatment receive it.

ES REFERENCIA TEMPORAL: 2021 · OMS, actualización 08-09-2025.

EN TIME REFERENCE: 2021 · WHO, update 08-09-2025.

ES MÉTODO: Organismo internacional

EN METHOD: International organisation

ES POBLACIÓN / ALCANCE: personas con un trastorno de ansiedad en 2021

EN POPULATION / SCOPE: people with an anxiety disorder in 2021

ES FUENTES: OMS · Trastornos de ansiedad · 08-09-2025 · https://www.who.int/es/news-room/fact-sheets/detail/anxiety-disorders

EN SOURCES: WHO · Anxiety disorders · 08-09-2025 · https://www.who.int/es/news-room/fact-sheets/detail/anxiety-disorders

ES RUTA: /es/datos/trastornos-de-ansiedad/

EN PATH: /en/data/anxiety-disorders/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-014

ES TÍTULO: TOC

EN TITLE: OCD

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: No existe una única cifra de prevalencia mundial del TOC independiente del criterio diagnóstico. Un estudio internacional publicado en 2026 estimó una prevalencia a lo largo de la vida de entre 2,28 % y 3,21 %, según el sistema diagnóstico utilizado.

EN SUMMARY: There is no single global prevalence figure for OCD independent of diagnostic criteria. An international study published in 2026 estimated lifetime prevalence between 2.28% and 3.21%, depending on the diagnostic system used.

ES REFERENCIA TEMPORAL: estudios hasta 2025 · estudio de modelización, 08-07-2026.

EN TIME REFERENCE: studies up to 2025 · modelling study, 08-07-2026.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: Prevalencia a lo largo de la vida, por sistema diagnóstico

EN POPULATION / SCOPE: Lifetime prevalence, by diagnostic system

ES FUENTES: PubMed · PMID 42415255 · 08-07-2026 · https://pubmed.ncbi.nlm.nih.gov/42415255/ | DOI · https://doi.org/10.1176/appi.ajp.20250944

EN SOURCES: PubMed · PMID 42415255 · 08-07-2026 · https://pubmed.ncbi.nlm.nih.gov/42415255/ | DOI · https://doi.org/10.1176/appi.ajp.20250944

ES RUTA: /es/datos/toc/

EN PATH: /en/data/ocd/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-015

ES TÍTULO: Autismo y salud mental: coexistencia, no equivalencia

EN TITLE: Autism and mental health: coexistence, not equivalence

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Un metaanálisis de 2019 que reunió 96 estudios en sus análisis calculó las siguientes prevalencias agrupadas entre personas autistas:

EN SUMMARY: A 2019 meta-analysis that included 96 studies in its analyses calculated the following pooled prevalences among autistic people:

ES REFERENCIA TEMPORAL: estudios incluidos en metaanálisis publicado en 2019 · Lai et al., 2019.

EN TIME REFERENCE: studies included in a meta-analysis published in 2019 · Lai et al., 2019.

ES MÉTODO: Síntesis científica internacional

EN METHOD: International scientific synthesis

ES POBLACIÓN / ALCANCE: Muestras de personas autistas

EN POPULATION / SCOPE: Samples of autistic people

ES FUENTES: Lai et al., *The Lancet Psychiatry*, 2019 · https://pubmed.ncbi.nlm.nih.gov/31447415/

EN SOURCES: Lai et al., *The Lancet Psychiatry*, 2019 · https://pubmed.ncbi.nlm.nih.gov/31447415/

ES RUTA: /es/datos/autismo-y-salud-mental-coexistencia-no-equivalencia/

EN PATH: /en/data/autism-and-mental-health-coexistence-not-equivalence/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-016

ES TÍTULO: Discapacidad significativa

EN TITLE: Significant disability

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Más de 1.300 millones de personas —alrededor del 16 % de la población mundial, 1 de cada 6— viven con una discapacidad significativa.

EN SUMMARY: More than 1.3 billion people —around 16% of the world population, 1 in 6— live with a significant disability.

ES REFERENCIA TEMPORAL: estimación mundial vigente · OMS Europa, actualización 10-08-2026.

EN TIME REFERENCE: current global estimate · WHO Europe, update 10-08-2026.

ES MÉTODO: Organismo internacional

EN METHOD: International organisation

ES POBLACIÓN / ALCANCE: personas

EN POPULATION / SCOPE: people

ES FUENTES: OMS · Disability · 10-08-2026 · https://www.who.int/europe/news-room/fact-sheets/item/disability | OMS · Disability and health · https://www.who.int/news-room/fact-sheets/detail/disability-and-health

EN SOURCES: WHO · Disability · 10-08-2026 · https://www.who.int/europe/news-room/fact-sheets/item/disability | WHO · Disability and health · https://www.who.int/news-room/fact-sheets/detail/disability-and-health

ES RUTA: /es/datos/discapacidad-significativa/

EN PATH: /en/data/significant-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-017

ES TÍTULO: Desigualdad en salud asociada a discapacidad

EN TITLE: Health inequality associated with disability

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Las diferencias de salud asociadas a la discapacidad no se explican únicamente por las condiciones de base. La OMS identifica barreras sanitarias, transporte inaccesible, pobreza, estigma y exclusión de la educación y el empleo como factores que producen desigualdad evitable.

EN SUMMARY: Health differences associated with disability are not explained only by underlying conditions. WHO identifies health-service barriers, inaccessible transport, poverty, stigma and exclusion from education and employment as factors that produce avoidable inequality.

ES REFERENCIA TEMPORAL: evidencia internacional reunida por OMS · OMS / informe mundial de equidad; actualización 2026.

EN TIME REFERENCE: international evidence gathered by WHO · WHO / global equity report; 2026 update.

ES MÉTODO: Organismo internacional

EN METHOD: International organisation

ES POBLACIÓN / ALCANCE: Comparación entre personas con y sin discapacidad; evidencia internacional reunida por la OMS, sin denominador poblacional único

EN POPULATION / SCOPE: Comparison between people with and without disability; international evidence gathered by WHO, without a single population denominator

ES FUENTES: OMS · Disability · 10-08-2026 · https://www.who.int/europe/news-room/fact-sheets/item/disability | OMS · Disability and health · https://www.who.int/news-room/fact-sheets/detail/disability-and-health | OMS · Global report on health equity for persons with disabilities · https://www.who.int/publications/i/item/9789240063600

EN SOURCES: WHO · Disability · 10-08-2026 · https://www.who.int/europe/news-room/fact-sheets/item/disability | WHO · Disability and health · https://www.who.int/news-room/fact-sheets/detail/disability-and-health | WHO · Global report on health equity for persons with disabilities · https://www.who.int/publications/i/item/9789240063600

ES RUTA: /es/datos/desigualdad-en-salud-asociada-a-discapacidad/

EN PATH: /en/data/health-inequality-associated-with-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-018

ES TÍTULO: Niños con discapacidad

EN TITLE: Children with disabilities

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Casi 240 millones de niños —aproximadamente 1 de cada 10— viven con alguna discapacidad en el mundo. El análisis de UNICEF utiliza un enfoque funcional amplio y no equivale a contar diagnósticos médicos.

EN SUMMARY: Almost 240 million children —approximately 1 in 10— live with a disability worldwide. UNICEF’s analysis uses a broad functional approach and is not equivalent to counting medical diagnoses.

ES REFERENCIA TEMPORAL: estimación base de UNICEF; página activa en 2026 · UNICEF.

EN TIME REFERENCE: UNICEF baseline estimate; page active in 2026 · UNICEF.

ES MÉTODO: Organismo internacional

EN METHOD: International organisation

ES POBLACIÓN / ALCANCE: Niños y adolescentes del mundo, medidos con el módulo de funcionamiento infantil de UNICEF y el Washington Group, que se aplica de 2 a 17 años

EN POPULATION / SCOPE: Children and adolescents worldwide, measured with UNICEF and Washington Group’s child functioning module, which is applied from ages 2 to 17

ES FUENTES: UNICEF Data · Children with disabilities · https://data.unicef.org/topic/child-disability/overview/ | UNICEF · informe Seen, Counted, Included · https://www.unicef.org/press-releases/nearly-240-million-children-disabilities-around-world-unicefs-most-comprehensive

EN SOURCES: UNICEF Data · Children with disabilities · https://data.unicef.org/topic/child-disability/overview/ | UNICEF · Seen, Counted, Included report · https://www.unicef.org/press-releases/nearly-240-million-children-disabilities-around-world-unicefs-most-comprehensive

ES RUTA: /es/datos/ninos-con-discapacidad/

EN PATH: /en/data/children-with-disabilities/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-019

ES TÍTULO: Educación y discapacidad infantil

EN TITLE: Education and childhood disability

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: La brecha no termina en entrar en la escuela. UNICEF encontró que los niños con discapacidad eran 42 % menos propensos a alcanzar competencias fundamentales de lectura y aritmética, además de presentar mayor probabilidad de estar fuera del sistema educativo en todas las etapas analizadas.

EN SUMMARY: The gap does not end with entering school. UNICEF found that children with disabilities were 42% less likely to achieve foundational reading and numeracy skills, as well as being more likely to be out of education at every stage analysed.

ES REFERENCIA TEMPORAL: análisis internacional de UNICEF · UNICEF, 10-11-2021.

EN TIME REFERENCE: UNICEF international analysis · UNICEF, 10-11-2021.

ES MÉTODO: Organismo internacional

EN METHOD: International organisation

ES POBLACIÓN / ALCANCE: Niños con discapacidad comparados con niños sin discapacidad; las cuatro cifras son diferencias relativas

EN POPULATION / SCOPE: Children with disabilities compared with children without disabilities; the four figures are relative differences

ES FUENTES: UNICEF · 10-11-2021 · https://www.unicef.org/press-releases/nearly-240-million-children-disabilities-around-world-unicefs-most-comprehensive

EN SOURCES: UNICEF · 10-11-2021 · https://www.unicef.org/press-releases/nearly-240-million-children-disabilities-around-world-unicefs-most-comprehensive

ES RUTA: /es/datos/educacion-y-discapacidad-infantil/

EN PATH: /en/data/education-and-childhood-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-020

ES TÍTULO: Bienestar, discriminación y violencia en la infancia con discapacidad

EN TITLE: Wellbeing, discrimination and violence in childhood disability

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Las desigualdades también aparecen fuera del aula. UNICEF encontró mayor frecuencia de discriminación, infelicidad y castigo corporal grave entre niños con discapacidad y menor acceso a estimulación temprana y cuidados receptivos.

EN SUMMARY: Inequalities also appear outside the classroom. UNICEF found higher frequencies of discrimination, unhappiness and severe corporal punishment among children with disabilities, and lower access to early stimulation and responsive care.

ES REFERENCIA TEMPORAL: análisis internacional de UNICEF · UNICEF, 10-11-2021.

EN TIME REFERENCE: UNICEF international analysis · UNICEF, 10-11-2021.

ES MÉTODO: Organismo internacional

EN METHOD: International organisation

ES POBLACIÓN / ALCANCE: Diferencias relativas entre grupos, no tasas de toda la infancia con discapacidad

EN POPULATION / SCOPE: Relative differences between groups, not rates for all children with disabilities

ES FUENTES: UNICEF · Seen, Counted, Included · https://www.unicef.org/press-releases/nearly-240-million-children-disabilities-around-world-unicefs-most-comprehensive

EN SOURCES: UNICEF · Seen, Counted, Included · https://www.unicef.org/press-releases/nearly-240-million-children-disabilities-around-world-unicefs-most-comprehensive

ES RUTA: /es/datos/bienestar-discriminacion-y-violencia-en-la-infancia-con-discapacidad/

EN PATH: /en/data/wellbeing-discrimination-and-violence-in-childhood-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-021

ES TÍTULO: Tecnología y productos de apoyo

EN TITLE: Technology and assistive products

ES TERRITORIO: Mundo

EN TERRITORY: World

ES RESUMEN: Más de 2.500 millones de personas necesitan al menos un producto de apoyo. Casi 1.000 millones carecen del acceso que necesitan, y la OMS estima que la necesidad mundial superará los 3.500 millones de personas en 2050.

EN SUMMARY: More than 2.5 billion people need at least one assistive product. Nearly 1 billion lack the access they need, and WHO estimates that global need will exceed 3.5 billion people by 2050.

ES REFERENCIA TEMPORAL: base 2021–2022; proyección 2050 · OMS/UNICEF; ficha OMS 02-01-2024.

EN TIME REFERENCE: 2021–2022 baseline; 2050 projection · WHO/UNICEF; WHO fact sheet 02-01-2024.

ES MÉTODO: Organismo internacional

EN METHOD: International organisation

ES POBLACIÓN / ALCANCE: personas necesitan uno o más productos de apoyo

EN POPULATION / SCOPE: people need one or more assistive products

ES FUENTES: OMS · Assistive technology · 02-01-2024 · https://www.who.int/news-room/fact-sheets/detail/assistive-technology | OMS/UNICEF · Global Report on Assistive Technology · https://www.who.int/news/item/16-05-2022-almost-one-billion-children-and-adults-with-disabilities-and-older-persons-in-need-of-assistive-technology-denied-access--according-to-new-report

EN SOURCES: WHO · Assistive technology · 02-01-2024 · https://www.who.int/news-room/fact-sheets/detail/assistive-technology | WHO/UNICEF · Global Report on Assistive Technology · https://www.who.int/news/item/16-05-2022-almost-one-billion-children-and-adults-with-disabilities-and-older-persons-in-need-of-assistive-technology-denied-access--according-to-new-report

ES RUTA: /es/datos/tecnologia-y-productos-de-apoyo/

EN PATH: /en/data/technology-and-assistive-products/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-022

ES TÍTULO: Empleo y discapacidad

EN TITLE: Employment and disability

ES TERRITORIO: 61 países

EN TERRITORY: 61 countries

ES RESUMEN: En una comparación de ILOSTAT basada en 61 países, alrededor de un tercio de las personas con discapacidad en edad laboral estaba empleada, aproximadamente la mitad de la proporción observada entre personas sin discapacidad. La cifra es una media internacional no ponderada, no una tasa mundial única.

EN SUMMARY: In an ILOSTAT comparison based on 61 countries, around one third of working-age persons with disabilities were employed, approximately half the proportion observed among persons without disabilities. The figure is an unweighted international average, not a single global rate.

ES REFERENCIA TEMPORAL: múltiples años en 61 países · ILOSTAT, 13-06-2022.

EN TIME REFERENCE: multiple years in 61 countries · ILOSTAT, 13-06-2022.

ES MÉTODO: Organización Internacional del Trabajo / comparación internacional

EN METHOD: International Labour Organization / international comparison

ES POBLACIÓN / ALCANCE: Personas con y sin discapacidad en 61 países

EN POPULATION / SCOPE: Persons with and without disabilities in 61 countries

ES FUENTES: ILOSTAT · 13-06-2022 · https://ilostat.ilo.org/blog/new-ilo-database-highlights-labour-market-challenges-of-persons-with-disabilities/

EN SOURCES: ILOSTAT · 13-06-2022 · https://ilostat.ilo.org/blog/new-ilo-database-highlights-labour-market-challenges-of-persons-with-disabilities/

ES RUTA: /es/datos/empleo-y-discapacidad/

EN PATH: /en/data/employment-and-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-023

ES TÍTULO: Brecha salarial y discapacidad

EN TITLE: Pay gap and disability

ES TERRITORIO: 30 países

EN TERRITORY: 30 countries

ES RESUMEN: La brecha salarial asociada a discapacidad no se limita al acceso al empleo. Un estudio internacional de la OIT encontró una diferencia media en salario por hora incluso después de considerar variables como edad, educación y ocupación.

EN SUMMARY: The pay gap associated with disability is not limited to access to employment. An international ILO study found an average difference in hourly pay even after taking variables such as age, education and occupation into account.

ES REFERENCIA TEMPORAL: submuestra internacional de 30 países · OIT Working Paper 124, 27-08-2024.

EN TIME REFERENCE: international subsample of 30 countries · ILO Working Paper 124, 27-08-2024.

ES MÉTODO: Organización Internacional del Trabajo / comparación internacional

EN METHOD: International Labour Organization / international comparison

ES POBLACIÓN / ALCANCE: Salario por hora de trabajadores con y sin discapacidad, submuestra internacional

EN POPULATION / SCOPE: Hourly wages of workers with and without disabilities, international subsample

ES FUENTES: OIT · Working Paper 124 · 27-08-2024 · https://www.ilo.org/publications/study-employment-and-wage-outcomes-people-disabilities | OIT · resumen 28-08-2024 · https://www.ilo.org/resource/news/new-ilo-working-paper-exposes-significant-disability-wage-gap

EN SOURCES: ILO · Working Paper 124 · 27-08-2024 · https://www.ilo.org/publications/study-employment-and-wage-outcomes-people-disabilities | ILO · summary 28-08-2024 · https://www.ilo.org/resource/news/new-ilo-working-paper-exposes-significant-disability-wage-gap

ES RUTA: /es/datos/brecha-salarial-y-discapacidad/

EN PATH: /en/data/pay-gap-and-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-024

ES TÍTULO: Brecha de empleo asociada a discapacidad

EN TITLE: Employment gap associated with disability

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: En la Unión Europea, la brecha de empleo entre personas con y sin discapacidad fue de 24,2 puntos porcentuales en la última actualización publicada por Eurostat en mayo de 2026.

EN SUMMARY: In the European Union, the employment gap between persons with and without disabilities was 24.2 percentage points in the latest update published by Eurostat in May 2026.

ES REFERENCIA TEMPORAL: última serie disponible en la actualización de 2026 · Eurostat, 29-05-2026.

EN TIME REFERENCE: latest available series in the 2026 update · Eurostat, 29-05-2026.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Tasa de empleo de personas con discapacidad frente a personas sin discapacidad

EN POPULATION / SCOPE: Employment rate of persons with disabilities compared with persons without disabilities

ES FUENTES: Eurostat · 29-05-2026 · https://ec.europa.eu/eurostat/web/products-eurostat-news/w/wdn-20260529-1

EN SOURCES: Eurostat · 29-05-2026 · https://ec.europa.eu/eurostat/web/products-eurostat-news/w/wdn-20260529-1

ES RUTA: /es/datos/brecha-de-empleo-asociada-a-discapacidad/

EN PATH: /en/data/employment-gap-associated-with-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-025

ES TÍTULO: Participación laboral y discapacidad

EN TITLE: Labour-force participation and disability

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: Participar en el mercado laboral significa estar trabajando o buscando trabajo. En la Unión Europea, los datos de 2024 muestran una diferencia amplia entre personas con y sin discapacidad, y una participación especialmente baja entre quienes tienen una discapacidad grave.

EN SUMMARY: Participating in the labour market means either working or looking for work. In the European Union, 2024 data show a wide difference between persons with and without disabilities, and especially low participation among people with severe disabilities.

ES REFERENCIA TEMPORAL: 2024 · Comisión Europea, ESDE 2025.

EN TIME REFERENCE: 2024 · European Commission, ESDE 2025.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Población activa: fuera de la población activa no equivale a desempleo

EN POPULATION / SCOPE: Labour force: being outside the labour force is not the same as unemployment

ES FUENTES: Comisión Europea · Employment and Social Developments in Europe 2025, capítulo 2 · https://ec.europa.eu/employment_social/employment_analysis/esde/2025/Chapter%202.html

EN SOURCES: European Commission · Employment and Social Developments in Europe 2025, chapter 2 · https://ec.europa.eu/employment_social/employment_analysis/esde/2025/Chapter%202.html

ES RUTA: /es/datos/participacion-laboral-y-discapacidad/

EN PATH: /en/data/labour-force-participation-and-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-026

ES TÍTULO: Abandono temprano de educación y formación

EN TITLE: Early leaving from education and training

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: En 2024, el 44,2 % de los jóvenes de 18 a 24 años con discapacidad grave eran personas que habían abandonado tempranamente la educación o la formación, frente al 8,0 % de los jóvenes sin discapacidad.

EN SUMMARY: In 2024, 44.2% of young people aged 18 to 24 with severe disabilities were early leavers from education or training, compared with 8.0% of young people without disabilities.

ES REFERENCIA TEMPORAL: 2024 · Eurostat, 13-11-2025.

EN TIME REFERENCE: 2024 · Eurostat, 13-11-2025.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Jóvenes de 18 a 24 años

EN POPULATION / SCOPE: Young people aged 18 to 24

ES FUENTES: Eurostat · 13-11-2025 · https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20251113-1

EN SOURCES: Eurostat · 13-11-2025 · https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20251113-1

ES RUTA: /es/datos/abandono-temprano-de-educacion-y-formacion/

EN PATH: /en/data/early-leaving-from-education-and-training/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-027

ES TÍTULO: Jóvenes fuera del empleo, la educación y la formación

EN TITLE: Young people not in employment, education or training

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: Datos de 2024, población de 15 a 29 años:

EN SUMMARY: 2024 data, population aged 15 to 29:

ES REFERENCIA TEMPORAL: 2024 · Eurostat.

EN TIME REFERENCE: 2024 · Eurostat.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Jóvenes de 15 a 29 años

EN POPULATION / SCOPE: Young people aged 15 to 29

ES FUENTES: Eurostat · Disability statistics – access to education and training · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/140942.pdf

EN SOURCES: Eurostat · Disability statistics – access to education and training · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/140942.pdf

ES RUTA: /es/datos/jovenes-fuera-del-empleo-la-educacion-y-la-formacion/

EN PATH: /en/data/young-people-not-in-employment-education-or-training/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-028

ES TÍTULO: Educación superior y discapacidad

EN TITLE: Higher education and disability

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: Datos de 2024, población de 25 a 34 años:

EN SUMMARY: 2024 data, population aged 25 to 34:

ES REFERENCIA TEMPORAL: 2024 · Eurostat.

EN TIME REFERENCE: 2024 · Eurostat.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Personas de 25 a 34 años, con y sin discapacidad

EN POPULATION / SCOPE: Persons aged 25 to 34, with and without disabilities

ES FUENTES: Eurostat · Disability statistics – access to education and training · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/140942.pdf

EN SOURCES: Eurostat · Disability statistics – access to education and training · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/140942.pdf

ES RUTA: /es/datos/educacion-superior-y-discapacidad/

EN PATH: /en/data/higher-education-and-disability/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-029

ES TÍTULO: Formación a lo largo de la vida

EN TITLE: Lifelong learning

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: En 2024, entre personas de 25 a 64 años:

EN SUMMARY: In 2024, among persons aged 25 to 64:

ES REFERENCIA TEMPORAL: 2024 · Eurostat.

EN TIME REFERENCE: 2024 · Eurostat.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Adultos de 25 a 64 años, cuatro semanas anteriores

EN POPULATION / SCOPE: Adults aged 25 to 64, previous four weeks

ES FUENTES: Eurostat · Disability statistics – access to education and training · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/140942.pdf

EN SOURCES: Eurostat · Disability statistics – access to education and training · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/140942.pdf

ES RUTA: /es/datos/formacion-a-lo-largo-de-la-vida/

EN PATH: /en/data/lifelong-learning/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-030

ES TÍTULO: Pobreza y exclusión social

EN TITLE: Poverty and social exclusion

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: En la UE, las personas con discapacidad presentan una mayor exposición a la pobreza y la exclusión social. En 2024, el 28,8 % estaba en riesgo de pobreza o exclusión social, frente al 17,9 % de las personas sin limitación de actividad.

EN SUMMARY: In the EU, persons with disabilities are more exposed to poverty and social exclusion. In 2024, 28.8% were at risk of poverty or social exclusion, compared with 17.9% of persons without activity limitation.

ES REFERENCIA TEMPORAL: 2024 · Eurostat.

EN TIME REFERENCE: 2024 · Eurostat.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Población de 16 años o más de la Unión Europea, 2024

EN POPULATION / SCOPE: Population aged 16 or over in the European Union, 2024

ES FUENTES: Eurostat · Disability statistics – poverty and income inequalities · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/34425.pdf

EN SOURCES: Eurostat · Disability statistics – poverty and income inequalities · https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/34425.pdf

ES RUTA: /es/datos/pobreza-y-exclusion-social/

EN PATH: /en/data/poverty-and-social-exclusion/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-031

ES TÍTULO: Discriminación percibida en la vida cotidiana

EN TITLE: Perceived discrimination in everyday life

ES TERRITORIO: Unión Europea

EN TERRITORY: European Union

ES RESUMEN: En la UE, la discriminación percibida por las personas con discapacidad fue más frecuente en todos los ámbitos analizados por Eurostat en 2024, desde los servicios públicos hasta la vivienda y las instituciones educativas.

EN SUMMARY: In the EU, perceived discrimination among persons with disabilities was more frequent in every area analysed by Eurostat in 2024, from public services to housing and educational institutions.

ES REFERENCIA TEMPORAL: 2024 · Eurostat, 04-05-2026.

EN TIME REFERENCE: 2024 · Eurostat, 04-05-2026.

ES MÉTODO: Estadística oficial de la Unión Europea

EN METHOD: Official European Union statistics

ES POBLACIÓN / ALCANCE: Personas con y sin discapacidad; no son denuncias ni resoluciones judiciales

EN POPULATION / SCOPE: Persons with and without disabilities; these are not complaints or court decisions

ES FUENTES: Eurostat · 04-05-2026 · https://ec.europa.eu/eurostat/web/products-eurostat-news/w/edn-20260504-1

EN SOURCES: Eurostat · 04-05-2026 · https://ec.europa.eu/eurostat/web/products-eurostat-news/w/edn-20260504-1

ES RUTA: /es/datos/discriminacion-percibida-en-la-vida-cotidiana/

EN PATH: /en/data/perceived-discrimination-in-everyday-life/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-032

ES TÍTULO: Autismo identificado en niños de 8 años

EN TITLE: Autism identified in 8-year-old children

ES TERRITORIO: Estados Unidos

EN TERRITORY: United States

ES RESUMEN: En 2022, la red ADDM del CDC identificó autismo en 32,2 de cada 1.000 niños de 8 años —aproximadamente 1 de cada 31— en 16 comunidades estadounidenses. Es uno de los datos más citados sobre autismo y también uno de los que más se descontextualizan.

EN SUMMARY: In 2022, CDC’s ADDM Network identified autism in 32.2 per 1,000 8-year-old children —approximately 1 in 31— in 16 U.S. communities. It is one of the most cited autism data points and also one of the most often taken out of context.

ES REFERENCIA TEMPORAL: 2022 · CDC MMWR publicado en 2025.

EN TIME REFERENCE: 2022 · CDC MMWR published in 2025.

ES MÉTODO: Estadística o vigilancia oficial de Estados Unidos

EN METHOD: Official United States statistics or surveillance

ES POBLACIÓN / ALCANCE: Niños de 8 años en comunidades concretas, no encuesta nacional de todas las edades

EN POPULATION / SCOPE: 8-year-old children in specific communities, not a national survey of all ages

ES FUENTES: CDC · Data and Statistics on Autism · https://www.cdc.gov/autism/data-research/ | CDC MMWR 2025, datos 2022 · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

EN SOURCES: CDC · Data and Statistics on Autism · https://www.cdc.gov/autism/data-research/ | CDC MMWR 2025, 2022 data · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

ES RUTA: /es/datos/autismo-identificado-en-ninos-de-8-anos/

EN PATH: /en/data/autism-identified-in-8-year-old-children/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-033

ES TÍTULO: Diferencia por sexo en identificación de autismo

EN TITLE: Sex difference in autism identification

ES TERRITORIO: Estados Unidos

EN TERRITORY: United States

ES RESUMEN: En los datos ADDM 2022 de niños de 8 años:

EN SUMMARY: In the ADDM 2022 data for 8-year-old children:

ES REFERENCIA TEMPORAL: 2022 · CDC MMWR publicado en 2025.

EN TIME REFERENCE: 2022 · CDC MMWR published in 2025.

ES MÉTODO: Estadística o vigilancia oficial de Estados Unidos

EN METHOD: Official United States statistics or surveillance

ES POBLACIÓN / ALCANCE: Niños de 8 años en los 16 sitios de vigilancia de la red ADDM, 2022

EN POPULATION / SCOPE: 8-year-old children in the 16 surveillance sites of the ADDM Network, 2022

ES FUENTES: CDC MMWR · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

EN SOURCES: CDC MMWR · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

ES RUTA: /es/datos/diferencia-por-sexo-en-identificacion-de-autismo/

EN PATH: /en/data/sex-difference-in-autism-identification/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-034

ES TÍTULO: Edad del diagnóstico de autismo documentado

EN TITLE: Age of documented autism diagnosis

ES TERRITORIO: Estados Unidos

EN TERRITORY: United States

ES RESUMEN: La edad a la que aparece documentado un diagnóstico ayuda a estudiar el acceso a evaluación e identificación. En la vigilancia ADDM 2022, la mediana del diagnóstico más temprano conocido fue de 47 meses entre los niños con información diagnóstica disponible.

EN SUMMARY: The age at which a diagnosis appears in records helps study access to assessment and identification. In ADDM 2022 surveillance, the median earliest known diagnosis was 47 months among children with diagnostic information available.

ES REFERENCIA TEMPORAL: 2022 · CDC MMWR publicado en 2025.

EN TIME REFERENCE: 2022 · CDC MMWR published in 2025.

ES MÉTODO: Estadística o vigilancia oficial de Estados Unidos

EN METHOD: Official United States statistics or surveillance

ES POBLACIÓN / ALCANCE: Niños de 8 años en los 16 sitios de vigilancia de la red ADDM, 2022; la mediana de 47 meses solo entre los que tenían un diagnóstico documentado

EN POPULATION / SCOPE: 8-year-old children in the 16 surveillance sites of the ADDM Network, 2022; the 47-month median only among those with a documented diagnosis

ES FUENTES: CDC MMWR 2025, tabla 4 · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

EN SOURCES: CDC MMWR 2025, table 4 · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

ES RUTA: /es/datos/edad-del-diagnostico-de-autismo-documentado/

EN PATH: /en/data/age-of-documented-autism-diagnosis/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-035

ES TÍTULO: Autismo y discapacidad intelectual en ADDM

EN TITLE: Autism and intellectual disability in ADDM

ES TERRITORIO: Estados Unidos

EN TERRITORY: United States

ES RESUMEN: Entre los niños autistas de 8 años que tenían información cognitiva disponible:

EN SUMMARY: Among autistic 8-year-old children who had cognitive information available:

ES REFERENCIA TEMPORAL: 2022 · CDC MMWR publicado en 2025.

EN TIME REFERENCE: 2022 · CDC MMWR published in 2025.

ES MÉTODO: Estadística o vigilancia oficial de Estados Unidos

EN METHOD: Official United States statistics or surveillance

ES POBLACIÓN / ALCANCE: El 61,4 % de los niños identificados, los que tenían esa información disponible

EN POPULATION / SCOPE: The 61.4% of identified children who had that information available

ES FUENTES: CDC MMWR 2025 · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

EN SOURCES: CDC MMWR 2025 · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm

ES RUTA: /es/datos/autismo-y-discapacidad-intelectual-en-addm/

EN PATH: /en/data/autism-and-intellectual-disability-in-addm/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-036

ES TÍTULO: TDAH infantil

EN TITLE: Childhood ADHD

ES TERRITORIO: Estados Unidos

EN TERRITORY: United States

ES RESUMEN: Datos de la National Survey of Children’s Health 2022:

EN SUMMARY: Data from the 2022 National Survey of Children’s Health:

ES REFERENCIA TEMPORAL: 2022 · National Survey of Children’s Health / CDC, publicación 2024.

EN TIME REFERENCE: 2022 · National Survey of Children’s Health / CDC, publication 2024.

ES MÉTODO: Estadística o vigilancia oficial de Estados Unidos

EN METHOD: Official United States statistics or surveillance

ES POBLACIÓN / ALCANCE: Niños y adolescentes de 3 a 17 años en Estados Unidos, diagnóstico declarado por progenitores, 2022

EN POPULATION / SCOPE: Children and adolescents aged 3 to 17 in the United States, parent-reported diagnosis, 2022

ES FUENTES: CDC Stacks / Danielson et al. · https://stacks.cdc.gov/view/cdc/160350

EN SOURCES: CDC Stacks / Danielson et al. · https://stacks.cdc.gov/view/cdc/160350

ES RUTA: /es/datos/tdah-infantil/

EN PATH: /en/data/childhood-adhd/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-037

ES TÍTULO: Empleo y autismo

EN TITLE: Employment and autism

ES TERRITORIO: Reino Unido

EN TERRITORY: United Kingdom

ES RESUMEN: En el Reino Unido, la Buckland Review de 2024 señaló que solo alrededor de 3 de cada 10 personas autistas en edad laboral estaban empleadas, frente a aproximadamente 5 de cada 10 personas con discapacidad y 8 de cada 10 personas sin discapacidad.

EN SUMMARY: In the United Kingdom, the 2024 Buckland Review stated that only around 3 in 10 autistic people of working age were employed, compared with approximately 5 in 10 disabled people and 8 in 10 non-disabled people.

ES REFERENCIA TEMPORAL: principalmente 2021/22–2022/23 · Buckland Review, 28-02-2024.

EN TIME REFERENCE: mainly 2021/22–2022/23 · Buckland Review, 28-02-2024.

ES MÉTODO: Revisión y datos oficiales del Reino Unido

EN METHOD: United Kingdom review and official data

ES POBLACIÓN / ALCANCE: Personas autistas en edad laboral, frente a personas con discapacidad en conjunto y sin discapacidad

EN POPULATION / SCOPE: Autistic people of working age, compared with disabled people overall and non-disabled people

ES FUENTES: GOV.UK · Buckland Review · 28-02-2024 · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

EN SOURCES: GOV.UK · Buckland Review · 28-02-2024 · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

ES RUTA: /es/datos/empleo-y-autismo/

EN PATH: /en/data/employment-and-autism-united-kingdom/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-038

ES TÍTULO: Brecha salarial en autismo

EN TITLE: Autism pay gap

ES TERRITORIO: Reino Unido

EN TERRITORY: United Kingdom

ES RESUMEN: La Buckland Review cita datos de la Office for National Statistics según los cuales las personas autistas presentaban la mayor brecha salarial de los grupos de discapacidad analizados.

EN SUMMARY: The Buckland Review cites Office for National Statistics data according to which autistic people had the largest pay gap among the disability groups analysed.

ES REFERENCIA TEMPORAL: datos ONS citados por la Buckland Review · Buckland Review, 28-02-2024.

EN TIME REFERENCE: ONS data cited by the Buckland Review · Buckland Review, 28-02-2024.

ES MÉTODO: Revisión y datos oficiales del Reino Unido

EN METHOD: United Kingdom review and official data

ES POBLACIÓN / ALCANCE: Personas autistas ocupadas frente a personas no discapacitadas ocupadas en Reino Unido; comparación relativa

EN POPULATION / SCOPE: Employed autistic people compared with employed non-disabled people in the United Kingdom; relative comparison

ES FUENTES: GOV.UK · Buckland Review · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

EN SOURCES: GOV.UK · Buckland Review · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

ES RUTA: /es/datos/brecha-salarial-en-autismo/

EN PATH: /en/data/autism-pay-gap/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-039

ES TÍTULO: Graduados autistas

EN TITLE: Autistic graduates

ES TERRITORIO: Reino Unido

EN TERRITORY: United Kingdom

ES RESUMEN: Datos de 2022 citados por la Buckland Review:

EN SUMMARY: 2022 data cited by the Buckland Review:

ES REFERENCIA TEMPORAL: 2022 · Buckland Review, 2024.

EN TIME REFERENCE: 2022 · Buckland Review, 2024.

ES MÉTODO: Revisión y datos oficiales del Reino Unido

EN METHOD: United Kingdom review and official data

ES POBLACIÓN / ALCANCE: Graduados autistas del Reino Unido, quince meses después de graduarse, 2022

EN POPULATION / SCOPE: Autistic graduates in the United Kingdom, fifteen months after graduation, 2022

ES FUENTES: GOV.UK · Buckland Review · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

EN SOURCES: GOV.UK · Buckland Review · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

ES RUTA: /es/datos/graduados-autistas/

EN PATH: /en/data/autistic-graduates/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-040

ES TÍTULO: Revelar el diagnóstico y pedir ajustes en el trabajo

EN TITLE: Disclosing a diagnosis and asking for adjustments at work

ES TERRITORIO: Reino Unido

EN TERRITORY: United Kingdom

ES RESUMEN: La Buckland Review incorpora resultados del Diverse Minds Employment Survey:

EN SUMMARY: The Buckland Review includes results from the Diverse Minds Employment Survey:

ES REFERENCIA TEMPORAL: Diverse Minds Employment Survey citado por la Buckland Review · Buckland Review, 2024.

EN TIME REFERENCE: Diverse Minds Employment Survey cited by the Buckland Review · Buckland Review, 2024.

ES MÉTODO: Revisión y datos oficiales del Reino Unido

EN METHOD: United Kingdom review and official data

ES POBLACIÓN / ALCANCE: Muestra de encuesta, no censo nacional

EN POPULATION / SCOPE: Survey sample, not a national census

ES FUENTES: GOV.UK · Buckland Review · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

EN SOURCES: GOV.UK · Buckland Review · https://www.gov.uk/government/publications/the-buckland-review-of-autism-employment-report-and-recommendations/the-buckland-review-of-autism-employment-report-and-recommendations

ES RUTA: /es/datos/revelar-el-diagnostico-y-pedir-ajustes-en-el-trabajo/

EN PATH: /en/data/disclosing-a-diagnosis-and-asking-for-adjustments-at-work/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-041

ES TÍTULO: Autismo en la población

EN TITLE: Autism in the population

ES TERRITORIO: Australia

EN TERRITORY: Australia

ES RESUMEN: Australian Bureau of Statistics · Survey of Disability, Ageing and Carers 2022:

EN SUMMARY: Australian Bureau of Statistics · Survey of Disability, Ageing and Carers 2022:

ES REFERENCIA TEMPORAL: 2022 · Australian Bureau of Statistics, 11-10-2024.

EN TIME REFERENCE: 2022 · Australian Bureau of Statistics, 11-10-2024.

ES MÉTODO: Estadística oficial de Australia

EN METHOD: Official statistics from Australia

ES POBLACIÓN / ALCANCE: Todas las edades, con desglose por sexo y edad; comparación entre rondas de la encuesta

EN POPULATION / SCOPE: All ages, with breakdown by sex and age; comparison between survey rounds

ES FUENTES: Australian Bureau of Statistics · Autism in Australia, 2022 · publicado 11-10-2024 · https://www.abs.gov.au/articles/autism-australia-2022

EN SOURCES: Australian Bureau of Statistics · Autism in Australia, 2022 · published 11-10-2024 · https://www.abs.gov.au/articles/autism-australia-2022

ES RUTA: /es/datos/autismo-en-la-poblacion/

EN PATH: /en/data/autism-in-the-population/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-042

ES TÍTULO: Necesidad de apoyo

EN TITLE: Support needs

ES TERRITORIO: Australia

EN TERRITORY: Australia

ES RESUMEN: En la encuesta australiana 2022:

EN SUMMARY: In the 2022 Australian survey:

ES REFERENCIA TEMPORAL: 2022 · Australian Bureau of Statistics, 11-10-2024.

EN TIME REFERENCE: 2022 · Australian Bureau of Statistics, 11-10-2024.

ES MÉTODO: Estadística oficial de Australia

EN METHOD: Official statistics from Australia

ES POBLACIÓN / ALCANCE: Personas autistas que viven en hogares, todas las edades, Australia, 2022

EN POPULATION / SCOPE: Autistic people living in households, all ages, Australia, 2022

ES FUENTES: ABS · Autism in Australia, 2022 · https://www.abs.gov.au/articles/autism-australia-2022 | Versión en lenguaje claro · https://www.abs.gov.au/articles/autism-australia-2022/autism-australia-2022-key-findings-plain-language

EN SOURCES: ABS · Autism in Australia, 2022 · https://www.abs.gov.au/articles/autism-australia-2022 | Plain-language version · https://www.abs.gov.au/articles/autism-australia-2022/autism-australia-2022-key-findings-plain-language

ES RUTA: /es/datos/necesidad-de-apoyo/

EN PATH: /en/data/support-needs/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-043

ES TÍTULO: Educación y autismo

EN TITLE: Education and autism

ES TERRITORIO: Australia

EN TERRITORY: Australia

ES RESUMEN: Entre personas autistas de 15 años o más que vivían en hogares:

EN SUMMARY: Among autistic people aged 15 or over living in households:

ES REFERENCIA TEMPORAL: 2022 · Australian Bureau of Statistics, 11-10-2024.

EN TIME REFERENCE: 2022 · Australian Bureau of Statistics, 11-10-2024.

ES MÉTODO: Estadística oficial de Australia

EN METHOD: Official statistics from Australia

ES POBLACIÓN / ALCANCE: Dos poblaciones: personas autistas de 15 años o más en hogares, y de 5 a 20 años escolarizadas

EN POPULATION / SCOPE: Two populations: autistic people aged 15 or over in households, and school pupils aged 5 to 20

ES FUENTES: ABS · Autism in Australia, 2022 · https://www.abs.gov.au/articles/autism-australia-2022/autism-australia-2022-key-findings-plain-language

EN SOURCES: ABS · Autism in Australia, 2022 · https://www.abs.gov.au/articles/autism-australia-2022/autism-australia-2022-key-findings-plain-language

ES RUTA: /es/datos/educacion-y-autismo/

EN PATH: /en/data/education-and-autism/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-044

ES TÍTULO: Empleo y autismo

EN TITLE: Employment and autism

ES TERRITORIO: Australia

EN TERRITORY: Australia

ES RESUMEN: Entre personas autistas de 15 a 64 años que vivían en hogares:

EN SUMMARY: Among autistic people aged 15 to 64 living in households:

ES REFERENCIA TEMPORAL: 2022 · Australian Bureau of Statistics, 11-10-2024.

EN TIME REFERENCE: 2022 · Australian Bureau of Statistics, 11-10-2024.

ES MÉTODO: Estadística oficial de Australia

EN METHOD: Official statistics from Australia

ES POBLACIÓN / ALCANCE: Personas autistas de 15 a 64 años que viven en hogares, Australia, 2022

EN POPULATION / SCOPE: Autistic people aged 15 to 64 living in households, Australia, 2022

ES FUENTES: ABS · Autism in Australia, 2022 · https://www.abs.gov.au/articles/autism-australia-2022/autism-australia-2022-key-findings-plain-language

EN SOURCES: ABS · Autism in Australia, 2022 · https://www.abs.gov.au/articles/autism-australia-2022/autism-australia-2022-key-findings-plain-language

ES RUTA: /es/datos/empleo-y-autismo-australia/

EN PATH: /en/data/employment-and-autism-australia/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-045

ES TÍTULO: Autismo en niños y jóvenes

EN TITLE: Autism in children and young people

ES TERRITORIO: Canadá

EN TERRITORY: Canada

ES RESUMEN: La estimación nacional más reciente que el Gobierno de Canadá seguía utilizando en su Framework for Autism procede de la Canadian Health Survey on Children and Youth 2019.

EN SUMMARY: The most recent national estimate that the Government of Canada was still using in its Framework for Autism comes from the 2019 Canadian Health Survey on Children and Youth.

ES REFERENCIA TEMPORAL: 2019 · PHAC; sigue como referencia en Framework for Autism in Canada.

EN TIME REFERENCE: 2019 · PHAC; still used as a reference in the Framework for Autism in Canada.

ES MÉTODO: Estadística oficial de Canadá

EN METHOD: Official statistics from Canada

ES POBLACIÓN / ALCANCE: Niños y jóvenes de 1 a 17 años

EN POPULATION / SCOPE: Children and young people aged 1 to 17

ES FUENTES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html | Framework for Autism in Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/framework-autism-canada.html

EN SOURCES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html | Framework for Autism in Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/framework-autism-canada.html

ES RUTA: /es/datos/autismo-en-ninos-y-jovenes/

EN PATH: /en/data/autism-in-children-and-young-people/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-046

ES TÍTULO: Edad de diagnóstico

EN TITLE: Age at diagnosis

ES TERRITORIO: Canadá

EN TERRITORY: Canada

ES RESUMEN: Entre los niños y jóvenes autistas de la encuesta canadiense:

EN SUMMARY: Among autistic children and young people in the Canadian survey:

ES REFERENCIA TEMPORAL: 2019 · PHAC.

EN TIME REFERENCE: 2019 · PHAC.

ES MÉTODO: Estadística oficial de Canadá

EN METHOD: Official statistics from Canada

ES POBLACIÓN / ALCANCE: Niños y jóvenes autistas incluidos en la encuesta canadiense de 2019

EN POPULATION / SCOPE: Autistic children and young people included in the 2019 Canadian survey

ES FUENTES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html

EN SOURCES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html

ES RUTA: /es/datos/edad-de-diagnostico/

EN PATH: /en/data/age-at-diagnosis/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-047

ES TÍTULO: Salud general y mental

EN TITLE: General and mental health

ES TERRITORIO: Canadá

EN TERRITORY: Canada

ES RESUMEN: Entre niños y jóvenes autistas:

EN SUMMARY: Among autistic children and young people:

ES REFERENCIA TEMPORAL: 2019 · PHAC.

EN TIME REFERENCE: 2019 · PHAC.

ES MÉTODO: Estadística oficial de Canadá

EN METHOD: Official statistics from Canada

ES POBLACIÓN / ALCANCE: Comparación entre grupos, no recuento de diagnósticos

EN POPULATION / SCOPE: Comparison between groups, not a count of diagnoses

ES FUENTES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html

EN SOURCES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html

ES RUTA: /es/datos/salud-general-y-mental/

EN PATH: /en/data/general-and-mental-health/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-048

ES TÍTULO: Condiciones coexistentes y necesidades educativas

EN TITLE: Coexisting conditions and educational needs

ES TERRITORIO: Canadá

EN TERRITORY: Canada

ES RESUMEN: Entre niños y jóvenes autistas:

EN SUMMARY: Among autistic children and young people:

ES REFERENCIA TEMPORAL: 2019 · PHAC.

EN TIME REFERENCE: 2019 · PHAC.

ES MÉTODO: Estadística oficial de Canadá

EN METHOD: Official statistics from Canada

ES POBLACIÓN / ALCANCE: Cada porcentaje tiene su propio denominador

EN POPULATION / SCOPE: Each percentage has its own denominator

ES FUENTES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html

EN SOURCES: Public Health Agency of Canada · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html

ES RUTA: /es/datos/condiciones-coexistentes-y-necesidades-educativas/

EN PATH: /en/data/coexisting-conditions-and-educational-needs/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## WEB-DATA-049

ES TÍTULO: Cuatro cifras de autismo que no miden lo mismo

EN TITLE: Four autism figures that do not measure the same thing

ES TERRITORIO: Comparativa internacional

EN TERRITORY: International comparison

ES RESUMEN: No es un ranking de prevalencia. Cada país usa edades, fuentes y métodos distintos. Una cifra más alta puede reflejar mejor identificación, diferente cobertura, distinta edad de la población, mayor acceso al diagnóstico o una metodología diferente.

EN SUMMARY: This is not a prevalence ranking. Each country uses different ages, sources and methods. A higher figure may reflect better identification, different coverage, a different age group, greater access to diagnosis or a different methodology.

ES REFERENCIA TEMPORAL: 2021 / 2022 / 2019 / 2022, según la fuente · comparación metodológica preparada en 2026.

EN TIME REFERENCE: 2021 / 2022 / 2019 / 2022, depending on the source · methodological comparison prepared in 2026.

ES MÉTODO: Comparación metodológica de fuentes oficiales y modelizadas

EN METHOD: Methodological comparison of official and modelled sources

ES POBLACIÓN / ALCANCE: Cada cifra lleva el suyo en la tabla

EN POPULATION / SCOPE: Each figure has its own denominator in the table

ES FUENTES: Mundo · OMS / GBD 2021 · https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders | EE. UU. · CDC ADDM 2022 · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm | Canadá · PHAC / CHSCY 2019 · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html | Australia · ABS SDAC 2022 · https://www.abs.gov.au/articles/autism-australia-2022

EN SOURCES: World · WHO / GBD 2021 · https://www.who.int/news-room/fact-sheets/detail/autism-spectrum-disorders | U.S. · CDC ADDM 2022 · https://www.cdc.gov/mmwr/volumes/74/ss/ss7402a1.htm | Canada · PHAC / CHSCY 2019 · https://www.canada.ca/en/public-health/services/publications/diseases-conditions/autism-spectrum-disorder-canadian-health-survey-children-youth-2019.html | Australia · ABS SDAC 2022 · https://www.abs.gov.au/articles/autism-australia-2022

ES RUTA: /es/datos/cuatro-cifras-de-autismo-que-no-miden-lo-mismo/

EN PATH: /en/data/four-autism-figures-that-do-not-measure-the-same-thing/

ORIGEN: SOURCE_DERIVED

ESTADO FUENTE ES: BORRADOR

EN SOURCE STATUS: BORRADOR

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE · SOURCE_CAPTURED_BORRADOR · NOT_PRODUCTION

---

## QA · CORPUS DATOS / DATA

- ES_RECORDS: 49/49
- EN_RECORDS: 49/49
- NUMERIC_ALIGNMENT: 49/49
- BILINGUAL_COMPLETE: 49/49
- SOURCE_STATUS_PRESERVED: 49/49
- SOURCE_PROVENANCE_PRESENT: 49/49
- PRODUCTION_PROMOTION: 0 while source status remains BORRADOR
- STATUS: PASS

SIGUIENTE FASE: Taller / Workshop y recursos bilingües.

# 68. TALLER / WORKSHOP · BANCO DE RETOS BILINGÜE

FUENTE: `es/taller/taller-retos.json` · rama `main`.

ES REGLA: Se conserva el contenido bilingüe de la fuente. Los códigos `mesa` y `dur` se registran tal cual, sin inferir aquí su significado.

EN RULE: The bilingual source content is preserved. `mesa` and `dur` codes are stored as-is, without inferring their meaning here.

## WEB-WORKSHOP-CHALLENGE-001

ES TÍTULO: Diez veces lo mismo

EN TITLE: Ten times the same thing

ES RETO: Dibuja el mismo objeto diez veces en una hoja. Cambia una cosa en cada dibujo.

EN CHALLENGE: Draw the same object ten times on one sheet. Change one thing in each drawing.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Hazlo con diez fotos del mismo objeto, moviendo tú una cosa cada vez.

EN ALTERNATIVE: Do it with ten photos of the same object, moving one thing each time.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-002

ES TÍTULO: Sin mirar el papel

EN TITLE: Without looking at the paper

ES RETO: Mira el objeto todo el rato y dibuja sin mirar la hoja. Sale torcido. Ese es el juego.

EN CHALLENGE: Look at the object the whole time and draw without looking at the sheet. It comes out crooked. That is the game.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Dibuja con los ojos cerrados y luego mira.

EN ALTERNATIVE: Draw with your eyes closed and look afterwards.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-003

ES TÍTULO: La criatura de tres partes

EN TITLE: The three-part creature

ES RETO: Junta una parte de un animal, una de una máquina y una de una planta. Ponle nombre.

EN CHALLENGE: Join a part of an animal, a part of a machine and a part of a plant. Give it a name.

ES NECESITAS: Papel y color

EN YOU NEED: Paper and colour

ES OTRA OPCIÓN: Recorta las tres partes de revistas y pégalas.

EN ALTERNATIVE: Cut the three parts out of magazines and glue them.

MESA_CODE: 0

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-004

ES TÍTULO: Los colores cambiados

EN TITLE: The swapped colours

ES RETO: Dibuja algo conocido con los colores que no le tocan: un limón azul, un cielo naranja.

EN CHALLENGE: Draw something familiar in the wrong colours: a blue lemon, an orange sky.

ES NECESITAS: Papel y color

EN YOU NEED: Paper and colour

ES OTRA OPCIÓN: Hazlo con filtros en el móvil sobre una foto tuya.

EN ALTERNATIVE: Do it with phone filters on a photo of yours.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-005

ES TÍTULO: Tal como está

EN TITLE: Exactly as it is

ES RETO: Copia una zapatilla, un mando o una taza. Con la arruga, la mancha y el cable enredado.

EN CHALLENGE: Copy a trainer, a remote or a mug. With the crease, the stain and the tangled cable.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Dibuja solo el contorno, sin detalles.

EN ALTERNATIVE: Draw the outline only, no details.

MESA_CODE: 0

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-006

ES TÍTULO: La misma escena, tres tamaños

EN TITLE: The same scene, three sizes

ES RETO: Dibuja lo mismo tres veces: muy pequeño, mediano y ocupando toda la hoja.

EN CHALLENGE: Draw the same thing three times: very small, medium and filling the whole sheet.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Usa tres papeles de tamaños distintos.

EN ALTERNATIVE: Use three sheets of different sizes.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-007

ES TÍTULO: Cinco frases y una foto

EN TITLE: Five sentences and a photo

ES RETO: Haz una foto de algo de hoy. Escribe cinco frases sobre ella. Ni una más.

EN CHALLENGE: Take a photo of something from today. Write five sentences about it. Not one more.

ES NECESITAS: Móvil y papel

EN YOU NEED: Phone and paper

ES OTRA OPCIÓN: Grábate diciendo las cinco frases.

EN ALTERNATIVE: Record yourself saying the five sentences.

MESA_CODE: 1

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-008

ES TÍTULO: La lista de lo que no existe

EN TITLE: The list of what does not exist

ES RETO: Escribe quince cosas que no existen: un electrodoméstico, un animal, una asignatura, un día de la semana.

EN CHALLENGE: Write fifteen things that do not exist: an appliance, an animal, a school subject, a day of the week.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Dilas en voz alta y que otra persona las apunte.

EN ALTERNATIVE: Say them out loud and have someone else write them down.

MESA_CODE: 1

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-009

ES TÍTULO: El día contado por la mochila

EN TITLE: The day told by the backpack

ES RETO: Un objeto tuyo cuenta cómo ha ido el día. Habla el objeto, no tú.

EN CHALLENGE: An object of yours tells how the day went. The object speaks, not you.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Grábalo como si fuera un audio de la mochila.

EN ALTERNATIVE: Record it as if it were an audio from the backpack.

MESA_CODE: 1

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-010

ES TÍTULO: Cuatro viñetas sin palabras

EN TITLE: Four panels with no words

ES RETO: Una historia entera en cuatro dibujos. Nadie habla.

EN CHALLENGE: A whole story in four drawings. Nobody speaks.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Hazlo con cuatro fotos puestas en orden.

EN ALTERNATIVE: Do it with four photos put in order.

MESA_CODE: 1

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-011

ES TÍTULO: La misma historia, dos versiones

EN TITLE: The same story, two versions

ES RETO: Un hecho pequeño contado por dos personas distintas. Cambia lo que cada una cuenta.

EN CHALLENGE: One small event told by two different people. What each one tells changes.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Cuéntalas en voz alta y compara.

EN ALTERNATIVE: Tell them out loud and compare.

MESA_CODE: 1

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-012

ES TÍTULO: Instrucciones exactas

EN TITLE: Exact instructions

ES RETO: Escribe cómo se ata un cordón, paso por paso, para alguien que nunca lo ha visto. Prueba si funcionan.

EN CHALLENGE: Write how to tie a shoelace, step by step, for someone who has never seen it. Test whether they work.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Grábalo en vídeo diciendo cada paso.

EN ALTERNATIVE: Record it on video saying each step.

MESA_CODE: 1

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-013

ES TÍTULO: El puente de papel

EN TITLE: The paper bridge

ES RETO: Haz un puente entre dos libros que aguante un tercer libro encima. Solo con folios.

EN CHALLENGE: Make a bridge between two books that holds a third book on top. Sheets of paper only.

ES NECESITAS: Folios

EN YOU NEED: Sheets of paper

ES OTRA OPCIÓN: Hazlo con cartón de una caja.

EN ALTERNATIVE: Do it with cardboard from a box.

MESA_CODE: 2

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-014

ES TÍTULO: La caja de zapatos

EN TITLE: The shoebox

ES RETO: Convierte una caja en una sala pequeña. Con suelo, luz y algo que se mueva.

EN CHALLENGE: Turn a box into a small room of its own. With a floor, a light and something that moves.

ES NECESITAS: Caja, cartón y tijeras

EN YOU NEED: Box, cardboard and scissors

ES OTRA OPCIÓN: Móntala con lo que hay sin cortar nada.

EN ALTERNATIVE: Build it with what is there without cutting anything.

MESA_CODE: 2

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-015

ES TÍTULO: La torre sin pegamento

EN TITLE: The tower with no glue

ES RETO: Sube todo lo que puedas apilando y encajando. Sin cinta, sin cola.

EN CHALLENGE: Go as high as you can by stacking and slotting. No tape, no glue.

ES NECESITAS: Lo que haya

EN YOU NEED: Whatever is around

ES OTRA OPCIÓN: Hazla tumbada, a lo largo del suelo.

EN ALTERNATIVE: Build it lying down, along the floor.

MESA_CODE: 2

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-016

ES TÍTULO: Algo que se mueva

EN TITLE: Something that moves

ES RETO: Una pinza, una goma y un palo. Que empuje, levante o lance.

EN CHALLENGE: A peg, a rubber band and a stick. Make it push, lift or launch.

ES NECESITAS: Materiales sueltos

EN YOU NEED: Loose materials

ES OTRA OPCIÓN: Dibuja el mecanismo y explica cómo se movería.

EN ALTERNATIVE: Draw the mechanism and explain how it would move.

MESA_CODE: 2

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-017

ES TÍTULO: A escala

EN TITLE: To scale

ES RETO: Construye un mueble pequeño para un muñeco, un coche o una figura. Que se sostenga de verdad.

EN CHALLENGE: Build a small piece of furniture for a doll, a car or a figure. It has to really hold.

ES NECESITAS: Cartón

EN YOU NEED: Cardboard

ES OTRA OPCIÓN: Hazlo con plastilina o con masa de sal.

EN ALTERNATIVE: Do it with plasticine or salt dough.

MESA_CODE: 2

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-018

ES TÍTULO: La máquina que no sirve para nada

EN TITLE: The machine that is good for nothing

ES RETO: Una máquina con manivela, cuerda o rampa cuyo único fin es funcionar.

EN CHALLENGE: A machine with a crank, a string or a ramp whose only purpose is to work.

ES NECESITAS: Lo que haya

EN YOU NEED: Whatever is around

ES OTRA OPCIÓN: Dibújala con todas sus piezas numeradas.

EN ALTERNATIVE: Draw it with all its parts numbered.

MESA_CODE: 2

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-019

ES TÍTULO: Cinco sonidos cerca

EN TITLE: Five sounds nearby

ES RETO: Graba cinco sonidos que suenen donde estés ahora. Que otra persona los adivine.

EN CHALLENGE: Record five sounds happening where you are right now. Let somebody else guess them.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Imítalos con la boca y que los adivinen igual.

EN ALTERNATIVE: Imitate them with your mouth and have them guessed anyway.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-020

ES TÍTULO: Un ritmo con tres cosas

EN TITLE: A rhythm with three things

ES RETO: Elige tres objetos que suenen distinto. Haz un ritmo de ocho golpes y repítelo.

EN CHALLENGE: Pick three objects that sound different. Make a rhythm of eight beats and repeat it.

ES NECESITAS: Tres objetos

EN YOU NEED: Three objects

ES OTRA OPCIÓN: Hazlo con palmas, chasquidos y pies.

EN ALTERNATIVE: Do it with claps, clicks and feet.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-021

ES TÍTULO: Un minuto de calle

EN TITLE: One minute of street

ES RETO: Graba un minuto por la ventana. Escúchalo entero y apunta todo lo que se oye.

EN CHALLENGE: Record one minute out of the window. Listen to all of it and write down everything you hear.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Escucha un minuto sin grabar y apunta después.

EN ALTERNATIVE: Listen for one minute without recording and write it down afterwards.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-022

ES TÍTULO: Tres notas

EN TITLE: Three notes

ES RETO: Inventa una melodía corta usando solo tres notas. Repítela hasta que te la sepas.

EN CHALLENGE: Invent a short tune using only three notes. Repeat it until you know it.

ES NECESITAS: Voz, teclado o app

EN YOU NEED: Voice, keyboard or app

ES OTRA OPCIÓN: Hazla con tres vasos con agua a distinta altura.

EN ALTERNATIVE: Do it with three glasses filled to different heights.

MESA_CODE: 3

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-023

ES TÍTULO: El mapa sonoro

EN TITLE: The sound map

ES RETO: Dibuja desde arriba el sitio donde estés y marca dónde suena cada cosa. No hace falta que se reconozca: vale un plano inventado.

EN CHALLENGE: Draw the place you are in from above and mark where each thing sounds. It does not have to be recognisable: an invented plan works.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Dilo en voz alta señalando con el dedo.

EN ALTERNATIVE: Say it out loud, pointing with your finger.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-024

ES TÍTULO: Tu voz grabada

EN TITLE: Your recorded voice

ES RETO: Graba un trozo leído o contado. Escúchalo. Grábalo otra vez cambiando algo.

EN CHALLENGE: Record a bit read or told. Listen to it. Record it again changing something.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Grábalo sin escucharlo después y guárdalo para otro día.

EN ALTERNATIVE: Record it without listening afterwards and keep it for another day.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-025

ES TÍTULO: El mismo sitio, diez horas

EN TITLE: The same place, ten hours

ES RETO: Diez fotos del mismo rincón a lo largo del día. Ponlas en fila.

EN CHALLENGE: Ten photos of the same corner through the day. Lay them out in a row.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Dibuja el mismo rincón tres veces en tres momentos.

EN ALTERNATIVE: Draw the same corner three times at three moments.

MESA_CODE: 4

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-026

ES TÍTULO: La colección de una sola cosa

EN TITLE: The collection of one single thing

ES RETO: Fotografía veinte puertas, veinte manchas o veinte matrículas de tu calle.

EN CHALLENGE: Photograph twenty doors, twenty stains or twenty number plates on your street.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Dibuja diez en vez de fotografiar veinte.

EN ALTERNATIVE: Draw ten instead of photographing twenty.

MESA_CODE: 4

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-027

ES TÍTULO: El cuaderno de un metro cuadrado

EN TITLE: The one-square-metre notebook

ES RETO: Elige un metro cuadrado que puedas mirar cinco días: una maceta, un trozo de acera, un rincón del parque. Apunta lo que pasa ahí.

EN CHALLENGE: Pick a square metre you can look at for five days: a plant pot, a bit of pavement, a corner of a park. Note what happens there.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Haz una foto diaria del mismo cuadrado.

EN ALTERNATIVE: Take one photo a day of the same square.

MESA_CODE: 4

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-028

ES TÍTULO: La misma forma en veinte sitios

EN TITLE: The same shape in twenty places

ES RETO: Busca círculos donde vayas: por la calle, en el transporte, en una tienda. Cuéntalos. Dibuja los raros.

EN CHALLENGE: Look for circles wherever you go: in the street, on transport, in a shop. Count them. Draw the odd ones.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Busca un color en vez de una forma.

EN ALTERNATIVE: Look for a colour instead of a shape.

MESA_CODE: 4

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-029

ES TÍTULO: Fotografiar la luz

EN TITLE: Photographing the light

ES RETO: No fotografíes el objeto: fotografía la sombra, el reflejo o la raya de sol en la pared.

EN CHALLENGE: Do not photograph the object: photograph the shadow, the reflection or the stripe of sun on the wall.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Dibuja solo la sombra de un objeto.

EN ALTERNATIVE: Draw only the shadow of an object.

MESA_CODE: 4

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-030

ES TÍTULO: Veinte cosas por color

EN TITLE: Twenty things by colour

ES RETO: Reúne veinte objetos, ordénalos por color y haz una foto desde arriba.

EN CHALLENGE: Gather twenty objects, sort them by colour and take a photo from above.

ES NECESITAS: Objetos y móvil

EN YOU NEED: Objects and phone

ES OTRA OPCIÓN: Ordénalos por tamaño o por ruido que hacen.

EN ALTERNATIVE: Sort them by size or by the noise they make.

MESA_CODE: 4

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-031

ES TÍTULO: Seis casillas

EN TITLE: Six squares

ES RETO: Inventa un juego de mesa de seis casillas con tres reglas. Juégalo una vez y cambia una regla.

EN CHALLENGE: Invent a board game of six squares with three rules. Play it once and change one rule.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Dicta las reglas y que otra persona dibuje el tablero.

EN ALTERNATIVE: Dictate the rules and have someone else draw the board.

MESA_CODE: 5

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-032

ES TÍTULO: Un sitio que no existe

EN TITLE: A place that does not exist

ES RETO: Dibuja el mapa: la costa, tres pueblos, un río y los nombres.

EN CHALLENGE: Draw the map: the coast, three villages, a river and the names.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Descríbelo en voz alta con todos los nombres y apúntalos.

EN ALTERNATIVE: Describe it out loud with all the names and write them down.

MESA_CODE: 5

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-033

ES TÍTULO: Diez letras nuevas

EN TITLE: Ten new letters

ES RETO: Inventa un alfabeto de diez signos. Escribe tu nombre con él.

EN CHALLENGE: Invent an alphabet of ten signs. Write your name with it.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Usa diez gestos con la mano en vez de signos escritos.

EN ALTERNATIVE: Use ten hand gestures instead of written signs.

MESA_CODE: 5

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-034

ES TÍTULO: Un deporte de mesa

EN TITLE: A tabletop sport

ES RETO: Reglas nuevas con lo que tengas encima de la mesa. Cómo se gana, cómo se pierde, qué está prohibido.

EN CHALLENGE: New rules using whatever is on the table. How you win, how you lose, what is not allowed.

ES NECESITAS: Lo que haya

EN YOU NEED: Whatever is around

ES OTRA OPCIÓN: Adapta un juego que ya conozcas cambiando tres reglas.

EN ALTERNATIVE: Adapt a game you already know by changing three rules.

MESA_CODE: 5

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-035

ES TÍTULO: Una moneda

EN TITLE: A coin

ES RETO: Invéntala: cómo se llama, cuánto vale y qué se compra con una.

EN CHALLENGE: Invent it: what it is called, what it is worth and what one buys.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Dibújala en plastilina o en cartón.

EN ALTERNATIVE: Model it in plasticine or cardboard.

MESA_CODE: 5

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-036

ES TÍTULO: Un código

EN TITLE: A code

ES RETO: Inventa una manera de escribir mensajes. Manda uno a alguien de confianza y dale la clave aparte.

EN CHALLENGE: Invent a way of writing messages. Send one to somebody you trust and give them the key separately.

ES NECESITAS: Papel

EN YOU NEED: Paper

ES OTRA OPCIÓN: Haz el código con colores en vez de con letras.

EN ALTERNATIVE: Make the code with colours instead of letters.

MESA_CODE: 5

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-037

ES TÍTULO: Cada vez con menos líneas

EN TITLE: Fewer lines each time

ES RETO: Coge un objeto de la mesa y dibújalo seis veces. Cada vez, con menos líneas que la anterior. La sexta puede ser una sola línea.

EN CHALLENGE: Take an object from the table and draw it six times. Each time with fewer lines than before. The sixth can be a single line.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Recórtalo en papel seis veces, cada vez más pequeño.

EN ALTERNATIVE: Cut it out of paper six times, smaller each time.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-038

ES TÍTULO: La mano que no usas

EN TITLE: The hand you do not use

ES RETO: Dibuja lo que quieras con la mano con la que no escribes. Sale distinto, y eso es el reto.

EN CHALLENGE: Draw whatever you like with the hand you do not write with. It comes out different, and that is the point.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Sujeta el lápiz con las dos manos a la vez: sale igual de torcido, que es de lo que va el reto.

EN ALTERNATIVE: Hold the pencil with both hands at once: it comes out just as wobbly, which is what the challenge is about.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-039

ES TÍTULO: Lo que hay dentro de la mancha

EN TITLE: What is inside the blot

ES RETO: Echa una mancha de color con mucha agua y espera a que seque. Mírala y dibuja encima solo lo que hayas encontrado dentro.

EN CHALLENGE: Put down a blot of colour with plenty of water and let it dry. Look at it and draw over it only what you found inside.

ES NECESITAS: Papel, agua y color

EN YOU NEED: Paper, water and colour

ES OTRA OPCIÓN: Usa una mancha de otro día, o una de la pared, del suelo o de una piedra.

EN ALTERNATIVE: Use a blot from another day, or one on a wall, a floor or a stone.

MESA_CODE: 0

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-040

ES TÍTULO: Diez títulos y ningún libro

EN TITLE: Ten titles and no books

ES RETO: Escribe diez títulos de libros que no existen. Solo los títulos: los libros no hay que escribirlos.

EN CHALLENGE: Write ten titles of books that do not exist. Titles only: the books do not have to be written.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Dilos en voz alta y grábalos con el móvil.

EN ALTERNATIVE: Say them out loud and record them on your phone.

MESA_CODE: 1

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-041

ES TÍTULO: Lo que había en la mesa

EN TITLE: What was on the table

ES RETO: Mira una mesa cualquiera durante un minuto. Tápala con un paño. Escribe todo lo que había.

EN CHALLENGE: Look at any table for a minute. Cover it with a cloth. Write down everything that was there.

ES NECESITAS: Un paño y algo para apuntar

EN YOU NEED: A cloth and something to note with

ES OTRA OPCIÓN: Dilo en voz alta, o hazle una foto antes y señala después.

EN ALTERNATIVE: Say it out loud, or photograph it first and point afterwards.

MESA_CODE: 1

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-042

ES TÍTULO: Una frase que crece

EN TITLE: A sentence that grows

ES RETO: Empieza con tres palabras. En la línea siguiente, las mismas más una. Sigue hasta que no te quepa en la hoja.

EN CHALLENGE: Start with three words. On the next line, the same plus one. Keep going until it will not fit on the page.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Hazlo hablando, con alguien que repita la frase entera cada vez.

EN ALTERNATIVE: Do it out loud, with someone repeating the whole sentence each time.

MESA_CODE: 1

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-043

ES TÍTULO: El hueco de debajo

EN TITLE: The gap underneath

ES RETO: Construye algo que sostenga un objeto por encima de la mesa, con el hueco vacío debajo. Que se pueda pasar la mano por ese hueco.

EN CHALLENGE: Build something that holds an object above the table, with an empty gap underneath. Your hand has to fit through the gap.

ES NECESITAS: Papel, cartón, cinta

EN YOU NEED: Paper, card, tape

ES OTRA OPCIÓN: Usa cartón de una caja, que se dobla solo y aguanta más.

EN ALTERNATIVE: Use card from a box: it folds by itself and holds more.

MESA_CODE: 2

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-044

ES TÍTULO: La torre de una mano

EN TITLE: The one-handed tower

ES RETO: Construye lo más alto que puedas usando una sola mano. La otra se queda quieta.

EN CHALLENGE: Build as high as you can using one hand only. The other stays still.

ES NECESITAS: Lo que tengas alrededor

EN YOU NEED: Whatever is around you

ES OTRA OPCIÓN: Construye en el suelo, con las piezas alrededor y sin tener que estirarte.

EN ALTERNATIVE: Build on the floor, with the pieces around you and no need to stretch.

MESA_CODE: 2

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-045

ES TÍTULO: Un refugio para una cosa pequeña

EN TITLE: A shelter for one small thing

ES RETO: Elige un objeto pequeño. Mídelo. Hazle un refugio a su medida, con una puerta por donde entre y salga.

EN CHALLENGE: Pick a small object. Measure it. Make it a shelter to its size, with a door it can go in and out of.

ES NECESITAS: Cartón, tijeras, regla

EN YOU NEED: Card, scissors, ruler

ES OTRA OPCIÓN: Dile las medidas a alguien y que te corte las piezas; el montaje es tuyo.

EN ALTERNATIVE: Give someone the measurements and let them cut the pieces; the building is yours.

MESA_CODE: 2

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-046

ES TÍTULO: El sonido más bajo

EN TITLE: The quietest sound

ES RETO: Quédate quieto y busca el sonido más bajo que puedas oír ahora mismo. Ponle nombre.

EN CHALLENGE: Stay still and look for the quietest sound you can hear right now. Give it a name.

ES NECESITAS: Nada

EN YOU NEED: Nothing

ES OTRA OPCIÓN: Apoya la mano en la mesa y busca la vibración más pequeña que notes. Es el mismo reto sin sonido.

EN ALTERNATIVE: Rest your hand on the table and look for the smallest vibration you can feel. Same challenge without sound.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-047

ES TÍTULO: El ritmo de doce pasos

EN TITLE: The twelve-step rhythm

ES RETO: Camina doce pasos marcando un ritmo con los pies. Hazlo tres veces igual. A la cuarta, cámbialo.

EN CHALLENGE: Walk twelve steps marking a rhythm with your feet. Do it the same three times. On the fourth, change it.

ES NECESITAS: Nada

EN YOU NEED: Nothing

ES OTRA OPCIÓN: Hazlo con la mano en la mesa, sentado.

EN ALTERNATIVE: Do it with your hand on the table, sitting down.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-048

ES TÍTULO: Tres sonidos con un vaso

EN TITLE: Three sounds with a glass

ES RETO: Un vaso, una cuchara y algo que suene dentro: arroz, monedas, agua. Consigue tres sonidos distintos.

EN CHALLENGE: A glass, a spoon and something that rattles inside: rice, coins, water. Get three different sounds.

ES NECESITAS: Un vaso y una cuchara

EN YOU NEED: A glass and a spoon

ES OTRA OPCIÓN: Hazlos con la boca, sin coger nada.

EN ALTERNATIVE: Make them with your mouth, picking nothing up.

MESA_CODE: 3

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-049

ES TÍTULO: Del revés

EN TITLE: Upside down

ES RETO: Coge una foto o un dibujo y ponlo boca abajo. Mira qué ves ahora que antes no veías.

EN CHALLENGE: Take a photo or a drawing and turn it upside down. Look at what you see now that you did not see before.

ES NECESITAS: Una foto o un dibujo

EN YOU NEED: A photo or a drawing

ES OTRA OPCIÓN: Gira el móvil con la foto en pantalla.

EN ALTERNATIVE: Turn your phone round with the photo on screen.

MESA_CODE: 4

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-050

ES TÍTULO: Lo que cabe en el agujero

EN TITLE: What fits in the hole

ES RETO: Hazle un agujero pequeño a un papel. Mira por él y quédate solo con lo que cabe dentro.

EN CHALLENGE: Make a small hole in a piece of paper. Look through it and keep only what fits inside.

ES NECESITAS: Un papel

EN YOU NEED: A piece of paper

ES OTRA OPCIÓN: Haz el hueco con los dedos, sin recortar nada.

EN ALTERNATIVE: Make the gap with your fingers, cutting nothing.

MESA_CODE: 4

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-051

ES TÍTULO: Lo más pequeño que veas

EN TITLE: The smallest thing in sight

ES RETO: Busca la cosa más pequeña que tengas a la vista. Mírala un rato largo y apunta tres cosas que no habías visto.

EN CHALLENGE: Find the smallest thing you can see. Look at it for a good while and note three things you had not seen.

ES NECESITAS: Algo para apuntar

EN YOU NEED: Something to note with

ES OTRA OPCIÓN: Hazle una foto de cerca y míralas en la pantalla.

EN ALTERNATIVE: Take a close photo and look at them on the screen.

MESA_CODE: 4

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-052

ES TÍTULO: El segundo uso

EN TITLE: The second use

ES RETO: Coge lo primero que tengas delante. Invéntale un segundo uso que no tenga nada que ver con el primero.

EN CHALLENGE: Take the first thing in front of you. Invent a second use for it, with nothing to do with the first.

ES NECESITAS: Nada

EN YOU NEED: Nothing

ES OTRA OPCIÓN: Dilo en voz alta y que alguien lo apunte.

EN ALTERNATIVE: Say it out loud and let someone write it down.

MESA_CODE: 5

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-053

ES TÍTULO: Una regla nueva

EN TITLE: One new rule

ES RETO: Elige un juego que ya conozcas. Cámbiale una regla, solo una. Juega una partida con la regla nueva.

EN CHALLENGE: Pick a game you already know. Change one rule, only one. Play a round with the new rule.

ES NECESITAS: Un juego que ya tengas

EN YOU NEED: A game you already have

ES OTRA OPCIÓN: Cambia la regla de un juego de cartas, que se explica en una frase.

EN ALTERNATIVE: Change the rule of a card game: it takes one sentence to explain.

MESA_CODE: 5

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-054

ES TÍTULO: El animal que falta

EN TITLE: The missing animal

ES RETO: Invéntate un animal que viva en una biblioteca. Decide qué come, dónde duerme y de qué se esconde.

EN CHALLENGE: Invent an animal that lives in a library. Decide what it eats, where it sleeps and what it hides from.

ES NECESITAS: Nada

EN YOU NEED: Nothing

ES OTRA OPCIÓN: Cuéntalo, dibújalo o constrúyelo, como te salga mejor.

EN ALTERNATIVE: Tell it, draw it or build it, whichever works better for you.

MESA_CODE: 5

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-055

ES TÍTULO: El cuaderno de una sola cosa

EN TITLE: The one-thing notebook

ES RETO: Elige una cosa que puedas dibujar durante varios días: una planta, una taza, tu propia mano. Dibújala una vez al día durante cinco días, en la misma hoja.

EN CHALLENGE: Pick one thing you can draw over several days: a plant, a mug, your own hand. Draw it once a day for five days, on the same sheet.

ES NECESITAS: Una hoja grande y lápiz

EN YOU NEED: A large sheet and a pencil

ES OTRA OPCIÓN: Hazle una foto al día y ponlas juntas al final.

EN ALTERNATIVE: Take one photo a day and put them side by side at the end.

MESA_CODE: 0

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-056

ES TÍTULO: Cien palabras y ni una más

EN TITLE: A hundred words and not one more

ES RETO: Cuenta algo que te pasó en exactamente cien palabras. Ni noventa y nueve ni ciento una. Lo difícil es lo que hay que quitar.

EN CHALLENGE: Tell something that happened to you in exactly a hundred words. Not ninety-nine, not a hundred and one. The hard part is what has to go.

ES NECESITAS: Papel y lápiz, o el móvil

EN YOU NEED: Paper and pencil, or your phone

ES OTRA OPCIÓN: Cuéntalo en voz alta y que alguien vaya contando las palabras contigo.

EN ALTERNATIVE: Tell it out loud and let somebody count the words along with you.

MESA_CODE: 1

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-057

ES TÍTULO: El mismo minuto, cinco días

EN TITLE: The same minute, five days

ES RETO: Graba un minuto de sonido a la misma hora durante cinco días, en el mismo sitio. Escúchalos seguidos al final y apunta qué cambia.

EN CHALLENGE: Record one minute of sound at the same time for five days, in the same place. Listen to them one after another at the end and note what changes.

ES NECESITAS: Algo que grabe

EN YOU NEED: Something that records

ES OTRA OPCIÓN: Apunta en un papel lo que oyes cada día, sin grabar nada, y compara las cinco listas.

EN ALTERNATIVE: Write down what you hear each day, with no recording, and compare the five lists.

MESA_CODE: 3

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-058

ES TÍTULO: Un idioma de diez palabras

EN TITLE: A ten-word language

ES RETO: Invéntate un idioma que solo tenga diez palabras. Decide cuáles son y escribe tres frases con ellas. Lo interesante es qué no se puede decir.

EN CHALLENGE: Invent a language with only ten words. Decide which ten and write three sentences with them. The interesting part is what cannot be said.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Que sean diez gestos en vez de diez palabras.

EN ALTERNATIVE: Make them ten gestures instead of ten words.

MESA_CODE: 5

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-059

ES TÍTULO: El objeto de espaldas

EN TITLE: The object from behind

ES RETO: Elige algo que tengas delante y dibújalo por detrás, como si lo hubieras girado. No lo gires.

EN CHALLENGE: Pick something in front of you and draw its back, as if you had turned it round. Do not turn it.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Gíralo al terminar y compara.

EN ALTERNATIVE: Turn it round at the end and compare.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-060

ES TÍTULO: Una hoja, cuarenta trozos

EN TITLE: One sheet, forty pieces

ES RETO: Dobla un folio hasta hacer cuarenta casillas. Dibuja algo distinto en cada una. Pueden ser rayas.

EN CHALLENGE: Fold a sheet into forty squares. Draw something different in each one. Lines count.

ES NECESITAS: Un folio

EN YOU NEED: One sheet

ES OTRA OPCIÓN: Rellena solo las casillas de los bordes.

EN ALTERNATIVE: Fill only the squares along the edges.

MESA_CODE: 0

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-061

ES TÍTULO: Con la hoja de pie

EN TITLE: With the sheet upright

ES RETO: Pega el papel en la pared y dibuja de pie. El brazo entero se mueve distinto que la muñeca.

EN CHALLENGE: Tape the paper to the wall and draw standing up. The whole arm moves differently from the wrist.

ES NECESITAS: Papel, cinta y pared

EN YOU NEED: Paper, tape and a wall

ES OTRA OPCIÓN: Dibuja con el papel en el suelo, agachado.

EN ALTERNATIVE: Draw with the paper on the floor, crouching.

MESA_CODE: 0

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-062

ES TÍTULO: El final primero

EN TITLE: The ending first

ES RETO: Escribe la última frase de una historia. Después escribe las tres que van justo antes.

EN CHALLENGE: Write the last sentence of a story. Then write the three that come just before it.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Dale la última frase a alguien y que escriba él las tres.

EN ALTERNATIVE: Give the last sentence to someone else and let them write the three.

MESA_CODE: 1

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-063

ES TÍTULO: El manual de algo que ya sabes

EN TITLE: A manual for something you already know

ES RETO: Escribe las instrucciones de algo que haces sin pensar: atarte los cordones, hacerte un bocadillo, encender la consola. Paso a paso, sin saltarte ninguno.

EN CHALLENGE: Write the instructions for something you do without thinking: tying your laces, making a sandwich, switching on the console. Step by step, skipping none.

ES NECESITAS: Papel o móvil

EN YOU NEED: Paper or phone

ES OTRA OPCIÓN: Dáselas a alguien y que las siga al pie de la letra.

EN ALTERNATIVE: Give them to someone and have them follow every word.

MESA_CODE: 1

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-064

ES TÍTULO: Que ruede

EN TITLE: Make it roll

ES RETO: Haz algo que ruede desde la punta de un libro hasta el suelo sin caerse por el camino.

EN CHALLENGE: Build something that rolls from the edge of a book to the floor without falling over on the way.

ES NECESITAS: Cartón, tapones, cinta

EN YOU NEED: Cardboard, bottle caps, tape

ES OTRA OPCIÓN: Que ruede lo más despacio posible.

EN ALTERNATIVE: Make it roll as slowly as possible.

MESA_CODE: 2

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-065

ES TÍTULO: La casa de una cuchara

EN TITLE: A house for a spoon

ES RETO: Construye una casa para una cuchara. Con puerta, con ventana y con sitio para dormir.

EN CHALLENGE: Build a house for a spoon. With a door, a window and somewhere to sleep.

ES NECESITAS: Cajas y cinta

EN YOU NEED: Boxes and tape

ES OTRA OPCIÓN: Hazla para dos cucharas que no se hablan.

EN ALTERNATIVE: Build it for two spoons that are not speaking.

MESA_CODE: 2

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-066

ES TÍTULO: Lo mismo, tres veces mejor

EN TITLE: The same thing, three times better

ES RETO: Construye algo sencillo. Deshazlo y vuelve a hacerlo. Y otra vez. Guarda las tres versiones juntas.

EN CHALLENGE: Build something simple. Take it apart and build it again. And again. Keep the three versions together.

ES NECESITAS: Lo que tengas

EN YOU NEED: Whatever you have

ES OTRA OPCIÓN: Que la tercera use la mitad de material que la primera.

EN ALTERNATIVE: Make the third one use half the material of the first.

MESA_CODE: 2

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-067

ES TÍTULO: El mismo sitio con los ojos cerrados

EN TITLE: The same place with your eyes closed

ES RETO: Siéntate donde estés y cierra los ojos dos minutos. Después escribe todo lo que has oído, por orden de cerca a lejos.

EN CHALLENGE: Sit where you are and close your eyes for two minutes. Then write everything you heard, from nearest to furthest.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Repítelo en el mismo sitio a otra hora.

EN ALTERNATIVE: Repeat it in the same place at another time of day.

MESA_CODE: 3

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-068

ES TÍTULO: Una escalera con una sola cosa

EN TITLE: A ladder from a single thing

ES RETO: Coge un objeto y saca de él cinco sonidos distintos, del más grave al más agudo. Grábalos en ese orden.

EN CHALLENGE: Take one object and get five different sounds out of it, from lowest to highest. Record them in that order.

ES NECESITAS: Un objeto y el móvil

EN YOU NEED: An object and your phone

ES OTRA OPCIÓN: Que los cinco salgan de un vaso con agua, cambiando el nivel.

EN ALTERNATIVE: Get all five from a glass of water, changing the level.

MESA_CODE: 3

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-069

ES TÍTULO: Diez veces la misma esquina

EN TITLE: Ten times the same corner

ES RETO: Elige una esquina de tu casa y hazle diez fotos sin moverte del sitio. Cambia solo hacia dónde miras.

EN CHALLENGE: Pick a corner of your home and take ten photos without moving from the spot. Change only where you point.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Hazlas todas a la altura del suelo.

EN ALTERNATIVE: Take them all at floor level.

MESA_CODE: 4

DURATION_CODE: 0

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-070

ES TÍTULO: El catálogo de las manos

EN TITLE: A catalogue of hands

ES RETO: Fotografía diez manos haciendo diez cosas distintas. Valen las tuyas.

EN CHALLENGE: Photograph ten hands doing ten different things. Your own count.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Que en ninguna se vea la cara de nadie.

EN ALTERNATIVE: Make sure no face appears in any of them.

MESA_CODE: 4

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-071

ES TÍTULO: Lo que cambia sin que se note

EN TITLE: What changes without showing

ES RETO: Elige algo que tarde días en cambiar: una planta, una obra en la calle, la luz de una ventana. Hazle una foto al día durante una semana.

EN CHALLENGE: Pick something that takes days to change: a plant, roadworks, the light in a window. Take one photo a day for a week.

ES NECESITAS: Móvil

EN YOU NEED: Phone

ES OTRA OPCIÓN: Ponlas después una al lado de otra.

EN ALTERNATIVE: Put them side by side afterwards.

MESA_CODE: 4

DURATION_CODE: 2

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-CHALLENGE-072

ES TÍTULO: El museo de una cosa

EN TITLE: A museum of one thing

ES RETO: Inventa un museo entero dedicado a un solo objeto corriente. Escribe los nombres de sus cinco salas.

EN CHALLENGE: Invent a whole museum devoted to one ordinary object. Write the names of its five rooms.

ES NECESITAS: Papel y lápiz

EN YOU NEED: Paper and pencil

ES OTRA OPCIÓN: Dibuja el plano y pon dónde está la salida.

EN ALTERNATIVE: Draw the floor plan and mark the way out.

MESA_CODE: 5

DURATION_CODE: 1

ES RUTA BASE: /es/taller/

EN BASE PATH: /en/workshop/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## QA · TALLER / WORKSHOP · RETOS

- SOURCE_RECORDS: 72/72
- ES_COMPLETE: 72/72
- EN_COMPLETE: 72/72
- BILINGUAL_COMPLETE: 72/72
- RAW_CODES_PRESERVED: 72/72
- STATUS: PASS

SIGUIENTE FASE: catálogo de páginas de Taller / Workshop y Recursos / Resources.

# 69. RECURSOS / RESOURCES · CATÁLOGO DE PORTADA

FUENTE ES: `es/recursos/index.html` · SHA `1504f9a74ca20d7df3f69c89fd6f67141b29dcbe`.

FUENTE EN: `en/resources/index.html` · SHA `cd8ad128991180eda11a36bdfa9c96183d7562ff`.

ES REGLA: Se registran las herramientas y etapas visibles de la portada. Un elemento «Próximamente» se conserva como tal y no se trata como herramienta disponible.

EN RULE: Visible tools and life-stage navigation from the index are recorded. A «Coming soon» item remains marked as such and is not treated as an available tool.

## WEB-RESOURCE-001

ES TÍTULO: Juegos

EN TITLE: Games

ES DESCRIPCIÓN: 297 juegos prácticos para situaciones cotidianas, sin tiempo ni puntuación.

EN DESCRIPTION: 297 practical games for everyday situations, with no timer or score.

ES RUTA: /es/recursos/juegos/

EN PATH: /en/resources/games/

ES ESTADO: AVAILABLE

EN STATUS: AVAILABLE

ORIGEN: SOURCE_DERIVED

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-002

ES TÍTULO: Rutinas visuales

EN TITLE: Visual routines

ES DESCRIPCIÓN: Usa una rutina preparada o construye la tuya para pantalla, A4, tira o Primero → Después.

EN DESCRIPTION: Use a ready-made routine or build your own for screen, A4, strip or First → Then.

ES RUTA: /es/recursos/rutinas-visuales/

EN PATH: /en/resources/visual-routines/

ES ESTADO: AVAILABLE

EN STATUS: AVAILABLE

ORIGEN: SOURCE_DERIVED

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-003

ES TÍTULO: Rutinas imprimibles

EN TITLE: Printable routines

ES DESCRIPCIÓN: Hojas A4 listas para imprimir: 109 rutinas, tarjetas para recortar, tableros y packs.

EN DESCRIPTION: A4 sheets ready to print: 109 routines, cards to cut out, boards and packs.

ES RUTA: /es/recursos/rutinas-imprimibles/

EN PATH: /en/resources/printable-routines/

ES ESTADO: AVAILABLE

EN STATUS: AVAILABLE

ORIGEN: SOURCE_DERIVED

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-004

ES TÍTULO: Tarjeta Iris

EN TITLE: Iris Card

ES DESCRIPCIÓN: Prepara un mensaje claro y enséñalo cuando necesites comunicar algo.

EN DESCRIPTION: Prepare a clear message to show when you need to communicate something.

ES RUTA: /es/recursos/tarjeta-iris/

EN PATH: /en/resources/iris-card/

ES ESTADO: AVAILABLE

EN STATUS: AVAILABLE

ORIGEN: SOURCE_DERIVED

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-005

ES TÍTULO: Descargas visuales

EN TITLE: Visual downloads

ES DESCRIPCIÓN: Más materiales visuales gratuitos se añadirán aquí.

EN DESCRIPTION: More free visual materials will be added here.

ES RUTA: —

EN PATH: —

ES ESTADO: Próximamente

EN STATUS: Coming soon

ORIGEN: SOURCE_DERIVED

ESTADO BIBLIOTECA: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-STAGE-001

ES ETAPA: Infancia

EN STAGE: Childhood

ES DESCRIPCIÓN: Apoyos visuales y actividades cotidianas con instrucciones directas y espacio para practicar a tu ritmo.

EN DESCRIPTION: Visual supports and everyday activities with direct instructions and room to practise at your own pace.

ES ENLACES: Juegos → /es/recursos/juegos/#etapa-inf | Rutinas → /es/recursos/rutinas-imprimibles/#etapa-inf

EN LINKS: Games → /en/resources/games/#etapa-inf | Routines → /en/resources/printable-routines/#etapa-inf

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-STAGE-002

ES ETAPA: Adolescencia

EN STAGE: Adolescence

ES DESCRIPCIÓN: Organización, estudio, cambios de actividad, transporte, autocuidado y situaciones con más autonomía.

EN DESCRIPTION: Organisation, study, transitions, transport, personal care and situations with growing independence.

ES ENLACES: Juegos → /es/recursos/juegos/#etapa-ado | Rutinas → /es/recursos/rutinas-imprimibles/#etapa-ado

EN LINKS: Games → /en/resources/games/#etapa-ado | Routines → /en/resources/printable-routines/#etapa-ado

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-STAGE-003

ES ETAPA: Adultez

EN STAGE: Adulthood

ES DESCRIPCIÓN: Planificación, trabajo, hogar, compras, citas, transporte, descanso y otras tareas de la vida diaria.

EN DESCRIPTION: Planning, work, home, shopping, appointments, transport, rest and other everyday tasks.

ES ENLACES: Juegos → /es/recursos/juegos/#etapa-adu | Rutinas → /es/recursos/rutinas-imprimibles/#etapa-adu

EN LINKS: Games → /en/resources/games/#etapa-adu | Routines → /en/resources/printable-routines/#etapa-adu

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-RESOURCE-STAGE-004

ES ETAPA: Cualquier edad

EN STAGE: Any age

ES DESCRIPCIÓN: Recursos transversales que pueden servir en distintas etapas sin pedir edad, diagnóstico ni perfil.

EN DESCRIPTION: Cross-stage resources that may be useful at different points in life, without asking for age, diagnosis or a profile.

ES ENLACES: Juegos → /es/recursos/juegos/#etapa-todas | Rutinas → /es/recursos/rutinas-imprimibles/#etapa-todas

EN LINKS: Games → /en/resources/games/#etapa-todas | Routines → /en/resources/printable-routines/#etapa-todas

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## QA · RECURSOS / RESOURCES

- PRIMARY_RESOURCE_CARDS_ES_EN: 5/5
- AVAILABLE_PRIMARY_TOOLS: 4
- COMING_SOON_ITEMS: 1
- LIFE_STAGE_NAVIGATION: 4/4
- BILINGUAL_COMPLETE: PASS
- STATUS: PASS

---

# 70. TALLER / WORKSHOP · CATÁLOGO DE 27 ESTUDIOS

FUENTE ES: `es/taller/index.html` · SHA `502ffb2593f35cd7a629c24b33811fc658a0e6dd`.

FUENTE EN: `en/workshop/index.html` · SHA `dc8e0eb2151247fc67595717423f34ae80c68db3`.

ES REGLA: Los estudios se emparejan por `data-studio`, no por similitud del título. Se conservan perfil, audiencia, sensibilidad y modo de descubrimiento declarados en la portada.

EN RULE: Studios are paired by `data-studio`, not by title similarity. Declared profile, audience, sensitivity and discovery mode are preserved.

## WEB-WORKSHOP-STUDIO-001

STUDIO_ID: programacion

ES NOMBRE: Programación

EN NAME: Coding

ES DESCRIPCIÓN: Bloques, JavaScript y Python

EN DESCRIPTION: Blocks, JavaScript and Python

PROFILE_ID: codigo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/programacion/

EN PATH: /en/workshop/coding/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-002

STUDIO_ID: estructuras

ES NOMBRE: Estructuras y puentes

EN NAME: Structures and bridges

ES DESCRIPCIÓN: Puentes y grúas con cálculo y física

EN DESCRIPTION: Bridges and cranes with forces and physics

PROFILE_ID: construir

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/estructuras/

EN PATH: /en/workshop/structures/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-003

STUDIO_ID: ritmo

ES NOMBRE: Ritmo y secuenciador

EN NAME: Rhythm and sequencer

ES DESCRIPCIÓN: Batería y pistas; WAV y MIDI

EN DESCRIPTION: Drums and tracks; WAV and MIDI

PROFILE_ID: tiempo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/ritmo/

EN PATH: /en/workshop/rhythm-sequencer/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-004

STUDIO_ID: pixel-art

ES NOMBRE: Pixel art

EN NAME: Pixel art

ES DESCRIPCIÓN: Paletas, fotogramas, mosaico y GIF

EN DESCRIPTION: Palettes, frames, tiling and GIF

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/pixel-art/

EN PATH: /en/workshop/pixel-art/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-005

STUDIO_ID: robotica

ES NOMBRE: Robótica

EN NAME: Robotics

ES DESCRIPCIÓN: Un robot con sensores y su gemelo digital

EN DESCRIPTION: A robot with sensors and its digital twin

PROFILE_ID: codigo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/robotica/

EN PATH: /en/workshop/robotics/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-006

STUDIO_ID: videomapping

ES NOMBRE: Videomapping

EN NAME: Projection mapping

ES DESCRIPCIÓN: Luz que encaja en objetos reales

EN DESCRIPTION: Light that fits real objects

PROFILE_ID: tiempo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/videomapping/

EN PATH: /en/workshop/projection-mapping/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-007

STUDIO_ID: videojuegos

ES NOMBRE: Diseño de videojuegos

EN NAME: Video game design

ES DESCRIPCIÓN: Niveles con física; exporta tu juego

EN DESCRIPTION: Levels with physics; export your game

PROFILE_ID: codigo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/videojuegos/

EN PATH: /en/workshop/video-game-design/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-008

STUDIO_ID: modelado-3d

ES NOMBRE: Modelado 3D

EN NAME: 3D modelling

ES DESCRIPCIÓN: Sólidos y huecos en milímetros; STL para imprimir

EN DESCRIPTION: Solids and holes in millimetres; STL to print

PROFILE_ID: construir

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/modelado-3d/

EN PATH: /en/workshop/3d-modelling/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-009

STUDIO_ID: sintesis-sonido

ES NOMBRE: Síntesis y paisajes sonoros

EN NAME: Synthesis and soundscapes

ES DESCRIPCIÓN: Osciladores, envolventes y efectos

EN DESCRIPTION: Oscillators, envelopes and effects

PROFILE_ID: tiempo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/sintesis-sonido/

EN PATH: /en/workshop/synthesis-soundscapes/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-010

STUDIO_ID: arquitectura

ES NOMBRE: Arquitectura y planos

EN NAME: Architecture and plans

ES DESCRIPCIÓN: Planta y 3D a la vez, con paseo

EN DESCRIPTION: Plan and 3D together, with a walk-through

PROFILE_ID: construir

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/arquitectura/

EN PATH: /en/workshop/architecture-plans/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-011

STUDIO_ID: diseno-grafico

ES NOMBRE: Diseño gráfico

EN NAME: Graphic design

ES DESCRIPCIÓN: Carteles y publicaciones con revisión de contraste

EN DESCRIPTION: Posters and posts with a contrast check

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/diseno-grafico/

EN PATH: /en/workshop/graphic-design/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-012

STUDIO_ID: composicion

ES NOMBRE: Composición

EN NAME: Composition

ES DESCRIPCIÓN: Piano roll con acordes e instrumentos

EN DESCRIPTION: Piano roll with chords and instruments

PROFILE_ID: tiempo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/composicion/

EN PATH: /en/workshop/composition/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-013

STUDIO_ID: dibujo

ES NOMBRE: Dibujo

EN NAME: Drawing

ES DESCRIPCIÓN: Capas, pinceles, simetría y perspectiva

EN DESCRIPTION: Layers, brushes, symmetry and perspective

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/dibujo/

EN PATH: /en/workshop/drawing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-014

STUDIO_ID: comic

ES NOMBRE: Cómic y guion gráfico

EN NAME: Comics and storyboards

ES DESCRIPCIÓN: Viñetas, bocadillos y páginas

EN DESCRIPTION: Panels, balloons and pages

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/comic/

EN PATH: /en/workshop/comics-storyboarding/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-015

STUDIO_ID: color

ES NOMBRE: Color

EN NAME: Colour

ES DESCRIPCIÓN: Rueda, mezclas, contraste y paletas

EN DESCRIPTION: Wheel, mixes, contrast and palettes

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/color/

EN PATH: /en/workshop/colour/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-016

STUDIO_ID: patrones

ES NOMBRE: Patrones y arte generativo

EN NAME: Patterns and generative art

ES DESCRIPCIÓN: Repeticiones, simetrías y teselados

EN DESCRIPTION: Repetition, symmetry and tessellation

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/patrones/

EN PATH: /en/workshop/patterns-generative-art/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-017

STUDIO_ID: fotografia

ES NOMBRE: Fotografía y composición

EN NAME: Photography and composition

ES DESCRIPCIÓN: Encuadre y luz con tus fotos, sin subirlas

EN DESCRIPTION: Framing and light with your photos, never uploaded

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/fotografia/

EN PATH: /en/workshop/photography-composition/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-018

STUDIO_ID: moda-textil

ES NOMBRE: Moda y textil

EN NAME: Fashion and textiles

ES DESCRIPCIÓN: Patrones, tejidos y estampados

EN DESCRIPTION: Patterns, fabrics and prints

PROFILE_ID: lienzo

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/moda-textil/

EN PATH: /en/workshop/fashion-textiles/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-019

STUDIO_ID: maquinas

ES NOMBRE: Máquinas e inventos

EN NAME: Machines and inventions

ES DESCRIPCIÓN: Engranajes, palancas, poleas y rampas

EN DESCRIPTION: Gears, levers, pulleys and ramps

PROFILE_ID: construir

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/maquinas/

EN PATH: /en/workshop/machines/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-020

STUDIO_ID: circuitos

ES NOMBRE: Circuitos

EN NAME: Circuits

ES DESCRIPCIÓN: Pilas, luces, interruptores y puertas lógicas

EN DESCRIPTION: Batteries, lights, switches and logic gates

PROFILE_ID: construir

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/circuitos/

EN PATH: /en/workshop/circuits/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-021

STUDIO_ID: papiroflexia

ES NOMBRE: Papiroflexia y poliedros

EN NAME: Origami and polyhedra

ES DESCRIPCIÓN: Pliegues y sólidos que se despliegan

EN DESCRIPTION: Folds and solids that unfold

PROFILE_ID: construir

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/papiroflexia/

EN PATH: /en/workshop/origami-polyhedra/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-022

STUDIO_ID: simulaciones

ES NOMBRE: Simulaciones

EN NAME: Simulations

ES DESCRIPCIÓN: Ecosistemas, tráfico y autómatas

EN DESCRIPTION: Ecosystems, traffic and automata

PROFILE_ID: construir

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/simulaciones/

EN PATH: /en/workshop/simulations/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-023

STUDIO_ID: escritura-restricciones

ES NOMBRE: Escritura con restricciones

EN NAME: Constraint writing

ES DESCRIPCIÓN: Sin una letra, palabras contadas, formas poéticas

EN DESCRIPTION: Missing letters, counted words, poetic forms

PROFILE_ID: documento

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/escritura-restricciones/

EN PATH: /en/workshop/constraint-writing/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-024

STUDIO_ID: mundos

ES NOMBRE: Mundos

EN NAME: Worlds

ES DESCRIPCIÓN: Mapas, especies, historia y personajes

EN DESCRIPTION: Maps, species, history and characters

PROFILE_ID: documento

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/mundos/

EN PATH: /en/workshop/worlds/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-025

STUDIO_ID: lenguas-inventadas

ES NOMBRE: Lenguas inventadas

EN NAME: Invented languages

ES DESCRIPCIÓN: Sonidos, alfabeto, gramática y diccionario

EN DESCRIPTION: Sounds, alphabet, grammar and dictionary

PROFILE_ID: documento

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/lenguas-inventadas/

EN PATH: /en/workshop/invented-languages/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-026

STUDIO_ID: juegos-de-mesa

ES NOMBRE: Juegos de mesa

EN NAME: Board games

ES DESCRIPCIÓN: Tablero, cartas y reglas para imprimir

EN DESCRIPTION: Board, cards and printable rules

PROFILE_ID: documento

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/juegos-de-mesa/

EN PATH: /en/workshop/board-games/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-STUDIO-027

STUDIO_ID: ideas

ES NOMBRE: Ideas e inventos

EN NAME: Ideas and inventions

ES DESCRIPCIÓN: Laboratorio de ideas y SCAMPER

EN DESCRIPTION: Idea lab and SCAMPER

PROFILE_ID: documento

AUDIENCE: ALL_AGES

SENSITIVITY: S0_GENERAL

DISCOVERY: NORMAL

ES RUTA: /es/taller/ideas/

EN PATH: /en/workshop/ideas/

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

# 71. TALLER / WORKSHOP · CINCO FORMAS DE TRABAJAR

## WEB-WORKSHOP-PROFILE-01

PROFILE_ID: lienzo

ES NOMBRE: Lienzo creativo

EN NAME: Creative canvas

ES DESCRIPCIÓN: Dibujar, componer y diseñar imágenes.

EN DESCRIPTION: Draw, compose and design images.

ES CONTEO DECLARADO: 8 estudios

EN DECLARED COUNT: 8 studios

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-PROFILE-02

PROFILE_ID: construir

ES NOMBRE: Construir y probar

EN NAME: Build and test

ES DESCRIPCIÓN: Montar algo y comprobar si funciona.

EN DESCRIPTION: Build something and test whether it works.

ES CONTEO DECLARADO: 7 estudios

EN DECLARED COUNT: 7 studios

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-PROFILE-03

PROFILE_ID: tiempo

ES NOMBRE: Línea de tiempo

EN NAME: Timeline

ES DESCRIPCIÓN: Música, sonido y luz que cambian con el tiempo.

EN DESCRIPTION: Music, sound and light that change over time.

ES CONTEO DECLARADO: 4 estudios

EN DECLARED COUNT: 4 studios

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-PROFILE-04

PROFILE_ID: codigo

ES NOMBRE: Código y bloques

EN NAME: Code and blocks

ES DESCRIPCIÓN: Programar con bloques o con código real.

EN DESCRIPTION: Program with blocks or real code.

ES CONTEO DECLARADO: 3 estudios

EN DECLARED COUNT: 3 studios

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-WORKSHOP-PROFILE-05

PROFILE_ID: documento

ES NOMBRE: Documento y conocimiento

EN NAME: Documents and knowledge

ES DESCRIPCIÓN: Escribir, inventar mundos, lenguas y juegos.

EN DESCRIPTION: Write and invent worlds, languages and games.

ES CONTEO DECLARADO: 5 estudios

EN DECLARED COUNT: 5 studios

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## QA · TALLER / WORKSHOP · CATÁLOGO

- UNIQUE_STUDIO_IDS_ES: 27/27
- UNIQUE_STUDIO_IDS_EN: 27/27
- ES_EN_STUDIO_PAIRING_BY_ID: 27/27
- PROFILE_RECORDS_ES_EN: 5/5
- SOURCE_AUDIENCE_PRESERVED: 27/27
- SOURCE_SENSITIVITY_PRESERVED: 27/27
- SOURCE_DISCOVERY_PRESERVED: 27/27
- STATUS: PASS

SIGUIENTE FASE: páginas individuales de Recursos y corpus de Juegos / rutinas.

# 72. RECURSOS · JUEGOS / GAMES · CATÁLOGO ESTRUCTURADO

FUENTE: `assets/data/r42-games-metadata.json` · SHA `6138bb2bc2002cde9e6d52738032f3055557ff30`.

SOURCE DATASET: `assets/data/juegos-iris-data.js` · blob `f6bf0808401031a5178db8835f1bc668af63036c`.

ES REGLA: Se conservan los metadatos declarados. No se inventan rutas públicas por juego cuando el metadata no las declara.

EN RULE: Declared metadata is preserved. Public per-game routes are not invented when the metadata does not declare them.

## WEB-GAME-001

GAME_ID: los-cordones

ES TÍTULO: Los cordones, paso a paso

EN TITLE: Shoelaces, step by step

ES DESCRIPCIÓN: Pon en orden los pasos para atarte los cordones.

EN DESCRIPTION: Put the steps for tying your laces in order.

STAGES: inf · ado

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-002

GAME_ID: ordena-la-ducha

ES TÍTULO: Ordena la ducha

EN TITLE: Put the shower in order

ES DESCRIPCIÓN: Coloca los pasos de la ducha, del primero al último.

EN DESCRIPTION: Place the shower steps, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-003

GAME_ID: que-falta-dientes

ES TÍTULO: ¿Qué falta para lavarse los dientes?

EN TITLE: What is missing to brush your teeth?

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: inf

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-004

GAME_ID: que-viene-manana

ES TÍTULO: ¿Qué viene ahora? · mañana

EN TITLE: What comes next? · morning

ES DESCRIPCIÓN: La mañana ya ha empezado. Elige lo que va después.

EN DESCRIPTION: The morning has started. Choose what comes next.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-005

GAME_ID: prepara-tu-mochila

ES TÍTULO: Prepara tu mochila

EN TITLE: Pack your backpack

ES DESCRIPCIÓN: Mete en la mochila lo que hace falta hoy.

EN DESCRIPTION: Put what you need today in your backpack.

STAGES: inf · ado

CONTEXT: manana

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-006

GAME_ID: vistete-lluvia

ES TÍTULO: Vístete para la lluvia

EN TITLE: Dress for the rain

ES DESCRIPCIÓN: Hoy llueve. Elige ropa que te proteja.

EN DESCRIPTION: It is raining. Choose clothes that protect you.

STAGES: inf

CONTEXT: vestirse

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-007

GAME_ID: objeto-accion

ES TÍTULO: Objeto y acción

EN TITLE: Object and action

ES DESCRIPCIÓN: Une cada objeto con lo que haces con él.

EN DESCRIPTION: Match each object with what you do with it.

STAGES: inf

CONTEXT: higiene

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-008

GAME_ID: antes-y-despues-de-comer

ES TÍTULO: Antes y después de comer

EN TITLE: Before and after eating

ES DESCRIPCIÓN: Ordena lo que pasa con la mesa.

EN DESCRIPTION: Put what happens at the table in order.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-009

GAME_ID: intruso-ducha

ES TÍTULO: El intruso de la ducha

EN TITLE: The odd one out in the shower

ES DESCRIPCIÓN: Todo sirve para la ducha menos una cosa.

EN DESCRIPTION: Everything is for the shower except one thing.

STAGES: todas

CONTEXT: higiene

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-010

GAME_ID: construye-tu-manana

ES TÍTULO: Construye tu mañana

EN TITLE: Build your morning

ES DESCRIPCIÓN: Elige tus pasos y ponlos en tu orden. Puedes imprimirlo.

EN DESCRIPTION: Choose your steps and put them in your order. You can print it.

STAGES: todas

CONTEXT: manana

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-011

GAME_ID: checklist-noche

ES TÍTULO: Lista de la noche

EN TITLE: Night checklist

ES DESCRIPCIÓN: Marca lo que ya has hecho antes de dormir.

EN DESCRIPTION: Tick off what you have done before bed.

STAGES: todas

CONTEXT: manana

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-012

GAME_ID: ruta-al-autobus

ES TÍTULO: Ruta al autobús

EN TITLE: Route to the bus

ES DESCRIPCIÓN: Coloca los sitios de la ruta, de casa al destino.

EN DESCRIPTION: Place the stops on the route, from home to where you are going.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-013

GAME_ID: cremallera-y-botones

ES TÍTULO: Cremallera y botones

EN TITLE: Zips and buttons

ES DESCRIPCIÓN: Dos secuencias cortas: abrochar un botón y subir una cremallera.

EN DESCRIPTION: Two short sequences: doing up a button and a zip.

STAGES: inf

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 5

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-014

GAME_ID: cual-es-el-primero

ES TÍTULO: ¿Cuál es el primero?

EN TITLE: Which comes first?

ES DESCRIPCIÓN: Para desayunar cereales, ¿qué haces primero?

EN DESCRIPTION: To have cereal, what do you do first?

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-015

GAME_ID: dos-rutinas-mezcladas

ES TÍTULO: Dos rutinas mezcladas

EN TITLE: Two routines mixed up

ES DESCRIPCIÓN: Separa lo que es de lavarse los dientes y lo que es de hacer la cama.

EN DESCRIPTION: Sort what is for brushing teeth and what is for making the bed.

STAGES: inf

CONTEXT: higiene

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-016

GAME_ID: donde-pasa-esto

ES TÍTULO: ¿Dónde va esto?

EN TITLE: Where does this go?

ES DESCRIPCIÓN: Lleva cada cosa a su sitio de la casa.

EN DESCRIPTION: Take each thing to its place in the home.

STAGES: todas

CONTEXT: casa

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-017

GAME_ID: manana-de-lluvia

ES TÍTULO: La mañana de un día de lluvia

EN TITLE: A rainy morning

ES DESCRIPCIÓN: La mañana de siempre, con lluvia. Ordena los pasos.

EN DESCRIPTION: The usual morning, with rain. Put the steps in order.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-018

GAME_ID: ordena-la-lavadora

ES TÍTULO: Ordena la lavadora

EN TITLE: Put the washing in order

ES DESCRIPCIÓN: De la ropa sucia a la ropa tendida.

EN DESCRIPTION: From dirty clothes to clothes on the line.

STAGES: ado · adu

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-019

GAME_ID: pon-la-mesa

ES TÍTULO: Pon la mesa

EN TITLE: Set the table

ES DESCRIPCIÓN: Elige lo que va en la mesa para comer.

EN DESCRIPTION: Choose what goes on the table for a meal.

STAGES: todas

CONTEXT: comidas

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-020

GAME_ID: intruso-compra

ES TÍTULO: El intruso de la compra

EN TITLE: The odd one out in the shopping

ES DESCRIPCIÓN: Todo es comida menos una cosa.

EN DESCRIPTION: Everything is food except one thing.

STAGES: todas

CONTEXT: salir

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-021

GAME_ID: cruzar-bien

ES TÍTULO: Cruzar bien

EN TITLE: Crossing safely

ES DESCRIPCIÓN: Los pasos para cruzar la calle con calma.

EN DESCRIPTION: The steps to cross the street calmly.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-022

GAME_ID: esperar-el-turno

ES TÍTULO: Esperar el turno

EN TITLE: Waiting your turn

ES DESCRIPCIÓN: Ordena lo que pasa en una fila.

EN DESCRIPTION: Put what happens in a queue in order.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-023

GAME_ID: paga-y-guarda

ES TÍTULO: Paga y guarda

EN TITLE: Pay and put away

ES DESCRIPCIÓN: Los pasos para pagar en una tienda. Sin cuentas.

EN DESCRIPTION: The steps to pay in a shop. No sums.

STAGES: ado · adu

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-024

GAME_ID: mochila-del-finde

ES TÍTULO: La mochila del finde

EN TITLE: The weekend bag

ES DESCRIPCIÓN: Te vas dos días. Elige qué llevas.

EN DESCRIPTION: You are away for two days. Choose what to take.

STAGES: inf · ado

CONTEXT: manana

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-025

GAME_ID: antes-de-dormir

ES TÍTULO: Antes de dormir

EN TITLE: Before sleep

ES DESCRIPCIÓN: De la pantalla encendida a la luz apagada.

EN DESCRIPTION: From screen on to lights off.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-026

GAME_ID: construye-tu-tarde

ES TÍTULO: Construye tu tarde

EN TITLE: Build your afternoon

ES DESCRIPCIÓN: Organiza tu tarde. Incluye un descanso.

EN DESCRIPTION: Plan your afternoon. Include a break.

STAGES: todas

CONTEXT: tiempo

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-027

GAME_ID: primero-despues

ES TÍTULO: Primero, después

EN TITLE: First, then

ES DESCRIPCIÓN: Elige qué haces primero y qué después.

EN DESCRIPTION: Choose what you do first and what comes after.

STAGES: todas

CONTEXT: tiempo

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-028

GAME_ID: que-falta-al-salir

ES TÍTULO: ¿Qué falta al salir?

EN TITLE: What is missing when you go out?

ES DESCRIPCIÓN: Tienes casi todo. ¿Qué falta?

EN DESCRIPTION: You have almost everything. What is missing?

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-029

GAME_ID: ordena-el-bocadillo

ES TÍTULO: Ordena el bocadillo

EN TITLE: Put the sandwich in order

ES DESCRIPCIÓN: Los pasos para preparar un bocadillo.

EN DESCRIPTION: The steps to make a sandwich.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-030

GAME_ID: recoge-la-habitacion

ES TÍTULO: Recoge la habitación

EN TITLE: Tidy the room

ES DESCRIPCIÓN: Elige dónde va cada cosa. Algunas valen en dos sitios.

EN DESCRIPTION: Choose where each thing goes. Some fit in two places.

STAGES: todas

CONTEXT: casa

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-031

GAME_ID: la-ruta-del-medico

ES TÍTULO: La ruta del médico

EN TITLE: The route to the doctor

ES DESCRIPCIÓN: Qué pasa desde que sales de casa hasta que vuelves a estar tranquilo.

EN DESCRIPTION: What happens from leaving home until you are calm again.

STAGES: ado · adu

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-032

GAME_ID: abrir-un-envase

ES TÍTULO: Abrir un envase

EN TITLE: Opening a pack

ES DESCRIPCIÓN: Los pasos para abrir un envase difícil.

EN DESCRIPTION: The steps to open a tricky pack.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-033

GAME_ID: checklist-manana

ES TÍTULO: Lista de la mañana

EN TITLE: Morning checklist

ES DESCRIPCIÓN: Marca lo que ya has hecho antes de salir. Puedes imprimirla.

EN DESCRIPTION: Tick off what you have done before leaving. You can print it.

STAGES: todas

CONTEXT: manana

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-034

GAME_ID: empareja-sitio-objeto

ES TÍTULO: Cada cosa con su sitio

EN TITLE: Each thing and its place

ES DESCRIPCIÓN: Une cada sitio con lo que se guarda allí.

EN DESCRIPTION: Match each place with what is kept there.

STAGES: todas

CONTEXT: casa

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-035

GAME_ID: la-cuenta-atras

ES TÍTULO: La cuenta atrás

EN TITLE: The countdown

ES DESCRIPCIÓN: Un reloj que se vacía poco a poco. Empieza cuando tú quieras.

EN DESCRIPTION: A clock that empties little by little. Start when you want.

STAGES: todas

CONTEXT: tiempo

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-036

GAME_ID: vistete-para-el-tiempo

ES TÍTULO: Vístete para el frío, el calor y la lluvia

EN TITLE: Dress for cold, heat and rain

ES DESCRIPCIÓN: Tres días distintos y un mismo armario.

EN DESCRIPTION: Three different days and one wardrobe.

STAGES: todas

CONTEXT: vestirse

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 5

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-037

GAME_ID: que-viene-noche

ES TÍTULO: ¿Qué viene ahora? · noche

EN TITLE: What comes next? · night

ES DESCRIPCIÓN: La noche ya ha empezado. Elige lo que va después.

EN DESCRIPTION: The evening has started. Choose what comes next.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-038

GAME_ID: separa-para-reciclar

ES TÍTULO: Separa para reciclar

EN TITLE: Sort for recycling

ES DESCRIPCIÓN: Lleva cada cosa a su contenedor.

EN DESCRIPTION: Take each thing to its bin.

STAGES: todas

CONTEXT: casa

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-039

GAME_ID: intruso-escritorio

ES TÍTULO: El intruso del escritorio

EN TITLE: The odd one out on the desk

ES DESCRIPCIÓN: Todo ayuda a estudiar menos una cosa, que puede esperar.

EN DESCRIPTION: Everything helps you study except one thing, which can wait.

STAGES: ado · adu

CONTEXT: estudio

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-040

GAME_ID: empieza-por-uno

ES TÍTULO: Empieza por uno

EN TITLE: Start with one

ES DESCRIPCIÓN: Para empezar una tarea, elige un trozo pequeño. Hay varios buenos.

EN DESCRIPTION: To start a task, choose a small piece. There are several good ones.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-041

GAME_ID: la-medicacion-de-hoy

ES TÍTULO: Recordatorio de la medicación

EN TITLE: Medication reminder

ES DESCRIPCIÓN: Marca cada momento del día cuando ya lo hayas hecho.

EN DESCRIPTION: Tick each time of day once you have done it.

STAGES: ado · adu

CONTEXT: cuidarse

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-042

GAME_ID: salir-con-el-perro

ES TÍTULO: Salir con el perro

EN TITLE: Going out with the dog

ES DESCRIPCIÓN: Ordena los pasos del paseo con el perro.

EN DESCRIPTION: Put the steps of the dog walk in order.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-043

GAME_ID: cambio-de-actividad

ES TÍTULO: Cambio de actividad

EN TITLE: Changing activity

ES DESCRIPCIÓN: Pasar de una actividad a otra eligiendo cómo. Las dos opciones valen.

EN DESCRIPTION: Moving from one activity to another, choosing how. Both options work.

STAGES: todas

CONTEXT: tiempo

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 5

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-044

GAME_ID: volver-del-descanso

ES TÍTULO: Volver del descanso

EN TITLE: Coming back from a break

ES DESCRIPCIÓN: Volver a la tarea sin prisa, empezando por algo pequeño.

EN DESCRIPTION: Getting back to the task without rushing, starting small.

STAGES: ado · adu

CONTEXT: estudio

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 5

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-045

GAME_ID: la-compra

ES TÍTULO: La compra y el pago

EN TITLE: Shopping and paying

ES DESCRIPCIÓN: Coger lo de la lista, esperar en la fila y pagar sin hacer cuentas.

EN DESCRIPTION: Pick up what is on the list, queue and pay with no sums.

STAGES: ado · adu

CONTEXT: salir

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 5

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-046

GAME_ID: preparar-una-cita-medica

ES TÍTULO: Preparar una cita médica

EN TITLE: Getting ready for a medical appointment

ES DESCRIPCIÓN: Lo práctico de una cita: qué llevas y qué haces mientras esperas.

EN DESCRIPTION: The practical side: what you take and what you do while you wait.

STAGES: ado · adu

CONTEXT: cuidarse

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 5

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-047

GAME_ID: cambiar-de-aula

ES TÍTULO: Cambiar de aula

EN TITLE: Changing classrooms

ES DESCRIPCIÓN: Los pasos para cambiar de aula sin perder nada por el camino.

EN DESCRIPTION: The steps to change classrooms without leaving anything behind.

STAGES: ado

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-048

GAME_ID: organizar-los-deberes

ES TÍTULO: Organizar los deberes

EN TITLE: Planning your homework

ES DESCRIPCIÓN: Reparte los deberes entre hoy, mañana y esta semana. Tú decides.

EN DESCRIPTION: Share out your homework between today, tomorrow and this week. You decide.

STAGES: ado

CONTEXT: estudio

TYPE: planificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-049

GAME_ID: estudiar-para-un-examen

ES TÍTULO: Estudiar para un examen

EN TITLE: Studying for a test

ES DESCRIPCIÓN: Un orden para estudiar por partes, con pausas.

EN DESCRIPTION: An order for studying in parts, with breaks.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-050

GAME_ID: planificar-una-quedada

ES TÍTULO: Planificar una quedada

EN TITLE: Planning a meet-up

ES DESCRIPCIÓN: Lo que conviene decidir antes de quedar con alguien.

EN DESCRIPTION: What helps to decide before meeting up with someone.

STAGES: ado · adu

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-051

GAME_ID: cambio-de-plan

ES TÍTULO: Cuando cambia el plan

EN TITLE: When plans change

ES DESCRIPCIÓN: La quedada se cancela. Elige qué haces. Todas las opciones valen.

EN DESCRIPTION: The meet-up is cancelled. Choose what you do. Every option works.

STAGES: ado · adu

CONTEXT: tiempo

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-052

GAME_ID: tiempo-con-pantallas

ES TÍTULO: Tiempo con pantallas

EN TITLE: Screen time

ES DESCRIPCIÓN: Llevas mucho rato con el móvil y quieres parar. Elige cómo.

EN DESCRIPTION: You have been on your phone a long time and want to stop. Choose how.

STAGES: ado · adu

CONTEXT: tiempo

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-053

GAME_ID: responder-un-correo

ES TÍTULO: Responder un correo

EN TITLE: Answering an email

ES DESCRIPCIÓN: Pasos cortos para contestar un correo sin darle muchas vueltas.

EN DESCRIPTION: Short steps for answering an email without overthinking it.

STAGES: adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-054

GAME_ID: hacer-una-llamada

ES TÍTULO: Hacer una llamada

EN TITLE: Making a phone call

ES DESCRIPCIÓN: Preparar una llamada paso a paso para que cueste menos.

EN DESCRIPTION: Getting ready for a phone call step by step so it feels easier.

STAGES: ado · adu

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-055

GAME_ID: demasiadas-tareas

ES TÍTULO: Cuando hay demasiadas tareas

EN TITLE: When there is too much to do

ES DESCRIPCIÓN: Reparte las tareas entre ahora, más tarde y otro día. Tú decides.

EN DESCRIPTION: Share out your tasks between now, later and another day. You decide.

STAGES: adu

CONTEXT: estudio

TYPE: planificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-056

GAME_ID: dividir-una-tarea-grande

ES TÍTULO: Dividir una tarea grande

EN TITLE: Breaking down a big task

ES DESCRIPCIÓN: «Limpiar la casa» es mucho. Elige tres trozos y ponlos en orden.

EN DESCRIPTION: “Clean the house” is a lot. Choose three pieces and put them in order.

STAGES: ado · adu

CONTEXT: casa

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-057

GAME_ID: ordenar-papeles

ES TÍTULO: Ordenar los papeles

EN TITLE: Sorting paperwork

ES DESCRIPCIÓN: Separa lo que hay que pagar, lo que se guarda y lo que se tira.

EN DESCRIPTION: Sort what needs paying, what to keep and what to throw away.

STAGES: adu

CONTEXT: casa

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-058

GAME_ID: despues-de-un-dia-dificil

ES TÍTULO: Después de un día que agota

EN TITLE: After an exhausting day

ES DESCRIPCIÓN: Volver a casa y recuperar energía, a tu manera.

EN DESCRIPTION: Getting home and recharging, your way.

STAGES: ado · adu

CONTEXT: cuidarse

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-059

GAME_ID: preparar-la-noche-anterior

ES TÍTULO: Dejarlo listo la noche anterior

EN TITLE: Getting ready the night before

ES DESCRIPCIÓN: Lo que conviene dejar preparado para que la mañana sea más fácil.

EN DESCRIPTION: What to get ready so the morning is easier.

STAGES: ado · adu

CONTEXT: manana

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-060

GAME_ID: memoria-de-la-cocina

ES TÍTULO: Memoria de la cocina

EN TITLE: Kitchen memory

ES DESCRIPCIÓN: Encuentra las parejas. No hay tiempo ni puntos.

EN DESCRIPTION: Find the pairs. No timer and no points.

STAGES: todas

CONTEXT: comidas

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-061

GAME_ID: busca-lo-que-necesitas-para-salir

ES TÍTULO: Busca lo que necesitas para salir

EN TITLE: Find what you need to go out

ES DESCRIPCIÓN: Entre muchas cosas, encuentra las llaves, la cartera y el móvil.

EN DESCRIPTION: Among lots of things, find the keys, the wallet and the phone.

STAGES: todas

CONTEXT: salir

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-062

GAME_ID: coger-el-tren

ES TÍTULO: Coger el tren

EN TITLE: Taking the train

ES DESCRIPCIÓN: Del billete a tu parada, paso a paso.

EN DESCRIPTION: From the ticket to your stop, step by step.

STAGES: ado · adu

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-063

GAME_ID: doblar-la-ropa

ES TÍTULO: Doblar la ropa

EN TITLE: Folding clothes

ES DESCRIPCIÓN: Doblar una camiseta y guardarla.

EN DESCRIPTION: Folding a T-shirt and putting it away.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-064

GAME_ID: lavarse-las-manos

ES TÍTULO: Lavarse las manos

EN TITLE: Washing your hands

ES DESCRIPCIÓN: Los pasos para lavarse bien las manos.

EN DESCRIPTION: The steps for washing your hands well.

STAGES: inf

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-065

GAME_ID: busca-lo-del-bano

ES TÍTULO: Busca lo del baño

EN TITLE: Find the bathroom things

ES DESCRIPCIÓN: Encuentra las cosas que se usan en el baño.

EN DESCRIPTION: Find the things you use in the bathroom.

STAGES: inf

CONTEXT: higiene

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-066

GAME_ID: memoria-de-la-higiene

ES TÍTULO: Memoria de la higiene

EN TITLE: Hygiene memory

ES DESCRIPCIÓN: Encuentra las parejas de cosas del baño.

EN DESCRIPTION: Find the pairs of bathroom things.

STAGES: inf

CONTEXT: higiene

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: sin_duracion_fija

ES DURACIÓN: Sin duración fija

EN DURATION: No fixed duration

ESTIMATED_MINUTES: —

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-067

GAME_ID: ordena-atarse-los-cordones

ES TÍTULO: Ordena: atarse los cordones

EN TITLE: Put in order: tie your shoelaces

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-068

GAME_ID: que-viene-atarse-los-cordones

ES TÍTULO: ¿Qué viene ahora? · Atarse los cordones

EN TITLE: What comes next? · Tie your shoelaces

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-069

GAME_ID: ordena-ponerse-y-quitarse-los-zapatos

ES TÍTULO: Ordena: ponerse y quitarse los zapatos

EN TITLE: Put in order: put on and take off shoes

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-070

GAME_ID: que-viene-ponerse-y-quitarse-los-zapatos

ES TÍTULO: ¿Qué viene ahora? · Ponerse y quitarse los zapatos

EN TITLE: What comes next? · Put on and take off shoes

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-071

GAME_ID: ordena-abrochar-botones

ES TÍTULO: Ordena: abrochar botones

EN TITLE: Put in order: do up buttons

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-072

GAME_ID: que-viene-abrochar-botones

ES TÍTULO: ¿Qué viene ahora? · Abrochar botones

EN TITLE: What comes next? · Do up buttons

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-073

GAME_ID: ordena-subir-y-bajar-la-cremallera

ES TÍTULO: Ordena: subir y bajar la cremallera

EN TITLE: Put in order: do up and undo a zip

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-074

GAME_ID: que-falta-subir-y-bajar-la-cremallera

ES TÍTULO: ¿Qué falta? · Subir y bajar la cremallera

EN TITLE: What is missing? · Do up and undo a zip

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-075

GAME_ID: ordena-elegir-la-ropa

ES TÍTULO: Ordena: elegir la ropa

EN TITLE: Put in order: choose your clothes

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-076

GAME_ID: que-viene-elegir-la-ropa

ES TÍTULO: ¿Qué viene ahora? · Elegir la ropa

EN TITLE: What comes next? · Choose your clothes

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-077

GAME_ID: ordena-vestirse-por-orden

ES TÍTULO: Ordena: vestirse por orden

EN TITLE: Put in order: get dressed in order

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-078

GAME_ID: que-viene-vestirse-por-orden

ES TÍTULO: ¿Qué viene ahora? · Vestirse por orden

EN TITLE: What comes next? · Get dressed in order

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-079

GAME_ID: ordena-preparar-la-ropa-del-dia-siguiente

ES TÍTULO: Ordena: preparar la ropa del día siguiente

EN TITLE: Put in order: lay out tomorrow's clothes

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-080

GAME_ID: que-viene-preparar-la-ropa-del-dia-siguiente

ES TÍTULO: ¿Qué viene ahora? · Preparar la ropa del día siguiente

EN TITLE: What comes next? · Lay out tomorrow's clothes

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-081

GAME_ID: ordena-quitarse-la-ropa-y-dejarla-en-su-sitio

ES TÍTULO: Ordena: quitarse la ropa y dejarla en su sitio

EN TITLE: Put in order: undress and put clothes away

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-082

GAME_ID: que-falta-quitarse-la-ropa-y-dejarla-en-su-sitio

ES TÍTULO: ¿Qué falta? · Quitarse la ropa y dejarla en su sitio

EN TITLE: What is missing? · Undress and put clothes away

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-083

GAME_ID: ordena-lavarse-los-dientes

ES TÍTULO: Ordena: lavarse los dientes

EN TITLE: Put in order: brush your teeth

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-084

GAME_ID: que-viene-lavarse-los-dientes

ES TÍTULO: ¿Qué viene ahora? · Lavarse los dientes

EN TITLE: What comes next? · Brush your teeth

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-085

GAME_ID: ordena-ducharse

ES TÍTULO: Ordena: ducharse

EN TITLE: Put in order: have a shower

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-086

GAME_ID: que-viene-ducharse

ES TÍTULO: ¿Qué viene ahora? · Ducharse

EN TITLE: What comes next? · Have a shower

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-087

GAME_ID: ordena-lavarse-el-pelo

ES TÍTULO: Ordena: lavarse el pelo

EN TITLE: Put in order: wash your hair

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-088

GAME_ID: que-viene-lavarse-el-pelo

ES TÍTULO: ¿Qué viene ahora? · Lavarse el pelo

EN TITLE: What comes next? · Wash your hair

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-089

GAME_ID: ordena-secarse

ES TÍTULO: Ordena: secarse

EN TITLE: Put in order: dry yourself

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-090

GAME_ID: que-viene-secarse

ES TÍTULO: ¿Qué viene ahora? · Secarse

EN TITLE: What comes next? · Dry yourself

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-091

GAME_ID: ordena-peinarse

ES TÍTULO: Ordena: peinarse

EN TITLE: Put in order: brush your hair

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-092

GAME_ID: que-falta-peinarse

ES TÍTULO: ¿Qué falta? · Peinarse

EN TITLE: What is missing? · Brush your hair

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-093

GAME_ID: ordena-lavarse-las-manos

ES TÍTULO: Ordena: lavarse las manos

EN TITLE: Put in order: wash your hands

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-094

GAME_ID: que-viene-lavarse-las-manos

ES TÍTULO: ¿Qué viene ahora? · Lavarse las manos

EN TITLE: What comes next? · Wash your hands

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-095

GAME_ID: ordena-ir-al-bano

ES TÍTULO: Ordena: ir al baño

EN TITLE: Put in order: go to the toilet

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-096

GAME_ID: que-viene-ir-al-bano

ES TÍTULO: ¿Qué viene ahora? · Ir al baño

EN TITLE: What comes next? · Go to the toilet

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-097

GAME_ID: ordena-cuidado-menstrual

ES TÍTULO: Ordena: cuidado menstrual

EN TITLE: Put in order: period care

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-098

GAME_ID: que-viene-cuidado-menstrual

ES TÍTULO: ¿Qué viene ahora? · Cuidado menstrual

EN TITLE: What comes next? · Period care

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: ado · adu

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-099

GAME_ID: ordena-afeitarse-o-cuidado-personal

ES TÍTULO: Ordena: afeitarse o cuidado personal

EN TITLE: Put in order: shave or personal grooming

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-100

GAME_ID: que-viene-afeitarse-o-cuidado-personal

ES TÍTULO: ¿Qué viene ahora? · Afeitarse o cuidado personal

EN TITLE: What comes next? · Shave or personal grooming

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: ado · adu

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-101

GAME_ID: ordena-cortarse-las-unas

ES TÍTULO: Ordena: cortarse las uñas

EN TITLE: Put in order: clip your nails

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-102

GAME_ID: que-viene-cortarse-las-unas

ES TÍTULO: ¿Qué viene ahora? · Cortarse las uñas

EN TITLE: What comes next? · Clip your nails

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-103

GAME_ID: ordena-usar-desodorante

ES TÍTULO: Ordena: usar desodorante

EN TITLE: Put in order: use deodorant

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-104

GAME_ID: primero-usar-desodorante

ES TÍTULO: ¿Qué va primero? · Usar desodorante

EN TITLE: What comes first? · Use deodorant

ES DESCRIPCIÓN: Elige el paso con el que se empieza.

EN DESCRIPTION: Choose the step you start with.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-105

GAME_ID: ordena-levantarse

ES TÍTULO: Ordena: levantarse

EN TITLE: Put in order: get up

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-106

GAME_ID: que-viene-levantarse

ES TÍTULO: ¿Qué viene ahora? · Levantarse

EN TITLE: What comes next? · Get up

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-107

GAME_ID: ordena-desayunar

ES TÍTULO: Ordena: desayunar

EN TITLE: Put in order: have breakfast

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-108

GAME_ID: que-viene-desayunar

ES TÍTULO: ¿Qué viene ahora? · Desayunar

EN TITLE: What comes next? · Have breakfast

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-109

GAME_ID: ordena-preparar-la-mochila

ES TÍTULO: Ordena: preparar la mochila

EN TITLE: Put in order: pack your bag

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-110

GAME_ID: que-viene-preparar-la-mochila

ES TÍTULO: ¿Qué viene ahora? · Preparar la mochila

EN TITLE: What comes next? · Pack your bag

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-111

GAME_ID: ordena-comprobar-llaves-telefono-y-documentos

ES TÍTULO: Ordena: comprobar llaves, teléfono y documentos

EN TITLE: Put in order: check keys, phone and documents

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-112

GAME_ID: que-viene-comprobar-llaves-telefono-y-documentos

ES TÍTULO: ¿Qué viene ahora? · Comprobar llaves, teléfono y documentos

EN TITLE: What comes next? · Check keys, phone and documents

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-113

GAME_ID: ordena-ponerse-el-abrigo-y-salir

ES TÍTULO: Ordena: ponerse el abrigo y salir

EN TITLE: Put in order: put on your coat and leave

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-114

GAME_ID: que-viene-ponerse-el-abrigo-y-salir

ES TÍTULO: ¿Qué viene ahora? · Ponerse el abrigo y salir

EN TITLE: What comes next? · Put on your coat and leave

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-115

GAME_ID: ordena-salir-a-tiempo

ES TÍTULO: Ordena: salir a tiempo

EN TITLE: Put in order: leave on time

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-116

GAME_ID: que-viene-salir-a-tiempo

ES TÍTULO: ¿Qué viene ahora? · Salir a tiempo

EN TITLE: What comes next? · Leave on time

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-117

GAME_ID: ordena-transicion-casa-escuela-o-trabajo

ES TÍTULO: Ordena: transición casa → escuela o trabajo

EN TITLE: Put in order: transition home → school or work

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-118

GAME_ID: que-viene-transicion-casa-escuela-o-trabajo

ES TÍTULO: ¿Qué viene ahora? · Transición casa → escuela o trabajo

EN TITLE: What comes next? · Transition home → school or work

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-119

GAME_ID: ordena-preparar-un-desayuno-sencillo

ES TÍTULO: Ordena: preparar un desayuno sencillo

EN TITLE: Put in order: make a simple breakfast

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-120

GAME_ID: que-viene-preparar-un-desayuno-sencillo

ES TÍTULO: ¿Qué viene ahora? · Preparar un desayuno sencillo

EN TITLE: What comes next? · Make a simple breakfast

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-121

GAME_ID: ordena-preparar-un-bocadillo

ES TÍTULO: Ordena: preparar un bocadillo

EN TITLE: Put in order: make a sandwich

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-122

GAME_ID: que-viene-preparar-un-bocadillo

ES TÍTULO: ¿Qué viene ahora? · Preparar un bocadillo

EN TITLE: What comes next? · Make a sandwich

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-123

GAME_ID: ordena-poner-la-mesa

ES TÍTULO: Ordena: poner la mesa

EN TITLE: Put in order: set the table

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-124

GAME_ID: que-viene-poner-la-mesa

ES TÍTULO: ¿Qué viene ahora? · Poner la mesa

EN TITLE: What comes next? · Set the table

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-125

GAME_ID: ordena-recoger-la-mesa

ES TÍTULO: Ordena: recoger la mesa

EN TITLE: Put in order: clear the table

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-126

GAME_ID: que-falta-recoger-la-mesa

ES TÍTULO: ¿Qué falta? · Recoger la mesa

EN TITLE: What is missing? · Clear the table

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-127

GAME_ID: ordena-lavar-los-platos

ES TÍTULO: Ordena: lavar los platos

EN TITLE: Put in order: wash up

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-128

GAME_ID: que-viene-lavar-los-platos

ES TÍTULO: ¿Qué viene ahora? · Lavar los platos

EN TITLE: What comes next? · Wash up

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-129

GAME_ID: ordena-guardar-la-comida

ES TÍTULO: Ordena: guardar la comida

EN TITLE: Put in order: put food away

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-130

GAME_ID: que-falta-guardar-la-comida

ES TÍTULO: ¿Qué falta? · Guardar la comida

EN TITLE: What is missing? · Put food away

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-131

GAME_ID: ordena-usar-el-microondas-con-seguridad

ES TÍTULO: Ordena: usar el microondas con seguridad

EN TITLE: Put in order: use the microwave safely

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-132

GAME_ID: que-viene-usar-el-microondas-con-seguridad

ES TÍTULO: ¿Qué viene ahora? · Usar el microondas con seguridad

EN TITLE: What comes next? · Use the microwave safely

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-133

GAME_ID: ordena-seguir-una-receta-visual-sencilla

ES TÍTULO: Ordena: seguir una receta visual sencilla

EN TITLE: Put in order: follow a simple visual recipe

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-134

GAME_ID: que-viene-seguir-una-receta-visual-sencilla

ES TÍTULO: ¿Qué viene ahora? · Seguir una receta visual sencilla

EN TITLE: What comes next? · Follow a simple visual recipe

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-135

GAME_ID: ordena-preparar-la-comida-para-llevar

ES TÍTULO: Ordena: preparar la comida para llevar

EN TITLE: Put in order: pack a packed lunch

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-136

GAME_ID: que-viene-preparar-la-comida-para-llevar

ES TÍTULO: ¿Qué viene ahora? · Preparar la comida para llevar

EN TITLE: What comes next? · Pack a packed lunch

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-137

GAME_ID: ordena-beber-agua-a-lo-largo-del-dia

ES TÍTULO: Ordena: beber agua a lo largo del día

EN TITLE: Put in order: drink water through the day

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-138

GAME_ID: que-falta-beber-agua-a-lo-largo-del-dia

ES TÍTULO: ¿Qué falta? · Beber agua a lo largo del día

EN TITLE: What is missing? · Drink water through the day

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-139

GAME_ID: ordena-hacer-la-cama

ES TÍTULO: Ordena: hacer la cama

EN TITLE: Put in order: make the bed

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-140

GAME_ID: que-falta-hacer-la-cama

ES TÍTULO: ¿Qué falta? · Hacer la cama

EN TITLE: What is missing? · Make the bed

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-141

GAME_ID: ordena-recoger-una-habitacion

ES TÍTULO: Ordena: recoger una habitación

EN TITLE: Put in order: tidy a room

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-142

GAME_ID: que-viene-recoger-una-habitacion

ES TÍTULO: ¿Qué viene ahora? · Recoger una habitación

EN TITLE: What comes next? · Tidy a room

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-143

GAME_ID: ordena-clasificar-la-ropa

ES TÍTULO: Ordena: clasificar la ropa

EN TITLE: Put in order: sort the laundry

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-144

GAME_ID: que-falta-clasificar-la-ropa

ES TÍTULO: ¿Qué falta? · Clasificar la ropa

EN TITLE: What is missing? · Sort the laundry

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-145

GAME_ID: ordena-poner-la-lavadora

ES TÍTULO: Ordena: poner la lavadora

EN TITLE: Put in order: put on a wash

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-146

GAME_ID: que-viene-poner-la-lavadora

ES TÍTULO: ¿Qué viene ahora? · Poner la lavadora

EN TITLE: What comes next? · Put on a wash

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-147

GAME_ID: ordena-tender-la-ropa

ES TÍTULO: Ordena: tender la ropa

EN TITLE: Put in order: hang out the washing

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-148

GAME_ID: que-falta-tender-la-ropa

ES TÍTULO: ¿Qué falta? · Tender la ropa

EN TITLE: What is missing? · Hang out the washing

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-149

GAME_ID: ordena-doblar-la-ropa

ES TÍTULO: Ordena: doblar la ropa

EN TITLE: Put in order: fold the clothes

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-150

GAME_ID: que-falta-doblar-la-ropa

ES TÍTULO: ¿Qué falta? · Doblar la ropa

EN TITLE: What is missing? · Fold the clothes

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-151

GAME_ID: ordena-guardar-los-objetos-en-su-lugar

ES TÍTULO: Ordena: guardar los objetos en su lugar

EN TITLE: Put in order: put things back in their place

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-152

GAME_ID: primero-guardar-los-objetos-en-su-lugar

ES TÍTULO: ¿Qué va primero? · Guardar los objetos en su lugar

EN TITLE: What comes first? · Put things back in their place

ES DESCRIPCIÓN: Elige el paso con el que se empieza.

EN DESCRIPTION: Choose the step you start with.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-153

GAME_ID: ordena-sacar-la-basura

ES TÍTULO: Ordena: sacar la basura

EN TITLE: Put in order: take out the rubbish

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-154

GAME_ID: que-falta-sacar-la-basura

ES TÍTULO: ¿Qué falta? · Sacar la basura

EN TITLE: What is missing? · Take out the rubbish

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-155

GAME_ID: ordena-separar-para-reciclar

ES TÍTULO: Ordena: separar para reciclar

EN TITLE: Put in order: sort the recycling

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-156

GAME_ID: que-viene-separar-para-reciclar

ES TÍTULO: ¿Qué viene ahora? · Separar para reciclar

EN TITLE: What comes next? · Sort the recycling

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-157

GAME_ID: ordena-limpiar-una-superficie

ES TÍTULO: Ordena: limpiar una superficie

EN TITLE: Put in order: clean a surface

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-158

GAME_ID: que-falta-limpiar-una-superficie

ES TÍTULO: ¿Qué falta? · Limpiar una superficie

EN TITLE: What is missing? · Clean a surface

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-159

GAME_ID: ordena-pasar-la-aspiradora

ES TÍTULO: Ordena: pasar la aspiradora

EN TITLE: Put in order: vacuum

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-160

GAME_ID: que-falta-pasar-la-aspiradora

ES TÍTULO: ¿Qué falta? · Pasar la aspiradora

EN TITLE: What is missing? · Vacuum

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-161

GAME_ID: ordena-regar-las-plantas

ES TÍTULO: Ordena: regar las plantas

EN TITLE: Put in order: water the plants

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-162

GAME_ID: primero-regar-las-plantas

ES TÍTULO: ¿Qué va primero? · Regar las plantas

EN TITLE: What comes first? · Water the plants

ES DESCRIPCIÓN: Elige el paso con el que se empieza.

EN DESCRIPTION: Choose the step you start with.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-163

GAME_ID: ordena-cuidar-a-un-animal-de-compania

ES TÍTULO: Ordena: cuidar a un animal de compañía

EN TITLE: Put in order: look after a pet

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-164

GAME_ID: que-falta-cuidar-a-un-animal-de-compania

ES TÍTULO: ¿Qué falta? · Cuidar a un animal de compañía

EN TITLE: What is missing? · Look after a pet

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-165

GAME_ID: ordena-preparar-el-escritorio

ES TÍTULO: Ordena: preparar el escritorio

EN TITLE: Put in order: set up your desk

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-166

GAME_ID: que-falta-preparar-el-escritorio

ES TÍTULO: ¿Qué falta? · Preparar el escritorio

EN TITLE: What is missing? · Set up your desk

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-167

GAME_ID: ordena-empezar-una-tarea

ES TÍTULO: Ordena: empezar una tarea

EN TITLE: Put in order: start a task

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-168

GAME_ID: que-viene-empezar-una-tarea

ES TÍTULO: ¿Qué viene ahora? · Empezar una tarea

EN TITLE: What comes next? · Start a task

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-169

GAME_ID: ordena-dividir-una-tarea-grande

ES TÍTULO: Ordena: dividir una tarea grande

EN TITLE: Put in order: break a big task down

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-170

GAME_ID: que-viene-dividir-una-tarea-grande

ES TÍTULO: ¿Qué viene ahora? · Dividir una tarea grande

EN TITLE: What comes next? · Break a big task down

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-171

GAME_ID: ordena-guardar-los-materiales

ES TÍTULO: Ordena: guardar los materiales

EN TITLE: Put in order: put your materials away

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-172

GAME_ID: primero-guardar-los-materiales

ES TÍTULO: ¿Qué va primero? · Guardar los materiales

EN TITLE: What comes first? · Put your materials away

ES DESCRIPCIÓN: Elige el paso con el que se empieza.

EN DESCRIPTION: Choose the step you start with.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-173

GAME_ID: ordena-entregar-una-tarea

ES TÍTULO: Ordena: entregar una tarea

EN TITLE: Put in order: hand in a task

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-174

GAME_ID: que-falta-entregar-una-tarea

ES TÍTULO: ¿Qué falta? · Entregar una tarea

EN TITLE: What is missing? · Hand in a task

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-175

GAME_ID: ordena-transicion-descanso-trabajo

ES TÍTULO: Ordena: transición descanso → trabajo

EN TITLE: Put in order: transition break → work

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-176

GAME_ID: que-viene-transicion-descanso-trabajo

ES TÍTULO: ¿Qué viene ahora? · Transición descanso → trabajo

EN TITLE: What comes next? · Transition break → work

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-177

GAME_ID: ordena-pedir-una-adaptacion-o-ayuda

ES TÍTULO: Ordena: pedir una adaptación o ayuda

EN TITLE: Put in order: ask for an adjustment or help

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-178

GAME_ID: que-falta-pedir-una-adaptacion-o-ayuda

ES TÍTULO: ¿Qué falta? · Pedir una adaptación o ayuda

EN TITLE: What is missing? · Ask for an adjustment or help

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-179

GAME_ID: ordena-seguir-un-horario-del-dia

ES TÍTULO: Ordena: seguir un horario del día

EN TITLE: Put in order: follow a day timetable

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-180

GAME_ID: que-viene-seguir-un-horario-del-dia

ES TÍTULO: ¿Qué viene ahora? · Seguir un horario del día

EN TITLE: What comes next? · Follow a day timetable

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: ado · adu

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-181

GAME_ID: ordena-cruzar-por-el-paso-de-peatones

ES TÍTULO: Ordena: cruzar por el paso de peatones

EN TITLE: Put in order: cross at the crossing

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-182

GAME_ID: que-viene-cruzar-por-el-paso-de-peatones

ES TÍTULO: ¿Qué viene ahora? · Cruzar por el paso de peatones

EN TITLE: What comes next? · Cross at the crossing

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-183

GAME_ID: ordena-esperar-el-turno

ES TÍTULO: Ordena: esperar el turno

EN TITLE: Put in order: wait your turn

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-184

GAME_ID: que-falta-esperar-el-turno

ES TÍTULO: ¿Qué falta? · Esperar el turno

EN TITLE: What is missing? · Wait your turn

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-185

GAME_ID: ordena-usar-el-transporte-publico

ES TÍTULO: Ordena: usar el transporte público

EN TITLE: Put in order: use public transport

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-186

GAME_ID: que-viene-usar-el-transporte-publico

ES TÍTULO: ¿Qué viene ahora? · Usar el transporte público

EN TITLE: What comes next? · Use public transport

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-187

GAME_ID: ordena-subir-y-bajar-del-autobus-o-metro

ES TÍTULO: Ordena: subir y bajar del autobús o metro

EN TITLE: Put in order: get on and off the bus or metro

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-188

GAME_ID: que-viene-subir-y-bajar-del-autobus-o-metro

ES TÍTULO: ¿Qué viene ahora? · Subir y bajar del autobús o metro

EN TITLE: What comes next? · Get on and off the bus or metro

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-189

GAME_ID: ordena-comprar-en-una-tienda

ES TÍTULO: Ordena: comprar en una tienda

EN TITLE: Put in order: shop in a shop

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-190

GAME_ID: que-viene-comprar-en-una-tienda

ES TÍTULO: ¿Qué viene ahora? · Comprar en una tienda

EN TITLE: What comes next? · Shop in a shop

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-191

GAME_ID: ordena-pagar

ES TÍTULO: Ordena: pagar

EN TITLE: Put in order: pay

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-192

GAME_ID: que-viene-pagar

ES TÍTULO: ¿Qué viene ahora? · Pagar

EN TITLE: What comes next? · Pay

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-193

GAME_ID: ordena-guardar-el-ticket-y-el-cambio

ES TÍTULO: Ordena: guardar el ticket y el cambio

EN TITLE: Put in order: keep the receipt and change

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-194

GAME_ID: primero-guardar-el-ticket-y-el-cambio

ES TÍTULO: ¿Qué va primero? · Guardar el ticket y el cambio

EN TITLE: What comes first? · Keep the receipt and change

ES DESCRIPCIÓN: Elige el paso con el que se empieza.

EN DESCRIPTION: Choose the step you start with.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-195

GAME_ID: ordena-pedir-ayuda

ES TÍTULO: Ordena: pedir ayuda

EN TITLE: Put in order: ask for help

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-196

GAME_ID: que-falta-pedir-ayuda

ES TÍTULO: ¿Qué falta? · Pedir ayuda

EN TITLE: What is missing? · Ask for help

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-197

GAME_ID: ordena-orientarse-en-un-lugar-conocido

ES TÍTULO: Ordena: orientarse en un lugar conocido

EN TITLE: Put in order: find your way in a familiar place

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-198

GAME_ID: que-falta-orientarse-en-un-lugar-conocido

ES TÍTULO: ¿Qué falta? · Orientarse en un lugar conocido

EN TITLE: What is missing? · Find your way in a familiar place

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-199

GAME_ID: ordena-ir-a-una-cita-medica

ES TÍTULO: Ordena: ir a una cita médica

EN TITLE: Put in order: go to a medical appointment

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-200

GAME_ID: que-viene-ir-a-una-cita-medica

ES TÍTULO: ¿Qué viene ahora? · Ir a una cita médica

EN TITLE: What comes next? · Go to a medical appointment

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-201

GAME_ID: ordena-salir-del-sitio-cuando-hay-sobrecarga

ES TÍTULO: Ordena: salir del sitio cuando hay sobrecarga

EN TITLE: Put in order: leave when you are overloaded

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-202

GAME_ID: que-viene-salir-del-sitio-cuando-hay-sobrecarga

ES TÍTULO: ¿Qué viene ahora? · Salir del sitio cuando hay sobrecarga

EN TITLE: What comes next? · Leave when you are overloaded

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-203

GAME_ID: ordena-prepararse-para-salir

ES TÍTULO: Ordena: prepararse para salir

EN TITLE: Put in order: get ready to go out

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-204

GAME_ID: que-falta-prepararse-para-salir

ES TÍTULO: ¿Qué falta? · Prepararse para salir

EN TITLE: What is missing? · Get ready to go out

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-205

GAME_ID: ordena-terminar-una-actividad

ES TÍTULO: Ordena: terminar una actividad

EN TITLE: Put in order: finish an activity

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-206

GAME_ID: que-falta-terminar-una-actividad

ES TÍTULO: ¿Qué falta? · Terminar una actividad

EN TITLE: What is missing? · Finish an activity

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-207

GAME_ID: ordena-cambiar-de-tarea

ES TÍTULO: Ordena: cambiar de tarea

EN TITLE: Put in order: switch task

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-208

GAME_ID: que-viene-cambiar-de-tarea

ES TÍTULO: ¿Qué viene ahora? · Cambiar de tarea

EN TITLE: What comes next? · Switch task

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-209

GAME_ID: ordena-esperar

ES TÍTULO: Ordena: esperar

EN TITLE: Put in order: wait

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-210

GAME_ID: que-falta-esperar

ES TÍTULO: ¿Qué falta? · Esperar

EN TITLE: What is missing? · Wait

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-211

GAME_ID: ordena-seguir-una-cuenta-atras-visual

ES TÍTULO: Ordena: seguir una cuenta atrás visual

EN TITLE: Put in order: follow a visual countdown

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-212

GAME_ID: que-falta-seguir-una-cuenta-atras-visual

ES TÍTULO: ¿Qué falta? · Seguir una cuenta atrás visual

EN TITLE: What is missing? · Follow a visual countdown

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-213

GAME_ID: ordena-organizar-la-secuencia-de-la-tarde

ES TÍTULO: Ordena: organizar la secuencia de la tarde

EN TITLE: Put in order: plan the afternoon sequence

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-214

GAME_ID: que-falta-organizar-la-secuencia-de-la-tarde

ES TÍTULO: ¿Qué falta? · Organizar la secuencia de la tarde

EN TITLE: What is missing? · Plan the afternoon sequence

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-215

GAME_ID: primero-primero-despues

ES TÍTULO: ¿Qué va primero? · Primero → después

EN TITLE: What comes first? · First → then

ES DESCRIPCIÓN: Elige el paso con el que se empieza.

EN DESCRIPTION: Choose the step you start with.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-216

GAME_ID: ordena-preparar-el-pijama

ES TÍTULO: Ordena: preparar el pijama

EN TITLE: Put in order: get your pyjamas ready

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-217

GAME_ID: primero-preparar-el-pijama

ES TÍTULO: ¿Qué va primero? · Preparar el pijama

EN TITLE: What comes first? · Get your pyjamas ready

ES DESCRIPCIÓN: Elige el paso con el que se empieza.

EN DESCRIPTION: Choose the step you start with.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-218

GAME_ID: ordena-higiene-nocturna

ES TÍTULO: Ordena: higiene nocturna

EN TITLE: Put in order: night-time hygiene

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-219

GAME_ID: que-falta-higiene-nocturna

ES TÍTULO: ¿Qué falta? · Higiene nocturna

EN TITLE: What is missing? · Night-time hygiene

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-220

GAME_ID: ordena-dejar-preparadas-las-cosas-del-dia-siguiente

ES TÍTULO: Ordena: dejar preparadas las cosas del día siguiente

EN TITLE: Put in order: get tomorrow's things ready

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-221

GAME_ID: que-falta-dejar-preparadas-las-cosas-del-dia-siguiente

ES TÍTULO: ¿Qué falta? · Dejar preparadas las cosas del día siguiente

EN TITLE: What is missing? · Get tomorrow's things ready

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-222

GAME_ID: ordena-apagar-pantallas-y-luces

ES TÍTULO: Ordena: apagar pantallas y luces

EN TITLE: Put in order: turn off screens and lights

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-223

GAME_ID: que-falta-apagar-pantallas-y-luces

ES TÍTULO: ¿Qué falta? · Apagar pantallas y luces

EN TITLE: What is missing? · Turn off screens and lights

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-224

GAME_ID: ordena-acostarse

ES TÍTULO: Ordena: acostarse

EN TITLE: Put in order: go to bed

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-225

GAME_ID: que-falta-acostarse

ES TÍTULO: ¿Qué falta? · Acostarse

EN TITLE: What is missing? · Go to bed

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-226

GAME_ID: ordena-preparar-el-ambiente-de-descanso

ES TÍTULO: Ordena: preparar el ambiente de descanso

EN TITLE: Put in order: set up a restful room

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-227

GAME_ID: que-viene-preparar-el-ambiente-de-descanso

ES TÍTULO: ¿Qué viene ahora? · Preparar el ambiente de descanso

EN TITLE: What comes next? · Set up a restful room

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-228

GAME_ID: ordena-volver-a-la-cama-si-te-despiertas

ES TÍTULO: Ordena: volver a la cama si te despiertas

EN TITLE: Put in order: go back to bed if you wake up

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-229

GAME_ID: que-viene-volver-a-la-cama-si-te-despiertas

ES TÍTULO: ¿Qué viene ahora? · Volver a la cama si te despiertas

EN TITLE: What comes next? · Go back to bed if you wake up

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-230

GAME_ID: ordena-tomar-la-medicacion

ES TÍTULO: Ordena: tomar la medicación

EN TITLE: Put in order: take your medication

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-231

GAME_ID: que-falta-tomar-la-medicacion

ES TÍTULO: ¿Qué falta? · Tomar la medicación

EN TITLE: What is missing? · Take your medication

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-232

GAME_ID: ordena-prepararse-para-el-dentista

ES TÍTULO: Ordena: prepararse para el dentista

EN TITLE: Put in order: get ready for the dentist

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-233

GAME_ID: que-viene-prepararse-para-el-dentista

ES TÍTULO: ¿Qué viene ahora? · Prepararse para el dentista

EN TITLE: What comes next? · Get ready for the dentist

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-234

GAME_ID: ordena-cargar-el-telefono

ES TÍTULO: Ordena: cargar el teléfono

EN TITLE: Put in order: charge your phone

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-235

GAME_ID: que-falta-cargar-el-telefono

ES TÍTULO: ¿Qué falta? · Cargar el teléfono

EN TITLE: What is missing? · Charge your phone

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-236

GAME_ID: ordena-manejar-el-dinero-de-la-semana

ES TÍTULO: Ordena: manejar el dinero de la semana

EN TITLE: Put in order: manage the week's money

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-237

GAME_ID: que-viene-manejar-el-dinero-de-la-semana

ES TÍTULO: ¿Qué viene ahora? · Manejar el dinero de la semana

EN TITLE: What comes next? · Manage the week's money

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-238

GAME_ID: ordena-abrir-un-envase-dificil

ES TÍTULO: Ordena: abrir un envase difícil

EN TITLE: Put in order: open a tricky package

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-239

GAME_ID: que-falta-abrir-un-envase-dificil

ES TÍTULO: ¿Qué falta? · Abrir un envase difícil

EN TITLE: What is missing? · Open a tricky package

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-240

GAME_ID: ordena-contestar-a-la-puerta-o-al-telefono

ES TÍTULO: Ordena: contestar a la puerta o al teléfono

EN TITLE: Put in order: answer the door or the phone

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-241

GAME_ID: que-viene-contestar-a-la-puerta-o-al-telefono

ES TÍTULO: ¿Qué viene ahora? · Contestar a la puerta o al teléfono

EN TITLE: What comes next? · Answer the door or the phone

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-242

GAME_ID: ordena-usar-una-lista-de-la-compra

ES TÍTULO: Ordena: usar una lista de la compra

EN TITLE: Put in order: use a shopping list

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-243

GAME_ID: que-falta-usar-una-lista-de-la-compra

ES TÍTULO: ¿Qué falta? · Usar una lista de la compra

EN TITLE: What is missing? · Use a shopping list

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-244

GAME_ID: ordena-descansar-antes-de-agotarte

ES TÍTULO: Ordena: descansar antes de agotarte

EN TITLE: Put in order: rest before you crash

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-245

GAME_ID: que-viene-descansar-antes-de-agotarte

ES TÍTULO: ¿Qué viene ahora? · Descansar antes de agotarte

EN TITLE: What comes next? · Rest before you crash

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-246

GAME_ID: ordena-prepararse-para-un-cambio-previsto

ES TÍTULO: Ordena: prepararse para un cambio previsto

EN TITLE: Put in order: get ready for a planned change

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-247

GAME_ID: que-viene-prepararse-para-un-cambio-previsto

ES TÍTULO: ¿Qué viene ahora? · Prepararse para un cambio previsto

EN TITLE: What comes next? · Get ready for a planned change

ES DESCRIPCIÓN: Mira lo que ya ha pasado y elige el paso siguiente.

EN DESCRIPTION: Look at what has happened and choose the next step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-248

GAME_ID: ordena-recargar-el-abono-de-transporte

ES TÍTULO: Ordena: recargar el abono de transporte

EN TITLE: Put in order: top up your travel card

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-249

GAME_ID: que-falta-recargar-el-abono-de-transporte

ES TÍTULO: ¿Qué falta? · Recargar el abono de transporte

EN TITLE: What is missing? · Top up your travel card

ES DESCRIPCIÓN: Mira la secuencia y elige el paso que falta.

EN DESCRIPTION: Look at the sequence and choose the missing step.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-250

GAME_ID: ordena-afeitarse

ES TÍTULO: Ordena: afeitarse

EN TITLE: Put in order: shaving

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-251

GAME_ID: ordena-cocinar-una-receta

ES TÍTULO: Ordena: cocinar una receta

EN TITLE: Put in order: cooking a recipe

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: ado · adu

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-252

GAME_ID: ordena-limpiar-la-casa

ES TÍTULO: Ordena: limpiar la casa por partes

EN TITLE: Put in order: cleaning the house in parts

ES DESCRIPCIÓN: Pon los pasos en orden, del primero al último.

EN DESCRIPTION: Put the steps in order, from first to last.

STAGES: adu

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: hasta_2_min

ES DURACIÓN: Hasta 2 min aprox.

EN DURATION: Up to about 2 min

ESTIMATED_MINUTES: 2

LINEAGE: A2_FROZEN_PUBLIC_BASELINE

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-253

GAME_ID: r40-higiene-ordenar

ES TÍTULO: Lavarse las manos, paso a paso

EN TITLE: Wash your hands, step by step

ES DESCRIPCIÓN: Pon en orden una secuencia cotidiana para lavarte las manos.

EN DESCRIPTION: Put an everyday hand-washing sequence in order.

STAGES: todas

CONTEXT: higiene

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-254

GAME_ID: r40-higiene-elegir

ES TÍTULO: ¿Por dónde quieres empezar?

EN TITLE: Where do you want to start?

ES DESCRIPCIÓN: Elige una tarea de cuidado personal para empezar. Las tres opciones pueden servir.

EN DESCRIPTION: Choose a personal-care task to start with. Any of the three can work.

STAGES: todas

CONTEXT: higiene

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-255

GAME_ID: r40-higiene-clasificar

ES TÍTULO: Cada objeto con su cuidado

EN TITLE: Match each item to its care task

ES DESCRIPCIÓN: Separa las cosas de los dientes y las del pelo.

EN DESCRIPTION: Sort the things for teeth and the things for hair.

STAGES: todas

CONTEXT: higiene

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-256

GAME_ID: r40-higiene-planificar

ES TÍTULO: Prepara tu cuidado personal

EN TITLE: Plan your personal care

ES DESCRIPCIÓN: Elige las tareas que quieres hacer y ordénalas a tu manera.

EN DESCRIPTION: Choose the tasks you want to do and put them in your own order.

STAGES: todas

CONTEXT: higiene

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-257

GAME_ID: r40-higiene-memoria

ES TÍTULO: Memoria del baño

EN TITLE: Bathroom memory

ES DESCRIPCIÓN: Encuentra parejas de objetos cotidianos del baño.

EN DESCRIPTION: Find pairs of everyday bathroom items.

STAGES: todas

CONTEXT: higiene

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-258

GAME_ID: r40-vestirse-ordenar

ES TÍTULO: Vestirse para salir

EN TITLE: Get dressed to go out

ES DESCRIPCIÓN: Pon en orden una secuencia sencilla de ropa y calzado.

EN DESCRIPTION: Put a simple clothes-and-shoes sequence in order.

STAGES: todas

CONTEXT: vestirse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-259

GAME_ID: r40-vestirse-elegir

ES TÍTULO: Elige una prenda para empezar

EN TITLE: Choose an item to start with

ES DESCRIPCIÓN: Elige con qué prenda quieres empezar. Puedes decidir según el día y cómo te encuentres.

EN DESCRIPTION: Choose which item you want to start with. You can decide based on the day and how you feel.

STAGES: todas

CONTEXT: vestirse

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-260

GAME_ID: r40-vestirse-clasificar

ES TÍTULO: Ropa y calzado

EN TITLE: Clothes and footwear

ES DESCRIPCIÓN: Separa prendas de vestir y calzado.

EN DESCRIPTION: Sort clothes and footwear.

STAGES: todas

CONTEXT: vestirse

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-261

GAME_ID: r40-vestirse-planificar

ES TÍTULO: Prepara lo que te vas a poner

EN TITLE: Plan what you will wear

ES DESCRIPCIÓN: Elige las prendas que quieres usar y ordénalas como te resulte cómodo.

EN DESCRIPTION: Choose the clothes you want to use and put them in an order that feels comfortable.

STAGES: todas

CONTEXT: vestirse

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-262

GAME_ID: r40-vestirse-memoria

ES TÍTULO: Memoria de la ropa

EN TITLE: Clothes memory

ES DESCRIPCIÓN: Encuentra parejas de prendas y calzado.

EN DESCRIPTION: Find pairs of clothes and footwear.

STAGES: todas

CONTEXT: vestirse

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-263

GAME_ID: r40-comidas-ordenar

ES TÍTULO: Preparar un bocadillo

EN TITLE: Make a sandwich

ES DESCRIPCIÓN: Pon en orden cuatro pasos para preparar y guardar un bocadillo.

EN DESCRIPTION: Put four steps for making and packing a sandwich in order.

STAGES: todas

CONTEXT: comidas

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-264

GAME_ID: r40-comidas-elegir

ES TÍTULO: ¿Qué comida quieres preparar?

EN TITLE: Which meal do you want to prepare?

ES DESCRIPCIÓN: Elige una comida del día para empezar a organizarla.

EN DESCRIPTION: Choose a meal of the day to start organising.

STAGES: todas

CONTEXT: comidas

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-265

GAME_ID: r40-comidas-clasificar

ES TÍTULO: Nevera o fregadero

EN TITLE: Fridge or sink

ES DESCRIPCIÓN: Separa lo que se guarda en frío y lo que se lava después de usarlo.

EN DESCRIPTION: Sort what is kept cold and what is washed after use.

STAGES: todas

CONTEXT: comidas

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-266

GAME_ID: r40-comidas-planificar

ES TÍTULO: Prepara una comida para llevar

EN TITLE: Plan food to take with you

ES DESCRIPCIÓN: Elige qué quieres preparar o llevar y ordénalo a tu manera.

EN DESCRIPTION: Choose what you want to prepare or take and put it in your own order.

STAGES: todas

CONTEXT: comidas

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-267

GAME_ID: r40-comidas-memoria

ES TÍTULO: Memoria de la cocina · nueva tanda

EN TITLE: Kitchen memory · new set

ES DESCRIPCIÓN: Encuentra parejas de objetos cotidianos de la cocina.

EN DESCRIPTION: Find pairs of everyday kitchen items.

STAGES: todas

CONTEXT: comidas

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-268

GAME_ID: r40-manana-ordenar

ES TÍTULO: Prepararse para salir

EN TITLE: Get ready to go out

ES DESCRIPCIÓN: Pon en orden una mañana sencilla antes de salir.

EN DESCRIPTION: Put a simple morning-before-leaving sequence in order.

STAGES: todas

CONTEXT: manana

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-269

GAME_ID: r40-manana-elegir

ES TÍTULO: Deja una cosa lista

EN TITLE: Get one thing ready

ES DESCRIPCIÓN: Elige una cosa que quieras dejar preparada para que la salida sea más sencilla.

EN DESCRIPTION: Choose one thing to get ready so leaving is simpler.

STAGES: todas

CONTEXT: manana

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-270

GAME_ID: r40-manana-clasificar

ES TÍTULO: Mañana o noche

EN TITLE: Morning or night

ES DESCRIPCIÓN: Separa acciones típicas de la mañana y de la noche.

EN DESCRIPTION: Sort typical morning and night actions.

STAGES: todas

CONTEXT: manana

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-271

GAME_ID: r40-manana-planificar

ES TÍTULO: Construye tu salida de casa

EN TITLE: Build your leaving-home plan

ES DESCRIPCIÓN: Elige los pasos que te ayudan antes de salir y ponlos en tu orden.

EN DESCRIPTION: Choose the steps that help before leaving and put them in your order.

STAGES: todas

CONTEXT: manana

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-272

GAME_ID: r40-manana-memoria

ES TÍTULO: Memoria antes de salir

EN TITLE: Leaving-home memory

ES DESCRIPCIÓN: Encuentra parejas de cosas que pueden acompañarte al salir.

EN DESCRIPTION: Find pairs of things that can go with you when you leave.

STAGES: todas

CONTEXT: manana

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-273

GAME_ID: r40-casa-ordenar

ES TÍTULO: Poner a punto una habitación

EN TITLE: Get a room ready

ES DESCRIPCIÓN: Prueba un orden posible para hacer varias tareas pequeñas de casa.

EN DESCRIPTION: Try one possible order for several small household tasks.

STAGES: todas

CONTEXT: casa

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-274

GAME_ID: r40-casa-elegir

ES TÍTULO: Elige una tarea pequeña de casa

EN TITLE: Choose one small household task

ES DESCRIPCIÓN: Elige una tarea concreta para empezar. Las tres son opciones posibles.

EN DESCRIPTION: Choose one specific task to start with. Any of the three can work.

STAGES: todas

CONTEXT: casa

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-275

GAME_ID: r40-casa-clasificar

ES TÍTULO: Armario o nevera

EN TITLE: Wardrobe or fridge

ES DESCRIPCIÓN: Separa cosas que se guardan en el armario y cosas que se guardan en frío.

EN DESCRIPTION: Sort things kept in the wardrobe and things kept cold.

STAGES: todas

CONTEXT: casa

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-276

GAME_ID: r40-casa-planificar

ES TÍTULO: Haz tu plan de casa

EN TITLE: Make your home plan

ES DESCRIPCIÓN: Elige unas tareas de casa y ordénalas como prefieras.

EN DESCRIPTION: Choose some household tasks and put them in the order you prefer.

STAGES: todas

CONTEXT: casa

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-277

GAME_ID: r40-casa-memoria

ES TÍTULO: Memoria de casa

EN TITLE: Home memory

ES DESCRIPCIÓN: Encuentra parejas de objetos y lugares cotidianos de casa.

EN DESCRIPTION: Find pairs of everyday household items and places.

STAGES: todas

CONTEXT: casa

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-278

GAME_ID: r40-salir-ordenar

ES TÍTULO: Del portal al destino

EN TITLE: From home to your destination

ES DESCRIPCIÓN: Pon en orden una ruta sencilla en transporte público.

EN DESCRIPTION: Put a simple public-transport route in order.

STAGES: todas

CONTEXT: salir

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-279

GAME_ID: r40-salir-elegir

ES TÍTULO: Comprueba una cosa antes de salir

EN TITLE: Check one thing before leaving

ES DESCRIPCIÓN: Elige qué quieres comprobar primero. Las tres opciones pueden ser útiles.

EN DESCRIPTION: Choose what you want to check first. Any of the three can be useful.

STAGES: todas

CONTEXT: salir

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-280

GAME_ID: r40-salir-clasificar

ES TÍTULO: Lo llevo o se queda en casa

EN TITLE: Take it or leave it at home

ES DESCRIPCIÓN: Separa algunas cosas que suelen acompañarte de una cosa que se queda en casa.

EN DESCRIPTION: Sort some things that often go with you from one thing that stays at home.

STAGES: todas

CONTEXT: salir

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-281

GAME_ID: r40-salir-planificar

ES TÍTULO: Planifica una salida sencilla

EN TITLE: Plan a simple trip out

ES DESCRIPCIÓN: Elige qué necesitas para la salida y ordénalo a tu manera.

EN DESCRIPTION: Choose what you need for going out and put it in your own order.

STAGES: todas

CONTEXT: salir

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-282

GAME_ID: r40-salir-memoria

ES TÍTULO: Memoria para salir

EN TITLE: Going-out memory

ES DESCRIPCIÓN: Encuentra parejas de cosas que puedes comprobar antes de salir.

EN DESCRIPTION: Find pairs of things you can check before going out.

STAGES: todas

CONTEXT: salir

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-283

GAME_ID: r40-estudio-ordenar

ES TÍTULO: Responder una tarea breve

EN TITLE: Complete a short task

ES DESCRIPCIÓN: Pon en orden cuatro pasos desde abrir el material hasta entregar la respuesta.

EN DESCRIPTION: Put four steps in order, from opening the material to sending the answer.

STAGES: todas

CONTEXT: estudio

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-284

GAME_ID: r40-estudio-elegir

ES TÍTULO: Elige cómo empezar

EN TITLE: Choose how to start

ES DESCRIPCIÓN: Elige una forma pequeña de empezar una tarea. No hay una única opción correcta.

EN DESCRIPTION: Choose a small way to start a task. There is no single correct option.

STAGES: todas

CONTEXT: estudio

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-285

GAME_ID: r40-estudio-clasificar

ES TÍTULO: Trabajo o descanso

EN TITLE: Work or break

ES DESCRIPCIÓN: Separa cosas para la tarea y cosas para una pausa.

EN DESCRIPTION: Sort things for the task and things for a break.

STAGES: todas

CONTEXT: estudio

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-286

GAME_ID: r40-estudio-planificar

ES TÍTULO: Construye una sesión de estudio o trabajo

EN TITLE: Build a study or work session

ES DESCRIPCIÓN: Elige partes de trabajo y descanso y colócalas en el orden que prefieras.

EN DESCRIPTION: Choose work and break parts and put them in the order you prefer.

STAGES: todas

CONTEXT: estudio

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-287

GAME_ID: r40-estudio-memoria

ES TÍTULO: Memoria del escritorio

EN TITLE: Desk memory

ES DESCRIPCIÓN: Encuentra parejas de materiales de estudio o trabajo.

EN DESCRIPTION: Find pairs of study or work materials.

STAGES: todas

CONTEXT: estudio

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-288

GAME_ID: r40-tiempo-ordenar

ES TÍTULO: Cambiar de una tarea a otra

EN TITLE: Move from one task to another

ES DESCRIPCIÓN: Pon en orden una transición sencilla entre dos actividades.

EN DESCRIPTION: Put a simple transition between two activities in order.

STAGES: todas

CONTEXT: tiempo

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-289

GAME_ID: r40-tiempo-elegir

ES TÍTULO: Elige cómo preparar un cambio

EN TITLE: Choose how to prepare for a change

ES DESCRIPCIÓN: Elige una forma de prepararte para cambiar de actividad.

EN DESCRIPTION: Choose a way to prepare for changing activity.

STAGES: todas

CONTEXT: tiempo

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-290

GAME_ID: r40-tiempo-clasificar

ES TÍTULO: Actividad o pausa

EN TITLE: Activity or break

ES DESCRIPCIÓN: Separa acciones de tarea y acciones de pausa.

EN DESCRIPTION: Sort task actions and break actions.

STAGES: todas

CONTEXT: tiempo

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-291

GAME_ID: r40-tiempo-planificar

ES TÍTULO: Organiza un rato de tarde

EN TITLE: Plan part of your afternoon

ES DESCRIPCIÓN: Elige actividad, descanso y siguiente paso, y ordénalos como prefieras.

EN DESCRIPTION: Choose activity, break and next step, and put them in the order you prefer.

STAGES: todas

CONTEXT: tiempo

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-292

GAME_ID: r40-tiempo-memoria

ES TÍTULO: Memoria de planes

EN TITLE: Plans memory

ES DESCRIPCIÓN: Encuentra parejas de apoyos para organizar el tiempo.

EN DESCRIPTION: Find pairs of supports for organising time.

STAGES: todas

CONTEXT: tiempo

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-293

GAME_ID: r40-cuidarse-ordenar

ES TÍTULO: Hacer una pausa y volver

EN TITLE: Take a break and return

ES DESCRIPCIÓN: Pon en orden una forma posible de parar un momento y volver después.

EN DESCRIPTION: Put one possible way to pause for a moment and return afterwards in order.

STAGES: todas

CONTEXT: cuidarse

TYPE: ordenar

SKILL_ID: secuenciacion

ES HABILIDAD: Secuenciación

EN SKILL: Sequencing

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-294

GAME_ID: r40-cuidarse-elegir

ES TÍTULO: ¿Qué necesitas ahora?

EN TITLE: What do you need now?

ES DESCRIPCIÓN: Elige una opción cotidiana que pueda ayudarte a cuidarte en este momento.

EN DESCRIPTION: Choose an everyday option that may help you look after yourself right now.

STAGES: todas

CONTEXT: cuidarse

TYPE: elegir

SKILL_ID: eleccion_decision

ES HABILIDAD: Elección y decisión

EN SKILL: Choosing and deciding

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-295

GAME_ID: r40-cuidarse-clasificar

ES TÍTULO: Para una pausa o para salir

EN TITLE: For a break or for going out

ES DESCRIPCIÓN: Separa cosas que pueden acompañar una pausa y cosas que puedes llevar al salir.

EN DESCRIPTION: Sort things that can go with a break and things you can take when going out.

STAGES: todas

CONTEXT: cuidarse

TYPE: clasificar

SKILL_ID: clasificacion

ES HABILIDAD: Clasificación

EN SKILL: Sorting

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-296

GAME_ID: r40-cuidarse-planificar

ES TÍTULO: Prepara una pausa a tu manera

EN TITLE: Plan a break your way

ES DESCRIPCIÓN: Elige lo que te ayuda a hacer una pausa y ordénalo como quieras.

EN DESCRIPTION: Choose what helps you take a break and put it in any order you like.

STAGES: todas

CONTEXT: cuidarse

TYPE: planificar

SKILL_ID: planificacion_organizacion

ES HABILIDAD: Planificación y organización

EN SKILL: Planning and organising

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-GAME-297

GAME_ID: r40-cuidarse-memoria

ES TÍTULO: Memoria de cosas útiles

EN TITLE: Useful-things memory

ES DESCRIPCIÓN: Encuentra parejas de objetos cotidianos que puedes querer tener a mano.

EN DESCRIPTION: Find pairs of everyday items you may want to keep handy.

STAGES: todas

CONTEXT: cuidarse

TYPE: memoria

SKILL_ID: memoria_visual

ES HABILIDAD: Memoria visual

EN SKILL: Visual memory

DURATION_BUCKET: 3_5_min

ES DURACIÓN: 3–5 min aprox.

EN DURATION: About 3–5 min

ESTIMATED_MINUTES: 3

LINEAGE: R40_A1_45_NEW

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## QA · JUEGOS / GAMES

- SOURCE_RECORDS: 297/297
- UNIQUE_GAME_IDS: 297/297
- ES_COMPLETE: 297/297
- EN_COMPLETE: 297/297
- SOURCE_LINEAGE_PRESERVED: 297/297
- SOURCE_CONTEXT_PRESERVED: 297/297
- SOURCE_SKILL_PRESERVED: 297/297
- STATUS: PASS

SIGUIENTE FASE: 109 rutinas imprimibles bilingües.

# 73. RECURSOS · RUTINAS IMPRIMIBLES / PRINTABLE ROUTINES

FUENTE: `assets/data/r42-routine-download-manifest.json` · SHA `7f029cede31c4c90bd05990d4054f6b7fe950463`.

SOURCE DATASET: `assets/data/rutinas-imprimibles-data.js` · blob `609b903e31c8ddc7db713bb39bb3be40b692e589`.

ES CONTRATO DE DESCARGA: 109 rutinas válidas; descarga principal SVG_A4_CLIENT_GENERATED_SELF_CONTAINED; outputs adicionales PRINT · SAVE_AS_PDF · STEPS_SHEET · TICK_LIST · FRIDGE_STRIP · CUT_OUT_CARDS.

EN DOWNLOAD CONTRACT: 109 valid routines; primary download SVG_A4_CLIENT_GENERATED_SELF_CONTAINED; additional outputs PRINT · SAVE_AS_PDF · STEPS_SHEET · TICK_LIST · FRIDGE_STRIP · CUT_OUT_CARDS.

DECLARED_PICTOGRAM_LICENSE: CC BY-SA 4.0

LICENSE_PIN_STATUS: PENDING_PROJECT_RECONCILIATION_PER_R42_BRIEF

ARASAAC_USED: false

## WEB-ROUTINE-001

ROUTINE_ID: manana-para-salir

ES TÍTULO: La mañana antes de salir

EN TITLE: The morning before going out

CONTEXT: manana

STAGES: todas

STEP_COUNT: 8

STEP_IDS: despertarse → levantarse → bano → dientes → vestirse → desayunar → cogermochila → salir

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-manana-para-salir

EN PATH: /en/resources/printable-routines/#pack-manana-para-salir

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-002

ROUTINE_ID: noche-antes-de-dormir

ES TÍTULO: La noche antes de dormir

EN TITLE: The evening before bed

CONTEXT: manana

STAGES: todas

STEP_COUNT: 6

STEP_IDS: cenar → dientes → ponerpijama → apagartele → lampara → apagardormir

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-noche-antes-de-dormir

EN PATH: /en/resources/printable-routines/#pack-noche-antes-de-dormir

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-003

ROUTINE_ID: lavarse-los-dientes

ES TÍTULO: Lavarse los dientes

EN TITLE: Brushing your teeth

CONTEXT: higiene

STAGES: inf · todas

STEP_COUNT: 5

STEP_IDS: cepillo → pasta → dientes → enjuagar → secarboca

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-lavarse-los-dientes

EN PATH: /en/resources/printable-routines/#pack-lavarse-los-dientes

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-004

ROUTINE_ID: lavarse-las-manos

ES TÍTULO: Lavarse las manos

EN TITLE: Washing your hands

CONTEXT: higiene

STAGES: inf · todas

STEP_COUNT: 6

STEP_IDS: grifo → jabon → frotar → aclarar → cerrarGrifo → secarManos

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-lavarse-las-manos

EN PATH: /en/resources/printable-routines/#pack-lavarse-las-manos

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-005

ROUTINE_ID: ducharse

ES TÍTULO: Ducharse

EN TITLE: Having a shower

CONTEXT: higiene

STAGES: todas

STEP_COUNT: 8

STEP_IDS: desvestirse → grifo → mojarse → gel → champu → aclararse → secartoalla → vestirse

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-ducharse

EN PATH: /en/resources/printable-routines/#pack-ducharse

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-006

ROUTINE_ID: ir-al-bano

ES TÍTULO: Ir al baño

EN TITLE: Going to the toilet

CONTEXT: higiene

STAGES: inf

STEP_COUNT: 5

STEP_IDS: irBano → papelwc → tirarCadena → manos → secarManos

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-ir-al-bano

EN PATH: /en/resources/printable-routines/#pack-ir-al-bano

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-007

ROUTINE_ID: afeitarse

ES TÍTULO: Afeitarse

EN TITLE: Shaving

CONTEXT: higiene

STAGES: ado · adu

STEP_COUNT: 4

STEP_IDS: afeit1 → afeit2 → afeit3 → secarcara

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-afeitarse

EN PATH: /en/resources/printable-routines/#pack-afeitarse

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-008

ROUTINE_ID: cortarse-las-unas

ES TÍTULO: Cortarse las uñas

EN TITLE: Cutting your nails

CONTEXT: higiene

STAGES: ado · adu

STEP_COUNT: 3

STEP_IDS: unas1 → unas2 → unas3

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-cortarse-las-unas

EN PATH: /en/resources/printable-routines/#pack-cortarse-las-unas

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-009

ROUTINE_ID: vestirse-para-la-lluvia

ES TÍTULO: Vestirse para la lluvia

EN TITLE: Dressing for rain

CONTEXT: vestirse

STAGES: inf · todas

STEP_COUNT: 5

STEP_IDS: lluvia → impermeable → botas → cogerparaguas → salir

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-vestirse-para-la-lluvia

EN PATH: /en/resources/printable-routines/#pack-vestirse-para-la-lluvia

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-010

ROUTINE_ID: atarse-los-cordones

ES TÍTULO: Atarse los cordones

EN TITLE: Tying your laces

CONTEXT: vestirse

STAGES: inf

STEP_COUNT: 5

STEP_IDS: cordA → cordB → cordC → cordD → cordE

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-atarse-los-cordones

EN PATH: /en/resources/printable-routines/#pack-atarse-los-cordones

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-011

ROUTINE_ID: abrochar-botones

ES TÍTULO: Abrochar botones

EN TITLE: Doing up buttons

CONTEXT: vestirse

STAGES: inf

STEP_COUNT: 3

STEP_IDS: bot1 → bot2 → bot3

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-abrochar-botones

EN PATH: /en/resources/printable-routines/#pack-abrochar-botones

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-012

ROUTINE_ID: preparar-la-mochila

ES TÍTULO: Preparar la mochila

EN TITLE: Packing your school bag

CONTEXT: manana

STAGES: inf · ado

STEP_COUNT: 6

STEP_IDS: mirarhorario → carpeta → estuche → comida → botella → cogermochila

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-preparar-la-mochila

EN PATH: /en/resources/printable-routines/#pack-preparar-la-mochila

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-013

ROUTINE_ID: la-noche-anterior

ES TÍTULO: Dejarlo listo la noche anterior

EN TITLE: Ready the night before

CONTEXT: manana

STAGES: ado · adu

STEP_COUNT: 6

STEP_IDS: ropaMañana → bolsoListo → cargarMovil → llavesSitio → comidaLista → alarma

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-la-noche-anterior

EN PATH: /en/resources/printable-routines/#pack-la-noche-anterior

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-014

ROUTINE_ID: desayuno-sencillo

ES TÍTULO: Un desayuno sencillo

EN TITLE: A simple breakfast

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 5

STEP_IDS: cuenco → cereales → echarleche → cogercuchara → desayunar

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-desayuno-sencillo

EN PATH: /en/resources/printable-routines/#pack-desayuno-sencillo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-015

ROUTINE_ID: preparar-un-bocadillo

ES TÍTULO: Preparar un bocadillo

EN TITLE: Making a sandwich

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 5

STEP_IDS: sacarpan → abrirpan → relleno → cerrarbocadillo → fiambrera

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-preparar-un-bocadillo

EN PATH: /en/resources/printable-routines/#pack-preparar-un-bocadillo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-016

ROUTINE_ID: cocinar-una-receta

ES TÍTULO: Cocinar una receta

EN TITLE: Cooking a recipe

CONTEXT: comidas

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: receta → ingredientes → cocinar → servir → recogerCoc

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-cocinar-una-receta

EN PATH: /en/resources/printable-routines/#pack-cocinar-una-receta

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-017

ROUTINE_ID: poner-y-recoger-la-mesa

ES TÍTULO: Poner y recoger la mesa

EN TITLE: Setting and clearing the table

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 3

STEP_IDS: ponermesa → comer → recogermesa

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-poner-y-recoger-la-mesa

EN PATH: /en/resources/printable-routines/#pack-poner-y-recoger-la-mesa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-018

ROUTINE_ID: poner-la-lavadora

ES TÍTULO: Poner la lavadora

EN TITLE: Doing the washing

CONTEXT: casa

STAGES: ado · adu

STEP_COUNT: 6

STEP_IDS: separarRopa → lavmeter → lavdet → lavmarcha → tender → tender2

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-poner-la-lavadora

EN PATH: /en/resources/printable-routines/#pack-poner-la-lavadora

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-019

ROUTINE_ID: doblar-la-ropa

ES TÍTULO: Doblar la ropa

EN TITLE: Folding clothes

CONTEXT: casa

STAGES: todas

STEP_COUNT: 5

STEP_IDS: dob1 → dob2 → dob3 → monton → guardarArm

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-doblar-la-ropa

EN PATH: /en/resources/printable-routines/#pack-doblar-la-ropa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-020

ROUTINE_ID: limpiar-la-casa

ES TÍTULO: Limpiar la casa por partes

EN TITLE: Cleaning the house in parts

CONTEXT: casa

STAGES: adu

STEP_COUNT: 5

STEP_IDS: fregar → polvo → aspirar → baño2 → basura

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-limpiar-la-casa

EN PATH: /en/resources/printable-routines/#pack-limpiar-la-casa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-021

ROUTINE_ID: hacer-la-compra

ES TÍTULO: Hacer la compra

EN TITLE: Doing the shopping

CONTEXT: salir

STAGES: ado · adu

STEP_COUNT: 7

STEP_IDS: listaCompra → tienda → cesta2 → filacaja → pagar → guardarbolsa → guardarCompra

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-hacer-la-compra

EN PATH: /en/resources/printable-routines/#pack-hacer-la-compra

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-022

ROUTINE_ID: cruzar-la-calle

ES TÍTULO: Cruzar la calle

EN TITLE: Crossing the road

CONTEXT: salir

STAGES: inf · todas

STEP_COUNT: 5

STEP_IDS: llegarpaso → parar → semaforo → mirarlados → cruzar

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-cruzar-la-calle

EN PATH: /en/resources/printable-routines/#pack-cruzar-la-calle

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-023

ROUTINE_ID: ir-en-autobus

ES TÍTULO: Ir en autobús

EN TITLE: Taking the bus

CONTEXT: salir

STAGES: todas

STEP_COUNT: 5

STEP_IDS: casa → puerta → parada → bus → destino

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-ir-en-autobus

EN PATH: /en/resources/printable-routines/#pack-ir-en-autobus

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-024

ROUTINE_ID: coger-el-tren

ES TÍTULO: Coger el tren

EN TITLE: Taking the train

CONTEXT: salir

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: validar → anden → subirTren → mirarParadas → bajarTren

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-coger-el-tren

EN PATH: /en/resources/printable-routines/#pack-coger-el-tren

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-025

ROUTINE_ID: ir-a-una-cita-medica

ES TÍTULO: Ir a una cita médica

EN TITLE: Going to a medical appointment

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 5

STEP_IDS: tarjetasan → casa → salaespera → consulta → tranquilo

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-ir-a-una-cita-medica

EN PATH: /en/resources/printable-routines/#pack-ir-a-una-cita-medica

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-026

ROUTINE_ID: hacer-una-llamada

ES TÍTULO: Hacer una llamada

EN TITLE: Making a phone call

CONTEXT: cuidarse

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: apuntar → buscarNum → respirarLl → llamar → apuntarResp

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-hacer-una-llamada

EN PATH: /en/resources/printable-routines/#pack-hacer-una-llamada

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-027

ROUTINE_ID: responder-un-correo

ES TÍTULO: Responder un correo

EN TITLE: Answering an email

CONTEXT: estudio

STAGES: adu

STEP_COUNT: 5

STEP_IDS: leerCorreo → queDicen → escribirResp → revisar → enviar

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-responder-un-correo

EN PATH: /en/resources/printable-routines/#pack-responder-un-correo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-028

ROUTINE_ID: estudiar-por-partes

ES TÍTULO: Estudiar por partes

EN TITLE: Studying in parts

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: temario → trozos → estudiarTrozo → pausa → repasar

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-estudiar-por-partes

EN PATH: /en/resources/printable-routines/#pack-estudiar-por-partes

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-029

ROUTINE_ID: empezar-una-tarea

ES TÍTULO: Empezar una tarea

EN TITLE: Starting a task

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: mirarhorario → ordenarmesa → trozos → tareapeque → pausa

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-empezar-una-tarea

EN PATH: /en/resources/printable-routines/#pack-empezar-una-tarea

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-030

ROUTINE_ID: volver-a-casa

ES TÍTULO: Volver a casa después de un día que agota

EN TITLE: Getting home after an exhausting day

CONTEXT: cuidarse

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: llegarCasa → quitarZap → silencio → cenarF → dormirTemprano

EDITORIAL_SOURCE_ID: —

EDITORIAL_SOURCE_STATUS: LEGACY_NO_ROUTINE_SOURCE_ID

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-volver-a-casa

EN PATH: /en/resources/printable-routines/#pack-volver-a-casa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-031

ROUTINE_ID: rutina-ponerse-y-quitarse-los-zapatos

ES TÍTULO: Ponerse y quitarse los zapatos

EN TITLE: Put on and take off shoes

CONTEXT: vestirse

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_AUT02_1 → R_AUT02_2 → R_AUT02_3 → R_AUT02_4 → R_AUT02_5

EDITORIAL_SOURCE_ID: AUT-02

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-ponerse-y-quitarse-los-zapatos

EN PATH: /en/resources/printable-routines/#pack-rutina-ponerse-y-quitarse-los-zapatos

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-032

ROUTINE_ID: rutina-subir-y-bajar-la-cremallera

ES TÍTULO: Subir y bajar la cremallera

EN TITLE: Do up and undo a zip

CONTEXT: vestirse

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_AUT04_1 → R_AUT04_2 → R_AUT04_3 → R_AUT04_4

EDITORIAL_SOURCE_ID: AUT-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-subir-y-bajar-la-cremallera

EN PATH: /en/resources/printable-routines/#pack-rutina-subir-y-bajar-la-cremallera

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-033

ROUTINE_ID: rutina-elegir-la-ropa

ES TÍTULO: Elegir la ropa

EN TITLE: Choose your clothes

CONTEXT: vestirse

STAGES: todas

STEP_COUNT: 6

STEP_IDS: R_AUT05_1 → R_AUT05_2 → R_AUT05_3 → R_AUT05_4 → R_AUT05_5 → R_AUT05_6

EDITORIAL_SOURCE_ID: AUT-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-elegir-la-ropa

EN PATH: /en/resources/printable-routines/#pack-rutina-elegir-la-ropa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-034

ROUTINE_ID: rutina-vestirse-por-orden

ES TÍTULO: Vestirse por orden

EN TITLE: Get dressed in order

CONTEXT: vestirse

STAGES: todas

STEP_COUNT: 6

STEP_IDS: R_AUT06_1 → R_AUT06_2 → R_AUT06_3 → R_AUT06_4 → R_AUT06_5 → R_AUT06_6

EDITORIAL_SOURCE_ID: AUT-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-vestirse-por-orden

EN PATH: /en/resources/printable-routines/#pack-rutina-vestirse-por-orden

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-035

ROUTINE_ID: rutina-preparar-la-ropa-del-dia-siguiente

ES TÍTULO: Preparar la ropa del día siguiente

EN TITLE: Lay out tomorrow's clothes

CONTEXT: vestirse

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_AUT07_1 → R_AUT07_2 → R_AUT07_3 → R_AUT07_4 → R_AUT07_5

EDITORIAL_SOURCE_ID: AUT-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-preparar-la-ropa-del-dia-siguiente

EN PATH: /en/resources/printable-routines/#pack-rutina-preparar-la-ropa-del-dia-siguiente

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-036

ROUTINE_ID: rutina-quitarse-la-ropa-y-dejarla-en-su-sitio

ES TÍTULO: Quitarse la ropa y dejarla en su sitio

EN TITLE: Undress and put clothes away

CONTEXT: vestirse

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_AUT08_1 → R_AUT08_2 → R_AUT08_3 → R_AUT08_4

EDITORIAL_SOURCE_ID: AUT-08

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-quitarse-la-ropa-y-dejarla-en-su-sitio

EN PATH: /en/resources/printable-routines/#pack-rutina-quitarse-la-ropa-y-dejarla-en-su-sitio

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-037

ROUTINE_ID: rutina-lavarse-el-pelo

ES TÍTULO: Lavarse el pelo

EN TITLE: Wash your hair

CONTEXT: higiene

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_HIG03_1 → R_HIG03_2 → R_HIG03_3 → R_HIG03_4 → R_HIG03_5

EDITORIAL_SOURCE_ID: HIG-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-lavarse-el-pelo

EN PATH: /en/resources/printable-routines/#pack-rutina-lavarse-el-pelo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-038

ROUTINE_ID: rutina-secarse

ES TÍTULO: Secarse

EN TITLE: Dry yourself

CONTEXT: higiene

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_HIG04_1 → R_HIG04_2 → R_HIG04_3 → R_HIG04_4 → R_HIG04_5

EDITORIAL_SOURCE_ID: HIG-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-secarse

EN PATH: /en/resources/printable-routines/#pack-rutina-secarse

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-039

ROUTINE_ID: rutina-peinarse

ES TÍTULO: Peinarse

EN TITLE: Brush your hair

CONTEXT: higiene

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_HIG05_1 → R_HIG05_2 → R_HIG05_3 → R_HIG05_4

EDITORIAL_SOURCE_ID: HIG-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-peinarse

EN PATH: /en/resources/printable-routines/#pack-rutina-peinarse

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-040

ROUTINE_ID: rutina-cuidado-menstrual

ES TÍTULO: Cuidado menstrual

EN TITLE: Period care

CONTEXT: higiene

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: R_HIG08_1 → R_HIG08_2 → R_HIG08_3 → R_HIG08_4 → R_HIG08_5

EDITORIAL_SOURCE_ID: HIG-08

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-cuidado-menstrual

EN PATH: /en/resources/printable-routines/#pack-rutina-cuidado-menstrual

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-041

ROUTINE_ID: rutina-afeitarse-o-cuidado-personal

ES TÍTULO: Afeitarse o cuidado personal

EN TITLE: Shave or personal grooming

CONTEXT: higiene

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: R_HIG09_1 → R_HIG09_2 → R_HIG09_3 → R_HIG09_4 → R_HIG09_5

EDITORIAL_SOURCE_ID: HIG-09

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-afeitarse-o-cuidado-personal

EN PATH: /en/resources/printable-routines/#pack-rutina-afeitarse-o-cuidado-personal

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-042

ROUTINE_ID: rutina-usar-desodorante

ES TÍTULO: Usar desodorante

EN TITLE: Use deodorant

CONTEXT: higiene

STAGES: todas

STEP_COUNT: 3

STEP_IDS: R_HIG11_1 → R_HIG11_2 → R_HIG11_3

EDITORIAL_SOURCE_ID: HIG-11

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-usar-desodorante

EN PATH: /en/resources/printable-routines/#pack-rutina-usar-desodorante

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-043

ROUTINE_ID: rutina-levantarse

ES TÍTULO: Levantarse

EN TITLE: Get up

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_MAN01_1 → R_MAN01_2 → R_MAN01_3 → R_MAN01_4 → R_MAN01_5

EDITORIAL_SOURCE_ID: MAN-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-levantarse

EN PATH: /en/resources/printable-routines/#pack-rutina-levantarse

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-044

ROUTINE_ID: rutina-desayunar

ES TÍTULO: Desayunar

EN TITLE: Have breakfast

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_MAN02_1 → R_MAN02_2 → R_MAN02_3 → R_MAN02_4 → R_MAN02_5

EDITORIAL_SOURCE_ID: MAN-02

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-desayunar

EN PATH: /en/resources/printable-routines/#pack-rutina-desayunar

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-045

ROUTINE_ID: rutina-comprobar-llaves-telefono-y-documentos

ES TÍTULO: Comprobar llaves, teléfono y documentos

EN TITLE: Check keys, phone and documents

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_MAN04_1 → R_MAN04_2 → R_MAN04_3 → R_MAN04_4 → R_MAN04_5

EDITORIAL_SOURCE_ID: MAN-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-comprobar-llaves-telefono-y-documentos

EN PATH: /en/resources/printable-routines/#pack-rutina-comprobar-llaves-telefono-y-documentos

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-046

ROUTINE_ID: rutina-ponerse-el-abrigo-y-salir

ES TÍTULO: Ponerse el abrigo y salir

EN TITLE: Put on your coat and leave

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_MAN05_1 → R_MAN05_2 → R_MAN05_3 → R_MAN05_4 → R_MAN05_5

EDITORIAL_SOURCE_ID: MAN-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-ponerse-el-abrigo-y-salir

EN PATH: /en/resources/printable-routines/#pack-rutina-ponerse-el-abrigo-y-salir

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-047

ROUTINE_ID: rutina-salir-a-tiempo

ES TÍTULO: Salir a tiempo

EN TITLE: Leave on time

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_MAN06_1 → R_MAN06_2 → R_MAN06_3 → R_MAN06_4 → R_MAN06_5

EDITORIAL_SOURCE_ID: MAN-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-salir-a-tiempo

EN PATH: /en/resources/printable-routines/#pack-rutina-salir-a-tiempo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-048

ROUTINE_ID: rutina-transicion-casa-escuela-o-trabajo

ES TÍTULO: Transición casa → escuela o trabajo

EN TITLE: Transition home → school or work

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_MAN07_1 → R_MAN07_2 → R_MAN07_3 → R_MAN07_4 → R_MAN07_5

EDITORIAL_SOURCE_ID: MAN-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-transicion-casa-escuela-o-trabajo

EN PATH: /en/resources/printable-routines/#pack-rutina-transicion-casa-escuela-o-trabajo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-049

ROUTINE_ID: rutina-preparar-un-desayuno-sencillo

ES TÍTULO: Preparar un desayuno sencillo

EN TITLE: Make a simple breakfast

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 6

STEP_IDS: R_COC01_1 → R_COC01_2 → R_COC01_3 → R_COC01_4 → R_COC01_5 → R_COC01_6

EDITORIAL_SOURCE_ID: COC-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-preparar-un-desayuno-sencillo

EN PATH: /en/resources/printable-routines/#pack-rutina-preparar-un-desayuno-sencillo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-050

ROUTINE_ID: rutina-poner-la-mesa

ES TÍTULO: Poner la mesa

EN TITLE: Set the table

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_COC03_1 → R_COC03_2 → R_COC03_3 → R_COC03_4 → R_COC03_5

EDITORIAL_SOURCE_ID: COC-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-poner-la-mesa

EN PATH: /en/resources/printable-routines/#pack-rutina-poner-la-mesa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-051

ROUTINE_ID: rutina-recoger-la-mesa

ES TÍTULO: Recoger la mesa

EN TITLE: Clear the table

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_COC04_1 → R_COC04_2 → R_COC04_3 → R_COC04_4

EDITORIAL_SOURCE_ID: COC-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-recoger-la-mesa

EN PATH: /en/resources/printable-routines/#pack-rutina-recoger-la-mesa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-052

ROUTINE_ID: rutina-lavar-los-platos

ES TÍTULO: Lavar los platos

EN TITLE: Wash up

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_COC05_1 → R_COC05_2 → R_COC05_3 → R_COC05_4 → R_COC05_5

EDITORIAL_SOURCE_ID: COC-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-lavar-los-platos

EN PATH: /en/resources/printable-routines/#pack-rutina-lavar-los-platos

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-053

ROUTINE_ID: rutina-guardar-la-comida

ES TÍTULO: Guardar la comida

EN TITLE: Put food away

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_COC06_1 → R_COC06_2 → R_COC06_3 → R_COC06_4

EDITORIAL_SOURCE_ID: COC-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-guardar-la-comida

EN PATH: /en/resources/printable-routines/#pack-rutina-guardar-la-comida

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-054

ROUTINE_ID: rutina-usar-el-microondas-con-seguridad

ES TÍTULO: Usar el microondas con seguridad

EN TITLE: Use the microwave safely

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 6

STEP_IDS: R_COC07_1 → R_COC07_2 → R_COC07_3 → R_COC07_4 → R_COC07_5 → R_COC07_6

EDITORIAL_SOURCE_ID: COC-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-usar-el-microondas-con-seguridad

EN PATH: /en/resources/printable-routines/#pack-rutina-usar-el-microondas-con-seguridad

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-055

ROUTINE_ID: rutina-seguir-una-receta-visual-sencilla

ES TÍTULO: Seguir una receta visual sencilla

EN TITLE: Follow a simple visual recipe

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_COC08_1 → R_COC08_2 → R_COC08_3 → R_COC08_4 → R_COC08_5

EDITORIAL_SOURCE_ID: COC-08

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-seguir-una-receta-visual-sencilla

EN PATH: /en/resources/printable-routines/#pack-rutina-seguir-una-receta-visual-sencilla

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-056

ROUTINE_ID: rutina-preparar-la-comida-para-llevar

ES TÍTULO: Preparar la comida para llevar

EN TITLE: Pack a packed lunch

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_COC09_1 → R_COC09_2 → R_COC09_3 → R_COC09_4 → R_COC09_5

EDITORIAL_SOURCE_ID: COC-09

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-preparar-la-comida-para-llevar

EN PATH: /en/resources/printable-routines/#pack-rutina-preparar-la-comida-para-llevar

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-057

ROUTINE_ID: rutina-beber-agua-a-lo-largo-del-dia

ES TÍTULO: Beber agua a lo largo del día

EN TITLE: Drink water through the day

CONTEXT: comidas

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_COC10_1 → R_COC10_2 → R_COC10_3 → R_COC10_4

EDITORIAL_SOURCE_ID: COC-10

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-beber-agua-a-lo-largo-del-dia

EN PATH: /en/resources/printable-routines/#pack-rutina-beber-agua-a-lo-largo-del-dia

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-058

ROUTINE_ID: rutina-hacer-la-cama

ES TÍTULO: Hacer la cama

EN TITLE: Make the bed

CONTEXT: casa

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAS01_1 → R_CAS01_2 → R_CAS01_3 → R_CAS01_4

EDITORIAL_SOURCE_ID: CAS-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-hacer-la-cama

EN PATH: /en/resources/printable-routines/#pack-rutina-hacer-la-cama

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-059

ROUTINE_ID: rutina-recoger-una-habitacion

ES TÍTULO: Recoger una habitación

EN TITLE: Tidy a room

CONTEXT: casa

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_CAS02_1 → R_CAS02_2 → R_CAS02_3 → R_CAS02_4 → R_CAS02_5

EDITORIAL_SOURCE_ID: CAS-02

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-recoger-una-habitacion

EN PATH: /en/resources/printable-routines/#pack-rutina-recoger-una-habitacion

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-060

ROUTINE_ID: rutina-clasificar-la-ropa

ES TÍTULO: Clasificar la ropa

EN TITLE: Sort the laundry

CONTEXT: casa

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAS03_1 → R_CAS03_2 → R_CAS03_3 → R_CAS03_4

EDITORIAL_SOURCE_ID: CAS-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-clasificar-la-ropa

EN PATH: /en/resources/printable-routines/#pack-rutina-clasificar-la-ropa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-061

ROUTINE_ID: rutina-tender-la-ropa

ES TÍTULO: Tender la ropa

EN TITLE: Hang out the washing

CONTEXT: casa

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAS05_1 → R_CAS05_2 → R_CAS05_3 → R_CAS05_4

EDITORIAL_SOURCE_ID: CAS-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-tender-la-ropa

EN PATH: /en/resources/printable-routines/#pack-rutina-tender-la-ropa

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-062

ROUTINE_ID: rutina-guardar-los-objetos-en-su-lugar

ES TÍTULO: Guardar los objetos en su lugar

EN TITLE: Put things back in their place

CONTEXT: casa

STAGES: todas

STEP_COUNT: 3

STEP_IDS: R_CAS07_1 → R_CAS07_2 → R_CAS07_3

EDITORIAL_SOURCE_ID: CAS-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-guardar-los-objetos-en-su-lugar

EN PATH: /en/resources/printable-routines/#pack-rutina-guardar-los-objetos-en-su-lugar

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-063

ROUTINE_ID: rutina-sacar-la-basura

ES TÍTULO: Sacar la basura

EN TITLE: Take out the rubbish

CONTEXT: casa

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAS08_1 → R_CAS08_2 → R_CAS08_3 → R_CAS08_4

EDITORIAL_SOURCE_ID: CAS-08

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-sacar-la-basura

EN PATH: /en/resources/printable-routines/#pack-rutina-sacar-la-basura

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-064

ROUTINE_ID: rutina-separar-para-reciclar

ES TÍTULO: Separar para reciclar

EN TITLE: Sort the recycling

CONTEXT: casa

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_CAS09_1 → R_CAS09_2 → R_CAS09_3 → R_CAS09_4 → R_CAS09_5

EDITORIAL_SOURCE_ID: CAS-09

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-separar-para-reciclar

EN PATH: /en/resources/printable-routines/#pack-rutina-separar-para-reciclar

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-065

ROUTINE_ID: rutina-limpiar-una-superficie

ES TÍTULO: Limpiar una superficie

EN TITLE: Clean a surface

CONTEXT: casa

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAS10_1 → R_CAS10_2 → R_CAS10_3 → R_CAS10_4

EDITORIAL_SOURCE_ID: CAS-10

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-limpiar-una-superficie

EN PATH: /en/resources/printable-routines/#pack-rutina-limpiar-una-superficie

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-066

ROUTINE_ID: rutina-pasar-la-aspiradora

ES TÍTULO: Pasar la aspiradora

EN TITLE: Vacuum

CONTEXT: casa

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAS11_1 → R_CAS11_2 → R_CAS11_3 → R_CAS11_4

EDITORIAL_SOURCE_ID: CAS-11

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-pasar-la-aspiradora

EN PATH: /en/resources/printable-routines/#pack-rutina-pasar-la-aspiradora

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-067

ROUTINE_ID: rutina-regar-las-plantas

ES TÍTULO: Regar las plantas

EN TITLE: Water the plants

CONTEXT: casa

STAGES: todas

STEP_COUNT: 3

STEP_IDS: R_CAS12_1 → R_CAS12_2 → R_CAS12_3

EDITORIAL_SOURCE_ID: CAS-12

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-regar-las-plantas

EN PATH: /en/resources/printable-routines/#pack-rutina-regar-las-plantas

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-068

ROUTINE_ID: rutina-cuidar-a-un-animal-de-compania

ES TÍTULO: Cuidar a un animal de compañía

EN TITLE: Look after a pet

CONTEXT: casa

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAS13_1 → R_CAS13_2 → R_CAS13_3 → R_CAS13_4

EDITORIAL_SOURCE_ID: CAS-13

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-cuidar-a-un-animal-de-compania

EN PATH: /en/resources/printable-routines/#pack-rutina-cuidar-a-un-animal-de-compania

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-069

ROUTINE_ID: rutina-preparar-el-escritorio

ES TÍTULO: Preparar el escritorio

EN TITLE: Set up your desk

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 4

STEP_IDS: R_EST01_1 → R_EST01_2 → R_EST01_3 → R_EST01_4

EDITORIAL_SOURCE_ID: EST-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-preparar-el-escritorio

EN PATH: /en/resources/printable-routines/#pack-rutina-preparar-el-escritorio

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-070

ROUTINE_ID: rutina-dividir-una-tarea-grande

ES TÍTULO: Dividir una tarea grande

EN TITLE: Break a big task down

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: R_EST03_1 → R_EST03_2 → R_EST03_3 → R_EST03_4 → R_EST03_5

EDITORIAL_SOURCE_ID: EST-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-dividir-una-tarea-grande

EN PATH: /en/resources/printable-routines/#pack-rutina-dividir-una-tarea-grande

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-071

ROUTINE_ID: rutina-guardar-los-materiales

ES TÍTULO: Guardar los materiales

EN TITLE: Put your materials away

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 3

STEP_IDS: R_EST04_1 → R_EST04_2 → R_EST04_3

EDITORIAL_SOURCE_ID: EST-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-guardar-los-materiales

EN PATH: /en/resources/printable-routines/#pack-rutina-guardar-los-materiales

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-072

ROUTINE_ID: rutina-entregar-una-tarea

ES TÍTULO: Entregar una tarea

EN TITLE: Hand in a task

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 4

STEP_IDS: R_EST05_1 → R_EST05_2 → R_EST05_3 → R_EST05_4

EDITORIAL_SOURCE_ID: EST-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-entregar-una-tarea

EN PATH: /en/resources/printable-routines/#pack-rutina-entregar-una-tarea

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-073

ROUTINE_ID: rutina-transicion-descanso-trabajo

ES TÍTULO: Transición descanso → trabajo

EN TITLE: Transition break → work

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: R_EST06_1 → R_EST06_2 → R_EST06_3 → R_EST06_4 → R_EST06_5

EDITORIAL_SOURCE_ID: EST-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-transicion-descanso-trabajo

EN PATH: /en/resources/printable-routines/#pack-rutina-transicion-descanso-trabajo

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-074

ROUTINE_ID: rutina-pedir-una-adaptacion-o-ayuda

ES TÍTULO: Pedir una adaptación o ayuda

EN TITLE: Ask for an adjustment or help

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 4

STEP_IDS: R_EST07_1 → R_EST07_2 → R_EST07_3 → R_EST07_4

EDITORIAL_SOURCE_ID: EST-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-pedir-una-adaptacion-o-ayuda

EN PATH: /en/resources/printable-routines/#pack-rutina-pedir-una-adaptacion-o-ayuda

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-075

ROUTINE_ID: rutina-seguir-un-horario-del-dia

ES TÍTULO: Seguir un horario del día

EN TITLE: Follow a day timetable

CONTEXT: estudio

STAGES: ado · adu

STEP_COUNT: 5

STEP_IDS: R_EST08_1 → R_EST08_2 → R_EST08_3 → R_EST08_4 → R_EST08_5

EDITORIAL_SOURCE_ID: EST-08

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-seguir-un-horario-del-dia

EN PATH: /en/resources/printable-routines/#pack-rutina-seguir-un-horario-del-dia

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-076

ROUTINE_ID: rutina-cruzar-por-el-paso-de-peatones

ES TÍTULO: Cruzar por el paso de peatones

EN TITLE: Cross at the crossing

CONTEXT: salir

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_CAL01_1 → R_CAL01_2 → R_CAL01_3 → R_CAL01_4 → R_CAL01_5

EDITORIAL_SOURCE_ID: CAL-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-cruzar-por-el-paso-de-peatones

EN PATH: /en/resources/printable-routines/#pack-rutina-cruzar-por-el-paso-de-peatones

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-077

ROUTINE_ID: rutina-esperar-el-turno

ES TÍTULO: Esperar el turno

EN TITLE: Wait your turn

CONTEXT: salir

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAL02_1 → R_CAL02_2 → R_CAL02_3 → R_CAL02_4

EDITORIAL_SOURCE_ID: CAL-02

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-esperar-el-turno

EN PATH: /en/resources/printable-routines/#pack-rutina-esperar-el-turno

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-078

ROUTINE_ID: rutina-usar-el-transporte-publico

ES TÍTULO: Usar el transporte público

EN TITLE: Use public transport

CONTEXT: salir

STAGES: todas

STEP_COUNT: 6

STEP_IDS: R_CAL03_1 → R_CAL03_2 → R_CAL03_3 → R_CAL03_4 → R_CAL03_5 → R_CAL03_6

EDITORIAL_SOURCE_ID: CAL-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-usar-el-transporte-publico

EN PATH: /en/resources/printable-routines/#pack-rutina-usar-el-transporte-publico

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-079

ROUTINE_ID: rutina-subir-y-bajar-del-autobus-o-metro

ES TÍTULO: Subir y bajar del autobús o metro

EN TITLE: Get on and off the bus or metro

CONTEXT: salir

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_CAL04_1 → R_CAL04_2 → R_CAL04_3 → R_CAL04_4 → R_CAL04_5

EDITORIAL_SOURCE_ID: CAL-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-subir-y-bajar-del-autobus-o-metro

EN PATH: /en/resources/printable-routines/#pack-rutina-subir-y-bajar-del-autobus-o-metro

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-080

ROUTINE_ID: rutina-comprar-en-una-tienda

ES TÍTULO: Comprar en una tienda

EN TITLE: Shop in a shop

CONTEXT: salir

STAGES: todas

STEP_COUNT: 6

STEP_IDS: R_CAL05_1 → R_CAL05_2 → R_CAL05_3 → R_CAL05_4 → R_CAL05_5 → R_CAL05_6

EDITORIAL_SOURCE_ID: CAL-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-comprar-en-una-tienda

EN PATH: /en/resources/printable-routines/#pack-rutina-comprar-en-una-tienda

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-081

ROUTINE_ID: rutina-pagar

ES TÍTULO: Pagar

EN TITLE: Pay

CONTEXT: salir

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_CAL06_1 → R_CAL06_2 → R_CAL06_3 → R_CAL06_4 → R_CAL06_5

EDITORIAL_SOURCE_ID: CAL-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-pagar

EN PATH: /en/resources/printable-routines/#pack-rutina-pagar

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-082

ROUTINE_ID: rutina-guardar-el-ticket-y-el-cambio

ES TÍTULO: Guardar el ticket y el cambio

EN TITLE: Keep the receipt and change

CONTEXT: salir

STAGES: todas

STEP_COUNT: 3

STEP_IDS: R_CAL07_1 → R_CAL07_2 → R_CAL07_3

EDITORIAL_SOURCE_ID: CAL-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-guardar-el-ticket-y-el-cambio

EN PATH: /en/resources/printable-routines/#pack-rutina-guardar-el-ticket-y-el-cambio

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-083

ROUTINE_ID: rutina-pedir-ayuda

ES TÍTULO: Pedir ayuda

EN TITLE: Ask for help

CONTEXT: salir

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAL08_1 → R_CAL08_2 → R_CAL08_3 → R_CAL08_4

EDITORIAL_SOURCE_ID: CAL-08

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-pedir-ayuda

EN PATH: /en/resources/printable-routines/#pack-rutina-pedir-ayuda

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-084

ROUTINE_ID: rutina-orientarse-en-un-lugar-conocido

ES TÍTULO: Orientarse en un lugar conocido

EN TITLE: Find your way in a familiar place

CONTEXT: salir

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_CAL09_1 → R_CAL09_2 → R_CAL09_3 → R_CAL09_4

EDITORIAL_SOURCE_ID: CAL-09

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-orientarse-en-un-lugar-conocido

EN PATH: /en/resources/printable-routines/#pack-rutina-orientarse-en-un-lugar-conocido

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-085

ROUTINE_ID: rutina-salir-del-sitio-cuando-hay-sobrecarga

ES TÍTULO: Salir del sitio cuando hay sobrecarga

EN TITLE: Leave when you are overloaded

CONTEXT: salir

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_CAL11_1 → R_CAL11_2 → R_CAL11_3 → R_CAL11_4 → R_CAL11_5

EDITORIAL_SOURCE_ID: CAL-11

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-salir-del-sitio-cuando-hay-sobrecarga

EN PATH: /en/resources/printable-routines/#pack-rutina-salir-del-sitio-cuando-hay-sobrecarga

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-086

ROUTINE_ID: rutina-prepararse-para-salir

ES TÍTULO: Prepararse para salir

EN TITLE: Get ready to go out

CONTEXT: tiempo

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_TIE01_1 → R_TIE01_2 → R_TIE01_3 → R_TIE01_4

EDITORIAL_SOURCE_ID: TIE-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-prepararse-para-salir

EN PATH: /en/resources/printable-routines/#pack-rutina-prepararse-para-salir

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-087

ROUTINE_ID: rutina-terminar-una-actividad

ES TÍTULO: Terminar una actividad

EN TITLE: Finish an activity

CONTEXT: tiempo

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_TIE02_1 → R_TIE02_2 → R_TIE02_3 → R_TIE02_4

EDITORIAL_SOURCE_ID: TIE-02

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-terminar-una-actividad

EN PATH: /en/resources/printable-routines/#pack-rutina-terminar-una-actividad

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-088

ROUTINE_ID: rutina-cambiar-de-tarea

ES TÍTULO: Cambiar de tarea

EN TITLE: Switch task

CONTEXT: tiempo

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_TIE03_1 → R_TIE03_2 → R_TIE03_3 → R_TIE03_4 → R_TIE03_5

EDITORIAL_SOURCE_ID: TIE-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-cambiar-de-tarea

EN PATH: /en/resources/printable-routines/#pack-rutina-cambiar-de-tarea

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-089

ROUTINE_ID: rutina-esperar

ES TÍTULO: Esperar

EN TITLE: Wait

CONTEXT: tiempo

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_TIE04_1 → R_TIE04_2 → R_TIE04_3 → R_TIE04_4

EDITORIAL_SOURCE_ID: TIE-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-esperar

EN PATH: /en/resources/printable-routines/#pack-rutina-esperar

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-090

ROUTINE_ID: rutina-seguir-una-cuenta-atras-visual

ES TÍTULO: Seguir una cuenta atrás visual

EN TITLE: Follow a visual countdown

CONTEXT: tiempo

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_TIE05_1 → R_TIE05_2 → R_TIE05_3 → R_TIE05_4

EDITORIAL_SOURCE_ID: TIE-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-seguir-una-cuenta-atras-visual

EN PATH: /en/resources/printable-routines/#pack-rutina-seguir-una-cuenta-atras-visual

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-091

ROUTINE_ID: rutina-organizar-la-secuencia-de-la-tarde

ES TÍTULO: Organizar la secuencia de la tarde

EN TITLE: Plan the afternoon sequence

CONTEXT: tiempo

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_TIE06_1 → R_TIE06_2 → R_TIE06_3 → R_TIE06_4

EDITORIAL_SOURCE_ID: TIE-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-organizar-la-secuencia-de-la-tarde

EN PATH: /en/resources/printable-routines/#pack-rutina-organizar-la-secuencia-de-la-tarde

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-092

ROUTINE_ID: rutina-primero-despues

ES TÍTULO: Primero → después

EN TITLE: First → then

CONTEXT: tiempo

STAGES: todas

STEP_COUNT: 2

STEP_IDS: R_TIE07_1 → R_TIE07_2

EDITORIAL_SOURCE_ID: TIE-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-primero-despues

EN PATH: /en/resources/printable-routines/#pack-rutina-primero-despues

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-093

ROUTINE_ID: rutina-preparar-el-pijama

ES TÍTULO: Preparar el pijama

EN TITLE: Get your pyjamas ready

CONTEXT: manana

STAGES: todas

STEP_COUNT: 3

STEP_IDS: R_NOC01_1 → R_NOC01_2 → R_NOC01_3

EDITORIAL_SOURCE_ID: NOC-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-preparar-el-pijama

EN PATH: /en/resources/printable-routines/#pack-rutina-preparar-el-pijama

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-094

ROUTINE_ID: rutina-higiene-nocturna

ES TÍTULO: Higiene nocturna

EN TITLE: Night-time hygiene

CONTEXT: manana

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_NOC02_1 → R_NOC02_2 → R_NOC02_3 → R_NOC02_4

EDITORIAL_SOURCE_ID: NOC-02

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-higiene-nocturna

EN PATH: /en/resources/printable-routines/#pack-rutina-higiene-nocturna

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-095

ROUTINE_ID: rutina-dejar-preparadas-las-cosas-del-dia-siguiente

ES TÍTULO: Dejar preparadas las cosas del día siguiente

EN TITLE: Get tomorrow's things ready

CONTEXT: manana

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_NOC03_1 → R_NOC03_2 → R_NOC03_3 → R_NOC03_4

EDITORIAL_SOURCE_ID: NOC-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-dejar-preparadas-las-cosas-del-dia-siguiente

EN PATH: /en/resources/printable-routines/#pack-rutina-dejar-preparadas-las-cosas-del-dia-siguiente

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-096

ROUTINE_ID: rutina-apagar-pantallas-y-luces

ES TÍTULO: Apagar pantallas y luces

EN TITLE: Turn off screens and lights

CONTEXT: manana

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_NOC04_1 → R_NOC04_2 → R_NOC04_3 → R_NOC04_4

EDITORIAL_SOURCE_ID: NOC-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-apagar-pantallas-y-luces

EN PATH: /en/resources/printable-routines/#pack-rutina-apagar-pantallas-y-luces

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-097

ROUTINE_ID: rutina-acostarse

ES TÍTULO: Acostarse

EN TITLE: Go to bed

CONTEXT: manana

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_NOC05_1 → R_NOC05_2 → R_NOC05_3 → R_NOC05_4

EDITORIAL_SOURCE_ID: NOC-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-acostarse

EN PATH: /en/resources/printable-routines/#pack-rutina-acostarse

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-098

ROUTINE_ID: rutina-preparar-el-ambiente-de-descanso

ES TÍTULO: Preparar el ambiente de descanso

EN TITLE: Set up a restful room

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_NOC06_1 → R_NOC06_2 → R_NOC06_3 → R_NOC06_4 → R_NOC06_5

EDITORIAL_SOURCE_ID: NOC-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-preparar-el-ambiente-de-descanso

EN PATH: /en/resources/printable-routines/#pack-rutina-preparar-el-ambiente-de-descanso

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-099

ROUTINE_ID: rutina-volver-a-la-cama-si-te-despiertas

ES TÍTULO: Volver a la cama si te despiertas

EN TITLE: Go back to bed if you wake up

CONTEXT: manana

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_NOC07_1 → R_NOC07_2 → R_NOC07_3 → R_NOC07_4 → R_NOC07_5

EDITORIAL_SOURCE_ID: NOC-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-volver-a-la-cama-si-te-despiertas

EN PATH: /en/resources/printable-routines/#pack-rutina-volver-a-la-cama-si-te-despiertas

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-100

ROUTINE_ID: rutina-tomar-la-medicacion

ES TÍTULO: Tomar la medicación

EN TITLE: Take your medication

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_OTR01_1 → R_OTR01_2 → R_OTR01_3 → R_OTR01_4

EDITORIAL_SOURCE_ID: OTR-01

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-tomar-la-medicacion

EN PATH: /en/resources/printable-routines/#pack-rutina-tomar-la-medicacion

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-101

ROUTINE_ID: rutina-prepararse-para-el-dentista

ES TÍTULO: Prepararse para el dentista

EN TITLE: Get ready for the dentist

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 6

STEP_IDS: R_OTR02_1 → R_OTR02_2 → R_OTR02_3 → R_OTR02_4 → R_OTR02_5 → R_OTR02_6

EDITORIAL_SOURCE_ID: OTR-02

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-prepararse-para-el-dentista

EN PATH: /en/resources/printable-routines/#pack-rutina-prepararse-para-el-dentista

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-102

ROUTINE_ID: rutina-cargar-el-telefono

ES TÍTULO: Cargar el teléfono

EN TITLE: Charge your phone

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_OTR03_1 → R_OTR03_2 → R_OTR03_3 → R_OTR03_4

EDITORIAL_SOURCE_ID: OTR-03

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-cargar-el-telefono

EN PATH: /en/resources/printable-routines/#pack-rutina-cargar-el-telefono

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-103

ROUTINE_ID: rutina-manejar-el-dinero-de-la-semana

ES TÍTULO: Manejar el dinero de la semana

EN TITLE: Manage the week's money

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_OTR04_1 → R_OTR04_2 → R_OTR04_3 → R_OTR04_4 → R_OTR04_5

EDITORIAL_SOURCE_ID: OTR-04

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-manejar-el-dinero-de-la-semana

EN PATH: /en/resources/printable-routines/#pack-rutina-manejar-el-dinero-de-la-semana

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-104

ROUTINE_ID: rutina-abrir-un-envase-dificil

ES TÍTULO: Abrir un envase difícil

EN TITLE: Open a tricky package

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_OTR05_1 → R_OTR05_2 → R_OTR05_3 → R_OTR05_4

EDITORIAL_SOURCE_ID: OTR-05

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-abrir-un-envase-dificil

EN PATH: /en/resources/printable-routines/#pack-rutina-abrir-un-envase-dificil

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-105

ROUTINE_ID: rutina-contestar-a-la-puerta-o-al-telefono

ES TÍTULO: Contestar a la puerta o al teléfono

EN TITLE: Answer the door or the phone

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_OTR06_1 → R_OTR06_2 → R_OTR06_3 → R_OTR06_4 → R_OTR06_5

EDITORIAL_SOURCE_ID: OTR-06

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-contestar-a-la-puerta-o-al-telefono

EN PATH: /en/resources/printable-routines/#pack-rutina-contestar-a-la-puerta-o-al-telefono

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-106

ROUTINE_ID: rutina-usar-una-lista-de-la-compra

ES TÍTULO: Usar una lista de la compra

EN TITLE: Use a shopping list

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_OTR07_1 → R_OTR07_2 → R_OTR07_3 → R_OTR07_4

EDITORIAL_SOURCE_ID: OTR-07

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-usar-una-lista-de-la-compra

EN PATH: /en/resources/printable-routines/#pack-rutina-usar-una-lista-de-la-compra

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-107

ROUTINE_ID: rutina-descansar-antes-de-agotarte

ES TÍTULO: Descansar antes de agotarte

EN TITLE: Rest before you crash

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_OTR08_1 → R_OTR08_2 → R_OTR08_3 → R_OTR08_4 → R_OTR08_5

EDITORIAL_SOURCE_ID: OTR-08

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-descansar-antes-de-agotarte

EN PATH: /en/resources/printable-routines/#pack-rutina-descansar-antes-de-agotarte

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-108

ROUTINE_ID: rutina-prepararse-para-un-cambio-previsto

ES TÍTULO: Prepararse para un cambio previsto

EN TITLE: Get ready for a planned change

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 5

STEP_IDS: R_OTR09_1 → R_OTR09_2 → R_OTR09_3 → R_OTR09_4 → R_OTR09_5

EDITORIAL_SOURCE_ID: OTR-09

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-prepararse-para-un-cambio-previsto

EN PATH: /en/resources/printable-routines/#pack-rutina-prepararse-para-un-cambio-previsto

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## WEB-ROUTINE-109

ROUTINE_ID: rutina-recargar-el-abono-de-transporte

ES TÍTULO: Recargar el abono de transporte

EN TITLE: Top up your travel card

CONTEXT: cuidarse

STAGES: todas

STEP_COUNT: 4

STEP_IDS: R_OTR10_1 → R_OTR10_2 → R_OTR10_3 → R_OTR10_4

EDITORIAL_SOURCE_ID: OTR-10

EDITORIAL_SOURCE_STATUS: RECORDED

ES RUTA: /es/recursos/rutinas-imprimibles/#pack-rutina-recargar-el-abono-de-transporte

EN PATH: /en/resources/printable-routines/#pack-rutina-recargar-el-abono-de-transporte

DOWNLOADABLE_SVG_A4: true

WATERMARK: true

PICTOGRAM_TRACEABILITY: CENTRAL_MANIFEST

ORIGEN: SOURCE_DERIVED

ESTADO: BILINGUAL_COMPLETE

---

## QA · RUTINAS IMPRIMIBLES / PRINTABLE ROUTINES

- SOURCE_RECORDS: 109/109
- UNIQUE_ROUTINE_IDS: 109/109
- ES_EN_TITLES: 109/109
- ES_PUBLIC_ROUTES: 109/109
- EN_PUBLIC_ROUTES: 109/109
- DOWNLOADABLE_SVG_A4: 109/109
- PICTOGRAM_TRACEABILITY_PRESENT: 109/109
- EDITORIAL_SOURCE_STATUS_COUNTS: LEGACY_NO_ROUTINE_SOURCE_ID=30 · RECORDED=79
- LICENSE_PIN_STATUS: PENDING_PROJECT_RECONCILIATION_PER_R42_BRIEF
- STATUS: PASS

SIGUIENTE FASE: recursos específicos, intereses y otros corpus estructurados de Iris Green.
