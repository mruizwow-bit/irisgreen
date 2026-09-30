#!/usr/bin/env python3
"""R67 Aura · final global shell pass for all public Iris Green HTML.

Runs on dist after product-specific migrations. Existing R49/R50/R67 owners are
left intact; this pass only fills routes that still carry the legacy shell.
"""
from __future__ import annotations
import argparse,re
from pathlib import Path

BODY_RE=re.compile(r"<body\b([^>]*)>",re.I)
MAIN_RE=re.compile(r"<main\b([^>]*)>",re.I)
ROBOTS_NOINDEX=re.compile(r'<meta\b[^>]*name=["\']robots["\'][^>]*content=["\'][^"\']*noindex',re.I)
CSS=(
 "/assets/ig-global-ui-tokens-2026.css",
 "/assets/ig-r42-materials.css",
 "/assets/ig-audience.css",
 "/assets/ig-r49-transversal.css",
)
JS=(
 ("/assets/ig-theme.js",False),
 ("/assets/ig-r49-lang-bootstrap.js",False),
 ("/assets/ig-audience.js",False),
 ("/assets/ig-child-safe.js",True),
 ("/assets/interfaz-comun.js",True),
 ("/assets/musica.js",True),
 ("/assets/ig-r49-transversal.js",True),
)

def set_attr(attrs,name,value):
 pat=re.compile(r'(\s'+re.escape(name)+r'=)(["\']).*?\2',re.I|re.S)
 return pat.sub(lambda m:m.group(1)+'"'+value+'"',attrs,count=1) if pat.search(attrs) else attrs.rstrip()+f' {name}="{value}"'

def route_for(path,root):
 rel=path.relative_to(root).as_posix()
 if rel=="index.html": return "/"
 if rel=="en/index.html": return "/en/"
 if rel.endswith("/index.html"): return "/"+rel[:-10]
 return "/"+rel

def profile(route):
 work=("/taller/","/workshop/","/sitio-tranquilo/","/quiet-space/","/recursos/juegos/","/resources/games/","/tarjeta-iris/","/iris-card/")
 if any(x in route for x in work): return "workspace"
 browse=(
  "/es/neurodiversidad/condiciones/","/en/neurodiversity/conditions/",
  "/es/situaciones/","/en/situations/","/es/biblioteca/","/en/everyday-life/",
  "/es/datos/","/en/data/","/es/recursos/","/en/resources/",
  "/es/intereses/","/en/interests/","/es/videos/","/en/videos/",
  "/es/libros/","/en/books/","/es/tramites/directorio/","/en/support-directory/"
 )
 if route in browse: return "browse"
 return "content"

def add_head(text,markup,bare):
 if bare in text:return text
 out,n=re.subn(r"</head\s*>",markup+"</head>",text,count=1,flags=re.I)
 if n!=1:raise AssertionError("Public page has no </head>")
 return out

def candidate(path,root):
 rel=path.relative_to(root).as_posix()
 if rel in ("index.html","en/index.html"):return False
 if "/assets/" in "/"+rel:return False
 text=path.read_text(encoding="utf-8")
 if 'data-ig-home-version="v4"' in text:return False
 # Printing/utility outputs deliberately keep a minimal non-app shell.
 if ROBOTS_NOINDEX.search(text) and any(x in rel.lower() for x in ("imprimir","print","sprite","preview","qa/")):return False
 return True

def apply_one(path,root):
 before=path.read_text(encoding="utf-8")
 m=BODY_RE.search(before)
 if not m:raise AssertionError("Public HTML without body: "+str(path))
 route=route_for(path,root);prof=profile(route);attrs=m.group(1)
 existing='data-ig-r49=' in m.group(0)
 if not existing:
  for k,v in (("data-ig-r49","1"),("data-ig-profile",prof),("data-ig-materials","r42"),("data-ig-r49-owner","R67_GLOBAL")):
   attrs=set_attr(attrs,k,v)
 after=before[:m.start()]+"<body"+attrs+">"+before[m.end():]
 mm=MAIN_RE.search(after)
 if mm and not re.search(r'\bid=["\']',mm.group(1),re.I):
  ma=mm.group(1).rstrip()+' id="main"'
  after=after[:mm.start()]+"<main"+ma+">"+after[mm.end():]
 for href in CSS:after=add_head(after,f'<link rel="stylesheet" href="{href}">',href)
 if "/assets/preferencias-lectura.js" not in after:
  after=add_head(after,'<script src="/assets/preferencias-lectura.js"></script>',"/assets/preferencias-lectura.js")
 for src,defer in JS:after=add_head(after,f'<script{" defer" if defer else ""} src="{src}"></script>',src)
 if 'name="ig-r67-global-shell"' not in after:
  after=add_head(after,'<meta name="ig-r67-global-shell" content="1">','name="ig-r67-global-shell"')
 if after!=before:path.write_text(after,encoding="utf-8")
 return route,prof,not existing

def main():
 ap=argparse.ArgumentParser();ap.add_argument("--root",type=Path,required=True);root=ap.parse_args().root.resolve()
 pages=[]
 for base in (root/"es",root/"en"):
  if base.is_dir():pages.extend(p for p in base.rglob("*.html") if p.is_file())
 rows=[apply_one(p,root) for p in sorted(set(p for p in pages if candidate(p,root)))]
 filled=sum(1 for _,_,new in rows if new)
 profiles={k:sum(1 for _,p,_ in rows if p==k) for k in ("content","browse","workspace")}
 print({"checked":len(rows),"legacy_shells_filled":filled,"profiles":profiles})

if __name__=="__main__":main()
