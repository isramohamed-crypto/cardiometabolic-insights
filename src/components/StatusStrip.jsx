import React from 'react'

const stats = [
  { label: 'Next Check-In', value: 'Apr 14' },
  { label: 'Day Streak',    value: '7' },
  { label: 'Plan Progress', value: '64%' },
]

export default function StatusStrip() {
  return (
    <section className="status-strip">
      {stats.map(s => (
        <div key={s.label} className="status-card">
          <p className="status-card__label">{s.label}</p>
          <p className="status-card__value">{s.value}</p>
        </div>
      ))}
    </section>
  )
}
