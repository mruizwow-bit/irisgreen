# 10 · Revalidación semántica de S0 · candidato `4893d3cf`

**Implementación candidata:** `4893d3cf9772e58bdc1b5f505d33965cbfea007a` (tree `92f055753899bc2f19a28773563b732bafb6d6bb`), autor NealabsLBM, «Sabik S0: preserve boot gate and uncertain speech protection».
**Padre:** `3ce023bf132ae728fce8e402e30eba0fb796edc8`, bloqueado semánticamente en `09-revision-semantica-final-s0-3ce023bf.md`.
**Contrato normativo:** `1c3205fbb0fac8ccb5f2c946d73e4e038a479a0b` (tree `8baf547e`).
**PR:** #161 (head `4893d3cf`) · #162 (head `046b6052`) · #164 (head `485d15a4`) · Epic #145.
**Fecha:** 17/09/2026 · **Coordinación:** Astra.

El informe `09` sigue siendo la evidencia del bloqueo sobre `3ce023bf` y no se modifica. Leyenda en `00-resumen-y-bloqueantes.md`.

## Veredicto

# SEMANTICA_S0_APROBADA

| Puerta | Estado |
|---|---|
| SB-1A · SB-1B · SB-1C | **PASS** |
| SB-2 (con controles) | **PASS** |
| 13 bloqueos históricos (`e8bcedf`) | **13/13 resueltos** |
| Nueva contradicción semántica dentro de S0 | **no** |
| QA sobre `4893d3cf` | pendiente del Agente n.º 1 (esta revisión no la sustituye) |
| S1 · S2 | **cerrados**; la apertura de S1 es una decisión de Astra |

## 1. Comprobación remota previa (11:46 UTC)

| Elemento | Estado |
|---|---|
| PR #161 | abierto, borrador, head `4893d3cf9772e58bdc1b5f505d33965cbfea007a` |
| PR #162 | abierto, borrador, head `046b605218a6e93c685b2911730ca1f589d7ece2`; cuerpo con SB-1 y SB-2 como bloqueos vigentes |
| PR #164 | abierto, borrador, head `485d15a4…`; contrato `1c3205fb…` |
| `main` | `fb396a2d…`, sin cambios |
| Epic #145 | revisión semántica `SEMANTICA_S0_BLOQUEADA`; S1 y S2 CERRADO |

## 2. Delta revisado

`3ce023bf → 4893d3cf` es un único commit. Modifica `sabik/nea-core/sabik-machine.js`, `tools/test-sabik-machine-s0.js` y `sabik/S0_STATE_MACHINE.md`. El alcance acumulado de #161 sigue siendo de 4 archivos.

Cambios en la máquina:
- **`bootPending(state)`:** es cierto en `booting` y en `error` cuyo `origin_operation` es `booting`.
- **Rechazos durante el arranque pendiente:** `RISK_UNCERTAIN`, `RISK_CONFIRMED`, `HUMAN_HANDOFF`, `RISK_CLEARED` y `RESET_SESSION`.
- **`TECHNICAL_ERROR` desde `error`:** conserva el origen anterior si es válido.
- **`SPEECH_ERROR`:** conserva el origen de un error pendiente y calcula el movimiento con `safetyAttention` (`uncertain`, `risk`, `human_handoff`).

## 3. Método

Worktrees limpios de un clon completo Linux: `4893d3cf`, `1c3205fb` y `046b6052`.

La sonda es la de `09`, ampliada con los recorridos SB exactos y dos invariantes nuevos: movimiento en `booting` y abandono de un error de arranque sin volver a `booting`. Se incluye en el anexo; su SHA-256 es `1b0fd3abee7a93eda42c8fd37912321f792cf5f8e03eee117c799f05409678d7`. Cada paso se valida con `validateState` del contrato y se comprueba que la entrada y el evento no mutan.

**Reproducibilidad:** se hicieron dos ejecuciones completas con resultado idéntico byte a byte (SHA-256 `486770489f602dc7ba45d41fb42e5e3473dc31d76172fd1af8677f95248dabb4`). El código de salida de la segunda es 0; el de la primera no quedó registrado porque su proceso auxiliar se desvinculó.

**Exploración exhaustiva:** 269 640 estados, 6 020 712 transiciones aceptadas, 5 304 168 rechazos y 42 variantes de evento. Se registra si cada camino ha pasado por `BOOT_OK`. Cota: no se exploran estados con `boundary_count > 2` (9 408 estados, que sí se comprueban).

**Sonda de raíces** (`raiz-estado-invalido.mjs`, SHA-256 `6a22c48a…`, incluida en `09`): 2436 estados, 2436 válidos, **0** transiciones de estado válido a inválido.

**Informativo:** la suite propia de la implementación da `146/146 validations passed`. No es una revalidación QA.

## 4. SB-1 · Puerta de arranque

Regla: `rules.boot` («BOOT_OK only booting->ready; boot error RETRY->booting»).

