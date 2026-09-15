# Eat What?! data guide

This file is the maintenance guide for the shared restaurant list in `data.js`.

## Current dataset

There are currently **31 shared places**.

Opening-hours quality after the 15 Sep 2026 verification pass:

- **30** have venue/stall-specific hours
- **0** rely only on generic mall hours
- **1** has unverified hours: **Yuen Kee Dumpling (Funan)**
- **24** records were actively checked on 15 Sep 2026 and carry a source label/date

Halal data:

- **5** are explicitly marked halal-certified
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
| `colour` | Food-colour value used by Colour census |
| `halalStatus` | `certified`, `not-certified`, or `unknown` |
| `hours` | Opening-hours object |
| `hoursSource.level` | `stall`, `building`, or `unknown` |
| `hoursSource.checked` | Date hours were last checked |
| `hoursSource.url` | Source URL where one is available |
| `hoursSource.label` | Human-readable source description |
| `status` | `active` for now |

The existing short fields (`n`, `c`, `p`, `l`, `w`, `col`, `h`, `src`) remain because the current UI uses them.

## Opening-hours rule

This directly affects the `Open now` filter, so accuracy matters more than completeness.

- `stall` = hours belong to the actual restaurant / venue
- `building` = only building hours are known
- `unknown` = hours have not been verified

The `Open now` filter now includes **only places confirmed open at that moment**. Unknown-hours places are excluded instead of being treated as possibly open.

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

## Halal rule

Absence of a halal flag must not be interpreted as "not halal".

Use:

- `certified` when certification has been verified
- `not-certified` only when that status has actually been verified
- `unknown` when it has not been checked

Current verified halal records include Qi Ji, Dapur Penyet, The Tree Cafe, Makanan Bollywood, and Hatsumi Donburi & Soba.

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

This is the next meaningful cleanup area once hours/location data are stable. `type` already separates `Food court`, `Cafe`, and `Drinks` conceptually so a future migration can be gradual.

## Items still needing verification

- **Yuen Kee Dumpling (Funan)** — unit is verified, but opening hours still need a trustworthy outlet-specific source
- **Punggol Nasi Lemak** — business branding may use `Ponggol`; preserve the current name until verified
- older stall-specific records without `hoursChecked` should eventually receive a provenance pass
- all `colour` values are subjective and worth a human sanity pass

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

After deployment, open the browser console and inspect:

```js
EAT_WHAT_DATA_AUDIT
```

It reports counts and basic duplicate/schema problems without changing the user experience.
