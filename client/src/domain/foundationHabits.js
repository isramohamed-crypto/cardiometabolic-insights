import { PILLARS, NON_HABIT_OPTION_IDS } from '../pages/onboarding/pillars.js'
import { getHabitVisual } from '../pages/onboarding/recommendedHabits.js'

// A "brought with you" onboarding option has no catalog habitId of its own,
// but several describe the same real thing a catalog habit does, just in the
// visitor's own words from intake. Where that overlap is clear (the same
// activity, not merely adjacent), this borrows that catalog habit's
// already-sourced photo rather than showing a flat gradient for something
// that really does have a photo elsewhere in the app.
//
// Deliberately NOT exhaustive: several options don't correspond to any one
// catalog habit closely enough to borrow from in good conscience, so those
// keep the pillar gradient. Keyed `${pillarId}:${optionId}` since option ids
// are only unique within a pillar.
//
// Lived in Collection.jsx until the Today page's "Habits I own" cards needed
// the same lookup — two copies of this would have drifted the first time
// either surface gained a photo.
export const FOUNDATION_CATALOG_MATCH = {
  'eating:more-veggies': 'extra-veg-dinner',
  'eating:meal-prepping': 'prep-lunch-tonight',
  'eating:drinking-water': 'water-on-waking',
  'moving:daily-walks': 'walk-after-meal',
  'moving:stretching-yoga': 'morning-stretch',
  'sleep:wind-down-routine': 'no-screens-before-bed',
  'sleep:limiting-screens': 'no-screens-before-bed',
  'sleep:sleep-environment': 'cool-dark-room',
  'sleep:cool-dark-room': 'cool-dark-room',
  'stress:meditation-breathing': 'five-minute-breathing',
  'stress:journaling': 'evening-journal',
  'stress:time-in-nature': 'outdoor-break',
  'stress:taking-breaks': 'outdoor-break',
}

// A few foundation options match no catalog habit at all but still got a
// real photo picked out for them directly — same treatment, just a straight
// image instead of a borrowed catalog id.
export const FOUNDATION_IMAGE_OVERRIDES = {
  'eating:cooking-at-home':
    "url('/231644-Chicken-Souvlaki-with-Tzatziki-Sauce-3x4-0725-d6573d70f50d4e4aa2dd85c2c49ad731.webp')",
  'moving:taking-stairs':
    "url('/Stocksy_txpca07dfbdemz200_Medium_3690248-crop-95b70ea20d7d4249a434d08cdcd0ead4.webp')",
  // Cropped down from the original — that file is a "How to Cast a Happiness
  // Spell on Yourself" article banner with its own headline text baked in,
  // which would have shown through on the card. This keeps just the photo.
  'stress:clears-your-head':
    "url('/Happiness-Spell-SF-bdc7515eab884208b677509e199ba6af-crop.webp')",
}

// The background for one foundation row: its own override photo, else the
// photo of the catalog habit it matches, else that pillar's flat gradient
// (getHabitVisual falls back to the gradient whenever the habit id misses,
// which is exactly what an unmatched foundation option does).
export function getFoundationVisual(row) {
  return row.image || getHabitVisual(row.pillarId, row.catalogId)
}

// Turns onboarding's `habitsWorking` answers into flat rows — the habits
// the visitor already owns, in their own words from intake.
//
// Collection.jsx has its own richer version of this walk (it also resolves
// a photo per row for its image cards); this is the plain-text shape the
// Today page's checklist needs, so it deliberately stays separate rather
// than making that one carry an unused-image mode. Filtering here uses the
// full NON_HABIT_OPTION_IDS list — "Skip", "Something else" and "None of
// these" are answers, not habits, and none of them belongs in a list you
// tick off as done.
export function listFoundationHabits(habitsWorking = {}) {
  return PILLARS.flatMap((pillar) => {
    const selected = (habitsWorking[pillar.id] || []).filter(
      (id) => !NON_HABIT_OPTION_IDS.includes(id),
    )
    return pillar.options
      .filter((option) => selected.includes(option.id))
      .map((option) => {
        const matchKey = `${pillar.id}:${option.id}`
        return {
          key: matchKey,
          label: option.label,
          pillarId: pillar.id,
          pillarLabel: pillar.label,
          catalogId: FOUNDATION_CATALOG_MATCH[matchKey],
          image: FOUNDATION_IMAGE_OVERRIDES[matchKey],
        }
      })
  })
}
