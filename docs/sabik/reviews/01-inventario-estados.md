# 01 · Inventario de estados

Base: `sabik-preview` @ `efa4ed9`. Leyenda en `00-resumen-y-bloqueantes.md`.
Versión legible por máquina: `tests/fixtures/sabik/state-inventory.es.json`.

## 1. Dónde nacen los estados

| Capa | Origen | Función | Consumidor |
|---|---|---|---|
| Constantes declaradas | `nea-core/state.js` | objeto `NEACoreState` | `sabik-state.js`, `retrieval.js`, `nea-core.js` |
| Estado compuesto de Sabik | `nea-core/sabik-state.js` | `defaultSabikState()`, `sabikStateFromLayers()` | `session.js` |
| Sesión | `nea-core/session.js` | `createSessionState()`, `applySessionUpdate()`, `registerPlanRejection()`, `setSessionPreferences()` | `response.js`, `sabik-page.js` |
| Riesgo | `nea-core/risk.js` | `detectRisk()` devuelve cadenas libres | `response.js`, `retrieval.js`, `decision.js`, `sabik-state.js` |
| Estado «cognitivo» | `nea-core/retrieval.js` | `detectCognitiveState()` | `session.js`, `language.js` |
| Intención | `nea-core/intent.js` | `INTENTS`, `classifyIntent()` | `response.js`, `decision.js` |
| Decisión y plan | `decision.js`, `response.js` | `decideCore()`, `buildResponsePlan()` | `sabik-page.js` |
| Estado de interfaz | `sabik-page.js` | objeto local `state`, `applySabikVisual()`, `setStatus()`, manejadores de botones | DOM y CSS |
| Estado visual | `sabik-page.css` | selectores por `data-*` y clases | navegador |

**[H]** No existe una única fuente de verdad: el Core calcula `sabik_state`, pero la página ignora la mayoría de sus campos y usa su propio vocabulario (`espera`, `procesando`, `respuesta`, `correccion`) y un booleano local `state.paused` que el Core desconoce.

## 2. Estados declarados en `state.js` y uso real

| Grupo | Valor | Alcanzable | Dónde se asigna | ¿Se representa? |
|---|---|---|---|---|
| `COGNITIVE_STATES` | `NucleoBase` | sí | por defecto | `data-cognitive-state` (sin CSS, V7-017) |
| | `Hiperfoco` | sí, por «profundiza», «quiero entender», «a fondo» | `retrieval.js:67` | ídem |
| | `Sobrecarga` | sí, por «no puedo pensar», «estoy saturad», «sobrecarga» **y por cualquier riesgo** | `retrieval.js:59-64` | ídem; además cambia longitud, preguntas e intensidad |
| | `Vinculo` | sí, por «acompaname», «quedate» | `retrieval.js:73` | ídem |
| | `VozInterior` | sí, por «no se que siento», «necesito poner palabras» | `retrieval.js:70` | ídem |
| | `Creatividad` | sí, por subcadenas «idea», «crear», «imagin» | `retrieval.js:76` | ídem |
| `FUNCTIONAL_STATES` | `Available` | sí | por defecto | no |
| | `Listening` | sí, solo en riesgo | `sabik-state.js:34` | no |
| | `Processing`, `Learning`, `Calm`, `Waiting` | **no** | — | no |
| `VISUAL_MODES` | `Abstracta` | sí (fijo) | por defecto | no |
| | `Invisible`, `CompaneraNoHumana`, `Humana` | **no** | — | no |
| `MOTION_LEVELS` | `Low` | sí | por defecto | **no**; el CSS no lo lee |
| | `Off` | sí, con baja demanda | `sabik-state.js:35` | **no**; el CSS mantiene el movimiento |
| | `Soft` | **no** | — | no |
| `INTERACTION_STATES` | `base` | sí | por defecto | no (la página usa `espera`) |
| | `claridad` | sí, en riesgo | `sabik-state.js:37` | no (la página usa `respuesta`) |
| | `pausa` | sí, **con baja demanda** | `sabik-state.js:37` | no; la página usa su propio `pausa` con otro significado |
| | `exploracion`, `error`, `cierre` | **no** | — | no |
| `RESPONSE_MODES` | `busqueda` | sí | por defecto | no |
| | `practico` | sí, **solo en riesgo** | `sabik-state.js:38` | no |
| | `aprendizaje`, `reformulacion` | **no** | — | no |
| `PROTECTION_STATES` | `normal` | sí | por defecto | `data-protection-state` |
| | `riesgo` | sí, para riesgo confirmado **y ambiguo** | `sabik-state.js:40` | `data-protection-state`, `data-state=risk` |
| | `privacidad`, `limites` | **no** | — | no |
| `PRESENCE_STATES` | `visible` | sí | por defecto | traducido a `base` |
| | `minima` | sí, con baja demanda | `sabik-state.js:41` | traducido a `minimal` |
| | `estatica` | sí, en riesgo | `sabik-state.js:41` | traducido a `minimal`, pero `risk` gana antes |
| | `suave`, `oculta` | **no** (ocultar el panel no la usa) | — | no |

