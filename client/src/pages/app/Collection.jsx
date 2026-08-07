import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { OWNERSHIP_STATE } from '../../domain/habit.js'
import { getPillarLabel } from '../../domain/pillars.js'
import { getAclmIcon } from '../../domain/aclmIcons.js'
import { PILLARS, NONE_OPTION } from '../onboarding/pillars.js'
import { getHabitVisual } from '../onboarding/recommendedHabits.js'
import Pill from '../../components/Pill.jsx'
import RoutineHabitCard from './RoutineHabitCard.jsx'
import AddHabitFlow from './AddHabitFlow.jsx'
import './page.css'

const OWNED_STATES = [OWNERSHIP_STATE.ADOPTED, OWNERSHIP_STATE.OWNED, OWNERSHIP_STATE.READOPTED]

// A "brought with you" onboarding option has no catalog habitId of its
// own (see foundationRows below) — but several of them describe the same
// real thing a catalog habit does, just in the visitor's own words from
// intake instead of the picker's phrasing. Where that overlap is clear
// (not just adjacent — the same activity), this borrows that catalog
// habit's own already-sourced photo rather than showing a flat gradient
// for something that really does have a real photo elsewhere in the app.
// Deliberately NOT exhaustive: several options (cooking-at-home,
// balanced-meals, mindful-eating, taking-stairs, recreational-sports,
// moving-at-work, consistent-bedtime, enough-hours, talking-it-out,
// clears-your-head, and everything under social — none of that pillar's
// 3 catalog habits has a photo of its own yet either) don't correspond
// to any one catalog habit closely enough to borrow from in good
// conscience, so those keep the gradient. Keyed by `${pillarId}:${optionId}`
// since option ids are only unique within a pillar.
const FOUNDATION_CATALOG_MATCH = {
  'eating:more-veggies': 'extra-veg-dinner',
  'eating:meal-prepping': 'prep-lunch-tonight',
  'eating:drinking-water': 'water-on-waking',
  'moving:daily-walks': 'walk-after-meal',
  'moving:strength-training': 'two-strength-sessions',
  'moving:stretching-yoga': 'morning-stretch',
  'sleep:wind-down-routine': 'no-screens-before-bed',
  'sleep:limiting-screens': 'no-screens-before-bed',
  'sleep:sleep-environment': 'cool-dark-room',
  'sleep:cool-dark-room': 'cool-dark-room',
  'stress:meditation-breathing': 'five-minute-breathing',
  'stress:journaling': 'evening-journal',
  'stress:time-in-nature': 'outdoor-break',
  'stress:taking-breaks': 'outdoor-break',
}

// A few foundation options don't correspond to any catalog habit at all
// (there's nothing to borrow via FOUNDATION_CATALOG_MATCH above), but
// still got a real photo picked out for them directly — same treatment,
// just a straight image instead of a borrowed catalog id. Keyed the same
// way as FOUNDATION_CATALOG_MATCH.
const FOUNDATION_IMAGE_OVERRIDES = {
  'eating:cooking-at-home':
    "url('/231644-Chicken-Souvlaki-with-Tzatziki-Sauce-3x4-0725-d6573d70f50d4e4aa2dd85c2c49ad731.webp')",
  'moving:taking-stairs':
    "url('/Stocksy_txpca07dfbdemz200_Medium_3690248-crop-95b70ea20d7d4249a434d08cdcd0ead4.webp')",
  // Cropped down from the original — that file is actually a "How to
  // Cast a Happiness Spell on Yourself" article banner with its own
  // headline text baked into the image, which would've shown through on
  // the card. This keeps just the photo itself.
  'stress:clears-your-head':
    "url('/Happiness-Spell-SF-bdc7515eab884208b677509e199ba6af-crop.webp')",
}

// The "brought with you" habits used to live on their own on the Me tab
// (just pillar -> option labels, straight from onboarding's answers) —
// moved here and reshaped into the same {title, subtitle, pillarId, key}
// shape as the graduated habits below, so both sources can render through
// one list (see AlreadyYoursCard). Most have no catalog habitId of their
// own (these were never actually "added" through the picker, just checked
// off at onboarding) — passing pillarId alone into getHabitVisual and
// letting the habitId argument miss falls back to the pillar's flat
// gradient exactly the way it already would for any catalog habit that
// hasn't got a real photo yet. The ones in FOUNDATION_CATALOG_MATCH above
// get that catalog habit's id instead, so the exact same getHabitVisual
// lookup AlreadyYoursCard already does for graduated habits picks up its
// real photo automatically.
function foundationRows(habitsWorking) {
  return PILLARS.flatMap((pillar) => {
    const ids = (habitsWorking[pillar.id] || []).filter((id) => id !== NONE_OPTION.id)
    return pillar.options
      .filter((option) => ids.includes(option.id))
      .map((option) => {
        const matchKey = `${pillar.id}:${option.id}`
        return {
          key: `foundation-${pillar.id}-${option.id}`,
          title: option.label,
          subtitle: pillar.label,
          pillarId: pillar.id,
          id: FOUNDATION_CATALOG_MATCH[matchKey],
          image: FOUNDATION_IMAGE_OVERRIDES[matchKey],
        }
      })
  })
}

