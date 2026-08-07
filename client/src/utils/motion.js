// Shared `prefers-reduced-motion` check. First written inline in
// AllSet.jsx for its CTA pop (left as-is there since it already shipped
// and verified); pulled out here now that HabitTrialPrompt's and
// AddHabitFlow's own celebratory beats need the identical guard — skip
// the animation-driven delay entirely, not just the animation itself,
// since there's nothing worth waiting on once it's suppressed by CSS.
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  )
}
