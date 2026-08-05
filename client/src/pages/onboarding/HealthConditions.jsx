import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'

// First of the post-summary questions — optional health context, not part
// of "Existing habits" pillar sequence. Followed by FocusAreas.jsx (the
// final onboarding question) before landing on /routine.
const PREFER_NOT_TO_SAY = { id: 'prefer-not-to-say', label: 'Prefer not to say' }

const CONDITIONS = [
  { id: 'high-blood-pressure', label: 'High blood pressure' },
  { id: 'high-cholesterol', label: 'High cholesterol' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'heart-disease', label: 'Heart disease' },
  { id: 'thyroid', label: 'Thyroid condition' },
  { id: 'arthritis', label: 'Arthritis or joint pain' },
  { id: 'anxiety-depression', label: 'Anxiety or depression' },
  { id: 'asthma', label: 'Asthma or respiratory condition' },
  { id: 'sleep-apnea', label: 'Sleep apnea' },
  PREFER_NOT_TO_SAY,
]

function HealthConditions() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])

  const toggleOption = (id) => {
    setSelected((prev) => {
      if (id === PREFER_NOT_TO_SAY.id) {
        return prev.includes(id) ? [] : [id]
      }
      const withoutOptOut = prev.filter((item) => item !== PREFER_NOT_TO_SAY.id)
      return withoutOptOut.includes(id)
        ? withoutOptOut.filter((item) => item !== id)
        : [...withoutOptOut, id]
    })
  }

  const handleBack = () => navigate('/onboarding/summary')

  const handleContinue = () => {
    setAnswer('healthConditions', selected)
    navigate('/onboarding/focus')
  }

  return (
    <QuestionScreen
      eyebrow="Health profile"
      headlineLines={['What health conditions', 'are you currently monitoring?']}
      body="Totally optional — it helps us point things the right way."
      options={CONDITIONS}
      selected={selected}
      onToggle={toggleOption}
      onContinue={handleContinue}
      onBack={handleBack}
      requireSelection={false}
      continueLabel={selected.length > 0 ? 'Continue' : 'Skip for now'}
    />
  )
}

export default HealthConditions
