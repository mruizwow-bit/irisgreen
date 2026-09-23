# S1 · Foco natural y aviso breve accesible

Actualizado: 2026-09-18. Orden vigente: preservar foco de Enviar/Send durante loading.
Candidato para QA; no se declara aceptación real ni producción.
Padre obligatorio: `cae4fec2d99000e90f487af77be17a410c2b7504`.
Rama local: `sabik/s1-accessibility-closure`, en un worktree independiente.
Base S0: `sabik-preview@1181f6f7af6c784d71d58860f7db9928bc0cff89`.
Referencia de coordinación: PR #165; este cierre no modifica el remoto.

## Contrato de accesibilidad

S1 prepara contenido, teclado, foco, nombres y estados accesibles para Narrator
y otros lectores. La interoperabilidad debe validarse con la tecnología
asistencial real. S2 permanece cerrado. No se añaden mecanismos de locución.
La orden de ariaNotify sigue cancelada; no se reutilizan los experimentos de
lectura completa mediante status, log o foco sobre la respuesta.

La respuesta completa y el aviso editorial complementario son párrafos normales
visibles dentro de `#sabik-response-message`. El grupo tiene `tabindex="0"` y
nombre mediante el encabezado `Respuesta de Sabik` / `Sabik response`.
No tiene una descripción o etiqueta que duplique la respuesta, ni aria-hidden,
ni contenido sr-only duplicado. Las fuentes y acciones están fuera del grupo.
El lector puede llegar al encabezado y leer los párrafos mediante navegación
convencional; Tab permite alcanzar el grupo. El texto editorial y su puntuación
no se modifican respecto al padre.

Al terminar una respuesta se escribe una única vez en la región persistente
`#sabik-announcement`: `role="status"`, `aria-live="polite"`, `aria-atomic="true"`.
El contenido se reemplaza por un único nodo de texto breve:

- ES: `Respuesta de Sabik disponible.`
- EN: `Sabik response available.`

No contiene la respuesta, fuentes, controles, consulta ni navegación. El estado
visible no es otra live region. No se usan log, assertive, ariaNotify, Web Speech
API ni role=application. La disponibilidad se anuncia después de finalizar
`aria-busy`. Cada envío válido nuevo genera su aviso, incluso con texto idéntico;
esto no demuestra por sí solo la locución real en cada combinación de AT.
Pausa, reanudación, reset, validación y error técnico tienen un único estado breve
propio. El error también permanece visible y accesible en el panel.

## Foco y controles

**Preservar foco natural, sin re-enfoque.** Un envío válido no llama a focus
antes, durante ni después de runNeed. Click o Enter/Space sobre Enviar mantienen
el mismo botón enfocado durante pending y al terminar. Ctrl/Cmd+Enter conserva
el textarea por continuidad. Si la persona navega durante la carga, completar
el resultado no le roba el foco ni restaura un destino por código.

Enviar se trata separadamente en syncControls: durante pending operativo permanece
con `disabled=false` y `aria-disabled="true"`. Conserva identidad DOM, tabindex
nativo y estilo de indisponibilidad (opacidad .65 y cursor not-allowed). Al terminar
se retira aria-disabled, sin enfocar nada. El handler mantiene el guard síncrono
`unavailable()` antes de runNeed; pending se fija antes del primer await.
Los reenvíos se bloquean por estado, no por el atributo visual.

El bloqueo nativo sigue activo cuando Core no está listo, durante controlBusy o
pausa. Los demás controles conservan disabled real según su contrato. Tampoco
cambia el foco de validación inválida, pausa/reanudación/reset o retorno explícito.
No se usan tabindex negativo, reemplazo del botón, aria-hidden, display:none,
delays ni nuevos mecanismos de anuncio.

Se conserva `Escribir otra consulta` / `Write another question`: permite volver
al campo tras navegar voluntariamente por el resultado, sin borrar nada, alterar
la sesión o provocar otro anuncio. Su utilidad no depende de un foco artificial.

| Acción | Evento S0 | Efecto / foco |
| --- | --- | --- |
| Bootstrap | BOOT_OK | Habilita controles, sin foco inicial forzado |
| Enviar | SUBMIT, RETRIEVAL_OK/EMPTY, RESPONSE_READY/ASK_CLARIFICATION | Una operación; foco natural según activación, aviso breve al terminar |
| Pausar Sabik | PAUSE_ASSISTANT | Conserva entrada, sesión y resultado; foco en Reanudar |
| Reanudar | RESUME_ASSISTANT | No reenvía; foco en Pausar Sabik |
| Empezar de nuevo | RESET_SESSION | Limpia conversación, conserva preferencias; foco en entrada |
| Ocultar / Mostrar | COLLAPSE / EXPAND | Solo visibilidad; foco en invocador visible |
| Escape | COLLAPSE | Sin pausa ni reset implícitos; foco en Mostrar |

