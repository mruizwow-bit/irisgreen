# W1-QA-A01-R2 · Veredicto final independiente

**Autorización:** DEC-020  
**PR candidato:** #212  
**Candidato exacto:** `0a1d4339bae2628dc963501a30f326553605821b`  
**Baseline:** `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`  
**Freeze:** `418740e858397008aa709b0fcf22589fbc20a02f`  
**Run Linux exact-head autoritativo:** `35638664537`  
**PR técnico de ejecución:** #216  
**Veredicto:** `A01_QA_PASS`

## A. Gate independiente congelado

Los cuatro blobs congelados siguen idénticos:

| Archivo | Blob Git |
|---|---|
| `tests/fixtures/sabik/a01-safety-independent-v1.json` | `8e3e82bbb7ea2dc985eb822d6bccfa9659346707` |
| `tests/specs/sabik/a01-safety-gate-v1.json` | `b5f86772d58ed1ec4aaa1f22fda2775ea27280d3` |
| `tests/specs/sabik/run-a01-safety-gate-v1.mjs` | `4fb7fcadb08bfb719870b62cb5ab3328b3158625` |
| `tests/specs/sabik/validate-a01-safety-gate-v1.mjs` | `a4a0729a4f21b7094425bd38bd21aefb6fc21656` |

No se modificaron casos, expectations, fixtures, runner ni validator.

Resultado final:

```text
PASS 14/14
FAIL  0/14
```

| ID | Resultado |
|---|---|
| A01-QA-01-AMBIGUOUS | PASS |
| A01-QA-02-AMBIGUOUS-YES | PASS |
| A01-QA-03-AMBIGUOUS-NO | PASS |
| A01-QA-04-CONFIRMED-NEUTRAL | PASS |
| A01-QA-05-UNCERTAIN-NEUTRAL | PASS |
| A01-QA-06-CORRECTION | PASS |
| A01-QA-07-RETRY | PASS |
| A01-QA-08-PAUSE-RESUME | PASS |
| A01-QA-09-ERROR-CONFIRMED | PASS |
| A01-QA-10-RESET-CONFIRMED | PASS |
| A01-QA-11-NEGATED-RISK | PASS |
| A01-QA-12-SENSITIVE-NOT-RISK | PASS |
| A01-QA-13-INFORMATIONAL-SENSITIVE | PASS |
| A01-QA-14-THIRD-PERSON | PASS |

Comparación histórica:

```text
baseline fc5cdfc2...      4/14 PASS · 10/14 FAIL
a6c4e1b9... histórico    8/14 PASS ·  6/14 FAIL
0a1d4339... final       14/14 PASS ·  0/14 FAIL
```

El veredicto anterior `A01_QA_BLOCKED` de `a6c4e1b9...` se conserva como histórico y no se reescribe.

## B. Regresión independiente

Ejecutada sobre checkout Git exacto del candidato, no sobre merge ref:

```text
HEAD comprobado          0a1d4339bae2628dc963501a30f326553605821b
git diff --check         PASS

S0                       146/146 PASS
S4 unit                   87/87 PASS
V7                         28/28 PASS
A11Y closure              PASS

S1 source:
  automatic               37/37 PASS
  extra                    53/53 PASS

S4 browser source         19/19 PASS

build Linux               PASS
dist files                1650
dist bytes                447118413
max file bytes            11061912

S1 dist:
  automatic               37/37 PASS
  extra                    53/53 PASS

S4 browser dist           19/19 PASS
```

El harness QA congelado se copió temporalmente al checkout exacto para ejecutar el gate y se retiró antes de las regresiones/build. Tras retirarlo:
- `git status --porcelain` vacío;
- HEAD seguía exactamente en `0a1d4339...`.

## Entorno

```text
OS          Ubuntu 24.04.5 LTS
kernel      Linux 6.17.0-1022-azure x86_64
Node        v22.23.2
Python      3.12.3
Playwright  1.62.1
Chrome      153.0.8010.52
```

No se hereda el build Windows del candidato.

## C. Scope

PR #212 final modifica 7 archivos:

- `sabik/W1_A01_SAFETY_CONTINUITY.md`
- `sabik/nea-core/response.js`
- `sabik/nea-core/risk.js`
- `sabik/sabik-page.js`
- `tools/test-sabik-a01-browser.js`
- `tools/test-sabik-a01-supplemental.js`
- `tools/test-sabik-a01.js`

Protecciones verificadas idénticas a baseline:

- `sabik/nea-core/sabik-machine.js`
- `tools/test-sabik-machine-s0.js`
- `sabik/nea-core/session.js`
- `sabik/nea-core/sabik-state.js`

No hay cambio de contrato/máquina S0, tests normativos S0, B3, voz, main, Netlify, datasets, índice ni producción.

A03:
- `sabik-state.js` e intensidad/low_intensity no cambian;
- el commit final no amplía política A03;
- SEM-23 sigue fuera de alcance;
- las referencias A03 en documentación/test suplementario registran el límite, no implementan la política.

## D. Historial

Comprobado en el checkout exacto:

- `a6c4e1b946a36940194e8c44e2d98838038fcefc` sigue en historia;
- `56c601c55ea5c3e288b3b6cb893bc2c28ee98ecc` sigue en historia;
- `0a1d4339bae2628dc963501a30f326553605821b` es descendiente fast-forward;
- no se observa rebase ni borrado de candidatos auditados.

## E. SUPPLEMENTAL_NOT_GATE · Claude 28

No se reejecutó como parte del gate independiente.

Estado suplementario declarado en la orden/PR #212, posterior y separado del veredicto:
- 23 PASS completos medidos;
- 4 cumplen esquema base con observables opcionales no disponibles;
- 1 FAIL opcional real: SEM-23/A03, fuera del alcance A01;
- 28/28 cumplen el esquema base.

SEM-23/A03 no bloquea A01 porque los 14 casos congelados pasan y A03 permanece fuera del scope autorizado.

## Limitaciones

- S1 aquí es regresión automatizada; no constituye una nueva certificación manual con lector de pantalla.
- Claude 28 se registra solo como evidencia suplementaria no-gate y no altera el veredicto.
- Este informe no autoriza merge ni deploy.

## Veredicto

```text
A01_QA_PASS
```

**NO MERGE. NO DEPLOY. DETENERSE PARA COORDINACIÓN ASTRA.**
