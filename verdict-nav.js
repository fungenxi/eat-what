/* ---------- verdict ---------- */
function hoursBadge(pl){
  const d=new Date(),st=state(pl,d),line=hoursLine(pl,d),m=closingIn(pl,d);
  if(st==="unknown")
    return '<div class="hours na"><span class="dot"></span>Opening hours not confirmed</div>';
  if(st==="closed")
    return '<div class="hours off"><span class="dot"></span>Closed right now. '+line+'</div>';
  if(pl.src==="mall")
    return '<div class="hours approx"><span class="dot"></span><span>Building is open, '+line+
      '<small>Stall hours not confirmed</small></span></div>';
  if(pl.src==="user")
    return '<div class="hours approx"><span class="dot"></span><span>'+(st==="open"?"Open now, ":"Hours: ")+line+
      '<small>Saved on this device</small></span></div>';
  return '<div class="hours on"><span class="dot"></span>Open now, '+
    (m!==null&&m<=45?'closes in '+m+' minutes':line)+'</div>';
}

function hoursForDayIndex(pl,dayIndex){
  if(!pl.h)return undefined;
  const keys=["sun","mon","tue","wed","thu","fri","sat"],key=keys[dayIndex];
  if(pl.h[key]!==undefined)return pl.h[key];
  if(dayIndex>=1&&dayIndex<=5)return pl.h.mf;
  if(dayIndex===6)return pl.h.sat!==undefined?pl.h.sat:pl.h.mf;
  return pl.h.sun!==undefined?pl.h.sun:pl.h.mf;
}

function compactHours(value){
  if(value===undefined)return "Not confirmed";
  if(value===null)return "Closed";
  const windows=Array.isArray(value[0])?value:[value];
  return windows.map(w=>fmtT(w[0])+"–"+fmtT(w[1])).join(", ");
}

function weeklyHoursHtml(pl){
  const order=[[1,"Mon"],[2,"Tue"],[3,"Wed"],[4,"Thu"],[5,"Fri"],[6,"Sat"],[0,"Sun"]];
  const rows=order.map(([day,label])=>'<div class="hours-row"><span>'+label+'</span><b>'+compactHours(hoursForDayIndex(pl,day))+'</b></div>').join("");
  const checked=pl.hoursChecked?new Date(pl.hoursChecked+"T00:00:00").toLocaleDateString("en-SG",{day:"numeric",month:"short",year:"numeric"}):null;
  const source=[checked?"Checked "+checked:null,pl.hoursSourceLabel||null].filter(Boolean).join(" · ");
  return '<details class="place-info hours-week"><summary><span>Opening hours</span><strong>See full week</strong></summary>'+rows+(source?'<small>'+source+'</small>':'')+'</details>';
}

function locationHtml(pl){
  const where=[pl.l,pl.w].filter(Boolean).join(" · ");
  const mapLink=pl.address?'<a class="detail-link" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(pl.address)+'" target="_blank" rel="noopener">Open in Maps ↗</a>':'';
  return '<div class="place-info"><div class="detail-label">Find it</div><b>'+where+'</b>'+(pl.address?'<span>'+pl.address+'</span>':'<span>Full address not recorded yet.</span>')+mapLink+'</div>';
}

function win(pl,how){
  document.body.style.setProperty("--bg","var(--mustard)");
  document.querySelector(".mark").style.color="var(--ink)";
  document.querySelectorAll("#nav button").forEach(x=>x.style.background="rgba(24,20,25,.2)");
  const v=$("sv");
  const TICK='<svg viewBox="0 0 24 24"><path d="M5 13l4.5 4.5L19 7"/></svg>';
  const REDO='<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>';
  v.innerHTML='<div class="winner">'+pl.n+(pl.new?'<span class="new-tag">NEW</span>':'')+'</div>'+
    '<div class="facts"><span class="fact">'+pl.l+(pl.w?" "+pl.w:"")+'</span>'+
    '<span class="fact open">'+pl.c+'</span><span class="fact open">'+$$(pl.p)+'</span></div>'+
    hoursBadge(pl)+locationHtml(pl)+weeklyHoursHtml(pl)+
    (specialToday(pl,new Date())?'<div class="heads">'+specialToday(pl,new Date())+'.</div>':'')+
    (pl.note?'<div class="heads">'+pl.note+'</div>':'')+
    (S.why?'<div class="heads">Because '+S.why+'.</div>':'')+
    '<div class="row2">'+
      '<button class="big yes" id="yes"><span class="act">'+TICK+'Going</span></button>'+
      '<button class="big no" id="again"><span class="act">'+REDO+'Again</span></button>'+
    '</div>';
  $("s2").classList.add("hide");v.classList.remove("hide");
  window.scrollTo({top:0,behavior:"smooth"});
  $("yes").onclick=()=>{recordVisit(pl,how);renderLog();
    $("yes").innerHTML='<span class="act">'+TICK+'Enjoy</span>';
    $("yes").disabled=true;$("again").disabled=true;};
  $("again").onclick=()=>{restore();v.classList.add("hide");go(2);runMech(S.mech);};
}
function restore(){
  document.querySelector(".mark").style.color="";
  document.querySelectorAll("#nav button").forEach(x=>x.style.background="");
}

/* ---------- visit history + rating ---------- */
const RATING_WORDS=["","Nah","Okay","Nice","Shiok","Go again"];

function makeVisitId(){
  return Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
}

