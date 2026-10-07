# RELEVO TEMPORAL CORREGIDO · MOTOR → JUEGO DE CONSTRUCCIÓN / EL VADO 3D

Fecha: 2026-10-07
Autoridad: María
Coordinación: Nexo

## Corrección

Motor NO asume Detective.

Motor asume temporalmente el **juego de Construcción / El Vado 3D**.

## Base

KEEP técnico ya validado:
- Vera;
- locomoción;
- cámara 3D;
- inventario;
- recogida;
- construcción;
- reglas de apoyo/alcance;
- undo;
- guardado;
- teclado/touch;
- fixes de interacción.

## Rework de producto

Estado vigente:
`HUMAN_QA_EL_VADO_VERA_3__PRODUCT_REWORK_REQUIRED`

Problemas:
- gameplay demasiado básico;
- secuencia prescrita;
- objetivo visible demasiado guiado;
- `Carry_Heavy_Object_Walk_inplace` rechazado como transporte genérico;
- falta loop completo de producto.

## Loop objetivo

`CONSTRUIR → CRUZAR → REFUGIO/TALLER → NPC LO USA → CONTINUAR`

Debe existir:
- exploración;
- decisiones reales;
- más de una solución;
- materiales con propiedades distintas;
- consecuencia visible;
- refugio/taller detectado por geometría real;
- NPC que cruce y use lo construido;
- continuidad después de resolver el primer problema.

No ampliar mapa manteniendo el mismo loop básico.

## Runtime / interacción

Motor debe trabajar:
- física/comportamiento;
- estado;
- eventos;
- cámara;
- construcción manipulable;
- feedback;
- navegación;
- Vera;
- teclado/touch;
- NORMAL/REDUCED/NONE.

## Gate

`EL_VADO_3D_GAMEPLAY_REWORK_READY_FOR_NEXO_HUMAN_QA`

NO MAIN · NO PUBLIC DEPLOY.
