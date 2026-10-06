# NEXO · ORDEN VIDA MARINA · PILOTO 3D PARA COMPARACIÓN DE DIRECCIÓN R01

Fecha: 2026-10-06  
Autoridad de producto: María  
Coordinación: Nexo  
Ejecutor previsto: Claude Design  
Estado: ORDEN ACTIVA · PILOTO PARA PRUEBA HUMANA  
Carril existente a preservar: Vida marina R06.1 / R06.1a

## 1. Motivo

Tras probar Cielo, María ha comprobado una diferencia grande a favor del espacio 3D continuo y ordena hacer la misma prueba con Vida marina.

Este piloto NO sustituye todavía R06.1/R06.1a.
Se construye en paralelo para comparar dirección de producto.

No esperar a cerrar R06.1a para empezar el piloto arquitectónico, pero no heredar como “resueltos” sus findings pendientes.

## 2. Pregunta que debe responder el piloto

¿Vida marina funciona mejor como un espacio 3D continuo y vivo, donde la persona se orienta, observa animales en contexto y selecciona directamente lo que ve, que como una composición plana de encuentros discretos?

La prueba debe ser suficientemente real para que María pueda sentir la diferencia, no un mockup.

## 3. Concepto

Observador/persona dentro de un entorno submarino 3D contenido.

Contrato:
`EXPLORE → LOCATE → REVEAL`

Experiencia:
- entorno submarino continuo;
- cámara controlada por la persona;
- desplazamiento/orientación suave y limitado;
- animales con movimiento orgánico;
- selección directa del animal visible;
- acercamiento/encuadre sin perseguir una retícula;
- observar un rasgo significativo;
- revelar información después de localizar/observar;
- mantener contexto espacial al abrir/cerrar ficha.

No hacer videojuego de velocidad.
No cámara automática.
No persecución.
No combate.
No puntuación.
No jumpscares.
No fatiga sensorial.

## 4. Alcance del piloto

Usar una microescena autocontenida con los tres animales ya trabajados en la lógica R06.1:
- pez hacha;
- pez linterna;
- calamar.

El calamar debe respetar su estado factual/observable vigente: visible aunque la identificación/observable siga bloqueado si ese bloqueo continúa en la base usada.

La escena debe permitir:
- ver más de un animal simultáneamente en algún momento;
- elegir cuál observar;
- conservar elección estable;
- cambiar a otro animal explícitamente;
- alejarse/volver sin perder contexto;
- abrir ficha y volver al mismo entorno.

No añadir 200+ especies.
No regenerar los seis PNG existentes.

## 5. Representación visual para esta prueba

Objetivo: probar espacio/interacción 3D, no inaugurar una nueva producción masiva de modelos.

Se permite:
- usar los PNG aprobados como planos/billboards 3D correctamente orientados;
- depth layers;
- partículas/volumen/iluminación submarina local;
- vegetación/rocas simples first-party;
- un modelo 3D simple sólo si ya existe y no obliga a rehacer activos.

No deformar los animales para simular 3D.
No inventar anatomía.
No convertir sprites en falsos modelos volumétricos mediante extrusión grotesca.

El entorno debe ser claramente tridimensional aunque los animales sigan usando arte 2D en este piloto.

## 6. Movimiento

Animales:
- movimiento continuo, lento y legible;
- rutas distintas;
- periodos horizontal/vertical separados y documentados;
- sin saltos al cambiar framerate;
- sin orientación frame-dependent;
- sin teletransporte;
- sin sincronía artificial entre especies.

Persona/cámara:
- movimiento suave;
- límites claros;
- no atravesar animales/escena;
- no pérdida de orientación;
- cancelación limpia;
- alternativa sin drag.

NORMAL / REDUCED / NONE deben existir.

## 7. Selección por intención

