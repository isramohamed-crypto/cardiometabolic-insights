import { useState } from 'react'
import Toggle from './Toggle.jsx'
import { formatTime } from '../domain/time.js'
import '../pages/onboarding/QuestionScreen.css'
import '../pages/onboarding/CustomizeHabit.css'
import '../pages/app/HabitDetail.css'

// The one habit-settings sheet, shared by adding a habit (AddHabitFlow) and
// editing one (HabitDetail) so they're literally the same screen: a
// full-screen overlay (habit-edit-modal-scene is fixed/inset:0, so it
// covers the app header behind it), titled with the habit, holding just a
// "When will you do it?" time picker and a Reminders toggle.
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
        <div className="habit-edit-modal__bar">
          <button type="button" className="habit-edit-modal__close" onClick={onBack}>
            <span aria-hidden="true">←</span> Back
          </button>
          <span className="habit-edit-modal__title">{title}</span>
        </div>

        <div className="habit-edit-modal__body">
          <section className="customize-section">
            <h2 className="customize-section__title">When will you do it?</h2>
            <div className="question-screen__input-wrap">
              <input
                type="time"
                className="question-screen__input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              {!time && (
                <span className="question-screen__input-placeholder" aria-hidden="true">
                  Tap to set a time
                </span>
              )}
            </div>
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
