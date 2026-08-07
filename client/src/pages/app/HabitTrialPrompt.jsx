import { useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR } from '../onboarding/recommendedHabits.js'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { daysSinceStart } from '../../domain/habitContent.js'
import { prefersReducedMotion } from '../../utils/motion.js'
import ConfettiBurst from '../../components/ConfettiBurst.jsx'
import './HabitTrialPrompt.css'

// How long each decision's celebratory beat (confetti for keep-it/let-it-go,
// the sparkle badge for the tier upsell) plays before the real state change
// underneath actually lands — long enough for the outward burst/pop-in to
// read clearly, short enough it doesn't feel like the button ignored the
// tap. Same value onboarding's Recommendations uses for its own confetti
// settle-then-transition beat (CONFETTI_SETTLE_MS).
const CELEBRATION_MS = 700

// The "week of trying, keep it going?" decision — and the tier-upsell that
// can follow "Keep it" — used to render as a full card inside HabitDetail's
// flip card. Moved here, directly under the habit's own card on the
// Routine tab, then moved once more — the whole thing (question,
// description, and decision buttons) now nests inside RoutineHabitCard
// itself instead of sitting in its own card underneath (see
// RoutineHabitCard.jsx, which renders this component directly and swallows
// its clicks before they can bubble up to the card's own Link). HabitDetail
// itself still only shows a one-line pointer back to Routine (see its
// .habit-detail__trial-hint).
//
// Both "which trial state is this habit in" flags — skipTrialWait and
// upsellPending — live on the habit object itself (set via updateHabit)
// rather than as this component's own state. That's deliberate: "Keep it"
// flips ownershipState to ADOPTED immediately, which moves this habit from
// Routine's "trying on" list into its "building" list on the very next
// render — a different section, so this component gets torn down and a new
// instance mounted in the new section. Local state wouldn't have survived
// that remount; a flag stored on the habit does.
//
// `celebration` is local state anyway, for the small celebratory beat each
// decision now gets (a confetti burst for Keep it/Let it go, a sparkle
// badge for the tier upsell) — celebrateThenRun below holds off the actual
// mutation (the thing that would tear this instance down) until after the
// beat plays, so there's nothing to survive a remount; local state is fine.
function HabitTrialPrompt({ habit }) {
  const { updateHabitState, updateHabit, unlockSlot } = useHabits()
  const [celebration, setCelebration] = useState(null) // null | 'keep' | 'letgo' | 'upgrade' | 'stay'

  const catalogHabit = RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find(
    (h) => h.id === habit.id,
  )
  if (!catalogHabit) return null

  const isTrialing = habit.ownershipState === OWNERSHIP_STATE.TRIALED
  const daysSince = daysSinceStart(habit.startedAt)
  const trialComplete = daysSince >= 7 || habit.skipTrialWait
  const showTrialPrompt = isTrialing && trialComplete
  const showTierUpsell = Boolean(habit.upsellPending)

  if (!showTrialPrompt && !showTierUpsell) return null

  const tiers = catalogHabit.tiers || []
  const currentTierIndex = Math.max(0, tiers.findIndex((t) => t.label === habit.tier))
  const hasHigherTier = tiers.length > 0 && currentTierIndex < tiers.length - 1
  const hasLowerTier = tiers.length > 0 && currentTierIndex > 0

  // Plays the celebratory beat (confetti/sparkle, via `celebration`) then
  // runs the actual mutation once it's had time to read — or, under
  // prefers-reduced-motion, just runs it immediately, since there's no
  // animation left to wait on. Either way `run` is what used to happen
  // synchronously inside each handler below.
  const celebrateThenRun = (kind, run) => {
    if (prefersReducedMotion()) {
      run()
      return
    }
    setCelebration(kind)
    setTimeout(run, CELEBRATION_MS)
  }

  // "Keep it" and "make it smaller" both graduate the habit to ADOPTED and
  // open the next slot — the difference is only whether the tier steps
  // down first. "Let it go" retires it and grants nothing. Only Keep it and
  // Let it go get the confetti beat (as asked) — Make it smaller stays a
  // plain, immediate action.
  const handleKeepIt = () => {
    celebrateThenRun('keep', () => {
      updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
      unlockSlot()
      if (hasHigherTier) {
        updateHabit(habit.id, { upsellPending: true })
      }
    })
  }

  const handleMakeSmaller = () => {
    if (hasLowerTier) {
      updateHabit(habit.id, { tier: tiers[currentTierIndex - 1].label })
    }
    updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
    unlockSlot()
  }

  const handleLetItGo = () => {
    // The confirm has to resolve first — the celebration only plays once
    // the person has actually committed to letting it go, not on every tap
    // of the link (which would fire it even for a canceled confirm).
    if (!window.confirm('Let this habit go? It will be removed from your Routine.')) return
    celebrateThenRun('letgo', () => updateHabitState(habit.id, OWNERSHIP_STATE.ABANDONED))
  }

  const handleUpgradeTier = () => {
    celebrateThenRun('upgrade', () =>
      updateHabit(habit.id, { tier: tiers[currentTierIndex + 1].label, upsellPending: false }),
    )
  }

  const handleStayAtTier = () => {
    celebrateThenRun('stay', () => updateHabit(habit.id, { upsellPending: false }))
  }

  if (showTierUpsell) {
    return (
      <section className="habit-trial-prompt">
        <h3 className="habit-trial-prompt__title">
          "{habit.tier}" is working. Want to make it {tiers[currentTierIndex + 1]?.label}?
        </h3>
        <p className="habit-trial-prompt__desc">
          Staying at "{habit.tier}" is a completely good answer, too.
        </p>
        <div className="habit-trial-prompt__actions">
          <button
            type="button"
            className="habit-trial-prompt__primary"
            disabled={Boolean(celebration)}
            onClick={handleUpgradeTier}
          >
            Let's make it {tiers[currentTierIndex + 1]?.label}
          </button>
          <button
            type="button"
            className="habit-trial-prompt__link"
            disabled={Boolean(celebration)}
            onClick={handleStayAtTier}
          >
            "{habit.tier}" is right for now
          </button>
          {/* Distinct from the confetti burst below (Keep it/Let it go) —
              a small sparkle badge pop-in instead, since this is its own
              separate decision moment, not the trial check-in itself. */}
          {(celebration === 'upgrade' || celebration === 'stay') && (
            <div className="habit-trial-prompt__sparkle" aria-hidden="true">
              <span className="habit-trial-prompt__sparkle-badge">
                <span aria-hidden="true">✨</span>
                {celebration === 'upgrade' ? "Let's go" : 'Good call'}
              </span>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="habit-trial-prompt">
      <h3 className="habit-trial-prompt__title">A week of trying. Keep it going?</h3>
      <p className="habit-trial-prompt__desc">
        No wrong answer — this is just the check-in we do at the end of a trial.
      </p>
      <div className="habit-trial-prompt__actions">
        <button
          type="button"
          className="habit-trial-prompt__primary"
          disabled={Boolean(celebration)}
          onClick={handleKeepIt}
        >
          Keep it
        </button>
        {hasLowerTier && (
          <button
            type="button"
            className="habit-trial-prompt__secondary"
            disabled={Boolean(celebration)}
            onClick={handleMakeSmaller}
          >
            Make it smaller
          </button>
        )}
        <button
          type="button"
          className="habit-trial-prompt__link"
          disabled={Boolean(celebration)}
          onClick={handleLetItGo}
        >
          Let it go
        </button>
        {(celebration === 'keep' || celebration === 'letgo') && (
          <ConfettiBurst fixed={false} small count={16} spread={[16, 40]} drop={60} />
        )}
      </div>
    </section>
  )
}

export default HabitTrialPrompt
