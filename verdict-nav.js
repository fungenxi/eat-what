/* ---------- verdict ---------- */
function hoursBadge(pl){
  const d=new Date(),st=state(pl,d),line=hoursLine(pl,d),m=closingIn(pl,d);
  if(st==="unknown")
    return '<div class="hours na"><span class="dot"></span>Opening hours not confirmed</div>';
  if(st==="closed")
    return '<div class="hours off"><span class="dot"></span>Closed right now. '+escapeHtml(line||"Closed today")+'</div>';
  if(pl.src==="mall")
    return '<div class="hours approx"><span class="dot"></span><span>Building is open, '+escapeHtml(line||"")+
      '<small>Stall hours not confirmed</small></span></div>';
  if(pl.src==="user")
    return '<div class="hours approx"><span class="dot"></span><span>'+(st==="open"?"Open now, ":"Hours: ")+escapeHtml(line||"")+
      '<small>Saved on this device</small></span></div>';
  return '<div class="hours on"><span class="dot"></span>Open now, '+
    (m!==null&&m<=45?'closes in '+m+' minutes':escapeHtml(line||""))+'</div>';
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
  return '<details class="place-info hours-week"><summary><span>Opening hours</span><strong>See full week</strong></summary>'+rows+(source?'<small>'+escapeHtml(source)+'</small>':'')+'</details>';
}

function locationHtml(pl){
  const where=[pl.l,pl.w].filter(Boolean).join(" · ");
  const mapLink=pl.address?'<a class="detail-link" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(pl.address)+'" target="_blank" rel="noopener">Open in Maps ↗</a>':'';
  return '<div class="place-info"><div class="detail-label">Find it</div><b>'+escapeHtml(where)+'</b>'+
    (pl.address?'<span>'+escapeHtml(pl.address)+'</span>':'<span>Full address not recorded yet.</span>')+mapLink+'</div>';
}

function winnerDoodleHtml(pl){
  return '<div class="winner-doodle">'+
    '<svg class="winner-burst" viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true">'+
      '<path d="M8 29 2 25"/><path d="M15 17 11 8"/><path d="M28 12 27 3"/>'+
      '<path d="M72 12 74 3"/><path d="M85 18 91 10"/><path d="M92 29 99 26"/>'+
      '<path d="M19 39 13 45"/><path d="M81 39 88 45"/>'+
    '</svg>'+
    '<svg class="winner-spark one" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5c.4 3 1.5 4.2 4.4 4.8C9.5 6.9 8.4 8.2 8 11.3 7.5 8.2 6.4 6.9 3.5 6.3 6.4 5.7 7.5 4.5 8 1.5Z"/></svg>'+
    '<svg class="winner-spark two" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2c.3 2.4 1.2 3.4 3.5 3.9C9.2 6.4 8.3 7.5 8 9.9 7.6 7.5 6.8 6.4 4.5 5.9 6.8 5.4 7.6 4.4 8 2Z"/></svg>'+
    '<div class="winner">'+escapeHtml(pl.n)+(pl.new?'<span class="new-tag">NEW</span>':'')+'</div></div>';
}

