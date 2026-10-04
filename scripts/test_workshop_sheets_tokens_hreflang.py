#!/usr/bin/env python3
"""Prisma · Taller Hojas: screen chrome tokens + ES/EN hreflang pair."""
from __future__ import annotations
import argparse,re
from pathlib import Path

PAGES={
 "es":("es/taller/hojas/index.html","https://irisgreen.eu/es/taller/hojas/","https://irisgreen.eu/en/workshop/sheets/"),
 "en":("en/workshop/sheets/index.html","https://irisgreen.eu/en/workshop/sheets/","https://irisgreen.eu/es/taller/hojas/"),
}
SCREEN_SELECTORS=(
 "main.hojas",
 ".btn-todo",
 ".indice a",
 ".indice .code,.hoja-bar .code",
 ".hoja-bar button",
 ".langs button.lang",
 ".langs button.lang.on",
)
FORBIDDEN_SCREEN=("#17395c","#1f5f8b","#5a49a8","#fff","rgba(23,57,92","rgba(31,95,139")

def need(v,msg):
 if not v: raise AssertionError(msg)

def rule(css,selector):
 m=re.search(re.escape(selector)+r"\{([^}]*)\}",css,re.S)
 need(m, "missing selector "+selector)
 return m.group(1)

def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True)
 root=ap.parse_args().root.resolve()
 for lang,(rel,self_url,other_url) in PAGES.items():
  text=(root/rel).read_text(encoding="utf-8")
  head=text.split("</head>",1)[0]
  css="\n".join(re.findall(r"<style[^>]*>(.*?)</style>",head,re.S|re.I))
  need(f'<link rel="canonical" href="{self_url}">' in head, lang+" canonical")
  need(f'hreflang="{lang}" href="{self_url}"' in head, lang+" self hreflang")
  other="en" if lang=="es" else "es"
  need(f'hreflang="{other}" href="{other_url}"' in head, lang+" reciprocal hreflang")
  need('hreflang="x-default" href="https://irisgreen.eu/es/taller/hojas/"' in head,lang+" x-default")
  need("var(--ig-text" in rule(css,"main.hojas"),lang+" main token")
  need("var(--ig-button-primary-bg" in rule(css,".btn-todo"),lang+" primary button token")
  need("var(--ig-button-secondary-bg" in rule(css,".indice a"),lang+" index token")
  need("var(--ig-accent" in rule(css,".indice .code,.hoja-bar .code"),lang+" code token")
  need("var(--ig-button-secondary-bg" in rule(css,".hoja-bar button"),lang+" sheet button token")
  need("var(--ig-button-secondary-bg" in rule(css,".langs button.lang"),lang+" language token")
  need("var(--ig-button-primary-bg" in rule(css,".langs button.lang.on"),lang+" active language token")
  # Paper itself remains a deliberate white print artifact.
  need(re.search(r"\.hoja\{[^}]*background:#fff",css,re.S),lang+" paper white preserved")
  need("@media print" in css and "background:#fff!important" in css,lang+" print white preserved")
 print("WORKSHOP_SHEETS_TOKENS_HREFLANG_PASS")

if __name__=="__main__":
 main()
