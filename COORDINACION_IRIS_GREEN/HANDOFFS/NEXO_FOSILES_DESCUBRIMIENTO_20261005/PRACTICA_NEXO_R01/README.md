# Fósiles · práctica de Nexo R01

Extrae el ZIP completo y abre `index.html`. No hay instalación, servidor, cuenta ni servicios externos. El paquete está preparado para abrirse localmente; esta entrega todavía no tiene prueba en un navegador real.

## Qué puedes hacer

Recorrer una superficie de roca, seleccionar directamente un indicio, retirar cobertura en esa zona y examinar el resto que aparece. Después puedes ampliar su ilustración, consultar la información y guardarlo en Mis hallazgos.

- **Explorar:** arrastrar mueve la vista; un clic selecciona la zona. Mover el puntero sin pulsar no mueve la cámara.
- **Despejar:** arrastrar o pulsar retira cobertura donde actúas.
- **Sin arrastrar:** Acercar al siguiente indicio o la lista de indicios; Despejar esta zona; Examinar. Cada paso descubre una región local de la pieza.
- **Teclado:** Tab hasta la escena; flechas mueven vista o herramienta según el modo; Enter/Espacio seleccionan o despejan; E examina; +/− amplían; Escape vuelve a Explorar. La lista de indicios y los botones ofrecen la ruta alternativa.
- Cambiar de sector conserva lo retirado. El progreso dura mientras la página permanezca abierta; **recargar lo reinicia**.

Son los **14 fósiles originales**, repartidos en seis sectores con piezas. No se incorpora el sector Paleógeno vacío ni se amplía el catálogo. El agrupamiento es didáctico, no un yacimiento real ni una afirmación de coexistencia.

## Decisiones de esta práctica

Autor de la implementación: Nexo. Es mi ejercicio independiente; no es el prototipo de Prisma, ni una implementación delegada a Claude, ni una revisión aprobatoria de Axioma.

Contrato: explorar → localizar → despejar → observar → examinar → identificar → profundizar. Ningún nombre de especie aparece en la interfaz antes de Examinar esa pieza. La información existe en los archivos locales: no hay una pretensión de ocultación de datos a quien inspeccione el código.

La cobertura pertenece a coordenadas del mundo, no a píxeles de pantalla. Cámara, máscara e identificación son estados distintos. El dibujo usa borrado local `destination-out`; una malla independiente comprueba exposición sobre muestras opacas del fósil. Examinar identifica cuando al menos el 48 % de esas muestras y dos de tres zonas de observación están expuestas. Es un umbral de interacción, no un criterio paleontológico. Repetir un gesto sobre un área ya despejada no suma progreso ficticio.

Los tres modos de movimiento son inmediatos y sin animación autónoma en R01. Cambiar el selector no introduce diferencias visuales: no se simula un efecto inexistente. El render solo se solicita tras una acción o cambio de tamaño. No hay sonidos, cuenta atrás, puntuación, respuesta obligatoria ni premio por completar una colección.

Canon NAVY: fondo #0B1A2B; panel #15304A; texto #EEF4F8; secundario #C9D5DD; enlaces #9FDCEA; foco #C3B8FF. Atkinson Hyperlegible y Newsreader locales, con licencias OFL. Las fuentes se incrustan también en CSS para no depender de la política de carga de WOFF2 relativos bajo file://.

## Procedencia y alcance factual

Base: `FOSILES_PILOTO_R2v4_PARA_SUBIR_3.zip`, SHA-256 `e321b32d4d2a9d16c4df6a99da7e956543ceba5b0666919e6b8e48adac7a4ff1`.

Se reutilizan los WebP sin modificar sus bytes. `procedencia/datos-originales.json` conserva el índice fuente. `procedencia/PROCEDENCIA.md`, `GOBERNANZA.md` y `MANIFEST.sha256` describen **el paquete histórico**, no esta entrega ni sus pruebas. El manifiesto de esta entrega es `HASHES.sha256` en la raíz.

Los textos de edad, conservación, especie, lugar y referencias se heredan del paquete. Esta práctica no constituye una nueva verificación científica. Las imágenes son representaciones procedimentales, no fotos de especímenes de museo. Los puntos de observación son anclajes aproximados de interacción: no están validados como localización anatómica exacta. Sus textos describen rasgos de la ilustración y no se ofrecen como diagnóstico científico.

## Verificación realizada y pendiente

`NOTAS_DE_PRUEBAS.md` separa las pruebas del modelo y la ejecución del código en un DOM simulado de lo que falta probar en navegador y con personas. **No se emite TECHNICAL_PASS de navegador, PRODUCT_PASS, conformidad WCAG ni HUMAN QA PASS.**

No se ha tocado main, publicado un sitio ni modificado Sabik. Los archivos de pruebas no son parte del recorrido de la página.

## Documentación estudiada

- MDN, composición de Canvas: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
- W3C, diálogo modal nativo y foco: https://www.w3.org/WAI/WCAG22/Techniques/html/H102
- W3C APG, patrón de diálogo: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

Aplicación concreta: máscara local con composición; modal nativo con retorno al control de origen. Consultar documentación no valida por sí solo el resultado.
