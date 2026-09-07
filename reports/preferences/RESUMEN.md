# Preferencias de lectura · conservación entre secciones

## Estado
Cambios guardados en `ajustes/auditoria-web`. La ejecución 34097255936 aprobó la unificación y su regresión de accesibilidad. La comprobación visual final 34097871790 volvió a aprobar conservación y controles interiores después de evitar cortes de palabras en los botones. El estado resultante está guardado en el commit f402aef0f9ad8ff481bf11790dd80839a2f8e462. No se ha fusionado la propuesta ni publicado en producción.

## Problema confirmado
Las páginas estáticas guardaban preferencias bajo `ig-a11y`. Las 25 páginas dinámicas mantenían los controles de lectura en su estado local, sin recuperar la misma configuración al navegar. Además, su función de aplicación llamaba otra vez a la voz al cambiar ajustes visuales.

## Corrección
Se conserva un único almacén, `ig-a11y`, con un formato de versión 2. Se leen las preferencias antiguas y se convierten al nuevo formato cuando la persona cambia un ajuste. No se añade un segundo panel ni una cuenta de usuario.

La conexión se ha incorporado a 25 páginas dinámicas y 870 páginas estáticas que ya tenían controles de lectura. Estos son recuentos de archivos conectados, no 895 páginas comprobadas individualmente en navegador.

Se comparten tamaño, espaciado existente, controles grandes, contraste, guía y reducción de movimiento. Los tamaños pasan a ser los mismos: 100 %, 115 %, 130 % y 150 %, con porcentaje visible y controles desactivados al llegar al mínimo o máximo. Se amplía el contenido, no los paneles ni la cabecera.

La lectura en voz alta no se guarda como una orden para la siguiente visita. Recargar, navegar o recibir los ajustes de otra pestaña no inicia una voz. Cambiar una opción visual mientras la narración está activa ya no la reinicia. La función de voz existente de cada tipo de página se conserva: esta tanda no implementa todavía lectura continua completa, selección, pausa o velocidad.

Restablecer solo cambia las preferencias de lectura. Se ha comprobado que conserva favoritos, idioma y datos ajenos a ese almacén. Si el navegador impide guardar, los controles funcionan en la página y aparece una explicación de la limitación. Se rechazan valores corruptos, tipos inesperados y datos demasiado grandes sin bloquear la interfaz.

Los cambios se sincronizan entre dos pestañas del mismo sitio sin reescribir continuamente el almacenamiento. El evento de sincronización nunca activa narración.

## Ajustes visuales incluidos
- El modo de contraste no aplica un filtro de saturación a todo el contenido: no altera así los colores originales de las ilustraciones.
- Las columnas de cromos de Tus intereses pueden reducirse al ancho disponible al ampliar la lectura. No se ocultan imágenes ni texto para resolver el desbordamiento.
- El aviso de conservación de preferencias ocupa una fila propia en el panel; no aprieta Restablecer y Más opciones dentro de una tercera columna.
- Los botones conservan las palabras enteras y son alcanzables en la vista estrecha; se comprueba el interior del panel, no solo su caja exterior.

## Pruebas
**45/45 escenarios específicos aprobados** (`after.json`): recuperación de preferencias antiguas en las 25 páginas dinámicas y seis páginas estáticas representativas; recorridos reales entre secciones a 1440/390/320 píxeles; cambio de idioma; recarga; límites y restablecimiento; dos pestañas; siete datos almacenados inválidos; almacenamiento bloqueado en ficha y juego; ausencia de reinicio o arranque automático de la narración.

**9/9 comprobaciones visuales adicionales aprobadas** (`panel-bounds.json`): home, Condiciones y Tus intereses a 1440/390/320 píxeles, al 150 % y con ajustes combinados. Los controles caben horizontalmente; cuando procede, siguen siendo alcanzables mediante desplazamiento vertical dentro del panel. Se han revisado las capturas finales del panel en móvil y de los cromos ampliados.

**Regresión de accesibilidad: 62/62 paneles y 12/12 escenarios de los dos juegos con alternativa de botones aprobados** (`regression-accessibility.json`, ejecución 34097255936). Comprobación posterior a la migración. El último cambio de división de palabras se volvió a probar con los 45 escenarios y las nueve comprobaciones visuales; no se volvió a ejecutar toda la batería de 13 juegos en esta tanda.

La migración comprueba que el contenido principal y los diccionarios editoriales se conservan, y que una segunda ejecución no altera otra vez los archivos. Se han comprobado también la sintaxis JavaScript y la integridad de `buscador.json`, `videoteca-listado.json` y el catálogo de juegos.

## Fallos encontrados y cerrados durante la tanda
La primera ejecución 34096137636 registró 97 píxeles de desbordamiento en Tus intereses al 130 % y 162 píxeles en la prueba anterior al máximo. También falló el guardado final por informes generados que habían quedado sin incorporar; los cambios no se forzaron sobre la rama. Las ejecuciones siguientes corrigieron el ancho de los cromos y guardaron los archivos y sus informes sin sobrescribir trabajo concurrente.

La inspección visual encontró además el aviso y botones apretados en el panel móvil. Por eso se añadieron comprobaciones de cada control interior y se volvió a capturar la versión final. Un resultado que solo verificase las dimensiones exteriores del panel no habría detectado ese problema.

## Límites y pendientes
Las pruebas se hicieron en Chromium y un servidor local con dominios externos bloqueados. Verifican los controles y llamadas de voz, no la audibilidad, calidad ni procesamiento local de todas las voces. Tampoco certifican WCAG, lectores de pantalla o líneas braille.

Esta tanda consolida los ajustes existentes. Siguen pendientes el selector de tipografía, cuatro espaciados independientes, temas completos, guía manejable sin ratón, voz avanzada, alternativas textuales de algunos materiales y pruebas de zoom de navegador al 200 %/400 %. La comparación documental de todas las fichas, los vídeos externos y las portadas de Libros son tareas distintas; no se dan por resueltas aquí.

## Evidencia
Informes y capturas del artefacto `preferencias-entrega` de la ejecución 34097871790. La regresión de accesibilidad procede de la ejecución 34097255936. El artefacto de la primera ejecución fallida 34096137636 conserva los fallos iniciales para comparación.
