// Checkbox glyph for the Today page's "Habits I own" list. Draws the box
// and the tick as one icon so the checked state is a single element
// swapping fill, rather than a box with a separately positioned tick that
// has to be kept aligned. `checked` fills the box and shows the tick.
function CheckIcon({ checked }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.5"
        fill={checked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
      {checked && (
        <path
          d="m7.5 12.4 3.1 3.1 5.9-6.4"
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
