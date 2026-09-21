# W1-QA-A03-FREEZE · Baseline independiente

**Autorización:** DEC-020  
**Baseline exacta:** `0a1d4339bae2628dc963501a30f326553605821b`  
**Freeze contractual:** `96a0fc516266166c09d3c2f9dd2f03e684a9b027`  
**Run baseline:** `35643077030`  
**Veredicto de esta fase:** `A03_QA_FREEZE_READY`

## Principio congelado

> Safety/protección no debe, por sí sola, inferir un estado cognitivo de la persona ni modificar sus preferencias/adaptaciones.

Esto **no** impide que Safety cambie presentación o protección.

### Adaptación/cognición observada por A03

Incluye:
- `cognitive_state`;
- `session_preferences`;
- `low_intensity`.

`adaptation_changed` se calcula solo con:
- cambios de `session_preferences`;
- cambios de `low_intensity`.

### Presentación/protección excluida de adaptation_changed

No se considera fallo A03 por sí solo que cambien:
- `protection`;
- `functional_state`;
- `interaction`;
- `mode`;
- `visual_presence`;
- bloqueo del flujo ordinario.

Esos cambios pueden ser legítimos de protección.

## Freeze exacto

| Archivo | Git blob |
|---|---|
| `tests/fixtures/sabik/a03-cognition-adaptation-v1.json` | `6c7fb8d9c9f9d1f5ebe90163d08fcc7644a9204a` |
| `tests/specs/sabik/a03-gate-v1.json` | `44684db672c4d06521832ab77b334aeeb41a6c65` |
| `tests/specs/sabik/run-a03-gate-v1.mjs` | `cfbb01bee6feb116341b7b1ce81bf2941a527ada` |
| `tests/specs/sabik/validate-a03-gate-v1.mjs` | `78b46efab44392f97bcd0506a1b47590e4b8e5c0` |

Los cuatro blobs siguen idénticos en el HEAD QA posterior a la ejecución. No se modificaron para adaptarlos al baseline.

## Casos congelados

| ID | Objetivo | Baseline |
|---|---|---|
| A03-01 | Riesgo confirmado sin señal cognitiva | FAIL |
| A03-02 | Riesgo ambiguo sin señal cognitiva | FAIL |
| A03-03 | Tercera persona con protección | PASS |
| A03-04 | Sobrecarga explícita sin Safety | PASS |
| A03-05 | Safety + sobrecarga explícita propia | PASS |
| A03-06 | Preferencia previa preservada | FAIL |
| A03-07 | Núcleo base previo preservado | FAIL |
| A03-08 | Pausa/reanudación bajo protección | FAIL |
| A03-09 | Error/retry bajo protección | FAIL |
| A03-10 | Reset bajo protección | PASS |
| A03-11 | Clearance tras uncertain sin residual | FAIL |
| A03-12 | Sensible/informativo sin sobretrigger | PASS |

```text
PASS 5/12
FAIL 7/12
A03_BASELINE_HAS_EXPECTED_GAPS
```

## Observables baseline

### A03-01 · FAIL

```text
protection         normal -> risk
cognitive_state    NucleoBase -> Sobrecarga
session_preferences unchanged
low_intensity      false -> true
ordinary_retrieval false
safety_transition  RISK_CONFIRMED
adaptation_changed true
```

Causa: Safety confirmado, sin señal cognitiva explícita, produce cambio cognitivo y de low_intensity.

### A03-02 · FAIL

```text
protection         normal -> uncertain
cognitive_state    NucleoBase -> Sobrecarga
session_preferences unchanged
low_intensity      false -> true
ordinary_retrieval false
safety_transition  RISK_UNCERTAIN
adaptation_changed true
```

Causa: Safety ambiguo por sí solo produce cambio cognitivo/adaptativo.

### A03-03 · PASS

```text
protection         normal -> risk
cognitive_state    NucleoBase -> NucleoBase
session_preferences unchanged
low_intensity      false -> false
ordinary_retrieval false
adaptation_changed false
```

La protección de tercera persona no infiere cognición propia.

### A03-04 · PASS

```text
protection         normal -> normal
cognitive_state    NucleoBase -> Sobrecarga
low_intensity      false -> true
explicit_cognitive_signal true
ordinary_retrieval true
adaptation_changed true
```