| Recorrido | Descripción | Pasos observados | Resultado |
|---|---|---|---|
| SB-1A | booting → TECHNICAL_ERROR → RESET_SESSION (y SUBMIT, RETRY, BOOT_OK, SUBMIT) | `TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`RESET_SESSION` → **rechazo** en `error`, entrada intacta<br>`SUBMIT` → **rechazo** en `error`, entrada intacta<br>`RETRY` → `booting/none/normal/silent/off`<br>`SUBMIT` → **rechazo** en `booting`, entrada intacta<br>`BOOT_OK` → `ready/none/normal/silent/ambient`<br>`SUBMIT` → `retrieving/none/normal/silent/processing` | **PASS** |
| SB-1B | booting → TECHNICAL_ERROR → TECHNICAL_ERROR → RETRY (y SUBMIT, BOOT_OK, SUBMIT) | `TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`RETRY` → `booting/none/normal/silent/off`<br>`SUBMIT` → **rechazo** en `booting`, entrada intacta<br>`BOOT_OK` → `ready/none/normal/silent/ambient`<br>`SUBMIT` → `retrieving/none/normal/silent/processing` | **PASS** |
| SB-1B-VAR | error de arranque → SPEECH_ERROR → TECHNICAL_ERROR → RETRY | `TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`SPEECH_ERROR` → `error/none/normal/error/off` (origen `booting`, capa `speech`)<br>`TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`RETRY` → `booting/none/normal/silent/off`<br>`SUBMIT` → **rechazo** en `booting`, entrada intacta | **PASS** |
| SB-1C-RISK_UNCERTAIN | RISK_UNCERTAIN desde booting y desde error de arranque | `RISK_UNCERTAIN` → **rechazo** en `booting`, entrada intacta<br>`TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`RISK_UNCERTAIN` → **rechazo** en `error`, entrada intacta<br>`RETRY` → `booting/none/normal/silent/off`<br>`RISK_UNCERTAIN` → **rechazo** en `booting`, entrada intacta | **PASS** |
| SB-1C-RISK_CONFIRMED | RISK_CONFIRMED desde booting y desde error de arranque | `RISK_CONFIRMED` → **rechazo** en `booting`, entrada intacta<br>`TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`RISK_CONFIRMED` → **rechazo** en `error`, entrada intacta<br>`RETRY` → `booting/none/normal/silent/off`<br>`RISK_CONFIRMED` → **rechazo** en `booting`, entrada intacta | **PASS** |
| SB-1C-HUMAN_HANDOFF | HUMAN_HANDOFF desde booting y desde error de arranque | `HUMAN_HANDOFF` → **rechazo** en `booting`, entrada intacta<br>`TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`HUMAN_HANDOFF` → **rechazo** en `error`, entrada intacta<br>`RETRY` → `booting/none/normal/silent/off`<br>`HUMAN_HANDOFF` → **rechazo** en `booting`, entrada intacta | **PASS** |
| SB-1C-RISK_CLEARED | RISK_CLEARED desde booting y desde error de arranque | `RISK_CLEARED` → **rechazo** en `booting`, entrada intacta<br>`TECHNICAL_ERROR` → `error/none/normal/silent/off` (origen `booting`, capa `operation`)<br>`RISK_CLEARED` → **rechazo** en `error`, entrada intacta<br>`RETRY` → `booting/none/normal/silent/off`<br>`RISK_CLEARED` → **rechazo** en `booting`, entrada intacta | **PASS** |

**Confirmado:**
- **SB-1A:** no alcanza `ready`, `RESET_SESSION` se rechaza y `SUBMIT` también. Con `RETRY` se vuelve a `booting`.
- **SB-1B:** vuelve a `booting`, el segundo error conserva el origen `booting` y `SUBMIT` se rechaza hasta `BOOT_OK`.
- **SB-1C:** `RISK_UNCERTAIN`, `RISK_CONFIRMED`, `HUMAN_HANDOFF` y también `RISK_CLEARED` se rechazan en `booting`, en error de arranque y de nuevo tras `RETRY`, sin mutar el estado.
- **Exploración exhaustiva:** **0** transiciones llevan al flujo ordinario sin haber pasado por `BOOT_OK` (en `3ce023bf` eran más de 2,3 millones) y **0** abandonan un error de arranque sin volver a `booting`.

**`BOOT_OK` es la única puerta desde el arranque hacia `ready`.**

## 5. SB-2 · `SPEECH_ERROR` durante `uncertain`

Regla: `uncertain` conserva `protection_static` (`validateState`: «uncertain exige protection_static»).

| Recorrido | Descripción | Estado final | Válido para el contrato | Resultado |
|---|---|---|---|---|
| SB-2 | uncertain + SPEECH_ERROR | `uncertain` · `clarification` · `error` · energía 0 · `protection_static` · capa `speech` | sí | **PASS** |
| SB-2-VOZ-INTERRUMPIDA | voz activa → RISK_UNCERTAIN → SPEECH_ERROR tardío | `uncertain` · `clarification` · `error` · energía 0 · `protection_static` · capa `speech` | sí | **PASS** |
| SB-2-PAUSA | uncertain en pausa + SPEECH_ERROR | `uncertain` · `clarification` · `error` · energía 0 · `protection_static` · capa `speech` | sí | **PASS** |
| SB-2-ERROR | uncertain en error + SPEECH_ERROR | `uncertain` · `clarification` · `error` · energía 0 · `protection_static` · capa `speech` | sí | **PASS** |
| SB-2-CTRL-NORMAL | normal (hablando) + SPEECH_ERROR | `normal` · `information` · `error` · energía 0 · `off` · capa `speech` | sí | **PASS** |
| SB-2-CTRL-RISK | risk + SPEECH_ERROR | `risk` · `human_handoff` · `error` · energía 0 · `protection_static` · capa `speech` | sí | **PASS** |
| SB-2-CTRL-HANDOFF | human_handoff + SPEECH_ERROR | `human_handoff` · `human_handoff` · `error` · energía 0 · `protection_static` · capa `speech` | sí | **PASS** |

**Confirmado:**
- **SB-2:** `safety=uncertain`, `dialogue=clarification`, `speech=error`, `speech_meta.energy=0`, `motion=protection_static` y `error_meta.layer=speech`, en un estado válido.
- **Controles:** `normal` da `off`; `risk` y `human_handoff` dan `protection_static`.
- **Continuidad** (`SB-2-SUBMIT`): `SPEECH_ERROR → SUBMIT → RISK_CLEARED` mantiene `protection_static` hasta la resolución y termina en `retrieving` (**PASS**).
- **Sonda de raíces:** ninguna transición produce ya estados inválidos.

## 6. Regresión: los 13 recorridos históricos

| ID | Descripción | Secuencia | Resultado en `4893d3cf` | Estado |
|---|---|---|---|---|
| S0R-01 | Contestar la aclaración de seguridad | `BOOT_OK → RISK_UNCERTAIN → SUBMIT` | `awaiting_clarification/clarification/uncertain/silent/protection_static`, válido: sí | **RESUELTO** |
| S0R-02 | Contestar una aclaración ordinaria | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → ASK_CLARIFICATION → SUBMIT` | `retrieving/clarification/normal/silent/processing`, válido: sí | **RESUELTO** |
| S0R-03 | RISK_UNCERTAIN durante retrieving | `BOOT_OK → SUBMIT → RISK_UNCERTAIN` | `awaiting_clarification/clarification/uncertain/silent/protection_static`, válido: sí | **RESUELTO** |
| S0R-04 | RISK_CONFIRMED durante composing | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RISK_CONFIRMED` | `presenting/human_handoff/risk/silent/protection_static`, válido: sí | **RESUELTO** |
| S0R-05 | RISK_CONFIRMED durante presenting (segundo mensaje) | `BOOT_OK → SUBMIT → RETRIEVAL_OK → RESPONSE_READY → RISK_CONFIRMED` | `presenting/human_handoff/risk/silent/protection_static`, válido: sí | **RESUELTO** |
| S0R-06 | SUBMIT tras HUMAN_HANDOFF | `BOOT_OK → RISK_CONFIRMED → HUMAN_HANDOFF → SUBMIT` | rechazo en `SUBMIT`, entrada intacta: sí | **RESUELTO** |
| S0R-07 | TECHNICAL_ERROR y RETRY tras HUMAN_HANDOFF | `BOOT_OK → RISK_CONFIRMED → HUMAN_HANDOFF → TECHNICAL_ERROR → RETRY` | `presenting/human_handoff/human_handoff/silent/protection_static`, válido: sí | **RESUELTO** |
| S0R-08 | RISK_UNCERTAIN desde risk | `BOOT_OK → RISK_CONFIRMED → RISK_UNCERTAIN` | rechazo en `RISK_UNCERTAIN`, entrada intacta: sí | **RESUELTO** |
| S0R-09 | HUMAN_HANDOFF → pausa → reanudar → RISK_UNCERTAIN | `BOOT_OK → RISK_CONFIRMED → HUMAN_HANDOFF → PAUSE_ASSISTANT → RESUME_ASSISTANT → RISK_UNCERTAIN` | rechazo en `RISK_UNCERTAIN`, entrada intacta: sí | **RESUELTO** |
| S0R-10 | PAUSE y RESUME durante booting | `PAUSE_ASSISTANT → RESUME_ASSISTANT` | rechazo en `PAUSE_ASSISTANT`, entrada intacta: sí | **RESUELTO** |
| S0R-11 | RESET_SESSION durante booting | `RESET_SESSION` | rechazo en `RESET_SESSION`, entrada intacta: sí | **RESUELTO** |
| S0R-12 | TECHNICAL_ERROR y RETRY durante booting | `TECHNICAL_ERROR → RETRY` | `booting/none/normal/silent/off`, válido: sí | **RESUELTO** |
| S0R-13 | Movimiento con riesgo confirmado | `BOOT_OK → RISK_CONFIRMED` | `presenting/human_handoff/risk/silent/protection_static`, válido: sí | **RESUELTO** |

**13/13 siguen resueltos.**

Cambios respecto a `3ce023bf` en las comprobaciones dirigidas del informe `09`:

| ID | Comprobación | Resultado en `4893d3cf` |
|---|---|---|
| A5 | error de arranque y RESET_SESSION | rechazo (antes: `ready`) |
| A6 | doble error de arranque y RETRY | `booting` (antes: `ready`) |
| A7 | doble error de arranque, RETRY y SUBMIT | rechazo de `SUBMIT` (antes: `retrieving`) |
| A8 | RISK_UNCERTAIN en booting, RISK_CLEARED y RETRIEVAL_OK | rechazo de `RISK_UNCERTAIN` (antes: `composing`) |
| A9 | RISK_CONFIRMED en booting | rechazo de `RISK_CONFIRMED` (antes: `presenting`) |
| C6 | SPEECH_ERROR tardío tras interrupción por RISK_UNCERTAIN | `protection_static`, estado válido (antes: `off`, inválido) |

El resto de las 43 comprobaciones dirigidas (A–I) conserva el resultado de `09`.

## 7. No mutación, arranque y validez

| Invariante (exploración exhaustiva) | Resultado |
|---|---|
| Un rechazo no modifica el estado ni el evento | 0 violaciones en 5 304 168 rechazos |
| Una transición aceptada incrementa `revision` en 1 y no muta la entrada | 0 violaciones |
| Flujo ordinario antes de `BOOT_OK` | **0** |
| Error de arranque abandonado sin volver a `booting` | **0** |
| Estados inválidos para el contrato | **0** |
| Estados inválidos para la máquina | 0 |
| `energy = 0` cuando no habla; `voice_reactive` coherente | 0 violaciones |
| Visibilidad sin efecto en otras capas; adaptación estable | 0 violaciones |
| Error técnico frente a insuficiencia; campos no contractuales | 0 violaciones |
| Valores declarados inalcanzables | ninguno |

## 8. Hallazgos no bloqueantes

- **N-1 · `HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL`** (sigue de `09`). `RISK_CLEARED` con `reduced=true` da `processing` (15 192 transiciones, incluidas las derivadas). La salida exacta la prescribe la fila `EV-RISK-CLEARED-FROM-UNCERTAIN`, que no tiene variante reducida.
- **N-2 · `HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL`** (sigue de `09`). `speech_meta.end_reason` no tiene enumeración cerrada.
- **N-7 · `HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL`** (nuevo invariante, comportamiento ya presente en `3ce023bf`; `SET_REDUCED_MOTION` no cambia en el delta). `SET_REDUCED_MOTION {enabled:false}` durante `booting` pone `motion=ambient` (672 transiciones, incluidas las derivadas). El contrato lo acepta, no abre ningún flujo y el estado inicial usa `off`. Se sugiere que QA fije el movimiento durante el arranque.
- **N-8 · `HALLAZGO_NO_BLOQUEANTE_DE_PRECISION_CONTRACTUAL`** (ya presente en `3ce023bf`). Un estado canónico **inyectado desde fuera** con `operation=error` y `error_meta` sin `origin_operation`, o sin `error_meta`, es válido y `RETRY` lo lleva a `ready`. Ningún camino desde `createInitialSabikState()` lo produce: todos los errores registran su origen. El contrato permite metadatos ausentes sin definir su relleno seguro para el origen. S1 debe partir siempre de estados creados por la máquina.
- **N-3 a N-6:** sin cambios respecto a `09` (coerción de `SET_LOW_INTENSITY`, `RESET_SESSION` y visibilidad, pausa tras error, conservación de preferencias).

## 9. Separación S0 / S1

**S0:** sin contradicciones semánticas vigentes en `4893d3cf`.

**PENDIENTE_S1** (sin cambios respecto a `09` §6):
- integración del controlador en `sabik-page.js`;
- comunicación durante la derivación humana;
- continuidad y seguridad conversacional entre turnos;
- recursos humanos verificados;
- foco, regiones vivas y `lang`;
- mapeo real de `speechSynthesis`, incluidos los errores `interrupted`/`canceled`;
- retirada de estados cognitivos inferidos;
- presentación de pausa y reinicio, y validación de preferencias;
- índice funcional y datasets;
- partir siempre de estados creados por la máquina (N-8).

**Para QA:** N-1, N-2, N-7 y N-8 (precisión contractual); filas de regresión sugeridas para SB-1 y SB-2.

**Puertas siguientes:** revalidación QA del Agente n.º 1 sobre `4893d3cf` y decisión formal de Astra. Esta revisión **no abre S1**.

## Anexo · `sonda-revalidacion-4893.mjs`

<details><summary>Código (SHA-256 1b0fd3ab…)</summary>

```js
// Sonda de revalidación semántica S0 4893d3cf (fuera del repositorio; extiende la sonda de 3ce023bf). Uso: node sonda-semantica-final.mjs <maquina.js> <raiz-contrato>
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const [machinePath, qaRoot] = process.argv.slice(2).map((p) => resolve(p));
const M = createRequire(import.meta.url)(machinePath);
const { validateState } = await import(pathToFileURL(resolve(qaRoot, "tests/specs/sabik/validate-s0-contract-consistency.mjs")).href);
const contract = JSON.parse(await readFile(resolve(qaRoot, "tests/specs/sabik/s0-state-contract.json"), "utf8"));
const E = M.SABIK_MACHINE.EVENTS;
const J = (v) => JSON.stringify(v), clone = (v) => JSON.parse(J(v));
const contractOk = (s) => { try { validateState(clone(s), contract, "s"); return null; } catch (e) { return e.message; } };
const brief = (s) => ({ operation: s.operation, dialogue: s.dialogue, safety: s.safety, speech: s.speech, motion: s.motion, visibility: s.visibility, revision: s.revision, reduced: s.motion_meta ? s.motion_meta.reduced : "(sin motion_meta)", intensity: s.adaptation.intensity, energy: s.speech_meta?.energy, error_meta: s.error_meta });
function run(steps, start) {
  let s = start ? clone(start) : M.createInitialSabikState(); const trail = [];
  for (const raw of steps) {
    const ev = typeof raw === "string" ? { type: raw } : raw, before = J(s), evBefore = J(ev);
    try { const n = M.transitionSabikState(s, ev); if (J(s) !== before || J(ev) !== evBefore) return { error: "MUTACION_EN_ACEPTACION" }; s = n; trail.push(ev.type); }
    catch (e) { return { rechazado_en: ev.type, razon: e.message, estado: brief(s), intacto: J(s) === before && J(ev) === evBefore, trail }; }
  }
  const ce = contractOk(s);
  return { final: brief(s), contrato_valido: ce === null, contrato_error: ce, trail };
}
const out = { sb: [], historicos: [], comprobaciones: [], exploracion: {} };

