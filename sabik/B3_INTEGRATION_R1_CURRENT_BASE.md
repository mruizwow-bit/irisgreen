# SABIK · B3 INTEGRATION R1 · CURRENT PREVIEW

**Estado:** CANDIDATE  
**Base:** `fc5cdfc2f978c85033de2b07c34309f8a4a7bd18`

B3 se integra **encima del Sabik S4 actual**. No sustituye ni reescribe la máquina conversacional.

## Proyección

| Señal existente | B3 |
|---|---|
| ready / espera | PRESENTE |
| retrieving / composing / presenting | PRESENTE |
| awaiting_clarification / corrección | ORIENTAR |
| paused / pausa | PAUSA |
| error | PRESENTE + UI de error existente |
| risk / protection | PRESENTE + Safety existente |
| voz | sin cambio B3 |

TRANSICIÓN y CONFIRMAR se invocan solo como estados de presentación funcional explícita, nunca como progreso técnico.

## Assets corregidos

Runtime:
- 15 WebP;
- 3 presencias × 5 estados;
- todos normalizados a **64×64**;
- `web_confirmar.webp` corregido desde la inconsistencia 96×96 del candidato R0;
- manifest con SHA-256, bytes y dimensión por archivo;
- fuentes visuales congeladas en #182.

Si un asset falla, permanece visible el holograma legacy. No desaparecen texto ni controles.

## Presencias

`web · ia · educa`

La superficie real `/es/nea/` declara `ia`.

## S4

El lock R1 conserva byte-a-byte:
- Core/S0;
- lógica S4;
- runtime S4;
- pruebas S1/S4;
- adaptador QA0;
- storage probe.

El HTML recibe solo la capa de presentación B3 y el CSS recibe estilos B3/cognitivos.

**NO MERGE · NO DEPLOY.**
