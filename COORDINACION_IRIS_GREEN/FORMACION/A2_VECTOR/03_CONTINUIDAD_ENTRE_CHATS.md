# VECTOR · continuidad entre chats

Estado:
`VECTOR_CONTINUITY_R02_ACTIVE`

Fecha:
30/09/2026

## Regla principal

Vector no debe depender de memoria conversacional.

Al finalizar una sesión con aprendizaje material:
- actualizar APRENDIZAJE;
- actualizar runbook si cambia el procedimiento;
- actualizar Control;
- dejar trazabilidad en issue de Formación cuando proceda.

## Lectura obligatoria al abrir un chat nuevo

En este orden:

1. `COORDINACION_IRIS_GREEN/FORMACION/A2_VECTOR/00_IDENTIDAD_Y_PUESTO.md`
2. `COORDINACION_IRIS_GREEN/FORMACION/A2_VECTOR/01_PLAN_FORMACION.md`
3. `COORDINACION_IRIS_GREEN/FORMACION/A2_VECTOR/02_PRACTICAS_Y_EXAMEN.md`
4. `COORDINACION_IRIS_GREEN/FORMACION/A2_VECTOR/04_RUNBOOK_RELEASE_R01.md`
5. último `APRENDIZAJE_VECTOR_<FECHA>.md`
6. `COORDINACION_IRIS_GREEN/CONTROL/FORMACION_AGENTES.csv`
7. `COORDINACION_IRIS_GREEN/CONTROL/FORMACION_AGENTES.json`
8. orden/issue activo de A2;
9. PR/rama A2 viva;
10. Netlify deploy/preview relevante.

## Último aprendizaje material registrado

`APRENDIZAJE_VECTOR_2026-09-30.md`

Contiene:
- profesión;
- fuentes estudiadas;
- Release Engineering;
- Git;
- build;
- GitHub Actions;
- Netlify;
- DORA;
- SLSA;
- NIST SSDF;
- OWASP CI/CD;
- reproducibilidad;
- aprendizaje aplicado al repo Iris Green;
- errores propios;
- estado A2/R67/R69;
- primeros 15 minutos del sucesor.

## RESUME GATE

Antes de escribir código o integrar:

1. leer los documentos anteriores;
2. revalidar HEAD/tree de A2;
3. revalidar HEAD/tree de cada handoff;
4. revalidar estado del PR;
5. revalidar deploy ID/context/commit_ref;
6. comparar todo contra el snapshot del último aprendizaje;
7. declarar divergencias;
8. identificar nueva orden de María/Aura/Astra;
9. confirmar límites;
10. solo después actuar.

## Prohibido al reanudar

No:
- usar SHAs del aprendizaje como si fueran eternos;
- asumir que una preview sigue apuntando al mismo commit;
- confiar solo en texto de PR;
- integrar porque “esto ya estaba aprobado” sin comprobar la revisión exacta;
- publicar producción como atajo;
- reconstruir de memoria un procedimiento ya documentado.

## Antes de cerrar un chat

Crear o actualizar:
`APRENDIZAJE_VECTOR_<FECHA>.md`.

Incluir obligatoriamente:
- A2 HEAD actual;
- A2 tree cuando sea relevante;
- PR #244 o sucesor;
- issues activos;
- Netlify deploy/preview;
- integración a medias;
- conflictos;
- runbook usado;
- intentos fallidos;
- qué NO repetir;
- siguiente operación segura;
- cualquier cambio en formación.

## Regla de mentoría

Cada error nuevo con valor general se convierte en:
- aprendizaje;
- test;
- checklist;
- runbook;
- o ejercicio de Formación.

No debe repetirse como conocimiento “solo en la cabeza del chat anterior”.

## Estado de formación al 30/09/2026

`FOUNDATION_STUDIED_PRACTICE_PENDING`

Vector ya estudió la base profesional y la aplicó a lectura real del proyecto.

Todavía NO declarar:
- FOUNDATION_PASS_INTERNAL;
- certificación externa;
- autorización de producción.

Faltan prácticas/examen de `02_PRACTICAS_Y_EXAMEN.md`.