// ===== Revalidación SB-1 / SB-2 =====
function steps(list, start) { let s = start ? clone(start) : M.createInitialSabikState(); const log = [];
  for (const raw of list) { const ev = typeof raw === "string" ? { type: raw } : raw; const before = J(s), evb = J(ev);
    try { const n = M.transitionSabikState(s, ev); log.push({ ev: ev.type, ok: true, a: brief(n), contrato: contractOk(n), entrada_intacta: J(s) === before && J(ev) === evb }); s = n; }
    catch (e) { log.push({ ev: ev.type, ok: false, razon: e.message, estado: brief(s), entrada_intacta: J(s) === before && J(ev) === evb }); } }
  return { log, final: s }; }
const TE = (code) => ({ type: E.TECHNICAL_ERROR, code });
const sbCase = (id, desc, list, check, start) => { const r = steps(list, start); const res = check(r.log, r.final); out.sb.push({ id, desc, secuencia: list.map((x) => x.type || x), pasos: r.log, comprobaciones: res, resultado: Object.values(res).every(Boolean) ? "PASS" : "FAIL" }); };
const noInvalid = (log) => log.every((x) => !x.ok || x.contrato === null);
const intact = (log) => log.every((x) => x.entrada_intacta);
sbCase("SB-1A", "booting → TECHNICAL_ERROR → RESET_SESSION (y SUBMIT, RETRY, BOOT_OK, SUBMIT)", [TE("boot-failure"), E.RESET_SESSION, E.SUBMIT, E.RETRY, E.SUBMIT, E.BOOT_OK, E.SUBMIT], (l) => ({
  reset_rechazado: l[1].ok === false, no_alcanza_ready: l.slice(0, 2).every((x) => !x.ok || x.a.operation !== "ready"),
  submit_rechazado_en_error_de_arranque: l[2].ok === false, retry_vuelve_a_booting: l[3].ok && l[3].a.operation === "booting",
  submit_rechazado_en_booting: l[4].ok === false, boot_ok_a_ready: l[5].ok && l[5].a.operation === "ready", submit_tras_boot_ok: l[6].ok && l[6].a.operation === "retrieving",
  sin_estados_invalidos: noInvalid(l), rechazos_sin_mutacion: intact(l) }));
