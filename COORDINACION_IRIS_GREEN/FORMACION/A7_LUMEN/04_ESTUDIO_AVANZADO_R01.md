# LUMEN · ESTUDIO AVANZADO R01

Fecha: 30/09/2026
Agente: A7
Puesto: Immersive Media & Interactive Audiovisual Engineer

Este bloque amplía la foundation. No es certificación externa.

## 1 · La madurez de una tecnología importa
A 30/09/2026, WebGPU y WGSL están en Candidate Recommendation Draft; Web Audio API 1.0 es Recommendation; Web Audio 1.1 y Media Capabilities/Media Session están en Working Draft; WebXR está en Candidate Recommendation Draft; HTML es Living Standard.

Lección: no tratar todas las referencias como si tuvieran el mismo nivel de madurez. Baseline robusto primero, progressive enhancement después, feature detection y fallback siempre.

## 2 · Inmersivo es un resultado de sistema
La presencia depende de escala, continuidad, encuadre, profundidad, ritmo, luminancia, audio, interacción, rendimiento, ausencia de interrupciones y control. El fallo R42 de A7 demostró que una escena procedural sofisticada puede fracasar como experiencia.

## 3 · La continuidad temporal forma parte de la calidad
Una sesión de 30 minutos no se valida con screenshot, primer minuto, tiempo acelerado o hash. Hay que observar repetición, buffering, publicidad, deriva, memoria, cambios de luz y fatiga.

## 4 · Frame rate no es el objetivo completo
Más FPS puede implicar más consumo y temperatura y no garantiza confort. Interesan frame time, jitter, respuesta, estabilidad, adaptación de calidad y propósito del movimiento.

## 5 · No-motion es un producto propio
El modo estático puede conservar composición, color, iluminación, profundidad sugerida, información, control e identidad. Un fallback estático acabado puede ser mejor UX que una animación pobre o molesta.

## 6 · Loudness digital no es presión sonora
LUFS describe señal/programa. True peak ayuda a medir picos. SPL depende del sistema físico de reproducción, volumen, distancia y entorno. No convertir medición digital en claim universal de escucha segura.

ITU-T H.870/H.872 son referencias útiles, pero una web sin calibración física no puede inferir automáticamente la exposición acústica real.

## 7 · La persona controla los estímulos
En baja estimulación:
- nada arranca solo;
- audio opcional;
- movimiento reducible o anulable;
- intensidad suave;
- salida obvia;
- controles recuperables;
- sin gamificación obligatoria.

Esto es arquitectura, no decoración de accesibilidad.

## 8 · Proveedores externos son riesgo de sistema
Un embed puede cambiar sin que cambie nuestro código.

La documentación actual de YouTube marca modestbranding como parámetro obsoleto/sin efecto. El código vivo observado conserva modestbranding=1. No es automáticamente un bug funcional, pero no debe atribuirse a ese parámetro una garantía que ya no ofrece.

rel=0 tampoco elimina completamente vídeos relacionados; limita su procedencia al mismo canal.

## 9 · Privacy-enhanced no significa sin tercero
youtube-nocookie.com forma parte del patrón de privacidad adoptado, pero una vez cargado el iframe existe interacción con un proveedor externo. La experiencia no debe presentarse como 100% first-party tras activar el embed.

## 10 · Autoplay también afecta privacidad
La documentación de YouTube explica que autoplay puede iniciar reproducción y recopilación/compartición de datos al cargar. La regla de Iris Green “nada empieza hasta que tú lo decidas” alinea control sensorial, intención y privacidad.

## 11 · Integración y percepción son emergentes
A PASS + B PASS no implica AB PASS:
- stage correcto + shell correcto puede producir solapamientos;
- audio correcto + transición incorrecta puede dejar capas;
- escena correcta + móvil puede recortar;
- fallback correcto + CSS global puede resucitar [hidden].

## 12 · Evidencia proporcional
- compila → build/sintaxis;
- usa fallback → prueba de capacidad/fallo;
- no carga tercero al entrar → DOM/red;
- no queda rAF → runtime/instrumentación;
- no repite perceptiblemente → observación temporal;
- es cómodo → HUMAN QA;
- cumple estándar → revisión de Axioma + evidencia, no afirmación propia.

## 13 · Especificaciones vivas
Registrar versión/fecha, distinguir REC/CR/WD/Living Standard, comprobar documentación actual, feature-detect y conservar fallback.

## 14 · Siguiente estudio avanzado
Pendiente:
- profiling real en hardware representativo;
- energía/thermal cuando sea medible de forma fiable;
- color/HDR y confort;
- spatial audio accesible;
- prototipo WebGPU aislado con fallback y medición;
- Media Session solo si aporta;
- WebXR si entra en scope;
- evaluación con personas coordinada con dirección/calidad.

## 15 · Principio final
La excelencia de Lumen no se mide por cuántas APIs avanzadas usa. Se mide por cuántas decisiones técnicas consigue hacer invisibles para que la persona conserve presencia, control, comodidad y acceso.
