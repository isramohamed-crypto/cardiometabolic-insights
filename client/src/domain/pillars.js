// Canonical list of the 5 pillars of health every habit is tagged with.
// This is the single source of truth for pillar ids/labels — the
// onboarding flow (pages/onboarding/pillars.js) layers its own copy
// (headlines, intake options) on top of these rather than redefining them.
//
// Labels now match the American College of Lifestyle Medicine's own
// wording for its six pillars of lifestyle medicine (lifestylemedicine.org/
// about-lifestyle-medicine/) — ids stay the plain lowercase words
// (eating/moving/sleep/stress/social) since those are load-bearing all
// over the app (route params, RECOMMENDATIONS_BY_PILLAR keys, demo profile
// data); only the user-facing label changed, so nothing else needed to
// move.
//
// A 6th pillar, "Moderation" (a soft framing of ACLM's "Risky Substance
// Avoidance"), was added and then removed — the app isn't tackling that
// area for now. Re-add it here (and in onboarding/pillars.js +
// recommendedHabits.js) if that changes.
export const PILLARS_CANONICAL = [
  { id: 'eating', label: 'Healthy eating' },
  { id: 'moving', label: 'Physical Activity' },
  { id: 'sleep', label: 'Restorative Sleep' },
  { id: 'stress', label: 'Stress Management' },
  { id: 'social', label: 'Social Connection' },
]

export function getPillarLabel(pillarId) {
  return PILLARS_CANONICAL.find((p) => p.id === pillarId)?.label
}
