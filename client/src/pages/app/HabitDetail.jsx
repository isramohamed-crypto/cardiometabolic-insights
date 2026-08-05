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

// The catalog title ("Daily walk") is intentionally generic — tier (how
// much) and moment (when) are only decided afterward, at customize. Once
// both are picked, this spells the title back out with the specifics
// baked in ("10 minute walk every day after dinner" / "... at 7:30 PM")
// instead of leaving the hero reading as generically as the catalog card
// did. Only duration-style tiers ("10 minutes") read naturally this way,
// so anything else (counts like "5 stands", cadences like "2 sessions a
// week") falls back to the plain catalog title rather than forcing an
// awkward sentence.
function detailedTitle(catalogTitle, tier, moment) {
  if (!tier || !moment) return catalogTitle

  const minutesMatch = tier.match(/^(\d+)\s*minutes?$/i)
  if (!minutesMatch) return catalogTitle

  const noun = catalogTitle.replace(/^Daily\s+/i, '').toLowerCase()
  const momentPhrase = STACK_PRESETS.includes(moment) ? moment.toLowerCase() : `at ${moment}`
  return `${minutesMatch[1]} minute ${noun} every day ${momentPhrase}`
}

// View mode for a habit already in the user's routine — reached by
// tapping a RoutineHabitCard. Renders as a full-page card that flips open
// over a dark backdrop (see flip-card-scene/flip-card in HabitDetail.css)
// rather than a plain full-bleed page, with the habit's own photo (or its
// pillar's gradient fallback — same getHabitVisual asset every other card
// uses) as the card's header instead of a plain text one. Shows the 7-day
// tracker, trial status, a manual "mark today done" check-in, and
// supporting content specific to this habit. Editing tier/moment/
// reminders lives separately at HabitEdit (/habit/:habitId/edit) — this
// screen just links to it.
function HabitDetail() {
  const { habitId } = useParams()
  const navigate = useNavigate()
  const { habits, updateHabitState, updateHabit, toggleTodayDone } = useHabits()

  // The tier and "when" editors are tucked behind a single disclosure so
  // the default view stays focused on today's check-in — tapping it open
  // reveals both editable sections together.
  const [customizeOpen, setCustomizeOpen] = useState(false)

  // The old "Ask about this habit" link is now a real text input pinned to
  // the bottom of the card — whatever's typed here travels with the
  // navigation into HabitChat (see its initialMessage handling) instead of
  // just linking over to a blank composer.
  const [chatDraft, setChatDraft] = useState('')

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
      <div className="flip-card-scene">
        <main className="question-screen flip-card">
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
      </div>
    )
  }

  const doneToday = (habit.log || []).some(
    (entry) => entry.date === todayKey() && entry.status === LOG_STATUS.DONE,
  )

  const isTrialing = habit.ownershipState === OWNERSHIP_STATE.TRIALED
  const daysSince = daysSinceStart(habit.startedAt)
  // skipTrialWait/upsellPending live on the habit itself (see updateHabit
  // calls below and HabitTrialPrompt, which owns the actual decision UI
  // now — this page only needs to know whether one applies, to show its
  // one-line pointer over to Routine). Storing them on the habit rather
  // than as local state here means they read the same on both screens.
  const trialComplete = daysSince >= 7 || habit.skipTrialWait
  const showTrialPrompt = isTrialing && trialComplete
  const showTierUpsell = Boolean(habit.upsellPending)

  // Skipping the trial is the user asserting this is already an
  // established habit, not a new one still being tried on — the status
  // pill (and its day count) should reflect that immediately rather than
  // still reading "Trying it out" while the keep/smaller/let-go prompt
  // is showing.
  const statusLabel =
    isTrialing && habit.skipTrialWait
      ? 'Established habit'
      : STATUS_LABEL[habit.ownershipState] || habit.ownershipState

  const contentItems = CONTENT_POOL[habit.id] || []
  const gradient = getHabitVisual(habit.pillarId, habit.id)

  const tiers = catalogHabit.tiers || []
  const currentTierIndex = Math.max(0, tiers.findIndex((t) => t.label === habit.tier))

  const handleRetire = () => {
    if (window.confirm('Retire this habit? It will be removed from your Routine.')) {
      updateHabitState(habit.id, OWNERSHIP_STATE.ABANDONED)
      navigate('/routine')
    }
  }

  const handleAskSubmit = (e) => {
    e.preventDefault()
    const text = chatDraft.trim()
    if (!text) return
    navigate(`/habit/${habit.id}/chat`, { state: { initialMessage: text } })
  }

  return (
    <div className="flip-card-scene">
      <main className="question-screen habit-detail flip-card">
        <div className="habit-detail__hero" style={{ backgroundImage: gradient }}>
          <div className="habit-detail__hero-scrim" />
          <button
            type="button"
            className="habit-detail__close"
            onClick={() => navigate('/routine')}
            aria-label="Close"
          >
            ×
          </button>
          <div className="habit-detail__hero-content">
            <p className="habit-detail__hero-eyebrow">{getPillarLabel(habit.pillarId)}</p>
            <h1 className="habit-detail__hero-title">
              {detailedTitle(habit.title, habit.tier, habit.moment)}
            </h1>
          </div>
        </div>

        <div className="question-screen__body">
          <div className="habit-detail__tracker">
            <HabitDayTracker startedAt={habit.startedAt} log={habit.log} variant="light" />
          </div>

          <div className="habit-detail__status-row">
            <span className="habit-detail__status">
              {statusLabel}
              {isTrialing && !habit.skipTrialWait && ` — day ${Math.min(daysSince + 1, 7)} of 7`}
            </span>
            {isTrialing && !trialComplete && (
              <button
                type="button"
                className="habit-detail__skip"
                onClick={() => updateHabit(habit.id, { skipTrialWait: true })}
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
                    <div className="question-screen__options question-screen__options--compact">
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
                      className="question-screen__input question-screen__input--compact"
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

          {/* The actual keep/smaller/let-go decision (and the tier-upsell
              that can follow "Keep it") now lives on the Routine tab, right
              under this habit's own card — see HabitTrialPrompt.jsx. This
              is just a one-line pointer over to it, not the decision UI
              itself. */}
          {showTrialPrompt && (
            <Link to="/routine" className="habit-detail__trial-hint">
              A week of trying. Head to Routine to decide what's next →
            </Link>
          )}

          {showTierUpsell && (
            <Link to="/routine" className="habit-detail__trial-hint">
              "{habit.tier}" is working — head to Routine to bump it up →
            </Link>
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

        <form className="habit-detail__composer" onSubmit={handleAskSubmit}>
          <input
            type="text"
            className="habit-detail__composer-input"
            placeholder="Ask about this habit…"
            value={chatDraft}
            onChange={(e) => setChatDraft(e.target.value)}
          />
          <button
            type="submit"
            className="habit-detail__composer-send"
            disabled={!chatDraft.trim()}
          >
            Send
          </button>
        </form>
      </main>
    </div>
  )
}

export default HabitDetail
