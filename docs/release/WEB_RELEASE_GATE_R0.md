# WEB-REL-R0 · Gate de release WEB

Base inicial: `main@fb396a2d4963045d489970866c5089a8e28e9533`.

Bloquea si falla:
1. checkout limpio;
2. build base/candidato;
3. tests estructurales, privacidad, seguridad, sin-JS y navegador;
4. inventario de tamaño;
5. ningún archivo **añadido** > 10.000.000 bytes;
6. manifests SHA-256 y diff de artefacto;
7. smoke HTTP;
8. los tres P1 frontend de #179;
9. rollback Git + Netlify identificado.

Comando:

```bash
python3 tools/web_release_gate_r0.py \
  --base fb396a2d4963045d489970866c5089a8e28e9533 \
  --browser-python /tmp/ig-web-rel/bin/python \
  --axe /tmp/ig-web-rel-node/node_modules/axe-core/axe.min.js \
  --rollback-deploy-id 6aa99a0d467202094ed9320f
```

Evidencia por defecto: `/tmp/irisgreen-web-rel-r0` con `gate.json`, manifests, diff, smoke, rollback y logs.

Solo `status=PASS` permite una orden separada de deploy.
