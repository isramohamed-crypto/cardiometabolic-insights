import { useState } from 'react'
import Toggle from './Toggle.jsx'
import { formatTime } from '../domain/time.js'
import '../pages/onboarding/QuestionScreen.css'
import '../pages/onboarding/CustomizeHabit.css'
import '../pages/app/HabitDetail.css'
import './HabitSettingsCard.css'

// The one habit-settings sheet — shared by onboarding, add-a-habit, and
// edit so they're the exact same screen. Full-screen overlay, an eyebrow +
// habit-title headline, a "when" picker that adapts to the habit (a time
// picker for time-of-day habits like a consistent wake-up; preset moment
// chips like "After breakfast / lunch / dinner" for anchored ones), and a
// Reminders toggle.
const QUICK_TIMES = [
  { label: 'Morning', value: '08:00' },
  { label: 'Midday', value: '12:30' },
  { label: 'Evening', value: '18:00' },
  { label: 'Night', value: '21:00' },
]

function HabitSettingsCard({
  title,
  when,
  initialMoment = '',
  initialReminders = false,
  submitLabel,
  onSubmit,
  onBack,
}) {
  const mode = when?.mode === 'anchor' ? 'anchor' : 'time'
  const anchorOptions = when?.options || []
  const showPresets = when?.presets !== false
  const exactLabel = when?.timeLabel || 'Set a time'

  // In anchor mode `value` is the chosen moment label; in time mode it's a
  // native "HH:MM" string (formatted for display on submit). Prefill only
  // makes sense to restore for anchor edits where it matches an option.
  const [value, setValue] = useState(
    mode === 'anchor' && anchorOptions.includes(initialMoment) ? initialMoment : '',
  )
  const [remindersOn, setRemindersOn] = useState(initialReminders)

  const handleToggleReminders = (next) => {
    setRemindersOn(next)
    if (next && typeof Notification !== 'undefined' && Notification.permission === 'default') {
      try {
        Promise.resolve(Notification.requestPermission()).catch(() => {})
      } catch {
        /* no-op */
      }
    }
  }

  const submit = () =>
    onSubmit({ moment: mode === 'time' ? formatTime(value) : value, remindersOn })

  return (
    <div className="habit-edit-modal-scene">
      <div className="habit-edit-modal">
        <div className="hsettings">
          <div className="hsettings__scroll">
          <button type="button" className="hsettings__back" onClick={onBack}>
            <span aria-hidden="true">←</span> Back
          </button>

          <div className="hsettings__header">
            <p className="question-screen__eyebrow">Habit settings</p>
            <h1 className="question-screen__headline">
              <span>{title}</span>
            </h1>
          </div>

          <section className="customize-section">
            <h2 className="customize-section__title">When will you do it?</h2>

            {mode === 'anchor' ? (
              <div className="hsettings__times">
                {anchorOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`hsettings__timechip${value === opt ? ' hsettings__timechip--on' : ''}`}
                    aria-pressed={value === opt}
                    onClick={() => setValue(opt)}
                  >
                    <span className="hsettings__timechip-label">{opt}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                {showPresets && (
                  <div className="hsettings__times">
                    {QUICK_TIMES.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        className={`hsettings__timechip${value === t.value ? ' hsettings__timechip--on' : ''}`}
                        aria-pressed={value === t.value}
                        onClick={() => setValue(t.value)}
                      >
                        <span className="hsettings__timechip-label">{t.label}</span>
                        <span className="hsettings__timechip-time">{formatTime(t.value)}</span>
                      </button>
                    ))}
                  </div>
                )}

                <label className="hsettings__exact">
                  <span className="hsettings__exact-label">{showPresets ? 'Or set an exact time' : exactLabel}</span>
                  <input
                    type="time"
                    className="hsettings__time-input"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </label>
              </>
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

          </div>

          <div className="hsettings__footer">
            <button
              type="button"
              className="question-screen__continue"
              onClick={submit}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HabitSettingsCard
