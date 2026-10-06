# Nexo · Cielo nocturno completo R01 · Interacción, formato e investigación
Fecha: 2026-10-06.
Dictamen: KEEP_CORE · REWORK_CONTINUITY_SELECTION_AND_INFORMATION.
Propuesta para Claude basada en análisis; no cambios de runtime, assets, main o despliegue.

## 1. Base exacta y método
DESCUBRIMIENTO_CIELO_COMPLETO_R01.zip:
SHA256 eaa15fcc98157f4d7f26c874a74d9d50bc8bc63061ca81067c56b66f01512bd6.
9 921 177 bytes; 320/320 hashes verificados de nuevo.
12 campos, 88 fichas y sus SVG/PNG en la entrega.

Orden de trabajo cumplido: análisis de fuente/datos/capturas → contraste externo → propuesta.

Se revisaron motor.js, interfaz.js, config.js, copia.js, index.html, CSS, ficha Orión y pruebas. Inspección visual de capturas ENTREGADAS 1440-01-portada, 1440-05-ficha y 390-despues-de-identificar; no son nuevas capturas de Nexo.

Antecedente independiente:
COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CIELO_COMPLETO_R01_20261006/REVISION_NEXO.md y reproducciones del commit 0ed13c9029e8b50efe5ab9e79500a0e3aa89b195.
Las funciones originales se ejecutaron nuevamente para casos adicionales en interaccion-formato.cjs; resultados adjuntos.

Límites: fixtures Node sin DOM nativo, no prueba física multitouch, no lector de pantalla real ni verificación independiente de los 40 checks del autor. No se afirma haber revalidado todo el catálogo astronómico. El 88/88 geométrico no es recorrido humano completo.

## 2. Qué se conserva
- Selección directa por coordenada del clic; mover ratón sin pulsar no mueve el cielo.
- Arrastrar mueve cámara y no identifica. Flechas físicas del teclado, sin cruceta direccional principal.
- Identificación por acción explícita, datos locales y orientación compartida por render/detección.
- Dos etapas del cinturón y figura completa de Orión.
- Arquitectura de 12 campos, datos reales y assets aprobados; no redibujar 88 constelaciones.
- NAVY, fuentes locales, perfiles NORMAL/REDUCED/NONE y ausencia de animación ambiental innecesaria.

Círculo: todavía existe para teclado y para marcar examen sin hallazgo. El ratón ya no necesita llevar el cielo a ese círculo. No comunicar «círculo eliminado de todo el producto».

## 3. Hallazgos de código y pruebas

### C01–C04 · Continúan pendientes sobre este mismo R01
- C01: tras identificar una constelación general no se recalcula objetivo/pista. Reproducción anterior con Dra: descubierta, pero objetivo Dra y ocho pendientes.
- C02: pista global del cinturón permanece al cambiar campo o avanzar objetivo. Dos consignas simultáneas visibles en captura.
- C03: cargas fuera de orden pueden mezclar campoId/metadatos con figuras de otro campo. Aislar solicitud vigente, callbacks de ficha, salida de escena y animaciones.
- C04: siete grupos de pistas idénticas dentro de un campo. No son pistas discriminativas de un objetivo único. «Magnitud 2.2» no se reconoce visualmente como cifra sin aprender el concepto.

### C05 · Multitouch no está resuelto
pointerdown reemplaza puntero activo sin rechazar segundo contacto ni mantener conjunto de contactos.
Fixture de listeners originales: dedo 1 down → dedo 2 down → dedo 2 up provoca examinar en (300,100).
Esto demuestra que la secuencia no suprime el clic; no prueba un pellizco en teléfono real.
Corrección: definir gesto de dos dedos si se ofrece pinch; cualquier gesto multitouch debe suprimir selección al finalizar. Si no se implementa pinch, ignorar/cancelar segundo contacto de forma segura y conservar +/−.

