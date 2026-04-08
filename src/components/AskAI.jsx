import React, { useState } from 'react'

const SUGGESTED = [
  'Why is my skin worse when I\'m stressed?',
  'What should I do before my next appointment?',
  'Is Dupixent right for me?',
  'How do I track a flare?',
]

export default function AskAI() {
  const [query, setQuery] = useState('')

  return (
    <div className="ask-ai">
      <div className="ask-ai__inner">
        <div className="ask-ai__input-row">
          <input
            className="ask-ai__input"
            type="text"
            placeholder="Ask anything about your eczema…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="ask-ai__submit" aria-label="Send">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        <p className="ask-ai__label">Common questions</p>
        <ul className="ask-ai__suggestions">
          {SUGGESTED.map((q, i) => (
            <li key={i} className="ask-ai__suggestion" onClick={() => setQuery(q)}>
              <span className="ask-ai__arrow">→</span>
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
