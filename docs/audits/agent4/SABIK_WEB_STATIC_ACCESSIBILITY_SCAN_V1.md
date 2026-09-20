# SABIK_WEB_STATIC_ACCESSIBILITY_SCAN_V1

**Fecha:** 20/09/2026  
**Método:** inspección estática del HTML fuente de las páginas índice principales.  
**Importante:** esto **NO es** una auditoría WCAG. No prueba comportamiento renderizado, CSS calculado, orden de foco, contraste real, nombre accesible calculado, compatibilidad con lector de pantalla, zoom, reflow, teclado ni contenido generado por JavaScript.

## Indicadores estáticos

| Página | lang | H1 en fuente | Imágenes | img sin alt | img alt vacío | iframe | iframe sin title | Controles de formulario detectados | Indicador a revisar |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Inicio | es | 1 | 3 | 0 | 2 | 1 | 0 | 1 | Render dinámico y orientador |
| Condiciones | es | 1 | 1 | 0 | 1 | 0 | 0 | 1 | Filtros/búsqueda |
| Situaciones | es | 1 | 1 | 0 | 1 | 0 | 0 | 1 | Filtros/búsqueda |
| Vida diaria | es | 1 | 1 | 0 | 1 | 0 | 0 | 1 | Búsqueda + estados editoriales |
| Vídeos | es | 2 | 2 | 0 | 2 | 1 | 0 | 1 | H1 duplicado en fuente puede ser plantilla; verificar DOM; multimedia |
| Investigación | es | 2 | 1 | 0 | 1 | 0 | 0 | 1 | H1 duplicado en fuente puede ser plantilla; filtros |
| Datos | es | 1 | 1 | 0 | 1 | 0 | 0 | 0 | Tablas/figuras si se añaden |
| Ayudas | es | 1 | 1 | 0 | 1 | 0 | 0 | 1 | Filtros y actualización dinámica |
| Libros | es | 1 | 4 | 0 | 1 | 0 | 0 | 0 | Portadas y enlaces |
| Jugar | es | 2 | 13 | 0 | 13 | 0 | 0 | 1 | Muchas imágenes con alt vacío en fuente: verificar si son decorativas; interacción |
| Tus intereses | es | 1 | 95 | 0 | 1 | 0 | 0 | 1 | Auditoría de 95 imágenes y funciones de impresión |
| El taller | es | 2 | 16 | 0 | 7 | 0 | 0 | 0 | H1 duplicado en fuente puede ser plantilla; imágenes/materiales |
| Rincón tranquilo | es | 1 | 2 | 0 | 2 | 0 | 0 | 0 | Audio y control sensorial |
| Cuestionarios | es | 2 | 1 | 0 | 1 | 0 | 0 | 0 | Formulario real puede generarse por JS; resultados |
| Lectura accesible | es | 1 | 1 | 0 | 1 | 0 | 0 | 0 | Preferencias y TTS |
| Privacidad | es | 1 | 1 | 0 | 1 | 0 | 0 | 0 | Actualizar con Sabik/IA |

## Interpretación correcta

- Un `alt=""` puede ser correcto si la imagen es decorativa. Por eso se registra para revisión, no como error automático.
- Dos `h1` en el archivo fuente pueden provenir de plantillas o bloques ocultos. Hay que revisar el DOM final y la exposición a tecnologías de apoyo.
- Un `id` en un input no demuestra que tenga etiqueta accesible. Los campos dinámicos deben probarse en navegador/AT.
- Un iframe con `title` evita un problema básico, pero no hace accesible el contenido incrustado.
- No se detectó `video` HTML5 en los índices; la videoteca usa contenido embebido/dinámico, por lo que el control de subtítulos y transcripciones debe hacerse por pieza.

## Pruebas manuales obligatorias por pestaña

1. Navegación solo con teclado.
2. Indicador de foco visible.
3. Orden de foco lógico.
4. Nombre/rol/estado de controles.
5. Reflow a 320 CSS px.
6. Zoom de texto al 200 % y contenido al 400 % cuando aplique.
7. Contraste.
8. Texto espaciado.
9. No dependencia de color.
10. Movimiento y animaciones.
11. Mensajes de estado.
12. Errores de formularios.
13. Lectura con NVDA/Firefox y, como mínimo, otra combinación AT/navegador.
14. Preferencias de usuario: contraste, movimiento, tamaño, esquema cuando corresponda.
15. Contenido cognitivo: títulos previsibles, propósito claro, instrucciones en pasos, ayuda para recuperar errores.

## Multimedia

Para cada pieza:
- idioma;
- subtítulos;
- revisión humana de subtítulos;
- transcripción;
- información visual necesaria;
- audiodescripción o alternativa equivalente;
- control de reproducción;
- autoplay;
- flashes/movimiento;
- enlace alternativo;
- fecha de revisión.

## Resultado

Este archivo es la **línea base de indicadores**. La conformidad solo podrá declararse después de la evaluación del producto renderizado y de los recursos asociados.
