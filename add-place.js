/* ---------- add a place ---------- */
const COLMAP=[
  [/sichuan|korean|peranakan|nonya|indonesian|seafood|mala|spicy/i,"red"],
  [/hainanese|teochew|porridge|dumpling|taiwanese|drinks|dessert/i,"white"],
  [/salad|vegetarian|vegan|cafe|thai|healthy|juice/i,"green"]
];
const guessColour=c=>(COLMAP.find(([re])=>re.test(c))||[0,"brown"])[1];

function openSheet(){
  const scrim=document.createElement("div");
  scrim.className="scrim";scrim.setAttribute("role","dialog");scrim.setAttribute("aria-modal","true");
  scrim.innerHTML=
   '<div class="sheet"><h2>Add a place</h2>'+
   '<div class="field"><label for="aName">Name</label>'+
   '<input id="aName" type="text" placeholder="Sing Swee Kee" autocomplete="off"></div>'+
   '<div class="field"><label for="aArea">Area</label>'+
   '<input id="aArea" type="text" list="areaList" placeholder="Civic District" autocomplete="off">'+
   '<datalist id="areaList"></datalist></div>'+
   '<div class="two">'+
     '<div class="field"><label for="aLoc">Building</label>'+
     '<input id="aLoc" type="text" list="locList" placeholder="Funan" autocomplete="off">'+
     '<datalist id="locList"></datalist></div>'+
     '<div class="field"><label for="aCui">Cuisine</label>'+
     '<input id="aCui" type="text" list="cuiList" placeholder="Hainanese" autocomplete="off">'+
     '<datalist id="cuiList"></datalist></div>'+
   '</div>'+
   '<div class="field"><label>Budget</label><div class="chips" id="aPrice"></div></div>'+
   '<div class="two">'+
     '<div class="field"><label for="aOpen">Opens</label>'+
     '<input id="aOpen" type="time" value="11:00"></div>'+
     '<div class="field"><label for="aShut">Closes</label>'+
     '<input id="aShut" type="time" value="21:00"></div>'+
   '</div>'+
   '<div class="field"><label for="aNote">Notes</label>'+
   '<input id="aNote" type="text" placeholder="Come early, cash only" autocomplete="off"></div>'+
   '<div class="pairs"><button class="big" id="aCancel" type="button">Cancel</button>'+
   '<button class="big pop" id="aSave" type="button">Add</button></div></div>';
  document.body.appendChild(scrim);

  const areas=[...new Set(PLACES.map(placeArea))].sort(areaSort);
  $("areaList").innerHTML=areas.map(v=>'<option value="'+v+'">').join("");
  $("aArea").value=S.area||areas[0]||"Civic District";
  $("cuiList").innerHTML=[...new Set(PLACES.map(x=>x.c))].sort().map(v=>'<option value="'+v+'">').join("");

  const refreshLocList=()=>{
    const area=$("aArea").value.trim();
    const options=[...new Set(PLACES.filter(x=>!area||placeArea(x)===area).map(x=>x.l))];
    $("locList").innerHTML=options.map(v=>'<option value="'+v+'">').join("");
  };
  refreshLocList();
  $("aArea").addEventListener("input",refreshLocList);

  let price=1;
  [1,2,3].forEach(n=>{
    const b=document.createElement("button");b.className="chip";b.type="button";
    b.textContent=$$(n);b.setAttribute("aria-pressed",String(n===1));
    b.onclick=()=>{price=n;[...$("aPrice").children].forEach((x,i)=>
      x.setAttribute("aria-pressed",String(i+1===n)));};
    $("aPrice").appendChild(b);
  });

  const shut=()=>{scrim.remove();$("quickFab")?.focus();};
  $("aCancel").onclick=shut;
  scrim.onclick=e=>{if(e.target===scrim)shut();};
  document.addEventListener("keydown",function esc(e){
    if(e.key==="Escape"&&document.body.contains(scrim)){shut();document.removeEventListener("keydown",esc);}});

  $("aSave").onclick=()=>{
    const n=$("aName").value.trim();
    if(!n){$("aName").focus();return;}
    const c=$("aCui").value.trim()||"Mixed";
    const area=$("aArea").value.trim()||S.area||"Civic District";
    const hm=v=>{const[a,b]=v.split(":").map(Number);return a+b/60;};
    const o=$("aOpen").value,sh=$("aShut").value;
    const added={n,c,p:price,l:$("aLoc").value.trim()||"Unsorted",area,
      col:guessColour(c),note:$("aNote").value.trim(),w:"",
      h:(o&&sh)?{mf:[hm(o),hm(sh)]}:undefined,src:"user",user:true};
    PERSONAL_PLACES.push(added);
    PLACES.push(added);
    savePersonalPlaces();
    S.area=area;S.loc.clear();
    buildFilters();pool();shut();
    const t=$("today0");
    if(t)t.insertAdjacentHTML("afterend",'<div class="reveal" id="aDone">'+n+' is in.</div>');
    setTimeout(()=>$("aDone")&&$("aDone").remove(),3000);
  };
  $("aName").focus();
}

