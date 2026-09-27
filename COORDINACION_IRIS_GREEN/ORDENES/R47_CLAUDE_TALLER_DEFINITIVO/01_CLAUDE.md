# ORDEN DE MARÍA · CLAUDE · TALLER DEFINITIVO

Fecha: 27/09/2026  
Responsable de construcción: **Claude**  
Puerta de integración: **A2**  
Revisión previa a integración: **Astra**  
Aceptación final: **HUMAN QA de María**

Esta orden parte de una auditoría real del Taller R43 aportado por María y sustituye cualquier interpretación de “Taller terminado” basada en conteos, axe, build o existencia de páginas.

El objetivo es convertir **todo el Taller público actual** en un único sistema de aplicaciones creativas modernas, accesibles, child-safe y coherentes con R42 + Design R02.

No construir otra demo. No parchear solo la portada. No dejar dos generaciones de Taller coexistiendo.

---

# 0. FUENTES AUDITADAS POR ASTRA

María aporta dos paquetes:

- `R43_TALLER_CREATIVO_v2.patch.gz`
  - SHA-256: `72702ab39da1698fe09ca0903ececf3caa89d1a98963fb5617ff5e341aad7f72`
  - entrega declarada R43;
  - 27 estudios visibles en portada;
  - 13 estudios reconstruidos con suite R43;
  - 13 estudios legacy fuera de la suite;
  - Dibujo permanece como piloto aparte.

- `COORDINACION_R43_R44_v2.patch`
  - SHA-256: `e0d8340ddd97ea5baaf552914a2e678b623bc82d387532cf9b2a366e57fa405e`.

## Hallazgos duros de Astra

### A. Child-safe NO está implementado
En ambos paquetes auditados:
- `SAFE_BY_DEFAULT`: 0;
- `S2_HIGH_SENSITIVITY`: 0;
- `sensitivity`: 0;
- `discovery`: 0;
- `audience` como contrato child-safe: 0;
- `child-safe`: 0.

R43 usa `child/teen/adult` solo como **etapa de vida / ejemplos**, no como seguridad de contenido.

### B. Design R02 NO está integrado en R43
En ambos paquetes:
- `ig-r42-materials`: 0;
- `IGPreferences`: 0;
- `prefers-reduced-transparency`: 0.

Usar el app shell R42 NO equivale a aplicar Design R02.

### C. Cobertura fragmentada
R43 reconstruye 13 estudios con motor suite:
1. Estructuras;
2. Programación;
3. Robótica;
4. Ritmo;
5. Composición;
6. Síntesis;
7. Videojuegos;
8. Modelado 3D;
9. Videomapping;
10. Arquitectura;
11. Pixel Art;
12. Cómic;
13. Diseño gráfico.

Dibujo queda como piloto distinto.

Siguen legacy:
1. Color;
2. Patrones y arte generativo;
3. Fotografía y composición;
4. Moda y textil;
5. Máquinas e inventos;
6. Circuitos;
7. Papiroflexia y poliedros;
8. Simulaciones;
9. Escritura con restricciones;
10. Mundos;
11. Lenguas inventadas;
12. Juegos de mesa;
13. Ideas e inventos.

La portada v2 muestra **27 estudios**, pero el interior pertenece a tres generaciones diferentes.

### D. El workspace no domina el primer viewport
El generador R43 coloca antes de `#igt-app`:
- hero;
- “Qué puedes crear aquí”;
- “Cómo se usa”;
- listas de pasos.

Esto contradice la orden workspace-first:
**la herramienta debe aparecer primero; ayuda/reto/instrucciones van a drawer/panel secundario.**

### E. Persistencia contradictoria
R43 declara “sin almacenamiento en navegador”, mientras:
- la portada habla de “Mi colección y proyectos guardados en este dispositivo”;
- el carril A5 conserva IndexedDB;
- existe la observación `OBS-R42-TALLER-STORAGE-01`.

R47 cierra esta contradicción con un único contrato de persistencia definido abajo.

---

# 1. ARRANQUE OBLIGATORIO

Antes de tocar código:

1. leer esta orden completa;
2. leer Control Maestro vigente;
3. leer Memoria Maestra vigente;
4. leer #285;
5. leer PR #299;
6. leer #301 Design R02;
7. leer #293 y #302 child-safe;
8. leer `R42_TALLER_INTERFAZ_INVESTIGACION_INTENSIVA_20260926.md`;
9. leer `R42_TALLER_FISICA_CSP_DUAL_ENGINE_20260926.md`;
10. releer HEAD/tree reales de A2;
11. publicar `R47_CLAUDE_TALLER_BASE_READ`;
12. construir en la misma sesión;
13. actualizar Memoria + Control al entregar.

El acuse NO es una fase de espera.

---

# 2. BASE Y PRECEDENCIA

Repositorio:
`mruizwow-bit/irisgreen`

Puerta web:
PR #244 · rama `agent2/sabik-iris-r08-20260924`.

HEAD observado al emitir:
`bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`.

**No congelar ese SHA.** Releer base exacta antes de ramificar.

## Donantes, no soluciones finales

Claude debe estudiar y reconciliar:
- R43 v2 de Claude;
- PR #299 de A5;
- Dibujo actual;
- Design R02;
- app shell R42.

No elegir “todo R43” o “todo PR299” por comodidad.

