# SABIK_DATOS_49_SUBSTANTIVE_VALIDATION_REPORT_V1

**Agente:** n.º 4  
**Fase:** C2-R0 · Validación a nivel de afirmación  
**Fecha de consulta:** 2026-09-21  
**PR:** #186  
**Base contractual:** `52380c9a862c7184e6ff56507123063df3c30601`  
**Estado:** **SABIK_DATOS_49_SUBSTANTIVE_VALIDATION_READY**  
**Producción:** 0 cambios · **NO MERGE**

## 1. Gate 49/49

- Fichas adjudicadas: **49/49**.
- Nivel ficha: `SABIK_DATOS_49_VERIFICATION_REGISTER_V1.csv`.
- Nivel claim: `SABIK_DATOS_CLAIM_VERIFICATION_REGISTER_V1.csv`.
- Claims cuantitativos relevantes revisados: **168**.
- Páginas sin claim cuantitativo relevante que cambie el significado: **2**; se verificó su tesis metodológica y fuentes.

## 2. Resultado claims

- DIRECTA: **60**.
- LIMITADA: **50**.
- NO_APLICA: **45**.
- NO_DIRECTA: **13**.

- Fuentes secundarias justificadas a nivel claim: **0**.
- Fuentes sustituidas: **0**.
- Fuente oficial adicional propuesta: **1** (OMS · Mental disorders para 72 millones de niños/adolescentes con ansiedad).
- Cálculos derivados publicados por la ficha conservan numerador, denominador y fórmula cuando procede.
- No se generaron porcentajes nuevos para publicación.

## 3. Resultado fichas

- VERIFICADA: **43**.
- EN_REVISIÓN: **5**.
- HISTÓRICA: **1**.

Una ficha solo queda VERIFICADA si todos sus claims relevantes superan el gate y no existe una contradicción de metadatos que cambie su interpretación.

### EN_REVISIÓN
- `autismo-diferencias-por-sexo-en-la-estimacion-mundial`: Corregir Población medida para abarcar varones, mujeres y el metaanálisis de razón por sexo.
- `brecha-de-empleo-asociada-a-discapacidad`: Hacer explícito 2025 como año de los datos del 24,2 pp; mantener 2026 como publicación.
- `discapacidad-significativa`: Cambiar Año de los datos de «estimación mundial vigente» a 2021; conservar que OMS la mantiene vigente en 2026.
- `educacion-y-discapacidad-infantil`: Corregir «las cuatro cifras» por «las cinco cifras» en Población medida.
- `trastornos-de-ansiedad`: Añadir la fuente OMS · Mental disorders para respaldar los 72 millones de niños y adolescentes.

### HISTÓRICA
- `trastorno-del-desarrollo-del-lenguaje-un-estudio-poblacional-de-referencia`: el 7,58 % de Norbury et al. (2016) queda conservado deliberadamente como estudio poblacional de referencia; no se sustituye por el mero hecho de existir literatura posterior.

## 4. Tipos de medida separados

El registro distingue, sin convertir unos en otros:
- prevalencia modelizada;
- prevalencia observada/agrupada;
- diagnóstico declarado;
- identificación administrativa/vigilancia de registros;
- encuesta;
- conteo absoluto;
- porcentaje;
- tasa;
- razón;
- diferencia;
- cambio entre periodos;
- proyección;
- carga de salud (DALYs);
- mediana y cobertura de dato.

Para comparaciones internacionales se usa `comparability = DIRECTA / LIMITADA / NO_DIRECTA`; el resto usa `NO_APLICA`.

## 5. Correcciones propuestas

Changeset: `SABIK_DATOS_49_CHANGESET_V1.csv`.

Contiene **6** operaciones explícitas y **0 aplicadas**:
- 4 ajustes de metadatos temporales/poblacionales;
- 1 corrección de conteo textual («cuatro» → «cinco»);
- 1 adición de fuente oficial.

No hay sustitución silenciosa de fuentes históricas.

## 6. Fuentes y evidencia

La comprobación agrupó claims por fuente para que varias páginas que reutilizan la misma serie se validen contra el mismo origen:
- CDC ADDM 2022;
- ABS SDAC 2022;
- PHAC / CHSCY 2019;
- Eurostat EU-LFS / EU-SILC;
- OMS / UNICEF;
- ILO / ILOSTAT;
- GBD 2021 y metaanálisis originales;
- Buckland Review solo donde actúa como fuente secundaria oficial explícitamente justificada.

## 7. Producción

No se modificó ninguna de las 49 páginas públicas.  
No se retiró `BORRADOR`.  
No se modificó build, renderer, sitemap o runtime.

**0 PRODUCCIÓN MODIFICADA · NO MERGE.**
