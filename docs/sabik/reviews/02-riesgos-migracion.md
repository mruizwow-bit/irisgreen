# 02 · Riesgos de migración

Qué puede romperse al sustituir el sistema actual por la máquina de estados S0 y las fases posteriores.
Base: `sabik-preview` @ `efa4ed9`. Cada apartado separa **[H]** hecho, **[I]** inferencia, **[P]** propuesta y **[E]** decisión editorial.

## 1. Pausa

- **[H]** «Parar» ejecuta `createSessionState()`, vacía la entrada, oculta la respuesta y marca `paused=true` (`sabik-page.js:264-274`). La prueba V7-007 exige literalmente ese borrado.
- **[H]** La pausa no bloquea el formulario: enviar durante la pausa la cancela en silencio (`setLoading`, línea 134).
- **[H]** La pausa no detiene el movimiento: lo ralentiza a 72 s (decisión del commit `efa4ed9`, V7-019 y V7-027).
- **[I]** Al separar pausa y reinicio, las personas que hoy usan «Parar» para borrar perderán ese efecto si no aparece un control de reinicio visible.
- **[I]** Si la máquina pausa sin borrar, la sesión de riesgo seguirá viva durante la pausa; hoy se borra. La interfaz tendrá que decidir qué se ve al reanudar.
- **[P]** Dos controles distintos: «Pausar/Reanudar» (conserva sesión) y «Borrar conversación» (reinicio, con confirmación textual en el estado). Durante la pausa, el envío debe estar deshabilitado o reanudar de forma explícita y anunciada.
- **[E]** Nombre visible de los controles. Si la pausa debe seguir «viva» (movimiento lento) o quedar estática.
- **[E]** V7-007 describe el comportamiento que S0 prohíbe. Cambiarla no es debilitarla, pero requiere aprobación explícita porque `AGENTS.md` prohíbe debilitar pruebas.

## 2. Ocultar y mostrar

- **[H]** Mostrar pone `paused=false` sin sincronizar el botón; «Reanudar» vuelve a pausar y borrar (UB2-UB3).
- **[H]** Ocultar asigna `data-interaction-state="pausa"`; mostrar asigna `espera` y el indicador `base`, ignorando riesgo y baja intensidad (UD4).
- **[H]** La región viva `#sabik-status-text` está dentro de `#sabik-widget-body`, que recibe `hidden` al ocultar: ningún cambio de estado se percibe con el panel plegado (UB1).
- **[H]** La cabecera plegada solo muestra «Oculto»; no expresa pausa ni riesgo.
- **[I]** Si la máquina modela visibilidad como capa independiente, el CSS que hoy cuelga de `.is-collapsed` y de `data-interaction-state="pausa"` dejará de coincidir: hay que revisar las reglas de las líneas 702-760 y 925-936.
- **[P]** `COLLAPSE`/`EXPAND` solo cambian la capa de visibilidad. Al mostrar, la interfaz se repinta desde el estado completo (operación, seguridad, adaptación), nunca desde valores fijos.
- **[P]** Mover o duplicar una región viva mínima fuera del cuerpo plegable, o anunciar en la cabecera los estados que importan (pausa, riesgo).
- **[E]** Qué debe verse en la cabecera plegada durante un riesgo activo.

## 3. Baja intensidad

- **[H]** `low_intensity` se calcula como `Sobrecarga || preferencia`. La persona no puede desactivarla si el Core ha inferido `Sobrecarga` o hay riesgo, y el estado anuncia un cambio que no ocurre (UD2).
- **[H]** «Parar» crea una sesión con `low_intensity=false`, sincroniza el botón, pero no retira `body.sabik-low-stim` (UA3).
- **[H]** Activarla cancela la pausa (UC1).
- **[H]** `motion_level=Off` no se aplica: el CSS mantiene el movimiento a 52 s por diseño (V7-027: «low intensity softens instead of killing Sabik»). La acción de datos `bajar_intensidad` promete «pasar a estado visual minimo».
- **[I]** Si la migración aplica `motion_level` literalmente, contradirá V7-027 y la decisión visual de `efa4ed9`.
- **[P]** Baja intensidad como preferencia explícita de la persona, reversible siempre, independiente de la capa de seguridad. La seguridad puede imponer su propia presentación estable sin tocar la preferencia.
- **[E]** Qué significa «baja intensidad» en movimiento (reducido o nulo) y si debe acortar texto.

## 4. Respuesta corta

- **[H]** «Más corto» fija `response_length=short` y `max_options=1` y reejecuta la última entrada; el texto resultante es idéntico al normal (C-13) porque casi todas las respuestas ya tienen 1-2 párrafos y el límite es 2.
- **[H]** No hay forma de deshacerlo ni indicación de estado (`aria-pressed` ausente).
- **[H]** Reejecutar añade la entrada otra vez a `user_statements` y recalcula riesgo y preferencias.
- **[H]** «Explícamelo más corto» escrito no activa la preferencia y se trata como petición informativa (C-08); «menos texto» activa además el concepto `baja_demanda` (C-12).
- **[P]** Reformular sin volver a recuperar: acortar el mismo plan (una frase, sin repetir fuente) en vez de reejecutar la consulta. Evento propio, no `SUBMIT`.
- **[E]** Longitud objetivo de «corto».

