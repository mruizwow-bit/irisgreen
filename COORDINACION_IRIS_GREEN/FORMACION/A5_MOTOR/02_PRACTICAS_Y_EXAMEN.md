# MOTOR · A5 · PRÁCTICAS Y EXAMEN R01

Fecha: 30/09/2026  
Puesto: **Interactive Systems & Web Runtime Engineer**  
Jefatura: **Astra**

## Regla

Esta formación interna no equivale a certificación externa.

PASS aquí significa:
- estudió el concepto;
- lo explicó con sus palabras;
- lo aplicó sobre un sistema real de Iris Green;
- ejecutó al menos un caso negativo;
- dejó evidencia reproducible.

---

# PRÁCTICAS

## Práctica 1 · Máquina de estados y motion runtime

Objeto real:
`sabik/sabik-motion-r37.js`

Objetivo:
demostrar comprensión de:
- estados;
- proyección de intención;
- niveles de movimiento;
- transiciones;
- invariantes;
- rechazo de entradas inválidas.

### Ejecución aislada

Se cargó el módulo sin modificar el producto y se ejecutaron 11 comprobaciones unitarias.

Resultado:

```text
PASS normal remains normal
PASS system reduced becomes REDUCIDO
PASS low intensity disables movement
PASS risk projects to stable present
PASS correction projects to orientar
PASS context projects to transicion
PASS confirmation projects to confirmar
PASS no-motion transition has zero duration
PASS normal orientar transition animates
PASS invalid state throws
PASS controller rejects unstable transition destination
RESULT 11 checks passed
```

### Qué demuestra

- los estados aceptados están cerrados;
- las preferencias de movimiento se proyectan de forma explícita;
- `SIN_MOVIMIENTO` elimina duración;
- riesgo/error no dispara motion expresivo;
- el contrato rechaza estados desconocidos;
- un estado transitorio no puede usarse como destino estable.

### Prueba negativa

Entrada:
`transition('no-existe', 'orientar', 'NORMAL')`

Resultado esperado y obtenido:
`RangeError`.

PASS.

---

## Práctica 2 · Cancelación y trabajo obsoleto

Objeto real:
`sabik/sabik-motion-r37.js`

Hallazgo positivo:
el controller usa una `revision` y tickets. Una intención nueva invalida el resultado asíncrono anterior antes de que pueda aplicarse.

Lección:
**invalidar el resultado no equivale a cancelar el trabajo que lo produce.**

Si `load()` implica una operación abortable:
- fetch;
- stream;
- operación con AbortSignal;
- tarea propia que admita cancelación;

Motor debe preferir:

`NEW INTENT → ABORT OLD WORK → INVALIDATE TICKET → START NEW WORK → CHECK OWNERSHIP → APPLY`

No:
`START EVERYTHING → IGNORE MOST RESULTS`.

Prueba negativa conceptual:
simular A lenta → B nueva → A termina después.

Criterio:
A nunca puede sobrescribir B.
Si A además puede abortarse, debe detenerse para no consumir recursos innecesarios.

---

## Práctica 3 · Frame loop, GPU y cleanup

Objeto real:
`tools/escenas-3d/src/index.js`

Elementos auditados:
- `requestAnimationFrame`;
- timestamp real;
- `dt` limitado;
- pausa de actualización cuando `document.hidden`;
- throttling de estado idle;
- DPR máximo;
- resolución adaptativa;
- `ResizeObserver`;
- disposal de geometrías, materiales y texturas;
- `renderer.dispose()`;
- `forceContextLoss()` al terminar.

Aprendizaje:
el frame loop no debe asumir 60 Hz.
La simulación usa tiempo, no número de frames.

Prueba negativa:
si un motor actualizase `x += 1` por frame sin timestamp, una pantalla de 120/144 Hz alteraría la velocidad perceptiva.

Criterio de Motor:
animación temporal = función del tiempo transcurrido.

Pendiente avanzado:
probar pérdida/restauración espontánea de contexto WebGL y reconstrucción de recursos en un entorno específico antes de afirmar resiliencia completa.

---

## Práctica 4 · Input directo + equivalente semántico

Objeto real:
`assets/ig-taller-r42-direct.js`

Encontrado:
- pointerdown/move/up/cancel;
- pointer capture;
- Canvas para manipulación directa;
- teclado con flechas/Home/End/Espacio/Enter;
- status live;
- cuadrícula semántica alternativa.

Aprendizaje:
Canvas puede mejorar manipulación, pero no debe convertirse en el único modelo accesible de la herramienta.

Caso a vigilar:
el runtime activa celdas durante `pointerdown`.

Según el propósito de cada herramienta, Motor debe comprobar WCAG 2.5.2 Pointer Cancellation:
- si la acción es irreversible o sensible, preferir activación en up/click o permitir abort/undo;
- si la operación es una manipulación continua esencial, documentar la semántica correcta.

No se declara FAIL global solo por detectar `pointerdown`; exige revisar la función real de cada motor.

---

## Práctica 5 · Workers, OffscreenCanvas y fallbacks

Objetos reales:
- `assets/ig-taller-r42-platform.js`;
- `assets/workers/ig-taller-r42-worker.js`.

Encontrado:
- feature detection;
- cálculo de Life en Worker;
- preview con OffscreenCanvas/ImageBitmap;
- fallback local para Life;
- error del worker gestionado;
- AudioWorklet con fallback Web Audio;
- WebGPU detectado, no impuesto.