### C06 · Visibilidad distinta según vía
M.examinar excluye franja de horizonte y oclusores; estrellaEn no los recibe ni filtra. La interfaz consulta estrellaEn antes de examinar.
Fixture con estrella real del campo 06, constelación CMa marcada descubierta: punto (500,570), escenario 1000×600, horizonte lógico desde y=516. examinar('puntero', punto) abreEstrella, pese a estar bajo la franja.
estrellasEnZona también cuenta esa estrella en la descripción.
Corrección: criterio compartido de visibilidad para render pertinente, selección de estrellas, patrones y descripción; excluir fuera de viewport y UI oclusora. Retest de geometría del horizonte real, no sólo rectángulo aproximado.

### C07 · Botón y clic no significan lo mismo
«Examinar esta zona» siempre examina el centro; clic examina coordenada. Después de un clic fallido puede quedar marcada otra zona, por lo que «esta» es ambigua.
Además, origen botón intenta enfocar btn-revelar también en hallazgo general, donde ese botón sigue oculto. Es llamada incorrecta por lectura de fuente; efecto real sobre foco pendiente de navegador.
Propuesta: botón contextual usa selección vigente. Para vía de centro del teclado, rotular «Examinar el centro». No hacer obligatorio el centro para ratón. Destino de foco según control realmente disponible.

### C08 · El zoom se hace respecto al centro
ampliar cambia zoom y conserva u/v; rueda no usa posición del puntero.
Caso geométrico: punto (800,400) pasa a (875,425) al aumentar 1→1.25 en 1000×600, desplazamiento 79.06 px.
No es un fallo normativo, pero obliga a reencontrar lo que se quería ampliar.
Propuesta: zoom de rueda anclado al punto señalado; pinch a su centro si se implementa. +/− centrado en selección o centro según contexto visible, sin recentrado sorpresa. Límites pueden impedir invariancia exacta: informar sin saltos.

### C09 · Continuidad del lugar y acciones secundarias
- guardar persiste descubiertas y campo, no cámara/zoom; abrirCampo reinicia cámara. «Continuar» significa hoy continuar campo, no observación exacta.
- Cuaderno→ficha llama abrirCampo y resetea cámara incluso si corresponde al mismo campo.
- Fuentes desde portada abre primero campo inicial: consultar procedencia cambia contexto.
- Reiniciar experiencia borra todo en una pulsación. Separar «Restablecer vista» de «Borrar hallazgos», con confirmación o deshacer de borrado.
Son observaciones de código; verificar recorrido nativo/foco antes de cerrar corrección.

## 4. Diagnóstico visual/editorial
### Portada
Doce tarjetas con títulos como Norte medio repetidos, números de campo, meses y barras. Organizan datos, pero ayudan poco a elegir una experiencia.
Propuesta: entrada principal «Explorar el cielo», continuar visible sólo si procede y «Elegir otra zona» secundaria. Selector con pequeñas vistas reales del campo sin líneas ni nombres de hallazgos pendientes. Conservar una alternativa en lista. No crear una nueva home que compita con el área Descubrimiento.
Los meses no deben presentarse como visibilidad local sin condiciones. Seguir «Vista preparada para observar»; no «Tu cielo ahora».

### Escena
En la captura 390 el escenario empieza aproximadamente en y=344; varias filas previas consumen la atención. Escena, CTA y ayuda deben verse como una sola tarea.
- Cabecera de portada 40–56 px según canon; dentro de experiencia, título secundario compacto de Newsreader, una pista activa y navegación breve.
- Estado de hallazgos discreto y opcional; no convertir exploración en checklist permanente.
- Ayuda y ajustes localizables, sin instrucciones extensas arriba.
- En vista de observación sin profundidad: objetivo SKY ≥70 % de área útil; definir área como viewport menos cabecera global persistente, medir intersección realmente visible y restar UI opaca/horizonte. No usar porcentaje de documento o height:62vh como prueba de cumplimiento.
- A 200 %, priorizar lectura y controles completos; documentar límites sin encoger fuentes/targets.
- «Ampliar vista» opcional puede dar más espacio; no imponer fullscreen para resolver diseño normal.

