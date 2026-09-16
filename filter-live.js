/* Live filter preview + shared filter context across all three decision stages. */
(()=>{
  const basePool=pool;
  const basePaint=paint;
  const RULE_LABELS={now:"Open now",halal:"Halal",fresh:"Not been lately"};

  function resetDecisionViews(){
    if(typeof window.cancelActiveGame==="function")window.cancelActiveGame();
    S.why=null;
    S.mech=null;
    ["rRun","mRun"].forEach(id=>{
      const el=$(id);
      if(!el)return;
      el.innerHTML="";
      el.classList.add("hide");
    });
    ["rPick","mPick"].forEach(id=>{
      const el=$(id);
      if(!el)return;
      el.querySelectorAll('[aria-pressed="true"]').forEach(b=>b.setAttribute("aria-pressed","false"));
    });
  }

  function filterSummaryParts(){
    const parts=[];
    if(S.area)parts.push(S.area);
    if(S.loc.size)parts.push([...S.loc].sort().join(", "));
    if(S.price.size)parts.push([...S.price].sort((a,b)=>a-b).map($$).join(" / "));
    if(S.cui.size)parts.push([...S.cui].sort().join(", "));
    if(S.extra.size)parts.push([...S.extra].map(k=>RULE_LABELS[k]||k).join(", "));
    return parts;
  }

  function optionMeta(pl){
    const where=[pl.l,pl.w].filter(Boolean).join(" · ");
    return [where,pl.c,$$(pl.p)].filter(Boolean).join(" · ");
  }

  function openPlaceDetail(pl,how,backStage){
    if(!pl||typeof win!=="function")return;
    if(typeof window.cancelActiveGame==="function")window.cancelActiveGame();
    ["s0","s1","s2"].forEach(id=>$(id)?.classList.add("hide"));
    win(pl,how);

    /* win() normally treats Again as replaying a Fate game. Directly-opened
       places should instead return to the stage they came from. */
    const again=$("again");
    if(again){
      again.onclick=()=>{
        if(typeof restore==="function")restore();
        $("sv")?.classList.add("hide");
        go(backStage);
      };
    }
  }
  window.openPlaceDetail=openPlaceDetail;

  function openNarrowedPlace(pl){
    S.pool=[pl];
    S.why=null;
    openPlaceDetail(pl,"Narrow it down",0);
  }

  function renderNarrowPreview(){
    const mount=$("filterPreview0");
    if(!mount)return;
    mount.replaceChildren();

    const head=document.createElement("div");
    head.className="filter-preview-head";
    const copy=document.createElement("div");
    const title=document.createElement("b");
    const count=S.base.length;
    title.textContent=count+" "+(count===1?"option":"options")+" left";
    const sub=document.createElement("span");
    sub.textContent=count===1
      ?"Only one left — tap it to view"
      :count>1
        ?"Tap any place to view it, or keep narrowing"
        :"Updates live as you filter";
    copy.append(title,sub);
    head.appendChild(copy);
    mount.appendChild(head);

    if(!count){
      const empty=document.createElement("div");
      empty.className="filter-preview-empty";
      empty.innerHTML='<svg class="filter-empty-art" viewBox="0 0 64 48" aria-hidden="true">'+
        '<ellipse cx="31" cy="27" rx="18" ry="11"/><ellipse cx="31" cy="27" rx="10" ry="6"/>'+
        '<path d="M8 10v25M4 10v9M12 10v9M52 10c5 6 5 12 0 17v8"/>'+
        '<circle class="crumb" cx="25" cy="25" r="1.7"/><circle class="crumb" cx="35" cy="29" r="1.4"/>'+
        '</svg><span class="empty-copy">No places match these filters. Try removing one.</span>';
      mount.appendChild(empty);
      return;
    }

    const list=document.createElement("div");
    list.className="filter-option-list";
    [...S.base]
      .sort((a,b)=>(a.l||"").localeCompare(b.l||"")||a.n.localeCompare(b.n))
      .forEach(pl=>{
        const row=document.createElement("button");
        row.type="button";
        row.className="filter-option";
        row.setAttribute("aria-label","View "+pl.n);
        const name=document.createElement("b");
        name.textContent=pl.n;
        const meta=document.createElement("span");
        meta.textContent=optionMeta(pl);
        row.append(name,meta);
        row.onclick=()=>openNarrowedPlace(pl);
        list.appendChild(row);
      });
    mount.appendChild(list);
  }

  function renderStageContext(id){
    const mount=$(id);
    if(!mount)return;
    mount.replaceChildren();

    const activeCount=S.pool.length;
    const filteredCount=S.base.length;
    const roomNarrowed=Boolean(S.why)&&activeCount!==filteredCount;

    const copy=document.createElement("div");
    copy.className="filter-context-copy";
    const title=document.createElement("b");
    title.textContent=roomNarrowed
      ? activeCount+" "+(activeCount===1?"option":"options")+" now"
      : filteredCount+" filtered "+(filteredCount===1?"option":"options");
    const sub=document.createElement("span");
    const summary=filterSummaryParts().join(" · ");
    sub.textContent=roomNarrowed
      ? "Started with "+filteredCount+" from Narrow it down"+(summary?" · "+summary:"")
      : "From Narrow it down"+(summary?" · "+summary:"");
    copy.append(title,sub);

    const edit=document.createElement("button");
    edit.type="button";
    edit.className="filter-context-edit";
    edit.textContent="Edit";
    edit.onclick=()=>go(0);

    mount.append(copy,edit);
  }

  function renderFilterViews(){
    renderNarrowPreview();
    renderStageContext("filterContext1");
    renderStageContext("filterContext2");

    const next=$("s0")?.querySelector('[data-next="1"]');
    if(next)next.disabled=S.base.length<=1;

    if(typeof window.syncDecisionNav==="function")window.syncDecisionNav();
  }

  paint=function(){
    basePaint();
    renderFilterViews();
  };

  pool=function(){
    resetDecisionViews();
    basePool();

    /* Places can also disappear through Manage places while the user is on Ask/Fate.
       If that leaves zero or one choice, return to Narrow instead of leaving a dead flow. */
    if(S.stage>0&&S.base.length<=1&&typeof go==="function")go(0);
  };

  window.renderFilterViews=renderFilterViews;
})();
