# APRENDIZAJE_LUMEN_2026-09-30

## Identidad
- Alias: Lumen
- Agente: A7
- Puesto profesional: Immersive Media & Interactive Audiovisual Engineer
- En español: Ingeniero de Media Inmersiva y Sistemas Audiovisuales Interactivos
- Jefatura: Astra · Calidad de Producto & Arquitectura
- Alcance: formación profesional; no modificación de producto durante Jornada de Formación.

## Qué estudié
Canon:
- FORMACION/00_EMPIEZA_AQUI.md
- EQUIPO_NOMBRES_PUESTOS.md
- ORGANIGRAMA_EMPRESA_R01.md
- DIRECTORIO_FORMACION_POR_ROL.md
- FORMACION/AURA/
- Issue #348
- Aura R01 652400d81c13f86383164ca6d434421ed84cab5d
- Aura R02 41a01a5534161da5e4b412dd0c6af424e836a53
- historial A7 #288
- orden Rincón #307

Fuentes externas principales:
- W3C WebGPU: https://www.w3.org/TR/webgpu/
- W3C WGSL: https://www.w3.org/TR/WGSL/
- W3C WebXR: https://www.w3.org/TR/webxr/
- W3C Web Audio: https://www.w3.org/TR/webaudio/
- Web Audio 1.1: https://www.w3.org/TR/webaudio-1.1/
- Media Capabilities: https://www.w3.org/TR/media-capabilities/
- Media Session: https://www.w3.org/TR/mediasession/
- HTML media: https://html.spec.whatwg.org/multipage/media.html
- WCAG 2.2: https://www.w3.org/TR/wcag/
- COGA: https://www.w3.org/TR/coga-usable/
- XR Accessibility User Requirements: https://www.w3.org/TR/xaur/
- WAI audio/video: https://www.w3.org/WAI/media/av/
- Media Queries 5: https://www.w3.org/TR/mediaqueries-5/
- ISO 9241-210:2019
- ISO 9241-11:2018
- ISO 9241-112:2025
- ISO 9241-171:2025
- ISO/IEC 25010:2023
- ISO 24495-1:2023
- ITU-R BS.1770-5
- EBU R128 v5
- ITU-T H.870 V2
- ITU-T H.872
- YouTube Embedded Players / IFrame API

## Lo explico con mis palabras
Inmersión no es una API; es una propiedad de la experiencia completa.

Progressive enhancement significa que una persona sin hardware nuevo no pierde el producto.

No-autoplay, stop, pause, intensidad, reduced motion, modo estático y salida clara son arquitectura central de una superficie de baja estimulación.

LUFS y true peak no equivalen a SPL físico real.

Un proveedor externo es una dependencia viva y debe tener fallback, revisión y gate.

HUMAN QA observa propiedades que un unit test no ve: hiss, molestia, loop reconocible, mala composición, fatiga, publicidad o sensación de continuidad.

## Qué practiqué en Iris Green
Repositorio: mruizwow-bit/irisgreen

HEAD coordinación observado antes de escribir:
1371d972432ecb90bdd817ffadf4add984f158ce

Rama web viva observada:
agent2/sabik-iris-r08-20260924

HEAD web observado:
8ea50128b490207b4dd5508c3c46692f5be69c87

Archivos leídos:
- assets/rincon-r46.js
- assets/rincon-r46-breath.js
- assets/rincon-r46-landscapes.js
- assets/rincon-r53-stage.js
- es/sitio-tranquilo/index.html
- en/quiet-space/index.html

### Reconstrucción histórica
Leí #288 y reconstruí el HUMAN QA FAIL.

Resultado:
el primer enfoque de A7 confundió sofisticación del motor con calidad inmersiva y no validó suficientemente el producto integrado.

### Código vivo
Hallazgos:
- R46 detiene otros modos al cambiar;
- pagehide detiene breath/land/rooms/audio;
- clean screen conserva mutación idempotente;
- Escape sale de clean screen;
- el stage de salas observado intenta WebGL2, luego Canvas y estático;
- #307 menciona WebGPU como Tier A objetivo, pero no es el tier de salas observado;
- reduced motion puede llevar a estado quieto sin rAF continuo;
- background pausa dibujo continuo;
- landscape no crea iframe al montar;
- poster es first-party;
- Save-Data evita carga salvo override;
- stop destruye iframe;
- audio Iris Green va separado;
- paisajes siguen marcados como candidato, no aprobado.

### Contrato de proveedor
La documentación actual de YouTube se comparó con el código observado.

Hallazgo:
modestbranding=1 está en el embed, pero la documentación oficial lo marca como obsoleto/sin efecto.

No modifiqué producto; queda registrado como conocimiento.

## Pruebas negativas diseñadas
- shader que no compila;
- contexto gráfico no disponible;
- fallback de tier;
- iframe no responde/onError;
- Save-Data;
- reduced motion en vivo;
- cambio de modo repetido;
- clean screen repetida;
- background/foreground;
- audio residual;
- observer/listener duplicado;
- hidden que reaparece;
- paisaje con publicidad;
- loop evidente;
- 320 px;
- forced colors.

## Errores propios detectados
Error histórico del rol:
asociar procedural/GPU a calidad inmersiva.

Corrección:
gate perceptivo e integrado.

Riesgo de lenguaje:
decir WebGPU Tier A como si ya estuviera integrado.

Corrección:
separar target, código existente y capacidad runtime observada.

Riesgo de falsa validación:
declarar práctica terminada sin escuchar/observar sesiones largas.

Corrección:
foundation estudiada; práctica perceptiva pendiente.

## Runbook
Documento:
FORMACION/A7_LUMEN/03_RUNBOOK_MEDIA_INMERSIVA.md

## Límites
Todavía NO está demostrado por esta sesión:
- que los candidatos de YouTube pasen 20–30 min sin anuncios/interrupciones;
- que todas las salas pasen HUMAN QA visual en dispositivos objetivo;
- que los audios pasen escucha comparativa en hardware representativo;
- que WebGPU esté integrado en el runtime de salas observado;
- conformidad formal WCAG/ISO/EN;
- SPL físico;
- consumo energético móvil real.

No invento esos resultados.

## Estado al cerrar
- Formación R01: estudiada.
- Producto: no modificado.
- Build/deploy: no ejecutado.
- Estado: LUMEN_IMMERSIVE_MEDIA_FOUNDATION_STUDIED_R01
- Estado práctico: PRACTICE_PENDING_PERCEPTUAL_AND_DEVICE_QA

## Primeros 15 minutos del siguiente agente
1. leer 00_IDENTIDAD_Y_PUESTO.md;
2. leer 01_PLAN_FORMACION.md;
3. leer 02_PRACTICAS_Y_EXAMEN.md;
4. leer 03_RUNBOOK_MEDIA_INMERSIVA.md;
5. leer 04_ESTUDIO_AVANZADO_R01.md;
6. releer #307 y órdenes posteriores;
7. comprobar HEAD coordinación y A2;
8. comprobar último HUMAN QA;
9. ejecutar primero prácticas pendientes, no reconstruir la teoría.