Por cada estudio:
1. identificar el motor más avanzado ya existente;
2. conservar la parte funcional buena;
3. eliminar duplicaciones;
4. montar ese motor dentro de la arquitectura R47 común.

R43 v2 y PR299 pasan a ser **donantes**.

---

# 3. OBJETIVO DE PRODUCTO

## 27/27 ESTUDIOS · UNA SOLA GENERACIÓN

El Taller público actual tiene 27 estudios.

R47 no termina hasta que los **27/27**:
- usan la interfaz nueva;
- usan Design R02;
- tienen child-safe;
- tienen ES/EN;
- tienen desktop/móvil;
- tienen alternativa accesible;
- producen un artefacto real;
- pasan HUMAN QA funcional.

No se acepta:
- 13 modernos + 13 legacy;
- Dibujo como excepción visual;
- una portada nueva sobre interiores antiguos;
- “la página existe” como aceptación.

---

# 4. LOS CINCO PERFILES DE BANCO DE TRABAJO

Mantener la arquitectura investigada y aprobada en la memoria R42:

## 4.1 Lienzo / composición visual
- Dibujo
- Diseño gráfico
- Pixel Art
- Cómic
- Color
- Patrones y arte generativo
- Fotografía y composición
- Moda y textil
- Ideas

## 4.2 Construir ↔ probar / espacial
- Estructuras
- Arquitectura
- Modelado 3D
- Máquinas
- Circuitos
- Papiroflexia y poliedros
- Simulaciones
- partes espaciales de Mundos/Juegos de mesa

## 4.3 Línea de tiempo
- Ritmo
- Composición
- Síntesis
- Videomapping
- animación cuando corresponda en Pixel Art

## 4.4 Bloques ↔ código ↔ ejecutar
- Programación
- Robótica
- Diseño de videojuegos

## 4.5 Documento / sistema de conocimiento
- Escritura con restricciones
- Mundos
- Lenguas inventadas
- Juegos de mesa
- Ideas cuando trabaje como sistema documental

Los perfiles comparten infraestructura, pero NO deben sentirse como el mismo programa con otro título.

---

# 5. NUEVA PORTADA DEL TALLER

## Primer viewport

La portada NO muestra 27 tarjetas a la vez.

Orden:

1. título compacto;
2. `Contenido para… / Content for…`;
3. **Continuar / recientes de esta sesión** si existen;
4. 3 propuestas “Para empezar”;
5. cinco perfiles visuales;
6. buscador / Acciones;
7. acceso secundario a Todos los estudios;
8. Proyectos / guardado en panel, no como bloque largo.

## Cinco perfiles como launcher visual

Cada perfil debe tener una microexperiencia visual real:
- Lienzo: trazo/capas;
- Construir: pieza/estructura/física;
- Tiempo: playhead/pistas;
- Código: bloques + salida;
- Documento: mapa/estructura/secciones.

No acordeones.

No párrafos largos.

No seis `details`.

## “Todos los estudios”

Secundario:
- sheet/drawer/página interna;
- filtros por perfil;
- búsqueda;
- etapa;
- no 27 tarjetas dominando el primer viewport.

---

# 6. CONTENIDO PARA… · ETAPA DE VIDA

Contrato común con Home A8:

- Infancia / Children
- Adolescencia / Teenagers
- Adultez / Adults
- Cualquier edad / Any age

Sin selección:
`SAFE_BY_DEFAULT`.

## Regla
La etapa:
- cambia ejemplos;
- cambia contextos;
- puede cambiar vocabulario/andamiaje;
- NO limita herramientas;
- NO equivale a competencia;
- NO se usa como diagnóstico;
- NO identifica a la persona;
- NO pide DOB;
- NO pide cuenta;
- NO pide identidad.

Preferencia:
- efímera por defecto;
- URL/estado de sesión;
- no perfil.

No reintroducir `sessionStorage["ig42-stage"]` como identidad persistente.

---

# 7. CHILD-SAFE REAL EN EL TALLER

La protección infantil se aplica al **contenido curado por Iris Green y a discovery**, NO a analizar o vigilar lo que crea la persona.

## 7.1 Metadata obligatoria

Cada:
- estudio;
- starter;
- reto;
- plantilla;
- ejemplo;
- ayuda;
- recurso enlazado;
- recomendación;
- enlace cruzado;
- proyecto R44 futuro;

debe poder declarar:

- `audience[]`;
- `sensitivity`;
- `discovery`;
- `safe_variant_id` si procede;
- `review_reason`;
- versión/fecha editorial.

Sensibilidad:
- `S0_GENERAL`
- `S1_SENSITIVE`
- `S2_HIGH_SENSITIVITY`

Discovery:
- `NORMAL`
- `INTENTIONAL_ONLY`
- `SAFE_VARIANT_REQUIRED`

## 7.2 SAFE_BY_DEFAULT

DEFAULT / INFANCIA:
- no S2 en “Para empezar”;
- no S2 en retos sugeridos;
- no S2 en búsquedas/autocomplete;
- no S2 en ayuda contextual;
- no S2 en enlaces relacionados;
- no S2 en “prueba también”;
- no S2 en contenido precargado;
- full S2 fuera de payload inicial.

ADOLESCENCIA:
- S2 nunca incidental;
- intención clara → variante segura;
- no full S2 precargado.

