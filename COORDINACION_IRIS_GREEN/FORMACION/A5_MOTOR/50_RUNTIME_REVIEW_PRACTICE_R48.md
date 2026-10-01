# MOTOR · A5 · PRÁCTICA PROFESIONAL R48 · RUNTIME REVIEW SOBRE A5 ACTUAL

Fecha: 01/10/2026
Amplía: R01–R47
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Objetivo

Aplicar la formación acumulada a código real de A5 sin convertir una auditoría read-only en una lista de “bugs”.

Clasificación usada:

### STRENGTH_CONFIRMED
Patrón positivo observado directamente.

### QA_CANDIDATE
Comportamiento que merece prueba específica antes de concluir PASS/FAIL.

### ARCHITECTURAL_CONDITION
Es correcto bajo el lifecycle actual, pero sería deuda si el lifecycle/alcance cambia.

### OUT_OF_SCOPE_CONCLUSION
No existe evidencia suficiente para afirmar problema.

Regla:
**observación ≠ defecto ≠ incidencia de producto.**

## 2 · Archivos revisados

- `sabik/iris-mount.mjs`
- `sabik/sabik-motion-r37.js`
- `assets/ig-taller-r42-direct.js`
- `assets/ig-taller-estudio.js`
- `assets/ig-taller-r40-tools.js`
- `assets/ig-taller-r42-platform.js`
- `tools/escenas-3d/src/index.js`

## 3 · Sabik mount · stale result protection

Archivo:
`sabik/iris-mount.mjs`.

Observado:
- `serial`;
- ticket por submit;
- `panel.cancel()`;
- checks `ticket !== serial`;
- cancel incrementa serial.

Clasificación:
**STRENGTH_CONFIRMED**.

Qué protege:
respuesta vieja no debe actualizar una intención nueva.

Límite:
no demuestra que cada operación subyacente quede físicamente abortada.

R02:
invalidar ownership y abortar trabajo son operaciones distintas.

## 4 · Sabik · Ctrl/Cmd+Enter e IME

Observado:
```js
if (e.key==='Enter' && (e.ctrlKey||e.metaKey)) {
  e.preventDefault();
  requestSubmit();
}
```

No se observa:
`e.isComposing`.

Clasificación:
**QA_CANDIDATE**.

Prueba:
- IME active;
- Ctrl/Cmd+Enter;
- confirmar si el navegador/IME genera combinación susceptible;
- comprobar que no envía composición incompleta.

No se declara bug sin entorno IME real.

## 5 · Sabik · pagehide

Observado:
`pagehide → serial++ → cancel → disconnect`.

No se observa:
`visibilitychange`.

Clasificación:
**QA_CANDIDATE / ARCHITECTURAL_CONDITION**.

Contexto R32:
pagehide no es garantía final en todos los cierres móviles.

Pero:
transport ownership pertenece también a Pulso.

No proponer cambio unilateral desde A5.

## 6 · Sabik · MutationObserver lifecycle

Observado:
```
new MutationObserver(translate).observe(document.documentElement,...)
```

No se conserva referencia para disconnect explícito.

Clasificación:
**ARCHITECTURAL_CONDITION**.

Si mount vive toda la página:
lifecycle coincide con document.

Si panel se monta/desmonta dinámicamente:
necesitará owner/destroy.

No bug actual demostrado.

## 7 · Sabik motion · revision ownership

Archivo:
`sabik/sabik-motion-r37.js`.

Observado:
- revision;
- pending Map;
- cancel incrementa revision;
- pending promises se resuelven cancelled;
- active animation se cancela;
- ticket check antes de apply.

Clasificación:
**STRENGTH_CONFIRMED**.

Este patrón debe conservarse.

## 8 · Sabik motion · load abortability

Observado:
`load(next)` devuelve Promise pero controller no pasa AbortSignal.

Clasificación:
**ARCHITECTURAL_CONDITION**.

Si `load`:
- recurso local pequeño;
- decode no abortable;
puede ser suficiente invalidar resultado.

Si evoluciona a:
- fetch;
- stream;
- expensive task abortable;

añadir cancellation contract.

No afirmar deuda sin saber implementación concreta de load.

## 9 · R42 direct · observer ownership

Archivo:
`assets/ig-taller-r42-direct.js`.

Observado:
- MutationObserver por upgraded grid;
- ResizeObserver por wrapper;
- listeners pointer/keyboard;
- no destroy API.

