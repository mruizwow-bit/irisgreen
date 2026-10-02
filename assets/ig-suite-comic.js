/* Iris Green · El taller · Estudio de cómic y guion gráfico (R43). Usa el lienzo común (ig-suite-lienzo.js). */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;
  var LAYOUTS = { l1: [[0, 0, 1, 1]], l2: [[0, 0, 1, 0.5], [0, 0.5, 1, 0.5]], l3: [[0, 0, 1, 0.45], [0, 0.45, 0.5, 0.55], [0.5, 0.45, 0.5, 0.55]],
    l4: [[0, 0, 0.5, 0.5], [0.5, 0, 0.5, 0.5], [0, 0.5, 0.5, 0.5], [0.5, 0.5, 0.5, 0.5]], l6: [[0, 0, 0.5, 1 / 3], [0.5, 0, 0.5, 1 / 3], [0, 1 / 3, 0.5, 1 / 3], [0.5, 1 / 3, 0.5, 1 / 3], [0, 2 / 3, 0.5, 1 / 3], [0.5, 2 / 3, 0.5, 1 / 3]],
    s3: [[0, 0, 1 / 3, 1], [1 / 3, 0, 1 / 3, 1], [2 / 3, 0, 1 / 3, 1]] };

  IG.defineEngine('comic', {
    libs: ['pixi'], version: 1, fileBase: LANG === 'en' ? 'comic' : 'comic',
    extraKeys: ['kLienzoCursor', 'kLienzoObj'],
    initialStart: function (para) { return { child: 'strip', teen: 'storyboard', adult: 'page' }[para] || 'strip'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'strip', title: t('stStrip'), desc: t('stStripD'), para: 'child' },
        { id: 'page', title: t('stPage'), desc: t('stPageD'), para: 'adult' },
        { id: 'storyboard', title: t('stBoard'), desc: t('stBoardD'), para: 'teen' }
      ];
    },
    create: function (ctx) {
      var t = ctx.t;
      function panels(api, layout, W, H) {
        var m = 30, g = 18, iw = W - 2 * m, ih = H - 2 * m, out = [];
        LAYOUTS[layout].forEach(function (r) { var x = m + r[0] * iw + (r[0] > 0 ? g / 2 : 0), y = m + r[1] * ih + (r[1] > 0 ? g / 2 : 0), w = r[2] * iw - (r[0] > 0 ? g / 2 : 0) - (r[0] + r[2] < 0.999 ? g / 2 : 0), hh = r[3] * ih - (r[1] > 0 ? g / 2 : 0) - (r[1] + r[3] < 0.999 ? g / 2 : 0); var p = api.defaults('panel', x, y, w, hh); p.id = api.nid(); out.push(p); });
        return out;
      }
      function obj(api, kind, x, y, w, hh, extra) { var o = Object.assign(api.defaults(kind, x, y, w, hh), extra || {}); if (o.kind === 'caption' && !(extra && extra.fill)) o.fill = '#fff4c2'; o.id = api.nid(); return o; }
      function person(api, cx, cy, s, colour, mood) {
        /* personaje sencillo hecho con formas: cabeza, ojos, boca y cuerpo */
        var o = [];
        o.push(obj(api, 'rect', cx - s * 0.45, cy + s * 0.55, s * 0.9, s * 0.85, { fill: colour, radius: s * 0.3 }));
        o.push(obj(api, 'ellipse', cx - s * 0.5, cy - s * 0.5, s, s, { fill: '#f1c9a5', stroke: '#101820', sw: 3 }));
        o.push(obj(api, 'ellipse', cx - s * 0.22, cy - s * 0.12, s * 0.1, s * 0.14, { fill: '#101820' }));
        o.push(obj(api, 'ellipse', cx + s * 0.12, cy - s * 0.12, s * 0.1, s * 0.14, { fill: '#101820' }));
        var mouth = mood === 'wow' ? obj(api, 'ellipse', cx - s * 0.08, cy + s * 0.15, s * 0.16, s * 0.18, { fill: '#8a2942' }) : obj(api, 'line', cx - s * 0.15, cy + s * 0.2, s * 0.3, mood === 'sad' ? -s * 0.02 : s * 0.02, { stroke: '#101820', sw: 3 });
        o.push(mouth);
        return o;
      }
      var spec = {
        pages: true, tools: ['panel', 'balloon', 'text', 'pen', 'rect', 'ellipse', 'line'], moreTools: ['rect', 'ellipse', 'line'], defaultFont: 'bricolage', defaultSize: 28,
        sizes: [{ w: 800, h: 1130, label: 'sizePage' }, { w: 1200, h: 420, label: 'sizeStrip' }, { w: 1080, h: 1080, label: 'sizeSquare' }],
        minTextSize: function () { return 16; },
        fileBase: function () { return 'comic'; },
        svgTitle: function (api, pi) { return t('svgTitle', { n: pi + 1 }); },
        empty: function (api) { var S = { v: 1, w: 800, h: 1130, bg: '#ffffff', media: {}, pages: [{ objs: [] }] }; api.S = S; S.pages[0].objs = panels(api, 'l4', 800, 1130); return S; },
        newPage: function (api) { return panels(api, 'l4', api.S.w, api.S.h); },
        pageExtras: function (out, api) {
          var h = api.h; out.push(h('p', { class: 'igs-field-group', text: t('layout') }));
          var row = h('div', { class: 'igs-actions' });
          Object.keys(LAYOUTS).forEach(function (k) {
            row.appendChild(api.ctx.button(t('layout_' + k), { icon: 'frame', onClick: function () { var pg = api.page(); pg.objs = pg.objs.filter(function (o) { return o.type !== 'panel'; }); pg.objs = panels(api, k, api.S.w, api.S.h).concat(pg.objs); api.commit(t('layoutApplied')); } }));
          });
          out.push(row, h('p', { class: 'igs-muted', text: t('layoutHelp') }));
        },
        example: function (id, api) {
          var S;
          if (id === 'strip') {
            S = { v: 1, w: 1200, h: 420, bg: '#ffffff', media: {}, pages: [{ objs: [] }] }; api.S = S;
            var P = panels(api, 's3', 1200, 420), objs = P.slice();
            objs = objs.concat(person(api, 200, 235, 90, '#1f5f8b', 'happy'));
            objs.push(obj(api, 'balloon', 70, 50, 250, 110, { text: t('ex1a'), tail: [185, 190] }));
            objs = objs.concat(person(api, 560, 235, 90, '#1f5f8b', 'wow'));
            objs.push(obj(api, 'ellipse', 690, 290, 70, 70, { fill: '#e0b000', stroke: '#101820', sw: 3 }));
            objs.push(obj(api, 'balloon', 440, 50, 230, 110, { kind: 'shout', text: t('ex1b'), bold: true, tail: [560, 190] }));
            objs = objs.concat(person(api, 960, 235, 90, '#1f5f8b', 'happy'));
            objs.push(obj(api, 'balloon', 820, 45, 260, 110, { kind: 'thought', text: t('ex1c'), tail: [950, 185] }));
            objs.push(obj(api, 'balloon', 44, 356, 330, 40, { kind: 'caption', text: t('ex1cap'), size: 18 }));
            S.pages[0].objs = objs;
          } else if (id === 'storyboard') {
            S = { v: 1, w: 800, h: 1130, bg: '#ffffff', media: {}, pages: [{ objs: [] }] }; api.S = S;
            var P2 = panels(api, 'l6', 800, 1130), objs2 = P2.slice();
            [t('sb1'), t('sb2'), t('sb3'), t('sb4'), t('sb5'), t('sb6')].forEach(function (txt, i) { var p = P2[i]; objs2.push(obj(api, 'balloon', p.x + 10, p.y + p.h - 58, p.w - 20, 48, { kind: 'caption', text: txt, size: 17 })); });
            objs2 = objs2.concat(person(api, P2[1].x + P2[1].w / 2, P2[1].y + 120, 70, '#2e7d32', 'happy'));
            objs2.push(obj(api, 'line', P2[3].x + 40, P2[3].y + 140, 250, -40, { stroke: '#b3261e', sw: 5, arrow: true }));
            S.pages[0].objs = objs2;
          } else {
            S = { v: 1, w: 800, h: 1130, bg: '#ffffff', media: {}, pages: [{ objs: [] }, { objs: [] }] }; api.S = S;
            var P3 = panels(api, 'l3', 800, 1130), o3 = P3.slice();
            o3.push(obj(api, 'rect', P3[0].x, P3[0].y + P3[0].h * 0.62, P3[0].w, P3[0].h * 0.38, { fill: '#7cc36b' }));
            o3.push(obj(api, 'ellipse', P3[0].x + P3[0].w - 150, P3[0].y + 40, 90, 90, { fill: '#f6e27a' }));
            o3.push(obj(api, 'balloon', P3[0].x + 20, P3[0].y + 20, 360, 46, { kind: 'caption', text: t('ex3cap'), size: 18 }));
            o3 = o3.concat(person(api, P3[1].x + 120, P3[1].y + 260, 100, '#5a49a8', 'sad'));
            o3.push(obj(api, 'balloon', P3[1].x + 20, P3[1].y + 30, 300, 130, { text: t('ex3a'), tail: [P3[1].x + 130, P3[1].y + 190] }));
            o3 = o3.concat(person(api, P3[2].x + 180, P3[2].y + 260, 100, '#d86b00', 'happy'));
            o3.push(obj(api, 'balloon', P3[2].x + 30, P3[2].y + 30, 300, 130, { text: t('ex3b'), tail: [P3[2].x + 170, P3[2].y + 190] }));
            S.pages[0].objs = o3; S.pages[1].objs = panels(api, 'l4', 800, 1130);
          }
          return S;
        }
      };
      return IG.Lienzo.create(ctx, spec);
    }
  });
})(window);
