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
// Each habit's `image` is a CSS gradient stand-in, not a real photo — no
// photography asset pipeline exists yet. Swap `image` for a real photo URL
// per habit once that's sourced; nothing else about the card needs to
// change.
export const RECOMMENDATIONS_BY_PILLAR = {
  eating: {
    categoryLabel: 'Nutrition',
    gradient: 'linear-gradient(160deg, #FF8C2F 0%, #7a4a10 100%)',
    habits: [
      {
        id: 'extra-veg-dinner',
        title: 'Add a serving of vegetables',
        subtitle: 'Bulk up a meal a day with extra veggies — how often is up to you.',
        justification:
          'Most of us fall short on vegetables at meals we already sit down for. Adding more crowds out less balanced choices without it feeling like a diet.',
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
        justification:
          'Small, sustainable swaps beat strict rules. Trading a snack keeps the change realistic enough to actually stick.',
        tiers: [
          { label: 'A few times a week' },
          { label: 'Most days' },
          { label: 'Every day' },
        ],
      },
    ],
  },
  moving: {
    categoryLabel: 'Physical activity',
    gradient: 'linear-gradient(160deg, #00B9E2 0%, #063a52 100%)',
    habits: [
      {
        id: 'walk-after-meal',
        title: 'Short walk after meals',
        subtitle: 'Timing and length are up to you.',
        justification:
          'A short walk after eating helps steady your blood sugar right when it tends to climb. It’s a small change that stacks onto something you’re already doing.',
        tiers: [{ label: '5 minutes' }, { label: '15 minutes' }, { label: '30 minutes' }],
      },
      {
        id: 'two-strength-sessions',
        title: 'Strength training',
        subtitle: 'A couple of sessions a week, at whatever length works for you.',
        justification:
          'You don’t need an hour or a gym. A little strength training goes a long way for everyday energy and mobility.',
        tiers: [
          { label: '1 session a week' },
          { label: '2 sessions a week' },
          { label: '3+ sessions a week' },
        ],
      },
      {
        id: 'morning-stretch',
        title: 'Morning stretch',
        subtitle: 'Right when you wake up, before anything else.',
        justification:
          'Stacking it onto waking up — before coffee, before your phone — is what makes a stretch routine actually survive past week one.',
        tiers: [{ label: '2 minutes' }, { label: '5 minutes' }, { label: '10 minutes' }],
      },
    ],
  },
  sleep: {
    categoryLabel: 'Sleep',
    gradient: 'linear-gradient(160deg, #B676E7 0%, #2e1a42 100%)',
    habits: [
      {
        id: 'consistent-wake-time',
        title: 'Consistent wake-up time',
        subtitle: 'Even on weekends — it’s the anchor your sleep needs.',
        justification:
          'Your body clock responds far more to a consistent wake time than a consistent bedtime. Anchoring one end of the night makes the rest fall into place.',
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
        justification:
          'It’s less about blue light and more about what scrolling does to a winding-down mind. Any other low-stimulation activity works just as well.',
        tiers: [{ label: '15 minutes' }, { label: '30 minutes' }, { label: '60 minutes' }],
      },
      {
        id: 'cool-dark-room',
        title: 'A cooler, darker room',
        subtitle: 'Small environment changes, big effect on sleep quality.',
        justification:
          'Temperature and light are two of the strongest signals your brain uses to time sleep. A few small changes can outperform a lot of willpower.',
        tiers: [
          { label: 'One change' },
          { label: 'A couple changes' },
          { label: 'A full sleep setup' },
        ],
      },
    ],
  },
  stress: {
    categoryLabel: 'Stress',
    gradient: 'linear-gradient(160deg, #004620 0%, #001a0c 100%)',
    habits: [
      {
        id: 'five-minute-breathing',
        title: 'Breathing exercise',
        subtitle: 'Same time each day, so it becomes automatic.',
        justification:
          'Slow, deliberate breathing is one of the few things that measurably calms your nervous system in real time.',
        tiers: [{ label: '2 minutes' }, { label: '5 minutes' }, { label: '10 minutes' }],
      },
      {
        id: 'outdoor-break',
        title: 'Outdoor break',
        subtitle: 'Away from a screen, wherever that is for you.',
        justification:
          'Stepping outside — light, air, a change of scenery — interrupts a stress spiral more reliably than trying to think your way out of it.',
        tiers: [{ label: '5 minutes' }, { label: '10 minutes' }, { label: '20 minutes' }],
      },
      {
        id: 'evening-journal',
        title: 'Evening journal',
        subtitle: 'Not a diary — just a few lines.',
        justification:
          'Naming a few things from the day, good or bad, gives your brain permission to stop replaying it.',
        tiers: [
          { label: '1–2 lines' },
          { label: 'A few lines' },
          { label: 'A full page' },
        ],
      },
    ],
  },
  social: {
    categoryLabel: 'Social',
    gradient: 'linear-gradient(160deg, #FF9CFF 0%, #4a1a45 100%)',
    habits: [
      {
        id: 'text-a-friend',
        title: 'Check in with a friend',
        subtitle: 'No agenda — just a hello.',
        justification:
          'Connection compounds. A short, low-effort check-in keeps a relationship warm without needing to plan a whole hangout.',
        tiers: [{ label: 'Weekly' }, { label: 'A few times a week' }, { label: 'Daily' }],
      },
      {
        id: 'plan-a-call',
        title: 'Plan time with family',
        subtitle: 'Put it on the calendar, not just the to-do list.',
        justification:
          'Intentions to "catch up sometime" rarely happen. Scheduling it, even loosely, is what turns it into something real.',
        tiers: [
          { label: 'Monthly' },
          { label: 'Every couple weeks' },
          { label: 'Weekly' },
        ],
      },
      {
        id: 'join-group-activity',
        title: 'Join a group activity',
        subtitle: 'A class, a league, a club — anything recurring.',
        justification:
          'Recurring group activities build social connection on autopilot, without needing to organize something new every time.',
        tiers: [{ label: 'One-time' }, { label: 'Monthly' }, { label: 'Weekly' }],
      },
    ],
  },
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
  'First thing in the morning',
  'Before bed',
]
