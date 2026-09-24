# R39-A4-C17-R02 · Evidencia aplicada de retención Netlify

Fecha: 2026-09-24  
Responsable: Agente 4  
Proyecto: `sabik-asistente`  
Site ID: `47b06e68-ff54-4097-8ad8-336b2d71758a`  
Orden: `R39-A4-C17-R02`  
Modo: solo lectura sobre Netlify; documentación de evidencia únicamente.

## 1. Alcance exacto de C17

La fuente de proyecto previa define el target técnico C17 como:

`application logs <= 7 days`

No es retención de conversación ni una obligación legal universal. El alcance acordado excluye prompt, conversation payload, response text, perfiles privados, token/cookie, raw IP de app log y datos Educa/menores.

Por tanto, esta comprobación no extiende el mismo límite a todos los registros de Netlify.

## 2. Evidencia aplicada al candidato R39

Lectura Netlify de solo lectura del deploy:

- deploy: `6ab4d5047d3729fae7f122aa`
- proyecto: `sabik-asistente`
- estado: `ready`
- contexto: `deploy-preview`
- publicado: no
- runtime: `nodejs24.x`
- región: `us-east-2`
- Function desplegada: `n04-library-qa`
- Edge Functions: ninguna
- Team Login/SSO: requerido para todos los contextos del proyecto.

El árbol Git del R39 integrado `66b6b551ad055ea9e367ebdff7246b381f4656d3` contiene la misma Function en:
`cloud/n04-r38-library/netlify/functions/n04-library-qa.mjs`
y no contiene `edge-functions` en ese subproyecto.

## 3. Política autoritativa Netlify

Documentación oficial consultada el 2026-09-24:

- Function logs: https://docs.netlify.com/build/functions/logs/
  - Netlify indica que los logs de actividad de Functions se conservan al menos 24 horas.
  - El periodo aumenta a 7 días para determinados planes.
  - La documentación de monitoring resume los Function logs como disponibles hasta 7 días según plan.
- Logs overview: https://docs.netlify.com/manage/monitoring/logs/
- Deploy retention: https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/
  - Los deploys/builds siguen otra política: 30 días por defecto o 90 días en planes de pago, con excepciones para ciertos deploys exitosos.
  - Por tanto NO se aplica a build/deploy el límite de 7 días de C17 por inferencia.

## 4. Matriz por categoría

| Categoría | Estado | Evidencia / justificación |
|---|---|---|
| Native Serverless Function logs de `n04-library-qa` | VERIFICADO | C17 pide application logs <=7 días. Netlify documenta retención nativa de Function logs de 24 h hasta 7 días. El candidato usa una Serverless Function real. |
| Edge Function logs | NO_APLICABLE_JUSTIFICADO | El deploy R39 declara “No edge functions deployed” y el árbol del subproyecto no contiene Edge Functions. |
| Build/deploy logs | NO_APLICABLE_JUSTIFICADO a C17 | Son registros operativos distintos. Netlify documenta una política de deploy/build diferente y potencialmente superior a 7 días; no se presenta como cumplimiento C17. |
| Function Metrics / Observability | NO_APLICABLE_JUSTIFICADO a C17 | Son métricas/observabilidad, no el application log definido por C17; su retención se trata por separado. |
| Log Drains / copias en proveedor externo | NO_APLICABLE_JUSTIFICADO a esta prueba de retención nativa | C17 aquí verifica la retención nativa Netlify de application logs. Si se habilitara un Log Drain, la retención del proveedor externo requeriría un control separado y no quedaría cubierta por este resultado. |

## 5. Veredicto

`C17_NATIVE_APPLICATION_LOG_RETENTION = VERIFICADO`

Se demuestra el requisito acordado para la categoría que C17 define: los logs nativos de la Serverless Function que ejecuta la consulta R39 tienen una política Netlify cuyo máximo documentado es 7 días.

Este veredicto NO afirma:
- que build/deploy logs duren <=7 días;
- que métricas/observabilidad duren <=7 días;
- que exista una obligación legal universal de 7 días;
- que una eventual copia externa mediante Log Drain herede esta retención.

## 6. Cambios realizados

- configuración Netlify: 0
- plan: 0
- retención: 0
- permisos: 0
- secretos/variables: 0
- Team Login: 0
- DNS: 0
- deploy/producción: 0
- código de producto: 0
- execution-policy: 0

`NO_APLICA_TEXTO_PUBLICO`: esta misión no modifica interfaz ni contenido público ES/EN.