/* ---------- bottom-right quick actions ---------- */
const quickFab=$("quickFab"),quickActions=$("quickActions");
let quickOpen=false,draggingQuick=false,dragTarget=null,openedOnPointerDown=false,suppressQuickClick=false;

function setQuickOpen(on){
  quickOpen=on;
  if(!quickFab||!quickActions)return;
  quickActions.setAttribute("data-open",String(on));
  quickActions.setAttribute("aria-hidden",String(!on));
  quickFab.setAttribute("aria-expanded",String(on));
  quickFab.setAttribute("data-open",String(on));
  if(!on){
    quickActions.querySelectorAll(".quick-action").forEach(b=>b.classList.remove("drag-over"));
    dragTarget=null;
  }
}

function runQuickAction(action){
  setQuickOpen(false);
  if(action==="add")openSheet();
  if(action==="history"&&typeof openHistory==="function")openHistory();
}

if(quickFab&&quickActions){
  quickActions.querySelectorAll("[data-quick]").forEach(b=>{
    b.onclick=e=>{e.stopPropagation();runQuickAction(b.dataset.quick);};
  });

  quickFab.addEventListener("pointerdown",e=>{
    openedOnPointerDown=!quickOpen;
    if(openedOnPointerDown)setQuickOpen(true);
    draggingQuick=true;dragTarget=null;
    quickFab.setPointerCapture?.(e.pointerId);
  });

  quickFab.addEventListener("pointermove",e=>{
    if(!draggingQuick||!quickOpen)return;
    const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest?.("[data-quick]");
    quickActions.querySelectorAll(".quick-action").forEach(b=>b.classList.toggle("drag-over",b===hit));
    dragTarget=hit||null;
  });

  quickFab.addEventListener("pointerup",e=>{
    if(!draggingQuick)return;
    draggingQuick=false;
    if(dragTarget){
      const action=dragTarget.dataset.quick;
      suppressQuickClick=true;
      runQuickAction(action);
      setTimeout(()=>{suppressQuickClick=false;},0);
    }
    quickFab.releasePointerCapture?.(e.pointerId);
  });

  quickFab.addEventListener("pointercancel",()=>{draggingQuick=false;dragTarget=null;});
  quickFab.onclick=e=>{
    e.stopPropagation();
    if(suppressQuickClick)return;
    if(openedOnPointerDown){openedOnPointerDown=false;return;}
    setQuickOpen(!quickOpen);
  };

  document.addEventListener("pointerdown",e=>{
    if(quickOpen&&!quickActions.contains(e.target)&&e.target!==quickFab)setQuickOpen(false);
  });
}

function pool(){
  const recent=S.log.slice(0,3).map(l=>l.n);
  S.base=PLACES.filter(p=>
    (!S.area||placeArea(p)===S.area)&&
    (!S.loc.size||S.loc.has(p.l))&&(!S.price.size||S.price.has(p.p))&&
    (!S.cui.size||S.cui.has(p.c))&&
    (!S.extra.has("now")||state(p,new Date())==="open")&&
    (!S.extra.has("halal")||p.halal)&&
    (!S.extra.has("fresh")||!recent.includes(p.n)));
  S.pool=[...S.base];paint();
}
function paint(){drawToday(new Date());
  const c=$("listSize");if(c)c.textContent=PLACES.length+" places on the list";}
