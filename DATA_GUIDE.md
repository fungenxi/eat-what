# Eat What?! data guide

This file is the maintenance guide for the shared restaurant list in `data.js`.

## Current dataset

There are currently **44 master records**, of which **43 are active recommendations**.

Status after the 15 Sep 2026 verification pass:

- **43 active**
- **1 temporarily closed** — The Masses, Capitol Singapore
- **0 permanently closed records shown to users**
- all 43 active recommendations have venue/stall-specific opening hours
- **38** master records carry a verification date and source label

The app excludes any master record whose `status` is not `active`, so a temporarily or permanently closed place can stay in the maintenance data without appearing in filters, rituals or games.

Halal data:

- **6** are explicitly marked halal-certified
- all other records are treated as **unknown**, not automatically as "not halal"

The stale **109 Yong Tau Fu @ Funan** record was removed. Current sources place 109 Yong Tau Foo at Circular Road, not inside Funan.

## Canonical fields

`data-cleanup.js` adds readable canonical fields to every shared place without breaking the existing UI or short field names.

| Field | Meaning |
| --- | --- |
| `id` | Unique identifier for one branch/location |
| `name` | Display name |
| `cuisine` | Main cuisine/category currently used by the Cuisine filter |
| `type` | `Eatery`, `Cafe`, `Food court`, or `Drinks` for now |
| `priceTier` | `1`, `2`, or `3` |
| `area` | Broad lunch zone, e.g. `Civic District`, `Mapletree Business City`, `Punggol Digital District`, `Jurong West` |
| `building` | Building / mall / street used by the Building filter |
| `unit` | Actual unit number only |
| `locationHint` | Human directions when needed |
| `address` | Full address when verified |
| `colour` | Broad food-colour family used by Colour census |
| `halalStatus` | `certified`, `not-certified`, or `unknown` |
| `hours` | Opening-hours object |
| `hoursSource.level` | `stall`, `building`, or `unknown` |
| `hoursSource.checked` | Date hours were last checked |
| `hoursSource.url` | Source URL where one is available |
| `hoursSource.label` | Human-readable source description |
| `hiddenGem` | Editorial flag for genuinely under-the-radar recommendations |
| `newTag` | Derived from `new:true`; controls the tiny `NEW` badge |
| `status` | `active`, `temporarily-closed`, or `permanently-closed` |

The existing short fields (`n`, `c`, `p`, `l`, `w`, `col`, `h`, `src`) remain because the current UI uses them.

## Closure-status rule

A place should not be recommended merely because an old directory page still exists.

Before adding a researched recommendation, check a current business listing and, where practical, a recent official mall/site/directory or recent local coverage.

Use:

- `status:"active"` or omit `status` when currently operating
- `status:"temporarily-closed"` when a current listing explicitly reports a temporary closure
- `status:"permanently-closed"` only when there is strong current evidence of permanent closure

Do not delete a temporarily closed record if reopening is plausible. Keeping it in the master data makes it easy to re-check and restore later while the runtime `PLACES` list excludes it automatically.

### Closure audit of the Sep 2026 additions

Current checks found these operating:

- King Umar Teh Tarik Cafe
- Supreme Pork Chop Rice
- Flavours by Sauté
- Godmama
- Nalan

**The Masses** is currently marked **temporarily closed** in its current business listing. It remains in `MASTER_PLACES` but is excluded from the live recommendation pool.

The closure check also corrected current listing hours for:

- King Umar Teh Tarik Cafe — Mon–Sat 6:30am–8pm; Sun 8am–5pm
- Supreme Pork Chop Rice — Mon–Sat 9:30am–7:45pm; Sun closed

## Opening-hours rule

This directly affects the `Open now` filter, so accuracy matters more than completeness.

- `stall` = hours belong to the actual restaurant / venue
- `building` = only building hours are known
- `unknown` = hours have not been verified

The `Open now` filter includes **only places confirmed open at that moment**. Unknown-hours places are excluded instead of being treated as possibly open.

The hours engine supports:

- regular weekday hours using `mf`
- `sat` and `sun`
- exact-day overrides such as `fri`
- split service windows such as lunch + dinner
- `null` for a day when the venue is closed

Example:

```js
h:{
  mf:[8.5,15.25],
  fri:[8.5,15],
  sat:[9,15.25],
  sun:null
}
```

## Location cleanup completed

The September 2026 pass separated proper unit numbers from vague location descriptions and corrected several current unit numbers.

The Clarke Quay entries in the dataset use **Clarke Quay Central** where they are actually located at The Central mall, rather than the broader Clarke Quay precinct.

Generic `Clarke Quay Food Court` was replaced with the current **Sinfoodie** food court.

`Yuan Kee Dumpling` was corrected to **Yuen Kee Dumpling** and the Funan unit was set to `02-03`.

The Yuen Kee Dumpling Funan record has daily opening hours of **10am–9pm**, based on the user-provided business listing. The Chinese name `袁记云饺` is retained as an alternate name in the data.

Some researched places are standalone buildings or streets rather than malls, such as Bulkhaul House, Chye Sing Building, Beach Road and Purvis Street. Point the Way uses a neutral point icon for locations that do not yet have a deliberately configured physical direction; the app should not invent an arrow direction.

## Area-first filtering

The app now has a real **Area** filter before Building. It is intentionally hidden while only one area exists, so the current Civic District experience does not gain a useless one-option control.

As soon as records from a second area are added, the Area panel appears automatically. Area selection is single-choice because one lunch decision should stay geographically coherent.

Selecting a new area:

- scopes the Building choices to that area
- scopes Cuisine choices to that area
- scopes `Open now` / today's warnings to that area
- scopes rituals and games to that area through the main pool
- clears any stale Building selection from the previous area

