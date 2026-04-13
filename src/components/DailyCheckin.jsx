import React, { useState } from 'react'

const QUESTIONS = [
  {
    step: '2 of 4',
    q: 'How\u2019s your skin today?',
    sub: 'Overall condition across your body.',
    multi: false,
    opts: [
      { e: '\u2728', l: 'Clear' },
      { e: '\uD83D\uDE42', l: 'Mild \u2014 barely noticeable' },
      { e: '\uD83D\uDE10', l: 'Moderate \u2014 it\u2019s there' },
      { e: '\uD83D\uDE23', l: 'Bad \u2014 hard to ignore' },
      { e: '\uD83D\uDD25', l: 'Flaring \u2014 worst it gets' },
    ],
  },
  {
    step: '3 of 4',
    q: 'How much did itch bother you?',
    sub: 'Overnight or today \u2014 whichever was worse.',
    multi: false,
    opts: [
      { e: '\uD83D\uDE0C', l: 'Not at all' },
      { e: '\uD83E\uDD0F', l: 'A little \u2014 noticed it' },
      { e: '\uD83D\uDE2C', l: 'Moderate \u2014 distracting' },
      { e: '\uD83D\uDE16', l: 'A lot \u2014 hard to focus' },
      { e: '\uD83D\uDE2B', l: 'Unbearable' },
    ],
  },
  {
    step: '4 of 4',
    q: 'What\u2019s been going on today?',
    sub: 'Just tell us about your day. Select all that apply \u2014 we\u2019ll help you spot patterns over time.',
    multi: true,
    opts: [
      { e: '\uD83D\uDE30', l: 'Stressful day' },
      { e: '\uD83D\uDE34', l: 'Rough night' },
      { e: '\uD83C\uDF24\uFE0F', l: 'Weather change' },
      { e: '\uD83C\uDF7D\uFE0F', l: 'Tried new food' },
      { e: '\uD83E\uDDF4', l: 'New product' },
      { e: '\uD83C\uDFC3', l: 'Change in routine' },
      { e: '\uD83D\uDC4D', l: 'Pretty normal day', wide: true },
    ],
  },
]

const TOTAL = QUESTIONS.length + 1 // step 0 = oura data

