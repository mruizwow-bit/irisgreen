# MOTOR · A5 · LABORATORIO R65 · RINCÓN R42 · REANUDACIÓN TRAS REDUCED MOTION

Fecha: 01/10/2026
Amplía: R32/R59/R64
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre issue/PR durante Formación.

## 1 · Objetivo

Comprobar el lifecycle de animación del runtime público:

`assets/rincon-immersive-r42.js`

cuando `reduced()` cambia dinámicamente:

`false → true → false`.

Pregunta:

> ¿la escena WebGL vuelve a programar frames automáticamente al quitar reduced motion?

## 2 · Ruta pública real

Páginas:
- `es/sitio-tranquilo/index.html`;
- `en/quiet-space/index.html`.

Ambas cargan:
- `assets/preferencias-lectura.js`;
- `assets/lectura-accesible.js`;
- `assets/rincon-immersive-r42.js`;
- `assets/rincon-calma.js`.

El panel contiene:
`<button data-a="rm">Reducir movimiento / Reduce motion</button>`.

Por tanto:
la preferencia puede cambiar durante una escena activa.

## 3 · Preferencias globales

`assets/preferencias-lectura.js`:

```js
var systemMotion = matchMedia('(prefers-reduced-motion: reduce)');

function reduceMotion() {
  return state.motion || systemMotion.matches;
}

function apply() {
  ...
  body.classList.toggle('rm', reduceMotion());
}
```

También:

```js
systemMotion.addEventListener('change', notify)
```

cuando la API lo permite.

Conclusión:
`body.rm` cambia dinámicamente por:
- control local;
- preferencia del sistema.

## 4 · Adapter de página

`assets/lectura-accesible.js`:

```js
var names = { ..., rm:'motion' };

if (names[a]) {
  var patch={};
  patch[names[a]] = !P.get()[names[a]];
  P.update(patch);
}
```

El botón público sí llega a la preferencia compartida.

## 5 · Reduced state leído por Rincón

`assets/rincon-calma.js`:

```js
function reduced() {
  var sys = false;
  try {
    sys = matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch(e) {}

  return sys || document.body.classList.contains('rm');
}
```

Esta función se pasa al motor:

```js
scene3d = lib.start(kind, cv3, {
  ...
  reduced: reduced
});
```

## 6 · Scheduler R42

`assets/rincon-immersive-r42.js`:

```js
function draw(now) {
  if (!alive) return;

  ...

  if (!reduced()) time += dt * speed();

  ...

  gl.drawArrays(...);

  if (!reduced())
    raf = requestAnimationFrame(draw);
}
```

Punto clave:

**si reduced() devuelve true, el frame actual termina sin programar otro rAF.**

## 7 · ResizeObserver

El motor también tiene:

```js
ro = new ResizeObserver(function() {
  resize();
  draw(performance.now());
});
```

Esto puede dar un `kick` externo.

Pero:
un cambio de preferencia de movimiento no implica necesariamente resize.

Por tanto:
no es un mecanismo fiable de reanudación.

## 8 · Ausencia de suscripción de Rincón

Se revisó `rincon-calma.js`.

No usa:
- `window.IGPreferences.connect`;
- un listener específico de systemMotion para reiniciar la escena;
- observer de `body.rm` que reactive el rAF.

El motor recibe `reduced()` como función de consulta,
pero solo la consulta cuando `draw()` ya está ejecutándose.

Cuando el loop se ha detenido:
no hay polling.

## 9 · Laboratorio Chromium · scheduler equivalente

Se reprodujo exactamente la semántica de scheduling:

```js
function draw(now) {
  if (!alive) return;
  frames++;

  if (!reduced())
    raf = requestAnimationFrame(draw);
}
```

La preferencia fue mutable.

### Caso A · normal → reduced → normal

Resultados:

```json
{
  "normal": 8,
  "reducedCount": 9,
  "resumedWithoutSignal": 9,
  "afterManualKick": 18,
  "stoppedOnReduce": true,
  "didNotResume": true,
  "resumedAfterKick": true
}
```

Interpretación:
- normal: loop vivo;
- reduce=true: entra como máximo el frame ya pendiente y se detiene;
- reduce=false: **contador no cambia**;
- llamada externa a `draw()`: loop vuelve a funcionar.

## 10 · Caso B · scene starts already reduced

Resultado:

