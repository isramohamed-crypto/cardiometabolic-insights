import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { getDemoProfile } from '../../demo/profiles.js'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { pickDailyContent } from '../../domain/habitContent.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import ContentCard from '../../components/ContentCard.jsx'
import RoutineHabitCard from './RoutineHabitCard.jsx'
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

  // Picked once per mount — i.e. once per visit to this page — so tonight's
  // pick rotates every time the user enters the Routine tab, rather than
  // staying fixed for the whole session.
  const [dailyContent] = useState(() => {
    const map = {}
    habits.forEach((h) => {
      map[h.id] = pickDailyContent(h.id, h.startedAt)
    })
    return map
  })

  // Every active habit lives under one "Habits I'm building" list — no
  // separate trial vs. building sections. Whether a habit is still in its
  // trial is surfaced inside the habit itself (its "trying it out" status),
  // not by splitting the feed. Trial state is untouched under the hood, so
  // the trial wrap-up + slot unlock (TrialPromptModal) still fire.
  const activeHabits = habits.filter((h) => ACTIVE_STATES.includes(h.ownershipState))
  const activeCount = activeHabits.length
  const nextSlotLocked = activeCount >= slotCount

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

  // One shared "tonight" pick per active habit, combined into a single
  // section above the habit cards — rather than repeating a content teaser
  // underneath each individual card. Sits first on the page so the fresh
  // content is what greets you, with the habit list below it.
  const tonightPicks = habits
    .filter((h) => ACTIVE_STATES.includes(h.ownershipState))
    .map((h) => ({ habit: h, content: dailyContent[h.id] }))
    .filter((entry) => entry.content)

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

      {tonightPicks.length > 0 && (
        <section>
          <h2>New for you tonight</h2>
          <div className="routine-habit-list">
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
