# S1 · Controles, foco y accesibilidad del panel

Actualizado: 2026-09-18. Candidato con ariaNotify como mejora progresiva;
pendiente de UNA revalidación real con Narrator. No es una fase aceptada.
El nuevo cambio parte de `8dbba49403c9970847d211b38fde5bb88ed828fd`.

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
| Enviar | SUBMIT, RETRIEVAL_OK/EMPTY, RESPONSE_READY/ASK_CLARIFICATION | Una operación; conserva foco de entrada y notifica por un solo canal |
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

La respuesta y su aviso complementario permanecen visibles en nodos normales
dentro de `#sabik-response-message`. No cambia el texto editorial del Core.
`announceToAT()` normaliza espacios/saltos redundantes, descarta cadenas vacías
y selecciona una sola vía mediante `typeof document.ariaNotify === "function"`:

- Si existe: una llamada `document.ariaNotify(textoCompleto, {priority:"normal"})`.
  La región fallback no se actualiza.
- Si no existe: una actualización completa del nodo de texto en la región
  permanente `#sabik-announcement`, `role=status`, `aria-live=polite`,
  `aria-atomic=true`. No se usa simultáneamente el canal ariaNotify.

Se notifica el texto visible completo de respuesta y aviso no vacío, después de
renderizar y finalizar busy. Se excluyen fuentes, botones, navegación, textarea
y estados intermedios. Pausa, reanudación, reset, validación y error usan la misma
función con su propio mensaje, sin republicar la respuesta anterior. El error
final permanece visible. Los resultados invalidados por pausa/reset no notifican.
El fallback conserva solo el último mensaje; no se añade historial persistente.

Se elimina `focusFinalResponse()` y el foco/scroll automático de locución. Tras
Enviar el textarea conserva el foco; si el usuario lo mueve durante la petición,
la notificación no lo devuelve ni lo roba. La respuesta admite navegación por
teclado con `tabindex=0`. El botón `Escribir otra consulta` se conserva porque
permite volver al campo después de recorrer respuesta y fuentes, sin borrar
contenido ni alterar la sesión. Desde el bloque, Tab y Enter vuelven al campo;
entrar al bloque por Tab es una acción voluntaria, no el canal de notificación.

No hay detección por navegador/OS, prioridad high, temporizadores para forzar
voz, role=application ni Web Speech API. La interfaz siempre conserva el texto
visible independientemente del canal. `ariaNotify` es una API emergente, no
universal en 2026; se utiliza como mejora progresiva experimental, sin asumir
soporte de todas las combinaciones de navegador y tecnología asistencial.
La técnica W3C ARIA27 recomienda esa cautela:
https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA27.html
La especificación WAI-ARIA 1.3 continúa como borrador:
https://w3c.github.io/aria/#ARIANotifyMixin

Cronología de QA real comunicada por María/coordinación:

1. `a14dc4be...`: status/replacement → **FAIL_REAL**.
2. `7bc3d31b...`: log/addition → **FAIL_REAL**.
3. `8dbba494...`: foco en respuesta visible → **FAIL_REAL**.
4. Nuevo hijo de `8dbba494...`: ariaNotify con fallback → **PENDIENTE_QA_REAL**.

No se revalidan por separado los tres mecanismos anteriores. El fallback es
compatibilidad para navegadores sin la API; no se declara que cure el FAIL_REAL
histórico de status. Detectar la función y realizar una llamada no demuestra que
Narrator la haya pronunciado, ni identifica el origen del fallo anterior.

El HTML contiene búsqueda → panel Sabik → resto, sin recolocación por JS. Las
reglas añadidas permiten controles multilínea, reflow y foco visible. No se han
modificado ondas, animaciones, TTS, avatar ni reglas existentes de movimiento.
La navegación convencional y el meta `noindex,follow` se conservan.

## Pruebas y límites de aceptación

- `node tools/test-sabik-machine-s0.js`: 146/146 PASS.
- `node tools/test-sabik-page-v7.js`: 28/28 PASS, exit 0.
- `node tools/test-sabik-s1.js`: 37/37 comprobaciones automáticas PASS y dos
  grupos adicionales: X01–X06 (6/6 PASS) y N01–N25 (25/25 PASS), ejecutados
  en Chrome con la CSP de dist. El total de controles adicionales es 31.
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

N01–N25 ejercitan ambas ramas: mock explícito disponible y API deshabilitada
solo en el test. Comprueban una llamada o una actualización completa por
respuesta, prioridad normal, exclusión mutua, foco conservado, errores, controles,
dos envíos, aviso complementario, normalización, mensajes vacíos, teclado y
cancelación de notificaciones tardías. No se equipara un mock con soporte nativo.

N21 registra `typeof document.ariaNotify` ANTES de cualquier sustitución en un
contexto nuevo. Si existe, su observador llama al método nativo original y prueba
`Qué es el autismo` con una llamada completa. Si no existe, registra undefined y
prueba el fallback. Guarda `arianotify-native-autismo.json` con versión de Chrome,
tipo nativo, argumentos, mutaciones, foco y AX. La detección corresponde al Chrome
de automatización de Codex; no certifica el perfil ni la voz de María.

Resultado de esta ejecución: Chrome `152.0.7977.83`, tipo nativo **function**.
La consulta real produjo una llamada al método nativo con texto completo y
`priority=normal`, cero mutaciones fallback y foco en `sabik-input`.
Esto verifica la invocación, no la entrega audible a Narrator.

A02/A18 vuelven al contrato de notificación sin foco forzado. A17 conserva foco
en entrada durante recuperación. Los 37 casos y X01–X06 mantienen su cobertura;
el código cero no acepta los casos manuales pendientes.

Única revalidación pendiente: abrir el dist del nuevo SHA en Chrome/Narrator,
escribir `Qué es el autismo` y pulsar Enviar. Sin Tab ni cambiar de ventana,
comprobar una lectura completa e inteligible, una sola vez, sin deletreo ni
duplicidad, manteniendo el foco en el campo. Registrar SHA, disponibilidad real
de la API en ese Chrome y PASS_REAL o FAIL_REAL de María. No pedir A/B del eco,
status, log ni foco otra vez. Si falla también con ariaNotify disponible, detener
la experimentación de S1 y escalar la incompatibilidad AT/navegador a investigación
especializada, sin encadenar otro mecanismo especulativo.

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
y sustituciones del anuncio/foco; ahora incluye ariaNotify progresivo. El nuevo commit de producto es
hijo de `8dbba494...`; no reescribe los candidatos anteriores.
Para revertir una integración posterior, identificar y revertir los commits
correspondientes en una rama autorizada; no ejecutar reset
destructivo ni tocar worktrees ajenos. No se requiere migración de datos porque
S1 no añade persistencia.
