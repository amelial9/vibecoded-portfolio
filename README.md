# Amelia's Room — personal site

A cozy, interactive portfolio for Amelia Li. React + Vite, no UI framework.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
npm run preview  # serve the production build
```

## What's inside

| Section | The fancy bit |
| --- | --- |
| Boot screen | Game-Boy style loader (once per session) |
| Hero | Boba pearls with real physics (matter.js) that pile up on the name. Drag / fling them, click to spawn more, `refill` to reset. |
| Nav | Magnetic links, sound toggle (procedural WebAudio), day / night theme, hides on scroll down |
| About | RPG character sheet with animated stat bars, inventory & quest log |
| Experience | Pinned section — vertical scroll drives a horizontal quest log (GSAP ScrollTrigger + Lenis). The boba cup fills as you scroll. |
| Projects | Built / Designed tabs, 3D tilt cards with glare, detail modal |
| Research | Golden Lab blurb + symposium posters (PDF) |
| After hours | Boombox that plays 30s previews, a 3D pull-out show shelf, and an **Amelia Boy** handheld with swappable cartridges. *Boba Catch* is actually playable (arrows / A). |
| Ask Mily | Chat with the `amelial9/milybot` Hugging Face Space |
| ▶ PLAY | Full-screen top-down pixel room. WASD / arrows to walk, E to poke furniture (each object links to a section), find all 7 pearls, talk to Mily the cat and the lab mouse. `N` toggles night lighting. Touch d-pad on mobile. |
| Easter eggs | Konami code · type `meow` · click the portrait sticker |

## Where to edit content

Everything text-like lives in `src/data/`:

- `profile.js` — name, roles, intro, links, character sheet
- `experiences.js` — jobs + education
- `projects.js` — built / designed projects
- `fun.js` — shows, games, research
- `music.js` — boombox tracks (iTunes preview URLs)

Room dialogue and furniture positions are in `src/game/room.js`; sprites in `src/game/sprites.js`.

## Deploy

`.github/workflows/deploy.yml` builds and publishes `dist/` to the `gh-pages` branch on every push to `main`, served at https://amelial9.github.io/vibecoded-portfolio/. The Vite `base` in `vite.config.js` is set to `/vibecoded-portfolio/`; change it to `/` (and add a `CNAME` in `public/`) if you point a custom domain at it.
