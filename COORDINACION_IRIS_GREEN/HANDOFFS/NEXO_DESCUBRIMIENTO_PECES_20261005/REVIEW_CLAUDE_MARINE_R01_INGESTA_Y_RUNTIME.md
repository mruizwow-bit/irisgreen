# Nexo · recepción y revisión · Descubrimiento Peces R01
2026-10-05 · Issue #323

## Decisión
NEXO_MARINE_R01_RECEIVED_TARGETED_PATCH_REQUIRED

Se recibe un prototipo con HTML, motor, interfaz, datos y assets reales. Conservar la mecánica luz → observar → examinar → identificar → álbum. No rehacer el concepto ni esperar a terminar el catálogo. Todavía no hay PASS independiente de runtime ni HUMAN QA.

## Artifact exacto y alcance de esta revisión
- descubrimiento-peces-R01.zip
- Library: libfile_9d7dc20814548191b3d08473a14b6600
- SHA256: 2b30dd503014b0885c597b5644815a9431c8a00826eb28839e04e5aa78573429
- 22874197 bytes; ZIP CRC correcto.
- 54/54 entradas de MANIFEST_SHA256.txt verificadas por Nexo.
- 26 PNG, 13 pares; escena meso-01 con tres slots y lote-profundidad-01 con trece.
- Los cuatro JS de app pasan node --check.
- Nexo ha leído código, datos, pruebas e informes; no ha ejecutado este ZIP en un navegador ni probado el lienzo de Design. No hay navegador local instalado disponible para repetir aquí la ejecución.
- Los resultados Chromium incluidos son evidencia entregada por Claude, no una repetición independiente de Nexo. T06/T11 siguen parciales según las propias notas; no resumir como 14/14 PASS completo.
- La afirmación 78/78 corresponde al paquete fuente PNG/AVIF/WebP, no a este ZIP de 54 entradas verificables. No se ha repetido esa comparación con el manifest fuente de 78.

## 1. Procedencia de los seis PNG anteriores: aclaración resuelta
Los seis 1400×1000 no son binarios inventados ni una discrepancia sin origen.
Proceden del paquete Atlas MAR_22_MESO_PACKAGING_R01, registrado en:
COORDINACION_IRIS_GREEN/HANDOFFS/MAR_22_MESO_PACKAGING_R01/manifest.json
Leído en main; blob SHA 406d96066a0764c85faa4c906b1847f4b897f8b5.

El manifest describe extracción de celdas aprobadas, registro de pares, encuadre transparente 1400×1000 e ICC; declara ausencia de redibujo. Incluye referencias persistentes de los seis binarios bajo /Iris Green/Handoffs/Atlas/MAR_22_MESO_PACKAGING_R01/.
Nexo ha vuelto a comparar los seis PNG del encargo con sus seis hashes Atlas: 6/6 coinciden.

Corregir README/INFORME_INTAKE: son dos paquetes con procedencia y geometría diferentes. El índice general por carpetas no invalida el handoff Atlas. No atribuir a María una investigación pendiente de esta procedencia.

Los trece pares nuevos se conservan como candidata de prueba privada. Su sustitución definitiva no queda aprobada solo por tamaño de imagen o integridad SHA. Adjuntar el manifest fuente del lote y vínculo verificable al origen; Axioma debe comprobar registro luz/oscuro al mover el haz, y Astra correspondencia visual/taxón. No volver a generar ni alterar ninguno de los sets.

## 2. Patch de incorporación y zonas · Claude
La instrucción «basta zonaValidada: true para activar cualquiera de los diez en el tramo» es falsa para este artifact.

Evidencia:
- datos.js: meso-01.animales contiene solo prof-pez-hacha, prof-pez-linterna, prof-calamar-cristal.
- motor.cargarEscena recorre e.animales y después filtra flags.
- Comprobación independiente sobre los datos: incluso cambiando en memoria las trece entradas a zonaValidada=true, la selección por slots de meso-01 sigue siendo de tres.

Además etiquetaZona y pintarAlbum interpretan todo zonaValidada=true como Mesopelágica. Ese booleano no identifica qué zona se validó.

Corregir documentación y contrato de datos: incorporar un animal requiere identidad estable, binarios, asignación factual a una zona concreta y slot/ancla de una escena compatible. Mantener todo ello en datos; no meter nombres de especies en el motor. Para R01 no añadir nuevos animales al tramo.
Puede usarse una lista de zonas validadas con fuentes y una asignación explícita escena→animal. La habilitación debe verificar la pertenencia a la zona de ESA escena. No activar los diez en masa ni equiparar validación de otro tramo con mesopelágica.

