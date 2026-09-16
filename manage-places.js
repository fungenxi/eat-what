/* ---------- manage places / local permanent delete ---------- */
const DELETED_PLACE_STORAGE="eatwhat.deletedPlaces.v1";
const deletedPlaceKeys=new Set(readLocal(DELETED_PLACE_STORAGE,[]).filter(x=>typeof x==="string"));

function placeDeleteKey(p){
  return p.id||[p.n||"",p.l||"",placeArea(p)||""].join("|");
}

function persistDeletedPlaces(){
  writeLocal(DELETED_PLACE_STORAGE,[...deletedPlaceKeys]);
}

function pruneDeletedPlaces(){
  for(let i=PLACES.length-1;i>=0;i--){
    const p=PLACES[i];
    if(!p.user&&deletedPlaceKeys.has(placeDeleteKey(p)))PLACES.splice(i,1);
  }
  if(typeof S!=="undefined"){
    S.base=S.base.filter(p=>PLACES.includes(p));
    S.pool=S.pool.filter(p=>PLACES.includes(p));
  }
}
pruneDeletedPlaces();

let manageArea="All";
let manageQuery="";

function manageAreas(){
  return ["All",...new Set(PLACES.map(placeArea))].sort((a,b)=>{
    if(a==="All")return -1;if(b==="All")return 1;
    if(a==="CBD")return -1;if(b==="CBD")return 1;
    return a.localeCompare(b);
  });
}

function manageLocationLine(p){
  return [p.l,p.w].filter(Boolean).join(" · ")+(p.address?" · "+p.address:"");
}

function renderManagePlaces(){
  const list=$("manageList"),areas=$("manageAreas");
  if(!list||!areas)return;

  const areaOptions=manageAreas();
  if(!areaOptions.includes(manageArea))manageArea="All";
  areas.replaceChildren();
  areaOptions.forEach(area=>{
    const b=document.createElement("button");
    b.className="chip";b.type="button";b.textContent=area;
    b.dataset.manageArea=area;
    b.setAttribute("aria-pressed",String(manageArea===area));
    b.onclick=()=>{manageArea=area;renderManagePlaces();};
    areas.appendChild(b);
  });

  const q=manageQuery.trim().toLowerCase();
  const rows=PLACES.filter(p=>(manageArea==="All"||placeArea(p)===manageArea)&&(!q||[
    p.n,p.c,p.l,p.w,p.address,placeArea(p)
  ].filter(Boolean).join(" ").toLowerCase().includes(q))).sort((a,b)=>
    placeArea(a).localeCompare(placeArea(b))||String(a.l||"").localeCompare(String(b.l||""))||String(a.n||"").localeCompare(String(b.n||"")));

  list.replaceChildren();
  if(!rows.length){
    const empty=document.createElement("div");empty.className="manage-empty";empty.textContent="No places match this search.";
    list.appendChild(empty);return;
  }

  rows.forEach(p=>{
    const row=document.createElement("div");row.className="manage-row";row.dataset.manageKey=placeDeleteKey(p);
    const copy=document.createElement("div");copy.className="manage-copy";
    const name=document.createElement("b");name.textContent=p.n;
    const location=document.createElement("span");location.textContent=manageLocationLine(p);
    const hours=document.createElement("small");hours.textContent=hoursLine(p,new Date())||"Opening hours not confirmed";
    copy.append(name,location,hours);

    const del=document.createElement("button");del.className="manage-delete";del.type="button";del.textContent="Delete";
    del.setAttribute("aria-label","Delete "+p.n);
    del.onclick=()=>deletePlaceFromApp(p);
    row.append(copy,del);list.appendChild(row);
  });
}

function deletePlaceFromApp(p){
  const ok=window.confirm('Delete "'+p.n+'" from Eat What?! on this device?\n\nIt will stop appearing in filters, games and recommendations.');
  if(!ok)return;

  if(p.user){
    const i=PERSONAL_PLACES.indexOf(p);
    if(i>=0)PERSONAL_PLACES.splice(i,1);
    else{
      const fallback=PERSONAL_PLACES.findIndex(x=>x.n===p.n&&x.l===p.l&&placeArea(x)===placeArea(p));
      if(fallback>=0)PERSONAL_PLACES.splice(fallback,1);
    }
    savePersonalPlaces();
  }else{
    deletedPlaceKeys.add(placeDeleteKey(p));
    persistDeletedPlaces();
  }

  const runtimeIndex=PLACES.indexOf(p);
  if(runtimeIndex>=0)PLACES.splice(runtimeIndex,1);

  /* Keep the user's filters intact if other places still satisfy them.
     buildFilters() already prunes location/cuisine selections only when they truly disappear. */
  buildFilters();pool();renderManagePlaces();
}

function openManagePlaces(){
  manageArea=S.area||"All";
  manageQuery="";
  const page=$("manageScrim");
  if(!page)return;
  page.classList.remove("hide");
  document.body.classList.add("modal-open");
  const search=$("manageSearch");
  if(search)search.value="";
  renderManagePlaces();
  $("manageClose")?.focus();
}

function closeManagePlaces(){
  const page=$("manageScrim");
  if(!page)return;
  page.classList.add("hide");
  document.body.classList.remove("modal-open");
  $("quickFab")?.focus();
}

const managePage=$("manageScrim");
if(managePage){
  $("manageClose").onclick=closeManagePlaces;
  $("manageSearch").addEventListener("input",e=>{manageQuery=e.target.value;renderManagePlaces();});
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&!managePage.classList.contains("hide"))closeManagePlaces();
  });
}
