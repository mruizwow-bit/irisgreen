/* Iris Green · El taller · Lenguas inventadas (R43): datos.
   - Consonantes y vocales de la tabla del Alfabeto Fonético Internacional (IPA Chart, 2020),
     con rasgos para describirlas en lenguaje claro. Los textos van en el módulo de idioma.
   - Conceptos básicos para el diccionario, inspirados en la lista de Swadesh (1955) y adaptados
     para el taller (sin conceptos violentos; con algunos cotidianos).
   - Lista curada de palabras malsonantes reales en español e inglés para filtrar el generador.
     Van escritas del revés para que no aparezcan en claro al leer el código. */
(function (root) {
  'use strict';
  var IG = root.IGSuite; if (!IG) return;
  /* [símbolo, lugar, modo, sonora] · lugares y modos en el orden de la tabla */
  var PLACES = ['bilabial', 'labiodental', 'dental', 'alveolar', 'postalveolar', 'retroflex', 'palatal', 'velar', 'uvular', 'pharyngeal', 'glottal'];
  var MANNERS = ['plosive', 'nasal', 'trill', 'tap', 'fricative', 'latfric', 'approx', 'latapprox'];
  var CONS = [
    ['p', 'bilabial', 'plosive', 0], ['b', 'bilabial', 'plosive', 1], ['t', 'alveolar', 'plosive', 0], ['d', 'alveolar', 'plosive', 1],
    ['ʈ', 'retroflex', 'plosive', 0], ['ɖ', 'retroflex', 'plosive', 1], ['c', 'palatal', 'plosive', 0], ['ɟ', 'palatal', 'plosive', 1],
    ['k', 'velar', 'plosive', 0], ['ɡ', 'velar', 'plosive', 1], ['q', 'uvular', 'plosive', 0], ['ɢ', 'uvular', 'plosive', 1], ['ʔ', 'glottal', 'plosive', 0],
    ['m', 'bilabial', 'nasal', 1], ['ɱ', 'labiodental', 'nasal', 1], ['n', 'alveolar', 'nasal', 1], ['ɳ', 'retroflex', 'nasal', 1], ['ɲ', 'palatal', 'nasal', 1], ['ŋ', 'velar', 'nasal', 1], ['ɴ', 'uvular', 'nasal', 1],
    ['ʙ', 'bilabial', 'trill', 1], ['r', 'alveolar', 'trill', 1], ['ʀ', 'uvular', 'trill', 1],
    ['ⱱ', 'labiodental', 'tap', 1], ['ɾ', 'alveolar', 'tap', 1], ['ɽ', 'retroflex', 'tap', 1],
    ['ɸ', 'bilabial', 'fricative', 0], ['β', 'bilabial', 'fricative', 1], ['f', 'labiodental', 'fricative', 0], ['v', 'labiodental', 'fricative', 1],
    ['θ', 'dental', 'fricative', 0], ['ð', 'dental', 'fricative', 1], ['s', 'alveolar', 'fricative', 0], ['z', 'alveolar', 'fricative', 1],
    ['ʃ', 'postalveolar', 'fricative', 0], ['ʒ', 'postalveolar', 'fricative', 1], ['ʂ', 'retroflex', 'fricative', 0], ['ʐ', 'retroflex', 'fricative', 1],
    ['ç', 'palatal', 'fricative', 0], ['ʝ', 'palatal', 'fricative', 1], ['x', 'velar', 'fricative', 0], ['ɣ', 'velar', 'fricative', 1],
    ['χ', 'uvular', 'fricative', 0], ['ʁ', 'uvular', 'fricative', 1], ['ħ', 'pharyngeal', 'fricative', 0], ['ʕ', 'pharyngeal', 'fricative', 1], ['h', 'glottal', 'fricative', 0], ['ɦ', 'glottal', 'fricative', 1],
    ['ɬ', 'alveolar', 'latfric', 0], ['ɮ', 'alveolar', 'latfric', 1],
    ['ʋ', 'labiodental', 'approx', 1], ['ɹ', 'alveolar', 'approx', 1], ['ɻ', 'retroflex', 'approx', 1], ['j', 'palatal', 'approx', 1], ['ɰ', 'velar', 'approx', 1],
    ['l', 'alveolar', 'latapprox', 1], ['ɭ', 'retroflex', 'latapprox', 1], ['ʎ', 'palatal', 'latapprox', 1], ['ʟ', 'velar', 'latapprox', 1]
  ];
  /* Otros símbolos de la tabla: africadas (con dos símbolos) y aproximantes labiovelares */
  var OTHER = [['tʃ', 'postalveolar', 'affricate', 0], ['dʒ', 'postalveolar', 'affricate', 1], ['ts', 'alveolar', 'affricate', 0], ['dz', 'alveolar', 'affricate', 1],
    ['w', 'labialvelar', 'approx', 1], ['ʍ', 'labialvelar', 'fricative', 0]];
  /* [símbolo, altura, posición, redondeada] */
  var HEIGHTS = ['close', 'nearclose', 'closemid', 'mid', 'openmid', 'nearopen', 'open'];
  var BACKS = ['front', 'central', 'back'];
  var VOWELS = [
    ['i', 'close', 'front', 0], ['y', 'close', 'front', 1], ['ɨ', 'close', 'central', 0], ['ʉ', 'close', 'central', 1], ['ɯ', 'close', 'back', 0], ['u', 'close', 'back', 1],
    ['ɪ', 'nearclose', 'front', 0], ['ʏ', 'nearclose', 'front', 1], ['ʊ', 'nearclose', 'back', 1],
    ['e', 'closemid', 'front', 0], ['ø', 'closemid', 'front', 1], ['ɘ', 'closemid', 'central', 0], ['ɵ', 'closemid', 'central', 1], ['ɤ', 'closemid', 'back', 0], ['o', 'closemid', 'back', 1],
    ['ə', 'mid', 'central', 0],
    ['ɛ', 'openmid', 'front', 0], ['œ', 'openmid', 'front', 1], ['ɜ', 'openmid', 'central', 0], ['ɞ', 'openmid', 'central', 1], ['ʌ', 'openmid', 'back', 0], ['ɔ', 'openmid', 'back', 1],
    ['æ', 'nearopen', 'front', 0], ['ɐ', 'nearopen', 'central', 0],
    ['a', 'open', 'front', 0], ['ɶ', 'open', 'front', 1], ['ɑ', 'open', 'back', 0], ['ɒ', 'open', 'back', 1]
  ];
  /* Clave ASCII de cada símbolo para los textos (ejemplos) del módulo de idioma */
  var KEYS = { 'ʈ': 'tr', 'ɖ': 'dr', 'ɟ': 'jb', 'ɡ': 'g', 'ɢ': 'gu', 'ʔ': 'q7', 'ɱ': 'mf', 'ɳ': 'nr', 'ɲ': 'ny', 'ŋ': 'ng', 'ɴ': 'nu', 'ʙ': 'bt', 'ʀ': 'ru', 'ⱱ': 'vt',
    'ɾ': 'rt', 'ɽ': 'rrt', 'ɸ': 'ph', 'β': 'bh', 'θ': 'th', 'ð': 'dh', 'ʃ': 'sh', 'ʒ': 'zh', 'ʂ': 'sr', 'ʐ': 'zr', 'ç': 'cc', 'ʝ': 'jc', 'ɣ': 'gh', 'χ': 'xu', 'ʁ': 'ru2',
    'ħ': 'hp', 'ʕ': 'ap', 'ɦ': 'hv', 'ɬ': 'lh', 'ɮ': 'lz', 'ʋ': 'va', 'ɹ': 'ra', 'ɻ': 'rra', 'ɰ': 'mw', 'ɭ': 'lr', 'ʎ': 'll', 'ʟ': 'lv', 'tʃ': 'ch', 'dʒ': 'dj', 'ʍ': 'wh',
    'ɨ': 'i1', 'ʉ': 'u1', 'ɯ': 'm1', 'ɪ': 'ii', 'ʏ': 'yy', 'ʊ': 'uu', 'ø': 'o2', 'ɘ': 'e3', 'ɵ': 'o3', 'ɤ': 'rh', 'ə': 'sw', 'ɛ': 'eh', 'œ': 'oe', 'ɜ': 'e4', 'ɞ': 'o4',
    'ʌ': 'uh', 'ɔ': 'oh', 'æ': 'ae', 'ɐ': 'a3', 'ɶ': 'oe2', 'ɑ': 'ah', 'ɒ': 'ow' };
  function key(sym) { return KEYS[sym] || sym; }
  /* Romanización por defecto: cómo se escribe cada sonido con letras latinas. Se puede cambiar. */
  var ROMAN = { 'ʈ': 'ṭ', 'ɖ': 'ḍ', 'c': 'ky', 'ɟ': 'gy', 'ɡ': 'g', 'q': 'q', 'ɢ': 'ġ', 'ʔ': '\'', 'ɱ': 'mv', 'ɳ': 'ṇ', 'ɲ': 'ñ', 'ŋ': 'ng', 'ɴ': 'nq',
    'ʙ': 'bb', 'r': 'rr', 'ʀ': 'rq', 'ⱱ': 'vv', 'ɾ': 'r', 'ɽ': 'ṛ', 'ɸ': 'ph', 'β': 'bh', 'θ': 'th', 'ð': 'dh', 'ʃ': 'sh', 'ʒ': 'zh', 'ʂ': 'ṣ', 'ʐ': 'ẓ',
    'ç': 'hy', 'ʝ': 'yh', 'x': 'kh', 'ɣ': 'gh', 'χ': 'qh', 'ʁ': 'rh', 'ħ': 'ḥ', 'ʕ': 'ʿ', 'h': 'h', 'ɦ': 'hh', 'ɬ': 'lh', 'ɮ': 'lz', 'ʋ': 'vw', 'ɹ': 'r', 'ɻ': 'ṛr',
    'j': 'y', 'ɰ': 'gw', 'ɭ': 'ḷ', 'ʎ': 'ly', 'ʟ': 'lq', 'tʃ': 'ch', 'dʒ': 'j', 'ts': 'ts', 'dz': 'dz', 'w': 'w', 'ʍ': 'hw',
    'y': 'ü', 'ɨ': 'ï', 'ʉ': 'ű', 'ɯ': 'ı', 'ɪ': 'ì', 'ʏ': 'ǘ', 'ʊ': 'ù', 'ø': 'ö', 'ɘ': 'ė', 'ɵ': 'ȯ', 'ɤ': 'õ', 'ə': 'ë', 'ɛ': 'è', 'œ': 'œ', 'ɜ': 'ê',
    'ɞ': 'ǒ', 'ʌ': 'â', 'ɔ': 'ò', 'æ': 'æ', 'ɐ': 'ă', 'ɶ': 'ǣ', 'ɑ': 'à', 'ɒ': 'å' };
  var ROMAN_ES = { 'x': 'j', 'dʒ': 'dy', 'ʎ': 'll' };
  var ROMAN_EN = { 'ɲ': 'ny' };
  function roman(sym, lang) { var o = (lang === 'en' ? ROMAN_EN : ROMAN_ES)[sym]; return o || ROMAN[sym] || sym; }
  /* Lectura aproximada con letras corrientes para el filtro de palabras malsonantes */
  var PLAIN = { 'ʃ': 'sh', 'tʃ': 'ch', 'dʒ': 'j', 'ʒ': 'sh', 'ɡ': 'g', 'x': 'j', 'χ': 'j', 'ɣ': 'g', 'ɾ': 'r', 'r': 'r', 'ɹ': 'r', 'ʁ': 'r', 'ʀ': 'r', 'ɲ': 'ni', 'ŋ': 'n',
    'θ': 's', 'ð': 'd', 'β': 'b', 'ɸ': 'f', 'j': 'i', 'w': 'u', 'ʎ': 'i', 'ɛ': 'e', 'ə': 'e', 'ɪ': 'i', 'ʊ': 'u', 'ɔ': 'o', 'æ': 'a', 'ɑ': 'a', 'ʌ': 'a', 'ɒ': 'o', 'ɐ': 'a', 'y': 'u', 'ø': 'e', 'œ': 'e', 'c': 'k', 'ɟ': 'g', 'q': 'k', 'ʔ': '', 'h': '', 'ħ': '', 'ɦ': '' };

  var CONCEPTS = [
    ['i', 'pron', 'yo', 'I'], ['you', 'pron', 'tú', 'you'], ['we', 'pron', 'nosotros', 'we'], ['this', 'pron', 'esto', 'this'], ['that', 'pron', 'eso', 'that'], ['who', 'pron', 'quién', 'who'], ['what', 'pron', 'qué', 'what'],
    ['not', 'part', 'no', 'not'], ['and', 'part', 'y', 'and'], ['yes', 'part', 'sí', 'yes'], ['hello', 'part', 'hola', 'hello'],
    ['one', 'num', 'uno', 'one'], ['two', 'num', 'dos', 'two'], ['three', 'num', 'tres', 'three'], ['many', 'num', 'muchos', 'many'], ['all', 'num', 'todo', 'all'],
    ['big', 'adj', 'grande', 'big'], ['small', 'adj', 'pequeño', 'small'], ['long', 'adj', 'largo', 'long'], ['new', 'adj', 'nuevo', 'new'], ['old', 'adj', 'viejo', 'old'],
    ['good', 'adj', 'bueno', 'good'], ['bad', 'adj', 'malo', 'bad'], ['hot', 'adj', 'caliente', 'hot'], ['cold', 'adj', 'frío', 'cold'], ['full', 'adj', 'lleno', 'full'],
    ['dry', 'adj', 'seco', 'dry'], ['round', 'adj', 'redondo', 'round'], ['red', 'adj', 'rojo', 'red'], ['green', 'adj', 'verde', 'green'], ['yellow', 'adj', 'amarillo', 'yellow'],
    ['white', 'adj', 'blanco', 'white'], ['black', 'adj', 'negro', 'black'], ['blue', 'adj', 'azul', 'blue'], ['happy', 'adj', 'contento', 'happy'], ['fast', 'adj', 'rápido', 'fast'],
    ['person', 'n', 'persona', 'person'], ['woman', 'n', 'mujer', 'woman'], ['man', 'n', 'hombre', 'man'], ['child', 'n', 'niño o niña', 'child'], ['friend', 'n', 'amigo o amiga', 'friend'],
    ['mother', 'n', 'madre', 'mother'], ['father', 'n', 'padre', 'father'], ['name', 'n', 'nombre', 'name'], ['fish', 'n', 'pez', 'fish'], ['bird', 'n', 'pájaro', 'bird'],
    ['dog', 'n', 'perro', 'dog'], ['cat', 'n', 'gato', 'cat'], ['tree', 'n', 'árbol', 'tree'], ['seed', 'n', 'semilla', 'seed'], ['leaf', 'n', 'hoja', 'leaf'],
    ['root', 'n', 'raíz', 'root'], ['flower', 'n', 'flor', 'flower'], ['egg', 'n', 'huevo', 'egg'], ['feather', 'n', 'pluma', 'feather'], ['hair', 'n', 'pelo', 'hair'],
    ['head', 'n', 'cabeza', 'head'], ['ear', 'n', 'oreja', 'ear'], ['eye', 'n', 'ojo', 'eye'], ['nose', 'n', 'nariz', 'nose'], ['mouth', 'n', 'boca', 'mouth'],
    ['tooth', 'n', 'diente', 'tooth'], ['tongue', 'n', 'lengua', 'tongue'], ['hand', 'n', 'mano', 'hand'], ['foot', 'n', 'pie', 'foot'], ['heart', 'n', 'corazón', 'heart'],
    ['sun', 'n', 'sol', 'sun'], ['moon', 'n', 'luna', 'moon'], ['star', 'n', 'estrella', 'star'], ['water', 'n', 'agua', 'water'], ['rain', 'n', 'lluvia', 'rain'],
    ['river', 'n', 'río', 'river'], ['sea', 'n', 'mar', 'sea'], ['stone', 'n', 'piedra', 'stone'], ['sand', 'n', 'arena', 'sand'], ['earth', 'n', 'tierra', 'earth'],
    ['cloud', 'n', 'nube', 'cloud'], ['wind', 'n', 'viento', 'wind'], ['fire', 'n', 'fuego', 'fire'], ['smoke', 'n', 'humo', 'smoke'], ['mountain', 'n', 'montaña', 'mountain'],
    ['path', 'n', 'camino', 'path'], ['night', 'n', 'noche', 'night'], ['day', 'n', 'día', 'day'], ['house', 'n', 'casa', 'house'], ['food', 'n', 'comida', 'food'],
    ['song', 'n', 'canción', 'song'], ['book', 'n', 'libro', 'book'], ['light', 'n', 'luz', 'light'],
    ['eat', 'v', 'comer', 'eat'], ['drink', 'v', 'beber', 'drink'], ['see', 'v', 'ver', 'see'], ['hear', 'v', 'oír', 'hear'], ['know', 'v', 'saber', 'know'],
    ['sleep', 'v', 'dormir', 'sleep'], ['walk', 'v', 'caminar', 'walk'], ['swim', 'v', 'nadar', 'swim'], ['fly', 'v', 'volar', 'fly'], ['come', 'v', 'venir', 'come'],
    ['give', 'v', 'dar', 'give'], ['say', 'v', 'decir', 'say'], ['sing', 'v', 'cantar', 'sing'], ['play', 'v', 'jugar', 'play'], ['love', 'v', 'querer', 'love'],
    ['make', 'v', 'hacer', 'make'], ['live', 'v', 'vivir', 'live'], ['laugh', 'v', 'reír', 'laugh'], ['think', 'v', 'pensar', 'think'], ['find', 'v', 'encontrar', 'find']
  ];

  /* ---------- Filtro de palabras malsonantes (ES/EN) ---------- */
  var BAD_REV = ['atup', 'otup', 'allop', 'onoc', 'adreim', 'redoj', 'odidoj', 'norbac', 'sallopilig', 'ojednep', 'agrev', 'oluc', 'nojoc', 'aciram', 'nociram', 'arroz',
    'rallof', 'agnihc', 'nomam', 'orejap', 'atet', 'ragac', 'acac', 'odep', 'raem', 'noem', 'atoidi', 'licebmi', 'lamronbus', 'odasarter', 'olognom', 'atargen', 'acadus',
    'notup', 'arrep', 'olluipac', 'aitsoh', 'ojarac', 'izan', 'reltih',
    'yssup', 'elohssa', 'daehkcid', 'gnikcuf',
    'kcuf', 'tihs', 'tnuc', 'kcid', 'kcoc', 'ssip', 'hctib', 'dratsab', 'tawt', 'knaw', 'tuls', 'erohw', 'gaf', 'ggin', 'aggin', 'drater', 'parc', 'esra', 'ssa',
    'stit', 'nrop', 'xes', 'epar', 'muc', 'zzij', 'odlid', 'boob', 'nmad', 'kcollob', 'reggub', 'kcirp', 'knups', 'drut', 'poop'];
  function norm(w) {
    var s = String(w || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    s = s.replace(/ph/g, 'f').replace(/[kq]/g, 'c').replace(/v/g, 'b').replace(/z/g, 's').replace(/y/g, 'i').replace(/w/g, 'u').replace(/h/g, '').replace(/[^a-zñ]/g, '').replace(/ñ/g, 'n');
    return s.replace(/(.)\1+/g, '$1');
  }
  var BAD = BAD_REV.map(function (r) { return norm(r.split('').reverse().join('')); });
  function isBad(forms) {
    return forms.some(function (f) {
      var w = norm(f); if (!w) return false;
      return BAD.some(function (b) { return b.length >= 4 ? w.indexOf(b) >= 0 : (w === b || (w.indexOf(b) === 0 && w.length <= b.length + 1)); });
    });
  }
  function plain(ph) { return ph.map(function (p) { return PLAIN[p] !== undefined ? PLAIN[p] : p; }).join(''); }

  IG.LenguasDatos = { PLACES: PLACES, MANNERS: MANNERS, CONS: CONS, OTHER: OTHER, HEIGHTS: HEIGHTS, BACKS: BACKS, VOWELS: VOWELS, CONCEPTS: CONCEPTS,
    key: key, roman: roman, isBad: isBad, plain: plain };
})(window);
