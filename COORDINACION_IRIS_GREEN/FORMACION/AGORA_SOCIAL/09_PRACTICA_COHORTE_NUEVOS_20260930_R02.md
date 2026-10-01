# ÁGORA · PRÁCTICA DE COHORTE NUEVOS 2026-09-30 · R02

Fecha de análisis: 01/10/2026
Fuente: SEGUIMIENTO_SOCIAL_IRIS_GREEN_FINAL_20260930(1).xlsx
Estado: PRACTICA_COHORTE_D0_COMPLETADA_D7_D30_PENDIENTES

## 1 · Cohorte vigente

El fichero más reciente contiene:
- 21 perfiles nuevos seguidos;
- 10 Instagram;
- 11 Facebook.

Todos tienen fecha follow 30/09/2026.

## 2 · Unidad de análisis

No confundir perfil con entidad.

PROFILE_RELATIONSHIP:
plataforma + handle.

ENTITY_RELATIONSHIP:
persona/organización confirmada que puede tener varios perfiles.

Hay duplicidades evidentes por nombre/organización entre IG y FB, por ejemplo:
- National Autistic Society;
- Autismo Madrid;
- Autismo Sevilla;
- Autismo Córdoba.

Por tanto:
21 perfiles ≠ 21 entidades necesariamente.

No fusionar entidades automáticamente por parecido de nombre; confirmar identidad cuando sea material.

## 3 · Señal temprana D0/D1

Perfiles con señal temprana observable de reciprocidad en el registro:
1. Instagram nationalautisticsociety → LIKE_A_COMENTARIO_IRIS;
2. Instagram autisticauk → RESPUESTA_ESCRITA_AUTISTICA;
3. Facebook NationalAutisticSociety → REACCION_A_COMENTARIO_IRIS;
4. Facebook alfaSAACtodoscontamos → LIKE_A_COMENTARIO_IRIS.

Resultado profile-level:
4 / 21 = 19,0 % con señal temprana observable.

Esto NO es D7.
No significa que 81 % no esté interesado.
Solo significa que en el registro D0/D1 todavía no había otra señal nominal observable.

## 4 · Entity-level

Si se confirma que los perfiles IG/FB de National Autistic Society pertenecen a la misma entidad:
las cuatro señales profile-level representan al menos tres entidades distintas:
- National Autistic Society;
- Autistica;
- AlfaSAAC.

No calcular entity-level definitivo sin reconciliar todas las entidades.

## 5 · Tipos de señal

Separar:
- REACTION_ONLY;
- TEXT_REPLY;
- FOLLOW_BACK;
- COMMENT_ON_IRIS;
- REPEATED_RETURN;
- NONE_OBSERVED_YET.

Una reacción no equivale a conversación.
Una respuesta escrita demuestra más contexto, pero tampoco convierte automáticamente una relación en consolidada.

## 6 · Ventanas

D0/D1:
señal inmediata.

D7:
¿hubo retorno, respuesta, reacción adicional, follow-back o interacción espontánea dentro de 7 días completos?

D30:
¿la relación reapareció, se mantuvo intermitente o siguió sin señal?

Revisión de calendario 05/10 no equivale exactamente a D7 para altas del 30/09.

## 7 · Regla de no intervención

Medir D7/D30 NO requiere comentar otra vez para provocar una señal.

Si se vuelve a interactuar porque existe una aportación real:
registrar RETURN_ASSISTED.

Si la cuenta vuelve por sí misma:
registrar RETURN_SPONTANEOUS.

## 8 · Qué no inferir

NONE_OBSERVED_YET no significa:
- no interés;
- perfil falso;
- no lectura;
- rechazo de Iris Green.

Puede significar:
- no exposición;
- falta de tiempo;
- interacción silenciosa no nominal;
- cuenta institucional con dinámica lenta;
- relación todavía demasiado reciente.

## 9 · Próxima práctica

El 07/10 o cuando existan 7 días completos:
- revisar los 21 perfiles;
- reconciliar entidad/perfil;
- calcular profile-level D7;
- calcular entity-level D7 solo con identidades confirmadas;
- separar espontáneo/asistido;
- no dar de baja automáticamente.

Después repetir D30.

## 10 · Aprendizaje

Una cohorte útil necesita:
- fecha común;
- unidad clara;
- señal definida;
- ventana completa;
- denominador estable;
- distinción entre ausencia de evidencia y evidencia de ausencia.