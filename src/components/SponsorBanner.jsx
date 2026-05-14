import React from 'react'

/**
 * Full-width Sanofi sponsor banner.
 * Sits inline in the Today feed at the slot previously held by the
 * Weekly Health Pulse card. ~48px tall, full-bleed across .main,
 * with the logo centered and an "Advertisement" eyebrow above for
 * disclosure (kept tiny so the slot stays close to the requested
 * 48px height).
 */
export default function SponsorBanner() {
  return (
    <aside className="sponsor-banner" aria-label="Sponsored by Sanofi">
      <img
        className="sponsor-banner__logo"
        src="/sanofi.jpg"
        alt="Sanofi"
      />
    </aside>
  )
}
