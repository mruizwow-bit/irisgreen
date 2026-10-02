/* Iris Green · protección infantil del Taller (R47 · contrato #293/#302).
   Filtra ANTES de construir tarjetas, sugerencias, búsqueda y enlaces relacionados.
   No analiza nada de lo que crea la persona: solo clasifica el contenido que Iris Green muestra.
   Sin almacenamiento, sin red y sin identidad: la etapa llega únicamente por la dirección. */
(function (root) {
  'use strict';
  var SENS = { S0_GENERAL: 0, S1_SENSITIVE: 1, S2_HIGH_SENSITIVITY: 2 };
  var STAGES = { '': 'DEFAULT', any: 'DEFAULT', child: 'INFANCIA', teen: 'ADOLESCENCIA', adult: 'ADULTEZ',
    infancia: 'INFANCIA', adolescencia: 'ADOLESCENCIA', adultez: 'ADULTEZ',
    childhood: 'INFANCIA', adolescence: 'ADOLESCENCIA', adulthood: 'ADULTEZ', age_0_12:'INFANCIA', age_13_17:'ADOLESCENCIA', age_18_plus:'ADULTEZ', all_ages:'DEFAULT' };

  function stage(value) { return STAGES[String(value == null ? '' : value).toLowerCase()] || 'DEFAULT'; }

  /* Un elemento sin clasificar NUNCA se muestra: el gate de entrega exige 0 sin clasificar. */
  function classified(item) {
    return !!(item && item.sensitivity in SENS && item.discovery && Array.isArray(item.audience) && item.audience.length);
  }

  /* intent: 'browse' (listas, búsqueda, sugerencias, relacionados) o 'direct' (la persona lo pide). */
  function allow(item, who, intent) {
    if (!classified(item)) return false;
    var s = SENS[item.sensitivity], st = stage(who), direct = intent === 'direct';
    if (item.discovery === 'INTENTIONAL_ONLY' && !direct) return false;
    if (s === 0) return true;
    if (st === 'DEFAULT' || st === 'INFANCIA') return false;              /* SAFE_BY_DEFAULT */
    if (st === 'ADOLESCENCIA') return s === 1 && direct;                  /* nunca incidental, nunca S2 */
    return direct;                                                        /* ADULTEZ: solo con intención */
  }

  /* Variante segura: cuando el elemento no se puede mostrar tal cual pero existe una versión segura. */
  function resolve(item, who, intent, index) {
    if (allow(item, who, intent)) return item;
    var safe = item && item.safe_variant_id && index ? index[item.safe_variant_id] : null;
    return safe && allow(safe, who, intent) ? safe : null;
  }

  function filter(list, who, intent) {
    return (list || []).filter(function (it) { return allow(it, who, intent); });
  }

  function audit(list) {
    var bad = (list || []).filter(function (it) { return !classified(it); });
    return { total: (list || []).length, unclassified: bad.length, items: bad.map(function (i) { return i && i.id; }) };
  }

  root.IGChildSafe = { allow: allow, filter: filter, resolve: resolve, audit: audit, classified: classified, stage: stage, LEVELS: SENS };
})(typeof globalThis !== 'undefined' ? globalThis : this);