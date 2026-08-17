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

// A photo for every intake option, so no owned-habit card ever falls back to
// a flat pillar gradient. Each was picked by looking at the actual image, not
// by trusting the filename — several of these files are named after the
// article they were shot for rather than what's in them.
//
// A few images are deliberately used twice (both "dark room" options share
// the blackout shot) where two options describe the same thing. Anything
// added to the intake lists in pages/onboarding/pillars.js needs an entry
// here too, or its card goes back to a gradient.
export const FOUNDATION_IMAGE_OVERRIDES = {
  // Eating
  'eating:more-veggies': "url('/eatmoreveg.webp')",
  'eating:cooking-at-home':
    "url('/231644-Chicken-Souvlaki-with-Tzatziki-Sauce-3x4-0725-d6573d70f50d4e4aa2dd85c2c49ad731.webp')",
  'eating:meal-prepping':
    "url('/Simply-Recipes-Breakfast-Sausage-Casserole-LEAD-02-a624b086ff204be79482018b2c0ccb24.webp')",
  'eating:drinking-water':
    "url('/RDs-Reveal-Whether-Drinking-Water-Earlier-in-the-Day-Matters--b91c3b8a51594e8facdde85360cae4ca.webp')",
  'eating:balanced-meals': "url('/myrecipes-hero.webp')",
  'eating:mindful-eating':
    "url('/Simply-Recipes-Zucchini-Fritters-LEAD-2-59a39677d51a475c90ee6a881f73af45.webp')",

  // Moving
  'moving:daily-walks': "url('/why-daily-walk-hero.jpg')",
  'moving:strength-training':
    "url('/shp-fitness-awards-activewear-jthompson-8472-6d4068131e6b463fb75e0ed9583c0287.webp')",
  'moving:stretching-yoga':
    "url('/DailyStretchingRoutine_ChildsPosecopy-e3cf0bc261be4393929c5aab356703c4.webp')",
  'moving:taking-stairs':
    "url('/Stocksy_txpca07dfbdemz200_Medium_3690248-crop-95b70ea20d7d4249a434d08cdcd0ead4.webp')",
  'moving:recreational-sports': "url('/OTW-group.jpg')",
  'moving:moving-at-work': "url('/athomeexercise-8c66be2605b9466e99b20d830a93ae5b.webp')",

  // Sleep
  'sleep:consistent-bedtime':
    "url('/30-days-to-better-sleep-3973920_v21-3c0ce2cc1f8149c58242946ac704fa8d.webp')",
  'sleep:enough-hours':
    "url('/Parents-Sleep-Package-1-182005bddc24436db64bd202615637d0.webp')",
  'sleep:wind-down-routine':
    "url('/spr-hatch-restore-3-julia-fields-1-04d85cf2d619456b9a7d0696ea73aae4.webp')",
  // Space in the filename, so it's percent-encoded here — a raw space in a
  // CSS url() silently fails to load.
  'sleep:limiting-screens': "url('/VeryWell%20Mind%20Skin%20Scroll.jpg')",
  'sleep:sleep-environment': "url('/blackout.jpeg')",
  'sleep:cool-dark-room': "url('/blackout.jpeg')",

  // Stress
  'stress:meditation-breathing':
    "url('/MoMoProductions-1821169611-0ff05f9430e046a386a5a4fd54568dd5.webp')",
  'stress:journaling':
    "url('/GettyImages-1063024656-480380748f1f4c2baa262b9d69507351.webp')",
  'stress:time-in-nature': "url('/forest.jpg')",
  'stress:taking-breaks':
    "url('/GettyImages-1411629770-e36348de196b4a2fbcac20b37d3b1f2e.webp')",
  'stress:talking-it-out':
    "url('/QuestionstoAsk-01-df6c8ace8d1e4477900cebd3f9433ff8.webp')",
  // Cropped down from the original — that file is a "How to Cast a Happiness
  // Spell on Yourself" article banner with its own headline text baked in,
  // which would have shown through on the card. This keeps just the photo.
  'stress:clears-your-head':
    "url('/Happiness-Spell-SF-bdc7515eab884208b677509e199ba6af-crop.webp')",
  'stress:few-minutes-destress':
    "url('/GettyImages-1477424646-dc1d4fd307a74cca920b9d326d320540.webp')",
  'stress:decluttering': "url('/house-interior.jpg')",
  'stress:calendar-control': "url('/primary-643d863793a04e78bdb81c2aa012bc55.webp')",
  'stress:daily-laugh':
    "url('/GettyImages-1311247736-2e9719c1e2424dda85dc362ab66e1d17.webp')",

  // Social
  'social:time-with-friends':
    "url('/GettyImages-1176848423-8af4d372737944f485c9fe6f82ac78df.webp')",
  'social:community-groups':
    "url('/Stocksy_txp554d7ed2K41300_Medium_3569310-crop-153db7067f034652972849d79ee5a2ef.webp')",
  'social:staying-in-touch': "url('/475689837-56b7508c5f9b5829f8384123.webp')",
  'social:volunteering':
    "url('/GettyImages-2177586029-520077efb4034740baa49a79d378e4d0.webp')",
  'social:quality-time': "url('/bhg-hero.jpg')",
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
