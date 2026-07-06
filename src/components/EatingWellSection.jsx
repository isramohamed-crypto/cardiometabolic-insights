import React, { useState } from 'react'
import './EatingWellSection.css'

const imgCasserole  = '/images/ew/casserole.png'
const imgShrimp     = '/images/ew/shrimp.png'
const imgFajita     = '/images/ew/fajita.png'
const imgExpert     = '/images/ew/expert.png'
const imgEatingWell = '/images/ew/logo.png'

const CARDS = [
  {
    id: 'expert',
    frontTitle: 'Get To Know',
    frontName: 'Jessica Ball, M.S., RD',
    image: imgExpert,
    back: "The key is listening to your body and acknowledging how your gut and mind can be connected.",
  },
  {
    id: 'casserole',
    frontTitle: 'Philly Chicken Cheesesteak Casserole',
    image: imgCasserole,
    back: "This Philly chicken cheesesteak casserole tastes just like the classic sandwich version! Swap out the beef for ground chicken and add energy-steadying pasta to bring this one-skillet dinner together.",
  },
  {
    id: 'shrimp',
    frontTitle: 'Spicy Jerk Shrimp',
    image: imgShrimp,
    back: "The pineapple in this recipe makes a naturally sweet sauce that balances the heat of the Jamaican jerk seasoning while the shrimp offers protein and healthy fats.",
  },
  {
    id: 'fajita',
    frontTitle: 'Chicken Fajita Soup',
    image: imgFajita,
    back: "This chicken fajita soup combines the vibrant, smoky flavors of traditional fajitas with the warmth of a soup. This versatile dish is perfect for a cozy, protein-packed dinner.",
  },
]

function FlipCard({ card }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      className={`ew-card${flipped ? ' ew-card--flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      aria-label={flipped ? 'Flip back' : `Flip to reveal — ${card.frontTitle}`}
    >
      <div className="ew-card__inner">
        {/* Front */}
        <div className="ew-card__front">
          <div className="ew-card__front-body">
            {card.frontName && (
              <p className="ew-card__get-to-know">Get To Know</p>
            )}
            <p className="ew-card__front-title">{card.frontName || card.frontTitle}</p>
            <div className="ew-card__flip-hint">
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
                <path d="M1 7C1 3.686 3.686 1 7 1h2M15 7C15 10.314 12.314 13 9 13H7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 1l3 3-3 3M7 13l-3-3 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Flip to reveal</span>
            </div>
          </div>
          <img src={card.image} alt={card.frontTitle} className="ew-card__img" />
        </div>
        {/* Back */}
        <div className="ew-card__back">
          <span className="ew-card__quote-mark">"</span>
          <p className="ew-card__back-text">{card.back}"</p>
        </div>
      </div>
    </button>
  )
}

export default function EatingWellSection() {
  return (
    <section className="ew-section">
      {/* Header */}
      <div className="ew-title-row">
        <img src="/ew-logo.png" alt="EatingWell" className="ew-title-row__logo" />
        <span className="ew-title-row__divider" />
        <span className="ew-title-row__title">Simple &amp; Satisfying Swaps</span>
      </div>

      {/* Card scroll row */}
      <div className="ew-scroll">
        {/* Intro card */}
        <div className="ew-intro-card">
          {/* Video section */}
          <div className="ew-intro-card__video-wrap">
            <video src="/vwh.mp4" className="ew-intro-card__video" playsInline poster="/images/ew/expert.png" />
            <button className="ew-intro-card__play" aria-label="Play video">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 5l9 5-9 5V5z" fill="rgba(255,255,255,0.9)"/>
              </svg>
            </button>
            <img src="/ew-logo.png" alt="EatingWell" className="ew-intro-card__logo" />
          </div>
          {/* Green panel */}
          <div className="ew-intro-card__panel">
            <h3 className="ew-intro-card__title">Dietitian-Approved<br/>Comfort Food</h3>
            <p className="ew-intro-card__sub">Redefine how you approach your familiar favorites for lighter options and less restriction.</p>
          </div>
        </div>

        {CARDS.map(card => (
          <FlipCard key={card.id} card={card} />
        ))}
      </div>
      <p className="ew-hint">Tap a card to flip</p>
    </section>
  )
}
