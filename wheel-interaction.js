/* Wheel interaction: the wheel itself is the spin control. */
gWheel=function(p,token){
  const it=[...S.pool],n=it.length;
  if(n<=1){
    p.innerHTML='<div class="lbl big">Not enough places to spin</div>';
    return;
  }
  const seg=360/n,R=155,C=165,NS="http://www.w3.org/2000/svg";
  const fs=n<=8?11:n<=14?8.8:n<=22?7:n<=30?5.9:5.2;
  const maxc=n<=8?15:n<=14?19:n<=22?23:26;
  const box=document.createElement("div");
  box.className="wheelbox wheel-tap";
  box.tabIndex=0;
  box.setAttribute("role","button");
  box.setAttribute("aria-label","Spin the wheel with "+n+" places");
  box.innerHTML='<div class="needle"></div>';

  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox","0 0 330 330");
  const sh=["#5B2A4E","#0F8A82"];
  it.forEach((pl,i)=>{
    const a0=(i*seg-90)*Math.PI/180,a1=((i+1)*seg-90)*Math.PI/180;
    const pa=document.createElementNS(NS,"path");
    pa.setAttribute("d","M"+C+" "+C+" L"+(C+R*Math.cos(a0))+" "+(C+R*Math.sin(a0))+" A"+R+" "+R+" 0 0 1 "+(C+R*Math.cos(a1))+" "+(C+R*Math.sin(a1))+" Z");
    pa.setAttribute("fill",sh[i%2]);
    if(n>18){pa.setAttribute("stroke","rgba(251,246,236,.18)");pa.setAttribute("stroke-width",".5");}
    svg.appendChild(pa);

    const mid=i*seg+seg/2-90,a=((mid%360)+360)%360,flip=a>90&&a<270;
    const rx=R*.95,tx=C+rx*Math.cos(mid*Math.PI/180),ty=C+rx*Math.sin(mid*Math.PI/180);
    const t=document.createElementNS(NS,"text");
    t.setAttribute("x",tx);t.setAttribute("y",ty);t.setAttribute("fill","#FBF6EC");
    t.setAttribute("font-size",fs);t.setAttribute("dominant-baseline","middle");
    t.setAttribute("text-anchor",flip?"start":"end");t.setAttribute("dx",flip?5:-5);
    t.setAttribute("transform","rotate("+(flip?mid+180:mid)+" "+tx+" "+ty+")");
    t.textContent=pl.n.length>maxc?pl.n.slice(0,maxc-1)+"…":pl.n;
    svg.appendChild(t);
  });

  const hub=document.createElementNS(NS,"circle");
  hub.setAttribute("cx",C);hub.setAttribute("cy",C);hub.setAttribute("r",n>18?20:28);hub.setAttribute("fill","#FFC22E");
  svg.appendChild(hub);
  const hubLabel=document.createElementNS(NS,"text");
  hubLabel.setAttribute("x",C);hubLabel.setAttribute("y",C+1);hubLabel.setAttribute("text-anchor","middle");
  hubLabel.setAttribute("dominant-baseline","middle");hubLabel.setAttribute("fill","#181419");
  hubLabel.setAttribute("font-size",n>18?7:9);hubLabel.setAttribute("font-weight","800");hubLabel.textContent="SPIN";
  svg.appendChild(hubLabel);
  box.appendChild(svg);p.appendChild(box);

  let spinning=false,timer=null;
  if(typeof setGameCleanup==="function")setGameCleanup(token,()=>{if(timer!==null)clearTimeout(timer);});
  const spin=()=>{
    if(spinning||!gameRunActive(token,p))return;
    spinning=true;
    box.classList.add("is-spinning");
    box.setAttribute("aria-disabled","true");
    box.tabIndex=-1;
    const w=Math.floor(Math.random()*n);
    svg.style.transform="rotate("+(360*6-(w*seg+seg/2))+"deg)";
    timer=setTimeout(()=>{if(gameRunActive(token,p))win(it[w],"the wheel");},4600);
  };
  box.addEventListener("click",spin);
  box.addEventListener("keydown",e=>{
    if(e.key!=="Enter"&&e.key!==" ")return;
    e.preventDefault();spin();
  });
};
