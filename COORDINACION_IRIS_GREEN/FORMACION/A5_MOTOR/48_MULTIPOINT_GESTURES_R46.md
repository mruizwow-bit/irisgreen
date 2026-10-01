# MOTOR · A5 · ESTUDIO PROFUNDO R46 · GESTOS MULTIPUNTO, PINCH, WHEEL Y TRACKPAD

Fecha: 01/10/2026
Amplía: R01–R45
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Gestos complejos son una mejora, no la única vía.

Para:
- pinch zoom;
- rotate;
- swipe path;
- two-finger pan;

debe existir operación equivalente con pointer simple cuando WCAG lo exige y el gesto no es esencial.

## 2 · WCAG 2.5.1 Pointer Gestures

Fuente:
- W3C/WAI · Understanding SC 2.5.1
  https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures

Level A.

Toda funcionalidad que usa:
- multipoint gesture;
- path-based gesture;

puede operarse con un single pointer sin path-based gesture, salvo excepción esencial.

Axioma conserva juicio formal.
Motor diseña runtime que lo permita.

## 3 · Multipoint vs drag

Multipoint:
dos o más pointers simultáneos.

Ejemplo:
pinch.

Path-based:
dirección/forma del movimiento importa.

Ejemplo:
flick horizontal.

Dragging:
importan start/end más que path exacto.

WCAG 2.5.1 y 2.5.7 cubren problemas distintos.

## 4 · Pinch state

Mantener:
```
pointerId → position
```

Cuando hay exactamente dos pointers activos:
- initial distance;
- initial angle;
- initial center;
- initial view transform.

Durante move:
- scale = currentDistance / initialDistance;
- rotation = currentAngle - initialAngle;
- pan = currentCenter - initialCenter.

No acumular incrementalmente si puede derivarse de baseline del gesto:
reduce drift.

## 5 · Práctica pinch

Inicio:
- P1 = (100,100)
- P2 = (200,100)

Distancia:
100.

Después:
- P1 = (90,90)
- P2 = (240,90)

Distancia:
150.

Scale:
`150/100 = 1.5`.

Centro inicial:
`(150,100)`.

Centro actual:
`(165,90)`.

Pan center:
`(+15,-10)`.

PASS.

Aprendizaje:
pinch puede incluir zoom + traslación simultánea.

## 6 · Gesture baseline

Al entrar segundo pointer:
freeze baseline.

Si un pointer sale:
terminar/rebase gesto.

No seguir calculando contra un pointer inexistente.

## 7 · pointercancel

Si cualquiera cancela:
- terminar gesto;
- limpiar map;
- decidir commit/revert;
- no dejar zoom “stuck”.

R04/R40 siguen aplicando.

## 8 · Third pointer

Definir policy:
- ignore extras;
- cancel gesture;
- support 3-pointer deliberately.

No dejar comportamiento emergente.

Para Iris Green:
dos pointers máximo suele ser suficiente si alguna vez se adopta pinch.

## 9 · Alternative controls

Pinch zoom:
- + button;
- − button;
- reset;
- slider/click steps.

Rotate gesture:
- rotate left/right buttons;
- reset orientation.

Swipe carousel:
- previous/next buttons.

Pan:
- click controls/scrollbars/keyboard según caso.

## 10 · Single pointer not path-based

Una alternativa no debe exigir:
“dibujar una L perfecta”
para sustituir pinch.

Debe ser:
- click;
- tap;
- control;
- simple drag donde 2.5.7 también tenga alternativa si aplica.

## 11 · WheelEvent

Fuente:
- MDN · WheelEvent
  https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent

Wheel puede venir de:
- mouse wheel;
- trackpad;
- other emulated wheels.

No confundir wheel con scroll:
- wheel puede no desplazar;
- scroll puede venir de teclado/scrollbar/JS.

## 12 · deltaMode

Fuente:
- MDN · WheelEvent.deltaMode
  https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode

Valores:
- DOM_DELTA_PIXEL;
- DOM_DELTA_LINE;
- DOM_DELTA_PAGE.

Regla:
**no asumir deltaY está en pixels.**

Normalizar según modo/contexto.

No convertir lines → pixels con una constante universal sin contexto.

## 13 · Trackpad pinch via wheel

Algunos browsers/platforms pueden representar zoom gesture de trackpad mediante wheel + modifier como ctrlKey.

No asumir:
ctrl+wheel = siempre intención de app zoom.

Browser puede usarlo para page zoom.

Interceptar con extremo cuidado.

No impedir zoom del navegador de forma que perjudique accesibilidad.

## 14 · Browser zoom

La persona necesita zoom del navegador.

Una app no debe secuestrar todos los:
- ctrl+wheel;
- pinch;

para zoom interno.

