# Nexo · retest WEB R02 PATCH1
2026-10-06. KEEP R02/PATCH1. NO MAIN · NO PUBLIC DEPLOY.
Gate: NEXO_WEB_R02_PATCH1_KEEP__SMALL_COPY_AND_EVIDENCE_PATCH_REQUIRED.
No rediseño, no regeneración de masters.

## Fuente e integridad
Adjunto IRIS_GREEN_WEB_R02_PATCH1_2.zip (nombre local), SHA256 4904d8b061478d64a2016f6739c39831fc46c6d9d950ddb930544b52972b5afd.
Coincide con sidecar aunque éste nombra IRIS_GREEN_WEB_R02_PATCH1.zip.
194 archivos: 192 contenidos + MANIFEST.json + HASHES.txt.
193/193 hashes de HASHES.txt correctos; 192/192 hashes de MANIFEST correctos.
17 assets del registro con hashes correctos y dimensiones raster coincidentes.
56 páginas públicas (28 ES + 28 EN). Hay además 56 cuerpos HTML fuente dentro de gen: no contarlos como 112 páginas públicas.
Regeneración en copia: 56 públicas idénticas; los 112 HTML entre públicas y cuerpos también permanecen idénticos.

## KEEP comprobado en código / evidencias entregadas
- Natural/contain; dimensiones actuales coinciden. Registro de archivos y colocaciones con alt por función.
- Retirada de migas desde generador.
- Construcción DESIGN_PREVIEW / HUMAN_QA_PENDING.
- Sin Orión identificado en puerta/ficha de Cielo. La imagen de portada de Descubrimiento es amatista, no cielo nuevo; ficha Cielo sin imagen, pendiente declarado.
- Código de resize devuelve foco a enlace visible de área en escritorio.
- setItem/getItem comprobados antes de anunciar guardado.
- Plus fuera de tarjetas públicas; pendientes de conexión declarados.
- Aviso/licencia Mulberry y plain language corregidos.
- Banco incorpora scrollHeight y overflow clip; no es todavía evidencia universal de accesibilidad.

## Patch pequeño requerido
### 1. Promesas residuales en Creación (ES/EN, Home y metadatos)
index.html: «Hacer algo propio y guardarlo si quieres».
creacion.html meta: «Hacer algo propio, guardarlo y volver a ello».
creacion.html: «Cómo funciona esta área» / «Se puede deshacer» / «Todo lo que coloques se puede quitar. No hay forma de estropearlo».
EN conserva «It can be undone». Fuentes en datos/sitio.json y cuerpos del generador.
Se ha aclarado que mesas no están conectadas, pero siguen afirmaciones generales de funciones no verificadas. Cambiar a descripción/intención explícita o copy neutral; p.ej. «Un espacio para dibujar, escribir, construir y crear sonidos. En preparación». Guardado/deshacer se declaran por herramienta conectada y probada, no como hecho global ni garantía absoluta. No eliminar la arquitectura.

### 2. Capturas incompletas por carga diferida
CAPTURAS/descubrimiento_390.png muestra huecos en aves, flores, minerales y monedas; creacion_320.png en varias mesas inferiores.
Los archivos existen y hashes pasan. tools/pruebas.py hace goto, espera 300 ms y screenshot(full_page=True) sin recorrer imágenes lazy. Es un fallo de evidencia entregada; no he demostrado que el usuario vea esos huecos después de hacer scroll real.
Conservar lazy en producto. Para capturas recorrer página, esperar load/decode y naturalWidth > 0 de cada imagen, volver al encuadre requerido y capturar. Fallar si falta imagen. Regenerar evidencias, manifest y hashes. No pedir nuevos masters.

### 3. Aviso temporal de movimiento
Dice «se pierde al cerrar», pero solo vive en el documento actual cuando storage falla: navegación/recarga también lo pierde.
Reproducción aislada con app.js real en Node VM + DOM mínimo: storage bloqueado, elegir none => atributo none y aviso temporal; nuevo documento sin cerrar navegador => normal. Esto es prueba de lógica, NO navegador.
Copy preciso ES/EN: «Aplicado solo en esta página. Al cambiar de página o recargar tendrás que elegirlo de nuevo». No exigir aquí nuevo sistema de persistencia.

### 4. Dimensiones: documentación no corresponde a implementación
imagen() lee meta["dimensiones"] de datos/imagenes.json; no abre archivo de imagen durante generación. Valores actuales correctos.
Dos opciones: corregir README/CHANGELOG para declarar dimensiones registradas y verificadas contra binarios, o hacer que generación las lea/verifique y falle ante divergencia. No mantener afirmación automática no implementada.

## Límites de los oráculos / retest pendiente de navegador
58/58 es evidencia del autor, NO rerun independiente Nexo en esta sesión.
Python Playwright no instalado; Node Playwright disponible pero sin Chromium. Intento de descargar headless shell devuelve archivo inválido/truncado, detenido. No usar capturas del autor como capturas propias.
Prueba del menú al 200%: scrollHeight >= ultimo.offsetTop no demuestra por sí sola que último enlace, Cerrar y foco sean alcanzables. Axioma debe recorrer por teclado hasta todos los controles, comprobar visibilidad tras scroll y activar Cerrar/Escape a 320/390 con texto ampliado.
Dimensiones y naturalWidth del banco deben esperar realmente a imágenes lazy para evitar comparar con 0. Oráculo alt actual es heurística de enlace con texto; el alt por rol requiere revisión semántica además.
No declarar aquí PASS de foco, AT, touch ni reflow browser independiente.

## Secuencia
Patch de copy + evidencia + documentación, manteniendo todo el núcleo → retest navegador/precheck Axioma → HUMAN QA María.
Captura 3D de El Vado, cielo neutro, Rincón/Pecera y Ritmo siguen dependencias de integración fuera de este patch.