ADULTEZ:
- S2 solo con intención explícita cuando exista una razón editorial real.

## 7.3 Filtrar antes

El filtro child-safe ocurre **antes** de:
- ordenar;
- rankear;
- sugerir;
- construir cards;
- autocomplete;
- related;
- generar starters.

No filtrar tarde con CSS.

## 7.4 Contenido generado por la persona

NO:
- escanear dibujos;
- clasificar textos privados;
- inferir edad/diagnóstico;
- subir obras;
- perfilar creatividad.

El child-safe de R47 protege el **contenido que Iris Green muestra o recomienda**.

## 7.5 Enlaces externos / contenido de Iris Green

Si un reto enlaza a Condiciones/Situaciones/Investigación:
- respetar contrato #293/#302;
- default/child/teen nunca saltan incidentalmente a full S2;
- usar variante segura cuando corresponda.

---

# 8. INTERFAZ DE CADA ESTUDIO · WORKSPACE-FIRST

## 8.1 Prohibición

Eliminar del primer flujo:
- hero largo;
- “Qué puedes crear aquí” antes del lienzo;
- “Cómo se usa” antes del lienzo;
- listas de pasos antes de empezar;
- retos antes del workspace;
- documentación técnica antes de la herramienta.

Todo eso pasa a:
- Ayuda;
- Starter;
- Reto;
- Información;
- drawer/dialog/sheet.

## 8.2 Desktop

Primer viewport:

### Topbar compacta
- Volver al Taller;
- título;
- Deshacer / Rehacer;
- Editar / Probar si aplica;
- Archivo;
- Exportar;
- Acciones.

### Izquierda · Estructura
Nombre contextual:
- Capas;
- Objetos;
- Escena;
- Pistas;
- Archivos;
- Secciones.

Debe estar ligado al modelo real del proyecto.

### Centro · workspace
La herramienta domina.

### Derecha · Inspector
Propiedades del elemento seleccionado.

No controles genéricos desconectados.

### Abajo · zona contextual
Según perfil:
- herramientas;
- timeline;
- consola;
- métricas;
- restricciones.

No toolbar universal rígida.

## 8.3 Tablet

- workspace dominante;
- docks plegables;
- no aplastar el canvas.

## 8.4 Móvil 390/320

- workspace primero;
- bottom dock;
- Estructura e Inspector como **bottom sheets mutuamente excluyentes**;
- Archivo/Ayuda/Reto en sheets/popovers;
- nada esencial por hover;
- ninguna columna interminable;
- no page overflow horizontal.

El workspace puede pan/zoom internamente cuando sea esencial, pero la página no debe desbordar.

---

# 9. DESIGN R02 · OBLIGATORIO

R47 consume el sistema material vigente; no crea otro.

Usar:
- `assets/ig-r42-materials.css`;
- `assets/preferencias-lectura.js`;
- `window.IGPreferences`;
- atributos/tokens R02 vigentes.

## Reglas

Cristal solo en:
- topbar;
- rail/dock;
- inspector;
- popover;
- sheet;
- controles flotantes.

Opaco:
- canvas;
- documento;
- código;
- timeline;
- contenido largo;
- ayuda de lectura;
- tablas.

No glass-on-glass.

Estados:
- Normal;
- Transparencia reducida;
- Opaco.

Obligatorio:
- `prefers-reduced-transparency`;
- forced colors;
- reduced motion;
- high contrast por tokens;
- no filtro global sobre imágenes/canvas.

## Cobertura

100 % de rutas Taller ES/EN.

No estudio queda accidentalmente con materiales antiguos.

---

# 10. MODELO DE PROYECTO COMÚN

Cada estudio debe tener un modelo independiente del renderer.

Del mismo estado derivan:
- workspace;
- Estructura;
- Inspector;
- undo/redo;
- exportación;
- guardado;
- Mirror DOM accesible;
- anuncios;
- pruebas.

Selección canvas ↔ foco DOM bidireccional.

No hacer un UI accesible “paralelo” que no modifique el proyecto real.

---

# 11. INTERACCIÓN DIRECTA + WCAG 2.5.7

Cuando tenga sentido:
- arrastrar;
- mover;
- redimensionar;
- conectar;
- rotar;
- dibujar;
- snapping;
- handles.

Pero drag nunca es el único método.

Cada función con drag tiene:
- alternativa de puntero sin arrastrar;
- teclado;
- inspector/campos o destinos;
- estado accesible.

WCAG 2.2 2.5.7 obliga a una alternativa a movimientos de arrastre cuando no son esenciales.

Objetivo interno de control cómodo: 44 px cuando sea razonable; no confundir con mínimo WCAG 2.5.8.

---

# 12. TECNOLOGÍA ACTUAL · APLICAR CON FALLBACK

## 12.1 Pointer Events Level 3

Para Dibujo, Pixel Art, Diseño, 3D y manipulación:
- presión de stylus;
- tilt cuando aporte;
- `getCoalescedEvents()` / predicted events como mejora;
- mouse/touch fallback.

No depender de stylus.

Referencia:
https://www.w3.org/TR/pointerevents3/

## 12.2 OffscreenCanvas + Worker

Aplicar a:
- raster pesado;
- generativo;
- simulación;
- previews;
- render auxiliar;

solo si reduce carga real del main thread.

OffscreenCanvas es ampliamente disponible y permite render en Worker.

