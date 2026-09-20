# SABIK_AYUDAS_ES_CHANGESET_PROPOSAL_V1

**Agente:** n.º 4 · Ayudas  
**Fecha:** 20/09/2026  
**Base:** PR #179 congelado · `4e03a9e41626ba7358ee862d89a8925b9a6299fb`  
**Fase:** C1 · VERIFICAR → PROPONER → ASTRA REVISA  
**Estado:** propuesta; **no aplicada al directorio público**.

## 1. Regla de esta propuesta

No se propone un “batch ciego” de 258 reemplazos.

La incorporación deberá:
1. preservar el ID estable del programa/recurso cuando siga siendo el mismo;
2. separar programa estable y convocatoria temporal cuando hoy están mezclados;
3. conservar URL anterior y motivo de sustitución;
4. mostrar estado textual, no solo color;
5. ocultar de “abiertas ahora” cualquier fila `POR VERIFICAR`, `CERRADO` o `HISTÓRICO`;
6. no convertir portales agregadores en una falsa convocatoria única.

## 2. Estado resultante del corpus actual

| Estado | Registros |
|---|---:|
| ABIERTO | 16 |
| CERRADO | 45 |
| PERMANENTE | 144 |
| PRÓXIMA CONVOCATORIA | 3 |
| HISTÓRICO | 3 |
| POR VERIFICAR | 47 |
| **TOTAL** | **258** |

### Regla de gate comprobada

`0` registros `ABIERTO` carecen de cierre/fuente temporal.

Resultado: **ninguno**.

## 3. Convocatorias que hoy sí pueden mostrarse como abiertas

| ID | Jurisdicción | Recurso | Apertura | Cierre |
|---|---|---|---|---|
| `es-pnc-alquiler-2026` | España · Estatal | Complemento de PNC por vivienda alquilada 2026 | — | **31 de diciembre de 2026** |
| `fuerteventura-becas-estudios-isla-2026-27` | Canarias | Fuerteventura: becas para estudios oficiales en la isla 2026-2027 | 6 de agosto de 2026 | **25 de septiembre de 2026** |
| `cat-pua` | Cataluña | PUA · Prestación de atención social a personas con discapacidad | 25 de agosto de 2026 | **2 de octubre de 2026** |
| `cat-equitat-2627` | Cataluña | Becas Equidad 2026-2027 | 15 de septiembre de 2026 | **30 de octubre de 2026** |
| `val-libros` | Comunitat Valenciana | Banco de Libros 2026-2027 | — | **10 de noviembre de 2026** |
| `ext-03` | Extremadura | Ayudas de escolarización 0-3 2026-2027 | 7 de agosto de 2026 | **7 de octubre de 2026** |
| `gal-tarxeta-benvida-2026` | Galicia | Tarxeta Benvida · apoyo a la natalidad 2026 | 6 de febrero de 2026 | **31 de marzo de 2027** |
| `gal-bono-alquiler-social` | Galicia | Bono de alquiler social 2022-2026 | 1 de junio de 2022 | **30 de noviembre de 2026** |
| `nav-protesis` | Navarra | Ayudas para gafas, audífonos y ortodoncia | 18 de marzo de 2026 | **15 de octubre de 2026** |
| `nav-concilia-mono-2026` | Navarra | Ayuda 2026 de conciliación para familias monoparentales | 18 de marzo de 2026 | **2 de noviembre de 2026** |
| `pv-becas` | País Vasco / Euskadi | Becas no universitarias 2026-2027 | 27 de julio de 2026 | **30 de septiembre de 2026** |
| `eus-gaztelagun` | País Vasco / Euskadi | Gaztelagun · ayuda al alquiler para jóvenes | 6 de junio de 2026 | **31 de diciembre de 2026** |
| `eus-emantzipa` | País Vasco / Euskadi | Programa Emantzipa para emancipación juvenil | 12 de mayo de 2026 | **30 de noviembre de 2026** |
| `rio-bono-joven` | La Rioja | Ayuda joven al alquiler | 2 de junio de 2026 | **30 de abril de 2027** |
| `mel-eso` | Melilla | Ayuda 2026-2027 para libros, material y transporte en ESO | 25 de agosto de 2026 | **25 de septiembre de 2026** |
| `mel-master-2026` | Melilla | Becas 2026 para estudios de máster | 26 de agosto de 2026 | **22 de septiembre de 2026** |

## 4. Sustituciones de URL propuestas

No se sustituye silenciosamente. El registro conserva la URL anterior.

