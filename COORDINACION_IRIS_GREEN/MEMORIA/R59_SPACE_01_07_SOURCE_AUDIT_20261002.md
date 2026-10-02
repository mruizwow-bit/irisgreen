# R59 · ESPACIO 01–07 · AUDITORÍA DE FUENTES

Fecha: 02/10/2026  
Owner: Senda · R59  
Scope: **inventario factual, sin modificar 02–07**

## 0. Regla

Estados usados:

- `KEEP` = fuente/estrategia sirve;
- `REPLACE_SOURCE_PATH` = dato sirve, canal de actualización no;
- `VERIFY_AT_BUILD` = servicio existe pero no es dependencia actual;
- `NOT_USED` = no forma parte del interés actual;
- `NOT_WIRED` = no existe implementación profunda/source contract actual en main;
- `SNAPSHOT` = datos congelados/locales;
- `LIVE` = consulta externa en runtime.

No confundir `NOT_USED/NOT_WIRED` con “servicio roto”.

---

## 1 · Cielo nocturno

### Runtime auditado en main

- `es/intereses/cielo/cielo.json`
  - blob: `f8594587d14c0ac51f33e424507c08be0429b680`
- `es/intereses/cielo/index.html`
  - blob: `ad60a416ad58ee10c91fbb46e8043465252f6c63`
- `assets/ig-cielo.js`
  - blob: `7b51b1fb364941dc11b487eddbd20ca825526a30`
- `assets/ig-cielo-vivo.js`
  - blob: `57f7f0b07f7e04016331e9b5a172021c6682086c`

Conclusión:
**no existe NASA-live ni JPL-live.**
El cielo es local/offline.

### HYG
Actual:
- HYG v4.1;
- 8.920 estrellas del subconjunto visual;
- snapshot local.

Estado:
`WORKS_RUNTIME · SNAPSHOT · REPLACE_SOURCE_PATH_FOR_REFRESH`.

Hallazgo:
el repositorio GitHub de astronexus fue archivado el 14/02/2025 y el autor indica que futuras actualizaciones viven en Codeberg.

Consecuencia:
- el snapshot local NO se rompe;
- GitHub viejo NO debe usarse como fuente de actualización futura;
- no afirmar que v4.1 es la versión actual sin revisar el host vivo al refrescar.

### IAU WGSN
Snapshot actual:
- 597 nombres;
- incluye años hasta 2026;
- muestra auditada contiene:
  Alaybasan, Áldu, Alfarasalkamil, Apamvatsa, Apdu, Bagu, Blaze Star y Bodu.

La IAU anunció 59 nombres adoptados en 2025 y publicados en febrero de 2026.

Estado:
`WORKS · SNAPSHOT · KEEP`.

Mejora:
autoridad editorial futura = catálogo oficial IAU primero.

### IAU constelaciones
Uso:
- nombres/abreviaturas;
- límites Delporte;
- líneas/datos derivados vía d3-celestial.

Estado:
`WORKS · SNAPSHOT · KEEP`.

### JPL
Uso:
elementos keplerianos aproximados incrustados localmente.

La fuente oficial JPL sigue disponible y declara la tabla principal válida para 1800–2050; para precisión alta remite a Horizons.

Estado:
`WORKS · LOCAL_FORMULA · KEEP_WITH_RANGE`.

### NASA
Uso actual en Cielo:
**ninguno**.

Estado:
`NOT_USED`.

Decisión:
no añadir NASA como identidad/dependencia.

---

## 2 · Planetas y sistema solar

Runtime:
`assets/ig-sistema-solar.js`
blob:
`05d8bbc0d00c7715f3b96352cfef0d4a10287513`.

Fetches:
solo same-origin:
- `/es/intereses/sistema-solar/sistema-solar.json`
- `/es/intereses/sistema-solar/cielo-fondo.json`

No NASA/JPL live en navegador.

