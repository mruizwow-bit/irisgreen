#!/usr/bin/env python3
from pathlib import Path
import argparse

CARD_ES = '''
<section class="ig-support-card" data-ig-support-card aria-labelledby="ig-support-title">
  <p class="ig-support-card__eyebrow">Iris Green es para todo el mundo</p>
  <h2 id="ig-support-title">Ayúdanos a mantener Iris Green abierto</h2>
  <p>Todos los recursos de Iris Green están disponibles para todo el mundo.</p>
  <p>Mantenerlos actualizados, crear nuevos recursos y seguir desarrollando el proyecto requiere tiempo y recursos.</p>
  <p>Si puedes y quieres ayudarnos, puedes hacer una aportación voluntaria. No importa la cantidad: cada aportación ayuda a mantener Iris Green abierto y a seguir creando.</p>
  <p class="ig-support-card__note">Tu aportación es voluntaria y no cambia tu acceso a la web.</p>
  <div class="ig-support-card__actions">
    <a class="ig-support-card__button" href="/es/apoyar/">Apoyar Iris Green</a>
  </div>
</section>
'''.strip()

CARD_EN = '''
<section class="ig-support-card" data-ig-support-card aria-labelledby="ig-support-title">
  <p class="ig-support-card__eyebrow">Iris Green is for everyone</p>
  <h2 id="ig-support-title">Help us keep Iris Green open</h2>
  <p>Everything on Iris Green is available to everyone.</p>
  <p>Keeping it up to date, creating new resources and continuing to develop the project takes time and resources.</p>
  <p>If you can and would like to help, you can make a voluntary contribution. Any amount helps us keep Iris Green open and continue creating.</p>
  <p class="ig-support-card__note">Your contribution is voluntary and does not change your access to the website.</p>
  <div class="ig-support-card__actions">
    <a class="ig-support-card__button" href="/en/support/">Support Iris Green</a>
  </div>
</section>
'''.strip()

TARGETS = {
    "index.html": "es",
    "es/recursos/index.html": "es",
    "es/recursos/juegos/index.html": "es",
    "es/taller/index.html": "es",
    "es/intereses/index.html": "es",
    "en/resources/index.html": "en",
    "en/resources/games/index.html": "en",
    "en/workshop/index.html": "en",
    "en/interests/index.html": "en",
}

CSS = '<link rel="stylesheet" href="/assets/apoyo-iris.css">'

def inject(path: Path, lang: str) -> None:
    if not path.is_file():
        raise FileNotFoundError(path)
    html = path.read_text(encoding="utf-8")
    if "data-ig-support-card" in html:
        return

    if CSS not in html:
        if "</head>" not in html:
            raise ValueError(f"{path}: falta </head>")
        html = html.replace("</head>", f"{CSS}\n</head>", 1)

    card = CARD_EN if lang == "en" else CARD_ES
    if "</footer>" in html:
        html = html.replace("<footer", card + "\n<footer", 1)
    elif "</main>" in html:
        html = html.replace("</main>", card + "\n</main>", 1)
    else:
        raise ValueError(f"{path}: no se ha encontrado punto de inserción")
    path.write_text(html, encoding="utf-8")

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    args = parser.parse_args()
    root = Path(args.root)

    for rel, lang in TARGETS.items():
        inject(root / rel, lang)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
