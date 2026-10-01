# MOTOR · A5 · ESTUDIO PROFUNDO R39 · SENSORES, ORIENTACIÓN Y MOTION ACTUATION

Fecha: 01/10/2026
Amplía: R01–R38
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

Mover el dispositivo nunca debe ser la única manera de operar una función que pueda resolverse con controles convencionales, salvo que el movimiento sea esencial.

Motor trata:
- inclinación;
- giro;
- sacudida;
- aceleración;
- orientación

como **inputs opcionales y sensibles**, no como baseline de interacción.

## 2 · WCAG 2.5.4 Motion Actuation

Fuente:
- W3C/WAI · Understanding SC 2.5.4
  https://www.w3.org/WAI/WCAG22/Understanding/motion-actuation

Requisito:
si una función puede operarse con movimiento del dispositivo/usuario:
- debe existir componente UI equivalente;
- responder al movimiento debe poder desactivarse;

salvo excepciones definidas.

Axioma conserva criterio formal de conformidad.
Motor implementa el runtime que lo permite.

## 3 · Device Orientation Events

Fuente:
- MDN · Device orientation events
  https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events

Estado:
widely available desde 2023 en términos generales, con variaciones por API/permiso.

Secure context.

Eventos:
- `deviceorientation`;
- `devicemotion`.

No asumir sensor físico concreto:
browser puede combinar señales.

## 4 · DeviceOrientationEvent

Fuente:
- MDN · DeviceOrientationEvent
  https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent

Valores:
- alpha;
- beta;
- gamma;
- absolute.

Puede haber:
- null;
- ruido;
- cambios de referencia;
- diferencias de hardware.

No mapear directamente ángulos a acción irreversible.

## 5 · DeviceMotionEvent

Puede exponer:
- acceleration;
- accelerationIncludingGravity;
- rotationRate;
- interval.

No asumir frecuencia estable.

Si el motor necesita sampling:
usar timestamp y filtros.

## 6 · Permission API específica

Fuentes:
- MDN · DeviceOrientationEvent.requestPermission()
  https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static
- MDN · DeviceMotionEvent.requestPermission()
  https://developer.mozilla.org/en-US/docs/Web/API/DeviceMotionEvent/requestPermission_static

Estado:
**Limited availability / no Baseline**.

En navegadores que la implementan:
- requiere transient user activation;
- puede devolver granted/denied;
- puede rechazar NotAllowedError.

Patrón:
```
button click
→ detect requestPermission
→ request
→ if granted start sensors
→ else keep conventional controls
```

Nunca pedir permiso al cargar.

## 7 · Generic Sensor API

Fuente:
- MDN · Sensor APIs
  https://developer.mozilla.org/en-US/docs/Web/API/Sensor_APIs

Abstracciones:
- Accelerometer;
- Gyroscope;
- AbsoluteOrientationSensor;
- RelativeOrientationSensor.

Secure context.

Soporte varía.

No elegir Generic Sensor solo por API más “limpia” si reduce compatibilidad.

## 8 · Spec status

W3C Devices and Sensors publica:
- Device Orientation and Motion;
- Accelerometer;
- Gyroscope;
- otros sensores con estados distintos.

Motor distingue:
- Candidate Recommendation;
- Working Draft;
- implementación real.

No convertir draft en requisito de producto.

## 9 · Sensor input necesita filtrado

Datos físicos contienen:
- ruido;
- jitter;
- picos;
- drift.

Opciones:
- deadzone;
- low-pass;
- moving average;
- hysteresis.

Pero filtrar añade latencia.

Elegir según tarea.

## 10 · Deadzone

Para tilt:
```
if abs(value) < epsilon → 0
```

Evita acciones por micro-movimientos.

No usar una deadzone fija sin probar:
- diferentes dispositivos;
- postura;
- soporte;
- montaje.

## 11 · Hysteresis

Para estados discretos:

Entrar:
`angle > 20°`

Salir:
`angle < 15°`

Evita toggling rápido alrededor del umbral.

## 12 · Motion intent vs incidental motion

Un usuario puede:
- caminar;
- mover la mesa;
- viajar en coche;
- sostener dispositivo con temblor.

No todo movimiento = intención.

Regla:
**sensor data no es intent hasta pasar por un contrato de interacción.**

## 13 · Disable motion actuation

Debe existir:
- ajuste/control claro;
- estado recordado solo si política de producto lo permite;
- default conservador.

Si sensor es mejora:
puede ser off por defecto y activarse explícitamente.

## 14 · UI alternative

Ejemplos:

Tilt left/right:
→ botones izquierda/derecha.

Shake to reset:
→ botón Reset.

Rotate to pan scene:
→ controles pan o drag/click.

