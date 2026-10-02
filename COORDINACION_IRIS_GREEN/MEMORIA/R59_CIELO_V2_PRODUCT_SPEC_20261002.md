# R59 · INTERÉS 01 · CIELO V2 · PRODUCT SPEC

Fecha: 02/10/2026  
Owner producto Intereses: **Senda · R59**  
Autoridad: María / Astra · Issue #323  
Estado: `INTERESTS_CIELO_V2_PRODUCT_SPEC_PASS`

Este documento es **producto/contenido**.  
No contiene build, código ni generación de imágenes.

## 1. Decisión

El Cielo actual pasa a estado:

`DONOR_NOT_FINAL_PRODUCT`

Cielo V2 se define así:

`WORLD_SCENE_FIRST → EXPLORE → CURATED_REAL_INFO → DEPTH_ON_DEMAND`

No es:
- un catálogo de 88 constelaciones en primer plano;
- una tabla de 597 estrellas como entrada;
- un mapa de 8.920 estrellas como experiencia inicial;
- una interfaz NASA;
- un dashboard astronómico.

## 2. Pregunta central

### ES
**¿Qué puedo reconocer en el cielo esta noche y cómo se relacionan sus estrellas?**

### EN
**What can I recognise in tonight’s sky, and how are its stars connected?**

La palabra “esta noche” describe un cielo **calculado localmente para fecha/lugar**, no un feed live de NASA/JPL.

## 3. Primary mode

- primary_mode: `EXPLORE`
- secondary_modes: `DISCOVER · LEARN`
- collection_role: `OPTIONAL_DEPTH`
- map_role: `NONE_IN_FIRST_EXPERIENCE · SECONDARY_IN_DEPTH`
- real_data: `YES`
- live_external_dependency: `NO`

## 4. Primera experiencia visual

Una escena de observación desde el suelo:

- horizonte terrestre bajo;
- cielo oscuro Iris Green;
- estrellas reales de HYG en su posición calculada;
- líneas de constelación solo cuando ayudan a reconocer una figura;
- Luna/planetas solo como contexto si están en la vista;
- profundidad, luz y atmósfera suficientes para E4;
- sin logos externos;
- sin paneles de datos dominando la escena.

La persona entra mirando **una porción del cielo**, no todo el cielo plano.

### Densidad inicial

En la primera vista:

- máximo **5 constelaciones etiquetadas**;
- **12–24 estrellas brillantes interactivas**;
- estrellas débiles pueden formar ambiente visual, pero no añaden decenas de targets;
- 0 tabla completa;
- 0 contador “88 / 597 / 8.920” como mensaje principal.

## 5. Acción principal

**Mirar → elegir una figura/estrella → reconocer la relación → abrir información real si se desea.**

Interacción:

- pointer/touch;
- teclado;
- botones/flechas para mirar;
- drag puede existir, pero no es el único método;
- “volver a la vista inicial” siempre disponible.

No se exige velocidad.

## 6. Primer viewport

Debe contener solo:

1. título;
2. pregunta central;
3. escena de cielo;
4. una instrucción corta:
   - ES: “Mira alrededor y elige una figura o una estrella.”
   - EN: “Look around and choose a pattern or a star.”
5. controles mínimos:
   - mirar;
   - pistas on/off;
   - lugar/fecha-hora en disclosure compacto;
6. una ficha contextual solo tras selección.

No:
- navegación interna de seis secciones antes de la escena;
- full-sky map;
- tablas;
- búsqueda enciclopédica;
- colección.

## 7. Contexto inicial

Sin geolocalización automática.

Default:
- `Península · 40° N`;
- fecha actual;
- si es de día, presentar la próxima vista nocturna alrededor de las 22:00 como **cálculo**, no como live feed.

Profundidad:
- selector de ciudades/presets;
- Canarias;
- fecha/hora manual.

Geolocalización, si alguna vez se añade:
solo tras acción explícita y otro gate.

## 8. Información real dosificada

### Al seleccionar constelación

Mostrar inicialmente:
- nombre ES;
- nombre oficial/latino;
- abreviatura IAU;
- 2–4 estrellas clave;
- si está alta/baja en esa vista;
- época aproximada en que resulta fácil reconocerla desde España;
- una explicación breve de la figura.

### Al seleccionar estrella

Mostrar:
- nombre IAU si existe;
- designación;
- magnitud aparente;
- distancia si existe;
- tipo espectral/color;
- constelación.

### Planeta/Luna

Solo:
- nombre;
- dirección/altura aproximada;
- Luna: fase aproximada;
- no presentar magnitud planetaria fija como brillo “en tiempo real”.

## 9. Profundidad bajo demanda

Botón/acción:
**“Explorar todo el cielo” / “Explore the whole sky”**.

Aquí viven como donor útil:
- las 88 constelaciones;
- full-sky map;
- tabla/listado completo;
- 597 nombres de estrellas del snapshot actual;
- 8.920 estrellas del subconjunto naked-eye actual;
- filtros de magnitud;
- límites IAU;
- búsquedas;
- fuentes/atribuciones;
- descarga de datos cuando siga siendo válida.

La profundidad NO se descarga/renderiza completa antes de necesitarla.

## 10. DONORS · KEEP

