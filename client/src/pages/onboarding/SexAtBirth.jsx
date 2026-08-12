import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QuestionScreen from './QuestionScreen.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'

// Right after the name question, before FoundationIntro. Single-select
// gender question, phrased inclusively. "Another gender" reveals a
// self-describe field; "Prefer not to say" is the explicit opt-out.
const OTHER_ID = 'another-gender'

const OPTIONS = [
  { id: 'woman', label: 'Woman' },
  { id: 'man', label: 'Man' },
  { id: 'nonbinary', label: 'Nonbinary' },
  { id: OTHER_ID, label: 'Another gender' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
]

function SexAtBirth() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [selected, setSelected] = useState([])
  const [selfDescribe, setSelfDescribe] = useState('')

  // Single-select: picking a new option always replaces the current one.
  const selectOption = (id) => setSelected([id])

  const handleBack = () => navigate('/onboarding/name')

  const handleContinue = () => {
    setAnswer('gender', selected)
    if (selected.includes(OTHER_ID)) setAnswer('genderSelfDescribe', selfDescribe.trim())
    navigate('/onboarding/habits-intro')
  }

  const otherSelected = selected.includes(OTHER_ID)

  return (
    <QuestionScreen
      eyebrow="Health profile"
      headlineLines={['How would you describe', 'your gender?']}
      body="This helps us make your experience feel a little more like you."
      options={OPTIONS}
      selected={selected}
      onToggle={selectOption}
      onContinue={handleContinue}
      onBack={handleBack}
      multiSelect={false}
      extraContent={
        otherSelected ? (
          <div className="question-screen__input-wrap" style={{ marginTop: 'var(--space-3)' }}>
            <input
              type="text"
              className="question-screen__input"
              placeholder="Describe your gender"
              value={selfDescribe}
              onChange={(e) => setSelfDescribe(e.target.value)}
              autoFocus
            />
          </div>
        ) : null
      }
    />
  )
}

export default SexAtBirth
