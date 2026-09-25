# Sabik · Biblioteca narrada ES/EN · decisión R01

Fecha: 25/09/2026.
Estado: DECISION_DE_MARIA_REGISTRADA · PREPARACION_Y_GENERACION_PENDIENTES.

## Decisión vigente de María

Generar por adelantado en ElevenLabs el contenido público de Iris Green en español e inglés, usando el contenido editorial validado que también servirá para la biblioteca de texto. Descargar los audios y reproducir los archivos desde infraestructura propia, sin API de síntesis de ElevenLabs durante la escucha.

María confirma que ya tiene una voz española y una voz inglesa DISTINTA, ambas elegidas por ella. No es un requisito que compartan timbre. No volver a diseñarlas, igualarlas, convertirlas ni imponer un único master vocal. Conservar cada voz y sus ajustes. Los identificadores y modelos exactos se documentarán al preparar la producción; no se han consultado en su cuenta.

María declara suscripción pagada de 100.000 créditos. No se presume generación ilimitada ni se conoce el saldo actual. No se ha accedido a ElevenLabs, gastado créditos, escuchado audios nuevos ni generado narraciones en esta recepción.

## Pronunciación inglesa de la marca

Forma comunicada como funcional por María: `I'm /ˈsɑːbɪk/`.

Conservar esa secuencia en el guion de generación del saludo inglés con la voz y modelo que ella ya ha utilizado. La grafía pública, títulos, transcripción legible y texto de biblioteca siguen siendo `Sabik`: ejemplo visible `I'm Sabik.`. La transcripción fonética no sustituye el nombre de marca en la web ni en el corpus.

`I'm` pertenece a esa frase, no es parte del nombre ni debe añadirse a cada aparición. Para otras frases en inglés, tratar la pronunciación de `Sabik` como una regla de locución contextual; no hacer sustitución global ciega del nombre por la frase completa.

La compatibilidad de diccionarios/fonemas varía por modelo y producto. No convertir el ejemplo probado por María en garantía universal, ni cambiar el modelo aprobado solo para utilizar un diccionario. Si se usa el editor de pronunciación, comprobar una frase real con los mismos ajustes antes del lote. No se ha ejecutado esa comprobación en esta recepción.

## Recepción de la propuesta adjunta

Documento recibido: `Se ha pegado el markdown(20260925-072841).md`.

El documento propone Qwen VoiceDesign → OpenVoice V2 → TTS local, crear un timbre nuevo y aplicarlo a ambos idiomas. También plantea instalar OpenVoice y condicionar la conclusión a un experimento posterior. Es investigación/propuesta, no una entrega ejecutada que acredite la voz final.

No adoptar ese recorrido como implementación para la biblioteca narrada de ElevenLabs: reabre una decisión ya resuelta por María, exige un único timbre que ya no solicita y añade instalaciones innecesarias para reproducir archivos de audio terminados. No se declara imposible su uso en otro proyecto ni se auditan aquí todos sus modelos, licencias y dependencias. Una futura voz dinámica local sería un alcance diferente, no requisito para narrar la web.

## Flujo previsto

Contenido editorial público ES/EN aprobado → extracción única → dos salidas coordinadas:

1. texto y unidades de recuperación para la biblioteca;
2. guiones de locución por página y apartado → ElevenLabs con la voz de cada idioma → archivos revisados → reproducción propia.

No narrar ciegamente fragmentos solapados del índice ni cabeceras/pies repetidos. La unidad de audio conserva una idea o apartado completo. No reescribir, resumir ni inventar contenido mediante funciones de podcast o mejora automática. Las adaptaciones para lectura de cifras, unidades, tablas y siglas deben preservar información y poder compararse con el original.

Dos idiomas completos, no una única narración ES sobre interfaz EN. El corpus N04 ES sellado no se sobrescribe ni se convierte silenciosamente en corpus EN. Las traducciones aprobadas tienen su procedencia y versión propias.

## Producción por lotes y trazabilidad

Agrupar guiones por sección e idioma y exportar capítulos individualizados, no una grabación gigantesca para toda la web. Usar archivos finales de ElevenLabs, no referencias para entrenar o clonar otro motor.

Manifest previsto: content_id, locale, source_url, source_version, source_text_sha256, narration_text_sha256, voice_id, model_id, ajustes, pronunciation_rule_version, audio_file, audio_sha256 y duración. Estos son campos de contrato, no datos ya recogidos.

Contar los caracteres reales por idioma antes del lote. Calcular el consumo con el modelo y la voz aprobados; no sustituirlos silenciosamente por una opción más barata. Mantener la referencia del plan y fecha de generación. Regenerar únicamente texto corregido o añadido y marcar audios desfasados para evitar mostrar una versión corregida mientras se reproduce una anterior.

La web reproducirá las pistas con controles accesibles; no cargará toda la biblioteca de audio al abrir una página. Audio solo tras acción explícita, con pausa, volumen y texto equivalente. No mezclar automáticamente narración con música/ambientes del Rincón. Mantener preferencias de Lectura y ES/EN.

## Límites

La biblioteca de audios cubre contenido previamente generado; no permite narrar por sí sola cualquier respuesta futura inédita. Puede reproducir una ficha o apartado recuperado cuando exista su audio asociado. No se presenta una pista pregrabada como lectura exacta de un texto distinto generado al vuelo.

Solo contenido público autorizado para este uso. No enviar conversaciones, perfiles, proyectos privados ni datos personales a ElevenLabs. Los audios no se utilizan como dataset o referencia de otro modelo en este alcance.

No se han creado órdenes concurrentes para A2/A3, modificado producto, activado API, alterado acceso, publicado ni desplegado. Se conserva el punto de continuidad A3/UX existente y se registra exclusivamente esta decisión de voz. El catálogo completo y sus costes todavía no están extraídos ni calculados.

## Fuentes oficiales consultadas el 25/09/2026

- Studio: importación de documentos, capítulos, selección de voz/modelo, exportación por capítulo o ZIP: https://elevenlabs.io/docs/eleven-creative/products/studio
- Pronunciaciones en Studio: https://elevenlabs.io/docs/help-center/product/studio/studio/how-do-i-use-the-pronunciations-editor-in-studio
- Buenas prácticas, fonemas y alias por modelo: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices
- Exportación de cambios y crédito de secciones no generadas: https://elevenlabs.io/docs/help-center/product/studio/studio/why-arent-my-changes-reflected-in-my-download-from-studio

Normativa del proyecto, accesibilidad, escritura clara y bilingüismo se mantienen. No hay modificación normativa ni certificación. Delta documental asociado: `../CONTROL/DELTA_SABIK_BIBLIOTECA_NARRADA_ES_EN_R01_20260925.json`. No se acredita sincronización del Excel maestro.
