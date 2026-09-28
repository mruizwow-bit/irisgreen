# R58 · ASTRA · INTERESES · REESTRUCTURACIÓN + 6 PILOTOS

Fecha: 28/09/2026
Autoridad de producto: María
Diseño/revisión: Astra
Integración: A2
HUMAN QA final: María

## Estado
`R58_INTERESTS_RESTRUCTURE_AND_PILOTS_ORDERED`

## Decisión de producto

Intereses deja de organizarse alrededor de APIs, mapas, dashboards o grandes datasets.

Nueva definición:

**MUNDOS VISUALES PROPIOS + EXPLORACIÓN + ACTIVIDAD + COLECCIÓN OPCIONAL + INFORMACIÓN REAL DOSIFICADA.**

Las fuentes externas siguen sirviendo para verificar/alimentar datos, pero no definen:
- portada;
- arquitectura;
- estética;
- experiencia principal.

Ejemplo: NASA puede alimentar Espacio, pero Espacio no es “NASA dentro de Iris Green”.

## Reestructuración 72/72

Antes de construir, crear matriz 72/72 con:

- interest_id
- title_es / title_en
- theme_family
- primary_mode = EXPLORE | DISCOVER | COLLECT | PLAY | LEARN
- secondary_modes[]
- needs_map = NONE | LIGHT | CENTRAL
- needs_real_data = YES | NO
- play_role = NONE | SECONDARY | PRIMARY
- collection_role = NONE | OPTIONAL | CORE
- world_scene_required = YES
- source_pressure = LOW | MEDIUM | HIGH
- rewrite_required = YES | NO
- notes

## Arquitectura por interés

1. escena/mundo visual propio;
2. qué puedo hacer aquí;
3. exploración/actividad;
4. ficha real;
5. Mi colección / Mi museo / Cuaderno cuando corresponda;
6. ampliar información bajo demanda.

## Regla de mapas

Mapa solo si responde a la pregunta del interés.

- NONE: no mapa.
- LIGHT: contextual/secundario.
- CENTRAL: la geografía ES la experiencia.

## Regla de fuentes

Pocas, buenas y subordinadas a la experiencia.

No:
- fetch-all;
- dumping de APIs;
- “más datos = mejor”;
- logos/fuentes externas como identidad visual.

## Seis pilotos

1. **Mar y peces**
   - mundo marino;
   - explorar;
   - pesca tranquila;
   - descubrir especie;
   - ficha real;
   - acuario/museo opcional.

2. **Aves**
   - observar;
   - localizar;
   - identificar;
   - encuadre/fotografía simulada;
   - Cuaderno de Campo.

3. **Fósiles**
   - excavación simulada;
   - hallazgo;
   - recomposición;
   - ficha;
   - museo.

4. **Minerales**
   - materiales/cristales;
   - búsqueda;
   - comparación;
   - colección;
   - museo.

5. **Trenes / metro**
   - estaciones;
   - rutas;
   - señales;
   - conexiones;
   - puzle espacial;
   - información real contextual.

6. **Espacio**
   - observación;
   - constelaciones/planetas/objetos;
   - experiencia visual Iris Green;
   - ficha real;
   - colección;
   - NO dashboard NASA.

## Visual

Objetivo: **calidad visual magnífica**.

No:
- iconos;
- tarjetas planas;
- vector escolar;
- mapas técnicos como portada;
- dashboard;
- UI genérica.

Sí:
- escena;
- atmósfera;
- luz;
- profundidad;
- material;
- composición;
- identidad Iris Green.

Assets finales first-party/originales.
No copiar escenas/UI/personajes protegidos.

## Método

`REESTRUCTURAR 72 → CONCEPTOS 6 → ASTRA/MARÍA → BUILD 6 → QA → ESTÁNDAR → ESCALAR`

No 72 de golpe.

## Gates

`R58_INTERESTS_72_ARCHITECTURE_REVIEW_READY_FOR_ASTRA`

`R58_INTERESTS_6_PILOT_CONCEPTS_READY_FOR_ASTRA`

`R58_INTERESTS_6_PILOTS_READY_FOR_ASTRA`

`R58_INTERESTS_STANDARD_APPROVED_FOR_SCALE`

No main. No producción. No escalado sin último gate.