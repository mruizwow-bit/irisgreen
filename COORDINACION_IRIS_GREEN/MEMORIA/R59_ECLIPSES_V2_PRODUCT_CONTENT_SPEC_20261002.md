# R59 · INTERÉS 04 · ECLIPSES V2 · PRODUCT + CONTENT SPEC

Fecha: 02/10/2026  
Owner: **Senda · R59**  
Scope: **producto + contenido factual + reuse audit**  
Estado: `INTEREST_04_ECLIPSES_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

No runtime. No código de producto. No imágenes. No Batch. No main.

## 1 · Decisión de producto

El donor actual tiene mucha información útil, un motor astronómico local y una simulación rica, pero la primera experiencia intenta resolver demasiadas cosas a la vez.

Eclipses V2 se define como:

`SAME_EVENT → CHANGE_PLACE → SEE_WHAT_CHANGES → EXPLAIN_THE_SHADOW → DEPTH_ON_DEMAND`

La primera experiencia no pregunta “¿qué eclipses hay hasta 2100?”, sino:

### ES
**¿Por qué el mismo eclipse puede ser total en un lugar y parcial en otro?**

### EN
**Why can the same eclipse be total in one place and partial in another?**

Ejemplo inicial:
**2 de agosto de 2027 / 2 August 2027**.

## 2 · Acción humana principal

**Cambiar de lugar manteniendo el mismo eclipse.**

La persona compara:
- Cádiz;
- Ceuta;
- Sevilla;
- Madrid;
- Barcelona.

La primera acción no es mover un mapa, escribir coordenadas ni usar geolocalización.

Después de entender el cambio por lugar, puede pedir:
- mover la hora;
- ver el mapa;
- cambiar de eclipse;
- abrir el catálogo.

## 3 · Primer viewport

Debe contener solo:

1. título;
2. pregunta central ES/EN;
3. fecha/evento fijo:
   - **2 de agosto de 2027 · eclipse solar total en parte del sur de España**;
4. dos vistas comparadas del máximo:
   - Cádiz → total;
   - Madrid → parcial;
5. selector compacto de 5 lugares;
6. una frase causal:
   - ES: **“La sombra más oscura de la Luna cubre una franja estrecha de la Tierra. Fuera de esa franja, el mismo eclipse se ve parcial.”**
   - EN: **“The Moon’s darkest shadow covers a narrow band of Earth. Outside that band, the same eclipse looks partial.”**
7. tres etiquetas visibles:
   - `REAL_DATA`;
   - `CALCULATION`;
   - `SIMULATION`;
8. aviso de seguridad solar antes de cualquier acción de “observar”;
9. acciones secundarias:
   - “Cambiar la hora / Change time”;
   - “Ver mapa / View map”;
   - “Explorar más eclipses / Explore more eclipses”.

No:
- catálogo de 458 eventos;
- 72 ciudades en un select inicial;
- mapa grande como única forma de comprender;
- “Mi colección”;
- geolocalización;
- estrellas HYG;
- cielo simulado continuo;
- Astronomy Engine cargado obligatoriamente si el primer estado puede resolverse con un subset precalculado.

## 4 · Subset inicial curado

### A · Evento principal · 2 agosto 2027 · eclipse solar

Fuente factual principal:
**Instituto Geográfico Nacional / Observatorio Astronómico Nacional**.

Hechos oficiales verificados el 02/10/2026:
- la franja de totalidad cruza el Estrecho de Gibraltar;
- incluye Ceuta y Melilla;
- cubre casi toda Cádiz y parte de Málaga, con zonas meridionales de Granada y Almería;
- en el resto de España se ve parcial;
- el eclipse ocurre por la mañana, alrededor de las 10:50 hora peninsular;
- IGN publica para Cádiz una totalidad de **2 min 54 s**;
- IGN publica la máxima duración en España en Ceuta: **4 min 48 s**;
- fuera de la franja de totalidad el oscurecimiento máximo es al menos del 70 % en España.

Fuente:
https://astronomia.ign.es/eclipses-de-sol-y-luna/eclipse-total-sol-de-2-de-agosto-2027

### B · Cinco lugares para comparar

Los siguientes valores son **CALCULATION**, derivados del snapshot Iris Green con Astronomy Engine 2.1.19 y coordenadas de ciudad.

#### Cádiz
- tipo calculado: total;
- inicio parcial: 09:40:42 CEST;
- inicio fase total calculada: 10:45:22;
- máximo calculado: 10:46:48;
- fin fase total calculada: 10:48:15;
- fin parcial: 11:59:32;
- duración central calculada: **173 s = 2 min 53 s**;
- altura solar calculada en máximo: **37,5°**.

Cross-check:
IGN publica **2 min 54 s** para Cádiz.
Delta del donor: **−1 s**.

#### Ceuta
- tipo calculado: total;
- inicio fase total calculada: 10:45:13 CEST;
- máximo calculado: 10:47:37;
- fin fase total calculada: 10:50:04;
- duración central calculada: **291 s = 4 min 51 s**;
- altura solar calculada en máximo: **38,5°**.

Cross-check:
IGN publica una máxima en España de **4 min 48 s en Ceuta**.
Delta del donor: **+3 s**.

#### Sevilla
- tipo calculado: parcial;
- máximo calculado: 10:47:25 CEST;
- oscurecimiento calculado: **98,2 %**;
- altura solar calculada en máximo: **37,7°**.

Este caso es pedagógicamente importante:
casi todo el disco puede quedar cubierto y aun así **no ser totalidad**.

#### Madrid
- tipo calculado: parcial;
- máximo calculado: 10:51:09 CEST;
- oscurecimiento calculado: **86,3 %**;
- altura solar calculada en máximo: **39,8°**.

#### Barcelona
- tipo calculado: parcial;
- máximo calculado: 10:58:25 CEST;
- oscurecimiento calculado: **81,6 %**;
- altura solar calculada en máximo: **45,2°**.

Los porcentajes/horas de Iris Green son cálculo local, no se presentan como valores oficiales del IGN.

## 5 · Dos casos secundarios, solo después del concepto principal

### 26 enero 2028 · anular de Sol

Objetivo:
explicar que **geometría de eclipse** y **visibilidad real sobre el horizonte** no son lo mismo.

IGN:
- la franja anular cruza la Península de sudoeste a noreste;
- la fase anular completa incluye ciudades como Sevilla, Málaga, Murcia y Valencia;
- en Palma y Barcelona solo se ve el inicio de la fase anular porque el Sol se pone antes de que termine;
- el Sol está muy bajo y el horizonte real es crítico.

Fuente:
https://astronomia.ign.es/es/web/guest/eclipses-de-sol

Donor calculado:
- Sevilla: annular, máximo 17:55:51, altura solar 7,3°;
- Madrid: parcial, máximo 17:55:34, altura 4,4°;
- Barcelona: geometría annular en el cálculo, máximo con Sol a ~0,2°;
- Palma: geometría annular en el cálculo, máximo con Sol a ~0,4°.

Regla V2:
**no basta con etiquetar “anular”**.
Hay que indicar qué fases están realmente sobre el horizonte.

### 20–21 febrero 2027 · eclipse lunar penumbral

Objetivo:
contrastar un eclipse de Luna con uno de Sol.

NASA lo clasifica como penumbral y visible desde Europa, entre otras regiones.

Fuente:
https://science.nasa.gov/eclipses/future-eclipses/

Snapshot Iris Green:
- máximo: 20/02/2027 23:12:44 UTC;
- Luna calculada a ~54,7° de altura desde Madrid en el máximo;
- sin fase umbral.

Mensaje:
un eclipse lunar no depende de una franja de sombra estrecha sobre la superficie como el eclipse solar; puede verse desde una región nocturna mucho mayor.

## 6 · Qué información aparece al entrar

Solo:

- evento;
- fecha;
- dos lugares comparados;
- tipo visto desde cada lugar;
- hora aproximada del máximo;
- dato de duración u oscurecimiento que ayude a comparar;
- etiqueta de procedencia:
  - IGN = dato publicado;
  - Iris Green + Astronomy Engine = cálculo;
- explicación de por qué cambia con el lugar;
- aviso de seguridad.

## 7 · Qué queda en depth

KEEP bajo demanda:

- mapa del 2/08/2027;
- mapa del 26/01/2028;
- evento histórico 12/08/2026;
- 72 lugares del donor;
- fases/horas completas;
- altura/azimut;
- simulador minuto a minuto;
- eclipses lunares;
- seguridad ampliada;
- explicación total/anular/parcial;
- nodos orbitales y por qué no hay eclipse cada mes;
- Saros;
- catálogo global 2000–2100:
  - 228 solares;
  - 230 lunares;
  - 458 total;
- descarga JSON;
- fuentes/metodología.

Mi colección/localStorage:
**DEFER fuera del V2 mínimo**.

## 8 · Qué NO debe cargar al inicio

Donor actual:

- `eclipses.json` = **191.009 B**;
- `cielo-fondo.json` = **411.894 B**;
- JSON eager total = **602.903 B**;
- Astronomy Engine local = **116.424 B**, descargado mediante script `defer`;
- `ig-eclipses.js` = **48.992 B**;
- HTML ES actual = **229.578 B**;
- HTML EN actual = **229.755 B**.

V2 mínimo no necesita al entrar:

- `cielo-fondo.json`;
- estrellas HYG;
- catálogo 2000–2100;
- 72 lugares;
- Astronomy Engine si el primer compare usa valores precalculados;
- canvas completo;
- geolocalización;
- colección.

Recomendación de producto:
primer viewport desde un **subset local pequeño y versionado**.
Astronomy Engine se carga cuando la persona pide cálculo dinámico, otro lugar o timeline detallado.

## 9 · Contrato epistemológico

### REAL_DATA

En V2 significa:
**dato publicado o geodato fuente**, no una animación.

Incluye:
- fecha/tipo y zona de visibilidad publicados por IGN/NASA;
- duración oficial publicada por IGN;
- recomendaciones oficiales de seguridad;
- costa/mapa base Natural Earth;
- coordenadas de lugares cuando proceden de Natural Earth.

Las 23 coordenadas con `src=iris` son metadata editorial Iris Green, no Natural Earth.

### CALCULATION

Incluye:
- búsqueda de eclipses con Astronomy Engine;
- horas calculadas;
- circunstancias locales;
- tipo local;
- oscurecimiento;
- altura/azimut;
- fases;
- catálogo global calculado;
- rejilla cartográfica de 0,1°;
- conversiones UTC → hora local.

Debe mostrarse como:
**“Calculado con Astronomy Engine 2.1.19 · snapshot 24/09/2026”**.

### SIMULATION

Incluye:
- discos Sol/Luna dibujados;
- avance temporal;
- cielo Canvas;
- color/oscurecimiento visual;
- corona dibujada;
- estrellas visibles;
- brillo de cielo;
- camino animado del Sol.

La simulación **no** es:
- vídeo real;
- observación;
- fotografía;
- predicción de nubosidad;
- fotometría física exacta.

## 10 · Límites e incertidumbre

### Astronomy Engine

Donor:
`astronomy-engine 2.1.19 (Don Cross) · MIT`.

El proyecto Astronomy Engine documenta:
- modelos VSOP87/NOVAS;
- validación contra NOVAS/JPL Horizons;
- objetivo general de precisión angular dentro de ±1 arcmin para sus cálculos astronómicos.

Fuente:
https://github.com/cosinekitty/astronomy

Importante:
ese ±1 arcmin **no se traduce automáticamente en una barra de error temporal para cada contacto de eclipse**.

### Límites V2

1. coordenada de centro urbano ≠ posición exacta de la persona;
2. 23/72 lugares tienen coordenada editorial `src=iris`;
3. mapas del donor usan rejilla 0,1°;
4. no hay meteorología;
5. no hay edificios, montañas ni horizonte local real;
6. el relieve del borde lunar no está modelado en el donor;
7. ese relieve puede cambiar la duración central varios segundos;
8. Astronomy Engine advierte que un eclipse local calculado puede quedar parcial o totalmente bajo el horizonte;
9. por tanto cada fase debe combinarse con la altura del Sol para hablar de “visible”;
10. el caso Barcelona/Palma 2028 demuestra el problema: la geometría annular existe, pero el Sol se pone durante la fase;
11. el cálculo V2 no sustituye las efemérides oficiales del IGN para planificar una observación en España.

## 11 · Seguridad / child-safe

SAFE_BY_DEFAULT.

En primer viewport:

ES:
**“Nunca mires directamente al Sol durante una fase parcial o anular. Usa un visor solar adecuado que cumpla ISO 12312-2. En un eclipse total, solo se puede mirar sin protección durante la totalidad completa.”**

EN:
**“Never look directly at the Sun during a partial or annular phase. Use a proper solar viewer that complies with ISO 12312-2. During a total eclipse, unprotected viewing is safe only during complete totality.”**

Además:
- supervisión adulta para menores al usar visores solares;
- gafas de sol normales no sirven;
- cámaras, prismáticos y telescopios necesitan filtro solar diseñado para el instrumento, colocado delante de la óptica;
- proyección indirecta = alternativa segura;
- eclipse lunar = observación ocular normal segura.

Fuentes verificadas:
- NASA Eclipse Viewing Safety:
  https://science.nasa.gov/eclipses/safety/
- IGN · observación segura:
  https://astronomia.ign.es/web/guest/eclipse-parcial-de-sol-8-de-abril-2024

Decisión de contenido:
la mención actual a “marca CE” **no se hereda automáticamente** al V2 mínimo porque no fue verificada en el set de fuentes usado para este microbloque. Se conserva la exigencia ISO 12312-2.

Privacidad:
- 0 geolocalización automática;
- V2 mínimo no necesita geolocalización;
- si se reintroduce en depth, solo tras acción explícita, sin persistir coordenadas.

## 12 · Teclado / touch / pointer

Obligatorio:

- lista/selector DOM de lugares;
- selección por click/tap/Enter/Space;
- target >=44 px;
- mapa no es método único;
- timeline con botones “inicio / máximo / fin”;
- range nativo solo como complemento;
- flechas/teclado funcional;
- foco visible;
- volver a comparación;
- no cientos de tab stops.

Donor actual:
el mapa acepta click/tap, pero no ofrece selección espacial arbitraria por teclado.
La lista de ciudades sí aporta alternativa estructurada.

Si el mapa V2 sigue siendo interactivo:
**REWORK de su interacción** o mantenerlo únicamente como visual complementario.

## 13 · NORMAL / REDUCED / NONE

### NORMAL
- animación solo tras acción;
- reproducción del eclipse controlable;
- pausa y salto a fases.

### REDUCED
- **sin reproducción continua obligatoria**;
- cambio entre inicio / máximo / fin;
- fades mínimos;
- sin desplazamiento de cámara.

### NONE
- tres estados estáticos;
- texto con fases/horas;
- mismo contenido factual;
- sin timer/loop.

Donor actual:
`prefers-reduced-motion` cambia la velocidad de reproducción, pero **sigue siendo una animación continua** cuando se pulsa play.

Resultado:
`MOTION_CONTRACT_REWORK_REQUIRED`.

## 14 · 320 / 390

No mapa ancho obligatorio.

### 320–390
- pregunta;
- un evento;
- un lugar seleccionado;
- comparación con un segundo lugar debajo;
- discos de máximo estáticos;
- selector de lugar;
- aviso de seguridad;
- datos esenciales;
- depth después.

Mapa:
- debajo;
- pan/zoom no necesarios para primera experiencia;
- lista equivalente siempre disponible.

## 15 · HUMAN QA

PASS si una persona puede:

1. explicar que el mismo eclipse cambia según la posición sobre la Tierra;
2. entender por qué Cádiz puede tener totalidad mientras Madrid ve parcialidad;
3. distinguir total / parcial / anular;
4. entender que “98 % cubierto” no equivale a totalidad;
5. distinguir `REAL_DATA`, `CALCULATION` y `SIMULATION`;
6. entender que un cálculo puede existir aunque una fase quede bajo el horizonte;
7. reconocer que clima/horizonte/relieve local no están simulados;
8. encontrar la referencia oficial del IGN;
9. conocer la regla básica de seguridad solar antes de intentar observar;
10. usar teclado y touch;
11. completar la experiencia en 320 y 390;
12. usar NORMAL / REDUCED / NONE sin perder información;
13. llegar a 2028, lunares y catálogo completo solo cuando lo pide;
14. completar el V2 mínimo sin geolocalización.

FAIL si:
- el mapa o canvas es obligatorio para entender el concepto;
- “anular” se presenta como totalmente visible sin comprobar horizonte;
- datos calculados parecen efemérides oficiales;
- la simulación parece una grabación/fotografía;
- el cielo se mueve sin acción;
- reduced motion mantiene animación continua como única experiencia;
- la seguridad solar queda escondida en depth.

## 16 · Assets

### Inventario específico
`img/intereses/eclipses/tarjeta.webp`
- 3.364 B;
- añadido en commit `d52584344240deb352f712debd19e9e7ae76bdd2`;
- no se localiza manifest individual de inputs/licencia;
- estado V2: `PROVENANCE_UNKNOWN`.

### Assets reutilizables no raster
- mapas SVG/paths derivados de Natural Earth: donor reutilizable con provenance;
- diagramas SVG first-party del contenido: donor;
- Canvas/SVG/DOM procedural: preferido para V2 mínimo.

### Decisión

`NO_NEW_ASSETS_REQUIRED`

No Batch nuevo.

## 17 · Marcador

`INTEREST_04_ECLIPSES_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

Después:
**STOP SENDA**.
