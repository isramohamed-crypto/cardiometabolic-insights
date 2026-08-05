// ---------------------------------------------------------------------------
// Me tab "how it's actually going" insights — pure helpers, no UI. Consumed
// by HabitProgressCard.jsx. Kept separate from that component (same split as
// habitContent.js / habit.js vs. the pages that render them) so the actual
// data logic — which habit to feature, how to chunk its log into weeks, how
// to read a real before/after out of tierHistory — can be reasoned about
// and reused without dragging JSX along.
// ---------------------------------------------------------------------------

import { ACTIVE_OWNERSHIP_STATES, LOG_STATUS } from './habit.js'

const MS_PER_DAY = 1000 * 60 * 60 * 24
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function startOfDay(value) {
  const d = new Date(value)
  d.setHours(0, 0, 0, 0)
  return d
}

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

// Every habit the Me tab's progress section is "about" — one card per
// habit (a one-habit profile just renders one card; a multi-habit profile,
// which only really happens once someone's a few weeks in and has
// graduated a second slot, renders one per habit). Oldest-started first,
// so the habit with the most real history — and the one a returning user
// most likely thinks of first when they think "how's it going" — leads.
// Pre-existing/unadopted/abandoned habits don't count — this is about
// something the person is actually mid-way through building, not their
// whole roster (that's Collection's job).
export function pickActiveHabits(habits) {
  return habits
    .filter((h) => ACTIVE_OWNERSHIP_STATES.includes(h.ownershipState))
    .slice()
    .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))
}

// Chunks a habit's life into 7-day weeks (anchored to startedAt, same "the
// day it was adopted is day 0" convention HabitDayTracker uses for its
// single-week version) and returns only the most recent `maxWeeks` of them.
// Capped rather than unbounded so a habit someone's owned for months still
// renders a short, scannable card instead of an ever-growing list — recent
// weeks are what "how's it going lately" actually means anyway. Absolute
// week numbers are kept (not renumbered to start at 1) so a mature habit's
// card still reads as "week 6," not confusingly resetting each time older
// weeks scroll out of the cap.
export function buildWeeks(startedAt, log = [], maxWeeks = 4) {
  const start = startOfDay(startedAt)
  const today = startOfDay(new Date())
  const totalDays = Math.round((today - start) / MS_PER_DAY) + 1
  const totalWeeks = Math.max(1, Math.ceil(totalDays / 7))
  const firstWeekIndex = Math.max(0, totalWeeks - maxWeeks)

  const weeks = []
  for (let w = firstWeekIndex; w < totalWeeks; w += 1) {
    const days = []
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(start)
      date.setDate(start.getDate() + w * 7 + d)
      const dateKey = toDateKey(date)
      const isFuture = date.getTime() > today.getTime()
      const isToday = date.getTime() === today.getTime()
      const done = log.some((entry) => entry.date === dateKey && entry.status === LOG_STATUS.DONE)
      days.push({ dateKey, isFuture, isToday, done, letter: DAY_LETTERS[date.getDay()] })
    }
    weeks.push({ weekNumber: w + 1, days })
  }
  return weeks
}

// Day-of-week header letters for whichever 7 columns the week grid uses —
// fixed per column regardless of which weeks are actually shown, since
// every week is a 7-day chunk offset from the same start date (column 0 is
// always the start date's weekday, column 1 always the next, etc).
export function weekdayLetters(startedAt) {
  const startDow = startOfDay(startedAt).getDay()
  return Array.from({ length: 7 }, (_, i) => DAY_LETTERS[(startDow + i) % 7])
}

// Splits a tier string like "10 minutes" into a plottable number and its
// unit ("minutes"). Deliberately returns null for tiers that don't lead
// with a number (sleep's "Within an hour, most days", wake-time's "Same
// time, most days") — those genuinely have nothing numeric to trend, and
// silently forcing a number would be exactly the kind of fabricated data
// this app avoids elsewhere (see habitContent.js's placeholder-image note).
export function parseTierNumber(tier) {
  if (!tier) return null
  const match = /^(\d+)\s*(.*)$/.exec(String(tier).trim())
  if (!match) return null
  return { value: Number(match[1]), unit: match[2].trim() }
}

// Turns a habit's tierHistory into a "first → last" trend, or null when
// there isn't a real one to show. Requires at least two *distinct* numeric
// values — a habit that's never been escalated (tierHistory has one entry,
// or several identical ones) has nothing to trend, so the progress card
// just skips this section rather than drawing a flat, meaningless line.
export function buildTierTrend(tierHistory = []) {
  const parsed = tierHistory
    .map((entry) => {
      const parsedTier = parseTierNumber(entry.tier)
      return parsedTier && { value: parsedTier.value, unit: parsedTier.unit, at: entry.at }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.at) - new Date(b.at))

  // Collapse consecutive duplicate values (re-saving the same tier
  // shouldn't count as a step in the trend) before checking whether an
  // actual change happened.
  const points = parsed.filter((p, i) => i === 0 || p.value !== parsed[i - 1].value)
  if (points.length < 2) return null

  return {
    unit: points[0].unit || 'Progress',
    first: points[0].value,
    last: points[points.length - 1].value,
    points,
  }
}
