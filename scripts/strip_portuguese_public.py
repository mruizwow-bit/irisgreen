#!/usr/bin/env python3
"""Retira de la salida pública el tercer idioma PT-BR ya discontinuado.

No toca las fuentes externas brasileñas: una URL oficial puede contener /pt-br/
sin ser una ruta de idioma de Iris Green. `_redirects` también queda intacto.
"""
from __future__ import annotations
import argparse
import json
import re
from pathlib import Path

INTERNAL_PT_ANCHOR = re.compile(
    r'<a\b(?=[^>]*(?:class=["\'][^"\']*\big-nav-pt\b|href=["\'](?:https?://(?:www\.)?irisgreen\.eu)?/pt-br(?:/|["\'])))'
    r'[^>]*>.*?</a>\s*', re.I | re.S
)
PT_ALTERNATE = re.compile(
    r'<link\b(?=[^>]*\bhreflang=["\']pt(?:-br)?["\'])[^>]*>\s*', re.I
)
SCRIPT_BLOCK = re.compile(r'(<script\b[^>]*>)(.*?)(</script>)', re.I | re.S)
PT_PROPERTY = re.compile(r'(?P<prefix>[{,])(?P<space>\s*)(?P<key>"pt"|\'pt\'|pt)\s*:\s*')

EXACT_TEXT_REPLACEMENTS = {
    'Sigue pendiente la traducción completa de las 120 fichas a EN y PT-BR si la colección se publica también en esos idiomas.':
        'Sigue pendiente la traducción completa de las 120 fichas a EN si la colección se publica también en ese idioma.',
    'No queda ningún bloqueo por imágenes en la colección. Sigue pendiente la traducción completa de las 120 fichas a EN y PT-BR si la colección se publica también en esos idiomas.':
        'No queda ningún bloqueo por imágenes en la colección. Sigue pendiente la traducción completa de las 120 fichas a EN si la colección se publica también en ese idioma.',
    'Pendiente editorial: traducción de las 120 fichas a EN y PT-BR.':
        'Pendiente editorial: traducción de las 120 fichas a EN.',
}
PT_LANGUAGE_JSON = {
    'es/taller/taller-retos.json',
    'es/recursos/juegos/juegos-120.json',
}
PT_LANGUAGE_TEXT = {
    'assets/musica.js',
    'es/cuestionarios/index.html',
    'es/investigacion/index.html',
    'es/libros/index.html',
    'es/neurodiversidad/temas/autismo/index.html',
    'es/recursos/juegos/cada-cerebro-su-camino/index.html',
    'es/recursos/juegos/donde-se-fue-la-energia/index.html',
    'es/recursos/juegos/el-archivo-de-capacidades/index.html',
    'es/recursos/juegos/el-aula-al-reves/index.html',
    'es/recursos/juegos/el-detective-de-los-sentidos/index.html',
    'es/recursos/juegos/el-mapa-del-tesoro-de-casa/index.html',
    'es/recursos/juegos/el-traductor-de-casa/index.html',
    'es/recursos/juegos/el-traductor-de-instrucciones/index.html',
    'es/recursos/juegos/index.html',
    'es/recursos/juegos/la-cena-de-los-planes/index.html',
    'es/recursos/juegos/la-consulta/index.html',
    'es/recursos/juegos/la-maquina-de-empezar/index.html',
    'es/recursos/juegos/las-cinco-cosas/index.html',
    'es/recursos/juegos/palabra-misteriosa/index.html',
    'es/sobre-iris-green/index.html',
    'es/taller/index.html',
    'es/tramites/directorio/index.html',
    'es/tramites/index.html',
    'es/videos/index.html',
}


def clean_json_value(value, *, drop_language_keys: bool):
    if isinstance(value, dict):
        out = {}
        for key, item in value.items():
            if drop_language_keys and str(key).lower().replace('_', '-') in {'pt', 'pt-br'}:
                continue
            out[key] = clean_json_value(item, drop_language_keys=drop_language_keys)
        return out
    if isinstance(value, list):
        return [clean_json_value(item, drop_language_keys=drop_language_keys) for item in value]
    if isinstance(value, str):
        return EXACT_TEXT_REPLACEMENTS.get(value, value)
    return value


