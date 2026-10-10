#!/usr/bin/env python3
from pathlib import Path
import argparse

TARGETS = {
    "index.html": ("/es/apoyar/", "Tu aportación es voluntaria y no cambia tu acceso a la web."),
    "es/recursos/index.html": ("/es/apoyar/", "Tu aportación es voluntaria y no cambia tu acceso a la web."),
    "es/recursos/juegos/index.html": ("/es/apoyar/", "Tu aportación es voluntaria y no cambia tu acceso a la web."),
    "es/taller/index.html": ("/es/apoyar/", "Tu aportación es voluntaria y no cambia tu acceso a la web."),
    "es/intereses/index.html": ("/es/apoyar/", "Tu aportación es voluntaria y no cambia tu acceso a la web."),
    "en/resources/index.html": ("/en/support/", "Your contribution is voluntary and does not change your access to the website."),
    "en/resources/games/index.html": ("/en/support/", "Your contribution is voluntary and does not change your access to the website."),
    "en/workshop/index.html": ("/en/support/", "Your contribution is voluntary and does not change your access to the website."),
    "en/interests/index.html": ("/en/support/", "Your contribution is voluntary and does not change your access to the website."),
}

NO_CARD = [
    "es/sitio-tranquilo/index.html",
    "en/quiet-space/index.html",
]

def require(condition: bool, msg: str) -> None:
    if not condition:
        raise AssertionError(msg)

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", required=True)
    args = parser.parse_args()
    root = Path(args.root)

    for rel, (href, note) in TARGETS.items():
        path = root / rel
        require(path.is_file(), f"falta {rel}")
        html = path.read_text(encoding="utf-8")
        require(html.count("data-ig-support-card") == 1, f"{rel}: tarjeta duplicada o ausente")
        require('/assets/apoyo-iris.css' in html, f"{rel}: falta CSS de apoyo")
        require(f'href="{href}"' in html, f"{rel}: CTA incorrecta")
        require(note in html, f"{rel}: falta mensaje de acceso universal")

    for rel in NO_CARD:
        path = root / rel
        if path.is_file():
            html = path.read_text(encoding="utf-8")
            require("data-ig-support-card" not in html, f"{rel}: no debe contener tarjeta de apoyo")

    for rel in ["es/apoyar/index.html", "en/support/index.html"]:
        path = root / rel
        require(path.is_file(), f"falta {rel}")
        html = path.read_text(encoding="utf-8")
        require("data-ig-support-pay" in html, f"{rel}: falta CTA de pago")
        require("/assets/apoyo-iris.js" in html, f"{rel}: falta controlador")
        lowered = html.lower()
        require("deducible" not in lowered and "tax-deductible" not in lowered, f"{rel}: claim fiscal no autorizado")

    print("Support card PASS")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
