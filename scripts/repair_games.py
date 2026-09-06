#!/usr/bin/env python3
"""Repair the observed game controls without rewriting the collections or STR text.
The report fingerprints source dictionaries and the 130-game catalogue.
"""
import hashlib,json,re
from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path.cwd();G=ROOT/'es/recursos/juegos';report={'changed':[],'preserved_dictionaries':{},'notes':[]}

def once(s,old,new):
    if new in s:return s
    assert s.count(old)==1,(old[:100],s.count(old))
    return s.replace(old,new,1)

def block_end(s,start,tag):
    depth=0
    for m in re.finditer(r'</?'+tag+r'\b[^>]*>',s[start:]):
        depth+=-1 if m[0].startswith('</') else 1
        if depth==0:return start+m.end()
    raise ValueError('Unclosed '+tag)

def dictionary(s):
    m=re.search(r'<script[^>]*data-dc-script[^>]*>(.*?)class Component extends DCLogic',s,re.S)
    return hashlib.sha256(m[1].encode()).hexdigest() if m else None

catalog=G/'juegos-120.json';catalog_hash=hashlib.sha256(catalog.read_bytes()).hexdigest()
for p in [G/'index.html',*sorted(G.glob('*/index.html'))]:
    original=p.read_text();s=original
    if '<x-dc' not in s:continue
    before=dictionary(s)
    s=once(s,'<body>','<body class="ig-game-page">')
    css='<link rel="stylesheet" href="/assets/juegos-ajustes.css"/>'
    if css not in s:s=s.replace('</head>',css+'\n</head>',1)
    # Two fixed-width master/detail grids previously overflowed narrow phones.
    s=re.sub(r'<section(?![^>]*class=)(?=[^>]*grid-template-columns:\s*minmax\(260px,\s*\d+px\)\s*1fr)', '<section class="ig-game-split"',s)
    if p.parent.name=='donde-se-fue-la-energia':
        if 'class="ig-energy-days"' not in s:
            start=s.index('<sc-for list="{{ days }}"');end=block_end(s,start,'sc-for')
            s=s[:start]+'<div class="ig-energy-days">'+s[start:end]+'</div>'+s[end:]
        s=once(s,'<button sc-camel-on-click="{{ d.click }}"','<button class="ig-energy-day" sc-camel-on-click="{{ d.click }}"')
    if p.parent.name=='la-cena-de-los-planes':
        # A need can belong to several people. It must not be stolen from somebody
        # else; otherwise 3 or 4 players cannot each choose three of eight cards.
        a=s.index('  ownerOf(card) {');b=s.index('  applyReading(s)',a)
        replacement='''  ownerOf(card) {
    return Object.keys(this.state.picks).filter((key) => this.state.picks[key].indexOf(card) !== -1).map(Number);
  }

  tapCard(card) {
    const st = this.state;
    const picks = Object.assign({}, st.picks);
    const mine = (picks[st.who] || []).slice();
    const at = mine.indexOf(card);
    if (at >= 0) mine.splice(at, 1);
    else if (mine.length < 3) mine.push(card);
    picks[st.who] = mine;
    this.setState({ picks });
  }

'''
        s=s[:a]+replacement+s[b:]
        s=once(s,'const isMine = owner === st.who;','const isMine = owner.indexOf(st.who) !== -1;')
        s=s.replace('owner !== -1','owner.length > 0').replace('nameOf(owner)','owner.map(nameOf).join(", ")')
        s=once(s,'done: filled >= 2,','done: filled === Object.keys(st.picks).length,')
        s=once(s,'      addPerson: () => {','      addPersonDisabled: Object.keys(st.picks).length >= 4,\n      addPerson: () => {')
        s=once(s,'<button sc-camel-on-click="{{ addPerson }}"','<button disabled="{{ addPersonDisabled }}" sc-camel-on-click="{{ addPerson }}"')
    if p==G/'index.html':
        start=s.index('<sc-if value="{{ cardOpen }}"');end=block_end(s,start,'sc-if');part=s[start:end]
        part=once(part,'<div style="position: fixed; inset: 0; z-index: 80;','<div id="ig-game-letter" role="dialog" aria-modal="true" aria-labelledby="ig-game-letter-title" style="position: fixed; inset: 0; z-index: 1000;')
        part=once(part,'<h3 style=','<h3 id="ig-game-letter-title" tabindex="-1" style=')
        part=once(part,'<button sc-camel-on-click="{{ closeCard }}"','<button id="ig-game-letter-close" sc-camel-on-click="{{ closeCard }}"')
        s=s[:start]+part+s[end:]
        s=once(s,'    setTimeout(() => this.swapImages(), 0);','''    setTimeout(() => this.swapImages(), 0);
    this._cardHashListener = () => this.openCardFromHash();
    window.addEventListener("hashchange", this._cardHashListener);
    this.syncCardDialog();''')
        s=once(s,'  componentDidUpdate() {\n    this.swapImages();','  componentDidUpdate() {\n    this.swapImages();\n    this.syncCardDialog();')
        methods='''  openCardFromHash() {
    const slug = (window.location.hash || "").replace(/^#carta-/, "");
    const T = STR[this.state.lang] || STR.es;
    const card = T.games.findIndex((g) => {
      const item = PLAY[g[2]];
      return item && item[0].split("/").filter(Boolean).pop() === slug;
    });
    if (card >= 0) this.setState({ card });
  }

  releaseCardDialog() {
    if (!this._cardDialog) return;
    document.removeEventListener("keydown", this._cardKeydown, true);
    (this._cardInert || []).forEach(([el, original]) => { el.inert = original; });
    document.documentElement.style.overflow = this._cardOverflow;
    const back = this._cardReturn;
    this._cardDialog = null;
    this._cardInert = [];
    if (back && back.isConnected && typeof back.focus === "function") back.focus({ preventScroll: true });
  }

  syncCardDialog() {
    const dialog = document.getElementById("ig-game-letter");
    if (!dialog) { this.releaseCardDialog(); return; }
    if (this._cardDialog === dialog) return;
    this.releaseCardDialog();
    this._cardDialog = dialog;
    this._cardReturn = document.activeElement;
    this._cardOverflow = document.documentElement.style.overflow;
    this._cardInert = [];
    let branch = dialog;
    while (branch.parentElement) {
      Array.from(branch.parentElement.children).forEach((el) => {
        if (el !== branch && !["SCRIPT", "STYLE", "LINK"].includes(el.tagName)) {
          this._cardInert.push([el, el.inert]); el.inert = true;
        }
      });
      branch = branch.parentElement;
      if (branch === document.body) break;
    }
    document.documentElement.style.overflow = "hidden";
    this._cardKeydown = (event) => {
      if (!dialog.isConnected) return;
      if (event.key === "Escape") {
        event.preventDefault(); event.stopImmediatePropagation(); this.setState({ card: null }); return;
      }
      if (event.key !== "Tab") return;
      const all = Array.from(dialog.querySelectorAll('button:not([disabled]),textarea,input,a[href],[tabindex="0"]')).filter((el) => el.getClientRects().length);
      const first = all[0], last = all[all.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.querySelector('h3'))) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", this._cardKeydown, true);
    dialog.querySelector('h3').focus({ preventScroll: true });
  }

  componentWillUnmount() {
    clearTimeout(this._titleT);
    window.removeEventListener("hashchange", this._cardHashListener);
    this.releaseCardDialog();
  }

'''
        if '  openCardFromHash() {' not in s:s=once(s,'  setLang(lang) {',methods+'  setLang(lang) {')
        # Canvas wrapping must preserve long words and every entered character.
        a=s.index('    x.fillStyle = "#a8336f";',s.index('  paintCard('));b=s.index('    x.fillStyle = "#5a6675";',a)
        draw='''    const wrap = (value, width) => {
      const lines = [];
      String(value).split("\\n").forEach((paragraph) => {
        let line = "";
        for (const char of paragraph) {
          if (line && x.measureText(line + char).width > width) { lines.push(line); line = ""; }
          line += char;
        }
        lines.push(line);
      });
      return lines;
    };
    x.fillStyle = "#a8336f";
    x.font = "700 22px 'Atkinson Hyperlegible', sans-serif";
    x.fillText(T.cardTitle.toUpperCase(), 74, 352);
    const title = T.games[idx][2];
    x.font = "400 42px 'Newsreader', serif";
    const titleLines = wrap(title, W - 148);
    let ty = 412;
    x.fillStyle = "#17395c";
    titleLines.forEach((line) => { x.fillText(line, 74, ty); ty += 50; });
    let textSize = 24, planned;
    do {
      x.font = "400 " + textSize + "px 'Atkinson Hyperlegible', sans-serif";
      planned = labels.map((label, n) => ({ label, lines: wrap(filled ? (this.state.cardVals[idx + "-" + n] || "") : "", W - 160) }));
      const needed = ty + 24 + planned.reduce((sum, field) => sum + 26 + Math.max(2, field.lines.length) * 36 + 26, 0);
      if (needed <= H - 110 || textSize <= 18) break;
      textSize -= 1;
    } while (true);
    let y = ty + 24;
    planned.forEach((field) => {
      x.fillStyle = "#5a49a8";
      x.font = "700 21px 'Atkinson Hyperlegible', sans-serif";
      x.fillText(field.label, 74, y); y += 26;
      const rows = Math.max(2, field.lines.length);
      x.strokeStyle = "rgba(23,57,92,0.18)"; x.lineWidth = 1.5;
      x.font = "400 " + textSize + "px 'Atkinson Hyperlegible', sans-serif";
      for (let row = 0; row < rows; row++) {
        y += 36;
        x.beginPath(); x.moveTo(74,y); x.lineTo(W-74,y); x.stroke();
        x.fillStyle = "#17395c";
        if (field.lines[row]) x.fillText(field.lines[row],80,y-8);
      }
      y += 26;
    });
'''
        s=s[:a]+draw+s[b:]
    assert dictionary(s)==before,'Editorial dictionary changed: '+str(p)
    report['preserved_dictionaries'][str(p.relative_to(ROOT))]=before
    if s!=original:p.write_text(s);report['changed'].append(str(p.relative_to(ROOT)))
