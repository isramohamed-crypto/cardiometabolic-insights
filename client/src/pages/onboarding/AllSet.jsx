import { useNavigate } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import './QuestionScreen.css'

// Closing beat of the first-habit flow: recaps what was just set up before
// handing off to Routine. The habit itself was added to HabitsContext back
// in Recommendations — this screen only reads it back for the recap.
function AllSet() {
  const navigate = useNavigate()
  const { habits } = useHabits()
  const habit = habits[habits.length - 1]

  return (
    <main className="question-screen">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">That's it</p>
        <h1 className="question-screen__headline">
          <span>You're all set.</span>
        </h1>
      </div>

      <div className="question-screen__body">
        <p className="question-screen__intro">
          {habit
            ? `"${habit.title}" is on your Routine, starting today${habit.moment ? ` — ${habit.moment.toLowerCase()}` : ''}.`
            : 'Your first habit is on your Routine, starting today.'}
        </p>
        <p className="question-screen__intro">
          A week from now, we'll check in and ask how it's going — keep it, make it smaller, or
          let it go. No pressure either way.
        </p>

        <div className="question-screen__spacer" />

        <button type="button" className="question-screen__continue" onClick={() => navigate('/routine')}>
          Go to my routine
        </button>
      </div>
    </main>
  )
}

export default AllSet
