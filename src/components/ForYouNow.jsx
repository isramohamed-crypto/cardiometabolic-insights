import React from 'react'

const cards = [
  {
    id: 1,
    bg: 'rgba(123,166,141,0.15)',
    border: 'rgba(123,166,141,0.35)',
    iconBg: '#2ED1CB',
    tagColor: '#3D7A5E',
    tag: 'If stressed → Try this',
    emoji: '🌬️',
    title: 'Your HRV dropped today — do 3 minutes of breathing before bed',
    body: 'Patients who do the breathing exercise on high-stress days see 40% fewer weekend flares.',
    cta: { label: 'Start now →', bg: '#CBF9FE' },
  },
  {
    id: 2,
    bg: 'rgba(212,168,83,0.12)',
    border: 'rgba(212,168,83,0.35)',
    iconBg: '#2ED1CB',
    tagColor: '#9A6232',
    tag: 'Tonight · Skincare',
    emoji: '🧴',
    title: 'Moisturize within 3 minutes of your shower',
    body: 'On stress days, your barrier is weaker. The 3-minute window matters even more tonight.',
    cta: { label: 'Set reminder', bg: '#CBF9FE' },
  },
  {
    id: 3,
    bg: 'rgba(139,107,142,0.12)',
    border: 'rgba(139,107,142,0.35)',
    iconBg: '#2ED1CB',
    tagColor: '#6B4A7A',
    tag: 'Environment · Tonight',
    emoji: '💨',
    title: 'Indoor humidity is 28% — that\'s too low',
    body: 'Below 40%, your skin loses transepidermal water faster. Turn on the humidifier before bed.',
    cta: null,
  },
]

export default function ForYouNow() {
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
                <button className="fyn-card__cta" style={{ background: card.cta.bg }}>
                  {card.cta.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
