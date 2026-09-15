/* ---------- filters ---------- */
function chip(t,fn){const b=document.createElement("button");
  b.className="chip";b.type="button";b.textContent=t;b.setAttribute("aria-pressed","false");
  b.onclick=()=>fn(b);return b;}

function buildFilters(){
  $("fLoc").innerHTML="";$("fCui").innerHTML="";
  [...new Set(PLACES.map(p=>p.l))].forEach(l=>{
    const b=chip(l,x=>{S.loc.has(l)?S.loc.delete(l):S.loc.add(l);
      x.setAttribute("aria-pressed",String(S.loc.has(l)));pool();});
    b.setAttribute("aria-pressed",String(S.loc.has(l)));$("fLoc").appendChild(b);});
  [...new Set(PLACES.map(p=>p.c))].sort().forEach(c=>{
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
