import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'

// First of the post-summary questions — optional health context, not part
// of "Existing habits" pillar sequence. Followed by FocusAreas.jsx (the
// final onboarding question) before landing on /routine.
//
// Two distinct opt-out chips rather than one: "None of the above" is a
// real, informative answer (no conditions apply), while "Prefer not to
// say" is a privacy declination (conditions may apply, just not sharing
// them) — different signals worth keeping separate. Either one, like any
// real option, now requires an explicit tap: requireSelection defaults to
// true (see QuestionScreen.jsx), so there's no bare "Skip for now" escape
// hatch left on the Continue button.
const NONE_OF_THE_ABOVE = { id: 'none-of-the-above', label: 'None of the above' }
const PREFER_NOT_TO_SAY = { id: 'prefer-not-to-say', label: 'Prefer not to say' }
const OPT_OUT_IDS = [NONE_OF_THE_ABOVE.id, PREFER_NOT_TO_SAY.id]

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
  NONE_OF_THE_ABOVE,
  PREFER_NOT_TO_SAY,
]

function HealthConditions() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])

  const toggleOption = (id) => {
    setSelected((prev) => {
      if (OPT_OUT_IDS.includes(id)) {
        return prev.includes(id) ? [] : [id]
      }
      const withoutOptOuts = prev.filter((item) => !OPT_OUT_IDS.includes(item))
      return withoutOptOuts.includes(id)
        ? withoutOptOuts.filter((item) => item !== id)
        : [...withoutOptOuts, id]
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
      headlineLines={['Anything else on your mind,', 'health-wise?']}
      body="Totally optional — it helps us point things the right way."
      options={CONDITIONS}
      selected={selected}
      onToggle={toggleOption}
      onContinue={handleContinue}
      onBack={handleBack}
    />
  )
}

export default HealthConditions
