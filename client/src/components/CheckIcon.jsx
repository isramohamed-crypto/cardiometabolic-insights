// Tick glyph for the Today page's "Habits I own" cards, drawn to pair with
// SkipIcon: same circle, same diameter, same stroke weight, and — like
// SkipIcon's dash — the tick is always drawn rather than appearing only once
// marked. An empty ring gave no clue what the button did until you pressed
// it. The tick strokes white when the circle is filled and currentColor when
// it isn't, so it reads either way.
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
      <path
        d="m7.9 12.2 2.9 2.9 5.3-5.9"
        fill="none"
        stroke={checked ? '#fff' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default CheckIcon