function win(pl,how){
  if(!pl){if(typeof go==="function")go(0);return;}
  document.body.style.setProperty("--bg","var(--mustard)");
  const mark=document.querySelector(".mark");if(mark)mark.style.color="var(--ink)";
  document.querySelectorAll("#nav button").forEach(x=>x.style.background="rgba(24,20,25,.2)");
  const v=$("sv");
  const TICK='<svg viewBox="0 0 24 24"><path d="M5 13l4.5 4.5L19 7"/></svg>';
  const REDO='<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20 4v5h-5"/></svg>';
  v.innerHTML=winnerDoodleHtml(pl)+
    '<div class="facts"><span class="fact">'+escapeHtml([pl.l,pl.w].filter(Boolean).join(" "))+'</span>'+
    '<span class="fact open">'+escapeHtml(pl.c)+'</span><span class="fact open">'+$$(pl.p)+'</span></div>'+
    hoursBadge(pl)+locationHtml(pl)+weeklyHoursHtml(pl)+
    (specialToday(pl,new Date())?'<div class="heads">'+escapeHtml(specialToday(pl,new Date()))+'.</div>':'')+
    (pl.note?'<div class="heads">'+escapeHtml(pl.note)+'</div>':'')+
    (S.why?'<div class="heads">Because '+escapeHtml(S.why)+'.</div>':'')+
    '<div class="row2">'+
      '<button class="big yes" id="yes"><span class="act">'+TICK+'Going</span></button>'+
      '<button class="big no" id="again"><span class="act">'+REDO+'Again</span></button>'+
    '</div>';
  $("s2").classList.add("hide");v.classList.remove("hide");
  window.scrollTo({top:0,behavior:"smooth"});
  $("yes").onclick=()=>{recordVisit(pl,how);renderLog();
    $("yes").innerHTML='<span class="act">'+TICK+'Enjoy</span>';
    $("yes").disabled=true;$("again").disabled=true;};
  $("again").onclick=()=>{
    restore();v.classList.add("hide");
    if(S.mech&&S.pool.length>1){go(2);runMech(S.mech);}else go(0);
  };
}
function restore(){
  const mark=document.querySelector(".mark");if(mark)mark.style.color="";
  document.querySelectorAll("#nav button").forEach(x=>x.style.background="");
}

/* ---------- visit history + rating ---------- */
function ratingWord(rating){
  const r=Number(rating)||0;
  if(!r)return "How was it?";
  if(r<=1.5)return "Nah";
  if(r<=2.5)return "Okay";
  if(r<=3.5)return "Nice";
  if(r<=4.5)return "Shiok";
  return "Go again";
}

function formatRating(rating){
  const r=Number(rating)||0;
  return Number.isInteger(r)?String(r):r.toFixed(1);
}

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
    if(!copy.visitId){copy.visitId="legacy-"+(copy.ts||Date.now())+"-"+index;changed=true;}
    if(!copy.ts){copy.ts=Date.now()-index;changed=true;}
    if(copy.rating===undefined)copy.rating=null;
    if(copy.rating!==null){
      const r=Number(copy.rating);
      const safe=Number.isFinite(r)?Math.max(.5,Math.min(5,Math.round(r*2)/2)):null;
      if(safe!==copy.rating){copy.rating=safe;changed=true;}
    }
    const normalizedArea=normalizeAreaName(copy.area);
    if(copy.area!==normalizedArea){copy.area=normalizedArea;changed=true;}
    if(Number(copy.visits)>1&&!copy.legacyVisits){copy.legacyVisits=Number(copy.visits);changed=true;}
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
  const n=Number(rating);
  if(!item||!Number.isFinite(n))return;
  item.rating=Math.max(.5,Math.min(5,Math.round(n*2)/2));
  item.ratedAt=Date.now();
  persistHistory();
  renderLog();
}

function deleteVisit(visitId){
  const item=S.log.find(x=>x.visitId===visitId);
  if(!item)return;
  if(!window.confirm('Delete this visit to "'+item.n+'" from History?'))return;
  S.log=S.log.filter(x=>x.visitId!==visitId);
  persistHistory();
  renderLog();
}

