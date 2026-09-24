import test from 'node:test';
import assert from 'node:assert/strict';
import { groupSources } from '../src/source-groups.mjs';

const c = (id, url, score, version='n04-es-20260916-56f72c4d3959', extra={}) => Object.freeze({
  library_version: version,
  fragment_id: id,
  snippet: extra.snippet ?? `Texto original ${id}`,
  title: extra.title ?? `Título ${url}`,
  heading: extra.heading ?? `Sección ${id}`,
  url,
  source_type: extra.source_type ?? 'section',
  concepts: Object.freeze([...(extra.concepts ?? ['apoyos'])]),
  score,
});

const flattenIds = groups => groups.flatMap(group => group.citations.map(x => x.fragment_id));

test('groups by exact URL and keeps first source appearance plus candidate order', () => {
  const a='https://irisgreen.eu/es/biblioteca/a';
  const b='https://irisgreen.eu/es/biblioteca/b';
  const input=Object.freeze([c('a.meta',a,111),c('a.sec1',a,110),c('b.meta',b,109),c('a.sec2',a,108)]);
  const out=groupSources(input);
  assert.deepEqual(out.map(x=>x.url),[a,b]);
  assert.deepEqual(out[0].citations.map(x=>x.fragment_id),['a.meta','a.sec1','a.sec2']);
  assert.deepEqual(out[1].citations.map(x=>x.fragment_id),['b.meta']);
  assert.deepEqual(flattenIds(out),['a.meta','a.sec1','a.sec2','b.meta']);
});

test('does not collapse distinct exact URL strings', () => {
  const input=[
    c('x1','https://irisgreen.eu/es/investigacion',100),
    c('x2','https://irisgreen.eu/es/investigacion/',99),
  ];
  const out=groupSources(input);
  assert.equal(out.length,2);
  assert.deepEqual(out.map(x=>x.url),input.map(x=>x.url));
});

test('preserves every fragment id, original snippet, version and score without reranking', () => {
  const url='https://irisgreen.eu/es/biblioteca/sobrecarga';
  const input=[
    c('meta',url,222,'v1',{snippet:'Meta original'}),
    c('sec1',url,222,'v1',{snippet:'Sección uno'}),
    c('sec7',url,216,'v2',{snippet:'Sección siete'}),
  ];
  const [group]=groupSources(input);
  assert.deepEqual(group.citations.map(({fragment_id,snippet,library_version,score})=>({fragment_id,snippet,library_version,score})),[
    {fragment_id:'meta',snippet:'Meta original',library_version:'v1',score:222},
    {fragment_id:'sec1',snippet:'Sección uno',library_version:'v1',score:222},
    {fragment_id:'sec7',snippet:'Sección siete',library_version:'v2',score:216},
  ]);
});

test('caller input remains byte-structurally unchanged and grouped output is immutable', () => {
  const input=[c('adult.meta','https://irisgreen.eu/es/vida-trabajo',105,'v1',{concepts:['trabajo','apoyos']})];
  const before=JSON.stringify(input);
  const out=groupSources(input);
  assert.equal(JSON.stringify(input),before);
  assert.throws(()=>out.push({}));
  assert.throws(()=>out[0].citations.push({}));
  assert.throws(()=>out[0].citations[0].concepts.push('mutado'));
});

test('synthetic adolescent daily-life fixture remains a presentation grouping, not a diagnosis', () => {
  const school='https://irisgreen.eu/es/biblioteca/colegio-e-instituto-apoyos';
  const routine='https://irisgreen.eu/es/recursos/rutinas';
  const candidates=[c('school.meta',school,108),c('school.sec1',school,107),c('routine.meta',routine,103)];
  const out=groupSources(candidates);
  assert.deepEqual(out.map(x=>x.url),[school,routine]);
  assert.equal(out[0].citations.length,2);
  assert.equal(out[1].citations.length,1);
});

test('synthetic adult daily-life fixture keeps multiple fragments from one page as one source card', () => {
  const work='https://irisgreen.eu/es/biblioteca/trabajo-y-apoyos';
  const candidates=[c('work.meta',work,112),c('work.sec2',work,110),c('work.sec4',work,109)];
  const out=groupSources(candidates);
  assert.equal(out.length,1);
  assert.deepEqual(out[0].citations.map(x=>x.fragment_id),['work.meta','work.sec2','work.sec4']);
});

test('empty input returns an empty frozen presentation view', () => {
  const out=groupSources([]);
  assert.deepEqual(out,[]);
  assert.equal(Object.isFrozen(out),true);
});

test('invalid candidates fail without serializing payload content into the error', () => {
  assert.throws(()=>groupSources(null),e=>e instanceof TypeError && e.message==='INVALID_SOURCE_CANDIDATES');
  assert.throws(()=>groupSources([{url:'https://irisgreen.eu/private?query=secret'}]),e=>
    e instanceof TypeError && e.message==='INVALID_SOURCE_CANDIDATE' && !e.message.includes('secret'));
});
