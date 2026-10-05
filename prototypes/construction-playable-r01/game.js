"use strict";
(() => {
  const VERSION = 1;
  const STORAGE_KEY = "irisgreen.construction-playable-r01.v1";
  const COLS = 12, ROWS = 8, CELL = 80;
  const ROUTES = { R1: { y: 3, name: "R1" }, R2: { y: 5, name: "R2" } };
  const COSTS = {
    platform: { wood: 1, stone: 0, label: "Plataforma" },
    block: { wood: 0, stone: 1, label: "Bloque" },
    stair: { wood: 2, stone: 0, label: "Escalera" }
  };
  const DIRS = {
    N: { dx: 0, dy: -1, arrow: "↑" },
    E: { dx: 1, dy: 0, arrow: "→" },
    S: { dx: 0, dy: 1, arrow: "↓" },
    W: { dx: -1, dy: 0, arrow: "←" }
  };
  const OPP = { N: "S", S: "N", E: "W", W: "E" };
  const WOOD_PILE = { x: 1, y: 5, z: 1 };
  const STONE_PILE = { x: 1, y: 6, z: 1 };
  const EXTRA_STONE = { x: 9, y: 6, z: 1 };
  const BOX = { x: 9, y: 3, z: 1 };
  const TERRACE_ENTRY = { x: 10, y: 1, z: 3 };

  const $ = (id) => document.getElementById(id);
  const canvas = $("scene");
  const ctx = canvas.getContext("2d", { alpha: false });
  const feedback = $("feedback");
  const gameLive = $("game-live");
  const startDialog = $("start-dialog");
  const helpDialog = $("help-dialog");
  const pauseDialog = $("pause-dialog");
  const confirmNewDialog = $("confirm-new-dialog");

  let state = createState();
  let history = [];
  let storageOK = true;
  let lastFeedbackTimer = 0;

  function createState() {
    const prefersReduced = matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    return {
      version: VERSION,
      player: { x: 1, y: 3, z: 1, dir: "E" },
      mode: "roam",
      inventory: { wood: 0, stone: 0 },
      collected: { wood: false, stone: false, extraStone: false },
      pieces: [],
      cursor: { x: 2, y: 3, z: 1 },
      selected: "platform",
      orientation: "N",
      boxOpened: false,
      stairsUnlocked: false,
      freeMode: false,
      settings: { motion: prefersReduced ? "reduced" : "normal" },
      nextPieceId: 1
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function fixedLevel(x, y) {
    if (!inside(x, y)) return null;
    if (x <= 2) return 1;
    if (x >= 8 && y >= 2) return 1;
    if (x >= 9 && x <= 11 && y <= 1) return 3;
    return null;
  }

  function inside(x, y) {
    return x >= 0 && x < COLS && y >= 0 && y < ROWS;
  }

  function routeAt(x, y) {
    if (x < 3 || x > 7) return null;
    if (y === ROUTES.R1.y) return "R1";
    if (y === ROUTES.R2.y) return "R2";
    return null;
  }

  function routeColumn(x) {
    return x >= 3 && x <= 7 ? x - 2 : null;
  }

  function isParcelCell(x, y) {
    return x >= 8 && x <= 11 && y >= 0 && y <= 1;
  }

  function keyOf(p) {
    return `${p.x},${p.y},${p.z}`;
  }

  function pieceAt(x, y, z, pieces = state.pieces) {
    return pieces.find((p) => p.x === x && p.y === y && p.z === z) || null;
  }

  function piecesAtXY(x, y, pieces = state.pieces) {
    return pieces.filter((p) => p.x === x && p.y === y);
  }

  function stairAt(x, y, z, pieces = state.pieces) {
    const p = pieceAt(x, y, z, pieces);
    return p && p.type === "stair" ? p : null;
  }

  function walkableAt(x, y, z, pieces = state.pieces) {
    if (!inside(x, y)) return false;
    if (fixedLevel(x, y) === z) return true;
    const p = pieceAt(x, y, z, pieces);
    return !!p && (p.type === "platform" || p.type === "stair");
  }

  function playerSafeWithPieces(pieces) {
    return walkableAt(state.player.x, state.player.y, state.player.z, pieces);
  }

  function costFor(type) {
    return COSTS[type];
  }

  function hasResources(type) {
    if (state.freeMode) return true;
    const c = costFor(type);
    return state.inventory.wood >= c.wood && state.inventory.stone >= c.stone;
  }

  function spend(type) {
    if (state.freeMode) return;
    const c = costFor(type);
    state.inventory.wood -= c.wood;
    state.inventory.stone -= c.stone;
  }

  function refund(type) {
    if (state.freeMode) return;
    const c = costFor(type);
    state.inventory.wood += c.wood;
    state.inventory.stone += c.stone;
  }

  function horizontalDistance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function withinBuildReach(x, y) {
    return horizontalDistance(state.player, { x, y }) <= 2;
  }

  function routePlatformSupported(x, y, pieces, includeCandidate = true) {
    const route = routeAt(x, y);
    if (!route) return false;
    const supportXs = [2, 8];
    for (const p of pieces) {
      if (p.type === "block" && p.y === y && p.z === 0 && p.x >= 3 && p.x <= 7) supportXs.push(p.x);
    }
    const platforms = new Set(
      pieces.filter((p) => p.type === "platform" && p.y === y && p.z === 1).map((p) => p.x)
    );
    if (includeCandidate) platforms.add(x);
    for (const sx of supportXs) {
      if (Math.abs(sx - x) > 2) continue;
      if (sx === x) return true;
      const step = sx < x ? 1 : -1;
      let ok = true;
      for (let xx = sx + step; xx !== x; xx += step) {
        if (!platforms.has(xx)) { ok = false; break; }
      }
      if (ok) return true;
    }
    return false;
  }

  function freePlatformSupported(x, y, z, pieces, includeCandidate = true) {
    if (!isParcelCell(x, y) || z < 3) return false;
    if (fixedLevel(x, y) === z - 1) return true;
    const below = pieceAt(x, y, z - 1, pieces);
    if (below && below.type === "block") return true;
    const supports = [];
    for (let sx = 8; sx <= 11; sx++) {
      if (fixedLevel(sx, y) === z - 1) supports.push(sx);
      const b = pieceAt(sx, y, z - 1, pieces);
      if (b && b.type === "block") supports.push(sx);
    }
    const plats = new Set(pieces.filter((p) => p.type === "platform" && p.y === y && p.z === z).map((p) => p.x));
    if (includeCandidate) plats.add(x);
    return supports.some((sx) => {
      if (Math.abs(sx - x) > 2) return false;
      if (sx === x) return true;
      const step = sx < x ? 1 : -1;
      for (let xx = sx + step; xx !== x; xx += step) if (!plats.has(xx)) return false;
      return true;
    });
  }

  function stairChallengeSlot(x, y, z) {
    if (x === 10 && y === 3 && z === 1) return 1;
    if (x === 10 && y === 2 && z === 2) return 2;
    return 0;
  }

  function stairSupported(piece, pieces = state.pieces) {
    if (piece.type !== "stair") return true;
    const slot = stairChallengeSlot(piece.x, piece.y, piece.z);
    if (slot === 1) return fixedLevel(piece.x, piece.y) === 1 && piece.orientation === "N";
    if (slot === 2) {
      const lower = stairAt(10, 3, 1, pieces);
      return !!lower && lower.orientation === "N" && piece.orientation === "N";
    }
    if (state.freeMode && isParcelCell(piece.x, piece.y)) {
      if (fixedLevel(piece.x, piece.y) === piece.z) return true;
      const below = pieceAt(piece.x, piece.y, piece.z - 1, pieces);
      return !!below && (below.type === "block" || below.type === "platform");
    }
    return false;
  }

  function validatePlacement(type = state.selected, cursor = state.cursor, pieces = state.pieces) {
    const { x, y, z } = cursor;
    if (!inside(x, y)) return { ok: false, reason: "Fuera del escenario." };
    if (!withinBuildReach(x, y)) return { ok: false, reason: "Fuera de alcance: construye a un máximo de 2 casillas desde tu posición." };
    if (pieceAt(x, y, z, pieces)) return { ok: false, reason: "Casilla ocupada." };
    if (state.player.x === x && state.player.y === y && state.player.z === z) {
      return { ok: false, reason: "No puedes construir en la casilla que ocupas." };
    }
    if (!hasResources(type)) return { ok: false, reason: "No tienes materiales suficientes." };

    if (type === "platform") {
      const route = routeAt(x, y);
      if (route) {
        if (z !== 1) return { ok: false, reason: "En el canal, la plataforma debe estar en z1." };
        if (!routePlatformSupported(x, y, pieces, true)) return { ok: false, reason: "Falta apoyo sólido: máximo 2 plataformas desde un apoyo." };
        return { ok: true, reason: `${route} C${routeColumn(x)} · z1 · posición válida` };
      }
      if (state.freeMode && isParcelCell(x, y)) {
        if (!freePlatformSupported(x, y, z, pieces, true)) return { ok: false, reason: "En la parcela, la plataforma necesita apoyo a menos de 2 pasos." };
        return { ok: true, reason: "Parcela libre · plataforma válida." };
      }
      return { ok: false, reason: "Las plataformas de este reto se colocan en R1/R2 o en la parcela libre." };
    }

    if (type === "block") {
      const route = routeAt(x, y);
      if (route) {
        if (z !== 0) return { ok: false, reason: "Los bloques de apoyo del canal se colocan en z0." };
        return { ok: true, reason: `${route} C${routeColumn(x)} · bloque z0 · posición válida` };
      }
      if (state.freeMode && isParcelCell(x, y)) {
        if (fixedLevel(x, y) !== z) return { ok: false, reason: "El bloque de la parcela debe descansar sobre una superficie sólida." };
        return { ok: true, reason: "Parcela libre · bloque válido." };
      }
      return { ok: false, reason: "El bloque solo puede apoyar una ruta del canal o construirse en la parcela libre." };
    }

    if (type === "stair") {
      if (!state.stairsUnlocked) return { ok: false, reason: "La escalera se desbloquea al abrir la caja." };
      const slot = stairChallengeSlot(x, y, z);
      if (slot) {
        if (state.orientation !== "N") return { ok: false, reason: "En este acceso, la escalera debe apuntar hacia la terraza." };
        const candidate = { type: "stair", x, y, z, orientation: state.orientation };
        if (!stairSupported(candidate, pieces.concat(candidate))) return { ok: false, reason: "La escalera superior necesita la escalera inferior como apoyo." };
        return { ok: true, reason: slot === 1 ? "Escalera inferior válida · z1 → z2." : "Escalera superior válida · z2 → z3." };
      }
      if (state.freeMode && isParcelCell(x, y)) {
        const candidate = { type: "stair", x, y, z, orientation: state.orientation };
        if (!stairSupported(candidate, pieces.concat(candidate))) return { ok: false, reason: "La escalera necesita apoyo en su base." };
        return { ok: true, reason: "Parcela libre · escalera válida." };
      }
      return { ok: false, reason: "Para llegar a la terraza usa las dos casillas de acceso marcadas." };
    }

    return { ok: false, reason: "Pieza desconocida." };
  }

  function structuralWorldValid(pieces) {
    for (const p of pieces) {
      if (p.type === "platform") {
        const route = routeAt(p.x, p.y);
        const ok = route
          ? routePlatformSupported(p.x, p.y, pieces, false)
          : state.freeMode && freePlatformSupported(p.x, p.y, p.z, pieces, false);
        if (!ok) return { ok: false, piece: p };
      }
      if (p.type === "stair" && !stairSupported(p, pieces)) return { ok: false, piece: p };
    }
    return { ok: true };
  }

  function pushHistory(label) {
    history.push({
      label,
      pieces: clone(state.pieces),
      inventory: clone(state.inventory),
      selected: state.selected,
      orientation: state.orientation,
      cursor: clone(state.cursor)
    });
    if (history.length > 40) history.shift();
  }

  function undo() {
    if (!history.length) return announce("No hay ninguna construcción que deshacer.", "info");
    const snap = history[history.length - 1];
    if (!playerSafeWithPieces(snap.pieces)) {
      return announce("No puedo deshacer ahora: primero baja de la pieza que desaparecería.", "bad");
    }
    history.pop();
    state.pieces = clone(snap.pieces);
    state.inventory = clone(snap.inventory);
    state.selected = snap.selected;
    state.orientation = snap.orientation;
    state.cursor = clone(snap.cursor);
    saveGame();
    announce(`Deshecho: ${snap.label}. Mundo e inventario restaurados.`, "info");
    update();
  }

  function placeSelected() {
    const check = validatePlacement();
    if (!check.ok) return announce(check.reason, "bad");
    pushHistory(`colocar ${COSTS[state.selected].label}`);
    const piece = {
      id: state.nextPieceId++,
      type: state.selected,
      x: state.cursor.x,
      y: state.cursor.y,
      z: state.cursor.z,
      orientation: state.orientation
    };
    state.pieces.push(piece);
    spend(piece.type);
    saveGame();
    announce(`${COSTS[piece.type].label} colocada. ${check.reason}`, "good");
    update();
  }

  function removeAtCursor() {
    const idx = state.pieces.findIndex((p) => p.x === state.cursor.x && p.y === state.cursor.y && p.z === state.cursor.z);
    if (idx < 0) return announce("No hay ninguna pieza en esa casilla y altura.", "bad");
    const target = state.pieces[idx];
    if (state.player.x === target.x && state.player.y === target.y && state.player.z === target.z) {
      return announce("No puedes retirar la pieza sobre la que estás.", "bad");
    }
    const trial = state.pieces.filter((_, i) => i !== idx);
    if (!playerSafeWithPieces(trial)) return announce("Retirada bloqueada: te dejaría en agua o vacío.", "bad");
    const structural = structuralWorldValid(trial);
    if (!structural.ok) {
      const p = structural.piece;
      return announce(`Retira primero las piezas que dependen de este apoyo. Quedaría sin apoyo ${cellName(p.x, p.y, p.z)}.`, "bad");
    }
    pushHistory(`retirar ${COSTS[target.type].label}`);
    state.pieces = trial;
    refund(target.type);
    saveGame();
    announce(`${COSTS[target.type].label} retirada. Coste devuelto al inventario.`, "good");
    update();
  }

  function selectPiece(type) {
    if (!COSTS[type]) return;
    if (type === "stair" && !state.stairsUnlocked) return announce("La escalera todavía está bloqueada.", "bad");
    state.selected = type;
    if (type === "block") state.cursor.z = 0;
    if (type === "platform") state.cursor.z = routeAt(state.cursor.x, state.cursor.y) ? 1 : Math.max(1, state.cursor.z);
    if (type === "stair" && !state.freeMode) state.cursor.z = Math.max(1, Math.min(2, state.cursor.z));
    update();
  }

  function toggleMode(next) {
    state.mode = next || (state.mode === "roam" ? "build" : "roam");
    if (state.mode === "build") {
      state.cursor = { x: state.player.x, y: state.player.y, z: state.player.z };
    }
    saveGame();
    update();
    canvas.focus();
  }

  function moveCursor(dir) {
    const d = DIRS[dir];
    if (!d) return;
    state.cursor.x = Math.max(0, Math.min(COLS - 1, state.cursor.x + d.dx));
    state.cursor.y = Math.max(0, Math.min(ROWS - 1, state.cursor.y + d.dy));
    update();
  }

  function setCursorHeight(delta) {
    state.cursor.z = Math.max(0, Math.min(4, state.cursor.z + delta));
    update();
  }

  function rotatePiece() {
    const order = ["N", "E", "S", "W"];
    state.orientation = order[(order.indexOf(state.orientation) + 1) % order.length];
    update();
  }

  function movePlayer(dir) {
    const d = DIRS[dir];
    if (!d) return;
    state.player.dir = dir;

    const currentStair = stairAt(state.player.x, state.player.y, state.player.z);
    if (currentStair && currentStair.orientation === dir) {
      const nx = state.player.x + d.dx, ny = state.player.y + d.dy, nz = state.player.z + 1;
      if (!walkableAt(nx, ny, nz)) {
        announce("La escalera aún no conecta con una superficie superior.", "bad");
        update();
        return;
      }
      state.player = { x: nx, y: ny, z: nz, dir };
      afterMove();
      return;
    }

    const nx = state.player.x + d.dx, ny = state.player.y + d.dy;
    const lowerStair = stairAt(nx, ny, state.player.z - 1);
    if (lowerStair && lowerStair.orientation === OPP[dir]) {
      state.player = { x: nx, y: ny, z: state.player.z - 1, dir };
      afterMove();
      return;
    }

    if (walkableAt(nx, ny, state.player.z)) {
      state.player = { x: nx, y: ny, z: state.player.z, dir };
      afterMove();
      return;
    }

    const route = routeAt(nx, ny);
    if (route && state.player.z === 1) announce("El agua bloquea el paso. Necesitas una plataforma.", "bad");
    else announce("No puedes pasar por ahí.", "bad");
    update();
  }

  function afterMove() {
    if (!state.freeMode && state.player.x === TERRACE_ENTRY.x && state.player.y === TERRACE_ENTRY.y && state.player.z === TERRACE_ENTRY.z) {
      state.freeMode = true;
      announce("Parcela abierta. Ahora tienes materiales ilimitados y puedes seguir construyendo.", "good");
    }
    saveGame();
    update();
  }

  function near(a, b, distance = 1) {
    return a.z === b.z && Math.abs(a.x - b.x) + Math.abs(a.y - b.y) <= distance;
  }

  function interact() {
    if (!state.collected.wood && near(state.player, WOOD_PILE)) {
      state.collected.wood = true;
      state.inventory.wood += 24;
      saveGame();
      announce("Has recogido 24 de madera.", "good");
      update();
      return;
    }
    if (!state.collected.stone && near(state.player, STONE_PILE)) {
      state.collected.stone = true;
      state.inventory.stone += 12;
      saveGame();
      announce("Has recogido 12 de piedra.", "good");
      update();
      return;
    }
    if (!state.collected.extraStone && near(state.player, EXTRA_STONE)) {
      state.collected.extraStone = true;
      state.inventory.stone += 12;
      saveGame();
      announce("Has recogido 12 de piedra al otro lado del canal.", "good");
      update();
      return;
    }
    if (!state.boxOpened && near(state.player, BOX)) {
      state.boxOpened = true;
      state.stairsUnlocked = true;
      saveGame();
      announce("Caja abierta. Ya puedes fabricar escaleras. Llega a la terraza para abrir tu parcela.", "good");
      update();
      return;
    }
    announce("No hay nada con lo que interactuar aquí.", "info");
  }

  function objectiveText() {
    if (!state.boxOpened) return "La caja de herramientas está al otro lado. Construye un camino para llegar.";
    if (!state.freeMode) return "Ya puedes fabricar escaleras. Llega a la terraza para abrir tu parcela.";
    return "Parcela abierta. Materiales ilimitados: sigue probando construcciones.";
  }

  function cellName(x, y, z) {
    const route = routeAt(x, y);
    if (route) return `${route} C${routeColumn(x)} · z${z}`;
    if (x === 10 && y === 3) return `Acceso terraza inferior · z${z}`;
    if (x === 10 && y === 2) return `Acceso terraza superior · z${z}`;
    if (isParcelCell(x, y)) return `Parcela · (${x},${y}) · z${z}`;
    return `(${x},${y}) · z${z}`;
  }

  function playerLocationText() {
    const route = routeAt(state.player.x, state.player.y);
    if (route) return `${route} C${routeColumn(state.player.x)} · z${state.player.z}`;
    if (state.player.x >= 9 && state.player.y <= 1 && state.player.z === 3) return "Terraza · z3";
    if (state.player.x <= 2) return `Taller/orilla inicial · (${state.player.x},${state.player.y}) · z1`;
    if (state.player.x >= 8) return `Orilla opuesta · (${state.player.x},${state.player.y}) · z${state.player.z}`;
    return cellName(state.player.x, state.player.y, state.player.z);
  }

  function cursorDescription() {
    if (state.mode !== "build") return "Sin cursor de construcción.";
    const p = pieceAt(state.cursor.x, state.cursor.y, state.cursor.z);
    const check = validatePlacement();
    const occupied = p ? `Ocupada por ${COSTS[p.type].label}.` : "Vacía.";
    return `${cellName(state.cursor.x, state.cursor.y, state.cursor.z)}. ${occupied} ${check.ok ? "Válida" : "No válida"}: ${check.reason}`;
  }

  function pieceDescription() {
    const c = COSTS[state.selected];
    const cost = state.freeMode ? "materiales ilimitados" : [
      c.wood ? `${c.wood} madera` : "",
      c.stone ? `${c.stone} piedra` : ""
    ].filter(Boolean).join(" + ");
    const orient = state.selected === "stair" ? ` · orientación ${state.orientation}` : "";
    return `${c.label} · ${cost}${orient}`;
  }

  function announce(message, kind = "info") {
    clearTimeout(lastFeedbackTimer);
    feedback.textContent = message;
    feedback.className = `feedback ${kind === "bad" ? "bad" : kind === "info" ? "info" : ""} changed`;
    lastFeedbackTimer = setTimeout(() => feedback.classList.remove("changed"), 450);
  }

  function storageNote() {
    return storageOK
      ? "Guardado local activo. La partida se actualiza automáticamente."
      : "No se puede guardar en este navegador/ruta. Puedes seguir jugando en esta sesión.";
  }

  function savePayload() {
    return {
      version: VERSION,
      player: state.player,
      mode: state.mode,
      inventory: state.inventory,
      collected: state.collected,
      pieces: state.pieces,
      cursor: state.cursor,
      selected: state.selected,
      orientation: state.orientation,
      boxOpened: state.boxOpened,
      stairsUnlocked: state.stairsUnlocked,
      freeMode: state.freeMode,
      settings: state.settings,
      nextPieceId: state.nextPieceId
    };
  }

  function saveGame() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savePayload()));
      storageOK = true;
    } catch (err) {
      storageOK = false;
    }
    $("save-note").textContent = storageNote();
  }

  function readSave() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION || !parsed.player || !Array.isArray(parsed.pieces)) return null;
      storageOK = true;
      return parsed;
    } catch (err) {
      storageOK = false;
      return null;
    }
  }

  function loadGame() {
    const saved = readSave();
    if (!saved) {
      state = createState();
      history = [];
      announce("No había una partida guardada. Se ha iniciado una nueva.", "info");
    } else {
      state = Object.assign(createState(), saved);
      history = [];
      announce("Partida cargada.", "good");
    }
    update();
  }

  function newGame() {
    const motion = state.settings?.motion || "normal";
    state = createState();
    state.settings.motion = motion;
    history = [];
    saveGame();
    announce("Nueva partida. Recoge la madera y la piedra del taller.", "info");
    update();
  }

  function updateUI() {
    document.body.dataset.motion = state.settings.motion;
    $("motion").value = state.settings.motion;
    $("objective").textContent = objectiveText();
    $("wood-count").textContent = state.freeMode ? "∞" : String(state.inventory.wood);
    $("stone-count").textContent = state.freeMode ? "∞" : String(state.inventory.stone);
    $("stairs-state").textContent = state.stairsUnlocked ? "Escalera disponible" : "Escalera bloqueada";
    $("mode-name").textContent = state.mode === "roam" ? "Recorrer" : "Construir";
    $("player-desc").textContent = playerLocationText();
    $("cell-desc").textContent = cursorDescription();
    $("piece-desc").textContent = pieceDescription();
    $("save-note").textContent = storageNote();

    $("roam-mode").classList.toggle("active", state.mode === "roam");
    $("build-mode").classList.toggle("active", state.mode === "build");
    $("roam-mode").setAttribute("aria-pressed", String(state.mode === "roam"));
    $("build-mode").setAttribute("aria-pressed", String(state.mode === "build"));
    $("piece-controls").hidden = state.mode !== "build";
    $("build-actions").hidden = state.mode !== "build";

    document.querySelectorAll("[data-piece]").forEach((button) => {
      const selected = button.dataset.piece === state.selected;
      button.setAttribute("aria-pressed", String(selected));
    });
    $("stair-piece").disabled = !state.stairsUnlocked;
    $("undo-btn").disabled = history.length === 0;
    $("primary-action").textContent = state.mode === "roam" ? "Acción" : "Colocar";
    $("primary-action").setAttribute("aria-label", state.mode === "roam" ? "Interactuar" : "Colocar pieza");
  }

  function cellRect(x, y) {
    return { x: x * CELL, y: y * CELL, w: CELL, h: CELL };
  }

  function fillCell(x, y, color) {
    const r = cellRect(x, y);
    ctx.fillStyle = color;
    ctx.fillRect(r.x, r.y, r.w, r.h);
  }

  function strokeCell(x, y, color, width = 2, dash = []) {
    const r = cellRect(x, y);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.setLineDash(dash);
    ctx.strokeRect(r.x + 4, r.y + 4, r.w - 8, r.h - 8);
    ctx.restore();
  }

  function drawText(text, x, y, options = {}) {
    ctx.save();
    ctx.font = options.font || "700 16px system-ui";
    ctx.fillStyle = options.color || "#173448";
    ctx.textAlign = options.align || "left";
    ctx.textBaseline = options.baseline || "alphabetic";
    if (options.bg) {
      const m = ctx.measureText(text);
      ctx.fillStyle = options.bg;
      ctx.fillRect(x - (options.align === "center" ? m.width / 2 : 4), y - 16, m.width + 8, 22);
      ctx.fillStyle = options.color || "#173448";
    }
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#1a9bc8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const level = fixedLevel(x, y);
        if (level === 1) fillCell(x, y, x <= 2 ? "#e4c78d" : "#ddc28d");
        if (level === 3) fillCell(x, y, "#c9a467");
      }
    }

    ctx.strokeStyle = "rgba(255,255,255,.28)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke();
    }

    drawText("Taller", 18, 34, { color: "#173448", bg: "rgba(255,255,255,.75)" });
    drawText("R1", 3 * CELL + 10, ROUTES.R1.y * CELL + 22, { color: "#fff", bg: "#123b55" });
    drawText("R2", 3 * CELL + 10, ROUTES.R2.y * CELL + 22, { color: "#fff", bg: "#123b55" });
    drawText("Terraza", 10 * CELL, 32, { align: "center", color: "#173448", bg: "rgba(255,255,255,.72)" });

    for (const route of Object.values(ROUTES)) {
      for (let x = 3; x <= 7; x++) {
        if (state.mode === "build") strokeCell(x, route.y, "rgba(255,255,255,.55)", 1, [6, 5]);
        drawText(`C${x - 2}`, x * CELL + CELL / 2, route.y * CELL + CELL - 8, {
          align: "center", color: "rgba(255,255,255,.82)", font: "700 12px system-ui"
        });
      }
    }

    if (!state.collected.wood) {
      const r = cellRect(WOOD_PILE.x, WOOD_PILE.y);
      ctx.fillStyle = "#a96831";
      for (let i = 0; i < 3; i++) ctx.fillRect(r.x + 15 + i * 12, r.y + 26 - i * 4, 28, 12);
      drawText("24 madera", r.x + CELL / 2, r.y + 18, { align: "center", color: "#fff", bg: "#123b55", font: "700 12px system-ui" });
    }
    if (!state.collected.stone) {
      const r = cellRect(STONE_PILE.x, STONE_PILE.y);
      ctx.fillStyle = "#9ca2a3";
      for (let i = 0; i < 4; i++) ctx.fillRect(r.x + 14 + i * 10, r.y + 28 - (i % 2) * 8, 22, 17);
      drawText("12 piedra", r.x + CELL / 2, r.y + 18, { align: "center", color: "#fff", bg: "#123b55", font: "700 12px system-ui" });
    }
    if (!state.collected.extraStone) {
      const r = cellRect(EXTRA_STONE.x, EXTRA_STONE.y);
      ctx.fillStyle = "#9ca2a3";
      for (let i = 0; i < 4; i++) ctx.fillRect(r.x + 14 + i * 10, r.y + 28 - (i % 2) * 8, 22, 17);
      drawText("+12 piedra", r.x + CELL / 2, r.y + 18, { align: "center", color: "#fff", bg: "#123b55", font: "700 12px system-ui" });
    }

    const br = cellRect(BOX.x, BOX.y);
    ctx.fillStyle = state.boxOpened ? "#6f8b58" : "#915324";
    ctx.fillRect(br.x + 12, br.y + 16, 56, 48);
    ctx.strokeStyle = "#4e331f"; ctx.lineWidth = 3; ctx.strokeRect(br.x + 12, br.y + 16, 56, 48);
    drawText(state.boxOpened ? "Caja abierta" : "Caja", br.x + CELL / 2, br.y + 76, {
      align: "center", color: "#fff", bg: "#123b55", font: "700 12px system-ui"
    });

    if (state.stairsUnlocked) {
      strokeCell(10, 3, "#f8db70", 3, [7, 4]);
      strokeCell(10, 2, "#f8db70", 3, [7, 4]);
      drawText("z1", 10 * CELL + 40, 3 * CELL + 44, { align: "center", color: "#4c3900", bg: "#fff1af", font: "700 12px system-ui" });
      drawText("z2", 10 * CELL + 40, 2 * CELL + 44, { align: "center", color: "#4c3900", bg: "#fff1af", font: "700 12px system-ui" });
    }

    ctx.save();
    ctx.strokeStyle = state.freeMode ? "#08773e" : "#6b5532";
    ctx.lineWidth = 4;
    ctx.setLineDash(state.freeMode ? [] : [8, 6]);
    ctx.strokeRect(9 * CELL + 6, 0 * CELL + 6, 3 * CELL - 12, 2 * CELL - 12);
    ctx.restore();
    drawText(state.freeMode ? "Parcela libre" : "Parcela cerrada", 10.5 * CELL, 2 * CELL - 10, {
      align: "center", color: "#fff", bg: "#123b55", font: "700 12px system-ui"
    });

    const ordered = [...state.pieces].sort((a, b) => a.z - b.z || (a.type === "block" ? -1 : 1));
    for (const p of ordered) drawPiece(p);

    if (state.mode === "build") drawCursor();
    drawPlayer();
  }

  function drawPiece(p) {
    const r = cellRect(p.x, p.y);
    if (p.type === "block") {
      ctx.fillStyle = "#969b99";
      ctx.fillRect(r.x + 15, r.y + 23, 50, 45);
      ctx.strokeStyle = "#565d5b"; ctx.lineWidth = 3; ctx.strokeRect(r.x + 15, r.y + 23, 50, 45);
      // Block type and z are exposed through #cell-desc / #game-live, not canvas microtext.
    } else if (p.type === "platform") {
      ctx.fillStyle = "#ad6b30";
      ctx.fillRect(r.x + 7, r.y + 26, 66, 28);
      ctx.strokeStyle = "#6f4324"; ctx.lineWidth = 3; ctx.strokeRect(r.x + 7, r.y + 26, 66, 28);
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(r.x + 7 + i * 16, r.y + 26); ctx.lineTo(r.x + 7 + i * 16, r.y + 54); ctx.stroke();
      }
    } else if (p.type === "stair") {
      ctx.fillStyle = "#b36e30";
      ctx.fillRect(r.x + 10, r.y + 12, 60, 56);
      ctx.strokeStyle = "#6e4320"; ctx.lineWidth = 3; ctx.strokeRect(r.x + 10, r.y + 12, 60, 56);
      const d = DIRS[p.orientation];
      drawText(d.arrow, r.x + CELL / 2, r.y + 50, { align: "center", color: "#fff", font: "900 30px system-ui" });
      drawText(`z${p.z}→z${p.z + 1}`, r.x + CELL / 2, r.y + 76, { align: "center", color: "#fff", bg: "#123b55", font: "700 10px system-ui" });
    }
  }

  function drawCursor() {
    const check = validatePlacement();
    const color = check.ok ? "#28d276" : "#ef4e5e";
    strokeCell(state.cursor.x, state.cursor.y, color, 5, [10, 5]);
    const r = cellRect(state.cursor.x, state.cursor.y);
    drawText(`z${state.cursor.z}`, r.x + CELL / 2, r.y + 20, { align: "center", color: "#fff", bg: check.ok ? "#176b43" : "#8a2330", font: "800 12px system-ui" });
  }

  function drawPlayer() {
    const r = cellRect(state.player.x, state.player.y);
    const cx = r.x + CELL / 2, cy = r.y + CELL / 2;
    ctx.fillStyle = "#37464b";
    ctx.beginPath(); ctx.arc(cx, cy - 16, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d5a96d";
    ctx.fillRect(cx - 11, cy - 3, 22, 30);
    ctx.fillStyle = "#455f6c";
    ctx.fillRect(cx - 10, cy + 27, 8, 17);
    ctx.fillRect(cx + 2, cy + 27, 8, 17);
    drawText(DIRS[state.player.dir].arrow, cx + 22, cy - 17, { color: "#fff", bg: "#123b55", font: "900 12px system-ui" });
  }

  function update() {
    updateUI();
    drawBoard();
  }

  document.querySelectorAll("[data-dir]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.mode === "roam") movePlayer(button.dataset.dir);
      else moveCursor(button.dataset.dir);
    });
  });

  document.querySelectorAll("[data-piece]").forEach((button) => {
    button.addEventListener("click", () => selectPiece(button.dataset.piece));
  });

  $("roam-mode").addEventListener("click", () => toggleMode("roam"));
  $("build-mode").addEventListener("click", () => toggleMode("build"));
  $("primary-action").addEventListener("click", () => state.mode === "roam" ? interact() : placeSelected());
  $("place-btn").addEventListener("click", placeSelected);
  $("rotate-btn").addEventListener("click", rotatePiece);
  $("height-up").addEventListener("click", () => setCursorHeight(1));
  $("height-down").addEventListener("click", () => setCursorHeight(-1));
  $("remove-btn").addEventListener("click", removeAtCursor);
  $("undo-btn").addEventListener("click", undo);
  $("cancel-btn").addEventListener("click", () => toggleMode("roam"));

  $("motion").addEventListener("change", (event) => {
    state.settings.motion = event.target.value;
    saveGame();
    update();
  });

  $("help-btn").addEventListener("click", () => helpDialog.showModal());
  $("pause-btn").addEventListener("click", () => pauseDialog.showModal());
  $("pause-help").addEventListener("click", () => setTimeout(() => helpDialog.showModal(), 0));
  $("new-game-btn").addEventListener("click", () => confirmNewDialog.showModal());
  confirmNewDialog.addEventListener("close", () => {
    if (confirmNewDialog.returnValue === "confirm") newGame();
  });

  canvas.addEventListener("click", (event) => {
    canvas.focus();
    if (state.mode !== "build") return;
    const rect = canvas.getBoundingClientRect();
    const px = (event.clientX - rect.left) * (canvas.width / rect.width);
    const py = (event.clientY - rect.top) * (canvas.height / rect.height);
    state.cursor.x = Math.max(0, Math.min(COLS - 1, Math.floor(px / CELL)));
    state.cursor.y = Math.max(0, Math.min(ROWS - 1, Math.floor(py / CELL)));
    update();
  });

  document.addEventListener("keydown", (event) => {
    if (document.querySelector("dialog[open]")) return;
    const tag = event.target && event.target.tagName;
    if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(tag)) return;

    const key = event.key;
    const lower = key.toLowerCase();

    if ((event.ctrlKey || event.metaKey) && lower === "z") {
      event.preventDefault();
      undo();
      return;
    }
    if (lower === "b") {
      event.preventDefault();
      toggleMode();
      return;
    }

    const dir = key === "ArrowUp" || lower === "w" ? "N"
      : key === "ArrowRight" || lower === "d" ? "E"
      : key === "ArrowDown" || lower === "s" ? "S"
      : key === "ArrowLeft" || lower === "a" ? "W" : null;

    if (state.mode === "roam") {
      if (dir) {
        event.preventDefault();
        movePlayer(dir);
        return;
      }
      if (key === "Enter" || key === " ") {
        event.preventDefault();
        interact();
      }
      return;
    }

    if (dir) {
      event.preventDefault();
      moveCursor(dir);
      return;
    }
    if (key === "1") { event.preventDefault(); selectPiece("platform"); return; }
    if (key === "2") { event.preventDefault(); selectPiece("block"); return; }
    if (key === "3") { event.preventDefault(); selectPiece("stair"); return; }
    if (key === "Enter" || key === " ") { event.preventDefault(); placeSelected(); return; }
    if (lower === "r") { event.preventDefault(); rotatePiece(); return; }
    if (key === "PageUp") { event.preventDefault(); setCursorHeight(1); return; }
    if (key === "PageDown") { event.preventDefault(); setCursorHeight(-1); return; }
    if (key === "Delete" || key === "Backspace") { event.preventDefault(); removeAtCursor(); return; }
    if (key === "Escape") { event.preventDefault(); toggleMode("roam"); }
  });

  startDialog.addEventListener("cancel", (event) => event.preventDefault());
  startDialog.addEventListener("close", () => {
    if (startDialog.returnValue === "continue") loadGame();
    else if (startDialog.returnValue === "new") {
      if (readSave()) confirmNewDialog.showModal();
      else newGame();
    }
  });


  function initialize() {
    const saved = readSave();
    $("continue-btn").disabled = !saved;
    $("start-save-note").textContent = saved
      ? "Hay una partida guardada en este navegador."
      : storageOK ? "No hay una partida guardada todavía." : storageNote();
    state = saved ? Object.assign(createState(), saved) : createState();
    history = [];
    update();
    startDialog.showModal();
  }

  window.__IG_CONSTRUCTION_QA__ = Object.freeze({
    version: VERSION,
    getState: () => clone(state),
    getHistoryDepth: () => history.length,
    getStorageOK: () => storageOK,
    getPlacementStatus: () => clone(validatePlacement())
  });

  initialize();
})();
