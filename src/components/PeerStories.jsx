import React, { useState } from 'react'
import MarkAsTried from './MarkAsTried'

const SUBJECTS = [
  {
    id: 'marcus',
    name: 'Marcus Oyelaran',
    firstName: 'Marcus',
    portrait: '/kendra.jpg',
    intro: "Diagnosed with high cholesterol and hypertension at 48 after a routine checkup — with no symptoms.",
    firstSymptoms: 'Elevated LDL found during an annual physical. Blood pressure was also high.',
    triggers: 'Stress, poor sleep, high-sodium diet',
    affectedAreas: 'Managing cholesterol, blood pressure, and early-stage insulin resistance',
    adviceQuote: "The diagnosis wasn't a death sentence. It was a heads-up — and I decided to take it seriously.",
    adviceStory: "I had no idea anything was wrong. I felt fine, exercised occasionally, thought I was doing okay. Then my doctor showed me my numbers and said we needed to talk. LDL of 162, blood pressure at 145/92, and pre-diabetic markers. I was managing three things I didn't even know about. It was overwhelming at first. But I started tracking what I ate, walking every morning, and actually taking my statin. A year later, my LDL is down to 98. I still have work to do, but I know what I'm working toward now.",
  },
  {
    id: 'diane',
    name: 'Diane Castillo',
    firstName: 'Diane',
    portrait: '/vanson.jpg',
    intro: 'Managing high cholesterol alongside type 2 diabetes for the past six years.',
    firstSymptoms: 'Diagnosed with type 2 diabetes at 52; cholesterol issues identified at the same visit.',
    triggers: 'Refined carbohydrates, sedentary periods, high-stress weeks at work',
    affectedAreas: 'Cholesterol, blood sugar, weight management',
    adviceQuote: "I used to think managing my health meant giving things up. Now I think of it as getting ahead.",
    adviceStory: "When I was diagnosed with diabetes, my doctor told me my cholesterol was also a problem. Two conditions at once felt like too much. I went home and cried. But then I started making one change at a time — first swapping white rice for more vegetables, then adding a short walk after dinner. My A1C came down. My LDL followed. What I've learned is that these conditions are connected. When I take care of one, the others tend to respond too.",
  },
  {
    id: 'raymond',
    name: 'Raymond Hsu',
    firstName: 'Raymond',
    portrait: '/valynn.jpg',
    intro: 'Had a minor cardiac event at 57 and has been actively managing his cardiometabolic health since.',
    firstSymptoms: 'Chest tightness during a morning run led to an ER visit and a diagnosis of early coronary artery disease.',
    triggers: 'Family history, years of untreated high LDL, high-stress career',
    affectedAreas: 'Cholesterol, blood pressure, cardiac recovery',
    adviceQuote: "I wish I had started paying attention ten years earlier. But the second-best time is now.",
    adviceStory: "I had a family history of heart disease but I ignored it. I was busy, I felt healthy, and I kept putting off the follow-up appointments my doctor recommended. Then came the chest tightness on a run that turned into an ER visit, a stent, and a very serious conversation with a cardiologist. Since then I've completely changed how I approach my health. I track my numbers, I show up to every appointment, and I've made peace with the fact that this is a long game — not a quick fix.",
  },
]

function FlipIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  )
}

function FlipCard({ subject }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <div className={`lbe-card-wrap${flipped ? ' is-flipped' : ''}`}>
      <div className="lbe-card-inner">
        {/* FRONT — Meet */}
        <article className="lbe-card lbe-card--meet">
          <div
            className="lbe-card__photo"
            style={{ backgroundImage: `url(${subject.portrait})` }}
            role="img"
            aria-label={`Portrait of ${subject.name}`}
          />
          <button
            type="button"
            className="lbe-flip-btn"
            onClick={() => setFlipped(true)}
            aria-label={`Show ${subject.firstName}'s advice`}
          >
            <FlipIcon />
          </button>
          <div className="lbe-card__top">
            <span className="lbe-card__chip">MEET</span>
            <h3 className="lbe-card__name">{subject.name}</h3>
            <p className="lbe-card__intro">{subject.intro}</p>
          </div>
          <div className="lbe-card__facts">
            <div className="lbe-fact">
              <p className="lbe-fact__label">HOW IT WAS FOUND</p>
              <p className="lbe-fact__value">{subject.firstSymptoms}</p>
            </div>
            <div className="lbe-fact">
              <p className="lbe-fact__label">KEY CONTRIBUTING FACTORS</p>
              <p className="lbe-fact__value">{subject.triggers}</p>
            </div>
            <div className="lbe-fact">
              <p className="lbe-fact__label">CONDITIONS MANAGED</p>
              <p className="lbe-fact__value">{subject.affectedAreas}</p>
            </div>
          </div>
        </article>

        {/* BACK — Advice */}
        <article className="lbe-card lbe-card--advice">
          <button
            type="button"
            className="lbe-flip-btn lbe-flip-btn--dark"
            onClick={() => setFlipped(false)}
            aria-label={`Show ${subject.firstName}'s bio`}
          >
            <FlipIcon />
          </button>
          <div className="lbe-advice__head">
            <img className="lbe-advice__avatar" src={subject.portrait} alt={subject.name} />
            <div className="lbe-advice__head-text">
              <p className="lbe-advice__name">{subject.name}</p>
              <p className="lbe-advice__intro">{subject.intro}</p>
            </div>
          </div>
          <div className="lbe-advice__quote-block">
            <p className="lbe-advice__chip">{subject.firstName.toUpperCase()}'S ADVICE FOR OTHERS</p>
            <blockquote className="lbe-advice__quote">&ldquo;{subject.adviceQuote}&rdquo;</blockquote>
            <p className="lbe-advice__story">{subject.adviceStory}</p>
            <div className="lbe-advice__try-row">
              <MarkAsTried
                id={`peer-stories:${subject.id}`}
                title={subject.adviceQuote}
                source={`Verywell Health · ${subject.firstName}`}
                variant="helpful"
              />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default function PeerStories() {
  return (
    <section className="peer-section lbe-section">
      <div className="watch-head">
        <div>
          <span className="watch-badge">Sponsored series</span>
          <h2 className="watch-title">Real stories</h2>
          <p className="watch-subtitle">People managing cardiometabolic conditions, in their own words</p>
        </div>
      </div>
      <div className="peer-carousel lbe-carousel">
        {/* COVER */}
        <article className="lbe-cover">
          <div className="lbe-cover__head">
            <p className="lbe-cover__masthead">Verywell Health</p>
            <span className="lbe-cover__chip">REAL PEOPLE, REAL STORIES:</span>
            <h2 className="lbe-cover__title">Living Vitalist</h2>
          </div>
          <div
            className="lbe-cover__hero"
            style={{ background: 'linear-gradient(135deg, #1B3A5C 0%, #2E5D8E 60%, #C2673A 100%)' }}
            role="img"
            aria-label="Three people featured in the Living Vitalist series"
          />
        </article>

        {SUBJECTS.map(s => (
          <FlipCard key={s.id} subject={s} />
        ))}
      </div>
    </section>
  )
}
