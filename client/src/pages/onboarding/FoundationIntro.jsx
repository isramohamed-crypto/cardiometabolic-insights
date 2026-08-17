import { useNavigate } from 'react-router-dom'
import { PILLARS } from './pillars.js'
import { getAclmIcon } from '../../domain/aclmIcons.js'
import './QuestionScreen.css'
import './FoundationIntro.css'

// Cover page for "Existing habits" — sits between the brand picker and the first
// "what's already working" pillar question (PillarQuestion), so it's not
// a question itself and has no options list, just a headline/body/CTA
// like AllSet at the other end of onboarding. Doubles as the ACLM
// (American College of Lifestyle Medicine) credibility moment: this is
// where the 5-pillar framework and its ACLM terms (Optimal Nutrition,
// Physical Activity, etc.) first appear, so PillarQuestion's "Your
// Foundation: {pillar}" eyebrows and Summary's pillar rows later on read
// as a continuation of language already introduced here, not new
// vocabulary. The CTA is a flat "Let's get started" rather than naming
// PILLARS[0] — the framework itself is the thing being introduced, not a
// specific starting pillar.
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
        {/* Replaces the old "Tap anything that sounds like you" prompt —
            there's nothing to tap on this screen anymore, just the
            framework itself, so the copy here frames it instead of
            instructing an action. */}
        <p className="question-screen__intro">
          Built on the principles of the American College of Lifestyle
          Medicine — the pillars of a longer, healthier life.
        </p>

        <ul className="foundation-intro__pillars">
          {PILLARS.map((pillar) => (
            <li className="foundation-intro__pillar" key={pillar.id}>
              <img
                src={getAclmIcon(pillar.id)}
                alt=""
                className="foundation-intro__pillar-icon"
              />
              <span className="foundation-intro__pillar-label">{pillar.label}</span>
            </li>
          ))}
        </ul>

        <div className="question-screen__spacer" />

        <button type="button" className="question-screen__continue" onClick={handleContinue}>
          Let's get started
        </button>
      </div>
    </main>
  )
}

export default FoundationIntro
