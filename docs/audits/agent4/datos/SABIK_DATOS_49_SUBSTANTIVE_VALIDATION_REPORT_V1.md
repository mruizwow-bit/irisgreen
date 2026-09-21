# SABIK_DATOS_49_SUBSTANTIVE_VALIDATION_REPORT_V1

**Agente:** n.º 4  
**Fase:** C2-R1 · Atomicidad + hardening final  
**Fecha:** 21/09/2026  
**PR:** #186  
**HEAD base de contenido:** `52380c9a862c7184e6ff56507123063df3c30601`  
**Estado:** **SABIK_DATOS_49_SUBSTANTIVE_VALIDATION_HARDENED_READY**  
**Producción:** 0 cambios · **NO MERGE**

## Resultado

- Fichas: **49/49**.
- Claims tras auditoría de atomicidad: **188** (no se conserva artificialmente 168).
- Claims verificados: **181**.
- Claims que requieren corrección: **2**.
- Claims históricos conservados: **5**.
- Claims derivados recalculables: **17**.
- Changeset: **6 cambios · 6/6 production_applied=NO**.

## Decisiones

- VERIFICADO: **161**.
- HISTORICO_CONSERVAR: **5**.
- REQUIERE_CORRECCION: **2**.
- VERIFICADO_SECUNDARIA_JUSTIFICADA: **20**.

## Fichas

- VERIFICADA: **43**.
- EN_REVISIÓN: **5**.
- HISTÓRICA: **1**.

## Comparabilidad

- DIRECTA: **65**.
- NO_APLICA: **55**.
- LIMITADA: **53**.
- NO_DIRECTA: **15**.

## Atomicidad

- ATOMICO: **186**.
- CONTEXTO_MUESTRA: **2**.
- Se separaron conteos, porcentajes, tasas, razones y conversiones equivalentes verificables de forma independiente.
- Edades, años y tamaños de muestra que solo contextualizan población/evidencia no se desdoblaron.

## Evidencia temporal reforzada

- Eurostat: el documento oficial `Equality in the EU — a snapshot` identifica expresamente **2025** para la brecha de empleo de **24,2 puntos porcentuales**.
- OMS: `Global report on health equity for persons with disabilities` indica expresamente **As of 2021** para aproximadamente **1.300 millones / 16 %**.

## Hardening del validador

El validador comprueba realmente:
- 49 `page_id` únicos;
- pertenencia de todos los claims a una ficha registrada;
- recuentos exactos por ficha;
- `claim_id` y `change_id` únicos;
- 100 % de changes con `production_applied=NO`;
- campos sustantivos obligatorios no vacíos;
- enums de fuente primaria y coincidencia fuente/web;
- coherencia fuente secundaria ↔ decisión;
- atomicidad básica contra magnitudes equivalentes ocultas;
- todos los derivados mediante operación + inputs + fórmula + redondeo + tolerancia;
- coincidencia del valor recalculado con el valor publicado.

## Producción

No se modificó ninguna página pública.  
Los 6 cambios siguen sin aplicar.  
No se modificó build, renderer, sitemap ni runtime.

**0 PRODUCCIÓN MODIFICADA · NO MERGE.**
