# R59 · INTERÉS 04 · ECLIPSES V2 · DONOR / REUSE AUDIT

Fecha: 02/10/2026  
Owner: **Senda · R59**  
Estado: `INTEREST_04_ECLIPSES_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

Scope:
producto + contenido factual + reutilización.

No runtime. No imágenes. No main.

## 1 · Precedencia y árbol real

Orden:
#323 comentario `5957711739`.

Main leído al inicio:
`3e92408980060722653409db6403e68881c8acf6`.

Main releído antes de registrar:
`adc067ab61e9532c7b462ce1711c49df53c4c7cf`.

Comparación entre ambos:
**0 cambios en rutas/JS/CSS/JSON/Astronomy Engine de Eclipses**.

Por tanto la auditoría no queda stale por el avance de main.

## 2 · Archivos auditados

- `/es/intereses/eclipses/`
- `/en/interests/eclipses/`
- `es/intereses/eclipses/eclipses.json`
- `assets/ig-eclipses.js`
- `assets/ig-eclipses.css`
- `assets/astronomy-engine-2.1.19.min.js`
- `img/intereses/eclipses/tarjeta.webp`
- dependencia actual:
  - `es/intereses/sistema-solar/cielo-fondo.json`

Hashes observados:
- eclipses.json: `11660e752bd4afdc8c227fb610c412024ab80b3c`
- ig-eclipses.js: `52a29d3e2bfcda5b9ab8dde9e2133750ad4ad050`
- ig-eclipses.css: `41a84c6a890c57446e278c4e9d28db8e0a95b1f5`
- astronomy-engine-2.1.19.min.js: `3aa017acedcb4b0ee5a7d7dd3aa9b9218cdbbaac`
- ES index: `6d885d0beb463a4e1c35230b20e923df7619a957`
- EN index: `941e5670b890fe11621c5a519d36c6e38dbb63d7`
- tarjeta.webp: `2ac47e17d3558e02f5de7189873a96881bb8785b`

## 3 · Snapshot / coverage

`eclipses.json`:
- fecha: **2026-09-24**;
- motor: **Astronomy Engine 2.1.19**;
- 72 ciudades/lugares;
- 49 coordenadas `src=ne`;
- 23 coordenadas `src=iris`;
- solares globales 2000–2100: **228**;
- lunares globales 2000–2100: **230**;
- catálogo total: **458**;
- circunstancias solares locales: 2024–2039 en las listas actuales;
- eclipses lunares contextualizados para España: **39**, 2024–2040.

## 4 · Runtime donor actual

`ig-eclipses.js`:

- usa Astronomy Engine local, no API astronómica remota;
- calcula localmente:
  - `SearchLocalSolarEclipse`;
  - `NextLocalSolarEclipse`;
  - posiciones Sol/Luna;
  - horizonte;
  - oscurecimiento geométrico;
- default:
  - Madrid;
  - 2/08/2027;
- el tiempo no avanza automáticamente;
- “Play” es acción explícita;
- existe selector estructurado de ciudad;
- geolocalización solo tras pulsar “Usar mi ubicación”;
- colección usa localStorage.

KEEP como donor técnico:
- motor local;
- no API live;
- acción explícita para play;
- cálculos de lugar/hora;
- estado textual equivalente;
- select de lugares;
- salto a fases.

## 5 · Eager audit

Al cargar la página actual:

### HTML/scripts
- ES index: **229.578 B**;
- EN index: **229.755 B**;
- Astronomy Engine: **116.424 B**;
- ig-eclipses.js: **48.992 B**;
- ig-eclipses.css: **3.648 B**.

### Fetch de datos por JS
- eclipses.json: **191.009 B**;
- cielo-fondo.json: **411.894 B**;
- JSON eager: **602.903 B**.

Aunque el fondo estelar solo enriquece la simulación, se descarga desde el inicio.

Resultado:
- `DROP_EAGER_CIELO_FONDO`;
- `REWORK_EAGER_ECLIPSES_FULL_SNAPSHOT`;
- `REWORK_ASTRONOMY_ENGINE_ENTRY_LOAD`.

No se rechaza Astronomy Engine:
se mueve conceptualmente a cálculo dinámico/depth si el first viewport usa el subset precalculado.

## 6 · KEEP / REWORK / DROP

| Donor | Decisión | Motivo |
|---|---|---|
| rutas ES/EN | **KEEP** | bilingüismo/URLs válidos |
| eclipse 2/08/2027 como evento central | **KEEP** | mejor caso para explicar dependencia del lugar |
| eclipse 26/01/2028 | **KEEP depth** | enseña anularidad + horizonte |
| 12/08/2026 | **KEEP depth/history** | evento pasado relevante |
| eclipses.json | **KEEP donor / REWORK eager** | cobertura rica, demasiado para entrada |
| Astronomy Engine 2.1.19 | **KEEP technical donor / REWORK load** | motor local válido; no obligatorio al entrar |
| ig-eclipses.js | **REWORK** | mezcla cálculo, simulación, geolocation, catálogo y collection |
| ig-eclipses.css | **REWORK** | estilos/patrones útiles, jerarquía V2 distinta |
| Canvas sky | **KEEP technical donor / REWORK product role** | simulación útil en depth; no identidad inicial |
| cielo-fondo.json / HYG | **DROP first experience** | no necesario para explicar eclipse |
| estrellas simuladas | **DROP first experience / optional depth** | decoración/atmósfera, no concepto central |
| mapas SVG 2027/2028 | **KEEP donor / REWORK interaction** | útiles; mapa no puede ser única interacción |
| mapa click→coordenada | **REWORK** | pointer sí; arbitrary keyboard equivalent no |
| 72 lugares | **KEEP depth** | demasiados en first view |
| geolocalización explícita | **DEFER** | no necesaria para V2 mínimo |
| autoplay | **KEEP = none** | donor ya no mueve el tiempo sin acción |
| reduced-motion actual | **REWORK** | reduce velocidad/cadencia, no elimina animación continua |
| catálogo 458 | **KEEP depth** | no first viewport |
| tablas 2000–2100 | **KEEP depth** | gran valor factual, carga cognitiva alta |
| Mi colección/localStorage | **DEFER** | no V2 mínimo |
| seguridad solar | **KEEP concept / REWORK copy/order** | subirla a first experience y usar fuentes verificadas |
| tarjeta.webp | **DROP V2 minimum** | provenance individual no fijada y no necesaria |

## 7 · REAL_DATA / CALCULATION / SIMULATION del donor

### REAL_DATA
- publicación IGN;
- publicación NASA;
- Natural Earth;
- coordenadas Natural Earth.

### CALCULATION
- todos los resultados derivados de Astronomy Engine;
- rejillas/mapas calculados;
- obscuration;
- alt/az;
- contactos;
- conversión horaria.

### SIMULATION
Código Iris Green:
- composición visual;
- cielo/gradientes;
- brillo;
- “corona”;
- estrellas visibles según heurística;
- colinas/horizonte dibujado;
- Sun/Moon movement.

Hallazgo importante:
la función de brillo/estrellas es **heurística de presentación**.
No debe citarse como luminancia física predicha.

## 8 · Astronomy Engine · provenance y límites

Archivo local:
`assets/astronomy-engine-2.1.19.min.js`

Header:
- Astronomy library for JavaScript;
- https://github.com/cosinekitty/astronomy
- MIT License.

Upstream verificado 02/10/2026:
https://github.com/cosinekitty/astronomy

Upstream declara:
- cálculo de posiciones/eventos/eclipses;
- VSOP87 + NOVAS C 3.1;
- tests frente a NOVAS/JPL Horizons;
- objetivo general ±1 arcmin;
- no adecuado para navegación espacial.

Documentación de `SearchLocalSolarEclipse`:
https://github.com/cosinekitty/astronomy/blob/master/source/js/README.md

Advertencia upstream:
un eclipse retornado puede quedar parcial o totalmente invisible por la hora del día.

V2 debe conservar esa distinción.

## 9 · Cross-check oficial del caso 2027

IGN:
https://astronomia.ign.es/eclipses-de-sol-y-luna/eclipse-total-sol-de-2-de-agosto-2027

### Cádiz
- IGN: 2 min 54 s.
- donor Astronomy Engine: 2 min 53 s.
- delta: 1 s.

### Ceuta
- IGN: máxima España 4 min 48 s.
- donor Astronomy Engine: 4 min 51 s.
- delta: 3 s.

Eso apoya el uso didáctico del motor para V2, pero no convierte el cálculo en efeméride oficial.

## 10 · Caso crítico 2028 · visibilidad

IGN:
https://astronomia.ign.es/es/web/guest/eclipses-de-sol

Publica:
- fase anular completa en Sevilla/Málaga/Murcia/Valencia;
- Barcelona/Palma solo ven el principio antes de puesta de Sol;
- baja altura solar.

Donor:
- Barcelona: `k=anular`, máximo con Sol ~0,2°;
- Palma: `k=anular`, máximo ~0,4°;
- fases finales quedan bajo horizonte.

Hallazgo:
`GEOMETRIC_ECLIPSE_KIND != FULL_VISIBLE_PHASE`.

V2 debe modelarlo/explicarlo expresamente.

## 11 · Seguridad factual

NASA:
https://science.nasa.gov/eclipses/safety/

IGN:
https://astronomia.ign.es/web/guest/eclipse-parcial-de-sol-8-de-abril-2024

KEEP:
- visor solar ISO 12312-2;
- gafas normales no sirven;
- filtro delante de óptica;
- proyección indirecta;
- protección siempre en parcial/anular;
- quitar protección solo durante totalidad completa;
- supervisar a menores.

REWORK:
- la afirmación de “marca CE” del donor no se repite en V2 mínimo sin una fuente normativa específica verificada;
- safety sube de una sección posterior a la primera experiencia.

## 12 · Assets / rights

Árbol específico:
- `img/intereses/eclipses/tarjeta.webp` · **3.364 B**.

Alta:
commit `d52584344240deb352f712debd19e9e7ae76bdd2`.

No se localiza manifest individual de:
- input;
- autoría;
- licencia;
- procedimiento de generación.

Estado:
`PROVENANCE_UNKNOWN`.

No se necesita.

Otros visuales:
- mapas/vector: Natural Earth, dominio público según donor;
- SVG explicativos: first-party en HTML;
- Canvas: first-party;
- HYG: CC BY-SA 4.0 según donor, pero no first viewport;
- Astronomy Engine: MIT.

Resultado:
`NO_NEW_ASSETS_REQUIRED`.

## 13 · No hacer

No:
- runtime;
- patch;
- imagen;
- Batch;
- 01–03;
- 05–07;
- main.

## 14 · Marcador

`INTEREST_04_ECLIPSES_V2_PRODUCT_CONTENT_AND_REUSE_PASS`

STOP.
