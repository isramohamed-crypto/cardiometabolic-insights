import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR, STACK_PRESETS, getHabitVisual } from '../onboarding/recommendedHabits.js'
import { CONTENT_POOL, daysSinceStart } from '../../domain/habitContent.js'
import { getPillarLabel } from '../../domain/pillars.js'
import { OWNERSHIP_STATE, LOG_STATUS } from '../../domain/habit.js'
import { formatTime } from '../../domain/time.js'
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
  const { habits, updateHabitState, updateHabit, toggleTodayDone, unlockSlot } = useHabits()

  // A habit starts as "trying" (TRIALED). After 7 days it's asked to
  // resolve the trial — skipWait lets that ask happen early instead of
  // waiting for day 7. decisionStage tracks the two-part decision: the
  // keep/smaller/let-go prompt, then (only if "keep it" was chosen and a
  // higher tier exists) a tier-upsell follow-up.
  const [skipWait, setSkipWait] = useState(false)
  const [decisionStage, setDecisionStage] = useState('prompt')

  // The tier and "when" editors are tucked behind a single disclosure so
  // the default view stays focused on today's check-in — tapping it open
  // reveals both editable sections together.
  const [customizeOpen, setCustomizeOpen] = useState(false)

  const habit = habits.find((h) => h.id === habitId)
  const catalogHabit = habit
    ? RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find((h) => h.id === habit.id)
    : null

  // "When" is editable inline too, same toggle-then-options pattern as
  // onboarding's CustomizeHabit — just applied instantly via updateHabit
  // instead of gathered up for a "Save" step.
  const currentIsPreset = !habit?.moment || STACK_PRESETS.includes(habit.moment)
  const [momentMode, setMomentMode] = useState(currentIsPreset ? 'preset' : 'time')
  const [momentTime, setMomentTime] = useState('')

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
  const showTrialDecision = isTrialing && trialComplete

  // Skipping the trial is the user asserting this is already an
  // established habit, not a new one still being tried on — the status
  // pill (and its day count) should reflect that immediately rather than
  // still reading "Trying it out" while the keep/smaller/let-go prompt
  // is showing.
  const statusLabel =
    isTrialing && skipWait
      ? 'Established habit'
      : STATUS_LABEL[habit.ownershipState] || habit.ownershipState

  const contentItems = CONTENT_POOL[habit.id] || []
  const gradient = getHabitVisual(habit.pillarId, habit.id)

  const tiers = catalogHabit.tiers || []
  const currentTierIndex = Math.max(0, tiers.findIndex((t) => t.label === habit.tier))
  const hasHigherTier = tiers.length > 0 && currentTierIndex < tiers.length - 1
  const hasLowerTier = tiers.length > 0 && currentTierIndex > 0

  // "Keep it" and "make it smaller" both graduate the habit to ADOPTED and
  // open the next slot — the difference is only whether the tier steps
  // down first. "Let it go" retires it and grants nothing.
  const handleKeepIt = () => {
    updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
    unlockSlot()
    if (hasHigherTier) {
      setDecisionStage('upsell')
    } else {
      navigate('/routine')
    }
  }

  const handleMakeSmaller = () => {
    if (hasLowerTier) {
      updateHabit(habit.id, { tier: tiers[currentTierIndex - 1].label })
    }
    updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
    unlockSlot()
    navigate('/routine')
  }

  const handleLetItGo = () => {
    if (window.confirm('Let this habit go? It will be removed from your Routine.')) {
      updateHabitState(habit.id, OWNERSHIP_STATE.ABANDONED)
      navigate('/routine')
    }
  }

  const handleUpgradeTier = () => {
    updateHabit(habit.id, { tier: tiers[currentTierIndex + 1].label })
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
            {statusLabel}
            {isTrialing && !skipWait && ` — day ${Math.min(daysSince + 1, 7)} of 7`}
          </span>
          {isTrialing && !trialComplete && (
            <button
              type="button"
              className="habit-detail__skip"
              onClick={() => setSkipWait(true)}
            >
              Skip the 7-day trial
            </button>
          )}
          <button type="button" className="habit-detail__retire" onClick={handleRetire}>
            Retire this habit
          </button>
        </div>

        <div className="habit-detail__customize">
          <button
            type="button"
            className="habit-detail__customize-toggle"
            aria-expanded={customizeOpen}
            onClick={() => setCustomizeOpen((open) => !open)}
          >
            Customize this habit
            <span className="habit-detail__customize-chevron" aria-hidden="true">
              {customizeOpen ? '▴' : '▾'}
            </span>
          </button>

          {customizeOpen && (
            <div className="habit-detail__customize-body">
              {tiers.length > 1 && (
                <section className="customize-section">
                  <h2 className="customize-section__title">How much</h2>
                  <div className="habit-detail__tiers" role="group" aria-label="How much to do">
                    {tiers.map((tier, i) => (
                      <button
                        key={tier.label}
                        type="button"
                        className={`habit-detail__tier${i === currentTierIndex ? ' habit-detail__tier--selected' : ''}`}
                        aria-pressed={i === currentTierIndex}
                        onClick={() => updateHabit(habit.id, { tier: tier.label })}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="customize-section">
                <h2 className="customize-section__title">When will you do it?</h2>

                <div className="customize-toggle">
                  <button
                    type="button"
                    className={`customize-toggle__option${momentMode === 'preset' ? ' customize-toggle__option--active' : ''}`}
                    onClick={() => setMomentMode('preset')}
                  >
                    Stack with a routine
                  </button>
                  <button
                    type="button"
                    className={`customize-toggle__option${momentMode === 'time' ? ' customize-toggle__option--active' : ''}`}
                    onClick={() => setMomentMode('time')}
                  >
                    Set a specific time
                  </button>
                </div>

                {momentMode === 'preset' ? (
                  <div className="question-screen__options">
                    {STACK_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`question-screen__option${preset === habit.moment ? ' question-screen__option--selected' : ''}`}
                        aria-pressed={preset === habit.moment}
                        onClick={() => updateHabit(habit.id, { moment: preset })}
                      >
                        <span>{preset}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="time"
                    className="question-screen__input"
                    value={momentTime}
                    onChange={(e) => {
                      setMomentTime(e.target.value)
                      updateHabit(habit.id, { moment: formatTime(e.target.value) })
                    }}
                  />
                )}
              </section>
            </div>
          )}
        </div>

        <Link to={`/habit/${habit.id}/chat`} className="habit-detail__chat">
          <span aria-hidden="true">💬</span> Ask about this habit
        </Link>

        {showTrialDecision && decisionStage === 'prompt' && (
          <section className="habit-detail__integrate">
            <h2 className="customize-section__title">A week of trying. Keep it going?</h2>
            <p className="habit-detail__integrate-desc">
              No wrong answer — this is just the check-in we do at the end of a trial.
            </p>
            <div className="habit-detail__integrate-actions">
              <button type="button" className="question-screen__continue" onClick={handleKeepIt}>
                Keep it
              </button>
              {hasLowerTier && (
                <button
                  type="button"
                  className="habit-detail__integrate-secondary"
                  onClick={handleMakeSmaller}
                >
                  Make it smaller
                </button>
              )}
              <button
                type="button"
                className="habit-detail__integrate-link"
                onClick={handleLetItGo}
              >
                Let it go
              </button>
            </div>
          </section>
        )}

        {showTrialDecision && decisionStage === 'upsell' && (
          <section className="habit-detail__integrate">
            <h2 className="customize-section__title">
              "{habit.tier}" is working. Want to make it {tiers[currentTierIndex + 1]?.label}?
            </h2>
            <p className="habit-detail__integrate-desc">
              Staying at "{habit.tier}" is a completely good answer, too.
            </p>
            <div className="habit-detail__integrate-actions">
              <button
                type="button"
                className="question-screen__continue"
                onClick={handleUpgradeTier}
              >
                Let's make it {tiers[currentTierIndex + 1]?.label}
              </button>
              <button
                type="button"
                className="question-screen__back"
                onClick={() => navigate('/routine')}
              >
                "{habit.tier}" is right for now
              </button>
            </div>
          </section>
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
                  body={item.body}
                />
              ))}
            </div>
          </section>
        )}

        <div className="question-screen__spacer" />

        <button
          type="button"
          className="question-screen__back"
          onClick={() => navigate('/routine')}
        >
          <span aria-hidden="true">←</span> Back
        </button>

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
      </div>
    </main>
  )
}

export default HabitDetail
