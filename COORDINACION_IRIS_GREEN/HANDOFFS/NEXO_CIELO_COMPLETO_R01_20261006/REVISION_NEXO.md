# Nexo · Cielo completo R01 · revisión independiente

Fecha: 2026-10-06. Solicitud de María: analizar la entrega completa y comprobar especialmente selección directa, círculo y flechas.

## Artefacto y alcance

`DESCUBRIMIENTO_CIELO_COMPLETO_R01.zip`, SHA256 `eaa15fcc98157f4d7f26c874a74d9d50bc8bc63061ca81067c56b66f01512bd6`, 9 921 177 bytes. 320/320 entradas de SHA256SUMS verificadas. El ZIP contiene 321 archivos contando el propio listado de hashes.

Lectura de HTML, motor, interfaz, datos y banco de pruebas; inspección de capturas entregadas; ejecución independiente en Node del motor y de funciones/listeners originales en fixtures. Se acompañan `verificar.cjs` y `RESULTADOS.json`. Las capturas son evidencia del autor, no nuevas capturas de Nexo. Los colaboradores visuales de las funciones probadas se sustituyen por stubs; no equivalen a DOM o navegador nativos.

No se ejecutó aquí el banco de navegador ni se certifican sus 40 resultados. El entorno no dispone del control-browser requerido para esa verificación. No se revalida científicamente el catálogo, la proyección ni la correspondencia de todas las figuras; tampoco se verifica comodidad perceptual, lector de pantalla o teléfono físico.

**Dictamen de Nexo: conservar la implementación y corregir continuidad de objetivos, cabecera y aislamiento de carga; revisar la utilidad de las pistas. No constituye un gate de Axioma ni HUMAN QA PASS.** No se modifica el ZIP, main ni el despliegue.

## 1. La corrección de interacción solicitada sí está

| Acción | Implementación comprobada | Evidencia |
|---|---|---|
| Señalar con ratón | Clic usa la coordenada pulsada, no el centro | Listener original ejecutado: clic global 310,220 sobre lienzo con origen 10,20 entrega punto 300,200 |
| Mover el puntero sin pulsar | No mueve ni examina | Fixture del listener pointermove sin pointerdown |
| Arrastrar | Mueve cámara; no identifica al soltar | Listener original, separación a 6 px |
| Flechas | Teclas físicas con el escenario enfocado | Lectura de keydown; no cruceta direccional en HTML |
| Zoom | Botones +/−; rueda condicionada al foco | Lectura de HTML/listeners |
| Cancelar gesto | pointercancel no confirma selección | Lectura del listener |

El círculo no ha desaparecido de todos los estados, y no debe afirmarse así: aparece como referencia central de teclado o marca de una zona pulsada sin hallazgo. El ratón ya no tiene que llevar el cielo al centro. El botón «Examinar esta zona» sigue examinando el centro y activa la referencia de teclado, incluso si se pulsa con ratón; conviene explicitar ese destino para no confundirlo con la última zona señalada. El evento focus del escenario activa la referencia sin distinguir modalidad; esto merece retest en navegador, no lo declaro como fallo visual reproducido.

## 2. Hay contenido real para las 88

Verificados 12 campos, 88 identificadores únicos, 88 fichas y existencia de 88 SVG y 88 PNG enlazados desde sus fichas. El motor reconoce las 88 al situar programáticamente la cámara en posiciones de ensayo, con área 1408×558. Es cobertura geométrica, no 88 recorridos de usuario.

La interfaz de profundidad sí expone explicación, reconocimiento, rasgos, estrellas principales, magnitudes, distancias, figura/región, material visual y fuentes. Es una ampliación sustancial respecto al prototipo de Orión. La captura entregada `1440-05-ficha.png` muestra parte de esa profundidad. Los campos no documentados siguen pendientes, incluidos contexto cultural y parte del texto inglés, conforme a las notas del autor. Completo en inventario no significa completo editorialmente ni validado astronómicamente.

## 3. Correcciones necesarias

### C01 · La pista no avanza tras los hallazgos generales

**Reproducido con la función original `examinar`, el motor real y datos reales.** Campo 01, objetivo Dra. Antes: «Busca una estrella clara de magnitud 2.2… Quedan 8 por encontrar». Después: Dra figura como descubierta, pero `objetivoActual` sigue siendo Dra y el texto conserva 8 pendientes.

