/* Closure/status verification patches — 16 Sep 2026.
   This file runs after all curated data batches and before data-cleanup.js.
   Keep branch/location-specific closures here so stale source files cannot leak a closed
   outlet into filters, rituals or games.
*/
const STATUS_PATCHES=[
  {
    n:"Big Bowls Project",l:"Amoy Street Food Centre",
    status:"permanently-closed",statusChecked:"2026-09-16",
    statusSourceLabel:"Amoy physical stall has closed; Aug 2026 reporting says the brand continues via delivery under new management"
  },
  {
    n:"A Noodle Story",l:"Amoy Street Food Centre",
    status:"temporarily-closed",statusChecked:"2026-09-16",
    statusSourceLabel:"Current official ordering page marks the Amoy outlet closed for renovations; Guoco Tower remains a separate active outlet"
  },
  {
    n:"Popo and Nana's Delights",l:"Maxwell Food Centre",
    status:"permanently-closed",statusChecked:"2026-09-16",
    statusSourceLabel:"Current restaurant listing marks the Maxwell outlet closed"
  },
  {
    n:"Ann Chin Popiah",l:"Chinatown Complex",
    status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"Official Ann Chin outlet page currently lists Chinatown Complex #02-112 with operating hours"
  },
  {
    n:"Kazan Cuisine",l:"Chinatown Complex",
    status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"Current May 2026 coverage confirms the former Kazan Japanese stall rebranded and continues at #02-001"
  },
  {
    n:"Lek Kee Authentic Teochew Braised Duck",l:"People's Park Food Centre",
    status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"MICHELIN Guide Singapore 2026 and current 2026 stall coverage"
  },

  /* City Hall / Suntec batch: current official sites or live business profiles were
     re-checked on 16 Sep 2026. */
  {n:"Tonshou",l:"Suntec City",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Current business profile with live Suntec hours"},
  {n:"LONGJING Restaurant",l:"Suntec City",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Current Suntec business profile with live hours"},
  {n:"Synthesis 食拿酒稳",l:"Suntec City",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official restaurant site lists current Suntec address, reservations and hours"},
  {n:"Xiang Xiang Hunan Cuisine",l:"Suntec City",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Current business profile with live Suntec hours"},
  {n:"Black Pepper Multicuisine Restaurant",l:"Suntec City",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official restaurant site lists current Suntec address and daily hours"},
  {n:"The Soup Expert",l:"Suntec City",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Current Suntec business profile with live hours"},
  {n:"Kiwami: Ramen & Gyoza Bar",l:"Suntec City",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official Kiwami site lists Suntec #02-458 and current daily hours"},
  {n:"Donergy Turkish Kebab",l:"Millenia Walk",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official Donergy site lists active Millenia Walk outlet, menu and hours"},
  {n:"The Black Pearl",l:"Odeon 333",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official restaurant site lists current Odeon 333 address and operating hours"},
  {n:"Flutes",l:"Guoco Midtown House",status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official restaurant site lists current Midtown House address and operating hours"}
];

STATUS_PATCHES.forEach(patch=>{
  const matches=MASTER_PLACES.filter(p=>p.n===patch.n&&p.l===patch.l);
  matches.forEach(place=>Object.assign(place,patch));
});

/* Expansion files historically pushed directly into PLACES. Enforce the same status
   rule here as data.js uses for the original master list, so a known temporary or
   permanent closure can never remain selectable just because it came from an add-on file. */
for(let i=PLACES.length-1;i>=0;i--){
  const p=PLACES[i];
  if(p&&!p.user&&p.status&&p.status!=="active")PLACES.splice(i,1);
}

window.EAT_WHAT_STATUS_PATCHES=STATUS_PATCHES;
