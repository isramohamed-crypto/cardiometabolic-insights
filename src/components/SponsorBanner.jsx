import React from 'react'

/**
 * Amgen sponsor banner.
 * variant="bar"  (default) — full-bleed 48px strip used between feed
 *                            sections on Today and Track.
 * variant="card" — inset card style for contexts like Learn where the
 *                  surrounding content is rendered as cards.
 */
export default function SponsorBanner({ variant = 'bar' }) {
  const cls = variant === 'card'
    ? 'sponsor-banner sponsor-banner--card'
    : 'sponsor-banner'
  return (
    <aside className={cls} aria-label="Sponsored by Amgen">
      <img src="/images/amgen/amgen-logo-blue.svg" alt="Amgen" className="sponsor-banner__logo" />
    </aside>
  )
}
