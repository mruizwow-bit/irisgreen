# MOTOR · A5 · ESTUDIO PROFUNDO R17 · USER ACTIVATION, PERMISSIONS Y PRIVILEGED UI

Fecha: 30/09/2026
Amplía: R01–R16
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Algunas APIs requieren intención humana reciente

Fuentes:
- MDN · User activation
  https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/User_activation
- MDN · Navigator.userActivation
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userActivation

`navigator.userActivation`:
- `isActive` = transient activation;
- `hasBeenActive` = sticky activation.

Widely available desde 2023.

## 2 · Transient vs sticky

### Transient
Dura poco y algunas APIs la consumen.

Ejemplos:
- file pickers;
- fullscreen;
- pointer lock;
- clipboard operations;
- Window.open.

### Sticky
Indica que hubo interacción en la sesión.

Ejemplos:
- autoplay/Web Audio policies en ciertos casos;
- beforeunload gating.

Regla:
**no intercambiar ambas semánticas.**

## 3 · El orden de llamadas importa

Si una API requiere transient activation:

```js
button.onclick = async () => {
  const handle = await showOpenFilePicker(); // gated call first
  const file = await handle[0].getFile();
  ...
};
```

Peligro:
```js
button.onclick = async () => {
  await expensiveAsyncSetup();
  await showOpenFilePicker(); // activation may be gone
};
```

No confiar en una ventana temporal concreta; browsers pueden variar.

## 4 · Activation can be consumed

Algunas APIs consumen transient activation.

Ejemplo MDN:
si se combina pointer lock + fullscreen, el orden puede importar.

Por tanto:
si un gesto debe lanzar dos capacidades privilegiadas:
- estudiar reglas específicas;
- no asumir que una activación sirve ilimitadamente.

## 5 · File System Access

Fuente:
- MDN · showOpenFilePicker()
  https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker

Requiere:
- secure context;
- transient user activation.

Estado:
Limited availability.

Fallback:
`<input type=file>`.

## 6 · Auditoría Taller

`assets/ig-taller-r42.js`.

Patrón actual:

```text
click
→ showOpenFilePicker()
→ getFile()
→ file.text()
→ validate
→ commitImport
```

Positivo:
la gated call ocurre inmediatamente dentro del click.

También:
`AbortError` se ignora como cancelación de usuario.

No se presenta “No se pudo abrir” por cerrar el picker.

Buen patrón.

## 7 · Capability text

R42 anuncia:
“Guardado avanzado disponible...”
si detecta File System Access.

Regla:
feature detection ≠ permission granted.

Un método puede existir y luego:
- usuario cancelar;
- permiso denegarse;
- OS fallar.

El copy no debe prometer success; solo disponibilidad potencial.

## 8 · Fullscreen

Fuente:
- MDN · requestFullscreen()
  https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen

Requiere transient activation.

También puede estar limitado por Permissions Policy.

Motor debe:
- pedir solo tras acción explícita;
- escuchar `fullscreenchange`;
- manejar rechazo;
- mantener controles accesibles para salir.

No simular fullscreen ocultando browser chrome con hacks.

## 9 · Pointer Lock

Fuente:
- MDN · requestPointerLock()
  https://developer.mozilla.org/en-US/docs/Web/API/Element/requestPointerLock

Estado 2026:
Limited availability.

Requiere transient activation.

Uso:
juegos donde el mouse controla movimiento relativo.

No usar para:
- dibujo;
- navegación común;
- esconder cursor.

Debe existir forma clara de salir.

## 10 · Fullscreen + pointer lock

MDN documenta que el orden puede ser relevante porque fullscreen puede consumir activation.

Regla:
si algún Taller de videojuego requiere ambos:
probar secuencia específica por browser.

No introducir ahora.

## 11 · Clipboard

Fuente:
- MDN · Clipboard API
  https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API

Secure context.
Requisitos de activation/permissions varían entre browsers y operaciones.

Regla:
Copy/Paste:
- acción explícita;
- fallback razonable;
- no leer clipboard silenciosamente;
- manejar permission/rejection.

No inferir soporte solo por `navigator.clipboard`.

## 12 · Audio

Web Audio ya estudiado en R10.

Activation:
la primera interacción puede ser necesaria para `AudioContext.resume()`.

Patrón:
Play button:
- resume;
- schedule.

No:
crear autoplay invisible en load.

## 13 · Wake Lock

Fuentes:
- MDN · WakeLock
  https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
- MDN · WakeLock.request()
  https://developer.mozilla.org/en-US/docs/Web/API/WakeLock/request

Baseline 2025 / newly available.

Solo visible documents pueden adquirir screen wake lock.
Puede ser revocado por sistema, batería, visibilidad.

No usar en Rincón por defecto.

Solo si existe necesidad clara:
- actividad larga;
- user expectation;
- control;
- release al terminar.

## 14 · Permissions Policy

Algunas capacidades están controladas además por headers/iframe `allow`.

Motor debe distinguir:
- API supported;
- user activation;
- permission;
- Permissions Policy;
- document state.

Error “NotAllowed” puede venir de varias capas.

## 15 · Secure context

Varias APIs avanzadas requieren HTTPS.

Netlify/producción lo proporciona, pero:
- tests local HTTP pueden comportarse distinto;
- localhost suele tener tratamiento especial para secure context según API.

No declarar incompatibilidad sin revisar contexto.

## 16 · User cancellation

Cancel es outcome normal.

Ejemplos:
- picker closed;
- permission prompt denied;
- fullscreen rejected;
- pointer lock exited.

UI:
- vuelve a estado previo;
- conserva trabajo;
- no role=alert salvo necesidad.

## 17 · Permission denial

No volver a pedir en bucle.

Ofrecer:
- alternativa;
- explicación;
- reintentar por acción nueva.

No “nag”.

## 18 · Activation debugging

```js
navigator.userActivation.isActive
navigator.userActivation.hasBeenActive
```

Puede ayudar a diagnosticar.

No usar para fingerprinting/analytics.

## 19 · Deferred actions

Si primero necesitamos:
- guardar;
- validar;
- procesar

y luego pedir una API gated:
pedir nueva acción explícita.

No intentar “guardar activación” artificialmente.

## 20 · Keyboard activation

Activación puede provenir de keydown válido según plataforma/spec.

Por eso:
usar `button` nativo + click normalmente conserva entrada:
- mouse;
- touch;
- keyboard.

No ligar capability solo a pointerdown.

## 21 · Mobile

Prompts/pickers pueden:
- sacar de app;
- cambiar visibilidad;
- causar resize;
- suspender audio.

Después del retorno:
revalidar state/lifecycle.

## 22 · Testing matrix

### File picker
- select valid;
- cancel;
- invalid file;
- slow read;
- permission issue.

### Fullscreen
- click;
- Escape;
- denied;
- mobile;
- iframe policy.

### Audio
- first play;
- suspend/resume.

### Activation
- direct;
- after awaited task;
- keyboard;
- touch.

## 23 · Audit status Iris Green

En archivos auditados:
- File System Access sí aparece;
- no se encontraron usos canónicos actuales de:
  - pointer lock;
  - Wake Lock;
  - Clipboard API;
  - fullscreen en A5.

No introducirlos por Formación.

## 24 · Estado R17

Auditoría:
- File System Access activation path: revisado;
- cancellation handling: patrón positivo;
- capability/permission distinction: estudiada.

Marcador:
`MOTOR_USER_ACTIVATION_PRIVILEGED_APIS_STUDIED_R17`

No:
- nueva permission;
- fullscreen/pointerlock;
- clipboard;
- wake lock;
- build;
- merge;
- deploy;
- main/production.
