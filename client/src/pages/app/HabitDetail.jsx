import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR, STACK_PRESETS, getHabitVisual } from '../onboarding/recommendedHabits.js'
import { daysSinceStart, pickJustificationContent, COMPANION_CONTENT } from '../../domain/habitContent.js'
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

// Temporary: retiring a habit is coming back later, just not turned on
// for now — hides the "Retire this habit" action in the edit overlay
// below without removing handleRetire or any of the ABANDONED-state
// plumbing it leads to (STATUS_LABEL's own 'Retired' entry, HabitsContext,
// etc.), so re-enabling later is just flipping this back to true. Same
// flag-a-section-off pattern CustomizeHabit.jsx uses for
// HIDE_TIER_SECTION_IN_ONBOARDING.
const RETIRE_HABIT_ENABLED = false

// Only for catalog titles that are still generic about how much/when
// ("Daily walk", back when tier/moment were decided afterward at
// customize) — spells the title back out with the specifics baked in
// ("10 minute walk every day after dinner" / "... at 7:30 PM") instead of
// leaving the hero reading as generically as the catalog card did.
// Matching on the literal "Daily " prefix (rather than just trying to
// strip it and falling through either way) matters now that the catalog's
// own walk-after-meal title already names its duration and moment itself
// ("10-minute walk after a meal") — running THAT through this composer
// used to double up into "20 minute 10-minute walk after a meal every day
// after dinner" instead of bailing out to the plain title like every
// other non-"Daily "-prefixed habit already does below. No current
// catalog title starts with "Daily " any more, so this is dormant for
// now — kept in case a future habit's title needs the same generic-until-
// customized treatment.
function detailedTitle(catalogTitle, tier, moment) {
  if (!tier || !moment) return catalogTitle

  const dailyMatch = catalogTitle.match(/^Daily\s+(.+)$/i)
  if (!dailyMatch) return catalogTitle

  const minutesMatch = tier.match(/^(\d+)\s*minutes?$/i)
  if (!minutesMatch) return catalogTitle

  const noun = dailyMatch[1].toLowerCase()
  const momentPhrase = STACK_PRESETS.includes(moment) ? moment.toLowerCase() : `at ${moment}`
  return `${minutesMatch[1]} minute ${noun} every day ${momentPhrase}`
}