No usar motion como única vía.

## 15 · Reduced motion ≠ motion actuation

Son conceptos distintos.

### prefers-reduced-motion
controla movimiento/animación visual.

### motion actuation
controla funcionalidad disparada por mover usuario/dispositivo.

Una app puede:
- tener reduced visual motion;
- pero seguir escuchando tilt.

Motor debe tratar ambos por separado.

## 16 · Sensor lifecycle

No escuchar siempre.

Start:
- después de user intent/permission.

Stop:
- feature off;
- component destroy;
- hidden si no aporta;
- page lifecycle;
- permission lost/unsupported.

Listener permanente consume:
- CPU;
- batería;
- privacidad.

## 17 · Frequency

Eventos pueden ser frecuentes.

No renderizar cada sample directamente.

Pipeline:
```
sensor sample
→ filter
→ intent/state
→ rAF render latest
```

Latest-wins suele ser correcto para visual tilt.

No para eventos discretos críticos sin edge detection.

## 18 · Privacy

Sensores pueden aportar señales de:
- movimiento;
- orientación;
- entorno/dispositivo.

Motor minimiza:
- frecuencia;
- duración;
- persistencia.

No enviar raw sensor data a backend sin necesidad/gobernanza.

Vigía/Lex intervienen si aparece telemetría/privacidad.

## 19 · Fingerprinting

No combinar sensores para construir identidad del dispositivo.

No almacenar calibraciones/hardware IDs salvo necesidad técnica clara.

## 20 · Screen orientation vs device orientation

`screen.orientation`:
orientación de pantalla.

`DeviceOrientationEvent`:
orientación física.

No son equivalentes.

Una pantalla bloqueada portrait puede seguir inclinándose.

## 21 · Coordinate frames

Antes de mapear tilt:
definir:
- frame del dispositivo;
- frame de pantalla;
- portrait/landscape;
- orientación bloqueada.

Si rota pantalla:
ejes percibidos pueden cambiar.

No mapear beta/gamma sin considerar orientation.

## 22 · 3D scenes

Para una escena 3D futura:
sensor tilt podría controlar cámara.

Solo como opción.

Debe existir:
- pointer/touch;
- keyboard;
- reset;
- disable sensor.

Y movimiento visual resultante sigue sujeto a safety/reduced motion.

## 23 · Games

Motion controls pueden ser divertidos, pero:
- optional;
- calibrated;
- disableable;
- deadzone;
- conventional controls.

No esconder ventaja crítica detrás del sensor.

## 24 · Permission denial

Denied:
- no error grave;
- no insistir;
- UI sigue disponible.

No re-prompt loop.

## 25 · Sensor unavailable

API puede existir pero:
- hardware no;
- data null;
- permission denied.

Capability matrix:
```
API_EXISTS
PERMISSION
SENSOR_DATA_AVAILABLE
DATA_VALID
```

## 26 · Testing

### no sensor
UI alternative PASS.

### permission denied
no broken state.

### noisy sensor
no jitter actuation.

### orientation rotate
mapping remains correct.

### hidden
listener stopped/ignored.

### reduced motion
visual response safe.

### motion off
sensor input ignored.

## 27 · Current Iris Green audit

Archivos A5 auditados:
- `assets/ig-taller-r42.js`;
- `assets/ig-taller-r42-platform.js`;
- `tools/escenas-3d/src/index.js`;
- `sabik/iris-mount.mjs`.

No se encontraron usos de:
- DeviceOrientation;
- DeviceMotion;
- Accelerometer;
- Gyroscope;
- orientation sensor permissions.

Conclusión:
no existe sensor runtime que mantener hoy.

No introducir durante Formación.

## 28 · Boundary

Motor:
runtime/input/fallback.

Axioma:
criterio formal WCAG.

Lumen/Senda:
experiencia visual según producto.

Vigía/Lex:
privacidad/evidencia si sensores se registran.

## 29 · Anti-patterns

### shake-only action
falla alternativa.

### prompt on load
permiso sin contexto.

### raw angle → command
movimiento incidental dispara acción.

### sensor always-on
batería/privacidad.

### reduced-motion as sensor-disable
conceptos distintos.

## 30 · Estado R39

Estudiado:
- Device Orientation/Motion;
- permission model;
- Generic Sensor;
- filtering/deadzone/hysteresis;
- WCAG Motion Actuation;
- privacy/lifecycle;
- screen vs device orientation.

Auditoría:
- sin sensor APIs actuales en A5.

Marcador:
`MOTOR_SENSOR_MOTION_ACTUATION_STUDIED_R39`

No:
- sensor feature;
- permission prompt;
- motion controls;
- build;
- merge;
- deploy;
- main/production.
