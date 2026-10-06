# Nexo · Vera con botas separadas · revisión estática
2026-10-06. NO MAIN · NO DEPLOY.
Estado: BOOT_SEPARATION_VERIFIED__KEEP_FOR_REMESH_AND_RIG_TRIAL.
Sustituye como candidata activa al GLB anterior de botas unidas; no borra su diagnóstico histórico.

Archivo: Meshy_AI_Bluebell_Lace_Doll_1006104408_texture.glb
SHA256 a3fa37453e8e3b425f411cd931ca9de02f15c38db0146da68c2a28035d1bbec2
57433848 bytes;916978 vértices;1701362 triángulos.
Tres texturas2048×2048 embebidas. Este archivo es2K, no8K. Sin skins ni animaciones. Índices válidos y posiciones finitas; nodo identidad.

## Comprobaciones propias
Lectura GLB, renders EGL ortográficos frontal/45°/perfil/espalda y detalle sin textura de botas. Color base+luz difusa; no renderPBR completo ni animación.
Hueco claro entre ambas piernas visibles y entre botas/suelas. Diseño sin bolso, cara/trenzas/vestido/mangas conservan identidad general; brazos separados del vestido. No se pide nueva generación por el defecto anterior.
Conectividad en triángulos enteramente bajo y=-0.78, unificando posiciones exactamente iguales sólo para analizar seams:6 componentes. Las2 principales de botas tienen15752 y16233 posiciones; rangosX [-0.235758,-0.079901] y[0.079595,0.235513]. Las otras son fragmentos menores dentro del corte. Las botas NO pertenecen a una misma componente y están espacialmente separadas. No extrapolar6 componentes del corte a6 piezas de la malla completa.
El anterior tenía una sola componente inferior que unía las dos botas. Ese defecto concreto queda cerrado para este hash.

## Paso siguiente
Conservar original; preparar derivado de juego mediante remallado/reducción antes de rigging:1,70 millones de triángulos todavía no es presupuesto de un personaje web pequeño. Cambiar2K/8K no cambia por sí solo topología ni pesos.
Revisar que remesh conserva hueco de botas, cara, dedos, brazos, trenzas y silueta; presupuesto ajustado al piloto y opciones reales, sin número universal inventado.
Después rigging y prueba breve de reposo/caminar/saludar/agacharse antes de exportar biblioteca de clips. Comprobar independencia de pies y falda/mangas sin arrastre por brazos. No declarar riggingPASS desde esta revisión estática.
Original intacto, no publicado elGLB en GitHub. No se ha realizado optimización ni skinning en este turno.
