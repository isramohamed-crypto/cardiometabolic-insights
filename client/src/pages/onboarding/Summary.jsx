import { useNavigate } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { PILLARS, NONE_OPTION } from './pillars.js'
import { getAclmIcon } from '../../domain/aclmIcons.js'
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
      <button
        type="button"
        className="question-screen__back question-screen__back--top"
        onClick={handleBack}
      >
        <span aria-hidden="true">←</span> Back
      </button>

      <div className="question-screen__header">
        <p className="question-screen__eyebrow">Your foundation</p>
        {totalCount > 0 ? (
          // Variable-length content (the count word and "thing"/"things")
          // means this can't use the shared one-span-per-line layout other
          // question-screen headlines rely on for a fixed two-line break —
          // it needs to flow and wrap naturally like a normal sentence.
          <h1 className="question-screen__headline summary__headline">
            Look at you{answers.name ? `, ${answers.name}` : ''} —{' '}
            <span className="summary__highlight">
              {totalCount} health {totalCount === 1 ? 'win' : 'wins'}
            </span>{' '}
            already! 🎉
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
            ? "You've already put so many positive things in place. Take a moment to feel good about that — you're starting with a real foundation."
            : "Taking the first step toward change is progress in itself. Let's build from here."}
        </p>

        {totalCount > 0 && (
          <div className="summary__card">
            {pillarSummaries
              .filter(({ labels }) => labels.length > 0)
              .map(({ pillar, labels }, i) => (
                <div className="summary__row-group" key={pillar.id}>
                  {/* No divider above the first group — the card's own
                      border already separates the whole list from the
                      intro paragraph above it. */}
                  {i > 0 && <div className="summary__divider" />}
                  <span className="summary__row-label">
                    <img
                      src={getAclmIcon(pillar.id)}
                      alt=""
                      className="summary__row-icon"
                    />
                    {pillar.label}
                  </span>
                  {/* Each selected item is its own bulleted line — a small
                      square marker plus the label, wrapping under its own
                      text rather than under the bullet on longer items. */}
                  <ul className="summary__row-values">
                    {labels.map((label) => (
                      <li className="summary__row-value" key={label}>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        )}

        <div className="question-screen__spacer" />

        <button type="button" className="question-screen__continue" onClick={handleContinue}>
          {totalCount > 0 ? "Now let's build on it →" : "Let's get started"}
        </button>
        <p className="summary__caption">
          These {numberToWord(PILLARS.length)} areas make up your health foundation.
        </p>
      </div>
    </main>
  )
}

export default Summary
