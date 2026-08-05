import { useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { getPillarLabel } from '../../domain/pillars.js'
import { PILLARS, NONE_OPTION } from '../onboarding/pillars.js'
import RoutineHabitCard from './RoutineHabitCard.jsx'
import AddHabitFlow from './AddHabitFlow.jsx'
import './page.css'

const OWNED_STATES = [OWNERSHIP_STATE.ADOPTED, OWNERSHIP_STATE.OWNED, OWNERSHIP_STATE.READOPTED]

// The "brought with you" habits used to live on their own on the Me tab
// (just pillar -> option labels, straight from onboarding's answers) —
// moved here and reshaped into the same {title, subtitle, key} row shape
// as the graduated habits below, so both sources can render through one
// list (see AlreadyYoursRow).
function foundationRows(habitsWorking) {
  return PILLARS.flatMap((pillar) => {
    const ids = (habitsWorking[pillar.id] || []).filter((id) => id !== NONE_OPTION.id)
    return pillar.options
      .filter((option) => ids.includes(option.id))
      .map((option) => ({
        key: `foundation-${pillar.id}-${option.id}`,
        title: option.label,
        subtitle: pillar.label,
      }))
  })
}

function graduatedRows(habits) {
  return habits
    .filter((h) => OWNED_STATES.includes(h.ownershipState))
    .map((habit) => ({
      key: habit.id,
      title: habit.title,
      subtitle: getPillarLabel(habit.pillarId),
    }))
}

function AlreadyYoursRow({ title, subtitle }) {
  return (
    <div className="already-yours-row">
      <div className="already-yours-row__text">
        <p className="already-yours-row__title">{title}</p>
        <p className="already-yours-row__subtitle">{subtitle}</p>
      </div>
      <span className="already-yours-row__dot" aria-hidden="true" />
    </div>
  )
}

// The full roster, one level up from Routine's day-to-day view: what's
// still on trial, and everything that's already yours — habits you
// brought with you at onboarding plus ones you've graduated out of a
// trial — with a locked placeholder for whichever habit comes next when
// every slot is spoken for. A slot frees up the moment a trial resolves to
// "Keep it" or "Make it smaller" (see HabitDetail + HabitsContext's
// unlockSlot).
function Collection() {
  const { habits, slotCount } = useHabits()
  const { answers } = useOnboarding()
  const [addingHabit, setAddingHabit] = useState(false)

  const workingOnIt = habits.filter((h) => h.ownershipState === OWNERSHIP_STATE.TRIALED)
  const graduated = graduatedRows(habits)
  const alreadyYours = [...foundationRows(answers.habitsWorking || {}), ...graduated]
  const activeCount = workingOnIt.length + graduated.length
  const nextSlotLocked = activeCount >= slotCount

  // Foundation habits ("brought with you") can populate this page even
  // before any real habit has been started through Routine/Add a habit —
  // only bail out to the empty state when there's truly nothing at all.
  if (habits.length === 0 && alreadyYours.length === 0) {
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
          <h2>
            Already yours <span className="page__count">{alreadyYours.length}</span>
          </h2>
          <div className="already-yours-list">
            {alreadyYours.map((row) => (
              <AlreadyYoursRow key={row.key} title={row.title} subtitle={row.subtitle} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Collection
