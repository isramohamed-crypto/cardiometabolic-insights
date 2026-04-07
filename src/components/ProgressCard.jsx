import React from 'react'

const metrics = [
  { label: 'Inflammation', width: '72%', delta: '↑ 18%', up: true },
  { label: 'Sleep quality', width: '58%', delta: '↑ 9%',  up: true },
  { label: 'Activity',      width: '45%', delta: '→ 0%',  up: false },
]

export default function ProgressCard() {
  return (
    <div className="card card--half">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">30-Day Report</p>
          <h2 className="card__title">Progress</h2>
        </div>
      </div>
      <ul className="progress-list">
        {metrics.map(m => (
          <li key={m.label} className="progress-list__item">
            <span className="progress-list__label">{m.label}</span>
            <div className="progress-list__bar-wrap">
              <div className="progress-list__bar" style={{ width: m.width }} />
            </div>
            <span className={`progress-list__delta${m.up ? ' progress-list__delta--up' : ''}`}>
              {m.delta}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
