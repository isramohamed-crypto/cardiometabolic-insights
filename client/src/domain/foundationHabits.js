import { PILLARS, NON_HABIT_OPTION_IDS } from '../pages/onboarding/pillars.js'

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
      .map((option) => ({
        key: `${pillar.id}:${option.id}`,
        label: option.label,
        pillarId: pillar.id,
        pillarLabel: pillar.label,
      }))
  })
}