### Hallazgo y ficha
Captura 1440-05: panel de 340 px superpuesto sobre parte de figura. Cabecera conserva pista anterior mientras ya propone otra; ficha abre un bloque largo con magnitudes/tabla.
Propuesta: primer hallazgo ligero: nombre, rasgo observado, una frase útil; acciones claras «Ver figura» cuando proceda, «Conocerla» y «Seguir explorando».
Desktop: panel lateral que no tape el objetivo, preferentemente espacio reservado. Preservar dirección y escala aparente; no deformar proyección al cambiar dimensiones. Sólo encuadrar completo mediante acción explícita.
Móvil: resumen inmediatamente bajo el cielo y profundidad desplegable; cierre devuelve mismo encuadre y foco. No tapar el patrón ni obligar a recorrer la ficha entera.
Profundidad en secciones: Cómo reconocerla / Estrellas / Figura y región / Visibilidad / Fuentes. Tabla estrecha sustituible por filas apiladas nombre→brillo→distancia, sin perder asociaciones; no reducir tipografía para que quepan cuatro columnas.
Completar ES/EN editorial: la ficha Orión tiene descriptor «El cazador» y repite la pista en Cómo reconocerlo; no equivale a una explicación completa. Contexto cultural null se mantiene sin invención. «Información aún no disponible» donde sea útil; procedencia técnica al README/fuentes, no texto sobre «datos entregados» en el recorrido.

## 5. Investigación y aplicación
### S1 · Stellarium: selección y encuadre son acciones distintas
FAQ oficial: ratón/flechas para moverse, clic para seleccionar, acción distinta para centrar.
https://github.com/Stellarium/stellarium/wiki/FAQ
Aplicación: mantener clic directo y cámara estable; «Encuadrar» voluntario. No copiar toda la consola ni su revelado inmediato de nombres.
Se consultó FAQ; la guía HTML completa falló por tamaño, no se afirma haberla leído íntegra.

### S2 · IAU: región, dibujo y perspectiva
La IAU define regiones con límites; no un único dibujo oficial de líneas. Las estrellas de una figura pueden estar a distancias muy distintas.
https://iauarchive.eso.org/public/themes/constellations/
Aplicación: tras identificar, permitir alternar cielo/figura/región de lo descubierto. Explicar figura vs región con texto breve. Profundidad puede comparar distancias del catálogo con incertidumbre declarada; no afirmar que forman un grupo físico ni construir 3D inventado.

### S3 · NASA Night Sky Network: patrones como entrada
Los asterismos facilitan reconocer figuras; cinturón, carro o grandes patrones pueden ser partes de una constelación o abarcar varias.
https://science.nasa.gov/solar-system/skywatching/night-sky-network/connecting-the-dots-with-asterisms/
https://science.nasa.gov/skywatching/faq/
Aplicación: variedad de observación sustentada en geometría: alineación, curva, cadena, relación con patrón ya conocido, contraste de brillo/color cuando realmente sea legible. No 88 minijuegos ni 88 pistas automáticas casi iguales. Star-hopping opcional después de reconocer una referencia; sin flecha que revele automáticamente el destino.
La visibilidad real requiere lugar, fecha y hora; los campos siguen siendo preparados. Uso de fuentes NASA para investigación, sin introducir assets NASA ni cambiar el corpus visual aprobado.

### S4 · NN/g: información progresiva
https://www.nngroup.com/articles/progressive-disclosure/
Mostrar opciones esenciales y hacer accesible profundidad bajo petición. Aplicación concreta: escena+acción+feedback; datos extensos tras «Conocerla». Esto no autoriza esconder información necesaria ni añadir niveles de navegación interminables.

