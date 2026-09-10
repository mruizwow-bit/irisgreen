# Protocolo de publicación de Iris Green

Vigente desde el 10 de septiembre de 2026.

## Regla de seguridad

1. Antes de cada bloque de cambios que vaya a llegar a `main`, crear una rama nueva `backup/...` desde el `main` exacto de ese momento.
2. No borrar, mover ni reutilizar ninguna copia de seguridad anterior.
3. Si `main` cambia mientras se trabaja, detener la publicación, crear otra copia del nuevo `main` e integrar el trabajo encima de ese estado.
4. Nunca sustituir `main` por un ZIP, una copia antigua o una rama anterior.

## Flujo editorial

- Las revisiones paralelas entregan archivos Markdown o documentación de cambios.
- Esos trabajos no publican en GitHub ni en Netlify.
- La integración y publicación se hacen de forma centralizada, después de comprobar el alcance exacto del cambio.
- Los textos cerrados por la autora se incorporan literalmente. No se resumen, reescriben ni regeneran durante una tarea técnica.
- Sentidos y Sueño tienen comprobaciones literales durante el build.
- La clasificación documental A/B/C se integra únicamente desde su entrega editorial validada; no se modifica como efecto colateral de otros trabajos.

## Estados públicos

Las colecciones publicadas usan estado de validación, no estados provisionales de trabajo. En la salida pública no deben quedar marcadores estructurales `BORRADOR`, `DRAFT`, `REVISADA` ni avisos que indiquen que la comprobación sigue pendiente.

Palabras normales dentro del contenido —por ejemplo «tareas pendientes», «revisión prevista» o `peer-reviewed`— no son estados editoriales y no deben cambiarse.

## Antes de publicar

1. Construir con `python3 scripts/build_site.py`.
2. Publicar únicamente `dist/`.
3. Comprobar que los textos protegidos siguen siendo exactos.
4. Comprobar que no han cambiado descripciones, fuentes o grados fuera del alcance aprobado.
5. Comprobar estados de validación e indexación.
6. Probar las páginas afectadas en móvil y escritorio, con los ajustes de lectura.
7. Verificar la web pública y el commit de producción antes de dar la tarea por terminada.
