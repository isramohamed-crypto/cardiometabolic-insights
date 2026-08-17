import { useEffect, useMemo, useState } from 'react'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useReactions } from '../../content/ReactionsContext.jsx'
import { getDemoProfile } from '../../demo/profiles.js'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { pickDailyContent, listHabitContent } from '../../domain/habitContent.js'
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

// Floor for the "New for you" feed. One pick per active habit alone leaves
// a brand-new visitor looking at a single card, which doesn't read as a
// place where new things surface — so the feed pads itself out of the same
// habits' wider libraries up to this many cards. Habits with more active
// habits than this still show one per habit rather than being truncated.
const MIN_FEED_CARDS = 3

function Routine() {
  const { habits, slotCount, seedHabits } = useHabits()
  const { loadAnswers } = useOnboarding()
  const { isDisliked } = useReactions()
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

  // The "New for you" candidate list, longest-lived first: today's scripted
  // pick for each active habit, then the rest of each habit's library as
  // backfill. Deduped across habits, since two habits can share an article.
  //
  // This used to be a useState initializer, which ran once at mount and so
  // came up empty whenever habits were seeded *after* the page mounted — a
  // cold /routine visit (seeded by the effect above) or a demo-profile
  // switch from the Progress tab. That silently emptied this whole section
  // for two of the three demo profiles. Keyed on activeHabitsKey instead,
  // it now fills in as soon as habits arrive, and still rotates per visit
  // (pickDailyContent's pool fallback is random) rather than per render.
  const contentFeed = useMemo(() => {
    const seen = new Set()
    const feed = []

    const push = (habit, content) => {
      if (!content || seen.has(content.id)) return
      seen.add(content.id)
      feed.push({ habit, content })
    }

    activeHabits.forEach((habit) => push(habit, pickDailyContent(habit.id, habit.startedAt)))
    activeHabits.forEach((habit) =>
      listHabitContent(habit.id).forEach((content) => push(habit, content)),
    )

    return feed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHabitsKey])

  // Disliking a card drops it and lets the next candidate slide up into
  // its place, rather than leaving a gap — which is why the feed above is
  // built as a long candidate list and only sliced here at render.
  const visibleFeed = contentFeed
    .filter(({ content }) => !isDisliked(content.id))
    .slice(0, Math.max(MIN_FEED_CARDS, activeCount))

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

      {/* Content leads the page, and its heading follows the clock —
          "tonight" read as wrong to anyone opening this at breakfast (see
          domain/timeOfDay.js). The old "See more in Learn" link-out is
          gone: the cards carry their own thumbs-up / thumbs-down / save
          now, so the section is something to react to in place rather
          than a teaser pointing somewhere else. Saving still lands on the
          Learn tab, which is where a saved article belongs. */}
      {visibleFeed.length > 0 && (
        <section>
          <h2>{getNewForYouHeading()}</h2>
          <div className="routine-habit-list">
            {visibleFeed.map(({ habit, content }) => (
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
