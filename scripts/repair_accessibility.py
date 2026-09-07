#!/usr/bin/env python3
"""Focused accessibility changes; preserve illustrations, zones and game rules.
The same actions are reachable through large equivalent buttons (WCAG 2.5.5).
Reading remains non-modal: users may tab back into the page; Escape closes it.
"""
import re,json,hashlib
from pathlib import Path
ROOT=Path.cwd();OUT=ROOT/'reports/accessibility';OUT.mkdir(parents=True,exist_ok=True)
if (OUT/'changes.json').exists():
    print('Accessibility migration already applied. Run tests without reapplying.');raise SystemExit(0)
report={'dynamic_reading_pages':[],'touch_games':[],'preserved':{},'notes':[]}
def sha(text):return hashlib.sha256(text.encode()).hexdigest()
def once(s,old,new):
    assert s.count(old)==1,(old[:100],s.count(old));return s.replace(old,new,1)
def end_block(s,start,tag):
    level=0
    for m in re.finditer(r'</?'+tag+r'\b[^>]*>',s[start:]):
        level += -1 if m[0].startswith('</') else 1
        if not level:return start+m.end()
    raise ValueError(tag)
def attr(tag,name,val):
    pat=r'\s'+re.escape(name)+r'=(?:"[^"]*"|\x27[^\x27]*\x27)'
    tag=re.sub(pat,'',tag)
    return tag[:-1]+' '+name+'="'+val+'">'
def dic(s):
    m=re.search(r'const STR = ([\s\S]*?)\nclass Component extends DCLogic',s)
    return sha(m[1]) if m else None
for p in [ROOT/'index.html',*sorted((ROOT/'es').rglob('*.html')),*sorted((ROOT/'en').rglob('*.html'))]:
    s=p.read_text();before=dic(s);rel=p.relative_to(ROOT).as_posix()
    if '<sc-if value="{{ a11yOpen }}"' in s:
        a=s.index('<sc-if value="{{ a11yOpen }}"');b=end_block(s,a,'sc-if');chunk=s[a:b]
        d=chunk.index('<div');e=chunk.index('>',d)+1
        opening=chunk[d:e]
        for name,val in [('id','ig-reading-panel'),('data-ig-reading-panel',''),('role','region'),('aria-labelledby','ig-reading-title'),('popover','manual')]:opening=attr(opening,name,val)
        chunk=chunk[:d]+opening+chunk[e:]
        chunk,n=re.subn(r'<strong\b[^>]*>',lambda m:attr(m[0],'id','ig-reading-title'),chunk,count=1);assert n==1
        chunk,n=re.subn(r'<button\b[^>]*sc-camel-on-click="\{\{ toggleA11y \}\}"[^>]*>',lambda m:attr(m[0],'data-ig-reading-close',''),chunk,count=1);assert n==1
        s=s[:a]+chunk+s[b:]
        def opener(m):
            tag=m[0]
            for name,val in [('data-ig-reading-trigger',''),('aria-controls','ig-reading-panel'),('aria-expanded','{{ a11yOpen }}')]:tag=attr(tag,name,val)
            return tag
        s,n=re.subn(r'<button\b[^>]*class="[^"]*ig-uh-reading[^"]*"[^>]*>',opener,s);assert n==1
        s=once(s,'b.style.zoom = (s.fs / 17).toFixed(3);','b.style.zoom = "";\n    const readingMain = document.querySelector("main");\n    if (readingMain) readingMain.style.zoom = (s.fs / 17).toFixed(3);')
        report['dynamic_reading_pages'].append(rel)
    if p.parent.name in {'las-cinco-cosas','el-mapa-del-tesoro-de-casa'}:
        vera=p.parent.name=='las-cinco-cosas';name='spots' if vera else 'rooms';v='s' if vera else 'r'
        a=s.index('<sc-for list="{{ '+name+' }}"');b=end_block(s,a,'sc-for')
        chunk=s[a:b]
        chunk=once(chunk,'<button sc-camel-on-click=', '<button class="ig-picture-target" sc-camel-on-click=')
        s=s[:a]+chunk+s[b:];b=a+len(chunk)
        pos=s.index('</div>',b)+6
        label='aria' if vera else 'name';pressed='found' if vera else 'marked'
        controls='''
    <details class="ig-touch-alternative">
      <summary>{{ tTouchControls }}</summary>
      <div class="ig-touch-choices" role="group" aria-label="{{ tTouchControls }}">
        <sc-for list="{{ LIST }}" as="VAR" hint-placeholder-count="COUNT">
          <button type="button" sc-camel-on-click="{{ VAR.click }}" aria-pressed="{{ VAR.PRESSED }}">{{ VAR.LABEL }}EXTRA</button>
        </sc-for>
      </div>
    </details>'''.replace('LIST',name).replace('VAR',v).replace('COUNT','5' if vera else '8').replace('PRESSED',pressed).replace('LABEL',label)
        extra='' if vera else '<span style="display: {{ r.chipDisplay }}; color: {{ r.chipColor }};"> · {{ r.chipText }}</span>'
        controls=controls.replace('EXTRA',extra)
        s=s[:pos]+controls+s[pos:]
        s=once(s,'      langButtons:', '      tTouchControls: ({es:"Usar botones en lugar de tocar la imagen",en:"Use buttons instead of tapping the picture",pt:"Usar botões em vez de tocar na imagem"})[L] || "Usar botones en lugar de tocar la imagen",\n      langButtons:')
        if not vera:s=once(s,'          name: T.rooms[n],','          name: T.rooms[n], marked: !!visible,')
        report['touch_games'].append(rel)
    assert dic(s)==before,'Existing dictionary changed: '+rel
    if s!=p.read_text():
        report['preserved'][rel]={'dictionary_sha256':before}
        p.write_text(s)
