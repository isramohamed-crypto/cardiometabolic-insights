import { useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { pickDailyContent } from '../../domain/habitContent.js'
import RoutineHabitCard from './RoutineHabitCard.jsx'
import './page.css'

const BUILDING_STATES = [
  OWNERSHIP_STATE.ADOPTED,
  OWNERSHIP_STATE.OWNED,
  OWNERSHIP_STATE.READOPTED,
]

function Routine() {
  const { habits } = useHabits()

  // Picked once per mount — i.e. once per visit to this page — so each
  // habit's reinforcement content rotates every time the user enters the
  // Routine tab, rather than staying fixed for the whole session.
  const [dailyContent] = useState(() => {
    const map = {}
    habits.forEach((h) => {
      map[h.id] = pickDailyContent(h.id, h.startedAt)
    })
    return map
  })

  const tryingOn = habits.filter((h) => h.ownershipState === OWNERSHIP_STATE.TRIALED)
  const building = habits.filter((h) => BUILDING_STATES.includes(h.ownershipState))

  return (
    <div className="page">
      {tryingOn.length > 0 && (
        <section>
          <h2>Habits I'm trying on</h2>
          <div className="routine-habit-list">
            {tryingOn.map((habit) => (
              <RoutineHabitCard key={habit.id} habit={habit} content={dailyContent[habit.id]} />
            ))}
          </div>
        </section>
      )}

      {building.length > 0 && (
        <section>
          <h2>Habits I'm building</h2>
          <div className="routine-habit-list">
            {building.map((habit) => (
              <RoutineHabitCard key={habit.id} habit={habit} content={dailyContent[habit.id]} />
            ))}
          </div>
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
