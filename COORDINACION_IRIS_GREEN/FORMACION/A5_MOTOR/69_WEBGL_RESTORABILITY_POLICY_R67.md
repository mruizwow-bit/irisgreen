# MOTOR · A5 · LABORATORIO R67 · WEBGL RESTORABILITY POLICY Y R42

Fecha: 01/10/2026
Amplía: R49/R51/R66
Puesto: **Interactive Systems & Web Runtime Engineer**

No modifica producto.
No abre issue/PR durante Formación.

## 1 · Objetivo

Cerrar con evidencia de navegador el gap de R66:

> ¿qué ocurre si un runtime WebGL pierde el contexto y NO cancela el evento `webglcontextlost`?

El runtime público R42:
`assets/rincon-immersive-r42.js`

no registra:
- `webglcontextlost`;
- `webglcontextrestored`.

## 2 · Regla de especificación

WebGL:

Cuando ocurre context loss:
1. se dispara `webglcontextlost`;
2. si el evento NO queda canceled,
   el algoritmo de restauración se aborta;
3. si la aplicación llama `preventDefault()`,
   el contexto puede quedar marcado como restorable;
4. tras restore,
   todos los recursos WebGL antiguos son inválidos y deben recrearse.

Fuente:
Khronos WebGL specification / WEBGL_lose_context.

## 3 · Entorno

Laboratorio real:
- Chromium 144;
- Xvfb;
- WebGL2/ANGLE SwiftShader;
- `WEBGL_lose_context`;
- Playwright;
- canvas aislado.

Evidence label:
`CHROMIUM_LAB_PASS`.

No Iris Green integrada.

## 4 · Caso A · sin preventDefault

Listeners:

```js
canvas.addEventListener('webglcontextlost', () => lost++);
canvas.addEventListener('webglcontextrestored', () => restored++);
```

Secuencia:
- loseContext();
- wait;
- restoreContext();
- wait.

Resultado:

```json
{
  "supported": true,
  "lost": 1,
  "restored": 0,
  "lostState": true,
  "stillLost": true,
  "errorAfterRestoreCall": 37442
}
```

Interpretación:
- lost event llegó;
- no se canceló default;
- restored event NO llegó;
- contexto siguió perdido.

PASS como demostración de no-restorability.

## 5 · Caso B · con preventDefault

Listener:

```js
canvas.addEventListener('webglcontextlost', e => {
  lost++;
  e.preventDefault();
});
```

Resultado:

```json
{
  "supported": true,
  "lost": 1,
  "restored": 1,
  "lostState": true,
  "stillLost": false,
  "errorAfterRestore": 0
}
```

PASS.

La aplicación permitió restauración y el contexto volvió operativo.

## 6 · Aplicación a R42 público

`rincon-immersive-r42.js`:

No contiene listeners:
- webglcontextlost;
- webglcontextrestored.

Por tanto, si el contexto se pierde de forma espontánea:

**R42 no ejecuta el paso requerido para declararlo restorable.**

No existe además una rutina de:
- recreate program;
- recreate shaders;
- recreate VAO;
- re-query uniforms;
- restart loop.

## 7 · Clasificación

`RINCON_R42_WEBGL_CONTEXT_RECOVERY_NOT_IMPLEMENTED_CONFIRMED`

Más precisamente:

`STATIC_CODE_PATH_CONFIRMED_NO_LOST_HANDLER`

`WEBGL_PLATFORM_LAB_CONFIRMED_NO_PREVENTDEFAULT_MEANS_NO_RESTORE`

`INTEGRATED_R42_CONTEXT_LOSS_NOT_EXECUTED`

## 8 · Diferencia con R49/R51

R49/R51:
demostraron que:
- con preventDefault;
- restore;
- recreation;

WebGL puede recuperarse.

R67:
demuestra la condición inversa:
**sin preventDefault, el contexto no se restaura.**

Juntos definen el contrato completo.

## 9 · Impacto técnico esperado

Ante context loss:
- gl calls posteriores son ignoradas/invalid;
- scene may remain frozen/black;
- current rAF can continue scheduling;
- no recovery callback exists;
- user must restart scene/page to acquire a fresh canvas/context path.

No se ha medido experiencia integrada.

## 10 · Context loss real causes

Puede ocurrir por:
- GPU reset;
- resource pressure;
- GPU switch;
- browser/device conditions.

No es un evento puramente artificial.

El laboratorio usa extension solo para reproducibilidad.

## 11 · Fallback question

R42 tiene static2d fallback para:
- context creation failure;
- shader compile/link failure.

Pero no tiene automatic fallback for:
**context lost after successful start**.

Eso es una categoría distinta.

## 12 · Candidate architecture

No es patch aprobado.

On lost:
```
event.preventDefault()
cancelAnimationFrame(raf)
state = CONTEXT_LOST
```

On restored:
Opción A:
- recreate program/VAO/uniform locations;
- resize;
- restart.

Opción B:
- stop WebGL;
- switch to static2d fallback.

For Rincón:
B puede ser más simple/predictable.

Lumen/Astra decide desired experience.
Motor implements runtime contract.

## 13 · Why static fallback may be preferable

R42 shader scene has no user-created complex GPU state.

If context lost:
a static visual preserves:
- content;
- sensory safety;
- controls.

Recovery can be lower priority than keeping task usable.

But:
must be explicit.

## 14 · Regression test future

1. start public scene;
2. get `WEBGL_lose_context`;
3. loseContext();
4. assert:
   - no console cascade;
   - UI controls remain;
   - status/fallback appears;
5. restore/fallback path according to decision;
6. repeat 3×.

## 15 · Relation to gate R66

R66 G12 was:
`NOT_EVIDENCED`.

After R67:

Evidence becomes stronger:

`RESILIENCE_GAP_CONFIRMED__RECOVERY_PATH_ABSENT`

Still no product severity.

## 16 · Marker

`MOTOR_WEBGL_RESTORABILITY_POLICY_LAB_PASS_R67`

`RINCON_R42_CONTEXT_RECOVERY_ABSENT_CONFIRMED`

## 17 · Límites

No:
- product patch;
- severity;
- integrated R42 execution;
- Firefox/WebKit;
- hardware GPU;
- build;
- merge;
- deploy.