## 3. Foco de la alternativa accesible · Claude + Axioma
En refrescarSenales se vacía lista-senales con textContent='' y se recrean todos los botones. El propio click de Orientar luz aquí fuerza esta reconstrucción; no hay restauración del foco por ID/acción. Se elimina el control que la persona acaba de activar.
Conservar los nodos y actualizar estado/texto, o restaurar el foco de manera estable al control equivalente sin saltos inesperados. Revisar también retirar una entrada del álbum, que reconstruye su lista.

Prueba requerida: recorrer los tres encuentros con Tab/Enter/Space, sin page.click ni reposicionamiento programático de foco. Tras orientar, debe poder llegarse a Examinar con el teclado desde la posición esperada. La pérdida observada en código debe reproducirse y cerrarse en navegador; esta revisión no afirma resultado con lector real.
Los tests entregados usan click para la vía de controles y no acreditan ese recorrido completo.

## 4. Axioma · comprobación independiente del ZIP corregido
Usar el ZIP final identificado por hash, file://, sin servidor.
- Recorrido completo de los tres animales por teclado y touch sin arrastre; foco persistente; lector real si está disponible.
- Revelado parcial cabeza/cuerpo/cola, oscuridad al salir, alineación de cada par nuevo. Cajas alfa próximas no prueban por sí solas ausencia de salto anatómico.
- Cámara y zoom: no declarar examinable un cuerpo fuera del área realmente visible. evaluar() mide muestras contra el cono sin comprobar límites del viewport; probar este caso explícitamente.
- Visor: zoom y desplazamiento deben permitir alcanzar ambos extremos de la imagen en móvil; comprobar cierre y recuperación de cámara/luz/objetivo.
- 320/390/1440 y texto 200%, incluyendo álbum, fuentes y visor abiertos. Cero overflow de página no demuestra por sí solo cero recorte interno.
- NORMAL/REDUCED/NONE, forced-colors, silencio, 30 s inactivos y ausencia de terceros.
- Contrastar las dos escenas del ZIP; no asumir que el lienzo de Design contiene exactamente el mismo runtime.
Registrar PASS/FAIL/PENDING con evidencias. No inventar pruebas de Safari, Firefox, touch físico o lector que no se hayan hecho.

## 5. Factualidad y los pendientes solicitados a María
Responsabilidad ya prevista en la orden: Senda/Astra; Nexo coordina, Claude consume datos.
- Senda: fuentes y asignación de región, hábitat y rango por taxón; distinguir rango observado de zona seleccionada para la experiencia.
- Astra: asociación ID/archivo con el animal ilustrado, integridad de los pares y correcciones visuales.
- Revisar los 13, incluidos los tres con flag heredado: cambiar el set de imágenes no hereda automáticamente validación taxonómica/morfológica.
- Entrega factual: id estable; taxón y nivel; nombre/archivo/hash; hábitat; rangos con fuente y fecha; zonas permitidas; tamaño y definición cuando haya evidencia; estado VERIFIED/HOLD y motivo.
- Lista exacta para cruce: Argyropelecus (género), Myctophum punctatum, Teuthowenia pellucida, Macropinna microstoma, Grammatostomias flagellibarba, Anoplogaster cornuta, Dolichopteryx longipes, Melanocetus johnsonii, Pseudoliparis swirei, Chauliodus sloani, Bathypterois grallator, Eurypharynx pelecanoides y Coryphaenoides rupestris. Estas etiquetas son las del artifact, no una revalidación de Nexo.
- No asignar ni identificar las diez imágenes sueltas por parecido. Resolver mediante índice, archivo e informe de Astra; no pedir a María que adivine taxones.
- Pez borrón sin par oscuro: HOLD fuera del descenso, sin sustituto. No bloquea la prueba de los tres.
- Las diez imágenes sueltas tampoco bloquean esta prueba. No ampliar cinco zonas antes de HUMAN QA.

La escena de 13 continúa siendo un banco de prueba privado, con aviso permanente y sin afirmación de convivencia. Antes de distribución pública retirar selector técnico/informe/fixtures del flujo de producto.

## Secuencia
Claude corrige datos/documentación/foco → Axioma verifica runtime exacto → María prueba interacción.
Senda/Astra preparan la matriz factual sin bloquear el trabajo técnico con los tres actuales; no autorizan por defecto la expansión de zonas.
NO MAIN · NO PUBLIC DEPLOY. Arrecife sigue sin escena poblada.
Esta publicación registra responsabilidades y pendientes; no confirma que los agentes externos hayan recibido o iniciado el trabajo.

## Aprendizaje de coordinación
Comparar dimensiones no sustituye seguir procedencia y hashes. Un catálogo extensible no implica inserción automática en escenas. Conservar foco y verificar todas las acciones importa más que contar botones operables. Integridad de archivos, QA técnica y aprobación de producto son evidencias diferentes.
