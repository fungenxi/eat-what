/* Bugis / Bras Basah hidden-gem expansion — verified 16 Sep 2026.
   Strict inclusion rule for this batch:
   - current physical outlet appears active
   - Google rating >= 4.5
   - at least 100 Google reviews
   - distinctive / tucked-away / independent enough to count as a hidden-gem-style pick
*/
const BUGIS_HIDDEN_GEMS=[
  {
    n:"Diner's Shack",c:"Teochew Fish Soup",p:1,l:"Fortune Centre",area:"Bugis / Bras Basah",col:"white",
    note:"Tucked on Level 2; known for Teochew fish soup with thick batang slices and homely curry chicken. Go before the lunch queue builds.",
    w:"02-31",h:{mon:[11.5,20],tue:[11.5,20],wed:[11.5,20],thu:[11.5,20],fri:[11.5,20],sat:[12.5,20],sun:null},src:"stall",
    address:"190 Middle Road, #02-31 Fortune Centre, Singapore 188979",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Current business listing; Eatbook Fortune Centre feature",
    googleRating:4.5,googleReviews:358,ratingChecked:"2026-09-16",ratingSourceLabel:"Google business profile",
    status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Current business listing and recent 2026 coverage",
    hiddenGem:true,new:true
  },
  {
    n:"Tian Yuan Healthy Vegetarian Food Paradise",c:"Chinese Vegetarian",p:1,l:"Fortune Centre",area:"Bugis / Bras Basah",col:"green",
    note:"Low-key ground-floor vegetarian stall for mixed rice, noodles, tofu and mock-meat dishes; simple, inexpensive and easy to overlook.",
    w:"01-16",h:{mon:[10.5,19.5],tue:[10.5,19.5],wed:[10.5,19.5],thu:[10.5,19.5],fri:[10.5,19.5],sat:[10.5,19.5],sun:null},src:"stall",
    address:"190 Middle Road, #01-16 Fortune Centre, Singapore 188979",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Current Fortune Centre directory; current restaurant listing",
    googleRating:4.7,googleReviews:110,ratingChecked:"2026-09-16",ratingSourceLabel:"Google business profile",
    status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Current Fortune Centre directory and Aug 2026 feature",
    hiddenGem:true,new:true
  },
  {
    n:"Living Wholesome Vegetarian",c:"Lei Cha",p:1,l:"Fortune Centre",area:"Bugis / Bras Basah",col:"green",
    note:"Small plant-based stall specialising in thunder tea rice and bee hoon. The Fortune Centre outlet is a compact weekday lunch stop.",
    w:"01-23",h:{mon:[11,15],tue:[11,15],wed:[11,15],thu:[11,15],fri:[11,15],sat:[11,15],sun:null},src:"stall",
    address:"190 Middle Road, #01-23 Fortune Centre, Singapore 188979",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Official Living Wholesome website",
    hoursUrl:"https://livingwholesome.sg/",
    googleRating:4.7,googleReviews:105,ratingChecked:"2026-09-16",ratingSourceLabel:"Google business profile",
    status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official website lists active Fortune Centre outlet",
    hiddenGem:true,new:true
  },
  {
    n:"Entre-Nous Creperie",c:"Breton Crepes",p:2,l:"Seah Street",area:"Bugis / Bras Basah",col:"white",
    note:"Tiny family-run Breton creperie near City Hall, open since 2008. Savoury buckwheat galettes are the lunch move; seating is limited.",
    w:"01-01",h:{mon:null,tue:[[12,14.5],[18,21.5]],wed:[[12,14.5],[18,21.5]],thu:[[12,14.5],[18,21.5]],fri:[[12,14.5],[18,21.5]],sat:[[11,15],[18,21.5]],sun:[11,16.5]},src:"stall",
    address:"27 Seah Street, #01-01, Singapore 188383",
    hoursChecked:"2026-09-16",hoursSourceLabel:"Official Entre-Nous website",
    hoursUrl:"https://entrenous.sg/",
    googleRating:4.6,googleReviews:1249,ratingChecked:"2026-09-16",ratingSourceLabel:"Google Maps",
    status:"active",statusChecked:"2026-09-16",statusSourceLabel:"Official reservation site and current Google listing",
    hiddenGem:true,new:true
  }
];

const VERIFIED_BUGIS_HIDDEN_GEMS=BUGIS_HIDDEN_GEMS.filter(p=>
  p.status==="active" && p.hiddenGem===true && Number(p.googleRating)>=4.5 && Number(p.googleReviews)>=100
);
if(VERIFIED_BUGIS_HIDDEN_GEMS.length!==BUGIS_HIDDEN_GEMS.length){
  console.warn("Some Bugis hidden-gem records failed the active / 4.5 / 100-review inclusion rule.");
}

MASTER_PLACES.push(...VERIFIED_BUGIS_HIDDEN_GEMS);
PLACES.push(...VERIFIED_BUGIS_HIDDEN_GEMS);
