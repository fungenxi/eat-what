# Eat What?! data guide

This file is the maintenance guide for the shared restaurant list in `data.js`.

## Current dataset

There are currently **32 shared places**.

Opening-hours quality:

- **8** have stall-specific hours (`src: "stall"`)
- **21** use building-level hours (`src: "mall"`)
- **3** have no opening hours recorded

Halal data:

- **3** are explicitly marked halal-certified
- **29** are currently treated as **unknown**, not as "not halal"

The app now runs `data-cleanup.js` after `data.js`. This adds readable canonical fields to every shared place without breaking the existing UI or short field names.

## Canonical fields

Use these concepts when adding or cleaning records:

| Field | Meaning |
| --- | --- |
| `id` | Unique identifier for one branch/location |
| `name` | Display name |
| `cuisine` | Main cuisine/category currently used by the Cuisine filter |
| `type` | `Eatery`, `Cafe`, `Food court`, or `Drinks` for now |
| `priceTier` | `1`, `2`, or `3` |
| `area` | Broad area, currently `Civic District` |
| `building` | Building / mall used by the Building filter |
| `unit` | Actual unit number only, e.g. `B1-16` |
| `locationHint` | Human directions, e.g. `By the waterfall` |
| `colour` | Food-colour value used by Colour census |
| `halalStatus` | `certified`, `not-certified`, or `unknown` |
| `hours` | Opening-hours object |
| `hoursSource.level` | `stall`, `building`, or `unknown` |
| `hoursSource.checked` | Date the hours were last checked; not populated yet |
| `hoursSource.url` | Source URL for the hours; not populated yet |
| `status` | `active` for now |

The existing short fields (`n`, `c`, `p`, `l`, `w`, `col`, `h`, `src`) remain in `data.js` because the current UI uses them. `data-cleanup.js` derives the canonical fields so feature work can gradually move to clearer names without a risky rewrite.

## Location rule

Do not mix a unit number with directions.

Good:

```text
unit: B1-16
locationHint: null
```

or:

```text
unit: null
locationHint: By the waterfall
```

Current location hints separated by the cleanup layer include:

- `Inside Raffles Coffee & Toast`
- `Basement 2`
- `By the waterfall`
- `In Lao Di Fang food court`

## Opening-hours rule

This is the most important data-cleaning priority because it affects the `Open now` filter.

- `stall` = hours belong to the actual restaurant/stall
- `building` = only the mall/building hours are known
- `unknown` = no useful hours recorded

Do **not** upgrade a building-hours record to stall-level unless there is an actual source for that stall.

The three records with no hours at present are:

- Makanan Bollywood
- Tian Xin Wanton Noodle
- Tony Café

## Halal rule

Absence of a halal flag must not be interpreted as "not halal".

Use:

- `certified` when certification has been verified
- `not-certified` only when that status has actually been verified
- `unknown` when it has not been checked

## Price tiers

The app currently uses `$`, `$$`, and `$$$`, but the exact SGD thresholds have **not yet been defined**. Do not recategorise the whole dataset until one consistent rule is agreed.

## Cuisine taxonomy

The current values are preserved for now. They mix cuisines and venue types, for example:

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

Before the list grows substantially, decide whether the filter should use a smaller set of broad cuisines, tags, or both. `type` has been separated so `Food court`, `Cafe`, and `Drinks` do not need to stay cuisine values forever.

## Items still needing verification

These were already uncertain in the handoff and should not be silently "corrected" without checking a source:

- Big Appetite — operator/name should be verified if this becomes important
- Punggol Nasi Lemak — business branding may use `Ponggol`; preserve the contributed name until verified
- 109 Yong Tau Fu — Funan / Lao Di Fang location was inferred and should be verified
- All `colour` values — assigned by inference and worth a human pass

## Adding a new shared place

For now, add it to `MASTER_PLACES` in `data.js` and follow the existing compact format. At minimum collect:

1. Name
2. Building
3. Cuisine
4. Price tier
5. Unit number or location hint, if known
6. Halal status (`certified` only if verified)
7. Opening hours
8. Whether those hours are stall-specific or only building hours
9. Notes only when useful
10. Food colour for the Colour census

After deployment, open the browser console and inspect:

```js
EAT_WHAT_DATA_AUDIT
```

It reports counts and basic duplicate/schema problems without changing the user experience.
