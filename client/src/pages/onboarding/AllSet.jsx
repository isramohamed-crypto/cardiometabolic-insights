import { useNavigate } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import './QuestionScreen.css'
import './AllSet.css'

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

  return (
    <main className="question-screen all-set">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow all-set__in all-set__in--1">That's it</p>
        <div className="all-set__badge" aria-hidden="true">
          <span className="all-set__badge-check">✓</span>
        </div>
        <h1 className="question-screen__headline all-set__in all-set__in--2">
          <span>You're all set.</span>
        </h1>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro all-set__in all-set__in--3">
          {habit
            ? `"${habit.title}" is on your Routine, starting today${habit.moment ? ` — ${habit.moment.toLowerCase()}` : ''}.`
            : 'Your first habit is on your Routine, starting today.'}
        </p>
        <p className="question-screen__intro all-set__in all-set__in--4">
          A week from now, we'll check in and ask how it's going — keep it, make it smaller, or
          let it go. No pressure either way.
        </p>

        <div className="question-screen__spacer" />

        <button
          type="button"
          className="question-screen__continue all-set__in all-set__in--5"
          onClick={() => navigate('/routine')}
        >
          Go to my routine
        </button>
      </div>
    </main>
  )
}

export default AllSet
