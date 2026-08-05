import { useHabits } from '../../habits/HabitsContext.jsx'
import { RECOMMENDATIONS_BY_PILLAR } from '../onboarding/recommendedHabits.js'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { daysSinceStart } from '../../domain/habitContent.js'
import './HabitTrialPrompt.css'

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
function HabitTrialPrompt({ habit }) {
  const { updateHabitState, updateHabit, unlockSlot } = useHabits()

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

  // "Keep it" and "make it smaller" both graduate the habit to ADOPTED and
  // open the next slot — the difference is only whether the tier steps
  // down first. "Let it go" retires it and grants nothing.
  const handleKeepIt = () => {
    updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
    unlockSlot()
    if (hasHigherTier) {
      updateHabit(habit.id, { upsellPending: true })
    }
  }

  const handleMakeSmaller = () => {
    if (hasLowerTier) {
      updateHabit(habit.id, { tier: tiers[currentTierIndex - 1].label })
    }
    updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
    unlockSlot()
  }

  const handleLetItGo = () => {
    if (window.confirm('Let this habit go? It will be removed from your Routine.')) {
      updateHabitState(habit.id, OWNERSHIP_STATE.ABANDONED)
    }
  }

  const handleUpgradeTier = () => {
    updateHabit(habit.id, { tier: tiers[currentTierIndex + 1].label, upsellPending: false })
  }

  const handleStayAtTier = () => {
    updateHabit(habit.id, { upsellPending: false })
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
          <button type="button" className="habit-trial-prompt__primary" onClick={handleUpgradeTier}>
            Let's make it {tiers[currentTierIndex + 1]?.label}
          </button>
          <button type="button" className="habit-trial-prompt__link" onClick={handleStayAtTier}>
            "{habit.tier}" is right for now
          </button>
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
        <button type="button" className="habit-trial-prompt__primary" onClick={handleKeepIt}>
          Keep it
        </button>
        {hasLowerTier && (
          <button type="button" className="habit-trial-prompt__secondary" onClick={handleMakeSmaller}>
            Make it smaller
          </button>
        )}
        <button type="button" className="habit-trial-prompt__link" onClick={handleLetItGo}>
          Let it go
        </button>
      </div>
    </section>
  )
}

export default HabitTrialPrompt
