# Revisión de mi práctica Fósiles R01

Nexo · 2026-10-06

**Resultado: NEXO_FOSSILS_PRACTICE_R01_SELF_REVIEW_REWORK_REQUIRED.**

El prototipo tiene una base técnica aprovechable, pero todavía no demuestra una experiencia de descubrimiento suficientemente bien resuelta. Reproduje fallos de interacción que mis pruebas de entrega no buscaban. No corresponde presentarlo como listo para integrar.

## Objeto y método

Artifact revisado: `NEXO_FOSILES_PRACTICA_R01.zip`, SHA-256 `21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c`. El ZIP y sus 55 archivos manifestados permanecen intactos.

Leí HTML, estilos, modelo, runtime, datos, generador y banco de pruebas. Inspeccioné la imagen original de Dimetrodon y contrasté sus anclajes. Ejecuté nuevas secuencias de eventos sobre el código entregado en un DOM simulado con Canvas nativo. Para observar resultados se añade en memoria un getter de estado; las acciones se envían mediante los manejadores de la interfaz, sin asignar estados internos ni modificar los archivos del producto. `reproduce.cjs` y `REPRODUCTIONS.json` permiten repetirlo.

No se ejecutó un navegador real. No afirmo haber probado CSS, lector de pantalla, touch, foco nativo o reflow. La indisponibilidad de control-browser sigue limitando esa parte conforme al skill Sites. Los defectos que siguen son reproducción de lógica o inspección de código/asset, no una auditoría de conformidad ni HUMAN QA.

## Defectos reproducidos

| ID | Hallazgo | Evidencia | Efecto y prioridad |
|---|---|---|---|
| R00 | Preparación y mensaje se contradicen | Tras despejar todas las muestras del trilobite, cobertura muestreada = 1, pero solo una región cumple featureVisible. `step()` anuncia que puede examinar porque no quedan muestras pendientes; `examine()` lo rechaza porque exige dos regiones. | Bloqueo de la vía por pasos en ese estado y mensaje engañoso. Alta. |
| R01 | Se identifica fuera de la vista | Despejar el trilobite, pasar a Explorar, desplazar la cámara. Su borde derecho queda en x = −295,32 px respecto a la escena. Examinar identifica igualmente. | La selección antigua sigue operando aunque la pieza ya no está visible. Alta. |
| R02 | La herramienta de teclado trabaja fuera de pantalla | Desde el primer indicio del Triásico, mover la herramienta con flechas hasta el segundo. Enter modifica 80 celdas de máscara y selecciona Plateosaurus; el punto proyectado está en (1565, 622) para una escena de 850×560. | Se actúa sin ver el objetivo ni la consecuencia. Alta. |
| R03 | Se pierde el anuncio útil al acabar un clic | Al alcanzar el umbral mediante pulsaciones, la ficha dice «Ya puedes observar los detalles», pero el estado live acaba en «Se ha retirado cobertura en la zona elegida». | El mensaje de preparación emitido por applyBrush se sobrescribe en pointerup. Problema de feedback; efecto exacto en lector pendiente. Media. |
| R04 | Cambiar de idioma da instrucciones del modo equivocado | Cambiar ES→EN estando en Despejar mantiene ese modo, pero el estado dice «Drag to explore the rock. Click to select a clue; then uncover it». | Se invita a arrastrar para explorar cuando arrastrar despeja. Media. |
| R05 | «Esta zona» no es necesariamente la seleccionada | En Mamut se selecciona (1378, 777,4). El botón despeja (1157,5, 580,22): a 295,81 unidades del punto. | step() elige la primera muestra pendiente de la pieza e ignora point. El nombre del control promete una correspondencia que no existe. Alta de producto. |
| R06 | El selector de movimiento carece de efecto propio | NORMAL/REDUCED/NONE no se consultan en cámara o dibujo. onchange cancela el gesto y solicita render. | No hace falta inventar animación; sobra ofrecer tres comportamientos inexistentes. Media de producto. |

R00 no significa que la imagen esté visualmente despejada al 100 %. Significa que **todas las muestras de la malla** están despejadas. Es precisamente el desacuerdo entre muestras puntuales, regiones y mensajes lo que causa el fallo.

## Defecto de contenido y criterio de descubrimiento

El generador asigna tres puntos por la proporción horizontal/vertical de la imagen y busca muestras opacas cercanas. No localiza dientes, venas, articulaciones ni regiones anatómicas. Sin embargo, les asigné nombres anatómicos específicos.

Ejemplo inspeccionado: la imagen de Dimetrodon mide 420×540. «Cuerpo de la vértebra» está anclado en (230, 296), dentro del tramo alargado que se ve en la ilustración; el cuerpo ensanchado se representa más abajo. La geometría genérica no respalda esa etiqueta. **Conservar el asset aprobado no hace correctas las anotaciones nuevas.**

El criterio de 48 % y dos de tres puntos fue elegido para permitir el recorrido. No está justificado por legibilidad perceptual ni por reconocimiento de cada resto. Debí marcar regiones observables específicas y comprobarlas visualmente antes de convertirlas en condición del producto. Las muestras toman toda opacidad del PNG; cuando hay losa o soporte, no distinguen soporte y resto.

## Mi evaluación de producto

Estas son conclusiones de revisión experta propias, pendientes de contrastar con uso real:

- **El bucle se apoya demasiado en rascar hasta que se habilita una ficha.** Cada pieza ofrece información distinta, pero la interacción no aprovecha suficientemente qué hace interesante observarla. No propongo convertirlo en preguntas de examen: el descubrimiento debe ayudar a apreciar formas, huellas y conservación mediante acciones comprensibles.
- **La asistencia es demasiado mecánica.** La secuencia por pasos necesita 4–21 pulsaciones. Llegar al final demuestra alcanzabilidad, no comodidad ni curiosidad. Las alas son un caso concreto a revisar.
- **La jerarquía todavía no está probada.** Hay cambio de sector, dos modos, ayuda, colección, zoom, centrado, paso, examen, salto de indicio y selector de movimiento. Tenerlos implementados no prueba que la primera acción resulte evidente. No medí el viewport completo en navegador.
- **La selección conserva una caja rectangular incluso sobre transparencia.** Puede servir como tolerancia de pulsación, pero hoy no distingue un indicio visible de una zona cubierta o vacía de esa caja. Falta decidir y probar esa tolerancia, no simplemente reducir el target.
- **La información contextual necesita un cierre editorial.** Las fichas heredan textos y nombres de instituciones; no constituyen una nueva validación de datos ni aportan una trazabilidad precisa de las anotaciones añadidas.

## Qué conservaría

Los 14 assets originales y su asociación con los datos; fuentes locales y canon NAVY; cámara y máscara separadas; cobertura por sector; selección con puntero directo; ausencia de movimiento de cámara por hover; cambio de idioma sin reiniciar; conservación de progreso durante la sesión; separación de despejar, identificar y profundizar; colección opcional.

Estas partes reducen trabajo de corrección. No anulan los defectos anteriores ni equivalen a un PASS de producto.

## Qué no demostraban mis pruebas anteriores

El banco pulsaba la lista de indicios y repetía Paso→Examinar hasta conseguir cada identificación. No demostraba un recorrido humano completo con ratón. El test de arrastre solo comprobaba que no apareciera la identidad; no comparaba la máscara antes y después. Tampoco probaba la discrepancia de regiones con muestras, la pieza fuera de vista, la herramienta fuera de pantalla ni el respeto al punto elegido.

El fixture no tiene layout, navegación Tab nativa, aislamiento de modal ni accesibilidad real. Que su función focus cambie una variable no demuestra que el foco sea correcto en navegador. Esto ya estaba advertido en la entrega, pero la falta de cobertura conductual seguía siendo mía.

**Aprendizaje:** diseñé comprobaciones de finalización antes de comprobar las invariantes de la interacción. Las nuevas pruebas deben preguntar qué nunca debe suceder: actuar fuera de la vista, revelar con un estado incoherente, despejar en otro lugar sin comunicarlo o nombrar un rasgo donde no está.

## Contraste con documentación

1. W3C, SC 2.5.7, Dragging Movements: la alternativa sin arrastrar y la operabilidad con teclado se evalúan por separado. Tener flechas de teclado no basta para justificar la alternativa de puntero. Aquí existen pasos y saltos a indicios, pero falta justificar equivalencia para la navegación libre. No propongo volver a imponer flechas al ratón: puede resolverse con selección de destino o un mapa de navegación accesible.
   https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html
2. W3C, SC 4.1.3, Status Messages: el estado debe poder comunicarse programáticamente. aria-live por sí solo no arregla que la aplicación publique un mensaje incorrecto o sobrescriba el pertinente. La lectura real aún hay que probarla.
   https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
3. W3C, SC 3.1.2, Language of Parts: el idioma requiere atención también a textos y nombres accesibles. Inspección secundaria: el salto «Ir a la exploración», el grupo «Herramienta» y el output «Ampliación» permanecen en español cuando document.lang cambia a en. No se ha verificado con lector.
   https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html
4. Nielsen Norman Group, Direct Manipulation: acciones sobre objetos visibles y respuesta perceptible ayudan a relacionar acción y resultado. R02 y R05 contradicen esa relación en mi implementación. Es guía de usabilidad, no requisito legal ni certificado técnico.
   https://www.nngroup.com/articles/direct-manipulation/

Los documentos Understanding explican criterios WCAG. Este análisis no determina obligaciones jurídicas ni declara conformidad de la web.

## Orden de corrección propuesto

1. Unificar la decisión de preparación y sus mensajes. La vía por pasos debe buscar regiones todavía necesarias y nunca prometer examen cuando el mismo estado lo rechaza.
2. Aplicar un contrato común de objetivo visible a ratón, teclado, pasos y examen. Reencuadrar solo mediante una acción explícita y predecible, o limitar la herramienta a lo visible. No movimiento automático siguiendo al puntero.
3. Hacer que «esta zona» respete el punto elegido, o renombrar y mostrar claramente un avance asistido a otra región. Elegir una semántica consistente.
4. Revisar manualmente los anclajes de los 14 fósiles contra sus imágenes; separar soporte y resto; justificar regiones y umbral por legibilidad, sin añadir exámenes ni modificar assets aprobados.
5. Simplificar controles, retirar el selector sin efecto y publicar un único estado coherente tras cada acción. Completar traducciones.
6. Probar primero tres geometrías representativas —caparazón, espina y ala— en navegador y con uso real; extender después a las catorce. Comprobar también todas las regresiones reproducidas, touch, teclado, reflow y lector.

La revisión no modifica R01 ni crea una supuesta R02 corregida. Deja evidencia y un alcance de rework concreto. No main, no publicación, no delegación de mi práctica a Prisma o Axioma.
