// Real, sourced "why this one" content for habits that have it — a richer
// alternative to WhyThisMattersTray's generic justification/evidence/
// expectation pages (recommendedHabits.js), branded to a real publisher
// and laid out as its own full-screen sequence instead of a bottom tray
// (see WhyCarousel.jsx). Keyed by habit id; habits with no entry here just
// keep using WhyThisMattersTray as before (see Recommendations.jsx and
// AddHabitFlow.jsx, which check this lookup first).
//
// `brand` and `footer` apply to the whole sequence (one publisher, one
// byline). Each screen entry:
//   - `heading` / `body` — required.
//   - `image` — only the first screen has one, a real photo instead of a
//     flat gradient.
//   - `highlight` — the bold pull-quote box under the body, when present.
// The last screen also gets a "Reviewed by / Updated" byline instead of
// a Next button (see `footer` below, rendered only on the final screen).
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
