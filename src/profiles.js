// ── Profile presets — seed realistic localStorage state ──────────────────
const TODAY   = new Date().toISOString().slice(0, 10)
const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10)

export const PROFILES = {
  new: {
    habits: [
      {
        id: 'walk_new',
        goalId: 'move',
        label: 'Walk for 5 minutes after dinner',
        icon: '🚶',
        bg: 'linear-gradient(155deg,#8a7565 0%,#4a3b32 72%)',
        anchor: 'After dinner',
        status: 'trial',
        tier: 1,
        addedAt: TODAY,
        source: 'EatingWell',
      },
    ],
    collection: [],
    goals: ['move'],
    sources: ['steps'], // steps connected → walk auto-tracks
    completions: [], // nothing done yet today
  },

  established: {
    habits: [
      {
        id: 'walk_kept',
        goalId: 'move',
        label: 'Walk for 10 minutes after dinner',
        icon: '🚶',
        bg: 'linear-gradient(155deg,#8a7565 0%,#4a3b32 72%)',
        anchor: 'After dinner',
        status: 'kept',
        tier: 2,
        addedAt: daysAgo(30),
        source: 'EatingWell',
      },
      {
        id: 'sleep_kept',
        goalId: 'sleep',
        label: 'Wake within the same 30-minute window',
        icon: '😴',
        bg: 'linear-gradient(155deg,#4a5a7a 0%,#2a3048 72%)',
        anchor: 'Morning alarm',
        status: 'kept',
        tier: 2,
        addedAt: daysAgo(14),
        source: 'Verywell Health',
      },
      {
        id: 'strength_trial',
        goalId: 'strong',
        label: '5 chair stands after breakfast',
        icon: '💪',
        bg: 'linear-gradient(155deg,#5a6a5a 0%,#3a4a3a 72%)',
        anchor: 'After clearing breakfast',
        status: 'trial',
        tier: 1,
        addedAt: TODAY,
        source: 'Verywell Health',
      },
    ],
    collection: [
      {
        id: 'water_grad',
        goalId: 'water',
        label: 'Glass of water before coffee',
        icon: '💧',
        bg: 'linear-gradient(155deg,#5a7a8a 0%,#2d4a5a 72%)',
        status: 'graduated',
        tier: 1,
        addedAt: daysAgo(60),
        graduatedAt: daysAgo(10),
        source: 'Healthline',
      },
    ],
    goals: ['move', 'sleep', 'strong', 'water'],
    sources: ['steps', 'sleep'], // steps+sleep connected; strength (workouts) still connectable
    completions: ['walk_kept'], // walk already done today
  },
}

export function seedProfile(name) {
  const p = PROFILES[name]
  if (!p) return
  try {
    // Clear all vitalist keys
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('vitalistExp_')) localStorage.removeItem(k)
    })
    localStorage.setItem('vitalistExp_habits',    JSON.stringify(p.habits))
    localStorage.setItem('vitalistExp_collection', JSON.stringify(p.collection))
    localStorage.setItem('vitalistExp_goals',      JSON.stringify(p.goals))
    localStorage.setItem('vitalistExp_sources',    JSON.stringify(p.sources || []))
    localStorage.setItem('vitalistExp_complete',   '1')
    // Seed today's completions
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem(`vitalistExp_completions_${today}`, JSON.stringify(p.completions))
  } catch (_) {}
}
