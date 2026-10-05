"use strict";
(() => {
  const canvas = document.getElementById("world");
  const ctx = canvas.getContext("2d");
  const $ = id => document.getElementById(id);

  const TILE_W = 132;
  const TILE_H = 66;
  const Z_PX = 72;
  const ORIGIN = { x: 365, y: 115 };

  // World model. The renderer never invents screen coordinates independently.
  // Every visible surface is a world coordinate (x,y,z).
  const low = [
    {id:"L00",x:0,y:0,z:0,label:"plataforma baja"},
    {id:"L01",x:0,y:1,z:0,label:"plataforma baja"},
    {id:"L10",x:1,y:0,z:0,label:"plataforma baja"},
    {id:"L11",x:1,y:1,z:0,label:"plataforma baja"}
  ];
  const high = [
    {id:"H30",x:3,y:0,z:1,label:"plataforma alta"},
    {id:"H31",x:3,y:1,z:1,label:"plataforma alta"},
    {id:"H40",x:4,y:0,z:1,label:"plataforma alta"},
    {id:"H41",x:4,y:1,z:1,label:"plataforma alta"}
  ];
  const gap = {id:"G20",x:2,y:0,z:0,label:"hueco de transición"};
  const surfaces = [...low, gap, ...high];

  const state = {
    selectedId: "G20",
    orientation: "E",
    rampPlaced: false,
    pathIndex: 0,
    player: {x:0,y:0,z:0}
  };
  const route = [
    {x:0,y:0,z:0,label:"bajo 1"},
    {x:1,y:0,z:0,label:"bajo 2"},
    {x:2,y:0,z:0.5,label:"rampa"},
    {x:3,y:0,z:1,label:"alto 1"},
    {x:4,y:0,z:1,label:"alto 2"}
  ];

  function project({x,y,z}) {
    return {
      x: ORIGIN.x + (x-y) * TILE_W/2,
      y: ORIGIN.y + (x+y) * TILE_H/2 - z * Z_PX
    };
  }

  function inverseOnPlane(sx, sy, z) {
    // Inverse of project for a known z plane.
    const dx = (sx - ORIGIN.x) / (TILE_W/2);
    const dy = (sy - ORIGIN.y + z*Z_PX) / (TILE_H/2);
    return {x:(dx+dy)/2, y:(dy-dx)/2, z};
  }

  function diamond(surface) {
    const c = project(surface);
    return [
      {x:c.x, y:c.y-TILE_H/2},
      {x:c.x+TILE_W/2, y:c.y},
      {x:c.x, y:c.y+TILE_H/2},
      {x:c.x-TILE_W/2, y:c.y}
    ];
  }

  function pointInPoly(p, poly) {
    let inside=false;
    for(let i=0,j=poly.length-1;i<poly.length;j=i++){
      const a=poly[i], b=poly[j];
      const hit=((a.y>p.y)!==(b.y>p.y)) &&
        (p.x < (b.x-a.x)*(p.y-a.y)/((b.y-a.y)||1e-9)+a.x);
      if(hit) inside=!inside;
    }
    return inside;
  }

  function pick(sx,sy) {
    // Highest visible surface wins. Picking and drawing use the same project().
    return [...surfaces]
      .sort((a,b)=>b.z-a.z || (b.x+b.y)-(a.x+a.y))
      .find(s=>pointInPoly({x:sx,y:sy},diamond(s))) || null;
  }

  function selected() {
    return surfaces.find(s=>s.id===state.selectedId);
  }

  function preview() {
    const s=selected();
    const valid=s.id==="G20" && state.orientation==="E" && !state.rampPlaced;
    return {
      valid,
      reason: state.rampPlaced ? "La rampa ya está colocada."
        : s.id!=="G20" ? "La rampa sólo pertenece al hueco de transición."
        : state.orientation!=="E" ? "La rampa debe subir de oeste a este."
        : "Apoyo bajo al oeste y superficie alta al este."
    };
  }

  function poly(points, fill, stroke="#244454", width=2) {
    ctx.beginPath();
    points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.closePath();
    ctx.fillStyle=fill; ctx.fill();
    ctx.strokeStyle=stroke; ctx.lineWidth=width; ctx.stroke();
  }

  function drawTile(s, fill) {
    poly(diamond(s), fill);
    const p=project(s);
    ctx.fillStyle="#163246";
    ctx.font="700 14px system-ui";
    ctx.textAlign="center";
    ctx.fillText(`z${s.z}`,p.x,p.y+5);
  }

  function drawRamp(alpha=1) {
    const a=project({x:2,y:0,z:0});
    const b=project({x:3,y:0,z:1});
    const leftA={x:a.x-TILE_W/2+8,y:a.y};
    const rightA={x:a.x+TILE_W/2-8,y:a.y};
    const leftB={x:b.x-TILE_W/2+8,y:b.y};
    const rightB={x:b.x+TILE_W/2-8,y:b.y};
    ctx.save(); ctx.globalAlpha=alpha;
    poly([leftA,rightA,rightB,leftB], state.orientation==="E"?"#c18042":"#9b6a5c", "#684423", 3);
    for(let i=1;i<5;i++){
      const t=i/5;
      const x1=leftA.x+(leftB.x-leftA.x)*t, y1=leftA.y+(leftB.y-leftA.y)*t;
      const x2=rightA.x+(rightB.x-rightA.x)*t, y2=rightA.y+(rightB.y-rightA.y)*t;
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle="#70461f";ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayer() {
    const p=project(state.player);
    ctx.fillStyle="#2d4652";
    ctx.beginPath();ctx.arc(p.x,p.y-30,11,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#d5a66b";ctx.fillRect(p.x-10,p.y-18,20,28);
    ctx.fillStyle="#243b46";ctx.fillRect(p.x-9,p.y+10,7,17);ctx.fillRect(p.x+2,p.y+10,7,17);
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="#bde6ef";ctx.fillRect(0,0,canvas.width,canvas.height);

    // Draw back-to-front by world depth. Height changes actual projected y.
    [...low,...high].sort((a,b)=>(a.x+a.y+a.z)-(b.x+b.y+b.z)).forEach(s=>{
      drawTile(s,s.z===0?"#e9cf97":"#c9a46b");
    });

    // Show support face under elevated deck: z is volume, not a label only.
    high.forEach(s=>{
      const top=diamond(s), bottom=diamond({...s,z:0});
      poly([top[1],top[2],bottom[2],bottom[1]],"#9b7b52","#5b4734",1);
    });

    const pv=preview();
    if(!state.rampPlaced && selected().id==="G20") drawRamp(pv.valid?0.58:0.28);
    if(state.rampPlaced) drawRamp(1);

    const sel=diamond(selected());
    ctx.save();ctx.setLineDash([8,5]);ctx.lineWidth=4;ctx.strokeStyle=pv.valid?"#08753d":"#a52d3b";
    ctx.beginPath();sel.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.stroke();ctx.restore();

    drawPlayer();
  }

  function update(announce=false) {
    const s=selected(), pv=preview();
    $("player-status").textContent=`(${state.player.x}, ${state.player.y}, z${state.player.z}) · ${route[state.pathIndex].label}`;
    $("selection-status").textContent=`${s.label} · mundo (${s.x},${s.y},z${s.z})`;
    $("preview-status").textContent=`${pv.valid?"Válida":"No válida"} · orientación ${state.orientation}. ${pv.reason}`;
    $("preview-status").className=pv.valid?"good":"bad";
    $("walk").disabled=!state.rampPlaced || state.pathIndex>=route.length-1;
    $("place").disabled=!pv.valid;
    draw();
    if(announce) $("live").textContent=`${$("selection-status").textContent}. ${$("preview-status").textContent}`;
  }

  function selectRelative(delta) {
    const i=surfaces.findIndex(s=>s.id===state.selectedId);
    state.selectedId=surfaces[(i+delta+surfaces.length)%surfaces.length].id;
    update(true);
  }

  function place() {
    const pv=preview(); if(!pv.valid) return;
    state.rampPlaced=true;
    $("live").textContent="Rampa colocada. La geometría visible conecta z0 con z1.";
    update(false);
  }

  function walk() {
    if(!state.rampPlaced || state.pathIndex>=route.length-1) return;
    state.pathIndex++;
    state.player={...route[state.pathIndex]};
    $("live").textContent=`Personaje en ${route[state.pathIndex].label}: z${state.player.z}.`;
    update(false);
  }

  canvas.addEventListener("click", ev=>{
    const r=canvas.getBoundingClientRect();
    const sx=(ev.clientX-r.left)*canvas.width/r.width;
    const sy=(ev.clientY-r.top)*canvas.height/r.height;
    const hit=pick(sx,sy);
    if(hit){state.selectedId=hit.id; update(true);}
    canvas.focus();
  });
  $("prev").onclick=()=>selectRelative(-1);
  $("next").onclick=()=>selectRelative(1);
  $("rotate").onclick=()=>{state.orientation=state.orientation==="E"?"W":"E";update(true);};
  $("place").onclick=place;
  $("walk").onclick=walk;
  $("reset").onclick=()=>{Object.assign(state,{selectedId:"G20",orientation:"E",rampPlaced:false,pathIndex:0,player:{x:0,y:0,z:0}});$("live").textContent="Reiniciado.";update(false);};

  canvas.addEventListener("keydown",ev=>{
    if(ev.key==="ArrowLeft"){ev.preventDefault();selectRelative(-1);}
    else if(ev.key==="ArrowRight"){ev.preventDefault();selectRelative(1);}
    else if(ev.key.toLowerCase()==="r"){ev.preventDefault();$("rotate").click();}
    else if(ev.key==="Enter"){ev.preventDefault();place();}
    else if(ev.key===" "){ev.preventDefault();walk();}
  });

  window.PRISMA_SPATIAL_EXERCISE={project,inverseOnPlane,pick,preview,getState:()=>JSON.parse(JSON.stringify(state))};
  update(false);
})();