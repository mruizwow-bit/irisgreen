# SABIK_WEB_CONTENT_EXPANSION_AUDIT_V1

**Agente:** n.º 4 · Web · Información, recursos y conformidad  
**Coordinación:** Astra  
**Fecha de revisión:** 20/09/2026  
**Repositorio auditado:** `mruizwow-bit/irisgreen`  
**Rama de trabajo:** `agent4/sabik-web-content-expansion-audit-v1`  
**Estado:** AUDIT V1 · base de trabajo · no equivale a aprobación de gate

---

## 0. ALCANCE Y REGLAS DE ESTE AUDIT

Este documento inicia el inventario exigido por Astra para ampliar y mantener la web como contenido vivo.

Regla de estado:

`REVISADO → FALTA → INVESTIGADO → PROPUESTO → APROBADO → INCORPORADO → REVISAR DE NUEVO`

Este audit separa:

- **hecho verificado**;
- **riesgo o laguna detectada**;
- **requisito técnico adoptado por el proyecto**;
- **obligación jurídica potencial o confirmada**;
- **pendiente de determinar por ámbito de aplicación**.

No se afirma conformidad legal, WCAG, ISO, EN, PDF/UA, Lectura Fácil ni certificación de IA sin evidencia de evaluación real.

---

## 1. IDENTIDAD VERBAL OFICIAL

Texto oficial de Sabik:

**SABIK**

**CLARIDAD INTELIGENTE.**

**Una IA que adapta la información para que sea más fácil de entender y usar.**

### Comprobación inicial del repositorio

Búsqueda realizada en el repositorio principal:

- `INTELIGENCIA QUE AYUDA`: **0 coincidencias localizadas por la búsqueda de código disponible**.
- `Claridad inteligente`: **0 coincidencias**.
- `SABIK`: **0 coincidencias**.
- `Una IA que adapta la información`: **0 coincidencias**.

**Interpretación:** el claim antiguo no aparece en la fuente principal consultada, pero el nuevo sistema verbal de Sabik tampoco está incorporado todavía en esa fuente. No se marca como “resuelto”; se marca como **migración de identidad pendiente**.

**P1:** repetir la búsqueda antes del cierre en ramas activas, activos visuales, documentos, metadatos, imágenes con texto, PDFs, contenido generado y cualquier repositorio adicional de Sabik que Astra declare fuente de verdad.

---

## 2. INVENTARIO GENERAL DE PESTAÑAS Y ÁREAS

### Navegación principal detectada

1. Inicio
2. Condiciones
3. Situaciones
4. Vida diaria
5. Vídeos
6. Investigación
7. Datos
8. Ayudas
9. Libros
10. Jugar
11. Tus intereses
12. El taller
13. Rincón tranquilo

### Páginas transversales detectadas

- Sobre Iris Green
- Metodología
- Privacidad
- Lectura accesible
- Cuestionarios orientativos
- Mapa / temas de neurodiversidad
- páginas individuales de Condiciones
- páginas individuales de Situaciones
- páginas individuales de Datos
- páginas individuales de Vida diaria
- subrecursos de Juegos, Intereses y Taller

### Estado cuantitativo inicial

| Área | Evidencia actual | Estado inicial |
|---|---:|---|
| Condiciones | 185 entradas enlazadas desde el índice | Muy amplia; revisar taxonomía, fuente, vigencia y consistencia |
| Situaciones | 187 entradas enlazadas desde el índice | Muy amplia; revisar cobertura y consistencia |
| Vida diaria | 48 fichas enlazadas | Pipeline editorial específico: la fuente, staging y dist usan estados distintos; auditar el artefacto final |
| Investigación | 120 publicaciones descritas | Muy amplia; necesita mantenimiento, filtros y protocolo de actualización |
| Datos | 49 páginas indicadas por el propio índice | El índice declara todas en borrador |
| Ayudas | snapshot ES con 258 registros; metadatos de otros países/ámbitos | Alto valor; exige control de caducidad y jurisdicción |
| Juegos | JSON declara 130 juegos | Requiere auditoría de accesibilidad de interacción y descargables |
| Vídeos | listado estático de respaldo con 48 vídeos | Requiere inventario de subtítulos, transcripciones y alternativas |
| Tus intereses | 100+ encabezados de contenidos / colecciones | Recurso extenso; revisar texto alternativo, descarga e impresión |
| El taller | 80+ actividades/encabezados | Recurso extenso; revisar instrucciones, secuencias y materiales |
| Rincón tranquilo | mirar, escuchar, pausa guiada | Revisar alternativas sensoriales y control del usuario |
| Cuestionarios | AQ-10, CAT-Q-ES, ASRS; RAADS-R no publicado | Revisar validez, licencias, privacidad y redacción de resultados |

