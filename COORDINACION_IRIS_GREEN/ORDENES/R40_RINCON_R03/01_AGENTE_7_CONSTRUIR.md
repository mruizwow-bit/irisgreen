# Orden · Agente 7 · R40-RINCON-R03

Estado objetivo: `R40_RINCON_R03_FULL_AUDIO_UX_BUILD_READY_FOR_A2`

## Construir, no analizar

Reconstruir el Rincón tranquilo real de Iris Green en dos frentes inseparables:

### 1. Biblioteca sonora completa

Rehacer los 12 sonidos generales actuales:
- Lluvia
- Lluvia en la ventana
- Olas del mar
- Río
- Viento suave
- Pájaros en el bosque
- Grillos de noche
- Chimenea
- Ruido rosa
- Ruido marrón
- Piano suave
- Cuencos

Y rehacer los 9 ambientes asociados a escena:
- Mar
- Lluvia
- Río
- Noche
- Acuario
- Tubo de burbujas
- Medusas
- Fibra óptica
- Pulpos

Cada sonido debe ser reconocible, estable, de baja estimulación y apto para escucha prolongada. No reutilizar una cama común de viento/ruido/pad. Eliminar hiss áspero, silbidos, graves fatigosos, ataques metálicos, picos y eventos sorpresivos.

Mar y Lluvia en la ventana se conservan solo como punto de partida y también se mejoran.

No fingir realismo: los ambientes sintetizados se identifican como creados. Pulpos no vocalizan. Fibra óptica no tiene un “sonido real”; por defecto debe ser casi silencio o un acompañamiento sintético mínimo claramente identificado.

### 2. Interfaz superior

Eliminar el patrón en el que cada pestaña amplía la hoja hacia abajo.

Construir arriba del todo una guía/selector principal accesible:
- Vídeos
- Sonidos
- Bola de relajación

Solo una vista activa ocupa la misma zona principal. Cambiar de modo reemplaza esa vista, no añade contenido debajo.

En móvil puede convertirse en selector desplegable, manteniendo el mismo modelo mental.

La herramienta activa debe estar visible al entrar. Ayuda, explicación, fuentes y texto secundario quedan después.

### 3. Visuales

Modernizar las nueve escenas cuando sea necesario: profundidad, iluminación, transparencia, reflejos y movimiento físicamente plausibles; sin estética arcaica/salvapantallas, flashes ni cámara agresiva. Reduced motion real y fallback de alta calidad.

### 4. Controles

Nada empieza solo. Conservar:
- Ver y escuchar / Watch and listen
- Silenciar / Mute
- Volumen
- Solo imagen / Image only
- Parar
- crossfade
- ES/EN
- teclado/touch
- 320 px, zoom/reflow, forced-colors

### 5. Entrega

Entregar código, assets first-party si existen, matriz sonido→función/escena y patch/commit limpio a A2.

No deploy propio. La aceptación solo existe después de integración/subida de A2 y prueba visual/auditiva en la web.
