#!/usr/bin/env python3
"""R42-Design · medición reproducible del sistema material.

Lee los valores reales de assets/ig-r42-materials.css (alpha por defecto y suelo de
cada componente) y calcula el contraste WCAG 2.2 (1.4.3 texto, 1.4.11 no textual)
del color de primer plano contra la superficie translúcida compuesta sobre el peor
fondo posible.

Metodología:
- Composición alfa sin blur: C = a·S + (1 − a)·B. El blur promedia píxeles, por lo que
  un píxel sin desenfocar es el caso más desfavorable: el resultado es conservador.
- B recorre fondos reales del sitio (paleta de site-v23, juegos, Rincón) más los
  extremos negro y blanco, porque bajo una barra sticky puede pasar cualquier
  contenido (pictograma negro, botón navy, vídeo claro).
- Se mide en cuatro estados: suelo (peor caso permitido), normal, reducido (0,97),
  móvil (0,97, sin blur) y opaco (1).
- Umbral: 4,5:1 texto normal. Un componente es PASS solo si todos sus colores de texto
  superan el umbral en el suelo.
Salida: reports/r42-materials/measurements.json y measurements.md.
Sin dependencias. No sustituye la prueba en navegador (test_r42_materials_browser.py)
ni la HUMAN QA.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS = ROOT / "assets/ig-r42-materials.css"
OUT = ROOT / "reports/r42-materials"

LIGHT_BACKDROPS = ["#000000", "#17395c", "#1f5f8b", "#5a49a8", "#a8336f", "#020812", "#f6f8fb", "#ffffff"]
DARK_BACKDROPS = ["#ffffff", "#f6f8fb", "#eef4f8", "#ffd6a2", "#9fdcea", "#000000"]


def rgb(value: str) -> tuple[float, float, float]:
    value = value.strip()
    if value.startswith("#"):
        h = value[1:]
        return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]
    parts = [float(p) for p in value.split()]
    return parts[0], parts[1], parts[2]


def lum(c) -> float:
    def ch(v: float) -> float:
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(x) for x in c)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def ratio(a, b) -> float:
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def over(surface, alpha: float, back):
    return tuple(s * alpha + b * (1 - alpha) for s, b in zip(surface, back))


def effective(layers, back):
    """Fondo efectivo real: capas desde la más cercana al texto hacia fuera.
    Se detiene en la primera capa opaca (un botón opaco dentro de una barra de cristal
    usa el botón); si ninguna es opaca, compone todas sobre el fondo desplazable."""
    stack = []
    for colour, alpha in layers:
        stack.append((colour, alpha))
        if alpha >= 0.999:
            break
    acc = stack[-1][0] if stack[-1][1] >= 0.999 else back
    rest = stack[:-1] if stack[-1][1] >= 0.999 else stack
    for colour, alpha in reversed(rest):
        acc = over(colour, alpha, acc)
    return acc


def tokens() -> dict[str, str]:
    text = re.sub(r"/\*.*?\*/", "", CSS.read_text(encoding="utf-8"), flags=re.S)
    block = text.split('body[data-ig-materials="r42"]{', 1)[1].split("}", 1)[0]
    return {m.group(1): m.group(2).strip() for m in re.finditer(r"(--ig-[\w-]+):([^;]+);", block)}


def main() -> None:
    t = tokens()
    num = lambda k: float(t[k])  # noqa: E731
    light, dark = rgb(t["--ig-chrome-light-rgb"]), rgb(t["--ig-chrome-dark-rgb"])
    glass = [
        ("Cabecera global .hd", ["#17395c", "#5a49a8", "#1f5f8b"], light, "header", LIGHT_BACKDROPS),
        ("Juegos · browserbar / gamebar", ["#17395c", t["--ig-ink-muted"]], light, "bar", LIGHT_BACKDROPS),
        ("App shell · rail móvil (sticky)", ["#17395c"], light, "rail", LIGHT_BACKDROPS),
        ("Rincón · cabecera oscura", [t["--ig-ink-on-dark"], t["--ig-ink-muted-on-dark"]], dark, "dark", DARK_BACKDROPS),
        ("Rincón · controles del modo limpio", [t["--ig-ink-on-dark"]], dark, "dark", DARK_BACKDROPS),
    ]
    rows = []
    for name, fgs, surface, key, backs in glass:
        floor = num(f"--ig-glass-floor-{key}")
        normal = num(f"--ig-glass-alpha-{key}")
        states = {"suelo": floor, "normal": max(normal, floor), "reducido": max(0.97, floor), "movil": max(0.97, floor), "opaco": 1.0}
        for fg in fgs:
            f = rgb(fg)
            worst = {s: min(ratio(f, effective([(surface, a)], rgb(b))) for b in backs) for s, a in states.items()}
            worst_back = min(backs, key=lambda b: ratio(f, effective([(surface, floor)], rgb(b))))
            rows.append({
                "componente": name, "foreground": fg, "superficie": "rgb(" + " ".join(str(int(x)) for x in surface) + ")",
                "fondo_peor": worst_back, "alpha_normal": normal, "suelo": floor,
                "contraste_min_suelo": round(worst["suelo"], 2), "contraste_normal": round(worst["normal"], 2),
                "contraste_reducido": round(worst["reducido"], 2), "contraste_opaco": round(worst["opaco"], 2),
                "resultado": "PASS" if worst["suelo"] >= 4.5 else "FAIL",
            })
    solid = [
        ("Topbar / inspector / diálogos (opaco)", "#17395c", "#ffffff", 4.5),
        ("Texto secundario en chrome opaco", t["--ig-ink-muted"], "#ffffff", 4.5),
        ("Texto secundario en barra de contexto", t["--ig-ink-muted"], t["--ig-surface-content-soft"], 4.5),
        ("Rincón · chrome opaco oscuro", t["--ig-ink-on-dark"], t["--ig-chrome-solid-dark"], 4.5),
        ("Rincón · control oscuro", t["--ig-ink-on-dark"], t["--ig-chrome-control-dark"], 4.5),
        ("Rincón · hover oscuro", t["--ig-ink-on-dark"], t["--ig-state-hover-dark"], 4.5),
        ("Seleccionado claro (texto)", t["--ig-state-selected-ink"], t["--ig-state-selected"], 4.5),
        ("Seleccionado oscuro (texto)", t["--ig-state-selected-dark-ink"], t["--ig-state-selected-dark"], 4.5),
        ("Deshabilitado (texto informativo)", t["--ig-state-disabled-ink"], "#ffffff", 4.5),
        ("Error", t["--ig-state-error"], "#ffffff", 4.5),
        ("Éxito", t["--ig-state-success"], "#ffffff", 4.5),
        ("Error sobre oscuro", t["--ig-state-error-on-dark"], t["--ig-chrome-solid-dark"], 4.5),
        ("Éxito sobre oscuro", t["--ig-state-success-on-dark"], t["--ig-chrome-solid-dark"], 4.5),
        ("1.4.11 · borde de campo (input) sobre blanco", t["--ig-control-border"], "#ffffff", 3.0),
        ("1.4.11 · borde de campo sobre contexto", t["--ig-control-border"], t["--ig-surface-content-soft"], 3.0),
        ("1.4.11 · borde de control oscuro", t["--ig-control-border-dark"], t["--ig-chrome-solid-dark"], 3.0),
        ("1.4.11 · borde de control oscuro sobre control", t["--ig-control-border-dark"], t["--ig-chrome-control-dark"], 3.0),
        ("1.4.11 · foco claro", t["--ig-focus"], "#ffffff", 3.0),
        ("1.4.11 · foco sobre oscuro", t["--ig-focus-on-dark"], t["--ig-chrome-solid-dark"], 3.0),
        ("1.4.11 · estado seleccionado oscuro frente a barra", t["--ig-state-selected-dark"], t["--ig-chrome-solid-dark"], 3.0),
        ("Separador decorativo (no requiere 3:1)", t["--ig-separator"], "#ffffff", 0.0),
    ]
    # Regresión obligatoria del algoritmo: texto en botón opaco dentro de cristal.
    reg = ratio(rgb("#ffffff"), effective([(rgb("#17395c"), 1.0), (light, 0.5)], rgb("#000000")))
    assert abs(reg - ratio(rgb("#ffffff"), rgb("#17395c"))) < 1e-9, reg
    for name, fg, bg, threshold in solid:
        value = ratio(rgb(fg), effective([(rgb(bg), 1.0), (light, 0.86)], rgb("#000000")))
        rows.append({
            "componente": name, "foreground": fg, "superficie": bg, "fondo_peor": bg, "alpha_normal": 1.0, "suelo": 1.0,
            "contraste_min_suelo": round(value, 2), "contraste_normal": round(value, 2), "contraste_reducido": round(value, 2),
            "contraste_opaco": round(value, 2), "umbral": threshold,
            "resultado": "N/A (decorativo)" if threshold == 0 else ("PASS" if value >= threshold else "FAIL"),
        })
    for r in rows:
        r.setdefault("umbral", 4.5)
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "measurements.json").write_text(json.dumps({"css": "assets/ig-r42-materials.css", "rows": rows}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    head = "| componente | foreground | fondo (peor) | alpha | suelo | contraste mínimo (suelo) | normal | reducido | opaco | umbral | resultado |\n|---|---|---|---|---|---|---|---|---|---|---|\n"
    body = "".join(
        f"| {r['componente']} | `{r['foreground']}` | `{r['fondo_peor']}` | {r['alpha_normal']:.2f} | {r['suelo']:.2f} | {r['contraste_min_suelo']:.2f}:1 | {r['contraste_normal']:.2f}:1 | {r['contraste_reducido']:.2f}:1 | {r['contraste_opaco']:.2f}:1 | {r['umbral']} | {r['resultado']} |\n"
        for r in rows
    )
    (OUT / "measurements.md").write_text("# R42 · mediciones del sistema material\n\nGenerado por `scripts/measure_r42_materials.py` a partir de `assets/ig-r42-materials.css`.\n\n" + head + body, encoding="utf-8")
    failures = [r for r in rows if r["resultado"] == "FAIL"]
    print(f"R42 materials: {len(rows)} filas, {len(failures)} FAIL")
    if failures:
        raise SystemExit(json.dumps(failures, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
