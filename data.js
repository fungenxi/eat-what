/* ============ THE LIST ============ */
const MASTER_PLACES=[
 {n:"Sing Swee Kee",c:"Hainanese",p:1,l:"Funan",col:"white",note:"",w:"Inside Raffles Coffee & Toast",h:{mf:[10,22]},src:"mall"},
 {n:"Hai Kah Lang",c:"Teochew",p:1,l:"Funan",col:"white",note:"Fish soup",h:{mf:[10,22]},src:"mall"},
 {n:"Qi Ji",c:"Nonya",p:1,l:"Funan",col:"brown",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"Sukiya",c:"Japanese",p:1,l:"Funan",col:"brown",note:"Gyudon",h:{mf:[10,22]},src:"mall"},
 {n:"Dapur Penyet",c:"Indonesian",p:1,l:"Funan",col:"red",note:"Halal certified",w:"B2-18",halal:true,h:{mf:[11,21]},src:"stall"},
 {n:"Miss Tang's Rice Noodle",c:"Yunnan",p:1,l:"Funan",col:"red",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"Yuan Kee Dumpling",c:"Chinese",p:1,l:"Funan",col:"white",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"Xi Men Jie",c:"Taiwanese",p:1,l:"Funan",col:"brown",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"Khao",c:"Thai",p:2,l:"Funan",col:"green",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"The Tree Cafe",c:"Cafe",p:2,l:"Funan",col:"green",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"Mincheng",c:"Korean",p:1,l:"Funan",col:"red",note:"Bibimbap",h:{mf:[10,22]},src:"mall"},
 {n:"Big Appetite",c:"Food court",p:1,l:"Funan",col:"brown",note:"",w:"Basement 2",h:{mf:[8,22]},src:"stall"},
 {n:"Kuan Zhai Alley",c:"Sichuan",p:1,l:"Funan",col:"red",note:"Grab a tray, pick mini bowls, $1.90 to $5.90 each",w:"By the waterfall",h:{mf:[10,22]},src:"mall"},
 {n:"109 Yong Tau Fu",c:"Chinese",p:1,l:"Funan",col:"white",note:"",w:"In Lao Di Fang food court",h:{mf:[10,22]},src:"mall"},
 {n:"800 Bowls",c:"Chinese",p:1,l:"Capitol",col:"brown",note:"Hand-pulled la mian",w:"B1-32A",h:{mf:[11,20.5],sat:[11,20.5],sun:[11,17.5]},src:"stall"},
 {n:"Punggol Nasi Lemak",c:"Malay",p:1,l:"Capitol",col:"brown",note:"",h:{mf:[11,21]},src:"stall",w:"B1-36"},
 {n:"Ramen Keisuke",c:"Japanese",p:2,l:"Capitol",col:"brown",note:"",h:{mf:[[11.5,15],[17.5,21.5]],sat:[11.5,21.5],sun:[11.5,21.5]},src:"stall",w:"B1-35"},
 {n:"Holy Crab",c:"Seafood",p:3,l:"Capitol",col:"red",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"Chef Lai Café",c:"Hainanese",p:1,l:"Adelphi",col:"white",note:"Often sold out by 3pm",w:"B1-16",h:{mf:[11,15],sat:null,sun:null},src:"stall"},
 {n:"Makanan Bollywood",c:"Indian Muslim",p:1,l:"Adelphi",col:"brown",note:"Sup kambing and biryani",w:"B1-51",halal:true},
 {n:"Tian Xin Wanton Noodle",c:"Chinese",p:1,l:"Adelphi",col:"brown",note:"",w:"02-07",early:true},
 {n:"Tony Café",c:"Cai fan",p:1,l:"Adelphi",col:"brown",note:"",w:"02-23",sp:{d:[1,3],t:"Fried chicken wings today"}},
 {n:"Hyang To Gol",c:"Korean",p:3,l:"Raffles City",col:"red",note:"",h:{mf:[10,22]},src:"mall"},
 {n:"Din Tai Fung",c:"Taiwanese",p:2,l:"Raffles City",col:"white",note:"",w:"B1-08",h:{mf:[10,22]},src:"mall"},
 {n:"Hatsumi Donburi & Soba",c:"Japanese",p:1,l:"Raffles Xchange",col:"brown",note:"Halal certified. Donburi from $5.90",w:"B1-60/61",halal:true,h:{mf:[10.5,20],sat:[10.5,17],sun:null},src:"stall"},
 {n:"Astons",c:"Western",p:2,l:"Clarke Quay",col:"brown",note:"",h:{mf:[11,23]},src:"mall"},
 {n:"Tsui Wah",c:"Hong Kong",p:2,l:"Clarke Quay",col:"brown",note:"",h:{mf:[11,23]},src:"mall"},
 {n:"Marutama Ra-men",c:"Japanese",p:2,l:"Clarke Quay",col:"white",note:"",h:{mf:[11,23]},src:"mall"},
 {n:"Chagee",c:"Drinks",p:1,l:"Clarke Quay",col:"white",note:"",h:{mf:[11,23]},src:"mall"},
 {n:"Baba Nonya",c:"Peranakan",p:2,l:"Clarke Quay",col:"red",note:"",h:{mf:[11,23]},src:"mall"},
 {n:"Clarke Quay Food Court",c:"Food court",p:1,l:"Clarke Quay",col:"brown",note:"",h:{mf:[11,23]},src:"mall"},
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

