/* ---------- games ---------- */
const MECHS=[
 {k:"wheel",t:"Spin the wheel",s:"One spin, no appeals"},
 {k:"cards",t:"Deal the cards",s:"Five face down. Someone turns one over"},
 {k:"knock",t:"Knockout",s:"Head to head. The room votes each round"},
 {k:"split",t:"Left or right",s:"Half the list at a time until one is left"},
 {k:"potato",t:"Hot potato",s:"Names fly past. Someone shouts stop"},
 {k:"elim",t:"Last one standing",s:"They drop out one by one"}
];

let GAME_RUN_TOKEN=0;
let activeGameCleanup=null;
function cancelActiveGame(){
  GAME_RUN_TOKEN+=1;
  if(typeof activeGameCleanup==="function"){
    try{activeGameCleanup();}catch(_){}
  }
  activeGameCleanup=null;
}
function beginGameRun(){
  cancelActiveGame();
  return GAME_RUN_TOKEN;
}
function setGameCleanup(token,fn){
  if(token===GAME_RUN_TOKEN)activeGameCleanup=fn;
}
function gameRunActive(token,p){
  return token===GAME_RUN_TOKEN&&S.stage===2&&(!p||p.isConnected);
}
window.cancelActiveGame=cancelActiveGame;

function buildMechs(){
  const w=$("mPick");w.innerHTML="";
  MECHS.forEach(m=>{
    const b=document.createElement("button");
    b.className="pick";b.type="button";b.setAttribute("aria-pressed","false");
    b.innerHTML=ICON[m.k]+"<span>"+m.t+"<u>"+m.s+"</u></span>";
    b.disabled=S.pool.length<=1;
    b.onclick=()=>{
      if(S.pool.length<=1)return;
      [...w.children].forEach(c=>c.setAttribute("aria-pressed","false"));
      b.setAttribute("aria-pressed","true");S.mech=m.k;runMech(m.k);
    };
    w.appendChild(b);
  });
}

function runMech(k){
  const fn=({wheel:gWheel,cards:gCards,knock:gKnock,split:gSplit,potato:gPotato,elim:gElim})[k];
  if(typeof fn!=="function"||S.pool.length<=1){
    cancelActiveGame();
    if(typeof go==="function")go(0);
    return;
  }
  const token=beginGameRun();
  const r=$("mRun");r.classList.remove("hide");r.innerHTML="";
  const p=document.createElement("div");p.className="panel";r.appendChild(p);
  fn(p,token);
  r.scrollIntoView({behavior:"smooth",block:"nearest"});
}

