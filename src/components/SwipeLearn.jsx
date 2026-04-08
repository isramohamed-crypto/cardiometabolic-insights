import React, { useState, useRef } from 'react'

const cards = [
  {
    step: '1 of 5',
    emoji: '🧠',
    title: 'The stress–flare connection',
    body: "When you're stressed, your body releases cortisol. Within hours, cortisol weakens your skin barrier — the same barrier that keeps irritants out and moisture in.",
    cite: 'Verywell Health · Dermatology research',
    bg: 'linear-gradient(150deg,#2D3E50,#1a2332)',
    glow: 'radial-gradient(circle at 75% 20%,rgba(139,107,142,.3),transparent 60%)',
  },
  {
    step: '2 of 5',
    emoji: '📊',
    title: 'Your data: the 48-hour lag',
    body: 'Your tracking shows a clear signal — Wednesday stress spikes lead to Friday skin flares. That 48-hour delay is typical. Cortisol damage is slow but predictable.',
    cite: 'Based on your Oura + skin score data',
    bg: 'linear-gradient(150deg,#3a2a45,#1e1428)',
    glow: 'radial-gradient(circle at 20% 75%,rgba(232,134,106,.2),transparent 55%)',
  },
  {
    step: '3 of 5',
    emoji: '🔬',
    title: 'What cortisol does to your skin',
    body: 'Cortisol degrades the lipid layer that holds your skin cells together. It also suppresses the immune repair that happens during sleep — a double hit on flare nights.',
    cite: 'Verywell Health · Clinical dermatology',
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)',
    glow: 'radial-gradient(circle at 70% 25%,rgba(212,168,83,.25),transparent 55%)',
  },
  {
    step: '4 of 5',
    emoji: '🌬️',
    title: 'The 3-minute reset',
    body: 'Slow diaphragmatic breathing activates your parasympathetic nervous system. Just 3 minutes can measurably reduce cortisol. Your skin barrier starts recovering.',
    cite: 'Verywell Mind · Clinical evidence',
    bg: 'linear-gradient(150deg,#4a3a28,#2a1c10)',
    glow: 'radial-gradient(circle at 30% 65%,rgba(123,166,141,.3),transparent 55%)',
  },
  {
    step: '5 of 5',
    emoji: '✨',
    title: 'Your plan for tonight',
    body: 'Your Oura flagged elevated stress. Break the cycle: breathing exercise before bed, heavy moisturizer on hands + cotton gloves, humidifier on.',
    cite: null,
    cta: 'Complete this topic →',
    bg: 'linear-gradient(150deg,#2a1a38,#140e1e)',
    glow: 'radial-gradient(circle at 50% 50%,rgba(91,107,191,.25),transparent 55%)',
  },
]

export default function SwipeLearn({ onLearnClick }) {
  const [idx, setIdx] = useState(0)
  const [complete, setComplete] = useState(false)
  const touchStartX = useRef(null)

  function goTo(i) {
    setIdx(Math.max(0, Math.min(i, cards.length - 1)))
  }

  function onTouchStart(e) {
    touchStartX.current = e.changedTouches[0].screenX
  }

  function onTouchEnd(e) {
    const diff = touchStartX.current - e.changedTouches[0].screenX
    if (Math.abs(diff) > 50) goTo(idx + (diff > 0 ? 1 : -1))
  }

  const card = cards[idx]

  return (
    <>
      <section className="swipe-learn">
        <div className="swipe-learn__head">
          <h2 className="swipe-learn__title">Stress + Skin</h2>
          <a
            href="#"
            className="swipe-learn__link"
            onClick={e => { e.preventDefault(); onLearnClick && onLearnClick() }}
          >Full Journey</a>
        </div>

        <div
          className="swipe-learn__wrap"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="swipe-learn__card"
            style={{ background: card.bg }}
          >
            <div className="swipe-learn__glow" style={{ background: card.glow }} />
            <div className="swipe-learn__content">
              <p className="swipe-learn__step">{card.step}</p>
              <div className="swipe-learn__emoji">{card.emoji}</div>
              <h2 className="swipe-learn__heading">{card.title}</h2>
              <p className="swipe-learn__body">{card.body}</p>
              {card.cite && <p className="swipe-learn__cite">{card.cite}</p>}
              {card.cta && (
                <div
                  className="swipe-learn__cta"
                  onClick={() => setComplete(true)}
                >
                  {card.cta}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="swipe-learn__controls">
          <button
            className={`swipe-learn__btn${idx === 0 ? ' swipe-learn__btn--off' : ''}`}
            onClick={() => goTo(idx - 1)}
          >← Back</button>
          <div className="swipe-learn__dots">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`swipe-learn__dot${i === idx ? ' swipe-learn__dot--on' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            className={`swipe-learn__btn${idx === cards.length - 1 ? ' swipe-learn__btn--off' : ''}`}
            onClick={() => goTo(idx + 1)}
          >Next →</button>
        </div>
      </section>

      {/* Module complete overlay */}
      {complete && (
        <div className="sl-complete-overlay" onClick={e => e.stopPropagation()}>
          <div className="sl-complete-sheet">
            <div className="sl-complete-confetti">🎉</div>
            <h2 className="sl-complete-heading">Topic complete!</h2>
            <p className="sl-complete-sub">
              You learned how stress affects your skin barrier — and what to do tonight.
            </p>

            <p className="sl-complete-up-next-label">UP NEXT</p>
            <div className="sl-complete-next-card">
              <div className="sl-complete-next-emoji">🧩</div>
              <h3 className="sl-complete-next-title">Quick quiz: Cortisol &amp; skin</h3>
              <p className="sl-complete-next-desc">Test what you just learned — 3 quick questions</p>
            </div>

            <button
              className="sl-complete-back"
              onClick={() => setComplete(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
