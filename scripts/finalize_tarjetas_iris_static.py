#!/usr/bin/env python3
"""Integra pictogramas editoriales y finaliza las 420 Tarjetas Iris v2.

Este orquestador mantiene el build general sin cambios: primero añade únicamente
los apoyos visuales aprobados, después ejecuta el finalizador v2 ya validado,
comprueba las 420 tarjetas interiores y por último aplica a la herramienta
personal el ejemplo pictográfico aprobado del sistema visual.
"""
from pathlib import Path
import sys

from add_mulberry_pictograms import main as add_pictograms
from finalize_tarjetas_iris_v2_core import main as finalize_v2
from test_tarjetas_pictogramas import main as validate_delivery
from enhance_tarjetas_iris_tool import run as enhance_personal_tool


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
    """Da semántica de grupo al contenedor nombrado de acciones, sin cambiar su presentación."""
    changed = 0
    for pattern in (
        "es/situaciones/*/index.html",
        "es/biblioteca/*/index.html",
        "es/neurodiversidad/condiciones/*/index.html",
    ):
        for path in root.glob(pattern):
            if not path.is_file():
                continue
            text = path.read_text(encoding="utf-8")
            count = text.count(ACTION_GROUP_OLD)
            if count == 1:
                path.write_text(text.replace(ACTION_GROUP_OLD, ACTION_GROUP_NEW, 1), encoding="utf-8")
                changed += 1
            elif ACTION_GROUP_NEW not in text:
                raise AssertionError(f"Grupo de acciones Tarjeta Iris ausente o inesperado: {path}")
    if changed != 420:
        raise AssertionError(f"Se esperaban 420 grupos de acciones corregidos; se cambiaron {changed}")
    print({"tarjetas_action_group_role": changed, "role": "group", "result": "accepted"})


if __name__ == "__main__":
    add_pictograms()
    finalize_v2()
    root = _root_from_argv()
    ensure_action_group_roles(root)
    validate_delivery()
    enhance_personal_tool(root)
