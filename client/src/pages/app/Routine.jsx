import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { pickDailyContent } from '../../domain/habitContent.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import ContentCard from '../../components/ContentCard.jsx'
import RoutineHabitCard from './RoutineHabitCard.jsx'
import AddHabitFlow from './AddHabitFlow.jsx'
import './page.css'

const BUILDING_STATES = [
  OWNERSHIP_STATE.ADOPTED,
  OWNERSHIP_STATE.OWNED,
  OWNERSHIP_STATE.READOPTED,
]

const ACTIVE_STATES = [OWNERSHIP_STATE.TRIALED, ...BUILDING_STATES]

function Routine() {
  const { habits, slotCount } = useHabits()
  const [addingHabit, setAddingHabit] = useState(false)

  // Picked once per mount — i.e. once per visit to this page — so tonight's
  // pick rotates every time the user enters the Routine tab, rather than
  // staying fixed for the whole session.
  const [dailyContent] = useState(() => {
    const map = {}
    habits.forEach((h) => {
      map[h.id] = pickDailyContent(h.id, h.startedAt)
    })
    return map
  })

  const tryingOn = habits.filter((h) => h.ownershipState === OWNERSHIP_STATE.TRIALED)
  const building = habits.filter((h) => BUILDING_STATES.includes(h.ownershipState))
  const activeCount = habits.filter((h) => ACTIVE_STATES.includes(h.ownershipState)).length
  const nextSlotLocked = activeCount >= slotCount

  // One shared "tonight" pick per active habit, combined into a single
  // section below the habit cards — rather than repeating a content teaser
  // underneath each individual card.
  const tonightPicks = habits
    .filter((h) => ACTIVE_STATES.includes(h.ownershipState))
    .map((h) => ({ habit: h, content: dailyContent[h.id] }))
    .filter((entry) => entry.content)

  // Adding a habit later happens right here in the page body — AppLayout's
  // Header/Footer stay mounted throughout, unlike onboarding's version of
  // this same flow, which is a full standalone screen.
  if (addingHabit) {
    return (
      <div className="page">
        <AddHabitFlow onClose={() => setAddingHabit(false)} />
      </div>
    )
  }

  return (
    <div className="page">
      {tryingOn.length > 0 && (
        <section>
          <h2>Habits I'm trying on</h2>
          <div className="routine-habit-list">
            {tryingOn.map((habit) => (
              <RoutineHabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>
      )}

      {building.length > 0 && (
        <section>
          <h2>Habits I'm building</h2>
          <div className="routine-habit-list">
            {building.map((habit) => (
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
        habits.length > 0 && (
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
        )
      )}

      {tonightPicks.length > 0 && (
        <section>
          <h2>New for you tonight</h2>
          <div className="routine-habit-list">
            {tonightPicks.map(({ habit, content }) => (
              <ContentCard
                key={content.id}
                id={content.id}
                thumbnail={getHabitVisual(habit.pillarId, habit.id)}
                brand={content.brand}
                title={content.title}
                body={content.body}
              />
            ))}
          </div>
          <Link
            to="/read"
            className="routine-habit-card__drip-more"
            style={{ display: 'inline-block', marginTop: 10 }}
          >
            See more in Read →
          </Link>
        </section>
      )}

      {habits.length === 0 && (
        <section>
          <h2>Today</h2>
          <p>Pick a habit to start building your routine.</p>
        </section>
      )}
    </div>
  )
}

export default Routine
