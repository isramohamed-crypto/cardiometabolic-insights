import { useEffect, useMemo, useState } from 'react'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useOwnedChecklist } from '../../habits/OwnedChecklistContext.jsx'
import { listFoundationHabits } from '../../domain/foundationHabits.js'
import { getDayWord } from '../../domain/timeOfDay.js'
import { getAclmIcon } from '../../domain/aclmIcons.js'
import CheckIcon from '../../components/CheckIcon.jsx'
import ConfettiBurst from '../../components/ConfettiBurst.jsx'
import './OwnedHabits.css'

// How long a per-row confetti pop stays mounted, and how long the
// all-done banner's burst does. Both are just long enough to finish the
// ConfettiBurst keyframes (~0.9s including the gravity drop) — the row's
// checked state itself is permanent, only the celebration is transient.
const ROW_BURST_MS = 950
const ALL_BURST_MS = 1600

// "Habits I own" — the foundation habits carried in from onboarding,
// rendered as a daily checklist rather than a static roster.
//
// The point of this section is affirmation, not tracking: these are things
// the person already does, so the interaction is "yes, I did that" and the
// reward is immediate. Hence no streaks, no misses, no empty-state guilt —
// an unchecked row is neutral, and nothing anywhere counts what didn't get
// ticked. Unchecking is always allowed (a mis-tap shouldn't be permanent).
//
// Sourced from onboarding answers via listFoundationHabits, which every
// demo profile seeds identically (see demo/profiles.js FOUNDATION_ANSWERS),
// so this populates for all of them and for a real onboarding run alike.
// Renders nothing at all when there are no foundation answers — a real
// visitor who picked "None of these" on every pillar shouldn't get an
// empty box.
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

  // Fire the big celebration on the transition into "all done" only —
  // not on every render while it stays true, and not again if a row is
  // unchecked and re-checked without the whole set completing in between.
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

  const handleToggleAll = () => {
    if (allDone) {
      setAll([])
      return
    }
    setAll(rows.map((row) => row.key))
  }

  return (
    <section className="owned-habits">
      <h2>
        Habits I own <span className="page__count">{doneCount}/{rows.length}</span>
      </h2>
      <p className="owned-habits__lead">
        The ones that already stuck. Tick off what you've done {getDayWord()}.
      </p>

      <button type="button" className="owned-habits__all" onClick={handleToggleAll}>
        {allDone ? 'Start over' : 'I did all of these'}
      </button>

      <ul className="owned-habits__list">
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
                <span className="owned-habit__check">
                  <CheckIcon checked={checked} />
                </span>
                <span className="owned-habit__text">
                  <span className="owned-habit__label">{row.label}</span>
                  <span className="owned-habit__pillar">
                    <img src={getAclmIcon(row.pillarId)} alt="" />
                    {row.pillarLabel}
                  </span>
                </span>
                {burstRow === row.key && (
                  <ConfettiBurst
                    fixed={false}
                    small
                    count={12}
                    spread={[40, 70]}
                    drop={120}
                    originLeft="18%"
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
    </section>
  )
}

export default OwnedHabits
