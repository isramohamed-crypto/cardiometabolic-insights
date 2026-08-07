// Single heart glyph shared by every favorite/save toggle in the app
// (ContentCard, ContentModal). Previously each toggle swapped between the
// ♥ and ♡ text glyphs for filled/outline — those are two different
// characters with two different shapes in most fonts (♡ noticeably
// narrower and pointier than ♥), so the icon visibly changed shape on
// every toggle instead of just filling in. This renders the exact same
// <path> both times; only the fill (and stroke color, via `color` /
// currentColor, same as the text glyphs it replaces) changes.
function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M12 21s-7.5-4.6-10-9.2C0.4 8.6 1.8 5 5.4 4.2 8 3.6 10.4 5 12 7.2 13.6 5 16 3.6 18.6 4.2 22.2 5 23.6 8.6 22 11.8 19.5 16.4 12 21 12 21Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default HeartIcon
