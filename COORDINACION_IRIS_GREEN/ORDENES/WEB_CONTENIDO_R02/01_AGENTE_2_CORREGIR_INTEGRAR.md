# WEB-CONTENIDO-R02 · Agente 2 · corregir e integrar contenido auditado

Fecha: 25/09/2026  
Responsable: María + Agente 2  
Estado al emitir: **EMITIDA_PENDIENTE_ACUSE**

## Autoridad y base

Auditoría obligatoria:
`COORDINACION_IRIS_GREEN/EVIDENCIAS/WEB_CLAUDE_CONTENIDO_R01/AUDITORIA_ASTRA_PREPUBLICACION_20260925.md`

Paquete de partida auditado:
`iris-green-contenido-R01-20260924_1(1)(1).zip`
SHA-256: `e44633d2c4707e69276c88728a090212f6d791046cc8dbe38399270f5c29551a`.

PR A2 vigente observado antes de emitir:
- PR: #244
- rama: `agent2/sabik-iris-r08-20260924`
- HEAD observado: `7b49e95f25318e9e936cf54e959948c6781c1c73`

**Antes de escribir, volver a comprobar HEAD.** Si ha avanzado, conservarlo; no volver a `2e17ed3…` ni restaurar una base histórica.

## Objetivo

No publicar R01 tal cual. **Corregir esta misma entrega, sin rehacer las fichas desde cero**, integrarla sobre el HEAD vigente de A2 y producir un candidato R02 verificable en preview.

La auditoría independiente cuenta **118 unidades nuevas**, no 152:
- 41 Condiciones
- 36 Situaciones
- 14 Vida diaria
- 11 Datos
- 4 Ayudas
- 12 Estudios

Los 34 restantes del resumen original son archivos modificados, no fichas.

## Correcciones P0/P1 obligatorias antes de integrar

### 1. Español + inglés completo

- Estudios e121–e132: traducir realmente `sample_en`; corregir conectores españoles residuales en `authors_en`.
- Cuatro Ayudas nuevas: añadir y consumir `name_en` y `terr_en`; el guardián de traducciones debe exigirlos cuando corresponda.
- Corregir textos editoriales de fuentes/fechas que siguen en español en páginas EN.
- Corregir pies/etiquetas residuales en español de las 41 Condiciones EN.
- No traducir silenciosamente títulos oficiales si se conservan como cita original: marcar idioma original cuando proceda y traducir el texto editorial circundante.
- No declarar corpus o cobertura documental inglesa por el mero hecho de tener interfaz EN.

### 2. Investigación 120 → 132

No publicar una interfaz que diga/muestre 120 mientras el JSON contiene 132.

Resolver una de estas dos vías y documentarla:
1. regenerar la interfaz/paquete que consume los estudios y comprobar 132 visibles; o
2. excluir temporalmente e121–e132 de esta publicación hasta que Codex regenere ese artefacto.

No fingir que los 12 estudios están publicados si solo existen en el JSON.

### 3. Correcciones jurídicas

Aplicar exactamente la auditoría:
- Tarjeta Europea de Estacionamiento: retirar “Gratuita / Free of charge” como regla universal; reflejar que puede ser gratuita o tener tasa limitada a costes administrativos.
- Sustituir plazos vagos por fechas exactas de transposición/aplicación de la Directiva (UE) 2024/2841 y conservar correctamente el régimen transitorio cuando se mencione.
- RD 707/2026: no afirmar que “no regula el facilitador procesal”; el reglamento es más amplio, pero lo contempla expresamente.
- Accesibilidad cognitiva: no generalizar “lectura fácil o lenguaje sencillo” como obligación uniforme de toda web; ajustar al ámbito y artículo aplicables.
- Perros de asistencia: incorporar la excepción al retiro a los 10 años cuando exista informe veterinario anual favorable; usar BOE como fuente primaria de la afirmación legal.

### 4. Trazabilidad médica/científica

No basta con una URL general por ficha. Para cada afirmación adicional debe existir fuente que la respalde.

Revisar, como mínimo, los casos marcados por la auditoría:
- POTS → ansiedad / mujeres jóvenes;
- TLP → diagnóstico previo en mujeres autistas;
- trastorno neurológico funcional → hipermovilidad / rasgos autistas;
- hipermovilidad → autismo/TDAH;
- apnea del sueño → autismo/discapacidad intelectual;
- bipolaridad → diferencial con TDAH adulto.

Para cada una: **añadir fuente específica o retirar/acotar la afirmación**. Mantener lenguaje prudente de asociación cuando la evidencia no sea causal.

### 5. Guardarraíles de scripts

No aceptar crecimiento arbitrario solo porque el total supera un mínimo.

Los scripts modificados deben conservar, además del mínimo:
- IDs únicos;
- slugs/rutas únicas;
- ausencia de duplicados;
- delta esperado de esta entrega;
- bilingüismo completo de campos obligatorios;
- error de build si falta la pareja inglesa exigible.

`publish_biblioteca.py` puede conservar la fecha de validación propia de cada ficha si la prueba confirma el comportamiento esperado.

No modificar Sentidos o Sueño si sus comprobaciones selladas no forman parte de esta entrega.

## Integración

1. Extraer el contenido R01 en área de trabajo separada.
2. Aplicar las correcciones anteriores.
3. Rebase/integración lógica sobre el **HEAD vigente de PR #244**, nunca copiando por encima del árbol actual.
4. Revisar colisiones por ruta antes de escribir. Conservar todo el trabajo posterior de A2.
5. Ejecutar build completo.
6. Ejecutar las pruebas propias del repo y separar:
   - fallos nuevos introducidos por R02;
   - fallos preexistentes reproducibles en la misma base.
7. Verificar todas las páginas nuevas ES/EN:
   - `lang`;
   - 1 H1;
   - jerarquía;
   - canonical;
   - hreflang recíproco;
   - enlaces/fuentes;
   - reflujo 320/390/1440;
   - teclado/foco de la superficie afectada;
   - ausencia de texto español no justificado en páginas EN.
8. Ejecutar axe/QA pertinente sobre una muestra representativa y registrar la evidencia real.
9. Crear **un solo preview**, no producción.
10. Entregar R02 con:
   - HEAD;
   - deploy;
   - lista de archivos;
   - recuento correcto de unidades nuevas;
   - pruebas y resultados;
   - fuentes añadidas/cambiadas;
   - bloqueos pendientes, si los hubiera.

## Criterio de cierre

Estado aceptable:
**PREVIEW_R02_CORREGIDO_LISTO_PARA_REVISION_MARIA**

No usar:
- PASS global si quedan fallos no revisados;
- “152 fichas nuevas”;
- “todo EN completo” sin comprobar los campos anteriores;
- “132 estudios publicados” si la interfaz aún muestra 120.

No subir a producción ni fusionar main por esta orden.

## Normativa y ES+EN

Aplicar `../../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md`.

La web existente de Iris Green es la base. Preservar cabecera, navegación, Newsreader/Atkinson, Lectura, accesibilidad y todos los avances de A2. WCAG 2.2 AA/COGA y marco ISO/EN del proyecto se aplican a la superficie afectada sin declarar certificación global.

Todo texto público modificado o añadido debe existir completo en **español e inglés**, incluidos títulos, ayudas, errores, metadatos, nombres accesibles y navegación. Lenguaje claro, no infantilizante y sin jerga interna.

No tocar Sabik Cloud, voz, IA, DNS, producción ni otros carriles salvo la dependencia puntual de regeneración de Investigación si es imprescindible; si requiere Codex, registrar ese único handoff sin ampliar la misión.