function graduatedRows(habits) {
  return habits
    .filter((h) => OWNED_STATES.includes(h.ownershipState))
    .map((habit) => ({
      key: habit.id,
      id: habit.id,
      title: habit.title,
      subtitle: getPillarLabel(habit.pillarId),
      pillarId: habit.pillarId,
      to: `/habit/${habit.id}`,
    }))
}

// Same image-card visual language as RoutineHabitCard (the "working on
// it"/Routine cards just above) — a pillar Pill and the title over a photo
// or gradient — but without that card's day tracker or trial-prompt: this
// is a roster overview, not the day-to-day working view, and a foundation
// habit has neither a start date to anchor a tracker to nor a real detail
// page to link into. Graduated habits get a real catalog photo when one
// exists and link through to HabitDetail, same as they already do from
// Routine; foundation habits render the identical card shape statically,
// with a photo when there's one to show — borrowed from a matching catalog
// habit (FOUNDATION_CATALOG_MATCH) or set directly (FOUNDATION_IMAGE_OVERRIDES)
// above — and the pillar's flat gradient otherwise.
function AlreadyYoursCard({ title, subtitle, pillarId, id, image, to }) {
  const background = image || getHabitVisual(pillarId, id)
  const Wrapper = to ? Link : 'div'

  return (
    <Wrapper to={to} className="already-yours-card" style={{ backgroundImage: background }}>
      <div className="already-yours-card__scrim" />
      <div className="already-yours-card__content">
        <Pill
          icon={pillarId ? <img src={getAclmIcon(pillarId)} alt="" /> : undefined}
          label={subtitle}
        />
        <h3 className="already-yours-card__title">{title}</h3>
      </div>
    </Wrapper>
  )
}

// The full roster, one level up from Routine's day-to-day view: what's
// still on trial, and everything that's already yours — habits you
// brought with you at onboarding plus ones you've graduated out of a
// trial — with a locked placeholder for whichever habit comes next when
// every slot is spoken for. A slot frees up the moment a trial resolves to
// "Keep it" or "Make it smaller" (see HabitDetail + HabitsContext's
// unlockSlot).
function Collection() {
  const { habits, slotCount } = useHabits()
  const { answers } = useOnboarding()
  const [addingHabit, setAddingHabit] = useState(false)

  const workingOnIt = habits.filter((h) => h.ownershipState === OWNERSHIP_STATE.TRIALED)
  const graduated = graduatedRows(habits)
  const alreadyYours = [...foundationRows(answers.habitsWorking || {}), ...graduated]
  const activeCount = workingOnIt.length + graduated.length
  const nextSlotLocked = activeCount >= slotCount

  // Foundation habits ("brought with you") can populate this page even
  // before any real habit has been started through Routine/Add a habit —
  // only bail out to the empty state when there's truly nothing at all.
  if (habits.length === 0 && alreadyYours.length === 0) {
    return (
      <div className="page">
        <p className="page__lead">Nothing here yet.</p>
        <p>Pick your first habit from Routine to start your collection.</p>
      </div>
    )
  }

  // Adding a habit later happens right here in the page body — AppLayout's
  // Header/Footer stay mounted throughout, same as on Routine.
  if (addingHabit) {
    return (
      <div className="page">
        <AddHabitFlow onClose={() => setAddingHabit(false)} />
      </div>
    )
  }

  return (
    <div className="page">
      {workingOnIt.length > 0 && (
        <section>
          <h2>Working on it</h2>
          <div className="routine-habit-list">
            {workingOnIt.map((habit) => (
              <RoutineHabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        </section>
      )}

      {nextSlotLocked ? (
        <section>
          <h2>Next slot</h2>
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
        </section>
      ) : (
        <section>
          <h2>Next slot</h2>
          <button type="button" className="open-slot" onClick={() => setAddingHabit(true)}>
            <span className="open-slot__icon" aria-hidden="true">
              +
            </span>
            <div>
              <p className="open-slot__title">Add a habit</p>
              <p className="open-slot__desc">You've got room for one more.</p>
            </div>
          </button>
        </section>
      )}

      {alreadyYours.length > 0 && (
        <section>
          <h2>
            Already yours <span className="page__count">{alreadyYours.length}</span>
          </h2>
          <div className="already-yours-list">
            {alreadyYours.map(({ key, ...row }) => <AlreadyYoursCard key={key} {...row} />)}
          </div>
        </section>
      )}
    </div>
  )
}

export default Collection
