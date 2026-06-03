import React, { useState } from 'react'

/**
 * People · Ones To Watch · Women In Sports
 * Magazine-takeover section per Figma frame 617:1660 (header) and
 * component 11 (617:2122 — the 3 expansion variants).
 *
 * UX: three vertically stacked accordion cards beneath a hero header.
 * Tapping a card collapses any currently open one and expands the
 * tapped one (single-expand). The first card starts open.
 *
 * Each card has its own brand color (teal / blue / pink) carried from
 * the People template; the yellow starburst behind each portrait is a
 * shared accent across all three.
 *
 * Placeholder copy + portraits — swap PEOPLE[i].name / photo / bio when
 * real content lands.
 */
const PEOPLE = [
  {
    id: 'michelle-albert',
    name: 'Dr. Michelle Albert',
    color: 'teal',
    photo: '/kendra.jpg',
    bio: 'Pioneer in sex-specific cardiovascular research. Her work established that heart disease presents differently in women — and that standard risk tools often miss it.',
  },
  {
    id: 'dariush-mozaffarian',
    name: 'Dariush Mozaffarian',
    color: 'blue',
    photo: '/valynn.jpg',
    bio: 'Dean and cardiologist whose research has shaped global dietary guidelines. Known for showing that food quality — not just calorie count — drives metabolic health.',
  },
  {
    id: 'jayne-morgan',
    name: 'Jayne Morgan, MD',
    color: 'pink',
    photo: '/abby-tai-eczema.webp',
    bio: 'Cardiologist and health equity advocate working to close the gap in cardiovascular outcomes for underserved communities. Frequent voice on preventive heart health.',
  },
]

export default function OnesToWatch() {
  const [expandedId, setExpandedId] = useState('michelle-albert')

  function toggle(id) {
    setExpandedId(curr => (curr === id ? null : id))
  }

  return (
    <article className="otw-header">
        <div className="otw-header__visual" role="img" aria-label="Leaders in cardiometabolic health" />

        {/* Accordion cards — sit inside the magazine takeover card,
            replacing the previous caption line. */}
        <div className="otw-list">
        {PEOPLE.map(p => {
          const isOpen = expandedId === p.id
          return (
            <article
              key={p.id}
              className={`otw-card otw-card--${p.color}${isOpen ? ' otw-card--open' : ''}`}
            >
              <button
                type="button"
                className="otw-card__head"
                onClick={() => toggle(p.id)}
                aria-expanded={isOpen}
              >
                <span className="otw-card__sticker" aria-hidden="true">
                  <span className="otw-card__star" />
                  <span
                    className="otw-card__photo"
                    style={{ backgroundImage: `url(${p.photo})` }}
                  />
                </span>
                <span className="otw-card__title-block">
                  <span className="otw-card__label">Voices to know:</span>
                  <span className="otw-card__name">{p.name}</span>
                </span>
                <span className="otw-card__toggle" aria-hidden="true">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div
                className="otw-card__body"
                aria-hidden={!isOpen}
              >
                <p className="otw-card__bio">{p.bio}</p>
              </div>
            </article>
          )
        })}
        </div>
    </article>
  )
}
