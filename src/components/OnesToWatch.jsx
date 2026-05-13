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
    id: 'jane',
    name: 'Jane',
    color: 'teal',
    photo: '/kendra.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
  {
    id: 'ashley',
    name: 'Ashley',
    color: 'blue',
    photo: '/valynn.jpg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
  {
    id: 'stacey',
    name: 'Stacey',
    color: 'pink',
    photo: '/abby-tai-eczema.webp',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.',
  },
]

export default function OnesToWatch() {
  const [expandedId, setExpandedId] = useState('jane')

  function toggle(id) {
    setExpandedId(curr => (curr === id ? null : id))
  }

  return (
    <section className="otw-section">
      {/* Header */}
      <article className="otw-header">
        <div className="otw-header__visual" role="img" aria-label="Women in sports">
          <div className="otw-header__top">
            <span className="otw-header__people">People</span>
            <span className="otw-header__divider">|</span>
            <span className="otw-header__label">Ones To Watch</span>
          </div>
          <h2 className="otw-header__title">
            ONES<br />TO WATCH:<br />WOMEN IN SPORTS
          </h2>
        </div>

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
                  <span className="otw-card__label">One's to watch:</span>
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
    </section>
  )
}
