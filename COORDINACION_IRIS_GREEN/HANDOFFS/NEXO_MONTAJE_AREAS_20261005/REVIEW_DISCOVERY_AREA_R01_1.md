# Nexo · recepción y revisión del patch Descubrimiento R01_1
2026-10-05

## Estado
NEXO_DISCOVERY_AREA_R01_1_READY_FOR_AXIOMA
Es recepción para revisión independiente de interfaz. No PASS de navegador, HUMAN QA ni integración completa.

## Artifact exacto
- Archivo adjunto DESCUBRIMIENTO_AREA_NAVEGABLE_R01_1.zip; raíz interna DESCUBRIMIENTO_AREA_NAVEGABLE_R01.
- SHA256 d0ef4877a09e892cf219afdb90089a44cad83b181544b2f70df7972c815b04e3.
- 3 451 569 bytes, 39 archivos.
- 38/38 HASHES.txt y 37/37 MANIFEST.json verificados independientemente.
- Destinos estáticos locales de los seis HTML presentes.
- Capturas experiencia_cielo_1440 y peces_390 inspeccionadas; fuente HTML/JS y banco leídos.
- No se ejecutó navegador en esta revisión. 14/14 es evidencia de Claude, no reproducción de Nexo.

## Correcciones incorporadas
P01: app.js añade inert/aria-hidden al fondo, contención Tab/Shift+Tab y retorno de foco; elimina esas restricciones al cierre normal. La navegación no se hace inert a sí misma porque se excluye su cabecera contenedora.
P02: ya no promete ausencia de movimiento automático en Peces/Cielo. Conserva «Nada suena por su cuenta»; verificar coherencia cuando se conecten los runtimes.
P03: seis HTML sin referencias a Prisma, runtime, sesión de producción o marcador CONDICIONES PENDIENTES. Vacíos comerciales pasan a lenguaje de producto. Capturas coherentes. Quedan placeholders honestos de imagen y experiencia no disponible, autorizados como entrega intermedia.

## Retest concreto para Axioma
- Abrir menú → recorrer Tab y Shift+Tab → Escape desde los controles → comprobar foco de retorno y fondo operable.
- Comprobar resize móvil→escritorio con foco en Cerrar: alCambiar aún usa cerrarMenu(false) y CSS oculta el botón Cerrar en escritorio. Posible foco en control oculto; no cubierto por las 16 tabulaciones del banco. Si se confirma, patch mínimo para llevar foco a navegación visible al cambiar breakpoint.
- Repetir a 200 % con foco visible y sin contenido tapado; no equiparar scrollWidth correcto a ausencia de clipping.
- La prueba de restitución del banco sólo inspecciona inert en main/footer: ampliar comprobación efectiva a marca, botón Menú, ruta, enlace Saltar y aria-hidden.
- Revisar que los estados previos inert/aria-hidden no se destruyan cuando se integre con otros overlays; el patch actual elimina ambos atributos incondicionalmente. No hay evidencia de atributos previos conflictivos en este paquete aislado.
- Límites previos de P04 (targets sólo cielo móvil, primer Tab, saltos independientes, NONE como hook, ES ejecutable) siguen siendo límites de evidencia. No exigir rehacer diseño ni repetir producción visual.
- Reserva Sabik no incorporada: pendiente de integración coherente con Juegos; no recrear asistente.

## Alcance que sigue pendiente
Los botones Explorar siguen llevando a experiencia.html con aviso. Las imágenes aún son placeholders. Los catálogos Para todos/Plus siguen sin clasificación comercial; no inventarla.
Los dos runtimes están disponibles por sus entregas identificadas, pero la conexión la realiza Prisma; no se considera que este ZIP incluya las experiencias.
Cielo: falta su patch independiente de clic/toque directo, arrastre voluntario y flechas físicas, sin círculo obligatorio. Vida marina: conservar manejo actual confirmado por María.
Construcción: prototipo rechazado de Prisma; nuevo encargo autónomo a Claude, independiente de este patch de Descubrimiento.

Siguiente: Axioma retest del área y pendientes concretos → integración de assets/runtimes → prueba del recorrido por María.
NO MAIN · NO PUBLIC DEPLOY. Motor sigue con Sabik.