### NASA
Usa snapshots/facts y créditos.

Estado:
`WORKS_AS_SOURCE · SNAPSHOT · KEEP`.

Corrección editorial futura:
no usar “todos los datos de la NASA y del JPL”; solo los campos seleccionados.

### JPL
Usa:
- approximate planetary positions;
- physical parameters;
- satellite elements/discovery.

Las páginas oficiales JPL auditadas responden y muestran ephemerides/referencias 2025–2026.

Estado:
`WORKS_AS_SOURCE · SNAPSHOT · KEEP`.

### IAU
Usa nomenclatura/coordenadas/elementos rotacionales como referencia.

Estado:
`KEEP`.

### HYG
`cielo-fondo.json` declara:
“HYG Database v4.1 ... CC BY-SA 4.0”.

Contiene 8.920 estrellas.

Estado:
`WORKS_RUNTIME · SNAPSHOT · REFRESH_PATH_SAME_AS_01`.

---

## 3 · Exoplanetas

Runtime:
`assets/ig-exoplanetas.js`
blob:
`eaa48badc488e58d1cef4dd0fd0a4f7ed8b63653`.

Fetches:
same-origin:
- `exoplanetas.json`;
- `cielo-fondo.json`.

### NASA Exoplanet Archive
Snapshot de producto:
consulta 24/09/2026;
el runtime indica 6.366 planetas.

Auditoría pública 02/10/2026:
el Archive muestra **6.375 confirmed planets** con estado 01/10/2026.

Interpretación:
el snapshot **funciona**, pero ya no representa el contador vivo.

Estado:
`WORKS · SNAPSHOT_DRIFT_EXPECTED · KEEP_AS_CURATED_SNAPSHOT`.

Regla:
si se muestra conteo, mostrar fecha del snapshot.

### TAP
El servicio oficial TAP está documentado y disponible para:
- PS;
- PSCompPars;
- otras tablas.

Soporta selección explícita de columnas y queries sync/async.

Estado:
`AVAILABLE · NOT_RUNTIME_DEPENDENCY · VERIFY_AT_BUILD_FOR_DEPTH_SEARCH`.

Decisión:
profundidad futura puede usar TAP acotado;
primer viewport NO.

### HYG/IAU
Fondo de cielo local reutilizado.

Estado:
`KEEP_SNAPSHOT`, sujeto al refresh path de 01.

### JPL
No es dependencia principal de 03.

Estado:
`NOT_USED`.

---

## 4 · Eclipses

Runtime:
`assets/ig-eclipses.js`
blob:
`52a29d3e2bfcda5b9ab8dde9e2133750ad4ad050`.

Usa:
- astronomy-engine 2.1.19 autoalojado;
- JSON local;
- IGN para planificación/horas;
- Natural Earth;
- HYG como fondo estelar.

No NASA/JPL live.

### HYG
Estado:
`WORKS · SNAPSHOT · KEEP_BACKGROUND`.

### NASA / JPL / IAU
No son dependencia primaria del runtime actual.

Estado:
`NOT_USED_AS_PRIMARY_SOURCE`.

Conclusión:
no “arreglar NASA” para Eclipses.

---

## 5 · Lluvias de estrellas

En el árbol main auditado no aparece una ruta profunda dedicada equivalente a 01–04.

Estado de wiring:
`NOT_WIRED`.

NASA/JPL/IAU/HYG:
no existe contrato actual que pueda calificarse como roto.

Decisión futura R58:
- HYG puede ser fondo de estrellas;
- fechas/radiantes necesitan autoridad específica;
- no escogerla en este micro-bloque.

---

## 6 · Exploración espacial

No se ha identificado ruta profunda dedicada en main en este audit.

Estado:
`NOT_WIRED`.

NASA:
candidato factual para milestones/mission facts,
pero NO existe dependencia runtime que esté fallando.

Decisión R58:
- 12–20 hitos curados;
- snapshot factual;
- búsqueda de misión bajo demanda si se autoriza.

