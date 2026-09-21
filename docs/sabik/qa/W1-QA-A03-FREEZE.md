# W1-QA-A03 · Freeze independiente

Autorización: DEC-020.

Baseline:
`0a1d4339bae2628dc963501a30f326553605821b`

Este gate se congela **antes de cualquier implementación A03 de Codex**.

Principio congelado:

> Safety/protección no debe, por sí sola, inferir un estado cognitivo de la persona ni modificar sus preferencias/adaptaciones.

La protección puede cambiar legítimamente presentación y comportamiento protector. Por tanto, `adaptation_changed` incluye exclusivamente:
- `session_preferences`;
- `low_intensity` como preferencia/adaptación.

Y excluye explícitamente:
- `protection`;
- `functional_state`;
- `interaction`;
- `mode`;
- `visual_presence`;
- bloqueo del flujo ordinario.

El corpus consta de 12 escenarios semánticos sintéticos y no vuelve a congelar reconocimiento lingüístico A01. Las señales Safety se expresan como acciones semánticas para medir el acoplamiento A03.

El runner requiere un adapter externo QA y compara observables congelados. El adapter no forma parte del freeze contractual.

No runtime modificado. No S0, risk.js, response.js, retrieval.js, session.js, sabik-state.js, page runtime, A01, A02, B3, voz, datasets, main ni Netlify.

NO MERGE. NO DEPLOY.
