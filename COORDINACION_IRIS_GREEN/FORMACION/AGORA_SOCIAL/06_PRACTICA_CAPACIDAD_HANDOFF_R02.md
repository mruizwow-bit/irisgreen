# ÁGORA · PRÁCTICA DE CAPACIDAD Y HANDOFF R02

Fecha: 01/10/2026
Estado: PRACTICA_R02_COMPLETADA_CON_PENDIENTE_DE_CALIBRACION

## 1 · Caso real

Fuentes revisadas:
- Issue #343;
- Excel SEGUIMIENTO_SOCIAL_IRIS_GREEN_FINAL_20260930;
- formación social previa;
- Metricool.

Estado observado en la orden social:
- 114 fieles consolidados;
- 20 pendientes de cierre en el momento de la orden;
- 12 nuevos registrados (IG + FB);
- Instagram y Facebook activas;
- TikTok fuera.

El Excel vigente contiene para nuevos:
- plataforma;
- cuenta;
- nombre;
- fecha follow;
- motivo;
- primer contacto;
- última interacción;
- próxima revisión;
- relación;
- reciprocidad;
- revisión lunes;
- notas;
- estado revisión;
- días.

## 2 · Diagnóstico de escalabilidad

Fortalezas:
- existe fecha;
- existe siguiente revisión;
- existe estado relacional;
- se conserva primer/último contacto;
- hay notas y estado;
- se separan plataformas.

Gap al pasar de 1 a varios Community Managers:
- no hay owner explícito;
- no hay backup;
- siguiente acción no está normalizada en todos los registros;
- no hay campo de handoff;
- una nota libre puede ser suficiente para una persona, pero ambigua para un equipo.

## 3 · Simulación de dos Community Managers

Supuesto:
CM-A revisa una relación y encuentra una publicación pertinente.
Antes de comentar, CM-B abre la misma relación.

Sin ownership compartido:
- riesgo de dos comentarios;
- riesgo de dos notas contradictorias;
- riesgo de marcar dos próximas revisiones;
- la persona puede percibir comportamiento mecánico.

Con ownership:
- CM-A marca IN_PROGRESS;
- CM-B ve owner/estado y no duplica;
- CM-A registra acción y next step;
- al liberar, cualquier CM puede continuar con historial mínimo.

## 4 · Simulación de handoff

Registro mínimo ficticio:

PLATFORM=INSTAGRAM
HANDLE=cuenta_ejemplo
RELATION_STATE=INTERMITENTE
OWNER=AGORA_1
LAST_ACTION=respuesta contextual verificada
LAST_INTERACTION_DATE=2026-09-29
NEXT_ACTION=revisar publicación nueva cuando exista aportación real
NEXT_DATE=2026-10-06
NOTE_MINIMA=relación existente; no duplicar comentario reciente

Otro CM puede continuar sin preguntar a María ni reconstruir semanas de contexto.

## 5 · Privacidad

NO incluir en el handoff ficticio:
- diagnóstico inferido;
- salud mental;
- historia familiar íntima;
- información que no sea necesaria para la interacción comunitaria.

## 6 · Métricas para calibrar staffing

Durante varias jornadas reales medir:
- NEW_INBOUND;
- FOLLOWUPS_DUE;
- FOLLOWUPS_COMPLETED;
- MODERATION_CASES;
- BACKLOG_OPEN;
- BACKLOG_AGE;
- AVG/P50/P90_HANDLE_TIME cuando sea viable;
- DUPLICATES_OR_REWORK;
- CONTEXT_GAPS;
- AFTER_HOURS_LOAD.

## 7 · Criterio de interpretación

No hay base todavía para una ratio fija por número de seguidores.

Se necesita ayuda cuando la demanda sostenida supera capacidad y empieza a degradar:
- tiempo;
- seguimiento;
- contexto;
- personalización;
- moderación;
- bienestar/carga.

## 8 · Resultado de la práctica

PASS:
- se identifica el gap multiagente;
- se propone ownership mínimo;
- se protege privacidad;
- no se inventa un ratio staffing/followers;
- se reconoce que el estado actual necesita medición antes de pedir un número concreto de incorporaciones.

Pendiente:
calibrar con ejecución real y datos de varias jornadas.