controller=r'''
/* Reading accessibility: one controller for the existing controls, no DOM polling. */
(function(){
  'use strict';
  if(window.IGReading)return;
  var trigger=null,active=null,restore=true,frame=0;
  var opener='[data-ig-reading-trigger],.ig-uh-reading,#a11yBtn';
  function panel(){return document.querySelector('[data-ig-reading-panel]');}
  function label(){return (document.documentElement.lang||'es').startsWith('en')?'Close reading settings':'Cerrar opciones de lectura';}
  function shown(p){return p&&p.isConnected&&!p.hidden;}
  function isPopover(p){return typeof p.hidePopover==='function'&&p.matches(':popover-open');}
  function focusBack(){if(restore&&trigger&&trigger.isConnected)trigger.focus({preventScroll:true});}
  function synchronize(){
    frame=0;
    var p=panel();
    if(!shown(p)){
      if(active){if(isPopover(active))active.hidePopover();active=null;focusBack();}
      document.querySelectorAll(opener).forEach(function(b){b.setAttribute('aria-expanded','false');});
      restore=true;return;
    }
    document.querySelectorAll(opener).forEach(function(b){b.setAttribute('aria-controls',p.id);b.setAttribute('aria-expanded','true');});
    if(active===p)return;
    active=p;
    document.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'reading'}));
    if(typeof p.showPopover==='function'&&!isPopover(p))p.showPopover();
    var close=p.querySelector('[data-ig-reading-close]');
    if(close)close.focus({preventScroll:true});
  }
  function schedule(){if(frame)cancelAnimationFrame(frame);frame=requestAnimationFrame(synchronize);}
  function closeReading(back){
    var p=panel();if(!shown(p))return;
    restore=back!==false;
    if(p.id==='a11y'){p.hidden=true;schedule();}
    else {var b=p.querySelector('[data-ig-reading-close]');if(b)b.click();}
  }
  function prepareStatic(){
    var p=document.getElementById('a11y');if(!p||p.hasAttribute('data-ig-reading-panel'))return;
    p.setAttribute('data-ig-reading-panel','');p.setAttribute('role','region');p.setAttribute('popover','manual');
    var h=p.querySelector('h2');if(h){h.id='ig-reading-title';p.setAttribute('aria-labelledby',h.id);}
    var b=document.createElement('button');b.type='button';b.setAttribute('data-ig-reading-close','');b.setAttribute('aria-label',label());b.textContent='×';p.insertBefore(b,p.firstChild);
    b.addEventListener('click',function(){p.hidden=true;schedule();});
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest(opener);
    if(b){trigger=b;restore=true;schedule();}
    else if(e.target.closest('[data-ig-reading-close]'))schedule();
  },true);
  document.addEventListener('keydown',function(e){
    if(e.key!=='Escape'||!shown(panel())||e.target.closest('#ig-game-letter,#ig-music-panel'))return;
    e.preventDefault();e.stopImmediatePropagation();closeReading(true);
  },true);
  document.addEventListener('ig:panel-opening',function(e){if(e.detail==='music')closeReading(false);});
  window.IGReading={close:closeReading};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prepareStatic,{once:true});else prepareStatic();
})();
'''
p=ROOT/'assets/interfaz-comun.js';s=p.read_text();assert 'window.IGReading' not in s;p.write_text(s+controller)
css=r'''
/* Accessibility batch: non-modal reading settings, independent of page flow. */
[data-ig-reading-panel]{position:fixed!important;inset:auto max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) auto!important;width:min(340px,calc(100% - 24px))!important;max-width:calc(100% - 24px)!important;max-height:calc(100dvh - 24px)!important;box-sizing:border-box!important;overflow:auto!important;margin:0!important;z-index:10000!important;padding:18px!important;border:1px solid #dfe6ef!important;border-radius:18px!important;background:rgba(255,255,255,.98)!important;color:#17395c!important;box-shadow:0 12px 40px -16px rgba(23,57,92,.4)!important;font:16px/1.45 'Atkinson Hyperlegible',system-ui,sans-serif!important;transform:none!important;filter:none!important}
[data-ig-reading-panel]::backdrop{background:transparent;pointer-events:none}
[data-ig-reading-panel] *{box-sizing:border-box}
[data-ig-reading-panel] button{min-height:44px!important;min-width:44px!important;max-width:100%;white-space:normal}
[data-ig-reading-close]{width:44px!important;height:44px!important;min-width:44px!important;flex:none;cursor:pointer;color:#17395c!important;font-size:22px!important}
#a11y>[data-ig-reading-close]{float:right;background:white;border:1px solid #dfe6ef;border-radius:999px}
[data-ig-reading-panel] .ctrls{clear:both;gap:8px}
[data-ig-reading-panel] .grp{flex-wrap:wrap}
[data-ig-reading-panel] button:focus-visible{outline:3px solid #5a49a8!important;outline-offset:2px!important}
html[data-ig-contrast="on"] body{filter:none!important}
html[data-ig-contrast="on"] main{filter:contrast(1.2) saturate(1.1)}
.ig-touch-alternative{margin:12px 0;border:1px solid #dfe6ef;border-radius:14px;background:rgba(255,255,255,.82)}
.ig-touch-alternative>summary{min-height:44px;padding:12px 14px;cursor:pointer;color:#17395c;font-size:16px;line-height:1.45}
.ig-touch-choices{display:flex;flex-wrap:wrap;gap:8px;padding:0 12px 12px}
.ig-touch-choices>button{min-width:44px!important;min-height:44px!important;padding:10px 14px;border:1px solid #dfe6ef;border-radius:999px;background:#fff;color:#17395c;font:inherit;cursor:pointer;text-align:left;max-width:100%;white-space:normal}
.ig-touch-choices>button[aria-pressed=true]{border-color:#5a49a8;background:rgba(90,73,168,.1)}
.ig-picture-target{min-width:0!important;min-height:0!important}
.ig-picture-target:focus-visible{outline:3px solid #5a49a8!important;outline-offset:-3px!important}
'''
p=ROOT/'assets/ajustes-interfaz.css';p.write_text(p.read_text()+css)
p=ROOT/'assets/musica.js';s=p.read_text()
s=once(s,'var panel, audio, playButton, title, author, status, closeButton, lastTrigger, labels,','var panel, audio, playButton, title, author, status, closeButton, lastTrigger, labels, previousButton, nextButton, listSummary, volumeLabel, volumeSlider, repeatText, creditText,')
s=once(s,'  function ensureAudio() {',r'''  function updateLabels() {
    if(!panel)return;
    labels=language();
    panel.querySelector('#ig-music-title').textContent=labels.title;
    closeButton.setAttribute('aria-label',labels.close);
    previousButton.textContent=labels.prev;nextButton.textContent=labels.next;
    listSummary.textContent=labels.list;volumeLabel.textContent=labels.volume;
    volumeSlider.setAttribute('aria-label',labels.volume);
    repeatText.textContent=labels.repeat;creditText.textContent=labels.credit;
    if(status.textContent)status.textContent=labels.error;
    sync();
  }
  function ensureAudio() {''')
