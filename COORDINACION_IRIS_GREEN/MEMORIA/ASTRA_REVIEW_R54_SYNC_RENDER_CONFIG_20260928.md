# R54 · Astra review R54-SYNC · render-config fingerprint pendiente · 28/09/2026

Issue: #318.

Estado:
`R54_ASTRA_SYNC_LOGIC_PASS_RENDER_CONFIG_FINGERPRINT_REQUIRED`

## Artefactos revisados

- R54_SYNC.patch · sha256 fd8d6fa89f641cb9e6ba93eabf5b199deef637f5aca426a879e7660ff39beccb
- R54_SYNC.patch.gz · sha256 0acae37095ffe42fe275d4f8e403b5dca65f5aee7eea6c3a57e43c738a45affc
- manifest y prueba negativa adjuntos.

El gzip y el patch plano son equivalentes.

## PASS

El delta no toca:
- WebP;
- escenas rica_<slug>.py;
- portada.

La dirección visual 6/6 queda congelada.

Queda resuelto:
- hash del SVG final generado;
- hash 1x/2x;
- dimensiones;
- hook en build_site.py;
- source stale => check/build FAIL;
- reraster => PASS;
- chromium.launch ausente => exit 2 limpio;
- cadena de patches corregida;
- cache-bust documentado como 2 launchers, no 58 rutas.

## Único bloqueo

El manifest registra settings de render/calidad, pero check_escenas_sync.py no los valida contra la configuración actual.

Por tanto un cambio en:
- quality 1x/2x;
- metodo WebP;
- color space;
- wait;
- DPR u otro setting efectivo

puede dejar WebP antiguos y el checker seguir verde mientras SVG/hash/dimensiones no cambien.

Además, con render parcial de un slug tras un cambio global, el manifest superior puede declarar settings nuevos mientras otras escenas siguen con outputs anteriores.

## Corrección final

Añadir `render_config_sha256` por escena, calculado sobre todos los settings efectivos que afectan el output.

Rasterizador:
- usa esos settings compartidos;
- escribe fingerprint por entrada.

Checker:
- recalcula fingerprint por slug;
- mismatch => RENDER_SETTINGS_MISMATCH + exit 1.

Prueba negativa E:
- mutar setting efectiva sin reraster => check/build FAIL;
- reraster => PASS.

Marcador esperado:
`R54_CLAUDE_RASTER_CONFIG_FINGERPRINT_READY_FOR_ASTRA`

No rework visual.
No 21+9 todavía.
No A2/main/producción.
