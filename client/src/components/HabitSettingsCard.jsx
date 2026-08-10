import { useState } from 'react'
import Toggle from './Toggle.jsx'
import { formatTime } from '../domain/time.js'
import '../pages/onboarding/QuestionScreen.css'
import '../pages/onboarding/CustomizeHabit.css'
import '../pages/app/HabitDetail.css'
import './HabitSettingsCard.css'

// The one habit-settings sheet — shared by adding a habit (AddHabitFlow)
// and editing one (HabitDetail) so they're the exact same screen. A
// full-screen overlay (covers the app header behind it), a proper
// eyebrow + habit-title headline, a friendly "when" picker (quick times +
// an exact-time field), and a Reminders toggle.
const QUICK_TIMES = [
  { label: 'Morning', value: '08:00' },
  { label: 'Midday', value: '12:30' },
  { label: 'Evening', value: '18:00' },
  { label: 'Night', value: '21:00' },
]

function HabitSettingsCard({
  title,
  initialTime = '',
  initialReminders = false,
  submitLabel,
  onSubmit,
  onBack,
}) {
  const [time, setTime] = useState(initialTime)
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

  const canSubmit = Boolean(time)

  return (
    <div className="habit-edit-modal-scene">
      <div className="habit-edit-modal">
        <div className="hsettings">
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
            <div className="hsettings__times">
              {QUICK_TIMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`hsettings__timechip${time === t.value ? ' hsettings__timechip--on' : ''}`}
                  aria-pressed={time === t.value}
                  onClick={() => setTime(t.value)}
                >
                  <span className="hsettings__timechip-label">{t.label}</span>
                  <span className="hsettings__timechip-time">{formatTime(t.value)}</span>
                </button>
              ))}
            </div>

            <label className="hsettings__exact">
              <span className="hsettings__exact-label">Or set an exact time</span>
              <input
                type="time"
                className="hsettings__time-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
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
            className="question-screen__continue"
            disabled={!canSubmit}
            onClick={() => onSubmit({ moment: formatTime(time), remindersOn })}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HabitSettingsCard
