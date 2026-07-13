import React from 'react'
import { useProfileStage } from '../context/ProfileStageContext'

function readConditions() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    const raw = Array.isArray(p.condition) ? p.condition : (p.condition ? [p.condition] : [])
    return raw.filter(Boolean)
  } catch (_) { return [] }
}

function readTopics() {
  try {
    const p = JSON.parse(localStorage.getItem('cardiometabolicProfile') || '{}')
    return Array.isArray(p.topics) ? p.topics : []
  } catch (_) { return [] }
}

function readTileConfig() {
  try { return JSON.parse(localStorage.getItem('aheadTileConfig') || 'null') } catch (_) { return null }
}

const CHOLESTEROL_CONDITIONS = ['High cholesterol', 'Borderline numbers']

export default function InsightSection() {
  const { isNew } = useProfileStage()

  const conditions  = readConditions()
  const topics      = readTopics()
  const tileConfig  = readTileConfig()

  // Perimenopause insight triggers when:
  //   1. User has a cholesterol-related condition (or no explicit condition — established demo default)
  //   2. AND has a hormonal signal: cycle tile enabled OR menopause topic selected
  const hasHormonalSignal =
    topics.includes('Menopause & hormonal health') ||
    (Array.isArray(tileConfig) && tileConfig.includes('cycle'))

  const hasCholesterol =
    conditions.length === 0 // no explicit conditions → show generic stress insight
      ? false
      : conditions.some(c => CHOLESTEROL_CONDITIONS.includes(c)) ||
        conditions.includes('High cholesterol')

  const showPerimenopause = !isNew && hasHormonalSignal && hasCholesterol

  // ── New / locked state ────────────────────────────────────────────────────
  if (isNew) {
    return (
      <section className="insight-section">
        <h2 className="insight-section__heading">Today's insight</h2>

        <div className="insight-card insight-card--locked">
          <div className="insight-tag">
            <div className="itag-dot" />
            AI insight · Locked
          </div>
          <h4 className="insight-title">Your personalized insights are on the way</h4>
          <p className="insight-body">
            Vitalist AI looks for patterns across your check-ins and readings —
            things like how stress or sleep affect your numbers. Log a few
            check-ins this week to unlock your first insight.
          </p>
          <p className="insight-source">Vitalist AI · Needs a bit more data from you</p>
        </div>
      </section>
    )
  }

  // ── Perimenopause + cholesterol insight ───────────────────────────────────
  if (showPerimenopause) {
    return (
      <section className="insight-section">
        <h2 className="insight-section__heading">Today's insight</h2>

        <div className="insight-card">
          <div className="insight-tag">
            <div className="itag-dot" style={{ background: '#9B59B6' }} />
            AI insight · Based on your profile
          </div>
          <h4 className="insight-title">
            Perimenopause may be driving your LDL — here's the biology
          </h4>
          <p className="insight-body">
            Estrogen plays a direct role in how your liver processes cholesterol.
            As it declines during perimenopause, LDL typically rises 10–25 mg/dL —
            even when diet and exercise haven't changed. If your numbers have climbed
            and you can't explain why, this is likely part of the picture. It's not
            a failure to manage your health. It's a hormonal shift that most care
            teams don't connect without prompting.
          </p>
          <div className="insight-data">
            <div className="insight-stat">
              <div className="is-val">10–25</div>
              <div className="is-lbl">mg/dL typical LDL rise</div>
            </div>
            <div className="insight-stat">
              <div className="is-val">↓ HDL</div>
              <div className="is-lbl">Often falls at same time</div>
            </div>
            <div className="insight-stat">
              <div className="is-val">Hormone-<br />driven</div>
              <div className="is-lbl">Not just diet or exercise</div>
            </div>
          </div>
          <p className="insight-source">
            Vitalist AI · Menopause Society guidelines, SWAN study · Based on your profile
          </p>
        </div>
      </section>
    )
  }

  // ── Default: stress + numbers pattern ────────────────────────────────────
  return (
    <section className="insight-section">
      <h2 className="insight-section__heading">Today's insight</h2>

      <div className="insight-card">
        <div className="insight-tag">
          <div className="itag-dot" />
          AI insight · From your tracking
        </div>
        <h4 className="insight-title">Stress is showing up in your numbers 48 hrs later</h4>
        <p className="insight-body">
          On days you log high stress, your blood pressure and blood sugar trend
          higher two days later — confirmed across 3 of your last 4 weeks of data.
          Managing stress today is one of the highest-impact moves you can make.
        </p>
        <div className="insight-data">
          <div className="insight-stat">
            <div className="is-val">3/4</div>
            <div className="is-lbl">Weeks confirmed</div>
          </div>
          <div className="insight-stat">
            <div className="is-val">+8pts</div>
            <div className="is-lbl">Avg BP after stress</div>
          </div>
          <div className="insight-stat">
            <div className="is-val">48h</div>
            <div className="is-lbl">Lag time</div>
          </div>
        </div>
        <p className="insight-source">Vitalist AI · Based on your check-in history</p>
      </div>
    </section>
  )
}