Referencia:
https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas

## 12.3 WebGPU / WGSL

WebGPU actual:
W3C Candidate Recommendation Draft 15/09/2026.
WGSL: CRD 21/09/2026.

Usar en:
- Modelado 3D;
- visualización avanzada;
- simulaciones que se beneficien;
- algunos previews.

Fallback:
WebGPU → WebGL2 → Canvas/DOM.

No badge “WebGPU” si no inicializa realmente.

No convertir WebGPU en requisito.

## 12.4 Popover / dialog

Usar controles nativos top-layer para:
- Archivo;
- Acciones;
- propiedades temporales;
- ayudas cortas.

Fallback accesible.

Referencia:
https://developer.mozilla.org/en-US/docs/Web/API/Popover_API

## 12.5 View Transitions

Puede usarse como enhancement para:
- cambiar de modo;
- abrir proyecto;
- cambiar perfil;

solo si:
- no introduce mareo;
- se omite con reduced motion;
- existe fallback sin transición.

No es requisito de producto.

## 12.6 EditContext

Experimental / disponibilidad limitada.

Puede investigarse para editores avanzados de texto/código, pero NO puede ser baseline.

Baseline:
- DOM semántico;
- CodeMirror;
- inputs/textarea adecuados.

## 12.7 Web MIDI / Web Serial

Disponibilidad limitada.

R47:
- no son requisito;
- no hardware obligatorio;
- no permiso al entrar;
- cualquier futuro uso requiere acción explícita + fallback;
- Microcontroladores/MIDI siguen como capacidades opcionales futuras, no dependencia.

## 12.8 Audio

Ritmo/Composición/Síntesis:
- AudioWorklet same-origin;
- Tone Transport/reloj de audio;
- no `setTimeout` como reloj musical;
- audio solo tras acción.

## 12.9 Física

- Planck = baseline 2D compatible con CSP vigente.
- Rapier = opcional si puede ejecutarse sin rebajar CSP.
- no añadir `wasm-unsafe-eval` global.

Estructuras:
- motor físico visual ≠ cálculo estructural.
- no presentar cifras como certificación de ingeniería.

---

# 13. LOS 27 ESTUDIOS · GATE ARTIFACT-FIRST

Cada estudio debe tener una fila de aceptación:

- ruta ES;
- ruta EN;
- perfil;
- motor;
- tarea humana de 3–5 minutos;
- artefacto final;
- import/export;
- teclado;
- alternativa a drag;
- mobile;
- child-safe;
- tecnología/fallback;
- PASS humano.

Ejemplos de artefacto:
- Dibujo → PNG/SVG/proyecto;
- Diseño → PNG/SVG;
- Pixel → PNG/sprites/GIF;
- Cómic → PNG/SVG/ZIP;
- Foto → composición exportada, original nunca subido;
- Estructuras → imagen + cálculo educativo + proyecto;
- Arquitectura → SVG/PNG/GLB/OBJ;
- 3D → GLB/STL/OBJ;
- Ritmo/Composición → WAV/MIDI;
- Videomapping → proyecto + modo proyector;
- Código → JS/Python + proyecto;
- Robótica → gemelo digital;
- Videojuegos → HTML jugable autocontenido;
- Documento → texto/estructura exportable;
- Juegos de mesa → tablero/cartas/reglas imprimibles.

No aceptar JSON genérico como único resultado cuando el estudio promete otra cosa.

---

# 14. GUARDADO · CONTRATO ÚNICO

R47 resuelve `OBS-R42-TALLER-STORAGE-01`.

## Por defecto
- proyecto vive en memoria de la pestaña;
- no persistencia oculta;
- no cuenta;
- no servidor;
- no analytics.

## Guardar proyecto
Acción explícita:
- descargar archivo de proyecto;
- File System Access opcional cuando esté soportado y tras gesto;
- fallback download/upload.

## “Conservar en este dispositivo”
Puede existir SOLO como opt-in explícito:
- texto claro;
- local únicamente;
- sin perfil;
- sin etapa guardada;
- botón “Borrar proyectos locales”;
- mostrar uso aproximado con `navigator.storage.estimate()`;
- OPFS/IndexedDB detrás de una capa única;
- no persistir automáticamente por entrar al Taller.

No pedir `persist()` hasta que la persona elija explícitamente conservar localmente.

Para infancia/default:
- misma privacidad alta;
- ningún guardado automático.

---

# 15. PRIVACIDAD Y CHILD SAFETY DE ARCHIVOS

Imágenes/archivos elegidos:
- permanecen locales;
- no upload;
- no telemetría;
- no lectura de directorios sin gesto;
- no cámara/micrófono/geolocalización.

Fotografía:
- archivo local;
- no usar cámara en R47;
- no conservar EXIF para tracking;
- si se exporta composición, no añadir metadatos personales innecesarios.

Videomapping:
- no activar cámara;
- usar imagen/plantilla local o escena sintética.

---

# 16. RETOS R44 · NO MEZCLAR

R44 sigue separado.

No construir automáticamente los 64 retos en R47.

Antes:
- matriz 64/64;
- revisión individual Astra;
- decisión María;
- ola autorizada.

R47 sí debe dejar el **sistema de retos listo**:
- drawer;
- metadata audience/sensitivity/discovery;
- artefacto final;
- fallback;
- permisos;
- copyright;
- etapa.