sbCase("SB-1B", "booting → TECHNICAL_ERROR → TECHNICAL_ERROR → RETRY (y SUBMIT, BOOT_OK, SUBMIT)", [TE("boot-failure"), TE("dataset-load"), E.RETRY, E.SUBMIT, E.BOOT_OK, E.SUBMIT], (l) => ({
  segundo_error_conserva_origen_booting: l[1].ok && l[1].a.error_meta && l[1].a.error_meta.origin_operation === "booting",
  retry_vuelve_a_booting: l[2].ok && l[2].a.operation === "booting", submit_rechazado_hasta_boot_ok: l[3].ok === false,
  boot_ok_a_ready: l[4].ok && l[4].a.operation === "ready", submit_tras_boot_ok: l[5].ok && l[5].a.operation === "retrieving",
  sin_estados_invalidos: noInvalid(l), rechazos_sin_mutacion: intact(l) }));
sbCase("SB-1B-VAR", "error de arranque → SPEECH_ERROR → TECHNICAL_ERROR → RETRY", [TE("boot-failure"), { type: E.SPEECH_ERROR, code: "late" }, TE("again"), E.RETRY, E.SUBMIT], (l) => ({
  speech_error_conserva_origen: l[1].ok && l[1].a.error_meta.origin_operation === "booting", retry_vuelve_a_booting: l[3].ok && l[3].a.operation === "booting",
  submit_rechazado: l[4].ok === false, sin_estados_invalidos: noInvalid(l), rechazos_sin_mutacion: intact(l) }));
