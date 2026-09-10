// The room: a 22x14 tile map (16px tiles → 352x224). Furniture is drawn procedurally
// with pixel-snapped rects so everything shares one cozy palette.
export const T = 16
export const COLS = 22, ROWS = 14
export const W = COLS * T, H = ROWS * T

const C = {
  wall: '#D9C7A9', wallDark: '#C4AE8C', wallLight: '#E6D7BD', base: '#8C6A4A',
  floor: '#E4C8A6', floorLine: '#D2B48F', floorDark: '#C9A882',
  wood: '#A5744C', woodDark: '#7A5233', woodLight: '#C48F62',
  ink: '#2E211B', cream: '#FFF7E3', sand: '#F0DEBA', oat: '#E8DFD0', stone: '#D7D3BF', taupe: '#C7BDB5',
  matcha: '#9CAF88', matchaDark: '#6F8A5E', peach: '#F2C6A0', red: '#E0574A', sky: '#BFE0F5', skyNight: '#1B2440',
  screen: '#2A3A2A', screenOn: '#9BBC0F', grey: '#8C7F73', white: '#FFFFFF', boba: '#3B2A22', tea: '#D9B99B', yellow: '#F2C94C',
}

const r = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h) }
const box = (ctx, x, y, w, h, fill, line = C.ink) => { r(ctx, x, y, w, h, line); r(ctx, x + 1, y + 1, w - 2, h - 2, fill) }

// ── static backdrop (walls + floor + rug) cached once per theme ────────────
export function drawBackdrop(ctx, night, t = 0) {
  // wall
  r(ctx, 0, 0, W, T * 2 + 4, C.wall)
  for (let x = 0; x < W; x += 8) r(ctx, x, 0, 1, T * 2, C.wallLight)
  r(ctx, 0, T * 2 - 2, W, 3, C.wallDark)
  r(ctx, 0, T * 2 + 1, W, 3, C.base)
  // floor planks
  r(ctx, 0, T * 2 + 4, W, H - T * 2 - 4, C.floor)
  for (let y = T * 2 + 4; y < H; y += 8) {
    r(ctx, 0, y, W, 1, C.floorLine)
    const off = ((y / 8) % 2) * 24
    for (let x = off; x < W; x += 48) r(ctx, x, y, 1, 8, C.floorLine)
  }
  // rug
  const rx = T * 7, ry = T * 6, rw = T * 7, rh = T * 5
  r(ctx, rx, ry, rw, rh, C.matchaDark)
  r(ctx, rx + 2, ry + 2, rw - 4, rh - 4, C.matcha)
  r(ctx, rx + 6, ry + 6, rw - 12, rh - 12, C.cream)
  r(ctx, rx + 8, ry + 8, rw - 16, rh - 16, C.matcha)
  for (let i = 0; i < rw; i += 6) { r(ctx, rx + i + 1, ry + 3, 2, 1, C.cream); r(ctx, rx + i + 1, ry + rh - 4, 2, 1, C.cream) }
  // window (wall)
  const wx = T * 2, wy = 4
  box(ctx, wx, wy, T * 3, T * 2 - 6, night ? C.skyNight : C.sky)
  if (night) { [[6, 6], [14, 10], [22, 5], [30, 12], [38, 8], [10, 18], [34, 20]].forEach(([sx, sy]) => r(ctx, wx + sx, wy + sy, 1, 1, C.white)); r(ctx, wx + 36, wy + 6, 6, 6, C.yellow); r(ctx, wx + 34, wy + 5, 4, 4, C.skyNight) }
  else { r(ctx, wx + 8, wy + 6, 10, 3, C.white); r(ctx, wx + 11, wy + 4, 5, 3, C.white); r(ctx, wx + 28, wy + 12, 12, 3, C.white); r(ctx, wx + 32, wy + 10, 6, 3, C.white); r(ctx, wx + 6, wy + 18, 30, 6, '#8FB9A6') }
  r(ctx, wx + T * 3 / 2 - 1, wy, 2, T * 2 - 6, C.ink); r(ctx, wx, wy + T - 4, T * 3, 2, C.ink)
  r(ctx, wx - 2, wy + T * 2 - 6, T * 3 + 4, 3, C.woodDark)
  // poster (Hamilton-ish star)
  const px = T * 8 + 4, py = 5
  box(ctx, px, py, 22, 22, C.sand)
  r(ctx, px + 10, py + 3, 2, 12, C.ink); r(ctx, px + 4, py + 8, 14, 2, C.ink); r(ctx, px + 6, py + 5, 2, 2, C.ink); r(ctx, px + 14, py + 5, 2, 2, C.ink); r(ctx, px + 5, py + 13, 3, 4, C.ink); r(ctx, px + 14, py + 13, 3, 4, C.ink)
  r(ctx, px + 3, py + 18, 16, 1, C.ink)
  // clock
  const cx = T * 12 + 8, cy = 12
  r(ctx, cx - 6, cy - 6, 12, 12, C.ink); r(ctx, cx - 5, cy - 5, 10, 10, C.cream)
  r(ctx, cx, cy - 4, 1, 4, C.ink); r(ctx, cx, cy, 3, 1, C.ink)
  // door (wall, cols 15-16)
  const dx = T * 15, dy = 2
  box(ctx, dx, dy, T * 2, T * 2 + 3, C.wood)
  r(ctx, dx + 3, dy + 3, T * 2 - 6, T - 2, C.woodDark); r(ctx, dx + 4, dy + 4, T * 2 - 8, T - 4, C.woodLight)
  r(ctx, dx + T * 2 - 7, dy + T + 5, 3, 3, C.yellow)
  // shelf on wall w/ trophies
  const sx = T * 19, sy = 8
  r(ctx, sx, sy + 10, 40, 3, C.woodDark)
  r(ctx, sx + 4, sy + 2, 6, 8, C.yellow); r(ctx, sx + 5, sy, 4, 3, C.yellow); r(ctx, sx + 3, sy + 8, 8, 2, C.ink)
  r(ctx, sx + 16, sy + 3, 8, 7, C.matcha); r(ctx, sx + 17, sy + 1, 6, 2, C.matchaDark)
  r(ctx, sx + 30, sy + 4, 6, 6, C.peach); r(ctx, sx + 32, sy + 2, 2, 2, C.ink)
}

