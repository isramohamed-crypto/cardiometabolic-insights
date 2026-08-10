import { NONE_OPTION } from './pillars.js'

// Fine-grain, specific starter habits per pillar — distinct from the coarse
// options offered during onboarding intake (see pillars.js). Placeholder
// catalog; swap in the real recommender/behaviors sheet once it exists.
//
// Habit titles/subtitles are intentionally generic — no baked-in duration
// or timing (e.g. "Short walk after meals," not "10-minute walk after
// dinner"). Those specifics are the user's call, gathered on the
// customize step after they pick a habit: how much (tier) and when
// (a stacked moment or an exact time).
//
// Each habit falls back to its pillar's `gradient` for a card background —
// a stand-in for a real photo, since no photography asset pipeline exists
// yet. Most habits now have a real `image` instead, reusing the same
// People Inc. article photo their own domain/habitContent.js CONTENT_POOL
// entry already sources (copied into client/public/) — one real photo per
// habit rather than a separate photography pipeline. Only habits with
// nothing sourced yet at all (text-a-friend, plan-a-call,
// join-group-activity) still fall back to the plain gradient. Use
// getHabitVisual below rather than reading `.gradient` directly, so every
// card/thumbnail picks up a habit's own image automatically once one
// exists.
//
// `justification` / `evidence` / `expectation` back the three pages of
// WhyThisMattersTray's mini-carousel (why this one / the evidence / what to
// expect) — original copy in Vitalist's voice, not sourced from a
// particular study or study database; swap for cited research once that
// pipeline exists.
export const RECOMMENDATIONS_BY_PILLAR = {
  eating: {
    categoryLabel: 'Optimal Nutrition',
    gradient: 'linear-gradient(160deg, #FF8C2F 0%, #7a4a10 100%)',
    habits: [
      {
        id: 'extra-veg-dinner',
        title: 'Add a serving of vegetables',
        subtitle: 'Bulk up a meal a day with extra veggies — how often is up to you.',
        image: "url('/myrecipes-hero.webp')",
        justification:
          'Most of us fall short on vegetables at meals we already sit down for. Adding more crowds out less balanced choices without it feeling like a diet.',
        evidence:
          'Most adults eat less than half the recommended amount of vegetables in a day — the gap usually isn’t a missing meal, it’s a missing serving.',
        expectation:
          'The first few times, it’ll feel like a deliberate add-on. By week two it’s usually just what’s on the plate.',
        tiers: [
          { label: 'Add it to 1 meal a day' },
          { label: 'Add it to 2 meals a day' },
          { label: 'Add it to every meal' },
        ],
      },
      {
        id: 'prep-lunch-tonight',
        title: 'Prep tomorrow’s lunch ahead',
        subtitle: 'Pack it before you’re hungry and rushed.',
        justification:
          'Decisions made in advance, when you’re not hungry, tend to be better ones. Packing lunch ahead removes the moment most plans fall apart.',
        evidence:
          'Meals decided in the moment, especially a hungry one, lean toward whatever’s fastest — planning ahead removes that pressure entirely.',
        expectation:
          'Expect the first attempt to feel like one more chore at the end of the day. Once it’s routine, it saves you the scramble every morning.',
        // From the content inventory sheet's "New image" cell for this
        // habit — same asset extra-veg-dinner's content piece already uses.
        image: "url('/eatmoreveg.webp')",
        tiers: [
          { label: 'A couple nights a week' },
          { label: 'Most weeknights' },
          { label: 'Every night' },
        ],
      },
      {
        id: 'swap-snack-fruit',
        title: 'Swap a snack for fruit',
        subtitle: 'Not all of them — just a few, at whatever pace feels doable.',
        // Reuses this habit's own sourced content photo (see ss-1 in
        // domain/habitContent.js) as its catalog hero, same as
        // extra-veg-dinner/prep-lunch-tonight above.
        image: "url('/Simply-Recipes-Zucchini-Fritters-LEAD-2-59a39677d51a475c90ee6a881f73af45.webp')",
        justification:
          'Small, sustainable swaps beat strict rules. Trading a snack keeps the change realistic enough to actually stick.',
        evidence:
          'Swaps outlast bans. A one-for-one trade doesn’t leave a gap to fill, which is usually where stricter rules break down.',
        expectation:
          'Some days you’ll reach for the old snack anyway — that’s fine, the swap just needs to be your default, not your only option.',
        tiers: [
          { label: 'A few times a week' },
          { label: 'Most days' },
          { label: 'Every day' },
        ],
      },
      {
        id: 'high-fiber-breakfast',
        title: 'Add a high-fiber food to breakfast',
        subtitle: 'One swap or addition — whatever fits what you already eat.',
        // Reuses this habit's own sourced content photo (see hf-1 in
        // domain/habitContent.js) as its catalog hero.
        image: "url('/GettyImages-98896874-2000-b66cfc74cb034f0c9c7e47c93f39a89f.webp')",
        justification:
          'Most people fall well short on fiber, and breakfast is an easy place to close the gap without overhauling the rest of your day.',
        evidence:
          'Fiber intake tends to lag most at breakfast specifically — a single addition there closes more of the daily gap than a similar change later in the day.',
        expectation:
          'One addition, most mornings — not a whole new breakfast. Give it a week before judging whether it’s sticking.',
        tiers: [
          { label: 'A few mornings a week' },
          { label: 'Most mornings' },
          { label: 'Every morning' },
        ],
      },
      {
        id: 'water-on-waking',
        title: 'Drink a glass of water on waking',
        subtitle: 'Before coffee, before your phone — first thing.',
        // Reuses this habit's own sourced content photo (see wow-1 in
        // domain/habitContent.js) as its catalog hero.
        image: "url('/RDs-Reveal-Whether-Drinking-Water-Earlier-in-the-Day-Matters--b91c3b8a51594e8facdde85360cae4ca.webp')",
        justification:
          'Front-loading water first thing helps with energy and alertness, and it is one of the lowest-effort habits there is to start.',
        evidence:
          'Hours without water overnight leave most people mildly under-hydrated by morning — a glass first thing is a quick, low-effort correction.',
        expectation:
          'This one tends to stick fast — it takes ten seconds and doesn’t compete with anything else in your morning.',
        tiers: [{ label: 'Most mornings' }, { label: 'Every morning' }],
      },
    ],
  },
  moving: {
    categoryLabel: 'Physical Activity',
    gradient: 'linear-gradient(160deg, #00B9E2 0%, #063a52 100%)',
    // The after-meal walk (walk-after-meal) is deliberately 3rd here, not
    // 1st — everything else about it (its own real photo/carousel/day-
    // scripts) is unchanged, this is purely display order within the
    // pillar's pick carousel.
    habits: [
      {
        id: 'morning-stretch',
        title: 'Morning stretch',
        subtitle: 'Right when you wake up, before anything else.',
        image: "url('/Health-GettyImages-1419987706-99ff80a2f9554d898eb74ee0d5f46963.webp')",
        justification:
          'Stacking it onto waking up — before coffee, before your phone — is what makes a stretch routine actually survive past week one.',
        evidence:
          'Habits anchored to a fixed, unavoidable moment in the day (like waking up) get skipped far less often than ones that depend on finding free time.',
        expectation:
          'A couple minutes, first thing, before anything else grabs your attention. It should feel more like a reflex than a workout.',
        tiers: [{ label: '2 minutes' }, { label: '5 minutes' }, { label: '10 minutes' }],
      },
      {
        id: 'walk-after-meal',
        title: '10-minute walk after a meal',
        subtitle: 'A short walk right after eating — any meal works.',
        image: "url('/The-Simple-After-Dinner-Habit-That-May-Balance-Blood-Sugars-b47f5d48f0564c9087d3af290b752726.webp')",
        justification:
          'A short walk — especially after eating — helps steady your blood sugar right when it tends to climb. It’s a small change that stacks onto something you’re already doing.',
        evidence:
          'Blood sugar tends to spike in the hour or so after eating — light movement in that window is one of the simplest ways to blunt that rise.',
        expectation:
          'No pace goal, no step count — just a few minutes of moving. It should feel closer to a stroll than exercise.',
        tiers: [{ label: '10 minutes' }, { label: '20 minutes' }, { label: '30 minutes' }],
      },
      {
        id: 'chair-stands-after-breakfast',
        title: 'Do a few chair stands',
        subtitle: 'A quick set of sit-to-stands, whenever you tie it to your morning.',
        image: "url('/house-interior.jpg')",
        justification:
          'A little resistance work goes a long way for strength and fall prevention — chair stands are an easy, equipment-free way to start.',
        evidence:
          'Lower-body strength is one of the strongest predictors of staying independent later in life — sit-to-stands train exactly that movement.',
        expectation:
          'A quick set, no equipment. You’ll likely feel it in your legs the next day at first — that fades within a week or two.',
        tiers: [{ label: '5 stands' }, { label: '10 stands' }, { label: '2 sets of 10' }],
      },
    ],
  },
  sleep: {
    categoryLabel: 'Restorative Sleep',
    gradient: 'linear-gradient(160deg, #B676E7 0%, #2e1a42 100%)',
    habits: [
      {
        id: 'consistent-wake-time',
        title: 'Consistent wake-up time',
        subtitle: 'Even on weekends — it’s the anchor your sleep needs.',
        // Reuses this habit's own sourced content photo (see the day-1
        // script asset in domain/habitContent.js) as its catalog hero.
        image: "url('/30-days-to-better-sleep-3973920_v21-3c0ce2cc1f8149c58242946ac704fa8d.webp')",
        justification:
          'Your body clock responds far more to a consistent wake time than a consistent bedtime. Anchoring one end of the night makes the rest fall into place.',
        evidence:
          'Sleep researchers generally point to wake time, not bedtime, as the stronger anchor for your body clock — it’s the signal your body uses to set everything else.',
        expectation:
          'The first few mornings may feel like fighting your alarm. Give it a week or two — bedtime tends to fall into line on its own.',
        tiers: [
          { label: 'Within an hour, most days' },
          { label: 'Same time, most days' },
          { label: 'Same time, every day' },
        ],
      },
      {
        id: 'no-screens-before-bed',
        title: 'Screen-free wind-down',
        subtitle: 'Swap screens for something calmer before bed.',
        // Reuses this habit's own sourced content photo (see ns-1 in
        // domain/habitContent.js) as its catalog hero.
        image: "url('/Parents-Sleep-Package-1-182005bddc24436db64bd202615637d0.webp')",
        justification:
          'It’s less about blue light and more about what scrolling does to a winding-down mind. Any other low-stimulation activity works just as well.',
        evidence:
          'The bigger issue is usually mental — an engaging feed keeps your mind alert right when it needs to start slowing down.',
        expectation:
          'The urge to check your phone will still show up for a while. Having something else ready — a book, low music — makes it easier to skip.',
        tiers: [{ label: '15 minutes' }, { label: '30 minutes' }, { label: '60 minutes' }],
      },
      {
        id: 'cool-dark-room',
        title: 'A cooler, darker room',
        subtitle: 'Small environment changes, big effect on sleep quality.',
        // Reuses this habit's own sourced content photo (see cd-1 in
        // domain/habitContent.js) as its catalog hero.
        image: "url('/blackout.jpeg')",
        justification:
          'Temperature and light are two of the strongest signals your brain uses to time sleep. A few small changes can outperform a lot of willpower.',
        evidence:
          'A cooler room and a darker room are two of the most consistently cited environmental factors for falling and staying asleep.',
        expectation:
          'This is a one-time setup, not a daily task — once the room is right, there’s nothing left to remember to do.',
        tiers: [
          { label: 'One change' },
          { label: 'A couple changes' },
          { label: 'A full sleep setup' },
        ],
      },
    ],
  },
  stress: {
    categoryLabel: 'Stress Management',
    gradient: 'linear-gradient(160deg, #004620 0%, #001a0c 100%)',
    habits: [
      {
        id: 'five-minute-breathing',
        title: 'Breathing exercise',
        subtitle: 'Same time each day, so it becomes automatic.',
        image: "url('/Large-D14-c2932545e122447c991f1ae89aa54cca.webp')",
        justification:
          'Slow, deliberate breathing is one of the few things that measurably calms your nervous system in real time.',
        evidence:
          'Slowing your breathing rate is one of the few stress-response changes you can trigger on command, rather than waiting for it to pass on its own.',
        expectation:
          'The first sessions might feel like nothing’s happening. The calming effect tends to show up faster once it’s a familiar routine, not a new task.',
        tiers: [{ label: '2 minutes' }, { label: '5 minutes' }, { label: '10 minutes' }],
      },
      {
        id: 'outdoor-break',
        title: 'Outdoor break',
        subtitle: 'Away from a screen, wherever that is for you.',
        // Reuses this habit's own sourced content photo (see ob-1 in
        // domain/habitContent.js) as its catalog hero.
        image: "url('/VWH-GettyImages-2180466138-b3e669618a084939b352a9ac417bfaa3.webp')",
        justification:
          'Stepping outside — light, air, a change of scenery — interrupts a stress spiral more reliably than trying to think your way out of it.',
        evidence:
          'A change of environment is often more effective at breaking a stress spiral than trying to reason your way out of it in the same spot.',
        expectation:
          'Doesn’t need to be long or far — a few minutes outside, away from the screen that had you stressed, is the whole point.',
        tiers: [{ label: '5 minutes' }, { label: '10 minutes' }, { label: '20 minutes' }],
      },
      {
        id: 'evening-journal',
        title: 'Evening journal',
        subtitle: 'Not a diary — just a few lines.',
        // Reuses this habit's own sourced content photo (see ej-1 in
        // domain/habitContent.js) as its catalog hero.
        image: "url('/GettyImages-1063024656-480380748f1f4c2baa262b9d69507351.webp')",
        justification:
          'Naming a few things from the day, good or bad, gives your brain permission to stop replaying it.',
        evidence:
          'Writing something down tends to close it out mentally in a way that just thinking about it doesn’t — it moves it out of the loop in your head.',
        expectation:
          'A few lines, most nights — not a journaling practice. Some nights there won’t be much to say, and that’s fine.',
        tiers: [
          { label: '1–2 lines' },
          { label: 'A few lines' },
          { label: 'A full page' },
        ],
      },
    ],
  },
  social: {
    categoryLabel: 'Social Connection',
    gradient: 'linear-gradient(160deg, #FF9CFF 0%, #4a1a45 100%)',
    habits: [
      {
        id: 'text-a-friend',
        title: 'Check in with a friend',
        subtitle: 'No agenda — just a hello.',
        justification:
          'Connection compounds. A short, low-effort check-in keeps a relationship warm without needing to plan a whole hangout.',
        evidence:
          'Regular, low-effort contact tends to sustain relationships just as well as occasional big gestures — frequency matters more than size.',
        expectation:
          'A quick message, no reply required same-day. It should take less time than deciding what to say.',
        tiers: [{ label: 'Weekly' }, { label: 'A few times a week' }, { label: 'Daily' }],
        image: "url('/475689837-56b7508c5f9b5829f8384123.webp')",
      },
      {
        id: 'plan-a-call',
        title: 'Plan time with family',
        subtitle: 'Put it on the calendar, not just the to-do list.',
        justification:
          'Intentions to "catch up sometime" rarely happen. Scheduling it, even loosely, is what turns it into something real.',
        evidence:
          '"Sometime" is one of the least reliable plans there is — a specific time on a calendar shows up far more often than a good intention does.',
        expectation:
          'The scheduling itself is the habit — the call or visit will follow naturally once it has a slot.',
        tiers: [
          { label: 'Monthly' },
          { label: 'Every couple weeks' },
          { label: 'Weekly' },
        ],
        image: "url('/GettyImages-1176848423-8af4d372737944f485c9fe6f82ac78df.webp')",
      },
      {
        id: 'join-group-activity',
        title: 'Join a group activity',
        subtitle: 'A class, a league, a club — anything recurring.',
        justification:
          'Recurring group activities build social connection on autopilot, without needing to organize something new every time.',
        evidence:
          'A standing commitment removes the need to plan anything new each time — the connection happens as a side effect of just showing up.',
        expectation:
          'The first session or two might feel like showing up somewhere new. That fades once it’s a regular fixture on your week.',
        tiers: [{ label: 'One-time' }, { label: 'Monthly' }, { label: 'Weekly' }],
        image: "url('/GettyImages-1311247736-2e9719c1e2424dda85dc362ab66e1d17.webp')",
      },
    ],
  },
}

