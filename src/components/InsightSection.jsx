import React from 'react'
import { useProfileStage } from '../context/ProfileStageContext'

export default function InsightSection() {
  const { isNew } = useProfileStage()

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
