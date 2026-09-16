# S0 · Revisión QA de PR #161

**Issue QA:** #149  
**Implementación:** PR #161 / commit `e8bcedfdafb7f552498e834b875e7805a55bf820`  
**Fecha de revisión:** 2026-09-16  
**Veredicto publicado:** `BLOQUEADO_S0`

## Resumen

La implementación supera su suite unitaria propia, pero no cumple todavía el contrato canónico de QA. Un test interno verde no equivale a S0 aceptado.

## Evidencia ejecutada

| Comprobación | Resultado | Observación |
|---|---|---|
| Diff contra `sabik-preview` | PASS | Solo 5 archivos dentro del alcance S0 |
| Archivos prohibidos tocados | PASS | 0 |
| `node tools/test-sabik-machine-s0.js` | PASS | 22/22 validaciones |
| Inmutabilidad observable | PASS | estado de entrada no mutado en sondas |
| Determinismo observable | PASS | mismo estado/evento produce mismo resultado en rutas probadas |
| Serialización de la representación actual | PASS | round-trip JSON estable en rutas probadas |
| Runner canónico QA | **FAIL / BLOQUEANTE** | pureza estática: dependencia de `window` |
| Reset durante riesgo confirmado | **FAIL / BLOQUEANTE** | `risk_confirmed → normal` |
| Riesgo durante voz/presentación | **FAIL / BLOQUEANTE** | `RISK_CONFIRMED` rechazado desde `presenting` |
| Inicio de voz durante `human_handoff` | **FAIL / BLOQUEANTE** | `SPEECH_START` aceptado |
| Forma del estado/eventos | **FAIL / BLOQUEANTE** | no coincide con contrato QA |
| `node tools/test-sabik-page-v7.js` | EVIDENCIA DEL AUTOR | PR declara PASS; QA no lo contabiliza como ejecución independiente |
| `python3 scripts/build_site.py` | **PENDIENTE / BLOQUEANTE** | PR registra `PermissionError [WinError 5]`; no hay build verde |
| Revisión semántica Claude | PENDIENTE | PR #162 aún sin informe |
| Especificación Design | PENDIENTE | PR #163 aún sin especificación; bloquea S2 |

## Integridad de los archivos ejecutados

QA reconstruyó desde GitHub los archivos de PR #161 y verificó sus blob SHA antes de ejecutar:

- `sabik/nea-core/state.js`: `aebf3d8fe969273803f81ecc968f83b61af72d9c`
- `sabik/nea-core/sabik-machine.js`: `1d846a89801444376b33932ffb9fe26b50336774`
- `tools/test-sabik-machine-s0.js`: `60e2b70a2002b32bb07eddca8085e31c8fe8548f`

## Resultado del runner canónico

```text
QA fixtures OK: 40 transiciones, 29 recorridos, 20 casos conversacionales.
BLOQUEO_QA_S0: pureza estática incumplida ... DOM/global: window
```

El runner se detiene en el primer incumplimiento bloqueante. No se modifica el contrato para poder continuar.

## Bloqueos

### B01 · Pureza/frontera del módulo

**Caso:** `S0-Q02 / I-01`  
**Evidencia:** la máquina lee `window.NEACoreState` y escribe `window.NEASabikMachine`; el runner canónico falla.  
**Riesgo:** acoplamiento a global mutable; la máquina no es verificable como unidad pura.  
**Criterio:** transición pura y desacoplada.  
**Corrección mínima:** módulo puro que exponga `transitionSabikState`; binding de navegador fuera de la máquina.

### B02 · Forma/API distinta del contrato

**Caso:** `S0-Q01 / S0-Q05 / I-10`  
**Evidencia:** `operational` en vez de `operation`; objetos `voice`/`motion` en vez de capas contractuales; faltan `revision`, `adaptation.intensity`, `adaptation.depth`, `SPEECH_STOP` y `SET_ADAPTATION`; el payload canónico de idioma no es aceptado.  
**Riesgo:** dos fuentes de verdad y S1/S2 no podrían usar fixtures QA sin adaptar el contrato al runtime.  
**Criterio:** implementación conforme al contrato canónico.  
**Corrección mínima:** alinear la API pública, estado, catálogo y payloads; una representación interna distinta solo es admisible tras un límite público canónico inequívoco.

### B03 · Reset rebaja seguridad

**Caso:** `EV-RESET-RISK / I-07`  
**Evidencia:** `risk_confirmed + RESET_SESSION → safety: normal`; el test propio S0-010 exige ese resultado.  
**Riesgo:** reset puede devolver a flujo ordinario una situación ya confirmada de seguridad.  
**Criterio:** seguridad prevalente y reset independiente.  
**Corrección mínima:** preservar `risk`/`human_handoff` o rechazar reset durante protección; solo un evento de seguridad documentado puede rebajarla.

### B04 · Seguridad no preemptiva respecto a voz/presentación

**Caso:** `EV-RISK-CONFIRMED-SPEAKING` + `EV-SPEECH-START-RISK`  
**Evidencia:** `RISK_CONFIRMED` lanza desde `presenting + speaking`; después de `HUMAN_HANDOFF`, `SPEECH_START` se acepta y deja la voz hablando.  
**Riesgo:** una señal de riesgo que llega durante respuesta/voz no puede prevalecer inmediatamente y puede arrancar voz ordinaria en handoff.  
**Criterio:** prioridad de seguridad sobre operación, voz y decoración.  
**Corrección mínima:** permitir preempción desde estados activos relevantes, neutralizar voz ordinaria y bloquear `SPEECH_START` normal mientras haya `risk`/`human_handoff`.

### B05 · Falta build verde

**Caso:** `S0-Q12`  
**Evidencia:** la documentación de PR #161 registra fallo final de build por bloqueo de archivo.  
**Riesgo:** no existe evidencia de integridad de build para el commit revisado.  
**Criterio:** pruebas S0 + integración + build verdes.  
**Corrección mínima:** reejecutar el build en entorno limpio y aportar resultado verde, sin debilitar la auditoría.

## Cobertura QA disponible

- 40 transiciones/eventos de matriz;
- 29 recorridos canónicos;
- 20 casos de corpus conversacional;
- capas cubiertas: operación, diálogo, adaptación, seguridad, visibilidad, voz, movimiento, idioma;
- negativos cubiertos: doble envío, evento fuera de secuencia, voz durante riesgo, reset durante riesgo, error técnico durante riesgo;
- corpus: normal, corrección, negación, contexto, ambigüedad, insuficiencia, falsa coincidencia, riesgo, idioma, dato ausente, error técnico, entrada larga y doble envío.

La cobertura no implica PASS mientras el runner no pueda ejecutar la implementación completa.

## Pendientes manuales y externos

- revisión semántica de Claude en PR #162;
- especificación visual/voz/movimiento de Design en PR #163 antes de S2;
- pruebas de tecnología de asistencia real pertenecen a fases posteriores y permanecen `NO_EJECUTADO`, nunca se infieren de pruebas automáticas;
- decisión sobre `noindex` fuera de S0 y posterior a accesibilidad, seguridad, regresión y documentación pública.

## Puerta

**S0: BLOQUEADO.**  
**S1: CERRADO.** Requiere S0 aceptado, revisión semántica de Claude, casos canónicos QA en verde y cero contradicciones.  
**S2: CERRADO.** Requiere además especificación de Design.
