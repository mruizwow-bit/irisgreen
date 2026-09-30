# N-COORD-RESUME-001 · Resume gate obligatorio · 30/09/2026

## Problema
Las pausas, timeouts y reanudaciones han provocado que agentes continúen desde contexto viejo y escriban encima de HEADs que ya habían cambiado, generando regresiones, duplicación de interfaces y pérdida de integración.

## Regla dura
Después de cualquier timeout, cambio de chat, pausa prolongada, reinicio de agente, reanudación tras otra persona/agente trabajando o aviso de que otro carril ha subido cambios, antes de escribir se ejecuta un RESUME GATE.

## RESUME GATE
1. leer HEAD vivo de la rama objetivo;
2. leer HEAD vivo de coordinación canónica;
3. leer PR/issue activo del carril;
4. comprobar último deploy/CI si el carril es web;
5. comparar con el último SHA registrado al empezar el trabajo;
6. identificar commits nuevos de terceros;
7. si HEAD cambió: STOP de escritura y reconciliar/rebasar;
8. solo continuar cuando se haya registrado el nuevo punto de partida.

## Prohibido
- continuar desde memoria del chat;
- aplicar un patch preparado sobre un HEAD anterior sin comprobarlo contra la base viva;
- forzar un ref para volver al estado anterior;
- copiar encima de archivos compartidos sin comparar;
- declarar integrado un trabajo cuyo deploy/build falla;
- restaurar una versión antigua para hacer pasar un test.

## Carriles web
Para A2/R67 el gate de integración incluye build verde, una sola interfaz global visible, no flash de shell legacy, no controles duplicados, no footer duplicado y navegación/edad/música/accesibilidad funcionales.

## Registro
Cada reanudación relevante debe dejar resume_from_sha, live_sha, coord_sha, ramas/PR concurrentes y decisión UNCHANGED | REBASE_REQUIRED | CONFLICT_RECONCILED.

Esta norma tiene precedencia sobre instrucciones operativas antiguas que permitan continuar sin releer estado.