Pero no introducir el lote R44 sin gate.

---

# 17. CHILD-SAFE · GATE TÉCNICO

Entregar un inventario machine-readable de TODO lo discoverable dentro del Taller:

- estudios;
- starters;
- retos actuales;
- plantillas;
- recursos;
- enlaces.

Criterio:
**0 items sin clasificación.**

QA obligatorio:
1. default no muestra S2;
2. infancia no muestra S2;
3. adolescencia no recomienda S2;
4. adult sin intención explícita no recibe S2;
5. safe variant funciona;
6. autocomplete filtra antes de render;
7. enlaces relacionados filtran antes;
8. deep link sensible usa variante segura;
9. contenido privado de usuario no se analiza ni se envía.

Si el Taller actual no contiene S2:
- registrar 0 S2 con revisión humana;
- probar el motor con fixtures de QA;
- no inventar contenido sensible público solo para probarlo.

---

# 18. RENDIMIENTO

Lazy-load por estudio.

No cargar en portada:
- Three;
- Pixi;
- Blockly;
- Tone;
- Planck;
- motores 3D;
- AudioWorklet;
- assets pesados.

Cada estudio carga solo lo que usa.

Medir:
- JS inicial;
- JS del estudio;
- memoria;
- long tasks;
- tiempo a workspace usable;
- FPS/frame time donde aplica.

Objetivo:
el chrome responde incluso si un motor creativo tarda.

Workers/OffscreenCanvas solo cuando mejoran mediciones.

---

# 19. ACCESIBILIDAD COGNITIVA

COGA recuerda que diseño, contexto, estructura y lenguaje pueden ser barreras y que los tests automáticos no bastan.

R47 debe:
- propósito claro;
- acciones importantes visibles;
- patrones familiares;
- no depender de memoria;
- ayuda accesible;
- restaurar contexto;
- evitar distracción;
- lenguaje breve;
- no infantilizar;
- no exigir leer manual.

El camino básico debe descubrirse en **menos de un minuto** sin documentación larga.

No cerrar por axe.

---

# 20. QA VISUAL Y FUNCIONAL

## 20.1 Portada
ES/EN:
- 1440×900;
- 1024/tablet;
- 390×844;
- 320×800;
- Any age / infancia / adolescencia / adultez;
- búsqueda;
- perfiles;
- Todos los estudios;
- proyectos locales opt-in;
- normal/reduced/opaque;
- forced colors;
- reduced motion.

## 20.2 Todos los estudios
**27/27 × ES/EN.**

No muestreo de “representativos” para declarar cobertura.

Por cada estudio:
- carga;
- crear algo;
- seleccionar;
- editar;
- undo/redo;
- Structure;
- Inspector;
- teclado;
- alternativa drag;
- exportar;
- móvil;
- no red inesperada;
- child-safe.

## 20.3 Estudios complejos
Prueba profunda:
- Dibujo;
- Estructuras;
- Arquitectura;
- Modelado 3D;
- Ritmo;
- Composición;
- Programación;
- Robótica;
- Videojuegos;
- Documento/Mundos.

## 20.4 Ayudas técnicas
- NVDA/VoiceOver real en muestra definida;
- teclado;
- touch;
- stylus real para Dibujo/Pixel cuando disponible.

## 20.5 HUMAN QA de Claude
Claude debe usar el producto, no solo ejecutar tests.

Debe completar y exportar al menos:
- 1 proyecto visual;
- 1 espacial;
- 1 musical;
- 1 de código;
- 1 documental;
- en desktop;
- y completar al menos 2 en móvil.

---

# 21. ENTREGABLES

Claude entrega:

- branch;
- base HEAD/tree;
- HEAD/tree final;
- PR;
- diff;
- inventario 27/27;
- matriz de motores donante → final;
- tabla de qué se conserva de R43;
- tabla de qué se conserva de PR299;
- tabla de legacy reconstruido;
- Design R02 coverage report;
- child-safe registry;
- storage contract test;
- ES/EN parity;
- performance;
- accesibilidad;
- capturas;
- artefactos de prueba exportados;
- QA real;
- memoria/control actualizados;
- pendientes manuales.

Marcador final:

`R47_CLAUDE_TALLER_REBUILD_READY_FOR_ASTRA`

Secuencia:
1. Claude construye;
2. Astra audita;
3. A2 integra;
4. A2 Deploy Preview;
5. María HUMAN QA;
6. si María ve una página documental, estudio legacy, interfaz incoherente o safety incompleto → vuelve a construcción.

No main.  
No producción.  
No deploy propio.  
No tocar Home A8.  
No tocar Cloud A9.  
No tocar voz Sabik.  
No mezclar R44 sin autorización.

---

# 22. REFERENCIAS TECNOLÓGICAS / SAFETY A ESTUDIAR

Tecnología:
- WebGPU: https://www.w3.org/TR/webgpu/
- WGSL: https://www.w3.org/TR/WGSL/
- Pointer Events Level 3: https://www.w3.org/TR/pointerevents3/
- OffscreenCanvas: https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas
- Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
- View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- File System / OPFS: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
- File picker: https://developer.mozilla.org/en-US/docs/Web/API/Window/showSaveFilePicker
- EditContext: https://developer.mozilla.org/en-US/docs/Web/API/EditContext_API
- Web MIDI: https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API
- Web Serial: https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API

