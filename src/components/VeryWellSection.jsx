import React from 'react'
import './VeryWellSection.css'

const TIPS = [
  {
    id: 'fresh',
    icon: '/images/vw/icon-start-fresh.png',
    heading: 'Start Fresh.',
    body: 'Stress and worry are natural parts of life, but the first step toward being more mindful each day is simply letting go of unrealistic expectations. Consider today the first day of your new mindset.',
  },
  {
    id: 'gratitude',
    icon: '/images/vw/icon-start-fresh.png',
    heading: 'Begin With Gratitude.',
    body: "Take 5–10 minutes each morning to think about what's happened and what's to come. How did you sleep? Any intentions for today? Consider writing them down in a journal.",
  },
  {
    id: 'grace',
    icon: '/images/vw/icon-grace.png',
    heading: 'Give Yourself Grace.',
    body: "Stumbles are unavoidable. If you're juggling too much, give yourself permission to let something go. You're doing the best you can — the right priorities will sort themselves out.",
  },
  {
    id: 'reflection',
    icon: '/images/vw/icon-reflection.png',
    heading: 'End With Reflection.',
    body: 'Before you sleep, ask yourself: what made you smile today, and what might you do differently tomorrow? A little focused reflection can highlight what really matters most.',
  },
]

export default function VeryWellSection() {
  return (
    <section className="vw-section">
      {/* Header row */}
      <div className="vw-header">
        <img src="/images/vw/vwm-logo-color.svg" alt="Verywell Mind" className="vw-header__logo" />
        <span className="vw-header__divider" />
        <span className="vw-header__title">Embracing Mindfulness</span>
      </div>

      {/* Horizontal card scroll */}
      <div className="vw-scroll">

        {/* Hero card */}
        <div className="vw-card vw-card--hero">
          <img src="/images/vw/vwm-logo-white.svg" alt="Verywell Mind" className="vw-card--hero__logo" />
          <img src="/images/vw/icon-reflection.png" alt="" className="vw-card--hero__illustration" />
          <h2 className="vw-card--hero__title">Your Mindful<br />Habits Roadmap</h2>
          <p className="vw-card--hero__sub">Low-maintenance daily habits to put your mental health first.</p>
        </div>

        {/* Tip cards */}
        {TIPS.map(tip => (
          <div key={tip.id} className="vw-card vw-card--tip">
            <img src={tip.icon} alt="" className="vw-card--tip__icon" />
            <h3 className="vw-card--tip__heading">{tip.heading}</h3>
            <p className="vw-card--tip__body">{tip.body}</p>
          </div>
        ))}

      </div>

      <p className="vw-hint">Swipe to read more →</p>
    </section>
  )
}
