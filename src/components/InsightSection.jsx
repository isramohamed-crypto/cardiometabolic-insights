import React from 'react'

export default function InsightSection() {
  return (
    <section className="insight-section">
      <h2 className="insight-section__heading">Your insight</h2>

      <div className="insight-card">
        <div className="insight-tag">
          <div className="itag-dot" />
          Data insight · From your tracking
        </div>
        <h4 className="insight-title">Stress was elevated 3 of the last 5 days</h4>
        <p className="insight-body">
          Your Oura HRV has been below your baseline since Tuesday. When this pattern
          holds for 3+ days, your flare risk increases significantly in the 48-hour
          window ahead.
        </p>
        <div className="insight-data">
          <div className="insight-stat">
            <div className="is-val">3/5</div>
            <div className="is-lbl">High-stress days</div>
          </div>
          <div className="insight-stat">
            <div className="is-val">-18%</div>
            <div className="is-lbl">HRV vs. baseline</div>
          </div>
          <div className="insight-stat">
            <div className="is-val">⚠️</div>
            <div className="is-lbl">Flare risk: elevated</div>
          </div>
        </div>
        <p className="insight-source">Oura integration • Synced 7:14am</p>
      </div>
    </section>
  )
}