# Actual catalogue count, not a hand-maintained list or a stale written number.
p=G/'coleccion/index.html';s=p.read_text();data=json.loads(catalog.read_text())
s=once(s,'<h1>Ciento veinte juegos, trece bloques</h1>',f'<h1>{len(data["juegos"])} juegos, {len(data["porCondicion"])} bloques</h1>');p.write_text(s)
assert hashlib.sha256(catalog.read_bytes()).hexdigest()==catalog_hash
report['catalogue_sha256']=catalog_hash
# Refine the test: independent direct entry for each letter, plus hash-change and
# keyboard tests. The earlier download checks reused the first open dialog.
p=ROOT/'scripts/test_games.py';s=p.read_text()
s=once(s,"page.goto(BASE+PREFIX+'#carta-'+slug,wait_until='domcontentloaded')","page.goto('about:blank')\n                page.goto(BASE+PREFIX+'#carta-'+slug,wait_until='domcontentloaded')")
s=once(s,"row['fields']=fields.count()","row['fields']=fields.count()\n                row['title']=page.locator('#ig-game-letter-title').inner_text()\n                assert page.locator('#ig-game-letter').evaluate('(e)=>e.contains(document.activeElement)')\n                for _ in range(fields.count()+5):\n                    page.keyboard.press('Tab')\n                    assert page.locator('#ig-game-letter').evaluate('(e)=>e.contains(document.activeElement)')")
s=once(s,"page.keyboard.press('Escape');row['escape_closes']=not fields.count()","page.keyboard.press('Escape');row['escape_closes']=not fields.count()\n                assert row['escape_closes'],'Escape must close the letter'\n                assert not page.locator('main').evaluate('(e)=>e.inert'),'Background left inert'")
# Four people must each be able to select the same three needs.
s=once(s,"for who in range(2):\n            click(page,'p.pick','people',n=who)","click(page,'addPerson');click(page,'addPerson')\n        assert actions(page,'addPerson').is_disabled()\n        for who in range(4):\n            click(page,'p.pick','people',n=who)")
s=once(s,"for n in range(3):click(page,'c.pick','cards',n=who*3+n)","for n in range(3):click(page,'c.pick','cards',n=n)\n            if who<3:assert not page.locator('main a[href*=\"#carta-\"]:visible').count()")
p.write_text(s)
report['notes']=['Catalogue content and the language dictionaries are byte-preserved.','The energy-day controls form a wrapping grid below the same illustration on small screens.','Family selections now belong to each person independently; three choices per person are preserved.','The letter dialog closes with Escape, contains keyboard focus and restores the background.','The first download test had not distinguished successive hash-only navigations; the final test now loads each letter independently.']
(ROOT/'reports/games').mkdir(parents=True,exist_ok=True)
(ROOT/'reports/games/repairs.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