Mantener los aprendizajes R06.1:
- no ordenar continuamente por “más cuerpo iluminado”;
- selección explícita;
- estabilidad/histéresis real;
- si dos animales son candidatos, comunicarlo y respetar la elección;
- 0 casos observados no equivale a imposibilidad;
- fixtures no sustituyen solape real.

En 3D, separar:
- tolerancia de input;
- raycast/selección espacial;
- evidencia de que el rasgo observado está realmente disponible.

## 8. Observación del rasgo

Para el piloto:
- pez hacha: usar sólo observables actualmente admitidos por la base y marcar cualquier claim provisional;
- pez linterna: fotóforos sólo si la región revisada se conserva;
- calamar: si continúa bloqueado, se puede observar el cuerpo/contexto pero NO fingir que el observable ya está validado.

No usar una fuente zoológica como prueba de que el asset visual representa correctamente ese rasgo.

## 9. Feedback y accesibilidad

No usar `aria-disabled=true` en un control que sigue siendo operable para explicar qué falta.

Si algo no puede identificarse:
- explicar la causa real;
- no decir “acerca la luz” si el bloqueo es factual/perceptual.

Obligatorio:
- teclado;
- touch/pointer;
- foco visible;
- 44 px;
- 320/390/1440;
- 200 %;
- forced-colors;
- NORMAL/REDUCED/NONE;
- retorno de foco;
- live regions sobrias;
- ES/EN;
- alternativa a movimiento gestual.

## 10. Persistencia

Guardar únicamente estado útil:
- hallazgos;
- preferencias;
- contexto de sesión si procede.

Schema futuro:
- no sobrescribir;
- no anunciar éxito si no se escribió;
- estado de solo lectura explicado.

## 11. Seguridad sensorial

No:
- flashes;
- sacudidas;
- motion blur agresivo;
- cámara involuntaria;
- zoom automático fuerte;
- aceleraciones repentinas;
- partículas densas;
- sonidos sorpresa;
- temporizadores;
- presión por responder rápido.

Reduced y None deben reducir/eliminar movimiento sin bloquear el contenido.

## 12. QA del piloto

Autor entrega:
- test de raycast/selección;
- dos animales candidatos reales;
- histéresis con precondición >0;
- mismo objetivo con framerates distintos;
- continuidad 30/60/120 Hz;
- foco/resize;
- storage futuro;
- ES/EN;
- NORMAL/REDUCED/NONE;
- 320/390/1440;
- medición de rendimiento.

Además:
- vídeo real de recorrido;
- captura/clip que demuestre profundidad y navegación;
- una comparación breve con el carril 2D actual, sin declarar ganador.

Separar:
- QA del autor;
- browser real;
- AT real;
- HUMAN QA María.

## 13. Entrega

Entregar:
- `VIDA_MARINA_3D_PILOTO_R01.zip`;
- SHA256;
- manifest;
- proyecto/script fuente;
- vídeo de recorrido;
- pruebas y alcance;
- métricas de rendimiento;
- lista de assets reutilizados;
- lista de elementos temporales de entorno;
- pendientes.

Gate de entrega:
`CLAUDE_MARINE_3D_PILOT_R01_READY_FOR_HUMAN_COMPARISON`

La finalidad inmediata es que María pueda abrirlo y comparar sensaciones con la versión actual.

## 14. Después de la prueba

Si María elige 3D:
- fijar dirección;
- conservar R06.1/R06.1a como fuente de aprendizajes de interacción/datos;
- migrar lógica válida al mundo 3D;
- escalar por microescenas y encuentros, no 200+ de golpe.

Si María no lo elige:
- conservar piloto como aprendizaje;
- seguir con la dirección actual sin reabrir assets.

## 15. Límites

NO:
- main;
- deploy público;
- regenerar los seis PNG;
- declarar PASS humano;
- declarar QA científico completo;
- escalar catálogo;
- mezclar este piloto con Rincón/Pecera;
- convertir el entorno en juego de reflejos.

Es un piloto paralelo de dirección de producto, exactamente para responder a la comparación que María ha pedido.
