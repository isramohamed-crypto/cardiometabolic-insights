import React, { useState } from 'react'

/**
 * Travel + Leisure "Finding Fall" autumn travel guide takeover card.
 * Two states:
 *   1) Default — video bg, masthead, headline, 3 persona CTAs.
 *   2) Persona — back button, shared intro paragraph, persona image,
 *      persona title (color-keyed to the CTA), persona body.
 *
 * Expected files (in /public/):
 *   - autumn-travel.mp4         — looping background video
 *   - autumn-travel-poster.jpg  — optional first-frame still (graceful
 *                                 fallback while the mp4 buffers and
 *                                 when autoplay is blocked)
 */

const PERSONAS = [
  { id: 'food',    label: 'For the food and cuisine fanatic', tone: 'rust'  }, // #A43819
  { id: 'culture', label: 'For the culture seeker',           tone: 'olive' }, // #707324
  { id: 'family',  label: 'For the family-focused traveler',  tone: 'brown' }, // #724413
]

const SHARED_INTRO = 'With a bit of planning—like thoughtful packing to prepare for unexpected eczema flare-ups—and an itinerary to maximize every stop, hit the road for wonderful memories ahead.'

// Body copy is placeholder in the Figma (same paragraph across all three
// personas). Swap with persona-specific copy when it's ready.
const PERSONA_CONTENT = {
  food: {
    title: 'For the Food and Cuisine Fanatic',
    video: '/tl-food-and-cuisine.mp4',
    body: "When you think of New England, you may picture quaint coastal towns and centuries of history, but don't let that distract you from another star of the show: the can't-miss local fare. Crack into fresh-caught seafood—perhaps at McLoons Lobster Shack in South Thomason, ME—or enjoy natural, maple sweetness at Dutton's Sugar Shack & Berry Farm in Manchester Center, VT.",
  },
  culture: {
    title: 'For the Culture Seeker',
    video: '/TL-Culture-Seeker.mp4',
    body: "When you think of New England, you may picture quaint coastal towns and centuries of history, but don't let that distract you from another star of the show: the can't-miss local fare. Crack into fresh-caught seafood—perhaps at McLoons Lobster Shack in South Thomason, ME—or enjoy natural, maple sweetness at Dutton's Sugar Shack & Berry Farm in Manchester Center, VT.",
  },
  family: {
    title: 'For the Family-Focused Traveler',
    video: '/TL-Family-Focus.mp4',
    body: "When you think of New England, you may picture quaint coastal towns and centuries of history, but don't let that distract you from another star of the show: the can't-miss local fare. Crack into fresh-caught seafood—perhaps at McLoons Lobster Shack in South Thomason, ME—or enjoy natural, maple sweetness at Dutton's Sugar Shack & Berry Farm in Manchester Center, VT.",
  },
}

function DefaultView({ onPersonaSelect }) {
  return (
    <>
      <video
        className="tl-card__video"
        autoPlay
        loop
        muted
        playsInline
        poster="/autumn-travel-poster.jpg"
        aria-hidden="true"
      >
        <source src="/autumn-travel.mp4" type="video/mp4" />
      </video>
      <div className="tl-card__overlay" aria-hidden="true" />
      <div className="tl-card__content">
        <h2 className="tl-card__brand">
          Travel<span className="tl-card__brand-plus" aria-hidden="true">+</span>Leisure
        </h2>
        <div className="tl-card__bottom">
          <h3 className="tl-card__title">Finding Fall</h3>
          <p className="tl-card__sub">
            Click on the tabs below to explore a jam-packed travel guide
          </p>
          <div className="tl-card__cta-list">
            {PERSONAS.map(p => (
              <button
                key={p.id}
                type="button"
                className={`tl-card__cta tl-card__cta--${p.tone}`}
                onClick={() => onPersonaSelect(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

function PersonaView({ personaId, onBack }) {
  const persona = PERSONAS.find(p => p.id === personaId)
  const content = PERSONA_CONTENT[personaId]
  if (!persona || !content) return null
  return (
    <div className={`tl-persona tl-persona--${persona.tone}`}>
      <button
        type="button"
        className="tl-persona__back"
        onClick={onBack}
        aria-label="Back to Finding Fall"
      >
        ← Finding Fall
      </button>
      <p className="tl-persona__intro">{SHARED_INTRO}</p>
      <video
        key={content.video}
        className={`tl-persona__media tl-persona__media--${persona.tone}`}
        autoPlay
        loop
        muted
        playsInline
        aria-label={content.title}
      >
        <source src={content.video} type="video/mp4" />
      </video>
      <h3 className={`tl-persona__title tl-persona__title--${persona.tone}`}>
        {content.title}
      </h3>
      <p className="tl-persona__body">{content.body}</p>
    </div>
  )
}

export default function AutumnTravelCard() {
  const [activePersona, setActivePersona] = useState(null)
  const onCard = !!activePersona

  return (
    <section className="tl-section">
      <article className={`tl-card${onCard ? ' tl-card--persona' : ''}`}>
        {activePersona
          ? <PersonaView personaId={activePersona} onBack={() => setActivePersona(null)} />
          : <DefaultView onPersonaSelect={id => setActivePersona(id)} />
        }
      </article>
    </section>
  )
}
