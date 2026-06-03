import React, { useState, useEffect } from 'react'

function readProfileName() {
  try {
    const raw = localStorage.getItem('cardiometabolicProfile')
    const name = raw ? (JSON.parse(raw)?.name || '').trim() : ''
    return name ? name.split(' ')[0] : ''
  } catch (_) {
    return ''
  }
}

function timeOfDayGreeting(date = new Date()) {
  const h = date.getHours()
  if (h < 5)  return 'Hello'         // late night / very early
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Hero({ firstName }) {
  // Prefer the prop (App is the source of truth). Fall back to localStorage if rendered standalone.
  const propName = (firstName || '').trim()
  const [fallbackName, setFallbackName] = useState(() => propName || readProfileName())
  const [greeting, setGreeting] = useState(() => timeOfDayGreeting())

  // Keep fallbackName in sync with prop changes (covers onboarding finish, profile edit, etc.)
  useEffect(() => {
    if (propName) setFallbackName(propName)
    else setFallbackName(readProfileName())
  }, [propName])

  // Refresh greeting periodically + on focus so it stays accurate across time-of-day boundaries
  useEffect(() => {
    function refresh() {
      setGreeting(timeOfDayGreeting())
      if (!propName) setFallbackName(readProfileName())
    }
    window.addEventListener('focus', refresh)
    const t = setInterval(refresh, 60_000)
    return () => {
      window.removeEventListener('focus', refresh)
      clearInterval(t)
    }
  }, [propName])

  const name = propName || fallbackName

  return (
    <section className="hero">
      <p className="hero__greeting-eyebrow">
        {name ? `${greeting}, ${name}` : greeting}
      </p>
    </section>
  )
}
