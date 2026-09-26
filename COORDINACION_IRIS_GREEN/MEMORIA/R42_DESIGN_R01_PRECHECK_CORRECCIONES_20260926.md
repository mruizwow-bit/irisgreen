# R42 Design R01 · precheck y correcciones obligatorias

Fecha: 26/09/2026  
Responsable de decisión/gate: Astra + María  
Issue de Design: #301  
Puerta web: A2 #289

## Estado vigente

`R42_DESIGN_PACKAGE_PRECHECK_PASS_CORRECTIONS_REQUIRED`

El paquete no se rechaza y no debe rehacerse. La arquitectura común material/cristal es válida como base, pero la entrega todavía NO pasa a A2. Antes del handoff deben cerrarse tres correcciones obligatorias y dos ajustes menores.

## Trazabilidad recibida y conservada

- Base declarada por Design: `e8cad400a30d5d4857f9f99b0c1070d786958a8b`.
- La revisión de precheck confirmó correspondencia de los cuatro blobs base declarados:
  - `ig-r42-shell.css`
  - `preferencias-lectura.js`
  - `apply_r42_app_shell.py`
  - `test_r42_app_shell.py`
- ZIP original recibido: SHA-256 `65ea0b67c0cc74da3e133bd12c8dc149ed4104f3895b5447a2b4021d40e2ad57`.
- Patch preservado: `COORDINACION_IRIS_GREEN/HANDOFFS/R42_DESIGN_R01/R42_DESIGN_MATERIALES.patch.gz`.
- QA local reportado/reproducido en el precheck: Python compila los cuatro scripts; `preferencias-lectura.js` pasa `node --check`; medidor: **30 mediciones · 0 FAIL**.
- Alcance del diff: **10 archivos de producto/QA, +1180 / −22 líneas**.
- No toca escenas/audio de A7, child-safe ni propaga el sistema a toda la web.

## Lo que se conserva

La dirección conceptual queda aprobada para continuar:
- sistema común, no colección de retoques;
- cristal/material solo en chrome interactivo;
- workspace, fichas, lienzos, inspector de contenido, instrucciones y lectura estable permanecen opacos;
- preferencia `Transparencia` reutiliza `IGPreferences` / `ig-a11y`, sin crear almacenamiento paralelo;
- si no existe elección manual se respeta `prefers-reduced-transparency` cuando esté disponible;
- opciones manuales `Normal · Reducida · Opaca`;
- `Restablecer` elimina la elección manual y vuelve al sistema;
- si `localStorage` falla, la sesión sigue funcionando;
- en <=900 px se conserva alpha mínimo .97 y blur 0;
- alto contraste se implementa por tokens/superficies/estados, retirando el filtro global `filter: contrast(1.2) saturate(1.1)` sobre `main`.

El último punto es candidato a propagación posterior únicamente tras aprobar el piloto y HUMAN QA.

## Correcciones obligatorias antes de A2

### C1 · Reconciliar con Memoria/Control canónicos actuales

La declaración de Design referencia documentación anterior:
- `CONTROL_MAESTRO_V41_DEC032_GAMES_MASTER_SCOPE.xlsx`
- `MEMORIA_MAESTRA_V37_DEC032_GAMES_MASTER_SCOPE.md`

Eso no satisface literalmente el gate vigente. Design debe releer y reconciliar el paquete contra:
- `COORDINACION_IRIS_GREEN/ESTADO_ACTUAL.md`
- `COORDINACION_IRIS_GREEN/MEMORIA/ESTADO_CONSOLIDADO.md`
- `COORDINACION_IRIS_GREEN/CONTROL/ESTADO_TRABAJOS.csv`
- addenda R42 vigentes aplicables, incluida la subordinación del sistema cristal a normativa completa.

Debe actualizar su Memoria + Control al terminar y declarar qué cambió o que no fue necesario cambiar producto tras la reconciliación.

### C2 · Rincón: ningún chrome temporal blanco

El Rincón no puede abrir superficies blancas al mostrar controles temporales.

Añadir variante específica oscura/opaca o dark-material para, como mínimo:
- `.ig-r42-dialog`
- `.ig-r42-inspector`
- sheets/paneles equivalentes del Rincón
- ayuda/contexto temporal relacionado

En escritorio, el inspector contextual no puede introducir un panel blanco. En móvil, un `dialog` grande tampoco puede encender visualmente la mayor parte de la pantalla.

Regla: **todo chrome temporal del Rincón es oscuro y opaco/dark-material; el contenido de lectura permanece estable y opaco.**

### C3 · Medición de contraste: fondo efectivo real

El medidor de navegador debe calcular el fondo efectivo del texto en su contexto real.

Para texto anidado:
1. recorrer la cadena de ancestros;
2. localizar el primer fondo no totalmente transparente relevante;
3. componer alfa en el orden real hasta obtener el fondo efectivo;
4. usar el fondo propio del botón/control cuando exista, no el cristal de la barra que quede detrás;
5. mantener evidencia por elemento/ruta/modo suficiente para auditar el cálculo.

Repetir el gate de contraste después de corregir el algoritmo.

## Ajustes menores solicitados

1. El token de texto deshabilitado está en **4,52:1**. Aumentar margen práctico hasta aproximadamente **4,8–5:1**.
2. Si `Más contraste` fuerza material opaco, el control de Transparencia no debe aparentar que `Normal` está visualmente activo sin explicación. Reflejar cognitivamente que el modo de contraste está imponiendo la superficie opaca.

## Límite de las 48 capturas

El workflow genera:
**8 rutas × 2 tamaños × 3 modos = 48 capturas.**

Su bloqueo de peticiones no locales se conserva como gate útil de aislamiento y estructura, pero implica:
- vídeos externos reales del Rincón pueden no representarse;
- fuentes web externas pueden no cargarse.

Por tanto:
- **CI Design = validación estructural/material**.
- **Deploy Preview A2 = validación visual real**, medios/fuentes reales y HUMAN QA.

No declarar aceptación perceptiva por las 48 capturas locales.

## Reentrega requerida

Design debe corregir sobre la misma arquitectura, no rehacerla, y devolver:
- HEAD/tree exactos;
- archivos cambiados;
- diff;
- confirmación de lectura/reconciliación de los canónicos actuales;
- nueva Memoria + Control;
- 30 mediciones sin FAIL con algoritmo corregido;
- 48 capturas estructurales regeneradas;
- evidencia específica del Rincón con inspector/dialog/sheet;
- estado de los dos ajustes menores;
- límites manuales restantes.

Marcador de reentrega recomendado:
`R42_DESIGN_R01_CORRECTIONS_APPLIED_READY_FOR_ASTRA_REVIEW`

Solo después de revisión de Astra podrá cambiar a:
`R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2`

## Puerta A2

A2 NO integra todavía este paquete Design. El HOLD es específico de #301 y no bloquea handoffs R42 independientes ya listos.

Después de aprobar la reentrega:
Design corregido → Astra precheck final → A2 CI/build/preview real → HUMAN QA María → decisión de propagación.

No main/producción por este registro.