for (const ev of [E.RISK_UNCERTAIN, E.RISK_CONFIRMED, E.HUMAN_HANDOFF, E.RISK_CLEARED]) {
  sbCase(`SB-1C-${ev}`, `${ev} desde booting y desde error de arranque`, [ev, TE("boot-failure"), ev, E.RETRY, ev], (l) => ({
    rechazado_en_booting: l[0].ok === false && l[0].estado.operation === "booting",
    rechazado_en_error_de_arranque: l[2].ok === false && l[2].estado.operation === "error",
    rechazado_tras_retry_en_booting: l[4].ok === false && l[4].estado.operation === "booting",
    rechazos_sin_mutacion: intact(l), sin_estados_invalidos: noInvalid(l) }));
}
const sb2 = (id, desc, list, expect) => sbCase(id, desc, list, (l) => { const x = l[l.length - 1]; const a = x.a || {};
  return { aceptado: x.ok === true, ...Object.fromEntries(Object.entries(expect).map(([k, v]) => [`${k}=${v}`, (k === "error_meta.layer" ? a.error_meta && a.error_meta.layer : a[k]) === v])), estado_valido_para_el_contrato: x.contrato === null, entrada_intacta: x.entrada_intacta }; });
const ANS2 = [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_OK, E.RESPONSE_READY];
sb2("SB-2", "uncertain + SPEECH_ERROR", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.SPEECH_ERROR, code: "interrupted" }], { safety: "uncertain", dialogue: "clarification", speech: "error", energy: 0, motion: "protection_static", "error_meta.layer": "speech" });
sb2("SB-2-VOZ-INTERRUMPIDA", "voz activa → RISK_UNCERTAIN → SPEECH_ERROR tardío", [...ANS2, E.SPEECH_REQUEST, E.SPEECH_START, E.RISK_UNCERTAIN, { type: E.SPEECH_ERROR, code: "interrupted" }], { safety: "uncertain", dialogue: "clarification", speech: "error", energy: 0, motion: "protection_static", "error_meta.layer": "speech" });
sb2("SB-2-PAUSA", "uncertain en pausa + SPEECH_ERROR", [E.BOOT_OK, E.RISK_UNCERTAIN, E.PAUSE_ASSISTANT, { type: E.SPEECH_ERROR, code: "x" }], { safety: "uncertain", speech: "error", motion: "protection_static" });
sb2("SB-2-ERROR", "uncertain en error + SPEECH_ERROR", [E.BOOT_OK, E.RISK_UNCERTAIN, TE("x"), { type: E.SPEECH_ERROR, code: "x" }], { safety: "uncertain", speech: "error", motion: "protection_static" });
sb2("SB-2-CTRL-NORMAL", "normal (hablando) + SPEECH_ERROR", [...ANS2, E.SPEECH_REQUEST, E.SPEECH_START, { type: E.SPEECH_ERROR, code: "x" }], { safety: "normal", speech: "error", motion: "off", "error_meta.layer": "speech" });
sb2("SB-2-CTRL-RISK", "risk + SPEECH_ERROR", [E.BOOT_OK, E.RISK_CONFIRMED, { type: E.SPEECH_ERROR, code: "x" }], { safety: "risk", speech: "error", motion: "protection_static", "error_meta.layer": "speech" });
sb2("SB-2-CTRL-HANDOFF", "human_handoff + SPEECH_ERROR", [E.BOOT_OK, E.RISK_CONFIRMED, E.HUMAN_HANDOFF, { type: E.SPEECH_ERROR, code: "x" }], { safety: "human_handoff", speech: "error", motion: "protection_static", "error_meta.layer": "speech" });
sbCase("SB-2-SUBMIT", "uncertain + SPEECH_ERROR → SUBMIT → RISK_CLEARED", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.SPEECH_ERROR, code: "x" }, E.SUBMIT, E.RISK_CLEARED], (l) => ({
  todos_aceptados: l.every((x) => x.ok), protection_static_hasta_resolver: l.slice(1, 4).every((x) => x.a.motion === "protection_static"), resolucion_retrieving: l[4].a.operation === "retrieving", sin_estados_invalidos: noInvalid(l) }));

