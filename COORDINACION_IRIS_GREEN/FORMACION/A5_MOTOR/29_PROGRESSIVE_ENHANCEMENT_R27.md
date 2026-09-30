# MOTOR · A5 · ESTUDIO PROFUNDO R27 · PROGRESSIVE ENHANCEMENT Y RESILIENT HTML

Fecha: 30/09/2026
Amplía: R01–R26
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Principio

Fuente:
- MDN · Progressive enhancement
  https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement

Progressive enhancement:
- baseline esencial para máximo alcance;
- mejoras para capacidades superiores.

No significa:
“todo debe funcionar igual sin JS”.

Significa:
la tarea/contenido esencial tiene una estrategia apropiada.

## 2 · HTML first

Antes de crear runtime custom:
preguntar si HTML ya ofrece:
- button;
- details/summary;
- dialog;
- input/select;
- form;
- audio/video;
- download link.

Nativo aporta:
- semantics;
- focus;
- keyboard;
- browser integration.

## 3 · Native dialog

Fuente:
- MDN · dialog
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog

Baseline ampliamente disponible desde 2022.

`showModal()` aporta:
- modal semantics;
- focus behavior;
- Esc;
- inert-ish modal background behavior.

Motor no recrea modal con divs si native dialog sirve.

## 4 · details/summary

Fuentes:
- MDN · details
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
- MDN · summary
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary

Widely available.

Disclosure sin JS:
- visible state;
- keyboard;
- semantic toggle.

JS puede añadir:
- search;
- analytics approved;
- focus integration.

No reemplazar native toggle innecesariamente.

## 5 · Iris Green evidence

R22 test:
`scripts/test_web_r22_interactions.py`.

Incluye contexto:
`java_script_enabled=False`.

Prueba:
Sitio tranquilo conserva contenido/uso básico.

Patrón positivo:
no-JS está dentro de QA, no solo como intención.

## 6 · R42 dialog

R42 crea `<dialog>` y usa `showModal()` si disponible.

Además:
- trigger guardado;
- close;
- focus restore.

Dirección correcta.

## 7 · Feature detection

Progressive enhancement usa:
```js
if ("showOpenFilePicker" in window) { ... }
```

No:
user agent sniff.

A5 ya sigue feature detection en:
- Worker;
- OffscreenCanvas;
- WebGL2;
- WebGPU;
- File System Access;
- AudioWorklet.

## 8 · Enhancement contract

Cada mejora debe declarar:

```text
BASELINE
ENHANCEMENT
FAILURE
FALLBACK
STATE PRESERVED?
```

Ejemplo:
```text
<input type=file>
+ showOpenFilePicker
picker reject
→ input baseline still available
```

## 9 · Avoid JS-only content hiding

Anti-patrón:
HTML essential content starts:
`display:none`
and JS unhides.

If JS fails:
content disappears.

Prefer:
content visible/basic by default;
JS adds enhancement class after successful mount.

## 10 · Mount only after ready

No set:
`data-enhanced=true`
before engine loaded.

State:
- base;
- loading;
- enhanced;
- degraded.

Conecta R12 loader.

## 11 · Native semantics under Canvas

Canvas enhancement:
baseline may be:
- semantic grid;
- controls;
- textual model.

Canvas adds direct manipulation.

A5 R42:
Canvas + accessible grid is good progressive layering.

The semantic layer should remain usable, not become a hidden dead replica.

## 12 · CSS as enhancement

CSS unsupported feature:
browser ignores declaration.

Use:
`@supports`
when fallback differs.

No JS detection for pure CSS capability unless behavior requires it.

## 13 · No-JS is not universal requirement

For:
- image editor;
- simulation;
- interactive game

full function may require JS.

Baseline can be:
- explanation;
- saved/static result;
- alternative controls/content.

Do not pretend a game runs no-JS.

## 14 · Failure after partial enhancement

Hard case:
JS begins moving DOM, then throws.

Need transactional mount:
1. build new UI detached;
2. validate required dependencies;
3. attach;
4. mark enhanced.

If error:
leave baseline intact.

## 15 · DOM preservation

Do not destroy baseline elements until enhancement is ready.

R42 often moves/reuses existing controls into new shell rather than regenerating everything.

This can preserve behavior, but requires:
- IDs;
- labels;
- listeners;
- focus
to remain valid.

## 16 · Enhancement idempotency

Calling mount twice should:
- no duplicate controls;
- no duplicate listeners;
- no duplicate observers.

A5 often uses data flags:
`data-ig42-...`.

Pattern useful.

Still needs destroy if remount becomes supported.

## 17 · Accessibility

Progressive enhancement and accessibility align but are not identical.

A fancy enhancement can be accessible.
A baseline can still have accessibility bugs.

Axioma validates standards.

Motor preserves semantic baseline through enhancement.

## 18 · Network resilience

If optional JS chunk fails:
- base remains.

If critical content is only in chunk:
not progressive.

For interactive engines:
fallback can be simpler tool, not necessarily no-JS.

## 19 · Offline is separate

No-JS ≠ offline.
Service worker ≠ progressive enhancement automatically.

R06 already established:
offline requires product contract.

## 20 · W3C design principle

W3C Web Platform Design Principles (Group Note, 14 Sep 2026):
- user needs first;
- safe to visit;
- minimize user data;
- don't propagate known platform defects.

Motor translates this into:
**use platform primitives unless custom behavior delivers a clear user need.**

## 21 · Progressive enhancement hierarchy Iris Green

```text
CONTENT / HTML
→ NATIVE INTERACTION
→ CSS
→ JS ENHANCEMENT
→ CANVAS/AUDIO
→ WORKER
→ WEBGL/GPU
```

Each layer must justify dependency on the previous one.

## 22 · Test matrix

### JS disabled
content/navigation baseline.

### Enhancement script 404
baseline remains.

### Advanced engine 404
basic engine remains.

### API absent
fallback.

### CSS feature absent
usable layout.

### Partial mount error
no broken hybrid state.

## 23 · Current positive examples

- R22 no-JS quiet-space test.
- native details/summary.
- native dialog.
- File System Access optional.
- WebGPU optional.
- Worker fallback.
- Canvas + semantic grid.
- audio Worklet + Web Audio fallback.

## 24 · State R27

Studied:
- progressive enhancement;
- native interactive HTML;
- transactional enhancement;
- idempotent mount;
- no-JS boundaries;
- W3C design principles.

Audit:
- Iris no-JS evidence and native primitives: reviewed.

Marker:
`MOTOR_PROGRESSIVE_ENHANCEMENT_RESILIENT_HTML_STUDIED_R27`

No:
- no-JS redesign;
- dialog refactor;
- product change;
- build;
- merge;
- deploy;
- main/production.
