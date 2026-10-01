# MOTOR · A5 · ESTUDIO PROFUNDO R32 · MOBILE LIFECYCLE, SUSPENSIÓN Y RESTAURACIÓN

Fecha: 01/10/2026
Amplía: R01–R31
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
No modifica producto.

## 1 · Regla principal

En móvil, una página puede:
- quedar oculta;
- perder foco;
- quedar congelada;
- entrar en bfcache;
- ser restaurada;
- ser destruida por el sistema sin un evento final fiable.

Por tanto:

**NO diseñar el lifecycle suponiendo que siempre habrá un “último callback”.**

## 2 · visibilitychange

Fuente:
- MDN · Document visibilitychange
  https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event
- MDN · Page Visibility API
  https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

`visibilitychange` → `hidden` es la última transición que suele ser observada de forma fiable antes de:
- cambio de app;
- cambio de tab;
- minimizar;
- navegación;
- cierre.

Uso:
- pausar UI updates;
- detener trabajo visual;
- guardar estado ligero si procede;
- marcar sesión como potencialmente interrumpida.

No asumir:
hidden = página destruida.

## 3 · pagehide

Fuente:
- MDN · Window pagehide
  https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event

`pagehide`:
- es compatible con bfcache;
- incluye `event.persisted`.

Pero:
**no es fiable en todos los cierres móviles**.

Caso documentado:
- abrir página;
- cambiar a otra app;
- cerrar navegador desde app manager;
- pagehide puede no ejecutarse.

Regla:
pagehide es útil para navegación/lifecycle, no como única garantía de persistencia.

## 4 · beforeunload

Fuente:
- MDN · Window beforeunload
  https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event

Uso legítimo:
advertir de cambios no guardados.

Limitaciones:
- requiere interacción previa/sticky activation para mostrar diálogo;
- texto del diálogo lo controla navegador;
- no es fiable en móvil;
- puede afectar bfcache en algunos navegadores.

Regla:
**no usar beforeunload como autosave.**

Añadir listener solo cuando existe estado dirty real.
Retirarlo cuando ya no es necesario, si la arquitectura lo permite.

## 5 · unload

Fuente:
- MDN · Window unload
  https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event

Estado:
MDN recomienda evitarlo.

Problemas:
- no fiable móvil;
- incompatible con bfcache en navegadores;
- Chrome ha dejado de dispararlo por defecto en muchos escenarios.

Regla:
Motor no introduce dependencias nuevas de unload.

## 6 · pageshow

Fuente:
- MDN · Window pageshow
  https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event

Puede ocurrir por:
- carga inicial;
- navegación;
- bfcache restore;
- restauración de página congelada en móvil;
- background tab;
- prerender.

Por tanto:
**pageshow no equivale a “el usuario ya está mirando activamente”.**

Si `event.persisted === true`:
posible restauración desde bfcache.

## 7 · bfcache

Fuente:
- web.dev · Back/forward cache
  https://web.dev/articles/bfcache

Antes de entrar:
`pagehide` con `persisted=true` puede indicar intención de bfcache.

Al volver:
`pageshow` con `persisted=true`.

Motor debe probar:
- listeners no duplicados;
- workers no duplicados;
- AudioContext coherente;
- timers;
- state freshness;
- resources;
- focus.

## 8 · freeze/resume

Algunos navegadores implementan estados de lifecycle:
- frozen;
- resumed.

No basar funcionalidad crítica exclusivamente en estos eventos porque soporte/semántica varían.

Usarlos como mejora cuando sean útiles.

## 9 · VisualViewport

Fuente:
- MDN · VisualViewport
  https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport

Móvil tiene:
- layout viewport;
- visual viewport.

Teclado en pantalla y pinch zoom pueden modificar visual viewport sin cambiar layout viewport del mismo modo.

Motor debe distinguir:
- tamaño de layout;
- área realmente visible.

Uso:
- editor;
- bottom sheet;
- toolbar;
- canvas;
- teclado virtual.

## 10 · Visual viewport y teclado

Con teclado en pantalla:
- controles pueden quedar tapados;
- caret puede salir del área visible;
- barra fija puede cubrir edición.

Regla:
no hardcodear altura usando solo `innerHeight`.

Cuando el componente depende del área visible:
observar `visualViewport.resize/scroll` con cuidado de loops y jank.

## 11 · Device Memory API

Fuente:
- MDN · Navigator.deviceMemory
  https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory

Estado 01/10/2026:
**Limited availability / no Baseline**.

Además:
- valor aproximado;
- redondeado;
- limitado por privacidad.

Regla:
solo heurística de calidad.
Nunca inferir capacidad exacta ni segmentar comportamiento crítico.

## 12 · Network Information API

Fuentes:
- MDN · Network Information API
  https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
- MDN · saveData
  https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation/saveData

Estado:
**Limited availability / no Baseline**.

`saveData` representa preferencia explícita de reducir datos cuando existe.

