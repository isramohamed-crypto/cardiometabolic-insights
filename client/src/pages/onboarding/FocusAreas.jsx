import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS_CANONICAL } from '../../domain/pillars.js'
import './FocusAreas.css'

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
  const selectOption = (id) => setSelected([id])

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