Control positivo: la detección cognitiva legítima sigue activa cuando existe señal cognitiva explícita.

### A03-05 · PASS

```text
protection         normal -> risk
cognitive_state    NucleoBase -> Sobrecarga
low_intensity      false -> true
explicit_cognitive_signal true
ordinary_retrieval false
adaptation_changed true
```

El cambio cognitivo es compatible con el fixture porque existe señal cognitiva explícita propia.

### A03-06 · FAIL

```text
preference response_length = short preservada
cognitive_state    NucleoBase -> Sobrecarga
low_intensity      false -> true
adaptation_changed true
```

La preferencia explícita no se borra, pero Safety introduce además una adaptación low_intensity y cognición no solicitadas.

### A03-07 · FAIL

```text
protection         normal -> risk
cognitive_state    NucleoBase -> Sobrecarga
low_intensity      false -> true
ordinary_retrieval false
adaptation_changed true
```

Un estado cognitivo base previo no se conserva bajo Safety-only.

### A03-08 · FAIL

Tras Safety + pausa + reanudación:

```text
protection         risk
cognitive_state    Sobrecarga
low_intensity      true
preferences        unchanged
adaptation_changed true
```

La pausa/reanudación no añade una segunda mutación, pero conserva la inferencia creada por Safety-only.

### A03-09 · FAIL

Tras uncertain + error + retry:

```text
protection         uncertain
cognitive_state    Sobrecarga
low_intensity      true
preferences        unchanged
ordinary_retrieval false
adaptation_changed true
```

El retry conserva el acoplamiento creado por Safety-only.

### A03-10 · PASS

Tras riesgo confirmado + reset:

```text
protection         risk
cognitive_state    NucleoBase
preference short   preservada
low_intensity      false
ordinary_retrieval false
adaptation_changed false
```

El reset no introduce una nueva inferencia cognitiva y respeta la protección S0.

### A03-11 · FAIL

Tras uncertain + `RISK_CLEARED`:

```text
protection         normal
cognitive_state    Sobrecarga
low_intensity      true
preferences        unchanged
safety_transition  RISK_CLEARED
adaptation_changed true
```

Causa: queda un residual cognitivo/adaptativo creado solo por Safety después de limpiar la protección.

### A03-12 · PASS

```text
protection         normal -> normal
cognitive_state    NucleoBase -> NucleoBase
preferences        unchanged
low_intensity      false -> false
adaptation_changed false
```

No hay sobretrigger cognitivo en una mención sensible/informativa sin señal cognitiva.

## Entorno baseline

```text
Ubuntu 24.04.5 LTS
Linux 6.17.0-1022-azure x86_64
Node v22.23.2
Python 3.12.3
```

La ejecución hizo checkout explícito de la baseline exacta y retiró el harness temporal antes de terminar; el checkout volvió a quedar limpio.

## Alcance QA

La rama QA modifica únicamente:

- `.github/workflows/a03-independent-baseline.yml`
- `docs/sabik/qa/W1-QA-A03-FREEZE.md`
- `tests/fixtures/sabik/a03-cognition-adaptation-v1.json`
- `tests/specs/sabik/a03-gate-v1.json`
- `tests/specs/sabik/run-a03-gate-v1.mjs`
- `tests/specs/sabik/validate-a03-gate-v1.mjs`
- `tools/a03-baseline-adapter.mjs`
- este informe de resultados

Runtime de producto modificado: **0 archivos**.

No se toca:
- S0 machine/contract;
- risk.js;
- response.js;
- retrieval.js;
- session.js;
- sabik-state.js;
- page runtime;
- A01;
- A02;
- B3;
- voz;
- datasets;
- main;
- Netlify.

## Limitaciones

- El gate congela semántica A03, no una solución técnica.
- Las señales Safety de los fixtures son semánticas para no duplicar A01.
- `ordinary_retrieval` mide llamadas reales al retrieval; el bloqueo protector puede cambiar sin considerarse adaptación.
- A03-04 y A03-05 permiten adaptación cuando existe una señal cognitiva explícita, porque el principio solo prohíbe atribuirla a Safety por sí sola.
- El baseline 5/12 no es un fallo del freeze: documenta precisamente la deuda que Codex deberá resolver después de revisión Astra.

## Salida

```text
A03_QA_FREEZE_READY
```

**NO MERGE. NO DEPLOY. DETENERSE.**