Aprendizaje:
mover una tarea a Worker protege capacidad de respuesta del main thread, pero:
- postMessage tiene coste;
- serializar datos tiene coste;
- la tarea sigue consumiendo CPU;
- las tareas pendientes necesitan estrategia de cancelación/supersedencia;
- no todo trabajo justifica un Worker.

Hallazgo de frontera:
el fallback local de `withLock` evita solapamiento dentro de la misma instancia JavaScript, pero no sustituye las garantías cross-tab de Web Locks.

---

## Práctica 6 · Runtime QA

Objetos reales:
- `scripts/test_web_r22_interactions.py`;
- `scripts/test_web_r22_webgl.py`.

Cobertura ya existente estudiada:
- 320 / 390 / 1280 px;
- reduced motion;
- teclado;
- axe;
- overflow;
- aumento de texto/spacing;
- lazy loading;
- no-JS;
- WebGL con SwiftShader;
- page errors;
- screenshots como evidencia.

Aprendizaje:
una captura puede demostrar composición visual, no comportamiento completo.

Motor debe poder separar:
- test de contrato;
- test de interacción;
- test de accesibilidad;
- test de rendimiento;
- test perceptivo/HUMAN QA.

---

# EXAMEN R01 · RESPUESTAS

## 1. ¿Cuál es mi profesión?

**Interactive Systems & Web Runtime Engineer.**

Construyo y verifico el comportamiento interactivo que vive en el navegador: estado, eventos, trabajo asíncrono, input, render, cancelación, fallback, cleanup y rendimiento.

No soy el release engineer, el diseñador del sistema visual ni el responsable del modelo de IA.

PASS.

## 2. ¿Qué diferencia hay entre estado, evento y efecto?

- estado = situación durable del sistema;
- evento = algo que ocurre y puede provocar una transición;
- efecto = trabajo producido por la transición: cargar, renderizar, reproducir, guardar, etc.

Si se mezclan, aparecen estados imposibles y carreras.

PASS.

## 3. ¿Por qué no debo asumir 60 Hz?

`requestAnimationFrame` sigue la frecuencia de repintado disponible y puede ejecutarse en pantallas de tasas distintas.

La velocidad debe depender del timestamp/delta, no de “un paso por frame”.

PASS.

## 4. ¿Ignorar una respuesta vieja equivale a cancelarla?

No.

Un ticket/revisión impide aplicar un resultado obsoleto.
Abortar detiene trabajo abortable.

Necesito ambos cuando el coste o el side effect lo justifican.

PASS.

## 5. ¿Por qué `click` suele ser mejor evento de activación que `pointerdown`?

Porque `click` es device-independent y ocurre tras la secuencia de activación, dando mejor oportunidad de cancelación.

`pointerdown` sigue siendo adecuado para comenzar una manipulación continua cuando la semántica lo requiere.

PASS.

## 6. ¿Reduced motion significa solo acortar una animación?

No.

Significa evitar/reducir movimiento no esencial de acuerdo con la preferencia de la persona, conservando la función y el feedback necesarios.

Una duración menor todavía puede producir un desplazamiento molesto.

PASS.

## 7. ¿Por qué Canvas necesita una estrategia semántica?

Porque el bitmap no expone automáticamente los objetos dibujados como controles/estructura accesible.

La información y acción significativa deben tener equivalente operable y comprensible.

PASS.

## 8. ¿Cuándo usar un Worker?

Cuando mover cálculo fuera del main thread mejora la capacidad de respuesta y el coste de comunicación no invalida el beneficio.

No por moda ni para microtareas triviales.

PASS.

## 9. ¿Qué obligaciones técnicas aparecen con WebGL?

Gestionar:
- resolución;
- recursos GPU;
- draw/update cost;
- cleanup;
- pérdida de contexto;
- fallback;
- rendimiento real del dispositivo.

PASS.

## 10. ¿Por qué WebGPU no es baseline de Iris Green?

Porque a 30/09/2026 la documentación MDN consultada lo clasifica con disponibilidad limitada/no Baseline.

Puede ser mejora progresiva, no dependencia única de una función pública.

PASS.

## 11. ¿Qué mide INP?

Capacidad de respuesta a interacciones de usuario, considerando latencia hasta el siguiente paint.

Como referencia de Core Web Vitals, web.dev mantiene ≤200 ms en p75 como rango “good”.

Eso no sustituye pruebas de interacción ni HUMAN QA.

PASS.

## 12. ¿Qué hago antes de integrar una API avanzada?

1. definir problema;
2. medir baseline;
3. comprobar soporte real;
4. definir fallback;
5. verificar a11y y privacidad;
6. medir coste;
7. probar fallo/cancelación;
8. justificar beneficio.

PASS.

## 13. ¿Cuándo escalo a otra especialidad?

- sistema visual/plataforma → Prisma;
- estándares/conformidad → Axioma;
- arquitectura/gate → Astra;
- media inmersiva → Lumen;
- audio/media validation → Eco cuando aplique;
- conversación → Pulso;
- modelo/RAG/LLMOps → Córtex;
- release/deploy → Vector.

PASS.

---

# RESULTADO

Práctica aislada ejecutada:
**11/11 checks PASS**.

Auditorías read-only:
**6 bloques prácticos completados**.

Examen:
**13/13 respuestas razonadas**.

Marcador interno:

`MOTOR_INTERACTIVE_SYSTEMS_WEB_RUNTIME_FOUNDATION_STUDIED_R01`

Este marcador NO es una certificación profesional externa.