// View mode for a habit already in the user's routine — reached by
// tapping a RoutineHabitCard on the Routine tab. A plain full-bleed
// subscreen (same question-screen shell as HabitEdit/HabitChat, outside
// AppLayout's tab bar) rather than an overlay/tray — it used to render as
// a flip-open card floating over a dimmed Routine backdrop, but that read
// as a modal rather than a real screen of its own, so it's a normal page
// now, just reached the same way (tap a habit, land here; Back/Close both
// return to /routine). Uses the habit's own photo (or its pillar's
// gradient fallback — same getHabitVisual asset every other card uses) as
// a hero banner instead of a plain text header. Shows the 7-day tracker,
// trial status, a manual "mark today done" check-in, and supporting
// content specific to this habit. Editing tier/moment/reminders (and
// retiring the habit) lives behind the "Edit" action next to the status
// pill — opens as its own overlay modal rather than a separate route or an
// inline disclosure. (There's a standalone HabitEdit page/route left over
// from before that consolidation — nothing links to it anymore.)
function HabitDetail() {
  const { habitId } = useParams()
  const navigate = useNavigate()
  const { habits, updateHabitState, updateHabit, toggleTodayDone } = useHabits()
  const { answers } = useOnboarding()
  const connectedTracker = answers.connectedTracker

  // Tier/moment editing and retiring the habit all live behind this one
  // "Edit" action now — tapping it opens them together as an overlay
  // modal (same "card over a dimmed scene" language as ContentModal),
  // rather than expanding inline in the page or living as separate
  // always-visible controls.
  const [editOpen, setEditOpen] = useState(false)

  // The old "Ask about this habit" link is now a real text input pinned to
  // the bottom of the card — whatever's typed here travels with the
  // navigation into HabitChat (see its initialMessage handling) instead of
  // just linking over to a blank composer.
  const [chatDraft, setChatDraft] = useState('')

  // Picked once per mount (per visit to the card) — the "Did you know?"
  // section's rotating real-world piece, alongside the catalog's own
  // static justification text below it. Called before the not-found
  // early-return like the other hooks above; safe even if habitId
  // doesn't resolve to a real habit, since pickJustificationContent just
  // returns null for an empty/missing pool.
  const [justificationPick] = useState(() => pickJustificationContent(habitId))

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
  // upsellPending lives on the habit itself (see updateHabit calls below
  // and TrialPromptModal, which owns the actual decision UI now — this
  // page only needs to know whether one applies, to show its one-line
  // pointer over to Routine). Storing it on the habit rather than as
  // local state here means it reads the same on both screens.
  const trialComplete = daysSince >= 7
  const showTrialPrompt = isTrialing && trialComplete
  const showTierUpsell = Boolean(habit.upsellPending)

  const statusLabel = STATUS_LABEL[habit.ownershipState] || habit.ownershipState

  const companion = COMPANION_CONTENT[habit.id]
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
    <main className="question-screen habit-detail">
      <div className="habit-detail__hero" style={{ backgroundImage: gradient }}>
          <div className="habit-detail__hero-scrim" />
          <button
            type="button"
            className="habit-detail__back-top"
            onClick={() => navigate('/routine')}
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <div className="habit-detail__hero-content">
            <p className="habit-detail__hero-eyebrow">{getPillarLabel(habit.pillarId)}</p>
            <h1 className="habit-detail__hero-title">
              {detailedTitle(habit.title, habit.tier, habit.moment)}
            </h1>
          </div>
        </div>

        <div className="question-screen__body">
          <div className="habit-detail__tracker-row">
            <div className="habit-detail__tracker">
              <HabitDayTracker startedAt={habit.startedAt} log={habit.log} variant="light" />
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
              {doneToday ? 'Done today' : 'Mark done'}
            </button>
          </div>

          {/* Only shown if the user connected a passive-tracking source
              during onboarding (see ConnectSteps.jsx) — most habits are
              still manually marked done above, so this is a footnote, not
              a claim that this specific habit is actually being logged by
              the device. */}
          {connectedTracker && (
            <p className="habit-detail__tracker-note">Tracked with {connectedTracker}</p>
          )}

          <div className="habit-detail__status-row">
            <span className="habit-detail__status">
              {statusLabel}
              {isTrialing && ` — day ${Math.min(daysSince + 1, 7)} of 7`}
            </span>
            <button
              type="button"
              className="habit-detail__edit-trigger"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </button>
          </div>

          {/* The actual keep/smaller/let-go decision (and the tier-upsell
              that can follow "Keep it") now shows as its own full-screen
              modal on the Routine tab — see TrialPromptModal.jsx. This is
              just a one-line pointer over to it, not the decision UI
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

          {/* "Where the habit currently is" ends above this line (tracker,
              trial status, customize, trial-decision hints). Below here is
              habit-specific reading/media rather than status/controls. */}

          {(catalogHabit.justification || justificationPick) && (
            <section className="customize-section">
              <h2 className="customize-section__title">Did you know?</h2>
              {catalogHabit.justification && (
                <p className="habit-detail__justification">{catalogHabit.justification}</p>
              )}
              {justificationPick && (
                <div className="routine-habit-list">
                  <ContentCard
                    id={justificationPick.id}
                    thumbnail={justificationPick.image || gradient}
                    brand={justificationPick.brand}
                    title={justificationPick.title}
                    body={justificationPick.body}
                    fullBody={justificationPick.fullBody}
                    url={justificationPick.url}
                    compact
                  />
                </div>
              )}
            </section>
          )}

          {companion && (
            <section className="customize-section">
              <h2 className="customize-section__title">{companion.sectionLabel}</h2>
              <div className="routine-habit-list">
                {/* Prefer the piece's own real photo (e.g. the walk-after-
                    meal podcast's cover art) over the habit's flat
                    gradient when one's set — same `item.image || gradient`
                    precedence Routine.jsx already uses for its daily pick,
                    so a real image shows up here too instead of only on
                    Routine. */}
                <ContentCard
                  id={companion.content.id}
                  thumbnail={companion.content.image || gradient}
                  brand={companion.content.brand}
                  title={companion.content.title}
                  body={companion.content.body}
                  fullBody={companion.content.fullBody}
                  url={companion.content.url}
                  compact
                />
              </div>
            </section>
          )}

          <div className="question-screen__spacer" />
        </div>

        {/* Restyled as one floating white pill (was a plain input + separate
            square button sitting directly on the page background) — larger,
            with the send action living inside the same container as a
            circular icon button at its trailing edge, matching the
            product's newer composer mockup instead of HabitChat's older
            flatter bar treatment. */}
        <form className="habit-detail__composer" onSubmit={handleAskSubmit}>
          <div className="habit-detail__composer-inner">
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
              aria-label="Send"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>

        {/* "Edit" overlay — tiers, when-editor, and retiring the habit all
            live together here now, instead of retire sitting as its own
            always-visible action and customize as a separate inline
            disclosure. Same scene/card structure as ContentModal (a dark
            backdrop inset from the top, with a white card floating on top
            of it) rather than a new pattern of its own. */}
        {editOpen && (
          <div className="habit-edit-modal-scene">
            <div className="habit-edit-modal">
              <div className="habit-edit-modal__bar">
                <button
                  type="button"
                  className="habit-edit-modal__close"
                  onClick={() => setEditOpen(false)}
                >
                  <span aria-hidden="true">←</span> Back
                </button>
                <span className="habit-edit-modal__title">Edit habit</span>
              </div>

              <div className="habit-edit-modal__body">
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
                    <div className="question-screen__input-wrap">
                      <input
                        type="time"
                        className="question-screen__input question-screen__input--compact"
                        value={momentTime}
                        onChange={(e) => {
                          setMomentTime(e.target.value)
                          updateHabit(habit.id, { moment: formatTime(e.target.value) })
                        }}
                      />
                      {!momentTime && (
                        <span className="question-screen__input-placeholder" aria-hidden="true">
                          Tap to set a time
                        </span>
                      )}
                    </div>
                  )}
                </section>

                {/* Retiring used to be its own always-visible action next
                    to the status pill — folded in here instead, same
                    destructive red/underline treatment it always had,
                    just relocated to live with the rest of this habit's
                    editable settings. Temporarily hidden — see
                    RETIRE_HABIT_ENABLED above. */}
                {RETIRE_HABIT_ENABLED && (
                  <button
                    type="button"
                    className="habit-edit-modal__retire"
                    onClick={handleRetire}
                  >
                    Retire this habit
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
    </main>
  )
}

export default HabitDetail
