# Eat What?! data guide

This file is the maintenance guide for the shared restaurant list in `data.js`.

## Current dataset

There are currently **37 shared places**.

Opening-hours quality after the 15 Sep 2026 verification pass:

- **37** have venue/stall-specific hours
- **0** rely only on generic mall hours
- **0** have unverified hours
- **31** records carry a verification date and source label

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
| `area` | Broad area, currently `Civic District` |
| `building` | Building / mall used by the Building filter |
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
| `status` | `active` for now |

The existing short fields (`n`, `c`, `p`, `l`, `w`, `col`, `h`, `src`) remain because the current UI uses them.

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

The Clarke Quay entries in the dataset now use **Clarke Quay Central** where they are actually located at The Central mall, rather than the broader Clarke Quay precinct.

Generic `Clarke Quay Food Court` was replaced with the current **Sinfoodie** food court.

`Yuan Kee Dumpling` was corrected to **Yuen Kee Dumpling** and the Funan unit was set to `02-03`.

The Yuen Kee Dumpling Funan record now also has verified daily opening hours of **10am–9pm**, based on the user-provided business listing. The Chinese name `袁记云饺` is retained as an alternate name in the data.

A new **Bulkhaul House** location appears because Supreme Pork Chop Rice is at #B1-01 there. Point the Way uses a neutral point icon for locations that do not yet have a deliberately configured physical direction; the app should not invent an arrow direction.

## Colour census

The room/outfit colours are now deliberately broader than the food-colour data.

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

Restaurants still keep a simpler food-colour family such as `white`, `brown`, `red`, or `green`. Common clothing colours map to one or two nearby food-colour families so the ritual stays fun instead of returning zero matches most of the time.

For example, `grey` can match white or brown food; `pink` can match red or white; `blue` can match white or green. This mapping is intentionally playful rather than a factual restaurant attribute.

## Hidden gems and NEW badge

`hiddenGem:true` is an editorial flag. Only use it where the place is reasonably supported as tucked-away, under-the-radar, or a local find; do not apply it just because a restaurant is newly added.

`new:true` means **newly added to Eat What?!**, not newly opened in real life. It displays a small `NEW` badge beside the winning restaurant name.

Current hidden-gem / NEW entries:

- **King Umar Teh Tarik Cafe** — #01-08 The Adelphi; under-the-radar prata, biryani and teh tarik, with goreng pisang typically appearing around 3pm
- **Supreme Pork Chop Rice** — #B1-01 Bulkhaul House; old-school Taiwanese pork chop rice in a basement location near City Hall

The badge can be removed later simply by deleting `new:true`; the place can remain `hiddenGem:true` permanently if that editorial description still fits.

## Researched additions — 15 Sep 2026

Six recommendations were added after a web verification pass:

1. **King Umar Teh Tarik Cafe** — Adelphi #01-08 — Indian Muslim — hidden gem
2. **Flavours by Sauté** — Funan #B1-30 — vegetarian/vegan fusion, halal-certified
3. **Godmama** — Funan #04-07 — modern Peranakan
4. **Nalan** — Capitol #B2-54 — Indian vegetarian
5. **Supreme Pork Chop Rice** — Bulkhaul House #B1-01 — Taiwanese — hidden gem
6. **The Masses** — Capitol #01-84 — Franco-Asian

The source label, verification date and URL are stored on each record where available.

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
- Franco-Asian

This is the next meaningful cleanup area now that hours/location data are stable. `type` already separates `Food court`, `Cafe`, and `Drinks` conceptually so a future migration can be gradual.

## Items still needing verification

- **Punggol Nasi Lemak** — business branding may use `Ponggol`; preserve the current name until verified
- older stall-specific records without `hoursChecked` should eventually receive a provenance pass
- all food `colour` values are subjective and worth a human sanity pass
- hidden-gem labels should be periodically reviewed rather than automatically assigned to every niche restaurant

## Adding a new shared place

For now, add it to `MASTER_PLACES` in `data.js`. At minimum collect:

1. Name
2. Building
3. Cuisine
4. Price tier
5. Unit number or location hint
6. Halal status (`certified` only if verified)
7. Opening hours
8. Opening-hours source and checked date
9. Notes only when useful
10. Food colour for Colour census
11. `hiddenGem:true` only when editorially justified
12. `new:true` only while you want the temporary NEW badge shown

After deployment, open the browser console and inspect:

```js
EAT_WHAT_DATA_AUDIT
```

It reports counts and basic duplicate/schema problems without changing the user experience.
