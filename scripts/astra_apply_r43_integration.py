#!/usr/bin/env python3
"""Astra · integración idempotente de R43 sobre el HEAD A2 vigente."""
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]

def read(rel): return (ROOT/rel).read_text(encoding="utf-8")
def write(rel,s): (ROOT/rel).write_text(s,encoding="utf-8")

# 1) Build: legacy -> suite R43 -> cobertura material Taller.
rel="scripts/build_site.py"; s=read(rel)
legacy="    subprocess.run([sys.executable,str(ROOT/'scripts/build_taller_estudios.py')],cwd=ROOT,check=True)"
suite="    subprocess.run([sys.executable,str(ROOT/'scripts/build_taller_suite.py')],cwd=ROOT,check=True)"
cover="    subprocess.run([sys.executable,str(ROOT/'scripts/apply_taller_materials_r43.py'),'--root',str(ROOT)],cwd=ROOT,check=True)"
if suite not in s:
    if legacy not in s: raise AssertionError("build_site.py: insertion point missing")
    s=s.replace(legacy,legacy+"\n    # R43: suite creativa del Taller.\n"+suite,1)
if cover not in s:
    if suite not in s: raise AssertionError("build_site.py: suite call missing")
    s=s.replace(suite,suite+"\n    # Design R02: cobertura de todas las rutas públicas del Taller.\n"+cover,1)
write(rel,s)

# 2) R43 owns structures/programming/robotics; design legacy is overwritten later by suite.
rel="scripts/build_taller_estudios.py"; s=read(rel)
s2=re.sub(r"STUDIO_NAMES\s*=\s*\[[^\n]*\]", "STUDIO_NAMES = ['dibujo', 'ideas', 'circuitos', 'maquinas', 'diseno']", s, count=1)
if s2==s and "STUDIO_NAMES = ['dibujo', 'ideas', 'circuitos', 'maquinas', 'diseno']" not in s:
    raise AssertionError("build_taller_estudios.py: STUDIO_NAMES missing")
write(rel,s2)

# 3) Structural calculator additions required by R43.
rel="assets/ig-taller-estructuras-calc.js"; s=read(rel)
if "ld.type === 'pesos'" not in s:
    old="    var cases = [], ld = model.load || { type: 'peso', kg: 1, at: [0, 0] };\n    if (ld.type === 'peso') {"
    new="    var cases = [], ld = model.load || { type: 'peso', kg: 1, at: [0, 0] };\n    if (ld.type === 'pesos') {\n      /* varios pesos colgados de nudos concretos (estudio R43) */\n      var pts = [];\n      (ld.points || []).forEach(function (p) { if (model.nodes[p.node] && p.kg > 0) pts.push([p.node, p.kg * G]); });\n      cases.push({ pos: null, point: pts });\n      return cases;\n    }\n    if (ld.type === 'peso') {"
    if old not in s: raise AssertionError("structures calc: loadCases insertion point missing")
    s=s.replace(old,new,1)
s=s.replace("var sc = SCALES[model.scale]; if (!sc.road) return null;", "var sc = SCALES[model.scale]; if (!sc.road || model.noDeck) return null;",1)
s=s.replace("if (ld.type && ld.type !== 'peso') {", "if (ld.type && ld.type !== 'peso' && ld.type !== 'pesos') {",1)
write(rel,s)

# 4) Life-stage is an ephemeral URL lens, never sessionStorage/localStorage.
rel="assets/ig-taller-r42.js"; s=read(rel)
if "function urlStage()" not in s:
    anchor="  function stageSelector(study){"
    fn="  function urlStage(){var m={infancia:'child',childhood:'child',child:'child',adolescencia:'teen',adolescence:'teen',teen:'teen',adultez:'adult',adulthood:'adult',adult:'adult'};try{var q=new URLSearchParams(root.location.search);return m[String(q.get('para')||q.get('for')||'').toLowerCase()]||'all';}catch(e){return'all';}}\n"
    if anchor not in s: raise AssertionError("ig-taller-r42.js: stageSelector missing")
    s=s.replace(anchor,fn+anchor,1)
s=s.replace("  var currentStage='all';\n","")
s=s.replace("    var current=currentStage;\n","    var current=urlStage();/* R43: etapa en URL; no se persiste */\n")
s=s.replace("current=s[0];currentStage=current;","current=s[0];")
s=s.replace("updateStageBrief(study,currentStage);","updateStageBrief(study,urlStage());")
s=re.sub(r"    var key='ig42-stage';var current='all';try\{current=root\.sessionStorage\.getItem\(key\)\|\|'all';\}catch\(e\)\{\}\n","    var current=urlStage();/* R43: etapa en URL; no se persiste */\n",s,count=1)
s=s.replace("current=s[0];try{root.sessionStorage.setItem(key,current);}catch(e){}","current=s[0];")
s=s.replace("updateStageBrief(study,(function(){try{return root.sessionStorage.getItem('ig42-stage')||'all';}catch(e){return'all';}})());","updateStageBrief(study,urlStage());")
if re.search(r"sessionStorage[^\n]*ig42-stage|ig42-stage[^\n]*sessionStorage",s,re.I):
    raise AssertionError("ig-taller-r42.js: stage persistence remains")