def _js_value_end(text: str, start: int) -> int:
    """Devuelve el primer índice posterior a un valor JS simple/objeto/array.

    Los diccionarios de idioma usan objetos y arrays de datos. El escáner respeta
    cadenas y comentarios para no cortar por una llave que forme parte del texto.
    """
    n = len(text)
    i = start
    while i < n and text[i].isspace():
        i += 1
    if i >= n:
        return i
    if text[i] in {'"', "'", '`'}:
        quote = text[i]
        i += 1
        while i < n:
            if text[i] == '\\':
                i += 2
                continue
            if text[i] == quote:
                return i + 1
            i += 1
        return n
    if text[i] not in '{[':
        while i < n and text[i] not in ',}]\n':
            i += 1
        return i

    stack = ['}' if text[i] == '{' else ']']
    i += 1
    quote = None
    while i < n and stack:
        ch = text[i]
        if quote:
            if ch == '\\':
                i += 2
                continue
            if ch == quote:
                quote = None
            i += 1
            continue
        if ch in {'"', "'", '`'}:
            quote = ch
            i += 1
            continue
        if ch == '/' and i + 1 < n and text[i + 1] == '/':
            end = text.find('\n', i + 2)
            i = n if end < 0 else end + 1
            continue
        if ch == '/' and i + 1 < n and text[i + 1] == '*':
            end = text.find('*/', i + 2)
            i = n if end < 0 else end + 2
            continue
        if ch == '{':
            stack.append('}')
        elif ch == '[':
            stack.append(']')
        elif ch in '}]':
            if ch != stack[-1]:
                raise ValueError('Bloque JS desequilibrado al retirar la traducción PT')
            stack.pop()
        i += 1
    if stack:
        raise ValueError('Bloque JS sin cierre al retirar la traducción PT')
    return i


def remove_pt_properties(js: str) -> tuple[str, int]:
    """Elimina propiedades `pt: ...` completas, conservando la puntuación JS."""
    removed = 0
    pos = 0
    while True:
        match = PT_PROPERTY.search(js, pos)
        if not match:
            break
        value_end = _js_value_end(js, match.end())
        cursor = value_end
        while cursor < len(js) and js[cursor].isspace():
            cursor += 1
        trailing_comma = cursor < len(js) and js[cursor] == ','
        end = cursor + 1 if trailing_comma else value_end
        prefix = match.group('prefix')
        if prefix == '{':
            replacement = '{'
        elif trailing_comma:
            replacement = ','
        else:
            replacement = ''
        js = js[:match.start()] + replacement + js[end:]
        removed += 1
        pos = max(0, match.start() - 1)
    return js, removed


