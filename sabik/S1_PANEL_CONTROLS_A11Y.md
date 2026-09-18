# S1 · Accesibilidad separada de la voz propia de Sabik

Actualizado: 2026-09-18. Orden vigente: cierre de accesibilidad separada de voz.
Candidato para QA; no se declara aceptación real ni producción.
Padre obligatorio: `8dbba49403c9970847d211b38fde5bb88ed828fd`.
Rama local: `sabik/s1-accessibility-closure`, en un worktree independiente.
Base S0: `sabik-preview@1181f6f7af6c784d71d58860f7db9928bc0cff89`.
Referencia de coordinación: PR #165; este cierre no modifica el remoto.

## Contrato de accesibilidad

Narrator y los demás lectores de pantalla son tecnologías de accesibilidad:
permiten conocer estados y navegar por el contenido. No son la voz propia de
Sabik. S1 prepara contenido, teclado, foco, nombres y estados accesibles.
La interoperabilidad real debe validarse con la tecnología asistencial.
S2 tratará por separado una posible voz propia opcional y permanece cerrado.
No se incorpora síntesis, selección de voces, API externa ni nueva persistencia.

Se descartan como dirección final los experimentos que intentaban hacer leer
automáticamente toda la respuesta mediante status/replacement, log/addition o
foco forzado. La orden de ariaNotify está cancelada. No se evalúan timbre,
velocidad, naturalidad ni pronunciación como voz propia en S1.

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

Enviar y Ctrl/Cmd+Enter sitúan la entrada como destino de edición; completar la
operación no mueve el foco ni hace scroll. Si la persona navega durante la carga,
el resultado tampoco le roba el foco. No hay foco automático sobre la respuesta.
Se conserva `Escribir otra consulta` / `Write another question`: permite volver
al campo tras navegar voluntariamente por el resultado, sin borrar nada, alterar
la sesión o provocar otro anuncio. Su utilidad no depende de un foco artificial.

| Acción | Evento S0 | Efecto / foco |
| --- | --- | --- |
| Bootstrap | BOOT_OK | Habilita controles, sin foco inicial forzado |
| Enviar | SUBMIT, RETRIEVAL_OK/EMPTY, RESPONSE_READY/ASK_CLARIFICATION | Una operación; foco de entrada, aviso breve al terminar |
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
- S1: 37 casos; A02/A18 se ajustan al foco de entrada y aviso breve autorizados.
- X01–X06: conservación de sesión, cancelaciones, CommonJS y ausencia de inferencia.
- N01–N22: semántica/AX, respuesta fuera de live regions, único aviso ES/EN,
  ausencia de foco forzado y voz, errores, controles, teclado, cancelaciones,
  idiomas estáticos/dinámicos, nombres accesibles, cambio de idioma durante carga,
  respuesta editorial conservada y reflow en inglés.

Se guardan árbol AX de `Qué es el autismo`, mutaciones del aviso, llamadas de
foco, capturas ES/EN y resultados. Estas pruebas no simulan oído humano ni
acreditan interoperabilidad con Narrator. Las simulaciones de texto 200% y
viewport equivalente a zoom 400% tampoco sustituyen la comprobación nativa.

## QA manual pendiente

Usar el dist del SHA entregado; registrar navegador, versión de lector, idioma,
resultado observado y PASS_REAL/FAIL_REAL por caso. No evaluar cómo suena Sabik.

1. Con Narrator, enviar `Qué es el autismo`: aviso breve comprensible, sin doble
   anuncio ni lectura automática forzada de la respuesta. Foco en textarea.
2. Encontrar `Respuesta de Sabik` por navegación normal; leer todo el contenido
   y su aviso complementario. Fuentes y controles alcanzables separadamente.
3. Recorrer teclado completo, incluido retorno voluntario a entrada, pausa,
   reanudación, ocultar/mostrar, reset, validación y error técnico.
4. Cambiar ES/EN; verificar controles, nombres, estados y avisos. Confirmar aviso
   informativo EN y pronunciación apropiada del contenido original marcado ES.
5. Texto 200% nativo y zoom 400% nativo: sin recortes, solapamientos o trampas;
   repetir en ambos idiomas, conservando navegación convencional.
6. Reduced motion, foco visible y lectura sin depender de movimiento/color.

Si el aviso breve no se entiende, registrar un problema de interoperabilidad AT.
No convertirlo en prueba de voz propia, A/B de eco ni repetición de mecanismos
para forzar lectura completa. No se declara PASS_REAL en este cierre técnico.

## Historial y límites

Un único commit nuevo parte directamente de `8dbba494...`, sin rebase, squash ni
reescritura. La rama anterior y el candidato ariaNotify quedan conservados como
histórico separado; no se integra ariaNotify en este candidato. Se entrega bundle
para transporte local; no push con credenciales ajenas, merge ni modificación de
main, Netlify, dominios o producción. S2/S3/S4/S5 continúan fuera de alcance.
