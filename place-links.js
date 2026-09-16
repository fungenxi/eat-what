/* Universal place links + visible verification metadata.
   Loaded after verdict-nav.js so every result — even one without a stored full address —
   can still be opened in Google Maps using a precise name/building search. */
(()=>{
  const esc=typeof escapeHtml==="function"?escapeHtml:(v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])));
  const checkedLabel=value=>{
    if(!value)return "";
    const d=new Date(value+"T00:00:00");
    return Number.isNaN(d.getTime())?value:d.toLocaleDateString("en-SG",{day:"numeric",month:"short",year:"numeric"});
  };

  locationHtml=function(pl){
    const where=[pl.l,pl.w].filter(Boolean).join(" · ");
    const area=typeof placeArea==="function"?placeArea(pl):(pl.area||"");
    const query=pl.mapsQuery||pl.address||[pl.n,pl.l,pl.w,area,"Singapore"].filter(Boolean).join(" ");
    const mapLink='<a class="detail-link" href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query)+'" target="_blank" rel="noopener">Open in Google Maps ↗</a>';

    let trust="";
    if(Number(pl.googleRating)>=0&&Number(pl.googleReviews)>=0){
      const checked=checkedLabel(pl.ratingChecked);
      trust='<span>Google ★ '+esc(Number(pl.googleRating).toFixed(1))+' · '+esc(Number(pl.googleReviews).toLocaleString("en-SG"))+' reviews'+(checked?' · checked '+esc(checked):'')+'</span>';
    }
    if(pl.statusChecked){
      trust+='<span>Outlet status checked '+esc(checkedLabel(pl.statusChecked))+'</span>';
    }

    return '<div class="place-info"><div class="detail-label">Find it</div><b>'+esc(where||pl.n)+'</b>'+
      (pl.address?'<span>'+esc(pl.address)+'</span>':'<span>Full address not recorded yet — Maps will search by restaurant and building.</span>')+
      trust+mapLink+'</div>';
  };
})();
