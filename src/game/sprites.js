// Pixel sprites as string maps. Each char maps to a palette color; '.' is transparent.
// Sprites are rasterised once into offscreen canvases (per frame / flip) and blitted.

export const PAL = {
  k: '#2E211B', // outline / hair
  s: '#F6DCC2', // skin
  b: '#F0A8A0', // blush
  t: '#9CAF88', // top (matcha)
  u: '#7E9670', // top shade
  p: '#524740', // pants
  w: '#FFFFFF', // white
  g: '#C9BDB0', // grey
  d: '#8C7F73', // dark grey
  e: '#E8DFD0', // oat
  o: '#F0DEBA', // sand
  r: '#E0574A', // red
  n: '#F7C6CF', // pink nose
  y: '#F2C94C', // yellow
}

// ── Amelia ────────────────────────────────────────────────────────────────
const A_DOWN = [
  '....kkkkkk......',
  '...kkkkkkkk.....',
  '..kkkkkkkkkk....',
  '..kkkwkkkkkk....',
  '..kksssssskk....',
  '..kkskssskkk....',
  '..kbssssssbk....',
  '..kkssskksskk...',
  '...kksssskk.....',
  '....ktttttk.....',
  '...kttttttttk...',
  '...stttttttts...',
  '....kttuuttk....',
  '....kppppppk....',
  '....kppk.kppk...',
  '....kkkk.kkkk...',
]
const A_UP = [
  '....kkkkkk......',
  '...kkkkkkkk.....',
  '..kkkkkkkkkk....',
  '..kkkkkkkwkk....',
  '..kkkkkkkkkk....',
  '..kkkkkkkkkk....',
  '..kkkkkkkkkk....',
  '..kkkkkkkkkk....',
  '...kkkkkkkk.....',
  '....ktttttk.....',
  '...kttttttttk...',
  '...stttttttts...',
  '....kttuuttk....',
  '....kppppppk....',
  '....kppk.kppk...',
  '....kkkk.kkkk...',
]
const A_RIGHT = [
  '.....kkkkkk.....',
  '....kkkkkkkk....',
  '...kkkkkkkkkk...',
  '...kkkkkkkwkk...',
  '...kkkkksssskk..',
  '...kkkkkskssk...',
  '...kkkkksssbk...',
  '...kkkkkkssk....',
  '....kkkkksk.....',
  '.....kttttk.....',
  '.....kttttkk....',
  '.....kttttks....',
  '.....kuuuuk.....',
  '.....kppppk.....',
  '.....kppppk.....',
  '.....kkkkkk.....',
]
// walk frames: lift alternate legs & bob
function legFrames(base) {
  const f1 = base.slice(); const f2 = base.slice()
  f1[14] = base[14].replace(/kppk(\.?)kppk/, 'kppk$1kkkk'); f1[15] = base[15].replace(/kkkk(\.?)kkkk/, 'kkkk$1....')
  f2[14] = base[14].replace(/kppk(\.?)kppk/, 'kkkk$1kppk'); f2[15] = base[15].replace(/kkkk(\.?)kkkk/, '....$1kkkk')
  return [base, f1, base, f2]
}
function sideFrames(base) {
  const f1 = base.slice(); f1[14] = '.....kppkk......'; f1[15] = '....kkkk.kk.....'
  const f2 = base.slice(); f2[14] = '......kppk......'; f2[15] = '.....kkkkkk.....'
  return [base, f1, base, f2]
}
export const AMELIA = { down: legFrames(A_DOWN), up: legFrames(A_UP), right: sideFrames(A_RIGHT), left: sideFrames(A_RIGHT) } // left is flipped at draw time

// ── Mily the cat (white, like the cursor) ─────────────────────────────────
const CAT_RIGHT = [
  '................',
  '................',
  '................',
  '................',
  '.......k...k....',
  '.......kwkwkk...',
  '......kwwwwwwk..',
  '..k...kwkwkwwk..',
  '..kk.kwwwnwwwk..',
  '..kwkkwwwwwwwk..',
  '..kwwwwwwwwwk...',
  '...kwwwwwwwwk...',
  '....kwwwwwwwk...',
  '....kwwkwwkwk...',
  '....kwk.kwk.k...',
  '....kk..kk......',
]
const CAT_RIGHT_2 = CAT_RIGHT.map((r, i) => (i === 14 ? '....kwk..kwk....' : i === 15 ? '....kk...kk.....' : r))
const CAT_SLEEP = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '.....kk..kk.....',
  '....kwwkkwwk....',
  '...kwwwwwwwwk...',
  '..kwwkwwwwkwwk..',
  '.kwwwwwwwwwwwwk.',
  '.kwwwwwwwwwwwwk.',
  '..kwwwwwwwwwwk..',
  '...kkkkkkkkkk...',
  '................',
]
export const CAT = { right: [CAT_RIGHT, CAT_RIGHT_2], left: [CAT_RIGHT, CAT_RIGHT_2], sleep: [CAT_SLEEP] }

// ── Lab mouse ─────────────────────────────────────────────────────────────
const MOUSE_RIGHT = [
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '................',
  '..........kk....',
  '.......kkkggk...',
  '..k...kgggggkk..',
  '...kkkgggkggnk..',
  '....kggggggggk..',
  '....kgggggggk...',
  '.....kk..kk.....',
  '................',
]
const MOUSE_RIGHT_2 = MOUSE_RIGHT.map((r, i) => (i === 14 ? '....kk....kk....' : r))
export const MOUSE = { right: [MOUSE_RIGHT, MOUSE_RIGHT_2], left: [MOUSE_RIGHT, MOUSE_RIGHT_2] }

// ── rasteriser ────────────────────────────────────────────────────────────
const cache = new Map()
export function raster(rows, { flip = false, pal = PAL } = {}) {
  const key = rows.join('|') + (flip ? 'F' : '')
  if (cache.has(key)) return cache.get(key)
  const h = rows.length, w = rows[0].length
  const c = document.createElement('canvas'); c.width = w; c.height = h
  const ctx = c.getContext('2d')
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ch = rows[y][x]; if (ch === '.' || !pal[ch]) continue
    ctx.fillStyle = pal[ch]; ctx.fillRect(flip ? w - 1 - x : x, y, 1, 1)
  }
  cache.set(key, c)
  return c
}
