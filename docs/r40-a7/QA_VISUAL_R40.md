# R40-A7 · checklist QA visual/audiovisual

Este checklist no certifica conformidad. Se aplica al HEAD congelado de A2 después de implementación.

## A. Gate audiovisual por escena
Para cada escena: sea, rain, river, night, aquarium, bubbles, jellies, fibre.

- [ ] Nada se reproduce al cargar.
- [ ] Seleccionar miniatura no inicia audio.
- [ ] “Ver y escuchar” requiere acción explícita.
- [ ] “Solo imagen” inicia visual sin audio.
- [ ] Silenciar funciona durante la escena.
- [ ] Volumen es alcanzable por teclado y touch.
- [ ] Parar detiene visual y audio.
- [ ] Cambio de escena no solapa dos ambientes.
- [ ] Entrada/salida no produce pico audible.
- [ ] No hay flash ni cambio brusco de pantalla completa.
- [ ] Texto equivalente ES correcto.
- [ ] Texto equivalente EN correcto.
- [ ] Si WebGL falla, hay poster/texto útil y no se sustituye silenciosamente por otra escena.
- [ ] Si audio falla, la escena sigue siendo usable.
- [ ] Sonido generado está etiquetado como generado.
- [ ] Asset grabado usado = A4 READY con fuente/licencia.

## B. Reduced motion
- [ ] Con `prefers-reduced-motion: reduce`, no hay cámara/parallax/sorpresas.
- [ ] Movimiento continuo queda estático o <=25% de velocidad.
- [ ] Interacciones llamativas no se disparan solas.
- [ ] Crossfade visual <=120 ms o cambio directo.
- [ ] Controles conservan foco/estado.
- [ ] Audio sigue siendo opt-in; reduced motion no activa sonido.

## C. Contraste y escenas claras/oscuras
Comprobar al menos: mar claro, lluvia media, noche oscura, medusas oscura, fibra óptica muy oscura, acuario medio.
- [ ] Texto normal >=4.5:1.
- [ ] Texto grande >=3:1.
- [ ] iconos/foco/bordes esenciales >=3:1.
- [ ] foco visible tanto sobre poster como escena activa.
- [ ] barra de controles usa superficie propia; no depende de píxeles variables de escena.
- [ ] forced-colors conserva controles y estado seleccionado.
- [ ] alto contraste Iris no pierde nombres/controles.

## D. Teclado/foco
- [ ] Tab recorre miniaturas, acción principal, mute, volumen, solo imagen, parar y pantalla completa en orden predecible.
- [ ] Enter/Space activan los botones.
- [ ] Escape sale de pantalla completa/focus mode sin perder el contexto.
- [ ] Al cerrar escena, foco vuelve al control que la abrió.
- [ ] No hay focus trap.
- [ ] interacción de escena tiene botón equivalente al pointer.

## E. Reflow/touch
- [ ] 320 CSS px sin scroll horizontal.
- [ ] 200% texto.
- [ ] 400% zoom/reflow.
- [ ] portrait/landscape móvil.
- [ ] targets >=44×44 px objetivo Iris.
- [ ] sliders utilizables con teclado y touch.
- [ ] no controles superpuestos a browser chrome/fullscreen.

## F. Audio
- [ ] volumen inicial bajo.
- [ ] unmute con fade.
- [ ] cambio de escena con fade out/in.
- [ ] sin truenos en lluvia.
- [ ] noche sin eventos repentinos.
- [ ] río: aves muy lejanas, no protagonistas.
- [ ] fibra: casi silencio/tono mínimo.
- [ ] pulpos, si existen: 0 vocalización ficticia.
- [ ] no dos ambientes de escena simultáneos.
- [ ] no audio al volver del historial/página.

## G. Sabik Glass
- [ ] masters R37 byte-identical.
- [ ] 0 filtros/recolor/mix-blend sobre masters.
- [ ] blur <=12 px y solo una capa.
- [ ] no glass apilado.
- [ ] fallback opaco en forced-colors/reduced transparency.
- [ ] gradiente estático, sin animación.
- [ ] legibilidad con fondo claro y oscuro.

## H. Taller/Intereses
- [ ] Taller muestra 6 áreas, no 25 estudios a la vez.
- [ ] Intereses muestra 11 grupos, no 72 intereses a la vez.
- [ ] lista completa aparece por divulgación progresiva.
- [ ] búsqueda y filtros no roban foco.
- [ ] estados vacíos/error dicen qué hacer.
- [ ] ES/EN equivalentes.
- [ ] sin puntuación/ranking/racha/temporizador obligatorio.

## I. Automatizable vs manual

Automatizable:
- tamaño de target;
- presencia de labels/nombres accesibles;
- no autoplay en DOM/API;
- reflow básico 320/zoom;
- contraste de superficies de control con colores deterministas;
- assets declarados y hashes;
- ES/EN strings/links básicos.

Manual obligatorio:
- sobresaltos y ritmo visual;
- calidad del crossfade;
- pico percibido de audio;
- legibilidad real sobre escenas cambiantes;
- foco visible sobre canvas/fullscreen;
- apariencia Sabik Glass sin exceso de blur;
- comprensión/tono adulto;
- aceptación visual de María.

## Evidencia de cierre
Por fase:
- HEAD exacto;
- lista de archivos;
- capturas ES/EN 1440 y 390/320;
- vídeo corto de cambios de escena normal + reduced motion, sin audio privado;
- resultados automatizados;
- revisión manual;
- fuentes/licencias A4;
- pendientes conocidos.
