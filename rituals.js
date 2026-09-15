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
    b.onclick=()=>{[...w.children].forEach(c=>c.setAttribute("aria-pressed","false"));
      b.setAttribute("aria-pressed","true");S.pool=[...S.base];paint();runRitual(r.k);};
    w.appendChild(b);
  });
}

function runRitual(k){
  const r=$("rRun");r.classList.remove("hide");r.innerHTML="";
  const p=document.createElement("div");p.className="panel";r.appendChild(p);
  ({colour:rColour,point:rPoint,fingers:rFingers,veto:rVeto,yday:rYday})[k](p);
  r.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function rColour(p){
  p.innerHTML='<div class="lbl big">Most common colour in the room</div>';
  const g=document.createElement("div");g.className="sw";
  COLOURS.forEach(c=>{
    const b=document.createElement("button");b.type="button";
    b.style.background=c.hex;b.style.color=c.fg;b.style.borderColor=c.bd;
    b.setAttribute("aria-pressed","false");b.textContent=c.t;
    b.onclick=()=>{
      [...g.children].forEach(x=>{x.setAttribute("aria-pressed","false");
        x.style.borderColor=COLOURS.find(y=>y.t===x.textContent).bd;});
      b.setAttribute("aria-pressed","true");b.style.borderColor="var(--ink)";
      const m=S.pool.filter(x=>x.col===c.k);let msg;
      if(m.length>=2){S.pool=m;S.why=c.t.toLowerCase()+" won the room";
        msg=c.t+" food, then. "+m.length+" left.";}
      else{S.why=c.t.toLowerCase()+" won, nothing matched";
        msg="Nothing "+c.t.toLowerCase()+" made it. Everyone stays in.";}
      paint();say(p,msg);
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
    b.innerHTML=ARROW(DIRS[l]||0)+"<span>"+l+"<small>"+count+" "+(count===1?"place":"places")+"</small></span>";
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
  if(!b){b=document.createElement("button");b.className="big pop";b.type="button";
    b.onclick=()=>go(2);p.appendChild(b);}
  b.textContent="Play for these "+S.pool.length;
  b.scrollIntoView({behavior:"smooth",block:"center"});
}
