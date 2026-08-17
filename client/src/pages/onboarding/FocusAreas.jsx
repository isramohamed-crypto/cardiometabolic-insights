import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import { getPillarVisual } from './recommendedHabits.js'
import CheckIcon from '../../components/CheckIcon.jsx'
import './FocusAreas.css'

// Was a temporary launch restriction limiting this to just "moving" —
// every pillar is a real focus area now. Left as null (rather than
// deleting the guard in selectOption below) so restricting to a subset
// again later, if that's ever needed, is just setting this back to an
// id array.
const ONLY_SELECTABLE_IDS = null

// Photo tiles rather than the shared pill options: the same square-tile
// pattern as the brand picker earlier in onboarding, dressed in the same
// photo-plus-scrim treatment as the Today page's "Habits I own" cards. The
// ACLM icons that used to sit beside each label are gone along with the
// ACLM line in the body copy — five badge icons plus five photos was two
// competing visual systems in one grid, and naming the framework made a
// simple "what do you want to work on?" read like a clinical intake form.
const FOCUS_OPTIONS = PILLARS_CANONICAL.map((pillar) => ({
  ...pillar,
  visual: getPillarVisual(pillar.id),
}))

// Final onboarding question — which single pillar the user wants to focus
// on first. Single-select on purpose: staying focused on one area builds
// momentum, and more can be added later. Options come straight from the
// canonical pillar list so this stays in sync with domain/pillars.js.
function FocusAreas() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])

  // Single-select: picking a new option always replaces the current one.
  // See ONLY_SELECTABLE_IDS above — a tap on anything else just no-ops.
  const selectOption = (id) => {
    if (ONLY_SELECTABLE_IDS && !ONLY_SELECTABLE_IDS.includes(id)) return
    setSelected([id])
  }

  return (
    <QuestionScreen
      eyebrow="Your focus"
      headlineLines={['Where do you want to', 'start?']}
      body="Pick one to build on first. You can always add more — one at a time is how it sticks."
      options={[]}
      selected={selected}
      onToggle={selectOption}
      onContinue={() => {
        setAnswer('focusPillars', selected)
        navigate('/onboarding/recommendations')
      }}
      onBack={() => navigate('/onboarding/health-conditions')}
      continueLabel="See my plan"
      multiSelect={false}
      className="focus-areas"
      extraContent={
        <div className="focus-grid" role="group" aria-label="Focus areas">
          {FOCUS_OPTIONS.map((pillar) => {
            const isSelected = selected.includes(pillar.id)
            return (
              <button
                key={pillar.id}
                type="button"
                className={`focus-tile${isSelected ? ' focus-tile--selected' : ''}`}
                style={{ backgroundImage: pillar.visual }}
                aria-pressed={isSelected}
                onClick={() => selectOption(pillar.id)}
              >
                <span className="focus-tile__scrim" />
                <span className="focus-tile__label">{pillar.label}</span>
                {isSelected && (
                  <span className="focus-tile__check">
                    <CheckIcon checked />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      }
    />
  )
}

export default FocusAreas
