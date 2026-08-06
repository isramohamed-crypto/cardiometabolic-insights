import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS, NONE_OPTION } from './pillars.js'
import './QuestionScreen.css'
import './Summary.css'

const NUMBER_WORDS = [
  'zero', 'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
]

function numberToWord(n) {
  return NUMBER_WORDS[n] ?? String(n)
}

// Final onboarding screen — recaps what the user said is already working
// across the 5 pillars. Adapted from Figma node 1514:13486 ("You're already
// doing six things.") in the Amgen persona/journey file.
function Summary() {
  const navigate = useNavigate()
  const { answers } = useOnboarding()
  const habitsWorking = answers.habitsWorking || {}

  const pillarSummaries = PILLARS.map((pillar) => {
    const selectedIds = habitsWorking[pillar.id] || []
    const realIds = selectedIds.filter((id) => id !== NONE_OPTION.id)
    const labels = pillar.options
      .filter((option) => realIds.includes(option.id))
      .map((option) => option.label)
    return { pillar, labels }
  })

  const totalCount = pillarSummaries.reduce((sum, p) => sum + p.labels.length, 0)

  const handleBack = () => navigate(`/onboarding/habits/${PILLARS[PILLARS.length - 1].id}`)
  const handleContinue = () => navigate('/onboarding/health-conditions')

  return (
    <main className="question-screen summary">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">Your foundation</p>
        {totalCount > 0 ? (
          // Variable-length content (the count word and "thing"/"things")
          // means this can't use the shared one-span-per-line layout other
          // question-screen headlines rely on for a fixed two-line break —
          // it needs to flow and wrap naturally like a normal sentence.
          <h1 className="question-screen__headline summary__headline">
            You're already doing{' '}
            <span className="summary__highlight">{numberToWord(totalCount)}</span>{' '}
            <span className="summary__highlight">
              {totalCount === 1 ? 'thing.' : 'things.'}
            </span>
          </h1>
        ) : (
          // Every pillar was answered "Skip" — the Continue button
          // requires a selection, so this is the only way
          // totalCount lands at zero. Lead with encouragement, not a blank
          // slate.
          <h1 className="question-screen__headline summary__headline">
            You're already <span className="summary__highlight">making progress.</span>
          </h1>
        )}
      </div>

      <div className="question-screen__body summary__body">
        <p className="summary__intro">
          {totalCount > 0
            ? `Across ${PILLARS.length} parts of your health. That's a real foundation — not a blank slate.`
            : "Taking the first step toward change is progress in itself. Let's build from here."}
        </p>

        {totalCount > 0 && (
          <>
            <div className="summary__divider" />

            <div className="summary__rows">
              {pillarSummaries
                .filter(({ labels }) => labels.length > 0)
                .map(({ pillar, labels }) => (
                  <div className="summary__row-group" key={pillar.id}>
                    <span className="summary__row-label">{pillar.label}</span>
                    {/* Each selected item gets its own line now instead of
                        being joined with " · " into one row — the pillar
                        label sits once per group (not repeated per item),
                        same as a group heading over a short list. */}
                    <div className="summary__row-values">
                      {labels.map((label) => (
                        <span className="summary__row-value" key={label}>
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}

        <div className="question-screen__spacer" />

        <button type="button" className="question-screen__continue" onClick={handleContinue}>
          {totalCount > 0 ? "Now let's build on it →" : "Let's get started"}
        </button>

        <button type="button" className="question-screen__back" onClick={handleBack}>
          <span aria-hidden="true">←</span> Back
        </button>
        <p className="summary__caption">
          These {numberToWord(PILLARS.length)} areas make up your health foundation.
        </p>
      </div>
    </main>
  )
}

export default Summary