La rama general de `examinar()` actualiza hallazgo y contador de cabecera, pero no llama a `elegirObjetivo()`. La vía especial `revelar()` de Orión sí lo hace. El problema pertenece al recorrido general, no a una constelación concreta.

Patch: después de confirmar un hallazgo general, recalcular objetivo/pista; al agotar el campo mostrar su estado completo. Mantener las dos etapas de Orión. Verificar también descubrir una distinta del objetivo: conservar o recalcular la pendiente correcta sin repetir la ya descubierta.

Retest: dos hallazgos consecutivos y último hallazgo de un campo, sin salir/reabrir y sin escribir el estado desde pruebas. Afirmar texto, contador, objetivo y cuaderno, además de la geometría.

### C02 · Pista de Orión persistente en la cabecera

`index.html` contiene una introducción global `data-t="objetivo"` con «Busca tres estrellas brillantes casi en línea». Cambiar campo actualiza `#objetivo-campo`, pero no sustituye esa introducción. La captura entregada de la ficha ya muestra simultáneamente la pista global del cinturón y la nueva de cuatro estrellas.

Patch: hacer neutral la introducción general y mantener una única pista activa dependiente del estado; conservar el copy canónico del cinturón mientras sea el objetivo. Retest en otro campo, tras Orión y al cambiar idioma.

### C03 · Respuestas de carga fuera de orden mezclan campos

**Reproducido en fixture de la función original `abrirCampo`.** Solicitar campo 01 y campo 02, resolver la carga de 02 y después la de 01: `campoId` y metadatos quedan en 02, pero las figuras corresponden a 01. No se ha medido la frecuencia de esa condición en disco/navegador real.

Patch: identificar cada solicitud vigente e ignorar respuestas obsoletas; aislar también salida de escena, carga de fichas y animaciones pendientes. Durante carga no permitir que las acciones operen accidentalmente sobre el campo anterior. Retest con cargas deliberadamente retrasadas y navegación rápida.

### C04 · Una pista generada no garantiza una pista útil

Los datos contienen siete grupos de pistas idénticas dentro de su propio campo: Cnc/LMi; Aqr/Cap; Ind/Mic; Tel/Cir; Aps/Nor; Hor/Dor; Men/Cae/Ret. No impiden descubrir libremente, pero no distinguen el objetivo interno que el producto propone. El caso de Orión no demuestra que las otras 87 pistas orienten igual de bien.

Además, «estrella de magnitud 2.2» presupone reconocer un valor que no está rotulado antes del hallazgo; inferencia de producto a contrastar con María, no error del dato. Pedir una pista basada en forma, relación y brillo observable, contrastada contra los vecinos visibles. Si varias respuestas satisfacen la misma pista, asumirlo de forma explícita en el objetivo y feedback. No resolverlo mostrando nombres o líneas anticipadas.

## 4. Qué comprueba realmente C18

El banco abre campos mediante `IG_DEBUG.abrirCampo`, escribe directamente `estado.camara` y consulta `IG_DEBUG.examinarEn`. Este último llama al motor con un conjunto vacío de descubiertas: no ejecuta la transición de interfaz, no persiste hallazgo, no abre ficha y no avanza objetivo.

El resultado 88/88 es valioso como cobertura del algoritmo; no demuestra «88 identificadas mediante interacción real» ni una sesión que completa un campo. Precisamente C01 queda fuera de su alcance. Las notas del paquete explican parte de esta limitación: conservarla también en el resumen de entrega. Las pruebas táctiles emuladas en Chromium tampoco equivalen a un dispositivo físico.

Mantener C18 y añadir pruebas de integración para el recorrido completo. Separar en los informes: integridad, cobertura de datos, geometría, interacción, continuidad de sesión, accesibilidad y valoración de María.

## 5. Aprendizaje que Nexo incorpora

La ampliación de uno a muchos objetos exige comprobar el bucle de continuación, no sólo repetir el hit test. El estado pedagógico/observacional (qué busco) debe sincronizarse con el estado persistido (qué encontré). Una buena selección directa puede coexistir con objetivos obsoletos. Un número exhaustivo como 88/88 es válido sólo para el oráculo que lo produjo. La procedencia del dato y la utilidad de la pista son verificaciones diferentes. Las cargas asíncronas también deben respetar el contexto actual del usuario.

Reproducción: `node verificar.cjs /ruta/al/ZIP/extraido/DESCUBRIMIENTO_CIELO_COMPLETO_R01`. El script no altera la entrega; guarda resultados junto al propio script.
