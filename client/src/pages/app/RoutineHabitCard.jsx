import { Link } from 'react-router-dom'
import Pill from '../../components/Pill.jsx'
import ContentCard from '../../components/ContentCard.jsx'
import { getPillarLabel } from '../../domain/pillars.js'
import { RECOMMENDATIONS_BY_PILLAR } from '../onboarding/recommendedHabits.js'
import HabitDayTracker from './HabitDayTracker.jsx'
import './RoutineHabitCard.css'

// Compact, non-interactive version of onboarding's HabitPickCard — same
// visual language (image background, scrim), scaled down for a list on
// the Routine page instead of a full-screen swipeable picker. Unlike the
// onboarding card, the pillar Pill sits inside the card, directly above
// the habit name, and the top-left corner carries a 7-day tracker
// (HabitDayTracker) anchored to when the habit was adopted. The card
// itself links to the full-screen HabitDetail view (edit tier/moment);
// `content`, when present, is that day's reinforcement piece for this
// habit (see domain/habitContent.js) and renders below the card as a
// separate, non-nested link so both stay tappable.
function RoutineHabitCard({ habit, content }) {
  const gradient = RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.gradient
  const meta = [habit.tier, habit.moment].filter(Boolean).join(' · ')

  return (
    <div className="routine-habit-card-wrap">
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

      {content && (
        <div className="routine-habit-card__drip">
          <ContentCard
            id={content.id}
            thumbnail={gradient}
            brand={content.brand}
            title={content.title}
          />
          <Link to="/read" className="routine-habit-card__drip-more">
            See more in Read →
          </Link>
        </div>
      )}
    </div>
  )
}

export default RoutineHabitCard
