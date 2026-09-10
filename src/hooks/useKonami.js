import { useEffect } from 'react'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export function useSecretCode(seq, cb) {
  useEffect(() => {
    let buf = []
    const onKey = (e) => {
      if (e.target && /input|textarea/i.test(e.target.tagName)) return
      buf.push(e.key.length === 1 ? e.key.toLowerCase() : e.key)
      if (buf.length > seq.length) buf = buf.slice(-seq.length)
      if (seq.every((k, i) => buf[i] === k)) { buf = []; cb() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [seq, cb])
}

export const useKonami = (cb) => useSecretCode(KONAMI, cb)
export const useMeow = (cb) => useSecretCode(['m', 'e', 'o', 'w'], cb)
