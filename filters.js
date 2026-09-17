/* ---------- filters ---------- */
function chip(t,fn){const b=document.createElement("button");
  b.className="chip";b.type="button";b.textContent=t;b.setAttribute("aria-pressed","false");
  b.onclick=()=>fn(b);return b;}

const areaSort=(a,b)=>{
  const ai=AREA_OPTIONS.indexOf(a),bi=AREA_OPTIONS.indexOf(b);
  if(ai!==-1||bi!==-1){
    if(ai===-1)return 1;
    if(bi===-1)return -1;
    return ai-bi;
  }
  return a.localeCompare(b);
};

function buildFilters(){
  $("fArea").innerHTML="";$("fLoc").innerHTML="";$("fCui").innerHTML="";

  /* "Open now" is no longer a user-controlled rule. Availability is always
     applied from opening hours, so remove any stale runtime flag defensively. */
  S.extra.delete("now");

  const areas=[...new Set([...AREA_OPTIONS,...PLACES.map(placeArea)])].sort(areaSort);
  const availableAreas=areas.filter(a=>PLACES.some(p=>placeArea(p)===a));
  if(!availableAreas.includes(S.area))S.area=availableAreas[0]||"CBD";
  const areaPanel=$("fAreaPanel");
  if(areaPanel)areaPanel.classList.remove("hide");

  areas.forEach(a=>{
    const count=PLACES.filter(p=>placeArea(p)===a).length;
    const b=chip(count?a:a+" · soon",()=>{
      if(!count||S.area===a)return;
      S.area=a;
      S.loc.clear();
      buildFilters();
      pool();
    });
    b.disabled=!count;
    b.classList.toggle("area-soon",!count);
    b.setAttribute("aria-pressed",String(S.area===a));
    if(!count)b.setAttribute("aria-label",a+" coming soon");
    $("fArea").appendChild(b);
  });

  /* Buildings and cuisines should reflect places that are actually usable now.
     This prevents users selecting a building whose restaurants are all closed. */
  const now=singaporeNow();
  const inArea=PLACES.filter(p=>(!S.area||placeArea(p)===S.area)&&state(p,now)==="open");
  const locations=[...new Set(inArea.map(p=>p.l).filter(Boolean))];
  [...S.loc].forEach(l=>{if(!locations.includes(l))S.loc.delete(l);});
  locations.forEach(l=>{
    const b=chip(l,x=>{S.loc.has(l)?S.loc.delete(l):S.loc.add(l);
      x.setAttribute("aria-pressed",String(S.loc.has(l)));pool();});
    b.setAttribute("aria-pressed",String(S.loc.has(l)));$("fLoc").appendChild(b);});

  const cuisines=[...new Set(inArea.map(p=>p.c).filter(Boolean))].sort();
  [...S.cui].forEach(c=>{if(!cuisines.includes(c))S.cui.delete(c);});
  cuisines.forEach(c=>{
    const b=chip(c,x=>{S.cui.has(c)?S.cui.delete(c):S.cui.add(c);
      x.setAttribute("aria-pressed",String(S.cui.has(c)));pool();});
    b.setAttribute("aria-pressed",String(S.cui.has(c)));$("fCui").appendChild(b);});

  if($("fPrice").children.length)return;
  [1,2,3].forEach(p=>$("fPrice").appendChild(chip($$(p),b=>{
    S.price.has(p)?S.price.delete(p):S.price.add(p);
    b.setAttribute("aria-pressed",String(S.price.has(p)));pool();})));
  [["halal","Halal"],["fresh","Not been lately"]].forEach(([k,t])=>
    $("fExtra").appendChild(chip(t,b=>{
      S.extra.has(k)?S.extra.delete(k):S.extra.add(k);
      b.setAttribute("aria-pressed",String(S.extra.has(k)));pool();})));
}
