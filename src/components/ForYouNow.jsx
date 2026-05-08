import React from 'react'

const TIPS = [
  {
    id: 'towels',
    image: '/rs-towels.jpg',
    avatar: '/rs-jen-davison.jpg',
    quote: 'Store towels in well-ventilated areas to prevent mold, a well-known trigger of eczema.',
    author: 'JEN DAVISON, EDITORIAL DIRECTOR, REAL SIMPLE',
  },
  {
    id: 'robe',
    image: '/rs-robe.jpg',
    avatar: '/rs-heather-muir.jpg',
    quote: 'The best robes for eczema are made from breathable, natural materials. Look for loose-fitting styles with flat seams and no tags to prevent friction.',
    author: 'HEATHER MUIR, BEAUTY DIRECTOR, REAL SIMPLE',
  },
  {
    id: 'skincare-org',
    image: '/rs-skincare-org.jpg',
    avatar: '/rs-heather-muir.jpg',
    quote: 'Keep dermatologist-recommended creams or ointments immediately available on the vanity or in a nearby drawer to apply after showering.',
    author: 'HEATHER MUIR, BEAUTY DIRECTOR, REAL SIMPLE',
  },
]

export default function ForYouNow() {
  return (
    <div className="for-you-now">
      <h2 className="for-you-now__title">Quick wins</h2>
      <div className="for-you-now__scroll">
        <article className="rs-cover" aria-label="Real Simple — The Eczema Reset">
          <p className="rs-cover__brand">REAL SIMPLE</p>
          <h3 className="rs-cover__title">The Eczema Reset</h3>
          <p className="rs-cover__sub">Discover calming routines, gentle care, and everyday ways to help soothe the cycle of irritation.</p>
        </article>

        {TIPS.map(t => (
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
                <p className="rs-card__author">— {t.author}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