---

## 3. LAGUNAS Y HALLAZGOS ESTRUCTURALES

### 3.1 Condiciones

El índice mezcla categorías distintas:

- contexto: 48;
- experiencia: 37;
- diagnóstico: 31;
- identidad: 26;
- desarrollo: 15;
- proceso: 11;
- emergente: 6;
- apoyo: 5;
- salud física: 5;
- controvertido: 1.

**Riesgo:** la etiqueta “Condiciones” contiene diagnósticos, contextos, identidades, apoyos y experiencias. El contenido puede ser válido, pero la arquitectura puede inducir a interpretar todas las entradas como condiciones clínicas.

**P1:** proponer una taxonomía visible que mantenga las fichas pero separe claramente:
- diagnósticos o condiciones;
- procesos / rasgos;
- experiencias;
- contextos;
- apoyos;
- salud física;
- identidades;
- conceptos emergentes o controvertidos.

### 3.2 Sitemap y descubrimiento · diagnóstico corregido tras revisar el build

El `sitemap.xml` almacenado en la fuente no debe tratarse como artefacto final.

`scripts/repair_routes.py` regenera `sitemap.xml` y `sitemap-1.xml` durante el build de staging a partir de las páginas indexables.

El snapshot fuente consultado no contiene siete rutas enlazadas por Condiciones (ARFID, autismo, dislexia, trastorno del desarrollo de la coordinación/dispraxia, perfil PDA, sueño y TDAH), pero las fichas comprobadas conservan `index,follow` y canonical individual.

**Conclusión:** no se registra como fallo de producción sin revisar `dist`.

**P1:** después de un build actual, comprobar el sitemap generado, canonical y recuentos. No editar a mano el sitemap fuente si el generador es la fuente canónica.

### 3.3 Vida diaria · fuente, staging y salida pública

La fuente contiene 48 tarjetas con “BORRADOR”, mientras que 48/48 fichas individuales contienen “Estado: publicada” y “Validación: 10 de septiembre de 2026”.

Tras revisar el pipeline se confirma que esta divergencia es deliberada:

1. `scripts/publish_biblioteca.py` publica y valida las 48 fichas en staging y actualiza la portada.
2. `scripts/repair_routes.py` regenera el sitemap.
3. `validate_publication_statuses.py`, `finalize_validation_labels.py` y `strip_daily_public_status.py` retiran los estados editoriales de la salida pública `dist`.

**Conclusión:** no se trata como contradicción visible en producción.

**P1:** auditar `dist` después del build y mantener fecha/estado de revisión en gobernanza interna, sin depender de rótulos públicos. No editar manualmente el resultado que ya controla el pipeline.

### 3.4 Datos

El propio índice declara:

> 49 páginas montadas; todas en borrador; la fuente está nombrada y enlazada; la comprobación final sigue pendiente.

**P0:** no presentar esta sección como una base estadística final hasta completar comprobación individual de las 49 fichas.

### 3.5 Ayudas

La página integra un snapshot español de **258 registros**. Sus metadatos también indican colecciones de:
- Reino Unido: 234;
- Brasil: 148;
- Estados Unidos: 362;
- mundo: 1423.

Estos recuentos no equivalen a una auditoría de contenido de cada jurisdicción.

**P0:** cada registro sensible al tiempo debe tener:
- fecha de consulta;
- vigencia;
- fecha de apertura/cierre;
- jurisdicción;
- “abierto / cerrado / permanente / pendiente de nueva convocatoria”;
- próxima revisión.

### 3.6 Cuestionarios

Fortaleza actual:
- avisa que orientan y no diagnostican;
- calcula localmente según el texto de la página;
- no publica RAADS-R sin adaptación española documentada;
- diferencia licencias y versiones.

Pendientes:
- comprobar de nuevo licencia y versión exacta antes de incorporar ítems;
- no convertir umbrales en diagnóstico;
- mantener separación entre orientación y evaluación profesional;
- revisar accesibilidad de formularios, errores y resultados;
- revisar tratamiento de cualquier dato si en el futuro deja de ser local.

---

## 4. COBERTURA POR ETAPAS DE LA VIDA

La web ya contiene materiales de infancia, adolescencia, universidad, empleo, vida adulta, maternidad/paternidad y envejecimiento.

**Lagunas que deben comprobarse sistemáticamente en cada tema:**

