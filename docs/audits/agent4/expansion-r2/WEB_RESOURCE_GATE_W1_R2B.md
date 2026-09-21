# WEB_RESOURCE_GATE_W1 · R2-B · autonomía cotidiana ES/EN

**Agente:** n.º 4  
**Issue coordinador:** #205  
**Gate:** #204  
**Rama:** `agent4/irisgreen-web-expansion-w1-r2-safe`  
**Baseline:** `main@e48b51814afed825a92e83a2f6e51ee8a1c85e45`  
**Fecha:** 21/09/2026  
**Estado:** CANDIDATO R2-B · HOLD HASTA CI DE NAVEGADOR · NO MERGE · NO DEPLOY

## Alcance

R2-B reincorpora únicamente una pareja ES/EN:

- `/es/recursos/juegos/autonomia-cotidiana/`
- `/en/resources/games/daily-autonomy/`

No reincorpora tablero de necesidades, LGTBIQ+, vídeos, Rincón tranquilo ni otros recursos W1.

## Producto

### Objetivo
Ofrecer práctica opcional y sin presión de cuatro tareas cotidianas: cordones, preparar una mochila/bolsa, salir de casa y usar una lavadora.

### Público
Adolescentes y adultos, familias, docentes y personas que quieran descomponer una tarea en pasos. La página no presupone diagnóstico ni nivel de capacidad.

### Habilidad/práctica
- secuenciación;
- preparación;
- comprobaciones elegidas por la persona;
- uso de una lista de pasos como apoyo.

### Qué NO pretende hacer
- no evalúa;
- no diagnostica;
- no promete autonomía;
- no sustituye apoyo individual;
- no presenta una secuencia como la única correcta;
- no es terapia.

### Alternativas y elección
La actividad de cordones declara que practica un método común y que existen otros métodos válidos. Las listas de mochila/salida se pueden adaptar, omitir o cambiar. Pedir ayuda se presenta como opción válida.

### Riesgos y mitigación
- **Frustración por secuencia:** feedback neutral; reinicio disponible; no hay penalización.
- **Sobrecarga:** una tarea por bloque, sin sonidos, sin animación funcional, sin límite de tiempo.
- **Interpretación como obligación:** el texto dice que cada lista puede adaptarse y que no existe una única forma correcta.
- **Seguridad en lavandería:** se indica seguir las instrucciones de máquina/producto y no mezclar productos.

## Arquitectura

Cada página conserva el contrato global del baseline:
- marca Iris Green;
- menú responsive compartido;
- navegación global completa;
- Lectura / Reading;
- Música / Music;
- un único selector de idioma;
- Tus intereses / Your interests;
- El taller / The workshop;
- Rincón tranquilo / Quiet space;
- paneles compartidos y scripts aceptados.

No se modifica ningún HTML global existente, CSS global, script global, sitemap, indexación, build o redirect.

## Vídeo de cordones

El candidato W1 enlazaba un vídeo de County Durham and Darlington NHS Foundation Trust. Su procedencia institucional está respaldada por la página oficial de Children's Occupational Therapy, que recomienda un vídeo de cordones dentro de Self care skills:

https://www.cddft.nhs.uk/services/childrens-occupational-therapy/tips-FAQ

Sin embargo, #203 exige comprobar reproducción, canal exacto, subtítulos y alternativa/transcripción. Esa comprobación no está cerrada. Por tanto R2-B **elimina el vídeo de la salida pública candidata** y mantiene solo el enlace a la fuente institucional en la sección de fuentes.

## Accesibilidad y comportamiento

Verificación estática `verify_w1_resource_gate.py`:

- 2/2 páginas comprobadas;
- contrato de navegación completo;
- Lectura y Música presentes;
- exactamente un selector de idioma;
- hreflang recíproco;
- paneles compartidos presentes;
- `prefers-reduced-motion` presente;
- regla de reflow móvil presente;
- feedback con `aria-live`;
- estados seleccionables con `aria-pressed`;
- sin `autoplay`, `iframe`, `video`, `audio`, YouTube, cronómetro ni puntuación;
- 4 actividades ES y 4 EN;
- paridad temática ES/EN.

Resultado local: **PASS**.

Este test no sustituye navegador real. Teclado, foco, 1280/768/390/320, zoom equivalente y axe quedan **HOLD_PENDING_BROWSER_CI** hasta que el HEAD del PR ejecute los checks existentes.

## Reversión

R2-B se revierte eliminando únicamente las dos páginas nuevas y sus artefactos de auditoría. No requiere revertir infraestructura global.

## Decisión actual

`HOLD_PENDING_BROWSER_CI`

No marcar PUBLISH hasta validar el nuevo HEAD con CI/navegador.
