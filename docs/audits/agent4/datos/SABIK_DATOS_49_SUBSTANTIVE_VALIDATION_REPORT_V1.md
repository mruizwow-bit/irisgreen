# SABIK_DATOS_49_SUBSTANTIVE_VALIDATION_REPORT_V1

**Agente:** n.º 4  
**Fase:** C2-R0 · Validación a nivel de afirmación  
**Fecha de consulta:** 21/09/2026  
**PR:** #186  
**Base contractual:** `52380c9a862c7184e6ff56507123063df3c30601`  
**Estado:** **SABIK_DATOS_49_SUBSTANTIVE_VALIDATION_READY**  
**Producción:** 0 cambios · **NO MERGE**

## 1. Gate 49/49

- Fichas adjudicadas: **49/49**.
- Claims cuantitativos relevantes revisados: **168**.
- Claims verificados: **162** (144 con fuente primaria/directa o evidencia original + 18 con fuente secundaria expresamente justificada).
- Claims que requieren corrección: **2**.
- Claims históricos conservados: **4**.
- Páginas sin claim cuantitativo relevante que cambie el significado: **2**; se verificó su tesis metodológica y fuentes.

## 2. Decisiones claim

- VERIFICADO: **144**.
- VERIFICADO_SECUNDARIA_JUSTIFICADA: **18**.
- REQUIERE_CORRECCION: **2**.
- HISTORICO_CONSERVAR: **4**.

Comparabilidad:
- DIRECTA: **60**.
- LIMITADA: **50**.
- NO_DIRECTA: **13**.
- NO_APLICA: **45**.

Fuentes secundarias justificadas: **18 claims en 7 páginas**.  
Fuentes sustituidas: **0**.  
Fuente oficial adicional propuesta: **1** (OMS · Mental disorders para el claim de 72 millones de niños/adolescentes con ansiedad).

## 3. Resultado fichas

- VERIFICADA: **43**.
- EN_REVISIÓN: **5**.
- HISTÓRICA: **1**.
- SUSTITUIDA: **0**.

Una ficha solo queda VERIFICADA cuando todos sus claims relevantes pasan el gate y no existe una corrección de metadatos que cambie su interpretación.

### EN_REVISIÓN

- `autismo-diferencias-por-sexo-en-la-estimacion-mundial`: Corregir Población medida para abarcar varones, mujeres y el metaanálisis de razón por sexo.
- `brecha-de-empleo-asociada-a-discapacidad`: Hacer explícito 2025 como año de los datos del 24,2 pp; mantener 2026 como publicación.
- `discapacidad-significativa`: Cambiar Año de los datos de «estimación mundial vigente» a 2021; conservar que OMS la mantiene vigente en 2026.
- `educacion-y-discapacidad-infantil`: Corregir «las cuatro cifras» por «las cinco cifras» en Población medida.
- `trastornos-de-ansiedad`: Añadir la fuente OMS · Mental disorders para respaldar los 72 millones de niños y adolescentes.

### HISTÓRICA

- `trastorno-del-desarrollo-del-lenguaje-un-estudio-poblacional-de-referencia`: el 7,58 % de Norbury et al. (2016) se conserva deliberadamente como estudio poblacional de referencia; no se sustituye por el mero hecho de existir literatura posterior.

## 4. Derivados e incertidumbre

Los cuatro cálculos derivados publicados que requieren operación explícita conservan numerador, denominador y fórmula:
- cambio Australia 2018→2022;
- razón por sexo Canadá 2019;
- conversión ADDM 32,2/1.000 → 3,22 %;
- razón por sexo ADDM 2022.

Los intervalos de confianza/incertidumbre se conservan cuando la fuente los aporta y son relevantes. No se generó ningún porcentaje nuevo para publicación.

## 5. Changeset

`SABIK_DATOS_49_CHANGESET_V1.csv` contiene **6 operaciones** y **0 aplicadas**:
- corrección de población técnica en la ficha de diferencias por sexo en autismo;
- dos ajustes temporales para la brecha de empleo (año de datos y referencia temporal);
- año base 2021 para discapacidad significativa;
- «cuatro cifras» → «cinco cifras» en educación y discapacidad infantil;
- adición de fuente OMS para el claim de 72 millones en ansiedad.

## 6. Producción

No se modificó ninguna de las 49 páginas públicas.  
No se retiró `BORRADOR`.  
No se modificó build, renderer, sitemap o runtime.

**0 PRODUCCIÓN MODIFICADA · NO MERGE.**