def clean_text(text: str, *, drop_language_objects: bool) -> tuple[str, int]:
    text = PT_ALTERNATE.sub('', text)
    text = INTERNAL_PT_ANCHOR.sub('', text)
    removed_objects = 0

    if drop_language_objects:
        if '<script' in text.lower():
            def strip_script(match):
                nonlocal removed_objects
                body, count = remove_pt_properties(match.group(2))
                removed_objects += count
                return match.group(1) + body + match.group(3)
            text = SCRIPT_BLOCK.sub(strip_script, text)
        else:
            text, removed_objects = remove_pt_properties(text)

    # Cabecera antigua: después de retirar el enlace PT no debe quedar CSS para ocultarlo
    # ni reglas que cambien la navegación cuando el documento tenga lang=pt.
    for old, new in (
        ('.ig-nav-en,.ig-nav-pt{display:none!important}',
         '.ig-nav-en{display:none!important}'),
        ('a.ig-nav-en,a.ig-nav-pt{display:none!important}',
         'a.ig-nav-en{display:none!important}'),
        ("html[lang^='en'] .ig-nav-es,html[lang^='pt'] .ig-nav-es",
         "html[lang^='en'] .ig-nav-es"),
        ('html[lang^="en"] .ig-nav-es,html[lang^="pt"] .ig-nav-es',
         'html[lang^="en"] .ig-nav-es'),
        ("html[lang^='en'] .ig-nav-en,html[lang^='pt'] .ig-nav-pt{display:inline-flex!important}",
         "html[lang^='en'] .ig-nav-en{display:inline-flex!important}"),
        ('html[lang^="en"] .ig-nav-en,html[lang^="pt"] .ig-nav-pt{display:inline-flex!important}',
         'html[lang^="en"] .ig-nav-en{display:inline-flex!important}'),
        ("html[lang^='pt'] .ig-nav-pt{display:inline-flex!important}", ''),
        ('html[lang^="pt"] .ig-nav-pt{display:inline-flex!important}', ''),
    ):
        text = text.replace(old, new)

    # Si queda una preferencia local antigua con valor pt, no conserva un idioma
    # que ya no existe. Como los diccionarios PT ya han sido retirados, `use`
    # solo puede ser ES o EN; `lang` también llega solo desde esos dos botones.
    for old, new in (
        ('use === "pt" ? "pt-BR" : use', 'use'),
        ("use === 'pt' ? 'pt-BR' : use", 'use'),
        ('lang === "pt" ? "pt-BR" : lang', 'lang'),
        ("lang === 'pt' ? 'pt-BR' : lang", 'lang'),
        ('document.documentElement.lang = l === "pt" ? "pt-BR" : l;',
         'document.documentElement.lang = l === "en" ? "en" : "es";'),
        ("document.documentElement.lang = l === 'pt' ? 'pt-BR' : l;",
         "document.documentElement.lang = l === 'en' ? 'en' : 'es';"),
        ('document.documentElement.lang = sv === "pt" ? "pt-BR" : (sv || "es");',
         'document.documentElement.lang = sv === "en" ? "en" : "es";'),
        ("document.documentElement.lang = sv === 'pt' ? 'pt-BR' : (sv || 'es');",
         "document.documentElement.lang = sv === 'en' ? 'en' : 'es';"),
    ):
        text = text.replace(old, new)
    return text, removed_objects


def run(root: Path) -> dict:
    if not root.is_dir() or root.is_symlink():
        raise ValueError('La raíz pública debe ser un directorio real: ' + str(root))
    changed = []
    removed_json_keys = 0
    removed_text_objects = 0
    for path in sorted(p for p in root.rglob('*') if p.is_file()):
        rel = path.relative_to(root).as_posix()
        if rel == '_redirects':
            continue
        if path.suffix.lower() == '.json':
            try:
                original = json.loads(path.read_text(encoding='utf-8'))
            except (UnicodeDecodeError, json.JSONDecodeError):
                continue
            drop_language_keys = rel in PT_LANGUAGE_JSON
            before_keys = sum(1 for _ in _walk_pt_keys(original)) if drop_language_keys else 0
            cleaned = clean_json_value(original, drop_language_keys=drop_language_keys)
            after_keys = sum(1 for _ in _walk_pt_keys(cleaned)) if drop_language_keys else 0
            removed_json_keys += before_keys - after_keys
            if cleaned != original:
                path.write_text(json.dumps(cleaned, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
                changed.append(rel)
            continue
        if path.suffix.lower() not in {'.html', '.js', '.css', '.xml', '.txt'}:
            continue
        try:
            old = path.read_text(encoding='utf-8')
        except UnicodeDecodeError:
            continue
        new, removed = clean_text(old, drop_language_objects=rel in PT_LANGUAGE_TEXT)
        removed_text_objects += removed
        if new != old:
            path.write_text(new, encoding='utf-8')
            changed.append(rel)
    report = {
        'changed_files': len(changed),
        'removed_json_language_keys': removed_json_keys,
        'removed_text_language_objects': removed_text_objects,
        'files': changed,
    }
    print(json.dumps(report, ensure_ascii=False))
    return report


def _walk_pt_keys(value):
    if isinstance(value, dict):
        for key, item in value.items():
            if str(key).lower().replace('_', '-') in {'pt', 'pt-br'}:
                yield key
            yield from _walk_pt_keys(item)
    elif isinstance(value, list):
        for item in value:
            yield from _walk_pt_keys(item)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path('dist'))
    run(parser.parse_args().root)
