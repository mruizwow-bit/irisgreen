/* Iris Green · El taller · Estudio de diseño gráfico (R43). Usa el lienzo común (ig-suite-lienzo.js). */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;
  IG.defineEngine('diseno', {
    libs: ['pixi'], version: 1, fileBase: LANG === 'en' ? 'design' : 'diseno',
    extraKeys: ['kLienzoCursor', 'kLienzoObj'],
    initialStart: function (para) { return { child: 'card', teen: 'post', adult: 'banner' }[para] || 'poster'; },
    starts: function (ctx) {
      var t = ctx.t;
      return [
        { id: 'card', title: t('stCard'), desc: t('stCardD'), para: 'child' },
        { id: 'poster', title: t('stPoster'), desc: t('stPosterD'), para: 'any' },
        { id: 'post', title: t('stPost'), desc: t('stPostD'), para: 'teen' },
        { id: 'banner', title: t('stBanner'), desc: t('stBannerD'), para: 'adult' }
      ];
    },
    create: function (ctx) {
      var t = ctx.t;
      function obj(api, kind, x, y, w, hh, extra) { var o = Object.assign(api.defaults(kind, x, y, w, hh), extra || {}); o.id = api.nid(); return o; }
      function txt(api, x, y, w, text, size, extra) { return obj(api, 'text', x, y, w, size * 1.25, Object.assign({ text: text, size: size }, extra || {})); }
      var spec = {
        pages: false, tools: ['text', 'rect', 'ellipse', 'line', 'pen'], moreTools: ['line', 'pen'], printExport: true, defaultFont: 'atkinson', defaultSize: 40,
        sizes: [{ w: 794, h: 1123, label: 'sizeA4' }, { w: 1050, h: 750, label: 'sizeCard' }, { w: 1080, h: 1080, label: 'sizeSquare' }, { w: 1080, h: 1920, label: 'sizeStory' }, { w: 1500, h: 500, label: 'sizeBanner' }, { w: 1920, h: 1080, label: 'sizeSlide' }],
        minTextSize: function (S) { return Math.max(12, Math.round(S.w / 60)); },
        fileBase: function () { return LANG === 'en' ? 'design' : 'diseno'; },
        svgTitle: function () { return t('svgTitle'); },
        empty: function () { return { v: 1, w: 794, h: 1123, bg: '#ffffff', media: {}, pages: [{ objs: [] }] }; },
        example: function (id, api) {
          var S, o = [];
          if (id === 'card') {
            S = { v: 1, w: 1050, h: 750, bg: '#fbeee6', media: {}, pages: [{ objs: o }] }; api.S = S;
            o.push(obj(api, 'ellipse', -120, -140, 420, 420, { fill: '#f6e27a' }));
            o.push(obj(api, 'ellipse', 820, 520, 360, 360, { fill: '#c27ba0' }));
            o.push(obj(api, 'rect', 90, 90, 870, 570, { fill: '#ffffff', radius: 36 }));
            o.push(txt(api, 150, 150, 750, t('exCardTitle'), 72, { font: 'bricolage', bold: true, color: '#5a49a8', align: 'center' }));
            o.push(txt(api, 150, 290, 750, t('exCardBody'), 34, { bold: false, color: '#101820', align: 'center' }));
            o.push(txt(api, 150, 470, 750, t('exCardWhen'), 34, { bold: true, color: '#8a2942', align: 'center' }));
            [[300, 600, '#e0b000'], [520, 610, '#1f5f8b'], [740, 600, '#2e7d32']].forEach(function (b) { o.push(obj(api, 'ellipse', b[0], b[1], 36, 36, { fill: b[2] })); });
          } else if (id === 'poster') {
            S = { v: 1, w: 794, h: 1123, bg: '#ffffff', media: {}, pages: [{ objs: o }] }; api.S = S;
            o.push(obj(api, 'rect', 0, 0, 794, 520, { fill: '#1f5f8b' }));
            o.push(obj(api, 'ellipse', 470, 120, 360, 360, { fill: '#0b8f8f' }));
            o.push(obj(api, 'ellipse', 560, 210, 180, 180, { fill: '#f6e27a' }));
            o.push(txt(api, 60, 90, 520, t('exPosterKicker'), 26, { bold: true, color: '#f6e27a' }));
            o.push(txt(api, 60, 140, 460, t('exPosterTitle'), 76, { font: 'bricolage', bold: true, color: '#ffffff' }));
            o.push(txt(api, 60, 580, 674, t('exPosterBody'), 26, { bold: false, color: '#101820' }));
            o.push(obj(api, 'line', 60, 760, 674, 0, { stroke: '#7d8b99', sw: 2 }));
            o.push(txt(api, 60, 790, 330, t('exPosterWhen'), 28, { bold: true, color: '#101820' }));
            o.push(txt(api, 404, 790, 330, t('exPosterWhere'), 28, { bold: true, color: '#101820' }));
            o.push(obj(api, 'rect', 60, 960, 674, 100, { fill: '#b3261e', radius: 18 }));
            o.push(txt(api, 80, 990, 634, t('exPosterCta'), 34, { bold: true, color: '#ffffff', align: 'center' }));
          } else if (id === 'post') {
            S = { v: 1, w: 1080, h: 1080, bg: '#101820', media: {}, pages: [{ objs: o }] }; api.S = S;
            for (var i = 0; i < 6; i++) o.push(obj(api, 'rect', 0, i * 180, 1080, 90, { fill: '#1d2a36' }));
            o.push(obj(api, 'ellipse', 640, 560, 600, 600, { fill: '#5a49a8' }));
            o.push(txt(api, 90, 150, 900, t('exPostTitle'), 110, { font: 'bricolage', bold: true, color: '#f6e27a' }));
            o.push(txt(api, 90, 560, 620, t('exPostBody'), 44, { bold: false, color: '#ffffff' }));
            o.push(txt(api, 90, 940, 900, t('exPostTag'), 32, { font: 'mono', bold: false, color: '#7cc36b' }));
          } else {
            S = { v: 1, w: 1500, h: 500, bg: '#eef3f8', media: {}, pages: [{ objs: o }] }; api.S = S;
            o.push(obj(api, 'rect', 980, 0, 520, 500, { fill: '#2e7d32' }));
            o.push(obj(api, 'ellipse', 1060, 80, 340, 340, { fill: '#7cc36b' }));
            o.push(obj(api, 'rect', 1150, 170, 160, 160, { fill: '#ffffff', radius: 24, rot: 12 }));
            o.push(txt(api, 80, 90, 840, t('exBannerTitle'), 70, { font: 'bricolage', bold: true, color: '#101820' }));
            o.push(txt(api, 80, 290, 800, t('exBannerBody'), 30, { bold: false, color: '#26394d' }));
            o.push(obj(api, 'rect', 80, 390, 300, 70, { fill: '#17395c', radius: 35 }));
            o.push(txt(api, 80, 408, 300, t('exBannerCta'), 28, { bold: true, color: '#ffffff', align: 'center' }));
          }
          return S;
        }
      };
      return IG.Lienzo.create(ctx, spec);
    }
  });
})(window);
