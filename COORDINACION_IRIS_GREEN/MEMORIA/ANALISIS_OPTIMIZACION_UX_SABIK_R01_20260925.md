# Análisis R01 · Optimización UX y sistema visual Sabik

Fecha: 25/09/2026.  
Estado: **ANALIZADO · PENDIENTE_DE_ORDEN_DE_IMPLEMENTACION**.  
No modifica producto.

## Dirección confirmada por María

Optimizar Iris Green para que sea más intuitiva, rápida y fácil de usar. Unificar degradados de botones y superficies de cristal con la identidad cromática de Sabik, manteniendo accesibilidad, ES/EN y el trabajo vigente de A2.

## Base observada

PR #244 HEAD observado durante el análisis: `82106c874f5e4b612cdb68292b3c3115e040fea6`.

La web ya contiene una capa visual cercana a Sabik en `assets/iris-brief-r08.css`, pero convive con `site-v23.css`, `ajustes-interfaz.css`, `controles-comunes.css`, estilos inline de Home y estilos específicos de módulos.

## Hallazgos principales

- Navegación global con demasiadas opciones primarias (13 destinos) y duplicación de navegación en Home mediante cabecera + lateral.
- Páginas interiores conservan dos controles de menú en parte del HTML heredado; consolidar a un único control.
- Home contiene restos de rutas/etiquetas PT y varios enlaces EN que apuntan a rutas ES; no presentar cambio de idioma engañoso.
- Búsqueda común ya existe y debe convertirse en acción prioritaria.
- Las fichas editoriales mantienen una columna de lectura estrecha adecuada; no ensancharlas.
- Catálogos ya usan ancho amplio y controles comunes; consolidar, no rediseñar.
- La identidad visual actual mezcla colores canónicos oscuros de Iris/Sabik con tonos brillantes decorativos. Los tonos brillantes no deben usarse como fondo de botón con texto blanco.
- No usar blur intensivo en todas las tarjetas. Crear apariencia de cristal mediante transparencia, borde y sombra; reservar `backdrop-filter` a muy pocas superficies para no perjudicar rendimiento móvil.

## Arquitectura propuesta

Navegación principal reducida a:
- Inicio
- Información → Condiciones, Datos, Investigación
- Situaciones y apoyos → Situaciones, Vida diaria, Ayudas
- Recursos → Juegos/Rutinas, Libros, Vídeos
- Explorar → Tus intereses, Taller, Rincón tranquilo
- Buscar como acción visible

Herramientas separadas de contenido: Lectura, Música, ES/EN.

En móvil: menú acordeón con los mismos grupos, sin otra jerarquía distinta.

## Sistema visual Sabik propuesto

Tokens base:
- tinta/navy `#17395c`
- azul `#1f5f8b`
- turquesa `#197991`
- violeta `#5a49a8`
- rosa acento `#a8336f`
- línea `#dfe6ef`
- superficies `#ffffff / #f7fbfd`

Botón primario: degradado oscuro navy → blue → violet, con texto blanco. Turquesa como reflejo/acento; rosa reservado a acentos/avisos para no convertir cada acción en multicolor.

Cristal: superficie clara translúcida con reflejo azul/violeta y borde visible; no blur por defecto en listas largas. Alto contraste elimina degradados/transparencias.

## Rendimiento

No se atribuyen métricas reales sin ejecución. Objetivo de QA para siguiente implementación: LCP <=2.5s, INP <=200ms y CLS <=0.1 p75; medir móvil/escritorio. Priorizar recurso LCP visible, lazy-load solo fuera del primer viewport, reducir CSS/JS duplicados y evitar blur masivo.

## Accesibilidad cognitiva

Menos opciones simultáneas, jerarquía estable, misma navegación y controles en todas las páginas, relación clara entre control y contenido, breadcrumbs en fichas, búsqueda accesible y estados claros. Objetivo interno de controles 44px conservado; foco violeta visible.

## Alcance recomendado

Hacer la optimización como una capa común de sistema de diseño, no modificando página por página. Primero tokens + header/nav + botones/cristal + búsqueda; luego aplicar a catálogos y fichas sin alterar contenido editorial.

No abrir implementación mientras A2 tenga arreglos prioritarios activos salvo orden expresa de María.
