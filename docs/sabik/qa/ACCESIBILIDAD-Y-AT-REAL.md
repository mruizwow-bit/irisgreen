# Accesibilidad · contrato de pruebas y tecnología de asistencia real

**Issue:** #149  
**Ámbito:** S1, S2 y regresión S8.

## Principio

Las auditorías automáticas detectan parte de los problemas, pero no certifican experiencia con lector de pantalla ni línea braille. Todo resultado de NVDA, JAWS, VoiceOver, TalkBack o braille requiere ejecución real y registro manual.

Sabik debe presentar y anunciar cada respuesta como **una unidad coherente**. Está prohibido actualizar la región viva palabra por palabra, fragmento por fragmento o token por token.

## Matriz

| Área | Automatizable | Validación manual/AT real | Criterio |
|---|---|---|---|
| Solo teclado | Sí | Recomendable | Todas las acciones esenciales sin puntero; sin trampa de foco |
| Orden de foco | Sí | Sí | Orden lógico y estable |
| Retorno de foco | Sí | Sí | Vuelve al invocador o al objetivo definido por el contrato |
| Anuncio único de respuesta | Parcialmente | Sí | Una inserción/anuncio coherente; no streaming en live region |
| Lector de pantalla | No como experiencia real | Sí | NVDA/JAWS/VoiceOver/TalkBack comprenden estado, respuesta y controles |
| Línea braille | No | Sí | Foco, nombre, valor, estado y respuesta legibles |
| 200 % de texto | Sí | Sí visual | Sin recorte, pérdida ni solapamiento funcional |
| 400 % de zoom | Sí | Sí visual | Reflow utilizable y sin scroll bidimensional para contenido ordinario |
| 320 CSS px | Sí | Sí visual | Todas las funciones disponibles |
| Colores forzados | Parcialmente | Sí visual | Controles/estados distinguibles sin depender del color |
| Movimiento reducido | Sí | Sí visual | Sin movimiento no esencial; voz/texto siguen funcionando |
| Voz sin movimiento | Sí | Sí | TTS usable con `motion: off` |
| Texto sin voz | Sí | Sí | Respuesta completa disponible sin TTS |
| Móvil | Sí | Sí dispositivo | Foco, teclado virtual, orientación y targets utilizables |
| Idioma | Sí | Sí con AT | `lang` y pronunciación coherentes con respuesta |

## Pruebas automáticas bloqueantes

### A11Y-A01 · solo teclado

Recorrido mínimo:

1. entrar en Sabik con teclado;
2. llegar a entrada;
3. enviar;
4. acceder a respuesta;
5. iniciar/pausar/reanudar/detener voz cuando exista;
6. pausar/reanudar asistente;
7. plegar/expandir;
8. reiniciar;
9. cerrar/ocultar;
10. volver al control invocador.

Falla ante trampa de foco, elemento esencial inaccesible, orden incoherente o foco perdido.

### A11Y-A02 · foco tras respuesta

El foco no salta arbitrariamente durante procesamiento. Al quedar la respuesta disponible, el destino sigue el contrato de la matriz: encabezado de respuesta o entrada cuando se requiere aclaración. El usuario conserva la capacidad de seguir navegando sin ser arrastrado repetidamente.

### A11Y-A03 · retorno de foco

Cerrar u ocultar devuelve el foco al elemento que abrió Sabik, salvo que exista una razón documentada para otro destino. Plegar y expandir no resetean la sesión.

### A11Y-A04 · anuncio único

Instrumentar la región viva con `MutationObserver` durante una respuesta.

**Pasa** si la respuesta destinada al anuncio aparece como una actualización coherente y estable.

**Falla** si:

- se insertan palabras/tokens sucesivos en la región viva;
- cada boundary de TTS reescribe texto anunciado;
- se repite la misma respuesta por actualizaciones de estado;
- el estado «procesando» y la respuesta final se concatenan de forma confusa.

La animación visual o el streaming visual, si alguna fase los introdujera, no puede usar la región viva como canal tokenizado.

### A11Y-A05 · 200 % texto

Aumentar solo tamaño de texto cuando el entorno de prueba lo permita. Verificar que no desaparecen controles, no se corta copy esencial y la interacción conserva secuencia.

### A11Y-A06 · 400 % zoom y 320 CSS px

Probar ambos porque no son equivalentes. Verificar reflow, panel, entrada, acciones, respuesta, controles de voz, recursos de seguridad, foco no oculto y ausencia de scroll horizontal + vertical simultáneo para bloques de lectura ordinaria.

### A11Y-A07 · colores forzados

Con forced-colors activo:

- el foco sigue visible;
- bordes/controles no desaparecen;
- `disabled`, seleccionado, error y seguridad no dependen solo de color;
- iconos esenciales conservan significado.

### A11Y-A08 · movimiento reducido

Con `prefers-reduced-motion: reduce`:

- `motion` queda en `off` para movimiento no esencial;
- las ondas no reaccionan a boundaries;
- voz puede iniciar, pausarse, reanudarse y terminar;
- texto completo permanece;
- seguridad no se comunica solo por movimiento.

### A11Y-A09 · texto sin voz

Simular TTS no disponible/error. La respuesta textual permanece completa, usable y enfocada según contrato. El error de voz no se convierte en fallo de contenido.

### A11Y-A10 · móvil

Como mínimo, viewport equivalente a móvil y dispositivo real en S8. Verificar teclado virtual, orientación relevante, targets, contenido fijo y acceso al control de cierre.

## Protocolos manuales bloqueantes

### NVDA + Firefox/Chrome

Registrar versión de NVDA, navegador/versión, sistema operativo, secuencia exacta, texto/estado anunciado, repeticiones, foco final y resultado. Casos mínimos: abrir, enviar, respuesta, aclaración, pausa, plegado/expansión, error, recurso humano y voz.

### JAWS + Chrome/Edge

Mismo protocolo. No se hereda el resultado de NVDA.

### VoiceOver macOS + Safari

Validar navegación por controles, respuesta única, estados y retorno de foco.

### VoiceOver iOS + Safari

Validar lector táctil, orden, foco después del teclado virtual y controles de voz. No sustituir por emulación de escritorio.

### TalkBack Android + Chrome

Validar exploración táctil, navegación secuencial, respuesta, estados y recursos.

### Línea braille

Con hardware real compatible:

- el foco muestra nombre/rol/estado;
- no aparecen actualizaciones tokenizadas que desplacen continuamente la línea;
- la respuesta puede recorrerse de forma estable;
- los controles de voz y seguridad tienen nombres comprensibles;
- un cambio de estado no borra el contexto útil.

## Voz, idioma y anuncio

TTS y lector de pantalla son canales distintos.

- Iniciar TTS no debe volver a anunciar toda la respuesta mediante live region.
- `SPEECH_BOUNDARY` puede alimentar movimiento visual, nunca el texto de la región viva.
- `SPEECH_PAUSE` detiene la energía visual sin borrar la respuesta.
- Cambiar idioma debe actualizar el idioma semántico aplicable antes de la siguiente respuesta.
- La pronunciación real en AT se valida manualmente.

## Evidencia requerida

Una prueba manual no se cierra con «se ve bien». El registro debe contener entorno, pasos, resultado esperado, resultado observado, evidencia cuando sea posible y veredicto.

Las pruebas automáticas pueden preparar el caso y detectar regresiones, pero no pueden escribir `PASÓ_NVDA`, `PASÓ_JAWS`, `PASÓ_VOICEOVER`, `PASÓ_TALKBACK` ni `PASÓ_BRAILLE` sin ejecución real.
