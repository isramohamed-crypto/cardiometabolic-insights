import React, { useState } from 'react'
import './InStyleSection.css'

const ARTICLES = [
  {
    id: 'cool',
    label: 'Staying (and Looking) Cool',
    content: 'Loose-fitting, breathable pants and skirts offer comfort without restriction as temperatures climb. Battle sweat with base layers made of moisture-wicking materials like bamboo and rayon.',
  },
  {
    id: 'comfort',
    label: 'Making Comfort Chic',
    content: 'Looking good starts with feeling good. Oversized silhouettes are in for coziness, and layering pieces can help you feel put together and comfortable in any setting.',
  },
  {
    id: 'closet',
    label: 'Shopping Your Own Closet',
    content: 'Refreshing your style doesn’t mean a whole new wardrobe! Look at your closet with fresh eyes for old pieces that are trending again and try pairing unexpected textures and proportions.',
  },
]

export default function InStyleSection() {
  const [openId, setOpenId] = useState(null)

  return (
    <section className="is-section">
      <div className="is-header">
        <img src="/images/instyle/logo-black.svg" alt="InStyle" className="is-header__logo" />
        <span className="is-header__divider" />
        <span className="is-header__title">Wardrobe Upgrades</span>
      </div>

      <div className="is-card">
        <video
          className="is-card__photo"
          src="/instyle-wardrobe.mp4"
          poster="/images/instyle/photo.jpg"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
        <div className="is-card__scrim" />

        <div className="is-card__content">
          <p className="is-card__logo">InStyle</p>

          <p className="is-card__eyebrow">Upgrade your style with</p>
          <h2 className="is-card__headline">Confidence</h2>
          <p className="is-card__body">
            Rejuvenating your existing closet can bring fun and freshness back into your look.
          </p>

          <div className="is-card__articles">
            {ARTICLES.map(a => {
              const isOpen = openId === a.id
              return (
                <div key={a.id} className="is-card__article-wrap">
                  <button
                    type="button"
                    className={`is-card__article${isOpen ? ' is-card__article--open' : ''}`}
                    aria-expanded={isOpen}
                    onClick={() => a.content && setOpenId(isOpen ? null : a.id)}
                  >
                    <span>{a.label}</span>
                    {a.content && (
                      <span className="is-card__article-icon" aria-hidden="true">+</span>
                    )}
                  </button>

                  {a.content && (
                    <div className={`is-card__panel${isOpen ? ' is-card__panel--open' : ''}`}>
                      <div className="is-card__panel-inner">
                        <div className="is-card__panel-box">
                          <button
                            type="button"
                            className="is-card__panel-close"
                            aria-label="Close"
                            onClick={() => setOpenId(null)}
                          >
                            ×
                          </button>
                          <p className="is-card__panel-text">{a.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
