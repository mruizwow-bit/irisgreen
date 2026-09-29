# R40-A7 · especificación audiovisual del Rincón

## Principios obligatorios
1. **Nada empieza solo.**
2. Elegir una miniatura no reproduce sonido.
3. Acción principal de escena: **Ver y escuchar / Watch and listen**.
4. Acciones siempre visibles después de iniciar: **Silenciar · Volumen · Solo imagen · Parar**.
5. El sonido empieza bajo y nunca sube de golpe.
6. No hay flashes, cortes de luminancia de pantalla completa ni eventos repentinos.
7. El equivalente textual está disponible aunque WebGL/audio fallen.
8. ES/EN equivalentes.
9. Sonido generado se etiqueta como generado; no se presenta como grabación real.
10. Voz/TTS fuera de alcance.

## Estado de escena
```
IDLE_POSTER
  -> USER_START_AV -> ACTIVE_AV
  -> USER_START_IMAGE_ONLY -> ACTIVE_IMAGE
ACTIVE_AV
  -> MUTE -> ACTIVE_IMAGE
  -> SCENE_CHANGE -> CROSSFADE -> ACTIVE_AV|ACTIVE_IMAGE
  -> STOP -> IDLE_POSTER
ACTIVE_IMAGE
  -> ENABLE_SOUND -> ACTIVE_AV
  -> SCENE_CHANGE -> CROSSFADE -> ACTIVE_IMAGE|ACTIVE_AV
  -> STOP -> IDLE_POSTER
```

No persistir estado de reproducción entre sesiones.

## Transición
- Visual normal: crossfade por opacidad **800 ms**. Sin blur animado, zoom, giro ni desplazamiento de cámara.
- Audio normal: salida **1500 ms** + entrada **2000 ms**. Sin picos; fuente nueva empieza en 0 y alcanza nivel objetivo después de bajar la anterior.
- Si la escena se detiene: audio baja 1500 ms; visual puede volver al poster con 400–800 ms.
- Cambio de color/luz: continuo >=400 ms; nunca flash instantáneo.
- No reproducir dos escenas ambientales simultáneas.

### Reduced motion
Si `prefers-reduced-motion: reduce` o control Iris “Reducir movimiento”:
- no cámara, parallax, aurora rápida, hojas súbitas ni estrella fugaz automática;
- usar frame estático/poster o movimiento localizado <=25% de velocidad normal;
- crossfade visual sustituido por cambio directo o <=120 ms;
- controles siguen disponibles;
- el audio no se activa por el hecho de reducir movimiento;
- transición de audio conserva fade corto (>=600 ms) para evitar chasquidos/sobresaltos.

## Volumen
Reutilizar semántica actual: control 0–100, objetivo inicial bajo.
- Valor visual inicial recomendado: 40/100.
- Ganancia efectiva máxima de escena al inicio: ~0.24 del bus actual (coherente con `sceneVol * 0.6` existente).
- Mute inmediato permitido; unmute vuelve con fade >=600 ms.
- No normalizar automáticamente a un nivel superior al elegido.
- QA debe comprobar que cambiar de escena no produce pico perceptible.

## Contrato por escena

| ID | Visual R40 | Sonido previsto | Loop/duración | Entrada/salida | Fallback sin audio | Equivalente textual ES |
|---|---|---|---|---|---|---|
| sea | escena procedimental + poster | mar/oleaje; grabación A4 READY preferente, si no generado etiquetado | loop hasta parar o temporizador | 800 ms visual / 2 s audio | escena + “Sin sonido” | “Olas suaves llegan a la orilla con el sol bajo sobre el agua.” |
| rain | escena procedimental + poster | lluvia sobre cristal, **sin truenos** | loop | igual | imagen sola | “Gotas resbalan despacio por el cristal; no hay truenos.” |
| river | escena procedimental + poster | corriente + brisa + aves **muy lejanas** | loop | igual | imagen sola | “El agua corre entre piedras; la vegetación se mueve despacio.” |
| night | escena procedimental + poster | grillos + viento suave; sin eventos repentinos | loop | igual | imagen sola | “Estrellas y una aurora suave sobre un lago oscuro.” |
| aquarium | WebGL; fallback Canvas2D | agua filtrada + burbujas suaves | loop | igual | visual completo 2D/3D | “Peces nadan despacio entre plantas y burbujas.” |
| bubbles | WebGL; fallback Canvas2D | burbujas graves y suaves | loop | igual | visual 2D/3D | “Burbujas suben despacio por una columna de luz.” |
| jellies | WebGL + poster | ambiente submarino profundo, estable; no voces animales | loop | igual | poster + texto si no WebGL | “Medusas luminosas flotan y laten despacio en agua oscura.” |
| fibre | WebGL + poster | casi silencio o tono ambiental mínimo | loop | igual | poster + texto | “Hilos de luz cambian de color lentamente.” |

## Interacciones de escena
Interacciones opcionales actuales (burbujas, hojas, limpiar cristal, estrella fugaz, etc.) no pueden dispararse solas.
- Siempre por acción explícita.
- Deben tener equivalente de teclado.
- No pueden causar flash ni movimiento rápido.
- En reduced motion: desactivadas por defecto o sustituidas por respuesta estática.

## WebGL y fallo
- Acuario/tubo: conservar fallback Canvas2D.
- Resto: mientras no exista fallback dinámico, mostrar poster + texto equivalente + controles de sonido/solo imagen; no sustituir por otra escena.
- No recomendar al usuario cambios técnicos invasivos como requisito para usar el Rincón; el mensaje puede indicar que la animación no está disponible y ofrecer la versión estática.

## Temporizador
La opción 10/20/30 min puede mantenerse:
- aviso textual del tiempo elegido;
- al terminar, visual y audio bajan suavemente;
- no bloquear la página ni atrapar foco;
- “No” como valor inicial.

## Audio real vs generado
- Grabación licenciada READY por A4: puede describirse como grabación/ambiente si la fuente lo respalda.
- WebAudio: “sonido generado/creado en Iris Green”.
- Asset HOLD: no se usa en una nueva composición R40.
