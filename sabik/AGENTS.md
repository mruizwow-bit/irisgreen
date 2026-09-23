# AGENTS.md · Sabik / NEA

Estas instrucciones se aplican a todo trabajo bajo `sabik/` y a los archivos de integración de `/es/nea/`.

## Contratos no negociables

- Sabik acompaña la navegación convencional y nunca la sustituye.
- Todo procesamiento conversacional permanece en el navegador.
- No se añade ninguna API remota de IA.
- No se conserva historial entre sesiones.
- No se infieren ni comunican diagnósticos.
- Las respuestas deben estar sostenidas por contenido publicable de Iris Green.
- Deben distinguirse respuesta, aclaración, insuficiencia y ayuda humana.
- La voz es opcional, nunca automática y siempre tiene alternativa textual completa.
- Movimiento, color y forma no son la única vía para comunicar estado.
- `prefers-reduced-motion` y la preferencia manual deben respetarse.
- No tocar `main` ni producción. Los PR se dirigen a `sabik-preview`.

## Reglas de cambio

- Haz cambios pequeños, aislados y revertibles.
- No reconstruyas páginas completas.
- No mezcles Sabik con Juegos, Rutinas, Tarjetas Iris, Vídeos ni contenido editorial no relacionado.
- No debilites pruebas ni auditorías para hacerlas pasar.
- No cambies textos de Iris para mejorar el ranking.
- No inventes recursos humanos, teléfonos, URLs, territorios o fechas.
- No persistas mensajes, conceptos, respuestas ni preferencias conversacionales.
- Mantén HTML nativo antes que ARIA.
- No introduzcas dependencias de red o paquetes si el trabajo puede resolverse con la base actual.

## Fase activa en `sabik/s0-state-machine`

Implementa únicamente la máquina de estados y sus pruebas.

### Puedes modificar

- `nea-core/state.js`
- `nea-core/sabik-state.js`
- nuevo `nea-core/sabik-machine.js`
- pruebas nuevas relacionadas con estados
- documentación técnica de la fase

### No modifiques todavía

- `sabik-page.js`
- `sabik-page.css`
- `/es/nea/index.html`
- datasets editoriales
- comportamiento visible
- voz, TTS o animaciones

## Arquitectura S0

Usa capas ortogonales, no una enumeración monolítica:

1. ciclo operativo;
2. modo de diálogo;
3. adaptación;
4. seguridad;
5. visibilidad;
6. voz;
7. movimiento;
8. idioma.

La transición debe ser pura:

```js
const next = transitionSabikState(previous, event);
```

No debe consultar DOM, red, reloj, almacenamiento ni globals mutables. Los efectos se ejecutarán fuera de la máquina en fases posteriores.

Eventos mínimos:

- `BOOT_OK`
- `SUBMIT`
- `RETRIEVAL_OK`
- `RETRIEVAL_EMPTY`
- `RESPONSE_READY`
- `ASK_CLARIFICATION`
- `PAUSE_ASSISTANT`
- `RESUME_ASSISTANT`
- `RESET_SESSION`
- `COLLAPSE`
- `EXPAND`
- `SPEECH_START`
- `SPEECH_BOUNDARY`
- `SPEECH_PAUSE`
- `SPEECH_RESUME`
- `SPEECH_END`
- `SPEECH_ERROR`
- `RISK_UNCERTAIN`
- `RISK_CONFIRMED`
- `HUMAN_HANDOFF`
- `TECHNICAL_ERROR`
- `RETRY`

Invariantes:

- ocultar no cambia pausa;
- pausar no borra sesión;
- reset es independiente;
- voz y movimiento son independientes;
- riesgo prevalece sobre decoración;
- reducción de movimiento no impide voz ni texto;
- un evento inválido no produce un estado parcial silencioso;
- las cadenas de estado proceden de constantes exportadas;
- el estado inicial es serializable y clonable, aunque no se persista.

## Validación mínima

Ejecuta:

```bash
node tools/test-sabik-page-v7.js
python3 scripts/build_site.py
```

Añade una prueba específica de máquina que cubra, como mínimo:

```text
ready → retrieving → composing → presenting
presenting → speaking → speech_paused → speaking → speech_ended
presenting → assistant_paused → assistant_ready
assistant_paused → collapsed → expanded → assistant_paused
ready → risk_uncertain → awaiting_clarification
ready → risk_confirmed → human_handoff
error → retry → ready
reset desde todos los estados estables
```

El PR debe quedar draft contra `sabik-preview`, enlazar el issue #146 y explicar alcance, exclusiones, pruebas, riesgos y reversión.
