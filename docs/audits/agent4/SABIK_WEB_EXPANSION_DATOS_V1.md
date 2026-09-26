# SABIK_WEB_EXPANSION_DATOS_V1

**Agente:** n.º 4  
**Fecha:** 20/09/2026  
**Área:** Datos  
**Ruta:** `/es/datos/`  
**Estado:** INVESTIGADO → PROPUESTO. Validación sustantiva 49/49 todavía no cerrada.

---

## 1. ESTADO INICIAL

El índice de Datos contiene **49 fichas individuales**.

El propio índice advierte actualmente:

> “Están montadas las 49 páginas de la sección. Todas en borrador: la fuente está nombrada y enlazada, la comprobación final sigue pendiente.”

### Barrido estructural realizado

Se inspeccionaron las 49 rutas enlazadas por el índice.

**Resultado: 49/49 fichas existen y 49/49 contienen:**
- apartado **Fuentes**;
- **Población medida**;
- **Año de los datos**;
- **Referencia temporal**;
- **Método**;
- **Publicación**;
- **Revisión prevista**.

Esto significa que la arquitectura de la ficha ya es una base válida.

**No significa que las 49 cifras estén validadas sustantivamente.**

---

## 2. COBERTURA ACTUAL

La sección incluye, entre otros:

### Mundo / internacional
- autismo;
- diferencias por sexo en estimaciones de autismo;
- carga de salud;
- discapacidad del desarrollo;
- TDAH infancia/adolescencia;
- TDAH adultos;
- dislexia;
- trastorno del desarrollo de la coordinación;
- discalculia/disgrafía y límites de comparabilidad;
- ansiedad;
- TOC;
- discapacidad;
- salud;
- infancia;
- tecnología de apoyo;
- Tourette;
- TDL.

### Empleo, educación y participación
- empleo y autismo;
- salario;
- graduados autistas;
- revelar diagnóstico y ajustes;
- discapacidad y empleo;
- brecha de empleo;
- participación laboral;
- abandono educativo;
- NEET;
- educación superior;
- aprendizaje a lo largo de la vida;
- pobreza/exclusión;
- discriminación.

### Series nacionales / regionales
- Estados Unidos / ADDM y CDC;
- Reino Unido;
- Unión Europea;
- Australia / ABS;
- Canadá.

### Comparativa
- “Cuatro cifras de autismo que no miden lo mismo”.

---

## 3. FORTALEZA DETECTADA

La sección ya hace algo importante que debe conservarse:

**no presenta una cifra aislada sin contexto.**

Las fichas revisadas incluyen:
- a quién se midió;
- qué año representa;
- cómo se obtuvo;
- qué debe evitarse al citar;
- cuándo revisarla.

Esto está alineado con:
- lenguaje claro;
- presentación de la información;
- prevención de comparaciones engañosas.

---

## 4. PROBLEMA PRINCIPAL

No falta estructura.

Falta cerrar el ciclo:

`FUENTE ENLAZADA → COMPROBADA → FECHA DE CONSULTA → RESULTADO → PUBLICADA → PRÓXIMA REVISIÓN`

Hoy el índice mantiene las 49 como borrador.

### Riesgo

Una cifra correcta en 2026 puede quedar mal presentada si:
- cambia la fuente;
- aparece una serie nueva;
- cambia la metodología;
- cambia la población medida;
- se reemplaza una encuesta;
- se mezclan prevalencia diagnosticada y estimada;
- se compara una jurisdicción con otra sin equivalencia.

---

## 5. VERIFICACIÓN DE MUESTRA REALIZADA

### Autismo mundial

Ficha:
`/es/datos/autismo/`

La OMS, actualización 17/09/2025, indica:
- en 2021 aproximadamente **1 de cada 127 personas** tenía autismo.

Fuente:
https://www.who.int/es/news-room/fact-sheets/detail/autism-spectrum-disorders

La ficha de Datos usa esa referencia y contextualiza que no es un recuento de diagnósticos.

**Estado de muestra:** coherente.

### TDAH en adultos

Ficha:
`/es/datos/tdah-en-adultos/`

Metaanálisis:
- TDAH adulto persistente desde infancia: **2,58 %**, unos **139,84 millones**;
- TDAH adulto sintomático: **6,76 %**, unos **366,33 millones**;
- estructura demográfica mundial 2020.

Fuente:
https://pubmed.ncbi.nlm.nih.gov/33692893/

La ficha separa ambas definiciones y advierte que no deben mezclarse.

**Estado de muestra:** coherente.

### Trastornos de ansiedad

Ficha:
`/es/datos/trastornos-de-ansiedad/`

OMS:
- **359 millones** de personas en 2021;
- 4,4 % de la población mundial según la ficha de 2025.

Fuente:
https://www.who.int/es/news-room/fact-sheets/detail/anxiety-disorders/

**Estado de muestra:** coherente.

---

## 6. FUENTES DETECTADAS EN LAS 49 FICHAS

Entre los dominios de fuente sustantiva aparecen:

- who.int
- pubmed.ncbi.nlm.nih.gov
- doi.org
- pmc.ncbi.nlm.nih.gov
- unicef.org
- data.unicef.org
- cdc.gov
- stacks.cdc.gov
- gov.uk
- ilostat.ilo.org
- ilo.org
- ec.europa.eu
- abs.gov.au
- canada.ca

