import { useEffect, useState } from 'react'

export function useMedia(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [m, setM] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const fn = () => setM(mq.matches)
    mq.addEventListener('change', fn)
    fn()
    return () => mq.removeEventListener('change', fn)
  }, [query])
  return m
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsTouch = () => useMedia('(hover: none), (pointer: coarse)')
export const useIsDesktop = () => useMedia('(min-width: 900px)')
