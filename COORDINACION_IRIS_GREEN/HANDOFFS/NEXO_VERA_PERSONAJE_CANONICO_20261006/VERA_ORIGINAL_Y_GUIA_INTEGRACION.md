# Vera · personaje canónico aportado por María
2026-10-06. María identifica expresamente este personaje como Vera y autoriza conservarlo en GitHub o Biblioteca para Claude.
La figura procedimental de El Vado pasa a ser provisional. Integrar el personaje aportado; no regenerar su identidad.

## Original preservado
Archivo recibido: PERSONAJE 1(2).zip.
Nombre organizado en Biblioteca: VERA_FBX_ANIMACIONES_ORIGINAL.zip.
Biblioteca ID: libfile_1e91b9e60a148191b3208a467a1bcc25.
Descarga autenticada: https://chatgpt.com/api/library/files/libfile_1e91b9e60a148191b3208a467a1bcc25/download
SHA256: f6077ae03b4ba7a22d99b9e6d52886c6423bf28efacde04e82111e45e18e8979.
116238784 bytes; seis archivos. Bytes originales intactos; sólo se ha renombrado la entrada de Biblioteca.
Los binarios están en Biblioteca, NO subidos a GitHub. Aquí queda el inventario y guía.
El enlace no es público y no acredita acceso desde Claude: María puede descargar y adjuntar el ZIP a su conversación de Claude.

## Inspección estructural propia
Lectura binaria FBX 7400:
- Un mesh char1: 7572 vértices de control y 15116 caras triangulares en cada FBX.
- 24 modelos LimbNode y 24 clusters de skin.
- FBX Character_output: una entrada de animación base.
- FBX Merged_Animations: 20 AnimationStack, incluidos Walking, Running, Idle_11, Collect_Object, gestos, sentarse y sleep. Una entrada se llama Character_output.fbx; no afirmar 20 acciones de juego únicas/validadas.
- Texturas base y normal 4096×4096; metallic y roughness 2048×2048.
Inventarios exactos en INTAKE.json y FBX_STRUCTURE.json.
No render del personaje, reproducción de clips ni inspección de deformaciones. No PASS visual, anatómico, de rig ni rendimiento.

## Indicación a Claude
1. Usar este personaje como Vera, conservando aspecto, ropa y proporciones.
2. Cargar FBX animado y mapas reales; verificar unidades, ejes, materiales, correspondencia de huesos, root motion y bucles. No duplicar dos personajes porque haya dos FBX.
3. Comprobar Walking/Running/Idle_11 y recogida. Nombres son indicios; reproducir antes de mapear acciones.
4. Preparar derivado GLB para web si procede, con animaciones y materiales conservados, dejando originales intactos y hashes/procedencia. Probar con loader compatible con la versión del juego.
5. Preparar texturas derivadas de menor coste sólo tras comparar aspecto; no modificar masters. 116 MB de fuente no debe tratarse como presupuesto de descarga del runtime.
6. No hay clip inequívocamente nombrado construir/martillar. No inventar su existencia. Decidir si un gesto actual sirve tras verlo o pedir a María una animación adicional del mismo personaje, sin regenerarlo.
7. Mantener colisión lógica y posición del juego coherentes con esqueleto. Si locomoción tiene desplazamiento de raíz, elegir root motion o movimiento del controlador, sin sumarlos inadvertidamente.
8. Entregar prueba de Vera dentro de El Vado: reposo, caminar, giro, escalera, recoger; revisar pies, ropa/piernas, brazos, manos y escala. Probar REDUCED/NONE conservando acciones.
9. Falta mano articulada por dedos en la lista de huesos: no pedirla sin que una acción real necesite esa precisión.

## Qué debe hacer María en Meshy
No se ha demostrado todavía un defecto que requiera rehacer el modelo.
Una exportación adicional GLB del mismo personaje con rig y animaciones puede facilitar integración; no sustituye los originales ni garantiza peso/rendimiento.
Si aparece deformación concreta al reproducir, entregar clip, instante y captura antes de pedir cambios.
La optimización de texturas, configuración de materiales y conversión de formato pueden corresponder a integración.

## Referencias técnicas consultadas
Three recomienda glTF para intercambio de modelos: https://threejs.org/manual/pages/loading-3d-models.html
Meshy documenta exportación animada FBX/GLB: https://docs.meshy.ai/es/webapp/guides/animate
Sin despliegue ni cambios a main.
