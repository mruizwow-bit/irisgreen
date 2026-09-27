# Handoff A2 · Sabik Audio Library R01 final · 27/09/2026

Estado: `SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED_HANDOFF_READY`.

## Artifact

María entregó `SABIK_AUDIO_LIBRARY_R01_FINAL.zip`.

Verificación Astra:
- ZIP recibido SHA-256: `fd6f73544fbd6153c077a302a275b7d893cee4e49104d7140ca7153b2a49eadc` — MATCH.
- 30/30 hashes de audio internos coinciden con `manifest.json`.
- 15 ES + 15 EN.
- Machine QA: PASS.
- loudness: -16.5 LUFS en 30/30.
- pico máximo: -1.0 dBFS.
- clipping: 0.
- limitador lookahead usado en 10/30; reducción máxima 2.774 dB.
- paquete de handoff con metadata corregida: SHA-256 `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`.
- **Los bytes de los 30 WAV no cambiaron** en el paquete verificado; solo se corrigió/completó metadata y procedencia.

## Modelos finales

EN:
- ID: `SABIK_EN_R02_FINAL`
- model SHA-256: `3aec07b84f81b199af25e170a044b51c96b54f9ec24ed4b77bc3a13b4f47e9df`
- config SHA-256: `6ac9cbf2727344d18fbb4d66ea8274b675f64a14b0737e9e28801181e96c0abd`

ES:
- ID: `SABIK_ES_R01_FINAL`
- model SHA-256: `8100e9770471094efae26c186c9020056c35c55e9b0822aaec800f1affd1c291`
- config SHA-256: `6c62a7c419fe2a72c64c51f2e143fc702ba552e12c31ff2bda31feeee1ab5a9e`

No subir masters humanos ni modelos entrenados al GitHub público.

## Fuente web y copy

Fuente runtime verificada: PR #244, HEAD `bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`.

Aplicar **todo** `SABIK_COPY_PRODUCCION_R02_20260927.csv` antes de enlazar audio:
- 40 registros fijos;
- 25 KEEP;
- 15 REVISED;
- 0 HOLD.

Cambios R02 que deben quedar exactos:
- `sabik.status.unavailable`: «La búsqueda en fuentes todavía no está disponible.» / “Source search is not available yet.”
- `sabik.status.available`: «La búsqueda en fuentes está disponible.» / “Source search is available.”
- `sabik.action.low`: «Desactivar movimiento» / “Turn off motion”.

La biblioteca fija contiene solo los 15 IDs con política `SYSTEM_VOICE` o `SYSTEM_VOICE_OPTIONAL`.

## Integración A2

1. Copiar los 30 WAV a assets versionados Sabik, preservando nombre y hash.
2. Importar/servir el mapa de `manifest.json`: `id + language -> file + text_sha256 + audio_sha256`.
3. Selección de idioma por el idioma real de la interfaz; nunca cruzar ES/EN.
4. Reproducción de `SYSTEM_VOICE` **solo cuando la voz de Sabik esté habilitada por el usuario en la sesión**.
5. `SYSTEM_VOICE_OPTIONAL`: no autoplay; puede reproducirse por acción explícita o decisión de producto posterior.
6. `SCREENREADER_ONLY` y `UI_SCREENREADER`: no convertirlos en audio propio de Sabik. Mantener live regions para AT y evitar doble habla.
7. Un nuevo estado/acción cancela el audio anterior antes de iniciar otro.
8. No almacenar conversación ni historial de audio. No introducir persistencia nueva por este handoff.
9. No sintetizar resultados dinámicos/artículos en este lote; R01 es solo copy fijo. Texto dinámico sigue en su fuente canónica.
10. Si cambia un texto locutado, comparar `text_sha256`; el audio queda inválido y debe regenerarse/versionarse.

## Control de voz

Si el panel todavía no dispone de control de voz propio, A2 debe añadir un control visible y accesible ES/EN:
- estado inicial de la sesión: voz desactivada;
- botón/toggle con nombre y estado accesibles;
- no autoplay antes de la activación del usuario;
- no depender de hover, color o movimiento;
- no guardar la preferencia mediante almacenamiento nuevo en este lote.

## QA mínimo en Deploy Preview

- ES/EN.
- escritorio + móvil.
- teclado completo.
- activar/desactivar voz.
- cambio de idioma.
- cancelación/reemplazo de audio.
- error, busy, empty, cancelled, connected y reset.
- sin doble locución por live region + Sabik.
- `prefers-reduced-motion` y control `Desactivar movimiento` no deben alterar audio.
- 30 assets: HTTP 200, MIME de audio correcto, hash esperado.
- sin requests de audio antes de que la voz se active, salvo preload explícitamente rechazado: **no preload de 30 audios**.
- no main / no producción hasta HUMAN QA de María.

## Exclusiones

- modelos Qwen/weights;
- masters humanos o lingüísticos;
- entrenamiento;
- Team Login;
- secretos;
- producción;
- narración dinámica de artículos/resultados.

## Artefacto físico entregado a A2 · 27/09/2026

El archivo exacto aportado por María y vuelto a verificar por Astra está disponible en la Biblioteca persistente de ChatGPT para recuperación por A2:

`/SABIK/HANDOFFS/SABIK_AUDIO_LIBRARY_R01_FINAL_VERIFIED.zip`

Identidad obligatoria antes de extraer:
- tamaño: 5.096.173 bytes;
- SHA-256: `96e570048c5fc44ceda28b911eb2dfa8fc608099101ccd2da7b33a109e0b1f0c`;
- 36 entradas ZIP;
- 30 WAV = 15 ES + 15 EN;
- 15 IDs, cada uno presente en ambos idiomas.

Verificación Astra independiente sobre el ZIP:
- 30/30 `audio_sha256` coinciden con `manifest.json`;
- 30/30 `text_sha256` coinciden con el texto locutado;
- 30/30 textos coinciden con `SABIK_COPY_SPOKEN_R02.json`;
- 0 clipping;
- 0 discrepancias.

A2 debe recuperar **este artefacto exacto** por nombre/ruta y verificar SHA-256 antes de montarlo. No usar paquetes anteriores `FINAL`, `LIMITER_FIX`, candidatos E0/E1/E2 ni WAV sueltos de entrenamiento/validación.

### Orden de montaje

1. releer HEAD/tree A2 real;
2. aplicar primero los 40 registros de `CONTROL/SABIK_COPY_PRODUCCION_R02_20260927.csv`;
3. comprobar específicamente `sabik.action.low` = `Desactivar movimiento / Turn off motion`;
4. extraer solo los 30 WAV + metadata necesaria del paquete final verificado;
5. montar assets versionados preservando nombres y hashes;
6. enlazar `id + lang -> file + text_sha256 + audio_sha256`;
7. añadir control `Voz de Sabik / Sabik voice`, OFF al inicio de cada sesión;
8. sin preload/autoplay antes de activación;
9. parar audio anterior al cambiar estado, idioma, resetear o iniciar otra acción;
10. no locutar copy `UI_SCREENREADER` / `SCREENREADER_ONLY`;
11. no narrar resultados dinámicos ni artículos en este lote;
12. CI + Deploy Preview + HUMAN QA María.

Los modelos/masters no se copian al producto. Solo se conservan sus hashes de procedencia.
