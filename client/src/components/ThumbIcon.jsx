// Thumb up / thumb down for content feedback. One path, flipped via a
// transform for the "down" case rather than a second hand-drawn glyph —
// same reasoning as HeartIcon.jsx: a mirrored copy of the identical shape
// keeps the two buttons visually matched, where two separately drawn
// glyphs drift. `filled` fills the shape in on the active state; the
// outline is always stroked so the icon holds its silhouette either way.
function ThumbIcon({ direction = 'up', filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      style={{
        display: 'block',
        transform: direction === 'down' ? 'rotate(180deg)' : undefined,
      }}
    >
      <path
        d="M7 10.5v9.2H4.6c-.9 0-1.6-.7-1.6-1.6v-6c0-.9.7-1.6 1.6-1.6H7Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.5 12 3.3c1.4 0 2.4 1.1 2.4 2.5v3.3h4.1c1.3 0 2.2 1.2 1.9 2.4l-1.5 6.3c-.2 1-1.1 1.7-2.1 1.7H7"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default ThumbIcon
