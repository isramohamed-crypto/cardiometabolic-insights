import { useState } from 'react'
import Toggle from '../../components/Toggle.jsx'
import { STACK_PRESETS } from './recommendedHabits.js'
import { formatTime } from '../../domain/time.js'
import './QuestionScreen.css'
import './CustomizeHabit.css'

// Shown after "Add this habit" — the habit itself stays generic (see
// recommendedHabits.js), so this is where the user's discretion comes in:
// when they'll do it (stacked onto an existing moment, or an exact time),
// and whether to get reminded. How much to start with is no longer a
// choice made here — every habit starts at its easiest tier (tiers[0]),
// and every tier above that is shown but locked, since there's no trial
// history yet to justify starting anywhere else. Tiers unlock one at a
// time from the trial-graduation upsell instead (see HabitTrialPrompt's
// "Keep it" -> upsellPending flow), which already gates escalation on
// actually having tried the easiest version first.
//
// `embedded` skips the standalone page chrome (the `<main>` + colored
// header) and returns just the body content instead — used by
// AddHabitFlow, which sits inside Routine/Collection's own page body
// rather than being a full-screen step of its own.
// Daily walk (walk-after-meal) is specifically built around the "walk
// it off after a meal" idea (see its catalog justification/why-carousel
// copy) — defaulting its stack suggestion to "After dinner" instead of
// leaving the picker blank saves the obvious choice for the one habit
// whose whole premise already names the moment. No other current habit
// has a similarly obvious single answer, so this stays a one-off keyed
// off the habit id rather than a general "suggested moment" field on
// every catalog entry.
const DEFAULT_MOMENT_BY_HABIT = {
  'walk-after-meal': 'After dinner',
}

// Temporary: hide "How much to start?" specifically in the onboarding
// Recommendations flow (embedded === false) — AddHabitFlow's embedded
// customize screen keeps showing it, since only the onboarding path was
// asked for. Every habit still starts at tiers[0] either way (see
// handleSave below); hiding this section only removes the picker's own
// visibility, not what actually gets saved. To revert, delete this
// constant and the `!embedded &&` check around the section it guards
// below — no other code needs to change.
const HIDE_TIER_SECTION_IN_ONBOARDING = true

function CustomizeHabit({ habit, onBack, onSave, embedded = false }) {
  const [momentMode, setMomentMode] = useState('preset')
  const [momentPreset, setMomentPreset] = useState(
    () => DEFAULT_MOMENT_BY_HABIT[habit.id] || null,
  )
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
      tier: habit.tiers[0],
      moment: momentMode === 'preset' ? momentPreset : formatTime(momentTime),
      remindersOn,
    })
  }

  const body = (
    <div className="question-screen__body">
      <p className="question-screen__intro">
        The habit stays the same — when you'll do it is up to you. Bigger
        tiers unlock once you've made it through the trial at this one.
      </p>

      {(embedded || !HIDE_TIER_SECTION_IN_ONBOARDING) && (
        <section className="customize-section">
          <h2 className="customize-section__title">How much to start?</h2>
          <div className="question-screen__options">
            {habit.tiers.map((tier, i) => {
              const isEasiest = i === 0
              return (
                <button
                  key={tier.label}
                  type="button"
                  className={`question-screen__option${isEasiest ? ' question-screen__option--selected' : ' question-screen__option--locked'}`}
                  aria-pressed={isEasiest}
                  disabled={!isEasiest}
                >
                  <span>{tier.label}</span>
                  {isEasiest ? (
                    <span className="customize-suggested">Suggested</span>
                  ) : (
                    <span className="customize-locked">
                      <span aria-hidden="true">🔒</span> Unlocks after trial
                    </span>
                  )}
                </button>
              )
            })}
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

      {/* Embedded (AddHabitFlow) keeps Back down here, inline with Save —
          that flow has its own top-right × close button already, and
          isn't the onboarding case the top-left placement below is for. */}
      {embedded && (
        <button type="button" className="question-screen__back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back
        </button>
      )}

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
      <button
        type="button"
        className="question-screen__back question-screen__back--top"
        onClick={onBack}
      >
        <span aria-hidden="true">←</span> Back
      </button>

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
