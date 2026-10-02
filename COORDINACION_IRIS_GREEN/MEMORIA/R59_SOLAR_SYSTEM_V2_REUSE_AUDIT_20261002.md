# R59 · INTERÉS 02 · SISTEMA SOLAR V2 · DONOR / ASSET REUSE AUDIT

Fecha: 02/10/2026  
Owner: **Senda · R59**  
Estado: `INTEREST_02_SOLAR_SYSTEM_V2_PRODUCT_AND_ASSET_AUDIT_PASS`

Scope:
**producto + auditoría de reutilización**.

No código.  
No imágenes.  
No Batch 02.  
No integración.

## 1. Árbol auditado

- `/es/intereses/sistema-solar/`
- `/en/interests/solar-system/`
- `assets/ig-sistema-solar.js`
- `assets/ig-sistema-solar-3d.js`
- `es/intereses/sistema-solar/sistema-solar.json`
- `es/intereses/sistema-solar/cielo-fondo.json`
- `img/intereses/sistema-solar/*.webp`
- `img/intereses/sistema-solar/lunas/*.webp`
- `img/intereses/sistema-solar/tex/*`
- `img/intereses/sistema-solar/tex/CREDITOS.txt`

## 2. KEEP / REWORK / DROP

| Donor | Decisión V2 | Qué se conserva | Qué cambia |
|---|---|---|---|
| Rutas ES/EN | **KEEP** | URLs, hreflang/canonical como donor | contenido/jerarquía del primer viewport |
| HTML actual | **REWORK** | fichas, facts, fuentes, fallback sin 3D | deja de empezar como enciclopedia/secciones |
| `ig-sistema-solar.js` | **REWORK** | snapshots same-origin, cálculos locales, helpers, lazy launch, fallback | scope inicial, eager starfield, colección, orquestación |
| `ig-sistema-solar-3d.js` | **REWORK** | renderer donor, geometría/órbitas, texture mapping, focus/camera concepts | 9 targets iniciales, motion on-demand, budget, lifecycle, UI |
| `sistema-solar.json` | **KEEP** | fuentes, 14 cuerpos, 70 lunas, propiedades, textura/provenance | consumir subset primero; snapshot/date visible |
| `cielo-fondo.json` | **DROP del entry de 02** | puede seguir siendo donor compartido de Cielo | Sistema Solar V2 no carga 412 kB de estrellas al entrar |
| 9 renders Sol+planetas | **KEEP** | fallback/comparación/profundidad | no se convierten automáticamente en hero art |
| 6 renders de lunas seleccionadas | **KEEP** | Luna, Io, Europa, Ganímedes, Encélado, Titán | lazy/contextual |
| otras lunas/renders | **KEEP depth** | donor factual/visual | no primer viewport |
| 5 planetas enanos | **KEEP depth** | facts y assets | no primer viewport |
| tabla “Dónde están hoy” | **REWORK depth** | cálculo local | acción secundaria, no bloque inicial |
| tabla científica | **KEEP depth** | datos y comparaciones | no primer viewport |
| Mi colección/localStorage | **REWORK / DEFER** | idea reutilizable | fuera del V2 mínimo; persistencia solo con contrato actual |
| `tarjeta.webp` | **NO reutilizar en V2 hasta pin de provenance** | puede seguir siendo donor del índice actual | exacta composición de inputs no está individualizada |

## 3. Qué existe hoy

### Datos
Snapshot:
`2026-09-24`.

Incluye:
- Sol;
- 8 planetas;
- 5 planetas enanos;
- 70 lunas;
- elementos orbitales;
- propiedades físicas;
- 38 entradas de texturas con autor/licencia/URL.

### Assets

Inventario actual:

- 15 archivos top-level;
- 19 renders de lunas;
- 38 texturas de cuerpo/anillos;
- `CREDITOS.txt`.

Total de archivos de imagen/creditos auditado en esos tres niveles:
**73 archivos** contando `CREDITOS.txt`.

El JSON machine-readable clasifica 72 assets visuales:
- **71** → `ASSET_REUSE_OK`;
- **0** → `ASSET_REPLACEMENT_REQUIRED` para el V2 mínimo;
- **1** → `PROVENANCE_UNKNOWN`: `tarjeta.webp`.

“ASSET_REUSE_OK” aquí significa:
**provenance/licencia suficientemente documentadas para planificar reutilización**.
No equivale a clearance jurídico final de Lex.

## 4. Primer subset V2 ya cubierto

### Sol + 8 planetas

Existen las texturas necesarias.

Si se transfirieran todas las texturas actuales del subset de una vez, sumarían aproximadamente:

**926.877 bytes · 905,2 KiB**

Esto NO es un presupuesto aprobado; demuestra por qué Motor debe decidir lazy/renderer con medición.

Los renders 2D first-party equivalentes de Sol + 8 planetas pesan juntos aproximadamente:

**99.394 bytes · 97,1 KiB**

Son un fallback/depth útil.

### Seis lunas contextuales

- Luna;
- Io;
- Europa;
- Ganímedes;
- Encélado;
- Titán.

Texturas actuales:
**256.830 bytes · 250,8 KiB**

Renders 2D actuales:
**21.010 bytes · 20,5 KiB**

Conclusión:
**no falta ningún asset obligatorio para el V2 mínimo**.

## 5. Derechos / provenance

### Solar System Scope

