// Maps each pillar id to its ACLM pillar icon under public/"ACLM Logos"/
// (client/public/ACLM Logos/<pillar-slug>.svg). Same lookup-table pattern
// as domain/brandLogos.js.
//
// These are the American College of Lifestyle Medicine's own two-tone
// pillar icons — a colored shield/hexagon shape with a white detail
// overlay on top, not a flat currentColor-compatible silhouette like
// components/AclmMarkPlaceholder.jsx (the placeholder mark this replaces).
// See QuestionScreen.jsx for how that difference is handled: the
// "current" progress step renders one of these via a plain <img>
// (showing its real colors as-is), while "completed"/"upcoming" steps
// render a CSS mask silhouette instead (recoloring it flat to match the
// dot's own state color, the same way the placeholder mark did).
//
// IMPORTANT — licensing flag: these specific SVG files were not sourced
// or vetted by me. They appeared directly in client/public/ACLM Logos/
// (added by someone on the team, not through any change I made), and
// ACLM's own published usage policy —
// https://lifestylemedicine.zendesk.com/hc/en-us/articles/32762262901147-Can-I-use-the-ACLM-logo
// — states the ACLM logo may not be used anywhere without ACLM's
// explicit written permission. Confirm that permission is actually in
// hand before shipping this to production; if it isn't, swap
// QuestionScreen.jsx's progressIcons usage back out (or just don't pass
// the prop) to fall back to AclmMarkPlaceholder instead.
const RAW_PATHS = {
  eating: '/ACLM Logos/optimal-nutrition.svg',
  moving: '/ACLM Logos/physical-activity.svg',
  sleep: '/ACLM Logos/restorative-sleep.svg',
  stress: '/ACLM Logos/stress-management.svg',
  social: '/ACLM Logos/connectedness.svg',
}

// encodeURI escapes the literal space in "ACLM Logos" (to %20) and leaves
// the rest of the path untouched — exactly what a valid <img src>/
// mask-image url() pointing at one of these public/ assets needs.
export const ACLM_ICONS = Object.fromEntries(
  Object.entries(RAW_PATHS).map(([pillarId, path]) => [pillarId, encodeURI(path)]),
)

export function getAclmIcon(pillarId) {
  return ACLM_ICONS[pillarId] || null
}