Accesibilidad:
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- COGA: https://www.w3.org/TR/coga-usable/

Protección de menores / privacidad por diseño:
- AEPD · protección de datos por defecto;
- AEPD · verificación de edad sin exigir identidad/edad exacta;
- AEPD · Internet seguro por defecto para la infancia;
- ICO Children’s Code como referencia de diseño de privacidad infantil, sin presumir aplicabilidad jurídica automática.

---

# BLOQUE NORMATIVO EMBEBIDO OBLIGATORIO

LEER y dejar memoria actualizada de tu trabajo, con hoja de control https://github.com/mruizwow-bit/irisgreen/tree/coordinacion/iris-green-canonica-20260924/COORDINACION_IRIS_GREEN

La web es bilingüe, así que el inglés tiene que estar perfectamente montado también. La traducción la hacéis vosotros mismos, no se usa otro agente para ello.
Comprobar la configuración de la versión web y de la versión móvil.

MARCO_NORMATIVO_TRANSVERSAL_R01
Fecha: 22/09/2026
Función: referencia transversal derivada de la documentación del proyecto.
Importante: este archivo NO es una nueva orden de producto y NO amplía el alcance de ningún agente.
1. Aclaración de fuente
El archivo histórico llamado NORMATIVA ACTUALIZADA WEB.docx / NORMATIVA ACTUALIZADA WEB(1).docx es en realidad una orden de Astra al Agente n.º 4 sobre Sabik Web que contiene, dentro de esa orden, un marco normativo y de accesibilidad.
Por tanto:
•	sus instrucciones específicas de producto Sabik NO se trasladan automáticamente a Iris, Claude, Design u otros carriles;
•	sus secciones normativas sí se conservan como referencia transversal cuando corresponda;
•	cada agente aplica solo las normas relevantes a su propio alcance;
•	ninguna norma se usa para reabrir un producto o decisión fuera de la orden vigente.
2. Referencias técnicas y de contenido conservadas
Marco mínimo documentado por el proyecto:
•	WCAG 2.2 AA;
•	ISO/IEC 40500:2025 · adopción de WCAG 2.2;
•	EN 301 549 V4.1.1 (2026-09) como objetivo técnico actual;
•	ISO 24495-1:2023 · lenguaje claro;
•	ISO 9241-171:2025 · accesibilidad de software;
•	ISO 9241-210:2019 · diseño centrado en las personas;
•	ISO 9241-11:2018 · usabilidad;
•	ISO 9241-112:2025 · presentación de la información;
•	W3C COGA como capa adicional para discapacidad cognitiva, aprendizaje y neurodiversidad;
•	UNE 153101:2018 EX cuando se produzca Lectura Fácil formal;
•	PDF/UA-2 · ISO 14289-2:2024 para nuevos PDF públicos;
•	Comisión Braille Española para transcripción braille específica.
3. Reglas de contenido y accesibilidad
Aplicar según el recurso:
•	HTML semántico;
•	orden lógico;
•	idioma correcto;
•	nombres accesibles;
•	texto real compatible con tecnologías de apoyo;
•	imágenes clasificadas como decorativas, informativas, funcionales o complejas;
•	alternativa textual apropiada;
•	descripción extensa cuando sea necesaria;
•	datos no solo como imagen;
•	tablas con encabezados reales;
•	transcripción/equivalente textual para audio significativo;
•	subtítulos para vídeo cuando correspondan;
•	audiodescripción cuando corresponda;
•	no usar color como único canal;
•	lenguaje claro sin infantilizar;
•	información principal primero;
•	términos técnicos explicados.
4. Privacidad y minimización
Cuando exista interacción o datos:
•	no pedir datos innecesarios;
•	especial cuidado con salud, discapacidad, diagnóstico, menores, comportamiento y preferencias;
•	no convertir contenidos informativos en mecanismos de recopilación sensible;
•	aplicar RGPD/LOPDGDD cuando corresponda al tratamiento real.
5. Fuentes y trazabilidad
Por cada dato relevante conservar, cuando aplique:
•	fuente;
•	organismo;
•	URL;
•	fecha de publicación;
•	fecha de consulta;
•	jurisdicción;
•	versión;
•	vigencia;
•	última revisión.
Prioridad documental:
1.	legislación y organismos oficiales;
2.	organismos internacionales;
3.	guías oficiales;
4.	universidades;
5.	literatura revisada por pares;
6.	organizaciones profesionales;
7.	asociaciones reconocidas.
Todo trabajo debe quedar:
investigado → documentado → versionado → revisable por Astra.
Ningún gate se aprueba solo con un resumen de chat.
6. Matices jurídicos documentados
La documentación del proyecto registra:
•	EN 301 549 V4.1.1 como objetivo técnico nuevo;
•	a 20/09/2026, pendiente su citación en DOUE como referencia armonizada;
•	V3.2.1 continúa como referencia jurídica armonizada mientras no exista esa citación;
•	Real Decreto 707/2026 sobre accesibilidad cognitiva: preparación normativa, con entrada en vigor indicada por el proyecto para 02/01/2027;
•	el encaje jurídico concreto de cada superficie debe comprobarse, no presumirse.
7. Regla de uso por agentes
Antes de ejecutar:
1.	leer Control Maestro vigente;
2.	leer Memoria Maestra vigente;
3.	leer este marco transversal;
4.	leer la fuente exacta de su carril;
5.	leer su orden actual.
Si una norma o documento parece ampliar el scope fuera de la orden:
STOP y reconciliar con Astra.


