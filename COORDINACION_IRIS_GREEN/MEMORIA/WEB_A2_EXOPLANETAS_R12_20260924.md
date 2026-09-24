# Exoplanetas · integración A2 R12 · 24/09/2026

Solicitud de María: «más intereses», con paquetes de Sistema Solar y Exoplanetas.

## Resultado
PR244, rama agent2/sabik-iris-r08-20260924, commit 5b0940fa3ab2a91dfd378993042160bd2accbe02, sobre f93346772f6e005ecafa2b2b03ff467a105d210a.
Netlify deploy 6ab54084dcb6f500075d3bc3 READY y estado GitHub netlify SUCCESS.
Vista previa: https://deploy-preview-244--irisgreen-home.netlify.app/es/intereses/exoplanetas/

14 archivos: 9 nuevos del módulo Exoplanetas, tarjetas aditivas en los dos índices vigentes, aviso de colección local en Privacidad ES/EN y registro justificado de su clave en la auditoría de almacenamiento. Se revisaron propósito, lecturas/escrituras/borrado y ausencia de transmisión remota de la colección. No se eliminan incidencias anteriores para declarar PASS global.

Sistema Solar: datos, imágenes, visor y páginas del paquete ya coinciden con el candidato. No reaplicados índices ni Taller antiguos del paquete. Taller F1 preservado.

## Evidencia propia
- Manifest SHA256 Exoplanetas: 11/11 archivos del paquete comprobados.
- Instantánea suministrada: 6366 planetas, 4775 estrellas. No es una nueva consulta independiente a NASA.
- node --check de ambos JS: correcto.
- Build final, sin modificaciones concurrentes: scripts/build_site.py exit 0, 2056 archivos públicos.
- Cuatro páginas nuevas construidas: un H1 por página y ningún recurso local script/stylesheet/img faltante. Listas completas: 6366 filas por idioma.
- Navegador desplegado: tarjeta ES abre Exoplanetas, cambio ES→EN correcto; búsqueda TRAPPIST-1 devuelve 7 resultados en ambos idiomas; filtro inglés Radial velocity devuelve 0; lista inglesa completa abre correctamente.
- WebGL no disponible en navegador de comprobación: mensaje alternativo ES/EN y datos utilizables. No se acredita mapa 3D en GPU real.
- Intento posterior de abrir lista ES desde EN agotó el tiempo de la herramienta. La lista ES está verificada estáticamente, no se acredita esa navegación final.
- QA del donante (incluidos axe/WebGL software) se conserva como evidencia del donante, no como ejecución propia.

## Límites
Sin merge a main ni publicación de producción. Sin activar transporte Sabik/Cloud. Aceptación visual humana, GPU real y comprobación móvil pendientes. No certificación global de CI/accesibilidad. Normativa vigente aplicada, sin modificarla.
