import React, { useState } from 'react'

const OPTIONS = [
  { emoji: '🧠', label: 'I\u2019ve been under a lot of stress lately',                     pct: 38, fill: 'var(--color-teal-light)'  },
  { emoji: '😴', label: 'My sleep has been off',                                            pct: 29, fill: 'var(--color-lime-light)'  },
  { emoji: '🌤️', label: 'Something in my environment changed (weather, products, etc.)',   pct: 21, fill: 'var(--color-warm-light)'  },
  { emoji: '🤷', label: 'I\u2019m not sure \u2014 it feels unpredictable',                 pct: 12, fill: 'var(--color-sage-light)'  },
]

export default function CommunityPoll() {
  const [voted, setVoted] = useState(null) // index of chosen option

  function vote(i) {
    if (voted !== null) return
    setVoted(i)
  }

  return (
    <section className="poll-section">
      <h2 className="poll-section__heading">Community poll</h2>

      <div className="poll-card">
        {/* Header */}
        <div className="poll-card__head">
          <p className="poll-card__tag">Poll &middot; 1,247 patients voted</p>
          <p className="poll-card__q">When your eczema flares, what feels most true for you?</p>
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
          <p className="poll-card__total">1,247 patients voted &middot; Your answer helps others like you</p>
        )}
      </div>
    </section>
  )
}
