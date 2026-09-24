# Barra interior y Rincón actualizado · A2 R19 · 2026-09-24

María solicita corregir distribución de cabeceras interiores (controles desplazados fuera de la barra) y aplicar irisgreen-r02-r03-listo_3.zip al Rincón tranquilo. ZIP SHA-256: 6e12953deeaea679496bdc2641ce7cefbc766ef082434a4d2179757e8acf6548.

Cabeceras interiores hd e ig-uh: en escritorio, marca a la izquierda y controles/idioma arriba a la derecha; navegación completa centrada en segunda fila, con ajuste de líneas. Sustituida la fila única con scroll y menú intermedio 901–1599px. Se conserva la barra propia de Home y la lógica móvil existente.

Rincón ES/EN: bundle entregado con soporte WebGL1 y WebGL2, aviso cuando no hay WebGL salvo Acuario/Tubo con fallback 2D propio, doce sonidos generados sin música ambiental, río y chimenea revisados, ocho miniaturas WebP reales. Se actualiza también tools/escenas-3d/rincon-escenas-3d.js.gz.b64 con hashes verificados, pues el build reconstruye assets/rincon-escenas-3d.js desde ese archivo. JS/CSS y carga dinámica llevan versión rincon-r19-20260924 para evitar mezcla con caché anterior.

Solo se integra Rincón del ZIP. Recursos R03 y memoria/control del donante no se copian encima de versiones posteriores R17/R18. Cabeceras y pies del donante Rincón coinciden con el HEAD actual. No se sustituye el catálogo de 252 juegos ni los 118 vídeos con Dan primero.

HEAD cd39aa8ca957a4b1448400be98d0911b35851db6, PR244. 17 archivos cambiados. Build propio correcto (2113 archivos). Deploy 6ab54f8f004b0100085d6eac SUCCESS. QA propia de navegador: barra en dos filas con controles visibles en Rincón ES/EN y Videoteca; sin desbordamiento a 1363px. Ocho miniaturas con sus URL propias y catálogo de doce sonidos sin Ambient music. Medusas sin WebGL muestra aviso ES/EN y ningún canvas de tubo. Acuario abre canvas 2D propio y se puede parar. Río cambia a Sonando/aria-pressed y Parar sonido lo devuelve a false. No se evalúa el realismo auditivo ni se simula WebGL1/2 en este navegador sin GPU.

Las pruebas de WebGL1/WebGL2, axe y escucha descritas en la entrega son del donante; no se atribuyen a A2. GPU real, móvil y valoración auditiva humana pendientes. No certificación normativa. Sin main, producción ni Cloud.
