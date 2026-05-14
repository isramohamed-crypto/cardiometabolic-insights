import React from 'react'

/**
 * Sanofi sponsor banner.
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
    <aside className={cls} aria-label="Sponsored by Sanofi">
      <img
        className="sponsor-banner__logo"
        src="/sanofi.jpg"
        alt="Sanofi"
      />
    </aside>
  )
}
