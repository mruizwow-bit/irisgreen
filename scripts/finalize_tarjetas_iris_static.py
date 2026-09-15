#!/usr/bin/env python3
"""Integra pictogramas editoriales y finaliza Tarjetas Iris publicables."""
from pathlib import Path
import sys

from add_mulberry_pictograms import main as add_pictograms
from finalize_tarjetas_iris_v2_core import main as finalize_v2
from fix_tarjetas_iris_sitewide import run as fix_sitewide
from test_tarjetas_pictogramas import main as validate_delivery

ACTION_GROUP_OLD = '<div class="iris-mini-actions" aria-label="Acciones de la Tarjeta Iris">'
ACTION_GROUP_NEW = '<div class="iris-mini-actions" role="group" aria-label="Acciones de la Tarjeta Iris">'


def _root_from_argv() -> Path:
    if "--root" in sys.argv:
        pos = sys.argv.index("--root")
        if pos + 1 >= len(sys.argv):
            raise SystemExit("--root necesita una ruta")
        return Path(sys.argv[pos + 1]).resolve()
    return Path("dist").resolve()


def ensure_action_group_roles(root: Path) -> None:
    changed = 0
    present = 0
    for pattern in (
        "es/situaciones/*/index.html",
        "es/biblioteca/*/index.html",
        "es/neurodiversidad/condiciones/*/index.html",
    ):
        for path in root.glob(pattern):
            if not path.is_file():
                continue
            text = path.read_text(encoding="utf-8")
            if 'iris-mini-card-static' not in text:
                continue
            present += 1
            count = text.count(ACTION_GROUP_OLD)
            if count == 1:
                path.write_text(text.replace(ACTION_GROUP_OLD, ACTION_GROUP_NEW, 1), encoding="utf-8")
                changed += 1
            elif ACTION_GROUP_NEW not in text:
                raise AssertionError(f"Grupo de acciones Tarjeta Iris ausente o inesperado: {path}")
    if present != 367:
        raise AssertionError(f"Se esperaban 367 Tarjetas Iris publicables; hay {present}")
    print({"tarjetas_action_group_role": present, "changed": changed, "role": "group", "result": "accepted"})


if __name__ == "__main__":
    root = _root_from_argv()
    add_pictograms()
    finalize_v2()
    fix_sitewide(root)
    ensure_action_group_roles(root)
    validate_delivery()
