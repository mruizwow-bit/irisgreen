#!/usr/bin/env python3
from pathlib import Path
import json,re

ROOT=Path.cwd()
SRC=ROOT/'es/investigacion/estudios-textos.json'
PAGE=ROOT/'es/investigacion/index.html'
TDIR=ROOT/'editorial/translations'

base=json.loads(SRC.read_text(encoding='utf-8'))
trans=[]
for p in sorted(TDIR.glob('investigacion-en-*.json')):
    trans.extend(json.loads(p.read_text(encoding='utf-8')))
by_n={int(x['n']):x for x in trans}
nums=sorted(by_n)
if nums != list(range(1,121)):
    missing=sorted(set(range(1,121))-set(nums));dup=len(trans)-len(by_n)
    raise SystemExit(f'Translation coverage invalid: missing={missing}, duplicates={dup}')
if len(base)!=120 or [int(x['n']) for x in base] != list(range(1,121)):
    raise SystemExit('Spanish research catalogue is not the expected 1..120 sequence')

for row in base:
    t=by_n[int(row['n'])]
    row['heading_en']=t['heading']
    row['design_en']=t['design']
    row['sample_en']=t['sample']
    row['authors_en']=t.get('authors','') or row.get('authors_en','') or row.get('authors','')
    row['text_en']=t['text']
    row['notProven_en']=t['notProven']
    row['topic_en']=t['topic']
    row['topicRaw_en']=t['topicRaw']
    row['linea_en']=t['linea']
    # Preserve DOI, year, designKey, confidence and all Spanish editorial fields exactly.

SRC.write_text(json.dumps(base,ensure_ascii=False,indent=1)+'\n',encoding='utf-8')

s=PAGE.read_text(encoding='utf-8')
# The deploy step will refresh the embedded initial data from the JSON. Here we only
# make the renderer select the already-reviewed English fields.
old='''      cards: rows.map((s) => {
        const c = CONF[s.conf] || CONF.media;
        const nSample = (L === "en" ? s.sample_en : L === "pt" ? s.sample_pt : s.sample) || "";
        return {
          heading: L === "es" ? s.heading : s.titleOrig,
          titleEs: L === "es" ? s.titleEs : T.spanishTitle + s.titleEs,
          titleOrig: s.titleOrig,
          authors: (L === "en" ? s.authors_en : L === "pt" ? s.authors_pt : s.authors) || s.authors,
          year: s.year, authorLine: ((L === "en" ? s.authors_en : L === "pt" ? s.authors_pt : s.authors) || s.authors) + (s.year ? " · " + s.year : ""),
          topic: TOPIC_LABELS[L][s.topic] || s.topic,'''
new='''      cards: rows.map((s) => {
        const c = CONF[s.conf] || CONF.media;
        const nSample = (L === "en" ? s.sample_en : L === "pt" ? s.sample_pt : s.sample) || "";
        const author = (L === "en" ? s.authors_en : L === "pt" ? s.authors_pt : s.authors) || s.authors || "";
        const heading = L === "en" ? (s.heading_en || s.titleOrig || s.heading) : (L === "pt" ? (s.titleOrig || s.heading) : s.heading);
        const originalTitle = s.titleOrig || (L === "en" ? s.heading_en : s.heading) || s.titleEs || "";
        return {
          heading,
          titleEs: L === "en" && s.titleEs && s.titleEs !== heading ? T.spanishTitle + s.titleEs : (L === "es" ? s.titleEs : ""),
          titleOrig: originalTitle,
          authors: author,
          year: s.year, authorLine: author + (s.year ? " · " + s.year : ""),
          topic: L === "en" ? (s.topic_en || TOPIC_LABELS.en[s.topic] || s.topic) : (TOPIC_LABELS[L][s.topic] || s.topic),'''
if old not in s:
    raise SystemExit('Research cards renderer block not found')
s=s.replace(old,new,1)
old2='''          design: T.designs[s.designKey] || s.design,
          nLabel: nSample,
          hasSample: !!nSample,
          confLabel: T.confs[s.conf], confColor: c[0], confBg: c[1],
          paragraphs: (s.text || []).map((p, i) => ({ key: "p" + i, text: p })),
          means: s.means, notProven: s.notProven,
          reference: ((L === "en" ? s.authors_en : L === "pt" ? s.authors_pt : s.authors) || s.authors) + (s.year ? " (" + s.year + ")" : "") + ". " + s.titleOrig + ". " + (T.designs[s.designKey] || s.design) + (nSample ? ", " + nSample : "") + ". " + (s.doi || "")
        };'''
new2='''          design: L === "en" ? (s.design_en || T.designs[s.designKey] || s.design) : (T.designs[s.designKey] || s.design),
          nLabel: nSample,
          hasSample: !!nSample,
          confLabel: T.confs[s.conf], confColor: c[0], confBg: c[1],
          paragraphs: ((L === "en" ? s.text_en : s.text) || []).map((p, i) => ({ key: "p" + i, text: p })),
          means: s.means, notProven: L === "en" ? (s.notProven_en || s.notProven) : s.notProven,
          reference: author + (s.year ? " (" + s.year + ")" : "") + ". " + originalTitle + ". " + (L === "en" ? (s.design_en || T.designs[s.designKey] || s.design) : (T.designs[s.designKey] || s.design)) + (nSample ? ", " + nSample : "") + ". " + (s.doi || "")
        };'''
if old2 not in s:
    raise SystemExit('Research text renderer block not found')
s=s.replace(old2,new2,1)

# Search/filter must use the text that is actually visible in the selected language.
old3='''      const hay = this.norm([s.heading, s.titleOrig, s.titleEs, s.authors, s.topic, s.text.join(" "), s.notProven].join(" "));'''
new3='''      const hay = this.norm(L === "en" ? [s.heading_en || s.heading, s.titleOrig, s.authors_en || s.authors, s.topic_en || s.topic, (s.text_en || []).join(" "), s.notProven_en || ""].join(" ") : [s.heading, s.titleOrig, s.titleEs, s.authors, s.topic, (s.text || []).join(" "), s.notProven].join(" "));'''
if old3 in s:
    s=s.replace(old3,new3,1)
else:
    print('WARN search hay block not found; runtime test will verify search separately')

PAGE.write_text(s,encoding='utf-8')
print(json.dumps({'translations':len(trans),'catalogue':len(base),'english_fields':all('text_en' in x and 'heading_en' in x for x in base)},ensure_ascii=False))
