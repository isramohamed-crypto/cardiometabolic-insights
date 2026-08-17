import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useOwnedChecklist, OWNED_MARK } from '../../habits/OwnedChecklistContext.jsx'
import { listFoundationHabits, getFoundationVisual } from '../../domain/foundationHabits.js'
import { getOwnedInsights } from '../../domain/ownedInsights.js'
import { getDayWord } from '../../domain/timeOfDay.js'
import CheckIcon from '../../components/CheckIcon.jsx'
import SkipIcon from '../../components/SkipIcon.jsx'
import SparkleIcon from '../../components/SparkleIcon.jsx'
import ConfettiBurst from '../../components/ConfettiBurst.jsx'
import './OwnedHabits.css'

// How long a per-card confetti pop stays mounted, and how long the all-done
// banner's burst does. Both are just long enough to finish the ConfettiBurst
// keyframes (~0.9s including the gravity drop) — the mark itself is
// permanent, only the celebration is transient.
const CARD_BURST_MS = 950
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
  const { answers } = useOnboarding()
  const { marks, getMark, setMark, setAll } = useOwnedChecklist()
  const [burstCard, setBurstCard] = useState(null)
  const [celebrateAll, setCelebrateAll] = useState(false)
  const [insightCursor, setInsightCursor] = useState(0)

  const rows = useMemo(
    () => listFoundationHabits(answers.habitsWorking || {}),
    [answers.habitsWorking],
  )

  // Recomputed on every mark on purpose — reacting to what was just tapped
  // is the whole point of the insights list (see domain/ownedInsights.js).
  const insights = getOwnedInsights(rows, marks)

  const currentInsight = insights.length ? insights[insightCursor % insights.length] : null

  const doneCount = rows.filter((row) => getMark(row.key) === OWNED_MARK.DONE).length
  const allDone = rows.length > 0 && doneCount === rows.length

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

  if (rows.length === 0) return null

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
        </h2>
        <button
          type="button"
          className="owned-habits__all"
          onClick={() => setAll(allDone ? [] : rows.map((row) => row.key), OWNED_MARK.DONE)}
        >
          {allDone ? 'Start over' : 'Mark all complete'}
        </button>
      </div>
      <p className="owned-habits__lead">
        The ones that already stuck. Mark what you've done {getDayWord()}.
      </p>

      <ul className="owned-cards">
        {rows.map((row) => {
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
              <p className="owned-card__label">{row.label}</p>
              <div className="owned-card__actions">
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

      {allDone && (
        <div className="owned-habits__done">
          {celebrateAll && <ConfettiBurst count={22} />}
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
          <p className="owned-insight" key={insightCursor}>
            <span className="owned-insight__lead">{currentInsight.lead}</span>{' '}
            <span className="owned-insight__body">{currentInsight.suggestion}</span>
          </p>

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
