window.PRISMA_FOSSILS_PILOT = Object.freeze({
  version: "R02-pilot-3",
  sourceBaseSha256: "21a6663524368ad2322f06e405d6af1417e42b21925d4a2123c9c29934ae668c",
  brushRadius: 0.105,
  encounters: [
    {
      id: "trilobites",
      title: {es:"Una forma segmentada", en:"A segmented form"},
      clue: {es:"Hay un borde curvo y varias líneas repetidas bajo la cobertura.", en:"There is a curved edge and several repeating lines under the cover."},
      initialReveal: [{x:0.50,y:0.35,r:0.060}],
      requiredZones: ["thorax_segments"],
      zones: [{
        id:"thorax_segments",
        rect:[0.27,0.38,0.72,0.73],
        minSamples:4,
        samples:[[0.44,0.50],[0.50,0.50],[0.56,0.50],[0.44,0.58],[0.50,0.58],[0.56,0.58]],
        label:{es:"Segmentos repetidos del tórax",en:"Repeating thoracic segments"},
        observation:{es:"En la parte media aparecen bandas repetidas una tras otra: aquí la segmentación es el rasgo que conviene mirar.",en:"Across the middle, repeating bands appear one after another: segmentation is the feature to look at here."}
      }],
      identity:{
        name:{es:"Trilobites",en:"Trilobites"},
        text:{es:"Esta representación corresponde a un trilobite. Los trilobites compartían un plan corporal con cefalón, tórax segmentado y pigidio; en esta imagen destaca especialmente la repetición de segmentos del tórax.",en:"This representation corresponds to a trilobite. Trilobites shared a body plan with a cephalon, segmented thorax and pygidium; this image especially shows the repeating thoracic segments."},
        limit:{es:"La imagen es una representación digital del tipo de resto conservado, no un espécimen concreto ni una base suficiente para identificar una especie.",en:"The image is a digital representation of the kind of preserved remain, not a specific specimen and not enough to identify a species."}
      },
      sources:[{title:"Natural History Museum · How trilobites conquered prehistoric oceans",url:"https://www.nhm.ac.uk/discover/how-trilobites-conquered-prehistoric-oceans.html",consulted:"2026-10-06",supports:"cephalon, segmented thorax and pygidium"}]
    },
    {
      id: "dimetrodon",
      title: {es:"Una prolongación sobre una base",en:"A projection above a base"},
      clue: {es:"Una pieza estrecha se prolonga mucho hacia arriba desde una zona más ancha.",en:"A narrow piece extends far upward from a broader area."},
      initialReveal: [{x:0.50,y:0.61,r:0.055}],
      requiredZones: ["spine","junction"],
      zones: [
        {id:"spine",rect:[0.40,0.15,0.60,0.59],guide:[0.50,0.37],minSamples:3,samples:[[0.46,0.34],[0.50,0.30],[0.50,0.37],[0.50,0.44],[0.54,0.37]],label:{es:"Prolongación estrecha",en:"Narrow projection"},observation:{es:"Se hace visible una prolongación ósea muy larga y estrecha.",en:"A very long, narrow bony projection becomes visible."}},
        {id:"junction",rect:[0.30,0.62,0.70,0.82],guide:[0.50,0.72],minSamples:3,samples:[[0.44,0.69],[0.50,0.69],[0.56,0.69],[0.44,0.75],[0.50,0.75],[0.56,0.75]],label:{es:"Continuidad con la base",en:"Continuity with the base"},observation:{es:"Más abajo se ve que esa prolongación continúa hasta una base vertebral más ancha; no son dos piezas separadas.",en:"Lower down, the projection can be seen continuing into a broader vertebral base; they are not two separate pieces."}}
      ],
      identity:{
        name:{es:"Dimetrodon",en:"Dimetrodon"},
        text:{es:"Esta representación muestra una vértebra de Dimetrodon con una espina neural muy alargada, el tipo de estructura que sostenía su conocida vela dorsal.",en:"This representation shows a Dimetrodon vertebra with a greatly elongated neural spine, the kind of structure that supported its well-known dorsal sail."},
        limit:{es:"La función exacta de la vela ha sido debatida. Aquí sólo observamos la continuidad entre la espina alargada y la vértebra representada.",en:"The exact function of the sail has been debated. Here we only observe the continuity between the elongated spine and the represented vertebra."}
      },
      sources:[
        {title:"Smithsonian Magazine · Five Incredible Fossils From Across the World · Dimetrodon",url:"https://www.smithsonianmag.com/blogs/smithsonian-books/2023/11/16/five-incredible-fossils-from-across-the-world/",consulted:"2026-10-06",supports:"greatly elongated spines on the vertebrae; function debated"},
        {title:"American Museum of Natural History · Dimetrodon Fossil Skeleton",url:"https://www.amnh.org/exhibitions/permanent/primitive-mammals/dimetrodon",consulted:"2026-10-06",supports:"Dimetrodon and dorsal sail context"}
      ]
    },
    {
      id: "meganeura",
      title: {es:"Una impresión con líneas finas",en:"An impression with fine lines"},
      clue: {es:"Bajo la cobertura aparece una forma alargada con un borde claro y muchas líneas internas.",en:"Under the cover is an elongated shape with a clear edge and many internal lines."},
      initialReveal: [{x:0.12,y:0.50,r:0.050}],
      requiredZones: ["outline","veins"],
      zones: [
        {id:"outline",rect:[0.11,0.32,0.89,0.70],guide:[0.20,0.50],minSamples:3,samples:[[0.17,0.46],[0.20,0.43],[0.20,0.50],[0.20,0.57],[0.23,0.50]],label:{es:"Contorno de la impresión",en:"Outline of the impression"},observation:{es:"La roca conserva una impresión alargada con el contorno de un ala.",en:"The rock preserves an elongated impression with the outline of a wing."}},
        {id:"veins",rect:[0.24,0.39,0.72,0.62],guide:[0.46,0.50],minSamples:4,samples:[[0.40,0.46],[0.46,0.46],[0.52,0.46],[0.40,0.54],[0.46,0.54],[0.52,0.54]],label:{es:"Red de líneas internas",en:"Network of internal lines"},observation:{es:"Dentro de la impresión se distingue una red de líneas finas compatible con la venación representada del ala.",en:"Inside the impression, a network of fine lines is visible, consistent with the represented wing venation."}}
      ],
      identity:{
        name:{es:"Meganeura",en:"Meganeura"},
        text:{es:"Esta representación corresponde a la impresión de un ala de Meganeura, uno de los grandes insectos voladores del Carbonífero. Lo que observamos aquí es la forma de ala y la red de líneas representada en la impresión.",en:"This representation corresponds to a Meganeura wing impression, one of the giant flying insects of the Carboniferous. Here we observe the wing shape and the represented network of lines in the impression."},
        limit:{es:"No es un fósil concreto de museo. La imagen es una representación digital y no autoriza a deducir relieve, reverso ni anatomía que no aparezca dibujada.",en:"This is not a specific museum fossil. The image is a digital representation and does not justify inferring relief, reverse side or anatomy that is not depicted."}
      },
      sources:[
        {title:"Natural History Museum · Griffinflies: The earliest flying insects",url:"https://www.nhm.ac.uk/discover/giant-dragonflies.html",consulted:"2026-10-06",supports:"Meganeura as a giant dragonfly-like insect; fossil wing impressions"},
        {title:"Natural History Museum · Dragonflies: The ultimate hunters",url:"https://www.nhm.ac.uk/discover/dragonflies-the-ultimate-hunters.html",consulted:"2026-10-06",supports:"dragonfly wings show a web of veins"}
      ]
    }
  ]
});