const B = [E.BOOT_OK], ANS = [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_OK, E.RESPONSE_READY], RISK = [E.BOOT_OK, E.RISK_CONFIRMED], HO = [...RISK, E.HUMAN_HANDOFF];
const H = [
 ["S0R-01", "Contestar la aclaración de seguridad", [E.BOOT_OK, E.RISK_UNCERTAIN, E.SUBMIT], "aceptado; awaiting_clarification/clarification/uncertain (B07)", (r) => r.final && r.final.operation === "awaiting_clarification" && r.final.safety === "uncertain" && r.contrato_valido],
 ["S0R-02", "Contestar una aclaración ordinaria", [...ANS, E.ASK_CLARIFICATION, E.SUBMIT], "aceptado; retrieving/clarification/normal (B06)", (r) => r.final && r.final.operation === "retrieving" && r.final.dialogue === "clarification" && r.contrato_valido],
 ["S0R-03", "RISK_UNCERTAIN durante retrieving", [E.BOOT_OK, E.SUBMIT, E.RISK_UNCERTAIN], "aceptado; uncertain con protection_static", (r) => r.final && r.final.safety === "uncertain" && r.final.motion === "protection_static" && r.contrato_valido],
 ["S0R-04", "RISK_CONFIRMED durante composing", [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_OK, E.RISK_CONFIRMED], "aceptado; presenting/human_handoff/risk", (r) => r.final && r.final.safety === "risk" && r.final.dialogue === "human_handoff" && r.contrato_valido],
 ["S0R-05", "RISK_CONFIRMED durante presenting (segundo mensaje)", [...ANS, E.RISK_CONFIRMED], "aceptado; presenting/human_handoff/risk (EV-RISK-CONFIRMED)", (r) => r.final && r.final.safety === "risk" && r.contrato_valido],
 ["S0R-06", "SUBMIT tras HUMAN_HANDOFF", [...HO, E.SUBMIT], "sin estado inválido: rechazo explícito y limpio (la protección no admite flujo ordinario)", (r) => r.rechazado_en === "SUBMIT" && r.intacto && /transition/.test(r.razon)],
 ["S0R-07", "TECHNICAL_ERROR y RETRY tras HUMAN_HANDOFF", [...HO, { type: E.TECHNICAL_ERROR, code: "resource-load" }, E.RETRY], "presenting/human_handoff/human_handoff/protection_static (EV-RETRY-HANDOFF)", (r) => r.final && r.final.safety === "human_handoff" && r.final.operation === "presenting" && r.contrato_valido],
 ["S0R-08", "RISK_UNCERTAIN desde risk", [...RISK, E.RISK_UNCERTAIN], "rechazo sin cambios (no se rebaja)", (r) => r.rechazado_en === "RISK_UNCERTAIN" && r.intacto && r.estado.safety === "risk"],
 ["S0R-09", "HUMAN_HANDOFF → pausa → reanudar → RISK_UNCERTAIN", [...HO, E.PAUSE_ASSISTANT, E.RESUME_ASSISTANT, E.RISK_UNCERTAIN], "rechazo sin cambios", (r) => r.rechazado_en === "RISK_UNCERTAIN" && r.intacto && r.estado.safety === "human_handoff"],
 ["S0R-10", "PAUSE y RESUME durante booting", [E.PAUSE_ASSISTANT, E.RESUME_ASSISTANT], "PAUSE rechazado en booting (EV-BOOT-PAUSE_ASSISTANT-FORBIDDEN)", (r) => r.rechazado_en === "PAUSE_ASSISTANT" && r.intacto && r.estado.operation === "booting"],
 ["S0R-11", "RESET_SESSION durante booting", [E.RESET_SESSION], "rechazo (EV-BOOT-RESET_SESSION-FORBIDDEN)", (r) => r.rechazado_en === "RESET_SESSION" && r.intacto && r.estado.operation === "booting"],
 ["S0R-12", "TECHNICAL_ERROR y RETRY durante booting", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, E.RETRY], "booting (EV-BOOT-RETRY)", (r) => r.final && r.final.operation === "booting" && r.contrato_valido],
 ["S0R-13", "Movimiento con riesgo confirmado", RISK, "protection_static", (r) => r.final && r.final.motion === "protection_static" && r.contrato_valido],
];
for (const [id, desc, steps, esperado, ok] of H) { const r = run(steps); out.historicos.push({ id, desc, secuencia: steps.map((x) => x.type || x), esperado, resultado: r, veredicto: ok(r) ? "RESUELTO" : "SIGUE_VIGENTE" }); }
const reduced = M.createInitialSabikState({ reduced_motion: true });
const noMeta = (() => { const s = run(ANS).final; const st = M.transitionSabikState(M.transitionSabikState(M.transitionSabikState(M.transitionSabikState(M.createInitialSabikState(), { type: E.BOOT_OK }), { type: E.SUBMIT }), { type: E.RETRIEVAL_OK }), { type: E.RESPONSE_READY }); const c = clone(st); delete c.motion_meta; c.motion = "off"; return c; })();
const C = [
 ["A1", "arranque", "SUBMIT en booting", [E.SUBMIT], null],
 ["A2", "arranque", "SPEECH_REQUEST en booting", [E.SPEECH_REQUEST], null],
 ["A3", "arranque", "BOOT_OK", B, null],
 ["A4", "arranque", "BOOT_OK repetido", [...B, E.BOOT_OK], null],
 ["A5", "arranque", "error de arranque y RESET_SESSION", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, E.RESET_SESSION], null],
 ["A6", "arranque", "doble error de arranque y RETRY", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, { type: E.TECHNICAL_ERROR, code: "dataset-load" }, E.RETRY], null],
 ["A7", "arranque", "doble error de arranque, RETRY y SUBMIT", [{ type: E.TECHNICAL_ERROR, code: "boot-failure" }, { type: E.TECHNICAL_ERROR, code: "dataset-load" }, E.RETRY, E.SUBMIT], null],
 ["A8", "arranque", "RISK_UNCERTAIN en booting, RISK_CLEARED y RETRIEVAL_OK", [E.RISK_UNCERTAIN, E.RISK_CLEARED, E.RETRIEVAL_OK], null],
 ["A9", "arranque", "RISK_CONFIRMED en booting", [E.RISK_CONFIRMED], null],
 ["B1", "aclaracion", "RISK_CLEARED con uncertain en pausa", [E.BOOT_OK, E.RISK_UNCERTAIN, E.PAUSE_ASSISTANT, E.RISK_CLEARED], null],
 ["B2", "aclaracion", "RISK_CLEARED tras error técnico en uncertain", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.TECHNICAL_ERROR, code: "x" }, E.RISK_CLEARED], null],
 ["B3", "aclaracion", "ASK_CLARIFICATION durante uncertain", [E.BOOT_OK, E.RISK_UNCERTAIN, E.ASK_CLARIFICATION], null],
 ["C1", "seguridad", "pausa en risk", [...RISK, E.PAUSE_ASSISTANT], null],
 ["C2", "seguridad", "reset en human_handoff", [...HO, E.RESET_SESSION], null],
 ["C3", "seguridad", "error y retry en uncertain", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.TECHNICAL_ERROR, code: "x" }, E.RETRY], null],
 ["C4", "seguridad", "voz activa interrumpida por RISK_UNCERTAIN", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.RISK_UNCERTAIN], null],
 ["C5", "seguridad", "SPEECH_REQUEST en risk", [...RISK, E.SPEECH_REQUEST], null],
 ["C6", "seguridad", "SPEECH_ERROR tardío tras interrupción por RISK_UNCERTAIN", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.RISK_UNCERTAIN, { type: E.SPEECH_ERROR, code: "interrupted" }], null],
 ["C7", "seguridad", "SPEECH_ERROR tardío tras interrupción por RISK_CONFIRMED", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.RISK_CONFIRMED, { type: E.SPEECH_ERROR, code: "interrupted" }], null],
 ["C8", "seguridad", "SPEECH_ERROR en uncertain y SUBMIT", [E.BOOT_OK, E.RISK_UNCERTAIN, { type: E.SPEECH_ERROR, code: "interrupted" }, E.SUBMIT], null],
 ["D1", "voz", "REQUEST → starting sin ondas", [...ANS, E.SPEECH_REQUEST], null],
 ["D2", "voz", "START sin REQUEST", [...ANS, E.SPEECH_START], null],
 ["D3", "voz", "BOUNDARY en starting", [...ANS, E.SPEECH_REQUEST, E.SPEECH_BOUNDARY], null],
 ["D4", "voz", "voz completa con pausa y reanudación", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.SPEECH_BOUNDARY, E.SPEECH_PAUSE, E.SPEECH_RESUME, E.SPEECH_END], null],
 ["D5", "voz", "STOP desde paused", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.SPEECH_PAUSE, E.SPEECH_STOP], null],
 ["D6", "voz", "error de voz mientras habla", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, { type: E.SPEECH_ERROR, code: "x" }], null],
 ["D7", "voz", "BOUNDARY con energía fuera de rango", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, { type: E.SPEECH_BOUNDARY, energy: 2 }], null],
 ["E1", "movimiento", "reducido: voz completa", [...ANS, E.SPEECH_REQUEST, E.SPEECH_START, E.SPEECH_BOUNDARY], reduced],
 ["E2", "movimiento", "reducido: RISK_UNCERTAIN y RISK_CLEARED", [E.BOOT_OK, E.RISK_UNCERTAIN, E.RISK_CLEARED], reduced],
 ["E3", "movimiento", "reducido: RISK_CLEARED y RETRIEVAL_OK", [E.BOOT_OK, E.RISK_UNCERTAIN, E.RISK_CLEARED, E.RETRIEVAL_OK], reduced],
 ["E4", "movimiento", "sin motion_meta y off: voz", [E.SPEECH_REQUEST, E.SPEECH_START], noMeta],
 ["E5", "movimiento", "sin motion_meta y off: SUBMIT y RETRIEVAL_OK", [E.SUBMIT, E.RETRIEVAL_OK, E.RESPONSE_READY], noMeta],
 ["E6", "movimiento", "sin motion_meta y off: RISK_UNCERTAIN, RISK_CLEARED, RETRIEVAL_OK", [E.RISK_UNCERTAIN, E.RISK_CLEARED, E.RETRIEVAL_OK], noMeta],
 ["E7", "movimiento", "reducido en risk", [E.BOOT_OK, E.RISK_CONFIRMED], reduced],
 ["F1", "visibilidad", "HIDE y SHOW en pausa con riesgo", [...RISK, E.PAUSE_ASSISTANT, E.HIDE, E.SHOW], null],
 ["F2", "visibilidad", "RESET_SESSION con panel plegado", [E.BOOT_OK, E.COLLAPSE, E.RESET_SESSION], null],
 ["G1", "adaptacion", "baja intensidad a través de riesgo, pausa, error, retry y reset", [E.BOOT_OK, { type: E.SET_LOW_INTENSITY, enabled: true }, E.RISK_CONFIRMED, E.PAUSE_ASSISTANT, { type: E.TECHNICAL_ERROR, code: "x" }, E.RETRY, E.RESET_SESSION], null],
 ["G2", "adaptacion", "SET_LOW_INTENSITY con cadena 'false'", [E.BOOT_OK, { type: E.SET_LOW_INTENSITY, enabled: "false" }], null],
 ["H1", "error", "RETRIEVAL_EMPTY frente a TECHNICAL_ERROR", [E.BOOT_OK, E.SUBMIT, E.RETRIEVAL_EMPTY], null],
 ["H2", "error", "TECHNICAL_ERROR durante retrieving", [E.BOOT_OK, E.SUBMIT, { type: E.TECHNICAL_ERROR, code: "x" }], null],
 ["H3", "error", "error técnico durante pausa y retry", [...ANS, E.PAUSE_ASSISTANT, { type: E.TECHNICAL_ERROR, code: "x" }, E.RETRY], null],
 ["I1", "reset", "reset normal tras respuesta", [...ANS, E.RESET_SESSION], null],
 ["I2", "reset", "reset en risk", [...RISK, E.RESET_SESSION], null],
];
for (const [id, grupo, desc, steps, start] of C) out.comprobaciones.push({ id, grupo, desc, secuencia: steps.map((x) => x.type || x), inicio: start ? (start === reduced ? "inicial reducido" : "presenting sin motion_meta, motion=off") : "inicial", resultado: run(steps, start) });
// Exploración exhaustiva
const EV = [];
for (const t of Object.values(E)) {
  if (t === E.RESPONSE_READY) for (const d of ["information", "practical", "accompaniment", "correction", "clarification", "insufficient"]) EV.push({ type: t, dialogue: d });
  else if (t === E.SET_REDUCED_MOTION || t === E.SET_LOW_INTENSITY) EV.push({ type: t, enabled: true }, { type: t, enabled: false });
  else if (t === E.SET_LANGUAGE) EV.push({ type: t, language: "en" }, { type: t, language: "es" });
  else if (t === E.SET_QUESTION_POLICY) EV.push({ type: t, value: "none" });
  else if (t === E.TECHNICAL_ERROR) EV.push({ type: t, code: "x" });
  else if (t === E.SPEECH_ERROR) EV.push({ type: t, code: "x" });
  else EV.push({ type: t });
}
const key = (s, booted) => J([s.operation, s.dialogue, s.safety, s.visibility, s.speech, s.motion, s.language, s.adaptation, s.motion_meta ?? null, s.speech_meta, s.error_meta ?? null, booted]);
const starts = [[M.createInitialSabikState(), false], [reduced, false], [noMeta, true]];
const seen = new Map(); const q = [];
for (const [s, b] of starts) { const k = key(s, b); if (!seen.has(k)) { seen.set(k, { s, b, via: "inicio" }); q.push(k); } }
const viol = {}; const add = (k, ex) => { (viol[k] ||= { n: 0, ejemplos: [] }).n++; if (viol[k].ejemplos.length < 3) viol[k].ejemplos.push(ex); };
let transiciones = 0, rechazos = 0, acotados = 0;
const ORD = new Set(["ready", "retrieving", "composing", "presenting", "awaiting_clarification", "paused"]);
while (q.length) {
  const k = q.shift(); const { s, b } = seen.get(k);
  for (const ev of EV) {
    const sb = J(s), eb = J(ev); let n;
    try { n = M.transitionSabikState(s, ev); } catch (e) { rechazos++; if (J(s) !== sb || J(ev) !== eb) add("rechazo_muta_entrada", { de: brief(s), ev }); continue; }
    transiciones++;
    if (J(s) !== sb || J(ev) !== eb) add("aceptacion_muta_entrada", { de: brief(s), ev });
    if (n.revision !== s.revision + 1) add("revision_no_+1", { de: brief(s), ev });
    const ce = contractOk(n); if (ce) add(`estado_invalido_para_el_contrato: ${ce.replace(/^s: /, "")}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (!M.validateSabikState(n).ok) add("estado_invalido_para_la_maquina", { de: brief(s), ev: ev.type });
    const nb = b || ev.type === E.BOOT_OK;
    if (!nb && ORD.has(n.operation)) add(`flujo_sin_BOOT_OK: ${ev.type} → ${n.operation}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (n.operation === "booting" && n.motion !== "off") add(`booting_con_movimiento: ${ev.type} → ${n.motion}`, { de: brief(s), ev, a: brief(n) });
    if (s.operation === "error" && s.error_meta && s.error_meta.origin_operation === "booting" && n.operation !== "error" && n.operation !== "booting") add(`error_de_arranque_abandonado_sin_booting: ${ev.type} → ${n.operation}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (n.speech !== "speaking" && n.speech_meta.energy !== 0) add("energia_sin_hablar", { a: brief(n) });
    if (n.motion === "voice_reactive" && (n.speech !== "speaking" || n.safety !== "normal")) add("voice_reactive_incoherente", { a: brief(n) });
    if (n.safety === "normal" && n.motion_meta && n.motion_meta.reduced === true && n.motion !== "off") add(`reducido_con_movimiento: ${ev.type} → ${n.motion}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (n.safety === "normal" && !("motion_meta" in n) && s.motion === "off" && n.motion !== "off") add(`sin_meta_off_reactivado: ${ev.type} → ${n.motion}`, { de: brief(s), ev: ev.type, a: brief(n) });
    if (["COLLAPSE", "EXPAND", "HIDE", "SHOW"].includes(ev.type)) { const a = clone(s), c = clone(n); delete a.visibility; delete c.visibility; delete a.revision; delete c.revision; if (J(a) !== J(c)) add("visibilidad_cambia_otras_capas", { ev: ev.type, de: brief(s), a: brief(n) }); }
    if (J(n.adaptation) !== J(s.adaptation) && !ev.type.startsWith("SET_")) add(`adaptacion_alterada_por_${ev.type}`, { de: brief(s), a: brief(n) });
    if (n.operation === "error" && n.dialogue === "insufficient") add("error_confundido_con_insuficiencia", { a: brief(n) });
    if (Object.keys(n).some((x) => !["operation", "dialogue", "adaptation", "safety", "visibility", "speech", "motion", "language", "revision", "speech_meta", "motion_meta", "error_meta"].includes(x))) add("campo_publico_no_contractual", { a: Object.keys(n) });
    if (n.speech_meta.boundary_count > 2) { acotados++; continue; } // cota: boundary_count crece sin límite
    const nk = key(n, nb);
    if (!seen.has(nk)) { seen.set(nk, { s: n, b: nb }); q.push(nk); }
  }
}
const dist = (f) => [...new Set([...seen.values()].map((v) => f(v.s)))].sort();
out.exploracion = { cota: "no se exploran estados con speech_meta.boundary_count > 2 (se comprueban igualmente)", estados_no_explorados_por_cota: acotados, estados: seen.size, transiciones_aceptadas: transiciones, rechazos, eventos_probados: EV.length,
  valores: { operation: dist((s) => s.operation), dialogue: dist((s) => s.dialogue), safety: dist((s) => s.safety), speech: dist((s) => s.speech), motion: dist((s) => s.motion), visibility: dist((s) => s.visibility) },
  inalcanzables: Object.fromEntries(Object.entries({ operation: "OPERATION", dialogue: "DIALOGUE", safety: "SAFETY", speech: "SPEECH", motion: "MOTION", visibility: "VISIBILITY" }).map(([k, c]) => [k, Object.values(M.SABIK_MACHINE[c]).filter((v) => !dist((s) => s[k]).includes(v))])),
  violaciones: viol };
console.log(J(out));

```

</details>

Reproducción: `node sonda-revalidacion-4893.mjs <impl>/sabik/nea-core/sabik-machine.js <contrato>` (Node 22, unos 4 minutos). La sonda de raíces está en el anexo B del informe `09`.
