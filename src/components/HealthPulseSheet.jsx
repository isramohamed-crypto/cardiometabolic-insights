import React, { useEffect, useState } from 'react'
import './HealthPulseSheet.css'

/**
 * Weekly Health Pulse — combined POEM-style + DLQI-style patient-reported
 * outcomes. Saves a record to localStorage `cardiometabolicEpro[]` so PreparePage
 * can surface real symptom and life-impact scores instead of hard-coded
 * demo numbers. Question wording is paraphrased; the scoring scales and
 * interpretation bands follow the standard 0–28 (POEM) and 0–30 (DLQI)
 * instruments used in dermatology research and clinical care.
 */

const STORAGE_KEY = 'cardiometabolicEpro'

const POEM_QUESTIONS = [
  'How many days this week did you notice itching on your skin?',
  'How many nights this week was your sleep disturbed because of your skin?',
  'How many days this week did your skin bleed?',
  'How many days this week did your skin weep or ooze fluid?',
  'How many days this week was your skin cracked?',
  'How many days this week did you notice skin flaking off?',
  'How many days this week did your skin feel dry or rough?',
]
const POEM_OPTIONS = [
  { label: 'No days',   value: 0 },
  { label: '1–2 days',  value: 1 },
  { label: '3–4 days',  value: 2 },
  { label: '5–6 days',  value: 3 },
  { label: 'Every day', value: 4 },
]

const DLQI_QUESTIONS = [
  'How much itching, soreness, pain, or stinging have you had?',
  'How much have you felt embarrassed or self-conscious about your skin?',
  'How much has your skin gotten in the way of shopping, household tasks, or yardwork?',
  'How much has your skin shaped what clothes you decided to wear?',
  'How much has your skin held you back from social or leisure activities?',
  'How much has your skin made it harder to exercise or play sports?',
  'Has your skin kept you from working or studying?',
  'How much friction has your skin created with your partner, friends, or family?',
  'How much has your skin caused difficulty in your sex life?',
  'How much of a hassle has treating your skin been (messy products, time spent, etc.)?',
]
const DLQI_OPTIONS = [
  { label: 'Not at all', value: 0 },
  { label: 'A little',   value: 1 },
  { label: 'A lot',      value: 2 },
  { label: 'Very much',  value: 3 },
]

function readRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch (_) { return [] }
}
function writeRecord(record) {
  try {
    const all = readRecords()
    all.push(record)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  } catch (_) {}
}

export default function HealthPulseSheet({ onClose, onComplete }) {
  const [poemAns, setPoemAns] = useState(() => Array(POEM_QUESTIONS.length).fill(null))
  const [dlqiAns, setDlqiAns] = useState(() => Array(DLQI_QUESTIONS.length).fill(null))

  const poemDone   = poemAns.filter(v => v !== null).length
  const dlqiDone   = dlqiAns.filter(v => v !== null).length
  const totalDone  = poemDone + dlqiDone
  const totalQs    = POEM_QUESTIONS.length + DLQI_QUESTIONS.length
  const allAnswered = totalDone === totalQs

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function setPoem(i, v) { setPoemAns(prev => prev.map((x, idx) => idx === i ? v : x)) }
  function setDlqi(i, v) { setDlqiAns(prev => prev.map((x, idx) => idx === i ? v : x)) }

  function handleSubmit() {
    if (!allAnswered) return
    const poemTotal = poemAns.reduce((a, b) => a + b, 0)
    const dlqiTotal = dlqiAns.reduce((a, b) => a + b, 0)
    const record = {
      date: new Date().toISOString(),
      poem: poemTotal,
      dlqi: dlqiTotal,
      poemAnswers: poemAns,
      dlqiAnswers: dlqiAns,
    }
    writeRecord(record)
    onComplete?.(record)
    onClose?.()
  }

  return (
    <div className="hp-overlay" role="dialog" aria-label="Weekly Health Pulse">
      <header className="hp-header">
        <button className="hp-back" onClick={onClose} aria-label="Close">←</button>
        <div className="hp-header__title">Weekly Health Pulse</div>
        <div style={{ width: 36 }} />
      </header>

      <div className="hp-progress-wrap">
        <div className="hp-progress">
          <div className="hp-progress__fill" style={{ width: `${(totalDone / totalQs) * 100}%` }} />
        </div>
        <div className="hp-progress__label">{totalDone} of {totalQs} answered</div>
      </div>

      <main className="hp-main">
        <div className="hp-intro">
          <p className="hp-intro__title">Two short scales · about 3 minutes</p>
          <p className="hp-intro__sub">
            POEM measures symptoms over the last week. DLQI measures life impact. These are
            the same instruments your dermatologist uses in clinic — answering weekly gives
            them a clearer picture between visits.
          </p>
        </div>

        <h2 className="hp-section-h">Symptoms this week<span className="hp-section-tag">POEM</span></h2>
        <p className="hp-section-sub">Over the last week, on how many days have you experienced each of these?</p>
        {POEM_QUESTIONS.map((q, i) => (
          <fieldset key={`poem-${i}`} className={`hp-q${poemAns[i] !== null ? ' hp-q--answered' : ''}`}>
            <legend className="hp-q__legend">{q}</legend>
            <div className="hp-q__options">
              {POEM_OPTIONS.map(opt => (
                <label key={opt.value} className={`hp-q__opt${poemAns[i] === opt.value ? ' hp-q__opt--sel' : ''}`}>
                  <input
                    type="radio"
                    name={`poem-${i}`}
                    value={opt.value}
                    checked={poemAns[i] === opt.value}
                    onChange={() => setPoem(i, opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}

        <h2 className="hp-section-h">Life impact this week<span className="hp-section-tag">DLQI</span></h2>
        <p className="hp-section-sub">Over the last week, how much has your skin affected each of these?</p>
        {DLQI_QUESTIONS.map((q, i) => (
          <fieldset key={`dlqi-${i}`} className={`hp-q${dlqiAns[i] !== null ? ' hp-q--answered' : ''}`}>
            <legend className="hp-q__legend">{q}</legend>
            <div className="hp-q__options">
              {DLQI_OPTIONS.map(opt => (
                <label key={opt.value} className={`hp-q__opt${dlqiAns[i] === opt.value ? ' hp-q__opt--sel' : ''}`}>
                  <input
                    type="radio"
                    name={`dlqi-${i}`}
                    value={opt.value}
                    checked={dlqiAns[i] === opt.value}
                    onChange={() => setDlqi(i, opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </main>

      <footer className="hp-footer">
        <button
          className={`hp-submit${allAnswered ? '' : ' hp-submit--disabled'}`}
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          {allAnswered ? 'Submit pulse →' : `${totalQs - totalDone} more to answer`}
        </button>
      </footer>
    </div>
  )
}
