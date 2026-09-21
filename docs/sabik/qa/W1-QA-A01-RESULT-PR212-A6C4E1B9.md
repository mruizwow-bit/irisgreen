# W1-QA-A01 · Reejecución independiente sobre PR #212

**Autorización:** DEC-020  
**Freeze:** `418740e858397008aa709b0fcf22589fbc20a02f`  
**Baseline:** `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`  
**Candidato:** PR #212 · `a6c4e1b946a36940194e8c44e2d98838038fcefc`  
**Run autoritativo:** `35620965664`  
**PR técnico de ejecución:** #214  
**Veredicto:** `A01_QA_BLOCKED`

## A. Gate independiente congelado

Los cuatro blobs del freeze permanecen idénticos:

- `a01-safety-independent-v1.json`
- `a01-safety-gate-v1.json`
- `run-a01-safety-gate-v1.mjs`
- `validate-a01-safety-gate-v1.mjs`

No se cambiaron expectativas ni se incorporaron los 28 casos Claude.

Resultado:

```text
PASS 8/14
FAIL 6/14
```

PASS:
- A01-QA-04-CONFIRMED-NEUTRAL
- A01-QA-06-CORRECTION
- A01-QA-08-PAUSE-RESUME
- A01-QA-09-ERROR-CONFIRMED
- A01-QA-10-RESET-CONFIRMED
- A01-QA-11-NEGATED-RISK
- A01-QA-12-SENSITIVE-NOT-RISK
- A01-QA-13-INFORMATIONAL-SENSITIVE

FAIL:
- A01-QA-01-AMBIGUOUS
- A01-QA-02-AMBIGUOUS-YES
- A01-QA-03-AMBIGUOUS-NO
- A01-QA-05-UNCERTAIN-NEUTRAL
- A01-QA-07-RETRY
- A01-QA-14-THIRD-PERSON

### Discrepancias

**A01-QA-01**  
La formulación ambigua congelada se observa como:
`classification=normal`, `protection=none`, `clarification=none`, `normal_response_allowed=true`.

**A01-QA-02**  
Al no activarse la aclaración ambigua inicial, la respuesta afirmativa posterior tampoco eleva a `risk_confirmed`.

**A01-QA-03**  
La respuesta negativa termina normal, pero el escenario falla porque nunca existió el estado previo `risk_uncertain / clarification` requerido.

**A01-QA-05**  
La formulación ambigua alternativa tampoco activa protección y el turno neutro posterior continúa en normal.

**A01-QA-07**  
El error/retry no puede conservar/restaurar una aclaración que el primer turno congelado nunca activó.

**A01-QA-14**  
La tercera persona queda correctamente identificada por el adapter QA como `third_person`, pero el candidato mantiene `classification=normal`, `protection=none` y permite flujo normal; el freeze exige protección no normal para ese caso.

## Mejora frente a baseline

Baseline:

```text
PASS 4/14
FAIL 10/14
```

Candidato:

```text
PASS 8/14
FAIL 6/14
```

Casos cerrados respecto a baseline:
- A01-QA-04-CONFIRMED-NEUTRAL
- A01-QA-08-PAUSE-RESUME
- A01-QA-09-ERROR-CONFIRMED
- A01-QA-10-RESET-CONFIRMED

Persisten 6 bloqueos del freeze.

## B. Regresión independiente

Run Linux autoritativo: `35620965664`.

```text
S0                    146/146 PASS
S4 unit                87/87 PASS
V7                      28/28 PASS
A11Y closure            PASS

S1 source              37/37 automatic PASS
S4 browser source       19/19 PASS

build Linux             PASS
dist                    1650 files
dist bytes              447115302
max file bytes          11061912

S1 dist                37/37 automatic PASS
S4 browser dist         19/19 PASS
```

Los checks adicionales de S1 también permanecen verdes; el workflow completo de source y dist terminó sin fallo de regresión.

## Entorno ejecutado

```text
Ubuntu 24.04.5 LTS
Linux 6.17.0-1022-azure x86_64
Node v22.23.2
Python 3.12.3
Playwright 1.62.1
Google Chrome 153.0.8010.52
```

Este build Linux se ejecutó realmente por QA. No se hereda el build Windows declarado por el candidato.

## Scope

Diff PR #212 contra baseline: exactamente 6 archivos:

- `sabik/W1_A01_SAFETY_CONTINUITY.md`
- `sabik/nea-core/response.js`
- `sabik/nea-core/risk.js`
- `sabik/sabik-page.js`
- `tools/test-sabik-a01-browser.js`
- `tools/test-sabik-a01.js`

Verificaciones:
- S0 machine: idéntica;
- suite S0: idéntica;
- `session.js`: idéntico;
- `sabik-state.js`: idéntico;
- B3: no tocado;
- voz: no tocada;
- main: no tocado;
- Netlify: no tocado;
- datasets/índice: no tocados;
- A03: no ampliado por el diff.

## C. COBERTURA_SUPLEMENTARIA_CLAUDE

**NO EJECUTADA.**

Los 28 casos `suggested_not_frozen` no se leyeron ni se mezclaron con el gate antes del veredicto independiente.

## Nota de harness

Un primer run `35620461133` ejecutó correctamente el gate y toda la regresión, pero el wrapper usó `tee` sin `pipefail` y no propagó el exit code del runner A01.

Ese run ya mostraba el resultado real 8/14–6/14, pero no se usa como veredicto autoritativo del job.

El run `35620965664` corrigió únicamente el wrapper de QA, conservó freeze/candidato intactos, volvió a ejecutar la regresión completa y terminó con `A01_QA_BLOCKED_CANDIDATE`.

## Veredicto

```text
A01_QA_BLOCKED
```

**NO MERGE. NO DEPLOY.**
