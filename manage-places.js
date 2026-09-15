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
  areas.innerHTML=areaOptions.map(area=>
    '<button class="chip" type="button" data-manage-area="'+area+'" aria-pressed="'+String(manageArea===area)+'">'+area+'</button>'
  ).join("");
  areas.querySelectorAll("[data-manage-area]").forEach(b=>{
    b.onclick=()=>{manageArea=b.dataset.manageArea;renderManagePlaces();};
  });

  const q=manageQuery.trim().toLowerCase();
  const rows=PLACES.filter(p=>(manageArea==="All"||placeArea(p)===manageArea)&&(!q||[
    p.n,p.c,p.l,p.w,p.address,placeArea(p)
  ].filter(Boolean).join(" ").toLowerCase().includes(q))).sort((a,b)=>placeArea(a).localeCompare(placeArea(b))||a.l.localeCompare(b.l)||a.n.localeCompare(b.n));

  if(!rows.length){
    list.innerHTML='<div class="manage-empty">No places match this search.</div>';
    return;
  }

  list.innerHTML=rows.map(p=>{
    const today=hoursLine(p,new Date());
    return '<div class="manage-row" data-manage-key="'+placeDeleteKey(p)+'">'+
      '<div class="manage-copy"><b>'+p.n+'</b><span>'+manageLocationLine(p)+'</span>'+
      '<small>'+(today||"Opening hours not confirmed")+'</small></div>'+
      '<button class="manage-delete" type="button" aria-label="Delete '+p.n+'">Delete</button></div>';
  }).join("");

  list.querySelectorAll(".manage-delete").forEach(btn=>{
    btn.onclick=()=>{
      const row=btn.closest("[data-manage-key]");
      const p=PLACES.find(x=>placeDeleteKey(x)===row?.dataset.manageKey);
      if(p)deletePlaceFromApp(p);
    };
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
  S.loc.delete(p.l);S.cui.delete(p.c);
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
