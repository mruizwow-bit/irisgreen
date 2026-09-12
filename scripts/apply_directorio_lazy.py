#!/usr/bin/env python3
"""Evita descargar todo el directorio internacional en la primera carga.

España ya está disponible en IG_INITIAL. El JSON completo se solicita una sola vez
cuando la persona elige otro país. Este guion se ejecuta únicamente dentro del
staging desechable del build y no cambia contenido editorial.
"""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / 'es/tramites/directorio/index.html'
MARKER = 'ig-directory-lazy-v1'

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


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if text.count(old) != 1:
        raise ValueError(f'{label}: se esperaba una aparición y hay {text.count(old)}')
    return text.replace(old, new, 1)


def main() -> None:
    text = PAGE.read_text(encoding='utf-8')
    if MARKER in text:
        if text.count('fetch("tramites-datos.json")') != 1 or 'pick: () => this.pickCountry(code)' not in text:
            raise AssertionError('La carga perezosa del Directorio está incompleta')
        print({'pagina': str(PAGE.relative_to(ROOT)), 'carga_perezosa': True, 'ya_aplicada': True})
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
    text = replace_once(
        text,
        'countLabel: st.data ? rows.length + (rows.length === 1 ? " ficha" : " fichas") : "Cargando…",',
        'countLabel: st.fullLoading ? (st.lang === "en" ? "Loading entries…" : "Cargando fichas…") : st.fullError ? (st.lang === "en" ? "Other countries could not be loaded. Spain remains available." : "No se han podido cargar otros países. España sigue disponible.") : rows.length + (rows.length === 1 ? " ficha" : " fichas"),',
        'contador',
    )
    text = replace_once(
        text,
        'noResults: !!st.data && rows.length === 0,',
        'noResults: !st.fullLoading && !st.fullError && !!st.data && rows.length === 0,',
        'estado sin resultados',
    )

    if text.count('fetch("tramites-datos.json")') != 1:
        raise AssertionError('Debe quedar una única descarga, dentro de loadAllData')
    if MARKER not in text or 'pick: () => this.pickCountry(code)' not in text:
        raise AssertionError('No se ha completado la carga perezosa')
    PAGE.write_text(text, encoding='utf-8')
    print({'pagina': str(PAGE.relative_to(ROOT)), 'carga_perezosa': True, 'descarga_inicial_completa': False})


if __name__ == '__main__':
    main()