Regla:
- priorizar fuente primaria/organismo responsable;
- DOI/PubMed cuando la cifra procede de literatura científica;
- conservar fuente secundaria solo si añade contexto y no sustituye al origen.

---

## 7. MATRIZ DE VALIDACIÓN PROPUESTA

Cada ficha debe tener registro interno:

| Campo | Ejemplo |
|---|---|
| id | datos-autismo |
| afirmación principal | 1 de cada 127 |
| población | mundial, todas las edades |
| territorio | mundo |
| año de datos | 2021 |
| método | modelización GBD |
| fuente | OMS + estudio |
| URL/DOI | ... |
| fecha publicación | ... |
| fecha consulta | 2026-09-20 |
| estado fuente | vigente |
| coincide con web | sí/no |
| corrección necesaria | texto |
| última revisión | fecha |
| próxima revisión | fecha |
| gatillo de revisión | nueva ronda / nueva edición / anual |

---

## 8. ESTRUCTURA PROPUESTA DE CADA FICHA

Mantener:

1. cifra;
2. qué mide;
3. cómo citarla;
4. qué evitar;
5. fuentes;
6. ficha técnica.

Añadir de forma visible:

### Revisado
**Revisado el DD/MM/AAAA**

### Próxima revisión
**Se revisará cuando…**
- haya nueva ronda ADDM;
- publique OMS una actualización;
- haya nuevo SDAC;
- exista nueva encuesta comparable;
- o llegue la revisión anual/bianual.

### Estado
- **Verificada**
- **En revisión**
- **Histórica**
- **Sustituida**

No usar solo color.

---

## 9. QUÉ DEBE ACTUALIZARSE

### P0

- validar sustantivamente 49/49;
- registrar fecha de consulta;
- registrar resultado de la comprobación;
- no quitar “borrador” hasta cerrar la ficha.

### P1

- generar un registro de mantenimiento único;
- sincronizar índice y ficha;
- automatizar detección de enlaces caídos;
- comprobar canonical/sitemap.

### P2

- ampliar España/UE cuando existan datos oficiales comparables;
- evitar crear una cifra solo para “rellenar” una condición sin buena fuente.

---

## 10. QUÉ DEBE SUSTITUIRSE O ELIMINARSE

Eliminar o sustituir solo cuando ocurra uno de estos casos:

- cifra sin fuente recuperable;
- metodología ya superada y existe una serie oficial nueva;
- población o año mal descritos;
- fuente rota sin reemplazo verificable;
- comparación que mezcla definiciones incompatibles;
- afirmación que atribuye causalidad a un estudio observacional;
- cifra mundial construida a partir de una muestra no mundial sin explicación.

No borrar cifras históricas útiles: marcarlas como **históricas** y explicar qué las reemplaza.

---

## 11. ACCESIBILIDAD DE DATOS

Reglas:

- la cifra principal debe aparecer como texto real;
- no comunicar magnitud solo con color;
- tablas con encabezados reales;
- gráficos, si se incorporan, con descripción equivalente;
- unidades junto al valor;
- población y año cerca de la cifra;
- evitar números sin contexto;
- explicar DALY, prevalencia, intervalo, metaanálisis u otros términos antes de exigir que el lector los conozca.

### Carga cognitiva

Cuando haya varias cifras:
- una pregunta por bloque;
- comparación en tabla si reduce texto;
- “qué significa” antes del detalle metodológico;
- “qué no significa” cuando el riesgo de interpretación errónea sea alto.

---

## 12. NUEVOS CONTENIDOS RECOMENDADOS

No ampliar por cantidad.

Buscar huecos solo cuando existan fuentes comparables de calidad, por ejemplo:

- España: empleo/discapacidad, educación y participación si INE/ministerios permiten una lectura responsable;
- UE: indicadores armonizados;
- vida adulta y envejecimiento, hoy menos representados;
- acceso sanitario y tiempos de espera si existen series sólidas;
- brechas de diagnóstico solo cuando la población y el método estén claros.

---

## 13. CUESTIONES PENDIENTES

1. Verificación sustantiva 49/49.
2. Comprobar enlace por enlace.
3. Registrar fecha de consulta.
4. Determinar si alguna fuente tiene edición nueva en 2026.
5. Revisar “Publicación” vs “Año de datos” para evitar que el lector los confunda.
6. Revisar traducciones de títulos/terminología científica.
7. Confirmar que “borrador/publicada” dependa de una única fuente de estado.

---

## 14. FECHA DE REVISIÓN

- Barrido estructural 49/49: **20/09/2026**
- Verificación de muestra: **20/09/2026**
- Próximo gate de Datos: tras completar validación sustantiva 49/49.
- Cadencia: según “Revisión prevista” de cada ficha, con revisión extraordinaria si la fuente publica una nueva serie.

---

## 15. RESULTADO

**Datos no necesita ser reescrita.**

Necesita terminar el trabajo que su propio índice ya reconoce como pendiente: verificar cada afirmación, registrar cuándo se comprobó y publicar únicamente lo que haya superado esa comprobación.