- transición a la vida adulta;
- formación profesional;
- universidad y abandono;
- empleo y desempleo;
- maternidad/paternidad;
- relaciones;
- vivienda;
- vida independiente con apoyos;
- envejecimiento;
- duelo;
- atención sanitaria continuada;
- salud sexual y reproductiva;
- planificación de apoyos a largo plazo.

**P1:** crear una matriz tema × etapa de vida para evitar que una web muy extensa siga teniendo huecos invisibles.

---

## 5. CONTEXTOS REALES

Contextos ya cubiertos en mayor o menor grado:

- hogar;
- escuela/instituto;
- universidad;
- trabajo;
- sanidad;
- ocio;
- transporte;
- compras;
- relaciones;
- internet;
- trámites.

**P1:** comprobar de forma específica:
- vivienda y convivencia;
- emergencias;
- policía / justicia;
- administración electrónica;
- viajes;
- cambios de residencia;
- pérdida de apoyos;
- cuidados de larga duración;
- situaciones de violencia o abuso;
- barreras de acceso digital.

---

## 6. RECURSOS · ESPAÑA, UE E INTERNACIONALES

Regla editorial adoptada:

1. legislación y organismos oficiales;
2. organismos internacionales;
3. sanidad pública;
4. universidades;
5. literatura científica revisada por pares;
6. organizaciones profesionales;
7. asociaciones reconocidas;
8. otras fuentes de calidad solo cuando aporten algo no cubierto arriba.

### España

La sección Ayudas ya enlaza recursos estatales y autonómicos: IMSERSO, Seguridad Social, SEPE, Ministerio de Educación y administraciones territoriales.

**P0:** registrar caducidad por convocatoria.  
Ejemplo confirmado en el dataset:
- “Ayudas NEAE 2026-2027”
- plazo almacenado: 19/05/2026–10/09/2026.

A fecha 20/09/2026 ese plazo está cerrado. La ficha puede mantenerse como referencia, pero debe señalarlo de forma inequívoca.

---

## 7. PRIORIDADES P0–P3

### P0 · CRÍTICO

1. Verificar el artefacto final de Vida diaria y su registro interno de revisión; no confundir estados de fuente con salida pública.
2. Completar verificación final de las 49 fichas de Datos antes de presentarlas como definitivas.
3. Implementar control de caducidad/apertura/cierre en Ayudas.
4. Marcar convocatorias ya cerradas, empezando por NEAE 2026-2027.
5. Preparar cumplimiento de transparencia IA y accesibilidad cognitiva.
6. Determinar ámbito legal real de Sabik antes de publicar afirmaciones de cumplimiento.
7. Inventariar recursos descargables y multimedia que carezcan de alternativa accesible.
8. No etiquetar como “Lectura Fácil” contenido que no haya seguido el proceso correspondiente.

### P1 · ALTA

1. Taxonomía de Condiciones.
2. Corregir sitemap de Condiciones.
3. Verificar en el sitemap generado por build las páginas indexables de Vida diaria y Condiciones; no editar el sitemap generado a mano.
4. Crear página de transparencia IA.
5. Crear registro de fuente/vigencia por dato y recurso.
6. Inventario completo de PDFs/documentos y estado PDF/UA.
7. Inventario de subtítulos, transcripciones y audiodescripción.
8. Matriz de privacidad por interacción.
9. Preparar la web para RD 707/2026 antes del 02/01/2027.

### P2 · MEDIA

1. Matriz tema × etapa vital.
2. Matriz tema × contexto real.
3. Mejorar filtros de Investigación y Datos.
4. Añadir resúmenes cortos antes de explicaciones extensas donde mejoren comprensión.
5. Ampliar recursos para adultos, empleo, vivienda, envejecimiento y transiciones.

### P3 · COMPLEMENTARIA

1. Nuevas herramientas imprimibles una vez auditadas.
2. Ampliación internacional por jurisdicción.
3. Recursos adicionales de asociaciones cuando cubran huecos no resueltos por fuentes primarias.

---

## 8. ORDEN RECOMENDADO DE AMPLIACIÓN

1. **Conformidad transversal**: identidad, accesibilidad, IA, privacidad, fuentes.
2. **Ayudas**: vigencia y caducidad.
3. **Datos**: validación de 49 fichas.
4. **Vida diaria**: estados, fuentes, sitemap y España.
5. **Condiciones**: taxonomía y fichas de mayor impacto.
6. **Situaciones**: consistencia y apoyos.
7. **Cuestionarios**: licencias, privacidad, WCAG formularios.
8. **Vídeos / multimedia**.
9. **Juegos / Taller / Intereses**.
10. **Investigación**.
11. **Libros / descargables**.
12. **Rincón tranquilo**.
13. **idiomas y equivalencia de cobertura**.

