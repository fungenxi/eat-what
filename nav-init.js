/* ---------- nav ---------- */
function animateTitle(n){
  const title=$("s"+n)?.querySelector(".title-motion");
  if(!title)return;
  title.classList.remove("title-pop");
  void title.offsetWidth;
  title.classList.add("title-pop");
}

function countForStage(n){
  if(n===1)return S.base.length;
  if(n===2){
    if(S.stage===1)return S.pool.length;
    if(S.stage===0)return S.base.length;
    return S.pool.length;
  }
  return Infinity;
}

function canEnterStage(n){
  return n===0||countForStage(n)>1;
}

function syncDecisionNav(){
  const navButtons=[...document.querySelectorAll("#nav button")];
  navButtons.forEach((b,i)=>{
    if(i===0)b.disabled=false;
    else b.disabled=!canEnterStage(i);
  });

  const askNext=$("s0")?.querySelector('[data-next="1"]');
  if(askNext)askNext.disabled=S.base.length<=1;

  const fateNext=$("s1")?.querySelector('[data-next="2"]');
  if(fateNext)fateNext.disabled=S.pool.length<=1;
}
window.syncDecisionNav=syncDecisionNav;

function go(n){
  if(!canEnterStage(n)){
    syncDecisionNav();
    return false;
  }

  const fromStage=S.stage;
  if(fromStage===2&&n!==2&&typeof window.cancelActiveGame==="function")window.cancelActiveGame();

  /* Going straight from Narrow to Ask/Fate starts from the current filters,
     rather than accidentally carrying an older Ask-the-room subset. */
  if(fromStage===0&&(n===1||n===2)){
    S.pool=[...S.base];
    S.why=null;
  }

  S.stage=n;restore();
  [0,1,2].forEach(i=>$("s"+i).classList.toggle("hide",i!==n));
  $("sv").classList.add("hide");
  document.body.style.setProperty("--bg",BG[n]);
  document.querySelectorAll("#nav button").forEach((b,i)=>b.setAttribute("data-on",String(i===n)));
  if(n===1&&!$("rPick").children.length)buildRituals();
  if(n===2)buildMechs();
  syncDecisionNav();
  animateTitle(n);
  window.scrollTo({top:0,behavior:"smooth"});
  return true;
}
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>go(+b.dataset.go));
document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>go(+b.dataset.next));

/* ---------- playful app-name switcher ---------- */
const BRAND_NAMES=[
  {text:"Eat What?!",key:"eat"},
  {text:"Jiak Simi?!",key:"jiak"},
  {text:"Makan Apa?!",key:"makan"},
  {text:"吃什么?!",key:"chi"}
];
let brandIndex=0;
const brand=$("brandName");

if(brand){
  const paintBrand=()=>{
    const next=BRAND_NAMES[brandIndex];
    brand.textContent=next.text;
    brand.dataset.brand=next.key;
    brand.setAttribute("aria-label","App name: "+next.text+". Tap to switch");
  };
  paintBrand();
  brand.onclick=()=>{
    brandIndex=(brandIndex+1)%BRAND_NAMES.length;
    brand.classList.remove("brand-pop");
    void brand.offsetWidth;
    paintBrand();
    brand.classList.add("brand-pop");
  };
}

const flags=PLACES.filter(p=>p.check).length;

buildFilters();pool();renderLog();go(0);
tickClock();
setInterval(tickClock,30000);
