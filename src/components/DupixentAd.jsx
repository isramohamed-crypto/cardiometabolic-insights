import React from 'react'

export default function DupixentAd() {
  return (
    <div className="dupixent-ad-wrap">
      <p className="dupixent-ad-wrap__label">Advertisement</p>
      <div className="dupixent-ad">
        <div className="dupixent-ad__brand">
          <span className="dupixent-ad__logo">DUPIXENT</span>
          <span className="dupixent-ad__chevrons">&rsaquo;&rsaquo;&rsaquo;</span>
          <span className="dupixent-ad__generic">(dupilumab) Injection</span>
        </div>
        <div className="dupixent-ad__right">
          <button className="dupixent-ad__cta">BOOK A VISIT &rarr;</button>
          <span className="dupixent-ad__code">US.DUP.25.08.0070</span>
        </div>
      </div>
    </div>
  )
}
