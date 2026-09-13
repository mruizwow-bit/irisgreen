#!/usr/bin/env python3
"""Comprueba la salida imprimible de las 12 hojas del Taller en Chromium.

No valida el contenido editorial de las hojas. Verifica el contrato de impresión:
12 hojas, tamaño A4, área interior contenida y salto de página entre hojas.
"""
from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from playwright.async_api import async_playwright

MM_TO_PX = 96 / 25.4
A4_W = 210 * MM_TO_PX
A4_H = 297 * MM_TO_PX
TOLERANCE = 2.0


async def run(root: Path) -> dict:
    path = (root / "es/taller/hojas/index.html").resolve()
    if not path.is_file():
        raise FileNotFoundError(path)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1280, "height": 900})
        await page.emulate_media(media="print")
        await page.goto(path.as_uri(), wait_until="load")
        result = await page.evaluate(
            """() => {
              const sheets = [...document.querySelectorAll('.hoja')];
              return {
                count: sheets.length,
                sheets: sheets.map((sheet, index) => {
                  const r = sheet.getBoundingClientRect();
                  const inner = sheet.querySelector('.inner');
                  const ir = inner ? inner.getBoundingClientRect() : null;
                  const style = getComputedStyle(sheet);
                  const block = sheet.closest('.hoja-bloque');
                  const blockStyle = block ? getComputedStyle(block) : null;
                  return {
                    index: index + 1,
                    width: r.width,
                    height: r.height,
                    scrollWidth: sheet.scrollWidth,
                    clientWidth: sheet.clientWidth,
                    scrollHeight: sheet.scrollHeight,
                    clientHeight: sheet.clientHeight,
                    inner: ir ? {
                      left: ir.left - r.left,
                      top: ir.top - r.top,
                      right: r.right - ir.right,
                      bottom: r.bottom - ir.bottom,
                    } : null,
                    breakAfter: style.breakAfter,
                    pageBreakAfter: style.pageBreakAfter,
                    blockBreakAfter: blockStyle ? blockStyle.breakAfter : '',
                  };
                }),
              };
            }"""
        )
        await browser.close()

    errors: list[str] = []
    if result["count"] != 12:
        errors.append(f"Se esperaban 12 hojas y hay {result['count']}")

    for sheet in result["sheets"]:
        n = sheet["index"]
        if abs(sheet["width"] - A4_W) > TOLERANCE:
            errors.append(f"TA-{n:02d}: ancho {sheet['width']:.2f}px, esperado A4 {A4_W:.2f}px")
        if abs(sheet["height"] - A4_H) > TOLERANCE:
            errors.append(f"TA-{n:02d}: alto {sheet['height']:.2f}px, esperado A4 {A4_H:.2f}px")
        if sheet["scrollWidth"] > sheet["clientWidth"] + 1:
            errors.append(f"TA-{n:02d}: desbordamiento horizontal")
        if sheet["scrollHeight"] > sheet["clientHeight"] + 1:
            errors.append(f"TA-{n:02d}: desbordamiento vertical")
        inner = sheet["inner"]
        if not inner:
            errors.append(f"TA-{n:02d}: falta .inner")
        elif min(inner.values()) < -1:
            errors.append(f"TA-{n:02d}: el área interior sale de la hoja: {inner}")
        if n < 12 and sheet["breakAfter"] not in {"page", "always"} and sheet["pageBreakAfter"] not in {"always", "page"}:
            errors.append(f"TA-{n:02d}: no conserva salto de página de impresión")

    report = {
        "page": "/es/taller/hojas/",
        "sheets": result["count"],
        "a4_css_px": {"width": A4_W, "height": A4_H},
        "errors": errors,
        "passed": not errors,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit(1)
    return report


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--root", type=Path, default=Path("dist"))
    args = ap.parse_args()
    asyncio.run(run(args.root.resolve()))


if __name__ == "__main__":
    main()
