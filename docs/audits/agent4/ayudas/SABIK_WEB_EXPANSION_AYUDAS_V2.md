# SABIK_WEB_EXPANSION_AYUDAS_V2

**Agente:** n.º 4 · Actualización de información y recursos  
**Fecha de consulta:** 20/09/2026  
**Corpus:** España · 258 registros  
**Base conceptual:** `SABIK_WEB_CONTENT_AUDIT_V1 · FROZEN_ACCEPTED`  
**PR base congelado:** #179 · `4e03a9e41626ba7358ee862d89a8925b9a6299fb`  
**Fase:** C1 · Ayudas  
**Estado:** auditoría completa del corpus ES + propuesta. No hay batch público aplicado.

## 1. Resultado

Se ha realizado un barrido **258/258**.

- **258** registros revisados individualmente.
- **211** registros con estado distinto de `POR VERIFICAR`.
- **47** registros quedan `POR VERIFICAR` porque la fuente oficial no permite asignar con seguridad otro estado.
- **0** registros `ABIERTO` sin fecha de cierre verificable o sin fuente primaria.

`POR VERIFICAR` se utiliza como salida válida, no como fallo.

## 2. Estadísticas de estados

| Estado | Registros |
|---|---:|
| ABIERTO | 16 |
| CERRADO | 45 |
| PERMANENTE | 144 |
| PRÓXIMA CONVOCATORIA | 3 |
| HISTÓRICO | 3 |
| POR VERIFICAR | 47 |
| **TOTAL** | **258** |

## 3. Enlaces y fuentes

- **258/258** filas conservan una fuente oficial/primaria de administración u organismo gestor.
- **0** filas se han resuelto usando agregadores comerciales.
- **8** URLs tienen sustitución oficial propuesta con trazabilidad.
- **0** URLs se han clasificado como 404/410 confirmados.
- **13** URLs/rutas presentan otra incidencia: redirección, inestabilidad, portal genérico, ruta incorrecta o recuperación insuficiente.

Dominios oficiales más presentes en el corpus:


El registro conserva:
- URL anterior;
- resultado de comprobación;
- nueva URL oficial propuesta;
- fecha de consulta.

## 4. Qué significa cada estado

### ABIERTO
Plazo vigente comprobado en fuente oficial.

### CERRADO
La convocatoria terminó y no existe otra abierta que sustituya esa convocatoria concreta.

### PERMANENTE
El recurso/trámite no depende de convocatoria temporal ordinaria. Si tiene cuantías anuales, la cuantía se revisa sin convertir el recurso en convocatoria anual.

### PRÓXIMA CONVOCATORIA
Existe anuncio oficial de apertura futura o proceso derivado, sin plazo abierto todavía.

### HISTÓRICO
Recurso útil para trazabilidad pero que ya no debe mostrarse como oportunidad actual.

### POR VERIFICAR
La fuente es oficial, pero no permite justificar otro estado con suficiente precisión.

## 5. Fuentes temporales abiertas

Las 16 filas `ABIERTO` están documentadas en:
`SABIK_AYUDAS_ES_VERIFICATION_REGISTER_V1.csv`.

No hay ninguna fila `ABIERTO` sin cierre/fuente temporal.

## 6. Hallazgos de fiabilidad

### 6.1 Portales agregadores presentados como ayudas

Una parte importante de los 47 casos no carece de fuente: el problema es de **modelado**.

Ejemplos:
- portales autonómicos de vivienda;
- páginas generales de becas;
- programas con varias modalidades;
- ayudas de conciliación con varias líneas;
- comedor gestionado por entidades territoriales diferentes.

Propuesta: mantener el portal como recurso informativo y crear fichas distintas para convocatorias que tengan plazo propio.

### 6.2 Fechas absolutas corrigen etiquetas desactualizadas

Se han encontrado fuentes oficiales cuyo texto rastreado conserva etiquetas como “plazo abierto” aunque la fecha absoluta ya terminó.  
En esta auditoría prevalece la fecha absoluta comprobada.

### 6.3 Históricos que parecían actuales

