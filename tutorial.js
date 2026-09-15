/* Short first-run tutorial: spotlight the feature, keep the copy light. */
(()=>{
  const STORAGE_KEY="eatwhat.tutorial.v1";
  const STEPS=[
    {
      title:"Narrow it down",
      copy:"Filter by area, building, budget or cuisine. Narrow until can already, then go lor.",
      stage:0,
      target:()=>document.getElementById("fAreaPanel")
    },
    {
      title:"Ask the room",
      copy:"Everyone got opinion? Let the room fight it out.",
      stage:1,
      target:()=>document.getElementById("rPick")
    },
    {
      title:"Let fate decide",
      copy:"Still cannot? Pick a game and let fate decide bah.",
      stage:2,
      target:()=>document.getElementById("mPick")
    },
    {
      title:"Add / History",
      copy:"Add places, see where you went, or clean up your list.",
      before:()=>{ if(typeof setQuickOpen==="function")setQuickOpen(true); },
      target:()=>document.getElementById("quickActions")||document.getElementById("quickFab")
    },
    {
      title:"Rate and remember",
      copy:"Remember to rate so you know where to go again!",
      before:()=>{
        if(typeof setQuickOpen==="function")setQuickOpen(false);
        if(typeof openHistory==="function")openHistory();
      },
      target:()=>document.querySelector(".star-rating")||document.getElementById("historyEmpty")||document.querySelector(".history-shell")
    },
    {
      title:"Ok can liao",
      copy:"",
      final:true,
      before:()=>{
        if(typeof closeHistory==="function"&&!document.getElementById("historyScrim")?.classList.contains("hide"))closeHistory();
        if(typeof setQuickOpen==="function")setQuickOpen(false);
        if(typeof go==="function")go(0);
      }
    }
  ];

  let root=null,index=0,currentTarget=null;

  function seen(){
    try{return localStorage.getItem(STORAGE_KEY)==="done";}catch(_){return false;}
  }
  function markSeen(){
    try{localStorage.setItem(STORAGE_KEY,"done");}catch(_){}
  }

  function blockScroll(e){e.preventDefault();}

  function buildRoot(){
    root=document.createElement("div");
    root.className="tour-root";
    root.setAttribute("role","presentation");
    root.innerHTML=
      '<div class="tour-hitblock" aria-hidden="true"></div>'+
      '<div class="tour-shade tour-top"></div><div class="tour-shade tour-left"></div>'+
      '<div class="tour-shade tour-right"></div><div class="tour-shade tour-bottom"></div>'+
      '<div class="tour-ring"></div>'+
      '<div class="tour-bubble" role="dialog" aria-modal="true" aria-live="polite">'+
        '<div class="tour-copy"><h3></h3><p></p></div>'+
        '<div class="tour-actions"><button class="tour-skip" type="button">Skip</button><button class="tour-next" type="button">Next</button></div>'+
      '</div>';
    document.body.appendChild(root);

    /* No scrolling/dragging the page while the walkthrough is open. */
    root.addEventListener("wheel",blockScroll,{passive:false});
    root.addEventListener("touchmove",blockScroll,{passive:false});

    /* Outside the speech bubble advances; inside only the buttons act. */
    root.querySelector(".tour-hitblock").addEventListener("click",()=>{
      if(STEPS[index]?.final)finish();
      else next();
    });
    root.querySelector(".tour-bubble").addEventListener("click",()=>{
      if(STEPS[index]?.final)finish();
    });
    root.querySelector(".tour-skip").addEventListener("click",finish);
    root.querySelector(".tour-next").addEventListener("click",next);
  }

  function setBox(el,left,top,width,height){
    Object.assign(el.style,{left:left+"px",top:top+"px",width:Math.max(0,width)+"px",height:Math.max(0,height)+"px"});
  }

  function position(){
    if(!root)return;
    const bubble=root.querySelector(".tour-bubble");
    const ring=root.querySelector(".tour-ring");
    const shades={
      top:root.querySelector(".tour-top"),left:root.querySelector(".tour-left"),
      right:root.querySelector(".tour-right"),bottom:root.querySelector(".tour-bottom")
    };
    const vw=window.innerWidth,vh=window.innerHeight;

    if(!currentTarget){
      setBox(shades.top,0,0,vw,vh);
      [shades.left,shades.right,shades.bottom,ring].forEach(el=>el.style.display="none");
      bubble.dataset.side="center";
      bubble.style.left="50%";
      bubble.style.top="50%";
      bubble.style.setProperty("--tail-x","50%");
      bubble.style.transform="translate(-50%,-50%)";
      return;
    }

    shades.left.style.display=shades.right.style.display=shades.bottom.style.display=ring.style.display="block";
    bubble.style.transform="";
    const r=currentTarget.getBoundingClientRect();
    const pad=8;
    const x=Math.max(8,r.left-pad),y=Math.max(8,r.top-pad);
    const right=Math.min(vw-8,r.right+pad),bottom=Math.min(vh-8,r.bottom+pad);
    const w=Math.max(12,right-x),h=Math.max(12,bottom-y);

    setBox(shades.top,0,0,vw,y);
    setBox(shades.left,0,y,x,h);
    setBox(shades.right,right,y,vw-right,h);
    setBox(shades.bottom,0,bottom,vw,vh-bottom);
    setBox(ring,x,y,w,h);

    const bw=bubble.offsetWidth,bh=bubble.offsetHeight;
    const gap=14,sidePad=12;
    let side="below",top=bottom+gap;
    if(top+bh>vh-sidePad){side="above";top=y-gap-bh;}
    if(top<sidePad){side="below";top=Math.min(vh-bh-sidePad,bottom+gap);}
    let left=r.left+(r.width-bw)/2;
    left=Math.max(sidePad,Math.min(vw-bw-sidePad,left));
    const tail=Math.max(22,Math.min(bw-22,(r.left+r.width/2)-left));
    bubble.dataset.side=side;
    bubble.style.left=left+"px";
    bubble.style.top=Math.max(sidePad,top)+"px";
    bubble.style.setProperty("--tail-x",tail+"px");
  }

  function prepare(step){
    if(index!==4&&typeof closeHistory==="function"){
      const history=document.getElementById("historyScrim");
      if(history&&!history.classList.contains("hide"))closeHistory();
    }
    if(index!==3&&typeof setQuickOpen==="function")setQuickOpen(false);
    if(Number.isInteger(step.stage)&&typeof go==="function")go(step.stage);
    if(step.before)step.before();
  }

  function show(){
    if(!root)return;
    const step=STEPS[index];
    prepare(step);
    const bubble=root.querySelector(".tour-bubble");
    const p=bubble.querySelector("p");
    const actions=root.querySelector(".tour-actions");
    bubble.classList.toggle("final",Boolean(step.final));
    bubble.querySelector("h3").textContent=step.title;
    p.textContent=step.copy||"";
    p.hidden=!step.copy;
    actions.hidden=Boolean(step.final);
    root.querySelector(".tour-skip").hidden=Boolean(step.final);
    root.querySelector(".tour-next").textContent="Next";

    window.setTimeout(()=>{
      currentTarget=step.final?null:(step.target?step.target():null);
      if(currentTarget){
        currentTarget.scrollIntoView({block:"center",inline:"nearest",behavior:"auto"});
      }
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        position();
        if(!step.final)root.querySelector(".tour-next")?.focus({preventScroll:true});
      }));
    },80);
  }

  function next(){
    if(!root)return;
    if(index>=STEPS.length-1){finish();return;}
    index+=1;
    show();
  }

  function finish(){
    markSeen();
    if(typeof setQuickOpen==="function")setQuickOpen(false);
    const history=document.getElementById("historyScrim");
    if(history&&!history.classList.contains("hide")&&typeof closeHistory==="function")closeHistory();
    root?.remove();root=null;currentTarget=null;
    document.documentElement.classList.remove("tour-active");
    document.body.classList.remove("tour-active");
    if(typeof go==="function")go(0);
  }

  function start(force=false){
    if(root||(!force&&seen()))return;
    index=0;
    document.documentElement.classList.add("tour-active");
    document.body.classList.add("tour-active");
    buildRoot();
    show();
  }

  window.startTutorial=()=>start(true);
  window.addEventListener("resize",()=>{if(root)position();});
  window.addEventListener("keydown",e=>{
    if(!root)return;
    if(["PageDown","PageUp","Home","End","ArrowUp","ArrowDown"].includes(e.key))e.preventDefault();
    if(e.key==="Escape")finish();
  });
  window.setTimeout(()=>start(false),650);
})();