**[H]** Recuento: 38 valores declarados en 8 grupos (más `PUBLICABLE`); 17 inalcanzables; 7 campos de `sabik_state` que nunca llegan al DOM (`functional_state`, `visual_mode`, `motion_level`, `interaction`, `mode`, `stimulation`, `memory`).

## 3. Cadenas libres no declaradas

| Dominio | Valores | Origen |
|---|---|---|
| Riesgo | `normal`, `acompanamiento_en_riesgo`, `riesgo_ambiguo` | `risk.js:17-22`; comparadas como literales en `retrieval.js`, `decision.js`, `response.js`, `session.js`, `sabik-state.js` |
| Intención | `information_request`, `personal_situation`, `correction`, `practical_request`, `accompaniment` | `intent.js` (constantes locales, fuera de `state.js`) |
| Tipo de plan | `direct_information`, `source_answer`, `practical_steps`, `clarifying_question`, `insufficient_information`, `correction_acknowledged`, `accompaniment_presence`, `risk_accompaniment`, `ambiguous_risk_clarification` | `response.js`, `risk.js`; comparados en `language.js` y `sabik-page.js` |
| Decisión | `accompany`, `respond`, `offer`, `ask`, `insufficient` | `decision.js` |
| Razón | `risk_priority`, `accompaniment_requested`, `lexical_evidence`, `explicit_correction`, `no_supported_possibilities`, `close_supported_possibilities`, `dominant_relation` | `decision.js` |
| `answer_mode` | `information`, `situational`, `practical`, `none` | `response.js:60,223` |
| Estimulación | `normal`, `baja` | `sabik-state.js:39` |
| Memoria y privacidad | `memory: "session"`, `privacy_state: "session_only"` | `sabik-state.js`, `session.js` |
| Preferencias | `response_length: normal/short`, `question_threshold: normal/high`, `max_options: 3/1`, `low_intensity` | `session.js`, `corrections.js`, `sabik-page.js` |
| Motivo de rechazo | `rejected_by_user`, `no_es_esto`, `buscar_otra_via` | `session.js`, `sabik-page.js` |
| Estilo de redacción | `nea_language_v6`, `short_preference`, `overload_brevity`, `protection_first` | `language.js:72-78` |
| Interacción de página | `espera`, `procesando`, `respuesta`, `pausa`, `correccion` | `sabik-page.js` → `data-interaction-state` |
| Indicador | `base`, `minimal`, `risk` | `sabik-page.js` → `#sabik-presence[data-state]` |
| Etiqueta visible | `Disponible`, `Oculto` | `sabik-page.js:261,325`; HTML inicial |
| Pausa local | `state.paused` (booleano) | `sabik-page.js:34` |
| Clases | `sabik-low-stim` (body), `is-collapsed` (panel), `is-risk`, `is-warning` (respuesta) | `sabik-page.js` |
| Literal duplicado | `"Sobrecarga"` y la lista de estados cognitivos | `language.js:76,83,138`; `sabik-page.js:77` |

## 4. Estados inalcanzables o muertos

