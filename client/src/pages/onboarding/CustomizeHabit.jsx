import { useState } from 'react'
import Toggle from '../../components/Toggle.jsx'
import { STACK_PRESETS } from './recommendedHabits.js'
import { formatTime } from '../../domain/time.js'
import './QuestionScreen.css'
import './CustomizeHabit.css'

// Shown after "Add this habit" — the habit itself stays generic (see
// recommendedHabits.js), so this is where the user's discretion comes in:
// how much to start with (tier — defaulting to suggestedTierIndex, but
// changeable here), when they'll do it (stacked onto an existing moment,
// or an exact time), and whether to get reminded.
//
// `embedded` skips the standalone page chrome (the `<main>` + colored
// header) and returns just the body content instead — used by
// AddHabitFlow, which sits inside Routine/Collection's own page body
// rather than being a full-screen step of its own.
function CustomizeHabit({ habit, suggestedTierIndex = 0, onBack, onSave, embedded = false }) {
  const [tierIndex, setTierIndex] = useState(suggestedTierIndex)
  const [momentMode, setMomentMode] = useState('preset')
  const [momentPreset, setMomentPreset] = useState(null)
  const [momentTime, setMomentTime] = useState('')
  const [remindersOn, setRemindersOn] = useState(false)

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
    onSave({
      tier: habit.tiers[tierIndex],
      moment: momentMode === 'preset' ? momentPreset : formatTime(momentTime),
      remindersOn,
    })
  }

  const body = (
    <div className="question-screen__body">
      <p className="question-screen__intro">
        The habit stays the same — how much and when is up to you.
      </p>

      <section className="customize-section">
        <h2 className="customize-section__title">How much to start?</h2>
        <div className="question-screen__options">
          {habit.tiers.map((tier, i) => (
            <button
              key={tier.label}
              type="button"
              className={`question-screen__option${i === tierIndex ? ' question-screen__option--selected' : ''}`}
              aria-pressed={i === tierIndex}
              onClick={() => setTierIndex(i)}
            >
              <span>{tier.label}</span>
              {i === suggestedTierIndex && (
                <span className="customize-suggested">Suggested</span>
              )}
            </button>
          ))}
        </div>
      </section>

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
                className={`question-screen__option${preset === momentPreset ? ' question-screen__option--selected' : ''}`}
                aria-pressed={preset === momentPreset}
                onClick={() => setMomentPreset(preset)}
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
            onChange={(e) => setMomentTime(e.target.value)}
          />
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

      <button type="button" className="question-screen__back" onClick={onBack}>
        <span aria-hidden="true">←</span> Back
      </button>

      <button
        type="button"
        className="question-screen__continue"
        disabled={!canSave}
        onClick={handleSave}
      >
        Save my habit
      </button>
    </div>
  )

  if (embedded) return body

  return (
    <main className="question-screen">
      <div className="question-screen__header">
        <p className="question-screen__eyebrow">Make it yours</p>
        <h1 className="question-screen__headline">
          <span>{habit.title}</span>
        </h1>
      </div>

      {body}
    </main>
  )
}

export default CustomizeHabit
