# CÓMO REGISTRAR TU FORMACIÓN EN GITHUB

Estado: FORMATION_GITHUB_REGISTRY_PROTOCOL_ACTIVE

## 1. Tu carpeta

Todo agente interno tiene una carpeta de Formación.

Formato recomendado:
COORDINACION_IRIS_GREEN/FORMACION/<ALIAS_O_ROL>/

Ejemplos:
- FORMACION/AURA/
- FORMACION/A2_VECTOR/
- FORMACION/A10_CORTEX/
- FORMACION/AGORA_SOCIAL/
- FORMACION/DEPARTAMENTOS/LEX_LEGAL/

## 2. Documentos de profesión

La primera sesión que complete la profesión debe conservar:

00_IDENTIDAD_Y_PUESTO.md
- alias;
- número;
- puesto;
- jefatura;
- misión;
- límites;
- fronteras con otros puestos.

01_PLAN_FORMACION.md
- materias;
- fuentes;
- qué debe dominar;
- cómo se aplica a Iris Green.

02_PRACTICAS_Y_EXAMEN.md
- ejercicios;
- casos negativos;
- criterios PASS;
- evidencia esperada.

Puede añadir runbooks, checklists y estudio avanzado.

## 3. Documento de aprendizaje de cada chat

Antes de abandonar un chat con aprendizaje material crear:
APRENDIZAJE_<ALIAS>_<AAAA-MM-DD>.md

Si ya existe uno de ese día y pertenece al mismo ciclo, actualizarlo o usar sufijo R02/R03 si existe una ampliación material.

Usar FORMACION/PLANTILLA_APRENDIZAJE.md.

## 4. Qué debe contener

Obligatorio:
- identidad;
- puesto;
- jefatura;
- fuentes estudiadas;
- explicación con tus palabras;
- prácticas;
- evidencia;
- errores propios;
- qué cambió en tu forma de trabajar;
- runbook;
- límites;
- qué todavía falta estudiar;
- estado del proyecto relevante;
- primeros 15 minutos del sucesor.

No entregar un resumen de enlaces.

## 5. Control central

Además del MD, actualizar:
COORDINACION_IRIS_GREEN/CONTROL/FORMACION_AGENTES.csv

Campos:
- Alias;
- Agente;
- Puesto;
- Jefatura;
- Carpeta;
- Estado_formacion;
- Ultimo_aprendizaje;
- Fecha;
- Pendiente_principal.

Y mantener su equivalente CONTROL/FORMACION_AGENTES.json.

## 6. Estados permitidos

- ROLE_DEFINED_TRAINING_PENDING
- TRAINING_IN_PROGRESS
- FOUNDATION_STUDIED_PRACTICE_PENDING
- FOUNDATION_PASS_INTERNAL
- ADVANCED_STUDY_IN_PROGRESS
- ACTIVE_CONTINUOUS_LEARNING

Nunca usar CERTIFIED si no existe certificación externa real.

## 7. Commit

El commit debe describir el aprendizaje, por ejemplo:
Formacion Vector: Release Engineering foundation y runbook R01

No mezclar en ese commit:
- cambios de producto;
- renders;
- deploys;
- refactors sin relación.

## 8. Registro canónico

Después del commit:
- comprobar HEAD final;
- si existe issue de Formación, comentar el resultado;
- actualizar Control;
- si cambia profesión/organigrama, actualizar también el Directorio.

## 9. Si no tienes permisos de escritura

No digas solo no puedo subirlo.

Debes:
1. generar el MD completo;
2. entregar contenido/artefacto;
3. indicar ruta destino exacta;
4. indicar hash si hay archivo;
5. dejar el handoff listo para el responsable que sí tiene escritura.

No afirmar que está en GitHub hasta comprobarlo.
