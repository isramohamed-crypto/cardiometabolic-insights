import React, { useState } from 'react'

/**
 * MyRecipes "Top-Rated High-Protein Breakfasts" magazine takeover.
 * Mirrors AutumnTravelCard's structure exactly — masthead wordmark
 * at top, oversized serif headline at bottom, 3 colored CTAs.
 * Tapping a CTA swaps to a persona view with back button + body.
 *
 * Wordmark + hero photo will swap to /myrecipes-logo.svg and
 * /myrecipes-hero.jpg once those assets are dropped into /public/.
 */

const PERSONAS = [
  { id: 'quick',   label: 'For the quick weekday eater', tone: 'toast'   },
  { id: 'prep',    label: 'For the make-aheader',         tone: 'mustard' },
  { id: 'weekend', label: 'For the slow weekend cook',    tone: 'maple'   },
]

const SHARED_INTRO = 'Power up your morning with crowd-pleasing protein picks — most of these clear 20g per serving, and many can be prepped the night before.'

const PERSONA_CONTENT = {
  quick: {
    title: 'For the Quick Weekday Eater',
    body: 'Five-minute mornings: cottage cheese with fresh berries, jammy eggs on toast, or a yogurt parfait layered with seeds and almonds. Pair fat + protein to stay full until lunch.',
  },
  prep: {
    title: 'For the Make-Aheader',
    body: 'Egg muffins, overnight oats with chia, and freezer breakfast sandwiches go from fridge to plate in minutes. Batch on Sunday, breeze through the week.',
  },
  weekend: {
    title: 'For the Slow Weekend Cook',
    body: 'Take your time with a sheet-pan frittata, savory steel-cut oats, or smoked-salmon scrambled eggs. Lingering breakfasts that anchor your weekend.',
  },
}

function DefaultView({ onPersonaSelect }) {
  return (
    <>
      <div className="tl-card__overlay" aria-hidden="true" />
      <div className="tl-card__content">
        <h2 className="tl-card__brand mr-card__brand">MyRecipes</h2>
        <div className="tl-card__bottom">
          <h3 className="tl-card__title mr-card__title">
            Top-rated high-protein breakfasts
          </h3>
          <p className="tl-card__sub">
            Crowd-pleasing morning recipes packed with protein.
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
        aria-label="Back to MyRecipes"
      >
        ← MyRecipes
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

export default function MyRecipesCard() {
  const [activePersona, setActivePersona] = useState(null)
  const onCard = !!activePersona

  return (
    <article className={`tl-card tl-card--mr${onCard ? ' tl-card--persona' : ''}`}>
      {activePersona
        ? <PersonaView personaId={activePersona} onBack={() => setActivePersona(null)} />
        : <DefaultView onPersonaSelect={id => setActivePersona(id)} />
      }
    </article>
  )
}
