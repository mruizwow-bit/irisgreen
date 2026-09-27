# R42-A7 · HUMAN QA rebuild · media provenance

Natural scenes no longer use the flat procedural scene as the primary visual.
They load the original Wikimedia Commons video only after an explicit user action.
No third-party video request occurs before the person starts a natural scene.
The video element is muted; Iris Green controls sound separately.

| Scene | Source | Author | Licence | Use |
|---|---|---|---|---|
| Sea / Mar | [Waves of the sea (Video).webm](https://commons.wikimedia.org/wiki/File:Waves_of_the_sea_(Video).webm) | Amada44 | CC BY-SA 4.0 | Original video streamed after action; Iris Green sound remains separate |
| Rain / Lluvia | [Rain 001.webm](https://commons.wikimedia.org/wiki/File:Rain_001.webm) | Amuzujoe | CC BY-SA 4.0 | Original video streamed after action; no thunder added |
| River / Río | [Bubbling stream at Cascade Springs, May 17.webm](https://commons.wikimedia.org/wiki/File:Bubbling_stream_at_Cascade_Springs,_May_17.webm) | An Errant Knight | CC BY-SA 4.0 | Original video streamed after action |
| Night / Noche | [Aurora borealis timelapse.webm](https://commons.wikimedia.org/wiki/File:Aurora_borealis_timelapse.webm) | Harriniva Hotels&Safaris | CC BY 3.0 | Original video streamed after action; playback slowed for calm viewing |
| Aquarium / Acuario | [Aquarium of Cattolica - Unidentified fish.webm](https://commons.wikimedia.org/wiki/File:Aquarium_of_Cattolica_-_Unidentified_fish.webm) | Horcrux92 | CC BY-SA 4.0 | Original video streamed after action |
| Jellyfish / Medusas | [Phantom Jellyfish Off of the Melchior Islands.webm](https://commons.wikimedia.org/wiki/File:Phantom_Jellyfish_Off_of_the_Melchior_Islands.webm) | MasterfulNerd | CC BY 4.0 | Original video streamed after action; playback slowed |
| Octopus / Pulpos | [Octopus Vulgaris - Poulpe commun.webm](https://commons.wikimedia.org/wiki/File:Octopus_Vulgaris_-_Poulpe_commun.webm) | Ericsfr | CC BY-SA 4.0 | Original video streamed after action; playback slowed; video audio stays muted |

## Local/synthetic scenes
Bubble tube and fibre optics remain local GPU-rendered sensory scenes because these are synthetic sensory environments rather than natural landscapes.

## Accessibility and privacy
- No autoplay.
- Natural video URLs are assigned only after an explicit start action.
- prefers-reduced-motion, Iris Green Reduce motion and Save-Data keep the static/local fallback.
- Every natural scene exposes a source/licence link next to the stage.
- Video audio is muted; no voices or incidental field audio are exposed.
- If remote media fails, the local fallback remains usable.

## Product boundary
This file documents the visual source. It does not claim that Wikimedia, any author or Creative Commons endorses Iris Green.
