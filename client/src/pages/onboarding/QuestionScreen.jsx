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
 * Don't vary it per-screen until real branding direction is given. The one
 * escape hatch is `className`, which adds an extra class onto the root
 * <main> so a single screen can scope its own override (e.g. a bigger,
 * brighter Continue button) via a compound selector like
 * `.focus-areas .question-screen__continue`, the same pattern
 * HabitDetail/Summary already use elsewhere — without that, per-screen
 * tweaks would either leak into every other screen or need a whole
 * one-off component.
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
  className,
}) {
  const canContinue = !requireSelection || selected.length > 0

  return (
    <main className={`question-screen${className ? ` ${className}` : ''}`}>
      {onBack && (
        <button
          type="button"
          className="question-screen__back question-screen__back--top"
          onClick={onBack}
        >
          <span aria-hidden="true">←</span> Back
        </button>
      )}

      <div className="question-screen__header">
        <p className="question-screen__eyebrow">{eyebrow}</p>

        {/* Only the pillar questions (PillarQuestion) pass step/totalSteps
            — everything else renders no bar, same as the "· step of
            totalSteps" text this replaced. Dots up to (not including) the
            current step read as "completed"; the current step itself is
            included too, so the first pillar screen shows one filled dot
            rather than none. */}
        {step && totalSteps ? (
          <div
            className="question-screen__progress"
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${step} of ${totalSteps}`}
          >
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={`question-screen__progress-dot${i < step ? ' question-screen__progress-dot--filled' : ''}`}
              />
            ))}
          </div>
        ) : null}

        <h1 className="question-screen__headline">
          {/* A real leading space (as its own text child, not CSS generated
              content) on every line but the first — renders as a normal
              word-space when both lines fit on one row, and collapses away
              cleanly at a wrap point when they don't. See
              QuestionScreen.css's note on .question-screen__headline-line. */}
          {headlineLines.map((line, i) => (
            <span className="question-screen__headline-line" key={line}>
              {i > 0 ? ' ' : ''}
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
