import React, { useState } from 'react'

const questions = [
  {
    q: 'How is your skin today?',
    sub: 'Overall condition across your body.',
    opts: [
      { e: '✨', l: 'Clear' },
      { e: '🙂', l: 'Mild' },
      { e: '😐', l: 'Moderate' },
      { e: '😣', l: 'Bad' },
      { e: '🔥', l: 'Flaring' },
    ],
  },
  {
    q: 'Biggest trigger today?',
    sub: 'What do you think is driving your skin today?',
    opts: [
      { e: '😰', l: 'Stress' },
      { e: '🌤️', l: 'Weather' },
      { e: '🍽️', l: 'Food' },
      { e: '🧴', l: 'Product' },
      { e: '😴', l: 'Sleep' },
      { e: '🚫', l: 'None' },
    ],
  },
]

const TOTAL_STEPS = questions.length + 1 // step 0 = oura data

export default function DailyCheckin() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState(null)

  function openSheet() { setStep(0); setSelected(null); setOpen(true) }
  function closeSheet() { setOpen(false) }

  function handleSelect(idx) {
    setSelected(idx)
    setTimeout(() => {
      setSelected(null)
      setStep(s => s + 1)
    }, 320)
  }

  const progressPct = step === 0 ? 20 : ((step + 1) / (TOTAL_STEPS + 1)) * 100

  return (
    <>
      {/* Banner */}
      <div className="daily-checkin" onClick={openSheet}>
        <div className="daily-checkin__icon">📋</div>
        <div className="daily-checkin__body">
          <p className="daily-checkin__title">Daily check-in</p>
          <p className="daily-checkin__sub">Log skin, stress &amp; triggers · Oura auto-synced</p>
        </div>
        <div className="daily-checkin__arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="ci-overlay" onClick={e => e.target === e.currentTarget && closeSheet()}>
          <div className="ci-sheet">

            {/* Step 0: Oura auto-synced data */}
            {step === 0 && (
              <>
                <div className="ci-header">
                  <span className="ci-label">Auto-synced data</span>
                  <button className="ci-close" onClick={closeSheet}>✕</button>
                </div>
                <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>
                <h2 className="ci-title">We pulled today's data</h2>
                <p className="ci-sub">From your Oura Ring. Tap continue to add your skin score.</p>
                <div className="ci-data-row">
                  <div className="ci-data-icon" style={{ background: 'var(--color-sage-light)' }}>💍</div>
                  <div className="ci-data-body">
                    <p className="ci-data-label">Sleep quality</p>
                    <p className="ci-data-value">72 / 100</p>
                    <p className="ci-data-src">6h 23m · 2 wake-ups · Synced 7:14am</p>
                  </div>
                </div>
                <div className="ci-data-row">
                  <div className="ci-data-icon" style={{ background: 'var(--color-teal-light)' }}>💍</div>
                  <div className="ci-data-body">
                    <p className="ci-data-label">Stress indicator</p>
                    <p className="ci-data-value">Medium-High</p>
                    <p className="ci-data-src">HRV dropped 18% vs. baseline · Continuous</p>
                  </div>
                </div>
                <button className="ci-btn" onClick={() => setStep(1)}>Continue → Add skin score</button>
              </>
            )}

            {/* Steps 1–2: Questions */}
            {step >= 1 && step <= questions.length && (() => {
              const q = questions[step - 1]
              const cur = step + 1
              return (
                <>
                  <div className="ci-header">
                    <span className="ci-label">{cur} of {TOTAL_STEPS + 1} · Oura synced</span>
                    <button className="ci-close" onClick={closeSheet}>✕</button>
                  </div>
                  <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>
                  <h2 className="ci-title">{q.q}</h2>
                  <p className="ci-sub">{q.sub}</p>
                  <div className={`ci-opts${q.opts.length > 4 ? ' ci-opts--wide' : ''}`}>
                    {q.opts.map((opt, i) => (
                      <button
                        key={i}
                        className={`ci-opt${q.opts.length > 4 ? ' ci-opt--horiz' : ''}${selected === i ? ' ci-opt--sel' : ''}`}
                        onClick={() => handleSelect(i)}
                      >
                        <span className="ci-opt__emoji">{opt.e}</span>
                        <span className="ci-opt__label">{opt.l}</span>
                      </button>
                    ))}
                  </div>
                </>
              )
            })()}

            {/* Done screen */}
            {step > questions.length && (
              <div className="ci-done">
                <div className="ci-done__emoji">🎉</div>
                <h3 className="ci-done__title">Check-in complete!</h3>
                <p className="ci-done__sub">Sleep and stress auto-synced from Oura. Your skin score and trigger logged.</p>
                <div className="ci-insight">
                  <div className="ci-insight__tag"><span className="ci-insight__dot" />Insight · Based on your check-in</div>
                  <h4 className="ci-insight__heading">⚠️ Stress was your #1 trigger 3 of the last 5 days</h4>
                  <p className="ci-insight__body">Your HRV has been below baseline since Tuesday. Combined with today's skin score, your flare risk is elevated in the next 48 hours. Tonight's breathing exercise and moisturizing routine matter more than usual.</p>
                </div>
                <button className="ci-btn" onClick={closeSheet}>Got it — back to feed</button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}
