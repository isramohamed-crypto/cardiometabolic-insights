import React, { useState } from 'react'
import MarkAsTried from './MarkAsTried'

const SUBJECTS = [
  {
    id: 'kendra',
    name: 'Kendra Beauford',
    firstName: 'Kendra',
    portrait: '/kendra.jpg',
    intro: "Has struggled with self-esteem due to flares, which she's experienced since childhood.",
    firstSymptoms: 'Had rashes in the crease of her elbows that started as a toddler.',
    triggers: 'Fragrance, scratchy clothing',
    affectedAreas: 'Under the eyes, neck',
    adviceQuote: 'The better I take care of myself, the better my skin is going to be.',
    adviceStory: "I've dealt with eczema from the time I was a young child. My skin regularly feels itchy, and I used to be self-conscious about the rashes that appeared on my body, particularly when comparing myself to other girls my age. But I've learned to embrace my condition and find ways to manage it. For me, that means focusing on living a healthy lifestyle, including eating clean, exercising regularly, and using natural, skin-friendly products.",
  },
  {
    id: 'vanson',
    name: 'Vanson Lee',
    firstName: 'Vanson',
    portrait: '/vanson.jpg',
    intro: 'Started experiencing flares two decades ago that seem to be exacerbated by stress.',
    firstSymptoms: 'Developed a rash on his face in middle school that lasted for weeks.',
    triggers: 'Unknown, but they seem to be more common in winter.',
    affectedAreas: 'Legs, face',
    adviceQuote: "I had to stop myself from thinking that I was a victim of eczema — I'm a passenger on the journey.",
    adviceStory: "Eczema first flared for me in middle school, and I didn't really understand at the time what it was. I still don't know all of my triggers, which can make it feel like I'm in a battle with my skin that I can't win. Since having children of my own — who also have atopic dermatitis — I've been more motivated to live a full life and find treatment strategies that work for me and for my son.",
  },
  {
    id: 'valynn',
    name: 'Valynn Turkovich',
    firstName: 'Valynn',
    portrait: '/valynn.jpg',
    intro: 'Experienced an eczema flare for the first time after having twins.',
    firstSymptoms: 'Developed a rash six months postpartum.',
    triggers: 'Cleaning products, dogs, sunscreen, harsh soaps',
    affectedAreas: 'Hands, neck, shoulders, back, and feet',
    adviceQuote: "I'm getting a handle on this and learning how to live freely and comfortably.",
    adviceStory: "I had my first eczema flare after having my twins. At the time, my healthcare provider told me that it was likely hormonal and would go away. But after a year of struggling with symptoms, I knew this was something bigger. It was difficult because I had never dealt with anything like this before, and I was also new to juggling life as the mother of young twins. Now, I've learned the importance of focusing on my health, even while caring for my family.",
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
              <p className="lbe-fact__label">FIRST SYMPTOMS</p>
              <p className="lbe-fact__value">{subject.firstSymptoms}</p>
            </div>
            <div className="lbe-fact">
              <p className="lbe-fact__label">TOP TRIGGERS</p>
              <p className="lbe-fact__value">{subject.triggers}</p>
            </div>
            <div className="lbe-fact">
              <p className="lbe-fact__label">MOST COMMON AFFECTED AREAS ON BODY</p>
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
                source={`Living Beyond Eczema · ${subject.firstName}`}
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
          <p className="watch-subtitle">People living with eczema, in their own words</p>
        </div>
      </div>
      <div className="peer-carousel lbe-carousel">
        {/* COVER */}
        <article className="lbe-cover">
          <div className="lbe-cover__head">
            <p className="lbe-cover__masthead">People</p>
            <span className="lbe-cover__chip">REAL PEOPLE, REAL STORIES:</span>
            <h2 className="lbe-cover__title">Living Beyond Eczema</h2>
          </div>
          <div
            className="lbe-cover__hero"
            style={{ backgroundImage: 'url(/living-beyond-cover.jpg)' }}
            role="img"
            aria-label="Three people featured in the Living Beyond Eczema series"
          />
        </article>

        {SUBJECTS.map(s => (
          <FlipCard key={s.id} subject={s} />
        ))}
      </div>
    </section>
  )
}
