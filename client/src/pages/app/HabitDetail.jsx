import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR } from '../onboarding/recommendedHabits.js'
import { CONTENT_POOL, daysSinceStart } from '../../domain/habitContent.js'
import { getPillarLabel } from '../../domain/pillars.js'
import { OWNERSHIP_STATE, LOG_STATUS } from '../../domain/habit.js'
import ContentCard from '../../components/ContentCard.jsx'
import HabitDayTracker from './HabitDayTracker.jsx'
import '../onboarding/QuestionScreen.css'
import '../onboarding/CustomizeHabit.css'
import './HabitDetail.css'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

const STATUS_LABEL = {
  [OWNERSHIP_STATE.TRIALED]: 'Trying it out',
  [OWNERSHIP_STATE.ADOPTED]: 'Part of your routine',
  [OWNERSHIP_STATE.OWNED]: 'Fully owned',
  [OWNERSHIP_STATE.READOPTED]: 'Back in your routine',
  [OWNERSHIP_STATE.ABANDONED]: 'Retired',
}

// View mode for a habit already in the user's routine — reached by
// tapping a RoutineHabitCard. Shows the 7-day tracker, trial status, a
// manual "mark today done" check-in, and supporting content specific to
// this habit. Editing tier/moment/reminders lives separately at
// HabitEdit (/habit/:habitId/edit) — this screen just links to it.
function HabitDetail() {
  const { habitId } = useParams()
  const navigate = useNavigate()
  const { habits, updateHabitState, toggleTodayDone } = useHabits()

  // A habit starts as "trying" (TRIALED). After 7 days it's asked whether
  // to become part of the routine (ADOPTED) — skipWait lets that ask
  // happen early instead of waiting for day 7.
  const [skipWait, setSkipWait] = useState(false)
  const [promptDismissed, setPromptDismissed] = useState(false)

  const habit = habits.find((h) => h.id === habitId)
  const catalogHabit = habit
    ? RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find((h) => h.id === habit.id)
    : null

  if (!habit || !catalogHabit) {
    return (
      <main className="question-screen">
        <div className="question-screen__body">
          <p className="question-screen__intro">This habit couldn’t be found.</p>
          <button
            type="button"
            className="question-screen__back"
            onClick={() => navigate('/routine')}
          >
            <span aria-hidden="true">←</span> Back to Routine
          </button>
        </div>
      </main>
    )
  }

  const doneToday = (habit.log || []).some(
    (entry) => entry.date === todayKey() && entry.status === LOG_STATUS.DONE,
  )

  const isTrialing = habit.ownershipState === OWNERSHIP_STATE.TRIALED
  const daysSince = daysSinceStart(habit.startedAt)
  const trialComplete = daysSince >= 7 || skipWait
  const showIntegratePrompt = isTrialing && trialComplete && !promptDismissed

  const contentItems = CONTENT_POOL[habit.id] || []
  const gradient = RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.gradient

  const handleIntegrate = () => {
    updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
    navigate('/routine')
  }

  const handleRetire = () => {
    if (window.confirm('Retire this habit? It will be removed from your Routine.')) {
      updateHabitState(habit.id, OWNERSHIP_STATE.ABANDONED)
      navigate('/routine')
    }
  }

  return (
    <main className="question-screen habit-detail">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">{getPillarLabel(habit.pillarId)}</p>
        <h1 className="question-screen__headline">
          <span>{habit.title}</span>
        </h1>
      </div>

      <div className="question-screen__body">
        {catalogHabit.subtitle && (
          <p className="question-screen__intro">{catalogHabit.subtitle}</p>
        )}

        <div className="habit-detail__tracker">
          <HabitDayTracker startedAt={habit.startedAt} log={habit.log} />
        </div>

        <div className="habit-detail__status-row">
          <span className="habit-detail__status">
            {STATUS_LABEL[habit.ownershipState] || habit.ownershipState}
            {isTrialing && ` — day ${Math.min(daysSince + 1, 7)} of 7`}
          </span>
          {(habit.tier || habit.moment) && (
            <span className="habit-detail__meta">
              {[habit.tier, habit.moment].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>

        <button
          type="button"
          className={`habit-detail__done${doneToday ? ' habit-detail__done--active' : ''}`}
          onClick={() => toggleTodayDone(habit.id)}
          aria-pressed={doneToday}
        >
          <span className="habit-detail__done-check" aria-hidden="true">
            {doneToday ? '✓' : ''}
          </span>
          {doneToday ? 'Marked done for today' : 'Mark today as done'}
        </button>

        <Link to={`/habit/${habit.id}/chat`} className="habit-detail__chat">
          <span aria-hidden="true">💬</span> Ask about this habit
        </Link>

        {showIntegratePrompt && (
          <section className="habit-detail__integrate">
            <h2 className="customize-section__title">
              Ready to make this part of your routine?
            </h2>
            <p className="habit-detail__integrate-desc">
              You’ve been trying this for {daysSince} {daysSince === 1 ? 'day' : 'days'}.
            </p>
            <div className="habit-detail__integrate-actions">
              <button
                type="button"
                className="question-screen__continue"
                onClick={handleIntegrate}
              >
                Yes, integrate it
              </button>
              <button
                type="button"
                className="question-screen__back"
                onClick={() => setPromptDismissed(true)}
              >
                Not yet
              </button>
            </div>
          </section>
        )}

        {isTrialing && !trialComplete && (
          <button type="button" className="habit-detail__skip" onClick={() => setSkipWait(true)}>
            Skip the 7-day trial
          </button>
        )}

        {catalogHabit.justification && (
          <section className="customize-section">
            <h2 className="customize-section__title">Why this works</h2>
            <p className="habit-detail__justification">{catalogHabit.justification}</p>
          </section>
        )}

        {contentItems.length > 0 && (
          <section className="customize-section">
            <h2 className="customize-section__title">More on this habit</h2>
            <div className="routine-habit-list">
              {contentItems.map((item) => (
                <ContentCard
                  key={item.id}
                  id={item.id}
                  thumbnail={gradient}
                  brand={item.brand}
                  title={item.title}
                />
              ))}
            </div>
          </section>
        )}

        <div className="question-screen__spacer" />

        <button type="button" className="habit-detail__retire" onClick={handleRetire}>
          Retire this habit
        </button>

        <button
          type="button"
          className="question-screen__back"
          onClick={() => navigate('/routine')}
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <Link to={`/habit/${habit.id}/edit`} className="question-screen__continue">
          Edit habit
        </Link>
      </div>
    </main>
  )
}

export default HabitDetail