// The CSS `background-image` value to use for a given habit's card/
// thumbnail — its own `image` (a real photo) when it has one, falling back
// to its pillar's placeholder `gradient` otherwise. Every card/thumbnail
// that shows a habit should read through this instead of reaching for
// `.gradient` directly, so real photos show up automatically as more
// habits get one.
export function getHabitVisual(pillarId, habitId) {
  const pillar = RECOMMENDATIONS_BY_PILLAR[pillarId]
  if (!pillar) return null
  const habit = pillar.habits.find((h) => h.id === habitId)
  return habit?.image || pillar.gradient
}

// Suggests a starting tier (index into a habit's `tiers` array) based on how
// many "already working" options the user picked for this pillar during
// onboarding — a rough proxy for how active they already are in this area.
// More signal there nudges the default toward a more ambitious tier instead
// of always defaulting to the gentlest one.
export function suggestTierIndex(pillarId, answers, tierCount) {
  const selections = (answers.habitsWorking?.[pillarId] || []).filter(
    (id) => id !== NONE_OPTION.id,
  )
  const maxIndex = tierCount - 1
  if (selections.length >= 3) return maxIndex
  if (selections.length >= 1) return Math.min(1, maxIndex)
  return 0
}

// Quick-pick moments for habit stacking, alongside the option to set an
// exact time instead.
export const STACK_PRESETS = [
  'After breakfast',
  'After lunch',
  'After dinner',
  'In the evening',
  'First thing in the morning',
  'Before bed',
]


