import React from 'react'

const modules = [
  { icon: '🥗', name: 'Nutrition', status: 'Week 3', active: true,  locked: false },
  { icon: '🏃', name: 'Movement',  status: 'Week 2', active: false, locked: false },
  { icon: '😴', name: 'Sleep',     status: 'Week 1', active: false, locked: false },
  { icon: '💊', name: 'Medication',status: 'Locked', active: false, locked: true  },
]

export default function ProgramCard() {
  return (
    <div className="card card--full">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Pre-Rx Program</p>
          <h2 className="card__title">My modules</h2>
        </div>
        <a href="#" className="card__link">View all</a>
      </div>
      <div className="program-modules">
        {modules.map(m => (
          <div
            key={m.name}
            className={`module${m.active ? ' module--active' : ''}${m.locked ? ' module--locked' : ''}`}
          >
            <div className="module__icon">{m.icon}</div>
            <p className="module__name">{m.name}</p>
            <p className="module__status">{m.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
