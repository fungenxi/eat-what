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
   '<input id="aArea" type="text" placeholder="Type any area" autocomplete="off">'+
   '<datalist id="areaList"></datalist></div>'+
   '<div class="two">'+
     '<div class="field"><label for="aLoc">Building / hawker centre</label>'+
     '<input id="aLoc" type="text" placeholder="Type any building / hawker centre" autocomplete="off">'+
     '<datalist id="locList"></datalist></div>'+
     '<div class="field"><label for="aUnit">Unit / stall</label>'+
     '<input id="aUnit" type="text" placeholder="02-84" autocomplete="off"></div>'+
   '</div>'+
   '<div class="two">'+
     '<div class="field"><label for="aCui">Cuisine</label>'+
     '<input id="aCui" type="text" list="cuiList" placeholder="Hainanese" autocomplete="off">'+
     '<datalist id="cuiList"></datalist></div>'+
     '<div class="field"><label for="aAddress">Full address</label>'+
     '<input id="aAddress" type="text" placeholder="335 Smith Street, Singapore 050335" autocomplete="off"></div>'+
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

  const fillDatalist=(id,values)=>{
    const list=$(id);if(!list)return;
    list.replaceChildren();
    values.forEach(value=>{const o=document.createElement("option");o.value=value;list.appendChild(o);});
  };

  const areas=[...new Set([...AREA_OPTIONS,...PLACES.map(placeArea)])].sort(areaSort);
  fillDatalist("areaList",areas);
  $("aArea").value=S.area||areas[0]||"CBD";
  fillDatalist("cuiList",[...new Set(PLACES.map(x=>x.c))].sort());

  const refreshLocList=()=>{
    const area=normalizeAreaName($("aArea").value);
    const options=[...new Set(PLACES.filter(x=>!area||placeArea(x)===area).map(x=>x.l))].filter(Boolean).sort();
    fillDatalist("locList",options);
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

  const esc=e=>{if(e.key==="Escape"&&document.body.contains(scrim))shut();};
  const shut=()=>{
    document.removeEventListener("keydown",esc);
    scrim.remove();
    $("quickFab")?.focus();
  };
  $("aCancel").onclick=shut;
  scrim.onclick=e=>{if(e.target===scrim)shut();};
  document.addEventListener("keydown",esc);

  $("aSave").onclick=()=>{
    const nameInput=$("aName"),closeInput=$("aShut");
    nameInput.setCustomValidity("");closeInput.setCustomValidity("");

    const n=nameInput.value.trim().replace(/\s+/g," ");
    if(!n){nameInput.focus();return;}
    const c=$("aCui").value.trim().replace(/\s+/g," ")||"Mixed";
    const area=normalizeAreaName($("aArea").value||S.area||"CBD");
    const loc=$("aLoc").value.trim().replace(/\s+/g," ")||"Unsorted";
    const unit=$("aUnit").value.trim();

    const duplicate=PLACES.some(p=>
      String(p.n||"").trim().toLowerCase()===n.toLowerCase()&&
      String(p.l||"").trim().toLowerCase()===loc.toLowerCase()&&
      placeArea(p).toLowerCase()===area.toLowerCase());
    if(duplicate){
      nameInput.setCustomValidity("This place is already in Eat What?! for this building and area.");
      nameInput.reportValidity();
      return;
    }

    const hm=v=>{const[a,b]=v.split(":").map(Number);return a+b/60;};
    const o=$("aOpen").value,sh=$("aShut").value;
    if(o&&sh&&hm(sh)<=hm(o)){
      closeInput.setCustomValidity("Closing time must be later than opening time for this lunch list.");
      closeInput.reportValidity();
      return;
    }

    const added={
      id:"user-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7),
      n,c,p:price,l:loc,area,
      col:guessColour(c),note:$("aNote").value.trim(),w:unit,address:$("aAddress").value.trim()||null,
      h:(o&&sh)?{mf:[hm(o),hm(sh)]}:undefined,src:"user",user:true
    };
    PERSONAL_PLACES.push(added);
    PLACES.push(added);
    savePersonalPlaces();
    S.area=area;S.loc.clear();
    buildFilters();pool();shut();

    const t=$("today0");
    if(t){
      $("aDone")?.remove();
      const done=document.createElement("div");
      done.className="reveal";done.id="aDone";done.textContent=n+" is in.";
      t.insertAdjacentElement("afterend",done);
      setTimeout(()=>done.remove(),3000);
    }
  };
  $("aName").focus();
}

