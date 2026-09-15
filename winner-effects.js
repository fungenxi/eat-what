/* Clean winner reveal: motion instead of decorative doodles. */
winnerDoodleHtml=function(pl){
  return '<div class="winner-reveal">'+
    '<span class="winner-kicker">WINNER</span>'+
    '<div class="winner">'+pl.n+(pl.new?'<span class="new-tag">NEW</span>':'')+'</div>'+
  '</div>';
};
