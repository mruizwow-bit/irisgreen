# MOTOR · A5 · ESTUDIO PROFUNDO R29 · GAMEPAD, POINTER LOCK, FULLSCREEN Y ORIENTACIÓN

Fecha: 01/10/2026
Amplía: R01–R28
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Input de juego es opcional

Motor aprende estas APIs para futuras herramientas/juegos. No se añaden si teclado/touch ya resuelven la tarea o no existe necesidad de producto.

## 2 · Gamepad API

Fuentes:
- MDN · Gamepad API
  https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
- MDN · Navigator.getGamepads()
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getGamepads

Navigator.getGamepads() está ampliamente disponible desde 2017 y devuelve un array que puede contener huecos null para conservar índices.

Eventos gamepadconnected/gamepaddisconnected sirven para presencia/lifecycle. Para estado actual, leer navigator.getGamepads()[index] en el loop.

## 3 · Analog deadzone

Los sticks pueden reportar ruido cerca de cero.

Práctica con deadzone 0.18:
- centro 0 → 0;
- ±0.17 → 0;
- ±0.5 conserva signo;
- ±1 → ±1.

Resultado: **4/4 PASS**.

Para movimiento 2D puede convenir deadzone radial; para ejes independientes, per-axis.

## 4 · Button edges

Para acciones de una sola vez, detectar transición false→true. No ejecutar un menú 60 veces por segundo mientras el botón sigue pulsado.

Para inputs analógicos como acelerador, usar value continuo.

## 5 · Disconnect mid-action

Si el gamepad desaparece:
- limpiar input mantenido;
- detener haptics;
- volver a keyboard/touch;
- no dejar movimiento pegado.

## 6 · Haptics

Fuentes:
- https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/vibrationActuator
- https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator

Estado 01/10/2026: Limited availability / experimental y dependiente de navegador, sistema y mando.

No baseline. Si se usa: breve, desactivable y nunca única señal de estado.

## 7 · Pointer Lock

Fuente:
https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API

Sirve para movimiento relativo del mouse sin límites de pantalla y cursor oculto. Adecuado para cámara 3D/FPS, no para dibujo o UI general.

requestPointerLock requiere gesto/engagement. Si la persona sale con el gesto de desbloqueo, no se debe reentrar automáticamente.

unadjustedMovement pide input sin aceleración del SO; no todos los entornos lo soportan. Debe existir fallback.

## 8 · Fullscreen

Fuentes:
- https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen
- https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API

requestFullscreen sigue marcado por MDN como Limited availability y requiere transient user activation.

Puede fallar por Permissions Policy u otras restricciones.

No asumir success al llamar. Usar Promise + fullscreenchange/fullscreenerror y consultar document.fullscreenElement.

La persona puede salir con Escape, cambio de app/tab o navegación.

## 9 · Fullscreen + Pointer Lock

Ambos pueden requerir activación. El orden puede importar. Si un futuro juego necesita ambos: una acción clara, pruebas por navegador y fallback sin una de las capacidades.

## 10 · Screen Orientation

Fuentes:
- https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/lock
- https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Managing_screen_orientation

ScreenOrientation.lock() sigue en Limited availability y suele depender de móvil/fullscreen/installed context.

screen.orientation emite change. Motor debe tratarlo como resize/layout invalidation y posible cambio del mapeo de input.

No bloquear orientación si la tarea puede funcionar en ambas. Axioma decide el criterio formal de accesibilidad.

## 11 · Permissions Policy

Gamepad/fullscreen pueden estar bloqueados por políticas. Distinguir:
- unsupported;
- blocked by policy;
- no device;
- permission/activation missing.

getGamepads() puede lanzar SecurityError cuando la política lo bloquea.

## 12 · Device identity

Gamepad.id puede identificar modelo de mando. No usarlo como telemetría/fingerprinting. Solo para mapping/display local si es necesario.

## 13 · Integración con game loop

Patrón:
tick → sample latest gamepad → deadzone → intent → simulation update.

Para replay guardar intención lógica/tick, no hardware string salvo necesidad.

## 14 · Focus

Si Canvas pierde foco, el gamepad puede seguir siendo legible técnicamente. El juego debe decidir si pausa o ignora input al perder el contexto activo.

No mover el mundo mientras la persona usa otro control.

## 15 · Testing matrix

Gamepad:
- none;
- standard;
- disconnect;
- axis noise;
- button hold;
- multiple pads.

Pointer Lock:
- accept;
- user exits;
- re-request;
- unsupported raw movement.

Fullscreen:
- enter;
- reject;
- Escape;
- tab switch.

Orientation:
- rotate;
- lock reject;
- resize.

## 16 · Estado Iris Green

Búsqueda actual: no se encontraron usos canónicos de Gamepad, Pointer Lock, Fullscreen en A5 ni orientation lock.

No introducirlos hoy.

## 17 · Estado R29

Práctica: **4/4 PASS** en deadzone/axis mapping.

Marcador:
`MOTOR_GAMEPAD_IMMERSIVE_INPUT_STUDIED_R29`

No: gamepad feature, haptics, pointer lock, fullscreen, orientation lock, build, merge, deploy, main/production.