// Per-habit "when will you do it?" config, so habit settings sync to the
// habit: some are time-of-day ("consistent wake-up time"), most are anchored
// to an existing moment ("after breakfast / lunch / dinner"). mode 'time'
// shows a time picker; mode 'anchor' shows these preset moments. Anything
// not listed falls back to the time picker.
export const WHEN_BY_HABIT = {
  'extra-veg-dinner': { mode: 'anchor', options: ['At breakfast', 'At lunch', 'At dinner'] },
  'prep-lunch-tonight': { mode: 'anchor', options: ['After dinner', 'In the evening', 'Before bed'] },
  'swap-snack-fruit': { mode: 'anchor', options: ['Morning snack', 'Afternoon snack', 'Whenever you snack'] },
  'high-fiber-breakfast': { mode: 'anchor', options: ['At breakfast', 'Mid-morning'] },
  'water-on-waking': { mode: 'anchor', options: ['When you wake up', 'Before coffee', 'First thing'] },
  'morning-stretch': { mode: 'anchor', options: ['When you wake up', 'Before breakfast'] },
  'walk-after-meal': { mode: 'anchor', options: ['After breakfast', 'After lunch', 'After dinner'] },
  'chair-stands-after-breakfast': { mode: 'anchor', options: ['After breakfast', 'Mid-morning', 'While the kettle boils'] },
  'consistent-wake-time': { mode: 'time' },
  'no-screens-before-bed': { mode: 'anchor', options: ['30 min before bed', 'An hour before bed', 'After dinner'] },
  'cool-dark-room': { mode: 'anchor', options: ['At bedtime', 'Before bed'] },
  'five-minute-breathing': { mode: 'time' },
  'outdoor-break': { mode: 'anchor', options: ['Mid-morning', 'Lunch break', 'Mid-afternoon'] },
  'evening-journal': { mode: 'anchor', options: ['After dinner', 'Before bed', 'In the evening'] },
  'text-a-friend': { mode: 'anchor', options: ['In the morning', 'At lunch', 'In the evening'] },
  'plan-a-call': { mode: 'anchor', options: ['This weekend', 'A weekday evening', 'Sunday'] },
  'join-group-activity': { mode: 'anchor', options: ['This week', 'This weekend', 'Next week'] },
}

export function getHabitWhen(id) {
  return WHEN_BY_HABIT[id] || { mode: 'time' }
}
