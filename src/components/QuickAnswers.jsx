import React, { useState } from 'react'

const cards = [
  {
    id: 1,
    frontLabel: 'Perception vs Reality',
    question: 'Is eczema something people \u201cnotice less than you think\u201d?',
    backLabel: 'Not always \u2014 and that\u2019s what makes it hard',
    answer: 'People with eczema often experience judgment about hygiene, visible reactions from others, and social discomfort or avoidance. This can make flare-ups feel more stressful \u2014 and stress can worsen symptoms.',
    source: 'Patient experience research',
  },
  {
    id: 2,
    frontLabel: 'Relationships + Skin',
    question: 'Why can eczema feel worse in relationships?',
    backLabel: "It\u2019s not just the skin \u2014 it\u2019s how it\u2019s perceived",
    answer: 'Eczema can impact self-esteem, fear of rejection, and comfort with physical closeness. Some people avoid touch or intimacy during flares, even when partners are supportive.',
    source: 'Verywell Mind',
  },
  {
    id: 3,
    frontLabel: 'Relationships + Skin',
    question: 'Should you hide your eczema from a partner?',
    backLabel: 'Talking about it can actually help',
    answer: 'Instead of assuming judgment: share what you\u2019re experiencing, explain what triggers your flares, and set expectations during flare-ups. Open communication often leads to more understanding, not less.',
    source: 'Verywell Mind',
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
