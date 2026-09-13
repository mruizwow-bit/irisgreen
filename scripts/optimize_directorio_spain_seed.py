#!/usr/bin/env python3
"""Reduce la semilla española del Directorio sin perder la primera pantalla.

El build ya contiene todas las fichas españolas en ``ig-initial-data``. Este
paso, ejecutado solo sobre ``dist``, conserva 24 fichas en el HTML, escribe la
colección española completa en un JSON separado y adapta la mejora progresiva:
la portada funciona sin red con 24 fichas; buscar, filtrar o seguir ampliando
carga España completa. El fallback sin JavaScript permanece intacto.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEED_RE = re.compile(r'(<script id="ig-initial-data" type="application/json"[^>]*>)(.*?)(</script>)', re.S)
LIMIT = 24
MARKER = 'ig-directory-spain-seed-v1'

METHODS = r'''  // ig-directory-spain-seed-v1: 24 fichas de España bastan para la primera pantalla.
  spainIsPartial() {
    return !!(this.state.data && Array.isArray(this.state.data.es) && this.state.data.es.length < IG_INITIAL._counts.es);
  }

  loadSpainData() {
    if (!this.spainIsPartial()) return Promise.resolve(this.state.data);
    if (this._spainDataPromise) return this._spainDataPromise;
    this._spainDataPromise = fetch("tramites-es.json")
      .then((r) => { if (!r.ok) throw new Error("No se han podido cargar todas las fichas de España"); return r.json(); })
      .then((es) => {
        if (!Array.isArray(es) || es.length !== IG_INITIAL._counts.es) throw new Error("La colección española está incompleta");
        const data = Object.assign({}, this.state.data, { es });
        this.setState({ data, fullLoading: false, fullError: false });
        return data;
      })
      .catch((error) => {
        this._spainDataPromise = null;
        this.setState({ fullLoading: false, fullError: true });
        throw error;
      });
    return this._spainDataPromise;
  }

  withSpainData(patch) {
    if (this.state.country !== "es" || !this.spainIsPartial()) {
      this.setState(patch);
      return;
    }
    this.setState(Object.assign({}, patch, { fullLoading: true, fullError: false }));
    this.loadSpainData().then(() => this.setState(patch)).catch(() => {});
  }

  showMoreRows() {
    const next = this.state.limit + 12;
    this.setState({ limit: next, fullError: false });
    if (this.state.country === "es" && this.spainIsPartial() && next >= this.state.data.es.length) {
      this.loadSpainData().catch(() => {});
    }
  }

  countRows(rows) {
    const st = this.state;
    if (st.country === "es" && this.spainIsPartial() && st.terr === "all" && st.cat === "all" && !st.q.trim()) return IG_INITIAL._counts.es;
    return rows.length;
  }

'''


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if text.count(old) != 1:
        raise ValueError(f'{label}: se esperaba una aparición y hay {text.count(old)}')
    return text.replace(old, new, 1)


def add_complete_filter_options(text: str) -> str:
    """Completa opciones españolas justo antes del ordenado de categorías."""
    addition = '''    if (st.country === "es" && this.spainIsPartial()) {
      terrs.splice(0, terrs.length, ...(IG_INITIAL._esTerrs || []));
      cats.splice(0, cats.length, ...(IG_INITIAL._esCats || []));
    }
'''
    if addition.strip() in text:
        return text
    anchor = '    cats.sort((a, b) => a.localeCompare(b, "es"));'
    if text.count(anchor) != 1:
        raise ValueError(f'opciones completas de España: se esperaba un punto de ordenado y hay {text.count(anchor)}')
    return text.replace(anchor, addition + anchor, 1)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--root', type=Path, default=ROOT / 'dist')
    args = ap.parse_args()
    root = args.root.resolve()
    page = root / 'es/tramites/directorio/index.html'
    if not page.is_file():
        raise FileNotFoundError(page)

    text = page.read_text(encoding='utf-8')
    if MARKER in text:
        print({'pagina': 'es/tramites/directorio/index.html', 'semilla_espana': LIMIT, 'ya_aplicada': True})
        return
    if 'ig-directory-lazy-v1' not in text:
        raise ValueError('La carga perezosa base del Directorio no está aplicada')

    match = SEED_RE.search(text)
    if not match:
        raise ValueError('No se encuentra ig-initial-data')
    seed = json.loads(match.group(2))
    full_es = seed.get('es')
    counts = seed.get('_counts') or {}
    if not isinstance(full_es, list) or len(full_es) != counts.get('es') or len(full_es) <= LIMIT:
        raise ValueError('La semilla española no contiene la colección completa esperada')

    # El JSON separado contiene solo datos ya públicos y se genera únicamente en dist.
    shard = page.parent / 'tramites-es.json'
    shard.write_text(json.dumps(full_es, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')

    small = dict(seed)
    small['es'] = full_es[:LIMIT]
    small['_esTerrs'] = sorted({str(row.get('terr') or '') for row in full_es if row.get('terr')})
    small['_esCats'] = sorted({str(row.get('cat') or '') for row in full_es if row.get('cat')})
    payload = json.dumps(small, ensure_ascii=False, separators=(',', ':')).replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
    text = text[:match.start(2)] + payload + text[match.end(2):]

    text = replace_once(text, '  loadAllData() {', METHODS + '  loadAllData() {', 'métodos España')
    text = add_complete_filter_options(text)

    text = replace_once(text,
        'onTerr: (e) => this.setState({ terr: e.target.value, limit: 12 }),',
        'onTerr: (e) => this.withSpainData({ terr: e.target.value, limit: 12 }),',
        'filtro territorial')
    text = replace_once(text,
        'onCat: (e) => this.setState({ cat: e.target.value, limit: 12 }),',
        'onCat: (e) => this.withSpainData({ cat: e.target.value, limit: 12 }),',
        'filtro categoría')
    text = replace_once(text,
        'onQ: (e) => this.setState({ q: e.target.value, limit: 12 }),',
        'onQ: (e) => this.withSpainData({ q: e.target.value, limit: 12 }),',
        'búsqueda España')
    text = replace_once(text,
        'clearFilters: () => this.setState({ terr: "all", cat: "all", q: "", limit: 12 }),',
        'clearFilters: () => this.setState({ terr: "all", cat: "all", q: "", limit: 12, fullError: false }),',
        'limpiar filtros')

    old_count = '''      countLabel: st.fullLoading ? (st.lang === "en" ? "Loading entries…" : "Cargando fichas…") : st.fullError ? (st.lang === "en" ? "Other countries could not be loaded. Spain remains available." : "No se han podido cargar otros países. España sigue disponible.") : rows.length + (rows.length === 1 ? " ficha" : " fichas"),
      noResults: !st.fullLoading && !st.fullError && !!st.data && rows.length === 0,'''
    new_count = '''      countLabel: st.fullLoading ? (st.lang === "en" ? "Loading entries…" : "Cargando fichas…") : st.fullError ? ((st.country === "es" && this.spainIsPartial()) ? (st.lang === "en" ? "The full Spain collection could not be loaded. The first entries remain available." : "No se han podido cargar todas las fichas de España. Las primeras siguen disponibles.") : (st.lang === "en" ? "Other countries could not be loaded. Spain remains available." : "No se han podido cargar otros países. España sigue disponible.")) : this.countRows(rows) + (this.countRows(rows) === 1 ? " ficha" : " fichas"),
      noResults: !st.fullLoading && !st.fullError && !!st.data && rows.length === 0,'''
    text = replace_once(text, old_count, new_count, 'contador')

    text = replace_once(text,
        'hasMore: rows.length > st.limit,',
        'hasMore: !st.fullLoading && this.countRows(rows) > st.limit,',
        'ver más disponible')
    text = replace_once(text,
        'moreLabel: "Ver más fichas (" + Math.max(0, rows.length - st.limit) + " restantes)",',
        'moreLabel: "Ver más fichas (" + Math.max(0, this.countRows(rows) - st.limit) + " restantes)",',
        'etiqueta ver más')
    text = replace_once(text,
        'showMore: () => this.setState({ limit: st.limit + 12 }),',
        'showMore: () => this.showMoreRows(),',
        'acción ver más')

    page.write_text(text, encoding='utf-8')
    print({
        'pagina': 'es/tramites/directorio/index.html',
        'semilla_espana': LIMIT,
        'espana_total': len(full_es),
        'territorios': len(small['_esTerrs']),
        'categorias': len(small['_esCats']),
        'json_espana': 'es/tramites/directorio/tramites-es.json',
        'fallback_nojs_intacto': True,
    })


if __name__ == '__main__':
    main()
