import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import './QuestionScreen.css'
import './AllSet.css'

// How long the CTA's "pop" plays before actually navigating — long enough
// to read as a deliberate tap response, short enough that it doesn't feel
// like the button is ignoring you. Kept as a named constant since both the
// setTimeout below and the CSS animation duration (AllSet.css's
// .all-set__continue--pop) need to agree on it.
const CTA_POP_MS = 260

// Closing beat of the first-habit flow: recaps what was just set up before
// handing off to Routine. The habit itself was added to HabitsContext back
// in Recommendations — this screen only reads it back for the recap.
//
// Used to just appear fully-formed, same as every other question-screen —
// fine for a question, flat for the one moment in onboarding that's meant
// to feel like a small win. The checkmark badge pops in with a ripple, and
// the eyebrow/headline/copy/CTA cascade in right after (see AllSet.css) —
// plain CSS @keyframes, same approach as Onboarding.css's landing ticker,
// no animation library. All of it collapses under prefers-reduced-motion.
function AllSet() {
  const navigate = useNavigate()
  const { habits } = useHabits()
  const habit = habits[habits.length - 1]
  const [ctaPopping, setCtaPopping] = useState(false)

  const handleGoToRoutine = () => {
    // Reduced-motion users get the same instant navigation they'd get from
    // any other button — the pop is pure flourish, not something worth a
    // deliberate wait once the animation itself is suppressed by CSS.
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      navigate('/routine')
      return
    }
    setCtaPopping(true)
    setTimeout(() => navigate('/routine'), CTA_POP_MS)
  }

  return (
    <main className="question-screen all-set">
      <button
        type="button"
        className="question-screen__back question-screen__back--top"
        onClick={() => navigate('/create-account')}
      >
        <span aria-hidden="true">←</span> Back
      </button>

      <div className="question-screen__header">
        <p className="question-screen__eyebrow all-set__in all-set__in--1">That's it</p>
        <h1 className="question-screen__headline all-set__in all-set__in--2">
          <span>You're all set.</span>
        </h1>
        {/* Below the headline (not above it) and sized as the screen's
            focal point — this one moment in onboarding is meant to read as
            a small win, not just another question-screen icon. */}
        <div className="all-set__badge" aria-hidden="true">
          <span className="all-set__badge-check">✓</span>
        </div>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro all-set__in all-set__in--3">
          {habit
            ? `"${habit.title}" is on your Today list, starting today${habit.moment ? ` — ${habit.moment.toLowerCase()}` : ''}.`
            : 'Your first habit is on your Today list, starting today.'}
        </p>
        <p className="question-screen__intro all-set__in all-set__in--4">
          A week from now, we'll check in and ask how it's going — keep it, make it smaller, or
          let it go. No pressure either way.
        </p>

        <div className="question-screen__spacer" />

        <button
          type="button"
          className={`question-screen__continue all-set__in all-set__in--5${
            ctaPopping ? ' all-set__continue--pop' : ''
          }`}
          onClick={handleGoToRoutine}
        >
          Go to my routine
        </button>
      </div>
    </main>
  )
}

export default AllSet
