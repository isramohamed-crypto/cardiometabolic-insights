import React, { useState } from 'react'

const cards = [
  {
    id: 1,
    frontLabel: 'The silent part',
    question: 'Why do most people with high cholesterol feel completely fine?',
    backLabel: 'No symptoms doesn\u2019t mean no risk',
    answer: 'High LDL cholesterol causes no pain, no fatigue, no visible signs \u2014 which is exactly what makes it dangerous. Plaque builds quietly in arteries for years before a cardiac event. That\u2019s why regular testing matters more than how you feel.',
    source: 'American Heart Association',
    brand: null,
  },
  {
    id: 2,
    frontLabel: 'The bigger picture',
    question: 'If you have high cholesterol, what else are you likely managing?',
    backLabel: 'It rarely travels alone',
    answer: 'Around 70% of people with high cholesterol also have at least one other related condition \u2014 high blood pressure, type 2 diabetes, or weight-related metabolic issues. Managing all of them together, rather than in isolation, produces significantly better outcomes.',
    source: 'CDC, 2023',
    brand: null,
  },
  {
    id: 3,
    frontLabel: 'The number that matters most',
    question: 'Is total cholesterol actually the most important number to watch?',
    backLabel: 'Not exactly \u2014 the ratio tells more',
    answer: 'Total cholesterol alone is a blunt tool. Your LDL-to-HDL ratio and non-HDL cholesterol are more predictive of cardiovascular risk. Ask your doctor for the full picture at your next lipid panel.',
    source: null,
    brand: 'Health.com',
  },
  {
    id: 4,
    frontLabel: 'The decade ahead',
    question: 'How much can lifestyle changes actually move your cholesterol numbers?',
    backLabel: 'More than most people expect',
    answer: 'Diet changes alone can reduce LDL by 20\u201330%. Adding regular moderate exercise can raise HDL by 5\u201310%. Combined with medication if prescribed, these shifts meaningfully lower your 10-year cardiovascular risk score.',
    source: 'Mayo Clinic',
    brand: null,
  },
]

export default function QuickAnswers() {
  const [flipped, setFlipped] = useState({})

  function toggle(id) {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="quick-answers">
      <h2 className="quick-answers__title">What you should know</h2>
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
                {card.brand
                  ? <span className="brand-pill">{card.brand}</span>
                  : <span className="qa-source">{card.source}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