---

## 9. FUENTES PRINCIPALES PROPUESTAS

- BOE / legislación consolidada.
- EUR-Lex.
- Comisión Europea / Digital Strategy.
- ETSI / CEN / CENELEC.
- W3C WAI.
- ISO.
- UNE.
- ONCE / Comisión Braille Española.
- OMS, Comisión Europea, ministerios y servicios públicos.
- NICE y otras guías públicas cuando el tema lo requiera.
- PubMed / publicaciones revisadas por pares.
- universidades y organismos profesionales.

---

## 10. ESTADO DE IDIOMAS

El sitemap auditado contiene aproximadamente:

- raíz: 1;
- español: 413 URLs;
- inglés: 371 URLs;
- portugués de Brasil: 0 URLs en sitemap.

La navegación muestra botones y etiquetas PT en parte de la interfaz, pero el sitemap no refleja una colección pt-BR equivalente.

**P1:** no presentar paridad lingüística hasta medirla por página y funcionalidad.

---

## 11. PREGUNTAS REALES QUE DEBE RESPONDER CADA ÁREA

Control editorial:

- ¿Qué es?
- ¿Qué significa en la vida diaria?
- ¿Qué señales o situaciones pueden aparecer?
- ¿Qué diferencias hay entre personas?
- ¿Qué puede ayudar?
- ¿Qué puede empeorarlo?
- ¿Cuándo buscar apoyo?
- ¿Dónde encontrar ayuda?
- ¿Qué cambia por edad, contexto o jurisdicción?
- ¿Qué sabe la evidencia y qué no permite concluir?

No todos estos puntos deben ser encabezados visibles. Se usan como control de lagunas.

---

## 12. REGLA DE ESCRITURA CLARA

Todo contenido nuevo debe superar estas cuatro preguntas:

1. ¿La persona encuentra lo que necesita?
2. ¿Lo entiende?
3. ¿Sabe qué hacer con esa información?
4. ¿Puede usarla sin depender de una explicación adicional?

Aplicación:
- palabras habituales;
- frases directas;
- información principal primero;
- una idea central por frase cuando sea razonable;
- títulos descriptivos;
- párrafos cortos;
- pasos ordenados;
- ejemplos concretos;
- términos técnicos definidos.

**No infantilizar.**

---

# 13. MATRIZ DE NORMATIVA Y ESTÁNDARES

| Referencia | Estado comprobado 20/09/2026 | Uso en Sabik | Estado de aplicabilidad |
|---|---|---|---|
| WCAG 2.2 AA | Recomendación W3C vigente | Base mínima web | Objetivo obligatorio de proyecto |
| ISO/IEC 40500:2025 | Publicada; adopta WCAG 2.2 | Referencia internacional WCAG | Objetivo de proyecto |
| EN 301 549 V4.1.1 (2026-09) | Publicada por ETSI/CEN/CENELEC | Objetivo técnico europeo actual | **Todavía no citada en DOUE como referencia legal armonizada** |
| EN 301 549 V3.2.1 (2021-03) | Sigue siendo referencia jurídica armonizada mientras V4.1.1 no sea citada | Comparación legal transitoria | Vigente para presunción donde corresponda |
| ISO 24495-1:2023 | Publicada | Lenguaje claro | Objetivo editorial |
| ISO 9241-171:2025 | Publicada | Accesibilidad de software | Objetivo de diseño/desarrollo |
| ISO 9241-210:2019 | Vigente; confirmada en 2025 | Diseño centrado en las personas | Objetivo de proceso |
| ISO 9241-11:2018 | Vigente | Usabilidad | Objetivo de evaluación |
| ISO 9241-112:2025 | Publicada | Presentación de información | Objetivo de interfaz/contenido |
| W3C COGA | Guía suplementaria, no requisito WCAG | Capa adicional cognitiva | Adoptada por proyecto |
| UNE 153101:2018 EX | Norma experimental de Lectura Fácil | Solo cuando se publique Lectura Fácil formal | Aplicar proceso de creación/adaptación/validación |
| ISO 14289-2:2024 PDF/UA-2 | Publicada | PDFs nuevos | Objetivo de proyecto |
| Directiva (UE) 2019/882 | En vigor; aplicación desde 28/06/2025 a categorías cubiertas | Matriz legal EAA | **Determinar ámbito exacto de Sabik** |
| Ley 11/2023 | Transposición española de EAA | Productos/servicios cubiertos | **Determinar ámbito exacto** |
| RD 193/2023 | Vigente | Bienes/servicios a disposición del público | Revisar aplicación concreta |
| RD 1112/2018 | Vigente | Sector público; además, la disposición adicional primera ordena a las Administraciones Públicas exigir los criterios de los arts. 5 y 6 en los supuestos que enumera | La financiación pública no convierte automáticamente una web privada en «sector público». **APLICABILIDAD CONCRETA → POR DETERMINAR** |
| **RD 707/2026** | Publicado 03/09/2026; entra en vigor 02/01/2027 | Accesibilidad cognitiva; incluye sociedad de la información | **P0: determinar encaje de Sabik como prestador en España y preparar cumplimiento** |
| Reglamento (UE) 2024/1689, art. 50 | Transparencia aplicable desde 02/08/2026 | Interacción IA y contenido sintético | Revisar rol proveedor/implementador |
| RGPD 2016/679 | Vigente | Datos personales y categorías especiales | Aplicable cuando exista tratamiento |
| LOPDGDD 3/2018 | Consolidada; actualización 27/12/2025 | Complemento nacional RGPD | Aplicable cuando exista tratamiento |
| ISO/IEC 42001:2023 | Publicada | Gobernanza AIMS | Referencia; **no afirmar certificación** |
| ISO/IEC 23894:2023 | Publicada | Riesgo IA | Referencia de proyecto |
| ISO/IEC 42005:2025 | Publicada | Evaluación de impacto IA | Referencia de proyecto |

