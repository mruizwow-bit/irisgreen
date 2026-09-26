# R42 DESIGN R01 · CORRECCIONES DE PRECHECK

Fecha: 26/09/2026  
Autoridad de gate: Astra + María  
Issue: #301  
Puerta de integración: A2 #289

## Estado de entrada

`R42_DESIGN_PACKAGE_PRECHECK_PASS_CORRECTIONS_REQUIRED`

Esta orden NO invalida la arquitectura entregada y NO ordena reconstruir el sistema. Corrige tres puntos concretos antes del handoff A2.

## Fuente obligatoria antes de editar

Design debe releer en esta misma corrección:
1. `COORDINACION_IRIS_GREEN/ESTADO_ACTUAL.md`
2. `COORDINACION_IRIS_GREEN/MEMORIA/ESTADO_CONSOLIDADO.md`
3. `COORDINACION_IRIS_GREEN/CONTROL/ESTADO_TRABAJOS.csv`
4. `COORDINACION_IRIS_GREEN/NORMATIVA/ADDENDUM_R42_CRISTAL_BAJO_NORMATIVA_COMPLETA_20260926.md`
5. `COORDINACION_IRIS_GREEN/NORMATIVA/ADDENDUM_R42_DESIGN_CRYSTAL_PRECHECK_20260926.md`
6. orden #301 y esta corrección.

La lectura histórica de V41/V37 no sustituye estos canónicos.

## C1 · Reconciliación documental y técnica

Comparar el paquete R01 ya construido con el estado vigente. No tocar por inercia: cambiar producto solo donde exista conflicto real.

Al terminar, actualizar Memoria + Control del carril e indicar:
- qué requisito vigente se revisó;
- si produjo cambio de código o solo de documentación;
- qué queda manual.

## C2 · Rincón: chrome temporal dark/opaco

Dentro del Rincón, no permitir superficies temporales blancas o claras que dominen el stage.

Cubrir al menos:
- `.ig-r42-dialog`;
- `.ig-r42-inspector`;
- sheets equivalentes;
- panel contextual;
- ayuda contextual/temporal.

Requisitos:
- variante dark/opaca o dark-material;
- no glass-on-glass;
- texto/controles con contraste suficiente;
- lectura/contenido estable opaco;
- escritorio y móvil;
- forced-colors y reduced-transparency conservados;
- foco/teclado y cierre del dialog no se degradan.

## C3 · Medición de contraste con fondo efectivo real

Para cada nodo de texto medido:
1. obtener fondo propio si es visible;
2. si es transparente/semitransparente, recorrer ancestros;
3. componer alfa en orden real;
4. continuar hasta fondo opaco efectivo;
5. calcular contraste contra ese resultado;
6. registrar elemento, ruta, modo y valores suficientes para reproducir la medición.

Caso obligatorio de regresión:
- texto dentro de botón/control opaco situado dentro de barra de cristal;
- el fondo efectivo del texto debe partir del botón/control, no de la barra.

Regenerar el informe de 30 mediciones después del cambio.

## Ajustes menores

- Llevar el token de texto deshabilitado de 4,52:1 a un margen objetivo aproximado de 4,8–5:1.
- Cuando `Más contraste` fuerce material opaco, reflejar esa imposición en el control de Transparencia mediante estado/ayuda accesible, sin hacer creer que la apariencia efectiva sigue siendo `Normal`.

## 48 capturas

Mantener:
`8 rutas × 2 tamaños × 3 modos = 48`.

El bloqueo de red no local permanece, pero estas capturas solo acreditan estructura/material local. No certifican:
- vídeo externo real;
- fuentes web externas;
- percepción final.

Eso corresponde a Deploy Preview A2 + HUMAN QA María.

## Reentrega obligatoria

Entregar:
- HEAD;
- tree;
- lista de archivos;
- diff;
- Memoria + Control actualizados;
- reconciliación documental;
- 30 mediciones / 0 FAIL con medidor corregido;
- 48 capturas regeneradas;
- evidencia explícita de dialog/inspector/sheet del Rincón en escritorio y móvil;
- resultado de los dos ajustes menores;
- pendientes manuales.

Marcador:
`R42_DESIGN_R01_CORRECTIONS_APPLIED_READY_FOR_ASTRA_REVIEW`

No declarar:
`R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2`

hasta revisión posterior de Astra.

## Límites

- No main.
- No producción.
- No ampliar el piloto.
- No tocar escenas/audio A7.
- No abrir child-safe.
- No propagar cristal a toda la web.
- No crear almacenamiento de preferencias paralelo.
- No bloquear handoffs R42 independientes.
