# 03 · Corpus conversacional

Fixture: `tests/fixtures/sabik/review/conversation-corpus.review.es.json` (48 casos).
Base observada: `sabik-preview` @ `efa4ed9`. Leyenda en `00-resumen-y-bloqueantes.md`.

## 1. Qué contiene cada caso

Cada caso declara lo que pide la orden, con los nombres del contrato QA (PR #164) para no crear un segundo esquema:

| Pedido en #147 | Campo |
|---|---|
| entrada | `entrada` (y `entrada_es_control` si representa un botón) |
| contexto previo | `contexto_anterior` (turnos `persona`, `sabik` y `control`) |
| intención esperada | `intencion` |
| conceptos esperados / prohibidos | `conceptos_esperados`, `conceptos_prohibidos` (IDs de `concepts.es.json`) |
| tipo de respuesta esperado | `tipo_respuesta_detallado` y su proyección QA `tipo_salida` |
| si debe preguntar | `pregunta_si_no` |
| si debe reconocer insuficiencia | `debe_reconocer_insuficiencia` |
| si debe conservar el tema anterior | `conservar_tema_anterior` (`true`, `false`, `null` si no hay tema) |

Campos opcionales que afinan la comprobación: `conceptos_a_vetar`, `conceptos_que_no_deben_vetarse`, `primera_fuente_patron`, `fuentes_prohibidas_patron`, `no_debe_cambiar_adaptacion`, `debe_mantener_capa_seguridad`, `preferencias_esperadas`.

**[P]** Las expectativas son propuestas de diseño. `conceptos_no_existentes_en_dataset` lista los conceptos que el caso necesita y que hoy no existen (`cita_sanitaria`, `atencion_psicologica`, `dislexia`, `autismo`, `compras`, `ayuda_transporte`). **[E]** Crearlos es decisión editorial.

**[P]** Tipos de respuesta nuevos propuestos: `correction_with_new_route` (acuse y nueva vía en el mismo turno), `correction_prompt` (retirar y pedir corrección), `preference_acknowledged`, `shortened_reformulation` (acortar sin volver a buscar) y `out_of_scope`.

## 2. Resultado actual por categoría

Comprobaciones automáticas contra el Core real **[H]**. «Fallan» lista los sufijos de ID.

| Categoría | Casos | Cumplen | Fallan |
|---|---|---|---|
| Primera consulta que empieza por «No es…» | 4 | 0 | NOES-001…004 |
| Corrección real después de una respuesta | 4 | 0 | CORR-001…004 |
| Negación con distintos órdenes | 5 | 1 | NEG-001…004 |
| Continuación contextual | 3 | 0 | CONT-001…003 |
| Cambio de tema | 3 | 1 | TEMA-001, TEMA-002 |
| «No es esto» | 3 | 1 | NOESTO-002, NOESTO-003 |
| «Buscar por otra vía» | 3 | 2 | VIA-001 |
| «No me preguntes» | 3 | 1 | NOPREG-002, NOPREG-003 |
| «Dame una sola opción» | 3 | 1 | UNA-002, UNA-003 |
| «Explícamelo más corto» | 3 | 0 | CORTO-001…003 |
| Petición informativa | 3 | 1 | INFO-001, INFO-003 |
| Petición práctica | 4 | 0 | PRAC-001…004 |
| Petición de acompañamiento | 3 | 2 | ACOMP-002 |
| Consulta fuera del conocimiento | 3 | 1 | FUERA-002, FUERA-003 |
| Índice funcional | 1 | 0 | FUNC-001 |
| **Total** | **48** | **11** | **37** |

Dos de los 11 «cumple» son falsos cumplimientos (`observacion_revisor`): CONV-UNA-001 responde con una ficha de `/es/taller` por la coincidencia «una sola», y CONV-NOPREG-001 con apoyos en la universidad. Ambos fragmentos están etiquetados con `ruido` por coincidencia léxica en el índice. Las comprobaciones automáticas son necesarias, no suficientes.

## 3. Patrones de fallo

**Corrección sin referente [H].** `classifyIntent()` decide «corrección» por el prefijo «no es» o por « no es » en cualquier posición. «No es la primera vez que…», «No es normal que…» y «No es fácil pedir cita…» reciben «Entendido. Retiro esa vía» en el primer turno.

**Negación posicional [H].** `detectNegations()` exige «no es / no quiero / no me molesta» seguido del término. Falla con «El ruido no es el problema», «Ruido no, lo que me pesa es elegir» y «Eso no tiene nada que ver con el ruido». Veta en falso en «No quiero elegir entre tantas marcas» (la negación describe la dificultad).

**Corrección que no avanza [H].** Incluso cuando veta bien (CORR-002), el texto solo acusa recibo y no presenta la nueva vía. Con pronombre («no es eso») no veta el concepto anterior.

**Contexto ignorado [H].** `active_concepts` se acumula pero no interviene en la recuperación. «¿y qué hago después?» busca por léxico; «¿y eso cómo se prepara?» termina en insuficiencia. Sin contexto, la misma frase devuelve un fragmento al azar en vez de preguntar.

**Preferencias como consultas [H].** «No me preguntes», «Dame una sola opción» y «Explícamelo más corto» se procesan además como búsqueda. La negación de una preferencia no la revierte. «menos texto» activa también el concepto `baja_demanda`.

**Coincidencia léxica en lugar de intención [H].** «¿Por qué no me preguntas qué me pasa?» y «¿Puedes quedarte con la lista…?» se resuelven por palabras sueltas. El segundo recibe «Estoy aquí», aunque pide persistencia, que el contrato prohíbe.

**Adaptación indebida [H].** «¿Qué es la sobrecarga sensorial?» responde bien, pero cambia el estado a `Sobrecarga` y activa baja intensidad (CONV-INFO-001, `adaptacion`).

## 4. Reglas propuestas

Todas **[P]**.

1. Una corrección necesita un referente: una respuesta previa en la sesión. Sin él, la negación veta conceptos pero la frase se trata como consulta.
2. «No es esto» retira la vía y pregunta; «Buscar por otra vía» conserva el concepto y excluye solo los fragmentos ya mostrados. Son eventos distintos, no variantes de `SUBMIT`.
3. Las preferencias son eventos de adaptación (`SET_RESPONSE_LENGTH`, `SET_MAX_OPTIONS`, `SET_QUESTION_POLICY`), reversibles, y no generan búsqueda si la frase no contiene otra petición.
4. «Más corto» reformula el último plan; no reejecuta la consulta.
5. Continuación sin referente → una pregunta breve, nunca un fragmento al azar.
6. Ninguna frase informativa altera la adaptación.
7. La negación se resuelve por alcance (qué término está bajo la negación), no por contigüidad ni subcadena.

## 5. Decisiones editoriales pendientes

- **[E]** Texto de acuse de corrección y de «otra vía».
- **[E]** Crear conceptos para cita sanitaria, atención psicológica, compras, ayudas de transporte y condiciones (dislexia, autismo).
- **[E]** Longitud objetivo de «corto».
- **[E]** Si «¿Cómo pido cita?» sin contexto debe preguntar por el servicio o mostrar una guía general.
