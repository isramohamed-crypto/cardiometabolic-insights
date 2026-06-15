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
      <span className="sponsor-banner__logo" style={{fontWeight:700,fontSize:15,letterSpacing:'0.08em',color:'var(--color-text-primary)'}}>AMGEN</span>
    </aside>
  )
}
