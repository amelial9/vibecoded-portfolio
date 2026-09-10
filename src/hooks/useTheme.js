import { useCallback, useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'night' ? 'night' : 'day')
  useEffect(() => {
    if (theme === 'night') document.documentElement.dataset.theme = 'night'
    else delete document.documentElement.dataset.theme
    try { localStorage.setItem('amelia-theme', theme) } catch {}
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.content = theme === 'night' ? '#1C1714' : '#FAF8F3'
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'night' ? 'day' : 'night')), [])
  return { theme, toggle, isNight: theme === 'night' }
}
