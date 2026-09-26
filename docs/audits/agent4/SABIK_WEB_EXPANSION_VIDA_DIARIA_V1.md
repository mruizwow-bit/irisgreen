# SABIK_WEB_EXPANSION_VIDA_DIARIA_V1

**Agente:** n.º 4  
**Fecha:** 20/09/2026  
**Área:** Vida diaria  
**Ruta:** `/es/biblioteca/`  
**Estado:** INVESTIGADO → PROPUESTO

---

## 1. ESTADO INICIAL

La colección contiene **48 fichas** en seis categorías:

| Categoría | Fichas |
|---|---:|
| Salir de casa | 8 |
| Estudios y trabajo | 5 |
| Salud | 9 |
| Casa y descanso | 12 |
| Derechos | 9 |
| Relaciones y seguridad | 5 |

### Barrido de las 48 fichas fuente

Se revisaron las 48 páginas individuales.

**48/48** contienen en la fuente:
- `Estado: publicada`;
- `Validación: 10 de septiembre de 2026`;
- al menos una fuente externa.

El índice fuente, sin embargo, contiene metadatos de tarjeta con “BORRADOR”.

### Conclusión corregida

Esto **no debe interpretarse automáticamente como una contradicción visible en producción**.

El pipeline explica la divergencia.

---

## 2. QUÉ HACE EL BUILD

### Paso 1 · `scripts/publish_biblioteca.py`

El propio script declara:

> “Publica las 48 fichas ES de Vida diaria tras la validación editorial y de fuentes del 10-09-2026.”

Durante el build en staging:
- corrige hechos puntuales;
- añade fuentes que faltaban;
- cambia fichas de borrador a publicadas;
- actualiza la portada;
- cambia la meta de tarjeta a `VALIDADA`;
- falla si queda un marcador de borrador.

### Paso 2 · `scripts/repair_routes.py`

Regenera:
- `sitemap.xml`;
- `sitemap-1.xml`;

a partir de las páginas indexables del árbol de staging.

Por tanto, el `sitemap.xml` almacenado en la fuente **no es prueba suficiente de lo que acaba publicado**.

### Paso 3 · salida pública

Después, el build ejecuta:
- `validate_publication_statuses.py`;
- `finalize_validation_labels.py`;
- `strip_daily_public_status.py`.

Estos scripts **retiran de `dist` los estados editoriales visibles**:
- BORRADOR;
- VALIDADA;
- publicada;
- fechas de revisión/validación;
- `Estado:`;
- `Validación:`.

La decisión de producto es que el usuario no vea estados internos de trabajo.

---

## 3. REGLA DE AUDITORÍA PARA AGENTE 4

A partir de este hallazgo, Vida diaria debe auditarse en tres capas:

1. **fuente editorial**;
2. **transformaciones del build**;
3. **artefacto final `dist`**.

No atribuir al usuario un texto que solo existe en la fuente.

No corregir a mano el HTML fuente si un publicador canónico ya realiza la transformación.

---

## 4. SITEMAP

Las muestras de fichas revisadas conservan:
- `meta robots="index,follow"`;
- canonical individual correcto.

`repair_routes.py` genera el sitemap a partir de las páginas indexables después de las transformaciones de staging.

### Acción

**No modificar el sitemap fuente a mano.**

Comprobar el sitemap de `dist` tras un build real y registrar:
- 48 rutas de Vida diaria esperadas;
- canonical;
- ausencia de duplicados;
- estado indexable.

---

## 5. FUENTES OBSERVADAS

Las 48 fichas contienen entre 1 y 3 fuentes externas en la muestra/barrido.

Dominios observados incluyen:
- boe.es
- educacionfpydeportes.gob.es
- sanidad.gob.es
- nice.org.uk
- who.int
- aena.es
- dgt.es
- sen.es
- asha.org
- aulaabierta.arasaac.org
- incibe.es
- aepd.es
- violenciagenero.igualdad.gob.es
- autismo.org.es
- plenainclusion.org
- fundaciononce.es
- nhs.uk
- nichd.nih.gov
- doi.org

