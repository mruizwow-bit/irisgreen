# R66 · A2 · Sabik conversacional tipo Alexa · 29/09/2026

Issue: #332  
Estado: `R66_A2_SABIK_CONVERSATIONAL_INTEGRATION_ORDERED`.

María fija el producto completo:
- texto o voz;
- voz → STT;
- mismo Core/safety/sesión;
- Biblioteca Cloud como conocimiento;
- Core formula respuesta;
- texto + fuentes;
- TTS dinámico con voz Sabik para interacción hablada.

La Biblioteca Cloud NO es la voz ni una UI de buscador.

Baseline Core PRE-#144 recuperable:
`sabik/nea-core/{intent,retrieval,decision,response,risk,corrections,session,knowledge}`.

A2 actual:
- Sabik nuevo;
- Motion R37;
- retrieval;
- 30 WAV fijos;
- sin mic conversacional ni TTS dinámico.

Cloud:
R04 privada parcial verificada puede usarse para construcción/QA, con 352 HOLD fuera. Gate final exige R04 final aceptada.

Voz:
30 WAV se conservan para sistema/fallback. Respuesta dinámica usa identidad vocal aprobada; no browser SpeechSynthesis ni otra voz.

Se versiona addendum normativo Sabik específico porque esta decisión supersede la antigua regla web sin mic/STT/TTS dinámico.

Marcador intermedio:
`R66_A2_SABIK_CONVERSATIONAL_PRIVATE_PREVIEW_READY_FOR_ASTRA`.

Marcador final:
`R66_A2_SABIK_ALEXA_STYLE_ES_EN_PREVIEW_READY_FOR_MARIA`.

No main. No producción.