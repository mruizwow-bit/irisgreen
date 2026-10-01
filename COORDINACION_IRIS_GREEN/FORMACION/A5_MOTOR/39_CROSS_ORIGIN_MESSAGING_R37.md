# MOTOR · A5 · ESTUDIO PROFUNDO R37 · CROSS-ORIGIN MESSAGING, IFRAMES Y SANDBOX

Fecha: 01/10/2026
Amplía: R01–R36
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

`postMessage()` atraviesa una frontera de seguridad.

Todo mensaje recibido desde otra ventana se trata como **input no confiable** hasta validar:
- origin;
- source;
- type/schema;
- sequence/ownership;
- expected state.

## 2 · window.postMessage

Fuente:
- MDN · Window.postMessage()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

Permite comunicación:
- parent ↔ iframe;
- opener ↔ popup;
- cross-origin cuando existe referencia Window.

Los datos usan structured clone.

No hace validación de protocolo por nosotros.

## 3 · targetOrigin

Regla:
si se conoce el origen destino:
**usar origen exacto, no `*`.**

Debe incluir:
- scheme;
- host;
- port.

`*` solo cuando:
- origen es opaco (casos específicos);
- protocolo diseñado expresamente;
- no se transmite información sensible;
- no existe alternativa.

No usar por comodidad.

## 4 · Receiver validation

Listener:
```js
window.addEventListener("message", event => {
  if (event.origin !== EXPECTED_ORIGIN) return;
  if (event.source !== expectedWindow) return;
  if (!validMessage(event.data)) return;
  // act
});
```

Validar:
1. origin;
2. source si posible;
3. schema;
4. action allowlist.

No ejecutar:
`event.data.action`
directamente como nombre de función sin mapping.

## 5 · Origin is sender origin at send time

No confiar en:
- contenido actual del frame después;
- URL mostrada anteriormente.

La ventana puede navegar.

`event.origin` representa origen asociado al envío.

`event.source` ayuda a vincular con ventana esperada.

## 6 · Protocol versioning

Mensaje:
```json
{
  "protocol": "ig-frame-v1",
  "type": "ready",
  "requestId": "..."
}
```

Ventajas:
- rechazar mensajes ajenos;
- evolucionar schema;
- test;
- trazabilidad.

No usar payloads ambiguos:
`"ok"`, `true`, arrays posicionales.

## 7 · Request/response ownership

Para acciones async:
- requestId;
- revision;
- timeout/cancel;
- expected source.

No aplicar response vieja a frame nuevo/navegado.

## 8 · MessageChannel

Fuentes:
- MDN · Channel Messaging API
  https://developer.mozilla.org/en-US/docs/Web/API/Channel_Messaging_API
- MDN · MessagePort
  https://developer.mozilla.org/en-US/docs/Web/API/MessagePort

Patrón:
1. parent crea MessageChannel;
2. transfiere port2 al frame mediante postMessage;
3. ambos usan port dedicado.

Ventaja:
reduce tráfico global `window.message` después de handshake.

Sigue necesitando handshake seguro inicial.

## 9 · Port ownership

MessagePort es transferable.

Después de transferir:
owner anterior no debe usar ese port transferido.

Al cerrar:
`port.close()`.

Lifecycle:
- frame removed;
- navigation;
- component destroy;
- pagehide
pueden requerir cierre/re-handshake.

## 10 · messageerror

Structured clone puede fallar.

Escuchar/considerar `messageerror` donde el protocolo lo justifica.

No asumir todo payload cloneable.

## 11 · Transferables

Puede transferirse:
- ArrayBuffer;
- MessagePort;
- otros recursos transferibles.

Ownership cambia.

No transferir objeto y después continuar modificándolo como si siguiera owned.

## 12 · iframe sandbox

Fuente:
- MDN · <iframe>
  https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe

`sandbox` sin tokens aplica restricciones fuertes.

Tokens abren capacidades:
- allow-scripts;
- allow-same-origin;
- allow-forms;
- allow-popups;
- allow-top-navigation-by-user-activation;
etc.

Regla:
**mínimo privilegio.**

No copiar un sandbox largo entre proveedores sin entender cada token.

## 13 · allow-scripts + allow-same-origin

MDN advierte:
en iframe same-origin, combinar ambos puede permitir que el contenido elimine el atributo sandbox, anulando la protección práctica.

Por tanto:
sandbox no es “seguro porque existe”.

Origen separado sigue siendo frontera importante.

## 14 · Opaque origin / null