s=once(s,"controls.append(button(labels.prev,function(){play(selected-1);}),playButton,button(labels.next,function(){play(selected+1);}));panel.append(controls);", "previousButton=button(labels.prev,function(){play(selected-1);});nextButton=button(labels.next,function(){play(selected+1);});\n    controls.append(previousButton,playButton,nextButton);panel.append(controls);")
s=once(s,"volume.append(el('span',labels.volume),slider);panel.append(volume);", "volumeLabel=el('span',labels.volume);volumeSlider=slider;volume.append(volumeLabel,slider);panel.append(volume);")
s=once(s,"var details=el('details'), summary=el('summary',labels.list),list=el('ol');","var details=el('details'), summary=el('summary',labels.list),list=el('ol');listSummary=summary;")
s=once(s,"loopLabel.append(loop,el('span',labels.repeat));panel.append(loopLabel);","repeatText=el('span',labels.repeat);loopLabel.append(loop,repeatText);panel.append(loopLabel);")
s=once(s,"panel.append(status,el('p',labels.credit,'ig-m-credit'));","creditText=el('p',labels.credit,'ig-m-credit');panel.append(status,creditText);")
s=once(s,"    labels=language();panel.querySelector('#ig-music-title').textContent=labels.title;\n    closeButton.setAttribute('aria-label',labels.close);sync();panel.hidden=false;","    document.dispatchEvent(new CustomEvent('ig:panel-opening',{detail:'music'}));\n    updateLabels();panel.hidden=false;")
s=once(s,"document.addEventListener('keydown',function(event){if(event.key==='Escape'&&open){event.preventDefault();close(true);}});",r'''document.addEventListener('keydown',function(event){
    var b=event.target.closest&&event.target.closest(selector);
    if(b&&b.tagName!=='BUTTON'&&event.key===' '){event.preventDefault();b.click();return;}
    if(event.key==='Escape'&&open){event.preventDefault();event.stopImmediatePropagation();close(true);}
  });
  document.addEventListener('ig:panel-opening',function(e){if(e.detail==='reading'&&open)close(false);});
  // Only one attribute is observed: language changes, never the page subtree.
  new MutationObserver(updateLabels).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});''')
s=s.replace('min-height:30px','min-height:44px').replace('min-height:36px','min-height:44px')
p.write_text(s)
report['notes']=['The two picture games retain the original hotspot geometry; a disclosure offers equivalent 44px controls using the same callbacks and translated labels.','The picture controls do not grow over neighbouring objects in Big buttons mode.','Reading is a non-modal region: focus enters it on opening; Escape/close restores the opener; Tab may leave it.','Opening Reading or Music closes the other panel without stopping audio or shifting content.','Player labels follow the current language without duplicating the panel or player.','The existing 25 STR dictionaries and all game zones are unchanged; one accessibility instruction is added outside STR.','Content magnification no longer zooms the navigation and floating settings.']
(OUT/'changes.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False))