Clasificación:
**ARCHITECTURAL_CONDITION**.

Lifecycle actual parece page/study lifetime.

Si pasa a:
- SPA mount/unmount;
- hot replace;
- repeated dynamic creation;

debe existir destroy/disconnect.

## 10 · R42 direct · pointerdown activation

Observado:
pointerdown:
- painting true;
- capture;
- `activate(indexAt(e))`.

Es una herramienta de pintura continua.

Clasificación:
**QA_CANDIDATE**.

Pregunta:
¿la acción ejecutada en down es:
- esencial para direct manipulation;
- abortable/undoable;
- apropiada bajo WCAG Pointer Cancellation?

No decidir solo por patrón textual.

Probar función concreta con Axioma.

## 11 · R42 direct · pointercancel

Observado:
`pointerup` y `pointercancel` limpian:
- painting=false;
- visited.clear().

Clasificación:
**STRENGTH_CONFIRMED**.

Protege contra gesto pegado.

## 12 · Taller estudio · undo shortcut scope

Archivo:
`assets/ig-taller-estudio.js`.

Observado:
- listener keydown en scope/document;
- excluye INPUT/TEXTAREA/SELECT salvo opt-in;
- excluye `.igl`;
- Ctrl/Cmd+Z/Y.

No se observa:
- `isComposing`;
- contenteditable handling.

Clasificación:
**ARCHITECTURAL_CONDITION + QA_CANDIDATE**.

Hoy no se identificó contenteditable en los motores auditados.

Si aparece editor rico:
scope debe revisarse.

## 13 · Taller estudio · beforeunload

Observado:
listener `beforeunload` está instalado siempre;
solo llama preventDefault cuando `dirty`.

Clasificación:
**QA_CANDIDATE**.

Preguntas:
- bfcache Firefox/otros;
- mobile close;
- listener always-on vs only-when-dirty.

R32:
beforeunload es válido para warning de datos no guardados,
pero no para autosave.

Prueba cross-browser antes de cambiar.

## 14 · Taller file import

Observado:
- hidden file input;
- size limit 8 MiB;
- JSON parse;
- formato check;
- studio check;
- onData tras validación básica.

Clasificación:
**STRENGTH_CONFIRMED** para guardas iniciales.

Límite:
schema profundo/version migration pertenece a capa local más nueva donde existe `validateImportText()`.

No confundir dos generaciones del motor.

## 15 · R40 tools · game key listener

Archivo:
`assets/ig-taller-r40-tools.js`.

Observado:
`document.addEventListener('keydown', ...)`
cuando `state.play`,
flechas mueven jugador.

No se observa en ese handler:
- target/focus filter;
- preventDefault.

Clasificación:
**QA_CANDIDATE**.

Pruebas:
- foco en botón durante play;
- ArrowDown;
- page scroll;
- AT/keyboard navigation;
- exiting play.

No se declara bug sin test de página real.

## 16 · R42 platform · worker error

Archivo:
`assets/ig-taller-r42-platform.js`.

Observado:
`worker.onerror`:
- rejects all pending;
- clears pending;
- terminate;
- worker=null.

Clasificación:
**STRENGTH_CONFIRMED**.

Luego:
lifeStep() puede caer a local.

Buen fail-soft pattern.

## 17 · R42 platform · singleton resources

Observado module-level:
- Worker;
- BroadcastChannel;
- AudioContext/audioEngine.

No existe shutdown general del módulo.

Clasificación:
**ARCHITECTURAL_CONDITION**.

Si plataforma vive page lifetime:
puede ser correcto.

Si futuras rutas SPA montan/desmontan workspaces:
necesitar:
- acquire;
- reuse;
- release/shutdown.

## 18 · R42 platform · BroadcastChannel subscriptions

Observado:
`subscribe(fn)` devuelve función unsubscribe.

Clasificación:
**STRENGTH_CONFIRMED**.

Contrato bueno:
owner caller puede liberar listener.

Aun así:
canal singleton no se cierra hasta page lifetime.

## 19 · R42 platform · AudioContext creation

Observado:
AudioContext se crea dentro de `ensureAudio()`, llamado al solicitar tono.

No se crea en módulo load.

Clasificación:
**STRENGTH_CONFIRMED** como lazy acquisition.

Pendiente:
user activation real se prueba en flujo integrado.