Actualmente publica sus texturas bajo:
**CC BY 4.0**.

En el donor se usan para:
- Sol;
- Luna;
- Júpiter;
- Saturno;
- Urano;
- Neptuno;
- Tierra;
- etc. según manifest.

Resultado:
`ASSET_REUSE_OK`
con atribución.

### NASA / JPL

Assets/mapas documentados incluyen:
- Mercurio;
- Marte;
- Fobos;
- Tritón;
- otros casos NASA/PDS.

Resultado:
`ASSET_REUSE_OK`
con:
- crédito indicado;
- sin sugerir endorsement;
- comprobar excepciones de terceros al publish final.

### Stellarium-derived CC BY

Muchos mapas de lunas/cuerpos vienen de contribuciones procesadas y acreditadas vía Stellarium.

Resultado:
`ASSET_REUSE_OK`
con atribución y mantenimiento de cadena de provenance.

### Calisto · CC BY-SA

El donor declara:
**CC BY-SA**.

Resultado técnico:
`ASSET_REUSE_OK`.

Condición:
ShareAlike/atribución no pueden desaparecer dentro de una licencia global más permisiva.

Se recomienda:
**Lex review del packaging final** antes de publicación de un derivado.

No obliga a sustituir Calisto para V2 mínimo porque Calisto no pertenece al subset inicial de 6 lunas.

### Eris / Haumea / Makemake

Superficies marcadas como:
**recreación/reconstruction**.

Resultado:
`ASSET_REUSE_OK`
solo si se conserva esa etiqueta epistemológica.

No usarlas como:
“superficie observada real”.

No forman parte del primer viewport.

## 6. Renders first-party

`img/intereses/sistema-solar/*.webp` y `lunas/*.webp` están documentados como:

**renders por ordenador hechos por Iris Green con los mapas acreditados**.

Eso significa:
- composición/render = first-party;
- los derechos/atribución del mapa base siguen viajando con el render;
- “first-party” no borra la licencia del input.

KEEP:
- fallback;
- comparación;
- depth;
- no-JS/static.

No:
convertirlos automáticamente en identidad visual E4 sin review perceptiva.

## 7. `tarjeta.webp`

Uso actual:
thumbnail de Sistema Solar en `/es/intereses/`.

Existe una afirmación general de que los top-level WebP son renders Iris Green, pero no hay un manifest individual que diga qué inputs concretos componen `tarjeta.webp`.

Estado:
`PROVENANCE_UNKNOWN`.

Decisión:
- no bloquear la página existente;
- NO heredarlo como asset de Sistema Solar V2;
- si el índice futuro quiere mantenerlo, pin de provenance o sustitución separada.

## 8. Runtime donor

### Lo bueno

- 3D se carga bajo acción;
- WebGL tiene fallback;
- facts/tablas sobreviven sin 3D;
- posición planetaria es local;
- fecha restringida a 1800–2050;
- ES/EN;
- assets same-origin;
- datos fuente y credits están explícitos.

### Lo que V2 corrige

El JS principal actualmente carga:
- `sistema-solar.json`;
- **`cielo-fondo.json` también**.

Eso ocurre antes de que la persona abra la vista interactiva.

V2:
`DROP_EAGER_CIELO_FONDO`.

El bundle 3D actual pesa:
**596.780 bytes**.

No se rechaza por tamaño desde producto.
Se clasifica:
`REWORK`
y Motor tendrá que demostrar presupuesto real si lo reutiliza.

## 9. “Dónde están hoy”

La función es válida como cálculo.

KEEP:
- elementos JPL aproximados;
- fecha/hora;
- posición/distancia;
- constelación.

REWORK:
- no se presenta antes de la experiencia;
- no se denomina feed live;
- queda como depth/action.

## 10. Necesidades REALES de assets

### Para V2 mínimo
**NINGUNA.**

No solicitar a Atlas:
- nuevos planetas;
- nueva Tierra;
- nuevas lunas;
- nuevo Sol;
- nuevos fondos estelares;
- nuevos planetas enanos.

### Posibles necesidades futuras, NO ordenadas
Solo si HUMAN QA/Astra determina que el donor visual no alcanza E4:

- sustitución/refinamiento de una textura concreta;
- material/normal map puntual;
- nuevo thumbnail de catálogo con provenance exacta;
- representación de una reconstrucción con lenguaje visual más claro.

Eso NO es Batch 02 todavía.

## 11. Referencias de derechos verificadas el 02/10/2026

- Solar System Scope textures:
  https://extension.solarsystemscope.com/textures/
- NASA Images and Media Usage:
  https://www.nasa.gov/nasa-brand-center/images-and-media/
- JPL Image Use Policy:
  https://www.jpl.nasa.gov/jpl-image-use-policy/
- donor interno:
  `img/intereses/sistema-solar/tex/CREDITOS.txt`

## 12. Resultado

Producto:
`SOLAR_SYSTEM_V2_SPEC_DEFINED`.

Donor:
`RICH_DONOR_KEEP_DATA__REWORK_EXPERIENCE`.

Assets:
`NO_NEW_ASSETS_REQUIRED_FOR_V2_MINIMUM`.

Batch 02:
`NOT_REQUESTED`.

Marcador:
`INTEREST_02_SOLAR_SYSTEM_V2_PRODUCT_AND_ASSET_AUDIT_PASS`.

STOP.
