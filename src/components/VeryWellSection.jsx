import React from 'react'
import './VeryWellSection.css'

const CARDS = [
  {
    id: 'fresh-gratitude',
    icon: '/images/vw/icon-start-fresh.png',
    width: 380,
    tips: [
      {
        id: 'fresh',
        heading: 'Start Fresh.',
        body: 'Stress and worry are natural parts of life, but the first step toward being more mindful each day is simply letting go of the unrealistic expectations you\'ve placed upon yourself or perceived from others. Consider today the first day of your new mindset.',
      },
      {
        id: 'gratitude',
        heading: 'Begin With Gratitude.',
        body: 'Take 5–10 minutes each morning to think about what\'s happened and what\'s to come. How did you sleep? Did you have any dreams? Do you have any intentions or goals you\'d like to bring into your day? Consider writing them down on your phone or in a journal.',
      },
    ],
  },
  {
    id: 'grace',
    icon: '/images/vw/icon-grace.png',
    width: 260,
    tips: [
      {
        id: 'grace',
        heading: 'Give Yourself Grace.',
        body: 'Stumbles and mistakes are unavoidable, and though they may seem disastrous in the moment, tomorrow is a new day. If you\'re juggling too much or find yourself unable to make ends meet, give yourself permission to let something go. You\'re doing the best you can—the right priorities will sort themselves out in time.',
      },
    ],
  },
  {
    id: 'reflection',
    icon: '/images/vw/icon-reflection.png',
    width: 300,
    tips: [
      {
        id: 'reflection',
        heading: 'End With Reflection.',
        body: 'No matter how your day went, there\'s always something to think about before your head hits the pillow. What made you smile today, and what might you want to do differently tomorrow? Sometimes, a little focused reflection can highlight what really matters most.',
      },
    ],
  },
]

export default function VeryWellSection() {
  return (
    <section className="vw-section">
      <div className="vw-header">
        <img src="/images/vw/vwm-logo-color.svg" alt="Verywell Mind" className="vw-header__logo" />
        <span className="vw-header__divider" />
        <span className="vw-header__title">Embracing Mindfulness</span>
      </div>

      <div className="vw-scroll">

        {/* Hero card */}
        <div className="vw-hero-card">
          <img src="/images/vw/vwm-logo-white.svg" alt="Verywell Mind" className="vw-hero-card__logo" />
          <img src="/images/vw/icon-reflection.png" alt="" className="vw-hero-card__illustration" />
          <h2 className="vw-hero-card__title">Your Mindful<br />Habits Roadmap</h2>
        </div>

        {/* Hero illustration */}
        <div className="vw-hero-image">
          <p className="vw-hero-image__tagline">Every year comes with a new set of challenges and goals. Put your mental health first with these low-maintenance daily habits.</p>
          <img src="/images/vw/hero-couple.png" alt="" className="vw-hero-image__img" />
        </div>

        {/* Tips */}
        {CARDS.map(card => (
          <div key={card.id} className="vw-card" style={{ width: card.width }}>
            {card.icon && (
              <img
                src={card.icon}
                alt=""
                className={`vw-card__icon${card.id === 'reflection' ? ' vw-card__icon--large' : ''}`}
              />
            )}
            {card.tips.map(tip => (
              <div key={tip.id} className="vw-card__tip">
                <h3 className="vw-card__heading">{tip.heading}</h3>
                <p className="vw-card__body">{tip.body}</p>
              </div>
            ))}
          </div>
        ))}

      </div>
    </section>
  )
}
