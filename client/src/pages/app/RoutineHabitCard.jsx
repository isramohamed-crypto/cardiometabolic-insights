import { Link } from 'react-router-dom'
import Pill from '../../components/Pill.jsx'
import { getPillarLabel } from '../../domain/pillars.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import HabitDayTracker from './HabitDayTracker.jsx'
import HabitTrialPrompt from './HabitTrialPrompt.jsx'
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
//
// When a trial decision applies to this habit (keep it going? / bump the
// tier?), the whole thing — question, description, and the actual decision
// buttons — renders right here now, below the meta line (see
// HabitTrialPrompt.jsx; it returns null itself when nothing applies, so
// there's nothing to gate here). It used to stay split — just the question
// nested in the card, description/buttons left in their own quiet card
// underneath — because buttons can't nest inside this card's own Link
// without also triggering its navigation to HabitDetail on every click.
// Solved that directly instead: the wrapping div's onClick swallows the
// event (stopPropagation so Link's own handler never runs, preventDefault
// so the anchor's native "follow the href" behavior doesn't fire either)
// before it can bubble up to the Link — the button's own onClick (Keep it,
// Let it go, etc.) still fires first and does its real work; this just
// runs after, on the way up, and stops it there.
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
        <div
          className="routine-habit-card__trial-prompt"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <HabitTrialPrompt habit={habit} />
        </div>
      </div>
    </Link>
  )
}

export default RoutineHabitCard