Personal places added with the `+` button now also store an `area`. Older personal places without an area fall back to `Civic District` for backwards compatibility.

This means future data can be added safely as:

```js
area:"Civic District"
area:"Mapletree Business City"
area:"Punggol Digital District"
area:"Jurong West"
```

without Point the Way mixing City Hall, Punggol and Jurong buildings together.

## Colour census

The room/outfit colours are deliberately broader than the food-colour data.

Current outfit choices:

- White
- Black
- Grey
- Navy
- Blue
- Beige
- Brown
- Red
- Pink
- Orange
- Yellow
- Green
- Purple

Restaurants keep a simpler food-colour family such as `white`, `brown`, `red`, or `green`. Common clothing colours map to nearby food-colour families so the ritual stays fun instead of returning zero matches most of the time.

This mapping is intentionally playful rather than a factual restaurant attribute.

## Hidden gems and NEW badge

`hiddenGem:true` is an editorial flag. Only use it where the place is reasonably supported as tucked-away, under-the-radar, or a local find; do not apply it just because a restaurant is newly added.

`new:true` means **newly added to Eat What?!**, not newly opened in real life. It displays a small `NEW` badge beside the winning restaurant name.

Current active hidden-gem / NEW entries:

- **King Umar Teh Tarik Cafe** — #01-08 The Adelphi
- **Supreme Pork Chop Rice** — #B1-01 Bulkhaul House
- **Alex's Eating House** — #01-01 Chye Sing Building
- **Wawa Lala Bee Hoon** — #01-11/12 Fortune Centre
- **Mandalay Style Myanmar Restaurant** — #B1-01 Peninsula Plaza
- **Inle Myanmar Restaurant** — #B1-07A Peninsula Plaza

The badge can be removed later simply by deleting `new:true`; the place can remain `hiddenGem:true` if that editorial description still fits.

## Additional verified City Hall-area finds — 15 Sep 2026

Seven active recommendations were added after checking current business listings:

1. **Alex's Eating House** — Chye Sing Building #01-01 — old-school roast meats — hidden gem
2. **Wawa Lala Bee Hoon** — Fortune Centre #01-11/12 — clam bee hoon — hidden gem
3. **Mandalay Style Myanmar Restaurant** — Peninsula Plaza #B1-01 — Burmese — hidden gem
4. **Inle Myanmar Restaurant** — Peninsula Plaza #B1-07A — Burmese — hidden gem
5. **Victor's Kitchen** — Sunshine Plaza #01-49 — Hong Kong dim sum
6. **YY Kafei Dian** — 37 Beach Road — local coffee shop fare
7. **Chin Chin Eating House** — 19 Purvis Street — Hainanese zi char / chicken rice

Recent Peninsula Plaza coverage in 2026 continues to describe its basement/lower-floor Myanmar eateries as active, authentic and easy to overlook from the street. The list deliberately adds some non-mall options so Funan does not dominate every game.

## Multi-area expansion plan

The filter architecture is now ready for future lunch zones. The next research passes can populate areas independently rather than expanding one giant Singapore-wide pool.

Suggested scope:

- **Mapletree Business City (MBC):** MBC I/II, Alexandra Retail Centre and genuinely walkable lunch options around Alexandra/Pasir Panjang
- **Punggol Digital District (PDD):** PDD, Punggol Coast Mall and walkable nearby food options
- **Jurong West:** Jurong Point/Boon Lay plus neighbourhood coffee shops, hawker centres and stronger local hidden gems

For MBC and PDD, prioritise realistic lunch walking distance. For Jurong West, prioritise neighbourhood quality and variety rather than only malls.

## Halal rule

Absence of a halal flag must not be interpreted as "not halal".

Use:

- `certified` when certification has been verified
- `not-certified` only when that status has actually been verified
- `unknown` when it has not been checked

Current verified halal records include Qi Ji, Dapur Penyet, The Tree Cafe, Makanan Bollywood, Hatsumi Donburi & Soba, and Flavours by Sauté.

## Price tiers

The app currently uses `$`, `$$`, and `$$$`, but the exact SGD thresholds have **not yet been defined**. Do not recategorise the whole dataset until one consistent rule is agreed.

## Cuisine taxonomy

The current values are still preserved for now. They mix cuisines and venue types, for example:

- Chinese
- Sichuan
- Yunnan
- Taiwanese
- Peranakan / Nonya
- Cafe
- Food court
- Drinks
- Cai fan
- Heritage
- Vegetarian
- Indian Vegetarian
- Burmese
- Hong Kong Dim Sum
- Chinese Seafood

This remains a meaningful cleanup area. `type` already separates `Food court`, `Cafe`, and `Drinks` conceptually so a future migration can be gradual.

## Items still needing verification

- **Punggol Nasi Lemak** — business branding may use `Ponggol`; preserve the current name until verified
- older stall-specific records without `hoursChecked` should eventually receive a provenance pass
- all food `colour` values are subjective and worth a human sanity pass
- hidden-gem labels should be periodically reviewed rather than automatically assigned to every niche restaurant
- periodically re-check `temporarily-closed` records such as The Masses for reopening

## Adding a new shared place

For now, add it to `MASTER_PLACES` in `data.js`. At minimum collect:

1. Name
2. Area
3. Building / street
4. Cuisine
5. Price tier
6. Unit number or location hint
7. Halal status (`certified` only if verified)
8. Opening hours
9. Opening-hours source and checked date
10. Current operating status
11. Notes only when useful
12. Food colour for Colour census
13. `hiddenGem:true` only when editorially justified
14. `new:true` only while you want the temporary NEW badge shown

After deployment, open the browser console and inspect:

```js
EAT_WHAT_DATA_AUDIT
```

It reports counts, closure status and basic duplicate/schema problems without changing the user experience.
