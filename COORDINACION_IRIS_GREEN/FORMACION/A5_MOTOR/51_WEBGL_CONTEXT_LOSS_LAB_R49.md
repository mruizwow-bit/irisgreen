# MOTOR · A5 · LABORATORIO R49 · WEBGL CONTEXT LOSS Y RECUPERACIÓN GPU

Fecha: 01/10/2026
Amplía: R01–R48
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Convertir el aprendizaje teórico de R02/R05/R26/R48 en evidencia ejecutada:

- provocar pérdida real de contexto WebGL;
- observar eventos;
- restaurar;
- verificar invalidez de recursos antiguos;
- crear recursos nuevos;
- comprobar que render API vuelve a operar.

## 2 · Fuentes

- MDN · webglcontextlost
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event
- MDN · webglcontextrestored
  https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextrestored_event
- MDN · WEBGL_lose_context
  https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_lose_context

## 3 · Entorno aislado

No se ejecutó Iris Green.

Laboratorio:
- Chromium 144.0.7559.96;
- entorno virtual Xvfb;
- WebGL2;
- ANGLE/SwiftShader software renderer;
- flag de WebGL habilitado para laboratorio;
- documento mínimo generado en memoria mediante Playwright.

Esto NO demuestra:
- hardware GPU;
- móvil;
- Safari/Firefox;
- runtime 3D integrado.

Sí demuestra:
contrato WebGL de pérdida/restauración en ese entorno.

## 4 · Secuencia

1. crear canvas;
2. obtener WebGL2;
3. obtener `WEBGL_lose_context`;
4. crear buffer;
5. bind buffer;
6. comprobar `isBuffer(old) === true`;
7. registrar:
   - webglcontextlost;
   - webglcontextrestored;
8. llamar `loseContext()`;
9. en lost:
   - preventDefault();
   - comprobar `isContextLost() === true`;
10. llamar `restoreContext()`;
11. en restored:
   - comprobar `isBuffer(old)`;
   - crear/bind buffer nuevo;
   - comprobar `isBuffer(new)`;
   - clear;
   - comprobar getError.

## 5 · Resultado reproducible

```json
{
  "events": ["lost", "restored"],
  "context": "webgl2",
  "oldInitially": true,
  "lost": true,
  "oldAfter": false,
  "freshAfter": true,
  "errorAfter": 0
}
```

## 6 · PASS 1 · eventos

Secuencia:
`lost → restored`.

PASS.

Demuestra que:
- extensión inyectó pérdida;
- listener de lost ejecutó;
- preventDefault permitió restoration;
- listener restored ejecutó.

## 7 · PASS 2 · context state

Durante lost:
`gl.isContextLost() === true`.

Tras restored:
el contexto vuelve operativo.

PASS.

## 8 · PASS 3 · recurso antiguo inválido

Buffer:
- creado y bound antes;
- `gl.isBuffer(old) === true`.

Después de restore:
`gl.isBuffer(old) === false`.

PASS.

Lección:
**los handles/recursos previos no sobreviven restauración.**

## 9 · PASS 4 · recurso nuevo válido

Después de restored:
- createBuffer();
- bindBuffer();
- `isBuffer(fresh) === true`.

PASS.

## 10 · PASS 5 · operación posterior

Después de restored:
- clearColor;
- clear;
- `gl.getError() === 0`.

PASS.

El API vuelve a aceptar trabajo tras recrear recursos.

## 11 · Invariante profesional

Separar:

### Domain state
- peces;
- posiciones;
- parámetros;
- cámara lógica;
- user settings.

### GPU resources
- buffers;
- textures;
- programs;
- framebuffers;
- VAO;
- renderer-internal handles.

Al context loss:
domain state puede sobrevivir.

GPU resources:
deben recrearse.

## 12 · Recovery state machine

```
RUNNING
→ CONTEXT_LOST
→ STOP_DRAW
→ WAIT_RESTORE
→ RECREATE_GPU
→ VALIDATE
→ RUNNING
```

Si recreate falla:
`FALLBACK`.

No:
seguir llamando render esperando que recursos antiguos revivan.

## 13 · webglcontextlost

Handler:
- `preventDefault()` si la app quiere intentar restore;
- mark state;
- pausar draw;
- no crear recursos durante lost;
- conservar domain state.