```json
{
  "initialReduced": 1,
  "afterToggle": 1,
  "afterKick": 9,
  "noAutoResume": true,
  "kickResumes": true
}
```

Si la escena arranca en reduced:
- dibuja un frame;
- no agenda otro.

Si luego se desactiva reduced:
- no reanuda automáticamente.

Un kick externo sí reanuda.

## 11 · Evidence level

Código público:
static reachability confirmed.

Scheduler:
`CHROMIUM_SYNTHETIC_BROWSER_PASS`.

No se ejecutó la página pública integrada completa.

Por tanto:
no etiquetar como `INTEGRATION_PASS`.

## 12 · Clasificación

`RINCON_R42_DYNAMIC_REDUCED_MOTION_RESUME_DEFECT_CONFIRMED`

Más precisamente:

`PUBLIC_USER_PATH_REACHABLE`

`ANIMATION_STOPS_CORRECTLY_ON_REDUCE`

`ANIMATION_DOES_NOT_SELF_RESUME_ON_NO_PREFERENCE`

`RESIZE_CAN_ACCIDENTALLY_RESTART_LOOP`

## 13 · Impacto funcional

Cuando una escena WebGL está activa:

### Activar “Reducir movimiento”
Resultado:
la escena se congela tras el frame pendiente.

Eso es compatible con una estrategia de motion reducido.

### Desactivar “Reducir movimiento”
Esperable:
la escena vuelve al modo normal.

Contrato actual:
puede permanecer congelada hasta:
- resize;
- reinicio de escena;
- otro callback externo que invoque draw.

La UI y el runtime pueden quedar desincronizados:
preferencia dice normal;
escena sigue estática.

## 14 · System preference path

`preferencias-lectura.js` escucha cambios del media query del sistema y actualiza `body.rm`.

Por tanto:
el mismo comportamiento puede darse si el sistema pasa:

`reduce → no-preference`

durante la escena.

W3C Media Queries Level 5 describe `prefers-reduced-motion` como preferencia de usuario para minimizar movimiento no esencial.

La web debe responder a la preferencia efectiva; el problema aquí es la transición de vuelta al modo normal.

## 15 · No confundir con requisito de “animar siempre”

No se afirma que reduced motion deba mostrar movimiento.

El hallazgo es:
**la transición de preferencias no es simétrica.**

```
normal → reduced
works

reduced → normal
lacks explicit resume signal
```

## 16 · Candidate architecture

No es patch aprobado.

El runtime necesita un mecanismo explícito para cambio de preferencia:

Opción A:
motor expone:
`refreshMotionPreference()`.

Opción B:
controller Rincón escucha preference changes y:
- if active;
- if now normal;
- if no rAF pending;
- schedules one frame.

Opción C:
motor mantiene rAF pero salta expensive update/render while reduced.

C puede consumir callbacks innecesarios.

La elección requiere:
- Lumen;
- Astra;
- Motor.

## 17 · Guard contra loops duplicados

Cualquier resume debe saber si ya existe rAF pendiente.

Necesita estado explícito:
`rafScheduled`
o equivalente.

No hacer:
`requestAnimationFrame(draw)`
en cada preference event sin ownership.

## 18 · Reduced scene semantics

Decisión pendiente:
reduced mode actual:
- dibuja frame estático.

Puede ser correcto.

Lumen/Axioma/HUMAN QA deciden si:
- static;
- minimal motion;
- lower speed

es experiencia apropiada.

Motor solo asegura transición técnica coherente.

## 19 · Regression test futuro

1. start scene with reduced=false;
2. wait frames;
3. set site reduced=true;
4. assert frame count stops/bounds;
5. set reduced=false;
6. assert frame count resumes without resize;
7. repeat 5×;
8. ensure only one loop active.

También:
system media-query path.

## 20 · Handoff

- Motor: lifecycle/scheduler.
- Lumen: desired reduced-motion perceptual behavior.
- Axioma: formal accessibility criterion.
- Astra: gate/priority.
- Vector: integrated browser preview.

## 21 · Severity

NO asignada por Motor.

Falta:
- integrated reproduction;
- user impact frequency;
- engine/device matrix.

## 22 · Marker

`MOTOR_RINCON_REDUCED_MOTION_RESUME_LAB_PASS_R65`

`RINCON_R42_DYNAMIC_MOTION_RESUME_DEFECT_CONFIRMED`

## 23 · Límites

No:
- product patch;
- issue severity;
- build;
- merge;
- deploy;
- production fix.
