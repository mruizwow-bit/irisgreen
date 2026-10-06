# 19 · Web completa: fidelidad de producto y alcance real de pruebas
2026-10-06. Nexo.
Caso: IRIS_GREEN_WEB_R01.zip, SHA256 8c182a263d25d687b8bf617caee1d4d0c245b524348d3e9bf0416df6dc9da422.
Informe: COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_WEB_COMPLETA_R01_20261006/ANALISIS_PROPUESTA_Y_CODIGO.md, rama nexo/new-games-area-r01-20261004.
## Aprendizajes aplicables
1. Respetar nombres de seis áreas no demuestra respetar su contrato. Juegos volvió a rutinas, Construcción pasó a Creación, Descubrimiento a observación pasiva y Espacio tranquilo a página vacía. Comparar propósito, acción, resultado y ubicación con decisiones aceptadas.
2. Un tema visual consistente puede conservarse mientras se corrige producto. No ordenar rediseño desde cero como respuesta automática.
3. Número de páginas y hashes validan existencia/integridad, no cobertura funcional. 95 archivos, 94 HASHES y 93 manifest son recuentos distintos correctos.
4. Cero imágenes sin alt no prueba accesibilidad de imágenes si hay cero imágenes. Placeholder uniforme no equivale a puerta reconocible.
5. Un botón de recuperación también es funcionalidad crítica: querySelector sólo conectaba el primero; el botón del estado vacío quedaba muerto. Probar cada instancia contextual.
6. Los tests heredan supuestos de la implementación: un filtro genérico puede convertir juegos/resultados en fichas, y una búsqueda literal sobre cuatro tarjetas no cumple una promesa de búsqueda del sitio con palabras propias.
7. Reflow no equivale a scrollWidth. Targets de escritorio no acreditan móvil. Excepción inline no se deduce por texto adicional en un padre: un grupo de botones también lo tiene. Región viva no acredita anuncio útil/real.
8. Una fuente de verdad que requiere editar JSON, JS y HTML manualmente todavía está duplicada. Generar derivados desde el registro y probar regeneración.
9. Separar texto del prototipo, producción y documentación. Privacidad del ZIP sin integración no acredita privacidad/guardado/Sabik del futuro sitio.
10. Una nueva fuente conserva font-size pero puede alterar anchos y saltos. No prometer geometría idéntica al añadir IG Zero sin retest.
## Método y límites
Inspección fuente/capturas entregadas + Node VM con dobles mínimos. No navegador propio, lector ni dispositivo físico. No elevar evidencia del autor a verificación independiente.
Referencias: W3C Understanding Reflow, Target Size Minimum y APG Breadcrumb enlazadas en el informe.
Regla de próxima revisión: contrato → rutas reales → acciones → recuperación → estados/idiomas/dispositivos → valor humano. No inferir PRODUCT_PASS desde TECHNICAL_PASS.


## Aclaración posterior de María incorporada a formación
La regla2 anterior evita reconstrucciones por reflejo, pero NO limita este encargo: María pidió expresamente un diseño NUEVO de toda la web alineado con Juegos/Descubrimiento y con imágenes en home. Conservar canon y código reutilizable no congela composición.
Fuente: HANDOFFS/NEXO_WEB_COMPLETA_R01_20261006/ACLARACION_MARIA_REDISENO_COMPLETO.md, commit812663ca5a05a32e856ce64b658ee2a1b04e88f4.
Recursos=pictogramas; Juegos=juegos y Construcción; Descubrimiento sustituye Intereses; Creación sustituye Taller. Eliminar duplicidad de navegación preservando contenido y futura compatibilidad deURLs. Inicio no es séptima área.
