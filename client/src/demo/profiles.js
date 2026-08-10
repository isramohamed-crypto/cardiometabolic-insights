// Demo-only fixture data — lets a live walkthrough (or a shareable link)
// drop straight into the app at a chosen "profile maturity" level instead
// of clicking through real onboarding every time. See DemoSeeder.jsx for
// how this gets loaded, and App.jsx for where it's wired in.
//
// Every profile shares the same "brought with them" foundation: 5 habits
// captured as onboarding's "what's already working" answers (rendered on
// Summary and Me — see FOUNDATION_ANSWERS below). What varies per profile
// is the state of the one habit actively being trialed/built, which lives
// in HabitsContext instead.
//
// To add a profile: add a new entry to DEMO_PROFILES with a unique key —
// that key is exactly what goes in the URL as ?profile=<key>.
import { OWNERSHIP_STATE, LOG_STATUS, LOG_METHOD } from '../domain/habit.js'

// --- Shared foundation --------------------------------------------------
// The 5 pre-existing habits every persona "brings with them" from
// onboarding: 2 from eating, 1 each from moving/sleep/stress, none from
// social. These render via Summary.jsx / Me.jsx, which read straight off
// these option ids (see pages/onboarding/pillars.js for the label text).
const FOUNDATION_ANSWERS = {
  habitsWorking: {
    eating: ['more-veggies', 'cooking-at-home'],
    moving: ['taking-stairs'],
    sleep: ['cool-dark-room'],
    stress: ['clears-your-head'],
    social: [],
  },
  healthConditions: [],
  // Movement is the pillar this persona is actively building on top of
  // their foundation — matches the walking habit every profile below
  // starts out trialing.
  focusPillars: ['moving'],
}

// --- Date helpers --------------------------------------------------------
// Everything below is computed relative to "now" at the moment a profile
// is loaded, not hardcoded — so the demo looks equally fresh whenever it's
// actually run.
function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

function daysAgo(n) {
  const d = startOfToday()
  d.setDate(d.getDate() - n)
  return d
}

function dateKey(date) {
  return date.toISOString().slice(0, 10)
}

// --- The habit every profile starts with --------------------------------
// Reuses the real "walk-after-meal" catalog entry — id, title, and
// subtitle all kept in sync with recommendedHabits.js's own copy for it,
// so a demo persona's card reads the same as one a real user just added
// through the picker. `tier`/`ownershipState` are overridable so later
// profiles (e.g. "3 weeks in") can start this habit further along —
// already adopted, escalated past its trial tier — without duplicating
// the rest of its shape.
// `tierHistory` defaults to a single entry at the habit's own start (no
// escalation yet) — pass one explicitly (see '3-weeks-in' below) for a
// persona whose tier actually changed partway through, so the Me tab's
// progress card has a real "before → after" to plot instead of a flat,
// single-point non-trend.
function walkingHabit({
  startedAt,
  log,
  tier = '10 minutes',
  ownershipState = OWNERSHIP_STATE.TRIALED,
  tierHistory,
}) {
  return {
    id: 'walk-after-meal',
    title: '10-minute walk after a meal',
    subtitle: 'A short walk right after eating — any meal works.',
    pillarId: 'moving',
    tier,
    moment: 'In the evening',
    remindersOn: false,
    ownershipState,
    startedAt: startedAt.toISOString(),
    log,
    tierHistory: tierHistory || [{ tier, at: startedAt.toISOString() }],
  }
}

// --- The second habit, once one's been adopted --------------------------
// Reuses the "consistent-wake-time" catalog entry — the other habit with a
// full 7-day content script (see domain/habitContent.js), so a persona
// this far along still has real day-by-day content behind it rather than
// falling back to the generic rotating pool.
function wakeTimeHabit({
  startedAt,
  log,
  tier = 'Within an hour, most days',
  ownershipState = OWNERSHIP_STATE.TRIALED,
  tierHistory,
}) {
  return {
    id: 'consistent-wake-time',
    title: 'Consistent wake-up time',
    subtitle: 'Even on weekends — it’s the anchor your sleep needs.',
    pillarId: 'sleep',
    tier,
    moment: '6:30 AM',
    remindersOn: false,
    ownershipState,
    startedAt: startedAt.toISOString(),
    log,
    tierHistory: tierHistory || [{ tier, at: startedAt.toISOString() }],
  }
}

