import { useNavigate } from 'react-router-dom'
import { PILLARS } from './pillars.js'
import './QuestionScreen.css'
import './FoundationIntro.css'

// Cover page for "Existing habits" — sits between SexAtBirth and the first
// "what's already working" pillar question (PillarQuestion), so it's not
// a question itself and has no options list, just a headline/body/CTA
// like AllSet at the other end of onboarding. "Start with {pillar}" reads
// off PILLARS[0] rather than hardcoding "eating", so it stays correct if
// the pillar order ever changes.
function FoundationIntro() {
  const navigate = useNavigate()
  const firstPillar = PILLARS[0]

  const handleContinue = () => {
    navigate(`/onboarding/habits/${firstPillar.id}`)
  }

  return (
    <main className="question-screen foundation-intro">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">Your foundation</p>
        {/* Deliberately not the shared headlineLines (fixed one-span-
            per-line) pattern most other question-screens use — this
            wraps naturally instead, via foundation-intro__headline's
            override below, so it isn't locked to a break point that only
            happens to fit today's copy. */}
        <h1 className="question-screen__headline foundation-intro__headline">
          Let's start with{' '}
          <span className="foundation-intro__highlight">what's already working.</span>
        </h1>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro">
          Tap anything that sounds like you — roughly counts. Nothing here is a test.
        </p>

        <div className="question-screen__spacer" />

        <button type="button" className="question-screen__continue" onClick={handleContinue}>
          Start with {firstPillar.label.toLowerCase()}
        </button>
      </div>
    </main>
  )
}

export default FoundationIntro