### Regla

No todas las fichas necesitan el mismo número de fuentes.

Necesitan la fuente adecuada para cada afirmación.

---

## 6. QUÉ FALTA

### Gobernanza

- registro interno de fecha de revisión;
- próxima revisión por ficha;
- responsable;
- motivo del cambio;
- fuente que lo respalda;
- commit/PR.

La fecha puede retirarse del contenido público sin perderse de la gobernanza interna.

### Vigencia

Fichas especialmente sensibles al tiempo:
- beca NEAE;
- normativa educativa;
- empleo y ajustes;
- permisos/carné;
- discapacidad/dependencia;
- ayudas y derechos;
- recursos públicos;
- asociaciones/directorios.

---

## 7. ESTRUCTURA DE CONTENIDO

Mantener el patrón útil:

1. respuesta principal;
2. qué existe / qué significa;
3. pasos o preparación;
4. dónde está escrito;
5. fuentes.

### Mejoras de claridad

Cuando un proceso tenga pasos:
- numerarlos;
- separar “qué necesitas” de “qué haces”;
- indicar jurisdicción;
- indicar si la información cambia por comunidad autónoma.

### No convertir la ficha en manual administrativo

La fuente oficial conserva el detalle jurídico.  
Vida diaria debe explicar qué significa y qué hacer con esa información.

---

## 8. ACCESIBILIDAD COGNITIVA

Cada ficha debe poder responder rápido:

- ¿esto me afecta?
- ¿qué puedo hacer?
- ¿qué preparo?
- ¿dónde lo compruebo?
- ¿cambia según dónde vivo?

Aplicar:
- títulos que anticipen la respuesta;
- párrafos cortos;
- pasos;
- términos técnicos definidos;
- fechas y jurisdicción cerca de la instrucción;
- alternativa breve antes de detalle largo.

---

## 9. CONTENIDOS A AMPLIAR

No se recomienda añadir nuevas fichas hasta completar matriz de huecos.

Áreas a comprobar:
- formación profesional;
- transición de estudios a trabajo;
- pérdida/cambio de apoyos;
- vivienda con apoyos;
- envejecimiento;
- administración digital;
- emergencias;
- viajes;
- salud sexual/reproductiva;
- cuidados de larga duración.

Solo crear ficha si:
- responde una pregunta real;
- tiene fuente fiable;
- no duplica Condiciones/Situaciones/Ayudas;
- puede mantenerse.

---

## 10. ELEMENTOS QUE NO DEBEN CAMBIARSE A MANO

- estados editoriales de portada;
- sitemap generado;
- etiquetas que el build normaliza;
- arreglos de `dist` que tienen script canónico.

Si se requiere un cambio persistente:
1. localizar fuente canónica;
2. modificarla;
3. añadir prueba;
4. generar build;
5. revisar `dist`.

---

## 11. CUESTIONES PENDIENTES

P0/P1:
- ejecutar/revisar build actual y verificar las 48 rutas en `dist`;
- comprobar que no queda estado editorial visible;
- comprobar sitemap generado;
- mantener registro interno de revisión separado del texto público;
- revisar fichas temporales por vigencia.

P2:
- matriz de huecos por etapa y contexto;
- nuevas fichas solo tras esa matriz.

---

## 12. FECHA DE REVISIÓN

- Fuente 48/48: **20/09/2026**
- Pipeline de publicación: **20/09/2026**
- Próxima revisión: **27/09/2026** o antes si cambia el pipeline.

---

## 13. RESULTADO

La arquitectura de Vida diaria ya contiene un mecanismo de publicación y validación.

La mejora prioritaria para Agente 4 es:

**auditar el resultado generado, mantener la trazabilidad interna y revisar la vigencia del contenido**, no sustituir el sistema existente con ediciones manuales.
