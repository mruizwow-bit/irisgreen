# Sabik y NEA · Órdenes de implementación definitiva

**Fecha:** 16 de septiembre de 2026  
**Rama base de trabajo:** `sabik-preview`  
**PR de preview:** #119  
**Commit base al abrir este programa:** `efa4ed9b71d9e766f7b32830793f6b711aa5574a`  
**Destino de todas las fases intermedias:** `sabik-preview`, nunca `main`.

## 0. Autoridad de este documento

Este documento convierte el plan editorial y técnico aprobado en un programa ejecutable. Ningún agente debe sustituirlo por una reconstrucción propia del encargo ni ampliar el alcance silenciosamente.

Objetivo general:

> Convertir Sabik en un asistente cognitivo local, trazable y accesible, con el contrato de interacción de una IA moderna, pero sin conectarse a una API externa ni enviar la conversación fuera del navegador.

Contratos no negociables:

- Sabik acompaña la navegación; no la sustituye.
- No infiere ni comunica diagnósticos.
- No conserva historial entre sesiones.
- No envía consultas a servicios externos.
- Responde únicamente con información que Iris Green puede sostener.
- Distingue entre responder, pedir una aclaración, reconocer insuficiencia y activar ayuda humana.
- Muestra procedencia y límites.
- Acepta correcciones sin defender la respuesta anterior.
- La persona puede reducir texto, opciones, preguntas, intensidad, voz y movimiento.
- La voz nunca comienza automáticamente.
- La alternativa textual completa permanece disponible.
- Movimiento, color y forma no son la única vía para comunicar estados.
- `noindex` no se retira hasta superar todas las puertas de calidad.

## 1. Reglas de ejecución

### 1.1 Ramas y PR

- Cada fase usa una rama propia creada desde el último `sabik-preview` validado.
- Cada rama abre un PR **draft** contra `sabik-preview`.
- No se abre ningún PR de estas fases contra `main`.
- No se fusionan dos fases dependientes a la vez.
- Antes de empezar una fase se actualiza desde `sabik-preview` y se comprueba que no existan cambios concurrentes en los archivos asignados.
- Un PR = un objetivo verificable. No mezclar arreglos de Sabik con Juegos, Tarjetas Iris, Rutinas, Vídeos, contenido editorial no relacionado o cambios generales de diseño.

### 1.2 Criterio de cambio mínimo

- No reconstruir páginas completas.
- No sustituir el sistema visual aprobado.
- No reescribir el Core entero si puede migrarse por capas con pruebas.
- No borrar compatibilidad antes de demostrar el reemplazo.
- No cambiar textos editoriales de Iris Green para hacer pasar el algoritmo.
- No debilitar guardarraíles, auditorías ni contratos congelados para obtener verde.

### 1.3 Evidencia obligatoria en cada PR

Todo PR debe incluir:

1. alcance y exclusiones;
2. archivos modificados;
3. estados o recorridos afectados;
4. pruebas unitarias y de navegador;
5. resultados antes/después;
6. accesibilidad: teclado, foco, nombres, estados, anuncios, reducción de movimiento y reflow cuando proceda;
7. seguridad y privacidad cuando proceda;
8. limitaciones que sigan abiertas;
9. instrucciones de reversión;
10. confirmación de que `main` y producción no se han tocado.

## 2. Reparto de agentes

## 2.1 Codex · implementación principal

Responsabilidad:

- arquitectura y código ejecutable;
- máquina de estados;
- controladores del panel;
- voz y coordinación técnica;
- contrato local `SabikEngine.ask`;
- pruebas unitarias y de navegador;
- migraciones pequeñas, revertibles y compatibles.

Codex no decide por sí solo:

- significados editoriales;
- recursos humanos de crisis;
- mensajes clínicos;
- criterios de accesibilidad no documentados;
- aspecto final de estados visuales.

## 2.2 Claude · revisión independiente y capa semántica

Responsabilidad:

- revisar la propuesta de Codex contra el plan;
- detectar contradicciones entre Core, controlador, interfaz y pruebas;
- trabajar en intención, relaciones, recursos, procedimientos e índice funcional;
- auditar que las respuestas estén respaldadas por contenido publicado;
- revisar seguridad conversacional, negaciones, correcciones y contexto;
- documentar riesgos y casos límite.

Durante S0, Claude trabaja en modo de revisión y documentación. No modifica los mismos archivos de runtime que Codex hasta que el PR de S0 esté abierto y exista reparto explícito.

## 2.3 Design · comportamiento visual y cognitivo

Responsabilidad:

- definir visualmente los estados, no inventar estados nuevos;
- especificar movimiento ambiental, procesamiento, voz, pausa, error, riesgo y reducción de movimiento;
- garantizar que las ondas de voz solo aparecen al hablar;
- diseñar controles comprensibles: ocultar, pausar asistente, empezar de nuevo, escuchar, pausar voz, detener voz, bajar intensidad, más corto, una opción y evitar preguntas;
- revisar escritorio, tableta, móvil, zoom y 320 CSS px;
- entregar prototipo o especificación de tokens y transiciones, no lógica de negocio.

Design no modifica el motor, no decide cuándo existe riesgo y no usa animación como única señal.

## 2.4 GPT-5 · coordinación, QA y puertas de calidad

Responsabilidad:

- mantener el programa y dependencias;
- convertir requisitos en casos de prueba deterministas;
- revisar cada PR contra los contratos NEA;
- construir matriz de estados y recorridos;
- comprobar falsos «no tengo información», falsas respuestas y pertinencia;
- revisar accesibilidad, seguridad, privacidad y degradación;
- detener una fase si rompe un contrato aprobado;
- preparar el veredicto de salida, sin fusionar automáticamente.

## 3. Primera oleada: empieza ahora

Las cuatro órdenes siguientes se ejecutan en paralelo sin tocar los mismos archivos.

### Orden C-01 · Codex · S0, máquina de estados

**Rama:** `sabik/s0-state-machine`  
**Base:** último `sabik-preview`  
**PR destino:** `sabik-preview`  
**Archivos de propiedad inicial:**

- `sabik/nea-core/state.js`
- `sabik/nea-core/sabik-state.js`
- nuevo `sabik/nea-core/sabik-machine.js`
- pruebas nuevas de estado
- documentación técnica estrictamente necesaria

**Objetivo:** sustituir la lógica fragmentada por una única máquina de estados por capas, sin cambiar todavía el diseño final ni añadir voz.

Capas mínimas:

- ciclo operativo: `booting`, `ready`, `retrieving`, `composing`, `presenting`, `awaiting_clarification`, `paused`, `error`;
- diálogo: información, práctico, aclaración, acompañamiento, corrección, insuficiencia, ayuda humana;
- adaptación: longitud, opciones, preguntas, intensidad y profundidad;
- seguridad: normal, incierta, riesgo, derivación humana;
- visibilidad: expandido, plegado, oculto;
- voz: silencio, inicio, hablando, pausada, finalizada, error;
- movimiento: apagado, ambiental, procesamiento, reactivo a voz, protección estática;
- idioma: español o inglés.

**Eventos únicos mínimos:**

`BOOT_OK`, `SUBMIT`, `RETRIEVAL_OK`, `RETRIEVAL_EMPTY`, `RESPONSE_READY`, `ASK_CLARIFICATION`, `PAUSE_ASSISTANT`, `RESUME_ASSISTANT`, `RESET_SESSION`, `COLLAPSE`, `EXPAND`, `SPEECH_START`, `SPEECH_BOUNDARY`, `SPEECH_PAUSE`, `SPEECH_RESUME`, `SPEECH_END`, `SPEECH_ERROR`, `RISK_UNCERTAIN`, `RISK_CONFIRMED`, `HUMAN_HANDOFF`, `TECHNICAL_ERROR`, `RETRY`.

**Criterios de aceptación:**

- una sola función de transición pura;
- estados inválidos rechazados o normalizados de forma explícita;
- no se usan cadenas visuales libres fuera del catálogo;
- ocultar no altera la pausa;
- pausar no borra la sesión;
- reiniciar es un evento separado;
- voz y movimiento son independientes;
- riesgo prevalece sobre estados decorativos;
- reducción de movimiento no impide voz ni lectura textual;
- pruebas de todas las transiciones críticas;
- sin cambios visibles deliberados en esta fase.

### Orden CL-01 · Claude · auditoría semántica y de migración

**Rama:** `sabik/review-state-migration`  
**Archivos permitidos:** únicamente `docs/sabik/reviews/` y, si se necesita, fixtures no ejecutables bajo `tests/fixtures/sabik/`.

**Entregables:**

1. matriz de todos los estados declarados, usados, inalcanzables y contradictorios;
2. mapa de cada texto, control, atributo ARIA y animación que depende de estado;
3. riesgos de migración desde el sistema actual;
4. casos donde una adaptación podría parecer una inferencia psicológica;
5. lista de expresiones de corrección, negación, continuación y riesgo que deben entrar en regresión;
6. propuesta editorial para recursos humanos y límites, sin inventar datos no verificados.