pues lo quiero en español e ingles y no quiero que me digas yo no puedo hacerlo, si puedes, porque lo has hecho anteriormente, otra cosa es que es mejor delegar tu trabajo en otros, y yo no funciono asi, tu das el trabajo terminado, tanto en español como en ingles y el ingles lo traduces, porque tambien construyes paginas en ingles. Adaptado a la normativa de isos tanto de adapatabilidad, como de lectura
BRIEF DESIGN R02 · MUCHOS MÁS JUEGOS + RUTINAS DESCARGABLES + PICTOGRAMAS · TODAS LAS EDADES
24/09/2026

AUTORIDAD
DEC-113
DEC-114
DEC-110 / DEC-109 / DEC-024 / DEC-023

REGLA BASE
La web Iris Green existente es la base canónica.
Design adapta sus recursos a Iris Green.
No se sustituye la web por una página de prototipo.

==================================================
1. CAMBIO DE ALCANCE: NO ES SOLO INFANCIA
==================================================

Los recursos deben servir para distintas etapas de vida.

Etiquetas de etapa:
- INFANCIA
- ADOLESCENCIA
- ADULTEZ
- TRANSVERSAL / CUALQUIER EDAD

No se exige diagnóstico para utilizar un recurso.

Incluir explícitamente:
- adolescentes;
- personas adultas diagnosticadas;
- personas adultas sin diagnóstico o sin identificación formal;
- personas que solo buscan apoyo para organización, secuenciación, transiciones,
  sensibilidad sensorial, memoria de trabajo, planificación, motricidad o comunicación.

NO:
- infantilizar la adultez;
- usar estética infantil por defecto;
- presentar un juego como prueba diagnóstica;
- inferir que una persona es neurodivergente por necesitar un apoyo;
- exigir elegir una condición para acceder a una herramienta.

Filtros públicos preferidos:
- etapa de vida;
- contexto;
- habilidad/necesidad;
- duración;
- tipo de actividad.

==================================================
2. INVENTARIO EXISTENTE QUE NO SE PUEDE PERDER
==================================================

Auditoría existente:
- 130 juegos legacy actuales;
- 42 juegos image-first de rutina en backlog actual;
- 92 rutinas;
- 427 pasos;
- 18 mecánicas definidas;
- 405 mapeos candidatos Mulberry;
- 149 ya en el sistema actual;
- 223 ampliables de la misma colección;
- 33 alternativas aproximadas;
- 22 pasos sin equivalente encontrado.

Los 42 juegos actuales NO son el total.
Los 10 B1 NO son el total.
B1/B0/piloto son lenguaje interno y no deben aparecer en interfaz pública.

==================================================
3. OBJETIVO DE CATÁLOGO DE JUEGOS
==================================================

No cerrar el programa con 42 juegos.

Objetivo operativo de la primera biblioteca completa:
AL MENOS 200 juegos/actividades funcionales ÚNICOS tras deduplicar.

Fuente de expansión:
A. crear juegos NUEVOS derivados de las 92 rutinas;
B. reutilizar las 18 mecánicas como patrones funcionales;
C. partir del backlog image-first útil sin quedar limitado por él;
D. crear actividades nuevas para adolescencia, adultez y uso transversal;
E. crear variaciones por contexto/etapa solo cuando la experiencia cambie de verdad;
F. no contar los 427 pasos como 427 juegos;
G. NO usar los 130 juegos retirados como fuente de rediseño o migración.

Cada juego debe tener:
- ID público limpio;
- nombre;
- etapa(s);
- contexto(s);
- habilidad/necesidad;
- mecánica;
- objetivo observable;
- instrucciones muy breves;
- modo imagen-first siempre que sea viable;
- alternativa textual/accesible;
- teclado;
- reduced motion si hay movimiento;
- estado de completado que no dependa solo de color;
- sin lenguaje diagnóstico.

Tipos útiles:
- ordenar secuencias;
- encontrar qué falta;
- elegir el primer paso;
- antes/después;
- clasificar objetos;
- preparar una mochila/bolso;
- elegir ropa según contexto;
- organizar una compra;
- planificar una salida;
- usar transporte;
- preparar una cita o trámite;
- organizar una jornada de estudio/trabajo;
- priorizar tareas;
- dividir una tarea grande;
- detectar una transición;
- ruta visual;
- checklist visual;
- memoria visual;
- busca y encuentra funcional;
- emparejar objeto ↔ acción;
- microsecuencias de motricidad;
- tablero de opciones;
- decisión entre alternativas válidas;
- simulación simple de contexto cotidiano.

==================================================
4. CONTEXTOS OBLIGATORIOS MÁS ALLÁ DE INFANCIA
==================================================

ADOLESCENCIA
- preparar mochila/material;
- cambiar de aula;
- organizar deberes;
- estudiar para examen;
- preparar presentación;
- usar transporte;
- gestionar horarios;
- higiene/cuidado personal;
- preparar ropa;
- comer fuera de casa;
- compras pequeñas;
- pedir ayuda;
- planificar una quedada;
- cambios de plan;
- empezar/terminar una tarea;
- uso equilibrado de pantallas;
- ordenar habitación/material.

