# I0 · RESPUESTA A SEGUNDA REVISIÓN ADVERSARIAL · V0.3

**Fecha:** 20/09/2026  
**Dictamen recibido:** `I0_NO_APROBABLE`

## Cinco bloqueantes mínimos

1. **Canal S0:** añadido `s0Events: CoreS0Event[]`; human_help normal no emite HUMAN_HANDOFF.
2. **Límite S1:** 2000 code points, sin truncado.
3. **Tipos cerrados:** S0 enums, IntentCommand discriminado, SabikAction cerrado y tabla intención→riesgo.
4. **Seguridad/contexto:** pendientes invalidados, RISK_CLEARED no ejecuta cláusula ordinaria del mismo turno, negación ordinaria fuera del gate.
5. **Rutas duplicadas:** ATRAS sin undo; DETENER sin step_by_step; aliases lingüísticos normalizan a intent canónico.

## B1–B15

- B1: matriz de presentación añadida.
- B2: regla «deja de/para de» añadida.
- B3: multiacción y ejecución parcial definida.
- B4: local_with_loss definido por tabla + umbral provisional más estricto.
- B5: LastAction con inverse; navegación/reset elimina undo.
- B6: reset invalida pendientes y contexto, conserva preferencias.
- B7: PendingClarification usa candidates tipados.
- B8: lastSources añadido; nueva lista sustituye slots.
- B9: excludedContentIds añadido.
- B10: Core NL ES-only en I0/I1; EN conserva UI S1 y responde out_of_scope.
- B11: saved = IGPreferences existente / ig-a11y, solo capacidades soportadas.
- B12: human_help offline exige recurso verificado o fallback editorial aprobado.
- B13: DETENER assistant emite PAUSE_ASSISTANT y usa mismo anuncio S1; foco natural si origen texto.
- B14: añadido I0_SAFETY_GATE_MAPPING_V0_1.md con referencia PR #162.
- B15: índice no se fragmenta por temas sensibles identificables; precarga/partición gruesa opaca.

## Estado

I0 sigue ABIERTO.

Pendiente:
- tercera revisión de Claude;
- corpus #173 actualizado a v0.3;
- calibración de umbrales;
- verificación automática S0/S1;
- artefacto editorial de human-help si esa función se declara disponible offline.
