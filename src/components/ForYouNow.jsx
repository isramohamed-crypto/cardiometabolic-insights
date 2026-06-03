import React from 'react'
import MarkAsTried from './MarkAsTried'

const TIPS = [
  {
    id: 'fiber',
    image: '/rs-towels.jpg',
    avatar: '/rs-jen-davison.jpg',
    quote: 'Eating 5–10 grams of soluble fiber daily — from oats, beans, or flaxseed — can meaningfully lower LDL cholesterol over time.',
    author: 'SARAH KOSZYK, RDN, HEALTH.COM',
  },
  {
    id: 'movement',
    image: '/rs-robe.jpg',
    avatar: '/rs-heather-muir.jpg',
    quote: 'Even 30 minutes of moderate walking five days a week can raise HDL (good) cholesterol and reduce cardiovascular risk — no gym required.',
    author: 'JESSICA MIGALA, HEALTH.COM',
  },
  {
    /* Blank card — placeholder for a sponsored slot. Fill in image,
       avatar, quote, author later. The `placeholder: true` flag lets
       the render skip image + avatar + author markup. */
    id: 'sponsored',
    placeholder: true,
    quote: 'Sponsored Ad',
  },
  {
    id: 'stress',
    image: '/rs-skincare-org.jpg',
    avatar: '/rs-heather-muir.jpg',
    quote: 'Chronic stress raises cortisol, which can increase LDL and triglycerides. Managing stress isn\'t just good for your mind — it directly supports heart health.',
    author: 'JESSICA MIGALA, HEALTH.COM',
  },
]

export default function ForYouNow() {
  return (
    <div className="for-you-now">
      <h2 className="for-you-now__title">Tips for you</h2>
      <div className="for-you-now__scroll">
        <article className="rs-cover" aria-label="Health.com — Know Your Numbers">
          <p className="rs-cover__brand">HEALTH.COM</p>
          <h3 className="rs-cover__title">Know Your Numbers</h3>
          <p className="rs-cover__sub">Practical steps to understand your cholesterol, reduce your risk, and take control of your heart health.</p>
        </article>

        {TIPS.map(t => {
          if (t.placeholder) {
            // Sponsored slot — keep the exact card dimensions but show
            // a centered Sanofi logo instead of image + quote + author.
            return (
              <article
                key={t.id}
                className="rs-card rs-card--sponsored"
                aria-label="Sponsored by Sanofi"
              >
                <img
                  className="rs-card__sponsor-logo"
                  src="/sanofi.jpg"
                  alt="Sanofi"
                />
              </article>
            )
          }
          return (
            <article key={t.id} className="rs-card">
              <div
                className="rs-card__image"
                style={{ backgroundImage: `url(${t.image})` }}
                role="img"
                aria-label={t.quote}
              />
              <div className="rs-card__quote-block">
                <img className="rs-card__avatar" src={t.avatar} alt="" />
                <div className="rs-card__quote-text">
                  <p className="rs-card__quote">&ldquo;{t.quote}&rdquo;</p>
                  {t.author && (
                    <p className="rs-card__author">— {t.author}</p>
                  )}
                </div>
              </div>
              <div className="rs-card__try-row">
                <MarkAsTried
                  id={`quick-wins:${t.id}`}
                  title={t.quote}
                  source="Tips for you"
                  className="try-btn--overlay"
                />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
