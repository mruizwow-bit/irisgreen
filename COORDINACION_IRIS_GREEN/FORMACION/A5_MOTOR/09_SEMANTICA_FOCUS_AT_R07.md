# MOTOR · A5 · ESTUDIO PROFUNDO R07 · SEMÁNTICA INTERACTIVA, FOCUS Y ASSISTIVE TECH

Fecha: 30/09/2026
Amplía: R01–R06
Puesto: **Interactive Systems & Web Runtime Engineer**

No es certificación externa.
Motor implementa runtime.
Axioma conserva autoridad de estándar/conformidad.

## 1 · Regla principal

**ARIA no añade comportamiento. ARIA promete comportamiento.**

Fuente:
- WAI-ARIA Authoring Practices Guide · Read Me First
  https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/

Principio:
“a role is a promise”.

Motor no debe:
- añadir roles para “mejorar accesibilidad” sin implementar su interacción;
- usar ARIA para sustituir HTML nativo disponible;
- considerar un nombre accesible como prueba de operabilidad.

## 2 · Versión normativa

Base de estudio:
- WAI-ARIA 1.2
  https://www.w3.org/TR/wai-aria-1.2/

WAI-ARIA 1.3 existe como Working Draft en 2026.

Regla:
no usar novedades de 1.3 como requisito vigente de producto hasta que Axioma determine la versión aplicable.

## 3 · role=application

Fuentes:
- WAI-ARIA 1.2 · application
  https://www.w3.org/TR/wai-aria-1.2/#application
- MDN · application role
  https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/application_role

`application` existe para una región con elementos focusables que requieren input de teclado/gesto y cuyo patrón no corresponde a widgets ARIA estándar.

Efecto importante:
algunas tecnologías de apoyo cambian de browse mode a un modo que entrega las teclas a la aplicación.

Consecuencia:
flechas y otras teclas pueden dejar de navegar el documento y pasar al widget.

MDN:
- usar con cautela;
- colocarlo en el contenedor mínimo;
- probar con tecnología de apoyo real.

## 4 · Auditoría read-only A5

Encontrado:

### R42 direct manipulation
`assets/ig-taller-r42-direct.js`
- Canvas focusable;
- `role="application"`;
- aria-label;
- keyboard arrows / Home / End / Space / Enter;
- semantic grid alternativa;
- role=status.

### R43 advanced
`assets/ig-taller-r43-advanced.js`
- helper Canvas focusable;
- `role="application"`;
- aria-label por motor;
- keyboard propio;
- role=status + aria-live polite.

Interpretación:
el uso tiene una razón técnica plausible porque Canvas necesita teclas no estándar.

NO se declara conformidad.

Gate futuro:
AT manual con:
- NVDA + Firefox/Chrome;
- JAWS si disponible;
- VoiceOver Safari/macOS/iOS;
- salida del widget y navegación posterior;
- descubribilidad de instrucciones;
- lectura de status;
- foco visible.

## 5 · ¿Cuándo NO usar role=application?

No usar si:
- botones/inputs/selects estándar resuelven la tarea;
- grid/tree/listbox/slider u otro widget ARIA conocido representa el patrón;
- la región es principalmente documento/contenido;
- solo se busca que el screen reader “mande flechas”.

Preferencia:
**patrón conocido > application genérico.**

## 6 · Canvas y semántica

Canvas es un bitmap para render visual.

Motor debe mantener un modelo de interacción accesible que represente:
- posición/selección;
- acción;
- estado;
- resultado.

Opciones:
- controles DOM paralelos;
- grid semántica;
- lista de objetos;
- inspector;
- equivalente textual;
- teclado y status.

El modelo accesible debe representar la misma tarea esencial, no una demo simplificada inútil.

## 7 · Focus como estado del runtime

Focus no es decoración.

El runtime debe responder:
- ¿dónde entra Tab?;
- ¿qué recibe flechas?;
- ¿cómo sale?;
- ¿qué ocurre tras cerrar panel/dialog?;
- ¿qué ocurre tras borrar el elemento enfocado?;
- ¿se conserva el contexto al volver?

Regla:
**no mover foco para anunciar cambios si una live region resuelve el caso.**

## 8 · Dialog

Fuente:
- WAI APG · Modal Dialog Pattern
  https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

Un modal debe:
- contener los controles necesarios;
- tener nombre;
- gestionar foco;
- ofrecer cierre visible;
- devolver foco de forma lógica al cerrar.

### A5 observado

R42 usa `<dialog>` nativo cuando `showModal()` existe y conserva trigger para devolver foco en `close`.

Patrón positivo:
usar comportamiento nativo antes que recrear modal con divs.

## 9 · role=status y aria-live

Fuentes:
- W3C ARIA22 · role=status
  https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22
- WAI · Status Messages
  https://www.w3.org/WAI/WCAG22/Understanding/status-messages

