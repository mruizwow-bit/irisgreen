# Nexo · Peces R02_1_2 · retest del patch recibido

Fecha: 2026-10-05 · Issue #323
Estado: NEXO_MARINE_R02_1_2_KEEP_TWO_RESIDUAL_FIXES_REQUIRED

## Artifact exacto

- Adjunto: descubrimiento-peces-R02_1_2.zip (la documentación interna lo llama R02_1).
- SHA256: 4598a1153cbcc2741560d30a7e41c5c0828cba508f767abee512ecdfe5ed2392
- 27 738 954 bytes; 75 archivos; MANIFEST 74/74 verificado independientemente; CRC correcto.
- Library: libfile_284d86b2bc2481918a6a81912049f8c3
- Vídeo: descubrimiento-peces-R02_1_2.mp4, Library libfile_0bae6795a1608191bf9c11090601b4d2.
- SHA256 vídeo: 4cdfaff0dbe46dbea7478ea1aa792980543afdd471ff19485e4daaa70b10a79f
- 1 240 230 bytes, 39.08 s, H.264 1280×800 a 25 fps. Idéntico byte a byte al vídeo interno.
- JS de producto: 4/4 sintaxis correcta.
- 26/26 PNG de animales idénticos al ZIP anterior.

## KEEP / correcciones recibidas

1. Giro: corregido el bloqueo en ±0.08. girar ya cruza cero; el suelo queda sólo en girarVisible y también se utiliza para las muestras de detección. Banco Node entregado ejecutado independientemente: 6/6 PASA; vuelta completa en 94 pasos. La duración aproximada de 1.6 s corresponde a 60 fps, no es tiempo garantizado en todo dispositivo.
2. Pose en pausa: hayPose queda separado de anima; el dibujo por tiras y la onda se conservan cuando se detiene el reloj. orientacion deja de interpolar durante pausa. KEEP de código; no equivale a cerrar la pausa de cámara (ver A).
3. REDUCED: perfil propio, recorrido 0.30, amplitud 0.45 y frecuencia de onda 0.60. NONE sin natación. KEEP.
4. Encuadre accesible: nombre ES «Encuadrar e iluminar», EN «Frame and light»; anuncio explícito de centrado, zoom y pausa. KEEP.
5. De canto no examinable; acción explícita de encuadre asienta el perfil. Cambio de producto documentado; validar su percepción en HUMAN QA.
6. Señales del desplegable: nodos persistentes con actualización de texto, posiciones y estado; evidencia CACHE-IDIOMA / CACHE-FOCO recibida de Claude. No confundir con la lista de candidatos múltiples (ver B).

Navegación y escena se conservan. No se pide rehacer natación, assets, controles ni diseño.

## Sólo quedan dos residuos reproducidos

### A · Pausa / Examinar durante una transición de cámara

Archivo: app/motor.js, API pausar y función irCamara.
pausar cancela bucle (natación), pero no animCam (pan/zoom de 240 ms). congelar sólo modifica estado.congelado. Examinar llama congelar(true) y pausar(true), por lo que no detiene la cámara pendiente.

Reproducción Nexo: funciones originales extraídas y ejecutadas en Node con RAF controlado; DOM y dibujo simulados. irCamara desde x=0.5 hasta x=0.8; avanzar callback a 80 ms; pausar(true); ejecutar callback pendiente a 300 ms.

- x al pausar = 0.5666666666666667.
- x inmediatamente después = 0.5666666666666667.
- callbacks de cámara pendientes después de pausar = 1.
- x final = 0.8, con pausa=true.

Es un fallo lógico reproducido, no una observación de navegador. La prueba de píxeles de Claude compara natación/pausa sin cubrir una transición de cámara activa. Que cambien menos píxeles que durante nado no demuestra por sí solo igualdad de pose.

Corrección acotada:
- Al pausar o entrar en Examinar, cancelar animCam en la posición visible actual; no saltar al destino.
- Hacerlo incluso si pausa ya era true, para no dejarlo detrás del early return.
- Continuar no recupera un destino cancelado.
- Conservar pose, reloj, luz y candidato.
- Retest pan y zoom interrumpidos por Pausar y Examinar; cámara idéntica al momento de acción y sin callbacks pendientes tras el tiempo de la transición.
- No se prohíbe mover voluntariamente la vista después de pausar.

### B · Texto obsoleto en candidatos múltiples

Archivo: app/interfaz.js, pintarCandidatos.
El early return cuando data-firma coincide conserva el texto antiguo si siguen siendo examinables los mismos IDs. Las pruebas CACHE entregadas usan #lista-senales; no cubren esta rejilla de botones.

Reproducción Nexo: función original en Node con DOM mínimo; dos candidatos a/b a la izquierda; segunda llamada con los mismos IDs a la derecha y copy EN.
Resultado:
- botón principal cambia a «Examine»;
- los dos botones de candidato siguen diciendo «Examinar animal izquierda».

Corrección acotada:
- Mantener los nodos por ID y actualizar texto/nombre/posición aunque la firma coincida.
- No resolverlo añadiendo idioma/posición a una firma que destruya y reconstruya todos los botones: se perdería el foco.
- Retest con >=2 candidatos simultáneos, mismos IDs, cambio ES/EN y movimiento izquierda→derecha; comprobar identidad de nodos, foco estable y texto actualizado.
- Retener el arreglo ya existente 2→0→2 (limpieza de data-firma).

## Alcance de la revisión

Nexo verificó binarios, sintaxis, ejecutó el banco de funciones puras y reprodujo A/B con funciones originales y dobles mínimos. Se inspeccionaron fotogramas del vídeo a 8 y 24 s; no es revisión perceptual continua.
No se ejecutó Chromium ni se da por independiente la QA de navegador de Claude.
Axioma debe retestar el ZIP final; María decide si la natación se lee como nado convincente.
No se declara HUMAN QA PASS ni conformidad.
La revisión factual de taxones/zonas y pares de assets permanece separada, con Senda/Astra. No ampliar la escena por este patch.

## Orden siguiente

Claude: corregir sólo A/B, conservar todo el KEEP, entregar ZIP/hash y evidencia reproducible de ambos.
Después: AXIOMA EXACT ZIP RUNTIME RETEST → HUMAN QA MARÍA.
NO MAIN · NO PUBLIC DEPLOY.
