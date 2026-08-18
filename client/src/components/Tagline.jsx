import './Tagline.css'

// The brand line, kept in one place so the wording can't drift between the
// screens that show it. Rendered as a quiet end-of-scroll sign-off at the
// bottom of every tab (mounted once in AppLayout, after <Outlet />) and as
// the closing beat of onboarding — deliberately not in the header, where it
// would compete with the per-tab headline on every single screen.
//
// The same words also appear on the landing screen (Onboarding.jsx, styled
// as display type over the hero photo) and in the browser tab title; both
// are one-offs with their own type treatment, so they don't route through
// this component.
export const TAGLINE = 'Living well to live better.'

function Tagline({ className = '' }) {
  return <p className={`tagline ${className}`.trim()}>{TAGLINE}</p>
}

export default Tagline