// Builds a log with DONE entries for every day in [0, dayCount) except the
// ones listed in skipDays (0-indexed, relative to startedAt).
function buildLog(startedAt, dayCount, skipDays = []) {
  const skip = new Set(skipDays)
  const entries = []
  for (let i = 0; i < dayCount; i += 1) {
    if (skip.has(i)) continue
    const d = new Date(startedAt)
    d.setDate(startedAt.getDate() + i)
    entries.push({ date: dateKey(d), status: LOG_STATUS.DONE, method: LOG_METHOD.MANUAL })
  }
  return entries
}

export const DEMO_PROFILES = {
  'new-user': {
    label: 'New user',
    description:
      'Just finished onboarding. One habit — an evening walk — sitting at day 1 of its trial, nothing logged yet.',
    build() {
      const startedAt = startOfToday()
      return {
        answers: { ...FOUNDATION_ANSWERS },
        habits: [walkingHabit({ startedAt, log: [] })],
        slotCount: 1,
      }
    },
  },

  'after-7-days': {
    label: 'After 7 days',
    description:
      'The evening walk has finished its 7-day trial — 5 of the 7 past days logged done — and is sitting at the keep-it / make-it-smaller / let-it-go prompt, with an upsell to 20 minutes if kept.',
    build() {
      const startedAt = daysAgo(7)
      // Slow start, then 5 days in a row — missed the first 2 days of the
      // trial, done every day since (through yesterday).
      const log = buildLog(startedAt, 7, [0, 1])
      return {
        answers: { ...FOUNDATION_ANSWERS },
        habits: [walkingHabit({ startedAt, log })],
        slotCount: 1,
      }
    },
  },

  '3-weeks-in': {
    label: '3 weeks in',
    description:
      'The evening walk graduated its trial and escalated to 20 minutes; a second habit (consistent wake-up time) has been adopted too. Slot 3 is open — add another or stay at 2.',
    build() {
      // Walking started 3 weeks ago — logged done every day since except
      // one early slip (day 2), visible in its own first-week tracker.
      const walkStartedAt = daysAgo(21)
      const walkLog = buildLog(walkStartedAt, 21, [1])
      // Escalated 10 → 20 minutes right when the trial ended (day 7, i.e.
      // 14 days ago) — a real two-point tierHistory, so the Me tab's
      // progress card has an actual escalation to plot instead of a flat
      // single-tier line.
      const walkTierHistory = [
        { tier: '10 minutes', at: walkStartedAt.toISOString() },
        { tier: '20 minutes', at: daysAgo(14).toISOString() },
      ]

      // The wake-time habit came later — its own ~10-day trial, adopted
      // after one missed day, done every day since (through yesterday).
      const wakeStartedAt = daysAgo(10)
      const wakeLog = buildLog(wakeStartedAt, 10, [3])

      return {
        answers: { ...FOUNDATION_ANSWERS },
        habits: [
          walkingHabit({
            startedAt: walkStartedAt,
            log: walkLog,
            tier: '20 minutes',
            ownershipState: OWNERSHIP_STATE.ADOPTED,
            tierHistory: walkTierHistory,
          }),
          wakeTimeHabit({
            startedAt: wakeStartedAt,
            log: wakeLog,
            tier: 'Same time, most days',
            ownershipState: OWNERSHIP_STATE.ADOPTED,
          }),
        ],
        // 2 habits adopted, room for a 3rd — Routine/Collection's "Next
        // slot" renders as an open (not locked) "Add a habit" CTA whenever
        // active habits are fewer than slotCount, which is exactly the
        // "offered a 3rd, or stay at 2" choice this persona should see.
        slotCount: 3,
      }
    },
  },
}

// Shorter, hyphen-free aliases for the same profiles above — meant for a
// path segment rather than a query string (see DemoProfileRoute.jsx,
// wired up in App.jsx as /routine/:demoProfile), where a slug like
// "newuser" or "7days" reads more like a normal URL than the canonical,
// more-descriptive ids these map to. The canonical ids still work in both
// places too (getDemoProfile below checks this map only as a fallback).
export const PROFILE_URL_ALIASES = {
  newuser: 'new-user',
  '7days': 'after-7-days',
  '3weeks': '3-weeks-in',
}

export function getDemoProfile(id) {
  if (Object.prototype.hasOwnProperty.call(DEMO_PROFILES, id)) return DEMO_PROFILES[id]
  const aliased = PROFILE_URL_ALIASES[id]
  return aliased ? DEMO_PROFILES[aliased] : null
}

export function listDemoProfiles() {
  return Object.entries(DEMO_PROFILES).map(([id, profile]) => ({
    id,
    label: profile.label,
    description: profile.description,
  }))
}
