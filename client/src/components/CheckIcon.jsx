// Tick glyph for the Today page's "Habits I own" list. A circle rather
// than a checkbox square, and it sits at the trailing edge of each row —
// both deliberate: a column of square boxes down the left edge reads as
// an unfinished to-do list, where a trailing circle reads as confirming
// something that's already true. Draws the ring and the tick as one icon
// so the checked state is a single element swapping fill, rather than a
// box with a separately positioned tick to keep aligned.
function CheckIcon({ checked }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={checked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {checked && (
        <path
          d="m7.8 12.3 3 3 5.4-6"
          fill="none"
          stroke="#fff"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

export default CheckIcon
