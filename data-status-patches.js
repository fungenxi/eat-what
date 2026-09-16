/* Closure/status verification patches — 16 Sep 2026.
   Runs after all curated data batches and before data-cleanup.js.

   Trust rule:
   - curated restaurants must have a recent active-status check to appear live
   - explicit temporary/permanent closures are always removed
   - a recent stall-hours verification can count as the outlet-status check when the
     source itself is a current official/current business listing
   - user-added places are not affected by this curated-data gate
*/
const STATUS_PATCHES=[
  /* CBD closures found during the Sep 16 sweep. Keep the records for maintenance,
     but never surface these physical outlets in recommendations. */
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

  /* Older master records that previously lacked a dated verification field. */
  {
    n:"800 Bowls",l:"Capitol",status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"Current Capitol Singapore directory and 2026 tenant promotion",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Current Capitol Singapore directory",
    h:{mon:[11,20.5],tue:[11,20.5],wed:[11,20.5],thu:[11,20.5],fri:[11,20.5],sat:[11,20.5],sun:[11,20.5]},
    address:"13 Stamford Road, #B1-32A Capitol Singapore, Singapore 178905"
  },
  {
    n:"Punggol Nasi Lemak",l:"Capitol",status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"Current Capitol Singapore directory lists the outlet at #B1-36/36A",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Current Capitol Singapore directory; current listings vary on Sunday hours",
    h:{mon:[11,20],tue:[11,20],wed:[11,20],thu:[11,20],fri:[11,20],sat:[11,20],sun:null},
    address:"13 Stamford Road, #B1-36/36A Capitol Singapore, Singapore 178905"
  },
  {
    n:"Chef Lai Café",l:"Adelphi",status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"Current The Adelphi tenant directory still lists Chef Lai's Cafe at #B1-16",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Current outlet listing; lunch-focused hours retained conservatively",
    address:"1 Coleman Street, #B1-16 The Adelphi, Singapore 179803"
  },
  {
    n:"Hatsumi Donburi & Soba",l:"Raffles Xchange",status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"Official Hatsumi website lists the Raffles Xchange outlet",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Official Hatsumi website",
    h:{mon:[10.5,20],tue:[10.5,20],wed:[10.5,20],thu:[10.5,20],fri:[10.5,20],sat:[10.5,17],sun:null},
    address:"5 Raffles Place, #B1-60/61 Raffles Xchange, Singapore 048618"
  },
  {
    n:"Rempapa",l:"Nat Gallery",status:"active",statusChecked:"2026-09-16",
    statusSourceLabel:"Current National Gallery Singapore dining guide lists Rempapa",
    hoursChecked:"2026-09-16",hoursSourceLabel:"National Gallery Singapore",
    h:{mon:[10,19],tue:[10,19],wed:[10,19],thu:[10,19],fri:[10,19],sat:[10,19],sun:[10,19]},
    address:"1 St Andrew's Road, Supreme Court Wing Level 1, National Gallery Singapore, Singapore 178958"
  },

  /* Chinatown / People's Park spot checks. */
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

  /* City Hall / Suntec batch: official sites or live business profiles re-checked. */
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
  MASTER_PLACES.filter(p=>p.n===patch.n&&p.l===patch.l).forEach(place=>Object.assign(place,patch));
});

/* Most researched records already carry a dated hours verification. When that source
   is a current official/current listing, treat the same check as evidence that the
   physical outlet was active on that date. Never overwrite an explicit closure. */
MASTER_PLACES.forEach(place=>{
  if((!place.status||place.status==="active")&&!place.statusChecked&&place.hoursChecked){
    place.status="active";
    place.statusChecked=place.hoursChecked;
    place.statusSourceLabel=place.statusSourceLabel||place.hoursSourceLabel||"Current outlet/hours verification";
  }
});

/* Fail closed. A curated place is live only when the specific outlet is explicitly
   active AND has a dated status check. This prevents stale expansion files from
   silently leaking closed or never-reverified outlets into filters / rituals / games. */
const unverifiedCurated=[];
for(let i=PLACES.length-1;i>=0;i--){
  const p=PLACES[i];
  if(!p||p.user)continue;
  const verifiedActive=p.status==="active"&&Boolean(p.statusChecked);
  if(!verifiedActive){
    if(!p.statusChecked)unverifiedCurated.push([p.n,p.l].filter(Boolean).join(" — "));
    PLACES.splice(i,1);
  }
}

if(unverifiedCurated.length){
  console.warn("Eat What?! excluded curated places without a dated active-status check:",unverifiedCurated);
}

window.EAT_WHAT_STATUS_PATCHES=STATUS_PATCHES;
window.EAT_WHAT_UNVERIFIED_CURATED=unverifiedCurated;