**Prohibido:** editar runtime de S0 o modificar respuestas públicas.

### Orden D-01 · Design · estados y voz

**Rama o espacio de diseño:** `sabik/design-states-voice`  
**Entregables:**

- tabla visual para cada estado operativo;
- comportamiento del holograma en silencio, procesamiento, respuesta, voz, pausa, error y riesgo;
- especificación de ondas: quietas en silencio, reactivas durante voz, cero al pausar, quietas al terminar;
- variante con `prefers-reduced-motion` y control manual de reducción;
- jerarquía y etiquetas de controles;
- escritorio, tableta, móvil, 200 % de texto, 400 % de zoom y 320 CSS px;
- contraste y estados de foco;
- descripción textual de cada cambio para que Codex lo implemente sin interpretar capturas.

**Regla:** no crear una animación continua llamada «voz». La voz visual responde al controlador de locución.

### Orden G-01 · GPT-5 · QA y regresión inicial

**Rama:** `sabik/qa-contract`  
**Archivos permitidos:** `docs/sabik/qa/`, `tests/specs/sabik/` y fixtures no ejecutables.

**Entregables:**

- matriz de estados y eventos esperados;
- recorridos de teclado, foco y lector de pantalla;
- pruebas de pausa + plegado + expansión;
- pruebas de voz y reducción de movimiento;
- corpus inicial de seguridad, negaciones y falsos positivos;
- pruebas de contexto y corrección;
- definición de pertinencia, falso «no tengo información» y falsa respuesta;
- puerta automática propuesta para cada PR S0–S8.

## 4. Programa completo

### PR-S0 · Contrato y pruebas de estado

Dependencia: ninguna.  
Responsable principal: Codex.  
Revisión: Claude + GPT-5.  
Salida: máquina de estados pura, contrato y pruebas.

### PR-S1 · Controles y accesibilidad del panel

Dependencia: S0.  
Objetivos:

- separar ocultar, pausar, reanudar y empezar de nuevo;
- bloquear correctamente controles al pausar;
- anuncio único de respuesta;
- foco al responder, ocultar y mostrar;
- orden móvil útil;
- `aria-expanded`, `aria-pressed`, nombres y estados coherentes;
- límite de entrada y prevención de envíos concurrentes.

### PR-S2 · Voz y visualización

Dependencias: S0 + especificación Design.  
Objetivos:

- `sabik-speech-controller.js`;
- `sabik-voice-visualizer.js`;
- `ig-speech-coordinator.js`;
- escuchar, pausar, reanudar y detener;
- coordinación con narración de página y música;
- ondas ligadas a eventos de locución;
- fallback por ritmo estimado cuando no existan eventos `boundary`;
- reducción de movimiento independiente de voz;
- sin micrófono y sin reproducción automática.

### PR-S3 · Seguridad y recursos humanos

Dependencia: puede prepararse en paralelo; integración después de S0.  
Objetivos:

- ampliar detección de riesgo y negaciones;
- separar riesgo incierto de confirmado;
- poblar recursos humanos con datos oficiales, territorio y fecha de verificación;
- representar acciones de ayuda en la interfaz;
- evitar que una frase negada active crisis;
- definir degradación segura si faltan recursos;
- no convertir Sabik en un servicio de emergencias ni ocultar sus límites.

### PR-S4 · Conversación, correcciones y degradación

Dependencias: S0 + S1.  
Objetivos:

- contexto de sesión útil en continuaciones;
- distinguir primera frase «No es…» de una corrección real;
- separar rechazo de hipótesis, fragmento y tipo de respuesta;
- «Buscar por otra vía» conserva el concepto cuando procede;
- «No me preguntes» afecta de verdad a la decisión;
- cargas opcionales con valores vacíos seguros;
- error parcial no derriba todo Sabik.

### PR-S5 · Idioma, datos y contrato local

Dependencias: S0–S4.  
Objetivos:

- introducir `SabikEngine.ask(request)`;
- resultado estructurado con tipo, respuesta, intención, conceptos, acciones, fuentes, seguridad, incertidumbre y parche de estado;
- separar motor e interfaz;
- política explícita ES/EN;
- si inglés no está completo, declarar y marcar correctamente el panel español;
- versión y caché de datos.

### PR-S6 · Índice funcional y recuperación avanzada

Dependencia: S5.  
Responsabilidad editorial principal: Claude + GPT-5.  
Objetivos:

- decidir unidad recuperable: sección o página;
- añadir intención, función y límites al índice;
- completar `concepto`, `prioridad`, `sabik_puede`, `sabik_no_debe`, `recurso_humano`, `territorio`, `fecha_verificacion` y estado editorial;
- recuperación híbrida léxica, conceptual y funcional;
- no afinar ranking sobre un índice que no representa la intención.

### PR-S7 · Composición, incertidumbre y procedencia

Dependencia: S6.  
Objetivos:

- composición controlada por tipo de respuesta;
- no copiar oraciones arbitrarias como falsa simplificación;
- incertidumbre visible y accionable;
- procedencia con títulos legibles;
- distinguir responder, preguntar, insuficiencia y ayuda humana;
- lenguaje claro sin inventar información.

### PR-S8 · Regresión, seguridad y salida pública

Dependencias: S0–S7 + base web accesible.  
Objetivos:

- batería determinista de cientos de consultas validadas editorialmente;
- pertinencia de primera respuesta;
- falsos «no tengo información»;
- falsas respuestas;
- matriz completa de estados;
- accesibilidad con teclado, lectores de pantalla, braille, zoom, reflow, colores forzados y movimiento reducido;
- XSS, entradas anómalas, URLs y límites;
- rendimiento y caché;
- actualización de declaración de accesibilidad;
- recomendación final sobre retirada de `noindex`.

## 5. Vías paralelas fuera de S0–S8

### WEB-A11Y · Base accesible de Iris Green

- guía de lectura operable sin puntero;
- recorrido completo de teclado;
- foco visible y no oculto;
- árbol accesible y mensajes dinámicos;
- contraste, zoom, reflow y objetivos;
- flip-flop;
- pie inferior roto;
- pruebas NVDA, JAWS, VoiceOver, TalkBack y braille.

Esta vía no modifica archivos de Sabik salvo pruebas compartidas acordadas.

### INFRA-SEC · Seguridad, integridad y recuperación

- dependencias, CodeQL o equivalente;
- permisos mínimos de Actions;
- CSP y cabeceras;
- secretos y credenciales;
- permisos GitHub/Netlify;
- XSS e inyección;
- límites de entrada;
- copias y restauración verificable.

### PROTECCION · Autoría, software y marcas

- inventario versionado de Sabik;
- memoria técnica y commits de referencia;
- documentación para registro de software y contenidos;
- estudio separado de marcas `SABIK` e `IRIS GREEN`;
- no confundir registro con secreto técnico.

## 6. Propiedad de archivos durante la primera oleada

| Zona | Propietario de escritura | Resto de agentes |
|---|---|---|
| `sabik/nea-core/state.js` | Codex S0 | solo lectura |
| `sabik/nea-core/sabik-state.js` | Codex S0 | solo lectura |
| `sabik/nea-core/sabik-machine.js` | Codex S0 | solo lectura |
| `sabik/sabik-page.js` | congelado hasta S1 | solo lectura |
| `sabik/sabik-page.css` | congelado hasta S2 | Design documenta, no edita |
| `es/nea/index.html` | congelado hasta S1 | solo lectura |
| `sabik/assets/NEA/data/` | Claude prepara propuesta | sin integración hasta S3/S6 |
| `docs/sabik/reviews/` | Claude | lectura del resto |
| `docs/sabik/design/` | Design | lectura del resto |
| `docs/sabik/qa/` y `tests/specs/sabik/` | GPT-5 | lectura del resto |

## 7. Condiciones de parada

Un agente debe detener su rama y documentar el bloqueo cuando:

- necesite modificar un archivo asignado a otra fase activa;
- encuentre que el plan exige datos oficiales aún no verificados;
- un cambio requiere enviar información fuera del navegador;
- una solución hace depender contenido de voz, color o movimiento;
- una prueba solo puede pasar debilitando un guardarraíl;
- el cambio altera producción o `main`;
- aparece una contradicción entre seguridad y comportamiento esperado;
- la implementación necesita interpretar el estado mental de la persona.

## 8. Primera puerta

No comienza S1 hasta que S0 demuestre estas secuencias:

```text
ready → retrieving → composing → presenting
presenting → speaking → speech_paused → speaking → speech_ended
presenting → assistant_paused → assistant_ready
assistant_paused → collapsed → expanded → assistant_paused
ready → risk_uncertain → awaiting_clarification
ready → risk_confirmed → human_handoff
error → retry → ready
reset desde todos los estados estables
```

La primera entrega no debe verse «más inteligente». Debe hacer que el comportamiento sea coherente, verificable y seguro para que todas las capacidades posteriores puedan construirse sin nuevas contradicciones.
