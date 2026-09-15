/* ---------- nav ---------- */
function go(n){
  S.stage=n;restore();
  [0,1,2].forEach(i=>$("s"+i).classList.toggle("hide",i!==n));
  $("sv").classList.add("hide");
  document.body.style.setProperty("--bg",BG[n]);
  document.querySelectorAll("#nav button").forEach((b,i)=>b.setAttribute("data-on",String(i===n)));
  if(n===1&&!$("rPick").children.length)buildRituals();
  if(n===2)buildMechs();
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>go(+b.dataset.go));
document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>go(+b.dataset.next));

const flags=PLACES.filter(p=>p.check).length;

buildFilters();pool();renderLog();go(1);
tickClock();setInterval(tickClock,30000);
