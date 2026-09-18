# S1 · Controles, foco y accesibilidad del panel

Actualizado: 2026-09-18. Candidato de producto con foco en la respuesta visible;
pendiente de UNA revalidación real con Narrator. No es una fase aceptada.
El nuevo cambio parte de `7bc3d31b48987015d7251309927462e01798e662`.

Base obligatoria: `sabik-preview@1181f6f7af6c784d71d58860f7db9928bc0cff89`.
Rama: `sabik/s1-panel-controls-a11y`. Contrato: issue #150 y
`S1_DELIMITACION_PAQUETE_C_2026-09-17.md` entregado fuera del repositorio.

## Arquitectura

Los eventos DOM pasan por `sabik-browser-adapter.js`, que ejecuta el S0
CommonJS aceptado en un Worker local. El shim `module.exports` existe solamente
durante la carga en ese ámbito; no contamina `window` ni modifica el archivo S0.
Cada evento produce `transitionSabikState` y `deriveSabikPresentation`; solo
después se actualizan estado, controles y efectos de interfaz. No se usa eval,
almacenamiento ni una API remota. El Worker requiere la política `worker-src`
existente y funciona con la CSP de `dist` sin `unsafe-eval`.

El alcance conecta el ciclo operativo ordinario y la visibilidad. La respuesta,
clasificación de riesgo, recursos y sesión editorial existentes no se reescriben.
La integración de seguridad avanzada pertenece a S3; no se afirma que todas las
capas futuras de S0 estén conectadas. `sabik-machine.js`, `response.js` y `risk.js`
permanecen intactos.

## Eventos y controles

| Acción | Evento S0 | Efecto / foco |
| --- | --- | --- |
| Bootstrap | BOOT_OK | Habilita controles sin robar foco inicial |
| Enviar | SUBMIT, RETRIEVAL_OK/EMPTY, RESPONSE_READY/ASK_CLARIFICATION | Una operación; foco de entrada durante carga y un foco final en respuesta visible |
| Pausar Sabik | PAUSE_ASSISTANT | Conserva entrada, sesión, respuesta y fuentes; foco en Reanudar |
| Reanudar | RESUME_ASSISTANT | No reenvía; foco en Pausar Sabik |
| Empezar de nuevo | RESET_SESSION | Acción explícita; limpia conversación y conserva preferencias; foco en entrada |
| Ocultar / Mostrar | COLLAPSE / EXPAND | Solo visibilidad; foco en el botón invocador visible |
| Escape | COLLAPSE | Sin reset ni pausa implícita; foco en Mostrar |

Pausa y reanudación son botones separados, no un toggle con `aria-pressed`.
La preferencia existente de intensidad sí conserva su `aria-pressed`.
Los controles incompatibles utilizan `disabled` nativo. `aria-expanded` sigue
la visibilidad S0 y el atributo `hidden` del cuerpo.

Antes del primer await, un bloqueo de envío impide solicitudes duplicadas.
La generación de interfaz invalida resultados y errores tardíos tras pausa o
reset. Ocultar no invalida ni reinicia una petición. El bloqueo de controles
serializa las acciones de usuario; la máquina conserva la autoridad de transición.

## Entrada y accesibilidad

Máximo: 2000 puntos de código Unicode, contados antes de recortar espacios.
No se trunca silenciosamente el texto pegado. Al superar el límite no hay SUBMIT:
se conserva el texto, se muestra el error asociado mediante `aria-describedby`,
se fija `aria-invalid` y se mantiene el foco en la entrada.

Enter y Shift+Enter insertan salto de línea en el textarea. Ctrl/Cmd+Enter envía.
Enter y Space conservan la activación nativa de los botones. Tab y Shift+Tab
siguen el orden DOM, sin trampas de foco.

La respuesta y su aviso complementario se renderizan en nodos normales dentro
del bloque visible `#sabik-response-message`, con `tabindex=-1`, `role=group`,
nombre corto por `aria-labelledby=sabik-output-title` y descripción mediante los
textos reales `sabik-answer sabik-notice`. No hay un aria-label con la respuesta
duplicada. Se hereda español. Las fuentes y los botones quedan fuera del bloque.

Después de un envío explícito por Enviar o Ctrl/Cmd+Enter, se termina de escribir
la respuesta, se finaliza carga (`aria-busy=false`) y se enfoca una sola vez el
bloque visible. No se mueve el foco durante retrieval/composing ni se reescribe
el texto después de enfocarlo. No se devuelve automáticamente al textarea.
Se usa `focus({preventScroll:true})`; solo si queda fuera del viewport se hace
`scrollIntoView` mínimo, instantáneo y sin animación. Se añade contorno visible.

`Escribir otra consulta` es el siguiente control en el orden DOM después del
bloque: Tab y Enter permiten volver al textarea sin borrar contenido, cambiar
sesión ni volver a anunciarlo. También se puede activar con ratón.

La región oculta `#sabik-announcement` queda exclusivamente para mensajes breves
de pausa, reanudación, reset, validación de entrada o inicio. Nunca recibe la
respuesta normal ni el error final de una petición. Mantiene su límite de ocho
entradas; no se usa como segundo mecanismo de respuesta. El error final se
presenta en el mismo bloque visible, limpia fuentes/aviso obsoletos y recibe un
solo foco después de busy=false, sin anunciarse además en el log.

Un resultado invalidado por pausa/reset no enfoca. Si la persona ha ocultado
el panel durante la petición, el resultado no lo reabre ni roba foco al botón
Mostrar; expandir posteriormente tampoco encola un foco. Las acciones Más corto
y Buscar por otra vía no se equiparan a un nuevo envío del formulario para
provocar foco automático de respuesta. No se añade TTS ni Web Speech API.