`role=status` tiene semántica live polite.

Sirve para:
- “guardado”;
- “celda X”;
- “modo edición”;
- resultado no urgente.

No mover foco al status.

Cuidado:
actualizar demasiado rápido puede:
- interrumpir;
- generar cola verbal;
- convertir interacción fina en ruido.

Regla Motor:
**announce milestones, not every frame.**

## 10 · Auditoría status A5

R42 direct:
el status cambia al mover cursor/activar una celda.

R43 advanced:
cada editor tiene un status común; algunas acciones actualizan mensajes.

Prueba futura:
- uso rápido de flechas;
- paint continuo;
- play mode;
- comprobar si anuncios son útiles o excesivos.

No se puede concluir solo leyendo código; depende de AT.

## 11 · aria-live container lifecycle

Una live region funciona mejor cuando el contenedor existe antes de actualizar el mensaje.

No crear/destrozar continuamente:
`<p role=status>mensaje</p>`

Preferir:
`<p role=status></p>`
y actualizar contenido.

A5 ya crea status temprano dentro del editor.

Patrón positivo.

## 12 · aria-atomic

W3C ARIA22 señala que `status` tiene `aria-atomic=true` implícito, aunque algunos entornos históricos no siempre se comportan así.

Si el mensaje necesita contexto completo y AT real demuestra fragmentación:
Axioma/Motor pueden valorar `aria-atomic="true"`.

No añadir por rutina.

## 13 · Focus + Canvas cursor

Para una cuadrícula virtual existen dos modelos:

### Focus físico
cada celda DOM puede recibir foco.

Ventajas:
semántica/navegación nativa más explícita.

Coste:
miles de nodos/foco complejo.

### Focus compuesto
un único Canvas/host mantiene foco y un cursor lógico interno se mueve.

Ventajas:
alto rendimiento.

Obligaciones:
- instrucciones;
- cursor visual;
- status;
- salida clara;
- equivalente semántico.

A5 utiliza principalmente el segundo modelo en Canvas avanzado.

## 14 · aria-activedescendant

Fuente:
- WAI-ARIA 1.2
  https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant

Puede representar foco lógico dentro de widgets compuestos sin mover DOM focus.

No usar si los elementos lógicos no tienen representación DOM accesible adecuada.

Para Canvas puro no resuelve por sí solo el problema porque necesita elementos identificables en el accessibility tree.

## 15 · Native controls first

HTML:
- button;
- input;
- select;
- textarea;
- dialog;
- details/summary

ya aporta:
- semántica;
- keyboard;
- focus;
- states;
- AT mapping.

Motor crea custom behavior solo donde el dominio realmente lo necesita.

## 16 · Keyboard instructions

Un Canvas complejo debe permitir descubrir:
- teclas;
- modo actual;
- cómo salir;
- cómo activar;
- cómo cancelar.

No confiar solo en placeholder visual o tooltip hover.

La instrucción puede:
- asociarse mediante aria-describedby;
- estar visible;
- aparecer en Ayuda accesible.

## 17 · Escape

Escape puede:
- cancelar drag/mode;
- cerrar dialog;
- salir de una operación.

Pero no debe interceptarse globalmente sin contexto.

Para role=application:
no asumir que Escape siempre “saca del screen reader mode”; eso depende de AT.

Motor debe implementar semántica propia de cancelación y probar salida del widget.

## 18 · Error vs status vs alert

### status
información no urgente.

### alert
importante/urgente; live assertive implícito.

### focus movement
cambio de contexto que requiere interacción inmediata.

Anti-patrón:
hacer todos los mensajes `role=alert`.

## 19 · Automated accessibility ≠ AT QA

Axe puede detectar:
- roles inválidos;
- nombres faltantes;
- relaciones.

No demuestra:
- que application mode sea usable;
- que las flechas hagan lo esperado con NVDA;
- que live region no sea ruidosa;
- que VoiceOver anuncie la tarea;
- que el modelo alternativo sea equivalente.

Gate Motor:
`AUTOMATION + MANUAL KEYBOARD + REAL AT`.

Axioma decide gate formal.

## 20 · Hallazgo de formación

A5 históricamente hizo bien:
- Canvas focusable;
- aria-label;
- teclado;
- status;
- semantic fallback;
- native dialog focus restore.

El punto que requiere más evidencia es:
**role=application + experiencia real con AT.**

No eliminar el rol por intuición.
No mantenerlo por intuición.
Probarlo.

## 21 · Estado R07

Auditoría read-only:
- role application R42/R43: completada;
- status/live regions: completada;
- native dialog focus pattern: revisado.

Pendiente:
- AT real por entorno;
- decisión final de Axioma.

Marcador:
`MOTOR_INTERACTIVE_SEMANTICS_FOCUS_AT_STUDIED_R07`

No:
- cambio ARIA;
- refactor;
- build;
- merge;
- deploy;
- main/producción.
