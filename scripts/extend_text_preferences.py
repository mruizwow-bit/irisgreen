#!/usr/bin/env python3
"""Add independent text preferences to the existing controller and panel.
No second store, external font service, diagnostic profile or editorial changes.
"""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'reports/text-preferences';OUT.mkdir(parents=True,exist_ok=True)

def once(text,old,new):
    if new in text:return text
    assert text.count(old)==1,(old[:90],text.count(old))
    return text.replace(old,new,1)

EXTRA=r'''
  // Optional text settings keep the version-2 legacy representation unchanged.
  var TEXT_FONTS = {original:'',sans:'Arial, Helvetica, sans-serif',wide:'Verdana, Geneva, sans-serif',serif:'Georgia, "Times New Roman", serif'};
  var TEXT_NUMBERS = {letter:[0,.2],word:[0,.4],line:[1,2.4],paragraph:[0,3]};
  function textDefaults() { return {font:'original',letter:null,word:null,line:null,paragraph:null,width:'original'}; }
  function normalizeText(value) {
    var t=textDefaults();if(!validObject(value))return t;
    if(Object.prototype.hasOwnProperty.call(TEXT_FONTS,value.font))t.font=value.font;
    if(['original','medium','narrow'].indexOf(value.width)!==-1)t.width=value.width;
    Object.keys(TEXT_NUMBERS).forEach(function(k){
      var n=value[k],r=TEXT_NUMBERS[k];
      if(typeof n==='number'&&Number.isFinite(n))t[k]=Math.round(Math.min(r[1],Math.max(r[0],n))*1000)/1000;
    });return t;
  }
  function customText(t) { var d=textDefaults();return Object.keys(d).some(function(k){return t[k]!==d[k];}); }
  function effectiveText() {
    var t=normalizeText(state.text);
    if(state.spacing){if(t.letter===null)t.letter=.045;if(t.word===null)t.word=.12;if(t.line===null)t.line=1.9;}
    return t;
  }
  function applyTextRoot(root) {
    var t=effectiveText();root.dataset.igTextFont=t.font;root.dataset.igTextWidth=t.width;
    root.style.setProperty('--ig-text-font',TEXT_FONTS[t.font]||'inherit');
    root.style.setProperty('--ig-text-width',t.width==='narrow'?'48ch':'65ch');
    Object.keys(TEXT_NUMBERS).forEach(function(k){
      root.setAttribute('data-ig-text-'+k,t[k]===null?'original':'set');
      if(t[k]===null)root.style.removeProperty('--ig-text-'+k);
      else root.style.setProperty('--ig-text-'+k,String(t[k])+(k==='line'?'':'em'));
    });
  }
  function mergeTextPatch(next,patch) {
    var t=normalizeText(next.text);
    if(Object.prototype.hasOwnProperty.call(patch,'spacing')){
      Object.keys(TEXT_NUMBERS).forEach(function(k){t[k]=null;});
    }
    if(validObject(patch.text)){
      var changesNumbers=Object.keys(TEXT_NUMBERS).some(function(k){return Object.prototype.hasOwnProperty.call(patch.text,k);});
      if(changesNumbers&&next.spacing){t=effectiveText();next.spacing=false;}
      Object.keys(t).forEach(function(k){if(Object.prototype.hasOwnProperty.call(patch.text,k))t[k]=patch.text[k];});
    }
    t=normalizeText(t);if(customText(t))next.text=t;else delete next.text;
  }
  var TEXT_LABELS={
    es:{title:'Tipografía, espaciado y anchura',font:'Tipografía del texto',letter:'Separación entre letras',word:'Separación entre palabras',line:'Distancia entre líneas',paragraph:'Separación entre párrafos',width:'Anchura de lectura',original:'Original',fonts:['Original de Iris Green','Arial o similar','Verdana o similar','Georgia o similar'],widths:['Original','Media · hasta 65 caracteres','Estrecha · hasta 48 caracteres'],reset:'Restablecer estos ajustes',note:'Cada ajuste es independiente. No cambia el tamaño elegido, las imágenes ni la música. Las letras alternativas dependen de las fuentes disponibles en tu dispositivo.',sample:'Esta es una muestra para comparar la letra y los espacios.',sample2:'Puedes cambiar una opción sin modificar las demás.',relative:'veces el tamaño de letra'},
    en:{title:'Typeface, spacing and reading width',font:'Text typeface',letter:'Letter spacing',word:'Word spacing',line:'Line spacing',paragraph:'Paragraph spacing',width:'Reading width',original:'Original',fonts:['Iris Green original','Arial or similar','Verdana or similar','Georgia or similar'],widths:['Original','Medium · up to 65 characters','Narrow · up to 48 characters'],reset:'Reset these settings',note:'Each setting is independent. It does not change your chosen size, images or music. Alternative typefaces depend on the fonts available on your device.',sample:'This is a sample for comparing typefaces and spacing.',sample2:'You can change one setting without changing the others.',relative:'times the text size'}
  };
  function textLanguage(){return String(document.documentElement.lang).startsWith('en')?'en':'es';}
  function textNumber(n){return String(n).replace('.',textLanguage()==='es'?',':'.');}
  function mountTextOptions(panel) {
    if(!panel||panel.querySelector('[data-ig-text-settings]')){syncTextOptions();return;}
    var d=document.createElement('details');d.className='ig-text-settings';d.setAttribute('data-ig-text-settings','');
    var summary=document.createElement('summary');summary.setAttribute('data-ig-text-label','title');d.appendChild(summary);
    var note=document.createElement('p');note.className='ig-text-note';note.setAttribute('data-ig-text-label','note');d.appendChild(note);
    var fields=[['font',['original','sans','wide','serif']],['letter',[null,0,.03,.045,.06,.09,.12,.16,.2]],['word',[null,0,.06,.12,.16,.24,.32,.4]],['line',[null,1.2,1.5,1.7,1.9,2,2.2,2.4]],['paragraph',[null,0,.5,1,1.5,2,2.5,3]],['width',['original','medium','narrow']]];
    fields.forEach(function(pair){
      var key=pair[0],label=document.createElement('label'),select=document.createElement('select'),span=document.createElement('span');
      select.id=(panel.id||'ig-reading')+'-text-'+key;select.dataset.igTextKey=key;span.setAttribute('data-ig-text-label',key);label.htmlFor=select.id;
      label.append(span,select);label.className='ig-text-field';
      pair[1].forEach(function(value){var opt=document.createElement('option');opt.value=value===null?'original':String(value);select.appendChild(opt);});
      select.addEventListener('change',function(){var patch={};patch[key]=TEXT_NUMBERS[key]?(select.value==='original'?null:Number(select.value)):select.value;update({text:patch});});
      d.appendChild(label);
    });
    var preview=document.createElement('div');preview.className='ig-text-preview';preview.setAttribute('data-ig-text-preview','');
    ['sample','sample2'].forEach(function(k){var p=document.createElement('p');p.setAttribute('data-ig-text-label',k);preview.appendChild(p);});d.appendChild(preview);
    var resetButton=document.createElement('button');resetButton.type='button';resetButton.className='ig-text-reset';resetButton.setAttribute('data-ig-text-label','reset');resetButton.setAttribute('data-ig-text-reset','');
    resetButton.addEventListener('click',function(){update({spacing:false,text:textDefaults()});});d.appendChild(resetButton);
    var before=panel.querySelector('.ctrls')||panel.children[1]||null;panel.insertBefore(d,before);syncTextOptions();
  }
  function syncTextOptions() {
    var t=effectiveText(),L=TEXT_LABELS[textLanguage()];
    document.querySelectorAll('[data-ig-text-settings]').forEach(function(d){
      d.querySelectorAll('[data-ig-text-label]').forEach(function(n){n.textContent=L[n.dataset.igTextLabel];});
      d.querySelectorAll('select[data-ig-text-key]').forEach(function(select){
        var k=select.dataset.igTextKey,value=t[k]===null?'original':String(t[k]);
        var all=Array.from(select.options);if(!all.some(function(o){return o.value===value;})){var o=document.createElement('option');o.value=value;select.appendChild(o);}
        Array.from(select.options).forEach(function(o){
          if(k==='font')o.textContent=L.fonts[['original','sans','wide','serif'].indexOf(o.value)];
          else if(k==='width')o.textContent=L.widths[['original','medium','narrow'].indexOf(o.value)];
          else o.textContent=o.value==='original'?L.original:textNumber(Number(o.value))+' ×';
        });
        if(select.value!==value)select.value=value;
      });
      var preview=d.querySelector('[data-ig-text-preview]');
      preview.style.fontFamily=TEXT_FONTS[t.font]||'"Atkinson Hyperlegible",system-ui,sans-serif';
      preview.style.letterSpacing=t.letter===null?'':t.letter+'em';preview.style.wordSpacing=t.word===null?'':t.word+'em';
      preview.style.lineHeight=t.line===null?'':String(t.line);
      preview.querySelectorAll('p').forEach(function(p){p.style.marginBlockEnd=t.paragraph===null?'':t.paragraph+'em';});
    });
  }
'''
CSS=r'''
/* Independent text settings: absent/original values preserve the brand styles.
   Font stacks use only fonts already available; no font files are distributed. */
.ig-text-settings{margin:10px 0 14px;min-width:0;max-width:100%;border:1px solid #dfe6ef;border-radius:14px;padding:10px;background:rgba(246,248,251,.65);font:16px/1.5 "Atkinson Hyperlegible",system-ui,sans-serif;color:#17395c}
.ig-text-settings>summary{min-height:44px;cursor:pointer;font-weight:700;white-space:normal;overflow-wrap:normal}
.ig-text-settings .ig-text-field{display:block;margin:14px 0;min-width:0;max-width:100%;font:inherit}
.ig-text-settings .ig-text-field>span{display:block;margin-bottom:6px}
.ig-text-settings select{display:block;box-sizing:border-box;width:100%;max-width:100%;min-width:0;min-height:44px;font:inherit;color:#17395c;background:#fff;border:1px solid #738396;border-radius:10px;padding:8px}
.ig-text-settings .ig-text-note{font-size:14px!important;line-height:1.5!important;margin:8px 0!important;color:inherit!important}
.ig-text-settings .ig-text-reset{min-height:44px;width:100%;white-space:normal;padding:10px;border:1px solid #738396;border-radius:12px;background:#fff;color:#17395c;font:inherit}
.ig-text-settings .ig-text-preview{margin:16px 0;border-block:1px solid #dfe6ef;padding:12px 0;overflow-wrap:anywhere;font-size:16px}
.ig-text-settings .ig-text-preview p{font:inherit;margin-top:0}
.ig-text-settings :is(select,summary,button):focus-visible{outline:3px solid #5a49a8;outline-offset:2px}
html[data-ig-text-font]:not([data-ig-text-font="original"]) main :is(h1,h2,h3,h4,p,li,dt,dd,td,th,span,button,a,label,summary,select,input,textarea,output){font-family:var(--ig-text-font)!important}
html[data-ig-text-letter="set"] main,html[data-ig-text-letter="set"] main :is(h1,h2,h3,h4,p,li,dt,dd,td,th,span,button,a,label,summary,select,input,textarea){letter-spacing:var(--ig-text-letter)!important}
html[data-ig-text-word="set"] main,html[data-ig-text-word="set"] main :is(h1,h2,h3,h4,p,li,dt,dd,td,th,span,button,a,label,summary,select,input,textarea){word-spacing:var(--ig-text-word)!important}
html[data-ig-text-line="set"] main :is(h1,h2,h3,h4,p,li,dt,dd,td,th,button,a,label,summary,select,input,textarea){line-height:var(--ig-text-line)!important}
html[data-ig-text-paragraph="set"] main p{margin-block-end:var(--ig-text-paragraph)!important}
html[data-ig-text-width]:not([data-ig-text-width="original"]) main :is(.ficha,p,ul,ol){max-inline-size:min(100%,var(--ig-text-width));box-sizing:border-box}
html[data-ig-text-width]:not([data-ig-text-width="original"]) main .ficha{margin-inline:auto}
html[data-ig-text-font]:not([data-ig-text-font="original"]) main :is(button,a,label,summary),html[data-ig-text-letter="set"] main :is(button,a,label,summary){white-space:normal;overflow-wrap:break-word}
@media(forced-colors:active){.ig-text-settings,.ig-text-preview{background:Canvas!important;color:CanvasText!important;border-color:CanvasText!important}.ig-text-settings select{background:Canvas!important;color:CanvasText!important}.ig-text-settings :focus-visible{outline-color:Highlight!important}}
'''
changes=[]
p=ROOT/'assets/preferencias-lectura.js';old=p.read_text();s=old
s=once(s,'  function defaults()',EXTRA+'\n  function defaults()')
s=once(s,'    return out;\n  }\n  function decode','    var text=normalizeText(value.text);if(customText(text))out.text=text;\n    return out;\n  }\n  function decode')
s=once(s,'  function copy() { return Object.assign({}, state); }','  function copy() { var c=Object.assign({},state);if(state.text)c.text=Object.assign({},state.text);return c; }')
s=once(s,'    root.dataset.igSystemColors = systemColors.matches ? \'forced\' : \'\';','    root.dataset.igSystemColors = systemColors.matches ? \'forced\' : \'\';\n    applyTextRoot(root);')
s=once(s,"    body.style.setProperty('--ls', state.spacing ? '.045em' : '0');\n    body.style.lineHeight = state.spacing ? '1.9' : '';\n    body.style.letterSpacing = state.spacing ? '.045em' : '';\n    body.style.wordSpacing = state.spacing ? '.12em' : '';","    body.style.setProperty('--ls', '0');\n    body.style.lineHeight = '';body.style.letterSpacing = '';body.style.wordSpacing = '';\n    // Text settings apply to main, not to navigation or floating panels.")
s=once(s,'    syncStatic();\n  }','    syncStatic();syncTextOptions();\n  }')
s=once(s,'    state = normalize(next); persist(); notify();','    mergeTextPatch(next,patch);\n    state = normalize(next); persist(); notify();')
s=once(s,'    speechOn:function(){return speech;}, connect:connect, changeComponent:changeComponent, apply:apply};','    speechOn:function(){return speech;}, connect:connect, changeComponent:changeComponent, apply:apply, mountTextOptions:mountTextOptions, getText:effectiveText};')
s=once(s,'  rootStyles();\n  if (document.readyState',"  new MutationObserver(syncTextOptions).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});\n  rootStyles();\n  if (document.readyState")
if s!=old:p.write_text(s);changes.append(str(p.relative_to(ROOT)))
p=ROOT/'assets/preferencias-lectura.css';old=p.read_text()
if CSS not in old:p.write_text(old+'\n'+CSS);changes.append(str(p.relative_to(ROOT)))
p=ROOT/'assets/interfaz-comun.js';old=p.read_text();s=once(old,'    if(active===p)return;','    if(window.IGPreferences&&window.IGPreferences.mountTextOptions)window.IGPreferences.mountTextOptions(p);\n    if(active===p)return;')
if s!=old:p.write_text(s);changes.append(str(p.relative_to(ROOT)))
# Instructions describe only the added functions, not planned voice/themes.
p=ROOT/'es/lectura-accesible/index.html';s=p.read_text();marker='<!-- ig-independent-text-help -->'
if marker not in s:
    at=s.index('</main>')
    block='''<!-- ig-independent-text-help -->
<section class="sec"><h2>Tipografía, espaciado y anchura</h2><p>Abre Lectura y despliega «Tipografía, espaciado y anchura». Puedes elegir la letra original o alternativas de tipo Arial, Verdana o Georgia, según las fuentes disponibles en tu dispositivo. No se descarga una tipografía nueva ni se promete que una letra sea mejor para todas las personas.</p><p>La separación entre letras, palabras, líneas y párrafos tiene cuatro controles independientes. Los valores con × indican una proporción del tamaño de la letra. «Original» recupera la presentación habitual de ese ajuste; no modifica los demás. El botón de espaciado rápido sigue ofreciendo una combinación y sustituye las cuatro separaciones personalizadas cuando lo utilizas.</p><p>La anchura Media o Estrecha limita las líneas de texto sin reducir el tamaño elegido. «Restablecer estos ajustes» recupera tipografía, separaciones y anchura originales; conserva el tamaño, el contraste y las demás preferencias. «Restablecer», fuera de ese bloque, continúa reiniciando todas las preferencias propias de la web.</p><p>Las elecciones se conservan en el mismo navegador cuando permite guardarlas. La muestra del panel permite comparar la letra y los espacios. Cabecera, paneles e ilustraciones mantienen su presentación; las fichas y tableros siguen necesitando sus comprobaciones de uso. Estos ajustes no son una certificación de accesibilidad ni una sustitución de tecnologías de apoyo.</p></section>
'''
    p.write_text(s[:at]+block+s[at:]);changes.append(str(p.relative_to(ROOT)))
report={'changed_files':changes,'settings':['font','letter','word','line','paragraph','width'],'storage':'ig-a11y v2, optional text object','default_presentation_unchanged':True,'fonts':'Existing device fonts only; no font download','published':False}
(OUT/'implementation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
