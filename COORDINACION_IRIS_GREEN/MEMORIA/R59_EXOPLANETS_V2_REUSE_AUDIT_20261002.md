# R59 · INTERÉS 03 · EXOPLANETAS V2 · DONOR / REUSE AUDIT

Fecha: 02/10/2026  
Owner: Senda · R59  
Estado: INTEREST_03_EXOPLANETS_V2_PRODUCT_CONTENT_AND_REUSE_PASS  
Producto auditado contra main: 28e60f0a57876c607a60fb902d3f4421b8cba7ca

## 1. Árbol revisado

- /es/intereses/exoplanetas/
- /en/interests/exoplanets/
- /es/intereses/exoplanetas/lista/
- /en/interests/exoplanets/list/
- assets/ig-exoplanetas.js
- assets/ig-exoplanetas-3d.js
- assets/ig-exoplanetas.css
- es/intereses/exoplanetas/exoplanetas.json
- es/intereses/sistema-solar/cielo-fondo.json como dependencia compartida actual
- img/intereses/exoplanetas/tarjeta.webp

## 2. Estado factual del donor

Snapshot local:
- NASA Exoplanet Archive · PSCompPars;
- consulta 24/09/2026;
- 6.366 planetas;
- 4.775 estrellas;
- 11 métodos;
- método counts: Transit 4.708; Radial Velocity 1.200; Microlensing 289; Imaging 97; resto 72 combinados.

NASA Archive verificado el 02/10 en su página oficial:
- contador fechado 01/10/2026: 6.375 planetas confirmados.

No hay conflicto: son dos cortes temporales diferentes.

## 3. KEEP / REWORK / DROP

| Donor | Decisión V2 | Motivo |
|---|---|---|
| rutas ES/EN | KEEP | URLs y bilingüismo existentes |
| snapshot exoplanetas.json | KEEP donor | fuente local, fechada y suficiente para first experience |
| query/live NASA en navegador | DROP como requisito | actualmente no existe como dependencia; mantener así |
| HTML editorial ES/EN | KEEP depth / REWORK hierarchy | contenido rico útil, pero no debe dominar el inicio |
| “Cómo se descubren” | KEEP contenido / REWORK visual | es el mejor núcleo conceptual para V2 |
| sistemas actuales “que hay que conocer” | KEEP donor | fuente para subset curado; reducir a seis en first layer |
| año a año | KEEP depth | no first viewport |
| récords | KEEP depth | no identidad inicial; revisar precisión/meaning antes de destacar |
| “Parecidos a la Tierra” | KEEP depth con cautela | heurística declarada; nunca = habitable |
| España / nombres propios / estrellas visibles | KEEP depth | contenido editorial valioso |
| catálogo 6.366 | KEEP depth | lista completa separada |
| página lista ES/EN ~1,2 MB | KEEP depth | no eager porque requiere navegación separada |
| assets/ig-exoplanetas.js | REWORK | carga dataset completo + fondo estelar al entrar; mezcla map, search y collection |
| assets/ig-exoplanetas-3d.js | KEEP technical donor / REWORK product role | 3D está correctamente lazy por acción, pero no será la primera experiencia |
| current global 3D map | DROP first viewport / KEEP optional depth | escala/carga/carga cognitiva excesiva para entry |
| cielo-fondo.json | DROP eager | 411.894 B cargados aunque 3D todavía no se abrió |
| full exoplanetas.json eager | REWORK | 910.859 B para una primera capa que solo necesita seis casos |
| localStorage “Mi colección” | DEFER | fuera del V2 mínimo |
| inline SVG method diagrams | KEEP concept / REWORK execution | first-party/code; útiles como donor pedagógico |
| tarjeta.webp | DROP V2 minimum | provenance individual no fijada y no es necesaria |

## 4. Eager / depth audit

Estado actual:
- ig-exoplanetas.js se ejecuta en la página;
- Promise.all carga inmediatamente:
  - /es/intereses/exoplanetas/exoplanetas.json = 910.859 B;
  - /es/intereses/sistema-solar/cielo-fondo.json = 411.894 B;
