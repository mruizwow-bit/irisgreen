# R39-A3-USO-R04 · comprobación acotada sin repetición

Fecha: 24/09/2026  
Responsable: Agente 3  
Estado: `VERIFICADO_MONTAJE_DESACTIVADO_PENDIENTE_TRANSPORTE_REAL`

## Identidad del montaje

- A2 R09 HEAD: `89dcea56abc14d94914d0cb1bd005b902d46a29c`
- PR: #244
- Deploy irisgreen-home: `6ab5360d1b58030008d2f97a`
- ES: `/`
- EN: `/?lang=en`
- Netlify: ready / deploy-preview / no publicado
- Functions desplegadas: 0
- Edge Functions desplegadas: 0
- `sabik/mount-config.mjs`: `connectionConfig.enabled=false`, `cloudOrigin=null`

## Regla aplicada

María acota R39-A3-USO-R04 a comprobar únicamente lo que todavía no esté revisado en el montaje real. La evidencia ya existente se registra y no se repite.

## Matriz

| Caso | ES | EN | Estado | Evidencia / motivo |
|---|---|---|---|---|
| Identidad URL/HEAD/deploy | Sí | Sí | VERIFICADO_EN_SU_ALCANCE | A2 R09 + Netlify deploy exacto |
| Estado de conexión desactivada y no apariencia de biblioteca conectada | Sí | Sí | VERIFICADO_EN_SU_ALCANCE | mount-config: enabled=false; submit disabled en suite A2; textos públicos ES/EN de indisponibilidad |
| Teclado y foco | Sí | Sí | REGISTRADO_NO_REPETIDO | Suite A2 R08: Tab, toggle con Enter, reset devuelve foco al input |
| Lectura | Sí | Sí | REGISTRADO_NO_REPETIDO | Suite A2 R08 en 1440/320 con preferencias de Lectura y controles |
| Reduced motion / control de movimiento | Sí | Sí | REGISTRADO_NO_REPETIDO | Suite A2 R08 con contexto reduced_motion y SIN_MOVIMIENTO |
| Móvil / reflujo | Sí | Sí | REGISTRADO_NO_REPETIDO | A2 R08/R09: 320 px, sin overflow del montaje afectado; R09 añade 1920/1440/320 |
| Consulta real con resultados y fuentes | No ejecutable | No ejecutable | PENDIENTE_TRANSPORTE_REAL | Cloud desactivado; no sustituir por fixture |
| Consulta real sin resultados | No ejecutable | No ejecutable | PENDIENTE_TRANSPORTE_REAL | Requiere transporte real |
| Cancelación/sustitución de una petición real | No ejecutable | No ejecutable | PENDIENTE_TRANSPORTE_REAL | La lógica local ya fue probada por Codex; el montaje no tiene conexión activa |
| Error/timeout recuperable real | No ejecutable | No ejecutable | PENDIENTE_TRANSPORTE_REAL | No inducir fallo de plataforma ni alterar configuración |
| Citas ES con `lang=es` dentro de UI EN en montaje real | No ejecutable | No ejecutable | PENDIENTE_TRANSPORTE_REAL | No existen citas montadas mientras la conexión está desactivada |

## Evidencia ya existente no repetida

- A2 `ENTREGA_R08.md`: matriz navegador ES/EN, 1440/320, teclado, idioma, reflujo, reduced motion y Lectura.
- A2 `CORRECCIONES_R09.md`: HEAD/deploy vigente y 1920/1440/320.
- Codex R03 `BROWSER_QA.json`: resultados/fuentes, error/reintento, cancelación, foco, stale-result y citas ES; **local/fixture, no montaje A2**, por lo que no sustituye el pendiente de transporte real.

## Conclusión

No hay fallo nuevo reproducido en el montaje R09 dentro del alcance revisable. La experiencia montada declara correctamente que las consultas todavía no están disponibles y no simula una biblioteca conectada.

No procede repetir teclado, Lectura, móvil ni fixtures de Codex.

El cierre de consulta/fuentes/cancelación/error reales queda condicionado a que A2 reciba y active un transporte autorizado. Cuando exista un nuevo deploy conectado, A3 comprobará solo esos casos pendientes sobre la nueva identidad.

No PASS global. No aceptación visual de María. No lector de pantalla real ejecutado en esta actualización.

0 cambios de producto · 0 panel · 0 CSS · 0 deploy · 0 credenciales.
