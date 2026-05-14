import React, { useState } from 'react'

/**
 * Better Homes & Gardens "Savor the Season" holiday takeover.
 * Mirrors AutumnTravelCard's structure exactly — masthead wordmark
 * at top, oversized serif headline at bottom, 3 colored CTAs.
 * Tapping a CTA swaps to a category view with back button + body.
 *
 * Wordmark + hero photo will swap to /bhg-logo.svg and
 * /bhg-hero.jpg once those assets are dropped into /public/.
 */

const PERSONAS = [
  { id: 'traditions', label: 'Cozy traditions',  tone: 'evergreen' },
  { id: 'flavors',    label: 'Festive flavors',  tone: 'cranberry' },
  { id: 'gifts',      label: 'Gifts that delight', tone: 'gold'    },
]

const SHARED_INTRO = 'Holiday joy lives in the small things — soft lighting, slow mornings, the smell of something warm in the oven. Lean into the season at your own pace.'

const PERSONA_CONTENT = {
  traditions: {
    title: 'Cozy Traditions',
    body: 'Pull out the soft throws, light a low-glow candle, and make space for an unhurried evening. Tradition does not have to be elaborate — a simmering pot of cider counts.',
  },
  flavors: {
    title: 'Festive Flavors',
    body: 'Spiced butter for warm rolls, a slow-roast main dish, citrus brightening a cranberry sauce. Cook ahead where you can so the day itself stays calm.',
  },
  gifts: {
    title: 'Gifts That Delight',
    body: 'A handwritten note, a homemade jar of something, a single thoughtful book. The gifts people remember are usually the small ones that feel personal.',
  },
}

function DefaultView({ onPersonaSelect }) {
  return (
    <>
      <div className="tl-card__overlay" aria-hidden="true" />
      <div className="tl-card__content">
        <h2 className="tl-card__brand bhg-card__brand">
          Better Homes &amp; Gardens
        </h2>
        <div className="tl-card__bottom">
          <h3 className="tl-card__title bhg-card__title">Savor the season</h3>
          <p className="tl-card__sub">Holiday joy in every moment.</p>
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
        aria-label="Back to Better Homes & Gardens"
      >
        ← Better Homes &amp; Gardens
      </button>
      <p className="tl-persona__intro">{SHARED_INTRO}</p>
      <div
        className={`tl-persona__media tl-persona__media--${persona.tone}`}
        aria-hidden="true"
      />
      <h3 className={`tl-persona__title tl-persona__title--${persona.tone}`}>
        {content.title}
      </h3>
      <p className="tl-persona__body">{content.body}</p>
    </div>
  )
}

export default function BHGCard() {
  const [activePersona, setActivePersona] = useState(null)
  const onCard = !!activePersona

  return (
    <article className={`tl-card tl-card--bhg${onCard ? ' tl-card--persona' : ''}`}>
      {activePersona
        ? <PersonaView personaId={activePersona} onBack={() => setActivePersona(null)} />
        : <DefaultView onPersonaSelect={id => setActivePersona(id)} />
      }
    </article>
  )
}