Un sandbox sin `allow-same-origin` puede tener origin serializado como `null`.

Eso complica validar solo `event.origin`.

En esos casos:
- controlar source;
- token/handshake;
- protocolo mínimo;
- origen del recurso/arquitectura.

No aceptar cualquier evento `origin === "null"`.

## 15 · iframe allow / Permissions Policy

`allow` del iframe puede delegar capacidades.

Separar:
- sandbox = restricciones del browsing context;
- allow/Permissions Policy = capacidades permitidas.

No conceder cámara/micrófono/etc a frames que no lo necesitan.

## 16 · Current Iris Green headers

La CSP actual permite frame-src concretos para:
- YouTube nocookie;
- Vimeo;
- Instagram;
- Sabik Cloud origin histórico/configurado.

Motor no cambia esta política.

Si algún frame necesita messaging:
origen exacto debe salir de config canónica, no substring matching.

## 17 · URL origin validation

Mal:
```
event.origin.includes("youtube")
```

Bien:
```
new URL(configuredOrigin).origin
event.origin === expected
```

No regex permisiva sobre host.

## 18 · Confused deputy

Riesgo:
frame A manda al parent:
“envía este dato a B”.

Parent tiene más privilegios y actúa sin validar.

Motor debe:
- autorizar message type;
- limitar payload;
- no convertir parent en proxy genérico.

## 19 · Data minimization

No enviar al frame:
- estado global entero;
- datos sensibles que no necesita;
- tokens amplios.

Enviar capability mínima:
```
{theme:"dark", locale:"es"}
```
si eso basta.

## 20 · Replay messages

Un atacante/frame comprometido podría repetir mensajes válidos antiguos.

Para acciones sensibles:
- requestId;
- state/nonce;
- one-shot;
- current source;
- lifecycle epoch.

No necesario para simples “resize” informativos.

## 21 · Resize messaging

Frame puede comunicar altura.

Parent debe:
- validar number;
- clamp min/max;
- throttle/coalesce;
- no aplicar CSS arbitrario recibido.

```
height = clamp(Number(data.height), 200, 2000)
```

No:
`style = event.data.style`.

## 22 · Navigation messages

No aceptar:
`{navigate: arbitraryUrl}`
y asignar location directamente.

Allowlist:
- rutas internas;
- protocolos http(s);
- origin.

Para external:
acción/user confirmation según producto.

## 23 · Current repo audit

Búsqueda canónica actual:
no se encontraron referencias `postMessage` en el repositorio.

Conclusión:
no existe protocolo window-message que A5 deba mantener hoy.

Bloque es formación preventiva por frames externos y futuras integraciones.

## 24 · Testing

### sender valid
origin+source+schema → accept.

### wrong origin
reject.

### correct origin wrong source
reject.

### invalid schema
reject.

### stale request ID
ignore.

### frame navigates
old handshake invalid.

### port close
no pending hang.

### sandbox opaque origin
validate architecture-specific source/token.

## 25 · Playwright testing

Se puede:
- montar iframe local/origin alternativo;
- dispatch real postMessage;
- navegar iframe entre mensajes;
- comprobar reject;
- transferir MessagePort.

No mockear toda la seguridad si una prueba real de origin puede ejecutarse.

## 26 · Security boundary with CORS/CSP

postMessage no es CORS.

CORS:
red/fetch.

postMessage:
browsing-context communication.

CSP frame-src:
qué se puede embeber.

sandbox:
qué puede hacer frame.

Permissions Policy:
qué APIs puede usar.

No mezclar controles.

## 27 · Anti-patterns

### targetOrigin "*"
cuando se conoce destino.

### no origin check
XSS/cross-site message risk.

### origin-only with opaque contexts
insuficiente.

### arbitrary command dispatch
payload decide función.

### parent as proxy
confused deputy.

### sandbox checkbox
añadir tokens sin mínimo privilegio.

## 28 · Estado R37

Estudiado:
- Window.postMessage;
- origin/source validation;
- protocol schemas;
- MessageChannel/Port;
- transfer ownership;
- iframe sandbox;
- opaque origins;
- confused deputy;
- cross-origin testing.

Auditoría:
- sin postMessage current code;
- frame-src context revisado previamente.

Marcador:
`MOTOR_CROSS_ORIGIN_MESSAGING_SANDBOX_STUDIED_R37`

No:
- iframe protocol;
- sandbox change;
- CSP change;
- provider integration;
- build;
- merge;
- deploy;
- main/production.
