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
    hoursBadge(pl)+
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

/* ---------- Been there + Yum score ---------- */
const RATING_WORDS=["","Nah","Okay","Nice","Shiok","Go again"];

function visitKey(x){
  return x.key||x.id||[x.n,x.l||"",x.area||""].join("|");
}

function normalizeHistory(){
  const merged=[],seen=new Map();
  S.log.forEach(item=>{
    if(!item||typeof item.n!=="string")return;
    const key=visitKey(item),count=Math.max(1,Number(item.visits)||1);
    if(!seen.has(key)){
      const copy={...item,key,visits:count};
      seen.set(key,copy);merged.push(copy);
    }else{
      const first=seen.get(key);
      first.visits+=count;
      if((first.rating===undefined||first.rating===null)&&item.rating)first.rating=item.rating;
      if(!first.ts&&item.ts)first.ts=item.ts;
    }
  });
  S.log=merged;
}

function recordVisit(pl,how){
  normalizeHistory();
  const key=pl.id||[pl.n,pl.l||"",pl.area||""].join("|");
  const i=S.log.findIndex(x=>visitKey(x)===key);
  if(i>=0){
    const old=S.log.splice(i,1)[0];
    S.log.unshift({...old,key,n:pl.n,l:pl.l,area:pl.area||"Civic District",how,ts:Date.now(),visits:(Number(old.visits)||1)+1});
  }else{
    S.log.unshift({key,id:pl.id||null,n:pl.n,l:pl.l||"",area:pl.area||"Civic District",how,ts:Date.now(),visits:1,rating:null});
  }
  saveHistory();
}

function rateVisit(index,rating){
  const item=S.log[index];
  if(!item)return;
  item.rating=rating;
  item.ratedAt=Date.now();
  saveHistory();
  renderLog();
}

function visitDate(ts){
  if(!ts)return "";
  const d=new Date(ts);
  if(Number.isNaN(d.getTime()))return "";
  return d.toLocaleDateString("en-SG",{day:"numeric",month:"short"});
}

function renderLog(){
  normalizeHistory();
  const box=$("logBox"),list=$("logList"),count=$("visitCount");
  if(!box||!list)return;
  box.classList.toggle("hide",!S.log.length);
  if(count)count.textContent=S.log.length+" "+(S.log.length===1?"place":"places");
  list.innerHTML=S.log.slice(0,8).map((l,index)=>{
    const rating=Number(l.rating)||0;
    const bits=[];
    if((Number(l.visits)||1)>1)bits.push((Number(l.visits)||1)+" visits");
    if(l.how)bits.push(l.how);
    const date=visitDate(l.ts);if(date)bits.push(date);
    const buttons=[1,2,3,4,5].map(n=>
      '<button class="rating-btn" type="button" data-visit="'+index+'" data-rating="'+n+'" '+
      'aria-pressed="'+String(rating===n)+'" aria-label="Rate '+l.n+' '+n+' out of 5 — '+RATING_WORDS[n]+'" title="'+RATING_WORDS[n]+'">'+n+'</button>'
    ).join("");
    return '<div class="visit-card">'+
      '<div class="visit-top"><div class="visit-copy"><b>'+l.n+'</b><span class="visit-meta">'+bits.join(" · ")+'</span></div>'+
      '<span class="visit-score '+(rating?'':'unrated')+'">'+(rating?rating+"/5":"Rate")+'</span></div>'+
      '<div class="rating-scale" role="group" aria-label="Rate '+l.n+' out of 5">'+buttons+'</div>'+
      '<div class="rating-caption">'+(rating?rating+"/5 · "+RATING_WORDS[rating]:"How was it?")+'</div></div>';
  }).join("");
  list.querySelectorAll(".rating-btn").forEach(b=>{
    b.onclick=()=>rateVisit(Number(b.dataset.visit),Number(b.dataset.rating));
  });
}
