# Bibliotecas del Taller (R43) · receta reproducible

Genera `assets/vendor/taller/` a partir de paquetes npm con versiones fijadas en `package.json`.

```
cd scripts/taller_suite/vendor
npm install
node build-vendor.mjs out   # y comparar con assets/vendor/taller/
```

- Todo se publica desde irisgreen.eu; ninguna biblioteca se carga desde servicios externos.
- La CSP de producción no permite `eval` ni `new Function`: PixiJS se empaqueta con `pixi.js/unsafe-eval` y cualquier `new Function` restante se cambia por una función que lanza `EvalError`.
- Rapier necesita `'wasm-unsafe-eval'` en la CSP para compilar WebAssembly. Mientras no se decida (A2/Astra), el estudio usa Planck.js (JavaScript puro). El WASM se publica aparte (`rapier2d.wasm`) y el código lo recibe en `globalThis.__IGRapierWasm`.
- `blockly-msg-extra.js` (254 traducciones al castellano que faltan en el paquete oficial) se genera con `scripts/taller_suite/blockly_es_extra.py`.
- Licencias: `assets/vendor/taller/LICENCIAS.txt`.

Verificado el 26/09/2026: la receta produce archivos idénticos byte a byte a los publicados (pixi, planck, acorn, codemirror, rapier2d.js y .wasm, three, tone, blockly y mensajes).
