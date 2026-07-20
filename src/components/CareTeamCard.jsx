import React from 'react'

const members = [
  { initials: 'DR', name: 'Dr. Rivera',   role: 'Primary Care',  variant: '' },
  { initials: 'CN', name: 'Coach Nina',   role: 'Lifestyle',     variant: 'care-team__avatar--sage' },
  { initials: 'PH', name: 'Pharmacy Hub', role: 'PSP Support',   variant: 'care-team__avatar--warm' },
]

export default function CareTeamCard() {
  return (
    <div className="card card--half">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Your Team</p>
          <h2 className="card__title">Care team</h2>
        </div>
      </div>
      <ul className="care-team">
        {members.map(m => (
          <li key={m.initials} className="care-team__member">
            <div className={`care-team__avatar${m.variant ? ' ' + m.variant : ''}`}>{m.initials}</div>
            <div>
              <p className="care-team__name">{m.name}</p>
              <p className="care-team__role">{m.role}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
