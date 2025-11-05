'use client'

import { useState, useEffect } from 'react'

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' }
]

export default function LanguageSwitcher() {
  const [active, setActive] = useState('en')

  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/)
    const cookieLocale = match ? decodeURIComponent(match[1]) : 'en'
    setActive(cookieLocale)
  }, [])

  const setLocale = (code: string) => {
    document.cookie = `NEXT_LOCALE=${encodeURIComponent(code)}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          aria-pressed={active === l.code}
          style={{
            border: '1px solid #ddd',
            background: active === l.code ? '#111' : '#fff',
            color: active === l.code ? '#fff' : '#111',
            padding: '4px 8px',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}


