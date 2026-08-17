// Time-of-day phrasing for the Today page's content heading. The section
// used to be hardcoded as "New for you tonight", which read as wrong for
// anyone opening the app over breakfast — the pick itself rotates per
// visit, so the label should follow the clock the same way.
//
// Boundaries are deliberately coarse (noon and 5pm) rather than tied to
// sunrise/sunset: this is copy, not a scheduler, and a wrong-by-an-hour
// "afternoon" reads fine where a wrong-by-an-hour "tonight" doesn't.
// To collapse this back to a single daytime word, return 'today' for both
// the morning and afternoon branches — the callers don't care how many
// distinct strings this produces.
export function getTimeOfDay(now = new Date()) {
  const hour = now.getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}

const NEW_FOR_YOU_SUFFIX = {
  morning: 'this morning',
  afternoon: 'this afternoon',
  evening: 'tonight',
}

export function getNewForYouHeading(now = new Date()) {
  return `New for you ${NEW_FOR_YOU_SUFFIX[getTimeOfDay(now)]}`
}

// Second person, used by the owned-habits checklist ("Did you do these
// today?" reads the same all day, but the affirmation after finishing
// them shouldn't say "today" at 11pm and "today" at 6am in the same tone).
export function getDayWord(now = new Date()) {
  return getTimeOfDay(now) === 'evening' ? 'today' : 'so far today'
}
