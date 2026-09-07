#!/usr/bin/env python3
"""Unify existing settings, preserving the text, catalogues and game rules.
No new fonts, diagnostic profiles or accounts; only migrate existing controls.
"""
from pathlib import Path
import re,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'reports/preferences';OUT.mkdir(parents=True,exist_ok=True)

def digest(s):return hashlib.sha256(s.encode()).hexdigest()
def method(s,name):
    m=re.search(r'^  '+name+r'\([^\n]*\) \{\n.*?^  \}',s,re.M|re.S)
    assert m,name
    return m

def replace_method(s,name,new):
    m=method(s,name);return s[:m.start()]+new+s[m.end():]

def closing_brace(s,start):
    depth=0;quote=None;escape=False
    for i in range(start,len(s)):
        c=s[i]
        if quote:
            if escape:escape=False
            elif c=='\\':escape=True
            elif c==quote:quote=None
        elif c in '\"\'`':quote=c
        elif c=='{':depth+=1
        elif c=='}':
            depth-=1
            if not depth:return i
    raise ValueError('Unbalanced state')

files=[ROOT/'index.html',*sorted((ROOT/'es').rglob('*.html')),*sorted((ROOT/'en').rglob('*.html'))]
report={'dynamic':[],'static':[],'unchanged':[],'changes':[], 'note':'This migrates presentation only, never a stored instruction to speak or play audio.'}
new_script='<script src="/assets/preferencias-lectura.js"></script>'
new_css='<link rel="stylesheet" href="/assets/preferencias-lectura.css">'
for p in files:
    old=p.read_text();s=old;dynamic='  setReading(patch)' in s
    static='assets/lectura-accesible.js' in s
    if not(dynamic or static):continue
    rel=p.relative_to(ROOT).as_posix()
    if new_script not in s:
        assert '</head>' in s
        s=re.sub(r'(<head\b[^>]*>)',lambda m:m[1]+new_script,s,count=1)
    if new_css not in s:s=s.replace('</head>',new_css+'\n</head>',1)
    if dynamic:
        if 'window.IGPreferences.connect(this)' not in s:
            a=method(s,'applyReading');b=method(s,'setReading')
            old_area=s[a.start():b.end()]
            speech=method(s,'setSpeak')[0]
            speech=speech.replace('u.lang = "es-ES";', 'u.lang = document.documentElement.lang || "es-ES";')
            replacement='''  applyReading() {
    window.IGPreferences.apply();
  }

'''+speech+'''

  setReading(patch) {
    window.IGPreferences.changeComponent(this, patch);
  }'''
            assert old_area.count('  setGuide(')==1
            s=s[:a.start()]+replacement+s[b.end():]
            a=s.index('state = {');b=closing_brace(s,s.index('{',a))
            s=s[:b].rstrip().rstrip(',')+', ...window.IGPreferences.componentState() '+s[b:]
            anchor='  componentDidMount() {\n';assert s.count(anchor)==1
            s=s.replace(anchor,anchor+'    this._igPreferencesDisconnect = window.IGPreferences.connect(this);\n',1)
            cleanup='    if (this._igPreferencesDisconnect) this._igPreferencesDisconnect();\n'
            if '  componentWillUnmount() {\n' in s:s=s.replace('  componentWillUnmount() {\n','  componentWillUnmount() {\n'+cleanup,1)
            else:
                anchor='  setReading(patch) {'
                s=s.replace(anchor,'  componentWillUnmount() {\n'+cleanup+'  }\n\n'+anchor,1)
            old_up='fsUp: () => this.setReading({ fs: Math.min(st.fs + 2, 25) })'
            old_down='fsDown: () => this.setReading({ fs: Math.max(st.fs - 2, 15) })'
            assert s.count(old_up)==s.count(old_down)==1,rel
            s=s.replace(old_up,'fsUp: () => window.IGPreferences.step(1)').replace(old_down,'fsDown: () => window.IGPreferences.step(-1)')
            old_reset='a11yReset: () => this.setReading({ fs: 17, spacing: false, controls: false, contrast: false, guide: false, speak: false, motion: false })'
            assert s.count(old_reset)==1
            s=s.replace(old_reset,'a11yReset: () => window.IGPreferences.reset()')
            assert s.count('a11yOpen:')==1
            s=s.replace('a11yOpen:', 'preferenceStatus: window.IGPreferences.status(st.lang),\n      fsUpDisabled: st.fs >= 25.5, fsDownDisabled: st.fs <= 17,\n      a11yOpen:',1)
            for key in ['fsUp','fsDown']:
                pattern=r'<button\b[^>]*sc-camel-on-click="\{\{ '+key+r' \}\}"[^>]*>'
                def dis(m):
                    assert 'disabled=' not in m[0]
                    return m[0][:-1]+' disabled="{{ '+key+'Disabled }}">'
                s,n=re.subn(pattern,dis,s);assert n==1,(rel,key)
            pattern=r'(<button\b[^>]*sc-camel-on-click="\{\{ a11yReset \}\}"[^>]*>.*?</button>)'
            note='<p class="ig-preference-note" role="status">{{ preferenceStatus }}</p>'
            s,n=re.subn(pattern,lambda m:m[0]+note,s,flags=re.S);assert n==1,rel
        assert 'this.setGuide' not in s and 'const next = Object.assign({ fs: st.fs' not in s
        report['dynamic'].append(rel)
        for label,pattern in [('main',r'<main\b[^>]*>.*?</main>'),('editorial',r'<script[^>]*data-dc-script[^>]*>(.*?)class Component extends DCLogic')]:
            a=re.search(pattern,old,re.S);b=re.search(pattern,s,re.S)
            assert a and b and a[0]==b[0],(rel,label)
    else:
        report['static'].append(rel)
        assert old.split('</head>',1)[1]==s.split('</head>',1)[1],rel
    if old!=s:p.write_text(s);report['changes'].append({'page':rel,'before_sha256':digest(old),'after_sha256':digest(s)})