| Elemento | Motivo | Marca |
|---|---|---|
| `plan.type = clarifying_question` y `decision = ask` | La única pregunta discriminante exige `recuperacion_posterior`, concepto inexistente. | [H] |
| Rama «Ahora no te hago preguntas» | Depende de `clarifying_question`. | [H] |
| `question_threshold = high` | Se guarda y ningún módulo lo lee. | [H] |
| `active_concepts` | Se acumula y no se usa para recuperar ni decidir. | [H] |
| `asked_questions`, `shown_fragments` | Se declaran y nunca se escriben. | [H] |
| `rejected_response_types` | Se escribe y nunca se lee. | [H] |
| `data.resources`, `data.procedures`, `data.corpora` | Se cargan (y su fallo rompe Sabik) pero no se usan. | [H] |
| `plan.actions` | Se calcula y la página no lo representa. | [H] |
| CSS `.sabik-presence[...]` | Ningún elemento tiene la clase `sabik-presence`; el indicador es `.sabik-state-dot#sabik-presence`. | [H] |
| `data-interaction-state="respuesta"` y `"espera"` | Sin reglas CSS propias. | [H] |
| `data-cognitive-state` | Sin reglas CSS por decisión explícita (V7-017). | [H] |

## 5. Estados duplicados

| Concepto | Representaciones simultáneas |
|---|---|
| Riesgo | `session.risk_state`, `sabik_state.protection`, `functional_state=Listening`, `visual_presence=estatica`, `interaction=claridad`, `mode=practico`, `cognitive_state=Sobrecarga`, `plan.type`, `plan.normal_flow_disabled`, `data-protection-state`, `data-state=risk`, clase `is-risk` |
| Baja intensidad | `session_preferences.low_intensity`, `sabik_state.low_intensity`, `stimulation=baja`, `motion_level=Off`, `visual_presence=minima`, `interaction=pausa`, `body.sabik-low-stim`, `data-low-intensity`, `aria-pressed` del botón |
| Pausa | `state.paused`, `interaction=pausa` (Core), `data-interaction-state=pausa` (página), texto y `aria-pressed` del botón |
| Privacidad | `memory=session`, `privacy_state=session_only`, dos `privacy_notice` distintos, `#sabik-memory-note` |
| Lista de estados cognitivos | `state.js` y `sabik-page.js:77` |

## 6. Significados contradictorios

| Cadena | Significados | Marca |
|---|---|---|
| `pausa` | (a) adaptación por baja demanda en el Core; (b) pausa pedida por la persona en la página; (c) panel oculto en la página. | [H] |
| «Parar» | El texto sugiere detener; la acción borra la sesión y pausa. | [H] |
| «Reanudar» | Tras mostrar el panel, el mismo botón vuelve a pausar y borrar. | [H] UB3 |
| `motion_level = Off` | El Core dice sin movimiento; el CSS mantiene movimiento a 52 s por diseño (V7-027). | [H] |
| `protection = riesgo` | Se usa igual para riesgo confirmado y para una frase ambigua («ya no puedo más con este trámite»). | [H] K-20 |
| `Sobrecarga` | Inferencia léxica sobre la persona, efecto del riesgo y efecto de una pregunta informativa. | [H] T-P1 |
| `mode = practico` | Solo se asigna en riesgo, no en peticiones prácticas. | [H] |
| «Intensidad normal activada.» | Se anuncia aunque la intensidad no cambie. | [H] UD2 |
| «Disponible» | Se muestra durante riesgo y durante pausa. | [H] UA3, UD1 |
| `privacy_notice` | «Memoria de sesion, sin persistencia por defecto» sugiere que la persistencia es opcional; el contrato la prohíbe. | [H] `response.js:75`; [E] redacción |

## 7. Mezcla de capas

**[H]** Una misma variable mezcla dimensiones que el contrato S0 separa:

- `sabikStateFromLayers()` recibe estado cognitivo, riesgo y preferencias, y de ahí deriva a la vez operación (`functional_state`), adaptación (`low_intensity`, `stimulation`), presencia visual, movimiento, modo de respuesta y protección.
- El riesgo escribe un estado mental inferido (`Sobrecarga`), que a su vez activa baja intensidad y bloquea el botón para subirla.
- La página traduce visibilidad (ocultar) a interacción (`pausa`), y cualquier renderizado de estado reinicia la pausa (`renderSabikState()`, línea 120).
- **[I]** La animación `sabikVoiceRipple` se ejecuta siempre, aunque no existe voz. Junto a `functional_state = Listening` en riesgo, puede sugerir que Sabik habla o escucha cuando no lo hace.

