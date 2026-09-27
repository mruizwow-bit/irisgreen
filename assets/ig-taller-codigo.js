/* Iris Green · El taller · lenguaje propio para los estudios de programación y robótica.
   Un intérprete propio y seguro: el texto nunca se convierte en código JavaScript (sin eval ni Function).
   Palabras en español o en inglés; el programa se guarda como árbol y se puede ver como bloques o como texto. */
(function (window, document) {
  'use strict';
  var T = window.IGT; if (!T) return;
  var t = T.t, h = T.h;

  var KW = {
    repeat: ['repetir', 'repeat'], while: ['mientras', 'while'], if: ['si', 'if'], else: ['sino', 'else'],
    func: ['funcion', 'función', 'function'], true: ['verdadero', 'true'], false: ['falso', 'false'],
    and: ['y', 'and'], or: ['o', 'or'], not: ['no', 'not'], print: ['escribir', 'print']
  };
  var MATH = {
    azar: { es: 'azar', en: 'random', n: 2 }, raiz: { es: 'raiz', en: 'sqrt', n: 1 }, abs: { es: 'abs', en: 'abs', n: 1 },
    seno: { es: 'seno', en: 'sin', n: 1 }, coseno: { es: 'coseno', en: 'cos', n: 1 }, redondear: { es: 'redondear', en: 'round', n: 1 },
    min: { es: 'minimo', en: 'min', n: 2 }, max: { es: 'maximo', en: 'max', n: 2 }
  };
  var MATH_ALIASES = { 'raíz': 'raiz', 'mínimo': 'min', 'máximo': 'max' };

  function norm(w) { return String(w).toLowerCase(); }
  function kwIs(tok, k) { return tok && tok.type === 'id' && KW[k].indexOf(norm(tok.v)) >= 0; }
  function isKeyword(w) { w = norm(w); return Object.keys(KW).some(function (k) { return KW[k].indexOf(w) >= 0; }); }

  function Spec(cfg) {
    var self = this; this.lang = T.lang; this.commands = cfg.commands; this.sensors = cfg.sensors || [];
    this.cmdByWord = {}; this.sensorByWord = {}; this.cmdById = {}; this.sensorById = {};
    this.commands.forEach(function (c) { self.cmdById[c.id] = c; c.es.concat(c.en).forEach(function (w) { self.cmdByWord[norm(w)] = c; }); });
    this.sensors.forEach(function (c) { self.sensorById[c.id] = c; c.es.concat(c.en).forEach(function (w) { self.sensorByWord[norm(w)] = c; }); });
    this.mathByWord = {};
    Object.keys(MATH).forEach(function (k) { self.mathByWord[MATH[k].es] = k; self.mathByWord[MATH[k].en] = k; });
    Object.keys(MATH_ALIASES).forEach(function (a) { self.mathByWord[a] = MATH_ALIASES[a]; });
  }
  Spec.prototype.kw = function (k) { return KW[k][this.lang === 'en' ? KW[k].length - 1 : 0]; };
  Spec.prototype.cmdWord = function (c) { return (this.lang === 'en' ? c.en : c.es)[0]; };
  Spec.prototype.mathWord = function (k) { return MATH[k][this.lang]; };

  /* ---------- Léxico ---------- */
  function CodeError(msg, line) { this.msg = msg; this.line = line; }
  function lex(src) {
    var toks = [], i = 0, line = 1, n = src.length;
    while (i < n) {
      var ch = src[i];
      if (ch === '\n') { toks.push({ type: 'nl', line: line }); line++; i++; continue; }
      if (ch === ' ' || ch === '\t' || ch === '\r') { i++; continue; }
      if (ch === '#') { while (i < n && src[i] !== '\n') i++; continue; }
      if (ch === ';') { toks.push({ type: 'nl', line: line }); i++; continue; }
      if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(src[i + 1] || ''))) {
        var j = i; while (j < n && /[0-9.]/.test(src[j])) j++;
        var num = Number(src.slice(i, j)); if (!isFinite(num)) throw new CodeError(t('cErrNumber'), line);
        toks.push({ type: 'num', v: num, line: line }); i = j; continue;
      }
      if (/[A-Za-z_áéíóúñüÁÉÍÓÚÑÜ]/.test(ch)) {
        var k = i; while (k < n && /[A-Za-z0-9_áéíóúñüÁÉÍÓÚÑÜ]/.test(src[k])) k++;
        toks.push({ type: 'id', v: src.slice(i, k), line: line }); i = k; continue;
      }
      if (ch === '"' || ch === '“' || ch === '”' || ch === "'") {
        var close = ch === '“' ? '”' : ch, m = i + 1, s = '';
        while (m < n && src[m] !== close && !(close === '"' && src[m] === '”') && src[m] !== '\n') { s += src[m]; m++; }
        if (m >= n || src[m] === '\n') throw new CodeError(t('cErrString'), line);
        toks.push({ type: 'str', v: s.slice(0, 200), line: line }); i = m + 1; continue;
      }
      var two = src.substr(i, 2);
      if (['==', '!=', '<=', '>=', '≤', '≥', '≠'].indexOf(two) >= 0 || ['≤', '≥', '≠'].indexOf(ch) >= 0) {
        var op = ch === '≤' ? '<=' : ch === '≥' ? '>=' : ch === '≠' ? '!=' : two;
        toks.push({ type: 'op', v: op, line: line }); i += (['≤', '≥', '≠'].indexOf(ch) >= 0 ? 1 : 2); continue;
      }
      if ('+-*/%(){}=<>,×÷'.indexOf(ch) >= 0) { toks.push({ type: 'op', v: ch === '×' ? '*' : ch === '÷' ? '/' : ch, line: line }); i++; continue; }
      throw new CodeError(t('cErrChar', { c: ch }), line);
    }
    toks.push({ type: 'eof', line: line });
    return toks;
  }

  /* ---------- Sintaxis ---------- */
  var uid = 0; function nid() { uid += 1; return 's' + uid; }
  function Parser(toks, spec) { this.toks = toks; this.p = 0; this.spec = spec; }
  Parser.prototype.peek = function (o) { return this.toks[this.p + (o || 0)]; };
  Parser.prototype.next = function () { return this.toks[this.p++]; };
  Parser.prototype.isOp = function (v, o) { var tk = this.peek(o); return tk && tk.type === 'op' && tk.v === v; };
  Parser.prototype.expectOp = function (v) { var tk = this.next(); if (!tk || tk.type !== 'op' || tk.v !== v) throw new CodeError(t('cErrExpected', { x: v }), tk ? tk.line : 0); return tk; };
  Parser.prototype.skipNl = function () { while (this.peek().type === 'nl') this.p++; };
  Parser.prototype.program = function () {
    var out = this.stmts(); if (this.peek().type !== 'eof') throw new CodeError(t('cErrUnexpected', { x: this.peek().v || '}' }), this.peek().line);
    return out;
  };
  Parser.prototype.stmts = function () {
    var out = [];
    for (;;) {
      this.skipNl();
      var tk = this.peek();
      if (tk.type === 'eof' || (tk.type === 'op' && tk.v === '}')) return out;
      out.push(this.stmt());
      var nx = this.peek();
      if (!(nx.type === 'nl' || nx.type === 'eof' || (nx.type === 'op' && nx.v === '}'))) throw new CodeError(t('cErrNewline'), nx.line);
    }
  };
  Parser.prototype.block = function () {
    this.skipNl(); this.expectOp('{'); var body = this.stmts(); this.expectOp('}'); return body;
  };
  Parser.prototype.stmt = function () {
    var tk = this.peek(), sp = this.spec, line = tk.line;
    if (tk.type !== 'id') throw new CodeError(t('cErrStmt'), line);
    if (kwIs(tk, 'repeat')) { this.next(); var n = this.expr(); return { id: nid(), t: 'repeat', n: n, body: this.block(), line: line }; }
    if (kwIs(tk, 'while')) { this.next(); var c = this.expr(); return { id: nid(), t: 'while', cond: c, body: this.block(), line: line }; }
    if (kwIs(tk, 'if')) { this.next(); return this.ifRest(line); }
    if (kwIs(tk, 'func')) {
      this.next(); var nm = this.next(); if (nm.type !== 'id' || isKeyword(nm.v)) throw new CodeError(t('cErrFuncName'), line);
      this.expectOp('('); var params = [];
      if (!this.isOp(')')) { for (;;) { var pt = this.next(); if (pt.type !== 'id' || isKeyword(pt.v)) throw new CodeError(t('cErrParam'), line); params.push(pt.v); if (this.isOp(',')) { this.next(); continue; } break; } }
      this.expectOp(')');
      return { id: nid(), t: 'func', name: nm.v, params: params, body: this.block(), line: line };
    }
    if (kwIs(tk, 'print')) { this.next(); var hasP = this.isOp('('); var e = this.expr(); return { id: nid(), t: 'print', e: e, line: line }; }
    var cmd = sp.cmdByWord[norm(tk.v)];
    if (cmd) {
      this.next(); var args = [];
      if (cmd.args > 1 && this.isOp('(')) {
        this.next(); for (;;) { args.push(this.expr()); if (this.isOp(',')) { this.next(); continue; } break; } this.expectOp(')');
      } else if (cmd.args === 0) { if (this.isOp('(') && this.isOp(')', 1)) { this.next(); this.next(); } }
      else { for (;;) { args.push(this.expr()); if (this.isOp(',')) { this.next(); continue; } break; } }
      if (args.length !== cmd.args) throw new CodeError(t('cErrArgs', { c: tk.v, n: cmd.args }), line);
      return { id: nid(), t: 'cmd', name: cmd.id, args: args, line: line };
    }
    if (this.isOp('=', 1)) {
      if (isKeyword(tk.v) || sp.sensorByWord[norm(tk.v)] || sp.mathByWord[norm(tk.v)]) throw new CodeError(t('cErrVarName', { x: tk.v }), line);
      this.next(); this.next(); return { id: nid(), t: 'set', name: tk.v, e: this.expr(), line: line };
    }
    if (this.isOp('(', 1)) {
      this.next(); this.next(); var cargs = [];
      if (!this.isOp(')')) { for (;;) { cargs.push(this.expr()); if (this.isOp(',')) { this.next(); continue; } break; } }
      this.expectOp(')');
      return { id: nid(), t: 'call', name: tk.v, args: cargs, line: line };
    }
    throw new CodeError(t('cErrUnknown', { x: tk.v }), line);
  };
  Parser.prototype.ifRest = function (line) {
    var c = this.expr(), body = this.block(), save = this.p, els = null;
    this.skipNl();
    var tk = this.peek();
    if (kwIs(tk, 'else')) { this.next(); els = this.elseBody(); }
    else if (kwIs(tk, 'if') && kwIs(this.peek(1), 'not') && (this.isOp('{', 2) || kwIs(this.peek(2), 'if'))) { this.next(); this.next(); els = this.elseBody(); }
    else this.p = save;
    return { id: nid(), t: 'if', cond: c, body: body, els: els, line: line };
  };
  Parser.prototype.elseBody = function () {
    this.skipNl();
    if (kwIs(this.peek(), 'if')) { var ln = this.peek().line; this.next(); return [this.ifRest(ln)]; }
    return this.block();
  };
  /* Expresiones */
  Parser.prototype.expr = function () { return this.or(); };
  Parser.prototype.or = function () { var l = this.and(); while (kwIs(this.peek(), 'or')) { this.next(); l = { k: 'bin', op: 'or', l: l, r: this.and() }; } return l; };
  Parser.prototype.and = function () { var l = this.not(); while (kwIs(this.peek(), 'and')) { this.next(); l = { k: 'bin', op: 'and', l: l, r: this.not() }; } return l; };
  Parser.prototype.not = function () { if (kwIs(this.peek(), 'not')) { this.next(); return { k: 'not', e: this.not() }; } return this.cmp(); };
  Parser.prototype.cmp = function () {
    var l = this.add(), tk = this.peek();
    if (tk.type === 'op' && ['==', '!=', '<', '>', '<=', '>=', '='].indexOf(tk.v) >= 0) { this.next(); l = { k: 'bin', op: tk.v === '=' ? '==' : tk.v, l: l, r: this.add() }; }
    return l;
  };
  Parser.prototype.add = function () { var l = this.mul(); while (this.isOp('+') || this.isOp('-')) { var op = this.next().v; l = { k: 'bin', op: op, l: l, r: this.mul() }; } return l; };
  Parser.prototype.mul = function () { var l = this.unary(); while (this.isOp('*') || this.isOp('/') || this.isOp('%')) { var op = this.next().v; l = { k: 'bin', op: op, l: l, r: this.unary() }; } return l; };
  Parser.prototype.unary = function () { if (this.isOp('-')) { this.next(); return { k: 'neg', e: this.unary() }; } return this.primary(); };
  Parser.prototype.primary = function () {
    var tk = this.next(), sp = this.spec;
    if (!tk) throw new CodeError(t('cErrExpr'), 0);
    if (tk.type === 'num') return { k: 'num', v: tk.v };
    if (tk.type === 'str') return { k: 'str', v: tk.v };
    if (tk.type === 'op' && tk.v === '(') { var e = this.expr(); this.expectOp(')'); return { k: 'par', e: e }; }
    if (tk.type === 'id') {
      if (kwIs(tk, 'true')) return { k: 'bool', v: true };
      if (kwIs(tk, 'false')) return { k: 'bool', v: false };
      var w = norm(tk.v);
      if (sp.sensorByWord[w]) { var s = sp.sensorByWord[w], a = this.callArgs(); if (a.length !== s.args) throw new CodeError(t('cErrArgs', { c: tk.v, n: s.args }), tk.line); return { k: 'sensor', id: s.id, args: a }; }
      if (sp.mathByWord[w] && this.isOp('(')) { var mk = sp.mathByWord[w], ma = this.callArgs(); if (ma.length !== MATH[mk].n) throw new CodeError(t('cErrArgs', { c: tk.v, n: MATH[mk].n }), tk.line); return { k: 'math', id: mk, args: ma }; }
      if (isKeyword(tk.v)) throw new CodeError(t('cErrExpr'), tk.line);
      return { k: 'var', name: tk.v };
    }
    throw new CodeError(t('cErrExpr'), tk.line);
  };
  Parser.prototype.callArgs = function () {
    var a = []; if (!this.isOp('(')) return a; this.next();
    if (!this.isOp(')')) { for (;;) { a.push(this.expr()); if (this.isOp(',')) { this.next(); continue; } break; } }
    this.expectOp(')'); return a;
  };

  function parse(src, spec) {
    try { var p = new Parser(lex(src), spec); return { ok: true, stmts: p.program() }; }
    catch (e) { if (e instanceof CodeError) return { ok: false, error: e }; throw e; }
  }
  function parseExpr(src, spec) {
    try {
      var p = new Parser(lex(String(src)), spec); p.skipNl(); var e = p.expr(); p.skipNl();
      if (p.peek().type !== 'eof') throw new CodeError(t('cErrUnexpected', { x: p.peek().v || '' }), 1);
      return { ok: true, e: e };
    } catch (err) { if (err instanceof CodeError) return { ok: false, error: err }; throw err; }
  }

  /* ---------- Texto ---------- */
  var PREC = { or: 1, and: 2, '==': 3, '!=': 3, '<': 3, '>': 3, '<=': 3, '>=': 3, '+': 4, '-': 4, '*': 5, '/': 5, '%': 5 };
  function exprText(e, sp) {
    if (!e) return '';
    if (e.raw !== undefined) return e.raw;
    switch (e.k) {
      case 'num': return String(Math.round(e.v * 1e6) / 1e6);
      case 'str': return '"' + e.v + '"';
      case 'bool': return sp.kw(e.v ? 'true' : 'false');
      case 'var': return e.name;
      case 'par': return '(' + exprText(e.e, sp) + ')';
      case 'neg': return '-' + exprText(e.e, sp);
      case 'not': return sp.kw('not') + ' ' + exprText(e.e, sp);
      case 'sensor': var s = sp.sensorById[e.id]; return (sp.lang === 'en' ? s.en : s.es)[0] + '(' + e.args.map(function (a) { return exprText(a, sp); }).join(', ') + ')';
      case 'math': return sp.mathWord(e.id) + '(' + e.args.map(function (a) { return exprText(a, sp); }).join(', ') + ')';
      case 'bin':
        var op = e.op === 'or' ? sp.kw('or') : e.op === 'and' ? sp.kw('and') : e.op;
        return exprText(e.l, sp) + ' ' + op + ' ' + exprText(e.r, sp);
    }
    return '';
  }
  function toText(stmts, sp, ind) {
    ind = ind || '';
    return stmts.map(function (s) {
      switch (s.t) {
        case 'cmd': var c = sp.cmdById[s.name]; return ind + sp.cmdWord(c) + (s.args.length ? ' ' + s.args.map(function (a) { return exprText(a, sp); }).join(', ') : '');
        case 'set': return ind + s.name + ' = ' + exprText(s.e, sp);
        case 'print': return ind + sp.kw('print') + ' ' + exprText(s.e, sp);
        case 'repeat': return ind + sp.kw('repeat') + ' ' + exprText(s.n, sp) + ' {\n' + toText(s.body, sp, ind + '  ') + (s.body.length ? '\n' : '') + ind + '}';
        case 'while': return ind + sp.kw('while') + ' ' + exprText(s.cond, sp) + ' {\n' + toText(s.body, sp, ind + '  ') + (s.body.length ? '\n' : '') + ind + '}';
        case 'if':
          var out = ind + sp.kw('if') + ' ' + exprText(s.cond, sp) + ' {\n' + toText(s.body, sp, ind + '  ') + (s.body.length ? '\n' : '') + ind + '}';
          if (s.els) out += ' ' + sp.kw('else') + ' {\n' + toText(s.els, sp, ind + '  ') + (s.els.length ? '\n' : '') + ind + '}';
          return out;
        case 'func': return ind + sp.kw('func') + ' ' + s.name + '(' + s.params.join(', ') + ') {\n' + toText(s.body, sp, ind + '  ') + (s.body.length ? '\n' : '') + ind + '}';
        case 'call': return ind + s.name + '(' + s.args.map(function (a) { return exprText(a, sp); }).join(', ') + ')';
      }
      return '';
    }).join('\n');
  }

  /* ---------- Intérprete ---------- */
  function RunError(msg, node) { this.msg = msg; this.node = node; }
  function Interp(stmts, sp, host, limits) {
    limits = limits || {};
    var maxSteps = limits.steps || 200000, maxDepth = limits.depth || 200, steps = 0, funcs = {};
    function tick(node) { steps += 1; if (steps > maxSteps) throw new RunError(t('cErrTooLong', { n: T.num(maxSteps, 0) }), node); }
    function scan(list) { list.forEach(function (s) { if (s.t === 'func') funcs[norm(s.name)] = s; }); }
    function lookup(env, name, node) {
      var k = norm(name);
      for (var e = env; e; e = e.parent) if (Object.prototype.hasOwnProperty.call(e.vars, k)) return e.vars[k];
      throw new RunError(t('cErrNoVar', { x: name }), node);
    }
    function assign(env, name, v) {
      var k = norm(name);
      for (var e = env; e; e = e.parent) if (Object.prototype.hasOwnProperty.call(e.vars, k)) { e.vars[k] = v; return; }
      env.vars[k] = v;
    }
    function num(v, node) { if (typeof v !== 'number' || !isFinite(v)) throw new RunError(t('cErrNotNumber'), node); return v; }
    function ev(e, env, node) {
      if (!e) throw new RunError(t('cErrExpr'), node);
      if (e.raw !== undefined) throw new RunError(t('cErrBadField'), node);
      tick(node);
      switch (e.k) {
        case 'num': case 'str': case 'bool': return e.v;
        case 'var': return lookup(env, e.name, node);
        case 'par': return ev(e.e, env, node);
        case 'neg': return -num(ev(e.e, env, node), node);
        case 'not': return !ev(e.e, env, node);
        case 'sensor': return host.sensor(e.id, e.args.map(function (a) { return ev(a, env, node); }));
        case 'math':
          var a = e.args.map(function (x) { return num(ev(x, env, node), node); });
          switch (e.id) {
            case 'azar': var lo = Math.ceil(Math.min(a[0], a[1])), hi = Math.floor(Math.max(a[0], a[1])); return lo + Math.floor(host.random() * (hi - lo + 1));
            case 'raiz': if (a[0] < 0) throw new RunError(t('cErrSqrt'), node); return Math.sqrt(a[0]);
            case 'abs': return Math.abs(a[0]);
            case 'seno': return Math.sin(a[0] * Math.PI / 180);
            case 'coseno': return Math.cos(a[0] * Math.PI / 180);
            case 'redondear': return Math.round(a[0]);
            case 'min': return Math.min(a[0], a[1]);
            case 'max': return Math.max(a[0], a[1]);
          }
          return 0;
        case 'bin':
          if (e.op === 'and') return !!ev(e.l, env, node) && !!ev(e.r, env, node);
          if (e.op === 'or') return !!ev(e.l, env, node) || !!ev(e.r, env, node);
          var l = ev(e.l, env, node), r = ev(e.r, env, node);
          if (e.op === '==') return l === r || (typeof l === 'number' && typeof r === 'number' && Math.abs(l - r) < 1e-9);
          if (e.op === '!=') return !(l === r || (typeof l === 'number' && typeof r === 'number' && Math.abs(l - r) < 1e-9));
          if (e.op === '+' && (typeof l === 'string' || typeof r === 'string')) return (String(l) + String(r)).slice(0, 500);
          l = num(l, node); r = num(r, node);
          switch (e.op) {
            case '+': return l + r; case '-': return l - r; case '*': return l * r;
            case '/': if (r === 0) throw new RunError(t('cErrDiv0'), node); return l / r;
            case '%': if (r === 0) throw new RunError(t('cErrDiv0'), node); return ((l % r) + r) % r;
            case '<': return l < r; case '>': return l > r; case '<=': return l <= r; case '>=': return l >= r;
          }
      }
      throw new RunError(t('cErrExpr'), node);
    }
    function* list(stmts, env, depth) { for (var i = 0; i < stmts.length; i++) yield* one(stmts[i], env, depth); }
    function* one(s, env, depth) {
      tick(s);
      switch (s.t) {
        case 'cmd':
          var args = s.args.map(function (a) { return ev(a, env, s); });
          yield { node: s };
          var g = host.exec(s.name, args, s);
          if (g && typeof g.next === 'function') yield* g;
          return;
        case 'print': host.print(fmt(ev(s.e, env, s))); yield { node: s, soft: true }; return;
        case 'set': assign(env, s.name, ev(s.e, env, s)); return;
        case 'repeat':
          var n = num(ev(s.n, env, s), s); n = Math.floor(n); if (n > 100000) throw new RunError(t('cErrTooMany'), s);
          for (var i = 0; i < n; i++) { yield { node: s, soft: true }; yield* list(s.body, env, depth); }
          return;
        case 'while':
          while (ev(s.cond, env, s)) { yield { node: s, soft: true }; yield* list(s.body, env, depth); }
          return;
        case 'if':
          if (ev(s.cond, env, s)) yield* list(s.body, env, depth); else if (s.els) yield* list(s.els, env, depth);
          return;
        case 'func': return;
        case 'call':
          var f = funcs[norm(s.name)]; if (!f) throw new RunError(t('cErrNoFunc', { x: s.name }), s);
          if (f.params.length !== s.args.length) throw new RunError(t('cErrCallArgs', { x: s.name, n: f.params.length }), s);
          if (depth >= maxDepth) throw new RunError(t('cErrDepth', { n: T.num(maxDepth, 0) }), s);
          var local = { vars: {}, parent: globals };
          f.params.forEach(function (p, j) { local.vars[norm(p)] = ev(s.args[j], env, s); });
          yield { node: s, soft: true };
          yield* list(f.body, local, depth + 1);
          return;
      }
    }
    function fmt(v) { return typeof v === 'number' ? T.num(v, 4) : typeof v === 'boolean' ? sp.kw(v ? 'true' : 'false') : String(v); }
    var globals = { vars: {}, parent: null };
    scan(stmts);
    var gen = list(stmts, globals, 0);
    this.next = function () { return gen.next(); };
    this.steps = function () { return steps; };
    this.RunError = RunError;
  }

  /* ---------- Análisis del programa (para los retos) ---------- */
  function analyze(stmts) {
    var info = { blocks: 0, repeat: 0, while: 0, if: 0, set: 0, funcs: 0, params: 0, calls: 0, recursion: false, vars: {}, cmds: {} };
    function walk(list, inFunc) {
      list.forEach(function (s) {
        info.blocks++;
        if (s.t === 'repeat') info.repeat++; if (s.t === 'while') info.while++; if (s.t === 'if') info.if++;
        if (s.t === 'set') { info.set++; info.vars[norm(s.name)] = 1; }
        if (s.t === 'cmd') info.cmds[s.name] = (info.cmds[s.name] || 0) + 1;
        if (s.t === 'func') { info.funcs++; info.params += s.params.length; walk(s.body, norm(s.name)); return; }
        if (s.t === 'call') { info.calls++; if (inFunc && norm(s.name) === inFunc) info.recursion = true; }
        if (s.body) walk(s.body, inFunc); if (s.els) walk(s.els, inFunc);
      });
    }
    walk(stmts, null); return info;
  }

  /* ---------- Editor de bloques + texto + ejecución ---------- */
  function Editor(cfg) {
    var sp = cfg.spec, self = this;
    var prog = [];
    var sel = { list: null, index: -1 }; /* punto de inserción: después de list[index] (index -1 = al principio) */
    var view = 'blocks';
    var root = h('div', { class: 'igt-code-editor' });
    var tabs = h('div', { class: 'igt-tabs', role: 'group', 'aria-label': t('cView') });
    var bBlocks = T.btn(t('cBlocks'), { cls: 'igt-chip', pressed: true, onClick: function () { setView('blocks'); } });
    var bText = T.btn(t('cText'), { cls: 'igt-chip', pressed: false, onClick: function () { setView('text'); } });
    tabs.appendChild(bBlocks); tabs.appendChild(bText);
    var palette = h('div', { class: 'igt-palette-wrap' });
    var blocksBox = h('div', { class: 'igt-blocks-box' });
    var textArea = h('textarea', { class: 'igt-code igt-code-area', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', id: cfg.idPrefix + '-text', 'aria-describedby': cfg.idPrefix + '-texthelp', 'data-igt-undo-ok': null });
    var textHelp = h('p', { class: 'igt-note', id: cfg.idPrefix + '-texthelp', text: t('cTextHelp') });
    var applyBtn = T.btn(t('cApplyText'), { cls: 'primary', onClick: applyText });
    var textErr = h('p', { class: 'igt-err', hidden: true, role: 'alert' });
    var textBox = h('div', { class: 'igt-text-box', hidden: true },
      h('label', { class: 'igt-field', for: cfg.idPrefix + '-text' }, t('cTextLabel')), textArea, textHelp, h('div', { class: 'igt-bar' }, applyBtn), textErr);
    root.appendChild(tabs); root.appendChild(palette); root.appendChild(blocksBox); root.appendChild(textBox);
    var textDirty = false;
    textArea.addEventListener('input', function () { textDirty = true; });

    var history = cfg.history;
    function snap() { return cfg.snapshot ? cfg.snapshot() : JSON.stringify(prog); }

    /* Paleta */
    var groups = [
      { k: 'move', items: sp.commands.map(function (c) { return { label: sp.cmdWord(c), make: function () { return { id: nid(), t: 'cmd', name: c.id, args: (c.defaults || []).map(function (d) { return parseExpr(String(d), sp).e; }) }; } }; }) },
      { k: 'control', items: [
        { label: sp.kw('repeat'), make: function () { return { id: nid(), t: 'repeat', n: { k: 'num', v: 4 }, body: [] }; } },
        { label: sp.kw('while'), make: function () { return { id: nid(), t: 'while', cond: parseExpr(cfg.defaultCond || '1 < 2', sp).e, body: [] }; } },
        { label: sp.kw('if'), make: function () { return { id: nid(), t: 'if', cond: parseExpr(cfg.defaultCond || '1 < 2', sp).e, body: [], els: null }; } } ] },
      { k: 'data', items: [
        { label: t('cSetVar'), make: function () { return { id: nid(), t: 'set', name: 'x', e: { k: 'num', v: 10 } }; } },
        { label: sp.kw('print'), make: function () { return { id: nid(), t: 'print', e: { k: 'str', v: t('cHello') } }; } } ] },
      { k: 'func', items: [
        { label: t('cDefFunc'), make: function () { return { id: nid(), t: 'func', name: t('cFuncDefault'), params: ['n'], body: [] }; } },
        { label: t('cCallFunc'), make: function () { var f = firstFunc(); return { id: nid(), t: 'call', name: f ? f.name : t('cFuncDefault'), args: f ? f.params.map(function () { return { k: 'num', v: 1 }; }) : [{ k: 'num', v: 1 }] }; } } ] }
    ];
    function firstFunc() { for (var i = 0; i < prog.length; i++) if (prog[i].t === 'func') return prog[i]; return null; }
    groups.forEach(function (g) {
      var row = h('div', { class: 'igt-palette', role: 'group', 'aria-label': t('cGroup_' + g.k) }, h('span', { class: 'igt-note igt-pal-k', text: t('cGroup_' + g.k) }));
      g.items.forEach(function (it) { row.appendChild(T.btn('+ ' + it.label, { onClick: function () { insert(it.make()); } })); });
      palette.appendChild(row);
    });
    var insertInfo = h('p', { class: 'igt-note', 'aria-live': 'off' });
    palette.appendChild(insertInfo);

    function insert(node) {
      var before = snap();
      var list = sel.list || prog, idx = sel.list ? sel.index : prog.length - 1;
      list.splice(idx + 1, 0, node);
      sel = { list: list, index: idx + 1 };
      history.commit(before); render(); focusBlock(node.id);
      T.say(t('cInserted', { b: blockName(node) }));
    }
    function blockName(s) {
      switch (s.t) { case 'cmd': return sp.cmdWord(sp.cmdById[s.name]); case 'set': return t('cSetVar'); case 'print': return sp.kw('print'); case 'func': return t('cDefFunc'); case 'call': return s.name; default: return sp.kw(s.t); }
    }
    function findParent(id, list) {
      list = list || prog;
      for (var i = 0; i < list.length; i++) {
        var s = list[i]; if (s.id === id) return { list: list, index: i };
        var r = (s.body && findParent(id, s.body)) || (s.els && findParent(id, s.els)); if (r) return r;
      }
      return null;
    }
    function findOwner(list, parentList) {
      parentList = parentList || prog;
      for (var i = 0; i < parentList.length; i++) {
        var s = parentList[i];
        if (s.body === list || s.els === list) return { list: parentList, index: i };
        var r = (s.body && findOwner(list, s.body)) || (s.els && findOwner(list, s.els)); if (r) return r;
      }
      return null;
    }
    function op(id, what) {
      var p = findParent(id); if (!p) return;
      var before = snap(), s = p.list[p.index], ok = true;
      if (what === 'up') { if (p.index === 0) ok = false; else { p.list.splice(p.index, 1); p.list.splice(p.index - 1, 0, s); } }
      else if (what === 'down') { if (p.index >= p.list.length - 1) ok = false; else { p.list.splice(p.index, 1); p.list.splice(p.index + 1, 0, s); } }
      else if (what === 'out') { var own = findOwner(p.list); if (!own) ok = false; else { p.list.splice(p.index, 1); own.list.splice(own.index + 1, 0, s); } }
      else if (what === 'in') {
        var prev = p.list[p.index - 1];
        if (!prev || !prev.body) ok = false; else { p.list.splice(p.index, 1); (prev.els && prev.els.length ? prev.els : prev.body).push(s); }
      }
      else if (what === 'del') { p.list.splice(p.index, 1); sel = { list: p.list, index: p.index - 1 }; }
      else if (what === 'dup') { var cp = cloneNode(s); p.list.splice(p.index + 1, 0, cp); }
      if (!ok) { T.say(t('cCannot')); return; }
      history.commit(before); render();
      if (what !== 'del') focusBlock(what === 'dup' ? p.list[p.index + 1].id : id, what === 'up' || what === 'down' || what === 'out' || what === 'in' ? what : null);
      T.say(t('cOp_' + what));
    }
    function cloneNode(s) { var c = JSON.parse(JSON.stringify(s)); (function re(n) { n.id = nid(); (n.body || []).forEach(re); (n.els || []).forEach(re); })(c); return c; }
    function focusBlock(id, action) {
      var el = blocksBox.querySelector('[data-bid="' + id + '"] ' + (action ? '[data-act="' + action + '"]' : '.igt-block-name'));
      if (!el || el.disabled) el = blocksBox.querySelector('[data-bid="' + id + '"] .igt-block-name');
      if (el) el.focus();
    }

    /* Campos de expresión */
    function exprField(node, key, label, idx) {
      var cur = idx === undefined ? node[key] : node[key][idx];
      var inp = h('input', { type: 'text', class: 'igt-code' + (cur && cur.k === 'num' ? ' num' : ''), value: exprText(cur, sp), 'aria-label': label, spellcheck: 'false', autocomplete: 'off' });
      if (cur && cur.raw !== undefined) inp.setAttribute('aria-invalid', 'true');
      inp.addEventListener('change', function () {
        var before = snap(), r = parseExpr(inp.value, sp), val = r.ok ? r.e : { raw: inp.value };
        if (idx === undefined) node[key] = val; else node[key][idx] = val;
        inp.setAttribute('aria-invalid', r.ok ? 'false' : 'true');
        history.commit(before);
        if (!r.ok) T.say(t('cFieldError', { m: r.error.msg })); else textArea.value = toText(prog, sp);
      });
      return inp;
    }
    function nameField(node, key, label, isParams) {
      var inp = h('input', { type: 'text', class: 'igt-code', value: isParams ? node.params.join(', ') : node[key], 'aria-label': label, spellcheck: 'false', autocomplete: 'off' });
      inp.addEventListener('change', function () {
        var before = snap(), v = inp.value.trim();
        if (isParams) { var ps = v ? v.split(/\s*,\s*/) : []; if (ps.every(function (p) { return /^[A-Za-z_áéíóúñü][A-Za-z0-9_áéíóúñü]*$/.test(p) && !isKeyword(p); })) { node.params = ps; inp.removeAttribute('aria-invalid'); } else { inp.setAttribute('aria-invalid', 'true'); T.say(t('cErrParam')); return; } }
        else { if (!/^[A-Za-z_áéíóúñü][A-Za-z0-9_áéíóúñü]*$/.test(v) || isKeyword(v)) { inp.setAttribute('aria-invalid', 'true'); T.say(t('cErrVarName', { x: v })); return; } node[key] = v; inp.removeAttribute('aria-invalid'); }
        history.commit(before); textArea.value = toText(prog, sp);
      });
      return inp;
    }
    function slot(list, index, label) {
      var active = sel.list === list && sel.index === index;
      var b = h('button', { type: 'button', class: 'igt-slot' + (active ? ' on' : ''), 'aria-pressed': String(active), text: label });
      b.addEventListener('click', function () { sel = { list: list, index: index }; render(); var s2 = blocksBox.querySelector('.igt-slot.on'); if (s2) s2.focus(); T.say(t('cInsertHere')); });
      return b;
    }
    function renderList(list, depth) {
      var ul = h('ul', { class: 'igt-blocks', role: 'list' });
      if (!list.length) ul.appendChild(h('li', { class: 'igt-empty-slot' }, slot(list, -1, t('cEmptyBody'))));
      list.forEach(function (s, i) {
        var active = sel.list === list && sel.index === i;
        var kind = s.t === 'cmd' ? (sp.cmdById[s.name].kind || 'move') : s.t === 'set' || s.t === 'print' ? 'var' : s.t === 'func' || s.t === 'call' ? 'func' : 'control';
        var li = h('li', { class: 'igt-block' + (active ? ' sel' : '') + (running === s.id ? ' run' : ''), 'data-bid': s.id, 'data-kind': kind });
        var nameBtn = h('button', { type: 'button', class: 'igt-block-name', 'aria-pressed': String(active), 'aria-label': t('cBlockLabel', { n: i + 1, b: blockName(s) }), text: blockName(s) });
        nameBtn.addEventListener('click', function () { sel = { list: list, index: i }; render(); focusBlock(s.id); updateInsertInfo(); });
        li.appendChild(nameBtn);
        if (s.t === 'cmd') { var c = sp.cmdById[s.name]; s.args.forEach(function (a, j) { li.appendChild(exprField(s, 'args', ((sp.lang === 'en' ? c.argEn : c.argEs) || [])[j] || t('cValue'), j)); var un = ((sp.lang === 'en' ? c.unitsEn : c.units) || [])[j]; if (un) li.appendChild(h('span', { class: 'igt-note', text: un })); }); }
        else if (s.t === 'set') { li.appendChild(nameField(s, 'name', t('cVarName'))); li.appendChild(h('span', { text: '=' })); li.appendChild(exprField(s, 'e', t('cValue'))); }
        else if (s.t === 'print') li.appendChild(exprField(s, 'e', t('cWhatToPrint')));
        else if (s.t === 'repeat') { li.appendChild(exprField(s, 'n', t('cTimes'))); li.appendChild(h('span', { class: 'igt-note', text: t('cTimesWord') })); }
        else if (s.t === 'while' || s.t === 'if') li.appendChild(exprField(s, 'cond', t('cCondition')));
        else if (s.t === 'func') { li.appendChild(nameField(s, 'name', t('cFuncName'))); li.appendChild(h('span', { text: '(' })); li.appendChild(nameField(s, 'params', t('cParams'), true)); li.appendChild(h('span', { text: ')' })); }
        else if (s.t === 'call') { li.appendChild(nameField(s, 'name', t('cFuncName'))); li.appendChild(h('span', { text: '(' })); var argsIn = h('input', { type: 'text', class: 'igt-code', value: s.args.map(function (a) { return exprText(a, sp); }).join(', '), 'aria-label': t('cArgs'), spellcheck: 'false' });
          argsIn.addEventListener('change', function () { var before = snap(); var r = parse('f(' + argsIn.value + ')', sp); if (r.ok && r.stmts[0] && r.stmts[0].t === 'call') { s.args = r.stmts[0].args; argsIn.removeAttribute('aria-invalid'); history.commit(before); textArea.value = toText(prog, sp); } else { argsIn.setAttribute('aria-invalid', 'true'); T.say(t('cFieldError', { m: r.ok ? '' : r.error.msg })); } });
          li.appendChild(argsIn); li.appendChild(h('span', { text: ')' })); }
        var tools = h('span', { class: 'igt-block-tools' });
        [['up', 'arriba'], ['down', 'abajo']].forEach(function (a) { var b = T.btn(t('cOpBtn_' + a[0], { b: blockName(s) }), { icon: a[1], cls: 'icon-only', onClick: function () { op(s.id, a[0]); } }); b.setAttribute('data-act', a[0]); tools.appendChild(b); });
        var outB = T.btn(t('cOpBtn_out', { b: blockName(s) }), { icon: 'fuera', cls: 'icon-only', onClick: function () { op(s.id, 'out'); } }); outB.setAttribute('data-act', 'out'); tools.appendChild(outB);
        var inB = T.btn(t('cOpBtn_in', { b: blockName(s) }), { icon: 'dentro', cls: 'icon-only', onClick: function () { op(s.id, 'in'); } }); inB.setAttribute('data-act', 'in'); tools.appendChild(inB);
        tools.appendChild(T.btn(t('cOpBtn_dup', { b: blockName(s) }), { icon: 'copiar', cls: 'icon-only', onClick: function () { op(s.id, 'dup'); } }));
        tools.appendChild(T.btn(t('cOpBtn_del', { b: blockName(s) }), { icon: 'borrar', cls: 'icon-only danger', onClick: function () { op(s.id, 'del'); } }));
        li.appendChild(tools);
        if (s.body) {
          var body = h('div', { class: 'igt-block-body' }, renderList(s.body, depth + 1));
          li.appendChild(body);
          if (s.t === 'if') {
            if (s.els) { li.appendChild(h('div', { class: 'igt-block-body' }, h('span', { class: 'igt-block-name igt-else', text: sp.kw('else') }), renderList(s.els, depth + 1))); }
            else li.appendChild(h('div', { class: 'igt-block-body' }, T.btn(t('cAddElse'), { cls: 'igt-chip', onClick: function () { var before = snap(); s.els = []; history.commit(before); render(); } })));
          }
        }
        ul.appendChild(li);
      });
      return ul;
    }
    function updateInsertInfo() {
      var where;
      if (!sel.list) where = t('cInsEnd');
      else if (sel.list === prog) where = sel.index < 0 ? t('cInsTop') : t('cInsAfter', { n: sel.index + 1 });
      else where = sel.index < 0 ? t('cInsInsideStart') : t('cInsAfterInside', { n: sel.index + 1 });
      insertInfo.textContent = t('cInsertInfo', { w: where });
    }
    function render() {
      T.clear(blocksBox);
      blocksBox.appendChild(h('div', { class: 'igt-bar' }, slot(prog, -1, t('cInsTopBtn'))));
      blocksBox.appendChild(renderList(prog, 0));
      updateInsertInfo();
      if (!textDirty) textArea.value = toText(prog, sp);
      if (cfg.onChange) cfg.onChange();
    }
    function setView(v) {
      if (v === view) return;
      if (view === 'text' && textDirty) { if (!applyText()) return; }
      view = v; T.press(bBlocks, v === 'blocks'); T.press(bText, v === 'text');
      blocksBox.hidden = v !== 'blocks'; palette.hidden = v !== 'blocks'; textBox.hidden = v !== 'text';
      if (v === 'text') { textArea.value = toText(prog, sp); textDirty = false; textArea.focus(); }
      T.say(v === 'text' ? t('cTextView') : t('cBlocksView'));
    }
    function applyText() {
      var r = parse(textArea.value, sp);
      if (!r.ok) { textErr.hidden = false; textErr.textContent = t('cErrAt', { line: r.error.line, m: r.error.msg }); T.say(textErr.textContent); return false; }
      textErr.hidden = true; var before = snap(); prog = r.stmts; sel = { list: null, index: -1 }; textDirty = false; history.commit(before); render(); T.say(t('cTextApplied')); return true;
    }

    var running = null;
    this.el = root;
    this.get = function () { if (view === 'text' && textDirty) { if (!applyText()) return null; } return prog; };
    this.set = function (p) { prog = p; sel = { list: null, index: -1 }; textDirty = false; render(); };
    this.snapshot = function () { return prog; };
    this.setText = function (src) { var r = parse(src, sp); if (r.ok) { prog = r.stmts; sel = { list: null, index: -1 }; textDirty = false; render(); } return r; };
    this.text = function () { return toText(prog, sp); };
    this.highlight = function (id) {
      running = id; var old = blocksBox.querySelectorAll('.igt-block.run'); for (var i = 0; i < old.length; i++) old[i].classList.remove('run');
      if (id) { var el = blocksBox.querySelector('[data-bid="' + id + '"]'); if (el) el.classList.add('run'); }
    };
    this.render = render;
    render();
    setView('blocks'); view = 'blocks'; blocksBox.hidden = false; palette.hidden = false; textBox.hidden = true;
  }

  /* Ejecutor con velocidad, paso a paso y parada. */
  function Runner(cfg) {
    var it = null, timer = 0, state = 'idle', self = this;
    var speedSel = h('select', { id: cfg.idPrefix + '-speed' }, ['slow', 'normal', 'fast', 'instant'].map(function (k) { return h('option', { value: k, text: t('cSpeed_' + k) }); }));
    speedSel.value = T.reducedMotion() ? 'instant' : 'normal';
    var runB = T.btn(t('cRun'), { icon: 'play', cls: 'primary', onClick: function () { if (state === 'paused' && it) { state = 'running'; T.say(t('cRunning')); advance(false); sync(); } else start(false); } });
    var stepB = T.btn(t('cStep'), { icon: 'paso', onClick: function () { if (state === 'idle' || state === 'done') { if (!prepare()) return; } state = 'paused'; advance(true); } });
    var stopB = T.btn(t('cStop'), { icon: 'parar', onClick: function () { stop(t('cStopped')); } });
    var resetB = T.btn(t('cReset'), { icon: 'reiniciar', onClick: function () { stop(); if (cfg.onReset) cfg.onReset(); T.say(t('cResetDone')); } });
    this.el = h('div', { class: 'igt-bar', role: 'group', 'aria-label': t('cRunBar') }, runB, stepB, stopB, resetB,
      h('label', { class: 'igt-field inline', for: cfg.idPrefix + '-speed' }, t('cSpeed'), speedSel));
    function prepare() {
      var its = cfg.make(); if (!its) return false;
      it = its; state = 'ready'; return true;
    }
    function delay() { return { slow: 450, normal: 120, fast: 25, instant: 0 }[speedSel.value]; }
    function advance(single) {
      if (!it) return;
      var budget = single ? 1 : (delay() === 0 ? 1e9 : 1), t0 = performance.now();
      try {
        while (budget > 0) {
          var r = it.next();
          if (r.done) { finish(); return; }
          if (r.value && r.value.node && cfg.onStep) cfg.onStep(r.value.node);
          if (r.value && r.value.soft && !single) continue;
          if (r.value && r.value.soft && single) continue;
          budget--;
          if (delay() === 0 && performance.now() - t0 > 30) { if (cfg.onFrame) cfg.onFrame(); timer = setTimeout(function () { advance(false); }, 0); return; }
        }
      } catch (e) { fail(e); return; }
      if (cfg.onFrame) cfg.onFrame();
      if (!single && state === 'running') timer = setTimeout(function () { advance(false); }, delay());
    }
    function start() { stop(); if (!prepare()) return; state = 'running'; T.say(t('cRunning')); advance(false); sync(); }
    function stop(msg) { clearTimeout(timer); if (it && state !== 'done' && msg) T.say(msg); it = null; state = 'idle'; if (cfg.onStep) cfg.onStep(null); sync(); }
    function finish() { clearTimeout(timer); state = 'done'; it = null; if (cfg.onStep) cfg.onStep(null); if (cfg.onFrame) cfg.onFrame(); if (cfg.onDone) cfg.onDone(null); sync(); }
    function fail(e) { clearTimeout(timer); state = 'done'; it = null; if (cfg.onStep) cfg.onStep(null); if (cfg.onFrame) cfg.onFrame(); if (cfg.onDone) cfg.onDone(e && e.msg ? e : { msg: String(e && e.message || e) }); sync(); }
    function sync() { stopB.disabled = state !== 'running' && state !== 'paused'; }
    sync();
    this.start = start; this.stop = stop; this.running = function () { return state === 'running'; };
  }

  window.IGTCode = { Spec: Spec, parse: parse, parseExpr: parseExpr, toText: toText, Interp: Interp, analyze: analyze, Editor: Editor, Runner: Runner, CodeError: CodeError, exprText: exprText };
})(window, document);