## 5. Correcciones

- **[H]** `classifyIntent()` marca corrección cualquier frase que empiece por «no es» o contenga « no es », sin mirar si hubo respuesta previa (C-01).
- **[H]** `detectNegations()` solo reconoce «no es / no quiero / no me molesta + término» contiguos; falla con otro orden (C-03, C-04) y acierta por subcadena donde no debe (C-05).
- **[H]** Una corrección con pronombre («no es eso») no veta el concepto de la respuesta anterior (C-15).
- **[H]** La respuesta de corrección dice «Retiro esa vía» pero no presenta la nueva; la página sí lista fuentes nuevas debajo.
- **[H]** «No es esto» sobre una respuesta de riesgo retira el acompañamiento (UD3).
- **[H]** «Buscar por otra vía» veta el concepto mostrado y reejecuta; con un único concepto el resultado es «No tengo información suficiente» (C-16).
- **[I]** El registro de rechazo usa `concepts_used.slice(0,1)` cuando no hay selección: puede vetar un concepto que no era el mostrado.
- **[P]** Corrección solo con referente previo (hay respuesta anterior en la sesión). Separar «rechazo del concepto» de «otra vía para el mismo concepto» (requisito de #147).
- **[P]** La capa de seguridad no puede ser rechazada por «No es esto»; el botón debe ofrecer aclaración («¿No estás en peligro ahora?») o no aparecer en respuestas de riesgo.
- **[E]** Texto de acuse de corrección.

## 6. Fuentes

- **[H]** El enlace muestra la ruta (`/es/investigacion/`), no un título; el código anticipa `source_titles`.
- **[H]** El índice no tiene anclas: todos los fragmentos de una página comparten URL; los 120 registros de investigación enlazan al mismo listado.
- **[H]** `selectBestCandidates()` elimina duplicados por URL: dos secciones distintas de una ficha no pueden citarse a la vez.
- **[H]** `renderPlan()` elimina «Fuente: URL» solo al final del texto con una expresión regular; cualquier cambio de redacción en `language.js` puede dejar la URL cruda en la respuesta.
- **[H]** El texto del fragmento empieza por su encabezado: «Me ayuda Reducir preguntas…», «Qué puede ayudar ahora Hacer la comida…».
- **[I]** Al introducir anclas cambiarán los identificadores de deduplicación y las pruebas V7-010 que comparan `source_urls` con `evidence`.
- **[P]** Ver `07-indice-funcional.md`: sección con ancla estable y título legible.

## 7. Riesgo

- **[H]** Detección insuficiente (S-01, S-02), falsos positivos (S-03), sin recursos (S-04), rechazable (S-05), no persistente (S-06), dependiente de la carga de todos los datasets (S-07).
- **[H]** Riesgo ambiguo y confirmado comparten presentación visual y protección.
- **[H]** El riesgo desactiva la recuperación normal. Una pregunta informativa sobre suicidio no recibe información ni recurso.
- **[I]** Si S0 añade `RISK_UNCERTAIN → awaiting_clarification` sin definir qué respuestas cierran la aclaración, la sesión puede quedar bloqueada o volver a `normal` con cualquier texto.
- **[P]** La capa de seguridad no depende de datasets remotos: un recurso de emergencia mínimo aprobado debe estar disponible aunque falle la carga de datos. Ver `05-recursos-humanos-esquema.md`.
- **[E]** Cuánto dura la capa de riesgo, qué la cierra y qué ve la persona al cerrarse. Ver `04-seguridad-conversacional.md`.

## 8. Lectores de pantalla

- **[H]** Solo `#sabik-status-text` es región viva; la respuesta (`#sabik-answer`, un `<p>`) no se anuncia. Quien usa lector oye «Sabik ha preparado una respuesta» y tiene que buscarla.
- **[H]** Los botones de pausa e intensidad cambian a la vez el texto y `aria-pressed`. **[I]** El resultado anunciado es «Reanudar, activado», difícil de interpretar; la práctica habitual es mantener el nombre fijo con `aria-pressed` o cambiar el nombre sin `aria-pressed`.
- **[H]** V7-003 comprueba que el HTML no tenga `aria-pressed` en botones Sabik; el JS lo añade después. La prueba no refleja el DOM real.
- **[H]** El holograma es `role=img` con etiqueta fija; el estado no forma parte de su nombre accesible.
- **[H]** Textos con tildes ausentes en avisos visibles: «No diagnostico ni actuo por ti», «No envio esta conversacion…», «Memoria de sesion». **[I]** Algunos sintetizadores los pronuncian mal.
- **[I]** Repetir el mismo texto en la región viva («Estoy aquí si quieres ayuda.») no se vuelve a anunciar.
- **[P]** Región viva para el resultado (o foco gestionado al título «Respuesta»), estado resumido en texto visible junto al indicador, nombres fijos en botones conmutables.

## 9. Voz futura

- **[H]** Sabik no tiene voz. La página tiene «Escuchar esta página» (`navigation-approved.js`, con estado compartido en `preferencias-lectura.js`). `lectura-accesible.js` (lectura al pulsar texto, con `document.documentElement.lang`) existe en el sitio pero no se carga en `/es/nea/`.
- **[H]** El CSS anima «ondas de voz» (`sabikVoiceRipple`, `sabikPresenceWave`) de forma continua; V7-027 exige que existan.
- **[I]** Cuando exista voz, la animación de voz no podrá distinguir «hablando» de «en reposo» si sigue siendo permanente.
- **[I]** Pausar Sabik no detiene la lectura de la página, que usa el mismo `speechSynthesis`. Una pausa de Sabik que cancele `speechSynthesis` cortaría también la lectura de la página.
- **[P]** Voz como capa propia con eventos `SPEECH_*` (ya previstos en S0); la animación de voz solo en `speaking`. Cancelación limitada a los enunciados de Sabik.
- **[E]** Si la animación de voz permanece como decoración cuando no hay voz.

## 10. Preferencias de lectura

- **[H]** `preferencias-lectura.css` aplica `animation: none` a todo cuando `html[data-ig-preferences="2"][data-ig-motion="off"]`; el sondeo con `prefers-reduced-motion` dejó 0 elementos animados en el panel (UH1).
- **[H]** «Bajar intensidad» de Sabik y «Reducir movimiento» de Lectura son controles independientes con efectos solapados; ninguno refleja al otro.
- **[H]** Las preferencias de lectura se guardan en el navegador; las de Sabik no (contrato).
- **[I]** Si la capa de movimiento de S0 unifica ambas, podría persistir sin querer una preferencia de Sabik a través de Lectura.
- **[P]** La capa de movimiento de Sabik lee la preferencia de Lectura y del sistema, pero no escribe en ellas.

## 11. Móvil

- **[H]** Por debajo de 1280 px el panel pasa detrás del contenido principal; en 390 px empieza a 1744 px (UG1).
- **[H]** El panel mide 879 px de alto en 390 px de ancho.
- **[I]** En móvil, un estado de riesgo o una respuesta pueden quedar fuera de la vista sin que la región viva lo compense si el panel está plegado.
- **[P]** Tras enviar, llevar el foco o el desplazamiento a la respuesta; revisar la posición del panel en móvil en S3.
- **[E]** Posición de Sabik en móvil.

## 12. Idioma

- **[H]** El Core fija `language: "es"` y todos los textos de panel son literales en español sin `data-t`.
- **[H]** El botón EN cambia `html[lang]` a `en` y traduce solo `[data-t]`; el panel no declara `lang="es"` (UE1).
- **[H]** `applyOutputLanguageGuard()` corrige voseo en español; para otros idiomas devuelve el primer fragmento sin redactar.
- **[H]** No existe `/en/nea/`.
- **[I]** Si la máquina incorpora la capa `idioma` y cambia a `en`, el Core devolverá texto español o fragmentos sin formular.
- **[P]** Mientras solo haya español, `lang="es"` en el panel y un aviso visible en EN. La capa idioma no debe cambiar a `en` sin corpus.
- **[E]** Si Sabik se ofrece en inglés y con qué corpus.

## 13. Pruebas existentes

- **[H]** 28/28 pasan con los fallos documentados. Las pruebas de interfaz comprueban subcadenas del código fuente, no comportamiento:
  - V7-007 exige que «Parar» cree una sesión nueva (contrario a S0).
  - V7-019, V7-027 y V7-028 exigen cadenas literales de JS y valores CSS concretos (`--sabik-layer-speed: 72s;`, `button.textContent = paused ? "Reanudar" : "Parar"`). Cualquier refactor los rompe aunque el comportamiento sea correcto.
  - V7-003 comprueba `aria-pressed` en el HTML estático, no en el DOM tras el JS.
  - V7-006 acepta `short <= normal`; pasa con textos idénticos.
  - V7-011 exige `white-space: nowrap` en todo el CSS, no en un selector.
- **[H]** El comando de validación de `AGENTS.md` incluye `python3 scripts/build_site.py`; el script existe. No se ha ejecutado en esta revisión porque no se tocó el sitio.
- **[I]** Una migración que respete los invariantes S0 obliga a reescribir al menos V7-007, V7-019, V7-027 y V7-028.
- **[P]** Sustituir comprobaciones de cadenas por pruebas de comportamiento: máquina pura en Node y un recorrido de interfaz (Playwright) con los pasos U* de `evidencia/sondeo-runtime.md`.
- **[E]** Aprobación explícita para reescribir pruebas que fijan comportamiento contrario al contrato.