Cronología de QA real comunicada por María/coordinación:

1. `a14dc4be...`: status/polite/atomic con reemplazo → **FAIL_REAL**.
2. `7bc3d31b...`: log/polite/additions con mensaje completo → **FAIL_REAL**.
3. Nuevo hijo de `7bc3d31b...`: foco en contenido visible → **PENDIENTE_QA_REAL**.

En ambos mecanismos anteriores se comunicaron sonidos/letras aislados, sin
palabras comprensibles, sin bucle ni repetición continua; el DOM/AX conservaba
el texto completo. La nueva orden permite cambiar el destino de foco anterior.
No se solicitan A/B del eco ni repeticiones de status/log. El foco es comprobable
automáticamente; que Narrator lo pronuncie correctamente exige la única prueba
real posterior. No se atribuye una causa interna de Windows ni se declara PASS_REAL.

El HTML contiene búsqueda → panel Sabik → resto, sin recolocación por JS. Las
reglas añadidas permiten controles multilínea, reflow y foco visible. No se han
modificado ondas, animaciones, TTS, avatar ni reglas existentes de movimiento.
La navegación convencional y el meta `noindex,follow` se conservan.

## Pruebas y límites de aceptación

- `node tools/test-sabik-machine-s0.js`: 146/146 PASS.
- `node tools/test-sabik-page-v7.js`: 28/28 PASS, exit 0.
- `node tools/test-sabik-s1.js`: 37/37 comprobaciones automáticas PASS y dos
  grupos adicionales: X01–X06 (6/6 PASS) y N01–N18 (18/18 PASS), ejecutados
  en Chrome con la CSP de dist. El total de controles adicionales es 24.
- `python scripts/build_site.py`: exit 0.

La suite S1 requiere Playwright y Chrome disponibles en el entorno de pruebas;
no añade dependencias al producto. `S1_WEB_ROOT` permite probar `dist` y
`S1_EVIDENCE_DIR` guarda JSON/capturas fuera del repositorio. Las comprobaciones
automáticas son evidencia parcial de los casos mixtos: los casos manuales no
quedan aceptados por el código de salida cero.

V7-019 y V7-022 se alinearon por la orden posterior del microciclo V7, en
`a14dc4be`: controles separados bajo autoridad de S0, sin imponer movimiento S2;
prohibición de inferencia pasiva conservada y eventos explícitos input/keydown
permitidos. X03–X06 comprueban conservación de sesión y comportamiento sin
inferencia; no se confía solo en expresiones regulares.

N01–N18 verifican foco único final, texto visible completo, árbol AX enfocado,
ausencia de respuesta duplicada en regiones vivas, busy=false antes de foco,
dos envíos, error visible, controles sin relectura, retorno sin mutar la sesión,
teclado, aviso completo, cancelación tras reset y panel oculto sin robo de foco.
La consulta exacta `Qué es el autismo` guarda la evidencia AX posterior
`narrator-focus-autismo-ax.json` fuera del repositorio. Se registran tanto llamadas
a focus como eventos, texto, visibilidad y busy en el instante de foco.

A02/A17/A18 se actualizan por el nuevo contrato autorizado: durante carga se
conserva entrada y la respuesta final de un envío explícito sí recibe foco.
Los restantes casos A y X mantienen sus invariantes. La automatización no prueba
la comprensibilidad de la locución ni acepta los casos manuales pendientes.

Única revalidación pendiente: abrir el dist del nuevo SHA en Chrome y Narrator,
escribir `Qué es el autismo` y pulsar Enviar. Sin Tab ni cambio de ventana,
comprobar una lectura completa e inteligible del bloque visible, sin deletreo,
fragmentación o doble anuncio. El foco debe quedar en la respuesta. Después,
Tab → Escribir otra consulta → Enter debe volver al campo conservando respuesta
y sesión. Registrar SHA y PASS_REAL o FAIL_REAL de María. No es un A/B.

Se ha operado el panel en navegador con Tab/Shift+Tab, Enter/Space, Escape,
pausa/ocultar/mostrar, reanudar, reset y límite. La revisión visual de capturas
incluye 320 CSS px y texto ampliado por simulación. Sigue pendiente completar el
recorrido manual integral, lector real, texto 200 % nativo y zoom 400 % nativo.
La simulación de viewport 320x225 no sustituye el zoom real. El informe externo
contiene la matriz de 37 casos y diferencia AUTOMATIZADO_PASS, MANUAL_PASS y
PENDIENTE_ENTORNO. No se declara 37/37 aceptación completa.

## Exclusiones y reversión

Sin cambios en S0, S2/S3/S4/S5, datos, fixtures, API, Educación, Unity, Netlify,
dominios, main, producción ni noindex. El worktree antiguo es solo referencia.
La rama sigue sin integración autorizada. La orden actual identifica el candidato
como PR #165; esta investigación local no modifica ni verifica el estado remoto.

La rama contiene commits sucesivos de implementación, alineación, diagnóstico
y sustituciones del mecanismo de anuncio y de foco. El nuevo commit de producto es
hijo de `7bc3d31b...`; no reescribe los candidatos anteriores.
Para revertir una integración posterior, identificar y revertir los commits
correspondientes en una rama autorizada; no ejecutar reset
destructivo ni tocar worktrees ajenos. No se requiere migración de datos porque
S1 no añade persistencia.