function clearHistory(){
  if(!S.log.length)return;
  if(!window.confirm("Clear all visit history and ratings? This cannot be undone."))return;
  S.log=[];
  persistHistory();
  setHistoryMenuOpen(false);
  renderLog();
  if(S.extra.has("fresh"))pool();
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

function setHistoryMenuOpen(on){
  const button=$("historyMenu"),panel=$("historyMenuPanel");
  if(!button||!panel)return;
  button.setAttribute("aria-expanded",String(on));
  panel.classList.toggle("hide",!on);
}

function openHistory(){
  renderLog();
  setHistoryMenuOpen(false);
  const page=$("historyScrim");
  if(!page)return;
  page.classList.remove("hide");
  document.body.classList.add("modal-open");
  $("historyClose")?.focus();
}

function closeHistory(){
  const page=$("historyScrim");
  if(!page)return;
  setHistoryMenuOpen(false);
  page.classList.add("hide");
  document.body.classList.remove("modal-open");
  $("quickFab")?.focus();
}

function starRatingHtml(l,rating){
  const visitId=escapeHtml(l.visitId);
  const name=escapeHtml(l.n);
  const stars=[1,2,3,4,5].map(i=>{
    const half=i-.5;
    const fill=rating>=i?100:rating>=half?50:0;
    return '<span class="star-unit" data-fill="'+fill+'" style="--star-fill:'+fill+'%">'+
      '<span class="star-empty" aria-hidden="true">★</span><span class="star-fill" aria-hidden="true">★</span>'+
      '<button class="star-hit star-left" type="button" data-visit="'+visitId+'" data-rating="'+half+'" aria-label="Rate '+name+' '+half+' out of 5"></button>'+
      '<button class="star-hit star-right" type="button" data-visit="'+visitId+'" data-rating="'+i+'" aria-label="Rate '+name+' '+i+' out of 5"></button></span>';
  }).join("");
  return '<div class="star-rating" role="group" aria-label="Rate '+name+' out of 5 stars">'+stars+'</div>';
}

function renderVisitCard(l){
  const rating=Number(l.rating)||0;
  const bits=[];
  if(l.l)bits.push(l.l);
  const time=visitTime(l.ts);if(time)bits.push(time);
  if(l.how)bits.push(l.how);
  if(Number(l.legacyVisits)>1)bits.push(l.legacyVisits+" earlier visits were saved together");
  const visitId=escapeHtml(l.visitId),name=escapeHtml(l.n);
  const trash='<button class="visit-delete" type="button" data-delete-visit="'+visitId+'" aria-label="Delete '+name+' from history" title="Delete visit">'+
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg></button>';
  return '<div class="visit-card">'+
    '<div class="visit-top"><div class="visit-copy"><b>'+name+'</b><span class="visit-meta">'+bits.map(escapeHtml).join(" · ")+'</span></div>'+
    '<div class="visit-side"><span class="visit-score '+(rating?'':'unrated')+'">'+(rating?formatRating(rating)+"/5":"Rate")+'</span>'+trash+'</div></div>'+
    starRatingHtml(l,rating)+
    '<div class="rating-caption">'+ratingWord(rating)+'</div></div>';
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
    '<section class="history-day"><div class="history-date">'+escapeHtml(group.label)+'</div>'+group.items.map(renderVisitCard).join("")+'</section>'
  ).join("");

  list.querySelectorAll(".star-hit").forEach(b=>{
    b.onclick=()=>rateVisit(b.dataset.visit,Number(b.dataset.rating));
  });
  list.querySelectorAll("[data-delete-visit]").forEach(b=>{
    b.onclick=()=>deleteVisit(b.dataset.deleteVisit);
  });
}

const historyPage=$("historyScrim");
if(historyPage){
  $("historyClose").onclick=closeHistory;
  $("historyMenu").onclick=e=>{
    e.stopPropagation();
    const open=$("historyMenu").getAttribute("aria-expanded")==="true";
    setHistoryMenuOpen(!open);
  };
  $("historyMenuPanel").onclick=e=>e.stopPropagation();
  $("historyClear").onclick=clearHistory;
  document.addEventListener("pointerdown",e=>{
    const wrap=e.target.closest?.(".history-menu-wrap");
    if(!wrap)setHistoryMenuOpen(false);
  });
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&!historyPage.classList.contains("hide")){
      const menuOpen=$("historyMenu")?.getAttribute("aria-expanded")==="true";
      if(menuOpen)setHistoryMenuOpen(false);else closeHistory();
    }
  });
}