Pausa y reanudación son controles separados. Intensidad conserva su aria-pressed
y es reversible. El bloqueo estructural es nativo; el pending de Enviar usa
aria-disabled y guard funcional. aria-expanded coincide con hidden y S0.
La generación de interfaz invalida resultados y errores tardíos tras pausa/reset.
Ocultar no cancela la consulta ni reinicia la sesión; un resultado oculto no
reabre el panel, no roba foco y no vuelve a anunciarse al expandirlo.

Máximo: 2000 puntos de código Unicode antes de recortar espacios. Un exceso no
envía ni trunca: conserva la entrada, muestra el error asociado mediante
aria-describedby y aria-invalid y da un aviso breve. Enter/Shift+Enter añaden
línea; Ctrl/Cmd+Enter envía. Enter/Space activan botones; Tab/Shift+Tab conservan
orden DOM y navegación sin trampas. Búsqueda → Sabik → resto está en el HTML.

## Idiomas y contenido aprobado

El selector ES/EN existente de la página cambia `html.lang`. El panel sigue ese
idioma para título/subtítulo, estado, botones, ayudas, errores, placeholder,
etiquetas, nombres accesibles, grupos y avisos. Un cambio de idioma no llama al
Core ni a S0, no reinicia sesión ni consulta y no repite un anuncio anterior.
La región hereda el idioma del panel; se retira su estado antiguo al cambiarlo.
Si cambia durante una consulta, el aviso final usa el idioma actual.

María ha autorizado expresamente separar interfaz y contenido original: solo
existe corpus editorial aprobado en español y esta orden prohíbe modificarlo.
La interfaz ES/EN queda traducida; las respuestas editoriales, sus avisos y los
títulos de fuentes conservan español con `lang="es"`. En EN se muestra:
`Answers and source titles are currently available in Spanish.`
Los errores técnicos y las instrucciones de corrección, que son interfaz, sí
cambian de idioma. No se presenta este cierre como traducción editorial completa
ni como ampliación de la comprensión del Core al inglés.

## FAIL_REAL cae4fec2 y causa de pérdida de foco

El candidato `cae4fec2d99000e90f487af77be17a410c2b7504` tiene **FAIL_REAL**:
el aviso breve existe, pero Enviar/Send pierde el foco al recibir disabled durante
loading. María comunica que Narrator empieza a releer desde BODY; en EN vuelve
a «Iris Green / Neurodiversity / What do you need...» y cambia de idioma al llegar
al contenido editorial marcado ES. La política editorial no se altera.

La causa DOM está demostrada en ES y EN mediante el setter nativo y stack:
`syncControls` línea 158 aplica `node.disabled = disabled` a submit; se llega
desde `setLoading` línea 277, tras fijar pending=true y antes del primer await de
runNeed. En el padre, click ES: submit a 32,8 ms, disabled=true a 33,1 ms,
blur/focusout del botón hacia BODY a 86,8 ms, aviso a 204,7 ms. En EN: submit a
21,5 ms, disabled=true a 21,7 ms, blur/focusout a 27,3 ms, aviso a 149,3 ms.
Tiempos relativos de capturas concretas, no garantías de latencia.

Después se registra aria-disabled=true al empezar y su retirada al finalizar,
sin cambiar disabled ni producir blur/focusout del botón durante la operación.
El foco sigue en Enviar/Send al publicar el status; Ctrl+Enter conserva textarea.
Hay un único aviso final ES/EN, sin loading announcements. La respuesta, la
estructura HTML y la región persistente permanecen idénticas.

Se instrumentan activeElement, focus/focusin/blur/focusout, submit, setter disabled,
aria-disabled, inicio/fin de pending (reflejado por aria-busy) y actualización de
status. Las trazas prueban la causa y corrección DOM, no la locución de Narrator.
QA real pendiente. No se vuelve a mecanismos anteriores.

## Antecedente: FAIL_REAL A02 y retirada del refocus

El candidato `706a639dcc620080bf870a3438a2c89b6b530e10` tiene **A02 = FAIL_REAL**,
comunicado con Windows, Chrome/Chromium, Microsoft Narrator y página local HTTP.
Consulta: `Qué es el autismo`, click de ratón en Enviar. Narrator anuncia
`¿Qué necesitas?, editar, Qué es el autismo`; no se percibe
`Respuesta de Sabik disponible.`.

La instrumentación del candidato exacto demuestra el refocus:
`sabik-page.js:429` ejecuta `focus("#sabik-input")` en el submit válido, que
llama a `node.focus({preventScroll:true})` en la línea 143, antes de runNeed.
En la traza de click: submit con foco en Enviar a 38,9 ms; llamada a focus a
38,9 ms; focus/focusin en textarea a 39,0 ms; loading a 39,4 ms; aviso a 169,2 ms.
Los tiempos son relativos a la activación registrada, no latencias garantizadas.

