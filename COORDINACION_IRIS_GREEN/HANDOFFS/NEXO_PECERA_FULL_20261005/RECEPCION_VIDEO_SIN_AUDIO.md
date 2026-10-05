# Nexo · Pecera R02 full 5 min · recepción real y bloqueo de audio
Fecha: 2026-10-05
Estado: PECERA_R02_FULL_5MIN_VIDEO_ONLY_AUDIO_MISSING
Issue: #368

## HUMAN feedback
María: «las burbujas no se oyen y el audio apenas se oye nada».
El archivo adjunto concreto no permite evaluar una mezcla: contiene cero streams de audio. No clasificar esto como rechazo perceptual de OAI R02 ni recomendar subir volumen para resolverlo.

## Evidencia independiente sobre el adjunto
Archivo: PECERA_R02_FULL_5MIN_REVISION.mp4.
Library ID: libfile_7942d94686948191a88e2320ff9c1bc6.
Bytes: 24349838.
SHA-256 recibido: 5f0086fdedd3611089f320ad72113379accd1e345658be632f457bc5f812b43d.
ffprobe: un stream H.264; 1280×720; 30 fps; 9000 frames declarados; duración 300.000000 s; inicio 0; sin audio.
Decodificación completa ffmpeg a null: exit 0, sin errores.
Faststart: moov en offset 5907, antes de mdat 114791.
Inspección de seis muestras a intervalos de 50 s: escena azul con peces, plantas y burbujas visibles. Esto no prueba por sí solo ausencia de loops, continuidad total ni PASS perceptual Eco.

## Informe y procedencia
El informe adjunto declara explícitamente que falta el audio aprobado y solicita receta/fuente o render continuo de 300 s.
SHA del informe verificado: 1e4e36e208cf022af5856ecce9e7e5c92b97e01f3af8f1d6422c066bf6a9433f (coincide).
El SHA y tamaño declarados para REVISION (e827587f435d2bda4312e45fb90fea1e6460e233f3593ec1584b109c910c7ad2; 24343963 bytes) difieren del recibido.
Se observa un átomo uuid de 5875 bytes, igual a la diferencia de tamaño; esto sugiere cambio de metadatos de transporte, pero no demuestra identidad del flujo. No declarar corrupción ni coincidencia binaria. Reconciliar manifest contra el archivo exacto entregado.
El master de 106072143 bytes, los cinco trozos y el ZIP de fuentes mencionados no están entre estos tres adjuntos. Sus hashes y pruebas del informe siguen siendo declaraciones del productor, no verificaciones de Nexo.

## Siguiente trabajo concreto
1. Mantener el vídeo R02; no rehacer la escena por este bloqueo de audio.
2. Nexo: recuperar la receta exacta OAI R02 y su fuente original completa; el M4A aprobado de 40 s es referencia perceptual, no fuente para loop.
3. Registro canónico #368 comentario 5981883021: OAI R02 parte del audio ORIGINAL con filtrado/estrechamiento, no Claude AUDIO_R2. La comparación con AUDIO_R2 en el informe no demuestra por sí sola que OAI fuera una síntesis nueva. No reconstruir una mezcla por huella estadística.
4. Producir 300 s continuos con esa dirección aprobada, sin repetir/estirar 40 s, cama estéreo añadida, oleaje ni LFO. Entregar fuente/receta reproducible.
5. Claude Rincón: facilitar master y fuentes ya producidos; al recibir audio completo, mux con vídeo copiado, AAC 48 kHz estéreo, inicios 0 y duraciones alineadas; verificar streams, decode y SHA del archivo cerrado. No sustituir por su AUDIO_R2 rechazado.
6. Eco revisa el binario audiovisual final real; después integración cuando Motor esté disponible y HUMAN QA en contexto.
No emitir RINCON_PECERA_R02_FULL_5MIN_AV_READY_FOR_MEDIA_QA todavía. No tocar main ni interrumpir Motor.
