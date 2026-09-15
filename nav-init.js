/* ---------- nav ---------- */
function animateTitle(n){
  const title=$("s"+n)?.querySelector(".title-motion");
  if(!title)return;
  title.classList.remove("title-pop");
  void title.offsetWidth;
  title.classList.add("title-pop");
}

function go(n){
  S.stage=n;restore();
  [0,1,2].forEach(i=>$("s"+i).classList.toggle("hide",i!==n));
  $("sv").classList.add("hide");
  document.body.style.setProperty("--bg",BG[n]);
  document.querySelectorAll("#nav button").forEach((b,i)=>b.setAttribute("data-on",String(i===n)));
  if(n===1&&!$("rPick").children.length)buildRituals();
  if(n===2)buildMechs();
  animateTitle(n);
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("#nav button").forEach(b=>b.onclick=()=>go(+b.dataset.go));
document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>go(+b.dataset.next));

/* ---------- top day + time ---------- */
function updateTopTime(){
  const el=$("topTime");
  if(!el)return;
  const d=new Date();
  const day=d.toLocaleDateString("en-SG",{weekday:"short"});
  const time=d.toLocaleTimeString("en-SG",{hour:"numeric",minute:"2-digit"}).replace(/\s/g,"").toLowerCase();
  el.textContent=day+" · "+time;
  el.dateTime=d.toISOString();
  el.setAttribute("aria-label",day+", "+time);
}

/* ---------- playful app-name switcher ---------- */
const BRAND_NAMES=[
  {text:"Eat What?!",key:"eat",fx:"plate"},
  {text:"Jiak Simi?!",key:"jiak",fx:"scooter"},
  {text:"Makan Apa?!",key:"makan",fx:"bowl"},
  {text:"吃什么?!",key:"chi",fx:"chopsticks"}
];
let brandIndex=0;
const brand=$("brandName");
const brandFxLayer=$("brandFxLayer");

const BRAND_FX={
  scooter:'<svg viewBox="0 0 96 36" aria-hidden="true"><path class="fx-line" d="M5 27h18M2 22h11"/><circle class="fx-wheel" cx="35" cy="27" r="6"/><circle class="fx-wheel" cx="73" cy="27" r="6"/><path class="fx-line" d="M35 27h18l8-14h13l9 14H73M48 27l-5-14h16l4 8M68 13V8h12v10"/><path class="fx-food" d="M70 8c2-4 7-4 9 0"/></svg>',
  bowl:'<svg viewBox="0 0 64 48" aria-hidden="true"><path class="fx-steam s1" d="M24 14c-5-5 4-7 0-12"/><path class="fx-steam s2" d="M38 14c5-5-4-7 0-12"/><path class="fx-bowl" d="M9 25c4-5 13-8 23-8s19 3 23 8l-5 12c-4 6-12 9-18 9s-14-3-18-9L9 25Z"/><path class="fx-line" d="M11 25c8 4 34 4 42 0M45 4 31 20M54 7 38 21"/></svg>',
  plate:'<svg viewBox="0 0 58 42" aria-hidden="true"><ellipse class="fx-plate" cx="29" cy="22" rx="17" ry="11"/><ellipse class="fx-line" cx="29" cy="22" rx="10" ry="6"/><path class="fx-line" d="M8 8v25M4 8v9M12 8v9M49 8c5 6 5 12 0 17v8"/></svg>',
  chopsticks:'<svg viewBox="0 0 64 48" aria-hidden="true"><path class="fx-line" d="M14 7 42 39M24 4l25 31"/><path class="fx-noodle" d="M31 17c7-5 13 2 8 7-5 4-1 10 5 7"/><path class="fx-spark" d="M52 7v8M48 11h8"/></svg>'
};

function playBrandFx(kind){
  if(!brandFxLayer||!BRAND_FX[kind])return;
  const fx=document.createElement("span");
  fx.className="brand-fx brand-fx-"+kind;
  fx.innerHTML=BRAND_FX[kind];
  brandFxLayer.appendChild(fx);
  window.setTimeout(()=>fx.remove(),1500);
}

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
    const next=BRAND_NAMES[brandIndex];
    brand.classList.remove("brand-pop");
    void brand.offsetWidth;
    paintBrand();
    brand.classList.add("brand-pop");
    playBrandFx(next.fx);
  };
}

const flags=PLACES.filter(p=>p.check).length;

buildFilters();pool();renderLog();go(1);
updateTopTime();tickClock();
setInterval(()=>{updateTopTime();tickClock();},30000);