### S5 · W3C: alternativa de puntero a drag y gestos complejos
https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html
Teclado no sustituye la alternativa de puntero simple al arrastre/pinch.
Propuesta: «Mover vista sin arrastrar» permite señalar en una vista general el punto que se quiere centrar; +/− permanecen. Sin reintroducir cruceta principal ni una retícula que se deba perseguir. Evaluar tamaño efectivo y cobertura de esa alternativa.

Las decisiones de layout, umbrales y pilotos son propuestas Nexo que requieren observación de uso; estas fuentes no certifican el producto.

## 6. Secuencia propuesta para Claude

### A · Patch de continuidad antes de embellecer
C01–C03 y C05–C07; retest foco/carga al abrir, cerrar y cambiar campos. Reinicio seguro y coherencia de estado. C18 sigue como prueba geométrica, añadir recorridos completos desde controles reales.

### B · Unificar interacción
- Clic/tap: acción en punto indicado, selección/hallazgo explícitos; sin arrastre de círculo.
- Drag: cámara, nunca confirmación.
- Flechas físicas/+−/Enter: equivalencia de teclado.
- Zoom que conserva punto señalado; multitouch con cancelación correcta.
- Feedback neutral distingue «no he reconocido un patrón aquí» de «tu objetivo no coincide». R01 reconoce cualquier candidata aunque copy diga «ese patrón».
- Si varias candidatas son ambiguas, pedir selección más concreta con descripciones neutrales; no premiar otra distinta por desempate oculto.
- Seguir explorando, cerrar ficha, cambiar idioma/movimiento conservan contexto. Historial de cámara para volver, separado de borrar progreso.

### C · Formato y contenido
Compactar entrada de escena; ficha breve/profundidad por secciones; evitar oclusión del objetivo. Pistas ES/EN basadas en lo visible, sin cifras de magnitud como requisito de entrada. Orden de objetivos por legibilidad/contraste y contexto, no simplemente primer array. Permitir ignorar pista y explorar.
Alternar líneas/región sólo de lo ya descubierto sin deshacer hallazgo. Un nombre latino, genitivo y tabla no sustituyen explicación comprensible.

### D · Piloto sobre contenido existente
Elegir del inventario real casos de: patrón reconocible, figura extensa, región débil y campo concurrido con pista ambigua. Añadir caso Orión de dos etapas y volver desde Cuaderno. No imponer nuevas constelaciones ni nuevos assets.
Medir primer gesto, identificación intencional vs accidental, utilidad de pista, claridad del siguiente paso, pérdida de orientación, lectura móvil y continuidad tras volver.
No construir todo el rediseño de 88 fichas antes de comprobar formato con una muestra representativa.

## 7. Canon y aceptación
Conservar tema único NAVY:
fondo #0B1A2B; panel #15304A; superficie #1D3D5C; texto #EEF4F8; secundario #C9D5DD; enlace #9FDCEA; foco/acento #C3B8FF; borde #8494A8; separador #2A4460; principal #DCE8F2 con texto #0B1A2B.
Atkinson Hyperlegible cuerpo 1rem/1.6; Newsreader títulos 600/1.2; portada 400,40–56px/1.06; intro ~19px/1.58. Targets ≥44px y foco independiente del seleccionado.

Pruebas:
- dos hallazgos consecutivos y final de campo; cuaderno→regreso; guardar/recargar y cámara según contrato;
- ninguna respuesta obsoleta tras navegación rápida;
- selección sin hover/drag/cancel/multitouch accidental; imposible seleccionar detrás del horizonte/UI;
- descripción equivalente a visibilidad y pistas;
- 320/390/1440, texto 200 %, panel/tabla/avisos, idioma y forced-colors; clipping interno, no sólo overflow global;
- lector y teléfono físicos declarados por separado; NORMAL/REDUCED/NONE preservan contexto;
- prueba humana de reconocimiento y claridad. No equiparar 320 hashes ni 88 hit-tests con HUMAN QA.

Propuesta lista para contraste con Prisma/Axioma/María; no gate de implementación aprobada ni despliegue.
