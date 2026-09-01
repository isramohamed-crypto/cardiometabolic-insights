import { useEffect, useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { daysSinceStart } from '../../domain/habitContent.js'
import { RECOMMENDATIONS_BY_PILLAR, getHabitVisual } from '../onboarding/recommendedHabits.js'
import { prefersReducedMotion } from '../../utils/motion.js'
import ConfettiBurst from '../../components/ConfettiBurst.jsx'
import './TrialPromptModal.css'

// How long each decision's celebratory beat plays before the real state
// change underneath actually lands — same value HabitTrialPrompt (this
// component's predecessor) used.
const CELEBRATION_MS = 700

// How long after Routine mounts before this checks whether anything needs
// showing — per request: land on Routine, wait a beat, then interrupt with
// the decision, rather than it competing for attention the instant the
// page appears.
const REVEAL_DELAY_MS = 1000

const BUILDING_STATES = [OWNERSHIP_STATE.ADOPTED, OWNERSHIP_STATE.OWNED, OWNERSHIP_STATE.READOPTED]
const ACTIVE_STATES = [OWNERSHIP_STATE.TRIALED, ...BUILDING_STATES]

// Same eligibility rule HabitTrialPrompt used to check once per card —
// resolved once for the whole habit list instead, since only one habit's
// decision can occupy this modal at a time. First match wins if more than
// one habit happens to hit its trial deadline the same day.
function findPendingHabitId(habits) {
  for (const habit of habits) {
    const catalogHabit = RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find(
      (h) => h.id === habit.id,
    )
    if (!catalogHabit) continue

    const isTrialing = habit.ownershipState === OWNERSHIP_STATE.TRIALED
    const daysSince = daysSinceStart(habit.startedAt)
    const trialComplete = daysSince >= 7 || habit.skipTrialWait
    if ((isTrialing && trialComplete) || habit.upsellPending) return habit.id
  }
  return null
}

// The "week of trying, keep it going?" decision — and the tier-upsell that
// can follow "Keep it" — as a full-screen, un-dismissable modal instead of
// nested inside the habit's own Routine card (compare RoutineHabitCard.jsx,
// which used to render this directly; it renders nothing for this anymore).
// Mounted once at the top of Routine.jsx rather than once per card.
//
// There is deliberately no backdrop click, no Escape key, and no × on
// either screen below — the only way this modal goes away is by actually
// finishing one of the real decision buttons, all the way through (for
// "Keep it"/"Make it smaller"/tier decisions, that means reaching the
// Confirm screen's own CTA; for "Let it go", the native confirm() dialog
// resolving is itself "going through the flow").
//
// Two screens, matching the two-part design reference this replaces
// RoutineHabitCard's old inline card with:
//   'decision' - the actual choice (trial keep/downsize/let-go, or the
//     tier upsell that can follow it) - full-bleed photo, matches the
//     "upgradeoverlay" reference image.
//   'confirm' - shown once a slot has actually just unlocked (Keep it and
//     Make it smaller both open one; Let it go doesn't) - plain light
//     background with a slot summary, matches the "upgrade2" reference
//     image. Skipped entirely for Let it go, which just closes once its
//     confirm() resolves — there's nothing to confirm there.
//
// position: fixed + a z-index above the app shell's sticky footer/header
// means this covers the whole viewport regardless of where it's mounted
// in the tree — no portal needed.
function TrialPromptModal({ onOpenAddHabit }) {
  const { habits, slotCount, updateHabitState, updateHabit, unlockSlot } = useHabits()
  const [habitId, setHabitId] = useState(null)
  const [screen, setScreen] = useState('decision') // 'decision' | 'confirm' | 'done'
  const [celebration, setCelebration] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const id = findPendingHabitId(habits)
      if (id) setHabitId(id)
    }, REVEAL_DELAY_MS)
    return () => clearTimeout(timer)
    // Runs once, REVEAL_DELAY_MS after this instance first mounts (i.e.
    // once per visit to Routine) — not re-armed every time `habits`
    // changes underneath it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!habitId || screen === 'done') return null

  // Read the habit live off context every render (rather than freezing a
  // snapshot at reveal time) — that's what lets "Keep it" chain straight
  // into the tier-upsell screen below without any extra state: once
  // ownershipState flips to ADOPTED and upsellPending flips true,
  // showTrialPrompt/showTierUpsell just naturally swap which copy renders.
  const habit = habits.find((h) => h.id === habitId)
  if (!habit) return null

  const catalogHabit = RECOMMENDATIONS_BY_PILLAR[habit.pillarId]?.habits.find(
    (h) => h.id === habit.id,
  )
  if (!catalogHabit) return null

  const tiers = catalogHabit.tiers || []
  const currentTierIndex = Math.max(0, tiers.findIndex((t) => t.label === habit.tier))
  const hasHigherTier = tiers.length > 0 && currentTierIndex < tiers.length - 1
  const hasLowerTier = tiers.length > 0 && currentTierIndex > 0
  const nextTierLabel = tiers[currentTierIndex + 1]?.label

  const celebrateThenRun = (kind, run) => {
    if (prefersReducedMotion()) {
      run()
      return
    }
    setCelebration(kind)
    setTimeout(() => {
      setCelebration(null)
      run()
    }, CELEBRATION_MS)
  }

  // "Keep it" and "Make it smaller" both graduate the habit to ADOPTED and
  // open the next slot — Keep it additionally chains into the tier-upsell
  // screen when a higher tier exists (handled by staying on 'decision':
  // the next render just picks up showTierUpsell instead of
  // showTrialPrompt). Only when there's nothing to chain into does either
  // path move on to the Confirm screen.
  const handleKeepIt = () => {
    celebrateThenRun('keep', () => {
      updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
      unlockSlot()
      if (hasHigherTier) {
        updateHabit(habit.id, { upsellPending: true })
      } else {
        setScreen('confirm')
      }
    })
  }

  const handleMakeSmaller = () => {
    celebrateThenRun('smaller', () => {
      if (hasLowerTier) {
        updateHabit(habit.id, { tier: tiers[currentTierIndex - 1].label })
      }
      updateHabitState(habit.id, OWNERSHIP_STATE.ADOPTED)
      unlockSlot()
      setScreen('confirm')
    })
  }

  const handleLetItGo = () => {
    // The confirm has to resolve first — the celebration (and modal close)
    // only happens once the person has actually committed to letting it
    // go, not on every tap of the link (which would fire it even for a
    // canceled confirm).
    if (!window.confirm('Let this habit go? It will be removed from your Today list.')) return
    celebrateThenRun('letgo', () => {
      updateHabitState(habit.id, OWNERSHIP_STATE.ABANDONED)
      setScreen('done')
    })
  }

  const handleUpgradeTier = () => {
    celebrateThenRun('upgrade', () => {
      updateHabit(habit.id, { tier: nextTierLabel, upsellPending: false })
      setScreen('confirm')
    })
  }

  const handleStayAtTier = () => {
    celebrateThenRun('stay', () => {
      updateHabit(habit.id, { upsellPending: false })
      setScreen('confirm')
    })
  }

  if (screen === 'confirm') {
    // Live-computed at Confirm-render time, not snapshotted mid-decision —
    // by the time this screen renders, unlockSlot()'s setSlotCount and
    // this screen's own setScreen('confirm') already landed in the same
    // batched update, so habits/slotCount here already reflect the
    // decision that was just made.
    const activeCount = habits.filter((h) => ACTIVE_STATES.includes(h.ownershipState)).length
    const hasOpenSlot = activeCount < slotCount

    return (
      <div className="trial-prompt-modal trial-prompt-modal--confirm">
        <div className="trial-prompt-modal__confirm-icon" aria-hidden="true">
          <span />
        </div>
        <h2 className="trial-prompt-modal__confirm-headline">
          "{habit.tier}" it is
          {hasOpenSlot ? (
            <>
              {' — '}
              <span className="trial-prompt-modal__headline-accent">
                and room for one more.
              </span>
            </>
          ) : (
            '.'
          )}
        </h2>
        <p className="trial-prompt-modal__confirm-desc">
          {hasOpenSlot
            ? "You've earned a second slot. There's no rush to fill it, and one habit is a perfectly good routine."
            : 'Nice work — that decision is locked in.'}
        </p>

        {hasOpenSlot && (
          <div className="trial-prompt-modal__slots">
            <div className="trial-prompt-modal__slot trial-prompt-modal__slot--filled">
              <div>
                <p className="trial-prompt-modal__slot-title">{habit.title}</p>
                <p className="trial-prompt-modal__slot-meta">Slot 1 · yours</p>
              </div>
              <span className="trial-prompt-modal__slot-dot" aria-hidden="true" />
            </div>
            <div className="trial-prompt-modal__slot trial-prompt-modal__slot--open">
              Slot 2 — just opened
            </div>
          </div>
        )}

        <button
          type="button"
          className="trial-prompt-modal__primary"
          onClick={() => {
            setScreen('done')
            if (hasOpenSlot) onOpenAddHabit?.()
          }}
        >
          {hasOpenSlot ? "See what's open" : 'Got it'}
        </button>
      </div>
    )
  }

  const isTrialing = habit.ownershipState === OWNERSHIP_STATE.TRIALED
  const daysSince = daysSinceStart(habit.startedAt)
  const trialComplete = daysSince >= 7 || habit.skipTrialWait
  const showTrialPrompt = isTrialing && trialComplete
  const showTierUpsell = Boolean(habit.upsellPending)

  // Shouldn't normally happen mid-flow (both flags only ever go false
  // together with a screen transition already queued above) — a safety
  // net in case habits changes out from under this some other way.
  if (!showTrialPrompt && !showTierUpsell) return null

  const visual = getHabitVisual(habit.pillarId, habit.id)

  return (
    <div className="trial-prompt-modal" style={{ backgroundImage: visual }}>
      <div className="trial-prompt-modal__scrim" />
      <div className="trial-prompt-modal__content">
        <p className="trial-prompt-modal__eyebrow">One week in</p>

        {showTierUpsell ? (
          <>
            <h2 className="trial-prompt-modal__headline">
              "{habit.title}" all week.{' '}
              <span className="trial-prompt-modal__headline-accent">
                Want to make it {nextTierLabel}?
              </span>
            </h2>
            <p className="trial-prompt-modal__desc">
              {nextTierLabel} is where the payoff really shows up. But "{habit.tier}" is already
              working — staying there is a completely good answer too.
            </p>
            <div className="trial-prompt-modal__actions">
              <button
                type="button"
                className="trial-prompt-modal__primary"
                disabled={Boolean(celebration)}
                onClick={handleUpgradeTier}
              >
                Let's make it {nextTierLabel}
              </button>
              <button
                type="button"
                className="trial-prompt-modal__secondary"
                disabled={Boolean(celebration)}
                onClick={handleStayAtTier}
              >
                "{habit.tier}" is right for now
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="trial-prompt-modal__headline">
              You've kept up "{habit.title}" all week.{' '}
              <span className="trial-prompt-modal__headline-accent">Keep it going?</span>
            </h2>
            <p className="trial-prompt-modal__desc">
              No wrong answer — this is just the check-in we do at the end of a trial.
            </p>
            <div className="trial-prompt-modal__actions">
              <button
                type="button"
                className="trial-prompt-modal__primary"
                disabled={Boolean(celebration)}
                onClick={handleKeepIt}
              >
                Keep it
              </button>
              {hasLowerTier && (
                <button
                  type="button"
                  className="trial-prompt-modal__secondary"
                  disabled={Boolean(celebration)}
                  onClick={handleMakeSmaller}
                >
                  Make it smaller
                </button>
              )}
              <button
                type="button"
                className="trial-prompt-modal__link"
                disabled={Boolean(celebration)}
                onClick={handleLetItGo}
              >
                Let it go
              </button>
            </div>
          </>
        )}

        {celebration && <ConfettiBurst fixed={false} spread={[60, 130]} drop={180} />}
      </div>
    </div>
  )
}

export default TrialPromptModal
