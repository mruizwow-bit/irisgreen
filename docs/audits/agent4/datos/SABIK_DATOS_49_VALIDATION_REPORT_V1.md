# SABIK_DATOS_49_VALIDATION_REPORT_V1

**Fase:** C2-R1 · Atomicidad + hardening final  
**Validador:** `validate-sabik-datos-claims-v1.mjs`  
**Fecha:** 21/09/2026  
**Resultado sobre artefactos comprometidos:** **PASS · 0 errores**

## Conteos comprobados

- claims: **188**;
- `page_id`: **49 filas · 49 únicos**;
- `claim_id`: **188 únicos**;
- changes: **6 filas · 6 `change_id` únicos**;
- `production_applied=NO`: **6/6**;
- derivados recalculados: **17/17**, sin discrepancias;
- decisiones claim:
  - VERIFICADO = **161**;
  - VERIFICADO_SECUNDARIA_JUSTIFICADA = **20**;
  - REQUIERE_CORRECCION = **2**;
  - HISTORICO_CONSERVAR = **5**;
- fichas:
  - VERIFICADA = **43**;
  - EN_REVISIÓN = **5**;
  - HISTÓRICA = **1**.

## Gates endurecidos comprobados

- 49 `page_id` únicos;
- todos los claims pertenecen a una ficha registrada;
- recuentos claim/ficha exactos;
- `change_id` únicos;
- 100 % de changes en NO;
- enums de `fuente_primaria` y `coincidencia_fuente_web`;
- coherencia de fuente secundaria con decisión;
- campos sustantivos obligatorios presentes;
- equivalencias cuantitativas separadas en claims atómicos;
- tamaños de muestra conservados como contexto cuando no cambian el significado de la ficha;
- todos los derivados recalculables con operación, fórmula, redondeo y tolerancia.

**PASS · 0 errores.**
