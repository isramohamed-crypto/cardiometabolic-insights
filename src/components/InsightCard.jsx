import React from 'react'

export default function InsightCard() {
  return (
    <div className="card card--full card--teal">
      <p className="card__eyebrow card__eyebrow--light">Bright Insights</p>
      <blockquote className="insight-quote">
        &ldquo;Patients who log daily vitals are 2&times; more likely to avoid escalation to medication.&rdquo;
      </blockquote>
      <p className="insight-source">Disease Management Support</p>
    </div>
  )
}
