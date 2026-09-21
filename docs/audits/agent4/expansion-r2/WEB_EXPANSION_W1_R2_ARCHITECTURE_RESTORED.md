# WEB_EXPANSION_W1_R2_ARCHITECTURE_RESTORED

**Agente:** n.º 4  
**Bloque:** W1-R2-A · arquitectura  
**Issue:** #205  
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

Antes de añadir esta documentación/test, la rama R2 fue comparada directamente con el baseline obligatorio:

- `status = identical`
- `ahead_by = 0`
- `behind_by = 0`
- archivos distintos = **0**

Por tanto, la restauración no intenta reconstruir manualmente la cabecera: vuelve a la arquitectura oficial aceptada.

## 3. Contrato observado directamente

Se inspeccionaron 11 páginas representativas ES/EN más la portada y 5 activos globales.

En las muestras ES/EN se conservan:
- navegación principal del baseline;
- `#a11yBtn` · Lectura / Reading;
- `#plBtn` · Música / Music;
- control de idioma del template correspondiente;
- `interfaz-comun.js`;
- `lectura-accesible.js`;
- `musica.js`.

El baseline contiene variantes históricas de etiqueta/destino (por ejemplo, algunos templates usan «Jugar / Play» donde otros muestran «Recursos»). **R2-A no corrige ni normaliza esa infraestructura**, porque Astra ha prohibido modificar la cabecera global desde este frente. El objetivo de este bloque es demostrar ausencia de regresión respecto del baseline oficial, no introducir una nueva cabecera.

## 4. Responsive

La hoja global aceptada conserva su contrato V23:
- escritorio amplio: navegación completa visible;
- por debajo de 93.99rem: navegación completa permanece disponible en una fila horizontal desplazable;
- por debajo de 42rem: controles compactos, sin eliminar Lectura, Música o idioma.

No se modifica CSS global.

## 5. Teclado y foco

`interfaz-comun.js` conserva:
- `aria-expanded` en el control de menú;
- cierre con `Escape`;
- protección de foco respecto de paneles globales;
- controlador compartido de Lectura.

`lectura-accesible.js` conserva explícitamente que Música la controla `assets/musica.js`.

No se modifica JavaScript global.

## 6. Evidencia reproducible

- `architecture-baseline-manifest.json`: fija hashes Git blob de 17 archivos críticos.
- `verify_header_contract.py`: comprueba hashes y contrato fuente de cabecera, navegación, Lectura, Música, idioma y responsive.
- `WEB_EXPANSION_W1_R2_ARCHITECTURE_MATRIX.csv`: matriz de aplicabilidad/evidencia.

El test es **read-only**. No repara ni normaliza la web.

## 7. Alcance de esta entrega

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

## 8. Siguiente gate

Después de esta entrega **se espera revisión Astra**.

No continuar automáticamente con:
- juegos;
- vídeos;
- recursos.

**NO MERGE · NO DEPLOY · NO CAMBIOS EN PRODUCCIÓN.**