### Datos
KEEP:
- `es/intereses/cielo/cielo.json`;
- posiciones/magnitud/color HYG;
- datos completos detrás;
- nombres WGSN actuales del snapshot;
- líneas/límites de constelaciones;
- datos de Vía Láctea del donor;
- relaciones estrella ↔ constelación.

### Astronomía local
KEEP:
- transformación J2000 → vista del observador;
- tiempo sidéreo;
- posiciones planetarias aproximadas JPL dentro de su rango;
- fórmula lunar aproximada para orientación;
- presets manuales de España.

### Accesibilidad/privacidad
KEEP:
- no movimiento automático;
- teclado;
- controles explícitos;
- descripción textual del cielo;
- datos equivalentes fuera de Canvas/SVG;
- ES/EN;
- runtime sin dependencia externa;
- fallback estructural.

## 11. DONORS · REWORK / DROP COMO EXPERIENCIA

REWORK:
- “Cielo en directo” → “Cielo calculado para…” / “Sky calculated for…”;
- full-sky map → profundidad secundaria;
- búsqueda completa → profundidad;
- Mi cielo → fuera del primer viewport;
- persistencia: no guardar automáticamente sin opt-in según contrato R59;
- planetas: posición aproximada KEEP; brillo fijo NO se presenta como dato actual.

DROP del primer plano:
- 88 constelaciones;
- 597 nombres;
- 8.920 estrellas;
- tabla completa;
- full-sky map;
- múltiples filtros simultáneos;
- identidad basada en proveedor externo.

## 12. HYG / IAU / JPL / NASA dentro de Cielo V2

### HYG
Rol:
posición/magnitud/color de estrellas.

Runtime:
**SNAPSHOT LOCAL**.

Decisión:
`KEEP_DATA · REFRESH_SOURCE_PATH_BEFORE_FREEZE`.

No red externa.

### IAU WGSN
Rol:
autoridad de nombres de estrellas.

Runtime:
**SNAPSHOT LOCAL**.

Decisión:
`KEEP`.

La autoridad futura debe citar primero el catálogo oficial IAU; un mirror puede ser mecanismo de ingest, no autoridad editorial.

### IAU constellations
Rol:
88 constelaciones, nombres/abreviaturas/límites oficiales.

Decisión:
`KEEP`.

### JPL
Rol:
elementos aproximados para la posición de planetas.

Runtime:
**fórmula local**, no API.

Decisión:
`KEEP_WITH_RANGE_1800_2050`.

No usar como ephemeris de alta precisión.

### NASA
Rol actual:
**NINGUNO en Cielo 01**.

Decisión:
`NOT_A_DEPENDENCY`.

No añadir NASA por identidad, branding o “más datos”.

## 13. Child-safe

`SAFE_BY_DEFAULT`.

- 0 búsqueda libre en servicios externos;
- 0 autoplay;
- 0 geolocalización al entrar;
- 0 perfilado;
- 0 inferencia de edad/diagnóstico;
- enlaces/fuentes bajo depth;
- salida de la experiencia siempre visible;
- no streaks/recompensas compulsivas.

## 14. Reduced / no motion

Modo normal:
- solo cambios tras acción;
- transiciones discretas;
- ningún parallax obligatorio;
- ningún twinkle necesario para comprender.

Reduced/no-motion:
- pan/zoom cambian de estado sin viaje de cámara;
- 0 estrellas titilando;
- 0 movimiento ambiental obligatorio;
- misma información y acciones.

## 15. Accesibilidad estructural

La escena gráfica NO es la única representación.

Debe existir una lista DOM:
**“En esta vista” / “In this view”**
con las constelaciones/objetos seleccionables visibles.

Cada selección actualiza:
- nombre;
- estado;
- información contextual.

Forced colors:
los controles y lista permanecen funcionales aunque se simplifique la escena.

## 16. Performance guardrail

Primera experiencia:
- no cargar/renderizar la enciclopedia completa;
- datos completos pueden quedar disponibles para depth, pero no crear miles de targets;
- render on-demand;
- 12–24 targets interactivos iniciales;
- full-sky/depth lazy;
- fallback funcional sin escena rica.

## 17. ES / EN

Mismos IDs, hechos, unidades y estados.

ES:
- “Cielo nocturno”
- “¿Qué puedo reconocer en el cielo esta noche y cómo se relacionan sus estrellas?”
- “Explorar todo el cielo”

EN:
- “Night sky”
- “What can I recognise in tonight’s sky, and how are its stars connected?”
- “Explore the whole sky”

## 18. Criterio de aceptación del primer Cielo V2

PASS de producto si:

- escena primero;
- máximo 5 constelaciones etiquetadas;
- 12–24 estrellas interactivas;
- no enciclopedia inicial;
- no dependencia live externa;
- HYG/IAU/JPL correctamente etiquetados;
- NASA no domina ni se añade sin función;
- profundidad mantiene el dataset rico;
- ES/EN;
- child-safe;
- reduced/no-motion;
- alternativa DOM;
- 320/390 contemplados;
- fuente/dato distinguido de simulación/cálculo.

## 19. Handoff

Motor puede usar este documento para construir Cielo V2 cuando Astra lo autorice.

Atlas NO debe inventar assets fuera de:
`R59_INTERESTS_ASSET_BATCH_01_20261002.json`.

Marcador:
`INTERESTS_CIELO_V2_PRODUCT_SPEC_PASS`
