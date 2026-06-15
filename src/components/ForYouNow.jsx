import React from 'react'
import MarkAsTried from './MarkAsTried'

const TIPS = [
  {
    id: 'fiber',
    gradient: 'linear-gradient(135deg, #0A2463 0%, #1B4FBF 100%)',
    quote: 'Eating 5–10 grams of soluble fiber daily — from oats, beans, or flaxseed — can meaningfully lower LDL cholesterol over time.',
    author: 'SARAH KOSZYK, RDN, HEALTH.COM',
  },
  {
    id: 'movement',
    gradient: 'linear-gradient(135deg, #0D5C63 0%, #0A9396 100%)',
    quote: 'Even 30 minutes of moderate walking five days a week can raise HDL (good) cholesterol and reduce cardiovascular risk — no gym required.',
    author: 'JESSICA MIGALA, HEALTH.COM',
  },
  {
    id: 'sponsored',
    placeholder: true,
    quote: 'Sponsored Ad',
  },
  {
    id: 'stress',
    gradient: 'linear-gradient(135deg, #2D1B69 0%, #5C3D8F 100%)',
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
            // a centered Amgen logo instead of image + quote + author.
            return (
              <article
                key={t.id}
                className="rs-card rs-card--sponsored"
                aria-label="Sponsored by Amgen"
              >
                <span style={{fontWeight:700,fontSize:15,letterSpacing:'0.08em',color:'var(--color-text-primary)'}}>AMGEN</span>
              </article>
            )
          }
          return (
            <article key={t.id} className="rs-card">
              <div
                className="rs-card__image"
                style={{ background: t.gradient }}
                role="img"
                aria-label={t.quote}
              />
              <div className="rs-card__quote-block">
                <div className="rs-card__avatar" style={{ background: 'var(--color-teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💊</div>
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
