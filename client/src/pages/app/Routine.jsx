import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { getDemoProfile } from '../../demo/profiles.js'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { buildEditorialFeed } from '../../domain/editorialPicks.js'
import { getNewForYouHeading } from '../../domain/timeOfDay.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import EditorialCard from '../../components/EditorialCard.jsx'
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

// Floor for the "Living healthy" carousel. One pick per active habit leaves
// the first-time-user profile looking at a single card — and a lone card
// fills the track, so nothing peeks in at the edge and there's no clue the
// row scrolls at all. Padding out of the same habits' wider libraries keeps
// at least this many, so the swipe affordance is always visible.
const MIN_FEED_CARDS = 4

function Routine() {
  const { habits, slotCount, seedHabits } = useHabits()
  const { loadAnswers } = useOnboarding()
  const [addingHabit, setAddingHabit] = useState(false)

  // User-testing fallback: a cold, direct visit to /today (no onboarding,
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
  // cold /today visit (seeded by the effect above) or a demo-profile
  // switch. That silently emptied this whole section for two of the three
  // demo profiles. Keyed on activeHabitsKey instead, it fills in as soon as
  // habits arrive, and still rotates per visit (pickDailyContent's pool
  // fallback is random) rather than per render.
  // The editorial package for this section: a cover story, then one card
  // per piece of content off the active habits. See domain/editorialPicks.js
  // — including the note on why pull-quotes are attributed to publications
  // rather than to named editors.
  //
  // Keyed on activeHabitsKey rather than activeHabits itself: that array is
  // a fresh reference every render, so depending on it would re-randomise
  // the pool-fallback picks constantly. It also means the feed fills in when
  // habits are seeded *after* mount (a cold /today visit, or a demo-profile
  // switch), which a useState initializer silently failed to do.
  const feed = useMemo(
    () => buildEditorialFeed(activeHabits),
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
      {feed.length > 0 && (
        <section>
          <h2>{getNewForYouHeading()}</h2>
          <p className="page__section-lead">
            Picked for what you're working on right now, from the People Inc. newsrooms.
          </p>
          <div className="content-carousel content-carousel--editorial">
            {feed.map(({ habit, item }) => (
              <EditorialCard
                key={item.id}
                item={item}
                thumbnail={habit ? getHabitVisual(habit.pillarId, habit.id) : undefined}
              />
            ))}
            {/* Last card in the row rather than a link under it. As a
                full-width text link it was the loudest thing in the section
                — and putting it at the end of the scroll means reaching it
                is the natural result of swiping through the stories. */}
            <Link to="/read" className="content-carousel__more">
              <span className="content-carousel__more-arrow" aria-hidden="true">
                →
              </span>
              <span className="content-carousel__more-label">See more in Read</span>
            </Link>
          </div>
        </section>
      )}

      <OwnedHabits />

      {(activeHabits.length > 0 || nextSlotContent) && (
        <section>
          <h2>Habits I'm building</h2>
          <p className="page__section-lead">
            The newer ones, still finding their footing. Tap any of them to see the week.
          </p>
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
          <p className="page__section-lead">
            Nothing here yet. Pick one habit to start with — one is plenty.
          </p>
        </section>
      )}
    </div>
  )
}

export default Routine
