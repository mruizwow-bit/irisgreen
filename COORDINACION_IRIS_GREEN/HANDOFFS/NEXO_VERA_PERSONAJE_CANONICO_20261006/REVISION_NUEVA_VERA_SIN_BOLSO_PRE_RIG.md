# Nexo · nueva Vera sin bolso · revisión previa a rigging
2026-10-06. NO MAIN · NO DEPLOY. Original intacto.
Estado: KEEP_VISUAL_DESIGN__SEPARATE_BOOTS_AND_PREPARE_GAME_MESH_BEFORE_RIG.

## Archivo exacto
Meshy_AI_Bluebell_Doll_1006103233_texture.glb
SHA256: 1b2effd72ab5169b7eaea6f1fce0569d5d11f5601ed8c53c5592fc80fb1a108e
129871648 bytes; 1633712 vértices; 2211764 triángulos.
Una malla/material; texturas JPEG embebidas: color 8192×8192; metallic/roughness 4096×4096; normal 4096×4096.
Sin skins, huesos ni animaciones. Posiciones finitas e índices dentro de rango.
En este archivo 8K corresponde efectivamente al mapa de color. No asumirlo de otras opciones de Meshy.

## Método propio y hallazgo
GLB leído directamente. Render estático EGL/ModernGL, proyección ortográfica, color base y luz difusa sencilla; sin evaluación PBR completa. Vistas frontal, tres cuartos, lateral, posterior y detalles de ambas manos/botas y desde abajo. No es test de animación ni rigging.
Diseño reconocible: pelo azul/trenzas, vestido crema floral, sin bolso. Brazos separados del vestido, cinco dedos distinguibles por mano; piernas visibles separadas bajo el vestido. Esto no acredita topología interior ni pesos futuros.
Defecto confirmado: ambas botas están conectadas en la parte baja. Se aprecia en renders sin textura posteriores e inferiores.
Comprobación geométrica: submalla de triángulos cuyos tres vértices cumplen y < -0.78; unión analítica sólo de posiciones EXACTAMENTE iguales para resolver duplicación de seams. Resultado: UNA componente conexa, 41941 posiciones, x entre -0.132533 y +0.131770; cubre ambas botas sin incluir torso/piernas superiores. Además 13 triángulos bajo y=-0.84 cruzan x=-0.001 a x=+0.001. No es simple oclusión de una bota por la otra. Original no modificado.

## Siguiente trabajo
1. Conservar este GLB como master; no regenerar identidad ni volver al bolso.
2. Corregir unión de botas en una copia: hueco real y continuo entre ambas, incluyendo suelas; cerrar correctamente superficies resultantes. No desplazar un pie estirando el puente existente. Un remesh por sí solo no garantiza separar una unión.
3. Preparar derivado de juego con remallado/reducción preservando cara, dedos, trenzas, silueta y ropa. Comparar visualmente; no declarar un presupuesto universal ni confundir bajar textura con bajar triángulos.
4. Rigging después de revisar separación y derivado. Probar primero reposo, caminar, saludo y agacharse; piernas/pies independientes, falda/mangas sin arrastres por brazos, sin prometer que quitar bolso resuelve todo skinning.
5. Sólo después integrar como Vera de Construcción. No elegir este archivo de 130MB directamente como asset web.

Documentación primaria contrastada: https://docs.meshy.ai/en/webapp/guides/3d-model/rigging recomienda remesh antes de rigging y revisar topología densa/desigual. No demuestra que el automatismo vaya a reparar estas botas.
No se ha subido el GLB al repositorio ni modificado el modelo. María lo adjuntó al chat; esta entrada registra el binario y el diagnóstico, no entrega ficticia a Claude.
