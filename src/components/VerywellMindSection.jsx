import React, { useState } from 'react'
import './VerywellMindSection.css'

const CARDS = [
  {
    id: 'body-scan',
    icon: '🧘',
    frontTitle: 'Body Scan Meditation',
    back: "Spending just 10 minutes scanning from head to toe helps you notice where stress lives in your body — and begin to release it.",
  },
  {
    id: 'breathing',
    icon: '🌬️',
    frontTitle: '4-7-8 Breathing',
    back: "Inhale for 4 counts, hold for 7, exhale for 8. This simple pattern activates your parasympathetic nervous system and lowers blood pressure.",
  },
  {
    id: 'mindful-eating',
    icon: '🍃',
    frontTitle: 'Mindful Eating',
    back: "Slowing down between bites and noticing flavors, textures, and hunger cues can improve digestion and reduce stress-related overeating.",
  },
  {
    id: 'gratitude',
    icon: '✨',
    frontTitle: 'Gratitude Practice',
    back: "Writing down three things you're grateful for each day is linked to lower cortisol levels and better heart rate variability over time.",
  },
]

function FlipCard({ card }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      className={`vm-card${flipped ? ' vm-card--flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      aria-label={flipped ? 'Flip back' : `Flip to reveal — ${card.frontTitle}`}
    >
      <div className="vm-card__inner">
        <div className="vm-card__front">
          <div className="vm-card__icon">{card.icon}</div>
          <p className="vm-card__front-title">{card.frontTitle}</p>
          <div className="vm-card__flip-hint">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
              <path d="M1 7C1 3.686 3.686 1 7 1h2M15 7C15 10.314 12.314 13 9 13H7" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 1l3 3-3 3M7 13l-3-3 3-3" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Flip to reveal</span>
          </div>
        </div>
        <div className="vm-card__back">
          <span className="vm-card__quote-mark">"</span>
          <p className="vm-card__back-text">{card.back}"</p>
        </div>
      </div>
    </button>
  )
}

export default function VerywellMindSection() {
  return (
    <section className="vm-section">
      <div className="vm-title-row">
        <span className="vm-title-row__brand">Verywell Mind</span>
        <span className="vm-title-row__divider" />
        <span className="vm-title-row__title">Embracing Mindfulness</span>
      </div>

      <div className="vm-scroll">
        <div className="vm-intro-card">
          <div className="vm-intro-card__top">
            <span className="vm-intro-card__eyebrow">MIND &amp; BODY</span>
            <h3 className="vm-intro-card__title">Small Moments,<br/>Big Impact</h3>
          </div>
          <div className="vm-intro-card__bottom">
            <p className="vm-intro-card__sub">Mindfulness practices shown to support heart health and stress resilience — one breath at a time.</p>
          </div>
        </div>

        {CARDS.map(card => (
          <FlipCard key={card.id} card={card} />
        ))}
      </div>
      <p className="vm-hint">Tap a card to flip</p>
    </section>
  )
}
