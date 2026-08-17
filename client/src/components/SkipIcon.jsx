// The "not today" counterpart to CheckIcon — same circle, same size, a dash
// instead of a tick. Drawn as a matching pair on purpose: the two controls
// sit side by side on the "Habits I own" cards, so any difference in ring
// weight or diameter between them reads as a mistake.
function SkipIcon({ marked }) {
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
        fill={marked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.2 12h7.6"
        fill="none"
        stroke={marked ? '#fff' : 'currentColor'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default SkipIcon
