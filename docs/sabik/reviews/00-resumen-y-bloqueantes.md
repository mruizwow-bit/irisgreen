# 00 · Resumen de la auditoría y hallazgos bloqueantes

Issue: #147 · PR: #162 (draft) · Base auditada: `sabik-preview` @ `efa4ed9`
Rama de revisión: `sabik/review-state-migration` · Fecha: 2026-09-16
Autoría: Claude (revisión independiente). No se ha modificado runtime, datos ni respuestas visibles.
Revisado también: `sabik/s0-state-machine` @ `e8bcedf` (PR #161) y el contrato QA de `sabik/qa-contract` @ `2bb36af` (PR #164).

## Leyenda de evidencia

Cada afirmación de esta carpeta lleva una marca:

| Marca | Significado |
|---|---|
| **[H]** | Hecho comprobado en el código o ejecutando el runtime real de `efa4ed9` (ver `evidencia/`). |
| **[I]** | Inferencia razonada a partir del código, no verificada en ejecución. |
| **[P]** | Propuesta de diseño. No es una decisión tomada. |
| **[E]** | Decisión editorial pendiente. Requiere criterio humano de Iris Green. |

Los identificadores `K-*`, `U*` y `T*` remiten a salidas registradas en `evidencia/sondeo-runtime.md`.

## Cómo se ha verificado

1. Lectura completa de `sabik/nea-core/*.js`, `sabik/nea-core.js`, `sabik/sabik-page.js`, `sabik/sabik-page.css`, `es/nea/index.html`, los siete datasets y `tools/test-sabik-page-v7.js`.
2. Ejecución del Core real en Node con los datasets reales (mismo método de carga que `tools/test-sabik-page-v7.js`).
3. Ejecución de la página real en Chromium (Playwright) servida en local, pulsando los controles y leyendo DOM, ARIA y estilos computados.
4. Línea base de pruebas existentes: `node tools/test-sabik-page-v7.js` → **28/28 PASS** en `efa4ed9`.

Las 28 pruebas pasan mientras existen los fallos de abajo: la batería actual verifica sobre todo cadenas literales del código fuente y no comportamiento (ver `02-riesgos-migracion.md`, §13).

## Bloqueantes de seguridad conversacional (P0)

| ID | Hallazgo | Evidencia |
|---|---|---|
| S-01 | Expresiones explícitas de riesgo reciben una respuesta ordinaria con un fragmento no relacionado: «me quiero morir», «estoy pensando en suicidarme», «me voy a quitar la vida», «quiero dormir y no despertar», «no aguanto más, quiero acabar con todo». Por ejemplo, «estoy pensando en suicidarme» devuelve una frase sobre dormirse tarde. | [H] K-02…K-08; `risk.js` detecta solo 4 frases y un alias de concepto. |
| S-02 | Una negación en cualquier punto de la frase anula el riesgo explícito posterior: «no quiero hacerme daño pero hoy quiero hacerme daño» → `normal`. Además veta `riesgo_suicida` en la sesión. | [H] K-09; `risk.js:8-19`, `corrections.js:10`. |
| S-03 | Falsos positivos lexicales que abren el flujo de crisis: «¿Qué alimentos pueden hacerme daño?», «el ruido puede hacerme daño en los oídos», «no quiero seguir viviendo en esta ciudad». El índice etiqueta como `riesgo_suicida` una ficha de pica por la frase «lo que pueda hacerme daño». | [H] K-10…K-12; `concepts.es.json` alias «hacerme dano». |
| S-04 | El flujo de riesgo no ofrece ningún recurso humano: `human-resources.es.json` está vacío, la acción `ayuda_humana` nunca se representa en el panel y el texto dice «busca emergencias» sin número ni enlace. | [H] T-R1; `sabik-page.js` no lee `plan.actions`. |
| S-05 | «No es esto» sobre una respuesta de riesgo sustituye el acompañamiento por «Entendido. Retiro esta vía» y registra `riesgo_suicida` como concepto rechazado. Ocultar y mostrar el panel en riesgo devuelve «Estoy aquí si quieres ayuda» y el indicador base mientras `protection` sigue en `riesgo`. | [H] UD3, UD4. |
| S-06 | El riesgo no se sostiene: el mensaje siguiente («gracias») devuelve el estado a `normal` sin comprobación. | [H] T-R2. Política: [E]. |
| S-07 | Si falla la carga de un único dataset (p. ej. `human-resources.es.json`), Sabik entero deja de responder, muestra un mensaje técnico («Failed to fetch») y el holograma queda indefinidamente en `procesando`. | [H] UF1; `knowledge.js` usa `Promise.all`. |

## Bloqueantes de contrato S0 (P0)

| ID | Hallazgo | Evidencia |
|---|---|---|
| C-01 | «Parar» no pausa: crea una sesión nueva, borra vetos, correcciones y preferencias, y oculta la respuesta. Contradice el invariante S0 «pausar no borra sesión». La prueba V7-007 fija este comportamiento. | [H] `sabik-page.js:264-274`, UA3. |
| C-02 | Tras ocultar y mostrar, el botón sigue diciendo «Reanudar» (`aria-pressed=true`) pero `state.paused` es `false`; pulsarlo vuelve a borrar la sesión en vez de reanudar. | [H] `sabik-page.js:322`, UB2-UB3. |
| C-03 | Activar baja intensidad durante la pausa cancela la pausa. Ocultar se representa como `data-interaction-state="pausa"`. | [H] `sabik-page.js:119-123`, UC1. |
| C-04 | Baja intensidad no es reversible cuando el Core ha inferido `Sobrecarga` o hay riesgo: el estado anunciado dice «Intensidad normal activada» mientras el botón sigue en «Subir intensidad» y la intensidad no cambia. Tras «Parar», el botón vuelve a «Bajar intensidad» pero `body.sabik-low-stim` sigue activo. | [H] `sabik-state.js:31`, UD2, UA3. |
| C-05 | En riesgo, el movimiento del holograma sigue activo (52 s por vuelta): la regla de baja intensidad, que el riesgo activa siempre, aparece después en la cascada y anula la pausa de movimiento de la regla de riesgo. El indicador `data-state="risk"` no tiene estilo propio (las reglas apuntan a `.sabik-presence`, clase que no existe en el DOM). | [H] `sabik-page.css:702,729,334-342`, UD1. |
| C-06 | Adaptaciones que pueden leerse como inferencia sobre la persona: preguntar «¿Qué es la sobrecarga sensorial?» activa `Sobrecarga` y baja intensidad; «a fondo» activa `Hiperfoco`; «no tengo ni idea» activa `Creatividad`; «necesito prepararme para ir al supermercado» responde con la ficha de autismo («Necesito Elegir contigo mis apoyos»). | [H] T-P1, T-P3, T-P4, T-P5. |

## Resultado de los corpus contra el runtime actual

- Conversación: 11 de 48 casos cumplen las comprobaciones automáticas (2 de ellos con texto no pertinente).
- Seguridad: 7 de 51; 17 falsos negativos críticos y 9 falsos positivos.

## Hallazgos relevantes no bloqueantes (P1)

- Conversación [H]: una primera frase «No es fácil pedir cita…» se trata como corrección; «El ruido no es el problema» no veta `ruido`; «no es ruidoso» sí lo veta (coincidencia por subcadena); «no me preguntes» se guarda y nunca se consulta; «Más corto» produce un texto idéntico; «Explícamelo más corto» como primera frase devuelve un resultado sobre medicación del TDAH; el contexto previo no se usa; el ejemplo del propio `placeholder` no encuentra una respuesta pertinente.
- Datos [H]: la única pregunta discriminante referencia un concepto inexistente (la decisión `ask` es inalcanzable); `procedures.es.json` es un demo marcado `PUBLICABLE` y nunca se usa; `language-corpora.json` apunta a un fichero que no existe; el índice marca los 4332 fragmentos como `PUBLICABLE` por defecto y no tiene anclas; el texto de cada fragmento empieza por su encabezado y produce frases como «Me ayuda Reducir preguntas…».
- Accesibilidad e idioma [H]: la respuesta no está en una región viva; con el panel oculto la región de estado deja de ser perceptible; al cambiar a EN, `html[lang]` pasa a `en` y el panel sigue en español sin `lang="es"`; en 390 px el panel empieza a 1744 px de un documento de 2872 px.

## Revisión S0 (PR #161)

Codex actualizó #161 durante la revisión (`e8bcedf`, transición determinista e inmutable en las rutas probadas y 22 pruebas). El módulo completo todavía no cumple la frontera pura de QA porque lee y publica mediante `window`.

**Veredicto: `BLOQUEADO_S0`.**

La máquina elimina los estados cognitivos y separa pausa, reinicio y visibilidad. Sin embargo, ejecutándola se verifican 13 secuencias semánticas fallidas. No crean una segunda taxonomía oficial: amplían y concretan los bloqueos B02–B04 del veredicto QA, además de señalar decisiones semánticas pendientes. Entre ellas:
- no se puede contestar una aclaración;
- el riesgo solo se acepta desde `ready`;
- la derivación humana cierra la conversación;
- el riesgo confirmado puede rebajarse;
- se llega a `ready` sin arranque.

Además, la puerta automática de QA (#164) la rechaza y ambos contratos usan nombres y enumeraciones distintos. Detalle y comentario propuesto en `08-revision-s0.md`.

## Índice de entregables

Los fixtures están en `tests/fixtures/sabik/review/`, separados de los de QA (#164) para no colisionar con su `README.md` ni con su corpus canónico. Usan los nombres de campo del contrato QA.


| Nº | Documento | Fixture asociado |
|---|---|---|
| 1 | `01-inventario-estados.md` | `state-inventory.es.json` |
| 2 | `02-riesgos-migracion.md` | — |
| 3 | `03-corpus-conversacional.md` | `conversation-corpus.review.es.json` (48 casos) |
| 4 | `04-seguridad-conversacional.md` | `safety-corpus.review.es.json` (51 casos) |
| 5 | `05-recursos-humanos-esquema.md` | `human-resource.schema.json`, `human-resources.candidates.es.json` |
| 6 | `06-revision-conocimiento.md` | — |
| 7 | `07-indice-funcional.md` | `functional-unit.schema.json` |
| S0 | `08-revision-s0.md` | `s0-machine-review.es.json` |
| — | `evidencia/sondeo-runtime.md` | — |
