/*
  Non-destructive normalization layer for MASTER_PLACES.
  Keeps the app's existing short fields working while adding cleaner, explicit
  fields for future features and data maintenance.
*/

const UNIT_PATTERN=/^(?:B?\d+[A-Z]?-\d+[A-Z]?(?:\/\d+[A-Z]?)?|\d{2}-\d+[A-Z]?)$/i;
const ALLOWED_HALAL=new Set(["certified","not-certified","unknown"]);
const ALLOWED_HOURS_SOURCE=new Set(["stall","building","unknown"]);
const ALLOWED_STATUS=new Set(["active","temporarily-closed","permanently-closed"]);

function dataSlug(value){
  return String(value||"")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
}

function typeFromCurrentCuisine(cuisine){
  if(cuisine==="Food court")return "Food court";
  if(cuisine==="Drinks")return "Drinks";
  if(cuisine==="Cafe")return "Cafe";
  return "Eatery";
}

function enrichMasterPlace(place){
  const rawLocation=place.w||"";
  const hasUnit=UNIT_PATTERN.test(rawLocation);
  const sourceLevel=place.src==="stall"?"stall":place.src==="mall"?"building":"unknown";

  /* Stable-enough identifier for now; replace with an explicit id if a name/building changes. */
  place.id=place.id||dataSlug(place.n+" "+place.l);

  /* Canonical/readable aliases for future code. Existing short fields stay untouched. */
  place.name=place.n;
  place.cuisine=place.c;
  place.type=typeFromCurrentCuisine(place.c);
  place.priceTier=place.p;
  place.area=place.area||"Civic District";
  place.building=place.l;
  place.unit=hasUnit?rawLocation:null;
  place.locationHint=rawLocation&&!hasUnit?rawLocation:null;
  place.address=place.address||null;
  place.colour=place.col;
  place.halalStatus=place.halal===true?"certified":"unknown";
  place.hours=place.h||null;
  place.hoursSource={
    level:sourceLevel,
    checked:place.hoursChecked||null,
    url:place.hoursUrl||null,
    label:place.hoursSourceLabel||null
  };
  place.hiddenGem=place.hiddenGem===true;
  place.newTag=place.new===true;
  place.status=place.status||"active";
  return place;
}

MASTER_PLACES.forEach(enrichMasterPlace);

function auditMasterPlaces(records){
  const issues=[];
  const ids=new Set();
  const nameBuildingPairs=new Set();

  records.forEach((place,index)=>{
    const label=place.name||place.n||("row "+(index+1));
    const required=["id","name","cuisine","type","priceTier","area","building","colour","halalStatus","hoursSource","status"];

    required.forEach(key=>{
      if(place[key]===undefined||place[key]===null||place[key]==="")
        issues.push(label+": missing "+key);
    });

    if(ids.has(place.id))issues.push(label+": duplicate id "+place.id);
    ids.add(place.id);

    const pair=(place.name+"|"+place.building).toLowerCase();
    if(nameBuildingPairs.has(pair))issues.push(label+": duplicate name + building");
    nameBuildingPairs.add(pair);

    if(![1,2,3].includes(place.priceTier))
      issues.push(label+": price tier must be 1, 2 or 3");

    if(!ALLOWED_HALAL.has(place.halalStatus))
      issues.push(label+": invalid halal status");

    if(!ALLOWED_HOURS_SOURCE.has(place.hoursSource?.level))
      issues.push(label+": invalid hours source");

    if(!ALLOWED_STATUS.has(place.status))
      issues.push(label+": invalid status");
  });

  const counts={
    total:records.length,
    active:records.filter(p=>p.status==="active").length,
    temporarilyClosed:records.filter(p=>p.status==="temporarily-closed").length,
    permanentlyClosed:records.filter(p=>p.status==="permanently-closed").length,
    stallHours:records.filter(p=>p.hoursSource?.level==="stall").length,
    buildingHours:records.filter(p=>p.hoursSource?.level==="building").length,
    unknownHours:records.filter(p=>p.hoursSource?.level==="unknown").length,
    recentlyCheckedHours:records.filter(p=>p.hoursSource?.checked).length,
    halalCertified:records.filter(p=>p.halalStatus==="certified").length,
    halalUnknown:records.filter(p=>p.halalStatus==="unknown").length,
    hiddenGems:records.filter(p=>p.hiddenGem&&p.status==="active").length,
    newTagged:records.filter(p=>p.newTag&&p.status==="active").length,
    withUnit:records.filter(p=>p.unit).length,
    withAddress:records.filter(p=>p.address).length,
    withLocationHint:records.filter(p=>p.locationHint).length
  };

  return {counts,issues};
}

const DATA_AUDIT=auditMasterPlaces(MASTER_PLACES);
window.EAT_WHAT_DATA_AUDIT=DATA_AUDIT;

if(DATA_AUDIT.issues.length){
  console.warn("Eat What?! master data issues:",DATA_AUDIT.issues);
}