ADULTEZ
- salir de casa;
- transporte público;
- orientarse con mapas;
- preparar bolso/mochila de trabajo;
- llegar a una cita;
- hacer una llamada;
- responder un correo;
- preparar una reunión;
- dividir una tarea laboral;
- hacer una compra;
- cocinar;
- limpiar;
- lavar ropa;
- organizar facturas/documentos;
- hacer un trámite;
- preparar una visita o viaje;
- comer fuera;
- planificar descanso;
- volver a casa después de un día exigente;
- cambio inesperado de plan;
- priorizar cuando hay demasiadas tareas;
- preparar ropa y objetos la noche anterior.

ADULTEZ SIN DIAGNÓSTICO
La web no debe etiquetar a la persona.
Los recursos se presentan por necesidad práctica:
"Si esto te cuesta, aquí tienes una forma visual de dividirlo."

==================================================
5. BIBLIOTECA DESCARGABLE DE RUTINAS
==================================================

Las 92 rutinas deben tener una salida pública descargable progresiva.

Formatos por rutina, cuando aplique:
1. A4 completa;
2. tira vertical/horizontal para nevera o pared;
3. tarjetas de pasos;
4. primero → después;
5. checklist visual;
6. versión pantalla;
7. PDF impresión;
8. PNG/JPG de hoja completa;
9. ES;
10. EN cuando la traducción esté aprobada.

No todas las rutinas necesitan todos los formatos, pero cada rutina debe tener
al menos un descargable útil.

La página pública debe mostrar:
- preview;
- pasos;
- descarga;
- fuente/licencia del pictograma;
- etapa/contexto sugerido;
- texto alternativo.

==================================================
6. PICTOGRAMAS
==================================================

Usar primero la auditoría ya hecha.
NO repetir la investigación desde cero.

Fuente principal actual:
Mulberry Symbols.

Prioridad:
1. MATCH_CURRENT_SYSTEM
2. MATCH_CURRENT_SYSTEM_AMPLIABLE
3. POSSIBLE_ALTERNATIVE solo con revisión humana
4. NOT_FOUND → buscar/producir alternativa compatible

No usar ARASAAC en esta línea mientras siga descartado por licencia del proyecto.

Para cada pictograma conservar:
- proveedor;
- ID/nombre;
- enlace fuente;
- enlace preview;
- licencia;
- atribución;
- estado editorial;
- relación con rutina/paso.

==================================================
7. MARCA DE AGUA IRIS GREEN · OBLIGATORIA
==================================================

TODO descargable producido por Iris Green debe llevar marca de agua.

Texto:
IRIS GREEN · irisgreen.eu

No usar la flor antigua.

Aplicar en:
- PDFs;
- hojas A4;
- tiras;
- tarjetas;
- first/then;
- checklists;
- imágenes exportadas;
- composiciones de pictogramas;
- fichas de juego imprimibles.

Ubicación preferida:
- esquina inferior derecha o pie;
- visible al imprimir;
- discreta;
- no cubre información;
- no tapa pictogramas;
- contraste suficiente sin dominar.

En documentos multipágina:
marca en TODAS las páginas.

Para assets de terceros:
la marca de agua identifica la composición/edición Iris Green,
NO sustituye la atribución del autor del pictograma
y NO debe sugerir que Iris Green posee el pictograma original.

Pie de licencia/atribución separado y legible.

==================================================
8. NO PERDER ATRIBUCIÓN
==================================================

Para Mulberry mantener atribución compatible con el expediente del proyecto:
Mulberry Symbols © Garry Paxton 2008-2017, © Steve Lee 2018-2026.
CC BY-SA. mulberrysymbols.org

Hasta cerrar definitivamente la discrepancia de versión de licencia:
- no borrar referencias de licencia;
- mantener source URL por asset;
- mantener trazabilidad en manifest;
- marcar el paquete como pendiente de pin exacto de licencia si procede.

==================================================
9. ARQUITECTURA PÚBLICA
==================================================

La página no debe mostrar inventario técnico.

Eliminar:
- "42 juegos";
- "10 piloto B1";
- "Banco funcional";
- "427/427";
- "mapeo";
- "referencia interna";
- "reconciliación";
- IDs de QA.

La persona debe ver:
- qué quiere hacer;
- para qué sirve;
- cómo empezar;
- descargar si quiere.

==================================================
10. ENTREGA DESIGN
==================================================

Primera entrega R03:
- arquitectura de biblioteca de juegos;
- arquitectura de biblioteca de rutinas descargables;
- sistema de filtros por etapa/contexto/habilidad;
- plantilla de juego Iris Green;
- plantilla de rutina descargable;
- watermark aplicada;
- 20 juegos representativos que demuestren infancia/adolescencia/adultez/transversal;
- 12 rutinas descargables completas como muestra de sistema;
- manifest de pictogramas usados;
- no full-page shell replacement.

Después del visto bueno:
escalar al catálogo completo (>=200 juegos NUEVOS/útiles únicos + 92 rutinas),
sin incorporar ni rediseñar los 130 juegos retirados.
LEER y dejar memoria actualizada de tu trabajo, con hoja de control https://github.com/mruizwow-bit/irisgreen/tree/coordinacion/iris-green-canonica-20260924/COORDINACION_IRIS_GREEN

