/* Iris Green · El taller · bloques ↔ código ↔ resultado (R43).
   Una sola representación interna (árbol de instrucciones) une las tres vistas:
   - Bloques (Blockly 13) → árbol → JavaScript y Python legibles;
   - JavaScript editado a mano (CodeMirror 6) → árbol → bloques, si usa las construcciones conocidas;
   - el árbol se ejecuta con un intérprete propio por hilos (sin eval ni new Function):
     cada guion es un hilo; las esperas y los bucles ceden el turno, así nada congela la página. */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  var LANG = IG.lang;

  /* ---------- Teclas y colores con nombre (nunca solo color) ---------- */
  var KEYS = [
    ['space', 'espacio', 'space'], ['up', 'arriba', 'up'], ['down', 'abajo', 'down'], ['left', 'izquierda', 'left'], ['right', 'derecha', 'right'],
    ['a', 'a', 'a'], ['d', 'd', 'd'], ['s', 's', 's'], ['w', 'w', 'w'], ['enter', 'intro', 'enter']
  ];
  var KEY_CODE = { space: ' ', up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'a', d: 'd', s: 's', w: 'w', enter: 'Enter' };
  var COLORS = [
    ['azul', 'blue', '#1f5f8b'], ['rojo', 'red', '#b3261e'], ['verde', 'green', '#2e7d32'], ['amarillo', 'yellow', '#e0b000'], ['morado', 'purple', '#5a49a8'],
    ['naranja', 'orange', '#d86b00'], ['rosa', 'pink', '#c2185b'], ['negro', 'black', '#172b42'], ['blanco', 'white', '#ffffff'], ['gris', 'grey', '#7d8b99'], ['turquesa', 'teal', '#197991']
  ];
  function colorName(hex) { for (var i = 0; i < COLORS.length; i++) if (COLORS[i][2] === hex) return COLORS[i][LANG === 'en' ? 1 : 0]; return hex; }
  function colorHex(name) {
    var n = String(name).toLowerCase();
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i][0] === n || COLORS[i][1] === n || COLORS[i][2] === n) return COLORS[i][2];
    return /^#[0-9a-f]{6}$/i.test(n) ? n : '#1f5f8b';
  }
  function keyName(k) { for (var i = 0; i < KEYS.length; i++) if (KEYS[i][0] === k) return KEYS[i][LANG === 'en' ? 2 : 1]; return k; }
  function keyId(name) { var n = String(name).toLowerCase(); for (var i = 0; i < KEYS.length; i++) if (KEYS[i][0] === n || KEYS[i][1] === n || KEYS[i][2] === n) return KEYS[i][0]; return null; }

  /* ---------- Lenguaje común de control (nombres en ES y EN) ---------- */
  var CORE_API = {
    wait: { es: 'esperar', en: 'wait' },
    say: null
  };
  var EVENT_NAMES = {
    start: { es: 'alEmpezar', en: 'onStart' }, key: { es: 'alPulsarTecla', en: 'onKey' }, click: { es: 'alTocar', en: 'onTap' },
    message: { es: 'alRecibir', en: 'onMessage' }, bump: { es: 'alChocar', en: 'onBump' }
  };
  var BROADCAST = { es: 'enviar', en: 'broadcast' }, RANDOM = { es: 'azar', en: 'random' };

  function snake(s) { return String(s).replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase(); }
  function ident(s) {
    var v = String(s || '').trim().replace(/\s+/g, '_').replace(/[^\p{L}\p{N}_$]/gu, '');
    if (!v || /^[0-9]/.test(v)) v = '_' + v;
    return v;
  }

  /* ======================================================================
     create(ctx, spec): monta el editor de código dentro del estudio
     spec.api: [{id, kind:'stmt'|'num'|'bool'|'str', cat, es, en, label:{es,en}, args:[{type, def, options}], level}]
     spec.categories: [{id, es, en, colour}]
     spec.events: ['start','key','click','message','bump']
     ====================================================================== */
  function create(ctx, spec) {
    var Blockly = root.Blockly, CM = root.IGCodeMirror, acorn = root.acorn, h = ctx.h, t = ctx.t;
    var API = {}, API_BY_NAME = {};
    spec.api.forEach(function (a) { API[a.id] = a; API_BY_NAME[a.es] = a; API_BY_NAME[a.en] = a; });
    function apiName(a) { return a[LANG]; }
    var EVENTS = spec.events || ['start', 'key', 'message'];

    /* ---------- Definición de bloques ---------- */
    var catColour = {}; spec.categories.forEach(function (c) { catColour[c.id] = c.colour; });
    var defs = [];
    function argJson(arg, i) {
      if (arg.type === 'key') return { type: 'field_dropdown', name: 'A' + i, options: KEYS.map(function (k) { return [keyName(k[0]), k[0]]; }) };
      if (arg.type === 'color') return { type: 'field_dropdown', name: 'A' + i, options: COLORS.map(function (c) { return [c[LANG === 'en' ? 1 : 0], c[2]]; }) };
      if (arg.type === 'choice') return { type: 'field_dropdown', name: 'A' + i, options: arg.options.map(function (o) { return [o[LANG === 'en' ? 2 : 1], o[0]]; }) };
      return { type: 'input_value', name: 'A' + i, check: arg.type === 'num' ? 'Number' : arg.type === 'bool' ? 'Boolean' : null };
    }
    spec.api.forEach(function (a) {
      var d = { type: 'igs_' + a.id, message0: a.label[LANG], args0: (a.args || []).map(argJson), colour: catColour[a.cat] || '#5b6f86', tooltip: a.tip ? a.tip[LANG] : '', inputsInline: true };
      if (a.kind === 'stmt') { d.previousStatement = null; d.nextStatement = null; }
      else d.output = a.kind === 'num' ? 'Number' : a.kind === 'bool' ? 'Boolean' : 'String';
      defs.push(d);
    });
    var EV_LABEL = {
      start: t('evStart'), key: t('evKey') + ' %1', click: t('evClick'), message: t('evMessage') + ' %1', bump: t('evBump')
    };
    EVENTS.forEach(function (ev) {
      var d = { type: 'igs_on_' + ev, message0: EV_LABEL[ev], message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], colour: '#b8860b', tooltip: t('evTip') };
      if (ev === 'key') d.args0 = [{ type: 'field_dropdown', name: 'KEY', options: KEYS.map(function (k) { return [keyName(k[0]), k[0]]; }) }];
      if (ev === 'message') d.args0 = [{ type: 'field_input', name: 'MSG', text: t('defaultMessage') }];
      d.style = undefined; d.hat = 'cap';
      defs.push(d);
    });
    defs.push({ type: 'igs_wait', message0: t('blkWait'), args0: [{ type: 'input_value', name: 'SECS', check: 'Number' }], previousStatement: null, nextStatement: null, colour: '#c27c0e', inputsInline: true });
    defs.push({ type: 'igs_forever', message0: t('blkForever'), message1: '%1', args1: [{ type: 'input_statement', name: 'DO' }], previousStatement: null, colour: '#c27c0e' });
    if (EVENTS.indexOf('message') >= 0) defs.push({ type: 'igs_broadcast', message0: t('blkBroadcast'), args0: [{ type: 'field_input', name: 'MSG', text: t('defaultMessage') }], previousStatement: null, nextStatement: null, colour: '#b8860b' });
    defs.push({ type: 'igs_random', message0: t('blkRandom'), args0: [{ type: 'input_value', name: 'FROM', check: 'Number' }, { type: 'input_value', name: 'TO', check: 'Number' }], output: 'Number', colour: '#5c8a4a', inputsInline: true });
    Blockly.common.defineBlocksWithJsonArray(defs);

    /* ---------- Caja de bloques ---------- */
    function shadowFor(arg) {
      if (arg.type === 'num') return { shadow: { type: 'math_number', fields: { NUM: arg.def === undefined ? 10 : arg.def } } };
      if (arg.type === 'str') return { shadow: { type: 'text', fields: { TEXT: arg.def === undefined ? '' : (typeof arg.def === 'object' ? arg.def[LANG] : arg.def) } } };
      if (arg.type === 'bool') return null;
      return null;
    }
    function apiBlock(a) {
      var b = { kind: 'block', type: 'igs_' + a.id, inputs: {} };
      (a.args || []).forEach(function (arg, i) { var s = shadowFor(arg); if (s) b.inputs['A' + i] = s; });
      return b;
    }
    function num(v) { return { shadow: { type: 'math_number', fields: { NUM: v } } }; }
    function toolbox() {
      var cats = [];
      var evBlocks = EVENTS.map(function (ev) { return { kind: 'block', type: 'igs_on_' + ev }; });
      if (EVENTS.indexOf('message') >= 0) evBlocks.push({ kind: 'block', type: 'igs_broadcast' });
      cats.push({ kind: 'category', name: t('catEvents'), colour: '#b8860b', contents: evBlocks });
      spec.categories.forEach(function (c) {
        var items = spec.api.filter(function (a) { return a.cat === c.id; }).map(apiBlock);
        if (items.length) cats.push({ kind: 'category', name: c[LANG], colour: c.colour, contents: items });
      });
      cats.push({ kind: 'category', name: t('catControl'), colour: '#c27c0e', contents: [
        { kind: 'block', type: 'igs_wait', inputs: { SECS: num(1) } },
        { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: num(10) } },
        { kind: 'block', type: 'igs_forever' },
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'controls_if', extraState: { hasElse: true } },
        { kind: 'block', type: 'controls_whileUntil' },
        { kind: 'block', type: 'controls_for', inputs: { FROM: num(1), TO: num(10), BY: num(1) } }
      ] });
      cats.push({ kind: 'category', name: t('catOperators'), colour: '#5c8a4a', contents: [
        { kind: 'block', type: 'math_number' }, { kind: 'block', type: 'math_arithmetic', inputs: { A: num(1), B: num(1) } },
        { kind: 'block', type: 'igs_random', inputs: { FROM: num(1), TO: num(10) } },
        { kind: 'block', type: 'logic_compare', inputs: { A: num(0), B: num(0) } }, { kind: 'block', type: 'logic_operation' }, { kind: 'block', type: 'logic_negate' },
        { kind: 'block', type: 'logic_boolean' }, { kind: 'block', type: 'math_modulo', inputs: { DIVIDEND: num(10), DIVISOR: num(3) } },
        { kind: 'block', type: 'math_round', inputs: { NUM: num(3.5) } }, { kind: 'block', type: 'math_single', inputs: { NUM: num(9) } },
        { kind: 'block', type: 'text' }, { kind: 'block', type: 'text_join' }
      ] });
      cats.push({ kind: 'category', name: t('catVariables'), colour: '#a6555f', custom: 'VARIABLE' });
      cats.push({ kind: 'category', name: t('catFunctions'), colour: '#7b5ea7', custom: 'PROCEDURE' });
      return { kind: 'categoryToolbox', contents: cats };
    }

    /* ======================================================================
       Árbol interno (AST)
       Program { vars:[name], funcs:[{name, params, body, returns, id}], threads:[{event, arg, body, id}] }
       ====================================================================== */
    function blocksToAst(json) {
      var varNames = {}, prog = { vars: [], funcs: [], threads: [], loose: 0 };
      (json.variables || []).forEach(function (v) { varNames[v.id] = ident(v.name); });
      function vname(f) { return f && (varNames[f.id] || ident(f.name || '')); }
      function inp(b, name) { var i = b.inputs && b.inputs[name]; if (!i) return null; return i.block || i.shadow || null; }
      function stmts(b) { var out = []; while (b) { var s = stmt(b); if (s) out.push(s); b = b.next && b.next.block; } return out; }
      function body(b, name) { var i = inp(b, name); return i ? stmts(i) : []; }
      function expr(b) {
        if (!b) return { k: 'num', v: 0 };
        var f = b.fields || {};
        switch (b.type) {
          case 'math_number': return { k: 'num', v: Number(f.NUM) || 0, id: b.id };
          case 'text': return { k: 'str', v: String(f.TEXT || ''), id: b.id };
          case 'logic_boolean': return { k: 'bool', v: f.BOOL === 'TRUE', id: b.id };
          case 'variables_get': return { k: 'var', name: vname(f.VAR), id: b.id };
          case 'math_arithmetic': return { k: 'bin', op: { ADD: '+', MINUS: '-', MULTIPLY: '*', DIVIDE: '/', POWER: '**' }[f.OP] || '+', a: expr(inp(b, 'A')), b: expr(inp(b, 'B')), id: b.id };
          case 'math_modulo': return { k: 'bin', op: '%', a: expr(inp(b, 'DIVIDEND')), b: expr(inp(b, 'DIVISOR')), id: b.id };
          case 'logic_compare': return { k: 'bin', op: { EQ: '==', NEQ: '!=', LT: '<', LTE: '<=', GT: '>', GTE: '>=' }[f.OP] || '==', a: expr(inp(b, 'A')), b: expr(inp(b, 'B')), id: b.id };
          case 'logic_operation': return { k: 'bin', op: f.OP === 'OR' ? '||' : '&&', a: expr(inp(b, 'A')), b: expr(inp(b, 'B')), id: b.id };
          case 'logic_negate': return { k: 'not', a: expr(inp(b, 'BOOL')), id: b.id };
          case 'igs_random': return { k: 'random', a: expr(inp(b, 'FROM')), b: expr(inp(b, 'TO')), id: b.id };
          case 'math_round': return { k: 'math', fn: { ROUND: 'round', ROUNDUP: 'ceil', ROUNDDOWN: 'floor' }[f.OP] || 'round', a: expr(inp(b, 'NUM')), id: b.id };
          case 'math_single': return { k: 'math', fn: { ROOT: 'sqrt', ABS: 'abs', NEG: 'neg', LN: 'log', LOG10: 'log10', EXP: 'exp', POW10: 'pow10' }[f.OP] || 'abs', a: expr(inp(b, 'NUM')), id: b.id };
          case 'text_join': {
            var n = (b.extraState && b.extraState.itemCount) || 0, parts = [];
            for (var i = 0; i < n; i++) parts.push(expr(inp(b, 'ADD' + i)) || { k: 'str', v: '' });
            if (!parts.length) return { k: 'str', v: '', id: b.id };
            return parts.slice(1).reduce(function (acc, p) { return { k: 'bin', op: '+', a: acc, b: p }; }, parts[0].k === 'str' ? parts[0] : { k: 'bin', op: '+', a: { k: 'str', v: '' }, b: parts[0] });
          }
          case 'procedures_callreturn': return { k: 'fcall', name: ident(b.extraState && b.extraState.name), args: ((b.extraState && b.extraState.params) || []).map(function (_, i) { return expr(inp(b, 'ARG' + i)); }), id: b.id };
          default:
            if (b.type.indexOf('igs_') === 0 && API[b.type.slice(4)]) return apiCall(b);
            return { k: 'num', v: 0, id: b.id };
        }
      }
      function apiCall(b) {
        var a = API[b.type.slice(4)], f = b.fields || {};
        return { k: 'api', fn: a.id, args: (a.args || []).map(function (arg, i) {
          if (arg.type === 'key' || arg.type === 'color' || arg.type === 'choice') return { k: 'str', v: String(f['A' + i] || '') };
          return expr(inp(b, 'A' + i));
        }), id: b.id };
      }
      function stmt(b) {
        var f = b.fields || {};
        switch (b.type) {
          case 'igs_wait': return { k: 'wait', a: expr(inp(b, 'SECS')), id: b.id };
          case 'igs_forever': return { k: 'forever', body: body(b, 'DO'), id: b.id };
          case 'igs_broadcast': return { k: 'broadcast', msg: String(f.MSG || ''), id: b.id };
          case 'controls_repeat_ext': return { k: 'repeat', n: expr(inp(b, 'TIMES')), body: body(b, 'DO'), id: b.id };
          case 'controls_whileUntil': return { k: f.MODE === 'UNTIL' ? 'until' : 'while', c: expr(inp(b, 'BOOL')), body: body(b, 'DO'), id: b.id };
          case 'controls_for': return { k: 'for', v: vname(f.VAR), from: expr(inp(b, 'FROM')), to: expr(inp(b, 'TO')), by: expr(inp(b, 'BY')), body: body(b, 'DO'), id: b.id };
          case 'controls_if': {
            var es = b.extraState || {}, n = es.elseIfCount || 0, branches = [];
            for (var i = 0; i <= n; i++) branches.push({ c: expr(inp(b, 'IF' + i)), body: body(b, 'DO' + i) });
            return { k: 'if', branches: branches, els: es.hasElse ? body(b, 'ELSE') : null, id: b.id };
          }
          case 'variables_set': return { k: 'set', v: vname(f.VAR), a: expr(inp(b, 'VALUE')), id: b.id };
          case 'math_change': return { k: 'change', v: vname(f.VAR), a: expr(inp(b, 'DELTA')), id: b.id };
          case 'procedures_callnoreturn': return { k: 'call', name: ident(b.extraState && b.extraState.name), args: ((b.extraState && b.extraState.params) || []).map(function (_, i) { return expr(inp(b, 'ARG' + i)); }), id: b.id };
          case 'procedures_ifreturn': return { k: 'return', a: b.inputs && b.inputs.VALUE ? expr(inp(b, 'VALUE')) : null, id: b.id };
          default:
            if (b.type.indexOf('igs_') === 0 && API[b.type.slice(4)] && API[b.type.slice(4)].kind === 'stmt') { var c = apiCall(b); c.k = 'apistmt'; return c; }
            return null;
        }
      }
      var top = (json.blocks && json.blocks.blocks) || [];
      top.forEach(function (b) {
        if (b.enabled === false) return;
        var ev = /^igs_on_(\w+)$/.exec(b.type);
        if (ev) { prog.threads.push({ event: ev[1], arg: ev[1] === 'key' ? (b.fields || {}).KEY : ev[1] === 'message' ? String((b.fields || {}).MSG || '') : null, body: body(b, 'DO'), id: b.id }); return; }
        if (b.type === 'procedures_defnoreturn' || b.type === 'procedures_defreturn') {
          prog.funcs.push({ name: ident((b.fields || {}).NAME), params: ((b.extraState && b.extraState.params) || []).map(function (p) { return ident(p.name); }), body: body(b, 'STACK'),
            returns: b.type === 'procedures_defreturn' ? expr(inp(b, 'RETURN')) : null, id: b.id });
          return;
        }
        prog.loose += 1;
      });
      var params = {}; prog.funcs.forEach(function (fn) { fn.params.forEach(function (p) { params[p] = 1; }); });
      (json.variables || []).forEach(function (v) { var n = ident(v.name); if (!params[n] && prog.vars.indexOf(n) < 0) prog.vars.push(n); });
      return prog;
    }

    /* ---------- AST → JavaScript ---------- */
    var PREC = { '||': 1, '&&': 2, '==': 3, '!=': 3, '<': 4, '<=': 4, '>': 4, '>=': 4, '+': 5, '-': 5, '*': 6, '/': 6, '%': 6, '**': 7 };
    function jsStr(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"; }
    function jsExpr(e, parent) {
      switch (e.k) {
        case 'num': return (e.v < 0 && parent) ? '(' + String(e.v) + ')' : String(e.v);
        case 'str': return jsStr(e.v);
        case 'bool': return e.v ? 'true' : 'false';
        case 'var': return e.name;
        case 'not': return '!' + wrap(e.a, 8);
        case 'random': return RANDOM[LANG] + '(' + jsExpr(e.a) + ', ' + jsExpr(e.b) + ')';
        case 'math': return e.fn === 'neg' ? '-' + wrap(e.a, 8) : e.fn === 'pow10' ? '10 ** ' + wrap(e.a, 7) : 'Math.' + e.fn + '(' + jsExpr(e.a) + ')';
        case 'api': return apiName(API[e.fn]) + '(' + e.args.map(function (a) { return jsExpr(a); }).join(', ') + ')';
        case 'fcall': return e.name + '(' + e.args.map(function (a) { return jsExpr(a); }).join(', ') + ')';
        case 'bin': {
          var op = e.op === '==' ? '===' : e.op === '!=' ? '!==' : e.op, p = PREC[e.op];
          var s = wrap(e.a, p) + ' ' + op + ' ' + wrap(e.b, p + (e.op === '**' ? 0 : 1));
          return parent && parent > p ? '(' + s + ')' : s;
        }
      }
      return '0';
    }
    function wrap(e, p) { if (e.k === 'bin') return jsExpr(e, p); return jsExpr(e, p); }
    var LOOPV = ['i', 'j', 'k', 'n', 'm'];
    function jsBlock(list, ind, depth) { return list.map(function (s) { return jsStmt(s, ind, depth); }).join(''); }
    function jsStmt(s, ind, depth) {
      var I = ind, I2 = ind + '  ';
      switch (s.k) {
        case 'apistmt': return I + apiName(API[s.fn]) + '(' + s.args.map(function (a) { return jsExpr(a); }).join(', ') + ');\n';
        case 'wait': return I + CORE_API.wait[LANG] + '(' + jsExpr(s.a) + ');\n';
        case 'broadcast': return I + BROADCAST[LANG] + '(' + jsStr(s.msg) + ');\n';
        case 'forever': return I + 'while (true) {\n' + jsBlock(s.body, I2, depth) + I + '}\n';
        case 'repeat': { var v = LOOPV[depth % LOOPV.length] + (depth >= LOOPV.length ? depth : ''); return I + 'for (let ' + v + ' = 0; ' + v + ' < ' + jsExpr(s.n, 4) + '; ' + v + '++) {\n' + jsBlock(s.body, I2, depth + 1) + I + '}\n'; }
        case 'while': return I + 'while (' + jsExpr(s.c) + ') {\n' + jsBlock(s.body, I2, depth) + I + '}\n';
        case 'until': return I + 'while (!(' + jsExpr(s.c) + ')) {\n' + jsBlock(s.body, I2, depth) + I + '}\n';
        case 'for': return I + 'for (' + s.v + ' = ' + jsExpr(s.from) + '; ' + s.v + ' <= ' + jsExpr(s.to, 4) + '; ' + s.v + ' += ' + jsExpr(s.by) + ') {\n' + jsBlock(s.body, I2, depth) + I + '}\n';
        case 'if': {
          var out = '';
          s.branches.forEach(function (br, i) { out += (i === 0 ? I + 'if (' : ' else if (') + jsExpr(br.c) + ') {\n' + jsBlock(br.body, I2, depth) + I + '}'; });
          if (s.els) out += ' else {\n' + jsBlock(s.els, I2, depth) + I + '}';
          return out + '\n';
        }
        case 'set': return I + s.v + ' = ' + jsExpr(s.a) + ';\n';
        case 'change': return I + s.v + ' += ' + jsExpr(s.a) + ';\n';
        case 'call': return I + s.name + '(' + s.args.map(function (a) { return jsExpr(a); }).join(', ') + ');\n';
        case 'return': return I + 'return' + (s.a ? ' ' + jsExpr(s.a) : '') + ';\n';
      }
      return '';
    }
    function astToJs(prog) {
      var out = '';
      if (prog.vars.length) out += prog.vars.map(function (v) { return 'let ' + v + ' = 0;\n'; }).join('') + '\n';
      prog.funcs.forEach(function (fn) {
        out += 'function ' + fn.name + '(' + fn.params.join(', ') + ') {\n' + jsBlock(fn.body, '  ', 0) + (fn.returns ? '  return ' + jsExpr(fn.returns) + ';\n' : '') + '}\n\n';
      });
      prog.threads.forEach(function (th) {
        var name = EVENT_NAMES[th.event][LANG];
        var arg = th.event === 'key' ? jsStr(keyName(th.arg)) + ', ' : th.event === 'message' ? jsStr(th.arg) + ', ' : '';
        out += name + '(' + arg + '() => {\n' + jsBlock(th.body, '  ', 0) + '});\n\n';
      });
      return out.trim() + '\n';
    }

    /* ---------- AST → Python (solo lectura, para aprender) ---------- */
    function pyExpr(e, parent) {
      switch (e.k) {
        case 'num': return String(e.v);
        case 'str': return jsStr(e.v);
        case 'bool': return e.v ? 'True' : 'False';
        case 'var': return snake(e.name);
        case 'not': return 'not ' + pyExpr(e.a, 8);
        case 'random': return snake(RANDOM[LANG]) + '(' + pyExpr(e.a) + ', ' + pyExpr(e.b) + ')';
        case 'math': return e.fn === 'neg' ? '-' + pyExpr(e.a, 8) : e.fn === 'pow10' ? '10 ** ' + pyExpr(e.a, 7) : e.fn === 'abs' ? 'abs(' + pyExpr(e.a) + ')' : e.fn === 'round' ? 'round(' + pyExpr(e.a) + ')' : 'math.' + e.fn + '(' + pyExpr(e.a) + ')';
        case 'api': return snake(apiName(API[e.fn])) + '(' + e.args.map(function (a) { return pyExpr(a); }).join(', ') + ')';
        case 'fcall': return snake(e.name) + '(' + e.args.map(function (a) { return pyExpr(a); }).join(', ') + ')';
        case 'bin': {
          var op = { '&&': 'and', '||': 'or' }[e.op] || e.op, p = PREC[e.op];
          var s = pyExpr(e.a, p) + ' ' + op + ' ' + pyExpr(e.b, p + 1);
          return parent && parent > p ? '(' + s + ')' : s;
        }
      }
      return '0';
    }
    function pyBlock(list, ind, globals) {
      if (!list.length) return ind + 'pass\n';
      return list.map(function (s) { return pyStmt(s, ind, globals); }).join('');
    }
    function pyStmt(s, I, globals) {
      var I2 = I + '    ';
      switch (s.k) {
        case 'apistmt': return I + snake(apiName(API[s.fn])) + '(' + s.args.map(function (a) { return pyExpr(a); }).join(', ') + ')\n';
        case 'wait': return I + snake(CORE_API.wait[LANG]) + '(' + pyExpr(s.a) + ')\n';
        case 'broadcast': return I + snake(BROADCAST[LANG]) + '(' + jsStr(s.msg) + ')\n';
        case 'forever': return I + 'while True:\n' + pyBlock(s.body, I2, globals);
        case 'repeat': return I + 'for _ in range(' + pyExpr(s.n) + '):\n' + pyBlock(s.body, I2, globals);
        case 'while': return I + 'while ' + pyExpr(s.c) + ':\n' + pyBlock(s.body, I2, globals);
        case 'until': return I + 'while not (' + pyExpr(s.c) + '):\n' + pyBlock(s.body, I2, globals);
        case 'for': return I + snake(s.v) + ' = ' + pyExpr(s.from) + '\n' + I + 'while ' + snake(s.v) + ' <= ' + pyExpr(s.to) + ':\n' + pyBlock(s.body, I2, globals) + I2 + snake(s.v) + ' += ' + pyExpr(s.by) + '\n';
        case 'if': {
          var out = '';
          s.branches.forEach(function (br, i) { out += I + (i === 0 ? 'if ' : 'elif ') + pyExpr(br.c) + ':\n' + pyBlock(br.body, I2, globals); });
          if (s.els) out += I + 'else:\n' + pyBlock(s.els, I2, globals);
          return out;
        }
        case 'set': return I + snake(s.v) + ' = ' + pyExpr(s.a) + '\n';
        case 'change': return I + snake(s.v) + ' += ' + pyExpr(s.a) + '\n';
        case 'call': return I + snake(s.name) + '(' + s.args.map(function (a) { return pyExpr(a); }).join(', ') + ')\n';
        case 'return': return I + 'return' + (s.a ? ' ' + pyExpr(s.a) : '') + '\n';
      }
      return '';
    }
    function astToPy(prog, header) {
      var out = header || '';
      prog.vars.forEach(function (v) { out += snake(v) + ' = 0\n'; });
      if (prog.vars.length) out += '\n';
      var g = prog.vars.length ? '    global ' + prog.vars.map(snake).join(', ') + '\n' : '';
      prog.funcs.forEach(function (fn) {
        out += 'def ' + snake(fn.name) + '(' + fn.params.map(snake).join(', ') + '):\n' + g + pyBlock(fn.body, '    ') + (fn.returns ? '    return ' + pyExpr(fn.returns) + '\n' : '') + '\n';
      });
      var n = 0;
      prog.threads.forEach(function (th) {
        n += 1;
        var dec = snake(EVENT_NAMES[th.event][LANG]);
        var arg = th.event === 'key' ? '(' + jsStr(keyName(th.arg)) + ')' : th.event === 'message' ? '(' + jsStr(th.arg) + ')' : '';
        out += '@' + dec + arg + '\ndef ' + (LANG === 'en' ? 'script_' : 'guion_') + n + '():\n' + g + pyBlock(th.body, '    ') + '\n';
      });
      return out.trim() + '\n';
    }

    /* ---------- JavaScript → AST (acorn), solo con construcciones conocidas ---------- */
    function CodeError(node, key, vars) { this.line = node && node.loc ? node.loc.start.line : 0; this.message = t(key, vars); }
    function jsToAst(code) {
      var tree;
      try { tree = acorn.parse(code, { ecmaVersion: 2022, sourceType: 'script', locations: true }); }
      catch (err) { var ce = new CodeError(null, 'errSyntax'); ce.line = err.loc ? err.loc.line : 0; throw ce; }
      var prog = { vars: [], funcs: [], threads: [], loose: 0 };
      var known = {};
      function isIdent(n, name) { return n && n.type === 'Identifier' && (!name || n.name === name); }
      function literalNum(n) { return n && n.type === 'Literal' && typeof n.value === 'number'; }
      function expr(n) {
        switch (n.type) {
          case 'Literal':
            if (typeof n.value === 'number') return { k: 'num', v: n.value };
            if (typeof n.value === 'string') return { k: 'str', v: n.value };
            if (typeof n.value === 'boolean') return { k: 'bool', v: n.value };
            break;
          case 'TemplateLiteral': if (!n.expressions.length) return { k: 'str', v: n.quasis[0].value.cooked }; break;
          case 'Identifier': return { k: 'var', name: n.name };
          case 'UnaryExpression':
            if (n.operator === '!') return { k: 'not', a: expr(n.argument) };
            if (n.operator === '-' && literalNum(n.argument)) return { k: 'num', v: -n.argument.value };
            if (n.operator === '-') return { k: 'math', fn: 'neg', a: expr(n.argument) };
            break;
          case 'BinaryExpression': case 'LogicalExpression': {
            var op = { '===': '==', '!==': '!=' }[n.operator] || n.operator;
            if (PREC[op] === undefined) break;
            if (op === '**' && literalNum(n.left) && n.left.value === 10) return { k: 'math', fn: 'pow10', a: expr(n.right) };
            return { k: 'bin', op: op, a: expr(n.left), b: expr(n.right) };
          }
          case 'CallExpression': {
            if (n.callee.type === 'MemberExpression' && isIdent(n.callee.object, 'Math') && !n.callee.computed && n.arguments.length === 1) {
              var fn = n.callee.property.name;
              if (['round', 'ceil', 'floor', 'sqrt', 'abs', 'log', 'log10', 'exp'].indexOf(fn) >= 0) return { k: 'math', fn: fn, a: expr(n.arguments[0]) };
            }
            if (isIdent(n.callee)) {
              var name = n.callee.name;
              if (name === RANDOM.es || name === RANDOM.en) { if (n.arguments.length !== 2) throw new CodeError(n, 'errArgs', { name: name, n: 2 }); return { k: 'random', a: expr(n.arguments[0]), b: expr(n.arguments[1]) }; }
              var a = API_BY_NAME[name];
              if (a && a.kind !== 'stmt') return { k: 'api', fn: a.id, args: apiArgs(a, n) };
              if (known[name] === 'func') return { k: 'fcall', name: name, args: n.arguments.map(expr) };
            }
            break;
          }
        }
        throw new CodeError(n, 'errExpr', { code: code.slice(n.start, Math.min(n.end, n.start + 40)) });
      }
      function apiArgs(a, n) {
        var need = (a.args || []).length;
        if (n.arguments.length !== need) throw new CodeError(n, 'errArgs', { name: a[LANG], n: need });
        return (a.args || []).map(function (arg, i) {
          var x = n.arguments[i];
          if (arg.type === 'key') { if (x.type !== 'Literal' || !keyId(x.value)) throw new CodeError(x, 'errKey'); return { k: 'str', v: keyId(x.value) }; }
          if (arg.type === 'color') { if (x.type !== 'Literal') throw new CodeError(x, 'errColor'); return { k: 'str', v: colorHex(x.value) }; }
          if (arg.type === 'choice') {
            if (x.type !== 'Literal') throw new CodeError(x, 'errChoice');
            var v = String(x.value).toLowerCase(), found = null;
            arg.options.forEach(function (o) { if (o[0] === v || String(o[1]).toLowerCase() === v || String(o[2]).toLowerCase() === v) found = o[0]; });
            if (!found) throw new CodeError(x, 'errChoice'); return { k: 'str', v: found };
          }
          return expr(x);
        });
      }
      function block(n) { if (n.type === 'BlockStatement') return list(n.body); return list([n]); }
      function list(arr) { var out = []; arr.forEach(function (s) { var r = stmt(s); if (r) out.push(r); }); return out; }
      function isRepeat(n) {
        /* for (let i = 0; i < N; i++) sin usar i dentro */
        var d = n.init && n.init.type === 'VariableDeclaration' && n.init.declarations.length === 1 ? n.init.declarations[0] : null;
        if (!d || !isIdent(d.id) || !literalNum(d.init) || d.init.value !== 0) return null;
        var v = d.id.name;
        if (!n.test || n.test.type !== 'BinaryExpression' || n.test.operator !== '<' || !isIdent(n.test.left, v)) return null;
        var u = n.update; if (!u || !((u.type === 'UpdateExpression' && u.operator === '++' && isIdent(u.argument, v)) || (u.type === 'AssignmentExpression' && u.operator === '+=' && isIdent(u.left, v) && literalNum(u.right) && u.right.value === 1))) return null;
        var used = code.slice(n.body.start, n.body.end); if (new RegExp('(^|[^\\w$])' + v.replace(/\$/g, '\\$') + '([^\\w$]|$)').test(used)) return null;
        return n.test.right;
      }
      function stmt(n) {
        switch (n.type) {
          case 'EmptyStatement': return null;
          case 'ExpressionStatement': {
            var e = n.expression;
            if (e.type === 'CallExpression' && isIdent(e.callee)) {
              var name = e.callee.name;
              if (name === CORE_API.wait.es || name === CORE_API.wait.en) { if (e.arguments.length !== 1) throw new CodeError(e, 'errArgs', { name: name, n: 1 }); return { k: 'wait', a: expr(e.arguments[0]) }; }
              if (name === BROADCAST.es || name === BROADCAST.en) { if (e.arguments.length !== 1 || e.arguments[0].type !== 'Literal') throw new CodeError(e, 'errMessage'); return { k: 'broadcast', msg: String(e.arguments[0].value) }; }
              var a = API_BY_NAME[name];
              if (a && a.kind === 'stmt') return { k: 'apistmt', fn: a.id, args: apiArgs(a, e) };
              if (known[name] === 'func') return { k: 'call', name: name, args: e.arguments.map(expr) };
              if (a) throw new CodeError(e, 'errNotStmt', { name: name });
              throw new CodeError(e, 'errUnknownFn', { name: name });
            }
            if (e.type === 'AssignmentExpression' && isIdent(e.left)) {
              if (!known[e.left.name]) throw new CodeError(e, 'errUnknownVar', { name: e.left.name });
              if (e.operator === '=') return { k: 'set', v: e.left.name, a: expr(e.right) };
              if (e.operator === '+=') return { k: 'change', v: e.left.name, a: expr(e.right) };
              if (e.operator === '-=') return { k: 'change', v: e.left.name, a: literalNum(e.right) ? { k: 'num', v: -e.right.value } : { k: 'math', fn: 'neg', a: expr(e.right) } };
            }
            if (e.type === 'UpdateExpression' && isIdent(e.argument)) return { k: 'change', v: e.argument.name, a: { k: 'num', v: e.operator === '++' ? 1 : -1 } };
            break;
          }
          case 'WhileStatement':
            if (n.test.type === 'Literal' && n.test.value === true) return { k: 'forever', body: block(n.body) };
            if (n.test.type === 'UnaryExpression' && n.test.operator === '!') return { k: 'until', c: expr(n.test.argument), body: block(n.body) };
            return { k: 'while', c: expr(n.test), body: block(n.body) };
          case 'ForStatement': {
            var times = isRepeat(n);
            if (times) return { k: 'repeat', n: expr(times), body: block(n.body) };
            var init = n.init, v, from;
            if (init && init.type === 'AssignmentExpression' && isIdent(init.left)) { v = init.left.name; from = init.right; }
            else if (init && init.type === 'VariableDeclaration' && init.declarations.length === 1) { v = init.declarations[0].id.name; from = init.declarations[0].init; }
            if (v && from && n.test && n.test.type === 'BinaryExpression' && n.test.operator === '<=' && isIdent(n.test.left, v) && n.update && n.update.type === 'AssignmentExpression' && n.update.operator === '+=' && isIdent(n.update.left, v)) {
              known[v] = known[v] || 'var'; if (prog.vars.indexOf(v) < 0) prog.vars.push(v);
              return { k: 'for', v: v, from: expr(from), to: expr(n.test.right), by: expr(n.update.right), body: block(n.body) };
            }
            throw new CodeError(n, 'errFor');
          }
          case 'IfStatement': {
            var branches = [{ c: expr(n.test), body: block(n.consequent) }], els = null, alt = n.alternate;
            while (alt && alt.type === 'IfStatement') { branches.push({ c: expr(alt.test), body: block(alt.consequent) }); alt = alt.alternate; }
            if (alt) els = block(alt);
            return { k: 'if', branches: branches, els: els };
          }
          case 'ReturnStatement': return { k: 'return', a: n.argument ? expr(n.argument) : null };
          case 'BlockStatement': throw new CodeError(n, 'errBlock');
          case 'VariableDeclaration': throw new CodeError(n, 'errLocalVar');
        }
        throw new CodeError(n, 'errStmt', { code: code.slice(n.start, Math.min(n.end, n.start + 40)).split('\n')[0] });
      }
      /* primera pasada: nombres declarados */
      tree.body.forEach(function (n) {
        if (n.type === 'VariableDeclaration') n.declarations.forEach(function (d) { if (isIdent(d.id)) { if (API_BY_NAME[d.id.name]) throw new CodeError(d, 'errReserved', { name: d.id.name }); known[d.id.name] = 'var'; } });
        if (n.type === 'FunctionDeclaration' && n.id) { if (API_BY_NAME[n.id.name]) throw new CodeError(n, 'errReserved', { name: n.id.name }); known[n.id.name] = 'func'; n.params.forEach(function (p) { if (isIdent(p)) known[p.name] = known[p.name] || 'param'; }); }
      });
      tree.body.forEach(function (n) {
        if (n.type === 'VariableDeclaration') {
          n.declarations.forEach(function (d) {
            if (prog.vars.indexOf(d.id.name) < 0) prog.vars.push(d.id.name);
            if (d.init && !(literalNum(d.init) && d.init.value === 0)) throw new CodeError(d, 'errVarInit');
          });
          return;
        }
        if (n.type === 'FunctionDeclaration') {
          var bodyStmts = n.body.body.slice(), ret = null;
          var last = bodyStmts[bodyStmts.length - 1];
          if (last && last.type === 'ReturnStatement' && last.argument) { ret = expr(last.argument); bodyStmts.pop(); }
          prog.funcs.push({ name: n.id.name, params: n.params.map(function (p) { if (!isIdent(p)) throw new CodeError(p, 'errParam'); return p.name; }), body: list(bodyStmts), returns: ret });
          return;
        }
        if (n.type === 'ExpressionStatement' && n.expression.type === 'CallExpression' && isIdent(n.expression.callee)) {
          var e = n.expression, name = e.callee.name, ev = null;
          Object.keys(EVENT_NAMES).forEach(function (k) { if (EVENTS.indexOf(k) >= 0 && (EVENT_NAMES[k].es === name || EVENT_NAMES[k].en === name)) ev = k; });
          if (ev) {
            var args = e.arguments, fnNode = args[args.length - 1], arg = null;
            if (!fnNode || !(fnNode.type === 'ArrowFunctionExpression' || fnNode.type === 'FunctionExpression') || fnNode.params.length) throw new CodeError(e, 'errEventFn');
            if (ev === 'key') { if (args.length !== 2 || args[0].type !== 'Literal' || !keyId(args[0].value)) throw new CodeError(e, 'errKey'); arg = keyId(args[0].value); }
            else if (ev === 'message') { if (args.length !== 2 || args[0].type !== 'Literal') throw new CodeError(e, 'errMessage'); arg = String(args[0].value); }
            else if (args.length !== 1) throw new CodeError(e, 'errEventFn');
            prog.threads.push({ event: ev, arg: arg, body: fnNode.body.type === 'BlockStatement' ? list(fnNode.body.body) : [] });
            return;
          }
        }
        throw new CodeError(n, 'errTop');
      });
      return prog;
    }

    /* ---------- AST → bloques (JSON de Blockly) ---------- */
    function astToBlocks(prog) {
      var vars = {}, varList = [], seq = 0;
      function vid(name) { if (!vars[name]) { seq += 1; vars[name] = 'v' + seq + '_' + name; varList.push({ name: name, id: vars[name] }); } return vars[name]; }
      prog.vars.forEach(vid);
      function N(v) { return { shadow: { type: 'math_number', fields: { NUM: v } } }; }
      function val(e) {
        if (!e) return undefined;
        var b;
        switch (e.k) {
          case 'num': return { block: { type: 'math_number', fields: { NUM: e.v } } };
          case 'str': return { block: { type: 'text', fields: { TEXT: e.v } } };
          case 'bool': return { block: { type: 'logic_boolean', fields: { BOOL: e.v ? 'TRUE' : 'FALSE' } } };
          case 'var': return { block: { type: 'variables_get', fields: { VAR: { id: vid(e.name) } } } };
          case 'not': return { block: { type: 'logic_negate', inputs: { BOOL: val(e.a) } } };
          case 'random': return { block: { type: 'igs_random', inputs: { FROM: val(e.a), TO: val(e.b) } } };
          case 'math':
            if (e.fn === 'round' || e.fn === 'ceil' || e.fn === 'floor') return { block: { type: 'math_round', fields: { OP: { round: 'ROUND', ceil: 'ROUNDUP', floor: 'ROUNDDOWN' }[e.fn] }, inputs: { NUM: val(e.a) } } };
            return { block: { type: 'math_single', fields: { OP: { sqrt: 'ROOT', abs: 'ABS', neg: 'NEG', log: 'LN', log10: 'LOG10', exp: 'EXP', pow10: 'POW10' }[e.fn] || 'ABS' }, inputs: { NUM: val(e.a) } } };
          case 'api': b = apiBlockJson(e); return { block: b };
          case 'fcall': return { block: { type: 'procedures_callreturn', extraState: { name: e.name, params: funcParams(e.name) }, inputs: argInputs(e.args) } };
          case 'bin': {
            var op = e.op;
            if (op === '%') return { block: { type: 'math_modulo', inputs: { DIVIDEND: val(e.a), DIVISOR: val(e.b) } } };
            if (op === '&&' || op === '||') return { block: { type: 'logic_operation', fields: { OP: op === '&&' ? 'AND' : 'OR' }, inputs: { A: val(e.a), B: val(e.b) } } };
            var cmp = { '==': 'EQ', '!=': 'NEQ', '<': 'LT', '<=': 'LTE', '>': 'GT', '>=': 'GTE' }[op];
            if (cmp) return { block: { type: 'logic_compare', fields: { OP: cmp }, inputs: { A: val(e.a), B: val(e.b) } } };
            if (op === '+' && (e.a.k === 'str' || e.b.k === 'str' || isJoin(e.a))) {
              var items = flattenJoin(e); var inputs = {};
              items.forEach(function (it, i) { inputs['ADD' + i] = val(it); });
              return { block: { type: 'text_join', extraState: { itemCount: items.length }, inputs: inputs } };
            }
            return { block: { type: 'math_arithmetic', fields: { OP: { '+': 'ADD', '-': 'MINUS', '*': 'MULTIPLY', '/': 'DIVIDE', '**': 'POWER' }[op] || 'ADD' }, inputs: { A: val(e.a), B: val(e.b) } } };
          }
        }
        return { block: { type: 'math_number', fields: { NUM: 0 } } };
      }
      function isJoin(e) { return e.k === 'bin' && e.op === '+' && (e.a.k === 'str' || e.b.k === 'str' || isJoin(e.a)); }
      function flattenJoin(e) { if (e.k === 'bin' && e.op === '+' && isJoin(e)) return flattenJoin(e.a).concat([e.b]); return [e]; }
      var funcs = {}; prog.funcs.forEach(function (f) { funcs[f.name] = f; });
      function funcParams(name) { return funcs[name] ? funcs[name].params : []; }
      function argInputs(args) { var o = {}; args.forEach(function (a, i) { o['ARG' + i] = val(a); }); return o; }
      function apiBlockJson(e) {
        var a = API[e.fn], b = { type: 'igs_' + a.id, fields: {}, inputs: {} };
        (a.args || []).forEach(function (arg, i) {
          var x = e.args[i];
          if (arg.type === 'key' || arg.type === 'color' || arg.type === 'choice') b.fields['A' + i] = x && x.k === 'str' ? x.v : '';
          else { var v = val(x); if (arg.type === 'num' && x && x.k === 'num') v = N(x.v); else if (arg.type === 'str' && x && x.k === 'str') v = { shadow: { type: 'text', fields: { TEXT: x.v } } }; b.inputs['A' + i] = v; }
        });
        return b;
      }
      function chain(list) {
        var first = null, prev = null;
        list.forEach(function (s) { var b = stmtBlock(s); if (!b) return; if (!first) first = b; else prev.next = { block: b }; prev = b; });
        return first;
      }
      function stmtInput(list) { var c = chain(list); return c ? { block: c } : undefined; }
      function stmtBlock(s) {
        switch (s.k) {
          case 'apistmt': return apiBlockJson(s);
          case 'wait': return { type: 'igs_wait', inputs: { SECS: s.a.k === 'num' ? N(s.a.v) : val(s.a) } };
          case 'broadcast': return { type: 'igs_broadcast', fields: { MSG: s.msg } };
          case 'forever': return { type: 'igs_forever', inputs: { DO: stmtInput(s.body) } };
          case 'repeat': return { type: 'controls_repeat_ext', inputs: { TIMES: s.n.k === 'num' ? N(s.n.v) : val(s.n), DO: stmtInput(s.body) } };
          case 'while': return { type: 'controls_whileUntil', fields: { MODE: 'WHILE' }, inputs: { BOOL: val(s.c), DO: stmtInput(s.body) } };
          case 'until': return { type: 'controls_whileUntil', fields: { MODE: 'UNTIL' }, inputs: { BOOL: val(s.c), DO: stmtInput(s.body) } };
          case 'for': return { type: 'controls_for', fields: { VAR: { id: vid(s.v) } }, inputs: { FROM: val(s.from), TO: val(s.to), BY: val(s.by), DO: stmtInput(s.body) } };
          case 'if': {
            var inputs = {};
            s.branches.forEach(function (br, i) { inputs['IF' + i] = val(br.c); var d = stmtInput(br.body); if (d) inputs['DO' + i] = d; });
            if (s.els) { var el = stmtInput(s.els); if (el) inputs.ELSE = el; }
            return { type: 'controls_if', extraState: { elseIfCount: s.branches.length - 1, hasElse: !!s.els }, inputs: inputs };
          }
          case 'set': return { type: 'variables_set', fields: { VAR: { id: vid(s.v) } }, inputs: { VALUE: val(s.a) } };
          case 'change': return { type: 'math_change', fields: { VAR: { id: vid(s.v) } }, inputs: { DELTA: s.a.k === 'num' ? N(s.a.v) : val(s.a) } };
          case 'call': return { type: 'procedures_callnoreturn', extraState: { name: s.name, params: funcParams(s.name) }, inputs: argInputs(s.args) };
          case 'return': return { type: 'procedures_ifreturn', extraState: { hasReturnValue: !!s.a }, inputs: s.a ? { CONDITION: { block: { type: 'logic_boolean', fields: { BOOL: 'TRUE' } } }, VALUE: val(s.a) } : { CONDITION: { block: { type: 'logic_boolean', fields: { BOOL: 'TRUE' } } } } };
        }
        return null;
      }
      var top = [], y = 20;
      prog.funcs.forEach(function (f) {
        f.params.forEach(vid);
        var b = { type: f.returns ? 'procedures_defreturn' : 'procedures_defnoreturn', x: 20, y: y, fields: { NAME: f.name }, extraState: { params: f.params.map(function (p) { return { name: p, id: vid(p) }; }) }, inputs: {} };
        var st = stmtInput(f.body); if (st) b.inputs.STACK = st; if (f.returns) b.inputs.RETURN = val(f.returns);
        top.push(b); y += 60 + 40 * countStmts(f.body);
      });
      prog.threads.forEach(function (th) {
        var b = { type: 'igs_on_' + th.event, x: 20, y: y, fields: {}, inputs: {} };
        if (th.event === 'key') b.fields.KEY = th.arg; if (th.event === 'message') b.fields.MSG = th.arg;
        var st = stmtInput(th.body); if (st) b.inputs.DO = st;
        top.push(b); y += 70 + 40 * countStmts(th.body);
      });
      return { blocks: { languageVersion: 0, blocks: top }, variables: varList };
    }
    function countStmts(list) { var n = 0; (list || []).forEach(function (s) { n += 1; if (s.body) n += countStmts(s.body); if (s.branches) s.branches.forEach(function (b) { n += countStmts(b.body); }); if (s.els) n += countStmts(s.els); }); return n; }

    /* ======================================================================
       Intérprete por hilos (generadores): sin eval, con límites
       ====================================================================== */
    function Runtime(opts) {
      this.opts = opts; this.threads = []; this.vars = {}; this.funcs = {}; this.running = false; this.prog = null; this.steps = 0;
    }
    Runtime.prototype.load = function (prog) {
      var self = this; this.prog = prog; this.funcs = {};
      prog.funcs.forEach(function (f) { self.funcs[f.name] = f; });
      this.vars = {}; prog.vars.forEach(function (v) { self.vars[v] = 0; });
    };
    Runtime.prototype.start = function () {
      var self = this; this.threads = []; this.running = true; this.t = 0;
      this.prog.threads.forEach(function (th) { if (th.event === 'start') self.spawn(th); });
    };
    Runtime.prototype.stop = function () { this.running = false; this.threads = []; };
    Runtime.prototype.fire = function (event, arg) {
      if (!this.running) return;
      var self = this;
      this.prog.threads.forEach(function (th) {
        if (th.event !== event || (arg !== undefined && th.arg !== arg)) return;
        /* Si el mismo guion ya se está ejecutando, vuelve a empezar (como en Scratch). */
        self.threads = self.threads.filter(function (x) { return x.src !== th; });
        self.spawn(th);
      });
    };
    Runtime.prototype.spawn = function (th) {
      var self = this, gen = self.execList(th.body, { locals: null });
      this.threads.push({ src: th, gen: gen, wake: 0, done: false });
    };
    Runtime.prototype.tick = function (now) {
      /* Cada hilo avanza hasta ceder (fin de vuelta de bucle o espera). Límite de operaciones por fotograma. */
      if (!this.running) return;
      var self = this;
      this.threads.forEach(function (th) {
        if (th.done || th.wake > now) return;
        self.budget = 20000;
        try {
          var r = th.gen.next();
          if (r.done) th.done = true;
          else if (r.value && r.value.wait) th.wake = now + r.value.wait * 1000;
        } catch (err) {
          th.done = true;
          if (err && err.igsUser) self.opts.onError(err.message); else { self.opts.onError(t('errRuntime')); if (root.console) console.error(err); }
        }
      });
      this.threads = this.threads.filter(function (x) { return !x.done; });
      if (!this.threads.length && this.opts.onIdle) this.opts.onIdle();
    };
    function UserError(msg) { this.message = msg; this.igsUser = true; }
    Runtime.prototype.count = function () { this.budget -= 1; if (this.budget < 0) throw new UserError(t('errTooLong')); };
    Runtime.prototype.lookup = function (name, env) {
      if (env.locals && Object.prototype.hasOwnProperty.call(env.locals, name)) return env.locals[name];
      if (Object.prototype.hasOwnProperty.call(this.vars, name)) return this.vars[name];
      throw new UserError(t('errUnknownVarRun', { name: name }));
    };
    Runtime.prototype.assign = function (name, value, env) {
      if (env.locals && Object.prototype.hasOwnProperty.call(env.locals, name)) env.locals[name] = value; else this.vars[name] = value;
      if (this.opts.onVar) this.opts.onVar(name, value);
    };
    Runtime.prototype.evalExpr = function (e, env) {
      this.count();
      switch (e.k) {
        case 'num': case 'str': case 'bool': return e.v;
        case 'var': return this.lookup(e.name, env);
        case 'not': return !this.evalExpr(e.a, env);
        case 'random': {
          var a = Number(this.evalExpr(e.a, env)), b = Number(this.evalExpr(e.b, env)), lo = Math.min(a, b), hi = Math.max(a, b);
          if (Number.isInteger(lo) && Number.isInteger(hi)) return lo + Math.floor(Math.random() * (hi - lo + 1));
          return lo + Math.random() * (hi - lo);
        }
        case 'math': {
          var x = Number(this.evalExpr(e.a, env));
          switch (e.fn) { case 'neg': return -x; case 'pow10': return Math.pow(10, x); case 'log10': return Math.log10(x); default: return Math[e.fn](x); }
        }
        case 'bin': {
          if (e.op === '&&') return this.evalExpr(e.a, env) && this.evalExpr(e.b, env);
          if (e.op === '||') return this.evalExpr(e.a, env) || this.evalExpr(e.b, env);
          var l = this.evalExpr(e.a, env), r = this.evalExpr(e.b, env);
          switch (e.op) {
            case '+': return (typeof l === 'string' || typeof r === 'string') ? String(l) + String(r) : Number(l) + Number(r);
            case '-': return Number(l) - Number(r); case '*': return Number(l) * Number(r);
            case '/': return Number(r) === 0 ? 0 : Number(l) / Number(r); case '%': return Number(r) === 0 ? 0 : ((Number(l) % Number(r)) + Number(r)) % Number(r);
            case '**': return Math.pow(Number(l), Number(r));
            case '==': return l == r; case '!=': return l != r; /* eslint-disable-line eqeqeq */
            case '<': return l < r; case '<=': return l <= r; case '>': return l > r; case '>=': return l >= r;
          }
          return 0;
        }
        case 'api': return this.opts.callValue(e.fn, e.args.map(function (a) { return this.evalExpr(a, env); }, this));
        case 'fcall': {
          /* Funciones con resultado: se ejecutan de golpe (sin esperas dentro). */
          var f = this.funcs[e.name]; if (!f) throw new UserError(t('errUnknownFn', { name: e.name }));
          var locals = {}; f.params.forEach(function (p, i) { locals[p] = this.evalExpr(e.args[i] || { k: 'num', v: 0 }, env); }, this);
          var sub = { locals: locals, depth: (env.depth || 0) + 1 };
          if (sub.depth > 60) throw new UserError(t('errRecursion'));
          var g = this.execList(f.body, sub), step;
          do { step = g.next(); if (!step.done && step.value && step.value.ret !== undefined) return step.value.ret; } while (!step.done);
          return f.returns ? this.evalExpr(f.returns, sub) : 0;
        }
      }
      return 0;
    };
    Runtime.prototype.execList = function* (list, env) {
      for (var i = 0; i < list.length; i++) {
        var r = yield* this.exec(list[i], env);
        if (r && r.ret !== undefined) return r;
      }
      return null;
    };
    Runtime.prototype.exec = function* (s, env) {
      this.count();
      if (s.id && this.opts.onStep) this.opts.onStep(s.id);
      var r;
      switch (s.k) {
        case 'apistmt': {
          var args = s.args.map(function (a) { return this.evalExpr(a, env); }, this);
          var res = this.opts.callStmt(s.fn, args);
          if (res && res.wait) yield { wait: res.wait };
          else if (res && res.until) { while (!res.until()) yield { wait: 0 }; }
          return null;
        }
        case 'wait': { var sec = Math.max(0, Math.min(3600, Number(this.evalExpr(s.a, env)) || 0)); yield { wait: sec }; return null; }
        case 'broadcast': if (this.opts.broadcast) this.opts.broadcast(s.msg); else this.fire('message', s.msg); return null;
        case 'forever': while (true) { r = yield* this.execList(s.body, env); if (r && r.ret !== undefined) return r; yield { wait: 0 }; }
        case 'repeat': {
          var n = Math.floor(Number(this.evalExpr(s.n, env)) || 0);
          for (var i = 0; i < n; i++) { r = yield* this.execList(s.body, env); if (r && r.ret !== undefined) return r; yield { wait: 0 }; }
          return null;
        }
        case 'while': while (this.evalExpr(s.c, env)) { r = yield* this.execList(s.body, env); if (r && r.ret !== undefined) return r; yield { wait: 0 }; } return null;
        case 'until': while (!this.evalExpr(s.c, env)) { r = yield* this.execList(s.body, env); if (r && r.ret !== undefined) return r; yield { wait: 0 }; } return null;
        case 'for': {
          var from = Number(this.evalExpr(s.from, env)), to = Number(this.evalExpr(s.to, env)), by = Math.abs(Number(this.evalExpr(s.by, env))) || 1;
          if (from <= to) for (var v = from; v <= to; v += by) { this.assign(s.v, v, env); r = yield* this.execList(s.body, env); if (r && r.ret !== undefined) return r; yield { wait: 0 }; }
          else for (var w = from; w >= to; w -= by) { this.assign(s.v, w, env); r = yield* this.execList(s.body, env); if (r && r.ret !== undefined) return r; yield { wait: 0 }; }
          return null;
        }
        case 'if': {
          for (var b = 0; b < s.branches.length; b++) {
            if (this.evalExpr(s.branches[b].c, env)) return yield* this.execList(s.branches[b].body, env);
          }
          if (s.els) return yield* this.execList(s.els, env);
          return null;
        }
        case 'set': this.assign(s.v, this.evalExpr(s.a, env), env); return null;
        case 'change': this.assign(s.v, Number(this.lookup(s.v, env)) + Number(this.evalExpr(s.a, env)), env); return null;
        case 'call': {
          var f = this.funcs[s.name]; if (!f) throw new UserError(t('errUnknownFn', { name: s.name }));
          var locals = {}; f.params.forEach(function (p, k) { locals[p] = this.evalExpr(s.args[k] || { k: 'num', v: 0 }, env); }, this);
          var sub = { locals: locals, depth: (env.depth || 0) + 1 };
          if (sub.depth > 60) throw new UserError(t('errRecursion'));
          yield* this.execList(f.body, sub);
          return null;
        }
        case 'return': return { ret: s.a ? this.evalExpr(s.a, env) : 0 };
      }
      return null;
    };

    /* ======================================================================
       Interfaz: pestañas Bloques · JavaScript · Python
       ====================================================================== */
    var pane = h('section', { class: 'igs-code', 'aria-label': t('codeArea') });
    var tabs = h('div', { class: 'igs-tabs', role: 'tablist', 'aria-label': t('codeViews') });
    var panels = {};
    var TAB_LIST = [['blocks', t('tabBlocks')], ['js', 'JavaScript'], ['py', 'Python']];
    TAB_LIST.forEach(function (tb, i) {
      var id = 'igs-tab-' + tb[0];
      var b = h('button', { type: 'button', role: 'tab', id: id, 'aria-selected': String(i === 0), 'aria-controls': id + '-panel', tabindex: i === 0 ? '0' : '-1', text: tb[1] });
      b.addEventListener('click', function () { selectTab(tb[0], true); });
      tabs.appendChild(b);
      panels[tb[0]] = h('div', { class: 'igs-tabpanel igs-tabpanel-' + tb[0], role: 'tabpanel', id: id + '-panel', 'aria-labelledby': id, hidden: i !== 0 });
    });
    tabs.addEventListener('keydown', function (e) {
      var list = Array.prototype.slice.call(tabs.querySelectorAll('[role=tab]')), i = list.indexOf(document.activeElement); if (i < 0) return;
      var n = e.key === 'ArrowRight' ? (i + 1) % list.length : e.key === 'ArrowLeft' ? (i - 1 + list.length) % list.length : e.key === 'Home' ? 0 : e.key === 'End' ? list.length - 1 : -1;
      if (n < 0) return; e.preventDefault(); list[n].focus(); list[n].click();
    });
    var jsStatus = h('p', { class: 'igs-code-status', role: 'status', 'aria-live': 'polite' });
    var applyBtn = ctx.button(t('applyCode'), { icon: 'blocks' });
    var jsBar = h('div', { class: 'igs-code-bar' }, applyBtn, h('span', { class: 'igs-code-hint', text: t('codeHint') }));
    var blocklyDiv = h('div', { class: 'igs-blockly' });
    var jsHost = h('div', { class: 'igs-cm' }), pyHost = h('div', { class: 'igs-cm' });
    panels.blocks.appendChild(blocklyDiv);
    panels.js.append(jsBar, jsStatus, jsHost);
    panels.py.append(h('p', { class: 'igs-muted', text: t('pyNote') }), pyHost);
    pane.append(tabs, panels.blocks, panels.js, panels.py);

    var current = 'blocks', jsDirty = false, suppress = false;
    var listeners = { change: [], select: [] };

    /* Blockly */
    var theme = Blockly.Theme.defineTheme('iris-green', {
      base: Blockly.Themes.Classic, name: 'iris-green',
      componentStyles: { workspaceBackgroundColour: '#fbfcfe', toolboxBackgroundColour: '#f4f7fa', toolboxForegroundColour: '#172b42', flyoutBackgroundColour: '#e8eef5', flyoutForegroundColour: '#172b42', scrollbarColour: '#91a9bf', insertionMarkerColour: '#5a49a8' },
      fontStyle: { family: 'Atkinson Hyperlegible, Arial, sans-serif', weight: '700', size: 11 }
    });
    var ws = null;
    function selectedBlock() {
      try { return (Blockly.common && Blockly.common.getSelected ? Blockly.common.getSelected() : Blockly.selected) || null; }
      catch (_) { return null; }
    }
    function inject() {
      ws = Blockly.inject(blocklyDiv, {
        toolbox: toolbox(), media: '/assets/vendor/taller/blockly-media/', sounds: false, theme: theme, renderer: 'zelos', trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 0.85, maxScale: 2, minScale: 0.4, pinch: true }, move: { scrollbars: true, drag: true, wheel: false },
        grid: { spacing: 24, length: 2, colour: '#d6e0ea', snap: true }
      });
      ws.addChangeListener(function (ev) {
        if (suppress || ev.isUiEvent) return;
        if (ev.type === Blockly.Events.FINISHED_LOADING) return;
        scheduleSync();
      });
      if (root.ResizeObserver) new ResizeObserver(function () { if (ws && !panels.blocks.hidden) Blockly.svgResize(ws); }).observe(blocklyDiv);
      /* La selección de bloque alimenta el panel Propiedades: se observa en el lienzo
         (clic, teclado o API), porque el nombre del evento de Blockly varía entre versiones. */
      var selTimer = 0, lastSel = null;
      function pollSelection() {
        var cur = selectedBlock();
        var id = cur ? cur.id : null;
        if (id === lastSel) return;
        lastSel = id;
        listeners.select.forEach(function (fn) { fn(); });
      }
      function scheduleSel() { root.clearTimeout(selTimer); selTimer = root.setTimeout(pollSelection, 60); }
      ['pointerup', 'click', 'keyup', 'focusin'].forEach(function (ev) { blocklyDiv.addEventListener(ev, scheduleSel, true); });
      root.setInterval(pollSelection, 700);
    }
    var syncTimer = 0;
    function scheduleSync() { root.clearTimeout(syncTimer); syncTimer = root.setTimeout(function () { syncFromBlocks(); listeners.change.forEach(function (fn) { fn(); }); }, 250); }

    /* CodeMirror */
    var jsView = new CM.EditorView({ doc: '', parent: jsHost, extensions: [CM.basicSetup, CM.javascript(), CM.EditorView.updateListener.of(function (u) {
      if (u.docChanged && !suppress) { jsDirty = true; jsStatus.textContent = t('codeEdited'); }
    }), CM.EditorView.contentAttributes.of({ 'aria-label': t('jsLabel') })] });
    var pyView = new CM.EditorView({ doc: '', parent: pyHost, extensions: [CM.basicSetup, CM.python(), CM.EditorState.readOnly.of(true), CM.EditorView.contentAttributes.of({ 'aria-label': t('pyLabel') })] });
    function setDoc(view, text) { suppress = true; view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }); suppress = false; }

    var lastAst = { vars: [], funcs: [], threads: [], loose: 0 };
    function syncFromBlocks() {
      if (!ws) return;
      var json = Blockly.serialization.workspaces.save(ws);
      lastAst = blocksToAst(json);
      if (!jsDirty) setDoc(jsView, astToJs(lastAst));
      setDoc(pyView, astToPy(lastAst, spec.pyHeader ? spec.pyHeader[LANG] : ''));
    }
    function applyCode() {
      var code = jsView.state.doc.toString();
      try {
        var ast = jsToAst(code);
        var json = astToBlocks(ast);
        suppress = true;
        Blockly.Events.disable();
        try { Blockly.serialization.workspaces.load(json, ws); } finally { Blockly.Events.enable(); suppress = false; }
        jsDirty = false; lastAst = blocksToAst(Blockly.serialization.workspaces.save(ws));
        setDoc(jsView, astToJs(lastAst)); setDoc(pyView, astToPy(lastAst, spec.pyHeader ? spec.pyHeader[LANG] : ''));
        jsStatus.textContent = t('codeApplied'); ctx.announce(t('codeApplied'));
        listeners.change.forEach(function (fn) { fn(); });
        return true;
      } catch (err) {
        var msg = err && err.message ? (err.line ? t('errLine', { n: err.line }) + ' ' : '') + err.message : t('errSyntax');
        jsStatus.textContent = msg; ctx.announce(msg);
        if (!(err instanceof CodeError) && root.console) console.error(err);
        return false;
      }
    }
    applyBtn.addEventListener('click', applyCode);

    function selectTab(id, user) {
      if (id === current) return;
      if (current === 'js' && id === 'blocks' && jsDirty && !applyCode()) { tabs.querySelector('#igs-tab-js').focus(); return; }
      current = id;
      TAB_LIST.forEach(function (tb) {
        var b = tabs.querySelector('#igs-tab-' + tb[0]), on = tb[0] === id;
        b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; panels[tb[0]].hidden = !on;
      });
      if (id === 'blocks' && ws) root.setTimeout(function () { Blockly.svgResize(ws); }, 0);
      if (id === 'js') jsView.requestMeasure();
      if (id === 'py') pyView.requestMeasure();
    }

    function highlight(id) { if (ws && !panels.blocks.hidden) { try { ws.highlightBlock(id); } catch (_) {} } }

    /* Los campos editables de un bloque (números, listas, texto) son pequeños dentro del
       lienzo de bloques. Aquí se ofrecen como controles normales del panel Propiedades:
       es el «control equivalente» que pide el tamaño de objetivo (WCAG 2.2, 2.5.8) y
       encaja con el inspector ligado a la selección de la interfaz R42. */
    function fieldControls(block, out, prefix) {
      var F = ctx.fields, n = 0;
      (block.inputList || []).forEach(function (inp) {
        (inp.fieldRow || []).forEach(function (f) {
          if (!f.EDITABLE || !f.name) return;
          var label = prefix || labelFor(block, inp, f);
          var val = f.getValue();
          var opts = null;
          try { if (f.getOptions) opts = f.getOptions(false); } catch (_) { opts = null; }
          if (opts && opts.length && typeof opts[0] !== 'string') {
            out.push(F.select(label, val, opts.map(function (o) {
              return [typeof o[0] === 'string' ? o[1] : o[1], typeof o[0] === 'string' ? o[0] : String(o[1])];
            }).map(function (pair) { return [pair[0], pair[1]]; }), {
              onChange: function (v) { f.setValue(v); ctx.commit(t('blockChanged')); }
            }));
            n += 1; return;
          }
          if (typeof val === 'number' || /Number/i.test((f.constructor && f.constructor.name) || '') || /^-?\d+(\.\d+)?$/.test(String(val))) {
            out.push(F.number(label, Number(val), { step: 'any', onChange: function (v) { f.setValue(v); ctx.commit(t('blockChanged')); } }));
            n += 1; return;
          }
          out.push(F.text(label, String(val), { max: 120, onChange: function (v) { f.setValue(v); ctx.commit(t('blockChanged')); } }));
          n += 1;
        });
        /* Los valores de un bloque suelen ir en bloques encajados (número, texto…). */
        var child = inp.connection && inp.connection.targetBlock && inp.connection.targetBlock();
        if (child && !child.isShadow_ !== false) { /* se tratan igual los normales y los de sombra */ }
        if (child) n += fieldControls(child, out, labelFor(block, inp, null));
      });
      return n;
    }
    function labelFor(block, inp, f) {
      var texts = [];
      (inp.fieldRow || []).forEach(function (x) { if (!x.EDITABLE && x.getText) { var s2 = String(x.getText() || '').trim(); if (s2) texts.push(s2); } });
      var head = texts.join(' ').trim();
      if (!head && block.toString) head = String(block.toString()).replace(/\s+/g, ' ').slice(0, 40);
      if (f && f.name && !head) head = f.name;
      return head || t('blockTitle');
    }
    function blockFields() {
      var b = selectedBlock(); if (!b || b.isInFlyout || !b.inputList) return null;
      var out = [h('h4', { text: t('blockTitle') }),
        h('p', { class: 'igs-muted', text: String(b.toString ? b.toString() : '').replace(/\s+/g, ' ').slice(0, 90) })];
      var n = fieldControls(b, out, null);
      if (!n) return null;
      out.push(h('p', { class: 'igs-muted', text: t('blockHelp') }));
      return out;
    }

    return {
      pane: pane, mount: function () { inject(); syncFromBlocks(); },
      getState: function () { return ws ? Blockly.serialization.workspaces.save(ws) : { blocks: { languageVersion: 0, blocks: [] } }; },
      setState: function (json) {
        if (!ws) return;
        suppress = true; Blockly.Events.disable();
        try { ws.clear(); Blockly.serialization.workspaces.load(json || { blocks: { languageVersion: 0, blocks: [] } }, ws); }
        finally { Blockly.Events.enable(); suppress = false; }
        jsDirty = false; jsStatus.textContent = ''; syncFromBlocks();
      },
      ast: function () { if (current === 'js' && jsDirty) applyCode(); return lastAst; },
      astFromJs: jsToAst, astToBlocks: astToBlocks, blocksToAst: blocksToAst, astToJs: astToJs, astToPy: astToPy,
      Runtime: Runtime, highlight: highlight, clearHighlight: function () { highlight(null); },
      onChange: function (fn) { listeners.change.push(fn); },
      onSelect: function (fn) { listeners.select.push(fn); },
      blockFields: blockFields, selectedBlock: selectedBlock,
      workspace: function () { return ws; }, selectTab: selectTab, colorName: colorName, colorHex: colorHex, keyName: keyName, KEY_CODE: KEY_CODE, KEYS: KEYS,
      resize: function () { if (ws) Blockly.svgResize(ws); }
    };
  }

  IG.Code = { create: create, COLORS: COLORS, KEYS: KEYS, ident: ident };
})(window);
