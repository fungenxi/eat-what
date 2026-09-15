/* Brief launch cover for installed / home-screen mode only. */
(()=>{
  const installed=window.matchMedia?.("(display-mode: standalone)")?.matches||window.navigator.standalone===true;
  const cover=document.getElementById("appCover");
  if(!installed||!cover)return;

  cover.hidden=false;
  requestAnimationFrame(()=>cover.classList.add("show"));
  window.setTimeout(()=>cover.classList.add("leaving"),480);
  window.setTimeout(()=>cover.remove(),700);
})();
