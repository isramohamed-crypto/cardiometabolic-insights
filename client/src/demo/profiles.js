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
  name: 'Jordan',
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
// Reuses the real "walk-after-meal" catalog entry (id kept as-is so it
// keeps its existing 7-day content script — see domain/habitContent.js —
// even though the on-screen copy has been generalized to a plain daily
// walk rather than meal-specific).
function walkingHabit({ startedAt, log }) {
  return {
    id: 'walk-after-meal',
    title: 'Daily walk',
    subtitle: 'A walk every day — timing and length are up to you.',
    pillarId: 'moving',
    tier: '10 minutes',
    moment: 'In the evening',
    remindersOn: false,
    ownershipState: OWNERSHIP_STATE.TRIALED,
    startedAt: startedAt.toISOString(),
    log,
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
}

export function getDemoProfile(id) {
  return Object.prototype.hasOwnProperty.call(DEMO_PROFILES, id) ? DEMO_PROFILES[id] : null
}

export function listDemoProfiles() {
  return Object.entries(DEMO_PROFILES).map(([id, profile]) => ({
    id,
    label: profile.label,
    description: profile.description,
  }))
}
