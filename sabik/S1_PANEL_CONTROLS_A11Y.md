# S1 · Controles, foco y accesibilidad del panel

Actualizado: 2026-09-18. Candidato con fallo manual real de anuncio Narrator;
no es una fase aceptada. Investigación: S1_NARRATOR_FIX_BLOQUEADO.

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
| Enviar | SUBMIT, RETRIEVAL_OK/EMPTY, RESPONSE_READY/ASK_CLARIFICATION | Una operación; conserva foco de entrada |
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

La respuesta completa y su aviso se escriben una vez en una única región viva
dedicada. El estado visual y la respuesta visible no duplican regiones vivas.
Pausar y reanudar no vuelven a publicar la respuesta anterior. El anuncio DOM
único está comprobado automáticamente; no equivale a haber escuchado un lector
de pantalla real.

La prueba manual comunicada el 18/09/2026 sobre el candidato `a14dc4be` produjo
FAIL_REAL / ANUNCIO_RESPUESTA_NO_COMPRENSIBLE: sin bucle ni repetición, pero la
respuesta no se oyó completa y comprensible. No se confunde este fallo con voz
propia de Sabik. Sigue sin causa atribuida y requiere nueva QA real con Narrator.

La investigación registró el texto exacto, una mutación por anuncio y una región
persistente expuesta en Chromium con live=polite y atomic=true. `announce()` usa
`replaceChildren(Text)` después de `renderPlan()` y antes del `setLoading(false)`
del finally. Ese finally no borra ni reescribe el anuncio. `aria-busy` pertenece
a `#sabik-output`, que no es ancestro de la región de anuncio: su valor true no
demuestra por sí solo que se suprima o interrumpa la locución. No se ha cambiado
runtime sin evidencia suficiente ni se presenta esta cobertura como un arreglo.

El HTML contiene búsqueda → panel Sabik → resto, sin recolocación por JS. Las
reglas añadidas permiten controles multilínea, reflow y foco visible. No se han
modificado ondas, animaciones, TTS, avatar ni reglas existentes de movimiento.
La navegación convencional y el meta `noindex,follow` se conservan.

## Pruebas y límites de aceptación

- `node tools/test-sabik-machine-s0.js`: 146/146 PASS.
- `node tools/test-sabik-page-v7.js`: 28/28 PASS, exit 0.
- `node tools/test-sabik-s1.js`: 37/37 comprobaciones automáticas PASS y dos
  grupos adicionales: X01–X06 (6/6 PASS) y N01–N10 (10/10 PASS), ejecutados
  en Chrome con la CSP de dist. El total de controles adicionales es 16.
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

N01–N10 verifican una mutación por respuesta, igualdad del texto completo, aviso
una sola vez, silencio durante recuperación, conservación al terminar carga,
dos consultas consecutivas, ausencia de repetición al pausar/reanudar/reset,
error técnico único, foco conservado y ausencia de la antigua región viva del
estado visual. Se cuentan registros de mutación, no solo callbacks del observer.
Estas pruebas pasan también con el runtime que falló manualmente: prueban el
contrato DOM, no comprensibilidad de la locución ni compatibilidad validada con
Narrator. El fallo manual permanece abierto.

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

La rama contiene commits sucesivos de implementación, alineación y diagnóstico.
El último añade únicamente cobertura y documentación, sin corrección de runtime.
Para revertir una integración posterior, identificar y revertir los commits
correspondientes en una rama autorizada; no ejecutar reset
destructivo ni tocar worktrees ajenos. No se requiere migración de datos porque
S1 no añade persistencia.