// ── furniture (drawn every frame in y-order for depth) ─────────────────────
const F = {
  desk(ctx, o, s) {
    const { x, y, w, h } = o
    box(ctx, x, y + 8, w, h - 8, C.wood); r(ctx, x + 1, y + 9, w - 2, 3, C.woodLight)
    r(ctx, x + 3, y + h - 4, 3, 6, C.woodDark); r(ctx, x + w - 6, y + h - 4, 3, 6, C.woodDark)
    // monitor
    box(ctx, x + 14, y - 12, 30, 22, C.ink); r(ctx, x + 16, y - 10, 26, 16, s.night ? C.screenOn : C.cream)
    const code = s.night ? C.screen : C.taupe
    r(ctx, x + 18, y - 8, 10, 2, code); r(ctx, x + 18, y - 4, 16, 2, code); r(ctx, x + 22, y, 8, 2, code)
    if (Math.floor(s.t * 2) % 2) r(ctx, x + 31, y, 2, 3, s.night ? C.screen : C.ink)
    r(ctx, x + 27, y + 10, 4, 3, C.ink); r(ctx, x + 22, y + 12, 14, 2, C.ink)
    // keyboard + mouse
    r(ctx, x + 16, y + 15, 22, 5, C.stone); r(ctx, x + 17, y + 16, 20, 1, C.taupe)
    r(ctx, x + 42, y + 15, 5, 6, C.stone)
    // boba cup
    r(ctx, x + 4, y + 10, 8, 10, C.tea); r(ctx, x + 4, y + 10, 8, 1, C.ink); r(ctx, x + 3, y + 9, 10, 2, C.matcha); r(ctx, x + 7, y + 3, 2, 8, C.red)
    r(ctx, x + 5, y + 16, 2, 2, C.boba); r(ctx, x + 8, y + 17, 2, 2, C.boba)
  },
  chair(ctx, o) { const { x, y, w, h } = o; box(ctx, x, y, w, h, C.matchaDark); r(ctx, x + 2, y + 2, w - 4, 4, C.matcha); r(ctx, x + 3, y + h, 2, 3, C.ink); r(ctx, x + w - 5, y + h, 2, 3, C.ink) },
  bookshelf(ctx, o) {
    const { x, y, w, h } = o
    box(ctx, x, y, w, h, C.wood)
    const cols = ['#B5545C', '#9CAF88', '#F0DEBA', '#524740', '#F2C6A0', '#6F8A5E', '#C7BDB5', '#E0574A', '#3B2A22', '#FFF7E3']
    let seed = 7
    for (let row = 0; row < 3; row++) {
      const ry = y + 4 + row * 14
      r(ctx, x + 2, ry + 12, w - 4, 2, C.woodDark)
      let bx = x + 3
      while (bx < x + w - 6) { seed = (seed * 9301 + 49297) % 233280; const bw = 3 + (seed % 3); const bh = 9 + (seed % 3); r(ctx, bx, ry + 12 - bh, bw, bh, cols[seed % cols.length]); r(ctx, bx, ry + 12 - bh, bw, 1, 'rgba(0,0,0,0.25)'); bx += bw + 1 }
    }
  },
  tv(ctx, o, s) {
    const { x, y, w, h } = o
    box(ctx, x + 4, y + h - 8, w - 8, 8, C.wood)
    box(ctx, x, y, w, h - 10, C.ink)
    const on = Math.floor(s.t * 6) % 6
    r(ctx, x + 2, y + 2, w - 4, h - 14, ['#F6D6A8', '#B5D3E7', '#F2C6A0', '#9CAF88', '#F7C6CF', '#D7D3BF'][on])
    r(ctx, x + 6, y + 6, 10, 8, C.ink); r(ctx, x + w - 16, y + 8, 8, 6, C.ink)
    r(ctx, x + w / 2 - 3, y + h - 10, 6, 3, C.ink)
  },
  boombox(ctx, o, s) {
    const { x, y, w, h } = o
    box(ctx, x, y + 10, w, h - 10, C.woodLight) // table
    box(ctx, x + 3, y - 2, w - 6, 13, C.taupe)
    r(ctx, x + 6, y + 1, 6, 6, C.ink); r(ctx, x + 8, y + 3, 2, 2, C.stone)
    r(ctx, x + w - 12, y + 1, 6, 6, C.ink); r(ctx, x + w - 10, y + 3, 2, 2, C.stone)
    r(ctx, x + 13, y + 2, w - 26, 4, s.music ? C.screenOn : C.stone)
    r(ctx, x + 8, y - 5, w - 16, 3, C.ink)
    if (s.music) { const n = Math.floor(s.t * 3) % 3; r(ctx, x + w + 2 + n * 3, y - 6 - n * 3, 2, 2, C.ink) }
  },
  bed(ctx, o) {
    const { x, y, w, h } = o
    box(ctx, x, y, w, h, C.woodDark)
    r(ctx, x + 2, y + 2, w - 4, h - 4, C.cream)
    r(ctx, x + 2, y + 18, w - 4, h - 20, C.sand)
    for (let i = 0; i < w - 4; i += 6) for (let j = 0; j < h - 20; j += 6) r(ctx, x + 2 + i + (j % 12 ? 3 : 0), y + 18 + j, 2, 2, C.peach)
    r(ctx, x + 2, y + 18, w - 4, 2, C.ink)
    box(ctx, x + 4, y + 4, w - 8, 10, C.white)
  },
  lamp(ctx, o) { const { x, y } = o; r(ctx, x + 6, y + 6, 2, 22, C.ink); box(ctx, x, y, 14, 9, C.sand); r(ctx, x + 3, y + 26, 8, 3, C.ink) },
  plant(ctx, o) { const { x, y } = o; box(ctx, x + 3, y + 14, 10, 10, C.peach); r(ctx, x + 2, y + 13, 12, 2, C.ink); r(ctx, x + 5, y + 4, 6, 10, C.matchaDark); r(ctx, x + 1, y + 6, 5, 6, C.matcha); r(ctx, x + 10, y + 5, 5, 7, C.matcha); r(ctx, x + 6, y + 1, 4, 5, C.matcha) },
  catbed(ctx, o) { const { x, y, w, h } = o; r(ctx, x + 2, y, w - 4, h, C.taupe); r(ctx, x, y + 2, w, h - 4, C.taupe); r(ctx, x + 4, y + 3, w - 8, h - 6, C.oat) },
  fridge(ctx, o) { const { x, y, w, h } = o; box(ctx, x, y, w, h, C.stone); r(ctx, x + 1, y + 12, w - 2, 1, C.ink); r(ctx, x + w - 5, y + 4, 2, 6, C.ink); r(ctx, x + w - 5, y + 15, 2, 8, C.ink); r(ctx, x + 3, y + 3, 6, 6, C.matcha); r(ctx, x + 4, y + 16, 8, 4, C.peach) },
  cage(ctx, o) { const { x, y, w, h } = o; box(ctx, x, y + 4, w, h - 4, C.oat); for (let i = 3; i < w - 2; i += 4) r(ctx, x + i, y + 6, 1, h - 8, C.grey); r(ctx, x, y + 4, w, 2, C.ink); r(ctx, x + 4, y, 6, 4, C.red); r(ctx, x + 6, y + h - 6, 5, 2, C.sand) },
}

