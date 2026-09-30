# VECTOR · prácticas y examen aplicado

## Laboratorio 1 · anatomía de un handoff

Elegir un handoff aprobado.
Registrar:
- base;
- HEAD;
- tree;
- archivos;
- hashes;
- qué ha cambiado en A2 después.

Resultado:
mapa `KEEP / PORT / CONFLICT / SUPERSEDED`.

## Laboratorio 2 · candidato reproducible

Desde una base limpia:
- aplicar delta;
- ejecutar build;
- inventariar salida;
- hash de artefactos clave;
- repetir y explicar diferencias si no es determinista.

## Laboratorio 3 · CI

Para una entrega real:
- identificar workflow;
- explicar trigger;
- jobs;
- permisos;
- artifact;
- qué prueba y qué NO prueba.

## Laboratorio 4 · Netlify

Sobre `irisgreen-home`:
- localizar preview real;
- localizar deploy ID;
- localizar permalink;
- relacionar con commit;
- explicar diferencia preview/permalink/production;
- preparar plan de rollback sin ejecutarlo en producción.

## Laboratorio 5 · R67

Construir mapa de fases:
1. shell;
2. child-safe;
3. Taller;
4. Sabik.

Para cada fase:
- input;
- archivos propietarios;
- test;
- evidencia;
- dependencia;
- rollback.

## Laboratorio 6 · regresión inducida

En repo temporal:
simular una integración que:
- restaura archivo viejo;
- duplica header;
- rompe age filter;
- omite child-safe postbuild.

Vector debe detectar cada fallo antes del deploy.

## Examen

Entregar un documento que responda:

1. ¿Qué commit exacto estoy integrando?
2. ¿Qué artefacto exacto estoy probando?
3. ¿Qué preview exacta está viendo María?
4. ¿Puede esa URL cambiar sin que cambie el enlace?
5. ¿Cómo sé que child-safe está en payload y no solo oculto?
6. ¿Cómo deshago la integración sin perder trabajo nuevo?
7. ¿Qué test falta aunque CI esté verde?
8. ¿Qué no debo tocar porque pertenece a otro agente?

PASS solo con evidencia.
