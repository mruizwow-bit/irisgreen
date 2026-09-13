#!/usr/bin/env python3
"""Optimiza la primera carga del Directorio sin cambiar su contenido editorial.

España ya está disponible en IG_INITIAL. El JSON completo se solicita una sola vez
cuando la persona elige otro país. Además, se reserva la altura inicial del componente
antes de que arranque el runtime para evitar desplazar la página durante la hidratación.
Este guion se ejecuta únicamente dentro del staging desechable del build.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'es/tramites/directorio/index.html'
MARKER = 'ig-directory-lazy-v1'

DC_HIDDEN = '<style>x-dc{display:none!important}</style>'
DC_RESERVED = '<style id="ig-directory-layout-reservation">x-dc{display:block!important;height:100vh!important;min-height:100vh!important;overflow:hidden!important;visibility:hidden!important}</style>'

EAGER = '''    fetch("tramites-datos.json")
      .then((r) => r.json())
      .then((data) => this.setState({ data }))
      .catch(() => { /* Retain the locally available Spain entries on network failure. */ });
'''

METHODS = '''  // ig-directory-lazy-v1: España está local; el resto se carga al elegirlo.
  loadAllData() {
    if (this._allDataPromise) return this._allDataPromise;
    this._allDataPromise = fetch("tramites-datos.json")
      .then((r) => { if (!r.ok) throw new Error("No se ha podido cargar el directorio"); return r.json(); })
      .then((data) => { this.setState({ data, fullLoading: false, fullError: false }); return data; })
      .catch((error) => {
        this._allDataPromise = null;
        this.setState({ country: "es", region: "all", terr: "all", cat: "all", limit: 12, open: null, fullLoading: false, fullError: true });
        throw error;
      });
    return this._allDataPromise;
  }

  pickCountry(code) {
    const reset = { country: code, region: "all", terr: "all", cat: "all", limit: 12, open: null, fullError: false };
    if (code === "es" || (this.state.data && Array.isArray(this.state.data[code]))) {
      this.setState(Object.assign(reset, { fullLoading: false }));
      return;
    }
    this.setState(Object.assign(reset, { fullLoading: true }));
    this.loadAllData().catch(() => {});
  }

'''

COUNT_BLOCK = '''      countLabel: st.fullLoading ? (st.lang === "en" ? "Loading entries…" : "Cargando fichas…") : st.fullError ? (st.lang === "en" ? "Other countries could not be loaded. Spain remains available." : "No se han podido cargar otros países. España sigue disponible.") : rows.length + (rows.length === 1 ? " ficha" : " fichas"),
      noResults: !st.fullLoading && !st.fullError && !!st.data && rows.length === 0,
'''


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if text.count(old) != 1:
        raise ValueError(f'{label}: se esperaba una aparición y hay {text.count(old)}')
    return text.replace(old, new, 1)


def replace_count_block(text: str) -> str:
    if COUNT_BLOCK in text:
        return text
    pattern = re.compile(r'^\s*countLabel:\s*.*?,$\n^\s*noResults:\s*.*?,$\n', re.M)
    text, n = pattern.subn(COUNT_BLOCK, text, count=1)
    if n != 1:
        raise ValueError(f'contador/estado sin resultados: se esperaba un bloque y hay {n}')
    return text


def main() -> None:
    text = PAGE.read_text(encoding='utf-8')
    original = text
    text = replace_once(text, DC_HIDDEN, DC_RESERVED, 'reserva de espacio inicial')

    if MARKER in text:
        if text.count('fetch("tramites-datos.json")') != 1 or 'pick: () => this.pickCountry(code)' not in text or COUNT_BLOCK not in text or DC_RESERVED not in text:
            raise AssertionError('La optimización del Directorio está incompleta')
        if text != original:
            PAGE.write_text(text, encoding='utf-8')
        print({'pagina': str(PAGE.relative_to(ROOT)), 'carga_perezosa': True, 'reserva_layout': True, 'ya_aplicada': True})
        return

    text = replace_once(
        text,
        'state = { lang: "es", data: IG_INITIAL, country: "es",',
        'state = { lang: "es", data: IG_INITIAL, fullLoading: false, fullError: false, country: "es",',
        'estado inicial',
    )
    text = replace_once(
        text, EAGER,
        '    // España ya está en IG_INITIAL. Los demás países se cargan cuando se eligen.\n',
        'descarga inicial',
    )
    text = replace_once(text, '  norm(s) {', METHODS + '  norm(s) {', 'métodos de carga')
    text = replace_once(
        text,
        'pick: () => this.setState({ country: code, terr: "all", cat: "all", region: "all", limit: 12, open: null })',
        'pick: () => this.pickCountry(code)',
        'selector de país',
    )
    text = replace_count_block(text)

    if text.count('fetch("tramites-datos.json")') != 1:
        raise AssertionError('Debe quedar una única descarga, dentro de loadAllData')
    if MARKER not in text or 'pick: () => this.pickCountry(code)' not in text or COUNT_BLOCK not in text or DC_RESERVED not in text:
        raise AssertionError('No se ha completado la optimización del Directorio')
    PAGE.write_text(text, encoding='utf-8')
    print({'pagina': str(PAGE.relative_to(ROOT)), 'carga_perezosa': True, 'reserva_layout': True, 'descarga_inicial_completa': False})


if __name__ == '__main__':
    main()
