# WEB_EXPANSION_W1_R2_ARCHITECTURE_RESTORED

**Agente:** n.º 4  
**Bloque:** W1-R2-A · arquitectura  
**Issue:** #205  
**PR:** #206  
**Rama:** `agent4/irisgreen-web-expansion-w1-r2-safe`  
**Baseline obligatorio:** `main@e48b51814afed825a92e83a2f6e51ee8a1c85e45`  
**Fecha:** 21/09/2026  
**Estado:** **ARQUITECTURA RESTAURADA A BASELINE · SIN REINCORPORAR CONTENIDO W1**

## 1. Freeze

PR #193 queda fuera de esta vía. No se reutiliza como base y no se corrige encima.

Estados bloqueantes que se mantienen:
- `WEB_EXPANSION_W1_HEADER_REGRESSION_BLOCKED`
- `HOLD_PENDING_VIDEO_GATE`
- `HOLD_PENDING_RESOURCE_GATE`

## 2. Baseline limpio

La rama R2 nació exactamente de:

`e48b51814afed825a92e83a2f6e51ee8a1c85e45`

Antes de añadir documentación/test:
- `status = identical`
- `ahead_by = 0`
- `behind_by = 0`
- archivos distintos = **0**

El diff R2-A actual contiene únicamente cuatro artefactos bajo:

`docs/audits/agent4/expansion-r2/`

No modifica HTML público, assets, scripts, CSS, build, sitemap, indexación ni redirects.

## 3. Verificación directa del contrato de cabecera

Se ejecutó el mismo contrato lógico de `verify_header_contract.py` contra los archivos reales del HEAD R2-A.

Resultado:

```text
PASS
baseline_files_checked = 17/17
es_header_samples = 6/6
en_header_samples = 5/5
production_mutation = false
errors = 0
```

Los 17 blobs críticos coinciden exactamente con los hashes del baseline.

En las muestras ES/EN se conservan:
- navegación principal del baseline;
- `#a11yBtn` · Lectura / Reading;
- `#plBtn` · Música / Music;
- control de idioma del template correspondiente;
- `interfaz-comun.js`;
- `lectura-accesible.js`;
- `musica.js`.

El baseline contiene variantes históricas de etiqueta/destino entre templates. R2-A **no las normaliza**, porque Astra ha prohibido modificar infraestructura global desde este frente.

## 4. Responsive, teclado y accesibilidad global

CI del HEAD `7ae54ee0456d236ae3aa11ebd8ef0a6424d3575d`:

**SUCCESS**
- Comprobar WCAG en navegador v2 · run 35594425921
- Comprobar WCAG flujos de teclado · run 35594425916
- Comprobar WCAG orientación · run 35594425745
- Auditar WCAG tamaño de objetivos · run 35594425740
- Auditar WCAG con axe-core · run 35594425957
- Auditar WCAG contraste no textual · run 35594425777
- Auditar WCAG semántica de tablas · run 35594425975
- Auditar WCAG audio y movimiento · run 35594425766
- Comprobar CSP · run 35594425720
- Comprobar SEO e idiomas · run 35594425967
- Medir rendimiento Lighthouse · run 35594425751
- Comprobar carga del Directorio · run 35594425978
- Comprobar carga diferida de Investigación · run 35594425912
- Comprobar impresión del Taller · run 35594425883

Por tanto, R2-A no reproduce las regresiones de #193 en cabecera, Lectura, Música, navegación, idioma, teclado o responsive.

## 5. Checks rojos que NO proceden del diff R2-A

### Almacenamiento / privacidad

R2-A: failure · run 35594425715.  
Main exacto `e48b518…`: failure · run 35584652201.

Ambos reproducen los mismos usos de `sessionStorage`, entre ellos:
- `assets/rutinas-visuales.js`;
- `assets/tarjeta-iris.js`.

R2-A no modifica esos archivos.

### Preflight / contrato de indexación

R2-A: failure · run 35594425721.  
Main exacto `e48b518…`: failure · run 35584652184.

Ambos producen exactamente:

```text
Esperado:
html 999
index,follow 982
noindex,follow 3
otro_o_ninguno 14
sitemap_urls 995

Obtenido:
html 1003
index,follow 986
noindex,follow 4
otro_o_ninguno 13
sitemap_urls 999
```

R2-A no modifica indexación, sitemap ni build.

### Contraste con gradientes

R2-A: failure · run 35594425758.

Resultado:
- firmas únicas: 115;
- best-case white failures: 0;
- conservative pass: 98;
- firmas con pixel probe: 17;
- pixel probe failures: 4.

R2-A no modifica HTML público, CSS ni assets renderizados. Por tanto el rojo **no es una regresión causada por este diff**, pero permanece como deuda/gate global sin resolver y no se oculta.

## 6. Alcance de esta entrega

No se reincorpora:
- autonomía cotidiana;
- tablero de necesidades;
- juegos;
- herramientas W1;
- vídeos W1;
- cambios LGTBIQ+ W1;
- modificaciones de Rincón tranquilo.

No se modifica:
- header;
- navegación;
- sistema de idioma;
- Lectura;
- Música;
- preferencias;
- scripts globales;
- estilos globales;
- sitemap;
- indexación;
- build;
- redirects.

## 7. Conclusión

R2-A restaura la vía de trabajo al baseline oficial y demuestra que la arquitectura global no contiene las regresiones introducidas en W1-R0.

**Entrega:** `WEB_EXPANSION_W1_R2_ARCHITECTURE_RESTORED`

Después de esta entrega se espera revisión Astra.

No continuar automáticamente con:
- juegos;
- vídeos;
- recursos;
- LGTBIQ+ W1;
- Rincón tranquilo.

**NO MERGE · NO DEPLOY · NO CAMBIOS EN PRODUCCIÓN.**
