/* Section-title microinteractions: tap a header to switch between its two effects. */
(()=>{
  const configs=[
    {selector:".title-narrow",label:"Narrow it down",a:"hand-drawn underline",b:"slide-in highlight"},
    {selector:".title-room",label:"Ask the room",a:"sparkle pop",b:"chat bubble bounce"},
    {selector:".title-fate",label:"Let fate decide",a:"orbiting star",b:"soft pulse"}
  ];

  function replay(title){
    title.classList.remove("title-pop");
    void title.offsetWidth;
    title.classList.add("title-pop");
  }

  configs.forEach(config=>{
    const title=document.querySelector(config.selector);
    if(!title)return;

    title.dataset.effect="a";
    title.tabIndex=0;
    title.setAttribute("role","button");
    title.setAttribute("title","Tap to switch animation");

    const updateLabel=()=>{
      const effect=title.dataset.effect==="b"?config.b:config.a;
      title.setAttribute("aria-label",config.label+". "+effect+" animation. Tap to switch.");
    };
    const cycle=()=>{
      title.dataset.effect=title.dataset.effect==="a"?"b":"a";
      updateLabel();
      replay(title);
    };

    updateLabel();
    title.addEventListener("click",cycle);
    title.addEventListener("keydown",e=>{
      if(e.key!=="Enter"&&e.key!==" ")return;
      e.preventDefault();
      cycle();
    });
  });
})();
