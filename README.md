# Eat What?!

A lunch decider for a small office in Singapore's Civic District. It narrows a restaurant list with filters, uses a group ritual, then picks a winner with a game.

## Live deployment

This repo is deployed with **GitHub Pages** from the `main` branch, `/ (root)`.

Every commit to `main` becomes the next live version. There is intentionally no separate dev branch for now.

Expected URL:

`https://fungenxi.github.io/eat-what/`

## Cost

The current setup is designed to stay free:

- GitHub repository: free
- GitHub Pages hosting: free for this public repo
- No backend
- No paid database
- Google Fonts is the only external request

## Project structure

The app is plain HTML/CSS/JavaScript with no build step, npm, framework, or bundler.

- `index.html` — page structure and script loading
- `styles.css` — main visual styling
- `mobile.css` — responsive/mobile resilience overrides
- `data.js` — curated master restaurant list + browser persistence helpers
- `data-cleanup.js` — non-destructive data normalization + automatic data audit
- `DATA_GUIDE.md` — restaurant data standards and cleanup queue
- `core.js` — app state, time/opening-hours logic, shared helpers
- `filters.js` — filters
- `add-place.js` — personal place form and local saving
- `rituals.js` — the five group rituals
- `games.js` — the six winner-picking games
- `verdict-nav.js` — verdict screen + saved eating history
- `nav-init.js` — navigation and startup

## Shared places vs personal places

`MASTER_PLACES` is the curated list maintained in this repo. Updating it and pushing to `main` updates the shared list for everyone.

Places a user adds with the `+` button are saved only in that browser using `localStorage`. Their recent `Going` history is also saved locally.

This means users can personalise the app without changing the shared master list or requiring accounts.

## Important limitation

Browser storage is device/browser-specific. A user's personal additions do not sync across devices and disappear if they clear site data.

That is deliberate for the current free version. A shared backend can be added later if cross-device accounts or community submissions become worth building.

## Updating the restaurant database

For now, edit `MASTER_PLACES` in `data.js`. Follow `DATA_GUIDE.md` when adding or cleaning records.

`data-cleanup.js` currently enriches the compact records with clearer fields such as `id`, `name`, `building`, `unit`, `locationHint`, `halalStatus`, and `hoursSource` without breaking the existing app.

For a quick data-quality check in the browser console, inspect:

```js
EAT_WHAT_DATA_AUDIT
```

If the dataset eventually becomes cumbersome to maintain in code, it can be moved to a free-tier database later without changing the GitHub Pages hosting setup.
