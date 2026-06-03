import React, { useEffect, useState } from 'react'
import './HealthPulseSheet.css'

/**
 * Weekly Health Pulse — combined Symptom Burden + Life Impact patient-reported
 * outcomes. Saves a record to localStorage `cardiometabolicEpro[]` so PreparePage
 * can surface real symptom and life-impact scores instead of hard-coded
 * demo numbers. Designed for cardiometabolic health (cholesterol, hypertension,
 * diabetes, obesity, heart disease). Answering weekly builds a longitudinal
 * picture the care team can use between visits.
 */

const STORAGE_KEY = 'cardiometabolicEpro'

const POEM_QUESTIONS = [
  'How many days this week did you feel unusually fatigued or low on energy?',
  'How many days this week did you experience headaches or pressure in your head?',
  'How many nights this week was your sleep disrupted by stress, discomfort, or worry?',
  'How many days this week did you feel short of breath during normal activity?',
  'How many days this week did you notice chest tightness, pressure, or discomfort?',
  'How many days this week did you feel anxious or worried about your health?',
  'How many days this week did you struggle to stick to your diet or health routine?',
]
const POEM_OPTIONS = [
  { label: 'No days',   value: 0 },
  { label: '1–2 days',  value: 1 },
  { label: '3–4 days',  value: 2 },
  { label: '5–6 days',  value: 3 },
  { label: 'Every day', value: 4 },
]

const DLQI_QUESTIONS = [
  'How much has managing your condition affected your energy for daily tasks?',
  'How much has health anxiety affected your mood or outlook this week?',
  'How much has your condition gotten in the way of work or daily responsibilities?',
  'How much has monitoring or managing your health felt like a burden?',
  'How much has your condition held you back from social or leisure activities?',
  'How much has it affected your ability to exercise or stay active?',
  'How much has meal planning or eating well felt stressful or difficult?',
  'How much friction has your health created with family or people close to you?',
  'How much has your condition affected your confidence or self-image?',
  'How much time and effort has managing medications or appointments taken?',
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
            These questions track your symptom burden and life impact over the last week.
            Answering weekly builds a picture your care team can use between visits.
          </p>
        </div>

        <h2 className="hp-section-h">Symptoms this week<span className="hp-section-tag">BURDEN</span></h2>
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

        <h2 className="hp-section-h">Life impact this week<span className="hp-section-tag">IMPACT</span></h2>
        <p className="hp-section-sub">Over the last week, how much has managing your cardiometabolic health affected each of these?</p>
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