| ID | URL anterior | Nueva URL oficial propuesta | Motivo |
|---|---|---|---|
| `mallorca-ayudas-discapacidad-2026` | https://www.conselldemallorca.es/es/todas-las-noticias/-/asset_publisher/bqOupoVYvgPA/content/l-imas-inicia-la-tramitaci%C3%B3-de-560-sol%C2%B7licituds-d-ajudes-per-refor%C3%A7ar-el-benestar-de-les-persones-amb-discapacitat/695139 | https://bca.conselldemallorca.es/es/web/www/todas-las-noticias/-/asset_publisher/bqOupoVYvgPA/content/l-imas-inicia-la-tramitaci%C3%B3-de-560-sol%C2%B7licituds-d-ajudes-per-refor%C3%A7ar-el-benestar-de-les-persones-amb-discapacitat/695139 | URL original inestable; noticia institucional confirma plazo finalizado antes del 16/05/2026 |
| `bal-dependencia` | https://www.caib.es/sites/dgdependencia/es/solicitud_reconocimiento_del_derecho_a_las_prestaciones_y_servicios_de_dependencia/ | https://www.caib.es/seucaib/es/200/persones/tramites/tramite/1199162/ | REDIRIGE · CAIB a nueva ficha de Sede Electrónica |
| `bal-alimentacion` | https://apps.caib.es/sites/serveidecomunitateducativa/ca/ajuts_alimentacia_20262027/ | https://www.caib.es/seucaib/ca/200/persones%20/tramites/tramite/5715355 | OK · Sede CAIB; trámite Tancat |
| `bal-comedor` | https://www.caib.es/sites/serveidecomunitateducativa/ca/ajuts_menjador_26-27/ | https://www.caib.es/seucaib/ca/tramites/tramite/5715400 | OK · Sede CAIB; trámite Tancat |
| `fuerteventura-neae-2026` | https://transparencia.cabildofuer.es/es/importe-objetivo-o-finalidad-descripcion-de-las-posibles-personas-beneficiarias-y-en-el-caso-de-las?field_date_value%5Bmax%5D=&field_date_value%5Bmin%5D=&field_name_value=&items_per_page=5&name=&order=field_date&page=2&sort=desc | https://www.cabildofuer.es/cabildo/%EF%BB%BFel-cabildo-de-fuerteventura-abre-la-convocatoria-de-becas-para-alumnado-con-necesidades-especiales/ | OK · Cabildo/Sede; convocatoria 2026 cerrada |
| `la-palma-becas-estudio-2025-26` | https://www.cabildodelapalma.es/es/el-cabildo-destina-875000-euros-las-becas-al-estudio-del-curso-20252026 | https://sedeelectronica.cabildodelapalma.es/sta/Relec/CatalogDetail?action=info&dboidProcedure=6262600042560866407769&dboidRequest=6269000042562783407769 | OK · Cabildo/Sede La Palma; convocatoria 2025-2026 cerrada |
| `can-universidad-becas` | https://www.gobiernodecanarias.org/universidades/becas_ayudas/becas-gobierno-canarias/estudios-universitarios/ | https://www.gobiernodecanarias.org/universidades/becas_ayudas/becas-gobierno-canarias/estudios-universitarios/curso_2026-2027/index.html | REDIRIGE a ficha 2026-2027; plazo finalizado |
| `mel-alquiler-2026` | https://www.melilla.es/melillaportal/contenedor.jsp?codMenu=514&codMenuPN=602&codResi=1&contenido=31005&language=es&nivel=1400&seccion=s_fdoc_d4_v1.jsp&tipo=5 | https://sede.melilla.es/sta/CarpetaPublic/doEvent?APP_CODE=STA&DETALLE=6269001144366697007187&PAGE_CODE=CATALOGO | OK · Sede Melilla; convocatoria 2026 cerrada |

**URLs con sustitución explícita propuesta:** 8.  
**404/410 confirmados:** 0.  
**URLs con incidencia, redirección, ruta genérica o recuperación insuficiente:** 13.

## 5. Cambios de modelado prioritarios

### Separar programa estable de convocatoria

Proponer desagregación, entre otros, para:
- `and-alquiler`;
- `and-infantil-03`;
- `ara-temprana-espera`;
- `ara-vivienda-ayudas`;
- `bal-alquiler`;
- `bal-conciliacion`;
- `can-becas-educacion`;
- `can-libros`;
- `cant-vivienda-protegida`;
- `clm-becas-ayudas`;
- `clm-prestaciones-sociales`;
- `cyl-vivienda`;
- `cyl-conciliacion`;
- `cat-comedor`;
- `cat-alquiler-2026`;
- `val-vivienda`;
- `ext-becas`;
- `ext-vivienda`;
- `nav-vivienda`;
- `nav-universidad`;
- `pv-conciliacion`;
- `rio-alquiler`;
- `rio-universidad`.

