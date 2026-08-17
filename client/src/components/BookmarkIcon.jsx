// Save-for-later glyph, used by the Today feed's content cards. Distinct
// from HeartIcon on purpose: the heart reads as "I like this" (which the
// feed now expresses with an actual thumbs-up), so the action that files
// an article away to the Learn tab gets the bookmark instead. Both write
// to the same FavoritesContext store — the difference is which affordance
// the surface shows, not what it means underneath.
function BookmarkIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <path
        d="M6.5 3.75h11c.55 0 1 .45 1 1v15.1l-6.5-4.35-6.5 4.35V4.75c0-.55.45-1 1-1Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default BookmarkIcon
