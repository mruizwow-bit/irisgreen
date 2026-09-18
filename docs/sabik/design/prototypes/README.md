# Prototipos · Sabik Design

**NO PUBLICAR.**

Runtime generado exclusivamente para abrir el prototipo local.
Contiene evaluación dinámica propia de la herramienta de diseño.
No es apto para CSP de producción.
No copiar a `assets`, `sabik` ni `dist`. **Ojo con `sabik/`**: está en
`PUBLIC_DIRS`, así que un `support.js` ahí sí se publicaría.

---

## Contenido

| Archivo | Qué es |
|---|---|
| `Banco de estados y voz.dc.html` | Banco de pruebas de los seis ejes y del motor de energía. Referencia de implementación. |
| `support.js` | Runtime de la herramienta de diseño. **Necesario para abrir el `.dc.html`.** Usa `new Function`. |

El HTML enlaza `./support.js`, así que no se puede subir solo el `.dc.html`.
Los dos archivos viven únicamente aquí.

## Comprobación de build · ya defendida

Verificado contra `scripts/` en la rama. **`docs/` no puede llegar a `dist/`**, y
no por omisión: por tres barreras independientes.

**1 · El build copia por lista blanca, no por lista negra.**

```python
# scripts/repair_routes.py
PUBLIC_DIRS=('assets','audio','img','es','en','sabik')
```

`build_site.py` recorre esa tupla con `copytree`. `docs` no está, luego nunca se
copia. El `assert` final del build —que enumera `scripts/`, `reports/`,
`editorial/`, `pt-br/`, `.github/`, `_audit/`— es una segunda red, no la primera.

**2 · El patrón de exclusión descarta siete de los ocho archivos.**

```python
ignore=shutil.ignore_patterns('__pycache__','*.py','*.md','*.dc.html')
```

Aunque alguien añadiera `docs` a `PUBLIC_DIRS`, los seis `.md` y el `.dc.html`
quedarían fuera. **`support.js` no**: es el único de los ocho que atravesaría
esa criba.

**3 · Y ahí lo para la auditoría de CSP, por nombre.**

`scripts/check_csp_eval_scope.py` ya contempla este archivo y lo dice en su
docstring: *«support.js sigue fuera del artefacto porque no tiene consumidores
revisados»*. Rompe el build si `support.js` aparece en la salida, si algún HTML o
JS publicado lo referencia, o si cualquier `.js` publicado contiene `eval(` o
`new Function(`.

El guardán por nombre mira `dist/support.js`, o sea la raíz de `dist`. Un
`dist/docs/sabik/design/prototypes/support.js` se le escaparía —pero no al
barrido de `rglob('*.js')`, que encontraría su `new Function` y haría fallar el
build igual. La defensa aguanta por la segunda vía.

**Qué comprobar tras `python3 scripts/build_site.py`:** que no exista
`dist/docs/`. Si existe, alguien ha tocado `PUBLIC_DIRS`.

## Lo que el banco NO describe

- **El `requestAnimationFrame` permanente.** El banco lo mantiene en silencio
  para poder leer la energía en vivo. El runtime debe dormirlo en `E = 0`:
  ver `VOICE-WAVE-SPEC.md § Energía cero también detiene el JavaScript`.
- **La simulación sin síntesis.** Si el navegador no expone `speechSynthesis`,
  el banco simula la cadencia para poder revisar el fallback en cualquier
  parte. **En producción, sin síntesis no se muestra Escuchar y no hay ondas.**
- **`data-motion`.** Es pseudocódigo del banco para conmutar sin tocar las
  preferencias del sitio. El movimiento efectivo del runtime se deriva de
  `data-ig-motion`, `data-ig-system-motion` y `prefers-reduced-motion`.
- **Las transiciones válidas.** Las decide `sabik-machine.js`. El banco solo
  permite conmutar ejes a mano para revisar vistas, incluidas combinaciones que
  la máquina no producirá.