// ── objects: solid rect (collision) + interaction + dialogue ───────────────
// x/y/w/h in px. `solid` false = walkable. `sort` = y used for depth (default bottom edge)
export const OBJECTS = [
  { id: 'desk', x: T * 1, y: T * 3, w: T * 3 + 8, h: T * 2, draw: F.desk, label: 'Desk',
    lines: ['This is where the magic (and the bugs) happen.', 'Crossly, VoxTune, PetSwipe… all built at this desk, usually past midnight.'], action: { label: 'Open projects', target: '#projects' } },
  { id: 'chair', x: T * 2 + 4, y: T * 5 + 6, w: 18, h: 12, draw: F.chair, label: 'Chair', lines: ['Ergonomic? No. Has a cat-hair layer? Yes.'] },
  { id: 'cage', x: T * 1, y: T * 8 + 2, w: 30, h: 22, draw: F.cage, label: 'Lab corner',
    lines: ['My Golden Lab corner. Physiological time-series in, behavior labels out.', '(The mouse escaped. Again. Go say hi.)'], action: { label: 'Open research', target: '#research' } },
  { id: 'catbed', x: T * 4 + 8, y: T * 11, w: 28, h: 16, draw: F.catbed, label: 'Cat bed', solid: false, lines: ['Mily’s bed. She sleeps here between answering questions about me.'] },
  { id: 'tv', x: T * 7 + 8, y: T * 1 + 6, w: 44, h: 30, draw: F.tv, label: 'TV',
    lines: ['HIMYM, Loki, Grey’s, Friends, Silicon Valley.', 'Yes, all of them. Multiple times. Legen— wait for it —dary.'], action: { label: 'See after hours', target: '#after-hours' } },
  { id: 'boombox', x: T * 11 + 4, y: T * 2 + 6, w: 40, h: 20, draw: F.boombox, label: 'Boombox',
    lines: ['Payphone → Jay Park → Jay Chou. The playlist has range.', 'Hamilton and SIX are the official debugging soundtracks.'], action: { label: 'Play some music', target: '#after-hours' } },
  { id: 'fridge', x: T * 13 + 4, y: T * 9, w: 20, h: 28, draw: F.fridge, label: 'Mini fridge',
    lines: ['Boba dev hours are sacred.', 'Current inventory: boba (∞), coffee (a lot), leftover motivation (varies).'], action: { label: 'Read the lore', target: '#about' } },
  { id: 'plant', x: T * 17 + 8, y: T * 2, w: 16, h: 24, draw: F.plant, label: 'Plant', lines: ['Still alive. Unlike my first Node server.'] },
  { id: 'bookshelf', x: T * 18 + 4, y: T * 2 + 2, w: 52, h: 46, draw: F.bookshelf, label: 'Bookshelf',
    lines: ['IBM. The iSchool. Golden Lab. Cursor.', 'The quest log lives here, in roughly chronological order.'], action: { label: 'Open experience', target: '#experience' } },
  { id: 'lamp', x: T * 16 + 10, y: T * 9 + 2, w: 14, h: 30, draw: F.lamp, label: 'Lamp', lines: ['Warm light for late-night deploys.'] },
  { id: 'bed', x: T * 18 + 4, y: T * 8 + 4, w: 52, h: 76, draw: F.bed, label: 'Bed',
    lines: ['Nap time?', '…HP fully restored. Debugging skill +2.'], effect: 'heal' },
  // wall things (not drawn here; on the backdrop) — thin interaction strips just below the wall
  { id: 'window', x: T * 2, y: T * 2 - 6, w: T * 3, h: 10, solid: false, hidden: true, label: 'Window',
    lines: ['Seattle. It is probably raining.'], action: { label: 'Toggle day / night', effect: 'night' } },
  { id: 'poster', x: T * 8 + 2, y: T * 2 - 6, w: 26, h: 10, solid: false, hidden: true, label: 'Poster', lines: ['Hamilton poster. Non-stop.', 'Best background music for working and debugging. No arguments accepted.'] },
  { id: 'door', x: T * 15, y: T * 2 - 6, w: T * 2, h: 10, solid: false, hidden: true, label: 'Door',
    lines: ['Heading out? Leave a note before you go!'], action: { label: 'Say hi ✉', target: '#contact' } },
  { id: 'trophies', x: T * 19, y: T * 2 - 6, w: 40, h: 10, solid: false, hidden: true, label: 'Shelf', lines: ['Datathon 2025: 🥈 ML, 🥉 Data Viz.', 'Also a plant I have not killed. Personal best.'] },
]

export const NPCS = {
  cat: { lines: ['meow.', '(This is Mily, my AI twin. She knows all my lore and will happily answer questions about me.)'], action: { label: 'Talk to Mily', target: '#mily' } },
  mouse: { lines: ['🐁 squeak!', 'At Golden Lab I teach machine learning to read this little guy’s behavior from noisy physiological signals.'], action: { label: 'Open research', target: '#research' } },
}

// collectible pearls (floor positions)
export const PEARLS = [
  [T * 6 + 4, T * 4 + 8], [T * 10, T * 12 + 4], [T * 15 + 6, T * 6], [T * 3, T * 12 + 6], [T * 12 + 2, T * 7 + 4], [T * 17, T * 12 + 6], [T * 8, T * 9 + 2],
]
export const C_PAL = C
