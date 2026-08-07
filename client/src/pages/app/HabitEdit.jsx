import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR, STACK_PRESETS } from '../onboarding/recommendedHabits.js'
import { getPillarLabel } from '../../domain/pillars.js'
import { formatTime } from '../../domain/time.js'
import Toggle from '../../components/Toggle.jsx'
import '../onboarding/QuestionScreen.css'
import '../onboarding/CustomizeHabit.css'
import './HabitDetail.css'

// Edit mode for a habit already in the routine — tier, moment, and
// reminders only. Reached from HabitDetail's "Edit habit" link; reuses the
// same controls as onboarding's CustomizeHabit, but edits an existing
// habit instance (via updateHabit) instead of finalizing a new one. Back
// and Save both return to the (view-mode) HabitDetail screen.
function HabitEdit() {
  const { habitId } = useParams()
  const navigate = useNavigate()
  const { habits, updateHabit } = useHabits()

  const habit = habits.find((h) => h.id === habitId)
  const catalogHabit = habit
    ? RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find((h) => h.id === habit.id)
    : null

  const tiers = catalogHabit?.tiers || []
  const currentTierIndex = Math.max(0, tiers.findIndex((t) => t.label === habit?.tier))
  const [tierIndex, setTierIndex] = useState(currentTierIndex)

  const currentIsPreset = STACK_PRESETS.includes(habit?.moment)
  const [momentMode, setMomentMode] = useState(
    !habit?.moment || currentIsPreset ? 'preset' : 'time',
  )
  const [momentPreset, setMomentPreset] = useState(currentIsPreset ? habit.moment : null)
  const [momentTime, setMomentTime] = useState('')
  const [remindersOn, setRemindersOn] = useState(habit?.remindersOn || false)

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
            <span aria-hidden="true">←</span> Back to Today
          </button>
        </div>
      </main>
    )
  }

  const canSave = momentMode === 'preset' ? Boolean(momentPreset) : Boolean(momentTime)

  const handleToggleReminders = async (next) => {
    if (next && typeof Notification !== 'undefined') {
      try {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          setRemindersOn(false)
          return
        }
      } catch {
        setRemindersOn(false)
        return
      }
    }
    setRemindersOn(next)
  }

  const handleSave = () => {
    updateHabit(habit.id, {
      tier: tiers[tierIndex]?.label,
      moment: momentMode === 'preset' ? momentPreset : formatTime(momentTime),
      remindersOn,
    })
    navigate(`/habit/${habit.id}`)
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
        <section className="customize-section">
          <h2 className="customize-section__title">How much?</h2>
          <div className="question-screen__options">
            {tiers.map((tier, i) => (
              <button
                key={tier.label}
                type="button"
                className={`question-screen__option${i === tierIndex ? ' question-screen__option--selected' : ''}`}
                aria-pressed={i === tierIndex}
                onClick={() => setTierIndex(i)}
              >
                <span>{tier.label}</span>
                {i === currentTierIndex && i !== tierIndex && (
                  <span className="customize-suggested">Current</span>
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="customize-section">
          <h2 className="customize-section__title">When?</h2>
          <p className="habit-detail__current-moment">
            Currently: {habit.moment || 'Not set'}
          </p>

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
                  className={`question-screen__option${preset === momentPreset ? ' question-screen__option--selected' : ''}`}
                  aria-pressed={preset === momentPreset}
                  onClick={() => setMomentPreset(preset)}
                >
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="question-screen__input-wrap">
              <input
                type="time"
                className="question-screen__input"
                value={momentTime}
                onChange={(e) => setMomentTime(e.target.value)}
              />
              {!momentTime && (
                <span className="question-screen__input-placeholder" aria-hidden="true">
                  Tap to set a time
                </span>
              )}
            </div>
          )}
        </section>

        <section className="customize-section">
          <div className="customize-reminders">
            <div>
              <h2 className="customize-section__title">Reminders</h2>
              <p className="customize-reminders__desc">Get a nudge when it's time.</p>
            </div>
            <Toggle
              checked={remindersOn}
              onChange={handleToggleReminders}
              label="Enable reminders for this habit"
            />
          </div>
        </section>

        <div className="question-screen__spacer" />

        <button
          type="button"
          className="question-screen__back"
          onClick={() => navigate(`/habit/${habit.id}`)}
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <button
          type="button"
          className="question-screen__continue"
          disabled={!canSave}
          onClick={handleSave}
        >
          Save changes
        </button>
      </div>
    </main>
  )
}

export default HabitEdit
