# R39-A2-CONEXION-R05 · Aplicar conexión Cloud privada en el montaje vigente

Fecha: 24/09/2026. Responsable: María + Agente 2. Estado al emitir: **EMITIDA_PENDIENTE_ACUSE**.

## Base real comprobada antes de emitir

- Repo: `mruizwow-bit/irisgreen`.
- PR vigente: **#244**.
- Rama A2: `agent2/sabik-iris-r08-20260924`.
- HEAD observado: `d52584344240deb352f712debd19e9e7ae76bdd2`.
- Cloud privado ya activado por Codex: `6ab56a1ba2f6d83e6fb7b408`.
- Cloud origin exacto: `https://6ab56a1ba2f6d83e6fb7b408--sabik-asistente.netlify.app`.
- Único origen web autorizado: `https://deploy-preview-244--irisgreen-home.netlify.app`.
- Parche autorizado y ya comprobado por Codex sobre este HEAD:
  `COORDINACION_IRIS_GREEN/EVIDENCIAS/R39_CODEX_R04_ACTIVACION/A2_CONNECT.patch`.

No crear otra conexión, otro panel ni otro transporte.

## Ejecutar

1. Confirmar que el HEAD de PR #244 sigue siendo `d52584344240deb352f712debd19e9e7ae76bdd2`. Si ha avanzado, **no retroceder ni restaurar base**: ejecutar primero `git apply --check` contra el HEAD vigente y detener solo si aparece un conflicto real.
2. Aplicar únicamente `A2_CONNECT.patch`.
3. Verificar que el delta funcional de esta orden toca solo:
   - `sabik/mount-config.mjs`
   - `sabik/iris-mount.mjs`
   - `sabik/iris-panel.html`
4. Resultado esperado:
   - `connectionConfig.enabled=true`;
   - `cloudOrigin='https://6ab56a1ba2f6d83e6fb7b408--sabik-asistente.netlify.app'`;
   - límite del campo y ayuda pública ajustados de 2000 a **300 caracteres** en ES y EN;
   - sin modificar biblioteca sellada, puente, agrupador, panel de resultados, Motion o masters.
5. Ejecutar el build y las pruebas acotadas del montaje afectado. No repetir auditorías generales ya realizadas. Comprobar como regresión mínima:
   - ES y EN conservan el mismo comportamiento;
   - formulario ya no aparece como “consulta no disponible” cuando la configuración activa corresponde;
   - límite real del textarea = 300 y la ayuda visible coincide en ambos idiomas;
   - teclado/foco/roles/nombres accesibles no regresan por este cambio;
   - móvil/reflujo de la superficie Sabik no empeora;
   - ninguna clave, cookie, token o secreto aparece en HTML/JS/storage.
6. Generar **un solo preview** de PR #244 con el cambio. No producción.
7. Registrar en #237 y coordinación:
   - HEAD nuevo;
   - deploy ID;
   - origen exacto;
   - rutas ES y EN;
   - build/pruebas ejecutadas y resultado;
   - confirmación de que el Cloud origin usado es el autorizado;
   - cualquier fallo reproducible, sin ocultarlo con fixtures.

## Handoff inmediato

Cuando A2 entregue HEAD/deploy/origen:

- **A3 retoma la orden R39-A3-USO-R04** únicamente para los cinco casos pendientes: resultados+fuentes reales, cero resultados, cancelación/sustitución, error/timeout recuperable y `lang=es` de citas dentro de UI EN.
- **Codex** comprueba la correlación HTTP real del transporte ya activado y atiende solo defectos reproducibles.
- No repetir teclado/Lectura/móvil salvo una regresión causada por este delta.

## Límites

No tocar producción, main, DNS, Team Login, secretos, biblioteca R38, voz, /api/chat, proveedor/modelo, embeddings ni contenido ajeno. No introducir fixtures para fingir conexión real. No abrir otra investigación de login: María confirma que su acceso funciona.

## Normativa y ES+EN obligatorios

Aplica `../../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md`. Mantener la web Iris Green como base, semántica/teclado/foco/reflujo de la superficie afectada, reduced motion, lenguaje claro y ausencia de jerga técnica pública. Todo texto público modificado debe estar completo en español e inglés. El corpus N04 continúa siendo español; no traducir citas silenciosamente ni declarar corpus EN.

La orden no certifica conformidad global WCAG/EN/ISO. Registra solo el resultado real de este cambio.
