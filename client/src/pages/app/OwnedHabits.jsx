import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useOwnedChecklist, OWNED_MARK } from '../../habits/OwnedChecklistContext.jsx'
import { listFoundationHabits, getFoundationVisual } from '../../domain/foundationHabits.js'
import { PILLARS, NON_HABIT_OPTION_IDS } from '../onboarding/pillars.js'
import { getOwnedInsights } from '../../domain/ownedInsights.js'
import { buildSnippets } from '../../domain/insightSnippets.js'
import SnippetDeck from '../../components/SnippetDeck.jsx'
import BrandLogo from '../../components/BrandLogo.jsx'
import { getDayWord } from '../../domain/timeOfDay.js'
import CheckIcon from '../../components/CheckIcon.jsx'
import SkipIcon from '../../components/SkipIcon.jsx'
import SparkleIcon from '../../components/SparkleIcon.jsx'
import GearIcon from '../../components/GearIcon.jsx'
import ConfettiBurst from '../../components/ConfettiBurst.jsx'
import './OwnedHabits.css'

// How long a per-card confetti pop stays mounted, and how long the all-done
// banner's burst does. Both are just long enough to finish the ConfettiBurst
// keyframes (~0.9s including the gravity drop) — the mark itself is
// permanent, only the celebration is transient.
const CARD_BURST_MS = 950

// Cards shown before "Show all" — matches the grid's column count (see
// OwnedHabits.css) so the default state is exactly one row.
const ROW_SIZE = 2
const ALL_BURST_MS = 1600