Tres filas se clasifican `HISTÓRICO`:
- `mur-2500`;
- `mur-familias-especiales`;
- `mur-alquiler`.

### 6.4 Duplicidad

`mur-2500` y `mur-familias-especiales` apuntan al mismo procedimiento y convocatoria histórica. Deben fusionarse o diferenciarse con justificación real.

## 7. Cobertura territorial

La matriz completa está en:

`SABIK_AYUDAS_ES_COVERAGE_MATRIX_V1.csv`

Importante:
- `AUSENTE_EN_CORPUS` significa que Sabik no tiene una ficha explícita para ese dominio territorial;
- **no significa que la ayuda o servicio no exista**;
- la cobertura estatal puede compensar parcialmente huecos autonómicos.

### Territorios con más dominios ausentes en el corpus actual

| Territorio | Dominios ausentes | Dominios presentes solo POR VERIFICAR |
|---|---:|---:|
| Melilla | 12 | 0 |
| Región de Murcia | 11 | 0 |
| Castilla-La Mancha | 10 | 1 |
| Extremadura | 10 | 1 |
| Cantabria | 9 | 4 |
| Ceuta | 9 | 2 |
| Galicia | 9 | 0 |
| Castilla y León | 8 | 2 |
| La Rioja | 8 | 1 |
| País Vasco / Euskadi | 8 | 0 |
| Aragón | 7 | 2 |
| Asturias | 7 | 1 |
| Cataluña | 7 | 0 |
| Comunidad de Madrid | 7 | 2 |
| Andalucía | 6 | 2 |
| Comunitat Valenciana | 6 | 1 |
| Illes Balears | 5 | 1 |
| Canarias | 4 | 1 |
| Navarra | 4 | 4 |

### Dominios con mayor ausencia territorial

| Dominio | CCAA/ciudades sin ficha explícita | Solo POR VERIFICAR | Con evidencia |
|---|---:|---:|---:|
| empleo | 18 | 0 | 1 |
| fiscalidad | 18 | 0 | 1 |
| suministros | 18 | 0 | 1 |
| salud | 16 | 0 | 3 |
| accesibilidad | 16 | 0 | 3 |
| ayudas técnicas | 14 | 0 | 5 |
| universidad | 12 | 2 | 5 |
| conciliación | 9 | 2 | 8 |
| transporte | 8 | 3 | 8 |
| atención temprana | 5 | 1 | 13 |
| discapacidad | 4 | 0 | 15 |
| libros/material | 4 | 3 | 12 |
| ingresos/prestaciones | 2 | 1 | 16 |
| dependencia | 1 | 1 | 17 |
| vivienda | 1 | 9 | 9 |
| autonomía personal | 1 | 1 | 17 |
| educación | 0 | 2 | 17 |
| familia | 0 | 0 | 19 |

Los mayores huecos territoriales aparecen en:
- empleo;
- fiscalidad autonómica;
- suministros;
- salud;
- accesibilidad;
- ayudas técnicas.

Esto **no obliga** a crear una ficha por territorio. Obliga a investigar si existe un recurso relevante y útil que el corpus actual no representa.

## 8. Recursos potencialmente engañosos

Se han señalado **60** filas para revisión de claridad/modelado por al menos uno de estos motivos:
- `POR VERIFICAR`;
- portal agregador tratado como ayuda única;
- mezcla de varias convocatorias;
- fuente desactualizada;
- duplicidad;
- histórico con título que puede parecer vigente.

No significa que las 60 sean falsas. Significa que **no deben migrarse sin revisión**.

## 9. Nuevos recursos propuestos

Tras terminar el barrido se proponen **5** recursos nuevos, todos con fuente oficial y estado verificable:

1. **Castilla-La Mancha · Fomento de la Autonomía Personal (Centros de Día)** · Castilla-La Mancha · servicio · **PERMANENTE**  
   Fuente: https://bienestarsocial.castillalamancha.es/actuaciones/atencion-personas-con-discapacidad  
   Motivo: La fuente oficial describe centros de día y programas individualizados para fomentar autonomía personal y participación; es un servicio, no una subvención monetaria.