### Fuentes normativas verificadas

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- ISO/IEC 40500:2025: https://www.iso.org/standard/91029.html
- EN 301 549 V4.1.1: https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf
- AccessibleEU sobre estado de V4.1.1: https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en
- ISO 24495-1:2023: https://www.iso.org/standard/78907.html
- ISO 9241-171:2025: https://www.iso.org/standard/86308.html
- ISO 9241-210:2019: https://www.iso.org/standard/77520.html
- ISO 9241-11:2018: https://www.iso.org/standard/63500.html
- ISO 9241-112:2025: https://www.iso.org/standard/87518.html
- W3C COGA: https://www.w3.org/WAI/cognitive/
- UNE 153101:2018 EX: https://www.une.org/la-asociacion/sala-de-informacion-une/noticias/primera-norma-mundial-de-lectura-facil
- PDF/UA-2: https://www.iso.org/standard/82278.html
- Directiva (UE) 2019/882: https://eur-lex.europa.eu/eli/dir/2019/882/oj
- Ley 11/2023: https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022
- RD 193/2023: https://www.boe.es/buscar/act.php?id=BOE-A-2023-7417
- RD 1112/2018: https://www.boe.es/buscar/act.php?id=BOE-A-2018-12699
- RD 707/2026: https://www.boe.es/buscar/doc.php?id=BOE-A-2026-18509
- Reglamento de IA: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Guías art. 50 Comisión Europea: https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems
- RGPD: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- LOPDGDD: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673
- ISO/IEC 42001:2023: https://www.iso.org/standard/81230.html
- ISO/IEC 23894:2023: https://www.iso.org/standard/77304.html
- ISO/IEC 42005:2025: https://www.iso.org/standard/42005

---

# 14. MATRIZ DE ACCESIBILIDAD POR PESTAÑA

Leyenda:
- **R** = revisar;
- **A** = ampliar;
- **P0/P1** = prioridad.

| Pestaña | Contenido | Estructura/semántica | Formularios/interacción | Multimedia | Cognitiva/COGA | Prioridad |
|---|---|---|---|---|---|---|
| Inicio | R | R | buscador/quiz/guardados R | vídeos R | A | P1 |
| Condiciones | R | R taxonomía | filtros R | — | A | P1 |
| Situaciones | R | R | filtros R | — | A | P1 |
| Vida diaria | R estados | R | búsqueda/filtros R | — | A pasos | P0/P1 |
| Vídeos | R fuentes | R | reproductor R | **subtítulos/transcripción/audiodescripción** | A | P0/P1 |
| Investigación | R vigencia | R | búsqueda/filtros R | — | A resúmenes | P1 |
| Datos | **validación pendiente** | R | filtros R | gráficos/si aparecen | A | P0 |
| Ayudas | **caducidad** | R | filtros R | — | A pasos | P0 |
| Libros | R | R | enlaces/compra R | imágenes R | A | P2 |
| Jugar | R | R | **teclado, foco, alternativas** | imágenes R | A | P1 |
| Tus intereses | R | R | impresión/descarga R | 95 img en índice | A | P1 |
| Taller | R | R | hojas/impresión R | imágenes R | A instrucciones | P1 |
| Rincón tranquilo | R | R | audio/controles R | **audio + visual** | A control sensorial | P1 |
| Cuestionarios | R | R | **formularios, errores, resultados** | — | A | P0/P1 |
| Lectura accesible | R | R | preferencias R | TTS | A | P1 |
| Privacidad | R | R | cualquier recogida futura | terceros | A | P0/P1 |