assert len(report['dynamic'])==25,report['dynamic']

p=ROOT/'assets/lectura-accesible.js';old=p.read_text()
if "var P=window.IGPreferences" not in old:
    new='''/* Static-page adapter for the shared preference controller. */
(function(){
 var P=window.IGPreferences;
 if(!P)return;
 var names={ls:'spacing',big:'controls',hc:'contrast',guide:'guide',rm:'motion'};
 document.querySelectorAll('[data-a]').forEach(function(b){
  b.addEventListener('click',function(){
   var a=b.dataset.a;
   if(a==='fs+')P.step(1);
   else if(a==='fs-')P.step(-1);
   else if(a==='reset')P.reset();
   else if(a==='tts'){
    var on=!P.speechOn();P.setSpeech(on);
    if(!on&&window.speechSynthesis)window.speechSynthesis.cancel();
   }else if(names[a]){var patch={};patch[names[a]]=!P.get()[names[a]];P.update(patch);}
  });
 });
'''
    a=old.index(' function toggle(');b=old.index(" document.addEventListener('pointermove'",a)
    new+=old[a:b]
    new+=''' document.querySelectorAll('main p, main li, main h1, main h2').forEach(function(el){el.setAttribute('data-read','');});
 document.addEventListener('click',function(e){
  if(!P.speechOn()||!window.speechSynthesis||e.target.closest('button,a,input,textarea,select'))return;
  var el=e.target.closest('[data-read]');if(!el)return;
  window.speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(el.textContent);u.lang=document.documentElement.lang;window.speechSynthesis.speak(u);
 });
 P.apply();
})();
'''
    p.write_text(new)
p=ROOT/'scripts/test_accessibility_batch.py';s=p.read_text()
s=s.replace('for _ in range(4):plus.click()', 'for _ in range(4):\n       if plus.is_enabled():plus.click()\n      assert not plus.is_enabled(),"The maximum must be visible as a disabled increase control"')
p.write_text(s)
report['summary']={'dynamic_pages':len(report['dynamic']),'static_pages':len(report['static']),'controls':['size','spacing','large controls','contrast','reading guide','speech (not persisted)','reduced motion'],'size_percentages':[100,115,130,150],'key':'ig-a11y','version':2}
path=OUT/'migration.json'
if not path.exists() or report['changes']:path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report['summary'],ensure_ascii=False))