No declarar autoplay PASS por lectura.

## 20 · 3D runtime · cleanup

Archivo:
`tools/escenas-3d/src/index.js`.

`stop()`:
- alive=false;
- cancelAnimationFrame;
- ResizeObserver.disconnect;
- traverse scene;
- geometry.dispose;
- texture dispose;
- material.dispose;
- renderer.dispose;
- forceContextLoss.

Clasificación:
**STRENGTH_CONFIRMED**.

Es el patrón de cleanup más completo observado en esta práctica.

## 21 · 3D runtime · hidden tab

Observado:
`if (!document.hidden)` evita update/render.

Además:
dt se clampa a 0.05.

Clasificación:
**STRENGTH_CONFIRMED**.

Reduce:
- GPU invisible;
- giant catch-up step al volver.

## 22 · 3D runtime · spontaneous context loss

No se observan listeners:
- webglcontextlost;
- webglcontextrestored.

Clasificación:
**QA_CANDIDATE / RESILIENCE_GAP_TO_PROVE**.

No es lo mismo:
`forceContextLoss` en stop
que recovery ante pérdida espontánea.

Práctica futura:
inject WEBGL_lose_context en entorno real.

## 23 · 3D runtime · adaptive DPR

Observado:
- average dt;
- baja pixel ratio si lento;
- sube gradualmente si rápido;
- cap por dpr inicial;
- fit tras cambio.

Clasificación:
**STRENGTH_CONFIRMED**.

Riesgo a probar:
oscillation/hysteresis en hardware real.

No se declara problema por código.

## 24 · Matriz resumida

| Área | Clasificación | Acción de formación |
|---|---|---|
| Sabik stale responses | Strength | conservar |
| Sabik IME shortcut | QA candidate | test IME |
| Sabik pagehide mobile | QA/condition | test lifecycle + Pulso |
| Sabik observer | condition | destroy si mount dinámico |
| Motion revision | Strength | conservar |
| Motion load abort | condition | signal si workload cambia |
| R42 observers | condition | destroy si dynamic lifecycle |
| R42 pointerdown | QA candidate | Axioma + real interaction |
| R42 pointercancel | Strength | conservar |
| Undo shortcut | condition/QA | IME/editor scope |
| beforeunload | QA candidate | bfcache/mobile |
| File guards | Strength | conservar/modern schema |
| Game arrows document | QA candidate | focus/scroll |
| Worker error | Strength | conservar |
| Platform singletons | condition | shutdown if SPA |
| Broadcast unsubscribe | Strength | conservar |
| Audio lazy create | Strength | user-activation QA |
| 3D cleanup | Strength | conservar |
| hidden/dt clamp | Strength | conservar |
| context loss recovery | QA candidate | inject loss |
| adaptive DPR | Strength | hardware soak |

## 25 · Conteo

En esta revisión:
- **11 strengths observadas**;
- **7 QA candidates**;
- **6 architectural conditions**;

algunas filas pertenecen a más de una categoría.

No usar este conteo como score de calidad.
Es inventario de aprendizaje.

## 26 · Lección profesional

Una auditoría inmadura pregunta:
“¿Qué está mal?”

Motor debe preguntar:
- ¿qué contrato existe?;
- ¿bajo qué lifecycle?;
- ¿qué evidencia tenemos?;
- ¿qué condición futura lo convertiría en deuda?;
- ¿qué necesita test antes de cambiar?

Cambiar código sano por una sospecha no verificada también es un fallo de ingeniería.

## 27 · Próximas prácticas de alto valor

Sin ejecutarlas durante esta nota:

1. IME real sobre Sabik submit.
2. Firefox/WebKit bfcache con beforeunload.
3. Arrow keys R40 en play con foco externo.
4. R42 direct mount/unmount leak test.
5. WebGL context-loss injection.
6. hardware soak adaptive DPR.
7. mobile lifecycle real.

## 28 · Estado R48

Práctica:
**runtime review real sobre 7 archivos A5**.

Resultado:
- fortalezas separadas de sospechas;
- candidates sin convertir en bugs;
- lifecycle conditions documentadas;
- next tests definidos.

Marcador:
`MOTOR_RUNTIME_REVIEW_EVIDENCE_CLASSIFICATION_R48`

No:
- issue de producto;
- corrección;
- build;
- merge;
- deploy;
- main/production.
