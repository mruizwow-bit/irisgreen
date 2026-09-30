# ATLAS · PRÁCTICAS Y EXAMEN R01

Fecha: 30/09/2026  
Issue: #351

Estado:
`PRACTICE_PENDING`

## Práctica 1 · Canonical resource

Tomar una rutina real o equivalente y separar:

- identidad;
- contenido fuente;
- metadatos;
- relaciones;
- assets;
- derechos;
- accesibilidad;
- localización;
- outputs.

PASS:
ningún dato sustantivo existe solo en un PDF/HTML derivado.

FAIL:
el PDF se convierte de facto en fuente porque nadie puede reconstruirlo.

---

## Práctica 2 · Schema

Diseñar un schema mínimo para un recurso.

Debe detectar:
- ID ausente;
- locale inválido;
- asset huérfano;
- status desconocido;
- relación sin destino;
- derechos incompletos cuando sean obligatorios.

PASS:
errores claros y accionables.

FAIL:
schema tan rígido que obliga a falsear información.

---

## Práctica 3 · ES/EN

Mismo recurso:
- ES;
- EN.

Comprobar:
- ID común;
- locale explícito;
- no traducción perdida;
- relaciones coherentes;
- outputs emparejados;
- fallback definido.

Caso negativo:
el EN tiene un paso antiguo que ES ya corrigió.

Atlas debe detectar **translation/source drift**.

---

## Práctica 4 · Asset de tercero

Simular un pictograma con:
- provider;
- asset id;
- source URL;
- creator;
- license;
- attribution;
- relation to resource.

Generar un derivado.

PASS:
el derivado conserva el vínculo con la procedencia y la atribución que corresponda.

FAIL:
watermark Iris Green sustituye o tapa atribución.

---

## Práctica 5 · Imagen accesible

Usar el mismo archivo gráfico en tres contextos:

1. decorativo;
2. informativo;
3. botón/acción.

Demostrar que el texto alternativo no es una propiedad única e inmutable del archivo.

PASS:
la metadata del asset ayuda, pero la salida resuelve la función contextual.

---

## Práctica 6 · Multi-format

Desde una fuente:
- HTML;
- PDF;
- PNG de hoja.

Cambiar un paso de la fuente.

Regenerar.

PASS:
los tres outputs reflejan la misma revisión.

FAIL:
uno queda stale.

---

## Práctica 7 · Manifest e integridad

Crear manifest con:
- resource version;
- source files;
- asset ids;
- output list;
- hashes;
- export/pipeline version.

Corromper un output.

PASS:
la verificación detecta el cambio.

Caso adicional:
regenerar legítimamente un PDF y explicar por qué hash distinto no significa por sí solo “contenido incorrecto”.

---

## Práctica 8 · Safe-linking

Dataset:
- infancia;
- adolescencia;
- adultez;
- recurso transversal;
- contenido sensible S2.

Aplicar:
- audience;
- relation type;
- safe related;
- blocked related.

PASS:
0 enlaces incidentales infancia → S2.

No eliminar ayuda explícita cuando sí procede: el sistema debe diferenciar **safe routing** de censura indiscriminada.

---

## Práctica 9 · Lifecycle

Crear:

`R1 APPROVED → R2 PUBLISHED → R1 SUPERSEDED`

Demostrar:
- cuál es vigente;
- por qué;
- cómo encontrar histórico;
- qué outputs pertenecen a cada versión.

FAIL:
dos versiones “final.pdf” sin identidad.

---

## Práctica 10 · Handoff

Entregar un recurso a Vector.

Handoff mínimo:
- source;
- schema;
- manifest;
- outputs;
- hashes;
- ES/EN status;
- rights;
- accessibility notes;
- known pending;
- exact base/version.

PASS:
Vector puede integrar sin adivinar.

---

# EXAMEN

Responder con evidencia:

1. ¿Cuál es la diferencia entre contenido y presentación?
2. ¿Qué hace que una fuente sea canónica?
3. ¿Por qué un PDF público no debería ser automáticamente la fuente?
4. ¿Cuándo usar un schema?
5. ¿Qué es un application profile?
6. ¿Qué metadata mínima necesita un asset tercero?
7. ¿Qué diferencia hay entre watermark y atribución?
8. ¿Qué significa BCP 47 en la práctica?
9. ¿Cómo evitas drift ES/EN?
10. ¿Qué significa single-source publishing?
11. ¿Por qué `alt` depende del contexto?
12. ¿Qué aporta PDF/UA-2 y qué no decide Atlas?
13. ¿Qué diferencia hay entre metadata descriptiva, administrativa y de derechos?
14. ¿Qué demuestra un hash y qué no demuestra?
15. ¿Cómo distingues source version y output version?
16. ¿Cómo detectas un derivado stale?
17. ¿Cómo representas supersedencia?
18. ¿Cómo impides enlaces incidentales inseguros?
19. ¿Cuándo C2PA puede ser útil y por qué no se impone siempre?
20. ¿Qué debe contener un handoff reproducible?
21. ¿Cuándo consulta Atlas a Nube?
22. ¿Cuándo consulta a Axioma?
23. ¿Cuándo consulta a Lex?
24. ¿Cuándo pasa el trabajo a Vector?
25. ¿Qué aprendizaje histórico de A1 sigue siendo útil sin convertir Atlas en QA global?

## Gate interno

`ATLAS_CONTENT_SYSTEMS_FOUNDATION_PASS_INTERNAL`

Solo se emite tras completar prácticas y examen con evidencia.

Hasta entonces:
`FOUNDATION_STUDIED_PRACTICE_PENDING`

No equivale a certificación externa.
