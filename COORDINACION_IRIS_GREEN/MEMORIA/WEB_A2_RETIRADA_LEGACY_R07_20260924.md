# WEB-A2 · Retirada legacy y verificación de Recursos · R07

Fecha: 24/09/2026. Responsable: María y agente 2.

## Integración

Base: main 117a53a01bf254054f759e7e08eb06ba06f00d00, preservando Recursos R05 y Taller/Intereses R06. PR243; candidato 455d75448ce43dfd5b07214d992b2a5267b40945. Fusionada en main 2e17ed3ae02e23a4fd734b00c10f843d14a19d4d. Comprobación previa de publicación PASS, run 36008072313.

Se retiran las 16 carpetas antiguas de Juegos (incluidas colección y B1), juegos-120.json y datos/scripts sin consumidores. Contar y pagar permanece disponible en /es/recursos/contar-y-pagar/ y /en/resources/count-and-pay/, enlazado desde los catálogos actuales. Los restos sin uso de Taller/Intereses quedan retirados. Las páginas modules/modulos son únicamente redirecciones al Intereses vigente.

El runtime todavía usado por otras páginas pasa de assets/games a scripts/vendor, fuera del directorio público. Pruebas y workflows usan rutas y datos actuales. netlify.toml solo cambia redirecciones. Se corrigen sitemap, comprobación de Rutinas imprimibles y enlaces ingleses Resources/Workshop desde portada.

## Evidencia

- Build: 2009 archivos públicos, cero eval/new Function.
- Sitemap: ocho rutas actuales de Recursos ES/EN y hreflang recíproco; rutas retiradas ausentes.
- Indexación revisada: 989 HTML, 968 index,follow, 5 noindex,follow, 16 sin ese valor exacto; 982 entradas de sitemap.
- Accesibilidad estructural: 989 páginas, cero fallos.
- Recursos actuales: 12/12 casos Chromium (seis páginas × 1440/320 px), teclado, idioma, PDF y PNG donde existe control. Run 36008072630, artifact 10810854071. Resultado conservado en EVIDENCIAS/WEB_A2_RETIRADA_R07/resources-current.json.
- PDF Rutinas visuales corregido: impresión desde copia fuera del contenedor escalado/desplazable; dos hojas A4 con pictogramas y atribución actual, inspeccionadas visualmente. Controles y atribuciones de Juegos/Taller/Intereses con contraste corregido.
- Rutinas: comprobación actualizada a los 93 símbolos y 13 sprites que ya usa la herramienta.
- Netlify preview SUCCESS: https://deploy-preview-243--irisgreen-home.netlify.app . Redirecciones reales de colección/sueño, B1/mecánicas, las-cinco-cosas y juegos-120.json verificadas en navegador. Portada inglesa enlaza /en/resources/ y /en/workshop/.

## Límites registrados

No es certificación global. Dos auditorías generales conservan incidencias anteriores: 21 usos de almacenamiento ausentes del inventario de privacidad y tres firmas de contraste en Situaciones/Condiciones. Las llamadas de almacenamiento de los seis scripts señalados son idénticas a main117a53a. No se desactivan controles para ocultarlo.

No se realiza despliegue de producción. Las retiradas públicas quedarán efectivas al publicar este main; preview y repositorio se distinguen de producción.

## Coordinación Sabik R04

Recibido A2_DELTA.patch, código donante e8a8e9579b64ffbe288e2a85889dbe687210554b. git apply --check correcto también sobre main integrado 2e17ed3ae02e23a4fd734b00c10f843d14a19d4d, sin retroceder. Cuatro archivos aditivos; no aplicados en este lote de retirada. Transporte DESACTIVADO, sin HTTP real, sin fixture presentado como conexión, sin nueva autorización R04.4 y sin despliegue de Sabik. No existe un nuevo origen de borrador Sabik que añadir a lista permitida. El origen de preview anterior corresponde únicamente a la revisión de la web.