- total solo de esos dos JSON: 1.322.753 B (~1,26 MiB);
- el 3D sí está bien diferido: ig-exoplanetas-3d.js = 566.030 B y se inyecta solo al pulsar “Abrir vista interactiva”.

Decisión V2:
- KEEP el patrón “3D tras acción”;
- DROP el fondo estelar eager;
- REWORK el dataset completo eager;
- first layer debe poder resolverse con un subset pequeño local;
- full dataset y 3D quedan bajo acción.

## 5. API / TAP

Runtime actual:
- no llama a NASA/TAP;
- no red externa para datos de Exoplanetas;
- usa snapshot same-origin.

KEEP.

TAP se conserva como herramienta de actualización/curación, no como dependencia de entrada.

Fuente oficial:
https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html

## 6. Calidad y limitación de PSCompPars

NASA documenta que PSCompPars:
- tiene una fila por planeta;
- busca ser más completa;
- puede combinar parámetros de referencias distintas;
- puede incluir valores calculados;
- no es necesariamente un conjunto autoconsistente por planeta.

Fuente:
https://exoplanetarchive.ipac.caltech.edu/docs/pscp_about.html

El snapshot compacto Iris Green no conserva:
- err1/err2;
- referencia específica por parámetro;
- flags de procedencia/calculado por campo.

Consecuencia:
- KEEP como donor pedagógico;
- no fingir error bars;
- reducir precisión visual;
- si una fase futura necesita incertidumbre numérica real, crear un subset versionado más rico.

## 7. Assets

Inventario específico de Exoplanetas:
- img/intereses/exoplanetas/tarjeta.webp · 25.630 B.

No se localizan texturas planetarias específicas adicionales en ese árbol.
La visual 3D es procedural/código.

tarjeta.webp:
- commit de alta: 5b0940fa3ab2a91dfd378993042160bd2accbe02;
- mensaje: “feat(interests): integrate bilingual exoplanets and disclose local collection”;
- no hay manifest individual de inputs/licencia localizado;
- estado para V2: PROVENANCE_UNKNOWN;
- no bloquea porque V2 mínimo no lo necesita.

Resultado:
NO_NEW_ASSETS_REQUIRED.

## 8. Derechos / provenance

Datos:
- NASA Exoplanet Archive: mantener acknowledgment indicado en el donor.
- IAU/nombres: mantener trazabilidad separada si se muestran nombres propios.
- límites de constelaciones/d3-celestial: solo depth/map si se reutiliza.
- HYG/cielo-fondo: pertenece al fondo estelar compartido; no es necesario en first layer.

Arte:
- no asumir “está en repo = reutilizable”.
- no usar tarjeta.webp como asset V2 hasta pin de provenance si más adelante se quisiera recuperar.
- no usar recreaciones fotorealistas de superficies de exoplanetas como dato observado.

## 9. Content reuse

KEEP de la página actual:
- explicación de por qué casi nunca se ve el planeta;
- explicación de métodos;
- notas de temperatura de equilibrio;
- cautela de “parecido a la Tierra”;
- sistemas Proxima / TRAPPIST-1 / 51 Peg / PSR B1257+12 / HR 8799;
- estructura de fuentes.

REWORK:
- “todos los datos” como promesa de portada;
- mapa 3D como identidad;
- exceso de secciones antes de la experiencia;
- headline centrado en el número total.

## 10. Necesidades reales

Para V2 mínimo:
- no nuevos PNG;
- no nuevas texturas;
- no fondo estelar;
- no medio NASA;
- no Batch nuevo.

Necesidad de contenido, no de arte:
- subset local pequeño de seis mundos;
- metadatos de snapshot;
- status de campo ausente;
- categorías REAL_DATA / CALCULATION / SIMULATION;
- futura ampliación opcional de error bounds si se decide.

Resultado:
**NO_NEW_ASSETS_REQUIRED**

## 11. Marcador

INTEREST_03_EXOPLANETS_V2_PRODUCT_CONTENT_AND_REUSE_PASS

No runtime.
No imágenes.
No Cielo.
No Sistema Solar.
No 04–07.
No main.
STOP.