### Duplicidades / históricos a resolver

- `mur-2500` y `mur-familias-especiales`: apuntan al mismo procedimiento 2792 y a la convocatoria 2025. Propuesta: una única ficha histórica hasta que exista nueva convocatoria.
- `mur-alquiler`: la URL actual corresponde a una convocatoria antigua 2021/2022. Propuesta: mantener histórico y crear ficha nueva solo cuando se verifique la convocatoria vigente correspondiente.
- `gipuzkoa-irpf-discapacidad`: fuente oficial, pero documento enlazado de **Renta 2024**. Propuesta: no publicar cuantías actuales hasta sustituir por fuente del ejercicio vigente.

## 6. Recursos nuevos propuestos tras el barrido 258/258

Todos se han comprobado con fuente primaria y el mismo criterio de estado.

| ID propuesto | Jurisdicción | Recurso | Tipo | Estado | Fuente |
|---|---|---|---|---|---|
| `propuesta-clm-autonomia-personal-centros-dia` | Castilla-La Mancha | Castilla-La Mancha · Fomento de la Autonomía Personal (Centros de Día) | servicio | **PERMANENTE** | https://bienestarsocial.castillalamancha.es/actuaciones/atencion-personas-con-discapacidad |
| `propuesta-mel-bono-taxi` | Melilla | Melilla · Bono-Taxi para personas con movilidad reducida | subvención | **PERMANENTE** | https://sede.melilla.es/sta/Relec/CatalogDetail?action=make&dboidProcedure=6262601011903142907187&dboidRequest=6269001034948712607187&urlBack=https%3A%2F%2Fsede.melilla.es%2Fsta%2FCarpetaPublic%2FdoEvent%3FAPP_CODE%3DSTA%26PAGE_CODE%3DPTS2_HOME |
| `propuesta-mel-ayudas-tecnicas` | Melilla | Melilla · Ayudas técnicas para personas mayores, con discapacidad o dependencia | prestación | **PERMANENTE** | https://sede.melilla.es/sta/Relec/CatalogDetail?action=make&dboidProcedure=6262601011903142907187&dboidRequest=6269001034946875907187&urlBack=NO |
| `propuesta-mel-adaptacion-vivienda` | Melilla | Melilla · Adaptación funcional y acondicionamiento de vivienda | prestación | **PERMANENTE** | https://sede.melilla.es/sta/CarpetaPublic/doEvent?APP_CODE=STA&DETALLE=6269001034739828307187&PAGE_CODE=CATALOGO |
| `propuesta-mel-desplazamientos` | Melilla | Melilla · Ayudas para gastos de desplazamientos | prestación | **PERMANENTE** | https://sede.melilla.es/sta/Relec/CatalogDetail?action=make&dboidProcedure=6262601011903142907187&dboidRequest=6269001034741070507187&urlBack=NO |

**Nuevos recursos propuestos:** 5.  
No se incorporan en esta PR antes de revisión Astra.

## 7. Cambios de interfaz/contenido propuestos, no implementados

Cada tarjeta/ficha deberá responder, en este orden:

1. **Estado actual**
2. **Hasta cuándo**
3. **Qué es**
4. **Quién puede pedirlo**
5. **Qué ofrece**
6. **Qué necesitas**
7. **Dónde se solicita**
8. **Fuente oficial**
9. **Revisado el**
10. **Próxima revisión**

Estados permitidos:
`ABIERTO · CERRADO · PERMANENTE · PRÓXIMA CONVOCATORIA · HISTÓRICO · POR VERIFICAR`.

No mostrar “te corresponde”. Usar “puede ser relevante si cumples…” o una formulación equivalente y verificable.

## 8. Privacidad

No añadir formularios.  
No pedir diagnóstico, ingresos, grado de discapacidad, localidad ni situación familiar para filtrar el directorio.

Los filtros propuestos se calculan sobre metadatos del recurso, no sobre un perfil almacenado del usuario.

## 9. NO MERGE / NO BATCH

Esta propuesta no autoriza la incorporación masiva al dataset público.

**Siguiente paso:** revisión de Astra del registro, matriz y propuesta de cambios.
