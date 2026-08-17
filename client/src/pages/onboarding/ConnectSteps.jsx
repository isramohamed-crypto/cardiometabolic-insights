import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import './QuestionScreen.css'

// New step between finalizing the first habit and account creation: offer
// to hook up passive tracking (steps, workouts) so movement-adjacent habits
// can log automatically instead of requiring a manual tap every day. No
// real device/health-app integration exists yet — connecting is mocked
// (a short "connecting…" beat, then marked connected in local state only).
const SOURCES = [
  { id: 'apple-health', label: 'Apple Health' },
  { id: 'google-fit', label: 'Google Fit' },
  { id: 'fitbit', label: 'Fitbit' },
]

function ConnectSteps() {
  const navigate = useNavigate()
  const { setAnswer } = useOnboarding()
  const [connecting, setConnecting] = useState(null)
  const [connected, setConnected] = useState(null)

  const handleConnect = (source) => {
    setConnecting(source.id)
    setTimeout(() => {
      setConnecting(null)
      setConnected(source.id)
      // Recorded on the shared onboarding answers (rather than kept only
      // in this component's own state) so it survives past this one
      // screen — HabitDetail reads it back to show "Tracked with
      // {source}" under the day tracker.
      setAnswer('connectedTracker', source.label)
    }, 900)
  }

  return (
    <main className="question-screen">
      <button
        type="button"
        className="question-screen__back question-screen__back--top"
        onClick={() => navigate('/onboarding/recommendations')}
      >
        <span aria-hidden="true">←</span> Back
      </button>

      <div className="question-screen__header">
        <p className="question-screen__eyebrow">One more thing</p>
        <h1 className="question-screen__headline">
          <span>Want habits to</span>{' '}
          <span>track themselves?</span>
        </h1>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro">
          Connect a steps or activity source and some habits can check themselves off — no
          manual tap needed. Optional, and you can always do this later from Me.
        </p>

        <div className="question-screen__options">
          {SOURCES.map((source) => {
            const isConnected = connected === source.id
            const isConnecting = connecting === source.id
            return (
              <button
                key={source.id}
                type="button"
                className={`question-screen__option${isConnected ? ' question-screen__option--selected' : ''}`}
                onClick={() => handleConnect(source)}
                disabled={isConnecting || (connected && !isConnected)}
              >
                <span>
                  {source.label}
                  {isConnecting && ' — connecting…'}
                  {isConnected && ' — connected'}
                </span>
              </button>
            )
          })}
        </div>

        <div className="question-screen__spacer" />

        <button
          type="button"
          className="question-screen__continue"
          onClick={() => navigate('/create-account')}
        >
          {connected ? 'Continue' : 'Not now'}
        </button>
      </div>
    </main>
  )
}

export default ConnectSteps
