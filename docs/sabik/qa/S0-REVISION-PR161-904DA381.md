# S0 · cuarta revalidación de PR #161

**Implementación:** `904da38156fa390c330a02a3b9717cf6d92a3080`  
**Contrato normativo congelado:** `e69929b4b88128c4c935435987f35532f37d2df0`  
**Veredicto:** `BLOQUEADO_S0`

## Alcance

El diff `sabik-preview...904da381` contiene exclusivamente:

- `sabik/AGENTS.md`
- `sabik/S0_STATE_MACHINE.md`
- `sabik/nea-core/sabik-machine.js`
- `tools/test-sabik-machine-s0.js`

No invade panel, HTML, CSS, datasets, `main` ni producción.

## Correcciones del ciclo anterior verificadas en fuente

- `RISK_CLEARED` queda permitido únicamente desde `safety=uncertain`.
- Desde `normal`, `risk` y `human_handoff` el evento se rechaza antes de devolver un estado nuevo; el estado de entrada no se muta porque la transición trabaja sobre un clon.
- Desde `uncertain`, `RISK_CLEARED` produce `retrieving / clarification / normal / silent / processing`.
- `SPEECH_PAUSE` produce `speech=paused` y `motion=off`.
- `SPEECH_ERROR` produce `motion=off`, salvo protección activa, donde conserva `protection_static`.
- `speech_meta` y `motion_meta` se aceptan como opcionales en la frontera pública y se normalizan internamente.

## Bloqueo C01 · contrato base y adenda no son simultáneamente ejecutables

El contrato base congelado todavía contiene:

- `EV-SPEECH-START`: `speech=silent + SPEECH_START -> speaking`;
- `EV-SPEECH-START-REDUCED`: `speech=silent + SPEECH_START -> speaking/off`;
- `EV-SPEECH-ERROR`: espera `motion=ambient`.

La adenda B06/B07 del mismo SHA congela en cambio:

- `SPEECH_REQUEST -> starting`;
- `SPEECH_START` solo representa `speechSynthesis.onstart` y parte de `starting`;
- `SPEECH_ERROR -> motion=off`.

La implementación `904da381` sigue la semántica posterior de la adenda. Por tanto, al ejecutar los dos runners ordenados, el runner base y la adenda imponen expectativas incompatibles. No se modifica el contrato durante esta revalidación: la contradicción se registra como defecto de QA bloqueante que debe resolverse explícitamente antes de una aceptación.

## Bloqueo C02 · movimiento reducido de la adenda no queda representado por el payload de voz

La adenda contiene filas como:

- `VOICE-SPEECH-REQUEST-REDUCED` con `{ reduced_motion: true }`;
- `VOICE-SPEECH-START-REDUCED` con `{ reduced_motion: true }`;
- `VOICE-SPEECH-RESUME-REDUCED`, `STOP-REDUCED` y `END-REDUCED` con el mismo criterio.

En `904da381`, los handlers `SPEECH_REQUEST`, `SPEECH_START`, `SPEECH_RESUME`, `SPEECH_STOP` y `SPEECH_END` determinan el movimiento desde `motion_meta.reduced`; no consumen `event.reduced_motion`. Si el estado canónico omite `motion_meta` —permitido por la propia adenda— la normalización lo fija a `reduced=false`. Así, esas filas no pueden producir `motion=off` solo por el payload contractual.

Corrección mínima esperada: definir una única fuente contractual para reducción de movimiento. No adaptar el runner a la implementación de forma silenciosa. Si el contrato mantiene esos payloads, la transición debe consumirlos; si la preferencia debe residir únicamente en estado, la corrección requiere una decisión contractual explícita y versionada fuera de este ciclo.

## B05 · build Linux no demostrado

Para `904da381` GitHub no expone workflow runs ni statuses de CI. En este entorno QA no existe un checkout completo del repositorio y el acceso de red del contenedor a GitHub está bloqueado, por lo que no se puede ejecutar de forma independiente `python3 scripts/build_site.py` sobre el árbol completo.

El `27/27`, el `28/28` y el fallo Windows declarados por Codex no se heredan como resultados QA.

## Límite de `dist`

La inspección estática de `scripts/build_site.py` confirma que el build crea `dist` desde cero, copia solo `PUBLIC_DIRS`/`PUBLIC_ROOT` y al final rechaza rutas que empiecen por `scripts/`, `reports/`, `editorial/`, `pt-br/`, `.github/` o `_audit/`. `repair_routes.py` fija `PUBLIC_DIRS = ('assets','audio','img','es','en','sabik')`. Por diseño, `docs/sabik/qa/**` no entra en `dist`.

Esta comprobación estática no sustituye el build Linux `exit 0` ni la inspección del artefacto generado.

## Pureza e invariantes

La revisión estática del módulo muestra una frontera CommonJS sin `window`, clonación del estado antes de mutarlo y catálogo cerrado de valores. Los bloqueos actuales no provienen de acceso DOM/red/almacenamiento.

La confirmación ejecutable de pureza, determinismo, inmutabilidad y serialización sigue dependiendo de los runners canónicos en un checkout combinado reproducible.

## Pruebas no heredadas

No se marcan como PASS QA por provenir del entorno local de Codex:

- `node tools/test-sabik-machine-s0.js -> 27/27`;
- `node tools/test-sabik-page-v7.js -> 28/28`.

Tampoco se marca V7 como PASS por inferencia del diff.

## Salida

`BLOQUEADO_S0`.

Para una nueva puerta deben concurrir:

1. contrato base/adenda ejecutables sin contradicción o una regla de supersesión explícita y versionada;
2. semántica de movimiento reducido coherente entre estado, payloads y runner;
3. ejecución independiente de suite propia, V7, contrato base y adenda;
4. build Linux completo `exit 0`;
5. comprobación del artefacto `dist`;
6. revisión semántica delta de Claude antes de abrir S1.

PR #161 y PR #164 permanecen en `draft`; `main`, producción y `noindex` no cambian.