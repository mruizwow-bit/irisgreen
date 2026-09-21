# I0 · RESPUESTA A TERCERA REVISIÓN ADVERSARIAL · V0.4

**Fecha:** 20/09/2026  
**Dictamen recibido:** `I0_NO_APROBABLE`

## Dos bloqueantes restantes

1. **SabikInput:** restaurado como tipo cerrado con S0 tipado, preferencias, contexto, locale, ruta, texto y `nowMonotonicMs`.
2. **RISK_CLEARED:** eliminado el reenvío del texto de riesgo completo. Solo una cláusula ordinaria separada previamente puede entrar una vez en postSafetyResolved; sin cláusula ordinaria, no hay acción.

## B1–B8 de tercera revisión

- B1 orden S0: ciclo y eventos de control definidos en §15.
- B2 mapeo IGPreferences: tabla exacta de tamaño/movimiento; none, stepByStep y simpleView sesión-only.
- B3 reset: Sabik nunca llama `IGPreferences.reset()`; solo scale/motion gestionados y los nombra.
- B4 navegación: siempre última; avisa si destruye preferencias de sesión.
- B5 candidato explícito: no reaplica umbral; with_loss confirma solo por pérdida real.
- B6 actividades: speech, assistant, step-by-step y petición ordinaria ambigua definidos.
- B7 excludedContentIds: se limpia al cambiar query normalizada.
- B8 ES-only: no se usa locale para inferir idioma; parser español intenta coincidencia y, si falla, out_of_scope.

## Mejoras adoptadas

- CoreS0Event retira RESET_SESSION y RESUME_ASSISTANT.
- `origin=system` refleja `prefers-reduced-motion`.
- confirmación se elimina al usarla; no campo `used`.

## Estado

I0 sigue ABIERTO hasta:
- revisión independiente de v0.4;
- corpus #173;
- calibración;
- verificación automática S0/S1;
- artefacto human-help offline si se declara esa capacidad.
