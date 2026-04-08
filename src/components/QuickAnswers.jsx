import React, { useState } from 'react'

const cards = [
  {
    id: 1,
    question: 'Steroid cream vs. moisturizer — which first?',
    questionSource: 'Verywell Health',
    answer: '<strong>Moisturizer first.</strong> Apply daily to strengthen your barrier. Use steroid cream only on active flares.',
    answerSource: 'Dr. Cynthia Bailey',
  },
  {
    id: 2,
    question: 'Can menopause make eczema worse?',
    questionSource: 'Verywell Health',
    answer: '<strong>Yes.</strong> Declining estrogen thins the skin barrier. HRT may help some — discuss with your derm.',
    answerSource: 'Dr. Angela Lamb',
  },
  {
    id: 3,
    question: 'Is hot water bad for eczema?',
    questionSource: 'AAD',
    answer: '<strong>Yes.</strong> Hot water strips natural oils. Shower lukewarm (under 2 min), then moisturize immediately.',
    answerSource: 'Dr. Peter Lio',
  },
]

export default function QuickAnswers() {
  const [flipped, setFlipped] = useState({})

  function toggle(id) {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="quick-answers">
      <h2 className="quick-answers__title">Did you know?</h2>
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
                <span className="qa-label qa-label--front">Tap to flip</span>
                <p className="qa-question">{card.question}</p>
                <span className="qa-source">{card.questionSource}</span>
              </div>
              {/* Back */}
              <div className="qa-face qa-face--back">
                <span className="qa-label qa-label--back">Answer</span>
                <p
                  className="qa-answer"
                  dangerouslySetInnerHTML={{ __html: card.answer }}
                />
                <span className="qa-source">{card.answerSource}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
