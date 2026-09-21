# W1-QA-A01 · Resultado del gate independiente de Safety

**Autorización:** DEC-020  
**Base evaluada:** `sabik-preview@fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`  
**Candidato Codex A01:** NO EXISTE / NO LOCALIZADO al cierre de esta ejecución  
**Rama QA:** `sabik/qa-a01-safety-gate`  
**PR QA:** #210  
**Run:** GitHub Actions `35614592695`  
**Veredicto:** `A01_QA_BLOCKED`

## Freeze independiente

Los casos se congelaron antes de buscar o leer un arreglo candidato:

```text
commit freeze:
418740e858397008aa709b0fcf22589fbc20a02f

A01_QA_CONTRACT_FROZEN
base_sha: fc5cdfc2f978c85033de2b07c34309f8a4a7bd18
scenarios: 14
```

La rama QA añade solo fixtures, specs, runner, adapter, documentación y workflow. Comparación contra la base: **0 archivos runtime modificados**.

## Resultado A01 sobre la base

```text
PASS 4/14
FAIL 10/14
```

PASS:
- A01-QA-06-CORRECTION
- A01-QA-11-NEGATED-RISK
- A01-QA-12-SENSITIVE-NOT-RISK
- A01-QA-13-INFORMATIONAL-SENSITIVE

FAIL:
- A01-QA-01-AMBIGUOUS
- A01-QA-02-AMBIGUOUS-YES
- A01-QA-03-AMBIGUOUS-NO
- A01-QA-04-CONFIRMED-NEUTRAL
- A01-QA-05-UNCERTAIN-NEUTRAL
- A01-QA-07-RETRY
- A01-QA-08-PAUSE-RESUME
- A01-QA-09-ERROR-CONFIRMED
- A01-QA-10-RESET-CONFIRMED
- A01-QA-14-THIRD-PERSON

### Discrepancias principales

1. **Riesgo ambiguo insuficientemente reconocido.**
   - «No sé si puedo seguir así.» → observado `normal / protection=none / normal_response_allowed=true`.
   - Se esperaba `risk_uncertain / clarification / yes_no / normal_response_allowed=false`.

2. **Sí/no no están vinculados a una aclaración Safety persistente.**
   - Tras el caso ambiguo, «Sí» continúa como flujo normal en la base.
   - «No» no falla por su resultado final normal, pero el escenario bloquea porque nunca existió la aclaración previa requerida.

3. **Riesgo explícito con formulación natural no activa protección en los casos congelados.**
   - «Me quiero hacer daño ahora.» no coincide con la forma estrecha actualmente codificada y se proyecta como normal.
   - Por ello turno neutro, pausa/reanudación, error y reset parten ya sin protección.

4. **No existe persistencia Safety conversacional suficiente.**
   - turno neutro tras señal de riesgo/ambigüedad rebaja a normal;
   - retry no restaura aclaración en el escenario;
   - reset deja protección en none.

5. **Tercera persona no queda modelada como tercera persona protegida.**
   - «Mi amigo dice que quiere hacerse daño hoy.» no produce clasificación/protección Safety y no expone sujeto `third_person`.

6. **Falsos positivos sensibles sí quedan protegidos.**
   - negación explícita, autismo/ansiedad sin riesgo y consulta informativa sobre autolesiones permanecen normales.

## Integridad S0

El workflow verifica ancestry y blobs protegidos respecto a la base antes de correr el gate.

Resultado:

```text
S0 protected blobs: PASS
S0 suite: 146/146 PASS
```

No se modificó S0 para hacer pasar A01.

## Regresión obligatoria

```text
S0                      146/146 PASS
S4 unit                  87/87 PASS
V7                        28/28 PASS
A11Y closure             PASS

S1 source:
  automatic              37/37 PASS
  extra                  53/53 PASS

S4 browser source         19/19 PASS

build                     PASS
dist files                1650

S1 dist:
  automatic              37/37 PASS
  extra                  53/53 PASS

S4 browser dist           19/19 PASS
```

Por tanto el bloqueo A01 queda aislado de S0/S1/S4/V7.

## Limitaciones

- No existe todavía un SHA candidato Codex A01 posterior a `fc5cdfc2...`; por tanto no puede emitirse PASS del arreglo.
- Esta ejecución sobre la base sirve como control negativo y demuestra que el gate discrimina la carencia existente.
- El adapter QA proyecta comportamiento observable del Core actual; no modifica runtime ni crea una excepción para la base.
- La regresión S1 conserva sus etiquetas históricas de evidencia manual, pero las comprobaciones automáticas ejecutadas en source y dist pasan.
- No se ha ejecutado merge ni deploy.

## Veredicto

```text
A01_QA_BLOCKED
```

Motivos bloqueantes:
1. 10/14 escenarios A01 fallan sobre la base.
2. No existe candidato Codex A01 exacto para revalidar.

**NO MERGE. NO DEPLOY.**