Uso posible:
- elegir asset más ligero;
- evitar precarga grande;
- no cargar media secundaria.

No:
bloquear funcionalidad esencial.

## 13 · Save-Data como preferencia

Fuente:
- MDN · Save-Data HTTP header
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Save-Data

Si está activo:
interpretarlo como preferencia de menor consumo.

No asumir:
saveData=false = conexión rápida o presupuesto ilimitado.

## 14 · Wake Lock

Fuentes:
- MDN · WakeLock
  https://developer.mozilla.org/en-US/docs/Web/API/WakeLock
- MDN · WakeLockSentinel release
  https://developer.mozilla.org/en-US/docs/Web/API/WakeLockSentinel/release_event

Estado:
**Baseline 2025 newly available**.

Puede evitar que pantalla se apague durante una experiencia activa.

Pero:
- puede ser rechazado;
- se libera al perder visibilidad/inactividad;
- puede liberarse por ahorro de energía;
- debe solicitarse otra vez si hace falta.

Regla:
no mantener pantalla despierta por defecto.

Solo:
- user intent explícito;
- actividad que lo necesita;
- liberar al terminar.

## 15 · Reanudación segura

Al volver visible:

No:
“resume todo”.

Sí:
1. comprobar si usuario había iniciado la actividad;
2. validar state;
3. renovar recursos que caducaron;
4. no reproducir audio automáticamente si no corresponde;
5. no duplicar timers;
6. reconciliar time.

## 16 · Media

Si media estaba reproduciéndose:
guardar intención, no solo estado técnico.

Ejemplo:
`playingBeforeHide=true`.

Al volver:
reproducir solo si:
- producto lo permite;
- user intent seguía vigente;
- autoplay policy lo permite;
- experiencia no sorprenderá.

## 17 · Runtime 3D

Actual:
`tools/escenas-3d/src/index.js` no renderiza cuando `document.hidden`.

Patrón positivo:
ahorra GPU mientras hidden.

Al volver:
`last` conserva timestamp anterior, pero `dt` se clampa a 0.05.

Esto evita gran salto simulado:
patrón defensivo útil.

## 18 · Auditoría Iris Green · Sabik

`sabik/iris-mount.mjs`:
usa `pagehide` para:
- invalidar serial;
- cancelar panel;
- disconnect transport.

No se observó `visibilitychange`.

Implicación:
pagehide cubre navegación, pero no todos los cierres móviles.

No se declara bug sin revisar ownership con Pulso/transport.
Sí queda candidato de arquitectura:
separar:
- hidden/suspend UI;
- pagehide/navigation;
- full disconnect.

## 19 · Auditoría Iris Green · Taller

`assets/ig-taller-estudio.js`:
usa `beforeunload` cuando `dirty`.

Esto es una finalidad legítima:
advertir cambios sin guardar.

No debe convertirse en mecanismo de autosave.

Prueba necesaria:
- listener solo cuando dirty;
- bfcache behavior;
- móvil;
- guardado/export antes de cerrar.

## 20 · App kill

No hay forma universal de ejecutar JS al ser terminado el proceso por OS.

Por tanto:
si perder un estado es inaceptable:
- persistir antes;
- hacerlo incremental;
- no esperar “cerrar”.

## 21 · Estado durable vs ephemeral

### Durable
proyecto del usuario, progreso autorizado.

Debe persistirse oportunamente.

### Ephemeral
hover, animation frame, menu open, temporary selection.

No necesita guardarse en cierre.

No serializar toda la UI por miedo a app kill.

## 22 · Lifecycle matrix

| Evento/estado | Acción típica |
|---|---|
| visible | actividad normal |
| hidden | pausar trabajo no necesario; checkpoint ligero |
| pagehide persisted | preparar freeze/bfcache |
| pagehide not persisted | teardown según recurso |
| pageshow persisted | reconcile/rebind |
| visible after hidden | resume solo según intención |
| app killed | no callback garantizado |

## 23 · Failure injection

Casos:
1. switch app;
2. screen lock;
3. background 5 min;
4. kill browser;
5. back/forward bfcache;
6. virtual keyboard;
7. rotate;
8. low power;
9. wake lock release.

PASS:
- no pérdida silenciosa crítica;
- no audio sorpresa;
- no duplicate work;
- no giant dt;
- no stale apply;
- UI sigue operable.

## 24 · Estado R32

Estudiado:
- visibility;
- pagehide/pageshow;
- beforeunload/unload;
- bfcache;
- VisualViewport;
- deviceMemory;
- Network Information;
- Save-Data;
- Wake Lock;
- mobile kill semantics.

Auditoría read-only:
- Sabik lifecycle;
- Taller dirty warning;
- runtime 3D hidden behavior.

Marcador:
`MOTOR_MOBILE_LIFECYCLE_SUSPEND_RESTORE_STUDIED_R32`

No:
- cambio de lifecycle;
- autosave;
- Wake Lock feature;
- network adaptation;
- build;
- merge;
- deploy;
- main/production.
