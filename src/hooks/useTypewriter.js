import { useEffect, useState } from 'react'

export function useTypewriter(words, { type = 70, del = 40, hold = 1500 } = {}) {
  const [i, setI] = useState(0)
  const [txt, setTxt] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const w = words[i % words.length]
    let t
    if (!deleting && txt === w) t = setTimeout(() => setDeleting(true), hold)
    else if (deleting && txt === '') { setDeleting(false); setI((n) => n + 1) }
    else t = setTimeout(() => setTxt(deleting ? w.slice(0, txt.length - 1) : w.slice(0, txt.length + 1)), deleting ? del : type)
    return () => clearTimeout(t)
  }, [txt, deleting, i, words, type, del, hold])
  return txt
}