## 8. Mapa estado → evento → interfaz

Columnas: evento que lo activa · texto visible · texto anunciado (única región viva: `#sabik-status-text`, `role=status`, `aria-live=polite`, `aria-atomic=true`) · control relacionado · ARIA · `data-*` en `#sabik-hologram` · clase CSS · animación (variables computadas en Chromium) · efecto sobre sesión · efecto sobre seguridad.

`int` = `data-interaction-state`, `prot` = `data-protection-state`, `low` = `data-low-intensity`, `dot` = `#sabik-presence[data-state]`.

| Estado efectivo | Evento | Texto visible | Anunciado | Control | ARIA | data-* | Clase | Animación | Sesión | Seguridad |
|---|---|---|---|---|---|---|---|---|---|---|
| Inicial | `DOMContentLoaded` + `loadCore()` OK | Etiqueta «Disponible» | «Estoy aquí si quieres ayuda.» [I] probablemente no se reanuncia porque ya estaba en el HTML | Enviar activo; «Bajar intensidad»; «Parar» | `aria-pressed=false` añadido por JS a ambos | int `espera`, prot `normal`, low `false`, dot `base` | — | `running`, 36 s | nueva | normal |
| Error de carga del Core | `loadCore()` falla | aviso con `error.message` | «Sabik no pudo cargar el Core.» | Enviar sigue activo y reintenta | — | dot `minimal` | — | sin cambio | sin sesión | [I] sin vía alternativa ofrecida |
| Procesando | submit | — | «Sabik está buscando en Iris Green.» | Enviar deshabilitado; pausa cancelada | `aria-pressed=false` en «Parar» | int `procesando`, dot `minimal` | — | `running`, 14 s | sin cambio | — |
| Respuesta | `renderPlan()` | Respuesta en `<p>` + fuentes | «Sabik ha preparado una respuesta.» (la respuesta **no** se anuncia) | «No es esto», «Buscar por otra vía» | grupo `aria-label` | int `respuesta`, dot según Core | — | según low/prot | `applySessionUpdate` | — |
| Insuficiente | `insufficient_information` | «No tengo información suficiente…» + aviso de límites | «Sabik no tiene fuente suficiente.» | ídem | — | int `respuesta` | `is-warning` | ídem | ídem | — |
| Riesgo confirmado | `risk_accompaniment` | «Esto necesita ayuda humana ahora…»; aviso «No diagnostico ni actuo por ti…» (sin tildes); etiqueta «Disponible» | «Sabik mantiene acompañamiento y escucha.» | Ningún control de ayuda humana; «Subir intensidad» visible pero inoperante | `aria-pressed=true` en intensidad | int `respuesta`, prot `riesgo`, low `true`, dot `risk` (sin estilo) | `is-risk`, `body.sabik-low-stim` | **`running`, 52 s** | `risk_state`, `Sobrecarga`, `low_intensity` | sin recurso; se pierde con el siguiente mensaje |
| Riesgo ambiguo | `ambiguous_risk_clarification` | Pregunta de seguridad | ídem riesgo | ídem | ídem | ídem | ídem | ídem | ídem | ídem |
| Corrección (botón) | «No es esto» | «Entendido. Retiro esta vía. Puedes escribir una corrección concreta.» + «La corrección explícita pesa más que la inferencia.» | «Sabik espera una corrección.» | — | — | int `correccion` | — | 28 s inversa | `rejected_*` | **en riesgo, retira el acompañamiento** |
| Otra vía (botón) | «Buscar por otra vía» | Reejecuta la última entrada o pide aclaración | «Sabik necesita una aclaración para cambiar de vía.» | — | — | int `correccion` o `respuesta` | — | — | `rejected_*` y reejecución | — |
| Baja intensidad | «Bajar intensidad» | Botón «Subir intensidad» | «Baja intensidad activada.» / «Intensidad normal activada.» | mismo botón | `aria-pressed` y cambio de texto a la vez | low `true`, int `espera`, dot `minimal` | `body.sabik-low-stim` | `running`, 52 s | preferencia | **cancela la pausa** |
| Corto | «Más corto» | Reejecución (texto igual) | «Respuesta más corta activada.» solo si no hay entrada previa | sin estado propio | sin `aria-pressed` | — | — | — | `response_length`, `max_options=1`; sin forma de deshacer | — |
| Pausa | «Parar» | Salida oculta; entrada vaciada; botón «Reanudar» | «Sabik queda en pausa. No se ha guardado historial.» | «Reanudar» | `aria-pressed=true` y cambio de texto | int `pausa`, low `false`, dot `minimal` | `body.sabik-low-stim` **no se retira** | `running`, 72 s | **sesión nueva** | **borra el riesgo activo** |
| Reanudar | «Reanudar» con `paused=true` | Etiqueta «Disponible» | «Sabik vuelve a estar disponible.» | «Parar» | `aria-pressed=false` | int `espera`, dot `base` | — | según low | — | — |
| Oculto | «Ocultar» | Solo cabecera; etiqueta «Oculto»; botón «Mostrar» | nada: la región viva queda dentro del cuerpo oculto | «Mostrar» | `aria-expanded=false` | int `pausa` | `is-collapsed` | `paused` | sin cambio | [H] el estado de riesgo no es visible en la cabecera |
| Mostrado | «Mostrar» | Etiqueta «Disponible» | «Estoy aquí si quieres ayuda.» | botón de pausa **no se sincroniza** | `aria-expanded=true` | int `espera`, dot `base` (ignora riesgo y baja intensidad) | — | según low | `paused=false` | [H] enmascara riesgo |
| Error técnico en consulta | excepción en `runNeed()` | «No he podido cargar los datos locales de Sabik.» + mensaje técnico | «Sabik encontró un error técnico.» | Enviar reactivado | — | **int se queda en `procesando`** | `is-warning` | `running`, 14 s indefinido | sin cambio | ninguna vía de ayuda |
| Movimiento reducido | `prefers-reduced-motion` o `html[data-ig-motion=off]` | — | — | «Reducir movimiento» en Lectura | `aria-pressed` del ajuste | — | — | `animation: none` en todo el panel (UH1) | — | — |
| Voz | no existe en Sabik | — | — | «Escuchar esta página» es de la página, no de Sabik | — | — | — | `sabikVoiceRipple` siempre activa | — | [I] sugiere voz inexistente |
| Idioma EN | botón EN | Panel en español | — | — | `html[lang=en]`, panel sin `lang` | — | — | — | Core fija `language: "es"` | [I] lectores de pantalla leen español con fonética inglesa |

