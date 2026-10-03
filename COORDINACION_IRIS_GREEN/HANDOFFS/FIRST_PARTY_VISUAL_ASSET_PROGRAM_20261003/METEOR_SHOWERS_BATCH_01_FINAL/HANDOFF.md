# HANDOFF · CROMA → METEOR SHOWERS BATCH 01 REVIEW

Gate: `METEOR_SHOWERS_BATCH_01_FINAL_10_PASS_READY_FOR_REVIEW`

## Entrega

Colección cerrada en una tanda:
`10 masters → JSON factual → contact sheet 5×2 → QA`

No se regeneró arte durante el cierre técnico.

### Orden canónico
1. Cuadrántidas
2. Líridas
3. Eta Acuáridas
4. Delta Acuáridas del Sur
5. Perseidas
6. Oriónidas
7. Táuridas
8. Leónidas
9. Gemínidas
10. Úrsidas

### Contrato de masters
- 10/10 · 1536×1536
- PNG RGB
- sRGB ICC embebido
- sin texto/UI/logos/datos horneados
- arte = `REPRESENTATION`
- datos = capa separada

### QA visual
María ya validó la diferenciación de la colección antes de normalización. La normalización conserva encuadre/composición y solo realiza resampling a 1536² + incorporación de ICC sRGB.

### Datos
Contact sheet factual:
- nombre;
- periodo;
- pico;
- ZHR;
- velocidad;
- radiante;
- progenitor.

Cautelas:
- Southern Delta Aquariids: asociación de progenitor no cerrada;
- Táuridas: Southern Taurids usada como única base cuantitativa declarada.

### Integración
No `main`, no runtime y no web en este handoff.
El siguiente consumidor debe tomar estos assets solo después del batch review correspondiente.