2. **Melilla · Bono-Taxi para personas con movilidad reducida** · Melilla · subvención · **PERMANENTE**  
   Fuente: https://sede.melilla.es/sta/Relec/CatalogDetail?action=make&dboidProcedure=6262601011903142907187&dboidRequest=6269001034948712607187&urlBack=https%3A%2F%2Fsede.melilla.es%2Fsta%2FCarpetaPublic%2FdoEvent%3FAPP_CODE%3DSTA%26PAGE_CODE%3DPTS2_HOME  
   Motivo: La Sede indica ‘Plazos de presentación: Permanente’; se dirige a personas físicas con graves dificultades de movilidad.

3. **Melilla · Ayudas técnicas para personas mayores, con discapacidad o dependencia** · Melilla · prestación · **PERMANENTE**  
   Fuente: https://sede.melilla.es/sta/Relec/CatalogDetail?action=make&dboidProcedure=6262601011903142907187&dboidRequest=6269001034946875907187&urlBack=NO  
   Motivo: La Sede indica ‘Plazos de presentación: Permanente’.

4. **Melilla · Adaptación funcional y acondicionamiento de vivienda** · Melilla · prestación · **PERMANENTE**  
   Fuente: https://sede.melilla.es/sta/CarpetaPublic/doEvent?APP_CODE=STA&DETALLE=6269001034739828307187&PAGE_CODE=CATALOGO  
   Motivo: La Sede indica ‘Plazos de presentación: Permanente’ para personas mayores con dependencia y/o discapacidad.

5. **Melilla · Ayudas para gastos de desplazamientos** · Melilla · prestación · **PERMANENTE**  
   Fuente: https://sede.melilla.es/sta/Relec/CatalogDetail?action=make&dboidProcedure=6262601011903142907187&dboidRequest=6269001034741070507187&urlBack=NO  
   Motivo: La Sede indica ‘Plazos de presentación: Permanente’; cubre desplazamientos vinculados a atención sanitaria fuera de la ciudad bajo requisitos.

## 10. Lenguaje claro para la incorporación posterior

La ficha pública no debe copiar el texto administrativo.

Debe responder:
- **Qué es**
- **Quién puede pedirlo**
- **Qué ofrece**
- **Dónde se solicita**
- **Hasta cuándo**
- **Qué necesitas**
- **Estado actual**

Y debe mantener:
- jurisdicción visible;
- fecha absoluta;
- enlace oficial;
- última revisión;
- próxima revisión;
- condiciones esenciales sin simplificación incorrecta.

## 11. Accesibilidad y privacidad

Esta fase no introduce formularios ni almacenamiento.

La estructura propuesta:
- usa estado textual;
- no depende de color;
- mantiene fechas cerca del estado;
- evita tooltips para requisitos esenciales;
- prepara el contenido para WCAG 2.2 AA, ISO/IEC 40500:2025, EN 301 549 V4.1.1 como objetivo técnico, ISO 24495-1:2023, ISO 9241-112:2025, COGA y RD 707/2026.

## 12. Artefactos

1. `SABIK_WEB_EXPANSION_AYUDAS_V2.md`
2. `SABIK_AYUDAS_ES_VERIFICATION_REGISTER_V1.csv`
3. `SABIK_AYUDAS_ES_COVERAGE_MATRIX_V1.csv`
4. `SABIK_AYUDAS_ES_CHANGESET_PROPOSAL_V1.md`

## 13. Qué NO se ha hecho

- No se han editado masivamente los 258 registros públicos.
- No se han presentado como revisadas las colecciones UK, BR, US o global.
- No se han introducido formularios.
- No se han corregido bugs frontend.
- No se han inventado plazos.
- No se han sustituido URLs sin conservar trazabilidad.

## 14. Siguiente decisión

Astra debe revisar:
1. estados y filas `POR VERIFICAR`;
2. divisiones de programas/convocatorias;
3. sustituciones de URLs;
4. históricos/duplicidades;
5. nuevos recursos propuestos.

Solo después debe autorizarse el batch de incorporación.

**NO MERGE.**
