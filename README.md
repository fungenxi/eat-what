# Eat What?!

A lunch decider for a small office in Singapore's Civic District. It narrows a restaurant list with filters, uses a group ritual, then picks a winner with a game.

## Live deployment

This repo is intended to be deployed with **GitHub Pages** from the `main` branch, `/ (root)`.

Once Pages is enabled, every commit to `main` becomes the next live version. There is intentionally no separate dev branch for now.

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

The app is still plain HTML/CSS/JavaScript with no build step, npm, framework, or bundler. It has been split into small files so future feature work is easier to maintain.

- `index.html` — page structure and script loading
- `styles.css` — all visual styling
- `data.js` — curated master restaurant list + browser persistence helpers
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

For now, edit `MASTER_PLACES` in `data.js`. This is intentionally simple while the list is still manageable.

If the dataset eventually becomes cumbersome to maintain in code, it can be moved to a free-tier database later without changing the GitHub Pages hosting setup.
