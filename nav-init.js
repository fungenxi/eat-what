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
