/* ---------- filters ---------- */
function chip(t,fn){const b=document.createElement("button");
  b.className="chip";b.type="button";b.textContent=t;b.setAttribute("aria-pressed","false");
  b.onclick=()=>fn(b);return b;}

const areaSort=(a,b)=>a==="Civic District"&&b!=="Civic District"?-1:
  b==="Civic District"&&a!=="Civic District"?1:a.localeCompare(b);

function buildFilters(){
  $("fArea").innerHTML="";$("fLoc").innerHTML="";$("fCui").innerHTML="";

  const areas=[...new Set(PLACES.map(placeArea))].sort(areaSort);
  if(!areas.includes(S.area))S.area=areas[0]||null;
  const areaPanel=$("fAreaPanel");
  if(areaPanel)areaPanel.classList.toggle("hide",areas.length<=1);

  areas.forEach(a=>{
    const b=chip(a,()=>{
      if(S.area===a)return;
      S.area=a;
      S.loc.clear();
      buildFilters();
      pool();
    });
    b.setAttribute("aria-pressed",String(S.area===a));
    $("fArea").appendChild(b);
  });

  const inArea=PLACES.filter(p=>!S.area||placeArea(p)===S.area);
  const locations=[...new Set(inArea.map(p=>p.l))];
  [...S.loc].forEach(l=>{if(!locations.includes(l))S.loc.delete(l);});
  locations.forEach(l=>{
    const b=chip(l,x=>{S.loc.has(l)?S.loc.delete(l):S.loc.add(l);
      x.setAttribute("aria-pressed",String(S.loc.has(l)));pool();});
    b.setAttribute("aria-pressed",String(S.loc.has(l)));$("fLoc").appendChild(b);});

  const cuisines=[...new Set(inArea.map(p=>p.c))].sort();
  [...S.cui].forEach(c=>{if(!cuisines.includes(c))S.cui.delete(c);});
  cuisines.forEach(c=>{
    const b=chip(c,x=>{S.cui.has(c)?S.cui.delete(c):S.cui.add(c);
      x.setAttribute("aria-pressed",String(S.cui.has(c)));pool();});
    b.setAttribute("aria-pressed",String(S.cui.has(c)));$("fCui").appendChild(b);});

  if($("fPrice").children.length)return;
  [1,2,3].forEach(p=>$("fPrice").appendChild(chip($$(p),b=>{
    S.price.has(p)?S.price.delete(p):S.price.add(p);
    b.setAttribute("aria-pressed",String(S.price.has(p)));pool();})));
  [["now","Open now"],["halal","Halal"],["fresh","Not been lately"]].forEach(([k,t])=>
    $("fExtra").appendChild(chip(t,b=>{
      S.extra.has(k)?S.extra.delete(k):S.extra.add(k);
      b.setAttribute("aria-pressed",String(S.extra.has(k)));pool();})));
}
