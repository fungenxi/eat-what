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
  $("yes").onclick=()=>{S.log.unshift({n:pl.n,how});saveHistory();renderLog();
    $("yes").innerHTML='<span class="act">'+TICK+'Enjoy</span>';
    $("yes").disabled=true;$("again").disabled=true;};
  $("again").onclick=()=>{restore();v.classList.add("hide");go(2);runMech(S.mech);};
}
function restore(){
  document.querySelector(".mark").style.color="";
  document.querySelectorAll("#nav button").forEach(x=>x.style.background="");
}
function renderLog(){
  $("logBox").classList.toggle("hide",!S.log.length);
  $("logList").innerHTML=S.log.slice(0,6).map(l=>
    '<div class="logrow"><b>'+l.n+'</b><span>'+l.how+'</span></div>').join("");
}
