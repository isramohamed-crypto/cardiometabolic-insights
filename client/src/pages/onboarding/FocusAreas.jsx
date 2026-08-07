import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import './FocusAreas.css'

// Temporary launch restriction — only "moving" is a real focus area for
// now, but every pillar should still render normally (same look, same
// hover/press behavior) rather than showing a disabled state, so nothing
// here tips the person off that most of the row is inert. Set this to
// null (or delete the guard in selectOption below) to make every pillar
// selectable again — that's the entire revert, no markup/CSS changes
// needed since nothing about how an option looks was ever touched.
const ONLY_SELECTABLE_IDS = ['moving']

// Final onboarding question — which single pillar (category) the user
// wants to focus on first. Single-select on purpose: staying focused on
// one area builds momentum, and more can be added later. Options come
// straight from the canonical pillar list so this stays in sync with
// domain/pillars.js automatically. The "focus-areas" className is just an
// anchor for FocusAreas.css to scope a bigger/brighter Continue button to
// this one screen — see that file for why.
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

  const handleBack = () => navigate('/onboarding/health-conditions')

  const handleContinue = () => {
    setAnswer('focusPillars', selected)
    navigate('/onboarding/recommendations')
  }

  return (
    <QuestionScreen
      eyebrow="Your focus"
      headlineLines={['Which area do you', 'want to focus on?']}
      body="You can add more later — staying focused on one area first helps you build momentum."
      options={PILLARS_CANONICAL}
      selected={selected}
      onToggle={selectOption}
      onContinue={handleContinue}
      onBack={handleBack}
      continueLabel="See my plan"
      multiSelect={false}
      className="focus-areas"
    />
  )
}

export default FocusAreas
