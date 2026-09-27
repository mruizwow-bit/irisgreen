# R42 Design R02 · revisión Astra y reconciliación canónica · 27/09/2026

## Estado canónico

`R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2`

Significado exacto: **R02 ha pasado la revisión de Astra y puede entrar en la puerta A2 para aplicar diff, ejecutar CI/build, generar capturas, publicar Deploy Preview y someterse a HUMAN QA de María.** No es aceptación perceptiva ni autorización de main/producción.

## Paquete recibido

- archivo: `Interfaz(1).zip`
- SHA-256: `650b1993c2f780c4b0fffdabfd8ae2524df10bd234e365e5bcbc264fd5f8edd6`
- base declarada y revalidada: `agent2/sabik-iris-r08-20260924@e8cad400a30d5d4857f9f99b0c1070d786958a8b`
- tree base revalidado: `827a68fae6596a929e4d246bb47b8494a976e8a3`
- diff final contra base: +1376 / −22
- SHA-256 diff final: `9c99183cd5bbe1c7abb2057c482972c81474f0f0160000cb15b0ef2a668664a8`
- SHA-256 diff R01→R02: `398297dfb27f5def5a61ace75ce452a8d0d927b01124a768ae7c47559d6c0e57`

Astra comprobó que la rama A2 seguía exactamente en el HEAD/tree declarados al revisar R02.

## Reproducción independiente de Astra

Sobre los bytes recibidos:
- `python -m py_compile` PASS en los cuatro scripts Python;
- `node --check assets/preferencias-lectura.js` PASS;
- `python scripts/measure_r42_materials.py` → **30 mediciones · 0 FAIL**;
- estadística real del diff final: **+1376 / −22**;
- el diff incremental R01→R02 revierte exactamente los cinco archivos de código principales a los SHA conocidos de R01:
  - `ig-r42-materials.css` → `68469e8a…d226bae2`;
  - `preferencias-lectura.js` → `1465987f…a053bfcd`;
  - `test_r42_app_shell.py` → `1255a180…0714f973`;
  - `measure_r42_materials.py` → `c713d9e9…6539f215`;
  - `test_r42_materials_browser.py` → `c135e505…22d339f61`.

### Chromium sintético de Astra

Con Chromium local y el CSS/JS R02:
- inspector Rincón: `rgb(11,26,43)`, opaco, sin backdrop;
- dialog Rincón: `rgb(11,26,43)`, opaco, sin backdrop;
- popover Rincón: `rgb(11,26,43)`, opaco, sin backdrop;
- sheet móvil Rincón: `rgb(11,26,43)`, opaco, sin backdrop;
- regresión obligatoria de fondo efectivo: **11,82:1**, base = botón opaco;
- el PROBE no devolvió problemas en el fixture;
- al guardar Transparencia = `normal` y activar `Más contraste`, la preferencia almacenada sigue siendo `normal`, el estado forzado pasa a `contrast` y aparece el aviso accesible ES/EN; al desactivar contraste el aviso desaparece.

Contrastes recalculados:
- deshabilitado sobre blanco: 5,38:1;
- sobre `#f4f7fa`: 5,01:1;
- sobre `#eef2f6`: 4,78:1.

## Reconciliación canónica realizada por Astra

Design no encontraba los canónicos porque no están en la rama de trabajo A2 ni en los otros repos que consultó; están versionados en la rama de coordinación `coordinacion/iris-green-canonica-20260924`.

Astra reconciliò R02 contra:
- `COORDINACION_IRIS_GREEN/ESTADO_ACTUAL.md`;
- `MEMORIA/ESTADO_CONSOLIDADO.md`;
- `CONTROL/ESTADO_TRABAJOS.csv`;
- `ADDENDUM_R42_CRISTAL_BAJO_NORMATIVA_COMPLETA_20260926.md`;
- `ADDENDUM_R42_DESIGN_CRYSTAL_PRECHECK_20260926.md`;
- `ADDENDUM_R42_TALLER_INTERFAZ_ACCESIBLE_20260926.md`;
- memoria/estado del HOLD de interfaz del Taller;
- decisiones vigentes de física/CSP del Taller.

### Resultado de reconciliación

**No hay conflicto que obligue a cambiar código R02.**

Condiciones de interpretación:
1. El piloto de material sobre Taller/Dibujo valida el **sistema material/chrome**, no la arquitectura final del Taller.
2. El HOLD `R42_TALLER_INTERFACE_RESEARCH_COMPLETE_IMPLEMENTATION_HOLD` continúa intacto.
3. Tras integrar la arquitectura final del Taller, el sistema material deberá volver a ejecutarse sobre esa versión antes de propagación global.
4. R02 no modifica etapa de vida, almacenamiento del Taller, física, CSP, AudioWorklet ni motores creativos.
5. Child-safe continúa diferido y no se toca.
6. No existe propagación global del cristal antes de Deploy Preview + HUMAN QA.

## Correcciones del precheck

### C1 · canónicos
CERRADA por reconciliación Astra. Sin cambio de código necesario.

### C2 · Rincón
CERRADA en código. Inspector, dialogs, popover, menú «Más» y sheet móvil quedan dark/opacos.

### C3 · fondo efectivo
CERRADA en código y reproducida por Astra. Regresión = 11,82:1 contra el botón opaco.

### Ajustes menores
CERRADOS:
- texto deshabilitado con margen reforzado;
- aviso accesible cuando contraste impone opacidad sin cambiar la preferencia guardada.

## Observaciones no bloqueantes

### OBS-R42-DESIGN-R02-DOC-01
El ZIP conserva documentos heredados de R01:
- `ENTREGA_R42_DESIGN_MATERIALES.md` todavía contiene el marcador antiguo `R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2`;
- la cabecera de `MEMORIA_ADDENDUM_R42_DESIGN.md` todavía dice “entregado a A2”.

La reentrega R02 y este registro canónico tienen precedencia. Es contenido histórico/stale, no un gate activo. No obliga a otra ronda de código. Si el paquete se republica, conviene marcar esos bloques como históricos/superseded.

### OBS-R42-DESIGN-R02-EVIDENCE-01
Los `measurements.md/json` empaquetados son una versión enriquecida. Ejecutar `measure_r42_materials.py` conserva las mismas **30 filas y los mismos valores**, pero regenera archivos con bytes/metadata distintos y omite el texto narrativo `hallazgos/algoritmo/recuento`.

No altera ningún PASS ni cálculo. Para A2:
- resultado de CI generado por script = evidencia máquina canónica;
- informe empaquetado = snapshot enriquecido;
- antes de propagación global sería deseable que el generador reproduzca también la metadata narrativa si se quiere byte-reproducibilidad documental.

## Pendiente A2

1. aplicar `R42_DESIGN_MATERIALES.diff` sobre `e8cad400...` con `git apply --check`;
2. crear commit y devolver HEAD/tree;
3. ejecutar workflow `r42-materiales.yml`;
4. comprobar build, contratos, 30/30, browser.json y capturas;
5. revisar 48 capturas primarias y capturas adicionales del Rincón;
6. Deploy Preview con medios/fuentes reales;
7. lector de pantalla, zoom/reflow y HUMAN QA de María.

No main. No producción. No propagación global.