// "Habits I own" — the foundation habits carried in from onboarding, as
// small cards that can each be marked done or "not today".
//
// The point of this section is affirmation, not tracking: these are things
// the person already does, so the interaction is "yes, I did that" and the
// reward is immediate. "Not today" exists so the alternative to done isn't
// silence — it's a real answer, and it feeds the insights section just as
// done does. Neither state is scored, counted against them, or shown as a
// miss. Tapping a state a card is already in clears it, so nothing is a
// dead end.
//
// Sourced from onboarding answers via listFoundationHabits, which every
// demo profile seeds identically (see demo/profiles.js FOUNDATION_ANSWERS),
// so this populates for all of them and for a real onboarding run alike.
function OwnedHabits() {
  const { answers, setAnswer } = useOnboarding()
  const { marks, getMark, setMark, setAll } = useOwnedChecklist()
  const [burstCard, setBurstCard] = useState(null)
  const [celebrateAll, setCelebrateAll] = useState(false)
  const [insightCursor, setInsightCursor] = useState(0)
  const [doneDismissed, setDoneDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [managing, setManaging] = useState(false)
  const [deckOpen, setDeckOpen] = useState(false)

  const rows = useMemo(
    () => listFoundationHabits(answers.habitsWorking || {}),
    [answers.habitsWorking],
  )

  // Recomputed on every mark on purpose — reacting to what was just tapped
  // is the whole point of the insights list (see domain/ownedInsights.js).
  const insights = getOwnedInsights(rows, marks)

  const currentInsight = insights.length ? insights[insightCursor % insights.length] : null
  // Takeaways for the pillar this insight is about — see
  // domain/insightSnippets.js for where the text comes from.
  const snippets = currentInsight ? buildSnippets(currentInsight.row, currentInsight.state) : []

  const doneCount = rows.filter((row) => getMark(row.key) === OWNED_MARK.DONE).length
  const allDone = rows.length > 0 && doneCount === rows.length

  // Dismissing the all-done banner only hides it for this run: unmark
  // anything and the flag clears, so finishing the set again brings the
  // celebration back rather than suppressing it for good.
  useEffect(() => {
    if (!allDone) setDoneDismissed(false)
  }, [allDone])

  useEffect(() => {
    if (!allDone) return
    setCelebrateAll(true)
    const timer = setTimeout(() => setCelebrateAll(false), ALL_BURST_MS)
    return () => clearTimeout(timer)
  }, [allDone])

  // Marking a habit puts its suggestion at the front of the list, so jump
  // back to the front when that happens — otherwise the thing they just
  // tapped is sitting behind a card they've already read.
  const leadInsightKey = insights[0] ? `${insights[0].row.key}-${insights[0].state}` : ''
  useEffect(() => {
    setInsightCursor(0)
  }, [leadInsightKey])

  useEffect(() => {
    if (!burstCard) return
    const timer = setTimeout(() => setBurstCard(null), CARD_BURST_MS)
    return () => clearTimeout(timer)
  }, [burstCard])

  // Everything from the intake lists that isn't already owned — what the
  // edit mode offers to add. Same NON_HABIT_OPTION_IDS filter the rest of
  // the app uses, so "Skip"/"Something else"/"None of these" never appear as
  // addable habits.
  const ownedKeys = new Set(rows.map((row) => row.key))
  const addable = PILLARS.flatMap((pillar) =>
    pillar.options
      .filter(
        (option) =>
          !NON_HABIT_OPTION_IDS.includes(option.id) &&
          !ownedKeys.has(`${pillar.id}:${option.id}`),
      )
      .map((option) => ({ key: `${pillar.id}:${option.id}`, pillarId: pillar.id, ...option })),
  )

  // Editing writes straight back to the onboarding answers these cards are
  // derived from, so a change here shows up everywhere else that reads them
  // (the Habits tab's "Already yours", the Progress insights) rather than
  // being a Today-only view state.
  const writeOption = (pillarId, optionId, add) => {
    const working = answers.habitsWorking || {}
    const current = working[pillarId] || []
    const next = add
      ? [...current, optionId]
      : current.filter((id) => id !== optionId)
    setAnswer('habitsWorking', { ...working, [pillarId]: next })
  }

  if (rows.length === 0 && !managing) return null

  const handleMark = (key, state) => {
    // Only "done" celebrates, and only when it's newly set — "not today" is
    // a valid answer, not a moment, and un-setting is a correction.
    if (state === OWNED_MARK.DONE && getMark(key) !== OWNED_MARK.DONE) setBurstCard(key)
    setMark(key, state)
  }

  return (
    <section className="owned-habits">
      <div className="owned-habits__head">
        <h2>
          Habits I own <span className="page__count">{doneCount}/{rows.length}</span>
          <button
            type="button"
            className={`owned-habits__gear${managing ? ' owned-habits__gear--on' : ''}`}
            onClick={() => {
              setManaging((prev) => !prev)
              setExpanded(true)
            }}
            aria-pressed={managing}
            aria-label={managing ? 'Done editing habits' : 'Edit which habits are here'}
          >
            <GearIcon />
          </button>
        </h2>
        <button
          type="button"
          className="owned-habits__all"
          onClick={() => setAll(allDone ? [] : rows.map((row) => row.key), OWNED_MARK.DONE)}
        >
          {allDone ? 'Clear all' : 'Mark all complete'}
        </button>
      </div>
      <p className="owned-habits__lead">
        {managing
          ? 'Add or remove what belongs here. Removing one only takes it off this list.'
          : `The ones that already stuck. Mark what you've done ${getDayWord()}.`}
      </p>

      {/* One row by default. A carousel hid most of the set behind a swipe
          nobody had a reason to make; a capped grid shows the shape of it and
          lets the rest be asked for. ROW_SIZE mirrors the grid's column
          count in OwnedHabits.css — keep the two in step. */}
      <ul className="owned-cards">
        {(expanded ? rows : rows.slice(0, ROW_SIZE)).map((row) => {
          const mark = getMark(row.key)
          const done = mark === OWNED_MARK.DONE
          const notToday = mark === OWNED_MARK.NOT_TODAY
          return (
            <li
              key={row.key}
              className={`owned-card${done ? ' owned-card--done' : ''}${
                notToday ? ' owned-card--not-today' : ''
              }`}
              style={{ backgroundImage: getFoundationVisual(row) }}
            >
              <span className="owned-card__scrim" />

              {managing && (
                <button
                  type="button"
                  className="owned-card__remove"
                  onClick={() => writeOption(row.pillarId, row.key.split(':')[1], false)}
                  aria-label={`Remove ${row.label}`}
                >
                  <span aria-hidden="true">×</span>
                </button>
              )}
              <p className="owned-card__label">{row.label}</p>
              <div className={`owned-card__actions${managing ? ' owned-card__actions--hidden' : ''}`}>
                <button
                  type="button"
                  className={`owned-card__toggle owned-card__toggle--done${
                    done ? ' owned-card__toggle--on' : ''
                  }`}
                  onClick={() => handleMark(row.key, OWNED_MARK.DONE)}
                  aria-pressed={done}
                  aria-label={done ? 'Undo done' : 'Mark done'}
                >
                  <CheckIcon checked={done} />
                  <span className="owned-card__toggle-label">Done</span>
                </button>
                <button
                  type="button"
                  className={`owned-card__toggle owned-card__toggle--skip${
                    notToday ? ' owned-card__toggle--on' : ''
                  }`}
                  onClick={() => handleMark(row.key, OWNED_MARK.NOT_TODAY)}
                  aria-pressed={notToday}
                  aria-label={notToday ? 'Undo not today' : 'Mark not today'}
                >
                  <SkipIcon marked={notToday} />
                  <span className="owned-card__toggle-label">Not today</span>
                </button>
              </div>
              {burstCard === row.key && (
                <ConfettiBurst fixed={false} small count={12} spread={[40, 70]} drop={120} />
              )}
            </li>
          )
        })}
      </ul>

      {managing && addable.length > 0 && (
        <div className="owned-add">
          <p className="owned-add__label">Add one you already do</p>
          <div className="owned-add__chips">
            {addable.map((option) => (
              <button
                key={option.key}
                type="button"
                className="owned-add__chip"
                onClick={() => writeOption(option.pillarId, option.id, true)}
              >
                + {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!managing && rows.length > ROW_SIZE && (
        <button
          type="button"
          className="owned-habits__expand"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `Show all ${rows.length}`}
        </button>
      )}

      {deckOpen && (
        <SnippetDeck snippets={snippets} onClose={() => setDeckOpen(false)} />
      )}

      {allDone && !doneDismissed && (
        <div className="owned-habits__done">
          {celebrateAll && <ConfettiBurst count={22} />}
          <button
            type="button"
            className="owned-habits__done-close"
            onClick={() => setDoneDismissed(true)}
            aria-label="Dismiss"
          >
            <span aria-hidden="true">×</span>
          </button>
          <p className="owned-habits__done-title">That's all of them. 🎉</p>
          <p className="owned-habits__done-body">
            Every habit you own, done today. This is the part that's already working — worth
            noticing.
          </p>
        </div>
      )}

      {/* Insights: easy wins built off the habits above and how they were
          marked. Copy lives in domain/ownedInsights.js. The CTA is a
          separate row below a divider rather than the whole block being one
          link — the snippets are the content, and "learn more" goes somewhere
          else entirely (the Progress tab), so conflating the two would make
          every suggestion look like it links to a trend chart. */}
      {insights.length > 0 && (
        <div className="owned-insights">
          <p className="owned-insights__eyebrow">
            <span className="owned-insights__sparkle">
              <SparkleIcon />
            </span>
            Insights
            {insights.length > 1 && (
              <span className="owned-insights__count">
                {(insightCursor % insights.length) + 1}/{insights.length}
              </span>
            )}
          </p>

          {/* One at a time. Three stacked suggestions filled most of a screen
              for a section that's meant to be a glance — and stacked, they
              read as a list to get through rather than a single easy win.
              `key` on the snippet is deliberate: it remounts the element on
              every change so the CSS entry animation replays. */}
          <div className="owned-insight" key={insightCursor}>
            <p className="owned-insight__text">
              <span className="owned-insight__lead">{currentInsight.lead}</span>{' '}
              <span className="owned-insight__body">{currentInsight.suggestion}</span>
            </p>

            {/* One piece shown as a small card — a preview of the reading,
                not a link row. Tapping it opens the full deck (SnippetDeck),
                where the rest can be swiped through and reacted to. */}
            {snippets.length > 0 && (
              <button
                type="button"
                className="insight-card"
                onClick={() => setDeckOpen(true)}
                aria-label={`Open ${snippets.length} takeaways`}
              >
                <span
                  className="insight-card__thumb"
                  style={snippets[0].image ? { backgroundImage: snippets[0].image } : undefined}
                />
                <span className="insight-card__body">
                  <BrandLogo brand={snippets[0].brand} className="insight-card__brand" />
                  <span className="insight-card__text">{snippets[0].text}</span>
                  {snippets.length > 1 && (
                    <span className="insight-card__more">
                      +{snippets.length - 1} more to swipe
                    </span>
                  )}
                </span>
              </button>
            )}
          </div>

          {insights.length > 1 && (
            <div className="owned-insights__nav">
              <span className="owned-insights__dots">
                {insights.map((insight, index) => (
                  <button
                    key={`${insight.row.key}-${insight.state}`}
                    type="button"
                    className={`owned-insights__dot${
                      index === insightCursor % insights.length
                        ? ' owned-insights__dot--on'
                        : ''
                    }`}
                    onClick={() => setInsightCursor(index)}
                    aria-label={`Suggestion ${index + 1} of ${insights.length}`}
                    aria-current={index === insightCursor % insights.length}
                  />
                ))}
              </span>
              <button
                type="button"
                className="owned-insights__next"
                onClick={() => setInsightCursor((prev) => (prev + 1) % insights.length)}
              >
                Another
                <span aria-hidden="true"> ↻</span>
              </button>
            </div>
          )}

          <Link to="/me" className="owned-insights__cta">
            Learn more about your progress
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      )}

    </section>
  )
}

export default OwnedHabits