**Nota:** esta matriz no declara conformidad WCAG. Es la cola de evaluación.

---

# 15. MATRIZ DE VIGENCIA DE FUENTES

Esquema mínimo obligatorio por registro:

| Campo | Obligatorio |
|---|---|
| id interno | sí |
| afirmación/dato | sí |
| fuente | sí |
| organismo/autores | sí |
| URL/DOI | sí |
| fecha de publicación | sí cuando exista |
| fecha de consulta | sí |
| jurisdicción | sí cuando aplique |
| versión | sí cuando aplique |
| periodo de datos | sí para estadísticas |
| vigencia | vigente / cerrada / sustituida / histórica / por revisar |
| fecha de última revisión | sí |
| fecha de próxima revisión | sí |
| responsable | sí |
| notas de cambio | sí |

Cadencia inicial:
- convocatorias/ayudas: mensual o al abrir nueva campaña;
- legislación: trimestral + alerta por cambio;
- estadísticas oficiales: anual o según fuente;
- guías clínicas: semestral/anual;
- artículos científicos: no “caducan”, pero su interpretación se revisa al aparecer revisiones/guías nuevas;
- enlaces externos: comprobación automática periódica + revisión humana.

---

# 16. INVENTARIO DE PDF / DOCUMENTOS DESCARGABLES

### Resultado inicial

En las páginas principales inspeccionadas no se localizaron enlaces directos a archivos con extensiones:
`.pdf`, `.doc`, `.docx`, `.odt`, `.rtf`, `.epub`, `.zip`.

Sí existen rutas de descarga/impresión HTML en:
- Tus intereses;
- El taller / hojas;
- juegos y materiales imprimibles.

**Estado:** inventario **incompleto a nivel de repositorio**. La herramienta de lectura utilizada no ofrece listado recursivo de ficheros y la búsqueda de código no devolvió inventario de binarios.

### Clasificación obligatoria al localizar cada documento

- accesible;
- parcialmente accesible;
- no accesible;
- por revisar;
- sustituir por HTML.

### Regla

PDF nuevo público:
- crear con PDF 2.0 accesible;
- objetivo PDF/UA-2 · ISO 14289-2:2024;
- etiquetado semántico;
- orden de lectura;
- idioma;
- texto alternativo;
- tablas accesibles;
- enlaces y formularios accesibles;
- validación técnica y manual.

La información esencial debe existir también en HTML accesible cuando sea razonable.

---

# 17. INVENTARIO DE MULTIMEDIA Y ALTERNATIVAS

### Señales detectadas

- Inicio: referencias a YouTube/Vimeo/Instagram y un iframe.
- Vídeos: YouTube, Vimeo, Instagram y reproductor embebido.
- Rincón tranquilo: al menos un elemento `audio` y referencia audiovisual.
- La página de Vídeos contiene un listado estático de respaldo de 48 vídeos distribuidos entre Autismo, TDAH, TOC, Ansiedad, Tourette, LGTBI+ y otros temas.

### Hallazgo

No se localizaron en la página de Vídeos cadenas de “transcripción” como recurso sistemático.

**P0/P1:** crear inventario por pieza:

| campo | valor |
|---|---|
| título | |
| tema | |
| plataforma | |
| idioma | |
| subtítulos | sí/no/desconocido |
| subtítulos revisados | sí/no |
| transcripción | sí/no |
| audiodescripción necesaria | sí/no |
| audiodescripción disponible | sí/no |
| alternativa equivalente en texto | sí/no |
| derechos/permiso de incrustación | |
| fecha de revisión | |

Regla:
- audio informativo → transcripción;
- vídeo con voz → subtítulos;
- información visual no verbal necesaria → audiodescripción o alternativa equivalente;
- no depender del color;
- imágenes: decorativa / informativa / funcional / compleja.

---

# 18. REQUISITOS DE IA Y TRANSPARENCIA

El Reglamento (UE) 2024/1689 se aplica con carácter general desde 02/08/2026, con calendario específico para algunas disposiciones. Las obligaciones del artículo 50 se aplican desde 02/08/2026.

### Página requerida

