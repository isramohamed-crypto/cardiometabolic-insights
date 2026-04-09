import React, { useState, useRef, useCallback } from 'react'

const cards = [
  {
    step: '1 of 5',
    emoji: '🧠',
    title: 'Stress can trigger and worsen eczema flare-ups',
    body: 'When you experience stress, your body releases cortisol. This hormone increases inflammation and suppresses your immune system — triggering redness, itching, and dry patches.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,#2D3E50,#1a2332)',
    glow: 'radial-gradient(circle at 75% 20%,rgba(139,107,142,.3),transparent 60%)',
  },
  {
    step: '2 of 5',
    emoji: '🔄',
    title: 'The stress–flare cycle feeds itself',
    body: 'Visible eczema symptoms often create more stress, which fuels more flare-ups. Emotional responses like scratching from anxiety make matters worse — a frustrating loop many people experience.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,#3a2a45,#1e1428)',
    glow: 'radial-gradient(circle at 20% 75%,rgba(232,134,106,.2),transparent 55%)',
  },
  {
    step: '3 of 5',
    emoji: '⚡',
    title: 'Common stress triggers to watch for',
    body: 'Work pressure, financial strain, and family conflicts are among the most common stressful life events linked to eczema flares. Recognizing your personal triggers is the first step.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,#0D7C8F,#064a55)',
    glow: 'radial-gradient(circle at 70% 25%,rgba(212,168,83,.25),transparent 55%)',
  },
  {
    step: '4 of 5',
    emoji: '🛡️',
    title: 'Your skin barrier takes the hit',
    body: 'Cortisol weakens the skin barrier that normally keeps irritants out and moisture in. A compromised barrier means your skin is more vulnerable to the triggers that cause flares.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,#4a3a28,#2a1c10)',
    glow: 'radial-gradient(circle at 30% 65%,rgba(123,166,141,.3),transparent 55%)',
  },
  {
    step: '5 of 5',
    emoji: '✨',
    title: 'Managing stress is managing eczema',
    body: 'Experts emphasize that managing stress is key to managing eczema — not just for how you feel, but for what happens to your skin. Breaking the cycle starts with recognizing the connection.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    cta: 'Complete this topic →',
    bg: 'linear-gradient(150deg,#2a1a38,#140e1e)',
    glow: 'radial-gradient(circle at 50% 50%,rgba(91,107,191,.25),transparent 55%)',
  },
]

export default function SwipeLearn({ onLearnClick }) {
  const [idx, setIdx] = useState(0)
  const [complete, setComplete] = useState(false)
  const dragStartX = useRef(null)
  const isDragging = useRef(false)

  function goTo(i) {
    setIdx(Math.max(0, Math.min(i, cards.length - 1)))
  }

  function onDragStart(clientX) {
    dragStartX.current = clientX
    isDragging.current = false
  }

  function onDragEnd(clientX) {
    const diff = dragStartX.current - clientX
    if (Math.abs(diff) > 40) {
      isDragging.current = true
      goTo(idx + (diff > 0 ? 1 : -1))
    }
  }

  // Touch
  function onTouchStart(e) { onDragStart(e.changedTouches[0].clientX) }
  function onTouchEnd(e) { onDragEnd(e.changedTouches[0].clientX) }

  // Mouse / pointer
  function onPointerDown(e) { onDragStart(e.clientX) }
  function onPointerUp(e) { onDragEnd(e.clientX) }

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
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          style={{ cursor: 'grab' }}
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
          <div className="swipe-learn__dots">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`swipe-learn__dot${i === idx ? ' swipe-learn__dot--on' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
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
