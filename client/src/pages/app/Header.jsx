import { useLocation } from 'react-router-dom'
import { useOnboarding } from '../../onboarding/OnboardingContext.jsx'
import { useHabits } from '../../habits/HabitsContext.jsx'
import { OWNERSHIP_STATE, LOG_STATUS } from '../../domain/habit.js'
import { daysSinceStart } from '../../domain/habitContent.js'
import { PILLARS, NONE_OPTION } from '../onboarding/pillars.js'
import DemoProfileMenu from '../../demo/DemoProfileMenu.jsx'
import './Header.css'

const OWNED_STATES = [OWNERSHIP_STATE.ADOPTED, OWNERSHIP_STATE.OWNED, OWNERSHIP_STATE.READOPTED]

// How many "brought with you" foundation habits are marked — same count
// Collection's merged "Already yours" list uses, so this header's subtitle
// and that list never disagree.
function countFoundationHabits(habitsWorking) {
  return PILLARS.reduce((total, pillar) => {
    const ids = (habitsWorking[pillar.id] || []).filter((id) => id !== NONE_OPTION.id)
    return total + ids.length
  }, 0)
}

// Per-tab H1 phrase. Today's is dynamic (see computeStreak below) once
// there's a streak to talk about; this is just the cold-start fallback.
// The others fall back to a plain section title until their copy is set.
const PHRASES = {
  '/today': 'Getting started is the hardest part.',
}

// Fallback H1 per tab, matching the labels in the footer nav — "Routine"
// and "Collection" were left over from before those tabs were renamed to
// Today and Habits, and nothing calls this app's home screen a routine
// anymore.
const TITLES = {
  '/today': 'Today',
  '/read': 'Read',
  '/collection': 'Habits',
  '/me': 'Progress',
}

function toKey(date) {
  return date.toISOString().slice(0, 10)
}

// Consecutive days, counting back from today, with at least one habit
// logged done. If today isn't logged yet, counting starts from yesterday
// instead — so a streak in progress doesn't read as broken before the day
// is even over.
function computeStreak(habits) {
  const doneDates = new Set()
  habits.forEach((h) => {
    (h.log || []).forEach((entry) => {
      if (entry.status === LOG_STATUS.DONE) doneDates.add(entry.date)
    })
  })
  if (doneDates.size === 0) return 0

  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  if (!doneDates.has(toKey(cursor))) cursor.setDate(cursor.getDate() - 1)

  let streak = 0
  while (doneDates.has(toKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// Collection gets its own eyebrow/title/subtitle instead of the usual
// greeting — see the reference mockup this was built from. Kept here
// rather than duplicated in Collection.jsx since Header already owns
// every other route's eyebrow+title, and the subtitle's counts need to
// match Collection's merged "Already yours" list exactly.
function CollectionHeaderCopy({ answers, habits }) {
  const foundationCount = countFoundationHabits(answers.habitsWorking || {})
  const builtCount = habits.filter((h) => OWNED_STATES.includes(h.ownershipState)).length

  const subtitle =
    builtCount > 0
      ? `${foundationCount} you brought with you, ${builtCount} you built this month.`
      : `${foundationCount} you brought with you.`

  return (
    <>
      <p className="app-header__eyebrow">Your Habits</p>
      <h1 className="app-header__title">
        Everything that's <span className="app-header__title-accent">already yours.</span>
      </h1>
      <p className="app-header__subtitle">{subtitle}</p>
    </>
  )
}

function Header() {
  const { pathname } = useLocation()
  const { answers } = useOnboarding()
  const { habits } = useHabits()

  if (pathname === '/collection') {
    return (
      <header className="app-header">
        <DemoProfileMenu />
        <CollectionHeaderCopy answers={answers} habits={habits} />
      </header>
    )
  }

  // Eyebrow no longer carries the name (that now lives in the headline).
  const greeting = answers.name ? 'Welcome back' : 'Welcome'

  // Today's headline reflects how far along they are — a new user gets an
  // encouraging kickoff, someone mid-build or weeks in gets a message that
  // acknowledges the momentum — and it's signed off with their name.
  let phrase = PHRASES[pathname] || TITLES[pathname] || 'Vitalist'
  if (pathname === '/today') {
    const active = habits.filter((h) =>
      [OWNERSHIP_STATE.TRIALED, ...OWNED_STATES].includes(h.ownershipState),
    )
    const established = active.some((h) => OWNED_STATES.includes(h.ownershipState))
    const oldestDays = active.reduce((m, h) => Math.max(m, daysSinceStart(h.startedAt)), 0)
    const base =
      established || oldestDays >= 14
        ? "Look how far you've come"
        : oldestDays >= 7
          ? "You're building real momentum"
          : 'Getting started is the hardest part'
    phrase = answers.name ? `${base}, ${answers.name}.` : `${base}.`
  }

  return (
    <header className="app-header">
        <DemoProfileMenu />
      <p className="app-header__eyebrow">{greeting}</p>
      <h1 className="app-header__title">{phrase}</h1>
    </header>
  )
}

export default Header
