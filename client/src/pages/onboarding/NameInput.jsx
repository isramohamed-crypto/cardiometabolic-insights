import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import './QuestionScreen.css'

// First onboarding step — collects the user's name before the habit
// questions. Reuses the same header/body/CTA chrome as QuestionScreen.jsx,
// swapping the option list for a text input.
function NameInput() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [name, setName] = useState('')

  const canContinue = name.trim().length > 0

  const handleContinue = () => {
    if (!canContinue) return
    setAnswer('name', name.trim())
    navigate('/onboarding/habits/eating')
  }

  const handleSkip = () => {
    navigate('/onboarding/habits/eating')
  }

  return (
    <main className="question-screen">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">Welcome</p>
        <h1 className="question-screen__headline">
          <span className="question-screen__headline-line">What should we</span>
          <span className="question-screen__headline-line">call you?</span>
        </h1>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro">
          We'll use this to personalize your experience.
        </p>

        <input
          type="text"
          className="question-screen__input"
          placeholder="Your first name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleContinue()
          }}
          autoFocus
        />

        <div className="question-screen__spacer" />

        <button
          type="button"
          className="question-screen__continue"
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </button>

        <button type="button" className="question-screen__skip" onClick={handleSkip}>
          Skip for now
        </button>
      </div>
    </main>
  )
}

export default NameInput
