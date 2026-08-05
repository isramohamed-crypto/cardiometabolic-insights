import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'

// Right after the name question, before FoundationIntro (the cover page
// for "Existing habits" pillar sequence) — sensitive by nature, so the
// subtext under the headline exists
// specifically to explain why we're asking (some guidance genuinely
// differs by sex assigned at birth) rather than just collecting data for
// its own sake. Single-select, and skippable without picking anything —
// same pattern as HealthConditions later in the flow: "Prefer not to say"
// is the explicit opt-out chip, and requireSelection={false} means
// Continue itself also just becomes "Skip for now" if someone doesn't
// want to answer at all.
const PREFER_NOT_TO_SAY = { id: 'prefer-not-to-say', label: 'Prefer not to say' }

const OPTIONS = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  PREFER_NOT_TO_SAY,
]

function SexAtBirth() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])

  // Single-select: picking a new option always replaces the current one.
  const selectOption = (id) => setSelected([id])

  const handleBack = () => navigate('/onboarding/name')

  const handleContinue = () => {
    setAnswer('sexAtBirth', selected)
    navigate('/onboarding/habits-intro')
  }

  return (
    <QuestionScreen
      eyebrow="Health profile"
      headlineLines={['What sex were you', 'assigned at birth?']}
      body="Some of the guidance differs — this is the only reason we ask."
      options={OPTIONS}
      selected={selected}
      onToggle={selectOption}
      onContinue={handleContinue}
      onBack={handleBack}
      requireSelection={false}
      continueLabel={selected.length > 0 ? 'Continue' : 'Skip for now'}
      multiSelect={false}
    />
  )
}

export default SexAtBirth