/* Base wheel renderer; wheel-interaction.js replaces this with the tap-to-spin version. */
function gWheel(p,token){
  const it=[...S.pool],n=it.length;
  if(n<=1)return;
  const seg=360/n,R=155,C=165,NS="http://www.w3.org/2000/svg";
  const fs = n<=8?11 : n<=14?8.8 : n<=22?7 : n<=30?5.9 : 5.2;
  const maxc= n<=8?15 : n<=14?19 : n<=22?23 : 26;
  const box=document.createElement("div");box.className="wheelbox";
  box.innerHTML='<div class="needle"></div>';
  const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 330 330");
  const sh=["#5B2A4E","#0F8A82"];
  it.forEach((pl,i)=>{
    const a0=(i*seg-90)*Math.PI/180,a1=((i+1)*seg-90)*Math.PI/180;
    const pa=document.createElementNS(NS,"path");
    pa.setAttribute("d","M"+C+" "+C+" L"+(C+R*Math.cos(a0))+" "+(C+R*Math.sin(a0))+" A"+R+" "+R+" 0 0 1 "+(C+R*Math.cos(a1))+" "+(C+R*Math.sin(a1))+" Z");
    pa.setAttribute("fill",sh[i%2]);
    if(n>18){pa.setAttribute("stroke","rgba(251,246,236,.18)");pa.setAttribute("stroke-width",".5");}
    svg.appendChild(pa);
    const mid=i*seg+seg/2-90,a=((mid%360)+360)%360,flip=a>90&&a<270;
    const rx=R*.95,tx=C+rx*Math.cos(mid*Math.PI/180),ty=C+rx*Math.sin(mid*Math.PI/180);
    const t=document.createElementNS(NS,"text");
    t.setAttribute("x",tx);t.setAttribute("y",ty);t.setAttribute("fill","#FBF6EC");
    t.setAttribute("font-size",fs);t.setAttribute("dominant-baseline","middle");
    t.setAttribute("text-anchor",flip?"start":"end");t.setAttribute("dx",flip?5:-5);
    t.setAttribute("transform","rotate("+(flip?mid+180:mid)+" "+tx+" "+ty+")");
    t.textContent=pl.n.length>maxc?pl.n.slice(0,maxc-1)+"…":pl.n;
    svg.appendChild(t);
  });
  const hub=document.createElementNS(NS,"circle");
  hub.setAttribute("cx",C);hub.setAttribute("cy",C);hub.setAttribute("r",n>18?20:28);hub.setAttribute("fill","#FFC22E");
  svg.appendChild(hub);box.appendChild(svg);p.appendChild(box);
  const b=document.createElement("button");b.className="big pop";b.type="button";b.textContent="Spin all "+n;
  let timer=null;
  setGameCleanup(token,()=>{if(timer!==null)clearTimeout(timer);});
  b.onclick=()=>{
    if(!gameRunActive(token,p))return;
    b.disabled=true;b.textContent="Spinning";
    const w=Math.floor(Math.random()*n);
    svg.style.transform="rotate("+(360*6-(w*seg+seg/2))+"deg)";
    timer=setTimeout(()=>{if(gameRunActive(token,p))win(it[w],"the wheel");},4600);
  };
  p.appendChild(b);
}

function gCards(p,token){
  const it=shuf(S.pool).slice(0,Math.min(5,S.pool.length));
  if(it.length<=1)return;
  p.innerHTML='<div class="lbl big">Someone picks one</div>';
  const d=document.createElement("div");d.className="deck";
  let timer=null;
  setGameCleanup(token,()=>{if(timer!==null)clearTimeout(timer);});
  it.forEach(pl=>{
    const c=document.createElement("button");c.className="card";c.type="button";
    c.setAttribute("data-flip","false");c.setAttribute("aria-label","Turn a card");
    c.innerHTML='<div class="face back">?</div><div class="face front">'+escapeHtml(pl.n)+'</div>';
    c.onclick=()=>{
      if(!gameRunActive(token,p))return;
      [...d.children].forEach(x=>x.disabled=true);
      c.setAttribute("data-flip","true");
      timer=setTimeout(()=>{if(gameRunActive(token,p))win(pl,"the cards");},950);
    };
    d.appendChild(c);
  });
  p.appendChild(d);
}

function gKnock(p,token){
  let round=shuf(S.pool).slice(0,Math.min(8,S.pool.length)),next=[],i=0;
  if(round.length<=1)return;
  const head=document.createElement("div");head.className="lbl big";p.appendChild(head);
  const box=document.createElement("div");box.className="vs";p.appendChild(box);
  const draw=()=>{
    if(!gameRunActive(token,p))return;
    if(round.length===1){win(round[0],"knockout");return;}
    if(!round.length){go(0);return;}
    if(i>=round.length-1){
      if(i===round.length-1)next.push(round[i]);
      round=next;next=[];i=0;draw();return;
    }
    head.textContent="Round of "+round.length+" — everyone points at one";
    box.innerHTML="";
    [round[i],round[i+1]].forEach((pl,k)=>{
      const bt=document.createElement("button");bt.type="button";bt.textContent=pl.n;
      bt.onclick=()=>{if(!gameRunActive(token,p))return;next.push(pl);i+=2;draw();};
      box.appendChild(bt);
      if(k===0){const s=document.createElement("span");s.textContent="vs";box.appendChild(s);}
    });
  };
  draw();
}

