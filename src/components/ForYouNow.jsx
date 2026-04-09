import React from 'react'

const cards = [
  {
    id: 1,
    border: 'rgba(93,45,230,0.25)',
    iconBg: 'var(--color-teal-light)',
    tagColor: 'var(--color-teal)',
    tag: 'IF STRESSED → TRY THIS',
    emoji: '🫁',
    title: 'Your HRV dropped 15% today — do 3 minutes of box breathing before bed',
    body: 'On days like this, your skin tends to react within 48 hours. Breathwork tonight can reduce that stress-to-flare cascade.',
    cta: { label: 'Start now →', bg: 'var(--color-teal-light)', color: 'var(--color-teal)' },
    src: 'Verywell Mind',
  },
  {
    id: 2,
    border: 'rgba(46,209,203,0.3)',
    iconBg: 'var(--color-sage-light)',
    tagColor: 'var(--color-sage)',
    tag: 'TONIGHT · SKINCARE',
    emoji: '🧴',
    title: 'Moisturize within 3 minutes of your shower',
    body: 'On stress days, your barrier is weaker. The 3-minute window matters even more tonight.',
    cta: { label: 'Set reminder', bg: 'var(--color-sage-light)', color: 'var(--color-sage)' },
    src: 'Verywell Health',
  },
  {
    id: 3,
    border: 'rgba(253,218,60,0.4)',
    iconBg: 'var(--color-lime-light)',
    tagColor: '#B08A00',
    tag: 'YOUR PATTERN · INSIGHT',
    emoji: '📊',
    title: 'Stressful days showed up on your skin by Friday — 3 weeks in a row',
    body: 'You\'re building real evidence. Bring this to your next derm visit — it helps them understand what\'s driving your flares.',
    cta: { label: 'See your trend →', bg: 'var(--color-lime-light)', color: '#B08A00' },
    src: 'BrightInsight',
  },
  {
    id: 4,
    border: 'rgba(28,95,241,0.2)',
    iconBg: 'var(--color-blue-light)',
    tagColor: 'var(--color-blue)',
    tag: 'FOR YOU · NUTRITION',
    emoji: '🥗',
    title: 'Anti-inflammatory dinner tonight: one-pan salmon with turmeric',
    body: 'Omega-3s and turmeric support skin barrier repair. 25 minutes, minimal cleanup.',
    cta: { label: 'See recipe →', bg: 'var(--color-blue-light)', color: 'var(--color-blue)' },
    src: 'EatingWell',
  },
]

export default function ForYouNow({ onStartBreathe }) {
  return (
    <div className="for-you-now">
      <h2 className="for-you-now__title">Things to try</h2>
      <div className="for-you-now__scroll">
        {cards.map(card => (
          <div
            key={card.id}
            className="for-you-now__card"
            style={{ border: `2px solid ${card.border}` }}
          >
            <div className="fyn-card__icon" style={{ background: card.iconBg }}>
              {card.emoji}
            </div>
            <div className="fyn-card__body">
              <p className="fyn-card__tag" style={{ color: card.tagColor }}>{card.tag}</p>
              <p className="fyn-card__title">{card.title}</p>
              <p className="fyn-card__desc">{card.body}</p>
              {card.cta && (
                <button
                  className="fyn-card__cta"
                  style={{ background: card.cta.bg, color: card.cta.color }}
                  onClick={card.id === 1 ? onStartBreathe : undefined}
                >
                  {card.cta.label}
                </button>
              )}
              {card.src && (
                <p className="fyn-card__src">{card.src}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
