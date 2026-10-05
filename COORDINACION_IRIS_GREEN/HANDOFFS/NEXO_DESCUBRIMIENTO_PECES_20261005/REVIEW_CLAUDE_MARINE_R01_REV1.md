# Nexo · Vida marina · R01 rev.1 · revisión del paquete exacto

Fecha: 2026-10-05. Issue: #323.
Estado: NEXO_MARINE_R01_REV1_REVIEWED_CANDIDATE_CACHE_PATCH_REQUIRED.
Alcance: revisión del ZIP entregado; no es un PASS de runtime ni HUMAN QA.

## Identidad de la entrega

- Archivo: descubrimiento-peces-R01-rev1.zip
- SHA256: 600a6acffa7bf02b1270f74678a892ef3e5bb9163263099fed4cf33951ec9bd7
- Bytes: 26507379.
- Biblioteca: libfile_054f148fe0b48191ba09f9112d8429bc.
- 70 archivos; 69/69 entradas del manifest verificadas independientemente tras extraer; el manifest se excluye a sí mismo. CRC correcto.
- Sintaxis Node de datos.js, i18n.js, motor.js e interfaz.js: 4/4.
- Este registro identifica el archivo recibido, no afirma que el binario esté adjunto a GitHub ni accesible desde otra sesión.

## Correcciones anteriores presentes

1. Zonas: desaparece el booleano global zonaValidada. Cada registro tiene zonasValidadas; el motor compara con la zona concreta de la escena. Las etiquetas y el álbum usan esos registros. meso-01 conserva tres slots; el lote privado conserva trece. La incorporación requiere ID, binarios, asignación de zona y slot/ancla.
2. Foco: construirSenales crea los controles una vez por escena y actualizarSenales conserva sus nodos. Examinar usa aria-disabled y examinar(id) comprueba de nuevo que el candidato sea examinable antes de identificarlo. Retirar del álbum elimina sólo esa entrada y lleva el foco a un control estable.
3. Visibilidad: evaluar excluye muestras fuera de W/H antes de contar la parte iluminada. El visor deja de centrar mediante flex y usa imagen de bloque con margin:auto.
4. Procedencia: README y procedencia/ reconocen Atlas MAR_22 y separan ambos conjuntos. Comparados los seis PNG Atlas con la copia canónica previa: 6/6 idénticos. Comparados los 26 PNG usados con el manifiesto fuente incluido: 26/26. El manifiesto fuente enumera 78 archivos; los otros 52 formatos no viajan en este ZIP, por lo que NO se repite aquí una verificación binaria 78/78.
5. modoEquipo está actualmente en true. La ruta false oculta selector e informe. No confundir una opción disponible con una entrega ya preparada para público.
6. Los tres registros heredados llevan estado HEREDADO, fuente y fecha. Eso no equivale a revalidación factual. El motor comprueba pertenencia de zona, no certifica fuente/fecha/estado. Continúa pendiente Senda/Astra para los trece, incluidos los tres heredados.

Estos cambios quedan reconocidos a nivel de código e integridad. No se vuelven a pedir las correcciones anteriores como si no existieran.

## Un defecto nuevo y acotado: caché de candidatos

Archivo: app/interfaz.js, función pintarCandidatos(med).

Al pasar de varios candidatos a cero o uno, se vacían los botones de cajaCand pero se conserva data-firma. Al volver exactamente al mismo conjunto, la comparación de firma sale antes de reconstruirlos. El botón principal queda configurado para avisar sinCandidato; la vía de elección espacial pierde sus botones. La vía alternativa de señales sigue siendo independiente.

Reproducción independiente de la función original extraída, ejecutada en Node con un doble mínimo de DOM; NO es una ejecución en navegador ni prueba de alcance geométrico de una escena:

| Entrada | Botones generados | data-firma |
|---|---:|---|
| A,B examinables | 2 | A,B |
| Ninguno examinable | 0 | A,B |
| A,B examinables otra vez | 0 (deberían ser 2) | A,B |

La lectura del código muestra el mismo riesgo con la transición varios → uno → mismos varios. Además, cuando permanecen los mismos IDs, la salida temprana evita refrescar textos de posición o idioma.

## Orden de patch a Claude Design

Trabajar sobre esta rev.1; conservar juego de assets, escenas, geometría, NAVY y correcciones anteriores. No rehacer el producto.

- Invalidar data-firma cuando se vacía el contenedor por cero/un candidato u objetivo fijado, o reconciliar los nodos por ID con una comprobación equivalente.
- Con los mismos candidatos, conservar nodos/foco y actualizar copy neutro, posición e idioma en su sitio.
- Verificar varios → cero → mismos varios y varios → uno → mismos varios: reaparecen todos los botones y cada uno examina su propio candidato.
- Verificar que mover el haz sin cambiar el conjunto no destruye el botón enfocado. Comprobar también ES/EN con el mismo conjunto.
- Entregar ZIP nuevo, SHA256, manifest y evidencia acotada. No modificar silenciosamente el ZIP identificado arriba.
- Las pruebas con fixture deben quedar en pruebas/, sin añadir animales a meso-01 ni falsear datos de zona.

## Retest Axioma

Axioma debe recibir el binario exacto de la nueva entrega y comprobar su hash antes de emitir gate. Esta orden en GitHub no activa otra sesión ni demuestra que haya recibido el ZIP.

Revisar el patch anterior en navegador y las correcciones ya entregadas: recorrido Tab/Enter con identidad de nodo estable; rechazo real de Examinar cuando aria-disabled=true; retirada del álbum; cuerpo fuera de viewport; cuatro bordes del visor ampliado; correspondencia por zona sin activar otro tramo; registro visual luz/oscuro de los assets candidatos. Conservar el canon NAVY y comprobar 320/390/1440 y texto 200%.

La evidencia de Claude qa5-resultados.json y qa6-resultados.json se recibe como evidencia del autor. FOCO-1/2 sí usan Tab/Enter; otras secciones usan clicks. Nexo no ha repetido esas pruebas de navegador. El canvas Design es otro runtime y no hereda aprobación de este ZIP.

Secuencia: PATCH CACHE → AXIOMA EXACT ZIP RUNTIME QA → HUMAN QA MARÍA.

Prototipo aislado autorizado. NO MAIN · NO PUBLIC DEPLOY. Cambiar modoEquipo y borrar pruebas no sustituye validación factual, Axioma ni autorización de publicación. No esperar nuevos peces para corregir/probar los tres actuales.
