#!/usr/bin/env python3
"""Inventaría lo que la salida pública necesita antes de endurecer Content-Security-Policy.

No modifica la web ni certifica seguridad. Separa scripts/estilos inline de recursos
externos para evitar desplegar una CSP que rompa páginas dinámicas y bloquea que la
política publicada se debilite silenciosamente respecto al baseline revisado.
"""
from __future__ import annotations
import argparse,json,re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
EXEC_DATA_TYPES={'application/ld+json','application/json','text/x-dc','application/schema+json'}
LOAD_LINK_RELS={'stylesheet','preload','modulepreload','icon','manifest'}
URL_ATTRS={'script':('src',),'img':('src',),'iframe':('src',),'audio':('src',),'video':('src','poster'),'source':('src',),'track':('src',)}
REMOTE_CALL=re.compile(r'\b(?:fetch|open|sendBeacon)\s*\(\s*[\"\'](https?://[^\"\']+)',re.I)
VIDEO_FRAME_SOURCES={'https://www.youtube-nocookie.com','https://player.vimeo.com','https://www.instagram.com'}
def origin(value):
    try:p=urlsplit(value)
    except ValueError:return None
    if p.scheme not in {'http','https'} or not p.netloc:return None
    return f'{p.scheme}://{p.netloc.lower()}'
def global_csp(root):
    headers=root/'_headers'
    if not headers.is_file():raise AssertionError(f'No existe _headers en la salida pública: {headers}')
    text=headers.read_text(encoding='utf-8',errors='strict');match=re.search(r'^/\*\s*$.*?^\s*Content-Security-Policy:\s*(.+)$',text,re.M|re.S)
    if not match:raise AssertionError('No se encuentra la Content-Security-Policy global en _headers')
    return match.group(1).splitlines()[0].strip()
def parse_csp(policy):
    directives={}
    for chunk in policy.split(';'):
        parts=chunk.strip().split()
        if not parts:continue
        name=parts[0].lower()
        if name in directives:raise AssertionError(f'Directiva CSP duplicada: {name}')
        directives[name]=parts[1:]
    return directives
def validate_csp_policy(root):
    policy=global_csp(root);directives=parse_csp(policy);required={'default-src','script-src','style-src','connect-src','frame-src','object-src','base-uri','form-action','frame-ancestors'}
    missing=sorted(required-directives.keys())
    if missing:raise AssertionError(f'CSP incompleta; faltan directivas críticas: {missing}')
    wildcards=sorted(name for name,tokens in directives.items() if '*' in tokens)
    if wildcards:raise AssertionError(f'CSP debilitada con comodín * en: {wildcards}')
    fixed={'default-src':{"'self'"},'object-src':{"'none'"},'base-uri':{"'self'"},'form-action':{"'self'"},'connect-src':{"'self'"}}
    for name,expected in fixed.items():
        got=set(directives[name])
        if name=='connect-src' and got=={"'none'"}:continue
        if got!=expected:raise AssertionError(f'CSP cambia el perímetro revisado de {name}: esperado {sorted(expected)}, obtenido {sorted(got)}')
    frame_sources=set(directives['frame-src'])
    if frame_sources!=VIDEO_FRAME_SOURCES:raise AssertionError(f'CSP cambia los proveedores de iframe revisados: esperado {sorted(VIDEO_FRAME_SOURCES)}, obtenido {sorted(frame_sources)}')
    ancestors=set(directives['frame-ancestors'])
    if ancestors not in ({"'self'"},{"'none'"}):raise AssertionError(f'CSP amplía frame-ancestors fuera de self/none: {sorted(ancestors)}')
    script_allowed={"'self'","'unsafe-inline'","'unsafe-eval'","'strict-dynamic'","'report-sample'"};style_allowed={"'self'","'unsafe-inline'","'report-sample'"}
    def cryptographic_source(token):return token.startswith(("'nonce-","'sha256-","'sha384-","'sha512-")) and token.endswith("'")
    bad_script=sorted(token for token in directives['script-src'] if token not in script_allowed and not cryptographic_source(token))
    if bad_script:raise AssertionError('CSP añade fuentes de script no revisadas: '+', '.join(bad_script))
    bad_style=sorted(token for token in directives['style-src'] if token not in style_allowed and not cryptographic_source(token))
    if bad_style:raise AssertionError('CSP añade fuentes de estilo no revisadas: '+', '.join(bad_style))
    unsafe_allowed={'script-src':{"'unsafe-inline'","'unsafe-eval'"},'style-src':{"'unsafe-inline'"}};unexpected=[]
    for name,tokens in directives.items():
        allowed=unsafe_allowed.get(name,set())
        for token in tokens:
            if token.startswith("'unsafe-") and token not in allowed:unexpected.append(f'{name} {token}')
    if unexpected:raise AssertionError('CSP incorpora permisos unsafe nuevos: '+', '.join(sorted(unexpected)))
    if 'upgrade-insecure-requests' not in directives:raise AssertionError('La CSP ha perdido upgrade-insecure-requests')
    return policy,directives
