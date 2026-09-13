#!/usr/bin/env python3
"""Pruebas mínimas de resolución de aria-labelledby del auditor estructural."""
from audit_accesibilidad import check


def page(body: str) -> str:
    return f"<!doctype html><html><body><main><h1>Prueba</h1>{body}</main></body></html>"


def has_missing_name(problems: list[str], kind: str) -> bool:
    return any(problem.startswith(kind) for problem in problems)


def main() -> None:
    broken_button = check(
        "broken-button.html",
        page('<button aria-labelledby="missing"></button>'),
    )
    assert has_missing_name(broken_button, "botón sin nombre accesible"), broken_button

    hidden_label = check(
        "hidden-label.html",
        page('<span id="button-label" hidden>Guardar</span><button aria-labelledby="button-label"></button>'),
    )
    assert not has_missing_name(hidden_label, "botón sin nombre accesible"), hidden_label

    inert_label = check(
        "template-label.html",
        page('<template><span id="button-label">No activo</span></template><button aria-labelledby="button-label"></button>'),
    )
    assert has_missing_name(inert_label, "botón sin nombre accesible"), inert_label

    mixed_refs = check(
        "mixed-refs.html",
        page('<span id="real-label">Guardar</span><button aria-labelledby="missing real-label"></button>'),
    )
    assert not has_missing_name(mixed_refs, "botón sin nombre accesible"), mixed_refs

    broken_field = check(
        "broken-field.html",
        page('<input type="text" aria-labelledby="missing">'),
    )
    assert has_missing_name(broken_field, "campo sin nombre accesible"), broken_field

    print("aria-labelledby: 5 casos correctos")


if __name__ == "__main__":
    main()
