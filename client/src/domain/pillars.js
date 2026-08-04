// Canonical list of the 5 pillars of health every habit is tagged with.
// This is the single source of truth for pillar ids/labels — the
// onboarding flow (pages/onboarding/pillars.js) layers its own copy
// (headlines, intake options) on top of these rather than redefining them.
//
// A 6th pillar, "Moderation" (a soft framing of the American College of
// Lifestyle Medicine's "avoidance of risky substances"), was added and then
// removed — the app isn't tackling that area for now. Re-add it here (and
// in onboarding/pillars.js + recommendedHabits.js) if that changes.
export const PILLARS_CANONICAL = [
  { id: 'eating', label: 'Eating' },
  { id: 'moving', label: 'Moving' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'stress', label: 'Stress' },
  { id: 'social', label: 'Social' },
]

export function getPillarLabel(pillarId) {
  return PILLARS_CANONICAL.find((p) => p.id === pillarId)?.label
}
