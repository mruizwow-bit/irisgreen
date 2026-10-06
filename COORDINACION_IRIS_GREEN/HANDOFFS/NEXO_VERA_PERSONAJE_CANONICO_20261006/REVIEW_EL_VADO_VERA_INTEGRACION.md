# Nexo · revisión El Vado con Vera · 2026-10-06
Gate: NEXO_VADO_VERA_KEEP_CHARACTER__ACTION_STATE_AND_INPUT_PATCH_REQUIRED.
NO MAIN · NO PUBLIC DEPLOY. Running aprobado por María se conserva; hacha excluida.

## Evidencia propia y límites
ZIP EL_VADO_3D_VERA_1.zip SHA256 9955bed3d6eb0233c20b92e6e102e613321f56e937465f7ffea56a2345c7f503; 45/45 SHA256SUMS correctos.
GLB tiene11clips; hacha, Angry y .001 ausentes; Running presente. Base64 decodificado idéntico a GLB. Vídeo adjunto idéntico al interno:120.625s,1120x700,24fps.
Leídos vera.js,game.js,player.js,actualizar de escena3d.js,arranque,pruebas y documentación. Inspección de lámina de falda y diez muestras del vídeo distribuidas cada12s, no visionado continuo ni validación completa de clips.
Probes Node ejecutan métodos reales de Vera.prototype con mixer/acciones simulados. No navegador independiente: Chromium no disponible localmente. 12/12 y23/23 son evidencia del autor, no repetida por Nexo.
No se ha comparado nuevamente el derivado con todos los originales ni medido personalmente inverse bind o deformación de falda.

## KEEP
Personaje real integrado, separación controlador/animación, GLB compartido, archivos originales preservados según entrega, animación Running conservada, exclusiones correctas, carga file vía base64, guardas de inventario.
Mantener Vera. No pedir otra generación ni repintar todo.

## 1. P1 · callbacks visuales obsoletos
game.gestoCon aplica inmediatamente callback de la acción nueva si Vera.gesto devuelve false, pero deja pendiente callback de la anterior.
Reproducción con métodos reales: iniciar recogerSuelo (callback llevar piedra); antes de1.808s intentar colocar (rechazado por gesto activo, callback soltar ejecuta inmediatamente); avanzar1.81s → reaparece piedra en mano, sigue recogerSuelo.
No duplica inventario; desincroniza representación y acción actual.
Patch: definir estado lógico de transporte/acción y revisión/id de transición; callbacks obsoletos no sobrescriben estado nuevo. Resolver cancelación, carga, deshacer y acciones consecutivas desde esa fuente de verdad. No bloquear arbitrariamente al jugador hasta acabar cada clip.
Pruebas recoger→colocar antes sync; recogerA→recogerB; colocar→recoger; interrumpir; cargar/deshacer durante gesto. Efectos únicos y prop final correcto.

## 2. P1 · NONE deja gestos sin resolver
escena.actualizar sólo interrumpe al ENTRAR en NONE. Estando ya congelada, un nuevo gesto se inicia pero actualizar(0) no alcanza sinc ni finished.
Probe600updates0: recogerSuelo continúa activo,tGesto0,mano vacía. Inventario ya se ha actualizado.
Patch: acciones sin movimiento completan su consecuencia visual/estado de forma discreta y no dejan callbacks pendientes; transición de modo no revive gesto viejo. Decidir pose estable explícita.
Separar funcionalidad de avance temporal de animación.

## 3. P1 · teclado global invade controles
game.js escucha document.keydown; escribiendo excluye texto pero no botones/radios. Enter/Espacio ejecutan colocar con preventDefault incluso sobre botones de interfaz. Flechas pueden mover al personaje cuando se usan los radios de Ajustes.
ui.js handlers de cámara/cruceta previenen default pero no detienen propagación; handler global no consulta defaultPrevented.
Hallazgo de código, no reproducción propia en navegador.
Patch: comandos del juego sólo en contexto de escena autorizado; respetar target/defaultPrevented y ajustes. Botones conservan activación nativa. Probar Tab→botón→Enter/Espacio sin colocación colateral; radios con flechas sin mover Vera; foco fuera de escena no controla mundo.

## 4. P1/P2 · sincronía espacial y transporte
La lógica incorpora recurso/crea pieza antes del contacto; callback sólo lleva/suelta un cubo. Personaje no se orienta hacia objetivo al recoger/colocar. Distancia6.3cm al hueso no demuestra agarre ni contacto con objeto.
Definir transporte como estado real: material en inventario no equivale automáticamente a objeto pesado en mano. Si se representa carga, debe coincidir con objeto/material y acción y persistir/restablecerse coherentemente.
retirar(): si pieza existe exactamente en cursor,y se fija pero p queda null; tipoRetirado cae a madera incluso para bloque. Guardar pieza antes de quitarla.
No exigir IK complejo; orientar al objetivo y elegir gestos compatibles con altura/alcance. Para construcción fuera del alcance de mano usar gesto de construcción honesto, no decir que se coloca físicamente en suelo distante.
Comprobar vídeo continuo con objeto/contacto visibles, no sólo flags o cercanía al hueso.

## 5. P2 · tiempo a FPS bajo
dt=min(.05,tiempoReal) descarta tiempo. A3fps,10s reales producen1.5s de simulación; explica esperas, no sólo test corto.
No solucionarlo poniendo dt enorme que atraviese colisiones. Usar subpasos y política de límite/pausa explícita; documentar degradación. Medir hardware real antes de juzgar rendimiento general.
Alargar timeout no valida ritmo del juego. Comparar30/60/120Hz y caída controlada.

## 6. Falda y optimización
La lámina muestra pliegues puntiagudos detrás al agacharse. No se deduce rotura topológica de esa imagen. Métricas de radio/aristas no son PASS perceptual.
Hips40/30/30 es hipótesis, no arreglo aprobado. Puede empeorar colisiones con piernas. Si se ensaya: copia alternativa, selección visible exacta, conservar lateralidad de pesos y transiciones suaves, comparar recoger/colocar/caminar/Running en perfil/espalda y transiciones. Original y Running aprobado se preservan; no reemplazo canónico sin revisión.
No bloquear correcciones de integración por experimentar con la falda.
GLB confirma normal y base en JPEG. Revisar comparativa de material a distancia de juego y detalle: JPEG de normales y eliminación del mapa pueden cambiar acabado. «Mate» no basta para justificar quitar un posible mapa combinado metallic/roughness. No afirmo daño visual medido; falta comparación controlada.

## 7. Alcance de pruebas y entrega
jugar.mjs inyecta cursorA para escalera/parcela; usa conocimiento del mundo para pilotar. Es prueba híbrida, no recorrido completo exclusivamente interfaz.
vera.mjs usa irA/cursorA/correr y mocks no son sus pruebas: son probes Nexo separados. Sus23PASS no validan contacto espacial ni teclado completo.
Scripts dependen de /home/claude y /opt/npm-tools; volver portables con ruta paquete y Playwright configurable.
Añadir recorrido de usuario sin inyectar cursor/posición para construir/cruzar/recoger/colocar, y pruebas adversas arriba. Entregar nuevo ZIP/hash y vídeo.
Este artefacto conserva objetivo de puente/caja/terraza/parcela y sólo3tipos de piezas: revisar como integración de personaje, no declarar cerrado todo el juego de construcción inspirado en Builders ni la orden ampliada de refugios/recetas/NPC.
Secuencia: patch integración → retest → Axioma → HUMAN QA María. Falda como comparación opcional separada.
