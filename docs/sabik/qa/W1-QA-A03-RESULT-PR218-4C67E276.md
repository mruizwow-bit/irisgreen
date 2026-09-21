# W1-QA-A03 · Veredicto independiente sobre PR #218

**Autorización:** DEC-020  
**PR candidato:** #218  
**Candidato exacto:** `4c67e276d4fd0a0d4d407d3504a7416d7ed39cfb`  
**Baseline A03:** `0a1d4339bae2628dc963501a30f326553605821b`  
**Freeze A03:** `96a0fc516266166c09d3c2f9dd2f03e684a9b027`  
**Run Linux autoritativo:** `35646608765`  
**PR técnico QA:** #219  
**Veredicto:** `A03_QA_PASS`

## Integridad del freeze

Blobs verificados sin drift:

| Artefacto | Git blob |
|---|---|
| fixture | `6c7fb8d9c9f9d1f5ebe90163d08fcc7644a9204a` |
| spec | `44684db672c4d06521832ab77b334aeeb41a6c65` |
| runner | `cfbb01bee6feb116341b7b1ce81bf2941a527ada` |
| validator | `78b46efab44392f97bcd0506a1b47590e4b8e5c0` |
| adapter de observación | `61a839cf8e2456cedc7e456f9ad4141fb026393a` |

No se modificaron casos, expectations, runner/validator ni la definición de `adaptation_changed`.

## Gate A03 congelado

Baseline:

```text
PASS 5/12
FAIL 7/12
```

Candidato:

```text
PASS 12/12
FAIL 0/12
A03_INDEPENDENT_CASES_PASS
```

| ID | Protección final | Cognición | Preferencias | low_intensity | retrieval | transición | adaptation_changed | Resultado |
|---|---|---|---|---|---|---|---|---|
| A03-01 | risk | NucleoBase→NucleoBase | iguales | false→false | false | RISK_CONFIRMED | false | PASS |
| A03-02 | uncertain | NucleoBase→NucleoBase | iguales | false→false | false | RISK_UNCERTAIN | false | PASS |
| A03-03 | risk | NucleoBase→NucleoBase | iguales | false→false | false | RISK_CONFIRMED | false | PASS |
| A03-04 | normal | NucleoBase→Sobrecarga | iguales | false→true | true | none | true | PASS |
| A03-05 | risk | NucleoBase→Sobrecarga | iguales | false→true | false | RISK_CONFIRMED | true | PASS |
| A03-06 | risk | NucleoBase→NucleoBase | iguales (short preservada) | false→false | false | RISK_CONFIRMED | false | PASS |
| A03-07 | risk | NucleoBase→NucleoBase | iguales | false→false | false | RISK_CONFIRMED | false | PASS |
| A03-08 | risk | NucleoBase→NucleoBase | iguales | false→false | false | RISK_CONFIRMED | false | PASS |
| A03-09 | uncertain | NucleoBase→NucleoBase | iguales | false→false | false | RISK_UNCERTAIN | false | PASS |
| A03-10 | risk | NucleoBase→NucleoBase | iguales (short preservada) | false→false | false | RISK_CONFIRMED | false | PASS |
| A03-11 | normal | NucleoBase→NucleoBase | iguales | false→false | false | RISK_CLEARED | false | PASS |
| A03-12 | normal | NucleoBase→NucleoBase | iguales | false→false | true | none | false | PASS |

Se mantienen los cinco controles positivos del baseline:
- tercera persona protege sin inferir cognición propia;
- sobrecarga explícita sin Safety sigue cambiando cognición;
- Safety + señal cognitiva explícita sigue permitiendo cambio legítimo;
- reset protegido no introduce inferencia nueva;
- informativo sensible no sobretriggera.

## Principio A03

Safety por sí sola ya no produce en el gate independiente:
- inferencia cognitiva;
- mutación de preferencias;
- activación de `low_intensity`.

Sí conserva cambios protectores legítimos de presentación/estado y bloqueo del flujo ordinario.

## Scope candidato

Compare exclusivo:

```text
0a1d4339bae2628dc963501a30f326553605821b
→
4c67e276d4fd0a0d4d407d3504a7416d7ed39cfb

ahead_by: 1
behind_by: 0
```

Exactamente 3 archivos:
- `sabik/W1_A03_COGNITION_SAFETY.md`
- `sabik/nea-core/retrieval.js`
- `tools/test-sabik-a03.js`

Runtime A03: solo `retrieval.js` (+2/-1).

`git diff --check`: PASS.

No delta A03 fuera de ese scope.

## Protección A01

Freeze A01 exacto:

```text
PASS 14/14
FAIL 0/14
A01_INDEPENDENT_CASES_PASS
```

Además:
- A01 propias: 154/154 PASS.
- A01 browser source: 29/29 PASS.
- A01 browser dist: 29/29 PASS.

A01 no regresa.

## Regresión independiente

```text
A03 propias             67/67 PASS
A01 propias             154/154 PASS
S0                      146/146 PASS
S4 unit                  87/87 PASS
V7                        28/28 PASS
A11Y closure             PASS

S1 source:
  automatic              37/37 PASS
  extra                   53/53 PASS

S4 browser source        19/19 PASS

build Linux              PASS
dist files               1650
dist bytes               447118490
max file bytes           11061912

S1 dist:
  automatic              37/37 PASS
  extra                   53/53 PASS

S4 browser dist          19/19 PASS
```

## Entorno

```text
Ubuntu 24.04.5 LTS
Linux 6.17.0-1022-azure x86_64
Node v22.23.2
Python 3.12.3
Playwright 1.62.1
Google Chrome 153.0.8010.52
```

No se hereda el build Windows de Codex.

## SUPPLEMENTAL_NOT_GATE · SEM-23

El corpus Claude28 exacto permanece externo al repositorio y no se utilizó como sustituto del gate.

Después de cerrar el gate A03 se ejecutó una comprobación independiente equivalente sobre el observable congelado Safety-only:

```json
{
  "inferred_state_changed": false,
  "adaptation_changed": false,
  "protection_after": "risk",
  "ordinary_retrieval": false
}
```

Esto coincide con el expected semántico de SEM-23.

El PR #218 declara adicionalmente que su ejecución del corpus Claude28 deja SEM-23 en PASS y 0 FAIL; esa declaración se registra solo como evidencia suplementaria, no como base del veredicto.

## Limitaciones

- La ejecución de Claude28 exacta no se reprodujo porque su JSON sigue externo al repositorio.
- S1 aquí es regresión automatizada; no reabre ni sustituye su certificación manual previa.
- Este veredicto evalúa A03 y regresiones; no autoriza merge ni deploy.

## Estado remoto preservado

- PR #218: OPEN · DRAFT · merged=false · HEAD `4c67e276d4fd0a0d4d407d3504a7416d7ed39cfb`.
- PR #217: OPEN · DRAFT · merged=false · HEAD `59cda12c6a21cd0b4de94ae7c113cd20ced3548b`.
- No se modificaron #218 ni #217 durante esta QA.

## Veredicto

```text
A03_QA_PASS
```

**NO MERGE. NO DEPLOY. DETENERSE.**
