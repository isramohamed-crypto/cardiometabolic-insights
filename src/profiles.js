// ── Profile presets — seed realistic localStorage state ──────────────────
const TODAY   = new Date().toISOString().slice(0, 10)
const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

// The one habit Beth accepted in onboarding (Walk 10 min after a meal)
const walk = (addedAt, status, tier) => ({
  id: 'walk_habit', goalId: 'move', label: 'Walk for 10 minutes after a meal',
  bg: 'linear-gradient(155deg,#8a7565 0%,#4a3b32 72%)', source: 'EatingWell',
  anchor: 'After a meal', status, tier, addedAt,
})

// The "already doing" foundation she claimed in onboarding (established)
const CLAIMS = [
  { id: 'claim_eat_1',     goalId: 'eat',     label: 'Cook at home most nights',           bg: 'linear-gradient(155deg,#8a6a5a,#5a3a2a)', status: 'established', addedAt: daysAgo(0) },
  { id: 'claim_eat_2',     goalId: 'eat',     label: 'Olive oil or nuts as your go-to fat', bg: 'linear-gradient(155deg,#8a6a5a,#5a3a2a)', status: 'established', addedAt: daysAgo(0) },
  { id: 'claim_move_1',    goalId: 'move',    label: 'Get up and move during long sitting', bg: 'linear-gradient(155deg,#8a7565,#4a3b32)', status: 'established', addedAt: daysAgo(0) },
  { id: 'claim_sleep_1',   goalId: 'sleep',   label: 'Screens off before bed',             bg: 'linear-gradient(155deg,#6d7b6a,#3a4436)', status: 'established', addedAt: daysAgo(0) },
  { id: 'claim_stress_1',  goalId: 'stress',  label: 'Time outdoors most days',            bg: 'linear-gradient(155deg,#7a6a8a,#4a3a5a)', status: 'established', addedAt: daysAgo(0) },
  { id: 'claim_connect_1', goalId: 'connect', label: 'Part of a group, class, or community', bg: 'linear-gradient(155deg,#5a7a8a,#2d4a5a)', status: 'established', addedAt: daysAgo(0) },
]

export const PROFILES = {
  // Day 1 — first session, just accepted her habit tonight
  day1: {
    habits: [walk(TODAY, 'trial', 1)],
    collection: CLAIMS,
    goals: ['move'],
    sources: ['steps'],
    name: 'Beth',
    completions: [],
  },

  // Day 2 — returning the next day; trial continues
  day2: {
    habits: [walk(daysAgo(1), 'trial', 1)],
    collection: CLAIMS,
    goals: ['move'],
    sources: ['steps'],
    name: 'Beth',
    completions: [],
  },

  // Day 7 — habit is sticking; the keep + next-slot-unlock moment
  day7: {
    habits: [walk(daysAgo(6), 'kept', 1)],
    collection: CLAIMS,
    goals: ['move'],
    sources: ['steps', 'sleep'],
    name: 'Beth',
    completions: ['walk_habit'],
  },
}

export function seedProfile(name) {
  const p = PROFILES[name]
  if (!p) return
  try {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('vitalistExp_')) localStorage.removeItem(k)
    })
    localStorage.setItem('vitalistExp_habits',     JSON.stringify(p.habits))
    localStorage.setItem('vitalistExp_collection', JSON.stringify(p.collection))
    localStorage.setItem('vitalistExp_goals',      JSON.stringify(p.goals))
    localStorage.setItem('vitalistExp_sources',    JSON.stringify(p.sources || []))
    localStorage.setItem('vitalistExp_name',       p.name || '')
    localStorage.setItem('vitalistExp_profile',    name)
    localStorage.setItem('vitalistExp_complete',   '1')
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem(`vitalistExp_completions_${today}`, JSON.stringify(p.completions || []))
  } catch (_) {}
}