NASA no define la estética.

---

## 7 · ISS / satélites

No se ha identificado ruta profunda dedicada en main en este audit.

Estado:
`NOT_WIRED`.

NASA/JPL/IAU/HYG:
sin dependencia actual que pueda declararse “rota”.

Decisión futura:
la fuente para paso ISS/posición se seleccionará cuando se abra 07.
No inventarla en Cielo V2.

---

# Resumen ejecutivo

| ID | Interés | HYG | IAU | JPL | NASA | Runtime actual |
|---|---|---|---|---|---|---|
| 01 | Cielo | KEEP snapshot / refresh path | KEEP | KEEP formula 1800–2050 | NOT_USED | local/offline |
| 02 | Sistema solar | KEEP background | KEEP | KEEP | KEEP snapshot | local/offline |
| 03 | Exoplanetas | KEEP background | KEEP context | NOT_USED | KEEP snapshot; TAP depth | local/offline |
| 04 | Eclipses | KEEP background | not primary | not primary | not primary | local/offline |
| 05 | Lluvias | not wired | not wired | not wired | not wired | NOT_WIRED |
| 06 | Exploración | n/a | n/a | n/a | future curated source | NOT_WIRED |
| 07 | ISS | n/a | n/a | future decision | future decision | NOT_WIRED |

## Problemas reales encontrados

1. **HYG refresh path**
   - GitHub upstream archivado;
   - actualizar ingest/source URL antes de refrescar Cielo.

2. **Exoplanet snapshot drift**
   - producto: 6.366 (24/09);
   - NASA Archive: 6.375 (01/10);
   - no es bug si se etiqueta snapshot;
   - sí sería bug llamarlo contador live.

3. **Copy “live”**
   - Cielo se calcula localmente;
   - “en directo” puede sugerir un servicio live inexistente.

4. **Rango JPL**
   - fórmula aproximada no debe extrapolarse fuera de su rango sin otro método.

## No se encontró

- NASA live roto en Cielo;
- JPL API roto en Cielo;
- dependencia externa necesaria para que 01 funcione;
- fuente rota en 05–07: todavía no están wired.

## Dependencias que pueden requerir Nube más adelante

Solo si Astra abre el bloque:
- refresh reproducible de HYG desde el host vivo;
- pin/version/hash del próximo snapshot;
- pipeline de refresh NASA Exoplanet Archive;
- source contract de 05/07.

No se solicita cambio a Nube desde este documento.

Estado:
`R59_SPACE_01_07_SOURCE_AUDIT_COMPLETE`


---

# Fuentes públicas verificadas el 02/10/2026

- HYG GitHub archivado / aviso de traslado:
  https://github.com/astronexus/HYG-Database
- HYG LICENSE:
  https://github.com/astronexus/HYG-Database/blob/main/LICENSE
- IAU · 59 nombres de estrellas publicados en 2026:
  https://www.iau.org/IAU/News/Ann2026/New-Star-Names-2026.aspx
- JPL · Approximate Positions of the Planets:
  https://ssd.jpl.nasa.gov/planets/approx_pos.html
- JPL · Planetary Satellite Physical Parameters:
  https://ssd.jpl.nasa.gov/sats/phys_par/
- JPL · Planetary Satellite Mean Elements:
  https://ssd.jpl.nasa.gov/sats/elem/
- NASA Exoplanet Archive:
  https://exoplanetarchive.ipac.caltech.edu/
- NASA Exoplanet Archive · TAP:
  https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html

Nota de evidencia:
Codeberg no fue accesible al crawler web de esta sesión por robots.txt. Por tanto este audit NO afirma qué número de versión HYG es actualmente el último en Codeberg. Solo afirma, con fuente primaria GitHub del autor, que el repositorio GitHub antiguo está archivado y que futuras actualizaciones se trasladaron a Codeberg.
