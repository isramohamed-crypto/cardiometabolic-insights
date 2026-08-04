import { CONTENT_TYPE } from './habit.js'

// Real content pulled from the team's behaviors/content-mapping sheet (the
// "real behaviors sheet" referenced throughout this domain — see
// domain/habit.js). Two sources feed this file:
//
// 1. The Behaviors tab: one "primary" (justification) + one "associated"
//    (enabling/how-to) article per behavior. Stored per habit id below as
//    CONTENT_POOL — used for the general rotating teaser on a habit that
//    doesn't have a full 7-day script (see #2).
// 2. The Demo Content tab: full day-1-through-7 scripts for two habits
//    ("Walk for 10 minutes after a meal" / walk-after-meal, and "Wake
//    within the same 30-minute window" / consistent-wake-time), each with
//    a branded "Supportive"/"Enjoyment" content pairing per day. Stored as
//    DAY_SCRIPTS — used when a habit has one, indexed by days since the
//    habit was adopted (ties into HabitDayTracker's 7-day window).
//
// Entries where the sheet only had "NEEDS People Inc. match" (no article
// sourced yet) are simply omitted rather than filled with a placeholder.
//
// The Demo Content tab also has day-by-day "Reinforcement Content" — short
// unbranded first-person coaching copy in Vitalist's own voice (distinct
// from these branded press pieces). It's captured here too, but nothing in
// the UI surfaces it yet — flag to product/design before wiring it in.
export const CONTENT_POOL = {
  'walk-after-meal': [
    { id: 'wa-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'EatingWell', title: 'The Simple Nighttime Habit That May Balance Blood Sugar' },
    { id: 'wa-2', type: CONTENT_TYPE.ENABLING, brand: 'EatingWell', title: '6 Benefits of Walking After Meals' },
  ],
  'two-strength-sessions': [
    { id: 'ts-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Health', title: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer' },
  ],
  'chair-stands-after-breakfast': [
    { id: 'cs-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Health', title: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer' },
  ],
  'morning-stretch': [
    { id: 'ms-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Health', title: 'I Went to My First Stretch Session, and It Changed How I Think About Healthy Aging' },
  ],
  'consistent-wake-time': [
    { id: 'wt-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Health', title: 'First Step to Better Sleep: Wake Up at the Same Time Every Day' },
  ],
  'high-fiber-breakfast': [
    { id: 'fb-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Allrecipes', title: "You're Probably Not Getting Enough Fiber — Here's Why It Matters and How to Fix It" },
  ],
  'water-on-waking': [
    { id: 'ww-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'EatingWell', title: 'The Benefits of Front-Loading Your Water Intake, According to Dietitians' },
  ],
  'five-minute-breathing': [
    { id: 'fbr-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Mind', title: 'The Benefits of Deep Breathing' },
  ],
  'evening-journal': [
    { id: 'ej-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Mind', title: 'Want to Relieve Stress ASAP? Write in a Gratitude Journal' },
  ],
  'text-a-friend': [
    { id: 'tf-1', type: CONTENT_TYPE.JUSTIFICATION, brand: 'Verywell Mind', title: 'How Social Isolation Can Damage Your Mental Health' },
  ],
}

// Full day-by-day scripts from the Demo Content tab. `supportive` is the
// branded companion piece shown per day (falls back to that day's
// "Enjoyment" pairing when the sheet left the primary Supportive cell
// blank); `reinforcement` is Vitalist's own unbranded coaching line for
// that day, kept here for reference even though no UI shows it yet.
const DAY_SCRIPTS = {
  'walk-after-meal': [
    {
      reinforcement: 'The hardest part may be starting — you don’t need to feel motivated before you begin.',
      supportive: { id: 'wa-day1', brand: null, title: '8 Benefits of Walking Every Day' },
    },
    {
      reinforcement: 'This doesn’t need to feel like exercise. No pace target, no step goal — just a little movement after a meal.',
      supportive: { id: 'wa-day2', brand: 'RealSimple', title: 'Stay in Today' },
    },
    {
      reinforcement: 'You’re still finding your easiest version of this — the next few walks can help you discover the one you’ll actually return to.',
      supportive: { id: 'wa-day3', brand: 'Verywell Mind', title: 'Take a Guided Walk' },
    },
    {
      reinforcement: 'Notice what the walk changes for you today, without grading the experience.',
      supportive: { id: 'wa-day4', brand: 'EatingWell', title: 'Walking After Dinner Improves Sleep, Too' },
    },
    {
      reinforcement: 'Your route may be familiar — the day isn’t. A short walk can reveal something you didn’t notice yesterday.',
      supportive: { id: 'wa-day5', brand: 'Parents', title: 'Try High, Low, Buffalo' },
    },
    {
      reinforcement: 'Keep the part that made today easier — a familiar route, shoes by the door, someone to walk with.',
      supportive: { id: 'wa-day6', brand: 'Health', title: 'Wear a Comfortable Walking Shoe' }, // Enjoyment fallback — Supportive cell was blank for day 6
    },
    {
      reinforcement: 'You’re making movement part of an ordinary day. Each time you return to it, it becomes more recognizably yours.',
      supportive: { id: 'wa-day7', brand: 'RealSimple', title: 'No Pace Goal' },
    },
  ],
  'consistent-wake-time': [
    {
      reinforcement: 'You don’t have to become an early bird — the goal is a time that fits your real life, chosen consistently.',
      supportive: { id: 'wt-day1', brand: 'The Spruce', title: 'Choose a Wake-Up Sound You Can Live With' },
    },
    {
      reinforcement: 'A rough night doesn’t make this morning a failure. You’re keeping one part of the morning steady while you learn what helps.',
      supportive: { id: 'wt-day2', brand: 'Byrdie', title: 'Start With a Gentle Stretch' }, // Enjoyment fallback — Supportive cell was blank for day 2
    },
    {
      reinforcement: 'The window can flex. You’re aiming for the same 30-minute range, not the exact same minute.',
      supportive: { id: 'wt-day3', brand: 'Martha Stewart', title: 'See How Martha Starts the Day' },
    },
    {
      reinforcement: 'Notice the rest of the day, not only the alarm — when you feel alert, when energy dips.',
      supportive: { id: 'wt-day4', brand: 'Simply Recipes', title: 'Choose Tomorrow’s Breakfast' },
    },
    {
      reinforcement: 'Keep what made waking easier today — the light, the alarm sound, breakfast ready to go.',
      supportive: { id: 'wt-day5', brand: 'Food & Wine', title: 'Borrow a Morning Ritual From a Chef' },
    },
    {
      reinforcement: 'You’re building a morning your body can recognize — not a perfect schedule, not a streak.',
      supportive: null, // nothing sourced for day 6 yet
    },
    {
      reinforcement: 'A repeated signal that makes one part of the day more predictable — that’s the whole habit.',
      supportive: null, // nothing sourced for day 7 yet
    },
  ],
}

// Raw whole days elapsed since a habit was adopted (0 = the day it was
// picked). Exported so other screens — e.g. HabitDetail's "ready to
// integrate?" prompt after day 7 — can use the same clock as the tracker.
export function daysSinceStart(startedAt) {
  const start = new Date(startedAt)
  start.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((today - start) / (1000 * 60 * 60 * 24))
}

function dayIndexSince(startedAt) {
  return Math.min(Math.max(daysSinceStart(startedAt), 0), 6) // clamp to the 7-day script (0-indexed)
}

// Picks the content to surface for a habit on the Routine page. Prefers
// that day's scripted piece (by days since the habit was adopted) when one
// exists; otherwise falls back to a random pick from the habit's general
// content pool. Rotates every time this is called (i.e. every page visit —
// see Routine.jsx), since the script advances by day and the fallback pool
// is picked at random.
export function pickDailyContent(habitId, startedAt) {
  const script = DAY_SCRIPTS[habitId]
  if (script) {
    const entry = script[dayIndexSince(startedAt)]
    if (entry?.supportive) return entry.supportive
  }

  const pool = CONTENT_POOL[habitId]
  if (!pool || pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}