function gSplit(p,token){
  let live=shuf(S.pool);
  if(live.length<=1)return;
  const head=document.createElement("div");head.className="lbl big";p.appendChild(head);
  const box=document.createElement("div");box.className="vs stack";p.appendChild(box);
  const draw=()=>{
    if(!gameRunActive(token,p))return;
    if(live.length===1){win(live[0],"left or right");return;}
    if(!live.length){go(0);return;}
    const half=Math.ceil(live.length/2);
    head.textContent=live.length+" left — pick a side";
    box.innerHTML="";
    [live.slice(0,half),live.slice(half)].filter(grp=>grp.length).forEach((grp,k)=>{
      const bt=document.createElement("button");bt.type="button";bt.className="many";
      bt.innerHTML=grp.map(x=>escapeHtml(x.n)).join("<br>");
      bt.onclick=()=>{if(!gameRunActive(token,p))return;live=grp;draw();};
      box.appendChild(bt);
      if(k===0&&live.length>1){const s=document.createElement("span");s.textContent="or";box.appendChild(s);}
    });
  };
  draw();
}

function gPotato(p,token){
  const it=shuf(S.pool);if(it.length<=1)return;
  let idx=0,timer=null,speed=70,elapsed=0,running=false;
  p.innerHTML='<div class="lbl big">Someone shouts stop</div>';
  const d=document.createElement("div");d.className="potato";d.textContent=it[0].n;p.appendChild(d);
  const b=document.createElement("button");b.className="big pop";b.type="button";b.textContent="Start";
  setGameCleanup(token,()=>{if(timer!==null)clearTimeout(timer);});
  b.onclick=()=>{
    if(!gameRunActive(token,p))return;
    if(!running){
      running=true;b.textContent="Stop";
      const tick=()=>{
        if(!gameRunActive(token,p))return;
        idx=(idx+1)%it.length;d.textContent=it[idx].n;elapsed+=speed;
        if(elapsed>2600)speed=Math.min(240,speed+14);
        timer=setTimeout(tick,speed);
      };
      tick();
    }else{
      clearTimeout(timer);timer=null;b.disabled=true;
      timer=setTimeout(()=>{if(gameRunActive(token,p))win(it[idx],"hot potato");},450);
    }
  };
  p.appendChild(b);
}

function gElim(p,token){
  const it=shuf(S.pool);if(it.length<=1)return;
  p.innerHTML='<div class="lbl big">Do not get attached</div>';
  const g=document.createElement("div");g.className="elim";
  const tiles=it.map(pl=>{const t=document.createElement("div");t.className="tile";
    t.textContent=pl.n;t.setAttribute("data-out","false");g.appendChild(t);return t;});
  p.appendChild(g);
  const b=document.createElement("button");b.className="big pop";b.type="button";b.textContent="Go";
  let timer=null;
  setGameCleanup(token,()=>{if(timer!==null)clearTimeout(timer);});
  b.onclick=()=>{
    if(!gameRunActive(token,p))return;
    b.disabled=true;let live=it.map((_,i)=>i);
    const step=()=>{
      if(!gameRunActive(token,p))return;
      if(live.length===1){
        tiles[live[0]].setAttribute("data-win","true");
        timer=setTimeout(()=>{if(gameRunActive(token,p))win(it[live[0]],"elimination");},750);
        return;
      }
      if(!live.length){go(0);return;}
      const k=Math.floor(Math.random()*live.length);
      tiles[live[k]].setAttribute("data-out","true");live.splice(k,1);
      timer=setTimeout(step,Math.max(170,700-(it.length-live.length)*40));
    };
    timer=setTimeout(step,400);
  };
  p.appendChild(b);
}