**Qué es Sabik · Qué puede hacer · Qué no hace · Cómo utiliza fuentes · Cuándo interviene IA · Cómo pedir ayuda humana**

Contenido mínimo:

1. Sabik es una IA.
2. Qué adapta: estructura, lenguaje, extensión, formato u otras ayudas permitidas.
3. Qué no hace: no sustituye diagnóstico, profesional sanitario, abogado, administración, emergencia ni decisión humana.
4. Cómo se muestran fuentes y fechas.
5. Qué partes son automáticas y cuáles tienen revisión humana.
6. Cómo informar de un error.
7. Cómo solicitar una alternativa o apoyo humano cuando exista.
8. Qué datos se usan en cada interacción.
9. Qué se conserva y durante cuánto tiempo.
10. Cuándo un contenido sintético lleva marcado/etiquetado.

### Artículo 50

- interacción directa con personas: informar de que se interactúa con IA salvo que sea obvio en las condiciones de la norma;
- proveedores de sistemas generativos: marcado detectable y legible por máquina de contenido sintético según el alcance aplicable;
- deepfakes y determinados textos de interés público: reglas específicas de divulgación;
- información de transparencia: clara, distinguible y accesible.

**No asumir rol jurídico.** Debe determinarse si Sabik actúa como proveedor, implementador/deployer o ambos en cada componente.

**No afirmar “certificado ISO/IEC 42001”** sin certificado real.

---

# 19. PRIVACIDAD / DATOS · PUNTOS A REVISAR

Principios:

- minimización;
- finalidad definida;
- transparencia;
- exactitud;
- limitación de conservación;
- seguridad;
- privacidad desde el diseño.

### Riesgo alto de sensibilidad

La web trata temas de:
- salud;
- discapacidad;
- diagnóstico;
- salud mental;
- orientación sexual/identidad en ciertos contenidos;
- menores;
- comportamiento.

El hecho de **publicar información** sobre estos temas no implica por sí mismo tratar datos personales sensibles del visitante. El riesgo aparece si formularios, chat, cuestionarios, guardados, analítica o perfiles vinculan información a una persona identificada o identificable.

### Revisar

- buscador;
- cuestionarios;
- guardados/localStorage;
- preferencias de lectura;
- formularios de contacto;
- Sabik/IA conversacional;
- analítica;
- reproductores de terceros;
- Spotify/YouTube/Vimeo/Instagram;
- logs;
- cookies;
- identificadores;
- telemetría;
- menores.

RGPD art. 5: datos adecuados, pertinentes y limitados a lo necesario.  
RGPD art. 9: los datos de salud y otras categorías especiales tienen protección reforzada.

**P0:** no pedir diagnóstico, discapacidad, salud u otros datos sensibles solo para personalizar una explicación si la adaptación puede hacerse sin almacenarlos.

---

# 20. BRAILLE / LECTURA FÁCIL · RECURSOS Y NECESIDADES

## Braille

No crear una “versión visual en braille” de la web.

Para acceso digital con línea braille:
- HTML semántico;
- texto real;
- nombres accesibles;
- idioma correcto;
- estructura y orden lógicos;
- controles etiquetados;
- compatibilidad con tecnologías de apoyo.

Para documentos específicamente transcritos:
- Comisión Braille Española;
- Documento técnico B 3-1;
- versión 3, septiembre 2023;
- **última actualización 22/01/2026**.

Fuente:
https://www.once.es/servicios-sociales/braille/comision-braille-espanola/documentos-tecnicos/documentos-tecnicos-relacionados-con-el-braille/documentos-tecnicos-b-3-normas-para-la-transcripcion

## Lectura Fácil

No usar “Lectura Fácil” como sinónimo de “texto corto” o “texto simplificado”.

UNE 153101:2018 EX especifica pautas para:
- adaptación;
- creación;
- validación de documentos de Lectura Fácil.

El RD 707/2026 define la Lectura Fácil como un método que incluye redacción, diseño/maquetación/formato y validación de comprensibilidad, y recomienda UNE 153101 en su versión actualizada o la análoga vigente.

**Regla Sabik:**
- “lenguaje claro” para el contenido general;
- “Lectura Fácil” solo cuando exista proceso formal de creación/adaptación y validación;
- registrar quién valida, método, fecha y versión.

---

## 21. NUEVA NORMA ESPAÑOLA A INCORPORAR: RD 707/2026

**Real Decreto 707/2026, de 2 de septiembre, por el que se aprueba el Reglamento de las condiciones básicas de accesibilidad cognitiva.**