En cae4fec2 se eliminó únicamente esa llamada del camino válido. Antes/después se observan
activeElement, focus, focusin, blur, focusout, llamadas focus, submit, loading y
status. Después de aquella corrección: cero llamadas focus en los cuatro modos (click, Ctrl+Enter,
Enter y Space sobre Enviar), cero refocus al textarea y un aviso por respuesta.
Ctrl+Enter conserva el textarea sin eventos de foco; los otros modos quedan
en BODY por el disabled nativo. La respuesta y los textos del status no cambian.

La causa técnica del reenfoque queda demostrada y su retirada cambia el patrón
automatizado. La traza no captura audio de Narrator: su coincidencia con la
verbalización reportada es coherente con el destino enfocado, pero no demuestra
el instante ni la causa interna de supresión del aviso en AT. QA real pendiente.

## Arquitectura e integridad

Los eventos operativos siguen pasando por el adaptador y el Worker local de S0.
El shim CommonJS no contamina window. No se cambia el contrato ni la máquina,
`response.js`, `risk.js`, los datos editoriales, noindex o la navegación ordinaria.
No se introducen inferencias a partir de tecleo, scroll u otras señales pasivas.
No se cambian movimiento ni avatar. El único ajuste CSS extiende el estilo de
indisponibilidad a Enviar con aria-disabled; reduced motion permanece intacto.
La integración avanzada de seguridad pertenece a S3, fuera de este cierre.

## Verificación automática

Ejecutar desde el repositorio:

```text
node tools/test-sabik-machine-s0.js
node tools/test-sabik-page-v7.js
python scripts/build_site.py
node tools/test-sabik-s1.js
git diff --check
```

La suite S1 usa Playwright/Chrome disponibles como herramientas de prueba, sin
dependencia nueva del producto. `S1_WEB_ROOT` permite probar dist y
`S1_EVIDENCE_DIR` guarda JSON y capturas fuera del repo. El informe externo del
SHA entregado contiene resultados y comprobación de integridad/build.

- S0: 146 comprobaciones; contrato intacto.
- V7: 28 comprobaciones. V7-028 reconoce ahora el renderizador de etiquetas
  traducibles, manteniendo el toggle y aria-pressed; N20 verifica la reversibilidad.
- S1: 37 casos; A02/A17/A18 se ajustan al foco natural de la activación.
- X01–X06: conservación de sesión, cancelaciones, CommonJS y ausencia de inferencia.
- N01–N22: semántica/AX, respuesta fuera de live regions, único aviso ES/EN,
  ausencia de foco forzado y voz, errores, controles, teclado, cancelaciones,
  idiomas estáticos/dinámicos, nombres accesibles, cambio de idioma durante carga,
  respuesta editorial conservada y reflow en inglés. Solo se ajustan requisitos
  antiguos de foco en textarea tras click.
- N-F1–N-F10: click, Ctrl+Enter, Enter/Space, carga y fin sin foco artificial;
  status único exacto ES/EN, sin contenido completo ni mecanismos descartados.
- F01–F15: foco e identidad del botón durante pending, disabled=false,
  aria-disabled=true, estado accesible/estilo, bloqueo de click/Enter/Space/
  Ctrl+Enter/requestSubmit, fin sin salto a BODY, status ES/EN y pausa nativa.
  A05/A36/A37/X02 mantienen comprobaciones de resultados/errores tardíos.
  Las esperas de disponibilidad en tests reconocen tanto disabled como aria-disabled.

Se guardan árbol AX de `Qué es el autismo`, mutaciones del aviso, llamadas de
foco, capturas ES/EN y resultados. Estas pruebas no simulan oído humano ni
acreditan interoperabilidad con Narrator. Las simulaciones de texto 200% y
viewport equivalente a zoom 400% tampoco sustituyen la comprobación nativa.

## QA manual posterior: una sola revalidación ES y aviso EN

Sobre el dist del SHA nuevo exacto, con Narrator real:

1. En modo ES, escribir `Qué es el autismo` y pulsar Enviar con ratón.
2. Comprobar que Narrator no vuelve a leer la página desde Iris Green.
3. Comprobar que al final se percibe `Respuesta de Sabik disponible.`.
4. Después repetir solo el aviso en EN: `Sabik response available.`.

Registrar SHA, navegador/lector y PASS_REAL/FAIL_REAL. No A/B ni lectura completa
automática. Las trazas DOM y los tests no sustituyen esta revalidación.
El candidato anterior conserva FAIL_REAL; el nuevo queda PENDIENTE_QA_REAL.

## Historial y límites

Un único commit nuevo parte directamente de `cae4fec2...`, sin rebase, squash ni
reescritura. La rama anterior y el candidato ariaNotify quedan conservados como
histórico separado; no se integra ariaNotify en este candidato. Se entrega bundle
para transporte local; no push con credenciales ajenas, merge ni modificación de
main, Netlify, dominios o producción. S2/S3/S4/S5 continúan fuera de alcance.
