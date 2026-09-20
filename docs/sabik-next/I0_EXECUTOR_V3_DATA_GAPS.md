# I0 · V3 · GAPS DE CONTRATO / DATASET

## 1. flowId de STEP_NEXT / STEP_BACK

El schema de caso permite que `expected_actions` contenga `flowId`, pero varios casos consumidos solo ofrecen `activeFlow="step_by_step"` en el contexto.

No existe función contractual que transforme `activeFlow` en el identificador opaco esperado.

**Decisión V3:** no memorizar IDs. Reportar action type correcto con parameter mismatch cuando corresponda.

## 2. ResultKind de búsqueda + acción

Hay estructuras equivalentes de:
- `ENCONTRAR_CONTENIDO`;
- una preferencia reversible ejecutable;

con `response` en development y `action_result` en regression consumido.

**Decisión V3:** si existe una acción ejecutada, usar `action_result`; si solo se busca, usar `response`.

El desacuerdo se conserva como gap y no se corrigen labels.

## 3. Canon de query

El contrato no especifica una ontología completa para strings canónicos de query.

Los alias semánticos deben vivir en vocabulario general de producto, no en mappings por utterance/case.
