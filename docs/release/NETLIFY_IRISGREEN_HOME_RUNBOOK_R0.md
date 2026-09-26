# WEB-REL-R0 · Runbook Netlify CLI · irisgreen-home

**No autoriza despliegue.**

Identidad read-only verificada:
- site: `irisgreen-home`;
- site ID: `40042464-343c-4587-b6b7-f6159836e291`;
- dominio: `https://irisgreen.eu`;
- deploy producción observado R0: `6aa99a0d467202094ed9320f` · ready;
- deploy manual/drop, sin `commit_ref` ni source ZIP.

## Preparación

```bash
npm install -g netlify-cli
netlify login
netlify status
```

Si hace falta: `netlify link` y confirmar el site ID. No versionar `.netlify/`.

Dependencias:
```bash
python3 -m venv /tmp/ig-web-rel
/tmp/ig-web-rel/bin/pip install playwright==1.55.0 beautifulsoup4==4.13.4 pillow==11.3.0
/tmp/ig-web-rel/bin/python -m playwright install --with-deps chromium
npm install --prefix /tmp/ig-web-rel-node --no-save --ignore-scripts axe-core@4.13.0
```

Gate local: ejecutar `tools/web_release_gate_r0.py`; no continuar sin PASS.

Luego, todavía sin desplegar:
```bash
netlify build
```
y verificar `command = "python3 scripts/build_site.py"` / `publish = "dist"`.

## Rollback antes de cualquier futura publicación

Antes de reemplazar producción:
1. registrar deploy ID vigente;
2. archivar el `dist` conocido-bueno + manifest SHA-256 fuera del repo;
3. registrar SHA Git si existe;
4. conservar permalink.

Rollback:
- UI Netlify: volver a publicar el deploy conocido-bueno;
- CLI: si existe el `dist` exacto archivado, `netlify deploy --prod --dir=<KNOWN_GOOD_DIST>`.

No reconstruir aproximadamente un rollback.

## Comandos futuros, NO ejecutar en R0

Draft: `netlify deploy --dir=dist`  
Producción: `netlify deploy --prod --dir=dist`

R0 prohíbe deploy, --prod, alias y cambios de dominio.
