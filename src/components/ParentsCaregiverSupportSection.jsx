import React, { useState } from 'react'
import './ParentsCaregiverSupportSection.css'

function Blobs({ variant }) {
  return (
    <div className={`pcs-blobs pcs-blobs--${variant}`} aria-hidden="true">
      <span className="pcs-blob pcs-blob--a" />
      <span className="pcs-blob pcs-blob--b" />
      <span className="pcs-blob pcs-blob--c" />
      <span className="pcs-blob pcs-blob--d" />
    </div>
  )
}

/* Hero card — static, no flip */
function HeroCard() {
  return (
    <div className="pcs-card pcs-card--cream pcs-card--intro">
      <Blobs variant="cream" />
      <div className="pcs-badge">
        <img src="/images/parents/logo-black.svg" alt="Parents" className="pcs-badge__logo" />
        <p className="pcs-badge__title">Sandwich Generation<br />Self-Care</p>
      </div>
    </div>
  )
}

/* Fact card — front shows a stat, flips to reveal the expert's headshot + quote */
function FactCard({ variant, stat, expert }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      className={`pcs-fact pcs-fact--${variant}${flipped ? ' pcs-fact--flipped' : ''}`}
      onClick={() => setFlipped(f => !f)}
      aria-label={flipped ? 'Flip back' : `Flip to reveal — ${expert.name}`}
    >
      <div className="pcs-fact__inner">
        {/* Front */}
        <div className="pcs-fact__front">
          <Blobs variant={variant} />
          <div className="pcs-badge">
            <div className="pcs-badge__eyebrow">
              <span>FLIP TO REVEAL</span>
              <svg width="14" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
                <path d="M1 7C1 3.686 3.686 1 7 1h2M15 7C15 10.314 12.314 13 9 13H7" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 1l3 3-3 3M7 13l-3-3 3-3" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="pcs-badge__stat">{stat}</p>
          </div>
        </div>

        {/* Back */}
        <div className="pcs-fact__back">
          <div className="pcs-fact__photo-wrap">
            <Blobs variant={variant} />
            <img src={expert.photo} alt="" className="pcs-fact__photo" />
          </div>
          <div className="pcs-fact__panel">
            <p className="pcs-fact__name">{expert.name}</p>
            <p className="pcs-fact__quote">{expert.quote}</p>
          </div>
        </div>
      </div>
    </button>
  )
}

const FACTS = [
  {
    id: 'caroline',
    variant: 'lime',
    stat: 'Nearly 1 in 4 Adults Are in the Sandwich Generation',
    expert: {
      photo: '/images/parents/caroline-utz.png',
      name: 'Caroline Utz, Parents Senior Editor',
      quote: 'Caregiving can be isolating. Lean on your support system of partners, friends, and neighbors for errands like driving to appointments or preparing a meal.',
    },
  },
  {
    id: 'sarah',
    variant: 'lavender',
    stat: 'Around 80% of Parents Spend Nearly Every Waking Hour Focused on Others',
    expert: {
      photo: '/images/parents/sarah-loren.png',
      name: 'Sarah Loren, MD, Elder Care Consultant',
      quote: "Supporting others can be overwhelming, so don't forget to make time for what makes you happy, whether it's a treat once a week or focused time for nightly reading.",
    },
  },
  {
    id: 'john',
    variant: 'sand',
    stat: 'Over 65% of Sandwich Caregivers Have Considered Leaving Their Job',
    expert: {
      photo: '/images/parents/john-mchugh.png',
      name: 'John McHugh, PhD, Caregiving Researcher',
      quote: 'Balancing your career and caregiving responsibilities can feel like a full-time job. Research local and national organizations focusing on caregiver relief and financial support.',
    },
  },
]

export default function ParentsCaregiverSupportSection() {
  return (
    <section className="pcs-section">
      <div className="pcs-title-row">
        <img src="/images/parents/logo-black.svg" alt="Parents" className="pcs-title-row__logo" />
        <span className="pcs-title-row__divider" />
        <span className="pcs-title-row__title">Caregiver Support</span>
      </div>

      <div className="pcs-scroll">
        <HeroCard />

        {FACTS.map(fact => (
          <FactCard key={fact.id} variant={fact.variant} stat={fact.stat} expert={fact.expert} />
        ))}
      </div>
    </section>
  )
}
