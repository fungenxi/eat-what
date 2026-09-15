/* ============ THE LIST ============ */
const MASTER_PLACES=[
 {n:"Sing Swee Kee",c:"Hainanese",p:1,l:"Funan",col:"white",note:"Inside Raffles Coffee & Toast",w:"B2-11",h:{mf:[8.5,20.5],sat:[8.5,20.5],sun:[8.5,20.5]},src:"stall",address:"107 North Bridge Road, #B2-11 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Current business listing"},
 {n:"Hai Kah Lang",c:"Teochew",p:1,l:"Funan",col:"white",note:"Fish soup",w:"01-15",h:{mf:[11,21.5],sat:[11,21.5],sun:[11,21.5]},src:"stall",address:"107 North Bridge Road, #01-15 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.haikahlang.com/contact-us/"},
 {n:"Qi Ji",c:"Nonya",p:1,l:"Funan",col:"brown",note:"",w:"B2-12",halal:true,h:{mf:[8.5,21.5],sat:[8.5,21.5],sun:[8.5,21.5]},src:"stall",address:"107 North Bridge Road, #B2-12 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.qiji.com.sg/locate_us"},
 {n:"Sukiya",c:"Japanese",p:1,l:"Funan",col:"brown",note:"Gyudon",w:"B1-32",h:{mf:[10,22.5],sat:[10,22.5],sun:[10,22.5]},src:"stall",address:"107 North Bridge Road, #B1-32 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.sukiya.com.sg/location"},
 {n:"Dapur Penyet",c:"Indonesian",p:1,l:"Funan",col:"red",note:"Halal certified",w:"B2-18",halal:true,h:{mf:[11,21],sat:[11,21],sun:[11,21]},src:"stall",address:"107 North Bridge Road, #B2-18 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.dapurpenyet.com.sg/menu-locations"},
 {n:"Miss Tang's Rice Noodle",c:"Yunnan",p:1,l:"Funan",col:"red",note:"",w:"02-37/38",h:{mf:[10.5,21.25],sat:[10.5,21.25],sun:[10.5,21.25]},src:"stall",address:"107 North Bridge Road, #02-37/38 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Current business listing"},
 {n:"Yuen Kee Dumpling",altName:"袁记云饺",c:"Chinese",p:1,l:"Funan",col:"white",note:"",w:"02-03",h:{mf:[10,21],sat:[10,21],sun:[10,21]},src:"stall",address:"107 North Bridge Road, #02-03 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"User-provided business listing"},
 {n:"Xi Men Jie",c:"Taiwanese",p:1,l:"Funan",col:"brown",note:"",w:"B2-13",h:{mf:[11,21.5],sat:[11,21.5],sun:[11,21.5]},src:"stall",address:"107 North Bridge Road, #B2-13 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://ximenjie.sg/pages/locations-opening-hours"},
 {n:"Khao",c:"Thai",p:2,l:"Funan",col:"green",note:"",w:"01-14",h:{mf:[11,22],sat:[11,22],sun:[11,22]},src:"stall",address:"107 North Bridge Road, #01-14 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Current business listing"},
 {n:"The Tree Cafe",c:"Cafe",p:2,l:"Funan",col:"green",note:"Halal certified",w:"02-33",halal:true,h:{mf:[11.5,21.5],sat:[11.5,21.5],sun:[11.5,21.5]},src:"stall",address:"107 North Bridge Road, #02-33 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.thetreecafesg.com/location-funan"},
 {n:"Mincheng Bibimbap",c:"Korean",p:1,l:"Funan",col:"red",note:"Bibimbap",w:"01-13",h:{mf:[11,21.5],sat:[11,21.5],sun:[11,21.5]},src:"stall",address:"107 North Bridge Road, #01-13 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.minchengbibimbap.com/our-branches/funan-outlet"},
 {n:"Big Appetite",c:"Food court",p:1,l:"Funan",col:"brown",note:"Food court; individual stall hours may vary",w:"B2-24",h:{mf:[8,22],sat:[8,22],sun:[8,22]},src:"stall",address:"107 North Bridge Road, #B2-24 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"CapitaLand directory",hoursUrl:"https://www.capitaland.com/sg/malls/funan/en/stores/big-appetite.html"},
 {n:"Kuan Zhai",c:"Sichuan",p:1,l:"Funan",col:"red",note:"Mini-bowl concept by the waterfall",w:"B2-22",h:{mf:[[11,14],[17,20.5]],sat:[[11,14],[17,20.5]],sun:[[11,14],[17,20.5]]},src:"stall",address:"107 North Bridge Road, #B2-22 Funan, Singapore 179105",hoursChecked:"2026-09-15",hoursSourceLabel:"Current delivery listing"},
 {n:"800 Bowls",c:"Chinese",p:1,l:"Capitol",col:"brown",note:"Hand-pulled la mian",w:"B1-32A",h:{mf:[11,20.5],sat:[11,20.5],sun:[11,17.5]},src:"stall"},
 {n:"Punggol Nasi Lemak",c:"Malay",p:1,l:"Capitol",col:"brown",note:"",w:"B1-36",h:{mf:[11,21]},src:"stall"},
 {n:"Ramen Keisuke",c:"Japanese",p:2,l:"Capitol",col:"brown",note:"",w:"B1-35",h:{mf:[[11.5,15],[17.5,21.5]],sat:[11.5,21.5],sun:[11.5,21.5]},src:"stall"},
 {n:"HolyCrab",c:"Seafood",p:3,l:"Capitol",col:"red",note:"Lunch and dinner service",w:"01-85",h:{mf:[[11.5,14.5],[17.5,22.5]],sat:[[11.5,14.5],[17.5,22.5]],sun:[[11.5,14.5],[17.5,22.5]]},src:"stall",address:"13 Stamford Road, #01-85 Arcade @ The Capitol Kempinski Hotel Singapore, Singapore 178905",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.holycrab.sg/"},
 {n:"Chef Lai Café",c:"Hainanese",p:1,l:"Adelphi",col:"white",note:"Often sold out by 3pm",w:"B1-16",h:{mf:[11,15],sat:null,sun:null},src:"stall"},
 {n:"Makanan Bollywood",c:"Indian Muslim",p:1,l:"Adelphi",col:"brown",note:"Sup kambing and biryani",w:"B1-51",halal:true,h:{mf:[8,20],sat:[8,20],sun:[8,20]},src:"stall",address:"1 Coleman St, B1-51 The Adelphi Mall, Singapore 179803",hoursChecked:"2026-09-15",hoursSourceLabel:"Google listing"},
 {n:"Tian Xin Wanton Noodle",c:"Chinese",p:1,l:"Adelphi",col:"brown",note:"",w:"02-07",early:true,h:{mf:[8,15],sat:[8,15],sun:null},src:"stall",address:"1 Coleman St, #02-07 The Adelphi, Singapore 179803",hoursChecked:"2026-09-15",hoursSourceLabel:"Google listing"},
 {n:"Tony Café",c:"Cai fan",p:1,l:"Adelphi",col:"brown",note:"",w:"02-23",sp:{d:[1,3],t:"Fried chicken wings today"},h:{mf:[8.5,15.25],fri:[8.5,15],sat:[9,15.25],sun:null},src:"stall",address:"1 Coleman St, #02-23 The Adelphi, Singapore 179803",hoursChecked:"2026-09-15",hoursSourceLabel:"Google listing"},
 {n:"Hyang To Gol",c:"Korean",p:3,l:"Raffles City",col:"red",note:"",w:"B1-74",h:{mf:[11.5,21],sat:[11.5,21],sun:[11.5,21]},src:"stall",address:"252 North Bridge Road, #B1-74 Raffles City Shopping Centre, Singapore 179103",hoursChecked:"2026-09-15",hoursSourceLabel:"Current restaurant listing"},
 {n:"Din Tai Fung",c:"Taiwanese",p:2,l:"Raffles City",col:"white",note:"",w:"B1-08",h:{mf:[11,21],fri:[11,21.25],sat:[11,21.25],sun:[11,21]},src:"stall",address:"252 North Bridge Road, #B1-08 Raffles City Shopping Centre, Singapore 179103",hoursChecked:"2026-09-15",hoursSourceLabel:"Current mall/business listing"},
 {n:"Hatsumi Donburi & Soba",c:"Japanese",p:1,l:"Raffles Xchange",col:"brown",note:"Halal certified. Donburi from $5.90",w:"B1-60/61",halal:true,h:{mf:[10.5,20],sat:[10.5,17],sun:null},src:"stall"},
 {n:"ASTONS Specialities",c:"Western",p:2,l:"Clarke Quay Central",col:"brown",note:"",w:"03-85",h:{mf:[11.5,22],sat:[11.5,22],sun:[11.5,22]},src:"stall",address:"6 Eu Tong Sen Street, #03-85 The Central, Singapore 059817",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://astonsspecialities.com.sg/"},
 {n:"Tsui Wah",c:"Hong Kong",p:2,l:"Clarke Quay Central",col:"brown",note:"",w:"01-08",h:{mf:[8,22],fri:[8,24],sat:[8,24],sun:[8,22]},src:"stall",address:"6 Eu Tong Sen Street, #01-08 Clarke Quay Central, Singapore 059817",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://www.tsuiwah.com/index.php/en/shoplocation-en/tsuiwah-clark-en"},
 {n:"Marutama Ra-men",c:"Japanese",p:2,l:"Clarke Quay Central",col:"white",note:"",w:"03-90/91",h:{mf:[11.5,21],fri:[11.5,21.5],sat:[11.5,21.5],sun:[11.5,21]},src:"stall",address:"6 Eu Tong Sen Street, #03-90/91 The Central, Singapore 059817",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://marutama.com.sg/locations/"},
 {n:"CHAGEE",c:"Drinks",p:1,l:"Clarke Quay Central",col:"white",note:"",w:"01-53/54/61/62/63",h:{mf:[10,22],fri:[10,22.5],sat:[10,22.5],sun:[10,22]},src:"stall",address:"6 Eu Tong Sen Street, #01-53/54/61/62/63 Clarke Quay Central, Singapore 059817",hoursChecked:"2026-09-15",hoursSourceLabel:"Current business listing"},
 {n:"Baba Nyonya",c:"Peranakan",p:2,l:"Clarke Quay Central",col:"red",note:"No pork, no lard",w:"02-84/86",h:{mf:[11.5,22],sat:[11.5,22],sun:[11.5,22]},src:"stall",address:"6 Eu Tong Sen Street, #02-84/86 Clarke Quay Central, Singapore 059817",hoursChecked:"2026-09-15",hoursSourceLabel:"Official website",hoursUrl:"https://nyonyababa749.wixsite.com/babanyonya"},
 {n:"Sinfoodie",c:"Food court",p:1,l:"Clarke Quay Central",col:"brown",note:"Food court; individual stall hours may vary",w:"B1-31 to 39",h:{mf:[7,22.5],sat:[7,22.5],sun:[7,22.5]},src:"stall",address:"6 Eu Tong Sen Street, #B1-31/32/33/34/35/36/37/38/39, Singapore 059817",hoursChecked:"2026-09-15",hoursSourceLabel:"Current venue coverage",hoursUrl:"https://www.sinfoodie.com.sg/outlets/174.html"},
 {n:"Rempapa",c:"Heritage",p:2,l:"Nat Gallery",col:"brown",note:"Self-service. Nasi lemak sets from $9.90",w:"01-02A",h:{mf:[10,19],sat:[10,19],sun:[10,19]},src:"stall"}
];

/* ============ PERSONAL DATA (THIS BROWSER ONLY) ============ */
/*
  The shared/master list above is maintained by the site owner.
  Places added with the + button and recent history are stored only in this
  browser using localStorage. They are not uploaded anywhere.
*/
const STORAGE={
  places:"eatwhat.personalPlaces.v1",
  log:"eatwhat.history.v1"
};

function readLocal(key,fallback){
  try{
    const raw=localStorage.getItem(key);
    return raw===null?fallback:JSON.parse(raw);
  }catch(e){
    console.warn("Could not read local data:",key,e);
    return fallback;
  }
}
function writeLocal(key,value){
  try{
    localStorage.setItem(key,JSON.stringify(value));
    return true;
  }catch(e){
    console.warn("Could not save local data:",key,e);
    return false;
  }
}
function validPersonalPlace(p){
  return p && typeof p.n==="string" && p.n.trim() &&
    typeof p.c==="string" && typeof p.l==="string" &&
    [1,2,3].includes(Number(p.p));
}
let PERSONAL_PLACES=readLocal(STORAGE.places,[]).filter(validPersonalPlace);

/* Runtime list = curated shared places + this user's own saved places. */
const PLACES=[...MASTER_PLACES,...PERSONAL_PLACES];

function savePersonalPlaces(){
  writeLocal(STORAGE.places,PERSONAL_PLACES);
}
function saveHistory(){
  writeLocal(STORAGE.log,S.log.slice(0,20));
}
