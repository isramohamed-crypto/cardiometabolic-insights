import { Link } from 'react-router-dom'
import Pill from '../../components/Pill.jsx'
import { getPillarLabel } from '../../domain/pillars.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import HabitDayTracker from './HabitDayTracker.jsx'
import './RoutineHabitCard.css'

// Compact, non-interactive version of onboarding's HabitPickCard — same
// visual language (image background, scrim), scaled down for a list on
// the Routine and Collection pages instead of a full-screen swipeable
// picker. The pillar Pill sits inside the card, directly above the habit
// name, and the top-left corner carries a 7-day tracker (HabitDayTracker)
// anchored to when the habit was adopted. The card links to the
// full-screen HabitDetail view (edit tier/moment). Each habit's daily
// content teaser used to render nested under its own card here — that's
// now combined into Routine's single "New for you tonight" section
// instead, so this card is just the habit itself.
function RoutineHabitCard({ habit }) {
  const gradient = getHabitVisual(habit.pillarId, habit.id)
  const meta = [habit.tier, habit.moment].filter(Boolean).join(' · ')

  return (
    <Link
      to={`/habit/${habit.id}`}
      className="routine-habit-card"
      style={{ backgroundImage: gradient }}
    >
      <div className="routine-habit-card__scrim" />

      <HabitDayTracker startedAt={habit.startedAt} log={habit.log} />

      <div className="routine-habit-card__content">
        <Pill label={getPillarLabel(habit.pillarId)} />
        <h3 className="routine-habit-card__title">{habit.title}</h3>
        {meta && <p className="routine-habit-card__meta">{meta}</p>}
      </div>
    </Link>
  )
}

export default RoutineHabitCard
