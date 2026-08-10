// Real, sourced "why this one" content — a richer alternative to
// WhyThisMattersTray's generic justification/evidence/expectation pages
// (recommendedHabits.js), branded to a real publisher and laid out as its
// own full-screen sequence instead of a bottom tray (see WhyCarousel.jsx).
//
// Two tiers, checked in order by getWhyCarouselContent below:
//   1. WHY_CAROUSEL_CONTENT — hand-authored overrides, for the rare habit
//      with a real design reference to match (currently just
//      walk-after-meal, built from the actual Figma/mockup screens).
//   2. buildWhyCarouselFromContentPool — every other habit gets the same
//      carousel *format* generated straight from its CONTENT_POOL entries
//      (domain/habitContent.js), the same real sourced content
//      HabitDetail's "Did you know?" and the Read tab already use. Page 1
//      is always the first pool item's short teaser (`body`); every page
//      after works through that item's `fullBody` (the "main content",
//      once read past the teaser) and then any further pool items in
//      order, capped at 3 pages total.
// Habits with no CONTENT_POOL entry at all (as of this pass: plan-a-call,
// join-group-activity — see habitContent.js's own notes on why) fall all
// the way back to WhyThisMattersTray instead (see Recommendations.jsx and
// AddHabitFlow.jsx, which call getWhyCarouselContent and render the old
// tray when it returns null).
//
// Shape, for both tiers: `brand` and `footer` apply to the whole sequence
// (one publisher, one byline — only the hand-authored tier sets `footer`,
// since the content pool doesn't carry reviewer/byline metadata). Each
// screen entry:
//   - `heading` / `body` — required.
//   - `image` — only the first screen ever has one, a real photo instead
//     of a flat gradient.
//   - `highlight` — the bold pull-quote box under the body, when present
//     (hand-authored tier only — the content pool has no equivalent
//     field to pull one from).
// The last screen gets a "Reviewed by / Updated" byline instead of a Next
// button when `footer` is set (rendered only on the final screen).
// Default medical reviewer stamp, replicated onto every "why this one"
// piece that doesn't carry its own reviewer metadata (the content pool
// doesn't). Reuses an existing reviewer/photo so the stamp is consistent.
export const DEFAULT_REVIEWER = {
  reviewer: 'Lisa Valente, M.S., RD',
  avatar: "url('/why-daily-walk-reviewer.jpg')",
  updated: 'December 8, 2025',
}

export const WHY_CAROUSEL_CONTENT = {
  'walk-after-meal': {
    brand: 'EatingWell',
    footer: {
      reviewer: 'Lisa Valente, M.S., RD',
      avatar: "url('/why-daily-walk-reviewer.jpg')",
      updated: 'December 8, 2025',
    },
    screens: [
      {
        image: "url('/why-daily-walk-hero.jpg')",
        heading: 'Why this one',
        body: "A ten-minute walk after dinner helps steady your blood sugar at the time of day it climbs most. It's the smallest change with the clearest payoff — and dinner already happens every day. It's also one of the clearest things you can do for your heart.",
      },
      {
        heading: 'What the evidence says',
        body: "Moving soon after you eat lets your muscles use some of the sugar from the meal while it's still arriving. The effect is modest and best-studied in people watching their blood sugar — but it costs ten minutes, and any amount helps.",
        highlight: 'Ten minutes, right after — the timing does most of the work.',
      },
      {
        heading: 'What to expect',
        body: "The first week, it's an errand. Somewhere in the second, it starts to feel like how dinner ends. Don't look for results yet — the only job this week is that the walk happens more evenings than it doesn't.",
        highlight: "Around the block counts. Pace doesn't matter.",
      },
    ],
  },
}

const MAX_SCREENS = 3

// Generic tier — see the header comment above. `contentPool` is passed in
// (rather than imported directly) so this stays a plain function callers
// can test/reason about without needing domain/habitContent.js's full
// import graph; in practice callers always pass CONTENT_POOL itself.
export function buildWhyCarouselFromContentPool(habitId, contentPool) {
  const pool = contentPool[habitId]
  if (!pool || pool.length === 0) return null

  const [first, ...rest] = pool

  // Page 1 is always the first pool item's short teaser, image and all —
  // never its fullBody, even if one exists, since the teaser is
  // specifically what page 1 is for.
  const screens = [
    {
      image: first.image,
      heading: 'Why this one',
      body: first.body,
    },
  ]

  // Then work through whatever fuller content actually exists: the same
  // first item's fullBody (reading past the teaser into the main piece),
  // then any further pool items in order — each contributing one screen,
  // using its own fullBody once there's more than just a teaser to show.
  if (first.fullBody) {
    screens.push({ heading: first.title, body: first.fullBody })
  }
  for (const item of rest) {
    if (screens.length >= MAX_SCREENS) break
    screens.push({ heading: item.title, body: item.fullBody || item.body })
  }

  return {
    brand: first.brand,
    footer: DEFAULT_REVIEWER,
    screens: screens.slice(0, MAX_SCREENS),
  }
}

// Single entry point callers actually use — checks the hand-authored
// override first, falls back to generating one from the content pool,
// and returns null (meaning "use WhyThisMattersTray instead") only when
// neither exists for this habit.
export function getWhyCarouselContent(habitId, contentPool) {
  return WHY_CAROUSEL_CONTENT[habitId] || buildWhyCarouselFromContentPool(habitId, contentPool)
}
