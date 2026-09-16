/* ---------- ask the room ---------- */
const RITUALS=[
 {k:"colour",t:"Colour census",s:"Whatever colour the room is wearing, we eat"},
 {k:"point",t:"Point the way",s:"Everyone points on three. Majority takes the building"},
 {k:"fingers",t:"Throw fingers",s:"Throw 1–5 each. Add the total; it cycles through $, $$, $$$"},
 {k:"veto",t:"Veto round",s:"One strike each. No explaining yourself"},
 {k:"yday",t:"Not again",s:"Whatever anyone ate yesterday is out"}
];

function buildRituals(){
  const w=$("rPick");w.innerHTML="";
  RITUALS.forEach(r=>{
    const b=document.createElement("button");
    b.className="pick";b.type="button";b.setAttribute("aria-pressed","false");
    b.innerHTML=ICON[r.k]+"<span>"+r.t+"<u>"+r.s+"</u></span>";
    b.onclick=()=>{
      if(S.base.length<=1)return;
      [...w.children].forEach(c=>c.setAttribute("aria-pressed","false"));
      b.setAttribute("aria-pressed","true");S.pool=[...S.base];paint();runRitual(r.k);
    };
    w.appendChild(b);
  });
}

function runRitual(k){
  if(S.base.length<=1){
    if(typeof go==="function")go(0);
    return;
  }
  const r=$("rRun");r.classList.remove("hide");r.innerHTML="";
  const p=document.createElement("div");p.className="panel";r.appendChild(p);
  ({colour:rColour,point:rPoint,fingers:rFingers,veto:rVeto,yday:rYday})[k](p);
  r.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function rColour(p){
  p.innerHTML='<div class="lbl big">Most common outfit colour in the room</div>';
  const g=document.createElement("div");g.className="sw";
  const candidates=[...S.pool];

  /* Colour is a social tiebreaker, not a restaurant attribute. Build equally-sized
     overlapping groups from the current filtered pool so every outfit colour is viable. */
  const hashName=name=>{
    let h=2166136261;
    for(let i=0;i<name.length;i++)h=Math.imul(h^name.charCodeAt(i),16777619);
    return h>>>0;
  };
  const ordered=[...candidates].sort((a,b)=>hashName(a.n)-hashName(b.n)||a.n.localeCompare(b.n));
  const groupSize=ordered.length?Math.min(ordered.length,Math.max(2,Math.ceil(ordered.length/4))):0;
  const groups=new Map();
  COLOURS.forEach((c,i)=>{
    if(!ordered.length){groups.set(c.k,[]);return;}
    const start=Math.floor(i*ordered.length/COLOURS.length);
    const picks=[];
    for(let j=0;j<groupSize;j++)picks.push(ordered[(start+j)%ordered.length]);
    groups.set(c.k,picks);
  });

  COLOURS.forEach(c=>{
    const b=document.createElement("button");b.type="button";
    b.style.background=c.hex;b.style.color=c.fg;b.style.borderColor=c.bd;
    b.setAttribute("aria-pressed","false");b.textContent=c.t;
    b.disabled=!ordered.length;
    b.onclick=()=>{
      [...g.children].forEach(x=>{x.setAttribute("aria-pressed","false");
        x.style.borderColor=COLOURS.find(y=>y.t===x.textContent).bd;});
      b.setAttribute("aria-pressed","true");b.style.borderColor="var(--ink)";
      const m=groups.get(c.k)||[];
      if(!m.length){
        S.why="no places left after filtering";
        paint();say(p,"No places left from your filters. Go back and widen them a bit.");
        return;
      }
      S.pool=m;
      S.why=c.t.toLowerCase()+" won the room";
      const noun=m.length===1?"place":"places";
      paint();say(p,c.t+" won the room. "+m.length+" "+noun+" make the cut.");
    };
    g.appendChild(b);
  });
  p.appendChild(g);
}

function rPoint(p){
  p.innerHTML='<div class="lbl big">Point on three. Where did most hands land?</div>';
  const g=document.createElement("div");g.className="dirs";
  const candidates=[...S.pool];
  const buildings=[...new Set(candidates.map(x=>x.l))];
  buildings.forEach(l=>{
    const count=candidates.filter(x=>x.l===l).length;
    const b=document.createElement("button");b.type="button";
    const icon=Object.prototype.hasOwnProperty.call(DIRS,l)?ARROW(DIRS[l]):ICON.point;
    b.innerHTML=icon+"<span>"+l+"<small>"+count+" "+(count===1?"place":"places")+"</small></span>";
    b.onclick=()=>{
      const matched=candidates.filter(x=>x.l===l);
      S.pool=matched;S.why="the room pointed at "+l;
      paint();say(p,l+" it is. "+matched.length+" "+(matched.length===1?"place":"places")+" there.");
    };
    g.appendChild(b);
  });
  p.appendChild(g);
}

function rFingers(p){
  let tot=0,throws=[];
  const tierFor=n=>n%3===0?3:n%3;
  p.innerHTML='<div class="lbl big">Everyone throws 1–5 on three. Tap each person’s number.</div>'+
    '<div class="finger-rule">We add the total, then cycle budgets: 1 → $ · 2 → $$ · 3 → $$$ · repeat.</div>'+
    '<div class="total" id="tot">0</div>'+
    '<div class="finger-result" id="fingerResult">Waiting for the first throw</div>';
  const pad=document.createElement("div");pad.className="pad";
  for(let i=1;i<=5;i++){
    const b=document.createElement("button");b.type="button";b.textContent=i;
    b.onclick=()=>{
      throws.push(i);tot+=i;$("tot").textContent=tot;
      const tier=tierFor(tot);
      $("fingerResult").textContent="Throws: "+throws.join(" + ")+" = "+tot+" → "+$$(tier);
      done.disabled=false;
    };
    pad.appendChild(b);
  }
  p.appendChild(pad);
  const done=document.createElement("button");
  done.className="big";done.type="button";done.disabled=true;done.textContent="That's everyone";
  done.onclick=()=>{
    const tier=tierFor(tot),m=S.pool.filter(x=>x.p===tier);let msg;
    if(m.length>=2){S.pool=m;msg="Total of "+tot+" lands on "+$$(tier)+". "+m.length+" left.";}
    else msg="Total of "+tot+" lands on "+$$(tier)+", but too few matched. Everyone stays in.";
    S.why="the room threw "+tot+" for "+$$(tier);
    pad.querySelectorAll("button").forEach(x=>x.disabled=true);done.disabled=true;
    paint();say(p,msg);
  };
  p.appendChild(done);
}

function rVeto(p){
  p.innerHTML='<div class="lbl big">One strike each. Tap to kill.</div>';
  const g=document.createElement("div");g.className="chips";const dead=new Set();
  S.pool.forEach(pl=>{
    const b=document.createElement("button");b.className="chip";b.type="button";b.textContent=pl.n;
    b.setAttribute("data-struck","false");
    b.onclick=()=>{const on=dead.has(pl.n);on?dead.delete(pl.n):dead.add(pl.n);
      b.setAttribute("data-struck",String(!on));
      const left=S.pool.length-dead.size;
      done.textContent=dead.size?"Done — "+left+" survive":"Done";done.disabled=left<1;};
    g.appendChild(b);
  });
  p.appendChild(g);
  const done=document.createElement("button");
  done.className="big";done.type="button";done.textContent="Done";
  done.onclick=()=>{
    S.pool=S.pool.filter(x=>!dead.has(x.n));
    S.why=dead.size+(dead.size===1?" veto":" vetoes")+" used";
    g.querySelectorAll("button").forEach(x=>x.disabled=true);done.disabled=true;
    paint();say(p,dead.size?dead.size+" struck off. "+S.pool.length+" survive.":"Nobody objected. All "+S.pool.length+" stay in.");
  };
  p.appendChild(done);
}

function rYday(p){
  p.innerHTML='<div class="lbl big">What did people eat yesterday? Those are out.</div>';
  const g=document.createElement("div");g.className="chips";const dead=new Set();
  [...new Set(S.pool.map(x=>x.c))].sort().forEach(c=>{
    const b=document.createElement("button");b.className="chip";b.type="button";b.textContent=c;
    b.setAttribute("aria-pressed","false");
    b.onclick=()=>{const on=dead.has(c);on?dead.delete(c):dead.add(c);
      b.setAttribute("aria-pressed",String(!on));
      const left=S.pool.filter(x=>!dead.has(x.c)).length;
      done.disabled=left<1;done.textContent=dead.size?"Done — "+left+" survive":"Done";};
    g.appendChild(b);
  });
  p.appendChild(g);
  const done=document.createElement("button");
  done.className="big";done.type="button";done.textContent="Done";
  done.onclick=()=>{
    S.pool=S.pool.filter(x=>!dead.has(x.c));
    S.why=dead.size?[...dead].join(" and ")+" ruled out":"nothing ruled out";
    g.querySelectorAll("button").forEach(x=>x.disabled=true);done.disabled=true;
    paint();say(p,S.pool.length+" left after that.");
  };
  p.appendChild(done);
}

function say(p,msg){
  let o=p.querySelector(".reveal");
  if(!o){o=document.createElement("div");o.className="reveal";p.appendChild(o);}
  o.textContent=msg;

  let b=p.querySelector(".big.pop");
  if(!b){
    b=document.createElement("button");b.className="big pop";b.type="button";p.appendChild(b);
  }

  if(S.pool.length===1){
    const only=S.pool[0];
    b.disabled=false;
    b.textContent="View "+only.n;
    b.onclick=()=>{
      if(typeof window.openPlaceDetail==="function")window.openPlaceDetail(only,"Ask the room",1);
      else win(only,"Ask the room");
    };
  }else if(S.pool.length>1){
    b.disabled=false;
    b.textContent="Play for these "+S.pool.length;
    b.onclick=()=>go(2);
  }else{
    b.disabled=true;
    b.textContent="No options left";
    b.onclick=null;
  }

  if(typeof window.syncDecisionNav==="function")window.syncDecisionNav();
  b.scrollIntoView({behavior:"smooth",block:"center"});
}
