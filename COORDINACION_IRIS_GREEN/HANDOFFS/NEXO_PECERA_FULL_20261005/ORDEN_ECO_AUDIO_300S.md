# ORDEN NEXO → ECO · PECERA R02 · AUDIO CONTINUO 300 S
Fecha: 2026-10-05
Autorización explícita María: «ok, dáselo a nuestro experto en audio».
Destinatario: Eco · A6, owner audio first-party + media QA confirmado en Slack común (2026-10-02, mensaje 1790961312.647119).
Owner de esta tarea: ECO. Nexo aporta continuidad y evidencia.
Estado: HANDOFF_READY_FOR_ECO. La publicación no acredita inicio ni aceptación.

## Objetivo
Entregar 300.000 s de audio que conserve la dirección OAI R02 bubble-dominant que María reconfirmó hoy («sí, ese es»). Referencia y sonido aprobados, no nueva dirección artística.
Mantener burbujas protagonistas y estéreo estrecho. Sin cama estéreo nueva, masa hueca/submarina, oleaje ni LFO. Sin repetir, ralentizar o estirar los 40 s. Sin sustituir por Claude AUDIO_R2, OAI R01 ni A1 antiguo.

## Archivos reales accesibles en Library del proyecto
1. Referencia aprobada:
PECERA_AUDIO_OAI_R02_BUBBLE_DOMINANT.m4a
Library ID: libfile_d696ddc1ac408191b2cba7516a80a2c9
SHA-256 verificado: a576f9f4e9c2b2ed42faa80099bd2d8763964b3bfbb7135863d1f2fb3989eb2f.
40 s, AAC 48 kHz estéreo. No usar como bucle.
2. Referencia audiovisual de 40 s:
PECERA_R02_CLIP_40s_AUDIO_OAI_R02_BUBBLE_DOMINANT.mp4
Library ID: libfile_436df5d1cbf08191ac4e2b057a194e9d
SHA-256 canónico: 5b9ea28406ae024ca6ba0c68cff26d0052325d261988c86063d794da5bd9478f.
3. Fuente original de 40 s anterior al procesamiento Nexo:
PECERA_R02_CLIP_40s.mp4
Library ID: libfile_3c43fc4a063481919e91958dc2077a63
SHA-256 recibido: 74b86d0f7df050072c09a6fa8f1f6edb8d3c61663a58c437df33de65465d0dcf.
4. Paquete de fuentes visuales:
RINCON_PECERA_R02_20261004.zip
Library ID: libfile_834876a429448191b8b7b6a9c2b44cd4.
5. Vídeo full para revisión, SIN AUDIO:
PECERA_R02_FULL_5MIN_REVISION.mp4
Library ID: libfile_7942d94686948191a88e2320ff9c1bc6
SHA-256 recibido: 5f0086fdedd3611089f320ad72113379accd1e345658be632f457bc5f812b43d.
300 s, 9000 frames, 1280×720, 30 fps, H.264. Decode completo sin errores. No es master.
6. Informe productor:
PECERA_R02_FULL_5MIN_INFORME.md
Library ID: libfile_c705a1d54460819198a5d3627ec9760d.
SHA-256: 1e4e36e208cf022af5856ecce9e7e5c92b97e01f3af8f1d6422c066bf6a9433f.
7. Manifest recibido:
PECERA_R02_FULL_5MIN_SHA256.txt
Library ID: libfile_52a09d5cc4448191912cb0bed83ac889.

## Bloqueo exacto y recuperación ya realizada
El audio aprobado lo procesó Nexo. No pedir a María que lo vuelva a aportar: está localizado arriba.
El paquete visual conserva en clip_r02.sh la llamada:
python3 /home/claude/r70/nuevo/audio2.py acuario "$DURS" "$W/son.m4a"
El archivo audio2.py no está incluido. Buscar/recuperar el original y sus dependencias del productor; o recibir salida continua de ese generador de 300 s, preferiblemente WAV estéreo 48 kHz. No confundir con la iteración AUDIO_R2 rechazada.
No hay una fuente completa recuperada todavía.

Documentos de evidencia (misma rama):
- RECEPCION_VIDEO_SIN_AUDIO.md, commit bd0edd77ca562f67f9611893bff43c9748cefba4.
- RECUPERACION_FUENTE_AUDIO_R02.md, commit 29299c82a7803ff24420b8a0d9ddea04d2422375.
Ambos dentro de COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_PECERA_FULL_20261005/.

Comparación Nexo original/aprobado:
- filtro inferido Butterworth high-pass orden 8, bidireccional, ~150 Hz;
- ganancia media estimada 5.61150 (~14.98 dB);
- factor side respecto al mid estimado ~0.348329;
- correlación de componente mid reconstruida: 0.9999352, ensayo a 4.8 kHz entre 2–38 s.
Son parámetros INFERIDOS, no script histórico ni PASS perceptual. Eco debe comprobarlos a 48 kHz, ambos canales y extremos antes del render full. No empezar otra mezcla por aproximación de LUFS.

## Ejecución
1. Recuperar fuente/generador correcto y documentar procedencia.
2. Reproducir el tratamiento sobre el original corto y contrastarlo con el M4A aprobado (forma temporal, espectro, stereo y escucha cuando sea posible).
3. Generar 300 s continuos. Mantener el carácter de las burbujas aprobadas; no subir el volumen por el comentario sobre el vídeo mudo.
4. Entregar WAV estéreo 48 kHz y M4A AAC, 300 s; receta reproducible, parámetros, dependencias, semillas, hashes calculados después del cierre de archivos.
5. Puede montarse una copia de revisión usando el vídeo adjunto y -c:v copy. Identificarla como derivado de revisión.
6. Para el master final, Claude debe facilitar el master de 106072143 bytes (o sus cinco partes) que menciona en el informe. No está adjunto. No afirmar haberlo validado.
7. QA audiovisual exacta: duración A/V, inicios 0, decode, clipping/true peak/loudness por ventanas, discontinuidades, repetición, faststart, prueba de reproducción y contraste perceptual con referencia. Medidas no equivalen a HUMAN QA.

## Salida
PECERA_R02_FULL_5MIN_AUDIO_OAI_R02_BUBBLE_DOMINANT.wav / .m4a
receta + SHA256 + informe de validación; link persistente al binario.
Gate al estar realmente completo:
RINCON_PECERA_R02_FULL_5MIN_AV_READY_FOR_MEDIA_QA
Si solo se completa audio, registrar AUDIO_READY_FOR_MUX sin atribuir PASS al AV ausente.
María escucha el full antes de cierre de producto.

## Límites
No tocar vídeo/arte por este bloqueo, no A1 antiguo, no música, no siguiente pieza, no main ni integración player.
Motor continúa Sabik. No interrumpirlo.
Si no aparece el generador: comunicar bloqueo concreto a Nexo, conservando la referencia; no devolver a María una petición del audio que ya guardamos.
