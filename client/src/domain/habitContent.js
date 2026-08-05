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
    {
      id: 'wa-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'EatingWell',
      title: 'The Simple Nighttime Habit That May Balance Blood Sugar',
      // Condensed from EatingWell's full piece (same title) in Vitalist's
      // own words — not a verbatim excerpt.
      body: 'Blood sugar tends to climb after a meal, and a short walk gets your muscles pulling that glucose out of your bloodstream for fuel — which also improves how sensitive your cells are to insulin over time. That combination tends to mean steadier numbers overnight and fewer sleep disruptions from a spike before bed. Pairing the walk with an earlier, higher-fiber dinner tends to amplify the effect; if mornings stay high despite it, that\'s worth flagging to your doctor.',
    },
    { id: 'wa-2', type: CONTENT_TYPE.ENABLING, brand: 'EatingWell', title: '6 Benefits of Walking After Meals' },
  ],
  'two-strength-sessions': [
    {
      id: 'ts-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Verywell Health',
      title: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer',
      body: 'A large, decades-long study found that 90 to 120 minutes of strength training a week — about one to three short sessions — was linked to meaningfully lower risk of dying from any cause, and specifically from cardiovascular and neurological disease, with benefits leveling off past that point. Pairing it with regular aerobic activity, like a walk, compounds the benefit further.',
    },
  ],
  'chair-stands-after-breakfast': [
    {
      id: 'cs-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Verywell Health',
      title: 'Research Shows a Certain Amount of Strength Training Every Week Can Help You Live Longer',
      // Same underlying research as ts-1, told through what it means for a
      // move this small: chair stands are an easy way to bank some of that
      // weekly strength-training time without a gym or equipment.
      body: 'A large, decades-long study found that 90 to 120 minutes of strength training a week — about one to three short sessions — was linked to meaningfully lower risk of dying from any cause, and specifically from cardiovascular and neurological disease. Chair stands are a simple, equipment-free way to bank some of those minutes: they build the same lower-body strength that keeps you steady on stairs and getting up off the floor. Pairing it with regular aerobic activity, like a walk, compounds the benefit further.',
    },
  ],
  'morning-stretch': [
    {
      id: 'ms-1',
      type: CONTENT_TYPE.JUSTIFICATION,
      brand: 'Health',
      title: 'I Went to My First Stretch Session, and It Changed How I Think About Healthy Aging',
      // Condensed from Health's full piece (same title) in Vitalist's own
      // words — not a verbatim excerpt.
      body: 'Stretching the hips, glutes, and spine is what keeps everyday moves like tying a shoe, getting out of the car, or getting up from a chair easy as you age — mobility tends to go unnoticed until it starts slipping. Beyond flexibility, regular stretching has some evidence behind it for lower blood pressure, better blood sugar, eased tension and anxiety, and improved sleep. A few minutes a day focused on those areas does more for long-term independence than most people expect from something this low-effort.',
    },
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
      // Job: reduce self-judgment when the habit still feels effortful.
      reinforcement: 'The hardest part may be starting. After a meal, staying where you are often feels easier — you don’t need to feel motivated before you begin. Starting slowly is enough.',
      supportive: {
        id: 'wa-day1',
        brand: 'Verywell Health',
        title: '8 Benefits of Walking Every Day',
        url: 'https://www.verywellhealth.com/benefits-of-walking-every-day-11719538',
        body: 'Walking daily benefits your body, mind, and emotions — and may even help extend your life.',
      },
    },
    {
      // Job: keep the small habit from turning into another demanding fitness task.
      reinforcement: 'This doesn’t need to feel like exercise. No pace target, no step goal, no need to work up a sweat — the habit is simply adding a little movement after a meal.',
      supportive: {
        id: 'wa-day2',
        brand: 'Real Simple',
        title: 'Too Cold Outside? Here Are 6 Easy Ways to Stay Active Without Leaving Home',
        url: 'https://www.realsimple.com/ways-to-stay-active-at-home-11897354',
        body: 'Stay in today: walk from room to room for ten minutes. Have stairs? Add one easy trip up and down every few minutes.',
      },
      // Second pairing for the day — pickDailyContent only surfaces
      // `supportive`, but this is here for whenever the UI can show more
      // than one piece per day.
      enjoyment: {
        id: 'wa-day2-b',
        brand: 'Verywell Mind',
        title: '7-Minute Video Meditation for Mindful Walking',
        url: 'https://www.verywellmind.com/7-minute-video-meditation-for-mindful-walking-8598399',
        body: 'A short guided meditation for turning today’s walk into a mindful one.',
      },
    },
    {
      reinforcement: 'You’re still finding your easiest version of this — the next few walks can help you discover the one you’ll actually return to.',
      supportive: { id: 'wa-day3', brand: 'Verywell Mind', title: 'Take a Guided Walk' },
    },
    {
      // Job: help the user develop a personally meaningful reason to
      // continue without promising an outcome.
      // NOTE: left this day's supportive link as-is — the replacement
      // pasted in for day 4 pointed to the same walking-shoes article
      // that's linked for day 7 below, alongside an "EatingWell" sleep/
      // blood-sugar description that doesn't match it. Flagged for Esther
      // to confirm the intended link before swapping this one out.
      reinforcement: 'Notice what the walk changes for you today. You may feel more awake, less full, mentally clearer — or no obvious difference at all. Pay attention without grading the experience.',
      supportive: { id: 'wa-day4', brand: 'EatingWell', title: 'Walking After Dinner Improves Sleep, Too' },
    },
    {
      // Job: make the habit itself feel more rewarding.
      reinforcement: 'Your route may be familiar — the day isn’t. The light, weather, sounds, people, plants, and animals around you keep changing. A short walk can reveal something you didn’t notice yesterday.',
      supportive: {
        id: 'wa-day5',
        brand: 'Parents',
        title: 'How To Have a Conversation With Your Kids About School',
        url: 'https://www.parents.com/questions-to-ask-kids-about-school-8657109',
        body: 'Try “High, Low, Buffalo” — take turns sharing one high point, one low point, and one strange or funny moment from today.',
      },
    },
    {
      // Job: help the user recognize and preserve conditions that support
      // the habit. No linked piece this round — the walking-shoe
      // recommendation that used to fill this slot (as an Enjoyment
      // fallback) moved to day 7, where it was paired more clearly.
      reinforcement: 'Keep the part that made today easier — a familiar route, shoes already by the door, someone to walk with, a meal that leaves you enough time. When something lowers the effort, it’s worth repeating.',
      supportive: null,
    },
    {
      // Job: connect repeated action to self-concept without assigning
      // the user an identity they haven't earned.
      reinforcement: 'You’re making movement part of an ordinary day. This is not a major fitness program or a test of discipline — it’s a small way of caring for yourself after a meal, and each time you return to it, it becomes more recognizably yours.',
      supportive: {
        id: 'wa-day7',
        brand: 'Real Simple',
        title: 'The Science-Backed Benefits of Passeggiata, Italy’s Beloved Evening Tradition That’s Good for Your Brain and Body',
        url: 'https://www.realsimple.com/what-is-passeggiata-11911501',
        body: 'No pace goal — walk slowly, look around, invite someone along. The point is to enjoy the transition out of your day.',
        image: "url('/GettyImages-2177586029-520077efb4034740baa49a79d378e4d0.webp')",
      },
      enjoyment: {
        id: 'wa-day7-b',
        brand: 'Health',
        title: 'The 10 Best Walking Shoes of 2026, According to Podiatrists and Testing',
        url: 'https://www.health.com/style/comfortable-walking-shoes',
        body: 'A comfortable walking shoe can make a huge difference in how your body feels at the end of the day.',
      },
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

// Picks a rotating piece for HabitDetail's "Did you know?" section —
// same random-from-pool idea as pickDailyContent's fallback, but scoped
// to just the habit's JUSTIFICATION-type pool (the "why this matters"
// press pieces) rather than any type, since ENABLING/how-to content
// doesn't belong under a "did you know" heading. Returns null when a
// habit's pool has no justification piece yet (e.g. it only has an
// ENABLING entry) — HabitDetail falls back to just the catalog's own
// static justification text in that case.
export function pickJustificationContent(habitId) {
  const pool = (CONTENT_POOL[habitId] || []).filter(
    (item) => item.type === CONTENT_TYPE.JUSTIFICATION,
  )
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// "Something to play/read during the habit itself" — distinct from the
// day-by-day CONTENT_POOL/DAY_SCRIPTS content above, which is about
// building the habit; this is a single evergreen companion piece for
// doing it (a video, a podcast, a playlist), so it doesn't rotate by day.
// `sectionLabel` is the actual heading HabitDetail renders ("While you
// walk") — kept here per habit rather than hardcoded in the component so
// each habit can phrase it for its own action ("While you stretch",
// "While you breathe", etc.).
//
// 'walk-after-meal' (wa-companion-goals-podcast, above) is the one real,
// sourced entry — pulled from the same behaviors sheet as the rest of this
// file. Its `url` is the Megaphone playlist embed
// (playlist.megaphone.fm/?e=...), not the verywellmind.com article page —
// the article page itself would likely refuse to load in ContentModal's
// iframe (publisher X-Frame-Options/CSP, same issue called out in
// ContentModal's comment), but Megaphone's own playlist embed URL is
// purpose-built to be framed, so tapping the card actually plays the
// episode instead of bouncing to the fallback link. Its `image` is the
// real Verywell Mind Podcast cover art already sitting in client/public —
// same `url('/path.webp')`-wrapped format DAY_SCRIPTS' wa-day7.supportive
// uses above, so every consumer (HabitDetail, Routine, Read) can just do
// `thumbnail={item.image || gradient}` without caring which content
// source the item came from. The entries below it are placeholders:
// titles/brands invented in the same People Inc. house style (not sourced
// from a live fetch, since this content pass didn't have real URLs to
// pull from), with no `url` or `image` so ContentCard/ContentModal fall
// back to the habit's flat gradient + thumbnail/body view instead of
// trying to load a real page or photo. Swap each for the real sourced
// piece — and add a `url`/`image` — once one exists.
export const COMPANION_CONTENT = {
  'walk-after-meal': {
    sectionLabel: 'While you walk',
    content: {
      id: 'wa-companion-goals-podcast',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: '130 - Friday Fix: 3 Mistakes to Avoid When Creating Goals for Yourself',
      url: 'https://playlist.megaphone.fm/?e=MERE7757124575&artwork=false&light=true',
      body: 'Goals are a great way to stick to habits — listen for the 3 mistakes to avoid when creating them, right from your walk.',
      image: "url('/primary-643d863793a04e78bdb81c2aa012bc55.webp')",
    },
  },
  'two-strength-sessions': {
    sectionLabel: 'While you train',
    content: {
      id: 'ts-companion-playlist',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Health',
      title: 'The Best Workout Playlists for Strength Training, According to Trainers',
      body: 'A steady beat helps carry you through the last few reps of a set — worth having something queued up before you start.',
    },
  },
  'chair-stands-after-breakfast': {
    sectionLabel: 'While you stand',
    content: {
      id: 'cs-companion-form-check',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Health',
      title: 'How To Do a Perfect Sit-to-Stand, Step by Step',
      body: 'Good form matters more than reps here — a quick refresher on posture and pace before you get going.',
    },
  },
  'morning-stretch': {
    sectionLabel: 'While you stretch',
    content: {
      id: 'ms-companion-follow-along',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Real Simple',
      title: 'A 5-Minute Morning Stretch Routine You Can Follow Along To',
      body: 'Something to move through with, rather than count reps against — press play and follow the sequence.',
    },
  },
  'consistent-wake-time': {
    sectionLabel: 'While you wake up',
    content: {
      id: 'wt-companion-podcast',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Real Simple',
      title: 'The Best Podcasts To Start Your Morning With',
      body: 'Something calmer than the news feed for the first few minutes after the alarm goes off.',
    },
  },
  'high-fiber-breakfast': {
    sectionLabel: 'While you eat',
    content: {
      id: 'fb-companion-ideas',
      type: CONTENT_TYPE.COMPANION,
      brand: 'EatingWell',
      title: '5 High-Fiber Breakfast Ideas That Take Five Minutes',
      body: 'A few easy additions to rotate in, for mornings when the usual one is out of reach.',
    },
  },
  'water-on-waking': {
    sectionLabel: 'While it kicks in',
    content: {
      id: 'ww-companion-signs',
      type: CONTENT_TYPE.COMPANION,
      brand: 'EatingWell',
      title: '9 Silent Signs You’re Not Drinking Enough Water',
      body: 'Worth a skim if you’re ever tempted to skip this one — most of these show up before thirst does.',
    },
  },
  'five-minute-breathing': {
    sectionLabel: 'While you breathe',
    content: {
      id: 'fbr-companion-guided',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: 'A Guided Breathing Exercise You Can Follow Along To',
      body: 'Something to pace yourself against on days when counting your own breaths feels like one more task.',
    },
  },
  'evening-journal': {
    sectionLabel: 'While you write',
    content: {
      id: 'ej-companion-prompts',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: '50 Journaling Prompts for Self-Discovery and Reflection',
      body: 'For the nights a blank page feels harder than it should — a prompt to start from instead.',
    },
  },
  'text-a-friend': {
    sectionLabel: 'Need an opener?',
    content: {
      id: 'tf-companion-openers',
      type: CONTENT_TYPE.COMPANION,
      brand: 'Verywell Mind',
      title: '50 Texts To Send When You Don’t Know What to Say',
      body: 'Low-stakes lines for the days deciding what to say is the only thing slowing you down.',
    },
  },
}