/* ---------- bottom-right quick actions ---------- */
const quickFab=$("quickFab"),quickActions=$("quickActions");
let quickOpen=false;
let quickPointerActive=false;
let quickWasOpen=false;
let quickStart={x:0,y:0};
let quickDragTarget=null;
let suppressQuickClick=false;

function setQuickOpen(on){
  quickOpen=on;
  if(!quickFab||!quickActions)return;
  quickActions.setAttribute("data-open",String(on));
  quickActions.setAttribute("aria-hidden",String(!on));
  quickFab.setAttribute("aria-expanded",String(on));
  quickFab.setAttribute("data-open",String(on));
  if(!on){
    quickActions.querySelectorAll(".quick-action").forEach(b=>b.classList.remove("drag-over"));
    quickDragTarget=null;
  }
}

function runQuickAction(action){
  setQuickOpen(false);
  if(action==="add")openSheet();
  if(action==="history"&&typeof openHistory==="function")openHistory();
  if(action==="manage"&&typeof openManagePlaces==="function")openManagePlaces();
}

if(quickFab&&quickActions){
  quickActions.querySelectorAll("[data-quick]").forEach(b=>{
    b.onclick=e=>{e.stopPropagation();runQuickAction(b.dataset.quick);};
  });

  quickFab.addEventListener("pointerdown",e=>{
    quickPointerActive=true;
    quickWasOpen=quickOpen;
    quickStart={x:e.clientX,y:e.clientY};
    quickDragTarget=null;
    if(!quickOpen)setQuickOpen(true);
    quickFab.setPointerCapture?.(e.pointerId);
  });

  quickFab.addEventListener("pointermove",e=>{
    if(!quickPointerActive||!quickOpen)return;
    const moved=Math.hypot(e.clientX-quickStart.x,e.clientY-quickStart.y)>8;
    if(!moved){
      quickActions.querySelectorAll(".quick-action").forEach(b=>b.classList.remove("drag-over"));
      quickDragTarget=null;
      return;
    }
    const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest?.("[data-quick]");
    quickActions.querySelectorAll(".quick-action").forEach(b=>b.classList.toggle("drag-over",b===hit));
    quickDragTarget=hit||null;
  });

  quickFab.addEventListener("pointerup",e=>{
    if(!quickPointerActive)return;
    quickPointerActive=false;
    suppressQuickClick=true;
    if(quickDragTarget){
      runQuickAction(quickDragTarget.dataset.quick);
    }else if(quickWasOpen){
      setQuickOpen(false);
    }else{
      setQuickOpen(true);
    }
    quickDragTarget=null;
    quickFab.releasePointerCapture?.(e.pointerId);
    setTimeout(()=>{suppressQuickClick=false;},80);
  });

  quickFab.addEventListener("pointercancel",()=>{
    quickPointerActive=false;
    quickDragTarget=null;
    setQuickOpen(quickWasOpen);
  });

  /* Keyboard / assistive-tech activation. Pointer taps are handled above. */
  quickFab.onclick=e=>{
    e.stopPropagation();
    if(suppressQuickClick)return;
    if(e.detail===0)setQuickOpen(!quickOpen);
  };

  document.addEventListener("pointerdown",e=>{
    if(quickOpen&&!quickActions.contains(e.target)&&!quickFab.contains(e.target))setQuickOpen(false);
  });
}

function pool(){
  const recent=new Set(S.log.slice(0,3).map(visitHistoryKey));
  const now=singaporeNow();

  /* User filters first, availability second. Keeping the pre-hours count lets the
     empty state explain whether filters are too narrow or everything matching is closed. */
  const matched=PLACES.filter(p=>
    (!S.area||placeArea(p)===S.area)&&
    (!S.loc.size||S.loc.has(p.l))&&(!S.price.size||S.price.has(p.p))&&
    (!S.cui.size||S.cui.has(p.c))&&
    (!S.extra.has("halal")||p.halal)&&
    (!S.extra.has("fresh")||!recent.has(placeHistoryKey(p))));

  S.availableBeforeHours=matched.length;
  S.unknownHours=matched.filter(p=>state(p,now)==="unknown").length;
  S.closedByTime=matched.filter(p=>state(p,now)==="closed").length;
  S.base=matched.filter(p=>state(p,now)==="open");
  S.pool=[...S.base];paint();
}
function paint(){drawToday(singaporeNow());
  const c=$("listSize");if(c)c.textContent=PLACES.length+" places on the list";}
