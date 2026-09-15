const COLOURS=[
 {k:"white",hex:"#F2EDE2",fg:"#181419",t:"White",bd:"rgba(24,20,25,.18)"},
 {k:"red",hex:"#C4392B",fg:"#FFFFFF",t:"Red",bd:"transparent"},
 {k:"green",hex:"#3B7042",fg:"#FFFFFF",t:"Green",bd:"transparent"},
 {k:"brown",hex:"#6E4526",fg:"#FFFFFF",t:"Brown",bd:"transparent"},
 {k:"blue",hex:"#2C4870",fg:"#FFFFFF",t:"Blue",bd:"transparent"},
 {k:"black",hex:"#1C1B1E",fg:"#FFFFFF",t:"Black",bd:"transparent"}
];

/* monochrome line icons */
const S24='viewBox="0 0 24 24"';
const ICON={
 colour:'<svg '+S24+'><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/></svg>',
 point:'<svg '+S24+'><path d="M5 12h13"/><path d="M13 6l6 6-6 6"/></svg>',
 fingers:'<svg '+S24+'><path d="M5 20V11"/><path d="M9.3 20V6"/><path d="M13.7 20V4"/><path d="M18 20V9"/></svg>',
 veto:'<svg '+S24+'><circle cx="12" cy="12" r="8.5"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/></svg>',
 yday:'<svg '+S24+'><path d="M4 12a8 8 0 1 0 2.6-5.9"/><path d="M4 4v5h5"/></svg>',
 wheel:'<svg '+S24+'><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6L6 18"/></svg>',
 cards:'<svg '+S24+'><rect x="3" y="6" width="11" height="14" rx="2"/><path d="M8 4h9a2 2 0 0 1 2 2v12"/></svg>',
 knock:'<svg '+S24+'><path d="M3 5h5l3 7 3-7h5"/><path d="M11 12v7"/><path d="M8 19h6"/></svg>',
 split:'<svg '+S24+'><path d="M9 7H3M6 4L3 7l3 3"/><path d="M15 17h6M18 14l3 3-3 3"/><path d="M12 3v18"/></svg>',
 potato:'<svg '+S24+'><circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 1.5"/><path d="M9.5 2.5h5"/></svg>',
 elim:'<svg '+S24+'><circle cx="5.5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18.5" cy="12" r="2" fill="currentColor"/><path d="M3.5 14l4-4M10 14l4-4"/></svg>'
};
const ARROW=d=>'<svg '+S24+' style="transform:rotate('+d+'deg)"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>';
const DIRS={"Funan":0,"Capitol":45,"Adelphi":90,"Raffles City":135,
  "Clarke Quay":270,"Nat Gallery":180,"Raffles Xchange":135};

const HEADS=[["Narrow","it down"],["Ask","the room"],["Let fate","decide"]];
const BG=["var(--teal)","var(--plum)","var(--coral)"];

const S={stage:1,price:new Set(),loc:new Set(),cui:new Set(),extra:new Set(),
  pool:[...PLACES],base:[...PLACES],why:null,mech:null,
  log:readLocal(STORAGE.log,[]).filter(x=>x&&typeof x.n==="string"&&typeof x.how==="string")};

const $=i=>document.getElementById(i);
const shuf=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;};
const $$=n=>"$".repeat(n);
const today=new Date().getDay();

/* ---------- what time is it, and what does that rule out ---------- */
const DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const SHORT=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_KEYS=["sun","mon","tue","wed","thu","fri","sat"];

function hoursFor(pl,d){
  if(!pl.h)return undefined;                       // hours never confirmed
  const g=d.getDay(),key=DAY_KEYS[g];
  let h;
  if(pl.h[key]!==undefined)h=pl.h[key];             // exact day overrides the generic weekday rule
  else if(g>=1&&g<=5)h=pl.h.mf;
  else if(g===6)h=pl.h.sat!==undefined?pl.h.sat:pl.h.mf;
  else h=pl.h.sun!==undefined?pl.h.sun:pl.h.mf;
  if(h===null||h===undefined)return h;
  return Array.isArray(h[0])?h:[h];                // always a list of windows
}
const clockOf=d=>d.getHours()+d.getMinutes()/60;
function state(pl,d){
  const h=hoursFor(pl,d);
  if(h===undefined)return "unknown";
  if(h===null)return "closed";
  const t=clockOf(d);
  return h.some(w=>t>=w[0]&&t<w[1])?"open":"closed";
}
function closingIn(pl,d){
  const h=hoursFor(pl,d);
  if(!h)return null;
  const t=clockOf(d),w=h.find(x=>t>=x[0]&&t<x[1]);
  return w?Math.round((w[1]-t)*60):null;
}
function fmtT(v){
  const hh=Math.floor(v),mm=Math.round((v-hh)*60);
  const ap=hh<12?"am":"pm",h12=(hh%12)===0?12:hh%12;
  return h12+(mm?":"+String(mm).padStart(2,"0"):"")+ap;
}
function hoursLine(pl,d){
  const h=hoursFor(pl,d);
  if(h===undefined)return null;
  if(h===null)return "closed "+DAYS[d.getDay()]+"s";
  return h.map(w=>fmtT(w[0])+" to "+fmtT(w[1])).join(" and ")+" today";
}
const specialToday=(pl,d)=>pl.sp&&pl.sp.d.includes(d.getDay())?pl.sp.t:null;

function tickClock(){
  const d=new Date();
  const c=$("clock");
  if(c)c.textContent=SHORT[d.getDay()]+" "+String(d.getHours()).padStart(2,"0")+
    ":"+String(d.getMinutes()).padStart(2,"0");
  drawToday(d);
}

function drawToday(d){
  const shut=PLACES.filter(p=>state(p,d)==="closed"),
        soon=PLACES.filter(p=>{const m=closingIn(p,d);return state(p,d)==="open"&&m!==null&&m<=45;}),
        specials=PLACES.filter(p=>specialToday(p,d)),
        early=PLACES.filter(p=>p.early),
        t=clockOf(d);
  let bits="";
  if(shut.length)bits+='<li><em>Shut</em><span>'+shut.map(p=>p.n).join(", ")+'</span></li>';
  if(soon.length)bits+='<li><em>Closing soon</em><span>'+soon.map(p=>p.n).join(", ")+'</span></li>';
  specials.forEach(p=>bits+='<li><em>Today only</em><span>'+p.sp.t+' at '+p.n+'</span></li>');
  if(t>=12.5&&early.length)bits+='<li><em>Too late</em><span>'+early.map(p=>p.n).join(", ")+' is best before noon</span></li>';
  const html='<div class="today"><b>'+DAYS[d.getDay()]+", "+fmtT(Math.floor(t)+
    (d.getMinutes()>=30?0.5:0))+'.</b> '+
    (S.extra.has("now")?'Showing only what is open.':'')+
    (bits?'<ul>'+bits+'</ul>':'')+'</div>';
  ["today0","today1"].forEach(id=>{const el=$(id);if(el)el.innerHTML=html;});
}
