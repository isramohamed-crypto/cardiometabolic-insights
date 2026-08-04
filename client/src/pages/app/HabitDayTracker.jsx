import { LOG_STATUS } from '../../domain/habit.js'
import './HabitDayTracker.css'

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function startOfDay(value) {
  const d = new Date(value)
  d.setHours(0, 0, 0, 0)
  return d
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

// The 7 days starting the day a habit was adopted (startedAt), each marked
// done / not done from the habit's log. Days after today show as
// "upcoming" rather than missed — they haven't happened yet. Today also
// gets a secondary dot, on top of its own done/not-done state.
function HabitDayTracker({ startedAt, log = [] }) {
  const start = startOfDay(startedAt || new Date())
  const today = startOfDay(new Date())

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    const dateKey = toDateKey(date)
    const isFuture = date.getTime() > today.getTime()
    const isToday = date.getTime() === today.getTime()
    const done = log.some(
      (entry) => entry.date === dateKey && entry.status === LOG_STATUS.DONE,
    )

    return { dateKey, isFuture, isToday, done, letter: DAY_LETTERS[date.getDay()] }
  })

  return (
    <div className="habit-day-tracker" role="list" aria-label="7-day habit tracker">
      {days.map((day) => {
        const statusLabel = day.isFuture ? 'upcoming' : day.done ? 'done' : 'not done'
        return (
          <div
            key={day.dateKey}
            role="listitem"
            className={[
              'habit-day-tracker__day',
              day.done && 'habit-day-tracker__day--done',
              day.isFuture && 'habit-day-tracker__day--upcoming',
              day.isToday && 'habit-day-tracker__day--today',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={`${day.letter}${day.isToday ? ' (today)' : ''}: ${statusLabel}`}
          >
            <span className="habit-day-tracker__letter">{day.letter}</span>
            {day.isToday && (
              <span className="habit-day-tracker__today-dot" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default HabitDayTracker