function persistHistory(){
  writeLocal(STORAGE.log,S.log);
}

function normalizeHistory(){
  let changed=false;
  S.log=S.log.filter(item=>item&&typeof item.n==="string").map((item,index)=>{
    const copy={...item};
    if(!copy.visitId){
      copy.visitId="legacy-"+(copy.ts||Date.now())+"-"+index;
      changed=true;
    }
    if(!copy.ts){copy.ts=Date.now()-index;changed=true;}
    if(copy.rating===undefined)copy.rating=null;
    if(copy.area==="Civic District"){copy.area="CBD";changed=true;}
    if(Number(copy.visits)>1&&!copy.legacyVisits){
      copy.legacyVisits=Number(copy.visits);
      changed=true;
    }
    delete copy.visits;
    delete copy.key;
    return copy;
  }).sort((a,b)=>(Number(b.ts)||0)-(Number(a.ts)||0));
  if(changed)persistHistory();
}

function recordVisit(pl,how){
  normalizeHistory();
  S.log.unshift({
    visitId:makeVisitId(),
    id:pl.id||null,
    n:pl.n,
    l:pl.l||"",
    area:placeArea(pl),
    how:how||"",
    ts:Date.now(),
    rating:null
  });
  persistHistory();
}

function rateVisit(visitId,rating){
  const item=S.log.find(x=>x.visitId===visitId);
  if(!item)return;
  item.rating=rating;
  item.ratedAt=Date.now();
  persistHistory();
  renderLog();
}

function visitDayKey(ts){
  const d=new Date(ts);
  if(Number.isNaN(d.getTime()))return "earlier";
  return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
}

function visitDayLabel(ts){
  const d=new Date(ts);
  if(Number.isNaN(d.getTime()))return "Earlier";
  const now=new Date();
  const todayKey=visitDayKey(now.getTime());
  const yesterday=new Date(now);yesterday.setDate(now.getDate()-1);
  const key=visitDayKey(ts);
  if(key===todayKey)return "Today · "+d.toLocaleDateString("en-SG",{day:"numeric",month:"short"});
  if(key===visitDayKey(yesterday.getTime()))return "Yesterday · "+d.toLocaleDateString("en-SG",{day:"numeric",month:"short"});
  return d.toLocaleDateString("en-SG",{weekday:"short",day:"numeric",month:"short",year:d.getFullYear()===now.getFullYear()?undefined:"numeric"});
}

function visitTime(ts){
  const d=new Date(ts);
  if(Number.isNaN(d.getTime()))return "";
  return d.toLocaleTimeString("en-SG",{hour:"numeric",minute:"2-digit"});
}

function openHistory(){
  renderLog();
  const page=$("historyScrim");
  if(!page)return;
  page.classList.remove("hide");
  document.body.classList.add("modal-open");
  $("historyClose")?.focus();
}

function closeHistory(){
  const page=$("historyScrim");
  if(!page)return;
  page.classList.add("hide");
  document.body.classList.remove("modal-open");
  $("quickFab")?.focus();
}

function renderVisitCard(l){
  const rating=Number(l.rating)||0;
  const bits=[];
  if(l.l)bits.push(l.l);
  const time=visitTime(l.ts);if(time)bits.push(time);
  if(l.how)bits.push(l.how);
  if(Number(l.legacyVisits)>1)bits.push(l.legacyVisits+" earlier visits were saved together");
  const buttons=[1,2,3,4,5].map(n=>
    '<button class="rating-btn" type="button" data-visit="'+l.visitId+'" data-rating="'+n+'" '+
    'aria-pressed="'+String(rating===n)+'" aria-label="Rate '+l.n+' '+n+' out of 5 — '+RATING_WORDS[n]+'" title="'+RATING_WORDS[n]+'">'+n+'</button>'
  ).join("");
  return '<div class="visit-card">'+
    '<div class="visit-top"><div class="visit-copy"><b>'+l.n+'</b><span class="visit-meta">'+bits.join(" · ")+'</span></div>'+
    '<span class="visit-score '+(rating?'':'unrated')+'">'+(rating?rating+"/5":"Rate")+'</span></div>'+
    '<div class="rating-scale" role="group" aria-label="Rate '+l.n+' out of 5">'+buttons+'</div>'+
    '<div class="rating-caption">'+(rating?RATING_WORDS[rating]:"How was it?")+'</div></div>';
}

function renderLog(){
  normalizeHistory();
  const list=$("logList"),empty=$("historyEmpty");
  if(!list)return;
  if(empty)empty.classList.toggle("hide",S.log.length>0);
  if(!S.log.length){list.innerHTML="";return;}

  const groups=[];
  S.log.forEach(item=>{
    const key=visitDayKey(item.ts);
    let group=groups[groups.length-1];
    if(!group||group.key!==key){
      group={key,label:visitDayLabel(item.ts),items:[]};
      groups.push(group);
    }
    group.items.push(item);
  });

  list.innerHTML=groups.map(group=>
    '<section class="history-day"><div class="history-date">'+group.label+'</div>'+group.items.map(renderVisitCard).join("")+'</section>'
  ).join("");

  list.querySelectorAll(".rating-btn").forEach(b=>{
    b.onclick=()=>rateVisit(b.dataset.visit,Number(b.dataset.rating));
  });
}

const historyPage=$("historyScrim");
if(historyPage){
  $("historyClose").onclick=closeHistory;
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&!historyPage.classList.contains("hide"))closeHistory();
  });
}