Para canvas/map:
delimitar interaction region y mantener browser/page affordances.

Axioma revisa consecuencias de accesibilidad.

## 15 · preventDefault

Para evitar scroll/zoom:
wheel listener debe poder cancelar.

Eso puede afectar performance.

Usar solo dentro de superficie donde sea necesario.

No añadir global:
`window.addEventListener('wheel', preventDefault)`.

## 16 · passive

Si listener necesita preventDefault:
no puede ser passive.

Eso obliga browser a esperar.

Por tanto:
handler mínimo.

Si solo observa:
passive true.

## 17 · touch-action

Pointer gesture:
`touch-action` comunica gestos que el navegador puede manejar.

Para custom pinch/pan:
configurar cuidadosamente.

No:
`touch-action:none`
global.

Eso puede impedir scroll/zoom UA.

## 18 · Pointer capture

Con multi-pointer:
capture es por pointerId.

Puede capturarse cada pointer según diseño.

No asumir una captura “global”.

Al release/cancel:
limpiar individualmente.

## 19 · Gesture ownership

Estado:
```
IDLE
ONE_POINTER
MULTI_GESTURE
CANCELLED
```

Transición:
segundo pointer puede convertir drag en pinch.

Definir qué pasa con operación de un pointer previa:
- commit;
- cancel;
- morph.

No dejar mezcla accidental.

## 20 · Hit target during transform

Si transform visual cambia mientras gesture activo:
hit testing del siguiente pointer puede cambiar.

Preferir:
- gesture owner fijo;
- captured pointers;
- world transform separado.

## 21 · Zoom around gesture center

Para zoom natural:
mantener el world point bajo el centro del gesto.

Conceptualmente:
1. screen center → world before zoom;
2. apply scale;
3. solve translation so same world point maps to new center.

No simplemente:
`scale *= 1.5`
alrededor de (0,0).

## 22 · Rotation

Angle:
`atan2(dy, dx)`.

Delta:
normalizar alrededor de ±π para evitar saltos 359°→0°.

No usar grados sin normalización.

## 23 · Threshold

Antes de declarar gesture:
puede existir threshold pequeño para evitar ruido.

Pero:
- demasiado alto = lag;
- demasiado bajo = accidental.

Medir y probar touch real.

## 24 · Velocity

Flick/inertia:
requiere velocidad.

Path-based gestures implican alternativa WCAG.

No añadir “swipe rápido obligatorio” para navegación.

Buttons siguen disponibles.

## 25 · Inertia

Pan con momentum:
after pointerup continúa movimiento.

Reduced motion/sensory:
inertia puede reducirse/desactivarse.

No ocultar control bajo movimiento largo.

## 26 · Scroll containers

Nested scroll:
gesture puede competir con:
- page;
- modal;
- canvas;
- embedded frame.

Definir overscroll behavior solo si UX lo requiere.

No bloquear scroll chain global sin razón.

## 27 · Current A5 audit

R21:
coordinate spaces/multi-pointer ya estudiados.

R04:
pointer cancel/touch-action.

R39:
device motion.

Pero no había bloque propio de:
- pinch scale;
- center pan;
- wheel normalization;
- trackpad conflict;
- WCAG 2.5.1 gesture alternatives.

R46 cubre ese hueco.

## 28 · Potential use

- mapas;
- circuitos;
- arquitectura;
- mundo 3D;
- zoom de lienzo.

No necesario para:
- formularios;
- grids simples;
- contenido editorial.

## 29 · Testing

### pinch
two pointers scale/pan.

### pointer lost
cancel clean.

### third pointer
defined policy.

### wheel pixel
deltaMode pixel.

### wheel line/page
normalized.

### browser zoom
still possible.

### single-pointer alternative
plus/minus/reset.

### keyboard
zoom controls.

### reduced motion
inertia safe.

## 30 · Adoption gate

```
GESTURE ADDS REAL VALUE
+ WCAG SINGLE POINTER ALTERNATIVE
+ POINTER CANCEL
+ CENTER-PRESERVING MATH
+ WHEEL DELTAMODE
+ BROWSER ZOOM NOT BROKEN
+ TOUCH REAL DEVICE QA
+ REDUCED MOTION
```

## 31 · Estado R46

Estudiado:
- WCAG 2.5.1;
- pinch math;
- multi-pointer lifecycle;
- wheel/trackpad;
- deltaMode;
- browser zoom boundary;
- inertia.

Práctica:
- scale 1.5;
- center pan (+15,-10) PASS.

Marcador:
`MOTOR_MULTIPOINT_GESTURES_WHEEL_STUDIED_R46`

No:
- pinch feature;
- wheel interception;
- map zoom;
- build;
- merge;
- deploy;
- main/production.
