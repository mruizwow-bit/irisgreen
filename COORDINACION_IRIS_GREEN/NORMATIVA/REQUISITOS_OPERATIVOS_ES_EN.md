# Requisitos operativos obligatorios · Iris Green

## Alcance y autoridad

Aplicar este anexo en cada orden y registrar qué requisitos afectan realmente al cambio. No es una certificación ni una reproducción de normas de pago. El marco transversal histórico R01 se conserva como fuente documental; sus ediciones, fechas y afirmaciones jurídicas no se convierten automáticamente en una verificación de vigencia. Ningún agente puede ampliar su misión por interpretar una norma fuera de alcance.

## Bilingüismo obligatorio

La web es español + inglés. Todo cambio público incluye ES y EN: títulos, cuerpo, navegación, botones, instrucciones, ayuda, validaciones, errores, estados vacíos, nombres accesibles, alt, subtítulos/transcripciones pertinentes y documentos descargables. Conservar lang, relaciones de idiomas y rutas equivalentes de la web. No contar la existencia de un selector como traducción terminada. Los textos de ambos idiomas deben describir el mismo comportamiento. No usar un cambio de idioma para reiniciar o perder entradas sin una necesidad documentada.

Un módulo interno sin contenido público puede declarar NO_APLICA_TEXTO_PUBLICO y justificarlo; sus interfaces no deben impedir ES/EN. El corpus N04 español sellado no se traduce ni modifica de forma silenciosa. Su cobertura inglesa debe resolverse mediante una fuente y versión separadas, con autorización.

## Construcción e integración

La web existente de Iris Green es la base. No sustituir cabecera, navegación, footer, tipografía, panel de Lectura ni componentes por una página autónoma. Conservar el trabajo de María/agente 2. Cambios pequeños sobre HEAD vigente, propietario de archivos explícito, dependencias bloqueadas, sin secretos, eval dinámico ni relajación de CSP para ocultar un fallo. Las pruebas deben corresponder al artefacto que se entrega; separar código, build, despliegue y funcionamiento. No publicar ni abrir mantenimiento sin autorización.

## Accesibilidad de interfaz

Referencia funcional del proyecto: WCAG 2.2 nivel AA; consultar W3C y la norma de contratación aplicable antes de afirmar conformidad. Usar HTML semántico, jerarquía de encabezados, controles nativos, labels, orden de lectura y navegación por teclado; foco visible, no oculto, sin trampas. Comprobar ampliación de texto y reflujo de la superficie afectada. No depender solo de color, posición, sonido, movimiento o gesto de arrastrar. Proporcionar alternativa al arrastre. Texto normal: contraste 4,5:1; texto grande: 3:1; elementos visuales funcionales: 3:1 según criterio y contexto. El objetivo interno de control cómodo es 44 px; no confundirlo con el mínimo y excepciones de WCAG 2.5.8. Anuncios accesibles oportunos, no repetitivos; errores comprensibles y junto al campo correspondiente. Probar controles reales, no solo selectores estáticos.

## Movimiento y medios

Respetar prefers-reduced-motion y los ajustes de Iris Green. Audio/vídeo voluntarios, sin reproducción automática no solicitada. Sin flashes ni bucles insistentes. Subtítulos, transcripción y audiodescripción/equivalente según el contenido. La animación no es el único medio de comunicar un estado. Sabik conserva cinco estados y masters vigentes; nada de anillos o estados históricos retirados.

## Escritura, lectura y accesibilidad cognitiva

Lenguaje claro, información principal primero, instrucciones concretas y breves; explicar vocabulario técnico necesario. Conservar segunda persona y tono no infantilizante. Recursos para infancia, adolescentes y adultos, con o sin diagnóstico; no diagnosticar ni exigir una etiqueta clínica. Separar datos, experiencias y apoyos prácticos. No convertir ajustes tipográficos en una afirmación de Lectura Fácil validada. Aplicar el proceso específico y validación humana si se etiqueta una publicación como Lectura Fácil. Respetar los ajustes globales de Lectura y no duplicarlos.

## Imágenes y descargables

Distinguir imágenes decorativas, informativas, funcionales y complejas; alternativas textuales pertinentes. PDFs con texto real, idioma, orden de lectura, estructura y enlaces accesibles; revisar impresión, recortes, contraste y lectura con ayudas técnicas. PDF/UA es un objetivo que exige comprobación específica, no se acredita al exportar un PDF. Pictogramas: fuente, permiso, atribución y significado del paso verificados; no confundir mapeo candidato con pictograma aprobado. Marca de composición IRIS GREEN · irisgreen.eu visible sin tapar información; conservar créditos y licencias ajenos. No distribuir fuentes tipográficas ni normas completas de pago.

## Fuentes normativas a aplicar según alcance

- WCAG 2.2 y W3C COGA: accesibilidad web y apoyo cognitivo. Fuentes: https://www.w3.org/TR/WCAG22/ y https://www.w3.org/TR/coga-usable/.
- ISO/IEC 40500: referencia ISO para accesibilidad web; registrar edición y relación exacta con WCAG, sin asumir equivalencia por memoria.
- EN 301 549: requisitos de accesibilidad TIC. Registrar versión técnica y, cuando proceda, la referencia armonizada jurídicamente aplicable; son cosas distintas. Fuente oficial: ETSI y Diario Oficial de la Unión Europea.
- ISO 24495-1: lenguaje claro.
- ISO 9241-171: accesibilidad de software; ISO 9241-210: diseño centrado en las personas; ISO 9241-11: usabilidad; ISO 9241-112: presentación de información.
- UNE 153101 EX: Lectura Fácil, solo cuando se produzca como tal y con su validación correspondiente.
- ISO 14289 / PDF/UA: accesibilidad de PDF, edición aplicable documentada.
- Comisión Braille Española: cuando se produzca transcripción braille específica; no considerar braille la mera transliteración de caracteres.
- Protección de datos y accesibilidad legal: determinar jurisdicción, servicio y tratamiento efectivo; consultar BOE/EUR-Lex. No copiar afirmaciones jurídicas históricas sin verificar.

## Evidencia exigida en cada entrega

Responsable, orden, base/HEAD, archivos, contenido ES/EN afectado, pruebas de funcionalidad/accesibilidad aplicables y resultado real. Estados permitidos: verificado, fallo, pendiente o no aplicable justificado. Un bloqueo concreto no obliga a detener módulos independientes. No hay PASS global heredado de una versión anterior.
