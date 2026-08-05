import { useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import RoutineHabitCard from './RoutineHabitCard.jsx'
import AddHabitFlow from './AddHabitFlow.jsx'
import './page.css'

const OWNED_STATES = [OWNERSHIP_STATE.ADOPTED, OWNERSHIP_STATE.OWNED, OWNERSHIP_STATE.READOPTED]

// The full roster, one level up from Routine's day-to-day view: what's
// still on trial, what's already yours, and — if every slot is spoken
// for — a locked placeholder for whichever habit comes next. A slot
// frees up the moment a trial resolves to "Keep it" or "Make it smaller"
// (see HabitDetail + HabitsContext's unlockSlot).
function Collection() {
  const { habits, slotCount } = useHabits()
  const [addingHabit, setAddingHabit] = useState(false)

  const workingOnIt = habits.filter((h) => h.ownershipState === OWNERSHIP_STATE.TRIALED)
  const alreadyYours = habits.filter((h) => OWNED_STATES.includes(h.ownershipState))
  const activeCount = workingOnIt.length + alreadyYours.length
  const nextSlotLocked = activeCount >= slotCount

  if (habits.length === 0) {
    return (
      <div className="page">
        <p className="page__lead">Nothing here yet.</p>
        <p>Pick your first habit from Routine to start your collection.</p>
      </div>
    )
  }

  // Adding a habit later happens right here in the page body — AppLayout's
  // Header/Footer stay mounted throughout, same as on Routine.
  if (addingHabit) {
    return (
      <div className="page">
        <AddHabitFlow onClose={() => setAddingHabit(false)} />
      </div>
    )
  }

  return (
    <div className="page">
      <p className="page__lead">Everything you're working on, and everything you've made yours.</p>

      {workingOnIt.length > 0 && (
        <section>
          <h2>Working on it</h2>
          <div className="routine-habit-list">
            {workingOnIt.map((habit) => (
              <RoutineHabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>
      )}

      {nextSlotLocked ? (
        <section>
          <h2>Next slot</h2>
          <div className="locked-slot">
            <span className="locked-slot__icon" aria-hidden="true">
              🔒
            </span>
            <div>
              <p className="locked-slot__title">Locked for now</p>
              <p className="locked-slot__desc">
                Finish a trial — keep it or make it smaller — and this opens up.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <h2>Next slot</h2>
          <button type="button" className="open-slot" onClick={() => setAddingHabit(true)}>
            <span className="open-slot__icon" aria-hidden="true">
              +
            </span>
            <div>
              <p className="open-slot__title">Add a habit</p>
              <p className="open-slot__desc">You've got room for one more.</p>
            </div>
          </button>
        </section>
      )}

      {alreadyYours.length > 0 && (
        <section>
          <h2>Already yours</h2>
          <div className="routine-habit-list">
            {alreadyYours.map((habit) => (
              <RoutineHabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Collection
