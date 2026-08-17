import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useOwnedChecklist } from '../../habits/OwnedChecklistContext.jsx'
import { listFoundationHabits } from '../../domain/foundationHabits.js'
import { getDayWord } from '../../domain/timeOfDay.js'
import { getAclmIcon } from '../../domain/aclmIcons.js'
import CheckIcon from '../../components/CheckIcon.jsx'
import SparkleIcon from '../../components/SparkleIcon.jsx'
import ConfettiBurst from '../../components/ConfettiBurst.jsx'
import './OwnedHabits.css'

// How long a per-row confetti pop stays mounted, and how long the
// all-done banner's burst does. Both are just long enough to finish the
// ConfettiBurst keyframes (~0.9s including the gravity drop) — the row's
// checked state itself is permanent, only the celebration is transient.
const ROW_BURST_MS = 950
const ALL_BURST_MS = 1600

// "Habits I own" — the foundation habits carried in from onboarding.
//
// The point of this section is affirmation, not tracking: these are things
// the person already does, so the interaction is "yes, I did that" and the
// reward is immediate. Hence no streaks, no misses, no empty-state guilt —
// an unchecked row is neutral, and nothing anywhere counts what didn't get
// ticked. Unchecking is always allowed (a mis-tap shouldn't be permanent).
//
// Presented as one grouped panel with hairline dividers rather than a
// stack of individually-boxed rows with leading checkboxes: the boxed
// version read as a to-do list, which is the opposite of the intent. The
// tick moved to the trailing edge for the same reason — a column of empty
// boxes down the left is the strongest "unfinished chores" signal there
// is, where a trailing check reads as confirmation of something already
// true.
//
// Sourced from onboarding answers via listFoundationHabits, which every
// demo profile seeds identically (see demo/profiles.js FOUNDATION_ANSWERS),
// so this populates for all of them and for a real onboarding run alike.
function OwnedHabits() {
  const { answers } = useOnboarding()
  const { isChecked, toggle, setAll } = useOwnedChecklist()
  const [burstRow, setBurstRow] = useState(null)
  const [celebrateAll, setCelebrateAll] = useState(false)

  const rows = useMemo(
    () => listFoundationHabits(answers.habitsWorking || {}),
    [answers.habitsWorking],
  )

  const doneCount = rows.filter((row) => isChecked(row.key)).length
  const allDone = rows.length > 0 && doneCount === rows.length

  // Fire the big celebration on the transition into "all done" only — not
  // on every render while it stays true.
  useEffect(() => {
    if (!allDone) return
    setCelebrateAll(true)
    const timer = setTimeout(() => setCelebrateAll(false), ALL_BURST_MS)
    return () => clearTimeout(timer)
  }, [allDone])

  useEffect(() => {
    if (!burstRow) return
    const timer = setTimeout(() => setBurstRow(null), ROW_BURST_MS)
    return () => clearTimeout(timer)
  }, [burstRow])

  if (rows.length === 0) return null

  const handleToggle = (key) => {
    // Only celebrate ticking on — unticking is a correction, not a moment.
    if (!isChecked(key)) setBurstRow(key)
    toggle(key)
  }

  return (
    <section className="owned-habits">
      <div className="owned-habits__head">
        <h2>
          <span className="owned-habits__sparkle">
            <SparkleIcon />
          </span>
          Habits I own <span className="page__count">{doneCount}/{rows.length}</span>
        </h2>
        <button
          type="button"
          className="owned-habits__all"
          onClick={() => setAll(allDone ? [] : rows.map((row) => row.key))}
        >
          {allDone ? 'Start over' : 'All of them'}
        </button>
      </div>
      <p className="owned-habits__lead">
        The ones that already stuck. Tap what you've done {getDayWord()}.
      </p>

      <ul className="owned-habits__panel">
        {rows.map((row) => {
          const checked = isChecked(row.key)
          return (
            <li key={row.key}>
              <button
                type="button"
                className={`owned-habit${checked ? ' owned-habit--done' : ''}`}
                onClick={() => handleToggle(row.key)}
                aria-pressed={checked}
              >
                <img className="owned-habit__pillar" src={getAclmIcon(row.pillarId)} alt="" />
                <span className="owned-habit__label">{row.label}</span>
                <span className="owned-habit__check">
                  <CheckIcon checked={checked} />
                </span>
                {burstRow === row.key && (
                  <ConfettiBurst
                    fixed={false}
                    small
                    count={12}
                    spread={[40, 70]}
                    drop={120}
                    originLeft="86%"
                  />
                )}
              </button>
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

      {/* Insights placeholder. What this card actually says isn't decided
          yet — it's here as the shape of the idea (a generated read on what
          these habits add up to) with a real route through to the Progress
          tab, where the trend data already lives. Swap the body copy for a
          real derived insight when there's one to show; the card, its
          sparkle and its link don't need to change for that. */}
      <Link to="/me" className="owned-insights">
        <span className="owned-insights__icon">
          <SparkleIcon />
        </span>
        <span className="owned-insights__text">
          <span className="owned-insights__title">What this adds up to</span>
          <span className="owned-insights__body">
            Your habits are building a pattern. See how it's trending.
          </span>
        </span>
        <span className="owned-insights__arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </section>
  )
}

export default OwnedHabits
