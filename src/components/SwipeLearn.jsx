import React, { useState, useRef, useCallback } from 'react'

const cards = [
  {
    step: '1 of 5',
    emoji: '🧠',
    title: 'Stress can trigger and worsen eczema flare-ups',
    body: 'When you experience stress, your body releases cortisol. This hormone increases inflammation and suppresses your immune system — triggering redness, itching, and dry patches.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,rgba(45,62,80,0.68),rgba(26,35,50,0.78)),url(/eczema-female-face.jpg) center/cover no-repeat',
    glow: 'radial-gradient(circle at 75% 20%,rgba(139,107,142,.3),transparent 60%)',
  },
  {
    step: '2 of 5',
    emoji: '🔄',
    title: 'The stress–flare cycle feeds itself',
    body: 'Visible eczema symptoms often create more stress, which fuels more flare-ups. Emotional responses like scratching from anxiety make matters worse — a frustrating loop many people experience.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,rgba(58,42,69,0.68),rgba(30,20,40,0.78)),url(/eczema-female-face.jpg) center/cover no-repeat',
    glow: 'radial-gradient(circle at 20% 75%,rgba(232,134,106,.2),transparent 55%)',
  },
  {
    step: '3 of 5',
    emoji: '⚡',
    title: 'Common stress triggers to watch for',
    body: 'Work pressure, financial strain, and family conflicts are among the most common stressful life events linked to eczema flares. Recognizing your personal triggers is the first step.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,rgba(13,124,143,0.68),rgba(6,74,85,0.78)),url(/eczema-female-face.jpg) center/cover no-repeat',
    glow: 'radial-gradient(circle at 70% 25%,rgba(212,168,83,.25),transparent 55%)',
  },
  {
    step: '4 of 5',
    emoji: '🛡️',
    title: 'Your skin barrier takes the hit',
    body: 'Cortisol weakens the skin barrier that normally keeps irritants out and moisture in. A compromised barrier means your skin is more vulnerable to the triggers that cause flares.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    bg: 'linear-gradient(150deg,rgba(74,58,40,0.68),rgba(42,28,16,0.78)),url(/eczema-female-face.jpg) center/cover no-repeat',
    glow: 'radial-gradient(circle at 30% 65%,rgba(123,166,141,.3),transparent 55%)',
  },
  {
    step: '5 of 5',
    emoji: '✨',
    title: 'Managing stress is managing eczema',
    body: 'Experts emphasize that managing stress is key to managing eczema — not just for how you feel, but for what happens to your skin. Breaking the cycle starts with recognizing the connection.',
    cite: 'Verywell Mind · The Impact of Stress on Eczema',
    cta: 'Keep learning →',
    bg: 'linear-gradient(150deg,rgba(42,26,56,0.68),rgba(20,14,30,0.78)),url(/eczema-female-face.jpg) center/cover no-repeat',
    glow: 'radial-gradient(circle at 50% 50%,rgba(91,107,191,.25),transparent 55%)',
  },
]

export default function SwipeLearn({ onLearnClick, onStartBreathe }) {
  const [idx, setIdx] = useState(0)
  // phase: 'cards' | 'completing' | 'next' | 'completing2' | 'next2'
  const [phase, setPhase] = useState('cards')
  const [showVideo, setShowVideo] = useState(false)
  const [videoWatched, setVideoWatched] = useState(false)
  const [showVideo2, setShowVideo2] = useState(false)
  const [video2Watched, setVideo2Watched] = useState(false)
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

        {phase === 'next2' ? (
          <div className="swipe-learn__wrap swipe-learn__wrap--next">
            <div className="swipe-learn__next-card swipe-learn__next-card--placeholder">

              <div className="swipe-learn__next-emoji">💡</div>
              <h2 className="swipe-learn__next-title">How do environmental and lifestyle factors impact skin conditions?</h2>
              <p className="swipe-learn__next-body">
                An expert explains how stress, diet, obesity, sun exposure, and specific nutritional choices can worsen or accelerate a range of skin conditions.
              </p>
              <button className="swipe-learn__next-cta" onClick={() => setShowVideo2(true)}>
                {video2Watched ? 'Keep learning →' : 'Start now →'}
              </button>
              <p className="swipe-learn__next-src">Verywell Health · Ask an Expert Series</p>
            </div>
          </div>
        ) : phase === 'completing2' ? (
          <div className="swipe-learn__wrap">
            <div className="swipe-learn__card" style={{ background: 'linear-gradient(150deg,#1a2e3a,#0d1c26)' }}>
              <div className="swipe-learn__complete-overlay">
                <div className="swipe-learn__complete-check">✓</div>
                <p className="swipe-learn__complete-label">Activity complete</p>
              </div>
            </div>
          </div>
        ) : phase === 'next' ? (
          <div className="swipe-learn__wrap swipe-learn__wrap--next">
            <div className="swipe-learn__next-card">

              <div className="swipe-learn__next-emoji">🫁</div>
              <h2 className="swipe-learn__next-title">3-minute breathing reset</h2>
              <p className="swipe-learn__next-body">
                Slow breathing measurably lowers cortisol. Just 3 minutes and your skin barrier starts recovering.
              </p>
              <button className="swipe-learn__next-cta" onClick={() => {
                if (videoWatched) {
                  setPhase('completing2')
                  setTimeout(() => setPhase('next2'), 1800)
                } else {
                  setShowVideo(true)
                }
              }}>
                {videoWatched ? 'Keep learning →' : 'Start now →'}
              </button>
              <p className="swipe-learn__next-src">Verywell Mind · Clinical evidence</p>
            </div>
          </div>
        ) : (
          <div
            className="swipe-learn__wrap"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            style={{ cursor: 'grab' }}
          >
            <div
              className={`swipe-learn__card${phase === 'completing' ? ' swipe-learn__card--completing' : ''}`}
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
                    onClick={() => {
                      setPhase('completing')
                      setTimeout(() => setPhase('next'), 1800)
                    }}
                  >
                    {card.cta}
                  </div>
                )}
              </div>
              {phase === 'completing' && (
                <div className="swipe-learn__complete-overlay">
                  <div className="swipe-learn__complete-check">✓</div>
                  <p className="swipe-learn__complete-label">Activity complete</p>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'cards' && (
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
        )}
      </section>

      {showVideo && (
        <div className="video-overlay" onClick={() => { setShowVideo(false); setVideoWatched(true) }}>
          <button className="video-overlay__close" onClick={() => { setShowVideo(false); setVideoWatched(true) }}>✕</button>
          <img
            className="video-overlay__img"
            src="/video-placeholder.png"
            alt="3-Minute Video Meditation"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {showVideo2 && (
        <div className="video-overlay" onClick={() => { setShowVideo2(false); setVideo2Watched(true) }}>
          <button className="video-overlay__close" onClick={() => { setShowVideo2(false); setVideo2Watched(true) }}>✕</button>
          <img
            className="video-overlay__img"
            src="/video-placeholder-2.png"
            alt="Ask an Expert: Environmental & Lifestyle Factors"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
