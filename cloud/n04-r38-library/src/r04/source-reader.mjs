import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

export function sha256Text(value) {
  return createHash('sha256').update(String(value)).digest('hex');
}

export function gitShow(sourceSha, path) {
  if (!/^[a-f0-9]{40}$/.test(sourceSha || '')) throw new Error('invalid_source_sha');
  if (!path || path.includes('..') || path.startsWith('/')) throw new Error('invalid_source_path');
  return execFileSync('git', ['show', sourceSha + ':' + path], {
    cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024
  });
}

export function normalizeRoute(input) {
  let value = String(input || '').trim();
  if (/^https:\/\//i.test(value)) value = new URL(value).pathname + (new URL(value).hash || '');
  while (value.startsWith('../')) value = value.slice(3);
  if (!value.startsWith('/')) value = '/' + value;
  value = value.replace(/\/+/g, '/');
  return value;
}

export function routeToRepoPath(route) {
  const clean = normalizeRoute(route).split('#')[0].split('?')[0];
  const path = clean.replace(/^\//, '');
  return path.endsWith('/') ? path + 'index.html' : path;
}

function decodeEntityToken(token) {
  const key = token.toLowerCase();
  const named = { amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' ', ndash:'–', mdash:'—', hellip:'…' };
  if (named[key] !== undefined) return named[key];
  if (key.startsWith('#x')) {
    const n = Number.parseInt(key.slice(2), 16);
    return Number.isFinite(n) ? String.fromCodePoint(n) : '&' + token + ';';
  }
  if (key.startsWith('#')) {
    const n = Number.parseInt(key.slice(1), 10);
    return Number.isFinite(n) ? String.fromCodePoint(n) : '&' + token + ';';
  }
  return '&' + token + ';';
}

export function cleanHtmlText(html) {
  return String(html || '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&([^;]+);/g, (_, token) => decodeEntityToken(token))
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractMainHtml(html) {
  const source = String(html || '');
  const main = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const article = source.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  return main?.[1] || article?.[1] || '';
}

export function extractCanonicalUrl(html) {
  const match = String(html || '').match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || String(html || '').match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  return match?.[1] || null;
}

export function extractReviewedAt(html) {
  const source = String(html || '');
  const meta = source.match(/<meta\b[^>]*(?:property|name)=["']article:modified_time["'][^>]*content=["']([^"']+)["'][^>]*>/i)
    || source.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']article:modified_time["'][^>]*>/i);
  if (meta?.[1]) return meta[1];
  const text = cleanHtmlText(extractMainHtml(source));
  const m = text.match(/(?:Revisión editorial|Validación):\s*([^.;]+)/i);
  return m?.[1]?.trim() || null;
}

function externalSources(fragment) {
  const out = [];
  const seen = new Set();
  const re = /<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(fragment))) {
    const url = m[1];
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ url, label: cleanHtmlText(m[2]) });
  }
  return out;
}

function blockTexts(fragment) {
  const blocks = [];
  const re = /<(p|li|tr)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(fragment))) {
    const text = cleanHtmlText(m[2]);
    if (!text || /^(Inicio|Home)\s*›/i.test(text)) continue;
    blocks.push(text);
  }
  return blocks;
}

export function extractEditorialPage(html) {
  const main = extractMainHtml(html);
  if (!main) throw new Error('missing_main');
  const h1 = main.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const title = cleanHtmlText(h1?.[1] || '');
  const sections = [];
  const sectionRe = /<section\b[^>]*>([\s\S]*?)<\/section>/gi;
  let m;
  while ((m = sectionRe.exec(main))) {
    const fragment = m[1];
    const h = fragment.match(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/i);
    const heading = cleanHtmlText(h?.[1] || '');
    const blocks = blockTexts(fragment).filter(text => text !== title);
    if (blocks.length) sections.push({ heading, blocks });
  }
  if (!sections.length) {
    const blocks = blockTexts(main).filter(text => text !== title);
    if (blocks.length) sections.push({ heading:'', blocks });
  }
  const sourceMap = new Map();
  for (const source of externalSources(main)) sourceMap.set(source.url, source);
  return {
    title,
    canonical_url: extractCanonicalUrl(html),
    reviewed_at: extractReviewedAt(html),
    sections,
    sources: [...sourceMap.values()]
  };
}

export function technicalField(page, labels) {
  const wanted = new Set(labels.map(v => v.toLowerCase()));
  for (const section of page.sections) {
    for (const block of section.blocks) {
      const idx = block.indexOf(':');
      if (idx < 0) continue;
      const label = block.slice(0, idx).trim().toLowerCase();
      if (wanted.has(label)) return block.slice(idx + 1).trim();
    }
  }
  return null;
}
