# R52 · A3 correction · current Sabik + Motion R37

## Product correction from María · 28/09/2026

The previous A3 interpretation was wrong: it mounted the historical `sabik-preview` visual donor.

The current product rule is:

**keep the current/new Sabik visual identity and restore/preserve Motion R37 on that identity.**

R37 is the motion system that was lost. It is not the visual identity to replace.

## Base

A2 correction base: `5f759464dfa6f78d1843f9414f5b2207da33700a`  
A2 base tree: `89927a186c9e9550fe8d996d8904d4274b353eb8`  
Correction branch: `agent3/r52-correct-new-sabik-r37-motion-20260928`

## Current Sabik identity kept byte-exact

The five Web R01 masters remain the visual identity:

- `web_presente.png` · Git blob `c18d8f2aae53c281e02baeeac0ccd832acca4ecb`
- `web_orientar.png` · Git blob `093abfdb63888f76924f0d50e076bc48314d6b21`
- `web_transicion.png` · Git blob `66209eee4efb61e71e4bedc8251b45cc93df3080`
- `web_pausa.png` · Git blob `d2b83e4e5ee66832a26f649674de209b11039485`
- `web_confirmar.png` · Git blob `7b4e1a22fc4ae00387b48cb5d372e7342af5ce6d`

No current master is recolored, redrawn or replaced.

## Motion restored

`sabik/sabik-motion-r37.js` remains authoritative.

R37 behavior:
- PRESENTE: stable/idle;
- ORIENTAR: finite NORMAL/REDUCIDO transition;
- TRANSICION: finite transition and return to the requested stable state;
- PAUSA: finite state transition;
- CONFIRMAR: finite transition and return to PRESENTE;
- SIN_MOVIMIENTO: no animation;
- system reduced motion never forces NORMAL;
- no continuous wait loop, RAF loop or interval loop.

`sabik/sabik-web-r01.js` again loads the current `web_*.png` masters and applies R37 transitions to `#sabik-web-master`.

## Historical donor removed

The correction removes:
- `sabik/assets/sabik-base-640.webp`;
- `sabik-layered-avatar`;
- donor back/front SVG layers;
- donor orbit rings and dots;
- `sabikMeasuredPrecession`;
- `sabikPresenceWave`;
- `sabikVoiceRipple`;
- continuous donor breathing/orbit motion.

The historical `sabik-preview@fc5cdf...` is not a visual source for the current Sabik.

## Voice compatibility

A2 already calls:

`SabikWebPresentation.setVoiceActive(playing)`

The correction keeps that method as a presentation-neutral compatibility hook. It records voice activity without swapping the master, importing the old donor or inventing a sixth B3 state.

Any future visible voice reaction must be defined on the current Sabik identity, not by restoring the historical donor.

## Regression gates

The R52 tests now fail if:
- the historical WebP returns;
- layered donor SVG markup returns;
- orbit/presence-wave donor keyframes return;
- current Web R01 master blobs change;
- R37 stops controlling state motion;
- R37 becomes a continuous loop;
- NORMAL/REDUCIDO/SIN_MOVIMIENTO behavior changes;
- voice activity replaces the current Sabik visual.

Marker:

`R52_A3_CURRENT_SABIK_R37_MOTION_CORRECTION_READY_FOR_A2`