- Publicación BOE: 03/09/2026.
- Entrada en vigor: 02/01/2027.
- Incluye información y comunicación, tecnologías de la información y sociedad de la información.
- El art. 6 incluye administraciones públicas y proveedores privados de telecomunicaciones y prestadores de servicios de la sociedad de la información establecidos en España, según su ámbito.
- Define requisitos generales de información cognitivamente accesible.
- Distingue lenguaje sencillo, lenguaje claro y Lectura Fácil.
- Incluye adaptación, control de estímulos, orientación, seguridad, diversidad de necesidades y validación.

**P0:** análisis jurídico de encaje de Sabik antes del 02/01/2027 y plan de cumplimiento técnico/editorial.

---

## 22. SIGUIENTE COLA DE TRABAJO

### Gate A · Conformidad transversal
- matriz legal final;
- declaración de alcance;
- IA;
- privacidad;
- identidad;
- política de fuentes;
- política editorial;
- política de accesibilidad multimedia/documental.

### Gate B · Ayudas
- dataset completo;
- caducidad;
- estado de convocatoria;
- España estatal + CCAA;
- enlaces;
- fecha de revisión.

### Gate C · Datos
- validar 49/49;
- corregir cualquier cifra;
- marcar población, año, método, incertidumbre;
- publicar solo fichas verificadas.

### Gate D · Vida diaria
- revisar fuente → staging → dist;
- conservar la validación interna 48/48;
- comprobar sitemap generado;
- fuentes;
- nuevas fichas por laguna.

### Gate E · Condiciones y Situaciones
- taxonomía;
- cobertura;
- fuentes;
- consistencia;
- accesibilidad cognitiva.

---

## 23. CRITERIO DE CIERRE DEL AUDIT V1

Este documento **no aprueba ningún gate**.

El V1 se considera entregado cuando:

1. está versionado en GitHub;
2. Astra puede inspeccionar archivo y diff;
3. los hallazgos tienen prioridad;
4. las obligaciones legales están separadas de las referencias técnicas;
5. no se afirma cumplimiento sin auditoría;
6. las matrices 13–20 están presentes;
7. se abre la cola de ampliación pestaña por pestaña.

---

## 24. CAMBIOS QUE REQUIEREN TRAZABILIDAD

Toda sustitución relevante deberá registrar:

- texto o recurso anterior;
- motivo;
- fuente;
- fecha;
- cambio propuesto;
- persona/agente;
- revisión Astra;
- commit/PR;
- fecha de próxima revisión.

---

## 25. RESULTADO DEL AUDIT V1

La web ya contiene una base de conocimiento inusualmente extensa.

El problema principal detectado no es “falta de texto”, sino **gobernanza del contenido**:

- estados editoriales inconsistentes;
- necesidad de caducidad y vigencia;
- taxonomía mezclada;
- diferencias entre idiomas;
- accesibilidad multimedia/documental pendiente de inventario completo;
- necesidad de transparencia IA;
- necesidad de determinar el ámbito legal exacto;
- nueva normativa española de accesibilidad cognitiva con entrada en vigor próxima.

Por tanto, la ampliación debe empezar por **hacer fiable y mantenible lo que ya existe**, y después cubrir huecos reales.



---

## 26. ARCHIVOS DE EVIDENCIA DEL AUDIT

El audit V1 se apoya en documentos versionados independientes para que Astra pueda revisar hallazgos y método sin depender del chat:

1. `docs/audits/agent4/SABIK_WEB_TAB_MATRIX_V1.md`
   - matriz obligatoria por pestaña;
   - EXISTE / FALTA / DESACTUALIZADO / AMPLIAR / SUSTITUIR / RECURSO NUEVO / ACCESIBILIDAD / NORMATIVA / FUENTE / PRÓXIMA REVISIÓN.

2. `docs/audits/agent4/SABIK_WEB_COMPLIANCE_REGISTER_V1.md`
   - normas y legislación;
   - estado técnico;
   - estado jurídico;
   - fuentes primarias;
   - fechas de comprobación.

3. `docs/audits/agent4/SABIK_WEB_STATIC_ACCESSIBILITY_SCAN_V1.md`
   - línea base estática de páginas principales;
   - indicadores de estructura, imágenes, formularios y multimedia;
   - límites del método;
   - pruebas manuales obligatorias.

4. `docs/audits/agent4/SABIK_WEB_WORK_QUEUE_V1.md`
   - backlog P0–P3;
   - identificadores estables;
   - criterios de aceptación;
   - estado de cada elemento.

### Regla de revisión

Estos archivos forman parte de la entrega. Una modificación futura que cambie el diagnóstico del audit deberá actualizar el documento afectado y dejar commit/PR trazable.
