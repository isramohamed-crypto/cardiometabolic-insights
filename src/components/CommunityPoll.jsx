import React, { useState } from 'react'

const OPTIONS = [
  { emoji: '🍽️', label: 'Staying consistent with healthy eating',              pct: 41, fill: 'var(--color-teal-light)'  },
  { emoji: '💊', label: 'Remembering to take medications every day',            pct: 27, fill: 'var(--color-lime-light)'  },
  { emoji: '🧠', label: 'Managing stress without it affecting my health',       pct: 22, fill: 'var(--color-warm-light)'  },
  { emoji: '🩺', label: 'Knowing what to ask my doctor',                        pct: 10, fill: 'var(--color-sage-light)'  },
]

export default function CommunityPoll() {
  const [voted, setVoted] = useState(null) // index of chosen option

  function vote(i) {
    if (voted !== null) return
    setVoted(i)
  }

  return (
    <section className="poll-section">
      <h2 className="poll-section__heading">What people are saying</h2>

      <div className="poll-card">
        {/* Header */}
        <div className="poll-card__head">
          <p className="poll-card__tag">Poll &middot; 2,341 patients voted</p>
          <p className="poll-card__q">When it comes to managing your heart health, what feels hardest right now?</p>
        </div>

        {/* Options */}
        <div className="poll-card__opts">
          {OPTIONS.map((opt, i) => (
            <button
              key={i}
              className={`poll-opt${voted === i ? ' poll-opt--chosen' : ''}${voted !== null ? ' poll-opt--revealed' : ''}`}
              onClick={() => vote(i)}
              disabled={voted !== null}
            >
              {/* Fill bar (shown after vote) */}
              {voted !== null && (
                <span
                  className="poll-opt__fill"
                  style={{ width: `${opt.pct}%`, background: opt.fill }}
                />
              )}
              <span className="poll-opt__emoji">{opt.emoji}</span>
              <span className="poll-opt__label">{opt.label}</span>
              {voted !== null && (
                <span className="poll-opt__pct">{opt.pct}%</span>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        {voted !== null && (
          <p className="poll-card__total">2,341 patients voted &middot; Your answer helps others like you</p>
        )}
      </div>
    </section>
  )
}