export default function DailyCheckin() {
  const [open, setOpen]         = useState(false)
  const [step, setStep]         = useState(0)
  const [selected, setSelected] = useState(null)   // single-select highlight
  const [multiSel, setMultiSel] = useState([])      // multi-select indices
  const [answers, setAnswers]   = useState({})      // store answers by step

  function openSheet() { setStep(0); setSelected(null); setMultiSel([]); setAnswers({}); setOpen(true) }
  function closeSheet() { setOpen(false) }

  function handleSingle(i) {
    setSelected(i)
    setAnswers(a => ({ ...a, [step]: i }))
    setTimeout(() => { setSelected(null); setStep(s => s + 1) }, 320)
  }

  function toggleMulti(i) {
    setMultiSel(prev =>
      prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
    )
  }

  function submitMulti() {
    setAnswers(a => ({ ...a, [step]: multiSel }))
    setStep(s => s + 1)
  }

  // Derive insight for done screen
  const skinAnswer  = answers[1] // 0=clear … 4=flaring
  const stressDay   = Array.isArray(answers[3]) && answers[3].includes(0) // "Stressful day"
  const normalDay   = Array.isArray(answers[3]) && answers[3].includes(6)  // "Pretty normal day"
  let insightIcon = '📊', insightHead = '', insightBody = ''
  if (stressDay && skinAnswer >= 2) {
    insightIcon = '⚠️'
    insightHead = 'Stress + moderate skin \u2014 your 48-hour window is open'
    insightBody = 'Your Oura confirms elevated stress today, and your skin is already reacting. Patients like you who do tonight\u2019s breathing exercise and moisturize within 3 minutes of showering see fewer flares by the weekend.'
  } else if (stressDay) {
    insightHead = 'Stressful day noted \u2014 we\u2019re watching the next 48 hours'
    insightBody = 'Your HRV is already tracking low. A short wind-down routine tonight can lower tomorrow\u2019s flare risk.'
  } else if (normalDay || skinAnswer === 0) {
    insightIcon = '\u2705'
    insightHead = 'Normal day logged \u2014 your streak continues'
    insightBody = 'Keep it going. Your 7-day check-in streak is building a strong trigger report for your next derm visit.'
  } else {
    insightHead = 'Check-in logged \u2014 patterns take shape over time'
    insightBody = 'Every check-in adds to your skin story. We\u2019ll flag patterns as they emerge.'
  }

  const progressPct = step === 0 ? 20 : ((step + 1) / (TOTAL + 1)) * 100

  return (
    <>
      {/* Entry banner */}
      <div className="daily-checkin" onClick={openSheet}>
        <div className="daily-checkin__icon">📋</div>
        <div className="daily-checkin__body">
          <p className="daily-checkin__title">How&rsquo;s your skin today?</p>
          <p className="daily-checkin__sub">Patients who log daily manage their symptoms better over time.</p>
        </div>
        <div className="daily-checkin__arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>

      {/* Sheet overlay */}
      {open && (
        <div className="ci-overlay" onClick={e => e.target === e.currentTarget && closeSheet()}>
          <div className="ci-sheet">

            {/* ── Step 0: Oura data ─────────────────────────── */}
            {step === 0 && (
              <>
                <div className="ci-header">
                  <span className="ci-label">Auto-synced data</span>
                  <button className="ci-close" onClick={closeSheet}>✕</button>
                </div>
                <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>
                <h2 className="ci-title">We pulled today&rsquo;s data from your Oura Ring.</h2>
                <p className="ci-sub">Continue to add how you&rsquo;re feeling.</p>

                <div className="ci-data-row">
                  <div className="ci-data-icon" style={{ background: 'var(--color-sage-light)' }}>😴</div>
                  <div className="ci-data-body">
                    <p className="ci-data-label">Sleep score</p>
                    <p className="ci-data-value">72 / 100</p>
                    <p className="ci-data-src">6h 23m · 2 wake-ups · 45m deep sleep</p>
                  </div>
                </div>
                <div className="ci-data-row">
                  <div className="ci-data-icon" style={{ background: 'var(--color-warm-light)' }}>🧠</div>
                  <div className="ci-data-body">
                    <p className="ci-data-label">Stress level</p>
                    <p className="ci-data-value">Medium-High</p>
                    <p className="ci-data-src">HRV 15% below your baseline · 3.2hrs in high stress</p>
                  </div>
                </div>
                <div className="ci-data-row">
                  <div className="ci-data-icon" style={{ background: 'var(--color-teal-light)' }}>⚡</div>
                  <div className="ci-data-body">
                    <p className="ci-data-label">Readiness</p>
                    <p className="ci-data-value">62 / 100</p>
                    <p className="ci-data-src">Body temp +0.3°C · Recovery below average</p>
                  </div>
                </div>

                <button className="ci-btn" onClick={() => setStep(1)}>Continue → How&rsquo;s your skin?</button>
              </>
            )}

            {/* ── Steps 1–3: Questions ──────────────────────── */}
            {step >= 1 && step <= QUESTIONS.length && (() => {
              const q = QUESTIONS[step - 1]
              return (
                <>
                  <div className="ci-header">
                    <span className="ci-label">{q.step} · Oura synced</span>
                    <button className="ci-close" onClick={closeSheet}>✕</button>
                  </div>
                  <div className="ci-progress"><div className="ci-fill" style={{ width: `${progressPct}%` }} /></div>
                  <h2 className="ci-title">{q.q}</h2>
                  <p className="ci-sub">{q.sub}</p>

                  {q.multi ? (
                    <>
                      <div className="ci-opts ci-opts--grid">
                        {q.opts.map((opt, i) => (
                          <button
                            key={i}
                            className={`ci-opt ci-opt--chip${opt.wide ? ' ci-opt--wide' : ''}${multiSel.includes(i) ? ' ci-opt--sel' : ''}`}
                            onClick={() => toggleMulti(i)}
                          >
                            <span className="ci-opt__emoji">{opt.e}</span>
                            <span className="ci-opt__label">{opt.l}</span>
                          </button>
                        ))}
                      </div>
                      <button className="ci-btn" style={{ marginTop: 'var(--space-4)' }} onClick={submitMulti}>
                        {multiSel.length === 0 ? 'Skip' : 'Continue \u2192'}
                      </button>
                    </>
                  ) : (
                    <div className="ci-opts ci-opts--list">
                      {q.opts.map((opt, i) => (
                        <button
                          key={i}
                          className={`ci-opt ci-opt--row${selected === i ? ' ci-opt--sel' : ''}`}
                          onClick={() => handleSingle(i)}
                        >
                          <span className="ci-opt__emoji">{opt.e}</span>
                          <span className="ci-opt__label">{opt.l}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )
            })()}

            {/* ── Done screen ───────────────────────────────── */}
            {step > QUESTIONS.length && (
              <div className="ci-done">
                <div className="ci-done__emoji">🎉</div>
                <h3 className="ci-done__title">Check-in complete!</h3>
                <p className="ci-done__sub">Sleep, stress, and readiness auto-synced from Oura. Your skin score, itch, and daily context logged.</p>
                <div className="ci-insight">
                  <div className="ci-insight__tag"><span className="ci-insight__dot" />Insight · Based on your check-in</div>
                  <h4 className="ci-insight__heading">{insightIcon} {insightHead}</h4>
                  <p className="ci-insight__body">{insightBody}</p>
                </div>
                <button className="ci-btn" onClick={closeSheet}>Got it &mdash; back to feed</button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  )
}