write(rel,s)

# 5) Design R02 token bridge inside R43 suite CSS.
rel="assets/ig-suite.css"; s=read(rel)
old="""body[data-ig-suite] {
  --igs-ink:#172b42; --igs-ink-soft:#44586c; --igs-navy:#17395c; --igs-blue:#1f5f8b; --igs-violet:#5a49a8;
  --igs-line:#c9d8e6; --igs-control:#7d93a8; --igs-canvas:#fbfcfe; --igs-soft:#f4f7fa; --igs-hover:#e8f1f8;
  --igs-ok:#1d6b3a; --igs-warn:#8a4b00; --igs-bad:#a1283c; --igs-focus:#5a49a8;
  --igs-radius:14px;
}"""
new="""/* R42 · tokens de la suite consumen el sistema material con fallback. */
body[data-ig-suite] {
  --igs-ink:var(--ig-ink,#172b42); --igs-ink-soft:var(--ig-ink-muted,#44586c); --igs-navy:var(--ig-state-selected,#17395c); --igs-blue:#1f5f8b; --igs-violet:#5a49a8;
  --igs-line:var(--ig-separator,#c9d8e6); --igs-control:var(--ig-control-border,#7a869d); --igs-canvas:#fbfcfe; --igs-soft:var(--ig-surface-content-soft,#f4f7fa); --igs-hover:var(--ig-state-hover,#e8f1f8);
  --igs-ok:var(--ig-state-success,#1d6b3a); --igs-warn:#8a4b00; --igs-bad:var(--ig-state-error,#a1283c); --igs-focus:var(--ig-focus,#5a49a8);
  --igs-radius:14px;
}"""
if old in s: s=s.replace(old,new,1)
elif "--igs-ink:var(--ig-ink" not in s: raise AssertionError("ig-suite.css token block changed")
s=s.replace("body[data-ig-suite] .igs-btn:disabled { opacity:.55; cursor:not-allowed; }","body[data-ig-suite] .igs-btn:disabled { cursor:not-allowed; color:var(--ig-state-disabled-ink,#5f6b80); background:var(--ig-state-disabled-surface,#eef2f6); border-color:var(--ig-separator,#c9d8e6); }",1)
s=s.replace('html[data-ig-contrast="on"] body[data-ig-suite] { --igs-line:#7189a0; --igs-control:#40566d; --igs-ink-soft:#2c3f52; }','html[data-ig-contrast="on"] body[data-ig-suite] { --igs-line:#7189a0; --igs-control:#17395c; --igs-ink-soft:#17395c; }',1)
s=s.replace("border:2px solid #172b42; background:rgba(255,255,255,.92); color:#172b42;","border:2px solid var(--igs-ink); background:var(--ig-surface-content,#fff); color:var(--igs-ink);",1)
toolbar='body[data-ig-materials="r42"][data-ig-suite] .igs-toolbar { background:var(--ig-chrome-solid-light,#fff); border-color:var(--ig-separator,#c9d8e6); -webkit-backdrop-filter:none; backdrop-filter:none; }'
if toolbar not in s:
    s += "\n\n/* R42 · toolbar móvil = chrome opaco sobre lienzo estable. */\n"+toolbar+"\n"
write(rel,s)

# 6) R43 generated pages load Design R02 materials.
rel="scripts/build_taller_suite.py"; s=read(rel)
if "MATERIALS_CSS" not in s:
    s=s.replace("ASSET_V = 'r43-1'\nSHELL_CSS = '/assets/ig-r42-shell.css?v=r42-a3-1'","ASSET_V = 'r43-1'\nMATERIALS_CSS = '/assets/ig-r42-materials.css?v=r42-design-1'\nSHELL_CSS = '/assets/ig-r42-shell.css?v=r42-design-1'",1)
s=s.replace("f'<link rel=\"stylesheet\" href=\"{SHELL_CSS}\"><link rel=\"stylesheet\" href=\"/assets/ig-suite.css?v={ASSET_V}\">'","f'<link rel=\"stylesheet\" href=\"{MATERIALS_CSS}\"><link rel=\"stylesheet\" href=\"{SHELL_CSS}\"><link rel=\"stylesheet\" href=\"/assets/ig-suite.css?v={ASSET_V}\">'",1)
s=s.replace('f\'<body data-ig-r42-pilot="true" data-ig-r42-family="workshop" data-ig-suite="{mod.ENGINE}">\'','f\'<body data-ig-r42-pilot="true" data-ig-r42-family="workshop" data-ig-materials="r42" data-ig-suite="{mod.ENGINE}">\'',1)
write(rel,s)

# 7) Dialogs live outside shell; give them the same token scope.
rel="assets/ig-r42-shell.css"; s=read(rel)
if ".ig-r42-shell,\n  .ig-r42-dialog {" not in s:
    s=s.replace("  .ig-r42-shell {","  .ig-r42-shell,\n  .ig-r42-dialog {",1)
write(rel,s)

print("Astra R43 current-base integration patch: PASS")
