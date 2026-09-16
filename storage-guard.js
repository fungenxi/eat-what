/* Keep malformed browser-local data from breaking app startup. */
(()=>{
  const arrayKeys=[
    "eatwhat.personalPlaces.v1",
    "eatwhat.history.v1",
    "eatwhat.deletedPlaces.v1"
  ];
  arrayKeys.forEach(key=>{
    try{
      const raw=localStorage.getItem(key);
      if(raw===null)return;
      const parsed=JSON.parse(raw);
      if(!Array.isArray(parsed))localStorage.removeItem(key);
    }catch(_){
      try{localStorage.removeItem(key);}catch(__){}
    }
  });
})();
