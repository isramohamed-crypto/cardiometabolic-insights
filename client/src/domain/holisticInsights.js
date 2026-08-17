import { ACTIVE_OWNERSHIP_STATES, LOG_STATUS } from './habit.js'
import { daysSinceStart } from './habitContent.js'
import { listFoundationHabits } from './foundationHabits.js'

// Progress-tab insights: a read across everything at once, rather than the
// Today tab's per-habit nudges (see domain/ownedInsights.js for those).
//
// Everything here is derived from data the app actually holds — logs,
// start dates, today's marks, saved and tried content. Nothing is inferred
// about health outcomes, and nothing is invented: if there isn't enough
// history to say something true, that line is simply omitted rather than
// filled with a generic encouragement. An empty return is a valid result and
// the caller renders nothing.
const MS_PER_DAY = 1000 * 60 * 60 * 24

function toKey(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

// Share of the last `days` days on which a habit was logged done. Counts
// only days the habit has actually existed for, so a habit started
// yesterday isn't scored against a whole week it wasn't around for.
function recentCompletion(habit, days = 7) {
  const age = Math.min(days, daysSinceStart(habit.startedAt) + 1)
  if (age <= 0) return null

  const done = new Set(
    (habit.log || [])
      .filter((entry) => entry.status === LOG_STATUS.DONE)
      .map((entry) => entry.date),
  )

  let hits = 0
  for (let i = 0; i < age; i += 1) {
    const day = new Date(Date.now() - i * MS_PER_DAY)
    if (done.has(toKey(day))) hits += 1
  }
  return { hits, of: age }
}

export function getHolisticInsights({
  habits = [],
  answers = {},
  marks = [],
  savedCount = 0,
} = {}) {
  const insights = []
  const active = habits.filter((h) => ACTIVE_OWNERSHIP_STATES.includes(h.ownershipState))
  const owned = listFoundationHabits(answers.habitsWorking || {})

  // 1. The shape of the whole picture: what they brought vs. what they're building.
  if (owned.length > 0 && active.length > 0) {
    insights.push({
      id: 'shape',
      lead: `${owned.length} habits you already had, ${active.length} you're building.`,
      body: 'Most of your routine was already in place before you started. The new ones are additions, not a rebuild.',
    })
  }

  // 2. Consistency across the last week — only once there's a week to read.
  const rates = active
    .map((habit) => ({ habit, rate: recentCompletion(habit, 7) }))
    .filter((entry) => entry.rate && entry.rate.of >= 4)
  if (rates.length > 0) {
    const hits = rates.reduce((sum, entry) => sum + entry.rate.hits, 0)
    const of = rates.reduce((sum, entry) => sum + entry.rate.of, 0)
    const best = rates.slice().sort((a, b) => b.rate.hits / b.rate.of - a.rate.hits / a.rate.of)[0]
    insights.push({
      id: 'consistency',
      lead: `${hits} of the last ${of} chances, taken.`,
      body:
        rates.length > 1
          ? `"${best.habit.title}" is the one holding steadiest — worth protecting first on a busy day.`
          : 'That is the number that compounds. Nothing else here matters as much.',
    })
  }

  // 3. Longevity of the oldest habit — the strongest evidence something stuck.
  const oldest = active
    .slice()
    .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))[0]
  if (oldest) {
    const days = daysSinceStart(oldest.startedAt)
    if (days >= 7) {
      insights.push({
        id: 'tenure',
        lead: `"${oldest.title}" is ${days} days old.`,
        body: 'Past a couple of weeks a habit stops needing a decision each time. This one is on that side of the line.',
      })
    }
  }

  // 4. Today's marks — only when they've actually marked something.
  const doneToday = marks.filter((mark) => mark.state === 'done').length
  if (doneToday > 0) {
    insights.push({
      id: 'today',
      lead: `${doneToday} of your own habits, done today.`,
      body: 'Marked by you, not tracked by a device. That is the part worth reading twice.',
    })
  }

  // 5. Engagement with the reading, when there is any.
  if (savedCount > 0) {
    insights.push({
      id: 'reading',
      lead: `${savedCount} ${savedCount === 1 ? 'article' : 'articles'} saved for later.`,
      body: 'They are waiting in Read whenever you want them.',
    })
  }

  return insights
}
