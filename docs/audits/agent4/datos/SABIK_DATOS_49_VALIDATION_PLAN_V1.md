# SABIK_DATOS_49_VALIDATION_PLAN_V1

**Agente:** n.º 4  
**Fecha:** 20/09/2026  
**Área:** Datos  
**Ruta auditada:** `/es/datos/`  
**Base contractual:** `52380c9a862c7184e6ff56507123063df3c30601`  
**Estado:** inicio de validación sustantiva 49/49. **NO PRODUCCIÓN · NO MERGE.**

## 1. Separación de líneas

Ayudas C1 queda congelada con estado:

`SABIK_AYUDAS_ES_C1_CONTENT_FROZEN`

No se modifica:
- el corpus de 258 filas;
- `SABIK_AYUDAS_ES_CANDIDATE_DATASET_V1.json`;
- las ocho URL propuestas;
- los cinco recursos nuevos;
- renderer, loader, filtros o producción de Ayudas;
- PR #185.

Este frente usa el HEAD congelado únicamente como base contractual.

## 2. Objeto de Datos 49/49

La auditoría V1 ya confirmó:
- 49/49 rutas existentes;
- 49/49 con Fuentes;
- 49/49 con Población medida;
- 49/49 con Año de los datos;
- 49/49 con Referencia temporal;
- 49/49 con Método;
- 49/49 con Publicación;
- 49/49 con Revisión prevista.

La fase actual no reescribe masivamente la sección. Cierra la verificación sustantiva.

## 3. Gate por ficha

Cada una de las 49 fichas debe registrar como mínimo:

- id / ruta;
- afirmación o cifra principal;
- población medida;
- territorio;
- año de los datos;
- método;
- fuente primaria o justificación de fuente secundaria;
- URL/DOI;
- fecha de publicación;
- fecha de consulta;
- estado de la fuente;
- coincidencia entre fuente y web;
- incertidumbre / limitaciones de comparabilidad;
- corrección necesaria, si existe;
- próxima revisión;
- gatillo de revisión;
- decisión propuesta: VERIFICADA / EN_REVISIÓN / HISTÓRICA / SUSTITUIDA.

## 4. Reglas

- Priorizar organismo responsable o publicación científica original.
- No confundir año de publicación con año de los datos.
- No mezclar prevalencia estimada, prevalencia diagnosticada, registros administrativos o encuestas como si midieran lo mismo.
- No atribuir causalidad a evidencia observacional.
- Conservar cifras históricas útiles cuando proceda, identificándolas como históricas.
- No crear cifras para rellenar huecos.
- No retirar el estado editorial de borrador hasta superar el gate.
- Toda corrección debe ser trazable a fuente.

## 5. Salidas previstas

- `SABIK_DATOS_49_VERIFICATION_REGISTER_V1.csv`
- `SABIK_DATOS_49_VALIDATION_REPORT_V1.md`
- changeset explícito para las fichas que necesiten corrección;
- resumen de fuentes nuevas/sustituidas;
- conteo final VERIFICADA / EN_REVISIÓN / HISTÓRICA / SUSTITUIDA.

## 6. Producción

La primera etapa es verificación y registro.  
No se publica ninguna corrección de contenido hasta que el changeset sea revisable.

**DRAFT · NO MERGE.**
