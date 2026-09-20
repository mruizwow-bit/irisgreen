#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

function parseArgs(argv) {
  const out = { reference: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) throw new Error(`Unexpected argument: ${a}`);
    const k = a.slice(2);
    const v = argv[++i];
    if (!v || v.startsWith('--')) throw new Error(`Missing value for --${k}`);
    if (k === 'reference') out.reference.push(v); else out[k] = v;
  }
  return out;
}

const args = parseArgs(process.argv);
if (!args.candidate) throw new Error('Missing --candidate');

const STOP = new Set('a al algo algunas algunos ante antes como con contra cual cuando de del desde donde dos el ella ellas ellos en entre era es esa ese eso esta este esto fue ha hasta hay la las le les lo los mas me mi mis muy no nos o para pero por porque que se si sin sobre su sus te tu tus un una uno unas unos y ya yo'.split(' '));
function normalize(s) {
  return String(s ?? '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .replace(/\s+/g, ' ').trim();
}
function stem(t) {
  for (const suf of ['amientos','imientos','aciones','mente','amiento','imiento','acion','ando','iendo','adas','ados','idos','ida','ido','ada','ado','ar','er','ir','es','s']) {
    if (t.length > suf.length + 3 && t.endsWith(suf)) return t.slice(0, -suf.length);
  }
  return t;
}
function contentTokens(s) { return normalize(s).split(' ').filter(t => t && !STOP.has(t)).map(stem); }
function ngrams(s, n) {
  const x = ` ${normalize(s)} `;
  const set = new Set();
  for (let i = 0; i <= x.length - n; i++) set.add(x.slice(i, i + n));
  return set;
}
function tokenBigrams(s) {
  const t = normalize(s).split(' ').filter(Boolean); const set = new Set();
  for (let i = 0; i < t.length - 1; i++) set.add(`${t[i]} ${t[i+1]}`);
  return set;
}
function jaccard(a,b) {
  if (!a.size && !b.size) return 1;
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
}
function dice(a,b) {
  if (!a.size && !b.size) return 1;
  let inter = 0; for (const x of a) if (b.has(x)) inter++;
  return 2 * inter / (a.size + b.size || 1);
}
function levenshteinRatio(a,b) {
  a = normalize(a); b = normalize(b);
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;
  const prev = Array.from({length:b.length+1},(_,i)=>i), cur = new Array(b.length+1);
  for (let i=1;i<=a.length;i++) {
    cur[0]=i;
    for (let j=1;j<=b.length;j++) cur[j]=Math.min(cur[j-1]+1, prev[j]+1, prev[j-1]+(a[i-1]===b[j-1]?0:1));
    for (let j=0;j<=b.length;j++) prev[j]=cur[j];
  }
  const d=prev[b.length];
  return 1 - d / Math.max(a.length,b.length);
}
function similarityRule(a,b) {
  const na=normalize(a), nb=normalize(b);
  if (!na || !nb) return null;
  if (na===nb) return 'exact_normalized';
  const shorter=na.length<=nb.length?na:nb, longer=na.length<=nb.length?nb:na;
  if (shorter.length>=18 && longer.includes(shorter) && shorter.length/longer.length>=0.72) return 'high_containment';
  const charDice=dice(ngrams(a,4),ngrams(b,4));
  const edit=levenshteinRatio(a,b);
  if (edit>=0.84) return 'edit_similarity';
  if (charDice>=0.76 && edit>=0.68) return 'char_ngram_similarity';
  const bi=jaccard(tokenBigrams(a),tokenBigrams(b));
  if (bi>=0.60 && Math.min(na.split(' ').length,nb.split(' ').length)>=4) return 'token_bigram_similarity';
  const ca=new Set(contentTokens(a)), cb=new Set(contentTokens(b));
  const cj=jaccard(ca,cb);
  if (cj>=0.82 && Math.min(ca.size,cb.size)>=3) return 'content_token_similarity';
  return null;
}
function parseJsonlText(text, sourceLabel) {
  const rows=[];
  const lines=text.split(/\r?\n/).filter(Boolean);
  for (let i=0;i<lines.length;i++) {
    let row;
    try { row=JSON.parse(lines[i]); } catch { throw new Error(`Invalid JSONL in ${sourceLabel} at line ${i+1}`); }
    if (typeof row.utterance !== 'string') continue;
    rows.push({utterance:row.utterance});
  }
  return rows;
}
function loadFile(path,label) { return parseJsonlText(fs.readFileSync(path,'utf8'),label); }

const candidateRaw=fs.readFileSync(args.candidate,'utf8');
const candidateLines=candidateRaw.split(/\r?\n/).filter(Boolean);
const candidates=candidateLines.map((line,i)=>{
  let row; try { row=JSON.parse(line); } catch { throw new Error(`Invalid candidate JSON at line ${i+1}`); }
  if (!row.id || typeof row.utterance!=='string') throw new Error(`Candidate line ${i+1} lacks id/utterance`);
  return {id:row.id,utterance:row.utterance};
});

const refs=[];
for (const spec of args.reference || []) {
  const pos=spec.indexOf(':');
  if (pos<1) throw new Error(`Bad --reference ${spec}; expected label:path`);
  const label=spec.slice(0,pos), path=spec.slice(pos+1);
  refs.push({label, reserved:false, rows:loadFile(path,label)});
}

let reservedChecked=false;
if (args['reserved-git-ref']) {
  const ref=args['reserved-git-ref'];
  const names=execFileSync('git',['ls-tree','-r','--name-only',ref],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean);
  const paths=names.filter(p=>/tests\/validation\/sabik\/i0\/.*\.jsonl$/i.test(p));
  if (!paths.length) {
    const report={pass:false,error:'reserved_validation_not_found',candidate_count:candidates.length,reserved_validation_checked:false,conflicts:[]};
    if (args.report) fs.writeFileSync(args.report,JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify({pass:false,error:'reserved_validation_not_found'}));
    process.exit(2);
  }
  const rows=[];
  for (const p of paths) {
    const text=execFileSync('git',['show',`${ref}:${p}`],{encoding:'utf8',maxBuffer:64*1024*1024});
    rows.push(...parseJsonlText(text,'reserved_validation'));
  }
  refs.push({label:'reserved_validation',reserved:true,rows});
  reservedChecked=true;
}

const conflicts=[];
// Candidate internal near-duplicate control.
for (let i=0;i<candidates.length;i++) for (let j=i+1;j<candidates.length;j++) {
  const rule=similarityRule(candidates[i].utterance,candidates[j].utterance);
  if (rule) conflicts.push({candidate_id:candidates[i].id,against:'candidate_internal',other_candidate_id:candidates[j].id,rule});
}
// Reference checks. Never emit reference text, id, label, path, score, or line number.
for (const c of candidates) {
  for (const ref of refs) {
    let found=null;
    for (const r of ref.rows) {
      const rule=similarityRule(c.utterance,r.utterance);
      if (rule) { found=rule; break; }
    }
    if (found) conflicts.push({candidate_id:c.id,against:ref.reserved?'reserved_validation':ref.label,rule:found});
  }
}

const checked={};
for (const r of refs) checked[r.label]=r.reserved?{checked:true}:{checked:true,case_count:r.rows.length};
const report={
  checker:'sabik-i0-blind-lexical-independence-v1',
  candidate_count:candidates.length,
  checked,
  reserved_validation_checked:reservedChecked,
  policy:{
    output_redaction:'reference utterances, labels, ids, paths, lines and scores are never emitted',
    exact_normalized:true,
    high_containment:true,
    edit_similarity_threshold:0.84,
    char_4gram_dice_threshold:0.76,
    token_bigram_jaccard_threshold:0.60,
    content_token_jaccard_threshold:0.82
  },
  conflict_count:conflicts.length,
  conflicts,
  pass:conflicts.length===0
};
if (args.report) fs.writeFileSync(args.report,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({pass:report.pass,candidate_count:report.candidate_count,conflict_count:report.conflict_count,reserved_validation_checked:report.reserved_validation_checked,conflict_candidate_ids:[...new Set(conflicts.map(x=>x.candidate_id))]}));
if (!report.pass) process.exit(1);
