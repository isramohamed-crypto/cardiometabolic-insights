import React, { useState } from 'react'

const cards = [
  {
    id: 1,
    frontLabel: 'Myth vs Fact',
    question: 'Does stress actually cause eczema flares?',
    backLabel: 'The Evidence',
    answer: 'Yes — cortisol disrupts your skin barrier within hours of a stress event. Managing stress is managing your skin.',
    source: 'Verywell Mind',
  },
  {
    id: 2,
    frontLabel: 'Hormones + Skin',
    question: 'Why did my eczema come back in my 50s?',
    backLabel: "It's Common",
    answer: 'Hormonal shifts during menopause weaken the skin barrier. Adult-onset AD affects ~10% of women over 50.',
    source: 'Verywell Health',
  },
  {
    id: 3,
    frontLabel: 'Environment',
    question: 'Is my home making my eczema worse?',
    backLabel: 'Possibly',
    answer: "Low humidity, hard water, and certain detergents are hidden triggers. We'll cover this in your Home focus week.",
    source: 'Health.com',
  },
]

export default function QuickAnswers() {
  const [flipped, setFlipped] = useState({})

  function toggle(id) {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="quick-answers">
      <h2 className="quick-answers__title">Daily tips</h2>
      <div className="qa-scroll">
        {cards.map(card => (
          <div
            key={card.id}
            className="qa-card"
            onClick={() => toggle(card.id)}
          >
            <div className={`qa-card__inner${flipped[card.id] ? ' qa-card__inner--flipped' : ''}`}>
              {/* Front */}
              <div className="qa-face qa-face--front">
                <span className="qa-label qa-label--front">{card.frontLabel}</span>
                <p className="qa-question">{card.question}</p>
                <span className="qa-cta">Tap to reveal →</span>
              </div>
              {/* Back */}
              <div className="qa-face qa-face--back">
                <span className="qa-label qa-label--back">{card.backLabel}</span>
                <p className="qa-answer">{card.answer}</p>
                <span className="qa-source">{card.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