No hacer trabajo pesado dentro del evento.

## 14 · restored

Handler:
1. reconstruir shader/program;
2. reconstruir buffers;
3. reconstruir textures;
4. framebuffer/state;
5. resize;
6. render validación.

No restaurar solo el renderer object si sus recursos internos murieron.

## 15 · Three.js boundary

Current Iris Green usa Three.js en escenas 3D.

Three/WebGLRenderer puede gestionar partes de context restoration, pero Motor no debe asumir que:
- recursos custom;
- onBeforeCompile;
- external textures;
- domain references

se recuperan automáticamente sin prueba.

Probar framework concreto.

## 16 · Current 3D runtime audit

`tools/escenas-3d/src/index.js`:

Fortalezas:
- stop idempotente;
- cancel rAF;
- ResizeObserver disconnect;
- dispose geometries/materials/textures;
- renderer.dispose;
- forceContextLoss al teardown.

No se observaron:
- webglcontextlost;
- webglcontextrestored;
- explicit rebuild contract.

R48 clasificó esto como:
`QA_CANDIDATE / RESILIENCE_GAP_TO_PROVE`.

R49 demuestra el fenómeno técnico subyacente, no un bug integrado.

## 17 · Failure injection value

Sin injection:
context loss puede ser raro/no reproducible.

Con `WEBGL_lose_context`:
- determinista;
- automatizable;
- regression-testable.

Debe formar parte del QA de una escena GPU crítica si se afirma resilience.

## 18 · Testing next level

### Unit-ish
resource registry reconstruct.

### Browser
lose/restore event.

### Framework
Three renderer + scene.

### Integration
Iris scene:
- aquarium;
- river;
- etc.

### Hardware
real GPU/device.

### Long session
repeated loss/restore.

No ejecutar producto durante Formación.

## 19 · Repeated context loss

Una app robusta no debe:
- duplicar listeners;
- duplicar render loops;
- leak old resources;
- recreate domain state incorrectly.

Prueba futura:
3–5 ciclos lose/restore.

## 20 · Race with teardown

Caso:
- context lost;
- component stop;
- restore arrives later.

Ownership revision/lifecycle debe impedir:
recrear GPU de componente destruido.

R02 cancellation pattern aplica.

## 21 · Race with resize

Context restore + ResizeObserver simultáneo.

Necesita:
- rebuild;
- latest size;
- one render loop.

No asumir event order fijo.

## 22 · Visibility

Context puede perderse en background por presión.

Al restore hidden:
no es necesario reanudar frame loop hasta visible si arquitectura lo permite.

R32 lifecycle.

## 23 · Fallback

Si restore no ocurre/falla:
- Canvas/still image;
- semantic controls/text;
- message recoverable.

No infinite spinner.

Lumen/Astra definen experiencia final.
Motor define runtime fallback.

## 24 · Observability

Evento técnico útil:
```
CONTEXT_LOST
RESTORE_ATTEMPT
RESTORE_OK
RESTORE_FAIL
FALLBACK
```

No enviar telemetría por cuenta de Motor.
Vigía gobierna evidencia/privacidad.

## 25 · Performance

Rebuild puede ser caro.

No reconstruir:
- 4K textures;
- all scenes;
si solo una escena activa necesita recursos.

Lazy resource ownership.

## 26 · Security

`WEBGL_lose_context` se usa solo para test.

No exponer botón/debug público que permita DoS de renderer sin necesidad.

## 27 · Resultado del laboratorio

Checks:
1. lost event PASS.
2. restored event PASS.
3. lost state PASS.
4. old GPU resource invalidated PASS.
5. new GPU resource valid PASS.
6. clear after restore NO_ERROR PASS.

**6/6 PASS**.

## 28 · Limitaciones honestas

No probado:
- hardware GPU;
- Firefox/WebKit;
- mobile;
- Three.js actual recovery;
- Iris Green scene;
- multiple repeated cycles;
- texture/program restoration.

No afirmar más.

## 29 · Marcador

`MOTOR_WEBGL_CONTEXT_LOSS_RECOVERY_LAB_PASS_R49`

## 30 · Límites de jornada

No:
- código productivo;
- listener contextloss en Iris;
- build;
- merge;
- deploy;
- main/production.
