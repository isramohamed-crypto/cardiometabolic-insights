import './QuestionScreen.css'

/**
 * Shared layout for onboarding question screens: a colored header block
 * (eyebrow + step progress + headline) over a list of toggleable pill
 * options, ending in a Continue CTA. Pattern adapted from Figma node
 * 1514:14884 ("And what never quite sticks?") in the Amgen persona/journey
 * file — reused here with different copy for the "what's already working"
 * question.
 *
 * Visual style (color, type, etc.) is intentionally uniform across every
 * onboarding screen for now — see --question-accent in QuestionScreen.css.
 * Don't vary it per-screen until real branding direction is given.
 */
function QuestionScreen({
  eyebrow,
  step,
  totalSteps,
  headlineLines,
  body,
  options,
  selected,
  onToggle,
  onContinue,
  onBack,
  continueLabel = 'Continue',
  requireSelection = true,
  multiSelect = true,
}) {
  const canContinue = !requireSelection || selected.length > 0

  return (
    <main className="question-screen">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">
          {eyebrow}
          {step && totalSteps ? ` · ${step} of ${totalSteps}` : null}
        </p>
        <h1 className="question-screen__headline">
          {headlineLines.map((line) => (
            <span className="question-screen__headline-line" key={line}>
              {line}
            </span>
          ))}
        </h1>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro">{body}</p>

        <div className="question-screen__options" role="group" aria-label={eyebrow}>
          {options.map((option) => {
            const isSelected = selected.includes(option.id)
            return (
              <button
                key={option.id}
                type="button"
                className={`question-screen__option${isSelected ? ' question-screen__option--selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onToggle(option.id)}
              >
                {multiSelect && (
                  <span className="question-screen__option-check" aria-hidden="true">
                    {isSelected ? '✓' : ''}
                  </span>
                )}
                <span>{option.label}</span>
              </button>
            )
          })}
        </div>

        <div className="question-screen__spacer" />

        {onBack && (
          <button type="button" className="question-screen__back" onClick={onBack}>
            <span aria-hidden="true">←</span> Back
          </button>
        )}

        <button
          type="button"
          className="question-screen__continue"
          disabled={!canContinue}
          onClick={onContinue}
        >
          {continueLabel}
        </button>
      </div>
    </main>
  )
}

export default QuestionScreen