class PageAudit(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True);self.resource_origins=Counter();self.resource_examples={};self.inline_scripts=0;self.data_scripts=0;self.style_blocks=0;self.style_attrs=0;self.event_attrs=0;self.feed(text)
    def remember(self,value):
        o=origin(value)
        if not o:return
        self.resource_origins[o]+=1;examples=self.resource_examples.setdefault(o,[])
        if value not in examples and len(examples)<5:examples.append(value)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'style' in a:self.style_attrs+=1
        self.event_attrs+=sum(1 for k,_ in attrs if k.lower().startswith('on'))
        if tag=='script':
            if a.get('src'):self.remember(a['src'])
            else:
                typ=a.get('type','').lower().strip()
                if typ in EXEC_DATA_TYPES:self.data_scripts+=1
                else:self.inline_scripts+=1
        elif tag=='style':self.style_blocks+=1
        elif tag=='link':
            rel={x.lower() for x in a.get('rel','').split()}
            if rel&LOAD_LINK_RELS and a.get('href'):self.remember(a['href'])
        else:
            for attr in URL_ATTRS.get(tag,()):
                if a.get(attr):self.remember(a[attr])
def main():
    ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--root',type=Path,default=Path('dist'));ap.add_argument('--max-eval-like',type=int,default=6);args=ap.parse_args();root=args.root.resolve();policy,directives=validate_csp_policy(root)
    totals=Counter();origins=Counter();examples={};html_files=sorted(root.rglob('*.html'))
    for path in html_files:
        doc=PageAudit(path.read_text(encoding='utf-8',errors='strict'));totals['inline_scripts']+=doc.inline_scripts;totals['data_scripts']+=doc.data_scripts;totals['style_blocks']+=doc.style_blocks;totals['style_attrs']+=doc.style_attrs;totals['event_attrs']+=doc.event_attrs;origins.update(doc.resource_origins)
        for o,rows in doc.resource_examples.items():
            dst=examples.setdefault(o,[])
            for row in rows:
                if row not in dst and len(dst)<8:dst.append(row)
    js_files=sorted(root.rglob('*.js'));remote_calls=Counter();remote_examples={};eval_like=0
    for path in js_files:
        text=path.read_text(encoding='utf-8',errors='ignore');eval_like+=len(re.findall(r'\beval\s*\(|\bnew\s+Function\s*\(',text))
        for m in REMOTE_CALL.finditer(text):
            o=origin(m.group(1))
            if not o:continue
            remote_calls[o]+=1;ex=remote_examples.setdefault(o,[]);rel=path.relative_to(root).as_posix()
            if rel not in ex and len(ex)<8:ex.append(rel)
    insecure=sorted(o for o in set(origins)|set(remote_calls) if o.startswith('http://'))
    report={'html_revisados':len(html_files),'js_revisados':len(js_files),'inline':dict(totals),'recursos_externos':[{'origin':o,'referencias':n,'ejemplos':examples.get(o,[])} for o,n in sorted(origins.items())],'llamadas_remotas_js':[{'origin':o,'referencias':n,'archivos':remote_examples.get(o,[])} for o,n in sorted(remote_calls.items())],'eval_o_new_function':eval_like,'limite_eval_o_new_function':args.max_eval_like,'origenes_http_inseguros':insecure,'csp_publicada':policy,'csp_directivas':directives,'proveedores_iframe_revisados':sorted(VIDEO_FRAME_SOURCES),'csp_deuda_conocida':{'script_src_unsafe_inline':"'unsafe-inline'" in directives.get('script-src',[]),'script_src_unsafe_eval':"'unsafe-eval'" in directives.get('script-src',[]),'style_src_unsafe_inline':"'unsafe-inline'" in directives.get('style-src',[])}}
    out=root/'reports/publicacion';out.mkdir(parents=True,exist_ok=True);(out/'csp-inventario.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'html_revisados':len(html_files),'inline_scripts':totals['inline_scripts'],'style_blocks':totals['style_blocks'],'style_attrs':totals['style_attrs'],'event_attrs':totals['event_attrs'],'origenes_externos':len(origins),'llamadas_remotas_js':len(remote_calls),'eval_o_new_function':eval_like,'limite_eval_o_new_function':args.max_eval_like,'http_inseguro':len(insecure),'csp_guardada':True,'csp_directivas':len(directives)},ensure_ascii=False))
    if eval_like>args.max_eval_like:raise AssertionError(f'La salida pública ha aumentado eval()/new Function(): {eval_like} > {args.max_eval_like}.')
if __name__=='__main__':main()
