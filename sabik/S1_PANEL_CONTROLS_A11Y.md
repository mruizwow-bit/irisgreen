# S1 · Foco natural y aviso breve accesible

Actualizado: 2026-09-18. Orden vigente: corregir conflicto entre foco del textarea y aviso breve.
Candidato para QA; no se declara aceptación real ni producción.
Padre obligatorio: `706a639dcc620080bf870a3438a2c89b6b530e10`.
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

**Preservar foco natural, no re-enfocar artificialmente.** Un envío válido no
llama a focus antes, durante ni después de runNeed. Ctrl/Cmd+Enter conserva el
textarea por continuidad; click o Enter/Space sobre Enviar respetan el foco del
botón/navegador. En Chromium instrumentado, al quedar disabled el botón durante
loading, el navegador produce blur/focusout hacia BODY. No se fuerza un destino
para compensarlo ni se restaura un control al completar. Si la persona navega
durante la carga, el resultado tampoco le roba el foco.
El foco para validación inválida, reset y retorno explícito permanece intacto:
son acciones distintas de un envío válido.

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
y es reversible. Disabled es nativo; aria-expanded coincide con hidden y S0.
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

## FAIL_REAL A02 e instrumentación

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

Se elimina únicamente esa llamada del camino válido. Antes/después se observan
activeElement, focus, focusin, blur, focusout, llamadas focus, submit, loading y
status. Después: cero llamadas focus en los cuatro modos (click, Ctrl+Enter,
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
No se cambian movimiento, avatar ni CSS; se conserva reduced motion existente.
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

Se guardan árbol AX de `Qué es el autismo`, mutaciones del aviso, llamadas de
foco, capturas ES/EN y resultados. Estas pruebas no simulan oído humano ni
acreditan interoperabilidad con Narrator. Las simulaciones de texto 200% y
viewport equivalente a zoom 400% tampoco sustituyen la comprobación nativa.

## QA manual posterior: una sola revalidación

Sobre el dist del nuevo SHA, con Narrator real:

1. Escribir `Qué es el autismo`.
2. Pulsar Enviar con el ratón.
3. Comprobar únicamente si se percibe `Respuesta de Sabik disponible.`.

Registrar SHA, navegador/lector y PASS_REAL/FAIL_REAL. No pedir A/B ni forzar
lectura completa. La instrumentación no sustituye esta única revalidación.
La aceptación manual general restante no se transforma en PASS por pruebas
automáticas; esta orden solicita únicamente el caso de aviso breve anterior.

## Historial y límites

Un único commit nuevo parte directamente de `706a639d...`, sin rebase, squash ni
reescritura. La rama anterior y el candidato ariaNotify quedan conservados como
histórico separado; no se integra ariaNotify en este candidato. Se entrega bundle
para transporte local; no push con credenciales ajenas, merge ni modificación de
main, Netlify, dominios o producción. S2/S3/S4/S5 continúan fuera de alcance.
