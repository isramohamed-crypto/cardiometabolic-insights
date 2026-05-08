import React from 'react'

const cards = [
  {
    id: 1,
    border: 'rgba(246,76,34,0.25)',
    iconBg: 'var(--color-warm-light)',
    tagColor: 'var(--color-warm)',
    tag: 'TODAY · HOME',
    emoji: '🛏️',
    title: 'Three dust traps in your bedroom (and a 10-minute fix for each)',
    body: 'Dust mites are a top eczema trigger. Quick wins on bedding, blinds, and that one chair you toss laundry on.',
    cta: { label: 'Show me how →', bg: 'var(--color-warm-light)', color: 'var(--color-warm)' },
    src: 'Real Simple',
  },
  {
    id: 2,
    border: 'rgba(46,209,203,0.3)',
    iconBg: 'var(--color-sage-light)',
    tagColor: 'var(--color-sage)',
    tag: 'TONIGHT · DINNER',
    emoji: '🥗',
    title: '15-minute salmon bowl that\'s gentle on flares',
    body: 'Omega-3-rich, low-histamine, no common eczema triggers — pantry-friendly weeknight dinner.',
    cta: { label: 'See the recipe →', bg: 'var(--color-sage-light)', color: 'var(--color-sage)' },
    src: 'EatingWell',
  },
  {
    id: 3,
    border: 'rgba(93,45,230,0.25)',
    iconBg: 'var(--color-teal-light)',
    tagColor: 'var(--color-teal)',
    tag: 'TONIGHT · SKINCARE',
    emoji: '🧴',
    title: 'The 3-minute window after your shower',
    body: 'Locking in moisture while skin is still damp can cut nightly itch. Small habit, outsized payoff.',
    cta: { label: 'Try it tonight →', bg: 'var(--color-teal-light)', color: 'var(--color-teal)' },
    src: 'Verywell Health',
  },
  {
    id: 4,
    border: 'rgba(246,76,34,0.25)',
    iconBg: 'var(--color-coral-light)',
    tagColor: 'var(--color-coral)',
    tag: 'THIS WEEK · ALLERGY',
    emoji: '🌼',
    title: 'Pollen\'s high this week — your 5-minute walk-in routine',
    body: 'Shoes off, change clothes, rinse face. One small ritual, fewer reactive flares when counts spike.',
    cta: { label: 'Get the routine →', bg: 'var(--color-coral-light)', color: 'var(--color-coral)' },
    src: 'Health',
  },
  {
    id: 5,
    border: 'rgba(28,95,241,0.2)',
    iconBg: 'var(--color-blue-light)',
    tagColor: 'var(--color-blue)',
    tag: 'TONIGHT · SLEEP',
    emoji: '🌙',
    title: 'Cool sheets, dim lights, fewer scratch nights',
    body: 'A 65–68°F room and breathable bedding can reduce middle-of-the-night itching. One adjustment tonight.',
    cta: { label: 'Build your routine →', bg: 'var(--color-blue-light)', color: 'var(--color-blue)' },
    src: 'Verywell Mind',
  },
  {
    id: 6,
    border: 'rgba(253,218,60,0.4)',
    iconBg: 'var(--color-lime-light)',
    tagColor: '#B08A00',
    tag: 'THIS WEEK · LAUNDRY',
    emoji: '🧺',
    title: 'The detergent swap that calms a lot of flares',
    body: 'Fragrance and dyes are quiet repeat offenders. Two minutes in the laundry aisle can change your week.',
    cta: { label: 'Read the swap →', bg: 'var(--color-lime-light)', color: '#B08A00' },
    src: 'The Spruce',
  },
]

export default function ForYouNow() {
  return (
    <div className="for-you-now">
      <h2 className="for-you-now__title">Quick wins</h2>
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
                >
                  {card.cta.label}
                </button>
              )}
              {card.logo ? (
                <img src={card.logo} alt={card.src} className="fyn-card__logo" />
              ) : card.src && (
                <p className="fyn-card__src">{card.src}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
