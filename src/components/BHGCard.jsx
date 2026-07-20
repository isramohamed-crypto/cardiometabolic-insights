import React from 'react'

/**
 * Better Homes & Gardens "Savor the Season" holiday takeover.
 * Same shell as AutumnTravelCard but with a single "Read now" CTA
 * (no persona swap). Background hero photo is /bhg-hero.jpg with
 * the standard T+L overlay gradient on top.
 */

export default function BHGCard() {
  return (
    <article className="tl-card tl-card--bhg">
      <div className="tl-card__overlay" aria-hidden="true" />
      <div className="tl-card__content">
        <h2 className="tl-card__brand bhg-card__brand">
          Better Homes &amp; Gardens
        </h2>
        <div className="tl-card__bottom">
          <h3 className="tl-card__title bhg-card__title">Savor the season</h3>
          <p className="tl-card__sub">Holiday joy in every moment.</p>
          <div className="tl-card__cta-list">
            <button
              type="button"
              className="tl-card__cta tl-card__cta--evergreen"
            >
              Read now
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
