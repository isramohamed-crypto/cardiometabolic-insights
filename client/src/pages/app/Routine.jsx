import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { getDemoProfile } from '../../demo/profiles.js'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { pickDailyContent } from '../../domain/habitContent.js'
import { getNewForYouHeading } from '../../domain/timeOfDay.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import ContentCard from '../../components/ContentCard.jsx'
import RoutineHabitCard from './RoutineHabitCard.jsx'
import OwnedHabits from './OwnedHabits.jsx'
import AddHabitFlow from './AddHabitFlow.jsx'
import TrialPromptModal from './TrialPromptModal.jsx'
import './page.css'

const BUILDING_STATES = [
  OWNERSHIP_STATE.ADOPTED,
  OWNERSHIP_STATE.OWNED,
  OWNERSHIP_STATE.READOPTED,
]

const ACTIVE_STATES = [OWNERSHIP_STATE.TRIALED, ...BUILDING_STATES]

function Routine() {
  const { habits, slotCount, seedHabits } = useHabits()
  const { loadAnswers } = useOnboarding()
  const [addingHabit, setAddingHabit] = useState(false)

  // User-testing fallback: a cold, direct visit to /routine (no onboarding,
  // no ?profile= seed) would otherwise render an empty page. Seed the
  // 'new-user' persona so there's always a habit to react to.
  useEffect(() => {
    if (habits.length === 0) {
      const profile = getDemoProfile('new-user')
      if (profile) {
        const { answers, habits: seededHabits, slotCount: seededSlot } = profile.build()
        loadAnswers(answers)
        seedHabits(seededHabits, seededSlot)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Every active habit lives under one "Habits I'm building" list — no
  // separate trial vs. building sections. Whether a habit is still in its
  // trial is surfaced inside the habit itself (its "trying it out" status),
  // not by splitting the feed. Trial state is untouched under the hood, so
  // the trial wrap-up + slot unlock (TrialPromptModal) still fire.
  const activeHabits = habits.filter((h) => ACTIVE_STATES.includes(h.ownershipState))
  const activeCount = activeHabits.length
  const nextSlotLocked = activeCount >= slotCount

  // Identity key for the memo below. activeHabits is a fresh array on every
  // render, so depending on it directly would recompute (and re-randomize)
  // the feed constantly; a string of what actually matters — which habits,
  // started when — is stable across unrelated re-renders like a card being
  // liked.
  const activeHabitsKey = activeHabits.map((h) => `${h.id}@${h.startedAt}`).join('|')

  // One shared "tonight" pick per active habit, combined into a single
  // section above the habit cards — rather than repeating a content teaser
  // underneath each individual card.
  //
  // This used to be a useState initializer, which ran once at mount and so
  // came up empty whenever habits were seeded *after* the page mounted — a
  // cold /routine visit (seeded by the effect above) or a demo-profile
  // switch. That silently emptied this whole section for two of the three
  // demo profiles. Keyed on activeHabitsKey instead, it fills in as soon as
  // habits arrive, and still rotates per visit (pickDailyContent's pool
  // fallback is random) rather than per render.
  const tonightPicks = useMemo(
    () =>
      activeHabits
        .map((habit) => ({ habit, content: pickDailyContent(habit.id, habit.startedAt) }))
        .filter((entry) => entry.content),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeHabitsKey],
  )

  // Next slot used to be its own section with its own "Next slot" header —
  // now it just tucks into the end of whichever habit-list section is
  // already on screen (preferring "Habits I'm trying on", since that's
  // the trial-stage list this is most often reached from) instead of
  // announcing itself as a separate thing. Falls back to "Habits I'm
  // building" when there's nothing currently trialing, and only becomes
  // its own bare (still headerless) section in the edge case where
  // neither list is showing but a slot still needs surfacing.
  const nextSlotContent = nextSlotLocked ? (
    <div className="locked-slot">
      <span className="locked-slot__icon" aria-hidden="true">
        🔒
      </span>
      <div>
        <p className="locked-slot__title">Locked for now</p>
        <p className="locked-slot__desc">
          Finish a trial — keep it or make it smaller — and this opens up.
        </p>
      </div>
    </div>
  ) : (
    habits.length > 0 && (
      <button type="button" className="open-slot" onClick={() => setAddingHabit(true)}>
        <span className="open-slot__icon" aria-hidden="true">
          +
        </span>
        <div>
          <p className="open-slot__title">Add a habit</p>
          <p className="open-slot__desc">You've got room for one more.</p>
        </div>
      </button>
    )
  )

  // Adding a habit later happens right here in the page body — AppLayout's
  // Header/Footer stay mounted throughout, unlike onboarding's version of
  // this same flow, which is a full standalone screen.
  if (addingHabit) {
    return (
      <div className="page">
        <AddHabitFlow onClose={() => setAddingHabit(false)} />
      </div>
    )
  }

  return (
    <div className="page">
      <TrialPromptModal onOpenAddHabit={() => setAddingHabit(true)} />

      {/* Heading follows the clock — "tonight" read as wrong to anyone
          opening this at breakfast (see domain/timeOfDay.js). */}
      {tonightPicks.length > 0 && (
        <section>
          <h2>{getNewForYouHeading()}</h2>
          <div className="content-carousel">
            {tonightPicks.map(({ habit, content }) => (
              <ContentCard
                key={content.id}
                id={content.id}
                thumbnail={content.image || getHabitVisual(habit.pillarId, habit.id)}
                brand={content.brand}
                title={content.title}
                body={content.body}
                fullBody={content.fullBody}
                url={content.url}
                actions
              />
            ))}
          </div>
          <Link
            to="/read"
            className="routine-habit-card__drip-more"
            style={{ display: 'inline-block', marginTop: 10 }}
          >
            See more in Learn →
          </Link>
        </section>
      )}

      <OwnedHabits />

      {(activeHabits.length > 0 || nextSlotContent) && (
        <section>
          <h2>Habits I'm building</h2>
          <div className="routine-habit-list">
            {activeHabits.map((habit) => (
              <RoutineHabitCard key={habit.id} habit={habit} />
            ))}
            {nextSlotContent}
          </div>
        </section>
      )}

      {habits.length === 0 && (
        <section>
          <h2>Today</h2>
          <p>Pick a habit to start building your routine.</p>
        </section>
      )}
    </div>
  )
}

export default Routine