## 9. Adaptaciones que pueden parecer una inferencia sobre la persona

Requisito de #147. Todas **[H]** salvo indicación.

1. Una pregunta informativa («¿Qué es la sobrecarga sensorial?») convierte a la persona en `Sobrecarga`, baja la intensidad y cambia el botón a «Subir intensidad». Quien mire el panel puede leerlo como «Sabik cree que estoy saturada».
2. Cualquier frase de riesgo, incluso citada o sobre terceros, fija `Sobrecarga` y baja intensidad.
3. «Hiperfoco» y «Creatividad» son nombres de rasgos asociados a perfiles neurodivergentes y se asignan por palabras sueltas. Hoy no se muestran, pero existen en `data-cognitive-state` y en el contrato de estado. **[E]** Decidir si estos nombres deben existir en el runtime.
4. `source_answer` redacta «Una posibilidad es que esto se relacione con algo que Iris Green describe así…» para situaciones personales. Con fichas de condiciones como fuente, la frase puede leerse como hipótesis diagnóstica.
5. «necesito prepararme para ir al supermercado» responde con un fragmento de la ficha de autismo («Necesito Elegir contigo mis apoyos») y la enlaza.
6. **[I]** `VISUAL_MODES.HUMANA` y `COMPANERA_NO_HUMANA` anticipan modos antropomórficos no decididos. **[E]** Decidir si procede un modo «humano».

**[P]** Regla para S0: ninguna adaptación debe derivarse de un estado mental inferido. Solo pueden activarlas un control explícito, una preferencia expresada con palabras («menos texto») o la capa de seguridad, y en este último caso sin nombrar ni almacenar un estado mental.
