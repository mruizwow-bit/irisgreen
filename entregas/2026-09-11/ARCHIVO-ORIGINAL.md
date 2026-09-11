# Copia exacta del ZIP recibido

Archivo recibido: `Web neurodivergente análisis(6).zip`

SHA-256: `61fba79d3f26a7b57e610cd8cb3990365f4d4217c1e9186567d0e336cc12f440`

El conector de GitHub disponible en esta sesión solo escribe archivos de texto mediante la API de contenidos. Para conservar **exactamente** el ZIP sin alterar sus bytes, se guarda su Base64 en 15 partes bajo `entregas/2026-09-11/archive/`.

Para reconstruirlo en Linux/macOS:

```bash
cat entregas/2026-09-11/archive/Web-neurodivergente-analisis-6.zip.b64.part* \
  | base64 -d > "Web neurodivergente análisis(6).zip"
sha256sum "Web neurodivergente análisis(6).zip"
```

El SHA-256 obtenido debe ser exactamente:

```text
61fba79d3f26a7b57e610cd8cb3990365f4d4217c1e9186567d0e336cc12f440
```

Esta rama es solo de entrega/seguridad. No modifica `main`, no publica la web y no sustituye la validación por tandas indicada en `LEEME-PRIMERO.md`.
